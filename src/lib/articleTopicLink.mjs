const TOPIC_LINKS = [
  { pattern: /\bFHSA\b/i, href: "/topics/fhsa", title: "FHSA", slug: "fhsa" },
  { pattern: /\bTFSA\b/i, href: "/topics/tfsa", title: "TFSA", slug: "tfsa" },
  { pattern: /\bRRSP\b/i, href: "/topics/rrsp", title: "RRSP", slug: "rrsp" },
  { pattern: /\b(Mortgage|Housing|Home Buying)\b/i, href: "/topics/mortgages", title: "Mortgages", slug: "mortgages" },
  { pattern: /\b(Dividend|Covered Call)\b/i, href: "/topics/dividends", title: "Dividend investing", slug: "dividends" },
  { pattern: /\b(Retirement|CPP|OAS)\b/i, href: "/topics/retirement", title: "Retirement", slug: "retirement" },
];
export function articleTopicLink(category) {
  return typeof category === "string" ? TOPIC_LINKS.find(x=>x.pattern.test(category)) ?? null : null;
}
