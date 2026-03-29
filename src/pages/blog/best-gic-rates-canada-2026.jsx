import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const gicRates = [
  { institution: "EQ Bank",           term: "1-year GIC",  rate: "4.00%", type: "Non-redeemable", insured: "CDIC" },
  { institution: "Oaken Financial",   term: "1-year GIC",  rate: "4.10%", type: "Non-redeemable", insured: "CDIC" },
  { institution: "Peoples Bank",      term: "1-year GIC",  rate: "3.90%", type: "Non-redeemable", insured: "CDIC" },
  { institution: "Achieva Financial", term: "1-year GIC",  rate: "4.05%", type: "Non-redeemable", insured: "DPCU" },
  { institution: "Steinbach CU",      term: "1-year GIC",  rate: "4.15%", type: "Non-redeemable", insured: "DPCU" },
  { institution: "Hubert Financial",  term: "1-year GIC",  rate: "3.95%", type: "Non-redeemable", insured: "DPCU" },
  { institution: "Laurentian Bank",   term: "1-year GIC",  rate: "3.75%", type: "Non-redeemable", insured: "CDIC" },
  { institution: "National Bank",     term: "1-year GIC",  rate: "3.55%", type: "Non-redeemable", insured: "CDIC" },
  { institution: "TD Bank",           term: "1-year GIC",  rate: "3.25%", type: "Non-redeemable", insured: "CDIC" },
  { institution: "RBC",               term: "1-year GIC",  rate: "3.10%", type: "Non-redeemable", insured: "CDIC" },
];

