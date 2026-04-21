import React, { useMemo, useState } from "react";
import SEO from "../components/SEO";
import SurfaceTrackedLink from "../components/SurfaceTrackedLink";
import EducationalDisclaimer from "../components/EducationalDisclaimer";

const tools = [
  { title: "Tip Calculator", desc: "Calculate the tip, split the bill, and compare pre-tax vs after-tax tipping with simple input boxes.", link: "/tools/tip-calculator", badge: "New", category: "Budget", color: "border-amber-200 hover:border-amber-400" },
  { title: "GST/HST Calculator", desc: "Add sales tax or reverse it from a final price for every Canadian province and territory.", link: "/tools/gst-hst-calculator", badge: "New", category: "Tax", color: "border-emerald-200 hover:border-emerald-400" },
  { title: "Salary to Hourly Calculator", desc: "Turn annual salary into hourly, bi-weekly, semi-monthly, and monthly gross pay with vacation-week assumptions.", link: "/tools/salary-to-hourly-calculator", badge: "New", category: "Budget", color: "border-sky-200 hover:border-sky-400" },
  { title: "CAD USD Converter", desc: "Convert CAD and USD using the Bank of Canada reference rate with recent trend context.", link: "/tools/cad-usd-converter", badge: "New", category: "Investing", color: "border-cyan-200 hover:border-cyan-400" },
  { title: "Inflation Calculator", desc: "Compare purchasing power across years using the Bank of Canada inflation-calculator series.", link: "/tools/inflation-calculator", badge: "New", category: "Budget", color: "border-fuchsia-200 hover:border-fuchsia-400" },
  { title: "Mortgage Affordability Calculator", desc: "Estimate the home price your income can support with Canadian stress-test and debt-ratio assumptions.", link: "/tools/mortgage-affordability-calculator", badge: "New", category: "Real Estate", color: "border-rose-200 hover:border-rose-400" },
  { title: "Income Tax Calculator", desc: "Calculate your exact take-home pay, federal + provincial tax, CPP, and EI for all provinces.", link: "/tools/income-tax-calculator", badge: "New", category: "Tax", color: "border-indigo-200 hover:border-indigo-400" },
  { title: "Compound Interest Calculator", desc: "Project long-term growth in CAD with monthly contributions, fees, and inflation.", link: "/tools/compound-interest-calculator", badge: "High Demand", category: "Investing", color: "border-blue-200 hover:border-blue-400" },
  { title: "TFSA Calculator", desc: "Calculate your Tax-Free Savings Account growth with 2026 limits.", link: "/tools/tfsa-calculator", badge: "Most Popular", category: "Savings", color: "border-blue-200 hover:border-blue-400" },
  { title: "RRSP Calculator", desc: "Estimate your tax refund and project long-term registered-account growth.", link: "/tools/rrsp-calculator", badge: "2026 Updated", category: "Savings", color: "border-green-200 hover:border-green-400" },
  { title: "FHSA Calculator", desc: "Plan your First Home Savings Account with deductible contributions and tax-free withdrawals.", link: "/tools/fhsa-calculator", badge: "New", category: "Savings", color: "border-orange-200 hover:border-orange-400" },
  { title: "Mortgage Calculator", desc: "Calculate your real Canadian mortgage payment with CMHC insurance and land transfer tax.", link: "/tools/mortgage-calculator", badge: "New", category: "Real Estate", color: "border-red-200 hover:border-red-400" },
  { title: "Rent vs Buy Calculator", desc: "Compare renting vs buying with total costs, net worth, and the break-even year.", link: "/tools/rent-vs-buy", badge: "New", category: "Real Estate", color: "border-teal-200 hover:border-teal-400" },
  { title: "Capital Gains Tax Calculator", desc: "Calculate capital gains tax on stocks, crypto, real estate, and small business shares.", link: "/tools/capital-gains-tax", badge: "New", category: "Tax", color: "border-pink-200 hover:border-pink-400" },
  { title: "CPP and OAS Estimator", desc: "Estimate government retirement income and compare collection ages.", link: "/tools/cpp-oas-estimator", badge: "New", category: "Retirement", color: "border-red-200 hover:border-red-400" },
  { title: "Dividend Calculator", desc: "Project passive income with DRIP reinvestment and long-term compounding.", link: "/tools/dividend-calculator", badge: null, category: "Investing", color: "border-yellow-200 hover:border-yellow-400" },
  { title: "Budget Tracker", desc: "Track income and expenses so you can plan monthly cash flow with less guesswork.", link: "/tools/budget-tracker", badge: null, category: "Budget", color: "border-purple-200 hover:border-purple-400" },
  { title: "Net Worth Calculator", desc: "Track assets and liabilities and see your longer-term financial picture.", link: "/tools/investment-tracker", badge: "Updated", category: "Investing", color: "border-cyan-200 hover:border-cyan-400" },
  { title: "FIRE Calculator", desc: "Find your financial independence number, retirement date, and safe withdrawal strategy.", link: "/tools/fire-calculator", badge: "New", category: "Retirement", color: "border-orange-200 hover:border-orange-400" },
  { title: "GIC Calculator", desc: "See how much your GIC will earn at maturity and compare rates from Canadian institutions.", link: "/tools/gic-calculator", badge: "New", category: "Savings", color: "border-green-200 hover:border-green-400" },
  { title: "Debt Payoff Calculator", desc: "Compare avalanche vs snowball and see the fastest path to being debt-free.", link: "/tools/debt-payoff", badge: "New", category: "Budget", color: "border-red-200 hover:border-red-400" },
  { title: "Savings Goal Calculator", desc: "Set your goal and timeline and get the monthly amount needed to reach it.", link: "/tools/savings-goal", badge: "New", category: "Savings", color: "border-blue-200 hover:border-blue-400" },
  { title: "Pay Stub Calculator", desc: "Enter your salary or hourly rate and see your estimated Canadian pay stub.", link: "/tools/net-pay-calculator", badge: "New", category: "Tax", color: "border-indigo-200 hover:border-indigo-400" },
];

