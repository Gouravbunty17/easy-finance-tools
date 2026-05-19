import React from "react";
import { canonicalizeSiteUrl } from "../config/site";

export default function BreadcrumbJsonLd({ items = [] }) {
  const normalizedItems = items.filter((item) => item?.name && item?.item);
  if (!normalizedItems.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: normalizedItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalizeSiteUrl(item.item),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
