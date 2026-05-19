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
import OfficialSourceNote from '../../components/OfficialSourceNote';
import DecisionFramework from '../../components/DecisionFramework';
import ResultInterpretation from '../../components/ResultInterpretation';
import WatchOutBox from '../../components/WatchOutBox';
import RelatedTools from '../../components/RelatedTools';
import NextStepLinks from '../../components/NextStepLinks';
import { CONTENT_LAST_REVIEWED } from '../../config/financial';
import { fhsaOfficialSources, rrspOfficialSources, tfsaOfficialSources } from '../../config/officialSources';

const CANONICAL = 'https://easyfinancetools.com/tools/account-decision-tool';

/* ------------------------------------------------------------------ */
/* Quiz definition                                                     */
/* ------------------------------------------------------------------ */

const QUESTIONS = [
  {
    key: 'resident',
    section: 'Step 1 of 13',
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
    section: 'Step 2 of 13',
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
    section: 'Step 3 of 13',
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
    section: 'Step 4 of 13',
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
    section: 'Step 5 of 13',
    title: 'Does your employer offer RRSP matching or a group retirement plan?',
    helper:
      'Employer matching is usually treated as priority money because the match can be a high-value benefit tied directly to your contribution.',
    options: [
      { value: 'yes', label: 'Yes, with a match' },
      { value: 'group', label: 'Group plan, no match' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    key: 'emergencyFund',
    section: 'Step 6 of 13',
    title: 'Do you already have emergency savings for unexpected expenses?',
    helper:
      'Before optimizing tax deductions, most households need enough flexible cash to handle a sudden bill, job disruption, car repair, or family expense without borrowing.',
    options: [
      { value: 'yes', label: 'Yes — I already have emergency savings' },
      { value: 'partial', label: 'Partially — I have some savings but not enough' },
      { value: 'no', label: 'No — I would struggle with a sudden expense' },
    ],
  },
  {
    key: 'income',
    section: 'Step 7 of 13',
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
    key: 'futureTax',
    section: 'Step 8 of 13',
    title: 'Do you expect your future tax bracket to be higher, lower, or similar?',
    helper:
      'RRSP value often depends on the gap between your tax rate when contributing and your tax rate when withdrawing. This is uncertain, so the tool treats it as a planning assumption, not a prediction.',
    options: [
      { value: 'higher', label: 'Higher later — my income may rise' },
      { value: 'similar', label: 'Similar to today' },
      { value: 'lower', label: 'Lower later — especially in retirement' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    key: 'goal',
    section: 'Step 9 of 13',
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
    key: 'refundPlan',
    section: 'Step 10 of 13',
    title: 'If an RRSP or FHSA contribution created a tax refund, what would you likely do with it?',
    helper:
      'A refund is not automatically a win. RRSP and FHSA deductions are stronger when the refund supports the plan instead of disappearing into regular spending.',
    options: [
      { value: 'reinvest', label: 'Reinvest it or contribute it again' },
      { value: 'debt', label: 'Use it for debt or emergency savings' },
      { value: 'spend', label: 'Probably spend most of it' },
      { value: 'unsure', label: 'Not sure yet' },
    ],
  },
  {
    key: 'timeline',
    section: 'Step 11 of 13',
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
    section: 'Step 12 of 13',
    title: 'Do you need easy access to the money?',
    helper:
      'TFSA withdrawals are flexible. RRSP withdrawals are generally taxable. FHSA withdrawals must be qualifying to remain tax-free.',
    options: [
      { value: 'yes', label: 'Yes, I may need it' },
      { value: 'maybe', label: 'Maybe, but probably not' },
      { value: 'no', label: 'No, it can stay invested' },
    ],
  },
  {
    key: 'confidence',
    section: 'Step 13 of 13',
    title: 'How confident are you managing investments yourself?',
    helper:
      'This does not change account rules, but it changes how much complexity is useful. Beginners usually benefit from simpler next steps and contribution-room reminders before tax optimization.',
    options: [
      { value: 'beginner', label: 'Beginner — I’m just starting' },
      { value: 'intermediate', label: 'Intermediate — I understand basic investing' },
      { value: 'advanced', label: 'Advanced — I already manage investments regularly' },
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
    badge: 'Built for first-home planning',
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

const FAQS = [
  {
    q: 'Should I use TFSA, RRSP, or FHSA first?',
    a: 'It depends on your goals, income, timeline, flexibility needs, emergency savings, and future tax assumptions. As a general framework, capture a valuable employer RRSP match first if one exists, then compare FHSA, TFSA, and RRSP room using eligibility, liquidity, and tax-bracket tradeoffs.',
  },
  {
    q: 'Is FHSA better than RRSP for a first home?',
    a: 'For most first-time buyers, the FHSA combines an RRSP-style tax deduction with TFSA-style tax-free qualifying withdrawals, which is a strong combination. It also does not need to be repaid like the RRSP Home Buyers\' Plan. However, the FHSA has lifetime and annual contribution limits, a 15-year participation window, and strict eligibility rules, so the Home Buyers\' Plan can still be useful in specific situations. This tool surfaces the framework — verify your personal details with CRA.',
  },
  {
    q: 'Should I take employer RRSP matching before TFSA?',
    a: 'In many cases yes. Contributing enough to capture a full employer RRSP match is usually treated as priority money because the match can be a high-value workplace benefit. After the match is captured, TFSA, FHSA, or additional RRSP room can be compared on their own merits.',
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

const ACCOUNT_WEIGHT_MODEL = {
  TFSA: {
    baseline: 18,
    rationale:
      'TFSA is the flexible baseline because withdrawals are generally tax-free and room is restored the following year.',
  },
  RRSP: {
    baseline: 10,
    rationale:
      'RRSP value depends on deduction usefulness today, expected withdrawal tax later, and whether the money can stay invested.',
  },
  FHSA: {
    baseline: 4,
    rationale:
      'FHSA becomes powerful when first-home eligibility, timeline, and contribution room line up.',
  },
};

function createWeightedAccounts() {
  return Object.entries(ACCOUNT_WEIGHT_MODEL).reduce((acc, [key, model]) => {
    acc[key] = {
      ...ACCOUNT_LIBRARY[key],
      score: model.baseline,
      rationale: model.rationale,
      why: [model.rationale],
      tradeoffs: [],
    };
    return acc;
  }, {});
}

function addWeight(accounts, key, weight, reason, tradeoff) {
  accounts[key].score += weight;
  if (reason) accounts[key].why.push(reason);
  if (tradeoff) accounts[key].tradeoffs.push(tradeoff);
}

function accountRationale(account) {
  const topReasons = account.why.slice(0, 3);
  return topReasons.join(' ');
}

function buildWeightedRecommendation(answers) {
  const accounts = createWeightedAccounts();
  const reasons = [];
  const risks = [];
  const nextSteps = [];

  const wantsFirstHome = answers.firstHomePlan === 'yes' || answers.firstHomePlan === 'maybe' || answers.goal === 'firstHome';
  const soonHome = answers.homeTimeline === '0to2' || answers.homeTimeline === '3to5';
  const longHome = answers.homeTimeline === '6plus';
  const shortTimeline = answers.timeline === 'under3';
  const longTimeline = answers.timeline === '10plus';
  const needsFlexibility = answers.access === 'yes' || answers.goal === 'flexibility';
  const partialEmergency = answers.emergencyFund === 'partial';
  const noEmergency = answers.emergencyFund === 'no';
  const emergencyIncomplete = partialEmergency || noEmergency;
  const higherIncome = answers.income === '90to130' || answers.income === '130plus';
  const lowerIncome = answers.income === 'under50';
  const retirementFocus = answers.goal === 'retirement';
  const taxFocus = answers.goal === 'taxCut';
  const beginner = answers.confidence === 'beginner';
  const advanced = answers.confidence === 'advanced';

  if (higherIncome) {
    addWeight(accounts, 'RRSP', 16, 'Your current income may make RRSP deductions more relevant.', 'RRSP deductions are more useful when today\'s marginal tax rate is meaningfully high.');
    addWeight(accounts, 'FHSA', 8, 'Higher income can also increase the value of an FHSA deduction if you are eligible.');
  }
  if (lowerIncome) {
    addWeight(accounts, 'TFSA', 12, 'Lower current income often makes TFSA flexibility more useful than chasing an RRSP deduction now.');
    addWeight(accounts, 'RRSP', -8, 'RRSP urgency is lower when the current deduction may be modest.');
  }
  if (answers.futureTax === 'higher') {
    addWeight(accounts, 'TFSA', 14, 'If your future tax bracket may be higher, using TFSA room now can preserve RRSP room for later.');
    addWeight(accounts, 'RRSP', -8, 'A higher expected future tax bracket can weaken the case for using RRSP room immediately.');
  } else if (answers.futureTax === 'lower') {
    addWeight(accounts, 'RRSP', 14, 'A lower expected retirement tax bracket can improve the RRSP tax-deferral tradeoff.');
  } else if (answers.futureTax === 'similar') {
    addWeight(accounts, 'TFSA', 5, 'If tax brackets may be similar, TFSA simplicity and flexibility deserve more weight.');
  }

  if (needsFlexibility) {
    addWeight(accounts, 'TFSA', 22, 'TFSA ranked higher because flexibility appears important for your situation.', 'TFSA withdrawals are generally simpler than RRSP withdrawals.');
    addWeight(accounts, 'RRSP', -8, 'RRSP ranked lower because taxable withdrawals make it weaker for flexible access.');
  }
  if (shortTimeline) {
    addWeight(accounts, 'TFSA', 12, 'A short timeline increases the value of liquidity and simple access.');
    addWeight(accounts, 'RRSP', -8, 'A short timeline reduces the usefulness of RRSP lock-in and tax deferral.');
    risks.push('A timeline under 3 years is sensitive to market volatility. Test cash-like or short-GIC assumptions before investing short-term money.');
  }
  if (longTimeline || retirementFocus) {
    addWeight(accounts, 'RRSP', 10, 'A longer retirement-focused timeline increases RRSP suitability.');
  }

  if (wantsFirstHome) {
    addWeight(accounts, 'FHSA', 32, 'FHSA ranked highly because you indicated a first-home goal.');
    if (soonHome) addWeight(accounts, 'FHSA', 10, 'A 0-5 year home timeline lines up with the FHSA planning purpose.');
    if (longHome) addWeight(accounts, 'FHSA', 5, 'A longer home timeline can still support opening an FHSA, but the 15-year clock matters.');
    if (answers.fhsaOpened === 'no') {
      nextSteps.push('If eligible, confirm whether opening an FHSA now makes sense so the 15-year participation window is started intentionally.');
    }
  } else {
    addWeight(accounts, 'FHSA', -18, 'FHSA ranked lower because you did not identify a clear first-home goal.');
  }

  if (noEmergency) {
    addWeight(accounts, 'TFSA', 28, 'No emergency savings strongly increases TFSA-style flexibility priority.');
    addWeight(accounts, 'RRSP', -18, 'RRSP ranked lower because emergency withdrawals from an RRSP are generally taxable.');
    addWeight(accounts, 'FHSA', -8, 'FHSA ranked lower for emergency access because tax-free withdrawals must be qualifying home withdrawals.');
    risks.push('Without emergency savings, liquidity should usually come before long-term account optimization.');
  } else if (partialEmergency) {
    addWeight(accounts, 'TFSA', 16, 'Partial emergency savings still makes flexibility more important than pure tax optimization.');
    addWeight(accounts, 'RRSP', -6, 'RRSP optimization is less convincing until emergency savings are stronger.');
  }

  if (taxFocus) {
    addWeight(accounts, 'RRSP', 10, 'RRSP relevance increased because you said tax reduction matters.');
    addWeight(accounts, 'FHSA', wantsFirstHome ? 8 : 2, 'FHSA relevance increased because eligible contributions can also create a deduction.');
  }
  if (answers.refundPlan === 'reinvest') {
    addWeight(accounts, 'RRSP', 8, 'RRSP confidence improves if a refund would be reinvested or contributed again.');
    addWeight(accounts, 'FHSA', 5, 'FHSA deduction value is more useful if the refund strengthens the plan.');
  } else if (answers.refundPlan === 'debt') {
    addWeight(accounts, 'RRSP', 3, 'Using a refund for debt or emergency savings can still support financial stability.');
    addWeight(accounts, 'TFSA', 3, 'Refund use for emergency savings reinforces the need for liquidity.');
  } else if (answers.refundPlan === 'spend') {
    addWeight(accounts, 'RRSP', -8, 'RRSP optimization confidence drops if the refund is likely to be spent rather than used intentionally.');
    risks.push('A refund is not automatically beneficial. If it is spent without improving savings, debt, or contribution room, the RRSP/FHSA deduction may be less useful than it appears.');
  } else if (answers.refundPlan === 'unsure') {
    addWeight(accounts, 'TFSA', 4, 'Unclear refund plans make simpler TFSA flexibility more attractive.');
    risks.push('If you use RRSP or FHSA deductions, decide ahead of time what the refund is meant to do.');
  }

  if (beginner) {
    addWeight(accounts, 'TFSA', 10, 'Beginner status increases the value of simple rules, flexibility, and contribution-room reminders.');
    addWeight(accounts, 'RRSP', -5, 'RRSP deduction timing and taxable withdrawals add complexity for beginners.');
  }
  if (advanced) {
    addWeight(accounts, 'RRSP', higherIncome || retirementFocus || taxFocus ? 5 : 0, 'Advanced confidence can support more detailed tax-bracket and deduction-timing analysis.');
  }

  if (answers.employerMatch === 'unsure') {
    risks.push('Employer matching is unknown. Ask HR, because a real match can change the account order before TFSA/RRSP/FHSA comparisons.');
  }
  if (answers.resident === 'no') {
    risks.push('You may not meet Canadian residency or age requirements. Verify eligibility with CRA before opening or contributing to registered accounts.');
  }

  const accountRank = Object.values(accounts).sort((a, b) => b.score - a.score);
  const ranked = answers.employerMatch === 'yes'
    ? [{
        ...ACCOUNT_LIBRARY.EMPLOYER_MATCH,
        rationale: 'Capture enough employer RRSP matching to avoid leaving a workplace benefit unused, then compare TFSA, FHSA, and RRSP room on their own merits.',
        why: ['Employer matching sits outside the normal account ranking because it can change the economics before tax optimization starts.'],
      }, ...accountRank]
    : accountRank;

  reasons.push(...accountRank.slice(0, 3).map((account, index) => (
    `${account.label} ranked #${index + 1}: ${account.why[account.why.length - 1]}`
  )));
  if (emergencyIncomplete) {
    reasons.push('Because emergency savings are incomplete, the model intentionally gives extra weight to liquidity and flexibility.');
  }
  if (beginner) {
    reasons.push('Because you are just starting, the educational path avoids aggressive optimization and starts with account rules, contribution room, and basic risk.');
  }

  risks.push('TFSA, RRSP, and FHSA limits, eligibility, and tax treatment can change year to year. Always confirm current CRA rules before contributing.');

  nextSteps.push('Verify TFSA, RRSP, and FHSA contribution room before moving money.');
  if (emergencyIncomplete) nextSteps.push('Review the emergency fund guide before making large registered-account contributions.');
  if (beginner) nextSteps.push('Use the beginner investing guide before selecting investments inside any account.');
  nextSteps.push('Run the linked calculators to test how much the account order changes the dollar outcome.');
  nextSteps.push('Consider speaking with a qualified Canadian financial planner or tax professional before making large or irreversible contributions.');

  return {
    ranked: ranked.slice(0, 4).map((account) => ({
      ...account,
      rationale: accountRationale(account),
    })),
    reasons: [...new Set(reasons)],
    risks: [...new Set(risks)],
    nextSteps: [...new Set(nextSteps)],
    changeTriggers: [
      'Income rises significantly or falls unexpectedly.',
      'Your expected retirement tax bracket changes.',
      'Your emergency fund improves or is depleted.',
      'Your home-buying timeline changes.',
      'Employer matching, pension details, or group-plan fees change.',
      'You decide to reinvest, save, or spend a refund differently than expected.',
      'CRA rules, contribution limits, or eligibility guidance changes.',
    ],
    guideLinks: [
      { title: 'TFSA Hub', href: '/topics/tfsa', body: 'Learn contribution room, withdrawals, mistakes, and when TFSA flexibility helps.' },
      { title: 'RRSP Hub', href: '/topics/rrsp', body: 'Compare deduction value, retirement planning, and withdrawal tradeoffs.' },
      { title: 'FHSA Hub', href: '/topics/fhsa', body: 'Check first-home eligibility, room, and qualifying withdrawal rules.' },
      { title: 'TFSA vs RRSP guide', href: '/blog/tfsa-vs-rrsp-canada-2026', body: 'Compare the two core Canadian accounts when FHSA is not the main issue.' },
      { title: 'Emergency fund guide', href: '/blog/emergency-fund-canada', body: 'Understand why liquid savings can matter before tax optimization.' },
      { title: 'Beginner investing guide', href: '/blog/how-to-invest-in-canada-beginners-2026', body: 'Review account basics, risk, and simple investing decisions before adding complexity.' },
      { title: 'Retirement planning hub', href: '/topics/retirement', body: 'Connect account choice with longer-term retirement income planning.' },
    ],
    beginnerMode: beginner,
    emergencyMode: emergencyIncomplete,
  };
}

function buildRecommendation(answers) {
  return buildWeightedRecommendation(answers);
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
            Answer 13 short questions to see an educational contribution-priority order across TFSA, RRSP, FHSA, and employer matching - built for Canadian residents in 2026.
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

        <OfficialSourceNote
          title="Source check before choosing an account"
          body="This framework uses CRA account rules as the reference point. Verify current TFSA, RRSP, and FHSA room and eligibility before contributing."
          sources={[tfsaOfficialSources[0], rrspOfficialSources[0], fhsaOfficialSources[0]]}
        />

        <div className="mb-8 mt-8">
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
                {isLastQuestion ? 'See account order' : 'Next question'}
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
      {/* Main result */}
      <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-amber-50 p-6 shadow-sm dark:border-emerald-700/50 dark:from-emerald-950/30 dark:to-amber-950/20 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
          Your likely account priority
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
        <h3 className="text-lg font-bold text-primary dark:text-accent">Why this ranking?</h3>
        <ul className="mt-4 space-y-3">
          {recommendation.reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-primary dark:text-accent">Why each account ranked where it did</h3>
        <div className="mt-4 space-y-3">
          {recommendation.ranked.map((account, index) => (
            <details
              key={`${account.key}-why`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60"
              open={index === 0}
            >
              <summary className="cursor-pointer text-sm font-bold text-primary dark:text-accent">
                Why {account.label} ranked #{index + 1}
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{account.rationale}</p>
              {account.tradeoffs?.length ? (
                <ul className="mt-3 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {account.tradeoffs.slice(0, 3).map((tradeoff) => (
                    <li key={tradeoff}>- {tradeoff}</li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                This ranking is conditional. It reflects your emergency-savings, income, timeline, home-buying, flexibility, and confidence answers; it is not a directive to contribute.
              </p>
            </details>
          ))}
        </div>
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

      {recommendation.beginnerMode || recommendation.emergencyMode ? (
        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-sm leading-6 text-blue-950 dark:border-blue-800/60 dark:bg-blue-950/30 dark:text-blue-100">
          <h3 className="text-base font-bold">Beginner-safe guardrail</h3>
          <p className="mt-2">
            Because your answers show either beginner confidence or an incomplete emergency fund, this result gives more weight to flexibility, liquidity, and learning. That means it intentionally avoids pushing dividend optimization, complex tax timing, or aggressive long-term assumptions before the basics are stable.
          </p>
        </div>
      ) : null}

      {/* Ranked contribution order */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-primary dark:text-accent">Your ranked contribution order</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Review the list from priority 1, then compare the next account before making a contribution decision.
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
        title="When your answer might change"
        intro="Account priority can shift when stability, tax, timeline, or eligibility assumptions change."
        items={[
          ...(recommendation.changeTriggers ?? []),
          ...recommendation.risks,
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

      <NextStepLinks
        title="Use the account order without over-reading it"
        intro="Treat the ranking as a planning sequence, then verify the exact rules and contribution room before moving money."
        links={recommendation.guideLinks ?? []}
        trackingContext="account_decision_next_steps"
      />

      {/* Usage guidance */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="flex items-center gap-2 text-lg font-bold text-primary dark:text-accent">
          <ClockIcon className="h-5 w-5" aria-hidden="true" />
          How to use this result
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
