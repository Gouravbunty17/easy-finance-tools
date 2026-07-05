# EasyFinanceTools Content Backlog

Last updated: 2026-07-05

This backlog tracks Canadian investing-account content by search intent, publication status, and internal-link priority. It is intentionally conservative: do not publish duplicate pages when an existing page already satisfies the same user intent.

## Existing

| Page | Route | Status | Notes |
| --- | --- | --- | --- |
| TFSA hub | `/topics/tfsa` | Existing | Main TFSA cluster entry point. Links to room, withdrawals, overcontribution, mistakes, U.S. stocks, covered calls, CDRs, account tools. |
| RRSP hub | `/topics/rrsp` | Existing | Main RRSP cluster entry point. Needs future RRSP withdrawal/RRIF deep links as cluster expands. |
| FHSA hub | `/topics/fhsa` | Existing | Main FHSA cluster entry point. Now links to FHSA vs HBP and FHSA vs RRSP down-payment pages. |
| TFSA calculator | `/tools/tfsa-calculator` | Existing | Prerendered calculator page with source, privacy, FAQ, and result guidance. |
| RRSP calculator | `/tools/rrsp-calculator` | Existing | Prerendered calculator page with source, FAQ, and result guidance. |
| FHSA calculator | `/tools/fhsa-calculator` | Existing | Prerendered calculator page with source, FAQ, and result guidance. |
| Account Decision Tool | `/tools/account-decision-tool` | Existing | Core account-priority decision engine. |
| Investment Fit Framework | `/tools/investment-fit-framework` | Existing | Useful for account-location and risk-context routing. |
| TFSA contribution room calculator | `/blog/tfsa-contribution-room-calculator` | Existing | Flagship TFSA room article and calculator guide. |
| TFSA contribution room Canada 2026 | `/blog/tfsa-contribution-room-canada-2026` | Existing | Contribution-room explainer; keep linked from TFSA hub and calculator. |
| TFSA withdrawal rules Canada 2026 | `/blog/tfsa-withdrawal-rules-canada-2026` | Existing | Current canonical withdrawal guide. |
| TFSA withdrawal and recontribution rules | `/blog/tfsa-withdrawals-contribution-room-canada` | Existing | Older but useful decision-support page; monitor cannibalization with the 2026 withdrawal route. |
| TFSA overcontribution penalties | `/blog/tfsa-overcontribution-penalties-canada` | Existing | Penalty-focused page. |
| TFSA mistakes Canadians make | `/blog/tfsa-investing-mistakes-canada` | Existing | Broad mistakes page. |
| TFSA vs RRSP | `/blog/tfsa-vs-rrsp-canada-2026` | Existing | Canonical TFSA/RRSP comparison. |
| TFSA vs RRSP vs FHSA | `/blog/tfsa-vs-rrsp-vs-fhsa-canada` | Existing | Core account-priority guide. |
| Best ETFs for TFSA | `/blog/best-etfs-for-tfsa-canada-2026` | Existing, noindex | Commercial/comparison intent is intentionally de-emphasized. Keep out of primary cluster until quality and affiliate risk are reviewed. |
| How to start investing in Canada | `/blog/how-to-start-investing-canada-2026` | Existing | Beginner investing guide. |
| FHSA guide | `/blog/how-to-use-fhsa-canada` | Existing | Older FHSA guide; HBP figures refreshed to current local constants. |
| FHSA rules Canada 2026 | `/blog/fhsa-rules-canada-2026` | Existing | Main FHSA rules page. |
| FHSA vs RRSP for down payment | `/blog/fhsa-vs-rrsp-down-payment-canada-2026` | Existing | Broader down-payment comparison that overlaps with HBP intent. |
| FHSA vs HBP | `/blog/fhsa-vs-hbp-canada` | Existing | Focused HBP comparison page added to avoid users landing only on a broader RRSP page. |
| Should I buy U.S. stocks in my TFSA? | `/blog/should-i-buy-us-stocks-in-my-tfsa` | Existing | Account-fit page for U.S. stocks, withholding, FX, and concentration risk. |
| Covered call ETFs in a TFSA | `/blog/covered-call-etfs-in-a-tfsa-canada` | Existing | TFSA-specific covered-call account-fit page. |
| Covered call ETFs Canada explained | `/blog/covered-call-etfs-canada-explained` | Existing | General covered-call mechanics page. |
| What are CDRs in Canada? | `/blog/what-are-cdrs-canada` | Existing | CDR mechanics page; supports the CDRs-in-TFSA gap. |

## Ready to Publish

No unpublished drafts are currently staged. Newly published pages in this pass:

- `/blog/fhsa-vs-hbp-canada`
- `/blog/should-i-buy-us-stocks-in-my-tfsa`
- `/blog/covered-call-etfs-in-a-tfsa-canada`

## Needs Updating

| Page | Priority | Update Needed |
| --- | --- | --- |
| `/blog/tfsa-withdrawals-contribution-room-canada` | Medium | Monitor against `/blog/tfsa-withdrawal-rules-canada-2026`. If Search Console shows cannibalization, consolidate or strengthen distinct intent. |
| `/blog/best-etfs-for-tfsa-canada-2026` | Medium | Currently noindex. If restored later, add stronger source notes, account-fit framing, and less product-list language. |
| `/blog/how-to-use-fhsa-canada` | Medium | Older standalone page; HBP numbers refreshed, but it could eventually be consolidated into the FHSA hub/rules flow. |
| `/blog/tfsa-vs-rrsp-2026` | Low | Noindex legacy-style comparison. Keep redirected/internal linking focused on `/blog/tfsa-vs-rrsp-canada-2026` and `/blog/tfsa-vs-rrsp-vs-fhsa-canada`. |

## Planned

| Topic | Suggested Route | Why It Matters | Notes |
| --- | --- | --- | --- |
| Non-resident TFSA rules | `/blog/non-resident-tfsa-rules-canada` | High YMYL risk and high practical value for newcomers/leavers. | Needs careful CRA sourcing; do not publish from memory. |
| CDRs in a TFSA | `/blog/cdrs-in-a-tfsa-canada` | Connects the CDR article with TFSA account-location decisions. | Avoid duplicating `/blog/what-are-cdrs-canada`; make it strictly TFSA/account-fit. |
| RRSP withdrawal strategy before OAS | `/blog/rrsp-withdrawal-before-oas-canada` | Retirement cluster gap. | Needs CPP/OAS and RRIF source review. |
| FHSA fallback if you do not buy | `/blog/what-happens-to-fhsa-if-you-do-not-buy-canada` | Practical FHSA edge case. | Could also be an FHSA guide section if not enough unique intent. |
| TFSA active trading risk | `/blog/tfsa-active-trading-risk-canada` | Common TFSA mistake with high tax consequences. | Needs very cautious CRA wording. |

## Technical SEO Snapshot

- Route source of truth: `scripts/site-routes.mjs`
- Sitemap generation: `npm run generate:sitemap`
- Full production build: `npm run build` runs sitemap generation, Vite build, and prerender.
- Current local SEO audit command: `npm run audit:seo`
- Legacy/low-value URLs are excluded from the sitemap through `scripts/quality-routes.mjs` and `src/config/qualityRoutes.js`.

## Internal-Linking Rules

- Every investing-account guide should link upward to the relevant topic hub.
- Every TFSA/FHSA/RRSP guide should link to the Account Decision Tool when account priority is part of the decision.
- Every account-location or investment-fit page should link to the Investment Fit Framework.
- Avoid creating product-list pages as the primary path for account education.
