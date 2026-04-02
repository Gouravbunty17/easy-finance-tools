import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const tools = [
  { title: "Income Tax Calculator", desc: "Calculate your exact take-home pay, federal + provincial tax, CPP, and EI for all provinces.", link: "/tools/income-tax-calculator", badge: "New", category: "Tax", color: "border-indigo-200 hover:border-indigo-400" },
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
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <SEO
        title="Free Canadian Finance Tools"
        description="Browse free Canadian finance calculators for tax, TFSA, RRSP, mortgage, debt payoff, paycheques, investing, and savings goals."
        canonical="https://easyfinancetools.com/tools"
      />

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-4">
          Free Canadian Finance Tools
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Search by goal, compare scenarios, and move into related guides without leaving the site.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 md:grid-cols-4">
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

      <div className="mb-6 mt-8">
        <input
          type="text"
          placeholder="Search calculators such as TFSA, mortgage, tax, debt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search finance tools"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
              activeCategory === category
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((tool) => (
            <Link
              key={tool.title}
              to={tool.link}
              className={`group bg-white dark:bg-gray-800 border-2 ${tool.color} rounded-2xl p-6 transition-all hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-semibold uppercase tracking-wide text-secondary">{tool.category}</span>
                {tool.badge && (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    {tool.badge}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mb-2 text-primary dark:text-white">{tool.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{tool.desc}</p>
              <div className="mt-4 text-secondary font-semibold text-sm group-hover:underline">
                Open calculator and see results
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">?</div>
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
          { title: "Plan registered accounts", body: "Use TFSA, RRSP, and FHSA tools together instead of in isolation.", href: "/tools/tfsa-calculator" },
          { title: "Compare debt and housing", body: "Mortgage, rent-vs-buy, and debt payoff tools work best when paired with scenario planning.", href: "/tools/mortgage-calculator" },
        ].map((item) => (
          <Link key={item.title} to={item.href} className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-gray-800">
            <h2 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
