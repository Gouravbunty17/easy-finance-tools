const https = require("https");

const NEWS_QUERIES = [
  "stock market",
  "dow jones",
  "s&p 500",
  "nasdaq",
  "tsx composite",
  "market movers",
];

const STOCK_NEWS_KEYWORDS = [
  "stock market",
  "stocks",
  "shares",
  "dow",
  "dow jones",
  "s&p",
  "nasdaq",
  "tsx",
  "market",
  "wall street",
  "futures",
  "earnings",
  "investors",
  "equities",
  "etf",
];

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://finance.yahoo.com/",
        Origin: "https://finance.yahoo.com",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Invalid JSON from provider"));
        }
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
    req.on("error", reject);
    req.end();
  });
}

function dedupeNews(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.uuid || item?.link || item?.url || item?.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isStockMarketStory(item) {
  const haystack = [
    item?.title,
    item?.summary,
    item?.publisher,
    item?.link,
    item?.url,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return STOCK_NEWS_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const results = await Promise.all(
      NEWS_QUERIES.map((query) =>
        fetchJSON(
          `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&newsCount=6&quotesCount=3&enableFuzzyQuery=true`
        ).catch(() => ({ news: [] }))
      )
    );

    const items = dedupeNews(
      results.flatMap((result) => (Array.isArray(result.news) ? result.news : []))
    )
      .filter(isStockMarketStory)
      .sort((a, b) => (b.providerPublishTime || 0) - (a.providerPublishTime || 0))
      .slice(0, 6)
      .map((item) => ({
        title: item.title,
        publisher: item.publisher || item.source || "Finance news",
        link: item.link || item.url || "#",
        providerPublishTime: item.providerPublishTime || null,
        thumbnail: item.thumbnail?.resolutions?.[0]?.url || null,
      }));

    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ error: error.message, items: [] });
  }
};
