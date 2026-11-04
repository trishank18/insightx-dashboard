# Start here: InsightX Dashboard memory capsule

This capsule is a portable, repository-backed project memory for future agents. Audit snapshot: 2026-11-04. Read the [master capsule](MASTER_PROJECT_CAPSULE.md), [current status](CURRENT_STATUS.md), [architecture](ARCHITECTURE.md), [features](FEATURE_DOCUMENTATION.md), [interaction map](INTERACTION_MAP.md), and [task tracker](TASK_TRACKER.md), then inspect source code and compare it with these notes.

## Agent workflow

1. Read `MASTER_PROJECT_CAPSULE.md`.
2. Read `CURRENT_STATUS.md`.
3. Read `ARCHITECTURE.md`.
4. Read `FEATURE_DOCUMENTATION.md`.
5. Read `INTERACTION_MAP.md`.
6. Read `TASK_TRACKER.md`.
7. Inspect the actual source code.
8. Compare this capsule with the current implementation.
9. Identify the last completed task in `sessions/SESSION_HISTORY.md` and `handoffs/LATEST_HANDOFF.md`.
10. Continue from the latest verified state; do not repeat completed work unnecessarily.

Never remove existing functionality without approval. Preserve the current design system and architecture unless a documented improvement requires a change. Never store API keys, credentials, or private environment variables. Do not invent APIs or data sources. Mark untested behavior as unverified.

After each major change update the feature and component documentation, interaction inventory, task tracker, modified files, bug/solution notes, test evidence, current status, next steps, and latest handoff. Preserve old decisions and audit reports as history instead of silently overwriting them.

## Capsule map

- `MASTER_PROJECT_CAPSULE.md`: concise orientation and source of truth rules.
- `PROJECT_OVERVIEW.md`, `ARCHITECTURE.md`, `FOLDER_STRUCTURE.md`: project and system structure.
- `PAGE_AND_ROUTE_MAP.md`, `COMPONENT_DOCUMENTATION.md`, `FEATURE_DOCUMENTATION.md`: UI inventory.
- `DASHBOARD_ANALYTICS.md`, `DATA_FLOW_DOCUMENTATION.md`, `API_DOCUMENTATION.md`, `STATE_MANAGEMENT.md`: data and behavior.
- `UI_UX_DOCUMENTATION.md`, `INTERACTION_MAP.md`: design and interactive controls.
- `DEVELOPMENT_HISTORY.md`, `DECISION_LOG.md`, `TASK_TRACKER.md`, `BUGS_AND_FIXES.md`: history and work queue.
- `TESTING_DOCUMENTATION.md`, `PERFORMANCE_REPORT.md`, `SECURITY_DOCUMENTATION.md`: verification and quality.
- `CONFIGURATION_GUIDE.md`, `DEPLOYMENT_GUIDE.md`, `CURRENT_STATUS.md`, `NEXT_STEPS.md`: operations and handoff.
- `modules/`: detailed module notes; `sessions/`: session logs; `handoffs/`: continuation notes.

All paths are relative to repository root unless stated otherwise. Source code wins over stale documentation. The deployed URL could not be inspected using the available page reader during this audit; live behavior is not claimed.
