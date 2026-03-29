import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Blog posts
const posts = [
  {
    slug: "cpp-payment-dates-2026",
    title: "CPP Payment Dates 2026: Complete Schedule + Maximum Amounts",
    date: "2026-03-29",
    category: "Retirement",
    readTime: "7 min",
    excerpt: "All 12 CPP payment dates for 2026, maximum monthly amounts, how to set up direct deposit, and when to start collecting CPP at 60, 65, or 70.",
  },
  {
    slug: "oas-payment-dates-2026",
    title: "OAS Payment Dates 2026: Full Schedule, Amounts & Increases",
    date: "2026-03-29",
    category: "Retirement",
    readTime: "6 min",
    excerpt: "Complete OAS payment schedule for 2026, current benefit amounts for ages 65–74 and 75+, the OAS clawback threshold, GIS amounts, and deferral strategies.",
  },
  {
    slug: "canadian-tax-brackets-2026",
    title: "Canadian Tax Brackets 2026: Federal & All Provincial Rates",
    date: "2026-03-29",
    category: "Tax",
    readTime: "8 min",
    excerpt: "Complete 2026 federal and provincial income tax brackets, marginal vs effective rate explained, CPP/EI rates, and the top 6 legal ways to reduce your tax bill.",
  },
  {
    slug: "rrsp-deadline-2026",
    title: "RRSP Deadline 2026: Contribution Deadline, Limits & Tax Refund Tips",
    date: "2026-03-29",
    category: "RRSP",
    readTime: "7 min",
    excerpt: "The 2026 RRSP contribution deadline is March 2, 2026. Learn the 2025 RRSP limit, calculate your refund, and the smartest last-minute contribution strategies.",
  },
  {
    slug: "best-gic-rates-canada-2026",
    title: "Best GIC Rates in Canada (March 2026)",
    date: "2026-03-29",
    category: "Savings",
    readTime: "7 min",
    excerpt: "Compare the best 1-year, 2-year, and 5-year GIC rates from EQ Bank, Oaken, Steinbach, and the big banks. Plus: GIC laddering strategy and CDIC insurance explained.",
  },
  {
    slug: "tfsa-vs-rrsp-2026",
    title: "TFSA vs RRSP: Which Is Better in 2026?",
    date: "2026-03-28",
    category: "TFSA & RRSP",
    readTime: "10 min",
    excerpt: "The #1 question in Canadian finance answered. Learn exactly when to choose a TFSA, when the RRSP wins, and how to use both together to maximize your savings.",
  },
  {
    slug: "how-much-tfsa-room-2026",
    title: "How Much TFSA Room Do I Have in 2026?",
    date: "2026-03-28",
    category: "TFSA",
    readTime: "6 min",
    excerpt: "Full year-by-year TFSA contribution limit table, cumulative totals by birth year, how to check your room via CRA My Account, and common mistakes to avoid.",
  },
  {
    slug: "best-etfs-for-tfsa-canada-2026",
    title: "Best ETFs for Your TFSA in Canada (2026)",
    date: "2026-03-28",
    category: "Investing",
    readTime: "9 min",
    excerpt: "XEQT, VEQT, VDY, ZSP and more — the top ETFs to hold in your Canadian TFSA for growth, dividends, and simplicity. Plus what NOT to put in your TFSA.",
  },
  {
    slug: "how-to-use-fhsa-canada",
    title: "How to Use the FHSA in Canada (2026 Guide)",
    date: "2026-03-28",
    category: "FHSA",
    readTime: "8 min",
    excerpt: "Complete FHSA guide: eligibility, $8,000/year contribution limit, tax-free withdrawals, carry-forward rules, and how to stack it with the RRSP Home Buyers' Plan.",
  },
  {
    slug: "weekly-dividend-etfs",
    title: "What Are Weekly Dividend ETFs, and How Do They Work?",
    date: "2025-06-30",
    category: "Dividends",
    readTime: "8 min",
    excerpt: "Learn how weekly dividend ETFs pay out weekly cash flow, their benefits, risks, and whether they belong in your portfolio.",
  },
];

// Safe AdSense loader hook
const useAdSense = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV !== "development") {
        const ads = document.querySelectorAll(".adsbygoogle");
        ads.forEach((ad) => {
          if (!ad.getAttribute("data-ad-status")) {
            window.adsbygoogle.push({});
          }
        });
      }
    } catch (e) {
      console.error("AdSense push failed:", e);
    }
  }, []);
};

// AdsenseSlot component
function AdsenseSlot({ slot, style = {}, className = "" }) {
  useAdSense();
  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={style}
      data-ad-client="ca-pub-4262496331692202"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}

const categories = ["All", "Retirement", "Tax", "RRSP", "TFSA & RRSP", "TFSA", "FHSA", "Savings", "Investing", "Dividends"];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
      {/* Blog content */}
      <div className="md:col-span-3">
        <h1 className="text-4xl font-bold mb-6 text-primary dark:text-accent">
          Easy Finance Tools Blog
        </h1>
        <input
          type="text"
          placeholder="Search posts…"
          className="w-full p-3 rounded-lg border mb-8 dark:bg-gray-900 dark:border-gray-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Top Ad */}
        <div className="mb-8 flex justify-center">
          <AdsenseSlot
            slot="5385703475"
            style={{ display: "block", minHeight: 90, width: "100%" }}
          />
        </div>

        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400">No blog posts found.</div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="px-2 py-1 bg-primary text-white rounded text-xs">
                    {post.category}
                  </span>
                  {post.readTime && <span>{post.readTime} read</span>}
                </div>
                <h2 className="text-2xl font-semibold mb-1 text-primary dark:text-accent">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-block mt-3 text-primary dark:text-accent underline hover:text-secondary"
                >
                  Read More →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:block">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="font-bold text-lg mb-2 text-primary dark:text-accent">Subscribe</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Get the latest posts & investing tips to your inbox.</p>
          <input
            type="email"
            placeholder="Your email"
            className="w-full p-2 rounded border mb-2 dark:bg-gray-900 dark:border-gray-600"
          />
          <button className="w-full bg-primary text-white rounded p-2 font-bold hover:bg-secondary transition">
            Subscribe
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="font-bold text-lg mb-3 text-primary dark:text-accent">Popular Topics</h3>
          <ul className="space-y-2 text-sm">
            {["Retirement", "Tax", "RRSP", "TFSA & RRSP", "TFSA", "FHSA", "Savings", "Investing", "Dividends"].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className="hover:underline text-left text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent w-full"
                >
                  {cat} <span className="text-gray-400">({posts.filter(p => p.category === cat).length})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Free Tools Promo */}
        <div className="bg-primary text-white rounded-lg shadow p-6 mb-8">
          <h3 className="font-bold text-lg mb-2">Free Calculators</h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Income Tax Calculator", href: "/tools/income-tax-calculator" },
              { label: "TFSA Calculator", href: "/tools/tfsa-calculator" },
              { label: "RRSP Calculator", href: "/tools/rrsp-calculator" },
              { label: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
              { label: "CPP & OAS Estimator", href: "/tools/cpp-oas-estimator" },
            ].map(tool => (
              <li key={tool.href}>
                <a href={tool.href} className="hover:underline opacity-90 hover:opacity-100">{tool.label} →</a>
              </li>
            ))}
          </ul>
        </div>
        {/* Sidebar Ad */}
        <div className="mt-8 flex justify-center">
          <AdsenseSlot
            slot="2290193432"
            style={{ display: "block", minHeight: 250, width: "100%" }}
          />
        </div>
      </aside>
    </div>
  );
}
