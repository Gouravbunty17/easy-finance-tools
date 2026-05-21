import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import ArticleSchema from "../../components/ArticleSchema";
import FAQSchema from "../../components/FAQSchema";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";
import ContributorReviewBox from "../../components/ContributorReviewBox";
import SourceVerificationBlock from "../../components/SourceVerificationBlock";
import RelatedContent from "../../components/RelatedContent";
import YouTubeSupportSection from "../../components/YouTubeSupportSection";
import EducationalDisclaimer from "../../components/EducationalDisclaimer";
import { REGISTERED_ACCOUNT_LIMITS, TFSA_ANNUAL_LIMITS, getTfsaAccruedRoom } from "../../config/financial";
import { tfsaOfficialSources } from "../../config/officialSources";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const canonical = "https://easyfinancetools.com/blog/tfsa-contribution-room-calculator";
const pageTitle = "TFSA Contribution Room Calculator: Check Your 2026 Limit + Carryforward";
const metaDescription = "Estimate TFSA contribution room for 2026, carryforward, withdrawals, and overcontribution risk, then verify against CRA My Account and your own records.";

const faqs = [
  {
    q: "What is the TFSA contribution limit for 2026?",
    a: "The 2026 TFSA annual dollar limit is $7,000. Your available room may be higher or lower because unused room carries forward and prior-year withdrawals can be added back.",
  },
  {
    q: "Is this calculator the same as CRA My Account?",
    a: "No. This calculator is an educational estimate. CRA My Account and your own financial-institution records should be used to verify official contribution room before contributing.",
  },
  {
    q: "Do TFSA withdrawals create room right away?",
    a: "Usually no. Withdrawals are generally added back to contribution room on January 1 of the following calendar year, not immediately.",
  },
  {
    q: "What happens if I overcontribute to a TFSA?",
    a: "Excess TFSA amounts can be subject to a 1% tax per month while the excess remains. Check CRA guidance and correct mistakes promptly.",
  },
  {
    q: "Does investment growth create more TFSA room?",
    a: "No. Investment growth inside a TFSA is generally tax-free, but it does not create additional contribution room unless money is later withdrawn and added back the following year.",
  },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
}

function InputField({ label, value, onChange, help }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(parseNumericInput(event.target.value, { integer: true }))}
        inputMode="numeric"
        className="focus-ring mt-2 min-h-[48px] w-full rounded-xl border-2 border-slate-200 px-4 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
      {help ? <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{help}</p> : null}
    </div>
  );
}

