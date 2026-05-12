import React, { useMemo, useState } from 'react';
import SEO from '../../components/SEO';
import FAQSchema from '../../components/FAQSchema';
import ToolPageSchema from '../../components/ToolPageSchema';
import SourceList from '../../components/SourceList';
import OfficialSourceNote from '../../components/OfficialSourceNote';
import InlineSourceTrust from '../../components/InlineSourceTrust';
import SurfaceTrackedLink from '../../components/SurfaceTrackedLink';
import { StressTestYourInputs, WhatCanBreakThisEstimate, WhyThisToolExists } from '../../components/ToolTrustBlocks';
import {
  dividendTaxOfficialSources,
  fhsaOfficialSources,
  rrspOfficialSources,
  tfsaOfficialSources,
} from '../../config/officialSources';

const canonical = 'https://easyfinancetools.com/tools/investment-fit-framework';

const investmentSources = [
  tfsaOfficialSources[0],
  rrspOfficialSources[0],
  fhsaOfficialSources[0],
  ...dividendTaxOfficialSources,
  {
    label: 'Bank of Canada: Exchange rates',
    body: 'Reference data for CAD and foreign-currency context when an investment or distribution is not CAD-only.',
    href: 'https://www.bankofcanada.ca/rates/exchange/',
  },
  {
    label: 'GetSmarterAboutMoney: Diversification',
    body: 'Investor-education guidance on spreading exposure across assets and understanding concentration risk.',
    href: 'https://www.getsmarteraboutmoney.ca/learning-path/understanding-risk/diversification/',
  },
];

