# Security documentation

- No authentication, authorization, user account, database or write API exists. Three public read-only endpoints expose demo sales data.
- `sales_data.csv` is read by backend handlers and included in Vercel functions; Vercel config rewrites SPA paths. Preserve the intent not to serve this CSV as a public static file.
- User CSV is read via browser `File.text()` and remains in page memory; not sent to API or persisted. 5 MiB size and `.csv` extension validation are client-side; do not treat this as a server security boundary.
- Settings/theme/date values are localStorage and untrusted input; preferences validates settings on save/load.
- UI renders parsed cell values as React text; no raw HTML insertion observed in inspected components.
- No credentials or environment variables were needed or inspected. No `.env.example` or auth configuration found.
- Current dependency advisory scan unavailable due npm registry access failure. Do not claim zero vulnerabilities for this audit.

The above is source review, not a formal security assessment.
