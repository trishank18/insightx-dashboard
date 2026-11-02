import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fetchCustomers, fetchDashboard, fetchTransactions } from "../src/services/api.js";

const csv = await readFile(new URL("../sales_data.csv", import.meta.url), "utf8");
let simulateFailure = false;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  assert.equal(url, "/sales_data.csv");
  return simulateFailure
    ? new Response("Unavailable", { status: 503 })
    : new Response(csv, { status: 200, headers: { "Content-Type": "text/csv" } });
};
after(() => { globalThis.fetch = originalFetch; });

test("CSV fetch failures reject clearly and can be retried", async () => {
  simulateFailure = true;
  await assert.rejects(fetchDashboard(), /sales_data\.csv \(503\)/);
  simulateFailure = false;
  assert.equal((await fetchTransactions()).length, 1000);
});

test("dashboard and transaction data are loaded from sales_data.csv", async () => {
  const [dashboard, transactions] = await Promise.all([fetchDashboard(), fetchTransactions()]);
  assert.equal(transactions.length, 1000);
  assert.equal(dashboard.transactions.length, transactions.length);
  assert.equal(transactions[0].id, "SALE-00001");
  assert.equal(transactions[0].salesRep, "Bob");
  assert.equal(transactions[0].region, "North");
  assert.equal(transactions[0].amount, 5053.97);
  assert.equal(dashboard.kpis.revenue, Number(transactions.reduce((sum, row) => sum + row.amount, 0).toFixed(2)));
  assert.equal(dashboard.kpis.transactionCount, 1000);
  assert.equal(dashboard.kpis.units, transactions.reduce((sum, row) => sum + row.quantity, 0));
  assert.deepEqual(dashboard.kpis.monthlySales.map((row) => row.name), [
    "Jan 2023", "Feb 2023", "Mar 2023", "Apr 2023", "May 2023", "Jun 2023",
    "Jul 2023", "Aug 2023", "Sep 2023", "Oct 2023", "Nov 2023", "Dec 2023", "Jan 2024"
  ]);
});

test("customer view aggregates real new and returning segments", async () => {
  const customers = await fetchCustomers();
  assert.deepEqual(customers.map((row) => row.name), ["New", "Returning"]);
  assert.equal(customers.reduce((sum, row) => sum + row.transactions, 0), 1000);
  assert.ok(customers.every((row) => row.revenue > 0 && row.units > 0 && row.averageDiscount >= 0));
  assert.ok(customers.some((row) => row.name === "Returning"));
});
