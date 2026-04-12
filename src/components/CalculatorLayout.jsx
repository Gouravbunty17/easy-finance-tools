import React from "react";
import SEO from "./SEO";
import SurfaceTrackedLink from "./SurfaceTrackedLink";

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

  return (
    <div className={`rounded-2xl border border-slate-200 p-5 dark:border-slate-700 ${toneClasses[tone] || toneClasses.default}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-2 text-sm opacity-75">{hint}</p> : null}
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
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SEO title={title} description={description} canonical={canonical} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          {badge ? (
            <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
              {badge}
            </div>
          ) : null}
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">{description}</p>
          <div className="mt-8">{children}</div>
        </div>

        <aside className="space-y-4">
          {results}

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Ad slot or partner placement can live here once the layout is final. For now this keeps the scaffold spacing consistent.
          </div>
        </aside>
      </div>

      {relatedTools.length > 0 ? (
        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related calculators</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {relatedTools.map((tool) => (
              <SurfaceTrackedLink
                key={tool.href}
                to={tool.href}
                eventName="calculator_related_tool_click"
                ctaLabel={tool.title}
                trackingParams={{ source_title: title, destination_type: "tool", section: "related_tools" }}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <h2 className="text-lg font-bold text-primary dark:text-accent">{tool.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{tool.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      ) : null}

      {footerNote ? <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{footerNote}</p> : null}
    </section>
  );
}
