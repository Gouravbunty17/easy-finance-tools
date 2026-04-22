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
  CANADIAN_PROVINCES,
  CONTENT_LAST_REVIEWED,
  DEFAULT_ASSUMPTIONS,
  FINANCIAL_YEAR,
  REGISTERED_ACCOUNT_LIMITS,
  getEstimatedMarginalTaxRate,
  getTfsaAccruedRoom,
  getTfsaEligibleYear,
} from '../../config/financial';

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const TFSA_FAQS = [
  {
    q: 'What is the TFSA annual limit for 2026?',
    a: 'The TFSA annual limit for 2026 is $7,000. Unused room carries forward, so your actual available room can be much higher if you have not contributed in prior years.',
  },
  {
    q: 'How do TFSA withdrawals affect contribution room?',
    a: 'Withdrawals are usually added back to TFSA room on January 1 of the following year, not immediately. That is why same-year re-contributions can accidentally create an excess contribution.',
  },
  {
    q: 'Is the TFSA always better than an RRSP?',
    a: 'No. The TFSA is often the cleaner default when flexibility matters or your current tax rate is modest, while the RRSP usually gets stronger when the deduction is valuable today and your retirement tax rate will likely be lower.',
  },
  {
    q: 'Can investment growth inside a TFSA create more contribution room?',
    a: 'No. Growth inside the account is tax-free, but it does not create new contribution room. New room usually comes only from annual limits and prior-year withdrawals being restored.',
  },
  {
    q: 'Should I put dividend ETFs in a TFSA?',
    a: 'Sometimes, especially if the account job is income. The better question is whether the TFSA should be used for income, broad growth, or both. A dividend ETF is not automatically the strongest default just because the income is tax-free.',
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

export default function TFSACalculator() {
  const [birthYear, setBirthYear] = useState(DEFAULT_ASSUMPTIONS.tfsa.birthYear);
  const [residencyYear, setResidencyYear] = useState(DEFAULT_ASSUMPTIONS.tfsa.residencyYear);
  const [province, setProvince] = useState(DEFAULT_ASSUMPTIONS.tfsa.province);
  const [taxableIncome, setTaxableIncome] = useState(DEFAULT_ASSUMPTIONS.tfsa.taxableIncome);
  const [currentBalance, setCurrentBalance] = useState(DEFAULT_ASSUMPTIONS.tfsa.currentBalance);
  const [lifetimeContributions, setLifetimeContributions] = useState(DEFAULT_ASSUMPTIONS.tfsa.lifetimeContributions);
  const [restoredWithdrawals, setRestoredWithdrawals] = useState(DEFAULT_ASSUMPTIONS.tfsa.restoredWithdrawals);
  const [annualContribution, setAnnualContribution] = useState(DEFAULT_ASSUMPTIONS.tfsa.annualContribution);
  const [expectedReturn, setExpectedReturn] = useState(DEFAULT_ASSUMPTIONS.tfsa.expectedReturn);
  const [years, setYears] = useState(DEFAULT_ASSUMPTIONS.tfsa.years);

  const result = useMemo(() => {
    const eligibleYear = getTfsaEligibleYear(Number(birthYear || 0), Number(residencyYear || 0));
    const accruedRoom = getTfsaAccruedRoom(eligibleYear);
    const netContributionsUsed = Math.max(0, Number(lifetimeContributions || 0) - Number(restoredWithdrawals || 0));
    const estimatedRoomNow = Math.max(0, accruedRoom - netContributionsUsed);
    const currentRate = getEstimatedMarginalTaxRate(province, Number(taxableIncome || 0));
    const yearlyContributionTarget = Math.max(0, Number(annualContribution || 0));
    const yearlyRate = Number(expectedReturn || 0) / 100;

    let balance = Math.max(0, Number(currentBalance || 0));
    let roomAvailable = estimatedRoomNow;
    let totalFutureContributions = 0;
    const yearlyBreakdown = [];
    const chartLabels = [];
    const chartValues = [];

    for (let year = 1; year <= Math.max(1, Number(years || 1)); year += 1) {
      const roomThisYear = roomAvailable;
      const contributionUsed = Math.min(yearlyContributionTarget, roomThisYear);
      const contributionPerMonth = contributionUsed / 12;

      for (let month = 0; month < 12; month += 1) {
        balance = balance * (1 + yearlyRate / 12) + contributionPerMonth;
      }

      totalFutureContributions += contributionUsed;
      const roomAfterContribution = Math.max(0, roomThisYear - contributionUsed);
      const nextYearRoom = roomAfterContribution + REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit;

      yearlyBreakdown.push({
        year,
        roomThisYear,
        contributionUsed,
        roomAfterContribution,
        nextYearRoom,
        balance,
      });
      chartLabels.push(`Year ${year}`);
      chartValues.push(Math.round(balance));

      roomAvailable = nextYearRoom;
    }

    const projectedBalance = Math.round(balance);
    const projectedGrowth = Math.round(Math.max(0, balance - Number(currentBalance || 0) - totalFutureContributions));
    const contributionUsedYearOne = yearlyBreakdown[0]?.contributionUsed || 0;
    const roomUsage = contributionUsedYearOne / Math.max(estimatedRoomNow, 1);
    const annualLimitUsage = contributionUsedYearOne / REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit;
    const taxableContext = Math.round(Number(currentBalance || 0) * yearlyRate * currentRate);
    const nextYearRoomEstimate = yearlyBreakdown[0]?.nextYearRoom || REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit;

    let interpretation = 'The TFSA still looks useful, but the next dollar should be compared with RRSP or FHSA options if those accounts are also in play.';
    if (estimatedRoomNow === 0) {
      interpretation = 'This plan is room-constrained today. Confirm the TFSA room with CRA before contributing again, especially if recent withdrawals or deposits have not fully posted yet.';
    } else if (yearlyContributionTarget > estimatedRoomNow) {
      interpretation = 'Your planned contribution is larger than the room estimate you entered today. The TFSA can still be the right account, but the contribution pace likely needs to be staged across multiple calendar years.';
    } else if (currentRate >= 0.3) {
      interpretation = 'At your current marginal tax rate, tax-free compounding is especially valuable whenever the alternative would be a taxable account. That does not make the TFSA better than the RRSP automatically, but it does make unused room more worth protecting.';
    } else if (yearlyContributionTarget <= REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit) {
      interpretation = 'This is a straightforward TFSA funding plan: the annual contribution target fits within the current annual limit assumption, which makes the account easier to manage and easier to automate.';
    }

    return {
      eligibleYear,
      accruedRoom: Math.round(accruedRoom),
      netContributionsUsed: Math.round(netContributionsUsed),
      estimatedRoomNow: Math.round(estimatedRoomNow),
      currentRate,
      contributionUsedYearOne: Math.round(contributionUsedYearOne),
      annualLimitUsage,
      roomUsage,
      nextYearRoomEstimate: Math.round(nextYearRoomEstimate),
      projectedBalance,
      projectedGrowth,
      totalFutureContributions: Math.round(totalFutureContributions),
      taxableContext,
      interpretation,
      chartLabels,
      chartValues,
      yearlyBreakdown,
    };
  }, [annualContribution, birthYear, currentBalance, expectedReturn, lifetimeContributions, province, residencyYear, restoredWithdrawals, taxableIncome, years]);

  const chartData = {
    labels: result.chartLabels,
    datasets: [
      {
        label: 'Projected TFSA balance',
        data: result.chartValues,
        fill: true,
        backgroundColor: 'rgba(0, 85, 122, 0.12)',
        borderColor: '#00557a',
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="TFSA Decision Tool 2026"
        description="Estimate TFSA room, project tax-free growth, and decide whether the TFSA should get the next contribution in 2026."
        canonical="https://easyfinancetools.com/tools/tfsa-calculator"
      />
      <ToolPageSchema
        name="TFSA Decision Tool 2026"
        description="Canadian TFSA planning tool for contribution room, tax-free growth, and account-priority decisions."
        canonical="https://easyfinancetools.com/tools/tfsa-calculator"
        category="FinanceApplication"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            TFSA planning for Canadian investors
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">TFSA room and tax-free growth planner</h1>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed against CRA TFSA rules" />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Use this page to estimate available TFSA room, model tax-free growth, and decide whether the TFSA should get the next contribution before you move into ETFs, dividend income, or RRSP comparisons.
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ResultMetric
              label="Estimated TFSA room now"
              value={formatCurrency(result.estimatedRoomNow)}
              hint={`Accrued room since ${result.eligibleYear}: ${formatCurrency(result.accruedRoom)}.`}
              tone="primary"
            />
            <ResultMetric
              label={`Projected balance in ${years} years`}
              value={formatCurrency(result.projectedBalance)}
              hint={`Includes ${formatCurrency(result.projectedGrowth)} of projected tax-free growth.`}
              tone="success"
            />
            <ResultMetric
              label="Contribution used in year one"
              value={formatCurrency(result.contributionUsedYearOne)}
              hint={`Uses ${Math.round(result.annualLimitUsage * 100)}% of the 2026 annual limit.`}
              tone="warning"
            />
          </div>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Interpretation</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What the TFSA scenario means in plain English</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{result.interpretation}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Annual contribution target</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{formatCurrency(annualContribution)}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">About {formatCurrency(annualContribution / 12)} per month if you automate the plan.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current marginal-rate context</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{Math.round(result.currentRate * 1000) / 10}%</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Helpful when comparing the TFSA against taxable investing or an RRSP deduction.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Next-year room estimate</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{formatCurrency(result.nextYearRoomEstimate)}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Assumes the future annual TFSA limit stays at the current 2026 level.</p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Output</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Projected tax-free balance over time</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Province context: {CANADIAN_PROVINCES.find((item) => item.value === province)?.label || province}
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
                title: '2026 TFSA checklist',
                items: [
                  'Confirm your actual TFSA room in CRA My Account before making a large contribution.',
                  'Keep same-year withdrawals out of the restored-withdrawal input unless that room has actually come back.',
                  'Decide whether the TFSA should hold broad growth, income, or short-term money before choosing investments.',
                  'Compare the TFSA with RRSP or FHSA if another registered account is also in play.',
                ],
              },
              {
                title: 'How the TFSA works',
                items: [
                  `Annual limit for ${FINANCIAL_YEAR}: ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit)}.`,
                  'Unused room carries forward, and eligible prior-year withdrawals are restored on January 1 of the following year.',
                  'Investment growth stays tax-free and does not use extra room.',
                  'Over-contributions can trigger a 1% monthly penalty on the excess amount.',
                ],
              },
              {
                title: 'When the TFSA is most useful',
                items: [
                  'You want flexible tax-free growth without future withdrawal tax.',
                  'You may need the money before retirement and want withdrawals without repayment rules.',
                  'Your current tax bracket is modest or the RRSP deduction is not yet compelling.',
                  'You want a clean account for broad ETFs or a simple long-term investing plan.',
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
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Where TFSA planning usually breaks down</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p><strong>Re-contributing a same-year withdrawal too early:</strong> this is one of the most common avoidable TFSA errors and can create a penalty even when your long-term room is healthy.</p>
                <p><strong>Using the TFSA without defining the account job:</strong> broad ETF growth, emergency savings, and dividend income are all valid uses, but they are not interchangeable decisions.</p>
                <p><strong>Ignoring account comparisons:</strong> the TFSA is excellent, but it is not always the best next account if the RRSP deduction or FHSA structure is clearly stronger.</p>
                <p><strong>Treating the room estimate as final:</strong> use this as a planning tool, then verify with CRA before acting.</p>
              </div>
            </div>

            <div className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Year-by-year usage</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Room and balance breakdown</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                      <th className="py-2 pr-4 font-semibold">Year</th>
                      <th className="py-2 pr-4 font-semibold">Room</th>
                      <th className="py-2 pr-4 font-semibold">Used</th>
                      <th className="py-2 pr-4 font-semibold">Next year</th>
                      <th className="py-2 font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-300">
                    {result.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 pr-4 font-medium">Year {row.year}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.roomThisYear)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.contributionUsed)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.nextYearRoom)}</td>
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
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Build your TFSA scenario</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter the current room and funding assumptions you know today. This page is strongest as a decision aid before you pick holdings or a provider.
          </p>

          <div className="mt-6 space-y-5">
            <ScenarioInput
              label="Birth year"
              value={birthYear}
              onChange={(event) => setBirthYear(Number(event.target.value || 0))}
              min={1950}
              max={2008}
              step={1}
            />
            <ScenarioInput
              label="Canadian residency start year"
              value={residencyYear}
              onChange={(event) => setResidencyYear(Number(event.target.value || 0))}
              min={2009}
              max={FINANCIAL_YEAR}
              step={1}
              helpText="TFSA room starts from the later of age 18 or Canadian tax residency."
            />
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
              label="Taxable income"
              value={taxableIncome}
              onChange={(event) => setTaxableIncome(Number(event.target.value || 0))}
              min={0}
              step={1000}
              suffix="CAD"
              helpText="Used only for tax-context interpretation, not for TFSA room itself."
            />
            <ScenarioInput
              label="Current TFSA balance"
              value={currentBalance}
              onChange={(event) => setCurrentBalance(Number(event.target.value || 0))}
              min={0}
              step={500}
              suffix="CAD"
            />
            <ScenarioInput
              label="Lifetime contributions made"
              value={lifetimeContributions}
              onChange={(event) => setLifetimeContributions(Number(event.target.value || 0))}
              min={0}
              step={500}
              suffix="CAD"
            />
            <ScenarioInput
              label="Prior withdrawals already restored to room"
              value={restoredWithdrawals}
              onChange={(event) => setRestoredWithdrawals(Number(event.target.value || 0))}
              min={0}
              step={500}
              suffix="CAD"
              helpText="Leave same-year withdrawals out unless the room has already come back."
            />
            <ScenarioInput
              label="Planned annual contribution"
              value={annualContribution}
              onChange={(event) => setAnnualContribution(Number(event.target.value || 0))}
              min={0}
              step={500}
              suffix="CAD"
              helpText={`Current annual TFSA limit: ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit)}.`}
            />
            <ScenarioInput
              label="Expected annual growth"
              value={expectedReturn}
              onChange={(event) => setExpectedReturn(Number(event.target.value || 0))}
              min={0}
              max={12}
              step={0.5}
              suffix="%"
            />
            <ScenarioInput
              label="Projection years"
              value={years}
              onChange={(event) => setYears(Number(event.target.value || 0))}
              min={1}
              max={30}
              step={1}
              suffix="yrs"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-900/20">
            <p className="font-semibold text-blue-800 dark:text-blue-200">Current planning view</p>
            <ul className="mt-2 space-y-2 text-blue-700 dark:text-blue-300">
              <li>Eligibility year: {result.eligibleYear}</li>
              <li>Estimated current room: {formatCurrency(result.estimatedRoomNow)}</li>
              <li>Simplified taxable-account drag context: {formatCurrency(result.taxableContext)} per year on the current balance</li>
            </ul>
          </div>
        </aside>
      </div>

      <MethodologyPanel
        title="Assumptions behind this TFSA decision tool"
        summary="This page estimates TFSA room from your eligibility year, lifetime contributions, and restored withdrawals, then projects tax-free growth using the contribution pace and return assumptions you enter."
        updated={CONTENT_LAST_REVIEWED}
        reviewer="Gourav Kumar"
        assumptions={[
          `The ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit)} TFSA annual limit is used as the current-year and future-year planning assumption.`,
          'Room is estimated from birth year, residency year, lifetime contributions, and withdrawals you say have already been restored to room.',
          'Same-year withdrawals are not automatically safe to re-contribute and should usually be excluded until room actually returns on January 1 of the following year.',
          'Growth uses a fixed annual return assumption and does not model real market volatility, fees, or product-level tax nuances.',
        ]}
        sources={[
          { label: 'CRA: Tax-Free Savings Account overview', href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html' },
          { label: 'CRA: TFSA contributions', href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributions.html' },
          { label: 'EasyFinanceTools methodology', href: 'https://easyfinancetools.com/methodology' },
        ]}
        note="Educational planning tool only. Verify room, withdrawal timing, and account suitability before making real contributions."
      />

      <ReferenceSection
        eyebrow="Source shell"
        title="Primary references to refresh when TFSA rules change"
        intro="When annual limits or CRA guidance change, update the shared finance config first, then re-check these sources."
        references={[
          {
            label: 'CRA TFSA overview',
            body: 'Primary source for annual limits, withdrawals, and general TFSA eligibility rules.',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html',
          },
          {
            label: 'CRA TFSA contributions page',
            body: 'Use this to verify room rules, contribution timing, and over-contribution treatment.',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributions.html',
          },
          {
            label: 'CRA excess TFSA tax guidance',
            body: 'Important when the scenario involves same-year re-contributions or possible excess amounts.',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/tax-payable-tfsa.html',
          },
          {
            label: 'Local config to update',
            body: 'Refresh TFSA annual limits and assumptions in src/config/financial.js when the new tax year is known.',
          },
        ]}
        note="Manual review needed each year: confirm TFSA annual limits, any CRA guidance updates, and related account-comparison content."
      />

      <ActionableNextSteps
        toolName="tfsa_decision_tool"
        title="What to do next with the TFSA result"
        intro="The best use of this result is to move from a room estimate into an account decision. Confirm room, compare the TFSA against RRSP or FHSA if needed, then choose investments or a provider only after the strategy is clear."
        meaning={`${formatCurrency(result.projectedBalance)} is the directional TFSA balance if your room estimate, contribution pace, and return assumptions hold up. The more valuable the account flexibility feels relative to an RRSP deduction, the more the TFSA deserves the next contribution.`}
        steps={[
          'Confirm the room estimate against CRA before making a real contribution.',
          'Compare the TFSA against RRSP or FHSA if another registered account is competing for the next dollar.',
          'Choose the holdings after the account job is clear: broad growth, income, or short-term safety.',
        ]}
        actions={[
          {
            title: 'Compare TFSA vs RRSP',
            body: 'Pressure-test whether the TFSA should beat the RRSP for the next contribution.',
            href: '/blog/tfsa-vs-rrsp-2026',
            ctaLabel: 'compare_tfsa_vs_rrsp',
          },
          {
            title: 'Open the ETF income simulator',
            body: 'If the TFSA is an income account, model the yield, DRIP, and capital target before you buy anything.',
            href: '/tools/dividend-calculator',
            ctaLabel: 'open_dividend_calculator',
          },
          {
            title: 'Read the ETF guide',
            body: 'Compare income-heavy ETFs against broader TFSA ETF defaults before you lock in the plan.',
            href: '/blog/best-etfs-for-tfsa-canada-2026',
            ctaLabel: 'read_tfsa_etf_guide',
          },
        ]}
        referral={{
          placement: 'tfsa_decision_page',
          badge: 'Logical next step',
          title: 'Open a TFSA and start investing with Wealthsimple',
          highlight: 'TFSA',
          description: 'If the TFSA still looks like the right home for the next contribution, a simple workflow can be a reasonable next step after the account decision is settled.',
          fitHeading: 'Why this placement makes sense here',
          fitPoints: [
            'You have already checked TFSA room and the account still deserves the next contribution.',
            'You want a simple place to hold broad ETFs or a clean long-term investing setup.',
            'You are choosing the provider after the strategy, not before it.',
          ],
          details: 'Use the referral code at signup | Keep comparing account features, fees, and ETF choices before deciding',
          disclosure: 'Affiliate disclosure: We may earn a referral bonus if you sign up using this code. That does not change the TFSA assumptions, room discussion, or account-comparison guidance on this page.',
          buttonLabel: 'Open TFSA with Wealthsimple',
        }}
      />

      <FAQ items={TFSA_FAQS} />
    </main>
  );
}
