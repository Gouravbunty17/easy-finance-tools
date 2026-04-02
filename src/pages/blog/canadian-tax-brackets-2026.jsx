import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";

const federalBrackets = [
  { range: "$0 – $57,375",           rate: "15%",   tax: "$0 – $8,606" },
  { range: "$57,375 – $114,750",     rate: "20.5%", tax: "$8,606 – $20,358" },
  { range: "$114,750 – $158,519",    rate: "26%",   tax: "$20,358 – $31,738" },
  { range: "$158,519 – $220,000",    rate: "29%",   tax: "$31,738 – $49,573" },
  { range: "Over $220,000",          rate: "33%",   tax: "$49,573 +" },
];

const provincialRates = [
  { province: "Alberta",            topRate: "15%",   combined: "48%",  note: "No provincial sales tax" },
  { province: "British Columbia",   topRate: "20.5%", combined: "53.5%",note: "" },
  { province: "Ontario",            topRate: "13.16%",combined: "46.16%",note: "Surtax applies over $6,500" },
  { province: "Quebec",             topRate: "25.75%",combined: "58.75%",note: "Highest combined rate in Canada" },
  { province: "Manitoba",           topRate: "17.4%", combined: "50.4%",note: "" },
  { province: "Saskatchewan",       topRate: "14.5%", combined: "47.5%",note: "" },
  { province: "Nova Scotia",        topRate: "21%",   combined: "54%",  note: "" },
  { province: "New Brunswick",      topRate: "19.5%", combined: "52.5%",note: "" },
  { province: "PEI",                topRate: "16.7%", combined: "49.7%",note: "" },
  { province: "Newfoundland",       topRate: "21.3%", combined: "54.3%",note: "" },
  { province: "Northwest Territories", topRate: "14.05%", combined: "47.05%", note: "" },
  { province: "Nunavut",            topRate: "11.5%", combined: "44.5%", note: "Lowest combined rate" },
  { province: "Yukon",              topRate: "15%",   combined: "48%",  note: "" },
];

