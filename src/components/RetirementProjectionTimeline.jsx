import React from "react";

export default function RetirementProjectionTimeline({
  title = "Retirement planning timeline",
  intro = "Retirement decisions become easier when each stage has a job instead of one giant target number.",
  stages = [
    { year: "Now", title: "Set account priority", body: "Compare RRSP, TFSA, pension, and debt tradeoffs." },
    { year: "10 years", title: "Stress-test assumptions", body: "Review inflation, returns, income, and contribution pace." },
    { year: "Retirement", title: "Convert balances to income", body: "Layer CPP, OAS, RRSP/RRIF, TFSA, and taxable income." },
  ],
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Timeline</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {stages.map((stage, index) => (
          <article key={stage.title} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white dark:bg-accent dark:text-primary">{index + 1}</span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-secondary dark:text-emerald-300">{stage.year}</p>
            <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">{stage.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{stage.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
