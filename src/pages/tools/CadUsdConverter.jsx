import React, { useEffect, useMemo, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Filler, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import CalculatorLayout, { ResultCard, fmtCAD, fmtNum } from "../../components/CalculatorLayout";
import NumberInput from "../../components/NumberInput";
import { asNumber, parseNumericInput } from "../../lib/numericInputs";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Filler, Legend);

const FALLBACK_OBSERVATIONS = [
  { d: "2026-03-27", FXUSDCAD: { v: "1.3875" } },
  { d: "2026-03-30", FXUSDCAD: { v: "1.3926" } },
  { d: "2026-03-31", FXUSDCAD: { v: "1.3939" } },
  { d: "2026-04-01", FXUSDCAD: { v: "1.3888" } },
  { d: "2026-04-02", FXUSDCAD: { v: "1.3918" } },
  { d: "2026-04-06", FXUSDCAD: { v: "1.3916" } },
  { d: "2026-04-07", FXUSDCAD: { v: "1.3907" } },
  { d: "2026-04-08", FXUSDCAD: { v: "1.3851" } },
  { d: "2026-04-09", FXUSDCAD: { v: "1.3821" } },
  { d: "2026-04-10", FXUSDCAD: { v: "1.3825" } },
];

function formatObservationDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

export default function CadUsdConverter() {
  const [amount, setAmount] = useState(1000);
  const [direction, setDirection] = useState("cad-to-usd");
  const [observations, setObservations] = useState(FALLBACK_OBSERVATIONS);
  const [rateStatus, setRateStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      try {
        const response = await fetch("https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=10");
        if (!response.ok) {
          throw new Error(`Bank of Canada request failed with ${response.status}`);
        }
        const payload = await response.json();
        if (!cancelled && Array.isArray(payload.observations) && payload.observations.length > 0) {
          setObservations(payload.observations);
          setRateStatus({ loading: false, error: "" });
        }
      } catch (error) {
        if (!cancelled) {
          setObservations(FALLBACK_OBSERVATIONS);
          setRateStatus({ loading: false, error: "Live Bank of Canada data is temporarily unavailable, so the last cached rate is shown." });
        }
      }
    }

    loadRates();
    return () => {
      cancelled = true;
    };
  }, []);

  const series = useMemo(
    () =>
      observations
        .map((entry) => ({
          date: entry.d,
          rate: Number(entry?.FXUSDCAD?.v || 0),
        }))
        .filter((entry) => Number.isFinite(entry.rate) && entry.rate > 0),
    [observations]
  );

  const latestRate = series.at(-1)?.rate || 1.3825;
  const convertedAmount = direction === "cad-to-usd" ? asNumber(amount) / latestRate : asNumber(amount) * latestRate;
  const previousRate = series.at(-2)?.rate || latestRate;
  const dayMove = latestRate - previousRate;
  const lowRate = Math.min(...series.map((entry) => entry.rate));
  const highRate = Math.max(...series.map((entry) => entry.rate));

  const chartData = {
    labels: series.map((entry) => formatObservationDate(entry.date)),
    datasets: [
      {
        label: "USD/CAD",
        data: series.map((entry) => entry.rate),
        borderColor: "#0a4c89",
        backgroundColor: "rgba(10, 76, 137, 0.12)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  return (
    <CalculatorLayout
      title="CAD USD Converter Canada"
      description="Convert Canadian dollars and US dollars using the Bank of Canada USD/CAD reference rate. Includes a quick recent-history chart so the rate context is visible before you convert."
      canonical="https://easyfinancetools.com/tools/cad-usd-converter"
      badge="Bank of Canada rates"
      results={
        <>
          <ResultCard
            label={direction === "cad-to-usd" ? "Converted to USD" : "Converted to CAD"}
            value={direction === "cad-to-usd" ? `US ${fmtCAD(convertedAmount, { maximumFractionDigits: 2, minimumFractionDigits: 2 }).replace("CA", "")}` : fmtCAD(convertedAmount, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            hint={`Reference rate: ${fmtNum(latestRate, { maximumFractionDigits: 4, minimumFractionDigits: 4 })} CAD per 1 USD.`}
            tone="primary"
          />
          <ResultCard
            label="Today's move"
            value={`${dayMove >= 0 ? "+" : ""}${fmtNum(dayMove, { maximumFractionDigits: 4, minimumFractionDigits: 4 })}`}
            hint={`10-observation range: ${fmtNum(lowRate, { maximumFractionDigits: 4, minimumFractionDigits: 4 })} to ${fmtNum(highRate, { maximumFractionDigits: 4, minimumFractionDigits: 4 })}`}
            tone={dayMove >= 0 ? "success" : "warning"}
          />
          <ResultCard
            label="Data source"
            value="Bank of Canada Valet API"
            hint={rateStatus.error || `Most recent observation: ${series.at(-1)?.date || "n/a"}`}
          />
        </>
      }
      relatedTools={[
        { href: "/tools/compound-interest-calculator", title: "Compound interest calculator", body: "Model how exchange-rate decisions affect long-term savings and investing plans." },
        { href: "/tools/inflation-calculator", title: "Inflation calculator", body: "Pair currency conversion with purchasing-power checks over time." },
        { href: "/tools/savings-goal", title: "Savings goal calculator", body: "Translate a one-time conversion or transfer into a concrete savings target." },
      ]}
      footerNote="The Bank of Canada publishes a USD/CAD reference rate, not a cash-exchange or card-network quote. Your bank or broker may apply a spread."
    >
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-wrap gap-3">
          {[
            { key: "cad-to-usd", label: "CAD to USD" },
            { key: "usd-to-cad", label: "USD to CAD" },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setDirection(option.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                direction === option.key
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <NumberInput
            id="cad-usd-amount"
            label={direction === "cad-to-usd" ? "Canadian dollars" : "US dollars"}
            prefix={direction === "cad-to-usd" ? "CA$" : "US$"}
            value={amount}
            onChange={(value) => setAmount(parseNumericInput(value))}
            placeholder="1000"
            hint="Enter the amount you want to convert at the latest reference rate."
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-primary dark:text-accent">Recent USD/CAD trend</p>
            <div className="mt-4 h-[220px]">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => fmtNum(Number(value), { maximumFractionDigits: 4, minimumFractionDigits: 4 }),
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
