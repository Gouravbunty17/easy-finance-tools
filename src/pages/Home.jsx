import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SurfaceTrackedLink from '../components/SurfaceTrackedLink';
import FAQSchema from '../components/FAQSchema';
import ProgressiveDisclosure from '../components/ProgressiveDisclosure';
import DecisionFramework from '../components/DecisionFramework';
import TrustStrip from '../components/TrustStrip';
import AffiliateDisclosureBox from '../components/AffiliateDisclosureBox';
import PageDisclaimer from '../components/PageDisclaimer';

function IconBase({ children, className = '', ...props }) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

function ArrowRightIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

function BanknotesIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 9.5v5M17.5 9.5v5" />
    </IconBase>
  );
}

function BuildingLibraryIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 10h16" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
      <path d="M3 20h18" />
      <path d="m12 4 8 4H4l8-4Z" />
    </IconBase>
  );
}

function ChartBarIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-6" />
    </IconBase>
  );
}

function HomeModernIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m4 11 8-7 8 7" />
      <path d="M6 10.5V20h12v-9.5" />
      <path d="M10 20v-5h4v5" />
    </IconBase>
  );
}

function ScaleIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 4v16" />
      <path d="M6 7h12" />
      <path d="m6 7-3 6h6L6 7Z" />
      <path d="m18 7-3 6h6l-3-6Z" />
      <path d="M9 20h6" />
    </IconBase>
  );
}

function ShieldCheckIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </IconBase>
  );
}

const GOAL_ROUTES = [
  {
    title: 'Pay less tax',
    body: 'Compare RRSP deductions, TFSA flexibility, FHSA eligibility, and income-tax assumptions before choosing where the next dollar goes.',
    href: '/tools/account-decision-tool',
    ctaLabel: 'goal_pay_less_tax',
    icon: BanknotesIcon,
  },
  {
    title: 'Buy a first home',
    body: 'Start with FHSA tradeoffs, then pressure-test affordability and mortgage payments before stretching the purchase.',
    href: '/tools/fhsa-calculator',
    ctaLabel: 'goal_first_home',
    icon: HomeModernIcon,
  },
  {
    title: 'Build dividend income',
    body: 'Turn yield into monthly income, capital needed, DRIP effects, and account-location questions.',
    href: '/tools/dividend-calculator',
    ctaLabel: 'goal_dividend_income',
    icon: ChartBarIcon,
  },
  {
    title: 'Plan retirement',
    body: 'Model long-term contributions, inflation, withdrawals, and retirement timing without pretending the future is exact.',
    href: '/tools/fire-calculator',
    ctaLabel: 'goal_retirement',
    icon: BuildingLibraryIcon,
  },
  {
    title: 'Compare TFSA vs RRSP vs FHSA',
    body: 'Use a guided account-priority framework when more than one registered account could make sense.',
    href: '/tools/account-decision-tool',
    ctaLabel: 'goal_account_comparison',
    icon: ScaleIcon,
  },
  {
    title: 'Estimate mortgage affordability',
    body: 'Check income, debt ratios, stress-test pressure, and monthly payment reality before comparing lenders.',
    href: '/tools/mortgage-affordability-calculator',
    ctaLabel: 'goal_mortgage_affordability',
    icon: HomeModernIcon,
  },
];

