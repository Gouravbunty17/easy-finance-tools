import React from "react";
import SurfaceTrackedLink from "./SurfaceTrackedLink";

export default function RelatedContent({
  title = "Related content",
  intro,
  items = [],
  trackingContext = "related_content",
  limit = 3,
  className = "",
}) {
  const normalizedItems = items.filter((item) => item?.href && item?.title);
  if (!normalizedItems.length) return null;

  return (
    <section className={`rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Related content</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      {intro ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p> : null}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {normalizedItems.slice(0, limit).map((item) => (
          <SurfaceTrackedLink
            key={item.href}
            to={item.href}
            eventName="related_content_click"
            ctaLabel={item.ctaLabel || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
            trackingParams={{
              section: trackingContext,
              content_type: item.type || (item.href.startsWith("/tools/") ? "calculator" : "guide"),
            }}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-gray-900"
          >
            {item.type ? (
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary dark:text-emerald-300">{item.type}</span>
            ) : null}
            <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
            {item.body ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p> : null}
          </SurfaceTrackedLink>
        ))}
      </div>
    </section>
  );
}
