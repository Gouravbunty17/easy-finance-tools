import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
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

const FAQS = [
  {
    q: "Is this net pay calculator exact?",
    a: "No. It is an estimate based on federal, provincial, CPP, EI, RRSP, and deduction inputs. Employer benefits, taxable benefits, credits, and payroll setup can change the actual pay stub.",
  },
  {
    q: "Why does province matter for net pay in Canada?",
    a: "Federal tax is only part of the calculation. Each province and territory has its own brackets and basic personal amount, so the same salary can produce different net pay.",
  },
  {
    q: "Does an RRSP contribution increase my net pay?",
    a: "A payroll RRSP contribution can reduce taxable income before withholding, but the contribution itself is also deducted from the paycheque. The calculator shows both effects together.",
  },
  {
    q: "Should I use salary or hourly mode?",
    a: "Use salary mode for a fixed annual salary. Use hourly mode if your weekly hours or rate are the easier way to estimate annual gross pay.",
  },
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
      title="Net Pay Calculator Canada 2026 | Paycheque & Payroll Estimate"
      description="Estimate Canadian net pay by province from salary or hourly income, including federal tax, provincial tax, CPP, EI, RRSP deductions, and per-pay results."
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
        { href: "/tools/rrsp-calculator", title: "RRSP calculator", body: "Compare whether RRSP contributions should be part of the next paycheque plan." },
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

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What this calculator does</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Estimate take-home pay before a paycheque arrives</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This calculator is for Canadian employees comparing salary offers, hourly work, RRSP payroll deductions, or pay frequency. It estimates gross pay, income tax, CPP, EI, and net pay for the province or territory you choose.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use it</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Start with gross income, then add payroll deductions</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Choose salary or hourly mode, select your province, and match the pay frequency to your employer. Add RRSP contributions or recurring deductions only if they come directly off each paycheque.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Inputs explained</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What each pay input changes</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Income", "Salary mode annualizes the entered salary. Hourly mode multiplies hourly rate by weekly hours and 52 weeks."],
            ["Province", "Province changes the estimated provincial or territorial income-tax portion."],
            ["Pay frequency", "This divides annual gross, tax, CPP, EI, and deductions into weekly, bi-weekly, semi-monthly, or monthly pay."],
            ["Deductions", "RRSP and other deductions are modeled per pay period and reduce the cash that lands in your account."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="font-bold text-primary dark:text-accent">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Example calculation</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Example: Ontario salary paid bi-weekly</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            With the current inputs, the estimated annual gross pay is {fmtCAD(results.annualGross)} and estimated net pay is {fmtCAD(results.netPay, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} per pay. Use this as a planning estimate, then compare it with your employer's actual payroll details.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to read your result</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Net pay is the useful budgeting number</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The headline net-pay number is the estimated amount after modeled income tax, CPP, EI, RRSP contributions, and other deductions. If you are building a savings plan, use net pay with the <Link to="/tools/compound-interest-calculator" className="text-primary underline dark:text-secondary">compound interest calculator</Link> or compare RRSP contributions with the <Link to="/tools/rrsp-calculator" className="text-primary underline dark:text-secondary">RRSP calculator</Link>.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Do not treat payroll estimates like a final tax return</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <li>- Forgetting employer benefits, taxable benefits, bonus pay, commissions, or pension adjustments.</li>
          <li>- Comparing monthly expenses to gross salary instead of estimated net pay.</li>
          <li>- Entering annual RRSP contributions in a field that expects the per-pay amount.</li>
          <li>- Assuming payroll withholding equals the final refund or balance owing at tax time.</li>
        </ul>
      </section>

      <MethodologyPanel
        title="Methodology: how this net pay calculator works"
        summary="The calculator annualizes salary or hourly income, subtracts modeled payroll RRSP contributions from taxable income, estimates federal and provincial income tax, then applies CPP, CPP2, EI, and other per-pay deductions."
        assumptions={[
          "Federal and provincial tax brackets are simplified planning tables for 2026-style estimates.",
          "CPP, CPP2, and EI use annual caps and are then divided by the selected pay frequency.",
          "Tax credits, benefit deductions, taxable benefits, bonuses, and employer-specific payroll rules are not fully modeled.",
          "RRSP contributions are treated as payroll deductions entered per pay period.",
        ]}
        sources={[
          { label: "CRA payroll deductions", href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll.html" },
          { label: "EasyFinanceTools methodology", href: "https://easyfinancetools.com/methodology" },
        ]}
        note="Educational payroll estimate only. Verify your actual pay stub with your employer, CRA guidance, or a qualified tax professional."
      />

      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related tools and guides</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/tools" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">All calculators</Link>
          <Link to="/tools/tfsa-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA calculator</Link>
          <Link to="/blog/tfsa-vs-rrsp-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA vs RRSP guide</Link>
          <Link to="/blog/how-to-start-investing-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Beginner investing guide</Link>
        </div>
      </section>

      <FAQ items={FAQS} />
    </CalculatorLayout>
  );
}
