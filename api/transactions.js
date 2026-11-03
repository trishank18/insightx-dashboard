import { getSalesData } from "./_data.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    return response.status(200).json(await getSalesData());
  } catch {
    return response.status(500).json({ error: "Unable to load transactions." });
  }
}
