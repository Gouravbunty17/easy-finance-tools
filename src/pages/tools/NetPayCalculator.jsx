import React, { useMemo, useState } from "react";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

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
const FEDERAL_BASIC = 16129;

const FEDERAL_BRACKETS = [
  { min: 0, max: 58523, rate: 0.14 },
  { min: 58523, max: 117045, rate: 0.205 },
  { min: 117045, max: 181440, rate: 0.26 },
  { min: 181440, max: 258482, rate: 0.29 },
  { min: 258482, max: Infinity, rate: 0.33 },
];

const PROV = {
  AB: { label: "Alberta", r: [{ t: 148269, r: 0.1 }, { t: 177922, r: 0.12 }, { t: 237230, r: 0.13 }, { t: 355845, r: 0.14 }, { t: Infinity, r: 0.15 }], bp: 21003 },
  BC: { label: "British Columbia", r: [{ t: 45654, r: 0.0506 }, { t: 91310, r: 0.077 }, { t: 104835, r: 0.105 }, { t: 127299, r: 0.1229 }, { t: 172602, r: 0.147 }, { t: 240716, r: 0.168 }, { t: Infinity, r: 0.205 }], bp: 11981 },
  MB: { label: "Manitoba", r: [{ t: 47000, r: 0.108 }, { t: 100000, r: 0.1275 }, { t: Infinity, r: 0.174 }], bp: 15780 },
  NB: { label: "New Brunswick", r: [{ t: 47715, r: 0.094 }, { t: 95431, r: 0.14 }, { t: 176756, r: 0.16 }, { t: Infinity, r: 0.195 }], bp: 12458 },
  NL: { label: "Newfoundland and Labrador", r: [{ t: 43198, r: 0.087 }, { t: 86395, r: 0.145 }, { t: 154244, r: 0.158 }, { t: 215943, r: 0.178 }, { t: Infinity, r: 0.198 }], bp: 10818 },
  NS: { label: "Nova Scotia", r: [{ t: 29590, r: 0.0879 }, { t: 59180, r: 0.1495 }, { t: 93000, r: 0.1667 }, { t: 150000, r: 0.175 }, { t: Infinity, r: 0.21 }], bp: 8481 },
  NT: { label: "Northwest Territories", r: [{ t: 50597, r: 0.059 }, { t: 101198, r: 0.086 }, { t: 164525, r: 0.122 }, { t: Infinity, r: 0.1405 }], bp: 16593 },
  NU: { label: "Nunavut", r: [{ t: 53268, r: 0.04 }, { t: 106537, r: 0.07 }, { t: 173205, r: 0.09 }, { t: Infinity, r: 0.115 }], bp: 17925 },
  ON: { label: "Ontario", r: [{ t: 51446, r: 0.0505 }, { t: 102894, r: 0.0915 }, { t: 150000, r: 0.1116 }, { t: 220000, r: 0.1216 }, { t: Infinity, r: 0.1316 }], bp: 11865 },
  PE: { label: "Prince Edward Island", r: [{ t: 32656, r: 0.0965 }, { t: 64313, r: 0.1363 }, { t: 105000, r: 0.166 }, { t: 140000, r: 0.18 }, { t: Infinity, r: 0.167 }], bp: 12000 },
  QC: { label: "Quebec", r: [{ t: 53255, r: 0.14 }, { t: 106495, r: 0.19 }, { t: 129590, r: 0.24 }, { t: Infinity, r: 0.2575 }], bp: 17183 },
  SK: { label: "Saskatchewan", r: [{ t: 49720, r: 0.105 }, { t: 142058, r: 0.125 }, { t: Infinity, r: 0.145 }], bp: 17661 },
  YT: { label: "Yukon", r: [{ t: 57375, r: 0.064 }, { t: 114750, r: 0.09 }, { t: 500000, r: 0.109 }, { t: Infinity, r: 0.15 }], bp: 15705 },
};

const PAY_FREQS = [
  { label: "Bi-Weekly", value: 26 },
  { label: "Semi-Monthly", value: 24 },
  { label: "Monthly", value: 12 },
  { label: "Weekly", value: 52 },
];

function calcBracketTax(income, brackets, basicPersonal) {
  let tax = 0;
  let prev = 0;
  for (const bracket of brackets) {
    const top = bracket.t ?? Infinity;
    if (income <= prev) break;
    tax += (Math.min(income, top) - prev) * bracket.r;
    prev = top;
  }
  return Math.max(0, tax - basicPersonal * brackets[0].r);
}

