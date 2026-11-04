# Configuration guide

Install with Node.js 20+ and npm, per README. Main scripts: `npm run dev`, `npm run build`, `npm run preview`, `npm test` (`node --test` + build). On this Windows PowerShell host, invoke `npm.cmd` because `npm.ps1` is blocked by script execution policy.

Config files: `vite.config.js` (React plugin and API middleware), `vercel.json` (function include and SPA rewrite), `tailwind.config.js` (class dark mode, brand/color/shadow), `postcss.config.js`, `index.html`. No environment variables/secrets are required by source. Do not add secrets to capsule.
