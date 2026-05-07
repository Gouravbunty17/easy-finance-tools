import React from "react";
import SEO from "../components/SEO";
import SurfaceTrackedLink from "../components/SurfaceTrackedLink";

const guides = [
  {
    group: "ETF Guides",
    items: [
      {
        title: "How to Choose ETFs in Canada: Beginner Checklist",
        href: "/blog/how-to-choose-etfs-canada",
        date: "2026-05-06",
        readTime: "10 min",
        excerpt: "A practical ETF selection checklist covering asset allocation, MER, diversification, currency, tax complexity, and account fit.",
      },
      {
        title: "What Is a Dividend ETF? Canadian Investor Guide",
        href: "/blog/what-is-a-dividend-etf-canada",
        date: "2026-05-06",
        readTime: "9 min",
        excerpt: "Learn how dividend ETFs pay income, what risks to check, and how they may fit a TFSA, RRSP, or taxable account.",
      },
      {
        title: "Covered Call ETFs in Canada Explained",
        href: "/blog/covered-call-etfs-canada-explained",
        date: "2026-05-06",
        readTime: "10 min",
        excerpt: "Understand why covered call ETF yields can be higher, what upside tradeoffs exist, and how to compare income and total return.",
      },
      {
        title: "ETFs for Your TFSA in Canada (2026)",
        href: "/blog/best-etfs-for-tfsa-canada-2026",
        date: "2026-03-28",
        readTime: "9 min",
        excerpt: "Compare common ETF categories for Canadian TFSA investors, including broad-market, dividend, and U.S. equity options.",
      },
    ],
  },
  {
    group: "TFSA Guides",
    items: [
      {
        title: "TFSA Investing Mistakes Canadians Should Avoid",
        href: "/blog/tfsa-investing-mistakes-canada",
        date: "2026-05-06",
        readTime: "9 min",
        excerpt: "Avoid overcontributions, withdrawal timing errors, short-term investing risk, trading tax issues, and foreign dividend surprises.",
      },
      {
        title: "TFSA Contribution Room Canada 2026: Limit, Rules & Common Mistakes",
        href: "/blog/tfsa-contribution-room-canada-2026",
        date: "2026-04-29",
        readTime: "9 min",
        excerpt: "Understand annual limits, unused room, withdrawals, CRA updates, and contribution-room examples.",
      },
      {
        title: "TFSA vs RRSP vs FHSA: Which Account Should Canadians Use First?",
        href: "/blog/tfsa-vs-rrsp-vs-fhsa-canada",
        date: "2026-04-29",
        readTime: "10 min",
        excerpt: "Compare account priority for home buying, retirement, investing flexibility, and tax planning.",
      },
    ],
  },
  {
    group: "Dividend Guides",
    items: [
      {
        title: "Dividend Reinvestment Plans Canada: How DRIPs Work, Pros, Cons & Taxes",
        href: "/blog/dividend-reinvestment-plans-canada",
        date: "2026-05-05",
        readTime: "10 min",
        excerpt: "Learn how DRIPs work in Canada, including brokerage DRIPs, compounding examples, taxable-account reporting, and ACB.",
      },
      {
        title: "DRIP Strategy Canada: When to Reinvest Dividends",
        href: "/blog/drip-strategy-canada",
        date: "2026-05-06",
        readTime: "9 min",
        excerpt: "Decide when reinvesting dividends makes sense and when taking cash may be better for taxes, rebalancing, or income.",
      },
      {
        title: "Canadian Dividend ETFs 2026: Income, Fees & Risks",
        href: "/blog/best-canadian-dividend-etfs-2026",
        date: "2026-04-29",
        readTime: "11 min",
        excerpt: "Compare Canadian dividend ETF categories by income focus, fees, diversification, account fit, and covered-call risk.",
      },
      {
        title: "How to Earn $500/Month from Dividend ETFs in Canada (2026)",
        href: "/blog/500-month-dividend-canada",
        date: "2026-04-23",
        readTime: "9 min",
        excerpt: "Estimate how much capital may be required to target $500 per month in dividend ETF income.",
      },
    ],
  },
  {
    group: "Beginner Investing Guides",
    items: [
      {
        title: "How to Start Investing in Canada (2026)",
        href: "/blog/how-to-start-investing-canada-2026",
        date: "2026-04-23",
        readTime: "10 min",
        excerpt: "A beginner workflow for accounts, savings versus investing, ETF basics, and first contribution decisions.",
      },
      {
        title: "How to Invest in Canada: Complete Beginner's Guide (2026)",
        href: "/blog/how-to-invest-in-canada-beginners-2026",
        date: "2026-04-02",
        readTime: "12 min",
        excerpt: "Step-by-step guidance for first-time Canadian investors choosing accounts, ETFs, and common mistakes to avoid.",
      },
      {
        title: "Investing Apps in Canada (2026)",
        href: "/blog/best-investing-apps-canada",
        date: "2026-04-04",
        readTime: "11 min",
        excerpt: "Compare beginner-friendly and self-directed Canadian investing apps by use case.",
      },
      {
        title: "Wealthsimple vs Questrade for Canadians (2026)",
        href: "/blog/wealthsimple-vs-questrade-canada",
        date: "2026-04-03",
        readTime: "11 min",
        excerpt: "Compare two common Canadian platforms for TFSA, RRSP, FHSA, fees, and beginner fit.",
      },
    ],
  },
];

