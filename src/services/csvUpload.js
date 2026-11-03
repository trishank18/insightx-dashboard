import { parseSalesCsv } from "./salesData.js";

export const MAX_SALES_CSV_BYTES = 5 * 1024 * 1024;

export async function parseSalesCsvFile(file) {
  if (!file || typeof file.text !== "function") throw new TypeError("Choose a CSV file to upload.");
  if (!file.name?.toLowerCase().endsWith(".csv")) throw new TypeError("Choose a file with the .csv extension.");
  if (file.size > MAX_SALES_CSV_BYTES) throw new TypeError("CSV files must be 5 MB or smaller.");

  const transactions = parseSalesCsv(await file.text());
  if (!transactions.length) throw new TypeError("The CSV has no sales records to analyze.");
  return transactions;
}
