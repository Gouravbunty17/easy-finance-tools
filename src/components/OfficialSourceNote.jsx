import React from 'react';

export default function OfficialSourceNote({
  title = 'Source check',
  body = 'Verify rules and limits with official Canadian sources before acting on this estimate.',
  sources = [],
}) {
  if (!sources.length) return null;

  return (
    <aside className="my-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-7 text-blue-950 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-100">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{title}</p>
      <p className="mt-2">{body}</p>
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
