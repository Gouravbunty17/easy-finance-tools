export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI summary not configured' });

  const { ticker, name, price, change, marketCap, pe, sector } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `Write a 3-sentence plain-English summary for ${name} (${ticker}).
Price: $${price} (${Number(change) >= 0 ? '+' : ''}${change}% today). Market cap: ${marketCap}. P/E: ${pe}. Sector: ${sector}.
Cover: what the company does, what today's movement might signal, and one key metric investors watch.
Be factual and neutral. No "I" statements. No financial advice disclaimer.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const summary = data.content?.[0]?.text || '';
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
