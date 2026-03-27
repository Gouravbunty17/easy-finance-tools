import React, { useState } from "react";
import SEO from "../../components/SEO";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

// 2026 estimates (indexed annually)
const MAX_CPP_65       = 1433;   // max monthly CPP at age 65
const MAX_CPP2_65      = 61;     // max monthly CPP2 enhancement
const YMPE_2026        = 71300;  // Year's Maximum Pensionable Earnings
const YMPE2_2026       = 81900;  // Second additional ceiling
const OAS_MONTHLY_65   = 762;    // OAS at 65 per month (2026 estimate)
const OAS_CLAWBACK_MIN = 93454;  // OAS clawback threshold 2026 estimate
const OAS_CLAWBACK_MAX = 151668; // Full clawback income
const GIS_SINGLE_MAX   = 1072;   // GIS single max monthly
const GIS_COUPLE_MAX   = 645;    // GIS per person if couple

// CPP adjustment rates
const CPP_EARLY_MONTHLY = 0.006;  // 0.6% reduction per month before 65
const CPP_LATE_MONTHLY  = 0.007;  // 0.7% increase per month after 65
const OAS_DEFER_MONTHLY = 0.006;  // 0.6% increase per month after 65

function estimateCPP(yearsContributed, avgIncome, retirementAge) {
  // CRA formula simplified:
  // Effective years after dropout provisions (17% of lowest years dropped)
  const dropoutYears = Math.floor(yearsContributed * 0.17);
  const effectiveYears = Math.max(0, yearsContributed - dropoutYears);
  const maxEffectiveYears = 36; // ~39 years × (1 - 0.08 dropout) rounded

  const incomeFraction = Math.min(avgIncome / YMPE_2026, 1.0);
  const yearFraction   = Math.min(effectiveYears / maxEffectiveYears, 1.0);
  const baseCPP        = Math.round(MAX_CPP_65 * incomeFraction * yearFraction);

  // CPP2 enhancement (for post-2019 contributions on earnings above YMPE)
  const cpp2Fraction = avgIncome > YMPE_2026
    ? Math.min((avgIncome - YMPE_2026) / (YMPE2_2026 - YMPE_2026), 1.0) * yearFraction
    : 0;
  const cpp2 = Math.round(MAX_CPP2_65 * cpp2Fraction);

  const totalCPPAt65 = baseCPP + cpp2;

  // Adjust for retirement age
  const monthsDiff = (retirementAge - 65) * 12;
  let adjusted;
  if (monthsDiff < 0) {
    adjusted = Math.round(totalCPPAt65 * (1 + CPP_EARLY_MONTHLY * monthsDiff));
  } else {
    adjusted = Math.round(totalCPPAt65 * (1 + CPP_LATE_MONTHLY * monthsDiff));
  }

  return { baseCPP, cpp2, totalAt65: totalCPPAt65, adjusted: Math.max(0, adjusted) };
}

function estimateOAS(yearsInCanada, collectAge) {
  const fraction  = Math.min(yearsInCanada / 40, 1.0);
  const baseOAS   = Math.round(OAS_MONTHLY_65 * fraction);
  const monthsDeferred = Math.max(0, (collectAge - 65) * 12);
  const adjusted  = Math.round(baseOAS * (1 + OAS_DEFER_MONTHLY * monthsDeferred));
  return { baseOAS, adjusted };
}

function oasClawback(retirementIncome, oasMonthly) {
  if (retirementIncome <= OAS_CLAWBACK_MIN) return { clawback: 0, netOAS: oasMonthly };
  const annualOAS  = oasMonthly * 12;
  const clawAmount = Math.min(annualOAS, (retirementIncome - OAS_CLAWBACK_MIN) * 0.15);
  const netOAS     = Math.max(0, Math.round((annualOAS - clawAmount) / 12));
  return { clawback: Math.round(clawAmount / 12), netOAS };
}

