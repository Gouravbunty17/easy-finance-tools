import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import SurfaceTrackedLink from "../components/SurfaceTrackedLink";

const categoryStyle = {
  Retirement: { gradient: "from-purple-500 to-purple-700", icon: "CA" },
  Tax: { gradient: "from-orange-500 to-red-600", icon: "Tax" },
  RRSP: { gradient: "from-green-500 to-emerald-700", icon: "RRSP" },
  Savings: { gradient: "from-teal-500 to-cyan-700", icon: "Save" },
  "TFSA & RRSP": { gradient: "from-blue-500 to-indigo-700", icon: "Mix" },
  TFSA: { gradient: "from-blue-400 to-blue-700", icon: "TFSA" },
  Investing: { gradient: "from-indigo-500 to-violet-700", icon: "ETF" },
  FHSA: { gradient: "from-emerald-500 to-teal-700", icon: "Home" },
  Dividends: { gradient: "from-yellow-500 to-amber-600", icon: "Cash" },
  "Real Estate": { gradient: "from-rose-500 to-red-700", icon: "Home" },
  Budget: { gradient: "from-slate-500 to-gray-700", icon: "Plan" },
  Beginners: { gradient: "from-sky-500 to-blue-700", icon: "Learn" },
};

const posts = [
  {
    slug: "best-dividend-investing-platforms-canada",
    title: "Best Dividend Investing Platforms in Canada (2026)",
    date: "2026-04-04",
    category: "Investing",
    readTime: "10 min",
    excerpt: "A practical shortlist of the best dividend investing platforms in Canada, including beginner-friendly and more self-directed options for TFSA and RRSP investors.",
  },
  {
    slug: "best-investing-apps-canada",
    title: "Best Investing Apps in Canada (2026)",
    date: "2026-04-04",
    category: "Investing",
    readTime: "11 min",
    excerpt: "A practical shortlist of the best investing apps in Canada, including simple beginner options and more self-directed app-based platforms.",
  },
  {
    slug: "best-rrsp-accounts-canada",
    title: "Best RRSP Accounts in Canada (2026)",
    date: "2026-04-04",
    category: "Investing",
    readTime: "11 min",
    excerpt: "A practical shortlist of the best RRSP accounts in Canada, including simple beginner options and more hands-on self-directed platforms.",
  },
  {
    slug: "best-tfsa-brokers-canada",
    title: "Best TFSA Brokers in Canada (2026)",
    date: "2026-04-04",
    category: "Investing",
    readTime: "11 min",
    excerpt: "A practical shortlist of the best TFSA brokers in Canada, including beginner-friendly and more hands-on self-directed options.",
  },
  {
    slug: "wealthsimple-vs-questrade-canada",
    title: "Wealthsimple vs Questrade for Canadians (2026)",
    date: "2026-04-03",
    category: "Investing",
    readTime: "11 min",
    excerpt: "A practical comparison of Wealthsimple vs Questrade for TFSA, RRSP, FHSA, fees, ease of use, and beginner-friendliness.",
  },
  {
    slug: "how-to-invest-in-canada-beginners-2026",
    title: "How to Invest in Canada: Complete Beginner's Guide (2026)",
    date: "2026-04-02",
    category: "Beginners",
    readTime: "12 min",
    excerpt: "Step-by-step guide to investing in Canada for the first time: what accounts to open, which ETFs to buy, how much to start with, and the biggest mistakes to avoid.",
  },
  {
    slug: "best-hisa-canada-2026",
    title: "Best High-Interest Savings Accounts in Canada (2026)",
    date: "2026-04-02",
    category: "Savings",
    readTime: "8 min",
    excerpt: "Compare the top HISA rates in Canada for 2026 and learn where to park an emergency fund or short-term savings.",
  },
  {
    slug: "emergency-fund-canada",
    title: "How to Build an Emergency Fund in Canada (Step-by-Step)",
    date: "2026-04-02",
    category: "Savings",
    readTime: "7 min",
    excerpt: "How much you really need, where to keep it, and a practical step-by-step plan to build it.",
  },
  {
    slug: "pay-off-mortgage-faster-canada",
    title: "7 Ways to Pay Off Your Mortgage Faster in Canada",
    date: "2026-04-02",
    category: "Real Estate",
    readTime: "9 min",
    excerpt: "Practical strategies to shave years off your mortgage and save on interest without refinancing.",
  },
  {
    slug: "canada-child-benefit-2026",
    title: "Canada Child Benefit (CCB) 2026 - Amounts, Dates and How to Apply",
    date: "2026-04-02",
    category: "Tax",
    readTime: "8 min",
    excerpt: "Payment amounts, income thresholds, key dates, and how to apply for the Canada Child Benefit.",
  },
  {
    slug: "cpp-payment-dates-2026",
    title: "CPP Payment Dates 2026: Complete Schedule + Maximum Amounts",
    date: "2026-03-29",
    category: "Retirement",
    readTime: "7 min",
    excerpt: "All 12 CPP payment dates for 2026, maximum amounts, and collection timing choices.",
  },
  {
    slug: "oas-payment-dates-2026",
    title: "OAS Payment Dates 2026: Full Schedule, Amounts and Increases",
    date: "2026-03-29",
    category: "Retirement",
    readTime: "6 min",
    excerpt: "OAS payment schedule, current benefit amounts, GIS context, and clawback thresholds.",
  },
  {
    slug: "canadian-tax-brackets-2026",
    title: "Canadian Tax Brackets 2026: Federal and All Provincial Rates",
    date: "2026-03-29",
    category: "Tax",
    readTime: "8 min",
    excerpt: "Federal and provincial tax brackets, marginal vs effective rate, and key payroll assumptions.",
  },
  {
    slug: "rrsp-deadline-2026",
    title: "RRSP Deadline 2026: Contribution Deadline, Limits and Tax Refund Tips",
    date: "2026-03-29",
    category: "RRSP",
    readTime: "7 min",
    excerpt: "The RRSP contribution deadline, refund context, and last-minute contribution planning ideas.",
  },
  {
    slug: "best-gic-rates-canada-2026",
    title: "Best GIC Rates in Canada (March 2026)",
    date: "2026-03-29",
    category: "Savings",
    readTime: "7 min",
    excerpt: "Compare leading GIC rates, laddering ideas, and when a GIC may beat a savings ETF.",
  },
  {
    slug: "tfsa-vs-rrsp-2026",
    title: "TFSA vs RRSP: Which Is Better in 2026?",
    date: "2026-03-28",
    category: "TFSA & RRSP",
    readTime: "10 min",
    excerpt: "When to choose a TFSA, when an RRSP wins, and how to use both together.",
  },
  {
    slug: "how-much-tfsa-room-2026",
    title: "How Much TFSA Room Do I Have in 2026?",
    date: "2026-03-28",
    category: "TFSA",
    readTime: "6 min",
    excerpt: "Contribution limits, cumulative room context, and how to check your available TFSA space.",
  },
  {
    slug: "best-etfs-for-tfsa-canada-2026",
    title: "Best ETFs for Your TFSA in Canada (2026)",
    date: "2026-03-28",
    category: "Investing",
    readTime: "9 min",
    excerpt: "XEQT, VEQT, VDY, ZSP and more: common ETF choices for Canadian TFSA investors.",
  },
  {
    slug: "how-to-use-fhsa-canada",
    title: "How to Use the FHSA in Canada (2026 Guide)",
    date: "2026-03-28",
    category: "FHSA",
    readTime: "8 min",
    excerpt: "FHSA eligibility, contribution limits, tax treatment, and how it fits a first-home plan.",
  },
  {
    slug: "weekly-dividend-etfs",
    title: "What Are Weekly Dividend ETFs, and How Do They Work?",
    date: "2025-06-30",
    category: "Dividends",
    readTime: "8 min",
    excerpt: "How weekly dividend ETFs work, the tradeoffs involved, and who they may fit.",
  },
];

