export function parseNumericInput(value, { integer = false, allowNegative = false } = {}) {
  if (value === "" || value === null || value === undefined) return "";

  let next = String(value)
    .replace(/[^\d.-]/g, "")
    .replace(allowNegative ? /(?!^)-/g : /-/g, "");

  if (next === "" || next === "-") return next;

  if (integer) {
    next = next.split(".")[0];
  } else {
    const [wholePart, ...decimalParts] = next.split(".");
    next = decimalParts.length ? `${wholePart}.${decimalParts.join("")}` : wholePart;
  }

  const sign = next.startsWith("-") ? "-" : "";
  const body = sign ? next.slice(1) : next;
  const hasDecimal = !integer && body.includes(".");
  const trailingDecimal = !integer && body.endsWith(".");
  const [rawWhole, rawDecimal = ""] = body.split(".");
  let whole = rawWhole.replace(/^0+(?=\d)/, "");

  if (whole === "" && hasDecimal) whole = "0";
  if (whole === "" && rawWhole.length > 0) whole = "0";

  return `${sign}${whole}${hasDecimal ? `.${rawDecimal}` : trailingDecimal ? "." : ""}`;
}

export function parseMoneyInput(value, options = {}) {
  return parseNumericInput(value, options);
}

export function asNumber(value, fallback = 0) {
  if (value === "" || value === null || value === undefined || value === "." || value === "-" || value === "-.") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
