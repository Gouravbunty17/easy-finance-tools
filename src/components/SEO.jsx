import React from "react";

// Per-page SEO meta tags injected into <head>
// Since this is Vite/React (not Next.js), we manually set document metadata
export default function SEO({ title, description, canonical, type = "website" }) {
  React.useEffect(() => {
    const siteName = "EasyFinanceTools";
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Free TFSA, RRSP & Dividend Calculators for Canadians`;
    const desc = description || "Free Canadian financial calculators for TFSA, RRSP, dividends and budgeting. No sign-up required. Privacy-first. Updated for 2026.";
    const url = canonical || window.location.href;

    // Title
    document.title = fullTitle;

    // Set or create meta tag helper
    const setMeta = (name, content, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", desc);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", desc, true);
    setMeta("og:url", url, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", siteName, true);
    setMeta("og:image", "https://easyfinancetools.com/og-image.png", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);

    // Canonical
    let canonicalEl = document.querySelector("link[rel='canonical']");
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", url);
  }, [title, description, canonical]);

  return null;
}
