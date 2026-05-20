import React from "react";
import { SITE_ORIGIN, canonicalizeSiteUrl } from "../config/site";

export default function SoftwareApplicationJsonLd({
  name,
  description,
  canonical,
  category = "FinanceApplication",
  breadcrumbs,
  reviewer,
}) {
  if (!name || !canonical) return null;

  const canonicalUrl = canonicalizeSiteUrl(canonical);
  const defaultBreadcrumbs = [
    { name: "Home", item: `${SITE_ORIGIN}/` },
    { name: "Tools", item: `${SITE_ORIGIN}/tools` },
    { name, item: canonicalUrl },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name,
        applicationCategory: category,
        operatingSystem: "Web",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "CAD",
        },
        description,
        url: canonicalUrl,
        author: {
          "@type": "Person",
          name: "Gourav Kumar",
          url: `${SITE_ORIGIN}/about`,
        },
        publisher: {
          "@type": "Organization",
          name: "Easy Finance Tools",
          url: SITE_ORIGIN,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_ORIGIN}/logo.svg`,
          },
        },
        ...(reviewer?.name && reviewer?.credential ? {
          reviewedBy: {
            "@type": "Person",
            name: reviewer.name,
            jobTitle: reviewer.credential,
          },
        } : {}),
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
