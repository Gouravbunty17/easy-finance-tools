import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import ArticleSchema from "../../components/ArticleSchema";
import FAQSchema from "../../components/FAQSchema";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";
import ContributorReviewBox from "../../components/ContributorReviewBox";
import SourceVerificationBlock from "../../components/SourceVerificationBlock";
import RelatedContent from "../../components/RelatedContent";
import EducationalDisclaimer from "../../components/EducationalDisclaimer";
import InlineSourceTrust from "../../components/InlineSourceTrust";
import { CANADIAN_PROVINCES, FHSA_TAX_BRACKETS, getEstimatedMarginalTaxRate } from "../../config/financial";
import { retirementOfficialSources, rrspOfficialSources, taxOfficialSources, tfsaOfficialSources } from "../../config/officialSources";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const canonical = "https://easyfinancetools.com/blog/rrsp-withdrawal-tax-calculator";
const pageTitle = "RRSP Withdrawal Tax Calculator: What You Actually Keep After Tax";
const metaDescription =
  "Estimate how much of an RRSP withdrawal you may keep after Canadian income tax, withholding, province, income, and marginal-rate caveats.";

const rrspWithdrawalSources = [
  {
    label: "CRA: RRSP withdrawals",
    body: "Official CRA guidance on making withdrawals from RRSPs and related plans.",
    href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/making-withdrawals.html",
  },
  {
    label: "CRA: RRSPs and related plans",
    body: "Official RRSP rules, contributions, withdrawals, income reporting, and related plan guidance.",
    href: rrspOfficialSources[0].href,
  },
  taxOfficialSources[0],
];

const faqs = [
  {
    q: "Is an RRSP withdrawal added to taxable income in Canada?",
    a: "Yes. A regular RRSP withdrawal is generally taxable income in the year you withdraw it, except for specific programs such as the Home Buyers' Plan or Lifelong Learning Plan when their rules are met.",
  },
  {
    q: "Is RRSP withholding tax the final tax I owe?",
    a: "No. Withholding is an upfront amount taken by the financial institution. Your final tax depends on your total income, province or territory, credits, deductions, and other tax-return details.",
  },
  {
    q: "Why can this calculator show more tax than the withholding amount?",
    a: "Withholding is based on withdrawal size, while actual tax depends on your full taxable income. A withdrawal that pushes you into a higher bracket can leave extra tax owing at filing time.",
  },
  {
    q: "When might a TFSA withdrawal be better than an RRSP withdrawal?",
    a: "A TFSA withdrawal may be cleaner when you need flexibility and want to avoid adding taxable income, but the right choice depends on account balances, income, benefits, contribution room, and retirement plan.",
  },
  {
    q: "Should I withdraw from my RRSP before retirement?",
    a: "Sometimes it is necessary, but it can permanently reduce tax-deferred retirement assets and may create a larger tax bill than expected. Consider alternatives and professional tax advice before a large withdrawal.",
  },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function estimateCombinedTax(province, income) {
  const brackets = FHSA_TAX_BRACKETS[province] || FHSA_TAX_BRACKETS.ON;
  const safeIncome = Math.max(0, Number(income || 0));
  return brackets.reduce((tax, [low, high, rate]) => {
    if (safeIncome <= low) return tax;
    return tax + Math.max(0, Math.min(safeIncome, high) - low) * rate;
  }, 0);
}

function estimateDefaultWithholding(withdrawal, province) {
  const safeWithdrawal = Math.max(0, Number(withdrawal || 0));
  if (safeWithdrawal === 0) return { rate: 0, amount: 0, note: "No withdrawal entered." };

  if (province === "QC") {
    const rate = safeWithdrawal <= 5000 ? 0.05 : safeWithdrawal <= 15000 ? 0.1 : 0.15;
    return {
      rate,
      amount: safeWithdrawal * rate,
      note: "Quebec RRSP withdrawals can involve separate federal and Quebec source deductions. Use your provider's estimate if available.",
    };
  }

  const rate = safeWithdrawal <= 5000 ? 0.1 : safeWithdrawal <= 15000 ? 0.2 : 0.3;
  return {
    rate,
    amount: safeWithdrawal * rate,
    note: "Common non-Quebec lump-sum withholding estimate: 10%, 20%, or 30% based on withdrawal size.",
  };
}

function InputField({ label, value, onChange, help, suffix, optional = false }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-slate-700 dark:text-slate-200">
        {label} {optional ? <span className="font-medium text-slate-500">(optional)</span> : null}
      </label>
      <div className="mt-2 flex min-h-[48px] overflow-hidden rounded-xl border-2 border-slate-200 bg-white focus-within:border-secondary dark:border-slate-700 dark:bg-slate-900">
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(parseNumericInput(event.target.value, { integer: true }))}
          inputMode="numeric"
          className="min-w-0 flex-1 bg-transparent px-4 text-base font-semibold text-slate-900 outline-none dark:text-white"
        />
        {suffix ? <span className="flex items-center px-3 text-sm font-bold text-slate-500">{suffix}</span> : null}
      </div>
      {help ? <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{help}</p> : null}
    </div>
  );
}

