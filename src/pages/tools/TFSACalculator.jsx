import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolPageSchema from "../../components/ToolPageSchema";
import { trackToolCalculate, trackToolStart } from "../../lib/analytics";
import SurfaceTrackedLink from "../../components/SurfaceTrackedLink";
import ActionableNextSteps from "../../components/ActionableNextSteps";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const TFSA_FAQS = [
  { q: "How much TFSA room do I have in 2026?", a: "If you were 18 or older and a Canadian resident since 2009 and have never contributed, you have $109,000 in cumulative TFSA room in 2026. Your personal room depends on your age, residency history, prior contributions, and prior withdrawals." },
  { q: "What is the TFSA contribution limit for 2026?", a: "The TFSA annual contribution limit for 2026 is $7,000. The cumulative total since 2009 is $109,000 for someone eligible from the beginning and who has never contributed." },
  { q: "Can I withdraw from my TFSA and re-contribute?", a: "Yes. TFSA withdrawals are added back to your contribution room on January 1 of the following year. If you withdraw $10,000 in 2026, you usually regain that $10,000 of room on January 1, 2027, plus the new annual limit." },
  { q: "What happens if I over-contribute to my TFSA?", a: "Over-contributions are generally penalized at 1% per month on the excess amount until the excess is removed. Always verify your available room through CRA My Account before making a large contribution." },
  { q: "Is TFSA income taxed?", a: "No. Interest, dividends, and capital gains earned inside a TFSA are not taxed, and withdrawals are also tax-free." },
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

const TOTAL_ROOM = Object.values(TFSA_LIMITS).reduce((total, limit) => total + limit, 0);

function computeResult(birthYear, currentSavings, monthlyContrib, returnRate, years) {
  const eligibleSince = Math.max(2009, birthYear + 18);
  let contributionRoom = 0;

  for (let year = eligibleSince; year <= 2026; year += 1) {
    contributionRoom += TFSA_LIMITS[year] || 7000;
  }

  const monthlyRate = returnRate / 100 / 12;
  let balance = currentSavings;
  const projections = [];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyContrib;
    }
    projections.push({ year, value: Math.round(balance) });
  }

  const totalContributed = currentSavings + monthlyContrib * 12 * years;
  const totalGrowth = balance - totalContributed;

  return {
    age: 2026 - birthYear,
    contributionRoom,
    eligibleSince,
    projections,
    finalValue: Math.round(balance),
    totalContributed: Math.round(totalContributed),
    totalGrowth: Math.round(totalGrowth),
    taxSaved: Math.round(totalGrowth * 0.33),
  };
}

function computeTaxableAccount(currentSavings, monthlyContrib, returnRate, years, marginalRate) {
  const monthlyRate = returnRate / 100 / 12;
  const taxRate = marginalRate / 100;
  let balance = currentSavings;
  const projections = [];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 0; month < 12; month += 1) {
      const growth = balance * monthlyRate;
      const afterTaxGrowth = growth * (1 - taxRate);
      balance = balance + afterTaxGrowth + monthlyContrib;
    }
    projections.push({ year, value: Math.round(balance) });
  }

  return { finalValue: Math.round(balance), projections };
}

function SliderInput({ label, value, min, max, step, onChange, prefix = "", suffix = "", helpText }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-semibold">{label}</label>
        <span className="text-primary dark:text-accent font-bold text-sm">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full h-2 rounded-lg accent-primary cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>
          {prefix}
          {Number(min).toLocaleString()}
          {suffix}
        </span>
        <span>
          {prefix}
          {Number(max).toLocaleString()}
          {suffix}
        </span>
      </div>
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
}

