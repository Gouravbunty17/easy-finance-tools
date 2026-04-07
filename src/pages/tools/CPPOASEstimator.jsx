import React, { useState } from "react";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolPageSchema from "../../components/ToolPageSchema";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const FAQS = [
  { q: "Is this my official CPP amount?", a: "No. This estimator is directional only. Your official CPP amount depends on your real contribution history and Service Canada records." },
  { q: "Does this estimate OAS clawback?", a: "Yes. It applies a simplified recovery-tax check based on the retirement income entered." },
  { q: "Should I delay CPP or OAS?", a: "It depends on longevity expectations, health, taxable income, and other retirement assets. This page shows tradeoffs, not a one-size-fits-all answer." },
  { q: "Does this include GIS?", a: "Yes, but only as a rough eligibility and amount indicator. GIS rules are more nuanced than this model." },
];

const MAX_CPP_65 = 1433;
const MAX_CPP2_65 = 61;
const YMPE_2026 = 71300;
const YMPE2_2026 = 81900;
const OAS_MONTHLY_65 = 762;
const OAS_CLAWBACK_MIN = 93454;
const GIS_SINGLE_MAX = 1072;
const GIS_COUPLE_MAX = 645;
const CPP_EARLY_MONTHLY = 0.006;
const CPP_LATE_MONTHLY = 0.007;
const OAS_DEFER_MONTHLY = 0.006;

function estimateCPP(yearsContributed, avgIncome, retirementAge) {
  const dropoutYears = Math.floor(yearsContributed * 0.17);
  const effectiveYears = Math.max(0, yearsContributed - dropoutYears);
  const maxEffectiveYears = 36;
  const incomeFraction = Math.min(avgIncome / YMPE_2026, 1.0);
  const yearFraction = Math.min(effectiveYears / maxEffectiveYears, 1.0);
  const baseCPP = Math.round(MAX_CPP_65 * incomeFraction * yearFraction);
  const cpp2Fraction = avgIncome > YMPE_2026 ? Math.min((avgIncome - YMPE_2026) / (YMPE2_2026 - YMPE_2026), 1.0) * yearFraction : 0;
  const cpp2 = Math.round(MAX_CPP2_65 * cpp2Fraction);
  const totalCPPAt65 = baseCPP + cpp2;
  const monthsDiff = (retirementAge - 65) * 12;
  const adjusted = monthsDiff < 0 ? Math.round(totalCPPAt65 * (1 + CPP_EARLY_MONTHLY * monthsDiff)) : Math.round(totalCPPAt65 * (1 + CPP_LATE_MONTHLY * monthsDiff));
  return { baseCPP, cpp2, totalAt65: totalCPPAt65, adjusted: Math.max(0, adjusted) };
}

function estimateOAS(yearsInCanada, collectAge) {
  const fraction = Math.min(yearsInCanada / 40, 1.0);
  const baseOAS = Math.round(OAS_MONTHLY_65 * fraction);
  const monthsDeferred = Math.max(0, (collectAge - 65) * 12);
  const adjusted = Math.round(baseOAS * (1 + OAS_DEFER_MONTHLY * monthsDeferred));
  return { baseOAS, adjusted };
}

function oasClawback(retirementIncome, oasMonthly) {
  if (retirementIncome <= OAS_CLAWBACK_MIN) return { clawback: 0, netOAS: oasMonthly };
  const annualOAS = oasMonthly * 12;
  const clawAmount = Math.min(annualOAS, (retirementIncome - OAS_CLAWBACK_MIN) * 0.15);
  const netOAS = Math.max(0, Math.round((annualOAS - clawAmount) / 12));
  return { clawback: Math.round(clawAmount / 12), netOAS };
}

