import React from "react";

export default function MortgageBreakdownChart({
  title = "Mortgage decision breakdown",
  intro = "A mortgage decision is not just principal and interest. Qualification, cash to close, and ongoing ownership costs all matter.",
  segments = [
    { label: "Mortgage payment", value: 42, tone: "bg-primary" },
    { label: "Property tax and heat", value: 18, tone: "bg-secondary" },
    { label: "Debt and buffers", value: 16, tone: "bg-amber-500" },
    { label: "Maintenance risk", value: 24, tone: "bg-slate-400" },
  ],
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Home-buying visual</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p>
      <div className="mt-6 flex h-5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {segments.map((segment) => (
          <div key={segment.label} className={segment.tone} style={{ width: `${segment.value}%` }} title={segment.label} />
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {segments.map((segment) => (
          <div key={segment.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/60">
            <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${segment.tone}`} />
            <span className="font-semibold text-primary dark:text-accent">{segment.label}</span>
            <p className="mt-1 text-slate-600 dark:text-slate-300">{segment.value}% of this planning view</p>
          </div>
        ))}
      </div>
    </section>
  );
}
