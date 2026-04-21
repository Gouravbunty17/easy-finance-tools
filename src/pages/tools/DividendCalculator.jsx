import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolByline from "../../components/ToolByline";
import ToolPageSchema from "../../components/ToolPageSchema";
import ActionableNextSteps from "../../components/ActionableNextSteps";
import EducationalDisclaimer from "../../components/EducationalDisclaimer";
import { trackToolCalculate, trackToolStart } from "../../lib/analytics";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const FAQS = [
  { q: "What is DRIP?", a: "A dividend reinvestment plan automatically uses dividends to buy more shares instead of paying them out in cash. That can increase compounding over time." },
  { q: "What is yield on cost?", a: "Yield on cost compares annual dividend income to the amount you originally invested, not the current market value. It is a planning metric, not a tax filing number." },
  { q: "Should dividend stocks go in a TFSA?", a: "Often yes for Canadian investors, because qualified growth and withdrawals are tax-free. The right account still depends on asset type, foreign withholding, and your broader plan." },
  { q: "Is a higher yield always better?", a: "No. A high yield can reflect risk, a falling share price, or an unsustainable payout. Yield needs to be considered alongside dividend growth and business quality." },
  { q: "Does this calculator know whether the dividend is safe?", a: "No. It projects income using the assumptions you enter. It does not analyze payout ratio, debt, earnings quality, or whether a dividend may be cut." },
];

const PRESET_STOCKS = [
  { name: "XEQT (iShares All-Equity)", ticker: "XEQT", yield: 1.8, growth: 0.5, price: 32.0, priceGrowth: 8.0 },
  { name: "VDY (Vanguard Dividend)", ticker: "VDY", yield: 4.0, growth: 5.0, price: 43.0, priceGrowth: 6.0 },
  { name: "ZWC (BMO Covered Call)", ticker: "ZWC", yield: 6.5, growth: 2.0, price: 22.0, priceGrowth: 3.0 },
  { name: "TD Bank (TD)", ticker: "TD", yield: 5.1, growth: 6.0, price: 84.0, priceGrowth: 5.0 },
  { name: "Royal Bank (RY)", ticker: "RY", yield: 3.8, growth: 7.0, price: 172.0, priceGrowth: 7.0 },
  { name: "Enbridge (ENB)", ticker: "ENB", yield: 7.2, growth: 3.0, price: 58.0, priceGrowth: 4.0 },
  { name: "BCE Inc.", ticker: "BCE", yield: 12.0, growth: 0.0, price: 24.0, priceGrowth: -2.0 },
  { name: "Custom", ticker: "", yield: 4.0, growth: 5.0, price: 50.0, priceGrowth: 6.0 },
];

function fmt(n) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
}

function fmtD(n, d = 2) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}

