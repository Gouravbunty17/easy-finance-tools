import React from 'react';

export default function ResultInsightCard({ eyebrow = 'Result insight', title, children, tone = 'blue' }) {
  const tones = {
    blue: 'border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:border-blue-900/60 dark:from-blue-950/30 dark:via-gray-900 dark:to-slate-900',
    emerald: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:border-emerald-900/60 dark:from-emerald-950/30 dark:via-gray-900 dark:to-slate-900',
    amber: 'border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-slate-50 dark:border-amber-900/60 dark:from-amber-950/30 dark:via-gray-900 dark:to-slate-900',
    slate: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-800',
  };

  return (
    <section className={`rounded-[1.75rem] border p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] ${tones[tone] || tones.blue}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}
