import test from "node:test";
import assert from "node:assert/strict";
import { MAX_SALES_CSV_BYTES, parseSalesCsvFile } from "../src/services/csvUpload.js";

const csv = [
  "Product_ID,Sale_Date,Sales_Rep,Region,Sales_Amount,Quantity_Sold,Product_Category,Unit_Cost,Unit_Price,Customer_Type,Discount,Payment_Method,Sales_Channel",
  "P-1,2024-01-04,Alex,North,1250.5,2,Office,300,625,New,0.1,Card,Online",
  "P-2,2024-02-10,Sam,West,900,1,Home,250,900,Returning,0,Cash,Retail"
].join("\n");

const file = (name, content, size = content.length) => ({ name, size, text: async () => content });

test("upload parser validates and analyzes sales CSV rows", async () => {
  const transactions = await parseSalesCsvFile(file("quarterly-sales.csv", csv));
  assert.equal(transactions.length, 2);
  assert.equal(transactions[0].amount, 1250.5);
  assert.equal(transactions[1].customerType, "Returning");
});

test("upload parser rejects missing files, non-CSV files, oversized files, and invalid data", async () => {
  await assert.rejects(parseSalesCsvFile(null), /Choose a CSV file/);
  await assert.rejects(parseSalesCsvFile(file("sales.xlsx", csv)), /\.csv extension/);
  await assert.rejects(parseSalesCsvFile(file("huge.csv", csv, MAX_SALES_CSV_BYTES + 1)), /5 MB or smaller/);
  await assert.rejects(parseSalesCsvFile(file("empty.csv", `${csv.split("\n")[0]}\n`)), /no sales records/);
  await assert.rejects(parseSalesCsvFile(file("broken.csv", "Product_ID,Sale_Date")), /missing required columns/);
});
