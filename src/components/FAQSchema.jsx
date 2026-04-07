import React from "react";

/**
 * FAQSchema — injects FAQPage JSON-LD structured data.
 *
 * Pass an array of { q, a } objects. The component renders nothing visible —
 * it only writes the <script type="application/ld+json"> block to the DOM
 * so Google, Bing, and AI answer engines can extract the Q&A pairs.
 *
 * Props:
 *   faqs  — array of { q: string, a: string }
 */
export default function FAQSchema({ faqs = [] }) {
  if (!faqs.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