export default function DividendCalculator() {
  const [preset, setPreset] = useState(1);
  const [investment, setInvestment] = useState(25000);
  const [stockPrice, setStockPrice] = useState(PRESET_STOCKS[1].price);
  const [divYield, setDivYield] = useState(PRESET_STOCKS[1].yield);
  const [divGrowth, setDivGrowth] = useState(PRESET_STOCKS[1].growth);
  const [priceGrowth, setPriceGrowth] = useState(PRESET_STOCKS[1].priceGrowth);
  const [years, setYears] = useState(20);
  const [drip, setDrip] = useState(true);
  const [frequency, setFrequency] = useState("quarterly");
  const [inTFSA, setInTFSA] = useState(true);
  const [taxRate, setTaxRate] = useState(29.65);
  const [additionalMonthly, setAdditionalMonthly] = useState(200);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const trackStartOnce = () => {
    if (hasTrackedStart) return;
    trackToolStart("dividend_calculator", { entry_point: "input_interaction" });
    setHasTrackedStart(true);
  };

  const investmentValue = asNumber(investment);
  const stockPriceValue = Math.max(asNumber(stockPrice, 1), 1);
  const divYieldValue = asNumber(divYield);
  const divGrowthValue = asNumber(divGrowth);
  const priceGrowthValue = asNumber(priceGrowth);
  const yearsValue = Math.max(asNumber(years, 10), 1);
  const taxRateValue = asNumber(taxRate);
  const additionalMonthlyValue = asNumber(additionalMonthly);

  const applyPreset = (idx) => {
    trackStartOnce();
    trackToolCalculate("dividend_calculator", {
      action: "preset_select",
      preset_name: PRESET_STOCKS[idx]?.ticker || "custom",
    });
    setPreset(idx);
    const presetData = PRESET_STOCKS[idx];
    setStockPrice(presetData.price);
    setDivYield(presetData.yield);
    setDivGrowth(presetData.growth);
    setPriceGrowth(presetData.priceGrowth);
  };

  const results = useMemo(() => {
    const initialShares = investmentValue / stockPriceValue;
    let shares = initialShares;
    let currentPrice = stockPriceValue;
    let currentYield = divYieldValue / 100;
    const rows = [];
    let totalDividendsReceived = 0;
    let totalAdditional = 0;

    for (let year = 1; year <= yearsValue; year++) {
      currentPrice *= 1 + priceGrowthValue / 100;
      currentYield = (divYieldValue / 100) * Math.pow(1 + divGrowthValue / 100, year - 1);
      const annualDivPerShare = currentPrice * currentYield;
      const annualDividend = annualDivPerShare * shares;
      const afterTaxDiv = inTFSA ? annualDividend : annualDividend * (1 - (taxRateValue / 100) * 0.5);

      totalDividendsReceived += afterTaxDiv;
      if (drip) shares += afterTaxDiv / currentPrice;

      const additionalShares = (additionalMonthlyValue * 12) / currentPrice;
      shares += additionalShares;
      totalAdditional += additionalMonthlyValue * 12;

      const portfolioValue = shares * currentPrice;
      const yieldOnCost = ((annualDivPerShare * shares) / (investmentValue + totalAdditional)) * 100;

      rows.push({
        year,
        shares: Math.round(shares * 100) / 100,
        price: Math.round(currentPrice * 100) / 100,
        annualDividend: Math.round(afterTaxDiv),
        monthlyDividend: Math.round(afterTaxDiv / 12),
        portfolioValue: Math.round(portfolioValue),
        yieldOnCost: Math.round(yieldOnCost * 10) / 10,
        totalDividends: Math.round(totalDividendsReceived),
      });
    }

    const final = rows[rows.length - 1];
    const initialAnnualDiv = (investmentValue / stockPriceValue) * stockPriceValue * (divYieldValue / 100);

    return {
      rows,
      initialShares: Math.round(initialShares * 100) / 100,
      initialAnnualDiv: Math.round(initialAnnualDiv),
      initialMonthlyDiv: Math.round(initialAnnualDiv / 12),
      finalShares: final.shares,
      finalValue: final.portfolioValue,
      finalAnnualDiv: final.annualDividend,
      finalMonthlyDiv: final.monthlyDividend,
      finalYOC: final.yieldOnCost,
      totalDividendsReceived: final.totalDividends,
      totalInvested: investmentValue + totalAdditional,
      totalReturn: final.portfolioValue + final.totalDividends - investmentValue - totalAdditional,
    };
  }, [investmentValue, stockPriceValue, divYieldValue, divGrowthValue, priceGrowthValue, yearsValue, drip, inTFSA, taxRateValue, additionalMonthlyValue]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="Dividend Calculator Canada 2026 - DRIP, Yield on Cost, Income Projection"
        description="Calculate Canadian dividend income with DRIP reinvestment, yield on cost, tax impact, and long-term income projection."
        canonical="https://easyfinancetools.com/tools/dividend-calculator"
      />
      <ToolPageSchema
        name="Dividend Calculator Canada 2026"
        description="Dividend calculator for projecting income, DRIP reinvestment, tax impact, portfolio value, and yield on cost."
        canonical="https://easyfinancetools.com/tools/dividend-calculator"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-primary dark:text-accent">Dividend Calculator</h1>
        <ToolByline />
        <p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-300">
          Project dividend income, DRIP reinvestment, portfolio value, and yield on cost over time.
        </p>
      </div>

      <EducationalDisclaimer />

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          { title: "Last updated", body: "April 3, 2026" },
          { title: "Methodology", body: "Projects yield, dividend growth, price growth, optional DRIP, and a simplified tax drag assumption." },
          { title: "Best for", body: "Comparing scenarios, account location, contribution pace, and long-term income targets." },
          { title: "Reminder", body: "This page models outcomes from assumptions you enter. It does not judge dividend safety or valuation." },
        ].map((item) => (
          <div key={item.title} className="surface-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{item.title}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
        <h2 className="text-lg font-bold text-primary dark:text-accent">Assumptions at a glance</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "Dividend yield, dividend growth, and price growth are treated as steady planning inputs, even though real markets move unevenly.",
            "If DRIP is enabled, after-tax dividends are reinvested at the projected share price instead of paid out in cash.",
            "Non-registered tax handling is simplified and does not model every provincial dividend credit detail, account type, or foreign withholding rule.",
            "The calculator does not test whether a dividend is sustainable, likely to grow, or at risk of being cut.",
          ].map((item) => (
            <div key={item} className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Initial annual income", value: fmt(results.initialAnnualDiv), sub: "before future growth" },
          { label: `Income in year ${yearsValue}`, value: fmt(results.finalAnnualDiv), sub: drip ? "with DRIP enabled" : "without DRIP reinvestment" },
          { label: "Projected yield on cost", value: `${results.finalYOC}%`, sub: "based on invested capital" },
        ].map((card) => (
          <div key={card.label} className="surface-card p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{card.label}</div>
            <div className="mt-2 text-3xl font-bold text-primary dark:text-accent">{card.value}</div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="surface-card p-5">
            <h2 className="mb-3 font-bold text-primary dark:text-accent">Quick Start Presets</h2>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_STOCKS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(i)}
                  className={`rounded-xl border-2 px-3 py-2 text-left text-xs font-medium transition ${
                    preset === i ? "border-secondary bg-blue-50 text-primary dark:bg-blue-900/20 dark:text-blue-300" : "border-gray-200 hover:border-gray-400 dark:border-gray-600"
                  }`}
                >
                  <div className="font-bold">{p.ticker || "Custom"}</div>
                  <div className="text-gray-500">{p.yield}% yield</div>
                </button>
              ))}
            </div>
          </div>

          <div className="surface-card p-5 space-y-4">
            <h2 className="font-bold text-primary dark:text-accent">Inputs</h2>
            <div>
              <label className="mb-1 block text-sm font-medium">Initial Investment ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-gray-500">$</span>
                <input type="number" value={investment} onChange={(e) => { trackStartOnce(); setInvestment(parseNumericInput(e.target.value)); trackToolCalculate("dividend_calculator", { action: "investment_change" }); }} className="focus-ring w-full rounded-xl border-2 border-gray-200 py-3 pl-8 pr-4 text-lg font-semibold dark:border-gray-600 dark:bg-gray-900" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Share Price ($)</label>
                <input type="number" step="0.01" value={stockPrice} onChange={(e) => { trackStartOnce(); setStockPrice(parseNumericInput(e.target.value)); }} className="focus-ring w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Dividend Yield (%)</label>
                <input type="number" step="0.1" value={divYield} onChange={(e) => { trackStartOnce(); setDivYield(parseNumericInput(e.target.value)); trackToolCalculate("dividend_calculator", { action: "yield_change" }); }} className="focus-ring w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Dividend Growth (%)</label>
                <input type="number" step="0.5" value={divGrowth} onChange={(e) => { trackStartOnce(); setDivGrowth(parseNumericInput(e.target.value)); }} className="focus-ring w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Price Growth (%)</label>
                <input type="number" step="0.5" value={priceGrowth} onChange={(e) => { trackStartOnce(); setPriceGrowth(parseNumericInput(e.target.value)); }} className="focus-ring w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-900" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Additional Monthly ($)</label>
                <input type="number" value={additionalMonthly} onChange={(e) => { trackStartOnce(); setAdditionalMonthly(parseNumericInput(e.target.value)); trackToolCalculate("dividend_calculator", { action: "additional_monthly_change" }); }} className="focus-ring w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Horizon (Years)</label>
                <input type="number" min={1} max={50} value={years} onChange={(e) => { trackStartOnce(); setYears(parseNumericInput(e.target.value, { integer: true })); }} className="focus-ring w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-900" />
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="drip" checked={drip} onChange={(e) => { trackStartOnce(); setDrip(e.target.checked); trackToolCalculate("dividend_calculator", { action: "drip_toggle", enabled: e.target.checked }); }} className="h-5 w-5 accent-primary" />
                <label htmlFor="drip" className="cursor-pointer text-sm font-medium">Enable DRIP reinvestment</label>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="inTFSA" checked={inTFSA} onChange={(e) => { trackStartOnce(); setInTFSA(e.target.checked); trackToolCalculate("dividend_calculator", { action: "account_toggle", account_type: e.target.checked ? "tfsa" : "non_registered" }); }} className="h-5 w-5 accent-primary" />
                <label htmlFor="inTFSA" className="cursor-pointer text-sm font-medium">Held in a TFSA</label>
              </div>
              {!inTFSA && (
                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium">Marginal Tax Rate (%)</label>
                  <input type="number" value={taxRate} onChange={(e) => { trackStartOnce(); setTaxRate(parseNumericInput(e.target.value)); }} className="focus-ring w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-900" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-primary p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Projected Income After {yearsValue} Years</p>
            <p className="mt-2 text-5xl font-bold">{fmt(results.finalAnnualDiv)}</p>
            <p className="mt-2 text-sm text-blue-100">{fmt(results.finalMonthlyDiv)} per month with a projected portfolio value of {fmt(results.finalValue)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Shares Purchased Today", value: results.initialShares.toLocaleString() },
              { label: "Current Annual Income", value: fmt(results.initialAnnualDiv) },
              { label: "Total Invested", value: fmt(results.totalInvested) },
              { label: "Cumulative Dividends", value: fmt(results.totalDividendsReceived) },
              { label: "Total Return", value: fmt(results.totalReturn) },
              { label: "Final Shares", value: results.finalShares.toLocaleString() },
            ].map((item) => (
              <div key={item.label} className="surface-card p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{item.label}</div>
                <div className="mt-2 text-2xl font-bold text-primary dark:text-accent">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="surface-card p-5">
            <h3 className="mb-3 font-bold text-primary dark:text-accent">Monthly Dividend Income Over Time</h3>
            <Line data={{ labels: results.rows.map((r) => `Yr ${r.year}`), datasets: [{ label: "Monthly Dividend", data: results.rows.map((r) => r.monthlyDividend), fill: true, backgroundColor: "rgba(0,168,232,0.1)", borderColor: "#00A8E8", tension: 0.4, pointRadius: 2 }] }} options={{ responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmt(ctx.raw) } } }, scales: { y: { ticks: { callback: (v) => fmt(v) } } } }} />
          </div>

          <div className="surface-card p-5">
            <h3 className="mb-3 font-bold text-primary dark:text-accent">Portfolio Value vs Cumulative Dividends</h3>
            <Line data={{ labels: results.rows.map((r) => `Yr ${r.year}`), datasets: [{ label: "Portfolio Value", data: results.rows.map((r) => r.portfolioValue), borderColor: "#003366", backgroundColor: "transparent", tension: 0.4, pointRadius: 2 }, { label: "Cumulative Dividends", data: results.rows.map((r) => r.totalDividends), borderColor: "#22c55e", backgroundColor: "transparent", tension: 0.4, pointRadius: 2, borderDash: [5, 5] }] }} options={{ responsive: true, plugins: { legend: { position: "top" }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.raw)}` } } }, scales: { y: { ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } } } }} />
          </div>
        </div>
      </div>

      <div className="surface-card mt-8 overflow-hidden">
        <div className="border-b px-6 py-4 dark:border-gray-700">
          <h3 className="text-lg font-bold text-primary dark:text-accent">Year-by-Year Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Year", "Shares", "Share Price", "Annual Dividend", "Monthly Income", "Portfolio Value", "Yield on Cost"].map((header) => (
                  <th key={header} className="px-4 py-3 text-right font-semibold text-gray-600 first:text-left dark:text-gray-300">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {results.rows.map((row, i) => (
                <tr key={row.year} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-2.5 font-medium">Year {row.year}</td>
                  <td className="px-4 py-2.5 text-right">{row.shares.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">{fmtD(row.price)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-green-700 dark:text-green-400">{fmt(row.annualDividend)}</td>
                  <td className="px-4 py-2.5 text-right">{fmt(row.monthlyDividend)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-primary dark:text-accent">{fmt(row.portfolioValue)}</td>
                  <td className="px-4 py-2.5 text-right">{row.yieldOnCost}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MethodologyPanel
        title="How this dividend calculator works"
        summary="This calculator projects price growth, dividend growth, optional DRIP reinvestment, and estimated tax drag to show how dividend income and portfolio value could evolve over time."
        updated="April 3, 2026"
        assumptions={[
          "Dividend yield, price growth, and dividend growth are held constant in the projection.",
          "If DRIP is enabled, after-tax dividends are used to buy additional shares at the projected price.",
          "Tax handling for non-registered holdings is simplified and does not model every provincial detail.",
          "This page is for scenario planning and does not assess dividend sustainability or business risk.",
          "Foreign withholding tax, payout interruptions, and special dividends are not modeled separately.",
        ]}
        sources={[
          { label: "CRA: Tax-Free Savings Account", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html" },
          { label: "Government of Canada: Eligible dividends and taxable income", href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/employers-guide/statutory-deductions-taxable-benefits/eligible-dividends.html" },
        ]}
        note="Educational estimate only. Dividend safety, valuation, and actual tax treatment should be checked before making investment decisions."
      />

      <ActionableNextSteps
        toolName="dividend_calculator"
        title="Turn the income projection into a real portfolio move"
        intro="Use the projected income, DRIP assumptions, and yield on cost to decide what kind of income strategy you actually want, then compare platforms or ETF ideas that fit it."
        meaning={`A projected annual income of ${fmt(results.finalAnnualDiv)} in year ${yearsValue} looks strong only if the yield, growth rate, and account location are realistic. Treat the calculator as a scenario tool, then move into ETF choices and provider comparisons.`}
        steps={[
          "Decide whether you want diversified dividend ETFs or single-stock income exposure.",
          "Check whether the holding should live in a TFSA or another account before acting.",
          "Compare platforms only after the income strategy itself is clear.",
        ]}
        actions={[
          {
            title: "Best ETFs for a TFSA",
            body: "Compare broad-market and dividend ETF choices if you are deciding where income assets fit inside a registered account.",
            href: "/blog/best-etfs-for-tfsa-canada-2026",
            ctaLabel: "best_etfs_for_a_tfsa",
          },
          {
            title: "Weekly dividend ETFs",
            body: "Read the guide before relying on payout-heavy or covered-call funds as an income strategy.",
            href: "/blog/weekly-dividend-etfs",
            ctaLabel: "weekly_dividend_etfs",
          },
          {
            title: "Best dividend platforms",
            body: "Compare Canadian investing platforms before you put the income plan into action.",
            href: "/blog/best-dividend-investing-platforms-canada",
            ctaLabel: "best_dividend_platforms",
          },
        ]}
        referral={{
          placement: "dividend_calculator_referral",
          badge: "Income-investing offer",
          title: "Get $25 free with Wealthsimple",
          highlight: "$25 free",
          description:
            "If you want a simple way to buy dividend ETFs or Canadian dividend stocks, this can be a reasonable next step after you decide on the income strategy and account type.",
          fitHeading: "Why this may fit after the dividend math",
          fitPoints: [
            "You want a simple investing workflow for ETFs or long-term dividend holdings.",
            "Your plan is recurring contributions and DRIP-style reinvestment rather than active trading.",
            "You have already checked whether the income strategy belongs in a TFSA or another account.",
          ],
          details: "Use the referral code at signup | Keep comparing fees, account features, and asset choices before deciding",
          disclosure:
            "Affiliate disclosure: We may earn a referral bonus if you sign up using this code. That does not change how we explain dividend assumptions, yield, or account-location tradeoffs.",
          buttonLabel: "Start with Wealthsimple",
        }}
      />

      <div className="mt-12">
        <FAQ items={FAQS} />
      </div>
    </div>
  );
}
