import fs from "node:fs/promises";
import path from "node:path";
import { SITE_ROUTES, SITE_URL } from "./site-routes.mjs";

const PROJECT_ROOT = process.cwd();
const OUTPUT_PATH = path.join(PROJECT_ROOT, "public", "sitemap.xml");

function normalizeSiteUrl(route) {
  if (route === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${route}`;
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
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
