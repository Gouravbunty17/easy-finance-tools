import React from "react";
import SurfaceTrackedLink from "./SurfaceTrackedLink";

export default function RelatedTools({
  title = "Related tools",
  intro,
  tools = [],
  trackingContext = "related_tools",
  className = "",
}) {
  if (!tools.length) return null;

  return (
    <section className={`rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Continue planning</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      {intro ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p> : null}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <SurfaceTrackedLink
            key={tool.href}
            to={tool.href}
            eventName="related_tool_click"
            ctaLabel={tool.ctaLabel || tool.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
            trackingParams={{ section: trackingContext, destination_type: tool.href.startsWith("/blog/") ? "article" : "tool" }}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-gray-900"
          >
            <p className="text-lg font-bold text-primary dark:text-accent">{tool.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{tool.body}</p>
          </SurfaceTrackedLink>
        ))}
      </div>
    </section>
  );
}
