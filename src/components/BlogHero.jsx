import React, { useState } from "react";
import { Link } from "react-router-dom";
import ArticleImage from "./ArticleImage";
import { getArticleMedia } from "../pages/blog/articleMedia";

export default function BlogHero({
  icon,
  category,
  title,
  date,
  readTime,
  gradient = "from-primary to-secondary",
  author = "Gourav Kumar",
  authorHref = "/about",
  reviewer = "Reviewed against current Canadian source material",
  standardsHref = "/editorial-standards",
  slug,
  linkedinUrl = "",
  headshotUrl = "",
}) {
  const media = slug ? getArticleMedia(slug) : null;
  const hasPhotoBackground = Boolean(media?.image && !media.image.endsWith(".svg"));
  const [imageAvailable, setImageAvailable] = useState(Boolean(headshotUrl));

  return (
    <section
      className={`relative overflow-hidden text-white ${hasPhotoBackground ? "article-hero-photo bg-slate-950" : `bg-gradient-to-br ${gradient}`}`}
      style={hasPhotoBackground ? { "--article-hero-image": `url('${media.image}')` } : undefined}
    >
      <div
        className={`absolute inset-0 ${hasPhotoBackground ? "opacity-0" : "opacity-10"}`}
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-white/8 blur-3xl" />

      <div className={`relative mx-auto px-4 py-14 md:py-16 ${hasPhotoBackground ? "max-w-6xl lg:py-24" : "max-w-7xl"}`}>
        <div className={`grid items-center gap-10 ${hasPhotoBackground ? "min-h-[420px]" : "lg:grid-cols-[minmax(0,1fr)_480px]"}`}>
          <div className="text-center lg:text-left">
            <div className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              {category}
            </div>

            <h1 className={`${hasPhotoBackground ? "max-w-4xl" : "max-w-3xl"} text-3xl font-bold leading-tight text-white drop-shadow md:text-5xl`}>
              {title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-white/75 lg:justify-start">
              <span>{date}</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span>{readTime}</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <Link to={authorHref} className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/85 transition hover:bg-white/20">By {author}</Link>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/85">{reviewer}</span>
              <a href={standardsHref} className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/85 transition hover:bg-white/20">
                Editorial standards
              </a>
            </div>

            <div className="mt-6 max-w-2xl rounded-2xl border border-white/15 bg-white/10 p-4 text-left text-sm leading-6 text-white/85 backdrop-blur">
              <div className="flex items-start gap-3">
                {imageAvailable && headshotUrl ? (
                  <img
                    src={headshotUrl}
                    alt="Gourav Kumar"
                    className="h-11 w-11 flex-shrink-0 rounded-xl object-cover"
                    loading="lazy"
                    onError={() => setImageAvailable(false)}
                  />
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-sm font-black text-white">
                    GK
                  </div>
                )}
                <div>
                  <p className="font-bold text-white">Gourav Kumar, Founder of Easy Finance Tools</p>
                  <p className="mt-1">
                    Independent Canadian finance tools creator. Educational content only; not a licensed financial advisor, accountant, mortgage broker, or tax professional.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold">
                    <Link to={authorHref} className="underline underline-offset-2">About the author</Link>
                    {linkedinUrl ? <a href={linkedinUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">LinkedIn</a> : null}
                    <span>Last reviewed: {date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!hasPhotoBackground ? (
          <div className="mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur sm:p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                    Article visual
                  </span>
                  <span className="text-xs font-semibold text-white/60">{category}</span>
                </div>

                {slug ? (
                  <ArticleImage
                    slug={slug}
                    loading="eager"
                    className="min-h-[240px] rounded-[22px] border border-white/15 md:min-h-[280px]"
                    imgClassName="aspect-[16/10] md:aspect-[16/9]"
                  />
                ) : (
                  <div className="flex min-h-[240px] items-center justify-center rounded-[22px] border border-white/15 bg-slate-950/20 p-6 md:min-h-[280px]">
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
                )}

                <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{title}</p>
                </div>
              </div>
            </div>
          </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
