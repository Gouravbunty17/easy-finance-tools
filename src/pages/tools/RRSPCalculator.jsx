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
  FINANCIAL_YEAR,
  RRIF_MINIMUM_RATES,
  RRSP_RULES,
  getEstimatedMarginalTaxRate,
  getRrspAnnualLimit,
} from '../../config/financial';

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const RRSP_FAQS = [
  {
    q: 'What is the RRSP contribution limit for 2026?',
    a: 'The base RRSP annual limit for 2026 is 18% of 2025 earned income up to $33,810. Your actual available room can be higher if you have unused carryforward from prior years, so check your CRA Notice of Assessment.',
  },
  {
    q: 'When is the RRSP deduction deadline for 2026?',
    a: 'Contributions that count toward the 2025 tax year are generally due by March 2, 2026. Contributions after that date usually count toward a later tax year unless you have specific carryforward planning in mind.',
  },
  {
    q: 'Why does reinvesting the RRSP refund matter so much?',
    a: 'Because the refund can become additional invested capital instead of a one-time tax benefit. If you reinvest it, the deduction often compounds into a meaningfully larger retirement balance over time.',
  },
  {
    q: 'Is the RRSP always better than the TFSA at a high income?',
    a: 'Not automatically, but the RRSP usually gets stronger when your current marginal tax rate is meaningfully higher than the rate you expect in retirement. If that gap is small, the TFSA can still be the cleaner next account.',
  },
  {
    q: 'What happens when the RRSP turns into a RRIF?',
    a: 'An RRSP must usually convert to a RRIF or be otherwise wound up by the end of the year you turn 71. Once it becomes a RRIF, minimum withdrawals apply each year and those withdrawals are taxable.',
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

export default function RRSPCalculator() {
  const [province, setProvince] = useState(DEFAULT_ASSUMPTIONS.rrsp.province);
  const [taxableIncome, setTaxableIncome] = useState(DEFAULT_ASSUMPTIONS.rrsp.taxableIncome);
  const [availableRoomNow, setAvailableRoomNow] = useState(DEFAULT_ASSUMPTIONS.rrsp.availableRoomNow);
  const [annualContribution, setAnnualContribution] = useState(DEFAULT_ASSUMPTIONS.rrsp.annualContribution);
  const [currentBalance, setCurrentBalance] = useState(DEFAULT_ASSUMPTIONS.rrsp.currentBalance);
  const [expectedReturn, setExpectedReturn] = useState(DEFAULT_ASSUMPTIONS.rrsp.expectedReturn);
  const [yearsToRetirement, setYearsToRetirement] = useState(DEFAULT_ASSUMPTIONS.rrsp.yearsToRetirement);
  const [retirementIncome, setRetirementIncome] = useState(DEFAULT_ASSUMPTIONS.rrsp.retirementIncome);
  const [spouseIncome, setSpouseIncome] = useState(DEFAULT_ASSUMPTIONS.rrsp.spouseIncome);
  const [useSpousalComparison, setUseSpousalComparison] = useState(DEFAULT_ASSUMPTIONS.rrsp.useSpousalComparison);
  const [reinvestRefund, setReinvestRefund] = useState(DEFAULT_ASSUMPTIONS.rrsp.reinvestRefund);

  const result = useMemo(() => {
    const currentRate = getEstimatedMarginalTaxRate(province, Number(taxableIncome || 0));
    const retirementRate = getEstimatedMarginalTaxRate(province, Number(retirementIncome || 0));
    const baseAnnualLimit = Math.round(getRrspAnnualLimit(Number(taxableIncome || 0)));
    const roomThisYear = Math.max(0, Number(availableRoomNow || 0));
    const yearlyContributionTarget = Math.max(0, Number(annualContribution || 0));
    const yearlyContributionUsedYearOne = Math.min(yearlyContributionTarget, roomThisYear);
    const yearlyRate = Number(expectedReturn || 0) / 100;
    const taxRefundYearOne = yearlyContributionUsedYearOne * currentRate;

    let balance = Math.max(0, Number(currentBalance || 0));
    let roomAvailable = roomThisYear;
    let totalContributions = 0;
    let totalRefunds = 0;
    const chartLabels = [];
    const chartValues = [];
    const yearlyBreakdown = [];

    for (let year = 1; year <= Math.max(1, Number(yearsToRetirement || 1)); year += 1) {
      const roomForYear = year === 1 ? roomAvailable : roomAvailable;
      const plannedContribution = Math.min(yearlyContributionTarget, roomForYear);
      const refund = plannedContribution * currentRate;
      const totalInvestedThisYear = plannedContribution + (reinvestRefund ? refund : 0);
      const monthlyContribution = totalInvestedThisYear / 12;

      for (let month = 0; month < 12; month += 1) {
        balance = balance * (1 + yearlyRate / 12) + monthlyContribution;
      }

      totalContributions += plannedContribution;
      totalRefunds += refund;
      const roomAfterContribution = Math.max(0, roomForYear - plannedContribution);
      const nextYearRoom = roomAfterContribution + baseAnnualLimit;

      yearlyBreakdown.push({
        year,
        roomForYear,
        contributionUsed: plannedContribution,
        refund,
        nextYearRoom,
        balance,
      });
      chartLabels.push(`Year ${year}`);
      chartValues.push(Math.round(balance));

      roomAvailable = nextYearRoom;
    }

    const projectedBalance = Math.round(balance);
    const projectedGrowth = Math.round(
      Math.max(
        0,
        balance - Number(currentBalance || 0) - totalContributions - (reinvestRefund ? totalRefunds : 0)
      )
    );
    const afterTaxRetirementValue = Math.round(projectedBalance * (1 - retirementRate));
    const taxRateGap = currentRate - retirementRate;
    const firstRrifMinimum = Math.round(projectedBalance * ((RRIF_MINIMUM_RATES[71] || 5.28) / 100));
    const splitRetirementRate = useSpousalComparison
      ? (
          getEstimatedMarginalTaxRate(province, Number(retirementIncome || 0) / 2) +
          getEstimatedMarginalTaxRate(province, Number(spouseIncome || 0) + Number(retirementIncome || 0) / 2)
        ) / 2
      : retirementRate;
    const simplifiedSpousalBenefit = useSpousalComparison
      ? Math.round(projectedBalance * Math.max(0, retirementRate - splitRetirementRate))
      : 0;

    let interpretation = 'The RRSP looks useful, but the right next step is comparing the deduction against TFSA or FHSA flexibility before you commit the next dollar.';
    if (roomThisYear === 0) {
      interpretation = 'This plan is room-constrained today. Check your Notice of Assessment before relying on the contribution path, especially if you expect carryforward or recent deduction updates.';
    } else if (yearlyContributionTarget > roomThisYear) {
      interpretation = 'Your planned contribution is larger than the room estimate you entered for this year. The RRSP may still be right, but the timing likely needs to be staged or checked against carryforward room first.';
    } else if (taxRateGap >= 0.08) {
      interpretation = 'This is the classic strong RRSP setup: the deduction is meaningful today and the expected retirement tax rate looks lower, so the tax arbitrage is doing real work.';
    } else if (taxRateGap <= 0) {
      interpretation = 'The RRSP is less obvious here because the current deduction may not be much stronger than the tax rate you expect later. That usually means the TFSA deserves a direct comparison before you proceed.';
    } else if (reinvestRefund) {
      interpretation = 'This RRSP plan gets stronger because the refund is being put back to work. Reinvesting the deduction often matters more than chasing tiny differences in investment products.';
    }

    return {
      baseAnnualLimit,
      roomThisYear: Math.round(roomThisYear),
      contributionUsedYearOne: Math.round(yearlyContributionUsedYearOne),
      taxRefundYearOne: Math.round(taxRefundYearOne),
      totalContributions: Math.round(totalContributions),
      totalRefunds: Math.round(totalRefunds),
      projectedBalance,
      projectedGrowth,
      afterTaxRetirementValue,
      firstRrifMinimum,
      currentRate,
      retirementRate,
      splitRetirementRate,
      taxRateGap,
      simplifiedSpousalBenefit,
      interpretation,
      nextYearRoomEstimate: Math.round(yearlyBreakdown[0]?.nextYearRoom || baseAnnualLimit),
      chartLabels,
      chartValues,
      yearlyBreakdown,
    };
  }, [annualContribution, availableRoomNow, currentBalance, expectedReturn, province, reinvestRefund, retirementIncome, spouseIncome, taxableIncome, useSpousalComparison, yearsToRetirement]);

  const chartData = {
    labels: result.chartLabels,
    datasets: [
      {
        label: 'Projected RRSP balance',
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
        title="RRSP Calculator Canada 2026: Tax Refund & Retirement"
        description="Free Canadian RRSP calculator. Estimate 2026 tax refund, contribution room, and retirement impact before your next deposit."
        canonical="https://easyfinancetools.com/tools/rrsp-calculator"
      />
      <ToolPageSchema
        name="RRSP Calculator Canada 2026"
        description="Canadian RRSP planning tool for contribution room, refund value, retirement projections, and RRIF context."
        canonical="https://easyfinancetools.com/tools/rrsp-calculator"
        category="FinanceApplication"
      />
      <FAQSchema faqs={RRSP_FAQS} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            RRSP planning for Canadian investors
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">RRSP refund and retirement-income planner</h1>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed against CRA RRSP rules" />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Use this page to estimate the value of the RRSP deduction, project a retirement balance, and decide whether the RRSP should beat the TFSA or FHSA for the next contribution.
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ResultMetric
              label="Estimated refund this year"
              value={formatCurrency(result.taxRefundYearOne)}
              hint={`Based on a ${Math.round(result.currentRate * 1000) / 10}% marginal-rate estimate.`}
              tone="primary"
            />
            <ResultMetric
              label={`Projected RRSP balance in ${yearsToRetirement} years`}
              value={formatCurrency(result.projectedBalance)}
              hint={`Includes ${formatCurrency(result.projectedGrowth)} of projected growth.`}
              tone="success"
            />
            <ResultMetric
              label="Simplified after-tax retirement value"
              value={formatCurrency(result.afterTaxRetirementValue)}
              hint={`Using a ${Math.round(result.retirementRate * 1000) / 10}% retirement-rate assumption.`}
              tone="warning"
            />
          </div>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Interpretation</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What the RRSP scenario means in plain English</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{result.interpretation}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current-rate edge</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">
                  {Math.round(result.taxRateGap * 1000) / 10} pts
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">The gap between your current marginal rate and retirement-rate assumption.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Next-year room estimate</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{formatCurrency(result.nextYearRoomEstimate)}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Assumes earned income and the base annual RRSP limit stay close to the current estimate.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">First RRIF minimum at 71</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{formatCurrency(result.firstRrifMinimum)}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A simple preview of mandatory income once RRSP assets start converting to RRIF withdrawals.</p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Output</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Projected RRSP balance over time</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Deduction deadline: {RRSP_RULES.deductionDeadlineLabel}
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
                title: '2026 RRSP checklist',
                items: [
                  'Check your actual RRSP deduction room on your Notice of Assessment before contributing.',
                  'Compare the deduction today against expected tax on withdrawal later.',
                  'Decide in advance whether the refund will be reinvested, spent, or redirected to the TFSA.',
                  'Use the RRSP only after comparing it with TFSA or FHSA priorities if those accounts are also relevant.',
                ],
              },
              {
                title: 'How the RRSP works',
                items: [
                  `Base annual RRSP room estimate: 18% of earned income, up to ${formatCurrency(RRSP_RULES.maxContribution2026)} for ${FINANCIAL_YEAR}.`,
                  'Contributions reduce taxable income and can create a refund at your current marginal rate.',
                  'Withdrawals are taxable later, so the account works best when the deduction today is more valuable than the tax later.',
                  'RRSP assets usually convert to a RRIF by the end of the year you turn 71.',
                ],
              },
              {
                title: 'When the RRSP is most useful',
                items: [
                  'Your current marginal tax rate is meaningfully higher than your expected retirement rate.',
                  'You will reinvest or intentionally use the refund rather than letting it disappear into spending.',
                  'You want a retirement-focused account and do not need the same withdrawal flexibility as the TFSA.',
                  'An FHSA is not the better first move for your current home-buying plan.',
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
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Where RRSP planning usually breaks down</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p><strong>Focusing only on the refund:</strong> the refund feels good, but the real question is whether the tax rate on withdrawal later will still leave the RRSP ahead of the TFSA.</p>
                <p><strong>Spending the refund automatically:</strong> the RRSP usually becomes much stronger when the refund is intentionally reinvested or redirected to another useful account.</p>
                <p><strong>Ignoring carryforward and actual room:</strong> this page uses your room estimate, but only CRA can confirm the real deduction room for this year.</p>
                <p><strong>Skipping the account comparison:</strong> if FHSA or TFSA are also legitimate options, the RRSP should compete on actual tax value, not on habit.</p>
              </div>
            </div>

            <div className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Year-by-year usage</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Contribution, refund, and balance breakdown</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                      <th className="py-2 pr-4 font-semibold">Year</th>
                      <th className="py-2 pr-4 font-semibold">Room</th>
                      <th className="py-2 pr-4 font-semibold">Used</th>
                      <th className="py-2 pr-4 font-semibold">Refund</th>
                      <th className="py-2 font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-300">
                    {result.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 pr-4 font-medium">Year {row.year}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.roomForYear)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.contributionUsed)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.refund)}</td>
                        <td className="py-2">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {useSpousalComparison ? (
                <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-4 text-sm dark:border-purple-800 dark:bg-purple-900/20">
                  <p className="font-semibold text-purple-800 dark:text-purple-300">Spousal RRSP context</p>
                  <p className="mt-2 text-purple-700 dark:text-purple-300">
                    Simplified income-splitting benefit estimate: {formatCurrency(result.simplifiedSpousalBenefit)} of lifetime tax drag avoided if retirement income is split more evenly.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="surface-card h-fit p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Input</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Build your RRSP scenario</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter the current deduction and retirement assumptions you know today. This page is strongest when it helps you decide whether the RRSP should beat the TFSA or FHSA for the next contribution.
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
              label="Current taxable income"
              value={taxableIncome}
              onChange={(event) => setTaxableIncome(Number(event.target.value || 0))}
              min={0}
              step={1000}
              suffix="CAD"
            />
            <ScenarioInput
              label="Available RRSP room now"
              value={availableRoomNow}
              onChange={(event) => setAvailableRoomNow(Number(event.target.value || 0))}
              min={0}
              step={500}
              suffix="CAD"
              helpText="Best taken from your latest Notice of Assessment."
            />
            <ScenarioInput
              label="Planned annual contribution"
              value={annualContribution}
              onChange={(event) => setAnnualContribution(Number(event.target.value || 0))}
              min={0}
              step={500}
              suffix="CAD"
              helpText={`Base annual limit estimate at this income: ${formatCurrency(result.baseAnnualLimit)}.`}
            />
            <ScenarioInput
              label="Current RRSP balance"
              value={currentBalance}
              onChange={(event) => setCurrentBalance(Number(event.target.value || 0))}
              min={0}
              step={500}
              suffix="CAD"
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
              label="Years to retirement"
              value={yearsToRetirement}
              onChange={(event) => setYearsToRetirement(Number(event.target.value || 0))}
              min={1}
              max={40}
              step={1}
              suffix="yrs"
            />
            <ScenarioInput
              label="Retirement income assumption"
              value={retirementIncome}
              onChange={(event) => setRetirementIncome(Number(event.target.value || 0))}
              min={0}
              step={1000}
              suffix="CAD"
              helpText="Used to estimate the withdrawal tax rate later."
            />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={reinvestRefund}
                  onChange={(event) => setReinvestRefund(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  <span className="block font-semibold text-slate-800 dark:text-slate-100">Reinvest the RRSP refund</span>
                  <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                    Turning the refund back into invested capital often matters more than small return tweaks.
                  </span>
                </span>
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={useSpousalComparison}
                  onChange={(event) => setUseSpousalComparison(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>
                  <span className="block font-semibold text-slate-800 dark:text-slate-100">Compare a spousal RRSP angle</span>
                  <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                    Useful when retirement income may be uneven between partners.
                  </span>
                </span>
              </label>
            </div>

            {useSpousalComparison ? (
              <ScenarioInput
                label="Spouse retirement income assumption"
                value={spouseIncome}
                onChange={(event) => setSpouseIncome(Number(event.target.value || 0))}
                min={0}
                step={1000}
                suffix="CAD"
              />
            ) : null}
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-900/20">
            <p className="font-semibold text-blue-800 dark:text-blue-200">Current planning view</p>
            <ul className="mt-2 space-y-2 text-blue-700 dark:text-blue-300">
              <li>Base annual RRSP limit estimate: {formatCurrency(result.baseAnnualLimit)}</li>
              <li>Current marginal rate: {Math.round(result.currentRate * 1000) / 10}%</li>
              <li>Retirement-rate assumption: {Math.round(result.retirementRate * 1000) / 10}%</li>
            </ul>
          </div>
        </aside>
      </div>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Example calculation</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Read the RRSP result as refund value plus future tax tradeoff</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          In this scenario, the estimated current-year refund is {formatCurrency(result.taxRefundYearOne)} and the
          projected RRSP balance after {yearsToRetirement} years is {formatCurrency(result.projectedBalance)}. The
          refund is useful only if the later withdrawal tax, retirement-income assumptions, and TFSA/FHSA alternatives
          still leave the RRSP ahead.
        </p>
      </section>

      <MethodologyPanel
        title="How this calculator works: RRSP refund and growth assumptions"
        summary="This page estimates RRSP refund value using your current income and province, then projects balance growth using the contribution pace, room estimate, and retirement assumptions you enter."
        updated={CONTENT_LAST_REVIEWED}
        reviewer="Gourav Kumar"
        assumptions={[
          `Base annual RRSP room is estimated as 18% of current income up to ${formatCurrency(RRSP_RULES.maxContribution2026)} for ${FINANCIAL_YEAR}. Actual carryforward room must be confirmed with CRA.`,
          'This tool uses your entered available RRSP room as the current-year constraint and assumes the base annual room estimate remains similar in future years.',
          'Tax refund and withdrawal-rate estimates use simplified marginal-rate lookups by province and income.',
          'Growth uses a fixed annual return assumption and does not model changing salaries, market volatility, pension income, or exact RRIF taxation rules.',
        ]}
        sources={[
          { label: 'CRA: RRSPs and related plans', href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans.html' },
          { label: 'CRA: RRIF minimum withdrawal factors', href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-retirement-income-fund-rrif/receiving-income-a-rrif.html' },
          { label: 'EasyFinanceTools methodology', href: 'https://easyfinancetools.com/methodology' },
        ]}
        note="Educational planning tool only. Confirm deduction room, contribution deadlines, spousal RRSP rules, and retirement-income assumptions before acting."
      />

      <ReferenceSection
        eyebrow="Source shell"
        title="Primary references to refresh when RRSP rules change"
        intro="When annual RRSP limits or deduction-deadline details change, update the shared finance config first, then re-check these sources."
        references={[
          {
            label: 'CRA RRSP overview',
            body: 'Primary source for RRSP deduction room, contribution rules, withdrawals, and spousal RRSP context.',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans.html',
          },
          {
            label: 'CRA RRIF withdrawal guidance',
            body: 'Use this to verify minimum withdrawal percentages and conversion rules once RRSP assets become RRIF assets.',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-retirement-income-fund-rrif/receiving-income-a-rrif.html',
          },
          {
            label: 'Deduction deadline page',
            body: 'Useful for verifying which contributions apply to the current tax year and when the deadline moves.',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/contributions.html',
          },
          {
            label: 'Local config to update',
            body: 'Refresh RRSP annual limits, RRIF rates, and default assumptions in src/config/financial.js when the new tax year is known.',
          },
        ]}
        note="Manual review needed each year: confirm RRSP max contribution limit, deduction deadline, and any RRIF factor changes."
      />

      <ActionableNextSteps
        toolName="rrsp_decision_tool"
        title="What to do next with the RRSP result"
        intro="The best use of this result is to move from a refund estimate into an account-priority decision. Confirm room, compare the RRSP against TFSA or FHSA, then decide how the refund should actually be used."
        meaning={`${formatCurrency(result.projectedBalance)} is the directional RRSP balance if your room estimate, refund strategy, and retirement assumptions hold up. The stronger the current deduction looks relative to the retirement-rate assumption, the more the RRSP deserves the next contribution.`}
        steps={[
          'Confirm actual RRSP deduction room on your Notice of Assessment before contributing.',
          'Compare the RRSP against TFSA or FHSA if another registered account is competing for the next contribution.',
          'Decide in advance whether the refund will be reinvested, used for debt reduction, or redirected to the TFSA.',
        ]}
        actions={[
          {
            title: 'Compare TFSA vs RRSP',
            body: 'Move from refund math into a clearer account-priority decision.',
            href: '/blog/tfsa-vs-rrsp-canada-2026',
            ctaLabel: 'compare_tfsa_vs_rrsp',
          },
          {
            title: 'Open the TFSA planner',
            body: 'Model the same contribution path inside the TFSA before you lock in the RRSP choice.',
            href: '/tools/tfsa-calculator',
            ctaLabel: 'open_tfsa_calculator',
          },
          {
            title: 'Open the FHSA planner',
            body: 'If a first-home purchase is still on the horizon, compare the RRSP deduction against the FHSA structure before proceeding.',
            href: '/tools/fhsa-calculator',
            ctaLabel: 'open_fhsa_calculator',
          },
        ]}
        referral={{
          placement: 'rrsp_decision_page',
          badge: 'Logical next step',
          title: 'Open an RRSP and start investing with Wealthsimple',
          highlight: 'RRSP',
          description: 'If the RRSP still looks like the right home for the next contribution after the account comparison, a simple brokerage workflow can be a reasonable next step.',
          fitHeading: 'Why this placement makes sense here',
          fitPoints: [
            'You already know the RRSP beats the TFSA or FHSA for the next contribution.',
            'You want a simple place to hold broad ETFs or a straightforward long-term retirement plan.',
            'You have already checked deduction room and decided what the refund should do next.',
          ],
          details: 'Use the referral code at signup | Keep comparing fees, account features, and investment options before deciding',
          disclosure: 'Affiliate disclosure: We may earn a referral bonus if you sign up using this code. That does not change the RRSP assumptions, refund discussion, or account-comparison guidance on this page.',
          buttonLabel: 'Open RRSP with Wealthsimple',
        }}
      />

      <FAQ items={RRSP_FAQS} />
    </main>
  );
}
