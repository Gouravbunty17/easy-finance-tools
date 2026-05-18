import React from 'react';
import SurfaceTrackedLink from './SurfaceTrackedLink';

export default function NextStepLinks({ title = 'What to do next', intro, links = [], trackingContext = 'next_step_links' }) {
  if (!links.length) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Continue learning</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      {intro ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{intro}</p> : null}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {links.map((item) => (
          <SurfaceTrackedLink
            key={item.href}
            to={item.href}
            eventName="next_step_link_click"
            ctaLabel={item.ctaLabel || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
            trackingParams={{ section: trackingContext, destination_type: item.href.startsWith('/blog/') ? 'article' : 'tool' }}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-gray-900"
          >
            <p className="text-lg font-bold text-primary dark:text-accent">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
          </SurfaceTrackedLink>
        ))}
      </div>
    </section>
  );
}
