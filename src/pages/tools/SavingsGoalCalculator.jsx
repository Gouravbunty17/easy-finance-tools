import React, { useMemo, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const GOAL_PRESETS = [
  { label: "Vacation", amount: 5000 },
  { label: "Car", amount: 25000 },
  { label: "Down payment", amount: 80000 },
  { label: "Education", amount: 40000 },
  { label: "FIRE fund", amount: 1000000 },
];

export default function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const goal = asNumber(goalAmount);
    const current = asNumber(currentSavings);
    const duration = Math.max(1, asNumber(years, 5));
    const monthlyRate = asNumber(annualReturn) / 100 / 12;
    const months = duration * 12;
    const currentGrowth = current * Math.pow(1 + monthlyRate, months);
    const remaining = Math.max(0, goal - currentGrowth);

    let monthlyContribution = 0;
    if (remaining > 0) {
      monthlyContribution =
        monthlyRate === 0
          ? remaining / months
          : (remaining * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalContributions = current + monthlyContribution * months;
    const totalInterest = Math.max(0, goal - totalContributions);
    const alreadyThere = currentGrowth >= goal;

    const labels = ["Now"];
    const balances = [current];
    const contributions = [current];
    let balance = current;
    let contributed = current;

    for (let month = 1; month <= months; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      contributed += monthlyContribution;
      if (month % 12 === 0 || month === months) {
        labels.push(`Year ${Math.ceil(month / 12)}`);
        balances.push(Math.round(balance));
        contributions.push(Math.round(contributed));
      }
    }

    return {
      currentGrowth,
      monthlyContribution,
      totalContributions,
      totalInterest,
      alreadyThere,
      chartData: { labels, balances, contributions },
    };
  }, [goalAmount, currentSavings, annualReturn, years]);

  return (
    <CalculatorLayout
      title="Savings Goal Calculator Canada"
      description="Set a savings target, timeline, and expected return, then see how much you need to save each month to get there with clean input boxes instead of sliders."
      canonical="https://easyfinancetools.com/tools/savings-goal"
      badge="Goal planning"
      results={
        <>
          <ResultCard
            label={result.alreadyThere ? "Already on track" : "Monthly savings needed"}
            value={
              result.alreadyThere
                ? fmtCAD(result.currentGrowth)
                : fmtCAD(result.monthlyContribution, { maximumFractionDigits: 0, minimumFractionDigits: 0 })
            }
            hint={
              result.alreadyThere
                ? `Your current savings could grow to ${fmtCAD(result.currentGrowth)} in ${fmtNum(years)} years.`
                : `Estimated monthly contribution to reach ${fmtCAD(goalAmount)} in ${fmtNum(years)} years.`
            }
            tone="primary"
          />
          <ResultCard
            label="Total contributions"
            value={fmtCAD(result.totalContributions)}
            hint={`Current savings plus future deposits over ${fmtNum(years)} years.`}
          />
          <ResultCard
            label="Estimated growth"
            value={fmtCAD(result.totalInterest)}
            hint={`Projected at ${fmtNum(annualReturn, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}% per year.`}
            tone="success"
          />
        </>
      }
      relatedTools={[
        { href: "/tools/compound-interest-calculator", title: "Compound interest calculator", body: "Stress-test the same goal with different fee, return, and inflation assumptions." },
        { href: "/tools/tfsa-calculator", title: "TFSA calculator", body: "Check whether a TFSA is the best home for this goal and how much room you have left." },
        { href: "/tools/gic-calculator", title: "GIC calculator", body: "Compare a guaranteed return path against the market-based assumption used here." },
      ]}
      footerNote="Educational estimate only. Real savings outcomes depend on return sequence, fees, taxes outside registered accounts, and contribution timing."
    >
      <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-wrap gap-2">
          {GOAL_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setGoalAmount(preset.amount)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                asNumber(goalAmount) === preset.amount
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <NumberInput id="goal-amount" label="Savings goal" prefix="$" value={goalAmount} onChange={(value) => setGoalAmount(parseNumericInput(value))} placeholder="50000" />
          <NumberInput id="goal-current" label="Current savings" prefix="$" value={currentSavings} onChange={(value) => setCurrentSavings(parseNumericInput(value))} placeholder="5000" />
          <NumberInput id="goal-years" label="Years to goal" value={years} onChange={(value) => setYears(parseNumericInput(value, { integer: true }))} placeholder="5" inputMode="numeric" />
          <NumberInput id="goal-return" label="Expected annual return" value={annualReturn} onChange={(value) => setAnnualReturn(parseNumericInput(value))} placeholder="6" suffix="%" hint="Example assumptions: HISA/GIC 3% to 4%, balanced investing 5% to 6%, equity-heavy investing 7% to 8%." />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-primary dark:text-accent">Savings path over time</p>
          <div className="mt-4 h-[280px]">
            <Line
              data={{
                labels: result.chartData.labels,
                datasets: [
                  {
                    label: "Projected balance",
                    data: result.chartData.balances,
                    borderColor: "#0a4c89",
                    backgroundColor: "rgba(10, 76, 137, 0.12)",
                    fill: true,
                    tension: 0.35,
                  },
                  {
                    label: "Contributions only",
                    data: result.chartData.contributions,
                    borderColor: "#64748b",
                    borderDash: [6, 6],
                    fill: false,
                    tension: 0.35,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
            />
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
