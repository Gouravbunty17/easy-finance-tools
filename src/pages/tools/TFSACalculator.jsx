import React, { useMemo, useState } from "react";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import ActionableNextSteps from "../../components/ActionableNextSteps";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const TFSA_LIMITS = {
  2009: 5000,
  2010: 5000,
  2011: 5000,
  2012: 5000,
  2013: 5500,
  2014: 5500,
  2015: 10000,
  2016: 5500,
  2017: 5500,
  2018: 5500,
  2019: 6000,
  2020: 6000,
  2021: 6000,
  2022: 6000,
  2023: 6500,
  2024: 7000,
  2025: 7000,
  2026: 7000,
};

const CURRENT_YEAR = 2026;

function getEligibleYear(birthYear, residencyYear) {
  return Math.max(2009, birthYear + 18, residencyYear);
}

function getAccruedRoom(eligibleYear) {
  let total = 0;
  for (let year = eligibleYear; year <= CURRENT_YEAR; year += 1) {
    total += TFSA_LIMITS[year] || 0;
  }
  return total;
}

function buildProjection(currentBalance, monthlyContribution, annualReturn, years) {
  const monthlyRate = annualReturn / 100 / 12;
  let balance = currentBalance;
  const rows = [];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    rows.push({ year, balance: Math.round(balance) });
  }

  return { endingBalance: Math.round(balance), rows };
}

