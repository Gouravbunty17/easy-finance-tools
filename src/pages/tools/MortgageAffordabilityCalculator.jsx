import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import MethodologyPanel from '../../components/MethodologyPanel';
import ToolPageSchema from '../../components/ToolPageSchema';
import ToolByline from '../../components/ToolByline';
import ActionableNextSteps from '../../components/ActionableNextSteps';
import EducationalDisclaimer from '../../components/EducationalDisclaimer';
import ReferenceSection from '../../components/ReferenceSection';
import {
  CONTENT_LAST_REVIEWED,
  DEFAULT_ASSUMPTIONS,
  HOUSING_PROVINCE_DETAILS,
  MORTGAGE_RULES,
  getLandTransferTax,
  getMortgagePrincipalFromPayment,
  getMortgageStressTestRate,
} from '../../config/financial';

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const AFFORDABILITY_FAQS = [
  {
    q: 'What do GDS and TDS mean?',
    a: 'Gross debt service usually measures housing costs against gross income, while total debt service adds other debt payments. They are lender-underwriting tools, not personal-budget guarantees.',
  },
  {
    q: 'Why is the approval result lower than what I feel I can pay?',
    a: 'Because lenders usually qualify you using the stress-test rate and debt-ratio limits. You may feel comfortable at the contract rate, but approval still depends on the higher benchmark.',
  },
  {
    q: 'Do condo fees matter for affordability?',
    a: 'Yes. A portion of condo fees is often included in qualification and the full amount still matters for your real monthly budget even if a lender applies a partial rule.',
  },
  {
    q: 'Does a bigger down payment always fix approval?',
    a: 'Not always. A bigger down payment reduces the mortgage balance, but income, debt payments, taxes, condo fees, and the stress-test rate can still keep the home out of reach.',
  },
  {
    q: 'Should I use this result as my target purchase budget?',
    a: 'Use it as an upper-bound planning number, not a required spend target. Many buyers are safer choosing a cheaper home than the maximum result suggests.',
  },
];

