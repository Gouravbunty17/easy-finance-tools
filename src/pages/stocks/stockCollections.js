export const CANADIAN_BANK_STOCKS = [
  { t: "RY", n: "Royal Bank of Canada", market: "TSX" },
  { t: "TD", n: "TD Bank", market: "TSX" },
  { t: "BNS", n: "Scotiabank", market: "TSX" },
  { t: "BMO", n: "Bank of Montreal", market: "TSX" },
  { t: "CM", n: "CIBC", market: "TSX" },
  { t: "NA", n: "National Bank", market: "TSX" },
];

export const CANADIAN_ETFS = [
  { t: "XEQT.TO", n: "iShares Core Equity ETF Portfolio", market: "TSX ETF" },
  { t: "VEQT.TO", n: "Vanguard All-Equity ETF Portfolio", market: "TSX ETF" },
  { t: "XGRO.TO", n: "iShares Core Growth ETF Portfolio", market: "TSX ETF" },
  { t: "VGRO.TO", n: "Vanguard Growth ETF Portfolio", market: "TSX ETF" },
  { t: "VFV.TO", n: "Vanguard S&P 500 Index ETF", market: "TSX ETF" },
  { t: "ZSP.TO", n: "BMO S&P 500 Index ETF", market: "TSX ETF" },
  { t: "XIU.TO", n: "iShares S&P/TSX 60 Index ETF", market: "TSX ETF" },
  { t: "VCN.TO", n: "Vanguard FTSE Canada All Cap Index ETF", market: "TSX ETF" },
];

export const DIVIDEND_ETFS = [
  { t: "VDY.TO", n: "Vanguard FTSE Canadian High Dividend Yield ETF", market: "TSX ETF" },
  { t: "XDV.TO", n: "iShares Canadian Select Dividend ETF", market: "TSX ETF" },
  { t: "ZWB.TO", n: "BMO Covered Call Canadian Banks ETF", market: "TSX ETF" },
  { t: "HDIV.TO", n: "Hamilton Enhanced Multi-Sector Covered Call ETF", market: "TSX ETF" },
  { t: "XEI.TO", n: "iShares S&P/TSX Composite High Dividend Index ETF", market: "TSX ETF" },
  { t: "ZDV.TO", n: "BMO Canadian Dividend ETF", market: "TSX ETF" },
];

export const CANADIAN_DIVIDEND_STOCKS = [
  { t: "RY", n: "Royal Bank of Canada", market: "TSX" },
  { t: "TD", n: "TD Bank", market: "TSX" },
  { t: "ENB", n: "Enbridge", market: "TSX" },
  { t: "BCE", n: "BCE", market: "TSX" },
  { t: "T", n: "TELUS", market: "TSX" },
  { t: "TRP", n: "TC Energy", market: "TSX" },
  { t: "BNS", n: "Scotiabank", market: "TSX" },
  { t: "BMO", n: "Bank of Montreal", market: "TSX" },
];

export const COVERED_CALL_ETFS = [
  { t: "ZWB.TO", n: "BMO Covered Call Canadian Banks ETF", market: "TSX ETF" },
  { t: "HDIV.TO", n: "Hamilton Enhanced Multi-Sector Covered Call ETF", market: "TSX ETF" },
  { t: "ZWC.TO", n: "BMO Canadian High Dividend Covered Call ETF", market: "TSX ETF" },
  { t: "ZWU.TO", n: "BMO Covered Call Utilities ETF", market: "TSX ETF" },
  { t: "HMAX.TO", n: "Hamilton Canadian Financials Yield Maximizer ETF", market: "TSX ETF" },
  { t: "UMAX.TO", n: "Hamilton Utilities Yield Maximizer ETF", market: "TSX ETF" },
];

