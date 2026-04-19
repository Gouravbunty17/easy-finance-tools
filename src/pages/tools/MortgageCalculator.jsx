import React, { useMemo, useState } from "react";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const MORTGAGE_FAQS = [
  {
    q: "What is the minimum down payment for a home in Canada?",
    a: "5% on the first $500,000 of purchase price, 10% on the portion between $500,000 and $1,499,999, and 20% on any home priced at $1,500,000 or more. The $1.5 million insurable threshold was raised from $1 million on December 15, 2024 as part of federal mortgage-rule changes.",
  },
  {
    q: "What is CMHC mortgage insurance and when is it required?",
    a: "Mortgage default insurance is required on any mortgage with less than 20% down, up to a maximum insurable purchase price of $1,499,999. CMHC is the federal Crown corporation that issues the insurance; Sagen and Canada Guaranty are private alternatives. The premium, typically 2.80% to 4.00% of the mortgage amount, is added to your principal rather than paid out of pocket at closing.",
  },
  {
    q: "Why does Canadian mortgage math use semi-annual compounding?",
    a: "Section 6 of the Interest Act of Canada requires interest on fixed-rate mortgages to be calculated on a basis no more frequent than semi-annual. This is different from American mortgages, which compound monthly. The result is a slightly lower effective monthly rate, and a slightly lower monthly payment, at the same stated interest rate.",
  },
  {
    q: "How much does accelerated bi-weekly actually save?",
    a: "Accelerated bi-weekly divides the monthly payment in half and applies it every two weeks. Because there are 26 bi-weekly periods in a year, you effectively make 13 monthly payments annually instead of 12. On a typical 25-year mortgage this shortens the amortization by three to four years and saves tens of thousands in total interest.",
  },
  {
    q: "What is the mortgage stress test?",
    a: "Federally regulated lenders must qualify borrowers at the greater of their contract rate plus 2%, or the 5.25% minimum qualifying rate (MQR) set by OSFI. The test applies to both insured and uninsured mortgages and protects against rate increases during the term. A contract rate of 5.25% therefore qualifies you at 7.25%.",
  },
  {
    q: "What is the maximum amortization in Canada?",
    a: "Insured mortgages are generally capped at 25 years. A 30-year amortization became available on December 15, 2024 for first-time buyers purchasing a newly built home. Uninsured mortgages (20% or more down) can be amortized up to 30 years with most federally regulated lenders.",
  },
  {
    q: "How does the Bank of Canada policy rate affect my mortgage?",
    a: "Variable-rate mortgages move with the lender's prime rate, which tracks the Bank of Canada's overnight policy rate. Fixed rates are primarily influenced by five-year Government of Canada bond yields, not directly by the policy rate. Variable mortgages respond almost immediately after a BoC decision; fixed mortgages only reset at renewal.",
  },
  {
    q: "Should I choose a fixed or variable mortgage?",
    a: "Neither is universally better. Historical Bank of Canada research has shown variable rates cost less on average, but with more short-term payment volatility. Fixed rates offer payment certainty and protect against sharp rate moves within the term. The right answer depends on your budget cushion, your rate outlook, and whether you might break the mortgage early.",
  },
];

const PROVINCES = {
  AB: { label: "Alberta", landTransferTaxRate: 0 },
  BC: { label: "British Columbia", landTransferTaxRate: 0.018 },
  MB: { label: "Manitoba", landTransferTaxRate: 0.015 },
  NB: { label: "New Brunswick", landTransferTaxRate: 0.01 },
  NL: { label: "Newfoundland and Labrador", landTransferTaxRate: 0 },
  NS: { label: "Nova Scotia", landTransferTaxRate: 0.015 },
  NT: { label: "Northwest Territories", landTransferTaxRate: 0 },
  NU: { label: "Nunavut", landTransferTaxRate: 0 },
  ON: { label: "Ontario", landTransferTaxRate: 0.015 },
  PE: { label: "Prince Edward Island", landTransferTaxRate: 0.01 },
  QC: { label: "Quebec", landTransferTaxRate: 0.01 },
  SK: { label: "Saskatchewan", landTransferTaxRate: 0 },
  YT: { label: "Yukon", landTransferTaxRate: 0 },
};

