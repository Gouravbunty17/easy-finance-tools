import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NumberInput from "../../components/NumberInput";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const TAX_RATES = {
  AB: { name: "Alberta", gst: 5, pst: 0, hst: 0, qst: 0 },
  BC: { name: "British Columbia", gst: 5, pst: 7, hst: 0, qst: 0 },
  MB: { name: "Manitoba", gst: 5, pst: 7, hst: 0, qst: 0 },
  NB: { name: "New Brunswick", gst: 0, pst: 0, hst: 15, qst: 0 },
  NL: { name: "Newfoundland and Labrador", gst: 0, pst: 0, hst: 15, qst: 0 },
  NS: { name: "Nova Scotia", gst: 0, pst: 0, hst: 15, qst: 0 },
  NT: { name: "Northwest Territories", gst: 5, pst: 0, hst: 0, qst: 0 },
  NU: { name: "Nunavut", gst: 5, pst: 0, hst: 0, qst: 0 },
  ON: { name: "Ontario", gst: 0, pst: 0, hst: 13, qst: 0 },
  PE: { name: "Prince Edward Island", gst: 0, pst: 0, hst: 15, qst: 0 },
  QC: { name: "Quebec", gst: 5, pst: 0, hst: 0, qst: 9.975 },
  SK: { name: "Saskatchewan", gst: 5, pst: 6, hst: 0, qst: 0 },
  YT: { name: "Yukon", gst: 5, pst: 0, hst: 0, qst: 0 },
};

function getCombinedRate(taxConfig) {
  return taxConfig.hst || taxConfig.gst + taxConfig.pst + taxConfig.qst;
}

const FAQS = [
  {
    q: "Does this GST/HST calculator cover every exemption?",
    a: "No. It uses standard provincial and territorial sales-tax rates. Some goods and services are zero-rated, exempt, or subject to special rules.",
  },
  {
    q: "Why does Quebec show GST and QST instead of HST?",
    a: "Quebec uses GST plus QST rather than a harmonized HST rate, so the calculator shows the combined effect separately.",
  },
  {
    q: "What is reverse sales tax mode?",
    a: "Reverse mode starts with a tax-included total and estimates the pre-tax amount and tax portion.",
  },
  {
    q: "Can I use this for invoices?",
    a: "You can use it for quick planning, but business invoices should still follow CRA and provincial tax registration rules.",
  },
];

