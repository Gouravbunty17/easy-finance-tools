import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const toolGroups = [
  {
    title: "Registered accounts",
    description: "TFSA, RRSP, and FHSA tools should reflect published limits, basic contribution rules, and plain-language assumptions.",
    links: [
      { label: "TFSA calculator", href: "/tools/tfsa-calculator" },
      { label: "RRSP calculator", href: "/tools/rrsp-calculator" },
      { label: "FHSA calculator", href: "/tools/fhsa-calculator" },
    ],
  },
  {
    title: "Tax and pay",
    description: "Tax calculators should distinguish estimates from official filings and clearly note federal and provincial assumptions.",
    links: [
      { label: "Income tax calculator", href: "/tools/income-tax-calculator" },
      { label: "Pay stub calculator", href: "/tools/net-pay-calculator" },
      { label: "Capital gains tax calculator", href: "/tools/capital-gains-tax" },
    ],
  },
  {
    title: "Savings, debt, and housing",
    description: "Savings, mortgage, and debt tools should explain rates, contribution timing, compounding, and scenario limitations.",
    links: [
      { label: "Compound interest calculator", href: "/tools/compound-interest-calculator" },
      { label: "Mortgage calculator", href: "/tools/mortgage-calculator" },
      { label: "Debt payoff calculator", href: "/tools/debt-payoff" },
    ],
  },
];

export default function Methodology() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Methodology and Sources"
        description="See how EasyFinanceTools builds Canadian finance calculators, reviews assumptions, updates dates, and handles privacy and disclosures."
        canonical="https://easyfinancetools.com/methodology"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Trust and transparency
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">Methodology and Sources</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-100">
            Every calculator should explain what it does, what it does not do, where key assumptions come from, and when the page was last meaningfully reviewed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">How we approach calculator content</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  EasyFinanceTools publishes educational estimates, not personalized financial, tax, or legal advice. Our goal is to make common Canadian planning questions easier to understand with fast tools and plain-language guidance.
                </p>
                <p>
                  Important pages should show inputs, assumptions, limitations, and a visible update date. Freshness should only be shown when the underlying content has actually been reviewed or changed.
                </p>
                <p>
                  If a calculator relies on published limits, tax brackets, or government program rules, those values should be checked against primary sources such as CRA guidance, federal budgets, and official agency publications.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Visible assumptions",
                  body: "We aim to show the rates, limits, contribution rules, and scenario assumptions that drive each result.",
                },
                {
                  title: "Educational outputs",
                  body: "Outputs are meant to support decision-making and comparison, not replace notices of assessment, lender quotes, or licensed advice.",
                },
                {
                  title: "Browser-first privacy",
                  body: "Calculator inputs should remain in the browser unless a feature clearly says otherwise.",
                },
              ].map((item) => (
                <div key={item.title} className="surface-card p-5">
                  <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Where core assumptions come from</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  "CRA contribution limits, registered-account rules, and tax administration guidance",
                  "Federal and provincial tax brackets, payroll deductions, and published thresholds",
                  "Lender and insurer rules for mortgage and housing tools where applicable",
                  "User-entered assumptions for returns, inflation, fees, and contribution timing",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Calculator families</h2>
              <div className="mt-5 grid gap-5">
                {toolGroups.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-lg font-bold text-primary dark:text-accent">{group.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{group.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {group.links.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Good rules of thumb</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Check registered-account room against your CRA records before contributing.</li>
                <li>Use conservative return assumptions when planning long-term savings scenarios.</li>
                <li>Verify tax outcomes with official documents before filing or withdrawing money.</li>
                <li>Compare multiple scenarios before acting on mortgage or debt decisions.</li>
              </ul>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Related pages</h3>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "About EasyFinanceTools", href: "/about" },
                  { label: "Editorial standards", href: "/editorial-standards" },
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
          </div>
        </div>
      </section>
    </div>
  );
}
