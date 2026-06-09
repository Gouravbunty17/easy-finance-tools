import React from "react";
import { getArticleMedia } from "../pages/blog/articleMedia";

export default function ArticleImage({
  slug,
  alt,
  className = "",
  imgClassName = "",
  loading = "lazy",
}) {
  const media = getArticleMedia(slug);
  const fitClass = media.objectFit === "contain" ? "object-contain" : "object-cover";

  return (
    <div className={`overflow-hidden bg-slate-100 dark:bg-slate-900 ${className}`}>
      <img
        src={media.image}
        srcSet={media.srcSet}
        sizes={media.sizes}
        alt={alt || media.alt}
        loading={loading}
        className={`h-full w-full ${fitClass} ${imgClassName}`}
      />
    </div>
  );
}
