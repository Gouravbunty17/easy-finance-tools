import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
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

const FAQS = [
  {
    q: "Is this savings goal calculator for Canadians?",
    a: "Yes. It uses CAD examples and is designed for Canadian savings goals, but it does not choose an account or investment for you.",
  },
  {
    q: "Should I use TFSA, RRSP, or a regular account for my goal?",
    a: "It depends on timing, tax situation, and withdrawal needs. A TFSA is often flexible for medium-term goals, while RRSP planning is more retirement-focused.",
  },
  {
    q: "What return should I enter?",
    a: "Use a conservative assumption for short goals and avoid assuming high market returns for money you need soon.",
  },
  {
    q: "Does this include tax and investment fees?",
    a: "No. It is a simple savings projection. Taxes, fees, and account rules can reduce the actual amount available.",
  },
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
      title="Savings Goal Calculator Canada | Monthly Savings Planner"
      description="Calculate how much to save each month in Canada to reach a goal. Estimate CAD targets, current savings, expected growth, and timeline tradeoffs."
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

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What this calculator does</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Turn a CAD goal into a monthly savings target</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This calculator estimates how much you may need to save each month to reach a Canadian dollar goal by a chosen date. It is useful for down payments, emergency funds, travel, education, car purchases, and other goals where the timeline matters.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use it</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Choose the target, savings already set aside, and timeline</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Enter your goal amount, current savings, years to goal, and expected annual return. For short-term goals, use a lower return assumption than you would use for long-term investing, because market losses can matter more when the money is needed soon.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Inputs explained</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What changes the monthly amount</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Savings goal", "The final CAD target you want to reach."],
            ["Current savings", "Money already set aside, which can grow during the timeline."],
            ["Years to goal", "The number of years available for deposits and growth."],
            ["Expected annual return", "A planning assumption for growth before taxes, fees, or account-specific limits."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="font-bold text-primary dark:text-accent">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Example calculation</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Example: save toward the current goal</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            With a goal of {fmtCAD(goalAmount)}, current savings of {fmtCAD(currentSavings)}, a {fmtNum(years)} year timeline, and a {fmtNum(annualReturn, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}% annual return assumption, this estimate shows {result.alreadyThere ? "that your current savings may already be on track" : `a monthly savings target of ${fmtCAD(result.monthlyContribution)}`}.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to read your result</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Separate deposits from expected growth</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The monthly savings number is the amount to contribute under your assumptions. The estimated growth result is not guaranteed, so compare safer rates with the <Link to="/tools/gic-calculator" className="text-primary underline dark:text-secondary">GIC calculator</Link> and longer-term investing assumptions with the <Link to="/tools/compound-interest-calculator" className="text-primary underline dark:text-secondary">compound interest calculator</Link>.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Match the account and risk level to the deadline</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <li>- Assuming stock-market returns for money needed in the next year or two.</li>
          <li>- Forgetting that TFSA, FHSA, and RRSP rules can affect withdrawals and timing.</li>
          <li>- Using a goal amount that excludes taxes, closing costs, travel fees, or emergency buffer.</li>
          <li>- Treating the monthly target as fixed when income, expenses, or rates change.</li>
        </ul>
      </section>

      <MethodologyPanel
        title="Methodology and assumptions"
        summary="The calculator projects current savings forward, then solves for the monthly contribution needed to close the remaining gap by the selected date."
        assumptions={[
          "Contributions are modeled monthly and returns compound monthly.",
          "The expected annual return is a planning assumption, not a promise.",
          "Taxes, product fees, account contribution limits, and withdrawal rules are not fully modeled.",
          "If current savings are already projected to exceed the goal, the monthly target is shown as already on track.",
        ]}
        sources={[
          { label: "FCAC: Setting financial goals", href: "https://www.canada.ca/en/financial-consumer-agency/services/savings-investments/setting-goals.html" },
          { label: "EasyFinanceTools methodology", href: "https://easyfinancetools.com/methodology" },
        ]}
        note="Educational estimate only. Verify account rules, rates, and timelines before committing money to a specific product."
      />

      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related tools and guides</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/tools" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">All calculators</Link>
          <Link to="/tools/tfsa-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA calculator</Link>
          <Link to="/tools/rrsp-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">RRSP calculator</Link>
          <Link to="/blog/how-to-start-investing-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Beginner investing guide</Link>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Disclaimer</p>
        <p className="mt-3 text-sm leading-7 text-amber-800 dark:text-amber-200">
          This calculator is for planning only. Actual savings results depend on account type, interest rates, market returns, taxes, product fees, and whether you can maintain the contribution schedule.
        </p>
      </section>

      <FAQ items={FAQS} />
    </CalculatorLayout>
  );
}
