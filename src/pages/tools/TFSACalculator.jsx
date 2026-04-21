import React, { useMemo, useState } from "react";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import ActionableNextSteps from "../../components/ActionableNextSteps";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import EducationalDisclaimer from "../../components/EducationalDisclaimer";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const TFSA_FAQS = [
  {
    q: "What is the TFSA contribution limit for 2026?",
    a: "The 2026 TFSA annual limit is $7,000, the same as 2024 and 2025. If you have been eligible every year since 2009 and never contributed, cumulative room reaches $102,000 in 2026. CRA sets the annual limit each fall after indexing for inflation and rounding to the nearest $500.",
  },
  {
    q: "What happens if I over-contribute to my TFSA?",
    a: "CRA charges a 1% monthly penalty on the highest excess amount in your TFSA for each month the over-contribution stays in the account. Withdraw the excess as soon as you notice it. You can also file form RC243 to ask CRA to assess or waive the tax.",
  },
  {
    q: "Can I re-contribute a TFSA withdrawal in the same calendar year?",
    a: "Only if you still have unused room available. Withdrawals are added back on January 1 of the following year, not right away. If you put the money back too soon and go over your room, CRA treats it as an over-contribution and the 1% monthly penalty can apply.",
  },
  {
    q: "Are dividends and capital gains inside a TFSA taxable?",
    a: "Canadian dividends, interest, and capital gains earned inside a TFSA are tax-free and are not reported on your personal tax return. US dividends usually face a 15% US withholding tax that you cannot recover inside a TFSA because the account is not treated as a retirement account under the Canada-US tax treaty.",
  },
  {
    q: "Do I need to report my TFSA on my tax return?",
    a: "No. Contributions, withdrawals, and investment growth inside a TFSA are not reported on your T1 return. Your financial institution reports your activity directly to CRA, and your current room shows up in CRA My Account.",
  },
  {
    q: "Can newcomers to Canada contribute to a TFSA?",
    a: "Yes. Once you are 18 or older and a Canadian tax resident, TFSA room begins accruing. Years before you became a resident do not count. The calculator above uses the later of your 18th birthday year or your residency year to anchor your cumulative room.",
  },
  {
    q: "What happens to a TFSA when the holder dies?",
    a: "A spouse or common-law partner can be named as a successor holder, which rolls the TFSA over with no impact on the survivor's room. Named beneficiaries receive the account's fair market value at death, but subsequent growth is taxable to the beneficiary or estate unless re-contributed using the recipient's own TFSA room.",
  },
  {
    q: "Is a TFSA better than an RRSP?",
    a: "Neither account is universally better. The TFSA usually wins when your current marginal tax rate is lower than your expected retirement rate, or when flexibility matters. The RRSP usually wins when the deduction today is worth more than the tax on withdrawal. Our TFSA vs RRSP guide walks through the math.",
  },
];

const TFSA_LIMITS = {
  2009: 5000,
  2010: 5000,
  2011: 5000,
  2012: 5000,
  2013: 5500,
  2014: 5500,
  2015: 10000,
  2016: 5500,
  2017: 5500,
  2018: 5500,
  2019: 6000,
  2020: 6000,
  2021: 6000,
  2022: 6000,
  2023: 6500,
  2024: 7000,
  2025: 7000,
  2026: 7000,
};

const CURRENT_YEAR = 2026;

function getEligibleYear(birthYear, residencyYear) {
  return Math.max(2009, birthYear + 18, residencyYear);
}

function getAccruedRoom(eligibleYear) {
  let total = 0;
  for (let year = eligibleYear; year <= CURRENT_YEAR; year += 1) {
    total += TFSA_LIMITS[year] || 0;
  }
  return total;
}

function buildProjection(currentBalance, monthlyContribution, annualReturn, years) {
  const monthlyRate = annualReturn / 100 / 12;
  let balance = currentBalance;
  const rows = [];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    rows.push({ year, balance: Math.round(balance) });
  }

  return { endingBalance: Math.round(balance), rows };
}

