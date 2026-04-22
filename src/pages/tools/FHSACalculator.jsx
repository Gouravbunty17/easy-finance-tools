import React, { useMemo, useState } from "react";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolPageSchema from "../../components/ToolPageSchema";
import ToolByline from "../../components/ToolByline";
import ActionableNextSteps from "../../components/ActionableNextSteps";
import EducationalDisclaimer from "../../components/EducationalDisclaimer";
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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const CURRENT_YEAR = 2026;
const ANNUAL_LIMIT = 8000;
const MAX_CARRYFORWARD = 8000;
const LIFETIME_LIMIT = 40000;

const FAQS = [
  {
    q: "Who is usually eligible to open an FHSA?",
    a: "In general, you need to be a Canadian resident, at least 18 years old, and a qualifying first-time home buyer under the FHSA rules. You also generally need to be within the age limits set by CRA. Always confirm eligibility with current CRA guidance before opening or funding the account.",
  },
  {
    q: "How much unused FHSA room can carry forward?",
    a: "Up to $8,000 of unused FHSA participation room can generally carry forward into the next year. That means the usable room in a single year is often capped at $16,000: the current year's $8,000 plus up to $8,000 carried forward.",
  },
  {
    q: "What happens if I never buy a home?",
    a: "If you do not make a qualifying home purchase, FHSA assets can generally be transferred to an RRSP or RRIF without immediate tax if the applicable rules are met. That is one reason the FHSA is often compared against the RRSP and Home Buyers' Plan together rather than in isolation.",
  },
  {
    q: "Should I use an FHSA before a TFSA or RRSP?",
    a: "It depends on your timeline, home-buying plans, and tax bracket. The FHSA is especially attractive when you expect to buy a qualifying home and can benefit from the deduction. If the home purchase is uncertain or far away, it helps to compare the FHSA against TFSA and RRSP scenarios before committing the next dollar.",
  },
  {
    q: "Can both spouses or partners use an FHSA?",
    a: "Yes, if both people qualify individually. In many cases, each eligible partner can open and contribute to their own FHSA, which can materially increase the combined amount available for a future down payment.",
  },
];

const PROVINCE_OPTIONS = [
  ["AB", "Alberta"],
  ["BC", "British Columbia"],
  ["MB", "Manitoba"],
  ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"],
  ["NT", "Northwest Territories"],
  ["NU", "Nunavut"],
  ["ON", "Ontario"],
  ["PE", "Prince Edward Island"],
  ["QC", "Quebec"],
  ["SK", "Saskatchewan"],
  ["YT", "Yukon"],
];

const TAX_RATES = {
  AB: [[0, 57375, 25], [57375, 114750, 30.5], [114750, 177922, 36], [177922, 253414, 44], [253414, Infinity, 48]],
  BC: [[0, 45654, 20.06], [45654, 91310, 28.7], [91310, 104835, 31], [104835, 127299, 38.7], [127299, 172602, 43.7], [172602, 240716, 46.2], [240716, Infinity, 53.5]],
  ON: [[0, 51446, 20.05], [51446, 102894, 29.65], [102894, 150000, 33.89], [150000, 220000, 43.41], [220000, Infinity, 53.53]],
  QC: [[0, 51780, 27.53], [51780, 103545, 37.12], [103545, 126000, 45.71], [126000, Infinity, 53.31]],
  MB: [[0, 36842, 25.8], [36842, 79625, 37.9], [79625, Infinity, 50.4]],
  SK: [[0, 49720, 25], [49720, 142058, 33], [142058, Infinity, 47]],
  NS: [[0, 29590, 23.79], [29590, 59180, 37.17], [59180, 93000, 43.5], [93000, 150000, 50], [150000, Infinity, 54]],
  NB: [[0, 47715, 27.16], [47715, 95431, 37.52], [95431, 176756, 46.84], [176756, Infinity, 53.3]],
  NL: [[0, 43198, 23.7], [43198, 86395, 33.95], [86395, 154244, 44.5], [154244, Infinity, 51.3]],
  PE: [[0, 32656, 24.8], [32656, 64313, 37.3], [64313, 105000, 42], [105000, Infinity, 47.37]],
  NT: [[0, 50597, 20.9], [50597, 101198, 30.6], [101198, 164525, 39], [164525, Infinity, 47]],
  NU: [[0, 53268, 19], [53268, 106537, 28], [106537, 173205, 35], [173205, Infinity, 45]],
  YT: [[0, 55867, 21.4], [55867, 111733, 29.5], [111733, 154906, 36.9], [154906, 500000, 42], [500000, Infinity, 48]],
};

