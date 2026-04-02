import React from "react";

export default function MethodologyPanel({
  title = "How this calculator works",
  summary,
  assumptions = [],
  sources = [],
  updated = "April 2, 2026",
  reviewer = "EasyFinanceTools editorial team",
  note = "Educational estimate only. Verify important figures against your CRA account, lender, or tax slips before acting.",
}) {
  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-primary dark:text-accent">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last updated: {updated}
        </p>
      </div>

      {summary && (
        <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
          {summary}
        </p>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            Assumptions
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {assumptions.map((item) => (
              <li key={item} className="rounded-xl bg-white px-4 py-3 dark:bg-slate-800">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            Sources and review
          </h3>
          <div className="mt-3 rounded-xl bg-white p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <p>
              Reviewed by: <strong>{reviewer}</strong>
            </p>
            <p className="mt-3">{note}</p>
            {sources.length > 0 && (
              <ul className="mt-4 space-y-2">
                {sources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-secondary underline-offset-2 hover:underline"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