export default function TFSACalculator() {
  const [birthYear, setBirthYear] = useState(1992);
  const [residencyYear, setResidencyYear] = useState(2010);
  const [currentBalance, setCurrentBalance] = useState(25000);
  const [totalContributions, setTotalContributions] = useState(40000);
  const [totalWithdrawals, setTotalWithdrawals] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(400);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [years, setYears] = useState(15);

  const result = useMemo(() => {
    const eligibleYear = getEligibleYear(asNumber(birthYear, 1992), asNumber(residencyYear, 2010));
    const accruedRoom = getAccruedRoom(eligibleYear);
    const netContributions = Math.max(0, asNumber(totalContributions) - asNumber(totalWithdrawals));
    const estimatedRoom = Math.max(0, accruedRoom - netContributions);
    const projection = buildProjection(asNumber(currentBalance), asNumber(monthlyContribution), asNumber(annualReturn), Math.max(1, asNumber(years, 15)));
    const totalFutureContributions = asNumber(currentBalance) + asNumber(monthlyContribution) * 12 * Math.max(1, asNumber(years, 15));
    const totalGrowth = projection.endingBalance - totalFutureContributions;

    return {
      eligibleYear,
      accruedRoom,
      estimatedRoom,
      netContributions,
      projection,
      totalGrowth: Math.round(totalGrowth),
    };
  }, [birthYear, residencyYear, currentBalance, totalContributions, totalWithdrawals, monthlyContribution, annualReturn, years]);

  return (
    <>
      <CalculatorLayout
        title="TFSA Calculator 2026"
        description="Estimate TFSA contribution room from your eligibility year, then project tax-free growth with clean input boxes instead of sliders."
        canonical="https://easyfinancetools.com/tools/tfsa-calculator"
        badge="Registered accounts"
        results={
          <>
            <ResultCard
              label="Estimated TFSA room"
              value={fmtCAD(result.estimatedRoom)}
              hint={`Eligibility year: ${result.eligibleYear}. Accrued room through 2026: ${fmtCAD(result.accruedRoom)}.`}
              tone="primary"
            />
            <ResultCard
              label={`Projected value in ${fmtNum(years)} years`}
              value={fmtCAD(result.projection.endingBalance)}
              hint={`Projected tax-free growth: ${fmtCAD(result.totalGrowth)} at ${fmtNum(annualReturn, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}% annually.`}
            />
            <ResultCard
              label="Net contributions used"
              value={fmtCAD(result.netContributions)}
              hint="This simple room estimate assumes withdrawals shown here were made in or before the previous calendar year."
              tone="success"
            />
          </>
        }
        relatedTools={[
          { href: "/tools/rrsp-calculator", title: "RRSP calculator", body: "Compare tax-free TFSA growth with deduction-driven RRSP planning." },
          { href: "/tools/compound-interest-calculator", title: "Compound interest calculator", body: "Stress-test the same savings plan outside a registered account context." },
          { href: "/tools/dividend-calculator", title: "Dividend calculator", body: "Project income-focused investing once you know how much TFSA room you still have." },
        ]}
        footerNote="Educational estimate only. Same-year TFSA withdrawals are generally added back on January 1 of the following year, so always verify room with CRA My Account before acting."
      >
        <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <div className="grid gap-5 md:grid-cols-2">
            <NumberInput id="tfsa-birth-year" label="Birth year" value={birthYear} onChange={(value) => setBirthYear(parseNumericInput(value, { integer: true }))} placeholder="1992" inputMode="numeric" hint="TFSA eligibility starts at age 18, but never earlier than 2009." />
            <NumberInput id="tfsa-residency-year" label="Became a Canadian resident in" value={residencyYear} onChange={(value) => setResidencyYear(parseNumericInput(value, { integer: true }))} placeholder="2010" inputMode="numeric" hint="Residency matters because TFSA room only accrues for years you were eligible and resident." />
            <NumberInput id="tfsa-current-balance" label="Current TFSA balance" prefix="$" value={currentBalance} onChange={(value) => setCurrentBalance(parseNumericInput(value))} placeholder="25000" />
            <NumberInput id="tfsa-monthly-contribution" label="Monthly contribution" prefix="$" value={monthlyContribution} onChange={(value) => setMonthlyContribution(parseNumericInput(value))} placeholder="400" hint="Use 0 if you want a room-only estimate." />
            <NumberInput id="tfsa-total-contributions" label="Total lifetime contributions" prefix="$" value={totalContributions} onChange={(value) => setTotalContributions(parseNumericInput(value))} placeholder="40000" />
            <NumberInput id="tfsa-total-withdrawals" label="Total prior withdrawals" prefix="$" value={totalWithdrawals} onChange={(value) => setTotalWithdrawals(parseNumericInput(value))} placeholder="5000" hint="Best used for withdrawals already added back to room." />
            <NumberInput id="tfsa-return-rate" label="Expected annual return" value={annualReturn} onChange={(value) => setAnnualReturn(parseNumericInput(value))} placeholder="6" suffix="%" />
            <NumberInput id="tfsa-years" label="Projection years" value={years} onChange={(value) => setYears(parseNumericInput(value, { integer: true }))} placeholder="15" inputMode="numeric" />
          </div>
        </div>
      </CalculatorLayout>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        <ActionableNextSteps
          toolName="tfsa_calculator"
          intro="Use this as a fast planning pass, then confirm your exact room with CRA before you contribute."
          meaning={`Based on the inputs above, your estimated available TFSA room is ${fmtCAD(result.estimatedRoom)} and your projected value in ${fmtNum(years)} years is ${fmtCAD(result.projection.endingBalance)}.`}
          steps={[
            "Verify the estimate against your latest CRA TFSA room figure before making a large contribution.",
            "Compare TFSA and RRSP if you are deciding between tax-free growth and a deduction today.",
            "Use the compound interest calculator if you want to test a more aggressive or more conservative return assumption.",
          ]}
          actions={[
            { href: "/tools/rrsp-calculator", title: "Compare TFSA vs RRSP", body: "See how contribution timing and tax deductions change the decision.", ctaLabel: "tfsa_next_rrsp" },
            { href: "/blog/tfsa-vs-rrsp-2026", title: "Read the TFSA vs RRSP guide", body: "Move from a number into a plain-language decision framework.", ctaLabel: "tfsa_next_guide", destinationType: "article" },
            { href: "/tools/compound-interest-calculator", title: "Model long-term growth", body: "Stress-test your contribution plan with different return and inflation assumptions.", ctaLabel: "tfsa_next_compound" },
          ]}
        />
      </div>
    </>
  );
}
