import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function About() {
  return (
    <main className="min-h-screen" aria-labelledby="about-page-title">
      <SEO
        title="About EasyFinanceTools"
        description="How EasyFinanceTools is built and edited, how we source and review Canadian finance calculators, and the editorial standards that guide every tool and article."
        canonical="https://easyfinancetools.com/about"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-50">
            About and methodology
          </div>
          <h1 id="about-page-title" className="text-4xl font-bold md:text-5xl">About EasyFinanceTools</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-50">
            A free, independent resource that helps Canadians make clearer financial decisions — built around the rules, assumptions, and tradeoffs behind every number.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <p>
                <strong className="text-slate-800 dark:text-slate-100">By Gourav Kumar</strong> · Founder and Editor
                <span className="mx-2 text-slate-300 dark:text-slate-600">|</span>
                Last updated April 19, 2026
              </p>
            </div>

            <div className="mt-6 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">What EasyFinanceTools is</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  EasyFinanceTools is a free, independent site that helps Canadians make clearer financial decisions. We publish two kinds of content: interactive calculators for major tax, registered-account, mortgage, and investing decisions, and written guides that explain the rules, tradeoffs, and common mistakes behind those decisions.
                </p>
                <p>
                  Every calculator is built for the Canadian context. That means Canadian tax brackets by province, Canadian registered-account limits (TFSA, RRSP, FHSA, RRIF), Canadian mortgage conventions (semi-annual compounding, CMHC insurance, the stress test), and Canadian benefit programs (CPP, OAS, CCB). US-focused tools look superficially similar but apply different rules — a mortgage calculator that compounds monthly instead of semi-annually will consistently overstate a Canadian monthly payment.
                </p>
                <p>
                  We do not hide the math. Every tool links to a methodology panel that names the formula, the assumptions, and the primary government source used.
                </p>
              </div>
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Why we built this</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Most Canadian finance calculators fall into one of two camps. They are either built by banks and brokerages that have a product to sell, or they are US tools relabelled with a maple leaf. The first group sidesteps uncomfortable tradeoffs because those tradeoffs might cost them a sale. The second group misses the rules that actually shape a Canadian decision.
                </p>
                <p>
                  We built this site to give people a neutral third option: a tool that shows the number, explains where it came from, and links to the official government source so you can verify it yourself. The site is free, funded by contextual advertising and a small number of clearly disclosed affiliate links. None of those relationships change the assumptions, the formulas, or the math.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Privacy first",
                  body: "Everything you type into a calculator stays in your browser. Inputs are never sent to a server.",
                },
                {
                  title: "Rule-accurate",
                  body: "Calculators mirror the governing CRA, Interest Act, or CMHC rule, including edge cases.",
                },
                {
                  title: "Made for Canada",
                  body: "Canadian tax brackets, registered-account limits, and mortgage conventions — not US defaults.",
                },
              ].map((item) => (
                <div key={item.title} className="surface-card p-5">
                  <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">How we build calculators</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Every calculator on this site follows the same process. First, we identify the underlying rule — the CRA publication, the Interest Act section, the CMHC premium schedule, or the Bank of Canada release that governs the calculation. Second, we write a reference implementation that mirrors the rule exactly, including edge cases such as Canadian semi-annual compounding, partial-year residency, or TFSA withdrawal-reinstatement lag. Third, we document the assumptions on the page itself in a methodology panel that names the source and the update date.
                </p>
                <p>
                  Calculators are rebuilt whenever the rules change. When CRA announces the annual TFSA or RRSP limit each fall, the related calculator is updated within a week. When the federal government changes insured-mortgage rules — for example the December 2024 increase to the $1.5 million insurable ceiling — the mortgage calculator is revised with a visible "last updated" stamp and a link to the policy announcement.
                </p>
                <p>
                  Inputs are never transmitted off your device. Contributions, balances, income, and dates entered into any calculator remain in your browser's memory and are discarded when you close the tab.
                </p>
              </div>
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">How we write and review content</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Articles on this site go through a three-step process: drafted with primary sources cited inline, reviewed for numerical accuracy against the underlying rule, and dated with a visible "last updated" stamp when published.
                </p>
                <p>
                  We prioritize primary sources. For tax rules: canada.ca, the CRA publications library, and Department of Finance news releases. For monetary policy and interest rates: bankofcanada.ca. For mortgage and insurance: cmhc-schl.gc.ca. For statutory definitions: laws-lois.justice.gc.ca. Secondary sources such as bank blogs or brokerage research are used only to illustrate examples, never as the authoritative source for a rule.
                </p>
                <p>
                  When a rule is ambiguous or rapidly changing, we say so on the page. When a calculation involves a material simplification, it is disclosed in the methodology panel. When an affiliate or advertising relationship exists for a product mentioned on a page, it is disclosed next to the mention itself — not buried in a footer.
                </p>
              </div>
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Editorial standards</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  We follow a short set of standards that keep the site useful rather than promotional. Articles and tool pages carry the same substance whether or not they mention a sponsored product. We never recommend an account, broker, or advisor based on commission structure alone. Ad placements are contextual, not personalized using values typed into calculators.
                </p>
                <p>
                  If you believe any figure on this site is wrong, outdated, or misleading, please tell us through the <Link to="/contact" className="text-secondary underline-offset-2 hover:underline">Contact page</Link>. Corrections are logged with a visible update date and an explanation of what changed. The full standards document is published on the <Link to="/editorial-standards" className="text-secondary underline-offset-2 hover:underline">editorial standards</Link> page.
                </p>
              </div>
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">About the editor</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  EasyFinanceTools is built and edited by <strong>Gourav Kumar</strong>. The site grew out of personal research into Canadian tax, registered accounts, and household financial decisions — which is why every calculator is designed to surface the rule behind the result, not just the number. Each tool starts as a private planning worksheet and is released publicly only after the underlying rule has been verified against the CRA, Department of Finance Canada, Bank of Canada, or CMHC source that governs it.
                </p>
                <p>
                  For editorial questions, factual corrections, or partnership inquiries, please use the <Link to="/contact" className="text-secondary underline-offset-2 hover:underline">Contact page</Link>. Privacy and data-subject requests are handled through the same channel and are responded to within 30 days as required by PIPEDA.
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
                  { label: "Read editorial standards", href: "/editorial-standards" },
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
    </main>
  );
}
