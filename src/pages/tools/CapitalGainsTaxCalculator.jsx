import React, { useState } from "react";
import SEO from "../../components/SEO";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, CategoryScale,
  LinearScale, Tooltip, Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Combined federal + provincial marginal rates by province
const TAX_BRACKETS = {
  AB: [[0,57375,25],[57375,114750,30.5],[114750,177922,36],[177922,253414,44],[253414,Infinity,48]],
  BC: [[0,45654,20.06],[45654,91310,28.7],[91310,104835,31.0],[104835,127299,38.7],[127299,172602,43.7],[172602,240716,46.2],[240716,Infinity,53.5]],
  ON: [[0,51446,20.05],[51446,102894,29.65],[102894,150000,33.89],[150000,220000,43.41],[220000,Infinity,53.53]],
  QC: [[0,51780,27.53],[51780,103545,37.12],[103545,126000,45.71],[126000,Infinity,53.31]],
  MB: [[0,36842,25.8],[36842,79625,37.9],[79625,Infinity,50.4]],
  SK: [[0,49720,25],[49720,142058,33],[142058,Infinity,47]],
  NS: [[0,29590,23.79],[29590,59180,37.17],[59180,93000,43.5],[93000,150000,50.0],[150000,Infinity,54.0]],
  NB: [[0,47715,27.16],[47715,95431,37.52],[95431,176756,46.84],[176756,Infinity,53.3]],
  NL: [[0,43198,23.7],[43198,86395,33.95],[86395,154244,44.5],[154244,Infinity,51.3]],
  PE: [[0,32656,24.8],[32656,64313,37.3],[64313,105000,42.0],[105000,Infinity,47.37]],
  NT: [[0,50597,20.9],[50597,101198,30.6],[101198,164525,39],[164525,Infinity,47]],
  NU: [[0,53268,19],[53268,106537,28],[106537,173205,35],[173205,Infinity,45]],
  YT: [[0,55867,21.4],[55867,111733,29.5],[111733,154906,36.9],[154906,500000,42.0],[500000,Infinity,48]],
};

function getMarginalRate(province, income) {
  const brackets = TAX_BRACKETS[province] || TAX_BRACKETS.ON;
  for (const [low, high, rate] of brackets) {
    if (income >= low && income < high) return rate / 100;
  }
  return 0.43;
}

// Canadian capital gains inclusion rates (2024 federal budget rules)
// - First $250,000 of annual gains: 50% inclusion
// - Above $250,000: 66.67% inclusion
function calcTax(gain, income, province) {
  if (gain <= 0) return { taxableGain: 0, taxOwed: 0, inclusionRate: 0.5 };
  const marginalRate = getMarginalRate(province, income);
  let taxOwed = 0;
  let taxableGain = 0;

  if (gain <= 250000) {
    taxableGain = gain * 0.5;
    taxOwed = taxableGain * marginalRate;
    return { taxableGain: Math.round(taxableGain), taxOwed: Math.round(taxOwed), inclusionRate: 0.5 };
  } else {
    const first = 250000 * 0.5;
    const rest = (gain - 250000) * (2 / 3);
    taxableGain = first + rest;
    taxOwed = taxableGain * marginalRate;
    const blendedInclusion = taxableGain / gain;
    return { taxableGain: Math.round(taxableGain), taxOwed: Math.round(taxOwed), inclusionRate: blendedInclusion };
  }
}

const ASSET_TYPES = [
  { value: "stocks", label: "📈 Stocks / ETFs / Mutual Funds" },
  { value: "crypto", label: "₿ Cryptocurrency" },
  { value: "rental", label: "🏠 Rental / Investment Property" },
  { value: "business", label: "🏢 Small Business Shares (QSBC)" },
  { value: "other", label: "📦 Other Capital Property" },
];

const PROVINCES = [
  ["AB","Alberta"],["BC","British Columbia"],["MB","Manitoba"],["NB","New Brunswick"],
  ["NL","Newfoundland"],["NS","Nova Scotia"],["NT","Northwest Territories"],
  ["NU","Nunavut"],["ON","Ontario"],["PE","PEI"],["QC","Quebec"],
  ["SK","Saskatchewan"],["YT","Yukon"],
];

// Lifetime Capital Gains Exemption (LCGE) 2026 estimate
const LCGE_LIMIT = 1250000;

