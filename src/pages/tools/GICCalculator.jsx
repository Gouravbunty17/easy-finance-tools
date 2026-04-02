import React, { useState, useEffect } from "react";
import SEO from "../../components/SEO";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const FREQUENCIES = [
  { label: "Annually", value: 1 },
  { label: "Semi-Annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
];

const PRESETS = [
  { label: "EQ Bank 1yr", rate: 3.75, term: 1 },
  { label: "Oaken 1yr", rate: 4.10, term: 1 },
  { label: "Steinbach 2yr", rate: 4.25, term: 2 },
  { label: "Big Bank 1yr", rate: 2.50, term: 1 },
];

function calcGIC(principal, rate, years, freq) {
  const r = rate / 100 / freq;
  const n = freq * years;
  const maturity = principal * Math.pow(1 + r, n);
  return maturity;
}

export default function GICCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(3.75);
  const [term, setTerm] = useState(1);
  const [freq, setFreq] = useState(2); // semi-annual (standard for GICs)

  const maturity = calcGIC(principal, rate, term, freq);
  const interest = maturity - principal;
  const effectiveRate = (Math.pow(1 + rate / 100 / freq, freq) - 1) * 100;

  // Build year-by-year chart data
  const points = term <= 5 ? term * 12 : term * 4;
  const step = term <= 5 ? 1 / 12 : 1 / 4;
  const labels = [];
  const values = [];
  for (let i = 0; i <= points; i++) {
    const t = i * step;
    labels.push(
      term <= 1 ? `Mo ${Math.round(t * 12)}` :
      term <= 5 ? `Yr ${t.toFixed(1)}` : `Yr ${Math.round(t)}`
    );
    values.push(Math.round(calcGIC(principal, rate, t, freq)));
  }

  const fmt = (n) => n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title="GIC Calculator Canada 2026 — Compare GIC Rates & Returns"
        description="Calculate how much your GIC will be worth at maturity. Compare rates from EQ Bank, Oaken, Steinbach and more. Free Canadian GIC calculator updated for 2026."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🏦 GIC Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          See exactly how much interest your GIC will earn — and compare top Canadian rates side by side.
        </p>
      </div>

      {/* Quick Rate Presets */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-500 mb-2">Quick Rate Presets:</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => { setRate(p.rate); setTerm(p.term); }}
              className="px-3 py-1.5 rounded-full text-sm font-semibold border border-primary text-primary hover:bg-primary hover:text-white transition"
            >
              {p.label} ({p.rate}%)
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-6 mb-6 space-y-6">

        {/* Principal */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-semibold">Investment Amount</label>
            <span className="text-primary font-bold">{fmt(principal)}</span>
          </div>
          <input type="range" min={500} max={500000} step={500} value={principal}
            onChange={e => setPrincipal(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$500</span><span>$500K</span>
          </div>
        </div>

        {/* Rate */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-semibold">Interest Rate</label>
            <span className="text-primary font-bold">{rate.toFixed(2)}%</span>
          </div>
          <input type="range" min={0.5} max={8} step={0.05} value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5%</span><span>8%</span>
          </div>
        </div>

        {/* Term */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-semibold">GIC Term</label>
            <span className="text-primary font-bold">{term} year{term !== 1 ? "s" : ""}</span>
          </div>
          <input type="range" min={1} max={10} step={1} value={term}
            onChange={e => setTerm(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 year</span><span>10 years</span>
          </div>
        </div>

        {/* Compounding */}
        <div>
          <label className="text-sm font-semibold block mb-2">Compounding Frequency</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FREQUENCIES.map(f => (
              <button key={f.value}
                onClick={() => setFreq(f.value)}
                className={`py-2 rounded-xl text-sm font-semibold border-2 transition ${
                  freq === f.value
                    ? "bg-primary text-white border-primary"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results — always visible */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6 mb-6 text-center">
        <p className="text-blue-200 text-sm font-semibold mb-1">Maturity Value</p>
        <p className="text-5xl font-bold mb-2">{fmt(maturity)}</p>
        <p className="text-blue-200 text-sm">
          {fmt(principal)} → earns <strong className="text-white">{fmt(interest)}</strong> interest over {term} year{term !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Interest Earned", value: fmt(interest), color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" },
          { label: "Effective Annual Rate", value: `${effectiveRate.toFixed(3)}%`, color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300" },
          { label: "Return on Investment", value: `${((interest / principal) * 100).toFixed(2)}%`, color: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300" },
        ].map(c => (
          <div key={c.label} className={`border-2 rounded-xl p-4 ${c.color}`}>
            <p className="text-xs font-semibold opacity-70">{c.label}</p>
            <p className="text-xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-6">
        <h2 className="text-lg font-bold mb-4">📈 GIC Growth Over Time</h2>
        <Line
          data={{
            labels,
            datasets: [{
              label: "GIC Value",
              data: values,
              fill: true,
              backgroundColor: "rgba(0,168,232,0.1)",
              borderColor: "#00a8e8",
              tension: 0.4,
            }]
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` } }
            }
          }}
        />
      </div>

      {/* Tips */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-3">💡 GIC Tips for Canadians</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✅ <strong>GIC laddering</strong> — split your money across 1, 2, 3, 4, and 5-year GICs. As each matures, reinvest at current rates</li>
          <li>✅ <strong>Hold GICs in your TFSA</strong> — all interest earned is 100% tax-free</li>
          <li>✅ <strong>RRSP GICs</strong> — shelter the interest from tax until withdrawal in retirement</li>
          <li>✅ <strong>CDIC insured</strong> — GICs at member institutions are insured up to $100,000 per category</li>
          <li>✅ <strong>Shop beyond the big banks</strong> — EQ Bank, Oaken Financial, and credit unions often pay 1–2% more</li>
        </ul>
      </div>
    </section>
  );
}