const inputGroups = [
  {
    id: 'investmentType',
    label: 'Investment type',
    why: 'Different structures create different tax, currency, income, and risk questions.',
    options: [
      ['canadian-dividend-stock', 'Canadian dividend stock', 'Canadian dividends can have different taxable treatment outside registered accounts, but company-specific risk still matters.'],
      ['us-dividend-stock', 'US dividend stock', 'Foreign dividends can introduce withholding-tax and currency considerations.'],
      ['canadian-etf', 'Canadian ETF', 'An ETF may reduce single-company concentration, but asset mix and distributions still matter.'],
      ['us-etf', 'US ETF', 'US-listed funds can add currency and foreign tax questions, especially for income-focused investors.'],
      ['covered-call-etf', 'Covered-call ETF', 'Cash-flow focus can come with capped upside, distribution changes, and NAV pressure.'],
      ['growth-stock', 'Growth stock', 'Growth-focused positions can be more sensitive to valuation changes, time horizon, and concentration.'],
      ['bond-gic-cash', 'Bond, GIC, or cash-like investment', 'Lower-volatility assets may fit shorter timelines, but rate, inflation, and tax treatment still matter.'],
      ['crypto-related', 'Crypto-related equity or ETF', 'Crypto-linked exposure can be highly volatile and may not match short timelines or essential goals.'],
      ['other', 'Other', 'Use this for a general account-location and risk-context check when the structure is mixed or unclear.'],
    ],
  },
  {
    id: 'account',
    label: 'Intended account',
    why: 'The same investment can feel different inside a TFSA, RRSP, FHSA, or taxable account.',
    options: [
      ['tfsa', 'TFSA', 'Useful to compare flexibility and tax-free withdrawals against contribution-room limits.'],
      ['rrsp', 'RRSP', 'Useful to compare deduction value, retirement focus, taxable withdrawals, and foreign-income nuance.'],
      ['fhsa', 'FHSA', 'Useful when a qualifying first-home withdrawal is realistic and the timeline supports the risk level.'],
      ['taxable', 'Taxable/non-registered', 'Useful when contribution room is limited or reporting and distribution complexity need attention.'],
      ['not-sure', 'Not sure yet', 'Keeps the result account-neutral and highlights what to investigate next.'],
    ],
  },
  {
    id: 'goal',
    label: 'Primary goal',
    why: 'A goal changes whether flexibility, income, growth, stability, or account rules deserve more attention.',
    options: [
      ['long-term-growth', 'Long-term growth', 'Longer horizons can tolerate more movement, but assumptions still need stress testing.'],
      ['dividend-income', 'Dividend income', 'Income goals need checks for distribution durability, tax treatment, and concentration.'],
      ['retirement-income', 'Retirement income', 'Withdrawal timing and sequence risk can matter more when cash flow is already needed.'],
      ['first-home-savings', 'First-home savings', 'Home timelines often conflict with volatile assets when the purchase window is near.'],
      ['short-term-savings', 'Short-term savings', 'Short timelines usually put capital stability and liquidity ahead of upside.'],
      ['learning-research', 'Learning/research', 'A smaller educational position can be different from a core planning position.'],
    ],
  },
  {
    id: 'horizon',
    label: 'Time horizon',
    why: 'Volatility is easier to absorb when the money is not needed soon.',
    options: [
      ['under-2', 'Under 2 years', 'Short timelines leave little room for a recovery period after a market decline.'],
      ['2-5', '2-5 years', 'Medium-short timelines need a stronger liquidity and downside check.'],
      ['5-10', '5-10 years', 'This can support more planning flexibility, but account rules and risk still matter.'],
      ['10-plus', '10+ years', 'Longer timelines can make growth assumptions more relevant, while fees and behavior matter more.'],
    ],
  },
  {
    id: 'incomeReliance',
    label: 'Yield / income reliance',
    why: 'The more the plan depends on income, the more distribution cuts and tax drag matter.',
    options: [
      ['not-income-focused', 'Not income-focused', 'Growth, diversification, and account fit may matter more than cash distributions.'],
      ['some-income', 'Some income', 'Income is useful, but the plan should still work if distributions vary.'],
      ['income-important', 'Income is important', 'Distribution quality, tax treatment, and concentration deserve closer attention.'],
      ['income-main-reason', 'Income is the main reason', 'This needs a stronger stress test for distribution changes and capital erosion.'],
    ],
  },
  {
    id: 'concentration',
    label: 'Concentration level',
    why: 'A small satellite position has different consequences than a core portfolio position.',
    options: [
      ['small', 'Small position', 'Position-specific risk may be easier to absorb if the rest of the plan is diversified.'],
      ['moderate', 'Moderate position', 'The investment can meaningfully affect results, so risk flags deserve attention.'],
      ['large', 'Large position', 'A large allocation increases the cost of being wrong about one investment or theme.'],
      ['majority', 'Majority of portfolio', 'Concentration can dominate the plan and make account choice a secondary issue.'],
    ],
  },
  {
    id: 'currency',
    label: 'Currency exposure',
    why: 'CAD and USD movement can change both income and account values for Canadian investors.',
    options: [
      ['cad', 'CAD', 'CAD-only exposure can reduce currency noise, though underlying holdings may still have global exposure.'],
      ['usd', 'USD', 'USD exposure adds exchange-rate movement and possible foreign-income considerations.'],
      ['mixed', 'Mixed', 'Mixed currency exposure needs attention to both reporting and planning assumptions.'],
      ['not-sure', 'Not sure', 'The currency layer should be checked before relying on the result.'],
    ],
  },
  {
    id: 'riskSensitivity',
    label: 'Risk sensitivity',
    why: 'A plan can fail behaviorally if the investment is too stressful to stick with.',
    options: [
      ['low', 'Low', 'Lower tolerance means downside and liquidity concerns should carry more weight.'],
      ['medium', 'Medium', 'A balanced view can compare upside, downside, and account fit together.'],
      ['high', 'High', 'Higher tolerance does not remove tax, liquidity, or concentration risk.'],
    ],
  },
  {
    id: 'liquidityNeed',
    label: 'Need for flexibility/liquidity',
    why: 'Money that may be needed soon should be easier to access and less exposed to forced timing.',
    options: [
      ['low', 'Low', 'Lower liquidity need may support a longer-term account and investment framework.'],
      ['medium', 'Medium', 'Some flexibility is useful if goals or cash needs change.'],
      ['high', 'High', 'High liquidity need makes short-term volatility and withdrawal rules more important.'],
    ],
  },
];

const initialState = inputGroups.reduce((state, group) => {
  state[group.id] = group.options[0][0];
  return state;
}, {});

const accountLabels = {
  tfsa: 'TFSA',
  rrsp: 'RRSP',
  fhsa: 'FHSA',
  taxable: 'Taxable/non-registered',
  'not-sure': 'Not sure yet',
};

