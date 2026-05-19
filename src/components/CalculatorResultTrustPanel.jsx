import React from "react";
import { Link } from "react-router-dom";

export default function CalculatorResultTrustPanel({
  assumptions = [],
  caveats = [],
  sources = [],
  nextLinks = [],
  className = "",
}) {
  const hasContent = assumptions.length || caveats.length || sources.length || nextLinks.length;
  if (!hasContent) return null;

  return (
    <section className={`rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Result quality check</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Assumptions, caveats, and sources</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {assumptions.length ? (
          <div>
            <h3 className="text-sm font-bold text-primary dark:text-accent">Assumptions used</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {assumptions.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
        ) : null}
        {caveats.length ? (
          <div>
            <h3 className="text-sm font-bold text-primary dark:text-accent">Canadian caveats</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {caveats.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
        ) : null}
        <div>
          <h3 className="text-sm font-bold text-primary dark:text-accent">Verify or continue</h3>
          {sources.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {sources.slice(0, 4).map((source) => (
                <a
                  key={source.href || source.label}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm transition hover:text-secondary dark:bg-slate-950 dark:text-emerald-100"
                >
                  {source.label}
                </a>
              ))}
            </div>
          ) : null}
          <div className="mt-4 space-y-2 text-sm leading-6">
            {nextLinks.map((link) => (
              <Link key={link.href} to={link.href} className="block font-semibold text-secondary underline-offset-2 hover:underline dark:text-emerald-300">
                {link.label}
              </Link>
            ))}
            <Link to="/corrections" className="block font-semibold text-slate-700 underline-offset-2 hover:underline dark:text-slate-200">
              Report an issue or correction
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