const allGuides = guides.flatMap((section) => section.items);

export default function InvestingCategory() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Canadian Investing Guides"
        description="Browse Canadian investing guides for TFSAs, ETFs, dividends, DRIPs, covered call ETFs, beginner investing, and platform comparisons."
        canonical="https://easyfinancetools.com/blog/investing"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#14528a] to-emerald-700 px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Canadian investing archive</p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">Investing Guides</h1>
            <p className="mt-4 text-lg leading-8 text-blue-100">
              A structured library for Canadian investors learning about TFSAs, ETFs, dividend income, DRIPs, covered call ETFs, account order, and beginner platform choices.
            </p>
          </div>
          <div className="mt-8 grid gap-3 text-sm sm:grid-cols-4">
            {[
              ["Guides", allGuides.length],
              ["ETF topics", 4],
              ["TFSA topics", 3],
              ["Dividend topics", 4],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-blue-100">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            {guides.map((section) => (
              <section key={section.group} className="surface-card p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Archive section</p>
                    <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{section.group}</h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {section.items.length} articles
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {section.items.map((guide) => (
                    <SurfaceTrackedLink
                      key={guide.href}
                      to={guide.href}
                      eventName="investing_archive_click"
                      ctaLabel={guide.href.replace("/blog/", "")}
                      trackingParams={{ section: section.group, destination_type: "article" }}
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-gray-900"
                    >
                      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                        <span>{guide.date}</span>
                        <span>{guide.readTime}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold leading-snug text-primary dark:text-accent">{guide.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{guide.excerpt}</p>
                      <span className="mt-4 inline-block text-sm font-semibold text-secondary">Read guide</span>
                    </SurfaceTrackedLink>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="surface-soft p-5">
              <h2 className="text-lg font-bold text-primary dark:text-accent">Suggested reading path</h2>
              <div className="mt-4 grid gap-3">
                {[
                  { label: "Start with investing basics", href: "/blog/how-to-start-investing-canada-2026" },
                  { label: "Choose ETFs", href: "/blog/how-to-choose-etfs-canada" },
                  { label: "Avoid TFSA mistakes", href: "/blog/tfsa-investing-mistakes-canada" },
                  { label: "Compare dividend ETFs", href: "/blog/best-canadian-dividend-etfs-2026" },
                ].map((item, index) => (
                  <SurfaceTrackedLink
                    key={item.href}
                    to={item.href}
                    eventName="investing_archive_click"
                    ctaLabel={`reading_path_${index + 1}`}
                    trackingParams={{ section: "reading_path", destination_type: "article" }}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {index + 1}. {item.label}
                  </SurfaceTrackedLink>
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="text-lg font-bold text-primary dark:text-accent">Related calculators</h2>
              <div className="mt-4 grid gap-3">
                {[
                  { label: "TFSA calculator", href: "/tools/tfsa-calculator" },
                  { label: "Dividend calculator", href: "/tools/dividend-calculator" },
                  { label: "Compound interest calculator", href: "/tools/compound-interest-calculator" },
                  { label: "RRSP calculator", href: "/tools/rrsp-calculator" },
                ].map((tool) => (
                  <SurfaceTrackedLink
                    key={tool.href}
                    to={tool.href}
                    eventName="investing_archive_click"
                    ctaLabel={tool.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
                    trackingParams={{ section: "related_tools", destination_type: "tool" }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {tool.label}
                  </SurfaceTrackedLink>
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="text-lg font-bold text-primary dark:text-accent">Editorial trust</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Guides include updated dates, educational disclaimers, methodology notes, source links, FAQ schema, and related calculators where useful.
              </p>
              <div className="mt-4 grid gap-3">
                <SurfaceTrackedLink to="/methodology" eventName="investing_archive_click" ctaLabel="methodology" trackingParams={{ section: "trust", destination_type: "trust_page" }} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  Methodology
                </SurfaceTrackedLink>
                <SurfaceTrackedLink to="/editorial-standards" eventName="investing_archive_click" ctaLabel="editorial_standards" trackingParams={{ section: "trust", destination_type: "trust_page" }} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  Editorial standards
                </SurfaceTrackedLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