const investmentLabels = Object.fromEntries(inputGroups[0].options.map(([value, label]) => [value, label]));

const faqs = [
  {
    q: 'Does this tool tell me which investment to choose?',
    a: 'No. It does not rate securities or provide trading instructions. It organizes account-fit, tax-location, timeline, income, and risk questions for Canadian educational planning.',
  },
  {
    q: 'Can this replace financial advice?',
    a: 'No. It is an educational framework. Personal tax, account room, employment benefits, debt, family needs, and risk tolerance can materially change the answer.',
  },
  {
    q: 'Why does account type matter for Canadian investors?',
    a: 'TFSA, RRSP, FHSA, and taxable accounts treat contributions, withdrawals, income, and reporting differently. The same holding can create different planning tradeoffs in each account.',
  },
  {
    q: 'Why can high distribution yield be risky?',
    a: 'A high yield can reflect business risk, falling prices, covered-call structure, return-of-capital complexity, or a distribution that may change. Yield should be stress-tested, not viewed alone.',
  },
  {
    q: 'Are my inputs stored?',
    a: 'No. This page runs in the browser, does not require an account, and does not use calculator inputs for marketing.',
  },
];

const matrixRows = [
  {
    label: 'Tax treatment',
    tfsa: 'Growth and withdrawals are generally tax-free when rules are followed.',
    rrsp: 'Contributions may create deductions; withdrawals are taxable.',
    fhsa: 'Deductible contributions and tax-free qualifying first-home withdrawals.',
    taxable: 'Interest, dividends, distributions, and capital gains may require reporting.',
  },
  {
    label: 'Flexibility',
    tfsa: 'Strong flexibility, with recontribution timing rules to respect.',
    rrsp: 'Lower flexibility because withdrawals are taxable and room is usually not restored.',
    fhsa: 'Purpose-built for qualifying first-home use, with transfer options if plans change.',
    taxable: 'No registered contribution room limit, but taxable events and records matter.',
  },
  {
    label: 'Withdrawal implications',
    tfsa: 'Withdrawals can be simpler, but same-year recontributions can create penalties.',
    rrsp: 'Withdrawals add taxable income and may affect income-tested benefits.',
    fhsa: 'Qualifying withdrawals are different from taxable withdrawals.',
    taxable: 'Dispositions can create capital gains or losses.',
  },
  {
    label: 'Foreign withholding-tax considerations',
    tfsa: 'Foreign distributions can face withholding-tax drag depending on asset structure.',
    rrsp: 'Some foreign dividend treatment can differ, especially with certain US-listed holdings.',
    fhsa: 'Foreign-income treatment can be less straightforward and should be verified.',
    taxable: 'Foreign tax slips, credits, and currency conversion can add reporting work.',
  },
  {
    label: 'Time horizon sensitivity',
    tfsa: 'Flexible, but risky assets still need enough time to recover.',
    rrsp: 'Often retirement-focused, so withdrawal timing matters.',
    fhsa: 'Highly sensitive when a home purchase window is near.',
    taxable: 'Flexible timing, but tax events can affect when changes are made.',
  },
  {
    label: 'Income/distribution complexity',
    tfsa: 'Income is sheltered from Canadian tax, but distributions can still vary.',
    rrsp: 'Income can compound tax-deferred until withdrawal.',
    fhsa: 'Income can help a down-payment goal only if risk and timing fit.',
    taxable: 'Distribution type, slips, return of capital, and adjusted cost base can matter.',
  },
  {
    label: 'Educational use case',
    tfsa: 'Testing flexibility and tax-free withdrawal tradeoffs.',
    rrsp: 'Testing deduction value, retirement timing, and future taxable income.',
    fhsa: 'Testing first-home timeline and qualifying-withdrawal assumptions.',
    taxable: 'Testing tax reporting, contribution-room overflow, and liquidity needs.',
  },
];

