// Event telemetry is deliberately limited to navigation and generic UI milestones.
// Do not send typed income, balances, holdings, uploaded data, emails, search terms or
// URL queries/fragments into Google Analytics or GTM.
const ALLOWED_FIELDS = new Set([
  "cta_label", "destination", "destination_type", "section",
  "tool_name", "tool_category", "content_type", "article_slug",
  "entry_point", "action", "enabled", "offer_name", "page_title",
  "flow_step", "analysis_mode", "outcome", "method", "surface", "feature",
]);
function safeText(value) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v || v.length > 100 || /[@?#=&<>{}\r\n]/.test(v)) return null;
  return /^[\w .:/\u2013\u2014-]+$/.test(v) ? v : null;
}
export function safePagePath(path) {
  const candidate = String(path ?? "/").split(/[?#]/,1)[0].replace(/\/{2,}/g,"/").replace(/\/+$/,"") || "/";
  return /^\/[a-zA-Z0-9/_-]*$/.test(candidate) && candidate.length <= 180 ? candidate : "/";
}
export function safeDestination(value) {
  if (typeof value !== "string") return null;
  if (value.startsWith("/")) return safePagePath(value);
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    // Provider domains only. No referral IDs, account numbers, query strings or hashes.
    return /^[-a-z0-9.]+$/i.test(url.hostname) ? "external:" + url.hostname.toLowerCase() : null;
  } catch {
    return null;
  }
}
export function sanitizeEventParams(raw = {}) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const clean = {};
  for (const [key,value] of Object.entries(raw)) {
    if (!ALLOWED_FIELDS.has(key)) continue;
    if (key === "destination") {
      const dest = safeDestination(value);
      if (dest !== null) clean[key] = dest;
    } else if (key === "enabled" && typeof value === "boolean") {
      clean[key] = value;
    } else {
      const text = safeText(value);
      if (text !== null) clean[key] = text;
    }
  }
  return clean;
}
