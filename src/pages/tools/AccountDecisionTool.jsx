import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import ToolPageSchema from '../../components/ToolPageSchema';
import ToolByline from '../../components/ToolByline';
import EducationalDisclaimer from '../../components/EducationalDisclaimer';
import ResultInsightCard from '../../components/ResultInsightCard';
import ScenarioBreakdown from '../../components/ScenarioBreakdown';
import OptimizationTips from '../../components/OptimizationTips';
import ImportantConsiderations from '../../components/ImportantConsiderations';
import NextStepLinks from '../../components/NextStepLinks';
import SourceList from '../../components/SourceList';
import OfficialSourceNote from '../../components/OfficialSourceNote';
import CalculatorCaseStudy from '../../components/CalculatorCaseStudy';
import DecisionFramework from '../../components/DecisionFramework';
import { CONTENT_LAST_REVIEWED } from '../../config/financial';
import { fhsaOfficialSources, rrspOfficialSources, tfsaOfficialSources } from '../../config/officialSources';

const GOALS = [
  { value: 'home', label: 'First home' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'flexibility', label: 'Flexible investing' },
  { value: 'income', label: 'Dividend income' },
];

const TIMEFRAMES = [
  { value: 'short', label: '0 to 3 years' },
  { value: 'medium', label: '3 to 7 years' },
  { value: 'long', label: '7+ years' },
];

const PROVINCE_CONTEXT = [
  { value: 'ON', label: 'Ontario', note: 'Middle-income RRSP comparisons can be sensitive to combined federal and Ontario brackets.' },
  { value: 'BC', label: 'British Columbia', note: 'Use this as a planning filter, then verify the tax impact with a province-specific tax calculator.' },
  { value: 'AB', label: 'Alberta', note: 'Provincial tax differences can change the refund estimate, but flexibility and timeline still matter.' },
  { value: 'QC', label: 'Quebec', note: 'Quebec has distinct provincial tax administration, so confirm tax assumptions carefully.' },
  { value: 'Other', label: 'Other province', note: 'Province affects tax estimates. Treat the account fit score as directional until the exact province is modeled.' },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });
}

