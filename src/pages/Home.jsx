import React from "react";
import SEO from "../components/SEO";
import CountUp from "../components/CountUp";
import FinancialTip from "../components/FinancialTip";
import SurfaceTrackedLink from "../components/SurfaceTrackedLink";

const tools = [
  { title: "Income Tax Calculator", desc: "Calculate federal + provincial tax, CPP, EI, and take-home pay for 2026.", link: "/tools/income-tax-calculator", badge: "Most Popular" },
  { title: "Compound Interest Calculator", desc: "Project long-term growth with monthly contributions, fee drag, and inflation.", link: "/tools/compound-interest-calculator", badge: "High Demand" },
  { title: "Pay Stub Calculator", desc: "See your estimated net pay per paycheque from salary or hourly income.", link: "/tools/net-pay-calculator", badge: "New" },
  { title: "TFSA Calculator", desc: "Model tax-free growth and estimate contribution-room context.", link: "/tools/tfsa-calculator", badge: null },
  { title: "GIC Calculator", desc: "Project maturity value and compare short-term guaranteed savings options.", link: "/tools/gic-calculator", badge: "New" },
  { title: "Debt Payoff Calculator", desc: "Compare avalanche vs snowball and see your path to debt-free.", link: "/tools/debt-payoff", badge: "New" },
  { title: "Savings Goal Calculator", desc: "Set a timeline and get the monthly amount needed to hit your target.", link: "/tools/savings-goal", badge: "New" },
  { title: "Mortgage Calculator", desc: "Estimate real Canadian mortgage payments, CMHC insurance, and closing costs.", link: "/tools/mortgage-calculator", badge: null },
  { title: "FIRE Calculator", desc: "Estimate your financial independence number and target retirement date.", link: "/tools/fire-calculator", badge: null },
  { title: "FHSA Calculator", desc: "Plan deductible contributions and tax-free home-buying withdrawals.", link: "/tools/fhsa-calculator", badge: null },
];

const recentPosts = [
  { slug: "cpp-payment-dates-2026", title: "CPP Payment Dates 2026", category: "Retirement" },
  { slug: "canadian-tax-brackets-2026", title: "Canadian Tax Brackets 2026", category: "Tax" },
  { slug: "rrsp-deadline-2026", title: "RRSP Deadline 2026", category: "RRSP" },
  { slug: "oas-payment-dates-2026", title: "OAS Payment Dates 2026", category: "Retirement" },
  { slug: "best-gic-rates-canada-2026", title: "Best GIC Rates Canada", category: "Savings" },
  { slug: "tfsa-vs-rrsp-2026", title: "TFSA vs RRSP: Which Is Better?", category: "TFSA and RRSP" },
];

