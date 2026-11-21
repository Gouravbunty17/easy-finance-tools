# French-Canadian localization — initial rollout

## Current scope

The French option is **a limited, publishable rollout**, not a machine-translated copy of the entire website.

| Route | Language | Status |
|---|---|---|
| `/` ↔ `/fr` | English ↔ French (Canada) | Localized homepage |
| `/tools` ↔ `/fr/outils` | English ↔ French (Canada) | French directory; untranslated tools explicitly marked English |
| `/tools/mortgage-calculator` ↔ `/fr/outils/calculateur-hypothecaire` | English ↔ French (Canada) | French essential mortgage calculator, using existing Canadian financial formulas |

Every other page remains English-only. The FR language switch on an untranslated English route takes visitors to the translated French homepage. The EN switch from supported French routes returns to the matching English counterpart. No false French alternate links are generated for untranslated pages.

## Search-engine and accessibility requirements

- Each French page has an actual French title and description, self canonical URL, document language `fr-CA`, and Open Graph locale `fr_CA`.
- Hreflang tags are reciprocal only for matching published routes; no global tags inherited by other pages.
- The three French routes are included in the sitemap and prerender output.
- EN/FR switches are accessible from both desktop and mobile navigation.
- No automatic redirection based on browser language; visitors explicitly choose their language.
- Financial constants remain from `src/config/financial.js`. Reuse, do not duplicate/translate formulas.

## French mortgage scope and limitations

The French page supports the price, down payment, rate and amortization; it estimates monthly payment, insured principal, mortgage insurance, constant-rate interest and an indicative qualification payment. It explains down-payment insufficiency, points to government sources, and notes that the English tool has advanced payment-frequency and prepayment features. It does not calculate Quebec welcome tax or municipal costs, and it is not a lender approval estimate.

## Next translations

Translate FHSA/CELIAPP and TFSA/CELI next, then RRSP/REER and provincial income tax, only when their complete user-facing calculator labels, results, validation, warnings, and official references are translated. Quebec-specific tax and mortgage assumptions require separate verification and testing. Do not imply French customer support is available solely because these pages exist.

## Existing domain SEO blocker

The earlier independent CI live host check found that the `www` homepage returned HTTP 200 instead of a permanent redirect. The Vercel team authorization was not completed. That issue is **independent of French routing** and remains open until Vercel domain settings can be reviewed.
