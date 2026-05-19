import React from "react";
import { Link } from "react-router-dom";

export default function CalculatorResultGuidance({
  whatThisResultMeans,
  assumptions = [],
  keyAssumptions,
  canadianTaxCaveat,
  caveats = [],
  source,
  sources = [],
  nextStepLinks = [],
  nextLinks = [],
  relatedCalculator,
  className = "",
}) {
  const normalizedAssumptions = keyAssumptions || assumptions;
  const normalizedCaveats = canadianTaxCaveat ? [canadianTaxCaveat, ...caveats] : caveats;
  const normalizedNextLinks = nextStepLinks.length ? nextStepLinks : nextLinks;
  const normalizedSources = source ? [source, ...sources] : sources;

  return (
    <section className={`rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Calculator guidance</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What this result means</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {whatThisResultMeans || "Use this result as a planning estimate, then review the assumptions, Canadian caveats, official sources, and next-step links before acting on it."}
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {normalizedAssumptions.length ? (
          <div>
            <h3 className="text-sm font-bold text-primary dark:text-accent">Key assumptions</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {normalizedAssumptions.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
        ) : null}

        {normalizedCaveats.length ? (
          <div>
            <h3 className="text-sm font-bold text-primary dark:text-accent">Canadian tax caveat</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {normalizedCaveats.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
        ) : null}

        <div>
          <h3 className="text-sm font-bold text-primary dark:text-accent">Sources and next steps</h3>
          {normalizedSources.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {normalizedSources.slice(0, 4).map((item) => (
                <a
                  key={item.href || item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm transition hover:text-secondary dark:bg-slate-950 dark:text-emerald-100"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
          <div className="mt-4 space-y-2 text-sm leading-6">
            {relatedCalculator ? (
              <Link to={relatedCalculator.href} className="block font-semibold text-secondary underline-offset-2 hover:underline dark:text-emerald-300">
                Compare with {relatedCalculator.label}
              </Link>
            ) : null}
            {normalizedNextLinks.map((link) => (
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
