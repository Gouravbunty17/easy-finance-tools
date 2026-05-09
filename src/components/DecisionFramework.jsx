import React from 'react';

export default function DecisionFramework({
  eyebrow = 'Decision framework',
  title,
  intro,
  items = [],
  footer,
}) {
  if (!items.length) return null;

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-gray-900">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
        {title ? <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2> : null}
        {intro ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p> : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 dark:border-slate-700 dark:from-slate-900 dark:to-gray-900"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
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
