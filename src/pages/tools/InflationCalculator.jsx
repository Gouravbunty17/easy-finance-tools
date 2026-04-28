import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Filler, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import NumberInput from "../../components/NumberInput";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Filler, Legend);

const FAQS = [
  {
    q: "What inflation data does this calculator use?",
    a: "It uses the Bank of Canada inflation-calculator series, which is based on Statistics Canada CPI observations.",
  },
  {
    q: "Is this the same as my personal inflation rate?",
    a: "No. CPI is a broad basket. Your own inflation can differ depending on housing, food, transportation, and spending habits.",
  },
  {
    q: "Why does the result use annual average CPI?",
    a: "Annual averages make long-range purchasing-power comparisons easier and reduce month-to-month noise.",
  },
  {
    q: "Can I use this for investment returns?",
    a: "Use it to understand purchasing power, then compare investment growth separately with the compound interest calculator.",
  },
];

function buildAnnualCpi(observations) {
  const bucket = new Map();
  observations.forEach((entry) => {
    const year = Number(String(entry.d).slice(0, 4));
    const value = Number(entry?.STATIC_INFLATIONCALC?.v || 0);
    if (!Number.isFinite(year) || !Number.isFinite(value) || value <= 0) return;
    const row = bucket.get(year) || { total: 0, count: 0 };
    row.total += value;
    row.count += 1;
    bucket.set(year, row);
  });

  return Array.from(bucket.entries())
    .map(([year, row]) => ({ year, cpi: row.total / row.count }))
    .sort((a, b) => a.year - b.year);
}

