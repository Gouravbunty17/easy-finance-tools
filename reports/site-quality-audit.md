# EasyFinanceTools Site Quality Audit

Generated: 2026-07-06T07:08:29.110Z

## Executive Summary

- Total registered routes audited: 129
- Indexable routes: 84
- Noindex or legacy routes: 45
- Critical technical issues: 0
- Routes with advisory warnings: 0
- Routes with internal-linking opportunities: 22

The site is now more than a calculator collection: the route map shows a real Canadian finance information architecture with topic hubs, decision guides, calculators, trust pages, and noindex handling for weaker utilities. The highest priority is to tighten internal linking and canonical intent around overlapping TFSA and account-comparison pages before adding more content.

## Information Architecture Audit

| Bucket |Routes |
| --- |--- |
| blog indexable |52 |
| legacy noindex |18 |
| tools noindex |15 |
| pages indexable |14 |
| tools indexable |12 |
| blog noindex |12 |
| topics indexable |6 |

### Indexable Topical Coverage

| Cluster |Indexable routes |
| --- |--- |
| TFSA |16 |
| Dividend |11 |
| Trust/legal |10 |
| General |8 |
| RRSP |8 |
| Investing accounts |7 |
| Mortgage |7 |
| FHSA |6 |
| Retirement |4 |
| Tools |4 |
| AI costs |3 |

## Internal Linking Report

### Routes With Zero Inbound Internal Links

- None found.


### Calculator/Guide Linking Opportunities

- /blog/tfsa-passive-income-canada-2026: Add an upward link to the relevant topic hub.
- /blog/how-to-choose-etfs-canada: Add an upward link to the relevant topic hub.
- /blog/tfsa-contribution-room-calculator: Add an upward link to the relevant topic hub.
- /blog/500-month-dividend-canada: Add an upward link to the relevant topic hub.
- /blog/fhsa-calculator-canada-2026: Add an upward link to the relevant topic hub.
- /blog/fhsa-vs-rrsp-down-payment-canada-2026: Add an upward link to the relevant topic hub.
- /blog/tfsa-vs-rrsp-canada-2026: Add an upward link to the relevant topic hub.
- /blog/how-to-start-investing-canada-2026: Add an upward link to the relevant topic hub.
- /blog/how-to-use-fhsa-canada: Add an upward link to the relevant topic hub.
- /blog/cpp-payment-dates-2026: Add an upward link to the relevant topic hub.
- /blog/oas-payment-dates-2026: Add an upward link to the relevant topic hub.
- /blog/canadian-tax-brackets-2026: Add an upward link to the relevant topic hub.
- /blog/how-to-invest-in-canada-beginners-2026: Add an upward link to the relevant topic hub.
- /blog/emergency-fund-canada: Add an upward link to the relevant topic hub.
- /blog/pay-off-mortgage-faster-canada: Add an upward link to the relevant topic hub.
- /blog/canada-child-benefit-2026: Add an upward link to the relevant topic hub.
- /blog/pay-debt-vs-invest-canada: Add an upward link to the relevant topic hub.
- /blog/ai-cost-calculator-estimate-api-spend: Add an upward link to the relevant topic hub.
- /blog/ai-api-costs-tokens-agent-loops-rag-cad-budgeting: Add an upward link to the relevant topic hub.
- /blog/what-are-cdrs-canada: Add an upward link to the relevant topic hub.
- /blog/how-to-buy-spacex-cdr-canada: Add an upward link to the relevant topic hub.
- /blog/should-canadian-investors-chase-hot-ipos-spacex-case-study: Add an upward link to the relevant topic hub.


## Cannibalization Report

| Topic |Primary URL |Support URLs |Risk |Action |
| --- |--- |--- |--- |--- |
| TFSA contribution room |/blog/tfsa-contribution-room-calculator |/blog/tfsa-contribution-room-canada-2026<br>/tools/tfsa-calculator |Medium |Calculator-intent and guide-intent pages are useful together, but titles and internal links should make the flagship calculator page the primary page for contribution-room calculator queries. |
| TFSA withdrawals and recontribution |/blog/tfsa-withdrawal-rules-canada-2026 |/blog/tfsa-withdrawals-contribution-room-canada<br>/blog/tfsa-contribution-room-calculator |Medium |The 2026 withdrawal guide should be treated as the main withdrawal-rule explainer; older withdrawal/contribution-room content should point clearly into it. |
| TFSA vs RRSP vs FHSA |/blog/tfsa-vs-rrsp-vs-fhsa-canada |/tools/account-decision-tool<br>/blog/tfsa-vs-rrsp-canada-2026<br>/topics/tfsa<br>/topics/rrsp<br>/topics/fhsa |High |This cluster has multiple comparison URLs. Keep the three-account comparison as the canonical decision page and use the account decision tool as the interactive next step. |
| Dividend ETFs and covered-call income |/blog/best-canadian-dividend-etfs-2026 |/blog/covered-call-etfs-canada-explained<br>/blog/covered-call-etf-taxes-canada<br>/blog/covered-call-etfs-in-a-tfsa-canada<br>/blog/covered-call-etfs-in-an-rrsp-canada<br>/tools/dividend-calculator |Medium |Dividend and covered-call content is broad enough to support several pages, but each page should state its decision job clearly: ETF shortlist, tax mechanics, account location, or yield-risk education. |
| SpaceX / CDR investing accounts |/blog/how-to-buy-spacex-cdr-canada |/blog/how-to-buy-spacex-ipo-stock-in-canada<br>/blog/what-are-cdrs-canada<br>/blog/should-canadian-investors-chase-hot-ipos-spacex-case-study<br>/blog/cdrs-in-a-tfsa-canada |Medium |The CDR purchase guide should own practical access intent; the IPO, CDR explainer, hot-IPO risk, and TFSA-account-location pages should support different angles. |
| AI API cost planning |/tools/ai-cost-calculator |/blog/ai-cost-calculator-estimate-api-spend<br>/blog/ai-api-costs-tokens-agent-loops-rag-cad-budgeting |Low |The cluster is small and clean: one tool, one budgeting article, one mechanics article. |

