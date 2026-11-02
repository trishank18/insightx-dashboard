import test from "node:test";
import assert from "node:assert/strict";
import { aggregateSales, parseSalesCsv } from "../src/services/salesData.js";

const headers = "Product_ID,Sale_Date,Sales_Rep,Region,Sales_Amount,Quantity_Sold,Product_Category,Unit_Cost,Unit_Price,Customer_Type,Discount,Payment_Method,Sales_Channel";

test("CSV parser handles quoted commas, CRLF, and maps source columns to sales records", () => {
  const [sale] = parseSalesCsv(`${headers}\r\n1052,2023-02-03,"Kim, A.",North,5053.97,18,Furniture,152.75,267.22,Returning,0.09,Cash,Online\r\n`);
  assert.equal(sale.id, "SALE-00001");
  assert.equal(sale.salesRep, "Kim, A.");
  assert.equal(sale.amount, 5053.97);
  assert.equal(sale.quantity, 18);
  assert.equal(sale.channel, "Online");
});

test("CSV parser rejects missing columns, invalid dates, invalid numbers, and unclosed quotes", () => {
  assert.throws(() => parseSalesCsv("Product_ID,Sale_Date\n1,2023-01-01"), /missing required columns/);
  assert.throws(() => parseSalesCsv(`${headers}\n1,2023-02-31,A,North,10,1,Food,2,3,New,0.1,Cash,Online`), /invalid Sale_Date/);
  assert.throws(() => parseSalesCsv(`${headers}\n1,2023-01-01,A,North,nope,1,Food,2,3,New,0.1,Cash,Online`), /invalid Sales_Amount/);
  assert.throws(() => parseSalesCsv(`${headers}\n1,2023-01-01,"A,North,10,1,Food,2,3,New,0.1,Cash,Online`), /unclosed quoted field/);
});

test("sales aggregation derives revenue, monthly totals, channels, regions, categories, and segments", () => {
  const rows = parseSalesCsv(`${headers}\n1,2023-01-05,A,North,100,2,Food,20,50,New,0.1,Cash,Online\n2,2023-02-08,B,West,300,4,Clothing,30,75,Returning,0.2,Card,Retail`);
  const result = aggregateSales(rows);
  assert.equal(result.revenue, 400);
  assert.equal(result.transactionCount, 2);
  assert.equal(result.units, 6);
  assert.equal(result.averageOrder, 200);
  assert.deepEqual(result.monthlySales.map(({ name, revenue }) => ({ name, revenue })), [
    { name: "Jan 2023", revenue: 100 }, { name: "Feb 2023", revenue: 300 }
  ]);
  assert.equal(result.channels[0].share, 50);
  assert.deepEqual(result.customerSegments.map((segment) => segment.name), ["New", "Returning"]);
});
