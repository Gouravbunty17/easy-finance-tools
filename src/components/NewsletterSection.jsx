import React from "react";

const UPDATE_CATEGORIES = [
  "CRA rule and limit changes",
  "TFSA, RRSP, and FHSA updates",
  "Retirement planning explainers",
  "Calculator methodology changes",
  "Mortgage-rule and affordability updates",
  "New decision-support tools",
  "Canadian financial planning frameworks",
];

const TRUST_NOTES = [
  {
    title: "No signup required",
    body: "Every calculator and guide remains available without creating an account or joining an email list.",
  },
  {
    title: "No calculator-input marketing",
    body: "Inputs entered into calculators are not used for newsletter targeting, lead scoring, or product follow-up.",
  },
  {
    title: "Educational updates only",
    body: "The newsletter should cover Canadian finance rules, tool improvements, methodology notes, and planning explainers.",
  },
  {
    title: "No aggressive marketing",
    body: "No popups, pressure tactics, market-call hype, or affiliate-first messaging.",
  },
];

const ARCHIVE_PREVIEW = [
  {
    title: "CRA and registered-account limit updates",
    body: "Short notes when TFSA, RRSP, FHSA, tax, CPP, or OAS assumptions need review.",
  },
  {
    title: "Calculator change notes",
    body: "Plain-language summaries when formulas, assumptions, source links, or methodology sections change.",
  },
  {
    title: "Decision-framework explainers",
    body: "Educational walkthroughs for account order, retirement uncertainty, dividend risk, and mortgage tradeoffs.",
  },
];

export const NEWSLETTER_PROVIDER_OPTIONS = [
  {
    name: "MailerLite",
    fit: "Simple education-first list, clean embedded forms, reasonable privacy controls.",
  },
  {
    name: "Beehiiv",
    fit: "Good archive and publication workflow if the newsletter becomes a recurring editorial product.",
  },
  {
    name: "ConvertKit",
    fit: "Useful if future tagging is needed, but tags should not be based on calculator inputs.",
  },
];

export function NewsletterTrustNote({ compact = false }) {
  return (
    <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
      {TRUST_NOTES.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-emerald-200 bg-white/75 p-4 text-sm dark:border-emerald-900 dark:bg-slate-900/70"
        >
          <h3 className="font-bold text-primary dark:text-accent">{item.title}</h3>
          <p className="mt-2 leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function NewsletterArchivePreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Archive structure</p>
      <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">Future public update archive</h3>
      <div className="mt-4 grid gap-3">
        {ARCHIVE_PREVIEW.map((item) => (
          <div key={item.title} className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/80">
            <p className="font-semibold text-primary dark:text-accent">{item.title}</p>
            <p className="mt-1 leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProviderReadinessNote() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Inactive by design</p>
      <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">Email collection is not active yet</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
        EasyFinanceTools should only collect email addresses after a real provider, consent language, unsubscribe flow, privacy review, and storage process are configured. Until then, this section explains the intended update policy without pretending a signup works.
      </p>
      <div className="mt-4 grid gap-2">
        {NEWSLETTER_PROVIDER_OPTIONS.map((provider) => (
          <div key={provider.name} className="rounded-xl bg-white px-3 py-2 text-xs leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <span className="font-bold text-primary dark:text-accent">{provider.name}:</span> {provider.fit}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NewsletterSection({
  eyebrow = "Optional Canadian finance updates",
  title = "Follow Canadian finance rule changes and tool improvements.",
  description = "A future newsletter should help readers keep up with CRA limits, registered-account changes, calculator updates, methodology notes, and practical planning explainers. It should not be a product funnel or investment-pick list.",
  compact = false,
}) {
  return (
    <section
      className={`${compact ? "rounded-2xl p-5" : "rounded-3xl p-6"} border border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20`}
      aria-labelledby="newsletter-section-title"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">{eyebrow}</p>
          <h2 id="newsletter-section-title" className={`${compact ? "text-xl" : "text-3xl"} mt-2 font-bold text-primary dark:text-accent`}>
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-300">{description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {UPDATE_CATEGORIES.map((category) => (
              <span
                key={category}
                className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-100"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-5">
            <NewsletterTrustNote compact={compact} />
          </div>
        </div>

        <div className="space-y-4">
          <ProviderReadinessNote />
          {!compact ? <NewsletterArchivePreview /> : null}
        </div>
      </div>
    </section>
  );
}
