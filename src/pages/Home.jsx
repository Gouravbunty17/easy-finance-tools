import React from 'react';
import SEO from '../components/SEO';
import SurfaceTrackedLink from '../components/SurfaceTrackedLink';
import FAQSchema from '../components/FAQSchema';
import ProgressiveDisclosure from '../components/ProgressiveDisclosure';

const DECISION_PATHS = [
  {
    title: 'Choose between TFSA, RRSP, and FHSA',
    body: 'Start here when the next dollar could go into more than one registered account.',
    href: '/tools/account-decision-tool',
    label: 'Start account framework',
    ctaLabel: 'path_account_decision',
  },
  {
    title: 'Plan retirement',
    body: 'Test savings rate, time horizon, inflation, and withdrawal assumptions without pretending precision.',
    href: '/tools/fire-calculator',
    label: 'Open retirement tool',
    ctaLabel: 'path_retirement',
  },
  {
    title: 'Build dividend income',
    body: 'Estimate income targets while keeping yield, concentration, and tax-location risk visible.',
    href: '/tools/dividend-calculator',
    label: 'Open dividend tool',
    ctaLabel: 'path_dividends',
  },
  {
    title: 'Understand mortgages',
    body: 'Check affordability and payment pressure before turning a home price into a commitment.',
    href: '/tools/mortgage-affordability-calculator',
    label: 'Open mortgage tool',
    ctaLabel: 'path_mortgage',
  },
  {
    title: 'Explore investment fit',
    body: 'Review account location, timeline, liquidity, currency, and risk context without stock-picking language.',
    href: '/tools/investment-fit-framework',
    label: 'Open fit framework',
    ctaLabel: 'path_investment_fit',
  },
];

const FEATURED_TOOLS = [
  {
    title: 'Account Decision Tool',
    body: 'A guided framework for TFSA, RRSP, and FHSA tradeoffs.',
    href: '/tools/account-decision-tool',
    ctaLabel: 'featured_account_decision',
  },
  {
    title: 'Investment Fit Framework',
    body: 'Account-fit and risk-context checks for Canadian investors.',
    href: '/tools/investment-fit-framework',
    ctaLabel: 'featured_investment_fit',
  },
  {
    title: 'TFSA Calculator',
    body: 'Estimate room, growth, and withdrawal flexibility.',
    href: '/tools/tfsa-calculator',
    ctaLabel: 'featured_tfsa',
  },
  {
    title: 'RRSP Calculator',
    body: 'Model deduction value, refund assumptions, and retirement impact.',
    href: '/tools/rrsp-calculator',
    ctaLabel: 'featured_rrsp',
  },
  {
    title: 'Portfolio Analyzer',
    body: 'A future planning layer for allocation, concentration, and assumptions.',
    href: '/tools',
    ctaLabel: 'featured_portfolio_preview',
    muted: true,
  },
];

const GUIDE_HIGHLIGHTS = [
  {
    title: 'TFSA vs RRSP vs FHSA',
    body: 'The core Canadian account tradeoff explained without product-first framing.',
    href: '/blog/tfsa-vs-rrsp-vs-fhsa-canada',
    ctaLabel: 'guide_tfsa_rrsp_fhsa',
  },
  {
    title: 'TFSA contribution room',
    body: 'Contribution limits, withdrawal timing, and common CRA room mistakes.',
    href: '/blog/tfsa-contribution-room-canada-2026',
    ctaLabel: 'guide_tfsa_room',
  },
  {
    title: 'Covered call ETFs explained',
    body: 'Why high monthly income can hide total-return and NAV tradeoffs.',
    href: '/blog/covered-call-etfs-canada-explained',
    ctaLabel: 'guide_covered_calls',
  },
  {
    title: 'How to choose ETFs in Canada',
    body: 'A practical checklist for fees, allocation, currency, and risk.',
    href: '/blog/how-to-choose-etfs-canada',
    ctaLabel: 'guide_choose_etfs',
  },
];

const TRUST_POINTS = [
  'No account required to use the tools.',
  'Calculator inputs are not used as marketing lead forms.',
  'Official sources are linked when Canadian rules matter.',
];

