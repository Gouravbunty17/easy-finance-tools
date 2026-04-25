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
  getCanadianMonthlyRate,
  getCmhcPremium,
  getLandTransferTax,
  getMortgageMinimumDownPayment,
  getMortgagePayment,
  getMortgageStressTestRate,
  getPaymentFrequencyDetails,
} from '../../config/financial';

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const MORTGAGE_FAQS = [
  {
    q: 'What is the minimum down payment for a home in Canada?',
    a: 'The usual rule is 5% on the first $500,000, 10% on the portion between $500,000 and $1,499,999, and 20% once the purchase price reaches $1.5 million or more. Lender policy and product type can still change what is actually available to you.',
  },
  {
    q: 'When does CMHC mortgage insurance apply?',
    a: 'If the down payment is below 20% and the purchase is within insurable limits, default insurance usually applies. The premium is normally added to the mortgage balance rather than paid in cash at closing.',
  },
  {
    q: 'Why does a Canadian mortgage calculator use semi-annual compounding?',
    a: 'Canadian fixed-rate mortgage math is commonly quoted on a semi-annual compounding basis, which creates a slightly different effective monthly rate than a simple annual-rate-divided-by-12 approach.',
  },
  {
    q: 'Does accelerated bi-weekly really help?',
    a: 'Usually yes. Accelerated bi-weekly makes the annual payment total closer to 13 monthly payments instead of 12, which can shorten amortization and reduce total interest if you keep the payment up consistently.',
  },
  {
    q: 'What does the mortgage stress test do?',
    a: 'Federally regulated lenders generally qualify borrowers at the greater of the contract rate plus 2% or the minimum qualifying rate. That means your payment capacity is tested against a rate that is higher than the rate you may actually sign for.',
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

function InputField({ label, value, onChange, step, min, max, suffix, helpText }) {
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
          max={max}
          className="focus-ring w-full rounded-xl border-2 border-slate-200 px-4 py-3 pr-14 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {suffix}
          </span>
        ) : null}
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

function simulateMortgage(balanceStart, annualRate, monthlyPayment, scheduledMonths) {
  const monthlyRate = getCanadianMonthlyRate(annualRate);
  const months = Math.max(1, Number(scheduledMonths || 1));
  let balance = Math.max(0, Number(balanceStart || 0));
  let totalInterest = 0;
  let payoffMonth = months;
  const yearlyBreakdown = [];
  const labels = [];
  const values = [];

  for (let month = 1; month <= months; month += 1) {
    if (balance <= 0) {
      payoffMonth = month - 1;
      break;
    }

    const interest = balance * monthlyRate;
    const payment = Math.min(balance + interest, monthlyPayment);
    const principalPaid = payment - interest;
    totalInterest += interest;
    balance = Math.max(0, balance - principalPaid);

    if (month % 12 === 0 || month === months || balance <= 0) {
      yearlyBreakdown.push({
        year: Math.ceil(month / 12),
        balance,
        totalInterest,
      });
      labels.push(`Year ${Math.ceil(month / 12)}`);
      values.push(Math.round(balance));
    }

    if (balance <= 0) {
      payoffMonth = month;
      break;
    }
  }

  if (balance > 0) {
    payoffMonth = months;
  }

  return {
    totalInterest,
    payoffMonth,
    yearlyBreakdown,
    labels,
    values,
  };
}

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(DEFAULT_ASSUMPTIONS.mortgage.homePrice);
  const [downPayment, setDownPayment] = useState(DEFAULT_ASSUMPTIONS.mortgage.downPayment);
  const [rate, setRate] = useState(DEFAULT_ASSUMPTIONS.mortgage.rate);
  const [amortization, setAmortization] = useState(DEFAULT_ASSUMPTIONS.mortgage.amortization);
  const [frequency, setFrequency] = useState(DEFAULT_ASSUMPTIONS.mortgage.frequency);
  const [province, setProvince] = useState(DEFAULT_ASSUMPTIONS.mortgage.province);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(DEFAULT_ASSUMPTIONS.mortgage.extraMonthlyPayment);

  const result = useMemo(() => {
    const safeHomePrice = Math.max(0, Number(homePrice || 0));
    const safeDownPayment = Math.max(0, Number(downPayment || 0));
    const safeRate = Math.max(0, Number(rate || 0));
    const safeAmortization = Math.max(5, Number(amortization || 25));
    const safeExtraMonthlyPayment = Math.max(0, Number(extraMonthlyPayment || 0));
    const principal = Math.max(0, safeHomePrice - safeDownPayment);
    const downPaymentPct = safeHomePrice > 0 ? safeDownPayment / safeHomePrice : 0;
    const minimumDownPayment = getMortgageMinimumDownPayment(safeHomePrice);
    const cmhcPremium = downPaymentPct < 0.2 && safeHomePrice < 1500000 ? getCmhcPremium(principal, safeHomePrice || 1) : 0;
    const insuredMortgage = principal + cmhcPremium;
    const months = safeAmortization * 12;
    const baseMonthlyPayment = getMortgagePayment(insuredMortgage, safeRate, months);
    const frequencyDetails = getPaymentFrequencyDetails(frequency, baseMonthlyPayment);
    const monthlyPaymentForSchedule = baseMonthlyPayment + safeExtraMonthlyPayment + frequencyDetails.annualExtraEquivalent / 12;
    const stressRate = getMortgageStressTestRate(safeRate);
    const stressPayment = getMortgagePayment(insuredMortgage, stressRate, months);
    const landTransferTax = getLandTransferTax(safeHomePrice, province);
    const closingCosts = landTransferTax + MORTGAGE_RULES.defaultLegalAndTitleCost + MORTGAGE_RULES.defaultInspectionCost;

    const standardSchedule = simulateMortgage(insuredMortgage, safeRate, baseMonthlyPayment, months);
    const activeSchedule = simulateMortgage(insuredMortgage, safeRate, monthlyPaymentForSchedule, months);
    const yearsSaved = Math.max(0, (standardSchedule.payoffMonth - activeSchedule.payoffMonth) / 12);
    const interestSaved = Math.max(0, standardSchedule.totalInterest - activeSchedule.totalInterest);
    const rateShockIncrease = stressPayment - baseMonthlyPayment;

    let interpretation = 'The payment looks workable on paper, but the decision still depends on your closing-cost cash, renewal risk, and whether the home fits the rest of your plan.';
    if (safeHomePrice > 0 && safeDownPayment < minimumDownPayment) {
      interpretation = 'The down payment entered is below the usual minimum for this purchase price. Before comparing lenders or rates, the first decision is whether the purchase structure itself is realistic.';
    } else if (downPaymentPct < 0.2) {
      interpretation = 'This is an insured-mortgage scenario. The lower upfront cash requirement helps, but it also adds mortgage insurance and usually limits how much amortization flexibility you have.';
    } else if (rateShockIncrease > 500) {
      interpretation = 'The stress-tested payment is materially higher than the contract-rate payment. That usually means approval is more sensitive to debt ratios, and a slightly cheaper home can create a much safer budget.';
    } else if (yearsSaved >= 2) {
      interpretation = 'The extra payment strategy is doing real work here. Even modest recurring prepayments can shorten the amortization and reduce interest without changing the home itself.';
    }

    return {
      downPaymentPct,
      minimumDownPayment,
      cmhcPremium,
      insuredMortgage,
      baseMonthlyPayment,
      frequencyDetails,
      monthlyPaymentForSchedule,
      stressRate,
      stressPayment,
      rateShockIncrease,
      landTransferTax,
      closingCosts,
      standardSchedule,
      activeSchedule,
      yearsSaved,
      interestSaved,
      interpretation,
      totalInterest: activeSchedule.totalInterest,
      payoffYears: activeSchedule.payoffMonth / 12,
      finalMonthlyBuffer: Math.max(0, stressPayment - baseMonthlyPayment),
    };
  }, [amortization, downPayment, extraMonthlyPayment, frequency, homePrice, province, rate]);

  const chartData = {
    labels: result.standardSchedule.labels,
    datasets: [
      {
        label: 'Standard balance path',
        data: result.standardSchedule.values,
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.08)',
        tension: 0.3,
        pointRadius: 2,
      },
      {
        label: 'Your balance path',
        data: result.activeSchedule.values,
        borderColor: '#00557a',
        backgroundColor: 'rgba(0, 85, 122, 0.12)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="Mortgage Calculator Canada 2026: Payments, CMHC & Stress Test"
        description="Free Canadian mortgage calculator. Estimate monthly payments, CMHC premiums, closing costs, stress-test pressure, and payoff tradeoffs for 2026."
        canonical="https://easyfinancetools.com/tools/mortgage-calculator"
      />
      <ToolPageSchema
        name="Mortgage Calculator Canada 2026"
        description="Canadian mortgage planning tool for payment math, CMHC, stress-test context, closing costs, and payoff scenarios."
        canonical="https://easyfinancetools.com/tools/mortgage-calculator"
        category="FinanceApplication"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            Mortgage planning for Canadian buyers
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">Mortgage payment and ownership-cost planner</h1>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed against Canadian mortgage rules" />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            This page helps you move from "can I handle the payment?" to "what does this home actually cost once CMHC, closing costs, and rate risk are included?"
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label={result.frequencyDetails.label}
              value={formatCurrency(result.frequencyDetails.scheduledPayment, 0)}
              hint={`Mortgage balance including insurance: ${formatCurrency(result.insuredMortgage)}`}
              tone="primary"
            />
            <MetricCard
              label="Total interest"
              value={formatCurrency(result.totalInterest)}
              hint={`Projected payoff in about ${result.payoffYears.toFixed(1)} years.`}
            />
            <MetricCard
              label="Closing-cost estimate"
              value={formatCurrency(result.closingCosts)}
              hint={`Land transfer tax in ${HOUSING_PROVINCE_DETAILS[province]?.label || 'your province'}: ${formatCurrency(result.landTransferTax)}`}
              tone="warning"
            />
            <MetricCard
              label="Stress-test payment"
              value={formatCurrency(result.stressPayment)}
              hint={`Qualifying rate used: ${formatPercent(result.stressRate, 2)}`}
              tone="success"
            />
          </div>

          <div className="surface-card mt-8 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary dark:text-accent">Balance path and payoff tradeoff</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Compare the standard amortization path against the payment plan you entered.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Interest saved vs standard: {formatCurrency(result.interestSaved)}
              </div>
            </div>

            <div className="mt-6">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
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
              <p className="text-sm font-semibold text-primary dark:text-accent">Plain-English interpretation</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{result.interpretation}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">Down-payment position</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                You are putting down {formatPercent(result.downPaymentPct * 100)}. The usual minimum for this purchase price is {formatCurrency(result.minimumDownPayment)}.
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">Rate-shock reminder</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Qualifying at the stress-test rate adds about {formatCurrency(result.finalMonthlyBuffer)} to the payment benchmark versus the contract-rate payment.
              </p>
            </div>
          </div>

          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">2026 mortgage checklist</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the payment result as a decision checkpoint</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                'Confirm that your down payment clears the minimum and still leaves emergency cash after closing costs.',
                'Model the mortgage again at a slightly higher renewal rate before deciding the payment is comfortable.',
                'Check whether accelerated payments or a small recurring prepayment improve the plan more than stretching the amortization.',
                'Compare the ownership plan against FHSA, TFSA, and rent-vs-buy alternatives before treating the home as the only goal.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">How this mortgage tool works</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                It estimates the insured mortgage balance, converts the quoted Canadian rate into an effective monthly rate, and projects the payment path over the chosen amortization.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">When this is most useful</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Use it when you are close to a purchase decision, comparing down-payment sizes, or trying to understand whether faster payments matter more than negotiating a slightly lower rate.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">Common mistakes</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Buyers often focus on the contract-rate payment and ignore closing costs, insurance premiums, renewal risk, and the fact that the stress test may still limit approval even if the monthly payment looks manageable.
              </p>
            </div>
          </section>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Year-by-year balance view</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A quick way to see how slowly early principal falls and why prepayments can matter.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/60">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300">Year</th>
                    <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300">Remaining balance</th>
                    <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300">Cumulative interest</th>
                  </tr>
                </thead>
                <tbody>
                  {result.activeSchedule.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="border-t border-slate-100 dark:border-slate-700">
                      <td className="px-6 py-3 text-slate-700 dark:text-slate-200">Year {row.year}</td>
                      <td className="px-6 py-3 text-slate-700 dark:text-slate-200">{formatCurrency(row.balance)}</td>
                      <td className="px-6 py-3 text-slate-700 dark:text-slate-200">{formatCurrency(row.totalInterest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-primary dark:text-accent">Scenario inputs</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Start with the purchase price and down payment, then use the extra-payment field to see whether the ownership plan still feels right when you intentionally add margin.
          </p>

          <div className="mt-6 space-y-5">
            <InputField label="Home price" value={homePrice} onChange={(event) => setHomePrice(event.target.value)} step="1000" min="0" suffix="CAD" />
            <InputField
              label="Down payment"
              value={downPayment}
              onChange={(event) => setDownPayment(event.target.value)}
              step="1000"
              min="0"
              suffix="CAD"
              helpText="If you are still building the down payment, compare this page with your FHSA and TFSA plan before deciding what is realistic."
            />
            <InputField label="Quoted rate" value={rate} onChange={(event) => setRate(event.target.value)} step="0.05" min="0" suffix="%" />
            <SelectField
              label="Amortization"
              value={amortization}
              onChange={(event) => setAmortization(Number(event.target.value))}
              options={[5, 10, 15, 20, 25, 30].map((item) => ({ value: item, label: `${item} years` }))}
            />
            <SelectField
              label="Payment frequency"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'biweekly', label: 'Bi-weekly' },
                { value: 'accelerated', label: 'Accelerated bi-weekly' },
                { value: 'weekly', label: 'Weekly' },
              ]}
            />
            <SelectField
              label="Province"
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              options={Object.entries(HOUSING_PROVINCE_DETAILS).map(([value, item]) => ({ value, label: item.label }))}
              helpText="Used for land transfer tax planning. Municipal taxes, rebates, and product-specific rules can still change the real closing number."
            />
            <InputField
              label="Extra monthly prepayment"
              value={extraMonthlyPayment}
              onChange={(event) => setExtraMonthlyPayment(event.target.value)}
              step="50"
              min="0"
              suffix="CAD"
              helpText="Use this for recurring prepayments. Accelerated bi-weekly is modeled separately as one extra monthly payment per year."
            />
          </div>
        </aside>
      </div>

      <MethodologyPanel
        title="How this mortgage planner works"
        updated={CONTENT_LAST_REVIEWED}
        summary="This page uses Canadian semi-annual mortgage-rate math, a simplified insured-mortgage premium estimate, province-level land transfer tax rules, and a payment-path simulation to show how the mortgage behaves over time."
        assumptions={[
          'Fixed-rate mortgage math is converted to an effective monthly rate using a semi-annual compounding convention.',
          'Mortgage insurance is estimated using a simplified premium schedule and is only applied when the down payment is below 20% and the purchase is within insurable limits.',
          'Closing costs include provincial land transfer tax, a default legal/title estimate, and a home-inspection placeholder. Municipal transfer taxes and rebates are not modeled here.',
          'The stress-test comparison uses the greater of the contract rate plus 2% or the 5.25% minimum qualifying rate.',
        ]}
        sources={[
          { label: 'CMHC: Mortgage loan insurance for consumers', href: 'https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers/what-is-cmhc-mortgage-loan-insurance' },
          { label: 'OSFI Guideline B-20: Residential mortgage underwriting practices and procedures', href: 'https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline-b-20' },
          { label: 'Government of Canada: Making mortgages more affordable', href: 'https://www.canada.ca/en/department-finance/news/2024/09/making-mortgages-more-affordable.html' },
        ]}
        note="Educational planning estimate only. Always confirm lender-specific rates, underwriting, and closing-cost details before making an offer."
      />

      <ReferenceSection
        title="Source and review shell"
        intro="These are the first places to verify if you are using the result for a real purchase decision or a content update."
        references={[
          {
            label: 'CMHC mortgage insurance rules',
            body: 'Use this to verify insured-mortgage eligibility, premium treatment, and home-buyer guidance.',
            href: 'https://www.cmhc-schl.gc.ca/',
          },
          {
            label: 'OSFI stress-test guidance',
            body: 'Useful when checking how approval may differ from the contract-rate payment you see in the tool.',
            href: 'https://www.osfi-bsif.gc.ca/',
          },
          {
            label: 'Provincial and municipal closing-cost rules',
            body: 'Land transfer tax, rebates, and municipal treatment can change the cash needed to close.',
          },
          {
            label: 'Lender or broker quote sheet',
            body: 'This is the real-world check for posted rate, discount, product restrictions, and prepayment privileges.',
          },
        ]}
        note="If you publish lender examples, product names, or province-specific closing-cost guides, refresh them manually before shipping content updates."
      />

      <ActionableNextSteps
        toolName="mortgage_payment_decision_tool"
        title="Use the payment estimate to choose the right next move"
        intro="The best next step usually depends on whether the bottleneck is the payment itself, the down payment, or the stress-test approval margin."
        meaning={result.interpretation}
        steps={[
          'If the closing-cost number is the blocker, revisit FHSA, TFSA, or cash-management planning before stretching for the home price.',
          'If the stress-test payment is the blocker, run the affordability tool before you keep rate-shopping.',
          'If the payment is comfortable but interest is heavy, test a recurring prepayment or accelerated schedule before taking a longer amortization.',
        ]}
        actions={[
          {
            href: '/tools/mortgage-affordability-calculator',
            title: 'Check approval range next',
            body: 'Move from payment math into income, debt-ratio, and stress-test qualification planning.',
            ctaLabel: 'mortgage_affordability_next',
          },
          {
            href: '/tools/rent-vs-buy',
            title: 'Compare owning against renting',
            body: 'Use the home and payment assumptions here inside a richer rent-vs-buy decision workflow.',
            ctaLabel: 'rent_vs_buy_next',
          },
          {
            href: '/tools/fhsa-calculator',
            title: 'Pressure-test the down-payment plan',
            body: 'If the payment works but the cash to close is tight, compare the purchase against your FHSA strategy.',
            ctaLabel: 'fhsa_next',
          },
        ]}
        referral={{
          placement: 'mortgage_tool_next_steps',
          badge: 'Useful next step',
          title: 'Still building the down payment? Get $25 free with Wealthsimple',
          highlight: '$25 free',
          description: 'If the purchase is not immediate, an FHSA or TFSA can be the better next move than stretching for the home today.',
          details: 'Use the bonus only if the account fits your plan | Not a substitute for comparing rates or mortgage terms',
          fitHeading: 'Why this may fit',
          fitPoints: [
            'Useful if you still need to grow the down payment before buying.',
            'Works better as a next step after a real savings plan, not as a reason to rush into an account.',
          ],
          buttonLabel: 'Open an FHSA or TFSA',
        }}
      />

      <FAQ items={MORTGAGE_FAQS} />
    </main>
  );
}
