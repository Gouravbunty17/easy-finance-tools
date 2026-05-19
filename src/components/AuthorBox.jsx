import React, { useState } from "react";
import { Link } from "react-router-dom";

const DEFAULT_HEADSHOT_URL = "";

export default function AuthorBox({ className = "", lastReviewed = "", linkedinUrl = "", headshotUrl = DEFAULT_HEADSHOT_URL }) {
  const [imageAvailable, setImageAvailable] = useState(Boolean(headshotUrl));

  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Author and review</p>
      <div className="mt-3 flex items-center gap-4">
        {imageAvailable && headshotUrl ? (
          <img
            src={headshotUrl}
            alt="Gourav Kumar"
            className="h-16 w-16 rounded-2xl object-cover"
            loading="lazy"
            onError={() => setImageAvailable(false)}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-black text-white">GK</div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-accent">Gourav Kumar</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Founder of Easy Finance Tools</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        Gourav Kumar is an independent Canadian personal finance tools creator focused on calculators, investing education, and beginner-friendly financial planning. He is not a licensed financial advisor, accountant, mortgage broker, or tax professional.
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        Content is educational and, where applicable, reviewed against official Canadian sources such as CRA, Government of Canada, Bank of Canada, FCAC, and CMHC guidance.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        <Link to="/about" className="text-secondary underline-offset-2 hover:underline">Read more about Easy Finance Tools</Link>
        <Link to="/founder-transparency" className="text-secondary underline-offset-2 hover:underline">Founder transparency</Link>
        {lastReviewed ? <span className="text-slate-500 dark:text-slate-400">Last reviewed: {lastReviewed}</span> : null}
        {linkedinUrl ? (
          <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-secondary underline-offset-2 hover:underline">LinkedIn</a>
        ) : null}
      </div>
    </section>
  );
}
