import React from "react";
import { Link } from "react-router-dom";

export default function YouTubeSupportSection({
  title = "Watch the explanation on YouTube",
  description = "A short plain-English video can be added here once the matching Easy Finance Tools explanation is published.",
  videoTitle,
  videoDescription,
  embedUrl,
  calculatorLinks = [],
  guideLinks = [],
  className = "",
}) {
  const hasEmbed = Boolean(embedUrl);
  const relatedLinks = [...calculatorLinks, ...guideLinks].filter((item) => item?.href && item?.label);

  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Video support</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">
        {hasEmbed ? (
          <iframe
            className="aspect-video w-full"
            src={embedUrl}
            title={videoTitle || title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="flex aspect-video items-center justify-center p-6 text-center">
            <div>
              <p className="text-lg font-bold text-primary dark:text-accent">{videoTitle || "Video placeholder"}</p>
              <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                {videoDescription || "Future YouTube videos can be embedded here without autoplay or tracking-heavy popups."}
              </p>
            </div>
          </div>
        )}
      </div>

      {relatedLinks.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {relatedLinks.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm transition hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
            >
              <span className="font-bold text-primary dark:text-accent">{item.label}</span>
              {item.body ? <span className="mt-1 block leading-6 text-slate-600 dark:text-slate-300">{item.body}</span> : null}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
