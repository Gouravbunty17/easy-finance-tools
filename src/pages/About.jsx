import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import EnhancedAuthorBox from "../components/EnhancedAuthorBox";
import TopicClusterMap from "../components/TopicClusterMap";
import DecisionFramework from "../components/DecisionFramework";

const FOUNDER_HEADSHOT_URL = "";
const FOUNDER_LINKEDIN_URL = "";
const FOUNDER_LOCATION = "Greater Toronto Area (GTA), Canada";

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

const ACCOUNTABILITY_POINTS = [
  {
    title: "What Gourav does",
    body: "Builds the calculators, writes and edits the educational pages, checks source links, reviews assumptions, and updates content when Canadian rules or user needs change.",
  },
  {
    title: "What the site does not claim",
    body: "No licensed financial-advisor, CPA, CFP, CFA, mortgage-broker, tax-preparer, or institutional-review credential is implied.",
  },
  {
    title: "How readers can challenge the work",
    body: "Every core page points to methodology, official sources, contact, and corrections so issues can be reviewed publicly instead of quietly buried.",
  },
];

const DECISION_FIRST_EXAMPLES = [
  "Should the next dollar go to TFSA, RRSP, FHSA, debt, mortgage prepayment, cash, or taxable investing?",
  "What assumption would change the result?",
  "Which official rule needs to be checked before acting?",
  "What mistake would make a good-looking calculator result misleading?",
];

const PLATFORM_AREAS = [
  { title: "Registered accounts", body: "TFSA, RRSP, and FHSA calculators and guides focused on contribution room, tax tradeoffs, withdrawals, and account priority." },
  { title: "Investing decisions", body: "Educational investing and dividend tools that explain risk, yield assumptions, account location, and what the tool cannot know." },
  { title: "Mortgages and housing", body: "Mortgage payment, affordability, rent-vs-buy, and housing decision pages grounded in Canadian borrowing and stress-test context." },
  { title: "Retirement and planning basics", body: "Retirement, CPP/OAS, compound growth, savings, debt, and tax tools designed to support practical next-step thinking." },
];

const TRUST_LINKS = [
  { label: "Founder Transparency", href: "/founder-transparency", body: "Who built the site, why it exists, and what credentials are not claimed." },
  { label: "Methodology", href: "/methodology", body: "How calculators are researched, built, tested, and updated." },
  { label: "Editorial Standards", href: "/editorial-standards", body: "How the site handles sources, updates, monetization, and quality checks." },
  { label: "Corrections Policy", href: "/corrections", body: "How errors, stale source links, and calculation issues can be reported and handled." },
  { label: "Financial Disclaimer", href: "/disclaimer", body: "The educational limits of calculators, guides, and investing examples." },
];

