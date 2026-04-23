import React, { useMemo, useState } from 'react';
import ToolByline from './ToolByline';
import { CANADIAN_PROVINCES, CONTENT_LAST_REVIEWED } from '../config/financial';
import {
  buildFhsaInitialState,
  calculateFhsaScenario,
  formatFhsaCurrency,
} from '../lib/fhsaPlanning';

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

function InputField({ label, value, onChange, min, max, step, suffix, helpText }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
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

export default function EmbeddedFHSACalculator({
  initialValues = {},
  title = 'Try the FHSA tax-savings calculator',
  intro = 'Start with a realistic home-saving example, then change your income, province, and contribution amount to see how the deduction and growth outlook shift.',
}) {
  const initialState = useMemo(() => buildFhsaInitialState(initialValues), [initialValues]);
  const [birthYear, setBirthYear] = useState(initialState.birthYear);
  const [province, setProvince] = useState(initialState.province);
  const [income, setIncome] = useState(initialState.income);
  const [availableRoomNow, setAvailableRoomNow] = useState(initialState.availableRoomNow);
  const [contributedToDate, setContributedToDate] = useState(initialState.contributedToDate);
  const [currentBalance, setCurrentBalance] = useState(initialState.currentBalance);
  const [annualContribution, setAnnualContribution] = useState(initialState.annualContribution);
  const [expectedReturn, setExpectedReturn] = useState(initialState.expectedReturn);
  const [yearsToPurchase, setYearsToPurchase] = useState(initialState.yearsToPurchase);

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

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Embedded calculator</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed against CRA FHSA rules" />
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Estimated tax savings"
              value={formatFhsaCurrency(result.totalTaxSavings)}
              hint={`Approximate value at a ${Math.round(result.marginalRate * 1000) / 10}% marginal rate.`}
              tone="success"
            />
            <MetricCard
              label="Contribution used in year one"
              value={formatFhsaCurrency(result.contributionUsedYearOne)}
              hint={`${Math.round(result.annualLimitUsage * 100)}% of the annual FHSA limit.`}
              tone="primary"
            />
            <MetricCard
              label="Projected balance"
              value={formatFhsaCurrency(result.projectedBalance)}
              hint={`Includes ${formatFhsaCurrency(result.projectedGrowth)} of projected growth.`}
              tone="warning"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Plain-English interpretation</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{result.interpretation}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current planning view</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Estimated room now: {formatFhsaCurrency(result.yearOneRoom)}</li>
                <li>Effective cost after deduction value: {formatFhsaCurrency(result.effectiveContributionCost)}</li>
                <li>Monthly equivalent contribution: {formatFhsaCurrency(result.monthlyEquivalent)}</li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Input</p>
          <h3 className="mt-2 text-xl font-bold text-primary dark:text-accent">Test your own FHSA scenario</h3>
          <div className="mt-5 space-y-4">
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

            <InputField
              label="Annual income"
              value={income}
              onChange={(event) => setIncome(Number(event.target.value || 0))}
              min={0}
              step={1000}
              suffix="CAD"
            />
            <InputField
              label="Planned contribution"
              value={annualContribution}
              onChange={(event) => setAnnualContribution(Number(event.target.value || 0))}
              min={0}
              max={16000}
              step={500}
              suffix="CAD"
            />
            <InputField
              label="Estimated room available now"
              value={availableRoomNow}
              onChange={(event) => setAvailableRoomNow(Number(event.target.value || 0))}
              min={0}
              max={16000}
              step={500}
              suffix="CAD"
            />
            <InputField
              label="Current FHSA balance"
              value={currentBalance}
              onChange={(event) => setCurrentBalance(Number(event.target.value || 0))}
              min={0}
              step={500}
              suffix="CAD"
            />
            <InputField
              label="Contributions already made"
              value={contributedToDate}
              onChange={(event) => setContributedToDate(Number(event.target.value || 0))}
              min={0}
              max={40000}
              step={500}
              suffix="CAD"
            />
            <InputField
              label="Expected annual growth"
              value={expectedReturn}
              onChange={(event) => setExpectedReturn(Number(event.target.value || 0))}
              min={0}
              max={12}
              step={0.5}
              suffix="%"
            />
            <InputField
              label="Years until home purchase"
              value={yearsToPurchase}
              onChange={(event) => setYearsToPurchase(Number(event.target.value || 0))}
              min={1}
              max={15}
              step={1}
              suffix="yrs"
            />
            <InputField
              label="Birth year"
              value={birthYear}
              onChange={(event) => setBirthYear(Number(event.target.value || 0))}
              min={1950}
              max={2008}
              step={1}
            />
          </div>

          {!result.likelyAgeEligible ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
              This scenario may fall outside the usual FHSA age rules. Treat the output as exploratory until eligibility is confirmed.
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
