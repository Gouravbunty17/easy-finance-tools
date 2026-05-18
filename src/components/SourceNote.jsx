import React from "react";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function SourceNote({
  title = "Source-aware estimate",
  body = "Where Canadian rules matter, verify the result against official sources such as CRA, CMHC, OSFI, the Bank of Canada, or provincial tax guidance.",
  sources = [],
  className = "",
}) {
  return (
    <aside className={`rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-sm leading-7 text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/25 dark:text-blue-100 ${className}`}>
      <div className="flex gap-3">
        <BookOpenIcon className="mt-0.5 h-5 w-5 shrink-0 text-secondary dark:text-blue-300" aria-hidden="true" />
        <div>
          <p className="font-bold text-primary dark:text-accent">{title}</p>
          <p className="mt-1">{body}</p>
          {sources.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {sources.slice(0, 4).map((source) => (
                <a
                  key={source.href || source.label}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm transition hover:text-secondary dark:bg-slate-900 dark:text-blue-100"
                >
                  {source.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
