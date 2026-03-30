const https = require('https');

function postJSON(url, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = JSON.stringify(body);
    const options = {
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('Invalid JSON from AI provider')); }
      });
    });

    req.setTimeout(15000, () => { req.destroy(); reject(new Error('AI request timed out')); });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Only POST is meaningful — but return 200 with error JSON (not 405)
  // so the browser doesn't treat it as a hard failure
  if (req.method !== 'POST') {
    return res.status(200).json({ error: 'POST required', summary: '' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(200).json({ error: 'AI summary not configured', summary: '' });

  // Parse body — Vercel auto-parses JSON, but guard against plain string body
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { ticker, name, price, change, marketCap, pe, sector } = body || {};
  if (!ticker) return res.status(200).json({ error: 'Ticker required', summary: '' });

  const displayName = name || ticker;
  const priceInfo = price
    ? `Current price: $${price}${change ? ` (${Number(change) >= 0 ? '+' : ''}${change}% today)` : ''}.`
    : '';
  const extraInfo = [
    marketCap && marketCap !== 'N/A' ? `Market cap: ${marketCap}` : '',
    pe && pe !== 'N/A' ? `P/E: ${pe}` : '',
    sector && sector !== 'N/A' ? `Sector: ${sector}` : '',
  ].filter(Boolean).join('. ');

  try {
    const data = await postJSON(
      'https://api.anthropic.com/v1/messages',
      {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      {
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 250,
        messages: [{
          role: 'user',
          content: `Write a 3-sentence plain-English overview of ${displayName} (${ticker}) for retail investors. ${priceInfo} ${extraInfo}
Cover: what the company does, its main business model, and one key thing investors typically watch.
Be factual and neutral. No "I" statements. No financial advice disclaimer.`,
        }],
      }
    );

    const summary = data?.content?.[0]?.text || '';
    return res.json({ summary });
  } catch (err) {
    return res.status(200).json({ error: err.message, summary: '' });
  }
}

// Config MUST be set on the exported function reference, not before it
module.exports = handler;
module.exports.config = { api: { bodyParser: { sizeLimit: '256kb' } } };
