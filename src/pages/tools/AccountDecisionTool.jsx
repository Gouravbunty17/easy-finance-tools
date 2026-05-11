import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import ToolPageSchema from '../../components/ToolPageSchema';
import ToolByline from '../../components/ToolByline';
import EducationalDisclaimer from '../../components/EducationalDisclaimer';
import NextStepLinks from '../../components/NextStepLinks';
import SourceList from '../../components/SourceList';
import InlineSourceTrust from '../../components/InlineSourceTrust';
import OfficialSourceNote from '../../components/OfficialSourceNote';
import { StressTestYourInputs, WhenThisToolIsWeakest, WhyThisToolExists } from '../../components/ToolTrustBlocks';
import { CONTENT_LAST_REVIEWED } from '../../config/financial';
import {
  dividendTaxOfficialSources,
  fhsaOfficialSources,
  mortgageOfficialSources,
  retirementOfficialSources,
  rrspOfficialSources,
  taxOfficialSources,
  tfsaOfficialSources,
} from '../../config/officialSources';

const CANONICAL = 'https://easyfinancetools.com/tools/account-decision-tool';

const QUESTIONS = [
  {
    key: 'goal',
    section: 'Primary financial goal',
    title: 'What is the main job for the next dollar?',
    helper: 'This keeps the tool focused on the purpose of the money instead of treating every registered account as interchangeable.',
    why: 'A first-home goal can make FHSA relevant. Retirement can strengthen RRSP analysis. Flexibility and income goals often make TFSA tradeoffs more visible.',
    options: [
      { value: 'firstHome', label: 'First home' },
      { value: 'retirement', label: 'Retirement' },
      { value: 'flexibility', label: 'Flexible investing' },
      { value: 'income', label: 'Passive or dividend income' },
      { value: 'beginner', label: 'I am still learning' },
    ],
  },
  {
    key: 'timeline',
    section: 'Timeline',
    title: 'When might this money be needed?',
    helper: 'The shorter the timeline, the more liquidity and capital preservation matter.',
    why: 'Short timelines can weaken long-term investment assumptions. Long timelines give tax-sheltered growth more time to matter.',
    options: [
      { value: 'under3', label: 'Within 3 years' },
      { value: '3to7', label: '3 to 7 years' },
      { value: '7plus', label: '7+ years' },
      { value: 'unknown', label: 'Not sure yet' },
    ],
  },
  {
    key: 'incomeRange',
    section: 'Income range',
    title: 'What income range best describes the current year?',
    helper: 'A range is enough here. This tool is not calculating a precise tax refund.',
    why: 'RRSP deduction value depends on today tax rate compared with later withdrawal tax rate. A higher income year can make the deduction more meaningful.',
    options: [
      { value: 'under50', label: 'Under $50,000' },
      { value: '50to90', label: '$50,000 to $90,000' },
      { value: '90to140', label: '$90,000 to $140,000' },
      { value: '140plus', label: '$140,000+' },
    ],
  },
  {
    key: 'province',
    section: 'Province',
    title: 'Which province should frame the tax context?',
    helper: 'Province matters because combined federal and provincial tax rates are not identical across Canada.',
    why: 'This page stays directional, but province can change how valuable an RRSP deduction looks in a specific year.',
    options: [
      { value: 'ON', label: 'Ontario' },
      { value: 'BC', label: 'British Columbia' },
      { value: 'AB', label: 'Alberta' },
      { value: 'QC', label: 'Quebec' },
      { value: 'Other', label: 'Other province or territory' },
    ],
  },
  {
    key: 'firstHome',
    section: 'First-home status',
    title: 'Is a first home a realistic goal and are you likely FHSA-eligible?',
    helper: 'FHSA is powerful only when the eligibility and home-purchase conditions fit.',
    why: 'FHSA can combine a deduction with a qualifying tax-free withdrawal, but eligibility and timing are real constraints.',
    options: [
      { value: 'eligibleSoon', label: 'Likely eligible and planning a first home' },
      { value: 'maybe', label: 'Maybe, but not confirmed' },
      { value: 'notEligible', label: 'Probably not eligible or not buying' },
    ],
  },
  {
    key: 'pension',
    section: 'Employer pension status',
    title: 'Do you already have a workplace pension or employer retirement plan?',
    helper: 'A pension does not remove the need to save, but it can change the RRSP room and retirement-tax picture.',
    why: 'Pension adjustments, employer matching, and future retirement income can affect how RRSP contributions compare with TFSA contributions.',
    options: [
      { value: 'none', label: 'No workplace pension' },
      { value: 'match', label: 'Employer match or group plan' },
      { value: 'definedBenefit', label: 'Defined benefit pension' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    key: 'emergencyFund',
    section: 'Emergency fund readiness',
    title: 'Do you have basic emergency cash outside long-term investments?',
    helper: 'Account optimization is less useful if a surprise bill would force debt or withdrawals.',
    why: 'A missing emergency buffer can make TFSA liquidity or plain cash more important than chasing tax optimization.',
    options: [
      { value: 'ready', label: 'Yes, a basic buffer exists' },
      { value: 'partial', label: 'Some, but not enough' },
      { value: 'none', label: 'Not yet' },
    ],
  },
  {
    key: 'flexibility',
    section: 'Flexibility preference',
    title: 'How important is easy access to the money?',
    helper: 'Flexibility is not a side detail. It can be the deciding factor when the plan is uncertain.',
    why: 'TFSA withdrawals are generally more flexible than RRSP withdrawals. FHSA access depends on qualifying first-home rules.',
    options: [
      { value: 'high', label: 'Very important' },
      { value: 'medium', label: 'Somewhat important' },
      { value: 'low', label: 'Less important' },
    ],
  },
  {
    key: 'taxReduction',
    section: 'Tax reduction importance',
    title: 'How important is reducing taxable income this year?',
    helper: 'This does not mean the RRSP is automatically stronger. It only shows whether the deduction deserves more attention.',
    why: 'RRSP and FHSA contributions may create deductions. TFSA contributions do not, but TFSA withdrawals are generally tax-free.',
    options: [
      { value: 'high', label: 'Very important this year' },
      { value: 'medium', label: 'Helpful, but not the only goal' },
      { value: 'low', label: 'Not a major factor' },
    ],
  },
  {
    key: 'retirementPriority',
    section: 'Long-term retirement priority',
    title: 'How central is retirement planning to this decision?',
    helper: 'A retirement-first decision can justify less flexibility if the tax tradeoff is clear.',
    why: 'RRSPs are built around retirement deferral. TFSAs can still support retirement, but without the upfront deduction.',
    options: [
      { value: 'high', label: 'Very central' },
      { value: 'medium', label: 'One goal among others' },
      { value: 'low', label: 'Not the main reason' },
    ],
  },
];

const DEFAULT_ANSWERS = {
  goal: 'firstHome',
  timeline: '3to7',
  incomeRange: '50to90',
  province: 'ON',
  firstHome: 'eligibleSoon',
  pension: 'none',
  emergencyFund: 'partial',
  flexibility: 'medium',
  taxReduction: 'medium',
  retirementPriority: 'medium',
};

const FAQS = [
  {
    q: 'Does this tool recommend a TFSA, RRSP, or FHSA?',
    a: 'No. It organizes account tradeoffs for education. It does not recommend products, investments, or a final contribution decision.',
  },
  {
    q: 'Why can the account result change when income changes?',
    a: 'RRSP and FHSA deductions depend on taxable income. A higher or lower income year can change how valuable a deduction appears compared with TFSA flexibility.',
  },
  {
    q: 'Why is FHSA not always first for a home buyer?',
    a: 'FHSA can be useful for eligible first-home buyers, but timing, eligibility, room, investment risk, and the possibility of not buying still matter.',
  },
  {
    q: 'Should I verify contribution room before acting?',
    a: 'Yes. Always check CRA records and account rules before contributing. This page is a planning framework, not a room confirmation tool.',
  },
];

const ACCOUNT_CARDS = [
  {
    key: 'TFSA',
    title: 'TFSA',
    subtitle: 'Flexible tax-sheltered account',
    useful: ['Flexibility matters', 'Withdrawals may be needed before retirement', 'Current income makes RRSP deduction less compelling'],
    lessUseful: ['Upfront tax deduction is the main objective', 'TFSA room is already used', 'Frequent withdrawals would disrupt the plan'],
    points: ['Tax-free withdrawals', 'Room can return after withdrawals', 'No upfront deduction'],
  },
  {
    key: 'RRSP',
    title: 'RRSP',
    subtitle: 'Retirement-focused deduction account',
    useful: ['Current income is relatively high', 'Retirement is the main goal', 'Refund will be used intentionally'],
    lessUseful: ['Money may be needed soon', 'Future tax rate may be similar or higher', 'Emergency savings are missing'],
    points: ['Deduction can matter', 'Withdrawals are taxable', 'Pension and future income affect the analysis'],
  },
  {
    key: 'FHSA',
    title: 'FHSA',
    subtitle: 'First-home account for eligible buyers',
    useful: ['First-home goal is realistic', 'Eligibility appears clear', 'Timeframe allows thoughtful use of room'],
    lessUseful: ['Not eligible', 'Home purchase is not likely', 'Money is needed for a non-qualifying purpose'],
    points: ['Deduction plus qualifying tax-free withdrawal', 'Eligibility limitations', 'Room rules need CRA verification'],
  },
];

const LEARNING_PATHS = {
  beginner: [
    { title: 'How to start investing in Canada', href: '/blog/how-to-start-investing-canada-2026' },
    { title: 'TFSA contribution room', href: '/blog/tfsa-contribution-room-canada-2026' },
    { title: 'How to use the FHSA', href: '/blog/how-to-use-fhsa-canada' },
  ],
  retirement: [
    { title: 'RRSP deadline and deduction guide', href: '/blog/rrsp-deadline-canada-2026' },
    { title: 'CPP and OAS estimator', href: '/tools/cpp-oas-estimator' },
    { title: 'FIRE calculator', href: '/tools/fire-calculator' },
  ],
  income: [
    { title: 'TFSA passive income strategy', href: '/blog/tfsa-passive-income-canada-2026' },
    { title: 'Dividend reinvestment plans', href: '/blog/drip-strategy-canada' },
    { title: 'Dividend calculator', href: '/tools/dividend-calculator' },
  ],
  home: [
    { title: 'FHSA calculator', href: '/tools/fhsa-calculator' },
    { title: 'FHSA vs RRSP for a down payment', href: '/blog/fhsa-vs-rrsp-down-payment-canada-2026' },
    { title: 'Mortgage affordability calculator', href: '/tools/mortgage-affordability-calculator' },
  ],
};

function OptionButton({ selected, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
        selected
          ? 'border-primary bg-primary text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function ScoreBar({ label, score, reasons }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-primary dark:text-accent">{label}</h3>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{score}/100</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-secondary" style={{ width: `${score}%` }} />
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {reasons.slice(0, 3).map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </div>
  );
}

function buildTradeoffs(answers) {
  const score = { TFSA: 45, RRSP: 42, FHSA: 20 };
  const favors = { TFSA: [], RRSP: [], FHSA: [] };
  const cautions = [];
  const assumptions = [];
  const changes = [
    'Income changes can alter RRSP deduction value and future withdrawal comparisons.',
    'A province move can change combined tax rates and refund estimates.',
    'Withdrawal timing can make flexibility more valuable than tax optimization.',
    'A home purchase timeline can strengthen or weaken FHSA usefulness.',
    'Pension changes can affect RRSP room and retirement-income assumptions.',
    'Contribution room history can override a simplified account-priority framework.',
    'Tax-law updates can change limits, eligibility, deductions, or stress-test assumptions.',
  ];

  if (answers.goal === 'firstHome') {
    assumptions.push('A first-home goal is being treated as relevant, but eligibility still needs confirmation.');
    if (answers.firstHome === 'eligibleSoon') {
      score.FHSA += 42;
      favors.FHSA.push('First-home goal and likely eligibility give FHSA a clear role to examine.');
      favors.FHSA.push('FHSA can combine a deduction with a qualifying tax-free withdrawal.');
    } else if (answers.firstHome === 'maybe') {
      score.FHSA += 18;
      favors.FHSA.push('FHSA deserves a rules check before being dismissed.');
      cautions.push('FHSA eligibility is uncertain, so this result should not be treated as a green light.');
    } else {
      cautions.push('FHSA may not be available if the first-home conditions are not met.');
    }
  }

  if (answers.goal === 'retirement' || answers.retirementPriority === 'high') {
    score.RRSP += 22;
    favors.RRSP.push('Retirement is central enough that tax deferral deserves attention.');
  }

  if (answers.goal === 'income' || answers.goal === 'flexibility' || answers.flexibility === 'high') {
    score.TFSA += 20;
    favors.TFSA.push('Flexibility and tax-free withdrawals are important in this scenario.');
  }

  if (answers.goal === 'beginner') {
    score.TFSA += 12;
    favors.TFSA.push('A simpler, flexible account comparison may be easier to learn from first.');
    assumptions.push('The beginner path prioritizes learning and reversibility over maximum tax optimization.');
  }

  if (answers.timeline === 'under3' || answers.timeline === 'unknown') {
    score.TFSA += 18;
    score.RRSP -= 8;
    favors.TFSA.push('Short or uncertain timing increases the value of liquidity.');
    cautions.push('Short timelines can make market-risk assumptions weaker, regardless of account type.');
  }

  if (answers.timeline === '7plus') {
    score.RRSP += 10;
    score.TFSA += 8;
    favors.RRSP.push('A longer timeline gives tax deferral more room to matter.');
    favors.TFSA.push('A longer timeline also gives tax-free growth more time to compound.');
  }

  if (answers.incomeRange === '90to140' || answers.incomeRange === '140plus') {
    score.RRSP += answers.incomeRange === '140plus' ? 28 : 18;
    favors.RRSP.push('Higher current income can make an RRSP deduction more meaningful.');
    assumptions.push('This assumes current income may be higher than income when withdrawals happen.');
  }

  if (answers.incomeRange === 'under50') {
    score.TFSA += 16;
    score.RRSP -= 8;
    favors.TFSA.push('Lower current income can reduce the immediate value of an RRSP deduction.');
  }

  if (answers.taxReduction === 'high') {
    score.RRSP += 14;
    score.FHSA += answers.firstHome === 'eligibleSoon' ? 10 : 0;
    favors.RRSP.push('Reducing taxable income this year is an explicit priority.');
    if (answers.firstHome === 'eligibleSoon') favors.FHSA.push('Tax reduction also supports checking FHSA room before choosing between accounts.');
  }

  if (answers.emergencyFund === 'none' || answers.emergencyFund === 'partial') {
    score.TFSA += answers.emergencyFund === 'none' ? 14 : 8;
    score.RRSP -= answers.emergencyFund === 'none' ? 12 : 4;
    cautions.push('A basic emergency buffer may matter more than maximizing registered-account optimization.');
    favors.TFSA.push('Liquidity may matter while emergency savings are incomplete.');
  }

  if (answers.pension === 'definedBenefit') {
    score.RRSP -= 6;
    score.TFSA += 8;
    cautions.push('A defined benefit pension can change future retirement-income and RRSP withdrawal assumptions.');
  }

  if (answers.pension === 'match') {
    score.RRSP += 8;
    favors.RRSP.push('Employer matching or group-plan benefits should usually be checked before ignoring retirement contributions.');
  }

  if (answers.flexibility === 'low') {
    score.RRSP += 8;
    favors.RRSP.push('Lower need for access can make retirement-focused accounts easier to consider.');
  }

  if (answers.province === 'QC') {
    assumptions.push('Quebec has distinct provincial tax administration, so province-specific tax verification matters.');
  } else {
    assumptions.push('Province affects combined tax rates; this page keeps the tax treatment directional.');
  }

  const normalizedScores = Object.fromEntries(
    Object.entries(score).map(([key, value]) => [key, Math.max(10, Math.min(95, value))])
  );
  const sorted = Object.entries(normalizedScores).sort((a, b) => b[1] - a[1]);
  const lead = sorted[0][0];

  return {
    lead,
    sorted,
    scores: normalizedScores,
    favors,
    cautions,
    assumptions,
    changes,
  };
}

function buildNextSteps(answers, tradeoffs) {
  const links = [
    {
      title: 'TFSA calculator',
      href: '/tools/tfsa-calculator',
      body: 'Use this when flexibility, tax-free withdrawals, or contribution-room planning is central to the result.',
    },
    {
      title: 'RRSP calculator',
      href: '/tools/rrsp-calculator',
      body: 'Use this to test deduction value, refund use, retirement assumptions, and contribution timing.',
    },
    {
      title: 'FHSA calculator',
      href: '/tools/fhsa-calculator',
      body: 'Use this if first-home eligibility or down-payment timing is part of the decision.',
    },
  ];

  if (answers.goal === 'firstHome' || tradeoffs.lead === 'FHSA') {
    links.push({
      title: 'Mortgage affordability calculator',
      href: '/tools/mortgage-affordability-calculator',
      body: 'Connect the account decision to the home-price, income, debt, and stress-test side of the plan.',
    });
  }

  if (answers.goal === 'retirement' || answers.retirementPriority === 'high') {
    links.push({
      title: 'FIRE calculator',
      href: '/tools/fire-calculator',
      body: 'Use this to test whether the contribution habit supports a long-term retirement target.',
    });
  }

  if (answers.goal === 'income') {
    links.push({
      title: 'Dividend calculator',
      href: '/tools/dividend-calculator',
      body: 'Use this to separate dividend yield, total return, and account location tradeoffs.',
    });
  }

  return links.slice(0, 6);
}

function getLearningPath(answers) {
  if (answers.goal === 'beginner') return LEARNING_PATHS.beginner;
  if (answers.goal === 'retirement' || answers.retirementPriority === 'high') return LEARNING_PATHS.retirement;
  if (answers.goal === 'income') return LEARNING_PATHS.income;
  if (answers.goal === 'firstHome') return LEARNING_PATHS.home;
  return LEARNING_PATHS.beginner;
}

export default function AccountDecisionTool() {
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);
  const [step, setStep] = useState(0);
  const currentQuestion = QUESTIONS[step];
  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

  const tradeoffs = useMemo(() => buildTradeoffs(answers), [answers]);
  const nextSteps = useMemo(() => buildNextSteps(answers, tradeoffs), [answers, tradeoffs]);
  const learningPath = useMemo(() => getLearningPath(answers), [answers]);

  const updateAnswer = (key, value) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const selectedLabel = (question) => question.options.find((option) => option.value === answers[question.key])?.label;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'TFSA vs RRSP vs FHSA Decision Framework Canada',
    description: 'Educational Canadian account decision-support framework for comparing TFSA, RRSP, and FHSA tradeoffs.',
    url: CANONICAL,
    isAccessibleForFree: true,
    about: ['TFSA', 'RRSP', 'FHSA', 'Canadian financial planning'],
  };

  return (
    <main className="overflow-x-hidden bg-white text-slate-900 dark:bg-gray-950 dark:text-white">
      <SEO
        title="TFSA vs RRSP vs FHSA Decision Framework Canada"
        description="Compare TFSA, RRSP, and FHSA tradeoffs with a transparent Canadian planning framework that explains what favours each account and what can change the result."
        canonical={CANONICAL}
        schema={schema}
      />
      <ToolPageSchema
        name="TFSA vs RRSP vs FHSA Decision Framework Canada"
        description="Educational Canadian account-priority decision-support tool for comparing TFSA, RRSP, and FHSA tradeoffs."
        canonical={CANONICAL}
        category="FinanceApplication"
      />

      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Canadian account decision support</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-bold text-primary dark:text-accent sm:text-4xl md:text-5xl">
              TFSA vs RRSP vs FHSA decision framework for Canadians
            </h1>
            <ToolByline
              lastUpdated={CONTENT_LAST_REVIEWED}
              reviewer="Reviewed against Canadian account rules"
              trustNote="This tool does not recommend financial products or investments. It helps organize Canadian account tradeoffs using published rules and educational planning assumptions."
            />
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Answer the questions to see what currently favours TFSA, RRSP, or FHSA, why the tradeoff changes, and which calculator or guide should come next.
            </p>
            <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Privacy</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Inputs stay in this browser session. No account sign-in is required.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Calculation style</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">The scoring is directional and client-side, not a precise tax model.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Method</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <Link to="/methodology" className="font-semibold text-primary hover:underline dark:text-accent">Methodology</Link>
                  {' '}and{' '}
                  <Link to="/corrections" className="font-semibold text-primary hover:underline dark:text-accent">corrections</Link>
                  {' '}are visible.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Current directional leader</p>
            <p className="mt-3 text-4xl font-bold text-primary dark:text-accent">{tradeoffs.lead}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Read this as a planning signal, not an instruction. The sections below show what favours each account and what could change the answer.
            </p>
            <div className="mt-5 min-w-0 space-y-2">
              {tradeoffs.sorted.map(([label, score]) => (
                <div key={label} className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold dark:bg-slate-800">
                  <span>{label}</span>
                  <span className="shrink-0">{score}/100</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <EducationalDisclaimer />
        <OfficialSourceNote
          title="Verify account rules before contributing"
          body="TFSA, RRSP, and FHSA limits, deductions, withdrawals, and eligibility should be checked against CRA before acting on any planning result."
          sources={[tfsaOfficialSources[0], rrspOfficialSources[0], fhsaOfficialSources[0]]}
        />

        <section className="mt-8 grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Question flow</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{currentQuestion.section}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {step + 1}/{QUESTIONS.length}
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-secondary" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-5 space-y-2">
              {QUESTIONS.map((question, index) => (
                <button
                  key={question.key}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                    index === step
                      ? 'bg-primary text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="min-w-0 font-semibold">{question.section}</span>
                  <span className="ml-3 max-w-[150px] truncate text-xs opacity-85">{selectedLabel(question)}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{currentQuestion.section}</p>
            <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">{currentQuestion.title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{currentQuestion.helper}</p>
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-7 text-blue-900 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-100">
              <span className="font-bold">Why this matters: </span>
              {currentQuestion.why}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => (
                <OptionButton
                  key={option.value}
                  selected={answers[currentQuestion.key] === option.value}
                  onClick={() => updateAnswer(currentQuestion.key, option.value)}
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={step === 0}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(QUESTIONS.length - 1, current + 1))}
                disabled={step === QUESTIONS.length - 1}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                Next question
              </button>
            </div>
          </section>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Tradeoff engine</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">What currently favours each account</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            The tool does not force one winner. It shows which facts currently lean toward each account, then lists the assumptions that need checking.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <ScoreBar label="TFSA" score={tradeoffs.scores.TFSA} reasons={tradeoffs.favors.TFSA.length ? tradeoffs.favors.TFSA : ['No strong TFSA signal from the current answers.']} />
            <ScoreBar label="RRSP" score={tradeoffs.scores.RRSP} reasons={tradeoffs.favors.RRSP.length ? tradeoffs.favors.RRSP : ['No strong RRSP signal from the current answers.']} />
            <ScoreBar label="FHSA" score={tradeoffs.scores.FHSA} reasons={tradeoffs.favors.FHSA.length ? tradeoffs.favors.FHSA : ['FHSA appears less central unless eligibility and a first-home goal are relevant.']} />
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {ACCOUNT_CARDS.map((account) => (
            <article key={account.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-900">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{account.key}</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{account.title}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{account.subtitle}</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <div>
                  <p className="font-bold text-emerald-700 dark:text-emerald-300">Usually stronger when</p>
                  <ul className="mt-2 space-y-1">{account.useful.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                  <p className="font-bold text-amber-700 dark:text-amber-300">Less useful when</p>
                  <ul className="mt-2 space-y-1">{account.lessUseful.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                  {account.points.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What can change this answer?</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">The result is sensitive by design</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            A trustworthy account framework should explain its weak points. These are the changes most likely to move the answer later.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {tradeoffs.changes.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {item}
              </div>
            ))}
          </div>
          {tradeoffs.cautions.length ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
              <p className="font-bold">Current caution flags</p>
              <ul className="mt-2 space-y-1">
                {tradeoffs.cautions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <WhyThisToolExists>
            The tool exists to organize TFSA, RRSP, and FHSA tradeoffs before product or platform choices enter the conversation.
          </WhyThisToolExists>
          <WhenThisToolIsWeakest>
            It is weakest when CRA room, actual tax bracket, FHSA eligibility, pension details, debt pressure, or cash needs are unknown.
          </WhenThisToolIsWeakest>
          <StressTestYourInputs>
            Change timeline, income, tax reduction, and flexibility. If the result moves, the real-world decision needs more careful modelling.
          </StressTestYourInputs>
        </section>

        <InlineSourceTrust
          label="Inline source reference"
          note="TFSA, RRSP, and FHSA contribution and withdrawal rules are sourced from CRA guidance. Mortgage stress-test context should be verified against CMHC, FCAC, and OSFI-related lender rules."
          sources={[tfsaOfficialSources[0], fhsaOfficialSources[0]]}
        />
        <InlineSourceTrust
          label="Tax and mortgage context"
          note="Province, tax-rate, and mortgage assumptions are planning context only. Use official tax references and lender/CMHC rules before acting."
          sources={[taxOfficialSources[0], mortgageOfficialSources[2]]}
        />

        <NextStepLinks
          title="Calculator routing based on this framework"
          intro="Use the next calculator to test dollars and timing. The same answers here should guide which assumptions you enter next."
          links={nextSteps}
        />

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Suggested learning path</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Read these before going deeper</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            This path is based on the goal you selected. It is meant to improve context, not push a product.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {learningPath.map((item, index) => (
              <Link key={item.href} to={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Step {index + 1}</p>
                <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{item.title}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Assumptions to verify</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Do not skip these checks</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {tradeoffs.assumptions.map((item) => (
              <p key={item} className="rounded-xl bg-white p-4 text-sm leading-7 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </section>

        <SourceList
          title="Official sources used as rule references"
          intro="These references are shown here because account decisions are YMYL-sensitive. Use them to verify limits, eligibility, deductions, withdrawal rules, and public benefit context."
          sources={[
            tfsaOfficialSources[0],
            rrspOfficialSources[0],
            fhsaOfficialSources[0],
            taxOfficialSources[0],
            mortgageOfficialSources[2],
            mortgageOfficialSources[3],
            retirementOfficialSources[0],
            dividendTaxOfficialSources[0],
          ]}
        />

        <FAQ items={FAQS} />
      </div>
    </main>
  );
}
