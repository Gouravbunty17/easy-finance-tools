import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SEO from "../../components/SEO";
import AdSlot from "../../components/AdSlot";

function TVWidget({ id, scriptSrc, configFn, height }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerHTML = "";
    const isDark = document.documentElement.classList.contains("dark");
    const container = document.createElement("div");
    container.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.innerHTML = JSON.stringify(configFn(isDark));

    el.appendChild(container);
    el.appendChild(script);

    return () => {
      if (el) el.innerHTML = "";
    };
  }, [configFn, id, scriptSrc]);

  return (
    <div
      ref={ref}
      className="tradingview-widget-container w-full overflow-hidden"
      style={{ minHeight: height }}
    />
  );
}

function SkeletonLine({ cls }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${cls}`} />;
}

const POPULAR_STOCKS = [
  { t: "AAPL", n: "Apple", market: "US" },
  { t: "NVDA", n: "Nvidia", market: "US" },
  { t: "TSLA", n: "Tesla", market: "US" },
  { t: "SHOP", n: "Shopify", market: "Canada" },
  { t: "RY", n: "Royal Bank", market: "Canada" },
  { t: "TD", n: "TD Bank", market: "Canada" },
];

const POPULAR_CRYPTO = [
  { t: "BTC-USD", n: "Bitcoin", market: "Crypto" },
  { t: "ETH-USD", n: "Ethereum", market: "Crypto" },
  { t: "SOL-USD", n: "Solana", market: "Crypto" },
  { t: "XRP-USD", n: "XRP", market: "Crypto" },
];

const POPULAR_ETFS = [
  { t: "SPY", n: "S&P 500", market: "ETF" },
  { t: "QQQ", n: "NASDAQ 100", market: "ETF" },
  { t: "XEQT.TO", n: "iShares Core Equity ETF", market: "Canada ETF" },
];

const SYMBOL_METADATA = {
  AAPL: {
    name: "Apple",
    type: "stock",
    exchange: "NASDAQ",
    tvSymbol: "NASDAQ:AAPL",
    description: "Track Apple stock with live chart, news, technical analysis, and company profile.",
  },
  NVDA: {
    name: "Nvidia",
    type: "stock",
    exchange: "NASDAQ",
    tvSymbol: "NASDAQ:NVDA",
    description: "Track Nvidia stock with live chart, news, technical analysis, and company profile.",
  },
  TSLA: {
    name: "Tesla",
    type: "stock",
    exchange: "NASDAQ",
    tvSymbol: "NASDAQ:TSLA",
    description: "Track Tesla stock with live chart, news, technical analysis, and company profile.",
  },
  SHOP: {
    name: "Shopify",
    type: "stock",
    exchange: "TSX",
    tvSymbol: "TSX:SHOP",
    description: "Track Shopify stock with live chart, news, technical analysis, and company profile.",
  },
  RY: {
    name: "Royal Bank of Canada",
    type: "stock",
    exchange: "TSX",
    tvSymbol: "TSX:RY",
    description: "Track Royal Bank stock with live chart, news, technical analysis, and company profile.",
  },
  TD: {
    name: "TD Bank",
    type: "stock",
    exchange: "TSX",
    tvSymbol: "TSX:TD",
    description: "Track TD Bank stock with live chart, news, technical analysis, and company profile.",
  },
  SPY: {
    name: "SPDR S&P 500 ETF Trust",
    type: "ETF",
    exchange: "NYSE Arca",
    tvSymbol: "AMEX:SPY",
    description: "Track SPY with live chart, ETF news, technical analysis, and profile data.",
  },
  QQQ: {
    name: "Invesco QQQ Trust",
    type: "ETF",
    exchange: "NASDAQ",
    tvSymbol: "NASDAQ:QQQ",
    description: "Track QQQ with live chart, ETF news, technical analysis, and profile data.",
  },
  "XEQT.TO": {
    name: "iShares Core Equity ETF Portfolio",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:XEQT",
    description: "Track XEQT with live chart, ETF news, technical analysis, and profile data.",
  },
  "VEQT.TO": {
    name: "Vanguard All-Equity ETF Portfolio",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:VEQT",
    description: "Track VEQT with live chart, ETF news, technical analysis, and profile data.",
  },
  "XGRO.TO": {
    name: "iShares Core Growth ETF Portfolio",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:XGRO",
    description: "Track XGRO with live chart, ETF news, technical analysis, and profile data.",
  },
  "VGRO.TO": {
    name: "Vanguard Growth ETF Portfolio",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:VGRO",
    description: "Track VGRO with live chart, ETF news, technical analysis, and profile data.",
  },
  "XBAL.TO": {
    name: "iShares Core Balanced ETF Portfolio",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:XBAL",
    description: "Track XBAL with live chart, ETF news, technical analysis, and profile data.",
  },
  "VFV.TO": {
    name: "Vanguard S&P 500 Index ETF",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:VFV",
    description: "Track VFV with live chart, ETF news, technical analysis, and profile data.",
  },
  "ZSP.TO": {
    name: "BMO S&P 500 Index ETF",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:ZSP",
    description: "Track ZSP with live chart, ETF news, technical analysis, and profile data.",
  },
  "XIU.TO": {
    name: "iShares S&P/TSX 60 ETF",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:XIU",
    description: "Track XIU with live chart, ETF news, technical analysis, and profile data.",
  },
  "VDY.TO": {
    name: "Vanguard FTSE Canadian High Dividend Yield ETF",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:VDY",
    description: "Track VDY with live chart, ETF news, technical analysis, and profile data.",
  },
  "XDV.TO": {
    name: "iShares Canadian Select Dividend ETF",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:XDV",
    description: "Track XDV with live chart, ETF news, technical analysis, and profile data.",
  },
  "ZWB.TO": {
    name: "BMO Covered Call Canadian Banks ETF",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:ZWB",
    description: "Track ZWB with live chart, ETF news, technical analysis, and profile data.",
  },
  "CASH.TO": {
    name: "Global X High Interest Savings ETF",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:CASH",
    description: "Track CASH with live chart, ETF news, technical analysis, and profile data.",
  },
  "CSAV.TO": {
    name: "CI High Interest Savings ETF",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:CSAV",
    description: "Track CSAV with live chart, ETF news, technical analysis, and profile data.",
  },
  "HDIV.TO": {
    name: "Hamilton Enhanced Multi-Sector Covered Call ETF",
    type: "ETF",
    exchange: "TSX",
    tvSymbol: "TSX:HDIV",
    description: "Track HDIV with live chart, ETF news, technical analysis, and profile data.",
  },
  "BTC-USD": {
    name: "Bitcoin",
    type: "crypto",
    exchange: "Crypto",
    tvSymbol: "BINANCE:BTCUSDT",
    description: "Track Bitcoin with live chart, news, technical analysis, and market profile.",
  },
  "ETH-USD": {
    name: "Ethereum",
    type: "crypto",
    exchange: "Crypto",
    tvSymbol: "BINANCE:ETHUSDT",
    description: "Track Ethereum with live chart, news, technical analysis, and market profile.",
  },
};

const TSX_TICKERS = new Set([
  "RY", "TD", "ENB", "CNR", "CP", "BNS", "MFC", "SU", "BMO", "ABX",
  "CM", "CNQ", "TRP", "PPL", "FTS", "POW", "IFC", "T", "BCE", "SHOP",
  "RCI", "MG", "L", "EMA", "KEY", "AEM", "PKI", "GWO", "WN", "ATD",
  "CVE", "IMO", "NTR", "WPM", "BHC", "CAR", "CTC", "MRU", "EMP",
  "XEQT", "VEQT", "XGRO", "VGRO", "XBAL", "VFV", "ZSP", "XIU",
  "VDY", "XDV", "ZWB", "CASH", "CSAV", "HDIV", "ZCN", "XIC", "VCN",
]);

const CRYPTO_MAP = {
  BTC: "BTC-USD",
  ETH: "ETH-USD",
  SOL: "SOL-USD",
  XRP: "XRP-USD",
  DOGE: "DOGE-USD",
  ADA: "ADA-USD",
  AVAX: "AVAX-USD",
  DOT: "DOT-USD",
  MATIC: "MATIC-USD",
  SHIB: "SHIB-USD",
  LTC: "LTC-USD",
  LINK: "LINK-USD",
  UNI: "UNI-USD",
  ATOM: "ATOM-USD",
  XLM: "XLM-USD",
  BCH: "BCH-USD",
  NEAR: "NEAR-USD",
  ICP: "ICP-USD",
  APT: "APT-USD",
  ARB: "ARB-USD",
  OP: "OP-USD",
  SUI: "SUI-USD",
  TRX: "TRX-USD",
  INJ: "INJ-USD",
};

function toTVSymbol(ticker) {
  if (!ticker) return "";
  if (SYMBOL_METADATA[ticker]?.tvSymbol) return SYMBOL_METADATA[ticker].tvSymbol;
  if (ticker.endsWith("-USD") || ticker.endsWith("-USDT")) {
    const base = ticker.replace(/-USD$/, "").replace(/-USDT$/, "");
    return `BINANCE:${base}USDT`;
  }
  if (ticker.endsWith(".TO")) return `TSX:${ticker.replace(/\.TO$/, "")}`;
  if (TSX_TICKERS.has(ticker)) return `TSX:${ticker}`;
  return ticker;
}

const TYPE_BADGE = {
  CRYPTOCURRENCY: { label: "Crypto", cls: "bg-orange-100 text-orange-700" },
  ETF: { label: "ETF", cls: "bg-purple-100 text-purple-700" },
  EQUITY: { label: "Stock", cls: "bg-blue-100 text-blue-700" },
  MUTUALFUND: { label: "Fund", cls: "bg-green-100 text-green-700" },
};

const LANDING_FEATURES = [
  ["Interactive chart", "Track 1D to max history"],
  ["Technical analysis", "View quick buy, sell, and neutral signals"],
  ["Company or crypto profile", "See the business or asset overview"],
  ["Latest news", "Read symbol-specific headlines in one place"],
];

function QuickTile({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-bold text-primary dark:text-white">{title}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  );
}

function SymbolChip({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border-2 border-gray-100 bg-white px-4 py-2 text-left text-sm transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center gap-2">
        <span className="font-bold">{item.t.replace("-USD", "")}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {item.market}
        </span>
      </div>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.n}</div>
    </button>
  );
}

function getTickerMeta(currentTicker, tvSymbol, isCrypto) {
  const known = currentTicker ? SYMBOL_METADATA[currentTicker] : null;
  const displayName = known?.name || currentTicker || "Market";
  const assetLabel = known?.type || (isCrypto ? "crypto" : "stock");
  const exchangeLabel = known?.exchange || (tvSymbol?.startsWith("TSX:") ? "TSX" : "market");

  return {
    displayName,
    assetLabel,
    exchangeLabel,
    pageTitle: known
      ? `${known.name} (${currentTicker}) ${known.type === "ETF" ? "ETF" : known.type === "crypto" ? "Price" : "Stock"} Chart, News and Analysis`
      : `${currentTicker} ${isCrypto ? "Price" : "Stock"} Chart, News and Analysis`,
    description: known?.description || `Live ${currentTicker} chart, technical analysis, financials, and latest news on EasyFinanceTools.`,
  };
}

function normalizeAssetLabel(quoteType, fallbackLabel, isCrypto) {
  if (isCrypto) return "crypto";

  const type = String(quoteType || "").toUpperCase();
  if (type === "ETF") return "ETF";
  if (["MUTUALFUND", "MUTUAL FUND", "CLOSED_END_FUND"].includes(type)) return "fund";
  if (type === "CRYPTOCURRENCY") return "crypto";

  return fallbackLabel;
}

const FUND_FALLBACK_RESOURCES = [
  {
    title: "Best ETFs for a TFSA",
    body: "See common Canadian ETF choices, diversification tradeoffs, and what to hold inside a registered account.",
    href: "/blog/best-etfs-for-tfsa-canada-2026",
  },
  {
    title: "Weekly dividend ETFs",
    body: "Understand how high-yield and covered-call ETFs work before relying on payout-heavy products.",
    href: "/blog/weekly-dividend-etfs",
  },
  {
    title: "Dividend calculator",
    body: "Model income and reinvestment scenarios if you are comparing yield-focused funds.",
    href: "/tools/dividend-calculator",
  },
];

export default function StockPage() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("watchlist") || "[]");
    } catch {
      return [];
    }
  });

  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const currentTicker = ticker?.toUpperCase();
  const isWatched = watchlist.some((item) => item.t === currentTicker);
  const isCrypto = Boolean(
    currentTicker && (currentTicker.endsWith("-USD") || currentTicker.endsWith("-USDT"))
  );
  const tvSymbol = toTVSymbol(currentTicker);
  const tickerMeta = getTickerMeta(currentTicker, tvSymbol, isCrypto);
  const assetLabel = normalizeAssetLabel(stockData?.quoteType, tickerMeta.assetLabel, isCrypto);
  const isFundLike = assetLabel === "ETF" || assetLabel === "fund";

  const toggleWatch = (symbol, name) => {
    setWatchlist((prev) =>
      prev.some((item) => item.t === symbol)
        ? prev.filter((item) => item.t !== symbol)
        : [...prev, { t: symbol, n: name || symbol }]
    );
  };

  useEffect(() => {
    if (!currentTicker) return;
    if (CRYPTO_MAP[currentTicker]) {
      navigate(`/stocks/${CRYPTO_MAP[currentTicker]}`, { replace: true });
      return;
    }

    setAiSummary("");
    fetchAiSummary(currentTicker);
    fetchStockData(currentTicker);
  }, [currentTicker, navigate]);

  const fetchAiSummary = async (symbol) => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: symbol }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setAiLoading(false);
        return;
      }

      const data = await response.json();
      if (data?.summary) setAiSummary(data.summary);
    } catch {
      // Optional enhancement only.
    }
    setAiLoading(false);
  };

  const fetchStockData = async (symbol) => {
    setStockLoading(true);
    setNewsLoading(true);
    setStockData(null);
    setNewsItems([]);
    try {
      const response = await fetch(`/api/stock?ticker=${encodeURIComponent(symbol)}`);
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setNewsLoading(false);
        return;
      }

      const data = await response.json();
      setStockData(data?.stock || null);
      const items = Array.isArray(data?.news) ? data.news : [];
      setNewsItems(items.slice(0, 8));
    } catch {
      // Optional enhancement only.
    }
    setStockLoading(false);
    setNewsLoading(false);
  };

  const handleSearchInput = (value) => {
    setSearch(value);
    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return;

        const data = await response.json();
        const results = data.results || [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        // Optional enhancement only.
      }
    }, 280);
  };

  const handleSelectSuggestion = (symbol) => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/stocks/${symbol}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const value = search.trim().toUpperCase();
    if (!value) return;
    navigate(`/stocks/${value}`);
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const showTradingViewFinancials = !isCrypto && !isFundLike;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title={
          currentTicker
            ? tickerMeta.pageTitle
            : "Stock, ETF and Crypto Charts"
        }
        description={
          currentTicker
            ? tickerMeta.description
            : "Free live charts, technical analysis, financials, and news for US and Canadian stocks, ETFs, and crypto."
        }
        canonical={
          currentTicker
            ? `https://easyfinancetools.com/stocks/${currentTicker}`
            : "https://easyfinancetools.com/stocks"
        }
        robots="noindex,follow,max-image-preview:large"
      />
      {currentTicker && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebPage",
                  name: tickerMeta.pageTitle,
                  description: tickerMeta.description,
                  url: `https://easyfinancetools.com/stocks/${currentTicker}`,
                  about: {
                    "@type": assetLabel === "crypto" ? "Thing" : isFundLike ? "InvestmentFund" : "Corporation",
                    name: tickerMeta.displayName,
                    tickerSymbol: currentTicker,
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://easyfinancetools.com/",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Stocks",
                      item: "https://easyfinancetools.com/stocks",
                    },
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: `${tickerMeta.displayName} (${currentTicker})`,
                      item: `https://easyfinancetools.com/stocks/${currentTicker}`,
                    },
                  ],
                },
              ],
            }),
          }}
        />
      )}

      <div className="bg-gradient-to-br from-primary to-secondary px-4 py-10">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            US and Canadian markets
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">Stocks, ETFs and Crypto</h1>
          <p className="mb-6 text-sm text-blue-100 md:text-base">
            Live charts, technical analysis, financials, company profiles, and symbol-specific news.
          </p>

          <div ref={searchRef} className="relative mx-auto max-w-xl">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={search}
                onChange={(event) => handleSearchInput(event.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search Apple, AAPL, Bitcoin, BTC, SPY"
                className="flex-1 rounded-xl px-4 py-3 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-accent"
                autoComplete="off"
                aria-label="Search stocks, ETFs, or crypto"
              />
              <button
                type="submit"
                aria-label="Search"
                className="whitespace-nowrap rounded-xl bg-accent px-6 py-3 font-bold text-primary transition hover:bg-yellow-400"
              >
                Search
              </button>
            </form>

            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
                {suggestions.map((item) => {
                  const badge = TYPE_BADGE[item.type] || TYPE_BADGE.EQUITY;
                  return (
                    <button
                      key={item.symbol}
                      onMouseDown={() => handleSelectSuggestion(item.symbol)}
                      className="flex w-full items-center justify-between border-b border-gray-50 px-4 py-3 text-left transition last:border-0 hover:bg-blue-50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="shrink-0 text-sm font-bold text-primary">{item.symbol}</span>
                          <span className="truncate text-sm text-gray-500">{item.name}</span>
                        </div>
                      </div>
                      <div className="ml-2 flex shrink-0 items-center gap-1.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.cls}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-gray-400">{item.exchange}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {!currentTicker && (
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-primary dark:text-accent">
              Search any stock, ETF, or crypto
            </h2>
            <p className="mx-auto max-w-2xl text-gray-500 dark:text-gray-400">
              Follow US stocks, TSX names, major ETFs, and top crypto assets from one page.
            </p>
          </div>

          {watchlist.length > 0 && (
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Your watchlist
                </p>
                <button
                  onClick={() => setWatchlist([])}
                  className="text-xs text-gray-400 transition hover:text-red-500"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchlist.map((item) => (
                  <div
                    key={item.t}
                    className="flex items-center gap-2 rounded-xl border-2 border-yellow-200 bg-yellow-50 pl-3 pr-2 py-1.5 dark:border-yellow-800 dark:bg-yellow-900/20"
                  >
                    <button
                      onClick={() => navigate(`/stocks/${item.t}`)}
                      className="text-sm font-bold text-primary hover:underline dark:text-yellow-300"
                    >
                      {item.t}
                    </button>
                    <span className="hidden text-xs text-gray-500 sm:inline dark:text-gray-400">
                      {item.n}
                    </span>
                    <button
                      onClick={() => toggleWatch(item.t)}
                      aria-label={`Remove ${item.t} from watchlist`}
                      className="text-xs text-gray-400 transition hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Popular stocks
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_STOCKS.map((item) => (
                <SymbolChip key={item.t} item={item} onClick={() => navigate(`/stocks/${item.t}`)} />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Popular crypto
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CRYPTO.map((item) => (
                <SymbolChip key={item.t} item={item} onClick={() => navigate(`/stocks/${item.t}`)} />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Popular ETFs
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_ETFS.map((item) => (
                <SymbolChip key={item.t} item={item} onClick={() => navigate(`/stocks/${item.t}`)} />
              ))}
            </div>
          </div>

          <div className="grid max-w-4xl gap-4 md:grid-cols-4">
            {LANDING_FEATURES.map(([title, subtitle]) => (
              <QuickTile key={title} title={title} subtitle={subtitle} />
            ))}
          </div>
        </div>
      )}

      {currentTicker && (
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold text-primary dark:text-white">
              {tickerMeta.displayName} {currentTicker !== tickerMeta.displayName ? `(${currentTicker})` : ""}
            </h2>
            <button
              onClick={() => toggleWatch(currentTicker, currentTicker)}
              aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                isWatched
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-slate-100 text-slate-600 hover:bg-yellow-100 hover:text-yellow-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {isWatched ? "Saved" : "Save to watchlist"}
            </button>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {assetLabel === "ETF"
                ? `ETF • ${tickerMeta.exchangeLabel}`
                : assetLabel === "fund"
                  ? `Fund • ${tickerMeta.exchangeLabel}`
                  : assetLabel === "crypto"
                  ? "Crypto"
                  : tickerMeta.exchangeLabel}
            </span>
          </div>

          <p className="mb-6 max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300">
            {tickerMeta.description}
          </p>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <QuickTile title="Chart and history" subtitle="Daily chart with longer-range context" />
            <QuickTile title="Technical view" subtitle="Quick buy, sell, and neutral signals" />
            <QuickTile title="News and profile" subtitle="Company details and recent headlines" />
          </div>

          <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
            <TVWidget
              id={`info-${tvSymbol}`}
              height={180}
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
              configFn={(dark) => ({
                symbol: tvSymbol,
                width: "100%",
                locale: "en",
                colorTheme: dark ? "dark" : "light",
                isTransparent: false,
              })}
            />
          </div>

          <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-900">
            <div className="px-4 pb-1 pt-4">
              <h3 className="font-bold text-primary dark:text-accent">Price chart</h3>
            </div>
            <TVWidget
              id={`chart-${tvSymbol}`}
              height={620}
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
              configFn={(dark) => ({
                autosize: false,
                width: "100%",
                height: 620,
                symbol: tvSymbol,
                interval: "D",
                timezone: "America/Toronto",
                theme: dark ? "dark" : "light",
                style: "1",
                locale: "en",
                save_image: true,
                support_host: "https://www.tradingview.com",
              })}
            />
          </div>

          <AdSlot slot="1901528811" format="auto" />

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <div className="px-4 pb-1 pt-4">
                <h3 className="font-bold text-primary dark:text-accent">Technical analysis</h3>
                <p className="text-xs text-gray-400">Buy, sell, and neutral signals</p>
              </div>
              <TVWidget
                id={`tech-${tvSymbol}`}
                height={425}
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
                configFn={(dark) => ({
                  interval: "1D",
                  width: "100%",
                  isTransparent: false,
                  height: 425,
                  symbol: tvSymbol,
                  showIntervalTabs: true,
                  locale: "en",
                  colorTheme: dark ? "dark" : "light",
                })}
              />
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <div className="px-4 pb-1 pt-4">
                <h3 className="font-bold text-primary dark:text-accent">
                  {isCrypto ? "Crypto profile" : isFundLike ? "Fund profile" : "Company profile"}
                </h3>
              </div>
              <TVWidget
                id={`profile-${tvSymbol}`}
                height={425}
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js"
                configFn={(dark) => ({
                  width: "100%",
                  height: 425,
                  symbol: tvSymbol,
                  colorTheme: dark ? "dark" : "light",
                  isTransparent: false,
                  locale: "en",
                })}
              />
            </div>
          </div>

          {(aiLoading || aiSummary) && (
            <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-gray-600 dark:from-gray-800 dark:to-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-bold text-primary dark:text-white">AI summary</h3>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Experimental
                </span>
              </div>
              {aiLoading ? (
                <div className="space-y-2">
                  <SkeletonLine cls="h-4 w-full" />
                  <SkeletonLine cls="h-4 w-11/12" />
                  <SkeletonLine cls="h-4 w-4/5" />
                </div>
              ) : (
                <p className="leading-relaxed text-gray-700 dark:text-gray-200">{aiSummary}</p>
              )}
              <p className="mt-4 text-xs text-gray-400">For informational purposes only. Not financial advice.</p>
            </div>
          )}

          {stockData && (
            <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <div className="px-4 pb-1 pt-4">
                <h3 className="font-bold text-primary dark:text-accent">
                  {isFundLike ? "Fund snapshot" : "Key metrics"}
                </h3>
                <p className="text-xs text-gray-400">
                  {isFundLike
                    ? "Live quote data and basic fund information"
                    : "Price, valuation, and trading metrics"}
                </p>
              </div>
              <div className="grid gap-3 px-4 pb-5 pt-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Price", value: stockData.price ? `${stockData.price} ${stockData.currency || ""}`.trim() : "N/A" },
                  { label: "Change", value: stockData.changePct !== undefined && stockData.changePct !== null ? `${Number(stockData.changePct).toFixed(2)}%` : "N/A" },
                  { label: "Day range", value: stockData.dayLow && stockData.dayHigh ? `${stockData.dayLow} - ${stockData.dayHigh}` : "N/A" },
                  { label: "52-week range", value: stockData.weekLow52 && stockData.weekHigh52 ? `${stockData.weekLow52} - ${stockData.weekHigh52}` : "N/A" },
                  { label: "Volume", value: stockData.volume || "N/A" },
                  { label: "Avg volume", value: stockData.avgVolume || "N/A" },
                  { label: "Market cap", value: stockData.marketCap || "N/A" },
                  { label: "Dividend yield", value: stockData.dividendYield || "N/A" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
                    <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showTradingViewFinancials ? (
            <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <div className="px-4 pb-1 pt-4">
                <h3 className="font-bold text-primary dark:text-accent">Financials</h3>
                <p className="text-xs text-gray-400">Income statement, balance sheet, and cash flow</p>
              </div>
              <TVWidget
                id={`fin-${tvSymbol}`}
                height={450}
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-financials.js"
                configFn={(dark) => ({
                  symbol: tvSymbol,
                  colorTheme: dark ? "dark" : "light",
                  isTransparent: false,
                  largeChartUrl: "",
                  displayMode: "regular",
                  width: "100%",
                  height: 450,
                  locale: "en",
                })}
              />
            </div>
          ) : !isCrypto ? (
            <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <div className="px-4 pb-1 pt-4">
                <h3 className="font-bold text-primary dark:text-accent">Fund details</h3>
                <p className="text-xs text-gray-400">This symbol behaves more like a fund or ETF than an operating company</p>
              </div>
              <div className="px-4 pb-5 pt-3">
                <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  Traditional company financial statements are often limited or unavailable for ETFs, closed-end funds, and covered-call products. Use the chart, profile, key metrics, and news blocks above to review this symbol instead.
                </div>
              </div>
            </div>
          ) : null}

          <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
            <div className="px-4 pb-1 pt-4">
              <h3 className="font-bold text-primary dark:text-accent">Latest news</h3>
            </div>
            <div className="px-4 pb-5 pt-3">
              {newsLoading ? (
                <div className="space-y-3">
                  <SkeletonLine cls="h-5 w-full" />
                  <SkeletonLine cls="h-5 w-11/12" />
                  <SkeletonLine cls="h-5 w-4/5" />
                  <SkeletonLine cls="h-5 w-10/12" />
                </div>
              ) : newsItems.length > 0 ? (
                <div className="grid gap-3">
                  {newsItems.map((item, index) => {
                    const href = item.link || item.url || "#";
                    const publisher =
                      item.publisher ||
                      item.providerPublishTimeSource ||
                      item.source ||
                      "Finance news";
                    return (
                      <a
                        key={`${href}-${index}`}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-gray-100 bg-slate-50 p-4 transition hover:border-secondary hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                      >
                        <p className="text-base font-semibold text-primary dark:text-accent">
                          {item.title || "Read the latest story"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{publisher}</span>
                          {item.providerPublishTime && <span>• {formatNewsDate(item.providerPublishTime)}</span>}
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  {isFundLike ? (
                    <div>
                      <p className="mb-4">
                        No recent fund-specific headlines were available right now. We tried both the ticker and fund name, so this usually means the live feed is sparse for this ETF.
                      </p>
                      <div className="grid gap-3 md:grid-cols-3">
                        {FUND_FALLBACK_RESOURCES.map((item) => (
                          <button
                            key={item.title}
                            onClick={() => navigate(item.href)}
                            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-secondary hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
                          >
                            <p className="text-sm font-semibold text-primary dark:text-accent">{item.title}</p>
                            <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">{item.body}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    "No recent headlines were available for this symbol right now. Try another ticker or check back later."
                  )}
                </div>
              )}
            </div>
          </div>

          <AdSlot slot="3078879111" format="auto" />

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              {isCrypto ? "Related crypto" : "Popular stocks"}
            </p>
            <div className="flex flex-wrap gap-2">
              {(isCrypto ? POPULAR_CRYPTO : POPULAR_STOCKS)
                .filter((item) => item.t !== currentTicker)
                .map((item) => (
                  <SymbolChip
                    key={item.t}
                    item={item}
                    onClick={() => navigate(`/stocks/${item.t}`)}
                  />
                ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Best ETFs for TFSA",
                body: "Compare common Canadian ETF choices like XEQT, VEQT, XGRO, and dividend-focused options.",
                href: "/blog/best-etfs-for-tfsa-canada-2026",
              },
              {
                title: "Dividend calculator",
                body: "Model income and DRIP scenarios if you are researching dividend ETFs or dividend stocks.",
                href: "/tools/dividend-calculator",
              },
              {
                title: "Beginner investing guide",
                body: "See where a stock or ETF fits inside a TFSA, RRSP, or a simple long-term plan.",
                href: "/blog/how-to-invest-in-canada-beginners-2026",
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.href)}
                className="rounded-2xl border border-gray-100 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <p className="text-lg font-bold text-primary dark:text-accent">{item.title}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.body}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatNewsDate(unixSeconds) {
  try {
    return new Date(unixSeconds * 1000).toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
