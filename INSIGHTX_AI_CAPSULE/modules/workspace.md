# Workspace module

**Files:** `src/App.jsx`, `src/index.css`, `src/services/api.js`, `salesData.js`, `transactions.js`.

Shared shell is desktop sidebar + sticky header, with responsive mobile drawer. Routes consume API data and aggregate client-side. Overview includes four KPI cards, area chart, donut, searchable/sortable/paginated table and export. Analytics has dual-axis line and region bar; Sales has three KPIs and region/category bars; Customers lists new/returning; Reports downloads three CSVs. Date filter shared and persisted. UI uses Recharts; currency INR. Test evidence for service functions exists, but current browser verification required.
