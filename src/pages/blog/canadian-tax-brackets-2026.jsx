import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";
import TrackedLink from "../../components/TrackedLink";

const federalBrackets = [
  { range: "$0 - $57,375", rate: "15%" },
  { range: "$57,375 - $114,750", rate: "20.5%" },
  { range: "$114,750 - $158,519", rate: "26%" },
  { range: "$158,519 - $220,000", rate: "29%" },
  { range: "Over $220,000", rate: "33%" },
];

export default function CanadianTaxBrackets2026() {
  return (
    <div>
      <SEO
        title="Canadian Tax Brackets 2026: Federal & Provincial Rates"
        description="Review the 2026 Canadian federal tax brackets, understand marginal vs effective rates, and move into tax-planning calculators and related guides."
        canonical="https://easyfinancetools.com/blog/canadian-tax-brackets-2026"
      />

      <BlogHero
        icon="Tax"
        category="Tax | Income"
        title="Canadian Tax Brackets 2026: Federal & Provincial Rates"
        date="March 29, 2026"
        readTime="8 min read"
        gradient="from-orange-500 to-red-600"
      />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <article className="prose prose-lg max-w-none prose-neutral dark:prose-invert">
          <h2>2026 federal income tax brackets</h2>
          <p>
            Canada uses a progressive tax system, which means each bracket rate applies only to the income inside that range.
          </p>

          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full overflow-hidden rounded-xl border border-gray-200 text-sm dark:border-gray-700">
              <thead className="bg-primary text-left text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Taxable Income</th>
                  <th className="px-4 py-3 font-semibold">Federal Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {federalBrackets.map((item, index) => (
                  <tr key={item.range} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                    <td className="px-4 py-3">{item.range}</td>
                    <td className="px-4 py-3 font-bold text-primary dark:text-accent">{item.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Marginal rate vs effective rate</h2>
          <p>
            Your marginal rate is the tax rate on your next dollar of income. Your effective rate is your total tax divided by your total income. The distinction matters because raises do not push all your income into the higher bracket.
          </p>

          <h2>Useful planning angles</h2>
          <ul>
            <li>RRSP contributions reduce taxable income at your marginal rate.</li>
            <li>TFSA withdrawals generally do not increase taxable income.</li>
            <li>Capital gains are taxed differently than employment income.</li>
            <li>CPP, EI, and provincial tax still affect take-home pay.</li>
          </ul>

          <h2>Calculate your taxes instantly</h2>
          <p>
            Use the calculator to estimate take-home pay, compare income levels, and test the impact of RRSP deductions.
          </p>
          <div className="not-prose my-4">
            <TrackedLink
              articleSlug="canadian-tax-brackets-2026"
              ctaLabel="income_tax_calculator_primary_cta"
              to="/tools/income-tax-calculator"
              className="inline-block rounded-xl bg-primary px-6 py-3 font-bold text-white transition hover:bg-secondary"
            >
              Use the Income Tax Calculator {"->"}
            </TrackedLink>
          </div>

          <div className="not-prose mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Disclaimer:</strong> Tax brackets and take-home estimates should be verified against CRA and provincial guidance. This page is educational only.
            </p>
          </div>
        </article>

        <div className="mt-10 border-t pt-8 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-bold text-primary dark:text-accent">Related Articles & Tools</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TrackedLink articleSlug="canadian-tax-brackets-2026" ctaLabel="related_rrsp_deadline" to="/blog/rrsp-deadline-2026" className="block rounded-lg bg-white p-4 shadow transition hover:shadow-md dark:bg-gray-800">
              <span className="text-sm text-gray-500">RRSP</span>
              <p className="mt-1 font-semibold text-primary dark:text-accent">RRSP Deadline 2026</p>
            </TrackedLink>
            <TrackedLink articleSlug="canadian-tax-brackets-2026" ctaLabel="related_capital_gains_tool" to="/tools/capital-gains-tax" className="block rounded-lg bg-white p-4 shadow transition hover:shadow-md dark:bg-gray-800">
              <span className="text-sm text-gray-500">Tool</span>
              <p className="mt-1 font-semibold text-primary dark:text-accent">Capital Gains Tax Calculator</p>
            </TrackedLink>
          </div>
        </div>

        <Link to="/blog" className="mt-8 inline-block font-semibold text-primary hover:underline dark:text-accent">
          Back to Blog
        </Link>
      </section>
    </div>
  );
}
