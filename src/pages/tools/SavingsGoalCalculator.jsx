import React, { useState, useMemo } from "react";
import SEO from "../../components/SEO";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const fmt = (n) => n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

const GOAL_PRESETS = [
  { label: "🏖️ Vacation", amount: 5000 },
  { label: "🚗 Car", amount: 25000 },
  { label: "🏠 Down Payment", amount: 80000 },
  { label: "🎓 Education", amount: 40000 },
  { label: "🔥 FIRE Fund", amount: 1000000 },
];

export default function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [years, setYears] = useState(5);

  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;

  // FV of current savings: PV*(1+r)^n
  const currentGrowth = currentSavings * Math.pow(1 + monthlyRate, months);
  const remaining = Math.max(0, goalAmount - currentGrowth);

  // PMT needed: remaining = PMT * [(1+r)^n - 1] / r
  let monthlyContribution = 0;
  if (remaining > 0 && months > 0) {
    if (monthlyRate === 0) {
      monthlyContribution = remaining / months;
    } else {
      monthlyContribution = (remaining * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    }
  }

  const totalContributions = currentSavings + monthlyContribution * months;
  const totalInterest = goalAmount - totalContributions;
  const alreadyThere = currentGrowth >= goalAmount;

  // Build year-by-year chart
  const chartData = useMemo(() => {
    const labels = ["Now"];
    const balances = [currentSavings];
    const contributions = [currentSavings];

    let balance = currentSavings;
    let totalContrib = currentSavings;

    for (let m = 1; m <= months; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalContrib += monthlyContribution;
      if (m % 12 === 0 || m === months) {
        const yr = Math.ceil(m / 12);
        labels.push(`Yr ${yr}`);
        balances.push(Math.round(balance));
        contributions.push(Math.round(totalContrib));
      }
    }

    return { labels, balances, contributions };
  }, [goalAmount, currentSavings, annualReturn, years]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title="Savings Goal Calculator Canada — How Much to Save Per Month"
        description="Find out exactly how much you need to save each month to reach your financial goal. Free Canadian savings calculator — works for vacation, home, car, or retirement."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🎯 Savings Goal Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Set your goal, enter your timeline — see exactly how much to save each month to get there.
        </p>
      </div>

      {/* Goal Presets */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-500 mb-2">Quick Presets:</p>
        <div className="flex flex-wrap gap-2">
          {GOAL_PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => setGoalAmount(p.amount)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition ${
                goalAmount === p.amount
                  ? "bg-primary text-white border-primary"
                  : "border-primary text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {p.label} {fmt(p.amount)}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-6 mb-6 space-y-6">

        {/* Goal Amount */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-semibold">Savings Goal</label>
            <span className="text-primary font-bold">{fmt(goalAmount)}</span>
          </div>
          <input type="range" min={1000} max={1000000} step={1000} value={goalAmount}
            onChange={e => setGoalAmount(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$1K</span><span>$1M</span>
          </div>
        </div>

        {/* Current Savings */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-semibold">Current Savings</label>
            <span className="text-primary font-bold">{fmt(currentSavings)}</span>
          </div>
          <input type="range" min={0} max={goalAmount} step={100} value={currentSavings}
            onChange={e => setCurrentSavings(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span><span>{fmt(goalAmount)}</span>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-semibold">Time to Reach Goal</label>
            <span className="text-primary font-bold">{years} year{years !== 1 ? "s" : ""}</span>
          </div>
          <input type="range" min={1} max={30} step={1} value={years}
            onChange={e => setYears(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 year</span><span>30 years</span>
          </div>
        </div>

        {/* Annual Return */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-semibold">Expected Annual Return</label>
            <span className="text-primary font-bold">{annualReturn.toFixed(1)}%</span>
          </div>
          <input type="range" min={0} max={12} step={0.1} value={annualReturn}
            onChange={e => setAnnualReturn(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0% (HISA/GIC)</span><span>12% (equity)</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Typical: GIC/HISA ~4% · Balanced ETF ~6% · All-Equity ETF ~8%
          </p>
        </div>
      </div>

      {/* Result Hero */}
      {alreadyThere ? (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 mb-6 text-center">
          <p className="text-green-100 text-sm font-semibold mb-1">Great news! 🎉</p>
          <p className="text-3xl font-bold mb-2">You're already on track!</p>
          <p className="text-green-100 text-sm">
            Your current {fmt(currentSavings)} will grow to {fmt(Math.round(currentGrowth))} in {years} years at {annualReturn}% — already exceeds your goal of {fmt(goalAmount)}.
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6 mb-6 text-center">
          <p className="text-blue-200 text-sm font-semibold mb-1">You Need to Save</p>
          <p className="text-5xl font-bold mb-2">{fmt(Math.ceil(monthlyContribution))}/mo</p>
          <p className="text-blue-200 text-sm">
            to reach {fmt(goalAmount)} in {years} year{years !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Goal Amount", value: fmt(goalAmount), color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200" },
          { label: "Monthly Savings Needed", value: fmt(Math.ceil(monthlyContribution)), color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200" },
          { label: "Total You'll Contribute", value: fmt(Math.round(totalContributions)), color: "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" },
          { label: "Interest Earned", value: fmt(Math.max(0, Math.round(totalInterest))), color: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200" },
        ].map(c => (
          <div key={c.label} className={`border-2 rounded-xl p-4 ${c.color}`}>
            <p className="text-xs font-semibold opacity-70">{c.label}</p>
            <p className="text-xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-6">
        <h2 className="text-lg font-bold mb-4">📈 Savings Growth Over Time</h2>
        <Line
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: "Total Balance (with returns)",
                data: chartData.balances,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.1)",
                fill: true,
                tension: 0.4,
              },
              {
                label: "Total Contributions",
                data: chartData.contributions,
                borderColor: "#9ca3af",
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
              },
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`
                }
              }
            },
            scales: {
              y: {
                ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` },
              }
            }
          }}
        />
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <span>💡 The gap between the lines = interest earned on your investments</span>
        </div>
      </div>

      {/* Where to Save */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-3">🏦 Where to Keep Your Savings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { icon: "💰", title: "TFSA (Best for most)", desc: "All growth is tax-free. Best for any goal — emergency fund, vacation, home, or retirement.", rate: "Up to ~4% (HISA) or 8%+ (ETFs)" },
            { icon: "🏠", title: "FHSA (First home)", desc: "Tax deductible contributions + tax-free withdrawals for your first home. Max $8K/year.", rate: "$40K lifetime limit" },
            { icon: "📈", title: "RRSP (Long-term)", desc: "Best for retirement. Deduct contributions from income today, pay tax only in retirement.", rate: "Tax refund = instant boost" },
          ].map(a => (
            <div key={a.title} className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
              <div className="text-2xl mb-2">{a.icon}</div>
              <div className="font-bold mb-1">{a.title}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs mb-2">{a.desc}</div>
              <div className="text-xs font-semibold text-primary dark:text-accent">{a.rate}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
