import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import ArticleImage from "../components/ArticleImage";
import SurfaceTrackedLink from "../components/SurfaceTrackedLink";
import TopicClusterMap from "../components/TopicClusterMap";
import NewsletterSection from "../components/NewsletterSection";

const categoryStyle = {
  Retirement: { gradient: "from-purple-500 to-purple-700", icon: "CA" },
  Tax: { gradient: "from-orange-500 to-red-600", icon: "Tax" },
  RRSP: { gradient: "from-green-500 to-emerald-700", icon: "RRSP" },
  Savings: { gradient: "from-teal-500 to-cyan-700", icon: "Save" },
  "TFSA & RRSP": { gradient: "from-blue-500 to-indigo-700", icon: "Mix" },
  TFSA: { gradient: "from-blue-400 to-blue-700", icon: "TFSA" },
  Investing: { gradient: "from-indigo-500 to-violet-700", icon: "ETF" },
  FHSA: { gradient: "from-emerald-500 to-teal-700", icon: "Home" },
  Dividends: { gradient: "from-yellow-500 to-amber-600", icon: "Cash" },
  "Real Estate": { gradient: "from-rose-500 to-red-700", icon: "Home" },
  Budget: { gradient: "from-slate-500 to-gray-700", icon: "Plan" },
  Beginners: { gradient: "from-sky-500 to-blue-700", icon: "Learn" },
  "AI Planning": { gradient: "from-slate-700 to-emerald-700", icon: "AI" },
};

