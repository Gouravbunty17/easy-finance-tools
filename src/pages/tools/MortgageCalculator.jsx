import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolPageSchema from "../../components/ToolPageSchema";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const FAQS = [
  { q: "Does this mortgage calculator use Canadian compounding rules?", a: "Yes. It converts the quoted annual rate using a semi-annual compounding approach before calculating monthly payments, which is the convention commonly used for Canadian fixed-rate mortgage math." },
  { q: "Does this page include CMHC insurance?", a: "Yes. If the down payment is under 20%, the calculator estimates CMHC insurance and adds it to the financed mortgage amount." },
  { q: "Does this calculator include land transfer tax?", a: "Yes. It includes simplified provincial land transfer tax handling and a basic first-time buyer rebate adjustment where applicable." },
  { q: "Are the closing costs exact?", a: "No. Legal fees, inspections, and tax handling vary by lender, lawyer, municipality, and transaction. This page is for planning, not a binding quote." },
  { q: "Should I trust this page more than my lender quote?", a: "No. Use this tool to compare scenarios before you speak to a lender or broker. Your actual approved payment, qualification amount, and closing costs depend on underwriting, product choice, and lender-specific rules." },
];

function getMonthlyRate(annualRate) {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

function calcPayment(principal, annualRate, months) {
  const monthlyRate = getMonthlyRate(annualRate);
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

function getCMHC(principal, homePrice) {
  const ratio = principal / homePrice;
  if (ratio <= 0.8) return 0;
  if (ratio <= 0.85) return principal * 0.028;
  if (ratio <= 0.9) return principal * 0.031;
  return principal * 0.04;
}

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
  }
  return Math.round(tax);
}

