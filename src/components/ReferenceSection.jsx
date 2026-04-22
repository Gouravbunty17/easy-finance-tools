import React from 'react';

export default function ReferenceSection({
  eyebrow = 'References',
  title = 'Source and citation shell',
  intro,
  references = [],
  note,
}) {
  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      {intro ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {references.map((reference) => (
          <div key={reference.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="font-semibold text-primary dark:text-accent">{reference.label}</p>
            {reference.body ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{reference.body}</p>
            ) : null}
            {reference.href ? (
              <a
                href={reference.href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-secondary underline-offset-2 hover:underline"
              >
                Open source
              </a>
            ) : null}
          </div>
        ))}
      </div>

      {note ? (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{note}</p>
      ) : null}
    </section>
  );
}
