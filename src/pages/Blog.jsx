import { useState } from "react";
import { useEffect } from "react";

const posts = [
  {
    slug: "rrsp-vs-tfsa",
    title: "RRSP vs TFSA – Which Should You Choose?",
    date: "2024-03-20",
    category: "Retirement",
    excerpt: "Compare two of Canada’s most powerful investing accounts and learn which is better for your goals.",
  },
  {
    slug: "weekly-dividend-etfs",
    title: "Top 5 Weekly Dividend ETFs for Canadians",
    date: "2024-04-12",
    category: "Dividends",
    excerpt: "Want cash flow every week? These ETFs could help you maximize passive income.",
  },
  {
    slug: "tax-tips-2024",
    title: "7 Tax Tips Every Canadian Investor Should Know",
    date: "2024-05-03",
    category: "Tax Planning",
    excerpt: "Save more this year with these simple, overlooked tax-saving strategies.",
  },
  // Add more posts here!
];

// Helper to (re)load AdSense on route/page change
const useAdSense = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV !== "development") {
        window.adsbygoogle.push({});
      }
    } catch (e) {}
  });
};

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

export default function Blog() {
  const [search, setSearch] = useState("");

  // Filter posts by search
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
      {/* Blog List */}
      <div className="md:col-span-3">
        <h1 className="text-4xl font-bold mb-6 text-emerald-700 dark:text-emerald-300">Easy Finance Tools Blog</h1>
        <input
          type="text"
          placeholder="Search posts…"
          className="w-full p-3 rounded-lg border mb-8 dark:bg-gray-900 dark:border-gray-600"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Banner Ad Slot after search box */}
        <div className="mb-8 flex justify-center">
          <AdsenseSlot slot="5385703475" style={{ display: "block", minHeight: 90, width: "100%" }} />
        </div>

        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400">No blog posts found.</div>
          ) : (
            filteredPosts.map((post, idx) => (
              <div key={post.slug}>
                {/* Blog Card */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6"
                >
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <span>{post.date}</span>
                    <span className="mx-2">|</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded">{post.category}</span>
                  </div>
                  <h2 className="text-2xl font-semibold mb-1 text-emerald-800 dark:text-emerald-100">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-3 text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-500"
                  >
                    Read More →
                  </a>
                </div>
                {/* In-content Ad Slot after every 2 posts */}
                {((idx + 1) % 2 === 0) && (
                  <div className="my-8 flex justify-center">
                    <AdsenseSlot slot="8347374312" style={{ display: "block", minHeight: 90, width: "100%" }} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:block">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="font-bold text-lg mb-2 text-emerald-700 dark:text-emerald-200">Subscribe</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Get the latest posts & investing tips to your inbox.</p>
          <input type="email" placeholder="Your email" className="w-full p-2 rounded border mb-2 dark:bg-gray-900 dark:border-gray-600" />
          <button className="w-full bg-emerald-600 text-white rounded p-2 font-bold hover:bg-emerald-700 transition">Subscribe</button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="font-bold text-lg mb-3 text-emerald-700 dark:text-emerald-200">Popular Topics</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/blog?tag=rrsp" className="hover:underline">RRSP</a></li>
            <li><a href="/blog?tag=tfsa" className="hover:underline">TFSA</a></li>
            <li><a href="/blog?tag=dividends" className="hover:underline">Dividends</a></li>
            <li><a href="/blog?tag=tax" className="hover:underline">Tax Planning</a></li>
          </ul>
        </div>
        {/* Sidebar Ad Slot */}
        <div className="mt-8 flex justify-center">
          <AdsenseSlot slot="2290193432" style={{ display: "block", minHeight: 250, width: "100%" }} />
        </div>
      </aside>
    </div>
  );
}
