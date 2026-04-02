import React, { useState, useMemo } from "react";
import SEO from "../../components/SEO";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const fmt = (n) => n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

function calcPayoff(debts, extraPayment, method) {
  // Clone debts
  let remaining = debts.map(d => ({ ...d, balance: d.balance }));

  // Sort by method
  const sorted = [...remaining].sort((a, b) =>
    method === "avalanche"
      ? b.rate - a.rate       // highest rate first
      : a.balance - b.balance  // lowest balance first
  );

  let month = 0;
  let totalInterest = 0;
  const monthlyTotals = [];

  while (sorted.some(d => d.balance > 0) && month < 600) {
    month++;
    let extra = extraPayment;

    // Pay minimum on all, then apply extra to priority debt
    for (const d of sorted) {
      if (d.balance <= 0) continue;
      const interest = (d.balance * d.rate) / 100 / 12;
      totalInterest += interest;
      d.balance += interest;
      const payment = Math.min(d.balance, d.minPayment);
      d.balance = Math.max(0, d.balance - payment);
    }

    // Apply extra payment to first non-zero priority debt
    for (const d of sorted) {
      if (d.balance <= 0 || extra <= 0) continue;
      const pay = Math.min(d.balance, extra);
      d.balance = Math.max(0, d.balance - pay);
      extra -= pay;
    }

    monthlyTotals.push(Math.round(sorted.reduce((s, d) => s + d.balance, 0)));
  }

  return { months: month, totalInterest: Math.round(totalInterest), monthlyTotals };
}

