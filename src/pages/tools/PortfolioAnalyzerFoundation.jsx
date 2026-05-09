import React from "react";
import SEO from "../../components/SEO";
import ToolByline from "../../components/ToolByline";
import EducationalDisclaimer from "../../components/EducationalDisclaimer";
import SuggestCorrectionCTA from "../../components/SuggestCorrectionCTA";
import { CONTENT_LAST_REVIEWED } from "../../config/financial";

const plannedChecks = [
  ["Account awareness", "Separate TFSA, RRSP, FHSA, taxable, and cash holdings so tax treatment is not blended."],
  ["Concentration", "Flag when a single holding, sector, country, or yield source dominates the portfolio."],
  ["Income quality", "Separate dividends, interest, covered-call distributions, and return-of-capital style warnings."],
  ["Tax context", "Explain registered-account and taxable-account considerations without giving buy/sell advice."],
  ["Risk language", "Describe volatility, liquidity, currency, and sequence-risk patterns in plain Canadian terms."],
  ["Privacy", "Prefer local processing and explicit user consent before any upload or storage feature exists."],
];

export default function PortfolioAnalyzerFoundation() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="Portfolio Analyzer Canada | Planning Preview"
        description="Preview the privacy-first Canadian portfolio analyzer foundation for TFSA, RRSP, FHSA, taxable, diversification, yield, and account-fit checks."
        canonical="https://easyfinancetools.com/tools/portfolio-analyzer"
        noindex
      />

      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-primary to-slate-900 p-8 text-white shadow-sm md:p-10">
        <div className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
          Foundation preview
        </div>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold md:text-5xl">Canadian Portfolio Analyzer Foundation</h1>
        <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Architecture preview; not a live recommendation engine" />
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
          This page documents the future portfolio analyzer direction before launch. The analyzer will be educational, descriptive, account-aware, and privacy-first. It will not recommend securities, issue buy/sell signals, or replace professional advice.
        </p>
      </section>

      <div className="mt-8">
        <EducationalDisclaimer />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Upload privacy plan</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">No live upload is enabled yet</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The first production version should make privacy obvious before a file is selected. The preferred design is local parsing where practical, clear column templates, and no account credentials. If server processing is ever used, the page should explain exactly what is sent, stored, and deleted.
          </p>
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-100">
            Planned input types: manual holdings table first, then optional CSV import. Brokerage login, scraping, and real-time trading integrations are intentionally out of scope.
          </div>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Future checks</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Canadian-account-aware analysis framework</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {plannedChecks.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="font-bold text-primary dark:text-accent">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What the analyzer will not do</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Clear boundaries before launch</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            "No security recommendations or target portfolios.",
            "No buy, sell, hold, or timing signals.",
            "No performance promises or guaranteed outcomes.",
            "No hidden brokerage referral routing.",
            "No fake risk score pretending to be advice.",
            "No account login requirement for basic analysis.",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <SuggestCorrectionCTA context="the portfolio analyzer foundation" />
      </div>
    </main>
  );
}
