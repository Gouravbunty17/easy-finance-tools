import React from "react";
import { SITE_ORIGIN, canonicalizeSiteUrl } from "../config/site";

/**
 * ArticleSchema — injects Article JSON-LD structured data.
 *
 * Used on blog posts and guides. Signals publication date, authorship,
 * and content type to Google, Bing, and AI answer engines. Trust signals
 * (author, datePublished, publisher) help AI tools cite the page properly.
 *
 * Props:
 *   headline        — article title (string)
 *   description     — short description / meta description (string)
 *   url             — canonical URL (string)
 *   datePublished   — ISO date string, e.g. "2026-03-29" (string)
 *   dateModified    — ISO date string (string, defaults to datePublished)
 *   authorName      - author display name (string, defaults to "Gourav Kumar")
 *   imageUrl        — og-image URL (string)
 */
export default function ArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "Gourav Kumar",
  imageUrl = "https://easyfinancetools.com/og-image.png",
  breadcrumbs,
}) {
  if (!headline || !url) return null;
  const canonicalUrl = canonicalizeSiteUrl(url);
  const normalizedImageUrl = canonicalizeSiteUrl(imageUrl);
  const schemaImageUrl = /\.(png|jpe?g)(\?.*)?$/i.test(normalizedImageUrl)
    ? normalizedImageUrl
    : `${SITE_ORIGIN}/og-image.png`;

  const defaultBreadcrumbs = [
    { name: "Home", item: `${SITE_ORIGIN}/` },
    { name: "Blog", item: `${SITE_ORIGIN}/blog` },
    { name: headline, item: canonicalUrl },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline,
        description,
        url: canonicalUrl,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
          "@type": "Person",
          name: authorName,
          url: `${SITE_ORIGIN}/about`,
        },
        publisher: {
          "@type": "Organization",
          name: "Easy Finance Tools",
          url: SITE_ORIGIN,
          logo: {
            "@type": "ImageObject",
            url: schemaImageUrl,
          },
        },
        image: {
          "@type": "ImageObject",
          url: schemaImageUrl,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: (breadcrumbs || defaultBreadcrumbs).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: canonicalizeSiteUrl(item.item),
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
