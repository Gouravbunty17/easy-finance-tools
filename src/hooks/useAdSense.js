import { useEffect } from "react";

export default function useAdSense() {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV !== "development") {
        const ads = document.querySelectorAll(".adsbygoogle");
        ads.forEach((ad) => {
          if (!ad.getAttribute("data-ad-status")) {
            window.adsbygoogle.push({});
          }
        });
      }
    } catch (e) {
      console.error("AdSense push failed", e);
    }
  }, []);
}
