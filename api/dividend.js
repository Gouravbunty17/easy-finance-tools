const https = require("https");

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://finance.yahoo.com/",
        Origin: "https://finance.yahoo.com",
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJSON(res.headers.location).then(resolve).catch(reject);
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const trimmed = data.trim();
        if (trimmed.startsWith("<") || trimmed.includes("<!DOCTYPE")) {
          return reject(new Error("Dividend data provider returned HTML instead of JSON."));
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Invalid JSON from dividend data provider."));
        }
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Dividend request timed out after 10s."));
    });
    req.on("error", reject);
    req.end();
  });
}

function formatDate(unixSeconds) {
  if (!unixSeconds) return "N/A";
  try {
    return new Date(unixSeconds * 1000).toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function sumRange(items, startMs, endMs) {
  return items.reduce((total, item) => {
    const dateMs = item.timestamp * 1000;
    if (dateMs >= startMs && dateMs < endMs) return total + item.amount;
    return total;
  }, 0);
}

function inferFrequency(items) {
  if (items.length < 2) return "N/A";
  const sorted = [...items].sort((a, b) => a.timestamp - b.timestamp);
  const gaps = [];
  for (let index = 1; index < sorted.length; index += 1) {
    gaps.push((sorted[index].timestamp - sorted[index - 1].timestamp) / 86400);
  }
  const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  if (avgGap <= 10) return "Weekly";
  if (avgGap <= 20) return "Biweekly";
  if (avgGap <= 45) return "Monthly";
  if (avgGap <= 120) return "Quarterly";
  if (avgGap <= 220) return "Semi-annual";
  return "Annual";
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { ticker } = req.query;
  if (!ticker) {
    return res.status(400).json({ error: "Ticker required" });
  }

  const symbol = String(ticker).trim().toUpperCase();

  try {
    const quoteFields = [
      "shortName",
      "longName",
      "regularMarketPrice",
      "currency",
      "trailingAnnualDividendRate",
      "trailingAnnualDividendYield",
      "dividendYield",
      "payoutRatio",
      "exDividendDate",
      "dividendDate",
      "quoteType",
    ].join(",");

    const [quoteData, chartData] = await Promise.all([
      fetchJSON(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}&fields=${quoteFields}`),
      fetchJSON(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2y&events=div`),
    ]);

    const quote = quoteData?.quoteResponse?.result?.[0] || {};
    const chartResult = chartData?.chart?.result?.[0] || {};
    const dividendEvents = chartResult?.events?.dividends || {};

    const history = Object.values(dividendEvents)
      .map((item) => ({
        timestamp: item.date,
        amount: Number(item.amount || 0),
        exDate: formatDate(item.date),
      }))
      .filter((item) => item.timestamp && item.amount)
      .sort((a, b) => b.timestamp - a.timestamp);

    const nowMs = Date.now();
    const oneYearAgoMs = nowMs - 365 * 24 * 60 * 60 * 1000;
    const twoYearsAgoMs = nowMs - 730 * 24 * 60 * 60 * 1000;
    const annualDividendFromHistory = sumRange(history, oneYearAgoMs, nowMs);
    const priorAnnualDividend = sumRange(history, twoYearsAgoMs, oneYearAgoMs);
    const annualDividend = Number(quote.trailingAnnualDividendRate || annualDividendFromHistory || 0);
    const price = Number(quote.regularMarketPrice || 0);
    const payoutRatio = quote.payoutRatio ? Number(quote.payoutRatio) * 100 : null;

    let dividendYield = null;
    if (quote.trailingAnnualDividendYield) {
      dividendYield = Number(quote.trailingAnnualDividendYield) * 100;
    } else if (quote.dividendYield) {
      dividendYield = Number(quote.dividendYield) * 100;
    } else if (annualDividend && price) {
      dividendYield = (annualDividend / price) * 100;
    }

    const dividendGrowth = priorAnnualDividend
      ? ((annualDividendFromHistory - priorAnnualDividend) / priorAnnualDividend) * 100
      : null;

    return res.json({
      summary: {
        ticker: symbol,
        name: quote.longName || quote.shortName || symbol,
        quoteType: quote.quoteType || "",
        currency: quote.currency || "USD",
        dividendYield: dividendYield !== null ? `${dividendYield.toFixed(2)}%` : "N/A",
        annualDividend: annualDividend ? `${annualDividend.toFixed(2)} ${quote.currency || "USD"}` : "N/A",
        exDividendDate: formatDate(quote.exDividendDate || history[0]?.timestamp),
        payoutFrequency: inferFrequency(history.slice(0, 12)),
        payoutRatio: payoutRatio !== null ? `${payoutRatio.toFixed(2)}%` : "N/A",
        dividendGrowth: dividendGrowth !== null ? `${dividendGrowth >= 0 ? "+" : ""}${dividendGrowth.toFixed(2)}%` : "N/A",
        historyCount: history.length,
      },
      history: history.slice(0, 120).map((item) => ({
        exDate: item.exDate,
        cashAmount: item.amount.toFixed(4),
      })),
    });
  } catch (error) {
    res.status(500).json({
      error: "Could not load dividend data. " + error.message,
    });
  }
};