const posts = [
  {
    slug: "ai-api-costs-tokens-agent-loops-rag-cad-budgeting",
    title: "AI API Costs Explained: Tokens, Agent Loops, RAG, and CAD Budgeting",
    date: "2026-05-31",
    category: "AI Planning",
    readTime: "10 min",
    excerpt: "Understand AI API cost mechanics before launch: tokens, cached tokens, agent loops, RAG, long context, CAD/USD budgeting, and hidden implementation costs.",
  },
  {
    slug: "ai-cost-calculator-estimate-api-spend",
    title: "AI Cost Calculator: Estimate Your AI API Spend Before Launching",
    date: "2026-05-31",
    category: "AI Planning",
    readTime: "9 min",
    excerpt: "Estimate AI API costs before launch using requests, tokens, agent loops, RAG, image usage, CAD/USD conversion, and business planning assumptions.",
  },
  {
    slug: "rrsp-withdrawal-tax-calculator",
    title: "RRSP Withdrawal Tax Calculator: What You Actually Keep After Tax",
    date: "2026-05-24",
    category: "RRSP",
    readTime: "13 min",
    excerpt: "Estimate how much of an RRSP withdrawal may remain after Canadian tax, withholding, province, income level, and retirement timing caveats.",
  },
  {
    slug: "tfsa-contribution-room-calculator",
    title: "TFSA Contribution Room Calculator: 2026 Limit + Carryforward",
    date: "2026-05-20",
    category: "TFSA",
    readTime: "12 min",
    excerpt: "Estimate TFSA room using 2026 limits, carryforward, withdrawals, and current-year deposits, then verify against CRA records.",
  },
  {
    slug: "tfsa-withdrawal-rules-canada-2026",
    title: "TFSA Withdrawal Rules in Canada (2026)",
    date: "2026-05-20",
    category: "TFSA",
    readTime: "8 min",
    excerpt: "Learn when TFSA withdrawal room comes back and why same-year recontributions can accidentally create excess contributions.",
  },
  {
    slug: "tfsa-overcontribution-penalties-canada",
    title: "TFSA Overcontribution Penalties Explained",
    date: "2026-05-20",
    category: "TFSA",
    readTime: "8 min",
    excerpt: "Understand common TFSA overcontribution mistakes, the 1% monthly tax, and what to check before making another deposit.",
  },
  {
    slug: "mortgage-affordability-reality-check-canada",
    title: "Mortgage Affordability Reality Check Canada",
    date: "2026-05-18",
    category: "Real Estate",
    readTime: "10 min",
    excerpt: "Separate mortgage approval from a safe household budget, including stress tests, cash to close, repairs, condo fees, and renewal risk.",
  },
  {
    slug: "rent-vs-buy-canada",
    title: "Rent vs Buy in Canada",
    date: "2026-05-18",
    category: "Real Estate",
    readTime: "11 min",
    excerpt: "Compare ownership costs, flexibility, down payment, opportunity cost, and timeline before treating buying as the default answer.",
  },
  {
    slug: "pay-debt-vs-invest-canada",
    title: "Pay Debt vs Invest in Canada",
    date: "2026-05-18",
    category: "Investing",
    readTime: "10 min",
    excerpt: "A practical framework for choosing between debt repayment, TFSA/RRSP investing, emergency cash, and lower-rate debt tradeoffs.",
  },
  {
    slug: "when-rrsp-makes-sense-canada",
    title: "When an RRSP Makes Sense in Canada",
    date: "2026-05-18",
    category: "RRSP",
    readTime: "10 min",
    excerpt: "Understand when RRSP contributions are strongest, including tax-rate gaps, employer match, refund use, and TFSA alternatives.",
  },
  {
    slug: "should-you-drip-dividends-canada",
    title: "Should You DRIP Dividends in Canada?",
    date: "2026-05-18",
    category: "Dividends",
    readTime: "9 min",
    excerpt: "Decide when dividend reinvestment supports compounding and when taking cash is cleaner for income, taxes, or rebalancing.",
  },
  {
    slug: "mortgage-prepayments-vs-investing-canada",
    title: "Mortgage Prepayments vs Investing in Canada",
    date: "2026-05-09",
    category: "Real Estate",
    readTime: "12 min",
    excerpt: "A practical Canadian framework for comparing guaranteed mortgage interest savings with uncertain investment returns, taxes, liquidity, and renewal risk.",
  },
  {
    slug: "high-yield-dividend-etfs-hurt-wealth-canada",
    title: "When High-Yield Dividend ETFs Can Hurt Long-Term Wealth",
    date: "2026-05-09",
    category: "Dividends",
    readTime: "11 min",
    excerpt: "Understand when large ETF payouts can hide covered-call tradeoffs, concentration, tax complexity, capital erosion, or weak total return.",
  },
  {
    slug: "tfsa-withdrawals-contribution-room-canada",
    title: "TFSA Withdrawal and Recontribution Rules in Canada",
    date: "2026-05-09",
    category: "TFSA",
    readTime: "10 min",
    excerpt: "Learn why TFSA withdrawal room usually returns next January, how same-year recontributions go wrong, and how to verify room with CRA records.",
  },
  {
    slug: "rrsp-mistake-middle-income-canadians",
    title: "The RRSP Mistake Middle-Income Canadians Make",
    date: "2026-05-09",
    category: "RRSP",
    readTime: "10 min",
    excerpt: "A practical look at refund-first RRSP thinking, tax-rate gaps, TFSA comparison, benefit interactions, and how to use the refund intentionally.",
  },
  {
    slug: "why-prioritize-fhsa-before-tfsa-canada",
    title: "Why Many Canadians Should Prioritize FHSA Before TFSA",
    date: "2026-05-09",
    category: "FHSA",
    readTime: "11 min",
    excerpt: "A Canadian account-priority framework for first-home savers comparing FHSA deductions, TFSA flexibility, eligibility, and home timeline risk.",
  },
  {
    slug: "covered-call-etfs-canada-explained",
    title: "Covered Call ETFs in Canada Explained",
    date: "2026-05-06",
    category: "Investing",
    readTime: "10 min",
    excerpt: "Learn how covered call ETFs generate income, why yields can be higher, what upside tradeoffs exist, and what Canadians should compare before buying.",
  },
  {
    slug: "drip-strategy-canada",
    title: "DRIP Strategy Canada: When to Reinvest Dividends",
    date: "2026-05-06",
    category: "Dividends",
    readTime: "9 min",
    excerpt: "Decide when reinvesting dividends makes sense and when taking cash may be better for taxes, rebalancing, income, or portfolio control.",
  },
  {
    slug: "tfsa-investing-mistakes-canada",
    title: "TFSA Mistakes Canadians Make",
    date: "2026-05-06",
    category: "TFSA",
    readTime: "9 min",
    excerpt: "Avoid overcontributions, withdrawal timing errors, short-term investing risk, business-like trading issues, and foreign dividend surprises.",
  },
  {
    slug: "how-to-choose-etfs-canada",
    title: "How to Choose ETFs in Canada: Beginner Checklist",
    date: "2026-05-06",
    category: "Investing",
    readTime: "10 min",
    excerpt: "A Canadian ETF checklist covering account type, asset allocation, MER, diversification, currency, distributions, tax complexity, and risk.",
  },
  {
    slug: "what-is-a-dividend-etf-canada",
    title: "What Is a Dividend ETF? Canadian Investor Guide",
    date: "2026-05-06",
    category: "Investing",
    readTime: "9 min",
    excerpt: "Learn how dividend ETFs work, how distributions are paid, what risks to check, and how they may fit a TFSA, RRSP, or taxable account.",
  },
  {
    slug: "dividend-reinvestment-plans-canada",
    title: "Dividend Reinvestment Plans Canada: How DRIPs Work, Pros, Cons & Taxes",
    date: "2026-05-05",
    category: "Dividends",
    readTime: "10 min",
    excerpt: "Learn how DRIPs work in Canada, including synthetic brokerage DRIPs, compounding examples, taxable-account reporting, adjusted cost base, and common mistakes.",
  },
  {
    slug: "tfsa-contribution-room-canada-2026",
    title: "TFSA Contribution Room Canada 2026: Limit, Rules & Common Mistakes",
    date: "2026-04-29",
    category: "TFSA",
    readTime: "9 min",
    excerpt: "Learn how TFSA contribution room works in Canada for 2026, including the $7,000 limit, withdrawals, CRA room updates, examples, and common mistakes.",
  },
  {
    slug: "rrsp-deadline-canada-2026",
    title: "RRSP Deadline Canada 2026: Contribution Rules & Tax Refund Examples",
    date: "2026-04-29",
    category: "RRSP",
    readTime: "9 min",
    excerpt: "Understand the 2026 RRSP contribution deadline, deduction-room rules, tax refund examples, late-contribution mistakes, and account planning basics.",
  },
  {
    slug: "fhsa-rules-canada-2026",
    title: "FHSA Rules Canada 2026: Eligibility, Limits, Transfers & Withdrawals",
    date: "2026-04-29",
    category: "FHSA",
    readTime: "10 min",
    excerpt: "A Canadian FHSA rules guide covering eligibility, 2026 contribution room, carry-forward rules, transfers, qualifying withdrawals, and common mistakes.",
  },
  {
    slug: "tfsa-vs-rrsp-vs-fhsa-canada",
    title: "TFSA vs RRSP vs FHSA: Which Account Should Canadians Use First?",
    date: "2026-04-29",
    category: "TFSA & RRSP",
    readTime: "10 min",
    excerpt: "Compare TFSA, RRSP, and FHSA account priority for Canadians saving for a home, retirement, investing flexibility, and tax planning.",
  },
  {
    slug: "best-canadian-dividend-etfs-2026",
    title: "Canadian Dividend ETFs 2026: Income, Fees & Risks",
    date: "2026-04-29",
    category: "Dividends",
    readTime: "11 min",
    excerpt: "Compare Canadian dividend ETF categories by income focus, fees, diversification, covered-call risk, account fit, and payout assumptions.",
  },
  {
    slug: "tfsa-vs-rrsp-canada-2026",
    title: "TFSA vs RRSP in Canada (2026): Which Should You Max First?",
    date: "2026-04-23",
    category: "TFSA & RRSP",
    readTime: "11 min",
    excerpt: "Compare TFSA vs RRSP in Canada for 2026, including tax differences, contribution strategy, and which account to prioritize based on income and goals.",
  },
  {
    slug: "fhsa-vs-rrsp-down-payment-canada-2026",
    title: "FHSA vs RRSP for a Down Payment in Canada (2026)",
    date: "2026-04-23",
    category: "FHSA",
    readTime: "10 min",
    excerpt: "Compare FHSA vs RRSP for a down payment in Canada, including tax treatment, withdrawal rules, contribution tradeoffs, and when using both makes sense.",
  },
  {
    slug: "fhsa-calculator-canada-2026",
    title: "FHSA Calculator Canada: 2026 Tax Savings, Rules, and Growth Guide",
    date: "2026-04-23",
    category: "FHSA",
    readTime: "10 min",
    excerpt: "Estimate your 2026 FHSA tax savings, understand the contribution rules, and compare the FHSA against TFSA and RRSP choices before your next deposit.",
  },
  {
    slug: "500-month-dividend-canada",
    title: "How to Earn $500/Month from Dividend ETFs in Canada (2026)",
    date: "2026-04-23",
    category: "Dividends",
    readTime: "9 min",
    excerpt: "See how much you may need to invest to reach $500 per month from Canadian dividend ETFs, with examples, calculator inputs, and account-planning context.",
  },
  {
    slug: "how-to-start-investing-canada-2026",
    title: "How to Start Investing in Canada (2026): TFSA, RRSP, ETFs and First Steps",
    date: "2026-04-23",
    category: "Beginners",
    readTime: "10 min",
    excerpt: "A beginner-friendly guide to choosing between TFSA, RRSP, and FHSA, deciding when to save versus invest, and taking practical first ETF steps in Canada.",
  },
  {
    slug: "best-dividend-investing-platforms-canada",
    title: "Dividend Investing Platforms in Canada (2026)",
    date: "2026-04-04",
    category: "Investing",
    readTime: "10 min",
    excerpt: "A practical shortlist of the best dividend investing platforms in Canada, including beginner-friendly and more self-directed options for TFSA and RRSP investors.",
  },
  {
    slug: "best-investing-apps-canada",
    title: "Investing Apps in Canada (2026)",
    date: "2026-04-04",
    category: "Investing",
    readTime: "11 min",
    excerpt: "A practical shortlist of the best investing apps in Canada, including simple beginner options and more self-directed app-based platforms.",
  },
  {
    slug: "best-rrsp-accounts-canada",
    title: "RRSP Accounts in Canada (2026)",
    date: "2026-04-04",
    category: "Investing",
    readTime: "11 min",
    excerpt: "A practical shortlist of the best RRSP accounts in Canada, including simple beginner options and more hands-on self-directed platforms.",
  },
  {
    slug: "best-tfsa-brokers-canada",
    title: "TFSA Brokers in Canada (2026)",
    date: "2026-04-04",
    category: "Investing",
    readTime: "11 min",
    excerpt: "A practical shortlist of the best TFSA brokers in Canada, including beginner-friendly and more hands-on self-directed options.",
  },
  {
    slug: "wealthsimple-vs-questrade-canada",
    title: "Wealthsimple vs Questrade for Canadians (2026)",
    date: "2026-04-03",
    category: "Investing",
    readTime: "11 min",
    excerpt: "A practical comparison of Wealthsimple vs Questrade for TFSA, RRSP, FHSA, fees, ease of use, and beginner-friendliness.",
  },
  {
    slug: "how-to-invest-in-canada-beginners-2026",
    title: "How to Invest in Canada: Complete Beginner's Guide (2026)",
    date: "2026-04-02",
    category: "Beginners",
    readTime: "12 min",
    excerpt: "Step-by-step guide to investing in Canada for the first time: what accounts to open, which ETFs to buy, how much to start with, and the biggest mistakes to avoid.",
  },
  {
    slug: "best-hisa-canada-2026",
    title: "High-Interest Savings Accounts in Canada (2026)",
    date: "2026-04-02",
    category: "Savings",
    readTime: "8 min",
    excerpt: "Compare the top HISA rates in Canada for 2026 and learn where to park an emergency fund or short-term savings.",
  },
  {
    slug: "emergency-fund-canada",
    title: "How to Build an Emergency Fund in Canada (Step-by-Step)",
    date: "2026-04-02",
    category: "Savings",
    readTime: "7 min",
    excerpt: "How much you really need, where to keep it, and a practical step-by-step plan to build it.",
  },
  {
    slug: "pay-off-mortgage-faster-canada",
    title: "7 Ways to Pay Off Your Mortgage Faster in Canada",
    date: "2026-04-02",
    category: "Real Estate",
    readTime: "9 min",
    excerpt: "Practical strategies to shave years off your mortgage and save on interest without refinancing.",
  },
  {
    slug: "canada-child-benefit-2026",
    title: "Canada Child Benefit (CCB) 2026 - Amounts, Dates and How to Apply",
    date: "2026-04-02",
    category: "Tax",
    readTime: "8 min",
    excerpt: "Payment amounts, income thresholds, key dates, and how to apply for the Canada Child Benefit.",
  },
  {
    slug: "cpp-payment-dates-2026",
    title: "CPP Payment Dates 2026: Complete Schedule + Maximum Amounts",
    date: "2026-03-29",
    category: "Retirement",
    readTime: "7 min",
    excerpt: "All 12 CPP payment dates for 2026, maximum amounts, and collection timing choices.",
  },
  {
    slug: "oas-payment-dates-2026",
    title: "OAS Payment Dates 2026: Full Schedule, Amounts and Increases",
    date: "2026-03-29",
    category: "Retirement",
    readTime: "6 min",
    excerpt: "OAS payment schedule, current benefit amounts, GIS context, and clawback thresholds.",
  },
  {
    slug: "canadian-tax-brackets-2026",
    title: "Canadian Tax Brackets 2026: Federal and All Provincial Rates",
    date: "2026-03-29",
    category: "Tax",
    readTime: "8 min",
    excerpt: "Federal and provincial tax brackets, marginal vs effective rate, and key payroll assumptions.",
  },
  {
    slug: "rrsp-deadline-2026",
    title: "RRSP Deadline 2026: Contribution Deadline, Limits and Tax Refund Tips",
    date: "2026-03-29",
    category: "RRSP",
    readTime: "7 min",
    excerpt: "The RRSP contribution deadline, refund context, and last-minute contribution planning ideas.",
  },
  {
    slug: "best-gic-rates-canada-2026",
    title: "GIC Rates in Canada (March 2026)",
    date: "2026-03-29",
    category: "Savings",
    readTime: "7 min",
    excerpt: "Compare leading GIC rates, laddering ideas, and when a GIC may beat a savings ETF.",
  },
  {
    slug: "tfsa-vs-rrsp-2026",
    title: "TFSA vs RRSP: Which Is Better in 2026?",
    date: "2026-03-28",
    category: "TFSA & RRSP",
    readTime: "10 min",
    excerpt: "When to choose a TFSA, when an RRSP wins, and how to use both together.",
  },
  {
    slug: "how-much-tfsa-room-2026",
    title: "How Much TFSA Room Do I Have in 2026?",
    date: "2026-03-28",
    category: "TFSA",
    readTime: "6 min",
    excerpt: "Contribution limits, cumulative room context, and how to check your available TFSA space.",
  },
  {
    slug: "best-etfs-for-tfsa-canada-2026",
    title: "ETFs for Your TFSA in Canada (2026)",
    date: "2026-03-28",
    category: "Investing",
    readTime: "9 min",
    excerpt: "XEQT, VEQT, VDY, ZSP and more: common ETF choices for Canadian TFSA investors.",
  },
  {
    slug: "how-to-use-fhsa-canada",
    title: "How to Use the FHSA in Canada (2026 Guide)",
    date: "2026-03-28",
    category: "FHSA",
    readTime: "8 min",
    excerpt: "FHSA eligibility, contribution limits, tax treatment, and how it fits a first-home plan.",
  },
  {
    slug: "weekly-dividend-etfs",
    title: "What Are Weekly Dividend ETFs, and How Do They Work?",
    date: "2025-06-30",
    category: "Dividends",
    readTime: "8 min",
    excerpt: "How weekly dividend ETFs work, the tradeoffs involved, and who they may fit.",
  },
];

