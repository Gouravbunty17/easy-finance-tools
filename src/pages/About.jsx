import React from "react";
import SEO from "../components/SEO";

export default function About() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <SEO
        title="About EasyFinanceTools"
        description="Learn how EasyFinanceTools builds free Canadian finance calculators, reviews assumptions, and handles privacy, methodology, and disclosures."
        canonical="https://easyfinancetools.com/about"
      />

      <h1 className="text-4xl font-bold text-primary dark:text-accent mb-6">About EasyFinanceTools</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
        EasyFinanceTools is a free, privacy-focused financial calculator platform built specifically for Canadians. Our mission is simple: give everyone access to useful planning tools without hiding the assumptions that drive the answer.
      </p>

      <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white">Our Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Privacy First", desc: "We do not need your account or personal profile to show calculator results." },
          { title: "Useful Before Fancy", desc: "A good tool should help you make a decision, not just produce a number." },
          { title: "Made for Canada", desc: "We prioritize Canadian tax rules, account limits, and finance questions first." },
        ].map((item) => (
          <div key={item.title} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold mb-2 text-primary dark:text-accent">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white">What you can use today</h2>
      <ul className="list-disc ml-6 text-gray-600 dark:text-gray-300 space-y-2">
        <li>TFSA, RRSP, FHSA, and savings tools for registered-account planning</li>
        <li>Income tax and paycheque calculators for take-home pay estimates</li>
        <li>Mortgage, rent-vs-buy, and debt payoff tools for major household decisions</li>
        <li>Supporting guides that explain assumptions, tradeoffs, and common mistakes</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-12 text-primary dark:text-white">How we build trust</h2>
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>
          Important calculators should explain their assumptions, show meaningful update dates, and cite primary sources where practical. For tax, registered-account, and mortgage decisions, you should still verify key figures against CRA, your lender, or a qualified professional before acting.
        </p>
        <p>
          EasyFinanceTools is designed to be privacy-first. Calculator inputs stay in the browser unless a feature explicitly says otherwise. If a page contains ads, referrals, or partner placements, those relationships should be disclosed on that page in plain language.
        </p>
        <p>
          We review limits, thresholds, and dated content throughout the year. Pages should show freshness only when the underlying content has actually changed.
        </p>
      </div>
    </section>
  );
}