const categories = ["All", "Savings", "Real Estate", "Tax", "Retirement", "Investing", "Budget"];

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tools.filter((tool) => {
      const matchesSearch = !q || tool.title.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <main aria-labelledby="tools-page-title">
      <SEO
        title="Free Canadian Finance Tools"
        description="Browse free Canadian finance calculators for tax, TFSA, RRSP, mortgage, debt payoff, paycheques, investing, and savings goals."
        canonical="https://easyfinancetools.com/tools"
      />

      <div className="bg-gradient-to-br from-primary to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-50">
            Search by goal or category
          </div>
          <h1 id="tools-page-title" className="mb-4 text-4xl font-bold md:text-5xl">Free Canadian Finance Tools</h1>
          <p className="mx-auto max-w-3xl text-lg text-blue-50">
            Search by goal, compare scenarios, and move into related guides without leaving the site.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">

        <EducationalDisclaimer />

        <div className="surface-soft grid gap-4 p-5 text-sm text-slate-700 dark:text-slate-300 md:grid-cols-4">
          <div>
            <p className="font-semibold text-primary dark:text-accent">No sign-up</p>
            <p className="mt-1">Open any tool and calculate immediately.</p>
          </div>
          <div>
            <p className="font-semibold text-primary dark:text-accent">Privacy-first</p>
            <p className="mt-1">We do not need your email to show results.</p>
          </div>
          <div>
            <p className="font-semibold text-primary dark:text-accent">Methodology</p>
            <p className="mt-1">Important tools should explain assumptions and update dates.</p>
          </div>
          <div>
            <p className="font-semibold text-primary dark:text-accent">Built for Canada</p>
            <p className="mt-1">Tax, housing, retirement, and savings workflows for Canadian users.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))]">
          <SurfaceTrackedLink
            to="/tools/compound-interest-calculator"
            eventName="tools_hub_cta_click"
            ctaLabel="featured_card_compound_interest_calculator"
            trackingParams={{ section: "featured_cards", destination_type: "tool", emphasis: "primary" }}
            className="rounded-2xl bg-gradient-to-br from-primary via-[#0a4c89] to-secondary p-5 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-50">Most searched</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight">Compound Interest Calculator</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-blue-50">
              Project long-term growth with monthly contributions, inflation, and fee drag in one place.
            </p>
            <div className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              Open featured calculator
            </div>
          </SurfaceTrackedLink>

          {[
            { label: "Tax", title: "Income tax", href: "/tools/income-tax-calculator" },
            { label: "Real estate", title: "Mortgage", href: "/tools/mortgage-calculator" },
            { label: "Registered accounts", title: "TFSA", href: "/tools/tfsa-calculator" },
          ].map((item) => (
            <SurfaceTrackedLink
              key={item.title}
              to={item.href}
              eventName="tools_hub_cta_click"
              ctaLabel={`featured_card_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
              trackingParams={{ section: "featured_cards", destination_type: "tool", emphasis: "secondary" }}
              className="surface-card p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">{item.label}</p>
              <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">{item.title} calculator</h3>
            </SurfaceTrackedLink>
          ))}
        </div>

        <div className="surface-card mb-6 mt-8 p-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="Search calculators such as TFSA, mortgage, tax, debt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search finance tools"
              className="focus-ring w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <div className="flex items-center rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {filtered.length} matching tools
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                activeCategory === category
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((tool) => (
              <SurfaceTrackedLink
                key={tool.title}
                to={tool.link}
                eventName="tools_hub_cta_click"
                ctaLabel={`tool_card_${tool.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                trackingParams={{
                  section: "tool_cards",
                  destination_type: "tool",
                  tool_title: tool.title,
                  tool_category: tool.category,
                  active_category: activeCategory,
                  search_query: search || "",
                }}
                className={`group rounded-2xl border-2 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800 ${tool.color}`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold uppercase tracking-wide text-secondary">{tool.category}</span>
                  {tool.badge && <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">{tool.badge}</span>}
                </div>
                <h2 className="mb-2 text-xl font-bold text-primary dark:text-white">{tool.title}</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">{tool.desc}</p>
                <div className="mt-5 flex items-center justify-between text-sm font-semibold text-secondary">
                  <span>Open calculator and see results</span>
                  <span className="transition-transform group-hover:translate-x-1">More</span>
                </div>
              </SurfaceTrackedLink>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-600 dark:text-gray-300">
            <div className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-secondary">No Match</div>
            <p className="text-lg">
              No tools found for "<span className="font-semibold">{search}</span>"
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-4 text-sm text-primary underline"
            >
              Clear search
            </button>
          </div>
        )}

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { title: "Start with tax", body: "Income tax and pay stub tools answer one of the highest-intent questions on the site.", href: "/tools/income-tax-calculator" },
            { title: "Model compound growth", body: "Start with compound interest, then compare TFSA, RRSP, and FHSA account choices.", href: "/tools/compound-interest-calculator" },
            { title: "Compare debt and housing", body: "Mortgage, rent-vs-buy, and debt payoff tools work best when paired with scenario planning.", href: "/tools/mortgage-calculator" },
          ].map((item) => (
            <SurfaceTrackedLink
              key={item.title}
              to={item.href}
              eventName="tools_hub_cta_click"
              ctaLabel={`cluster_card_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
              trackingParams={{ section: "cluster_cards", destination_type: "tool" }}
              className="surface-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h2>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.body}</p>
            </SurfaceTrackedLink>
          ))}
        </div>
      </div>
    </main>
  );
}
