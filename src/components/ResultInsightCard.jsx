import React from 'react';

export default function ResultInsightCard({ eyebrow = 'Result insight', title, children, tone = 'blue' }) {
  const tones = {
    blue: 'border-blue-200 bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/30',
    emerald: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30',
    amber: 'border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30',
    slate: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-800',
  };

  return (
    <section className={`rounded-3xl border p-6 shadow-sm ${tones[tone] || tones.blue}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}