const FEATURED_TOOLS = [
  {
    title: 'Account Decision Tool',
    body: 'Route TFSA, RRSP, and FHSA decisions by goal, income, timeline, and flexibility.',
    href: '/tools/account-decision-tool',
    badge: 'Start here',
    ctaLabel: 'featured_account_decision',
  },
  {
    title: 'TFSA Calculator',
    body: 'Estimate room, growth, withdrawals, and how TFSA flexibility compares with other accounts.',
    href: '/tools/tfsa-calculator',
    badge: 'Core tool',
    ctaLabel: 'featured_tfsa',
  },
  {
    title: 'RRSP Calculator',
    body: 'Model deduction value, refund assumptions, and retirement-account tradeoffs.',
    href: '/tools/rrsp-calculator',
    badge: 'Tax planning',
    ctaLabel: 'featured_rrsp',
  },
  {
    title: 'FHSA Calculator',
    body: 'Compare first-home tax savings, room usage, and down-payment timeline assumptions.',
    href: '/tools/fhsa-calculator',
    badge: 'First home',
    ctaLabel: 'featured_fhsa',
  },
  {
    title: 'Dividend Calculator',
    body: 'Test income goals, yield sensitivity, DRIP, and account-fit questions.',
    href: '/tools/dividend-calculator',
    badge: 'Income',
    ctaLabel: 'featured_dividend',
  },
  {
    title: 'Mortgage Calculator',
    body: 'Estimate payments, amortization pressure, and borrowing tradeoffs with Canadian context.',
    href: '/tools/mortgage-calculator',
    badge: 'Housing',
    ctaLabel: 'featured_mortgage',
  },
  {
    title: 'AI Cost Calculator',
    body: 'Estimate AI API cost, agent loops, RAG usage, CAD planning, and margin pressure before pricing an AI workflow.',
    href: '/tools/ai-cost-calculator',
    badge: 'AI planning',
    ctaLabel: 'featured_ai_cost',
  },
];

const QUICK_START_TOOLS = [
  { title: 'Income tax', detail: '2026 tax by province', href: '/tools/income-tax-calculator', ctaLabel: 'quick_income_tax' },
  { title: 'TFSA', detail: 'Contribution room and growth', href: '/tools/tfsa-calculator', ctaLabel: 'quick_tfsa' },
  { title: 'Mortgage', detail: 'Payments and rate scenarios', href: '/tools/mortgage-calculator', ctaLabel: 'quick_mortgage' },
];

const GUIDE_HIGHLIGHTS = [
  {
    title: 'TFSA vs RRSP vs FHSA',
    body: 'The core Canadian account tradeoff explained without product-first framing.',
    href: '/blog/tfsa-vs-rrsp-vs-fhsa-canada',
    ctaLabel: 'guide_tfsa_rrsp_fhsa',
  },
  {
    title: 'TFSA contribution room',
    body: 'Contribution limits, withdrawal timing, and common CRA room mistakes.',
    href: '/blog/tfsa-contribution-room-canada-2026',
    ctaLabel: 'guide_tfsa_room',
  },
  {
    title: 'Covered call ETFs explained',
    body: 'Why high monthly income can hide total-return and NAV tradeoffs.',
    href: '/blog/covered-call-etfs-canada-explained',
    ctaLabel: 'guide_covered_calls',
  },
  {
    title: 'How to choose ETFs in Canada',
    body: 'A practical checklist for fees, allocation, currency, and risk.',
    href: '/blog/how-to-choose-etfs-canada',
    ctaLabel: 'guide_choose_etfs',
  },
];

const HOME_FAQS = [
  {
    q: 'What is EasyFinanceTools for?',
    a: 'EasyFinanceTools helps Canadians compare common financial planning decisions using educational calculators, decision frameworks, and source-linked guides.',
  },
  {
    q: 'Are the calculators financial advice?',
    a: 'No. The tools are educational planning aids. They simplify assumptions and should be checked against official sources or a qualified professional before acting.',
  },
  {
    q: 'Where should I start?',
    a: 'Start with your goal. If the account choice is unclear, use the Account Decision Tool before opening a calculator.',
  },
  {
    q: 'Do I need to sign up?',
    a: 'No. The core calculators and frameworks are available without an email signup.',
  },
];

function SectionHeader({ eyebrow, title, body }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold leading-tight text-primary dark:text-accent md:text-4xl">{title}</h2>
      {body ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p> : null}
    </div>
  );
}

