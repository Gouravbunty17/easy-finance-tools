import React from 'react';
import SEO from '../../components/SEO';
import BlogHero from '../../components/BlogHero';
import TLDRBox from '../../components/TLDRBox';
import ArticleSchema from '../../components/ArticleSchema';
import FAQSchema from '../../components/FAQSchema';
import MethodologyPanel from '../../components/MethodologyPanel';
import ReferenceSection from '../../components/ReferenceSection';
import ActionableNextSteps from '../../components/ActionableNextSteps';
import EzoicAd from '../../components/EzoicAd';
import ToolByline from '../../components/ToolByline';
import TrackedLink from '../../components/TrackedLink';
import {
  CONTENT_LAST_REVIEWED,
  REGISTERED_ACCOUNT_LIMITS,
  RRSP_RULES,
} from '../../config/financial';

function formatCurrency(value, digits = 0) {
  return Number(value || 0).toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

const FAQS = [
  {
    q: 'Is FHSA better than RRSP for a down payment?',
    a: 'Often yes when you are an eligible first-time buyer and the goal is specifically a home purchase. The FHSA combines a tax deduction with a tax-free qualifying withdrawal, while the RRSP Home Buyers Plan uses your own RRSP money and usually creates a later repayment obligation.',
  },
  {
    q: 'Can I use FHSA and RRSP together?',
    a: 'Yes, many Canadians use both over time. A common pattern is funding the FHSA first for the cleaner first-home tax treatment, then using RRSP contributions when the deduction is still valuable or the down-payment goal needs more support.',
  },
  {
    q: 'Can I use FHSA and the Home Buyers Plan together?',
    a: 'Usually yes, provided you meet the CRA rules for both programs. That can make sense when you have meaningful FHSA room and already built RRSP assets that can be withdrawn through the Home Buyers Plan.',
  },
  {
    q: "What happens if I don't buy a home?",
    a: 'If you never make a qualifying FHSA withdrawal, FHSA assets can generally be transferred to an RRSP or RRIF on a tax-deferred basis if the rules are met. RRSP money simply stays in the RRSP, but any Home Buyers Plan withdrawals that were already made still have their own repayment requirements.',
  },
  {
    q: 'Which account should I fund first?',
    a: 'The FHSA often comes first when you are eligible, the purchase timeline is real, and the deduction is useful today. The RRSP can come first when retirement savings are behind, the deduction is especially valuable, or you do not yet know whether the first-home goal is the main priority.',
  },
  {
    q: 'Does income level change the answer?',
    a: 'Yes. The value of the deduction rises as your marginal tax rate rises, so higher-income Canadians often get more immediate value from both FHSA and RRSP contributions. Lower or moderate incomes can still benefit, but the flexibility tradeoff with the TFSA matters more.',
  },
  {
    q: 'Should I use a TFSA instead?',
    a: 'Sometimes. The TFSA can be the cleaner first account when the home timeline is uncertain, flexibility matters, or you do not want qualifying-withdrawal and repayment rules shaping the decision.',
  },
];

const QUICK_COMPARISON_ROWS = [
  {
    label: 'Primary tax benefit',
    fhsa: 'Contribution can reduce taxable income today.',
    rrsp: 'Contribution can reduce taxable income today, too.',
  },
  {
    label: 'Home purchase withdrawal',
    fhsa: 'Qualifying withdrawal is generally tax-free.',
    rrsp: `The Home Buyers Plan lets you withdraw up to ${formatCurrency(RRSP_RULES.homeBuyersPlanWithdrawalLimit)} from your RRSP for a qualifying home purchase.`,
  },
  {
    label: 'Repayment pressure',
    fhsa: 'No repayment required after a qualifying withdrawal.',
    rrsp: `Home Buyers Plan withdrawals usually have to be repaid over ${RRSP_RULES.homeBuyersPlanRepaymentYears} years or the shortfall becomes taxable income.`,
  },
  {
    label: 'If you never buy a home',
    fhsa: 'Can often transfer to an RRSP or RRIF on a tax-deferred basis if the rules are met.',
    rrsp: 'Still remains retirement money, but there is no tax-free home-purchase withdrawal unless you use the Home Buyers Plan rules.',
  },
  {
    label: 'Best first use case',
    fhsa: 'Often the first account for eligible first-time buyers with a real purchase timeline.',
    rrsp: 'Stronger when retirement savings are still the main job or when the deduction is too valuable to ignore.',
  },
];

const SCENARIO_CARDS = [
  {
    title: 'Income around $70,000 and buying in 2 to 4 years',
    body: `The FHSA usually comes first. The annual ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)} contribution can still create a useful deduction, and the qualifying withdrawal is cleaner than borrowing from your own RRSP through the Home Buyers Plan.`,
    nextMove: 'Start with the FHSA calculator, then compare any extra savings with the TFSA.',
  },
  {
    title: 'Income around $140,000 with strong cash flow',
    body: 'This is where using both can make sense. The FHSA often deserves the first dollars because of the tax-free qualifying withdrawal, but the RRSP can still matter if the deduction is powerful and you already know the first-home plan is real.',
    nextMove: 'Max the FHSA decision first, then test whether extra RRSP contributions improve the overall down-payment and tax picture.',
  },
  {
    title: 'Home timeline uncertain or goals still moving',
    body: 'The RRSP may still matter, but the TFSA often becomes the cleaner comparison account. If you are not sure the home purchase will happen on schedule, flexibility starts to compete with the FHSA deduction.',
    nextMove: 'Compare FHSA, RRSP, and TFSA before defaulting to the deduction.',
  },
];

const COMMON_MISTAKES = [
  'Treating the RRSP Home Buyers Plan as free money instead of a future repayment obligation.',
  'Funding the RRSP first just because the refund looks bigger, without checking whether the FHSA would create a cleaner first-home outcome.',
  'Ignoring the TFSA when the home timeline is uncertain and flexibility matters more than a deduction.',
  'Missing carry-forward room because the FHSA was not opened early enough.',
  'Using an aggressive investment mix even though the down-payment window is short.',
];

export default function FHSAvsRRSPDownPaymentCanada2026() {
  return (
    <div>
      <SEO
        title="FHSA vs RRSP for a Down Payment (Canada 2026)"
        description="Compare FHSA and RRSP for a down payment in Canada, including tax treatment, withdrawals, and which account comes first."
        canonical="https://easyfinancetools.com/blog/fhsa-vs-rrsp-down-payment-canada-2026"
      />
      <ArticleSchema
        headline="FHSA vs RRSP for a Down Payment in Canada (2026)"
        description="Compare the FHSA against the RRSP Home Buyers Plan for a down payment in Canada, including deduction value, withdrawal rules, repayment tradeoffs, and which account usually comes first."
        url="https://easyfinancetools.com/blog/fhsa-vs-rrsp-down-payment-canada-2026"
        datePublished="2026-04-23"
        dateModified="2026-04-23"
      />
      <FAQSchema faqs={FAQS} />

      <BlogHero
        icon="FHSA"
        category="FHSA | RRSP | First home"
        title="FHSA vs RRSP for a Down Payment in Canada (2026)"
        date="April 23, 2026"
        readTime="10 min read"
        gradient="from-emerald-500 to-cyan-700"
      />

      <section className="mx-auto max-w-5xl px-4 py-12">
        <TLDRBox
          headline="FHSA vs RRSP: which account usually wins for a down payment?"
          answer={`The FHSA is usually the better first account when you are an eligible first-time buyer because it combines a deduction with a tax-free qualifying withdrawal. The RRSP still matters when the deduction is especially valuable, retirement savings are behind, or you want to layer the Home Buyers Plan on top of the FHSA. In many cases, using both can make sense, but the FHSA often deserves the first ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)} each year.`}
          points={[
            'FHSA often wins first because qualifying withdrawals are generally tax-free and do not create a repayment schedule.',
            `RRSP matters when the deduction is large enough to justify adding the Home Buyers Plan, which currently allows up to ${formatCurrency(RRSP_RULES.homeBuyersPlanWithdrawalLimit)} of RRSP withdrawals for a qualifying home purchase.`,
            'Using both can make sense when the first-home goal is real, income is strong, and you still want the RRSP deduction after funding the FHSA.',
          ]}
        />

        <article className="prose prose-lg prose-neutral max-w-none dark:prose-invert">
          <p className="lead">
            The real question is not whether the FHSA or RRSP is better in the abstract. It is whether your next dollar should chase a cleaner first-home withdrawal, a stronger immediate deduction, or a more flexible savings path.
          </p>

          <p>
            If you want the full first-home planner first, start with the
            {' '}
            <TrackedLink articleSlug="fhsa-vs-rrsp-down-payment-canada-2026" ctaLabel="inline_fhsa_tool" to="/tools/fhsa-calculator" className="text-primary underline">
              FHSA decision tool
            </TrackedLink>
            .
            If you want to test the RRSP side of the tradeoff, open the
            {' '}
            <TrackedLink articleSlug="fhsa-vs-rrsp-down-payment-canada-2026" ctaLabel="inline_rrsp_tool" to="/tools/rrsp-calculator" className="text-primary underline">
              RRSP decision tool
            </TrackedLink>
            .
          </p>
        </article>

        {/* Temporary Ezoic placeholder ID 102. Replace with the real Ezoic placement ID from the dashboard. */}
        <EzoicAd
          placementId={102}
          wrapperClassName="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-gray-800"
        />

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Quick comparison</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">FHSA vs RRSP for a down payment at a glance</h2>
          <ToolByline
            lastUpdated="April 23, 2026"
            reviewer="Reviewed against CRA FHSA and Home Buyers Plan rules"
            trustNote="Based on CRA FHSA and Home Buyers Plan guidance plus publicly available Canadian financial information. Educational use only, not personalized tax or mortgage advice."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The easiest way to avoid a bad choice is to stop treating these accounts as interchangeable. They can both reduce tax today, but they do not create the same withdrawal outcome later.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                  <th className="py-3 pr-4 font-semibold">Decision point</th>
                  <th className="py-3 pr-4 font-semibold text-primary dark:text-accent">FHSA</th>
                  <th className="py-3 font-semibold text-primary dark:text-accent">RRSP + Home Buyers Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 dark:divide-slate-800 dark:text-slate-300">
                {QUICK_COMPARISON_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-white">{row.label}</td>
                    <td className="py-4 pr-4">{row.fhsa}</td>
                    <td className="py-4">{row.rrsp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How FHSA works</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">The FHSA is purpose-built for the first-home job</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <p>
                The FHSA lets eligible first-time home buyers contribute up to
                {' '}
                {formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)}
                {' '}
                per year in 2026, subject to the lifetime cap, and claim a deduction like an RRSP.
              </p>
              <p>
                The key advantage is what happens later. If the withdrawal qualifies, both the original contribution and the growth can come out tax-free for the home purchase. That is why the FHSA usually gets the first look for a down-payment plan.
              </p>
              <p>
                For a fuller walk-through of contribution room, tax savings, and projected growth, see the
                {' '}
                <TrackedLink articleSlug="fhsa-vs-rrsp-down-payment-canada-2026" ctaLabel="inline_fhsa_master_guide" to="/blog/fhsa-calculator-canada-2026" className="text-primary underline">
                  FHSA tax savings and growth guide
                </TrackedLink>
                .
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How RRSP + HBP works</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">The RRSP can still help, but the money is not truly out and done</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <p>
                RRSP contributions can also reduce taxable income today. If you later qualify for the Home Buyers Plan, you can withdraw up to
                {' '}
                {formatCurrency(RRSP_RULES.homeBuyersPlanWithdrawalLimit)}
                {' '}
                from the RRSP for the home purchase.
              </p>
              <p>
                The important tradeoff is that the Home Buyers Plan is not a tax-free permanent exit. It is your own RRSP money coming out under a special rule, and the withdrawn amount normally has to be repaid over time or the unpaid portion can become taxable income.
              </p>
              <p>
                That is why the RRSP often matters most after the FHSA is already in motion or when the deduction is strong enough that the extra complexity still makes sense.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Key tax differences</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">The deduction looks similar up front, but the exit path is different</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="text-lg font-bold text-primary dark:text-accent">FHSA tax treatment</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Contributions can reduce taxable income now, and a qualifying home withdrawal is generally tax-free. That combination makes the FHSA the cleaner first-home account for many Canadians.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="text-lg font-bold text-primary dark:text-accent">RRSP tax treatment</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Contributions can reduce taxable income now, but Home Buyers Plan withdrawals are better thought of as a temporary use of RRSP assets. The repayment obligation is what makes the RRSP less clean for the home job than the FHSA.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Withdrawal differences</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">The withdrawal rules often decide the winner</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>
              The FHSA usually wins this section because the qualifying withdrawal can be tax-free and does not create a repayment schedule. That means the money can stay focused on the down payment instead of creating a future savings obligation.
            </p>
            <p>
              The RRSP Home Buyers Plan can still be useful, especially if you already built substantial RRSP assets. But it comes with more moving parts, and you should treat the repayment schedule as part of the cost of the decision, not an afterthought.
            </p>
            <p>
              If the home timeline is no longer clear, compare both accounts against the
              {' '}
              <TrackedLink articleSlug="fhsa-vs-rrsp-down-payment-canada-2026" ctaLabel="inline_tfsa_tool" to="/tools/tfsa-calculator" className="text-primary underline">
                TFSA calculator
              </TrackedLink>
              {' '}
              before you assume the deduction should win.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Contribution tradeoffs</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">The question is not just which account is better, but what your next dollar should do</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>
              If your first-home plan is real and you still have FHSA room, that room usually deserves priority. The annual contribution cap is smaller than what the RRSP can absorb, but the first-home tax treatment is usually stronger.
            </p>
            <p>
              After that, the RRSP can still earn its place if the deduction is meaningful and you either need more down-payment support or want to keep retirement contributions moving too.
            </p>
            <p>
              If the home question is only one part of the bigger account decision, compare this page against the
              {' '}
              <TrackedLink articleSlug="fhsa-vs-rrsp-down-payment-canada-2026" ctaLabel="tfsa_vs_rrsp_hub_inline" to="/blog/tfsa-vs-rrsp-canada-2026" className="text-primary underline">
                TFSA vs RRSP guide
              </TrackedLink>
              {' '}
              before you decide where every long-term contribution should go.
            </p>
            <p>
              If both accounts are competing with long-term investing, test the alternative against the
              {' '}
              <TrackedLink articleSlug="fhsa-vs-rrsp-down-payment-canada-2026" ctaLabel="inline_dividend_tool" to="/tools/dividend-calculator" className="text-primary underline">
                dividend calculator
              </TrackedLink>
              {' '}
              and the
              {' '}
              <TrackedLink articleSlug="fhsa-vs-rrsp-down-payment-canada-2026" ctaLabel="inline_dividend_article" to="/blog/500-month-dividend-canada" className="text-primary underline">
                dividend-income guide
              </TrackedLink>
              {' '}
              so the home decision does not happen in a vacuum.
            </p>
          </div>
        </section>

        {/* Temporary Ezoic placeholder ID 103. Replace with the real Ezoic placement ID from the dashboard. */}
        <EzoicAd
          placementId={103}
          wrapperClassName="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-gray-800"
        />

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Scenario examples</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Plain-English examples by income and goal</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {SCENARIO_CARDS.map((scenario) => (
              <div key={scenario.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{scenario.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{scenario.body}</p>
                <div className="mt-4 rounded-2xl border border-blue-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  <p className="font-semibold text-primary dark:text-accent">Best next move</p>
                  <p className="mt-2 leading-7">{scenario.nextMove}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">FHSA first</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">When FHSA should come first</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>- You are an eligible first-time buyer and the purchase timeline is believable.</li>
              <li>- The deduction matters, but you also want the cleanest withdrawal path later.</li>
              <li>- You still have FHSA room and have not used the annual limit yet.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">RRSP first</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">When RRSP should come first</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>- Retirement savings are the bigger job and the first-home timeline is less certain.</li>
              <li>- Your current marginal tax rate is high enough that the deduction is doing serious work.</li>
              <li>- You already have a reason to keep RRSP contributions moving regardless of the home purchase.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Using both</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">When using both makes sense</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>- You can fund the FHSA first and still have cash flow left for RRSP contributions.</li>
              <li>- The down-payment goal is large enough that layered account planning improves the outcome.</li>
              <li>- You are comfortable managing both the FHSA rules and the Home Buyers Plan repayment path.</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Mistakes that usually create the wrong account decision</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {COMMON_MISTAKES.map((mistake) => (
              <div key={mistake} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{mistake}</p>
              </div>
            ))}
          </div>
        </section>

        <MethodologyPanel
          title="Assumptions behind this FHSA vs RRSP comparison"
          summary="This article is a planning guide, not a tax filing engine. It compares the account structures, typical deduction logic, and the broad first-home tradeoffs that matter most before you fund the next account."
          updated={CONTENT_LAST_REVIEWED}
          reviewer="Gourav Kumar"
          assumptions={[
            `FHSA examples assume a 2026 annual contribution limit of ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)} and a lifetime limit of ${formatCurrency(REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit)}.`,
            `RRSP Home Buyers Plan examples assume a current withdrawal ceiling of ${formatCurrency(RRSP_RULES.homeBuyersPlanWithdrawalLimit)}.`,
            'This page compares deduction and withdrawal structure at a high level and does not replace CRA room reporting or personal tax advice.',
            'The value of either account still depends on your province, marginal tax rate, existing room, and how real the home timeline actually is.',
          ]}
          sources={[
            { label: 'CRA: First Home Savings Account', href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html' },
            { label: 'CRA: How to participate in the Home Buyers Plan', href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan/participate-home-buyers-plan.html' },
            { label: 'EasyFinanceTools methodology', href: 'https://easyfinancetools.com/methodology' },
          ]}
          note="If you are already near a purchase date, confirm room, eligibility, and withdrawal timing directly with CRA guidance before acting."
        />

        <ReferenceSection
          eyebrow="Source shell"
          title="Primary references to refresh when FHSA or HBP rules change"
          intro="If FHSA limits, Home Buyers Plan limits, or repayment wording change, update the comparison page after re-checking these primary sources."
          references={[
            {
              label: 'CRA FHSA overview',
              body: 'Primary source for FHSA eligibility, contribution rules, qualifying withdrawals, and transfers to RRSP or RRIF.',
              href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html',
            },
            {
              label: 'CRA HBP participation rules',
              body: 'Primary source for Home Buyers Plan eligibility and withdrawal limits.',
              href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan/participate-home-buyers-plan.html',
            },
            {
              label: 'CRA HBP repayment rules',
              body: 'Use this page to confirm how repayment timing applies to the current withdrawal year.',
              href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan/repay-funds-withdrawn-rrsp-s-under-home-buyers-plan.html',
            },
            {
              label: 'Department of Finance FHSA backgrounder',
              body: 'Helpful for policy context and combined FHSA plus HBP planning.',
              href: 'https://www.canada.ca/en/department-finance/news/2022/08/design-of-the-tax-free-first-home-savings-account.html',
            },
          ]}
          note="Manual review needed each year: confirm FHSA annual and lifetime limits, HBP withdrawal limit, and repayment timing for the current withdrawal year."
        />

        {/* Temporary Ezoic placeholder ID 104. Replace with the real Ezoic placement ID from the dashboard. */}
        <EzoicAd
          placementId={104}
          wrapperClassName="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-gray-800"
        />

        <ActionableNextSteps
          toolName="fhsa-vs-rrsp-down-payment-canada-2026"
          title="What to do next after the FHSA vs RRSP comparison"
          intro="The right next step is usually not opening an account blindly. It is checking which account should get the next contribution, then testing the alternative before you commit."
          meaning="If the first-home goal is real, the FHSA usually deserves the first contribution. If the tax deduction is unusually valuable or the down-payment need is larger, the RRSP can still matter. If the plan is fuzzy, the TFSA may deserve more respect than the refund does."
          steps={[
            'Run the FHSA calculator first if you still have FHSA room and the home plan is real.',
            'Use the RRSP decision tool to test whether the deduction is strong enough to justify adding the Home Buyers Plan.',
            'Compare both ideas against the TFSA if flexibility matters more than the deduction.',
            'If the home timeline weakens, compare the same cash against a longer-term dividend-income workflow instead of forcing a first-home account.',
          ]}
          actions={[
            {
              href: '/tools/fhsa-calculator',
              title: 'Run the FHSA decision tool',
              body: 'Use the full FHSA tool to estimate tax savings, annual room use, and long-term growth before opening anything.',
              ctaLabel: 'open_fhsa_tool_from_fhsa_vs_rrsp',
            },
            {
              href: '/tools/rrsp-calculator',
              title: 'Open the RRSP decision tool',
              body: 'Use the RRSP tool if the deduction is large enough that the Home Buyers Plan still deserves a serious comparison.',
              ctaLabel: 'open_rrsp_tool_from_fhsa_vs_rrsp',
            },
            {
              href: '/tools/tfsa-calculator',
              title: 'Test the TFSA as the flexible alternative',
              body: 'Use the TFSA calculator when the home purchase is less certain or clean liquidity matters more than the deduction.',
              ctaLabel: 'open_tfsa_tool_from_fhsa_vs_rrsp',
            },
            {
              href: '/tools/dividend-calculator',
              title: 'Compare with the dividend calculator',
              body: 'If the home timeline slips, compare the same cash against a longer-term investing path instead of defaulting to the first-home account.',
              ctaLabel: 'open_dividend_tool_from_fhsa_vs_rrsp',
            },
            {
              href: '/blog/fhsa-calculator-canada-2026',
              title: 'Read the FHSA tax savings and growth guide',
              body: 'Use the FHSA master guide when you want more detail on contribution rules, deduction value, and growth assumptions.',
              ctaLabel: 'open_fhsa_master_guide_from_comparison',
            },
            {
              href: '/blog/500-month-dividend-canada',
              title: 'Review the dividend-income alternative',
              body: 'Use the dividend article if the first-home plan is competing with longer-term ETF income goals.',
              ctaLabel: 'open_dividend_article_from_fhsa_vs_rrsp',
            },
          ]}
          referral={{
            label: 'Useful next step',
            title: 'Open an FHSA with Wealthsimple only after the account choice is clear',
            description: 'If the FHSA still looks like the right first account after you compare it with RRSP and TFSA alternatives, a simple investing platform can be a reasonable next step.',
            code: 'R8F7ZW',
            href: 'https://wealthsimple.com/invite/R8F7ZW',
            body: 'When this CTA makes sense',
            bullets: [
              'You already know the FHSA should get the next contribution.',
              'You want a simple way to hold cash or ETFs inside the account.',
              'You have already checked room, eligibility, and the purchase timeline before opening the account.',
            ],
            disclosure: 'Use the referral code at signup | Keep comparing account features, fees, and product options before deciding',
            slug: 'fhsa',
          }}
        />

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Questions Canadians ask before choosing FHSA or RRSP first</h2>
          <div className="mt-5 space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{faq.q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
