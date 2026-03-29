import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../../components/SEO";
import AdSlot from "../../components/AdSlot";
import ReferralSection from "../../components/ReferralSection";
import FAQ from "../../components/FAQ";

const TFSA_FAQS = [
  { q: "How much TFSA room do I have in 2026?", a: "If you were 18+ and a Canadian resident since 2009 and have never contributed, you have $95,000 in total TFSA room in 2026. The 2026 annual limit is $7,000. Your personal room depends on your age and prior contributions — check CRA My Account for your exact figure." },
  { q: "What is the TFSA contribution limit for 2026?", a: "The TFSA annual contribution limit for 2026 is $7,000, unchanged from 2024 and 2025. The cumulative lifetime limit since 2009 is $95,000 for those eligible from the start." },
  { q: "Can I withdraw from my TFSA and re-contribute?", a: "Yes — TFSA withdrawals are added back to your contribution room on January 1 of the following year. If you withdraw $10,000 in 2026, you can re-contribute that $10,000 starting January 1, 2027 (plus that year's new annual limit)." },
  { q: "What happens if I over-contribute to my TFSA?", a: "Over-contributions are penalized at 1% per month on the excess amount until it's withdrawn. Always verify your available room through CRA My Account before making large contributions." },
  { q: "What can I invest in inside a TFSA?", a: "A TFSA can hold cash, GICs, stocks, ETFs, mutual funds, and bonds — virtually any eligible investment. You cannot hold US-listed crypto directly, shares in a company you control, or certain other prohibited investments." },
  { q: "Is TFSA income taxed?", a: "No. All investment income — dividends, capital gains, interest — earned inside a TFSA is completely tax-free. Withdrawals are also tax-free at any time for any reason." },
];
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

