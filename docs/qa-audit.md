# InsightX QA and data integration report

**Audit date:** 2026-11-02

## Result

The dashboard now reads its data from the supplied `sales_data.csv`. Vite serves the root file at `/sales_data.csv` during development and writes it into the production build. The app derives its KPIs, monthly charts, regional/category/channel breakdowns, table rows, customer segments, and report exports from the 1,000 CSV records.

The Customers page reports New and Returning customer segments. The CSV has no individual customer IDs, names, or contact details, so the UI does not invent those fields.

## Dataset checks

- 1,000 valid sale rows across 13 months, January 2023 to January 2024.
- Total sales: **₹5,019,265.23**; total units sold: **25,355**. Monetary values use Indian rupees (INR).
- Four regions, two sales channels, four product categories, and two customer segments.
- The Vite development endpoint returned HTTP 200 and 1,001 lines including the header.
- Production build emitted `dist/sales_data.csv` at 105.08 kB.
- CSV parser tests cover quoted commas, CRLF, missing headers, malformed dates/numbers, and unclosed quotes.

## Browser checks

Headless Chrome loaded each route at 1440 px: Overview, Analytics, Sales, Customers, Reports, and Settings. Overview, Analytics, and Sales rendered their expected Recharts charts; Customers showed two segments. The mobile Overview was also checked at 390 px with the navigation drawer closed. No horizontal overflow, runtime exceptions, or console errors were observed.

The Overview displayed the CSV totals. Searching for North returned **267** sales records; selecting the latest six months returned **432**. The three report buttons downloaded monthly revenue, customer segment, and sales channel CSV files with non-zero content. Updated Overview, Analytics, and mobile screenshots are saved under `docs/screenshots/`.

## Automated verification

| Check | Result |
| --- | --- |
| `npm test` | **Passed**, 14/14 Node tests plus production build |
| CSV fetch failure and retry | **Passed**, simulated HTTP 503 then successful retry |
| Production inclusion | **Passed**, CSV emitted into `dist/` |
| `npm audit` | **0 vulnerabilities** on the installed dependency tree |
| Browser route and data smoke check | **Passed**, six routes at desktop width |
| Browser errors | **None observed** |

The production build still emits Vite's advisory that the minified JavaScript chunk is about 660 kB, above its 500 kB threshold. The build succeeds; route-level code splitting could reduce the initial download.

## Architecture and security scope

- `src/services/salesData.js` parses and aggregates the CSV.
- `src/services/api.js` fetches the local CSV and retries cleanly after a failed load.
- `vite.config.js` exposes only that CSV path in the development server and packages the CSV for production.
- `src/services/transactions.js` provides searching, sorting, pagination, and dataset-specific CSV reports.
- React renders the parsed values as text; no raw HTML injection is used.
- No backend, remote API, authentication, database/SQL, ML component, or external integration exists in this repository. Their CRUD, role, session, authorization, and server-security behavior cannot be tested here.

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
