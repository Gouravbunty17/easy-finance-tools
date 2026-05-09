import React from "react";
import { shouldNoindexPath } from "../config/qualityRoutes";

export default function SEO({
  title,
  description,
  canonical,
  type = "website",
  robots = "index,follow,max-image-preview:large",
  schema,
  image,
  imageAlt,
  imageWidth = "1200",
  imageHeight = "630",
}) {
  React.useEffect(() => {
    const siteName = "Easy Finance Tools";
    const siteOrigin = "https://easyfinancetools.com";
    const defaultTitle = "Free Canadian TFSA, RRSP & FHSA Calculators 2026 | EasyFinanceTools";
    const fullTitle = title || defaultTitle;
    const desc =
      description ||
      "Free 2026 Canadian finance calculators for TFSA, RRSP, FHSA, dividends, mortgage, and tax. Plain-English guides, no sign-up, built for Canadians.";
    const normalizedPath = window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/+$/, "");
    const url = canonical || `${siteOrigin}${normalizedPath}`;
    const robotsValue = shouldNoindexPath(normalizedPath)
      ? "noindex,follow,max-image-preview:large"
      : robots;
    const defaultImageUrl = "https://easyfinancetools.com/og-image.png";
    const requestedImageUrl = image || defaultImageUrl;
    const imageUrl = /\.(png|jpe?g)(\?.*)?$/i.test(requestedImageUrl)
      ? requestedImageUrl
      : defaultImageUrl;
    const imageType = imageUrl.endsWith(".webp")
      ? "image/webp"
      : imageUrl.endsWith(".png")
        ? "image/png"
          : imageUrl.endsWith(".jpg") || imageUrl.endsWith(".jpeg")
            ? "image/jpeg"
          : "image/png";
    const imageAltText =
      imageAlt ||
      "EasyFinanceTools - free Canadian TFSA, RRSP, FHSA and dividend calculators";

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
    setMeta("robots", robotsValue);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", desc, true);
    setMeta("og:url", url, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", siteName, true);
    setMeta("og:image", imageUrl, true);
    setMeta("og:image:type", imageType, true);
    setMeta("og:image:width", String(imageWidth), true);
    setMeta("og:image:height", String(imageHeight), true);
    setMeta("og:image:alt", imageAltText, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", imageUrl);
    setMeta("twitter:image:alt", imageAltText);

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
  }, [title, description, canonical, image, imageAlt, imageWidth, imageHeight, robots, schema, type]);

  return null;
}
