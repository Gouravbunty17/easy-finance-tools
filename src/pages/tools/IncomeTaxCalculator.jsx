import React, { useState, useMemo } from "react";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import OfficialSourceNote from "../../components/OfficialSourceNote";
import CalculatorCaseStudy from "../../components/CalculatorCaseStudy";
import SourceList from "../../components/SourceList";
import ToolByline from "../../components/ToolByline";
import ToolPageSchema from "../../components/ToolPageSchema";
import InlineSourceTrust from "../../components/InlineSourceTrust";
import { StressTestYourInputs, WhenThisToolIsWeakest, WhyThisToolExists } from "../../components/ToolTrustBlocks";
import CalculatorDecisionCheck from "../../components/CalculatorDecisionCheck";
import { trackEvent, trackToolStart } from "../../lib/analytics";
import SurfaceTrackedLink from "../../components/SurfaceTrackedLink";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";
import { taxOfficialSources } from "../../config/officialSources";
import TaxYearReference from "../../components/TaxYearReference";

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
  basicPersonal: 16452,
};

const PROVINCIAL = {
  AB: { brackets: [{ min: 0, max: 61200, rate: 0.08 }, { min: 61200, max: 154259, rate: 0.1 }, { min: 154259, max: 185111, rate: 0.12 }, { min: 185111, max: 246813, rate: 0.13 }, { min: 246813, max: 370220, rate: 0.14 }, { min: 370220, max: Infinity, rate: 0.15 }], basicPersonal: 22769 },
  BC: { brackets: [{ min: 0, max: 50363, rate: 0.056 }, { min: 50363, max: 100728, rate: 0.077 }, { min: 100728, max: 115648, rate: 0.105 }, { min: 115648, max: 140430, rate: 0.1229 }, { min: 140430, max: 190405, rate: 0.147 }, { min: 190405, max: 265545, rate: 0.168 }, { min: 265545, max: Infinity, rate: 0.205 }], basicPersonal: 13216 },
  MB: { brackets: [{ min: 0, max: 47564, rate: 0.108 }, { min: 47564, max: 101200, rate: 0.1275 }, { min: 101200, max: Infinity, rate: 0.174 }], basicPersonal: 15780 },
  NB: { brackets: [{ min: 0, max: 52333, rate: 0.094 }, { min: 52333, max: 104666, rate: 0.14 }, { min: 104666, max: 193861, rate: 0.16 }, { min: 193861, max: Infinity, rate: 0.195 }], basicPersonal: 13664 },
  NL: { brackets: [{ min: 0, max: 44678, rate: 0.087 }, { min: 44678, max: 89354, rate: 0.145 }, { min: 89354, max: 159528, rate: 0.158 }, { min: 159528, max: 223340, rate: 0.178 }, { min: 223340, max: 285319, rate: 0.198 }, { min: 285319, max: 570638, rate: 0.208 }, { min: 570638, max: 1141275, rate: 0.213 }, { min: 1141275, max: Infinity, rate: 0.218 }], basicPersonal: 13094 },
  NS: { brackets: [{ min: 0, max: 30995, rate: 0.0879 }, { min: 30995, max: 61991, rate: 0.1495 }, { min: 61991, max: 97417, rate: 0.1667 }, { min: 97417, max: 157124, rate: 0.175 }, { min: 157124, max: Infinity, rate: 0.21 }], basicPersonal: 11932 },
  NT: { brackets: [{ min: 0, max: 53003, rate: 0.059 }, { min: 53003, max: 106009, rate: 0.086 }, { min: 106009, max: 172346, rate: 0.122 }, { min: 172346, max: Infinity, rate: 0.1405 }], basicPersonal: 18198 },
  NU: { brackets: [{ min: 0, max: 55801, rate: 0.04 }, { min: 55801, max: 111602, rate: 0.07 }, { min: 111602, max: 181439, rate: 0.09 }, { min: 181439, max: Infinity, rate: 0.115 }], basicPersonal: 19659 },
  ON: { brackets: [{ min: 0, max: 53891, rate: 0.0505 }, { min: 53891, max: 107785, rate: 0.0915 }, { min: 107785, max: 150000, rate: 0.1116 }, { min: 150000, max: 220000, rate: 0.1216 }, { min: 220000, max: Infinity, rate: 0.1316 }], basicPersonal: 12989 },
  PE: { brackets: [{ min: 0, max: 33928, rate: 0.095 }, { min: 33928, max: 65820, rate: 0.1347 }, { min: 65820, max: 106890, rate: 0.166 }, { min: 106890, max: 142520, rate: 0.1762 }, { min: 142520, max: 200000, rate: 0.19 }, { min: 200000, max: Infinity, rate: 0.2 }], basicPersonal: 15000 },
  QC: { brackets: [{ min: 0, max: 53255, rate: 0.14 }, { min: 53255, max: 106495, rate: 0.19 }, { min: 106495, max: 129590, rate: 0.24 }, { min: 129590, max: Infinity, rate: 0.2575 }], basicPersonal: 17183 },
  SK: { brackets: [{ min: 0, max: 54532, rate: 0.105 }, { min: 54532, max: 155805, rate: 0.125 }, { min: 155805, max: Infinity, rate: 0.145 }], basicPersonal: 20381 },
  YT: { brackets: [{ min: 0, max: 58523, rate: 0.064 }, { min: 58523, max: 117045, rate: 0.09 }, { min: 117045, max: 181440, rate: 0.109 }, { min: 181440, max: 500000, rate: 0.128 }, { min: 500000, max: Infinity, rate: 0.15 }], basicPersonal: 16452 },
};

