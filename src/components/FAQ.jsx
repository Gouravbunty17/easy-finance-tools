import { useState, useEffect } from "react";

export default function FAQ({ items }) {
  const [open, setOpen] = useState(null);

  // Inject JSON-LD schema for Google featured snippets
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": items.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a },
      })),
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "faq-schema";
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById("faq-schema")?.remove(); };
  }, [items]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-primary dark:text-accent mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {items.map(({ q, a }, i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
            >
              <span className="font-semibold text-gray-800 dark:text-white text-sm pr-4">{q}</span>
              <span className={`text-primary text-xl shrink-0 transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open === i && (
              <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
