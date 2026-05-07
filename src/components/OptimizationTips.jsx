import React from 'react';

export default function OptimizationTips({ title = 'Optimization tips', items = [] }) {
  if (!items.length) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Before you act</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="font-bold text-primary dark:text-accent">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