const hiddenFromArchiveSlugs = new Set([
  "tfsa-vs-rrsp-2026",
  "how-much-tfsa-room-2026",
  "rrsp-deadline-2026",
  "weekly-dividend-etfs",
]);

const categories = [
  "All",
  "Beginners",
  "Savings",
  "Real Estate",
  "Tax",
  "Retirement",
  "RRSP",
  "TFSA & RRSP",
  "TFSA",
  "FHSA",
  "Investing",
  "Dividends",
  "Budget",
];

const featuredComparisonSlugs = [
  // Commercial comparison pages are intentionally not promoted in the main archive.
  // They remain accessible for readers who search for them, but the blog should lead
  // with education-first decision content rather than high-intent provider pages.
];

const decisionTracks = [
  {
    title: "Choose the right registered account first",
    body: "Start with the TFSA vs RRSP hub when the next dollar could reasonably go into more than one account.",
    primaryHref: "/blog/tfsa-vs-rrsp-canada-2026",
    primaryLabel: "Compare TFSA vs RRSP",
    secondaryHref: "/tools/tfsa-calculator",
    secondaryLabel: "Open TFSA calculator",
  },
  {
    title: "Plan a first-home path with the FHSA",
    body: "Use the FHSA guide and calculator together when the home timeline is real and the deduction needs to be compared properly.",
    primaryHref: "/blog/fhsa-calculator-canada-2026",
    primaryLabel: "Read FHSA guide",
    secondaryHref: "/tools/fhsa-calculator",
    secondaryLabel: "Open FHSA calculator",
  },
  {
    title: "Build dividend income with realistic targets",
    body: "Use the dividend-income guide and calculator together so the income goal competes against the right account and ETF tradeoffs.",
    primaryHref: "/blog/500-month-dividend-canada",
    primaryLabel: "Read dividend guide",
    secondaryHref: "/tools/dividend-calculator",
    secondaryLabel: "Open dividend calculator",
  },
];

