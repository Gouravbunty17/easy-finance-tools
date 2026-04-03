const https = require("https");

function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const parsed = new URL(url);

    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
            return;
          }
          reject(new Error(`Email provider returned ${res.statusCode}: ${data.slice(0, 200)}`));
        });
      }
    );

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Contact request timed out"));
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST required" });
  }

  const serviceId = process.env.VITE_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return res.status(500).json({ error: "Contact email is not configured" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const message = String(body?.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: "Message is too short" });
  }

  try {
    await postJSON("https://api.emailjs.com/api/v1.0/email/send", {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        name,
        from_name: name,
        email,
        reply_to: email,
        message,
        website: "EasyFinanceTools",
      },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: "We could not send your message right now. Please try again in a moment.",
      detail: error.message,
    });
  }
};
