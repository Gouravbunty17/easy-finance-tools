# Canadian Portfolio Analyzer — Phase 2 Roadmap (v2 FINAL — LOCKED)

**Product:** EasyFinanceTools.ca  
**Feature:** Canadian Portfolio Analyzer  
**URL:** `/tools/portfolio-analyzer`  
**Framework:** Vite + React (with `react-router-dom`)  
**Phase:** 2 — ships after Phase 1 calculators are live  
**Status:** Locked. No further iteration until Phase 1 ships.  
**Owner:** Gourav

---

## 1. Locked decisions

| Decision | Final value |
|---|---|
| Name | Canadian Portfolio Analyzer |
| URL | `/tools/portfolio-analyzer` |
| Framework | Vite + React |
| File location | `src/pages/PortfolioAnalyzer.jsx` (wire into `react-router-dom`) |
| Score / grade / rating | Never. Not in v1, not in v2. |
| Investor type detection | Excluded — triggers personalized advice rules |
| Try Demo button | Included in v1 |
| Launch ads | Off for first 30 days |

---

## 2. Positioning

Educational portfolio analysis tool for Canadian retail investors. Descriptive output only — sector, geography, currency, dividend characteristics, ETF overlap, TFSA-relevant US withholding tax exposure. Never prescriptive.

---

## 3. Why use this tool (hero section copy)

Surfaced under the H1 to set user expectations:

> Understand your portfolio at a glance:
> - Your sector and geographic exposure
> - CAD vs USD currency mix
> - Estimated dividend income
> - ETF holdings overlap
> - TFSA US withholding tax exposure

---

## 4. Page structure

1. **Hero** — title, subtitle, "Why use this tool" bullets
2. **Trust badges** — No account required · We don't store your portfolio · Educational only
3. **Supported brokers** — Wealthsimple, Questrade, IBKR, RBC Direct, TD Direct, Scotia iTRADE, BMO InvestorLine, CIBC Investor's Edge, Disnat
4. **Upload section** — Screenshot (PNG/JPG) · CSV · Manual entry · **Try Demo Portfolio** button
5. **Confirmation table** — editable rows: ticker, shares, account type, currency
6. **Progress UX** — real stages: Extracting → Matching tickers → Calculating → Building report
7. **Analysis output** — composition, concentration, income, Canadian-specific
8. **Resources section** (separately styled, below analysis) — internal calculator links + broker affiliates

---

## 5. Try Demo feature

- Button labeled "Try Demo Portfolio" near upload area
- Loads a realistic mock Canadian portfolio (mix of CAD/USD, TFSA + non-registered, includes at least one ETF overlap example and one US dividend stock in TFSA to showcase the Canadian-specific flags)
- Skips upload + confirmation, jumps straight to analysis output
- Mock data labeled clearly: "Demo data — not your portfolio"
- Purpose: lowers activation barrier, makes the tool shareable as "look what this can do"

---

## 6. Mobile-first requirements

Most users will upload from mobile broker apps. Design accordingly:

- Large tap-target upload button (min 44×44px)
- Confirmation table reflows to card layout on mobile (no horizontal scroll)
- Analysis charts use mobile-optimized layouts (vertical bars, not pie slices with tiny labels)
- Results page screenshots cleanly on mobile (this is the share format)

---

## 7. Error handling

When extraction fails or returns low-quality results:

