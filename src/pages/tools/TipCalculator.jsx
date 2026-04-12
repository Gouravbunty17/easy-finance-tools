import React, { useMemo, useState } from "react";
import NumberInput from "../../components/NumberInput";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

const provinceHints = {
  ON: "Ontario restaurant bills already include HST before you choose a tip.",
  QC: "Quebec diners often decide the tip based on the pre-tax subtotal.",
  BC: "In British Columbia, tips are commonly chosen on the pre-tax amount.",
  AB: "Alberta has no provincial sales tax, so pre-tax and after-tax subtotals are closer.",
};

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState(75);
  const [tipPercent, setTipPercent] = useState(18);
  const [splitCount, setSplitCount] = useState(2);
  const [tipBeforeTax, setTipBeforeTax] = useState(true);
  const [province, setProvince] = useState("ON");
  const [taxAmount, setTaxAmount] = useState(9.75);

  const result = useMemo(() => {
    const subtotal = asNumber(billAmount);
    const tax = asNumber(taxAmount);
    const tipBase = tipBeforeTax ? subtotal : subtotal + tax;
    const tip = tipBase * (asNumber(tipPercent) / 100);
    const total = subtotal + tax + tip;
    const split = Math.max(1, asNumber(splitCount, 1));

    return {
      tip,
      total,
      eachPays: total / split,
      effectiveTipRate: subtotal > 0 ? (tip / subtotal) * 100 : 0,
    };
  }, [billAmount, taxAmount, tipBeforeTax, tipPercent, splitCount]);

  return (
    <CalculatorLayout
      title="Tip Calculator Canada"
      description="Work out the tip, total bill, and split amount with input boxes only. Useful for restaurant bills, delivery totals, and quick after-tax or pre-tax tip checks."
      canonical="https://easyfinancetools.com/tools/tip-calculator"
      badge="Simple bill split"
      results={
        <>
          <ResultCard label="Tip amount" value={fmtCAD(result.tip, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} tone="primary" />
          <ResultCard label="Total bill" value={fmtCAD(result.total, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} hint={`Each person pays ${fmtCAD(result.eachPays, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} when split ${fmtNum(splitCount)} ways.`} />
          <ResultCard label="Effective tip rate" value={`${fmtNum(result.effectiveTipRate, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`} hint={provinceHints[province] || "Choose whether you want to tip on the pre-tax or after-tax amount."} tone="success" />
        </>
      }
      relatedTools={[
        { href: "/tools/budget-tracker", title: "Budget tracker", body: "Roll dining and delivery spending into your monthly cash-flow plan." },
        { href: "/tools/net-pay-calculator", title: "Pay stub calculator", body: "See how your next paycheque supports spending and savings." },
        { href: "/tools/income-tax-calculator", title: "Income tax calculator", body: "Check take-home pay before deciding how much room you have to spend." },
      ]}
      footerNote="Educational estimate only. Restaurants and payment terminals may suggest different tip flows."
    >
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-5 md:grid-cols-2">
          <NumberInput
            id="tip-bill"
            label="Bill before tip"
            prefix="$"
            value={billAmount}
            onChange={(value) => setBillAmount(parseNumericInput(value))}
            placeholder="75.00"
            hint="Enter the subtotal before the tip is added."
          />
          <NumberInput
            id="tip-tax"
            label="Sales tax on the bill"
            prefix="$"
            value={taxAmount}
            onChange={(value) => setTaxAmount(parseNumericInput(value))}
            placeholder="9.75"
            hint="Optional if you want to compare pre-tax and after-tax tipping."
          />
          <NumberInput
            id="tip-percent"
            label="Tip percentage"
            suffix="%"
            value={tipPercent}
            onChange={(value) => setTipPercent(parseNumericInput(value))}
            placeholder="18"
            hint="Common ranges are 15%, 18%, and 20%."
          />
          <NumberInput
            id="tip-split"
            label="Split between people"
            value={splitCount}
            onChange={(value) => setSplitCount(parseNumericInput(value, { integer: true }))}
            placeholder="2"
            inputMode="numeric"
            hint="Use 1 if you are paying the whole bill."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Province or territory</span>
            <select
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="ON">Ontario</option>
              <option value="QC">Quebec</option>
              <option value="BC">British Columbia</option>
              <option value="AB">Alberta</option>
              <option value="MB">Manitoba</option>
              <option value="SK">Saskatchewan</option>
              <option value="NS">Nova Scotia</option>
              <option value="NB">New Brunswick</option>
              <option value="NL">Newfoundland and Labrador</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <input
              type="checkbox"
              checked={tipBeforeTax}
              onChange={(event) => setTipBeforeTax(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            Calculate tip on the pre-tax subtotal
          </label>
        </div>
      </div>
    </CalculatorLayout>
  );
}