const guideSections = [
  {
    title: 'Why account location matters in Canada',
    body: 'Canadian investors do not just choose an investment; they also choose where it sits. A TFSA emphasizes tax-free withdrawals and flexibility. An RRSP emphasizes deduction value and taxable retirement withdrawals. An FHSA is tied to first-home rules. A taxable account adds reporting, distribution, and capital-gain records. The account can change the tradeoff even when the investment is unchanged.',
  },
  {
    title: 'Why high yield can be misleading',
    body: 'Yield is a cash-flow number, not a full quality check. A high yield can come from a falling price, a changing distribution policy, concentrated business risk, leverage, or a strategy that trades some upside for current cash flow. Income-focused investors should ask whether the plan still works if income falls or capital does not recover quickly.',
  },
  {
    title: 'How foreign withholding tax can affect income-focused investors',
    body: 'Foreign dividends and foreign-listed funds can introduce withholding-tax drag. The treatment can depend on account type, fund structure, country, and treaty rules. This framework points out the issue, but investors should verify details with CRA guidance, fund documents, and a qualified tax professional.',
  },
  {
    title: 'Why short timelines and volatile investments conflict',
    body: 'A volatile investment may be reasonable for a long-term goal but uncomfortable for a near-term cash need. If money may be needed within a few years, the risk is not only lower account value; it is being forced to use funds during a weak market period.',
  },
  {
    title: 'Why concentration risk matters more than headline yield',
    body: 'A small position can be a learning or satellite allocation. A majority position can dominate the plan. Once concentration is high, company, sector, currency, or strategy-specific risk may matter more than whether the account is a TFSA, RRSP, FHSA, or taxable account.',
  },
  {
    title: 'Why this tool does not provide stock ratings',
    body: 'Security ratings require valuation, filings analysis, personal objectives, and suitability review. This page intentionally stops before that line. It helps organize Canadian planning context, then sends readers to official sources, fund documents, filings, and qualified professionals for personal decisions.',
  },
];

function optionLabel(groupId, value) {
  return inputGroups.find((group) => group.id === groupId)?.options.find(([optionValue]) => optionValue === value)?.[1] || value;
}

