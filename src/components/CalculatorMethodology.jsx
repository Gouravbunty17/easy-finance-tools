import React from "react";

export default function CalculatorMethodology({
  title = "Calculator methodology",
  points = [
    "Calculations run in your browser from the inputs shown on the page.",
    "Results are rounded for readability and should be treated as estimates.",
    "Where a Canadian rule applies, the page should be checked against the relevant official source before decisions are made.",
  ],
}) {
  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Methodology</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {points.map((point) => (
          <li key={point} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
