import React from "react";

/**
 * TLDRBox — Quick Answer / TL;DR block for AEO.
 *
 * Sits near the top of a blog post and gives a short, citable answer
 * that AI answer engines (ChatGPT, Perplexity, Google AI Overviews) can
 * extract verbatim when a user asks the core question.
 *
 * Props:
 *   headline  — the main question this answers (string)
 *   answer    — 1–3 sentence direct answer (string)
 *   points    — optional array of short key-fact strings
 */
export default function TLDRBox({ headline, answer, points = [] }) {
  return (
    <div className="not-prose my-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-blue-600 px-3 py-0.5 text-xs font-bold uppercase tracking-[0.14em] text-white">
          Quick Answer
        </span>
        {headline && (
          <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">{headline}</span>
        )}
      </div>
      {answer && (
        <p className="text-sm leading-7 text-blue-900 dark:text-blue-200">{answer}</p>
      )}
      {points.length > 0 && (
        <ul className="mt-3 space-y-1">
          {points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
              <span className="mt-1 shrink-0 text-blue-400">→</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
