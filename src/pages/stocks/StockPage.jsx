import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdSlot from '../../components/AdSlot';

// Generic TradingView widget loader
function TVWidget({ id, scriptSrc, configFn, height }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    const isDark = document.documentElement.classList.contains('dark');
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.innerHTML = JSON.stringify(configFn(isDark));
    el.appendChild(script);
    return () => { if (el) el.innerHTML = ''; };
  }, [id]);
  return <div ref={ref} className="tradingview-widget-container w-full overflow-hidden" style={{ height }} />;
}

function Sk({ cls }) {
  return <div className={'animate-pulse bg-gray-200 dark:bg-gray-700 rounded ' + cls} />;
}

const POPULAR_STOCKS = [
  { t: 'AAPL',  n: 'Apple',      f: '🇺🇸' },
  { t: 'NVDA',  n: 'Nvidia',     f: '🇺🇸' },
  { t: 'TSLA',  n: 'Tesla',      f: '🇺🇸' },
  { t: 'SHOP',  n: 'Shopify',    f: '🇨🇦' },
  { t: 'RY',    n: 'Royal Bank', f: '🇨🇦' },
  { t: 'TD',    n: 'TD Bank',    f: '🇨🇦' },
];

const POPULAR_CRYPTO = [
  { t: 'BTC-USD', n: 'Bitcoin',  f: '₿' },
  { t: 'ETH-USD', n: 'Ethereum', f: 'Ξ' },
  { t: 'SOL-USD', n: 'Solana',   f: '◎' },
  { t: 'XRP-USD', n: 'XRP',      f: '✕' },
];

const POPULAR_ETFS = [
  { t: 'SPY',  n: 'S&P 500',    f: '📊' },
  { t: 'QQQ',  n: 'NASDAQ 100', f: '📊' },
  { t: 'XEQT.TO', n: 'iShares CA', f: '🇨🇦' },
];

// Map bare crypto tickers → Yahoo Finance symbol
const CRYPTO_MAP = {
  BTC: 'BTC-USD', ETH: 'ETH-USD', SOL: 'SOL-USD', XRP: 'XRP-USD',
  DOGE: 'DOGE-USD', ADA: 'ADA-USD', AVAX: 'AVAX-USD', DOT: 'DOT-USD',
  MATIC: 'MATIC-USD', SHIB: 'SHIB-USD', LTC: 'LTC-USD', LINK: 'LINK-USD',
  UNI: 'UNI-USD', ATOM: 'ATOM-USD', XLM: 'XLM-USD', BCH: 'BCH-USD',
  NEAR: 'NEAR-USD', ICP: 'ICP-USD', APT: 'APT-USD', ARB: 'ARB-USD',
  OP: 'OP-USD', INJ: 'INJ-USD', SUI: 'SUI-USD', TRX: 'TRX-USD',
};