export default function BestGICRatesCanada2026() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title="Best GIC Rates in Canada (March 2026) — Top Rates Compared"
        description="Compare the best GIC rates in Canada for March 2026. 1-year, 2-year, and 5-year GIC rates from EQ Bank, Oaken, credit unions, and big banks. Updated monthly."
        canonical="https://easyfinancetools.com/blog/best-gic-rates-canada-2026"
      />

      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <CalendarIcon className="w-4 h-4" />
          <time>March 29, 2026</time>
          <span>·</span>
          <TagIcon className="w-4 h-4" />
          <span>GIC · Savings</span>
          <span>·</span>
          <span>7 min read</span>
        </div>
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-4 leading-tight">
          Best GIC Rates in Canada (March 2026)
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          Guaranteed Investment Certificates (GICs) are back as a legitimate savings strategy after years of near-zero rates. Here are the best GIC rates available in Canada right now, compared across terms and institution types.
        </p>
      </div>

      <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Last updated:</strong> March 29, 2026. GIC rates change frequently. Always verify directly with the institution before purchasing.
        </p>
      </div>

      <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">

        <h2>Best 1-Year GIC Rates in Canada (March 2026)</h2>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-primary text-white text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Institution</th>
                <th className="px-4 py-3 font-semibold">Term</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Insured By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {gicRates.map((g, i) => (
                <tr key={g.institution} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-3 font-medium">{g.institution}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{g.term}</td>
                  <td className="px-4 py-3 font-bold text-green-700 dark:text-green-400 text-lg">{g.rate}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{g.type}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{g.insured}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          <strong>Key finding:</strong> The big 5 banks (TD, RBC, BMO, Scotiabank, CIBC) consistently offer the lowest GIC rates. Online banks like EQ Bank and credit unions like Steinbach and Achieva offer 50–100 basis points more — while still being fully insured.
        </p>

        <h2>Best Multi-Year GIC Rates (March 2026)</h2>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Term</th>
                <th className="px-4 py-3 font-semibold">Best Rate Available</th>
                <th className="px-4 py-3 font-semibold">Institution</th>
                <th className="px-4 py-3 font-semibold">$10,000 Grows To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["6 months",  "3.75%", "EQ Bank",           "$10,187"],
                ["1 year",    "4.15%", "Steinbach CU",       "$10,415"],
                ["2 years",   "3.85%", "Oaken Financial",    "$10,786"],
                ["3 years",   "3.70%", "EQ Bank",            "$11,152"],
                ["4 years",   "3.60%", "Peoples Bank",       "$11,530"],
                ["5 years",   "3.65%", "Oaken Financial",    "$11,955"],
              ].map(([term, rate, inst, grows]) => (
                <tr key={term} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium">{term}</td>
                  <td className="px-4 py-3 font-bold text-green-700 dark:text-green-400">{rate}</td>
                  <td className="px-4 py-3">{inst}</td>
                  <td className="px-4 py-3 text-primary dark:text-accent font-semibold">{grows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>What Is a GIC?</h2>
        <p>
          A Guaranteed Investment Certificate (GIC) is a low-risk savings product where you deposit money for a fixed term and receive a guaranteed interest rate. Unlike stocks or ETFs, the principal is protected — you cannot lose your original deposit.
        </p>
        <ul>
          <li><strong>Non-redeemable GICs</strong> — locked in for the full term. Higher rates. Cannot withdraw early.</li>
          <li><strong>Cashable/redeemable GICs</strong> — can be withdrawn early after a short hold period (usually 30–90 days). Lower rates.</li>
          <li><strong>Variable-rate GICs</strong> — rate floats with prime rate or CPI. Useful as inflation hedge.</li>
          <li><strong>Market-linked GICs</strong> — principal protected, with returns tied to a stock index. Complex products — read the fine print carefully.</li>
        </ul>

        <h2>Are GICs Safe? CDIC & Provincial Deposit Insurance</h2>
        <p>
          GICs at federally regulated banks are insured by the <strong>Canada Deposit Insurance Corporation (CDIC)</strong> up to <strong>$100,000 per depositor per category</strong>. Categories include:
        </p>
        <ul>
          <li>Deposits in your name</li>
          <li>Deposits in joint name</li>
          <li>RRSP deposits</li>
          <li>TFSA deposits</li>
          <li>RRIF deposits</li>
          <li>FHSA deposits</li>
        </ul>
        <p>
          This means you can be insured for $600,000+ at a single CDIC member by spreading deposits across categories.
        </p>
        <p>
          Credit unions are insured by <strong>provincial deposit insurance corporations</strong> (DPCU in Manitoba, DICO in Ontario, etc.) — often with unlimited coverage, making them potentially safer than CDIC limits.
        </p>

        <h2>GIC vs HISA vs Bonds: Which Is Best in 2026?</h2>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Typical Rate (2026)</th>
                <th className="px-4 py-3 font-semibold">Liquidity</th>
                <th className="px-4 py-3 font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["Non-redeemable GIC (1yr)", "3.75–4.15%", "Locked in", "None (insured)"],
                ["High-Interest Savings (HISA)", "3.00–3.75%", "Instant access", "None (insured)"],
                ["Cashable GIC", "3.25–3.65%", "After 30–90 days", "None (insured)"],
                ["Government Bond ETF", "3.50–4.00% (yield)", "Daily (market)", "Low (price fluctuation)"],
                ["Savings ETF (CASH, CSAV)", "3.50–3.80%", "T+1 settlement", "Minimal"],
              ].map(([product, rate, liquidity, risk]) => (
                <tr key={product} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium">{product}</td>
                  <td className="px-4 py-3 text-green-700 dark:text-green-400 font-semibold">{rate}</td>
                  <td className="px-4 py-3">{liquidity}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Should You Hold GICs in a TFSA or RRSP?</h2>
        <p>
          <strong>Always hold GICs in a registered account (TFSA or RRSP) if possible.</strong> GIC interest is <em>fully taxable as income</em> in a non-registered account — if you're in the 43% bracket, you keep less than 57 cents of every dollar earned.
        </p>
        <ul>
          <li><strong>TFSA GIC:</strong> All interest earned is tax-free. Ideal for GICs you'll need before retirement.</li>
          <li><strong>RRSP GIC:</strong> Interest deferred until withdrawal. Good for longer-term GIC ladders in your retirement savings.</li>
          <li><strong>Non-registered:</strong> Only use if you've maxed both TFSA and RRSP.</li>
        </ul>

        <h2>GIC Laddering Strategy</h2>
        <p>
          Rather than locking all your money in one GIC at one rate, a <strong>GIC ladder</strong> staggers maturities to give you regular access and rate flexibility:
        </p>
        <ol>
          <li>Split $50,000 into 5 equal $10,000 chunks</li>
          <li>Buy GICs at 1-year, 2-year, 3-year, 4-year, and 5-year terms</li>
          <li>When the 1-year matures, reinvest in a new 5-year (which now offers the highest rate)</li>
          <li>Repeat — you now have one GIC maturing every year, with access to cash and always capturing top long-term rates</li>
        </ol>

        <h2>Grow Your Savings with Our Free Tools</h2>
        <p>Use our TFSA Calculator to see how GIC interest compounds over time inside a tax-free account:</p>
        <div className="not-prose my-4">
          <Link
            to="/tools/tfsa-calculator"
            className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary transition"
          >
            Use the TFSA Calculator →
          </Link>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mt-8 not-prose">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Disclaimer:</strong> GIC rates are approximate and change frequently. This article is for informational purposes only. Always verify rates directly with financial institutions before investing. Not financial advice.
          </p>
        </div>
      </article>

      <div className="mt-10 pt-8 border-t dark:border-gray-700">
        <h3 className="font-bold text-lg mb-4 text-primary dark:text-accent">Related Articles & Tools</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/blog/how-much-tfsa-room-2026" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <span className="text-sm text-gray-500">TFSA</span>
            <p className="font-semibold text-primary dark:text-accent mt-1">How Much TFSA Room Do I Have in 2026?</p>
          </Link>
          <Link to="/blog/tfsa-vs-rrsp-2026" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <span className="text-sm text-gray-500">Savings</span>
            <p className="font-semibold text-primary dark:text-accent mt-1">TFSA vs RRSP: Which Is Better?</p>
          </Link>
        </div>
      </div>

      <Link to="/blog" className="inline-block mt-8 text-primary dark:text-accent font-semibold hover:underline">
        ← Back to Blog
      </Link>
    </section>
  );
}
