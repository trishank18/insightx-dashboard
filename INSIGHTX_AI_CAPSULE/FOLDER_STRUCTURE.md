# Folder structure

```text
api/                  Vercel GET handlers and CSV-backed shared data
docs/                 Existing QA audit, wireframe, screenshots
dist/                 Generated Vite output (not source of truth)
public/               Public static assets (favicon)
src/                  React UI, styles, services
  App.jsx             workspace shell, routes, dashboard views
  LandingPreview.jsx  homepage/demo preview
  CustomAnalysis.jsx  user-uploaded CSV view
  services/           data, API, preferences, transaction/export helpers
tests/                node:test suites
INSIGHTX_AI_CAPSULE/  this project memory capsule
sales_data.csv        source demo data read by API; not public static data
```

Config: `package.json`, `package-lock.json`, `vite.config.js`, `vercel.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`. No `AGENTS.md`, Playwright/Vitest configuration, or environment example was found in this audit. `landing-preview.html` is an extra HTML entry-looking file but its role in production routing is unverified; App's pathname branch is authoritative for SPA routes.
