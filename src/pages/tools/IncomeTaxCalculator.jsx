import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";

const PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland & Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

// 2026 Federal brackets (estimated with ~1.5% inflation indexing from 2025)
const FEDERAL = {
  brackets: [
    { min: 0,       max: 57375,  rate: 0.15 },
    { min: 57375,   max: 114750, rate: 0.205 },
    { min: 114750,  max: 158519, rate: 0.26 },
    { min: 158519,  max: 220000, rate: 0.29 },
    { min: 220000,  max: Infinity, rate: 0.33 },
  ],
  basicPersonal: 16129,
};

// 2026 Provincial brackets (estimated)
const PROVINCIAL = {
  AB: { brackets: [{ min: 0, max: 148269, rate: 0.10 }, { min: 148269, max: 177922, rate: 0.12 }, { min: 177922, max: 237230, rate: 0.13 }, { min: 237230, max: 355845, rate: 0.14 }, { min: 355845, max: Infinity, rate: 0.15 }], basicPersonal: 21003 },
  BC: { brackets: [{ min: 0, max: 45654, rate: 0.0506 }, { min: 45654, max: 91310, rate: 0.077 }, { min: 91310, max: 104835, rate: 0.105 }, { min: 104835, max: 127299, rate: 0.1229 }, { min: 127299, max: 172602, rate: 0.147 }, { min: 172602, max: 240716, rate: 0.168 }, { min: 240716, max: Infinity, rate: 0.205 }], basicPersonal: 11981 },
  MB: { brackets: [{ min: 0, max: 47000, rate: 0.108 }, { min: 47000, max: 100000, rate: 0.1275 }, { min: 100000, max: Infinity, rate: 0.174 }], basicPersonal: 15780 },
  NB: { brackets: [{ min: 0, max: 47715, rate: 0.094 }, { min: 47715, max: 95431, rate: 0.14 }, { min: 95431, max: 176756, rate: 0.16 }, { min: 176756, max: Infinity, rate: 0.195 }], basicPersonal: 12458 },
  NL: { brackets: [{ min: 0, max: 43198, rate: 0.087 }, { min: 43198, max: 86395, rate: 0.145 }, { min: 86395, max: 154244, rate: 0.158 }, { min: 154244, max: 215943, rate: 0.178 }, { min: 215943, max: 275870, rate: 0.198 }, { min: 275870, max: 551739, rate: 0.208 }, { min: 551739, max: Infinity, rate: 0.213 }], basicPersonal: 10818 },
  NS: { brackets: [{ min: 0, max: 29590, rate: 0.0879 }, { min: 29590, max: 59180, rate: 0.1495 }, { min: 59180, max: 93000, rate: 0.1667 }, { min: 93000, max: 150000, rate: 0.175 }, { min: 150000, max: Infinity, rate: 0.21 }], basicPersonal: 8481 },
  NT: { brackets: [{ min: 0, max: 50597, rate: 0.059 }, { min: 50597, max: 101198, rate: 0.086 }, { min: 101198, max: 164525, rate: 0.122 }, { min: 164525, max: Infinity, rate: 0.1405 }], basicPersonal: 16593 },
  NU: { brackets: [{ min: 0, max: 53268, rate: 0.04 }, { min: 53268, max: 106537, rate: 0.07 }, { min: 106537, max: 173205, rate: 0.09 }, { min: 173205, max: Infinity, rate: 0.115 }], basicPersonal: 17925 },
  ON: { brackets: [{ min: 0, max: 51446, rate: 0.0505 }, { min: 51446, max: 102894, rate: 0.0915 }, { min: 102894, max: 150000, rate: 0.1116 }, { min: 150000, max: 220000, rate: 0.1216 }, { min: 220000, max: Infinity, rate: 0.1316 }], basicPersonal: 11865, surtaxThreshold1: 6130, surtaxThreshold2: 7852 },
  PE: { brackets: [{ min: 0, max: 32656, rate: 0.0965 }, { min: 32656, max: 64313, rate: 0.1363 }, { min: 64313, max: 105000, rate: 0.166 }, { min: 105000, max: 140000, rate: 0.18 }, { min: 140000, max: Infinity, rate: 0.167 }], basicPersonal: 12000 },
  QC: { brackets: [{ min: 0, max: 53255, rate: 0.14 }, { min: 53255, max: 106495, rate: 0.19 }, { min: 106495, max: 129590, rate: 0.24 }, { min: 129590, max: Infinity, rate: 0.2575 }], basicPersonal: 17183 },
  SK: { brackets: [{ min: 0, max: 49720, rate: 0.105 }, { min: 49720, max: 142058, rate: 0.125 }, { min: 142058, max: Infinity, rate: 0.145 }], basicPersonal: 17661 },
  YT: { brackets: [{ min: 0, max: 57375, rate: 0.064 }, { min: 57375, max: 114750, rate: 0.09 }, { min: 114750, max: 500000, rate: 0.109 }, { min: 500000, max: Infinity, rate: 0.15 }], basicPersonal: 15705 },
};

