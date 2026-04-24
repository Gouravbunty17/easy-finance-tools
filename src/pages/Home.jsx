import React from 'react';
import SEO from '../components/SEO';
import SurfaceTrackedLink from '../components/SurfaceTrackedLink';
import ReferralSection from '../components/ReferralSection';
import EducationalDisclaimer from '../components/EducationalDisclaimer';

const GOAL_CARDS = [
  {
    title: 'Pay less tax',
    description: 'Use the TFSA vs RRSP decision guide when the next contribution could land in more than one registered account.',
    href: '/blog/tfsa-vs-rrsp-canada-2026',
    cta: 'Compare TFSA vs RRSP',
    ctaLabel: 'goal_pay_less_tax',
    badge: 'Reduce taxes / choose account',
    goalType: 'tax',
  },
  {
    title: 'Buy your first home',
    description: 'Start with the FHSA guide when you need to estimate tax savings, room use, and whether the FHSA should come first.',
    href: '/blog/fhsa-calculator-canada-2026',
    cta: 'Plan your FHSA',
    ctaLabel: 'goal_buy_first_home',
    badge: 'First-home planning',
    goalType: 'home',
  },
  {
    title: 'Build dividend income',
    description: 'Use the dividend-income guide to see what capital target, yield, and account choice make the income goal realistic.',
    href: '/blog/500-month-dividend-canada',
    cta: 'Plan dividend income',
    ctaLabel: 'goal_build_dividend_income',
    badge: 'Income planning',
    goalType: 'income',
  },
  {
    title: 'Learn to invest',
    description: 'Start with the beginner guide if you need help choosing between TFSA, RRSP, FHSA, ETFs, and the first account to open.',
    href: '/blog/how-to-start-investing-canada-2026',
    cta: 'Read the beginner guide',
    ctaLabel: 'goal_learn_to_invest',
    badge: 'Beginners',
    goalType: 'beginner',
  },
];

const GUIDE_CARDS = [
  {
    title: 'TFSA vs RRSP in Canada (2026)',
    description: 'Figure out which account should get the next contribution based on income, tax treatment, and flexibility.',
    href: '/blog/tfsa-vs-rrsp-canada-2026',
    ctaLabel: 'guide_tfsa_vs_rrsp',
    guideName: 'tfsa_vs_rrsp',
  },
  {
    title: 'FHSA Calculator Canada (2026)',
    description: 'Estimate FHSA tax savings, understand the rules, and see when the account should outrank TFSA or RRSP.',
    href: '/blog/fhsa-calculator-canada-2026',
    ctaLabel: 'guide_fhsa_calculator_canada',
    guideName: 'fhsa_calculator_canada',
  },
  {
    title: 'How to Start Investing in Canada (2026)',
    description: 'Start with a beginner-friendly plan for choosing accounts, using ETFs, and taking practical first steps.',
    href: '/blog/how-to-start-investing-canada-2026',
    ctaLabel: 'guide_how_to_start_investing',
    guideName: 'how_to_start_investing',
  },
];

const CALCULATOR_CARDS = [
  {
    title: 'TFSA calculator',
    description: 'Check TFSA room and see tax-free growth potential before you commit the next contribution.',
    href: '/tools/tfsa-calculator',
    ctaLabel: 'calculator_tfsa',
  },
  {
    title: 'RRSP calculator',
    description: 'Estimate RRSP tax savings and retirement impact so the deduction is measured against the right goal.',
    href: '/tools/rrsp-calculator',
    ctaLabel: 'calculator_rrsp',
  },
  {
    title: 'FHSA calculator',
    description: 'Plan FHSA contributions, projected growth, and tax savings before opening the account or making the deposit.',
    href: '/tools/fhsa-calculator',
    ctaLabel: 'calculator_fhsa',
  },
  {
    title: 'Dividend calculator',
    description: 'Estimate monthly dividend income and DRIP growth before you rely on yield headlines or rough guesses.',
    href: '/tools/dividend-calculator',
    ctaLabel: 'calculator_dividend',
  },
];

