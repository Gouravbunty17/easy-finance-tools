import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdSlot from '../../components/AdSlot';

/* ─── TradingView widget loader ─── */
function TVWidget({ id, scriptSrc, configFn, height }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    const isDark = document.documentElement.classList.contains('dark');
    const container = document.createElement('div');
    container.className = 'tradingview-widget-container__widget';
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.innerHTML = JSON.stringify(configFn(isDark));
    el.appendChild(container);
    el.appendChild(script);
    return () => { if (el) el.innerHTML = ''; };
  }, [id]);
  return <div ref={ref} className="tradingview-widget-container w-full overflow-hidden" style={{ minHeight: height }} />;
}

function Sk({ cls }) {
  return <div className={'animate-pulse bg-gray-200 dark:bg-gray-700 rounded ' + cls} />;
}

/* ─── Popular lists ─── */
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
  { t: 'SPY',     n: 'S&P 500',    f: '📊' },
  { t: 'QQQ',     n: 'NASDAQ 100', f: '📊' },
  { t: 'XEQT.TO', n: 'iShares CA', f: '🇨🇦' },
];

/* ─── Known Canadian TSX stocks (no .TO suffix from user) ─── */
const TSX_TICKERS = new Set([
  'RY','TD','ENB','CNR','CP','BNS','MFC','SU','BMO','ABX',
  'CM','CNQ','TRP','PPL','FTS','POW','IFC','T','BCE','SHOP',
  'RCI','MG','L','EMA','KEY','AEM','PKI','GWO','WN','ATD',
  'CVE','IMO','NTR','WPM','BHC','CAR','CTC','MRU','EMP',
]);

/* ─── Crypto short codes ─── */
const CRYPTO_MAP = {
  BTC:'BTC-USD',ETH:'ETH-USD',SOL:'SOL-USD',XRP:'XRP-USD',
  DOGE:'DOGE-USD',ADA:'ADA-USD',AVAX:'AVAX-USD',DOT:'DOT-USD',
  MATIC:'MATIC-USD',SHIB:'SHIB-USD',LTC:'LTC-USD',LINK:'LINK-USD',
  UNI:'UNI-USD',ATOM:'ATOM-USD',XLM:'XLM-USD',BCH:'BCH-USD',
  NEAR:'NEAR-USD',ICP:'ICP-USD',APT:'APT-USD',ARB:'ARB-USD',
  OP:'OP-USD',SUI:'SUI-USD',TRX:'TRX-USD',INJ:'INJ-USD',
};

/* ─── Resolve ticker → TradingView symbol (no API needed) ─── */
function toTVSymbol(ticker) {
  if (!ticker) return '';
  // Crypto: BTC-USD → BINANCE:BTCUSDT
  if (ticker.endsWith('-USD') || ticker.endsWith('-USDT')) {
    const base = ticker.replace(/-USD$/, '').replace(/-USDT$/, '');
    return `BINANCE:${base}USDT`;
  }
  // Canadian .TO suffix
  if (ticker.endsWith('.TO')) return `TSX:${ticker.replace(/\.TO$/, '')}`;
  // Known Canadian
  if (TSX_TICKERS.has(ticker)) return `TSX:${ticker}`;
  // Default — TradingView resolves most US tickers automatically
  return ticker;
}

const TYPE_BADGE = {
  CRYPTOCURRENCY: { label: 'Crypto', cls: 'bg-orange-100 text-orange-600' },
  ETF:            { label: 'ETF',    cls: 'bg-purple-100 text-purple-600' },
  EQUITY:         { label: 'Stock',  cls: 'bg-blue-100 text-blue-600'    },
  MUTUALFUND:     { label: 'Fund',   cls: 'bg-green-100 text-green-600'  },
};

