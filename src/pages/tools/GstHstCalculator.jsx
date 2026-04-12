import React, { useMemo, useState } from "react";
import NumberInput from "../../components/NumberInput";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
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
      title="GST/HST Calculator Canada"
      description="Add sales tax or reverse it from a final price. Covers GST-only provinces, GST plus PST provinces, HST provinces, and Quebec’s GST plus QST structure."
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
            value={taxLines.map((line) => `${line.label} ${fmtNum(line.rate, { maximumFractionDigits: 3, minimumFractionDigits: line.rate % 1 ? 3 : 0 })}%`).join(" • ")}
            hint="Use reverse mode when the receipt already shows a tax-included total."
            tone="success"
          />
        </>
      }
      relatedTools={[
        { href: "/tools/income-tax-calculator", title: "Income tax calculator", body: "Move from purchase-level tax into annual tax and take-home planning." },
        { href: "/tools/budget-tracker", title: "Budget tracker", body: "Use final after-tax costs inside your monthly spending plan." },
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
    </CalculatorLayout>
  );
}
