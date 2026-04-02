import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";

export default function EmergencyFundCanada() {
  return (
    <div>
      <SEO
        title="How to Build an Emergency Fund in Canada (Step-by-Step 2026)"
        description="How much you really need in your emergency fund, the best Canadian accounts to keep it in, and a practical plan to build one from scratch in 2026."
        canonical="https://easyfinancetools.com/blog/emergency-fund-canada"
      />

      <BlogHero
        icon="🛡️"
        category="Savings · Personal Finance"
        title="How to Build an Emergency Fund in Canada (Step-by-Step)"
        date="April 2, 2026"
        readTime="7 min read"
        gradient="from-teal-600 to-emerald-700"
      />

      <section className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">

          <p className="lead">
            An emergency fund is the foundation of any financial plan. Without one, a single unexpected expense — a job loss, car repair, or medical bill — can send you into debt. Here's how to build one the right way in Canada.
          </p>

          <h2>How Much Do You Actually Need?</h2>
          <p>
            The standard advice is 3–6 months of essential expenses. But the right number depends on your situation:
          </p>

          <div className="not-prose grid sm:grid-cols-3 gap-4 my-6">
            {[
              { amount: "3 months", icon: "🟡", who: "Dual-income household, stable government or corporate job, no dependents" },
              { amount: "6 months", icon: "🟢", who: "Single income, self-employed, commission-based job, dependents, or health conditions" },
              { amount: "12 months", icon: "🔵", who: "Freelancer, business owner, irregular income, or approaching retirement" },
            ].map(a => (
              <div key={a.amount} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">{a.icon}</div>
                <div className="font-bold text-xl text-primary dark:text-accent mb-2">{a.amount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{a.who}</div>
              </div>
            ))}
          </div>

          <p>
            <strong>What counts as "essential expenses"?</strong> Rent/mortgage, groceries, utilities, insurance, minimum debt payments, and transportation. Not Netflix, dining out, or clothing.
          </p>

          <div className="not-prose bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-5 my-6">
            <p className="font-bold text-teal-800 dark:text-teal-300 mb-1">📊 Quick Calculation</p>
            <p className="text-sm text-teal-700 dark:text-teal-400">
              Add up your monthly essentials: Rent ($1,800) + Groceries ($600) + Utilities ($200) + Car ($400) + Insurance ($150) + Minimum debts ($300) = <strong>$3,450/month</strong>. Your 3-month target: <strong>$10,350</strong>. Six-month target: <strong>$20,700</strong>.
            </p>
          </div>

          <h2>Where to Keep Your Emergency Fund</h2>
          <p>
            Your emergency fund has three requirements: it must be <strong>safe</strong>, <strong>accessible</strong>, and <strong>earning interest</strong>. Here's where it should — and shouldn't — live:
          </p>

          <div className="not-prose overflow-x-auto my-6">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800 text-left">
                <tr>
                  <th className="px-4 py-3">Option</th>
                  <th className="px-4 py-3">Rate</th>
                  <th className="px-4 py-3">Access</th>
                  <th className="px-4 py-3">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  ["TFSA HISA (EQ Bank, Oaken)", "3–4%+", "1–2 business days", "✅ Best choice"],
                  ["Regular HISA", "3–4%", "1–2 business days", "✅ Good — but use TFSA version if possible"],
                  ["Big bank savings account", "0.01–0.10%", "Instant", "❌ Too low — inflation is eroding your savings"],
                  ["Under your mattress", "0%", "Instant", "❌ Never — no interest, theft risk"],
                  ["Stock market / ETFs", "Variable", "2–3 days + market risk", "❌ Too risky for emergency funds"],
                  ["GIC (non-redeemable)", "3.5–4.5%", "Locked until maturity", "❌ No access = not an emergency fund"],
                ].map(([o, r, a, v], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                    <td className="px-4 py-3 font-medium">{o}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">{r}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{a}</td>
                    <td className="px-4 py-3">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Step-by-Step Plan to Build Your Emergency Fund</h2>
          <p>
            If you're starting from zero, here's a realistic roadmap. The key is to start small — even $500 gives you a buffer for minor emergencies.
          </p>

          <div className="not-prose space-y-4 my-6">
            {[
              { step: "1", title: "Open a TFSA High-Interest Savings Account", desc: "EQ Bank, Oaken, Simplii, or Wealthsimple Cash all have TFSA accounts paying 3%+. This takes about 10 minutes online. Set this as your emergency fund's home." },
              { step: "2", title: "Set a Mini-Goal: $1,000 First", desc: "Don't get overwhelmed by the full number. A $1,000 starter fund handles most minor emergencies (car repairs, vet bills). Get there first." },
              { step: "3", title: "Automate a Weekly or Bi-Weekly Transfer", desc: "Even $25–$50 per paycheck adds up fast. Set up an automatic transfer on payday so you save before you can spend it. '$25/week = $1,300/year." },
              { step: "4", title: "Add Windfalls Directly to the Fund", desc: "Tax refunds, bonuses, gifts, or cash back — route them straight to the emergency fund until it's fully funded. A $2,000 tax refund can cover most of Milestone 1." },
              { step: "5", title: "Build to 3 Months, Then 6 Months", desc: "Once you hit $1,000, push for 3 months of expenses. Once there, aim for 6 months. Each milestone gives you more security." },
              { step: "6", title: "Never Touch It (Except Real Emergencies)", desc: "A vacation, new phone, or car upgrade is not an emergency. Write a short list of what qualifies: job loss, medical emergency, essential appliance failure, critical car repair." },
            ].map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{s.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2>How Long Will It Take?</h2>
          <p>
            Based on saving $200/month in a 3.75% HISA:
          </p>

          <div className="not-prose overflow-x-auto my-6">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800 text-left">
                <tr>
                  <th className="px-4 py-3">Monthly Savings</th>
                  <th className="px-4 py-3">$1,000 Fund</th>
                  <th className="px-4 py-3">$5,000 Fund</th>
                  <th className="px-4 py-3">$10,000 Fund</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  ["$100/month", "10 months", "4.2 years", "8+ years"],
                  ["$200/month", "5 months", "2.1 years", "4.2 years"],
                  ["$400/month", "2.5 months", "13 months", "2.1 years"],
                  ["$1,000/month", "1 month", "5 months", "10 months"],
                ].map(([m, ...rest]) => (
                  <tr key={m} className="bg-white dark:bg-gray-900">
                    <td className="px-4 py-3 font-bold">{m}</td>
                    {rest.map((v, i) => <td key={i} className="px-4 py-3">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Emergency Fund FAQs</h2>

          <h3>Should I pay off debt or build an emergency fund first?</h3>
          <p>
            Build a $1,000 starter fund first — no matter what. Then aggressively pay off high-interest debt (credit cards), while continuing to contribute a small amount to the emergency fund. Once high-interest debt is gone, fully fund your emergency fund.
          </p>

          <h3>Should my emergency fund be in a TFSA?</h3>
          <p>
            Yes — if you have TFSA room. Keeping it in a TFSA-HISA means the interest is tax-free, which adds up. The TFSA room comes back next year when you withdraw, so using it for an emergency doesn't permanently cost you anything.
          </p>

          <h3>What if I use my emergency fund?</h3>
          <p>
            Replenish it as your first financial priority after the emergency. Resume your automatic transfers until it's back to the target level. This is exactly what it's there for — no guilt required.
          </p>

          <h2>Calculate Your Savings Goal</h2>
          <div className="not-prose flex flex-wrap gap-3 my-4">
            <Link to="/tools/savings-goal" className="inline-block bg-primary text-white font-bold px-5 py-3 rounded-xl hover:bg-secondary transition text-sm">Savings Goal Calculator →</Link>
            <Link to="/tools/budget-tracker" className="inline-block border-2 border-primary text-primary font-bold px-5 py-3 rounded-xl hover:bg-primary hover:text-white transition text-sm">Budget Tracker →</Link>
          </div>
        </article>

        <div className="mt-10 pt-8 border-t dark:border-gray-700">
          <h3 className="font-bold text-lg mb-4 text-primary dark:text-accent">Related Articles & Tools</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/best-hisa-canada-2026" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
              <span className="text-sm text-gray-500">Savings</span>
              <p className="font-semibold text-primary dark:text-accent mt-1">Best HISA Rates in Canada 2026</p>
            </Link>
            <Link to="/blog/best-gic-rates-canada-2026" className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
              <span className="text-sm text-gray-500">Savings</span>
              <p className="font-semibold text-primary dark:text-accent mt-1">Best GIC Rates Canada 2026</p>
            </Link>
          </div>
        </div>
        <Link to="/blog" className="inline-block mt-8 text-primary dark:text-accent font-semibold hover:underline">← Back to Blog</Link>
      </section>
    </div>
  );
}
