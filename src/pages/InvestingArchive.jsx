import { Link, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import SurfaceTrackedLink from "../components/SurfaceTrackedLink";
import { categoryStyle, posts } from "./Blog";

const PAGE_SIZE = 8;

const investingCategories = new Set(["Investing", "Dividends", "TFSA", "TFSA & RRSP", "RRSP", "Beginners"]);

const topicClusters = [
  {
    title: "TFSA investing",
    body: "Contribution room, account order, TFSA brokers, ETF fit, and mistakes that can waste room.",
    href: "/blog/how-much-tfsa-room-2026",
  },
  {
    title: "ETF guides",
    body: "How to compare broad-market, dividend, covered-call, and all-in-one ETFs in Canada.",
    href: "/blog/best-etfs-for-tfsa-canada-2026",
  },
  {
    title: "Dividend strategy",
    body: "Dividend income targets, DRIPs, yield tradeoffs, and realistic cash-flow planning.",
    href: "/blog/dividend-reinvestment-plans-canada",
  },
  {
    title: "Beginner investing",
    body: "Account order, first ETF decisions, platform choice, and practical next steps.",
    href: "/blog/how-to-start-investing-canada-2026",
  },
];

const depthQueue = [
  "What is a dividend ETF?",
  "How to choose ETFs in Canada",
  "TFSA investing mistakes",
  "DRIP strategy Canada",
  "Covered call ETFs explained",
];

function formatDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function clampPage(value, totalPages) {
  const page = Number.parseInt(value || "1", 10);
  if (Number.isNaN(page) || page < 1) return 1;
  return Math.min(page, totalPages);
}

export default function InvestingArchive() {
  const [searchParams] = useSearchParams();
  const investingPosts = posts.filter((post) => investingCategories.has(post.category));
  const totalPages = Math.max(1, Math.ceil(investingPosts.length / PAGE_SIZE));
  const currentPage = clampPage(searchParams.get("page"), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visiblePosts = investingPosts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <SEO
        title="Investing Guides Canada | TFSA, ETFs, Dividends & Beginner Articles"
        description="Browse EasyFinanceTools investing guides for Canadian TFSA investors, ETF research, dividend strategy, RRSP decisions, and beginner investing steps."
        canonical="https://easyfinancetools.com/blog/investing"
      />

      <section className="border-b bg-white px-4 py-12 dark:border-slate-800 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/blog" className="font-semibold text-primary hover:text-secondary dark:text-accent">
              Blog
            </Link>
            <span>/</span>
            <span>Investing</span>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Investing archive</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-primary dark:text-white md:text-6xl">
                Canadian investing guides, organized like a real library
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                TFSA investing, ETFs, dividends, RRSP account order, broker comparisons, and beginner guides in one archive. The goal is to help readers understand the strategy before they use a calculator or open an account.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-bold text-primary dark:text-accent">Editorial note</p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                EasyFinanceTools articles are educational, Canadian-focused, and reviewed against the site methodology. Calculator outputs and articles are not personalized financial advice.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/methodology" className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm dark:bg-slate-800 dark:text-accent">
                  Methodology
                </Link>
                <Link to="/editorial-standards" className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm dark:bg-slate-800 dark:text-accent">
                  Editorial standards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {topicClusters.map((topic) => (
            <SurfaceTrackedLink
              key={topic.title}
              to={topic.href}
              eventName="investing_archive_cta_click"
              ctaLabel={`topic_${topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
              trackingParams={{ section: "topic_clusters", destination_type: "article" }}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <h2 className="text-lg font-bold text-primary dark:text-accent">{topic.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{topic.body}</p>
            </SurfaceTrackedLink>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Archive page {currentPage}</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Investing articles</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {investingPosts.length} articles across {totalPages} pages
              </p>
            </div>

            <div className="space-y-4">
              {visiblePosts.map((post) => {
                const style = categoryStyle[post.category] || categoryStyle.Investing;

                return (
                  <SurfaceTrackedLink
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    eventName="investing_archive_cta_click"
                    ctaLabel={`article_${post.slug}`}
                    trackingParams={{ section: "article_archive", destination_type: "article", article_slug: post.slug }}
                    className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className={`rounded-full bg-gradient-to-r ${style.gradient} px-2.5 py-1 font-semibold text-white`}>
                        {post.category}
                      </span>
                      <span>{formatDate(post.date)}</span>
                      <span>{post.readTime}</span>
                      <span>By EasyFinanceTools editorial</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-bold leading-tight text-primary dark:text-white">{post.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-secondary">Read article</span>
                  </SurfaceTrackedLink>
                );
              })}
            </div>

            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Investing archive pagination">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <Link
                  key={page}
                  to={page === 1 ? "/blog/investing" : `/blog/investing?page=${page}`}
                  className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                    page === currentPage
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 bg-white text-primary hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-accent"
                  }`}
                >
                  {page}
                </Link>
              ))}
            </nav>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-primary dark:text-accent">Depth queue before May 10</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                These are the next educational explainers this section should add so the site feels more like a Canadian finance publication.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {depthQueue.map((item) => (
                  <li key={item} className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-primary dark:text-accent">Useful tools</h2>
              <div className="mt-4 grid gap-3">
                {[
                  { label: "TFSA calculator", href: "/tools/tfsa-calculator" },
                  { label: "RRSP calculator", href: "/tools/rrsp-calculator" },
                  { label: "Dividend calculator", href: "/tools/dividend-calculator" },
                  { label: "Compound interest calculator", href: "/tools/compound-interest-calculator" },
                ].map((tool) => (
                  <SurfaceTrackedLink
                    key={tool.href}
                    to={tool.href}
                    eventName="investing_archive_cta_click"
                    ctaLabel={`tool_${tool.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                    trackingParams={{ section: "sidebar_tools", destination_type: "tool" }}
                    className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:text-secondary dark:bg-slate-800 dark:text-accent"
                  >
                    {tool.label}
                  </SurfaceTrackedLink>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
