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
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const FAQS = [
  { q: "What is the avalanche method?", a: "The avalanche method sends extra money to the highest-interest debt first while maintaining minimum payments on all other debts. It usually minimizes total interest." },
  { q: "What is the snowball method?", a: "The snowball method sends extra money to the smallest balance first. It may cost more interest than avalanche, but some people prefer it for faster psychological wins." },
  { q: "Does this calculator use exact lender formulas?", a: "No. This page uses a simplified monthly interest model for planning. Real credit card, line of credit, and loan statements may differ." },
  { q: "Can I include extra monthly payments?", a: "Yes. The extra payment field applies additional monthly cash to the current priority debt after minimum payments are made." },
];

const fmt = (n) => n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

function calcPayoff(debts, extraPayment, method) {
  const sorted = [...debts.map((debt) => ({
    ...debt,
    balance: asNumber(debt.balance),
    rate: asNumber(debt.rate),
    minPayment: asNumber(debt.minPayment),
  }))].sort((a, b) =>
    method === "avalanche" ? b.rate - a.rate : a.balance - b.balance
  );

  let month = 0;
  let totalInterest = 0;
  const monthlyTotals = [];

  while (sorted.some((debt) => debt.balance > 0) && month < 600) {
    month += 1;
    let extra = extraPayment;

    for (const debt of sorted) {
      if (debt.balance <= 0) continue;
      const interest = (debt.balance * debt.rate) / 100 / 12;
      totalInterest += interest;
      debt.balance += interest;
      const payment = Math.min(debt.balance, debt.minPayment);
      debt.balance = Math.max(0, debt.balance - payment);
    }

    for (const debt of sorted) {
      if (debt.balance <= 0 || extra <= 0) continue;
      const payment = Math.min(debt.balance, extra);
      debt.balance = Math.max(0, debt.balance - payment);
      extra -= payment;
    }

    monthlyTotals.push(Math.round(sorted.reduce((sum, debt) => sum + debt.balance, 0)));
  }

  return { months: month, totalInterest: Math.round(totalInterest), monthlyTotals };
}

