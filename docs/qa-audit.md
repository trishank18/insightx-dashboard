# InsightX QA and data integration report

**Audit date:** 2026-11-03

## Result

The dashboard reads its data from a read-only JSON REST API backed by `sales_data.csv`. Vercel exposes `/api/dashboard`, `/api/transactions`, and `/api/customers`; Vite serves the same handlers in development and preview. The app derives its KPIs, monthly charts, regional/category/channel breakdowns, table rows, customer segments, and report exports from the 1,000 CSV records.

The Customers page reports New and Returning customer segments. The CSV has no individual customer IDs, names, or contact details, so the UI does not invent those fields.

## Dataset checks

- REST endpoint tests verify JSON response shapes, all 1,000 records, customer segments, and `405` responses for unsupported methods.
- The browser API client tests verify all three endpoint paths and handling of failed HTTP responses.
- CSV upload tests verify valid sales files, empty files, wrong extensions, oversized files, and invalid headers.
- The REST API is public and read-only. Authentication and database persistence are outside this demo's scope.

- 1,000 valid sale rows across 13 months, January 2023 to January 2024.
- Total sales: **₹5,019,265.23**; total units sold: **25,355**. Monetary values use Indian rupees (INR).
- Four regions, two sales channels, four product categories, and two customer segments.
- Vite production-preview API smoke checks returned 1,000 transactions from the dashboard and transactions endpoints, two customer segments, and HTTP 405 for a POST request.
- The CSV is bundled with the Vercel functions and is no longer exposed as a static `/sales_data.csv` asset.
- CSV parser tests cover quoted commas, CRLF, missing headers, malformed dates/numbers, and unclosed quotes.

## Browser checks

Headless Chrome loaded each route at 1440 px: Overview, Analytics, Sales, Customers, Reports, and Settings. Overview, Analytics, and Sales rendered their expected Recharts charts; Customers showed two segments. The mobile Overview was also checked at 390 px with the navigation drawer closed. No horizontal overflow, runtime exceptions, or console errors were observed.

The Overview displayed the CSV totals. Searching for North returned **267** sales records; selecting the latest six months returned **432**. The three report buttons downloaded monthly revenue, customer segment, and sales channel CSV files with non-zero content. Updated Overview, Analytics, and mobile screenshots are saved under `docs/screenshots/`.

## Automated verification

| Check | Result |
| --- | --- |
| `npm test` | **Passed**, 21/21 Node tests plus production build |
| REST API failure handling | **Passed**, simulated HTTP 503 and surfaced the status |
| REST endpoint handlers | **Passed**, three GET endpoints and unsupported-method responses |
| Production-preview API smoke check | **Passed**, all endpoints returned expected data; POST returned HTTP 405 |
| `npm audit` | **0 vulnerabilities** on the installed dependency tree |
| Browser route and data smoke check | **Passed**, six routes at desktop width |
| Browser errors | **None observed** |

The production build still emits Vite's advisory that the minified JavaScript chunk is about 660 kB, above its 500 kB threshold. The build succeeds; route-level code splitting could reduce the initial download.

## Architecture and security scope

- `src/services/salesData.js` parses and aggregates the CSV.
- `api/*.js` provides read-only Vercel REST endpoints; `api/_data.js` reads and parses the CSV.
- `src/services/api.js` fetches JSON from the REST endpoints and surfaces HTTP errors to existing loading/error states.
- `vite.config.js` serves those same endpoint handlers as Vite middleware during development and preview.
- `src/services/transactions.js` provides searching, sorting, pagination, and dataset-specific CSV reports.
- React renders the parsed values as text; no raw HTML injection is used.
- The mock API runs as serverless functions and is public/read-only. There is no authentication, database/SQL, ML component, or external integration; user accounts and persistent data changes are not implemented.

## Run

```bash
npm install
npm run dev
```

Run feature tests and the production build:

```bash
npm test
```

Run the dependency advisory scan:

```bash
npm audit
```
