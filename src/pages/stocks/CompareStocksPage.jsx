import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SEO from "../../components/SEO";
import { COMPARISON_PRESETS, getPresetBySlug, getPresetComparison, makeComparisonSlug, shortTickerLabel } from "./stockCollections";

function formatPrice(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "N/A";
  return num.toLocaleString("en-CA", { maximumFractionDigits: 2 });
}

function formatPercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "N/A";
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
}

function formatVolume(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "N/A";
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return `${num}`;
}

async function fetchQuote(symbol) {
  const res = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
  const json = await res.json();
  return json.quote || null;
}

export default function CompareStocksPage() {
  const navigate = useNavigate();
  const { comparisonSlug } = useParams();
  const [searchParams] = useSearchParams();
  const slugPreset = comparisonSlug ? getPresetBySlug(comparisonSlug) : null;
  const left = slugPreset?.left || searchParams.get("left") || "XEQT.TO";
  const right = slugPreset?.right || searchParams.get("right") || "VEQT.TO";
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);

  const preset = useMemo(() => getPresetComparison(left, right), [left, right]);
  const canonicalPath = preset ? `/stocks/compare/${makeComparisonSlug(preset.left, preset.right)}` : `/stocks/compare?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [leftQuote, rightQuote] = await Promise.all([fetchQuote(left), fetchQuote(right)]);
        if (!cancelled) setQuotes({ [left]: leftQuote, [right]: rightQuote });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [left, right]);

  const leftQuote = quotes[left];
  const rightQuote = quotes[right];

  return (
    <div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <SEO
        title={`${shortTickerLabel(left)} vs ${shortTickerLabel(right)} Comparison`}
        description={`Compare ${left} and ${right} with a quick price, change, range, and volume snapshot on EasyFinanceTools.`}
        canonical={`${window.location.origin}${canonicalPath}`}
      />

      <section className="bg-gradient-to-r from-[#123f73] via-[#15538f] to-[#0ea5e9] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
            Stock comparison
          </p>
          <h1 className="mt-5 text-4xl font-bold md:text-5xl">
            {shortTickerLabel(left)} vs {shortTickerLabel(right)}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50">
            {preset?.blurb || "Use a simple side-by-side snapshot to compare two stocks or ETFs before opening the full chart and research pages."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 grid gap-3 lg:grid-cols-3">
          {COMPARISON_PRESETS.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(`/stocks/compare/${makeComparisonSlug(item.left, item.right)}`)}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                item.left === left && item.right === right
                  ? "border-secondary bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-slate-900"
                  : "border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              <p className="text-lg font-bold text-primary dark:text-white">{item.label}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.blurb}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <CompareCard
            symbol={left}
            quote={leftQuote}
            loading={loading}
            onOpen={() => navigate(`/stocks/${left}`)}
          />

          <div className="flex items-center justify-center">
            <div className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold uppercase tracking-[0.22em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              versus
            </div>
          </div>

          <CompareCard
            symbol={right}
            quote={rightQuote}
            loading={loading}
            onOpen={() => navigate(`/stocks/${right}`)}
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <button
            onClick={() => navigate("/stocks/canadian-etfs")}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Next discovery path</p>
            <p className="mt-3 text-xl font-bold text-primary dark:text-white">Browse Canadian ETFs</p>
          </button>
          <button
            onClick={() => navigate("/stocks/tsx-bank-stocks")}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Bank stocks</p>
            <p className="mt-3 text-xl font-bold text-primary dark:text-white">Compare more Canadian banks</p>
          </button>
          <button
            onClick={() => navigate("/blog/best-etfs-for-tfsa-canada-2026")}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Related guide</p>
            <p className="mt-3 text-xl font-bold text-primary dark:text-white">Best ETFs for TFSA</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareCard({ symbol, quote, loading, onOpen }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Ticker</p>
          <h2 className="mt-2 text-3xl font-bold text-primary dark:text-white">{shortTickerLabel(symbol)}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{quote?.longName || quote?.shortName || symbol}</p>
        </div>
        <button
          onClick={onOpen}
          className="rounded-2xl bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Open ticker
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <MetricCard label="Price" value={loading ? "Loading..." : formatPrice(quote?.regularMarketPrice)} />
        <MetricCard label="Day change" value={loading ? "Loading..." : formatPercent(quote?.regularMarketChangePercent)} />
        <MetricCard label="Day high" value={loading ? "Loading..." : formatPrice(quote?.regularMarketDayHigh)} />
        <MetricCard label="Day low" value={loading ? "Loading..." : formatPrice(quote?.regularMarketDayLow)} />
        <MetricCard label="52-week high" value={loading ? "Loading..." : formatPrice(quote?.fiftyTwoWeekHigh)} />
        <MetricCard label="52-week low" value={loading ? "Loading..." : formatPrice(quote?.fiftyTwoWeekLow)} />
        <MetricCard label="Volume" value={loading ? "Loading..." : formatVolume(quote?.regularMarketVolume)} />
        <MetricCard label="Exchange" value={loading ? "Loading..." : quote?.fullExchangeName || quote?.exchange || "N/A"} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{label}</p>
      <p className="mt-2 text-lg font-bold text-primary dark:text-white">{value}</p>
    </div>
  );
}
