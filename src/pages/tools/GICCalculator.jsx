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
  DATA_SNAPSHOT_LABEL,
  DEFAULT_ASSUMPTIONS,
  GIC_COMPOUNDING_OPTIONS,
  GIC_SAMPLE_PRODUCTS,
  getGicMaturityValue,
} from '../../config/financial';

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const GIC_FAQS = [
  {
    q: 'When does a GIC make more sense than an ETF?',
    a: 'Usually when the timeline is short, the cash is earmarked for a near-term goal, or principal stability matters more than upside. The tradeoff is that a GIC will usually lag long-run equity returns if the money could have stayed invested longer.',
  },
  {
    q: 'Should I hold a GIC in a TFSA?',
    a: 'Often yes if you have TFSA room and the account is being used for safe short-term or emergency reserves. The stronger question is what job the account needs to do for you, not whether the product is tax-sheltered by default.',
  },
  {
    q: 'Why does compounding frequency matter?',
    a: 'More frequent compounding slightly increases the maturity value when the quoted rate and term are the same. It rarely changes the decision by itself, but it is still worth checking when two products look similar.',
  },
  {
    q: 'Are the example GIC rates live?',
    a: 'No. They are illustrative planning rows to make comparison easier. Before taking action, verify the current rate, term, redeemability, and deposit-insurance treatment with the issuer.',
  },
  {
    q: 'What is a GIC ladder?',
    a: 'A ladder spreads the cash across multiple maturities instead of locking everything into one term. It can help you balance rate risk, liquidity, and the need for regular maturities.',
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

function formatPercent(value, digits = 2) {
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

export default function GICCalculator() {
  const [principal, setPrincipal] = useState(DEFAULT_ASSUMPTIONS.gic.principal);
  const [rate, setRate] = useState(DEFAULT_ASSUMPTIONS.gic.rate);
  const [term, setTerm] = useState(DEFAULT_ASSUMPTIONS.gic.term);
  const [frequency, setFrequency] = useState(DEFAULT_ASSUMPTIONS.gic.frequency);
  const [accountType, setAccountType] = useState(DEFAULT_ASSUMPTIONS.gic.accountType);
  const [marginalTaxRate, setMarginalTaxRate] = useState(DEFAULT_ASSUMPTIONS.gic.marginalTaxRate);
  const [inflationRate, setInflationRate] = useState(DEFAULT_ASSUMPTIONS.gic.inflationRate);

  const result = useMemo(() => {
    const safePrincipal = Math.max(0, Number(principal || 0));
    const safeRate = Math.max(0, Number(rate || 0));
    const safeTerm = Math.max(1, Number(term || 1));
    const safeFrequency = Math.max(1, Number(frequency || 1));
    const safeMarginalTaxRate = Math.max(0, Number(marginalTaxRate || 0));
    const safeInflationRate = Math.max(0, Number(inflationRate || 0));

    const maturityValue = getGicMaturityValue(safePrincipal, safeRate, safeTerm, safeFrequency);
    const interestEarned = maturityValue - safePrincipal;
    const afterTaxInterest = accountType === 'taxable'
      ? interestEarned * (1 - safeMarginalTaxRate / 100)
      : interestEarned;
    const afterTaxMaturity = safePrincipal + afterTaxInterest;
    const realMaturity = afterTaxMaturity / Math.pow(1 + safeInflationRate / 100, safeTerm);
    const effectiveAnnualRate = (Math.pow(1 + safeRate / 100 / safeFrequency, safeFrequency) - 1) * 100;

    const labels = ['Start'];
    const values = [Math.round(safePrincipal)];
    for (let year = 1; year <= safeTerm; year += 1) {
      labels.push(`Year ${year}`);
      values.push(Math.round(getGicMaturityValue(safePrincipal, safeRate, year, safeFrequency)));
    }

    const ladderSplit = safePrincipal / 5;
    const ladderAverageTerm = 3;
    const ladderEstimate = getGicMaturityValue(ladderSplit, safeRate, ladderAverageTerm, safeFrequency) * 5;

    let interpretation = 'A GIC usually makes the most sense when principal stability matters more than upside and the goal timeline is clear.';
    if (accountType === 'taxable' && safeMarginalTaxRate >= 30) {
      interpretation = 'This looks like a taxable-account scenario where interest is doing less work after tax. If TFSA room exists and the money is still safe-capital money, a TFSA GIC may be the cleaner fit.';
    } else if (safeTerm >= 4) {
      interpretation = 'A longer GIC term can raise the maturity value, but it also increases lock-up risk. This is the point where redeemability and laddering usually matter as much as the headline rate.';
    } else if (safeRate < 3) {
      interpretation = 'At this rate, the decision is less about maximizing return and more about cash safety or convenience. Make sure you are not accepting a convenience penalty without noticing it.';
    }

    return {
      maturityValue,
      interestEarned,
      afterTaxInterest,
      afterTaxMaturity,
      realMaturity,
      effectiveAnnualRate,
      labels,
      values,
      ladderEstimate,
      interpretation,
    };
  }, [accountType, frequency, inflationRate, marginalTaxRate, principal, rate, term]);

  const chartData = {
    labels: result.labels,
    datasets: [
      {
        label: 'Projected GIC value',
        data: result.values,
        borderColor: '#00557a',
        backgroundColor: 'rgba(0, 85, 122, 0.12)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="GIC Decision Tool Canada 2026"
        description="Compare Canadian GIC scenarios, estimate maturity value and after-tax interest, and decide whether a GIC fits a TFSA, RRSP, or taxable account in 2026."
        canonical="https://easyfinancetools.com/tools/gic-calculator"
      />
      <ToolPageSchema
        name="GIC Decision Tool Canada 2026"
        description="Canadian GIC planning tool for maturity value, after-tax interest, account choice, and laddering context."
        canonical="https://easyfinancetools.com/tools/gic-calculator"
        category="FinanceApplication"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            Safer-savings decisions for Canadian investors
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">GIC return and account-fit planner</h1>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed against deposit-product assumptions" />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Use this page to compare GIC scenarios, see what the interest is really worth after tax and inflation, and decide whether the product belongs in a TFSA, RRSP, or plain taxable account.
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Maturity value" value={formatCurrency(result.maturityValue)} hint={`${term} year term at ${formatPercent(rate)}.`} tone="primary" />
            <MetricCard label="Interest earned" value={formatCurrency(result.interestEarned)} hint={accountType === 'taxable' ? 'Before tax.' : 'Inside a registered or sheltered account scenario.'} />
            <MetricCard label="After-tax maturity" value={formatCurrency(result.afterTaxMaturity)} hint={accountType === 'taxable' ? `Assumes ${formatPercent(marginalTaxRate)} marginal tax on interest.` : 'Tax drag not modeled for this account type.'} tone="success" />
            <MetricCard label="Real value after inflation" value={formatCurrency(result.realMaturity)} hint={`Inflation assumption: ${formatPercent(inflationRate)}.`} tone="warning" />
          </div>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary dark:text-accent">Product comparison snapshot</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{DATA_SNAPSHOT_LABEL}. These are planning rows, not live quotes.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Effective annual rate: {formatPercent(result.effectiveAnnualRate)}
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Example</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Rate</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Term</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Why it matters</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {GIC_SAMPLE_PRODUCTS.map((product) => (
                    <tr key={product.id} className="border-t border-slate-100 dark:border-slate-700">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{product.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{product.issuer}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{formatPercent(product.rate)}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{product.term} year{product.term === 1 ? '' : 's'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{product.notes}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setRate(product.rate);
                            setTerm(product.term);
                            setFrequency(product.frequency);
                          }}
                          className="rounded-full border border-primary px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          Use scenario
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="surface-card mt-8 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary dark:text-accent">Maturity path</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  This is simple compounding over the chosen term. Use it to compare stability against flexibility and inflation drag.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                5-rung ladder estimate: {formatCurrency(result.ladderEstimate)}
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
              <p className="text-sm font-semibold text-primary dark:text-accent">What yield means here</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                A GIC is about contract certainty, not upside. The right comparison is often between safety, tax treatment, and time horizon rather than simply the highest posted rate.
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">Ladder reminder</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                If you dislike locking everything away at once, a ladder can improve liquidity without forcing you to abandon GICs entirely.
              </p>
            </div>
          </div>

          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">2026 GIC checklist</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Make the product answer the actual job</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                'Confirm whether the cash is for an emergency fund, a near-term purchase, or a temporary parking spot before choosing the term.',
                'Compare redeemable versus non-redeemable terms so you understand what flexibility costs.',
                'If the account is taxable, check whether the after-tax result is still worth the lock-up once interest income is taxed.',
                'Use a TFSA or RRSP only if the account role still makes sense after you consider room, liquidity, and the rest of your savings plan.',
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
                It compounds the deposit using the selected rate, term, and compounding frequency, then adjusts the result for tax and inflation assumptions where relevant.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">When it is most useful</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                This page is strongest when you are deciding whether safe capital belongs in a GIC at all, how long to lock it up, and which account type changes the result the most.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">Common mistakes</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Chasing a slightly higher rate while ignoring redeemability, tax drag, and goal timing can be a bigger mistake than accepting a modestly lower headline return.
              </p>
            </div>
          </section>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-primary dark:text-accent">Scenario inputs</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Enter the deposit, then decide whether the real variable is the rate, the term, or the account type. That is usually where the planning decision actually sits.
          </p>

          <div className="mt-6 space-y-5">
            <InputField label="Deposit amount" value={principal} onChange={(event) => setPrincipal(event.target.value)} step="500" min="0" suffix="CAD" />
            <InputField label="Quoted rate" value={rate} onChange={(event) => setRate(event.target.value)} step="0.05" min="0" suffix="%" />
            <InputField label="Term" value={term} onChange={(event) => setTerm(event.target.value)} step="1" min="1" suffix="yrs" />
            <SelectField label="Compounding frequency" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} options={GIC_COMPOUNDING_OPTIONS.map((item) => ({ value: item.value, label: item.label }))} />
            <SelectField
              label="Account type"
              value={accountType}
              onChange={(event) => setAccountType(event.target.value)}
              options={[
                { value: 'tfsa', label: 'TFSA' },
                { value: 'rrsp', label: 'RRSP' },
                { value: 'taxable', label: 'Taxable account' },
              ]}
              helpText="Choose taxable only when you want the tool to estimate interest after tax."
            />
            {accountType === 'taxable' ? (
              <InputField label="Marginal tax rate" value={marginalTaxRate} onChange={(event) => setMarginalTaxRate(event.target.value)} step="1" min="0" suffix="%" />
            ) : null}
            <InputField label="Inflation assumption" value={inflationRate} onChange={(event) => setInflationRate(event.target.value)} step="0.1" min="0" suffix="%" helpText="Useful when you want to compare nominal return against real purchasing power." />
          </div>
        </aside>
      </div>

      <MethodologyPanel
        title="How this GIC planner works"
        updated={CONTENT_LAST_REVIEWED}
        summary="The tool applies compound-interest math to the deposit, then shows how account type, tax drag, and inflation assumptions can change the result even when the quoted rate stays the same."
        assumptions={[
          'Rates and terms are illustrative planning assumptions, not live market quotes.',
          'Tax drag is only estimated in the taxable-account scenario and is based on the marginal tax rate you enter.',
          'Inflation is modeled as a simple annual purchasing-power reduction, not a live CPI forecast.',
          'Deposit insurance, issuer-specific redemption rules, and ladder implementation details are not modeled in the maturity-value output.',
        ]}
        sources={[
          { label: 'FCAC: Guaranteed investment certificates', href: 'https://www.canada.ca/en/financial-consumer-agency/services/savings-investments/guaranteed-investment-certificates.html' },
          { label: 'Government of Canada: Deposit insurance basics', href: 'https://www.canada.ca/en/financial-consumer-agency/services/banking/deposit-insurance.html' },
        ]}
        note="Educational planning estimate only. Verify actual rates, deposit insurance coverage, and product restrictions before locking in cash."
      />

      <ReferenceSection
        title="Source and reference shell"
        intro="Use these checks before turning the example row into a real deposit decision or a published content update."
        references={[
          {
            label: 'Issuer factsheet or product page',
            body: 'Confirm the current rate, term, redeemability, minimum deposit, and compounding treatment for the actual GIC.',
          },
          {
            label: 'Deposit-insurance treatment',
            body: 'Check whether the issuer falls under CDIC or a provincial credit-union regime and whether the exact product is covered.',
            href: 'https://www.cdic.ca/',
          },
          {
            label: 'Account-type comparison',
            body: 'Use TFSA and RRSP room data before assuming the registered account is automatically the best home for the GIC.',
          },
          {
            label: 'Inflation and opportunity-cost check',
            body: 'The safer the product, the more important it is to compare the real return against the job the money needs to do.',
          },
        ]}
      />

      <ActionableNextSteps
        toolName="gic_decision_tool"
        title="Choose the next move based on the role of the cash"
        intro="The right next step is usually about account fit and timeline, not just squeezing a few extra basis points out of the quote."
        meaning={result.interpretation}
        steps={[
          'If the money is for a near-term goal, prioritize term fit and access over maximizing headline return.',
          'If tax drag is the issue, compare the same deposit in a TFSA before accepting the taxable-account result.',
          'If the rate looks too low, compare this safe-capital choice against HISA or a ladder instead of defaulting to one-term lock-up.',
        ]}
        actions={[
          {
            href: '/tools/tfsa-calculator',
            title: 'Check TFSA room first',
            body: 'If the cash belongs in a sheltered account, confirm whether your TFSA has room before locking in the GIC.',
            ctaLabel: 'tfsa_room_next',
          },
          {
            href: '/tools/savings-goal-calculator',
            title: 'Match the term to the goal',
            body: 'Route the maturity result into a goal-timeline calculator before you commit to the deposit term.',
            ctaLabel: 'savings_goal_next',
          },
          {
            href: '/blog/best-hisa-canada-2026',
            title: 'Compare against HISA flexibility',
            body: 'If you are uneasy about the lock-up, compare the decision against current high-interest savings options.',
            ctaLabel: 'hisa_article_next',
            destinationType: 'article',
          },
        ]}
      />

      <FAQ items={GIC_FAQS} />
    </main>
  );
}
