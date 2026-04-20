import React, { useEffect } from "react";

export default function ToolPageSchema({
  name,
  description,
  canonical,
  category,
}) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
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
            name: "EasyFinanceTools",
            url: "https://easyfinancetools.com",
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

    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = `schema-${canonical}`;
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);

    return () => {
      document.getElementById(`schema-${canonical}`)?.remove();
    };
  }, [canonical, category, description, name]);

  return null;
}
