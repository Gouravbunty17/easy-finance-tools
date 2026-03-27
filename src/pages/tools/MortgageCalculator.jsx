import React, { useState } from "react";
import SEO from "../../components/SEO";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, BarElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

// Canadian mortgages compound semi-annually — this is the correct formula
function getMonthlyRate(annualRate) {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

function calcPayment(principal, annualRate, months) {
  const r = getMonthlyRate(annualRate);
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

// CMHC mortgage insurance rates
function getCMHC(principal, homePrice) {
  const ratio = principal / homePrice;
  if (ratio <= 0.80) return 0;
  if (ratio <= 0.85) return principal * 0.028;
  if (ratio <= 0.90) return principal * 0.031;
  return principal * 0.040;
}

// Land transfer tax by province
function getLTT(price, province, firstTimeBuyer) {
  let tax = 0;
  if (province === "ON") {
    if (price <= 55000) tax = price * 0.005;
    else if (price <= 250000) tax = 275 + (price - 55000) * 0.01;
    else if (price <= 400000) tax = 2225 + (price - 250000) * 0.015;
    else if (price <= 2000000) tax = 4475 + (price - 400000) * 0.02;
    else tax = 36475 + (price - 2000000) * 0.025;
    if (firstTimeBuyer) tax = Math.max(0, tax - 4000);
  } else if (province === "BC") {
    if (price <= 200000) tax = price * 0.01;
    else if (price <= 2000000) tax = 2000 + (price - 200000) * 0.02;
    else tax = 38000 + (price - 2000000) * 0.03;
    if (firstTimeBuyer && price <= 500000) tax = 0;
  } else if (province === "QC") {
    if (price <= 52800) tax = price * 0.005;
    else if (price <= 264000) tax = 264 + (price - 52800) * 0.01;
    else tax = 2376 + (price - 264000) * 0.015;
  } else if (province === "MB") {
    if (price <= 30000) tax = 0;
    else if (price <= 90000) tax = (price - 30000) * 0.005;
    else if (price <= 150000) tax = 300 + (price - 90000) * 0.01;
    else if (price <= 200000) tax = 900 + (price - 150000) * 0.015;
    else tax = 1650 + (price - 200000) * 0.02;
  } else if (province === "NS") {
    tax = price * 0.015;
  } else if (province === "NB") {
    tax = price * 0.01;
  } else if (province === "PE") {
    tax = price <= 30000 ? 0 : (price - 30000) * 0.01;
    if (firstTimeBuyer) tax = Math.max(0, tax - price * 0.005);
  } else {
    // AB, SK, NL, NT, NU, YT — no provincial land transfer tax
    tax = 0;
  }
  return Math.round(tax);
}

const PROVINCES = [
  ["AB","Alberta — No Land Transfer Tax"],["BC","British Columbia"],["MB","Manitoba"],
  ["NB","New Brunswick"],["NL","Newfoundland"],["NS","Nova Scotia"],
  ["NT","Northwest Territories — No LTT"],["NU","Nunavut — No LTT"],["ON","Ontario"],
  ["PE","PEI"],["QC","Quebec"],["SK","Saskatchewan — No LTT"],["YT","Yukon — No LTT"],
];

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(650000);
  const [downPayment, setDownPayment] = useState(130000);
  const [rate, setRate] = useState(5.25);
  const [amort, setAmort] = useState(25);
  const [frequency, setFrequency] = useState("monthly");
  const [province, setProvince] = useState("ON");
  const [firstTime, setFirstTime] = useState(false);
  const [result, setResult] = useState(null);

  const downPct = homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : 0;

  const calculate = () => {
    const principal = homePrice - downPayment;
    if (principal <= 0 || downPayment / homePrice < 0.05) {
      alert("Minimum down payment in Canada is 5% for homes under $500K, or 10% for the portion above $500K.");
      return;
    }

    const cmhc = getCMHC(principal, homePrice);
    const insuredPrincipal = principal + cmhc;
    const months = amort * 12;
    const monthlyPayment = calcPayment(insuredPrincipal, rate, months);

    // Payment by frequency
    let payment, paymentsPerYear, label;
    if (frequency === "monthly") {
      payment = monthlyPayment; paymentsPerYear = 12; label = "Monthly";
    } else if (frequency === "biweekly") {
      payment = (monthlyPayment * 12) / 26; paymentsPerYear = 26; label = "Bi-Weekly";
    } else if (frequency === "accelerated") {
      payment = monthlyPayment / 2; paymentsPerYear = 26; label = "Accelerated Bi-Weekly";
    } else {
      payment = (monthlyPayment * 12) / 52; paymentsPerYear = 52; label = "Weekly";
    }

    // Amortization schedule (yearly)
    const r = getMonthlyRate(rate);
    let balance = insuredPrincipal;
    let totalInterest = 0;
    const yearlyData = [];

    for (let yr = 1; yr <= amort; yr++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let m = 0; m < 12; m++) {
        const interest = balance * r;
        const princ = monthlyPayment - interest;
        yearInterest += interest;
        yearPrincipal += princ;
        balance = Math.max(0, balance - princ);
      }
      totalInterest += yearInterest;
      yearlyData.push({
        year: yr,
        balance: Math.round(balance),
        interest: Math.round(yearInterest),
        principal: Math.round(yearPrincipal),
      });
    }

    const ltt = getLTT(homePrice, province, firstTime);
    const totalCost = insuredPrincipal + totalInterest;

    setResult({
      payment: Math.round(payment * 100) / 100,
      label,
      monthlyPayment,
      insuredPrincipal,
      cmhc: Math.round(cmhc),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
      ltt,
      yearlyData,
      downPct,
      needsCMHC: cmhc > 0,
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Canadian Mortgage Calculator 2026 — Monthly Payment + CMHC + Land Transfer Tax"
        description="Calculate your Canadian mortgage payment, CMHC insurance, and land transfer tax. Free mortgage calculator updated for 2026 rates. Works for all provinces."
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🏡 Canadian Mortgage Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Calculate your real mortgage payment — including <strong>CMHC insurance</strong> and <strong>land transfer tax</strong> — with Canada's semi-annual compounding formula.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold mb-1">Home Price ($)</label>
          <input type="number" value={homePrice}
            onChange={e => setHomePrice(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Down Payment ($) &nbsp;
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${parseFloat(downPct) >= 20 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {downPct}%
            </span>
          </label>
          <input type="number" value={downPayment}
            onChange={e => setDownPayment(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {parseFloat(downPct) >= 20 ? "✅ 20%+ — No CMHC insurance required" : "⚠️ Under 20% — CMHC mortgage insurance applies"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Interest Rate (%)</label>
          <input type="number" step="0.05" value={rate}
            onChange={e => setRate(parseFloat(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Uses Canadian semi-annual compounding (correct formula)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Amortization Period (Years)</label>
          <select value={amort} onChange={e => setAmort(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
            {[5,10,15,20,25,30].map(y => (
              <option key={y} value={y}>{y} years{y === 25 ? " (max insured)" : ""}{y === 30 ? " (uninsured only)" : ""}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Payment Frequency</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-Weekly</option>
            <option value="accelerated">Accelerated Bi-Weekly 💡</option>
            <option value="weekly">Weekly</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">💡 Accelerated bi-weekly saves years of payments</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Province</label>
          <select value={province} onChange={e => setProvince(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:border-secondary outline-none">
            {PROVINCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3 md:col-span-2">
          <input type="checkbox" id="firstTime" checked={firstTime}
            onChange={e => setFirstTime(e.target.checked)}
            className="w-5 h-5 accent-blue-600" />
          <label htmlFor="firstTime" className="text-sm font-semibold cursor-pointer">
            First-Time Home Buyer (land transfer tax rebate where applicable)
          </label>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold hover:bg-secondary transition-colors">
        Calculate My Mortgage 🏡
      </button>

      {result && (
        <div className="mt-10">

          {/* Main payment hero */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-8 text-center">
            <p className="text-blue-200 text-sm font-semibold mb-1">{result.label} Payment</p>
            <p className="text-5xl font-bold mb-2">${result.payment.toLocaleString()}</p>
            <p className="text-blue-200 text-sm">
              on a ${result.insuredPrincipal.toLocaleString()} mortgage over {amort} years at {rate}%
            </p>
          </div>

          {/* Result cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Interest", value: `$${result.totalInterest.toLocaleString()}`, color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" },
              { label: "Total Cost", value: `$${result.totalCost.toLocaleString()}`, color: "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" },
              { label: result.needsCMHC ? "CMHC Insurance" : "CMHC Insurance", value: result.needsCMHC ? `$${result.cmhc.toLocaleString()}` : "Not Required", color: result.needsCMHC ? "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300" : "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" },
              { label: "Land Transfer Tax", value: result.ltt > 0 ? `$${result.ltt.toLocaleString()}` : "None in your province", color: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300" },
            ].map(card => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Closing costs summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8">
            <h2 className="font-bold mb-3 text-blue-800 dark:text-blue-300">💼 Total Cash Needed to Close</h2>
            <div className="space-y-1 text-sm text-blue-900 dark:text-blue-200">
              <div className="flex justify-between"><span>Down Payment</span><strong>${downPayment.toLocaleString()}</strong></div>
              {result.ltt > 0 && <div className="flex justify-between"><span>Land Transfer Tax</span><strong>${result.ltt.toLocaleString()}</strong></div>}
              <div className="flex justify-between"><span>Legal Fees (est.)</span><strong>~$1,500</strong></div>
              <div className="flex justify-between"><span>Home Inspection (est.)</span><strong>~$500</strong></div>
              <div className="border-t border-blue-200 dark:border-blue-700 pt-2 flex justify-between font-bold text-base">
                <span>Estimated Total</span>
                <span className="text-blue-700 dark:text-blue-300">${(downPayment + result.ltt + 2000).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Balance chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-4">📉 Remaining Balance Over Time</h2>
            <Line data={{
              labels: result.yearlyData.map(d => `Yr ${d.year}`),
              datasets: [{
                label: "Remaining Balance",
                data: result.yearlyData.map(d => d.balance),
                fill: true,
                backgroundColor: "rgba(239,68,68,0.1)",
                borderColor: "#ef4444",
                tension: 0.4,
              }]
            }} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` } } }
            }} />
          </div>

          {/* Principal vs Interest bar chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-lg font-bold mb-4">📊 Principal vs Interest Each Year</h2>
            <Bar data={{
              labels: result.yearlyData.map(d => `Yr ${d.year}`),
              datasets: [
                {
                  label: "Principal",
                  data: result.yearlyData.map(d => d.principal),
                  backgroundColor: "rgba(0,168,232,0.8)",
                },
                {
                  label: "Interest",
                  data: result.yearlyData.map(d => d.interest),
                  backgroundColor: "rgba(239,68,68,0.6)",
                }
              ]
            }} options={{
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true, ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` } }
              }
            }} />
          </div>

          {/* CMHC explainer if applicable */}
          {result.needsCMHC && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5 mb-8">
              <h2 className="font-bold mb-2 text-yellow-800 dark:text-yellow-300">⚠️ CMHC Mortgage Insurance</h2>
              <p className="text-sm text-yellow-900 dark:text-yellow-200">
                Your down payment is <strong>{result.downPct}%</strong> — under 20% requires CMHC insurance of{" "}
                <strong>${result.cmhc.toLocaleString()}</strong>. This is added to your mortgage (you don't pay it upfront).
                To avoid CMHC insurance, you'd need a down payment of at least{" "}
                <strong>${Math.ceil(homePrice * 0.20).toLocaleString()}</strong>.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-3">💡 Ways to Pay Off Faster</h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>✅ Switch to <strong>accelerated bi-weekly payments</strong> — typically saves 2-3 years of interest</li>
              <li>✅ Make <strong>lump-sum prepayments</strong> each year (most lenders allow 10-20% annually)</li>
              <li>✅ Increase your <strong>payment amount</strong> when you get a raise</li>
              <li>✅ Renew at a <strong>lower rate</strong> when your term ends — even 0.5% less saves tens of thousands</li>
              <li>✅ Use your <strong>FHSA ($40K)</strong> + <strong>RRSP Home Buyers' Plan ($35K)</strong> for the down payment to avoid CMHC</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
