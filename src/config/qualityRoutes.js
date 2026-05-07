export const NOINDEX_ROUTES = new Set([
  "/tools/tip-calculator",
  "/tools/salary-to-hourly-calculator",
  "/tools/gst-hst-calculator",
  "/tools/cad-usd-converter",
  "/tools/inflation-calculator",
  "/tools/savings-goal",
  "/tools/net-pay-calculator",
  "/privacy-policy",
  "/blog/tfsa-vs-rrsp-2026",
  "/blog/how-much-tfsa-room-2026",
  "/blog/rrsp-deadline-2026",
  "/blog/weekly-dividend-etfs",
  "/blog/best-dividend-investing-platforms-canada",
  "/blog/best-investing-apps-canada",
  "/blog/best-rrsp-accounts-canada",
  "/blog/best-tfsa-brokers-canada",
  "/blog/wealthsimple-vs-questrade-canada",
  "/blog/best-gic-rates-canada-2026",
  "/blog/best-hisa-canada-2026",
  "/blog/best-etfs-for-tfsa-canada-2026",
]);

export function shouldNoindexPath(pathname) {
  const normalizedPath = pathname === "/" ? "/" : String(pathname || "").replace(/\/+$/, "");
  return NOINDEX_ROUTES.has(normalizedPath);
}
