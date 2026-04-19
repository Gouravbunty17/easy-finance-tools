import React, { useMemo, useState } from "react";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import ActionableNextSteps from "../../components/ActionableNextSteps";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const TFSA_FAQS = [
  {
    q: "What is the TFSA contribution limit for 2026?",
    a: "The 2026 TFSA annual limit is $7,000, unchanged from 2024 and 2025. Cumulative room for someone eligible every year since 2009 reaches $102,000 in 2026. CRA announces the annual limit each fall after indexing to inflation and rounding to the nearest $500.",
  },
  {
    q: "What happens if I over-contribute to my TFSA?",
    a: "CRA charges a 1% monthly penalty on the highest excess amount in your TFSA for every month the over-contribution stays in the account. You must withdraw the excess as soon as you notice it, and you can file form RC243 to request that CRA assess or waive the tax.",
  },
  {
    q: "Can I re-contribute a TFSA withdrawal in the same calendar year?",
    a: "Only if you still have existing unused room equal to the re-contribution. Withdrawals are added back to your room on January 1 of the following year, not immediately. Same-year re-contributions that push you over your room are treated as over-contributions and attract the 1% monthly penalty.",
  },
  {
    q: "Are dividends and capital gains inside a TFSA taxable?",
    a: "Canadian dividends, interest, and capital gains earned inside a TFSA are fully tax-free and never reported on your personal tax return. US dividends are subject to a 15% US withholding tax that is not recoverable inside a TFSA, because the TFSA is not recognized as a retirement account under the Canada-US tax treaty.",
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
        description="Estimate TFSA contribution room from your eligibility year, then project tax-free growth with clean input boxes instead of sliders."
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
        footerNote="Educational estimate only. Same-year TFSA withdrawals are generally added back on January 1 of the following year, so always verify room with CRA My Account before acting."
      >
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
          intro="Use this as a fast planning pass, then confirm your exact room with CRA before you contribute."
          meaning={`Based on the inputs above, your estimated available TFSA room is ${fmtCAD(result.estimatedRoom)} and your projected value in ${fmtNum(years)} years is ${fmtCAD(result.projection.endingBalance)}.`}
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
            This TFSA calculator answers two questions at once: how much TFSA room you likely have left right now, and how that balance could grow if you keep contributing. The room estimate starts from your first year of eligibility, adds every annual limit announced by CRA through 2026, and subtracts your net lifetime contributions to give a directional figure you can sanity-check against CRA My Account. The growth projection reinvests monthly contributions at a constant annual return, which is useful for seeing whether what you contribute is actually pacing you toward your goal.
          </p>
          <p>
            Two inputs move the number more than the rest. Your birth year and residency year anchor your eligibility start — shift either by a single year and your cumulative room can change by several thousand dollars. Your total lifetime contributions, net of prior withdrawals, is the figure CRA ultimately compares against your room cap when penalties are assessed. Before you rely on the calculator for a large deposit, log in to CRA My Account; it is the only authoritative source because mid-year deposits, administrative processing lags, and withdrawal reinstatement timing can all shift your available room.
          </p>

          <h2>The 2026 TFSA rules</h2>
          <p>
            The TFSA annual limit for 2026 is <strong>$7,000</strong>, unchanged from 2024 and 2025. Someone who was 18 or older, a Canadian tax resident in 2009, and has never contributed has <strong>$102,000</strong> of cumulative room in 2026. Room carries forward indefinitely — skipping a year does not cost you any eligibility, and unused room from 2009 is still available today.
          </p>
          <p>
            Two rules catch people out most often. First, <strong>withdrawals are added back with a one-year lag</strong>: a $10,000 withdrawal in 2026 does not free up $10,000 of room until January 1, 2027. Re-contributing that same amount in the same calendar year can trigger a 1% monthly penalty on the excess. Second, <strong>room accrues from your eligibility year, not from 2009 automatically</strong>. A newcomer who became a Canadian resident in 2015 starts their TFSA clock in 2015.
          </p>
          <p>
            Investment growth inside the TFSA — dividends, interest, capital gains — is entirely tax-free and does not count against your contribution room. If you invest $7,000 and it grows to $12,000, you have used $7,000 of room, not $12,000.
          </p>

          <h2>Common TFSA mistakes</h2>
          <p>
            The most expensive mistake we see is <strong>re-contributing a same-year withdrawal</strong>. A reader who withdrew $15,000 in March to cover a gap and redeposited it in November was assessed a 1% monthly over-contribution penalty for each month the contributions exceeded available room. Always wait until January 1 of the following year before replacing a withdrawal unless you still have separate unused room.
          </p>
          <p>
            The second is <strong>holding US-listed dividend stocks in a TFSA</strong>. US dividends paid into a TFSA are subject to a 15% US withholding tax, and the tax is not recoverable because the TFSA is not treaty-recognized as a retirement account. The same dividends held inside an RRSP avoid that withholding entirely. For a dividend-heavy US portfolio, account choice can matter more than the growth math.
          </p>
          <p>
            The third is treating TFSA room as "use it or lose it." It is not — room carries forward indefinitely for every year you are an eligible resident. The fourth is <strong>day-trading inside a TFSA</strong>; CRA can reclassify frequent active trading as a business and tax the gains as business income, a reassessment that has caught reader after reader off guard.
          </p>

          <h2>A worked example</h2>
          <p>
            Suppose you were born in 1992, became a Canadian resident in 2010, and have contributed $40,000 lifetime with $5,000 in prior withdrawals that have since been added back. Your eligibility year is 2010 (the year you turned 18). Adding the 2010–2026 annual limits gives $94,500 of cumulative accrued room. Subtracting net contributions of $35,000 ($40,000 minus $5,000 of withdrawals restored to room) leaves an estimated <strong>$59,500</strong> of room available for your 2026 contribution.
          </p>
          <p>
            If you then contribute $400 a month on top of a $25,000 current balance at a 6% average annual return for 15 years, the projected ending value is roughly <strong>$157,700</strong> — of which about <strong>$85,700</strong> is tax-free growth. That growth is the real point of the TFSA. The room estimate tells you how much more you can shelter; the projection tells you why sheltering matters. Adjust any slider above and all four numbers — eligibility year, accrued room, estimated available room, and projected value — recalculate instantly.
          </p>
        </article>

        <MethodologyPanel
          summary="This TFSA calculator estimates available contribution room by summing CRA-announced annual limits from your eligibility year through 2026, then subtracting your net lifetime contributions. Growth is projected using a constant annual return compounded monthly with even contribution pacing, which is a planning approximation rather than a market forecast."
          assumptions={[
            "Annual limits used: $5,000 (2009–2012), $5,500 (2013–2014), $10,000 (2015), $5,500 (2016–2018), $6,000 (2019–2022), $6,500 (2023), and $7,000 (2024–2026).",
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
