import React from "react";

export default function DividendIncomeProjection({
  title = "Dividend income sensitivity",
  intro = "The capital needed for income changes quickly when the yield assumption changes.",
  monthlyIncome = 500,
  yields = [3, 4.5, 6],
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Income projection</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {yields.map((yieldRate) => {
          const capital = (monthlyIncome * 12) / (yieldRate / 100);
          return (
            <article key={yieldRate} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{yieldRate}% yield</p>
              <p className="mt-2 text-2xl font-bold text-primary dark:text-accent">{capital.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Estimated capital for {monthlyIncome.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })}/month before risk and tax review.</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
