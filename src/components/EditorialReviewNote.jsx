import React from 'react';
import { Link } from 'react-router-dom';

export default function EditorialReviewNote({ updated }) {
  return (
    <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/60 dark:bg-blue-950/30">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Review note</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Educational content, source-led review</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
        This page is written for Canadian readers and reviewed against official or primary sources where the topic depends on rules, tax treatment, or account mechanics. The goal is to explain the decision, not to recommend a product or predict returns.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        <span className="rounded-full bg-white px-3 py-1 text-slate-600 dark:bg-slate-900 dark:text-slate-300">Last reviewed: {updated || 'see article date'}</span>
        <Link to="/editorial-standards" className="rounded-full bg-white px-3 py-1 text-primary underline dark:bg-slate-900 dark:text-secondary">How we review content</Link>
      </div>
    </section>
  );
}
