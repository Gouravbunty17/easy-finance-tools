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

const POPULAR = [
  { t: 'AAPL', n: 'Apple',      f: '🇺🇸' },
  { t: 'NVDA', n: 'Nvidia',     f: '🇺🇸' },
  { t: 'MSFT', n: 'Microsoft',  f: '🇺🇸' },
  { t: 'TSLA', n: 'Tesla',      f: '🇺🇸' },
  { t: 'AMZN', n: 'Amazon',     f: '🇺🇸' },
  { t: 'SHOP', n: 'Shopify',    f: '🇨🇦' },
  { t: 'TD',   n: 'TD Bank',    f: '🇨🇦' },
  { t: 'RY',   n: 'Royal Bank', f: '🇨🇦' },
  { t: 'BNS',  n: 'Scotiabank', f: '🇨🇦' },
  { t: 'ENB',  n: 'Enbridge',   f: '🇨🇦' },
];

export default function StockPage() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [quote, setQuote] = useState(null);
  const [ai, setAi] = useState('');
  const [aiLoad, setAiLoad] = useState(false);
  const t = ticker?.toUpperCase();

  useEffect(() => {
    if (!t) return;
    setQuote(null);
    setAi('');
    fetch('https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + t)
      .then(r => r.json())
      .then(d => {
        const q = d?.quoteResponse?.result?.[0];
        if (q?.regularMarketPrice) {
          setQuote(q);
          doAI(q);
        }
      })
      .catch(() => {});
  }, [t]);

  const doAI = async (q) => {
    setAiLoad(true);
    try {
      const r = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: t,
          name: q.shortName || t,
          price: q.regularMarketPrice,
          change: q.regularMarketChangePercent?.toFixed(2),
          marketCap: 'N/A',
          pe: 'N/A',
          sector: 'N/A',
        }),
      });
      const j = await r.json();
      if (j.summary) setAi(j.summary);
    } catch {}
    setAiLoad(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const s = search.trim().toUpperCase();
    if (s) { navigate('/stocks/' + s); setSearch(''); }
  };

  const up = (quote?.regularMarketChangePercent ?? 0) >= 0;
  const sym = quote?.currency === 'CAD' ? 'C$' : '$';

  // Build full TradingView symbol with exchange prefix (once quote loads)
  const exchangeMap = { NMS: 'NASDAQ', NGM: 'NASDAQ', NCM: 'NASDAQ', NYQ: 'NYSE', TSX: 'TSX', NEO: 'NEO', AMX: 'AMEX' };
  const rawExchange = quote?.fullExchangeName || quote?.exchange || '';
  const tvExchange = exchangeMap[quote?.exchange] || (rawExchange.includes('Nasdaq') ? 'NASDAQ' : rawExchange.includes('NYSE') ? 'NYSE' : rawExchange.includes('Toronto') ? 'TSX' : 'NASDAQ');
  // Before quote loads fall back to NASDAQ:TICKER (works for most US stocks)
  const tvSymbol = quote ? `${tvExchange}:${t}` : `NASDAQ:${t}`;

  return (
    <div className="min-h-screen">
      <SEO
        title={t ? t + ' Stock Chart, Technical Analysis & News' : 'Stock Analysis — Charts, Technicals & News'}
        description={t ? 'Live ' + t + ' chart, technical analysis, financials and news. Free on EasyFinanceTools.' : 'Free stock analysis for US and Canadian stocks.'}
        canonical={t ? 'https://easyfinancetools.com/stocks/' + t : 'https://easyfinancetools.com/stocks'}
      />

      {/* Search hero */}
      <div className="bg-gradient-to-br from-primary to-secondary py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-white text-2xl font-bold mb-1">Stock Analysis</h1>
          <p className="text-blue-200 text-sm mb-5">Live charts · Technical analysis · Financials · News</p>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto">
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value.toUpperCase())}
              placeholder="AAPL, SHOP, TD, NVDA..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit"
              className="bg-accent text-primary font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition whitespace-nowrap">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Landing — no ticker */}
      {!t && (
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-2xl font-bold text-primary dark:text-accent mb-3">Search any stock above</h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">
            US and Canadian stocks — NYSE, NASDAQ, TSX. Charts, technical analysis, financials and news. Free.
          </p>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Popular</p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {POPULAR.map(s => (
              <button key={s.t} onClick={() => navigate('/stocks/' + s.t)}
                className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 px-5 py-2.5 rounded-xl hover:border-secondary hover:text-secondary transition text-sm">
                <span className="mr-1">{s.f}</span>
                <span className="font-bold">{s.t}</span>
                <span className="text-gray-400 ml-1 text-xs">{s.n}</span>
              </button>
            ))}
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
                  {quote.fullExchangeName && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded font-medium">
                      {quote.fullExchangeName}
                    </span>
                  )}
                  <span className={'text-xs px-2 py-0.5 rounded-full font-bold ' + (up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                    {up ? '▲ Bullish' : '▼ Bearish'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{quote.shortName}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-3xl font-bold text-primary dark:text-white">{sym}{quote.regularMarketPrice?.toFixed(2)}</p>
                <p className={'text-lg font-semibold ' + (up ? 'text-green-600' : 'text-red-500')}>
                  {up ? '+' : ''}{quote.regularMarketChange?.toFixed(2)} ({up ? '+' : ''}{quote.regularMarketChangePercent?.toFixed(2)}%)
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Today · {quote.currency}</p>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-primary dark:text-accent">{t}</h2>
              <p className="text-gray-400 text-sm mt-1">Loading chart…</p>
            </div>
          )}

          {/* Chart */}
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
                style: '1', locale: 'en', hide_top_toolbar: false,
                hide_legend: false, save_image: true,
                support_host: 'https://www.tradingview.com',
              })}
            />
          </div>

          <AdSlot slot="2345678901" format="auto" />

          {/* Technical Analysis + Company Profile */}
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
                <h3 className="font-bold text-primary dark:text-accent">🏢 Company Profile</h3>
                <p className="text-xs text-gray-400">Business overview & key info</p>
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

          {/* Financials */}
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

          {/* News */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden mb-6">
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
          </div>

          <AdSlot slot="3456789012" format="auto" />

          {/* Related */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Explore other stocks</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.filter(s => s.t !== t).map(s => (
                <button key={s.t} onClick={() => navigate('/stocks/' + s.t)}
                  className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-primary dark:text-white px-4 py-1.5 rounded-lg font-bold hover:bg-secondary hover:text-white hover:border-secondary transition">
                  {s.f} {s.t}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
