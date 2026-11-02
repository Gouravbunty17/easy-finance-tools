# Easy Finance Tools visual system v2.0

This is a visual refresh, not a calculator formula or data-rule migration.

## Brand
- Finance navy `#0B2447`, deep navy `#071A32`
- Finance teal `#137B70`, light teal `#65E0C4`
- Warm gold `#E7AB57` used for small highlights, not low-contrast body text
- Cloud `#F5F7FA`, ink `#172B46`
- No remote font dependency. System UI stack (Inter when already available)
- Favicon is a square chart mark; React logo uses the matching symbol and wordmark

## Shared UI primitives
Styles in `src/index.css`: `eft-hero`, `eft-brand-button`, `eft-outline-button`,
`eft-surface`, `eft-tool-card`, `eft-kpi-card`, `eft-workspace`,
`eft-calculator-page`, `eft-allocation-fill`.

## Updated surfaces
- Sticky branded navigation with preserved search, route links and dark mode
- Homepage hero split with a source-backed 2026 TFSA/RRSP preview and direct finance tool paths
- Card-based tools library with smaller mobile category controls
- Core Income Tax, TFSA, RRSP, Mortgage, Dividend calculator surfaces
- Shared CalculatorLayout input/results split and result cards for other compatible tools
- Portfolio Analyzer with editor flow, readable dashboard and proportional account donut
- Footer with grouped calculator, editorial and legal routes

## Invariants
- CRA reference values in the homepage illustration are not personalized contribution room.
- Do not alter calculator algorithms, internal route strings, analytics metadata or user privacy behavior during visual-only changes.
- Do not block source notes, warnings, disclaimers, privacy language or legacy URL redirects.
- Never introduce external fonts/trackers, and respect reduced-motion preferences.
- On mobile, ensure no input field is narrower than a usable single-column entry.
- Keep the Portfolio Analyzer beta noindex until its outstanding review is completed.

## Release checklist
- npm ci && npm test && npm run build && npm run audit:seo && npm run audit:site-quality
- Check the homepage, tools search, each key calculator and the Portfolio Analyzer in mobile light/dark modes.
- Check actual Vercel deployment status separately; passing CI does not prove production deployment.