function calcTax(income, brackets, basicPersonal) {
  let tax = 0;
  for (const b of brackets) {
    if (income <= b.min) break;
    const taxable = Math.min(income, b.max) - b.min;
    tax += taxable * b.rate;
  }
  // Basic personal amount credit (non-refundable at lowest bracket rate)
  const credit = basicPersonal * brackets[0].rate;
  return Math.max(0, tax - credit);
}

function calcCPP(income) {
  const exemption = 3500;
  const ceiling = 71300;
  const rate = 0.0595;
  const ceiling2 = 81900;
  const rate2 = 0.04;
  const base = Math.max(0, Math.min(income, ceiling) - exemption) * rate;
  const enhanced = Math.max(0, Math.min(income, ceiling2) - ceiling) * rate2;
  return Math.min(base + enhanced, 4454.10);
}

function calcEI(income) {
  const rate = 0.0164;
  const max = 63200;
  return Math.min(income, max) * rate;
}

function fmt(n) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
}

function pct(n) {
  return (n * 100).toFixed(1) + "%";
}

const faqs = [
  { q: "How accurate is this Canadian income tax calculator?", a: "This calculator uses 2026 estimated federal and provincial tax brackets, indexed for inflation from 2025 values. It provides a close approximation for employment income. It does not account for all deductions, credits, or special circumstances. Consult a tax professional for precise calculations." },
  { q: "Does this calculator include CPP and EI deductions?", a: "Yes, the calculator includes estimated CPP (Canada Pension Plan) contributions and EI (Employment Insurance) premiums for 2026, based on the rates and maximum insurable earnings applicable to employees." },
  { q: "What is the difference between marginal and effective tax rate?", a: "Your marginal rate is the rate applied to your next dollar of income — it's the rate at the top of your bracket. Your effective (average) rate is your total tax divided by total income. A common misconception is that a raise will put you in a higher bracket and leave you with less money — this is false. The higher rate only applies to the incremental income above the threshold." },
  { q: "Does the calculator work for self-employed income?", a: "The tax brackets are the same for self-employed income, but self-employed Canadians pay both the employer and employee portions of CPP (11.9% vs 5.95%). Toggle the 'Self-employed' option to see adjusted CPP deductions." },
  { q: "What about RRSP deductions?", a: "Enter your RRSP contributions in the RRSP deduction field. Each dollar of RRSP contribution reduces your taxable income before tax is calculated, saving you at your marginal rate." },
];

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(85000);
  const [province, setProvince] = useState("ON");
  const [rrsp, setRrsp] = useState(0);
  const [selfEmployed, setSelfEmployed] = useState(false);

  const results = useMemo(() => {
    const taxableIncome = Math.max(0, income - rrsp);
    const prov = PROVINCIAL[province];

    const federalTax = calcTax(taxableIncome, FEDERAL.brackets, FEDERAL.basicPersonal);
    const provTax = calcTax(taxableIncome, prov.brackets, prov.basicPersonal);
    const cpp = selfEmployed ? Math.min(calcCPP(income) * 2, 8068.20) : calcCPP(income);
    const ei = selfEmployed ? 0 : calcEI(income);
    const totalDeductions = federalTax + provTax + cpp + ei;
    const takeHome = income - totalDeductions;
    const effectiveRate = income > 0 ? totalDeductions / income : 0;

    // Find marginal federal rate
    let marginalFederal = 0.15;
    for (const b of FEDERAL.brackets) {
      if (taxableIncome > b.min) marginalFederal = b.rate;
    }
    let marginalProv = prov.brackets[0].rate;
    for (const b of prov.brackets) {
      if (taxableIncome > b.min) marginalProv = b.rate;
    }
    const marginalCombined = marginalFederal + marginalProv;

    return { federalTax, provTax, cpp, ei, totalDeductions, takeHome, effectiveRate, marginalFederal, marginalProv, marginalCombined, taxableIncome };
  }, [income, province, rrsp, selfEmployed]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Canadian Income Tax Calculator 2026 — All Provinces"
        description="Free 2026 Canadian income tax calculator. Calculate your federal + provincial income tax, CPP, EI, take-home pay, and marginal vs effective tax rate for any province."
        canonical="https://easyfinancetools.com/tools/income-tax-calculator"
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-3">
          Canadian Income Tax Calculator 2026
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Calculate your exact take-home pay after federal tax, provincial tax, CPP, and EI — for any province in Canada.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-5">
          <h2 className="text-xl font-bold text-primary dark:text-accent">Your Income Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Annual Employment Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                type="number"
                className="w-full pl-8 pr-4 py-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 text-lg font-semibold"
                value={income}
                onChange={e => setIncome(Number(e.target.value) || 0)}
                min={0}
                max={2000000}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Province / Territory</label>
            <select
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600"
              value={province}
              onChange={e => setProvince(e.target.value)}
            >
              {PROVINCES.map(p => (
                <option key={p.code} value={p.code}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">RRSP Contribution (reduces taxable income)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                type="number"
                className="w-full pl-8 pr-4 py-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600"
                value={rrsp}
                onChange={e => setRrsp(Number(e.target.value) || 0)}
                min={0}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="selfEmployed"
              checked={selfEmployed}
              onChange={e => setSelfEmployed(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <label htmlFor="selfEmployed" className="text-sm font-medium cursor-pointer">
              Self-employed (no EI; double CPP)
            </label>
          </div>

          <div className="pt-2 border-t dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            <p>Using estimated 2026 tax brackets. Results are approximate.</p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Take-home banner */}
          <div className="bg-primary text-white rounded-2xl p-6 text-center shadow">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80 mb-1">Annual Take-Home Pay</p>
            <p className="text-5xl font-bold">{fmt(results.takeHome)}</p>
            <p className="text-sm opacity-70 mt-2">
              {fmt(Math.round(results.takeHome / 12))}/month · {fmt(Math.round(results.takeHome / 26))}/biweekly
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-3">
            <h3 className="font-bold text-lg text-primary dark:text-accent mb-3">Tax Breakdown</h3>

            {[
              { label: "Gross income",         value: fmt(income),                   color: "text-gray-700 dark:text-gray-200" },
              { label: "RRSP deduction",        value: rrsp > 0 ? `−${fmt(rrsp)}` : "—", color: "text-green-600 dark:text-green-400" },
              { label: "Taxable income",        value: fmt(results.taxableIncome),    color: "text-gray-700 dark:text-gray-200", bold: true },
              { label: "Federal income tax",    value: `−${fmt(results.federalTax)}`, color: "text-red-600 dark:text-red-400" },
              { label: `${PROVINCES.find(p=>p.code===province)?.name} tax`, value: `−${fmt(results.provTax)}`, color: "text-red-600 dark:text-red-400" },
              { label: "CPP contributions",     value: `−${fmt(results.cpp)}`,        color: "text-orange-600 dark:text-orange-400" },
              { label: selfEmployed ? "EI (N/A — self-employed)" : "EI premiums", value: selfEmployed ? "—" : `−${fmt(results.ei)}`, color: "text-orange-600 dark:text-orange-400" },
              { label: "Total deductions",      value: `−${fmt(results.totalDeductions)}`, color: "text-gray-700 dark:text-gray-200", bold: true },
            ].map(row => (
              <div key={row.label} className={`flex justify-between items-center text-sm ${row.bold ? "font-bold border-t dark:border-gray-700 pt-2" : ""}`}>
                <span className="text-gray-600 dark:text-gray-400">{row.label}</span>
                <span className={row.color}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Rates */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg text-primary dark:text-accent mb-3">Your Tax Rates</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Effective Rate", value: pct(results.effectiveRate), sub: "total tax ÷ gross income" },
                { label: "Marginal Rate", value: pct(results.marginalCombined), sub: "federal + provincial on next $" },
                { label: "Federal Marginal", value: pct(results.marginalFederal), sub: "federal bracket rate" },
                { label: "Prov. Marginal", value: pct(results.marginalProv), sub: "provincial bracket rate" },
              ].map(r => (
                <div key={r.label} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-primary dark:text-accent">{r.value}</div>
                  <div className="text-xs font-semibold mt-1">{r.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{r.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual bar */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h3 className="font-bold text-lg text-primary dark:text-accent mb-4">Where Your Income Goes</h3>
        <div className="space-y-3">
          {[
            { label: "Take-Home Pay",      amount: results.takeHome,        color: "bg-green-500" },
            { label: "Federal Tax",        amount: results.federalTax,      color: "bg-red-400" },
            { label: "Provincial Tax",     amount: results.provTax,         color: "bg-red-300" },
            { label: "CPP",                amount: results.cpp,             color: "bg-orange-400" },
            { label: "EI",                 amount: results.ei,              color: "bg-orange-300" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-32 text-sm text-right text-gray-600 dark:text-gray-400 shrink-0">{item.label}</div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-5 overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: income > 0 ? `${(item.amount / income) * 100}%` : "0%" }}
                />
              </div>
              <div className="w-24 text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0">{fmt(item.amount)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RRSP tip */}
      {rrsp === 0 && income > 50000 && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <p className="font-bold text-blue-800 dark:text-blue-300 mb-1">Save more with an RRSP deduction</p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            At your income level, contributing $10,000 to an RRSP could save you approximately{" "}
            <strong>{fmt(Math.round(10000 * results.marginalCombined))}</strong> in taxes.{" "}
            <Link to="/tools/rrsp-calculator" className="underline font-semibold">Calculate your RRSP growth →</Link>
          </p>
        </div>
      )}

      {/* Internal links */}
      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <Link to="/tools/rrsp-calculator" className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition text-center">
          <span className="text-2xl">📈</span>
          <p className="font-semibold text-primary dark:text-accent mt-2">RRSP Calculator</p>
          <p className="text-xs text-gray-500 mt-1">Maximize your tax refund</p>
        </Link>
        <Link to="/tools/tfsa-calculator" className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition text-center">
          <span className="text-2xl">💰</span>
          <p className="font-semibold text-primary dark:text-accent mt-2">TFSA Calculator</p>
          <p className="text-xs text-gray-500 mt-1">Tax-free growth over time</p>
        </Link>
        <Link to="/blog/canadian-tax-brackets-2026" className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition text-center">
          <span className="text-2xl">📋</span>
          <p className="font-semibold text-primary dark:text-accent mt-2">2026 Tax Brackets</p>
          <p className="text-xs text-gray-500 mt-1">Federal + all provinces</p>
        </Link>
      </div>

      <div className="mt-12">
        <FAQ items={faqs} />
      </div>

      <div className="mt-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <strong>Disclaimer:</strong> This calculator provides estimates using 2026 projected tax brackets. Results are for informational purposes only and may not reflect your exact tax situation. Tax rules vary and additional credits/deductions may apply. Consult a qualified tax professional for precise calculations.
        </p>
      </div>
    </div>
  );
}
