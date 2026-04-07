import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolPageSchema from "../../components/ToolPageSchema";
import { trackToolCalculate, trackToolStart } from "../../lib/analytics";
import SurfaceTrackedLink from "../../components/SurfaceTrackedLink";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

const FEDERAL = {
  brackets: [
    { min: 0, max: 58523, rate: 0.14 },
    { min: 58523, max: 117045, rate: 0.205 },
    { min: 117045, max: 181440, rate: 0.26 },
    { min: 181440, max: 258482, rate: 0.29 },
    { min: 258482, max: Infinity, rate: 0.33 },
  ],
  basicPersonal: 16129,
};

const PROVINCIAL = {
  AB: { brackets: [{ min: 0, max: 148269, rate: 0.1 }, { min: 148269, max: 177922, rate: 0.12 }, { min: 177922, max: 237230, rate: 0.13 }, { min: 237230, max: 355845, rate: 0.14 }, { min: 355845, max: Infinity, rate: 0.15 }], basicPersonal: 21003 },
  BC: { brackets: [{ min: 0, max: 45654, rate: 0.0506 }, { min: 45654, max: 91310, rate: 0.077 }, { min: 91310, max: 104835, rate: 0.105 }, { min: 104835, max: 127299, rate: 0.1229 }, { min: 127299, max: 172602, rate: 0.147 }, { min: 172602, max: 240716, rate: 0.168 }, { min: 240716, max: Infinity, rate: 0.205 }], basicPersonal: 11981 },
  MB: { brackets: [{ min: 0, max: 47000, rate: 0.108 }, { min: 47000, max: 100000, rate: 0.1275 }, { min: 100000, max: Infinity, rate: 0.174 }], basicPersonal: 15780 },
  NB: { brackets: [{ min: 0, max: 47715, rate: 0.094 }, { min: 47715, max: 95431, rate: 0.14 }, { min: 95431, max: 176756, rate: 0.16 }, { min: 176756, max: Infinity, rate: 0.195 }], basicPersonal: 12458 },
  NL: { brackets: [{ min: 0, max: 43198, rate: 0.087 }, { min: 43198, max: 86395, rate: 0.145 }, { min: 86395, max: 154244, rate: 0.158 }, { min: 154244, max: 215943, rate: 0.178 }, { min: 215943, max: 275870, rate: 0.198 }, { min: 275870, max: 551739, rate: 0.208 }, { min: 551739, max: Infinity, rate: 0.213 }], basicPersonal: 10818 },
  NS: { brackets: [{ min: 0, max: 29590, rate: 0.0879 }, { min: 29590, max: 59180, rate: 0.1495 }, { min: 59180, max: 93000, rate: 0.1667 }, { min: 93000, max: 150000, rate: 0.175 }, { min: 150000, max: Infinity, rate: 0.21 }], basicPersonal: 8481 },
  NT: { brackets: [{ min: 0, max: 50597, rate: 0.059 }, { min: 50597, max: 101198, rate: 0.086 }, { min: 101198, max: 164525, rate: 0.122 }, { min: 164525, max: Infinity, rate: 0.1405 }], basicPersonal: 16593 },
  NU: { brackets: [{ min: 0, max: 53268, rate: 0.04 }, { min: 53268, max: 106537, rate: 0.07 }, { min: 106537, max: 173205, rate: 0.09 }, { min: 173205, max: Infinity, rate: 0.115 }], basicPersonal: 17925 },
  ON: { brackets: [{ min: 0, max: 51446, rate: 0.0505 }, { min: 51446, max: 102894, rate: 0.0915 }, { min: 102894, max: 150000, rate: 0.1116 }, { min: 150000, max: 220000, rate: 0.1216 }, { min: 220000, max: Infinity, rate: 0.1316 }], basicPersonal: 11865 },
  PE: { brackets: [{ min: 0, max: 32656, rate: 0.0965 }, { min: 32656, max: 64313, rate: 0.1363 }, { min: 64313, max: 105000, rate: 0.166 }, { min: 105000, max: 140000, rate: 0.18 }, { min: 140000, max: Infinity, rate: 0.167 }], basicPersonal: 12000 },
  QC: { brackets: [{ min: 0, max: 53255, rate: 0.14 }, { min: 53255, max: 106495, rate: 0.19 }, { min: 106495, max: 129590, rate: 0.24 }, { min: 129590, max: Infinity, rate: 0.2575 }], basicPersonal: 17183 },
  SK: { brackets: [{ min: 0, max: 49720, rate: 0.105 }, { min: 49720, max: 142058, rate: 0.125 }, { min: 142058, max: Infinity, rate: 0.145 }], basicPersonal: 17661 },
  YT: { brackets: [{ min: 0, max: 57375, rate: 0.064 }, { min: 57375, max: 114750, rate: 0.09 }, { min: 114750, max: 500000, rate: 0.109 }, { min: 500000, max: Infinity, rate: 0.15 }], basicPersonal: 15705 },
};