const stats = [
  { to: 16, suffix: "+", label: "Free Tools" },
  { to: 100, suffix: "%", label: "Free Forever" },
  { to: 0, suffix: "", label: "Sign-ups Required" },
  { to: 2026, suffix: "", from: 2020, label: "Rates Updated" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Free Canadian Finance Calculators"
        description="Free Canadian finance calculators for TFSA, RRSP, income tax, mortgage, debt payoff, savings goals, and more. Privacy-first tools with methodology and 2026 updates."
        canonical="https://easyfinancetools.com/"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-20 text-white">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at top left, white 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <div className="absolute -right-16 top-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            <span className="rounded-full bg-white/15 px-4 py-1.5">Built for Canadians</span>
            <span className="rounded-full bg-white/15 px-4 py-1.5">No sign-up</span>
            <span className="rounded-full bg-white/15 px-4 py-1.5">Methodology shown</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">Free Canadian Finance Calculators</h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-blue-100 md:text-xl">
            Free calculators for TFSA, RRSP, income tax, mortgages, debt payoff, and savings goals. No sign-up. Clear assumptions. Fast results in your browser.
          </p>

        <div className="mx-auto mb-10 grid max-w-3xl gap-3 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur sm:grid-cols-[1fr_auto_auto]">
            <SurfaceTrackedLink
              to="/tools/compound-interest-calculator"
              eventName="homepage_cta_click"
              ctaLabel="hero_compound_interest_card"
              trackingParams={{ section: "hero", destination_type: "tool" }}
              className="rounded-2xl bg-white/10 px-4 py-4 text-left transition hover:bg-white/15"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">High-demand search</div>
              <div className="mt-1 text-lg font-bold">Compound Interest Calculator</div>
            </SurfaceTrackedLink>
            <SurfaceTrackedLink
              to="/tools/income-tax-calculator"
              eventName="homepage_cta_click"
              ctaLabel="hero_open_tax_calculator"
              trackingParams={{ section: "hero", destination_type: "tool" }}
              className="rounded-2xl bg-white px-6 py-4 text-lg font-bold text-primary transition hover:bg-blue-50"
            >
              Open tax calculator
            </SurfaceTrackedLink>
            <SurfaceTrackedLink
              to="/tools"
              eventName="homepage_cta_click"
              ctaLabel="hero_explore_tools"
              trackingParams={{ section: "hero", destination_type: "hub" }}
              className="rounded-2xl border border-white/30 px-6 py-4 text-lg font-bold text-white transition hover:bg-white/10"
            >
              Explore tools
            </SurfaceTrackedLink>
          </div>

          <div className="grid gap-3 text-left md:grid-cols-3">
            {[
              { title: "Search by decision", body: "Find tools by outcome, like tax, mortgage, debt, savings, or retirement." },
              { title: "Check assumptions fast", body: "Key pages link to methodology and sources so you can review the math." },
              { title: "Move to the next tool", body: "Start with one calculation, then compare the next account or planning path." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-blue-100">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-slate-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 py-6 md:grid-cols-4">
          {[
            { title: "No sign-up", body: "Open a calculator and get results immediately." },
            { title: "Privacy-first", body: "Inputs stay in your browser unless a feature says otherwise." },
            { title: "Methodology shown", body: "Important calculators explain assumptions and sources." },
            { title: "Updated for 2026", body: "Rates, limits, and dated guides are reviewed throughout the year." },
          ].map((item) => (
            <div key={item.title} className="surface-card p-4">
              <p className="font-semibold text-primary dark:text-accent">{item.title}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 py-8 text-center md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label}>
              <div className="text-3xl font-bold text-primary dark:text-accent">
                <CountUp to={item.to} from={item.from ?? 0} suffix={item.suffix} />
              </div>
              <div className="mt-1 text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-10">
        <FinancialTip />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-4 text-center text-3xl font-bold text-primary dark:text-accent">Our Free Calculators</h2>
        <p className="mb-12 text-center text-gray-500">Start with the answer you need, then move into the related guide or next tool.</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <SurfaceTrackedLink
              key={tool.title}
              to={tool.link}
              eventName="homepage_cta_click"
              ctaLabel={`calculator_card_${tool.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
              trackingParams={{ section: "calculator_grid", destination_type: "tool", tool_title: tool.title }}
              className="group surface-card border-2 p-6 transition-all hover:-translate-y-1 hover:border-secondary hover:shadow-xl"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:bg-slate-800 dark:text-secondary">
                  {tool.title.split(" ")[0]}
                </span>
                {tool.badge && <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">{tool.badge}</span>}
              </div>
              <h3 className="mb-2 text-xl font-bold text-primary transition group-hover:text-secondary dark:text-white">{tool.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
              <div className="mt-5 flex items-center justify-between text-sm font-semibold text-primary dark:text-secondary">
                <span>Open calculator</span>
                <span className="transition-transform group-hover:translate-x-1">More</span>
              </div>
            </SurfaceTrackedLink>
          ))}
        </div>
        <div className="mt-10 text-center">
          <SurfaceTrackedLink
            to="/tools"
            eventName="homepage_cta_click"
            ctaLabel="calculator_grid_view_all_tools"
            trackingParams={{ section: "calculator_grid", destination_type: "hub" }}
            className="inline-block rounded-xl border-2 border-primary px-8 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            View all tools
          </SurfaceTrackedLink>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Tax and paycheques", body: "Use these tools to estimate take-home pay, payroll deductions, and tax.", href: "/tools/income-tax-calculator" },
            { title: "Savings and compounding", body: "Compare compound growth across TFSA, RRSP, FHSA, and regular savings plans.", href: "/tools/compound-interest-calculator" },
            { title: "Borrowing and housing", body: "Model mortgage payments, rent-vs-buy tradeoffs, and debt payoff side by side.", href: "/tools/mortgage-calculator" },
          ].map((cluster) => (
            <SurfaceTrackedLink
              key={cluster.title}
              to={cluster.href}
              eventName="homepage_cta_click"
              ctaLabel={`cluster_card_${cluster.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
              trackingParams={{ section: "cluster_cards", destination_type: "tool" }}
              className="surface-card p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-primary dark:text-accent">{cluster.title}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{cluster.body}</p>
            </SurfaceTrackedLink>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-8">
        <div className="surface-soft p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:text-secondary">Original Canadian finance content</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the calculators with the guides, not as stand-alone formulas</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                EasyFinanceTools is built for practical Canadian money decisions. Use it to compare TFSA vs RRSP, check mortgage affordability, estimate take-home pay, and test savings tradeoffs. The strongest pages pair calculator results with plain-language guides, visible assumptions, and clear methodology.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 md:w-[340px] md:grid-cols-1">
              {[
                { label: "How we build calculators", href: "/methodology", cta: "editorial_intro_methodology" },
                { label: "Editorial standards", href: "/editorial-standards", cta: "editorial_intro_standards" },
                { label: "About EasyFinanceTools", href: "/about", cta: "editorial_intro_about" },
              ].map((item) => (
                <SurfaceTrackedLink
                  key={item.href}
                  to={item.href}
                  eventName="homepage_cta_click"
                  ctaLabel={item.cta}
                  trackingParams={{ section: "editorial_intro", destination_type: "trust_page" }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {item.label}
                </SurfaceTrackedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10">
        <div className="surface-soft p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Popular broker comparisons</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                If you are choosing where to open an account, start with the math first. Then use these comparison pages to pick the provider.
              </p>
            </div>
            <SurfaceTrackedLink
              to="/blog"
              eventName="homepage_cta_click"
              ctaLabel="broker_comparisons_view_all_articles"
              trackingParams={{ section: "broker_comparisons", destination_type: "hub" }}
              className="text-sm font-semibold text-primary underline dark:text-secondary"
            >
              Browse all guides
            </SurfaceTrackedLink>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Start with TFSA math",
                body: "Check contribution room and tax-free growth before comparing brokers.",
                href: "/tools/tfsa-calculator",
                cta: "comparison_module_tfsa_first",
              },
              {
                title: "Start with RRSP math",
                body: "Estimate the deduction and refund value before choosing an RRSP provider.",
                href: "/tools/rrsp-calculator",
                cta: "comparison_module_rrsp_first",
              },
              {
                title: "Start with compound growth",
                body: "Model the savings plan and fee drag first if you are still comparing platforms.",
                href: "/tools/compound-interest-calculator",
                cta: "comparison_module_compound_first",
              },
            ].map((item) => (
              <SurfaceTrackedLink
                key={item.title}
                to={item.href}
                eventName="homepage_cta_click"
                ctaLabel={item.cta}
                trackingParams={{ section: "broker_comparisons_decision_paths", destination_type: "tool" }}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:text-secondary">Calculator-first path</p>
                <p className="mt-2 font-semibold text-primary dark:text-accent">{item.title}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Wealthsimple vs Questrade", href: "/blog/wealthsimple-vs-questrade-canada", note: "Beginner vs DIY investing" },
              { title: "Best TFSA Brokers", href: "/blog/best-tfsa-brokers-canada", note: "Best fit for registered investing" },
              { title: "Best RRSP Accounts", href: "/blog/best-rrsp-accounts-canada", note: "Compare deduction-focused account options" },
              { title: "Best Investing Apps", href: "/blog/best-investing-apps-canada", note: "Simple shortlist for Canadians" },
            ].map((item) => (
              <SurfaceTrackedLink
                key={item.title}
                to={item.href}
                eventName="homepage_cta_click"
                ctaLabel={`broker_comparison_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                trackingParams={{ section: "broker_comparisons", destination_type: "article" }}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="font-semibold text-primary dark:text-accent">{item.title}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.note}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="surface-soft p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary dark:text-accent">Popular calculator searches</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Start with the pages people usually need first, then move into related comparisons.
              </p>
            </div>
            <SurfaceTrackedLink
              to="/tools"
              eventName="homepage_cta_click"
              ctaLabel="popular_searches_browse_all"
              trackingParams={{ section: "popular_searches", destination_type: "hub" }}
              className="text-sm font-semibold text-primary underline dark:text-secondary"
            >
              Browse all calculators
            </SurfaceTrackedLink>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Compound Interest Calculator", href: "/tools/compound-interest-calculator" },
              { title: "Income Tax Calculator", href: "/tools/income-tax-calculator" },
              { title: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
              { title: "TFSA Calculator", href: "/tools/tfsa-calculator" },
            ].map((item) => (
              <SurfaceTrackedLink
                key={item.title}
                to={item.href}
                eventName="homepage_cta_click"
                ctaLabel={`popular_search_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                trackingParams={{ section: "popular_searches", destination_type: "tool" }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {item.title}
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "What makes a useful calculator page",
              body: "The best tool pages explain the assumptions, show the limits, and point you to the next question to solve.",
              href: "/methodology",
              cta: "quality_card_methodology",
            },
            {
              title: "How our articles are written",
              body: "We publish Canadian explainers, comparison pages, and calculator guides with clear dates and editorial standards.",
              href: "/editorial-standards",
              cta: "quality_card_editorial_standards",
            },
            {
              title: "Why trust still matters in finance content",
              body: "For tax, investing, and borrowing topics, the site is designed to make assumptions and tradeoffs easier to inspect.",
              href: "/about",
              cta: "quality_card_about",
            },
          ].map((item) => (
            <SurfaceTrackedLink
              key={item.title}
              to={item.href}
              eventName="homepage_cta_click"
              ctaLabel={item.cta}
              trackingParams={{ section: "quality_cards", destination_type: "trust_page" }}
              className="surface-card p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
            </SurfaceTrackedLink>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-primary dark:text-accent">Latest Articles</h2>
          <SurfaceTrackedLink
            to="/blog"
            eventName="homepage_cta_click"
            ctaLabel="latest_articles_view_all"
            trackingParams={{ section: "latest_articles", destination_type: "hub" }}
            className="text-sm font-semibold text-primary underline dark:text-secondary"
          >
            View all articles
          </SurfaceTrackedLink>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <SurfaceTrackedLink
              key={post.slug}
              to={`/blog/${post.slug}`}
              eventName="homepage_cta_click"
              ctaLabel={`latest_article_${post.slug}`}
              trackingParams={{ section: "latest_articles", destination_type: "article", article_slug: post.slug }}
              className="group block rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-secondary hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {post.category}
              </span>
              <h3 className="mb-2 mt-3 font-bold leading-snug text-gray-800 transition group-hover:text-secondary dark:text-white">{post.title}</h3>
              <span className="text-xs font-semibold text-primary dark:text-secondary">Read article</span>
            </SurfaceTrackedLink>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-12 text-3xl font-bold text-primary dark:text-accent">Why EasyFinanceTools?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: "Private", title: "100% Private", desc: "We do not store your financial inputs. Everything runs in your browser unless a feature says otherwise." },
              { icon: "Clear", title: "Clear methodology", desc: "Key calculators show assumptions, update dates, and source links so you can check the output." },
              { icon: "Canada", title: "Made for Canada", desc: "Built around Canadian tax brackets, account limits, and local planning questions." },
            ].map((item) => (
              <div key={item.title} className="surface-card p-6">
                <div className="mb-4 text-lg font-semibold text-primary dark:text-accent">{item.icon}</div>
                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-4 py-16 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">Ready to Take Control of Your Finances?</h2>
        <p className="mb-8 text-blue-100">Start with the TFSA calculator, then compare it with RRSP and tax tools once you have a baseline.</p>
        <SurfaceTrackedLink
          to="/tools/tfsa-calculator"
          eventName="homepage_cta_click"
          ctaLabel="final_cta_open_tfsa_calculator"
          trackingParams={{ section: "final_cta", destination_type: "tool" }}
          className="inline-block rounded-xl bg-accent px-10 py-4 text-lg font-bold text-primary transition hover:bg-yellow-400"
        >
          Open TFSA calculator
        </SurfaceTrackedLink>
      </section>
    </div>
  );
}
