import React, { useMemo, useState } from "react";
import SEO from "../components/SEO";
import SurfaceTrackedLink from "../components/SurfaceTrackedLink";
import EducationalDisclaimer from "../components/EducationalDisclaimer";
import FAQSchema from "../components/FAQSchema";

const tools = [
  { title: "Tip Calculator", desc: "Calculate the tip, split the bill, and compare pre-tax vs after-tax tipping with simple input boxes.", link: "/tools/tip-calculator", badge: "New", category: "Budget", color: "border-amber-200 hover:border-amber-400" },
  { title: "GST/HST Calculator", desc: "Add sales tax or reverse it from a final price for every Canadian province and territory.", link: "/tools/gst-hst-calculator", badge: "New", category: "Tax", color: "border-emerald-200 hover:border-emerald-400" },
  { title: "Salary to Hourly Calculator", desc: "Turn annual salary into hourly, bi-weekly, semi-monthly, and monthly gross pay with vacation-week assumptions.", link: "/tools/salary-to-hourly-calculator", badge: "New", category: "Budget", color: "border-sky-200 hover:border-sky-400" },
  { title: "CAD USD Converter", desc: "Convert CAD and USD using the Bank of Canada reference rate with recent trend context.", link: "/tools/cad-usd-converter", badge: "New", category: "Investing", color: "border-cyan-200 hover:border-cyan-400" },
  { title: "Inflation Calculator", desc: "Compare purchasing power across years using the Bank of Canada inflation-calculator series.", link: "/tools/inflation-calculator", badge: "New", category: "Budget", color: "border-fuchsia-200 hover:border-fuchsia-400" },
  { title: "Mortgage Affordability Calculator", desc: "Estimate the home price your income can support with Canadian stress-test and debt-ratio assumptions.", link: "/tools/mortgage-affordability-calculator", badge: "New", category: "Real Estate", color: "border-rose-200 hover:border-rose-400" },
  { title: "Income Tax Calculator", desc: "Calculate your exact take-home pay, federal + provincial tax, CPP, and EI for all provinces.", link: "/tools/income-tax-calculator", badge: "New", category: "Tax", color: "border-indigo-200 hover:border-indigo-400" },
  { title: "Compound Interest Calculator", desc: "Project long-term growth in CAD with monthly contributions, fees, and inflation.", link: "/tools/compound-interest-calculator", badge: "High Demand", category: "Investing", color: "border-blue-200 hover:border-blue-400" },
  { title: "TFSA Calculator", desc: "Model tax-free growth, compare contribution pace, and use it as a baseline when choosing between registered accounts.", link: "/tools/tfsa-calculator", badge: "Most Popular", category: "Savings", color: "border-blue-200 hover:border-blue-400" },
  { title: "RRSP Calculator", desc: "Estimate refund value, compare contribution timing, and see when the deduction starts to matter more.", link: "/tools/rrsp-calculator", badge: "2026 Updated", category: "Savings", color: "border-green-200 hover:border-green-400" },
  { title: "FHSA Planner", desc: "Estimate deduction value, room usage, and down-payment growth before deciding where the next contribution should go.", link: "/tools/fhsa-calculator", badge: "Featured", category: "Savings", color: "border-orange-200 hover:border-orange-400" },
  { title: "Mortgage Calculator", desc: "Calculate your real Canadian mortgage payment with CMHC insurance and land transfer tax.", link: "/tools/mortgage-calculator", badge: "New", category: "Real Estate", color: "border-red-200 hover:border-red-400" },
  { title: "Rent vs Buy Calculator", desc: "Compare renting vs buying with total costs, net worth, and the break-even year.", link: "/tools/rent-vs-buy", badge: "New", category: "Real Estate", color: "border-teal-200 hover:border-teal-400" },
  { title: "Capital Gains Tax Calculator", desc: "Calculate capital gains tax on stocks, crypto, real estate, and small business shares.", link: "/tools/capital-gains-tax", badge: "New", category: "Tax", color: "border-pink-200 hover:border-pink-400" },
  { title: "CPP and OAS Estimator", desc: "Estimate government retirement income and compare collection ages.", link: "/tools/cpp-oas-estimator", badge: "New", category: "Retirement", color: "border-red-200 hover:border-red-400" },
  { title: "ETF Income Simulator", desc: "Compare Canadian dividend ETFs, DRIP assumptions, and the capital needed to target monthly income goals.", link: "/tools/dividend-calculator", badge: "Featured", category: "Investing", color: "border-yellow-200 hover:border-yellow-400" },
  { title: "Budget Tracker", desc: "Track income and expenses so you can plan monthly cash flow with less guesswork.", link: "/tools/budget-tracker", badge: null, category: "Budget", color: "border-purple-200 hover:border-purple-400" },
  { title: "Net Worth Calculator", desc: "Track assets and liabilities and see your longer-term financial picture.", link: "/tools/investment-tracker", badge: "Updated", category: "Investing", color: "border-cyan-200 hover:border-cyan-400" },
  { title: "FIRE Calculator", desc: "Find your financial independence number, retirement date, and safe withdrawal strategy.", link: "/tools/fire-calculator", badge: "New", category: "Retirement", color: "border-orange-200 hover:border-orange-400" },
  { title: "GIC Calculator", desc: "See how much your GIC could earn at maturity and compare rates from Canadian institutions.", link: "/tools/gic-calculator", badge: "New", category: "Savings", color: "border-green-200 hover:border-green-400" },
  { title: "Debt Payoff Calculator", desc: "Compare avalanche vs snowball and see the fastest path to being debt-free.", link: "/tools/debt-payoff", badge: "New", category: "Budget", color: "border-red-200 hover:border-red-400" },
  { title: "Savings Goal Calculator", desc: "Set your goal and timeline and get the monthly amount needed to reach it.", link: "/tools/savings-goal", badge: "New", category: "Savings", color: "border-blue-200 hover:border-blue-400" },
  { title: "Pay Stub Calculator", desc: "Enter your salary or hourly rate and see your estimated Canadian pay stub.", link: "/tools/net-pay-calculator", badge: "New", category: "Tax", color: "border-indigo-200 hover:border-indigo-400" },
];

