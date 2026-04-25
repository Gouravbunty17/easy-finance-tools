import React, { useState } from "react";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolPageSchema from "../../components/ToolPageSchema";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FAQS = [
  { q: "What is the inclusion rate?", a: "In this calculator, gains up to $250,000 use a 50% inclusion rate, while the amount above that threshold uses a higher inclusion rate. This page is a planning estimate and should be verified against current CRA guidance." },
  { q: "What if I have a capital loss?", a: "A capital loss does not create capital gains tax in the year of the loss. It may be usable against capital gains subject to the applicable tax rules." },
  { q: "Does a TFSA avoid capital gains tax?", a: "Qualified gains inside a TFSA are generally tax-free, which is why the calculator shows $0 tax when the TFSA toggle is enabled." },
  { q: "Does this handle every capital gains rule?", a: "No. It simplifies many details, especially around business shares, rental property, crypto recordkeeping, and loss carry rules." },
];

const TAX_BRACKETS = {
  AB: [[0, 57375, 25], [57375, 114750, 30.5], [114750, 177922, 36], [177922, 253414, 44], [253414, Infinity, 48]],
  BC: [[0, 45654, 20.06], [45654, 91310, 28.7], [91310, 104835, 31.0], [104835, 127299, 38.7], [127299, 172602, 43.7], [172602, 240716, 46.2], [240716, Infinity, 53.5]],
  ON: [[0, 51446, 20.05], [51446, 102894, 29.65], [102894, 150000, 33.89], [150000, 220000, 43.41], [220000, Infinity, 53.53]],
  QC: [[0, 51780, 27.53], [51780, 103545, 37.12], [103545, 126000, 45.71], [126000, Infinity, 53.31]],
  MB: [[0, 36842, 25.8], [36842, 79625, 37.9], [79625, Infinity, 50.4]],
  SK: [[0, 49720, 25], [49720, 142058, 33], [142058, Infinity, 47]],
  NS: [[0, 29590, 23.79], [29590, 59180, 37.17], [59180, 93000, 43.5], [93000, 150000, 50.0], [150000, Infinity, 54.0]],
  NB: [[0, 47715, 27.16], [47715, 95431, 37.52], [95431, 176756, 46.84], [176756, Infinity, 53.3]],
  NL: [[0, 43198, 23.7], [43198, 86395, 33.95], [86395, 154244, 44.5], [154244, Infinity, 51.3]],
  PE: [[0, 32656, 24.8], [32656, 64313, 37.3], [64313, 105000, 42.0], [105000, Infinity, 47.37]],
  NT: [[0, 50597, 20.9], [50597, 101198, 30.6], [101198, 164525, 39], [164525, Infinity, 47]],
  NU: [[0, 53268, 19], [53268, 106537, 28], [106537, 173205, 35], [173205, Infinity, 45]],
  YT: [[0, 55867, 21.4], [55867, 111733, 29.5], [111733, 154906, 36.9], [154906, 500000, 42.0], [500000, Infinity, 48]],
};

function getMarginalRate(province, income) {
  const brackets = TAX_BRACKETS[province] || TAX_BRACKETS.ON;
  for (const [low, high, rate] of brackets) {
    if (income >= low && income < high) return rate / 100;
  }
  return 0.43;
}

function calcTax(gain, income, province) {
  if (gain <= 0) return { taxableGain: 0, taxOwed: 0, inclusionRate: 0.5 };
  const marginalRate = getMarginalRate(province, income);
  if (gain <= 250000) {
    const taxableGain = gain * 0.5;
    return { taxableGain: Math.round(taxableGain), taxOwed: Math.round(taxableGain * marginalRate), inclusionRate: 0.5 };
  }
  const first = 250000 * 0.5;
  const rest = (gain - 250000) * (2 / 3);
  const taxableGain = first + rest;
  return {
    taxableGain: Math.round(taxableGain),
    taxOwed: Math.round(taxableGain * marginalRate),
    inclusionRate: taxableGain / gain,
  };
}

const ASSET_TYPES = [
  { value: "stocks", label: "Stocks / ETFs / Mutual Funds" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "rental", label: "Rental / Investment Property" },
  { value: "business", label: "Small Business Shares (QSBC)" },
  { value: "other", label: "Other Capital Property" },
];

const PROVINCES = [
  ["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"], ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"], ["NS", "Nova Scotia"], ["NT", "Northwest Territories"],
  ["NU", "Nunavut"], ["ON", "Ontario"], ["PE", "Prince Edward Island"], ["QC", "Quebec"],
  ["SK", "Saskatchewan"], ["YT", "Yukon"],
];

const LCGE_LIMIT = 1250000;