export default function CanadianTaxBrackets2026() {
  return (
    <div>
      <SEO
        title="Canadian Tax Brackets 2026: Federal & All Provincial Rates"
        description="Complete 2026 Canadian income tax brackets — federal rates, all provincial/territorial rates, marginal vs effective tax rate explained, and how to pay less tax legally."
        canonical="https://easyfinancetools.com/blog/canadian-tax-brackets-2026"
      />
      <BlogHero
        icon="🧾"
        category="Tax · Income"
        title="Canadian Tax Brackets 2026: Federal & All Provincial Rates"
        date="March 29, 2026"
        readTime="8 min read"
        gradient="from-orange-500 to-red-600"
      />
      <section className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">

        <h2>2026 Federal Income Tax Brackets</h2>
        <p>
          Canada uses a <strong>progressive tax system</strong> — you pay each rate only on the income within that bracket. The 2026 federal brackets (indexed for inflation):
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-primary text-white text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Taxable Income (2026)</th>
                <th className="px-4 py-3 font-semibold">Federal Tax Rate</th>
                <th className="px-4 py-3 font-semibold">Tax Owed on Bracket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {federalBrackets.map((b, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-3 font-medium">{b.range}</td>
                  <td className="px-4 py-3 text-primary dark:text-accent font-bold text-lg">{b.rate}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{b.tax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 my-6">
          <p className="font-bold text-blue-800 dark:text-blue-300 mb-2">2026 Basic Personal Amount</p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            The federal basic personal amount for 2026 is <strong>$16,129</strong> — you pay no federal income tax on the first $16,129 of earnings. This is automatically applied as a non-refundable tax credit (15% × $16,129 = $2,419 reduction in federal tax).
          </p>
        </div>

        <h2>Marginal Rate vs Effective Tax Rate</h2>
        <p>This is the most misunderstood concept in Canadian taxes. Here's the key distinction:</p>
        <ul>
          <li>
            <strong>Marginal tax rate</strong> — the rate you pay on your <em>next dollar</em> of income. If you earn $120,000 in Ontario, your marginal rate is about 43.41% — but only on income between $114,750 and $120,000.
          </li>
          <li>
            <strong>Effective (average) tax rate</strong> — your total tax divided by total income. Someone earning $120,000 in Ontario actually pays an effective rate of about 28% — not 43%.
          </li>
        </ul>
        <p>
          <strong>The myth to bust:</strong> "I got a raise and now I'll pay more tax overall." A raise never reduces your take-home pay. The higher rate only applies to the additional income above the bracket threshold.
        </p>

        <h2>Tax Example: $100,000 Income in Ontario (2026)</h2>
        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Income Portion</th>
                <th className="px-4 py-3 font-semibold">Federal Rate</th>
                <th className="px-4 py-3 font-semibold">Federal Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["$0 – $16,129", "0% (basic personal)", "$0"],
                ["$16,129 – $57,375", "15%", "$6,187"],
                ["$57,375 – $100,000", "20.5%", "$8,739"],
                ["Total federal tax", "", "$14,926"],
                ["Basic personal credit", "", "−$2,419"],
                ["Net federal tax", "", "$12,507"],
              ].map(([portion, rate, tax], i) => (
                <tr key={i} className={i >= 4 ? "bg-blue-50 dark:bg-blue-900/20 font-semibold" : "bg-white dark:bg-gray-900"}>
                  <td className="px-4 py-3">{portion}</td>
                  <td className="px-4 py-3">{rate}</td>
                  <td className="px-4 py-3 font-semibold">{tax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Add Ontario provincial tax (~$5,900) + CPP (~$3,867) + EI (~$1,049) and the total deductions on $100,000 are roughly <strong>$22,300</strong> — leaving you with about <strong>$77,700 after-tax</strong>. Effective rate: ~22.3%.
        </p>

        <h2>2026 Provincial & Territorial Top Marginal Rates</h2>
        <p>Each province adds its own tax on top of federal. These are the top combined marginal rates (federal + provincial) for 2026:</p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Province/Territory</th>
                <th className="px-4 py-3 font-semibold">Top Provincial Rate</th>
                <th className="px-4 py-3 font-semibold">Top Combined Rate</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {provincialRates.map((r, i) => (
                <tr key={r.province} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-3 font-medium">{r.province}</td>
                  <td className="px-4 py-3">{r.topRate}</td>
                  <td className="px-4 py-3 font-bold text-primary dark:text-accent">{r.combined}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Key 2026 Tax Credits & Deductions</h2>
        <p>Reduce your tax bill with these commonly missed credits:</p>
        <ul>
          <li><strong>Basic Personal Amount:</strong> $16,129 federal (varies by province)</li>
          <li><strong>RRSP contributions:</strong> Deducted from taxable income at your marginal rate</li>
          <li><strong>First-time home buyers' amount:</strong> Up to $10,000 → $1,500 tax credit</li>
          <li><strong>Home office deduction:</strong> $2/day flat-rate or detailed method for remote workers</li>
          <li><strong>Charitable donations:</strong> 15% on first $200, 29–33% above $200</li>
          <li><strong>Disability Tax Credit:</strong> Up to $9,428 non-refundable credit</li>
          <li><strong>Tuition tax credit:</strong> 15% federal credit on eligible tuition</li>
          <li><strong>Medical expense credit:</strong> Amounts over 3% of net income or $2,759 (whichever is less)</li>
          <li><strong>Spousal amount:</strong> Up to $15,705 if supporting a spouse/partner</li>
        </ul>

        <h2>CPP & EI Contributions 2026</h2>
        <p>
          On top of income tax, employees also pay CPP and EI premiums. These are deducted before you receive your paycheque:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Contribution</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
                <th className="px-4 py-3 font-semibold">2026 Maximum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["CPP contributions (employee)", "5.95% on earnings $3,500–$71,300", "$4,034.10"],
                ["CPP2 contributions", "4% on earnings $71,300–$81,900", "$420"],
                ["EI premiums (employee)", "1.64% on insurable earnings", "$1,077.48"],
                ["CPP contributions (self-employed)", "11.90% (both employer + employee)", "$8,068.20"],
              ].map(([c, rate, max]) => (
                <tr key={c} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium">{c}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate}</td>
                  <td className="px-4 py-3 font-semibold text-primary dark:text-accent">{max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Legal Ways to Pay Less Tax in 2026</h2>
        <ol>
          <li><strong>Maximize your RRSP</strong> — every dollar contributed reduces taxable income at your marginal rate</li>
          <li><strong>Fill your TFSA</strong> — investment growth inside a TFSA is never taxed, and withdrawals don't add to income</li>
          <li><strong>Claim every credit</strong> — use tax software or a CPA to ensure you're not missing deductions</li>
          <li><strong>Income split with a spouse</strong> — pension income splitting, spousal RRSP contributions</li>
          <li><strong>Capital gains timing</strong> — only 50% of capital gains are included in income (inclusion rate)</li>
          <li><strong>Use your FHSA</strong> — contributions are tax-deductible, withdrawals for a first home are tax-free</li>
        </ol>

        <h2>Calculate Your Taxes Instantly</h2>
        <p>Use our free Canadian Income Tax Calculator to see exactly how much tax you'll pay in 2026:</p>
        <div className="not-prose my-4">
          <Link
            to="/tools/income-tax-calculator"
            className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-secondary transition"
          >
            Use the Income Tax Calculator →
          </Link>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mt-8 not-prose">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Disclaimer:</strong> Tax brackets are estimates based on 2025 figures indexed for inflation. Always verify with the CRA or a qualified tax professional. This article is for educational purposes only.
          </p>
        </div>
      </article>

      <div className="mt-10 pt-8 border-t dark:border-gray-700">
        <h3 className="font-bold text-lg mb-4 text-primary dark:text-accent">Related Articles & Tools</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/blog/rrsp-deadline-2026" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <span className="text-sm text-gray-500">RRSP</span>
            <p className="font-semibold text-primary dark:text-accent mt-1">RRSP Deadline 2026</p>
          </Link>
          <Link to="/tools/capital-gains-tax" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <span className="text-sm text-gray-500">Tool</span>
            <p className="font-semibold text-primary dark:text-accent mt-1">Capital Gains Tax Calculator</p>
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
