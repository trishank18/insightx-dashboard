# Project overview

InsightX is a demo sales analytics interface with a marketing landing page plus a data-backed workspace. It is designed to demonstrate interactive analytics, sales KPIs, reports, local preferences, and isolated user CSV analysis. It is not an authenticated multi-tenant SaaS product.

## Personas and data limits

The interface presents a workspace administrator persona, but the name/avatar are static display content and there is no account system. Source sales rows contain product/sale fields, not real customer identity. The Customers page therefore compares New and Returning segments only. Currency is INR.

## Current user journeys

1. Landing `/` → explore dashboard `/dashboard`.
2. Dashboard shell → navigate analytics/sales/customer segments/reports/settings.
3. Overview → date-range filter → search, sort, paginate, export sales rows.
4. Custom Analysis → choose CSV → inspect inferred columns/charts/table → search/export/clear.
5. Settings → change workspace label/timezone/digest preference → save locally.

See [route map](PAGE_AND_ROUTE_MAP.md) and [feature catalog](FEATURE_DOCUMENTATION.md).
