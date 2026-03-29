import React, { useState, useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, BarElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const FAQS = [
  { q: "What is DRIP (Dividend Reinvestment Plan)?", a: "A DRIP automatically reinvests your dividend payments into additional shares of the same stock or ETF, rather than paying them out as cash. Over time, DRIP creates a compounding effect — your new shares earn dividends, which buy more shares, and so on. Most Canadian brokerages offer DRIP at no cost." },
  { q: "What is dividend yield?", a: "Dividend yield is the annual dividend per share divided by the current stock price, expressed as a percentage. For example, if a stock pays $2/share annually and trades at $40, the yield is 5%. A high yield can indicate value or risk — always check that the dividend is sustainable (payout ratio under 80% is generally safe)." },
  { q: "What is yield on cost?", a: "Yield on cost (YOC) is your dividend income divided by what you originally paid for the stock — not the current price. If you bought a stock at $20 that now pays $2/share annually, your YOC is 10% even if the current yield is only 4%. YOC grows over time as the company increases its dividend." },
  { q: "Should I hold dividend stocks in a TFSA or non-registered account?", a: "Always hold dividend-paying stocks in a TFSA if possible. In a non-registered account, Canadian dividends are eligible for the dividend tax credit (effective tax rate ~15-25%), but the taxes still erode returns. In a TFSA, all dividends and capital gains are completely tax-free. Note: US dividends in a TFSA are subject to 15% US withholding tax — consider holding US dividend stocks in an RRSP instead." },
  { q: "What is a safe dividend payout ratio?", a: "A payout ratio under 60–70% is generally considered sustainable for most companies. REITs and income funds often have higher ratios (80–90%) but are structured for high distribution. A ratio over 100% means the company is paying more in dividends than it earns — a red flag. Look for companies with a history of growing dividends for 5+ consecutive years." },
];

const PRESET_STOCKS = [
  { name: "XEQT (iShares All-Equity)",    ticker: "XEQT", yield: 1.8,  growth: 0.5,  price: 32.00, priceGrowth: 8.0 },
  { name: "VDY (Vanguard Dividend)",       ticker: "VDY",  yield: 4.0,  growth: 5.0,  price: 43.00, priceGrowth: 6.0 },
  { name: "ZWC (BMO Covered Call)",        ticker: "ZWC",  yield: 6.5,  growth: 2.0,  price: 22.00, priceGrowth: 3.0 },
  { name: "TD Bank (TD)",                  ticker: "TD",   yield: 5.1,  growth: 6.0,  price: 84.00, priceGrowth: 5.0 },
  { name: "Royal Bank (RY)",               ticker: "RY",   yield: 3.8,  growth: 7.0,  price: 172.00, priceGrowth: 7.0 },
  { name: "Enbridge (ENB)",               ticker: "ENB",  yield: 7.2,  growth: 3.0,  price: 58.00, priceGrowth: 4.0 },
  { name: "BCE Inc.",                      ticker: "BCE",  yield: 12.0, growth: 0.0,  price: 24.00, priceGrowth: -2.0 },
  { name: "Custom",                        ticker: "",     yield: 4.0,  growth: 5.0,  price: 50.00, priceGrowth: 6.0 },
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

  const applyPreset = (idx) => {
    setPreset(idx);
    const p = PRESET_STOCKS[idx];
    setStockPrice(p.price);
    setDivYield(p.yield);
    setDivGrowth(p.growth);
    setPriceGrowth(p.priceGrowth);
  };

  const results = useMemo(() => {
    const initialShares = investment / stockPrice;
    let shares = initialShares;
    let currentPrice = stockPrice;
    let currentYield = divYield / 100;
    const rows = [];
    let totalDividendsReceived = 0;
    let totalAdditional = 0;

    for (let yr = 1; yr <= years; yr++) {
      // Price grows annually
      currentPrice *= (1 + priceGrowth / 100);
      // Dividend grows annually
      currentYield = (divYield / 100) * Math.pow(1 + divGrowth / 100, yr - 1);
      const annualDivPerShare = currentPrice * currentYield;
      const annualDividend = annualDivPerShare * shares;

      // After-tax dividends (Canadian eligible dividend: ~33% gross-up, DTC reduces effective rate)
      const afterTaxDiv = inTFSA ? annualDividend : annualDividend * (1 - taxRate / 100 * 0.5); // CDN dividend tax credit approx

      totalDividendsReceived += afterTaxDiv;

      // DRIP: buy new shares with dividends
      if (drip) {
        shares += afterTaxDiv / currentPrice;
      }

      // Additional monthly contributions
      const additionalShares = (additionalMonthly * 12) / currentPrice;
      shares += additionalShares;
      totalAdditional += additionalMonthly * 12;

      const portfolioValue = shares * currentPrice;
      const yieldOnCost = (annualDivPerShare * shares) / (investment + totalAdditional) * 100;

      rows.push({
        year: yr,
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
    const initialAnnualDiv = (investment / stockPrice) * stockPrice * (divYield / 100);
    const payoutsPerYear = frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : frequency === "biannual" ? 2 : 1;

    return {
      rows,
      initialShares: Math.round(initialShares * 100) / 100,
      initialAnnualDiv: Math.round(initialAnnualDiv),
      initialMonthlyDiv: Math.round(initialAnnualDiv / 12),
      initialPayment: Math.round(initialAnnualDiv / payoutsPerYear),
      finalShares: final.shares,
      finalValue: final.portfolioValue,
      finalAnnualDiv: final.annualDividend,
      finalMonthlyDiv: final.monthlyDividend,
      finalYOC: final.yieldOnCost,
      totalDividendsReceived: final.totalDividends,
      totalInvested: investment + totalAdditional,
      totalReturn: final.portfolioValue + final.totalDividends - investment - totalAdditional,
    };
  }, [investment, stockPrice, divYield, divGrowth, priceGrowth, years, drip, frequency, inTFSA, taxRate, additionalMonthly]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="Dividend Calculator Canada 2026 — DRIP, Yield on Cost, Income Projection"
        description="Calculate Canadian dividend income with DRIP reinvestment, yield on cost, tax impact, and 20-year income projection. Works for stocks, ETFs, and REITs."
        canonical="https://easyfinancetools.com/tools/dividend-calculator"
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">Dividend Calculator</h1>
        <p className="text-gray-600 dark:text-gray-300">Project your dividend income, DRIP growth, and yield on cost over time.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">

          {/* Preset stocks */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h2 className="font-bold text-primary dark:text-accent mb-3">Quick Start — Popular Canadian Stocks/ETFs</h2>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_STOCKS.map((p, i) => (
                <button key={i} onClick={() => applyPreset(i)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium border-2 transition ${preset === i ? "border-secondary bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-600 hover:border-gray-400"}`}>
                  <div className="font-bold">{p.ticker || "Custom"}</div>
                  <div className="text-gray-500">{p.yield}% yield</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-4">
            <h2 className="font-bold text-primary dark:text-accent">Investment Details</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Initial Investment ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input type="number" value={investment} onChange={e => setInvestment(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none font-semibold text-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Stock/ETF Price ($)</label>
                <input type="number" step="0.01" value={stockPrice} onChange={e => setStockPrice(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dividend Yield (%)</label>
                <input type="number" step="0.1" value={divYield} onChange={e => setDivYield(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Annual Dividend Growth (%)</label>
                <input type="number" step="0.5" value={divGrowth} onChange={e => setDivGrowth(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Annual Price Growth (%)</label>
                <input type="number" step="0.5" value={priceGrowth} onChange={e => setPriceGrowth(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Additional Monthly ($)</label>
                <input type="number" value={additionalMonthly} onChange={e => setAdditionalMonthly(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Investment Horizon (Years)</label>
                <input type="number" min={1} max={50} value={years} onChange={e => setYears(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dividend Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none">
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="biannual">Semi-Annual</option>
                <option value="annual">Annual</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input type="checkbox" id="drip" checked={drip} onChange={e => setDrip(e.target.checked)}
                className="w-5 h-5 accent-primary" />
              <label htmlFor="drip" className="text-sm font-medium cursor-pointer">
                Enable DRIP (Dividend Reinvestment)
              </label>
            </div>

            <div className="border-t dark:border-gray-700 pt-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="inTFSA" checked={inTFSA} onChange={e => setInTFSA(e.target.checked)}
                  className="w-5 h-5 accent-primary" />
                <label htmlFor="inTFSA" className="text-sm font-medium cursor-pointer">
                  Held in TFSA (0% tax on dividends)
                </label>
              </div>
              {!inTFSA && (
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Marginal Tax Rate (%)</label>
                  <input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 focus:border-secondary outline-none" />
                  <p className="text-xs text-gray-500 mt-1">Canadian dividend tax credit applied automatically (~50% effective)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Starting income */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h3 className="font-bold text-primary dark:text-accent mb-3">Starting Income</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Shares Purchased",      value: results.initialShares.toLocaleString() },
                { label: "Annual Dividend Income", value: fmt(results.initialAnnualDiv) },
                { label: "Monthly Income",         value: fmt(results.initialMonthlyDiv) },
                { label: `Per ${frequency === "monthly" ? "month" : frequency === "quarterly" ? "quarter" : frequency === "biannual" ? "6 months" : "year"} Payment`, value: fmtD(results.initialPayment) },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-primary dark:text-accent">{item.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* After N years */}
          <div className="bg-primary text-white rounded-2xl p-6">
            <p className="text-sm font-semibold opacity-80 mb-1">After {years} Years</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold">{fmt(results.finalAnnualDiv)}</div>
                <div className="text-sm opacity-70">Annual Dividend Income</div>
                <div className="text-lg font-semibold mt-1">{fmt(results.finalMonthlyDiv)}/mo</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{fmt(results.finalValue)}</div>
                <div className="text-sm opacity-70">Portfolio Value</div>
                <div className="text-lg font-semibold mt-1">{results.finalYOC}% YOC</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Invested",           value: fmt(results.totalInvested),           color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" },
              { label: "Total Dividends Received", value: fmt(results.totalDividendsReceived),   color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" },
              { label: "Total Return",             value: fmt(results.totalReturn),              color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300" },
              { label: "Final Shares",             value: results.finalShares.toLocaleString(),  color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" },
            ].map(card => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Monthly dividend growth chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h3 className="font-bold text-primary dark:text-accent mb-3">Monthly Dividend Income Over Time</h3>
            <Line data={{
              labels: results.rows.map(r => `Yr ${r.year}`),
              datasets: [{
                label: "Monthly Dividend",
                data: results.rows.map(r => r.monthlyDividend),
                fill: true,
                backgroundColor: "rgba(0,168,232,0.1)",
                borderColor: "#00A8E8",
                tension: 0.4,
                pointRadius: 2,
              }]
            }} options={{
              responsive: true,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => fmt(ctx.raw) } } },
              scales: { y: { ticks: { callback: v => fmt(v) } } }
            }} />
          </div>

          {/* Portfolio value vs dividends */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h3 className="font-bold text-primary dark:text-accent mb-3">Portfolio Value vs Cumulative Dividends</h3>
            <Line data={{
              labels: results.rows.map(r => `Yr ${r.year}`),
              datasets: [
                {
                  label: "Portfolio Value",
                  data: results.rows.map(r => r.portfolioValue),
                  borderColor: "#003366",
                  backgroundColor: "transparent",
                  tension: 0.4,
                  pointRadius: 2,
                },
                {
                  label: "Cumulative Dividends",
                  data: results.rows.map(r => r.totalDividends),
                  borderColor: "#22c55e",
                  backgroundColor: "transparent",
                  tension: 0.4,
                  pointRadius: 2,
                  borderDash: [5,5],
                },
              ]
            }} options={{
              responsive: true,
              plugins: { legend: { position: "top" }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` } } },
              scales: { y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } } }
            }} />
          </div>
        </div>
      </div>

      {/* Year-by-year breakdown table */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h3 className="font-bold text-lg text-primary dark:text-accent">Year-by-Year Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Year", "Shares", "Stock Price", "Annual Dividend", "Monthly Income", "Portfolio Value", "Yield on Cost"].map(h => (
                  <th key={h} className="px-4 py-3 text-right first:text-left font-semibold text-gray-600 dark:text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {results.rows.map((r, i) => (
                <tr key={r.year} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-2.5 font-medium">Year {r.year}</td>
                  <td className="px-4 py-2.5 text-right">{r.shares.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">{fmtD(r.price)}</td>
                  <td className="px-4 py-2.5 text-right text-green-700 dark:text-green-400 font-semibold">{fmt(r.annualDividend)}</td>
                  <td className="px-4 py-2.5 text-right">{fmt(r.monthlyDividend)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-primary dark:text-accent">{fmt(r.portfolioValue)}</td>
                  <td className="px-4 py-2.5 text-right">{r.yieldOnCost}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12">
        <FAQ items={FAQS} />
      </div>
    </div>
  );
}
