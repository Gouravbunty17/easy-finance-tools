import React from "react";
import SEO from "../components/SEO";

const updateEntries = [
  {
    date: "May 2026",
    title: "AdSense and YMYL trust cleanup",
    body: "Added clearer founder attribution, no-advice disclosures, official source callouts, noindex handling for thin utility pages, and stronger calculator methodology sections.",
  },
  {
    date: "May 2026",
    title: "Duplicate-content consolidation",
    body: "Marked weaker overlapping TFSA, RRSP, and dividend ETF routes as noindex and updated internal links toward the stronger canonical guides.",
  },
  {
    date: "May 2026",
    title: "Calculator context improvements",
    body: "Added realistic Canadian scenario examples to major calculators and improved result interpretation so outputs are easier to sanity-check before acting.",
  },
];

export default function Corrections() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <SEO
        title="Corrections and Updates | Easy Finance Tools"
        description="How Easy Finance Tools handles calculator updates, source changes, corrections, and user-reported errors for Canadian finance content."
        canonical="https://easyfinancetools.com/corrections"
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Accountability</p>
        <h1 className="mt-3 text-4xl font-bold text-primary dark:text-accent">Corrections and updates</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
          Easy Finance Tools is written and maintained by Gourav Kumar. This page explains how calculation issues, tax-year updates, source changes, and user-reported errors are handled.
        </p>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          No formal correction notices have been published yet. This page will list material updates, calculation corrections, and source changes going forward.
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <h2 className="text-2xl font-bold text-primary dark:text-accent">How to report an error</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            If you notice a broken link, outdated limit, unclear explanation, or calculator issue, email the page URL, the input values used, and what looked wrong.
          </p>
          <a className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary" href="mailto:easyfinancetools@gmail.com?subject=Easy%20Finance%20Tools%20correction">
            Report a correction
          </a>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <h2 className="text-2xl font-bold text-primary dark:text-accent">How updates are reviewed</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Material updates are checked against official Canadian sources such as CRA, FCAC, CMHC, Bank of Canada, Statistics Canada, or Government of Canada pages when those sources apply.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The site is educational only and is not reviewed by a licensed financial advisor, accountant, mortgage broker, or tax professional unless a future page explicitly says so.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-primary dark:text-accent">Current maintenance log</h2>
        <div className="mt-5 space-y-4">
          {updateEntries.map((entry) => (
            <article key={entry.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{entry.date}</p>
              <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">{entry.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{entry.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