- Surface a clear message: "We couldn't read this screenshot reliably."
- Offer two fallback paths inline: "Try a different screenshot" or "Enter holdings manually"
- Pre-populate the manual entry form with whatever was successfully extracted (don't make the user start over)
- Never silently fail or show an empty analysis

---

## 8. Mandatory confirmation step

After extraction, always show the parsed table for user confirmation. Edit ticker, share count, account type, currency on every row. Analysis only runs on confirmed data. Non-negotiable.

---

## 9. Analysis outputs

**Composition** (descriptive):

- Sector allocation (GICS 11)
- Geographic allocation (Canada / US / International developed / Emerging)
- Asset class
- Account type split (TFSA / RRSP / FHSA / Non-registered)

**Concentration metrics** (numbers only, no judgment language):

- Top 5 positions as % of portfolio
- Number of positions under 1%
- Single-stock max position %

**ETF overlap:**

- Underlying holding overlap between user's ETFs
- Output format: "Your VFV and XEQT positions overlap on ~22% of underlying holdings"

**Income:**

- TTM dividend yield (weighted)
- Estimated annual dividend income (CAD)
- Eligible Canadian dividends vs foreign dividends split

**Canadian-specific (the moat):**

- TFSA US withholding tax flag (15% non-recoverable)
- CAD vs USD exposure
- T1135 heads-up if non-registered foreign holdings exceed CAD $100k cost basis

---

## 10. Excluded from v1

- ❌ Score / grade / rating / "out of 100" of any kind
- ❌ Diversification score, concentration score, composite metrics
- ❌ Extraction confidence indicators (high/medium/low — itself a score)
- ❌ "You should..." / "Consider..." / "Recommended..." language
- ❌ Comparison to model portfolios or "ideal" allocations
- ❌ Buy/sell suggestions
- ❌ Performance projections or backtests
- ❌ Risk tolerance questionnaires
- ❌ Investor type detection with tone adjustment
- ❌ Saved portfolios / user accounts

---

## 11. Trust & privacy

Trust badges visible near upload:

- ✓ No account required
- ✓ We don't store your portfolio
- ✓ Processed securely and discarded after analysis

Implementation:

- No screenshot retention after extraction
- No holdings storage unless v2 saved-portfolio opt-in
- Strip image EXIF before any logging
- Privacy policy updated: portfolio data processed in-memory and discarded

---

## 12. Technical architecture

- **Stack:** Vite + React, `react-router-dom`, Tailwind (matches existing site)
- **Backend:** Node/Express endpoint on Vercel
- **Vision extraction:** Claude Sonnet 4.6 via Anthropic API (verify pricing at build time) or GPT-4o alternative
- **Structured output:** forced JSON schema — `{holdings: [{ticker, name, shares, account_type, currency}]}`
- **Reference data — hybrid:**
  - Static JSON of ~2,000 most common Canadian/US tickers (sector, country, currency, dividend yield) — refreshed monthly
  - API fallback (FMP free tier or Polygon) for unknown tickers
- **ETF holdings:** scrape/cache issuer pages (Vanguard, BlackRock/iShares, BMO, Horizons/Global X, Mackenzie) — refresh monthly

---

## 13. Cost controls

- **Rate limit: 3 analyses per IP per 24 hours** — implemented day one
- Cache extraction by image hash for 1 hour (prevents double-charges on retry)
- Daily vision API spend alert
- Estimated cost at launch scale: ~$50/month for 1,000 analyses

---

## 14. Legal guardrails

**Visible disclaimers** (above upload + on every results page):

"Educational analysis tool. Not investment advice. EasyFinanceTools is not a registered investment dealer or advisor. Consult a registered financial advisor before making investment decisions."

**Banned language** (enforced in LLM system prompt):

- "You should" / "Consider" / "Recommend" / "Suggest"
- "Buy" / "Sell" / "Hold" / "Reduce" / "Increase" / "Trim" / "Add to"
- "Overweight" / "Underweight" / "Too much" / "Too little"
- "Better" / "Worse" / "Optimal" / "Ideal" / "Should be"
- Any score, grade, rating

**Allowed framings:** "Your portfolio shows X." / "X% of your holdings are in Y." / "Z of your positions overlap on N% of underlying holdings."

**Pre-launch:** engage Canadian securities lawyer for 1-hour ToS + output language review (~$300–500). Non-negotiable.

---

## 15. Monetization

Affiliate placements in a separately-styled "Resources" section **below** the analysis, never inside it.

- Internal links to TFSA, RRSP, Dividend, Inflation calculators
- Wealthsimple / Questrade broker affiliates
- Placement specifically tied to what the analysis surfaced (e.g. high USD exposure → CAD ETF broker links)

---

## 16. Email gating

Soft gate:

- First analysis: free, no email
- "Save analysis as PDF" or 2nd analysis in same session: email required

---

## 17. Launch strategy

- **Channels:** Twitter/X, LinkedIn, IndieHackers, Product Hunt, r/PersonalFinanceCanada
- **r/PFC warning:** subreddit hostile to self-promotion. Build genuine post history first; post as "I built this free tool, would love feedback" from real account; be present in comments. Otherwise: removed and possibly banned.
- **Shareability hook:** "Here's my portfolio breakdown" — make sure results page screenshots cleanly on mobile.

---

## 18. Success metrics (60-day evaluation)

- Upload completion rate (started → analysis viewed)
- **Confirmation step edit rate** (primary quality signal — >30% means extraction needs work)
- Try Demo → real upload conversion rate
- Affiliate CTR from analysis pages
- Email capture rate
- Organic traffic vs calculator pages
- Cost per analysis

**Kill criteria:** if extraction accuracy stays below 70% after 30 days of prompt iteration, pause and reassess vision model.

---

## 19. Build estimate

- Backend extraction + prompt engineering: 4–5 days
- Confirmation UI + error handling: 3 days
- Analysis engine + reference data: 4–5 days
- Frontend + trust badges + Try Demo + mobile optimization: 4 days
- Legal review + disclaimer integration: 1 day
- Broker screenshot testing (9 formats): 3 days
- Polish + rate limiting + cost monitoring: 2 days

**Total: ~4 weeks focused work.** Realistically 5–7 weeks alongside other ventures.

---

## 20. Open at build time (decide then, not now)

1. Final vision model + verified pricing
2. Reference data API choice (FMP vs Polygon)
3. Hard email gate decision (recommended: soft)

---

## 21. What's deliberately deferred to v2

- Saved portfolios with month-over-month tracking
- Standalone Dividend Dashboard
- "What-if" descriptive analysis
- Tax-loss opportunity surfacing in non-registered accounts
- CSV export of analysis

---

## Build priority sequence (overall site)

1. **Phase 1 (current):** Finish 9 calculators
2. **Phase 2:** Canadian Portfolio Analyzer (this doc)
3. **Phase 3:** Dividend Dashboard
4. **Phase 4:** Retirement Planner

---

## Changelog

- **v2 FINAL** — Locked: name, URL, framework, Try Demo. Added: Why use this tool, mobile-first requirements, error handling section. Removed: extraction confidence indicator (it's a score by another name). No further iteration until Phase 1 ships.
- **v2** — Renamed to Canadian Portfolio Analyzer, hybrid ticker data, rate limits, launch strategy, ad-free first 30 days
- **v1** — Initial roadmap
