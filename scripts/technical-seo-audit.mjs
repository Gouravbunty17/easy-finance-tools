import fs from "node:fs";
import path from "node:path";
import { INDEXABLE_SITE_ROUTES, SITE_ROUTES } from "./site-routes.mjs";
import { isNoindexRoute } from "./quality-routes.mjs";

const PROJECT_ROOT = process.cwd();
const DIST_DIR = path.join(PROJECT_ROOT, "dist");
const SITEMAP_PATH = path.join(PROJECT_ROOT, "public", "sitemap.xml");
const VERCEL_CONFIG_PATH = path.join(PROJECT_ROOT, "vercel.json");
const SITE_ORIGIN = "https://easyfinancetools.com";

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function routeToHtmlPath(route) {
  if (route === "/") return path.join(DIST_DIR, "index.html");
  return path.join(DIST_DIR, ...route.replace(/^\/+/, "").split("/"), "index.html");
}

function expectedCanonical(route) {
  return route === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;
}

function extractFirst(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : "";
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractJsonLdTypes(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set();

  function collectTypes(node) {
    if (!node || typeof node !== "object") return;
    if (node["@type"]) {
      if (Array.isArray(node["@type"])) node["@type"].forEach((type) => types.add(type));
      else types.add(node["@type"]);
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(collectTypes);
      else if (value && typeof value === "object") collectTypes(value);
    }
  }

  for (const [, body] of scripts) {
    try {
      collectTypes(JSON.parse(body));
    } catch (error) {
      fail(`Invalid JSON-LD script: ${error.message}`);
    }
  }

  return types;
}

function assertHeader(vercelConfig, key) {
  const header = vercelConfig.headers
    ?.flatMap((entry) => entry.headers || [])
    ?.find((item) => item.key.toLowerCase() === key.toLowerCase());
  if (!header) fail(`Missing security header: ${key}`);
  return header?.value || "";
}

function validateSecurityHeaders() {
  const vercelConfig = JSON.parse(fs.readFileSync(VERCEL_CONFIG_PATH, "utf8"));
  const csp = assertHeader(vercelConfig, "Content-Security-Policy");
  assertHeader(vercelConfig, "Strict-Transport-Security");
  assertHeader(vercelConfig, "X-Frame-Options");
  assertHeader(vercelConfig, "X-Content-Type-Options");
  assertHeader(vercelConfig, "Referrer-Policy");
  assertHeader(vercelConfig, "Permissions-Policy");

  for (const directive of ["default-src", "script-src", "style-src", "img-src", "connect-src", "frame-src", "frame-ancestors"]) {
    if (!csp.includes(directive)) fail(`CSP missing directive: ${directive}`);
  }

  for (const allowedHost of ["googletagmanager.com", "google-analytics.com", "googlesyndication.com", "googleadservices.com"]) {
    if (!csp.includes(allowedHost)) warn(`CSP may block future analytics/AdSense host: ${allowedHost}`);
  }
}

function validateSitemap() {
  const sitemap = fs.readFileSync(SITEMAP_PATH, "utf8");
  const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));

  for (const entry of INDEXABLE_SITE_ROUTES) {
    const url = expectedCanonical(entry.route);
    if (!sitemapUrls.has(url)) fail(`Indexable route missing from sitemap: ${entry.route}`);
  }

  for (const entry of SITE_ROUTES) {
    if (isNoindexRoute(entry.route) && sitemapUrls.has(expectedCanonical(entry.route))) {
      fail(`Noindex route appears in sitemap: ${entry.route}`);
    }
  }
}

function validatePrerenderedPages() {
  const seenTitles = new Map();
  const seenDescriptions = new Map();

  for (const entry of SITE_ROUTES) {
    const htmlPath = routeToHtmlPath(entry.route);
    if (!fs.existsSync(htmlPath)) {
      fail(`Missing prerendered HTML for route: ${entry.route}`);
      continue;
    }

    const html = fs.readFileSync(htmlPath, "utf8");
    const title = stripTags(extractFirst(html, /<title>([\s\S]*?)<\/title>/i));
    const description = extractFirst(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const canonical = extractFirst(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    const robots = extractFirst(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    const schemaTypes = extractJsonLdTypes(html);
    const indexable = !isNoindexRoute(entry.route);

    if (!title) fail(`Missing title: ${entry.route}`);
    if (!description) fail(`Missing meta description: ${entry.route}`);
    if (!canonical) fail(`Missing canonical: ${entry.route}`);
    if (indexable && canonical !== expectedCanonical(entry.route)) {
      fail(`Canonical mismatch for ${entry.route}: ${canonical}`);
    }
    if (indexable && robots.toLowerCase().includes("noindex")) {
      fail(`Indexable route has noindex robots tag: ${entry.route}`);
    }
    if (!indexable && !robots.toLowerCase().includes("noindex")) {
      fail(`Noindex route missing noindex robots tag: ${entry.route}`);
    }
    if (h1Count !== 1) fail(`Expected exactly one H1 on ${entry.route}, found ${h1Count}`);

    if (entry.route === "/") {
      for (const type of ["Organization", "Person", "WebSite"]) {
        if (!schemaTypes.has(type)) fail(`Homepage missing ${type} schema`);
      }
    }

    if (entry.route.startsWith("/tools/") && !entry.route.includes("portfolio-analyzer")) {
      if (!schemaTypes.has("WebApplication") && !schemaTypes.has("SoftwareApplication")) {
        fail(`Tool route missing WebApplication/SoftwareApplication schema: ${entry.route}`);
      }
      if (!schemaTypes.has("BreadcrumbList")) {
        fail(`Tool route missing BreadcrumbList schema: ${entry.route}`);
      }
    }

    if (entry.route.startsWith("/blog/") && indexable && entry.group === "blog") {
      if (!schemaTypes.has("Article")) fail(`Blog route missing Article schema: ${entry.route}`);
      if (!schemaTypes.has("BreadcrumbList")) fail(`Blog route missing BreadcrumbList schema: ${entry.route}`);
    }

    if (indexable) {
      const previousTitle = seenTitles.get(title);
      if (previousTitle) fail(`Duplicate title on indexable routes: ${previousTitle} and ${entry.route}`);
      else seenTitles.set(title, entry.route);

      const previousDescription = seenDescriptions.get(description);
      if (previousDescription) fail(`Duplicate meta description on indexable routes: ${previousDescription} and ${entry.route}`);
      else seenDescriptions.set(description, entry.route);
    }
  }
}

validateSecurityHeaders();
validateSitemap();
validatePrerenderedPages();

if (warnings.length) {
  console.warn("Technical SEO audit warnings:");
  warnings.forEach((message) => console.warn(`- ${message}`));
}

if (failures.length) {
  console.error("Technical SEO audit failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Technical SEO audit passed.");
