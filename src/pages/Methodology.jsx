import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import DecisionFramework from "../components/DecisionFramework";

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

const methodologyNav = [
  { label: "Decision-first philosophy", href: "#decision-first" },
  { label: "How calculators are built", href: "#calculator-build" },
  { label: "Quality control", href: "#quality-control" },
  { label: "Privacy and independence", href: "#privacy-independence" },
  { label: "Assumptions and sources", href: "#assumptions-sources" },
  { label: "Known weaknesses", href: "#known-weaknesses" },
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
          <p className="mt-4 text-sm font-semibold text-blue-100">Last reviewed: May 9, 2026</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <nav className="surface-soft p-4" aria-label="Methodology sections">
              <div className="flex flex-wrap gap-2">
                {methodologyNav.map((item) => (
                  <a key={item.href} href={item.href} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-accent">
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            <DecisionFramework
              eyebrow="Platform framework"
              title="The decision flow behind the calculators"
              intro="A premium finance tool should not simply output a number. It should show the tradeoff, the Canadian rule, the warning, and the next path."
            />

            <div id="decision-first" className="surface-card scroll-mt-24 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Decision-first philosophy</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  EasyFinanceTools is built around decision quality before product selection. A calculator should help a Canadian understand account selection, tax efficiency, behavioral sustainability, planning clarity, and source transparency before any platform, ETF, or referral link enters the conversation.
                </p>
                <p>
                  Many finance pages optimize for clicks: get the user to a product page, a sign-up button, or a long keyword article. This site tries to optimize for understanding. The useful outcome is not that a user clicks faster; it is that they know what to verify, which assumption matters, and what tradeoff they are actually making.
                </p>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-5">
                {["Account selection", "Tax efficiency", "Behavioral sustainability", "Planning clarity", "Source transparency"].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-accent">
                    {item}
                  </div>
                ))}
              </div>
            </div>

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

            <div id="calculator-build" className="surface-card scroll-mt-24 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">How calculators are built, tested, and updated</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Each calculator starts with the practical question a Canadian user is trying to answer: contribution room, tax estimate, mortgage payment, dividend income, savings path, or household budget. We then map the required inputs, identify the governing Canadian assumptions, and keep the calculation client-side wherever possible.
                </p>
                <p>
                  For rule-based calculators, we check formulas and limits against official sources. For scenario calculators, we disclose that returns, rates, inflation, and timing are user assumptions rather than predictions. Before publishing or updating a calculator, we test common cases, zero or edge values, mobile layout, and whether the result explanation still matches the formula.
                </p>
                <p>
                  Updates are prioritized when CRA limits, tax brackets, mortgage rules, Bank of Canada data sources, CMHC/FCAC guidance, or core assumptions change. Pages that cannot be kept current or that do not contain enough original explanation should be improved or noindexed rather than treated as finished core content.
                </p>
                <p>
                  The founder-operated process and current credentials limits are explained on the <Link to="/founder-transparency" className="text-secondary underline-offset-2 hover:underline">Founder Transparency</Link> page. The site should not imply external review unless that review has actually happened.
                </p>
              </div>
            </div>

            <div id="quality-control" className="surface-card scroll-mt-24 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Quality control and intentional noindexing</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Some utilities remain intentionally excluded from search indexing until they provide enough educational depth, Canadian-specific context, or decision-support value. Noindexing is editorial restraint: it keeps thin or narrow pages from pretending to be core authority pages.
                </p>
                <p>
                  An indexable tool should answer a real planning question, show assumptions, explain where the output becomes weak, include relevant Canadian context, and point to official sources when rules drive the result. A simple widget can still be useful to visitors, but usefulness does not automatically mean it should be promoted as search content.
                </p>
                <p>
                  Edge cases are reviewed by asking: what would make this output misleading? Recent withdrawals, stale CRA records, province changes, income volatility, mortgage renewal risk, tax-slip treatment, and aggressive return assumptions are examples of issues that deserve visible caveats near the result.
                </p>
              </div>
            </div>

            <div id="known-weaknesses" className="rounded-3xl border border-amber-200 bg-amber-50 p-6 md:p-8 dark:border-amber-800 dark:bg-amber-950/20">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Known weaknesses we actively check for</h2>
              <p className="mt-4 text-sm leading-7 text-amber-950 dark:text-amber-100">
                A finance site can look technically polished and still feel untrustworthy. These are the failure modes EasyFinanceTools should keep reducing instead of hiding behind generic trust language.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "Repetitive calculator structure",
                    body: "Major tools need page-specific examples, weak-scenario notes, and source references so they do not read like the same template with different inputs.",
                  },
                  {
                    title: "Commercial comparison drag",
                    body: "Brokerage and product-comparison pages can create an affiliate-first signal if they are promoted before the underlying account or risk decision is explained.",
                  },
                  {
                    title: "Founder-operated limits",
                    body: "The site has real accountability, but not external professional review across every high-risk page yet. Pages should not imply credentials that do not exist.",
                  },
                  {
                    title: "Freshness without substance",
                    body: "Dates should mean rules, assumptions, source links, examples, formulas, or explanations were actually reviewed, not merely reformatted.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-amber-200 bg-white/80 p-5 dark:border-amber-900 dark:bg-slate-900/70">
                    <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="privacy-independence" className="surface-card scroll-mt-24 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Privacy-first and independent outputs</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Calculator inputs are designed to stay client-side unless a feature clearly says otherwise. EasyFinanceTools does not store calculator inputs in a financial profile, and calculator results are not used to build advertising profiles.
                </p>
                <p>
                  Product or referral links, when present, come after education and do not influence calculator formulas, source selection, risk language, or result interpretation. A useful calculator should give the same output whether or not a referral relationship exists.
                </p>
                <p>
                  Future upload-style features, such as a portfolio analyzer, should explain privacy behaviour before a user selects a file. No brokerage-login requirement should be introduced for a basic educational analysis.
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

            <div id="assumptions-sources" className="surface-card scroll-mt-24 p-6 md:p-8">
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
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Maintenance schedule and quality gates</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Core Canadian rule pages should be checked when CRA, Government of Canada, Bank of Canada, CMHC, FCAC, or lender qualification guidance changes. Registered-account limits, tax brackets, CPP/OAS figures, and mortgage rules get priority because stale assumptions can mislead users quickly.
                </p>
                <p>
                  Source freshness is handled by category. CRA account limits and tax brackets get checked around annual updates; Bank of Canada data integrations are checked when the source or API behaviour changes; CMHC, FCAC, and mortgage-rule references are checked when qualification or insurance guidance changes materially.
                </p>
                <p>
                  A calculator update should pass four checks before it is treated as current: official-source verification, formula sanity testing, result-explanation review, and mobile layout review. If a page cannot meet that standard, the safer choice is to improve it, keep it noindexed, or remove it from prominent journeys.
                </p>
                <p>
                  Low-risk utility pages are intentionally not treated as authority pages. They remain noindexed until they contain enough Canadian context, practical examples, limitations, and source support to belong beside the core TFSA, RRSP, FHSA, mortgage, tax, and retirement tools.
                </p>
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
            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">What changed recently</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Added inline official-source context inside major calculator result areas.</li>
                <li>Added correction and usefulness feedback loops to education articles.</li>
                <li>Added a noindexed portfolio analyzer foundation before building a live analyzer.</li>
              </ul>
            </div>

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
                  { label: "Founder transparency", href: "/founder-transparency" },
                  { label: "Editorial standards", href: "/editorial-standards" },
                  { label: "Terms and disclaimer", href: "/terms" },
                  { label: "Privacy policy", href: "/privacy" },
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
