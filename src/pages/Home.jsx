import React from 'react';
import SEO from '../components/SEO';
import ArticleImage from '../components/ArticleImage';
import SurfaceTrackedLink from '../components/SurfaceTrackedLink';
import EducationalDisclaimer from '../components/EducationalDisclaimer';
import FAQSchema from '../components/FAQSchema';
import TopicClusterMap from '../components/TopicClusterMap';

const GOAL_CARDS = [
  {
    title: 'Pay less tax',
    description: 'Answer a few questions first, then use the TFSA, RRSP, or FHSA calculator that matches the account decision.',
    href: '/tools/account-decision-tool',
    cta: 'Use decision tool',
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
    title: 'TFSA Contribution Room Canada 2026',
    description: 'Check the 2026 TFSA limit, withdrawal timing, CRA room updates, and the mistakes that cause over-contributions.',
    href: '/blog/tfsa-contribution-room-canada-2026',
    ctaLabel: 'guide_tfsa_contribution_room',
    guideName: 'tfsa_contribution_room',
  },
  {
    title: 'TFSA vs RRSP vs FHSA',
    description: 'Compare the three major registered accounts when a home goal, tax deduction, and flexible investing all compete.',
    href: '/blog/tfsa-vs-rrsp-vs-fhsa-canada',
    ctaLabel: 'guide_tfsa_rrsp_fhsa',
    guideName: 'tfsa_rrsp_fhsa',
  },
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

const LATEST_GUIDES = [
  {
    title: 'How to Choose ETFs in Canada',
    description: 'A practical checklist for asset allocation, fees, diversification, currency, and risk.',
    href: '/blog/how-to-choose-etfs-canada',
    slug: 'how-to-choose-etfs-canada',
    category: 'ETF Guides',
  },
  {
    title: 'TFSA Investing Mistakes Canadians Should Avoid',
    description: 'Avoid overcontributions, withdrawal timing errors, short-term risk, and trading tax issues.',
    href: '/blog/tfsa-investing-mistakes-canada',
    slug: 'tfsa-investing-mistakes-canada',
    category: 'TFSA',
  },
  {
    title: 'Covered Call ETFs in Canada Explained',
    description: 'Understand higher income, option premiums, upside tradeoffs, and total-return risk.',
    href: '/blog/covered-call-etfs-canada-explained',
    slug: 'covered-call-etfs-canada-explained',
    category: 'Dividend Investing',
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
    title: 'Compare TFSA vs RRSP vs FHSA',
    description: 'Useful starting point when your home, retirement, and flexible investing goals are all competing.',
    href: '/blog/tfsa-vs-rrsp-vs-fhsa-canada',
    ctaLabel: 'comparison_strip_tfsa_rrsp_fhsa',
  },
  {
    title: 'Compare TFSA vs RRSP first',
    description: 'Useful starting point when the next registered-account contribution is still undecided.',
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

const HOME_FAQS = [
  {
    q: 'What is EasyFinanceTools for?',
    a: 'EasyFinanceTools helps Canadians compare common money decisions such as TFSA vs RRSP, FHSA planning, compound growth, dividend income, tax estimates, and mortgage affordability using educational tools and source-linked guides.',
  },
  {
    q: 'Are the calculators financial advice?',
    a: 'No. The calculators and guides are educational planning tools. They use simplified assumptions and should be checked against official sources or a qualified professional before you act.',
  },
  {
    q: 'Which page should I start with?',
    a: 'If you are choosing an account, start with TFSA vs RRSP vs FHSA. If you already know the account, start with the matching calculator or guide.',
  },
  {
    q: 'Do I need to sign up to use the tools?',
    a: 'No. The calculators are free to use without an email sign-up.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Free Canadian Finance Calculators | TFSA, RRSP & Dividend Tools"
        description="Use free Canadian finance calculators for TFSA, RRSP, compound interest, dividends, and savings planning. Simple tools, no sign-up required."
        canonical="https://easyfinancetools.com/"
      />
      <FAQSchema faqs={HOME_FAQS} />

      <section className="hero-home relative min-h-[420px] overflow-hidden bg-slate-950 px-4 py-20 text-white">
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_340px] lg:items-center">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                <span className="rounded-full bg-white/15 px-4 py-1.5">Built for Canadians</span>
                <span className="rounded-full bg-white/15 px-4 py-1.5">Practical guides</span>
                <span className="rounded-full bg-white/15 px-4 py-1.5">Clear next steps</span>
                <span className="rounded-full bg-white/15 px-4 py-1.5">Updated Apr 29, 2026</span>
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Make better money decisions in Canada
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-blue-100 md:text-xl">
                Compare TFSA, RRSP, and FHSA decisions, estimate compound growth in CAD, check contribution-room basics, and plan dividend income with practical, source-linked tools built for Canadians.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <SurfaceTrackedLink
                  to="/tools/account-decision-tool"
                  eventName="homepage_cta_click"
                  ctaLabel="hero_account_decision_tool"
                  trackingParams={{ section: 'hero', destination_type: 'tool' }}
                  className="rounded-2xl bg-white px-6 py-4 text-lg font-bold text-primary transition hover:bg-blue-50"
                >
                  Find your next account
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

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900/60 dark:bg-blue-950/30">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Quick answer</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Start with the account decision, then run the calculator</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700 dark:text-slate-300">
            Most Canadian finance choices get easier in this order: choose the account, estimate the numbers, then compare products. If the next dollar could go into a TFSA, RRSP, or FHSA, use the account guides first. If the account is already clear, use the matching calculator to test the contribution, growth, tax, or income scenario.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              { title: 'Account choice unclear', href: '/blog/tfsa-vs-rrsp-vs-fhsa-canada', label: 'Compare TFSA, RRSP, FHSA' },
              { title: 'Growth target unclear', href: '/tools/compound-interest-calculator', label: 'Run compound growth' },
              { title: 'TFSA room unclear', href: '/blog/tfsa-contribution-room-canada-2026', label: 'Check TFSA room rules' },
            ].map((item) => (
              <SurfaceTrackedLink
                key={item.href}
                to={item.href}
                eventName="homepage_cta_click"
                ctaLabel={`quick_answer_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}
                trackingParams={{ section: 'quick_answer', destination_type: item.href.startsWith('/blog') ? 'article' : 'tool' }}
                className="rounded-2xl bg-white p-5 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900"
              >
                <p className="font-bold text-primary dark:text-accent">{item.title}</p>
                <p className="mt-2 font-semibold text-secondary">{item.label}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <TopicClusterMap title="Choose a topic path instead of a random calculator" />
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
        <div className="surface-card p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Latest investing guides</p>
              <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">New Canadian investing explainers</h2>
            </div>
            <SurfaceTrackedLink
              to="/blog/investing"
              eventName="homepage_cta_click"
              ctaLabel="latest_guides_investing_archive"
              trackingParams={{ section: 'latest_investing_guides', destination_type: 'category_page' }}
              className="text-sm font-semibold text-primary underline dark:text-secondary"
            >
              Browse investing archive
            </SurfaceTrackedLink>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {LATEST_GUIDES.map((guide) => (
              <SurfaceTrackedLink
                key={guide.href}
                to={guide.href}
                eventName="homepage_cta_click"
                ctaLabel={`latest_guide_${guide.slug}`}
                trackingParams={{ section: 'latest_investing_guides', destination_type: 'article', article_slug: guide.slug }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <ArticleImage slug={guide.slug} className="h-44" />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">{guide.category}</p>
                  <h3 className="mt-2 text-xl font-bold text-primary group-hover:text-secondary dark:text-accent">{guide.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{guide.description}</p>
                </div>
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
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Common questions before using the tools</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {HOME_FAQS.map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
        <EducationalDisclaimer />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Why this site exists</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Decision support before products</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            EasyFinanceTools is built to help Canadians understand account order, calculator assumptions, and tradeoffs before comparing platforms or opening accounts. Product links belong after the education, not before the decision.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              { title: 'Start with the decision tool', href: '/tools/account-decision-tool', body: 'Turn TFSA, RRSP, and FHSA uncertainty into a practical next-step framework.' },
              { title: 'Use the topic hubs', href: '/topics/tfsa', body: 'Follow TFSA, RRSP, FHSA, dividend, mortgage, and retirement paths instead of hunting through random pages.' },
              { title: 'Read the methodology', href: '/methodology', body: 'See how calculators are built, tested, sourced, updated, and noindexed when they are not strong enough.' },
              { title: 'Meet the founder', href: '/about', body: 'Learn who runs the site and why it focuses on Canadian finance decisions.' },
            ].map((item) => (
              <SurfaceTrackedLink
                key={item.href}
                to={item.href}
                eventName="homepage_cta_click"
                ctaLabel={`trust_path_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}
                trackingParams={{ section: 'trust_path', destination_type: item.href.startsWith('/tools') ? 'tool' : 'trust_page' }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
              >
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
