import React from 'react';

export default function ScenarioBreakdown({ title = 'Scenario breakdown', rows = [] }) {
  if (!rows.length) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Compare outcomes</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{row.label}</p>
            <p className="mt-2 text-xl font-bold text-primary dark:text-accent">{row.value}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{row.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