function getMarginalRate(province, income) {
  const brackets = TAX_RATES[province] || TAX_RATES.ON;
  for (const [low, high, rate] of brackets) {
    if (income >= low && income < high) return rate / 100;
  }
  return 0.43;
}

function SliderInput({ label, value, min, max, step = 1, onChange, format }) {
  const display = format ? format(value) : value;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-bold text-secondary">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(step < 1 ? parseFloat(event.target.value) : parseInt(event.target.value, 10))}
        className="w-full accent-secondary"
      />
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, colorClass = "text-primary dark:text-accent" }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-1 text-xs uppercase tracking-[0.14em] text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

const fmt = (value) => `$${Math.round(value).toLocaleString()}`;

export default function FHSACalculator() {
  const [birthYear, setBirthYear] = useState(1995);
  const [province, setProvince] = useState("ON");
  const [income, setIncome] = useState(85000);
  const [yearOpened, setYearOpened] = useState(2024);
  const [contributedToDate, setContributedToDate] = useState(8000);
  const [availableRoomNow, setAvailableRoomNow] = useState(8000);
  const [currentBalance, setCurrentBalance] = useState(8300);
  const [monthlyContrib, setMonthlyContrib] = useState(500);
  const [returnRate, setReturnRate] = useState(6);
  const [buyInYears, setBuyInYears] = useState(5);

  const result = useMemo(() => {
    const age = CURRENT_YEAR - birthYear;
    const marginalRate = getMarginalRate(province, income);
    const annualTargetContribution = monthlyContrib * 12;
    const monthlyRate = returnRate / 100 / 12;
    const lifetimeRoomRemainingStart = Math.max(0, LIFETIME_LIMIT - contributedToDate);
    const currentYearRoom = Math.max(
      0,
      Math.min(availableRoomNow, ANNUAL_LIMIT + MAX_CARRYFORWARD, lifetimeRoomRemainingStart)
    );

    let balance = currentBalance;
    let totalFutureContributed = 0;
    let totalTaxSaved = 0;
    let carryforward = 0;
    let lifetimeRoomRemaining = lifetimeRoomRemainingStart;

    const projections = [];
    const yearlyBreakdown = [];

    for (let year = 1; year <= buyInYears; year += 1) {
      const roomThisYear =
        year === 1
          ? Math.min(currentYearRoom, lifetimeRoomRemaining)
          : Math.min(ANNUAL_LIMIT + carryforward, lifetimeRoomRemaining);

      const annualContribution = Math.min(annualTargetContribution, roomThisYear, lifetimeRoomRemaining);
      const monthlyContributionThisYear = annualContribution / 12;

      for (let month = 0; month < 12; month += 1) {
        balance = balance * (1 + monthlyRate) + monthlyContributionThisYear;
      }

      totalFutureContributed += annualContribution;
      totalTaxSaved += annualContribution * marginalRate;
      lifetimeRoomRemaining -= annualContribution;

      const unusedRoom = Math.max(0, roomThisYear - annualContribution);
      carryforward = Math.min(MAX_CARRYFORWARD, unusedRoom);

      projections.push({ year, value: Math.round(balance) });
      yearlyBreakdown.push({
        year,
        roomThisYear: Math.round(roomThisYear),
        annualContribution: Math.round(annualContribution),
        carryforwardNextYear: Math.round(carryforward),
        lifetimeRoomRemaining: Math.round(lifetimeRoomRemaining),
      });
    }

    const currentYearDeductionValue = yearlyBreakdown[0]?.annualContribution
      ? Math.round(yearlyBreakdown[0].annualContribution * marginalRate)
      : 0;

    return {
      age,
      marginalRatePercent: Math.round(marginalRate * 1000) / 10,
      currentYearRoom,
      currentYearDeductionValue,
      annualTargetContribution: Math.round(annualTargetContribution),
      totalContributedAllTime: Math.round(contributedToDate + totalFutureContributed),
      totalFutureContributed: Math.round(totalFutureContributed),
      totalGrowth: Math.round(balance - currentBalance - totalFutureContributed),
      totalTaxSaved: Math.round(totalTaxSaved),
      effectiveFutureCost: Math.round(totalFutureContributed - totalTaxSaved),
      finalBalance: Math.round(balance),
      lifetimeRoomRemainingStart: Math.round(lifetimeRoomRemainingStart),
      lifetimeRoomRemainingEnd: Math.round(lifetimeRoomRemaining),
      projections,
      yearlyBreakdown,
      likelyAgeEligible: age >= 18 && age <= 71,
      contributionCapReached: lifetimeRoomRemaining === 0,
    };
  }, [
    availableRoomNow,
    birthYear,
    buyInYears,
    contributedToDate,
    currentBalance,
    income,
    monthlyContrib,
    province,
    returnRate,
  ]);

  const chartData = {
    labels: result.projections.map((point) => `Year ${point.year}`),
    datasets: [
      {
        label: "Projected FHSA balance",
        data: result.projections.map((point) => point.value),
        fill: true,
        backgroundColor: "rgba(34,197,94,0.12)",
        borderColor: "#22c55e",
        tension: 0.35,
        pointRadius: 3,
      },
    ],
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="FHSA Calculator 2026 - First Home Savings Account Canada"
        description="Estimate FHSA contribution room, tax savings, and projected home-buying funds for 2026. Free Canadian FHSA calculator with carryforward, lifetime-limit, and home-purchase planning guidance."
        canonical="https://easyfinancetools.com/tools/fhsa-calculator"
      />
      <ToolPageSchema
        name="FHSA Calculator 2026"
        description="Canadian FHSA calculator for contribution planning, tax savings, carryforward room, and projected growth toward a first home purchase."
        canonical="https://easyfinancetools.com/tools/fhsa-calculator"
        category="FinanceApplication"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            Home buying and registered accounts
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">
            FHSA Calculator Canada 2026
          </h1>
          <ToolByline lastUpdated="April 2026" />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Estimate contribution room, tax deductions, and projected home-buying funds inside the First Home Savings Account. Use it to decide whether the FHSA should get the next dollar before you compare brokers or provider offers.
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="surface-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Projected balance at purchase</p>
              <p className="mt-2 text-3xl font-bold text-primary dark:text-accent">{fmt(result.finalBalance)}</p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Estimated tax savings</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{fmt(result.totalTaxSaved)}</p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Lifetime room left after plan</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{fmt(result.lifetimeRoomRemainingEnd)}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Strong fit if...",
                body: "you expect to buy a qualifying first home and the deduction is meaningful at your current tax bracket.",
              },
              {
                title: "Compare with RRSP too if...",
                body: "you already have RRSP assets or the Home Buyers' Plan may be part of the down-payment strategy.",
              },
              {
                title: "Pause and double-check if...",
                body: "your first-time home buyer status, age eligibility, or purchase timeline is still uncertain.",
              },
            ].map((item) => (
              <div key={item.title} className="surface-card p-5">
                <p className="text-sm font-semibold text-primary dark:text-accent">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="surface-card mt-8 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary dark:text-accent">FHSA balance over time</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  This chart shows the account value if you keep contributing until the planned purchase date.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Estimated marginal tax rate: {result.marginalRatePercent.toFixed(1)}%
              </div>
            </div>

            <div className="mt-6">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `Balance: ${fmt(Number(context.raw))}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => fmt(Number(value)),
                      },
                    },
                  },
                }}
                height={320}
              />
            </div>
          </div>

          <section className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="surface-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">How FHSA room works</p>
              <h2 className="mt-3 text-2xl font-bold text-primary dark:text-accent">Use the current room estimate, not just the opening year</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                This calculator separates your current FHSA balance from two planning inputs that matter more for future contributions: how much you have already contributed and how much contribution room you believe is available right now. That makes the projection more useful than simply assuming the opening year tells the whole story.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                In practice, the best source for contribution room is your CRA record. Use this tool to plan scenarios once you have a reasonable room estimate, then confirm the actual amount before funding the account.
              </p>
            </div>

            <div className="surface-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">When the FHSA is strongest</p>
              <h2 className="mt-3 text-2xl font-bold text-primary dark:text-accent">The deduction and the withdrawal both need to matter</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                The FHSA is most compelling when two things are true at the same time: you can use the deduction at a meaningful tax rate today, and there is a realistic path to making a qualifying first-home withdrawal later. If one side of that equation is weak, the TFSA or RRSP can become the cleaner next account.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                That is why the best next comparison is usually not another FHSA article. It is a direct comparison against the RRSP deduction, the TFSA's flexibility, or the down-payment timeline itself.
              </p>
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                question: "Annual limit",
                answer: "The FHSA annual contribution limit is $8,000. This tool lets you compare your desired monthly contribution against that ceiling.",
              },
              {
                question: "Carryforward",
                answer: "Up to $8,000 of unused participation room can generally carry into the next year, which is why a current-year room estimate can be as high as $16,000.",
              },
              {
                question: "Lifetime cap",
                answer: "The lifetime contribution limit is $40,000. Once you approach that cap, future yearly contribution capacity becomes the real constraint to watch.",
              },
            ].map((item) => (
              <div key={item.question} className="surface-card p-5">
                <h2 className="text-lg font-bold text-primary dark:text-accent">{item.question}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.answer}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="surface-card h-fit p-6">
          <h2 className="text-2xl font-bold text-primary dark:text-accent">Adjust your FHSA scenario</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Educational estimate only. CRA records, eligibility rules, and actual provider account details should always win over a planning model.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Province</label>
              <select
                value={province}
                onChange={(event) => setProvince(event.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
              >
                {PROVINCE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Year FHSA opened</label>
              <select
                value={yearOpened}
                onChange={(event) => setYearOpened(parseInt(event.target.value, 10))}
                className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm outline-none focus:border-secondary dark:border-gray-600 dark:bg-gray-800"
              >
                {[2023, 2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <SliderInput
              label="Birth year"
              value={birthYear}
              min={1960}
              max={2008}
              step={1}
              onChange={setBirthYear}
            />
            <SliderInput
              label="Annual income"
              value={income}
              min={30000}
              max={300000}
              step={5000}
              onChange={setIncome}
              format={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <SliderInput
              label="Contributions already made"
              value={contributedToDate}
              min={0}
              max={40000}
              step={500}
              onChange={setContributedToDate}
              format={fmt}
            />
            <SliderInput
              label="Estimated room available now"
              value={availableRoomNow}
              min={0}
              max={16000}
              step={500}
              onChange={setAvailableRoomNow}
              format={fmt}
            />
            <SliderInput
              label="Current FHSA balance"
              value={currentBalance}
              min={0}
              max={50000}
              step={500}
              onChange={setCurrentBalance}
              format={fmt}
            />
            <SliderInput
              label="Monthly contribution"
              value={monthlyContrib}
              min={0}
              max={667}
              step={25}
              onChange={setMonthlyContrib}
              format={(value) => `$${value}/mo`}
            />
            <SliderInput
              label="Expected annual return"
              value={returnRate}
              min={1}
              max={10}
              step={0.5}
              onChange={setReturnRate}
              format={(value) => `${value}%`}
            />
            <SliderInput
              label="Years until home purchase"
              value={buyInYears}
              min={1}
              max={15}
              step={1}
              onChange={setBuyInYears}
              format={(value) => `${value} year${value === 1 ? "" : "s"}`}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-900/20">
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              First-year deduction estimate: {fmt(result.currentYearDeductionValue)}
            </p>
            <p className="mt-2 text-amber-700 dark:text-amber-300">
              At a modeled marginal tax rate of {result.marginalRatePercent.toFixed(1)}%, this is the approximate value of the first year's FHSA deduction if you contribute what the room allows.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <MetricCard label="Room available now" value={fmt(result.currentYearRoom)} colorClass="text-blue-600 dark:text-blue-400" />
            <MetricCard label="Lifetime room left now" value={fmt(result.lifetimeRoomRemainingStart)} colorClass="text-slate-700 dark:text-slate-200" />
            <MetricCard label="Future contributions in plan" value={fmt(result.totalFutureContributed)} colorClass="text-purple-600 dark:text-purple-400" />
            <MetricCard label="Tax-free growth" value={fmt(result.totalGrowth)} colorClass="text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Scenario summary</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Age in {CURRENT_YEAR}: {result.age}</li>
              <li>Target yearly contribution: {fmt(result.annualTargetContribution)}</li>
              <li>Total FHSA contributions after this plan: {fmt(result.totalContributedAllTime)}</li>
              <li>Effective future cost after tax savings: {fmt(result.effectiveFutureCost)}</li>
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100">
            Use CRA records for room confirmation. This model is strongest when you already know your approximate available room and want to compare contribution pace, tax savings, and purchase timeline.
          </div>

          {!result.likelyAgeEligible ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-100">
              Age check warning: based on the birth year entered, this scenario may fall outside the usual FHSA age rules. Confirm eligibility directly before acting.
            </div>
          ) : null}
        </aside>
      </div>

      <section className="mt-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Year-by-year plan</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">How the contribution room gets used</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              This breakdown helps you see whether the current room estimate is being used quickly, whether any carryforward survives into next year, and how much of the lifetime contribution cap remains after the plan.
            </p>
          </div>
          {result.contributionCapReached ? (
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Lifetime contribution cap reached in projection
            </span>
          ) : null}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="py-2 pr-4 text-left font-semibold">Year</th>
                <th className="py-2 pr-4 text-left font-semibold">Room available</th>
                <th className="py-2 pr-4 text-left font-semibold">Contribution used</th>
                <th className="py-2 pr-4 text-left font-semibold">Carryforward to next year</th>
                <th className="py-2 text-left font-semibold">Lifetime room left</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {result.yearlyBreakdown.map((row) => (
                <tr key={row.year} className="border-b dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Year {row.year}</td>
                  <td className="py-2 pr-4">{fmt(row.roomThisYear)}</td>
                  <td className="py-2 pr-4">{fmt(row.annualContribution)}</td>
                  <td className="py-2 pr-4">{fmt(row.carryforwardNextYear)}</td>
                  <td className="py-2">{fmt(row.lifetimeRoomRemaining)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Compare account paths</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">FHSA vs RRSP Home Buyers' Plan vs TFSA</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          The FHSA is not automatically the only answer. Many Canadians still need to compare it against RRSP deduction value, Home Buyers' Plan repayment rules, and the TFSA's flexibility before deciding which account deserves the next contribution.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="py-2 pr-4 text-left font-semibold">Feature</th>
                <th className="py-2 pr-4 text-left font-semibold text-blue-600">FHSA</th>
                <th className="py-2 pr-4 text-left font-semibold text-gray-500">RRSP HBP</th>
                <th className="py-2 text-left font-semibold text-emerald-600">TFSA</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {[
                ["Primary strength", "Deduction now and tax-free qualifying withdrawal later", "Deduction now plus temporary home-buyer access to RRSP funds", "Flexible tax-free growth and withdrawals"],
                ["Repayment required", "No repayment on a qualifying FHSA withdrawal", "Yes, under the Home Buyers' Plan rules", "No repayment"],
                ["Annual contribution cap", "$8,000 with limited carryforward", "No separate HBP annual cap", "TFSA room rules apply instead"],
                ["Lifetime contribution cap", "$40,000", "RRSP rules apply instead", "TFSA room rules apply instead"],
                ["Best fit", "Planned first-home purchase plus meaningful tax deduction", "Home purchase plus existing RRSP strategy", "Flexible savings when purchase timeline or eligibility is less certain"],
              ].map(([feature, fhsa, rrsp, tfsa]) => (
                <tr key={feature} className="border-b dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">{feature}</td>
                  <td className="py-2 pr-4">{fhsa}</td>
                  <td className="py-2 pr-4">{rrsp}</td>
                  <td className="py-2">{tfsa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-900/20">
          <strong className="text-blue-800 dark:text-blue-200">Planning note:</strong>
          <span className="text-blue-700 dark:text-blue-300">
            {" "}
            many first-time buyers evaluate the FHSA together with the RRSP Home Buyers' Plan and TFSA flexibility. The best mix depends on your tax bracket, existing account balances, and purchase timeline.
          </span>
        </div>
      </section>

      <MethodologyPanel
        title="How this FHSA calculator works"
        summary="This calculator estimates FHSA growth by combining your current balance, estimated available room now, projected contributions, a fixed annual return assumption, and a simplified provincial marginal tax rate estimate."
        assumptions={[
          "Current FHSA room is entered as a planning estimate and should be checked against CRA records before acting.",
          "Future yearly contributions are limited by the annual FHSA cap, simplified carryforward handling, and the $40,000 lifetime contribution limit.",
          "Tax savings are estimated using a simplified marginal tax rate lookup by province and income.",
          "Growth is modeled with a constant return assumption and does not reflect real market volatility or product-level fees.",
        ]}
        sources={[
          { label: "CRA: First Home Savings Account", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html" },
          { label: "Government of Canada: FHSA overview", href: "https://www.canada.ca/en/department-finance/news/2022/08/design-of-the-tax-free-first-home-savings-account.html" },
          { label: "Methodology and Sources", href: "https://easyfinancetools.com/methodology" },
        ]}
        updated="April 22, 2026"
        reviewer="Reviewed for accuracy"
        note="Educational estimate only. Verify FHSA eligibility, room, withdrawal rules, and provider details before acting."
      />

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">How to use this FHSA calculator</p>
          <h2 className="mt-3 text-2xl font-bold text-primary dark:text-accent">Use it to pressure-test the plan, not just to chase the biggest refund</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Start with the room you believe is actually available now, then set a monthly contribution that you could keep making without stretching the rest of your plan. If the result only works under a high return assumption or an unrealistically aggressive contribution amount, the FHSA strategy probably needs a slower, cleaner version.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This page is strongest when you use it before comparing providers. Once the contribution pace, tax savings, and home-purchase timeline make sense, then it is worth comparing broker workflows, fees, and account-opening friction.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">What this page helps you decide</p>
          <h2 className="mt-3 text-2xl font-bold text-primary dark:text-accent">The account choice matters more than the provider brand</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Many first-time buyers jump to broker comparisons too early. The bigger question is whether the FHSA should be the main down-payment account at all, how much room is actually available, and how the deduction compares with the RRSP and TFSA paths. This calculator makes those tradeoffs easier to inspect before marketing language starts shaping the decision.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            If the deduction is weak, the timeline is uncertain, or the age and first-time buyer rules are still unclear, the cleaner next step may be to compare account wrappers rather than commit to an FHSA contribution immediately.
          </p>
        </div>
      </section>

      <ActionableNextSteps
        toolName="fhsa_calculator"
        title="Turn the FHSA estimate into a real home-buying decision"
        intro="The calculator result is most useful when it turns into an account decision, not just a projected balance. Use the FHSA estimate to compare where the next dollar should go and what account mix best supports the purchase plan."
        meaning={`${fmt(result.finalBalance)} is the directional FHSA balance if your current room estimate, contribution pace, and purchase timeline hold up. The best next move is usually comparing that result against RRSP and TFSA alternatives before you choose a provider.`}
        steps={[
          "Confirm current FHSA room with CRA before making a real contribution.",
          "Compare the same monthly amount against RRSP and TFSA scenarios, not just FHSA growth in isolation.",
          "Only compare providers after the account strategy, tax benefit, and purchase timeline are clear.",
        ]}
        actions={[
          {
            title: "Read the FHSA guide",
            body: "See how eligibility, room rules, and withdrawal planning fit together before you fund the account.",
            href: "/blog/how-to-use-fhsa-canada",
            ctaLabel: "open_how_to_use_fhsa_guide",
          },
          {
            title: "Open RRSP calculator",
            body: "Compare the FHSA against the RRSP deduction and Home Buyers' Plan context.",
            href: "/tools/rrsp-calculator",
            ctaLabel: "open_rrsp_calculator",
          },
          {
            title: "Open mortgage affordability calculator",
            body: "Translate the projected down-payment path into a housing budget check.",
            href: "/tools/mortgage-affordability-calculator",
            ctaLabel: "open_mortgage_affordability_calculator",
          },
        ]}
      />

      <FAQ items={FAQS} />
    </section>
  );
}
