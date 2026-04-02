import React, { useState, useMemo } from "react";
import SEO from "../../components/SEO";

// 2026 Canadian payroll constants
const CPP_RATE = 0.0595;
const CPP_MAX_PENSIONABLE = 71300;
const CPP_EXEMPTION = 3500;
const CPP_MAX = (CPP_MAX_PENSIONABLE - CPP_EXEMPTION) * CPP_RATE; // ~4,034.10

const CPP2_RATE = 0.04;
const CPP2_CEILING = 81900;
const CPP2_MAX = (CPP2_CEILING - CPP_MAX_PENSIONABLE) * CPP2_RATE; // ~416

const EI_RATE = 0.0166;
const EI_MAX_INSURABLE = 63200;
const EI_MAX = EI_MAX_INSURABLE * EI_RATE; // ~1,049.12

const FEDERAL_BRACKETS = [
  { min: 0, max: 57375, rate: 0.15 },
  { min: 57375, max: 114750, rate: 0.205 },
  { min: 114750, max: 158519, rate: 0.26 },
  { min: 158519, max: 220000, rate: 0.29 },
  { min: 220000, max: Infinity, rate: 0.33 },
];
const FEDERAL_BASIC = 16129;

const PROV = {
  AB: { r: [{ t: 148269, r: 0.10 }, { t: 177922, r: 0.12 }, { t: 237230, r: 0.13 }, { t: 355845, r: 0.14 }, { t: Infinity, r: 0.15 }], bp: 21003 },
  BC: { r: [{ t: 45654, r: 0.0506 }, { t: 91310, r: 0.077 }, { t: 104835, r: 0.105 }, { t: 127299, r: 0.1229 }, { t: 172602, r: 0.147 }, { t: 240716, r: 0.168 }, { t: Infinity, r: 0.205 }], bp: 11981 },
  MB: { r: [{ t: 47000, r: 0.108 }, { t: 100000, r: 0.1275 }, { t: Infinity, r: 0.174 }], bp: 15780 },
  NB: { r: [{ t: 47715, r: 0.094 }, { t: 95431, r: 0.14 }, { t: 176756, r: 0.16 }, { t: Infinity, r: 0.195 }], bp: 12458 },
  NL: { r: [{ t: 43198, r: 0.087 }, { t: 86395, r: 0.145 }, { t: 154244, r: 0.158 }, { t: 215943, r: 0.178 }, { t: Infinity, r: 0.198 }], bp: 10818 },
  NS: { r: [{ t: 29590, r: 0.0879 }, { t: 59180, r: 0.1495 }, { t: 93000, r: 0.1667 }, { t: 150000, r: 0.175 }, { t: Infinity, r: 0.21 }], bp: 8481 },
  NT: { r: [{ t: 50597, r: 0.059 }, { t: 101198, r: 0.086 }, { t: 164525, r: 0.122 }, { t: Infinity, r: 0.1405 }], bp: 16593 },
  NU: { r: [{ t: 53268, r: 0.04 }, { t: 106537, r: 0.07 }, { t: 173205, r: 0.09 }, { t: Infinity, r: 0.115 }], bp: 17925 },
  ON: { r: [{ t: 51446, r: 0.0505 }, { t: 102894, r: 0.0915 }, { t: 150000, r: 0.1116 }, { t: 220000, r: 0.1216 }, { t: Infinity, r: 0.1316 }], bp: 11865 },
  PE: { r: [{ t: 32656, r: 0.0965 }, { t: 64313, r: 0.1363 }, { t: 105000, r: 0.166 }, { t: 140000, r: 0.18 }, { t: Infinity, r: 0.167 }], bp: 12000 },
  QC: { r: [{ t: 53255, r: 0.14 }, { t: 106495, r: 0.19 }, { t: 129590, r: 0.24 }, { t: Infinity, r: 0.2575 }], bp: 17183 },
  SK: { r: [{ t: 49720, r: 0.105 }, { t: 142058, r: 0.125 }, { t: Infinity, r: 0.145 }], bp: 17661 },
  YT: { r: [{ t: 57375, r: 0.064 }, { t: 114750, r: 0.09 }, { t: 500000, r: 0.109 }, { t: Infinity, r: 0.15 }], bp: 15705 },
};

function calcBracketTax(income, brackets, basicPersonal) {
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    const top = b.t ?? Infinity;
    if (income <= prev) break;
    tax += (Math.min(income, top) - prev) * b.r;
    prev = top;
  }
  const credit = basicPersonal * brackets[0].r;
  return Math.max(0, tax - credit);
}

function calcFedTax(income) {
  let tax = 0;
  for (const b of FEDERAL_BRACKETS) {
    if (income <= b.min) break;
    tax += (Math.min(income, b.max) - b.min) * b.rate;
  }
  const credit = FEDERAL_BASIC * 0.15;
  return Math.max(0, tax - credit);
}

const PAY_FREQS = [
  { label: "Bi-Weekly", value: 26 },
  { label: "Semi-Monthly", value: 24 },
  { label: "Monthly", value: 12 },
  { label: "Weekly", value: 52 },
];

