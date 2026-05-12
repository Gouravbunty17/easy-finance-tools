import React from 'react';

export default function ProgressiveDisclosure({
  eyebrow,
  title,
  summary,
  children,
  defaultOpen = false,
  className = '',
}) {
  return (
    <details
      open={defaultOpen}
      className={`group rounded-2xl border border-slate-200 bg-white shadow-sm transition dark:border-slate-700 dark:bg-gray-900 ${className}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          {eyebrow ? (
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              {eyebrow}
            </span>
          ) : null}
          <span className="mt-1 block text-lg font-bold text-primary dark:text-accent">{title}</span>
          {summary ? (
            <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">
              {summary}
            </span>
          ) : null}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-primary transition group-open:rotate-45 dark:bg-slate-800 dark:text-accent">
          +
        </span>
      </summary>
      <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800">
        {children}
      </div>
    </details>
  );
}