function formatCurrency(value, digits = 0) {
  return Number(value || 0).toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatPercent(value, digits = 1) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

function MetricCard({ label, value, hint, tone = 'default' }) {
  const tones = {
    default: 'bg-white text-primary dark:bg-gray-800 dark:text-accent',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    primary: 'bg-gradient-to-br from-primary to-secondary text-white',
  };

  return (
    <div className={`rounded-2xl border border-slate-200 p-5 dark:border-slate-700 ${tones[tone] || tones.default}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-2 text-sm opacity-80">{hint}</p> : null}
    </div>
  );
}

function InputField({ label, value, onChange, step, min, suffix, helpText }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          className="focus-ring w-full rounded-xl border-2 border-slate-200 px-4 py-3 pr-14 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        {suffix ? <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 dark:text-slate-400">{suffix}</span> : null}
      </div>
      {helpText ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helpText}</p> : null}
    </div>
  );
}

function SelectField({ label, value, onChange, options, helpText }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="focus-ring w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {helpText ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helpText}</p> : null}
    </div>
  );
}

export default function MortgageAffordabilityCalculator() {
  const [householdIncome, setHouseholdIncome] = useState(DEFAULT_ASSUMPTIONS.mortgageAffordability.householdIncome);
  const [downPayment, setDownPayment] = useState(DEFAULT_ASSUMPTIONS.mortgageAffordability.downPayment);
  const [monthlyDebtPayments, setMonthlyDebtPayments] = useState(DEFAULT_ASSUMPTIONS.mortgageAffordability.monthlyDebtPayments);
  const [interestRate, setInterestRate] = useState(DEFAULT_ASSUMPTIONS.mortgageAffordability.interestRate);
  const [amortization, setAmortization] = useState(DEFAULT_ASSUMPTIONS.mortgageAffordability.amortization);
  const [province, setProvince] = useState(DEFAULT_ASSUMPTIONS.mortgageAffordability.province);
  const [propertyTaxMonthly, setPropertyTaxMonthly] = useState(DEFAULT_ASSUMPTIONS.mortgageAffordability.propertyTaxMonthly);
  const [heatingMonthly, setHeatingMonthly] = useState(DEFAULT_ASSUMPTIONS.mortgageAffordability.heatingMonthly);
  const [condoFeesMonthly, setCondoFeesMonthly] = useState(DEFAULT_ASSUMPTIONS.mortgageAffordability.condoFeesMonthly);

  const result = useMemo(() => {
    const safeIncome = Math.max(0, Number(householdIncome || 0));
    const safeDownPayment = Math.max(0, Number(downPayment || 0));
    const safeDebt = Math.max(0, Number(monthlyDebtPayments || 0));
    const safeInterestRate = Math.max(0, Number(interestRate || 0));
    const safeAmortization = Math.max(5, Number(amortization || 25));
    const safeTax = Math.max(0, Number(propertyTaxMonthly || 0));
    const safeHeating = Math.max(0, Number(heatingMonthly || 0));
    const safeCondo = Math.max(0, Number(condoFeesMonthly || 0));

    const monthlyIncome = safeIncome / 12;
    const qualifyingRate = getMortgageStressTestRate(safeInterestRate);
    const gdsLimit = monthlyIncome * 0.39;
    const tdsLimit = monthlyIncome * 0.44;
    const nonMortgageHousingCost = safeTax + safeHeating + safeCondo * 0.5;
    const maxPaymentFromGds = Math.max(0, gdsLimit - nonMortgageHousingCost);
    const maxPaymentFromTds = Math.max(0, tdsLimit - nonMortgageHousingCost - safeDebt);
    const affordableMortgagePayment = Math.max(0, Math.min(maxPaymentFromGds, maxPaymentFromTds));
    const principal = getMortgagePrincipalFromPayment(affordableMortgagePayment, qualifyingRate, safeAmortization * 12);
    const maxHomePrice = principal + safeDownPayment;
    const landTransferTax = getLandTransferTax(maxHomePrice, province);
    const closingCosts = landTransferTax + MORTGAGE_RULES.defaultLegalAndTitleCost + MORTGAGE_RULES.defaultInspectionCost;
    const housingCostAtLimit = affordableMortgagePayment + nonMortgageHousingCost;
    const gdsUsed = monthlyIncome > 0 ? housingCostAtLimit / monthlyIncome : 0;
    const tdsUsed = monthlyIncome > 0 ? (housingCostAtLimit + safeDebt) / monthlyIncome : 0;

    const sensitivityRates = [safeInterestRate, safeInterestRate + 0.5, safeInterestRate + 1, qualifyingRate];
    const sensitivityLabels = ['Quoted rate', '+0.5%', '+1.0%', 'Stress test'];
    const sensitivityValues = sensitivityRates.map((item) => {
      const maxPrincipal = getMortgagePrincipalFromPayment(affordableMortgagePayment, item, safeAmortization * 12);
      return Math.round(maxPrincipal + safeDownPayment);
    });

    let interpretation = 'This estimate is best treated as a ceiling, not a target. If the result feels tight, the right move is often a lower home price rather than trying to stretch the ratios.';
    if (affordableMortgagePayment <= 0) {
      interpretation = 'The current debt, taxes, heating, and condo-fee assumptions leave almost no room for the mortgage payment. The next decision is usually debt cleanup, a bigger down payment, or a lower-cost home target.';
    } else if (gdsUsed > 0.37 || tdsUsed > 0.42) {
      interpretation = 'This scenario is already close to common underwriting limits. Even if approval is possible, a small rate move or condo-fee change can make the budget feel much tighter than the headline result suggests.';
    } else if (qualifyingRate - safeInterestRate >= 2) {
      interpretation = 'The stress test is doing a lot of work here. Your cash-flow comfort may be fine at the contract rate, but approval range is still being pulled down by the qualifying rate.';
    }

    return {
      monthlyIncome,
      qualifyingRate,
      affordableMortgagePayment,
      principal,
      maxHomePrice,
      landTransferTax,
      closingCosts,
      gdsUsed,
      tdsUsed,
      maxPaymentFromGds,
      maxPaymentFromTds,
      sensitivityLabels,
      sensitivityValues,
      interpretation,
    };
  }, [amortization, condoFeesMonthly, downPayment, heatingMonthly, householdIncome, interestRate, monthlyDebtPayments, propertyTaxMonthly, province]);

  const chartData = {
    labels: result.sensitivityLabels,
    datasets: [
      {
        label: 'Estimated max home price',
        data: result.sensitivityValues,
        borderColor: '#00557a',
        backgroundColor: 'rgba(0, 85, 122, 0.12)',
        fill: true,
        tension: 0.25,
        pointRadius: 3,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="Mortgage Affordability Decision Tool Canada 2026"
        description="Estimate an affordable home price in Canada using stress-test rules, debt ratios, property tax, and other housing-cost assumptions for 2026 planning."
        canonical="https://easyfinancetools.com/tools/mortgage-affordability-calculator"
      />
      <ToolPageSchema
        name="Mortgage Affordability Decision Tool Canada 2026"
        description="Canadian mortgage affordability planner for debt ratios, stress-test payments, home-price range, and closing-cost context."
        canonical="https://easyfinancetools.com/tools/mortgage-affordability-calculator"
        category="FinanceApplication"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            Home-buying qualification workflow
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">Mortgage affordability and approval-range planner</h1>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed against lender stress-test assumptions" />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Use this page to estimate a realistic home-price ceiling after debt ratios, property taxes, condo fees, and the mortgage stress test all have their say.
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Estimated max home price"
              value={formatCurrency(result.maxHomePrice)}
              hint={`Estimated mortgage room: ${formatCurrency(result.principal)}`}
              tone="primary"
            />
            <MetricCard
              label="Stress-tested payment room"
              value={formatCurrency(result.affordableMortgagePayment)}
              hint={`Qualifying rate used: ${formatPercent(result.qualifyingRate, 2)}`}
            />
            <MetricCard
              label="GDS / TDS"
              value={`${formatPercent(result.gdsUsed * 100)} / ${formatPercent(result.tdsUsed * 100)}`}
              hint="A quick way to see whether the scenario is already brushing up against common underwriting limits."
              tone="warning"
            />
            <MetricCard
              label="Cash to close estimate"
              value={formatCurrency(result.closingCosts + Number(downPayment || 0))}
              hint={`Closing costs only: ${formatCurrency(result.closingCosts)}`}
              tone="success"
            />
          </div>

          <div className="surface-card mt-8 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary dark:text-accent">Rate sensitivity</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  This shows how quickly approval range can change when rates move, even if income stays the same.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Housing cost budget: {formatCurrency(result.maxPaymentFromGds)} from GDS
              </div>
            </div>
            <div className="mt-6">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => formatCurrency(Number(ctx.raw)),
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: { callback: (value) => formatCurrency(Number(value)) },
                    },
                  },
                }}
                height={320}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">Plain-English interpretation</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{result.interpretation}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">GDS limit view</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                About {formatCurrency(result.maxPaymentFromGds)} of the monthly budget is available for principal and interest after taxes, heating, and 50% of condo fees.
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">TDS limit view</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Existing debt payments reduce the room further. In this case, the TDS-based payment cap is {formatCurrency(result.maxPaymentFromTds)}.
              </p>
            </div>
          </div>

          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">2026 affordability checklist</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the result as a planning boundary, not a spending target</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                'Run the budget again with a slightly lower home price and keep the version that still feels comfortable if rates stay higher at renewal.',
                'Include condo fees, heating, and property tax even if the listing headline focuses only on mortgage payment.',
                'If debt-service ratios are tight, compare paying down debt first against stretching for a larger down payment.',
                'Keep enough liquid cash for closing costs and post-close repairs instead of using every available dollar on the down payment.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">How this tool works</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                The planner starts from gross household income, subtracts taxes, heat, condo-fee treatment, and existing debt, then backs into a mortgage size using the stress-test rate.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">When it is most useful</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Use it before you shop listings too aggressively. It is especially helpful when you already know your income and debt profile but need a saner purchase range.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">Common mistakes</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                People often confuse approval range with a safe long-term budget, understate condo fees and property taxes, or ignore how much other debt compresses the mortgage size.
              </p>
            </div>
          </section>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-primary dark:text-accent">Scenario inputs</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Treat this as a lender-style screening view first. If you want a lifestyle answer, compare it against the mortgage payment page and the rent-vs-buy workflow afterward.
          </p>

          <div className="mt-6 space-y-5">
            <InputField label="Household gross income" value={householdIncome} onChange={(event) => setHouseholdIncome(event.target.value)} step="1000" min="0" suffix="CAD" />
            <InputField label="Down payment" value={downPayment} onChange={(event) => setDownPayment(event.target.value)} step="1000" min="0" suffix="CAD" />
            <InputField
              label="Monthly debt payments"
              value={monthlyDebtPayments}
              onChange={(event) => setMonthlyDebtPayments(event.target.value)}
              step="25"
              min="0"
              suffix="CAD"
              helpText="Include car loans, student loans, credit-card minimums, and any other fixed monthly debt obligations."
            />
            <InputField label="Quoted mortgage rate" value={interestRate} onChange={(event) => setInterestRate(event.target.value)} step="0.05" min="0" suffix="%" />
            <SelectField
              label="Amortization"
              value={amortization}
              onChange={(event) => setAmortization(Number(event.target.value))}
              options={[10, 15, 20, 25, 30].map((item) => ({ value: item, label: `${item} years` }))}
            />
            <SelectField
              label="Province"
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              options={Object.entries(HOUSING_PROVINCE_DETAILS).map(([value, item]) => ({ value, label: item.label }))}
            />
            <InputField label="Monthly property tax estimate" value={propertyTaxMonthly} onChange={(event) => setPropertyTaxMonthly(event.target.value)} step="25" min="0" suffix="CAD" />
            <InputField label="Monthly heating estimate" value={heatingMonthly} onChange={(event) => setHeatingMonthly(event.target.value)} step="10" min="0" suffix="CAD" />
            <InputField label="Monthly condo fees" value={condoFeesMonthly} onChange={(event) => setCondoFeesMonthly(event.target.value)} step="25" min="0" suffix="CAD" helpText="Enter 0 for detached or freehold scenarios with no condo fee." />
          </div>
        </aside>
      </div>

      <MethodologyPanel
        title="How this affordability planner works"
        updated={CONTENT_LAST_REVIEWED}
        summary="The tool estimates available mortgage payment room by applying common GDS and TDS-style thresholds to gross income, then converts that payment into a mortgage amount using the stress-test rate and the selected amortization."
        assumptions={[
          'Housing-cost ratios are based on a simplified 39% GDS and 44% TDS planning framework.',
          'Property tax, heating, and 50% of condo fees are included before the mortgage payment budget is calculated.',
          'The mortgage principal estimate uses the qualifying rate, not the contract-rate payment.',
          'Closing costs include provincial land transfer tax plus legal/title and inspection placeholders. Municipal transfer taxes and rebates are not included here.',
        ]}
        sources={[
          { label: 'OSFI Guideline B-20', href: 'https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline-b-20' },
          { label: 'FCAC: Buying a home', href: 'https://www.canada.ca/en/financial-consumer-agency/services/mortgages/buying-home.html' },
          { label: 'Government of Canada: Mortgage affordability measures', href: 'https://www.canada.ca/en/department-finance/news/2024/09/making-mortgages-more-affordable.html' },
        ]}
        note="Educational planning estimate only. Actual lender approval depends on credit, product choice, documentation, and institution-specific underwriting."
      />

      <ReferenceSection
        title="Source and reference shell"
        intro="Use these checkpoints when you want to turn the estimate into a real pre-approval conversation or a production content update."
        references={[
          {
            label: 'OSFI and lender qualification guidance',
            body: 'Use these sources to confirm stress-test treatment, debt-ratio thresholds, and underwriting language.',
            href: 'https://www.osfi-bsif.gc.ca/',
          },
          {
            label: 'Property-tax and condo-fee reality check',
            body: 'Before trusting a listing budget, verify the actual tax bill, heating profile, and recurring condo obligations for the specific property type.',
          },
          {
            label: 'Closing-cost breakdown',
            body: 'Provincial and municipal transfer taxes, legal fees, inspection, and title insurance can materially change the amount of cash you need beyond the down payment.',
          },
          {
            label: 'Pre-approval or broker worksheet',
            body: 'This is the practical check for whether your document set, credit profile, and chosen product support the planning scenario.',
          },
        ]}
      />

      <ActionableNextSteps
        toolName="mortgage_affordability_decision_tool"
        title="Use the approval range to narrow the real decision"
        intro="The smartest next move usually depends on whether the result is limited by debt ratios, cash to close, or the stress test itself."
        meaning={result.interpretation}
        steps={[
          'If the price range is lower than expected, rerun the plan with lower debt payments or a bigger down payment before assuming the market is the only problem.',
          'If approval is possible but the GDS/TDS result is tight, compare the same home in the mortgage-payment page before deciding it is safe.',
          'If the down payment is the blocker, route the goal back through FHSA or TFSA planning rather than treating approval math as the whole problem.',
        ]}
        actions={[
          {
            href: '/tools/mortgage-calculator',
            title: 'Translate approval into a real payment plan',
            body: 'Take the upper-end home price and see how the mortgage behaves once insurance, closing costs, and prepayments are included.',
            ctaLabel: 'mortgage_payment_followup',
          },
          {
            href: '/tools/rent-vs-buy',
            title: 'Compare the approval range against renting',
            body: 'A qualifying price is not automatically the best choice, especially when rent remains competitive.',
            ctaLabel: 'rent_vs_buy_followup',
          },
          {
            href: '/tools/fhsa-calculator',
            title: 'Strengthen the down-payment plan',
            body: 'If cash to close is the real bottleneck, shift the next step back to savings-account strategy before moving the purchase target.',
            ctaLabel: 'fhsa_followup',
          },
        ]}
      />

      <FAQ items={AFFORDABILITY_FAQS} />
    </main>
  );
}
