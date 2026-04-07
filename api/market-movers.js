const quoteHandler = require("./quote");

const SYMBOLS = [
  { symbol: "RY", name: "Royal Bank of Canada", market: "TSX/NYSE" },
  { symbol: "TD", name: "TD Bank", market: "TSX/NYSE" },
  { symbol: "BNS", name: "Scotiabank", market: "TSX/NYSE" },
  { symbol: "BMO", name: "Bank of Montreal", market: "TSX/NYSE" },
  { symbol: "CM", name: "CIBC", market: "TSX/NYSE" },
  { symbol: "ENB", name: "Enbridge", market: "TSX/NYSE" },
  { symbol: "AAPL", name: "Apple", market: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft", market: "NASDAQ" },
  { symbol: "NVDA", name: "Nvidia", market: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon", market: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet", market: "NASDAQ" },
  { symbol: "META", name: "Meta", market: "NASDAQ" },
  { symbol: "XEQT.TO", name: "iShares Core Equity ETF Portfolio", market: "TSX ETF" },
  { symbol: "VEQT.TO", name: "Vanguard All-Equity ETF Portfolio", market: "TSX ETF" },
  { symbol: "XGRO.TO", name: "iShares Core Growth ETF Portfolio", market: "TSX ETF" },
  { symbol: "VGRO.TO", name: "Vanguard Growth ETF Portfolio", market: "TSX ETF" },
];

function fetchQuote(symbol) {
  return new Promise((resolve) => {
    const req = { method: "GET", query: { symbol } };
    const res = {
      headers: {},
      setHeader(key, value) {
        this.headers[key] = value;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        resolve({ status: this.statusCode || 200, payload });
        return this;
      },
      end() {
        resolve({ status: this.statusCode || 200, payload: null });
      },
    };

    Promise.resolve(quoteHandler(req, res)).catch(() => resolve({ status: 500, payload: null }));
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const results = await Promise.all(
      SYMBOLS.map(async (item) => {
        const response = await fetchQuote(item.symbol);
        const quote = response.payload?.quote;
        if (!quote || !Number.isFinite(Number(quote.regularMarketPrice))) return null;

        return {
          symbol: item.symbol,
          name: item.name,
          market: item.market,
          price: Number(quote.regularMarketPrice || 0),
          changePct: Number(quote.regularMarketChangePercent || 0),
          volume: Number(quote.regularMarketVolume || 0),
        };
      })
    );

    const items = results.filter(Boolean);

    return res.status(200).json({
      gainers: [...items].sort((a, b) => b.changePct - a.changePct).slice(0, 5),
      losers: [...items].sort((a, b) => a.changePct - b.changePct).slice(0, 5),
      active: [...items].sort((a, b) => b.volume - a.volume).slice(0, 5),
      count: items.length,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      gainers: [],
      losers: [],
      active: [],
    });
  }
};