const mainStorySlug = "tfsa-contribution-room-calculator";
const secondaryFeatureSlugs = [
  "tfsa-investing-mistakes-canada",
  "covered-call-etfs-canada-explained",
  "how-to-choose-etfs-canada",
  "drip-strategy-canada",
];

const beginnerHubSlugs = [
  "how-to-start-investing-canada-2026",
  "tfsa-investing-mistakes-canada",
  "what-is-a-dividend-etf-canada",
  "drip-strategy-canada",
  "best-canadian-dividend-etfs-2026",
];

const popularTools = [
  { label: "TFSA Calculator", href: "/tools/tfsa-calculator", icon: "TFSA", body: "Model tax-free growth, room, and contribution scenarios." },
  { label: "RRSP Calculator", href: "/tools/rrsp-calculator", icon: "RRSP", body: "Estimate deduction value, refund impact, and retirement growth." },
  { label: "Dividend Calculator", href: "/tools/dividend-calculator", icon: "Div", body: "Estimate monthly income, yield, DRIP, and portfolio targets." },
  { label: "Mortgage Calculator", href: "/tools/mortgage-calculator", icon: "Home", body: "Estimate Canadian mortgage payments, CMHC, and affordability." },
  { label: "FHSA Calculator", href: "/tools/fhsa-calculator", icon: "FHSA", body: "Plan first-home tax savings, contributions, and growth." },
];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (hiddenFromArchiveSlugs.has(post.slug)) return false;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, search]);

  const featuredPosts = useMemo(
    () => filteredPosts.filter((post) => featuredComparisonSlugs.includes(post.slug)),
    [filteredPosts]
  );

  const regularPosts = useMemo(
    () => filteredPosts.filter((post) => !featuredComparisonSlugs.includes(post.slug)),
    [filteredPosts]
  );

  const mainStory = useMemo(
    () => posts.find((post) => post.slug === mainStorySlug) || posts[0],
    []
  );

  const secondaryFeatures = useMemo(
    () => secondaryFeatureSlugs
      .map((slug) => posts.find((post) => post.slug === slug))
      .filter(Boolean),
    []
  );

  const beginnerHubPosts = useMemo(
    () => beginnerHubSlugs
      .map((slug) => posts.find((post) => post.slug === slug))
      .filter(Boolean),
    []
  );

  const latestInvestingGuides = useMemo(
    () => posts
      .filter((post) => ["Investing", "Dividends", "TFSA", "Beginners"].includes(post.category))
      .slice(0, 10),
    []
  );

  return (
    <div className="min-h-screen">
      <SEO
        title="Canadian Financial Decision Guides"
        description="Read Canadian guides for TFSA, RRSP, FHSA, dividend income, ETFs, tax, mortgage, and account decisions before using the calculators."
        canonical="https://easyfinancetools.com/blog"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Guides and explainers
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">Canadian financial decision guides</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-100">
            Education-first Canadian finance guides for tax, savings, registered accounts, retirement, ETFs, and household planning decisions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          <ArticleImage
            slug={mainStory.slug}
            loading="eager"
            className="min-h-[300px] rounded-2xl shadow-lg lg:min-h-[420px]"
            imgClassName="aspect-[16/10] lg:aspect-auto"
          />
          <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gray-900 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold uppercase tracking-[0.14em] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Main story
              </span>
              <span className="font-semibold text-slate-400">{mainStory.category}</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-400">{mainStory.readTime}</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight text-primary dark:text-accent md:text-4xl">
              {mainStory.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              {mainStory.excerpt}
            </p>
            <SurfaceTrackedLink
              to={`/blog/${mainStory.slug}`}
              eventName="blog_index_cta_click"
              ctaLabel="main_story"
              trackingParams={{ section: "main_story", destination_type: "article", article_slug: mainStory.slug }}
              className="mt-6 inline-flex w-fit rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-secondary"
            >
              Read main story
            </SurfaceTrackedLink>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {secondaryFeatures.map((post) => (
            <SurfaceTrackedLink
              key={post.slug}
              to={`/blog/${post.slug}`}
              eventName="blog_index_cta_click"
              ctaLabel={`secondary_feature_${post.slug}`}
              trackingParams={{ section: "secondary_features", destination_type: "article", article_slug: post.slug }}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-lg dark:border-slate-800 dark:bg-gray-900"
            >
              <ArticleImage slug={post.slug} className="h-40" />
              <div className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold text-primary dark:bg-slate-800 dark:text-accent">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-base font-bold leading-snug text-primary group-hover:text-secondary dark:text-white">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{post.excerpt}</p>
              </div>
            </SurfaceTrackedLink>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-gray-900">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Popular tools</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the calculators after the guide</h2>
            </div>
            <SurfaceTrackedLink
              to="/tools"
              eventName="blog_index_cta_click"
              ctaLabel="popular_tools_all_tools"
              trackingParams={{ section: "popular_tools", destination_type: "tools_index" }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-primary hover:border-secondary hover:text-secondary dark:border-slate-700 dark:text-slate-100"
            >
              View all tools
            </SurfaceTrackedLink>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-5">
            {popularTools.map((tool) => (
              <SurfaceTrackedLink
                key={tool.href}
                to={tool.href}
                eventName="blog_index_cta_click"
                ctaLabel={`popular_tool_${tool.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                trackingParams={{ section: "popular_tools", destination_type: "tool" }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-secondary hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-gray-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xs font-black uppercase tracking-[0.08em] text-white">
                  {tool.icon}
                </div>
                <h3 className="mt-4 text-sm font-bold text-primary dark:text-accent">{tool.label}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{tool.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>

        <div className="surface-soft mb-6 p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use this blog</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Start with an original guide, then move into the matching calculator</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                These articles are written to explain Canadian-specific finance decisions in plain language, then send readers into the most relevant calculator or comparison page. That means the blog is not just a post archive. It is the explanatory layer that helps users understand TFSA, RRSP, tax, mortgage, savings, and investing decisions before relying on a number.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                { label: "Methodology and sources", href: "/methodology", cta: "blog_intro_methodology" },
                { label: "Editorial standards", href: "/editorial-standards", cta: "blog_intro_editorial_standards" },
                { label: "Investing guide archive", href: "/blog/investing", cta: "blog_intro_investing_archive" },
                { label: "About EasyFinanceTools", href: "/about", cta: "blog_intro_about" },
              ].map((item) => (
                <SurfaceTrackedLink
                  key={item.href}
                  to={item.href}
                  eventName="blog_index_cta_click"
                  ctaLabel={item.cta}
                  trackingParams={{ section: "blog_intro", destination_type: "trust_page" }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {item.label}
                </SurfaceTrackedLink>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-card mb-6 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Decision tracks</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the blog as a decision layer, not just a reading list</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {decisionTracks.map((track) => (
              <div key={track.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{track.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{track.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SurfaceTrackedLink
                    to={track.primaryHref}
                    eventName="blog_index_cta_click"
                    ctaLabel={track.primaryLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
                    trackingParams={{ section: "decision_tracks", destination_type: "article" }}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
                  >
                    {track.primaryLabel}
                  </SurfaceTrackedLink>
                  <SurfaceTrackedLink
                    to={track.secondaryHref}
                    eventName="blog_index_cta_click"
                    ctaLabel={track.secondaryLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
                    trackingParams={{ section: "decision_tracks", destination_type: "tool" }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-600 dark:text-slate-100"
                  >
                    {track.secondaryLabel}
                  </SurfaceTrackedLink>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="surface-card p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Latest investing guides</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Fresh Canadian investing explainers</h2>
              </div>
              <SurfaceTrackedLink
                to="/blog/investing"
                eventName="blog_index_cta_click"
                ctaLabel="latest_guides_investing_archive"
                trackingParams={{ section: "latest_investing_guides", destination_type: "category_page" }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-primary hover:border-secondary hover:text-secondary dark:border-slate-700 dark:text-slate-100"
              >
                Investing archive
              </SurfaceTrackedLink>
            </div>
            <div className="mt-5 space-y-4">
              {latestInvestingGuides.slice(0, 5).map((post) => (
                <SurfaceTrackedLink
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  eventName="blog_index_cta_click"
                  ctaLabel={`latest_investing_${post.slug}`}
                  trackingParams={{ section: "latest_investing_guides", destination_type: "article", article_slug: post.slug }}
                  className="group grid gap-4 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-gray-900 sm:grid-cols-[168px_minmax(0,1fr)]"
                >
                  <ArticleImage slug={post.slug} className="h-32 rounded-xl" />
                  <div className="min-w-0 py-1">
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="font-bold text-secondary">{post.category}</span>
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-primary group-hover:text-secondary dark:text-accent">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                  </div>
                </SurfaceTrackedLink>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="surface-soft p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Beginner investing hub</p>
              <h2 className="mt-2 text-xl font-bold text-primary dark:text-accent">Start here if investing still feels fuzzy</h2>
              <div className="mt-4 grid gap-3">
                {beginnerHubPosts.map((post) => (
                  <SurfaceTrackedLink
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    eventName="blog_index_cta_click"
                    ctaLabel={`beginner_hub_${post.slug}`}
                    trackingParams={{ section: "beginner_hub", destination_type: "article", article_slug: post.slug }}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {post.title}
                  </SurfaceTrackedLink>
                ))}
              </div>
            </section>

            <NewsletterSection
              compact
              eyebrow="Optional source updates"
              title="Follow calculator and rule changes."
              description="CRA limits, source updates, corrected assumptions, and major guide improvements. This area explains the update policy without asking for personal information."
            />

            <section className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Commercial-content boundary</p>
              <h2 className="mt-2 text-xl font-bold text-primary dark:text-accent">Provider pages are secondary</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Brokerage, app, and product-comparison pages should not be the main reading path. The archive leads with account, tax, risk, and planning explainers first.
              </p>
              <SurfaceTrackedLink
                to="/affiliate-disclosure"
                eventName="blog_index_cta_click"
                ctaLabel="commercial_boundary_affiliate_disclosure"
                trackingParams={{ section: "commercial_boundary", destination_type: "trust_page" }}
                className="mt-4 block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Read affiliate disclosure
              </SurfaceTrackedLink>
            </section>
          </aside>
        </div>

        <div className="surface-card p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="Search posts, topics, or calculators..."
              className="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="flex items-center rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-300">
              {filteredPosts.length} matching articles
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                activeCategory === category
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            {featuredPosts.length > 0 && (
              <div className="surface-soft p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Provider comparisons</p>
                    <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Commercial pages stay below the education layer</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      These pages are not the main archive priority. Use them only after the account, risk, and planning decision is clear.
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {featuredPosts.map((post) => (
                    <SurfaceTrackedLink
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      eventName="blog_index_cta_click"
                      ctaLabel={`featured_comparison_${post.slug}`}
                      trackingParams={{ section: "featured_comparisons", destination_type: "article", article_slug: post.slug }}
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                    >
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Comparison
                      </span>
                      <h3 className="mt-3 text-lg font-bold text-primary dark:text-accent">{post.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{post.excerpt}</p>
                      <span className="mt-4 inline-block text-sm font-semibold text-secondary">Open comparison</span>
                    </SurfaceTrackedLink>
                  ))}
                </div>
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="surface-card p-8 text-center text-slate-500 dark:text-slate-300">
                No blog posts matched that search yet.
              </div>
            ) : (
              regularPosts.map((post) => {
                const style = categoryStyle[post.category] || {
                  gradient: "from-blue-500 to-indigo-700",
                  icon: "Read",
                };

                return (
                  <SurfaceTrackedLink
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    eventName="blog_index_cta_click"
                    ctaLabel={`article_card_${post.slug}`}
                    trackingParams={{ section: "article_list", destination_type: "article", article_slug: post.slug }}
                    className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-lg dark:border-slate-700 dark:bg-gray-900"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <ArticleImage slug={post.slug} className="h-44 sm:h-auto sm:w-44 sm:flex-shrink-0" />
                      <div className="flex-1 p-5">
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className={`rounded-full bg-gradient-to-r ${style.gradient} px-2.5 py-0.5 font-semibold text-white`}>
                            {post.category}
                          </span>
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h2 className="text-xl font-bold leading-snug text-primary transition group-hover:text-secondary dark:text-white">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{post.excerpt}</p>
                        <span className="mt-4 inline-block text-sm font-semibold text-secondary">
                          Read article
                        </span>
                      </div>
                    </div>
                  </SurfaceTrackedLink>
                );
              })
            )}
          </div>

          <aside className="space-y-5">
            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Why these guides exist</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                The blog is meant to add context, examples, and Canadian-specific explanation around the calculators. Important pages should make it easier to understand a decision, not just click a button.
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  { label: "Read methodology", href: "/methodology", cta: "sidebar_trust_methodology" },
                  { label: "Read editorial standards", href: "/editorial-standards", cta: "sidebar_trust_editorial_standards" },
                ].map((item) => (
                  <SurfaceTrackedLink
                    key={item.href}
                    to={item.href}
                    eventName="blog_index_cta_click"
                    ctaLabel={item.cta}
                    trackingParams={{ section: "sidebar_trust", destination_type: "trust_page" }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {item.label}
                  </SurfaceTrackedLink>
                ))}
              </div>
            </div>

            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Start with account decisions</h3>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "TFSA vs RRSP", href: "/blog/tfsa-vs-rrsp-canada-2026" },
                  { label: "TFSA vs RRSP vs FHSA", href: "/blog/tfsa-vs-rrsp-vs-fhsa-canada" },
                  { label: "FHSA rules", href: "/blog/fhsa-rules-canada-2026" },
                  { label: "Dividend ETF income", href: "/blog/500-month-dividend-canada" },
                ].map((item) => (
                  <SurfaceTrackedLink
                    key={item.href}
                    to={item.href}
                    eventName="blog_index_cta_click"
                    ctaLabel={`sidebar_comparison_${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                    trackingParams={{ section: "sidebar_comparisons", destination_type: "article" }}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {item.label}
                  </SurfaceTrackedLink>
                ))}
              </div>
            </div>

            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Investing archive</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Browse TFSA, ETF, dividend, covered call, DRIP, and beginner investing guides as one organized category.
              </p>
              <SurfaceTrackedLink
                to="/blog/investing"
                eventName="blog_index_cta_click"
                ctaLabel="sidebar_investing_archive"
                trackingParams={{ section: "sidebar_investing_archive", destination_type: "category_page" }}
                className="mt-4 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-secondary"
              >
                Open investing guides
              </SurfaceTrackedLink>
            </div>

            <div className="surface-soft p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Popular topics</h3>
              <div className="mt-3 grid gap-2">
                {["Retirement", "Tax", "RRSP", "TFSA", "Savings", "Investing"].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setActiveCategory(topic)}
                    className="rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:text-secondary dark:bg-slate-900 dark:text-slate-200"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-lg font-bold text-primary dark:text-accent">Popular tools</h3>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "Income Tax Calculator", href: "/tools/income-tax-calculator" },
                  { label: "TFSA Calculator", href: "/tools/tfsa-calculator" },
                  { label: "RRSP Calculator", href: "/tools/rrsp-calculator" },
                  { label: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
                ].map((tool) => (
                  <SurfaceTrackedLink
                    key={tool.href}
                    to={tool.href}
                    eventName="blog_index_cta_click"
                    ctaLabel={`sidebar_tool_${tool.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                    trackingParams={{ section: "sidebar_tools", destination_type: "tool" }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {tool.label}
                  </SurfaceTrackedLink>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <TopicClusterMap title="Use the blog as a guided library" />
      </section>
    </div>
  );
}
