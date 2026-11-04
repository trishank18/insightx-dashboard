# API documentation

All endpoints are public, read-only JSON. No auth, secrets, database, write endpoint, pagination, query filter, or external API is present.

| Method/path | Handler | Response (source/tests) |
|---|---|---|
| GET `/api/dashboard` | `api/dashboard.js` | `{ transactions, kpis }` |
| GET `/api/transactions` | `api/transactions.js` | transaction array |
| GET `/api/customers` | `api/customers.js` | customer segment array |

Non-GET requests respond 405 and `Allow: GET`. `api/_data.js` parses bundled `sales_data.csv`. Vercel config includes CSV in function bundle. Vite plugin in `vite.config.js` invokes same handlers during dev and preview and adds 60-second public cache headers. API client `src/services/api.js` checks `response.ok`, attempts JSON error message then reports status. Do not expose CSV as a static asset.

Response exact shapes are defined by code and `tests/api.test.js`; no OpenAPI schema exists. Live production availability was not verified because remote page fetch was inaccessible during this audit.
