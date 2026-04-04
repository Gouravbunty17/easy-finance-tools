import React from "react";
import { Link } from "react-router-dom";
import { trackSurfaceCta } from "../lib/analytics";

export default function SurfaceTrackedLink({
  to,
  eventName,
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
        trackSurfaceCta(eventName, ctaLabel || String(children), to, trackingParams);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
