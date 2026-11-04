# Prioritized task tracker

Status vocabulary: COMPLETED, IN PROGRESS, PENDING, BLOCKED, NEEDS VERIFICATION. Bugs and optional enhancements are separate.

| Priority | Task | Status | Evidence/next action |
|---|---|---|---|
| P0 | Create portable, source-grounded project capsule | COMPLETED | This directory created; validate links/files and commit if requested |
| P1 | Browser QA current root landing page and interactions | NEEDS VERIFICATION | Existing QA predates current landing commits; no Playwright config/tool found |
| P1 | Browser QA Custom Analysis upload/clear/chart/search/export at desktop/mobile | NEEDS VERIFICATION | Prior audit explicitly says upload page browser workflow untested |
| P1 | Verify deployed Vercel routes and APIs | NEEDS VERIFICATION | Web reader could not access configured public URL; retry with browser/network tooling |
| P2 | Investigate JS bundle size (706.29 kB minified) | PENDING | Build warning; consider lazy route chunks / Recharts split, preserving behavior |
| P2 | Re-run npm audit when registry access works | BLOCKED | Current `npm.cmd audit --omit=dev` failed at advisory endpoint; no security conclusion |
| P2 | Review mobile discoverability of page search | NEEDS VERIFICATION | Source hides search below md with no mobile replacement; determine intended UX |
| P3 | Add route/component-level browser tests if existing project/tooling allows | PENDING | Do not add dependencies until need/tooling checked |

Application tests/build currently pass. No code-level broken feature was proven in this audit. See [bugs](BUGS_AND_FIXES.md) and [next steps](NEXT_STEPS.md).
