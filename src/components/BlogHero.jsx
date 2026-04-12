import React from "react";

export default function BlogHero({
  icon,
  category,
  title,
  date,
  readTime,
  gradient = "from-primary to-secondary",
  author = "EasyFinanceTools editorial team",
  reviewer = "Reviewed against current Canadian source material",
  standardsHref = "/editorial-standards",
}) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-white/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="text-center lg:text-left">
            <div className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              {category}
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white drop-shadow md:text-5xl">
              {title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-white/75 lg:justify-start">
              <span>{date}</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span>{readTime}</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/85">Written by {author}</span>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/85">{reviewer}</span>
              <a href={standardsHref} className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/85 transition hover:bg-white/20">
                Editorial standards
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                    Article visual
                  </span>
                  <span className="text-xs font-semibold text-white/60">{category}</span>
                </div>

                <div className="flex min-h-[220px] items-center justify-center rounded-[22px] border border-white/15 bg-slate-950/20 p-6">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[24px] bg-white/15 px-3 text-3xl font-black uppercase tracking-[0.12em] text-white shadow-lg">
                      {icon}
                    </div>
                    <div className="mt-5 space-y-2">
                      <div className="mx-auto h-2.5 w-24 rounded-full bg-white/30" />
                      <div className="mx-auto h-2.5 w-40 rounded-full bg-white/20" />
                      <div className="mx-auto h-2.5 w-32 rounded-full bg-white/15" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
