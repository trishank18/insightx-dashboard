# InsightX Dashboard

InsightX is a responsive analytics dashboard for **Problem Statement 02: Interactive Analytics Dashboard UI**. It brings sales, customer, and performance metrics together in one workspace.

## Features and modules

| Requirement | Implementation |
| --- | --- |
| Sidebar, top bar, and summary cards | Shared shell, navigation, and KPI cards |
| At least three chart types | Recharts area, line, bar, and donut charts |
| Searchable, sortable table with pagination | Overview transaction table |
| Light and dark themes | Top-bar toggle persisted in browser storage |
| Data loading and error states | Async mock service boundary, loading indicators, and retry actions |
| Reports | Separate monthly revenue, customer health, and acquisition CSV exports |
| Workspace settings | Validated name, timezone, weekly digest, and local persistence |

## Project structure

```text
src/
  App.jsx                    Routes, layout, pages, charts, controls
  main.jsx                   React entry point and router
  index.css                  Tailwind styles and design tokens
  services/
    api.js                   Deterministic asynchronous demo data
    preferences.js           Settings validation and persistence
    transactions.js          Search, sorting, pagination, and CSV reports
tests/                       Node feature and edge-case tests
docs/                         Wireframes, screenshots, and QA audit
```

## Stack and setup

- Node.js 20 or newer and npm
- React 18, Vite 6, and React Router 7
- Recharts, Lucide React, Tailwind CSS 3, PostCSS, and Autoprefixer
- Git

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

Run the automated feature tests and production build check:

```bash
npm test
```

Check installed dependencies for published advisories:

```bash
npm audit
```

## Data and assumptions

The brief did not provide an API contract, backend, or credentials. `src/services/api.js` therefore supplies deterministic retail fixtures through asynchronous functions; it does not call a remote REST API. Replace this service with Fetch or Axios calls when an endpoint is available. The UI shows loading and retry/error states, though the local fixture service does not produce live network failures.

The dashboard uses sample retail transactions and a slate/indigo palette. Date controls filter the displayed transactions and revenue chart locally. The settings form stores preferences in `localStorage`; this demo has no account or server-side settings sync. The included root-level `sales_data.csv` is not currently read by the app.

## UI/UX design

The interface uses persistent desktop navigation, a sticky top bar, KPI cards, chart panels, and a transaction table. On small screens the sidebar becomes a drawer, card grids collapse, and wide tables scroll inside their panels. Colors use slate surfaces and borders, indigo actions, green positive states, and amber/rose attention states. System UI sans-serif typography is used throughout.

See [docs/wireframes.md](docs/wireframes.md) for the layout sketch and responsive notes.

## Tests and QA

`npm test` covers mock API consistency, unique customer aggregation, settings validation and persistence, table search/sort/pagination edge cases, CSV escaping, and distinct chronological report exports; it then verifies the Vite production build.

The end-to-end audit report records the browser checks, responsive route matrix, dependency scan, fixes, and the functionality that cannot be exercised without a real backend: [docs/qa-audit.md](docs/qa-audit.md).

## Screenshots

### Overview

![InsightX Overview dashboard](docs/screenshots/overview.png)

### Analytics

![InsightX Analytics charts](docs/screenshots/analytics.png)

### Mobile Overview

![InsightX mobile dashboard](docs/screenshots/mobile.png)

## Routes

- `/` — Overview metrics, revenue chart, acquisition donut, and transactions
- `/analytics` — revenue/customer trend and weekly conversion charts
- `/sales` — sales KPIs and funnel
- `/customers` — aggregated customer list
- `/reports` — three distinct CSV exports
- `/settings` — workspace preferences

## Repository

The configured GitHub remote is `https://github.com/trishank18/insightx-dashboard.git`. Use `git remote -v` to inspect it and `git push` to publish commits.