export default function About() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: "About EasyFinanceTools",
        url: "https://easyfinancetools.com/about",
        description:
          "Founder and editorial accountability page for EasyFinanceTools, an independent Canadian financial education and calculator platform.",
        mainEntity: {
          "@type": "Person",
          name: "Gourav Kumar",
          jobTitle: "Founder and editor of EasyFinanceTools",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Brampton",
            addressRegion: "Ontario",
            addressCountry: "CA",
          },
        },
      },
      {
        "@type": "Organization",
        name: "EasyFinanceTools",
        url: "https://easyfinancetools.com",
        founder: {
          "@type": "Person",
          name: "Gourav Kumar",
        },
        ...(FOUNDER_LINKEDIN_URL ? { sameAs: [FOUNDER_LINKEDIN_URL] } : {}),
      },
    ],
  };

  return (
    <main className="min-h-screen" aria-labelledby="about-page-title">
      <SEO
        title="About EasyFinanceTools"
        description="Meet Gourav Kumar, founder of EasyFinanceTools, and learn how the site builds Canadian financial decision tools, source checks, corrections, and educational guides."
        canonical="https://easyfinancetools.com/about"
        schema={aboutSchema}
      />

      <section className="border-b bg-slate-50 px-4 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Founder-led Canadian finance education</p>
            <h1 id="about-page-title" className="mt-3 text-4xl font-bold text-primary dark:text-accent md:text-5xl">
              About EasyFinanceTools
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              EasyFinanceTools helps Canadians, including beginners and newcomers, understand financial tradeoffs before products, rankings, or referral links enter the conversation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <Link to="/tools/account-decision-tool" className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-secondary">
                Start with the decision framework
              </Link>
              <Link to="/editorial-standards" className="rounded-xl border border-slate-300 px-4 py-2 text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:text-accent">
                Editorial standards
              </Link>
              <Link to="/founder-transparency" className="rounded-xl border border-slate-300 px-4 py-2 text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:text-accent">
                Founder transparency
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              {FOUNDER_HEADSHOT_URL ? (
                <img
                  src={FOUNDER_HEADSHOT_URL}
                  alt="Gourav Kumar"
                  className="h-20 w-20 rounded-2xl object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-white">
                  GK
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Founder</p>
                <h2 className="mt-1 text-2xl font-bold text-primary dark:text-accent">Gourav Kumar</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{FOUNDER_LOCATION}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Independent site operator, calculator builder, and editor. Not a licensed financial advisor, accountant, mortgage broker, or tax professional.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              {FOUNDER_LINKEDIN_URL ? (
                <a href={FOUNDER_LINKEDIN_URL} target="_blank" rel="noreferrer" className="text-primary underline dark:text-secondary">
                  LinkedIn
                </a>
              ) : null}
              <Link to="/contact" className="text-primary underline dark:text-secondary">Contact</Link>
              <Link to="/founder-transparency" className="text-primary underline dark:text-secondary">Transparency</Link>
              <Link to="/corrections" className="text-primary underline dark:text-secondary">Corrections</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="surface-card p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Founder and operator</p>
              <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Why EasyFinanceTools exists</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  EasyFinanceTools is an independent Canadian personal finance education and calculator platform founded by Gourav Kumar in {FOUNDER_LOCATION}. After moving to Canada in 2022, Gourav found many Canadian financial systems difficult to understand at first: TFSA, RRSP, FHSA, investing accounts, mortgage rules, taxes, and contribution-room details all had their own vocabulary and hidden traps.
                </p>
                <p>
                  A lot of online finance content either felt overly technical or too focused on selling products before explaining the decision. This site was built to make the practical layer easier: what changes the answer, what assumption matters, what mistake should be avoided, and which official source should be checked before acting.
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

            <div className="mt-8">
              <DecisionFramework
                eyebrow="How the site thinks"
                title="Decision support before product selection"
                intro="EasyFinanceTools is meant to help users understand the tradeoff, rule, warning, and next path before any provider or product comparison appears."
              />
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Why this site exists</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Canadian financial systems can be confusing, especially when someone is new to the country, new to investing, or trying to compare multiple accounts at once. EasyFinanceTools exists to explain the decision path in plain language before a user opens an account, chooses a platform, or acts on a calculator result.
                </p>
                <p>
                  A calculator result should not stand alone. Each major tool explains what the number means, which assumptions drive it, where it can be wrong, and which official source or related guide helps verify the next step.
                </p>
                <p>
                  The site may use contextual advertising and clearly disclosed referral relationships, but those relationships do not change calculator formulas, source selection, or educational conclusions.
                </p>
              </div>
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What the platform covers</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Canadian financial decisions, organized by goal</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {PLATFORM_AREAS.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                    <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 surface-card p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Decision-first positioning</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Understand the tradeoffs before the products</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                EasyFinanceTools is intentionally not built around product rankings as the first step. The site starts with the underlying decision, then routes readers to calculators, source references, and guides.
              </p>
              <div className="mt-5 grid gap-3">
                {DECISION_FIRST_EXAMPLES.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                    {item}
                  </div>
                ))}
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

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {ACCOUNTABILITY_POINTS.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
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
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Trust links</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Transparency pages worth reading</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {TRUST_LINKS.map((item) => (
                  <Link key={item.href} to={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                    <h3 className="text-lg font-bold text-primary dark:text-accent">{item.label}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
                  </Link>
                ))}
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

            <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Current trust roadmap</p>
              <h2 className="mt-2 text-2xl font-bold">What still needs to improve</h2>
              <div className="mt-4 space-y-3 text-sm leading-7">
                <p>
                  The site is founder-operated today. Over time, the highest-risk pages should receive external review from qualified Canadian tax, accounting, planning, or mortgage professionals where appropriate.
                </p>
                <p>
                  A real founder headshot and verified public LinkedIn link should be added here when available. Those assets should be real, current, and not stock imagery.
                </p>
                <p>
                  Reader corrections and source updates are handled through the contact and corrections process rather than pretending the site is finished.
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