export default function CPPOASEstimator() {
  const [currentAge,      setCurrentAge]      = useState(40);
  const [retirementAge,   setRetirementAge]    = useState(65);
  const [oasAge,          setOasAge]           = useState(65);
  const [yearsContrib,    setYearsContrib]     = useState(20);
  const [avgIncome,       setAvgIncome]        = useState(75000);
  const [yearsCanada,     setYearsCanada]      = useState(35);
  const [retirementIncome,setRetirementIncome] = useState(50000);
  const [maritalStatus,   setMaritalStatus]    = useState("single");
  const [result,          setResult]           = useState(null);

  const calculate = () => {
    // Future years of contributions before retirement
    const futureYears    = Math.max(0, retirementAge - currentAge);
    const totalYears     = Math.min(yearsContrib + futureYears, 39);
    const futureYearsCA  = Math.max(0, retirementAge - currentAge);
    const totalYearsCA   = Math.min(yearsCanada + futureYearsCA, 40);

    const cpp  = estimateCPP(totalYears, avgIncome, retirementAge);
    const oas  = estimateOAS(totalYearsCA, oasAge);
    const { clawback, netOAS } = oasClawback(retirementIncome, oas.adjusted);

    // GIS eligibility (rough: income < ~$22K single, ~$29K couple)
    const gisThreshold = maritalStatus === "single" ? 22056 : 29136;
    const totalGovIncome = (cpp.adjusted + netOAS) * 12;
    const gisEligible  = retirementIncome < gisThreshold;
    const gisAmount    = gisEligible
      ? (maritalStatus === "single" ? GIS_SINGLE_MAX : GIS_COUPLE_MAX)
      : 0;

    const totalMonthly = cpp.adjusted + netOAS + gisAmount;
    const totalAnnual  = totalMonthly * 12;

    // Scenarios: early (60), standard (65), late (70)
    const scenarios = [60, 65, 67, 70].map(age => {
      const c = estimateCPP(totalYears, avgIncome, age);
      return { age, cpp: c.adjusted };
    });

    // Break-even analysis: taking CPP at 60 vs 65
    const cppAt60  = estimateCPP(totalYears, avgIncome, 60).adjusted;
    const cppAt65  = cpp.totalAt65;
    const cppAt70  = estimateCPP(totalYears, avgIncome, 70).adjusted;

    // Months to break even: early (60) vs late (65)
    // At 60: collecting 5 yrs extra but less per month
    // Extra collected from 60-65: cppAt60 * 60
    // Monthly gap after 65: (cppAt65 - cppAt60)
    const breakEven60vs65 = (cppAt65 - cppAt60) > 0
      ? Math.round((cppAt60 * 60) / (cppAt65 - cppAt60))
      : null;
    const breakEven65vs70 = (cppAt70 - cppAt65) > 0
      ? Math.round((cppAt65 * 60) / (cppAt70 - cppAt65))
      : null;

    // Lifetime income projection (age 60-90)
    const lifetimeData = [];
    for (let endAge = 65; endAge <= 90; endAge++) {
      const yearsFrom60 = endAge - 60;
      const yearsFrom65 = Math.max(0, endAge - 65);
      const yearsFrom70 = Math.max(0, endAge - 70);
      lifetimeData.push({
        age: endAge,
        early:    cppAt60 * 12 * (endAge - 60),
        standard: cppAt65 * 12 * yearsFrom65,
        late:     cppAt70 * 12 * yearsFrom70,
      });
    }

    setResult({
      cpp, oas, netOAS, clawback,
      gisEligible, gisAmount,
      totalMonthly, totalAnnual,
      scenarios,
      breakEven60vs65, breakEven65vs70,
      cppAt60, cppAt65, cppAt70,
      lifetimeData,
      totalYears,
      totalYearsCA,
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="CPP & OAS Estimator 2026 — Canadian Retirement Income Calculator"
        description="Estimate your Canada Pension Plan (CPP) and Old Age Security (OAS) retirement income. See the best age to collect, clawback risk, and GIS eligibility. Free 2026 Canadian tool."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🇨🇦 CPP & OAS Estimator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Estimate your government retirement income — <strong>Canada Pension Plan (CPP)</strong> and <strong>Old Age Security (OAS)</strong> — and find the optimal age to start collecting.
        </p>
      </div>

      {/* Key numbers banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Max CPP (2026)", value: `$${MAX_CPP_65.toLocaleString()}/mo`, sub: "at age 65" },
          { label: "OAS (2026)", value: `$${OAS_MONTHLY_65}/mo`, sub: "at age 65" },
          { label: "Early CPP (60)", value: "−36%", sub: "vs age 65" },
          { label: "Late CPP (70)", value: "+42%", sub: "vs age 65" },
        ].map(f => (
          <div key={f.label} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-center">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">{f.label}</div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200">{f.value}</div>
            <div className="text-xs text-blue-500">{f.sub}</div>
          </div>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold mb-1">Current Age</label>
          <input type="number" value={currentAge} min={18} max={70}
            onChange={e => setCurrentAge(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Planned Retirement Age</label>
          <select value={retirementAge} onChange={e => setRetirementAge(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
            {[55,60,61,62,63,64,65,66,67,68,69,70].map(a => (
              <option key={a} value={a}>{a}{a === 65 ? " (standard)" : a < 65 ? " (early)" : " (late)"}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Years Contributed to CPP So Far</label>
          <input type="number" value={yearsContrib} min={0} max={39}
            onChange={e => setYearsContrib(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
          <p className="text-xs text-gray-500 mt-1">Check your My Service Canada account for exact years</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Average Annual Employment Income ($)</label>
          <input type="number" value={avgIncome}
            onChange={e => setAvgIncome(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
          <p className="text-xs text-gray-500 mt-1">Max pensionable earnings: ${YMPE_2026.toLocaleString()}/yr</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Years Lived in Canada After Age 18</label>
          <input type="number" value={yearsCanada} min={0} max={47}
            onChange={e => setYearsCanada(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
          <p className="text-xs text-gray-500 mt-1">40 years = full OAS benefit</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Age to Start Collecting OAS</label>
          <select value={oasAge} onChange={e => setOasAge(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
            {[65,66,67,68,69,70].map(a => (
              <option key={a} value={a}>{a}{a === 65 ? " (standard)" : ` (+${((a-65)*12*0.6).toFixed(0)}%)`}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Expected Retirement Income ($/yr)</label>
          <input type="number" value={retirementIncome}
            onChange={e => setRetirementIncome(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
          <p className="text-xs text-gray-500 mt-1">Used to check OAS clawback & GIS eligibility</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Marital Status</label>
          <select value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
            <option value="single">Single / Widowed</option>
            <option value="couple">Married / Common-Law</option>
          </select>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold hover:bg-secondary transition-colors">
        Estimate My CPP & OAS 🇨🇦
      </button>

      {result && (
        <div className="mt-10">

          {/* Hero total */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-2xl p-8 mb-8 text-center">
            <p className="text-blue-200 text-sm font-semibold mb-1">Estimated Monthly Government Income</p>
            <p className="text-5xl font-bold mb-2">${result.totalMonthly.toLocaleString()}/mo</p>
            <p className="text-blue-200 text-sm">${result.totalAnnual.toLocaleString()}/year · starting at age {retirementAge}</p>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <span className="bg-blue-600/50 px-3 py-1 rounded-full">CPP: ${result.cpp.adjusted.toLocaleString()}/mo</span>
              <span className="bg-blue-600/50 px-3 py-1 rounded-full">OAS: ${result.netOAS.toLocaleString()}/mo</span>
              {result.gisAmount > 0 && <span className="bg-green-500/50 px-3 py-1 rounded-full">GIS: ${result.gisAmount.toLocaleString()}/mo</span>}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Your CPP at " + retirementAge, value: `$${result.cpp.adjusted.toLocaleString()}/mo`, color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300" },
              { label: "Your OAS (net)", value: `$${result.netOAS.toLocaleString()}/mo`, color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" },
              { label: result.clawback > 0 ? "OAS Clawback" : "OAS Clawback", value: result.clawback > 0 ? `−$${result.clawback.toLocaleString()}/mo` : "None ✅", color: result.clawback > 0 ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" : "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" },
              { label: "Contribution Years", value: `${result.totalYears} yrs CPP`, color: "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" },
            ].map(card => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* CPP age scenarios bar chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-1">📊 CPP Monthly Amount by Collection Age</h2>
            <p className="text-sm text-gray-500 mb-4">The later you collect, the more you get — but you need to live long enough to break even.</p>
            <Bar data={{
              labels: result.scenarios.map(s => `Age ${s.age}`),
              datasets: [{
                label: "Monthly CPP ($)",
                data: result.scenarios.map(s => s.cpp),
                backgroundColor: result.scenarios.map(s =>
                  s.age === retirementAge ? "rgba(37,99,235,0.9)" : "rgba(37,99,235,0.35)"
                ),
                borderRadius: 6,
              }]
            }} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => `$${ctx.raw.toLocaleString()}/month` } }
              },
              scales: { y: { ticks: { callback: v => `$${v}` } } }
            }} />
          </div>

          {/* Break-even analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
              <h3 className="font-bold mb-3">⏱️ Break-Even: Age 60 vs 65</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">CPP at 60</span><strong>${result.cppAt60.toLocaleString()}/mo</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">CPP at 65</span><strong>${result.cppAt65.toLocaleString()}/mo</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Monthly difference</span><strong>${(result.cppAt65 - result.cppAt60).toLocaleString()}/mo more at 65</strong></div>
                <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-bold">
                  <span>Break-even age</span>
                  <span className="text-blue-600">{result.breakEven60vs65 ? `Age ${Math.round(65 + result.breakEven60vs65 / 12)}` : "N/A"}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">If you live past this age, waiting until 65 pays off more in total.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
              <h3 className="font-bold mb-3">⏱️ Break-Even: Age 65 vs 70</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">CPP at 65</span><strong>${result.cppAt65.toLocaleString()}/mo</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">CPP at 70</span><strong>${result.cppAt70.toLocaleString()}/mo</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Monthly difference</span><strong>${(result.cppAt70 - result.cppAt65).toLocaleString()}/mo more at 70</strong></div>
                <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-bold">
                  <span>Break-even age</span>
                  <span className="text-blue-600">{result.breakEven65vs70 ? `Age ${Math.round(70 + result.breakEven65vs70 / 12)}` : "N/A"}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">If you live past this age, waiting until 70 pays more in total. Canadian life expectancy: ~83.</p>
            </div>
          </div>

          {/* Lifetime CPP income chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-1">📈 Lifetime CPP Income: Early vs Standard vs Late</h2>
            <p className="text-sm text-gray-500 mb-4">Cumulative CPP collected over your lifetime depending on when you start.</p>
            <Line data={{
              labels: result.lifetimeData.map(d => `Age ${d.age}`),
              datasets: [
                { label: "Start at 60", data: result.lifetimeData.map(d => d.early), borderColor: "#f97316", backgroundColor: "transparent", tension: 0.4 },
                { label: "Start at 65", data: result.lifetimeData.map(d => d.standard), borderColor: "#2563eb", backgroundColor: "transparent", tension: 0.4 },
                { label: "Start at 70", data: result.lifetimeData.map(d => d.late), borderColor: "#16a34a", backgroundColor: "transparent", tension: 0.4 },
              ]
            }} options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
              scales: { y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } } }
            }} />
          </div>

          {/* OAS clawback warning */}
          {result.clawback > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5 mb-8">
              <h2 className="font-bold text-red-800 dark:text-red-300 mb-2">⚠️ OAS Clawback (Recovery Tax)</h2>
              <p className="text-sm text-red-900 dark:text-red-200">
                Your estimated retirement income of <strong>${retirementIncome.toLocaleString()}</strong>/yr exceeds the OAS clawback threshold
                of <strong>${OAS_CLAWBACK_MIN.toLocaleString()}</strong>. You'll repay <strong>${(result.clawback * 12).toLocaleString()}/yr</strong> of
                OAS back to the CRA (15% of income above the threshold). At ${OAS_CLAWBACK_MAX.toLocaleString()} income, OAS is fully clawed back.
              </p>
              <p className="text-sm text-red-800 dark:text-red-300 mt-2 font-semibold">
                💡 Strategy: Shift taxable income to your TFSA, or split income with a spouse to stay under the threshold.
              </p>
            </div>
          )}

          {/* GIS */}
          {result.gisEligible && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 mb-8">
              <h2 className="font-bold text-green-800 dark:text-green-300 mb-2">✅ Guaranteed Income Supplement (GIS)</h2>
              <p className="text-sm text-green-900 dark:text-green-200">
                Based on your income, you may be eligible for the <strong>GIS of up to ${result.gisAmount.toLocaleString()}/month</strong>.
                GIS is a non-taxable benefit for low-income OAS recipients. Apply at Service Canada when you turn 65.
              </p>
            </div>
          )}

          {/* CPP breakdown */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">🧮 How Your CPP Is Estimated</h2>
            <div className="space-y-2 text-sm">
              {[
                ["Total CPP contribution years", `${result.totalYears} years`],
                ["After dropout provisions (~17%)", `~${Math.round(result.totalYears * 0.83)} effective years`],
                ["Average income vs YMPE", `$${avgIncome.toLocaleString()} / $${YMPE_2026.toLocaleString()} = ${Math.min(100, Math.round(avgIncome/YMPE_2026*100))}%`],
                ["Base CPP at 65", `$${result.cpp.baseCPP.toLocaleString()}/mo`],
                ...(result.cpp.cpp2 > 0 ? [["CPP2 enhancement (post-2019)", `+$${result.cpp.cpp2}/mo`]] : []),
                ["Total CPP at 65", `$${result.cpp.totalAt65.toLocaleString()}/mo`],
                [retirementAge !== 65 ? `Adjusted for age ${retirementAge}` : "No adjustment", `$${result.cpp.adjusted.toLocaleString()}/mo`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  <span>{label}</span><strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">💡 Key Retirement Planning Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <ul className="space-y-2">
                <li>✅ <strong>Check My Service Canada</strong> for your actual CPP Statement of Contributions</li>
                <li>✅ <strong>Defer CPP to 70</strong> if you have other income sources and expect to live past ~83</li>
                <li>✅ <strong>Take CPP at 60</strong> if you have health concerns or need the income immediately</li>
                <li>✅ <strong>Defer OAS to 70</strong> if your income in retirement would trigger a clawback at 65</li>
              </ul>
              <ul className="space-y-2">
                <li>✅ <strong>Pension splitting</strong> — up to 50% of CPP can be split with a spouse to reduce clawback risk</li>
                <li>✅ <strong>RRSP → RRIF at 71</strong> — plan withdrawals to minimize OAS clawback</li>
                <li>✅ <strong>TFSA in retirement</strong> — TFSA withdrawals don't count as income for OAS clawback</li>
                <li>✅ <strong>Apply 6 months early</strong> — CPP/OAS can only be backdated 11 months</li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 text-center">
            ⚠️ This is an estimate only. Actual CPP/OAS amounts depend on your full contribution history. Visit{" "}
            <a href="https://www.canada.ca/en/services/benefits/publicpensions.html" target="_blank" rel="noopener noreferrer" className="underline">canada.ca</a>{" "}
            or My Service Canada for your official benefit statement.
          </p>
        </div>
      )}
    </section>
  );
}
