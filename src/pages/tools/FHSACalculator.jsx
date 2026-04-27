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
import FAQSchema from '../../components/FAQSchema';
import MethodologyPanel from '../../components/MethodologyPanel';
import ToolPageSchema from '../../components/ToolPageSchema';
import ToolByline from '../../components/ToolByline';
import ActionableNextSteps from '../../components/ActionableNextSteps';
import EducationalDisclaimer from '../../components/EducationalDisclaimer';
import ReferenceSection from '../../components/ReferenceSection';
import {
  CANADIAN_PROVINCES,
  CONTENT_LAST_REVIEWED,
  DEFAULT_ASSUMPTIONS,
  REGISTERED_ACCOUNT_LIMITS,
} from '../../config/financial';
import { calculateFhsaScenario, formatFhsaCurrency as formatCurrency } from '../../lib/fhsaPlanning';

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const FHSA_FAQS = [
  {
    q: 'Who can usually open an FHSA?',
    a: 'In general, you need to be a Canadian resident, at least 18, and a qualifying first-time home buyer under the CRA definition. You also need to stay within the FHSA age rules when opening and contributing.',
  },
  {
    q: 'How much FHSA room can carry forward?',
    a: 'Unused FHSA participation room can generally carry forward up to $8,000. That is why the usable room in one year is often capped at $16,000: the current-year annual limit plus up to one year of unused room.',
  },
  {
    q: 'Is the FHSA always better than a TFSA or RRSP?',
    a: 'No. The FHSA is strongest when you expect to make a qualifying home purchase and the deduction matters at your current tax bracket. If the timeline or eligibility is uncertain, the TFSA or RRSP can be the cleaner next account.',
  },
  {
    q: 'What happens if I never buy a home?',
    a: 'If you do not make a qualifying home purchase, FHSA assets can usually be transferred to an RRSP or RRIF on a tax-deferred basis if the applicable rules are met. Withdrawing the money directly would generally make it taxable.',
  },
  {
    q: 'Can both spouses or partners use an FHSA?',
    a: 'Yes, if both people qualify individually. Many couples plan with two FHSAs, then compare the combined tax deduction and the combined down-payment pool against their purchase timeline.',
  },
];

