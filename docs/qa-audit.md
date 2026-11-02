# InsightX end-to-end QA audit

**Audit date:** 2026-11-02

**Scope:** Source, project configuration, feature tests, dependency tree, and browser-visible routes and controls.

## Executive result

The dashboard’s implemented frontend features pass the automated feature suite, production build, dependency audit, and headless Chrome smoke audit. Three reports and the transaction table produce separate CSV downloads. Six routes render at desktop, tablet, and mobile widths without page-level horizontal overflow or browser runtime errors.

This repository is a frontend demo. It contains no backend service, remote REST API, authentication, database, ML module, or external integration. Those areas cannot be certified by this audit because they are not implemented. The local mock API always resolves fixtures, so its network failure/retry path is present in the UI but was not exercised against a real failing service.

## Project inventory

| Area | Files / components | Finding |
| --- | --- | --- |
| Frontend | `src/App.jsx`, `src/main.jsx`, `src/index.css` | React single-page app with six routes and shared shell |
| Data services | `src/services/api.js` | Asynchronous deterministic fixtures; no HTTP requests |
| Table/report logic | `src/services/transactions.js` | Pure search, sorting, pagination, date parsing, and CSV helpers |
| Preferences | `src/services/preferences.js` | Settings validation and `localStorage` persistence |
| Build/config | `package.json`, `package-lock.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js` | Vite 6, React 18, Router 7, Recharts, Tailwind 3 |
| Automated tests | `tests/api.test.js`, `tests/preferences.test.js`, `tests/transactions.test.js` | 10 Node tests covering service and edge cases |
| Design/docs | `docs/wireframes.md`, `docs/screenshots/`, `README.md` | Wireframe notes and screenshots exist; README was aligned with current behavior |
| Local data file | root `sales_data.csv` | Present but not read by the application; left untouched |

No PHP/Python/backend source, SQL schema or migration, auth/session module, upload handler, or ML code was found. There are no configured server-side integrations. `dist/` and `node_modules/` are generated/dependency directories and are ignored by Git.

## Bugs found and corrections

| Issue | Cause | Correction | Verification |
| --- | --- | --- | --- |
| Every report export contained the same transaction CSV | Report cards shared a generic export dataset | Added separate monthly revenue, customer health, and acquisition CSV builders with distinct headers and filenames | Unit assertions plus browser downloads produced three separate report files |
| Monthly revenue could be grouped into the wrong month | Date-only/month labels were parsed using local-time assumptions | Parse supported month/year formats explicitly in UTC and aggregate chronologically | Unit test checks Oct 2023 → Jan 2024 → Feb 2024 order and amounts |
| Customers repeated once per order, with duplicate React row keys | Customer list was built directly from transaction fixtures | Aggregate by email, sum spend, and derive at-risk status across a customer's orders | API tests assert 10 unique customers and the aggregated spend; browser showed 10 customer rows |
| Several visible controls were inert or only decorative | Search, notifications, support, KPI menu, date/chart ranges, and settings did not update useful state | Connected them to navigation, popup state, filtering, and validated persisted settings | Browser checks exercised each implemented action |
| Changing date range while on a later table page could leave the user on a partial page | Table page state was retained when its source range changed | Reset pagination to page one when the selected transaction range changes | Browser test navigated to page two, changed to six months, and confirmed the first page showed 5 of 6 |
| Browser requested a missing favicon (404) | No favicon asset or link was present | Added `public/favicon.svg` and linked it from `index.html` | Final browser log had no failed resources |
| Report cards showed a stale 2024 update date | The card timestamp was hard-coded | Replaced it with a date-independent description of generated data | Source review plus final `npm test`/build; export behavior was covered in Chrome |
| React Router had two moderate advisories; v6 emitted future-flag warnings | Installed Router version fell within published affected range | Upgraded `react-router-dom` to 7.18.5, removed obsolete v6 future flags, and updated the Node requirement in README | `npm audit` reported 0 vulnerabilities; browser audit had no React/router warnings |
| README described old versions and called working controls visual-only | Documentation had not kept pace with implementation | Rewrote setup, stack, data assumptions, routes, and test instructions | Manual review against package/config and source |

No existing features were removed. The untracked `sales_data.csv` file was not modified or staged.

