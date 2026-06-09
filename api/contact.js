const { Resend } = require("resend");

const CONTACT_TO = "gouravkumarpb08@gmail.com";
const DEFAULT_FROM = "Easy Finance Tools <onboarding@resend.dev>";
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;
const MIN_FORM_AGE_MS = 2500;

function json(res, status, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(body);
}

function parseBody(body) {
  if (typeof body !== "string") {
    return body && typeof body === "object" ? body : {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replaceAll("\u0000", "")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function plainTextEmail({ name, email, message, timestamp }) {
  return [
    "New Easy Finance Tools contact form submission",
    "",
    `Sender name: ${name}`,
    `Sender email: ${email}`,
    `Timestamp: ${timestamp}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

function htmlEmail({ name, email, message, timestamp }) {
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6; max-width: 640px;">
      <h1 style="font-size: 20px; margin-bottom: 16px;">New Easy Finance Tools contact form submission</h1>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <tr>
          <td style="font-weight: 700; padding: 8px 0; width: 140px;">Sender name</td>
          <td style="padding: 8px 0;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; padding: 8px 0;">Sender email</td>
          <td style="padding: 8px 0;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; padding: 8px 0;">Timestamp</td>
          <td style="padding: 8px 0;">${escapeHtml(timestamp)}</td>
        </tr>
      </table>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
        <p style="font-weight: 700; margin-bottom: 8px;">Message</p>
        <p style="white-space: normal; margin: 0;">${safeMessage}</p>
      </div>
    </div>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "POST required" });
  }

  const body = parseBody(req.body);
  const name = cleanText(body?.name, MAX_NAME_LENGTH);
  const email = cleanText(body?.email, MAX_EMAIL_LENGTH).toLowerCase();
  const message = cleanText(body?.message, MAX_MESSAGE_LENGTH);
  const honeypot = cleanText(body?.company, 200);
  const formStartedAt = Number(body?.formStartedAt || 0);

  if (honeypot) {
    return json(res, 200, { ok: true });
  }

  if (formStartedAt && Date.now() - formStartedAt < MIN_FORM_AGE_MS) {
    return json(res, 400, { ok: false, error: "Please wait a moment before sending your message." });
  }

  if (!name || !email || !message) {
    return json(res, 400, { ok: false, error: "Name, email, and message are required." });
  }

  if (!isValidEmail(email)) {
    return json(res, 400, { ok: false, error: "Please enter a valid email address." });
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return json(res, 400, { ok: false, error: "Message is too short." });
  }

  if (!process.env.RESEND_API_KEY) {
    return json(res, 500, { ok: false, error: "Contact email is not configured." });
  }

  const timestamp = new Date().toISOString();
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: "New Easy Finance Tools Contact Form Submission",
      text: plainTextEmail({ name, email, message, timestamp }),
      html: htmlEmail({ name, email, message, timestamp }),
    });

    if (error) {
      console.error("Resend contact form error", error);
      return json(res, 502, { ok: false, error: "We could not send your message right now. Please try again in a moment." });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error("Contact form send failed", error);
    return json(res, 500, { ok: false, error: "We could not send your message right now. Please try again in a moment." });
  }
};
