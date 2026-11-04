# UI and UX documentation

## Workspace design

Tailwind utility styles in `src/App.jsx`; shared tokens in `src/index.css` and `tailwind.config.js`. Font stack begins with Inter then system UI; no font package/import. Palette: brand indigo `#635bff`, slate neutral backgrounds/text/borders, emerald positive, amber/rose attention; charts use red `#ef4444`, green `#22c55e` (plus rotating category colors). Light background `#f8fafc`; dark mode slate `950/900`. Cards rounded `2xl`, soft shadow `0 8px 30px rgba(15,23,42,.06)`. Buttons have rounded-xl and color transition. Sidebar fixed 16rem width with rounded-xl nav; header sticky at 5rem. Text sizes use Tailwind xs/sm/base/lg/2xl/3xl, KPI value 2xl/black. Common spacing 4/5/6 utility scale.

Workspace breakpoints use Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Sidebar fixed at `lg`; header search visible at `md`; table panels horizontally scroll. Verify these against configured Tailwind defaults when modifying.

## Landing page

Separate bespoke CSS in `src/landing.css` (about 59 KB), with custom variables, typography, sections, transitions, sample dashboard and responsive menu. Its actual detailed tokens and breakpoints are encoded in that file; measure before changing. Do not assume it shares workspace theme/state styling. Current live visual state is not browser-checked in this audit.

## Preserve

- Keep workspace data distinguishable from illustrative landing demo values.
- Keep custom CSV private to browser session and separate from workspace API data.
- Keep dark-mode contrast, scroll-contained wide tables, semantic labels, and existing indigo/slate visual language.
- Avoid altering the visual system or route shell without documenting decisions.