## Controls and route coverage

The browser audit opened every route directly at **1440×900**, **768×900**, and **390×900** (18 route/viewport combinations). It checked page width, route heading, chart presence where applicable, and rendered table rows. No page-level horizontal overflow occurred. Wide data tables remain contained in their own horizontal-scroll panels on narrow screens.

Headless Chrome interaction checks passed for:

- Desktop sidebar routes, global page search, and KPI “View analytics” navigation.
- Mobile drawer opening and closing after selecting a route.
- Transaction search, no-match state, numeric sorting, next/previous pagination, and transaction-range pagination reset.
- Transaction date-range and revenue-chart range selects.
- Dark/light theme toggle and stored theme value.
- Notification open/close and mark-as-read state.
- Support popup open/close.
- Workspace name, timezone selection, weekly digest checkbox, save feedback, and persisted values after route navigation.
- Transaction export and each of the three report exports. Observed files: `insightx-transactions.csv`, `insightx-monthly-revenue.csv`, `insightx-customer-health.csv`, and `insightx-acquisition-performance.csv`.

The UI has no radio group, password visibility control, date picker, file upload, or authentication form. Those controls are not present and therefore were not tested. The only checkbox is Weekly digest; it was toggled and persisted. The native select controls are transaction range, chart range, timezone, and normal browser dropdowns; each app select was changed during the audit.

## Automated and manual test results

| Check | Result | Evidence / limits |
| --- | --- | --- |
| `npm test` | **Passed** | 10/10 Node tests plus Vite production build |
| Production build | **Passed with warning** | Vite built successfully; main minified JS chunk is about 657 kB, above Vite's 500 kB advisory threshold |
| `npm audit` | **Passed** | `found 0 vulnerabilities` for the installed dependency tree |
| Headless Chrome route/responsive audit | **Passed** | 18 route/viewport combinations; 1440, 768, and 390 px widths |
| Headless Chrome interactions | **Passed** | Controls listed above; all four downloads observed with non-zero file sizes |
| Browser console/runtime and resource errors | **Passed** | None in final run after favicon fix |
| Error/retry branch against failed API | **Not executable here** | Fixtures do not reject and no network service exists to fail |
| Login, roles, sessions, password reset | **Not applicable** | No auth feature or credentials in this project |
| Database CRUD, SQL constraints, injection through SQL | **Not applicable** | No server/database driver or SQL code exists |
| Real API verbs, auth tokens, timeouts, integration | **Not applicable** | API exports are local async fixture functions, not HTTP endpoints |
| Security checks for frontend injection/secrets | **Reviewed** | No `dangerouslySetInnerHTML`, credential, token, or API-key implementation was found in app source; React renders fixture strings as text |

The build-size warning is an optimization opportunity, not a failed build. Route-level lazy loading or chart-library chunking could reduce initial download size if performance targets require it.

## Files changed in this audit pass

- `README.md` — corrected stack/setup and feature documentation.
- `index.html`, `public/favicon.svg` — fixed missing browser icon resource.
- `package.json`, `package-lock.json` — upgraded React Router to patched 7.18.5.
- `src/App.jsx` — wired controls, persisted settings, distinct report data, and reset table pagination on range changes.
- `src/services/api.js` — aggregate unique customers and spend.
- `src/services/preferences.js` — validated settings persistence.
- `tests/api.test.js`, `tests/preferences.test.js` — assertions for customer aggregation and settings persistence/validation.

The temporary browser harness used during this audit is removed after verification; the reusable committed regression suite is `npm test`.

## Remaining issues and limits

1. There is no backend or public REST API. Connect a real service before treating the dashboard as live business reporting.
2. Since fixture calls always resolve, real API error handling, retries, timeouts, authorization, and server-side validation still need integration tests when a backend is added.
3. There is no authentication, database, or role-based access to test.
4. The main bundle exceeds Vite's 500 kB warning threshold.
5. `sales_data.csv` is unused by the UI. Decide whether it is intended source data or an unrelated local file before submission; it was preserved and left out of the audit commit.

## Run instructions

```bash
npm install
npm run dev
```

Run regression tests and build:

```bash
npm test
```

Run the dependency scan:

```bash
npm audit
```
