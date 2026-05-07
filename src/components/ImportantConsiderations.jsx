import React from 'react';

export default function ImportantConsiderations({ title = 'Important considerations', items = [] }) {
  if (!items.length) return null;

  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Watch-outs</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-amber-900 dark:text-amber-100">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-0.5 font-bold">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
