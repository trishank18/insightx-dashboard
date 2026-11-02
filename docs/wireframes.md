# InsightX wireframe and UI plan

This lightweight wireframe records the design decisions for Internship Problem Statement 02 before implementation. It is intentionally tool-independent so it can be reviewed alongside the source code without requiring a Figma account.

## Desktop shell

```text
+----------------------+------------------------------------------------------+
| InsightX              | Breadcrumb / Page title       Search  Bell  Theme   |
|                       +------------------------------------------------------+
| Overview              | Greeting + date range                         |
| Analytics             +----------------+----------------+----------------+
| Sales                 | Revenue         | Active users   | Conversion     |
| Customers             | KPI card        | KPI card       | KPI card       |
| Reports               +----------------+----------------+----------------+
| Settings              | Revenue line/area chart        | Donut sources  |
|                       +-----------------------------------------------+
| Help card             | Recent transactions table + search + pagination  |
+----------------------+------------------------------------------------------+
```

## Responsive behavior

- At desktop widths, the sidebar remains visible and the content uses a two/three-column grid.
- At tablet widths, cards wrap into fewer columns while charts retain responsive containers.
- At mobile widths, the sidebar becomes an overlay drawer, controls wrap, and tables remain readable without page-level horizontal overflow.

## Component map

- `Shell`: navigation, top bar, theme control, responsive drawer
- `Kpi`: reusable summary metric card with trend state
- `Transactions`: search, pagination, status badges, and export action
- Recharts modules: revenue area/line, category bar, and acquisition donut charts
- `src/services/api.js`: async mock REST boundary with deterministic fixtures and latency
