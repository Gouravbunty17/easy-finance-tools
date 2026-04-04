import React from "react";
import { Link } from "react-router-dom";
import { trackArticleCta } from "../lib/analytics";

export default function TrackedLink({
  to,
  articleSlug,
  ctaLabel,
  trackingParams,
  onClick,
  children,
  ...props
}) {
  return (
    <Link
      to={to}
      {...props}
      onClick={(event) => {
        trackArticleCta(articleSlug, ctaLabel || String(children), to, trackingParams);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