function ResultMetric({ label, value, tone = "default", help }) {
  const toneClass = {
    default: "text-primary dark:text-accent",
    good: "text-emerald-700 dark:text-emerald-300",
    warning: "text-amber-700 dark:text-amber-300",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-900">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-black ${toneClass}`}>{value}</p>
      {help ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{help}</p> : null}
    </div>
  );
}

function RRSPWithdrawalCalculator() {
  const [province, setProvince] = useState("ON");
  const [withdrawalAmount, setWithdrawalAmount] = useState("20000");
  const [annualIncome, setAnnualIncome] = useState("65000");
  const [age, setAge] = useState("45");
  const [withholdingOverride, setWithholdingOverride] = useState("");

  const result = useMemo(() => {
    const withdrawal = Math.max(0, asNumber(withdrawalAmount));
    const incomeBefore = Math.max(0, asNumber(annualIncome));
    const userAge = Math.max(0, asNumber(age));
    const incomeAfter = incomeBefore + withdrawal;
    const taxBefore = estimateCombinedTax(province, incomeBefore);
    const taxAfter = estimateCombinedTax(province, incomeAfter);
    const taxImpact = Math.max(0, taxAfter - taxBefore);
    const keptAfterEstimatedTax = Math.max(0, withdrawal - taxImpact);
    const effectiveTaxRate = withdrawal > 0 ? taxImpact / withdrawal : 0;
    const marginalBefore = getEstimatedMarginalTaxRate(province, incomeBefore);
    const marginalAfter = getEstimatedMarginalTaxRate(province, incomeAfter);
    const defaultWithholding = estimateDefaultWithholding(withdrawal, province);
    const overrideValue = withholdingOverride === "" ? null : Math.max(0, asNumber(withholdingOverride));
    const withholdingUsed = overrideValue ?? defaultWithholding.amount;
    const cashAfterWithholding = Math.max(0, withdrawal - withholdingUsed);
    const possibleBalanceDue = Math.max(0, taxImpact - withholdingUsed);
    const possibleOverwithheld = Math.max(0, withholdingUsed - taxImpact);
    const ageNote =
      userAge >= 71
        ? "At 71+, RRIF conversion and minimum-withdrawal rules may matter more than a one-time RRSP estimate."
        : userAge >= 65
          ? "At 65+, also consider income-tested benefits, pension credits, OAS recovery tax exposure, and RRIF timing."
          : "Before retirement, an RRSP withdrawal can permanently reduce tax-deferred compounding room.";

    return {
      withdrawal,
      incomeBefore,
      incomeAfter,
      taxImpact,
      keptAfterEstimatedTax,
      effectiveTaxRate,
      marginalBefore,
      marginalAfter,
      defaultWithholding,
      withholdingUsed,
      cashAfterWithholding,
      possibleBalanceDue,
      possibleOverwithheld,
      ageNote,
    };
  }, [age, annualIncome, province, withholdingOverride, withdrawalAmount]);

  const withholdingWarning =
    result.possibleBalanceDue > 100
      ? `Withholding may be too low by about ${formatCurrency(result.possibleBalanceDue)} in this simplified estimate.`
      : result.possibleOverwithheld > 100
        ? `Withholding may be higher than the estimated tax impact by about ${formatCurrency(result.possibleOverwithheld)}. A refund is possible but not guaranteed.`
        : "The withholding estimate is close to the simplified tax-impact estimate, but your tax return can still differ.";

  return (
    <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-5 shadow-sm dark:border-emerald-900/60 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900 md:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">RRSP withdrawal estimate</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Estimate what you may keep after tax</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-300">
            This compares estimated combined federal/provincial tax before and after the withdrawal. It is a planning estimate, not a tax filing calculation.
          </p>
        </div>
        <Link
          to="/tools/rrsp-calculator"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-primary transition hover:border-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-300"
        >
          Compare RRSP contribution value
        </Link>
      </div>

      <InlineSourceTrust
        label="Source context"
        note="RRSP withdrawals are generally taxable income. Verify withdrawal and income-tax treatment with CRA before acting."
        sources={[rrspWithdrawalSources[0], taxOfficialSources[0]]}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-gray-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="province" className="block text-sm font-bold text-slate-700 dark:text-slate-200">Province/territory</label>
              <select
                id="province"
                value={province}
                onChange={(event) => setProvince(event.target.value)}
                className="mt-2 min-h-[48px] w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {CANADIAN_PROVINCES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
            <InputField label="Age" value={age} onChange={setAge} help="Used for retirement-context warnings only." />
            <InputField label="RRSP withdrawal amount" value={withdrawalAmount} onChange={setWithdrawalAmount} help="The gross amount you plan to withdraw." />
            <InputField label="Annual income before withdrawal" value={annualIncome} onChange={setAnnualIncome} help="Employment, pension, self-employment, and other taxable income before this RRSP withdrawal." />
            <div className="sm:col-span-2">
              <InputField
                label="Withholding estimate"
                value={withholdingOverride}
                onChange={setWithholdingOverride}
                help={`Leave blank to use the built-in estimate. Current automatic estimate: ${formatCurrency(result.defaultWithholding.amount)} (${formatPercent(result.defaultWithholding.rate)}).`}
                optional
              />
            </div>
          </div>
          <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-950/60 dark:text-slate-300">
            {result.defaultWithholding.note}
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultMetric label="Taxable income after withdrawal" value={formatCurrency(result.incomeAfter)} help={`Before withdrawal: ${formatCurrency(result.incomeBefore)}.`} />
            <ResultMetric label="Estimated tax impact" value={formatCurrency(result.taxImpact)} tone="warning" help={`Effective tax on withdrawal: ${formatPercent(result.effectiveTaxRate)}.`} />
            <ResultMetric label="Estimated kept after tax" value={formatCurrency(result.keptAfterEstimatedTax)} tone="good" help="This is the withdrawal minus the estimated tax impact, not a guaranteed cash result." />
            <ResultMetric label="Cash after withholding" value={formatCurrency(result.cashAfterWithholding)} help={`Withholding used: ${formatCurrency(result.withholdingUsed)}.`} />
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/20 dark:text-amber-100">
            <p className="font-bold">Withholding tax warning</p>
            <p className="mt-2">{withholdingWarning}</p>
            <p className="mt-2">Marginal-rate caveat: this estimate moves from about {formatPercent(result.marginalBefore)} to {formatPercent(result.marginalAfter)} at the entered income levels. Credits, deductions, benefit clawbacks, Quebec rules, and other income can change the real answer.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-300">
            <p className="font-bold text-primary dark:text-accent">What this result means</p>
            <p className="mt-2">{result.ageNote}</p>
            <p className="mt-2">If the withdrawal is discretionary, compare a smaller withdrawal, delaying the withdrawal, using TFSA cash first, or spreading income over tax years before deciding.</p>
          </div>
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

export default function RRSPWithdrawalTaxCalculatorPage() {
  const breadcrumbs = [
    { name: "Home", item: "https://easyfinancetools.com/" },
    { name: "Blog", item: "https://easyfinancetools.com/blog" },
    { name: pageTitle, item: canonical },
  ];

  return (
    <main className="bg-white dark:bg-gray-950">
      <SEO
        title="RRSP Withdrawal Tax Calculator Canada | EasyFinanceTools"
        description={metaDescription}
        canonical={canonical}
        type="article"
        image="/og-image.png"
      />
      <ArticleSchema
        headline={pageTitle}
        description={metaDescription}
        url={canonical}
        datePublished="2026-05-24"
        dateModified="2026-05-24"
        breadcrumbs={breadcrumbs}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <section className="border-b bg-slate-50 px-4 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">RRSP withdrawal tax calculator</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-primary dark:text-accent md:text-6xl">
            RRSP Withdrawal Tax Calculator: What You Actually Keep After Tax
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Estimate how a Canadian RRSP withdrawal may change taxable income, withholding, and after-tax cash before you pull money out of a registered retirement account.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-800">Last updated May 24, 2026</span>
            <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-800">Reviewed against CRA source material</span>
            <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-800">Educational tax estimate only</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <RRSPWithdrawalCalculator />
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="prose prose-lg max-w-none prose-slate dark:prose-invert">
          <p>
            RRSP withdrawals can feel simple because the bank withholds tax before sending you the money. The uncomfortable part is that withholding is not the same as final tax. A $20,000 withdrawal can be taxed very differently for someone earning $25,000, $65,000, or $140,000 before the withdrawal.
          </p>
          <p>
            This page uses a decision-first approach: estimate the tax impact, understand what could make the estimate wrong, then decide whether the withdrawal still makes sense. It does not provide financial or tax advice. For a real withdrawal, verify your situation with CRA information, your tax software, or a qualified tax professional.
          </p>

          <Section title="How RRSP withdrawals are taxed in Canada">
            <p>
              Regular RRSP withdrawals are generally included in taxable income for the year of withdrawal. That means the withdrawal sits on top of employment income, pension income, self-employment income, taxable investment income, and other taxable amounts. The higher your income already is, the more likely the withdrawal is to be taxed at a higher marginal rate.
            </p>
            <p>
              Some RRSP programs work differently. The Home Buyers' Plan and Lifelong Learning Plan can allow qualifying withdrawals with repayment rules. This calculator is for a regular taxable RRSP withdrawal, not a qualifying HBP or LLP withdrawal.
            </p>
            <InlineSourceTrust
              label="CRA rule reference"
              note="CRA guidance explains RRSP withdrawals and related plan rules. Confirm whether your withdrawal is regular taxable income or part of a special program."
              sources={[rrspWithdrawalSources[0], rrspOfficialSources[0]]}
            />
          </Section>

          <Section title="RRSP withholding tax vs actual tax owed">
            <p>
              Withholding tax is the amount taken at source when the RRSP issuer processes the withdrawal. It helps prepay tax, but it does not settle the tax bill. Your actual tax is determined when you file your return and combine all income, deductions, credits, and province or territory rules.
            </p>
            <p>
              This is why a withdrawal can produce a surprise balance owing. A financial institution may withhold a fixed percentage based on the withdrawal size, while your tax return may treat the withdrawal as income in a much higher bracket. The opposite can also happen: withholding may be higher than the simplified tax impact, especially for lower-income years.
            </p>
          </Section>

          <Section title="Why income level matters">
            <p>
              RRSP withdrawals are most expensive when they land in a high-tax year. If you earn $65,000 and withdraw $20,000, the withdrawal may be taxed partly in a different bracket than your regular income. If you earn $20,000 and withdraw the same $20,000, the after-tax result can look very different.
            </p>
            <p>
              The calculator estimates the difference between tax before and after the withdrawal. That difference is usually more useful than applying one flat tax rate to the withdrawal, because withdrawals can cross bracket thresholds. The estimate is still simplified: it does not model every credit, deduction, benefit clawback, Quebec-specific detail, or household interaction.
            </p>
          </Section>

          <Section title="RRSP withdrawal before retirement">
            <p>
              Before retirement, an RRSP withdrawal can solve a cash-flow problem but create three costs: tax now, less tax-deferred growth later, and lost flexibility if contribution room is not restored. Unlike a TFSA withdrawal, a regular RRSP withdrawal does not create new RRSP room.
            </p>
            <p>
              This may hurt when the withdrawal happens during a high-income year, when investments would otherwise stay invested for decades, or when the money is used for spending that could have been delayed. It may be more defensible when the alternative is high-interest debt, a critical expense, or a carefully planned low-income year.
            </p>
          </Section>

          <Section title="RRSP withdrawal after retirement">
            <p>
              In retirement, the question shifts from "should I touch the RRSP?" to "how much income should come from which account this year?" RRSP and RRIF withdrawals can interact with CPP, OAS, GIS eligibility, pension income, taxable investments, and tax credits.
            </p>
            <p>
              At higher retirement incomes, withdrawals may create OAS recovery tax exposure. At lower incomes, withdrawals can affect income-tested benefits. The right sequence may depend on age, spouse or partner income, registered and non-registered balances, and whether the account has already converted to a RRIF.
            </p>
            <InlineSourceTrust
              label="Retirement income context"
              note="For retirement withdrawals, check Government of Canada benefit rules and CRA RRIF/RRSP guidance before relying on one calculator output."
              sources={[retirementOfficialSources[1], retirementOfficialSources[2]]}
            />
          </Section>

          <Section title="RRSP vs TFSA withdrawal comparison">
            <p>
              A TFSA withdrawal is often cleaner because it generally does not add taxable income and does not affect income-tested benefits in the same direct way. It also creates future TFSA contribution room, usually on January 1 of the next calendar year. That does not mean TFSA should always be used first.
            </p>
            <p>
              RRSP withdrawals can make sense in a low-income year, during a planned retirement drawdown, or when TFSA room is more valuable for future tax-free growth. TFSA withdrawals may be better when the goal is near-term flexibility, when income is already high, or when benefit clawbacks matter. The decision is about tax rate, timing, replacement room, and the purpose of the money.
            </p>
            <InlineSourceTrust
              label="Account comparison source"
              note="Compare CRA TFSA withdrawal-room rules against RRSP withdrawal tax treatment before choosing which account to use."
              sources={[tfsaOfficialSources[0], rrspWithdrawalSources[0]]}
            />
          </Section>

          <Section title="When RRSP withdrawal may hurt">
            <ul>
              <li>You are already in a high-income year and the withdrawal lands in a higher marginal bracket.</li>
              <li>The withdrawal creates or increases benefit clawbacks, especially in retirement.</li>
              <li>You use RRSP money for short-term spending while still carrying unused TFSA room or cheaper cash options.</li>
              <li>You withdraw before retirement and lose decades of tax-deferred compounding.</li>
              <li>You assume withholding is the final tax bill and do not save for a possible balance owing.</li>
            </ul>
          </Section>

          <Section title="When TFSA may be better">
            <p>
              TFSA may be better when avoiding taxable income is the priority, especially if the RRSP withdrawal would push you into a higher bracket or affect benefits. It can also be better for emergency cash because withdrawn TFSA room is usually restored the next year, while RRSP room is generally not restored after a taxable withdrawal.
            </p>
            <p>
              TFSA is not automatically superior. If your TFSA holds long-term investments and your RRSP withdrawal would happen in an unusually low-income year, using RRSP cash first can sometimes be reasonable. The calculator helps make the tradeoff visible rather than assuming one account always wins.
            </p>
          </Section>

          <Section title="Common mistakes">
            <ul>
              <li>Treating source withholding as the final tax result.</li>
              <li>Ignoring the province or territory where the withdrawal will be taxed.</li>
              <li>Withdrawing one large amount instead of testing smaller staged withdrawals.</li>
              <li>Forgetting that regular RRSP withdrawals do not create new RRSP contribution room.</li>
              <li>Not checking whether the withdrawal affects OAS, GIS, credits, or other income-tested benefits.</li>
              <li>Using a generic calculator without verifying the result in CRA records or tax software.</li>
            </ul>
          </Section>

          <Section title="When to consider professional tax advice">
            <p>
              Consider a qualified tax professional if the withdrawal is large, you live in Quebec, you have self-employment income, you receive income-tested benefits, you are near retirement, you have foreign income, or the withdrawal is connected to separation, disability, estate planning, or insolvency. A small calculator can show direction; it cannot replace full tax-return context.
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
            lastUpdated="May 24, 2026"
            verifiedFor="2026 Canadian RRSP withdrawal planning"
            sources={rrspWithdrawalSources}
            checked={["Regular RRSP withdrawal taxability", "Withholding-vs-final-tax caveat", "Province and income sensitivity", "TFSA comparison caveats"]}
            limitations={["This estimate uses simplified combined federal/provincial marginal rates and does not calculate every credit, deduction, benefit clawback, Quebec source deduction, or household tax interaction.", "Verify large or complex withdrawals with CRA guidance, tax software, or a qualified tax professional."]}
          />
          <EducationalDisclaimer compact />
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <RelatedContent
          title="Related decision tools and guides"
          intro="Use these next if the RRSP withdrawal estimate changes your account or retirement decision."
          limit={4}
          items={[
            { type: "Calculator", title: "RRSP calculator", href: "/tools/rrsp-calculator", body: "Compare contribution deductions, refund impact, and long-term RRSP growth." },
            { type: "Calculator", title: "TFSA calculator", href: "/tools/tfsa-calculator", body: "Model tax-free growth and compare withdrawing TFSA cash instead." },
            { type: "Guide", title: "TFSA vs RRSP vs FHSA", href: "/blog/tfsa-vs-rrsp-vs-fhsa-canada", body: "Choose which account should handle the next dollar or withdrawal." },
            { type: "Hub", title: "Retirement planning hub", href: "/topics/retirement", body: "Review CPP, OAS, RRSP/RRIF, and drawdown planning basics." },
          ]}
        />
      </section>
    </main>
  );
}