function buildResult(inputs) {
  const shortTimeline = inputs.horizon === 'under-2' || inputs.horizon === '2-5';
  const incomeFocused = inputs.incomeReliance === 'income-important' || inputs.incomeReliance === 'income-main-reason';
  const highConcentration = inputs.concentration === 'large' || inputs.concentration === 'majority';
  const foreignExposure = inputs.currency === 'usd' || inputs.currency === 'mixed' || inputs.investmentType === 'us-dividend-stock' || inputs.investmentType === 'us-etf';
  const volatileExposure = ['growth-stock', 'covered-call-etf', 'crypto-related', 'canadian-dividend-stock', 'us-dividend-stock'].includes(inputs.investmentType);
  const homeGoal = inputs.goal === 'first-home-savings' || inputs.account === 'fhsa';
  const taxableAccount = inputs.account === 'taxable';
  const needsLiquidity = inputs.liquidityNeed === 'high' || shortTimeline;

  const accountFit = [
    {
      account: 'TFSA',
      body: 'May be useful when flexibility and tax-free withdrawals matter. It does not create an upfront deduction, and contribution-room rules still need care.',
      tone: inputs.account === 'tfsa' ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-800',
    },
    {
      account: 'RRSP',
      body: 'May be relevant when deduction value and retirement timing matter. Withdrawals are taxable, so future income assumptions can change the planning result.',
      tone: inputs.account === 'rrsp' ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-800',
    },
    {
      account: 'FHSA',
      body: 'May be useful for an eligible first-home plan, but short purchase timelines make volatility and liquidity more important.',
      tone: inputs.account === 'fhsa' ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-800',
    },
    {
      account: 'Taxable',
      body: 'May be needed when registered room is limited. Reporting, distribution character, foreign exchange, and adjusted cost base records can become more important.',
      tone: inputs.account === 'taxable' ? 'border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-800',
    },
  ];

  const fits = [
    inputs.horizon === '10-plus' ? 'Longer timelines may support growth-oriented exposure, provided concentration and behavior risk are manageable.' : null,
    inputs.horizon === '5-10' ? 'A medium-to-long timeline may support scenario planning, but downside periods still need room to pass.' : null,
    inputs.incomeReliance === 'not-income-focused' ? 'Lower income reliance may reduce pressure to chase yield and make total-return tradeoffs easier to compare.' : null,
    inputs.concentration === 'small' ? 'A small position can limit the damage from one investment-specific mistake.' : null,
    inputs.goal === 'learning-research' ? 'A research-focused use case may fit better as a limited educational exercise than as a core plan driver.' : null,
    inputs.account === 'not-sure' ? 'Leaving the account undecided is reasonable when tax location, room, and timeline still need comparison.' : null,
  ].filter(Boolean);

  const lessAligned = [
    shortTimeline && volatileExposure ? 'A short timeline can conflict with volatile exposure because the money may be needed during a weak market period.' : null,
    homeGoal && volatileExposure ? 'First-home money is more sensitive to timing risk when the purchase window is close.' : null,
    incomeFocused ? 'Income reliance increases the importance of distribution durability, tax treatment, and cash-flow stress tests.' : null,
    highConcentration ? 'High concentration can make a single holding, sector, or strategy dominate the plan.' : null,
    needsLiquidity && inputs.account === 'rrsp' ? 'High flexibility needs can conflict with RRSP taxable-withdrawal treatment.' : null,
    taxableAccount ? 'Taxable accounts can add recordkeeping, slip interpretation, and distribution-type complexity.' : null,
  ].filter(Boolean);

  const riskFlags = [
    incomeFocused ? ['Distribution change risk', 'The plan should still be workable if income falls, pauses, or is partly offset by capital decline.'] : null,
    inputs.incomeReliance === 'income-main-reason' ? ['Yield-chasing risk', 'When income is the main attraction, it is easier to underweight balance-sheet, fund-structure, and concentration risks.'] : null,
    foreignExposure ? ['Currency and withholding-tax drag', 'USD exposure and foreign distributions can affect after-tax CAD income and reporting assumptions.'] : null,
    highConcentration ? ['Concentration risk', 'A large or majority position can overwhelm diversification and make one investment drive the outcome.'] : null,
    shortTimeline && volatileExposure ? ['Short-timeline volatility', 'A decline shortly before the money is needed can matter more than the long-term thesis.'] : null,
    inputs.investmentType === 'covered-call-etf' ? ['Covered-call structure risk', 'Covered-call funds can trade some upside for cash flow, and distributions may not reflect durable economic income.'] : null,
    inputs.investmentType === 'crypto-related' ? ['Crypto-linked volatility', 'Crypto-related securities can move sharply and may not fit essential or short-term goals.'] : null,
    taxableAccount ? ['Taxable distribution complexity', 'T-slips, foreign income, return of capital, and adjusted cost base records can affect the after-tax result.'] : null,
    inputs.goal === 'retirement-income' && inputs.riskSensitivity !== 'high' ? ['Sequence risk', 'Withdrawals during weak markets can put pressure on a retirement-income plan.'] : null,
  ].filter(Boolean).map(([title, body]) => ({ title, body }));

  const breakers = [
    'Your income, tax bracket, or province changes.',
    'Contribution room is lower than assumed or records are incomplete.',
    'Income distributions fall, pause, or become less tax-efficient.',
    'Interest rates or inflation move against the planning assumption.',
    'CAD/USD currency movement changes the real CAD outcome.',
    'The position grows into an outsized share of the portfolio.',
    'The time horizon shortens or cash is needed earlier than planned.',
    'Tax rules, treaty treatment, account rules, or fund structure change.',
  ];

  const stressTests = [
    incomeFocused ? 'What if the distribution drops by 30%?' : 'What if income from this investment is lower than expected?',
    volatileExposure ? 'What if the market value falls 25% and takes years to recover?' : 'What if rates change and the income or market value moves differently than planned?',
    foreignExposure ? 'What if USD/CAD moves against the Canadian-dollar plan?' : 'What if inflation reduces the real value of the outcome?',
    highConcentration ? 'What if this becomes too large a share of the portfolio?' : 'What if this remains a small part of a broader diversified plan?',
    needsLiquidity ? 'What if cash is needed earlier than planned?' : 'What if the goal changes before the planned time horizon?',
  ];

  return {
    headline: `${investmentLabels[inputs.investmentType]} in ${accountLabels[inputs.account]}`,
    accountFit,
    fits: fits.length ? fits : ['This case needs more context before any account-fit conclusion should carry much weight.'],
    lessAligned: lessAligned.length ? lessAligned : ['No single red flag dominates from these inputs, but account rules, fees, documents, and personal constraints still matter.'],
    riskFlags: riskFlags.length ? riskFlags : [{ title: 'Assumption risk', body: 'The biggest risk is treating a simple framework as a complete suitability review.' }],
    breakers,
    stressTests,
  };
}