const HOME_FAQS = [
  {
    q: 'What is EasyFinanceTools for?',
    a: 'EasyFinanceTools helps Canadians compare common financial planning decisions using educational calculators, decision frameworks, and source-linked guides.',
  },
  {
    q: 'Are the calculators financial advice?',
    a: 'No. The tools are educational planning aids. They simplify assumptions and should be checked against official sources or a qualified professional before acting.',
  },
  {
    q: 'Where should I start?',
    a: 'If you are choosing between accounts, start with the Account Decision Tool. If the account is already clear, use the matching calculator.',
  },
  {
    q: 'Do I need to sign up?',
    a: 'No. The core calculators and frameworks are available without an email signup.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <SEO
        title="Canadian Financial Decision Tools | EasyFinanceTools"
        description="Use calm Canadian financial decision tools for TFSA, RRSP, FHSA, dividends, mortgages, retirement, and investment-fit planning. Educational, source-linked, and no sign-up required."
        canonical="https://easyfinancetools.com/"
      />
      <FAQSchema faqs={HOME_FAQS} />

      <section className="hero-home relative overflow-hidden bg-slate-950 px-4 py-16 text-white md:py-24">
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
              Canadian decision-first planning
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Canadian financial tools designed to help you think before you invest.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Compare accounts, test assumptions, and choose a clearer next step without product-first pressure or noisy finance dashboards.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SurfaceTrackedLink
                to="/tools/account-decision-tool"
                eventName="homepage_cta_click"
                ctaLabel="hero_account_decision_tool"
                trackingParams={{ section: 'hero', destination_type: 'tool' }}
                className="rounded-xl bg-white px-5 py-3 text-base font-bold text-primary transition hover:bg-blue-50"
              >
                Start with account choice
              </SurfaceTrackedLink>
              <SurfaceTrackedLink
                to="/tools"
                eventName="homepage_cta_click"
                ctaLabel="hero_tools_hub"
                trackingParams={{ section: 'hero', destination_type: 'hub' }}
                className="rounded-xl border border-white/25 px-5 py-3 text-base font-bold text-white transition hover:bg-white/10"
              >
                View tools
              </SurfaceTrackedLink>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Simple starting order</p>
            <ol className="mt-5 space-y-3 text-sm leading-6 text-blue-50">
              <li className="rounded-2xl bg-white/10 p-4">1. Decide the account or planning context.</li>
              <li className="rounded-2xl bg-white/10 p-4">2. Run one calculator with realistic assumptions.</li>
              <li className="rounded-2xl bg-white/10 p-4">3. Open the deeper notes only when the result depends on them.</li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Main decision paths</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Choose the question you are actually trying to answer</h2>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {DECISION_PATHS.map((path) => (
            <SurfaceTrackedLink
              key={path.href}
              to={path.href}
              eventName="homepage_decision_path_click"
              ctaLabel={path.ctaLabel}
              trackingParams={{ section: 'decision_paths', destination_type: 'tool' }}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-gray-900"
            >
              <h3 className="text-lg font-bold text-primary group-hover:text-secondary dark:text-accent">{path.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{path.body}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-secondary">{path.label}</span>
            </SurfaceTrackedLink>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 px-4 py-14 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Featured tools</p>
              <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Keep the visible toolset small</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                The full library still exists, but these are the highest-value places to start.
              </p>
            </div>
            <SurfaceTrackedLink
              to="/tools"
              eventName="homepage_cta_click"
              ctaLabel="featured_tools_view_all"
              trackingParams={{ section: 'featured_tools', destination_type: 'hub' }}
              className="text-sm font-semibold text-primary underline dark:text-secondary"
            >
              All tools
            </SurfaceTrackedLink>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {FEATURED_TOOLS.map((tool) => (
              <SurfaceTrackedLink
                key={tool.title}
                to={tool.href}
                eventName="homepage_featured_tool_click"
                ctaLabel={tool.ctaLabel}
                trackingParams={{ section: 'featured_tools', destination_type: tool.muted ? 'hub' : 'tool' }}
                className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm ${
                  tool.muted
                    ? 'border-dashed border-slate-300 bg-white/70 dark:border-slate-700 dark:bg-gray-900/60'
                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-900'
                }`}
              >
                <h3 className="text-lg font-bold text-primary dark:text-accent">{tool.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{tool.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Educational highlights</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">A few guides worth reading slowly</h2>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {GUIDE_HIGHLIGHTS.map((guide) => (
            <SurfaceTrackedLink
              key={guide.href}
              to={guide.href}
              eventName="homepage_guide_click"
              ctaLabel={guide.ctaLabel}
              trackingParams={{ section: 'guide_highlights', destination_type: 'article' }}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-gray-900"
            >
              <h3 className="text-lg font-bold text-primary dark:text-accent">{guide.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{guide.body}</p>
            </SurfaceTrackedLink>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
          <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Quiet trust</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Trust should be easy to verify, not exhausting to read.</h2>
            </div>
            <div className="grid gap-3">
              {TRUST_POINTS.map((point) => (
                <p key={point} className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {point}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SurfaceTrackedLink to="/methodology" eventName="homepage_trust_click" ctaLabel="methodology" trackingParams={{ section: 'quiet_trust' }} className="text-sm font-semibold text-primary underline dark:text-secondary">
              Methodology
            </SurfaceTrackedLink>
            <SurfaceTrackedLink to="/editorial-standards" eventName="homepage_trust_click" ctaLabel="editorial_standards" trackingParams={{ section: 'quiet_trust' }} className="text-sm font-semibold text-primary underline dark:text-secondary">
              Editorial standards
            </SurfaceTrackedLink>
            <SurfaceTrackedLink to="/about" eventName="homepage_trust_click" ctaLabel="about_founder" trackingParams={{ section: 'quiet_trust' }} className="text-sm font-semibold text-primary underline dark:text-secondary">
              Founder note
            </SurfaceTrackedLink>
          </div>
        </div>

        <ProgressiveDisclosure
          className="mt-6"
          eyebrow="FAQ"
          title="Common questions"
          summary="Kept available without turning the homepage into a help-center wall."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {HOME_FAQS.map((item) => (
              <article key={item.q} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <h3 className="font-bold text-primary dark:text-accent">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.a}</p>
              </article>
            ))}
          </div>
        </ProgressiveDisclosure>
      </section>
    </main>
  );
}
