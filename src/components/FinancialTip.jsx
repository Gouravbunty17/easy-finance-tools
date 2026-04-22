import { useEffect, useState } from "react";

const tips = [
  { tip: "Max out your TFSA first if it fits your situation. Qualified growth is tax-free.", tag: "TFSA" },
  { tip: "Unused TFSA room carries forward every year. Check CRA My Account for your exact limit.", tag: "TFSA" },
  { tip: "RRSP contributions reduce taxable income and can be most useful in higher tax brackets.", tag: "RRSP" },
  { tip: "The FHSA gives eligible first-time buyers $8,000 in annual room.", tag: "FHSA" },
  { tip: "Eligible dividends from Canadian companies can receive more favourable tax treatment than salary income.", tag: "Dividends" },
  { tip: "Capital gains are partly taxable, which can make long-term investing more tax-efficient than salary income.", tag: "Tax" },
  { tip: "CPP is reduced if you start at 60 and increased if you delay to 70.", tag: "Retirement" },
  { tip: "OAS increases by 0.6% for every month you delay past 65, up to 36% more at age 70.", tag: "Retirement" },
  { tip: "A TFSA can hold stocks, ETFs, GICs, and bonds, not just savings deposits.", tag: "TFSA" },
  { tip: "DRIP automatically reinvests dividends into more shares, which can support long-term compounding.", tag: "Dividends" },
  { tip: "Rule of 72: divide 72 by your return rate to estimate roughly how long it takes to double your money.", tag: "Investing" },
  { tip: "Over-contributing to a TFSA can trigger a monthly penalty on the excess amount.", tag: "TFSA" },
  { tip: "A common emergency fund target is 3 to 6 months of essential expenses.", tag: "Budgeting" },
  { tip: "RRSP contributions made before the annual deadline can often apply to the prior tax year.", tag: "RRSP" },
  { tip: "$100 per month invested at 7% for 30 years grows to over $120,000.", tag: "Investing" },
  { tip: "MER matters: a 1% fee difference over 25 years can cost you tens of thousands of dollars.", tag: "ETFs" },
  { tip: "Index ETFs like XEQT or VEQT give you broad diversification in one fund.", tag: "ETFs" },
  { tip: "The RRSP Home Buyers' Plan can help first-time buyers access RRSP funds, subject to repayment rules.", tag: "RRSP" },
  { tip: "Automating savings on payday makes good behaviour easier to repeat.", tag: "Budgeting" },
  { tip: "High-interest debt often deserves attention before long-term investing contributions.", tag: "Debt" },
  { tip: "Rebalancing once a year can help keep your asset mix aligned with your plan.", tag: "Investing" },
  { tip: "Holding many U.S. dividend stocks in an RRSP may have different withholding treatment than in a TFSA.", tag: "Tax" },
  { tip: "Mortgage prepayments go directly to principal and can materially reduce interest.", tag: "Mortgage" },
  { tip: "The FHSA has $40,000 in lifetime room under current rules.", tag: "FHSA" },
  { tip: "Your credit score can affect the mortgage pricing available to you.", tag: "Credit" },
  { tip: "Dollar-cost averaging means investing a fixed amount regularly instead of trying to time the market.", tag: "Investing" },
  { tip: "GICs can be useful lower-risk savings options when covered by the relevant deposit insurance rules.", tag: "Savings" },
  { tip: "Spousal RRSP contributions can help with household retirement-income planning.", tag: "RRSP" },
  { tip: "Tracking food and dining spending often reveals the easiest place to reduce costs.", tag: "Budgeting" },
  { tip: "Paying off very high-interest debt can create a strong risk-free return relative to investing.", tag: "Debt" },
  { tip: "A better mortgage rate can save thousands over the full amortization period.", tag: "Mortgage" },
];

const tagColors = {
  TFSA: "bg-blue-100 text-blue-700",
  RRSP: "bg-green-100 text-green-700",
  FHSA: "bg-orange-100 text-orange-700",
  Dividends: "bg-yellow-100 text-yellow-700",
  Tax: "bg-red-100 text-red-700",
  Retirement: "bg-purple-100 text-purple-700",
  Investing: "bg-indigo-100 text-indigo-700",
  ETFs: "bg-teal-100 text-teal-700",
  Budgeting: "bg-pink-100 text-pink-700",
  Debt: "bg-rose-100 text-rose-700",
  Mortgage: "bg-amber-100 text-amber-700",
  Credit: "bg-cyan-100 text-cyan-700",
  Savings: "bg-emerald-100 text-emerald-700",
};

function getTipForToday() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return tips[dayOfYear % tips.length];
}

export default function FinancialTip() {
  const [tip, setTip] = useState(tips[0]);

  useEffect(() => {
    setTip(getTipForToday());
  }, []);

  const tagCls = tagColors[tip.tag] || "bg-gray-100 text-gray-600";

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 px-6 py-5 shadow-sm dark:border-yellow-900/40 dark:from-gray-800 dark:to-gray-750">
      <div className="mt-0.5 rounded-2xl bg-white/70 px-3 py-2 text-sm font-black uppercase tracking-[0.22em] text-amber-700 shadow-sm dark:bg-white/10 dark:text-amber-300">
        Tip
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-yellow-700 dark:text-yellow-400">Tip of the Day</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tagCls}`}>{tip.tag}</span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-200">{tip.tip}</p>
      </div>
    </div>
  );
}
