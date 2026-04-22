import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";
import TrackedLink from "../../components/TrackedLink";
import TLDRBox from "../../components/TLDRBox";
import FAQSchema from "../../components/FAQSchema";
import ArticleSchema from "../../components/ArticleSchema";
import MethodologyPanel from "../../components/MethodologyPanel";

const FAQS = [
  {
    q: "Should I prepay my mortgage or invest the money instead?",
    a: "The right answer depends on rates, account type, and your personal situation. Prepaying a 5.25% mortgage earns you a guaranteed 5.25% return — better than most GICs and comparable to many balanced funds on a risk-adjusted basis. But inside a TFSA or RRSP, tax-free or tax-deferred investment returns at 7–8% typically beat 5.25% mortgage prepayment over a 25-year horizon. A practical rule: capture any employer RRSP match first (that's an immediate 50–100% return), fund your TFSA, then direct the remainder to prepayment. If your mortgage rate is 6%+, the balance shifts more decisively toward prepaying.",
  },
  {
    q: "What is a prepayment penalty and how is it calculated?",
    a: "A prepayment penalty applies when you break your mortgage before the term ends. Fixed-rate mortgages use the greater of three months' interest or the Interest Rate Differential (IRD). The IRD compares your contract rate against the lender's posted rate for the remaining term — if rates have fallen since you signed, the IRD can be very large. Variable-rate mortgages almost always charge only three months' interest, which is far more predictable. Always review your mortgage agreement for the specific calculation before breaking a mortgage. The penalty can easily exceed $10,000–$20,000 on a large fixed-rate mortgage if rates have dropped.",
  },
  {
    q: "Does accelerated bi-weekly actually save money?",
    a: "Yes — meaningfully. Accelerated bi-weekly splits your monthly payment in half and collects it every two weeks. With 26 bi-weekly periods per year, you make the equivalent of 13 monthly payments instead of 12. That 13th payment applies entirely to principal. On a $500,000 mortgage at 5.25% over 25 years, switching to accelerated bi-weekly typically saves three to four years and $60,000–$85,000 in total interest — with no change to your budget other than payment frequency. Most lenders allow you to switch by phone in a single call.",
  },
  {
    q: "Can I increase my regular payment mid-term without a penalty?",
    a: "Most Canadian mortgages include an annual payment increase privilege — typically 10–20% above the original scheduled payment — that carries no penalty. This is separate from lump-sum prepayment privileges. For example, if your scheduled payment is $2,500/month and your lender allows a 15% increase, you can bump it to $2,875 without penalty. The privilege typically resets each anniversary year. Check your mortgage agreement for your specific limit — increasing beyond the allowed amount can trigger a penalty.",
  },
  {
    q: "What happens to my prepayment room when I switch lenders at renewal?",
    a: "Prepayment room does not carry over when you switch lenders. Any unused lump-sum allowance from the current term is forfeited at the end of the term. If you've only used $5,000 of a $50,000 annual prepayment allowance, use the remaining room before the term closes — right up to the last day. Once you sign with a new lender, your prepayment allowance resets based on the new loan balance and the new lender's terms.",
  },
  {
    q: "How much should I lump-sum during the term vs. waiting for renewal?",
    a: "Earlier is always better from a math standpoint. A $10,000 lump sum applied today begins reducing your principal immediately, so every month of interest is calculated on a smaller balance. Waiting 12 months before applying that same $10,000 costs you roughly $525 in lost savings at a 5.25% rate. If the money is sitting in a HISA earning 3.75%, the net advantage of prepaying now vs. waiting is smaller — about $150 over a year — so it can be reasonable to hold in a HISA temporarily while building toward your lump-sum date. The key is not to delay indefinitely.",
  },
  {
    q: "What is the mortgage stress test and why does it matter for prepayment?",
    a: "OSFI Guideline B-20 requires federally regulated lenders to qualify mortgage borrowers at the higher of their contract rate plus 2%, or 5.25%. At a contract rate of 4.50%, you qualify at 6.50%. This affects how much mortgage you can carry. For variable-rate holders, the 2022–2024 rate cycle pushed many borrowers close to or past their trigger rate — the point at which the full scheduled payment no longer covers the interest portion. Understanding how your amortization is tracking matters most when rates are rising: if your loan balance is growing instead of shrinking, aggressive prepayment during lower-rate periods is how you rebuild the buffer.",
  },
];

