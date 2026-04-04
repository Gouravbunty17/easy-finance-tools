import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";
import MethodologyPanel from "../../components/MethodologyPanel";
import TrackedLink from "../../components/TrackedLink";

const LIMITS = [
  [2009, 5000], [2010, 5000], [2011, 5000], [2012, 5000], [2013, 5500],
  [2014, 5500], [2015, 10000], [2016, 5500], [2017, 5500], [2018, 5500],
  [2019, 6000], [2020, 6000], [2021, 6000], [2022, 6000], [2023, 6500],
  [2024, 7000], [2025, 7000], [2026, 7000],
];

const cumulative = LIMITS.reduce((acc, [year, amount]) => {
  const prev = acc.length ? acc[acc.length - 1].total : 0;
  acc.push({ year, limit: amount, total: prev + amount });
  return acc;
}, []);

const roomByBirthYear = [
  "1991 or earlier",
  "1992",
  "1993",
  "1994",
  "1995",
  "1996",
  "1997",
  "1998",
  "1999",
  "2000",
  "2001",
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
].map((label, index) => {
  const eligibleYear = 2009 + index;
  const total = LIMITS.filter(([year]) => year >= eligibleYear).reduce((sum, [, amount]) => sum + amount, 0);
  return { label, eligibleYear, total };
});

export default function HowMuchTFSARoom() {
  return (
    <div>
      <SEO
        title="How Much TFSA Room Do I Have in 2026? - Full Contribution Limit Table"
        description="Find out how much TFSA contribution room you may have in 2026. See the full year-by-year limit table, cumulative totals, and how to verify your exact number through CRA My Account."
        canonical="https://easyfinancetools.com/blog/how-much-tfsa-room-2026"
      />

      <BlogHero
        icon="TFSA"
        category="TFSA and Savings"
        title="How Much TFSA Room Do I Have in 2026?"
        date="April 3, 2026"
        readTime="6 min read"
        gradient="from-blue-400 to-blue-700"
      />

      <section className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
          <h2>Your 2026 TFSA contribution room</h2>
          <p>
            The 2026 annual TFSA dollar limit is <strong>$7,000</strong>. If you were eligible for a TFSA from 2009 onward and have never contributed, your cumulative room in 2026 is <strong>$109,000</strong>.
          </p>
          <p>Your personal room depends on three things:</p>
          <ol>
            <li>The year you first became eligible to accumulate room</li>
            <li>Whether you were a Canadian resident during those years</li>
            <li>Your prior contributions and prior withdrawals</li>
          </ol>

          <h2>TFSA annual limits by year</h2>

          <div className="not-prose overflow-x-auto my-6">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Year</th>
                  <th className="px-4 py-3 font-semibold">Annual Limit</th>
                  <th className="px-4 py-3 font-semibold text-green-600">Cumulative Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {cumulative.map(({ year, limit, total }) => (
                  <tr key={year} className={year === 2026 ? "bg-blue-50 dark:bg-blue-900/20 font-bold" : "bg-white dark:bg-gray-900"}>
                    <td className="px-4 py-2.5">{year}{year === 2026 ? " <- Current" : ""}</td>
                    <td className="px-4 py-2.5">${limit.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-green-700 dark:text-green-400 font-semibold">${total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>How to find your exact TFSA room</h2>
          <p>The most reliable place to confirm your personal room is <strong>CRA My Account</strong>:</p>
          <ol>
            <li>Go to <strong>canada.ca/my-cra-account</strong></li>
            <li>Sign in with your CRA credentials or participating bank login</li>
            <li>Open the TFSA section and review your contribution room</li>
            <li>Compare that figure against your recent contributions and withdrawals</li>
          </ol>
          <p>
            CRA records for the prior calendar year are typically updated by spring, so if you made very recent contributions or withdrawals, confirm that the records have been processed before relying on the number.
          </p>

          <h2>How TFSA room accumulates</h2>
          <p>Your available room is generally:</p>
          <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 my-4 font-mono text-sm text-blue-900 dark:text-blue-200">
            Available room = new annual limit + unused room from prior years + prior-year withdrawals - current-year contributions
          </div>
          <p>
            If you withdrew $10,000 in 2025, that $10,000 is normally added back on January 1, 2026, along with the new annual limit for 2026.
          </p>

          <h2>TFSA room by birth year in 2026 if you never contributed</h2>
          <div className="not-prose overflow-x-auto my-6">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Birth Year</th>
                  <th className="px-4 py-3 font-semibold">Eligible Since</th>
                  <th className="px-4 py-3 font-semibold text-green-600">Total Room in 2026</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {roomByBirthYear.map(({ label, eligibleYear, total }) => (
                  <tr key={label} className="bg-white dark:bg-gray-900">
                    <td className="px-4 py-2.5">{label}</td>
                    <td className="px-4 py-2.5">{eligibleYear}</td>
                    <td className="px-4 py-2.5 text-green-700 dark:text-green-400 font-semibold">${total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-2">
              Assumes continuous Canadian residency from the first eligible year and no prior contributions.
            </p>
          </div>

          <h2>Common TFSA mistakes to avoid</h2>

          <h3>1. Re-contributing a withdrawal too early</h3>
          <p>
            Many over-contributions happen because someone withdraws money and then puts it back in the same calendar year without having extra unused room. The withdrawal is usually only restored on January 1 of the following year.
          </p>

          <h3>2. Assuming CRA is always real-time</h3>
          <p>
            CRA figures are valuable, but they can lag if institutions have not yet reported your latest transactions. Use CRA as your baseline, then reconcile it against your own records.
          </p>

          <h3>3. Contributing while non-resident</h3>
          <p>
            You generally do not accumulate new TFSA room while a non-resident of Canada, and contributions made while non-resident can trigger penalties.
          </p>

          <h2>Next step</h2>
          <p>
            Once you know your available room, run the <TrackedLink articleSlug="how-much-tfsa-room-2026" ctaLabel="tfsa_calculator_inline" to="/tools/tfsa-calculator" className="text-primary underline">TFSA calculator</TrackedLink> to estimate future tax-free growth, then compare it with the <TrackedLink articleSlug="how-much-tfsa-room-2026" ctaLabel="rrsp_calculator_inline" to="/tools/rrsp-calculator" className="text-primary underline">RRSP calculator</TrackedLink> if you are deciding between accounts.
          </p>
        </article>

        <MethodologyPanel
          title="How this article was checked"
          summary="This guide uses CRA contribution-room guidance and the published TFSA annual dollar limits in force through 2026. Birth-year totals assume the person was a Canadian resident every year from their first eligible year onward and has never contributed."
          assumptions={[
            "Totals assume continuous Canadian residency from the first eligible year.",
            "Totals assume no prior contributions and no prior withdrawals.",
            "Actual CRA room can differ if prior-year records have not yet been fully processed.",
          ]}
          sources={[
            { label: "CRA: Calculate your TFSA contribution room", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributing/calculate-room.html" },
            { label: "CRA: Before you contribute to a TFSA", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributing/before.html" },
          ]}
        />

        <Link to="/blog" className="inline-block mt-10 text-primary dark:text-accent font-semibold hover:underline">
          Back to Blog
        </Link>
      </section>
    </div>
  );
}
