import test from "node:test";
import assert from "node:assert/strict";
import dashboardHandler from "../api/dashboard.js";
import transactionsHandler from "../api/transactions.js";
import customersHandler from "../api/customers.js";

async function invoke(handler, method = "GET") {
  const result = { headers: {}, statusCode: 200, body: undefined };
  const response = {
    status(code) { result.statusCode = code; return this; },
    setHeader(name, value) { result.headers[name] = value; },
    json(body) { result.body = body; return this; }
  };
  await handler({ method }, response);
  return result;
}

test("dashboard endpoint returns transactions and computed KPIs", async () => {
  const result = await invoke(dashboardHandler);
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.transactions.length, 1000);
  assert.equal(result.body.kpis.transactionCount, 1000);
  assert.equal(result.body.transactions[0].id, "SALE-00001");
});

test("transactions and customers endpoints return JSON collections", async () => {
  const [transactions, customers] = await Promise.all([invoke(transactionsHandler), invoke(customersHandler)]);
  assert.equal(transactions.statusCode, 200);
  assert.equal(transactions.body.length, 1000);
  assert.deepEqual(customers.body.map((segment) => segment.name), ["New", "Returning"]);
});

test("read-only endpoints reject non-GET methods", async () => {
  for (const handler of [dashboardHandler, transactionsHandler, customersHandler]) {
    const result = await invoke(handler, "POST");
    assert.equal(result.statusCode, 405);
    assert.equal(result.headers.Allow, "GET");
    assert.match(result.body.error, /Method not allowed/);
  }
});
