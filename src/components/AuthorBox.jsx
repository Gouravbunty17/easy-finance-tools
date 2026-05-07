import React from "react";
import { Link } from "react-router-dom";

export default function AuthorBox({ className = "" }) {
  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Author and review</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Gourav Kumar, Founder of Easy Finance Tools</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        Gourav Kumar is an independent Canadian personal finance tools creator focused on calculators, investing education, and beginner-friendly financial planning. He is not a licensed financial advisor, accountant, mortgage broker, or tax professional.
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        Content is educational and, where applicable, reviewed against official Canadian sources such as CRA, Government of Canada, Bank of Canada, FCAC, and CMHC guidance.
      </p>
      <Link to="/about" className="mt-4 inline-flex text-sm font-semibold text-secondary underline-offset-2 hover:underline">
        Read more about Easy Finance Tools
      </Link>
    </section>
  );
}
