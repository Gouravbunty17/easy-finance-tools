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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI summary not configured' });

  const { ticker, name, price, change, marketCap, pe, sector } = req.body || {};
  if (!ticker) return res.status(400).json({ error: 'Ticker required' });

  try {
    const data = await postJSON(
      'https://api.anthropic.com/v1/messages',
      {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      {
        model: 'claude-haiku-4-5',
        max_tokens: 220,
        messages: [{
          role: 'user',
          content: `Write a 3-sentence plain-English analysis of ${name} (${ticker}).
Price: $${price} (${Number(change) >= 0 ? '+' : ''}${change}% today). Market cap: ${marketCap}. P/E: ${pe}. Sector: ${sector}.
Cover: what the company does, what today's price movement might signal, and one key metric investors watch.
Be factual and neutral. No "I" statements. No financial advice disclaimer.`,
        }],
      }
    );

    const summary = data?.content?.[0]?.text || '';
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