function getMonthlyRate(annualRate) {
  return Math.pow(1 + annualRate / 200, 1 / 6) - 1;
}

function calcPayment(principal, annualRate, months) {
  const monthlyRate = getMonthlyRate(annualRate);
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

function getCMHC(principal, homePrice) {
  const ratio = principal / homePrice;
  if (ratio <= 0.8) return 0;
  if (ratio <= 0.85) return principal * 0.028;
  if (ratio <= 0.9) return principal * 0.031;
  return principal * 0.04;
}

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(650000);
  const [downPayment, setDownPayment] = useState(130000);
  const [rate, setRate] = useState(5.25);
  const [amortization, setAmortization] = useState(25);
  const [frequency, setFrequency] = useState("monthly");
  const [province, setProvince] = useState("ON");

  const result = useMemo(() => {
    const price = asNumber(homePrice);
    const down = asNumber(downPayment);
    const principal = Math.max(0, price - down);
    const cmhc = principal > 0 ? getCMHC(principal, price || 1) : 0;
    const insuredPrincipal = principal + cmhc;
    const monthlyPayment = calcPayment(insuredPrincipal, asNumber(rate), Math.max(1, asNumber(amortization, 25)) * 12);

    let scheduledPayment = monthlyPayment;
    let label = "Monthly payment";
    if (frequency === "biweekly") {
      scheduledPayment = (monthlyPayment * 12) / 26;
      label = "Bi-weekly payment";
    } else if (frequency === "accelerated") {
      scheduledPayment = monthlyPayment / 2;
      label = "Accelerated bi-weekly payment";
    } else if (frequency === "weekly") {
      scheduledPayment = (monthlyPayment * 12) / 52;
      label = "Weekly payment";
    }

    const monthlyRate = getMonthlyRate(asNumber(rate));
    let balance = insuredPrincipal;
    let totalInterest = 0;
    for (let month = 0; month < Math.max(1, asNumber(amortization, 25)) * 12; month += 1) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      totalInterest += interest;
      balance = Math.max(0, balance - principalPaid);
    }

    return {
      downPct: price > 0 ? (down / price) * 100 : 0,
      cmhc: Math.round(cmhc),
      insuredPrincipal: Math.round(insuredPrincipal),
      scheduledPayment,
      label,
      totalInterest: Math.round(totalInterest),
      landTransferTax: Math.round(price * (PROVINCES[province]?.landTransferTaxRate || 0)),
    };
  }, [homePrice, downPayment, rate, amortization, frequency, province]);

  return (
    <>
    <CalculatorLayout
      title="Canadian Mortgage Calculator"
      description="Estimate mortgage payments using Canadian semi-annual compounding, simplified CMHC insurance handling, and province-level land transfer tax context."
      canonical="https://easyfinancetools.com/tools/mortgage-calculator"
      badge="Payment planning"
      results={
        <>
          <ResultCard
            label={result.label}
            value={fmtCAD(result.scheduledPayment, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`Mortgage amount including estimated CMHC: ${fmtCAD(result.insuredPrincipal)}.`}
            tone="primary"
          />
          <ResultCard
            label="Estimated total interest"
            value={fmtCAD(result.totalInterest)}
            hint={`${fmtNum(result.downPct, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}% down payment.`}
          />
          <ResultCard
            label="Land transfer tax estimate"
            value={fmtCAD(result.landTransferTax)}
            hint={`${PROVINCES[province]?.label || "Province"} planning estimate only. CMHC estimate: ${fmtCAD(result.cmhc)}.`}
            tone="success"
          />
        </>
      }
      relatedTools={[
        { href: "/tools/mortgage-affordability-calculator", title: "Mortgage affordability calculator", body: "Work backward from income and debt before you model the payment itself." },
        { href: "/tools/rent-vs-buy", title: "Rent vs buy calculator", body: "Compare the ownership scenario against continuing to rent." },
        { href: "/blog/pay-off-mortgage-faster-canada", title: "Mortgage payoff guide", body: "See how accelerated payments and prepayment choices change the path.", destinationType: "article" },
      ]}
      footerNote="Educational estimate only. Lender quotes, legal fees, insurance, condo fees, and municipal taxes can materially change your actual cost."
    >
      <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberInput id="mortgage-home-price" label="Home price" prefix="$" value={homePrice} onChange={(value) => setHomePrice(parseNumericInput(value))} placeholder="650000" />
          <NumberInput id="mortgage-down-payment" label="Down payment" prefix="$" value={downPayment} onChange={(value) => setDownPayment(parseNumericInput(value))} placeholder="130000" hint={result.downPct >= 20 ? "20% or more down: no CMHC estimate added." : "Under 20% down: simplified CMHC insurance estimate is added."} />
          <NumberInput id="mortgage-rate" label="Interest rate" value={rate} onChange={(value) => setRate(parseNumericInput(value))} placeholder="5.25" suffix="%" hint="Uses a semi-annual compounding conversion before monthly mortgage math." />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Amortization</span>
            <select value={amortization} onChange={(event) => setAmortization(Number(event.target.value))} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {[5, 10, 15, 20, 25, 30].map((years) => (
                <option key={years} value={years}>{years} years</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Payment frequency</span>
            <select value={frequency} onChange={(event) => setFrequency(event.target.value)} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <option value="monthly">Monthly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="accelerated">Accelerated bi-weekly</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Province</span>
            <select value={province} onChange={(event) => setProvince(event.target.value)} className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {Object.entries(PROVINCES).map(([code, config]) => (
                <option key={code} value={code}>{config.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </CalculatorLayout>

    <div className="mx-auto max-w-6xl px-4 pb-12">
      <article className="prose prose-lg prose-slate dark:prose-invert mt-10 max-w-none rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
        <h2>How this calculator works</h2>
        <p>
          This mortgage calculator estimates your regular payment, the total interest over a full amortization, and a province-specific land transfer tax figure for a Canadian home purchase. It follows the two rules that make Canadian mortgages different from American ones: fixed-rate mortgages compound <strong>semi-annually, not monthly</strong>, and anything under 20% down triggers <strong>CMHC mortgage insurance</strong> that gets added directly to your principal rather than paid at closing.
        </p>
        <p>
          Start with the home price and down payment. The down-payment percentage updates automatically and tells you whether a CMHC premium is being added — the calculator uses a simplified premium schedule based on loan-to-value ratio. The amortization dropdown defaults to 25 years (the maximum for most insured mortgages) and allows up to 30 years for uninsured mortgages with at least 20% down. Frequency controls whether you see a monthly, bi-weekly, accelerated bi-weekly, or weekly figure — and accelerated bi-weekly is the one to watch, because it quietly shortens your amortization by several years.
        </p>

        <h2>Canadian amortization rules you need to know</h2>
        <p>
          Three rules shape every Canadian mortgage. <strong>Semi-annual compounding</strong> is required by the Interest Act for fixed-rate mortgages: a 5.25% quoted rate is converted to an effective monthly rate using <code>(1 + 0.0525/2)^(1/6) − 1</code>, not a simple <code>0.0525/12</code>. The calculator does this conversion automatically, which is why the monthly payment differs slightly from a US-style amortization tool.
        </p>
        <p>
          <strong>Down payment minimums</strong> follow a graduated rule: 5% on the first $500,000 of purchase price, 10% on any portion between $500,000 and $1,499,999, and 20% on homes priced at $1,500,000 or more. The $1.5 million insurable ceiling was raised from $1 million on December 15, 2024 as part of federal reforms aimed at first-time buyers.
        </p>
        <p>
          <strong>Amortization caps</strong> differ by insurance status. An insured mortgage is generally capped at 25 years, with a 30-year option available only for first-time buyers purchasing a newly built home. Uninsured mortgages (20%+ down) can stretch to 30 years at most federally regulated lenders. CMHC, Sagen, and Canada Guaranty are the three mortgage insurers; premiums typically range from 2.80% to 4.00% of the mortgage amount depending on loan-to-value ratio.
        </p>

        <h2>Common mistakes Canadian buyers make</h2>
        <p>
          <strong>Forgetting the stress test.</strong> Federally regulated lenders must qualify you at the greater of your contract rate plus 2%, or the 5.25% minimum qualifying rate set by OSFI. A 5.25% contract rate qualifies you at 7.25%. If your budget only works at the contract rate, the lender will not fund the mortgage.
        </p>
        <p>
          <strong>Ignoring closing costs.</strong> Land transfer tax, legal fees, title insurance, moving costs, and the adjustment for property taxes already paid by the seller typically add 1.5% to 4% of the purchase price on top of the down payment. Toronto buyers face both provincial and municipal land transfer taxes — on a million-dollar home that combined bill alone can exceed $30,000.
        </p>
        <p>
          <strong>Treating the posted rate as real.</strong> Most lenders will negotiate off posted rates, and mortgage brokers often access rates 40 to 80 basis points below what a bank homepage shows. A 50-basis-point difference on a $500,000 mortgage over 25 years is roughly $50,000 in total interest.
        </p>
        <p>
          <strong>Over-amortizing by default.</strong> A 30-year amortization lowers the monthly payment but materially increases total interest paid. If cash flow allows, a 25-year term or a prepayment strategy usually saves more than the payment relief costs.
        </p>

        <h2>A worked example</h2>
        <p>
          Consider a $650,000 home in Ontario with a $130,000 down payment (20%), a 5.25% fixed rate, 25-year amortization, and monthly payments. With exactly 20% down, the $520,000 principal is uninsured — no CMHC premium is added. Using Canadian semi-annual compounding, the effective monthly rate is approximately 0.4327%, producing a monthly payment of roughly <strong>$3,105</strong>. Total interest over the 25 years works out to about <strong>$411,500</strong>, meaning you repay $931,500 on a $520,000 borrowing.
        </p>
        <p>
          Switch the frequency to accelerated bi-weekly and the payment becomes $1,553 every two weeks. Because there are 26 such periods in a year, that is the equivalent of 13 monthly payments instead of 12 — one extra month per year. That single change shortens the amortization from 25 years to roughly 21 and cuts total interest by approximately $60,000. Ontario provincial land transfer tax on a $650,000 purchase is about $9,475, and a Toronto address would add a second, municipal land transfer tax of a similar amount. Toggle province, amortization, and frequency above to see how each lever changes the total cost of ownership.
        </p>
      </article>

      <MethodologyPanel
        summary="This mortgage calculator estimates a regular payment and total interest using Canadian semi-annual compounding, a simplified CMHC premium schedule, and province-level land transfer tax rates. It is a planning tool — actual lender quotes, municipal taxes, and legal fees can change the final figure materially."
        assumptions={[
          "Interest is compounded semi-annually in accordance with section 6 of the Interest Act of Canada and converted to an effective monthly rate before payment math.",
          "CMHC premiums are modeled with a simplified schedule: 2.80% at 80.01–85% loan-to-value, 3.10% at 85.01–90%, and 4.00% above 90%. Actual CMHC, Sagen, or Canada Guaranty quotes can differ.",
          "Land transfer tax uses a single provincial rate estimate. Municipal land transfer taxes (for example in Toronto) and first-time-buyer rebates are not included.",
          "Property taxes, condo fees, homeowner's insurance, and the OSFI stress test are not included in the monthly payment figure.",
        ]}
        sources={[
          { label: "CMHC: Mortgage loan insurance for consumers", href: "https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers/what-is-cmhc-mortgage-loan-insurance" },
          { label: "Department of Finance Canada: Making mortgages more affordable", href: "https://www.canada.ca/en/department-finance/news/2024/09/making-mortgages-more-affordable.html" },
          { label: "Bank of Canada: Key interest rate", href: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/" },
          { label: "OSFI Guideline B-20: Residential mortgage underwriting (stress test)", href: "https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline-b-20" },
          { label: "Interest Act (R.S.C., 1985, c. I-15), section 6", href: "https://laws-lois.justice.gc.ca/eng/acts/i-15/section-6.html" },
        ]}
      />

      <FAQ items={MORTGAGE_FAQS} />
    </div>
    </>
  );
}
