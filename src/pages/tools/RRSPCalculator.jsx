import React, { useState } from "react";
import SEO from "../../components/SEO";
import AdSlot from "../../components/AdSlot";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, CategoryScale,
  LinearScale, Tooltip, Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TAX_BRACKETS = [
  { min: 0, max: 57375, rate: 0.205 },
  { min: 57375, max: 114750, rate: 0.26 },
  { min: 114750, max: 158519, rate: 0.29 },
  { min: 158519, max: Infinity, rate: 0.33 },
];

function getMarginalRate(income) {
  for (const b of TAX_BRACKETS) {
    if (income >= b.min && income < b.max) return b.rate;
  }
  return 0.33;
}

export default function RRSPCalculator() {
  const [income, setIncome] = useState(85000);
  const [contribution, setContribution] = useState(10000);
  const [currentBalance, setCurrentBalance] = useState(25000);
  const [returnRate, setReturnRate] = useState(7);
  const [years, setYears] = useState(25);
  const [result, setResult] = useState(null);

  const CONTRIBUTION_LIMIT_2026 = Math.min(income * 0.18, 32490);

  const calculate = () => {
    const marginalRate = getMarginalRate(income);
    const taxRefund = contribution * marginalRate;
    const r = returnRate / 100 / 12;
    const n = years * 12;

    let balance = currentBalance;
    let projections = [];
    const monthlyContrib = contribution / 12;

    for (let i = 1; i <= years; i++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + r) + monthlyContrib;
      }
      projections.push({ year: i, value: Math.round(balance) });
    }

    const totalContributed = currentBalance + contribution * years;
    const totalGrowth = balance - totalContributed;
    const totalTaxRefunds = taxRefund * years;

    setResult({
      marginalRate: (marginalRate * 100).toFixed(0),
      taxRefund: Math.round(taxRefund),
      totalTaxRefunds: Math.round(totalTaxRefunds),
      finalValue: Math.round(balance),
      totalContributed: Math.round(totalContributed),
      totalGrowth: Math.round(totalGrowth),
      projections,
      maxContribution: Math.round(CONTRIBUTION_LIMIT_2026),
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO title="RRSP Calculator 2026 — Tax Refund & Retirement Growth" description="Calculate your RRSP tax refund and retirement savings growth. Real Canadian tax brackets. Free, no signup required." />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🇨🇦 RRSP Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Calculate your RRSP tax savings and retirement growth. Contributions reduce your taxable income today!
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-8">
        <p className="text-sm text-green-800 dark:text-green-300">
          💡 <strong>2026 RRSP Limit:</strong> 18% of income up to <strong>$32,490</strong> &nbsp;|&nbsp;
          Deadline: <strong>March 2, 2026</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold mb-1">Annual Income ($)</label>
          <input type="number" value={income}
            onChange={e => setIncome(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your 2026 max contribution: <strong>${Math.round(Math.min(income * 0.18, 32490)).toLocaleString()}</strong>
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Annual RRSP Contribution ($)</label>
          <input type="number" value={contribution}
            onChange={e => setContribution(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Current RRSP Balance ($)</label>
          <input type="number" value={currentBalance}
            onChange={e => setCurrentBalance(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Expected Annual Return (%)</label>
          <input type="number" value={returnRate}
            onChange={e => setReturnRate(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Years Until Retirement</label>
          <input type="number" value={years}
            onChange={e => setYears(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
        </div>
      </div>

      <button onClick={calculate}
        className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold hover:bg-secondary transition-colors">
        Calculate My RRSP Savings 🚀
      </button>

      {result && (
        <div className="mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "This Year's Tax Refund", value: `$${result.taxRefund.toLocaleString()}`, color: "bg-green-50 border-green-200 text-green-800" },
              { label: "Marginal Tax Rate", value: `${result.marginalRate}%`, color: "bg-blue-50 border-blue-200 text-blue-800" },
              { label: "Final RRSP Value", value: `$${result.finalValue.toLocaleString()}`, color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
              { label: "Lifetime Tax Refunds", value: `$${result.totalTaxRefunds.toLocaleString()}`, color: "bg-purple-50 border-purple-200 text-purple-800" },
            ].map(card => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-4">📊 RRSP Growth Projection</h2>
            <Bar data={{
              labels: result.projections.filter((_, i) => i % 5 === 4 || i === 0).map(p => `Year ${p.year}`),
              datasets: [{
                label: "RRSP Balance",
                data: result.projections.filter((_, i) => i % 5 === 4 || i === 0).map(p => p.value),
                backgroundColor: "#003366",
                borderRadius: 6,
              }]
            }} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } }
              }
            }} />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-2 text-amber-800 dark:text-amber-300">💡 Smart Tip</h2>
            <p className="text-amber-700 dark:text-amber-400 text-sm">
              You'll get a <strong>${result.taxRefund.toLocaleString()}</strong> tax refund this year.
              If you reinvest that refund back into your RRSP, you could supercharge your retirement savings even further!
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
