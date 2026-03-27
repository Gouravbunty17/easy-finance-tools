import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdSlot from '../../components/AdSlot';

function TradingViewChart({ ticker }) {
  const ref = useRef(null);
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true, symbol: ticker, interval: 'D',
      timezone: 'America/Toronto', theme: isDark ? 'dark' : 'light',
      style: '1', locale: 'en', hide_top_toolbar: false,
      hide_legend: false, save_image: false, calendar: false,
      support_host: 'https://www.tradingview.com',
    });
    ref.current.appendChild(script);
    return () => { if (ref.current) ref.current.innerHTML = ''; };
  }, [ticker, isDark]);

  return <div ref={ref} className="tradingview-widget-container w-full rounded-xl overflow-hidden" style={{ height: 460 }} />;
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</p>
      <p className="text-base font-bold text-primary dark:text-white truncate">{value || '—'}</p>
    </div>
  );
}

function Sk({ className }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

const POPULAR = [
  { t: 'AAPL', n: 'Apple' }, { t: 'MSFT', n: 'Microsoft' }, { t: 'NVDA', n: 'Nvidia' },
  { t: 'TSLA', n: 'Tesla' }, { t: 'AMZN', n: 'Amazon' }, { t: 'SHOP', n: 'Shopify' },
  { t: 'TD', n: 'TD Bank' }, { t: 'RY', n: 'Royal Bank' },
  { t: 'BNS', n: 'Scotiabank' }, { t: 'ENB', n: 'Enbridge' },
];

export default function StockPage() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stock, setStock] = useState(null);
  const [news, setNews] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const t = ticker?.toUpperCase();

  useEffect(() => {
    if (!t) return;
    setLoading(true); setError(null); setStock(null); setNews([]); setAiSummary('');

    fetch(`/api/stock?ticker=${t}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setStock(d.stock);
        setNews(d.news || []);
        setLoading(false);
        fetchAI(d.stock);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [t]);

  const fetchAI = async (s) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: s.ticker, name: s.name, price: s.price,
          change: s.changePct?.toFixed(2), marketCap: s.marketCap,
          pe: s.trailingPE, sector: s.sector,
        }),
      });
      const json = await res.json();
      if (json.summary) setAiSummary(json.summary);
    } catch { }
    setAiLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const s = search.trim().toUpperCase();
    if (s) { navigate(`/stocks/${s}`); setSearch(''); }
  };

  const isUp = (stock?.changePct ?? 0) >= 0;
  const sym = stock?.currency === 'CAD' ? 'C$' : '$';

  const pos52 = stock?.weekLow52 && stock?.weekHigh52 && stock?.price
    ? Math.round(((stock.price - stock.weekLow52) / (stock.weekHigh52 - stock.weekLow52)) * 100)
    : null;

  const stats = stock ? [
    { label: 'Market Cap',     value: stock.marketCap },
    { label: 'P/E (TTM)',      value: stock.trailingPE !== 'N/A' ? stock.trailingPE : null },
    { label: 'Forward P/E',    value: stock.forwardPE  !== 'N/A' ? stock.forwardPE  : null },
    { label: 'EPS (TTM)',      value: stock.eps !== 'N/A' ? `${sym}${stock.eps}` : null },
    { label: 'Volume',         value: stock.volume },
    { label: 'Avg Volume',     value: stock.avgVolume },
    { label: '52W High',       value: stock.weekHigh52 ? `${sym}${stock.weekHigh52.toFixed(2)}` : null },
    { label: '52W Low',        value: stock.weekLow52  ? `${sym}${stock.weekLow52.toFixed(2)}`  : null },
    { label: 'Dividend Yield', value: stock.dividendYield !== 'N/A' ? stock.dividendYield : null },
    { label: 'Beta',           value: stock.beta !== 'N/A' ? stock.beta : null },
    { label: 'Sector',         value: stock.sector || null },
    { label: 'Industry',       value: stock.industry || null },
  ].filter(s => s.value) : [];

  return (
    <div className="min-h-screen">
      <SEO
        title={t ? `${t} Stock Price & Analysis${stock?.name && stock.name !== t ? ` — ${stock.name}` : ''}` : 'Stock Analysis — Live Prices & AI Summaries'}
        description={t
          ? `Live ${t} stock price, chart, AI analysis, key stats and news. Free on EasyFinanceTools.`
          : 'Free stock analysis for US and Canadian stocks. Live prices, TradingView charts, AI summaries and news.'}
        canonical={t ? `https://easyfinancetools.com/stocks/${t}` : 'https://easyfinancetools.com/stocks'}
      />

      <div className="bg-gradient-to-br from-primary to-secondary py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-2xl font-bold mb-1 text-center">Stock Analysis</h1>
          <p className="text-blue-200 text-sm text-center mb-5">Live prices · TradingView charts · AI summaries · News</p>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto">
            <input type="text" value={search} onChange={e => setSearch(e.target.value.toUpperCase())}
              placeholder="AAPL, SHOP, TD, RY..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-accent" />
            <button type="submit"
              className="bg-accent text-primary font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition whitespace-nowrap">
              Search
            </button>
          </form>
        </div>
      </div>

      {!t && (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-2xl font-bold text-primary dark:text-accent mb-3">Search any stock above</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">US and Canadian stocks — NYSE, NASDAQ, TSX. Free. No sign-up.</p>
          <div className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wide">Popular</div>
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR.map(s => (
              <button key={s.t} onClick={() => navigate(`/stocks/${s.t}`)}
                className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-primary dark:text-white px-5 py-2 rounded-xl font-bold hover:border-secondary hover:text-secondary transition text-sm">
                <span className="font-bold">{s.t}</span>
                <span className="text-xs text-gray-400 ml-1">{s.n}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {t && error && (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-2">Could not load {t}</h2>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto text-sm">{error}</p>
          <button onClick={() => navigate('/stocks')}
            className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary transition">
            ← Try another ticker
          </button>
        </div>
      )}

      {t && loading && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <div><Sk className="h-8 w-40 mb-2" /><Sk className="h-4 w-56" /></div>
            <div className="text-right"><Sk className="h-10 w-28 mb-2" /><Sk className="h-5 w-20 ml-auto" /></div>
          </div>
          <Sk className="h-96 w-full mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => <Sk key={i} className="h-16" />)}
          </div>
        </div>
      )}

      {t && !loading && stock && (
        <div className="max-w-4xl mx-auto px-4 py-8">

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h2 className="text-2xl font-bold text-primary dark:text-white">{t}</h2>
                {stock.exchange && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded font-medium">
                    {stock.exchange}
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {isUp ? '▲ Bullish' : '▼ Bearish'}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{stock.name}</p>
              {stock.sector && <p className="text-xs text-gray-400 mt-0.5">{stock.sector}{stock.industry ? ` · ${stock.industry}` : ''}</p>}
            </div>
            <div className="sm:text-right">
              <p className="text-3xl font-bold text-primary dark:text-white">{sym}{stock.price?.toFixed(2)}</p>
              <p className={`text-lg font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                {isUp ? '+' : ''}{stock.change?.toFixed(2)} ({isUp ? '+' : ''}{stock.changePct?.toFixed(2)}%)
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Today · {stock.currency}</p>
            </div>
          </div>

          {pos52 !== null && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>52W Low {sym}{stock.weekLow52?.toFixed(2)}</span>
                <span className={`font-bold ${pos52 > 60 ? 'text-green-600' : pos52 < 30 ? 'text-red-500' : 'text-yellow-600'}`}>
                  {pos52}% of 52-week range
                </span>
                <span>52W High {sym}{stock.weekHigh52?.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${pos52 > 60 ? 'bg-green-500' : pos52 < 30 ? 'bg-red-500' : 'bg-yellow-400'}`}
                  style={{ width: `${pos52}%` }} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Open',       value: `${sym}${stock.open?.toFixed(2)}` },
              { label: 'Day High',   value: `${sym}${stock.dayHigh?.toFixed(2)}` },
              { label: 'Day Low',    value: `${sym}${stock.dayLow?.toFixed(2)}` },
              { label: 'Prev Close', value: `${sym}${stock.prevClose?.toFixed(2)}` },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden mb-8">
            <TradingViewChart ticker={t} />
          </div>

          <AdSlot slot="2345678901" format="auto" />

          {stats.length > 0 && (
            <>
              <h3 className="text-lg font-bold text-primary dark:text-accent mb-3 mt-6">Key Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                {stats.map(s => <StatCard key={s.label} label={s.label} value={s.value} />)}
              </div>
            </>
          )}

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-xl p-6 mb-8 border border-blue-100 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🤖</span>
              <h3 className="text-lg font-bold text-primary dark:text-white">AI Summary</h3>
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-medium">Claude AI</span>
            </div>
            {aiLoading && (
              <div className="space-y-2"><Sk className="h-4 w-full" /><Sk className="h-4 w-11/12" /><Sk className="h-4 w-4/5" /></div>
            )}
            {!aiLoading && aiSummary && (
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{aiSummary}</p>
            )}
            {!aiLoading && !aiSummary && (
              <p className="text-gray-400 text-sm italic">AI summary unavailable.</p>
            )}
            <p className="text-xs text-gray-400 mt-4">For informational purposes only. Not financial advice.</p>
          </div>

          {news.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-primary dark:text-accent mb-3">Latest News</h3>
              <div className="space-y-3">
                {news.map((item, i) => (
                  <a key={item.uuid || i} href={item.link} target="_blank" rel="noopener noreferrer"
                    className="flex gap-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-secondary hover:shadow-sm transition group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 group-hover:text-secondary transition">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{item.publisher}</span>
                        {item.providerPublishTime && (
                          <><span>·</span>
                          <span>{new Date(item.providerPublishTime * 1000).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span></>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300 group-hover:text-secondary text-lg self-center">→</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <AdSlot slot="3456789012" format="auto" />

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Explore other stocks</h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR.filter(s => s.t !== t).map(s => (
                <button key={s.t} onClick={() => navigate(`/stocks/${s.t}`)}
                  className="text-sm bg-gray-100 dark:bg-gray-800 text-primary dark:text-white px-4 py-1.5 rounded-lg font-bold hover:bg-secondary hover:text-white transition">
                  {s.t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
