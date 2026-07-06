import fs from "node:fs";
import path from "node:path";
import { SITE_ROUTES, SITE_URL } from "./site-routes.mjs";
import { isNoindexRoute } from "./quality-routes.mjs";

const PROJECT_ROOT = process.cwd();
const DIST_DIR = path.join(PROJECT_ROOT, "dist");
const SITEMAP_PATH = path.join(PROJECT_ROOT, "public", "sitemap.xml");
const REPORT_DIR = path.join(PROJECT_ROOT, "reports");
const REPORT_PATH = path.join(REPORT_DIR, "site-quality-audit.md");
const JSON_PATH = path.join(REPORT_DIR, "site-quality-audit.json");

const CANNIBALIZATION_SETS = [
  {
    topic: "TFSA contribution room",
    primary: "/blog/tfsa-contribution-room-calculator",
    support: ["/blog/tfsa-contribution-room-canada-2026", "/tools/tfsa-calculator"],
    risk: "Medium",
    note: "Calculator-intent and guide-intent pages are useful together, but titles and internal links should make the flagship calculator page the primary page for contribution-room calculator queries.",
  },
  {
    topic: "TFSA withdrawals and recontribution",
    primary: "/blog/tfsa-withdrawal-rules-canada-2026",
    support: ["/blog/tfsa-withdrawals-contribution-room-canada", "/blog/tfsa-contribution-room-calculator"],
    risk: "Medium",
    note: "The 2026 withdrawal guide should be treated as the main withdrawal-rule explainer; older withdrawal/contribution-room content should point clearly into it.",
  },
  {
    topic: "TFSA vs RRSP vs FHSA",
    primary: "/blog/tfsa-vs-rrsp-vs-fhsa-canada",
    support: ["/tools/account-decision-tool", "/blog/tfsa-vs-rrsp-canada-2026", "/topics/tfsa", "/topics/rrsp", "/topics/fhsa"],
    risk: "High",
    note: "This cluster has multiple comparison URLs. Keep the three-account comparison as the canonical decision page and use the account decision tool as the interactive next step.",
  },
  {
    topic: "Dividend ETFs and covered-call income",
    primary: "/blog/best-canadian-dividend-etfs-2026",
    support: ["/blog/covered-call-etfs-canada-explained", "/blog/covered-call-etf-taxes-canada", "/blog/covered-call-etfs-in-a-tfsa-canada", "/blog/covered-call-etfs-in-an-rrsp-canada", "/tools/dividend-calculator"],
    risk: "Medium",
    note: "Dividend and covered-call content is broad enough to support several pages, but each page should state its decision job clearly: ETF shortlist, tax mechanics, account location, or yield-risk education.",
  },
  {
    topic: "SpaceX / CDR investing accounts",
    primary: "/blog/how-to-buy-spacex-cdr-canada",
    support: ["/blog/how-to-buy-spacex-ipo-stock-in-canada", "/blog/what-are-cdrs-canada", "/blog/should-canadian-investors-chase-hot-ipos-spacex-case-study", "/blog/cdrs-in-a-tfsa-canada"],
    risk: "Medium",
    note: "The CDR purchase guide should own practical access intent; the IPO, CDR explainer, hot-IPO risk, and TFSA-account-location pages should support different angles.",
  },
  {
    topic: "AI API cost planning",
    primary: "/tools/ai-cost-calculator",
    support: ["/blog/ai-cost-calculator-estimate-api-spend", "/blog/ai-api-costs-tokens-agent-loops-rag-cad-budgeting"],
    risk: "Low",
    note: "The cluster is small and clean: one tool, one budgeting article, one mechanics article.",
  },
];

function normalizeRoute(route) {
  if (!route) return "";
  const withoutHash = String(route).split("#")[0].split("?")[0];
  if (!withoutHash || withoutHash === "/") return "/";
  return withoutHash.replace(/\/+$/, "");
}

function routeToHtmlPath(route) {
  if (route === "/") return path.join(DIST_DIR, "index.html");
  return path.join(DIST_DIR, ...route.replace(/^\/+/, "").split("/"), "index.html");
}

function expectedCanonical(route) {
  return route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
}

function extractFirst(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : "";
}

