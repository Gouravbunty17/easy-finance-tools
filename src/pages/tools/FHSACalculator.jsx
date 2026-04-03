import React, { useMemo, useState } from "react";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolPageSchema from "../../components/ToolPageSchema";
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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const ANNUAL_LIMIT = 8000;
const LIFETIME_LIMIT = 40000;

const FAQS = [
  { q: "Who is eligible for the FHSA?", a: "You generally need to be a Canadian resident, at least 18 years old, and a qualifying first-time home buyer under the FHSA rules. Eligibility details should be checked directly against CRA guidance." },
  { q: "Can unused FHSA room carry forward?", a: "Yes. A limited amount of unused room can carry forward to the next year, but this calculator simplifies that handling for planning and does not replace CRA records." },
  { q: "What if I never buy a home?", a: "Unused FHSA amounts may generally be transferred to an RRSP or RRIF without an immediate tax hit, subject to the rules in force at the time." },
  { q: "Can both spouses open an FHSA?", a: "Yes, if both qualify individually. A couple may each use their own FHSA if they both meet the eligibility requirements." },
];

const TAX_RATES = {
  AB: [[0, 57375, 25], [57375, 114750, 30.5], [114750, 177922, 36], [177922, 253414, 44], [253414, Infinity, 48]],
  BC: [[0, 45654, 20.06], [45654, 91310, 28.7], [91310, 104835, 31], [104835, 127299, 38.7], [127299, 172602, 43.7], [172602, 240716, 46.2], [240716, Infinity, 53.5]],
  ON: [[0, 51446, 20.05], [51446, 102894, 29.65], [102894, 150000, 33.89], [150000, 220000, 43.41], [220000, Infinity, 53.53]],
  QC: [[0, 51780, 27.53], [51780, 103545, 37.12], [103545, 126000, 45.71], [126000, Infinity, 53.31]],
  MB: [[0, 36842, 25.8], [36842, 79625, 37.9], [79625, Infinity, 50.4]],
  SK: [[0, 49720, 25], [49720, 142058, 33], [142058, Infinity, 47]],
  NS: [[0, 29590, 23.79], [29590, 59180, 37.17], [59180, 93000, 43.5], [93000, 150000, 50], [150000, Infinity, 54]],
  NB: [[0, 47715, 27.16], [47715, 95431, 37.52], [95431, 176756, 46.84], [176756, Infinity, 53.3]],
  NL: [[0, 43198, 23.7], [43198, 86395, 33.95], [86395, 154244, 44.5], [154244, Infinity, 51.3]],
  PE: [[0, 32656, 24.8], [32656, 64313, 37.3], [64313, 105000, 42], [105000, Infinity, 47.37]],
  NT: [[0, 50597, 20.9], [50597, 101198, 30.6], [101198, 164525, 39], [164525, Infinity, 47]],
  NU: [[0, 53268, 19], [53268, 106537, 28], [106537, 173205, 35], [173205, Infinity, 45]],
  YT: [[0, 55867, 21.4], [55867, 111733, 29.5], [111733, 154906, 36.9], [154906, 500000, 42], [500000, Infinity, 48]],
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
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-bold text-secondary">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
        className="w-full accent-secondary"
      />
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

const fmt = (n) => `$${Math.round(n).toLocaleString()}`;

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
    const yearsSinceOpen = 2026 - yearOpened;
    const usedRoom = Math.min(yearsSinceOpen * ANNUAL_LIMIT, LIFETIME_LIMIT);
    const monthlyRate = returnRate / 100 / 12;
    let balance = currentBalance;
    let totalContributed = currentBalance;
    let totalTaxSaved = 0;
    const projections = [];
    const marginalRate = getMarginalRate(province, income);

    for (let year = 1; year <= buyInYears; year++) {
      const annualContrib = Math.min(monthlyContrib * 12, ANNUAL_LIMIT);
      const lifetimeUsed = usedRoom + (year - 1) * ANNUAL_LIMIT;
      const canContrib = Math.max(0, Math.min(annualContrib, LIFETIME_LIMIT - lifetimeUsed));
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyRate) + canContrib / 12;
      }
      totalContributed += canContrib;
      totalTaxSaved += canContrib * marginalRate;
      projections.push({ year, value: Math.round(balance) });
    }

    return {
      age: 2026 - birthYear,
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
    <section className="mx-auto max-w-4xl px-4 py-12">
      <SEO
        title="FHSA Calculator 2026 - First Home Savings Account Canada"
        description="Estimate FHSA balance, tax savings, and projected growth for a future home purchase. Free Canadian FHSA calculator with province-based marginal tax assumptions."
      />
      <ToolPageSchema
        name="FHSA Calculator 2026"
        description="Canadian FHSA calculator for contribution planning, tax savings, and projected growth toward a first home purchase."
        canonical="https://easyfinancetools.com/tools/fhsa-calculator"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-accent">FHSA Calculator</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Model <strong>tax-deductible contributions</strong>, <strong>tax-free growth</strong>, and projected home-buying funds inside the First Home Savings Account.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Annual Limit", value: "$8,000/yr" },
          { label: "Lifetime Limit", value: "$40,000" },
          { label: "Tax Treatment", value: "Deductible + Tax-Free" },
        ].map((fact) => (
          <div key={fact.label} className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center dark:border-blue-800 dark:bg-blue-900/20">
            <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{fact.label}</div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200">{fact.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Your FHSA Details</h2>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
            >
              {[["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"], ["NB", "New Brunswick"], ["NL", "Newfoundland and Labrador"], ["NS", "Nova Scotia"], ["NT", "Northwest Territories"], ["NU", "Nunavut"], ["ON", "Ontario"], ["PE", "Prince Edward Island"], ["QC", "Quebec"], ["SK", "Saskatchewan"], ["YT", "Yukon"]].map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Year FHSA Opened</label>
            <select
              value={yearOpened}
              onChange={(e) => setYearOpened(parseInt(e.target.value))}
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
            >
              {[2023, 2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <SliderInput label="Birth Year" value={birthYear} min={1960} max={2008} step={1} onChange={setBirthYear} />
          <SliderInput label="Annual Income" value={income} min={30000} max={300000} step={5000} onChange={setIncome} format={(n) => `$${(n / 1000).toFixed(0)}k`} />
          <SliderInput label="Monthly Contribution" value={monthlyContrib} min={100} max={667} step={50} onChange={setMonthlyContrib} format={(v) => `$${v}/mo`} />
          <SliderInput label="Current FHSA Balance" value={currentBalance} min={0} max={40000} step={500} onChange={setCurrentBalance} format={fmt} />
          <SliderInput label="Expected Annual Return" value={returnRate} min={1} max={12} step={0.5} onChange={setReturnRate} format={(v) => `${v}%`} />
          <SliderInput label="Years Until Home Purchase" value={buyInYears} min={1} max={15} step={1} onChange={setBuyInYears} format={(v) => `${v} yr${v !== 1 ? "s" : ""}`} />

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-900/20">
            <p className="font-semibold text-amber-800 dark:text-amber-200">Estimated marginal tax rate: {result.marginalRate}%</p>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              In this model, every full $8,000 annual FHSA contribution could generate roughly <strong>${Math.round(8000 * result.marginalRate / 100).toLocaleString()}</strong> in tax savings.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Your Results</h2>

          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
            <p className="mb-1 text-sm font-semibold text-green-700 dark:text-green-300">FHSA Balance at Purchase</p>
            <p className="text-4xl font-black text-green-700 dark:text-green-300">{fmt(result.finalBalance)}</p>
            {result.hitMax && <p className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400">Lifetime maximum reached in this projection.</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Contributed", value: fmt(result.totalContributed), color: "text-blue-600 dark:text-blue-400" },
              { label: "Tax-Free Growth", value: fmt(result.totalGrowth), color: "text-yellow-600 dark:text-yellow-400" },
              { label: "Tax Savings", value: fmt(result.totalTaxSaved), color: "text-purple-600 dark:text-purple-400" },
              { label: "Effective Cost", value: fmt(result.effectiveCost), color: "text-gray-700 dark:text-gray-300" },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <p className="mb-1 text-xs text-gray-500">{card.label}</p>
                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-3 text-sm font-bold">FHSA Growth Over {buyInYears} Years</p>
            <Line
              data={{
                labels: result.projections.map((point) => `Yr ${point.year}`),
                datasets: [
                  {
                    label: "Balance",
                    data: result.projections.map((point) => point.value),
                    fill: true,
                    backgroundColor: "rgba(34,197,94,0.1)",
                    borderColor: "#22c55e",
                    tension: 0.4,
                    pointRadius: 3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } } },
              }}
            />
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Remaining lifetime room after this projection: <strong>{fmt(result.remainingRoom)}</strong>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-bold">Why the FHSA Can Be Powerful</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>Contributions can create an immediate tax deduction.</li>
          <li>Growth inside the account can remain tax-sheltered.</li>
          <li>Qualifying withdrawals for a first home can be tax-free.</li>
          <li>Unused balances may be transferable to an RRSP or RRIF under the applicable rules.</li>
          <li>If both partners qualify, each person may be able to use their own FHSA.</li>
        </ul>
      </div>

      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">FHSA vs RRSP Home Buyers' Plan</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="py-2 pr-4 text-left font-semibold">Feature</th>
                <th className="py-2 pr-4 text-left font-semibold text-blue-600">FHSA</th>
                <th className="py-2 text-left font-semibold text-gray-500">RRSP HBP</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {[
                ["Maximum amount", "$40,000 lifetime", "$35,000 withdrawal limit in this comparison"],
                ["Tax deduction", "Yes", "Yes"],
                ["Repayment required", "No", "Yes, under HBP repayment rules"],
                ["Qualifying home withdrawal", "Tax-free", "Tax-free if HBP conditions are met"],
                ["Unused funds", "May transfer to RRSP or RRIF", "Remain in RRSP"],
                ["Annual contribution limit", "$8,000", "No separate HBP annual cap"],
              ].map(([feature, fhsa, rrsp]) => (
                <tr key={feature} className="border-b dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">{feature}</td>
                  <td className="py-2 pr-4 font-semibold text-blue-600">{fhsa}</td>
                  <td className="py-2 text-gray-500">{rrsp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-800 dark:bg-blue-900/20">
          <strong className="text-blue-800 dark:text-blue-200">Planning note:</strong>
          <span className="text-blue-700 dark:text-blue-300"> many first-time buyers look at both the FHSA and RRSP Home Buyers&apos; Plan together, but the exact mix should be checked against current rules and repayment obligations.</span>
        </div>
      </div>

      <MethodologyPanel
        title="How this FHSA calculator works"
        summary="This calculator estimates FHSA growth by applying regular contributions, a fixed annual return assumption, and an estimated provincial marginal tax rate to show possible tax savings and future balance."
        assumptions={[
          "Annual FHSA contributions are capped at $8,000 in this model, subject to the $40,000 lifetime limit.",
          "Tax savings are estimated using a simplified marginal tax rate lookup by province and income.",
          "Growth is modeled using a constant return assumption rather than real market performance.",
          "Carryforward and eligibility rules are simplified for planning and should be verified against CRA records.",
        ]}
        sources={[
          { label: "CRA: First Home Savings Account", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html" },
          { label: "Government of Canada: FHSA overview", href: "https://www.canada.ca/en/department-finance/news/2022/08/design-of-the-tax-free-first-home-savings-account.html" },
        ]}
        note="Educational estimate only. Verify FHSA eligibility, carryforward, and withdrawal rules with CRA guidance before acting."
      />

      <FAQ items={FAQS} />
    </section>
  );
}
