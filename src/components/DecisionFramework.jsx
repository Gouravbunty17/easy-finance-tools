import React from 'react';
import {
  ArrowPathIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  MapIcon,
} from '@heroicons/react/24/outline';

const defaultSteps = [
  {
    title: 'The Tradeoff',
    badge: 'Step 1',
    signal: 'Name what you are choosing between.',
    whenItHelps: 'The decision has competing goals: tax savings, flexibility, home buying, income, or retirement timing.',
    watchOut: 'A calculator can look precise even when the real question is account fit or timing.',
    icon: ArrowPathIcon,
  },
  {
    title: 'The Rules',
    badge: 'Step 2',
    signal: 'Check the Canadian rules that shape the result.',
    whenItHelps: 'CRA room, withdrawal timing, mortgage stress tests, account eligibility, or tax treatment drive the answer.',
    watchOut: 'Outdated limits, province changes, and missed contribution-room history can change the result.',
    icon: BookOpenIcon,
  },
  {
    title: 'The Warnings',
    badge: 'Step 3',
    signal: 'Look for the assumption that could break the plan.',
    whenItHelps: 'Returns, income, rates, yield, liquidity, job stability, or home timing are uncertain.',
    watchOut: 'High yields, refund math, short timelines, and concentrated positions can hide risk.',
    icon: ExclamationTriangleIcon,
  },
  {
    title: 'The Next Path',
    badge: 'Step 4',
    signal: 'Move to the tool or guide that tests the next assumption.',
    whenItHelps: 'The first result creates a clearer follow-up question instead of a final answer.',
    watchOut: 'Jumping to a product before the decision is understood can make the site feel sales-first.',
    icon: MapIcon,
  },
];

export default function DecisionFramework({
  eyebrow = 'Decision framework',
  title = 'A four-step way to make Canadian money decisions',
  intro = 'EasyFinanceTools is built around tradeoffs, rules, warnings, and the next useful path. The goal is not to force one answer; it is to show which assumption matters next.',
  items = defaultSteps,
  footer,
  compact = false,
}) {
  if (!items.length) return null;

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-gray-900">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
        {title ? <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2> : null}
        {intro ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p> : null}
      </div>

      <div className={`mt-6 grid gap-4 ${compact ? 'md:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-4'}`}>
        {items.map((item) => (
          <article
            key={item.title}
            className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-gray-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {item.icon ? (
                  <item.icon className="mb-3 h-6 w-6 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                ) : null}
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
              </div>
              {item.badge ? (
                <span className="shrink-0 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
                  {item.badge}
                </span>
              ) : null}
            </div>
            {item.signal ? (
              <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
                {item.signal}
              </p>
            ) : null}
            <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {item.whenItHelps ? (
                <p>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Works better when: </span>
                  {item.whenItHelps}
                </p>
              ) : null}
              {item.watchOut ? (
                <p>
                  <span className="font-bold text-amber-700 dark:text-amber-300">Watch out when: </span>
                  {item.watchOut}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {footer ? (
        <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
          {footer}
        </p>
      ) : null}
    </section>
  );
}
