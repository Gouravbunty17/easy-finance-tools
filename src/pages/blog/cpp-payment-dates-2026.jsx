import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";

const payments = [
  { month: "January",   date: "January 29, 2026",   amount: "Varies" },
  { month: "February",  date: "February 26, 2026",  amount: "Varies" },
  { month: "March",     date: "March 27, 2026",     amount: "Varies" },
  { month: "April",     date: "April 28, 2026",     amount: "Varies" },
  { month: "May",       date: "May 27, 2026",       amount: "Varies" },
  { month: "June",      date: "June 26, 2026",      amount: "Varies" },
  { month: "July",      date: "July 29, 2026",      amount: "Varies" },
  { month: "August",    date: "August 27, 2026",    amount: "Varies" },
  { month: "September", date: "September 25, 2026", amount: "Varies" },
  { month: "October",   date: "October 29, 2026",   amount: "Varies" },
  { month: "November",  date: "November 26, 2026",  amount: "Varies" },
  { month: "December",  date: "December 22, 2026",  amount: "Varies" },
];

export default function CPPPaymentDates2026() {
  return (
    <div>
      <SEO
        title="CPP Payment Dates 2026: Complete Schedule + Maximum Amounts"
        description="All 12 CPP payment dates for 2026, maximum monthly amounts, how to sign up for direct deposit, and when to start collecting CPP at 60, 65, or 70."
        canonical="https://easyfinancetools.com/blog/cpp-payment-dates-2026"
      />
      <BlogHero
        icon="🇨🇦"
        category="Retirement · CPP"
        title="CPP Payment Dates 2026: Complete Schedule + Maximum Amounts"
        date="March 29, 2026"
        readTime="7 min read"
        gradient="from-purple-500 to-purple-700"
      />
      <section className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">

        <h2>CPP Payment Dates 2026 — Full Schedule</h2>
        <p>
          CPP payments are deposited on the third-to-last business day of each month. Service Canada processes all payments automatically — if you have direct deposit set up, funds arrive on these exact dates:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-primary text-white text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Month</th>
                <th className="px-4 py-3 font-semibold">Payment Date</th>
                <th className="px-4 py-3 font-semibold">Days Until Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {payments.map((p, i) => (
                <tr key={p.month} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-3 font-medium">{p.month}</td>
                  <td className="px-4 py-3 text-primary dark:text-accent font-semibold">{p.date}</td>
                  <td className="px-4 py-3 text-gray-500">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 my-6">
          <p className="font-bold text-blue-800 dark:text-blue-300 mb-2">Pro Tip: Set Up Direct Deposit</p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Payments arrive same-day with direct deposit. Without it, cheques may take 5–10 business days to arrive. Set up direct deposit through <strong>My Service Canada Account</strong> at canada.ca.
          </p>
        </div>

        <h2>CPP Maximum Monthly Amounts for 2026</h2>
        <p>Your actual CPP payment depends on how much you contributed during your working years and when you start collecting. Here are the 2026 maximum amounts:</p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">CPP Benefit Type</th>
                <th className="px-4 py-3 font-semibold">Maximum Monthly (2026)</th>
                <th className="px-4 py-3 font-semibold">Average Monthly (2026)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["Retirement pension (age 65)", "$1,433.00", "~$815"],
                ["Retirement pension (age 60, early)", "$1,002.10", "~$570"],
                ["Retirement pension (age 70, delayed)", "$2,034.86", "~$1,156"],
                ["Post-retirement benefit", "$40.25/month max", "Varies"],
                ["Disability benefit", "$1,673.24", "~$1,100"],
                ["Survivor's pension (under 65)", "$739.31", "~$500"],
                ["Survivor's pension (65+)", "$859.80", "~$300"],
                ["Death benefit (one-time)", "$2,500", "$2,500"],
              ].map(([type, max, avg]) => (
                <tr key={type} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{type}</td>
                  <td className="px-4 py-3 text-green-700 dark:text-green-400 font-semibold">{max}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          <strong>Important:</strong> Very few Canadians receive the maximum CPP — you'd need to have earned the Year's Maximum Pensionable Earnings (YMPE) every year from age 18 to 65 and contributed the maximum each year. The average Canadian receives about 57% of the maximum.
        </p>

        <h2>Should You Take CPP at 60, 65, or 70?</h2>
        <p>This is one of the most important retirement decisions you'll make. Here's the math:</p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Start Age</th>
                <th className="px-4 py-3 font-semibold">Adjustment</th>
                <th className="px-4 py-3 font-semibold">Monthly (on $815 avg)</th>
                <th className="px-4 py-3 font-semibold">Break-Even Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["60 (early)", "−36% (0.6% × 60 months)", "$522/month", "74.4"],
                ["65 (standard)", "No adjustment", "$815/month", "—"],
                ["70 (delayed)", "+42% (0.7% × 60 months)", "$1,157/month", "~73.9"],
              ].map(([age, adj, monthly, breakeven]) => (
                <tr key={age} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium">{age}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{adj}</td>
                  <td className="px-4 py-3 font-semibold text-primary dark:text-accent">{monthly}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{breakeven}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>The General Rule of Thumb:</h3>
        <ul>
          <li><strong>Take CPP early (age 60–64)</strong> if you have a serious health condition, you need the income now, or you have other savings to supplement</li>
          <li><strong>Take CPP at 65</strong> if you're in average health and unsure — the breakeven point is around 75</li>
          <li><strong>Delay to 70</strong> if you're in good health, still working, or want to maximize lifetime income — the 42% boost is significant</li>
        </ul>

        <h2>CPP Enhancement: The Second Pension</h2>
        <p>
          Since 2019, the federal government has been phasing in CPP Enhancement — a second, additional pension on top of the base CPP. If you've worked since 2019, you're building two CPP pensions:
        </p>
        <ul>
          <li><strong>Base CPP</strong> — replaces 25% of average career earnings (up to YMPE)</li>
          <li><strong>Enhanced CPP</strong> — adds up to 8.33% more replacement of earnings above the YMPE threshold</li>
        </ul>
        <p>
          By the time workers who started contributing in 2019 retire, CPP will replace up to 33.33% of average career earnings — a significant increase from the old 25%.
        </p>

        <h2>How to Check Your Estimated CPP Amount</h2>
        <p>You can check your projected CPP retirement pension in minutes:</p>
        <ol>
          <li>Sign in to <strong>My Service Canada Account</strong> at canada.ca</li>
          <li>Click on <strong>"Canada Pension Plan"</strong> under Benefits</li>
          <li>Click <strong>"View Statement of Contributions"</strong></li>
          <li>Your estimated benefit at age 60, 65, and 70 is shown</li>
        </ol>

        <h2>CPP and Taxes</h2>
        <p>
          CPP payments are <strong>taxable income</strong> — they are added to your other income and taxed at your marginal rate. However, unlike RRSP withdrawals, there is no withholding tax automatically deducted. You can request voluntary tax withholding through Service Canada to avoid a tax bill in April.
        </p>

        <h2>Also Collecting OAS?</h2>
        <p>
          Most Canadians collecting CPP also receive Old Age Security (OAS). OAS has different payment dates and its own set of rules. See our{" "}
          <Link to="/blog/oas-payment-dates-2026" className="text-primary underline">OAS Payment Dates 2026</Link> guide for the full schedule.
        </p>

        <h2>Estimate Your Retirement Income</h2>
        <p>Use our free CPP & OAS Estimator to see your projected government retirement income:</p>
        <div className="not-prose my-4">
          <Link
            to="/tools/cpp-oas-estimator"
            className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary transition"
          >
            Use the CPP & OAS Estimator →
          </Link>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mt-8 not-prose">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Disclaimer:</strong> CPP amounts and dates are subject to change by Service Canada. Always verify current payment dates at canada.ca. This article is for informational purposes only and does not constitute financial advice.
          </p>
        </div>
      </article>

      <div className="mt-10 pt-8 border-t dark:border-gray-700">
        <h3 className="font-bold text-lg mb-4 text-primary dark:text-accent">Related Articles</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/blog/oas-payment-dates-2026" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <span className="text-sm text-gray-500">Retirement</span>
            <p className="font-semibold text-primary dark:text-accent mt-1">OAS Payment Dates 2026</p>
          </Link>
          <Link to="/blog/canadian-tax-brackets-2026" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <span className="text-sm text-gray-500">Tax</span>
            <p className="font-semibold text-primary dark:text-accent mt-1">Canadian Tax Brackets 2026</p>
          </Link>
        </div>
      </div>

      <Link to="/blog" className="inline-block mt-8 text-primary dark:text-accent font-semibold hover:underline">
        ← Back to Blog
      </Link>
      </section>
    </div>
  );
}
