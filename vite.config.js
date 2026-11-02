import { readFile, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const salesCsvPath = fileURLToPath(new URL("./sales_data.csv", import.meta.url));

function salesCsvPlugin() {
  return {
    name: "sales-csv-source",
    configureServer(server) {
      server.middlewares.use("/sales_data.csv", (request, response, next) => {
        if (request.method !== "GET" && request.method !== "HEAD") return next();
        readFile(salesCsvPath, (error, contents) => {
          if (error) return next(error);
          response.setHeader("Content-Type", "text/csv; charset=utf-8");
          response.setHeader("Cache-Control", "no-cache");
          response.end(contents);
        });
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "sales_data.csv",
        source: readFileSync(salesCsvPath)
      });
    }
  };
}

export default defineConfig({ plugins: [react(), salesCsvPlugin()] });
