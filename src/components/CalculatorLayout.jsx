import React from "react";
import SEO from "./SEO";
import ToolPageSchema from "./ToolPageSchema";
import ToolByline from "./ToolByline";
import PrivacyNote from "./PrivacyNote";
import SourceNote from "./SourceNote";
import CalculatorResultGuidance from "./CalculatorResultGuidance";
import RelatedContent from "./RelatedContent";
import MobileCalculateBar from "./MobileCalculateBar";

export function fmtCAD(value, options = {}) {
  return Number(value || 0).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
  });
}

export function fmtNum(value, options = {}) {
  return Number(value || 0).toLocaleString("en-CA", {
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
  });
}

export function ResultCard({ label, value, hint, tone = "default" }) {
  const toneClasses = {
    default: "bg-white text-primary dark:bg-slate-900 dark:text-accent",
    primary: "bg-gradient-to-br from-primary to-secondary text-white",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  };
  const dimClasses = {
    default: "text-slate-500 dark:text-slate-400",
    primary: "text-white/75",
    success: "text-emerald-800 dark:text-emerald-400",
    warning: "text-amber-800 dark:text-amber-500",
  };

  return (
    <div className={`rounded-[1.35rem] border border-slate-200/80 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-white/60 dark:border-slate-700 dark:ring-slate-800/60 ${toneClasses[tone] || toneClasses.default}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${dimClasses[tone] || dimClasses.default}`}>{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {hint ? <p className={`mt-2 text-sm ${dimClasses[tone] || dimClasses.default}`}>{hint}</p> : null}
    </div>
  );
}

export default function CalculatorLayout({
  title,
  description,
  canonical,
  badge,
  children,
  results,
  relatedTools = [],
  footerNote,
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-28 pt-12 lg:py-12">
      <SEO title={title} description={description} canonical={canonical} />
      {canonical && title ? (
        <ToolPageSchema
          name={title}
          description={description}
          canonical={canonical}
          category="FinanceApplication"
        />
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          {badge ? (
            <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:bg-slate-800 dark:text-secondary">
              {badge}
            </div>
          ) : null}
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">{title}</h1>
          <ToolByline />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">{description}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <PrivacyNote compact />
            <SourceNote
              title="Educational estimate"
              body="Use this output as a planning estimate, then verify important tax, account, rate, or program rules with official Canadian sources."
            />
          </div>
          <div className="mt-8">{children}</div>
        </div>

        <aside id="calculator-results" className="scroll-mt-24 space-y-4 lg:sticky lg:top-24 lg:self-start">
          {results}
          <CalculatorResultGuidance
            assumptions={[
              "The output uses the numbers currently entered on this page.",
              "Rates, limits, and tax treatment are simplified for planning.",
              "Results should be checked against current Canadian rules before acting.",
            ]}
            caveats={[
              "This is an educational estimate, not personalized financial, tax, legal, or investment advice.",
              "Provincial rules, eligibility, fees, and timing can change the result.",
            ]}
            nextLinks={relatedTools.slice(0, 2).map((tool) => ({ label: tool.title, href: tool.href }))}
          />
        </aside>
      </div>

      {relatedTools.length > 0 ? (
        <RelatedContent
          className="mt-10"
          title="Related calculators and guides"
          intro="Use these next to compare the result against a related Canadian finance decision."
          items={relatedTools.map((tool) => ({
            type: tool.href.startsWith("/tools/") ? "Calculator" : "Guide",
            title: tool.title,
            href: tool.href,
            body: tool.body,
          }))}
          trackingContext="calculator_related_content"
        />
      ) : null}

      {footerNote ? <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{footerNote}</p> : null}
      <MobileCalculateBar />
    </section>
  );
}
