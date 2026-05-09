import React from 'react';

export default function CalculatorCaseStudy({
  title,
  scenario,
  inputs = [],
  result,
  interpretation,
  limitation,
}) {
  return (
    <section className="mt-10 overflow-hidden rounded-[1.75rem] border border-emerald-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] dark:border-emerald-900/60 dark:bg-gray-900">
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-secondary to-primary" />
      <div className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Real Canadian scenario</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{scenario}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-bold text-primary dark:text-accent">Inputs used</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {inputs.map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-bold text-primary dark:text-accent">Result and interpretation</h3>
          <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{result}</p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{interpretation}</p>
        </div>
      </div>
      {limitation ? (
        <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-slate-600 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-slate-300">
          <strong className="text-primary dark:text-accent">Limitation:</strong> {limitation}
        </p>
      ) : null}
      </div>
    </section>
  );
}