export default function InflationCalculator() {
  const [amount, setAmount] = useState(100);
  const [annualSeries, setAnnualSeries] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(new Date().getFullYear());

  useEffect(() => {
    let cancelled = false;

    async function loadInflationSeries() {
      try {
        const response = await fetch("https://www.bankofcanada.ca/valet/observations/STATIC_INFLATIONCALC/json");
        if (!response.ok) {
          throw new Error(`Bank of Canada request failed with ${response.status}`);
        }
        const payload = await response.json();
        const annual = buildAnnualCpi(payload.observations || []);
        if (!cancelled) {
          setAnnualSeries(annual);
          const firstYear = annual[0]?.year || 1914;
          const lastYear = annual.at(-1)?.year || 2026;
          setStartYear((current) => Math.min(Math.max(current, firstYear), lastYear - 1));
          setEndYear(lastYear);
          setStatus({ loading: false, error: "" });
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({ loading: false, error: "Live inflation data could not be loaded right now. Please try again in a moment." });
        }
      }
    }

    loadInflationSeries();
    return () => {
      cancelled = true;
    };
  }, []);

  const years = annualSeries.map((entry) => entry.year);
  const minYear = years[0] || 1914;
  const maxYear = years.at(-1) || 2026;
  const safeStartYear = Math.min(startYear, endYear - 1);
  const safeEndYear = Math.max(endYear, safeStartYear + 1);

  const result = useMemo(() => {
    const startEntry = annualSeries.find((entry) => entry.year === safeStartYear);
    const endEntry = annualSeries.find((entry) => entry.year === safeEndYear);

    if (!startEntry || !endEntry) {
      return null;
    }

    const startingAmount = asNumber(amount);
    const inflatedAmount = startingAmount * (endEntry.cpi / startEntry.cpi);
    const percentChange = startingAmount > 0 ? ((inflatedAmount - startingAmount) / startingAmount) * 100 : 0;
    const yearSpan = Math.max(1, safeEndYear - safeStartYear);
    const avgAnnualInflation = Math.pow(endEntry.cpi / startEntry.cpi, 1 / yearSpan) - 1;

    const spanSeries = annualSeries.filter((entry) => entry.year >= safeStartYear && entry.year <= safeEndYear);

    return {
      startEntry,
      endEntry,
      inflatedAmount,
      percentChange,
      yearSpan,
      avgAnnualInflation,
      spanSeries,
    };
  }, [amount, annualSeries, safeEndYear, safeStartYear]);

  const chartData = {
    labels: result?.spanSeries.map((entry) => String(entry.year)) || [],
    datasets: [
      {
        label: "Annual average CPI",
        data: result?.spanSeries.map((entry) => Number(entry.cpi.toFixed(2))) || [],
        borderColor: "#0a4c89",
        backgroundColor: "rgba(10, 76, 137, 0.12)",
        fill: true,
        tension: 0.28,
      },
    ],
  };

  return (
    <CalculatorLayout
      title="Inflation Calculator Canada | CPI Purchasing Power Tool"
      description="Compare Canadian dollar purchasing power across years using Bank of Canada CPI data. Estimate inflation-adjusted value, percent change, and average annual inflation."
      canonical="https://easyfinancetools.com/tools/inflation-calculator"
      badge="1914 to present"
      results={
        result ? (
          <>
            <ResultCard
              label={`Equivalent value in ${safeEndYear}`}
              value={fmtCAD(result.inflatedAmount, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              hint={`${fmtCAD(asNumber(amount), { maximumFractionDigits: 2, minimumFractionDigits: 2 })} in ${safeStartYear} adjusted using annual average CPI.`}
              tone="primary"
            />
            <ResultCard
              label="Percent change"
              value={`${fmtNum(result.percentChange, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`}
              hint={`${fmtNum(result.yearSpan)} years between ${safeStartYear} and ${safeEndYear}.`}
            />
            <ResultCard
              label="Average annual inflation"
              value={`${fmtNum(result.avgAnnualInflation * 100, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%`}
              hint={`Average annual CPI growth from ${fmtNum(result.startEntry.cpi, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} to ${fmtNum(result.endEntry.cpi, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}.`}
              tone="success"
            />
          </>
        ) : (
          <>
            <ResultCard label="Inflation data" value={status.loading ? "Loading..." : "Unavailable"} hint={status.error || "Fetching Bank of Canada inflation series."} tone="primary" />
          </>
        )
      }
      relatedTools={[
        { href: "/tools/compound-interest-calculator", title: "Compound interest calculator", body: "Pair investment growth with inflation-adjusted purchasing power." },
        { href: "/tools/gic-calculator", title: "GIC calculator", body: "Check whether a guaranteed return actually keeps up with inflation." },
        { href: "/tools/cad-usd-converter", title: "CAD/USD converter", body: "Use both tools when you need purchasing-power and exchange-rate context together." },
      ]}
      footerNote="This page uses annual-average CPI built from the Bank of Canada inflation calculator series, which is based on Statistics Canada monthly CPI observations."
    >
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-5 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-5">
            <NumberInput
              id="inflation-amount"
              label="Dollar amount"
              prefix="$"
              value={amount}
              onChange={(value) => setAmount(parseNumericInput(value))}
              placeholder="100"
              hint="Enter the amount you want to compare across time."
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Start year</span>
              <select
                value={safeStartYear}
                onChange={(event) => setStartYear(Number(event.target.value))}
                className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {years.map((year) => (
                  <option key={`start-${year}`} value={year} disabled={year >= safeEndYear}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">End year</span>
              <select
                value={safeEndYear}
                onChange={(event) => setEndYear(Number(event.target.value))}
                className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {years.map((year) => (
                  <option key={`end-${year}`} value={year} disabled={year <= safeStartYear}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <p className="font-semibold text-primary dark:text-accent">Method used</p>
              <p className="mt-2 leading-7">
                This uses the same CPI ratio approach described by the Bank of Canada inflation calculator:
                adjusted amount = original amount × (CPI in end year / CPI in start year).
              </p>
              {status.error ? <p className="mt-3 text-xs text-rose-500">{status.error}</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-primary dark:text-accent">Annual average CPI trend</p>
            <div className="mt-4 h-[320px]">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What this calculator does</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Compare Canadian purchasing power across years</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This calculator estimates what a CAD amount from one year is worth in another year using CPI data. It is useful when comparing old prices, salary history, savings targets, or long-term investment goals.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use it</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Choose the amount, start year, and end year</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Enter the original dollar amount, choose the year it belongs to, then choose the comparison year. The result shows the inflation-adjusted value and the average annual inflation rate over the period.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Inputs explained</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What each inflation input means</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["Dollar amount", "The CAD amount you want to compare across time."],
            ["Start year", "The year the original amount belongs to."],
            ["End year", "The year you want to translate the amount into."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <h3 className="font-bold text-primary dark:text-accent">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {result ? (
        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Example calculation</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Example: {fmtCAD(asNumber(amount), { maximumFractionDigits: 2, minimumFractionDigits: 2 })} from {safeStartYear} to {safeEndYear}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Using the CPI ratio for those years, {fmtCAD(asNumber(amount), { maximumFractionDigits: 2, minimumFractionDigits: 2 })} in {safeStartYear} is estimated at {fmtCAD(result.inflatedAmount, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} in {safeEndYear}. The modeled price-level change is {fmtNum(result.percentChange, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%.
            </p>
          </div>

          <div className="surface-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to read your result</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Inflation-adjusted value is purchasing power, not income</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              The adjusted amount estimates what would have similar purchasing power in the end year. For investing decisions, compare this with projected growth in the <Link to="/tools/compound-interest-calculator" className="text-primary underline dark:text-secondary">compound interest calculator</Link> or account choices like the <Link to="/tools/tfsa-calculator" className="text-primary underline dark:text-secondary">TFSA calculator</Link>.
            </p>
          </div>
        </section>
      ) : null}

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">CPI is useful, but it is not your exact household budget</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <li>- Treating CPI as a perfect match for your personal spending pattern.</li>
          <li>- Comparing nominal investment returns without subtracting inflation.</li>
          <li>- Using one high-inflation year to represent a long-term planning period.</li>
          <li>- Forgetting that housing, taxes, and savings goals can move differently from broad CPI.</li>
        </ul>
      </section>

      <MethodologyPanel
        title="Methodology: how this inflation calculator works"
        summary="The calculator builds annual CPI values from the Bank of Canada inflation-calculator series, finds the selected start and end years, then multiplies the original amount by the CPI ratio."
        assumptions={[
          "Annual average CPI is used for a smoother long-term comparison.",
          "The calculation is amount multiplied by end-year CPI divided by start-year CPI.",
          "Personal inflation can differ from national CPI depending on spending mix and location.",
          "If live data is unavailable, the page shows a data-loading notice instead of inventing a result.",
        ]}
        sources={[
          { label: "Bank of Canada Valet API", href: "https://www.bankofcanada.ca/valet/docs" },
          { label: "EasyFinanceTools methodology", href: "https://easyfinancetools.com/methodology" },
        ]}
        note="Educational estimate only. Use official CPI sources and qualified advice for tax, legal, or contractual indexation decisions."
      />

      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related tools and guides</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/tools" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">All calculators</Link>
          <Link to="/tools/rrsp-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">RRSP calculator</Link>
          <Link to="/blog/tfsa-vs-rrsp-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA vs RRSP guide</Link>
          <Link to="/blog/how-to-start-investing-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">Beginner investing guide</Link>
        </div>
      </section>

      <FAQ items={FAQS} />
    </CalculatorLayout>
  );
}
