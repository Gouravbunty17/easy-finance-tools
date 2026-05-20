import React from "react";
import { Link } from "react-router-dom";

export default function SourceVerificationBlock({
  lastUpdated = "May 20, 2026",
  verifiedFor = "2026",
  sources = [],
  checked = [],
  limitations = [],
  className = "",
}) {
  const visibleSources = sources.filter((source) => source?.href && source?.label).slice(0, 5);

  return (
    <section className={`rounded-3xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/60 dark:bg-blue-950/20 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Source verification</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Checked against official Canadian sources where applicable</h2>
      <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700 dark:text-slate-200 sm:grid-cols-2">
        <p><strong>Last updated:</strong> {lastUpdated}</p>
        <p><strong>Last verified for {verifiedFor}:</strong> official rule pages and source links checked where they apply.</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {visibleSources.length ? (
          <div>
            <h3 className="text-sm font-bold text-primary dark:text-accent">Primary sources used</h3>
            <div className="mt-3 space-y-2">
              {visibleSources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-blue-200 bg-white p-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-blue-900/60 dark:bg-slate-900 dark:text-emerald-300"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <h3 className="text-sm font-bold text-primary dark:text-accent">What was checked</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {(checked.length ? checked : ["Page assumptions", "Source links", "Educational caveats"]).map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-primary dark:text-accent">Known limitations</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {(limitations.length ? limitations : ["This is educational planning support, not personalized advice.", "Official account room, benefit eligibility, tax filing, and lender qualification should be verified before acting."]).map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-blue-200 bg-white p-4 text-sm leading-7 text-slate-700 dark:border-blue-900/60 dark:bg-slate-900 dark:text-slate-300">
        This page is for education and planning support only. It is not financial, tax, legal, mortgage, or investment advice.
        {" "}
        <Link to="/corrections" className="font-semibold text-primary underline-offset-2 hover:underline dark:text-emerald-300">
          Report an error or outdated source.
        </Link>
      </div>
    </section>
  );
}