function FlagshipRoomCalculator() {
  const [birthYear, setBirthYear] = useState("1992");
  const [residentSince, setResidentSince] = useState("2010");
  const [totalContributions, setTotalContributions] = useState("42000");
  const [priorWithdrawals, setPriorWithdrawals] = useState("5000");
  const [currentYearContributions, setCurrentYearContributions] = useState("0");

  const result = useMemo(() => {
    const eligibleYear = Math.max(2009, asNumber(birthYear) + 18, asNumber(residentSince));
    const accruedRoom = getTfsaAccruedRoom(eligibleYear);
    const usedRoom = Math.max(0, asNumber(totalContributions) - asNumber(priorWithdrawals) + asNumber(currentYearContributions));
    const estimatedRoom = Math.max(0, accruedRoom - usedRoom);
    const excess = Math.max(0, usedRoom - accruedRoom);
    const penaltyEstimate = excess * 0.01;
    return { eligibleYear, accruedRoom, usedRoom, estimatedRoom, excess, penaltyEstimate };
  }, [birthYear, currentYearContributions, priorWithdrawals, residentSince, totalContributions]);

  return (
    <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Estimate your room</p>
      <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">TFSA contribution room calculator</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-300">
        Use this as a planning estimate before contributing. It does not replace CRA My Account, broker statements, or a personal transaction log.
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Birth year" value={birthYear} onChange={setBirthYear} help="TFSA room starts when you are 18 and resident in Canada." />
          <InputField label="Resident in Canada since" value={residentSince} onChange={setResidentSince} help="New residents should not use full lifetime room." />
          <InputField label="Lifetime TFSA contributions" value={totalContributions} onChange={setTotalContributions} help="Across every TFSA account combined." />
          <InputField label="Withdrawals before 2026" value={priorWithdrawals} onChange={setPriorWithdrawals} help="Withdrawals from prior calendar years are generally restored." />
          <InputField label="2026 contributions already made" value={currentYearContributions} onChange={setCurrentYearContributions} help="Current-year deposits reduce room immediately." />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Estimated available room</p>
          <p className="mt-2 text-4xl font-black text-primary dark:text-accent">{formatCurrency(result.estimatedRoom)}</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt>Eligible from</dt><dd className="font-bold">{result.eligibleYear}</dd></div>
            <div className="flex justify-between gap-4"><dt>Accrued room</dt><dd className="font-bold">{formatCurrency(result.accruedRoom)}</dd></div>
            <div className="flex justify-between gap-4"><dt>Used room estimate</dt><dd className="font-bold">{formatCurrency(result.usedRoom)}</dd></div>
            <div className="flex justify-between gap-4"><dt>Possible excess</dt><dd className="font-bold text-amber-700 dark:text-amber-300">{formatCurrency(result.excess)}</dd></div>
          </dl>
          {result.excess > 0 ? (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              This estimate shows a possible excess. CRA can assess a 1% monthly tax on excess TFSA amounts while they remain in the account.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Section({ title, children }) {
  return (
    <section className="scroll-mt-24">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function TFSAContributionRoomCalculatorPage() {
  return (
    <main className="bg-white dark:bg-gray-950">
      <SEO
        title="TFSA Contribution Room Calculator (2026 CRA Limits + Carryforward)"
        description={metaDescription}
        canonical={canonical}
        type="article"
      />
      <ArticleSchema
        headline={pageTitle}
        description={metaDescription}
        url={canonical}
        datePublished="2026-05-20"
        dateModified="2026-05-20"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://easyfinancetools.com/" },
          { name: "Blog", item: "https://easyfinancetools.com/blog" },
          { name: pageTitle, item: canonical },
        ]}
      />

      <section className="border-b bg-slate-50 px-4 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">TFSA room Canada</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-primary dark:text-accent md:text-6xl">
            TFSA Contribution Room Calculator: Check Your 2026 Limit + Carryforward
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Estimate your TFSA room using the 2026 annual limit, carryforward, withdrawals, and current-year contributions, then learn what could make the estimate differ from CRA My Account.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-800">Last updated May 20, 2026</span>
            <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-800">Verified for 2026 TFSA rules</span>
            <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-800">Educational estimate only</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <FlagshipRoomCalculator />
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="prose prose-lg max-w-none prose-slate dark:prose-invert">
          <p>
            TFSA contribution room is the amount you can still add to your Tax-Free Savings Account without creating an excess contribution. The idea sounds simple: the government announces an annual limit, unused room carries forward, and withdrawals can come back later. The real-world version is messier because Canadians often have multiple TFSA accounts, current-year transactions, old withdrawals, issuer reporting delays, and residency histories that do not match a simple lifetime-room table.
          </p>
          <p>
            This page is designed to help you calculate the planning number and understand what the number means. It is not meant to replace CRA My Account, your Notice of Assessment, or your bank and brokerage statements. A good TFSA room workflow uses all three: a calculator for planning, your own transaction records for current-year accuracy, and CRA information for official reference.
          </p>

          <Section title="What TFSA contribution room means">
            <p>
              TFSA room is not the same as your TFSA balance. If you contributed $20,000 and investments grew to $30,000, the growth does not use extra contribution room. If the same account fell to $12,000, the loss does not restore room either. Room is based on eligible annual limits, contributions, qualifying withdrawals that returned as room, and unused carryforward.
            </p>
            <p>
              For 2026, the annual TFSA dollar limit is {formatCurrency(REGISTERED_ACCOUNT_LIMITS.tfsaAnnualLimit)}. A Canadian who has been eligible every year since 2009 and never contributed could have much more than one year of room because unused room carries forward. But that lifetime maximum only applies if the person was at least 18, resident in Canada, and eligible for every year in the calculation.
            </p>
          </Section>

          <Section title="How carryforward works">
            <p>
              Unused TFSA room carries forward indefinitely while the TFSA rules apply. If you had $4,000 of unused room at the end of 2025, the 2026 annual limit would be added on January 1, 2026. If the 2026 annual limit is $7,000, that simple example would start the year with $11,000 of room before considering any withdrawals from 2025.
            </p>
            <p>
              Carryforward is useful because it lets Canadians contribute when cash flow allows. A student, newcomer, or early-career worker may not use much room for several years, then catch up later. The risk is that old room estimates can become stale if you forget a contribution, ignore a second TFSA at another institution, or rely on a generic lifetime table that does not match your residency history.
            </p>
          </Section>

          <Section title="How withdrawals affect next year's room">
            <p>
              A qualifying TFSA withdrawal is generally added back to contribution room on January 1 of the following calendar year. This rule is one of the biggest sources of accidental overcontributions. If you withdraw $5,000 in March 2026, you usually do not get that $5,000 of room back in April 2026. It is restored on January 1, 2027.
            </p>
            <p>
              This matters most when someone treats a TFSA like a chequing account. If you withdraw money and put it back in the same calendar year, the recontribution is safe only if you already had enough unused room. Otherwise, the replacement deposit can become an excess amount even though the same dollars were withdrawn earlier.
            </p>
          </Section>

          <Section title="Common overcontribution mistakes">
            <ul>
              <li>Recontributing a withdrawal in the same calendar year without unused room.</li>
              <li>Adding room from multiple TFSA accounts as if each account has its own separate limit.</li>
              <li>Using a CRA My Account number that does not yet include recent bank or brokerage transactions.</li>
              <li>Using the full lifetime limit even though you became a Canadian resident after age 18.</li>
              <li>Forgetting automatic deposits, employer-linked savings transfers, or small old TFSA accounts.</li>
            </ul>
            <p>
              CRA can assess tax on excess TFSA amounts. The common reference point is 1% per month on the highest excess amount for that month, but the exact handling depends on the facts and CRA guidance. If you think you overcontributed, do not wait for the next annual update. Review CRA guidance and correct the excess promptly.
            </p>
          </Section>

          <Section title="CRA My Account vs calculator differences">
            <p>
              CRA My Account is important, but it may not be real-time. Financial institutions usually report TFSA transactions after year-end, and CRA updates contribution-room information after processing that information. During the year, CRA may not know about a deposit you made last week or a withdrawal from a different institution.
            </p>
            <p>
              A calculator can be more current if your inputs are accurate, but it is still only as good as the records you enter. The safest approach is to reconcile CRA My Account, financial institution statements, and your own current-year TFSA transaction list before making a large contribution.
            </p>
          </Section>

          <Section title="Examples that change the TFSA room answer">
            <h3>Beginner investor</h3>
            <p>
              A 25-year-old Canadian who has never contributed may have several years of unused room. The main decision is not only how much room exists, but how much cash should actually go into a TFSA after emergency savings, debt, and short-term needs are considered.
            </p>
            <h3>Immigrant or new resident</h3>
            <p>
              A newcomer who arrived in Canada in 2022 should not use the full 2009-to-2026 lifetime room table. TFSA room generally starts accumulating only after becoming resident in Canada, being at least 18, and meeting eligibility rules. This is where generic calculators can overstate room if residency year is ignored.
            </p>
            <h3>Someone who withdrew funds</h3>
            <p>
              If someone withdrew $12,000 in 2025, that amount may be added back in 2026. If they withdrew $12,000 in 2026, it generally comes back in 2027. Same dollar amount, different calendar-year result.
            </p>
          </Section>

          <Section title="TFSA penalties explained">
            <p>
              The TFSA overcontribution penalty exists because the account is tax-advantaged. If someone contributes more than their available room, CRA can apply tax while the excess remains. The headline penalty is commonly described as 1% per month on the excess TFSA amount.
            </p>
            <p>
              The practical response is simple: identify the excess, stop new contributions, remove the excess if needed, and keep records. The longer an excess remains, the more expensive the mistake can become. A calculator can flag possible risk, but official CRA guidance should be used when correcting a real excess.
            </p>
          </Section>

          <Section title="When TFSA may not be the best next account">
            <p>
              TFSA room is valuable, but it does not automatically mean the TFSA should receive the next dollar. An RRSP may be more useful when your current marginal tax rate is high and retirement withdrawals are expected at a lower rate. An FHSA may deserve priority when you are eligible and saving for a first home. Paying down high-interest debt or building an emergency fund can also be more urgent than optimizing registered accounts.
            </p>
            <p>
              The better question is: what job does this next dollar have? If the job is flexibility, the TFSA often looks strong. If the job is first-home savings and you qualify, the FHSA may be stronger. If the job is retirement tax deferral at a high current tax rate, the RRSP deserves attention.
            </p>
          </Section>

          <Section title="Compare TFSA vs RRSP vs FHSA">
            <p>
              Before contributing, compare account priority using income, timeline, emergency savings, home-buying eligibility, retirement focus, and flexibility needs. The TFSA contribution-room number is only one part of the decision. A large room estimate tells you capacity; it does not tell you whether this account is the strongest place for the next dollar.
            </p>
            <p>
              Use the <Link to="/tools/account-decision-tool">Account Decision Tool</Link> for a ranked TFSA/RRSP/FHSA framework, then use the <Link to="/tools/tfsa-calculator">TFSA calculator</Link> to model growth and room once the account priority makes sense.
            </p>
          </Section>

          <Section title="FAQ">
            {faqs.map((faq) => (
              <details key={faq.q} className="not-prose my-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <summary className="cursor-pointer font-bold text-primary dark:text-accent">{faq.q}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.a}</p>
              </details>
            ))}
          </Section>
        </article>

        <aside className="space-y-6">
          <ContributorReviewBox />
          <SourceVerificationBlock
            lastUpdated="May 20, 2026"
            sources={tfsaOfficialSources}
            checked={["2026 TFSA annual limit", "Carryforward and withdrawal timing", "Overcontribution caveats", "CRA My Account lag warning"]}
            limitations={["This calculator cannot see your CRA account, current-year brokerage transactions, non-residency periods, or TFSA transfer history.", "Verify official contribution room before making a real contribution."]}
          />
          <EducationalDisclaimer compact />
        </aside>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 pb-16">
        <YouTubeSupportSection
          videoTitle="TFSA contribution room calculator explained"
          videoDescription="Future video support can walk through CRA room, withdrawals, carryforward, and overcontribution examples without autoplay."
          calculatorLinks={[{ label: "TFSA calculator", href: "/tools/tfsa-calculator" }, { label: "Account Decision Tool", href: "/tools/account-decision-tool" }]}
          guideLinks={[{ label: "TFSA withdrawal rules", href: "/blog/tfsa-withdrawal-rules-canada-2026" }, { label: "TFSA overcontribution penalties", href: "/blog/tfsa-overcontribution-penalties-canada" }]}
        />
        <RelatedContent
          title="Next recommended reading"
          intro="Use these next if your contribution-room estimate changes the account decision."
          items={[
            { type: "Guide", title: "TFSA withdrawal rules in Canada", href: "/blog/tfsa-withdrawal-rules-canada-2026", body: "Understand when withdrawn money returns as new contribution room." },
            { type: "Guide", title: "TFSA overcontribution penalties", href: "/blog/tfsa-overcontribution-penalties-canada", body: "Learn how excess amounts happen and why timing matters." },
            { type: "Calculator", title: "TFSA vs RRSP vs FHSA decision tool", href: "/tools/account-decision-tool", body: "Compare whether TFSA should actually get the next dollar." },
          ]}
        />
      </section>
    </main>
  );
}
