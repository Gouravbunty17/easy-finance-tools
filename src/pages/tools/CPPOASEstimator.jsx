import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import SourceList from "../../components/SourceList";
import ToolPageSchema from "../../components/ToolPageSchema";
import OfficialSourceNote from "../../components/OfficialSourceNote";
import InlineSourceTrust from "../../components/InlineSourceTrust";
import { StressTestYourInputs, WhenThisToolIsWeakest, WhyThisToolExists } from "../../components/ToolTrustBlocks";
import CalculatorDecisionCheck from "../../components/CalculatorDecisionCheck";
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
import { retirementOfficialSources } from "../../config/officialSources";
import { MAX_CPP_65, YMPE_2026, YAMPE_2026, OAS_MONTHLY_65, OAS_CLAWBACK_MIN, estimateCPP, estimateOAS, oasClawback } from "../../lib/retirementEstimates.mjs";

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const FAQS = [
  { q: "Is this my official CPP amount?", a: "No. This estimator is directional only. Your official CPP amount depends on your real contribution history and Service Canada records." },
  { q: "Does this estimate OAS clawback?", a: "Yes. It applies a simplified recovery-tax check based on the retirement income entered." },
  { q: "Should I delay CPP or OAS?", a: "It depends on longevity expectations, health, taxable income, and other retirement assets. This page shows tradeoffs, not a one-size-fits-all answer." },
  { q: "Does this include GIS?", a: "No. GIS is excluded because income and household eligibility cannot be determined from these inputs. Use the official OAS benefits estimator." },
];

function fmtCurrency(value) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);
}

