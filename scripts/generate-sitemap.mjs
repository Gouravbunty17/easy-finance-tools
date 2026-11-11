import fs from "node:fs/promises";
import path from "node:path";
import { INDEXABLE_SITE_ROUTES, SITE_URL } from "./site-routes.mjs";

// Google uses lastmod only if it reflects substantive changes to individual pages.
// Build-system file mtimes change during deploys, so they are NOT content update dates.
// Emit only canonical indexable URLs until verified page-level modification dates exist.
export function generateSitemapXml(routes, siteOrigin = SITE_URL) {
  const urls = new Set();
  for (const entry of routes) {
    const route = entry?.route;
    if (typeof route !== "string" || !/^\/(?:[a-z0-9-]+\/?)*$/.test(route)) {
      throw new Error("Invalid sitemap route");
    }
    const clean = route === "/" ? "/" : route.replace(/\/+$/, "");
    urls.add(`${siteOrigin}${clean}`);
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...urls].map(url => `  <url>\n    <loc>${url}</loc>\n  </url>`),
    '</urlset>',
    '',
  ].join("\n");
}
if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const outputPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFile(outputPath, generateSitemapXml(INDEXABLE_SITE_ROUTES), "utf8")
    .then(() => console.log(`Generated sitemap with ${INDEXABLE_SITE_ROUTES.length} canonical URLs at ${outputPath}`))
    .catch(err => {console.error(err);process.exitCode=1;});
}
