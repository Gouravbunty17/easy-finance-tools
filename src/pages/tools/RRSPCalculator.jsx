import React, { useState, useMemo } from "react";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const RRSP_FAQS = [
  { q: "What is the RRSP contribution limit for 2026?", a: "The 2026 RRSP contribution limit is 18% of your 2025 earned income, up to a maximum of $32,490. Any unused room from previous years also carries forward. Check your most recent Notice of Assessment from the CRA for your exact limit." },
  { q: "When is the RRSP contribution deadline for 2026?", a: "The RRSP contribution deadline for the 2025 tax year is March 2, 2026. Contributions made between January 1 and March 2, 2026 can be applied to either your 2025 or 2026 tax return." },
  { q: "How does an RRSP reduce my taxes?", a: "RRSP contributions are deducted from your taxable income. If you contribute $10,000 and your marginal tax rate is 33%, you receive approximately $3,300 back as a tax refund. This makes the RRSP most valuable for higher-income earners." },
  { q: "What is a Spousal RRSP?", a: "A Spousal RRSP lets you contribute to your spouse's RRSP — you get the tax deduction, but the funds belong to your spouse. This is a powerful income-splitting strategy for retirement: if one partner earns significantly more, they contribute to the other's Spousal RRSP so both withdraw at lower tax rates in retirement." },
  { q: "What is a RRIF and when do I need one?", a: "A RRIF (Registered Retirement Income Fund) is the account your RRSP converts to by December 31 of the year you turn 71. The CRA sets a minimum withdrawal percentage each year (starting at ~5.28% at age 71, rising to 20% at 95). You pay income tax on RRIF withdrawals. Planning your RRIF drawdown strategy is critical to minimizing OAS clawbacks." },
  { q: "Can I withdraw from my RRSP early?", a: "Yes, but withdrawals are added to your income and taxed at your marginal rate. Your institution withholds tax at source (10% up to $5,000, 20% for $5,001–$15,000, 30% over $15,000). Early withdrawals permanently destroy that contribution room." },
];

// Combined marginal rates by province
const PROV_RATES = {
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
const PROVINCES = [
  ["AB","Alberta"],["BC","British Columbia"],["MB","Manitoba"],["NB","New Brunswick"],
  ["NL","Newfoundland"],["NS","Nova Scotia"],["NT","Northwest Territories"],
  ["NU","Nunavut"],["ON","Ontario"],["PE","PEI"],["QC","Quebec"],
  ["SK","Saskatchewan"],["YT","Yukon"],
];

// RRIF minimum withdrawal rates (CRA schedule)
const RRIF_MIN = {
  71:5.28,72:5.40,73:5.53,74:5.67,75:5.82,76:5.98,77:6.17,78:6.36,
  79:6.58,80:6.82,81:7.08,82:7.38,83:7.71,84:8.08,85:8.51,86:8.99,
  87:9.55,88:10.21,89:10.99,90:11.92,91:13.06,92:14.49,93:16.34,94:18.79,95:20.00,
};

function getMarginalRate(province, income) {
  const brackets = PROV_RATES[province] || PROV_RATES.ON;
  for (const [low, high, rate] of brackets) {
    if (income >= low && income < high) return rate / 100;
  }
  return 0.43;
}

function fmt(n) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
}

function SliderInput({ label, value, min, max, step, onChange, prefix = "", suffix = "", helpText }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-semibold">{label}</label>
        <span className="text-primary dark:text-accent font-bold text-sm">{prefix}{value.toLocaleString()}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg accent-primary cursor-pointer" />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{prefix}{Number(min).toLocaleString()}{suffix}</span>
        <span>{prefix}{Number(max).toLocaleString()}{suffix}</span>
      </div>
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
}

