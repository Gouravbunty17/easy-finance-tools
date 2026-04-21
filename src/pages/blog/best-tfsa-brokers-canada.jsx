import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";
import MethodologyPanel from "../../components/MethodologyPanel";
import TrackedLink from "../../components/TrackedLink";
import OutboundTrackedLink from "../../components/OutboundTrackedLink";
import TLDRBox from "../../components/TLDRBox";
import FAQSchema from "../../components/FAQSchema";
import ArticleSchema from "../../components/ArticleSchema";

const WEALTHSIMPLE_REFERRAL_URL = "https://wealthsimple.com/invite/R8F7ZW";

const brokers = [
  {
    name: "Wealthsimple",
    bestFor: "Absolute beginners who want the simplest long-term investing setup",
    strengths: "Very easy app experience, simple registered-account workflow, strong fit for broad ETF investing",
    tradeoff: "Less appealing if you want a more traditional self-directed brokerage experience",
    notIdealFor: "Investors who already know they want a denser brokerage workflow with more manual control from day one",
  },
  {
    name: "Questrade",
    bestFor: "DIY investors who want more control over their TFSA setup",
    strengths: "More hands-on brokerage workflow, broader self-directed feel, strong fit for experienced ETF buyers",
    tradeoff: "Less beginner-friendly than a cleaner mobile-first app",
    notIdealFor: "Brand-new investors who are still learning how TFSA room, transfers, and ETF orders work",
  },
  {
    name: "National Bank Direct Brokerage",
    bestFor: "Canadians who want a bank-linked brokerage with a more established platform feel",
    strengths: "Appeals to users who already prefer a bank ecosystem and want more investing control",
    tradeoff: "Can feel heavier than simple app-based platforms",
    notIdealFor: "People who want the shortest path from opening the account to buying one simple ETF portfolio",
  },
  {
    name: "Qtrade",
    bestFor: "Investors who want research support and a more traditional brokerage workflow",
    strengths: "Solid option for investors comparing self-directed platforms beyond the biggest names",
    tradeoff: "Usually not the easiest first platform for brand-new investors",
    notIdealFor: "Investors whose main priority is the simplest possible beginner setup with very little platform friction",
  },
];

const tfsaComparisonRows = [
  {
    label: "Best for",
    wealthsimple: "Simple first TFSA for beginners",
    questrade: "More hands-on self-directed TFSA use",
    nbdb: "Bank-linked brokerage users",
    qtrade: "Research-oriented traditional brokerage users",
  },
  {
    label: "Ease of use",
    wealthsimple: "High",
    questrade: "Medium",
    nbdb: "Medium",
    qtrade: "Medium",
  },
  {
    label: "Best strategy fit",
    wealthsimple: "Broad ETF investing with low friction",
    questrade: "DIY investing with more control",
    nbdb: "Existing bank ecosystem investing",
    qtrade: "More structured self-directed research workflow",
  },
];

const tfsaDecisionCards = [
  {
    title: "Choose Wealthsimple if...",
    tone: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    body: "you want the easiest first TFSA, mainly plan to buy broad ETFs, and do not want a platform that adds friction or confusion.",
  },
  {
    title: "Choose Questrade if...",
    tone: "bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-700",
    body: "you already know you want a more self-directed TFSA workflow and are comfortable trading off some simplicity for more control.",
  },
];

const rankingCriteria = [
  {
    title: "Account workflow first",
    body: "We ranked platforms on how easy it is to open, fund, transfer, and keep using a TFSA without unnecessary friction.",
  },
  {
    title: "Built for long-term ETF investors",
    body: "This page is for Canadians buying diversified ETFs regularly, not for active traders chasing features or promo screens.",
  },
  {
    title: "Bonuses do not drive rankings",
    body: "Referral offers and sign-up promotions can change quickly, so they were not the main driver of the shortlist order.",
  },
];

const whoShouldSkipThisGuide = [
  "Canadians who are still deciding between TFSA, RRSP, and FHSA as the next account",
  "Active traders who care more about trading tools than registered-account simplicity",
  "Investors who want full-service advice rather than a self-directed brokerage",
];