const defaultDebts = [
  { id: 1, name: "Credit Card", balance: 5000, rate: 19.99, minPayment: 100 },
  { id: 2, name: "Car Loan", balance: 12000, rate: 6.99, minPayment: 250 },
  { id: 3, name: "Line of Credit", balance: 8000, rate: 8.50, minPayment: 120 },
];

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState(defaultDebts);
  const [extraPayment, setExtraPayment] = useState(200);
  const [method, setMethod] = useState("avalanche");

  const avalanche = useMemo(() => calcPayoff(debts, extraPayment, "avalanche"), [debts, extraPayment]);
  const snowball = useMemo(() => calcPayoff(debts, extraPayment, "snowball"), [debts, extraPayment]);
  const chosen = method === "avalanche" ? avalanche : snowball;
  const other = method === "avalanche" ? snowball : avalanche;

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalMinPayment = debts.reduce((s, d) => s + d.minPayment, 0);

  // Without extra — just minimum payments
  const noExtra = useMemo(() => calcPayoff(debts, 0, "avalanche"), [debts]);

  function addDebt() {
    setDebts(prev => [...prev, { id: Date.now(), name: "New Debt", balance: 2000, rate: 10, minPayment: 50 }]);
  }
  function removeDebt(id) {
    setDebts(prev => prev.filter(d => d.id !== id));
  }
  function updateDebt(id, field, value) {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  }

  const monthsToYears = (m) => {
    const y = Math.floor(m / 12);
    const mo = m % 12;
    return y > 0 ? `${y}yr ${mo > 0 ? mo + "mo" : ""}` : `${mo}mo`;
  };

  // Chart: first 60 months of payoff
  const chartMonths = Math.min(chosen.months, 60);
  const chartLabels = Array.from({ length: chartMonths + 1 }, (_, i) =>
    i % 12 === 0 ? `Yr ${i / 12}` : ""
  );

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Debt Payoff Calculator Canada — Avalanche vs Snowball Method"
        description="Find the fastest way to pay off your debt. Compare avalanche vs snowball method. See your exact payoff date and total interest saved. Free Canadian debt calculator."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          💳 Debt Payoff Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find your fastest path to being debt-free. Compare the avalanche and snowball methods side by side.
        </p>
      </div>

      {/* Debt List */}
      <div className="space-y-3 mb-6">
        {debts.map(d => (
          <div key={d.id} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Debt Name</label>
                <input
                  value={d.name}
                  onChange={e => updateDebt(d.id, "name", e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Balance ($)</label>
                <input type="number" value={d.balance}
                  onChange={e => updateDebt(d.id, "balance", Number(e.target.value))}
                  className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Interest Rate (%)</label>
                <input type="number" step="0.01" value={d.rate}
                  onChange={e => updateDebt(d.id, "rate", Number(e.target.value))}
                  className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Min Payment ($)</label>
                  <input type="number" value={d.minPayment}
                    onChange={e => updateDebt(d.id, "minPayment", Number(e.target.value))}
                    className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 focus:outline-none focus:border-primary"
                  />
                </div>
                {debts.length > 1 && (
                  <button onClick={() => removeDebt(d.id)}
                    className="self-end mb-0.5 px-2 py-2 text-red-400 hover:text-red-600 transition text-sm">
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button onClick={addDebt}
          className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-3 text-sm text-gray-500 hover:border-primary hover:text-primary transition">
          + Add Another Debt
        </button>
      </div>

      {/* Extra Payment Slider */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl p-5 mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold">Extra Monthly Payment</label>
          <span className="font-bold text-primary">{fmt(extraPayment)}</span>
        </div>
        <input type="range" min={0} max={2000} step={25} value={extraPayment}
          onChange={e => setExtraPayment(Number(e.target.value))}
          className="w-full accent-blue-600" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$0 (min payments only)</span><span>$2,000 extra</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Total monthly payment: <strong>{fmt(totalMinPayment + extraPayment)}</strong>
          {extraPayment > 0 && <span className="text-green-600 ml-2">💡 +{fmt(extraPayment)} extra = saves {monthsToYears(noExtra.months - chosen.months)} and {fmt(noExtra.totalInterest - chosen.totalInterest)} in interest</span>}
        </p>
      </div>

      {/* Method Toggle */}
      <div className="flex gap-3 mb-8">
        {[
          { value: "avalanche", label: "⚡ Avalanche", desc: "Highest rate first — saves most interest" },
          { value: "snowball", label: "⛄ Snowball", desc: "Lowest balance first — wins faster" },
        ].map(m => (
          <button key={m.value} onClick={() => setMethod(m.value)}
            className={`flex-1 py-3 px-4 rounded-xl border-2 text-left transition ${
              method === m.value
                ? "border-primary bg-primary text-white"
                : "border-gray-200 dark:border-gray-700 hover:border-primary"
            }`}>
            <div className="font-bold text-sm">{m.label}</div>
            <div className={`text-xs mt-0.5 ${method === m.value ? "text-blue-100" : "text-gray-500"}`}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6 mb-6 text-center">
        <p className="text-blue-200 text-sm font-semibold mb-1">Debt-Free In</p>
        <p className="text-5xl font-bold mb-2">{monthsToYears(chosen.months)}</p>
        <p className="text-blue-200 text-sm">
          Total interest paid: <strong className="text-white">{fmt(chosen.totalInterest)}</strong> on {fmt(totalDebt)} of debt
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Months to Payoff",
            value: `${chosen.months} months`,
            sub: `vs ${other.months} mo ${method === "avalanche" ? "snowball" : "avalanche"}`,
            color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
          },
          {
            label: "Total Interest",
            value: fmt(chosen.totalInterest),
            sub: `You save ${fmt(Math.abs(chosen.totalInterest - other.totalInterest))} vs ${method === "avalanche" ? "snowball" : "avalanche"}`,
            color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
          },
          {
            label: "Interest Saved vs Min Only",
            value: fmt(Math.max(0, noExtra.totalInterest - chosen.totalInterest)),
            sub: `Paying ${fmt(extraPayment)} extra/month`,
            color: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
          },
        ].map(c => (
          <div key={c.label} className={`border-2 rounded-xl p-4 ${c.color}`}>
            <p className="text-xs font-semibold opacity-70">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
            <p className="text-xs opacity-70 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Payoff Timeline Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-6">
        <h2 className="text-lg font-bold mb-4">📉 Total Debt Balance Over Time</h2>
        <Line
          data={{
            labels: Array.from({ length: Math.min(chosen.months, 60) + 1 }, (_, i) =>
              i % 6 === 0 ? `Mo ${i}` : ""
            ),
            datasets: [
              {
                label: `${method === "avalanche" ? "Avalanche" : "Snowball"} Method`,
                data: [totalDebt, ...chosen.monthlyTotals.slice(0, 60)],
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.08)",
                fill: true,
                tension: 0.4,
              },
              {
                label: "Minimum Payments Only",
                data: [totalDebt, ...noExtra.monthlyTotals.slice(0, 60)],
                borderColor: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.05)",
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
            scales: {
              y: { ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` } }
            }
          }}
        />
      </div>

      {/* Priority Order */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-6">
        <h2 className="text-lg font-bold mb-4">🎯 Payoff Priority Order ({method === "avalanche" ? "Avalanche" : "Snowball"})</h2>
        <div className="space-y-2">
          {[...debts]
            .sort((a, b) => method === "avalanche" ? b.rate - a.rate : a.balance - b.balance)
            .map((d, i) => (
              <div key={d.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className="font-semibold">{d.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {fmt(d.balance)} @ {d.rate}%
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {method === "avalanche" ? `${d.rate}% APR (highest)` : `${fmt(d.balance)} (lowest balance)`}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-3">💡 Debt Payoff Tips</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>⚡ <strong>Avalanche</strong> saves the most money — tackle your highest-interest debt first (usually credit cards at 19.99%)</li>
          <li>⛄ <strong>Snowball</strong> keeps you motivated — quick wins on small balances build momentum</li>
          <li>✅ <strong>Balance transfer</strong> — move high-interest credit card debt to a 0% promo card to eliminate interest during the promo period</li>
          <li>✅ <strong>HELOC</strong> — if you own a home, a home equity line of credit typically offers rates well below credit cards</li>
          <li>✅ <strong>Tax refund + bonuses</strong> — put any lump sums straight toward your priority debt</li>
        </ul>
      </div>
    </section>
  );
}
