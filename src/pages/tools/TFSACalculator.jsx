import React, { useState } from "react";
import SEO from "../../components/SEO";
import AdSlot from "../../components/AdSlot";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const TFSA_LIMITS = {
  2009:5000,2010:5000,2011:5000,2012:5000,2013:5500,2014:5500,
  2015:10000,2016:5500,2017:5500,2018:5500,2019:6000,2020:6000,
  2021:6000,2022:6000,2023:6500,2024:7000,2025:7000,2026:7000
};
const TOTAL_ROOM = Object.values(TFSA_LIMITS).reduce((a,b) => a+b, 0);

export default function TFSACalculator() {
  const [birthYear, setBirthYear] = useState(1990);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlyContrib, setMonthlyContrib] = useState(500);
  const [returnRate, setReturnRate] = useState(7);
  const [years, setYears] = useState(20);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const age = 2026 - birthYear;
    const eligibleSince = Math.max(2009, birthYear + 18);
    const yearsEligible = 2026 - eligibleSince;
    let contributionRoom = 0;
    for (let y = eligibleSince; y <= 2026; y++) {
      contributionRoom += TFSA_LIMITS[y] || 7000;
    }

    const r = returnRate / 100 / 12;
    const n = years * 12;
    let projections = [];
    let balance = currentSavings;

    for (let i = 1; i <= years; i++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + r) + monthlyContrib;
      }
      projections.push({ year: i, value: Math.round(balance) });
    }

    const totalContributed = currentSavings + monthlyContrib * 12 * years;
    const totalGrowth = balance - totalContributed;

    setResult({
      age,
      contributionRoom,
      yearsEligible,
      projections,
      finalValue: Math.round(balance),
      totalContributed: Math.round(totalContributed),
      totalGrowth: Math.round(totalGrowth),
      taxSaved: Math.round(totalGrowth * 0.33),
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO title="TFSA Calculator 2026 — Free Canadian Tool" description="Calculate your TFSA contribution room and tax-free growth. Free Canadian calculator updated for 2026 limits. No signup required." />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🇨🇦 TFSA Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          See how much your Tax-Free Savings Account can grow — all gains are 100% tax-free!
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 <strong>2026 TFSA Limit:</strong> $7,000 &nbsp;|&nbsp;
          <strong>Lifetime Room (since 2009):</strong> ${TOTAL_ROOM.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold mb-1">Your Birth Year</label>
          <input type="number" value={birthYear}
            onChange={e => setBirthYear(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Must be 18+ to open a TFSA</p>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Current TFSA Balance ($)</label>
          <input type="number" value={currentSavings}
            onChange={e => setCurrentSavings(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Monthly Contribution ($)</label>
          <input type="number" value={monthlyContrib}
            onChange={e => setMonthlyContrib(parseFloat(e.target.value))}
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
          <label className="block text-sm font-semibold mb-1">Investment Horizon (Years)</label>
          <input type="number" value={years}
            onChange={e => setYears(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
        </div>
      </div>

      <button onClick={calculate}
        className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold hover:bg-secondary transition-colors">
        Calculate My TFSA Growth 🚀
      </button>

      {result && (
        <div className="mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Final TFSA Value", value: `$${result.finalValue.toLocaleString()}`, color: "bg-green-50 border-green-200 text-green-800" },
              { label: "Total Contributed", value: `$${result.totalContributed.toLocaleString()}`, color: "bg-blue-50 border-blue-200 text-blue-800" },
              { label: "Tax-Free Growth", value: `$${result.totalGrowth.toLocaleString()}`, color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
              { label: "Tax Saved (~33%)", value: `$${result.taxSaved.toLocaleString()}`, color: "bg-purple-50 border-purple-200 text-purple-800" },
            ].map(card => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-4">📈 Growth Over {years} Years</h2>
            <Line data={{
              labels: result.projections.map(p => `Year ${p.year}`),
              datasets: [{
                label: "TFSA Balance",
                data: result.projections.map(p => p.value),
                fill: true,
                backgroundColor: "rgba(0,168,232,0.1)",
                borderColor: "#00A8E8",
                tension: 0.4,
              }]
            }} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } }
              }
            }} />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Your TFSA Room</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Based on your birth year ({birthYear}), you've been eligible for a TFSA since <strong>{Math.max(2009, birthYear + 18)}</strong>.
              Your total lifetime contribution room is approximately <strong className="text-green-600">${result.contributionRoom.toLocaleString()}</strong>.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
