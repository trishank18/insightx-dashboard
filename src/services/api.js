const delay = (value, ms = 500) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

// Curated retail orders based on the public Sample Superstore dataset format.
// The records are embedded so the demo remains reliable without an external API.
const seedOrders = [
  ["US-2024-10482", "Olivia Martin", "olivia.martin@example.com", "Wireless headphones", "Technology", "West", 249.99, "Paid", "Oct 24, 2024"],
  ["US-2024-10481", "Liam Chen", "liam.chen@example.com", "Ergonomic office chair", "Furniture", "East", 599.00, "Paid", "Oct 24, 2024"],
  ["US-2024-10480", "Ava Rodriguez", "ava.rodriguez@example.com", "Insulated travel mug", "Office Supplies", "South", 38.40, "Pending", "Oct 23, 2024"],
  ["US-2024-10479", "Noah Williams", "noah.williams@example.com", "27-inch 4K monitor", "Technology", "Central", 719.98, "Paid", "Oct 23, 2024"],
  ["US-2024-10478", "Emma Thompson", "emma.thompson@example.com", "Standing desk converter", "Furniture", "West", 329.95, "Paid", "Oct 22, 2024"],
  ["US-2024-10477", "James Wilson", "james.wilson@example.com", "Premium printer paper", "Office Supplies", "East", 86.40, "Refunded", "Oct 22, 2024"],
  ["US-2024-10476", "Sophia Kim", "sophia.kim@example.com", "USB-C docking station", "Technology", "South", 189.99, "Paid", "Oct 21, 2024"],
  ["US-2024-10475", "Ethan Brown", "ethan.brown@example.com", "Task lighting set", "Furniture", "Central", 144.00, "Paid", "Oct 20, 2024"],
  ["US-2024-10474", "Mia Davis", "mia.davis@example.com", "Shipping labels, 500-pack", "Office Supplies", "West", 54.75, "Paid", "Oct 19, 2024"],
  ["US-2024-10473", "Lucas Garcia", "lucas.garcia@example.com", "Noise-cancelling earbuds", "Technology", "East", 179.99, "Paid", "Oct 18, 2024"]
].map(([id, name, email, product, category, region, amount, status, date]) => ({
  id, name, email, product, plan: product, category, region, amount, status, date
}));

const monthLabels = Array.from({ length: 36 }, (_, index) => {
  const date = new Date(Date.UTC(2023 + Math.floor(index / 12), index % 12, 15));
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
});

const transactions = monthLabels.map((date, index) => {
  const seed = seedOrders[index % seedOrders.length];
  const year = 2023 + Math.floor(index / 12);
  const amount = Number((seed.amount * (0.78 + ((index * 7) % 18) / 100)).toFixed(2));
  return {
    ...seed,
    id: `US-${year}-${String(10473 + index).padStart(5, "0")}`,
    amount,
    date
  };
});

export async function fetchDashboard() {
  return delay({
    transactions,
    kpis: {
      revenue: Number(transactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2)),
      revenueChange: 12.8,
      customers: 2840,
      customersChange: 8.4,
      conversion: 6.24,
      conversionChange: 2.1,
      churn: 1.84,
      churnChange: -0.6
    }
  });
}

export async function fetchTransactions() {
  return delay(transactions, 650);
}

export async function fetchCustomers() {
  const customers = new Map();
  for (const transaction of transactions) {
    const customer = customers.get(transaction.email) ?? {
      name: transaction.name,
      email: transaction.email,
      plan: transaction.product,
      spend: 0,
      status: "Active",
      joined: transaction.date
    };
    customer.spend += transaction.amount;
    if (transaction.status !== "Paid") customer.status = "At risk";
    customers.set(transaction.email, customer);
  }

  return delay([...customers.values()].map((customer) => ({
    ...customer,
    spend: Number(customer.spend.toFixed(2))
  })));
}
