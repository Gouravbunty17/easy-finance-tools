import React, { useState, useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, BarElement, CategoryScale,
  LinearScale, Tooltip, Legend
} from "chart.js";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DEFAULT_CATEGORIES = [
  { id: "housing",     label: "Housing",           emoji: "🏠", amount: 1800, color: "#3b82f6" },
  { id: "food",        label: "Food & Groceries",  emoji: "🛒", amount: 600,  color: "#10b981" },
  { id: "transport",   label: "Transportation",    emoji: "🚗", amount: 400,  color: "#f59e0b" },
  { id: "utilities",   label: "Utilities",         emoji: "💡", amount: 200,  color: "#6366f1" },
  { id: "healthcare",  label: "Healthcare",        emoji: "🏥", amount: 100,  color: "#ef4444" },
  { id: "personal",    label: "Personal & Beauty", emoji: "💅", amount: 150,  color: "#ec4899" },
  { id: "entertainment", label: "Entertainment",  emoji: "🎬", amount: 200,  color: "#8b5cf6" },
  { id: "dining",      label: "Dining Out",        emoji: "🍽️", amount: 300,  color: "#f97316" },
  { id: "subscriptions", label: "Subscriptions",  emoji: "📱", amount: 80,   color: "#14b8a6" },
  { id: "savings",     label: "Savings & Investing",emoji: "💰", amount: 500, color: "#22c55e" },
  { id: "debt",        label: "Debt Payments",     emoji: "📋", amount: 300,  color: "#dc2626" },
  { id: "other",       label: "Other",             emoji: "📦", amount: 100,  color: "#94a3b8" },
];

const FAQS = [
  { q: "What is the 50/30/20 budget rule?", a: "The 50/30/20 rule splits after-tax income into three buckets: 50% for needs (housing, food, utilities, transport), 30% for wants (entertainment, dining, subscriptions), and 20% for savings and debt repayment. It's a simple starting framework, though ideal ratios vary by income level and location." },
  { q: "What savings rate should I target?", a: "A common benchmark is saving 20% of your gross income. However, for early retirement (FIRE), savers typically target 40–70%. Even starting at 5–10% is better than nothing, and every 1% increase compresses your time to financial independence." },
  { q: "How much should I spend on housing?", a: "The traditional rule is to keep housing costs (rent or mortgage + utilities) under 30% of gross income. In high-cost cities like Toronto and Vancouver, many Canadians spend 35–45%, but aim to keep it as low as possible to leave room for savings." },
  { q: "What is an emergency fund and how large should it be?", a: "An emergency fund is 3–6 months of living expenses held in a liquid account (HISA or TFSA). Start with $1,000 as a mini emergency fund, then build to 3 months of expenses, then 6. Keep it separate from your regular accounts so you're not tempted to spend it." },
];

function fmt(n) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
}

