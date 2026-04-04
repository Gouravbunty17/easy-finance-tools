import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolPageSchema from "../../components/ToolPageSchema";
import { trackToolCalculate, trackToolStart } from "../../lib/analytics";
import SurfaceTrackedLink from "../../components/SurfaceTrackedLink";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const RRSP_FAQS = [
  { q: "What is the RRSP contribution limit for 2026?", a: "The 2026 RRSP contribution limit is 18% of your 2025 earned income, up to a maximum of $33,810. Unused room from prior years can usually carry forward. Check your CRA Notice of Assessment for your exact number." },
  { q: "When is the RRSP contribution deadline for 2026?", a: "The deadline for contributions that can be deducted against the 2025 tax year is March 2, 2026." },
  { q: "How does an RRSP reduce my taxes?", a: "RRSP contributions reduce taxable income. A $10,000 contribution saves tax at your marginal rate, so a person at a 33% marginal rate would save about $3,300." },
  { q: "What is a spousal RRSP?", a: "A spousal RRSP lets one partner claim the deduction while building retirement assets in the other partner's name. It is commonly used for retirement income splitting." },
  { q: "What is a RRIF and when do I need one?", a: "A RRIF is the account an RRSP converts into no later than the end of the year you turn 71. After conversion, minimum withdrawals apply each year." },
];

const PROV_RATES = {
  AB: [[0, 57375, 25], [57375, 114750, 30.5], [114750, 177922, 36], [177922, 253414, 44], [253414, Infinity, 48]],
  BC: [[0, 45654, 20.06], [45654, 91310, 28.7], [91310, 104835, 31], [104835, 127299, 38.7], [127299, 172602, 43.7], [172602, 240716, 46.2], [240716, Infinity, 53.5]],
  MB: [[0, 36842, 25.8], [36842, 79625, 37.9], [79625, Infinity, 50.4]],
  NB: [[0, 47715, 27.16], [47715, 95431, 37.52], [95431, 176756, 46.84], [176756, Infinity, 53.3]],
  NL: [[0, 43198, 23.7], [43198, 86395, 33.95], [86395, 154244, 44.5], [154244, Infinity, 51.3]],
  NS: [[0, 29590, 23.79], [29590, 59180, 37.17], [59180, 93000, 43.5], [93000, 150000, 50], [150000, Infinity, 54]],
  NT: [[0, 50597, 20.9], [50597, 101198, 30.6], [101198, 164525, 39], [164525, Infinity, 47]],
  NU: [[0, 53268, 19], [53268, 106537, 28], [106537, 173205, 35], [173205, Infinity, 45]],
  ON: [[0, 51446, 20.05], [51446, 102894, 29.65], [102894, 150000, 33.89], [150000, 220000, 43.41], [220000, Infinity, 53.53]],
  PE: [[0, 32656, 24.8], [32656, 64313, 37.3], [64313, 105000, 42], [105000, Infinity, 47.37]],
  QC: [[0, 51780, 27.53], [51780, 103545, 37.12], [103545, 126000, 45.71], [126000, Infinity, 53.31]],
  SK: [[0, 49720, 25], [49720, 142058, 33], [142058, Infinity, 47]],
  YT: [[0, 55867, 21.4], [55867, 111733, 29.5], [111733, 154906, 36.9], [154906, 500000, 42], [500000, Infinity, 48]],
};

const PROVINCES = [
  ["AB", "Alberta"],
  ["BC", "British Columbia"],
  ["MB", "Manitoba"],
  ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"],
  ["NT", "Northwest Territories"],
  ["NU", "Nunavut"],
  ["ON", "Ontario"],
  ["PE", "Prince Edward Island"],
  ["QC", "Quebec"],
  ["SK", "Saskatchewan"],
  ["YT", "Yukon"],
];

