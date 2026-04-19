import fs from "node:fs/promises";
import path from "node:path";
import { createServer } from "node:http";
import puppeteer from "puppeteer";

const DIST_DIR = path.resolve(process.cwd(), "dist");
const HOST = "127.0.0.1";
const PORT = Number(process.env.PRERENDER_PORT || 4173);
const BASE_URL = `http://${HOST}:${PORT}`;
const SITE_URL = "https://easyfinancetools.com";

// Start with the highest-intent routes. Add to this list as more pages need
// a fully baked first response for SEO.
const ROUTES = [
  "/",
  "/tools",
  "/blog",
  "/about",
  "/editorial-standards",
  "/methodology",
  "/tools/income-tax-calculator",
  "/tools/compound-interest-calculator",
  "/tools/tfsa-calculator",
  "/tools/rrsp-calculator",
  "/tools/dividend-calculator",
  "/tools/mortgage-calculator",
  "/blog/weekly-dividend-etfs",
  "/blog/tfsa-vs-rrsp-2026",
  "/blog/how-much-tfsa-room-2026",
  "/blog/best-etfs-for-tfsa-canada-2026",
  "/blog/how-to-use-fhsa-canada",
  "/blog/cpp-payment-dates-2026",
  "/blog/oas-payment-dates-2026",
  "/blog/canadian-tax-brackets-2026",
  "/blog/rrsp-deadline-2026",
  "/blog/best-gic-rates-canada-2026",
  "/blog/wealthsimple-vs-questrade-canada",
  "/blog/best-tfsa-brokers-canada",
  "/blog/best-rrsp-accounts-canada",
  "/blog/best-investing-apps-canada",
  "/blog/best-dividend-investing-platforms-canada",
  "/blog/how-to-invest-in-canada-beginners-2026",
  "/blog/best-hisa-canada-2026",
  "/blog/emergency-fund-canada",
  "/blog/pay-off-mortgage-faster-canada",
  "/blog/canada-child-benefit-2026",
];

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getContentType(filePath) {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function resolveFilePath(requestPath) {
  const normalizedPath = decodeURIComponent(requestPath.split("?")[0]);
  const candidatePath = path.resolve(DIST_DIR, `.${normalizedPath}`);

  if (!candidatePath.startsWith(DIST_DIR)) {
    return path.join(DIST_DIR, "index.html");
  }

  return candidatePath;
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readResponseFile(requestPath, fallbackBody) {
  const candidatePath = resolveFilePath(requestPath);

  if (await fileExists(candidatePath)) {
    const stats = await fs.stat(candidatePath);
    if (stats.isDirectory()) {
      const directoryIndex = path.join(candidatePath, "index.html");
      if (await fileExists(directoryIndex)) {
        return { filePath: directoryIndex, body: await fs.readFile(directoryIndex) };
      }
    } else {
      return { filePath: candidatePath, body: await fs.readFile(candidatePath) };
    }
  }

  const cleanRouteIndex = path.join(candidatePath, "index.html");
  if (await fileExists(cleanRouteIndex)) {
    return { filePath: cleanRouteIndex, body: await fs.readFile(cleanRouteIndex) };
  }

  const fallback = path.join(DIST_DIR, "index.html");
  return { filePath: fallback, body: fallbackBody };
}

async function startSpaServer() {
  const fallbackBody = await fs.readFile(path.join(DIST_DIR, "index.html"));
  const server = createServer(async (req, res) => {
    try {
      const requestPath = req.url || "/";
      const { filePath, body } = await readResponseFile(requestPath, fallbackBody);
      res.writeHead(200, { "Content-Type": getContentType(filePath) });
      res.end(body);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`Prerender server error: ${error.message}`);
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, HOST, resolve);
  });

  return server;
}

function routeToOutputPath(route) {
  if (route === "/") {
    return path.join(DIST_DIR, "index.html");
  }

  const segments = route.replace(/^\/+/, "").split("/");
  return path.join(DIST_DIR, ...segments, "index.html");
}

function normalizeCanonical(url) {
  return url.endsWith("/") && url !== `${BASE_URL}/` ? url.slice(0, -1) : url;
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 1200 });
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = request.url();
    const isSameOrigin = url.startsWith(BASE_URL);
    const isInline = url.startsWith("data:") || url.startsWith("blob:");

    if (isSameOrigin || isInline) {
      request.continue();
      return;
    }

    request.abort();
  });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("theme", "light");
  });

  const expectedCanonical = normalizeCanonical(`${SITE_URL}${route}`);
  const routeLabel = route === "/" ? "/" : route;

  await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#root", { timeout: 30000 });
  await page.waitForFunction(
    () => !document.querySelector('[aria-label="Loading page"]'),
    { timeout: 30000 }
  );
  await page.waitForFunction(() => document.title && document.title.trim().length > 0, {
    timeout: 30000,
  });
  await new Promise((resolve) => setTimeout(resolve, 250));

  const snapshot = await page.evaluate(() => {
    const description = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content")
      ?.trim();
    const canonical = document
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href")
      ?.trim();

    return {
      html: document.documentElement.outerHTML,
      title: document.title.trim(),
      description: description || "",
      canonical: canonical || "",
    };
  });

  await page.close();

  if (!snapshot.description) {
    throw new Error(`Missing meta description after prerendering ${routeLabel}`);
  }

  if (!snapshot.canonical) {
    throw new Error(`Missing canonical URL after prerendering ${routeLabel}`);
  }

  if (normalizeCanonical(snapshot.canonical) !== expectedCanonical) {
    throw new Error(
      `Canonical mismatch for ${routeLabel}: expected ${expectedCanonical}, received ${snapshot.canonical}`
    );
  }

  const outputPath = routeToOutputPath(route);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `<!DOCTYPE html>\n${snapshot.html}`, "utf8");

  console.log(`[prerender] ${routeLabel} -> ${path.relative(DIST_DIR, outputPath)}`);
  console.log(`             title: ${snapshot.title}`);
}

async function main() {
  const server = await startSpaServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      await prerenderRoute(browser, route);
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
