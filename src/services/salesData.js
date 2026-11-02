const requiredColumns = [
  "Product_ID", "Sale_Date", "Sales_Rep", "Region", "Sales_Amount", "Quantity_Sold",
  "Product_Category", "Unit_Cost", "Unit_Price", "Customer_Type", "Discount",
  "Payment_Method", "Sales_Channel"
];

function parseCsvRows(csv) {
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

function numericValue(value, column, rowNumber) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`Sales CSV row ${rowNumber} has an invalid ${column}.`);
  return number;
}

export function parseSalesCsv(csv) {
  const [headers, ...records] = parseCsvRows(csv);
  if (!headers) throw new Error("Sales CSV is empty.");

  const positions = new Map(headers.map((header, index) => [header.trim(), index]));
  const missing = requiredColumns.filter((column) => !positions.has(column));
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
