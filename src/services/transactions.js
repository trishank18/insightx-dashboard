const searchableFields = ["id", "productId", "name", "salesRep", "region", "product", "plan", "category", "amount", "quantity", "status", "customerType", "discount", "paymentMethod", "channel", "date"];
const monthIndexes = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function parseDateValue(value) {
  const match = String(value ?? "").match(/^([A-Za-z]+)\s+(?:(\d{1,2}),?\s+)?(\d{4})$/);
  if (match) {
    const month = monthIndexes.indexOf(match[1].slice(0, 3).toLowerCase());
    if (month !== -1) return Date.UTC(Number(match[3]), month, Number(match[2] || 1));
  }
  return Date.parse(value);
}

export function filterTransactions(rows, query = "") {
  const normalizedQuery = String(query).trim().toLocaleLowerCase();
  if (!normalizedQuery) return rows;

  return rows.filter((row) => searchableFields
    .some((field) => String(row[field] ?? "").toLocaleLowerCase().includes(normalizedQuery)));
}

export function sortTransactions(rows, key, direction = "asc") {
  const multiplier = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const left = a[key];
    const right = b[key];
    let comparison;

    if (key === "date") {
      comparison = parseDateValue(left) - parseDateValue(right);
      if (Number.isNaN(comparison)) comparison = String(left ?? "").localeCompare(String(right ?? ""));
    } else if (typeof left === "number" && typeof right === "number") {
      comparison = left - right;
    } else {
      comparison = String(left ?? "").localeCompare(String(right ?? ""), undefined, { numeric: true, sensitivity: "base" });
    }

    return comparison * multiplier;
  });
}

export function paginateTransactions(rows, page = 1, pageSize = 5) {
  const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 5;
  const pageCount = Math.max(1, Math.ceil(rows.length / safePageSize));
  const safePage = Math.min(pageCount, Math.max(1, Number.isInteger(page) ? page : 1));
  const start = (safePage - 1) * safePageSize;
  return { page: safePage, pageCount, rows: rows.slice(start, start + safePageSize) };
}

export function transactionsToCsv(rows) {
  return rowsToCsv(["Sale", "Product ID", "Date", "Sales rep", "Region", "Category", "Sales amount", "Units sold", "Unit cost", "Unit price", "Customer type", "Discount", "Payment method", "Sales channel"], rows.map((row) => ({
    Sale: row.id,
    "Product ID": row.productId,
    Date: row.date,
    "Sales rep": row.salesRep,
    Region: row.region,
    Category: row.category,
    "Sales amount": row.amount,
    "Units sold": row.quantity,
    "Unit cost": row.unitCost,
    "Unit price": row.unitPrice,
    "Customer type": row.customerType,
    Discount: row.discount,
    "Payment method": row.paymentMethod,
    "Sales channel": row.channel
  })));
}

export function rowsToCsv(headers, rows) {
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [headers.map(escape).join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\r\n");
}

export function monthlyRevenueCsv(transactions) {
  const monthly = new Map();
  for (const transaction of transactions) {
    const timestamp = parseDateValue(transaction.date);
    const date = Number.isNaN(timestamp) ? null : new Date(timestamp);
    const key = date ? `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}` : "unknown";
    const month = date ? date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }) : "Unknown";
    const current = monthly.get(key) ?? { Month: month, "Order count": 0, Revenue: 0 };
    current["Order count"] += 1;
    current.Revenue += Number(transaction.amount) || 0;
    monthly.set(key, current);
  }

  const summary = [...monthly.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, row]) => ({ ...row, Revenue: row.Revenue.toFixed(2) }));
  return rowsToCsv(["Month", "Order count", "Revenue"], summary);
}

export function customerSegmentCsv(customers) {
  const rows = customers.map((customer) => ({
    Segment: customer.name,
    "Sales count": customer.transactions,
    Revenue: customer.revenue,
    "Units sold": customer.units,
    "Average discount (%)": customer.averageDiscount
  }));
  return rowsToCsv(["Segment", "Sales count", "Revenue", "Units sold", "Average discount (%)"], rows);
}

export function salesChannelPerformanceCsv(channels) {
  return rowsToCsv(["Sales channel", "Sales records", "Revenue", "Transaction share (%)"], channels.map((channel) => ({
    "Sales channel": channel.name,
    "Sales records": channel.transactions,
    Revenue: channel.revenue,
    "Transaction share (%)": channel.share
  })));
}