// Convert Yahoo Finance symbol to TradingView symbol
function toTVSymbol(ticker, quote) {
  if (!ticker) return '';

  // If quote says it's crypto, use BINANCE format regardless of ticker format
  if (quote?.quoteType === 'CRYPTOCURRENCY') {
    const base = ticker.replace(/-USD$/, '').replace(/-USDT$/, '');
    return `BINANCE:${base}USDT`;
  }

  // Crypto: BTC-USD → BINANCE:BTCUSDT
  if (ticker.endsWith('-USD') || ticker.endsWith('-USDT')) {
    const base = ticker.replace(/-USD$/, '').replace(/-USDT$/, '');
    return `BINANCE:${base}USDT`;
  }

  // ETF / Stock: use exchange prefix from Yahoo Finance quote
  const exchangeMap = {
    // NASDAQ variants
    NMS: 'NASDAQ', NGM: 'NASDAQ', NCM: 'NASDAQ', NIM: 'NASDAQ',
    // NYSE variants
    NYQ: 'NYSE', NYS: 'NYSE',
    // NYSE Arca (ETFs like SPY, QQQ, YMAX) → TradingView calls it AMEX
    PCX: 'AMEX', AMX: 'AMEX', ASE: 'AMEX',
    // Canadian
    TSX: 'TSX', TOR: 'TSX', NEO: 'NEO', CNQ: 'TSXV',
    // Other
    BTS: 'AMEX', OBB: 'OTC', PNK: 'OTC',
  };
  if (quote) {
    const raw = quote.fullExchangeName || '';
    const mapped =
      exchangeMap[quote.exchange] ||
      (raw.includes('Nasdaq')     ? 'NASDAQ' :
       raw.includes('Arca')       ? 'AMEX'   :   // NYSE Arca ETFs
       raw.includes('NYSE')       ? 'NYSE'   :
       raw.includes('Toronto')    ? 'TSX'    :
       raw.includes('OTC')        ? 'OTC'    : 'NASDAQ');
    // TSX stocks often have .TO suffix in Yahoo — strip it for TradingView
    const cleanTicker = ticker.replace(/\.TO$/, '');
    return `${mapped}:${cleanTicker}`;
  }
  // Before quote loads — best-effort fallback (don't assume NASDAQ)
  if (ticker.includes('.TO')) return `TSX:${ticker.replace('.TO', '')}`;
  return ticker; // Let TradingView resolve by ticker only — avoids wrong-exchange errors
}

// Type badge colours
const TYPE_BADGE = {
  CRYPTOCURRENCY: { label: 'Crypto', cls: 'bg-orange-100 text-orange-600' },
  ETF:            { label: 'ETF',    cls: 'bg-purple-100 text-purple-600' },
  EQUITY:         { label: 'Stock',  cls: 'bg-blue-100 text-blue-600'    },
  MUTUALFUND:     { label: 'Fund',   cls: 'bg-green-100 text-green-600'  },
};