export const STOCK_COLLECTIONS = {
  "canadian-bank-stocks": {
    eyebrow: "Canadian bank sector",
    title: "Canadian Bank Stocks",
    description:
      "Track the Big Five banks and close peers in one place. Compare price action, day change, volume, and jump into full ticker research pages.",
    items: CANADIAN_BANK_STOCKS,
    relatedLinks: [
      { title: "Compare RY vs TD", href: "/stocks/compare/ry-vs-td" },
      { title: "Read beginner investing guide", href: "/blog/how-to-invest-in-canada-beginners-2026" },
      { title: "Open dividend calculator", href: "/tools/dividend-calculator" },
    ],
  },
  "canadian-etfs": {
    eyebrow: "Canadian ETF lists",
    title: "Canadian ETFs",
    description:
      "Browse all-in-one ETFs, S&P 500 funds, and broad-market Canadian ETF favourites used in TFSAs and RRSPs.",
    items: CANADIAN_ETFS,
    relatedLinks: [
      { title: "Compare XEQT vs VEQT", href: "/stocks/compare/xeqt-vs-veqt" },
      { title: "Read best ETFs for TFSA", href: "/blog/best-etfs-for-tfsa-canada-2026" },
      { title: "Open TFSA calculator", href: "/tools/tfsa-calculator" },
    ],
  },
  "dividend-etfs": {
    eyebrow: "Income-focused ETF list",
    title: "Dividend ETFs",
    description:
      "See popular Canadian dividend and covered-call ETFs in one view, then move into full chart, profile, and headline pages for each symbol.",
    items: DIVIDEND_ETFS,
    relatedLinks: [
      { title: "Compare VDY vs XDV", href: "/stocks/compare/vdy-vs-xdv" },
      { title: "Read weekly dividend ETFs", href: "/blog/weekly-dividend-etfs" },
      { title: "Open dividend calculator", href: "/tools/dividend-calculator" },
    ],
  },
  "canadian-dividend-stocks": {
    eyebrow: "Canadian dividend ideas",
    title: "Canadian Dividend Stocks",
    description:
      "Browse established Canadian dividend payers across banks, telecom, pipelines, and utilities, then open full ticker pages and calculators.",
    items: CANADIAN_DIVIDEND_STOCKS,
    relatedLinks: [
      { title: "Open dividend calculator", href: "/tools/dividend-calculator" },
      { title: "Read weekly dividend ETFs", href: "/blog/weekly-dividend-etfs" },
      { title: "Compare RY vs TD", href: "/stocks/compare/ry-vs-td" },
    ],
  },
  "covered-call-etfs": {
    eyebrow: "Yield-focused ETF list",
    title: "Covered-Call ETFs",
    description:
      "Track covered-call and yield-maximizer ETFs popular with Canadian income investors, then compare price action and income-focused ideas.",
    items: COVERED_CALL_ETFS,
    relatedLinks: [
      { title: "Compare VDY vs XDV", href: "/stocks/compare/vdy-vs-xdv" },
      { title: "Open dividend calculator", href: "/tools/dividend-calculator" },
      { title: "Read best ETFs for TFSA", href: "/blog/best-etfs-for-tfsa-canada-2026" },
    ],
  },
  "tsx-bank-stocks": {
    eyebrow: "TSX bank list",
    title: "TSX Bank Stocks",
    description:
      "Focus on TSX-listed Canadian bank stocks in one place, with quick access to compare pages and full ticker research.",
    items: CANADIAN_BANK_STOCKS,
    relatedLinks: [
      { title: "Compare RY vs TD", href: "/stocks/compare/ry-vs-td" },
      { title: "Compare BNS vs BMO", href: "/stocks/compare/bns-vs-bmo" },
      { title: "Read beginner investing guide", href: "/blog/how-to-invest-in-canada-beginners-2026" },
    ],
  },
};

export const COMPARISON_PRESETS = [
  { label: "XEQT vs VEQT", left: "XEQT.TO", right: "VEQT.TO", blurb: "All-equity asset-allocation ETFs for long-term Canadian investors." },
  { label: "XGRO vs VGRO", left: "XGRO.TO", right: "VGRO.TO", blurb: "80/20 growth ETFs with one-fund global diversification." },
  { label: "VFV vs ZSP", left: "VFV.TO", right: "ZSP.TO", blurb: "TSX-listed S&P 500 ETFs commonly used in registered accounts." },
  { label: "RY vs TD", left: "RY", right: "TD", blurb: "Two of Canada's largest banks with different capital-markets and US exposure mixes." },
  { label: "BNS vs BMO", left: "BNS", right: "BMO", blurb: "Big-bank dividend payers with different geographic footprints." },
  { label: "VDY vs XDV", left: "VDY.TO", right: "XDV.TO", blurb: "Canadian dividend ETF options for investors focused on income." },
];

export function makeComparisonSlug(left, right) {
  return `${shortTickerLabel(left).toLowerCase()}-vs-${shortTickerLabel(right).toLowerCase()}`;
}

export function getCollection(slug) {
  return STOCK_COLLECTIONS[slug];
}

export function getPresetComparison(left, right) {
  return COMPARISON_PRESETS.find((preset) => preset.left === left && preset.right === right)
    || COMPARISON_PRESETS.find((preset) => preset.left === right && preset.right === left)
    || null;
}

export function shortTickerLabel(symbol) {
  return symbol.replace(".TO", "").replace("-USD", "");
}

export function getPresetBySlug(slug) {
  return COMPARISON_PRESETS.find((preset) => makeComparisonSlug(preset.left, preset.right) === slug) || null;
}
