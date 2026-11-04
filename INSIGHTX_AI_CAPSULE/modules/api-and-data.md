# API and data module

**Files:** `api/_data.js`, `api/dashboard.js`, `api/transactions.js`, `api/customers.js`, `sales_data.csv`, `vite.config.js`.

CSV-backed read-only GET endpoints serve dashboard payload, transaction rows, and segment summaries. Non-GET returns 405/Allow GET. Same handler modules run through Vite middleware locally and Vercel functions remotely. Vercel includes dataset in function bundle. `src/services/api.js` is browser fetch client. Unit/API handler tests passed in current run. Production deployment still needs live check.
