import React, { useMemo, useState } from "react";
import SEO from "../../components/SEO";

const CPP_RATE = 0.0595;
const CPP_MAX_PENSIONABLE = 71300;
const CPP_EXEMPTION = 3500;
const CPP_MAX = (CPP_MAX_PENSIONABLE - CPP_EXEMPTION) * CPP_RATE;

const CPP2_RATE = 0.04;
const CPP2_CEILING = 81900;
const CPP2_MAX = (CPP2_CEILING - CPP_MAX_PENSIONABLE) * CPP2_RATE;

const EI_RATE = 0.0166;
const EI_MAX_INSURABLE = 63200;
const EI_MAX = EI_MAX_INSURABLE * EI_RATE;

const FEDERAL_BRACKETS = [
  { min: 0, max: 58523, rate: 0.14 },
  { min: 58523, max: 117045, rate: 0.205 },
  { min: 117045, max: 181440, rate: 0.26 },
  { min: 181440, max: 258482, rate: 0.29 },
  { min: 258482, max: Infinity, rate: 0.33 },
];

const FEDERAL_BASIC = 16129;

const PROV = {
  AB: { r: [{ t: 148269, r: 0.1 }, { t: 177922, r: 0.12 }, { t: 237230, r: 0.13 }, { t: 355845, r: 0.14 }, { t: Infinity, r: 0.15 }], bp: 21003 },
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
  for (const bracket of brackets) {
    const top = bracket.t ?? Infinity;
    if (income <= prev) break;
    tax += (Math.min(income, top) - prev) * bracket.r;
    prev = top;
  }
  const credit = basicPersonal * brackets[0].r;
  return Math.max(0, tax - credit);
}

function calcFedTax(income) {
  let tax = 0;
  for (const bracket of FEDERAL_BRACKETS) {
    if (income <= bracket.min) break;
    tax += (Math.min(income, bracket.max) - bracket.min) * bracket.rate;
  }
  const credit = FEDERAL_BASIC * FEDERAL_BRACKETS[0].rate;
  return Math.max(0, tax - credit);
}

const PAY_FREQS = [
  { label: "Bi-Weekly", value: 26 },
  { label: "Semi-Monthly", value: 24 },
  { label: "Monthly", value: 12 },
  { label: "Weekly", value: 52 },
];

