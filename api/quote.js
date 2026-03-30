const https = require('https');

// In-memory session cache (reused within same serverless function instance)
let _session = { crumb: '', cookie: '', ts: 0 };

function httpsRequest(method, url, extraHeaders = {}, body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://finance.yahoo.com',
        'Referer': 'https://finance.yahoo.com/',
        ...extraHeaders,
      },
    };
    if (body) {
      const buf = Buffer.from(body, 'utf8');
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = buf.length;
    }

    const req = https.request(options, (res) => {
      let data = '';
      const rawCookies = (res.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve({ body: JSON.parse(data), cookies: rawCookies, status: res.statusCode }); }
        catch { reject(new Error(`Non-JSON (${res.statusCode}): ${data.slice(0, 200)}`)); }
      });
    });

    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getSession() {
  if (_session.crumb && Date.now() - _session.ts < 8 * 60 * 1000) return _session;

  try {
    const res = await httpsRequest('POST', 'https://query2.finance.yahoo.com/v1/test/csrfToken', {}, 'agree=agree');
    if (res.body?.crumb) {
      _session = { crumb: res.body.crumb, cookie: res.cookies, ts: Date.now() };
      return _session;
    }
  } catch { /* fall through */ }

  try {
    // Fallback: get crumb via GET (some regions)
    const res = await httpsRequest('GET', 'https://query1.finance.yahoo.com/v1/test/csrfToken');
    if (res.body?.crumb) {
      _session = { crumb: res.body.crumb, cookie: res.cookies, ts: Date.now() };
      return _session;
    }
  } catch { /* give up */ }

  return { crumb: '', cookie: '', ts: Date.now() };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const symbol = req.query?.symbol;
  if (!symbol) return res.status(400).json({ error: 'Symbol required' });

  const sym = symbol.toUpperCase();

  try {
    const session = await getSession();
    const cookieHeader = session.cookie ? { Cookie: session.cookie } : {};

    // ── Primary: v8 chart API (most reliable, no crumb needed) ──
    try {
      const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d&includePrePost=false`;
      const { body } = await httpsRequest('GET', chartUrl, cookieHeader);
      const meta = body?.chart?.result?.[0]?.meta;

      if (meta?.regularMarketPrice) {
        const prev = meta.previousClose || meta.chartPreviousClose || meta.regularMarketPrice;
        const change = meta.regularMarketPrice - prev;
        const changePct = prev ? (change / prev) * 100 : 0;

        return res.json({
          quote: {
            symbol: meta.symbol || sym,
            shortName: meta.shortName || meta.symbol || sym,
            longName: meta.longName || meta.shortName || sym,
            regularMarketPrice: meta.regularMarketPrice,
            regularMarketPreviousClose: prev,
            regularMarketChange: change,
            regularMarketChangePercent: changePct,
            regularMarketVolume: meta.regularMarketVolume || 0,
            regularMarketDayHigh: meta.regularMarketDayHigh || 0,
            regularMarketDayLow: meta.regularMarketDayLow || 0,
            fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
            fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0,
            currency: meta.currency || 'USD',
            exchange: meta.exchangeName || '',
            fullExchangeName: meta.exchangeName || '',
            quoteType: meta.instrumentType === 'CRYPTOCURRENCY' ? 'CRYPTOCURRENCY' : 'EQUITY',
          },
        });
      }
    } catch { /* fall through */ }

    // ── Fallback: v7 quote API with crumb ──
    const crumbParam = session.crumb ? `&crumb=${encodeURIComponent(session.crumb)}` : '';
    const v7url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(sym)}${crumbParam}`;
    const { body: v7body } = await httpsRequest('GET', v7url, cookieHeader);
    const quote = v7body?.quoteResponse?.result?.[0];
    if (quote?.regularMarketPrice) return res.json({ quote });

    return res.status(404).json({ error: `Symbol "${sym}" not found` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
