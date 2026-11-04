# Performance report

Current measured build: Vite 6.4.5; JS 706.29 kB minified / 198.88 kB gzip; CSS 78.32 kB / 16.40 kB gzip. Vite warns chunks exceed its 500 kB advisory. Production build succeeds. No runtime profiling, Core Web Vitals, production network waterfall or mobile-device measurement was run.

Likely investigation: route-level lazy loading and Recharts/vendor chunking. Establish baseline and verify route loading/error handling before optimization. Do not raise warning threshold merely to hide it.
