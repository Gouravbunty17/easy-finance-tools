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

const FAQS = [
  {
    q: "Is this the rate my bank will give me?",
    a: "No. The Bank of Canada rate is a reference rate. Banks, credit cards, brokers, and currency exchanges may add spreads or fees.",
  },
  {
    q: "What does USD/CAD mean?",
    a: "USD/CAD shows how many Canadian dollars equal one US dollar. A rate of 1.38 means 1 USD is about 1.38 CAD.",
  },
  {
    q: "Why does the chart show recent observations only?",
    a: "The converter is meant for quick planning, so it loads recent Bank of Canada observations rather than a long historical series.",
  },
  {
    q: "Can I use this for investing decisions?",
    a: "Use it for currency context only. Investment decisions should also consider account type, fees, risk, and tax treatment.",
  },
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
      title="CAD to USD Converter Canada | Bank of Canada Rate"
      description="Convert CAD to USD or USD to CAD using the Bank of Canada USD/CAD reference rate, with recent exchange-rate context and clear planning notes."
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

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What this calculator does</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Convert CAD and USD with reference-rate context</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            This converter estimates Canadian-dollar and US-dollar amounts using the Bank of Canada USD/CAD reference rate. It is useful for travel planning, cross-border purchases, USD cash estimates, or checking the rough value of US-listed investments.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use it</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Pick direction, then enter the amount</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Choose CAD to USD or USD to CAD, enter the amount, and compare the output with the recent USD/CAD trend. For real transactions, check your bank, broker, or card exchange rate before acting.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Inputs explained</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What changes the currency result</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["Amount", "The CAD or USD amount you want to translate."],
            ["Direction", "CAD to USD divides by the USD/CAD rate. USD to CAD multiplies by it."],
            ["Reference rate", "The latest Bank of Canada USD/CAD observation available to the page."],
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
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Example: {direction === "cad-to-usd" ? "CAD to USD" : "USD to CAD"}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            With {fmtCAD(asNumber(amount), { maximumFractionDigits: 2, minimumFractionDigits: 2 })} entered and a USD/CAD reference rate of {fmtNum(latestRate, { maximumFractionDigits: 4, minimumFractionDigits: 4 })}, the estimated converted amount is {direction === "cad-to-usd" ? `US ${fmtCAD(convertedAmount, { maximumFractionDigits: 2, minimumFractionDigits: 2 }).replace("CA", "")}` : fmtCAD(convertedAmount, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}.
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to read your result</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Reference rates are not retail exchange quotes</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Use the result as a neutral reference estimate, not a guaranteed transaction quote. If currency conversion affects an investing plan, compare the result with the <Link to="/tools/compound-interest-calculator" className="text-primary underline dark:text-secondary">compound interest calculator</Link> and the <Link to="/blog/how-to-start-investing-canada-2026" className="text-primary underline dark:text-secondary">beginner investing guide</Link>.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
        <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Do not confuse reference rates with all-in cost</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <li>- Forgetting bank, broker, ATM, or credit-card foreign-exchange spreads.</li>
          <li>- Using a stale quote for a same-day transaction when markets are moving.</li>
          <li>- Comparing CAD and USD investments without considering account type and tax treatment.</li>
          <li>- Treating a recent chart range as a prediction of where the currency will go next.</li>
        </ul>
      </section>

      <MethodologyPanel
        title="Methodology: how this CAD/USD converter works"
        summary="The converter loads recent USD/CAD observations from the Bank of Canada Valet API, uses the latest available reference rate, and converts by either multiplying or dividing depending on direction."
        assumptions={[
          "USD/CAD is interpreted as CAD per 1 USD.",
          "CAD to USD divides the CAD amount by the reference rate.",
          "USD to CAD multiplies the USD amount by the reference rate.",
          "If live data is unavailable, a cached fallback observation set is displayed with a warning.",
        ]}
        sources={[
          { label: "Bank of Canada Valet API", href: "https://www.bankofcanada.ca/valet/docs" },
          { label: "EasyFinanceTools methodology", href: "https://easyfinancetools.com/methodology" },
        ]}
        note="Educational estimate only. Verify the actual conversion rate and fees with your bank, broker, card issuer, or exchange provider."
      />

      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related tools and guides</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/tools" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">All calculators</Link>
          <Link to="/tools/tfsa-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA calculator</Link>
          <Link to="/tools/rrsp-calculator" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">RRSP calculator</Link>
          <Link to="/blog/tfsa-vs-rrsp-canada-2026" className="rounded-full bg-white px-4 py-2 text-primary shadow-sm dark:bg-slate-800 dark:text-accent">TFSA vs RRSP guide</Link>
        </div>
      </section>

      <FAQ items={FAQS} />
    </CalculatorLayout>
  );
}
