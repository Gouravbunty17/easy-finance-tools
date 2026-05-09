import React from 'react';

export default function OfficialSourceNote({
  title = 'Source check',
  body = 'Verify rules and limits with official Canadian sources before acting on this estimate.',
  sources = [],
}) {
  if (!sources.length) return null;

  return (
    <aside className="my-6 rounded-[1.5rem] border border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-emerald-50/40 p-5 text-sm leading-7 text-blue-950 shadow-[0_14px_40px_rgba(15,23,42,0.06)] dark:border-blue-800 dark:from-blue-950/35 dark:via-slate-900 dark:to-emerald-950/20 dark:text-blue-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{title}</p>
          <p className="mt-2">{body}</p>
        </div>
        <span className="shrink-0 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-primary dark:border-blue-800 dark:bg-slate-900 dark:text-blue-100">
          Official reference
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {sources.slice(0, 3).map((source) => (
          <a
            key={source.href}
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:text-secondary dark:bg-slate-900 dark:text-blue-100"
          >
            {source.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
