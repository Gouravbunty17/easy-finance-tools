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
import { CONTENT_LAST_REVIEWED } from '../../config/financial';

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
    };
  }, [firstHomeEligible, goal, hasEmergencyFund, income, needsFlexibility, timeframe]);

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
