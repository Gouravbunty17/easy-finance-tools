import React, { useEffect, useMemo, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Filler, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Filler, Legend);

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
      title="Inflation Calculator Canada"
      description="See what a dollar amount from one year would be worth in another year using the Bank of Canada inflation-calculator series based on Statistics Canada CPI data."
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
    </CalculatorLayout>
  );
}
