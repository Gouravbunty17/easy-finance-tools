import React from "react";
import { Link } from "react-router-dom";
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

const correctionPolicy = [
  {
    title: "Material correction",
    body: "A wrong formula, stale official limit, broken source interpretation, or misleading example should be logged with the affected page, correction date, and plain-language summary of what changed.",
  },
  {
    title: "Clarification",
    body: "If wording was technically accurate but easy to misunderstand, the page should be clarified and the change noted when it affects user interpretation.",
  },
  {
    title: "Minor edit",
    body: "Typo, formatting, and layout fixes do not automatically become financial review updates or freshness claims.",
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
        <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Last reviewed: May 19, 2026</p>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          For accountability context, read the <Link to="/founder-transparency" className="font-semibold text-primary underline dark:text-secondary">Founder Transparency</Link> page. It explains who operates the site, what credentials are not claimed, and how methodology and updates are handled.
        </p>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          No formal correction notices have been published yet. This page will list material updates, calculation corrections, and source changes going forward.
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <h2 className="text-2xl font-bold text-primary dark:text-accent">How to report an error</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            If you notice a broken link, outdated limit, unclear explanation, or calculator issue, send the page URL, the input values used, and what looked wrong through the contact page.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Useful reports include the page URL, the relevant source link, the expected result, and enough context to reproduce a calculator issue without sharing private financial documents.
          </p>
          <Link className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary" to="/contact">
            Report a correction
          </Link>
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

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Correction categories</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">How visible updates should be labelled</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Not every edit deserves the same label. This prevents the site from using routine formatting work as a fake freshness signal.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {correctionPolicy.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
