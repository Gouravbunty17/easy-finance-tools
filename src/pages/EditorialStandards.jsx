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
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
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
