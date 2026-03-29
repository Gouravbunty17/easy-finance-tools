import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import CountUp from "../components/CountUp";
import FinancialTip from "../components/FinancialTip";
import ReferralSection from "../components/ReferralSection";

const tools = [
  { icon: "🧾", title: "Income Tax Calculator", desc: "Calculate your exact take-home pay, federal + provincial tax, CPP, and EI for 2026.", link: "/tools/income-tax-calculator", badge: "New!" },
  { icon: "💰", title: "TFSA Calculator", desc: "See how much your tax-free savings can grow over time.", link: "/tools/tfsa-calculator", badge: "Most Popular" },
  { icon: "📈", title: "RRSP Calculator", desc: "Calculate your tax refund and retirement savings growth.", link: "/tools/rrsp-calculator", badge: "2026 Updated" },
  { icon: "🏠", title: "FHSA Calculator", desc: "First Home Savings Account — deductible contributions, tax-free withdrawals.", link: "/tools/fhsa-calculator", badge: "New!" },
  { icon: "🏡", title: "Mortgage Calculator", desc: "Real Canadian mortgage payments with CMHC insurance and land transfer tax.", link: "/tools/mortgage-calculator", badge: "New!" },
  { icon: "📊", title: "Capital Gains Tax", desc: "Calculate capital gains tax on stocks, crypto, and real estate.", link: "/tools/capital-gains-tax", badge: "New!" },
  { icon: "🇨🇦", title: "CPP & OAS Estimator", desc: "Estimate your government retirement income and best age to collect.", link: "/tools/cpp-oas-estimator", badge: "New!" },
];

const recentPosts = [
  { slug: "cpp-payment-dates-2026",       title: "CPP Payment Dates 2026", category: "Retirement" },
  { slug: "canadian-tax-brackets-2026",   title: "Canadian Tax Brackets 2026", category: "Tax" },
  { slug: "rrsp-deadline-2026",           title: "RRSP Deadline 2026", category: "RRSP" },
  { slug: "oas-payment-dates-2026",       title: "OAS Payment Dates 2026", category: "Retirement" },
  { slug: "best-gic-rates-canada-2026",   title: "Best GIC Rates Canada (March 2026)", category: "Savings" },
  { slug: "tfsa-vs-rrsp-2026",            title: "TFSA vs RRSP: Which Is Better?", category: "TFSA & RRSP" },
];

const stats = [
  { to: 10, suffix: "+", label: "Free Tools" },
  { to: 100, suffix: "%", label: "Free Forever" },
  { to: 0, suffix: "", label: "Sign-ups Required" },
  { to: 2026, suffix: "", from: 2020, label: "Rates Updated" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SEO />
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-white/20 text-white text-sm px-4 py-1 rounded-full mb-6 inline-block">
            🇨🇦 Built for Canadians
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Free Financial Tools<br />Anyone Can Use
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            TFSA, RRSP, Dividend & Budget calculators — no signup, no ads tracking you, no complicated jargon. Just simple, accurate results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tools" className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition text-lg">
              Try Free Tools →
            </Link>
            <Link to="/about" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition text-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-primary dark:text-accent">
                <CountUp to={s.to} from={s.from ?? 0} suffix={s.suffix} />
              </div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Tip of the Day */}
      <section className="max-w-5xl mx-auto px-4 pt-10">
        <FinancialTip />
      </section>

      {/* Tools Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4 text-primary dark:text-accent">
          Our Free Calculators
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Click any tool below — no signup needed, results in seconds.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <Link key={tool.title} to={tool.link}
              className="group bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:border-secondary hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{tool.icon}</span>
                {tool.badge && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    {tool.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary dark:text-white group-hover:text-secondary transition">
                {tool.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{tool.desc}</p>
              <div className="mt-4 text-secondary font-semibold text-sm">
                Use Calculator →
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/tools"
            className="inline-block border-2 border-primary text-primary font-semibold px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition">
            View All Tools →
          </Link>
        </div>
      </section>

      {/* Wealthsimple Referral */}
      <section className="max-w-5xl mx-auto px-4">
        <ReferralSection />
      </section>

      {/* Recent Blog Posts */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary dark:text-accent">Latest Articles</h2>
          <Link to="/blog" className="text-secondary font-semibold hover:underline text-sm">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentPosts.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:shadow-lg hover:border-secondary transition-all group"
            >
              <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                {post.category}
              </span>
              <h3 className="font-bold text-gray-800 dark:text-white mt-3 mb-2 group-hover:text-secondary transition leading-snug">
                {post.title}
              </h3>
              <span className="text-xs text-secondary font-semibold">Read article →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-primary dark:text-accent">Why EasyFinanceTools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🔒", title: "100% Private", desc: "We never store your financial data. Everything runs in your browser." },
              { icon: "🆓", title: "Always Free", desc: "No hidden fees, no premium tiers. All tools are free, forever." },
              { icon: "🇨🇦", title: "Made for Canada", desc: "Accurate 2026 TFSA limits, RRSP rules, and Canadian tax brackets." },
            ].map(item => (
              <div key={item.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Finances?</h2>
        <p className="text-blue-100 mb-8">Start with our TFSA calculator — it takes less than 60 seconds.</p>
        <Link to="/tools/tfsa-calculator"
          className="bg-accent text-primary font-bold px-10 py-4 rounded-xl hover:bg-yellow-400 transition text-lg inline-block">
          Get Started Free →
        </Link>
      </section>
    </div>
  );
}
