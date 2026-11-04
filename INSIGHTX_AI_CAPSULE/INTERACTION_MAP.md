# Interactive element inventory

This inventory is source-derived, not a claim that each control passed a browser test. Current interaction/browser verification is listed in [testing documentation](TESTING_DOCUMENTATION.md).

## Workspace shell (`src/App.jsx`)

| Element | Behavior/target | State/API | QA status |
|---|---|---|---|
| Sidebar links (7) | Dashboard, Analytics, Sales, Customers, Reports, Custom Analysis, Settings | React Router; drawer closes | Source handlers present; current browser unverified |
| Mobile open, close, overlay | Open/close drawer | `open` state | Source handlers present; responsive UI unverified |
| Contact support / close | Toggle static support info dialog | local state | No real contact integration |
| Search pages input/results | Filter nav labels and navigate; no-results message | local state | Desktop-only from `md`; mobile absent |
| Notifications / close / Mark as read | Toggle mock panel, clear unread dot | local state | Not backed by notification API |
| Theme toggle | Toggle dark class and save | localStorage | Source present; no current browser test |
| Date range select | all/12/6 months | localStorage; filters workspace | Service unit tests; UI unverified |
| KPI more options (4 Overview, 3 Sales) | Toggle menu; View analytics navigation | local state/router | Source present; UI unverified |
| Overview chart range | 6/12/all months | local state; chart data | Source present; UI unverified |

## Overview transactions

Search transactions; six sortable table headings (Sale, Sales rep, Category, Sales, Customer type, Date); Export; Previous/Next pagination. Search/sort/pagination/CSV services have automated unit coverage. Browser download and button operation not verified this snapshot.

## Reports and Settings

Three Export CSV buttons (monthly, segments, channel); workspace name input; timezone select; weekly digest checkbox; Save changes. Report serialization and preference persistence/validation are unit tested. Actual downloaded file and form via browser not checked this snapshot. Weekly digest does not send mail.

## Custom Analysis

CSV chooser; replace chooser; Clear uploaded data; numeric column select; category column select; uploaded-record search; Export CSV; Previous/Next. Parser and file validation are unit-tested. File chooser, charts, downloaded CSV, and clear workflow not browser-tested in this audit.

## Landing page (`src/LandingPreview.jsx`)

Anchor navigation Home/Features/Analytics/About/Contact, Explore dashboard links, landing theme toggle, mobile menu toggle, refresh sample animation, three expandable sample KPI cards, metric tabs, 6/12-month selector, Line/Bar switches, compare checkbox, FAQ accordion, CTA and footer/back-to-top links. All mutate local preview state or navigate/anchor; charts use sample data, no API. Root landing page current revision requires browser QA.
