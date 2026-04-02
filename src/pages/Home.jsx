import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import CountUp from "../components/CountUp";
import FinancialTip from "../components/FinancialTip";
import ReferralSection from "../components/ReferralSection";

const tools = [
  { title: "Income Tax Calculator", desc: "Calculate federal + provincial tax, CPP, EI, and take-home pay for 2026.", link: "/tools/income-tax-calculator", badge: "Most Popular" },
  { title: "Pay Stub Calculator", desc: "See your estimated net pay per paycheque from salary or hourly income.", link: "/tools/net-pay-calculator", badge: "New" },
  { title: "TFSA Calculator", desc: "Model tax-free growth and estimate contribution-room context.", link: "/tools/tfsa-calculator", badge: null },
  { title: "GIC Calculator", desc: "Project maturity value and compare short-term guaranteed savings options.", link: "/tools/gic-calculator", badge: "New" },
  { title: "Debt Payoff Calculator", desc: "Compare avalanche vs snowball and see your path to debt-free.", link: "/tools/debt-payoff", badge: "New" },
  { title: "Savings Goal Calculator", desc: "Set a timeline and get the monthly amount needed to hit your target.", link: "/tools/savings-goal", badge: "New" },
  { title: "Mortgage Calculator", desc: "Estimate real Canadian mortgage payments, CMHC insurance, and closing costs.", link: "/tools/mortgage-calculator", badge: null },
  { title: "FIRE Calculator", desc: "Estimate your financial independence number and target retirement date.", link: "/tools/fire-calculator", badge: null },
  { title: "FHSA Calculator", desc: "Plan deductible contributions and tax-free home-buying withdrawals.", link: "/tools/fhsa-calculator", badge: null },
];

const recentPosts = [
  { slug: "cpp-payment-dates-2026", title: "CPP Payment Dates 2026", category: "Retirement" },
  { slug: "canadian-tax-brackets-2026", title: "Canadian Tax Brackets 2026", category: "Tax" },
  { slug: "rrsp-deadline-2026", title: "RRSP Deadline 2026", category: "RRSP" },
  { slug: "oas-payment-dates-2026", title: "OAS Payment Dates 2026", category: "Retirement" },
  { slug: "best-gic-rates-canada-2026", title: "Best GIC Rates Canada", category: "Savings" },
  { slug: "tfsa-vs-rrsp-2026", title: "TFSA vs RRSP: Which Is Better?", category: "TFSA and RRSP" },
];

const stats = [
  { to: 16, suffix: "+", label: "Free Tools" },
  { to: 100, suffix: "%", label: "Free Forever" },
  { to: 0, suffix: "", label: "Sign-ups Required" },
  { to: 2026, suffix: "", from: 2020, label: "Rates Updated" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Free Canadian Finance Calculators"
        description="Free Canadian finance calculators for TFSA, RRSP, income tax, mortgage, debt payoff, savings goals, and more. Privacy-first tools with methodology and 2026 updates."
        canonical="https://easyfinancetools.com/"
      />

      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-white/20 text-white text-sm px-4 py-1 rounded-full mb-6 inline-block">
            Built for Canadians
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Free Canadian Finance Calculators
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            TFSA, RRSP, income tax, mortgage, debt payoff, and savings tools for real Canadian decisions. No sign-up required. Clear assumptions. Fast, browser-based results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tools" className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition text-lg">
              Explore tools
            </Link>
            <Link to="/about" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition text-lg">
              Methodology and trust
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b bg-slate-50 dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid gap-4 px-4 py-6 md:grid-cols-4">
          {[
            { title: "No sign-up", body: "Open a calculator and get results immediately." },
            { title: "Privacy-first", body: "Inputs stay in your browser unless a feature says otherwise." },
            { title: "Methodology shown", body: "Important calculators explain assumptions and sources." },
            { title: "Updated for 2026", body: "Rates, limits, and dated guides are reviewed throughout the year." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <p className="font-semibold text-primary dark:text-accent">{item.title}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item) => (
            <div key={item.label}>
              <div className="text-3xl font-bold text-primary dark:text-accent">
                <CountUp to={item.to} from={item.from ?? 0} suffix={item.suffix} />
              </div>
              <div className="text-sm text-gray-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pt-10">
        <FinancialTip />
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4 text-primary dark:text-accent">
          Our Free Calculators
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Start with the outcome you need, then move into related guides and next-step tools.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              to={tool.link}
              className="group bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:border-secondary hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-lg font-semibold text-secondary">{tool.title.split(" ")[0]}</span>
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
                Open calculator
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/tools"
            className="inline-block border-2 border-primary text-primary font-semibold px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition"
          >
            View all tools
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Tax and paycheques", body: "Income tax and pay stub tools answer one of the highest-intent questions on the site.", href: "/tools/income-tax-calculator" },
            { title: "Savings and registered accounts", body: "Use TFSA, RRSP, and FHSA tools together instead of in isolation.", href: "/tools/tfsa-calculator" },
            { title: "Borrowing and housing", body: "Mortgage, rent-vs-buy, and debt payoff tools work best when paired with scenario planning.", href: "/tools/mortgage-calculator" },
          ].map((cluster) => (
            <Link key={cluster.title} to={cluster.href} className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-secondary hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-lg font-bold text-primary dark:text-accent">{cluster.title}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{cluster.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4">
        <ReferralSection />
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary dark:text-accent">Latest Articles</h2>
          <Link to="/blog" className="text-secondary font-semibold hover:underline text-sm">View all articles</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentPosts.map((post) => (
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
              <span className="text-xs text-secondary font-semibold">Read article</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-primary dark:text-accent">Why EasyFinanceTools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "Private", title: "100% Private", desc: "We never store your financial data. Everything runs in your browser unless a feature explicitly says otherwise." },
              { icon: "Clear", title: "Clear methodology", desc: "Key calculators should show assumptions, update dates, and source links so users can sanity-check the output." },
              { icon: "Canada", title: "Made for Canada", desc: "Built around Canadian tax brackets, registered-account limits, and local planning questions." },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="text-lg font-semibold mb-4 text-secondary">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Finances?</h2>
        <p className="text-blue-100 mb-8">
          Start with the TFSA calculator, then compare it against RRSP and tax tools once you have a baseline.
        </p>
        <Link
          to="/tools/tfsa-calculator"
          className="bg-accent text-primary font-bold px-10 py-4 rounded-xl hover:bg-yellow-400 transition text-lg inline-block"
        >
          Open TFSA calculator
        </Link>
      </section>
    </div>
  );
}
