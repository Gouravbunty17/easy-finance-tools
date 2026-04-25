import fs from "node:fs/promises";
import path from "node:path";
import { SITE_ROUTES, SITE_URL } from "./site-routes.mjs";

const PROJECT_ROOT = process.cwd();
const OUTPUT_PATH = path.join(PROJECT_ROOT, "public", "sitemap.xml");

function normalizeSiteUrl(route) {
  if (route === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${route}`;
}

const CHANGEFREQ_OVERRIDES = {
  "/": "weekly",
  "/tools": "weekly",
  "/blog": "weekly",
  "/about": "monthly",
  "/contact": "monthly",
  "/methodology": "monthly",
  "/editorial-standards": "monthly",
  "/privacy-policy": "yearly",
  "/terms": "yearly",
  "/tools/cad-usd-converter": "weekly",
};

const PRIORITY_OVERRIDES = {
  "/": "1.0",
  "/tools": "0.9",
  "/blog": "0.9",
  "/about": "0.5",
  "/contact": "0.4",
  "/methodology": "0.4",
  "/editorial-standards": "0.4",
  "/privacy-policy": "0.3",
  "/terms": "0.3",
  "/tools/tfsa-calculator": "0.9",
  "/tools/rrsp-calculator": "0.9",
  "/tools/fhsa-calculator": "0.9",
  "/tools/dividend-calculator": "0.9",
  "/tools/income-tax-calculator": "0.9",
  "/tools/mortgage-calculator": "0.9",
  "/tools/compound-interest-calculator": "0.8",
  "/tools/mortgage-affordability-calculator": "0.8",
  "/tools/rent-vs-buy": "0.8",
  "/tools/capital-gains-tax": "0.8",
  "/tools/cpp-oas-estimator": "0.8",
  "/tools/fire-calculator": "0.8",
  "/tools/gic-calculator": "0.8",
  "/tools/budget-tracker": "0.8",
  "/tools/investment-tracker": "0.8",
  "/tools/debt-payoff": "0.7",
  "/tools/savings-goal": "0.7",
  "/tools/net-pay-calculator": "0.7",
  "/tools/salary-to-hourly-calculator": "0.7",
  "/tools/gst-hst-calculator": "0.7",
  "/tools/cad-usd-converter": "0.7",
  "/tools/inflation-calculator": "0.7",
  "/tools/tip-calculator": "0.6",
  "/blog/tfsa-vs-rrsp-canada-2026": "0.85",
  "/blog/fhsa-calculator-canada-2026": "0.85",
  "/blog/how-to-start-investing-canada-2026": "0.85",
  "/blog/canadian-tax-brackets-2026": "0.85",
  "/blog/tfsa-vs-rrsp-2026": "0.8",
  "/blog/fhsa-vs-rrsp-down-payment-canada-2026": "0.8",
  "/blog/how-to-use-fhsa-canada": "0.8",
  "/blog/how-to-invest-in-canada-beginners-2026": "0.8",
  "/blog/how-much-tfsa-room-2026": "0.8",
  "/blog/best-etfs-for-tfsa-canada-2026": "0.8",
  "/blog/best-tfsa-brokers-canada": "0.8",
  "/blog/best-rrsp-accounts-canada": "0.8",
  "/blog/best-investing-apps-canada": "0.8",
  "/blog/wealthsimple-vs-questrade-canada": "0.8",
  "/blog/best-hisa-canada-2026": "0.8",
  "/blog/rrsp-deadline-2026": "0.8",
  "/blog/cpp-payment-dates-2026": "0.8",
  "/blog/oas-payment-dates-2026": "0.8",
  "/blog/canada-child-benefit-2026": "0.8",
  "/blog/best-dividend-investing-platforms-canada": "0.7",
  "/blog/best-gic-rates-canada-2026": "0.7",
  "/blog/500-month-dividend-canada": "0.7",
  "/blog/weekly-dividend-etfs": "0.7",
  "/blog/emergency-fund-canada": "0.7",
  "/blog/pay-off-mortgage-faster-canada": "0.7",
};

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function getChangefreq(entry) {
  return CHANGEFREQ_OVERRIDES[entry.route] || "monthly";
}

function getPriority(entry) {
  if (PRIORITY_OVERRIDES[entry.route]) {
    return PRIORITY_OVERRIDES[entry.route];
  }

  if (entry.group === "tools") return "0.7";
  if (entry.group === "blog") return "0.7";
  return "0.5";
}

async function getLastModified(sourcePath) {
  const absolutePath = path.join(PROJECT_ROOT, sourcePath);
  const stats = await fs.stat(absolutePath);
  return toIsoDate(stats.mtime);
}

async function buildSitemap() {
  const entries = await Promise.all(
    SITE_ROUTES.map(async (entry) => ({
      loc: normalizeSiteUrl(entry.route),
      lastmod: await getLastModified(entry.sourcePath),
      changefreq: getChangefreq(entry),
      priority: getPriority(entry),
    })),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (entry) => [
        "  <url>",
        `    <loc>${entry.loc}</loc>`,
        `    <lastmod>${entry.lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ].join("\n"),
    ),
    "</urlset>",
    "",
  ].join("\n");

  await fs.writeFile(OUTPUT_PATH, xml, "utf8");
  console.log(`Generated sitemap with ${entries.length} URLs at ${OUTPUT_PATH}`);
}

buildSitemap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