const FAQS = [
  {
    q: "What is the best TFSA broker in Canada for beginners?",
    a: "For many beginners, the best TFSA broker is usually the one that makes it easiest to open the account, buy broad ETFs, and keep contributing without confusion. Wealthsimple is often the simplest beginner pick, while more self-directed investors may prefer Questrade.",
  },
  {
    q: "Should I check TFSA room before choosing a broker?",
    a: "Yes. Your TFSA contribution room matters more than the broker branding. Before opening or funding an account, it helps to estimate available room and compare the TFSA against RRSP use if that decision is still unclear.",
  },
  {
    q: "Is Wealthsimple or Questrade better for a TFSA?",
    a: "Wealthsimple is often better for beginners who want a cleaner and simpler workflow. Questrade tends to suit Canadians who already want a more hands-on self-directed brokerage experience.",
  },
  {
    q: "What matters most in a TFSA broker?",
    a: "The most important factors are usually ease of use, support for registered-account workflows, a simple path to buying diversified ETFs, and a platform that helps you stay consistent instead of overcomplicating the plan.",
  },
  {
    q: "Should I use a TFSA or RRSP first?",
    a: "That depends on your income, tax situation, and goals. For many Canadians, getting the TFSA vs RRSP decision right matters more than choosing between broker brands.",
  },
];

