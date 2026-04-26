import React from 'react';
import SEO from '../../components/SEO';
import BlogHero from '../../components/BlogHero';
import TLDRBox from '../../components/TLDRBox';
import FAQSchema from '../../components/FAQSchema';
import ArticleSchema from '../../components/ArticleSchema';
import MethodologyPanel from '../../components/MethodologyPanel';
import ReferenceSection from '../../components/ReferenceSection';
import ActionableNextSteps from '../../components/ActionableNextSteps';
import ToolByline from '../../components/ToolByline';
import TrackedLink from '../../components/TrackedLink';
import EmbeddedFHSACalculator from '../../components/EmbeddedFHSACalculator';
import { CONTENT_LAST_REVIEWED, REGISTERED_ACCOUNT_LIMITS } from '../../config/financial';
import {
  formatFhsaCurrency,
  getFhsaIncomeExample,
} from '../../lib/fhsaPlanning';

const PAGE_LAST_UPDATED = 'April 26, 2026';

const FAQS = [
  {
    q: 'How much can I contribute to an FHSA in 2026?',
    a: 'The annual FHSA contribution limit for 2026 is $8,000, with a lifetime contribution cap of $40,000. If you opened the account earlier and did not use the full annual limit, up to $8,000 of unused room can carry forward.',
  },
  {
    q: 'Do unused FHSA room amounts carry forward?',
    a: 'Yes, but only up to $8,000 of unused room can carry forward into a future year. That is why many Canadians open the account early even if they are not ready to max it immediately.',
  },
  {
    q: 'Can I use both the FHSA and the RRSP Home Buyers Plan?',
    a: 'Often yes. Many eligible first-time buyers can combine the FHSA and the RRSP Home Buyers Plan for the same qualifying home purchase, which can materially increase the down-payment pool.',
  },
  {
    q: 'What happens if I never buy a home?',
    a: 'If you do not make a qualifying home purchase, FHSA assets can generally be transferred to an RRSP or RRIF on a tax-deferred basis if the applicable rules are met. Direct withdrawals instead would usually be taxable.',
  },
  {
    q: 'FHSA or TFSA first?',
    a: 'The FHSA often comes first when you are an eligible first-time buyer, the home timeline is real, and the deduction matters at your current tax bracket. The TFSA can be the cleaner first choice when the timeline is uncertain or flexibility matters more.',
  },
  {
    q: 'FHSA or RRSP first?',
    a: 'If the goal is specifically a first-home purchase, the FHSA is often the stronger first account because it combines a deduction with a tax-free qualifying withdrawal. The RRSP becomes more attractive when retirement savings or a larger deduction today are the bigger priorities.',
  },
  {
    q: 'Can I invest inside an FHSA?',
    a: 'Yes. Depending on the provider, an FHSA can hold cash, savings products, GICs, ETFs, mutual funds, or individual securities. The right mix should match the home-buying timeline rather than the most aggressive return assumption.',
  },
];

const EXAMPLE_INPUTS = {
  birthYear: 1994,
  province: 'ON',
  income: 90000,
  availableRoomNow: 8000,
  contributedToDate: 0,
  currentBalance: 0,
  annualContribution: 8000,
  expectedReturn: 5.5,
  yearsToPurchase: 5,
};

const INCOME_EXAMPLES = [
  getFhsaIncomeExample('ON', 60000),
  getFhsaIncomeExample('ON', 90000),
  getFhsaIncomeExample('ON', 140000),
];

const COMPARISON_CARDS = [
  {
    title: 'FHSA vs TFSA',
    body: 'The FHSA is usually stronger when you are an eligible first-time buyer and the deduction matters today. The TFSA is usually stronger when your timeline is uncertain or you want cleaner access to the money without qualifying-withdrawal rules.',
    ctaText: 'Compare the same contribution in the TFSA calculator',
    href: '/tools/tfsa-calculator',
    ctaLabel: 'fhsa_vs_tfsa_calculator',
  },
  {
    title: 'FHSA vs RRSP',
    body: 'The FHSA is purpose-built for the first-home goal. The RRSP is often the better next step when retirement saving is the main job, or when you need to compare the FHSA deduction against a broader RRSP contribution strategy.',
    ctaText: 'Review the RRSP decision tool',
    href: '/tools/rrsp-calculator',
    ctaLabel: 'fhsa_vs_rrsp_calculator',
  },
];

