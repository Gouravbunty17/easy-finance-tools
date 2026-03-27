export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'Ticker required' });

  const t = ticker.toUpperCase();

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://finance.yahoo.com',
    'Referer': 'https://finance.yahoo.com/',
  };

  try {
    // Step 1: Get a session cookie from Yahoo Finance
    let cookie = '';
    try {
      const sessionRes = await fetch('https://finance.yahoo.com/quote/' + t, { headers });
      const setCookie = sessionRes.headers.get('set-cookie');
      if (setCookie) {
        cookie = setCookie.split(';')[0];
      }
    } catch {
      // continue without cookie
    }

    const fetchHeaders = cookie
      ? { ...headers, Cookie: cookie }
      : headers;

    // Step 2: Fetch price, stats, and news in parallel
    const [chartRes, summaryRes, newsRes] = await Promise.all([
      fetch(
        `https://query2.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=1y`,
        { headers: fetchHeaders }
      ),
      fetch(
        `https://query2.finance.yahoo.com/v11/finance/quoteSummary/${t}?modules=price%2CsummaryDetail%2CdefaultKeyStatistics%2CassetProfile`,
        { headers: fetchHeaders }
      ),
      fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${t}&newsCount=5&quotesCount=0&enableFuzzyQuery=false`,
        { headers: fetchHeaders }
      ),
    ]);

    const chart = await chartRes.json();
    const summary = await summaryRes.json();
    const newsData = await newsRes.json();

    if (chart.chart?.error || !chart.chart?.result) {
      return res.status(404).json({ error: `Ticker "${t}" not found. Try AAPL, SHOP, TD, RY.` });
    }

    res.json({
      chart,
      summary,
      news: newsData.news || [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock data: ' + err.message });
  }
}
