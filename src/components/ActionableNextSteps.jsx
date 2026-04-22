import React from 'react';
import SurfaceTrackedLink from './SurfaceTrackedLink';
import ReferralSection from './ReferralSection';

export default function ActionableNextSteps({
  toolName,
  title = 'Your next steps',
  intro,
  meaning,
  steps = [],
  actions = [],
  referral,
}) {
  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Your next steps</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
          {intro ? (
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p>
          ) : null}
          {meaning ? (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <p className="font-semibold text-primary dark:text-accent">What this result means</p>
              <p className="mt-2 leading-7">{meaning}</p>
            </div>
          ) : null}
        </div>

        {steps.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-primary dark:text-accent">Use the result, then act</p>
            <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {steps.map((step) => (
                <li key={step} className="flex gap-2">
                  <span className="mt-0.5 text-secondary">-</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {actions.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {actions.map((action) => (
            <SurfaceTrackedLink
              key={action.href}
              to={action.href}
              eventName="tool_result_cta_click"
              ctaLabel={action.ctaLabel}
              trackingParams={{
                tool_name: toolName,
                section: 'actionable_next_steps',
                destination_type: action.destinationType || (action.href.startsWith('/tools/') ? 'tool' : 'article'),
              }}
              className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-800"
            >
              <h3 className="text-lg font-bold text-primary dark:text-accent">{action.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{action.body}</p>
            </SurfaceTrackedLink>
          ))}
        </div>
      ) : null}

      {referral ? <ReferralSection {...referral} /> : null}
    </section>
  );
}