const COMMON_MISTAKES = [
  'Opening the account late and losing time to build carry-forward room.',
  'Chasing only the tax deduction without checking whether the home timeline is actually realistic.',
  'Using an aggressive investment mix for a short purchase window.',
  'Skipping the CRA room check before making a large contribution.',
];

const BEST_FIT_POINTS = [
  'You are an eligible first-time home buyer and the purchase window is still real.',
  'Your current tax bracket makes the deduction meaningfully valuable.',
  'You want a dedicated down-payment account instead of a fully flexible bucket.',
  'You are ready to compare the FHSA against the TFSA and RRSP before opening anything.',
];

const RELATED_DECISION_LINKS = [
  {
    title: 'Compare TFSA vs RRSP before you overfund one account',
    body: 'Use the TFSA vs RRSP hub when the next contribution could still reasonably go to another registered account instead of the FHSA.',
    href: '/blog/tfsa-vs-rrsp-canada-2026',
    ctaLabel: 'fhsa_to_tfsa_vs_rrsp_hub',
  },
  {
    title: 'See when FHSA beats RRSP for a down payment',
    body: 'Use the down-payment comparison page if the real question is whether the FHSA should come before the RRSP Home Buyers Plan.',
    href: '/blog/fhsa-vs-rrsp-down-payment-canada-2026',
    ctaLabel: 'fhsa_to_down_payment_comparison',
  },
  {
    title: 'Compare the longer-term dividend path',
    body: 'If the home timeline drifts and income investing starts to compete for the same cash, compare the FHSA plan against a dividend-income workflow instead of forcing every dollar into one account type.',
    href: '/blog/500-month-dividend-canada',
    ctaLabel: 'fhsa_to_dividend_master_guide',
  },
];

const FHSA_CALCULATOR_CHECKLIST = [
  {
    title: 'Contribution room',
    body: 'How much 2026 room you can use now, plus whether carry-forward room is actually available.',
  },
  {
    title: 'Estimated tax savings',
    body: 'What the deduction may be worth at your current income and province before you contribute.',
  },
  {
    title: 'Home-buying timeline',
    body: 'Whether the purchase window is close enough to justify the FHSA over a more flexible account.',
  },
  {
    title: 'Next account to compare',
    body: 'Whether the same dollar should still be checked against the TFSA or RRSP before you lock in the plan.',
  },
];