export default function TFSACalculator() {
  const [birthYear, setBirthYear] = useState(1992);
  const [residencyYear, setResidencyYear] = useState(2010);
  const [currentBalance, setCurrentBalance] = useState(25000);
  const [totalContributions, setTotalContributions] = useState(40000);
  const [totalWithdrawals, setTotalWithdrawals] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(400);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [years, setYears] = useState(15);

  const result = useMemo(() => {
    const eligibleYear = getEligibleYear(asNumber(birthYear, 1992), asNumber(residencyYear, 2010));
    const accruedRoom = getAccruedRoom(eligibleYear);
    const netContributions = Math.max(0, asNumber(totalContributions) - asNumber(totalWithdrawals));
    const estimatedRoom = Math.max(0, accruedRoom - netContributions);
    const projection = buildProjection(asNumber(currentBalance), asNumber(monthlyContribution), asNumber(annualReturn), Math.max(1, asNumber(years, 15)));
    const totalFutureContributions = asNumber(currentBalance) + asNumber(monthlyContribution) * 12 * Math.max(1, asNumber(years, 15));
    const totalGrowth = projection.endingBalance - totalFutureContributions;

    return {
      eligibleYear,
      accruedRoom,
      estimatedRoom,
      netContributions,
      projection,
      totalGrowth: Math.round(totalGrowth),
    };
  }, [birthYear, residencyYear, currentBalance, totalContributions, totalWithdrawals, monthlyContribution, annualReturn, years]);

  return (
    <>
      <CalculatorLayout
        title="TFSA Calculator 2026"
        description="Estimate your TFSA contribution room, then project tax-free growth with simple input boxes."
        canonical="https://easyfinancetools.com/tools/tfsa-calculator"
        badge="Registered accounts"
        results={
          <>
            <ResultCard
              label="Estimated TFSA room"
              value={fmtCAD(result.estimatedRoom)}
              hint={`Eligibility year: ${result.eligibleYear}. Accrued room through 2026: ${fmtCAD(result.accruedRoom)}.`}
              tone="primary"
            />
            <ResultCard
              label={`Projected value in ${fmtNum(years)} years`}
              value={fmtCAD(result.projection.endingBalance)}
              hint={`Projected tax-free growth: ${fmtCAD(result.totalGrowth)} at ${fmtNum(annualReturn, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}% annually.`}
            />
            <ResultCard
              label="Net contributions used"
              value={fmtCAD(result.netContributions)}
              hint="This simple room estimate assumes withdrawals shown here were made in or before the previous calendar year."
              tone="success"
            />
          </>
        }
        relatedTools={[
          { href: "/tools/rrsp-calculator", title: "RRSP calculator", body: "Compare tax-free TFSA growth with deduction-driven RRSP planning." },
          { href: "/tools/compound-interest-calculator", title: "Compound interest calculator", body: "Stress-test the same savings plan outside a registered account context." },
          { href: "/tools/dividend-calculator", title: "Dividend calculator", body: "Project income-focused investing once you know how much TFSA room you still have." },
        ]}
        footerNote="Educational estimate only. Same-year TFSA withdrawals are usually added back on January 1 of the following year, so confirm your room with CRA My Account before acting."
      >
        <EducationalDisclaimer />
        <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <div className="grid gap-5 md:grid-cols-2">
            <NumberInput id="tfsa-birth-year" label="Birth year" value={birthYear} onChange={(value) => setBirthYear(parseNumericInput(value, { integer: true }))} placeholder="1992" inputMode="numeric" hint="TFSA eligibility starts at age 18, but never earlier than 2009." />
            <NumberInput id="tfsa-residency-year" label="Became a Canadian resident in" value={residencyYear} onChange={(value) => setResidencyYear(parseNumericInput(value, { integer: true }))} placeholder="2010" inputMode="numeric" hint="Residency matters because TFSA room only accrues for years you were eligible and resident." />
            <NumberInput id="tfsa-current-balance" label="Current TFSA balance" prefix="$" value={currentBalance} onChange={(value) => setCurrentBalance(parseNumericInput(value))} placeholder="25000" />
            <NumberInput id="tfsa-monthly-contribution" label="Monthly contribution" prefix="$" value={monthlyContribution} onChange={(value) => setMonthlyContribution(parseNumericInput(value))} placeholder="400" hint="Use 0 if you want a room-only estimate." />
            <NumberInput id="tfsa-total-contributions" label="Total lifetime contributions" prefix="$" value={totalContributions} onChange={(value) => setTotalContributions(parseNumericInput(value))} placeholder="40000" />
            <NumberInput id="tfsa-total-withdrawals" label="Total prior withdrawals" prefix="$" value={totalWithdrawals} onChange={(value) => setTotalWithdrawals(parseNumericInput(value))} placeholder="5000" hint="Best used for withdrawals already added back to room." />
            <NumberInput id="tfsa-return-rate" label="Expected annual return" value={annualReturn} onChange={(value) => setAnnualReturn(parseNumericInput(value))} placeholder="6" suffix="%" />
            <NumberInput id="tfsa-years" label="Projection years" value={years} onChange={(value) => setYears(parseNumericInput(value, { integer: true }))} placeholder="15" inputMode="numeric" />
          </div>
        </div>
      </CalculatorLayout>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        <ActionableNextSteps
          toolName="tfsa_calculator"
          intro="Use this as a quick planning pass, then confirm your exact room with CRA before you contribute."
          meaning={`Based on the inputs above, your estimated TFSA room is ${fmtCAD(result.estimatedRoom)}. In ${fmtNum(years)} years, the account could grow to ${fmtCAD(result.projection.endingBalance)}.`}
          steps={[
            "Verify the estimate against your latest CRA TFSA room figure before making a large contribution.",
            "Compare TFSA and RRSP if you are deciding between tax-free growth and a deduction today.",
            "Use the compound interest calculator if you want to test a more aggressive or more conservative return assumption.",
          ]}
          actions={[
            { href: "/tools/rrsp-calculator", title: "Compare TFSA vs RRSP", body: "See how contribution timing and tax deductions change the decision.", ctaLabel: "tfsa_next_rrsp" },
            { href: "/blog/tfsa-vs-rrsp-2026", title: "Read the TFSA vs RRSP guide", body: "Move from a number into a plain-language decision framework.", ctaLabel: "tfsa_next_guide", destinationType: "article" },
            { href: "/tools/compound-interest-calculator", title: "Model long-term growth", body: "Stress-test your contribution plan with different return and inflation assumptions.", ctaLabel: "tfsa_next_compound" },
          ]}
        />

        <article className="prose prose-lg prose-slate dark:prose-invert mt-10 max-w-none rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
          <h2>How this calculator works</h2>
          <p>
            This TFSA calculator answers two questions. First, it estimates how much TFSA room you may still have. Second, it shows how your balance could grow if you keep contributing. The room estimate starts with your first year of eligibility, adds each CRA annual limit through 2026, and subtracts your net lifetime contributions. The projection then applies a steady annual return to your current balance and monthly deposits.
          </p>
          <p>
            Two inputs matter more than the rest. Your birth year and residency year set your eligibility start, and even a one-year change can move your room by several thousand dollars. Your lifetime contributions, net of prior withdrawals, also matter because that is the figure CRA compares against your room cap. Before you make a large deposit, check CRA My Account. It is the only authoritative source, especially when recent deposits or withdrawals may not be fully processed yet.
          </p>

          <h2>The 2026 TFSA rules</h2>
          <p>
            The TFSA annual limit for 2026 is <strong>$7,000</strong>, unchanged from 2024 and 2025. Someone who was 18 or older, a Canadian tax resident in 2009, and has never contributed has <strong>$102,000</strong> of cumulative room in 2026. Unused room carries forward forever, so skipping a year does not make you lose it.
          </p>
          <p>
            Two rules cause the most confusion. First, <strong>withdrawals come back with a one-year lag</strong>: a $10,000 withdrawal in 2026 does not restore $10,000 of room until January 1, 2027. Re-contributing that amount too soon can trigger a 1% monthly penalty on the excess. Second, <strong>room starts from your eligibility year, not automatically from 2009</strong>. If you became a Canadian resident in 2015, your TFSA room starts in 2015.
          </p>
          <p>
            Investment growth inside the TFSA, including dividends, interest, and capital gains, is tax-free and does not use extra contribution room. If you invest $7,000 and it grows to $12,000, you have still used only $7,000 of room.
          </p>

          <h2>Common TFSA mistakes</h2>
          <p>
            The most expensive mistake is <strong>re-contributing a same-year withdrawal</strong>. If you pull money out in March and put it back in November, you can still trigger an over-contribution penalty if you do not have separate unused room. In most cases, it is safer to wait until January 1 of the following year before replacing a withdrawal.
          </p>
          <p>
            The second is <strong>holding US-listed dividend stocks in a TFSA</strong>. US dividends paid into a TFSA usually face a 15% withholding tax, and you cannot recover it. The same dividends held in an RRSP usually avoid that tax. If your portfolio depends on US dividend income, account choice can matter a lot.
          </p>
          <p>
            The third mistake is treating TFSA room as "use it or lose it." It is not. Room carries forward indefinitely while you remain an eligible resident. The fourth is <strong>day-trading inside a TFSA</strong>. CRA can treat frequent active trading as a business and tax the gains as business income.
          </p>

          <h2>A worked example</h2>
          <p>
            Suppose you were born in 1992, became a Canadian resident in 2010, contributed $40,000 over time, and previously withdrew $5,000 that has already been added back to your room. Your eligibility year is 2010. Adding the 2010 to 2026 annual limits gives $94,500 of accrued room. Subtracting net contributions of $35,000 leaves an estimated <strong>$59,500</strong> available in 2026.
          </p>
          <p>
            If you then add $400 a month to a $25,000 balance and earn a 6% average annual return for 15 years, the projected ending value is about <strong>$157,700</strong>. Roughly <strong>$85,700</strong> of that would be tax-free growth. That is the real value of the TFSA. The room estimate shows how much you can still shelter, and the projection shows why sheltering matters.
          </p>
        </article>

        <MethodologyPanel
          summary="This TFSA calculator estimates available contribution room by summing CRA-announced annual limits from your eligibility year through 2026, then subtracting your net lifetime contributions. Growth is projected using a constant annual return compounded monthly with even contribution pacing, which is a planning approximation rather than a market forecast."
          assumptions={[
            "Annual limits used: $5,000 (2009-2012), $5,500 (2013-2014), $10,000 (2015), $5,500 (2016-2018), $6,000 (2019-2022), $6,500 (2023), and $7,000 (2024-2026).",
            "Eligibility year is the later of age 18 or your Canadian residency year; room does not accrue for years before either threshold.",
            "Withdrawal reinstatement assumes withdrawals entered above occurred in or before the previous calendar year. Same-year withdrawals do not restore room until January 1 of the following year.",
            "Growth uses a constant annual return with even monthly reinvestment. Real-world returns are not linear, and market losses in early years can change the outcome materially.",
          ]}
          sources={[
            { label: "CRA: Tax-Free Savings Account (TFSA) overview", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html" },
            { label: "CRA: TFSA contribution room", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributions.html" },
            { label: "CRA: Tax payable on excess TFSA amounts", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/tax-payable-tfsa.html" },
          ]}
        />

        <FAQ items={TFSA_FAQS} />
      </div>
    </>
  );
}