export default function StockPage() {
  const { ticker } = useParams();
  const navigate   = useNavigate();
  const [search, setSearch]         = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug]       = useState(false);
  const [quote, setQuote]           = useState(null);
  const [ai, setAi]                 = useState('');
  const [aiLoad, setAiLoad]         = useState(false);
  const [watchlist, setWatchlist]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist') || '[]'); } catch { return []; }
  });
  const searchRef  = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatch = (sym, name) => {
    setWatchlist(prev =>
      prev.some(w => w.t === sym)
        ? prev.filter(w => w.t !== sym)
        : [...prev, { t: sym, n: name || sym }]
    );
  };

  const t = ticker?.toUpperCase();
  const isWatched = watchlist.some(w => w.t === t);
  const isCrypto = !!(t && (t.endsWith('-USD') || t.endsWith('-USDT')));
  const tvSymbol = toTVSymbol(t, quote);

  // Fetch price + AI on ticker change
  useEffect(() => {
    if (!t) return;

    // Auto-redirect bare crypto tickers: BTC → BTC-USD
    if (CRYPTO_MAP[t]) {
      navigate('/stocks/' + CRYPTO_MAP[t], { replace: true });
      return;
    }

    setQuote(null);
    setAi('');
    // Fetch via server-side proxy (avoids CORS), fallback to direct
    fetch(`/api/quote?symbol=${encodeURIComponent(t)}`)
      .then(r => r.json())
      .then(d => { if (d?.quote?.regularMarketPrice) setQuote(d.quote); })
      .catch(() => {
        fetch('https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + t)
          .then(r => r.json())
          .then(d => { const q = d?.quoteResponse?.result?.[0]; if (q?.regularMarketPrice) setQuote(q); })
          .catch(() => {});
      });
    doAI(t);
  }, [t]);

  const doAI = async (ticker) => {
    setAiLoad(true);
    try {
      const r = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker }),
      });
      const j = await r.json();
      if (j.summary) setAi(j.summary);
    } catch {}
    setAiLoad(false);
  };

  // Live autocomplete
  const handleSearchInput = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setSuggestions([]); setShowSug(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
        const d = await r.json();
        const results = d.results || [];
        setSuggestions(results);
        setShowSug(results.length > 0);
      } catch { setSuggestions([]); setShowSug(false); }
    }, 250);
  };

  const handleSelectSuggestion = (symbol) => {
    setSearch(''); setSuggestions([]); setShowSug(false);
    navigate('/stocks/' + symbol);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const s = search.trim().toUpperCase();
    if (s) { navigate('/stocks/' + s); setSearch(''); setSuggestions([]); setShowSug(false); }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSug(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const up  = (quote?.regularMarketChangePercent ?? 0) >= 0;
  // Only render widgets once we have the correct exchange from the quote
  // This prevents TradingView from getting a wrong-exchange symbol like NASDAQ:YMAX
  const widgetReady = !!quote || !t;
  const sym = isCrypto ? '$' : (quote?.currency === 'CAD' ? 'C$' : '$');

  return (
    <div className="min-h-screen">
      <SEO
        title={t ? `${t} Chart, Analysis & News — Stocks, ETFs & Crypto` : 'Stock, ETF & Crypto Analysis — Charts, Technicals & News'}
        description={t ? `Live ${t} chart, technical analysis, and news. Free on EasyFinanceTools.` : 'Free analysis for US and Canadian stocks, ETFs, and crypto.'}
        canonical={t ? `https://easyfinancetools.com/stocks/${t}` : 'https://easyfinancetools.com/stocks'}
      />

      {/* Search hero */}
      <div className="bg-gradient-to-br from-primary to-secondary py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-white text-2xl font-bold mb-1">Stocks, ETFs & Crypto</h1>
          <p className="text-blue-200 text-sm mb-5">Live charts · Technical analysis · Financials · News</p>
          <div ref={searchRef} className="relative max-w-md mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text" value={search}
                onChange={e => handleSearchInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSug(true)}
                placeholder="Apple, AAPL, Bitcoin, BTC, SPY..."
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-accent"
                autoComplete="off"
              />
              <button type="submit"
                className="bg-accent text-primary font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition whitespace-nowrap">
                Search
              </button>
            </form>

            {/* Autocomplete dropdown */}
            {showSug && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                {suggestions.map((s) => {
                  const badge = TYPE_BADGE[s.type] || TYPE_BADGE.EQUITY;
                  return (
                    <button key={s.symbol} onMouseDown={() => handleSelectSuggestion(s.symbol)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition text-left border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-primary text-sm shrink-0">{s.symbol}</span>
                        <span className="text-gray-500 text-sm truncate">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>{badge.label}</span>
                        <span className="text-xs text-gray-400">{s.exchange}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Landing page */}
      {!t && (
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-primary dark:text-accent mb-3">Search any stock, ETF, or crypto</h2>
            <p className="text-gray-500 max-w-md mx-auto">NYSE · NASDAQ · TSX · Bitcoin · Ethereum · SPY · QQQ. All free.</p>
          </div>

          {/* Watchlist */}
          {watchlist.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">⭐ Your Watchlist</p>
                <button onClick={() => setWatchlist([])} className="text-xs text-gray-400 hover:text-red-500 transition">Clear all</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchlist.map(w => (
                  <div key={w.t} className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl pl-3 pr-1 py-1.5">
                    <button onClick={() => navigate('/stocks/' + w.t)} className="text-sm font-bold text-primary dark:text-yellow-300 hover:underline">
                      {w.t}
                    </button>
                    <span className="text-gray-400 text-xs ml-1 hidden sm:inline">{w.n}</span>
                    <button onClick={() => toggleWatch(w.t)} className="ml-1 p-1 text-gray-300 hover:text-red-400 transition text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Stocks */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">🇺🇸🇨🇦 Popular Stocks</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_STOCKS.map(s => (
                <button key={s.t} onClick={() => navigate('/stocks/' + s.t)}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 px-4 py-2 rounded-xl hover:border-blue-400 hover:text-blue-600 transition text-sm">
                  <span className="mr-1">{s.f}</span><span className="font-bold">{s.t}</span>
                  <span className="text-gray-400 ml-1 text-xs">{s.n}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Crypto */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">🪙 Popular Crypto</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CRYPTO.map(s => (
                <button key={s.t} onClick={() => navigate('/stocks/' + s.t)}
                  className="bg-white dark:bg-gray-800 border-2 border-orange-100 dark:border-gray-700 px-4 py-2 rounded-xl hover:border-orange-400 hover:text-orange-600 transition text-sm">
                  <span className="mr-1">{s.f}</span><span className="font-bold">{s.t.replace('-USD','')}</span>
                  <span className="text-gray-400 ml-1 text-xs">{s.n}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Popular ETFs */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">📊 Popular ETFs</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_ETFS.map(s => (
                <button key={s.t} onClick={() => navigate('/stocks/' + s.t)}
                  className="bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-gray-700 px-4 py-2 rounded-xl hover:border-purple-400 hover:text-purple-600 transition text-sm">
                  <span className="mr-1">{s.f}</span><span className="font-bold">{s.t}</span>
                  <span className="text-gray-400 ml-1 text-xs">{s.n}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              ['📊', 'Interactive Chart',  '1D to all-time'],
              ['🎯', 'Technical Analysis', 'Buy/Sell signals'],
              ['🏢', 'Company Profile',    'Business overview'],
              ['📰', 'Latest News',        'Real-time feed'],
            ].map(([ic, lb, sb]) => (
              <div key={lb} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{ic}</div>
                <p className="font-bold text-sm text-primary dark:text-white">{lb}</p>
                <p className="text-xs text-gray-400 mt-1">{sb}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticker page */}
      {t && (
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* Price header */}
          {quote ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-2xl font-bold text-primary dark:text-white">{t}</h2>
                  <button
                    onClick={() => toggleWatch(t, quote.shortName)}
                    title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
                    className={`text-xl transition-transform hover:scale-110 ${isWatched ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                  >
                    {isWatched ? '★' : '☆'}
                  </button>
                  {isCrypto && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">Crypto</span>}
                  {!isCrypto && quote.fullExchangeName && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded font-medium">{quote.fullExchangeName}</span>
                  )}
                  <span className={'text-xs px-2 py-0.5 rounded-full font-bold ' + (up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                    {up ? '▲' : '▼'} {up ? 'Up' : 'Down'} today
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{quote.shortName}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-3xl font-bold text-primary dark:text-white">{sym}{quote.regularMarketPrice?.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: isCrypto && quote.regularMarketPrice > 1000 ? 0 : 2 })}</p>
                <p className={'text-lg font-semibold ' + (up ? 'text-green-600' : 'text-red-500')}>
                  {up ? '+' : ''}{quote.regularMarketChange?.toFixed(2)} ({up ? '+' : ''}{quote.regularMarketChangePercent?.toFixed(2)}%)
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Today · {quote.currency}</p>
                {!isCrypto && (
                  <div className="mt-2 flex sm:justify-end gap-3 flex-wrap">
                    {quote.trailingAnnualDividendYield > 0 ? (
                      <>
                        <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-200 dark:border-green-700">
                          💵 Yield: {(quote.trailingAnnualDividendYield * 100).toFixed(2)}%
                        </span>
                        <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700">
                          📅 {sym}{quote.trailingAnnualDividendRate?.toFixed(4)}/yr
                        </span>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-50 dark:bg-gray-700 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                        No dividend
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-primary dark:text-accent">{t}</h2>
              <p className="text-gray-400 text-sm mt-1">Loading data…</p>
            </div>
          )}

          {/* Widget loading skeleton — shown while waiting for correct exchange info */}
          {!widgetReady && (
            <div className="space-y-4 mb-6">
              <Sk cls="w-full rounded-2xl" style={{height: 620}} />
            </div>
          )}

          {/* Key Stats */}
          {quote && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Market Cap',       value: quote.marketCap ? (quote.marketCap >= 1e12 ? `${sym}${(quote.marketCap/1e12).toFixed(2)}T` : quote.marketCap >= 1e9 ? `${sym}${(quote.marketCap/1e9).toFixed(2)}B` : `${sym}${(quote.marketCap/1e6).toFixed(0)}M`) : '—' },
                { label: '52W High',         value: quote.fiftyTwoWeekHigh ? `${sym}${quote.fiftyTwoWeekHigh.toFixed(2)}` : '—' },
                { label: '52W Low',          value: quote.fiftyTwoWeekLow  ? `${sym}${quote.fiftyTwoWeekLow.toFixed(2)}`  : '—' },
                { label: 'Volume',           value: quote.regularMarketVolume ? quote.regularMarketVolume.toLocaleString() : '—' },
                { label: 'Avg Volume',       value: quote.averageDailyVolume3Month ? quote.averageDailyVolume3Month.toLocaleString() : '—' },
                { label: 'P/E Ratio',        value: quote.trailingPE ? quote.trailingPE.toFixed(2) : '—' },
                { label: 'EPS (TTM)',        value: quote.epsTrailingTwelveMonths ? `${sym}${quote.epsTrailingTwelveMonths.toFixed(2)}` : '—' },
                { label: 'Day Range',        value: quote.regularMarketDayLow && quote.regularMarketDayHigh ? `${sym}${quote.regularMarketDayLow.toFixed(2)} – ${sym}${quote.regularMarketDayHigh.toFixed(2)}` : '—' },
                ...(!isCrypto ? [
                  { label: 'Dividend / Share', value: quote.trailingAnnualDividendRate ? `${sym}${quote.trailingAnnualDividendRate.toFixed(4)}` : 'None' },
                  { label: 'Dividend Yield',   value: quote.trailingAnnualDividendYield ? `${(quote.trailingAnnualDividendYield * 100).toFixed(2)}%` : 'None' },
                  { label: 'Ex-Div Date',      value: quote.exDividendDate ? new Date(quote.exDividendDate * 1000).toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' }) : '—' },
                  { label: 'Payout Ratio',     value: quote.payoutRatio ? `${(quote.payoutRatio * 100).toFixed(1)}%` : '—' },
                ] : [
                  { label: 'Circulating Supply', value: quote.circulatingSupply ? Number(quote.circulatingSupply).toLocaleString() : '—' },
                  { label: 'Start of Day',        value: quote.regularMarketOpen ? `${sym}${quote.regularMarketOpen.toFixed(2)}` : '—' },
                ]),
              ].map(({ label, value }) => (
                <div key={label} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="font-bold text-primary dark:text-white text-sm">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chart + all widgets — only render once we have the correct exchange */}
          {widgetReady && <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden mb-6">
            <div className="px-4 pt-4 pb-1">
              <h3 className="font-bold text-primary dark:text-accent">📈 Price Chart</h3>
            </div>
            <TVWidget
              id={'chart-' + tvSymbol}
              height={620}
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
              configFn={(dark) => ({
                autosize: false, width: '100%', height: 620,
                symbol: tvSymbol, interval: 'D',
                timezone: 'America/Toronto', theme: dark ? 'dark' : 'light',
                style: '1', locale: 'en', hide_top_toolbar: false,
                hide_legend: false, save_image: true,
                support_host: 'https://www.tradingview.com',
              })}
            />
          </div>}

          <AdSlot slot="2345678901" format="auto" />

          {/* Technical Analysis + Company/Crypto Profile */}
          {widgetReady && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
              <div className="px-4 pt-4 pb-1">
                <h3 className="font-bold text-primary dark:text-accent">🎯 Technical Analysis</h3>
                <p className="text-xs text-gray-400">Buy / Sell / Neutral signals</p>
              </div>
              <TVWidget
                id={'tech-' + tvSymbol}
                height={425}
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
                configFn={(dark) => ({
                  interval: '1D', width: '100%', isTransparent: false,
                  height: 425, symbol: tvSymbol, showIntervalTabs: true,
                  locale: 'en', colorTheme: dark ? 'dark' : 'light',
                })}
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
              <div className="px-4 pt-4 pb-1">
                <h3 className="font-bold text-primary dark:text-accent">{isCrypto ? '🪙 Crypto Profile' : '🏢 Company Profile'}</h3>
                <p className="text-xs text-gray-400">{isCrypto ? 'Token info & key metrics' : 'Business overview & key info'}</p>
              </div>
              <TVWidget
                id={'profile-' + tvSymbol}
                height={425}
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js"
                configFn={(dark) => ({
                  width: '100%', height: 425, symbol: tvSymbol,
                  colorTheme: dark ? 'dark' : 'light',
                  isTransparent: false, locale: 'en',
                })}
              />
            </div>
          </div>}

          {/* AI Summary */}
          {(aiLoad || ai) && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <h3 className="text-lg font-bold text-primary dark:text-white">AI Summary</h3>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">Claude AI</span>
              </div>
              {aiLoad
                ? <div className="space-y-2"><Sk cls="h-4 w-full" /><Sk cls="h-4 w-11/12" /><Sk cls="h-4 w-4/5" /></div>
                : <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{ai}</p>
              }
              <p className="text-xs text-gray-400 mt-4">For informational purposes only. Not financial advice.</p>
            </div>
          )}

          {/* Financials — stocks & ETFs only, not crypto */}
          {widgetReady && !isCrypto && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden mb-6">
              <div className="px-4 pt-4 pb-1">
                <h3 className="font-bold text-primary dark:text-accent">💰 Financials</h3>
                <p className="text-xs text-gray-400">Income statement, balance sheet & cash flow</p>
              </div>
              <TVWidget
                id={'fin-' + tvSymbol}
                height={450}
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-financials.js"
                configFn={(dark) => ({
                  symbol: tvSymbol, colorTheme: dark ? 'dark' : 'light',
                  isTransparent: false, largeChartUrl: '',
                  displayMode: 'regular', width: '100%', height: 450, locale: 'en',
                })}
              />
            </div>
          )}

          {/* News */}
          {widgetReady && <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden mb-6">
            <div className="px-4 pt-4 pb-1">
              <h3 className="font-bold text-primary dark:text-accent">📰 Latest News</h3>
              <p className="text-xs text-gray-400">Real-time news feed</p>
            </div>
            <TVWidget
              id={'news-' + tvSymbol}
              height={500}
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
              configFn={(dark) => ({
                feedMode: 'symbol', symbol: tvSymbol,
                colorTheme: dark ? 'dark' : 'light',
                isTransparent: false, displayMode: 'regular',
                width: '100%', height: 500, locale: 'en',
              })}
            />
          </div>}

          <AdSlot slot="3456789012" format="auto" />

          {/* Related */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Explore more</p>
            <div className="flex flex-wrap gap-2">
              {[...POPULAR_STOCKS, ...POPULAR_CRYPTO, ...POPULAR_ETFS]
                .filter(s => s.t !== t && s.t !== ticker)
                .slice(0, 10)
                .map(s => (
                  <button key={s.t} onClick={() => navigate('/stocks/' + s.t)}
                    className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-primary dark:text-white px-4 py-1.5 rounded-lg font-bold hover:bg-secondary hover:text-white hover:border-secondary transition">
                    {s.f} {s.t.replace('-USD', '')}
                  </button>
                ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
