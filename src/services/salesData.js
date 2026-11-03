const columnAliases = {
  Product_ID: ["product id", "product_id", "product-id", "sku", "item id"],
  Sale_Date: ["sale date", "sale_date", "date", "transaction date"],
  Sales_Rep: ["sales rep", "sales_rep", "salesperson", "sales person"],
  Region: ["region", "territory"],
  Sales_Amount: ["sales amount", "sales_amount", "amount", "revenue", "sales"],
  Quantity_Sold: ["quantity sold", "quantity_sold", "quantity", "units sold", "units"],
  Product_Category: ["product category", "product_category", "category"],
  Unit_Cost: ["unit cost", "unit_cost", "cost per unit"],
  Unit_Price: ["unit price", "unit_price", "price per unit"],
  Customer_Type: ["customer type", "customer_type", "customer segment", "segment"],
  Discount: ["discount", "discount rate"],
  Payment_Method: ["payment method", "payment_method", "payment"],
  Sales_Channel: ["sales channel", "sales_channel", "channel"]
};
const requiredColumns = Object.keys(columnAliases);
const normalizeHeader = (value) => String(value).replace(/^\uFEFF/, "").toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

export function parseCsvRows(csv) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const source = String(csv).replace(/^\uFEFF/, "");

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && source[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("Sales CSV contains an unclosed quoted field.");
  if (field.length || row.length) {
    row.push(field);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }
  return rows;
}

export function parseCsvTable(csv) {
  const [rawHeaders, ...records] = parseCsvRows(csv);
  if (!rawHeaders?.length || !records.length) throw new Error("CSV must contain a header row and at least one data row.");

  const headers = rawHeaders.map((header, index) => header.trim() || `Column ${index + 1}`);
  const counts = new Map();
  const uniqueHeaders = headers.map((header) => {
    const count = (counts.get(header) ?? 0) + 1;
    counts.set(header, count);
    return count === 1 ? header : `${header} (${count})`;
  });
  const rows = records.map((record, index) => {
    if (record.slice(rawHeaders.length).some((value) => value.trim() !== "")) throw new Error(`CSV row ${index + 2} has more values than the header row.`);
    return Object.fromEntries(uniqueHeaders.map((header, column) => [header, record[column]?.trim() ?? ""]));
  });
  return { headers: uniqueHeaders, rows };
}

function numericValue(value, column, rowNumber) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`Sales CSV row ${rowNumber} has an invalid ${column}.`);
  return number;
}

export function parseSalesCsv(csv) {
  const [headers, ...records] = parseCsvRows(csv);
  if (!headers) throw new Error("Sales CSV is empty.");

  const availablePositions = new Map(headers.map((header, index) => [normalizeHeader(header.trim()), index]));
  const positions = new Map(requiredColumns.map((column) => {
    const index = columnAliases[column].map(normalizeHeader).map((alias) => availablePositions.get(alias)).find((candidate) => candidate !== undefined);
    return [column, index];
  }));
  const missing = requiredColumns.filter((column) => positions.get(column) === undefined);
  if (missing.length) throw new Error(`Sales CSV is missing required columns: ${missing.join(", ")}.`);

  return records.map((record, index) => {
    const rowNumber = index + 2;
    const value = (column) => record[positions.get(column)]?.trim() ?? "";
    const date = value("Sale_Date");
    const parsedDate = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== date) {
      throw new Error(`Sales CSV row ${rowNumber} has an invalid Sale_Date.`);
    }

    const salesRep = value("Sales_Rep");
    const customerType = value("Customer_Type");
    if (!salesRep || !customerType) throw new Error(`Sales CSV row ${rowNumber} is missing a sales rep or customer type.`);

    return {
      id: `SALE-${String(index + 1).padStart(5, "0")}`,
      productId: value("Product_ID"),
      name: salesRep,
      salesRep,
      region: value("Region"),
      product: value("Product_Category"),
      plan: value("Product_Category"),
      category: value("Product_Category"),
      amount: numericValue(value("Sales_Amount"), "Sales_Amount", rowNumber),
      quantity: numericValue(value("Quantity_Sold"), "Quantity_Sold", rowNumber),
      unitCost: numericValue(value("Unit_Cost"), "Unit_Cost", rowNumber),
      unitPrice: numericValue(value("Unit_Price"), "Unit_Price", rowNumber),
      status: customerType,
      customerType,
      discount: numericValue(value("Discount"), "Discount", rowNumber),
      paymentMethod: value("Payment_Method"),
      channel: value("Sales_Channel"),
      date
    };
  });
}

