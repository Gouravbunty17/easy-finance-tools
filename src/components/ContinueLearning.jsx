import React from 'react';
import { Link } from 'react-router-dom';

export default function ContinueLearning({ eyebrow = 'Pathway', title, intro, steps = [] }) {
  if (!steps.length) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      {intro ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p> : null}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Link key={step.href} to={step.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Step {index + 1}</p>
            <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
