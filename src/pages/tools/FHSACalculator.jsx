import React, { useState } from "react";
import SEO from "../../components/SEO";
import AdSlot from "../../components/AdSlot";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const ANNUAL_LIMIT = 8000;
const LIFETIME_LIMIT = 40000;

const TAX_RATES = {
  AB: [[0,53359,25],[53359,106717,30.5],[106717,165430,36],[165430,235675,44],[235675,Infinity,48]],
  BC: [[0,45654,20.06],[45654,91310,28.7],[91310,104835,31.0],[104835,127299,38.7],[127299,172602,43.7],[172602,240716,46.2],[240716,Infinity,53.5]],
  ON: [[0,51446,20.05],[51446,102894,29.65],[102894,150000,33.89],[150000,220000,43.41],[220000,Infinity,53.53]],
  QC: [[0,51780,27.53],[51780,103545,37.12],[103545,126000,45.71],[126000,Infinity,53.31]],
  MB: [[0,36842,25.8],[36842,79625,37.9],[79625,Infinity,50.4]],
  SK: [[0,49720,25],[49720,142058,33],[142058,Infinity,47]],
  NS: [[0,29590,23.79],[29590,59180,37.17],[59180,93000,43.5],[93000,150000,50.0],[150000,Infinity,54.0]],
  NB: [[0,47715,27.16],[47715,95431,37.52],[95431,176756,46.84],[176756,Infinity,53.3]],
  NL: [[0,43198,23.7],[43198,86395,33.95],[86395,154244,44.5],[154244,Infinity,51.3]],
  PE: [[0,32656,24.8],[32656,64313,37.3],[64313,105000,42.0],[105000,Infinity,47.37]],
  NT: [[0,50597,20.9],[50597,101198,30.6],[101198,164525,39],[164525,Infinity,47]],
  NU: [[0,53268,19],[53268,106537,28],[106537,173205,35],[173205,Infinity,45]],
  YT: [[0,55867,21.4],[55867,111733,29.5],[111733,154906,36.9],[154906,500000,42.0],[500000,Infinity,48]],
};

function getMarginalRate(province, income) {
  const brackets = TAX_RATES[province] || TAX_RATES.ON;
  for (const [low, high, rate] of brackets) {
    if (income >= low && income < high) return rate / 100;
  }
  return 0.43;
}