export default function CapitalGainsTaxCalculator() {
  const [assetType, setAssetType] = useState("stocks");
  const [purchasePrice, setPurchasePrice] = useState(50000);
  const [salePrice, setSalePrice] = useState(100000);
  const [expenses, setExpenses] = useState(500);
  const [province, setProvince] = useState("ON");
  const [income, setIncome] = useState(80000);
  const [inTFSA, setInTFSA] = useState(false);
  const [result, setResult] = useState(null);
  const purchasePriceValue = asNumber(purchasePrice);
  const salePriceValue = asNumber(salePrice);
  const expensesValue = asNumber(expenses);
  const incomeValue = asNumber(income);

  const calculate = () => {
    const gain = salePriceValue - purchasePriceValue - expensesValue;
    const loss = gain < 0;

    if (inTFSA) {
      setResult({ tfsa: true, gain, salePrice: salePriceValue, purchasePrice: purchasePriceValue, expenses: expensesValue });
      return;
    }

    const isQSBC = assetType === "business";
    const exemptionApplied = isQSBC ? Math.min(gain, LCGE_LIMIT) : 0;
    const taxableCapitalGain = Math.max(0, gain - exemptionApplied);
    const marginalRate = getMarginalRate(province, incomeValue);
    const { taxableGain, taxOwed, inclusionRate } = calcTax(taxableCapitalGain, incomeValue, province);
    const afterTaxProceeds = salePriceValue - taxOwed;
    const effectiveRate = gain > 0 ? (taxOwed / gain) * 100 : 0;
    const tfsaSaving = taxOwed;

    const splitYears = gain > 250000 ? 2 : null;
    let splitTax = null;
    if (splitYears) {
      const halfGain = gain / 2;
      const { taxOwed: t1 } = calcTax(halfGain, incomeValue, province);
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
      salePrice: salePriceValue,
      purchasePrice: purchasePriceValue,
      expenses: expensesValue,
    });
  };

  const gain = salePriceValue - purchasePriceValue - expensesValue;
  const gainPct = purchasePriceValue > 0 ? ((gain / purchasePriceValue) * 100).toFixed(1) : 0;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <SEO
        title="Capital Gains Tax Calculator Canada 2026"
        description="Free Canadian capital gains tax calculator for stocks, crypto, real estate, and other capital property. Estimate the tax owed using 2026 inclusion rates."
        canonical="https://easyfinancetools.com/tools/capital-gains-tax"
      />
      <ToolPageSchema
        name="Canadian Capital Gains Tax Calculator 2026"
        description="Capital gains tax calculator for Canadian planning across stocks, crypto, rental property, and other capital assets."
        canonical="https://easyfinancetools.com/tools/capital-gains-tax"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-accent">Capital Gains Tax Calculator</h1>
        <p className="max-w-3xl text-gray-600 dark:text-gray-300">
          Estimate the taxable portion of a gain, approximate tax owed, and after-tax proceeds.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Important:</strong> This calculator applies a simplified two-tier inclusion-rate model for planning. Confirm current tax rules and timing with CRA guidance or a qualified tax professional before filing or selling.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Current gain or loss", value: `${gain >= 0 ? "+" : "-"}${fmtCurrency(Math.abs(gain))}`, sub: `${gainPct}% vs purchase price` },
          { label: "Province", value: PROVINCES.find(([code]) => code === province)?.[1] || province, sub: "used for marginal-rate estimate" },
          { label: "TFSA toggle", value: inTFSA ? "Enabled" : "Off", sub: inTFSA ? "tax modeled as $0" : "taxable scenario" },
        ].map((card) => (
          <div key={card.label} className="surface-card p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{card.label}</div>
            <div className="mt-2 text-3xl font-bold text-primary dark:text-accent">{card.value}</div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <div className="surface-card p-5">
            <h2 className="mb-3 font-bold text-primary dark:text-accent">Asset Type</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {ASSET_TYPES.map((item) => (
                <button key={item.value} onClick={() => setAssetType(item.value)} className={`rounded-xl border-2 p-3 text-left text-sm font-medium transition-colors ${assetType === item.value ? "border-secondary bg-blue-50 text-primary dark:bg-blue-900/20 dark:text-blue-300" : "border-gray-200 hover:border-gray-400 dark:border-gray-600"}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="surface-card p-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">Purchase Price / ACB ($)</label>
              <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(parseNumericInput(e.target.value))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
              <p className="mt-1 text-xs text-gray-500">Adjusted cost base: what you originally paid, including adjustments where relevant.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Sale Price ($)</label>
              <input type="number" value={salePrice} onChange={(e) => setSalePrice(parseNumericInput(e.target.value))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Selling Expenses ($)</label>
              <input type="number" value={expenses} onChange={(e) => setExpenses(parseNumericInput(e.target.value))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Annual Income ($)</label>
              <input type="number" value={income} onChange={(e) => setIncome(parseNumericInput(e.target.value))} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Province</label>
              <select value={province} onChange={(e) => setProvince(e.target.value)} className="focus-ring w-full rounded-lg border-2 border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-800">
                {PROVINCES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-slate-900/60">
              <div className="flex items-start gap-3">
                <input type="checkbox" id="inTFSA" checked={inTFSA} onChange={(e) => setInTFSA(e.target.checked)} className="mt-0.5 h-5 w-5 accent-blue-600" />
                <label htmlFor="inTFSA" className="cursor-pointer text-sm font-semibold">
                  Held in a TFSA
                  <p className="mt-1 text-xs font-normal text-gray-500">Qualified gains inside a TFSA are modeled as tax-free on this page.</p>
                </label>
              </div>
            </div>
            <button onClick={calculate} className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white transition-colors hover:bg-secondary">
              Calculate My Capital Gains Tax
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {!result && (
            <div className={`rounded-2xl border-2 p-5 ${gain >= 0 ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"}`}>
              <p className={`text-sm font-semibold ${gain >= 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                Current preview: {gain >= 0 ? "capital gain" : "capital loss"} of <strong className="ml-1 text-lg">{fmtCurrency(Math.abs(gain))}</strong>
              </p>
            </div>
          )}

          {result?.tfsa ? (
            <div className="rounded-2xl bg-gradient-to-r from-green-600 to-green-800 p-8 text-center text-white">
              <h2 className="text-2xl font-bold">$0 in Capital Gains Tax</h2>
              <p className="mt-3 text-green-100">This scenario is modeled as a TFSA holding, so the gain of <strong>{fmtCurrency(Math.abs(result.gain))}</strong> is shown as tax-free.</p>
            </div>
          ) : result?.loss ? (
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white">
              <h2 className="text-2xl font-bold">Capital Loss - No Capital Gains Tax Owed</h2>
              <p className="mt-3 text-blue-100">This scenario shows a loss of <strong>{fmtCurrency(Math.abs(result.gain))}</strong>. Loss use rules can be more complex than this planning page models.</p>
            </div>
          ) : result ? (
            <>
              <div className="rounded-2xl bg-gradient-to-r from-red-500 to-red-700 p-8 text-center text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-red-100">Estimated Tax Owed</p>
                <p className="mt-2 text-5xl font-bold">{fmtCurrency(result.taxOwed)}</p>
                <p className="mt-2 text-sm text-red-100">on a gain of {fmtCurrency(result.gain)} with an estimated effective rate of {result.effectiveRate}%</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Capital gain", value: fmtCurrency(result.gain) },
                  { label: "Taxable portion", value: fmtCurrency(result.taxableGain) },
                  { label: "After-tax proceeds", value: fmtCurrency(result.afterTaxProceeds) },
                  { label: "Marginal tax rate", value: `${result.marginalRate}%` },
                ].map((item) => (
                  <div key={item.label} className="surface-card p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{item.label}</div>
                    <div className="mt-2 text-2xl font-bold text-primary dark:text-accent">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="surface-card p-6">
                <h2 className="mb-4 text-lg font-bold text-primary dark:text-accent">Proceeds Breakdown</h2>
                <Bar data={{ labels: ["Scenario"], datasets: [{ label: "Tax Owed", data: [result.taxOwed], backgroundColor: "rgba(239,68,68,0.8)" }, { label: "Original Investment", data: [result.purchasePrice + result.expenses], backgroundColor: "rgba(156,163,175,0.6)" }, { label: "After-Tax Profit", data: [result.gain - result.taxOwed], backgroundColor: "rgba(34,197,94,0.8)" }] }} options={{ indexAxis: "y", responsive: true, scales: { x: { stacked: true, ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } }, y: { stacked: true } }, plugins: { legend: { position: "top" } } }} />
              </div>

              <div className="surface-card p-5">
                <h2 className="mb-3 text-lg font-bold text-primary dark:text-accent">Planning Notes</h2>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>If this asset were held in a <strong>TFSA</strong>, the modeled tax saved would be about <strong>{fmtCurrency(result.tfsaSaving)}</strong>.</li>
                  {result.splitYears && result.splitSaving && <li>Spreading a large sale across multiple years could reduce tax in some cases. This simplified model estimates a difference of about <strong>{fmtCurrency(result.splitSaving)}</strong>.</li>}
                  {result.isQSBC && <li>This scenario applies a simplified <strong>LCGE</strong> adjustment of up to {fmtCurrency(LCGE_LIMIT)} for qualifying business shares.</li>}
                  <li>Crypto, rental property, and business-share sales can involve additional reporting or separate tax issues not shown here.</li>
                </ul>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <MethodologyPanel
        title="How this capital gains calculator works"
        summary="This page estimates the gain after transaction costs, applies a simplified inclusion-rate model, and then multiplies the taxable portion by an estimated combined marginal tax rate for the selected province."
        assumptions={[
          "The income entered is used only to estimate a marginal tax rate for planning.",
          "Gains up to $250,000 use a 50% inclusion rate in this model, while gains above that threshold use a blended higher inclusion rate.",
          "QSBC, rental property, crypto, and loss-use rules are simplified materially.",
          "This calculator does not replace tax filing software or professional advice.",
        ]}
        sources={[
          { label: "CRA: Capital gains", href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4037/capital-gains.html" },
        ]}
        note="Educational estimate only. Verify current tax rules and your asset-specific treatment before filing or selling."
      />

      <div className="mt-12">
        <FAQ items={FAQS} />
      </div>
    </section>
  );
}

function fmtCurrency(value) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);
}