const PROVINCES_LIST = [
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

const fmt = (n) => `$${Math.round(n).toLocaleString("en-CA")}`;
const fmtD = (n) => `$${Math.abs(n).toFixed(2)}`;

export default function NetPayCalculator() {
  const [mode, setMode] = useState("salary");
  const [salary, setSalary] = useState(75000);
  const [hourlyRate, setHourlyRate] = useState(30);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [province, setProvince] = useState("ON");
  const [payFreq, setPayFreq] = useState(26);
  const [rrspContrib, setRrspContrib] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  const results = useMemo(() => {
    const annualGross = mode === "salary" ? salary : hourlyRate * hoursPerWeek * 52;
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
    const perPaycheck = (amount) => amount / payFreq;

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
      marginalRate:
        province === "ON" && taxableIncome > 258482
          ? 46.16
          : province === "AB" && taxableIncome > 258482
            ? 48
            : taxableIncome > 258482
              ? 53.53
              : 43.7,
    };
  }, [mode, salary, hourlyRate, hoursPerWeek, province, payFreq, rrspContrib, otherDeductions]);

  const freqLabel = PAY_FREQS.find((freq) => freq.value === payFreq)?.label ?? "";

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <SEO
        title="Canadian Pay Stub Calculator 2026 - Net Pay After Tax"
        description="See your estimated net pay after federal tax, provincial tax, CPP, and EI deductions. Free Canadian paycheck calculator for all provinces using 2026 assumptions."
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-accent">Pay Stub Calculator</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Enter your salary or hourly rate to estimate net pay after Canadian income tax and payroll deductions.
        </p>
      </div>

      <div className="mb-6 flex gap-3">
        {[{ v: "salary", l: "Annual Salary" }, { v: "hourly", l: "Hourly Rate" }].map((entry) => (
          <button
            key={entry.v}
            onClick={() => setMode(entry.v)}
            className={`flex-1 rounded-xl border-2 py-3 text-sm font-semibold transition ${
              mode === entry.v
                ? "border-primary bg-primary text-white"
                : "border-gray-200 text-gray-600 hover:border-primary dark:border-gray-700 dark:text-gray-300"
            }`}
          >
            {entry.l}
          </button>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border-2 border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {mode === "salary" ? (
            <div className="sm:col-span-2">
              <div className="mb-1 flex justify-between">
                <label className="text-sm font-semibold">Annual Salary</label>
                <span className="font-bold text-primary">{fmt(salary)}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={500000}
                step={1000}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>$20K</span>
                <span>$500K</span>
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="mb-1 flex justify-between">
                  <label className="text-sm font-semibold">Hourly Rate</label>
                  <span className="font-bold text-primary">${hourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={200}
                  step={0.5}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>$15/hr</span>
                  <span>$200/hr</span>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <label className="text-sm font-semibold">Hours Per Week</label>
                  <span className="font-bold text-primary">{hoursPerWeek} hrs</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={1}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>10</span>
                  <span>60</span>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-sm font-semibold">Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-700"
            >
              {PROVINCES_LIST.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Pay Frequency</label>
            <select
              value={payFreq}
              onChange={(e) => setPayFreq(Number(e.target.value))}
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-700"
            >
              {PAY_FREQS.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label} ({freq.value}x/yr)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1 flex justify-between">
              <label className="text-sm font-semibold">RRSP Contribution (per paycheque)</label>
              <span className="font-bold text-primary">{fmt(rrspContrib)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.min(2000, results.perPayGross * 0.3)}
              step={25}
              value={rrspContrib}
              onChange={(e) => setRrspContrib(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <p className="mt-1 text-xs text-gray-400">RRSP contributions reduce taxable income before income tax is calculated.</p>
          </div>

          <div>
            <div className="mb-1 flex justify-between">
              <label className="text-sm font-semibold">Other Deductions (per paycheque)</label>
              <span className="font-bold text-primary">{fmt(otherDeductions)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <p className="mt-1 text-xs text-gray-400">Health benefits, union dues, parking, and similar payroll deductions.</p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center text-white">
        <p className="mb-1 text-sm font-semibold text-green-100">{freqLabel} Net Pay</p>
        <p className="mb-2 text-5xl font-bold">{fmtD(results.netPay)}</p>
        <p className="text-sm text-green-100">
          Annual gross: <strong className="text-white">{fmt(results.annualGross)}</strong> to annual net take-home:{" "}
          <strong className="text-white">{fmt(results.annualNet)}</strong>
        </p>
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="bg-gray-800 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">PAY STATEMENT</p>
              <p className="text-xs text-gray-400">Canada 2026 | {freqLabel} Payroll</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Province</p>
              <p className="font-bold">{province}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="mb-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Earnings</p>
            <div className="flex justify-between border-b border-gray-100 py-2 dark:border-gray-700">
              <span className="text-sm">{mode === "hourly" ? `Regular Pay (${hourlyRate}/hr x ${hoursPerWeek} hrs)` : "Regular Salary"}</span>
              <span className="font-semibold">{fmtD(results.perPayGross)}</span>
            </div>
            <div className="flex justify-between border-b-2 border-gray-200 py-2 text-sm font-bold dark:border-gray-600">
              <span>Gross Pay</span>
              <span className="text-green-600">{fmtD(results.perPayGross)}</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Deductions</p>
            {[
              { label: "Federal Income Tax", value: results.fedTax, color: "text-red-500" },
              { label: `${province} Provincial Tax`, value: results.provTax, color: "text-red-500" },
              { label: "CPP Contributions", value: results.cpp, color: "text-orange-500" },
              results.cpp2 > 0.01 && { label: "CPP2 (Enhanced)", value: results.cpp2, color: "text-orange-500" },
              { label: "EI Premiums", value: results.ei, color: "text-orange-500" },
              results.rrsp > 0 && { label: "RRSP Contribution", value: results.rrsp, color: "text-blue-500" },
              results.other > 0 && { label: "Other Deductions", value: results.other, color: "text-gray-500" },
            ]
              .filter(Boolean)
              .map((item) => (
                <div key={item.label} className="flex justify-between border-b border-gray-50 py-2 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>-{fmtD(item.value)}</span>
                </div>
              ))}
            <div className="flex justify-between border-b-2 border-gray-200 py-2 text-sm font-bold dark:border-gray-600">
              <span>Total Deductions</span>
              <span className="text-red-600">-{fmtD(results.totalDeductions)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
            <span className="text-lg font-bold">NET PAY</span>
            <span className="text-2xl font-bold text-green-600">{fmtD(results.netPay)}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Annual Gross", value: fmt(results.annualGross), color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200" },
          { label: "Annual Net", value: fmt(results.annualNet), color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200" },
          { label: "Effective Tax Rate", value: `${results.effectiveRate.toFixed(1)}%`, color: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-200" },
          { label: "Total Deducted/yr", value: fmt(results.totalDeductions * payFreq), color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200" },
        ].map((card) => (
          <div key={card.label} className={`rounded-xl border-2 p-4 ${card.color}`}>
            <p className="text-xs font-semibold opacity-70">{card.label}</p>
            <p className="mt-1 text-xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-bold">Ways to Increase Your Take-Home Pay</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li><strong>RRSP contributions</strong> reduce taxable income before income tax is calculated.</li>
          <li><strong>Group benefits</strong> can add compensation value beyond cash pay.</li>
          <li><strong>TD1 details</strong> should be accurate with your employer so withholding is closer to your situation.</li>
          <li><strong>Business deductions</strong> matter if you also earn self-employment income.</li>
          <li><strong>TFSA usage</strong> can keep investment growth outside future taxable income calculations.</li>
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        Uses the same 2026 federal bracket assumptions as the site&apos;s income tax calculator, including the 14% lowest federal rate. Provincial handling remains simplified and payroll outputs are educational estimates.
      </div>
    </section>
  );
}
