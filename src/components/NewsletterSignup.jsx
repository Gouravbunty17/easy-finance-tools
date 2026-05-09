import React from "react";

export default function NewsletterSignup({
  eyebrow = "Tool updates",
  title = "Get Canadian finance tool updates.",
  description = "Follow new calculator releases, source updates, and Canadian finance guide improvements. Newsletter delivery is not connected yet, so this form is a placeholder.",
  compact = false,
}) {
  return (
    <section className={`${compact ? "rounded-2xl p-5" : "rounded-3xl p-6"} border border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">{eyebrow}</p>
      <h2 className={`${compact ? "text-xl" : "text-3xl"} mt-2 font-bold text-primary dark:text-accent`}>{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-300">{description}</p>

      <form className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={(event) => event.preventDefault()} aria-label="Newsletter placeholder form">
        <input
          type="email"
          placeholder="Email signup coming soon"
          aria-label="Newsletter email address"
          disabled
          className="rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm text-slate-500 disabled:cursor-not-allowed disabled:opacity-80 dark:border-emerald-900 dark:bg-slate-900"
        />
        <button
          className="rounded-xl bg-slate-300 px-4 py-3 text-sm font-bold text-slate-700 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-slate-200"
          type="submit"
          disabled
        >
          Coming soon
        </button>
      </form>
      <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">
        Future integration note: this will connect to a proper email provider before collecting addresses. Calculator inputs are never used for newsletter signup.
      </p>
    </section>
  );
}
