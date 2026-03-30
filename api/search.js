const https = require('https');

function httpsGet(url, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com/',
        ...extraHeaders,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve({ body: JSON.parse(data), status: res.statusCode }); }
        catch { reject(new Error(`Non-JSON (${res.statusCode}): ${data.slice(0, 200)}`)); }
      });
    });
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const q = req.query?.q?.trim();
  if (!q) return res.status(400).json({ error: 'Query required', results: [] });

  try {
    // Yahoo Finance autocomplete — most reliable endpoint for search
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0&listsCount=0&enableFuzzyQuery=true&enableCb=true`;
    const { body } = await httpsGet(url);

    const results = (body?.quotes || [])
      .filter(r => r.symbol && r.quoteType !== 'OPTION' && r.quoteType !== 'FUTURE' && r.quoteType !== 'INDEX')
      .slice(0, 8)
      .map(r => ({
        symbol: r.symbol,
        name: r.shortname || r.longname || r.symbol,
        type: r.quoteType || 'EQUITY',
        exchange: r.exchDisp || r.exchange || '',
      }));

    return res.json({ results });
  } catch (err) {
    // If Yahoo Finance is down, return empty rather than crash
    return res.status(200).json({ results: [], error: err.message });
  }
};
