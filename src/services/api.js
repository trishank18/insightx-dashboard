import { aggregateSales, parseSalesCsv } from "./salesData.js";

const delay = (value, ms = 200) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
let salesPromise;

async function loadSales() {
  if (!salesPromise) {
    salesPromise = fetch("/sales_data.csv")
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load sales_data.csv (${response.status}).`);
        return response.text();
      })
      .then(parseSalesCsv)
      .catch((error) => {
        salesPromise = undefined;
        throw error;
      });
  }
  return salesPromise;
}

export async function fetchDashboard() {
  const transactions = await loadSales();
  return delay({ transactions, kpis: aggregateSales(transactions) });
}

export async function fetchTransactions() {
  return delay(await loadSales());
}

export async function fetchCustomers() {
  const transactions = await loadSales();
  return delay(aggregateSales(transactions).customerSegments);
}