function getFederalBasicPersonalAmount(netIncome) {
  const income = Math.max(0, Number(netIncome) || 0);
  if (income <= 181440) return 16452;
  if (income >= 258482) return 14829;
  return 16452 - ((income - 181440) * 1623) / 77042;
}

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
  const ceiling = 74600;
  const rate = 0.0595;
  const ceiling2 = 85000;
  const rate2 = 0.04;
  const base = Math.max(0, Math.min(income, ceiling) - exemption) * rate;
  const enhanced = Math.max(0, Math.min(income, ceiling2) - ceiling) * rate2;
  return Math.min(base + enhanced, 4646.45);
}

function calcEI(income, province) {
  const rate = province === "QC" ? 0.013 : 0.0163;
  const max = 68900;
  return Math.min(income, max) * rate;
}

function fmt(n) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
}

function pct(n) {
  return `${(n * 100).toFixed(1)}%`;
}

const FAQS = [
  { q: "How accurate is this Canadian income tax calculator?", a: "This calculator uses 2026 CRA tax brackets and standard CPP/EI assumptions. It does not model every credit, provincial surtax, or Quebec QPP/QPIP rule, so results are estimates, not a substitute for a full tax return." },
  { q: "Does this calculator include CPP and EI deductions?", a: "Yes. It estimates CPP contributions and EI premiums based on the income entered, with a self-employed toggle that removes EI and doubles CPP exposure." },
  { q: "What is the difference between marginal and effective tax rate?", a: "Marginal rate is the tax rate on your next dollar of income. Effective rate is total deductions divided by total income. They are not the same, and a higher marginal bracket does not mean all income is taxed at that top rate." },
  { q: "Does this calculator work for self-employed income?", a: "It provides a directional estimate for self-employed users by removing EI and doubling CPP, but it does not model every business deduction or filing nuance." },
  { q: "What about RRSP deductions?", a: "RRSP contributions reduce taxable income before income tax is calculated, which is why they can increase take-home results in this tool." },
];

