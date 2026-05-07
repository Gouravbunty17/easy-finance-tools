import React from 'react';
import { Link } from 'react-router-dom';

export default function EnhancedAuthorBox({ lastUpdated, focus = 'Canadian personal finance education' }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Author and review</p>
      <div className="mt-3 grid gap-5 md:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-accent">Gourav Kumar</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Founder of Easy Finance Tools</p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Independent Canadian personal finance tools creator focused on calculators, investing education, and beginner-friendly financial planning.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="font-bold text-primary dark:text-accent">How this content is handled</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Content is educational, reviewed against official Canadian sources where applicable, and updated when account rules, calculator assumptions, or source material changes. It is not professional financial advice.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link to="/editorial-standards" className="text-primary underline dark:text-secondary">Editorial standards</Link>
            <Link to="/methodology" className="text-primary underline dark:text-secondary">Calculator methodology</Link>
            <span className="text-slate-500 dark:text-slate-400">Updated: {lastUpdated || 'see page date'}</span>
            <span className="text-slate-500 dark:text-slate-400">{focus}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
