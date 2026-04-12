import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import { getCollection, shortTickerLabel } from "./stockCollections";

function formatNumber(value) {
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

export default function StockCollectionPage({ collectionKey }) {
  const navigate = useNavigate();
  const collection = getCollection(collectionKey);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);

  const pageTitle = useMemo(
    () => `${collection?.title || "Stock Collection"} | EasyFinanceTools`,
    [collection]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadQuotes() {
      if (!collection) return;
      setLoading(true);

      try {
        const results = await Promise.all(
          collection.items.map(async (item) => {
            try {
              const res = await fetch(`/api/quote?symbol=${encodeURIComponent(item.t)}`);
              const json = await res.json();
              return [item.t, json.quote || null];
            } catch {
              return [item.t, null];
            }
          })
        );

        if (!cancelled) {
          setQuotes(Object.fromEntries(results));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadQuotes();
    return () => {
      cancelled = true;
    };
  }, [collection]);

  if (!collection) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <SEO title="Stock Collection Not Found" description="Requested stock collection was not found." canonical={`${window.location.origin}/stocks`} />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-primary dark:text-white">Collection not found</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Try the main stocks hub instead.</p>
          <button
            onClick={() => navigate("/stocks")}
            className="mt-8 rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to stocks hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <SEO
        title={collection.title}
        description={collection.description}
        canonical={`${window.location.origin}/stocks/${collectionKey}`}
      />

      <section className="bg-gradient-to-r from-[#123f73] via-[#15538f] to-[#0ea5e9] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
            {collection.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-bold md:text-5xl">{collection.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50">{collection.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/stocks")}
              className="rounded-2xl bg-white px-5 py-3 font-semibold text-primary transition hover:bg-blue-50"
            >
              Explore all stocks
            </button>
            <button
              onClick={() => navigate(collection.relatedLinks[0].href)}
              className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
            >
              Open comparison
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {collection.relatedLinks.map((link) => (
            <button
              key={link.title}
              onClick={() => navigate(link.href)}
              className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">{collection.eyebrow}</p>
              <p className="mt-3 text-xl font-bold text-primary dark:text-white">{link.title}</p>
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Collection snapshot</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-white">Symbols in this collection</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {collection.items.length} tracked symbols
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {collection.items.map((item) => {
              const quote = quotes[item.t];
              return (
                <button
                  key={item.t}
                  onClick={() => navigate(`/stocks/${item.t}`)}
                  className="rounded-2xl border border-gray-100 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-secondary hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary dark:text-white">{shortTickerLabel(item.t)}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                          {item.market}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.n}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Open</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MetricCard label="Price" value={loading ? "Loading..." : formatNumber(quote?.regularMarketPrice)} />
                    <MetricCard label="Day change" value={loading ? "Loading..." : formatPercent(quote?.regularMarketChangePercent)} />
                    <MetricCard label="Volume" value={loading ? "Loading..." : formatVolume(quote?.regularMarketVolume)} />
                    <MetricCard label="52-week high" value={loading ? "Loading..." : formatNumber(quote?.fiftyTwoWeekHigh)} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{label}</p>
      <p className="mt-2 text-sm font-bold text-primary dark:text-white">{value}</p>
    </div>
  );
}
