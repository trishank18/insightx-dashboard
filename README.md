# InsightX Dashboard

InsightX is a responsive analytics dashboard built for **Problem Statement 02: Interactive Analytics Dashboard UI**. It brings sales, customer, and performance metrics together in a single workspace.

## 01. Requirement analysis

### Features and modules from the brief

| Requirement | InsightX module |
| --- | --- |
| Dashboard layout with sidebar, top bar, and summary cards | `Shell`, `Kpi`, Overview route |
| At least three chart types: line, bar, pie/donut | Recharts area/line, bar, and donut charts on Overview and Analytics |
| Searchable, sortable data table with pagination | `Transactions` table on Overview |
| Light and dark theme toggle | Theme button in the top bar; preference stored in `localStorage` |
| Mock REST API with loading and error states | Async service functions in `src/services/api.js`; loading, retry, and error UI in data pages |
| React, Vite, chart library, styling, HTTP client, routing | React, Vite, Recharts, Tailwind CSS, Fetch-style async service boundary, React Router |

### Project tasks

1. Map each brief requirement to a screen or reusable module.
2. Set up the React/Vite app, styling, routing, charting, and mock data layer.
3. Define the workspace layout, responsive behavior, palette, typography, and chart/table components.
4. Build the Overview, Analytics, Sales, Customers, Reports, and Settings routes.
5. Add interactions: theme persistence, table search/sort/pagination, CSV export, navigation, and mobile drawer.
6. Document setup and review the app against the brief before submission.

### Assumptions and scope

- No production API, authentication contract, or backend credentials were provided. The app uses deterministic local fixtures behind async functions so it works offline; replace `src/services/api.js` with a real Fetch or Axios client when an endpoint is available.
- The brief does not define business metrics, chart dimensions, or visual branding. InsightX uses sample retail transactions and a neutral slate palette with indigo accents.
- The brief does not define date-filter behavior. The displayed date-range control is a visual affordance; it does not currently filter server data.
- “Sortable and searchable table” is implemented on the Overview transactions table. Search spans transaction, customer, plan, and status fields; sorting is available by column; pagination displays five rows per page.
- A local wireframe document is used instead of a Figma mock-up so design decisions remain versioned with the code and need no external account.

## 02. Environment and tools setup

### Stack configured in this repository

- Node.js and npm for dependency management and scripts (Node.js 18+ recommended for Vite 6)
- React 18, Vite 6, and React Router 6
- Recharts for responsive charts and Lucide React for icons
- Tailwind CSS 3, PostCSS, and Autoprefixer
- Git for version control

The application and configuration are already present in this repository. Install dependencies and start the development server with:

```bash
npm install
npm run dev
```

Create a production build and preview it with:

```bash
npm run build
npm run preview
```

`npm test` runs the Node.js feature tests for transaction search, sorting, pagination, CSV formatting, and mock API data, then creates a Vite production build.

### IDE and repository

The source is IDE-independent and can be opened in VS Code or another editor with JavaScript/React support. A GitHub remote is already configured for this project:

```text
https://github.com/trishank18/insightx-dashboard
```

To inspect the remote or publish future commits, use `git remote -v` and `git push`. Creating or pushing to a repository requires an authenticated GitHub account.

## 03. UI/UX design and wireframing

The design uses a familiar SaaS analytics layout: persistent desktop navigation, a sticky top bar, compact KPI cards, responsive chart panels, and a transaction table. The mobile sidebar becomes a drawer, card grids collapse to fewer columns, and wide tables scroll within their own panel.

- **Palette:** slate backgrounds and borders, indigo (`#635bff`) for primary actions and chart emphasis, emerald for positive states, and amber/rose for attention states.
- **Typography:** system UI sans-serif with heavier weight for page titles and metric values.
- **Components:** shared `Shell`, `Kpi`, loading/retry state, Recharts panels, and `Transactions` table.
- **Accessibility:** labeled icon buttons and inputs, semantic table headings, visible control text, and keyboard-operable native buttons and links.

See [docs/wireframes.md](docs/wireframes.md) for the desktop layout sketch, component map, and responsive notes.

## Mock data service

`src/services/api.js` exports `fetchDashboard`, `fetchTransactions`, and `fetchCustomers`. They return promises with simulated latency and deterministic retail-order fixtures spanning January 2023 through December 2025. The data follows a Sample Superstore-style shape and is bundled locally for reliable offline use.

## Testing and debugging

Run the complete check with:

```bash
npm test
```

The automated tests cover case-insensitive search and no-match behavior, numeric/text/date sorting, empty and out-of-range pagination, CSV escaping, and consistency of mock dashboard/customer data. The same command verifies that Vite can produce a production build. The dashboard has also been opened at desktop and mobile sizes to review route rendering, chart visibility, and responsive layout.

## Screenshots

These screenshots show the running app at desktop and mobile sizes:

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
- `/customers` — customer list
- `/reports` — CSV export actions
- `/settings` — workspace preferences

## GitHub workflow

The project remote is configured as `origin`. After reviewing changes, commit and push them with:

```bash
git add .
git commit -m "Update InsightX dashboard"
git push
```

## Submission checklist

- [ ] Capture Overview, Analytics, and mobile screenshots under `docs/screenshots/`
- [ ] Run `npm test` and confirm the production build check passes
- [ ] Push the final changes to the configured GitHub repository
- [ ] Prepare a short walkthrough of the design and interactive features
