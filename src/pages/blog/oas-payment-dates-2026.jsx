import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";

const payments = [
  { month: "January",   date: "January 29, 2026" },
  { month: "February",  date: "February 26, 2026" },
  { month: "March",     date: "March 27, 2026" },
  { month: "April",     date: "April 28, 2026" },
  { month: "May",       date: "May 27, 2026" },
  { month: "June",      date: "June 26, 2026" },
  { month: "July",      date: "July 29, 2026" },
  { month: "August",    date: "August 27, 2026" },
  { month: "September", date: "September 25, 2026" },
  { month: "October",   date: "October 29, 2026" },
  { month: "November",  date: "November 26, 2026" },
  { month: "December",  date: "December 22, 2026" },
];

export default function OASPaymentDates2026() {
  return (
    <div>
      <SEO
        title="OAS Payment Dates 2026: Full Schedule, Amounts & Increases"
        description="Complete OAS payment dates for 2026, current OAS amounts for ages 65–74 and 75+, the OAS clawback threshold, GIS amounts, and how to maximize your OAS."
        canonical="https://easyfinancetools.com/blog/oas-payment-dates-2026"
      />
      <BlogHero
        icon="🏛️"
        category="Retirement · OAS"
        title="OAS Payment Dates 2026: Full Schedule, Amounts & Increases"
        date="March 29, 2026"
        readTime="6 min read"
        gradient="from-purple-600 to-indigo-700"
      />
      <section className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">

        <h2>OAS Payment Dates 2026 — Full Schedule</h2>
        <p>
          OAS payments are issued on the same schedule as CPP — the third-to-last business day of each month. Direct deposit ensures same-day payment:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-primary text-white text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Month</th>
                <th className="px-4 py-3 font-semibold">OAS Payment Date 2026</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {payments.map((p, i) => (
                <tr key={p.month} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-3 font-medium">{p.month}</td>
                  <td className="px-4 py-3 text-primary dark:text-accent font-semibold">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>OAS Monthly Amounts for 2026</h2>
        <p>
          OAS is adjusted quarterly for inflation (Consumer Price Index). Amounts for January–March 2026:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Benefit</th>
                <th className="px-4 py-3 font-semibold">Maximum Monthly (Jan–Mar 2026)</th>
                <th className="px-4 py-3 font-semibold">Annual Maximum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["OAS pension (ages 65–74)", "$727.67", "$8,732"],
                ["OAS pension (ages 75+, 10% increase)", "$800.44", "$9,605"],
                ["Guaranteed Income Supplement — Single", "$1,086.88", "$13,043"],
                ["GIS — Spouse/partner on OAS", "$654.23", "$7,851"],
                ["GIS — Spouse/partner not on OAS", "$1,086.88", "$13,043"],
                ["Allowance (ages 60–64)", "$1,381.90", "$16,583"],
                ["Allowance for the Survivor", "$1,647.34", "$19,768"],
              ].map(([type, monthly, annual]) => (
                <tr key={type} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{type}</td>
                  <td className="px-4 py-3 text-green-700 dark:text-green-400 font-semibold">{monthly}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          <strong>Note:</strong> GIS is income-tested and is reduced if you have other income. OAS pension amounts update every quarter (January, April, July, October) based on CPI.
        </p>

        <h2>The 75+ OAS Increase: Are You Eligible?</h2>
        <p>
          Since July 2022, Canadians aged 75 and older automatically receive a 10% permanent increase to their OAS pension — no application required. If you turned 75 on or after July 1, 2022, the increase applies to you.
        </p>
        <ul>
          <li>Ages 65–74: <strong>$727.67/month</strong> (Jan–Mar 2026)</li>
          <li>Ages 75+: <strong>$800.44/month</strong> — the 10% boost is automatic</li>
        </ul>

        <h2>OAS Clawback (Recovery Tax) 2026</h2>
        <p>
          If your net income exceeds the OAS clawback threshold, Service Canada reduces your OAS pension. For 2026:
        </p>

        <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 my-6">
          <p className="font-bold text-amber-800 dark:text-amber-300 mb-2">2026 OAS Clawback Thresholds</p>
          <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc ml-4">
            <li><strong>Clawback begins:</strong> Net income above ~$93,454 (2026 estimate)</li>
            <li><strong>Full OAS eliminated:</strong> Net income above ~$151,668 (ages 65–74)</li>
            <li><strong>Recovery rate:</strong> 15 cents clawed back per dollar of income above threshold</li>
            <li><strong>Reporting:</strong> Filed with your T1 tax return; repaid via monthly withholding or lump sum</li>
          </ul>
        </div>

        <h3>Strategies to Reduce the OAS Clawback</h3>
        <ul>
          <li><strong>Withdraw RRSP/RRIF before age 65</strong> — draw down your registered accounts before OAS starts to reduce future taxable income</li>
          <li><strong>Income split with a spouse</strong> — pension income splitting can shift income below the threshold</li>
          <li><strong>Delay OAS to age 70</strong> — you receive a 36% increase (0.6%/month × 60 months), but with higher income each month</li>
          <li><strong>Use TFSA income</strong> — TFSA withdrawals don't count as income for clawback purposes</li>
        </ul>

        <h2>Should You Delay OAS to Age 70?</h2>
        <p>
          You can defer OAS up to age 70 for a 0.6% increase per month of deferral. If you defer all 5 years (60 months), you receive 36% more per month:
        </p>
        <ul>
          <li>At 65: $727.67/month</li>
          <li>At 70: $989.63/month (36% more)</li>
          <li>Breakeven age: approximately 74–75</li>
        </ul>
        <p>
          Deferring makes sense if you're healthy, still working, and don't need the income immediately. It's especially powerful combined with RRSP drawdown in your early 60s to reduce future OAS clawback risk.
        </p>

        <h2>GIS: The Hidden Benefit</h2>
        <p>
          The Guaranteed Income Supplement (GIS) is the most underutilized senior benefit in Canada. It's paid on top of OAS to low-income seniors with no application barrier beyond your annual tax return. If your income is under ~$22,000 (single) or ~$29,000 (couple), you likely qualify.
        </p>
        <p>
          <strong>Critical:</strong> You must file your income tax return every year to continue receiving GIS. Many seniors lose GIS benefits by not filing their taxes.
        </p>

        <h2>How to Apply for OAS</h2>
        <p>Service Canada automatically enrolls most Canadians for OAS — they'll send you a letter 3 months before your 65th birthday. If you don't receive a letter:</p>
        <ol>
          <li>Apply online at <strong>canada.ca/en/services/benefits/publicpensions</strong></li>
          <li>Apply by mail using Form ISP-3000</li>
          <li>Call Service Canada: 1-800-277-9914</li>
        </ol>
        <p>Apply at least 6 months before you want to start receiving OAS.</p>

        <h2>Estimate Your Total Retirement Income</h2>
        <p>Combine your OAS with CPP to see your total government retirement income:</p>
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
            <strong>Disclaimer:</strong> OAS amounts are adjusted quarterly. Always verify current payment dates and amounts at canada.ca. This article is for informational purposes only and does not constitute financial advice.
          </p>
        </div>
      </article>

      <div className="mt-10 pt-8 border-t dark:border-gray-700">
        <h3 className="font-bold text-lg mb-4 text-primary dark:text-accent">Related Articles</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/blog/cpp-payment-dates-2026" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <span className="text-sm text-gray-500">Retirement</span>
            <p className="font-semibold text-primary dark:text-accent mt-1">CPP Payment Dates 2026</p>
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
