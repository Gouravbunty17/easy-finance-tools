import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import EnhancedAuthorBox from "../components/EnhancedAuthorBox";
import TopicClusterMap from "../components/TopicClusterMap";

const FOUNDER_HEADSHOT_URL = "";
const FOUNDER_LINKEDIN_URL = "";

const TRUST_POINTS = [
  {
    title: "Canadian-first assumptions",
    body: "Tools are written around Canadian account rules, tax context, mortgage conventions, and official source material rather than US defaults.",
  },
  {
    title: "Transparent methodology",
    body: "Calculator pages explain the formulas, assumptions, examples, limitations, and official references behind the result.",
  },
  {
    title: "Privacy-respecting tools",
    body: "Calculator inputs are processed in the browser. The site is designed so you can test scenarios without creating an account.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen" aria-labelledby="about-page-title">
      <SEO
        title="About EasyFinanceTools"
        description="Meet Gourav Kumar, founder of EasyFinanceTools, and learn how the site builds Canadian finance calculators, source checks, and educational guides."
        canonical="https://easyfinancetools.com/about"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-50">
            Founder-led Canadian finance tools
          </div>
          <h1 id="about-page-title" className="text-4xl font-bold md:text-5xl">About EasyFinanceTools</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-50">
            EasyFinanceTools helps Canadians understand financial tradeoffs with calculators, plain-language guides, source links, and transparent assumptions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="surface-card p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Founder and operator</p>
              <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Built and maintained by Gourav Kumar</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  EasyFinanceTools is an independent Canadian personal finance education and calculator platform founded by Gourav Kumar. The site is built for people who want to test TFSA, RRSP, FHSA, mortgage, dividend, tax, and retirement scenarios without being pushed into a product first.
                </p>
                <p>
                  Gourav focuses on building practical tools, maintaining calculator logic, reviewing pages against official Canadian sources where applicable, and improving the site when rules or user needs change.
                </p>
                <p>
                  EasyFinanceTools does not provide personalized financial, tax, legal, mortgage, or investment advice. Gourav is not a licensed financial advisor, CPA, CFP, CFA, mortgage broker, or tax preparer.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <EnhancedAuthorBox
                lastUpdated="May 9, 2026"
                focus="Canadian finance calculators and education"
                headshotUrl={FOUNDER_HEADSHOT_URL}
                linkedinUrl={FOUNDER_LINKEDIN_URL}
              />
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Why this site exists</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Many finance pages answer the easy definition question but skip the harder planning question: what changes the decision? EasyFinanceTools is designed around that second question.
                </p>
                <p>
                  A calculator result should not stand alone. Each major tool explains what the number means, which assumptions drive it, where it can be wrong, and which official source or related guide helps verify the next step.
                </p>
                <p>
                  The site may use contextual advertising and clearly disclosed referral relationships, but those relationships do not change calculator formulas, source selection, or educational conclusions.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {TRUST_POINTS.map((item) => (
                <div key={item.title} className="surface-card p-5">
                  <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <TopicClusterMap title="The education library is organized around real Canadian decisions" />
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">How calculators are built and maintained</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Calculator work starts with the decision being modeled: contribution room, deduction value, mortgage payment pressure, dividend income target, retirement timing, or another Canadian household finance question.
                </p>
                <p>
                  When a calculation depends on public rules, the page points to official references such as CRA, Government of Canada, FCAC, CMHC, Bank of Canada, or Statistics Canada. Methodology sections explain assumptions, limitations, and practical examples so users can sanity-check the output.
                </p>
                <p>
                  Pages are updated when important rules, limits, source links, or calculator behavior changes. Material corrections and maintenance notes are tracked on the <Link to="/corrections" className="text-secondary underline-offset-2 hover:underline">Corrections and Updates</Link> page.
                </p>
              </div>
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Editorial approach</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Articles and tool pages are written for education first. The goal is to explain the tradeoff, show realistic Canadian examples, identify common mistakes, and link to the calculator or official source that helps the reader verify the next step.
                </p>
                <p>
                  Source-heavy pages are checked against current Canadian source material where applicable. Future external reviewers can be credited on individual pages when that review is actually completed.
                </p>
                <p>
                  The full process is documented on the <Link to="/editorial-standards" className="text-secondary underline-offset-2 hover:underline">Editorial Standards</Link> and <Link to="/methodology" className="text-secondary underline-offset-2 hover:underline">Methodology</Link> pages.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="surface-soft p-5">
              <h2 className="text-lg font-bold text-primary dark:text-accent">What you can use today</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <li>Registered account tools for TFSA, RRSP, and FHSA planning</li>
                <li>Mortgage, affordability, rent-vs-buy, and debt payoff tools</li>
                <li>Income tax, net pay, CPP/OAS, and retirement calculators</li>
                <li>Guides that explain assumptions, tradeoffs, and source checks</li>
              </ul>
            </div>

            <div className="surface-card p-5">
              <h2 className="text-lg font-bold text-primary dark:text-accent">Good next pages</h2>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "Browse all tools", href: "/tools" },
                  { label: "Read the latest guides", href: "/blog" },
                  { label: "See methodology and sources", href: "/methodology" },
                  { label: "Read editorial standards", href: "/editorial-standards" },
                  { label: "Review corrections and updates", href: "/corrections" },
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
          </aside>
        </div>
      </section>
    </main>
  );
}
