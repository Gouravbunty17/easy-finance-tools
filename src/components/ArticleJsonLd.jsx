import React from "react";
import { SITE_ORIGIN, canonicalizeSiteUrl } from "../config/site";

export default function ArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "Gourav Kumar",
  imageUrl = `${SITE_ORIGIN}/og-image.png`,
  breadcrumbs,
  reviewer,
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
        ...(reviewer?.name && reviewer?.credential ? {
          reviewedBy: {
            "@type": "Person",
            name: reviewer.name,
            jobTitle: reviewer.credential,
          },
        } : {}),
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
