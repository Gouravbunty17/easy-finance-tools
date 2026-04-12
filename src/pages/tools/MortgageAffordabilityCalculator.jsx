import React, { useMemo, useState } from "react";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const PROVINCES = {
  AB: { label: "Alberta", lttRate: 0 },
  BC: { label: "British Columbia", lttRate: 0.018 },
  MB: { label: "Manitoba", lttRate: 0.015 },
  NB: { label: "New Brunswick", lttRate: 0.01 },
  NL: { label: "Newfoundland and Labrador", lttRate: 0 },
  NS: { label: "Nova Scotia", lttRate: 0.015 },
  NT: { label: "Northwest Territories", lttRate: 0 },
  NU: { label: "Nunavut", lttRate: 0 },
  ON: { label: "Ontario", lttRate: 0.015 },
  PE: { label: "Prince Edward Island", lttRate: 0.01 },
  QC: { label: "Quebec", lttRate: 0.01 },
  SK: { label: "Saskatchewan", lttRate: 0 },
  YT: { label: "Yukon", lttRate: 0 },
};

function getMonthlyRate(annualRate) {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

function principalFromPayment(payment, annualRate, months) {
  const monthlyRate = getMonthlyRate(annualRate);
  if (monthlyRate === 0) return payment * months;
  return (payment * (Math.pow(1 + monthlyRate, months) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, months));
}

export default function MortgageAffordabilityCalculator() {
  const [householdIncome, setHouseholdIncome] = useState(140000);
  const [downPayment, setDownPayment] = useState(120000);
  const [monthlyDebtPayments, setMonthlyDebtPayments] = useState(600);
  const [interestRate, setInterestRate] = useState(4.89);
  const [amortization, setAmortization] = useState(25);
  const [province, setProvince] = useState("ON");
  const [propertyTaxMonthly, setPropertyTaxMonthly] = useState(450);
  const [heatingMonthly, setHeatingMonthly] = useState(150);

  const result = useMemo(() => {
    const monthlyIncome = asNumber(householdIncome) / 12;
    const stressRate = Math.max(asNumber(interestRate) + 2, 5.25);
    const maxHousingCost = monthlyIncome * 0.39;
    const maxTotalDebtCost = monthlyIncome * 0.44;
    const availableForMortgage = Math.max(
      0,
      Math.min(
        maxHousingCost - asNumber(propertyTaxMonthly) - asNumber(heatingMonthly),
        maxTotalDebtCost - asNumber(monthlyDebtPayments) - asNumber(propertyTaxMonthly) - asNumber(heatingMonthly)
      )
    );
    const principal = principalFromPayment(availableForMortgage, stressRate, asNumber(amortization, 25) * 12);
    const maxHomePrice = principal + asNumber(downPayment);
    const ltt = Math.round(maxHomePrice * (PROVINCES[province]?.lttRate || 0));

    return {
      stressRate,
      availableForMortgage,
      principal: Math.round(principal),
      maxHomePrice: Math.round(maxHomePrice),
      ltt,
      monthlyIncome,
    };
  }, [householdIncome, downPayment, monthlyDebtPayments, interestRate, amortization, province, propertyTaxMonthly, heatingMonthly]);

  return (
    <CalculatorLayout
      title="Mortgage Affordability Calculator Canada"
      description="Estimate how much home price your income can support using a stress-tested payment assumption, debt obligations, property tax, heating, and province-level planning context."
      canonical="https://easyfinancetools.com/tools/mortgage-affordability-calculator"
      badge="Real estate planning"
      results={
        <>
          <ResultCard
            label="Estimated max home price"
            value={fmtCAD(result.maxHomePrice)}
            hint={`Estimated borrowing room: ${fmtCAD(result.principal)} plus down payment ${fmtCAD(downPayment)}.`}
            tone="primary"
          />
          <ResultCard
            label="Stress-tested mortgage payment"
            value={fmtCAD(result.availableForMortgage, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
            hint={`Stress-test rate used: ${fmtNum(result.stressRate, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%`}
          />
          <ResultCard
            label="Estimated provincial land transfer tax"
            value={fmtCAD(result.ltt)}
            hint={`${PROVINCES[province]?.label || "Province"} planning estimate only. Municipal or rebate rules can differ.`}
            tone="success"
          />
        </>
      }
      relatedTools={[
        { href: "/tools/mortgage-calculator", title: "Mortgage payment calculator", body: "Move from affordability into exact payment and amortization scenarios." },
        { href: "/tools/rent-vs-buy", title: "Rent vs buy calculator", body: "Use your estimated buying range to compare ownership against staying a renter." },
        { href: "/tools/net-pay-calculator", title: "Pay stub calculator", body: "Check take-home pay if you want to stress-test the housing budget with payroll deductions included." },
      ]}
      footerNote="Planning estimate only. Lenders also consider credit profile, condo fees, heating assumptions, taxes, and product-specific underwriting rules."
    >
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberInput id="afford-income" label="Household gross income" prefix="$" value={householdIncome} onChange={(value) => setHouseholdIncome(parseNumericInput(value))} placeholder="140000" />
          <NumberInput id="afford-down-payment" label="Down payment" prefix="$" value={downPayment} onChange={(value) => setDownPayment(parseNumericInput(value))} placeholder="120000" />
          <NumberInput id="afford-debt" label="Monthly debt payments" prefix="$" value={monthlyDebtPayments} onChange={(value) => setMonthlyDebtPayments(parseNumericInput(value))} placeholder="600" hint="Car loans, student loans, credit-card minimums, and other monthly debt obligations." />
          <NumberInput id="afford-rate" label="Quoted mortgage rate" value={interestRate} onChange={(value) => setInterestRate(parseNumericInput(value))} placeholder="4.89" suffix="%" />
          <NumberInput id="afford-property-tax" label="Monthly property tax estimate" prefix="$" value={propertyTaxMonthly} onChange={(value) => setPropertyTaxMonthly(parseNumericInput(value))} placeholder="450" />
          <NumberInput id="afford-heating" label="Monthly heating estimate" prefix="$" value={heatingMonthly} onChange={(value) => setHeatingMonthly(parseNumericInput(value))} placeholder="150" />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Province</span>
            <select value={province} onChange={(event) => setProvince(event.target.value)} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {Object.entries(PROVINCES).map(([code, config]) => (
                <option key={code} value={code}>{config.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Amortization</span>
            <select value={amortization} onChange={(event) => setAmortization(Number(event.target.value))} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {[10, 15, 20, 25, 30].map((years) => (
                <option key={years} value={years}>{years} years</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </CalculatorLayout>
  );
}