export default function BestTFSABrokersCanada() {
  return (
    <div>
      <SEO
        title="Best TFSA Brokers in Canada (2026)"
        description="Compare the best TFSA brokers in Canada for 2026, including Wealthsimple, Questrade, and other self-directed platforms for long-term ETF investors."
        canonical="https://easyfinancetools.com/blog/best-tfsa-brokers-canada"
      />
      <ArticleSchema
        headline="Best TFSA Brokers in Canada (2026)"
        description="Compare the best TFSA brokers in Canada for 2026, including Wealthsimple, Questrade, and other self-directed platforms for long-term ETF investors."
        url="https://easyfinancetools.com/blog/best-tfsa-brokers-canada"
        datePublished="2026-04-04"
        dateModified="2026-04-07"
      />
      <FAQSchema faqs={FAQS} />

      <BlogHero
        icon="TFSA"
        category="Investing | TFSA"
        title="Best TFSA Brokers in Canada (2026)"
        date="April 4, 2026"
        readTime="11 min read"
        gradient="from-blue-500 to-indigo-700"
      />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <TLDRBox
          headline="What is the best TFSA broker in Canada?"
          answer="For many Canadians, the best TFSA broker is the one that makes it easiest to use contribution room well, buy diversified ETFs, and keep the account simple. Wealthsimple is often the easiest first TFSA broker for beginners, while Questrade tends to make more sense for investors who want a more self-directed workflow."
          points={[
            "Check TFSA room before choosing the broker",
            "Beginners often benefit most from simplicity and low friction",
            "DIY investors may prefer a more traditional brokerage setup",
            "The TFSA vs RRSP decision can matter more than the broker ranking",
          ]}
        />
        <article className="prose prose-lg max-w-none prose-neutral dark:prose-invert">
          <div className="not-prose mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Affiliate disclosure:</strong> Some links on this page may become affiliate links. We may earn a commission if you sign up through them, at no extra cost to you. Referral links do not decide the ranking order, and some pages on the site may recommend options that have no affiliate relationship at all.
            </p>
          </div>

          <p className="lead">
            The best TFSA broker in Canada is not the one with the loudest marketing. It is the one that helps you use your TFSA room well, buy the right investments consistently, and avoid unnecessary complexity. For many Canadians, that means a broker that makes broad ETF investing easy rather than one that adds more features than they will actually use.
          </p>

          <p>
            This guide is intentionally narrow. It is built for Canadians choosing a self-directed TFSA for long-term investing, usually with one or two broad ETFs. If that is not your situation, the ranking can become less useful very quickly.
          </p>

          <div className="not-prose my-8 grid gap-4 md:grid-cols-3">
            {rankingCriteria.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-900">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-secondary">{item.title}</p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="not-prose my-8 grid gap-4 md:grid-cols-3">
            <TrackedLink
              articleSlug="best-tfsa-brokers-canada"
              ctaLabel="intro_decision_block_tfsa"
              to="/tools/tfsa-calculator"
              className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-emerald-800 dark:bg-gray-900"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Check room first</p>
              <p className="mt-2 text-lg font-bold text-primary dark:text-accent">Use the TFSA calculator if room is still unclear</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">The best broker is not much help if you over-contribute or misjudge how much room you actually have.</p>
            </TrackedLink>
            <TrackedLink
              articleSlug="best-tfsa-brokers-canada"
              ctaLabel="intro_decision_block_rrsp"
              to="/tools/rrsp-calculator"
              className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-indigo-800 dark:bg-gray-900"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Compare the account choice</p>
              <p className="mt-2 text-lg font-bold text-primary dark:text-accent">Use RRSP math if the TFSA is not automatic</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">A broker comparison is more useful after you know whether TFSA or RRSP should get the next dollar.</p>
            </TrackedLink>
            <TrackedLink
              articleSlug="best-tfsa-brokers-canada"
              ctaLabel="intro_decision_block_compound_interest"
              to="/tools/compound-interest-calculator"
              className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-amber-800 dark:bg-gray-900"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">Model the growth target</p>
              <p className="mt-2 text-lg font-bold text-primary dark:text-accent">Use compound interest to size the plan</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Start with the monthly contribution target, then choose the broker that makes staying consistent easiest.</p>
            </TrackedLink>
          </div>

          <div className="not-prose my-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Best for beginners</p>
              <p className="mt-2 text-lg font-bold text-primary dark:text-accent">Wealthsimple</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Usually the easiest first TFSA broker if your plan is broad ETFs, simple automation, and low-friction account use.</p>
            </div>
            <div className="rounded-2xl border border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-300">Best for DIY control</p>
              <p className="mt-2 text-lg font-bold text-primary dark:text-accent">Questrade</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Usually the stronger fit if you want a more hands-on self-directed TFSA setup and do not mind a heavier workflow.</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Best if account choice is unclear</p>
              <p className="mt-2 text-lg font-bold text-primary dark:text-accent">Use the TFSA and RRSP tools first</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">If you are still debating TFSA versus RRSP, the broker ranking is less important than getting the account priority right.</p>
            </div>
          </div>

          <h2>The short list</h2>
          <ul>
            <li><strong>Wealthsimple</strong> is often the easiest first TFSA broker for beginners.</li>
            <li><strong>Questrade</strong> is a strong fit for more hands-on DIY investors.</li>
            <li><strong>National Bank Direct Brokerage</strong> can make sense if you want a more bank-style investing setup.</li>
            <li><strong>Qtrade</strong> is worth considering if you want a more traditional brokerage feel with research support.</li>
          </ul>

          <h2>Who should skip this ranking</h2>
          <p>
            A broker comparison is not always the right next page. In the situations below, the account strategy matters more than the broker shortlist.
          </p>
          <ul>
            {whoShouldSkipThisGuide.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="not-prose my-6 flex flex-wrap gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
            <OutboundTrackedLink
              href={WEALTHSIMPLE_REFERRAL_URL}
              offerName="wealthsimple"
              trackingParams={{ placement: "best_tfsa_brokers", cta_label: "see_wealthsimple_bonus" }}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary"
            >
              See Wealthsimple bonus
            </OutboundTrackedLink>
            <TrackedLink
              articleSlug="best-tfsa-brokers-canada"
              ctaLabel="compare_wealthsimple_vs_questrade"
              to="/blog/wealthsimple-vs-questrade-canada"
              className="inline-block rounded-xl border-2 border-primary px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
            >
              Wealthsimple vs Questrade
            </TrackedLink>
            <p className="w-full text-xs text-gray-600 dark:text-gray-400">
              Bonus links are optional. If a provider fits your plan but has no promotion, the editorial ranking does not change.
            </p>
          </div>

          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full overflow-hidden rounded-xl border border-gray-200 text-sm dark:border-gray-700">
              <thead className="bg-gray-100 text-left dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Factor</th>
                  <th className="px-4 py-3 font-semibold text-blue-700 dark:text-blue-300">Wealthsimple</th>
                  <th className="px-4 py-3 font-semibold">Questrade</th>
                  <th className="px-4 py-3 font-semibold">NBDB</th>
                  <th className="px-4 py-3 font-semibold">Qtrade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {tfsaComparisonRows.map((row) => (
                  <tr key={row.label} className="bg-white dark:bg-gray-900">
                    <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{row.label}</td>
                    <td className="px-4 py-3">{row.wealthsimple}</td>
                    <td className="px-4 py-3">{row.questrade}</td>
                    <td className="px-4 py-3">{row.nbdb}</td>
                    <td className="px-4 py-3">{row.qtrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
            {tfsaDecisionCards.map((card) => (
              <div key={card.title} className={`rounded-2xl border p-5 ${card.tone}`}>
                <p className="text-lg font-bold text-primary dark:text-accent">{card.title}</p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{card.body}</p>
              </div>
            ))}
          </div>

          <h2>What actually matters in a TFSA broker</h2>
          <p>
            Most investors overfocus on tiny fee differences and underfocus on behavior. A good TFSA broker should help you keep contributing, stay diversified, and avoid mistakes with registered-account room.
          </p>
          <ul>
            <li>Easy account opening and funding</li>
            <li>Clear support for TFSA transfers and contribution tracking</li>
            <li>A smooth path to buying diversified ETFs regularly</li>
            <li>An interface you will actually keep using during market volatility</li>
          </ul>

          <p>
            We did not rank these brokers on homepage design, headline bonuses, or one-time promos. We ranked them on whether the platform helps a Canadian investor open the account, fund it correctly, buy diversified holdings, and stay consistent.
          </p>

          <h2>Best TFSA brokers ranked by use case</h2>
          <div className="not-prose my-6 space-y-4">
            {brokers.map((broker) => (
              <div key={broker.name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-primary dark:text-accent">{broker.name}</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {broker.bestFor}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  <strong>Why it stands out:</strong> {broker.strengths}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <strong>Main tradeoff:</strong> {broker.tradeoff}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <strong>Not ideal for:</strong> {broker.notIdealFor}
                </p>
              </div>
            ))}
          </div>

          <h2>Best choice for beginners</h2>
          <p>
            If you are opening your very first TFSA and planning to buy a small number of long-term ETFs, Wealthsimple is usually the easiest recommendation. The user experience is cleaner, the setup feels less intimidating, and the overall workflow tends to suit Canadians who are still learning the difference between contribution room, withdrawals, and account type.
          </p>

          <h2>Best choice for more active DIY investors</h2>
          <p>
            If you already know you want a more traditional self-directed brokerage experience, Questrade often becomes more appealing. It is usually the stronger fit for investors who want more control and are comfortable with a slightly less beginner-friendly interface.
          </p>

          <h2>Do not choose the broker before choosing the account plan</h2>
          <p>
            This is the mistake that matters most. If you are still not sure whether your next dollar should go into a TFSA, RRSP, or FHSA, fix that first. Broker optimization is secondary to registered-account strategy.
          </p>

          <div className="not-prose my-6 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="mb-2 font-bold text-blue-800 dark:text-blue-300">Simple rule of thumb</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              If you want the easiest way to start a TFSA and buy broad ETFs, start simple. If you already know you want a more involved self-directed setup, use a broker that matches that style. The wrong platform is often the one that makes you hesitate, delay, or overcomplicate the plan.
            </p>
          </div>

          <h2>Run the registered-account math first</h2>
          <p>
            Before opening or moving a TFSA, check your room, compare it against RRSP use, and make sure the account decision itself is doing the heavy lifting.
          </p>

          <div className="not-prose my-4 flex flex-wrap gap-3">
            <TrackedLink
              articleSlug="best-tfsa-brokers-canada"
              ctaLabel="tfsa_calculator_primary_cta"
              to="/tools/tfsa-calculator"
              className="inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary"
            >
              TFSA Calculator
            </TrackedLink>
            <TrackedLink
              articleSlug="best-tfsa-brokers-canada"
              ctaLabel="rrsp_calculator_primary_cta"
              to="/tools/rrsp-calculator"
              className="inline-block rounded-xl border-2 border-primary px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
            >
              RRSP Calculator
            </TrackedLink>
            <TrackedLink
              articleSlug="best-tfsa-brokers-canada"
              ctaLabel="compound_interest_primary_cta"
              to="/tools/compound-interest-calculator"
              className="inline-block rounded-xl border-2 border-primary px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
            >
              Compound Interest Calculator
            </TrackedLink>
          </div>

          <MethodologyPanel
            title="How this TFSA broker guide should be used"
            summary="This page is a practical shortlist for Canadians choosing a self-directed TFSA broker. It prioritizes account fit, ease of use, and long-term investing behavior over feature overload."
            updated="April 4, 2026"
            assumptions={[
              "Broker features, pricing, and available account workflows can change, so readers should verify the latest details before opening or transferring accounts.",
              "This guide emphasizes simple long-term ETF investing workflows rather than active trading or advanced order-management features.",
              "Examples here are educational and do not replace provider disclosures or personalized financial advice.",
            ]}
            sources={[
              { label: "Methodology and Sources", href: "https://easyfinancetools.com/methodology" },
              { label: "Terms and Disclaimer", href: "https://easyfinancetools.com/terms" },
            ]}
            note="If affiliate links are added later, disclosure should stay visible near the top of the page and beside recommendation sections."
          />

          <div className="not-prose mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Wealthsimple vs Questrade",
                body: "Go deeper on the biggest beginner-vs-DIY broker comparison on the site.",
                href: "/blog/wealthsimple-vs-questrade-canada",
              },
              {
                title: "TFSA vs RRSP",
                body: "Choose the right registered account before worrying about the broker.",
                href: "/blog/tfsa-vs-rrsp-2026",
              },
              {
                title: "How much TFSA room?",
                body: "Check your 2026 room context before contributing or transferring accounts.",
                href: "/blog/how-much-tfsa-room-2026",
              },
            ].map((item) => (
              <TrackedLink
                key={item.href}
                articleSlug="best-tfsa-brokers-canada"
                ctaLabel={item.title}
                to={item.href}
                className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-secondary hover:shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <p className="font-semibold text-primary dark:text-accent">{item.title}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.body}</p>
              </TrackedLink>
            ))}
          </div>

          <div className="not-prose mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Disclaimer:</strong> Educational guide only. Broker features, pricing, and TFSA workflows can change. Always confirm current terms before opening or transferring an account.
            </p>
          </div>
        </article>

        <div className="mt-10 border-t pt-8 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-bold text-primary dark:text-accent">Related articles and tools</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TrackedLink articleSlug="best-tfsa-brokers-canada" ctaLabel="related_wealthsimple_vs_questrade" to="/blog/wealthsimple-vs-questrade-canada" className="block rounded-lg bg-white p-4 shadow transition hover:shadow-md dark:bg-gray-800">
              <span className="text-sm text-gray-500">Broker comparison</span>
              <p className="mt-1 font-semibold text-primary dark:text-accent">Wealthsimple vs Questrade for Canadians</p>
            </TrackedLink>
            <TrackedLink articleSlug="best-tfsa-brokers-canada" ctaLabel="related_best_etfs_tfsa" to="/blog/best-etfs-for-tfsa-canada-2026" className="block rounded-lg bg-white p-4 shadow transition hover:shadow-md dark:bg-gray-800">
              <span className="text-sm text-gray-500">Investing</span>
              <p className="mt-1 font-semibold text-primary dark:text-accent">Best ETFs for Your TFSA in Canada</p>
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