export function filterTransactionsByDateRange(transactions, range) {
  if (range === "all") return transactions;
  const months = Number(range);
  if (!Number.isInteger(months) || months < 1 || transactions.length === 0) return transactions;

  const latestTimestamp = Math.max(...transactions.map((transaction) => Date.parse(`${transaction.date}T00:00:00Z`)));
  if (!Number.isFinite(latestTimestamp)) return transactions;
  const latest = new Date(latestTimestamp);
  const start = Date.UTC(latest.getUTCFullYear(), latest.getUTCMonth() - months + 1, 1);
  return transactions.filter((transaction) => Date.parse(`${transaction.date}T00:00:00Z`) >= start);
}

export function aggregateSales(transactions) {
  const sum = (rows, field) => rows.reduce((total, row) => total + row[field], 0);
  const by = (field) => {
    const groups = new Map();
    for (const transaction of transactions) {
      const key = transaction[field];
      const group = groups.get(key) ?? { name: key, revenue: 0, transactions: 0, units: 0, discount: 0 };
      group.revenue += transaction.amount;
      group.transactions += 1;
      group.units += transaction.quantity;
      group.discount += transaction.discount;
      groups.set(key, group);
    }
    return [...groups.values()].map((group) => ({
      ...group,
      revenue: Number(group.revenue.toFixed(2)),
      share: transactions.length ? Number((group.transactions / transactions.length * 100).toFixed(1)) : 0,
      averageDiscount: group.transactions ? Number((group.discount / group.transactions * 100).toFixed(1)) : 0
    }));
  };

  const months = new Map();
  for (const transaction of transactions) {
    const [year, month] = transaction.date.split("-");
    const key = `${year}-${month}`;
    const value = months.get(key) ?? { name: new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }), revenue: 0, transactions: 0, units: 0 };
    value.revenue += transaction.amount;
    value.transactions += 1;
    value.units += transaction.quantity;
    months.set(key, value);
  }

  const monthlySales = [...months.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, month]) => ({ ...month, revenue: Number(month.revenue.toFixed(2)) }));
  const compare = (current, previous) => previous ? Number(((current - previous) / previous * 100).toFixed(1)) : 0;
  const latest = monthlySales.at(-1) ?? { revenue: 0, transactions: 0, units: 0 };
  const previous = monthlySales.at(-2) ?? latest;
  const latestAverageOrder = latest.transactions ? latest.revenue / latest.transactions : 0;
  const previousAverageOrder = previous.transactions ? previous.revenue / previous.transactions : 0;
  const revenue = Number(sum(transactions, "amount").toFixed(2));
  const units = sum(transactions, "quantity");

  return {
    revenue,
    transactionCount: transactions.length,
    units,
    averageOrder: transactions.length ? Number((revenue / transactions.length).toFixed(2)) : 0,
    averageOrderChange: compare(latestAverageOrder, previousAverageOrder),
    averageDiscount: transactions.length ? Number((sum(transactions, "discount") / transactions.length * 100).toFixed(1)) : 0,
    revenueChange: compare(latest.revenue, previous.revenue),
    transactionChange: compare(latest.transactions, previous.transactions),
    unitsChange: compare(latest.units, previous.units),
    monthlySales,
    channels: by("channel"),
    regions: by("region").sort((a, b) => b.revenue - a.revenue),
    categories: by("category").sort((a, b) => b.revenue - a.revenue),
    customerSegments: by("customerType").sort((a, b) => a.name.localeCompare(b.name))
  };
}
