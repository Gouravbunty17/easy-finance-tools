import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const sections = [
  {
    title: "Educational use only",
    body: "EasyFinanceTools provides educational calculators, guides, and examples for general information only. Nothing on this site is financial, tax, legal, accounting, or investment advice.",
  },
  {
    title: "No client relationship",
    body: "Using the site does not create an advisor, client, fiduciary, or professional relationship. You are responsible for verifying numbers against your own records and official sources before acting.",
  },
  {
    title: "Estimate limitations",
    body: "Calculator results depend on assumptions, user inputs, rounding, and simplified rules. Actual results may differ because of tax law changes, lender policies, account-specific details, fees, benefit interactions, or incomplete inputs.",
  },
  {
    title: "External links and partners",
    body: "Some pages may include ads, affiliate links, referral links, or partner placements. Any material relationship should be disclosed clearly on the relevant page before a recommendation appears.",
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Terms and Disclaimer"
        description="Read the EasyFinanceTools terms of use, educational disclaimer, privacy expectations, and limits of calculator outputs."
        canonical="https://easyfinancetools.com/terms"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Terms and disclaimer
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">Terms of Use</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-100">
            These pages are meant to make the educational boundaries of EasyFinanceTools clear before anyone relies on a calculator result.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <div className="surface-card p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Last updated</p>
              <p className="mt-2 text-slate-600 dark:text-slate-300">April 3, 2026</p>
              <div className="mt-5 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  By using EasyFinanceTools, you agree to use the site for lawful, personal, and informational purposes. If you do not agree with these terms, do not use the site.
                </p>
                <p>
                  The most important rule is simple: calculator outputs should help you think, compare, and learn, but they should not be treated as a substitute for official records, lender quotes, tax filings, or professional advice.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {sections.map((section) => (
                <div key={section.title} className="surface-card p-6">
                  <h2 className="text-xl font-bold text-primary dark:text-accent">{section.title}</h2>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{section.body}</p>
                </div>
              ))}
            </div>

            <div className="surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Privacy and availability</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Privacy expectations are described in the privacy policy. Where a calculator or feature is described as browser-based or local-first, inputs should stay on your device unless the feature clearly says otherwise.
                </p>
                <p>
                  We may change, update, suspend, or remove tools and content at any time. We do not guarantee uninterrupted availability, current accuracy for every jurisdiction or scenario, or suitability for a particular purpose.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Before you rely on a result</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Check the assumptions shown on the page.</li>
                <li>Compare the estimate against your own records.</li>
                <li>Use official CRA, lender, or government sources for final confirmation.</li>
                <li>Speak with a qualified professional when the decision is material.</li>
              </ul>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Trust pages</h3>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "Methodology and sources", href: "/methodology" },
                  { label: "Privacy policy", href: "/privacy-policy" },
                  { label: "About", href: "/about" },
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