export default function GstHstCalculator() {
  const [province, setProvince] = useState("ON");
  const [amount, setAmount] = useState(100);
  const [mode, setMode] = useState("add");

  const taxConfig = TAX_RATES[province];

  const result = useMemo(() => {
    const currentAmount = asNumber(amount);
    const totalRate = getCombinedRate(taxConfig) / 100;

    if (mode === "remove") {
      const pretax = totalRate > 0 ? currentAmount / (1 + totalRate) : currentAmount;
      const tax = currentAmount - pretax;
      return {
        pretax,
        tax,
        finalAmount: currentAmount,
      };
    }

    const tax = currentAmount * totalRate;
    return {
      pretax: currentAmount,
      tax,
      finalAmount: currentAmount + tax,
    };
  }, [amount, mode, taxConfig]);

  const taxLines = [
    taxConfig.hst ? { label: "HST", rate: taxConfig.hst } : null,
    taxConfig.gst ? { label: "GST", rate: taxConfig.gst } : null,
    taxConfig.pst ? { label: "PST", rate: taxConfig.pst } : null,
    taxConfig.qst ? { label: "QST", rate: taxConfig.qst } : null,
  ].filter(Boolean);

  return (
    <CalculatorLayout
      title="GST/HST Calculator Canada | Add or Reverse Sales Tax"
      description="Calculate GST, HST, PST, and QST by province in Canada. Add sales tax to a pre-tax price or reverse tax from a final tax-included amount."
      canonical="https://easyfinancetools.com/tools/gst-hst-calculator"
      badge="Reverse tax included"
      results={
        <>
          <ResultCard
            label={mode === "remove" ? "Pre-tax amount" : "Tax amount"}
            value={fmtCAD(mode === "remove" ? result.pretax : result.tax, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            tone="primary"
          />
          <ResultCard
            label={mode === "remove" ? "Tax removed" : "Final total"}
            value={fmtCAD(mode === "remove" ? result.tax : result.finalAmount, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`${taxConfig.name} total sales tax rate: ${fmtNum(getCombinedRate(taxConfig), { maximumFractionDigits: 3, minimumFractionDigits: taxConfig.qst ? 3 : 0 })}%`}
          />
          <ResultCard
            label="Tax breakdown"
            value={taxLines.map((line) => `${line.label} ${fmtNum(line.rate, { maximumFractionDigits: 3, minimumFractionDigits: line.rate % 1 ? 3 : 0 })}%`).join(" / ")}
            hint="Use reverse mode when the receipt already shows a tax-included total."
            tone="success"
          />
        </>
      }
      relatedTools={[
        { href: "/tools/income-tax-calculator", title: "Income tax calculator", body: "Move from purchase-level tax into annual tax and take-home planning." },
        { href: "/tools/net-pay-calculator", title: "Net pay calculator", body: "Compare after-tax spending with estimated take-home pay." },
        { href: "/tools/tip-calculator", title: "Tip calculator", body: "Check the total after tax and tip when you are eating out or splitting bills." },
      ]}
      footerNote="Rates shown are standard provincial sales tax rates and do not reflect every exemption or product-specific rule."
    >
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-wrap gap-3">
          {[
            { key: "add", label: "Add tax to a pre-tax amount" },
            { key: "remove", label: "Remove tax from a final amount" },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setMode(option.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                mode === option.key
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <NumberInput
            id="gst-amount"
            label={mode === "remove" ? "Final amount with tax included" : "Pre-tax amount"}
            prefix="$"
            value={amount}
            onChange={(value) => setAmount(parseNumericInput(value))}
            placeholder="100.00"
            hint={mode === "remove" ? "Use the full amount shown on the receipt or invoice." : "Use the amount before GST, HST, PST, or QST."}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Province or territory</span>
            <select
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {Object.entries(TAX_RATES).map(([code, config]) => (
                <option key={code} value={code}>
                  {config.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Quebec is shown as separate GST and QST. Ontario and the Atlantic HST provinces are combined as HST.
            </p>
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold text-primary dark:text-accent">How this mode works</p>
          <p className="mt-2 leading-7">
            {mode === "remove"
              ? "Reverse mode divides the tax-included amount by one plus the combined sales tax rate, then isolates the tax portion."
              : "Add-tax mode multiplies the pre-tax amount by the province's combined rate, then adds that tax to the subtotal."}
          </p>
        </div>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What this calculator does</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Estimate Canadian sales tax before or after checkout</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Use this tool to add GST, HST, PST, or QST to a pre-tax price, or reverse a tax-included receipt to estimate the pre-tax subtotal. It is useful for Canadian shoppers, freelancers, and small-business planning checks.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use it</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Choose province first, then choose add or reverse mode</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Select the province or territory where the sale occurs, enter the amount, and choose whether that amount is before tax or already includes tax. The result updates instantly as the province or mode changes.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Inputs explained</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What changes the GST/HST result</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["Amount", mode === "remove" ? "The tax-included total from the receipt or invoice." : "The pre-tax price before sales tax is added."],
            ["Province", "The province or territory controls whether GST, PST, QST, or HST applies."],
            ["Mode", "Add mode calculates tax on top. Reverse mode backs tax out of a final total."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="font-bold text-primary dark:text-accent">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Example calculation</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Example: {taxConfig.name} sales tax</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            With {fmtCAD(asNumber(amount), { maximumFractionDigits: 2, minimumFractionDigits: 2 })} entered in {taxConfig.name}, the calculator uses a combined rate of {fmtNum(getCombinedRate(taxConfig), { maximumFractionDigits: 3, minimumFractionDigits: taxConfig.qst ? 3 : 0 })}%. The estimated tax portion is {fmtCAD(result.tax, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to read your result</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use final total for budgeting, not just the shelf price</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The final total is the amount you would plan to pay before any discounts, exemptions, or special product rules. If you are building a monthly plan, compare after-tax spending with the <Link to="/tools/net-pay-calculator" className="text-primary underline dark:text-secondary">net pay calculator</Link> or browse the <Link to="/tools" className="text-primary underline dark:text-secondary">tools hub</Link>.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Sales tax depends on what is being sold</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <li>- Assuming every item is taxable at the standard rate.</li>
          <li>- Using the wrong province when the place of supply is different from your home address.</li>
          <li>- Treating reverse mode as a substitute for proper invoice or accounting records.</li>
          <li>- Forgetting that tips, shipping, discounts, or business tax rules can change the final calculation.</li>
        </ul>
      </section>

      <MethodologyPanel
        title="Methodology: how this GST/HST calculator works"
        summary="The calculator selects the standard sales-tax configuration for the province or territory, combines the applicable GST, PST, QST, or HST rate, then either adds tax to a subtotal or reverses tax from a final total."
        assumptions={[
          "Rates are standard provincial or territorial sales-tax rates for common taxable purchases.",
          "Product-specific exemptions, zero-rated supplies, and business registration rules are not modeled.",
          "Reverse mode divides the final amount by one plus the combined tax rate.",
          "Quebec is modeled with GST plus QST rather than HST.",
        ]}
        sources={[
          { label: "CRA: GST/HST", href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html" },
          { label: "EasyFinanceTools methodology", href: "https://easyfinancetools.com/methodology" },
        ]}
        note="Educational estimate only. Verify tax-specific treatment with CRA, your provincial tax authority, or a qualified professional."
      />

      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related tools and guides</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/tools" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">All calculators</Link>
          <Link to="/tools/compound-interest-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Compound interest calculator</Link>
          <Link to="/blog/how-to-start-investing-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Beginner investing guide</Link>
        </div>
      </section>

      <FAQ items={FAQS} />
    </CalculatorLayout>
  );
}