export default function RRSPCalculator() {
  const [income, setIncome] = useState(85000);
  const [province, setProvince] = useState("ON");
  const [contribution, setContribution] = useState(10000);
  const [currentBalance, setCurrentBalance] = useState(25000);
  const [returnRate, setReturnRate] = useState(7);
  const [years, setYears] = useState(25);
  const [spousal, setSpousal] = useState(false);
  const [spouseIncome, setSpouseIncome] = useState(45000);
  const [reinvestRefund, setReinvestRefund] = useState(true);
  const [retirementAge, setRetirementAge] = useState(65);
  const [retirementIncome, setRetirementIncome] = useState(40000);
  const [showRRIF, setShowRRIF] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const results = useMemo(() => {
    const marginalRate = getMarginalRate(province, income);
    const spouseMarginalRate = getMarginalRate(province, spouseIncome);
    const withdrawRate = getMarginalRate(province, retirementIncome);

    const taxRefund = contribution * marginalRate;
    const extraFromRefund = reinvestRefund ? taxRefund / 12 : 0; // monthly extra if refund reinvested
    const r = returnRate / 100 / 12;
    const monthlyContrib = contribution / 12 + extraFromRefund;

    let balance = currentBalance;
    const projections = [];

    for (let i = 1; i <= years; i++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + r) + monthlyContrib;
      }
      projections.push({ year: i, value: Math.round(balance) });
    }

    const totalContributed = currentBalance + (contribution + (reinvestRefund ? taxRefund : 0)) * years;
    const totalGrowth = balance - totalContributed;
    const totalTaxRefunds = taxRefund * years;

    // Spousal RRSP benefit: both withdraw at lower rate
    const normalWithdrawTax = balance * withdrawRate;
    const spouseWithdrawTax = (balance / 2) * withdrawRate + (balance / 2) * getMarginalRate(province, spouseIncome + retirementIncome / 2);
    const spousalSaving = normalWithdrawTax - spouseWithdrawTax;

    // RRIF drawdown simulation from retirement
    const startAge = retirementAge > 71 ? retirementAge : retirementAge;
    const rrifStart = Math.max(71, startAge);
    const rrifRows = [];
    let rrifBalance = balance;
    for (let age = rrifStart; age <= 95 && rrifBalance > 0; age++) {
      const minPct = (RRIF_MIN[age] || 20) / 100;
      const withdrawal = Math.max(rrifBalance * minPct, 0);
      const tax = withdrawal * withdrawRate;
      rrifBalance = Math.max(0, (rrifBalance - withdrawal) * (1 + returnRate / 100));
      rrifRows.push({ age, withdrawal: Math.round(withdrawal), tax: Math.round(tax), netWithdrawal: Math.round(withdrawal - tax), balance: Math.round(rrifBalance) });
    }

    // Max contribution 2026
    const maxContrib = Math.min(income * 0.18, 32490);

    return {
      marginalRate: Math.round(marginalRate * 100),
      spouseMarginalRate: Math.round(spouseMarginalRate * 100),
      taxRefund: Math.round(taxRefund),
      totalTaxRefunds: Math.round(totalTaxRefunds),
      finalValue: Math.round(balance),
      totalContributed: Math.round(totalContributed),
      totalGrowth: Math.round(totalGrowth),
      projections,
      maxContrib: Math.round(maxContrib),
      spousalSaving: Math.round(spousalSaving),
      rrifRows,
      withdrawRate: Math.round(withdrawRate * 100),
    };
  }, [income, province, contribution, currentBalance, returnRate, years, spousal, spouseIncome, reinvestRefund, retirementAge, retirementIncome]);

  const isOverContrib = contribution > results.maxContrib;

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="RRSP Calculator 2026 — Tax Refund, Spousal RRSP & RRIF Simulator"
        description="Calculate your RRSP tax refund, retirement savings growth, spousal RRSP income splitting benefit, and RRIF drawdown. Free Canadian calculator updated for 2026."
        canonical="https://easyfinancetools.com/tools/rrsp-calculator"
      />

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">RRSP Calculator 2026</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Calculate your tax refund, retirement growth, spousal RRSP benefit, and RRIF drawdown. Results update live.
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-green-800 dark:text-green-300">
          💡 <strong>2026 RRSP Limit:</strong> 18% of 2025 income up to <strong>$32,490</strong> &nbsp;|&nbsp;
          <strong>Your limit:</strong> {fmt(results.maxContrib)} &nbsp;|&nbsp;
          <strong>Deadline:</strong> March 2, 2026
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h2 className="font-bold text-primary dark:text-accent mb-1">Province</h2>
            <select value={province} onChange={e => setProvince(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none mt-2">
              {PROVINCES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-2">Province determines your exact marginal tax rate for the refund calculation.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-5">
            <h2 className="font-bold text-primary dark:text-accent">Growth Inputs</h2>

            <SliderInput label="Annual Income" value={income} min={30000} max={300000} step={1000}
              onChange={setIncome} prefix="$"
              helpText={`Marginal rate: ${results.marginalRate}% · Max RRSP: ${fmt(results.maxContrib)}`} />

            <SliderInput label="Annual RRSP Contribution" value={contribution} min={0} max={32490} step={500}
              onChange={setContribution} prefix="$"
              helpText={isOverContrib ? `⚠️ Over your ${fmt(results.maxContrib)} limit — check CRA for your carryforward room` : `Tax refund this year: ${fmt(results.taxRefund)}`} />

            <SliderInput label="Current RRSP Balance" value={currentBalance} min={0} max={500000} step={5000}
              onChange={setCurrentBalance} prefix="$" />

            <SliderInput label="Expected Annual Return" value={returnRate} min={1} max={12} step={0.5}
              onChange={setReturnRate} suffix="%" />

            <SliderInput label="Years Until Retirement" value={years} min={1} max={40} step={1}
              onChange={setYears} suffix=" years"
              helpText={`Retirement age: ~${2026 - 1980 + years > 0 ? years + (2026 - income / 1000 | 0) : years + 40} · Balance at retirement: ${fmt(results.finalValue)}`} />
          </div>

          {/* Options */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-4">
            <h2 className="font-bold text-primary dark:text-accent">Strategy Options</h2>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="reinvest" checked={reinvestRefund} onChange={e => setReinvestRefund(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-primary" />
              <label htmlFor="reinvest" className="text-sm cursor-pointer">
                <span className="font-semibold">Reinvest tax refund ({fmt(results.taxRefund)}) into RRSP</span>
                <p className="text-gray-500 text-xs mt-0.5">Adds the refund back monthly — a powerful compounding loop</p>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="spousal" checked={spousal} onChange={e => setSpousal(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-primary" />
              <label htmlFor="spousal" className="text-sm cursor-pointer">
                <span className="font-semibold">Spousal RRSP income splitting</span>
                <p className="text-gray-500 text-xs mt-0.5">Estimate the retirement tax savings from contributing to your spouse's RRSP</p>
              </label>
            </div>

            {spousal && (
              <div className="pl-8">
                <SliderInput label="Spouse's Retirement Income" value={spouseIncome} min={0} max={150000} step={1000}
                  onChange={setSpouseIncome} prefix="$"
                  helpText={`Spouse marginal rate: ${results.spouseMarginalRate}%`} />
              </div>
            )}
          </div>

          {/* RRIF inputs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-4">
            <h2 className="font-bold text-primary dark:text-accent">RRIF Drawdown Simulator</h2>
            <p className="text-xs text-gray-500">Simulate how long your RRSP/RRIF lasts in retirement with mandatory minimum withdrawals.</p>

            <SliderInput label="Retirement Age" value={retirementAge} min={55} max={71} step={1}
              onChange={setRetirementAge} suffix=" years old" />

            <SliderInput label="Other Retirement Income" value={retirementIncome} min={0} max={150000} step={1000}
              onChange={setRetirementIncome} prefix="$" suffix="/yr"
              helpText={`Withdrawal tax rate at this income: ${results.withdrawRate}%`} />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Tax refund hero */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-2xl p-6 text-center shadow">
            <p className="text-sm font-semibold opacity-80 mb-1">This Year's Tax Refund</p>
            <p className="text-5xl font-bold">{fmt(results.taxRefund)}</p>
            <p className="text-sm opacity-70 mt-2">
              {results.marginalRate}% marginal rate · {fmt(contribution)} contribution
            </p>
            <p className="text-sm opacity-80 mt-1">Lifetime refunds over {years} years: <strong>{fmt(results.totalTaxRefunds)}</strong></p>
          </div>

          {/* Retirement value */}
          <div className="bg-primary text-white rounded-2xl p-6 text-center shadow">
            <p className="text-sm font-semibold opacity-80 mb-1">RRSP Value at Retirement</p>
            <p className="text-4xl font-bold">{fmt(results.finalValue)}</p>
            <div className="flex justify-center gap-4 text-sm opacity-70 mt-2">
              <span>Contributed: {fmt(results.totalContributed)}</span>
              <span>·</span>
              <span>Growth: {fmt(results.totalGrowth)}</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Tax Refund This Year",  value: fmt(results.taxRefund),       color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" },
              { label: "Lifetime Tax Refunds",  value: fmt(results.totalTaxRefunds), color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" },
              { label: "Tax-Sheltered Growth",  value: fmt(results.totalGrowth),     color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300" },
              ...(spousal ? [{ label: "Spousal Income Split Saving", value: `~${fmt(results.spousalSaving)}`, color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" }] : [
                { label: "Marginal Rate", value: `${results.marginalRate}%`, color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" }
              ]),
            ].map(card => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Growth chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h3 className="font-bold text-primary dark:text-accent mb-3">RRSP Growth Projection</h3>
            <Line data={{
              labels: results.projections.map(p => `Yr ${p.year}`),
              datasets: [{
                label: "RRSP Balance",
                data: results.projections.map(p => p.value),
                fill: true,
                backgroundColor: "rgba(0,51,102,0.1)",
                borderColor: "#003366",
                tension: 0.4,
                pointRadius: 2,
              }]
            }} options={{
              responsive: true,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => fmt(ctx.raw) } } },
              scales: { y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } } }
            }} />
          </div>

          {/* Refund reinvestment tip */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="font-bold text-amber-800 dark:text-amber-300 text-sm mb-1">💡 RRSP Refund Loop Strategy</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Contribute {fmt(contribution)} → get {fmt(results.taxRefund)} refund → reinvest refund into TFSA or RRSP.
              {reinvestRefund
                ? ` With refund reinvestment ON, your balance is ${fmt(results.finalValue)} — turn it OFF to see the difference.`
                : " Turn ON 'Reinvest refund' above to see how much more you'll have at retirement."}
            </p>
          </div>
        </div>
      </div>

      {/* RRIF Drawdown Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <button onClick={() => setShowRRIF(r => !r)}
          className="w-full flex items-center justify-between px-6 py-4 font-bold text-primary dark:text-accent text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition">
          <span>RRIF Drawdown Schedule — Age {Math.max(71, retirementAge)} to 95</span>
          <span className="text-xl">{showRRIF ? "−" : "+"}</span>
        </button>
        {showRRIF && (
          <div className="overflow-x-auto border-t dark:border-gray-700">
            <p className="px-6 py-3 text-sm text-gray-500">
              Starting RRIF balance: <strong>{fmt(results.finalValue)}</strong> at age {Math.max(71, retirementAge)} ·
              Withdrawal tax rate: <strong>{results.withdrawRate}%</strong> · Return in retirement: <strong>{returnRate}%</strong>
            </p>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Age", "Min Withdrawal", "Tax Owed", "Net Income", "RRIF Balance"].map(h => (
                    <th key={h} className="px-4 py-3 text-right first:text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {results.rrifRows.map((r, i) => (
                  <tr key={r.age} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                    <td className="px-4 py-2 font-medium">Age {r.age}</td>
                    <td className="px-4 py-2 text-right">{fmt(r.withdrawal)}</td>
                    <td className="px-4 py-2 text-right text-red-600 dark:text-red-400">{fmt(r.tax)}</td>
                    <td className="px-4 py-2 text-right text-green-600 dark:text-green-400 font-semibold">{fmt(r.netWithdrawal)}</td>
                    <td className="px-4 py-2 text-right font-semibold text-primary dark:text-accent">{fmt(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-400">
              💡 Tip: Withdraw more than the minimum early in retirement to reduce future RRIF size and protect your OAS (clawback threshold: ~$93,454/yr).
            </div>
          </div>
        )}
      </div>

      {/* Year-by-year toggle */}
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <button onClick={() => setShowTable(t => !t)}
          className="w-full flex items-center justify-between px-6 py-4 font-bold text-primary dark:text-accent text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition">
          <span>Year-by-Year Accumulation Table</span>
          <span className="text-xl">{showTable ? "−" : "+"}</span>
        </button>
        {showTable && (
          <div className="overflow-x-auto border-t dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Year", "RRSP Balance", "Annual Contribution", "Annual Refund", "Total Contributed"].map(h => (
                    <th key={h} className="px-4 py-3 text-right first:text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {results.projections.map((p, i) => (
                  <tr key={p.year} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                    <td className="px-4 py-2 font-medium">Year {p.year}</td>
                    <td className="px-4 py-2 text-right font-semibold text-primary dark:text-accent">{fmt(p.value)}</td>
                    <td className="px-4 py-2 text-right">{fmt(contribution + (reinvestRefund ? results.taxRefund : 0))}</td>
                    <td className="px-4 py-2 text-right text-green-600 dark:text-green-400">{fmt(results.taxRefund)}</td>
                    <td className="px-4 py-2 text-right">{fmt(currentBalance + (contribution + (reinvestRefund ? results.taxRefund : 0)) * p.year)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FAQ items={RRSP_FAQS} />
    </section>
  );
}
