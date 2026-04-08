const quoteHandler = require("./quote");

const COMMODITIES = [
  { symbol: "GC=F", name: "Gold", market: "Commodity" },
  { symbol: "SI=F", name: "Silver", market: "Commodity" },
  { symbol: "CL=F", name: "WTI Oil", market: "Commodity" },
  { symbol: "BZ=F", name: "Brent Oil", market: "Commodity" },
  { symbol: "NG=F", name: "Natural Gas", market: "Commodity" },
];

const CURRENCIES = [
  { symbol: "CAD=X", name: "USD/CAD", market: "FX" },
  { symbol: "EURUSD=X", name: "EUR/USD", market: "FX" },
  { symbol: "GBPUSD=X", name: "GBP/USD", market: "FX" },
  { symbol: "JPY=X", name: "USD/JPY", market: "FX" },
  { symbol: "AUDUSD=X", name: "AUD/USD", market: "FX" },
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

function makeRateItem(base, quote) {
  if (!quote) return null;

  return {
    symbol: base.symbol,
    name: base.name,
    market: base.market,
    price: Number(quote.regularMarketPrice || 0),
    changePct: Number(quote.regularMarketChangePercent || 0),
    currency: quote.currency || "",
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const [commodities, currencies] = await Promise.all([
      Promise.all(
        COMMODITIES.map(async (item) => {
          const response = await fetchQuote(item.symbol);
          return makeRateItem(item, response.payload?.quote);
        })
      ),
      Promise.all(
        CURRENCIES.map(async (item) => {
          const response = await fetchQuote(item.symbol);
          return makeRateItem(item, response.payload?.quote);
        })
      ),
    ]);

    return res.status(200).json({
      commodities: commodities.filter(Boolean),
      currencies: currencies.filter(Boolean),
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      commodities: [],
      currencies: [],
    });
  }
};