export default function BudgetTracker() {
  const [income, setIncome] = useState(6500);
  const [period, setPeriod] = useState("monthly");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCat, setNewCat] = useState("");
  const [tab, setTab] = useState("budget");

  const incomeValue = asNumber(income);
  const monthlyIncome = period === "monthly" ? incomeValue : period === "biweekly" ? incomeValue * 26 / 12 : incomeValue / 12;

  const totalExpenses = useMemo(() => categories.reduce((s, c) => s + asNumber(c.amount), 0), [categories]);
  const remaining = monthlyIncome - totalExpenses;
  const savingsRate = monthlyIncome > 0 ? (remaining / monthlyIncome) * 100 : 0;

  const updateAmount = (id, val) => {
    setCategories(cats => cats.map(c => c.id === id ? { ...c, amount: parseNumericInput(val) } : c));
  };

  const addCategory = () => {
    if (!newCat.trim()) return;
    setCategories(cats => [...cats, {
      id: Date.now().toString(), label: newCat, emoji: "📦",
      amount: 0, color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6,"0")}`
    }]);
    setNewCat("");
  };

  const removeCategory = (id) => setCategories(cats => cats.filter(c => c.id !== id));

  // 50/30/20 analysis
  const needs = ["housing", "food", "transport", "utilities", "healthcare"].reduce((s, id) => {
    const c = categories.find(c => c.id === id);
    return s + asNumber(c?.amount);
  }, 0);
  const wants = ["entertainment", "dining", "subscriptions", "personal"].reduce((s, id) => {
    const c = categories.find(c => c.id === id);
    return s + asNumber(c?.amount);
  }, 0);
  const savingsDebt = ["savings", "debt"].reduce((s, id) => {
    const c = categories.find(c => c.id === id);
    return s + asNumber(c?.amount);
  }, 0) + Math.max(0, remaining);

  const needsPct  = monthlyIncome > 0 ? (needs / monthlyIncome * 100).toFixed(0) : 0;
  const wantsPct  = monthlyIncome > 0 ? (wants / monthlyIncome * 100).toFixed(0) : 0;
  const savesPct  = monthlyIncome > 0 ? (savingsDebt / monthlyIncome * 100).toFixed(0) : 0;

  // Emergency fund
  const emergencyFund3mo = totalExpenses * 3;
  const emergencyFund6mo = totalExpenses * 6;

  // Doughnut data
  const nonZeroCats = categories.filter(c => asNumber(c.amount) > 0);
  const doughnutData = {
    labels: nonZeroCats.map(c => c.label),
    datasets: [{
      data: nonZeroCats.map(c => asNumber(c.amount)),
      backgroundColor: nonZeroCats.map(c => c.color),
      borderWidth: 2,
      borderColor: "#fff",
    }],
  };

  // 50/30/20 bar
  const ruleData = {
    labels: ["Needs", "Wants", "Savings & Debt"],
    datasets: [
      {
        label: "Your %",
        data: [needsPct, wantsPct, savesPct],
        backgroundColor: ["#3b82f6", "#f59e0b", "#22c55e"],
        borderRadius: 6,
      },
      {
        label: "Target %",
        data: [50, 30, 20],
        backgroundColor: ["rgba(59,130,246,0.2)", "rgba(245,158,11,0.2)", "rgba(34,197,94,0.2)"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="Budget Tracker 2026 — Canadian Monthly Budget Calculator"
        description="Free Canadian budget tracker with 50/30/20 rule analysis, spending breakdown charts, emergency fund calculator, and savings rate. No signup required."
        canonical="https://easyfinancetools.com/tools/budget-tracker"
      />

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">Budget Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300">Track your monthly spending, see where your money goes, and optimize your savings rate.</p>
      </div>

      {/* Income input */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
        <h2 className="font-bold text-lg text-primary dark:text-accent mb-4">Your Income</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Income Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                type="number"
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none text-lg font-semibold"
                value={income}
                onChange={e => setIncome(parseNumericInput(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pay Period</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="biweekly">Bi-Weekly (×26 / 12)</option>
              <option value="annual">Annual (÷ 12)</option>
            </select>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-500">
          Monthly income: <strong className="text-primary dark:text-accent">{fmt(monthlyIncome)}</strong>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Monthly Income",   value: fmt(monthlyIncome),  color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" },
          { label: "Total Expenses",   value: fmt(totalExpenses),  color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300" },
          { label: remaining >= 0 ? "Surplus" : "Deficit", value: fmt(Math.abs(remaining)), color: remaining >= 0 ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300" },
          { label: "Savings Rate",     value: `${savingsRate.toFixed(1)}%`, color: savingsRate >= 20 ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300" },
        ].map(c => (
          <div key={c.label} className={`border-2 rounded-xl p-4 ${c.color}`}>
            <p className="text-xs font-semibold opacity-70">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b dark:border-gray-700">
        {[
          { id: "budget",    label: "Budget" },
          { id: "charts",    label: "Charts" },
          { id: "analysis",  label: "50/30/20 Analysis" },
          { id: "emergency", label: "Emergency Fund" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition -mb-px ${tab === t.id ? "border-primary text-primary dark:text-accent dark:border-accent" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Budget Tab */}
      {tab === "budget" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Monthly ($)</th>
                  <th className="px-4 py-3 text-right font-semibold">% of Income</th>
                  <th className="px-4 py-3 text-right font-semibold">Annual</th>
                  <th className="px-4 py-3 text-center font-semibold">Visual</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {categories.map(cat => {
                  const amountValue = asNumber(cat.amount);
                  const pct = monthlyIncome > 0 ? (amountValue / monthlyIncome) * 100 : 0;
                  return (
                    <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3">
                        <span className="mr-2">{cat.emoji}</span>
                        <span className="font-medium">{cat.label}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          value={cat.amount}
                          onChange={e => updateAmount(cat.id, e.target.value)}
                          className="w-24 text-right px-2 py-1 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-900 focus:outline-none focus:border-secondary"
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{pct.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{fmt(amountValue * 12)}</td>
                      <td className="px-4 py-3">
                        <div className="w-24 bg-gray-100 dark:bg-gray-700 rounded-full h-2 ml-auto">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: cat.color }} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => removeCategory(cat.id)} className="text-gray-400 hover:text-red-500 text-lg">×</button>
                      </td>
                    </tr>
                  );
                })}

                {/* Add custom category */}
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <td className="px-4 py-3" colSpan={6}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCat}
                        onChange={e => setNewCat(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addCategory()}
                        placeholder="Add custom category..."
                        className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-900 text-sm focus:outline-none focus:border-secondary"
                      />
                      <button onClick={addCategory}
                        className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-secondary transition">
                        + Add
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Total row */}
                <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                  <td className="px-4 py-3">Total Expenses</td>
                  <td className="px-4 py-3 text-right text-red-700 dark:text-red-400">{fmt(totalExpenses)}</td>
                  <td className="px-4 py-3 text-right">{monthlyIncome > 0 ? (totalExpenses/monthlyIncome*100).toFixed(0) : 0}%</td>
                  <td className="px-4 py-3 text-right text-red-700 dark:text-red-400">{fmt(totalExpenses * 12)}</td>
                  <td colSpan={2} />
                </tr>
                <tr className={`font-bold ${remaining >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                  <td className="px-4 py-3">{remaining >= 0 ? "Surplus" : "Deficit"}</td>
                  <td className={`px-4 py-3 text-right ${remaining >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>{fmt(remaining)}</td>
                  <td className="px-4 py-3 text-right">{Math.abs(savingsRate).toFixed(1)}%</td>
                  <td className={`px-4 py-3 text-right ${remaining >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>{fmt(remaining * 12)}</td>
                  <td colSpan={2} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {tab === "charts" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg text-primary dark:text-accent mb-4">Spending Breakdown</h3>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
                  tooltip: { callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)} (${monthlyIncome > 0 ? (ctx.raw / monthlyIncome * 100).toFixed(1) : 0}%)` } },
                },
                cutout: "60%",
              }}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg text-primary dark:text-accent mb-4">Top Expenses Ranked</h3>
            <Bar
              data={{
                    labels: [...categories].sort((a,b) => asNumber(b.amount) - asNumber(a.amount)).slice(0,8).map(c => c.label),
                datasets: [{
                        data: [...categories].sort((a,b) => asNumber(b.amount) - asNumber(a.amount)).slice(0,8).map(c => asNumber(c.amount)),
                  backgroundColor: [...categories].sort((a,b) => b.amount - a.amount).slice(0,8).map(c => c.color),
                  borderRadius: 6,
                }]
              }}
              options={{
                responsive: true,
                indexAxis: "y",
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => fmt(ctx.raw) } } },
                scales: { x: { ticks: { callback: v => fmt(v) } } },
              }}
            />
          </div>

          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg text-primary dark:text-accent mb-2">Annual Cost Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {[
                { label: "Annual Income",  value: fmt(monthlyIncome * 12) },
                { label: "Annual Expenses",value: fmt(totalExpenses * 12) },
                { label: "Annual Savings", value: fmt(remaining * 12) },
                { label: "Savings Rate",   value: `${savingsRate.toFixed(1)}%` },
              ].map(item => (
                <div key={item.label} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-xl font-bold text-primary dark:text-accent">{item.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 50/30/20 Analysis Tab */}
      {tab === "analysis" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg text-primary dark:text-accent mb-1">50/30/20 Rule Analysis</h3>
            <p className="text-sm text-gray-500 mb-6">50% Needs · 30% Wants · 20% Savings & Debt</p>
            <Bar
              data={ruleData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}%` } } },
                scales: { y: { max: 100, ticks: { callback: v => `${v}%` } } },
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Needs",            your: needsPct, target: 50, amount: needs,       color: "blue",  desc: "Housing, food, transport, utilities, healthcare" },
              { label: "Wants",            your: wantsPct, target: 30, amount: wants,       color: "yellow", desc: "Entertainment, dining out, subscriptions, personal" },
              { label: "Savings & Debt",   your: savesPct, target: 20, amount: savingsDebt, color: "green",  desc: "RRSP, TFSA, FHSA contributions + debt payments" },
            ].map(r => {
              const over = parseFloat(r.your) > r.target;
              return (
                <div key={r.label} className={`rounded-2xl p-5 border-2 ${over ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20" : "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{r.label}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${over ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {over ? "Over" : "On Track"}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-primary dark:text-accent">{r.your}%</div>
                  <div className="text-sm text-gray-500">Target: {r.target}% · {fmt(r.amount)}/mo</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                    <div className={`h-2 rounded-full ${over ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${Math.min(100, parseFloat(r.your) / r.target * 100)}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{r.desc}</p>
                  {over && (
                    <p className="text-xs text-red-700 dark:text-red-400 mt-2 font-semibold">
                      Over by {fmt((parseFloat(r.your) - r.target) / 100 * monthlyIncome)}/mo — consider reducing
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Your Ideal Budget at {fmt(monthlyIncome)}/mo</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {[
                { label: "Needs (50%)",          value: fmt(monthlyIncome * 0.50) },
                { label: "Wants (30%)",           value: fmt(monthlyIncome * 0.30) },
                { label: "Savings/Debt (20%)",    value: fmt(monthlyIncome * 0.20) },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="font-bold text-lg text-blue-800 dark:text-blue-200">{item.value}</div>
                  <div className="text-blue-600 dark:text-blue-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Fund Tab */}
      {tab === "emergency" && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg text-primary dark:text-accent mb-4">Emergency Fund Calculator</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Based on your monthly expenses of <strong>{fmt(totalExpenses)}</strong>, here's how much you need:
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Starter Emergency Fund",  months: 1, amount: totalExpenses, desc: "Minimum buffer to start — covers one month of emergencies" },
                { label: "3-Month Emergency Fund",  months: 3, amount: emergencyFund3mo, desc: "Standard recommendation for employed Canadians" },
                { label: "6-Month Emergency Fund",  months: 6, amount: emergencyFund6mo, desc: "Ideal for self-employed or single-income households" },
              ].map(tier => (
                <div key={tier.label} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center">
                  <div className="text-3xl font-bold text-primary dark:text-accent">{fmt(tier.amount)}</div>
                  <div className="font-semibold mt-1">{tier.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{tier.months} month{tier.months > 1 ? "s" : ""} of expenses</div>
                  <p className="text-xs text-gray-500 mt-2">{tier.desc}</p>
                  {remaining > 0 && (
                    <div className="mt-3 text-xs text-green-700 dark:text-green-400">
                      At your savings rate: {Math.ceil(tier.amount / remaining)} months to build
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
            <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">Where to Keep Your Emergency Fund</h4>
            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
              <li>✅ <strong>TFSA HISA</strong> — best option: tax-free interest, fully liquid, no tax on withdrawal</li>
              <li>✅ <strong>High-Interest Savings Account (HISA)</strong> — 3–4% rates available from EQ Bank, Oaken</li>
              <li>✅ <strong>Cashable GIC</strong> — slightly higher rate, accessible after 30 days</li>
              <li>❌ <strong>Chequing account</strong> — avoid; earns near 0% interest</li>
              <li>❌ <strong>Stock market</strong> — avoid; value can drop 30–50% exactly when you need it</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h4 className="font-bold text-primary dark:text-accent mb-4">Savings Goal Tracker</h4>
            <div className="space-y-4">
              {remaining > 0 ? (
                [
                  { label: "1-month fund",  target: totalExpenses },
                  { label: "3-month fund",  target: emergencyFund3mo },
                  { label: "6-month fund",  target: emergencyFund6mo },
                  { label: "Annual TFSA",   target: 7000 },
                  { label: "Annual RRSP",   target: Math.min(monthlyIncome * 12 * 0.18, 32490) },
                ].map(goal => {
                  const monthsToReach = Math.ceil(goal.target / remaining);
                  return (
                    <div key={goal.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{goal.label}</span>
                        <span className="text-gray-500">{fmt(goal.target)} · {monthsToReach} months at {fmt(remaining)}/mo savings</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                        <div className="h-3 bg-green-500 rounded-full" style={{ width: "10%" }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-red-600 dark:text-red-400 font-semibold text-sm">
                  You're currently spending more than you earn. Reduce expenses to start saving toward your emergency fund.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <FAQ items={FAQS} />
      </div>
    </div>
  );
}
