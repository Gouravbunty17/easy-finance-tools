export const SITE_ORIGIN = "https://easyfinancetools.com";

export function canonicalizeSiteUrl(urlOrPath = "/") {
  const rawValue = String(urlOrPath || "/").trim();
  const value = rawValue.startsWith("//") ? `https:${rawValue}` : rawValue;

  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : value.startsWith("/") ? value : `/${value}`,
      SITE_ORIGIN,
    );

    if (url.hostname === "www.easyfinancetools.com" || url.hostname === "easyfinancetools.com") {
      url.protocol = "https:";
      url.hostname = "easyfinancetools.com";
    }

    const normalized = url.toString();
    return url.hostname === "easyfinancetools.com" && url.pathname !== "/"
      ? normalized.replace(/\/(?=([?#])?$)/, "")
      : normalized;
  } catch {
    return `${SITE_ORIGIN}/`;
  }
}