function FieldGroup({ group, value, onChange }) {
  const selected = group.options.find(([optionValue]) => optionValue === value);

  return (
    <label className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <span className="text-sm font-bold text-primary dark:text-accent">{group.label}</span>
      <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
        <strong>Why this matters:</strong> {group.why}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(group.id, event.target.value)}
        className="focus-ring mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        {group.options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
      <span className="mt-3 block rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
        {selected?.[2]}
      </span>
    </label>
  );
}

function BulletedList({ items }) {
  return (
    <ul className="space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-0.5 text-secondary">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function InvestmentFitFramework() {
  const [inputs, setInputs] = useState(initialState);
  const result = useMemo(() => buildResult(inputs), [inputs]);

  const updateInput = (id, value) => {
    setInputs((current) => ({ ...current, [id]: value }));
  };

  const nextSteps = [
    {
      title: 'Compare account priority',
      body: 'Use the account decision tool when TFSA, RRSP, and FHSA tradeoffs are still competing.',
      href: '/tools/account-decision-tool',
      ctaLabel: 'investment_fit_account_decision_tool',
    },
    {
      title: 'Model dividend income',
      body: 'Translate yield assumptions into capital requirements and stress-test income reliance.',
      href: '/tools/dividend-calculator',
      ctaLabel: 'investment_fit_dividend_calculator',
    },
    {
      title: 'Check long-term growth math',
      body: 'Use contribution, fee, and inflation assumptions before relying on a simple growth story.',
      href: '/tools/compound-interest-calculator',
      ctaLabel: 'investment_fit_compound_interest',
    },
    {
      title: 'Estimate TFSA context',
      body: 'Review tax-free growth, withdrawal flexibility, and contribution-room sensitivity.',
      href: '/tools/tfsa-calculator',
      ctaLabel: 'investment_fit_tfsa_calculator',
    },
    {
      title: 'Estimate RRSP context',
      body: 'Compare deduction value, refund assumptions, and future taxable-withdrawal pressure.',
      href: '/tools/rrsp-calculator',
      ctaLabel: 'investment_fit_rrsp_calculator',
    },
    {
      title: 'Estimate FHSA context',
      body: 'Test whether the first-home timeline supports the account and risk assumptions.',
      href: '/tools/fhsa-calculator',
      ctaLabel: 'investment_fit_fhsa_calculator',
    },
  ];

  return (
    <main>
      <SEO
        title="Canadian Investment Fit Framework"
        description="Evaluate how an investment may fit inside TFSA, RRSP, FHSA, taxable, or long-term planning contexts using educational, non-advisory Canadian account and risk factors."
        canonical={canonical}
      />
      <ToolPageSchema
        name="Canadian Investment Fit Framework"
        description="Educational Canadian account-fit and risk-context framework for comparing investment type, account location, time horizon, income reliance, concentration, currency, and liquidity tradeoffs."
        canonical={canonical}
        category="FinanceApplication"
      />
      <FAQSchema faqs={faqs} />

      <section className="bg-gradient-to-br from-slate-950 via-primary to-slate-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-50">
              Educational account-fit and risk-context framework
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              Canadian Investment Fit Framework
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50">
              Evaluate how an investment may fit inside TFSA, RRSP, FHSA, taxable, or long-term planning contexts using Canadian account rules, tax-location questions, time horizon, income reliance, concentration, and liquidity tradeoffs.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Non-advisory', 'This framework does not tell you to enter, exit, or keep any investment position.'],
              ['Private by design', 'No account creation. Inputs stay in the browser and are not used for marketing.'],
              ['Canadian context', 'Built around TFSA, RRSP, FHSA, taxable-account, CRA, and CAD planning questions.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-5 text-sm leading-7 text-blue-50">
                <p className="font-bold text-white">{title}</p>
                <p className="mt-2">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <OfficialSourceNote
          title="Account and tax context"
          body="This framework uses educational account-location prompts and links to official Canadian sources. It cannot verify your contribution room, tax return, account documents, fund structure, or personal suitability."
          sources={[tfsaOfficialSources[0], rrspOfficialSources[0], fhsaOfficialSources[0]]}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Step-by-step inputs</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Describe the planning context</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              These inputs do not produce a personalized instruction. They reveal which account, tax, timeline, and risk assumptions deserve more attention.
            </p>
            <div className="mt-5 space-y-4">
              {inputGroups.map((group) => (
                <FieldGroup key={group.id} group={group} value={inputs[group.id]} onChange={updateInput} />
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Educational result</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{result.headline}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                This result compares account fit and risk context. It does not determine whether the investment is suitable, and it does not replace reviewing official filings, account terms, tax rules, and professional advice.
              </p>
              <InlineSourceTrust
                label="Source-linked context"
                note="Registered-account and investment-income rules should be checked against CRA guidance before making personal decisions."
                sources={[tfsaOfficialSources[0], dividendTaxOfficialSources[0]]}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {result.accountFit.map((item) => (
                <div key={item.account} className={`rounded-2xl border p-5 shadow-sm ${item.tone}`}>
                  <h3 className="text-lg font-bold text-primary dark:text-accent">{item.account}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/20">
                <h3 className="text-lg font-bold text-primary dark:text-accent">What currently fits</h3>
                <div className="mt-3">
                  <BulletedList items={result.fits} />
                </div>
              </div>
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/20">
                <h3 className="text-lg font-bold text-primary dark:text-accent">What needs caution</h3>
                <div className="mt-3">
                  <BulletedList items={result.lessAligned} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Main risk flags</p>
              <div className="mt-4 grid gap-3">
                {result.riskFlags.map((flag) => (
                  <div key={flag.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                    <h3 className="font-bold text-primary dark:text-accent">{flag.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{flag.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          <WhyThisToolExists>
            <p>
              Many Canadian investing decisions are framed around the security first. This framework starts with account location, tax treatment, timeline, liquidity, concentration, and risk because those can change the planning context before product details are considered.
            </p>
          </WhyThisToolExists>
          <WhatCanBreakThisEstimate title="What could break this plan?">
            <BulletedList items={result.breakers} />
          </WhatCanBreakThisEstimate>
          <StressTestYourInputs>
            <BulletedList items={result.stressTests} />
          </StressTestYourInputs>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Account-fit matrix</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Compare account context without ranking accounts</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            This matrix is not a scorecard. It shows why TFSA, RRSP, FHSA, and taxable accounts can create different tradeoffs for the same investment.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] overflow-hidden rounded-2xl border border-slate-200 text-left text-sm dark:border-slate-700">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">Factor</th>
                  <th className="px-4 py-3 font-bold">TFSA</th>
                  <th className="px-4 py-3 font-bold">RRSP</th>
                  <th className="px-4 py-3 font-bold">FHSA</th>
                  <th className="px-4 py-3 font-bold">Taxable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {matrixRows.map((row) => (
                  <tr key={row.label} className="align-top">
                    <td className="bg-slate-50 px-4 py-4 font-bold text-primary dark:bg-slate-900 dark:text-accent">{row.label}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{row.tfsa}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{row.rrsp}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{row.fhsa}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{row.taxable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Next step routing</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the next tool for the assumption that matters most</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            The framework points to deeper calculators and guides so the account, income, growth, and timeline assumptions can be tested separately.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nextSteps.map((step) => (
              <SurfaceTrackedLink
                key={step.href}
                to={step.href}
                eventName="investment_fit_next_step_click"
                ctaLabel={step.ctaLabel}
                trackingParams={{ section: 'investment_fit_routing', selected_account: inputs.account, investment_type: inputs.investmentType }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-gray-800"
              >
                <h3 className="text-lg font-bold text-primary dark:text-accent">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Educational guide</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Planning context behind the framework</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {guideSections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{section.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{section.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Questions this framework is meant to answer carefully</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{faq.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <SourceList
          title="Sources and investor-education references"
          intro="These references support the account-rule, investment-income, currency, and diversification context used by this educational framework."
          sources={investmentSources}
        />
      </div>
    </main>
  );
}