const categories = ["All", "Savings", "Real Estate", "Tax", "Retirement", "Investing", "Budget"];

const decisionPaths = [
  {
    title: "Should I use a TFSA, RRSP, or FHSA first?",
    body: "Use the account comparison guide before opening a calculator if the account order is still unclear.",
    href: "/blog/tfsa-vs-rrsp-vs-fhsa-canada",
    ctaLabel: "decision_path_tfsa_rrsp_fhsa",
  },
  {
    title: "Where should my next registered-account dollar go?",
    body: "Start with TFSA vs RRSP, then use the FHSA calculator if a first home is part of the plan.",
    href: "/blog/tfsa-vs-rrsp-canada-2026",
    ctaLabel: "decision_path_registered_accounts",
  },
  {
    title: "How much could my investing habit grow?",
    body: "Use compound interest first, then check whether the TFSA, RRSP, or FHSA wrapper changes the result.",
    href: "/tools/compound-interest-calculator",
    ctaLabel: "decision_path_compound_growth",
  },
  {
    title: "Is dividend income realistic for my portfolio?",
    body: "Model the capital, yield, DRIP, and account fit before choosing a dividend ETF or platform.",
    href: "/tools/dividend-calculator",
    ctaLabel: "decision_path_dividend_income",
  },
  {
    title: "Can I afford the home, not just the payment?",
    body: "Check affordability, mortgage cost, and rent-vs-buy tradeoffs before treating approval as the whole answer.",
    href: "/tools/mortgage-affordability-calculator",
    ctaLabel: "decision_path_home_affordability",
  },
];

