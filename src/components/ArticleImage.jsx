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

  return (
    <div className={`overflow-hidden bg-slate-100 dark:bg-slate-900 ${className}`}>
      <img
        src={media.image}
        alt={alt || media.alt}
        loading={loading}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
