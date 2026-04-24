import React from "react";

export default function ToolPageSchema({ name, description, canonical, category }) {
  if (!name || !canonical) return null;

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
        url: canonical,
        author: {
          "@type": "Person",
          name: "Gourav Kumar",
          url: "https://easyfinancetools.com/about",
        },
        publisher: {
          "@type": "Organization",
          name: "Easy Finance Tools",
          url: "https://easyfinancetools.com",
          logo: {
            "@type": "ImageObject",
            url: "https://easyfinancetools.com/logo.svg",
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
            item: "https://easyfinancetools.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: "https://easyfinancetools.com/tools",
          },
          {
            "@type": "ListItem",
            position: 3,
            name,
            item: canonical,
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
