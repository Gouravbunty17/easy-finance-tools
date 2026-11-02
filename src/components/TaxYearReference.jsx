import React from "react";
import { getTaxYearReference } from "../lib/taxYearReference.mjs";
const cad = n => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
export default function TaxYearReference({ year, onChange }) {
  const data = getTaxYearReference(year);
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-gray-800" aria-label="CRA tax-year reference">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <label htmlFor="tax-year-reference" className="font-bold text-primary dark:text-accent">Published tax-year limits</label>
      <select id="tax-year-reference" value={year} onChange={e=>onChange(Number(e.target.value))} className="rounded-lg border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-900">
        <option value={2026}>2026 · verified</option><option value={2027}>2027 · partial preview</option>
      </select>
    </div>
    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
    {[["National RRSP ceiling", cad(data.rrspDollarLimit)], ["CPP YMPE / YAMPE", `${cad(data.ympe)} / ${cad(data.yampe)}`], ["Max EI earnings", cad(data.eiInsurableMax)], ["EI rate outside Quebec", `${(data.eiRate * 100).toFixed(2)}%`]].map(([name,value])=><div key={name} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><dt className="text-slate-500 dark:text-slate-400">{name}</dt><dd className="mt-1 font-bold">{value}</dd></div>)}
    </dl>
    <p role="status" className="mt-4 text-sm text-amber-800 dark:text-amber-200">{year === 2027 ? "2027 figures are a partial reference only. The income-tax calculator below still models 2026 taxes; it does NOT calculate 2027 taxes. 2027 federal/provincial brackets and the 2027 TFSA limit are not verified here." : "2026 is the calculation year for the income-tax estimator below. Your personal RRSP room is not the national ceiling."}</p>
    <p className="mt-3 text-xs text-slate-500"><a className="underline" href="https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html" target="_blank" rel="noreferrer">CRA plan limits</a> · <a className="underline" href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html" target="_blank" rel="noreferrer">CRA EI rates</a></p>
  </section>;
}
