export const NOINDEX_ROUTES = new Set([
  "/tools/tip-calculator",
  "/tools/salary-to-hourly-calculator",
  "/tools/gst-hst-calculator",
  "/tools/cad-usd-converter",
  "/tools/inflation-calculator",
  "/tools/savings-goal",
  "/tools/net-pay-calculator",
  "/privacy-policy",
  "/blog/best-dividend-investing-platforms-canada",
  "/blog/best-investing-apps-canada",
  "/blog/best-rrsp-accounts-canada",
  "/blog/best-tfsa-brokers-canada",
  "/blog/wealthsimple-vs-questrade-canada",
  "/blog/best-gic-rates-canada-2026",
  "/blog/best-hisa-canada-2026",
  "/blog/best-etfs-for-tfsa-canada-2026",
]);

export function isNoindexRoute(route) {
  const normalizedRoute = route === "/" ? "/" : String(route || "").replace(/\/+$/, "");
  return NOINDEX_ROUTES.has(normalizedRoute);
}
