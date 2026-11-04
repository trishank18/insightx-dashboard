# Component documentation

| Component | Source | Responsibility / state |
|---|---|---|
| `App` | `src/App.jsx` | Route switch, workspace theme/drawer/date range, custom CSV data state |
| `Shell` | `src/App.jsx` | Sidebar, header, page search, notifications, support dialog, date selector |
| `BrandMark` | `src/App.jsx` | Inline SVG logo |
| `useTheme` | `src/App.jsx` | `insightx-theme` localStorage and `<html>.dark` |
| `DateRangeFilter` | `src/App.jsx` | all/12/6 month select |
| `Loading` | `src/App.jsx` | loading spinner and error/retry state |
| `Kpi` | `src/App.jsx` | summary card and per-card View analytics menu |
| `Overview` | `src/App.jsx` | dashboard API, KPIs, charts, transaction table |
| `Transactions` | `src/App.jsx` | query/sort/page state, table and filtered CSV download |
| `Analytics`, `Sales`, `Customers`, `Reports`, `Settings` | `src/App.jsx` | route page implementations |
| `CustomAnalysis` | `src/CustomAnalysis.jsx` | upload state, inferred field selection, summaries/charts |
| `UploadPanel` | `src/CustomAnalysis.jsx` | file chooser, validation error, clear/replacement |
| `RecordsTable` | `src/CustomAnalysis.jsx` | search, 10-row paging, filtered CSV download |
| `StatCard` | `src/CustomAnalysis.jsx` | generic CSV summary KPI |
| `LandingPreview` | `src/LandingPreview.jsx` | landing page sections and illustrative interactive chart preview |
| `AnimatedNumber`, `MiniChart` | `src/LandingPreview.jsx` | animated sample stat and custom SVG mini chart |

Most dashboard components are private functions in one large file, not individually exported. See module notes in `modules/`.
