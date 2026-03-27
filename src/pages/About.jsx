import React from "react";
export default function About() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary dark:text-accent mb-6">About EasyFinanceTools</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
        EasyFinanceTools is a free, privacy-focused financial calculator platform built specifically for Canadians. Our mission is simple: give everyone access to the financial tools that used to only be available through expensive advisors or complicated software.
      </p>
      <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white">Our Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: "🔒", title: "Privacy First", desc: "We never store your financial data. All calculations happen in your browser." },
          { icon: "🆓", title: "Always Free", desc: "Every tool on this site is 100% free. No premium plans, no hidden fees." },
          { icon: "🇨🇦", title: "Made for Canada", desc: "Built with Canadian tax rules, TFSA/RRSP limits, and 2026 rates in mind." },
        ].map(v => (
          <div key={v.title} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">{v.icon}</div>
            <h3 className="font-bold mb-2">{v.title}</h3>
            <p className="text-sm text-gray-500">{v.desc}</p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white">Our Tools</h2>
      <ul className="list-disc ml-6 text-gray-600 dark:text-gray-300 space-y-2">
        <li>TFSA Calculator — with 2026 contribution limits</li>
        <li>RRSP Calculator — with real Canadian tax brackets</li>
        <li>Dividend Calculator — with DRIP reinvestment</li>
        <li>Budget Tracker — income vs expense planning</li>
        <li>More tools coming soon!</li>
      </ul>
    </section>
  );
}
