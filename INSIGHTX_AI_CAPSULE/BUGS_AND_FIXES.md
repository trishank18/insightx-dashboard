# Bugs and fixes

## Confirmed bugs

No application bug was proven from the available source and current automated tests in this audit. Avoid turning missing browser evidence into a bug claim.

## Verification gaps / observations

- Current landing page redesign was not covered by the older browser report: needs verification.
- Custom Analysis file selection, responsive layout and interactions have parser tests but no browser evidence: needs verification.
- Header page search is hidden below `md` and has no visible mobile counterpart in source: UX observation; not confirmed bug.
- Weekly digest copy promises email but implementation only persists a boolean preference; no mail integration exists. It is a demo preference, not a functioning email delivery feature.
- Vite build emits chunk-size advisory for 706.29 kB minified JS; performance optimization opportunity, not confirmed runtime failure.
- npm audit request failed at registry endpoint; security state unknown, not a vulnerability finding.

## Historical fixes

See `docs/qa-audit.md` and `DEVELOPMENT_HISTORY.md`; those describe historical backend integration, CSV isolation and prior browser checks. Do not attribute historical fixes to this capsule session.