export default function FHSACalculatorCanada2026() {
  const quickExample = getFhsaIncomeExample('ON', EXAMPLE_INPUTS.income);

  return (
    <div>
      <SEO
        title="FHSA Calculator Canada 2026: Limits, Tax Savings & Growth"
        description="Use this FHSA calculator guide to estimate 2026 contribution room, tax savings, and down-payment growth in Canada before choosing TFSA or RRSP."
        canonical="https://easyfinancetools.com/blog/fhsa-calculator-canada-2026"
      />
      <ArticleSchema
        headline="FHSA Calculator Canada: 2026 Limits, Tax Savings, and Growth Guide"
        description="Estimate your 2026 FHSA tax savings, understand the contribution limits, and compare the FHSA against TFSA and RRSP choices before your next deposit."
        url="https://easyfinancetools.com/blog/fhsa-calculator-canada-2026"
        datePublished="2026-04-23"
        dateModified="2026-04-26"
      />
      <FAQSchema faqs={FAQS} />

      <BlogHero
        icon="FHSA"
        category="FHSA | First home"
        title="FHSA Calculator Canada: 2026 Limits, Tax Savings, and Growth Guide"
        date={PAGE_LAST_UPDATED}
        readTime="10 min read"
        gradient="from-emerald-500 to-teal-700"
      />

      <section className="mx-auto max-w-5xl px-4 py-12">
        <TLDRBox
          headline="What should an FHSA calculator tell you?"
          answer={`A useful FHSA calculator should show your 2026 contribution room, the value of the deduction at your income level, the projected down-payment balance, and whether the FHSA still beats the TFSA or RRSP for the same dollar. In 2026, the annual FHSA contribution limit is ${formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)}, and in Ontario someone earning ${formatFhsaCurrency(EXAMPLE_INPUTS.income)} could see roughly ${formatFhsaCurrency(quickExample.estimatedTaxSavings)} of estimated tax savings from a full-year FHSA contribution.`}
          points={[
            `2026 annual FHSA limit: ${formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)}`,
            `Lifetime FHSA limit: ${formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit)}`,
            'Unused room can carry forward, but only after the account is open',
            'A real purchase timeline matters almost as much as the tax deduction',
            'The best next comparison is usually TFSA vs RRSP vs FHSA, not FHSA in isolation',
          ]}
        />

        <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
          <p className="lead">
            If you are searching for an FHSA calculator in Canada, the real question is not just how the account works. It is whether your next dollar should go into the FHSA at all,
            <strong> how much is the deduction worth, how much room can you actually use, and is the FHSA still better than your TFSA or RRSP?</strong>
          </p>

          <h2>Try the FHSA decision tool first</h2>
          <p>
            Start with a realistic FHSA example below, then change the province, income, contribution amount, and timeline.
            If you want the full dedicated planner afterward, open the
            {' '}
            <TrackedLink articleSlug="fhsa-calculator-canada-2026" ctaLabel="open_full_fhsa_tool_inline" to="/tools/fhsa-calculator" className="text-primary underline">
              FHSA decision tool
            </TrackedLink>
            .
          </p>
        </article>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What an FHSA calculator should tell you</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the FHSA math to narrow the next account decision</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {FHSA_CALCULATOR_CHECKLIST.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
            If you are still new to the account order itself, start with the
            {' '}
            <TrackedLink articleSlug="fhsa-calculator-canada-2026" ctaLabel="fhsa_beginner_guide_inline" to="/blog/how-to-start-investing-canada-2026" className="text-primary underline">
              beginner investing guide
            </TrackedLink>
            {' '}
            or go straight to the
            {' '}
            <TrackedLink articleSlug="fhsa-calculator-canada-2026" ctaLabel="fhsa_tfsa_vs_rrsp_inline" to="/blog/tfsa-vs-rrsp-canada-2026" className="text-primary underline">
              TFSA vs RRSP hub
            </TrackedLink>
            {' '}
            before you assume the FHSA automatically wins.
          </p>
        </section>

        <ToolByline
          lastUpdated={PAGE_LAST_UPDATED}
          reviewer="Reviewed against CRA FHSA guidance"
          trustNote="Based on CRA FHSA rules and publicly available Canadian financial guidance. Educational use only, and contribution room should still be checked against CRA records."
        />


        <div className="mt-8">
          <EmbeddedFHSACalculator
            initialValues={EXAMPLE_INPUTS}
            title="Estimate your FHSA tax savings and growth path"
            intro="This example starts with a full-year FHSA contribution in Ontario. Change the income, province, or timeline to see how the deduction and projected balance shift."
          />
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What is an FHSA?</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">The FHSA is a first-home account with two tax advantages</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>
              The First Home Savings Account is a registered account for eligible first-time home buyers in Canada. Contributions can reduce taxable income like an RRSP, and qualifying withdrawals for a home purchase can be tax-free like a TFSA.
            </p>
            <p>
              That combination is what makes the FHSA different. The account is not just a place to park money. It is a way to lower your tax bill now while building a down-payment pool that may later come out tax-free.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">2026 FHSA contribution rules</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">The contribution rules matter almost as much as the deduction</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Annual limit',
                body: `${formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)} in 2026, before any carry-forward room is added.`,
              },
              {
                title: 'Lifetime cap',
                body: `${formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit)} in total lifetime FHSA contributions.`,
              },
              {
                title: 'Carry-forward',
                body: `Up to ${formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaMaxCarryforward)} of unused room can carry forward after the account is open.`,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The carry-forward rule is the part many people miss. If you have not opened the FHSA yet, unused room does not start stacking automatically. That is one reason the account can be worth opening earlier even if you are not ready to max it right away.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How FHSA tax savings work</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">The deduction is useful, but only when it changes a real decision</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>
              The FHSA deduction works like an RRSP deduction: the contribution can reduce taxable income for the year. The value of that deduction depends on your current marginal tax rate, which means the same
              {' '}
              {formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)}
              {' '}
              contribution is not equally valuable to every Canadian.
            </p>
            <p>
              The more useful way to think about it is this: if the FHSA deduction is meaningful now and the home-purchase plan is real, the account usually deserves first consideration. If the home timeline is uncertain, you should compare that same contribution against the
              {' '}
              <TrackedLink articleSlug="fhsa-calculator-canada-2026" ctaLabel="tfsa_inline_compare" to="/tools/tfsa-calculator" className="text-primary underline">
                TFSA calculator
              </TrackedLink>
              {' '}
              and
              {' '}
              <TrackedLink articleSlug="fhsa-calculator-canada-2026" ctaLabel="rrsp_inline_compare" to="/tools/rrsp-calculator" className="text-primary underline">
                RRSP decision tool
              </TrackedLink>
              {' '}
              before you commit.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Example scenarios by income level</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Illustrative Ontario tax-savings examples for a full-year FHSA contribution</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            These examples use Ontario as the default illustration and assume an
            {' '}
            {formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)}
            {' '}
            FHSA contribution. Use the calculator above if you want a province-specific planning view.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {INCOME_EXAMPLES.map((example) => (
              <div key={example.income} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Income example</p>
                <h3 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{formatFhsaCurrency(example.income)}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Approximate marginal rate:
                  {' '}
                  {(example.marginalRate * 100).toFixed(1)}%
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Estimated FHSA tax savings:
                  {' '}
                  <strong>{formatFhsaCurrency(example.estimatedTaxSavings)}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>


        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          {COMPARISON_CARDS.map((card) => (
            <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{card.title}</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{card.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{card.body}</p>
              <TrackedLink
                articleSlug="fhsa-calculator-canada-2026"
                ctaLabel={card.ctaLabel}
                to={card.href}
                className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-2 hover:underline"
              >
                {card.ctaText}
              </TrackedLink>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Where FHSA planning usually breaks down</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {COMMON_MISTAKES.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-secondary">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Who should open an FHSA first</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">The strongest fit is not just any first-time buyer</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {BEST_FIT_POINTS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-secondary">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Alternative path check</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">If the home timeline weakens, compare the same cash against an investing workflow</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>
              The FHSA is strongest when the home goal is real. If the timeline starts to drift or the purchase becomes less likely, you should compare the same contribution against a more flexible investing path rather than leaving the decision on autopilot.
            </p>
            <p>
              If the real question is account priority more broadly, compare the FHSA against the
              {' '}
              <TrackedLink articleSlug="fhsa-calculator-canada-2026" ctaLabel="tfsa_vs_rrsp_hub_inline" to="/blog/tfsa-vs-rrsp-canada-2026" className="text-primary underline">
                TFSA vs RRSP hub
              </TrackedLink>
              {' '}
              before you assume the home goal should dominate every contribution decision.
            </p>
            <p>
              That is where the new
              {' '}
              <TrackedLink articleSlug="fhsa-calculator-canada-2026" ctaLabel="dividend_master_guide_inline" to="/blog/500-month-dividend-canada" className="text-primary underline">
                dividend-income guide
              </TrackedLink>
              {' '}
              and the
              {' '}
              <TrackedLink articleSlug="fhsa-calculator-canada-2026" ctaLabel="dividend_calculator_inline" to="/tools/dividend-calculator" className="text-primary underline">
                dividend calculator
              </TrackedLink>
              {' '}
              become useful comparison points.
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {RELATED_DECISION_LINKS.map((item) => (
              <TrackedLink
                key={item.href}
                articleSlug="fhsa-calculator-canada-2026"
                ctaLabel={item.ctaLabel}
                to={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
              >
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
              </TrackedLink>
            ))}
          </div>
        </section>

        <MethodologyPanel
          title="Assumptions behind the FHSA examples on this page"
          summary="This article uses the same planning logic as the FHSA decision tool. The goal is to help you compare deduction value, room usage, and the longer-term account fit before opening anything."
          updated={CONTENT_LAST_REVIEWED}
          reviewer="Gourav Kumar"
          assumptions={[
            'The calculator and examples rely on a simplified marginal-tax-rate lookup by province and income.',
            'Current FHSA room is always a planning estimate until you verify it with CRA.',
            `2026 FHSA limits on this page assume an annual contribution cap of ${formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)} and a lifetime limit of ${formatFhsaCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit)}.`,
            'Growth projections use a fixed return assumption and do not model fees, volatility, or monthly price swings.',
          ]}
          sources={[
            { label: 'CRA: First Home Savings Account', href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html' },
            { label: 'Department of Finance Canada: FHSA background', href: 'https://www.canada.ca/en/department-finance/news/2022/08/design-of-the-tax-free-first-home-savings-account.html' },
            { label: 'EasyFinanceTools methodology', href: 'https://easyfinancetools.com/methodology' },
          ]}
          note="This is an educational decision page, not personal financial advice. Verify CRA room, eligibility, and qualifying-withdrawal rules before making contributions."
        />

        <ReferenceSection
          eyebrow="Source shell"
          title="Primary references to refresh when FHSA rules change"
          intro="If FHSA limits, carry-forward rules, or qualifying-withdrawal guidance change, update the local constants and then re-check these sources before republishing the page."
          references={[
            {
              label: 'CRA FHSA overview',
              body: 'Primary source for contribution rules, carry-forward treatment, qualifying withdrawals, and transfers to RRSP or RRIF.',
              href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html',
            },
            {
              label: 'Department of Finance FHSA backgrounder',
              body: 'Useful for policy context and when comparing the FHSA with the RRSP Home Buyers Plan.',
              href: 'https://www.canada.ca/en/department-finance/news/2022/08/design-of-the-tax-free-first-home-savings-account.html',
            },
            {
              label: 'Local config to update',
              body: 'If annual FHSA limits or example assumptions change, update src/config/financial.js and src/lib/fhsaPlanning.js first so the tool and article stay aligned.',
            },
          ]}
          note="Manual review needed each year: confirm annual FHSA limits, carry-forward wording, and any CRA changes to first-time home buyer interpretation."
        />


        <ActionableNextSteps
          toolName="fhsa_master_guide"
          title="What to do next after using the calculator"
          intro="The best use of this page is to move from an interesting tax estimate into a cleaner account decision. Confirm room, compare account paths, then choose a provider only after the strategy is clear."
          meaning={`An FHSA contribution only wins if the deduction, timeline, and withdrawal plan all line up. The moment that alignment weakens, the decision should be compared against TFSA, RRSP, and longer-term investing alternatives instead of assumed.`}
          steps={[
            'Confirm your current FHSA room with CRA before relying on any large contribution plan.',
            'Compare the same dollars against TFSA and RRSP scenarios before you open or fund the account.',
            'If the home plan weakens, compare the FHSA path against a broader investing workflow instead of defaulting to the deduction.',
          ]}
          actions={[
            {
              title: 'Open the full FHSA decision tool',
              body: 'Use the dedicated FHSA tool when you want the full year-by-year room and balance planner.',
              href: '/tools/fhsa-calculator',
              ctaLabel: 'open_full_fhsa_decision_tool',
            },
            {
              title: 'Compare with the TFSA calculator',
              body: 'Use the TFSA tool if flexibility and tax-free growth may beat the FHSA for your next contribution.',
              href: '/tools/tfsa-calculator',
              ctaLabel: 'compare_with_tfsa_from_fhsa_guide',
            },
            {
              title: 'Compare with the RRSP decision tool',
              body: 'Use the RRSP tool when the deduction is valuable but the first-home goal is no longer the only priority.',
              href: '/tools/rrsp-calculator',
              ctaLabel: 'compare_with_rrsp_from_fhsa_guide',
            },
            {
              title: 'Review the dividend calculator as the alternative path',
              body: 'If the home timeline stretches out, compare the FHSA plan against a longer-term dividend-income workflow.',
              href: '/tools/dividend-calculator',
              ctaLabel: 'compare_with_dividend_calculator_from_fhsa_guide',
              destinationType: 'tool',
            },
          ]}
          referral={{
            placement: 'fhsa_master_guide',
            badge: 'Useful next step',
            title: 'Open an FHSA with Wealthsimple after the account decision is clear',
            highlight: 'FHSA',
            description: 'If the FHSA still looks like the right account after you compare it with TFSA and RRSP alternatives, opening a simple investing account can be a reasonable next step.',
            fitHeading: 'When this CTA makes sense',
            fitPoints: [
              'You already know the FHSA should get the next contribution.',
              'You want a simple way to hold cash, ETFs, or a conservative home-savings mix inside the account.',
              'You have already checked eligibility, room, and the home-purchase timeline before opening the account.',
            ],
            details: 'Use the referral code at signup | Keep comparing account features, fees, and product options before deciding',
            disclosure: 'Affiliate disclosure: We may earn a referral bonus if you sign up using this code. That does not change the account comparisons, examples, or rule explanations on this page.',
            buttonLabel: 'Open FHSA with Wealthsimple',
          }}
        />

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Questions Canadians usually ask before opening an FHSA</h2>
          <div className="mt-5 space-y-4">
            {FAQS.map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