function HomepageAccountFramework() {
  return (
    <section className="border-b border-slate-100 bg-white px-4 py-16 dark:border-slate-800 dark:bg-gray-950 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Evergreen homepage account-framework content. Review every 6–12 months against current CRA and cross-border tax rules. */}
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Canadian investing account framework</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-primary dark:text-accent md:text-4xl">
            How to think about Canadian investing accounts
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-slate-700 dark:text-slate-300">
            <p>
              Most Canadian investing questions are not really about investments. They are about accounts. Before anyone should compare ETFs or debate dividend stocks, there is an earlier decision that matters more: which account the money goes into. The same $10,000 can grow tax-free, tax-deferred, or fully taxed depending entirely on whether it sits in a TFSA, an RRSP, an FHSA, or a regular non-registered account. Getting that choice right is usually worth more than picking a slightly better fund.
            </p>
            <p>
              The problem is that most information about these accounts comes from institutions that sell them. A bank&apos;s TFSA page will explain what a TFSA is, but it will rarely explain that U.S. dividend-paying investments can be less tax-efficient in a TFSA because of unrecoverable U.S. withholding tax on dividends. An RRSP page will promote the tax deduction without dwelling on the repayment obligations of the Home Buyers&apos; Plan, or what withdrawals do to your taxable income in retirement. The information is accurate but incomplete, because the institution&apos;s goal is an opened account, not necessarily the right one.
            </p>
            <p>
              This site exists to handle that earlier decision honestly. Every calculator and guide here is built around the same question: given your situation, which account should this money go into, and what are the tradeoffs you are accepting?
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="max-w-4xl space-y-10">
            <section aria-labelledby="account-version-heading">
              <h3 id="account-version-heading" className="text-2xl font-bold text-primary dark:text-accent">The one-paragraph version of each account</h3>
              <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
                A TFSA shelters growth and withdrawals from Canadian tax, making it the default choice for many people&apos;s first investing dollars, with the important limitation that U.S. dividend income may still be subject to unrecoverable U.S. withholding tax. The <Link to="/tools/tfsa-calculator" className="font-semibold text-primary underline underline-offset-4 dark:text-emerald-300">TFSA calculator</Link> can help test room, withdrawals, and growth assumptions. An RRSP gives you a tax deduction now in exchange for taxable withdrawals later, which generally makes it more valuable when your marginal tax rate at contribution is higher than it will be when the money is withdrawn. An FHSA combines a contribution deduction with tax-free qualifying withdrawals for a first home purchase, making it especially valuable for eligible people who realistically expect to buy a home. A non-registered account has no comparable tax shelter, but it also has fewer contribution and withdrawal restrictions, and usually becomes more relevant after registered-account room has been used.
              </p>
            </section>

            <section aria-labelledby="account-order-heading">
              <h3 id="account-order-heading" className="text-2xl font-bold text-primary dark:text-accent">The order most people should think in</h3>
              <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
                For many eligible first-time home buyers, a useful starting framework is FHSA first, TFSA second, RRSP third, because FHSA room is limited, the TFSA remains flexible for other goals, and the value of an RRSP deduction depends heavily on the contributor&apos;s current and future tax rates. The <Link to="/tools/fhsa-calculator" className="font-semibold text-primary underline underline-offset-4 dark:text-emerald-300">FHSA calculator</Link> helps test the first-home side of that decision. For someone who already owns a home, the framework often begins with a TFSA and then adds RRSP contributions when the available tax deduction becomes sufficiently valuable. These are starting points, not universal rules; the <Link to="/blog/tfsa-vs-rrsp-vs-fhsa-canada" className="font-semibold text-primary underline underline-offset-4 dark:text-emerald-300">TFSA vs RRSP vs FHSA guide</Link> explains how the order can change.
              </p>
            </section>

            <section aria-labelledby="calculator-difference-heading">
              <h3 id="calculator-difference-heading" className="text-2xl font-bold text-primary dark:text-accent">What the calculators here do differently</h3>
              <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
                Every tool on this site is built for Canadian rules specifically: CRA contribution limits, federal and provincial tax brackets, withholding-tax treatment, and program details such as Home Buyers&apos; Plan repayment requirements. The results are educational estimates, not financial advice, and each calculator explains its assumptions and links to the official source material it relies on, so users can verify the rules rather than simply take the result at face value. If the account order is still unclear, start with the <Link to="/tools/account-decision-tool" className="font-semibold text-primary underline underline-offset-4 dark:text-emerald-300">Account Decision Tool</Link>.
              </p>
            </section>

            <aside className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-950 dark:border-emerald-800/70 dark:bg-emerald-950/20 dark:text-emerald-100" aria-label="Our approach">
              <p className="font-bold text-primary dark:text-accent">Our approach</p>
              <p className="mt-2">
                Every tool on EasyFinanceTools follows the same four-step framework: Tradeoff → Calculation → Context → Action. The goal is not simply to produce a number; it is to help users understand what that number means and how it fits into a financial decision.
              </p>
            </aside>

            <section aria-labelledby="founder-skepticism-heading">
              <h3 id="founder-skepticism-heading" className="text-2xl font-bold text-primary dark:text-accent">Who runs this, and why you should be skeptical</h3>
              <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
                EasyFinanceTools is independently built and maintained by Gourav Kumar, a programmer based in the Greater Toronto Area (GTA), Canada, with a strong interest in investing and financial education. Gourav is not a licensed financial advisor, accountant, or tax professional. It is not owned by a bank, brokerage, or investment fund. That independence is the point: the site does not earn a commission merely because one registered account is presented as more suitable than another. But it also means users should treat every calculator and guide as a framework to verify, not a final answer. Where the site earns referral fees, those relationships are clearly disclosed and should not change the account or strategy conclusions presented. For decisions involving significant money, users should consider consulting a qualified professional who can assess their complete circumstances.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
                If you&apos;re ready to apply these ideas, start with the calculator that matches your decision.
              </p>
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Decision-first, not product-first</p>
            <p className="mt-3">
              Account choice affects taxes, flexibility, withdrawal timing, and what official rules need to be checked before the investment itself becomes the main question.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <SEO
        title="Canadian Financial Decision Tools | EasyFinanceTools"
        description="Make better Canadian money decisions with free TFSA, RRSP, FHSA, dividend, mortgage, retirement, and account decision tools. No login required."
        canonical="https://easyfinancetools.com/"
      />
      <FAQSchema faqs={HOME_FAQS} />

      <section className="hero-home relative overflow-hidden bg-slate-950 px-4 py-16 text-white md:py-24">
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
              Canadian decision-support platform
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Make better Canadian money decisions
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
              Free Canadian calculators, account guides, and decision tools for TFSA, RRSP, FHSA, dividends, mortgages, and retirement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#start-with-goal"
                className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-bold text-primary transition hover:bg-emerald-50"
              >
                Start with your goal
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <SurfaceTrackedLink
                to="/tools"
                eventName="homepage_cta_click"
                ctaLabel="hero_browse_all_tools"
                trackingParams={{ section: 'hero', destination_type: 'hub' }}
                className="focus-ring rounded-xl border border-white/25 px-5 py-3 text-base font-bold text-white transition hover:bg-white/10"
              >
                Browse all tools
              </SurfaceTrackedLink>
            </div>
          </div>
          <div className="mt-8 max-w-5xl" aria-label="Popular calculators">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-emerald-200">Jump straight into a calculator</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {QUICK_START_TOOLS.map((tool) => (
                <SurfaceTrackedLink key={tool.href} to={tool.href}
                  eventName="homepage_quick_start_click" ctaLabel={tool.ctaLabel}
                  trackingParams={{ section: 'hero_quick_start', destination_type: 'tool' }}
                  className="focus-ring group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white transition hover:bg-white/20">
                  <span><span className="block font-bold">{tool.title}</span><span className="mt-1 block text-xs text-blue-100">{tool.detail}</span></span>
                  <ArrowRightIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                </SurfaceTrackedLink>
              ))}
            </div>
          </div>
          <TrustStrip className="mt-8 max-w-5xl bg-white/95 text-slate-900 dark:bg-slate-900/90" />
        </div>
      </section>

      <section id="start-with-goal" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeader
          eyebrow="Start with the decision"
          title="Choose the goal that matches the money question"
          body="The fastest path is usually not another generic calculator. Start with the decision, then open the tool or guide that tests the next assumption."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {GOAL_ROUTES.map((goal) => {
            const Icon = goal.icon;
            return (
              <SurfaceTrackedLink
                key={goal.title}
                to={goal.href}
                eventName="homepage_goal_router_click"
                ctaLabel={goal.ctaLabel}
                trackingParams={{ section: 'goal_router', destination_type: goal.href.startsWith('/blog') ? 'article' : 'tool' }}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800 dark:bg-gray-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-primary dark:text-accent">{goal.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{goal.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary dark:text-emerald-300">
                  Open path
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </SurfaceTrackedLink>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 px-4 py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Featured tools"
            title="The core Canadian planning tools"
            body="These are the main tools that support the platform: accounts, tax, home buying, dividend income, retirement, and mortgage planning."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_TOOLS.map((tool) => (
              <SurfaceTrackedLink
                key={tool.title}
                to={tool.href}
                eventName="homepage_featured_tool_click"
                ctaLabel={tool.ctaLabel}
                trackingParams={{ section: 'featured_tools', destination_type: 'tool' }}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-secondary hover:shadow-lg dark:border-slate-700 dark:bg-gray-900"
              >
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-secondary dark:bg-slate-800 dark:text-emerald-300">
                  {tool.badge}
                </span>
                <h3 className="mt-4 text-xl font-bold text-primary dark:text-accent">{tool.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{tool.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary dark:text-emerald-300">
                  Open tool
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <HomepageAccountFramework />

      <div className="mx-auto max-w-6xl px-4 py-8"><PageDisclaimer /></div>
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <AffiliateDisclosureBox title="Editorial independence and future partnerships"
          body="If verified paid referral partnerships are added, links will be clearly disclosed. No paid referral offer is currently featured here; educational tool ordering and assumptions do not depend on commissions.">
          <SurfaceTrackedLink to="/affiliate-disclosure" eventName="homepage_trust_click"
            ctaLabel="affiliate_disclosure" trackingParams={{section:'partner_transparency',destination_type:'page'}}
            className="inline-flex min-h-11 items-center rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-bold text-primary dark:bg-slate-900 dark:text-amber-100">
            How partnerships are disclosed
          </SurfaceTrackedLink>
        </AffiliateDisclosureBox>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <DecisionFramework />
      </section>

      <section className="border-y border-slate-100 bg-white px-4 py-16 dark:border-slate-800 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Popular Canadian guides"
            title="Read the context before the product comparison"
            body="These guides support the calculators with Canadian rules, mistakes, and tradeoffs that can change a result."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {GUIDE_HIGHLIGHTS.map((guide) => (
              <SurfaceTrackedLink
                key={guide.href}
                to={guide.href}
                eventName="homepage_guide_click"
                ctaLabel={guide.ctaLabel}
                trackingParams={{ section: 'guide_highlights', destination_type: 'article' }}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-secondary hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-gray-900"
              >
                <h3 className="text-lg font-bold text-primary dark:text-accent">{guide.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{guide.body}</p>
              </SurfaceTrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-900">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="mt-1 h-6 w-6 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Methodology and trust</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Quietly transparent, not overexplained</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Core tools are educational estimates with visible assumptions, privacy-aware calculation patterns, and official-source references where Canadian rules matter.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <SurfaceTrackedLink to="/methodology" eventName="homepage_trust_click" ctaLabel="methodology" trackingParams={{ section: 'trust' }} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary">
                  Read methodology
                </SurfaceTrackedLink>
                <SurfaceTrackedLink to="/editorial-standards" eventName="homepage_trust_click" ctaLabel="editorial_standards" trackingParams={{ section: 'trust' }} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:text-accent">
                  Editorial standards
                </SurfaceTrackedLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Next step</p>
            <h2 className="mt-2 text-3xl font-bold">Start with one decision, not every calculator.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-blue-100">
              Pick the goal that matches your situation, then use the next tool only when it clarifies the tradeoff.
            </p>
          </div>
          <a href="#start-with-goal" className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-emerald-50">
            Start with your goal
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <ProgressiveDisclosure
          eyebrow="FAQ"
          title="Common questions"
          summary="Helpful details are available without making the homepage feel like a long finance manual."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {HOME_FAQS.map((item) => (
              <article key={item.q} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <h3 className="font-bold text-primary dark:text-accent">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.a}</p>
              </article>
            ))}
          </div>
        </ProgressiveDisclosure>
      </section>
    </main>
  );
}