export default function IncomeTaxCalculator() {
  const [referenceYear, setReferenceYear] = useState(2026);
  const [comparisonRrsp, setComparisonRrsp] = useState(10000);
  const [income, setIncome] = useState(85000);
  const [province, setProvince] = useState("ON");
  const [rrsp, setRrsp] = useState(0);
  const [selfEmployed, setSelfEmployed] = useState(false);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const trackStartOnce = () => {
    if (hasTrackedStart) return;
    trackToolStart("income_tax_calculator", { entry_point: "input_interaction" });
    // Results update immediately in this calculator: count first engaged view once, not every keystroke.
    trackEvent("tool_result_view", { tool_name: "income_tax_calculator", method: "live_preview" });
    setHasTrackedStart(true);
  };

  const incomeValue = asNumber(income);
  const rrspValue = asNumber(rrsp);

  const results = useMemo(() => {
    const taxableIncome = Math.max(0, incomeValue - rrspValue);
    const prov = PROVINCIAL[province];
    const federalTax = calcTax(taxableIncome, FEDERAL.brackets, getFederalBasicPersonalAmount(taxableIncome));
    const provTax = calcTax(taxableIncome, prov.brackets, prov.basicPersonal);
    const cpp = selfEmployed ? Math.min(calcCPP(incomeValue) * 2, 9292.9) : calcCPP(incomeValue);
    const ei = selfEmployed ? 0 : calcEI(incomeValue, province);
    const totalDeductions = federalTax + provTax + cpp + ei;
    const takeHome = incomeValue - totalDeductions;
    const effectiveRate = incomeValue > 0 ? totalDeductions / incomeValue : 0;

    let marginalFederal = 0.14;
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

  const compareTax = (deduction) => {
    const taxable = Math.max(0, incomeValue - Math.max(0, asNumber(deduction)));
    const provincial = PROVINCIAL[province];
    return calcTax(taxable, FEDERAL.brackets, getFederalBasicPersonalAmount(taxable)) + calcTax(taxable, provincial.brackets, provincial.basicPersonal);
  };
  const provinceName = PROVINCES.find((p) => p.code === province)?.name || "Province";

  return (
    <div className="eft-calculator-page eft-workspace mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
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
        <h1 className="eft-display mb-3 text-4xl text-primary dark:text-white sm:text-5xl">Canadian Income Tax Calculator 2026</h1>
        <ToolByline />
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Estimate take-home pay after federal tax, provincial tax, CPP, and EI for any province or territory in Canada.
        </p>
      </div>

      <div className="mb-6"><TaxYearReference year={referenceYear} onChange={year=>{trackStartOnce();setReferenceYear(year);}} /></div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-5">
          <h2 className="text-xl font-bold text-primary dark:text-accent">Your income details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Annual Employment Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input type="number" className="w-full pl-8 pr-4 py-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 text-lg font-semibold" value={income} onChange={(e) => { trackStartOnce(); setIncome(parseNumericInput(e.target.value)); }} min={0} max={2000000} />
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
              <input type="number" className="w-full pl-8 pr-4 py-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" value={rrsp} onChange={(e) => { trackStartOnce(); setRrsp(parseNumericInput(e.target.value)); }} min={0} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Each RRSP dollar reduces taxable income before income tax is calculated.</p>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="selfEmployed" checked={selfEmployed} onChange={(e) => { trackStartOnce(); setSelfEmployed(e.target.checked); }} className="w-5 h-5 accent-primary" />
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

          <InlineSourceTrust
            label="Tax-rate source check"
            note="Federal/provincial tax rates and payroll deductions should be verified with CRA before filing or making tax decisions."
            sources={[taxOfficialSources[0], taxOfficialSources[1]]}
          />
          <CalculatorDecisionCheck className="my-4" />

          <div className="grid gap-4 lg:grid-cols-3">
            <WhyThisToolExists>
              This tool exists to make tax pressure visible before a full return is prepared, especially when comparing RRSP deductions, province, and payroll deductions.
            </WhyThisToolExists>
            <WhenThisToolIsWeakest>
              The estimate is weakest for self-employment, taxable benefits, credits, deductions, split income, business income, or unusual province-specific tax situations.
            </WhenThisToolIsWeakest>
            <StressTestYourInputs>
              Test income with and without bonuses or RRSP deductions. Marginal rate decisions are more useful when you compare more than one income path.
            </StressTestYourInputs>
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-gray-800">
        <h2 className="text-xl font-bold text-primary dark:text-accent">Side-by-side RRSP deduction comparison · 2026 tax assumptions</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Uses the same income and province. The 2027 selector above changes published reference limits only; these calculations stay on the verified 2026 model.</p>
        <label htmlFor="comparison-rrsp" className="mt-4 block text-sm font-semibold">Scenario B: RRSP deduction (CAD)</label>
        <input id="comparison-rrsp" type="number" min="0" value={comparisonRrsp} onChange={e=>{trackStartOnce();setComparisonRrsp(parseNumericInput(e.target.value));}} className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-900" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-sm text-slate-500">Scenario A · no RRSP deduction</p><p className="mt-2 text-2xl font-bold">{fmt(compareTax(0))} tax</p></div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><p className="text-sm text-slate-500">Scenario B · {fmt(asNumber(comparisonRrsp))} deduction</p><p className="mt-2 text-2xl font-bold">{fmt(compareTax(comparisonRrsp))} tax</p></div>
        </div>
        <p className="mt-3 text-sm">Estimated income-tax difference: <strong>{fmt(Math.max(0, compareTax(0)-compareTax(comparisonRrsp)))}</strong>. Verify individual contribution room. RRSP contributions use cash now and withdrawals are taxable later. Employer payroll, surtaxes, and credits are simplified.</p>
      </section>
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

      <OfficialSourceNote
        body="Tax brackets, payroll deductions, CPP, EI, and tax-return treatment should be verified with CRA before filing or making a tax decision."
        sources={[taxOfficialSources[0], taxOfficialSources[1]]}
      />

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

      <CalculatorCaseStudy
        title="Ontario employee earning $80,000 estimating take-home pay"
        scenario="An Ontario employee wants a directional view of annual tax, CPP, EI, and take-home pay before deciding whether an RRSP contribution might reduce taxable income."
        inputs={[
          'Province: Ontario',
          'Employment income: $80,000',
          'RRSP deduction tested: $5,000',
          'Employment type: regular salaried income',
        ]}
        result="The calculator estimates income tax and payroll deductions, then compares take-home pay before and after the RRSP deduction input."
        interpretation="The result is useful for planning cash flow and understanding marginal tax pressure. It should not be used as a filing result because real returns include credits, deductions, benefits, and personal facts this model does not handle."
        limitation="This is not tax software. It does not include every credit, benefit, taxable benefit, self-employment rule, or province-specific nuance."
      />

      <SourceList
        title="Official tax sources to verify"
        intro="Use these CRA references to confirm tax rates, payroll deductions, and return-line treatment before relying on a planning estimate."
        sources={taxOfficialSources}
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
