import React, { useMemo, useState } from "react";
import {
  ArrowRightIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  HomeModernIcon,
  ScaleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import SEO from "../components/SEO";
import SurfaceTrackedLink from "../components/SurfaceTrackedLink";
import FAQSchema from "../components/FAQSchema";
import TrustStrip from "../components/TrustStrip";
import PrivacyNote from "../components/PrivacyNote";
import SourceNote from "../components/SourceNote";

const TOOL_CATEGORIES = [
  {
    title: "Account & Tax Tools",
    icon: ScaleIcon,
    tools: [
      {
        name: "Account Decision Tool",
        href: "/tools/account-decision-tool",
        who: "Canadians choosing between TFSA, RRSP, FHSA, and employer matching.",
        decision: "Which account deserves the next contribution.",
        status: "Live",
      },
      {
        name: "TFSA Calculator",
        href: "/tools/tfsa-calculator",
        who: "People checking TFSA room, growth, withdrawals, and flexibility.",
        decision: "Whether TFSA room should be used now or compared against RRSP/FHSA.",
        status: "Live",
      },
      {
        name: "RRSP Calculator",
        href: "/tools/rrsp-calculator",
        who: "Canadians comparing deduction value, refunds, and retirement tax deferral.",
        decision: "Whether an RRSP contribution meaningfully changes the tax plan.",
        status: "Live",
      },
      {
        name: "FHSA Calculator",
        href: "/tools/fhsa-calculator",
        who: "First-time home buyers comparing FHSA, TFSA, and RRSP paths.",
        decision: "Whether the FHSA fits the purchase timeline and tax situation.",
        status: "Live",
      },
      {
        name: "Income Tax Calculator",
        href: "/tools/income-tax-calculator",
        who: "Canadians estimating federal, provincial, CPP, and EI impacts.",
        decision: "How income and province affect an estimated tax result.",
        status: "Live",
      },
    ],
  },
  {
    title: "Investing & Dividend Tools",
    icon: ChartBarIcon,
    tools: [
      {
        name: "Investment Fit Framework",
        href: "/tools/investment-fit-framework",
        who: "Investors checking account location, yield, concentration, and timeline risk.",
        decision: "How an investment may fit inside a broader Canadian account plan.",
        status: "Live",
      },
      {
        name: "Dividend Calculator",
        href: "/tools/dividend-calculator",
        who: "Income-focused investors testing yield, DRIP, capital targets, and account fit.",
        decision: "Whether a dividend-income assumption is realistic enough to explore further.",
        status: "Live",
      },
      {
        name: "Compound Interest Calculator",
        href: "/tools/compound-interest-calculator",
        who: "People modeling contribution habits, fees, inflation, and long-term growth.",
        decision: "How much contribution pace and time horizon matter.",
        status: "Live",
      },
      {
        name: "Net Worth Calculator",
        href: "/tools/investment-tracker",
        who: "Households organizing assets, debts, and longer-term financial progress.",
        decision: "Whether the balance sheet supports the next planning move.",
        status: "Live",
      },
    ],
  },
  {
    title: "Mortgage & Housing Tools",
    icon: HomeModernIcon,
    tools: [
      {
        name: "Mortgage Affordability Calculator",
        href: "/tools/mortgage-affordability-calculator",
        who: "Home buyers testing income, debt ratios, and stress-test pressure.",
        decision: "What purchase range may be comfortable before lender comparison.",
        status: "Live",
      },
      {
        name: "Mortgage Calculator",
        href: "/tools/mortgage-calculator",
        who: "Buyers comparing payment, amortization, rate, and down-payment assumptions.",
        decision: "How mortgage terms affect the monthly and long-term cost.",
        status: "Live",
      },
      {
        name: "Rent vs Buy Calculator",
        href: "/tools/rent-vs-buy",
        who: "Renters and buyers comparing total housing tradeoffs.",
        decision: "Whether ownership economics still make sense after costs and timing.",
        status: "Live",
      },
    ],
  },
  {
    title: "Retirement Tools",
    icon: BuildingLibraryIcon,
    tools: [
      {
        name: "FIRE Calculator",
        href: "/tools/fire-calculator",
        who: "People testing savings rate, retirement date, and withdrawal assumptions.",
        decision: "How far the current path is from financial independence.",
        status: "Live",
      },
      {
        name: "CPP and OAS Estimator",
        href: "/tools/cpp-oas-estimator",
        who: "Canadians estimating government retirement income context.",
        decision: "How public benefits may fit into a retirement-income plan.",
        status: "Live",
      },
    ],
  },
  {
    title: "General Calculators",
    icon: WrenchScrewdriverIcon,
    tools: [
      {
        name: "GIC Calculator",
        href: "/tools/gic-calculator",
        who: "Savers comparing guaranteed-interest terms and maturity values.",
        decision: "Whether a fixed-rate savings option fits the timeline.",
        status: "Live",
      },
      {
        name: "Debt Payoff Calculator",
        href: "/tools/debt-payoff",
        who: "Households comparing avalanche and snowball payoff strategies.",
        decision: "Which payoff order reduces pressure or interest cost.",
        status: "Live",
      },
      {
        name: "Budget Tracker",
        href: "/tools/budget-tracker",
        who: "People organizing monthly income and spending categories.",
        decision: "Where cash flow needs adjustment before bigger planning moves.",
        status: "Live",
      },
      {
        name: "Small utility calculators",
        href: "/tools",
        who: "Quick checks such as GST/HST, tips, currency, inflation, and pay conversion.",
        decision: "Simple one-off estimates that are useful but not core planning pages.",
        status: "Live",
        muted: true,
      },
    ],
  },
];

const DECISION_PROMPTS = [
  { title: "Pay less tax", href: "/tools/account-decision-tool", icon: BanknotesIcon },
  { title: "Buy a first home", href: "/tools/fhsa-calculator", icon: HomeModernIcon },
  { title: "Build dividend income", href: "/tools/dividend-calculator", icon: ChartBarIcon },
  { title: "Plan retirement", href: "/tools/fire-calculator", icon: BuildingLibraryIcon },
  { title: "Compare accounts", href: "/tools/account-decision-tool", icon: ScaleIcon },
  { title: "Estimate affordability", href: "/tools/mortgage-affordability-calculator", icon: HomeModernIcon },
];

const toolHubFaqs = [
  {
    q: "Which tool should I start with?",
    a: "Start with the goal that matches your decision. If the account order is unclear, use the Account Decision Tool before opening TFSA, RRSP, or FHSA calculators.",
  },
  {
    q: "Are these calculators specific to Canada?",
    a: "Yes. The main tools are built around Canadian accounts, tax concepts, mortgage assumptions, and retirement or home-buying decisions.",
  },
  {
    q: "Do the calculators replace official advice?",
    a: "No. They are educational estimates. Verify official numbers with CRA, provincial sources, lenders, or a qualified professional before making decisions.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. The tools are available without an email signup or login.",
  },
];

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return TOOL_CATEGORIES.map((category) => {
      const tools = category.tools.filter((tool) => {
        const matchesCategory = activeCategory === "All" || activeCategory === category.title;
        const matchesSearch =
          !query ||
          [tool.name, tool.who, tool.decision, category.title].some((value) => value.toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
      });
      return { ...category, tools };
    }).filter((category) => category.tools.length > 0);
  }, [search, activeCategory]);

  const count = visibleCategories.reduce((sum, category) => sum + category.tools.length, 0);

  return (
    <main className="bg-white dark:bg-gray-950" aria-labelledby="tools-page-title">
      <SEO
        title="Canadian Finance Tools by Decision | EasyFinanceTools"
        description="Browse Canadian TFSA, RRSP, FHSA, dividend, mortgage, retirement, tax, and account decision tools organized by financial goal. No login required."
        canonical="https://easyfinancetools.com/tools"
      />
      <FAQSchema faqs={toolHubFaqs} />

      <section className="border-b border-slate-200 bg-slate-950 px-4 py-16 text-white dark:border-slate-800">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Decision tool library</p>
          <h1 id="tools-page-title" className="mt-3 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Canadian finance tools organized by the decision they support
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
            Choose a goal, run the relevant calculator, then follow the next educational step only when it clarifies the tradeoff.
          </p>
          <TrustStrip className="mt-8 max-w-5xl bg-white/95 text-slate-900 dark:bg-slate-900/90" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Start with your goal</p>
            <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Decision-first paths</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {DECISION_PROMPTS.map((item) => {
                const Icon = item.icon;
                return (
                  <SurfaceTrackedLink
                    key={item.title}
                    to={item.href}
                    eventName="tools_goal_router_click"
                    ctaLabel={`goal_${slug(item.title)}`}
                    trackingParams={{ section: "tools_goal_router", destination_type: "tool" }}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                    <span className="mt-3 block font-bold text-primary dark:text-accent">{item.title}</span>
                  </SurfaceTrackedLink>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <PrivacyNote />
            <SourceNote />
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-gray-900">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search TFSA, RRSP, dividend, mortgage, retirement..."
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-gray-800 dark:text-white"
              aria-label="Search Canadian finance tools"
            />
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {count} matching tools
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["All", ...TOOL_CATEGORIES.map((category) => category.title)].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`focus-ring rounded-full border px-4 py-2 text-xs font-bold transition ${
                  activeCategory === category
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {visibleCategories.map((category) => {
            const Icon = category.icon;
            return (
              <section key={category.title} aria-labelledby={`${slug(category.title)}-heading`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 id={`${slug(category.title)}-heading`} className="text-2xl font-bold text-primary dark:text-accent">
                    {category.title}
                  </h2>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {category.tools.map((tool) => (
                    <SurfaceTrackedLink
                      key={`${category.title}-${tool.name}`}
                      to={tool.href}
                      eventName="tools_card_click"
                      ctaLabel={`tool_${slug(tool.name)}`}
                      trackingParams={{ section: "categorized_tools", tool_category: category.title, destination_type: "tool" }}
                      className={`group rounded-3xl border p-5 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-700 dark:bg-gray-900 ${
                        tool.muted ? "border-dashed border-slate-300 bg-slate-50/70" : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-xl font-bold text-primary dark:text-accent">{tool.name}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                          tool.status === "Live"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}>
                          {tool.status}
                        </span>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Who it helps</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{tool.who}</p>
                      <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Decision it supports</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{tool.decision}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary dark:text-emerald-300">
                        Open tool
                        <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </SurfaceTrackedLink>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {count === 0 ? (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="font-bold text-primary dark:text-accent">No matching tools found.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-3 text-sm font-semibold text-secondary underline"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
