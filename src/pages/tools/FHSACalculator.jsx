import React, { useState, useMemo } from "react";
import SEO from "../../components/SEO";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const ANNUAL_LIMIT = 8000;
const LIFETIME_LIMIT = 40000;

const TAX_RATES = {
  AB: [[0,57375,25],[57375,114750,30.5],[114750,177922,36],[177922,253414,44],[253414,Infinity,48]],
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

function SliderInput({ label, value, min, max, step = 1, onChange, format }) {
  const display = format ? format(value) : value;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-bold text-secondary">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
        className="w-full accent-secondary" />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

const fmt = n => '$' + Math.round(n).toLocaleString();

export default function FHSACalculator() {
  const [birthYear, setBirthYear] = useState(1995);
  const [province, setProvince] = useState("ON");
  const [income, setIncome] = useState(80000);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [yearOpened, setYearOpened] = useState(2023);
  const [monthlyContrib, setMonthlyContrib] = useState(667);
  const [returnRate, setReturnRate] = useState(7);
  const [buyInYears, setBuyInYears] = useState(5);

  const result = useMemo(() => {
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

    return {
      age,
      finalBalance: Math.round(balance),
      totalContributed: Math.round(totalContributed),
      totalGrowth: Math.round(balance - totalContributed),
      totalTaxSaved: Math.round(totalTaxSaved),
      effectiveCost: Math.round(totalContributed - totalTaxSaved),
      marginalRate: Math.round(marginalRate * 100),
      projections,
      hitMax: totalContributed >= LIFETIME_LIMIT,
      remainingRoom: Math.max(0, LIFETIME_LIMIT - Math.min(usedRoom + buyInYears * ANNUAL_LIMIT, LIFETIME_LIMIT)),
    };
  }, [birthYear, province, income, currentBalance, yearOpened, monthlyContrib, returnRate, buyInYears]);

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="FHSA Calculator 2026 — First Home Savings Account Canada"
        description="Calculate your FHSA balance, tax savings, and projected growth for your first home purchase. Free Canadian FHSA calculator with province-specific marginal tax rates for 2026."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🏠 FHSA Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Canada's best account for first-time home buyers — contributions are <strong>tax-deductible</strong> AND withdrawals for your first home are <strong>100% tax-free</strong>. The best of both TFSA and RRSP.
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
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">{f.label}</div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200">{f.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left: sliders */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Your FHSA Details</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Province</label>
            <select value={province} onChange={e => setProvince(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none text-sm">
              {[["AB","Alberta"],["BC","British Columbia"],["MB","Manitoba"],["NB","New Brunswick"],
                ["NL","Newfoundland"],["NS","Nova Scotia"],["NT","NWT"],
                ["NU","Nunavut"],["ON","Ontario"],["PE","PEI"],["QC","Quebec"],
                ["SK","Saskatchewan"],["YT","Yukon"]].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Year FHSA Opened</label>
            <select value={yearOpened} onChange={e => setYearOpened(parseInt(e.target.value))}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none text-sm">
              {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <SliderInput label="Annual Income" value={income} min={30000} max={300000} step={5000}
            onChange={setIncome} format={n => `$${(n/1000).toFixed(0)}k`} />

          <SliderInput label="Monthly Contribution" value={monthlyContrib} min={100} max={667} step={50}
            onChange={setMonthlyContrib} format={v => `$${v}/mo`} />

          <SliderInput label="Current FHSA Balance" value={currentBalance} min={0} max={40000} step={500}
            onChange={setCurrentBalance} format={fmt} />

          <SliderInput label="Expected Annual Return" value={returnRate} min={1} max={12} step={0.5}
            onChange={setReturnRate} format={v => `${v}%`} />

          <SliderInput label="Years Until Home Purchase" value={buyInYears} min={1} max={15} step={1}
            onChange={setBuyInYears} format={v => `${v} yr${v !== 1 ? 's' : ''}`} />

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
            <p className="font-semibold text-amber-800 dark:text-amber-200">Your marginal tax rate: {result.marginalRate}%</p>
            <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
              Every $8,000 you contribute returns <strong>${Math.round(8000 * result.marginalRate / 100).toLocaleString()}</strong> as a tax refund.
            </p>
          </div>
        </div>

        {/* Right: results */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Your Results</h2>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">FHSA Balance at Purchase</p>
            <p className="text-4xl font-black text-green-700 dark:text-green-300">{fmt(result.finalBalance)}</p>
            {result.hitMax && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">🎉 Lifetime max reached!</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Contributed", value: fmt(result.totalContributed), color: "text-blue-600 dark:text-blue-400" },
              { label: "Tax-Free Growth", value: fmt(result.totalGrowth), color: "text-yellow-600 dark:text-yellow-400" },
              { label: "Total Tax Refunds", value: fmt(result.totalTaxSaved), color: "text-purple-600 dark:text-purple-400" },
              { label: "Your Effective Cost", value: fmt(result.effectiveCost), color: "text-gray-700 dark:text-gray-300" },
            ].map(card => (
              <div key={card.label} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
                <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-bold mb-3">FHSA Growth Over {buyInYears} Years</p>
            <Line data={{
              labels: result.projections.map(p => `Yr ${p.year}`),
              datasets: [{
                label: "Balance",
                data: result.projections.map(p => p.value),
                fill: true,
                backgroundColor: "rgba(34,197,94,0.1)",
                borderColor: "#22c55e",
                tension: 0.4,
                pointRadius: 3,
              }]
            }} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } } }
            }} />
          </div>
        </div>
      </div>

      {/* FHSA Benefits Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-3">💡 Why FHSA Wins</h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <li>✅ Every $1 contributed saves <strong className="text-green-600">{result.marginalRate}¢ in tax</strong> (at your marginal rate)</li>
          <li>✅ All growth inside is <strong>completely tax-free</strong></li>
          <li>✅ Withdrawal to buy your first home: <strong>$0 tax</strong></li>
          <li>✅ Effective out-of-pocket cost: only <strong className="text-blue-600">{fmt(result.effectiveCost)}</strong> to grow <strong>{fmt(result.finalBalance)}</strong> toward your home</li>
          <li>✅ If you don't buy: unused FHSA transfers to RRSP with <strong>no tax hit</strong></li>
          {result.hitMax && <li>🎉 You'll <strong>max out the $40,000 lifetime limit</strong> — excellent!</li>}
        </ul>
      </div>

      {/* FHSA vs RRSP HBP */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700 mb-8">
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
                ["Annual contribution limit","$8,000/yr","No separate limit"],
                ["Carryforward unused room","✅ Yes (1 yr)","N/A"],
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
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
          <strong className="text-blue-800 dark:text-blue-200">Pro tip:</strong>
          <span className="text-blue-700 dark:text-blue-300"> Use <strong>both</strong> — max your FHSA first (no repayment), then use RRSP HBP for an extra $35,000. That's up to <strong>$75,000 tax-advantaged</strong> toward your first home!</span>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Frequently Asked Questions</h2>
        {[
          {
            q: "Who is eligible for the FHSA?",
            a: "You must be a Canadian resident, at least 18 years old, and a first-time home buyer (meaning you haven't owned a qualifying home that you lived in at any time during the preceding four calendar years, or since January 1 of the year you open the account). You can hold an FHSA until December 31 of the year you turn 71 or the 15th anniversary of opening it, whichever comes first."
          },
          {
            q: "Can I carry forward unused FHSA contribution room?",
            a: "Yes — you can carry forward up to $8,000 of unused annual contribution room to the following year only. So if you contribute $5,000 in 2024, you can contribute up to $11,000 in 2025 ($8,000 new room + $3,000 carryforward). However, you cannot accumulate multiple years of carryforward — only the immediately preceding year's unused amount qualifies."
          },
          {
            q: "What happens if I never buy a home?",
            a: "No problem. You can transfer your entire FHSA balance to your RRSP or RRIF at any time without using up your RRSP contribution room, and without any immediate tax consequences. The growth in the FHSA during that time was still tax-sheltered, and you got the upfront deductions — so you win either way."
          },
          {
            q: "Can both spouses open an FHSA?",
            a: "Yes! If both partners qualify as first-time buyers, each can open their own FHSA and contribute up to $8,000/year each, for a combined $16,000/year and $80,000 lifetime. Combined with RRSP HBP ($35,000 × 2), a couple could access up to $150,000 in tax-advantaged funds toward their first home."
          },
          {
            q: "What investments can I hold inside an FHSA?",
            a: "The same investments you can hold in a TFSA or RRSP: stocks, ETFs, mutual funds, GICs, bonds, savings accounts. Most major Canadian banks and brokerages (Questrade, Wealthsimple, TD Direct, etc.) offer self-directed FHSAs. For maximum growth, low-cost index ETFs like XEQT or VBAL are popular choices."
          },
        ].map((item, i) => (
          <details key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden group">
            <summary className="p-4 cursor-pointer font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-accent list-none flex justify-between items-center">
              {item.q}
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
