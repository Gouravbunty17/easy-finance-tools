import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import ToolByline from '../../components/ToolByline';
import ToolPageSchema from '../../components/ToolPageSchema';
import ActionableNextSteps from '../../components/ActionableNextSteps';
import EducationalDisclaimer from '../../components/EducationalDisclaimer';
import ReferenceSection from '../../components/ReferenceSection';
import TrackedLink from '../../components/TrackedLink';
import {
  CONTENT_LAST_REVIEWED,
  DATA_SNAPSHOT_LABEL,
  DEFAULT_ASSUMPTIONS,
  DIVIDEND_ETF_DATA,
  DIVIDEND_INCOME_GOALS,
  getDividendEtfById,
} from '../../config/financial';
import { trackToolCalculate, trackToolStart } from '../../lib/analytics';
import { asNumber, parseNumericInput } from '../../lib/numericInputs';

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const ETF_FAQS = [
  {
    q: 'What does dividend yield mean?',
    a: 'Dividend yield is the annual cash distribution divided by the fund price. It helps estimate income, but it does not tell you whether the payout is stable or whether the ETF is the best total-return option for your account.',
  },
  {
    q: 'Is a higher-yield ETF always better for a TFSA?',
    a: 'No. A higher yield can come with concentration risk, covered-call drag, or slower capital growth. The TFSA job matters first: if the account is for long-term growth, a plain broad-market ETF may still be the stronger choice.',
  },
  {
    q: 'Why does DRIP change the result so much?',
    a: 'If you reinvest distributions, each payment buys more units and future distributions are calculated on a larger balance. That is why DRIP can materially change long-term outcomes, especially over 10 years or more.',
  },
  {
    q: 'Can I rely on these ETF yields as current market quotes?',
    a: 'No. The ETF table on this page is an illustrative planning snapshot, not a live quote feed. Refresh the data before making a real allocation decision.',
  },
  {
    q: 'Should income ETFs live in a TFSA?',
    a: 'Often yes if the goal is tax-free cash flow and the holdings fit your overall plan. The right answer still depends on whether the account should be used for income, growth, or a mix of both.',
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

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function SummaryCard({ label, value, hint, tone = 'default' }) {
  const tones = {
    default: 'bg-white text-primary dark:bg-gray-800 dark:text-accent',
    primary: 'bg-gradient-to-br from-primary to-secondary text-white',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  };

  return (
    <div className={`rounded-2xl border border-slate-200 p-5 dark:border-slate-700 ${tones[tone] || tones.default}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-2 text-sm opacity-80">{hint}</p> : null}
    </div>
  );
}

function NumericField({ label, value, onChange, step, min, max, suffix, helpText }) {
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

export default function DividendCalculator() {
  const [selectedEtfId, setSelectedEtfId] = useState(DEFAULT_ASSUMPTIONS.etfIncome.selectedEtfId);
  const [investmentAmount, setInvestmentAmount] = useState(DEFAULT_ASSUMPTIONS.etfIncome.investmentAmount);
  const [yieldInput, setYieldInput] = useState(getDividendEtfById(DEFAULT_ASSUMPTIONS.etfIncome.selectedEtfId).yield);
  const [dividendGrowth, setDividendGrowth] = useState(getDividendEtfById(DEFAULT_ASSUMPTIONS.etfIncome.selectedEtfId).dividendGrowth);
  const [priceGrowth, setPriceGrowth] = useState(getDividendEtfById(DEFAULT_ASSUMPTIONS.etfIncome.selectedEtfId).priceGrowth);
  const [years, setYears] = useState(DEFAULT_ASSUMPTIONS.etfIncome.years);
  const [additionalMonthly, setAdditionalMonthly] = useState(DEFAULT_ASSUMPTIONS.etfIncome.additionalMonthly);
  const [dripEnabled, setDripEnabled] = useState(DEFAULT_ASSUMPTIONS.etfIncome.dripEnabled);
  const [useTfsa, setUseTfsa] = useState(DEFAULT_ASSUMPTIONS.etfIncome.useTfsa);
  const [marginalTaxRate, setMarginalTaxRate] = useState(DEFAULT_ASSUMPTIONS.etfIncome.marginalTaxRate);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const selectedEtf = getDividendEtfById(selectedEtfId);

  const trackStartOnce = () => {
    if (hasTrackedStart) return;
    trackToolStart('etf_income_dividend_simulator', { entry_point: 'input_interaction' });
    setHasTrackedStart(true);
  };

  const applyEtf = (id) => {
    const etf = getDividendEtfById(id);
    trackStartOnce();
    trackToolCalculate('etf_income_dividend_simulator', {
      action: 'preset_select',
      preset_name: etf.ticker,
    });
    setSelectedEtfId(id);
    setYieldInput(etf.yield);
    setDividendGrowth(etf.dividendGrowth);
    setPriceGrowth(etf.priceGrowth);
  };

  const results = useMemo(() => {
    const safeInvestment = Math.max(0, asNumber(investmentAmount));
    const safeYield = Math.max(0, asNumber(yieldInput));
    const safeDividendGrowth = asNumber(dividendGrowth);
    const safePriceGrowth = asNumber(priceGrowth);
    const safeYears = Math.max(1, asNumber(years, 1));
    const safeAdditionalMonthly = Math.max(0, asNumber(additionalMonthly));
    const safeTaxRate = Math.max(0, asNumber(marginalTaxRate));

    let balance = safeInvestment;
    let totalContributions = safeInvestment;
    let totalCashTaken = 0;

    const rows = [];

    for (let year = 1; year <= safeYears; year += 1) {
      const currentYield = safeYield * Math.pow(1 + safeDividendGrowth / 100, year - 1);
      const grossAnnualIncome = balance * (currentYield / 100);
      const afterTaxIncome = useTfsa ? grossAnnualIncome : grossAnnualIncome * (1 - safeTaxRate / 100 * 0.5);

      if (dripEnabled) {
        balance += afterTaxIncome;
      } else {
        totalCashTaken += afterTaxIncome;
      }

      const annualContribution = safeAdditionalMonthly * 12;
      balance += annualContribution;
      totalContributions += annualContribution;
      balance *= 1 + safePriceGrowth / 100;

      rows.push({
        year,
        grossAnnualIncome,
        afterTaxIncome,
        monthlyIncome: afterTaxIncome / 12,
        balance,
        currentYield,
        totalCashTaken,
      });
    }

    const firstYearIncome = safeInvestment * (safeYield / 100);
    const afterTaxFirstYearIncome = useTfsa ? firstYearIncome : firstYearIncome * (1 - safeTaxRate / 100 * 0.5);
    const finalYear = rows[rows.length - 1];
    const effectiveYield = useTfsa ? safeYield / 100 : (safeYield / 100) * (1 - safeTaxRate / 100 * 0.5);
    const capitalRequired = DIVIDEND_INCOME_GOALS.map((goal) => ({
      goal,
      monthlyIncome: goal,
      capital: effectiveYield > 0 ? (goal * 12) / effectiveYield : 0,
    }));

    let interpretation = 'This income plan works best if the ETF actually matches the job of the account and the yield assumption is realistic.';
    if (safeYield >= 8) {
      interpretation = 'The projected income is driven by a high-yield assumption. That can be useful for planning, but it deserves extra scrutiny around covered-call drag, concentration, and total-return tradeoffs.';
    } else if (dripEnabled && safeYears >= 10) {
      interpretation = 'This scenario leans on reinvestment to turn monthly cash flow into a larger future income stream. That is often a better long-term fit than chasing the highest current yield.';
    } else if (!dripEnabled) {
      interpretation = 'This plan prioritizes current cash flow over compounding. That can be reasonable, but it usually means slower future income growth.';
    }

    return {
      firstYearIncome,
      afterTaxFirstYearIncome,
      finalAnnualIncome: finalYear.afterTaxIncome,
      finalMonthlyIncome: finalYear.monthlyIncome,
      projectedBalance: finalYear.balance,
      totalContributions,
      totalCashTaken: finalYear.totalCashTaken,
      yieldOnContribution: totalContributions > 0 ? finalYear.afterTaxIncome / totalContributions : 0,
      capitalRequired,
      rows,
      interpretation,
    };
  }, [additionalMonthly, dividendGrowth, dripEnabled, investmentAmount, marginalTaxRate, priceGrowth, useTfsa, yieldInput, years]);

  const chartData = {
    labels: results.rows.map((row) => `Year ${row.year}`),
    datasets: [
      {
        label: 'Annual dividend income',
        data: results.rows.map((row) => Math.round(row.afterTaxIncome)),
        borderColor: '#00557a',
        backgroundColor: 'rgba(0, 85, 122, 0.12)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
      },
      {
        label: 'Portfolio value',
        data: results.rows.map((row) => Math.round(row.balance)),
        borderColor: '#22c55e',
        backgroundColor: 'transparent',
        tension: 0.3,
        pointRadius: 2,
        yAxisID: 'balance',
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="ETF Income and Dividend Calculator Canada 2026"
        description="Compare Canadian dividend ETFs, estimate annual and monthly income, model DRIP growth, and see how much capital you need for common income goals."
        canonical="https://easyfinancetools.com/tools/dividend-calculator"
      />
      <ToolPageSchema
        name="ETF Income and Dividend Calculator Canada 2026"
        description="Canadian ETF income and dividend planning tool for yield assumptions, DRIP growth, income goals, and TFSA context."
        canonical="https://easyfinancetools.com/tools/dividend-calculator"
        category="FinanceApplication"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            Canadian ETF income planning
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">ETF income and dividend simulator</h1>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed for planning assumptions" />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Compare popular Canadian dividend ETFs, test a custom yield assumption, and see how much capital and reinvestment it may take to reach practical income goals inside a TFSA or taxable account.
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryCard
              label="Estimated annual income now"
              value={formatCurrency(results.afterTaxFirstYearIncome)}
              hint={useTfsa ? 'Based on the current yield assumption inside a TFSA.' : 'After a simplified dividend tax drag assumption.'}
              tone="primary"
            />
            <SummaryCard
              label={`Income in year ${years}`}
              value={formatCurrency(results.finalAnnualIncome)}
              hint={`${formatCurrency(results.finalMonthlyIncome)} per month under the current assumptions.`}
              tone="success"
            />
            <SummaryCard
              label="Projected balance"
              value={formatCurrency(results.projectedBalance)}
              hint={`Includes ${dripEnabled ? 'reinvested distributions' : 'cash taken out plus balance growth'} over ${years} years.`}
              tone="warning"
            />
          </div>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Comparison table</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Illustrative Canadian dividend ETF snapshot</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Use these rows to autofill the simulator, then change the yield or growth assumptions if your shortlist differs. This is an illustrative planning table, not a live quote feed.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                    <th className="py-2 pr-4 font-semibold">ETF</th>
                    <th className="py-2 pr-4 font-semibold">Focus</th>
                    <th className="py-2 pr-4 font-semibold">Yield</th>
                    <th className="py-2 pr-4 font-semibold">MER</th>
                    <th className="py-2 pr-4 font-semibold">Frequency</th>
                    <th className="py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300">
                  {DIVIDEND_ETF_DATA.map((etf) => (
                    <tr key={etf.id} className={`border-b border-slate-100 dark:border-slate-800 ${selectedEtfId === etf.id ? 'bg-blue-50/70 dark:bg-blue-950/20' : ''}`}>
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-primary dark:text-accent">{etf.ticker}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{etf.name}</div>
                      </td>
                      <td className="py-3 pr-4">{etf.focus}</td>
                      <td className="py-3 pr-4">{formatPercent(etf.yield)}</td>
                      <td className="py-3 pr-4">{formatPercent(etf.mer)}</td>
                      <td className="py-3 pr-4">{etf.frequency}</td>
                      <td className="py-3">
                        <button
                          onClick={() => applyEtf(etf.id)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selectedEtfId === etf.id ? 'bg-primary text-white' : 'bg-slate-100 text-primary hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200'}`}
                        >
                          Use in simulator
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{DATA_SNAPSHOT_LABEL}. Update the values in <code>src/config/financial.js</code> when yields or ETF assumptions change.</p>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Interpretation</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What the simulator is telling you</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{results.interpretation}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Selected ETF</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{selectedEtf.ticker}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedEtf.notes}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">TFSA fit</p>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{selectedEtf.tfsaFit}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Risk reminder</p>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{selectedEtf.riskFlag}</p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Output</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Income and growth over time</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {dripEnabled ? 'DRIP enabled' : 'Cash flow mode'}
              </div>
            </div>

            <div className="mt-6 h-[340px]">
              <Line
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatCurrency(Number(context.raw))}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => formatCurrency(Number(value)),
                      },
                    },
                    balance: {
                      position: 'right',
                      grid: { drawOnChartArea: false },
                      ticks: {
                        callback: (value) => formatCurrency(Number(value)),
                      },
                    },
                  },
                }}
              />
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Income goals</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">How much capital is needed for common monthly targets?</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {results.capitalRequired.map((goal) => (
                <div key={goal.goal} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{formatCurrency(goal.monthlyIncome)} per month</p>
                  <p className="mt-2 text-2xl font-bold text-primary dark:text-accent">{formatCurrency(goal.capital)}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Based on the current yield assumption and {useTfsa ? 'tax-free TFSA income.' : 'a simplified after-tax dividend rate.'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What yield means</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Yield is an income clue, not a verdict</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>Yield estimates the cash distribution relative to the ETF price. It helps you model income, but it does not tell you whether the payout is stable, whether the ETF is expensive, or whether the strategy is the best fit for a TFSA.</p>
                <p>That is why this simulator pairs yield with growth, DRIP, and account type instead of treating the highest payout as the automatic winner.</p>
              </div>
            </div>

            <div className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use this in a TFSA</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Put the account job first</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>If the TFSA job is long-term growth, a broad-market ETF may still beat an income ETF even if the cash flow looks less exciting today. If the TFSA job is tax-free cash flow or a staged transition into income, a dividend ETF can make more sense.</p>
                <p>Use this page to see the tradeoff clearly, then compare it with the broader ETF guidance in the <TrackedLink articleSlug="dividend_calculator" ctaLabel="best_etfs_for_tfsa_inline" to="/blog/best-etfs-for-tfsa-canada-2026" className="text-primary underline">TFSA ETF guide</TrackedLink>.</p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'ETF comparison explanation',
                body: 'The table is built to help you compare different income styles: broad Canadian dividend exposure, dividend-growth tilts, and higher-yield covered-call income.',
              },
              {
                title: 'Risk reminders',
                body: 'High yield can come with slower growth, more concentration, or capped upside. Total return still matters, especially if the TFSA is supposed to compound for years.',
              },
              {
                title: 'What to compare next',
                body: 'Once the yield and DRIP assumptions make sense, compare the ETF idea against your account choice, platform, and broader asset mix.',
              },
            ].map((card) => (
              <div key={card.title} className="surface-card p-5">
                <h2 className="text-xl font-bold text-primary dark:text-accent">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{card.body}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="surface-card h-fit p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Input</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Build your ETF income scenario</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Pick a dividend ETF row or test a custom yield. Change the growth assumptions only if you have a reason to do so.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Quick select ETF</label>
              <select
                value={selectedEtfId}
                onChange={(event) => applyEtf(event.target.value)}
                className="focus-ring w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {DIVIDEND_ETF_DATA.map((etf) => (
                  <option key={etf.id} value={etf.id}>{etf.ticker} - {etf.name}</option>
                ))}
              </select>
            </div>

            <NumericField
              label="Initial investment"
              value={investmentAmount}
              onChange={(event) => {
                trackStartOnce();
                setInvestmentAmount(parseNumericInput(event.target.value));
                trackToolCalculate('etf_income_dividend_simulator', { action: 'investment_change' });
              }}
              min={0}
              step={500}
              suffix="CAD"
            />
            <NumericField
              label="Dividend yield assumption"
              value={yieldInput}
              onChange={(event) => {
                trackStartOnce();
                setYieldInput(parseNumericInput(event.target.value));
                trackToolCalculate('etf_income_dividend_simulator', { action: 'yield_change' });
              }}
              min={0}
              max={20}
              step={0.1}
              suffix="%"
            />
            <NumericField
              label="Dividend growth assumption"
              value={dividendGrowth}
              onChange={(event) => {
                trackStartOnce();
                setDividendGrowth(parseNumericInput(event.target.value));
              }}
              min={-5}
              max={12}
              step={0.5}
              suffix="%"
            />
            <NumericField
              label="Price growth assumption"
              value={priceGrowth}
              onChange={(event) => {
                trackStartOnce();
                setPriceGrowth(parseNumericInput(event.target.value));
              }}
              min={-5}
              max={12}
              step={0.5}
              suffix="%"
            />
            <NumericField
              label="Additional monthly contribution"
              value={additionalMonthly}
              onChange={(event) => {
                trackStartOnce();
                setAdditionalMonthly(parseNumericInput(event.target.value));
                trackToolCalculate('etf_income_dividend_simulator', { action: 'monthly_contribution_change' });
              }}
              min={0}
              step={50}
              suffix="CAD"
            />
            <NumericField
              label="Projection horizon"
              value={years}
              onChange={(event) => {
                trackStartOnce();
                setYears(parseNumericInput(event.target.value, { integer: true }));
              }}
              min={1}
              max={30}
              step={1}
              suffix="yrs"
            />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <input
                  id="drip-enabled"
                  type="checkbox"
                  checked={dripEnabled}
                  onChange={(event) => {
                    trackStartOnce();
                    setDripEnabled(event.target.checked);
                    trackToolCalculate('etf_income_dividend_simulator', { action: 'drip_toggle', enabled: event.target.checked });
                  }}
                  className="h-5 w-5 accent-primary"
                />
                <label htmlFor="drip-enabled" className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Reinvest distributions (DRIP)
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <input
                  id="tfsa-mode"
                  type="checkbox"
                  checked={useTfsa}
                  onChange={(event) => {
                    trackStartOnce();
                    setUseTfsa(event.target.checked);
                    trackToolCalculate('etf_income_dividend_simulator', { action: 'account_type_toggle', use_tfsa: event.target.checked });
                  }}
                  className="h-5 w-5 accent-primary"
                />
                <label htmlFor="tfsa-mode" className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Model this inside a TFSA
                </label>
              </div>

              {!useTfsa ? (
                <div className="mt-4">
                  <NumericField
                    label="Marginal tax rate"
                    value={marginalTaxRate}
                    onChange={(event) => {
                      trackStartOnce();
                      setMarginalTaxRate(parseNumericInput(event.target.value));
                    }}
                    min={0}
                    max={55}
                    step={0.5}
                    suffix="%"
                    helpText="Simplified tax-drag assumption for planning only."
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-900/20">
            <p className="font-semibold text-blue-800 dark:text-blue-200">Scenario snapshot</p>
            <ul className="mt-2 space-y-2 text-blue-700 dark:text-blue-300">
              <li>Current yield assumption: {formatPercent(asNumber(yieldInput))}</li>
              <li>Selected ETF focus: {selectedEtf.focus}</li>
              <li>Projected yield on contributed capital: {formatPercent(results.yieldOnContribution * 100)}</li>
            </ul>
          </div>
        </aside>
      </div>

      <MethodologyPanel
        title="Assumptions behind this ETF income simulator"
        summary="This page is built for scenario planning, not live ETF quotes. It combines a yield assumption, optional dividend growth, price growth, and DRIP behavior to show how income and account value could change over time."
        updated={CONTENT_LAST_REVIEWED}
        reviewer="Gourav Kumar"
        assumptions={[
          'ETF rows are illustrative planning snapshots and should be refreshed before real investing decisions.',
          'Dividend yield, dividend growth, and price growth are treated as stable inputs even though markets move unevenly.',
          'If DRIP is enabled, after-tax distributions are reinvested into the same ETF instead of being taken as cash.',
          'Tax handling outside a TFSA is simplified and does not model every provincial dividend-credit detail or foreign withholding rule.',
        ]}
        sources={[
          { label: 'CRA: Tax-Free Savings Account', href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html' },
          { label: 'EasyFinanceTools methodology', href: 'https://easyfinancetools.com/methodology' },
        ]}
        note="Educational planning tool only. Verify live ETF factsheets, fees, tax treatment, and suitability before acting."
      />

      <ReferenceSection
        eyebrow="Source shell"
        title="What should be refreshed when ETF data changes"
        intro="The ETF table is intentionally easy to maintain. Refresh the local ETF data object, then re-check the rest of the page against these reference points."
        references={[
          {
            label: 'Local ETF data object',
            body: 'Update sample yields, MERs, growth assumptions, and fit notes in src/config/financial.js when your shortlist changes.',
          },
          {
            label: 'Provider factsheets and ETF pages',
            body: 'Use the issuer factsheet or ETF page to confirm yield, holdings, MER, and distribution frequency before publishing yearly refreshes.',
          },
          {
            label: 'CRA TFSA guidance',
            body: 'Re-check TFSA treatment language whenever the page discusses account location or why tax-free income may matter.',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html',
          },
          {
            label: 'Internal link review',
            body: 'Keep the related ETF, TFSA, and platform-comparison links aligned so the page continues to act like a decision hub instead of a dead-end calculator.',
          },
        ]}
        note="Manual review needed: confirm ETF product details, current yield context, and whether any covered-call or concentration warnings need to be tightened."
      />

      <ActionableNextSteps
        toolName="etf_income_dividend_simulator"
        title="What to do next with the income estimate"
        intro="Once the income math looks realistic, the next job is deciding whether the ETF belongs in your TFSA, how much concentration risk you can accept, and which platform fits the strategy."
        meaning={`${formatCurrency(results.finalAnnualIncome)} of projected annual income in year ${years} looks useful only if the ETF assumption is realistic and the account job is actually income. Compare the ETF idea against your broader TFSA plan before chasing yield.`}
        steps={[
          'Decide whether the account should prioritize growth, cash flow, or a blend of both.',
          'Compare the dividend ETF idea against a broader TFSA ETF option before assuming income is the best use of the account.',
          'Choose a platform after the ETF and account strategy are clear, not before.',
        ]}
        actions={[
          {
            title: 'Read the TFSA ETF guide',
            body: 'Compare this income idea with broader all-in-one and balanced ETF options for a Canadian TFSA.',
            href: '/blog/best-etfs-for-tfsa-canada-2026',
            ctaLabel: 'open_tfsa_etf_guide',
          },
          {
            title: 'Compare TFSA vs RRSP',
            body: 'Use the account comparison guide if the income ETF might live outside the TFSA or compete with other contribution priorities.',
            href: '/blog/tfsa-vs-rrsp-2026',
            ctaLabel: 'open_tfsa_vs_rrsp_guide',
          },
          {
            title: 'Review dividend platform comparisons',
            body: 'See which Canadian investing platforms best fit an ETF income strategy after the portfolio plan is clear.',
            href: '/blog/best-dividend-investing-platforms-canada',
            ctaLabel: 'open_dividend_platform_comparison',
          },
        ]}
        referral={{
          placement: 'etf_income_page',
          badge: 'Logical next step',
          title: 'Start your ETF income plan with Wealthsimple',
          highlight: 'ETF income',
          description: 'If this simulator helps you settle on a simple ETF income approach, a low-friction investing account can be a reasonable next step after you compare strategy and account type.',
          fitHeading: 'Why this placement makes sense here',
          fitPoints: [
            'You already know the income strategy fits your TFSA or investing plan.',
            'You want an easy way to buy and hold dividend ETFs with recurring contributions.',
            'You have already compared the income ETF idea against a broader growth ETF option.',
          ],
          details: 'Use the referral code at signup | Keep comparing features, fees, and account choices before deciding',
          disclosure: 'Affiliate disclosure: We may earn a referral bonus if you sign up using this code. That does not change the ETF assumptions, TFSA discussion, or risk reminders on this page.',
          buttonLabel: 'Start ETF plan with Wealthsimple',
        }}
      />

      <FAQ items={ETF_FAQS} />

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related reading</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Keep the decision loop moving</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              href: '/blog/weekly-dividend-etfs',
              title: 'Weekly dividend ETF guide',
              body: 'See why payout frequency can be attractive without assuming it makes the ETF a better long-term choice.',
            },
            {
              href: '/tools/tfsa-calculator',
              title: 'TFSA calculator',
              body: 'Compare the ETF income idea against the broader job you want the TFSA to do over time.',
            },
            {
              href: '/blog/how-to-invest-in-canada-beginners-2026',
              title: 'How to invest in Canada',
              body: 'Step back and review the full account and ETF workflow before committing to one income strategy.',
            },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
            >
              <p className="text-lg font-bold text-primary dark:text-accent">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
