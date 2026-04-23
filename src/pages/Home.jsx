import React from 'react';
import SEO from '../components/SEO';
import SurfaceTrackedLink from '../components/SurfaceTrackedLink';
import EducationalDisclaimer from '../components/EducationalDisclaimer';
import {
  CONTENT_LAST_REVIEWED,
  PRIORITY_INVESTING_GUIDES,
  PRIORITY_INVESTING_TOOLS,
  PRIORITY_INVESTING_WORKFLOWS,
  REGISTERED_ACCOUNT_LIMITS,
} from '../config/financial';

export default function Home() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Canadian Investing Decision Platform | FHSA, TFSA, RRSP and ETF Income"
        description="Canadian investing decision tools and guides for FHSA, TFSA, RRSP, ETF income, dividend planning, and first-home saving."
        canonical="https://easyfinancetools.com/"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-20 text-white">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at top left, white 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        <div className="absolute -right-16 top-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-center">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                <span className="rounded-full bg-white/15 px-4 py-1.5">Built for Canadian investors</span>
                <span className="rounded-full bg-white/15 px-4 py-1.5">Privacy-first</span>
                <span className="rounded-full bg-white/15 px-4 py-1.5">Methodology shown</span>
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Make better Canadian money decisions, not just isolated calculations
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-blue-100 md:text-xl">
                EasyFinanceTools is designed as a decision platform for FHSA, TFSA, RRSP, dividend income, ETF choices, and first-home planning. Start with the numbers, then move into interpretation, tradeoffs, and the next useful step.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <SurfaceTrackedLink
                  to="/tools/fhsa-calculator"
                  eventName="homepage_cta_click"
                  ctaLabel="hero_open_fhsa_planner"
                  trackingParams={{ section: 'hero', destination_type: 'tool' }}
                  className="rounded-2xl bg-white px-6 py-4 text-lg font-bold text-primary transition hover:bg-blue-50"
                >
                  Open FHSA planner
                </SurfaceTrackedLink>
                <SurfaceTrackedLink
                  to="/tools/dividend-calculator"
                  eventName="homepage_cta_click"
                  ctaLabel="hero_open_etf_income_simulator"
                  trackingParams={{ section: 'hero', destination_type: 'tool' }}
                  className="rounded-2xl border border-white/30 px-6 py-4 text-lg font-bold text-white transition hover:bg-white/10"
                >
                  Open ETF income simulator
                </SurfaceTrackedLink>
                <SurfaceTrackedLink
                  to="/blog/tfsa-vs-rrsp-2026"
                  eventName="homepage_cta_click"
                  ctaLabel="hero_compare_tfsa_vs_rrsp"
                  trackingParams={{ section: 'hero', destination_type: 'article' }}
                  className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-lg font-bold text-white transition hover:bg-white/15"
                >
                  Compare TFSA vs RRSP
                </SurfaceTrackedLink>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">What the site helps you decide</p>
              <div className="mt-5 grid gap-3">
                {[
                  'Should the next contribution go to FHSA, TFSA, or RRSP?',
                  'How much capital is needed to target a dividend-income goal?',
                  'When does an FHSA actually beat the alternatives?',
                  'Which guide or calculator should come next after the result?',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm text-blue-50">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-white/15 p-4 text-sm text-blue-50">
                <p className="font-semibold text-white">2026 limits in one place</p>
                <p className="mt-2">
                  FHSA annual limit: {REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })} | TFSA annual limit: {REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <EducationalDisclaimer />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="surface-soft p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Featured decision tools</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold text-primary dark:text-accent">Start with the decision you are actually making</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                These are not just forms. Each major page is built to take you from input to output to interpretation, then push you into the next tool or guide that helps the decision become real.
              </p>
            </div>
            <SurfaceTrackedLink
              to="/tools"
              eventName="homepage_cta_click"
              ctaLabel="featured_tools_view_all"
              trackingParams={{ section: 'featured_tools', destination_type: 'hub' }}
              className="text-sm font-semibold text-primary underline dark:text-secondary"
            >
              View all tools
            </SurfaceTrackedLink>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PRIORITY_INVESTING_TOOLS.map((tool) => (
              <SurfaceTrackedLink
                key={tool.href}
                to={tool.href}
                eventName="homepage_cta_click"
                ctaLabel={`featured_tool_${tool.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}
                trackingParams={{ section: 'featured_tools', destination_type: 'tool' }}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{tool.label}</p>
                <h3 className="mt-2 text-xl font-bold text-primary dark:text-accent">{tool.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{tool.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 lg:grid-cols-4">
          {[
            {
              title: '1. Input',
              body: 'Enter a real scenario such as income, available FHSA room, ETF yield, or contribution amount.',
            },
            {
              title: '2. Output',
              body: 'See the core number quickly: tax savings, projected balance, monthly income, or refund value.',
            },
            {
              title: '3. Interpretation',
              body: 'Use the plain-English summary to understand whether the result supports the account or ETF choice.',
            },
            {
              title: '4. Next step',
              body: 'Jump into the matching guide, comparison page, or follow-up calculator instead of stopping at the number.',
            },
          ].map((step) => (
            <div key={step.title} className="surface-card p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">{step.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Sample decision paths</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Examples of how to use the platform</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {PRIORITY_INVESTING_WORKFLOWS.map((example) => (
              <div key={example.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-xl font-bold text-primary dark:text-accent">{example.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{example.body}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <SurfaceTrackedLink
                    to={example.primaryHref}
                    eventName="homepage_cta_click"
                    ctaLabel={example.primaryLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                    trackingParams={{ section: 'decision_examples', destination_type: 'tool_or_article' }}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
                  >
                    {example.primaryLabel}
                  </SurfaceTrackedLink>
                  <SurfaceTrackedLink
                    to={example.secondaryHref}
                    eventName="homepage_cta_click"
                    ctaLabel={example.secondaryLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                    trackingParams={{ section: 'decision_examples', destination_type: 'tool_or_article' }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-600 dark:text-slate-100"
                  >
                    {example.secondaryLabel}
                  </SurfaceTrackedLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="surface-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Trust and accuracy</p>
            <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Why the site is built this way</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: 'Methodology is visible',
                  body: 'Major pages show assumptions, update dates, and source shells so you can check the logic yourself.',
                },
                {
                  title: 'Privacy-first approach',
                  body: 'Calculator inputs stay in your browser unless a feature clearly says otherwise.',
                },
                {
                  title: 'Canadian context only',
                  body: 'Tools and guides are framed around Canadian registered accounts, tax rules, and first-home planning.',
                },
                {
                  title: 'Not personalized advice',
                  body: 'The site is designed to help you make better decisions, not to pretend to replace licensed advice.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                  <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-soft p-5">
            <h3 className="text-lg font-bold text-primary dark:text-accent">Useful trust pages</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Last reviewed {CONTENT_LAST_REVIEWED}. Use these pages if you want to inspect how the site is written, updated, and maintained.
            </p>
            <div className="mt-4 grid gap-3">
              {[
                { label: 'About EasyFinanceTools', href: '/about' },
                { label: 'Methodology and sources', href: '/methodology' },
                { label: 'Editorial standards', href: '/editorial-standards' },
                { label: 'Privacy policy', href: '/privacy-policy' },
              ].map((item) => (
                <SurfaceTrackedLink
                  key={item.href}
                  to={item.href}
                  eventName="homepage_cta_click"
                  ctaLabel={item.label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                  trackingParams={{ section: 'trust_pages', destination_type: 'trust_page' }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {item.label}
                </SurfaceTrackedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="surface-soft p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Featured guides</p>
              <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Read the guides that support the tools</h2>
            </div>
            <SurfaceTrackedLink
              to="/blog"
              eventName="homepage_cta_click"
              ctaLabel="featured_guides_view_all"
              trackingParams={{ section: 'featured_guides', destination_type: 'hub' }}
              className="text-sm font-semibold text-primary underline dark:text-secondary"
            >
              View all guides
            </SurfaceTrackedLink>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PRIORITY_INVESTING_GUIDES.map((guide) => (
              <SurfaceTrackedLink
                key={guide.href}
                to={guide.href}
                eventName="homepage_cta_click"
                ctaLabel={`featured_guide_${guide.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}
                trackingParams={{ section: 'featured_guides', destination_type: 'article' }}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{guide.category}</p>
                <h3 className="mt-2 text-xl font-bold text-primary dark:text-accent">{guide.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{guide.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
