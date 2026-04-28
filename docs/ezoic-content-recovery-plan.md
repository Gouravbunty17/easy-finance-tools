# Ezoic Content Recovery Plan

Last updated: April 28, 2026
Reapplication target: July 27, 2026

## Why This Exists

Ezoic rejected EasyFinanceTools with the reason `Content`. The next approval attempt should focus on stronger educational depth, clearer methodology, better internal linking, and a cleaner user experience with no empty ad areas while the site is not approved.

## Pages Improved In This Batch

- `/` - already routes visitors into decision paths for TFSA vs RRSP, FHSA planning, dividend income, beginner investing, and core calculators.
- `/tools` - added decision-path grouping so visitors can start with the real question before opening a calculator.
- `/tools/compound-interest-calculator` - added a clearer example calculation, common mistakes, and a visible FAQ section.
- `/tools/tfsa-calculator` - changed methodology heading to "How this calculator works" and added an example/result-reading section.
- `/tools/rrsp-calculator` - changed methodology heading to "How this calculator works" and added an example/result-reading section.
- `/tools/fhsa-calculator` - changed methodology heading to "How this calculator works" for clearer content signals.
- `/tools/dividend-calculator` - added "How this calculator works" and "Common mistakes" sections, and clarified ETF-income methodology.
- `/blog/best-etfs-for-tfsa-canada-2026` - made the visible article metadata show the latest update date and a page-specific review note.
- `/blog/best-tfsa-brokers-canada` - made the visible article metadata show the latest update date and a page-specific review note.
- `/affiliate-disclosure` - added a dedicated disclosure page and linked it from the footer.

## Ezoic Scripts And Placeholder Status

- Ezoic header scripts are disabled.
- Ezoic ad placeholders are removed from active page render paths.
- `EzoicAd` remains as a harmless null component for compatibility, but no active source page should render it.
- `ads.txt` remains configured for AdsTxtManager/Ezoic because that does not create user-facing ad slots or scripts.

## Calculator Audit

The priority calculators now have the core recovery sections: H1, intro, interface, how-it-works/methodology, inputs, example/result-reading, common mistakes where relevant, related links, disclaimers, and FAQ where appropriate.

### Strongest Calculator Pages

- `/tools/compound-interest-calculator`
- `/tools/tfsa-calculator`
- `/tools/rrsp-calculator`
- `/tools/fhsa-calculator`
- `/tools/dividend-calculator`
- `/tools/gic-calculator`
- `/tools/mortgage-affordability-calculator`
- `/tools/mortgage-calculator`
- `/tools/rent-vs-buy`

### Thin Or Lower-Depth Calculator Pages To Improve Next

- `/tools/budget-tracker` - needs methodology, example calculation, result interpretation, common mistakes, related guides/tools, and disclaimer.
- `/tools/fire-calculator` - needs methodology, example calculation, result interpretation, common mistakes, related links, and disclaimer.
- `/tools/investment-tracker` - needs methodology, example calculation, result interpretation, common mistakes, related links, and disclaimer.
- `/tools/cad-usd-converter` - needs methodology, example calculation, common mistakes, and FAQ.
- `/tools/gst-hst-calculator` - needs methodology, example calculation, common mistakes, and FAQ.
- `/tools/inflation-calculator` - needs methodology, example calculation, common mistakes, and FAQ.
- `/tools/net-pay-calculator` - needs methodology, example calculation, common mistakes, and FAQ.
- `/tools/salary-to-hourly-calculator` - needs methodology, example calculation, common mistakes, and FAQ. Note: this file had pre-existing local changes and should be handled carefully.
- `/tools/tip-calculator` - needs methodology, example calculation, common mistakes, and FAQ.
- `/tools/savings-goal` - needs methodology, common mistakes, and FAQ.
- `/tools/capital-gains-tax` - needs a stronger how-it-works section, example calculation, common mistakes, and related links.
- `/tools/cpp-oas-estimator` - needs a stronger how-it-works section, example calculation, common mistakes, and related links.
- `/tools/debt-payoff` - needs example calculation, result interpretation, common mistakes, and related links.
- `/tools/income-tax-calculator` - needs how-it-works, example calculation, common mistakes, and a clearer disclaimer.
- `/tools/mortgage-affordability-calculator` - needs a dedicated example calculation.
- `/tools/rent-vs-buy` - needs a dedicated example calculation.
- `/tools/mortgage-calculator` - needs the methodology heading to say "How this calculator works" more explicitly.

## Recommended New Articles

- `TFSA Contribution Room Examples Canada 2026` - supports TFSA calculator and room-related searches.
- `RRSP Refund Examples By Income Canada 2026` - supports RRSP calculator and CTR for refund queries.
- `FHSA vs TFSA: Which Should First-Time Buyers Use First?` - supports FHSA calculator and first-home decision searches.
- `Compound Interest Examples Canada: $100, $500, and $1,000 Monthly` - supports compound calculator and beginner search intent.
- `Dividend ETF Yield vs Total Return Canada` - supports dividend calculator and ETF guide trust.
- `How To Build A Simple ETF Portfolio In A TFSA` - supports best TFSA ETFs and broker pages.
- `Budget Categories Canada: Starter Monthly Budget Examples` - supports budget tracker depth.
- `FIRE Number Canada: What Changes With CPP And OAS?` - supports FIRE calculator depth.

## Internal Linking Priorities

- Link from each calculator to at least one relevant guide and two related calculators.
- Link from each guide to the relevant calculator near the intro and near the end.
- Keep `/tools` grouped by decisions, not just calculator type.
- Keep the homepage focused on decision paths: account choice, first home, investing growth, dividend income, and beginner investing.

## E-E-A-T Checklist

- Footer links: About, Methodology, Editorial Standards, Terms and Disclaimer, Privacy Policy, Affiliate Disclosure.
- Blog pages should show author, review context, and last updated date.
- Calculator pages should show last reviewed date or methodology update date.
- Methodology should explain assumptions, source refresh points, and limitations.
- Disclaimers should stay clear but not interrupt the calculator experience.
- Referral CTAs should include affiliate disclosure near the CTA.

## Reapplication Checklist For July 27, 2026

- Confirm Ezoic remains disabled until the site is approved or ready for review.
- Finish the lower-depth calculator pages listed above.
- Add at least 6 to 10 high-quality supporting articles from the roadmap.
- Re-run `npm run build` and verify no errors.
- Check Search Console for indexed canonical pages only, with no `/shop`, `/stocks`, or `www` duplicates resurfacing.
- Test mobile PageSpeed again after Ezoic remains disabled and content pages are rebuilt.
- Confirm `/privacy-policy`, `/terms`, `/affiliate-disclosure`, `/editorial-standards`, `/methodology`, and `/about` are accessible from the footer.
- Check at least five calculator pages manually on mobile for empty sections, broken charts, or layout overflow.
- Reapply to Ezoic only after the site has deeper educational pages and no unfinished ad surfaces.
