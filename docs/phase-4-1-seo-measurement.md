# Phase 4.1 — Search-driven release and measurement

Date: 2026-11-14. Market: Canada (English). First-party data sources: Google Search Console and GA4 connected through OpenSEO.

## Baseline: October 14 – November 10, 2026
- Search Console: 9,944 Google impressions, 2 clicks (0.02% CTR); prior 28 days 7,527 impressions, 1 click.
- Canada: 9,136 impressions, 1 Google click.
- Google desktop impressions: 7,560; mobile: 2,364; mobile clicks: 0.
- Most-impressed calculator: /tools/mortgage-calculator (3,333 impressions; average position 57.1).
- /tools/tfsa-calculator: 817 impressions, position 47.1.
- /tools/fhsa-calculator: 591 impressions, position 53.5.
- /blog/tfsa-vs-rrsp-vs-fhsa-canada: 1,170 impressions, position 29.6.
- /blog/fhsa-calculator-canada-2026: 371 impressions, position 34.8.
- Search Console showed both the apex and www homepages selected as Google canonicals at the previous crawl dates, despite permanent redirect rules in vercel.json. This may be stale crawling or a domain routing problem; it requires live HTTP checks and eventual Search Console reinspection.
- GA4 organic: 67 sessions, 62 active users, 50 engaged sessions, 74.6% engagement; previous 28 days 59 sessions.
- GA4 source/medium: Bing organic 48 sessions, DuckDuckGo organic 9, Google organic 2. Do not confuse GA4 organic sessions with Search Console Google clicks.
- Strong GA4 organic landing pages: /blog/pay-off-mortgage-faster-canada (16 sessions), /blog/tfsa-withdrawals-contribution-room-canada (10 sessions).

## This release
1. Move FHSA's inputs and live results into the first screen; preserve calculation logic, sources and disclaimers.
2. Improve mortgage payment page with distinct information paths for CMHC insurance, affordability and prepayment guidance, and route visitors toward the linked tools and an already-visited mortgage guide.
3. Clarify that /blog/fhsa-calculator-canada-2026 is an informational guide to room and deduction rules, while /tools/fhsa-calculator is the interactive calculation endpoint. Preserve separate canonicals and existing slugs.
4. Add targeted FHSA/TFSA/RRSP comparison detail and quick links to the relevant calculators on the comparative guide.
5. Add a prominent calculator path on the organic-traffic-leading prepayment article.
6. Instrument the first *actual user edit* of FHSA and mortgage calculator scenarios: `tool_start` and `tool_calculate`. Events contain only generic event names, tool names and categorical milestones. Never transmit salary, balances, housing prices or entered values to GA4.
7. Add live and static canonical redirect verification. CI must check `www` HTTPS 301/308 for homepage, mortgage and FHSA, and check the apex calculator canonical tags.
8. Extend headless Chrome journeys to FHSA on mobile and desktop.

## Measurement limitations and next steps
- GA4 currently has `purchase` as its only registered key event. Mark `tool_calculate` as a key event in GA4 Admin if appropriate for conversion reporting; code instrumentation alone cannot change that property setting.
- Search Console and GA4 use different reporting semantics and time zones. Google Search Console last days may lag.
- Search Console indexing records are from previous crawls, not live redirects. Re-inspect the www and apex properties after a verified production deployment.
- No ranking increase is guaranteed. Use 28-day comparisons of organic sessions, Google clicks, impressions, ranking by exact query and calculator engagement after Google recrawls.
- Do not publish fabricated mortgage rates or change financial formula assumptions without verifying official rules.
