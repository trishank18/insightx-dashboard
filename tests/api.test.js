import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fetchCustomers, fetchDashboard, fetchTransactions } from "../src/services/api.js";
import { aggregateSales, filterTransactionsByDateRange, parseSalesCsv } from "../src/services/salesData.js";

const csv = await readFile(new URL("../sales_data.csv", import.meta.url), "utf8");
const transactionsFixture = parseSalesCsv(csv);
const dashboardFixture = { transactions: transactionsFixture, kpis: aggregateSales(transactionsFixture) };
let simulateFailure = false;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  assert.ok(["/api/dashboard", "/api/transactions", "/api/customers"].includes(url));
  return simulateFailure
    ? new Response("Unavailable", { status: 503 })
    : new Response(JSON.stringify(url === "/api/dashboard" ? dashboardFixture : url === "/api/customers" ? dashboardFixture.kpis.customerSegments : transactionsFixture), { status: 200, headers: { "Content-Type": "application/json" } });
};
after(() => { globalThis.fetch = originalFetch; });

test("REST API failures reject clearly and later calls can succeed", async () => {
  simulateFailure = true;
  await assert.rejects(fetchDashboard(), /Request failed \(503\)/);
  simulateFailure = false;
  assert.equal((await fetchTransactions()).length, 1000);
});

test("dashboard and transaction data are loaded through their REST endpoints", async () => {
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

test("shared dashboard date ranges produce consistent data for all sales views", async () => {
  const transactions = await fetchTransactions();
  const sixMonthRows = filterTransactionsByDateRange(transactions, "6");
  const sixMonthSummary = aggregateSales(sixMonthRows);

  assert.equal(sixMonthRows.length, 432);
  assert.equal(sixMonthSummary.transactionCount, sixMonthRows.length);
  assert.equal(sixMonthSummary.monthlySales.length, 6);
  assert.equal(sixMonthSummary.customerSegments.reduce((sum, segment) => sum + segment.transactions, 0), sixMonthRows.length);
  assert.equal(sixMonthSummary.channels.reduce((sum, channel) => sum + channel.transactions, 0), sixMonthRows.length);
  assert.ok(sixMonthSummary.revenue < aggregateSales(transactions).revenue);
});
