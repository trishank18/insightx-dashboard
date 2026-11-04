# State management

No global state library. Local React `useState`/`useEffect`/`useMemo` state is used.

| State | Owner | Persistence/scope |
|---|---|---|
| dark theme | `useTheme` in App | localStorage `insightx-theme`; html class |
| date range | `App` | localStorage `insightx-date-range`; shared workspace pages |
| mobile nav open | `App`/Shell | memory only |
| uploaded dataset and filename | `App` | memory only; lost on refresh |
| page search, notifications, support | `Shell` | memory only |
| overview chart range | `Overview` | memory only, defaults 6 |
| transaction query/page/sort | `Transactions` | memory only; query/sort local to route |
| settings form | `Settings` | `insightx-settings` localStorage on Save |
| custom columns/upload busy/error | `CustomAnalysis` | memory only |
| custom records table query/page | `RecordsTable` | memory only; resets on fileName key change |
| landing demo controls | `LandingPreview` | in-memory sample state |

Storage loaders tolerate malformed values (preferences service); `useTheme` and initial date lookup access localStorage directly. Browser storage denial/private contexts may therefore fail theme/date initialization or update; settings has explicit save error handling. Tests cover settings persistence, not theme/date storage failures.
