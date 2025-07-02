import React from "react";
import { Link } from "react-router-dom";

export default function ToolsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-primary dark:text-accent">
        Our Tools
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        Explore our suite of calculators and trackers to manage your personal finances more effectively.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Dividend Calculator */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2 text-primary dark:text-accent">
            Dividend Calculator
          </h2>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
            Calculate your dividend income with DRIP, yield, and compound growth.
          </p>
          <Link
            to="/tools/dividend-calculator"
            className="inline-block px-4 py-2 rounded bg-primary text-white hover:bg-secondary"
          >
            Open
          </Link>
        </div>

        {/* Budget Tracker */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2 text-primary dark:text-accent">
            Budget Tracker
          </h2>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
            Plan and track your monthly budgets to meet your financial goals.
          </p>
          <Link
            to="/tools/budget-tracker"
            className="inline-block px-4 py-2 rounded bg-primary text-white hover:bg-secondary"
          >
            Open
          </Link>
        </div>

        {/* Investment Tracker */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2 text-primary dark:text-accent">
            Investment Tracker
          </h2>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
            Track stocks, ETFs, and dividends in one place with powerful charts.
          </p>
          <Link
            to="/tools/investment-tracker"
            className="inline-block px-4 py-2 rounded bg-primary text-white hover:bg-secondary"
          >
            Open
          </Link>
        </div>
      </div>
    </section>
  );
}
