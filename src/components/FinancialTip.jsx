import { useMemo } from "react";

const tips = [
  { tip: "Max out your TFSA first — all growth is 100% tax-free, forever.", tag: "TFSA" },
  { tip: "Unused TFSA room carries forward every year. Check CRA My Account for your exact limit.", tag: "TFSA" },
  { tip: "RRSP contributions reduce your taxable income — great if you're in a higher tax bracket.", tag: "RRSP" },
  { tip: "The FHSA gives you $8,000/year in tax-deductible room if you're a first-time home buyer.", tag: "FHSA" },
  { tip: "Dividend income from Canadian companies qualifies for the dividend tax credit — taxed lower than salary.", tag: "Dividends" },
  { tip: "Capital gains in Canada are 50% taxable — investing is more tax-efficient than earning salary.", tag: "Tax" },
  { tip: "CPP drops to 60% if you take it at 60. Delay to 70 for 42% more per month — for life.", tag: "Retirement" },
  { tip: "OAS increases by 0.6% for every month you delay past 65, up to 36% more at age 70.", tag: "Retirement" },
  { tip: "A TFSA can hold stocks, ETFs, GICs, and bonds — not just savings accounts.", tag: "TFSA" },
  { tip: "DRIP (Dividend Reinvestment Plan) automatically buys more shares — compounding on autopilot.", tag: "Dividends" },
  { tip: "Rule of 72: divide 72 by your return rate to estimate how many years to double your money.", tag: "Investing" },
  { tip: "Over-contributing to your TFSA triggers a 1% penalty per month on the excess amount.", tag: "TFSA" },
  { tip: "Emergency fund rule: keep 3–6 months of expenses in a high-interest savings account.", tag: "Budgeting" },
  { tip: "RRSP deadline is usually March 1 — contributions apply to the previous tax year.", tag: "RRSP" },
  { tip: "$100/month invested at 7% for 30 years grows to over $120,000. Start early.", tag: "Investing" },
  { tip: "MER matters: a 1% fee difference over 25 years can cost you tens of thousands of dollars.", tag: "ETFs" },
  { tip: "Index ETFs like XEQT or VEQT give you global diversification in a single low-cost fund.", tag: "ETFs" },
  { tip: "The RRSP Home Buyers' Plan lets you withdraw up to $35,000 tax-free to buy your first home.", tag: "RRSP" },
  { tip: "Pay yourself first: automate savings on payday before you spend a single dollar.", tag: "Budgeting" },
  { tip: "High-interest debt (credit cards at 20%+) should always be paid before you start investing.", tag: "Debt" },
  { tip: "Rebalancing your portfolio once a year keeps your asset allocation on target.", tag: "Investing" },
  { tip: "Holding US stocks in an RRSP avoids the 15% US withholding tax on dividends.", tag: "Tax" },
  { tip: "Mortgage prepayments go directly to principal — even $100 extra/month saves thousands in interest.", tag: "Mortgage" },
  { tip: "The FHSA has $40,000 in total lifetime contribution room — use it before buying.", tag: "FHSA" },
  { tip: "Your credit score directly affects your mortgage rate — a 20-point swing can cost thousands.", tag: "Credit" },
  { tip: "Dollar-cost averaging — investing a fixed amount regularly — removes emotion from investing.", tag: "Investing" },
  { tip: "GICs are CDIC-insured up to $100,000 per depositor per category — a safe savings option.", tag: "Savings" },
  { tip: "Spousal RRSP contributions can reduce your household tax bill in retirement.", tag: "RRSP" },
  { tip: "Canada's Lifetime Capital Gains Exemption lets small business owners shelter up to $1.25M.", tag: "Tax" },
  { tip: "Tracking just your food and dining spending often reveals the easiest place to cut costs.", tag: "Budgeting" },
  { tip: "REITs held inside a TFSA earn rental income with zero tax — a powerful combination.", tag: "TFSA" },
  { tip: "The best investment you can make is paying off high-interest debt — guaranteed 20%+ return.", tag: "Debt" },
  { tip: "A 1% improvement in mortgage rate on a $500K mortgage saves over $30,000 in interest.", tag: "Mortgage" },
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

export default function FinancialTip() {
  const tip = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return tips[dayOfYear % tips.length];
  }, []);

  const tagCls = tagColors[tip.tag] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-750 border border-yellow-200 dark:border-yellow-900/40 rounded-2xl px-6 py-5 flex gap-4 items-start shadow-sm">
      <div className="text-3xl mt-0.5">💡</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">Tip of the Day</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagCls}`}>{tip.tag}</span>
        </div>
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed font-medium">{tip.tip}</p>
      </div>
    </div>
  );
}
