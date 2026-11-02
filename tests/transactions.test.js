import test from "node:test";
import assert from "node:assert/strict";
import { customerSegmentCsv, filterTransactions, monthlyRevenueCsv, paginateTransactions, salesChannelPerformanceCsv, sortTransactions, transactionsToCsv } from "../src/services/transactions.js";

const rows = [
  { id: "TX-10", productId: "10", name: "Ada Lovelace", salesRep: "Ada Lovelace", region: "North", email: "ada@example.com", plan: "Studio", product: "Studio", category: "Studio", amount: 90, quantity: 2, unitCost: 10, unitPrice: 45, status: "New", customerType: "New", discount: 0.1, paymentMethod: "Cash", channel: "Online", date: "February 2024" },
  { id: "TX-2", productId: "2", name: "Grace Hopper", salesRep: "Grace Hopper", region: "West", email: "grace@example.com", plan: "Pro", product: "Pro", category: "Pro", amount: 120, quantity: 3, unitCost: 15, unitPrice: 40, status: "Returning", customerType: "Returning", discount: 0.2, paymentMethod: "Card", channel: "Retail", date: "October 2023" },
  { id: "TX-3", productId: "3", name: "Lin Chen", salesRep: "Lin Chen", region: "East", email: "lin@example.com", plan: "Basic", product: "Basic", category: "Basic", amount: 40, quantity: 1, unitCost: 8, unitPrice: 40, status: "New", customerType: "New", discount: 0.05, paymentMethod: "Cash", channel: "Online", date: "January 2024" },
];

test("search is case-insensitive, trimmed, and covers table fields", () => {
  assert.deepEqual(filterTransactions(rows, "  ADA "), [rows[0]]);
  assert.deepEqual(filterTransactions(rows, "returning"), [rows[1]]);
  assert.deepEqual(filterTransactions(rows, "north"), [rows[0]]);
  assert.deepEqual(filterTransactions(rows, "retail"), [rows[1]]);
  assert.deepEqual(filterTransactions(rows, "120"), [rows[1]]);
  assert.deepEqual(filterTransactions(rows, "February 2024"), [rows[0]]);
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
  const csv = transactionsToCsv([{ ...rows[0], salesRep: 'Ada, "A" Lovelace', region: undefined }]);
  assert.match(csv, /^"Sale","Product ID","Date","Sales rep","Region"/);
  assert.match(csv, /"Ada, ""A"" Lovelace",""/);
  assert.match(csv, /\r\n/);
});

test("report exports have distinct schemas and monthly revenue is aggregated chronologically", () => {
  const monthly = monthlyRevenueCsv(rows);
  const customers = customerSegmentCsv([{ name: "New", transactions: 1, revenue: 90, units: 2, averageDiscount: 10 }]);
  const acquisition = salesChannelPerformanceCsv([{ name: "Online", transactions: 2, revenue: 130, share: 66.7 }, { name: "Retail", transactions: 1, revenue: 120, share: 33.3 }]);

  assert.match(monthly, /^"Month","Order count","Revenue"/);
  assert.ok(monthly.indexOf("Oct 2023") < monthly.indexOf("Jan 2024"));
  assert.match(monthly, /"Feb 2024","1","90\.00"/);
  assert.match(customers, /^"Segment","Sales count","Revenue","Units sold","Average discount \(\%\)"/);
  assert.match(acquisition, /^"Sales channel","Sales records","Revenue","Transaction share \(\%\)"/);
  assert.equal(new Set([monthly, customers, acquisition]).size, 3);
});