function stripTags(value) {
  return String(value || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractJsonLdTypes(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set();
  const invalid = [];

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
      invalid.push(error.message);
    }
  }

  return { types: [...types].sort(), invalid };
}

function extractInternalLinks(html) {
  const links = new Set();
  const matches = html.matchAll(/<a\b[^>]*\shref=["']([^"']+)["'][^>]*>/gi);

  for (const [, rawHref] of matches) {
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) continue;
    try {
      const url = rawHref.startsWith("http")
        ? new URL(rawHref)
        : new URL(rawHref, `${SITE_URL}/`);

      if (url.origin !== SITE_URL) continue;
      links.add(normalizeRoute(url.pathname));
    } catch {
      // Ignore malformed hrefs here; the technical audit catches critical HTML issues.
    }
  }

  return [...links].sort();
}

function clusterForRoute(route) {
  const value = route.toLowerCase();
  if (value.includes("tfsa")) return "TFSA";
  if (value.includes("rrsp")) return "RRSP";
  if (value.includes("fhsa") || value.includes("first-home")) return "FHSA";
  if (value.includes("dividend") || value.includes("drip") || value.includes("covered-call") || value.includes("yield")) return "Dividend";
  if (value.includes("mortgage") || value.includes("rent-vs-buy") || value.includes("home")) return "Mortgage";
  if (value.includes("retirement") || value.includes("cpp") || value.includes("oas") || value.includes("fire")) return "Retirement";
  if (value.includes("cdr") || value.includes("spacex") || value.includes("investing") || value.includes("etf") || value.includes("stock")) return "Investing accounts";
  if (value.includes("ai-cost") || value.includes("api-cost")) return "AI costs";
  if (["/about", "/founder-transparency", "/methodology", "/editorial-standards", "/corrections", "/disclaimer", "/privacy", "/terms", "/affiliate-disclosure", "/contact"].includes(route)) return "Trust/legal";
  if (value.startsWith("/tools/")) return "Tools";
  if (value.startsWith("/topics/")) return "Topic hubs";
  return "General";
}

function getSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) return new Set();
  const sitemap = fs.readFileSync(SITEMAP_PATH, "utf8");
  return new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
}

