import React from "react";

/**
 * BlogHero — Full-width gradient hero banner for blog posts.
 *
 * Props:
 *   icon        — emoji string, e.g. "💰"
 *   category    — e.g. "TFSA · Savings"
 *   title       — article H1 title
 *   date        — e.g. "April 2, 2026"
 *   readTime    — e.g. "8 min read"
 *   gradient    — Tailwind from/to classes, e.g. "from-blue-600 to-indigo-700"
 */
export default function BlogHero({ icon, category, title, date, readTime, gradient = "from-primary to-secondary" }) {
  return (
    <div className={`w-full bg-gradient-to-br ${gradient} relative overflow-hidden`}>
      {/* Subtle background dots pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5" />

      <div className="relative max-w-3xl mx-auto px-4 py-16 text-center">
        {/* Icon */}
        <div className="text-7xl mb-5 drop-shadow-lg select-none" role="img" aria-label={category}>
          {icon}
        </div>

        {/* Category badge */}
        <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          {category}
        </span>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5 drop-shadow">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex items-center justify-center gap-4 text-white/75 text-sm flex-wrap">
          <span>📅 {date}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>⏱ {readTime}</span>
        </div>
      </div>
    </div>
  );
}
