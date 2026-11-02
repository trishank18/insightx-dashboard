# InsightX Dashboard

InsightX is a polished, responsive revenue-intelligence SaaS dashboard created for **Internship Problem Statement 02**. It turns product, customer, and sales data into an approachable workspace for daily decision-making.

## Requirement analysis

The supplied brief requires:

- A dashboard shell with sidebar, top bar, breadcrumbs, search, profile controls, and summary cards
- At least three interactive chart types: line, bar, and pie/donut
- A searchable, sortable, paginated transactions table with status badges and empty states
- Light/dark theme switching with persistence
- Data loaded through a mock REST API with loading, invalid-response/error, and retry states
- Responsive, accessible UI built with React, Vite, Tailwind CSS, Recharts, React Router, and Fetch-style async API logic
- Testing, documentation, GitHub publishing, and an email submission to `admin@infionex.com`

### Assumptions

- The brief does not provide a production backend, authentication contract, exact brand guidelines, or a date-range API. InsightX therefore uses a curated retail-order fixture modeled on the public Sample Superstore dataset format behind an async service boundary.
- “API integration” is demonstrated with a REST-like local mock service so the demo is reliable offline; `src/services/api.js` is the replacement point for a real Fetch/Axios client.
- Report export is implemented as browser-generated CSV. PDF scheduling, authentication, and server-side aggregation are intentionally future enhancements.
- GitHub repository creation and email delivery require the submitter’s GitHub account and credentials, so the repository commands are documented but not run automatically.

## Features

- Responsive desktop sidebar and mobile navigation drawer
- Overview KPI cards with revenue, customers, conversion, and churn trends
- Recharts revenue area, growth line, conversion bar, and acquisition donut charts
- Searchable, paginated transactions table with status badges
- Dedicated Analytics, Sales, Customers, Reports, and Settings pages
- Light/dark theme persisted in `localStorage`
- Accessible labels, keyboard-friendly controls, loading and retry states
- CSV report export generated locally in the browser
- Mock REST-like service using async/await and realistic latency
- No external API or runtime service dependency

## Stack

React 18 · Vite · React Router · Recharts · Lucide React · Tailwind CSS · PostCSS

## Design and wireframe

The visual direction is a minimal SaaS analytics workspace:

- **Palette:** slate neutrals for structure, indigo (`#635bff`) for primary actions, emerald for positive trends, amber/rose for attention states.
- **Typography:** system UI sans-serif for fast loading and clear numeric hierarchy.
- **Structure:** persistent desktop sidebar, responsive mobile drawer, sticky top bar, card-based content grid, and tables that scroll safely on small screens.
- **Interaction:** subtle hover/focus transitions, visible status badges, responsive charts, keyboard-accessible buttons, and persisted theme preference.

The wireframe outline is documented in [`docs/wireframes.md`](docs/wireframes.md).

## Development plan and module checklist

1. **Requirement analysis:** map the brief to routes, reusable UI components, chart modules, table behavior, API states, and submission artifacts.
2. **Environment setup:** install Node.js, initialize the Vite project, install dependencies, and configure Tailwind/PostCSS.
3. **UI/UX design:** establish the palette, typography, spacing, responsive breakpoints, and wireframe before implementation.
4. **Module development:** implement the shell, theme state, mock service, overview, analytics, sales, customers, reports, settings, charts, and transactions table.
5. **Testing/debugging:** run production builds, verify the dev server, test search/pagination/theme/navigation manually, and fix regressions before submission.
6. **Documentation/submission:** add screenshots, push to GitHub, and email the repository/report/deployment links to `admin@infionex.com`.
7. **Demo readiness:** use the Overview route to demonstrate KPI cards, chart tooltips, the table, theme toggle, mobile drawer, and report export.

## Getting started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`, preview it with `npm run preview`, and run the project check with `npm test`.

## Mock API

`src/services/api.js` acts as a small local REST-like data layer. Its exported `fetchDashboard`, `fetchTransactions`, and `fetchCustomers` functions return Promises, include a short delay, and provide deterministic retail orders with products, categories, regions, dates, amounts, and payment statuses across **January 2023 through December 2025**. The fixture follows the structure of the public Tableau Sample Superstore benchmark while remaining bundled for reliable offline demos; replace this service with a real Fetch/Axios endpoint when backend access is available.

## Screenshots

Add screenshots of the Overview, Analytics, and mobile drawer here before submission:

![Overview screenshot placeholder](docs/screenshots/overview.png)

## Future improvements

- Connect authentication and role-based workspaces
- Add date-range filtering backed by server-side aggregation
- Add saved report schedules and PDF export
- Add richer cohort, retention, and segmentation analysis
- Add unit and end-to-end test suites

## GitHub commands

```bash
node --version
npm --version
npm install
git init
git add .
git commit -m "Build InsightX analytics dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/insightx-dashboard.git
git push -u origin main
```

## Submission

Replace the repository URL above with your public GitHub repository, verify the deployed build, then email the repository and deployment links to **admin@infionex.com**. Include your name, problem statement number (02), and a short list of implemented features.

## Final submission checklist

- [ ] Add Overview, Analytics, and mobile screenshots under `docs/screenshots/`
- [ ] Replace the placeholder GitHub remote with the public repository URL
- [ ] Run `npm test` and confirm the production build passes
- [ ] Push the complete code and README to GitHub
- [ ] Email the repository link, report/documentation link, and deployment link to `admin@infionex.com`
- [ ] Prepare a short walkthrough covering the design decisions and interactive features