export default function CPPOASEstimator() {
  const [currentAge, setCurrentAge] = useState(40);
  const [retirementAge, setRetirementAge] = useState(65);
  const [oasAge, setOasAge] = useState(65);
  const [yearsContrib, setYearsContrib] = useState(20);
  const [avgIncome, setAvgIncome] = useState(75000);
  const [yearsCanada, setYearsCanada] = useState(35);
  const [retirementIncome, setRetirementIncome] = useState(50000);
  const [maritalStatus, setMaritalStatus] = useState("single");
  const [result, setResult] = useState(null);
  const currentAgeValue = asNumber(currentAge);
  const yearsContribValue = asNumber(yearsContrib);
  const avgIncomeValue = asNumber(avgIncome);
  const yearsCanadaValue = asNumber(yearsCanada);
  const retirementIncomeValue = asNumber(retirementIncome);

  const calculate = () => {
    const futureYears = Math.max(0, retirementAge - currentAgeValue);
    const totalYears = Math.min(yearsContribValue + futureYears, 39);
    const totalYearsCA = Math.min(yearsCanadaValue + futureYears, 40);

    const cpp = estimateCPP(totalYears, avgIncomeValue, retirementAge);
    const oas = estimateOAS(totalYearsCA, oasAge);
    const { clawback, netOAS } = oasClawback(retirementIncomeValue, oas.adjusted);
    const gisThreshold = maritalStatus === "single" ? 22056 : 29136;
    const gisEligible = retirementIncomeValue < gisThreshold;
    const gisAmount = gisEligible ? (maritalStatus === "single" ? GIS_SINGLE_MAX : GIS_COUPLE_MAX) : 0;
    const totalMonthly = cpp.adjusted + netOAS + gisAmount;
    const totalAnnual = totalMonthly * 12;

    const scenarios = [60, 65, 67, 70].map((age) => ({ age, cpp: estimateCPP(totalYears, avgIncomeValue, age).adjusted }));
    const cppAt60 = estimateCPP(totalYears, avgIncomeValue, 60).adjusted;
    const cppAt65 = cpp.totalAt65;
    const cppAt70 = estimateCPP(totalYears, avgIncomeValue, 70).adjusted;
    const breakEven60vs65 = cppAt65 - cppAt60 > 0 ? Math.round((cppAt60 * 60) / (cppAt65 - cppAt60)) : null;
    const breakEven65vs70 = cppAt70 - cppAt65 > 0 ? Math.round((cppAt65 * 60) / (cppAt70 - cppAt65)) : null;

    const lifetimeData = [];
    for (let endAge = 65; endAge <= 90; endAge++) {
      lifetimeData.push({
        age: endAge,
        early: cppAt60 * 12 * (endAge - 60),
        standard: cppAt65 * 12 * Math.max(0, endAge - 65),
        late: cppAt70 * 12 * Math.max(0, endAge - 70),
      });
    }

    setResult({
      cpp,
      oas,
      netOAS,
      clawback,
      gisEligible,
      gisAmount,
      totalMonthly,
      totalAnnual,
      scenarios,
      breakEven60vs65,
      breakEven65vs70,
      cppAt60,
      cppAt65,
      cppAt70,
      lifetimeData,
      totalYears,
      totalYearsCA,
    });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <SEO
        title="CPP and OAS Estimator 2026 - Canadian Retirement Income Calculator"
        description="Estimate CPP, OAS, clawback risk, and rough GIS eligibility for retirement planning in Canada."
        canonical="https://easyfinancetools.com/tools/cpp-oas-estimator"
      />
      <ToolPageSchema
        name="CPP and OAS Estimator 2026"
        description="Estimator for Canadian government retirement income, including CPP, OAS, clawback context, and collection-age comparisons."
        canonical="https://easyfinancetools.com/tools/cpp-oas-estimator"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-accent">CPP and OAS Estimator</h1>
        <p className="max-w-3xl text-gray-600 dark:text-gray-300">
          Estimate government retirement income and compare collection-age scenarios for CPP and OAS.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Max CPP at 65", value: `$${MAX_CPP_65}/mo`, sub: "2026 estimate" },
          { label: "OAS at 65", value: `$${OAS_MONTHLY_65}/mo`, sub: "2026 estimate" },
          { label: "Early CPP at 60", value: "-36%", sub: "vs 65 in this model" },
          { label: "Late CPP at 70", value: "+42%", sub: "vs 65 in this model" },
        ].map((item) => (
          <div key={item.label} className="surface-card p-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">{item.label}</div>
            <div className="mt-2 text-2xl font-bold text-primary dark:text-accent">{item.value}</div>
            <div className="mt-1 text-xs text-gray-500">{item.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">Current Age</label>
              <input type="number" value={currentAge} min={18} max={70} onChange={(e) => setCurrentAge(parseNumericInput(e.target.value, { integer: true }))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">CPP Start Age</label>
              <select value={retirementAge} onChange={(e) => setRetirementAge(parseInt(e.target.value))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800">
                {[55, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70].map((age) => <option key={age} value={age}>{age}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">CPP Contribution Years So Far</label>
              <input type="number" value={yearsContrib} min={0} max={39} onChange={(e) => setYearsContrib(parseNumericInput(e.target.value, { integer: true }))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Average Employment Income ($)</label>
              <input type="number" value={avgIncome} onChange={(e) => setAvgIncome(parseNumericInput(e.target.value))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Years in Canada After 18</label>
              <input type="number" value={yearsCanada} min={0} max={47} onChange={(e) => setYearsCanada(parseNumericInput(e.target.value, { integer: true }))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">OAS Start Age</label>
              <select value={oasAge} onChange={(e) => setOasAge(parseInt(e.target.value))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800">
                {[65, 66, 67, 68, 69, 70].map((age) => <option key={age} value={age}>{age}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Expected Retirement Income ($/yr)</label>
              <input type="number" value={retirementIncome} onChange={(e) => setRetirementIncome(parseNumericInput(e.target.value))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Marital Status</label>
              <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800">
                <option value="single">Single / Widowed</option>
                <option value="couple">Married / Common-Law</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-gray-700 dark:bg-slate-900/60 dark:text-slate-300">
            Use your My Service Canada account for official records. This page works best as a scenario planner for collection age and clawback risk.
          </div>

          <button onClick={calculate} className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white transition-colors hover:bg-secondary">
            Estimate My CPP and OAS
          </button>
        </div>

        <div className="space-y-4">
          {result && (
            <>
              <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-center text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Estimated Monthly Government Income</p>
                <p className="mt-2 text-5xl font-bold">${result.totalMonthly.toLocaleString()}/mo</p>
                <p className="mt-2 text-sm text-blue-200">${result.totalAnnual.toLocaleString()}/year</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: `CPP at ${retirementAge}`, value: `$${result.cpp.adjusted.toLocaleString()}/mo` },
                  { label: "Net OAS", value: `$${result.netOAS.toLocaleString()}/mo` },
                  { label: "GIS", value: result.gisAmount > 0 ? `$${result.gisAmount.toLocaleString()}/mo` : "Not modeled" },
                  { label: "OAS clawback", value: result.clawback > 0 ? `-$${result.clawback.toLocaleString()}/mo` : "None" },
                ].map((item) => (
                  <div key={item.label} className="surface-card p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{item.label}</div>
                    <div className="mt-2 text-2xl font-bold text-primary dark:text-accent">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="surface-card p-6">
                <h2 className="mb-3 text-lg font-bold text-primary dark:text-accent">CPP Monthly Amount by Collection Age</h2>
                <Bar data={{ labels: result.scenarios.map((s) => `Age ${s.age}`), datasets: [{ label: "Monthly CPP", data: result.scenarios.map((s) => s.cpp), backgroundColor: result.scenarios.map((s) => (s.age === retirementAge ? "rgba(37,99,235,0.9)" : "rgba(37,99,235,0.35)")), borderRadius: 6 }] }} options={{ responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `$${ctx.raw.toLocaleString()}/month` } } }, scales: { y: { ticks: { callback: (v) => `$${v}` } } } }} />
              </div>

              <div className="surface-card p-6">
                <h2 className="mb-3 text-lg font-bold text-primary dark:text-accent">Lifetime CPP Income Comparison</h2>
                <Line data={{ labels: result.lifetimeData.map((d) => `Age ${d.age}`), datasets: [{ label: "Start at 60", data: result.lifetimeData.map((d) => d.early), borderColor: "#f97316", backgroundColor: "transparent", tension: 0.4 }, { label: "Start at 65", data: result.lifetimeData.map((d) => d.standard), borderColor: "#2563eb", backgroundColor: "transparent", tension: 0.4 }, { label: "Start at 70", data: result.lifetimeData.map((d) => d.late), borderColor: "#16a34a", backgroundColor: "transparent", tension: 0.4 }] }} options={{ responsive: true, plugins: { legend: { position: "top" } }, scales: { y: { ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } } } }} />
              </div>

              <div className="surface-card p-5">
                <h2 className="mb-3 text-lg font-bold text-primary dark:text-accent">Break-Even Notes</h2>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>Age 60 vs 65 break-even: <strong>{result.breakEven60vs65 ? `about age ${Math.round(65 + result.breakEven60vs65 / 12)}` : "not available"}</strong></li>
                  <li>Age 65 vs 70 break-even: <strong>{result.breakEven65vs70 ? `about age ${Math.round(70 + result.breakEven65vs70 / 12)}` : "not available"}</strong></li>
                  <li>If your retirement income exceeds <strong>${OAS_CLAWBACK_MIN.toLocaleString()}</strong>, OAS clawback may apply.</li>
                  <li>TFSA withdrawals usually do not count toward the OAS clawback income calculation.</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <MethodologyPanel
        title="How this CPP and OAS estimator works"
        summary="This page uses simplified assumptions about contribution years, earnings relative to pensionable maximums, collection-age adjustments, OAS residency years, and clawback thresholds."
        assumptions={[
          "CPP is estimated using simplified earnings and contribution-year fractions rather than your official statement of contributions.",
          "OAS is estimated based on years in Canada after age 18 and optional deferral.",
          "Clawback and GIS handling are directional only and do not replace official eligibility rules.",
          "All numbers here should be checked against Service Canada before making a retirement decision.",
        ]}
        sources={[
          { label: "Government of Canada: CPP overview", href: "https://www.canada.ca/en/services/benefits/publicpensions/cpp.html" },
          { label: "Government of Canada: OAS overview", href: "https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html" },
        ]}
        note="Educational estimate only. Use My Service Canada for your actual contribution history and official benefit projections."
      />

      <div className="mt-12">
        <FAQ items={FAQS} />
      </div>
    </section>
  );
}
