# Testing documentation

## Current audit execution (2026-11-04)

| Check | Result | Evidence/limits |
|---|---|---|
| `npm.cmd test` | PASS | Node tests 23/23; Vite production build succeeded |
| Vite production build | PASS with advisory | `dist` emitted; JS 706.29 kB minified, over 500 kB advisory |
| `npm.cmd audit --omit=dev` | UNAVAILABLE | Registry advisory request failed; audit did not report vulnerability count |
| Deployed URL page read | UNAVAILABLE | Web page reader could not access URL |
| Browser route/control/console/network matrix | NOT RUN | No browser automation tool/config found in project/session |

PowerShell's `npm` alias initially failed due execution policy; `npm.cmd test` ran successfully. No application functionality was changed during audit.

## Automated test inventory

- `tests/api.test.js`: endpoint shapes, counts and method rejection.
- `tests/csvUpload.test.js`: sales/generic CSV upload parsing and validation.
- `tests/preferences.test.js`: storage defaults, validation, persistence.
- `tests/routes.test.js`: API client failure/success and view data services (despite filename, no React router rendering).
- `tests/salesData.test.js`: CSV parse, aggregation, date range.
- `tests/transactions.test.js`: search, sorting, paging, CSV/report schemas.

## Checklist for next browser pass

- [ ] `/`, `/welcome`, `/landing-preview.html`, `/dashboard`, `/analytics`, `/sales`, `/customers`, `/reports`, `/custom-analysis`, `/settings`, unknown path.
- [ ] Sidebar links; mobile open/close/overlay; responsive at 390, 768, 1440 widths.
- [ ] Landing anchor/mobile menu/theme/refresh/metric/date/chart/comparison/FAQ/CTAs.
- [ ] Workspace date filter and persistence across page reload.
- [ ] KPI menus, page search, notifications close/read, support open/close, theme persistence.
- [ ] Overview table query, all sort columns, empty state, pagination, CSV download.
- [ ] Reports exports and content; Settings validation/save/reload/storage failure.
- [ ] Custom upload valid/invalid/oversize, replacement, clear, inferred controls, chart updates, search, pagination, export.
- [ ] Loading/error/retry states by failing endpoints; empty API response behavior.
- [ ] Console exceptions, failed requests, horizontal overflow, keyboard/focus/accessibility basics.

Record browser/version, dimensions, action, expected/actual, console/network evidence and screenshots. Do not mark pass based on code inspection alone.