const toolHubFaqs = [
  {
    q: "Which finance calculator should I start with?",
    a: "If you are choosing between accounts, start with the TFSA, RRSP, or FHSA tools. If you are testing a savings habit, start with the compound interest calculator.",
  },
  {
    q: "Are these calculators specific to Canada?",
    a: "Yes. The hub is built around Canadian account types, tax concepts, CAD examples, provincial sales-tax workflows, and Canadian retirement or home-buying decisions.",
  },
  {
    q: "Do the calculators replace official tax advice?",
    a: "No. They are educational estimates. Use CRA, provincial, lender, or provider documents for official numbers and speak with a qualified professional for personal advice.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. The tools are free to open and use without an email sign-up.",
  },
];

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
        title="Free Canadian Finance Calculators 2026 | All Tools"
        description="Browse 23 free Canadian finance calculators: TFSA, RRSP, FHSA, dividend, mortgage, tax, GIC, FIRE, debt payoff, and more. No sign-up required."
        canonical="https://easyfinancetools.com/tools"
      />
      <FAQSchema faqs={toolHubFaqs} />

      <div className="bg-gradient-to-br from-primary to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-50">
            Search by decision, not just category
          </div>
          <h1 id="tools-page-title" className="mb-4 text-4xl font-bold md:text-5xl">Canadian money decision tools</h1>
          <p className="mx-auto max-w-3xl text-lg text-blue-50">
            Pick the question you are trying to answer, compare scenarios, and move into the guide or next calculator that makes the decision clearer.
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
            Last updated April 29, 2026
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">

        <EducationalDisclaimer />

        <section className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900/60 dark:bg-blue-950/30">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Quick answer</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the tools page as a decision map</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700 dark:text-slate-300">
            If the account choice is unclear, start with TFSA, RRSP, or FHSA comparisons. If the account is already clear, open the calculator that models the number you need: contribution room, future growth, take-home pay, tax, mortgage cost, dividend income, or debt payoff.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left text-sm dark:border-slate-700 dark:bg-slate-900">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Decision</th>
                  <th className="px-4 py-3 font-semibold">Start here</th>
                  <th className="px-4 py-3 font-semibold">Then compare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  ["Account priority", "TFSA vs RRSP vs FHSA guide", "TFSA, RRSP, and FHSA calculators"],
                  ["Long-term growth", "Compound interest calculator", "TFSA or RRSP calculator"],
                  ["Income goal", "Dividend calculator", "Canadian dividend ETF guide"],
                  ["Home buying", "FHSA calculator", "Mortgage affordability and rent-vs-buy tools"],
                ].map(([decision, start, compare]) => (
                  <tr key={decision}>
                    <td className="px-4 py-3 font-semibold text-primary dark:text-accent">{decision}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{start}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{compare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="surface-soft grid gap-4 p-5 text-sm text-slate-700 dark:text-slate-300 md:grid-cols-4">
          <div>
            <p className="font-semibold text-primary dark:text-accent">No sign-up</p>
            <p className="mt-1">Open any tool and start modeling the decision immediately.</p>
          </div>
          <div>
            <p className="font-semibold text-primary dark:text-accent">Privacy-first</p>
            <p className="mt-1">We do not need your email to show results or pressure you into a funnel.</p>
          </div>
          <div>
            <p className="font-semibold text-primary dark:text-accent">Methodology</p>
            <p className="mt-1">Important tools should explain assumptions, limits, and update dates.</p>
          </div>
          <div>
            <p className="font-semibold text-primary dark:text-accent">Built for Canada</p>
            <p className="mt-1">Tax, home-buying, ETF income, retirement, and registered-account workflows for Canadian users.</p>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Decision paths</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Start with the question, then open the calculator</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            These paths group calculators by the real decision a Canadian reader is trying to make, so the tools page feels like a guided hub instead of a loose list.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {decisionPaths.map((item) => (
              <SurfaceTrackedLink
                key={item.href}
                to={item.href}
                eventName="tools_hub_decision_path_click"
                ctaLabel={item.ctaLabel}
                trackingParams={{ section: "decision_paths", destination_type: item.href.startsWith("/blog") ? "article" : "tool" }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
              >
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related guides</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use a guide when the calculator needs context</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "TFSA contribution room", href: "/blog/tfsa-contribution-room-canada-2026" },
              { title: "TFSA vs RRSP vs FHSA", href: "/blog/tfsa-vs-rrsp-vs-fhsa-canada" },
              { title: "FHSA rules", href: "/blog/fhsa-rules-canada-2026" },
              { title: "Canadian dividend ETFs", href: "/blog/best-canadian-dividend-etfs-2026" },
            ].map((item) => (
              <SurfaceTrackedLink
                key={item.href}
                to={item.href}
                eventName="tools_hub_cta_click"
                ctaLabel={`related_guide_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                trackingParams={{ section: "related_guides", destination_type: "article" }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900/60 dark:text-accent"
              >
                {item.title}
              </SurfaceTrackedLink>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))]">
          <SurfaceTrackedLink
            to="/tools/compound-interest-calculator"
            eventName="tools_hub_cta_click"
            ctaLabel="featured_card_compound_interest_calculator"
            trackingParams={{ section: "featured_cards", destination_type: "tool", emphasis: "primary" }}
            className="rounded-2xl bg-gradient-to-br from-primary via-[#0a4c89] to-secondary p-5 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-50">Core planning tool</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight">Compound interest and contribution planning</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-blue-50">
              Project long-term growth, contribution pace, inflation drag, and the compounding base that supports every other account decision.
            </p>
            <div className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              Open featured calculator
            </div>
          </SurfaceTrackedLink>

          {[
            { label: "First-home planning", title: "FHSA", href: "/tools/fhsa-calculator" },
            { label: "Income planning", title: "ETF income", href: "/tools/dividend-calculator" },
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
              <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">{item.title} tool</h3>
            </SurfaceTrackedLink>
          ))}
        </div>

        <div className="surface-card mb-6 mt-8 p-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="Search tools such as FHSA, ETF income, TFSA, mortgage, tax, debt..."
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
                  <span>Open tool and see next steps</span>
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
            { title: "Start with the account decision", body: "FHSA, TFSA, and RRSP tools work best when you compare the next dollar instead of looking at one account in isolation.", href: "/tools/fhsa-calculator" },
            { title: "Model income goals", body: "The ETF income simulator helps turn a yield idea into a monthly-income and capital requirement plan.", href: "/tools/dividend-calculator" },
            { title: "Compare housing tradeoffs", body: "Mortgage, affordability, and rent-vs-buy tools are stronger when you use them together instead of as isolated checks.", href: "/tools/mortgage-calculator" },
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

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Questions about the calculator hub</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {toolHubFaqs.map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
