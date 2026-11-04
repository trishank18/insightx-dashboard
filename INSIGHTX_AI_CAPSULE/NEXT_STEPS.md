# Next steps

1. Run a browser-based pass of the current landing page and dashboard route matrix, including mobile sizes; record console/network evidence.
2. Exercise Custom Analysis upload, replacement, invalid input, clear, select controls, search, pagination and download in browser.
3. Check deployed Vercel root and all API paths; distinguish production state from local build.
4. Retry `npm audit` once registry access works and record exact result.
5. Measure initial load and decide whether to split route/Recharts chunks; preserve existing behavior.
6. Clarify whether weekly digest is intentionally a local demo preference or should integrate with a mail service (no integration exists).

The first four tasks are verification, not assumptions that features are broken.

## Ready-to-use next-agent prompt

> Continue development of InsightX Dashboard from `INSIGHTX_AI_CAPSULE/START_HERE.md`. Read the master capsule, current status, architecture, feature catalog, interaction map, task tracker, and latest handoff before editing. The current landing redesign and Custom Analysis browser workflow have not been verified; the configured Vercel URL was inaccessible to the previous page reader. Start by browser-checking the current root page and upload workflow at desktop and mobile widths, recording console/network evidence. Verify deployed SPA routes and `/api/dashboard`, `/api/transactions`, `/api/customers`. Do not change application behavior during this verification pass. Preserve the separation between illustrative landing values, workspace API data, and in-memory uploaded CSV. After each major change, update the capsule and generate a new session handoff. Current automated baseline is 23/23 tests plus a successful build; npm audit was unavailable and the JS bundle is 706.29 kB minified.
