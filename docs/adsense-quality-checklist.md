# AdSense Quality Checklist

Last reviewed: May 6, 2026

## Pages Improved

- Sitewide footer: added a clear financial disclaimer and direct links to methodology, editorial standards, affiliate disclosure, privacy, terms, and disclaimer pages.
- Tool pages: added a visible educational disclaimer below calculator pages through the shared app layout.
- `/disclaimer`: added a standalone financial disclaimer page.
- `/privacy`: added as the primary privacy route. `/privacy-policy` remains available for legacy links but is noindexed.
- `/about`: softened claims so the page does not imply professional credentials or guaranteed update timing.
- `/editorial-standards`: expanded source selection, update process, correction process, calculator testing, affiliate independence, and AI-assisted content review.
- `/methodology`: expanded how calculators are built, tested, and updated.
- `/affiliate-disclosure`: explicitly names possible Wealthsimple referral relationships and clarifies that promotions and terms must be verified with the provider.
- Affiliate components: replaced pressure-oriented bonus language with neutral referral disclosure and provider-verification language.

## Pages Noindexed

These pages are useful utilities but are not currently strong enough to represent the core AdSense/YMYL content library:

- `/tools/tip-calculator`
- `/tools/salary-to-hourly-calculator`
- `/tools/gst-hst-calculator`
- `/tools/cad-usd-converter`
- `/tools/inflation-calculator`
- `/tools/savings-goal`
- `/tools/net-pay-calculator`
- `/privacy-policy` legacy duplicate of `/privacy`
- `/blog/best-dividend-investing-platforms-canada`
- `/blog/best-investing-apps-canada`
- `/blog/best-rrsp-accounts-canada`
- `/blog/best-tfsa-brokers-canada`
- `/blog/wealthsimple-vs-questrade-canada`
- `/blog/best-gic-rates-canada-2026`
- `/blog/best-hisa-canada-2026`
- `/blog/best-etfs-for-tfsa-canada-2026`

Noindexed pages are also excluded from the generated sitemap.

## Pages Needing Future Expansion

- `/tools/gst-hst-calculator`: add province-by-province sales tax explanation, examples, limitations, and official source links before indexing.
- `/tools/cad-usd-converter`: add Bank of Canada source methodology, rate timestamp handling, and exchange-rate limitations before indexing.
- `/tools/inflation-calculator`: add CPI methodology, official source explanation, and limitations before indexing.
- `/tools/net-pay-calculator`: add payroll assumptions, province-specific limitations, CPP/EI source links, and examples before indexing.
- `/tools/savings-goal`: add compounding methodology, inflation caveats, and example scenarios before indexing.
- `/tools/tip-calculator`: keep noindexed unless expanded into a broader Canadian bill-splitting/tax/tipping guide.
- `/tools/salary-to-hourly-calculator`: keep noindexed unless expanded with payroll, vacation pay, overtime, and province-specific context.

## Removed Or Reduced Risky Claims

- Removed or softened copy implying exact rule mirroring, guaranteed update timing, or professional certainty.
- Replaced affiliate CTA defaults such as bonus-claim language with neutral provider-verification language.
- Added explicit wording that Gourav Kumar is not a licensed advisor, accountant, mortgage broker, or tax professional.
- Added sitewide disclaimer language clarifying educational estimates only.

## Remaining AdSense Risks

- The remaining indexable pages that use "best" language should continue to be monitored so the wording is clearly framed as comparison education, not unsupported objective ranking.
- Some older blog posts may still need deeper source blocks and clearer update histories.
- Some non-priority calculators are noindexed instead of fully expanded. They should not be reindexed until they meet the same content depth standard as the priority tools.
- Stock-related files exist in the source tree but are not currently routed in `App.jsx`; avoid exposing them until they have original explanatory value and compliant financial disclaimers.

## Recommended Next 10 Content Upgrades

1. Add or expand a TFSA hub page with calculator, TFSA room guide, mistakes guide, ETF guide, and next-step links.
2. Add or expand an RRSP hub page with RRSP calculator, deadline guide, deduction examples, and withdrawal limitations.
3. Add or expand an FHSA hub page with FHSA calculator, FHSA rules guide, FHSA vs RRSP guide, and home-buying next steps.
4. Add a mortgage/home-buying hub linking mortgage payment, affordability, rent-vs-buy, FHSA, and down-payment guides.
5. Add a dividend investing hub linking dividend calculator, dividend ETF guides, DRIP, covered calls, and income-risk disclaimers.
6. Expand `/tools/net-pay-calculator` with payroll methodology and official CPP/EI/tax source links.
7. Expand `/tools/gst-hst-calculator` with official Canada Revenue Agency sales tax sources.
8. Expand `/tools/cad-usd-converter` and `/tools/inflation-calculator` with Bank of Canada source methodology.
9. Add author boxes and source lists to older custom blog pages that do not yet use the shared education article template.
10. Add a quarterly content review log documenting which high-risk finance pages were checked and what changed.
