import React from "react";

const UPDATE_CATEGORIES = [
  "CRA limit changes",
  "TFSA/RRSP/FHSA updates",
  "Calculator corrections",
  "Canadian planning explainers",
];

const TRUST_NOTES = [
  "No signup is required to use any calculator.",
  "Calculator inputs are not used for marketing.",
  "No stock picks, hype, or aggressive email funnel.",
];

export function NewsletterTrustNote({ compact = false }) {
  return (
    <ul className={`grid gap-2 text-sm text-slate-600 dark:text-slate-300 ${compact ? "" : "sm:grid-cols-3"}`}>
      {TRUST_NOTES.map((note) => (
        <li key={note} className="rounded-xl bg-white/70 px-3 py-2 dark:bg-slate-900/50">
          {note}
        </li>
      ))}
    </ul>
  );
}

export default function NewsletterSection({
  eyebrow = "Optional Canadian finance updates",
  title = "Quiet update notes for Canadian planning tools.",
  description = "Occasional educational notes about CRA limits, calculator changes, methodology corrections, and practical Canadian planning explainers. This area explains the update policy without asking for personal information.",
  compact = false,
}) {
  return (
    <section
      className={`${compact ? "rounded-2xl p-5" : "rounded-3xl p-6"} border border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20`}
      aria-labelledby="newsletter-section-title"
    >
      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">{eyebrow}</p>
        <h2 id="newsletter-section-title" className={`${compact ? "text-xl" : "text-3xl"} mt-2 font-bold text-primary dark:text-accent`}>
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-300">{description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {UPDATE_CATEGORIES.map((category) => (
            <span
              key={category}
              className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-100"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <NewsletterTrustNote compact={compact} />
        </div>
      </div>
    </section>
  );
}
