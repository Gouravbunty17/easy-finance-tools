import React from "react";

export default function SourceList({
  eyebrow = "Official sources",
  title = "Sources used for this page",
  intro = "These links are provided so readers can verify the official Canadian rules behind the estimate.",
  sources = [],
}) {
  if (!sources.length) return null;

  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {sources.map((source) => (
          <a
            key={source.href}
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="font-semibold text-primary dark:text-accent">{source.label}</span>
            {source.body ? (
              <span className="mt-2 block leading-6 text-slate-600 dark:text-slate-300">{source.body}</span>
            ) : null}
          </a>
        ))}
      </div>
    </section>
  );
}
