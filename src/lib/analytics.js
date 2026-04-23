function getPageContext() {
  if (typeof window === "undefined") return {};

  return {
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  };
}

export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    ...getPageContext(),
    ...params,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

export function trackPageView(params = {}) {
  if (typeof window === "undefined") return;

  trackEvent("page_view", {
    page_title: document.title,
    ...params,
  });
}

export function trackSurfaceCta(eventName, ctaLabel, destination, params = {}) {
  trackEvent(eventName, {
    cta_label: ctaLabel,
    destination,
    ...params,
  });
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

export function trackHomepageCta(ctaLabel, destination, params = {}) {
  trackSurfaceCta("homepage_cta_click", ctaLabel, destination, params);
}

export function trackToolsHubCta(ctaLabel, destination, params = {}) {
  trackSurfaceCta("tools_hub_cta_click", ctaLabel, destination, params);
}

export function trackToolResultCta(ctaLabel, destination, params = {}) {
  trackSurfaceCta("tool_result_cta_click", ctaLabel, destination, params);
}

export function trackAffiliateClick(offerName, destination, params = {}) {
  trackEvent("affiliate_cta_click", {
    offer_name: offerName,
    destination,
    ...params,
  });
}

export function trackReferralAction(action, params = {}) {
  trackEvent(action === "copy" ? "referral_copy" : "referral_click", params);
}
