import React, { useState } from "react";
import SEO from "../../components/SEO";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

function getMonthlyRate(annualRate) {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

function calcMonthlyPayment(principal, annualRate, months) {
  const r = getMonthlyRate(annualRate);
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function getCMHC(principal, homePrice) {
  const ratio = principal / homePrice;
  if (ratio <= 0.80) return 0;
  if (ratio <= 0.85) return principal * 0.028;
  if (ratio <= 0.90) return principal * 0.031;
  return principal * 0.040;
}

function getLTT(price, province) {
  if (province === "ON") {
    if (price <= 55000) return price * 0.005;
    if (price <= 250000) return 275 + (price - 55000) * 0.01;
    if (price <= 400000) return 2225 + (price - 250000) * 0.015;
    if (price <= 2000000) return 4475 + (price - 400000) * 0.02;
    return 36475 + (price - 2000000) * 0.025;
  }
  if (province === "BC") {
    if (price <= 200000) return price * 0.01;
    if (price <= 2000000) return 2000 + (price - 200000) * 0.02;
    return 38000 + (price - 2000000) * 0.03;
  }
  if (province === "QC") {
    if (price <= 52800) return price * 0.005;
    if (price <= 264000) return 264 + (price - 52800) * 0.01;
    return 2376 + (price - 264000) * 0.015;
  }
  return 0;
}

const PROVINCES = [
  ["AB","Alberta"],["BC","British Columbia"],["MB","Manitoba"],["NB","New Brunswick"],
  ["NL","Newfoundland"],["NS","Nova Scotia"],["NT","Northwest Territories"],
  ["NU","Nunavut"],["ON","Ontario"],["PE","PEI"],["QC","Quebec"],
  ["SK","Saskatchewan"],["YT","Yukon"],
];

export default function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState(650000);
  const [downPayment, setDownPayment] = useState(130000);
  const [mortgageRate, setMortgageRate] = useState(5.25);
  const [amort, setAmort] = useState(25);
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [homeAppreciation, setHomeAppreciation] = useState(4);
  const [investReturn, setInvestReturn] = useState(7);
  const [propertyTax, setPropertyTax] = useState(5000);
  const [maintenance, setMaintenance] = useState(300);
  const [condoFees, setCondoFees] = useState(0);
  const [province, setProvince] = useState("ON");
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);
  const homePriceValue = asNumber(homePrice);
  const downPaymentValue = asNumber(downPayment);
  const mortgageRateValue = asNumber(mortgageRate);
  const monthlyRentValue = asNumber(monthlyRent);
  const rentIncreaseValue = asNumber(rentIncrease);
  const homeAppreciationValue = asNumber(homeAppreciation);
  const investReturnValue = asNumber(investReturn);
  const propertyTaxValue = asNumber(propertyTax);
  const maintenanceValue = asNumber(maintenance);
  const condoFeesValue = asNumber(condoFees);
  const yearsValue = Math.max(asNumber(years, 1), 1);

  const calculate = () => {
    const principal = homePriceValue - downPaymentValue + getCMHC(homePriceValue - downPaymentValue, homePriceValue);
    const months = amort * 12;
    const monthlyPayment = calcMonthlyPayment(principal, mortgageRateValue, months);
    const ltt = getLTT(homePriceValue, province);
    const closingCosts = ltt + 2000; // LTT + legal fees

    const r = getMonthlyRate(mortgageRateValue);
    let mortgageBalance = principal;

    const buyData = [];
    const rentData = [];
    const buyNetWorth = [];
    const rentNetWorth = [];

    let homeValue = homePriceValue;
    let rentAmount = monthlyRentValue;
    let totalBuyCost = downPaymentValue + closingCosts;
    let totalRentCost = 0;
    let rentInvestment = downPaymentValue + closingCosts; // renter invests the down payment
    let breakEvenYear = null;

    for (let yr = 1; yr <= yearsValue; yr++) {
      // --- BUYING ---
      let yearMortgage = 0;
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let m = 0; m < 12; m++) {
        const interest = mortgageBalance * r;
        const princ = Math.min(monthlyPayment - interest, mortgageBalance);
        yearInterest += interest;
        yearPrincipal += princ;
        yearMortgage += monthlyPayment;
        mortgageBalance = Math.max(0, mortgageBalance - princ);
      }
      const yearPropertyTax = propertyTaxValue;
      const yearMaintenance = maintenanceValue * 12;
      const yearCondo = condoFeesValue * 12;
      const yearBuyCost = yearMortgage + yearPropertyTax + yearMaintenance + yearCondo;
      totalBuyCost += yearBuyCost;
      homeValue *= (1 + homeAppreciationValue / 100);
      const equity = homeValue - mortgageBalance;
      const buyNetWorthVal = equity - totalBuyCost + downPaymentValue + closingCosts; // simplified net worth

      // --- RENTING ---
      let yearRentCost = 0;
      for (let m = 0; m < 12; m++) {
        yearRentCost += rentAmount;
        rentAmount *= (1 + rentIncreaseValue / 100 / 12);
      }
      totalRentCost += yearRentCost;
      rentInvestment *= Math.pow(1 + investReturnValue / 100, 1);
      const annualSavings = Math.max(0, (monthlyPayment + maintenanceValue + condoFeesValue + propertyTaxValue / 12 - monthlyRentValue) * 12);
      rentInvestment += annualSavings * Math.pow(1 + investReturnValue / 100, 0.5);

      buyData.push(Math.round(totalBuyCost));
      rentData.push(Math.round(totalRentCost));
      buyNetWorth.push(Math.round(equity));
      rentNetWorth.push(Math.round(rentInvestment));

      if (!breakEvenYear && equity > rentInvestment) breakEvenYear = yr;
    }

    const finalBuyNetWorth = buyNetWorth[yearsValue - 1];
    const finalRentNetWorth = rentNetWorth[yearsValue - 1];
    const buyingWins = finalBuyNetWorth > finalRentNetWorth;

    setResult({
      monthlyPayment: Math.round(monthlyPayment),
      ltt: Math.round(ltt),
      closingCosts: Math.round(closingCosts),
      totalBuyCost: buyData[yearsValue - 1],
      totalRentCost: rentData[yearsValue - 1],
      finalBuyNetWorth,
      finalRentNetWorth,
      buyingWins,
      breakEvenYear,
      labels: Array.from({ length: yearsValue }, (_, i) => `Yr ${i + 1}`),
      buyData,
      rentData,
      buyNetWorth,
      rentNetWorth,
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Rent vs Buy Calculator Canada 2026 — Is It Better to Rent or Buy?"
        description="Compare renting vs buying a home in Canada. See total costs, net worth, and the break-even year. Free Canadian rent vs buy calculator for 2026."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🏠 vs 🔑 Rent vs Buy Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          The real answer isn't always "buy." This calculator compares your <strong>total costs</strong> and <strong>net worth</strong> over time so you can make the right decision for your situation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

        {/* Buying inputs */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <h2 className="font-bold text-blue-800 dark:text-blue-300 mb-4 text-base">🏠 If You Buy</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Home Price ($)</label>
              <input type="number" value={homePrice} onChange={e => setHomePrice(parseNumericInput(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={e => setDownPayment(parseNumericInput(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
              <p className="text-xs text-gray-500 mt-1">{homePriceValue > 0 ? ((downPaymentValue / homePriceValue) * 100).toFixed(1) : 0}% down</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Mortgage Rate (%)</label>
              <input type="number" step="0.05" value={mortgageRate} onChange={e => setMortgageRate(parseNumericInput(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Amortization (Years)</label>
              <select value={amort} onChange={e => setAmort(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
                {[5,10,15,20,25,30].map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Annual Property Tax ($)</label>
              <input type="number" value={propertyTax} onChange={e => setPropertyTax(parseNumericInput(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Monthly Maintenance ($)</label>
              <input type="number" value={maintenance} onChange={e => setMaintenance(parseNumericInput(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
              <p className="text-xs text-gray-500 mt-1">Rule of thumb: 1% of home price/yr ÷ 12</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Monthly Condo Fees ($)</label>
              <input type="number" value={condoFees} onChange={e => setCondoFees(parseNumericInput(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
              <p className="text-xs text-gray-500 mt-1">Enter 0 if detached/semi-detached</p>
            </div>
          </div>
        </div>

        {/* Renting + assumptions inputs */}
        <div className="space-y-5">
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-5">
            <h2 className="font-bold text-green-800 dark:text-green-300 mb-4 text-base">🔑 If You Rent</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Monthly Rent ($)</label>
                <input type="number" value={monthlyRent} onChange={e => setMonthlyRent(parseNumericInput(e.target.value))}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Annual Rent Increase (%)</label>
                <input type="number" step="0.5" value={rentIncrease} onChange={e => setRentIncrease(parseNumericInput(e.target.value))}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
                <p className="text-xs text-gray-500 mt-1">Ontario rent control: ~2.5% guideline</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Investment Return on Savings (%)</label>
                <input type="number" step="0.5" value={investReturn} onChange={e => setInvestReturn(parseNumericInput(e.target.value))}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
                <p className="text-xs text-gray-500 mt-1">Return on down payment if invested (e.g. XEQT ≈ 7-8%)</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h2 className="font-bold mb-4 text-base">📐 Assumptions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Annual Home Appreciation (%)</label>
                <input type="number" step="0.5" value={homeAppreciation} onChange={e => setHomeAppreciation(parseNumericInput(e.target.value))}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
                <p className="text-xs text-gray-500 mt-1">Canadian avg: 4-6% historically</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Province</label>
                <select value={province} onChange={e => setProvince(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
                  {PROVINCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Years to Compare</label>
                <input type="number" value={years} min={1} max={35} onChange={e => setYears(parseNumericInput(e.target.value, { integer: true }))}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold hover:bg-secondary transition-colors">
        Compare Renting vs Buying 📊
      </button>

      {result && (
        <div className="mt-10">

          {/* Verdict */}
          <div className={`rounded-2xl p-8 mb-8 text-center text-white ${result.buyingWins ? "bg-gradient-to-r from-blue-600 to-blue-800" : "bg-gradient-to-r from-green-600 to-green-800"}`}>
            <p className="text-4xl mb-3">{result.buyingWins ? "🏠" : "🔑"}</p>
            <h2 className="text-2xl font-bold mb-2">
              {result.buyingWins ? "Buying Builds More Wealth" : "Renting Wins Financially"}
            </h2>
            <p className="opacity-90 text-sm max-w-xl mx-auto">
              {result.buyingWins
                ? `After ${years} years, buying leaves you with $${result.finalBuyNetWorth.toLocaleString()} in home equity vs $${result.finalRentNetWorth.toLocaleString()} invested as a renter — a difference of $${(result.finalBuyNetWorth - result.finalRentNetWorth).toLocaleString()}.`
                : `After ${years} years, renting and investing the difference leaves you with $${result.finalRentNetWorth.toLocaleString()} vs $${result.finalBuyNetWorth.toLocaleString()} in home equity — a difference of $${(result.finalRentNetWorth - result.finalBuyNetWorth).toLocaleString()}.`}
            </p>
            {result.breakEvenYear && (
              <p className="mt-3 text-sm font-semibold opacity-90">
                📅 Break-even point: <strong>Year {result.breakEvenYear}</strong> — buying catches up to renting after this
              </p>
            )}
            {!result.breakEvenYear && !result.buyingWins && (
              <p className="mt-3 text-sm font-semibold opacity-90">
                📅 Buying never catches up within {years} years under these assumptions
              </p>
            )}
          </div>

          {/* Net worth cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Buy: Home Equity", value: `$${result.finalBuyNetWorth.toLocaleString()}`, color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300" },
              { label: "Rent: Portfolio Value", value: `$${result.finalRentNetWorth.toLocaleString()}`, color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" },
              { label: "Total Buying Costs", value: `$${result.totalBuyCost.toLocaleString()}`, color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" },
              { label: "Total Renting Costs", value: `$${result.totalRentCost.toLocaleString()}`, color: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300" },
            ].map(card => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Net worth chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-4">📈 Net Worth: Buying vs Renting Over {years} Years</h2>
            <Line data={{
              labels: result.labels,
              datasets: [
                {
                  label: "🏠 Buy — Home Equity",
                  data: result.buyNetWorth,
                  borderColor: "#2563eb",
                  backgroundColor: "rgba(37,99,235,0.1)",
                  fill: false,
                  tension: 0.4,
                },
                {
                  label: "🔑 Rent — Investment Portfolio",
                  data: result.rentNetWorth,
                  borderColor: "#16a34a",
                  backgroundColor: "rgba(22,163,74,0.1)",
                  fill: false,
                  tension: 0.4,
                }
              ]
            }} options={{
              responsive: true,
              plugins: { legend: { display: true, position: "top" } },
              scales: { y: { ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` } } }
            }} />
          </div>

          {/* Total costs chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-4">💸 Cumulative Costs: Buying vs Renting</h2>
            <Line data={{
              labels: result.labels,
              datasets: [
                {
                  label: "🏠 Total Cost of Buying",
                  data: result.buyData,
                  borderColor: "#ef4444",
                  backgroundColor: "rgba(239,68,68,0.08)",
                  fill: true,
                  tension: 0.4,
                },
                {
                  label: "🔑 Total Cost of Renting",
                  data: result.rentData,
                  borderColor: "#f97316",
                  backgroundColor: "rgba(249,115,22,0.08)",
                  fill: true,
                  tension: 0.4,
                }
              ]
            }} options={{
              responsive: true,
              plugins: { legend: { display: true, position: "top" } },
              scales: { y: { ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` } } }
            }} />
          </div>

          {/* Monthly cost breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-4">📋 Monthly Cost Breakdown (Year 1)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🏠 Buying</h3>
                <div className="space-y-1 text-sm">
                  {[
                    ["Mortgage Payment", `$${result.monthlyPayment.toLocaleString()}`],
                    ["Property Tax", `$${Math.round(propertyTax / 12).toLocaleString()}`],
                    ["Maintenance", `$${maintenance.toLocaleString()}`],
                    ...(condoFees > 0 ? [["Condo Fees", `$${condoFees.toLocaleString()}`]] : []),
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b dark:border-gray-700 py-1">
                      <span className="text-gray-600 dark:text-gray-400">{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold text-blue-700 dark:text-blue-300">
                    <span>Total Monthly</span>
                    <span>${(result.monthlyPayment + Math.round(propertyTax / 12) + maintenance + condoFees).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">🔑 Renting</h3>
                <div className="space-y-1 text-sm">
                  {[
                    ["Monthly Rent", `$${monthlyRent.toLocaleString()}`],
                    ["Renter's Insurance (est.)", "$30"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b dark:border-gray-700 py-1">
                      <span className="text-gray-600 dark:text-gray-400">{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold text-green-700 dark:text-green-300">
                    <span>Total Monthly</span>
                    <span>${(monthlyRent + 30).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upfront costs */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8">
            <h2 className="font-bold mb-3 text-blue-800 dark:text-blue-300">💼 Upfront Costs to Buy</h2>
            <div className="space-y-1 text-sm text-blue-900 dark:text-blue-200">
              <div className="flex justify-between"><span>Down Payment</span><strong>${downPayment.toLocaleString()}</strong></div>
              {result.ltt > 0 && <div className="flex justify-between"><span>Land Transfer Tax ({province})</span><strong>${result.ltt.toLocaleString()}</strong></div>}
              <div className="flex justify-between"><span>Legal Fees (est.)</span><strong>~$1,500</strong></div>
              <div className="flex justify-between"><span>Home Inspection</span><strong>~$500</strong></div>
              <div className="border-t border-blue-300 dark:border-blue-700 pt-2 flex justify-between font-bold">
                <span>Total Upfront</span>
                <span>${(downPayment + result.closingCosts).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Context note */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-3">🧠 What the Numbers Don't Capture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Buying advantages:</p>
                <ul className="space-y-1">
                  <li>✅ Stability — no risk of eviction</li>
                  <li>✅ Freedom to renovate</li>
                  <li>✅ Forced savings through equity</li>
                  <li>✅ Principal residence exemption (no capital gains tax)</li>
                  <li>✅ Hedge against rent inflation</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400 mb-1">Renting advantages:</p>
                <ul className="space-y-1">
                  <li>✅ Flexibility to move cities or downsize</li>
                  <li>✅ No surprise repair bills</li>
                  <li>✅ Lower upfront cash needed</li>
                  <li>✅ Can invest in diversified assets</li>
                  <li>✅ Less tied to one city's market</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