export default function CapitalGainsTaxCalculator() {
  const [assetType, setAssetType] = useState("stocks");
  const [purchasePrice, setPurchasePrice] = useState(50000);
  const [salePrice, setSalePrice] = useState(100000);
  const [expenses, setExpenses] = useState(500); // trading fees, legal fees
  const [province, setProvince] = useState("ON");
  const [income, setIncome] = useState(80000);
  const [inTFSA, setInTFSA] = useState(false);
  const [isHalf2024, setIsHalf2024] = useState(false); // pre June 25, 2024 rule
  const [result, setResult] = useState(null);

  const calculate = () => {
    const gain = salePrice - purchasePrice - expenses;
    const loss = gain < 0;

    if (inTFSA) {
      setResult({ tfsa: true, gain, salePrice, purchasePrice, expenses });
      return;
    }

    // QSBC gets Lifetime Capital Gains Exemption
    const isQSBC = assetType === "business";
    const exemptionApplied = isQSBC ? Math.min(gain, LCGE_LIMIT) : 0;
    const taxableCapitalGain = Math.max(0, gain - exemptionApplied);

    const marginalRate = getMarginalRate(province, income);
    const { taxableGain, taxOwed, inclusionRate } = calcTax(taxableCapitalGain, income, province);

    const afterTaxProceeds = salePrice - taxOwed;
    const effectiveRate = gain > 0 ? (taxOwed / gain) * 100 : 0;

    // Compare: what if this was in a TFSA
    const tfsaSaving = taxOwed; // you'd pay $0 in TFSA

    // Scenarios: what if you sold in pieces over multiple years
    const splitYears = gain > 250000 ? 2 : null;
    let splitTax = null;
    if (splitYears) {
      const halfGain = gain / 2;
      const { taxOwed: t1 } = calcTax(halfGain, income, province);
      splitTax = t1 * 2;
    }

    setResult({
      tfsa: false,
      gain: Math.round(gain),
      loss,
      taxableCapitalGain: Math.round(taxableCapitalGain),
      taxableGain,
      taxOwed,
      inclusionRate,
      marginalRate: Math.round(marginalRate * 100),
      afterTaxProceeds: Math.round(afterTaxProceeds),
      effectiveRate: effectiveRate.toFixed(1),
      tfsaSaving,
      isQSBC,
      exemptionApplied: Math.round(exemptionApplied),
      splitYears,
      splitTax: splitTax ? Math.round(splitTax) : null,
      splitSaving: splitTax ? Math.round(taxOwed - splitTax) : null,
      salePrice,
      purchasePrice,
      expenses,
    });
  };

  const gain = salePrice - purchasePrice - expenses;
  const gainPct = purchasePrice > 0 ? ((gain / purchasePrice) * 100).toFixed(1) : 0;

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Canadian Capital Gains Tax Calculator 2026 — Stocks, Crypto, Real Estate"
        description="Calculate capital gains tax in Canada for stocks, crypto, real estate, and more. Updated for 2026 with the new 2/3 inclusion rate on gains over $250K."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          📊 Capital Gains Tax Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Calculate exactly how much tax you owe on your Canadian capital gains — stocks, crypto, real estate, or small business shares.
        </p>
      </div>

      {/* 2024 rule banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          ⚠️ <strong>2024 Rule Change:</strong> Since June 25, 2024, gains over <strong>$250,000/year</strong> are taxed at a <strong>2/3 inclusion rate</strong> (up from 1/2). Gains under $250K still use the 50% inclusion rate. This calculator applies both rates automatically.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Asset Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ASSET_TYPES.map(a => (
              <button key={a.value} onClick={() => setAssetType(a.value)}
                className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-colors ${assetType === a.value ? "border-secondary bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-300" : "border-gray-200 dark:border-gray-600 hover:border-gray-400"}`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Purchase Price / ACB ($)</label>
          <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
          <p className="text-xs text-gray-500 mt-1">Adjusted Cost Base — total amount you paid</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Sale Price ($)</label>
          <input type="number" value={salePrice} onChange={e => setSalePrice(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Selling Expenses ($)</label>
          <input type="number" value={expenses} onChange={e => setExpenses(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
          <p className="text-xs text-gray-500 mt-1">Commissions, legal fees, real estate agent fees</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Annual Income ($)</label>
          <input type="number" value={income} onChange={e => setIncome(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
          <p className="text-xs text-gray-500 mt-1">Your income before this sale — determines your marginal rate</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Province</label>
          <select value={province} onChange={e => setProvince(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
            {PROVINCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        <div className="flex items-start gap-3 md:col-span-2">
          <input type="checkbox" id="inTFSA" checked={inTFSA} onChange={e => setInTFSA(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-blue-600" />
          <label htmlFor="inTFSA" className="text-sm font-semibold cursor-pointer">
            This asset is held in a <strong>TFSA</strong> (Tax-Free Savings Account)
            <p className="font-normal text-gray-500 mt-0.5">All gains in a TFSA are 100% tax-free — no capital gains tax applies</p>
          </label>
        </div>
      </div>

      {/* Live gain preview */}
      {!inTFSA && (
        <div className={`rounded-xl p-4 mb-6 border-2 ${gain >= 0 ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"}`}>
          <p className={`text-sm font-semibold ${gain >= 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
            {gain >= 0 ? "📈" : "📉"} Capital {gain >= 0 ? "Gain" : "Loss"}:
            <strong className="text-lg ml-2">${Math.abs(gain).toLocaleString()}</strong>
            <span className="ml-2 opacity-70">({gain >= 0 ? "+" : ""}{gainPct}%)</span>
          </p>
        </div>
      )}

      <button onClick={calculate}
        className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold hover:bg-secondary transition-colors">
        Calculate My Capital Gains Tax 📊
      </button>

      {result && (
        <div className="mt-10">

          {/* TFSA result */}
          {result.tfsa ? (
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-2xl p-8 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h2 className="text-2xl font-bold mb-2">$0 in Capital Gains Tax</h2>
              <p className="opacity-90">
                Your gain of <strong>${Math.abs(result.gain).toLocaleString()}</strong> is completely tax-free inside a TFSA.
                You keep 100% of your profits.
              </p>
            </div>
          ) : result.loss ? (
            /* Capital loss result */
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 text-center mb-8">
              <p className="text-4xl mb-3">📉</p>
              <h2 className="text-2xl font-bold mb-2">Capital Loss — You Owe $0 Tax</h2>
              <p className="opacity-90 max-w-xl mx-auto">
                Your loss of <strong>${Math.abs(result.gain).toLocaleString()}</strong> can be used to offset capital gains from this year, or carried back 3 years / forward indefinitely.
              </p>
            </div>
          ) : (
            <>
              {/* Main result hero */}
              <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl p-8 mb-8 text-center">
                <p className="text-red-200 text-sm font-semibold mb-1">Estimated Tax Owed</p>
                <p className="text-5xl font-bold mb-2">${result.taxOwed.toLocaleString()}</p>
                <p className="text-red-200 text-sm">
                  on a ${result.gain.toLocaleString()} gain · {result.effectiveRate}% effective rate · {result.marginalRate}% marginal rate
                </p>
              </div>

              {/* Result cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Capital Gain", value: `$${result.gain.toLocaleString()}`, color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" },
                  { label: "Taxable Portion", value: `$${result.taxableGain.toLocaleString()}`, color: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300" },
                  { label: "Tax Owed", value: `$${result.taxOwed.toLocaleString()}`, color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" },
                  { label: "After-Tax Proceeds", value: `$${result.afterTaxProceeds.toLocaleString()}`, color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300" },
                ].map(card => (
                  <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                    <p className="text-xs font-semibold opacity-70">{card.label}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Tax breakdown bar chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
                <h2 className="text-lg font-bold mb-4">📊 Where Your Money Goes</h2>
                <Bar data={{
                  labels: ["Your Proceeds Breakdown"],
                  datasets: [
                    {
                      label: "Tax Owed",
                      data: [result.taxOwed],
                      backgroundColor: "rgba(239,68,68,0.8)",
                    },
                    {
                      label: "Original Investment",
                      data: [result.purchasePrice + result.expenses],
                      backgroundColor: "rgba(156,163,175,0.6)",
                    },
                    {
                      label: "After-Tax Profit",
                      data: [result.gain - result.taxOwed],
                      backgroundColor: "rgba(34,197,94,0.8)",
                    },
                  ]
                }} options={{
                  indexAxis: "y",
                  responsive: true,
                  scales: { x: { stacked: true, ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } }, y: { stacked: true } },
                  plugins: { legend: { position: "top" } }
                }} />
              </div>

              {/* How it's calculated */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">🧮 How It's Calculated</h2>
                <div className="space-y-2 text-sm font-mono">
                  {[
                    ["Sale Price", `$${result.salePrice.toLocaleString()}`],
                    ["− Purchase Price (ACB)", `$${result.purchasePrice.toLocaleString()}`],
                    ["− Selling Expenses", `$${result.expenses.toLocaleString()}`],
                    ["= Capital Gain", `$${result.gain.toLocaleString()}`],
                    ...(result.isQSBC && result.exemptionApplied > 0 ? [["− LCGE Exemption", `$${result.exemptionApplied.toLocaleString()}`]] : []),
                    [`× Inclusion Rate (${result.gain > 250000 ? "blended 50%/66.7%" : "50%"})`, `$${result.taxableGain.toLocaleString()} taxable`],
                    [`× Marginal Rate (${result.marginalRate}%)`, `$${result.taxOwed.toLocaleString()} tax`],
                  ].map(([label, value]) => (
                    <div key={label} className={`flex justify-between py-1.5 border-b dark:border-gray-700 ${label.startsWith("=") || label.startsWith("×") ? "font-bold text-primary dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LCGE explainer for QSBC */}
              {result.isQSBC && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5 mb-8">
                  <h2 className="font-bold text-purple-800 dark:text-purple-300 mb-2">🏢 Lifetime Capital Gains Exemption (LCGE)</h2>
                  <p className="text-sm text-purple-900 dark:text-purple-200">
                    Qualifying Small Business Corporation (QSBC) shares may be eligible for the <strong>Lifetime Capital Gains Exemption of ~${LCGE_LIMIT.toLocaleString()}</strong>.
                    {result.exemptionApplied > 0
                      ? ` In this calculation, $${result.exemptionApplied.toLocaleString()} of your gain is sheltered by the LCGE.`
                      : " Consult a tax professional to confirm eligibility — your shares must meet CRA's QSBC criteria."
                    }
                  </p>
                </div>
              )}

              {/* Tax saving tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* TFSA comparison */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                  <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">💡 If This Was in a TFSA</h3>
                  <p className="text-sm text-green-900 dark:text-green-200">
                    You'd save <strong className="text-2xl">${result.tfsaSaving.toLocaleString()}</strong> in tax — paying $0 instead of ${result.taxOwed.toLocaleString()}.
                    Consider holding growth assets in your TFSA going forward.
                  </p>
                </div>

                {/* Split sale tip for large gains */}
                {result.splitYears && result.splitTax && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">📅 Split the Sale Over 2 Years</h3>
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      Your gain exceeds $250K, so part is taxed at 66.7%. Selling half this year and half next year
                      could save you approximately <strong className="text-xl">${result.splitSaving?.toLocaleString()}</strong> in tax.
                    </p>
                  </div>
                )}

                {/* RRSP offset tip */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5">
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">📋 RRSP Contribution Tip</h3>
                  <p className="text-sm text-yellow-900 dark:text-yellow-200">
                    An RRSP contribution of <strong>${result.taxableGain.toLocaleString()}</strong> this year would offset your taxable capital gain entirely — reducing your tax bill to ~$0.
                    Only works if you have enough RRSP room.
                  </p>
                </div>

                {/* Capital loss harvesting */}
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5">
                  <h3 className="font-bold dark:text-gray-200 mb-2">🔁 Tax-Loss Harvesting</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Do you have any investments sitting at a <strong>loss</strong>? Selling them before year-end locks in a capital loss that offsets your ${result.gain.toLocaleString()} gain — potentially saving <strong>${result.taxOwed.toLocaleString()}</strong> in tax.
                  </p>
                </div>
              </div>

              {/* Crypto note */}
              {assetType === "crypto" && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-5 mb-8">
                  <h2 className="font-bold text-orange-800 dark:text-orange-300 mb-2">₿ Crypto Tax Notes (Canada)</h2>
                  <ul className="text-sm text-orange-900 dark:text-orange-200 space-y-1">
                    <li>✅ Crypto is taxed as a capital gain when sold, traded, or used to buy goods</li>
                    <li>✅ Trading one crypto for another is a <strong>taxable event</strong></li>
                    <li>✅ Mining income is taxed as <strong>business income</strong>, not capital gains</li>
                    <li>✅ You must report crypto on your T1 return — CRA actively audits crypto</li>
                    <li>✅ Keep records of every transaction including the date, amount in CAD, and exchange used</li>
                  </ul>
                </div>
              )}

              {/* Rental property note */}
              {assetType === "rental" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8">
                  <h2 className="font-bold text-blue-800 dark:text-blue-300 mb-2">🏠 Rental Property Capital Gains Notes</h2>
                  <ul className="text-sm text-blue-900 dark:text-blue-200 space-y-1">
                    <li>✅ You may also owe <strong>recaptured CCA</strong> (depreciation) — this is taxed as income, not capital gains</li>
                    <li>✅ Principal residence exemption does <strong>not</strong> apply to rental properties</li>
                    <li>✅ If you converted your home to a rental, you may have a deemed disposition at the time of conversion</li>
                    <li>✅ Consult a tax professional — rental property dispositions are complex</li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