export default function CPPOASEstimator() {
  const [currentAge, setCurrentAge] = useState(40);
  const [retirementAge, setRetirementAge] = useState(65);
  const [oasAge, setOasAge] = useState(65);
  const [yearsContrib, setYearsContrib] = useState(20);
  const [avgIncome, setAvgIncome] = useState(75000);
  const [yearsCanada, setYearsCanada] = useState(35);
  const [retirementIncome, setRetirementIncome] = useState(50000);
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
    // GIS is excluded; max benefit is not the personal entitlement.
    const totalMonthly = cpp.adjusted + netOAS;
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
        title="CPP and OAS Estimator Canada 2026 | Retirement Income"
        description="Estimate Canadian CPP, OAS, OAS clawback risk, rough GIS eligibility, and collection-age scenarios for retirement income planning."
        canonical="https://easyfinancetools.com/tools/cpp-oas-estimator"
      />
      <ToolPageSchema
        name="CPP and OAS Estimator 2026"
        description="Estimator for Canadian government retirement income, including CPP, OAS, clawback context, and collection-age comparisons."
        canonical="https://easyfinancetools.com/tools/cpp-oas-estimator"
        category="FinanceApplication"
      />

      <OfficialSourceNote
        title="Source check for CPP and OAS"
        body="CPP and OAS estimates should be checked against Service Canada and Government of Canada records before retirement-income decisions."
        sources={retirementOfficialSources}
      />
      <CalculatorDecisionCheck className="mb-8" />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-accent">CPP and OAS Estimator</h1>
        <p className="max-w-3xl text-gray-600 dark:text-gray-300">
          Estimate Canadian government retirement income and compare CPP/OAS collection-age scenarios. This page is for retirement planning conversations, not an official Service Canada benefit statement or personalized financial advice.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Max CPP at 65", value: `${MAX_CPP_65.toLocaleString("en-CA", { minimumFractionDigits: 2 })}/mo`, sub: "January 2026 official maximum" },
          { label: "OAS at 65", value: `${OAS_MONTHLY_65.toFixed(2)}/mo`, sub: "Oct–Dec 2026 maximum" },
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
                {[60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70].map((age) => <option key={age} value={age}>{age}</option>)}
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
              <label className="mb-1 block text-sm font-semibold">Estimated Net World Income ($/yr, incl. OAS)</label>
              <input type="number" value={retirementIncome} onChange={(e) => setRetirementIncome(parseNumericInput(e.target.value))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-gray-700 dark:bg-slate-900/60 dark:text-slate-300">
            Use My Service Canada for official records. The 2026 CPP earnings ceilings are {fmtCurrency(YMPE_2026)} and {fmtCurrency(YAMPE_2026)}. OAS uses the Oct–Dec 2026 maximum. GIS is excluded. These are current-dollar illustrations, not forecasts.
          </div>

          <button onClick={calculate} className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white transition-colors hover:bg-secondary">
            Estimate My CPP and OAS
          </button>
        </div>

        <div className="space-y-4">
          {result && (
            <>
              <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-center text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Estimated Monthly CPP + OAS (GIS excluded)</p>
                <p className="mt-2 text-5xl font-bold">${result.totalMonthly.toLocaleString()}/mo</p>
                <p className="mt-2 text-sm text-blue-200">${result.totalAnnual.toLocaleString()}/year</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: `CPP at ${retirementAge}`, value: `$${result.cpp.adjusted.toLocaleString()}/mo` },
                  { label: "Net OAS", value: `$${result.netOAS.toLocaleString()}/mo` },
                  { label: "GIS", value: "Not included" },
                  { label: "OAS clawback", value: result.clawback > 0 ? `-$${result.clawback.toLocaleString()}/mo` : "None" },
                ].map((item) => (
                  <div key={item.label} className="surface-card p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{item.label}</div>
                    <div className="mt-2 text-2xl font-bold text-primary dark:text-accent">{item.value}</div>
                  </div>
                ))}
              </div>

              <InlineSourceTrust
                label="Government benefit references"
                note="CPP and OAS estimates should be compared with Government of Canada pages and your My Service Canada records."
                sources={[retirementOfficialSources[0], retirementOfficialSources[1]]}
              />

              <div className="grid gap-4 lg:grid-cols-3">
                <WhyThisToolExists>
                  This tool exists because CPP and OAS timing decisions are easier to understand when monthly benefit estimates, clawback risk, and break-even timing are shown together.
                </WhyThisToolExists>
                <WhenThisToolIsWeakest>
                  The estimate is weakest when contribution history, residency years, marital status, GIS eligibility, or taxable retirement income differs from the simplified inputs.
                </WhenThisToolIsWeakest>
                <StressTestYourInputs>
                  Compare starting CPP at 60, 65, and 70, then test higher retirement income. Benefit timing should be checked against both cash flow and tax impact.
                </StressTestYourInputs>
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
                  <li>If 2026 net world income exceeds <strong>${OAS_CLAWBACK_MIN.toLocaleString()}</strong>, OAS recovery tax may apply in the July 2027–June 2028 recovery period.</li>
                  <li>TFSA withdrawals usually do not count toward OAS recovery income. Actual recovery periods use prior-year income.</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What this calculator does</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Estimate the public-pension layer of retirement income</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This estimator models CPP, OAS, and rough OAS recovery tax using simplified Canadian retirement assumptions. GIS is excluded. It helps you see how start age, contribution years, average income, and residency years can affect the monthly income layer that may support RRSP, TFSA, pension, and non-registered savings.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use it</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Enter work history, residency, and retirement income</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Use your My Service Canada records if you have them. Enter current age, CPP start age, contribution years, average employment income, years in Canada after age 18, OAS start age, net world income, then compare the output against your own records.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Inputs explained</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What changes your CPP and OAS estimate</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["CPP start age", "Starting before 65 reduces the modeled monthly amount; starting after 65 increases it in this simplified model."],
            ["Contribution years and average income", "These provide a rough proxy. Enhanced contributions on income from $74,600 to $85,000 are not separately modeled."],
            ["Years in Canada after 18", "OAS is modeled from residency years, capped at the full-residency assumption."],
            ["Expected retirement income", "Used to estimate whether OAS clawback or rough GIS eligibility may be relevant."],
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
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Example: default Canadian retirement scenario</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            With the current default inputs, the tool estimates benefits using age {currentAge}, CPP start age {retirementAge}, {yearsContrib} CPP contribution years so far, {fmtCurrency(avgIncomeValue)} average employment income, and {yearsCanada} years in Canada after age 18. Click the button to calculate a monthly CAD estimate and compare start-age scenarios.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to read your result</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Treat CPP and OAS as one layer, not the whole plan</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The result shows estimated monthly public-pension income, not your full retirement budget. Use it beside the <Link to="/tools/rrsp-calculator" className="text-primary underline dark:text-secondary">RRSP calculator</Link>, <Link to="/tools/tfsa-calculator" className="text-primary underline dark:text-secondary">TFSA calculator</Link>, and <Link to="/tools/fire-calculator" className="text-primary underline dark:text-secondary">FIRE calculator</Link> to test how private savings may fill the gap.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Official records matter more than estimates</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <li>- Assuming the maximum CPP amount applies without checking contribution history; the second CPP earnings ceiling is not modeled separately.</li>
          <li>- Forgetting that OAS eligibility depends on residency rules and can differ for partial pensions.</li>
          <li>- Ignoring OAS clawback when retirement income is high.</li>
          <li>- Treating GIS as automatically payable; this calculator excludes it.</li>
        </ul>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related tools and guides</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/tools" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">All calculators</Link>
          <Link to="/tools/rrsp-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">RRSP calculator</Link>
          <Link to="/tools/tfsa-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA calculator</Link>
          <Link to="/tools/inflation-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Inflation calculator</Link>
          <Link to="/blog/tfsa-vs-rrsp-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA vs RRSP guide</Link>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Disclaimer</p>
        <p className="mt-3 text-sm leading-7 text-amber-800 dark:text-amber-200">
          This is a simplified current-dollar estimate. CPP + OAS totals exclude GIS and taxes other than the modeled OAS recovery tax. Actual benefits depend on lifetime earnings, residency, income and future payment rates.
        </p>
      </section>

      <MethodologyPanel
        title="Methodology and assumptions"
        summary="This page uses simplified assumptions about contribution years, earnings relative to pensionable maximums, collection-age adjustments, OAS residency years, and clawback thresholds."
        assumptions={[
          "CPP is estimated using simplified earnings and contribution-year fractions rather than your official statement of contributions.",
          "OAS is estimated based on years in Canada after age 18 and optional deferral.",
          "OAS recovery uses the $95,323 threshold for 2026 income (July 2027–June 2028 recovery period); GIS is excluded.",
          "All numbers here should be checked against Service Canada before making a retirement decision.",
        ]}
        sources={[
          { label: "Government of Canada: CPP overview", href: "https://www.canada.ca/en/services/benefits/publicpensions/cpp.html" },
          { label: "Government of Canada: OAS overview", href: "https://www.canada.ca/en/services/benefits/publicpensions/old-age-security.html" },
        ]}
        note="Educational estimate only. Use My Service Canada for your actual contribution history and official benefit projections."
      />

      <SourceList
        title="Official retirement-benefit sources to verify"
        intro="Use these government references to confirm CPP, OAS, and retirement-account income rules before relying on a benefit estimate."
        sources={retirementOfficialSources}
      />

      <div className="mt-12">
        <FAQ items={FAQS} />
      </div>
    </section>
  );
}