const PROVINCES = [
  ["AB", "Alberta - No provincial land transfer tax"],
  ["BC", "British Columbia"],
  ["MB", "Manitoba"],
  ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"],
  ["NT", "Northwest Territories - No provincial land transfer tax"],
  ["NU", "Nunavut - No provincial land transfer tax"],
  ["ON", "Ontario"],
  ["PE", "Prince Edward Island"],
  ["QC", "Quebec"],
  ["SK", "Saskatchewan - No provincial land transfer tax"],
  ["YT", "Yukon - No provincial land transfer tax"],
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
      alert("Enter a valid down payment. This calculator expects at least 5% down for planning purposes.");
      return;
    }

    const cmhc = getCMHC(principal, homePrice);
    const insuredPrincipal = principal + cmhc;
    const months = amort * 12;
    const monthlyPayment = calcPayment(insuredPrincipal, rate, months);

    let payment;
    let label;
    if (frequency === "monthly") {
      payment = monthlyPayment;
      label = "Monthly";
    } else if (frequency === "biweekly") {
      payment = (monthlyPayment * 12) / 26;
      label = "Bi-Weekly";
    } else if (frequency === "accelerated") {
      payment = monthlyPayment / 2;
      label = "Accelerated Bi-Weekly";
    } else {
      payment = (monthlyPayment * 12) / 52;
      label = "Weekly";
    }

    const monthlyRate = getMonthlyRate(rate);
    let balance = insuredPrincipal;
    let totalInterest = 0;
    const yearlyData = [];

    for (let year = 1; year <= amort; year++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let month = 0; month < 12; month++) {
        const interest = balance * monthlyRate;
        const principalPaid = monthlyPayment - interest;
        yearInterest += interest;
        yearPrincipal += principalPaid;
        balance = Math.max(0, balance - principalPaid);
      }
      totalInterest += yearInterest;
      yearlyData.push({
        year,
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
    <section className="mx-auto max-w-4xl px-4 py-12">
      <SEO
        title="Canadian Mortgage Calculator 2026 - Payment, CMHC, and Land Transfer Tax"
        description="Calculate your Canadian mortgage payment, CMHC insurance estimate, and land transfer tax using a semi-annual compounding model. Free mortgage calculator for Canadian planning."
      />
      <ToolPageSchema
        name="Canadian Mortgage Calculator 2026"
        description="Canadian mortgage calculator with semi-annual compounding, CMHC insurance estimates, and provincial land transfer tax handling."
        canonical="https://easyfinancetools.com/tools/mortgage-calculator"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-accent">Canadian Mortgage Calculator</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Estimate your mortgage payment with <strong>CMHC insurance</strong> and <strong>land transfer tax</strong> using a Canadian semi-annual compounding approach.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          { title: "Last updated", body: "April 3, 2026" },
          { title: "Methodology", body: "Canadian semi-annual compounding, simplified CMHC tiers, and provincial land transfer tax logic." },
          { title: "Best for", body: "Scenario planning before you compare lender quotes, down payments, or payment frequencies." },
          { title: "Reminder", body: "Use official lender, insurer, and lawyer documents before making an offer." },
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
            "Uses a semi-annual compounding conversion before monthly payment math, which is standard for many Canadian mortgage comparisons.",
            "Adds estimated CMHC insurance to the financed balance when down payment is below 20%.",
            "Uses simplified provincial land transfer tax rules and does not model every rebate, municipal surcharge, or exception.",
            "Shows directional closing costs to help with planning, not a binding legal or lender quote.",
          ].map((item) => (
            <div key={item} className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">Home Price ($)</label>
          <input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(parseFloat(e.target.value))}
            className="w-full rounded-lg border-2 border-gray-200 p-3 outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Down Payment ($)
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${parseFloat(downPct) >= 20 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {downPct}%
            </span>
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(parseFloat(e.target.value))}
            className="w-full rounded-lg border-2 border-gray-200 p-3 outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
          />
          <p className="mt-1 text-xs text-gray-500">
            {parseFloat(downPct) >= 20 ? "20%+ down payment: no CMHC insurance required" : "Under 20% down payment: CMHC mortgage insurance applies"}
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Interest Rate (%)</label>
          <input
            type="number"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full rounded-lg border-2 border-gray-200 p-3 outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
          />
          <p className="mt-1 text-xs text-gray-500">Uses a semi-annual compounding conversion for mortgage math.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Amortization Period (Years)</label>
          <select
            value={amort}
            onChange={(e) => setAmort(parseInt(e.target.value))}
            className="w-full rounded-lg border-2 border-gray-200 p-3 outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
          >
            {[5, 10, 15, 20, 25, 30].map((years) => (
              <option key={years} value={years}>
                {years} years{years === 25 ? " (common insured max)" : ""}{years === 30 ? " (often uninsured only)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Payment Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 p-3 outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-Weekly</option>
            <option value="accelerated">Accelerated Bi-Weekly</option>
            <option value="weekly">Weekly</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">Accelerated bi-weekly payments can shorten amortization and reduce interest.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Province</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 p-3 outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
          >
            {PROVINCES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            id="firstTime"
            checked={firstTime}
            onChange={(e) => setFirstTime(e.target.checked)}
            className="h-5 w-5 accent-blue-600"
          />
          <label htmlFor="firstTime" className="cursor-pointer text-sm font-semibold">
            First-time buyer planning view (applies basic rebate logic where supported)
          </label>
        </div>
      </div>

      <button onClick={calculate} className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white transition-colors hover:bg-secondary">
        Calculate My Mortgage
      </button>

      {result && (
        <div className="mt-10">
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white">
            <p className="mb-1 text-sm font-semibold text-blue-200">{result.label} Payment</p>
            <p className="mb-2 text-5xl font-bold">${result.payment.toLocaleString()}</p>
            <p className="text-sm text-blue-200">
              on a ${result.insuredPrincipal.toLocaleString()} mortgage over {amort} years at {rate}%
            </p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Total Interest", value: `$${result.totalInterest.toLocaleString()}`, color: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" },
              { label: "Total Cost", value: `$${result.totalCost.toLocaleString()}`, color: "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" },
              { label: "CMHC Insurance", value: result.needsCMHC ? `$${result.cmhc.toLocaleString()}` : "Not Required", color: result.needsCMHC ? "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300" : "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" },
              { label: "Land Transfer Tax", value: result.ltt > 0 ? `$${result.ltt.toLocaleString()}` : "None in this model", color: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300" },
            ].map((card) => (
              <div key={card.label} className={`rounded-xl border-2 p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="mt-1 text-xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
            <h2 className="mb-3 font-bold text-blue-800 dark:text-blue-300">Estimated Cash Needed to Close</h2>
            <div className="space-y-1 text-sm text-blue-900 dark:text-blue-200">
              <div className="flex justify-between"><span>Down Payment</span><strong>${downPayment.toLocaleString()}</strong></div>
              {result.ltt > 0 && <div className="flex justify-between"><span>Land Transfer Tax</span><strong>${result.ltt.toLocaleString()}</strong></div>}
              <div className="flex justify-between"><span>Legal Fees (estimate)</span><strong>~$1,500</strong></div>
              <div className="flex justify-between"><span>Home Inspection (estimate)</span><strong>~$500</strong></div>
              <div className="flex justify-between border-t border-blue-200 pt-2 text-base font-bold dark:border-blue-700">
                <span>Estimated Total</span>
                <span className="text-blue-700 dark:text-blue-300">${(downPayment + result.ltt + 2000).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold">Remaining Balance Over Time</h2>
            <Line
              data={{
                labels: result.yearlyData.map((d) => `Yr ${d.year}`),
                datasets: [
                  {
                    label: "Remaining Balance",
                    data: result.yearlyData.map((d) => d.balance),
                    fill: true,
                    backgroundColor: "rgba(239,68,68,0.1)",
                    borderColor: "#ef4444",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } } },
              }}
            />
          </div>

          <div className="mb-8 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold">Principal vs Interest Each Year</h2>
            <Bar
              data={{
                labels: result.yearlyData.map((d) => `Yr ${d.year}`),
                datasets: [
                  {
                    label: "Principal",
                    data: result.yearlyData.map((d) => d.principal),
                    backgroundColor: "rgba(0,168,232,0.8)",
                  },
                  {
                    label: "Interest",
                    data: result.yearlyData.map((d) => d.interest),
                    backgroundColor: "rgba(239,68,68,0.6)",
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  x: { stacked: true },
                  y: { stacked: true, ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } },
                },
              }}
            />
          </div>

          {result.needsCMHC && (
            <div className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-800 dark:bg-yellow-900/20">
              <h2 className="mb-2 font-bold text-yellow-800 dark:text-yellow-300">CMHC Mortgage Insurance</h2>
              <p className="text-sm text-yellow-900 dark:text-yellow-200">
                Your down payment is <strong>{result.downPct}%</strong>. Under 20% down payment requires CMHC insurance of <strong>${result.cmhc.toLocaleString()}</strong>. In this model it is added to the mortgage balance rather than paid upfront.
              </p>
            </div>
          )}

          <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-bold">Ways to Pay Off Faster</h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Switch to <strong>accelerated bi-weekly payments</strong> to reduce interest and amortization time.</li>
              <li>Make <strong>lump-sum prepayments</strong> if your lender allows them.</li>
              <li>Increase your <strong>payment amount</strong> when income rises.</li>
              <li>Renew at a <strong>lower rate</strong> if the market allows and your lender options improve.</li>
              <li>Use your <strong>FHSA</strong> and, where appropriate, the <strong>RRSP Home Buyers' Plan</strong> to support the down payment.</li>
            </ul>
          </div>
        </div>
      )}

      <MethodologyPanel
        title="How this mortgage calculator works"
        summary="This calculator estimates mortgage payments using a semi-annual compounding conversion, then layers in CMHC insurance and simplified provincial land transfer tax rules for planning purposes."
        updated="April 3, 2026"
        assumptions={[
          "The annual rate entered is converted using a semi-annual compounding approach before monthly payment calculations are made.",
          "CMHC insurance is estimated using simplified premium tiers based on the loan-to-value ratio.",
          "Provincial land transfer tax handling is simplified and may not capture every rebate, municipal surcharge, or local variation.",
          "Closing costs shown here are directional planning figures, not a lender or lawyer quote.",
          "Qualification rules, stress test outcomes, and lender product pricing are not modeled directly on this page.",
        ]}
        sources={[
          { label: "Government of Canada: Mortgage loan insurance", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html" },
          { label: "FCAC: Mortgage calculator guidance", href: "https://itools-ioutils.fcac-acfc.gc.ca/MC-CH/MCCalc-CHCalc-eng.aspx" },
        ]}
        note="Educational estimate only. Verify payment quotes, qualification rules, and closing costs with your lender, broker, and lawyer before making an offer."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Pay off your mortgage faster",
            body: "See strategies for accelerated bi-weekly payments, lump sums, and renewal planning.",
            href: "/blog/pay-off-mortgage-faster-canada",
          },
          {
            title: "Rent vs buy calculator",
            body: "Compare ownership costs against renting before you commit to a mortgage payment target.",
            href: "/tools/rent-vs-buy",
          },
          {
            title: "Methodology and sources",
            body: "Review how EasyFinanceTools handles assumptions, updates, privacy, and disclosures.",
            href: "/methodology",
          },
        ].map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-lg font-bold text-primary dark:text-accent">{item.title}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
          </Link>
        ))}
      </div>

      <FAQ items={FAQS} />
    </section>
  );
}
