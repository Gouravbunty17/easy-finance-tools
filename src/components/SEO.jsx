import React from "react";

export default function SEO({
  title,
  description,
  canonical,
  type = "website",
  robots = "index,follow,max-image-preview:large",
  schema,
}) {
  React.useEffect(() => {
    const siteName = "Easy Finance Tools";
    const siteOrigin = "https://easyfinancetools.com";
    const fullTitle = title || "Canadian TFSA, RRSP & FHSA Calculators (Free)";
    const desc =
      description ||
      "Run TFSA, RRSP, FHSA and dividend calculations instantly. No signup. Built for Canadians.";
    const normalizedPath = window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/+$/, "");
    const url = canonical || `${siteOrigin}${normalizedPath}`;

    document.title = fullTitle;

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
    setMeta("author", "Gourav Kumar");
    setMeta("robots", robots);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", desc, true);
    setMeta("og:url", url, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", siteName, true);
    setMeta("og:image", "https://easyfinancetools.com/og-image.svg", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", "https://easyfinancetools.com/og-image.svg");

    let canonicalEl = document.querySelector("link[rel='canonical']");
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", url);

    document
      .querySelectorAll('script[data-seo-schema="true"]')
      .forEach((element) => element.remove());

    const schemaItems = Array.isArray(schema) ? schema : schema ? [schema] : [];
    schemaItems.forEach((item, index) => {
      const scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.dataset.seoSchema = "true";
      scriptEl.dataset.seoSchemaIndex = String(index);
      scriptEl.textContent = JSON.stringify(item);
      document.head.appendChild(scriptEl);
    });

    return () => {
      document
        .querySelectorAll('script[data-seo-schema="true"]')
        .forEach((element) => element.remove());
    };
  }, [title, description, canonical, robots, schema, type]);

  return null;
}
