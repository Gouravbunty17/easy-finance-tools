import React from 'react';
import { Link } from 'react-router-dom';

export default function SuggestCorrectionCTA({ context = 'this page', className = '' }) {
  return (
    <aside className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-800 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Help keep this accurate</p>
      <h2 className="mt-2 text-xl font-bold text-primary dark:text-accent">Suggest a correction</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        If a Canadian rule, source link, or calculator assumption on {context} looks stale, send a correction note. Material updates are logged on the corrections page.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        <Link to="/contact" className="rounded-full bg-primary px-4 py-2 text-white transition hover:bg-secondary">
          Contact us
        </Link>
        <Link to="/corrections" className="rounded-full border border-slate-200 px-4 py-2 text-primary transition hover:border-secondary dark:border-slate-700 dark:text-accent">
          View updates
        </Link>
      </div>
    </aside>
  );
}
