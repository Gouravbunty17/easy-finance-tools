import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

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

  return (
    <div className="min-h-screen">
      <SEO
        title="EasyFinanceTools Blog"
        description="Canadian finance guides covering TFSA, RRSP, tax, mortgage, savings, retirement, ETFs, and household money decisions."
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
            {filteredPosts.length === 0 ? (
              <div className="surface-card p-8 text-center text-slate-500 dark:text-slate-300">
                No blog posts matched that search yet.
              </div>
            ) : (
              filteredPosts.map((post) => {
                const style = categoryStyle[post.category] || {
                  gradient: "from-blue-500 to-indigo-700",
                  icon: "Read",
                };

                return (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
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
                  </Link>
                );
              })
            )}
          </div>

          <aside className="space-y-5">
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
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {tool.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