const ACCOUNT_COMPARISON_LINKS = [
  {
    title: 'Compare TFSA vs RRSP first',
    description: 'Best starting point when the next registered-account contribution is still undecided.',
    href: '/blog/tfsa-vs-rrsp-canada-2026',
    ctaLabel: 'comparison_strip_tfsa_vs_rrsp',
  },
  {
    title: 'See when FHSA beats RRSP for a down payment',
    description: 'Use this if a first home is making the account decision more complicated than a simple tax comparison.',
    href: '/blog/fhsa-vs-rrsp-down-payment-canada-2026',
    ctaLabel: 'comparison_strip_fhsa_vs_rrsp_down_payment',
  },
  {
    title: 'Bring the FHSA into the account decision',
    description: 'Use the FHSA guide if the first-home goal could change which account should come first.',
    href: '/blog/fhsa-calculator-canada-2026',
    ctaLabel: 'comparison_strip_fhsa_guide',
  },
];

const NEXT_STEP_CARDS = [
  {
    title: 'Saving for a home',
    description: 'Use the FHSA guide and calculator to decide whether the home goal should outrank other contributions.',
    href: '/blog/fhsa-calculator-canada-2026',
    cta: 'Go to FHSA planning',
    ctaLabel: 'next_step_home',
  },
  {
    title: 'Building passive income',
    description: 'Use the dividend-income guide to see what monthly income targets really require before you buy an ETF.',
    href: '/blog/500-month-dividend-canada',
    cta: 'Go to dividend income guide',
    ctaLabel: 'next_step_dividend_income',
  },
  {
    title: 'Starting from scratch',
    description: 'Use the beginner guide if you want one clear path through accounts, ETFs, and your first investing steps.',
    href: '/blog/how-to-start-investing-canada-2026',
    cta: 'Go to beginner investing guide',
    ctaLabel: 'next_step_beginner',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Canadian TFSA, RRSP & FHSA Calculators (Free)"
        description="Run TFSA, RRSP, FHSA and dividend calculations instantly. No signup. Built for Canadians."
        canonical="https://easyfinancetools.com/"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-20 text-white">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at top left, white 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        <div className="absolute -right-16 top-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_340px] lg:items-center">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                <span className="rounded-full bg-white/15 px-4 py-1.5">Built for Canadians</span>
                <span className="rounded-full bg-white/15 px-4 py-1.5">Practical guides</span>
                <span className="rounded-full bg-white/15 px-4 py-1.5">Clear next steps</span>
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Make better money decisions in Canada
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-blue-100 md:text-xl">
                Compare TFSA vs RRSP, estimate FHSA tax savings, and plan dividend income with practical tools built for Canadians.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <SurfaceTrackedLink
                  to="/blog/tfsa-vs-rrsp-canada-2026"
                  eventName="homepage_cta_click"
                  ctaLabel="hero_compare_tfsa_vs_rrsp"
                  trackingParams={{ section: 'hero', destination_type: 'article' }}
                  className="rounded-2xl bg-white px-6 py-4 text-lg font-bold text-primary transition hover:bg-blue-50"
                >
                  Compare TFSA vs RRSP
                </SurfaceTrackedLink>
                <SurfaceTrackedLink
                  to="/tools"
                  eventName="homepage_cta_click"
                  ctaLabel="hero_open_tools"
                  trackingParams={{ section: 'hero', destination_type: 'hub' }}
                  className="rounded-2xl border border-white/25 px-6 py-4 text-lg font-bold text-white transition hover:bg-white/10"
                >
                  Explore calculators
                </SurfaceTrackedLink>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Where most visitors start</p>
              <div className="mt-5 grid gap-3">
                {[
                  'Compare TFSA vs RRSP when the next contribution is still undecided.',
                  'Open FHSA planning when a first home could change the account order.',
                  'Use the dividend path only after the account decision is clear.',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm text-blue-50">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="surface-soft p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Start with your goal</p>
              <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Pick the clearest next question, then follow the matching path</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {GOAL_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{card.badge}</p>
                <h3 className="mt-2 text-xl font-bold text-primary dark:text-accent">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{card.description}</p>
                <SurfaceTrackedLink
                  to={card.href}
                  eventName="goal_card_click"
                  ctaLabel={card.ctaLabel}
                  trackingParams={{ section: 'start_with_goal', destination_type: 'article', goal_type: card.goalType }}
                  className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
                >
                  {card.cta}
                </SurfaceTrackedLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="surface-soft p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Most useful guides right now</p>
              <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Read the pages that answer the biggest account decisions first</h2>
            </div>
            <SurfaceTrackedLink
              to="/blog"
              eventName="homepage_cta_click"
              ctaLabel="most_useful_guides_view_all"
              trackingParams={{ section: 'most_useful_guides', destination_type: 'hub' }}
              className="text-sm font-semibold text-primary underline dark:text-secondary"
            >
              View all guides
            </SurfaceTrackedLink>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {GUIDE_CARDS.map((guide) => (
              <SurfaceTrackedLink
                key={guide.href}
                to={guide.href}
                eventName="guide_click"
                ctaLabel={guide.ctaLabel}
                trackingParams={{ section: 'most_useful_guides', destination_type: 'article', guide_name: guide.guideName }}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <h3 className="text-xl font-bold text-primary dark:text-accent">{guide.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{guide.description}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-secondary">Read guide</span>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="surface-soft p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Featured calculators</p>
              <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Use the core calculators after the guide makes the decision clearer</h2>
            </div>
            <SurfaceTrackedLink
              to="/tools"
              eventName="homepage_cta_click"
              ctaLabel="featured_calculators_view_all"
              trackingParams={{ section: 'featured_calculators', destination_type: 'hub' }}
              className="text-sm font-semibold text-primary underline dark:text-secondary"
            >
              View all calculators
            </SurfaceTrackedLink>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {CALCULATOR_CARDS.map((tool) => (
              <SurfaceTrackedLink
                key={tool.href}
                to={tool.href}
                eventName="homepage_cta_click"
                ctaLabel={tool.ctaLabel}
                trackingParams={{ section: 'featured_calculators', destination_type: 'tool' }}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <h3 className="text-xl font-bold text-primary dark:text-accent">{tool.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{tool.description}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-secondary">Open calculator</span>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Account comparison strip</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Not sure where to put your next dollar?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Start with the comparison page that matches the real tradeoff. These are the three pages most likely to unblock the next account decision.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {ACCOUNT_COMPARISON_LINKS.map((item) => (
              <SurfaceTrackedLink
                key={item.href}
                to={item.href}
                eventName="homepage_cta_click"
                ctaLabel={item.ctaLabel}
                trackingParams={{ section: 'account_comparison_strip', destination_type: 'article' }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
              >
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="surface-soft p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Popular next steps</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Pick the path that matches what you want the money to do next</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {NEXT_STEP_CARDS.map((item) => (
              <div key={item.href} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-xl font-bold text-primary dark:text-accent">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                <SurfaceTrackedLink
                  to={item.href}
                  eventName="homepage_cta_click"
                  ctaLabel={item.ctaLabel}
                  trackingParams={{ section: 'popular_next_steps', destination_type: 'article' }}
                  className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
                >
                  {item.cta}
                </SurfaceTrackedLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-4">
        <EducationalDisclaimer />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <ReferralSection
          placement="homepage_lower_router_cta"
          badge="Helpful next step"
          title="Open an investing account after the account choice is clear"
          highlight="investing account"
          description="If the homepage helped you decide between TFSA, RRSP, FHSA, or a dividend-income path, a low-friction investing account can be a reasonable next step after the strategy is settled."
          fitHeading="When this CTA makes sense"
          fitPoints={[
            'You already know which account or path should come first.',
            'You want a simple place to buy and hold ETFs without adding more decision noise.',
            'You have already used the guides and calculators to narrow the strategy.',
          ]}
          details="Use the referral code at signup | Keep comparing fees, account features, and product options before deciding"
          disclosure="Affiliate disclosure: We may earn a referral bonus if you sign up using this code. That does not change how the homepage routes users into guides, calculators, or account comparisons."
          buttonLabel="Open an account with Wealthsimple"
        />
      </section>
    </main>
  );
}
