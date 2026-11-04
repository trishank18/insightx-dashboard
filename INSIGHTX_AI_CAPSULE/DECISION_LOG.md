# Decision log

| Decision | Rationale/evidence | Status |
|---|---|---|
| Use React/Vite SPA with React Router | Current app implementation | Current |
| Keep sales dataset behind public read-only API functions | README, API files, Vercel config; CSV is not a public static asset | Current; no auth by design |
| Use CSV demo data and INR formatting | `sales_data.csv`, services, UI | Current |
| Report customer segments, not people | Dataset lacks individual identities | Current |
| Keep arbitrary uploaded CSV separate and browser-only | `CustomAnalysis`, upload service, README | Current |
| Use localStorage for theme/range/settings | source; no server-side preference API | Current |
| Landing preview uses clearly marked sample values | `LandingPreview.jsx` copy and static data | Current; keep illustrative labels |
| No auth/database/email integration | README/API source | Scope constraint, not a missing implementation defect unless requirements change |

Future changes should append decisions and mark superseded entries; do not rewrite history silently.
