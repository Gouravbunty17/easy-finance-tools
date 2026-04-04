import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function About() {
  return (
    <div className="min-h-screen">
      <SEO
        title="About EasyFinanceTools"
        description="Learn how EasyFinanceTools builds free Canadian finance calculators, reviews assumptions, and handles privacy, methodology, and disclosures."
        canonical="https://easyfinancetools.com/about"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            About and methodology
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">About EasyFinanceTools</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-100">
            A free, privacy-focused finance calculator platform built for Canadian savers, investors, and households who want faster answers with clearer assumptions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">What we are building</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  EasyFinanceTools is designed to give Canadians practical answers without hiding the math, assumptions, or limitations behind the result.
                </p>
                <p>
                  The goal is not just to output numbers. The goal is to help users understand tradeoffs around TFSA, RRSP, tax, mortgage, debt, savings, and investing decisions.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Privacy first",
                  body: "Calculator inputs stay in the browser unless a feature explicitly says otherwise.",
                },
                {
                  title: "Useful before fancy",
                  body: "A calculator should support a real decision, not just generate a decorative number.",
                },
                {
                  title: "Made for Canada",
                  body: "We prioritize Canadian tax rules, account limits, rates, and local planning questions.",
                },
              ].map((item) => (
                <div key={item.title} className="surface-card p-5">
                  <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">How we build trust</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Important calculators should explain assumptions, show meaningful update dates, and cite primary sources where practical.
                </p>
                <p>
                  For tax, registered-account, and mortgage decisions, users should still verify key figures against CRA records, lender documents, or a qualified professional before acting.
                </p>
                <p>
                  If a page contains ads, referrals, or partner placements, those relationships should be disclosed clearly on that page.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">What you can use today</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>TFSA, RRSP, FHSA, and savings tools for registered-account planning</li>
                <li>Income tax and paycheque calculators for take-home pay estimates</li>
                <li>Mortgage, rent-vs-buy, and debt payoff tools for major household decisions</li>
                <li>Supporting guides that explain assumptions, tradeoffs, and common mistakes</li>
              </ul>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Good next pages</h3>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "Browse all tools", href: "/tools" },
                  { label: "Read the latest guides", href: "/blog" },
                  { label: "See methodology and sources", href: "/methodology" },
                  { label: "Read terms and disclaimer", href: "/terms" },
                  { label: "Send feedback", href: "/contact" },
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
          </div>
        </div>
      </section>
    </div>
  );
}
