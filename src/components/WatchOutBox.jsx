import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function WatchOutBox({
  title = "Watch-outs",
  intro,
  items = [],
  className = "",
}) {
  if (!intro && !items.length) return null;

  return (
    <section className={`rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-100 ${className}`}>
      <div className="flex gap-3">
        <ExclamationTriangleIcon className="mt-1 h-6 w-6 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Important warnings</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
          {intro ? <p className="mt-3 text-sm leading-7">{intro}</p> : null}
        </div>
      </div>
      {items.length ? (
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="rounded-2xl bg-white/70 p-4 text-sm leading-6 dark:bg-slate-900/55">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
