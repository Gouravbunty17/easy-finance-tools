const ALLOWED_SERIES = new Set(["FXUSDCAD", "STATIC_INFLATIONCALC"]);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const series = String(req.query.series || "").trim().toUpperCase();
  const recent = req.query.recent ? String(req.query.recent).trim() : "";

  if (!ALLOWED_SERIES.has(series)) {
    return res.status(400).json({ error: "Unsupported Bank of Canada series" });
  }

  const url = new URL(`https://www.bankofcanada.ca/valet/observations/${series}/json`);
  if (recent) url.searchParams.set("recent", recent);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "EasyFinanceTools/1.0",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Bank of Canada request failed with ${response.status}` });
    }

    const payload = await response.json();
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(502).json({ error: "Bank of Canada data temporarily unavailable" });
  }
};