const categories = [
  "All",
  "Beginners",
  "Savings",
  "Real Estate",
  "Tax",
  "Retirement",
  "RRSP",
  "TFSA & RRSP",
  "TFSA",
  "FHSA",
  "Investing",
  "Dividends",
  "Budget",
];

const featuredComparisonSlugs = [
  "wealthsimple-vs-questrade-canada",
  "best-tfsa-brokers-canada",
  "best-rrsp-accounts-canada",
  "best-investing-apps-canada",
  "best-dividend-investing-platforms-canada",
];

const decisionTracks = [
  {
    title: "FHSA and first-home planning",
    body: "Use the guide and the calculator together when you are deciding whether the FHSA should get the next contribution.",
    primaryHref: "/blog/how-to-use-fhsa-canada",
    primaryLabel: "Read FHSA guide",
    secondaryHref: "/tools/fhsa-calculator",
    secondaryLabel: "Open FHSA planner",
  },
  {
    title: "TFSA vs RRSP contribution decisions",
    body: "Start with the comparison page, then move into the matching calculators once the account choice starts to narrow.",
    primaryHref: "/blog/tfsa-vs-rrsp-2026",
    primaryLabel: "Compare TFSA vs RRSP",
    secondaryHref: "/tools/tfsa-calculator",
    secondaryLabel: "Open TFSA calculator",
  },
  {
    title: "Dividend income and ETF choices",
    body: "Use the ETF guide, the income simulator, and the platform comparison pages as one workflow instead of separate clicks.",
    primaryHref: "/blog/best-etfs-for-tfsa-canada-2026",
    primaryLabel: "Read ETF guide",
    secondaryHref: "/tools/dividend-calculator",
    secondaryLabel: "Open ETF income simulator",
  },
];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, search]);

  const featuredPosts = useMemo(
    () => filteredPosts.filter((post) => featuredComparisonSlugs.includes(post.slug)),
    [filteredPosts]
  );

  const regularPosts = useMemo(
    () => filteredPosts.filter((post) => !featuredComparisonSlugs.includes(post.slug)),
    [filteredPosts]
  );

  return (
    <div className="min-h-screen">
      <SEO
        title="EasyFinanceTools Blog"
        description="Canadian finance guides and decision tracks for FHSA, TFSA, RRSP, dividend income, ETFs, tax planning, and first-home saving."
        canonical="https://easyfinancetools.com/blog"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Guides and explainers
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">EasyFinanceTools Blog</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-100">
            Canadian finance guides for tax, savings, registered accounts, retirement, ETFs, and household planning decisions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="surface-soft mb-6 p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use this blog</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Start with an original guide, then move into the matching calculator</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                These articles are written to explain Canadian-specific finance decisions in plain language, then send readers into the most relevant calculator or comparison page. That means the blog is not just a post archive. It is the explanatory layer that helps users understand TFSA, RRSP, tax, mortgage, savings, and investing decisions before relying on a number.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                { label: "Methodology and sources", href: "/methodology", cta: "blog_intro_methodology" },
                { label: "Editorial standards", href: "/editorial-standards", cta: "blog_intro_editorial_standards" },
                { label: "About EasyFinanceTools", href: "/about", cta: "blog_intro_about" },
              ].map((item) => (
                <SurfaceTrackedLink
                  key={item.href}
                  to={item.href}
                  eventName="blog_index_cta_click"
                  ctaLabel={item.cta}
                  trackingParams={{ section: "blog_intro", destination_type: "trust_page" }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {item.label}
                </SurfaceTrackedLink>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-card mb-6 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Decision tracks</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the blog as a decision layer, not just a reading list</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {decisionTracks.map((track) => (
              <div key={track.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{track.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{track.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SurfaceTrackedLink
                    to={track.primaryHref}
                    eventName="blog_index_cta_click"
                    ctaLabel={track.primaryLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
                    trackingParams={{ section: "decision_tracks", destination_type: "article" }}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
                  >
                    {track.primaryLabel}
                  </SurfaceTrackedLink>
                  <SurfaceTrackedLink
                    to={track.secondaryHref}
                    eventName="blog_index_cta_click"
                    ctaLabel={track.secondaryLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
                    trackingParams={{ section: "decision_tracks", destination_type: "tool" }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-600 dark:text-slate-100"
                  >
                    {track.secondaryLabel}
                  </SurfaceTrackedLink>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="Search posts, topics, or calculators..."
              className="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="flex items-center rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-300">
              {filteredPosts.length} matching articles
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                activeCategory === category
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            {featuredPosts.length > 0 && (
              <div className="surface-soft p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Highest-intent comparisons</p>
                    <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Best pages to choose an investing platform</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Start here if you are deciding where to open a TFSA, RRSP, or beginner investing account.
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {featuredPosts.map((post) => (
                    <SurfaceTrackedLink
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      eventName="blog_index_cta_click"
                      ctaLabel={`featured_comparison_${post.slug}`}
                      trackingParams={{ section: "featured_comparisons", destination_type: "article", article_slug: post.slug }}
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                    >
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Comparison
                      </span>
                      <h3 className="mt-3 text-lg font-bold text-primary dark:text-accent">{post.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{post.excerpt}</p>
                      <span className="mt-4 inline-block text-sm font-semibold text-secondary">Open comparison</span>
                    </SurfaceTrackedLink>
                  ))}
                </div>
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="surface-card p-8 text-center text-slate-500 dark:text-slate-300">
                No blog posts matched that search yet.
              </div>
            ) : (
              regularPosts.map((post) => {
                const style = categoryStyle[post.category] || {
                  gradient: "from-blue-500 to-indigo-700",
                  icon: "Read",
                };

                return (
                  <SurfaceTrackedLink
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    eventName="blog_index_cta_click"
                    ctaLabel={`article_card_${post.slug}`}
                    trackingParams={{ section: "article_list", destination_type: "article", article_slug: post.slug }}
                    className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-lg dark:border-slate-700 dark:bg-gray-900"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div
                        className={`flex h-28 items-center justify-center bg-gradient-to-br ${style.gradient} px-4 sm:w-36 sm:flex-shrink-0 sm:px-0`}
                      >
                        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold text-white">
                          {style.icon}
                        </span>
                      </div>
                      <div className="flex-1 p-5">
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className={`rounded-full bg-gradient-to-r ${style.gradient} px-2.5 py-0.5 font-semibold text-white`}>
                            {post.category}
                          </span>
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h2 className="text-xl font-bold leading-snug text-primary transition group-hover:text-secondary dark:text-white">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{post.excerpt}</p>
                        <span className="mt-4 inline-block text-sm font-semibold text-secondary">
                          Read article
                        </span>
                      </div>
                    </div>
                  </SurfaceTrackedLink>
                );
              })
            )}
          </div>

          <aside className="space-y-5">
            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Why these guides exist</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                The blog is meant to add context, examples, and Canadian-specific explanation around the calculators. Important pages should make it easier to understand a decision, not just click a button.
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  { label: "Read methodology", href: "/methodology", cta: "sidebar_trust_methodology" },
                  { label: "Read editorial standards", href: "/editorial-standards", cta: "sidebar_trust_editorial_standards" },
                ].map((item) => (
                  <SurfaceTrackedLink
                    key={item.href}
                    to={item.href}
                    eventName="blog_index_cta_click"
                    ctaLabel={item.cta}
                    trackingParams={{ section: "sidebar_trust", destination_type: "trust_page" }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {item.label}
                  </SurfaceTrackedLink>
                ))}
              </div>
            </div>

            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Start with comparisons</h3>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "Wealthsimple vs Questrade", href: "/blog/wealthsimple-vs-questrade-canada" },
                  { label: "Best TFSA Brokers", href: "/blog/best-tfsa-brokers-canada" },
                  { label: "Best RRSP Accounts", href: "/blog/best-rrsp-accounts-canada" },
                  { label: "Best Investing Apps", href: "/blog/best-investing-apps-canada" },
                ].map((item) => (
                  <SurfaceTrackedLink
                    key={item.href}
                    to={item.href}
                    eventName="blog_index_cta_click"
                    ctaLabel={`sidebar_comparison_${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                    trackingParams={{ section: "sidebar_comparisons", destination_type: "article" }}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {item.label}
                  </SurfaceTrackedLink>
                ))}
              </div>
            </div>

            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Popular topics</h3>
              <div className="mt-3 grid gap-2">
                {["Retirement", "Tax", "RRSP", "TFSA", "Savings", "Investing"].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setActiveCategory(topic)}
                    className="rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:text-secondary dark:bg-slate-900 dark:text-slate-200"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Popular tools</h3>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "Income Tax Calculator", href: "/tools/income-tax-calculator" },
                  { label: "TFSA Calculator", href: "/tools/tfsa-calculator" },
                  { label: "RRSP Calculator", href: "/tools/rrsp-calculator" },
                  { label: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
                ].map((tool) => (
                  <SurfaceTrackedLink
                    key={tool.href}
                    to={tool.href}
                    eventName="blog_index_cta_click"
                    ctaLabel={`sidebar_tool_${tool.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                    trackingParams={{ section: "sidebar_tools", destination_type: "tool" }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
