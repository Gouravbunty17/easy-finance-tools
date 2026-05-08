import React from 'react';
import TrackedLink from './TrackedLink';

export default function ArticleTrustBox({
  articleSlug = 'article',
  lastUpdated,
  reviewer = 'Gourav Kumar; checked against official Canadian source material where applicable',
  sources = [],
  className = '',
}) {
  return (
    <section
      className={`mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950 shadow-sm dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100 ${className}`}
      aria-label="Article trust and disclaimer"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">
            Important disclaimer
          </p>
          <h2 className="mt-2 text-xl font-bold text-amber-950 dark:text-amber-100">
            Educational content only — not personal financial advice
          </h2>
          <p className="mt-3">
            This article is for general education only. It is not financial, investment, tax, legal, mortgage, or accounting advice. The examples and calculations are estimates based on stated assumptions and may not fit your personal situation.
          </p>
          <p className="mt-2">
            Investing involves risk. Dividends, ETF distributions, interest rates, tax rules, contribution room, and market prices can change. Past performance, advertised yields, and calculator examples do not guarantee future results.
          </p>
          <p className="mt-2 font-semibold">
            Always verify TFSA, RRSP, FHSA, tax, and benefit information with official sources such as CRA and consider speaking with a qualified professional before making decisions.
          </p>
        </div>

        <aside className="rounded-2xl border border-amber-200 bg-white/70 p-4 dark:border-amber-500/30 dark:bg-slate-950/30">
          <p className="font-bold text-amber-950 dark:text-amber-100">Trust notes</p>
          <dl className="mt-3 space-y-3 text-xs leading-6">
            {lastUpdated ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-200">Last updated</dt>
                <dd>{lastUpdated}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-200">Reviewed by</dt>
              <dd>{reviewer}</dd>
            </div>
            {sources.length ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-200">Primary sources</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {sources.map((source) => (
                    <a
                      key={source.href || source.label}
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-900 underline-offset-2 hover:underline dark:bg-amber-900/50 dark:text-amber-100"
                    >
                      {source.label}
                    </a>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-4 grid gap-2">
            <TrackedLink
              articleSlug={articleSlug}
              ctaLabel="trust_box_methodology"
              to="/methodology"
              className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-amber-900 transition hover:border-amber-400 dark:border-amber-500/30 dark:bg-slate-950/40 dark:text-amber-100"
            >
              Methodology
            </TrackedLink>
            <TrackedLink
              articleSlug={articleSlug}
              ctaLabel="trust_box_editorial_standards"
              to="/editorial-standards"
              className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-amber-900 transition hover:border-amber-400 dark:border-amber-500/30 dark:bg-slate-950/40 dark:text-amber-100"
            >
              Editorial standards
            </TrackedLink>
            <TrackedLink
              articleSlug={articleSlug}
              ctaLabel="trust_box_affiliate_disclosure"
              to="/affiliate-disclosure"
              className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-amber-900 transition hover:border-amber-400 dark:border-amber-500/30 dark:bg-slate-950/40 dark:text-amber-100"
            >
              Affiliate disclosure
            </TrackedLink>
          </div>
        </aside>
      </div>
    </section>
  );
}
