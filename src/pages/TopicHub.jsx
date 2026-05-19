import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import SourceList from '../components/SourceList';
import EducationalDisclaimer from '../components/EducationalDisclaimer';
import ContinueLearning from '../components/ContinueLearning';
import UpdatedForRulesBadge from '../components/UpdatedForRulesBadge';
import ContributionGrowthChart from '../components/ContributionGrowthChart';
import MortgageBreakdownChart from '../components/MortgageBreakdownChart';
import RetirementProjectionTimeline from '../components/RetirementProjectionTimeline';
import AccountComparisonTable from '../components/AccountComparisonTable';
import DividendIncomeProjection from '../components/DividendIncomeProjection';
import { topicHubs } from '../config/topicHubs';

function LinkGrid({ title, items, cta = 'Open' }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map(([label, href]) => (
          <Link
            key={href}
            to={href}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
          >
            <span className="block text-base font-bold text-primary dark:text-accent">{label}</span>
            <span className="mt-2 block text-sm font-semibold text-secondary">{cta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HubVisual({ slug }) {
  if (slug === 'dividends') return <DividendIncomeProjection />;
  if (slug === 'mortgages') return <MortgageBreakdownChart />;
  if (slug === 'retirement') return <RetirementProjectionTimeline />;
  if (['tfsa', 'rrsp', 'fhsa'].includes(slug)) {
    return slug === 'tfsa' ? <ContributionGrowthChart /> : <AccountComparisonTable />;
  }
  return null;
}

function DecisionList({ title, items = [] }) {
  if (!items.length) return null;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Decision support</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link key={item.href} to={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HubFAQ({ items = [] }) {
  if (!items.length) return null;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">FAQ</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Common questions</h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <details key={item.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <summary className="cursor-pointer text-sm font-bold text-primary dark:text-accent">{item.q}</summary>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function TopicHub() {
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).at(-1);
  const hub = topicHubs[slug] || topicHubs.tfsa;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <SEO
        title={hub.title}
        description={hub.description}
        canonical={`https://easyfinancetools.com${hub.path}`}
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5">
            <UpdatedForRulesBadge />
          </div>
          <p className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            {hub.eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{hub.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">{hub.intro}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900/60 dark:bg-blue-950/30">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Start here</p>
            <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">The practical order of operations</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {hub.startHere.map((item, index) => (
                <div key={item} className="rounded-2xl bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                  <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">What people often miss</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Where generic advice breaks down</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {hub.misunderstood.map((item) => (
                <div key={item} className="rounded-2xl border border-amber-200 bg-white p-4 text-sm leading-7 text-slate-700 dark:border-amber-900/50 dark:bg-slate-900 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <LinkGrid title={`${hub.label} calculators and tools`} items={hub.calculators} cta="Use tool" />
          <LinkGrid title={`${hub.label} guides and explainers`} items={hub.guides} cta="Read guide" />
          <DecisionList title={`${hub.label} decision pages`} items={hub.decisions} />
          <HubVisual slug={slug} />
          <HubFAQ items={hub.faqs} />

          {hub.nextPath ? (
            <ContinueLearning
              eyebrow="Continue your financial path"
              title={hub.nextPath.title}
              intro={hub.nextPath.intro}
              steps={hub.nextPath.steps}
            />
          ) : null}

          <SourceList
            title={`Official ${hub.label} sources to verify`}
            intro="These primary Canadian references are linked directly so readers can verify rules, limits, and government guidance before acting on an estimate."
            sources={hub.sources}
          />
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-primary dark:text-accent">Other topic hubs</h2>
            <div className="mt-4 grid gap-2">
              {Object.values(topicHubs).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    item.path === hub.path
                      ? 'border-secondary bg-blue-50 text-secondary dark:bg-blue-950/30'
                      : 'border-slate-200 bg-slate-50 text-primary hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-primary dark:text-accent">How to use this hub</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Use the hub to choose the right calculator or guide first. The site is educational, so major tax, mortgage, and investment decisions should still be checked against official records or a qualified professional.
            </p>
          </div>
          <EducationalDisclaimer compact />
        </aside>
      </section>
    </main>
  );
}
