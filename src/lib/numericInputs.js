export function parseNumericInput(value, { integer = false } = {}) {
  if (value === "") return "";
  if (!integer && typeof value === "string" && value.endsWith(".")) return value;

  const parsed = integer ? parseInt(value, 10) : Number(value);
  return Number.isFinite(parsed) ? parsed : "";
}

export function asNumber(value, fallback = 0) {
  if (value === "" || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