export default function StockPage() {
  const { ticker }  = useParams();
  const navigate    = useNavigate();
  const [search, setSearch]             = useState('');
  const [suggestions, setSuggestions]   = useState([]);
  const [showSug, setShowSug]           = useState(false);
  const [ai, setAi]                     = useState('');
  const [aiLoad, setAiLoad]             = useState(false);
  const [watchlist, setWatchlist]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist') || '[]'); } catch { return []; }
  });
  const searchRef   = useRef(null);
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

  const t          = ticker?.toUpperCase();
  const isWatched  = watchlist.some(w => w.t === t);
  const isCrypto   = !!(t && (t.endsWith('-USD') || t.endsWith('-USDT')));
  const tvSymbol   = toTVSymbol(t);

  /* ─── Auto-redirect bare crypto tickers ─── */
  useEffect(() => {
    if (!t) return;
    if (CRYPTO_MAP[t]) { navigate('/stocks/' + CRYPTO_MAP[t], { replace: true }); return; }
    setAi('');
    doAI(t);
  }, [t]);

  /* ─── AI Summary (silent fail — optional enhancement) ─── */
  const doAI = async (sym) => {
    setAiLoad(true);
    try {
      const r = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: sym }),
      });
      // Guard: if response is HTML (routing broken) just bail
      const ct = r.headers.get('content-type') || '';
      if (!ct.includes('application/json')) { setAiLoad(false); return; }
      const j = await r.json();
      if (j?.summary) setAi(j.summary);
    } catch { /* silent */ }
    setAiLoad(false);
  };

  /* ─── Autocomplete (silent fail — nice-to-have) ─── */
  const handleSearchInput = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setSuggestions([]); setShowSug(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
        const ct = r.headers.get('content-type') || '';
        if (!ct.includes('application/json')) return; // routing broken — skip
        const d = await r.json();
        setSuggestions(d.results || []);
        setShowSug((d.results || []).length > 0);
      } catch { /* silent */ }
    }, 280);
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

  useEffect(() => {
    const h = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSug(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title={t ? `${t} Stock Chart & Analysis — EasyFinanceTools` : 'Stock, ETF & Crypto Charts — EasyFinanceTools'}
        description={t ? `Live ${t} chart, technical analysis, financials and news. Free on EasyFinanceTools.` : 'Free live charts, technical analysis and news for US & Canadian stocks, ETFs and crypto.'}
        canonical={t ? `https://easyfinancetools.com/stocks/${t}` : 'https://easyfinancetools.com/stocks'}
      />

      {/* ── Search hero ── */}
      <div className="bg-gradient-to-br from-primary to-secondary py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-white text-2xl font-bold mb-1">Stocks, ETFs &amp; Crypto</h1>
          <p className="text-blue-200 text-sm mb-5">Live charts · Technical analysis · Financials · News</p>
          <div ref={searchRef} className="relative max-w-md mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text" value={search}
                onChange={e => handleSearchInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSug(true)}
                placeholder="Apple, AAPL, Bitcoin, BTC, SPY…"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-accent"
                autoComplete="off"
                aria-label="Search stocks, ETFs, or crypto"
              />
              <button type="submit" aria-label="Search"
                className="bg-accent text-primary font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition whitespace-nowrap">
                Search
              </button>
            </form>
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

      {/* ── Landing (no ticker) ── */}
      {!t && (
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-primary dark:text-accent mb-3">Search any stock, ETF, or crypto</h2>
            <p className="text-gray-500 max-w-md mx-auto">NYSE · NASDAQ · TSX · Bitcoin · Ethereum · SPY · QQQ. All free.</p>
          </div>

          {watchlist.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">⭐ Your Watchlist</p>
                <button onClick={() => setWatchlist([])} className="text-xs text-gray-400 hover:text-red-500 transition">Clear all</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchlist.map(w => (
                  <div key={w.t} className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl pl-3 pr-1 py-1.5">
                    <button onClick={() => navigate('/stocks/' + w.t)} className="text-sm font-bold text-primary dark:text-yellow-300 hover:underline">{w.t}</button>
                    <span className="text-gray-400 text-xs ml-1 hidden sm:inline">{w.n}</span>
                    <button onClick={() => toggleWatch(w.t)} aria-label={`Remove ${w.t} from watchlist`} className="ml-1 p-1 text-gray-300 hover:text-red-400 transition text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            {[['📊','Interactive Chart','1D to all-time'],['🎯','Technical Analysis','Buy/Sell signals'],['🏢','Company Profile','Business overview'],['📰','Latest News','Real-time feed']].map(([ic,lb,sb]) => (
              <div key={lb} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{ic}</div>
                <p className="font-bold text-sm text-primary dark:text-white">{lb}</p>
                <p className="text-xs text-gray-400 mt-1">{sb}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Ticker page ── */}
      {t && (
        <div className="max-w-5xl mx-auto px-4 py-6">

          {/* Ticker header with watchlist */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-primary dark:text-white">{t}</h2>
            <button
              onClick={() => toggleWatch(t, t)}
              aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
              className={`text-2xl transition-transform hover:scale-110 ${isWatched ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
            >
              {isWatched ? '★' : '☆'}
            </button>
            {isCrypto && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">Crypto</span>}
          </div>

          {/* ── TradingView Symbol Info widget (live price + stats, no API needed) ── */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden mb-4">
            <TVWidget
              id={'info-' + tvSymbol}
              height={180}
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
              configFn={(dark) => ({
                symbol: tvSymbol,
                width: '100%',
                locale: 'en',
                colorTheme: dark ? 'dark' : 'light',
                isTransparent: false,
              })}
            />
          </div>

          {/* ── Advanced Chart ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden mb-6">
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
                style: '1', locale: 'en', save_image: true,
                support_host: 'https://www.tradingview.com',
              })}
            />
          </div>

          <AdSlot slot="1901528811" format="auto" />

          {/* ── Technical Analysis + Profile ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          </div>

          {/* ── AI Summary (shown only when loaded) ── */}
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

          {/* ── Financials (stocks/ETFs only) ── */}
          {!isCrypto && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden mb-6">
              <div className="px-4 pt-4 pb-1">
                <h3 className="font-bold text-primary dark:text-accent">💰 Financials</h3>
                <p className="text-xs text-gray-400">Income statement, balance sheet &amp; cash flow</p>
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

          {/* ── News ── */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden mb-6">
            <div className="px-4 pt-4 pb-1">
              <h3 className="font-bold text-primary dark:text-accent">📰 Latest News</h3>
            </div>
            <TVWidget
              id={'news-' + tvSymbol}
              height={500}
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
              configFn={(dark) => ({
                feedMode: 'symbol',
                symbol: tvSymbol,
                colorTheme: dark ? 'dark' : 'light',
                isTransparent: false,
                displayMode: 'regular',
                width: '100%',
                height: 500,
                locale: 'en',
              })}
            />
          </div>

          <AdSlot slot="3078879111" format="auto" />

          {/* ── Related symbols ── */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {isCrypto ? '🪙 Related Crypto' : '🇨🇦🇺🇸 Popular Stocks'}
            </p>
            <div className="flex flex-wrap gap-2">
              {(isCrypto ? POPULAR_CRYPTO : POPULAR_STOCKS)
                .filter(s => s.t !== t)
                .map(s => (
                  <button key={s.t} onClick={() => navigate('/stocks/' + s.t)}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 px-4 py-2 rounded-xl hover:border-blue-400 transition text-sm font-bold text-primary dark:text-white">
                    {s.f} {s.t.replace('-USD','')}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
