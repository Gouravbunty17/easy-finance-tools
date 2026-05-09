import React from "react";
import { SITE_ORIGIN, canonicalizeSiteUrl } from "../config/site";

export default function ToolPageSchema({ name, description, canonical, category }) {
  if (!name || !canonical) return null;
  const canonicalUrl = canonicalizeSiteUrl(canonical);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name,
        applicationCategory: category || "FinanceApplication",
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: `${SITE_ORIGIN}/tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name,
            item: canonicalUrl,
          },
        ],
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
