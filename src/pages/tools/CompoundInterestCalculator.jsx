import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import SEO from "../../components/SEO";
import ToolPageSchema from "../../components/ToolPageSchema";
import MethodologyPanel from "../../components/MethodologyPanel";
import SurfaceTrackedLink from "../../components/SurfaceTrackedLink";
import ToolByline from "../../components/ToolByline";
import ActionableNextSteps from "../../components/ActionableNextSteps";
import EducationalDisclaimer from "../../components/EducationalDisclaimer";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const formatCurrency = (value) =>
  value.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });

const formatPercent = (value) => `${value.toFixed(1)}%`;

const contributionPresets = [
  { label: "Starter", amount: 250 },
  { label: "Steady", amount: 500 },
  { label: "Aggressive", amount: 1000 },
];

export default function CompoundInterestCalculator() {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [years, setYears] = useState(20);
  const [annualFee, setAnnualFee] = useState(0.4);
  const [inflationRate, setInflationRate] = useState(2);

  const projection = useMemo(() => {
    const months = years * 12;
    const netAnnualReturn = annualReturn - annualFee;
    const monthlyRate = netAnnualReturn / 100 / 12;
    const monthlyInflation = inflationRate / 100 / 12;

    let balance = initialAmount;
    let contributions = initialAmount;
    let inflationAdjusted = initialAmount;

    const labels = ["Now"];
    const balances = [Math.round(balance)];
    const realBalances = [Math.round(inflationAdjusted)];
    const contributionLine = [Math.round(contributions)];

    for (let month = 1; month <= months; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      contributions += monthlyContribution;
      inflationAdjusted = balance / Math.pow(1 + monthlyInflation, month);

      if (month % 12 === 0 || month === months) {
        labels.push(`Year ${Math.ceil(month / 12)}`);
        balances.push(Math.round(balance));
        realBalances.push(Math.round(inflationAdjusted));
        contributionLine.push(Math.round(contributions));
      }
    }

    const endingBalance = balance;
    const totalContributions = contributions;
    const investmentGrowth = endingBalance - totalContributions;
    const realEndingBalance = inflationAdjusted;

    return {
      labels,
      balances,
      realBalances,
      contributionLine,
      endingBalance,
      totalContributions,
      investmentGrowth,
      realEndingBalance,
      netAnnualReturn,
    };
  }, [annualFee, annualReturn, inflationRate, initialAmount, monthlyContribution, years]);

  const chartData = {
    labels: projection.labels,
    datasets: [
      {
        label: "Projected balance",
        data: projection.balances,
        borderColor: "#0a4c89",
        backgroundColor: "rgba(10, 76, 137, 0.14)",
        fill: true,
        tension: 0.35,
      },
      {
        label: "Inflation-adjusted balance",
        data: projection.realBalances,
        borderColor: "#e3a008",
        backgroundColor: "rgba(227, 160, 8, 0.08)",
        fill: false,
        tension: 0.35,
      },
      {
        label: "Total contributed",
        data: projection.contributionLine,
        borderColor: "#64748b",
        borderDash: [6, 6],
        fill: false,
        tension: 0.35,
      },
    ],
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="Compound Interest Calculator Canada | See Your Investment Growth"
        description="Calculate compound interest, monthly contributions, investment growth, and future value in Canada. Free calculator with instant results."
        canonical="https://easyfinancetools.com/tools/compound-interest-calculator"
      />
      <ToolPageSchema
        name="Compound Interest Calculator Canada"
        description="Estimate compound growth in CAD with monthly contributions, fees, and inflation."
        canonical="https://easyfinancetools.com/tools/compound-interest-calculator"
        category="FinanceApplication"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            Investing and savings
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">
            Compound Interest Calculator Canada
          </h1>
          <ToolByline />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            See how an initial deposit, monthly contributions, fees, and inflation change your long-term result. Built for CAD planning and easy scenario checks.
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="surface-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Projected balance</p>
              <p className="mt-2 text-3xl font-bold text-primary dark:text-accent">
                {formatCurrency(Math.round(projection.endingBalance))}
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Investment growth</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {formatCurrency(Math.round(projection.investmentGrowth))}
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Real value after inflation</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {formatCurrency(Math.round(projection.realEndingBalance))}
              </p>
            </div>
          </div>

          <div className="surface-card mt-8 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary dark:text-accent">Growth over time</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  The gap between contributed dollars and ending balance is your compounding effect.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Net annual return: {formatPercent(projection.netAnnualReturn)}
              </div>
            </div>

            <div className="mt-6">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(Number(ctx.raw))}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => formatCurrency(Number(value)),
                      },
                    },
                  },
                }}
                height={320}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">What this helps answer</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Whether your current savings plan is enough for retirement, a long-term TFSA strategy, or a general investing target.
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">Best next comparison</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Compare a compounding plan with registered-account choices like TFSA, RRSP, or FHSA so taxes and contribution room are not ignored.
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">Good default assumption</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                If you are unsure, start with a 5% to 6% long-run return before inflation and keep fees below 0.5% where possible.
              </p>
            </div>
          </div>
        </div>

        <aside className="surface-card h-fit p-6">
          <h2 className="text-2xl font-bold text-primary dark:text-accent">Adjust your scenario</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Educational estimate only. Results are sensitive to return, fee, and inflation assumptions.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {contributionPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setMonthlyContribution(preset.amount)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  monthlyContribution === preset.amount
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {preset.label} {formatCurrency(preset.amount)}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-5">
            <RangeField
              label="Initial amount"
              value={initialAmount}
              display={formatCurrency(initialAmount)}
              min={0}
              max={250000}
              step={1000}
              onChange={setInitialAmount}
              footer={["$0", "$250,000"]}
            />
            <RangeField
              label="Monthly contribution"
              value={monthlyContribution}
              display={formatCurrency(monthlyContribution)}
              min={0}
              max={5000}
              step={25}
              onChange={setMonthlyContribution}
              footer={["$0", "$5,000"]}
            />
            <RangeField
              label="Expected annual return"
              value={annualReturn}
              display={formatPercent(annualReturn)}
              min={0}
              max={12}
              step={0.1}
              onChange={setAnnualReturn}
              footer={["0%", "12%"]}
            />
            <RangeField
              label="Annual investment fee"
              value={annualFee}
              display={formatPercent(annualFee)}
              min={0}
              max={2.5}
              step={0.05}
              onChange={setAnnualFee}
              footer={["0%", "2.5%"]}
            />
            <RangeField
              label="Inflation rate"
              value={inflationRate}
              display={formatPercent(inflationRate)}
              min={0}
              max={5}
              step={0.1}
              onChange={setInflationRate}
              footer={["0%", "5%"]}
            />
            <RangeField
              label="Years invested"
              value={years}
              display={`${years} years`}
              min={1}
              max={40}
              step={1}
              onChange={setYears}
              footer={["1 year", "40 years"]}
            />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Scenario summary</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Contributed dollars: {formatCurrency(Math.round(projection.totalContributions))}</li>
              <li>Growth from returns: {formatCurrency(Math.round(projection.investmentGrowth))}</li>
              <li>Value in today&apos;s dollars: {formatCurrency(Math.round(projection.realEndingBalance))}</li>
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100">
            Enter annual return before fees if you want a conservative planning estimate. If you are unsure, try 5% and compare it against 6.5%.
          </div>
        </aside>
      </div>

      <MethodologyPanel
        title="How this compound interest calculator works"
        summary="This calculator applies a monthly compounding model using your opening amount, monthly contributions, expected annual return, annual fee drag, and an inflation adjustment. It is designed for educational planning, not account-specific forecasting."
        assumptions={[
          "Returns are smoothed into a constant monthly rate and do not reflect market volatility.",
          "Monthly contributions are added at the end of each month.",
          "Annual fees reduce the expected annual return before monthly growth is calculated.",
          "Inflation is shown as a separate real-value view so nominal and purchasing-power outcomes can be compared.",
        ]}
        sources={[
          { label: "Bank of Canada inflation resources", href: "https://www.bankofcanada.ca/core-functions/monetary-policy/inflation/" },
          { label: "Government of Canada registered accounts overview", href: "https://www.canada.ca/en/services/finance.html" },
        ]}
        updated="April 3, 2026"
        reviewer="EasyFinanceTools editorial team"
        note="Educational estimate only. Real returns vary year to year, and taxes may apply depending on whether you invest inside a TFSA, RRSP, FHSA, or non-registered account."
      />

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">How to use this compound interest calculator</p>
          <h2 className="mt-3 text-2xl font-bold text-primary dark:text-accent">Model the contribution plan before you choose the account</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This page works best when you use it to answer a practical planning question, not just to generate the biggest possible future number. Start with
            your current balance, realistic monthly contribution, and a conservative expected return. Then compare that baseline against a second scenario
            with lower fees, higher contributions, or a longer timeline. That usually tells you more than moving the return slider to an optimistic number.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            For Canadians, the next step is usually deciding where this compounding should happen. A TFSA, RRSP, FHSA, or taxable account can lead to very
            different after-tax outcomes even if the growth curve looks similar. Use this calculator to understand the savings engine first, then compare it
            against account-specific tools before making the actual contribution decision.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">What this page helps you decide</p>
          <h2 className="mt-3 text-2xl font-bold text-primary dark:text-accent">Savings behavior usually matters more than a perfect return guess</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Many people overestimate what a perfect annual return will do and underestimate how much steady monthly contributions drive the result. This
            calculator makes that tradeoff visible by separating contributed dollars, investment growth, and inflation-adjusted value. If a plan only works
            under an aggressive return assumption, it is probably too fragile for real-world planning.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            It also helps you pressure-test fee drag. Even a small annual fee difference can remove a meaningful amount of wealth over a long horizon. If you
            are comparing brokers, robo-advisors, or ETF options, use this page as the neutral planning baseline before provider marketing or sign-up bonuses
            start shaping the decision.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            question: "Should I use nominal or real returns?",
            answer:
              "Use nominal returns to see the account balance you may actually observe, and compare the inflation-adjusted line to understand future purchasing power.",
          },
          {
            question: "Why include fees here?",
            answer:
              "Even a small annual fee compounds over time. Modeling fee drag keeps long-range projections closer to reality.",
          },
          {
            question: "What should I open next?",
            answer:
              "If you are deciding where to invest, compare this result against TFSA and RRSP calculators so tax treatment is part of the decision.",
          },
        ].map((item) => (
          <div key={item.question} className="surface-card p-5">
            <h2 className="text-lg font-bold text-primary dark:text-accent">{item.question}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.answer}</p>
          </div>
        ))}
      </section>

      <ActionableNextSteps
        toolName="compound_interest_calculator"
        title="Turn the growth curve into a real investing decision"
        intro="This calculator is most useful when it becomes a decision tool, not just a projection. Use the compounding result to decide where the money should live and which provider fits the plan."
        meaning={`${formatCurrency(Math.round(projection.endingBalance))} is the directional result of your current contribution pace, fee drag, and time horizon. The best next move is usually deciding whether that plan belongs in a TFSA, RRSP, or a more general savings workflow.`}
        steps={[
          "Compare the same contribution plan inside a TFSA or RRSP before you open an account.",
          "Check whether the monthly amount is realistic enough to repeat consistently.",
          "Only compare brokers or investing apps after the account type and fee sensitivity are clear.",
        ]}
        actions={[
          {
            title: "Open TFSA calculator",
            body: "See how tax-free growth changes the result once contribution room matters.",
            href: "/tools/tfsa-calculator",
            ctaLabel: "open_tfsa_calculator",
          },
          {
            title: "Open RRSP calculator",
            body: "Compare compounding with the tax deduction and refund side of the decision.",
            href: "/tools/rrsp-calculator",
            ctaLabel: "open_rrsp_calculator",
          },
          {
            title: "Open savings goal calculator",
            body: "Reverse the math and calculate the monthly amount needed to hit a target date.",
            href: "/tools/savings-goal",
            ctaLabel: "open_savings_goal_calculator",
          },
        ]}
        referral={{
          placement: "compound_interest_calculator_referral",
          badge: "Beginner-friendly offer",
          title: "Get $25 free with Wealthsimple",
          highlight: "$25 free",
          description:
            "If the contribution plan looks realistic and you want a simple place to start investing, this can be a reasonable next step after you compare account types and providers.",
          fitHeading: "Why this may fit after the growth plan",
          fitPoints: [
            "You want a simple account opening flow and recurring contributions.",
            "Your plan is long-term ETF investing, not frequent trading.",
            "You have already checked whether the TFSA or RRSP should be the account wrapper.",
          ],
          details: "Use the referral code at signup | Keep comparing fees, account types, and features before choosing",
          disclosure:
            "Affiliate disclosure: We may earn a referral bonus if you sign up using this code. That does not change how we explain compounding, fee drag, or account comparisons.",
          buttonLabel: "Start with Wealthsimple",
        }}
      />

      <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Compare providers next</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">If the growth plan works, compare which provider fits it</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Once you know the contribution plan, fee sensitivity, and time horizon, it becomes easier to compare brokers and investing apps without getting distracted by marketing first.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <SurfaceTrackedLink to="/blog/best-investing-apps-canada" eventName="tool_result_cta_click" ctaLabel="compare_providers_compound_best_investing_apps" trackingParams={{ tool_name: "compound_interest_calculator", section: "compare_providers_next", destination_type: "article" }} className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Best for broad shortlist</p>
            <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">Best investing apps</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use the broader provider guide if you are still comparing the main investing app options.</p>
          </SurfaceTrackedLink>
          <SurfaceTrackedLink to="/blog/wealthsimple-vs-questrade-canada" eventName="tool_result_cta_click" ctaLabel="compare_providers_compound_wealthsimple_vs_questrade" trackingParams={{ tool_name: "compound_interest_calculator", section: "compare_providers_next", destination_type: "article" }} className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Best for head-to-head</p>
            <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">Wealthsimple vs Questrade</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use the main comparison if those two platforms are your most likely next step.</p>
          </SurfaceTrackedLink>
          <SurfaceTrackedLink to="/blog/best-tfsa-brokers-canada" eventName="tool_result_cta_click" ctaLabel="compare_providers_compound_best_tfsa_brokers" trackingParams={{ tool_name: "compound_interest_calculator", section: "compare_providers_next", destination_type: "article" }} className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Best if using registered accounts</p>
            <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">Best TFSA brokers</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use the TFSA shortlist once you know tax-sheltered investing is likely the right home for the plan.</p>
          </SurfaceTrackedLink>
        </div>
      </section>
    </section>
  );
}

function RangeField({ label, value, display, min, max, step, onChange, footer }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
        <span className="text-sm font-bold text-primary dark:text-accent">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-700"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{footer[0]}</span>
        <span>{footer[1]}</span>
      </div>
    </div>
  );
}
