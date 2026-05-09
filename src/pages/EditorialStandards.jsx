import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const standards = [
  {
    title: "Original explanatory value",
    body: "Pages should help a Canadian user make a real decision. We aim to publish tools, comparisons, and guides that explain tradeoffs in plain language rather than rephrasing generic finance definitions.",
  },
  {
    title: "Visible assumptions and limits",
    body: "Calculator and comparison pages should make key assumptions visible. If a page is only a directional estimate, it should say so clearly instead of pretending to replace CRA records, lender quotes, or official filings.",
  },
  {
    title: "Meaningful updates only",
    body: "We use update dates when the underlying rates, limits, rules, calculations, or explanations have been meaningfully reviewed. We do not mark pages as fresh just to look current.",
  },
  {
    title: "Clear monetization disclosure",
    body: "If a page includes referral links, affiliate links, or sponsor relationships, the disclosure should appear on that page in plain language before the recommendation area.",
  },
];

export default function EditorialStandards() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Editorial Standards"
        description="See how EasyFinanceTools reviews calculators, comparisons, update dates, disclosures, and Canadian finance content quality."
        canonical="https://easyfinancetools.com/editorial-standards"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Quality and trust
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">Editorial Standards</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-100">
            EasyFinanceTools is built to be useful first. These standards explain how we approach Canadian finance tools, comparisons, updates, and disclosures.
          </p>
          <p className="mt-4 text-sm font-semibold text-blue-100">Last reviewed: May 9, 2026</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Decision-first editorial philosophy</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  The editorial priority is decision support before product recommendation. We try to help a reader understand account selection, tax efficiency, behavioral sustainability, planning clarity, and source transparency before presenting any provider or monetized next step.
                </p>
                <p>
                  Finance content can easily drift toward click optimization. EasyFinanceTools should instead make the decision easier to reason about: what assumption drives the answer, what official source should be checked, what edge case could change the result, and when a professional should be involved.
                </p>
              </div>
            </div>

            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">What we want each page to do</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  We publish calculators and guides for Canadians who need practical answers about TFSA, RRSP, tax, mortgage, savings, dividends, and household finance decisions.
                  A page should not exist just to target a keyword. It should help a user understand a real tradeoff or next step.
                </p>
                <p>
                  That means we try to pair formulas with plain-language explanation, show assumptions where they matter, and link users to the next calculator or guide that helps them complete the decision.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {standards.map((item) => (
                <div key={item.title} className="surface-card p-5">
                  <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">How we review content quality</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  We prioritize Canada-specific usefulness over broad generic coverage. Registered-account limits, tax assumptions, government payment schedules, and mortgage examples should be checked against primary or official sources when practical.
                </p>
                <p>
                  If a page is mostly a market widget, quote feed, or third-party embed without enough original explanatory value, it should not be treated the same way as a full calculator or guide. We would rather reduce indexable low-value surfaces than keep pages live that do not meaningfully help users.
                </p>
                <p>
                  Comparison pages should explain who each option fits, what assumptions matter, and when a calculator or planning step should happen before choosing a provider.
                </p>
                <p>
                  Pages that are useful but too narrow, generic, or unfinished may remain noindexed. That is a quality-control choice, not a technical penalty. A page should earn indexability by adding Canadian context, original explanation, source support, and a clear decision pathway.
                </p>
              </div>
            </div>

            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Source selection, updates, and corrections</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Primary sources come first. For tax, registered accounts, and benefits, we prefer CRA, Government of Canada, Department of Finance Canada, and official program pages. For interest rates, inflation, and exchange-rate data, we prefer Bank of Canada sources. For mortgage and consumer finance guidance, we prefer CMHC and FCAC sources where relevant.
                </p>
                <p>
                  Pages are updated when a rule, limit, rate source, calculation, example, or material explanation changes. We do not invent freshness dates. If a page has only received minor formatting changes, the update date should not imply a full financial review.
                </p>
                <p>
                  Corrections can be submitted through the Contact page. When a correction changes a number, formula, source, or recommendation context, the page should be reviewed, updated, and dated so readers can see that the change was handled.
                </p>
                <p>
                  Source freshness is handled by risk level. CRA registered-account and tax pages, Government of Canada benefit pages, Bank of Canada rate data, and CMHC/FCAC mortgage references are checked first because stale assumptions there can directly change a user's interpretation.
                </p>
              </div>
            </div>

            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Calculator testing and AI-assisted drafting</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Calculator pages should be tested with simple examples, edge cases, and known official values where those are available. High-risk pages such as tax, mortgage, and registered-account calculators should show limitations and source links close to the methodology section.
                </p>
                <p>
                  AI tools may be used to draft, reorganize, or summarize educational content, but the site should not publish invented credentials, fake reviews, fabricated traffic numbers, or unsupported claims. AI-assisted content is reviewed for Canadian context, source alignment, tone, and obvious calculation errors before publishing.
                </p>
                <p>
                  Affiliate independence is required. Referral compensation cannot decide calculator formulas, methodology notes, source selection, or whether risks and limitations are shown.
                </p>
              </div>
            </div>

            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Review workflow for high-risk finance pages</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  High-risk pages include tax, registered accounts, mortgages, benefits, investing, and retirement planning. These pages should show a last-reviewed date, plain-language limitations, relevant official sources, and links to related calculators or guides that help users continue the decision.
                </p>
                <p>
                  The review order is source first, formula second, explanation third, and monetization last. Referral or affiliate opportunities should not appear before the user has received useful context, and compensation cannot change the calculator logic or risk language.
                </p>
                <p>
                  EasyFinanceTools is currently founder-operated, so the site avoids implying professional certification or institutional review. The content system is designed to support future external expert review notes without fabricating them today.
                </p>
              </div>
            </div>

            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Privacy and affiliate independence</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Calculator inputs should remain private and client-side unless a specific feature explains otherwise. Outputs should not be shaped around advertising profiles, and the site should avoid asking for personal financial data when a simple scenario input is enough.
                </p>
                <p>
                  Affiliate or referral relationships cannot affect formulas, source links, risk explanations, rankings, or whether negative tradeoffs are shown. Product links should appear after educational value, not before the reader understands the decision.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Related trust pages</h3>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "About EasyFinanceTools", href: "/about" },
                  { label: "Methodology and sources", href: "/methodology" },
                  { label: "Terms and disclaimer", href: "/terms" },
                  { label: "Privacy policy", href: "/privacy-policy" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">What we avoid</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Thin pages built only around widgets or duplicated summaries</li>
                <li>Undisclosed referral placements inside recommendation pages</li>
                <li>Freshness dates that do not reflect real review work</li>
                <li>Generic finance copy that does not help a Canadian user act</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
