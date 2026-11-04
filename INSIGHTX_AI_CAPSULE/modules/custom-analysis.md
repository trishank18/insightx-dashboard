# Custom Analysis module

**Files:** `src/CustomAnalysis.jsx`, `src/services/csvUpload.js`, `src/services/salesData.js`, shared CSV export helper in `transactions.js`.

CSV input max 5 MiB, `.csv` extension; generic table parser accepts arbitrary headers and preserves cell values. The page infers numeric/date/text fields, provides record/column/numeric/date counts, area chart for first 200 numeric rows, category donut/bar, searchable 10-row table and filtered CSV export. Dataset and filename live in App memory only. No API, local storage, or backend upload. Tests cover parser and file validation; browser interaction flow remains unverified.