const PROVINCES_LIST = [
  ["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"],
  ["NB", "New Brunswick"], ["NL", "Newfoundland"], ["NS", "Nova Scotia"],
  ["NT", "Northwest Territories"], ["NU", "Nunavut"], ["ON", "Ontario"],
  ["PE", "PEI"], ["QC", "Quebec"], ["SK", "Saskatchewan"], ["YT", "Yukon"],
];

const fmt = (n) => `$${Math.round(n).toLocaleString("en-CA")}`;
const fmtD = (n) => `$${Math.abs(n).toFixed(2)}`;

export default function NetPayCalculator() {
  const [mode, setMode] = useState("salary"); // salary | hourly
  const [salary, setSalary] = useState(75000);
  const [hourlyRate, setHourlyRate] = useState(30);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [province, setProvince] = useState("ON");
  const [payFreq, setPayFreq] = useState(26);
  const [rrspContrib, setRrspContrib] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  const results = useMemo(() => {
    const annualGross = mode === "salary"
      ? salary
      : hourlyRate * hoursPerWeek * 52;

    const annualRRSP = rrspContrib * payFreq;
    const taxableIncome = Math.max(0, annualGross - annualRRSP);

    const fedTax = calcFedTax(taxableIncome);
    const provData = PROV[province] || PROV.ON;
    const provTax = calcBracketTax(taxableIncome, provData.r, provData.bp);

    const cpp = Math.min(Math.max(0, annualGross - CPP_EXEMPTION) * CPP_RATE, CPP_MAX);
    const cpp2 = Math.min(Math.max(0, annualGross - CPP_MAX_PENSIONABLE) * CPP2_RATE, CPP2_MAX);
    const ei = Math.min(annualGross * EI_RATE, EI_MAX);

    const totalAnnualDeductions = fedTax + provTax + cpp + cpp2 + ei + annualRRSP + otherDeductions * payFreq;
    const annualNet = annualGross - totalAnnualDeductions;

    const perPaycheck = (n) => n / payFreq;

    return {
      annualGross,
      perPayGross: perPaycheck(annualGross),
      fedTax: perPaycheck(fedTax),
      provTax: perPaycheck(provTax),
      cpp: perPaycheck(cpp),
      cpp2: perPaycheck(cpp2),
      ei: perPaycheck(ei),
      rrsp: rrspContrib,
      other: otherDeductions,
      totalDeductions: perPaycheck(totalAnnualDeductions),
      netPay: perPaycheck(annualNet),
      annualNet,
      effectiveRate: annualGross > 0 ? ((fedTax + provTax) / annualGross) * 100 : 0,
      marginalRate: (province === "ON" && taxableIncome > 220000) ? 46.16
        : (province === "AB" && taxableIncome > 220000) ? 48
        : (taxableIncome > 220000) ? 53.53 : 43.70,
    };
  }, [mode, salary, hourlyRate, hoursPerWeek, province, payFreq, rrspContrib, otherDeductions]);

  const freqLabel = PAY_FREQS.find(f => f.value === payFreq)?.label ?? "";

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Canadian Pay Stub Calculator 2026 — Net Pay After Tax"
        description="See your exact net pay after federal tax, provincial tax, CPP, and EI deductions. Free Canadian paycheck calculator for all provinces — 2026 rates."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          💵 Pay Stub Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Enter your salary or hourly rate — see your exact net pay after all Canadian tax and payroll deductions.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-6">
        {[{ v: "salary", l: "Annual Salary" }, { v: "hourly", l: "Hourly Rate" }].map(m => (
          <button key={m.v} onClick={() => setMode(m.v)}
            className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition ${
              mode === m.v ? "bg-primary text-white border-primary" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary"
            }`}>
            {m.l}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {mode === "salary" ? (
            <div className="sm:col-span-2">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold">Annual Salary</label>
                <span className="font-bold text-primary">{fmt(salary)}</span>
              </div>
              <input type="range" min={20000} max={500000} step={1000} value={salary}
                onChange={e => setSalary(Number(e.target.value))}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$20K</span><span>$500K</span></div>
            </div>
          ) : (
            <>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-semibold">Hourly Rate</label>
                  <span className="font-bold text-primary">${hourlyRate}/hr</span>
                </div>
                <input type="range" min={15} max={200} step={0.5} value={hourlyRate}
                  onChange={e => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$15/hr</span><span>$200/hr</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-semibold">Hours Per Week</label>
                  <span className="font-bold text-primary">{hoursPerWeek} hrs</span>
                </div>
                <input type="range" min={10} max={60} step={1} value={hoursPerWeek}
                  onChange={e => setHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10</span><span>60</span></div>
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-semibold block mb-1">Province</label>
            <select value={province} onChange={e => setProvince(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:border-primary outline-none text-sm">
              {PROVINCES_LIST.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Pay Frequency</label>
            <select value={payFreq} onChange={e => setPayFreq(Number(e.target.value))}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:border-primary outline-none text-sm">
              {PAY_FREQS.map(f => <option key={f.value} value={f.value}>{f.label} ({f.value}×/yr)</option>)}
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-semibold">RRSP Contribution (per paycheque)</label>
              <span className="font-bold text-primary">{fmt(rrspContrib)}</span>
            </div>
            <input type="range" min={0} max={Math.min(2000, results.perPayGross * 0.3)} step={25} value={rrspContrib}
              onChange={e => setRrspContrib(Number(e.target.value))}
              className="w-full accent-blue-600" />
            <p className="text-xs text-gray-400 mt-1">💡 RRSP contributions reduce your taxable income</p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-semibold">Other Deductions (per paycheque)</label>
              <span className="font-bold text-primary">{fmt(otherDeductions)}</span>
            </div>
            <input type="range" min={0} max={500} step={10} value={otherDeductions}
              onChange={e => setOtherDeductions(Number(e.target.value))}
              className="w-full accent-blue-600" />
            <p className="text-xs text-gray-400 mt-1">Health benefits, union dues, parking, etc.</p>
          </div>
        </div>
      </div>

      {/* Net Pay Hero */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 mb-6 text-center">
        <p className="text-green-100 text-sm font-semibold mb-1">{freqLabel} Net Pay</p>
        <p className="text-5xl font-bold mb-2">{fmtD(results.netPay)}</p>
        <p className="text-green-100 text-sm">
          Annual gross: <strong className="text-white">{fmt(results.annualGross)}</strong> →
          Annual net take-home: <strong className="text-white">{fmt(results.annualNet)}</strong>
        </p>
      </div>

      {/* Simulated Pay Stub */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl mb-6 overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">PAY STATEMENT</p>
              <p className="text-gray-400 text-xs">Canada 2026 • {freqLabel} Payroll</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">Province</p>
              <p className="font-bold">{province}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          {/* Earnings */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Earnings</p>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm">{mode === "hourly" ? `Regular Pay (${hourlyRate}/hr × ${hoursPerWeek}hrs)` : "Regular Salary"}</span>
              <span className="font-semibold">{fmtD(results.perPayGross)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-sm border-b-2 border-gray-200 dark:border-gray-600">
              <span>Gross Pay</span>
              <span className="text-green-600">{fmtD(results.perPayGross)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deductions</p>
            {[
              { label: "Federal Income Tax", value: results.fedTax, color: "text-red-500" },
              { label: `${province} Provincial Tax`, value: results.provTax, color: "text-red-500" },
              { label: "CPP Contributions", value: results.cpp, color: "text-orange-500" },
              results.cpp2 > 0.01 && { label: "CPP2 (Enhanced)", value: results.cpp2, color: "text-orange-500" },
              { label: "EI Premiums", value: results.ei, color: "text-orange-500" },
              results.rrsp > 0 && { label: "RRSP Contribution", value: results.rrsp, color: "text-blue-500" },
              results.other > 0 && { label: "Other Deductions", value: results.other, color: "text-gray-500" },
            ].filter(Boolean).map(item => (
              <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className={`font-semibold text-sm ${item.color}`}>-{fmtD(item.value)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 font-bold text-sm border-b-2 border-gray-200 dark:border-gray-600">
              <span>Total Deductions</span>
              <span className="text-red-600">-{fmtD(results.totalDeductions)}</span>
            </div>
          </div>

          {/* Net Pay */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex justify-between items-center">
            <span className="font-bold text-lg">NET PAY</span>
            <span className="font-bold text-2xl text-green-600">{fmtD(results.netPay)}</span>
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Annual Gross", value: fmt(results.annualGross), color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200" },
          { label: "Annual Net", value: fmt(results.annualNet), color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200" },
          { label: "Effective Tax Rate", value: `${results.effectiveRate.toFixed(1)}%`, color: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-200" },
          { label: "Total Deducted/yr", value: fmt(results.totalDeductions * payFreq), color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200" },
        ].map(c => (
          <div key={c.label} className={`border-2 rounded-xl p-4 ${c.color}`}>
            <p className="text-xs font-semibold opacity-70">{c.label}</p>
            <p className="text-xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-3">💡 Ways to Increase Your Take-Home Pay</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✅ <strong>RRSP contributions</strong> — reduce your taxable income dollar-for-dollar, lowering CPP, EI, and income tax deductions</li>
          <li>✅ <strong>Group benefits</strong> — employer-matched RRSP, dental, and health benefits are often tax-free compensation</li>
          <li>✅ <strong>TD1 form</strong> — make sure your employer has your correct claim amounts for dependents, disability, and other credits</li>
          <li>✅ <strong>Side business expenses</strong> — if you have self-employment income, deductible business expenses reduce your net tax</li>
          <li>✅ <strong>TFSA first</strong> — TFSA returns are tax-free and don't show on your tax return (unlike RRSP withdrawals in retirement)</li>
        </ul>
      </div>
    </section>
  );
}
