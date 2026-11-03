import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { aggregateSales, parseSalesCsv } from "../src/services/salesData.js";

const csvPath = fileURLToPath(new URL("../sales_data.csv", import.meta.url));
let salesPromise;

export async function getSalesData() {
  if (!salesPromise) {
    salesPromise = readFile(csvPath, "utf8")
      .then(parseSalesCsv)
      .catch((error) => {
        salesPromise = undefined;
        throw error;
      });
  }
  return salesPromise;
}

export async function getDashboardData() {
  const transactions = await getSalesData();
  return { transactions, kpis: aggregateSales(transactions) };
}

export async function getCustomerData() {
  return (await getDashboardData()).kpis.customerSegments;
}
