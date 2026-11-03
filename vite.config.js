import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dashboardHandler from "./api/dashboard.js";
import transactionsHandler from "./api/transactions.js";
import customersHandler from "./api/customers.js";

const handlers = new Map([
  ["/api/dashboard", dashboardHandler],
  ["/api/transactions", transactionsHandler],
  ["/api/customers", customersHandler]
]);

function apiPlugin() {
  const middleware = async (request, response, next) => {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const handler = handlers.get(pathname);
    if (!handler) return next();

    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");
    const apiResponse = {
      status(code) { response.statusCode = code; return this; },
      setHeader(name, value) { response.setHeader(name, value); },
      json(payload) { response.end(JSON.stringify(payload)); return this; }
    };

    try {
      await handler(request, apiResponse);
    } catch {
      response.statusCode = 500;
      response.end(JSON.stringify({ error: "The API request failed." }));
    }
  };

  return {
    name: "insightx-local-api",
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); }
  };
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  optimizeDeps: { noDiscovery: true, include: [] }
});