function auditRoute(entry, routeSet, sitemapUrls) {
  const htmlPath = routeToHtmlPath(entry.route);
  const exists = fs.existsSync(htmlPath);
  const indexable = !isNoindexRoute(entry.route);
  const audit = {
    route: entry.route,
    group: entry.group,
    sourcePath: entry.sourcePath,
    indexable,
    cluster: clusterForRoute(entry.route),
    exists,
    title: "",
    description: "",
    canonical: "",
    robots: "",
    h1Count: 0,
    wordCount: 0,
    schemaTypes: [],
    invalidJsonLd: [],
    internalLinks: [],
    inboundLinks: 0,
    critical: [],
    warnings: [],
    opportunities: [],
  };

  if (!exists) {
    audit.critical.push("Missing prerendered HTML.");
    return audit;
  }

  const html = fs.readFileSync(htmlPath, "utf8");
  audit.title = stripTags(extractFirst(html, /<title>([\s\S]*?)<\/title>/i));
  audit.description = extractFirst(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  audit.canonical = extractFirst(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  audit.robots = extractFirst(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  audit.h1Count = (html.match(/<h1\b/gi) || []).length;
  audit.wordCount = stripTags(html).split(/\s+/).filter(Boolean).length;
  audit.internalLinks = extractInternalLinks(html).filter((route) => routeSet.has(route));
  const schema = extractJsonLdTypes(html);
  audit.schemaTypes = schema.types;
  audit.invalidJsonLd = schema.invalid;

  if (!audit.title) audit.critical.push("Missing title.");
  if (!audit.description) audit.critical.push("Missing meta description.");
  if (!audit.canonical) audit.critical.push("Missing canonical.");
  if (audit.h1Count !== 1) audit.critical.push(`Expected exactly one H1, found ${audit.h1Count}.`);
  if (audit.invalidJsonLd.length) audit.critical.push("Invalid JSON-LD present.");
  if (indexable && audit.canonical !== expectedCanonical(entry.route)) audit.critical.push(`Canonical mismatch: ${audit.canonical || "missing"}.`);
  if (indexable && audit.robots.toLowerCase().includes("noindex")) audit.critical.push("Indexable route has noindex robots tag.");
  if (!indexable && !audit.robots.toLowerCase().includes("noindex")) audit.critical.push("Noindex route missing noindex robots tag.");
  if (indexable && !sitemapUrls.has(expectedCanonical(entry.route))) audit.critical.push("Indexable route missing from sitemap.");
  if (!indexable && sitemapUrls.has(expectedCanonical(entry.route))) audit.critical.push("Noindex route appears in sitemap.");

  if (entry.route.startsWith("/blog/") && indexable && entry.group === "blog") {
    if (!audit.schemaTypes.includes("Article")) audit.critical.push("Blog route missing Article schema.");
    if (!audit.schemaTypes.includes("BreadcrumbList")) audit.critical.push("Blog route missing BreadcrumbList schema.");
    if (html.includes("Frequently asked questions") && !audit.schemaTypes.includes("FAQPage")) audit.warnings.push("Visible FAQ section without FAQPage schema.");
    if (!audit.internalLinks.some((route) => route.startsWith("/tools/"))) audit.opportunities.push("Add a contextual calculator link above or near the related-content block.");
    if (!audit.internalLinks.some((route) => route.startsWith("/topics/"))) audit.opportunities.push("Add an upward link to the relevant topic hub.");
  }

  if (entry.route.startsWith("/tools/") && indexable) {
    if (!audit.schemaTypes.includes("WebApplication") && !audit.schemaTypes.includes("SoftwareApplication")) audit.critical.push("Tool route missing WebApplication/SoftwareApplication schema.");
    if (!audit.schemaTypes.includes("BreadcrumbList")) audit.critical.push("Tool route missing BreadcrumbList schema.");
    if (!audit.internalLinks.some((route) => route.startsWith("/blog/"))) audit.opportunities.push("Add two contextual guide links after the result area.");
    if (!audit.internalLinks.includes("/methodology")) audit.opportunities.push("Add a visible methodology link close to the calculator assumptions.");
  }

  if (indexable && audit.wordCount < 900 && (entry.route.startsWith("/blog/") || entry.route.startsWith("/topics/"))) {
    audit.warnings.push(`Low visible word count for indexable educational route: ${audit.wordCount}.`);
  }

  return audit;
}

function formatList(items) {
  if (!items.length) return "- None found.\n";
  return items.map((item) => `- ${item}`).join("\n") + "\n";
}

function formatTable(headers, rows) {
  const headerLine = `| ${headers.join(" |")} |`;
  const divider = `| ${headers.map(() => "---").join(" |")} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell).replace(/\|/g, "\\|")).join(" |")} |`);
  return [headerLine, divider, ...body].join("\n");
}

function topByCount(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const routeSet = new Set(SITE_ROUTES.map((entry) => normalizeRoute(entry.route)));
  const sitemapUrls = getSitemapUrls();
  const audits = SITE_ROUTES.map((entry) => auditRoute(entry, routeSet, sitemapUrls));

  const inbound = new Map(SITE_ROUTES.map((entry) => [entry.route, new Set()]));
  for (const audit of audits) {
    for (const link of audit.internalLinks) {
      if (link !== audit.route && inbound.has(link)) inbound.get(link).add(audit.route);
    }
  }

  for (const audit of audits) {
    audit.inboundLinks = inbound.get(audit.route)?.size || 0;
    if (audit.indexable && audit.route !== "/" && audit.inboundLinks === 0) {
      audit.warnings.push("No inbound internal links found in prerendered HTML.");
    }
  }

  const indexableAudits = audits.filter((audit) => audit.indexable);
  const noindexAudits = audits.filter((audit) => !audit.indexable);
  const critical = audits.filter((audit) => audit.critical.length);
  const warnings = audits.filter((audit) => audit.warnings.length);
  const opportunities = audits.filter((audit) => audit.opportunities.length);

  const clusters = new Map();
  for (const audit of indexableAudits) {
    clusters.set(audit.cluster, (clusters.get(audit.cluster) || 0) + 1);
  }

  const groupCounts = new Map();
  for (const audit of audits) {
    const key = `${audit.group}${audit.indexable ? " indexable" : " noindex"}`;
    groupCounts.set(key, (groupCounts.get(key) || 0) + 1);
  }

  const bundleFiles = fs.existsSync(path.join(DIST_DIR, "assets"))
    ? fs.readdirSync(path.join(DIST_DIR, "assets"))
      .map((file) => {
        const fullPath = path.join(DIST_DIR, "assets", file);
        const stat = fs.statSync(fullPath);
        return { file, sizeKb: Math.round((stat.size / 1024) * 10) / 10 };
      })
      .sort((a, b) => b.sizeKb - a.sizeKb)
      .slice(0, 8)
    : [];

  const report = [
    "# EasyFinanceTools Site Quality Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Executive Summary",
    "",
    `- Total registered routes audited: ${SITE_ROUTES.length}`,
    `- Indexable routes: ${indexableAudits.length}`,
    `- Noindex or legacy routes: ${noindexAudits.length}`,
    `- Critical technical issues: ${critical.length}`,
    `- Routes with advisory warnings: ${warnings.length}`,
    `- Routes with internal-linking opportunities: ${opportunities.length}`,
    "",
    "The site is now more than a calculator collection: the route map shows a real Canadian finance information architecture with topic hubs, decision guides, calculators, trust pages, and noindex handling for weaker utilities. The highest priority is to tighten internal linking and canonical intent around overlapping TFSA and account-comparison pages before adding more content.",
    "",
    "## Information Architecture Audit",
    "",
    formatTable(["Bucket", "Routes"], topByCount(groupCounts)),
    "",
    "### Indexable Topical Coverage",
    "",
    formatTable(["Cluster", "Indexable routes"], topByCount(clusters)),
    "",
    "## Internal Linking Report",
    "",
    "### Routes With Zero Inbound Internal Links",
    "",
    formatList(indexableAudits.filter((audit) => audit.route !== "/" && audit.inboundLinks === 0).map((audit) => `${audit.route} (${audit.cluster})`)),
    "",
    "### Calculator/Guide Linking Opportunities",
    "",
    formatList(opportunities.slice(0, 30).map((audit) => `${audit.route}: ${audit.opportunities.join(" ")}`)),
    "",
    "## Cannibalization Report",
    "",
    formatTable(
      ["Topic", "Primary URL", "Support URLs", "Risk", "Action"],
      CANNIBALIZATION_SETS.map((set) => [
        set.topic,
        set.primary,
        set.support.join("<br>"),
        set.risk,
        set.note,
      ])
    ),
    "",
    "## Technical SEO Report",
    "",
    "### Critical Findings",
    "",
    formatList(critical.flatMap((audit) => audit.critical.map((issue) => `${audit.route}: ${issue}`))),
    "",
    "### Advisory Warnings",
    "",
    formatList(warnings.slice(0, 40).flatMap((audit) => audit.warnings.map((issue) => `${audit.route}: ${issue}`))),
    "",
    "## Core Web Vitals / Performance Proxy Report",
    "",
    "This static audit does not replace Lighthouse field or lab testing. It checks the built asset footprint after prerender as a proxy for performance risk.",
    "",
    formatTable(["Largest built asset", "Size KB"], bundleFiles.map((asset) => [asset.file, asset.sizeKb])),
    "",
    "Recommended CWV follow-up: run mobile Lighthouse on `/`, `/tools`, `/tools/account-decision-tool`, `/tools/tfsa-calculator`, and the top Canadian Investing Accounts article after deployment. Focus on unused JS, image dimensions, lazy loading, and route-level chunking before changing content.",
    "",
    "## Schema Report",
    "",
    "- Homepage is expected to carry Organization, Person, and WebSite schema.",
    "- Tool pages are expected to carry WebApplication or SoftwareApplication schema plus BreadcrumbList.",
    "- Indexable blog pages are expected to carry Article and BreadcrumbList schema.",
    "- Pages with visible FAQ sections should carry FAQPage schema.",
    "",
    "Schema issues found in this run:",
    "",
    formatList(audits.flatMap((audit) => [...audit.critical, ...audit.warnings].filter((issue) => issue.includes("schema") || issue.includes("JSON-LD")).map((issue) => `${audit.route}: ${issue}`))),
    "",
    "## E-E-A-T / YMYL Trust Report",
    "",
    "- Footer exposes About, Founder Transparency, Methodology, Editorial Standards, Corrections, Disclaimer, Terms, Privacy, and Affiliate Disclosure.",
    "- Shared CanadianEducationArticle pages render contributor/review transparency, source verification, correction CTA, official-source lists, methodology notes, and educational disclaimers.",
    "- Shared calculator layout renders privacy/source notes, tool schema, result guidance, related links, and mobile calculate affordances.",
    "- Remaining trust weakness: pages that do not use the shared article or calculator shells can drift from the strongest trust pattern and should be audited before promotion.",
    "",
    "## Top 20 Quick Wins",
    "",
    [
      "Make `/blog/tfsa-vs-rrsp-vs-fhsa-canada` the clear primary account-comparison page in internal links.",
      "Use `/tools/account-decision-tool` as the interactive next step from every TFSA/RRSP/FHSA comparison page.",
      "Point older TFSA withdrawal content toward `/blog/tfsa-withdrawal-rules-canada-2026`.",
      "Point contribution-room support content toward `/blog/tfsa-contribution-room-calculator` for calculator-intent queries.",
      "Audit pages flagged with visible FAQs but no FAQPage schema.",
      "Add topic-hub links to any indexable blog pages flagged by the audit.",
      "Add calculator links to any indexable blog pages flagged by the audit.",
      "Keep weak utilities noindexed unless they receive decision-support depth.",
      "Run mobile Lighthouse on the five highest-traffic templates before new content work.",
      "Check image width/height and lazy-loading behavior on article hero images.",
      "Review the largest built JS chunks before adding dependencies.",
      "Keep external source labels exact and remove broken references instead of shipping dead citations.",
      "Use the trust pages as reviewer-facing proof: About, Methodology, Editorial Standards, Corrections, Disclaimer.",
      "Keep affiliate wording after educational context, not before result interpretation.",
      "Monitor Search Console queries for TFSA withdrawal cannibalization.",
      "Monitor Search Console queries for TFSA vs RRSP vs FHSA overlap.",
      "Submit only live 200 URLs for indexing.",
      "Do not add another investing-account article until the current cluster shows impressions and indexing clarity.",
      "Use the audit script before every large route/content push.",
      "Document any page intentionally kept noindex so future work does not accidentally re-promote it.",
    ].map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "## Long-Term Recommendations",
    "",
    "- Keep the site clustered around decision paths: accounts, dividends/income, mortgages, retirement, AI business costs, and trust/legal.",
    "- Improve existing high-intent pages before expanding into new topics.",
    "- Treat Search Console query overlap as the source of truth for cannibalization decisions.",
    "- Add field CWV monitoring before making broad UI or dependency changes.",
    "- Consider turning this audit into a CI advisory gate once the warning set is intentionally cleaned up.",
    "",
  ].join("\n");

  const json = {
    generatedAt: new Date().toISOString(),
    routeCount: SITE_ROUTES.length,
    indexableRouteCount: indexableAudits.length,
    noindexRouteCount: noindexAudits.length,
    criticalCount: critical.length,
    warningRouteCount: warnings.length,
    opportunityRouteCount: opportunities.length,
    clusters: Object.fromEntries(topByCount(clusters)),
    routes: audits,
    cannibalizationSets: CANNIBALIZATION_SETS,
    largestAssets: bundleFiles,
  };

  fs.writeFileSync(REPORT_PATH, report);
  fs.writeFileSync(JSON_PATH, `${JSON.stringify(json, null, 2)}\n`);

  console.log(`Site quality audit complete.`);
  console.log(`- Routes audited: ${SITE_ROUTES.length}`);
  console.log(`- Indexable routes: ${indexableAudits.length}`);
  console.log(`- Critical issue routes: ${critical.length}`);
  console.log(`- Warning routes: ${warnings.length}`);
  console.log(`- Opportunity routes: ${opportunities.length}`);
  console.log(`- Report: ${path.relative(PROJECT_ROOT, REPORT_PATH)}`);
  console.log(`- JSON: ${path.relative(PROJECT_ROOT, JSON_PATH)}`);
}

main();
