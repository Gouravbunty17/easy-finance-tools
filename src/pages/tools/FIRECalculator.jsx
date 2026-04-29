import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

const fmt = (n) => "$" + Math.round(Number(n || 0)).toLocaleString("en-CA");
const fmtK = (n) => {
  const value = Number(n || 0);
  return value >= 1000000 ? `$${(value / 1000000).toFixed(2)}M` : `$${(value / 1000).toFixed(0)}K`;
};

function SliderInput({ label, value, min, max, step = 1, onChange, format, note }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-bold text-secondary">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(step < 1 ? parseFloat(event.target.value) : Number(event.target.value))}
        className="w-full accent-secondary"
      />
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{format ? format(min) : min}</span>
        {note ? <span className="text-center italic text-gray-500">{note}</span> : null}
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

const FIRE_TYPES = [
  { id: "lean", label: "Lean FIRE", desc: "Lower-spending retirement target", multiplier: 0.75 },
  { id: "regular", label: "Regular FIRE", desc: "Middle-ground retirement target", multiplier: 1.0 },
  { id: "fat", label: "Fat FIRE", desc: "Higher-spending retirement target", multiplier: 1.5 },
  { id: "barista", label: "Barista FIRE", desc: "Part-time income before 65", multiplier: 1.0 },
];

const FAQS = [
  {
    q: "What does FIRE mean?",
    a: "FIRE means Financial Independence, Retire Early. The goal is to estimate the portfolio size needed to cover expenses before traditional retirement age.",
  },
  {
    q: "Is the 4% rule safe for early retirement in Canada?",
    a: "It is a rule of thumb, not a guarantee. Longer retirements, fees, taxes, inflation, and market sequence risk may require a lower withdrawal rate.",
  },
  {
    q: "Why include CPP and OAS in a FIRE calculator?",
    a: "CPP and OAS can reduce the portfolio withdrawals needed after age 65, but the amounts depend on official records and future program rules.",
  },
  {
    q: "Should FIRE savings go in a TFSA or RRSP?",
    a: "Many Canadians use both. TFSA withdrawals are flexible, while RRSP contributions can be useful in higher-income years. The right mix depends on income, tax rate, and retirement timing.",
  },
  {
    q: "Does this calculator replace retirement planning advice?",
    a: "No. It is a planning estimate. Tax, pension, insurance, healthcare, housing, and investment-risk decisions should be reviewed carefully.",
  },
];

export default function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [targetRetireAge, setTargetRetireAge] = useState(50);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [annualIncome, setAnnualIncome] = useState(80000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [returnRate, setReturnRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [cppMonthly, setCppMonthly] = useState(800);
  const [oasMonthly, setOasMonthly] = useState(762);
  const [partTimeIncome, setPartTimeIncome] = useState(0);
  const [fireType, setFireType] = useState("regular");

  const calc = useMemo(() => {
    const selectedType = FIRE_TYPES.find((type) => type.id === fireType) || FIRE_TYPES[1];
    const safeCurrentAge = Number(currentAge || 0);
    const safeRetireAge = Math.max(safeCurrentAge + 1, Number(targetRetireAge || safeCurrentAge + 1));
    const safeWithdrawalRate = Math.max(0.1, Number(withdrawalRate || 4));
    const adjustedExpenses = Number(annualExpenses || 0) * selectedType.multiplier;
    const annualCPP = Number(cppMonthly || 0) * 12;
    const annualOAS = Number(oasMonthly || 0) * 12;
    const annualPartTime = Number(partTimeIncome || 0) * 12;
    const realReturn = (1 + Number(returnRate || 0) / 100) / (1 + Number(inflationRate || 0) / 100) - 1;
    const fireNumber = adjustedExpenses / (safeWithdrawalRate / 100);
    const yearsToRetire = safeRetireAge - safeCurrentAge;
    const annualSavings = Number(annualIncome || 0) - Number(annualExpenses || 0);

    let portfolio = Number(currentSavings || 0);
    const accumulationData = [{ age: safeCurrentAge, value: Math.round(portfolio), year: 0 }];

    for (let year = 1; year <= yearsToRetire; year += 1) {
      portfolio = portfolio * (1 + realReturn) + annualSavings;
      accumulationData.push({ age: safeCurrentAge + year, value: Math.round(portfolio), year });
    }

    const portfolioAtRetirement = portfolio;
    const achievesFIRE = portfolioAtRetirement >= fireNumber;

    let fireAge = null;
    let projectedPortfolio = Number(currentSavings || 0);
    for (let year = 1; year <= 50; year += 1) {
      projectedPortfolio = projectedPortfolio * (1 + realReturn) + annualSavings;
      if (projectedPortfolio >= fireNumber && fireAge === null) {
        fireAge = safeCurrentAge + year;
      }
    }

    const drawdownData = [];
    let drawPortfolio = portfolioAtRetirement;
    let ranOut = false;
    let ranOutAge = null;

    for (let year = 0; year <= 95 - safeRetireAge; year += 1) {
      const age = safeRetireAge + year;
      const cpp = age >= 65 ? annualCPP : 0;
      const oas = age >= 65 ? annualOAS : 0;
      const partTime = fireType === "barista" && age < 65 ? annualPartTime : 0;
      const netWithdrawal = Math.max(0, adjustedExpenses - cpp - oas - partTime);

      drawPortfolio = drawPortfolio * (1 + realReturn) - netWithdrawal;
      if (drawPortfolio <= 0 && !ranOut) {
        ranOut = true;
        ranOutAge = age;
        drawPortfolio = 0;
      }
      drawdownData.push({ age, value: Math.round(drawPortfolio), year });
    }

    const savingsRate = Number(annualIncome || 0) > 0 ? ((Number(annualIncome || 0) - Number(annualExpenses || 0)) / Number(annualIncome || 0)) * 100 : 0;
    const surplus = portfolioAtRetirement - fireNumber;
    const surplusPct = fireNumber > 0 ? (surplus / fireNumber) * 100 : 0;
    const monthlyWithdrawal = (portfolioAtRetirement * safeWithdrawalRate / 100) / 12;
    const monthlyGovBenefits = safeRetireAge >= 65 ? Number(cppMonthly || 0) + Number(oasMonthly || 0) : 0;
    const totalMonthlyIncome = monthlyWithdrawal + monthlyGovBenefits + (fireType === "barista" ? Number(partTimeIncome || 0) : 0);

    return {
      fireNumber,
      portfolioAtRetirement,
      achievesFIRE,
      fireAge,
      yearsToRetire,
      targetAgeUsed: safeRetireAge,
      accumulationData,
      drawdownData,
      savingsRate,
      surplus,
      surplusPct,
      ranOut,
      ranOutAge,
      monthlyWithdrawal,
      monthlyGovBenefits,
      totalMonthlyIncome,
      adjustedExpenses,
      annualSavings,
      realReturn: (realReturn * 100).toFixed(2),
    };
  }, [currentAge, targetRetireAge, currentSavings, annualIncome, annualExpenses, returnRate, inflationRate, withdrawalRate, cppMonthly, oasMonthly, partTimeIncome, fireType]);

  const allChartData = [...calc.accumulationData, ...calc.drawdownData.slice(1)];
  const fireNumberLine = allChartData.map(() => calc.fireNumber);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <SEO
        title="FIRE Calculator Canada 2026 | Financial Independence Number"
        description="Estimate your Canadian FIRE number, retirement age, savings rate, withdrawal rate, CPP, OAS, inflation, and portfolio drawdown scenarios."
        canonical="https://easyfinancetools.com/tools/fire-calculator"
      />
      <ToolPageSchema
        name="FIRE Calculator Canada 2026"
        description="Canadian financial independence calculator covering FIRE number, retirement date, savings rate, CPP, OAS, inflation, and drawdown scenarios."
        canonical="https://easyfinancetools.com/tools/fire-calculator"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-accent">FIRE Calculator Canada</h1>
        <p className="max-w-3xl text-gray-600 dark:text-gray-300">
          Estimate the portfolio size, savings rate, and retirement-age tradeoffs behind a Canadian Financial Independence, Retire Early plan. This calculator includes CPP, OAS, inflation, and part-time income assumptions, but it does not promise that a retirement plan is safe.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {FIRE_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setFireType(type.id)}
            className={`rounded-xl border-2 p-3 text-left transition-all ${
              fireType === type.id
                ? "border-secondary bg-secondary/10 dark:bg-secondary/20"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
            }`}
          >
            <p className="text-sm font-bold">{type.label}</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{type.desc}</p>
            {type.multiplier !== 1 ? (
              <p className="mt-1 text-xs font-semibold text-secondary">{type.multiplier}x expenses</p>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`rounded-xl border-2 p-6 text-center ${calc.achievesFIRE ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20" : "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20"}`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Your FIRE number</p>
          <p className="text-3xl font-black text-primary dark:text-accent">{fmtK(calc.fireNumber)}</p>
          <p className="mt-1 text-xs text-gray-500">{withdrawalRate}% withdrawal rate x {fmt(calc.adjustedExpenses)}/yr</p>
        </div>

        <div className={`rounded-xl border-2 p-6 text-center ${calc.achievesFIRE ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20" : "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20"}`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Portfolio at retirement</p>
          <p className="text-3xl font-black text-primary dark:text-accent">{fmtK(calc.portfolioAtRetirement)}</p>
          <p className={`mt-1 text-xs font-semibold ${calc.achievesFIRE ? "text-green-600" : "text-orange-500"}`}>
            {calc.achievesFIRE ? `${calc.surplusPct.toFixed(0)}% above target` : `${Math.abs(calc.surplusPct).toFixed(0)}% below target`}
          </p>
        </div>

        <div className={`rounded-xl border-2 p-6 text-center ${!calc.ranOut ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20" : "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"}`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Portfolio lasts until</p>
          <p className="text-3xl font-black text-primary dark:text-accent">{calc.ranOut ? `Age ${calc.ranOutAge}` : "Age 95+"}</p>
          <p className={`mt-1 text-xs font-semibold ${!calc.ranOut ? "text-green-600" : "text-red-500"}`}>
            {!calc.ranOut ? "Modeled through age 95" : "Shortfall detected"}
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-5 rounded-xl border border-gray-100 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Your Numbers</h2>

          <SliderInput label="Current age" value={currentAge} min={18} max={60} onChange={setCurrentAge} format={(v) => `${v} yrs`} />
          <SliderInput label="Target retirement age" value={targetRetireAge} min={Math.min(currentAge + 1, 70)} max={70} onChange={setTargetRetireAge} format={(v) => `${v} yrs`} />
          <SliderInput label="Current savings and investments" value={currentSavings} min={0} max={2000000} step={5000} onChange={setCurrentSavings} format={fmtK} />
          <SliderInput label="Annual income after tax" value={annualIncome} min={30000} max={300000} step={5000} onChange={setAnnualIncome} format={(n) => `$${(n / 1000).toFixed(0)}k`} />
          <SliderInput label="Annual expenses" value={annualExpenses} min={20000} max={200000} step={2000} onChange={setAnnualExpenses} format={(n) => `$${(n / 1000).toFixed(0)}k`} />
          <SliderInput label="Expected annual return" value={returnRate} min={1} max={12} step={0.5} onChange={setReturnRate} format={(v) => `${v}%`} />
          <SliderInput label="Inflation rate" value={inflationRate} min={1} max={6} step={0.5} onChange={setInflationRate} format={(v) => `${v}%`} />
          <SliderInput label="Withdrawal rate" value={withdrawalRate} min={2} max={6} step={0.25} onChange={setWithdrawalRate} format={(v) => `${v}%`} note="4% is a common rule of thumb" />

          <div className="border-t pt-4 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">Canadian government benefits at 65</h3>
            <div className="space-y-4">
              <SliderInput label="CPP monthly estimate" value={cppMonthly} min={0} max={1433} step={50} onChange={setCppMonthly} format={(v) => `$${v}/mo`} />
              <SliderInput label="OAS monthly estimate" value={oasMonthly} min={0} max={900} step={25} onChange={setOasMonthly} format={(v) => `$${v}/mo`} />
            </div>
          </div>

          {fireType === "barista" ? (
            <div className="border-t pt-4 dark:border-gray-700">
              <SliderInput label="Part-time monthly income" value={partTimeIncome} min={0} max={5000} step={100} onChange={setPartTimeIncome} format={(v) => `$${v}/mo`} />
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className={`rounded-xl border-2 p-5 ${calc.savingsRate >= 50 ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20" : calc.savingsRate >= 30 ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20" : "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20"}`}>
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Savings rate</p>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-black text-primary dark:text-accent">{calc.savingsRate.toFixed(1)}%</p>
              <div className="pb-1 text-sm text-gray-500">
                {calc.savingsRate >= 50 ? "Very aggressive savings pace" : calc.savingsRate >= 30 ? "Strong savings pace" : "Lower savings pace"}
              </div>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/50 dark:bg-gray-700">
              <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${Math.min(Math.max(calc.savingsRate, 0), 100)}%` }} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">Monthly income at retirement</h3>
            <div className="space-y-2">
              {[
                { label: "Portfolio withdrawal", value: calc.monthlyWithdrawal, color: "bg-blue-500" },
                { label: "CPP + OAS from 65", value: calc.monthlyGovBenefits, color: "bg-green-500" },
                ...(fireType === "barista" ? [{ label: "Part-time income", value: partTimeIncome, color: "bg-yellow-500" }] : []),
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                  </div>
                  <span className="font-bold">{fmt(item.value)}/mo</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 dark:border-gray-700">
                <span className="font-bold">Total monthly</span>
                <span className="text-lg font-black text-green-600 dark:text-green-400">{fmt(calc.totalMonthlyIncome)}/mo</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Calculation details</p>
            <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <li>Real return after inflation: <strong>{calc.realReturn}%</strong></li>
              <li>Annual savings: <strong>{fmt(calc.annualSavings)}</strong></li>
              <li>Years to target retirement: <strong>{calc.yearsToRetire} yrs</strong></li>
              {!calc.achievesFIRE && calc.fireAge ? (
                <li className="font-semibold text-orange-600 dark:text-orange-400">
                  In this model, the FIRE number is reached around age {calc.fireAge}.
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">Portfolio Value: Accumulation to Drawdown</h2>
        <Line
          data={{
            labels: allChartData.map((entry) => `Age ${entry.age}`),
            datasets: [
              {
                label: "Portfolio",
                data: allChartData.map((entry) => entry.value),
                fill: true,
                backgroundColor: "rgba(0,168,232,0.1)",
                borderColor: "#00A8E8",
                tension: 0.3,
                pointRadius: 0,
              },
              {
                label: "FIRE number",
                data: fireNumberLine,
                borderColor: "#ef4444",
                borderDash: [6, 4],
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: $${Math.round(ctx.raw).toLocaleString("en-CA")}` } },
            },
            scales: {
              y: { ticks: { callback: (value) => fmtK(value) }, min: 0 },
              x: { ticks: { maxTicksLimit: 15 } },
            },
          }}
        />
        <p className="mt-2 text-xs text-gray-400">Red dashed line = your FIRE number. Chart values are modeled in real, inflation-adjusted terms.</p>
      </div>

      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">FIRE Scenarios at Your Savings Rate</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="py-2 pr-4 text-left font-semibold">Scenario</th>
                <th className="py-2 pr-4 text-right font-semibold">Annual expenses</th>
                <th className="py-2 pr-4 text-right font-semibold">FIRE number</th>
                <th className="py-2 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {FIRE_TYPES.map((type) => {
                const expenses = annualExpenses * type.multiplier;
                const fireNumber = expenses / (withdrawalRate / 100);
                const achieved = calc.portfolioAtRetirement >= fireNumber;
                return (
                  <tr key={type.id} className={`border-b dark:border-gray-700 ${type.id === fireType ? "bg-secondary/5 dark:bg-secondary/10" : ""}`}>
                    <td className="py-3 pr-4">
                      <span className="font-bold">{type.label}</span>
                      {type.id === fireType ? <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-xs text-white">selected</span> : null}
                      <p className="text-xs text-gray-400">{type.desc}</p>
                    </td>
                    <td className="py-3 pr-4 text-right">{fmt(expenses)}/yr</td>
                    <td className="py-3 pr-4 text-right font-bold">{fmtK(fireNumber)}</td>
                    <td className="py-3 text-right">
                      <span className={`text-xs font-semibold ${achieved ? "text-green-600 dark:text-green-400" : "text-orange-500"}`}>
                        {achieved ? "Modeled target reached" : `Need ${fmtK(fireNumber - calc.portfolioAtRetirement)} more`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What this calculator does</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Estimate your financial independence number</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The calculator estimates a FIRE number from annual expenses and withdrawal rate, then projects how current savings and annual savings may grow before retirement. It also models portfolio withdrawals, CPP, OAS, and optional part-time income during drawdown.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use it</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Start with spending, then stress-test assumptions</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Enter current age, target retirement age, current investments, annual income, annual expenses, return, inflation, withdrawal rate, and government-benefit estimates. Then test Lean, Regular, Fat, and Barista FIRE scenarios to see which assumptions drive the result.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Inputs explained</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What changes the FIRE number</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Annual expenses", "The spending target used to estimate the portfolio required for retirement."],
            ["Withdrawal rate", "The percent of portfolio modeled as annual retirement income."],
            ["Return and inflation", "Used together to estimate real, inflation-adjusted growth."],
            ["CPP, OAS, and part-time income", "Modeled as income that can reduce portfolio withdrawals after certain ages."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="font-bold text-primary dark:text-accent">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Example calculation</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Example: current FIRE estimate</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            With annual expenses of {fmt(annualExpenses)}, a {withdrawalRate}% withdrawal rate, and the selected FIRE style, the estimated FIRE number is {fmtK(calc.fireNumber)}. The model projects {fmtK(calc.portfolioAtRetirement)} by age {calc.targetAgeUsed} under the current savings and return assumptions.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to read your result</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Focus on assumptions, not one perfect number</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            FIRE planning is sensitive to expenses, inflation, returns, taxes, fees, and withdrawal rate. Compare this result with the <Link to="/tools/compound-interest-calculator" className="text-primary underline dark:text-secondary">compound interest calculator</Link>, <Link to="/tools/rrsp-calculator" className="text-primary underline dark:text-secondary">RRSP calculator</Link>, and <Link to="/tools/cpp-oas-estimator" className="text-primary underline dark:text-secondary">CPP/OAS estimator</Link> before drawing conclusions.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Small assumption errors can move the retirement date</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <li>- Using a high return assumption without considering fees, taxes, and sequence-of-returns risk.</li>
          <li>- Treating CPP and OAS estimates as official amounts instead of checking Service Canada records.</li>
          <li>- Forgetting healthcare, insurance, housing repairs, taxes, and one-time expenses in retirement spending.</li>
          <li>- Assuming the same withdrawal rate is suitable for a 30-year and a 50-year retirement.</li>
        </ul>
      </section>

      <MethodologyPanel
        title="Methodology and assumptions"
        summary="The calculator estimates a FIRE number from expenses and withdrawal rate, projects accumulation with real returns, then models drawdown to age 95 with CPP, OAS, and optional part-time income offsets."
        assumptions={[
          "Return is converted into an inflation-adjusted real return before projections.",
          "Annual savings are modeled as after-tax income minus annual expenses.",
          "CPP and OAS are modeled as fixed monthly benefits starting at age 65 when applicable.",
          "Taxes, fees, market volatility, sequence risk, changing spending, and account withdrawal rules are simplified.",
        ]}
        sources={[
          { label: "Government of Canada: CPP", href: "https://www.canada.ca/en/services/benefits/publicpensions/cpp.html" },
          { label: "Government of Canada: OAS", href: "https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html" },
          { label: "EasyFinanceTools methodology", href: "https://easyfinancetools.com/methodology" },
        ]}
        note="Educational estimate only. Confirm retirement assumptions with official records and a qualified professional before making major decisions."
      />

      <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related tools and guides</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/tools" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">All calculators</Link>
          <Link to="/tools/compound-interest-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Compound interest calculator</Link>
          <Link to="/tools/rrsp-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">RRSP calculator</Link>
          <Link to="/tools/tfsa-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA calculator</Link>
          <Link to="/blog/tfsa-vs-rrsp-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA vs RRSP guide</Link>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Disclaimer</p>
        <p className="mt-3 text-sm leading-7 text-amber-800 dark:text-amber-200">
          This calculator is for educational planning only. It does not account for every tax rule, investment fee, pension decision, insurance need, healthcare cost, housing cost, or personal risk tolerance factor.
        </p>
      </section>

      <FAQ items={FAQS} />
    </section>
  );
}
