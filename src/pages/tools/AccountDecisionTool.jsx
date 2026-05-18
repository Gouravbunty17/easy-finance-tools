import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ArrowRightIcon,
  HomeIcon,
  BanknotesIcon,
  ScaleIcon,
  ClockIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import ToolPageSchema from '../../components/ToolPageSchema';
import ToolByline from '../../components/ToolByline';
import EducationalDisclaimer from '../../components/EducationalDisclaimer';
import DecisionFramework from '../../components/DecisionFramework';
import ResultInterpretation from '../../components/ResultInterpretation';
import WatchOutBox from '../../components/WatchOutBox';
import RelatedTools from '../../components/RelatedTools';
import { CONTENT_LAST_REVIEWED } from '../../config/financial';

const CANONICAL = 'https://easyfinancetools.com/tools/account-decision-tool';

/* ------------------------------------------------------------------ */
/* Quiz definition                                                     */
/* ------------------------------------------------------------------ */

const QUESTIONS = [
  {
    key: 'resident',
    section: 'Step 1 of 9',
    title: 'Are you a Canadian resident age 18 or older?',
    helper:
      'TFSA, RRSP, and FHSA accounts are designed for Canadian residents. Most also require you to be at least the age of majority in your province (18 or 19).',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    key: 'firstHomePlan',
    section: 'Step 2 of 9',
    title: 'Are you planning to buy your first home in Canada?',
    helper:
      'FHSA eligibility hinges on being a qualifying first-time home buyer. Answer "Yes" only if a home purchase is genuinely on your radar.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'maybe', label: 'Maybe / not sure yet' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    key: 'homeTimeline',
    section: 'Step 3 of 9',
    title: 'If yes, when do you plan to buy?',
    helper:
      'Timing matters: FHSA contributions and investment growth need enough runway to grow but must still be ready when you buy.',
    skipIf: (answers) => answers.firstHomePlan === 'no',
    options: [
      { value: '0to2', label: '0 – 2 years' },
      { value: '3to5', label: '3 – 5 years' },
      { value: '6plus', label: '6+ years' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    key: 'fhsaOpened',
    section: 'Step 4 of 9',
    title: 'Do you already have an FHSA?',
    helper:
      'Opening an FHSA starts your 15-year participation clock. Knowing if you already have one changes the priority order.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    key: 'employerMatch',
    section: 'Step 5 of 9',
    title: 'Does your employer offer RRSP matching or a group retirement plan?',
    helper:
      'Employer matching is usually treated as priority money because the match is an immediate, near-guaranteed return on contribution.',
    options: [
      { value: 'yes', label: 'Yes, with a match' },
      { value: 'group', label: 'Group plan, no match' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    key: 'income',
    section: 'Step 6 of 9',
    title: 'What is your approximate annual income?',
    helper:
      'Higher marginal tax rates can make RRSP and FHSA deductions more valuable. Lower income years often favour TFSA flexibility.',
    options: [
      { value: 'under50', label: 'Under $50,000' },
      { value: '50to90', label: '$50,000 – $90,000' },
      { value: '90to130', label: '$90,000 – $130,000' },
      { value: '130plus', label: '$130,000+' },
    ],
  },
  {
    key: 'goal',
    section: 'Step 7 of 9',
    title: 'What is your main financial goal right now?',
    helper:
      'Each registered account is built around a different goal. Naming yours keeps the framework focused.',
    options: [
      { value: 'firstHome', label: 'First home' },
      { value: 'retirement', label: 'Retirement' },
      { value: 'flexibility', label: 'Flexibility / emergency access' },
      { value: 'taxCut', label: 'Tax reduction' },
    ],
  },
  {
    key: 'timeline',
    section: 'Step 8 of 9',
    title: 'What is your investment timeline?',
    helper:
      'A longer runway gives tax-sheltered growth more time to matter. A short runway raises the value of liquidity and capital preservation.',
    options: [
      { value: 'under3', label: 'Under 3 years' },
      { value: '3to10', label: '3 – 10 years' },
      { value: '10plus', label: '10+ years' },
    ],
  },
  {
    key: 'access',
    section: 'Step 9 of 9',
    title: 'Do you need easy access to the money?',
    helper:
      'TFSA withdrawals are flexible. RRSP withdrawals are generally taxable. FHSA withdrawals must be qualifying to remain tax-free.',
    options: [
      { value: 'yes', label: 'Yes, I may need it' },
      { value: 'maybe', label: 'Maybe, but probably not' },
      { value: 'no', label: 'No, it can stay invested' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Account metadata                                                    */
/* ------------------------------------------------------------------ */

const ACCOUNT_LIBRARY = {
  EMPLOYER_MATCH: {
    key: 'EMPLOYER_MATCH',
    label: 'Employer RRSP match',
    short: 'Capture the match first',
    icon: BuildingLibraryIcon,
    badge: 'Free money first',
    href: '/tools/rrsp-calculator',
  },
  FHSA: {
    key: 'FHSA',
    label: 'FHSA',
    short: 'First Home Savings Account',
    icon: HomeIcon,
    badge: 'Best of both worlds for first homes',
    href: '/tools/fhsa-calculator',
  },
  TFSA: {
    key: 'TFSA',
    label: 'TFSA',
    short: 'Tax-Free Savings Account',
    icon: BanknotesIcon,
    badge: 'Flexible & tax-free',
    href: '/tools/tfsa-calculator',
  },
  RRSP: {
    key: 'RRSP',
    label: 'RRSP',
    short: 'Registered Retirement Savings Plan',
    icon: ScaleIcon,
    badge: 'Retirement & tax deferral',
    href: '/tools/rrsp-calculator',
  },
};

const RELATED_CALCULATORS = [
  { href: '/tools/tfsa-calculator', label: 'TFSA Calculator' },
  { href: '/tools/rrsp-calculator', label: 'RRSP Calculator' },
  { href: '/tools/fhsa-calculator', label: 'FHSA Calculator' },
  { href: '/tools/compound-interest-calculator', label: 'Compound Interest Calculator' },
];

const FAQS = [
  {
    q: 'Should I use TFSA, RRSP, or FHSA first?',
    a: 'It depends on your goals, income, and timeline. As a general framework, capture any employer RRSP match first (the match is essentially free money), then consider an FHSA if a first-home purchase is realistic within the next five years, a TFSA if flexibility or a lower tax bracket make tax-free withdrawals more attractive, and an RRSP when a higher marginal tax rate today makes the deduction more valuable than tax-free withdrawals later.',
  },
  {
    q: 'Is FHSA better than RRSP for a first home?',
    a: 'For most first-time buyers, the FHSA combines an RRSP-style tax deduction with TFSA-style tax-free qualifying withdrawals, which is a strong combination. It also does not need to be repaid like the RRSP Home Buyers\' Plan. However, the FHSA has lifetime and annual contribution limits, a 15-year participation window, and strict eligibility rules, so the Home Buyers\' Plan can still be useful in specific situations. This tool surfaces the framework — verify your personal details with CRA.',
  },
  {
    q: 'Should I take employer RRSP matching before TFSA?',
    a: 'In most cases yes. Contributing enough to capture a full employer RRSP match is usually treated as priority money because the match is an immediate, near-guaranteed return on contribution. After the match is captured, TFSA, FHSA, or additional RRSP room can be compared on their own merits.',
  },
  {
    q: 'Is this tool financial advice?',
    a: 'No. This tool is for education only. It organizes account tradeoffs so you can have an informed conversation with a qualified Canadian financial professional. Nothing here is personal financial, tax, legal, or investment advice.',
  },
  {
    q: 'Are my answers stored?',
    a: 'No. Your answers are processed entirely in your browser. They are not sent to a server, not saved to a database, and not associated with you in any way. Refresh the page and the answers are gone.',
  },
];

/* ------------------------------------------------------------------ */
/* Result engine                                                       */
/* ------------------------------------------------------------------ */

function buildRecommendation(answers) {
  const ranked = [];
  const reasons = [];
  const risks = [];
  const nextSteps = [];

  const incomeTier = answers.income;
  const isHigherIncome = incomeTier === '90to130' || incomeTier === '130plus';
  const isLowerIncome = incomeTier === 'under50' || incomeTier === '50to90';
  const wantsFirstHome = answers.firstHomePlan === 'yes' || answers.firstHomePlan === 'maybe';
  const soonHome = answers.homeTimeline === '0to2' || answers.homeTimeline === '3to5';
  const longHorizon = answers.timeline === '10plus';
  const shortHorizon = answers.timeline === 'under3';
  const needsAccess = answers.access === 'yes';
  const taxFocused = answers.goal === 'taxCut';
  const retirementGoal = answers.goal === 'retirement';
  const flexibilityGoal = answers.goal === 'flexibility';
  const firstHomeGoal = answers.goal === 'firstHome';

  /* 1) Employer match always first if available */
  if (answers.employerMatch === 'yes') {
    ranked.push({
      ...ACCOUNT_LIBRARY.EMPLOYER_MATCH,
      rationale:
        'Capture the full employer RRSP match before anything else. An employer match is essentially an instant return that other accounts cannot replicate.',
    });
    nextSteps.push(
      'Confirm the exact contribution percentage required to receive the full employer match and set up payroll deductions to hit it.'
    );
  }

  /* 2) FHSA priority for realistic near-term first-home buyers */
  if (wantsFirstHome && (soonHome || answers.homeTimeline === '6plus' || firstHomeGoal)) {
    const strong = soonHome || firstHomeGoal;
    ranked.push({
      ...ACCOUNT_LIBRARY.FHSA,
      rationale: strong
        ? 'An FHSA can combine an RRSP-style tax deduction with a tax-free qualifying withdrawal for a first home — and unlike the Home Buyers\' Plan, the FHSA does not need to be repaid.'
        : 'Even on a longer horizon, opening an FHSA starts the 15-year participation clock and unlocks future contribution room.',
    });
    if (answers.fhsaOpened === 'no') {
      nextSteps.push('Open an FHSA with a Canadian institution to start your 15-year participation window even if you do not contribute the maximum this year.');
    } else {
      nextSteps.push('Confirm your remaining FHSA contribution room for the current year (annual cap of $8,000 and lifetime cap of $40,000).');
    }
    if (answers.homeTimeline === '0to2') {
      risks.push('A 0–2 year home timeline leaves little time for market growth — most planners hold short-horizon FHSA money in lower-risk investments like HISAs or GICs inside the FHSA.');
    }
  }

  /* 3) TFSA for flexibility / access / lower-mid income with no home goal */
  if (
    flexibilityGoal ||
    needsAccess ||
    (isLowerIncome && !firstHomeGoal && !retirementGoal) ||
    shortHorizon
  ) {
    ranked.push({
      ...ACCOUNT_LIBRARY.TFSA,
      rationale:
        'A TFSA gives tax-free growth with flexible, tax-free withdrawals at any time. That makes it well-suited when you may need access, when your income makes the RRSP deduction less powerful, or when you are still building an emergency buffer.',
    });
    nextSteps.push('Verify your TFSA contribution room in CRA "My Account" before depositing — overcontributions trigger a 1% per month penalty.');
  }

  /* 4) RRSP for higher income + retirement / tax-cut goal */
  if (
    isHigherIncome &&
    (retirementGoal || taxFocused || answers.employerMatch === 'yes' || longHorizon)
  ) {
    ranked.push({
      ...ACCOUNT_LIBRARY.RRSP,
      rationale:
        'At a higher marginal tax rate, an RRSP deduction reduces taxable income now, and your withdrawals are designed to happen in retirement when your tax bracket may be lower.',
    });
    nextSteps.push('Check your RRSP deduction limit in CRA "My Account" (Notice of Assessment) and consider whether to contribute and deduct in the same year or carry the deduction forward.');
  } else if (retirementGoal && !ranked.some((r) => r.key === 'RRSP')) {
    ranked.push({
      ...ACCOUNT_LIBRARY.RRSP,
      rationale:
        'Retirement is your stated goal, so an RRSP earns a place in the priority list — the deduction value depends on your marginal tax rate today versus in retirement.',
    });
  }

  /* Fill the rest of the ranking so the user always sees a complete order */
  const fillers = ['TFSA', 'FHSA', 'RRSP'];
  for (const key of fillers) {
    if (!ranked.some((r) => r.key === key)) {
      const filler = { ...ACCOUNT_LIBRARY[key] };
      if (key === 'TFSA') {
        filler.rationale = 'A TFSA still belongs in the picture as a flexible secondary bucket — tax-free growth and withdrawal-room recovery keep it useful for almost any goal.';
      } else if (key === 'FHSA') {
        filler.rationale = wantsFirstHome
          ? 'FHSA stays in the list because eligibility may apply later — opening one starts the 15-year clock even with a small deposit.'
          : 'If a first-home purchase is unlikely, the FHSA may not apply to you — but it is included for completeness in case your plans change.';
      } else if (key === 'RRSP') {
        filler.rationale = isLowerIncome
          ? 'At a lower current income, RRSP deductions are less powerful, but RRSP space can still be valuable in higher-earning years later.'
          : 'RRSP space is worth tracking even when it is not the top priority — your future marginal tax rate may make it more valuable.';
      }
      ranked.push(filler);
    }
  }

  /* Build main reasoning summary */
  if (answers.employerMatch === 'yes') {
    reasons.push('You have access to an employer RRSP match, so capturing the match should generally come before any other account.');
  }
  if (wantsFirstHome && soonHome) {
    reasons.push('A first-home goal within the next five years lines up well with the FHSA, which is purpose-built for this exact situation.');
  } else if (wantsFirstHome) {
    reasons.push('Even on a longer home-buying horizon, opening an FHSA may be worth considering to start the 15-year participation window.');
  }
  if (isHigherIncome && (retirementGoal || taxFocused)) {
    reasons.push('Your income level and retirement / tax-reduction goal make the RRSP deduction more financially meaningful.');
  }
  if (flexibilityGoal || needsAccess) {
    reasons.push('Because you may need access to this money, a TFSA — where withdrawals are tax-free and contribution room is restored the next year — is highly relevant.');
  }
  if (isLowerIncome && !firstHomeGoal && !retirementGoal) {
    reasons.push('At your current income level and goal, TFSA flexibility usually outranks RRSP deductions, since deductions are less valuable in lower tax brackets.');
  }

  if (!reasons.length) {
    reasons.push('Based on your answers, the framework points to using a flexible default order while you confirm contribution room and eligibility with CRA.');
  }

  /* Risks / warnings */
  if (answers.resident === 'no') {
    risks.push('You indicated you may not be a Canadian resident age 18+. TFSA, RRSP, and FHSA accounts have residency and age requirements — verify eligibility with CRA before contributing.');
  }
  if (shortHorizon) {
    risks.push('A timeline under 3 years generally means market-based investing is too risky — favour HISA or short GIC holdings inside the chosen account.');
  }
  if (answers.employerMatch === 'unsure') {
    risks.push('You were unsure about employer matching — ask HR. A missed match can be the costliest mistake on this list.');
  }
  if (answers.fhsaOpened === 'no' && wantsFirstHome) {
    risks.push('Without an FHSA opened, you do not yet have a contribution clock running — even a $0 account starts your 15-year participation window.');
  }
  if (isHigherIncome && answers.goal === 'flexibility') {
    risks.push('At a higher tax bracket, choosing TFSA-only over RRSP may leave significant tax savings on the table — weigh flexibility vs. deferred tax carefully.');
  }
  if (answers.timeline === '10plus' && needsAccess) {
    risks.push('You said you have a long timeline but may need access — these can conflict. Consider splitting between an emergency buffer (TFSA / HISA) and longer-term growth.');
  }

  /* Always-on risk: rules and limits */
  risks.push('TFSA, RRSP, and FHSA limits, eligibility, and tax treatment can change year to year — always confirm current rules with CRA before contributing.');

  /* Always-on next steps */
  nextSteps.push('Run the numbers in the linked TFSA, RRSP, FHSA, and compound interest calculators to test the dollar impact for your situation.');
  nextSteps.push('Consider speaking with a qualified Canadian financial planner or tax professional before making large or irreversible contributions.');

  return {
    ranked: ranked.slice(0, 4),
    reasons,
    risks,
    nextSteps,
  };
}

/* ------------------------------------------------------------------ */
/* UI helpers                                                          */
/* ------------------------------------------------------------------ */

function getVisibleQuestions(answers) {
  return QUESTIONS.filter((q) => !q.skipIf || !q.skipIf(answers));
}

function OptionButton({ selected, children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-secondary/60 ${
        selected
          ? 'border-primary bg-primary text-white shadow-sm dark:border-accent dark:bg-accent dark:text-primary'
          : 'border-slate-200 bg-white text-slate-700 hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-accent'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {children}
    </button>
  );
}

function ProgressBar({ current, total }) {
  const percent = Math.round(((current + 1) / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>
          Question {current + 1} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Quiz progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AccountDecisionTool() {
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const currentQuestion = visibleQuestions[stepIndex] ?? visibleQuestions[visibleQuestions.length - 1];
  const isLastQuestion = stepIndex >= visibleQuestions.length - 1;
  const currentAnswer = currentQuestion ? answers[currentQuestion.key] : undefined;
  const ineligible = answers.resident === 'no';

  const recommendation = useMemo(() => (showResult ? buildRecommendation(answers) : null), [showResult, answers]);

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (ineligible) {
      setShowResult(true);
      return;
    }
    if (isLastQuestion) {
      setShowResult(true);
      return;
    }
    setStepIndex((idx) => Math.min(idx + 1, visibleQuestions.length - 1));
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    setStepIndex((idx) => Math.max(0, idx - 1));
  };

  const handleRestart = () => {
    setAnswers({});
    setStepIndex(0);
    setShowResult(false);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TFSA vs RRSP vs FHSA Decision Tool',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description:
      'Educational Canadian quiz that compares TFSA, RRSP, and FHSA contribution priorities based on your goals, income, and timeline.',
    url: CANONICAL,
    isAccessibleForFree: true,
    about: ['TFSA', 'RRSP', 'FHSA', 'Canadian financial planning'],
  };

  return (
    <main className="overflow-x-hidden bg-white text-slate-900 dark:bg-gray-950 dark:text-white">
      <SEO
        title="TFSA vs RRSP vs FHSA Decision Tool Canada 2026 | Easy Finance Tools"
        description="Answer a few questions to compare TFSA, RRSP, and FHSA contribution priorities for Canadian investors in 2026. Educational tool only."
        canonical={CANONICAL}
        schema={schema}
      />
      <ToolPageSchema
        name="TFSA vs RRSP vs FHSA Decision Tool"
        description="Educational Canadian quiz that compares TFSA, RRSP, and FHSA contribution priorities based on goals, income, employer matching, and timeline."
        canonical={CANONICAL}
        category="FinanceApplication"
      />

      {/* ---------------- Hero ---------------- */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:border-slate-800 dark:from-emerald-950/20 dark:via-gray-950 dark:to-amber-950/10">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-900/40 dark:text-emerald-200">
            <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Canadian account decision tool — 2026
          </div>
          <h1 className="mt-4 text-3xl font-bold text-primary dark:text-accent sm:text-4xl md:text-5xl">
            TFSA vs RRSP vs FHSA: which account should I prioritize first?
          </h1>
          <ToolByline
            lastUpdated={CONTENT_LAST_REVIEWED}
            reviewer="Reviewed against Canadian account rules"
            trustNote="This tool is for educational planning only and does not recommend products or investments."
          />
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
            Answer 9 short questions to see a personalized contribution-priority order across TFSA, RRSP, FHSA, and employer matching — built for Canadian residents in 2026.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold dark:border-slate-700 dark:bg-slate-900">
              <LockClosedIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Answers stay in your browser
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold dark:border-slate-700 dark:bg-slate-900">
              No sign-up
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold dark:border-slate-700 dark:bg-slate-900">
              Educational, not advice
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* ---------------- Privacy + disclaimer ---------------- */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-100">
            <p className="flex items-center gap-2 font-bold">
              <LockClosedIcon className="h-4 w-4" aria-hidden="true" />
              Your privacy
            </p>
            <p className="mt-1">
              Your answers are processed in your browser and are not stored. Nothing is sent to a server, saved to a database, or tied to your identity.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="flex items-center gap-2 font-bold">
              <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
              Educational, not financial advice
            </p>
            <p className="mt-1">
              Based on your answers, this framework may help you compare TFSA, RRSP, and FHSA priorities — but it is educational, not financial advice. Always verify with CRA and a qualified professional.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <DecisionFramework
            eyebrow="How to read this tool"
            title="This is a decision framework, not a product recommendation"
            intro="The tool organizes the tradeoff, the Canadian account rules, the warning signs, and the next calculator to open. It does not decide what investment to buy."
            compact
          />
        </div>

        {/* ---------------- Quiz / Result ---------------- */}
        {!showResult ? (
          <section
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
            aria-labelledby="quiz-heading"
          >
            <ProgressBar current={stepIndex} total={visibleQuestions.length} />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">
              {currentQuestion.section}
            </p>
            <h2 id="quiz-heading" className="mt-2 text-2xl font-bold text-primary dark:text-accent sm:text-3xl">
              {currentQuestion.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{currentQuestion.helper}</p>

            <fieldset className="mt-6">
              <legend className="sr-only">{currentQuestion.title}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={currentAnswer === option.value}
                    onClick={() => handleAnswer(currentQuestion.key, option.value)}
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </div>
            </fieldset>

            {/* Eligibility warning */}
            {currentQuestion.key === 'resident' && answers.resident === 'no' ? (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-100">
                <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <p>
                  TFSA, RRSP, and FHSA accounts have Canadian residency and age requirements. You can still continue to learn how the accounts compare — but verify eligibility with CRA before opening one.
                </p>
              </div>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  aria-label="Go to previous question"
                >
                  <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  aria-label="Restart the quiz"
                >
                  <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                  Restart
                </button>
              </div>
              <button
                type="button"
                onClick={handleNext}
                disabled={!currentAnswer}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400"
              >
                {isLastQuestion ? 'See my recommendation' : 'Next question'}
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </section>
        ) : (
          <ResultCard
            recommendation={recommendation}
            answers={answers}
            ineligible={ineligible}
            onRestart={handleRestart}
            onBack={handleBack}
          />
        )}

        {/* ---------------- Related calculators ---------------- */}
        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <h2 className="text-xl font-bold text-primary dark:text-accent">Related Canadian calculators</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Use a calculator to test the dollar impact of any account in your ranking.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {RELATED_CALCULATORS.map((calc) => (
              <Link
                key={calc.href}
                to={calc.href}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:border-emerald-400 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-accent dark:hover:border-emerald-400"
              >
                <span>{calc.label}</span>
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        {/* ---------------- Full educational disclaimer ---------------- */}
        <div className="mt-10">
          <EducationalDisclaimer />
        </div>

        {/* ---------------- FAQ ---------------- */}
        <FAQ items={FAQS} />
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Result card                                                         */
/* ------------------------------------------------------------------ */

function ResultCard({ recommendation, answers, ineligible, onRestart, onBack }) {
  if (!recommendation) return null;
  const lead = recommendation.ranked[0];
  const LeadIcon = lead.icon;

  return (
    <section className="space-y-6" aria-labelledby="result-heading">
      {/* Main recommendation */}
      <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-amber-50 p-6 shadow-sm dark:border-emerald-700/50 dark:from-emerald-950/30 dark:to-amber-950/20 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
          Your top priority
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white dark:bg-emerald-500">
            <LeadIcon className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 id="result-heading" className="text-2xl font-bold text-primary dark:text-accent sm:text-3xl">
            {lead.label}
          </h2>
          <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            {lead.badge}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">{lead.rationale}</p>
        <p className="mt-4 text-xs italic leading-6 text-slate-500 dark:text-slate-400">
          Based on your answers, this framework may help you compare account priorities. It is educational, not personal financial advice.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {lead.href ? (
            <Link
              to={lead.href}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              Open the {lead.label} calculator
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Edit answers
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
            Start over
          </button>
        </div>
      </div>

      {/* Ineligibility note */}
      {ineligible ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-100">
          <p className="font-bold">Heads up — eligibility check</p>
          <p className="mt-1">
            You indicated you may not be a Canadian resident age 18+. TFSA, RRSP, and FHSA accounts have residency and age requirements. The ranking below is shown so you can learn how the accounts compare, but eligibility must be verified with CRA before opening or contributing to any of them.
          </p>
        </div>
      ) : null}

      {/* Why this fits */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-primary dark:text-accent">Why this account likely fits</h3>
        <ul className="mt-4 space-y-3">
          {recommendation.reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <ResultInterpretation
        title="Decision read: why the top account changed"
        summary={`The framework currently puts ${lead.label} first because your answers made its tradeoff stronger than the other account options. This is a planning order, not a product recommendation.`}
        points={[
          {
            title: 'Tax tradeoff',
            body: 'RRSP and FHSA value rises when current marginal tax rate and deduction usefulness are high.',
          },
          {
            title: 'Flexibility tradeoff',
            body: 'TFSA value rises when liquidity, uncertain timelines, or lower current income matter more than deduction value.',
          },
          {
            title: 'Timeline tradeoff',
            body: 'FHSA value rises when first-home eligibility and a realistic purchase timeline line up.',
          },
        ]}
      />

      {/* Ranked contribution order */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-primary dark:text-accent">Your ranked contribution order</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Work down the list from priority 1 — fund the higher-priority account first before moving to the next one.
        </p>
        <ol className="mt-5 space-y-3">
          {recommendation.ranked.map((account, index) => {
            const Icon = account.icon;
            return (
              <li
                key={account.key}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition dark:border-slate-700 dark:bg-slate-800/60 sm:flex-row sm:items-start"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0
                        ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <Icon className="h-5 w-5 text-secondary dark:text-emerald-300" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-bold text-primary dark:text-accent">{account.label}</p>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{account.short}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{account.rationale}</p>
                  {account.href ? (
                    <Link
                      to={account.href}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
                    >
                      Open calculator

                      <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <WatchOutBox
        title="What can change this account order"
        intro="Account priority can shift when the tax, timeline, or eligibility assumptions change."
        items={[
          ...recommendation.risks,
          'Income changes can alter the value of an RRSP or FHSA deduction.',
          'Province changes can alter marginal tax-rate context and retirement planning assumptions.',
          'Employer pension or matching details can make RRSP contributions more important than this tool can fully model.',
          'Contribution-room history, withdrawal timing, and future tax-rule updates can change the clean ranking.',
        ]}
      />

      <RelatedTools
        title="Test the account order with calculators"
        tools={[
          {
            title: 'TFSA Calculator',
            href: '/tools/tfsa-calculator',
            body: 'Check contribution room, withdrawal timing, and flexible investing tradeoffs.',
          },
          {
            title: 'RRSP Calculator',
            href: '/tools/rrsp-calculator',
            body: 'Estimate whether the deduction and retirement tax tradeoff are meaningful.',
          },
          {
            title: 'FHSA Calculator',
            href: '/tools/fhsa-calculator',
            body: 'Test first-home timing, contribution limits, and qualifying withdrawal assumptions.',
          },
        ]}
        trackingContext="account_decision_result"
      />

      {/* Next steps */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="flex items-center gap-2 text-lg font-bold text-primary dark:text-accent">
          <ClockIcon className="h-5 w-5" aria-hidden="true" />
          Your next steps
        </h3>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
          {recommendation.nextSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white dark:bg-emerald-500"
              >
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
