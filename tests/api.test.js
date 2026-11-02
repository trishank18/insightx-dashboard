import test from "node:test";
import assert from "node:assert/strict";
import { fetchCustomers, fetchDashboard, fetchTransactions } from "../src/services/api.js";

test("mock dashboard and transaction endpoints return consistent fixture data", async () => {
  const [dashboard, transactions] = await Promise.all([fetchDashboard(), fetchTransactions()]);
  assert.equal(dashboard.transactions.length, 36);
  assert.equal(transactions.length, dashboard.transactions.length);
  assert.equal(dashboard.kpis.revenue, Number(transactions.reduce((sum, row) => sum + row.amount, 0).toFixed(2)));
  assert.ok(transactions.every((row) => row.id && row.name && row.email && Number.isFinite(row.amount)));
});

test("mock customers have valid spend, status, and date fields", async () => {
  const customers = await fetchCustomers();
  assert.equal(customers.length, 36);
  assert.ok(customers.every((row) => row.name && row.email && row.spend > 0 && row.joined));
  assert.ok(customers.some((row) => row.status === "At risk"));
});
