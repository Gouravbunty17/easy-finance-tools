import React from 'react';

export default function InlineSourceTrust({
  label = 'Official source reference',
  note = 'Verify the underlying rule with the official source before acting.',
  sources = [],
  className = '',
}) {
  if (!sources.length) return null;

  return (
    <div className={`mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-950 shadow-sm dark:border-emerald-800/70 dark:bg-emerald-950/20 dark:text-emerald-100 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">{label}</p>
          <p className="mt-1 leading-6">{note}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.slice(0, 2).map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-primary transition hover:border-emerald-400 hover:text-secondary dark:border-emerald-800 dark:bg-slate-950 dark:text-emerald-100"
            >
              {source.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