## Technical SEO Report

### Critical Findings

- None found.


### Advisory Warnings

- None found.


## Core Web Vitals / Performance Proxy Report

This static audit does not replace Lighthouse field or lab testing. It checks the built asset footprint after prerender as a proxy for performance risk.

| Largest built asset |Size KB |
| --- |--- |
| index-5epifG6p.js |234.5 |
| chart-BtZhsaeM.js |202.8 |
| index-Dpr_0Mw3.css |95 |
| decisionSupportArticles-iWGLvogy.js |73.6 |
| Blog-CrveqfF_.js |44.5 |
| DividendCalculator-rpVR1K0S.js |44.3 |
| InvestingGuideArticlePage-BR8f0cI6.js |41.4 |
| TopicHub-BqDdLiOt.js |40.5 |

Recommended CWV follow-up: run mobile Lighthouse on `/`, `/tools`, `/tools/account-decision-tool`, `/tools/tfsa-calculator`, and the top Canadian Investing Accounts article after deployment. Focus on unused JS, image dimensions, lazy loading, and route-level chunking before changing content.

## Schema Report

- Homepage is expected to carry Organization, Person, and WebSite schema.
- Tool pages are expected to carry WebApplication or SoftwareApplication schema plus BreadcrumbList.
- Indexable blog pages are expected to carry Article and BreadcrumbList schema.
- Pages with visible FAQ sections should carry FAQPage schema.

Schema issues found in this run:

- None found.


## E-E-A-T / YMYL Trust Report

- Footer exposes About, Founder Transparency, Methodology, Editorial Standards, Corrections, Disclaimer, Terms, Privacy, and Affiliate Disclosure.
- Shared CanadianEducationArticle pages render contributor/review transparency, source verification, correction CTA, official-source lists, methodology notes, and educational disclaimers.
- Shared calculator layout renders privacy/source notes, tool schema, result guidance, related links, and mobile calculate affordances.
- Remaining trust weakness: pages that do not use the shared article or calculator shells can drift from the strongest trust pattern and should be audited before promotion.

## Top 20 Quick Wins

1. Make `/blog/tfsa-vs-rrsp-vs-fhsa-canada` the clear primary account-comparison page in internal links.
2. Use `/tools/account-decision-tool` as the interactive next step from every TFSA/RRSP/FHSA comparison page.
3. Point older TFSA withdrawal content toward `/blog/tfsa-withdrawal-rules-canada-2026`.
4. Point contribution-room support content toward `/blog/tfsa-contribution-room-calculator` for calculator-intent queries.
5. Audit pages flagged with visible FAQs but no FAQPage schema.
6. Add topic-hub links to any indexable blog pages flagged by the audit.
7. Add calculator links to any indexable blog pages flagged by the audit.
8. Keep weak utilities noindexed unless they receive decision-support depth.
9. Run mobile Lighthouse on the five highest-traffic templates before new content work.
10. Check image width/height and lazy-loading behavior on article hero images.
11. Review the largest built JS chunks before adding dependencies.
12. Keep external source labels exact and remove broken references instead of shipping dead citations.
13. Use the trust pages as reviewer-facing proof: About, Methodology, Editorial Standards, Corrections, Disclaimer.
14. Keep affiliate wording after educational context, not before result interpretation.
15. Monitor Search Console queries for TFSA withdrawal cannibalization.
16. Monitor Search Console queries for TFSA vs RRSP vs FHSA overlap.
17. Submit only live 200 URLs for indexing.
18. Do not add another investing-account article until the current cluster shows impressions and indexing clarity.
19. Use the audit script before every large route/content push.
20. Document any page intentionally kept noindex so future work does not accidentally re-promote it.

## Long-Term Recommendations

- Keep the site clustered around decision paths: accounts, dividends/income, mortgages, retirement, AI business costs, and trust/legal.
- Improve existing high-intent pages before expanding into new topics.
- Treat Search Console query overlap as the source of truth for cannibalization decisions.
- Add field CWV monitoring before making broad UI or dependency changes.
- Consider turning this audit into a CI advisory gate once the warning set is intentionally cleaned up.
