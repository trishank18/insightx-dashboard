import test from "node:test";
import assert from "node:assert/strict";
import { acquisitionPerformanceCsv, customerHealthCsv, filterTransactions, monthlyRevenueCsv, paginateTransactions, sortTransactions, transactionsToCsv } from "../src/services/transactions.js";

const rows = [
  { id: "TX-10", name: "Ada Lovelace", email: "ada@example.com", plan: "Studio", amount: 90, status: "Paid", date: "February 2024" },
  { id: "TX-2", name: "Grace Hopper", email: "grace@example.com", plan: "Pro", amount: 120, status: "Pending", date: "October 2023" },
  { id: "TX-3", name: "Lin Chen", email: "lin@example.com", plan: "Basic", amount: 40, status: "Refunded", date: "January 2024" },
];

test("search is case-insensitive, trimmed, and covers table fields", () => {
  assert.deepEqual(filterTransactions(rows, "  ADA "), [rows[0]]);
  assert.deepEqual(filterTransactions(rows, "pending"), [rows[1]]);
  assert.equal(filterTransactions(rows, "").length, rows.length);
  assert.deepEqual(filterTransactions(rows, "missing"), []);
});

test("sort handles numeric values, natural text order, and chronological month labels without mutating input", () => {
  assert.deepEqual(sortTransactions(rows, "amount", "asc").map((row) => row.amount), [40, 90, 120]);
  assert.deepEqual(sortTransactions(rows, "id", "asc").map((row) => row.id), ["TX-2", "TX-3", "TX-10"]);
  assert.deepEqual(sortTransactions(rows, "date", "asc").map((row) => row.date), ["October 2023", "January 2024", "February 2024"]);
  assert.deepEqual(rows.map((row) => row.id), ["TX-10", "TX-2", "TX-3"]);
});

test("pagination handles empty data, invalid arguments, and pages beyond the end", () => {
  assert.deepEqual(paginateTransactions(rows, 1, 2), { page: 1, pageCount: 2, rows: rows.slice(0, 2) });
  assert.equal(paginateTransactions(rows, 99, 2).page, 2);
  assert.equal(paginateTransactions([], 1, 5).pageCount, 1);
  assert.equal(paginateTransactions(rows, 0, 0).rows.length, rows.length);
});

test("CSV exports valid headers, quotes commas and quotes, and handles missing values", () => {
  const csv = transactionsToCsv([{ ...rows[0], name: 'Ada, "A" Lovelace', email: undefined }]);
  assert.match(csv, /^"Transaction","Customer","Email"/);
  assert.match(csv, /"Ada, ""A"" Lovelace",""/);
  assert.match(csv, /\r\n/);
});

test("report exports have distinct schemas and monthly revenue is aggregated chronologically", () => {
  const monthly = monthlyRevenueCsv(rows);
  const customers = customerHealthCsv([{ name: "Ada Lovelace", email: "ada@example.com", plan: "Studio", spend: 90, status: "Active", joined: "February 2024" }]);
  const acquisition = acquisitionPerformanceCsv([{ name: "Organic search", value: 42 }, { name: "Referral", value: 18 }]);

  assert.match(monthly, /^"Month","Order count","Revenue"/);
  assert.ok(monthly.indexOf("Oct 2023") < monthly.indexOf("Jan 2024"));
  assert.match(monthly, /"Feb 2024","1","90\.00"/);
  assert.match(customers, /^"Customer","Email","Plan","Lifetime spend","Status","Joined"/);
  assert.match(acquisition, /^"Channel","Customer share \(\%\)"/);
  assert.equal(new Set([monthly, customers, acquisition]).size, 3);
});
