import React from "react";
import { Link } from "react-router-dom";

const tools = [
  { icon: "💰", title: "TFSA Calculator", desc: "Calculate your Tax-Free Savings Account growth with 2026 limits.", link: "/tools/tfsa-calculator", badge: "Most Popular", color: "border-blue-200 hover:border-blue-400" },
  { icon: "📈", title: "RRSP Calculator", desc: "Find out your tax refund and how much your RRSP will grow.", link: "/tools/rrsp-calculator", badge: "2026 Updated", color: "border-green-200 hover:border-green-400" },
  { icon: "🏠", title: "FHSA Calculator", desc: "Plan your First Home Savings Account — deductible contributions, tax-free withdrawals.", link: "/tools/fhsa-calculator", badge: "New!", color: "border-orange-200 hover:border-orange-400" },
  { icon: "🏡", title: "Mortgage Calculator", desc: "Calculate your real Canadian mortgage payment with CMHC insurance and land transfer tax.", link: "/tools/mortgage-calculator", badge: "New!", color: "border-red-200 hover:border-red-400" },
  { icon: "⚖️", title: "Rent vs Buy Calculator", desc: "Compare renting vs buying with total costs, net worth, and the break-even year.", link: "/tools/rent-vs-buy", badge: "New!", color: "border-teal-200 hover:border-teal-400" },
  { icon: "📊", title: "Capital Gains Tax Calculator", desc: "Calculate capital gains tax on stocks, crypto, real estate, and small business shares.", link: "/tools/capital-gains-tax", badge: "New!", color: "border-pink-200 hover:border-pink-400" },
  { icon: "💵", title: "Dividend Calculator", desc: "Plan your passive income with DRIP reinvestment growth.", link: "/tools/dividend-calculator", badge: null, color: "border-yellow-200 hover:border-yellow-400" },
  { icon: "📊", title: "Budget Tracker", desc: "Track your income and expenses. Build a healthier budget.", link: "/tools/budget-tracker", badge: null, color: "border-purple-200 hover:border-purple-400" },
  { icon: "📉", title: "Investment Tracker", desc: "Monitor your stocks, ETFs, and overall portfolio performance.", link: "/tools/investment-tracker", badge: "Coming Soon", color: "border-gray-200 opacity-70" },
];

export default function ToolsPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-4">
          Free Financial Tools 🇨🇦
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          All tools are free, private, and updated for 2026. No sign-up required.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(tool => (
          <Link key={tool.title} to={tool.link}
            className={`group bg-white dark:bg-gray-800 border-2 ${tool.color} rounded-2xl p-6 transition-all hover:shadow-lg`}>
            <div className="flex items-start justify-between mb-4">
              <span className="text-5xl">{tool.icon}</span>
              {tool.badge && (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  {tool.badge}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold mb-2 text-primary dark:text-white">{tool.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{tool.desc}</p>
            <div className="mt-4 text-secondary font-semibold text-sm group-hover:underline">
              Open Calculator →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
