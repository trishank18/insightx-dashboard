async function requestJson(path) {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    let details = "";
    try { details = (await response.json()).error ?? ""; } catch { /* Use the status when no JSON error is available. */ }
    throw new Error(details || `Request failed (${response.status}).`);
  }
  return response.json();
}

export async function fetchDashboard() {
  return requestJson("/api/dashboard");
}

export async function fetchTransactions() {
  return requestJson("/api/transactions");
}

export async function fetchCustomers() {
  return requestJson("/api/customers");
}