export default function FHSACalculator() {
  const [birthYear, setBirthYear] = useState(1995);
  const [province, setProvince] = useState("ON");
  const [income, setIncome] = useState(80000);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [yearOpened, setYearOpened] = useState(2023);
  const [monthlyContrib, setMonthlyContrib] = useState(667);
  const [returnRate, setReturnRate] = useState(7);
  const [buyInYears, setBuyInYears] = useState(5);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const age = 2026 - birthYear;
    const yearsSinceOpen = 2026 - yearOpened;
    const usedRoom = Math.min(yearsSinceOpen * ANNUAL_LIMIT, LIFETIME_LIMIT);

    const r = returnRate / 100 / 12;
    let balance = currentBalance;
    let totalContributed = currentBalance;
    let totalTaxSaved = 0;
    const projections = [];
    const marginalRate = getMarginalRate(province, income);

    for (let yr = 1; yr <= buyInYears; yr++) {
      const annualContrib = Math.min(monthlyContrib * 12, ANNUAL_LIMIT);
      const lifetimeUsed = usedRoom + (yr - 1) * ANNUAL_LIMIT;
      const canContrib = Math.max(0, Math.min(annualContrib, LIFETIME_LIMIT - lifetimeUsed));

      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + r) + canContrib / 12;
      }

      totalContributed += canContrib;
      totalTaxSaved += canContrib * marginalRate;
      projections.push({ year: yr, value: Math.round(balance) });
    }

    const totalGrowth = balance - totalContributed;
    const effectiveCost = totalContributed - totalTaxSaved;

    setResult({
      age,
      finalBalance: Math.round(balance),
      totalContributed: Math.round(totalContributed),
      totalGrowth: Math.round(totalGrowth),
      totalTaxSaved: Math.round(totalTaxSaved),
      effectiveCost: Math.round(effectiveCost),
      marginalRate: Math.round(marginalRate * 100),
      projections,
      hitMax: totalContributed >= LIFETIME_LIMIT,
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="FHSA Calculator 2026 — Free Canadian First Home Savings Account Tool"
        description="Calculate your FHSA contribution room, tax savings, and projected balance for your first home purchase. Free Canadian FHSA calculator updated for 2026."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🏠 FHSA Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Canada's newest savings account — contributions are <strong>tax-deductible</strong> AND
          withdrawals for your first home are <strong>100% tax-free</strong>. The best of both TFSA and RRSP.
        </p>
      </div>

      {/* Key facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: "📅", label: "Annual Limit", value: "$8,000/yr" },
          { icon: "🏦", label: "Lifetime Limit", value: "$40,000" },
          { icon: "💸", label: "Tax Benefit", value: "Deductible + Tax-Free" },
        ].map(f => (
          <div key={f.label} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{f.icon}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{f.label}</div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold mb-1">Your Birth Year</label>
          <input type="number" value={birthYear}
            onChange={e => setBirthYear(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Must be 18+ and a first-time home buyer</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Province</label>
          <select value={province} onChange={e => setProvince(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
            {[["AB","Alberta"],["BC","British Columbia"],["MB","Manitoba"],["NB","New Brunswick"],
              ["NL","Newfoundland"],["NS","Nova Scotia"],["NT","Northwest Territories"],
              ["NU","Nunavut"],["ON","Ontario"],["PE","PEI"],["QC","Quebec"],
              ["SK","Saskatchewan"],["YT","Yukon"]].map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Annual Income ($)</label>
          <input type="number" value={income}
            onChange={e => setIncome(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Used to calculate your tax refund</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Year You Opened FHSA</label>
          <select value={yearOpened} onChange={e => setYearOpened(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Current FHSA Balance ($)</label>
          <input type="number" value={currentBalance}
            onChange={e => setCurrentBalance(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Monthly Contribution ($)</label>
          <input type="number" value={monthlyContrib}
            onChange={e => setMonthlyContrib(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Max $8,000/yr ($667/mo)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Expected Annual Return (%)</label>
          <input type="number" value={returnRate}
            onChange={e => setReturnRate(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Years Until Home Purchase</label>
          <input type="number" value={buyInYears} min={1} max={15}
            onChange={e => setBuyInYears(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">FHSA must be used within 15 years of opening</p>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold hover:bg-secondary transition-colors">
        Calculate My FHSA 🏠
      </button>

      {result && (
        <div className="mt-10">

          {/* Result cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "FHSA at Purchase", value: `$${result.finalBalance.toLocaleString()}`, color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" },
              { label: "Total Contributed", value: `$${result.totalContributed.toLocaleString()}`, color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300" },
              { label: "Investment Growth", value: `$${result.totalGrowth.toLocaleString()}`, color: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300" },
              { label: "Tax Refunds Earned", value: `$${result.totalTaxSaved.toLocaleString()}`, color: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300" },
              { label: "Your Marginal Rate", value: `${result.marginalRate}%`, color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" },
              { label: "Your Effective Cost", value: `$${result.effectiveCost.toLocaleString()}`, color: "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" },
            ].map(card => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-4">📈 FHSA Balance Over {buyInYears} Years</h2>
            <Line data={{
              labels: result.projections.map(p => `Year ${p.year}`),
              datasets: [{
                label: "FHSA Balance",
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
                y: { ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` } }
              }
            }} />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-3">💡 How Your FHSA Stacks Up</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <li>✅ Every $1 contributed gives you a <strong className="text-green-600">{result.marginalRate}¢ tax refund</strong> (at your marginal rate)</li>
              <li>✅ All growth inside the FHSA is <strong>completely tax-free</strong></li>
              <li>✅ When you withdraw to buy your home, you pay <strong>$0 in tax</strong></li>
              <li>✅ Your effective out-of-pocket cost is only <strong className="text-blue-600">${result.effectiveCost.toLocaleString()}</strong> to get <strong>${result.finalBalance.toLocaleString()}</strong> toward your home</li>
              {result.hitMax && (
                <li>🎉 You'll <strong>hit the $40,000 lifetime max</strong> — great job maxing it out!</li>
              )}
            </ul>
          </div>

          {/* FHSA vs RRSP HBP table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">⚖️ FHSA vs RRSP Home Buyers' Plan</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-600">
                    <th className="text-left py-2 pr-4 font-semibold">Feature</th>
                    <th className="text-left py-2 pr-4 font-semibold text-blue-600">FHSA ✅</th>
                    <th className="text-left py-2 font-semibold text-gray-500">RRSP HBP</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  {[
                    ["Max amount","$40,000","$35,000"],
                    ["Tax deduction","✅ Yes","✅ Yes"],
                    ["Repayment required","❌ No","⚠️ Yes (15 yrs)"],
                    ["Withdrawal tax-free","✅ Yes","✅ Yes (if repaid)"],
                    ["Unused funds","Transfer to RRSP","Stays in RRSP"],
                    ["Annual limit","$8,000","No separate limit"],
                  ].map(([feat, fhsa, rrsp]) => (
                    <tr key={feat} className="border-b dark:border-gray-700">
                      <td className="py-2 pr-4 font-medium">{feat}</td>
                      <td className="py-2 pr-4 text-blue-600 font-semibold">{fhsa}</td>
                      <td className="py-2 text-gray-500">{rrsp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              💡 <strong>Pro tip:</strong> Use <strong>both</strong> — FHSA first (no repayment needed), then RRSP HBP for an extra $35,000. That's up to <strong>$75,000 tax-advantaged</strong> toward your first home!
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