function calcTax(income, brackets, basicPersonal) {
  let tax = 0;
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    const taxable = Math.min(income, bracket.max) - bracket.min;
    tax += taxable * bracket.rate;
  }
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
  return Math.min(base + enhanced, 4454.1);
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
  return `${(n * 100).toFixed(1)}%`;
}

const FAQS = [
  { q: "How accurate is this Canadian income tax calculator?", a: "This calculator uses estimated 2026 federal and provincial tax brackets and standard CPP and EI assumptions. It is a useful approximation for salary income, but not a substitute for a full tax return." },
  { q: "Does this calculator include CPP and EI deductions?", a: "Yes. It estimates CPP contributions and EI premiums based on the income entered, with a self-employed toggle that removes EI and doubles CPP exposure." },
  { q: "What is the difference between marginal and effective tax rate?", a: "Marginal rate is the tax rate on your next dollar of income. Effective rate is total deductions divided by total income. They are not the same, and a higher marginal bracket does not mean all income is taxed at that top rate." },
  { q: "Does this calculator work for self-employed income?", a: "It provides a directional estimate for self-employed users by removing EI and doubling CPP, but it does not model every business deduction or filing nuance." },
  { q: "What about RRSP deductions?", a: "RRSP contributions reduce taxable income before income tax is calculated, which is why they can increase take-home results in this tool." },
];

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(85000);
  const [province, setProvince] = useState("ON");
  const [rrsp, setRrsp] = useState(0);
  const [selfEmployed, setSelfEmployed] = useState(false);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const trackStartOnce = () => {
    if (hasTrackedStart) return;
    trackToolStart("income_tax_calculator", { entry_point: "input_interaction" });
    setHasTrackedStart(true);
  };

  const incomeValue = asNumber(income);
  const rrspValue = asNumber(rrsp);

  const results = useMemo(() => {
    const taxableIncome = Math.max(0, incomeValue - rrspValue);
    const prov = PROVINCIAL[province];
    const federalTax = calcTax(taxableIncome, FEDERAL.brackets, FEDERAL.basicPersonal);
    const provTax = calcTax(taxableIncome, prov.brackets, prov.basicPersonal);
    const cpp = selfEmployed ? Math.min(calcCPP(incomeValue) * 2, 8068.2) : calcCPP(incomeValue);
    const ei = selfEmployed ? 0 : calcEI(incomeValue);
    const totalDeductions = federalTax + provTax + cpp + ei;
    const takeHome = incomeValue - totalDeductions;
    const effectiveRate = incomeValue > 0 ? totalDeductions / incomeValue : 0;

    let marginalFederal = 0.15;
    for (const bracket of FEDERAL.brackets) {
      if (taxableIncome > bracket.min) marginalFederal = bracket.rate;
    }

    let marginalProv = prov.brackets[0].rate;
    for (const bracket of prov.brackets) {
      if (taxableIncome > bracket.min) marginalProv = bracket.rate;
    }

    return {
      federalTax,
      provTax,
      cpp,
      ei,
      totalDeductions,
      takeHome,
      effectiveRate,
      marginalFederal,
      marginalProv,
      marginalCombined: marginalFederal + marginalProv,
      taxableIncome,
    };
  }, [incomeValue, province, rrspValue, selfEmployed]);

  const provinceName = PROVINCES.find((p) => p.code === province)?.name || "Province";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Canadian Income Tax Calculator 2026 - All Provinces"
        description="Free 2026 Canadian income tax calculator. Estimate federal and provincial income tax, CPP, EI, take-home pay, and marginal versus effective tax rate."
        canonical="https://easyfinancetools.com/tools/income-tax-calculator"
      />
      <ToolPageSchema
        name="Canadian Income Tax Calculator 2026"
        description="Canadian income tax calculator for federal and provincial tax estimates, CPP, EI, take-home pay, and RRSP deduction impact."
        canonical="https://easyfinancetools.com/tools/income-tax-calculator"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-3">Canadian Income Tax Calculator 2026</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Estimate take-home pay after federal tax, provincial tax, CPP, and EI for any province or territory in Canada.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-5">
          <h2 className="text-xl font-bold text-primary dark:text-accent">Your income details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Annual Employment Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input type="number" className="w-full pl-8 pr-4 py-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 text-lg font-semibold" value={income} onChange={(e) => { trackStartOnce(); setIncome(parseNumericInput(e.target.value)); trackToolCalculate("income_tax_calculator", { action: "income_change" }); }} min={0} max={2000000} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Use annual gross employment income before tax. If you are just testing, try your salary before bonuses.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Province or Territory</label>
            <select className="w-full px-4 py-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" value={province} onChange={(e) => { trackStartOnce(); setProvince(e.target.value); }}>
              {PROVINCES.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">RRSP Contribution</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input type="number" className="w-full pl-8 pr-4 py-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" value={rrsp} onChange={(e) => { trackStartOnce(); setRrsp(parseNumericInput(e.target.value)); trackToolCalculate("income_tax_calculator", { action: "rrsp_change" }); }} min={0} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Each RRSP dollar reduces taxable income before income tax is calculated.</p>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="selfEmployed" checked={selfEmployed} onChange={(e) => { trackStartOnce(); setSelfEmployed(e.target.checked); trackToolCalculate("income_tax_calculator", { action: "self_employed_toggle", enabled: e.target.checked }); }} className="w-5 h-5 accent-primary" />
            <label htmlFor="selfEmployed" className="text-sm font-medium cursor-pointer">Self-employed estimate (no EI, double CPP)</label>
          </div>

          <div className="pt-2 border-t dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            <p>Using 2026 federal payroll guidance plus simplified provincial and payroll assumptions. Results are approximate.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-primary text-white rounded-2xl p-6 text-center shadow">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80 mb-1">Annual take-home pay</p>
            <p className="text-5xl font-bold">{fmt(results.takeHome)}</p>
            <p className="text-sm opacity-70 mt-2">{fmt(Math.round(results.takeHome / 12))}/month • {fmt(Math.round(results.takeHome / 26))}/biweekly</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-3">
            <h3 className="font-bold text-lg text-primary dark:text-accent mb-3">Tax breakdown</h3>
            {[
              { label: "Gross income", value: fmt(incomeValue), color: "text-gray-700 dark:text-gray-200" },
              { label: "RRSP deduction", value: rrspValue > 0 ? `-${fmt(rrspValue)}` : "-", color: "text-green-600 dark:text-green-400" },
              { label: "Taxable income", value: fmt(results.taxableIncome), color: "text-gray-700 dark:text-gray-200", bold: true },
              { label: "Federal income tax", value: `-${fmt(results.federalTax)}`, color: "text-red-600 dark:text-red-400" },
              { label: `${provinceName} tax`, value: `-${fmt(results.provTax)}`, color: "text-red-600 dark:text-red-400" },
              { label: "CPP contributions", value: `-${fmt(results.cpp)}`, color: "text-orange-600 dark:text-orange-400" },
              { label: "EI premiums", value: selfEmployed ? "-" : `-${fmt(results.ei)}`, color: "text-orange-600 dark:text-orange-400" },
              { label: "Total deductions", value: `-${fmt(results.totalDeductions)}`, color: "text-gray-700 dark:text-gray-200", bold: true },
            ].map((row) => (
              <div key={row.label} className={`flex justify-between items-center text-sm ${row.bold ? "font-bold border-t dark:border-gray-700 pt-2" : ""}`}>
                <span className="text-gray-600 dark:text-gray-400">{row.label}</span>
                <span className={row.color}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg text-primary dark:text-accent mb-3">Your tax rates</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Effective Rate", value: pct(results.effectiveRate), sub: "total deductions divided by gross income" },
                { label: "Marginal Rate", value: pct(results.marginalCombined), sub: "combined rate on the next dollar" },
                { label: "Federal Marginal", value: pct(results.marginalFederal), sub: "federal bracket rate" },
                { label: "Provincial Marginal", value: pct(results.marginalProv), sub: "provincial bracket rate" },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-primary dark:text-accent">{item.value}</div>
                  <div className="text-xs font-semibold mt-1">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h3 className="font-bold text-lg text-primary dark:text-accent mb-4">Where your income goes</h3>
        <div className="space-y-3">
          {[
            { label: "Take-home pay", amount: results.takeHome, color: "bg-green-500" },
            { label: "Federal tax", amount: results.federalTax, color: "bg-red-400" },
            { label: "Provincial tax", amount: results.provTax, color: "bg-red-300" },
            { label: "CPP", amount: results.cpp, color: "bg-orange-400" },
            { label: "EI", amount: results.ei, color: "bg-orange-300" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-32 text-sm text-right text-gray-600 dark:text-gray-400 shrink-0">{item.label}</div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-5 overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: incomeValue > 0 ? `${(item.amount / incomeValue) * 100}%` : "0%" }} />
              </div>
              <div className="w-24 text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0">{fmt(item.amount)}</div>
            </div>
          ))}
        </div>
      </div>

      {rrspValue === 0 && incomeValue > 50000 && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <p className="font-bold text-blue-800 dark:text-blue-300 mb-1">RRSP deduction opportunity</p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            At this income level, a $10,000 RRSP contribution could save roughly <strong>{fmt(Math.round(10000 * results.marginalCombined))}</strong> in tax.
            <SurfaceTrackedLink to="/tools/rrsp-calculator" eventName="tool_result_cta_click" ctaLabel="rrsp_opportunity_banner" trackingParams={{ tool_name: "income_tax_calculator", section: "opportunity_banner", destination_type: "tool" }} className="underline font-semibold ml-1">Open the RRSP calculator</SurfaceTrackedLink>
          </p>
        </div>
      )}

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-primary dark:text-accent">How to use this income tax calculator</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            This Canadian income tax calculator is designed for planning questions like “What is my estimated take-home pay?”, “How much does province matter?”, and “What could an RRSP contribution do to my tax result?” It is most helpful when you use it to compare scenarios rather than to treat one number as exact payroll output.
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Start with gross income and province, then test what happens when you add an RRSP contribution or toggle self-employment. That gives you a faster way to understand take-home pay, effective rate, and marginal rate than reading bracket tables alone. It also makes the next decision clearer: whether to move into RRSP planning, TFSA planning, or paycheque budgeting.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-primary dark:text-accent">What this calculator does not include</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>Every personal credit, deduction, and benefit that may apply on a full tax return.</li>
            <li>Employer-specific payroll quirks, taxable benefits, or unusual compensation setups.</li>
            <li>Province-specific details that go beyond the simplified planning model on this page.</li>
            <li>Full self-employment tax and business-expense treatment.</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            That limitation is normal for a fast planning tool. The point is to understand directionally how income, province, and RRSP deductions affect the result before you move into filing or professional advice.
          </p>
        </div>
      </section>

      <MethodologyPanel
        title="How this tax calculator works"
        summary="This calculator estimates income tax using 2026 federal and provincial bracket assumptions, then adds CPP and EI payroll deductions to show approximate take-home pay. It is designed for directional planning, not tax filing."
        assumptions={[
          "The federal 2026 bracket assumptions reflect CRA payroll guidance published for January 1, 2026, including a 14% lowest federal rate. Provincial handling here remains simplified.",
          "CPP and EI are modeled using standard payroll assumptions and maximums rather than employer-specific payroll systems.",
          "This page does not include every tax credit, deduction, benefit, or employment nuance that may appear on a real return or pay stub.",
          "RRSP contributions are treated as reducing taxable income before income tax is calculated.",
        ]}
        sources={[
          { label: "CRA: Personal income tax rates", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-rates.html" },
          { label: "CRA: CPP and EI payroll deductions", href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/calculating-deductions.html" },
        ]}
      />

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <SurfaceTrackedLink to="/tools/rrsp-calculator" eventName="tool_result_cta_click" ctaLabel="result_card_rrsp_calculator" trackingParams={{ tool_name: "income_tax_calculator", section: "next_steps", destination_type: "tool" }} className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition text-center">
          <p className="font-semibold text-primary dark:text-accent mt-2">RRSP Calculator</p>
          <p className="text-xs text-gray-500 mt-1">See how deductions affect refunds and long-term growth</p>
        </SurfaceTrackedLink>
        <SurfaceTrackedLink to="/tools/tfsa-calculator" eventName="tool_result_cta_click" ctaLabel="result_card_tfsa_calculator" trackingParams={{ tool_name: "income_tax_calculator", section: "next_steps", destination_type: "tool" }} className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition text-center">
          <p className="font-semibold text-primary dark:text-accent mt-2">TFSA Calculator</p>
          <p className="text-xs text-gray-500 mt-1">Compare tax-free growth against taxable investing</p>
        </SurfaceTrackedLink>
        <SurfaceTrackedLink to="/blog/canadian-tax-brackets-2026" eventName="tool_result_cta_click" ctaLabel="result_card_tax_brackets_guide" trackingParams={{ tool_name: "income_tax_calculator", section: "next_steps", destination_type: "article" }} className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition text-center">
          <p className="font-semibold text-primary dark:text-accent mt-2">2026 Tax Brackets</p>
          <p className="text-xs text-gray-500 mt-1">Read the bracket guide alongside the calculator</p>
        </SurfaceTrackedLink>
      </div>

      <div className="mt-12">
        <FAQ items={FAQS} />
      </div>
    </div>
  );
}