function ResultMetric({ label, value, hint, tone = 'default' }) {
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

function ScenarioInput({ label, value, onChange, type = 'number', step, min, max, suffix, helpText }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      <div className="relative">
        <input
          type={type}
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

export default function FHSACalculator() {
  const [birthYear, setBirthYear] = useState(DEFAULT_ASSUMPTIONS.fhsa.birthYear);
  const [province, setProvince] = useState(DEFAULT_ASSUMPTIONS.fhsa.province);
  const [income, setIncome] = useState(DEFAULT_ASSUMPTIONS.fhsa.income);
  const [availableRoomNow, setAvailableRoomNow] = useState(DEFAULT_ASSUMPTIONS.fhsa.availableRoomNow);
  const [contributedToDate, setContributedToDate] = useState(DEFAULT_ASSUMPTIONS.fhsa.contributedToDate);
  const [currentBalance, setCurrentBalance] = useState(DEFAULT_ASSUMPTIONS.fhsa.currentBalance);
  const [annualContribution, setAnnualContribution] = useState(DEFAULT_ASSUMPTIONS.fhsa.annualContribution);
  const [expectedReturn, setExpectedReturn] = useState(DEFAULT_ASSUMPTIONS.fhsa.expectedReturn);
  const [yearsToPurchase, setYearsToPurchase] = useState(DEFAULT_ASSUMPTIONS.fhsa.yearsToPurchase);

  const result = useMemo(() => calculateFhsaScenario({
    birthYear,
    province,
    income,
    availableRoomNow,
    contributedToDate,
    currentBalance,
    annualContribution,
    expectedReturn,
    yearsToPurchase,
  }), [annualContribution, availableRoomNow, birthYear, contributedToDate, currentBalance, expectedReturn, income, province, yearsToPurchase]);

  const chartData = {
    labels: result.chartLabels,
    datasets: [
      {
        label: 'Projected FHSA balance',
        data: result.chartValues,
        fill: true,
        backgroundColor: 'rgba(34, 197, 94, 0.12)',
        borderColor: '#22c55e',
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="FHSA Calculator Canada 2026: Tax Savings & Growth"
        description="Free Canadian FHSA calculator. Estimate 2026 tax savings, contribution room, down-payment growth, and FHSA vs TFSA vs RRSP."
        canonical="https://easyfinancetools.com/tools/fhsa-calculator"
      />
      <ToolPageSchema
        name="FHSA Calculator Canada 2026"
        description="Canadian FHSA planning tool for tax savings, contribution room, projected growth, and down-payment decisions."
        canonical="https://easyfinancetools.com/tools/fhsa-calculator"
        category="FinanceApplication"
      />
      <FAQSchema faqs={FHSA_FAQS} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            FHSA planning for Canadian investors
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">FHSA Calculator Canada 2026 — Tax Savings & Down-Payment Planner</h1>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed against CRA account rules" />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Use this free Canadian FHSA calculator to estimate your 2026 tax savings, project the down-payment balance you can build in a First Home Savings Account, and decide whether the FHSA fits ahead of your TFSA or RRSP path. No sign-up.
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ResultMetric
              label="Estimated tax savings"
              value={formatCurrency(result.totalTaxSavings)}
              hint={`Approximate tax deduction value at a ${Math.round(result.marginalRate * 1000) / 10}% marginal rate.`}
              tone="success"
            />
            <ResultMetric
              label="Contribution used in year one"
              value={formatCurrency(result.contributionUsedYearOne)}
              hint={`Uses ${Math.round(result.annualLimitUsage * 100)}% of the ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)} annual limit.`}
              tone="primary"
            />
            <ResultMetric
              label="Projected balance at purchase"
              value={formatCurrency(result.projectedBalance)}
              hint={`Includes ${formatCurrency(result.projectedGrowth)} of projected growth over ${yearsToPurchase} years.`}
              tone="warning"
            />
          </div>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Interpretation</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What this scenario means in plain English</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{result.interpretation}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Contribution pace</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{formatCurrency(annualContribution)} per year</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">About {formatCurrency(result.monthlyEquivalent)} per month if you spread it evenly.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Room used now</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{Math.round(result.roomUsage * 100)}%</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Based on the room estimate you entered for this year.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Effective cost after tax savings</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{formatCurrency(result.effectiveContributionCost)}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A planning view of what the contribution path may feel like after deduction value.</p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Output</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Projected FHSA balance over time</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Province: {CANADIAN_PROVINCES.find((item) => item.value === province)?.label || province}
              </div>
            </div>

            <div className="mt-6 h-[320px]">
              <Line
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `Balance: ${formatCurrency(Number(context.raw))}`,
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
              />
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: '2026 FHSA checklist',
                items: [
                  'Confirm first-time home buyer status before relying on the deduction.',
                  'Check current FHSA room with CRA before making a real contribution.',
                  'Decide whether the FHSA is beating your TFSA or RRSP for the next dollar.',
                  'Match the investment mix to your home-buying timeline, not just the tax refund.',
                ],
              },
              {
                title: 'How the FHSA works',
                items: [
                  `Annual contribution limit: ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)}.`,
                  `Lifetime contribution cap: ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit)}.`,
                  'Qualifying withdrawals are tax-free if you use the account for an eligible first-home purchase.',
                  'Unused money can generally move to an RRSP or RRIF if no home purchase happens.',
                ],
              },
              {
                title: 'When the FHSA is most useful',
                items: [
                  'You expect to buy a qualifying home within the next several years.',
                  'Your current tax bracket makes the deduction meaningful now.',
                  'You want a dedicated down-payment account instead of a flexible catch-all bucket.',
                  'You are ready to compare the FHSA against RRSP Home Buyers Plan and TFSA options.',
                ],
              },
            ].map((section) => (
              <div key={section.title} className="surface-card p-5">
                <h2 className="text-xl font-bold text-primary dark:text-accent">{section.title}</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-0.5 text-secondary">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Where FHSA planning usually breaks down</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p><strong>Opening the provider before the plan exists:</strong> the account wrapper matters less than whether the FHSA should win the next contribution at all.</p>
                <p><strong>Chasing only the tax deduction:</strong> if the home purchase is uncertain or very far away, the TFSA may still be the cleaner account.</p>
                <p><strong>Ignoring the investment mix:</strong> an FHSA for a two-year timeline should not be invested the same way as one for a seven-year timeline.</p>
                <p><strong>Skipping the room check:</strong> the biggest preventable mistake is contributing before confirming current FHSA room with CRA.</p>
              </div>
            </div>

            <div className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Year-by-year usage</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Contribution and room breakdown</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                      <th className="py-2 pr-4 font-semibold">Year</th>
                      <th className="py-2 pr-4 font-semibold">Room</th>
                      <th className="py-2 pr-4 font-semibold">Used</th>
                      <th className="py-2 pr-4 font-semibold">Carryforward</th>
                      <th className="py-2 font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-300">
                    {result.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 pr-4 font-medium">Year {row.year}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.roomThisYear)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.contributionUsed)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.carryforwardNextYear)}</td>
                        <td className="py-2">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <aside className="surface-card h-fit p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Input</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Build your FHSA scenario</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter the planning assumptions you know today. This tool is strongest when you treat it as a decision aid, not a final CRA record.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Province</label>
              <select
                value={province}
                onChange={(event) => setProvince(event.target.value)}
                className="focus-ring w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {CANADIAN_PROVINCES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <ScenarioInput
              label="Annual income"
              value={income}
              onChange={(event) => setIncome(Number(event.target.value || 0))}
              min={0}
              step={1000}
              suffix="CAD"
            />
            <ScenarioInput
              label="Birth year"
              value={birthYear}
              onChange={(event) => setBirthYear(Number(event.target.value || 0))}
              min={1950}
              max={2008}
              step={1}
            />
            <ScenarioInput
              label="Estimated FHSA room available now"
              value={availableRoomNow}
              onChange={(event) => setAvailableRoomNow(Number(event.target.value || 0))}
              min={0}
              max={16000}
              step={500}
              suffix="CAD"
              helpText="Check CRA before making a real contribution."
            />
            <ScenarioInput
              label="Contributions already made"
              value={contributedToDate}
              onChange={(event) => setContributedToDate(Number(event.target.value || 0))}
              min={0}
              max={REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit}
              step={500}
              suffix="CAD"
            />
            <ScenarioInput
              label="Current FHSA balance"
              value={currentBalance}
              onChange={(event) => setCurrentBalance(Number(event.target.value || 0))}
              min={0}
              step={500}
              suffix="CAD"
            />
            <ScenarioInput
              label="Planned annual contribution"
              value={annualContribution}
              onChange={(event) => setAnnualContribution(Number(event.target.value || 0))}
              min={0}
              max={16000}
              step={500}
              suffix="CAD"
              helpText={`The 2026 annual limit is ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)} before carryforward.`}
            />
            <ScenarioInput
              label="Expected annual growth"
              value={expectedReturn}
              onChange={(event) => setExpectedReturn(Number(event.target.value || 0))}
              min={0}
              max={12}
              step={0.5}
              suffix="%"
              helpText="Use a lower number to stress-test a short home-buying timeline."
            />
            <ScenarioInput
              label="Years until purchase"
              value={yearsToPurchase}
              onChange={(event) => setYearsToPurchase(Number(event.target.value || 0))}
              min={1}
              max={15}
              step={1}
              suffix="yrs"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-900/20">
            <p className="font-semibold text-blue-800 dark:text-blue-200">Current planning view</p>
            <ul className="mt-2 space-y-2 text-blue-700 dark:text-blue-300">
              <li>Estimated current room: {formatCurrency(result.yearOneRoom)}</li>
              <li>Lifetime room left today: {formatCurrency(result.lifetimeRemainingAtStart)}</li>
              <li>Lifetime room left after this plan: {formatCurrency(result.lifetimeRemainingAtEnd)}</li>
            </ul>
          </div>

          {!result.likelyAgeEligible ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
              Based on the birth year entered, this scenario may fall outside the usual FHSA age rules. Treat the output as exploratory until eligibility is confirmed.
            </div>
          ) : null}
        </aside>
      </div>

      <MethodologyPanel
        title="Assumptions behind this FHSA decision tool"
        summary="This page estimates FHSA deduction value and balance growth using the room, income, contribution pace, and return assumptions you enter. It is designed to help with account-choice decisions, not to replace CRA records."
        updated={CONTENT_LAST_REVIEWED}
        reviewer="Gourav Kumar"
        assumptions={[
          'Current FHSA room is entered as a planning estimate and should be verified with CRA before acting.',
          `Future yearly contributions are limited by the ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)} annual FHSA cap, limited carryforward handling, and the ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit)} lifetime contribution limit.`,
          'Tax savings are estimated using a simplified marginal-rate lookup by province and income.',
          'Projected growth uses a fixed return assumption and does not model product fees, market volatility, or contribution timing differences.',
        ]}
        sources={[
          { label: 'CRA: First Home Savings Account', href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html' },
          { label: 'Department of Finance Canada: FHSA background', href: 'https://www.canada.ca/en/department-finance/news/2022/08/design-of-the-tax-free-first-home-savings-account.html' },
          { label: 'EasyFinanceTools methodology', href: 'https://easyfinancetools.com/methodology' },
        ]}
        note="Educational planning tool only. Verify eligibility, room, withdrawal rules, and investment suitability before making contributions or opening an account."
      />

      <ReferenceSection
        eyebrow="Source shell"
        title="Primary references to refresh when FHSA rules change"
        intro="This section is meant to keep the page maintainable. When limits, age rules, or qualifying-withdrawal rules change, refresh the constants file and then re-check these sources."
        references={[
          {
            label: 'CRA FHSA overview',
            body: 'Primary source for contribution rules, eligibility, qualifying withdrawals, and transfers to RRSP or RRIF.',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html',
          },
          {
            label: 'CRA guidance on first-time home buyer definition',
            body: 'Use this to confirm whether the current scenario still qualifies under the CRA interpretation.',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html#toc3',
          },
          {
            label: 'Department of Finance FHSA backgrounder',
            body: 'Useful for policy context and when comparing the FHSA with the RRSP Home Buyers Plan.',
            href: 'https://www.canada.ca/en/department-finance/news/2022/08/design-of-the-tax-free-first-home-savings-account.html',
          },
          {
            label: 'Local config to update',
            body: 'If annual limits or default assumptions change, update src/config/financial.js first so every dependent page stays aligned.',
          },
        ]}
        note="Manual review needed each year: confirm annual FHSA limits, TFSA limits referenced in related links, and any updated CRA interpretation notes."
      />

      <ActionableNextSteps
        toolName="fhsa_decision_tool"
        title="What to do next with the FHSA result"
        intro="The best use of this result is to move from a tax estimate into an account decision. Confirm room, compare account paths, then choose a provider only after the strategy is clear."
        meaning={`${formatCurrency(result.projectedBalance)} is the directional FHSA balance if your contribution pace, room estimate, and purchase timeline hold up. The stronger the deduction is at your tax rate, the more the FHSA deserves comparison against your TFSA and RRSP before you open anything.`}
        steps={[
          'Confirm your current FHSA room with CRA before making a real contribution.',
          'Compare the same contribution amount against TFSA and RRSP scenarios, not only the FHSA result in isolation.',
          'Choose a provider after the account strategy is clear and the timeline still supports a qualifying home withdrawal.',
        ]}
        actions={[
          {
            title: 'Read the FHSA master guide',
            body: 'See FHSA tax savings, rules, growth examples, and how the account compares with TFSA and RRSP choices.',
            href: '/blog/fhsa-calculator-canada-2026',
            ctaLabel: 'read_fhsa_master_guide',
          },
          {
            title: 'Open the TFSA decision tool',
            body: 'If the home timeline is uncertain, compare the same contribution against a more flexible TFSA path before you commit.',
            href: '/tools/tfsa-calculator',
            ctaLabel: 'open_tfsa_decision_tool',
          },
          {
            title: 'Open the RRSP decision tool',
            body: 'If the deduction is the main attraction, compare the FHSA against a pure RRSP contribution before making the next deposit.',
            href: '/tools/rrsp-calculator',
            ctaLabel: 'open_rrsp_decision_tool',
          },
        ]}
        referral={{
          placement: 'fhsa_decision_page',
          badge: 'Logical next step',
          title: 'Open an FHSA and start investing with Wealthsimple',
          highlight: 'FHSA',
          description: 'If the FHSA still looks like the right account after you compare it with TFSA and RRSP scenarios, a simple investing workflow can be a reasonable next step.',
          fitHeading: 'Why this placement makes sense here',
          fitPoints: [
            'You already know the FHSA should get the next contribution.',
            'You want an easy path to hold cash, ETFs, or a simple investing mix inside the FHSA.',
            'You have already checked room, timeline, and home-buyer eligibility before opening the account.',
          ],
          details: 'Use the referral code at signup | Keep comparing account features, fees, and product choices before deciding',
          disclosure: 'Affiliate disclosure: We may earn a referral bonus if you sign up using this code. That does not change the FHSA assumptions, tax discussion, or account-comparison guidance on this page.',
          buttonLabel: 'Open FHSA with Wealthsimple',
        }}
      />

      <FAQ items={FHSA_FAQS} />
    </main>
  );
}
