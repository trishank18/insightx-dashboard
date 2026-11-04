# Dashboard analytics

## Data source and fields

`sales_data.csv` is parsed by `api/_data.js` into 1,000 rows with sale ID, product ID, date, rep, region, amount, quantity, category, unit cost/price, customer type, discount, payment method, channel. Date range spans Jan 2023–Jan 2024. Currency display/export is INR.

## Metrics and charts

`aggregateSales()` in `src/services/salesData.js` derives revenue, transaction count, units, average order, monthly sales/counts, channels/share, regions, categories and customer segments. KPI month change compares latest month with prior month (see implementation for zero-baseline handling). Date range means latest N distinct months found in dataset, not now-minus-N calendar months. Overview's revenue chart has a separate 6/12/all point window on already filtered aggregate data. Analytics draws revenue and records on dual axes and regional revenue bars. Sales page draws region/category revenue bars. Customer table reports New/Returning only. Reports export monthly, segment, and channel datasets.

Main workspace date filter state is persisted. It scopes KPIs, workspace charts, customer segments, transaction rows, and report exports. It does not scope landing sample values or uploaded CSV analysis.

The landing preview uses illustrative arrays and static KPI values; its controls alter the sample visualization only. Never describe it as live API analytics.

Automated coverage: `tests/salesData.test.js`, `tests/transactions.test.js`, `tests/api.test.js`, `tests/routes.test.js`. Current chart rendering and chart-control interactions lack current automated/browser evidence.