const defaultDebts = [
  { id: 1, name: "Credit Card", balance: 5000, rate: 19.99, minPayment: 100 },
  { id: 2, name: "Car Loan", balance: 12000, rate: 6.99, minPayment: 250 },
  { id: 3, name: "Line of Credit", balance: 8000, rate: 8.5, minPayment: 120 },
];

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState(defaultDebts);
  const [extraPayment, setExtraPayment] = useState(200);
  const [method, setMethod] = useState("avalanche");

  const avalanche = useMemo(() => calcPayoff(debts, extraPayment, "avalanche"), [debts, extraPayment]);
  const snowball = useMemo(() => calcPayoff(debts, extraPayment, "snowball"), [debts, extraPayment]);
  const chosen = method === "avalanche" ? avalanche : snowball;
  const other = method === "avalanche" ? snowball : avalanche;
  const noExtra = useMemo(() => calcPayoff(debts, 0, "avalanche"), [debts]);

  const totalDebt = debts.reduce((sum, debt) => sum + asNumber(debt.balance), 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + asNumber(debt.minPayment), 0);

  function addDebt() {
    setDebts((prev) => [...prev, { id: Date.now(), name: "New Debt", balance: 2000, rate: 10, minPayment: 50 }]);
  }

  function removeDebt(id) {
    setDebts((prev) => prev.filter((debt) => debt.id !== id));
  }

  function updateDebt(id, field, value) {
    setDebts((prev) => prev.map((debt) => (debt.id === id ? { ...debt, [field]: value } : debt)));
  }

  const monthsToYears = (months) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return years > 0 ? `${years}yr ${remainingMonths > 0 ? `${remainingMonths}mo` : ""}` : `${remainingMonths}mo`;
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <SEO
        title="Debt Payoff Calculator Canada - Avalanche vs Snowball"
        description="Compare debt payoff strategies in Canada. Model avalanche vs snowball, extra monthly payments, payoff time, and total interest."
      />
      <ToolPageSchema
        name="Debt Payoff Calculator Canada"
        description="Debt payoff calculator comparing avalanche and snowball repayment strategies, extra monthly payments, payoff timing, and interest."
        canonical="https://easyfinancetools.com/tools/debt-payoff-calculator"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-accent">Debt Payoff Calculator</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Compare avalanche and snowball repayment strategies to find a practical path to becoming debt-free.
        </p>
      </div>

      <div className="mb-6 space-y-3">
        {debts.map((debt) => (
          <div key={debt.id} className="rounded-xl border-2 border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Debt Name</label>
                <input
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Balance ($)</label>
                <input
                  type="number"
                  value={debt.balance}
                  onChange={(e) => updateDebt(debt.id, "balance", parseNumericInput(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={debt.rate}
                  onChange={(e) => updateDebt(debt.id, "rate", parseNumericInput(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-semibold text-gray-500">Min Payment ($)</label>
                  <input
                    type="number"
                    value={debt.minPayment}
                    onChange={(e) => updateDebt(debt.id, "minPayment", parseNumericInput(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                {debts.length > 1 && (
                  <button onClick={() => removeDebt(debt.id)} className="mb-0.5 self-end px-2 py-2 text-sm text-red-400 transition hover:text-red-600">
                    x
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addDebt}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm text-gray-500 transition hover:border-primary hover:text-primary dark:border-gray-600"
        >
          + Add Another Debt
        </button>
      </div>

      <div className="mb-6 rounded-xl border-2 border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-2 flex justify-between">
          <label className="text-sm font-semibold">Extra Monthly Payment</label>
          <span className="font-bold text-primary">{fmt(extraPayment)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={2000}
          step={25}
          value={extraPayment}
          onChange={(e) => setExtraPayment(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>$0</span>
          <span>$2,000 extra</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Total monthly payment: <strong>{fmt(totalMinPayment + extraPayment)}</strong>
          {extraPayment > 0 && (
            <span className="ml-2 text-green-600">
              This extra payment saves {monthsToYears(Math.max(0, noExtra.months - chosen.months))} and {fmt(Math.max(0, noExtra.totalInterest - chosen.totalInterest))} in this simplified model.
            </span>
          )}
        </p>
      </div>

      <div className="mb-8 flex gap-3">
        {[
          { value: "avalanche", label: "Avalanche", desc: "Highest rate first to minimize interest" },
          { value: "snowball", label: "Snowball", desc: "Smallest balance first for faster wins" },
        ].map((entry) => (
          <button
            key={entry.value}
            onClick={() => setMethod(entry.value)}
            className={`flex-1 rounded-xl border-2 px-4 py-3 text-left transition ${
              method === entry.value ? "border-primary bg-primary text-white" : "border-gray-200 hover:border-primary dark:border-gray-700"
            }`}
          >
            <div className="text-sm font-bold">{entry.label}</div>
            <div className={`mt-0.5 text-xs ${method === entry.value ? "text-blue-100" : "text-gray-500"}`}>{entry.desc}</div>
          </button>
        ))}
      </div>

      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center text-white">
        <p className="mb-1 text-sm font-semibold text-blue-200">Debt-Free In</p>
        <p className="mb-2 text-5xl font-bold">{monthsToYears(chosen.months)}</p>
        <p className="text-sm text-blue-200">
          Total interest paid: <strong className="text-white">{fmt(chosen.totalInterest)}</strong> on {fmt(totalDebt)} of debt
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Months to Payoff",
            value: `${chosen.months} months`,
            sub: `vs ${other.months} months with ${method === "avalanche" ? "snowball" : "avalanche"}`,
            color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
          },
          {
            label: "Total Interest",
            value: fmt(chosen.totalInterest),
            sub: `Difference vs ${method === "avalanche" ? "snowball" : "avalanche"}: ${fmt(Math.abs(chosen.totalInterest - other.totalInterest))}`,
            color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
          },
          {
            label: "Saved vs Min Only",
            value: fmt(Math.max(0, noExtra.totalInterest - chosen.totalInterest)),
            sub: `Extra payment: ${fmt(extraPayment)}/month`,
            color: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
          },
        ].map((card) => (
          <div key={card.label} className={`rounded-xl border-2 p-4 ${card.color}`}>
            <p className="text-xs font-semibold opacity-70">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs opacity-70">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">Total Debt Balance Over Time</h2>
        <Line
          data={{
            labels: Array.from({ length: Math.min(chosen.months, 60) + 1 }, (_, i) => (i % 6 === 0 ? `Mo ${i}` : "")),
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
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
            scales: { y: { ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } } },
          }}
        />
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">Payoff Priority Order ({method === "avalanche" ? "Avalanche" : "Snowball"})</h2>
        <div className="space-y-2">
          {[...debts]
            .sort((a, b) => (method === "avalanche" ? b.rate - a.rate : a.balance - b.balance))
            .map((debt, index) => (
              <div key={debt.id} className="flex items-center gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <span className="font-semibold">{debt.name}</span>
                  <span className="ml-2 text-sm text-gray-500">{fmt(debt.balance)} @ {debt.rate}%</span>
                </div>
                <div className="text-xs text-gray-400">
                  {method === "avalanche" ? `${debt.rate}% APR` : `${fmt(debt.balance)} balance`}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-bold">Debt Payoff Tips</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li><strong>Avalanche</strong> usually saves the most money by attacking the highest-rate debt first.</li>
          <li><strong>Snowball</strong> can be easier to stick with if early balance wins keep you motivated.</li>
          <li><strong>Balance transfers</strong> may reduce interest, but fees and promo expiry dates matter.</li>
          <li><strong>Lump sums</strong> from refunds or bonuses can accelerate the plan materially.</li>
          <li><strong>Do not ignore minimums</strong> on non-priority debts while targeting the current focus balance.</li>
        </ul>
      </div>

      <MethodologyPanel
        title="How this debt payoff calculator works"
        summary="This calculator applies monthly interest to each debt, makes the required minimum payments, and then applies any extra payment to the current priority debt under either avalanche or snowball ordering."
        assumptions={[
          "Interest is modeled monthly using a simple annual-rate-to-monthly-rate conversion.",
          "Minimum payments are assumed to remain constant rather than changing with lender formulas.",
          "The avalanche method prioritizes the highest rate first; the snowball method prioritizes the smallest balance first.",
          "This tool does not model fees, changing rates, missed payments, or promotional financing expiries.",
        ]}
        sources={[
          { label: "FCAC: Debt repayment strategies", href: "https://www.canada.ca/en/financial-consumer-agency/services/debt.html" },
        ]}
        note="Educational estimate only. Confirm balances, rates, and lender payment rules using your actual statements."
      />

      <FAQ items={FAQS} />
    </section>
  );
}