const prepaymentRules = [
  { lender: "RBC Royal Bank", lumpSum: "Up to 10% annually", paymentIncrease: "Up to 10% per year", notes: "Double-up option on most products. Varies by mortgage type." },
  { lender: "TD Bank", lumpSum: "Up to 15% annually", paymentIncrease: "Up to 100% (double payments)", notes: "Double-up option widely available on TD mortgage products." },
  { lender: "BMO", lumpSum: "Up to 20% annually", paymentIncrease: "Up to 20% per year", notes: "Among the most generous Big Six prepayment allowances." },
  { lender: "Scotiabank", lumpSum: "Up to 15% annually", paymentIncrease: "Up to 15% per year", notes: "eHOME and specialist mortgage products may differ." },
  { lender: "CIBC", lumpSum: "Up to 20% annually", paymentIncrease: "Up to 20% per year", notes: "Applied to original principal per term, not remaining balance." },
  { lender: "National Bank", lumpSum: "Up to 10% annually", paymentIncrease: "Up to 10% per year", notes: "Varies by product. Confirm exact allowance in your mortgage agreement." },
];

export default function PayOffMortgageFasterCanada() {
  return (
    <div>
      <SEO
        title="7 Ways to Pay Off Your Mortgage Faster in Canada (2026)"
        description="Proven, lender-approved strategies to shave years off your Canadian mortgage and save tens of thousands in interest. Includes bi-weekly math, Big Six prepayment rules, and penalty explained."
        canonical="https://easyfinancetools.com/blog/pay-off-mortgage-faster-canada"
      />
      <ArticleSchema
        headline="7 Ways to Pay Off Your Mortgage Faster in Canada (2026)"
        description="Seven lender-approved strategies to reduce your Canadian mortgage amortization, including accelerated bi-weekly math, prepayment allowances by lender, penalty types, and the stress test explained."
        url="https://easyfinancetools.com/blog/pay-off-mortgage-faster-canada"
        datePublished="2026-04-02"
        dateModified="2026-04-20"
      />
      <FAQSchema faqs={FAQS} />

      <BlogHero
        icon="Home"
        category="Real Estate | Mortgage"
        title="7 Ways to Pay Off Your Mortgage Faster in Canada"
        date="April 2, 2026"
        readTime="12 min read"
        gradient="from-rose-500 to-red-700"
      />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <TLDRBox
          headline="What's the fastest way to pay off a Canadian mortgage?"
          answer="Switching to accelerated bi-weekly payments is free and saves 3–4 years on a typical 25-year mortgage. Adding annual lump-sum prepayments — even just your tax refund — compounds the savings. The key is using the privileges your lender already allows rather than breaking the mortgage and triggering a penalty."
          points={[
            "Accelerated bi-weekly = 13 monthly payments/year — saves $60K–$85K on a $500K mortgage at 5.25%",
            "Annual lump-sum prepayments go 100% to principal — even $2,000/year saves $45,000 in interest",
            "Big Six lenders allow 10–20% annual lump sum + 10–20% payment increase without penalty",
            "Fixed-rate penalty = IRD (can be large); variable-rate penalty = 3 months interest (predictable)",
            "Never over-prepay beyond your allowance — penalties can erase all your savings",
          ]}
        />
        <div className="not-prose mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Last updated:</strong> April 20, 2026. Prepayment privileges and penalty rules vary by lender and mortgage product. Always verify your specific allowances in your mortgage agreement before making additional payments.
          </p>
        </div>

        <article className="prose prose-lg max-w-none prose-neutral dark:prose-invert">
          <p className="lead">
            The average Canadian mortgage is $350,000+ at 5%+ interest. Over a 25-year amortization, that means paying over $200,000 in interest alone. These 7 strategies cut years off your mortgage using tools your lender already permits — no refinancing required.
          </p>

          <div className="not-prose my-6 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
            <p className="mb-1 font-bold text-red-800 dark:text-red-300">The real cost of a Canadian mortgage</p>
            <p className="text-sm text-red-700 dark:text-red-400">
              On a $500,000 mortgage at 5.25% over 25 years: monthly payment ≈ <strong>$2,994</strong>. Total interest paid ≈ <strong>$398,000</strong>. You pay back nearly $898,000 on a $500K loan. Every dollar of extra principal paid today saves roughly $1.80 over the life of the mortgage.
            </p>
          </div>

          <h2>Strategy 1: Switch to Accelerated Bi-Weekly Payments</h2>
          <p>
            This is the single easiest change you can make, and it costs nothing to implement at most lenders.
          </p>
          <ul>
            <li><strong>Monthly payments:</strong> 12 payments per year</li>
            <li><strong>Regular bi-weekly:</strong> 26 payments, same annual total as monthly — no savings</li>
            <li><strong>Accelerated bi-weekly:</strong> 26 payments at half the monthly amount, equivalent to <strong>13 monthly payments per year</strong></li>
          </ul>
          <p>
            That 13th monthly payment applies entirely to principal. The math compresses your amortization significantly.
          </p>

          <div className="not-prose my-6 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="mb-2 font-bold text-blue-800 dark:text-blue-300">Worked example: $500,000 mortgage at 5.25%, 25-year amortization</p>
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
              <p><strong>Monthly payments:</strong> $2,994/month × 12 = $35,928/year. Total paid over 25 years: ~$898,200. Total interest: ~$398,000.</p>
              <p><strong>Accelerated bi-weekly:</strong> $1,497 every two weeks × 26 = $38,922/year — the equivalent of one extra monthly payment annually. Pays off in approximately <strong>21.5 years</strong>. Total interest: ~$315,000.</p>
              <p className="font-semibold">Interest saved: ~$83,000. Years saved: ~3.5 years. Cost to implement: one phone call.</p>
            </div>
            <p className="mt-2 text-xs text-blue-600 dark:text-blue-500">
              Based on Canadian semi-annual compounding per the Interest Act of Canada. For illustration only — verify with your lender.
            </p>
          </div>

          <h2>Strategy 2: Make Annual Lump-Sum Prepayments</h2>
          <p>
            Almost every Canadian mortgage allows annual lump-sum prepayments — typically 10–20% of the original principal — entirely separate from your regular payments. Every dollar goes directly to principal reduction.
          </p>
          <p><strong>What to apply as prepayments:</strong></p>
          <ul>
            <li>Federal tax refund — the average Canadian refund is roughly $2,000</li>
            <li>Work bonuses or overtime pay</li>
            <li>Inheritance or cash gifts</li>
            <li>Side income from freelancing, rentals, or consulting</li>
            <li>GST/HST credit payments ($560+ for a single person in 2026)</li>
          </ul>

          <div className="not-prose my-4 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="mb-1 font-bold text-blue-800 dark:text-blue-300">Example: $2,000/year tax refund applied as prepayment</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              On a $500K mortgage at 5.25%, applying a $2,000 annual lump sum saves approximately <strong>$45,000 in interest</strong> and cuts <strong>3 years</strong> from your amortization. That's a guaranteed 5.25% return — often better than a GIC, with no market risk.
            </p>
          </div>

          <h2>Strategy 3: Increase Your Regular Payment Amount</h2>
          <p>
            Most Canadian mortgages allow a payment increase of 10–20% per year above the original scheduled amount. Even modest increases make a meaningful difference over a 25-year mortgage.
          </p>

          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full overflow-hidden rounded-xl border border-gray-200 text-sm dark:border-gray-700">
              <thead className="bg-gray-100 text-left dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3">Extra Monthly Payment</th>
                  <th className="px-4 py-3">Years Saved</th>
                  <th className="px-4 py-3">Interest Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  ["$100/month extra", "~1.5 years", "~$22,000"],
                  ["$250/month extra", "~3.5 years", "~$50,000"],
                  ["$500/month extra", "~6 years", "~$88,000"],
                  ["$1,000/month extra", "~10 years", "~$140,000"],
                ].map(([extra, years, interest]) => (
                  <tr key={extra} className="bg-white dark:bg-gray-900">
                    <td className="px-4 py-3 font-semibold">{extra}</td>
                    <td className="px-4 py-3 font-bold text-primary dark:text-accent">{years}</td>
                    <td className="px-4 py-3 font-bold text-green-600">{interest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-gray-400">Based on a $500K mortgage at 5.25% with a 25-year amortization. Canadian semi-annual compounding. For illustration only.</p>
          </div>

          <h2>Strategy 4: Round Up Your Payments</h2>
          <p>
            If your payment is $2,847, round it up to $2,900 or $3,000. The extra $53–$153 per month is barely noticeable in daily spending but adds up to real savings across a 25-year mortgage. Many lenders let you set a custom payment amount above the minimum without counting it against your payment increase privilege — confirm your specific mortgage terms.
          </p>

          <h2>Strategy 5: Shop Aggressively at Renewal</h2>
          <p>
            Most Canadians auto-renew with their existing lender at whatever rate is offered. That's almost always a mistake. At renewal, you have full negotiating leverage because you can move your mortgage elsewhere without a penalty.
          </p>
          <ul>
            <li><strong>Get 3+ competing quotes</strong> from your bank, a credit union, and a mortgage broker</li>
            <li><strong>Even 0.25% lower</strong> saves thousands over a 5-year term on a large mortgage</li>
            <li><strong>Brokers are free</strong> — they are paid by the lender, not you</li>
            <li><strong>Do not auto-renew</strong> — your lender is not required to offer their best rate until you ask</li>
          </ul>

          <div className="not-prose my-4 rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
            <p className="mb-1 font-bold text-green-800 dark:text-green-300">Rate savings example</p>
            <p className="text-sm text-green-700 dark:text-green-400">
              On a $400,000 remaining balance, renewing at 4.75% vs 5.25% saves <strong>$167/month</strong> or <strong>$10,000 over 5 years</strong>. Apply those savings as prepayments and you accelerate payoff further.
            </p>
          </div>

          <h2>Strategy 6: Use Your FHSA + RRSP Home Buyers' Plan Strategically</h2>
          <p>
            If you're still in the buying phase, maximizing your FHSA and RRSP Home Buyers' Plan for your down payment means a larger down payment, a smaller mortgage principal, and less total interest. Getting above 20% down eliminates CMHC insurance — which adds 2.80–4.00% of the mortgage amount to your loan. On a $600,000 home with 10% down, that's $13,480–$19,200 in insurance added to your principal before you make a single payment.
          </p>

          <h2>Strategy 7: Apply Raises and Windfalls Systematically</h2>
          <p>
            Every time you receive a raise, commit to directing at least half of the net increase to your mortgage payment. You've already been living on your old salary, so you won't miss it. Over a career with regular 2–3% annual raises, this strategy alone can cut 5–8 years off a typical 25-year mortgage without requiring any change in lifestyle.
          </p>

          <h2>Prepayment allowances by lender (Big Six)</h2>
          <p>
            Before making additional payments, confirm your specific mortgage product's allowances. Most Big Six mortgages allow some combination of annual lump-sum payments and payment increases. Going beyond the allowed amount can trigger a prepayment penalty.
          </p>

          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full overflow-hidden rounded-xl border border-gray-200 text-sm dark:border-gray-700">
              <thead className="bg-primary text-left text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Lender</th>
                  <th className="px-4 py-3 font-semibold">Annual Lump Sum</th>
                  <th className="px-4 py-3 font-semibold">Payment Increase</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {prepaymentRules.map((row, index) => (
                  <tr key={row.lender} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                    <td className="px-4 py-3 font-medium">{row.lender}</td>
                    <td className="px-4 py-3 font-bold text-green-700 dark:text-green-400">{row.lumpSum}</td>
                    <td className="px-4 py-3">{row.paymentIncrease}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-gray-500">Rules vary by mortgage product and term. Always verify in your specific mortgage agreement. Source: lender websites and published mortgage terms as of April 2026.</p>
          </div>

          <h2>Prepayment penalties: what to know before breaking your mortgage</h2>
          <p>
            Breaking a mortgage early to refinance or sell can trigger a significant penalty. Understanding the penalty type before you sign your mortgage helps you plan.
          </p>

          <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <p className="font-bold text-primary dark:text-accent">Fixed-rate mortgage penalty</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                The greater of: (a) <strong>three months' interest</strong>, or (b) the <strong>Interest Rate Differential (IRD)</strong>. The IRD compares your contract rate against the lender's current posted rate for the remaining term. If posted rates have fallen since you signed, the IRD can be very large — $15,000–$30,000+ on a large mortgage. Always request a penalty estimate from your lender before breaking.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <p className="font-bold text-primary dark:text-accent">Variable-rate mortgage penalty</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Almost always <strong>three months' interest</strong> only — no IRD calculation. On a $400,000 variable-rate mortgage at 5.25%, three months' interest is approximately $5,250. Far more predictable than a fixed penalty, which is why variable-rate mortgages are often preferred by borrowers who anticipate selling or refinancing within the term.
              </p>
            </div>
          </div>

          <h2>The stress test and variable-rate payment shock</h2>
          <p>
            Under <a href="https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline-b-20" target="_blank" rel="noreferrer">OSFI Guideline B-20</a>, federally regulated lenders must qualify borrowers at the higher of their contract rate plus 2%, or 5.25%. At a contract rate of 4.50%, you qualify at 6.50%. This requirement applies to both insured (under 20% down) and uninsured mortgages.
          </p>
          <p>
            Variable-rate holders who signed in 2020–2021 at rates near 1.5% experienced significant payment shock as the Bank of Canada raised its policy rate to 5.00% by 2023. Some borrowers hit their <strong>trigger rate</strong> — the point at which the full scheduled payment no longer covers the interest portion, causing the loan balance to actually grow. Prepayment strategies matter most in periods like these: any extra principal you build before a rate cycle reduces how exposed you are when rates move against you.
          </p>

          <h2>What not to do</h2>
          <ul>
            <li><strong>Break your mortgage to refinance without calculating the penalty.</strong> The IRD on a fixed-rate mortgage can easily exceed the interest savings from a lower rate. Run the full numbers including the penalty before making this decision.</li>
            <li><strong>Over-prepay beyond your allowed annual limit.</strong> Penalties apply. Know your exact prepayment room before making a large payment.</li>
            <li><strong>Sacrifice your RRSP or TFSA entirely.</strong> If your employer matches RRSP contributions, that's an immediate 50–100% return that beats any mortgage prepayment strategy. Capture the match first.</li>
            <li><strong>Skip the emergency fund.</strong> Aggressively prepaying your mortgage while holding no liquid savings means any financial disruption goes directly to high-interest credit-card debt. Keep 3 months of essential expenses liquid before prepaying beyond the minimum.</li>
          </ul>

          <h2>Use the mortgage calculator</h2>
          <p>Model your specific mortgage and see how much each strategy saves:</p>
          <div className="not-prose my-4 flex flex-wrap gap-3">
            <TrackedLink articleSlug="pay-off-mortgage-faster-canada" ctaLabel="mortgage_calculator_primary_cta" to="/tools/mortgage-calculator" className="inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary">
              Mortgage Calculator →
            </TrackedLink>
            <TrackedLink articleSlug="pay-off-mortgage-faster-canada" ctaLabel="rent_vs_buy_cta" to="/tools/rent-vs-buy" className="inline-block rounded-xl border-2 border-primary px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white">
              Rent vs Buy Calculator →
            </TrackedLink>
          </div>

          <h2>Frequently asked questions</h2>

          <h3>Should I prepay my mortgage or invest the money instead?</h3>
          <p>
            The math depends on your mortgage rate vs. your expected after-tax investment return. Prepaying a 5.25% mortgage gives you a guaranteed 5.25% return — after tax, on a non-registered account earning 7%, you likely net 4–5% depending on your marginal rate. Capturing employer RRSP matching (free money), funding your TFSA (tax-free returns), and then prepaying is usually the right sequence. If your mortgage rate is 6%+, the balance shifts more clearly toward prepaying.
          </p>

          <h3>What is the Interest Rate Differential penalty?</h3>
          <p>
            The IRD is the difference between your contract rate and the lender's current rate for the remaining term, applied to your outstanding balance for the remaining months. Example: you locked in at 5.50% and the lender's current 2-year rate is 4.25%. On a $400,000 balance with 2 years remaining, IRD ≈ (5.50% − 4.25%) × $400,000 × 2 = approximately $10,000. Lender calculations vary and some use posted rates (not discounted rates), which can inflate the penalty substantially. Always request the exact figure from your lender.
          </p>

          <h3>Does accelerated bi-weekly cost me more each month?</h3>
          <p>
            Yes, slightly — but it aligns with how many Canadians are paid. If you receive pay every two weeks, the payment comes out on the same day your paycheque deposits, so it rarely feels like more money is going out. The annual difference is equivalent to one extra monthly payment: roughly $2,994 extra per year on a $500K mortgage. The savings — three to four years and $60,000–$85,000 in interest — are entirely from that single payment.
          </p>

          <h3>Can I make a lump-sum payment at any time?</h3>
          <p>
            Most lenders allow lump-sum prepayments on any regular payment date, up to the annual allowance. Some restrict it to once per anniversary year; others allow multiple smaller payments throughout the year as long as the total stays within the limit. Check your mortgage agreement or call your lender — the specific rules vary by product and institution.
          </p>

          <MethodologyPanel
            title="How this page was prepared"
            summary="Payment and interest savings figures are calculated using Canadian mortgage mathematics with semi-annual compounding per the Interest Act of Canada. Prepayment allowances are based on publicly available lender terms as of April 2026 and may vary by product. This article is educational and not financial advice."
            updated="April 20, 2026"
            reviewer="Gourav Kumar, Editor"
            assumptions={[
              "All examples use a $500,000 mortgage at 5.25% over 25 years with Canadian semi-annual compounding as required by the Interest Act.",
              "Accelerated bi-weekly savings assume consistent payments across the full amortization with no additional lump sums.",
              "Big Six prepayment allowances are based on publicly available mortgage documents as of April 2026. Product-level rules vary — verify in your mortgage agreement.",
              "IRD penalty example is illustrative and uses simplified assumptions. Actual lender calculations vary and may use posted rates rather than discounted rates.",
            ]}
            sources={[
              { label: "OSFI Guideline B-20 — Residential Mortgage Underwriting Practices", href: "https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline-b-20" },
              { label: "CMHC — Mortgage default insurance premiums and eligibility", href: "https://www.cmhc-schl.gc.ca/buying-a-home/homebuyer-incentive-and-tools/mortgage-loan-insurance-homebuying-guide" },
              { label: "Canada Interest Act — section 6 (semi-annual compounding requirement)", href: "https://laws-lois.justice.gc.ca/eng/acts/I-15/page-1.html" },
            ]}
          />

          <div className="not-prose mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Disclaimer:</strong> All figures are illustrative based on the assumptions stated above. Prepayment privileges, penalty calculations, and allowable payment increases vary by lender and mortgage product. Always review your mortgage agreement and consult your lender before making additional payments or changes. This page is for educational purposes only and does not constitute financial or mortgage advice.
            </p>
          </div>
        </article>

        <div className="mt-10 border-t pt-8 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-bold text-primary dark:text-accent">Related Articles & Tools</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TrackedLink articleSlug="pay-off-mortgage-faster-canada" ctaLabel="related_mortgage_calculator" to="/tools/mortgage-calculator" className="block rounded-lg bg-white p-4 shadow transition hover:shadow-md dark:bg-gray-800">
              <span className="text-sm text-gray-500">Tool</span>
              <p className="mt-1 font-semibold text-primary dark:text-accent">Canadian Mortgage Calculator</p>
            </TrackedLink>
            <TrackedLink articleSlug="pay-off-mortgage-faster-canada" ctaLabel="related_rent_vs_buy" to="/tools/rent-vs-buy" className="block rounded-lg bg-white p-4 shadow transition hover:shadow-md dark:bg-gray-800">
              <span className="text-sm text-gray-500">Tool</span>
              <p className="mt-1 font-semibold text-primary dark:text-accent">Rent vs Buy Calculator</p>
            </TrackedLink>
            <TrackedLink articleSlug="pay-off-mortgage-faster-canada" ctaLabel="related_fhsa_article" to="/blog/how-to-use-fhsa-canada" className="block rounded-lg bg-white p-4 shadow transition hover:shadow-md dark:bg-gray-800">
              <span className="text-sm text-gray-500">FHSA</span>
              <p className="mt-1 font-semibold text-primary dark:text-accent">How to Use the FHSA in Canada</p>
            </TrackedLink>
            <TrackedLink articleSlug="pay-off-mortgage-faster-canada" ctaLabel="related_compound" to="/tools/compound-interest-calculator" className="block rounded-lg bg-white p-4 shadow transition hover:shadow-md dark:bg-gray-800">
              <span className="text-sm text-gray-500">Tool</span>
              <p className="mt-1 font-semibold text-primary dark:text-accent">Compound Interest Calculator</p>
            </TrackedLink>
          </div>
        </div>

        <Link to="/blog" className="mt-8 inline-block font-semibold text-primary hover:underline dark:text-accent">
          ← Back to Blog
        </Link>
      </section>
    </div>
  );
}
