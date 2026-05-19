import React from "react";

export default function ContributionGrowthChart({
  title = "Contribution growth example",
  intro = "A simple visual for how steady contributions and growth can separate over time.",
  years = [1, 5, 10, 20],
  contributions = [7000, 35000, 70000, 140000],
  projected = [7200, 41000, 95000, 245000],
}) {
  const maxValue = Math.max(...contributions, ...projected, 1);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Visual framework</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p>
      <div className="mt-6 space-y-4">
        {years.map((year, index) => (
          <div key={year}>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Year {year}</span>
              <span>{projected[index].toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(6, (contributions[index] / maxValue) * 100)}%` }} />
              <div className="-mt-4 h-full rounded-full bg-primary/70 dark:bg-accent/70" style={{ width: `${Math.max(6, (projected[index] / maxValue) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Contributions</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary dark:bg-accent" />Projected value</span>
      </div>
    </section>
  );
}
