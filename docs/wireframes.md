# InsightX wireframe and UI plan

This lightweight wireframe records the design decisions for Problem Statement 02. It is tool-independent so it can be reviewed alongside the source code without requiring a Figma account.

## Desktop shell

```text
+----------------------+------------------------------------------------------+
| InsightX              | Breadcrumb / Page title       Search  Bell  Theme   |
|                       +------------------------------------------------------+
| Overview              | Greeting + date range                         |
| Analytics             +-------------+-------------+-------------+-------------+
| Sales                 | Revenue     | Customers   | Conversion  | Churn       |
| Customers             | KPI card    | KPI card    | KPI card    | KPI card    |
| Reports               +------------------------------+-----------------------+
| Settings              | Revenue area chart            | Acquisition donut    |
|                       +------------------------------------------------------+
| Help card             | Recent transactions + search + sort + export       |
|                       | Table rows                                 Pagination |
+----------------------+------------------------------------------------------+
```

## Mobile shell

```text
+----------------------------------+
| Menu   Page title       Theme    |
+----------------------------------+
| Greeting + date range            |
| +------------------------------+ |
| | KPI card                     | |
| +------------------------------+ |
| | KPI card                     | |
| +------------------------------+ |
| | Revenue chart                | |
| +------------------------------+ |
| | Acquisition donut            | |
| +------------------------------+ |
| | Transactions (scroll panel)  | |
+----------------------------------+
```

## Responsive behavior

- At desktop widths, the sidebar stays visible and the content uses a two or three column grid.
- At tablet widths, cards wrap into fewer columns while charts retain responsive containers.
- At mobile widths, the sidebar becomes an overlay drawer, controls wrap, and tables scroll inside their panel to prevent page-level horizontal overflow.

## Component map

- `Shell`: navigation, top bar, theme control, and responsive drawer
- `Kpi`: reusable summary metric card with a trend state
- `Transactions`: search, column sorting, five-row pagination, status badges, empty state, and CSV export
- Recharts modules: revenue area/line, conversion bar, and acquisition donut charts
- `src/services/api.js`: async mock REST boundary with deterministic fixtures and simulated latency

## Visual tokens

- Slate neutrals for text, surfaces, borders, and dark mode
- Indigo (`#635bff`) for primary actions and the main chart series
- Emerald for positive trends; amber and rose for attention states
- System UI sans-serif, with bold page titles and high-contrast KPI values
