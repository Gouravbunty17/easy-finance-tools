import React from "react";

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
 *   authorName      — author display name (string, defaults to "EasyFinanceTools Editorial Team")
 *   imageUrl        — og-image URL (string)
 */
export default function ArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "Gourav Kumar",
  imageUrl = "https://easyfinancetools.com/og-image.svg",
  breadcrumbs,
}) {
  if (!headline || !url) return null;

  const defaultBreadcrumbs = [
    { name: "Home", item: "https://easyfinancetools.com/" },
    { name: "Blog", item: "https://easyfinancetools.com/blog" },
    { name: headline, item: url },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline,
        description,
        url,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
          "@type": "Person",
          name: authorName,
          url: "https://easyfinancetools.com/about",
        },
        publisher: {
          "@type": "Organization",
          name: "Easy Finance Tools",
          url: "https://easyfinancetools.com",
          logo: {
            "@type": "ImageObject",
            url: imageUrl,
          },
        },
        image: {
          "@type": "ImageObject",
          url: imageUrl,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: (breadcrumbs || defaultBreadcrumbs).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.item,
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