function computeResult(birthYear, currentSavings, monthlyContrib, returnRate, years) {
  const eligibleSince = Math.max(2009, birthYear + 18);
  let contributionRoom = 0;
  for (let y = eligibleSince; y <= 2026; y++) {
    contributionRoom += TFSA_LIMITS[y] || 7000;
  }
  const r = returnRate / 100 / 12;
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
  return {
    age: 2026 - birthYear,
    contributionRoom,
    yearsEligible: 2026 - eligibleSince,
    projections,
    finalValue: Math.round(balance),
    totalContributed: Math.round(totalContributed),
    totalGrowth: Math.round(totalGrowth),
    taxSaved: Math.round(totalGrowth * 0.33),
  };
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

function computeTaxableAccount(currentSavings, monthlyContrib, returnRate, years, marginalRate) {
  const r = returnRate / 100 / 12;
  const taxRate = marginalRate / 100;
  let balance = currentSavings;
  const projections = [];
  for (let i = 1; i <= years; i++) {
    for (let m = 0; m < 12; m++) {
      const interest = balance * r;
      const afterTaxInterest = interest * (1 - taxRate);
      balance = balance + afterTaxInterest + monthlyContrib;
    }
    projections.push({ year: i, value: Math.round(balance) });
  }
  return { finalValue: Math.round(balance), projections };
}

export default function TFSACalculator() {
  const [searchParams] = useSearchParams();
  const [birthYear, setBirthYear] = useState(1990);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlyContrib, setMonthlyContrib] = useState(500);
  const [returnRate, setReturnRate] = useState(7);
  const [years, setYears] = useState(20);
  const [marginalRate, setMarginalRate] = useState(33);
  const [showTable, setShowTable] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pre-fill from URL params
  useEffect(() => {
    const by = searchParams.get("by");
    if (!by) return;
    setBirthYear(parseInt(by) || 1990);
    setCurrentSavings(parseFloat(searchParams.get("cs")) || 0);
    setMonthlyContrib(parseFloat(searchParams.get("mc")) || 500);
    setReturnRate(parseFloat(searchParams.get("rr")) || 7);
    setYears(parseInt(searchParams.get("yr")) || 20);
  }, []);

  // Live calculation
  const result = useMemo(() =>
    computeResult(birthYear, currentSavings, monthlyContrib, returnRate, years),
    [birthYear, currentSavings, monthlyContrib, returnRate, years]
  );

  const taxable = useMemo(() =>
    computeTaxableAccount(currentSavings, monthlyContrib, returnRate, years, marginalRate),
    [currentSavings, monthlyContrib, returnRate, years, marginalRate]
  );

  const tfsaAdvantage = result.finalValue - taxable.finalValue;

  const copyShareLink = () => {
    const url = new URL(window.location.href);
    url.search = `?by=${birthYear}&cs=${currentSavings}&mc=${monthlyContrib}&rr=${returnRate}&yr=${years}`;
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const monthlyToMax = Math.max(0, Math.round((7000 / 12 - monthlyContrib)));

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="TFSA Calculator 2026 — Free Canadian Tool"
        description="Calculate your TFSA contribution room and tax-free growth. Compare TFSA vs taxable account. Free Canadian calculator updated for 2026 limits. No signup required."
        canonical="https://easyfinancetools.com/tools/tfsa-calculator"
      />
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">TFSA Calculator 2026</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Calculate your tax-free growth and see how much more you earn vs a taxable account. Results update live.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 <strong>2026 TFSA Limit:</strong> $7,000/year &nbsp;|&nbsp;
          <strong>Lifetime Room (since 2009):</strong> ${TOTAL_ROOM.toLocaleString()} &nbsp;|&nbsp;
          <strong>Your room since age 18:</strong> ${result.contributionRoom.toLocaleString()}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-6">
          <h2 className="font-bold text-lg text-primary dark:text-accent">Your Details</h2>

          <SliderInput label="Birth Year" value={birthYear} min={1950} max={2006} step={1}
            onChange={setBirthYear} helpText={`Age: ${2026 - birthYear} · TFSA eligible since: ${Math.max(2009, birthYear + 18)}`} />

          <SliderInput label="Current TFSA Balance" value={currentSavings} min={0} max={200000} step={1000}
            onChange={setCurrentSavings} prefix="$" />

          <SliderInput label="Monthly Contribution" value={monthlyContrib} min={0} max={2000} step={50}
            onChange={setMonthlyContrib} prefix="$" suffix="/mo"
            helpText={monthlyToMax > 0 ? `Contribute $${monthlyToMax} more/month to max your annual TFSA` : "✅ You're maxing your annual TFSA limit"} />

          <SliderInput label="Expected Annual Return" value={returnRate} min={1} max={15} step={0.5}
            onChange={setReturnRate} suffix="%"
            helpText="Historical S&P 500: ~10% | XEQT/VEQT: ~8–9% | GIC/HISA: ~4%" />

          <SliderInput label="Investment Horizon" value={years} min={1} max={40} step={1}
            onChange={setYears} suffix=" years" />

          <SliderInput label="Marginal Tax Rate (for comparison)" value={marginalRate} min={15} max={55} step={0.5}
            onChange={setMarginalRate} suffix="%"
            helpText="Used to calculate taxable account performance for comparison" />
        </div>

        {/* Live results */}
        <div className="space-y-4">
          {/* TFSA hero */}
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 text-center shadow">
            <p className="text-sm font-semibold opacity-80 mb-1">TFSA Value in {years} Years</p>
            <p className="text-5xl font-bold">${result.finalValue.toLocaleString()}</p>
            <div className="flex justify-center gap-4 mt-3 text-sm opacity-80">
              <span>Contributed: ${result.totalContributed.toLocaleString()}</span>
              <span>·</span>
              <span>Growth: ${result.totalGrowth.toLocaleString()}</span>
            </div>
          </div>

          {/* 4 cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Tax-Free Growth",        value: `$${result.totalGrowth.toLocaleString()}`,    color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" },
              { label: "TFSA vs Taxable Adv.",   value: `+$${tfsaAdvantage.toLocaleString()}`,        color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300" },
              { label: "Tax Saved (est.)",        value: `$${result.taxSaved.toLocaleString()}`,       color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" },
              { label: "Contribution Room",       value: `$${result.contributionRoom.toLocaleString()}`,color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" },
            ].map(card => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Chart: TFSA vs Taxable */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h3 className="font-bold text-primary dark:text-accent mb-3">TFSA vs Taxable Account</h3>
            <Line data={{
              labels: result.projections.map(p => `Yr ${p.year}`),
              datasets: [
                {
                  label: "TFSA (Tax-Free)",
                  data: result.projections.map(p => p.value),
                  fill: true,
                  backgroundColor: "rgba(0,168,232,0.1)",
                  borderColor: "#00A8E8",
                  tension: 0.4,
                  pointRadius: 2,
                },
                {
                  label: `Taxable (${marginalRate}% tax)`,
                  data: taxable.projections.map(p => p.value),
                  fill: false,
                  borderColor: "#ef4444",
                  borderDash: [5, 5],
                  tension: 0.4,
                  pointRadius: 2,
                },
              ]
            }} options={{
              responsive: true,
              plugins: { legend: { position: "top" }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: $${ctx.raw.toLocaleString()}` } } },
              scales: { y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } } }
            }} />
          </div>

          {/* Share */}
          <div className="flex justify-end">
            <button onClick={copyShareLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                copied ? "bg-green-50 border-green-300 text-green-700" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary"
              }`}>
              {copied ? "✅ Link Copied!" : "🔗 Share My Results"}
            </button>
          </div>
        </div>
      </div>

      {/* Year-by-Year Table toggle */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <button onClick={() => setShowTable(t => !t)}
          className="w-full flex items-center justify-between px-6 py-4 font-bold text-primary dark:text-accent text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition">
          <span>Year-by-Year Breakdown</span>
          <span className="text-xl">{showTable ? "−" : "+"}</span>
        </button>
        {showTable && (
          <div className="overflow-x-auto border-t dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Year", "TFSA Balance", "Taxable Balance", "Advantage", "Total Contributed", "Total Growth"].map(h => (
                    <th key={h} className="px-4 py-3 text-right first:text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {result.projections.map((p, i) => {
                  const tv = taxable.projections[i]?.value || 0;
                  const contributed = currentSavings + monthlyContrib * 12 * p.year;
                  const growth = p.value - contributed;
                  return (
                    <tr key={p.year} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                      <td className="px-4 py-2 font-medium">Year {p.year}</td>
                      <td className="px-4 py-2 text-right font-semibold text-primary dark:text-accent">${p.value.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">${tv.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-green-600 dark:text-green-400 font-semibold">+${(p.value - tv).toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">${Math.round(contributed).toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">${Math.max(0, Math.round(growth)).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReferralSection />
      <FAQ items={TFSA_FAQS} />
    </section>
  );
}