export default function TFSACalculator() {
  const [searchParams] = useSearchParams();
  const [birthYear, setBirthYear] = useState(1990);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlyContrib, setMonthlyContrib] = useState(500);
  const [returnRate, setReturnRate] = useState(7);
  const [years, setYears] = useState(20);
  const [marginalRate, setMarginalRate] = useState(33);
  const [showTable, setShowTable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  useEffect(() => {
    const by = searchParams.get("by");
    if (!by) return;

    setBirthYear(parseInt(by, 10) || 1990);
    setCurrentSavings(parseFloat(searchParams.get("cs")) || 0);
    setMonthlyContrib(parseFloat(searchParams.get("mc")) || 500);
    setReturnRate(parseFloat(searchParams.get("rr")) || 7);
    setYears(parseInt(searchParams.get("yr"), 10) || 20);
  }, [searchParams]);

  const result = useMemo(
    () => computeResult(birthYear, currentSavings, monthlyContrib, returnRate, years),
    [birthYear, currentSavings, monthlyContrib, returnRate, years]
  );

  const taxable = useMemo(
    () => computeTaxableAccount(currentSavings, monthlyContrib, returnRate, years, marginalRate),
    [currentSavings, monthlyContrib, returnRate, years, marginalRate]
  );

  const tfsaAdvantage = result.finalValue - taxable.finalValue;
  const monthlyToMax = Math.max(0, Math.round(7000 / 12 - monthlyContrib));

  const copyShareLink = () => {
    const url = new URL(window.location.href);
    url.search = `?by=${birthYear}&cs=${currentSavings}&mc=${monthlyContrib}&rr=${returnRate}&yr=${years}`;
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copySummary = () => {
    const summary = `Estimated TFSA value in ${years} years: $${result.finalValue.toLocaleString()}. Estimated contribution room from age eligibility: $${result.contributionRoom.toLocaleString()}. Inputs: birth year ${birthYear}, current balance $${currentSavings.toLocaleString()}, monthly contribution $${monthlyContrib.toLocaleString()}, expected return ${returnRate}%. Educational estimate only.`;
    navigator.clipboard.writeText(summary);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2500);
  };

  const trackStartOnce = () => {
    if (hasTrackedStart) return;
    trackToolStart("tfsa_calculator", { entry_point: "input_interaction" });
    setHasTrackedStart(true);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="TFSA Calculator 2026 - Free Canadian Tool"
        description="Calculate your TFSA contribution room and tax-free growth. Compare TFSA vs taxable account. Free Canadian calculator updated for 2026 limits. No signup required."
        canonical="https://easyfinancetools.com/tools/tfsa-calculator"
      />
      <ToolPageSchema
        name="TFSA Calculator 2026"
        description="Canadian TFSA calculator for contribution-room context, tax-free growth, and taxable-account comparison."
        canonical="https://easyfinancetools.com/tools/tfsa-calculator"
        category="FinanceApplication"
      />

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">TFSA Calculator 2026</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Calculate tax-free growth, estimate contribution room from age eligibility, and compare a TFSA against a taxable account.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>2026 TFSA limit:</strong> $7,000 per year &nbsp;|&nbsp;
          <strong>Lifetime room since 2009:</strong> ${TOTAL_ROOM.toLocaleString()} &nbsp;|&nbsp;
          <strong>Estimated room from age 18:</strong> ${result.contributionRoom.toLocaleString()}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-6">
          <h2 className="font-bold text-lg text-primary dark:text-accent">Your details</h2>

          <SliderInput
            label="Birth Year"
            value={birthYear}
            min={1950}
            max={2008}
            step={1}
            onChange={(value) => {
              trackStartOnce();
              setBirthYear(value);
            }}
            helpText={`Age: ${2026 - birthYear}. Estimated TFSA eligibility since: ${result.eligibleSince}.`}
          />

          <SliderInput
            label="Current TFSA Balance"
            value={currentSavings}
            min={0}
            max={200000}
            step={1000}
            onChange={(value) => {
              trackStartOnce();
              setCurrentSavings(value);
            }}
            prefix="$"
          />

          <SliderInput
            label="Monthly Contribution"
            value={monthlyContrib}
            min={0}
            max={2000}
            step={50}
            onChange={(value) => {
              trackStartOnce();
              setMonthlyContrib(value);
              trackToolCalculate("tfsa_calculator", { action: "monthly_contribution_change" });
            }}
            prefix="$"
            suffix="/mo"
            helpText={
              monthlyToMax > 0
                ? `Contribute about $${monthlyToMax} more per month to reach the current annual TFSA limit.`
                : "You are contributing at or above the current annual TFSA pace."
            }
          />

          <SliderInput
            label="Expected Annual Return"
            value={returnRate}
            min={1}
            max={15}
            step={0.5}
            onChange={(value) => {
              trackStartOnce();
              setReturnRate(value);
            }}
            suffix="%"
            helpText="If you are unsure, try a conservative starting point such as 5% before testing other scenarios."
          />

          <SliderInput
            label="Investment Horizon"
            value={years}
            min={1}
            max={40}
            step={1}
            onChange={(value) => {
              trackStartOnce();
              setYears(value);
            }}
            suffix=" years"
          />

          <SliderInput
            label="Marginal Tax Rate for Comparison"
            value={marginalRate}
            min={15}
            max={55}
            step={0.5}
            onChange={(value) => {
              trackStartOnce();
              setMarginalRate(value);
            }}
            suffix="%"
            helpText="Used only to compare against a simple taxable-account scenario."
          />
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 text-center shadow">
            <p className="text-sm font-semibold opacity-80 mb-1">Estimated TFSA value in {years} years</p>
            <p className="text-5xl font-bold">${result.finalValue.toLocaleString()}</p>
            <div className="flex justify-center gap-4 mt-3 text-sm opacity-80">
              <span>Contributed: ${result.totalContributed.toLocaleString()}</span>
              <span>•</span>
              <span>Growth: ${result.totalGrowth.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Tax-free growth", value: `$${result.totalGrowth.toLocaleString()}`, color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" },
              { label: "TFSA vs taxable", value: `+$${tfsaAdvantage.toLocaleString()}`, color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300" },
              { label: "Tax saved estimate", value: `$${result.taxSaved.toLocaleString()}`, color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" },
              { label: "Contribution room", value: `$${result.contributionRoom.toLocaleString()}`, color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" },
            ].map((card) => (
              <div key={card.label} className={`border-2 rounded-xl p-4 ${card.color}`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
            <h3 className="font-bold text-primary dark:text-accent mb-3">TFSA vs taxable account</h3>
            <Line
              data={{
                labels: result.projections.map((point) => `Yr ${point.year}`),
                datasets: [
                  {
                    label: "TFSA",
                    data: result.projections.map((point) => point.value),
                    fill: true,
                    backgroundColor: "rgba(0,168,232,0.1)",
                    borderColor: "#00A8E8",
                    tension: 0.4,
                    pointRadius: 2,
                  },
                  {
                    label: `Taxable (${marginalRate}% tax)`,
                    data: taxable.projections.map((point) => point.value),
                    fill: false,
                    borderColor: "#ef4444",
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: $${Number(context.raw).toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => `$${(Number(value) / 1000).toFixed(0)}k`,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={() => {
                trackToolCalculate("tfsa_calculator", { action: "copy_summary" });
                copySummary();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                summaryCopied
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary"
              }`}
            >
              {summaryCopied ? "Summary copied" : "Copy summary"}
            </button>
            <button
              onClick={() => {
                trackToolCalculate("tfsa_calculator", { action: "copy_share_link" });
                copyShareLink();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                copied
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary"
              }`}
            >
              {copied ? "Link copied" : "Share my results"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <button
          onClick={() => setShowTable((value) => !value)}
          className="w-full flex items-center justify-between px-6 py-4 font-bold text-primary dark:text-accent text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition"
        >
          <span>Year-by-year breakdown</span>
          <span className="text-xl">{showTable ? "-" : "+"}</span>
        </button>
        {showTable && (
          <div className="overflow-x-auto border-t dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Year", "TFSA Balance", "Taxable Balance", "Advantage", "Total Contributed", "Total Growth"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-right first:text-left font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {result.projections.map((projection, index) => {
                  const taxableValue = taxable.projections[index]?.value || 0;
                  const contributed = currentSavings + monthlyContrib * 12 * projection.year;
                  const growth = projection.value - contributed;

                  return (
                    <tr key={projection.year} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                      <td className="px-4 py-2 font-medium">Year {projection.year}</td>
                      <td className="px-4 py-2 text-right font-semibold text-primary dark:text-accent">${projection.value.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">${taxableValue.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-green-600 dark:text-green-400 font-semibold">+${(projection.value - taxableValue).toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">${Math.round(contributed).toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">${Math.max(0, Math.round(growth)).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MethodologyPanel
        summary="This calculator estimates TFSA contribution room based on your birth year and models future growth with monthly contributions and a constant annual return. It is most useful for scenario planning, not for confirming your official CRA room."
        assumptions={[
          "Eligibility starts in the later of 2009 or the year you turned 18.",
          "The contribution-room estimate here does not include your personal contribution or withdrawal history unless you verify those details separately.",
          "Growth assumes a constant annual return and monthly contributions made evenly through the year.",
          "The taxable-account comparison applies a flat marginal tax rate to investment growth for a directional benchmark, not a full tax projection.",
        ]}
        sources={[
          { label: "CRA: Tax-Free Savings Account", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html" },
          { label: "CRA: TFSA contribution room rules", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributions.html" },
        ]}
      />

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">How to use this TFSA calculator</p>
          <h2 className="mt-3 text-2xl font-bold text-primary dark:text-accent">Use it to decide what your next TFSA dollar should do</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This page is most useful when you treat it as a planning tool instead of a final CRA confirmation screen. Start with a realistic current balance,
            monthly contribution, and expected return. Then compare whether the projected tax-free growth is strong enough to justify prioritizing the TFSA
            over your RRSP, FHSA, or a taxable investing account.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The contribution-room estimate here is directional because personal room depends on your actual contribution and withdrawal history. The strongest
            workflow is to use this page for scenario planning, then verify your official available room through CRA My Account before making a large deposit,
            transfer, or catch-up contribution.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">What Canadians usually miss</p>
          <h2 className="mt-3 text-2xl font-bold text-primary dark:text-accent">The TFSA choice is about account priority, not just tax-free growth</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Many Canadians jump straight to choosing a broker or ETF before deciding whether the TFSA is the right account for the next contribution. For many
            people it is, but not always. If your income makes an RRSP deduction especially valuable, or if you are saving for a first home through an FHSA,
            the right next account can change even when the TFSA growth chart looks attractive.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Over-contribution risk also matters more than most people expect. A TFSA is powerful because growth, dividends, and withdrawals are tax-free, but
            the account loses some of that simplicity if you are guessing on room. Use this calculator to model the upside, use the room guide to avoid common
            mistakes, and compare it against the RRSP calculator when the account choice is still uncertain.
          </p>
        </div>
      </section>

      <ActionableNextSteps
        toolName="tfsa_calculator"
        title="Turn the TFSA projection into a real account decision"
        intro="Use the projected balance and room estimate to decide whether the TFSA should receive the next contribution, then compare providers only after the account priority is clear."
        meaning={`A projected TFSA value of $${result.finalValue.toLocaleString()} in ${years} years is useful only if the TFSA is still the right home for the next dollar. Your directional room estimate is $${result.contributionRoom.toLocaleString()}, so verify CRA room before acting on a large deposit.`}
        steps={[
          "Review whether the TFSA still beats the RRSP for your next contribution.",
          "Read the room rules before making a large deposit or re-contribution.",
          "Compare providers only after you are confident the TFSA is the right account.",
        ]}
        actions={[
          {
            title: "Review TFSA room rules",
            body: "Read the year-by-year contribution-room rules and avoid the common over-contribution mistakes.",
            href: "/blog/how-much-tfsa-room-2026",
            ctaLabel: "tfsa_room_guide",
          },
          {
            title: "Compare TFSA vs RRSP",
            body: "Check whether the tax-free route or the tax-deduction route should get the next contribution.",
            href: "/blog/tfsa-vs-rrsp-2026",
            ctaLabel: "tfsa_vs_rrsp_guide",
          },
          {
            title: "Open RRSP calculator",
            body: "Model the refund side of the decision once you have a TFSA baseline.",
            href: "/tools/rrsp-calculator",
            ctaLabel: "next_tool_rrsp",
          },
        ]}
        referral={{
          placement: "tfsa_calculator_referral",
          badge: "TFSA-friendly offer",
          title: "Get $25 free with Wealthsimple",
          highlight: "$25 free",
          description:
            "If you want a simple place to open a TFSA and start with broad ETF investing, this can be a reasonable next step after you verify your room and confirm the TFSA should get the next contribution.",
          fitHeading: "Why this may fit after the TFSA math",
          fitPoints: [
            "You want a simple first TFSA setup rather than a heavier brokerage workflow.",
            "Your plan is broad ETFs and recurring contributions, not complex trading.",
            "You have already checked that the TFSA should get the next contribution.",
          ],
          details: "Use the referral code at signup | No fee to open | Keep comparing provider details before you decide",
          disclosure:
            "Affiliate disclosure: We may earn a referral bonus if you sign up using this code. That does not change how we explain TFSA contribution room, account priority, or provider comparisons.",
          buttonLabel: "Start with Wealthsimple",
        }}
      />

      <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Compare providers next</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">If the TFSA math looks strong, compare where to open it</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              Once you know the TFSA should get the next dollar, move into broker comparisons and shortlist pages. The account choice comes first. The provider choice comes next.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <SurfaceTrackedLink to="/blog/best-tfsa-brokers-canada" eventName="tool_result_cta_click" ctaLabel="compare_providers_best_tfsa_brokers" trackingParams={{ tool_name: "tfsa_calculator", section: "compare_providers_next", destination_type: "article" }} className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Best for shortlist</p>
            <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">Best TFSA brokers</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Start with the simplest shortlist if you want the fastest provider decision.</p>
          </SurfaceTrackedLink>
          <SurfaceTrackedLink to="/blog/wealthsimple-vs-questrade-canada" eventName="tool_result_cta_click" ctaLabel="compare_providers_wealthsimple_vs_questrade" trackingParams={{ tool_name: "tfsa_calculator", section: "compare_providers_next", destination_type: "article" }} className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Best for head-to-head</p>
            <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">Wealthsimple vs Questrade</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use the beginner-vs-DIY comparison if those are your two main options.</p>
          </SurfaceTrackedLink>
          <SurfaceTrackedLink to="/blog/best-investing-apps-canada" eventName="tool_result_cta_click" ctaLabel="compare_providers_best_investing_apps" trackingParams={{ tool_name: "tfsa_calculator", section: "compare_providers_next", destination_type: "article" }} className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Best if still broad</p>
            <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">Best investing apps</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use the broader app guide if you still have not narrowed the provider category.</p>
          </SurfaceTrackedLink>
        </div>
      </section>

      <FAQ items={TFSA_FAQS} />
    </section>
  );
}
