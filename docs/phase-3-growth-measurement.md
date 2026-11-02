# Phase 3 — Growth and measurement implementation

**Date:** November 3, 2026
**Domain:** https://easyfinancetools.com
**Status:** Changes committed; actual traffic/revenue data is not available through the connected GitHub repository.

## Changes shipped in source
- Homepage quick-entry links to the income-tax, TFSA and mortgage calculators, with event name `homepage_quick_start_click`.
- Move the lengthy account-framework article below goal routing and core tools. Keep educational content and accessible anchor targets.
- Mobile navigation buttons with at least 44px tap targets. Make tools categories horizontally scrollable at small widths and expose `aria-pressed` and live tool counts.
- Add topic-hub navigation to article headers where category matches an actual indexed topic hub.
- Remove misleading homepage "Wealthsimple referral link" label pointing only to a normal provider homepage; link to editorial affiliate disclosure instead.
- Restrict analytics metadata to generic approved categories; strip query strings/fragments from GA4 page locations, CTA destinations and SPA navigation events.
- Track portfolio analyzer start, CSV import success/failure and report views, without holdings/financial values.
- Track one income-tax result-view engagement after first input; stop treating every keystroke as a calculation conversion.

## Funnel definitions (GA4 events)
**Discover:** `page_view` by page path and device.
**Navigate:** `homepage_quick_start_click`, `homepage_goal_router_click`, `tools_goal_router_click`, `tools_card_click`.
**Engage:** `tool_start`; `tool_result_view` for auto-updating income tax.
**Portfolio beta:** `tool_start` → `portfolio_import_result` (for CSV) → `portfolio_report_view`.
**Next step:** `tool_result_cta_click`, `related_content_click`, `article_topic_hub_click`.
**Affiliate:** `affiliate_cta_click` may be counted only for actual disclosed referral placements. An ordinary provider visit is not a paid conversion.

## Metrics — do not guess baselines
- Organic clicks, impressions and page-level CTR by landing page from Search Console.
- Mobile vs desktop engaged sessions and click-through rate from homepage to core calculators.
- From calc landing views: engaged users and related-tool clicks. Only compare like-for-like event instrumented pages.
- Portfolio: successful report views / starts; CSV invalid / CSV attempts. Demo results are a separate `analysis_mode` cohort and should not be counted as uploaded portfolios.
- Actual partner clicks, approvals and earned revenue are separate; click volume is not revenue.
- Mobile field performance in Search Console: LCP <=2.5s, INP <=200ms, CLS <=0.1 at the 75th percentile.

## Next checkpoints
1. Connect read-only GA4 and Google Search Console reporting (e.g. Windsor.ai connected to those Google properties) before choosing keyword and landing-page targets. Use a 28-day baseline, then compare another 28 days; avoid drawing conclusions from a few visits.
2. Inspect 10 highest-impression search pages, their matching search intent and click-through rate. Improve existing source-backed pages rather than publishing duplicate financial articles.
3. Review high bounce/low-engagement mobile tool paths and compare real Core Web Vitals by URL group. Fix verified issues.
4. Consider affiliate links only after written commercial approval and appropriate Canadian disclosure. Never tie recommendations or calculator results to compensation. Keep ad placements away from financial inputs and the portfolio report. AdSense approval and revenue are not assumed.
5. Validate mobile layouts on real devices and test against accessibility standards; this code review does not replace that QA.

## Data safety guardrails
- Do not transmit form field values, financial inputs, holdings, CSV file contents/names, user-entered search queries or URL parameters through analytics.
- Avoid fake conversion rate claims. Mark all GA4 events as events initially; designate key events only after reviewing their semantics and ensuring no duplication.
- Documentation and analytics code do not prove real traffic, SEO rank changes, AdSense eligibility or revenue.
