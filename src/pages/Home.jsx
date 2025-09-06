import React from "react";

export default function Home() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-primary dark:text-accent">
        Smart Financial Tools for a Brighter Future
      </h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        EasyFinanceTools empowers you to take control of your finances through free,
        easy-to-use calculators, planners, and investment tracking resources. Whether
        you’re saving for retirement, building a budget, or tracking dividends,
        we help you make confident financial decisions without the stress.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-3">What We Offer</h2>
      <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300">
        <li>Dividend Calculator — plan your passive income and reinvestment growth</li>
        <li>Budget Tracker — manage spending and set financial goals</li>
        <li>Investment Tracker — monitor stocks, ETFs, and dividends in one place</li>
        <li>TFSA / RRSP tools — understand your Canadian investment accounts</li>
        <li>Educational blog — learn the latest personal finance and investing tips</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-3">Why Choose Us?</h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Our tools are always free, require no registration, and never collect your
        personal financial details. We believe in transparency, independence, and
        empowering you with knowledge, not ads or commissions.
      </p>
      <a
        href="/tools"
        className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-secondary transition"
      >
        Explore Our Tools
      </a>
    </section>
  );
}
