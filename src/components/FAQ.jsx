import { useState } from "react";
import FAQJsonLd from "./FAQJsonLd";

export default function FAQ({ items = [], includeSchema = true }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="mt-12">
      {includeSchema ? <FAQJsonLd faqs={items} /> : null}
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
