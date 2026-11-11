# Easy Finance Tools — Search growth audit
Reviewed: 2026-11-12
Repository: Gouravbunty17/easy-finance-tools
Primary domain: https://easyfinancetools.com/

## What was checked

- Live homepage, Tools page, discoverable site articles and topic navigation.
- GitHub source for SEO metadata, calculator index, articles, SearchAction structured data, robots rules and sitemap generator.
- Google Search Central guidance on titles, crawlable links, helpful content and XML sitemap accuracy.

## Implemented on 2026-11-12

1. **Homepage search intent:** SEO title and description now name free Canadian financial calculators with TFSA, RRSP and mortgage topics; homepage hero supporting copy explicitly names actual tools.
2. **Findability:** The Tools index now contains eight crawlable, descriptive links to existing calculators, each with a plain-English explanation of what it estimates. Indexable topic hubs for TFSA, RRSP, FHSA, dividends, mortgages and retirement are linked from the same page.
3. **Article discovery:** The Blog index now has fast topic navigation to those six hubs.
4. **Accurate sitemap:** Removed auto-generated file mtime as a fake last-modified timestamp. Sitemap now contains only canonical indexable URL locations. Do not add lastmod until actual editorial update dates are reliably recorded per URL.
5. **Schema accuracy:** Removed obsolete sitelinks search box SearchAction that points at an unsupported /tools?q= search URL. Kept WebSite entity for supported site name data.
6. **Verification:** Added automated sitemap regression test; existing CI covers prerender, technical SEO, financial calculators, site quality.

## What was not established

- No connected read-only Google Search Console/GA4 traffic feed was available in this audit.
- Search rank, impressions, indexed URL counts, page-level CTR, backlinks, traffic trends and actual Core Web Vitals were **not measured**.
- No PageSpeed Insights mobile run was available through this environment; no speed scores are claimed.
- No new 2027 finance limits or tax tables were invented.
- No noindex utility was automatically promoted to the search index. Portfolio Analyzer remains noindex pending its legal/data/UX review.

## Priority growth backlog (based on site structure, not keyword-volume measurements)

| Priority | URL | Relevant search intent | Next quality improvement |
|---|---|---|---|
| P1 | /tools/tfsa-calculator | Canadian TFSA calculator | Confirm 2026 CRA figures, test room edge cases; improve first-screen answer |
| P1 | /tools/rrsp-calculator | RRSP refund calculator Canada | Verify brackets and individual deduction-room disclaimers; show clear examples |
| P1 | /tools/mortgage-calculator | Canadian mortgage payment calculator | Verify mortgage insurance, payment frequency, stress-test qualifications |
| P1 | /tools/income-tax-calculator | Canadian income tax calculator 2026 | Update provincial tax logic; properly test Quebec or clearly disclose exclusions |
| P1 | /tools/fhsa-calculator | FHSA calculator Canada | Verify residency/eligibility/room carry-forward edge cases |
| P1 | /tools/dividend-calculator | Dividend income calculator Canada | Clearly separate annual yield assumptions from guaranteed income |
| P2 | /blog/tfsa-contribution-room-calculator | TFSA room examples | Differentiate guide intent from interactive calculator intent |
| P2 | /blog/tfsa-vs-rrsp-vs-fhsa-canada | TFSA vs RRSP vs FHSA | Reduce overlap with similar comparison URLs and link to one primary explanation |
| P2 | /topics/mortgages | mortgage guides Canada | Add examples after verifying mortgage rules |
| P2 | /blog | Canadian personal finance guides | Track article-to-calculator clicks, keep references current |

## How to measure traffic

1. In Google Search Console, verify `https://easyfinancetools.com/` and inspect the submitted sitemap; do not infer indexing from sitemap inclusion.
2. Capture a **28-day pre-release baseline**: organic clicks, impressions, CTR, and average position by exact landing URL and search query, broken down for Canada/mobile.
3. Review search visibility for the six main tools and primary support guides; prioritize **high-impression, low-CTR** queries only after verifying that the page actually answers the query.
4. Compare the **next 28 days** to the preceding 28 days using identical date lengths, with context about search seasonality and newly indexed pages.
5. In GA4, check organic landing sessions → tool engagement → next relevant calculator. Never pass submitted incomes, account holdings, or user-entered values to analytics.
6. Use Google PageSpeed Insights mobile and Chrome UX field data for core URLs before making performance claims.
7. Continue review by a qualified Canadian tax/account professional when claiming official tax or eligibility accuracy. Do not claim independent licensed review when none occurred.

## Do not do

- Do not mass-create generic AI finance blogs, purchase spammy backlinks, or alter the publication dates merely to look fresh.
- Do not add fake ratings, inflated customer counts, sponsored recommendations disguised as neutral advice, or unsupported FAQ rich-result expectations.
- Do not relabel 2026 calculations as 2027 until official year-specific calculation inputs are verified.
- Do not change canonical URLs or index previously noindex pages just to increase the URL count.

## Sources
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/blog/2024/10/sitelinks-search-box
