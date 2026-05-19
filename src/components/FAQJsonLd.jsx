import React from "react";

export default function FAQJsonLd({ faqs = [] }) {
  const normalizedFaqs = faqs.filter((faq) => faq?.q && faq?.a);
  if (!normalizedFaqs.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: normalizedFaqs.map(({ q, a }) => ({
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
