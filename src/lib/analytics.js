export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

export function trackToolStart(toolName, params = {}) {
  trackEvent("tool_start", {
    tool_name: toolName,
    ...params,
  });
}

export function trackToolCalculate(toolName, params = {}) {
  trackEvent("tool_calculate", {
    tool_name: toolName,
    ...params,
  });
}

export function trackArticleCta(articleSlug, ctaLabel, destination, params = {}) {
  trackEvent("article_cta_click", {
    article_slug: articleSlug,
    cta_label: ctaLabel,
    destination,
    ...params,
  });
}
