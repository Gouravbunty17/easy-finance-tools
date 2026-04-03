import React from "react";

export default function BlogHero({ icon, category, title, date, readTime, gradient = "from-primary to-secondary" }) {
  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-br ${gradient}`}>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />

      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mb-5 text-4xl font-black uppercase tracking-[0.3em] text-white/90 drop-shadow-lg select-none md:text-5xl">
          {icon}
        </div>

        <span className="mb-5 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          {category}
        </span>

        <h1 className="mb-5 text-3xl font-bold leading-tight text-white drop-shadow md:text-4xl">
          {title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/75">
          <span>{date}</span>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  );
}
