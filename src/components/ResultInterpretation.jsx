import React from "react";

export default function ResultInterpretation({
  eyebrow = "Result interpretation",
  title = "What this result means",
  summary,
  points = [],
  className = "",
}) {
  if (!summary && !points.length) return null;

  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      {summary ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{summary}</p> : null}
      {points.length ? (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {points.map((point) => (
            <article key={point.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-sm font-bold text-primary dark:text-accent">{point.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{point.body}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