function OptionButton({ selected, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
        selected
          ? 'border-primary bg-primary text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

export default function AccountDecisionTool() {
  const [goal, setGoal] = useState('home');
  const [income, setIncome] = useState(75000);
  const [timeframe, setTimeframe] = useState('medium');
  const [firstHomeEligible, setFirstHomeEligible] = useState(true);
  const [needsFlexibility, setNeedsFlexibility] = useState(true);
  const [hasEmergencyFund, setHasEmergencyFund] = useState(false);
  const [province, setProvince] = useState('ON');

  const result = useMemo(() => {
    const safeIncome = Math.max(0, Number(income || 0));
    const highIncome = safeIncome >= 100000;
    const moderateIncome = safeIncome >= 60000 && safeIncome < 100000;
    const lowIncome = safeIncome < 60000;
    const shortTimeframe = timeframe === 'short';
    const homeRelevant = goal === 'home' && firstHomeEligible;

    let primary = 'TFSA';
    let secondary = 'RRSP';
    let confidence = 'Medium';
    let plainEnglish = 'The TFSA looks like the clean first account because flexibility matters and the RRSP deduction is not obviously dominant from the inputs entered.';
    const reasons = [];
    const warnings = [];

    if (!hasEmergencyFund) {
      warnings.push('A basic emergency buffer may matter more than optimizing registered accounts.');
    }

    if (homeRelevant) {
      primary = 'FHSA';
      secondary = needsFlexibility ? 'TFSA' : 'RRSP';
      confidence = shortTimeframe ? 'Medium' : 'High';
      plainEnglish = 'The FHSA deserves first consideration because an eligible first-home goal can combine deduction value with a qualifying tax-free withdrawal.';
      reasons.push('First-home goal is active and FHSA eligibility is marked yes.');
      reasons.push('FHSA room starts only after opening the account, so timing can matter.');
      if (shortTimeframe) warnings.push('If the purchase is soon, avoid taking investment risk just to chase a small amount of growth.');
    } else if (goal === 'retirement' && highIncome && !needsFlexibility) {
      primary = 'RRSP';
      secondary = 'TFSA';
      confidence = 'High';
      plainEnglish = 'The RRSP looks stronger because the income input suggests the deduction may be valuable and the goal is retirement rather than flexible access.';
      reasons.push('Higher current income can make the RRSP deduction more valuable.');
      reasons.push('Retirement goal fits the RRSP better than short-term spending needs.');
    } else if (goal === 'retirement' && moderateIncome) {
      primary = needsFlexibility ? 'TFSA + RRSP split' : 'RRSP';
      secondary = needsFlexibility ? 'Run both calculators' : 'TFSA';
      confidence = 'Medium';
      plainEnglish = needsFlexibility
        ? 'A split decision may be more realistic than forcing one winner because retirement matters, but flexibility still has value.'
        : 'The RRSP may be useful, but the TFSA still deserves comparison unless the refund will be used intentionally.';
      reasons.push('Middle-income RRSP decisions depend heavily on current-vs-future tax rate.');
      reasons.push('Reinvesting or intentionally using the refund can change the result.');
    } else if (goal === 'income') {
      primary = 'TFSA';
      secondary = 'Dividend calculator';
      confidence = 'Medium';
      plainEnglish = 'The TFSA is usually the cleaner place to test dividend income first, but the ETF strategy still needs a yield-quality and total-return check.';
      reasons.push('Tax-free income can be useful if TFSA room is available.');
      reasons.push('Dividend yield alone is not enough to choose an ETF.');
      warnings.push('High-yield ETFs can involve concentration, covered-call tradeoffs, or weaker capital growth.');
    } else if (lowIncome || needsFlexibility || shortTimeframe) {
      primary = 'TFSA';
      secondary = firstHomeEligible && goal === 'home' ? 'FHSA' : 'RRSP';
      confidence = lowIncome || shortTimeframe ? 'High' : 'Medium';
      plainEnglish = 'The TFSA looks like the practical first account because tax-free access and flexibility are more valuable from the inputs than locking money into an RRSP.';
      reasons.push('Lower or moderate income can reduce the immediate value of an RRSP deduction.');
      reasons.push('Flexible access matters when plans or timing are uncertain.');
    }

    if (goal === 'home' && !firstHomeEligible) {
      warnings.push('FHSA may not be available if eligibility is not met. Confirm the first-time home buyer conditions before opening an account.');
    }

    return {
      primary,
      secondary,
      confidence,
      plainEnglish,
      reasons,
      warnings,
      highIncome,
      monthlyAmount: Math.round(Math.max(0, safeIncome * 0.1) / 12),
      fitScores: {
        TFSA: primary.includes('TFSA') ? 88 : secondary.includes('TFSA') ? 68 : 48,
        RRSP: primary.includes('RRSP') ? 88 : secondary.includes('RRSP') ? 68 : highIncome ? 74 : 42,
        FHSA: primary.includes('FHSA') ? 92 : homeRelevant ? 74 : 28,
      },
      provinceNote: PROVINCE_CONTEXT.find((item) => item.value === province)?.note || PROVINCE_CONTEXT[4].note,
    };
  }, [firstHomeEligible, goal, hasEmergencyFund, income, needsFlexibility, timeframe, province]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="TFSA, RRSP or FHSA Decision Tool Canada"
        description="Answer a few Canadian account-planning questions and get an educational TFSA, RRSP, or FHSA next-step framework with calculators and warnings."
        canonical="https://easyfinancetools.com/tools/account-decision-tool"
      />
      <ToolPageSchema
        name="TFSA, RRSP or FHSA Decision Tool Canada"
        description="Educational Canadian account-priority decision tool for comparing TFSA, RRSP, and FHSA next steps."
        canonical="https://easyfinancetools.com/tools/account-decision-tool"
        category="FinanceApplication"
      />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            Canadian account decision support
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">TFSA, RRSP or FHSA: what should get the next dollar?</h1>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed against Canadian account rules" />
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            This is not a product recommendation. It is a short decision engine that turns your goal, income, timeline, and flexibility needs into a practical account-priority framework.
          </p>
          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <OfficialSourceNote
            title="Source check before choosing an account"
            body="TFSA, RRSP, and FHSA room and withdrawal rules should be verified against CRA before funding an account."
            sources={[tfsaOfficialSources[0], rrspOfficialSources[0], fhsaOfficialSources[0]]}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Likely first account</p>
              <p className="mt-3 text-3xl font-bold">{result.primary}</p>
              <p className="mt-2 text-sm text-blue-100">Confidence: {result.confidence}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Compare next</p>
              <p className="mt-3 text-2xl font-bold text-primary dark:text-accent">{result.secondary}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use the matching calculator before opening or funding anything.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Starter test amount</p>
              <p className="mt-3 text-2xl font-bold text-primary dark:text-accent">{formatCurrency(result.monthlyAmount)}/mo</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A rough 10% of income habit, only for scenario testing.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <ResultInsightCard title="Plain-English account readout" tone="emerald">
              <p>{result.plainEnglish}</p>
            </ResultInsightCard>
            <ScenarioBreakdown
              title="Why the tool leaned this way"
              rows={[
                { label: 'Goal', value: GOALS.find((item) => item.value === goal)?.label, body: 'The account should match what the money is for, not just which limit is larger.' },
                { label: 'Timeline', value: TIMEFRAMES.find((item) => item.value === timeframe)?.label, body: 'Shorter timelines usually reduce the case for investment risk and rigid account choices.' },
                { label: 'Flexibility', value: needsFlexibility ? 'Important' : 'Less important', body: 'The more uncertain the plan, the more TFSA flexibility can matter.' },
              ]}
            />
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Visual comparison</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">How the accounts score for this scenario</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                This is a directional fit score, not advice. It helps show why the tool prefers one account instead of treating TFSA, RRSP, and FHSA as interchangeable.
              </p>
              <div className="mt-5 space-y-4" aria-label="Directional account fit scores">
                {Object.entries(result.fitScores).map(([label, score]) => (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                      <span>{label}</span>
                      <span>{score}/100</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                      <div className="h-full rounded-full bg-secondary" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <OptimizationTips
              title="How to turn this into a real decision"
              items={[
                { title: 'Confirm actual room', body: 'CRA room, FHSA eligibility, RRSP deduction room, and recent transactions matter more than this simplified prompt.' },
                { title: 'Run the matching calculator', body: 'Use this page to choose the next calculator, then model the dollar amount with visible assumptions.' },
                { title: 'Decide before choosing a platform', body: 'The account decision should come before any brokerage or referral choice.' },
                { title: 'Use negative checks', body: 'If debt, emergency cash, or near-term spending pressure is the issue, account optimization may be the wrong first problem.' },
              ]}
            />
            {result.warnings.length ? <ImportantConsiderations title="Before you use this result" items={result.warnings} /> : null}
            <DecisionFramework
              eyebrow="What changes the answer?"
              title="Five checks that can flip the account priority"
              intro="This tool avoids crowning one universal account because the same person can get a different answer after one real-life detail changes."
              items={[
                {
                  title: 'Income rises or falls',
                  badge: 'Tax rate',
                  signal: 'RRSP value depends on the deduction today versus withdrawal tax later.',
                  whenItHelps: 'current income is meaningfully higher than expected retirement income.',
                  watchOut: 'a refund is spent instead of used intentionally.',
                },
                {
                  title: 'A first-home goal appears',
                  badge: 'FHSA',
                  signal: 'FHSA timing matters because room starts after the account is opened.',
                  whenItHelps: 'eligibility is clear and the home timeline is realistic.',
                  watchOut: 'the money may be needed too soon for market risk.',
                },
                {
                  title: 'Cash flexibility matters',
                  badge: 'TFSA',
                  signal: 'TFSA access can be worth more than tax optimization.',
                  whenItHelps: 'job, housing, family, or timing uncertainty is high.',
                  watchOut: 'room is used for frequent spending instead of a planned purpose.',
                },
                {
                  title: 'Emergency savings are missing',
                  badge: 'Priority',
                  signal: 'The best registered account may not be the first problem.',
                  whenItHelps: 'cash reserves protect the plan from debt or forced selling.',
                  watchOut: 'optimization hides a basic liquidity gap.',
                },
              ]}
              footer={result.provinceNote}
            />
            <NextStepLinks
              title="Run the calculator that matches the account"
              intro="This decision tool is intentionally a router. The next page should test the numbers, not sell a product."
              links={[
                { title: 'TFSA calculator', href: '/tools/tfsa-calculator', body: 'Check room, withdrawal timing, contribution pace, and tax-free growth.' },
                { title: 'RRSP calculator', href: '/tools/rrsp-calculator', body: 'Estimate refund value, retirement tradeoffs, and whether reinvesting the refund changes the result.' },
                { title: 'FHSA calculator', href: '/tools/fhsa-calculator', body: 'Model first-home tax savings, room use, and down-payment timing.' },
              ]}
            />
          </div>
        </div>

        <aside className="surface-card h-fit p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Inputs</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Answer five questions</h2>

          <div className="mt-6 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Main goal</label>
              <div className="grid gap-2">
                {GOALS.map((item) => (
                  <OptionButton key={item.value} selected={goal === item.value} onClick={() => setGoal(item.value)}>
                    {item.label}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Annual income before tax</label>
              <input
                type="number"
                value={income}
                min={0}
                step={1000}
                onChange={(event) => setIncome(Number(event.target.value || 0))}
                className="focus-ring w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Province context</label>
              <div className="grid grid-cols-2 gap-2">
                {PROVINCE_CONTEXT.map((item) => (
                  <OptionButton key={item.value} selected={province === item.value} onClick={() => setProvince(item.value)}>
                    {item.label}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">When might you use the money?</label>
              <div className="grid gap-2">
                {TIMEFRAMES.map((item) => (
                  <OptionButton key={item.value} selected={timeframe === item.value} onClick={() => setTimeframe(item.value)}>
                    {item.label}
                  </OptionButton>
                ))}
              </div>
            </div>

            {[
              ['I may be FHSA-eligible as a first-time home buyer', firstHomeEligible, setFirstHomeEligible],
              ['I still value flexible access to the money', needsFlexibility, setNeedsFlexibility],
              ['I already have a basic emergency fund', hasEmergencyFund, setHasEmergencyFund],
            ].map(([label, checked, setter]) => (
              <label key={label} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => setter(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-7 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
            <p className="font-semibold">How to read this</p>
            <p className="mt-2">
              This tool is deliberately conservative. It prefers account fit, flexibility, and rule checks over trying to crown a universal winner.
            </p>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <SourceList
          title="Official account sources to verify"
          intro="Use these CRA references to confirm TFSA, RRSP, and FHSA rules before acting on any account-priority suggestion."
          sources={[tfsaOfficialSources[0], rrspOfficialSources[0], fhsaOfficialSources[0]]}
        />
      </section>

      <CalculatorCaseStudy
        title="Ontario resident earning $65,000 comparing the next $500/month"
        scenario="Assume a 32-year-old Ontario resident has emergency savings, some TFSA room, RRSP room, and no first-home purchase planned. The account decision is less about the largest annual limit and more about flexibility versus deduction value."
        inputs={[
          'Goal: flexible investing with retirement still in the background',
          'Income: $65,000 before tax',
          'Contribution habit tested: about $500/month',
          'FHSA: not relevant because no first-home goal is active',
        ]}
        result="The tool usually leans TFSA first or TFSA/RRSP split, then asks the user to run the TFSA and RRSP calculators with the same contribution amount."
        interpretation="At this income level, RRSP deductions can matter, but the TFSA may still be more practical if the money might be needed before retirement or if the refund would simply be spent."
        limitation="Actual CRA room, province, workplace pension adjustments, debt, and future tax rate can change the answer."
      />

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Decision logic</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Why this tool creates information gain</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Most account articles define TFSA, RRSP, and FHSA separately. This tool forces the accounts to compete for the same next dollar, then shows the tradeoff in plain language. That is the decision Canadians usually need before products, platforms, or ETFs matter.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
          {result.reasons.map((reason) => (
            <span key={reason} className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {reason}
            </span>
          ))}
          <Link to="/blog/tfsa-vs-rrsp-vs-fhsa-canada" className="rounded-full bg-primary px-4 py-2 text-white">
            Read the full account comparison
          </Link>
        </div>
      </section>
    </main>
  );
}
