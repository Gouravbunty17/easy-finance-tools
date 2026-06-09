export const articleMediaBySlug = {
  "how-to-buy-spacex-ipo-stock-in-canada": {
    image: "/article-images/spacex-ipo-stock-canada.png",
    alt: "SpaceX IPO stock in Canada article graphic with rocket launch, Canadian maple leaf, market chart, and risk planning icons",
    heroLayout: "card",
    objectFit: "contain",
  },
  "best-canadian-dividend-etfs-2026": {
    image: "/article-images/best-canadian-dividend-etfs-2026.webp",
    alt: "Canadian dividend planning calendar with finance app, portfolio folders, and maple leaf details",
  },
  "what-is-a-dividend-etf-canada": {
    image: "/article-images/dividend-etfs-canada.svg",
    alt: "Dividend ETF education illustration with bars, income icon, and Canadian investing styling",
  },
  "500-month-dividend-canada": {
    image: "/article-images/500-month-dividend-canada.webp",
    alt: "Laptop showing Canadian investment charts beside TFSA, RRSP, and FHSA checklist for dividend ETF planning",
  },
  "tfsa-investing-mistakes-canada": {
    image: "/article-images/tfsa-investing.svg",
    alt: "TFSA investing illustration with account room, ETF, and tax blocks",
  },
  "tfsa-contribution-room-canada-2026": {
    image: "/article-images/tfsa-investing.svg",
    alt: "TFSA contribution room editorial illustration with growth line and account label",
  },
  "tfsa-vs-rrsp-canada-2026": {
    image: "/article-images/tfsa-vs-rrsp-canada-2026.webp",
    alt: "Canadian TFSA and RRSP planning scale with savings jar, retirement folder, and Toronto skyline",
  },
  "how-much-tfsa-room-2026": {
    image: "/article-images/tfsa-investing.svg",
    alt: "TFSA room planning illustration for Canadian investors",
  },
  "how-to-choose-etfs-canada": {
    image: "/article-images/etf-checklist.svg",
    alt: "ETF checklist illustration showing allocation, MER, diversification, and risk",
  },
  "best-etfs-for-tfsa-canada-2026": {
    image: "/article-images/etf-checklist.svg",
    alt: "ETF checklist image for Canadian TFSA ETF research",
  },
  "drip-strategy-canada": {
    image: "/article-images/drip-strategy.svg",
    alt: "DRIP strategy illustration showing dividends cycling into more ETF units",
  },
  "dividend-reinvestment-plans-canada": {
    image: "/article-images/drip-strategy.svg",
    alt: "Dividend reinvestment plan illustration showing cash reinvested into portfolio growth",
  },
  "covered-call-etfs-canada-explained": {
    image: "/article-images/covered-call-etfs.svg",
    alt: "Covered call ETF illustration showing option premium income and upside cap zone",
  },
  "fhsa-vs-rrsp-down-payment-canada-2026": {
    image: "/article-images/fhsa-home-buying.svg",
    alt: "FHSA and RRSP first home buyer planning illustration with house and savings path",
  },
  "fhsa-calculator-canada-2026": {
    image: "/article-images/fhsa-home-buying.svg",
    alt: "FHSA first home buyer planning illustration",
  },
  "fhsa-rules-canada-2026": {
    image: "/article-images/fhsa-rules-canada-2026.webp",
    alt: "Canadian FHSA rules planning desk with home key, savings coins, transfer arrows, and Toronto skyline",
  },
  "how-to-start-investing-canada-2026": {
    image: "/article-images/beginner-investing-canada.svg",
    alt: "Beginner investing roadmap illustration for Canadians moving from savings to ETFs",
  },
  "how-to-invest-in-canada-beginners-2026": {
    image: "/article-images/beginner-investing-canada.svg",
    alt: "Canadian beginner investing roadmap illustration with account and ETF steps",
  },
  "best-investing-apps-canada": {
    image: "/article-images/beginner-investing-canada.svg",
    alt: "Canadian beginner investing platform illustration",
  },
  "tfsa-vs-rrsp-vs-fhsa-canada": {
    image: "/article-images/tfsa-vs-rrsp-vs-fhsa-canada.webp",
    alt: "Canadian registered account planning scene with coins, nest egg, and home-buying keys",
  },
  "rrsp-deadline-canada-2026": {
    image: "/article-images/retirement-canada.svg",
    alt: "Canadian retirement planning illustration with RRSP, CPP, and OAS blocks",
  },
  "cpp-payment-dates-2026": {
    image: "/article-images/retirement-canada.svg",
    alt: "Canadian retirement income illustration for CPP and OAS planning",
  },
  "oas-payment-dates-2026": {
    image: "/article-images/retirement-canada.svg",
    alt: "Canadian retirement income illustration for OAS planning",
  },
};

export const fallbackArticleMedia = {
  image: "/article-images/beginner-investing-canada.svg",
  alt: "Canadian finance education editorial illustration",
};

export function getArticleMedia(slug) {
  return articleMediaBySlug[slug] || fallbackArticleMedia;
}

export function getAbsoluteArticleImage(slug) {
  const media = getArticleMedia(slug);
  return `https://easyfinancetools.com${media.image}`;
}
