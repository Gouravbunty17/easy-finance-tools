import React, { useMemo, useState } from "react";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const PROVINCES = {
  AB: { label: "Alberta", landTransferTaxRate: 0 },
  BC: { label: "British Columbia", landTransferTaxRate: 0.018 },
  MB: { label: "Manitoba", landTransferTaxRate: 0.015 },
  NB: { label: "New Brunswick", landTransferTaxRate: 0.01 },
  NL: { label: "Newfoundland and Labrador", landTransferTaxRate: 0 },
  NS: { label: "Nova Scotia", landTransferTaxRate: 0.015 },
  NT: { label: "Northwest Territories", landTransferTaxRate: 0 },
  NU: { label: "Nunavut", landTransferTaxRate: 0 },
  ON: { label: "Ontario", landTransferTaxRate: 0.015 },
  PE: { label: "Prince Edward Island", landTransferTaxRate: 0.01 },
  QC: { label: "Quebec", landTransferTaxRate: 0.01 },
  SK: { label: "Saskatchewan", landTransferTaxRate: 0 },
  YT: { label: "Yukon", landTransferTaxRate: 0 },
};

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

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(650000);
  const [downPayment, setDownPayment] = useState(130000);
  const [rate, setRate] = useState(5.25);
  const [amortization, setAmortization] = useState(25);
  const [frequency, setFrequency] = useState("monthly");
  const [province, setProvince] = useState("ON");

  const result = useMemo(() => {
    const price = asNumber(homePrice);
    const down = asNumber(downPayment);
    const principal = Math.max(0, price - down);
    const cmhc = principal > 0 ? getCMHC(principal, price || 1) : 0;
    const insuredPrincipal = principal + cmhc;
    const monthlyPayment = calcPayment(insuredPrincipal, asNumber(rate), Math.max(1, asNumber(amortization, 25)) * 12);

    let scheduledPayment = monthlyPayment;
    let label = "Monthly payment";
    if (frequency === "biweekly") {
      scheduledPayment = (monthlyPayment * 12) / 26;
      label = "Bi-weekly payment";
    } else if (frequency === "accelerated") {
      scheduledPayment = monthlyPayment / 2;
      label = "Accelerated bi-weekly payment";
    } else if (frequency === "weekly") {
      scheduledPayment = (monthlyPayment * 12) / 52;
      label = "Weekly payment";
    }

    const monthlyRate = getMonthlyRate(asNumber(rate));
    let balance = insuredPrincipal;
    let totalInterest = 0;
    for (let month = 0; month < Math.max(1, asNumber(amortization, 25)) * 12; month += 1) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      totalInterest += interest;
      balance = Math.max(0, balance - principalPaid);
    }

    return {
      downPct: price > 0 ? (down / price) * 100 : 0,
      cmhc: Math.round(cmhc),
      insuredPrincipal: Math.round(insuredPrincipal),
      scheduledPayment,
      label,
      totalInterest: Math.round(totalInterest),
      landTransferTax: Math.round(price * (PROVINCES[province]?.landTransferTaxRate || 0)),
    };
  }, [homePrice, downPayment, rate, amortization, frequency, province]);

  return (
    <CalculatorLayout
      title="Canadian Mortgage Calculator"
      description="Estimate mortgage payments using Canadian semi-annual compounding, simplified CMHC insurance handling, and province-level land transfer tax context."
      canonical="https://easyfinancetools.com/tools/mortgage-calculator"
      badge="Payment planning"
      results={
        <>
          <ResultCard
            label={result.label}
            value={fmtCAD(result.scheduledPayment, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`Mortgage amount including estimated CMHC: ${fmtCAD(result.insuredPrincipal)}.`}
            tone="primary"
          />
          <ResultCard
            label="Estimated total interest"
            value={fmtCAD(result.totalInterest)}
            hint={`${fmtNum(result.downPct, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}% down payment.`}
          />
          <ResultCard
            label="Land transfer tax estimate"
            value={fmtCAD(result.landTransferTax)}
            hint={`${PROVINCES[province]?.label || "Province"} planning estimate only. CMHC estimate: ${fmtCAD(result.cmhc)}.`}
            tone="success"
          />
        </>
      }
      relatedTools={[
        { href: "/tools/mortgage-affordability-calculator", title: "Mortgage affordability calculator", body: "Work backward from income and debt before you model the payment itself." },
        { href: "/tools/rent-vs-buy", title: "Rent vs buy calculator", body: "Compare the ownership scenario against continuing to rent." },
        { href: "/blog/pay-off-mortgage-faster-canada", title: "Mortgage payoff guide", body: "See how accelerated payments and prepayment choices change the path.", destinationType: "article" },
      ]}
      footerNote="Educational estimate only. Lender quotes, legal fees, insurance, condo fees, and municipal taxes can materially change your actual cost."
    >
      <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberInput id="mortgage-home-price" label="Home price" prefix="$" value={homePrice} onChange={(value) => setHomePrice(parseNumericInput(value))} placeholder="650000" />
          <NumberInput id="mortgage-down-payment" label="Down payment" prefix="$" value={downPayment} onChange={(value) => setDownPayment(parseNumericInput(value))} placeholder="130000" hint={result.downPct >= 20 ? "20% or more down: no CMHC estimate added." : "Under 20% down: simplified CMHC insurance estimate is added."} />
          <NumberInput id="mortgage-rate" label="Interest rate" value={rate} onChange={(value) => setRate(parseNumericInput(value))} placeholder="5.25" suffix="%" hint="Uses a semi-annual compounding conversion before monthly mortgage math." />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Amortization</span>
            <select value={amortization} onChange={(event) => setAmortization(Number(event.target.value))} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {[5, 10, 15, 20, 25, 30].map((years) => (
                <option key={years} value={years}>{years} years</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Payment frequency</span>
            <select value={frequency} onChange={(event) => setFrequency(event.target.value)} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <option value="monthly">Monthly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="accelerated">Accelerated bi-weekly</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Province</span>
            <select value={province} onChange={(event) => setProvince(event.target.value)} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {Object.entries(PROVINCES).map(([code, config]) => (
                <option key={code} value={code}>{config.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </CalculatorLayout>
  );
}
