import React from "react";

export default function AccountComparisonTable({
  title = "Account comparison framework",
  intro = "Use this table to compare the decision role of each account before choosing investments.",
}) {
  const rows = [
    ["TFSA", "Flexible tax-free withdrawals", "No upfront deduction", "Flexibility, medium-term goals, long-term tax-free growth"],
    ["RRSP", "Deduction and tax deferral", "Withdrawals are taxable", "Higher-income retirement saving and employer match"],
    ["FHSA", "Deduction plus qualifying tax-free withdrawal", "Eligibility and home-use rules", "First-home savings when timeline is realistic"],
    ["Taxable", "No registered room limit", "Annual tax reporting and ACB tracking", "Overflow investing and flexible non-registered goals"],
  ];

  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Comparison table</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p>
      <div className="mt-6 max-w-full overflow-x-auto">
        <table className="w-full min-w-[720px] overflow-hidden rounded-2xl border border-slate-200 text-sm dark:border-slate-700">
          <thead className="bg-slate-100 text-left text-primary dark:bg-slate-800 dark:text-accent">
            <tr>
              {["Account", "Usually stronger when", "Watch for", "Educational use case"].map((header) => (
                <th key={header} className="px-4 py-3 font-bold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => (
              <tr key={row[0]} className="bg-white dark:bg-gray-900">
                {row.map((cell) => <td key={cell} className="px-4 py-3 text-slate-700 dark:text-slate-300">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