function calcFedTax(income) {
  let tax = 0;
  for (const bracket of FEDERAL_BRACKETS) {
    if (income <= bracket.min) break;
    tax += (Math.min(income, bracket.max) - bracket.min) * bracket.rate;
  }
  return Math.max(0, tax - FEDERAL_BASIC * FEDERAL_BRACKETS[0].rate);
}

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
    const annualGross = mode === "salary" ? asNumber(salary) : asNumber(hourlyRate) * asNumber(hoursPerWeek, 40) * 52;
    const annualRRSP = asNumber(rrspContrib) * asNumber(payFreq, 26);
    const taxableIncome = Math.max(0, annualGross - annualRRSP);
    const provincial = PROV[province] || PROV.ON;

    const fedTax = calcFedTax(taxableIncome);
    const provTax = calcBracketTax(taxableIncome, provincial.r, provincial.bp);
    const cpp = Math.min(Math.max(0, annualGross - CPP_EXEMPTION) * CPP_RATE, CPP_MAX);
    const cpp2 = Math.min(Math.max(0, annualGross - CPP_MAX_PENSIONABLE) * CPP2_RATE, CPP2_MAX);
    const ei = Math.min(annualGross * EI_RATE, EI_MAX);
    const otherAnnual = asNumber(otherDeductions) * asNumber(payFreq, 26);
    const totalAnnualDeductions = fedTax + provTax + cpp + cpp2 + ei + annualRRSP + otherAnnual;
    const annualNet = annualGross - totalAnnualDeductions;
    const perPay = (value) => value / asNumber(payFreq, 26);

    return {
      provincial,
      annualGross,
      annualNet,
      perPayGross: perPay(annualGross),
      netPay: perPay(annualNet),
      fedTax: perPay(fedTax),
      provTax: perPay(provTax),
      cpp: perPay(cpp),
      cpp2: perPay(cpp2),
      ei: perPay(ei),
      rrsp: asNumber(rrspContrib),
      other: asNumber(otherDeductions),
      effectiveRate: annualGross > 0 ? ((fedTax + provTax) / annualGross) * 100 : 0,
    };
  }, [mode, salary, hourlyRate, hoursPerWeek, province, payFreq, rrspContrib, otherDeductions]);

  return (
    <CalculatorLayout
      title="Canadian Pay Stub Calculator 2026"
      description="Estimate gross pay, taxes, CPP, EI, RRSP deductions, and net pay with input boxes only. Works for salary and hourly income across Canadian provinces."
      canonical="https://easyfinancetools.com/tools/net-pay-calculator"
      badge="Paycheque planning"
      results={
        <>
          <ResultCard
            label={`${PAY_FREQS.find((entry) => entry.value === payFreq)?.label || "Per-pay"} net pay`}
            value={fmtCAD(results.netPay, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`Annual net: ${fmtCAD(results.annualNet)} from annual gross ${fmtCAD(results.annualGross)}.`}
            tone="primary"
          />
          <ResultCard
            label="Federal + provincial income tax"
            value={fmtCAD(results.fedTax + results.provTax, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`Effective income-tax rate: ${fmtNum(results.effectiveRate, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`}
          />
          <ResultCard
            label="Payroll deductions"
            value={fmtCAD(results.cpp + results.cpp2 + results.ei + results.rrsp + results.other, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`${results.provincial.label} assumptions with 2026 federal brackets and standard CPP/EI caps.`}
            tone="success"
          />
        </>
      }
      relatedTools={[
        { href: "/tools/income-tax-calculator", title: "Income tax calculator", body: "Check annual tax effects separately if you are comparing a few income scenarios." },
        { href: "/tools/salary-to-hourly-calculator", title: "Salary to hourly calculator", body: "Convert gross salary first if you are comparing offers or freelance rates." },
        { href: "/tools/budget-tracker", title: "Budget tracker", body: "Turn the estimated net pay into a monthly spending plan." },
      ]}
      footerNote="Educational estimate only. Employer-specific payroll rules, benefits, taxable benefits, and local credits can change your real pay stub."
    >
      <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex gap-3">
          {[
            { value: "salary", label: "Annual salary" },
            { value: "hourly", label: "Hourly income" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                mode === option.value
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {mode === "salary" ? (
            <NumberInput id="pay-salary" label="Annual salary" prefix="$" value={salary} onChange={(value) => setSalary(parseNumericInput(value))} placeholder="75000" />
          ) : (
            <>
              <NumberInput id="pay-hourly-rate" label="Hourly rate" prefix="$" value={hourlyRate} onChange={(value) => setHourlyRate(parseNumericInput(value))} placeholder="30" />
              <NumberInput id="pay-hours-week" label="Hours per week" value={hoursPerWeek} onChange={(value) => setHoursPerWeek(parseNumericInput(value))} placeholder="40" />
            </>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Province</span>
            <select value={province} onChange={(event) => setProvince(event.target.value)} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {Object.entries(PROV).map(([code, config]) => (
                <option key={code} value={code}>{config.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Pay frequency</span>
            <select value={payFreq} onChange={(event) => setPayFreq(Number(event.target.value))} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {PAY_FREQS.map((entry) => (
                <option key={entry.value} value={entry.value}>{entry.label}</option>
              ))}
            </select>
          </label>

          <NumberInput id="pay-rrsp" label="RRSP contribution per pay" prefix="$" value={rrspContrib} onChange={(value) => setRrspContrib(parseNumericInput(value))} placeholder="0" hint="This reduces taxable income before income tax is calculated." />
          <NumberInput id="pay-other-deductions" label="Other deductions per pay" prefix="$" value={otherDeductions} onChange={(value) => setOtherDeductions(parseNumericInput(value))} placeholder="0" hint="Use for benefits, union dues, or other payroll deductions." />
        </div>
      </div>
    </CalculatorLayout>
  );
}
