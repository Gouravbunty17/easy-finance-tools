const https = require('https');

// Use Node.js built-in https — no fetch dependency, works on all Node versions
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com/',
        'Origin': 'https://finance.yahoo.com',
      },
    };

    const req = https.request(options, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJSON(res.headers.location).then(resolve).catch(reject);
      }

      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const trimmed = data.trim();
        if (trimmed.startsWith('<') || trimmed.includes('<!DOCTYPE')) {
          return reject(new Error('Data provider returned a non-JSON page. Yahoo Finance may be temporarily blocking requests.'));
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Invalid JSON from data provider.'));
        }
      });
    });

    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Request timed out after 10s.')); });
    req.on('error', reject);
    req.end();
  });
}

function fmtNum(n) {
  if (!n && n !== 0) return 'N/A';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6)  return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3)  return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(2);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'Ticker required' });

  const t = ticker.toUpperCase().trim();

  try {
    // Yahoo Finance v7 — returns all key stats in one request
    const fields = [
      'shortName','longName','regularMarketPrice','regularMarketChange',
      'regularMarketChangePercent','regularMarketPreviousClose',
      'regularMarketVolume','regularMarketOpen','regularMarketDayHigh',
      'regularMarketDayLow','fiftyTwoWeekHigh','fiftyTwoWeekLow',
      'marketCap','trailingPE','forwardPE','epsTrailingTwelveMonths',
      'dividendYield','trailingAnnualDividendYield','averageDailyVolume3Month',
      'beta','currency','fullExchangeName','sector','industry','website',
      'longBusinessSummary',
    ].join(',');

    const quoteData = await fetchJSON(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${t}&fields=${fields}`
    );

    const q = quoteData?.quoteResponse?.result?.[0];
    if (!q || q.regularMarketPrice === undefined) {
      return res.status(404).json({
        error: `Ticker "${t}" not found. Try AAPL, MSFT, NVDA, SHOP, TD, RY, BNS, ENB.`,
      });
    }

    // Fetch news separately — non-critical, fail silently
    let news = [];
    try {
      const newsData = await fetchJSON(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${t}&newsCount=5&quotesCount=0&enableFuzzyQuery=false`
      );
      news = newsData.news || [];
    } catch { /* news is optional */ }

    // Normalise into clean shape for the frontend
    const stock = {
      ticker:       t,
      name:         q.longName || q.shortName || t,
      price:        q.regularMarketPrice,
      change:       q.regularMarketChange,
      changePct:    q.regularMarketChangePercent,
      prevClose:    q.regularMarketPreviousClose,
      open:         q.regularMarketOpen,
      dayHigh:      q.regularMarketDayHigh,
      dayLow:       q.regularMarketDayLow,
      volume:       fmtNum(q.regularMarketVolume),
      avgVolume:    fmtNum(q.averageDailyVolume3Month),
      weekHigh52:   q.fiftyTwoWeekHigh,
      weekLow52:    q.fiftyTwoWeekLow,
      marketCap:    fmtNum(q.marketCap),
      trailingPE:   q.trailingPE?.toFixed(2) || 'N/A',
      forwardPE:    q.forwardPE?.toFixed(2)  || 'N/A',
      eps:          q.epsTrailingTwelveMonths?.toFixed(2) || 'N/A',
      dividendYield: q.trailingAnnualDividendYield
        ? (q.trailingAnnualDividendYield * 100).toFixed(2) + '%'
        : (q.dividendYield ? (q.dividendYield * 100).toFixed(2) + '%' : 'N/A'),
      beta:         q.beta?.toFixed(2) || 'N/A',
      currency:     q.currency || 'USD',
      exchange:     q.fullExchangeName || '',
      sector:       q.sector || '',
      industry:     q.industry || '',
    };

    res.json({ stock, news });
  } catch (err) {
    res.status(500).json({
      error: 'Could not load stock data. ' + err.message,
    });
  }
};
