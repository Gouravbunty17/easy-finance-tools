import React from "react";
import { Link } from "react-router-dom";

export default function RelatedGuides({ title = "Next steps", guides = [] }) {
  if (!guides.length) return null;

  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Continue learning</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            to={guide.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-gray-900"
          >
            <h3 className="text-lg font-bold text-primary dark:text-accent">{guide.title}</h3>
            {guide.body ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{guide.body}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
