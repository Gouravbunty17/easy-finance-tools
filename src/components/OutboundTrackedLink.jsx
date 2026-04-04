import React from "react";
import { trackAffiliateClick } from "../lib/analytics";

export default function OutboundTrackedLink({
  href,
  offerName,
  trackingParams,
  onClick,
  children,
  ...props
}) {
  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        trackAffiliateClick(offerName || String(children), href, trackingParams);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