const RRIF_MIN = {
  71: 5.28, 72: 5.4, 73: 5.53, 74: 5.67, 75: 5.82, 76: 5.98, 77: 6.17, 78: 6.36,
  79: 6.58, 80: 6.82, 81: 7.08, 82: 7.38, 83: 7.71, 84: 8.08, 85: 8.51, 86: 8.99,
  87: 9.55, 88: 10.21, 89: 10.99, 90: 11.92, 91: 13.06, 92: 14.49, 93: 16.34, 94: 18.79, 95: 20,
};

function getMarginalRate(province, income) {
  const brackets = PROV_RATES[province] || PROV_RATES.ON;
  for (const [low, high, rate] of brackets) {
    if (income >= low && income < high) {
      return rate / 100;
    }
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
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg accent-primary cursor-pointer"
      />
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
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const trackStartOnce = () => {
    if (hasTrackedStart) return;
    trackToolStart("rrsp_calculator", { entry_point: "input_interaction" });
    setHasTrackedStart(true);
  };

  const results = useMemo(() => {
    const marginalRate = getMarginalRate(province, income);
    const spouseMarginalRate = getMarginalRate(province, spouseIncome);
    const withdrawRate = getMarginalRate(province, retirementIncome);
    const taxRefund = contribution * marginalRate;
    const extraFromRefund = reinvestRefund ? taxRefund / 12 : 0;
    const monthlyRate = returnRate / 100 / 12;
    const monthlyContrib = contribution / 12 + extraFromRefund;
    let balance = currentBalance;
    const projections = [];

    for (let year = 1; year <= years; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        balance = balance * (1 + monthlyRate) + monthlyContrib;
      }
      projections.push({ year, value: Math.round(balance) });
    }

    const totalContributed = currentBalance + (contribution + (reinvestRefund ? taxRefund : 0)) * years;
    const totalGrowth = balance - totalContributed;
    const totalTaxRefunds = taxRefund * years;
    const normalWithdrawTax = balance * withdrawRate;
    const spouseWithdrawTax = (balance / 2) * withdrawRate + (balance / 2) * getMarginalRate(province, spouseIncome + retirementIncome / 2);
    const spousalSaving = normalWithdrawTax - spouseWithdrawTax;
    const rrifStart = Math.max(71, retirementAge);
    const rrifRows = [];
    let rrifBalance = balance;

    for (let age = rrifStart; age <= 95 && rrifBalance > 0; age += 1) {
      const minPct = (RRIF_MIN[age] || 20) / 100;
      const withdrawal = Math.max(rrifBalance * minPct, 0);
      const tax = withdrawal * withdrawRate;
      rrifBalance = Math.max(0, (rrifBalance - withdrawal) * (1 + returnRate / 100));
      rrifRows.push({ age, withdrawal: Math.round(withdrawal), tax: Math.round(tax), netWithdrawal: Math.round(withdrawal - tax), balance: Math.round(rrifBalance) });
    }

    const maxContrib = Math.min(income * 0.18, 33810);

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
  }, [income, province, contribution, currentBalance, returnRate, years, spouseIncome, reinvestRefund, retirementAge, retirementIncome]);

  const isOverContrib = contribution > results.maxContrib;
  const retirementYear = 2026 + years;

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="RRSP Calculator 2026 - Tax Refund and RRIF Planner"
        description="Calculate your RRSP tax refund, retirement savings growth, spousal RRSP income-splitting benefit, and RRIF drawdown. Free Canadian calculator updated for 2026."
        canonical="https://easyfinancetools.com/tools/rrsp-calculator"
      />
      <ToolPageSchema
        name="RRSP Calculator 2026"
        description="Canadian RRSP calculator for refund estimates, retirement growth, spousal RRSP comparisons, and RRIF planning."
        canonical="https://easyfinancetools.com/tools/rrsp-calculator"
        category="FinanceApplication"
      />

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">RRSP Calculator 2026</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Estimate your tax refund, project retirement growth, compare spousal RRSP strategies, and preview RRIF withdrawals.
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-green-800 dark:text-green-300">
          <strong>2026 RRSP limit:</strong> 18% of 2025 earned income up to <strong>$33,810</strong> &nbsp;|&nbsp;
          <strong>Your estimated annual limit:</strong> {fmt(results.maxContrib)} &nbsp;|&nbsp;
          <strong>Deduction deadline:</strong> March 2, 2026
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h2 className="font-bold text-primary dark:text-accent mb-1">Province</h2>
            <select value={province} onChange={(e) => { trackStartOnce(); setProvince(e.target.value); }} className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none mt-2">
              {PROVINCES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-2">Province affects your estimated marginal tax rate and refund value.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-5">
            <h2 className="font-bold text-primary dark:text-accent">Growth inputs</h2>

            <SliderInput label="Annual Income" value={income} min={30000} max={300000} step={1000} onChange={(value) => { trackStartOnce(); setIncome(value); }} prefix="$" helpText={`Estimated marginal rate: ${results.marginalRate}%. Estimated annual RRSP limit: ${fmt(results.maxContrib)}.`} />
            <SliderInput label="Annual RRSP Contribution" value={contribution} min={0} max={33810} step={500} onChange={(value) => { trackStartOnce(); setContribution(value); trackToolCalculate("rrsp_calculator", { action: "contribution_change" }); }} prefix="$" helpText={isOverContrib ? `This exceeds the annual estimate of ${fmt(results.maxContrib)}. Check CRA for carryforward room before relying on this number.` : `Estimated tax refund this year: ${fmt(results.taxRefund)}.`} />
            <SliderInput label="Current RRSP Balance" value={currentBalance} min={0} max={500000} step={5000} onChange={(value) => { trackStartOnce(); setCurrentBalance(value); }} prefix="$" />
            <SliderInput label="Expected Annual Return" value={returnRate} min={1} max={12} step={0.5} onChange={(value) => { trackStartOnce(); setReturnRate(value); }} suffix="%" />
            <SliderInput label="Years Until Retirement" value={years} min={1} max={40} step={1} onChange={(value) => { trackStartOnce(); setYears(value); }} suffix=" years" helpText={`Projected retirement year: ${retirementYear}. Estimated balance at retirement: ${fmt(results.finalValue)}.`} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-4">
            <h2 className="font-bold text-primary dark:text-accent">Strategy options</h2>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="reinvest" checked={reinvestRefund} onChange={(e) => setReinvestRefund(e.target.checked)} className="w-5 h-5 mt-0.5 accent-primary" />
              <label htmlFor="reinvest" className="text-sm cursor-pointer">
                <span className="font-semibold">Reinvest the tax refund into your RRSP</span>
                <p className="text-gray-500 text-xs mt-0.5">This shows the compounding effect of putting the refund back to work instead of spending it.</p>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="spousal" checked={spousal} onChange={(e) => setSpousal(e.target.checked)} className="w-5 h-5 mt-0.5 accent-primary" />
              <label htmlFor="spousal" className="text-sm cursor-pointer">
                <span className="font-semibold">Compare a spousal RRSP approach</span>
                <p className="text-gray-500 text-xs mt-0.5">Useful when retirement income may be uneven between partners.</p>
              </label>
            </div>

            {spousal && (
              <div className="pl-8">
                <SliderInput label="Spouse's Retirement Income" value={spouseIncome} min={0} max={150000} step={1000} onChange={(value) => { trackStartOnce(); setSpouseIncome(value); }} prefix="$" helpText={`Estimated spouse marginal rate: ${results.spouseMarginalRate}%.`} />
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-4">
            <h2 className="font-bold text-primary dark:text-accent">RRIF drawdown inputs</h2>
            <p className="text-xs text-gray-500">Preview how minimum RRIF withdrawals may affect future taxable income.</p>
            <SliderInput label="Retirement Age" value={retirementAge} min={55} max={71} step={1} onChange={(value) => { trackStartOnce(); setRetirementAge(value); }} suffix=" years old" />
            <SliderInput label="Other Retirement Income" value={retirementIncome} min={0} max={150000} step={1000} onChange={(value) => { trackStartOnce(); setRetirementIncome(value); }} prefix="$" suffix="/yr" helpText={`Estimated withdrawal tax rate at this income: ${results.withdrawRate}%.`} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-2xl p-6 text-center shadow">
            <p className="text-sm font-semibold opacity-80 mb-1">Estimated tax refund this year</p>
            <p className="text-5xl font-bold">{fmt(results.taxRefund)}</p>
            <p className="text-sm opacity-70 mt-2">{results.marginalRate}% marginal rate on a {fmt(contribution)} contribution</p>
            <p className="text-sm opacity-80 mt-1">Estimated refunds over {years} years: <strong>{fmt(results.totalTaxRefunds)}</strong></p>
          </div>

          <div className="bg-primary text-white rounded-2xl p-6 text-center shadow">
            <p className="text-sm font-semibold opacity-80 mb-1">RRSP value at retirement</p>
            <p className="text-4xl font-bold">{fmt(results.finalValue)}</p>
            <div className="flex justify-center gap-4 text-sm opacity-70 mt-2">
              <span>Contributed: {fmt(results.totalContributed)}</span>
              <span>•</span>
              <span>Growth: {fmt(results.totalGrowth)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Refund this year", value: fmt(results.taxRefund), color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" },
              { label: "Lifetime refunds", value: fmt(results.totalTaxRefunds), color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" },
              { label: "Tax-sheltered growth", value: fmt(results.totalGrowth), color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300" },
              { label: spousal ? "Spousal split estimate" : "Marginal rate", value: spousal ? `~${fmt(results.spousalSaving)}` : `${results.marginalRate}%`, color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" },
            ].map((card) => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h3 className="font-bold text-primary dark:text-accent mb-3">RRSP growth projection</h3>
            <Line
              data={{
                labels: results.projections.map((point) => `Yr ${point.year}`),
                datasets: [{ label: "RRSP Balance", data: results.projections.map((point) => point.value), fill: true, backgroundColor: "rgba(0,51,102,0.1)", borderColor: "#003366", tension: 0.4, pointRadius: 2 }],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmt(Number(ctx.raw)) } } },
                scales: { y: { ticks: { callback: (value) => `$${(Number(value) / 1000).toFixed(0)}k` } } },
              }}
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="font-bold text-amber-800 dark:text-amber-300 text-sm mb-1">Refund loop strategy</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">Contribute to the RRSP, receive a refund, then decide whether to reinvest that refund into the RRSP or direct it toward a TFSA. Turning refund reinvestment on and off above is a quick way to compare those paths.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <button onClick={() => setShowRRIF((value) => !value)} className="w-full flex items-center justify-between px-6 py-4 font-bold text-primary dark:text-accent text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition">
          <span>RRIF drawdown schedule</span>
          <span className="text-xl">{showRRIF ? "-" : "+"}</span>
        </button>
        {showRRIF && (
          <div className="overflow-x-auto border-t dark:border-gray-700">
            <p className="px-6 py-3 text-sm text-gray-500">Starting RRIF balance: <strong>{fmt(results.finalValue)}</strong> at age {Math.max(71, retirementAge)}. Estimated withdrawal tax rate: <strong>{results.withdrawRate}%</strong>.</p>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>{["Age", "Min Withdrawal", "Tax Owed", "Net Income", "RRIF Balance"].map((heading) => <th key={heading} className="px-4 py-3 text-right first:text-left font-semibold">{heading}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {results.rrifRows.map((row, index) => (
                  <tr key={row.age} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                    <td className="px-4 py-2 font-medium">Age {row.age}</td>
                    <td className="px-4 py-2 text-right">{fmt(row.withdrawal)}</td>
                    <td className="px-4 py-2 text-right text-red-600 dark:text-red-400">{fmt(row.tax)}</td>
                    <td className="px-4 py-2 text-right text-green-600 dark:text-green-400 font-semibold">{fmt(row.netWithdrawal)}</td>
                    <td className="px-4 py-2 text-right font-semibold text-primary dark:text-accent">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <button onClick={() => setShowTable((value) => !value)} className="w-full flex items-center justify-between px-6 py-4 font-bold text-primary dark:text-accent text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition">
          <span>Year-by-year accumulation table</span>
          <span className="text-xl">{showTable ? "-" : "+"}</span>
        </button>
        {showTable && (
          <div className="overflow-x-auto border-t dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>{["Year", "RRSP Balance", "Annual Contribution", "Annual Refund", "Total Contributed"].map((heading) => <th key={heading} className="px-4 py-3 text-right first:text-left font-semibold">{heading}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {results.projections.map((point, index) => (
                  <tr key={point.year} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                    <td className="px-4 py-2 font-medium">Year {point.year}</td>
                    <td className="px-4 py-2 text-right font-semibold text-primary dark:text-accent">{fmt(point.value)}</td>
                    <td className="px-4 py-2 text-right">{fmt(contribution + (reinvestRefund ? results.taxRefund : 0))}</td>
                    <td className="px-4 py-2 text-right text-green-600 dark:text-green-400">{fmt(results.taxRefund)}</td>
                    <td className="px-4 py-2 text-right">{fmt(currentBalance + (contribution + (reinvestRefund ? results.taxRefund : 0)) * point.year)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MethodologyPanel
        summary="This calculator estimates RRSP tax refunds using province-level marginal rates and models growth using a constant annual return with evenly spaced contributions. It is helpful for planning, not for replacing your CRA records or tax filing details."
        assumptions={[
          "Annual RRSP room is estimated as 18% of income capped at $33,810 for 2026 and does not include your personal carryforward room unless you confirm it separately.",
          "Refund estimates use a simplified combined marginal-rate approach rather than a full return-level tax model.",
          "Growth assumes a constant annual return and even monthly reinvestment through time.",
          "RRIF projections use published minimum-withdrawal percentages and a simplified retirement tax-rate estimate.",
        ]}
        sources={[
          { label: "CRA: Registered Retirement Savings Plans", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans.html" },
          { label: "CRA: RRIF minimum amount factors", href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4040/rrsp-other-registered-plans-retirement.html" },
        ]}
      />

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <SurfaceTrackedLink to="/blog/rrsp-deadline-2026" eventName="tool_result_cta_click" ctaLabel="rrsp_deadline_guide" trackingParams={{ tool_name: "rrsp_calculator", section: "next_steps", destination_type: "article" }} className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-gray-800">
          <h2 className="text-lg font-bold text-primary dark:text-accent">RRSP deadline guide</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Review the deduction deadline, contribution rules, and refund timing.</p>
        </SurfaceTrackedLink>
        <SurfaceTrackedLink to="/blog/tfsa-vs-rrsp-2026" eventName="tool_result_cta_click" ctaLabel="rrsp_vs_tfsa_guide" trackingParams={{ tool_name: "rrsp_calculator", section: "next_steps", destination_type: "article" }} className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-gray-800">
          <h2 className="text-lg font-bold text-primary dark:text-accent">RRSP vs TFSA</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Compare deduction-first and tax-free-first strategies before you contribute.</p>
        </SurfaceTrackedLink>
        <SurfaceTrackedLink to="/tools/income-tax-calculator" eventName="tool_result_cta_click" ctaLabel="next_tool_income_tax" trackingParams={{ tool_name: "rrsp_calculator", section: "next_steps", destination_type: "tool" }} className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-gray-800">
          <h2 className="text-lg font-bold text-primary dark:text-accent">Next tool: income tax</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Check your take-home pay and tax bracket before choosing a contribution size.</p>
        </SurfaceTrackedLink>
      </section>

      <FAQ items={RRSP_FAQS} />
    </section>
  );
}
