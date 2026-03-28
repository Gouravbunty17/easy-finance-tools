import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

export default function HowToUseFHSA() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title="How to Use the FHSA in Canada (2026) — First Home Savings Account Guide"
        description="Complete guide to the FHSA in 2026. Eligibility, contribution limits, tax deductions, withdrawals, and how to combine it with the RRSP Home Buyers' Plan."
        canonical="https://easyfinancetools.com/blog/how-to-use-fhsa-canada"
      />

      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <CalendarIcon className="w-4 h-4" />
          <time>March 28, 2026</time>
          <span>·</span>
          <TagIcon className="w-4 h-4" />
          <span>FHSA · First Home · Savings</span>
          <span>·</span>
          <span>8 min read</span>
        </div>
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-4 leading-tight">
          How to Use the FHSA in Canada (2026 Guide)
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          The First Home Savings Account (FHSA) is the most powerful new savings tool introduced in Canada in decades. It combines the best of the RRSP (tax-deductible contributions) and the TFSA (tax-free withdrawals) — specifically for first-time home buyers. Here's everything you need to know.
        </p>
      </div>

      <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">

        <h2>What Is the FHSA?</h2>
        <p>
          The First Home Savings Account (FHSA) was launched in April 2023. It's a registered account that lets eligible Canadians save for their first home with a double tax advantage:
        </p>
        <ul>
          <li><strong>Contributions are tax-deductible</strong> — like an RRSP, they reduce your taxable income</li>
          <li><strong>Qualifying withdrawals are tax-free</strong> — like a TFSA, you pay zero tax when you use the money to buy your first home</li>
        </ul>
        <p>
          No other account in Canada offers both of these benefits simultaneously. It's genuinely one of the best tools ever created for first-time buyers.
        </p>

        <h2>FHSA Quick Facts (2026)</h2>
        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold text-blue-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["Annual contribution limit", "$8,000"],
                ["Lifetime contribution limit", "$40,000"],
                ["Carry-forward room", "Up to $8,000 unused from prior year"],
                ["Tax deduction", "Yes — same as RRSP"],
                ["Qualifying withdrawal", "100% tax-free"],
                ["Account lifespan", "Up to 15 years or until you buy a home"],
                ["What happens if unused", "Transfer to RRSP/RRIF tax-free"],
                ["Eligibility age", "18–71"],
              ].map(([f, d]) => (
                <tr key={f} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{f}</td>
                  <td className="px-4 py-3 text-blue-700 dark:text-blue-400 font-semibold">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Who Is Eligible for an FHSA?</h2>
        <p>To open and contribute to an FHSA, you must:</p>
        <ol>
          <li>Be a <strong>Canadian resident</strong></li>
          <li>Be between <strong>18 and 71 years old</strong></li>
          <li>Be a <strong>first-time home buyer</strong> — meaning you (and your spouse/common-law partner) have not owned a qualifying home in which you lived at any time in the current calendar year or the preceding four calendar years</li>
        </ol>
        <p>
          <strong>Important:</strong> If you previously owned a home but haven't for the past 4 years, you may qualify again. This is the same definition used for the RRSP Home Buyers' Plan.
        </p>

        <h2>How Contributions Work</h2>
        <p>
          You can contribute up to <strong>$8,000 per year</strong> to your FHSA, with a <strong>$40,000 lifetime maximum</strong>. There's a carry-forward rule: if you contribute less than $8,000 in a year, the unused room (up to $8,000) carries forward to the next year.
        </p>
        <h3>Carry-Forward Example</h3>
        <p>
          You open your FHSA in 2025 and contribute $3,000. In 2026, you can contribute up to $13,000 ($8,000 for 2026 + $5,000 carry-forward from 2025).
        </p>
        <p>
          <strong>Key rule:</strong> You must open the FHSA first before carry-forward room accumulates. Opening it today — even with a $1 contribution — starts the clock.
        </p>

        <h2>How Tax-Free Withdrawals Work</h2>
        <p>
          To make a <strong>qualifying (tax-free) withdrawal</strong>, you must:
        </p>
        <ol>
          <li>Be a first-time home buyer at the time of withdrawal</li>
          <li>Have a written agreement to buy or build a qualifying home before October 1 of the year following the withdrawal</li>
          <li>Intend to occupy the home as your principal residence within one year</li>
          <li>Not have made a qualifying FHSA withdrawal in the past</li>
        </ol>
        <p>
          You can make multiple withdrawals across multiple years for the same home purchase as long as all conditions are met each time.
        </p>

        <h2>What If You Don't Buy a Home?</h2>
        <p>
          If you don't use the FHSA to buy a home within 15 years of opening it (or by age 71), you have two options:
        </p>
        <ul>
          <li><strong>Transfer to your RRSP/RRIF</strong> — tax-free, without affecting your RRSP contribution room. This is the best option for most people.</li>
          <li><strong>Withdraw as income</strong> — you'll pay tax on the full amount as regular income</li>
        </ul>
        <p>
          The transfer-to-RRSP option means there's essentially no downside to opening an FHSA early — worst case, it becomes extra RRSP room.
        </p>

        <h2>FHSA + RRSP Home Buyers' Plan: Stack Them Both</h2>
        <p>
          Here's the most powerful combination for first-time buyers: you can use <strong>both</strong> the FHSA and the RRSP Home Buyers' Plan (HBP) for the same home purchase.
        </p>
        <ul>
          <li>FHSA: up to $40,000 withdrawn tax-free (no repayment required)</li>
          <li>RRSP HBP: up to $35,000 withdrawn tax-free (must repay over 15 years)</li>
          <li><strong>Combined: up to $75,000 per person, $150,000 per couple</strong></li>
        </ul>
        <p>
          A couple who has both maxed their FHSA and uses the HBP could put $150,000 toward a down payment using pre-tax savings — an enormous advantage.
        </p>

        <h2>FHSA vs RRSP HBP vs TFSA for a Home Down Payment</h2>
        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Account</th>
                <th className="px-4 py-3 font-semibold">Tax Deduction</th>
                <th className="px-4 py-3 font-semibold">Tax-Free Withdrawal</th>
                <th className="px-4 py-3 font-semibold">Repayment Required</th>
                <th className="px-4 py-3 font-semibold">Max Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["FHSA", "✅ Yes", "✅ Yes", "❌ No", "$40,000"],
                ["RRSP (HBP)", "✅ Yes", "✅ Yes", "✅ Yes (15 yrs)", "$35,000"],
                ["TFSA", "❌ No", "✅ Yes", "❌ No", "Your balance"],
              ].map(([acc, td, tfw, rep, max]) => (
                <tr key={acc} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-bold">{acc}</td>
                  <td className="px-4 py-3">{td}</td>
                  <td className="px-4 py-3">{tfw}</td>
                  <td className="px-4 py-3">{rep}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How to Open an FHSA</h2>
        <p>Most major Canadian banks and brokerages offer FHSAs including:</p>
        <ul>
          <li>Wealthsimple (commission-free investing)</li>
          <li>RBC, TD, BMO, Scotiabank, CIBC, National Bank</li>
          <li>Questrade, Qtrade, HSBC Canada</li>
        </ul>
        <p>
          Opening takes 10–15 minutes online. You'll need your SIN, address, and a funding source. Even if you're not ready to invest immediately, <strong>open the account now</strong> so carry-forward room starts accumulating.
        </p>

        <h2>Calculate Your FHSA Savings</h2>
        <p>
          Use our free <Link to="/tools/fhsa-calculator" className="text-primary underline">FHSA Calculator</Link> to model how much you could save for your first home over time.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mt-8 not-prose">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Disclaimer:</strong> This article is for educational purposes only. FHSA rules are set by the CRA and subject to change. Consult a tax professional or financial advisor for personalized guidance.
          </p>
        </div>
      </article>

      <Link to="/blog" className="inline-block mt-10 text-primary dark:text-accent font-semibold hover:underline">
        ← Back to Blog
      </Link>
    </section>
  );
}
