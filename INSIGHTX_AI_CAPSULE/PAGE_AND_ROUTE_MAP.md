# Page and route map

| Path | View | Data | Notes/status |
|---|---|---|---|
| `/` | LandingPreview | Hard-coded illustrative preview | Current SPA root in App; live deploy not checked |
| `/welcome` | LandingPreview | Same | Alias |
| `/landing-preview.html` | LandingPreview | Same | Alias branch |
| `/dashboard` | Overview | GET `/api/dashboard` | KPI, revenue/channel charts, transaction table |
| `/analytics` | Analytics | GET `/api/dashboard` | revenue/record line chart, region bar chart |
| `/sales` | Sales | GET `/api/dashboard` | KPIs, region/category bar charts |
| `/customers` | Customers | GET `/api/transactions` | segment table only |
| `/reports` | Reports | GET `/api/transactions` | 3 CSV downloads |
| `/custom-analysis` | CustomAnalysis | Browser-selected CSV | No server request or persistence |
| `/settings` | Settings | localStorage | workspace name, timezone, weekly digest |
| unmatched | Overview fallback | GET `/api/dashboard` | Does not redirect/canonicalize URL |

All workspace views share Sidebar and top header. Date selector is hidden on Settings and Custom Analysis. The root landing page has independent page navigation anchors and dashboard links.
