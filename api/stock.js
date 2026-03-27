export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'Ticker required' });

  const t = ticker.toUpperCase();
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
  };

  try {
    const [chartRes, summaryRes, newsRes] = await Promise.all([
      fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=1y`,
        { headers }
      ),
      fetch(
        `https://query1.finance.yahoo.com/v11/finance/quoteSummary/${t}?modules=price%2CsummaryDetail%2CdefaultKeyStatistics%2CassetProfile`,
        { headers }
      ),
      fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${t}&newsCount=5&quotesCount=0&enableFuzzyQuery=false`,
        { headers }
      ),
    ]);

    const chart = await chartRes.json();
    const summary = await summaryRes.json();
    const newsData = await newsRes.json();

    if (chart.chart?.error) {
      return res.status(404).json({ error: `Ticker "${t}" not found` });
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
