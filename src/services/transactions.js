const searchableFields = ["id", "name", "email", "plan", "status"];

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
      comparison = Date.parse(left) - Date.parse(right);
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
  const fields = ["id", "name", "email", "plan", "amount", "status", "date"];
  const header = ["Transaction", "Customer", "Email", "Plan", "Amount", "Status", "Date"];
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [header.map(escape).join(","), ...rows.map((row) => fields.map((field) => escape(row[field])).join(","))].join("\r\n");
}
