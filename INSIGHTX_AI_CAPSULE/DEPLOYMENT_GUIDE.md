# Deployment guide

Repository is configured for Vercel: `api/*.js` functions include `sales_data.csv`; rewrite sends routes to `index.html`. Configured public URL is https://insightx-dashboard-bice.vercel.app/ and Git remote is `https://github.com/trishank18/insightx-dashboard.git`.

Local sequence: `npm install`, `npm run build`, `npm run preview`; verify `/api/dashboard`, `/api/transactions`, `/api/customers`, then direct-load SPA nested routes. Deployment status at snapshot: configured, but live health/content was not verified by available page reader. Do not claim current deploy is healthy solely from repository config.
