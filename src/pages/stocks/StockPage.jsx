import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SEO from "../../components/SEO";
import AdSlot from "../../components/AdSlot";
import { COMPARISON_PRESETS, makeComparisonSlug } from "./stockCollections";

function TVWidget({ id, scriptSrc, configFn, height }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerHTML = "";
    const isDark = document.documentElement.classList.contains("dark");
    const container = document.createElement("div");
    container.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.innerHTML = JSON.stringify(configFn(isDark));

    el.appendChild(container);
    el.appendChild(script);

    return () => {
      if (el) el.innerHTML = "";
    };
  }, [configFn, id, scriptSrc]);

  return (
    <div
      ref={ref}
      className="tradingview-widget-container w-full overflow-hidden"
      style={{ minHeight: height }}
    />
  );
}

function SkeletonLine({ cls }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${cls}`} />;
}

// ─── Popular symbol lists ───────────────────────────────────────────────────

const POPULAR_STOCKS_CA = [
  { t: "RY",   n: "Royal Bank",       market: "TSX" },
  { t: "TD",   n: "TD Bank",          market: "TSX" },
  { t: "BNS",  n: "Scotiabank",       market: "TSX" },
  { t: "BMO",  n: "BMO",              market: "TSX" },
  { t: "CM",   n: "CIBC",             market: "TSX" },
  { t: "ENB",  n: "Enbridge",         market: "TSX" },
  { t: "CNR",  n: "CN Rail",          market: "TSX" },
  { t: "CNQ",  n: "Canadian Natural", market: "TSX" },
  { t: "SU",   n: "Suncor",           market: "TSX" },
  { t: "TRP",  n: "TC Energy",        market: "TSX" },
  { t: "BCE",  n: "Bell Canada",      market: "TSX" },
  { t: "T",    n: "TELUS",            market: "TSX" },
  { t: "SHOP", n: "Shopify",          market: "TSX" },
  { t: "ATD",  n: "Alimentation Couche-Tard", market: "TSX" },
  { t: "WPM",  n: "Wheaton Precious", market: "TSX" },
];

const POPULAR_STOCKS_US = [
  { t: "AAPL",  n: "Apple",     market: "NASDAQ" },
  { t: "MSFT",  n: "Microsoft", market: "NASDAQ" },
  { t: "NVDA",  n: "Nvidia",    market: "NASDAQ" },
  { t: "AMZN",  n: "Amazon",    market: "NASDAQ" },
  { t: "GOOGL", n: "Alphabet",  market: "NASDAQ" },
  { t: "META",  n: "Meta",      market: "NASDAQ" },
  { t: "TSLA",  n: "Tesla",     market: "NASDAQ" },
];

const POPULAR_ETFS_CA = [
  { t: "XEQT.TO", n: "iShares All-Equity",    market: "TSX ETF" },
  { t: "VEQT.TO", n: "Vanguard All-Equity",   market: "TSX ETF" },
  { t: "XGRO.TO", n: "iShares Growth",        market: "TSX ETF" },
  { t: "VGRO.TO", n: "Vanguard Growth",       market: "TSX ETF" },
  { t: "VFV.TO",  n: "Vanguard S&P 500",      market: "TSX ETF" },
  { t: "ZSP.TO",  n: "BMO S&P 500",           market: "TSX ETF" },
  { t: "XIU.TO",  n: "iShares TSX 60",        market: "TSX ETF" },
  { t: "VDY.TO",  n: "Vanguard Dividend",     market: "TSX ETF" },
  { t: "XDV.TO",  n: "iShares Dividend",      market: "TSX ETF" },
  { t: "ZWB.TO",  n: "BMO Covered Call Banks",market: "TSX ETF" },
  { t: "HDIV.TO", n: "Hamilton Enhanced",     market: "TSX ETF" },
  { t: "CASH.TO", n: "Global X HISA ETF",     market: "TSX ETF" },
  { t: "CSAV.TO", n: "CI HISA ETF",           market: "TSX ETF" },
];

const POPULAR_ETFS_US = [
  { t: "SPY",  n: "S&P 500",     market: "US ETF" },
  { t: "QQQ",  n: "NASDAQ 100",  market: "US ETF" },
  { t: "VTI",  n: "US Total Mkt",market: "US ETF" },
  { t: "VOO",  n: "Vanguard S&P",market: "US ETF" },
];

const POPULAR_CRYPTO = [
  { t: "BTC-USD",  n: "Bitcoin",  market: "Crypto" },
  { t: "ETH-USD",  n: "Ethereum", market: "Crypto" },
  { t: "SOL-USD",  n: "Solana",   market: "Crypto" },
  { t: "XRP-USD",  n: "XRP",      market: "Crypto" },
  { t: "BNB-USD",  n: "BNB",      market: "Crypto" },
  { t: "DOGE-USD", n: "Dogecoin", market: "Crypto" },
];

const POPULAR_COMMODITIES = [
  { t: "GC=F", n: "Gold futures", market: "Commodity", label: "Gold" },
  { t: "SI=F", n: "Silver futures", market: "Commodity", label: "Silver" },
  { t: "CL=F", n: "WTI crude oil", market: "Commodity", label: "WTI Oil" },
  { t: "BZ=F", n: "Brent crude oil", market: "Commodity", label: "Brent" },
  { t: "NG=F", n: "Natural gas", market: "Commodity", label: "Nat Gas" },
  { t: "HG=F", n: "Copper futures", market: "Commodity", label: "Copper" },
];

const POPULAR_FOREX = [
  { t: "CAD=X", n: "US dollar to Canadian dollar", market: "FX", label: "USD/CAD" },
  { t: "EURUSD=X", n: "Euro to US dollar", market: "FX", label: "EUR/USD" },
  { t: "GBPUSD=X", n: "British pound to US dollar", market: "FX", label: "GBP/USD" },
  { t: "JPY=X", n: "US dollar to Japanese yen", market: "FX", label: "USD/JPY" },
  { t: "AUDUSD=X", n: "Australian dollar to US dollar", market: "FX", label: "AUD/USD" },
  { t: "CHF=X", n: "US dollar to Swiss franc", market: "FX", label: "USD/CHF" },
];


// ─── Symbol metadata ─────────────────────────────────────────────────────────

const SYMBOL_METADATA = {
  // ── Canadian Banks ──
  RY:  { name: "Royal Bank of Canada",    type: "stock", exchange: "TSX", tvSymbol: "TSX:RY",   description: "Track Royal Bank of Canada (RY) with live chart, technical analysis, financials, and the latest news. One of Canada's largest financial institutions." },
  TD:  { name: "TD Bank",                 type: "stock", exchange: "TSX", tvSymbol: "TSX:TD",   description: "Track Toronto-Dominion Bank (TD) with live chart, technical analysis, financials, and news. One of Canada's Big Five banks." },
  BNS: { name: "Bank of Nova Scotia",     type: "stock", exchange: "TSX", tvSymbol: "TSX:BNS",  description: "Track Scotiabank (BNS) with live chart, technical analysis, financials, and news. A major Canadian bank with strong international presence." },
  BMO: { name: "Bank of Montreal",        type: "stock", exchange: "TSX", tvSymbol: "TSX:BMO",  description: "Track Bank of Montreal (BMO) with live chart, technical analysis, financials, and news. Canada's oldest bank and one of the Big Five." },
  CM:  { name: "CIBC",                    type: "stock", exchange: "TSX", tvSymbol: "TSX:CM",   description: "Track CIBC (CM) with live chart, technical analysis, financials, and news. A leading Canadian bank serving millions of personal and business clients." },
  // ── Canadian Energy & Infrastructure ──
  ENB: { name: "Enbridge Inc.",           type: "stock", exchange: "TSX", tvSymbol: "TSX:ENB",  description: "Track Enbridge (ENB) with live chart, technical analysis, financials, and news. North America's largest natural gas distribution company." },
  TRP: { name: "TC Energy",               type: "stock", exchange: "TSX", tvSymbol: "TSX:TRP",  description: "Track TC Energy (TRP) with live chart, technical analysis, financials, and news. A major Canadian pipeline and energy infrastructure company." },
  CNQ: { name: "Canadian Natural Resources", type: "stock", exchange: "TSX", tvSymbol: "TSX:CNQ", description: "Track Canadian Natural Resources (CNQ) with live chart, technical analysis, financials, and news. One of Canada's largest independent energy companies." },
  SU:  { name: "Suncor Energy",           type: "stock", exchange: "TSX", tvSymbol: "TSX:SU",   description: "Track Suncor Energy (SU) with live chart, technical analysis, financials, and news. An integrated energy company focused on oil sands development." },
  // ── Canadian Rail & Telecom ──
  CNR: { name: "Canadian National Railway", type: "stock", exchange: "TSX", tvSymbol: "TSX:CNR", description: "Track CN Rail (CNR) with live chart, technical analysis, financials, and news. Canada's largest railway company, spanning coast-to-coast." },
  BCE: { name: "BCE Inc.",                type: "stock", exchange: "TSX", tvSymbol: "TSX:BCE",  description: "Track BCE (BCE) with live chart, technical analysis, financials, and news. Canada's largest communications company operating Bell." },
  T:   { name: "TELUS Corporation",       type: "stock", exchange: "TSX", tvSymbol: "TSX:T",    description: "Track TELUS (T) with live chart, technical analysis, financials, and news. A major Canadian telecommunications company known for wireless and internet services." },
  // ── Canadian Tech & Consumer ──
  SHOP: { name: "Shopify Inc.",           type: "stock", exchange: "TSX", tvSymbol: "TSX:SHOP", description: "Track Shopify (SHOP) with live chart, technical analysis, financials, and news. Canada's leading e-commerce platform company, listed on both TSX and NYSE." },
  ATD:  { name: "Alimentation Couche-Tard", type: "stock", exchange: "TSX", tvSymbol: "TSX:ATD", description: "Track Couche-Tard (ATD) with live chart, technical analysis, financials, and news. One of the world's largest convenience store operators." },
  WPM:  { name: "Wheaton Precious Metals", type: "stock", exchange: "TSX", tvSymbol: "TSX:WPM", description: "Track Wheaton Precious Metals (WPM) with live chart, technical analysis, financials, and news. A major precious metals streaming company." },
  // ── US Tech ──
  AAPL:  { name: "Apple Inc.",             type: "stock", exchange: "NASDAQ", tvSymbol: "NASDAQ:AAPL",  description: "Track Apple (AAPL) with live chart, technical analysis, financials, and news. One of the world's most valuable companies, maker of iPhone, Mac, and services." },
  MSFT:  { name: "Microsoft Corporation", type: "stock", exchange: "NASDAQ", tvSymbol: "NASDAQ:MSFT",  description: "Track Microsoft (MSFT) with live chart, technical analysis, financials, and news. A global technology leader in cloud computing, productivity software, and AI." },
  NVDA:  { name: "Nvidia Corporation",    type: "stock", exchange: "NASDAQ", tvSymbol: "NASDAQ:NVDA",  description: "Track Nvidia (NVDA) with live chart, technical analysis, financials, and news. The leading GPU and AI chip maker powering data centres worldwide." },
  AMZN:  { name: "Amazon.com Inc.",       type: "stock", exchange: "NASDAQ", tvSymbol: "NASDAQ:AMZN",  description: "Track Amazon (AMZN) with live chart, technical analysis, financials, and news. The world's largest e-commerce and cloud computing company." },
  GOOGL: { name: "Alphabet Inc.",         type: "stock", exchange: "NASDAQ", tvSymbol: "NASDAQ:GOOGL", description: "Track Alphabet/Google (GOOGL) with live chart, technical analysis, financials, and news. Parent company of Google, YouTube, and a leading AI and cloud business." },
  META:  { name: "Meta Platforms",        type: "stock", exchange: "NASDAQ", tvSymbol: "NASDAQ:META",  description: "Track Meta (META) with live chart, technical analysis, financials, and news. Owner of Facebook, Instagram, and WhatsApp with major investments in AI and VR." },
  TSLA:  { name: "Tesla Inc.",            type: "stock", exchange: "NASDAQ", tvSymbol: "NASDAQ:TSLA",  description: "Track Tesla (TSLA) with live chart, technical analysis, financials, and news. The world's leading electric vehicle and energy storage company." },
  // ── US ETFs ──
  SPY: { name: "SPDR S&P 500 ETF Trust",   type: "ETF", exchange: "NYSE Arca", tvSymbol: "AMEX:SPY",      description: "Track SPY with live chart and analysis. The most widely traded ETF, tracking the S&P 500 index of large-cap US stocks." },
  QQQ: { name: "Invesco QQQ Trust",         type: "ETF", exchange: "NASDAQ",   tvSymbol: "NASDAQ:QQQ",    description: "Track QQQ with live chart and analysis. Tracks the NASDAQ-100, concentrated in large-cap US tech and growth companies." },
  VTI: { name: "Vanguard Total Stock Market ETF", type: "ETF", exchange: "NYSE Arca", tvSymbol: "AMEX:VTI", description: "Track VTI with live chart and analysis. Vanguard's total US stock market ETF covering large, mid, and small cap stocks." },
  VOO: { name: "Vanguard S&P 500 ETF",      type: "ETF", exchange: "NYSE Arca", tvSymbol: "AMEX:VOO",     description: "Track VOO with live chart and analysis. Vanguard's S&P 500 ETF, one of the lowest-cost ways to own the US market." },
  // ── Canadian ETFs ──
  "XEQT.TO": { name: "iShares Core Equity ETF Portfolio",     type: "ETF", exchange: "TSX", tvSymbol: "TSX:XEQT", description: "Track XEQT with live chart and analysis. A one-fund all-equity portfolio by iShares, popular for Canadian TFSA and RRSP investors." },
  "VEQT.TO": { name: "Vanguard All-Equity ETF Portfolio",      type: "ETF", exchange: "TSX", tvSymbol: "TSX:VEQT", description: "Track VEQT with live chart and analysis. Vanguard's one-ticket all-equity ETF for globally diversified Canadian investors." },
  "XGRO.TO": { name: "iShares Core Growth ETF Portfolio",      type: "ETF", exchange: "TSX", tvSymbol: "TSX:XGRO", description: "Track XGRO with live chart and analysis. An 80/20 growth-oriented balanced ETF by iShares, widely used in registered accounts." },
  "VGRO.TO": { name: "Vanguard Growth ETF Portfolio",          type: "ETF", exchange: "TSX", tvSymbol: "TSX:VGRO", description: "Track VGRO with live chart and analysis. Vanguard's 80/20 growth ETF — a popular one-fund solution for Canadian investors." },
  "XBAL.TO": { name: "iShares Core Balanced ETF Portfolio",    type: "ETF", exchange: "TSX", tvSymbol: "TSX:XBAL", description: "Track XBAL with live chart and analysis. iShares balanced 60/40 ETF suited for moderate risk Canadian investors." },
  "VFV.TO":  { name: "Vanguard S&P 500 Index ETF (CAD)",       type: "ETF", exchange: "TSX", tvSymbol: "TSX:VFV",  description: "Track VFV with live chart and analysis. Vanguard's TSX-listed S&P 500 ETF, one of the most popular US equity funds for Canadians." },
  "ZSP.TO":  { name: "BMO S&P 500 Index ETF",                  type: "ETF", exchange: "TSX", tvSymbol: "TSX:ZSP",  description: "Track ZSP with live chart and analysis. BMO's TSX-listed S&P 500 ETF, a common alternative to VFV for Canadian investors." },
  "XIU.TO":  { name: "iShares S&P/TSX 60 Index ETF",           type: "ETF", exchange: "TSX", tvSymbol: "TSX:XIU",  description: "Track XIU with live chart and analysis. Canada's first and most traded ETF, tracking the 60 largest companies on the TSX." },
  "VDY.TO":  { name: "Vanguard FTSE Canadian High Dividend Yield ETF", type: "ETF", exchange: "TSX", tvSymbol: "TSX:VDY", description: "Track VDY with live chart and analysis. A dividend-focused Canadian ETF holding high-yield TSX stocks, popular for income investors." },
  "XDV.TO":  { name: "iShares Canadian Select Dividend ETF",   type: "ETF", exchange: "TSX", tvSymbol: "TSX:XDV",  description: "Track XDV with live chart and analysis. iShares' dividend ETF focused on Canadian companies with strong dividend growth records." },
  "ZWB.TO":  { name: "BMO Covered Call Canadian Banks ETF",    type: "ETF", exchange: "TSX", tvSymbol: "TSX:ZWB",  description: "Track ZWB with live chart and analysis. A covered-call ETF on the Big Six Canadian banks, offering enhanced monthly income." },
  "VCN.TO":  { name: "Vanguard FTSE Canada All Cap Index ETF", type: "ETF", exchange: "TSX", tvSymbol: "TSX:VCN",  description: "Track VCN with live chart and analysis. Vanguard's broad Canadian equity ETF covering large, mid, and small-cap TSX stocks." },
  "XIC.TO":  { name: "iShares Core S&P/TSX Capped Composite Index ETF", type: "ETF", exchange: "TSX", tvSymbol: "TSX:XIC", description: "Track XIC with live chart and analysis. iShares' comprehensive Canadian equity ETF tracking the TSX Composite." },
  "CASH.TO": { name: "Global X High Interest Savings ETF",     type: "ETF", exchange: "TSX", tvSymbol: "TSX:CASH", description: "Track CASH.TO with live chart and analysis. A high-interest savings ETF holding deposits at major Canadian banks — used as a cash alternative inside registered accounts." },
  "CSAV.TO": { name: "CI High Interest Savings ETF",           type: "ETF", exchange: "TSX", tvSymbol: "TSX:CSAV", description: "Track CSAV.TO with live chart and analysis. CI's high-interest savings ETF, an alternative to CASH.TO for parking cash inside a TFSA or RRSP." },
  "HDIV.TO": { name: "Hamilton Enhanced Multi-Sector Covered Call ETF", type: "ETF", exchange: "TSX", tvSymbol: "TSX:HDIV", description: "Track HDIV with live chart and analysis. A leveraged covered-call ETF targeting high monthly distributions from a diversified portfolio." },
  // ── Crypto ──
  "BTC-USD":  { name: "Bitcoin",   type: "crypto", exchange: "Crypto", tvSymbol: "BINANCE:BTCUSDT",  description: "Track Bitcoin (BTC) price with live chart, technical analysis, and news. The world's largest cryptocurrency by market capitalization." },
  "ETH-USD":  { name: "Ethereum",  type: "crypto", exchange: "Crypto", tvSymbol: "BINANCE:ETHUSDT",  description: "Track Ethereum (ETH) price with live chart, technical analysis, and news. The leading smart contract blockchain and second-largest crypto by market cap." },
  "SOL-USD":  { name: "Solana",    type: "crypto", exchange: "Crypto", tvSymbol: "BINANCE:SOLUSDT",  description: "Track Solana (SOL) price with live chart, technical analysis, and news. A high-throughput proof-of-stake blockchain known for fast transactions and low fees." },
  "XRP-USD":  { name: "XRP",       type: "crypto", exchange: "Crypto", tvSymbol: "BINANCE:XRPUSDT",  description: "Track XRP price with live chart, technical analysis, and news. The native asset of the XRP Ledger, primarily used for fast cross-border payments." },
  "BNB-USD":  { name: "BNB",       type: "crypto", exchange: "Crypto", tvSymbol: "BINANCE:BNBUSDT",  description: "Track BNB price with live chart, technical analysis, and news. The native token of BNB Chain, originally launched by the Binance exchange." },
  "DOGE-USD": { name: "Dogecoin",  type: "crypto", exchange: "Crypto", tvSymbol: "BINANCE:DOGEUSDT", description: "Track Dogecoin (DOGE) price with live chart, technical analysis, and news. One of the original meme coins with a large retail following." },
  "GC=F": { name: "Gold", type: "commodity", exchange: "Commodity", tvSymbol: "TVC:GOLD", shortLabel: "Gold", description: "Track gold price with a live chart, technical analysis, and market headlines. Useful for watching safe-haven flows, inflation expectations, and commodity momentum." },
  "SI=F": { name: "Silver", type: "commodity", exchange: "Commodity", tvSymbol: "TVC:SILVER", shortLabel: "Silver", description: "Track silver price with a live chart, technical analysis, and market headlines. Silver often moves with both precious-metals sentiment and industrial demand." },
  "CL=F": { name: "WTI Crude Oil", type: "commodity", exchange: "Commodity", tvSymbol: "TVC:USOIL", shortLabel: "WTI Oil", description: "Track WTI crude oil with a live chart, technical analysis, and headlines. This is one of the most watched energy benchmarks for North American markets." },
  "BZ=F": { name: "Brent Crude Oil", type: "commodity", exchange: "Commodity", tvSymbol: "TVC:UKOIL", shortLabel: "Brent", description: "Track Brent crude oil with a live chart, technical analysis, and headlines. Brent is a major global oil benchmark used across international energy markets." },
  "NG=F": { name: "Natural Gas", type: "commodity", exchange: "Commodity", tvSymbol: "NYMEX:NG1!", shortLabel: "Nat Gas", description: "Track natural gas with a live chart, technical analysis, and headlines. Natural gas is a volatile energy commodity tied to weather, storage, and industrial demand." },
  "HG=F": { name: "Copper", type: "commodity", exchange: "Commodity", tvSymbol: "COMEX:HG1!", shortLabel: "Copper", description: "Track copper with a live chart, technical analysis, and headlines. Copper is often watched as a global growth and industrial-demand barometer." },
  "CAD=X": { name: "USD/CAD", type: "forex", exchange: "FX", tvSymbol: "FX:USDCAD", shortLabel: "USD/CAD", description: "Track USD/CAD with a live chart, technical analysis, and headlines. This pair is useful for Canadians watching the loonie against the US dollar." },
  "EURUSD=X": { name: "EUR/USD", type: "forex", exchange: "FX", tvSymbol: "FX:EURUSD", shortLabel: "EUR/USD", description: "Track EUR/USD with a live chart, technical analysis, and headlines. This is the world's most traded currency pair." },
  "GBPUSD=X": { name: "GBP/USD", type: "forex", exchange: "FX", tvSymbol: "FX:GBPUSD", shortLabel: "GBP/USD", description: "Track GBP/USD with a live chart, technical analysis, and headlines. This pair is closely watched for UK and US macro signals." },
  "JPY=X": { name: "USD/JPY", type: "forex", exchange: "FX", tvSymbol: "FX:USDJPY", shortLabel: "USD/JPY", description: "Track USD/JPY with a live chart, technical analysis, and headlines. It is one of the most liquid and macro-sensitive FX pairs." },
  "AUDUSD=X": { name: "AUD/USD", type: "forex", exchange: "FX", tvSymbol: "FX:AUDUSD", shortLabel: "AUD/USD", description: "Track AUD/USD with a live chart, technical analysis, and headlines. This pair often reflects commodity demand and broader risk appetite." },
  "CHF=X": { name: "USD/CHF", type: "forex", exchange: "FX", tvSymbol: "FX:USDCHF", shortLabel: "USD/CHF", description: "Track USD/CHF with a live chart, technical analysis, and headlines. This pair is often watched during risk-off moves and central-bank shifts." },
};

// ─── TSX ticker set for symbol resolution ────────────────────────────────────

const TSX_TICKERS = new Set([
  "RY", "TD", "ENB", "CNR", "CP", "BNS", "MFC", "SU", "BMO", "ABX",
  "CM", "CNQ", "TRP", "PPL", "FTS", "POW", "IFC", "T", "BCE", "SHOP",
  "RCI", "MG", "L", "EMA", "KEY", "AEM", "PKI", "GWO", "WN", "ATD",
  "CVE", "IMO", "NTR", "WPM", "BHC", "CAR", "CTC", "MRU", "EMP",
  "XEQT", "VEQT", "XGRO", "VGRO", "XBAL", "VFV", "ZSP", "XIU",
  "VDY", "XDV", "ZWB", "CASH", "CSAV", "HDIV", "ZCN", "XIC", "VCN",
]);

const CRYPTO_MAP = {
  BTC: "BTC-USD", ETH: "ETH-USD", SOL: "SOL-USD", XRP: "XRP-USD",
  DOGE: "DOGE-USD", BNB: "BNB-USD", ADA: "ADA-USD", AVAX: "AVAX-USD",
  DOT: "DOT-USD", MATIC: "MATIC-USD", SHIB: "SHIB-USD", LTC: "LTC-USD",
  LINK: "LINK-USD", UNI: "UNI-USD", ATOM: "ATOM-USD", XLM: "XLM-USD",
  BCH: "BCH-USD", NEAR: "NEAR-USD", ICP: "ICP-USD", APT: "APT-USD",
  ARB: "ARB-USD", OP: "OP-USD", SUI: "SUI-USD", TRX: "TRX-USD", INJ: "INJ-USD",
};

const SEARCH_SHORTCUT_MAP = {
  GOLD: "GC=F",
  SILVER: "SI=F",
  OIL: "CL=F",
  WTI: "CL=F",
  BRENT: "BZ=F",
  NATGAS: "NG=F",
  NATURALGAS: "NG=F",
  NATURAL_GAS: "NG=F",
  COPPER: "HG=F",
  USDCAD: "CAD=X",
  "USD/CAD": "CAD=X",
  EURUSD: "EURUSD=X",
  "EUR/USD": "EURUSD=X",
  GBPUSD: "GBPUSD=X",
  "GBP/USD": "GBPUSD=X",
  USDJPY: "JPY=X",
  "USD/JPY": "JPY=X",
  AUDUSD: "AUDUSD=X",
  "AUD/USD": "AUDUSD=X",
  USDCHF: "CHF=X",
  "USD/CHF": "CHF=X",
};

function normalizeSearchTicker(value) {
  const cleaned = String(value || "").trim().toUpperCase();
  if (!cleaned) return "";
  return SEARCH_SHORTCUT_MAP[cleaned] || SEARCH_SHORTCUT_MAP[cleaned.replace(/\s+/g, "")] || cleaned;
}

function shortSymbolLabel(symbol) {
  const meta = SYMBOL_METADATA[symbol];
  if (meta?.shortLabel) return meta.shortLabel;
  return symbol.replace(".TO", "").replace("-USD", "");
}

function toTVSymbol(ticker) {
  if (!ticker) return "";
  if (SYMBOL_METADATA[ticker]?.tvSymbol) return SYMBOL_METADATA[ticker].tvSymbol;
  if (ticker.endsWith("-USD") || ticker.endsWith("-USDT")) {
    const base = ticker.replace(/-USD$/, "").replace(/-USDT$/, "");
    return `BINANCE:${base}USDT`;
  }
  if (ticker.endsWith(".TO")) return `TSX:${ticker.replace(/\.TO$/, "")}`;
  if (TSX_TICKERS.has(ticker)) return `TSX:${ticker}`;
  return ticker;
}

const TYPE_BADGE = {
  CRYPTOCURRENCY: { label: "Crypto", cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  ETF:            { label: "ETF",    cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  EQUITY:         { label: "Stock",  cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  MUTUALFUND:     { label: "Fund",   cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  FUTURE:         { label: "Commodity", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  CURRENCY:       { label: "FX", cls: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300" },
};

const FUND_FALLBACK_RESOURCES = [
  { title: "Best ETFs for a TFSA",     body: "Compare XEQT, VEQT, XGRO, and dividend ETFs for registered accounts.", href: "/blog/best-etfs-for-tfsa-canada-2026" },
  { title: "Weekly dividend ETFs",     body: "Understand covered-call ETFs and high-yield products before relying on them.", href: "/blog/weekly-dividend-etfs" },
  { title: "Dividend calculator",      body: "Model income and DRIP scenarios for dividend ETFs or stocks.", href: "/tools/dividend-calculator" },
];

const RELATED_COMPARE_MAP = {
  "XEQT.TO": ["XEQT vs VEQT", "XGRO vs VGRO", "VFV vs ZSP"],
  "VEQT.TO": ["XEQT vs VEQT", "XGRO vs VGRO", "VFV vs ZSP"],
  "XGRO.TO": ["XGRO vs VGRO", "XEQT vs VEQT", "VFV vs ZSP"],
  "VGRO.TO": ["XGRO vs VGRO", "XEQT vs VEQT", "VFV vs ZSP"],
  "VFV.TO": ["VFV vs ZSP", "XEQT vs VEQT", "VDY vs XDV"],
  "ZSP.TO": ["VFV vs ZSP", "XEQT vs VEQT", "VDY vs XDV"],
  RY: ["RY vs TD", "BNS vs BMO"],
  TD: ["RY vs TD", "BNS vs BMO"],
  BNS: ["BNS vs BMO", "RY vs TD"],
  BMO: ["BNS vs BMO", "RY vs TD"],
  "VDY.TO": ["VDY vs XDV", "XEQT vs VEQT"],
  "XDV.TO": ["VDY vs XDV", "XEQT vs VEQT"],
};

const RELATED_ALTERNATIVES_MAP = {
  "XEQT.TO": ["VEQT.TO", "XGRO.TO", "VGRO.TO", "VFV.TO"],
  "VEQT.TO": ["XEQT.TO", "XGRO.TO", "VGRO.TO", "VFV.TO"],
  "XGRO.TO": ["VGRO.TO", "XEQT.TO", "VEQT.TO", "XBAL.TO"],
  "VGRO.TO": ["XGRO.TO", "XEQT.TO", "VEQT.TO", "XBAL.TO"],
  "VFV.TO": ["ZSP.TO", "XIU.TO", "XEQT.TO", "VEQT.TO"],
  "ZSP.TO": ["VFV.TO", "XIU.TO", "XEQT.TO", "VEQT.TO"],
  "VDY.TO": ["XDV.TO", "ZWB.TO", "HDIV.TO", "XIU.TO"],
  "XDV.TO": ["VDY.TO", "ZWB.TO", "HDIV.TO", "XIU.TO"],
  "ZWB.TO": ["HDIV.TO", "VDY.TO", "XDV.TO", "BMO"],
  "HDIV.TO": ["ZWB.TO", "VDY.TO", "XDV.TO", "CASH.TO"],
  RY: ["TD", "BNS", "BMO", "CM"],
  TD: ["RY", "BNS", "BMO", "CM"],
  BNS: ["BMO", "RY", "TD", "CM"],
  BMO: ["BNS", "RY", "TD", "CM"],
  CM: ["RY", "TD", "BNS", "BMO"],
  ENB: ["TRP", "SU", "CNQ", "BCE"],
  TRP: ["ENB", "SU", "CNQ", "BCE"],
  BCE: ["T", "ENB", "RY", "VDY.TO"],
  T: ["BCE", "RY", "VDY.TO", "XDV.TO"],
  AAPL: ["MSFT", "NVDA", "QQQ", "SPY"],
  MSFT: ["AAPL", "NVDA", "QQQ", "SPY"],
  NVDA: ["MSFT", "AAPL", "QQQ", "SPY"],
  AMZN: ["GOOGL", "META", "QQQ", "SPY"],
  GOOGL: ["AMZN", "META", "QQQ", "SPY"],
  META: ["GOOGL", "AMZN", "QQQ", "SPY"],
  TSLA: ["NVDA", "AAPL", "QQQ", "SPY"],
  SPY: ["QQQ", "VOO", "VTI", "VFV.TO"],
  QQQ: ["SPY", "VTI", "VOO", "VFV.TO"],
  VTI: ["SPY", "VOO", "QQQ", "XEQT.TO"],
  VOO: ["SPY", "VTI", "QQQ", "VFV.TO"],
  "BTC-USD": ["ETH-USD", "SOL-USD", "BNB-USD", "XRP-USD"],
  "ETH-USD": ["BTC-USD", "SOL-USD", "BNB-USD", "XRP-USD"],
  "SOL-USD": ["ETH-USD", "BTC-USD", "XRP-USD", "BNB-USD"],
  "XRP-USD": ["BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD"],
  "GC=F": ["SI=F", "CL=F", "BZ=F", "HG=F"],
  "SI=F": ["GC=F", "HG=F", "CL=F", "NG=F"],
  "CL=F": ["BZ=F", "NG=F", "GC=F", "SI=F"],
  "BZ=F": ["CL=F", "NG=F", "GC=F", "SI=F"],
  "NG=F": ["CL=F", "BZ=F", "GC=F", "HG=F"],
  "HG=F": ["GC=F", "SI=F", "CL=F", "BZ=F"],
  "CAD=X": ["EURUSD=X", "GBPUSD=X", "JPY=X", "AUDUSD=X"],
  "EURUSD=X": ["GBPUSD=X", "CAD=X", "JPY=X", "CHF=X"],
  "GBPUSD=X": ["EURUSD=X", "CAD=X", "JPY=X", "CHF=X"],
  "JPY=X": ["CAD=X", "EURUSD=X", "GBPUSD=X", "CHF=X"],
  "AUDUSD=X": ["CAD=X", "EURUSD=X", "GBPUSD=X", "CL=F"],
  "CHF=X": ["EURUSD=X", "GBPUSD=X", "JPY=X", "CAD=X"],
};

function SymbolChip({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-left text-sm transition hover:border-secondary hover:bg-blue-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-700"
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-primary dark:text-white">{item.label || shortSymbolLabel(item.t)}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {item.market}
        </span>
      </div>
      <div className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{item.n}</div>
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
      {children}
    </p>
  );
}

function getTickerMeta(currentTicker, tvSymbol, isCrypto) {
  const known = currentTicker ? SYMBOL_METADATA[currentTicker] : null;
  const displayName = known?.name || currentTicker || "Market";
  const assetLabel = known?.type || (isCrypto ? "crypto" : "stock");
  const exchangeLabel = known?.exchange || (tvSymbol?.startsWith("TSX:") ? "TSX" : "market");

  return {
    displayName,
    assetLabel,
    exchangeLabel,
    pageTitle: known
      ? `${known.name} (${currentTicker}) ${known.type === "ETF" ? "ETF" : known.type === "crypto" ? "Price" : known.type === "commodity" ? "Commodity Price" : known.type === "forex" ? "Currency Chart" : "Stock"} Chart, News and Analysis`
      : `${currentTicker} ${isCrypto ? "Price" : "Chart"} News and Analysis`,
    description: known?.description || `Live ${currentTicker} chart, technical analysis, financials, and latest news on EasyFinanceTools.`,
  };
}

function getRelatedComparisons(currentTicker) {
  const labels = RELATED_COMPARE_MAP[currentTicker] || [];
  return labels
    .map((label) => COMPARISON_PRESETS.find((preset) => preset.label === label))
    .filter(Boolean);
}

function buildSymbolChipItem(symbol) {
  const meta = SYMBOL_METADATA[symbol];
  return {
    t: symbol,
    n: meta?.name || symbol,
    market: meta?.exchange || (symbol.endsWith(".TO") ? "TSX" : symbol.endsWith("-USD") ? "Crypto" : "Market"),
    label: meta?.shortLabel,
  };
}

function getAlternativeSymbols(currentTicker, isCrypto, isFundLike, isCommodity, isForex) {
  const mapped = RELATED_ALTERNATIVES_MAP[currentTicker];
  if (mapped?.length) return mapped.map(buildSymbolChipItem);

  if (isCrypto) return POPULAR_CRYPTO.filter((item) => item.t !== currentTicker).slice(0, 4);
  if (isCommodity) return POPULAR_COMMODITIES.filter((item) => item.t !== currentTicker).slice(0, 4);
  if (isForex) return POPULAR_FOREX.filter((item) => item.t !== currentTicker).slice(0, 4);
  if (isFundLike) return POPULAR_ETFS_CA.filter((item) => item.t !== currentTicker).slice(0, 4);
  return POPULAR_STOCKS_CA.filter((item) => item.t !== currentTicker).slice(0, 4);
}

function normalizeAssetLabel(quoteType, fallbackLabel, isCrypto) {
  if (isCrypto) return "crypto";
  const type = String(quoteType || "").toUpperCase();
  if (type === "ETF") return "ETF";
  if (["MUTUALFUND", "MUTUAL FUND", "CLOSED_END_FUND"].includes(type)) return "fund";
  if (type === "CRYPTOCURRENCY") return "crypto";
  if (type === "FUTURE") return "commodity";
  if (type === "CURRENCY") return "forex";
  return fallbackLabel;
}

export default function StockPage({ view = "overview" }) {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [marketMovers, setMarketMovers] = useState({ gainers: [], losers: [], active: [] });
  const [moversLoading, setMoversLoading] = useState(false);
  const [macroRates, setMacroRates] = useState({ commodities: [], currencies: [] });
  const [macroRatesLoading, setMacroRatesLoading] = useState(false);
  const [topNews, setTopNews] = useState([]);
  const [topNewsLoading, setTopNewsLoading] = useState(false);
  const [dividendData, setDividendData] = useState(null);
  const [dividendLoading, setDividendLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("watchlist") || "[]"); } catch { return []; }
  });

  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    const updateMobileView = () => setIsMobileView(window.innerWidth < 768);
    updateMobileView();
    window.addEventListener("resize", updateMobileView);
    return () => window.removeEventListener("resize", updateMobileView);
  }, []);

  const currentTicker = ticker?.toUpperCase();
  const isWatched = watchlist.some((item) => item.t === currentTicker);
  const isCrypto = Boolean(currentTicker && (currentTicker.endsWith("-USD") || currentTicker.endsWith("-USDT")));
  const tvSymbol = toTVSymbol(currentTicker);
  const tickerMeta = getTickerMeta(currentTicker, tvSymbol, isCrypto);
  const assetLabel = normalizeAssetLabel(stockData?.quoteType, tickerMeta.assetLabel, isCrypto);
  const isCommodity = assetLabel === "commodity";
  const isForex = assetLabel === "forex";
  const isMacroAsset = isCommodity || isForex;
  const isFundLike = assetLabel === "ETF" || assetLabel === "fund";
  const comparePreset = currentTicker
    ? COMPARISON_PRESETS.find((preset) => preset.left === currentTicker || preset.right === currentTicker)
    : null;
  const relatedComparisons = currentTicker ? getRelatedComparisons(currentTicker) : [];
  const alternativeSymbols = currentTicker ? getAlternativeSymbols(currentTicker, isCrypto, isFundLike, isCommodity, isForex) : [];
  const quoteDirectionClass = Number(stockData?.changePct || 0) >= 0 ? "text-emerald-500" : "text-red-500";
  const quickStats = stockData
    ? [
        { label: "Open", value: formatStatValue(stockData.open, stockData.currency, isForex) },
        { label: "Prev close", value: formatStatValue(stockData.prevClose, stockData.currency, isForex) },
        { label: "Day range", value: stockData.dayLow && stockData.dayHigh ? `${stockData.dayLow} - ${stockData.dayHigh}` : "N/A" },
        { label: "52-week range", value: stockData.weekLow52 && stockData.weekHigh52 ? `${stockData.weekLow52} - ${stockData.weekHigh52}` : "N/A" },
        { label: "Volume", value: stockData.volume || "N/A" },
        { label: "Avg volume", value: stockData.avgVolume || "N/A" },
        { label: isFundLike ? "AUM / size" : isMacroAsset ? "Market type" : "Market cap", value: isMacroAsset ? tickerMeta.exchangeLabel : stockData.marketCap || "N/A" },
        { label: isFundLike ? "Yield" : isMacroAsset ? "Currency" : "Dividend yield", value: stockData.dividendYield || stockData.currency || "N/A" },
      ]
    : [];
  const valuationStats = stockData
    ? [
        { label: "Trailing PE", value: stockData.trailingPE || "N/A" },
        { label: "Forward PE", value: stockData.forwardPE || "N/A" },
        { label: "EPS", value: stockData.eps || "N/A" },
        { label: "Beta", value: stockData.beta || "N/A" },
        { label: "Sector", value: stockData.sector || "N/A" },
        { label: "Industry", value: stockData.industry || "N/A" },
      ]
    : [];
  const dividendSectionVisible = !isCrypto && !isMacroAsset && Boolean(stockData);
  const dividendLabel = stockData?.dividendYield && stockData.dividendYield !== "N/A" ? stockData.dividendYield : "No yield data";
  const dividendProfileLabel = isFundLike
    ? "ETF income profile"
    : stockData?.dividendYield && stockData.dividendYield !== "N/A"
      ? "Dividend-paying stock"
      : "Low or no current dividend";
  const isDividendView = view === "dividend";
  const dividendSummary = dividendData?.summary || null;
  const dividendHistory = dividendData?.history || [];
  const latestDividendCards = useMemo(
    () => [
      { label: "Dividend yield", value: dividendSummary?.dividendYield || "N/A" },
      { label: "Annual dividend", value: dividendSummary?.annualDividend || "N/A" },
      { label: "Ex-dividend date", value: dividendSummary?.exDividendDate || "N/A" },
      { label: "Payout frequency", value: dividendSummary?.payoutFrequency || "N/A" },
      { label: "Payout ratio", value: dividendSummary?.payoutRatio || "N/A" },
      { label: "Dividend growth", value: dividendSummary?.dividendGrowth || "N/A" },
    ],
    [dividendSummary]
  );

  const toggleWatch = (symbol, name) => {
    setWatchlist((prev) =>
      prev.some((item) => item.t === symbol)
        ? prev.filter((item) => item.t !== symbol)
        : [...prev, { t: symbol, n: name || symbol }]
    );
  };

  useEffect(() => {
    if (!currentTicker) return;
    if (CRYPTO_MAP[currentTicker]) {
      navigate(`/stocks/${CRYPTO_MAP[currentTicker]}`, { replace: true });
      return;
    }
    setAiSummary("");
    fetchAiSummary(currentTicker);
    fetchStockData(currentTicker);
  }, [currentTicker, navigate]);

  useEffect(() => {
    if (!currentTicker || isCrypto || isMacroAsset) {
      setDividendData(null);
      return;
    }
    fetchDividendData(currentTicker);
  }, [currentTicker, isCrypto, isMacroAsset]);

  useEffect(() => {
    if (currentTicker) return;
    fetchLandingMovers();
    fetchMacroRates();
    fetchTopNews();
  }, [currentTicker]);

  const fetchAiSummary = async (symbol) => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: symbol }),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) { setAiLoading(false); return; }
      const data = await response.json();
      if (data?.summary) setAiSummary(data.summary);
    } catch { /* optional */ }
    setAiLoading(false);
  };

  const fetchStockData = async (symbol) => {
    setStockLoading(true);
    setNewsLoading(true);
    setStockData(null);
    setNewsItems([]);
    try {
      const response = await fetch(`/api/stock?ticker=${encodeURIComponent(symbol)}`);
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) { setNewsLoading(false); return; }
      const data = await response.json();
      setStockData(data?.stock || null);
      const items = Array.isArray(data?.news) ? data.news : [];
      setNewsItems(items.slice(0, 8));
    } catch { /* optional */ }
    setStockLoading(false);
    setNewsLoading(false);
  };

  const fetchLandingMovers = async () => {
    setMoversLoading(true);
    try {
      const response = await fetch("/api/market-movers");
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) throw new Error("Invalid movers response");
      const data = await response.json();
      setMarketMovers({
        gainers: Array.isArray(data?.gainers) ? data.gainers : [],
        losers: Array.isArray(data?.losers) ? data.losers : [],
        active: Array.isArray(data?.active) ? data.active : [],
      });
    } catch {
      setMarketMovers({ gainers: [], losers: [], active: [] });
    }
    setMoversLoading(false);
  };

  const fetchTopNews = async () => {
    setTopNewsLoading(true);
    try {
      const response = await fetch("/api/top-news");
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) throw new Error("Invalid top news response");
      const data = await response.json();
      setTopNews(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setTopNews([]);
    }
    setTopNewsLoading(false);
  };

  const fetchDividendData = async (symbol) => {
    setDividendLoading(true);
    try {
      const response = await fetch(`/api/dividend?ticker=${encodeURIComponent(symbol)}`);
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) throw new Error("Invalid dividend response");
      const data = await response.json();
      setDividendData(data || null);
    } catch {
      setDividendData(null);
    }
    setDividendLoading(false);
  };

  const fetchMacroRates = async () => {
    setMacroRatesLoading(true);
    try {
      const response = await fetch("/api/macro-rates");
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) throw new Error("Invalid macro-rates response");
      const data = await response.json();
      setMacroRates({
        commodities: Array.isArray(data?.commodities) ? data.commodities : [],
        currencies: Array.isArray(data?.currencies) ? data.currencies : [],
      });
    } catch {
      setMacroRates({ commodities: [], currencies: [] });
    }
    setMacroRatesLoading(false);
  };

  const handleSearchInput = (value) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    if (!value.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return;
        const data = await response.json();
        const results = data.results || [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch { /* optional */ }
    }, 280);
  };

  const handleSelectSuggestion = (symbol) => {
    setSearch(""); setSuggestions([]); setShowSuggestions(false);
    navigate(`/stocks/${symbol}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const value = normalizeSearchTicker(search);
    if (!value) return;
    navigate(`/stocks/${value}`);
    setSearch(""); setSuggestions([]); setShowSuggestions(false);
  };

  const showTradingViewFinancials = !isCrypto && !isFundLike && !isMacroAsset && !isMobileView;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title={currentTicker ? tickerMeta.pageTitle : "Stocks, ETFs, Commodities and Currency Charts — Canada & US"}
        description={
          currentTicker
            ? isDividendView
              ? `Dividend information, payout history, and dividend metrics for ${tickerMeta.displayName} (${currentTicker}).`
              : tickerMeta.description
            : "Free live charts, technical analysis, and news for Canadian and US stocks, TSX ETFs, commodities, major currency pairs, and crypto. Track gold, silver, oil, USD/CAD, RY, XEQT, BTC and more."
        }
        canonical={
          currentTicker
            ? `https://easyfinancetools.com/stocks/${currentTicker}${isDividendView ? "/dividend" : ""}`
            : "https://easyfinancetools.com/stocks"
        }
        robots="index,follow,max-image-preview:large"
      />

      {currentTicker && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebPage",
                  name: isDividendView ? `${tickerMeta.displayName} Dividend Information` : tickerMeta.pageTitle,
                  description: isDividendView
                    ? `Dividend information, payout history, and dividend metrics for ${tickerMeta.displayName} (${currentTicker}).`
                    : tickerMeta.description,
                  url: `https://easyfinancetools.com/stocks/${currentTicker}${isDividendView ? "/dividend" : ""}`,
                  about: {
                    "@type": assetLabel === "crypto" || isMacroAsset ? "Thing" : isFundLike ? "InvestmentFund" : "Corporation",
                    name: tickerMeta.displayName,
                    tickerSymbol: currentTicker,
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home",   item: "https://easyfinancetools.com/" },
                    { "@type": "ListItem", position: 2, name: "Stocks", item: "https://easyfinancetools.com/stocks" },
                    { "@type": "ListItem", position: 3, name: `${tickerMeta.displayName} (${currentTicker})`, item: `https://easyfinancetools.com/stocks/${currentTicker}` },
                    ...(isDividendView ? [{ "@type": "ListItem", position: 4, name: "Dividends", item: `https://easyfinancetools.com/stocks/${currentTicker}/dividend` }] : []),
                  ],
                },
              ],
            }),
          }}
        />
      )}

      {/* ── Hero / Search bar ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Canadian &amp; US markets
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            {currentTicker ? tickerMeta.displayName : "Stocks, ETFs, Commodities & FX"}
          </h1>
          <p className="mb-6 text-sm text-blue-100 md:text-base">
            {currentTicker
              ? `Live chart, technical analysis, and news for ${currentTicker}`
              : "Live charts, technical analysis, and news for TSX, US markets, gold, silver, oil, major currency pairs, and crypto."}
          </p>

          <div ref={searchRef} className="relative mx-auto max-w-xl">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(event) => handleSearchInput(event.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search AAPL, RY, XEQT, Gold, Oil, USD/CAD..."
                className="flex-1 rounded-xl px-4 py-3 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-accent"
                autoComplete="off"
                aria-label="Search stocks, ETFs, commodities, currencies, or crypto"
              />
              <button
                type="submit"
                aria-label="Search"
                className="whitespace-nowrap rounded-xl bg-accent px-6 py-3 font-bold text-primary transition hover:bg-yellow-400"
              >
                Search
              </button>
            </form>

            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
                {suggestions.map((item) => {
                  const badge = TYPE_BADGE[item.type] || TYPE_BADGE.EQUITY;
                  return (
                    <button
                      key={item.symbol}
                      onMouseDown={() => handleSelectSuggestion(item.symbol)}
                      className="flex w-full items-center justify-between border-b border-gray-50 px-4 py-3 text-left transition last:border-0 hover:bg-blue-50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="shrink-0 text-sm font-bold text-primary">{item.symbol}</span>
                          <span className="truncate text-sm text-gray-500">{item.name}</span>
                        </div>
                      </div>
                      <div className="ml-2 flex shrink-0 items-center gap-1.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.cls}`}>{badge.label}</span>
                        <span className="text-xs text-gray-400">{item.exchange}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Landing page (no ticker selected) ────────────────────────────── */}
        {!currentTicker && (
        <div className="mx-auto max-w-5xl px-4 py-10">

          <div className="mb-10">
            <SectionLabel>Market movers</SectionLabel>
            <div className="grid gap-4 lg:grid-cols-3">
              <MoversPanel
                title="Top gainers"
                items={marketMovers.gainers}
                loading={moversLoading}
                emptyLabel="No gainers available right now."
                tone="positive"
                onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
              />
              <MoversPanel
                title="Top losers"
                items={marketMovers.losers}
                loading={moversLoading}
                emptyLabel="No losers available right now."
                tone="negative"
                onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
              />
              <MoversPanel
                title="Most active"
                items={marketMovers.active}
                loading={moversLoading}
                emptyLabel="No active symbols available right now."
                tone="neutral"
                showVolume
                onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
              />
            </div>
          </div>

          <div className="mb-10 grid gap-4 lg:grid-cols-2">
            <RateCardSection
              title="Top 5 commodities"
              subtitle="Quick live prices for metals and energy benchmarks"
              items={macroRates.commodities}
              loading={macroRatesLoading}
              onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
            />
            <RateCardSection
              title="Top 5 currencies"
              subtitle="Major FX pairs with current rate and day move"
              items={macroRates.currencies}
              loading={macroRatesLoading}
              onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
            />
          </div>

          <div className="mb-10 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-gray-800">
            <div className="border-b border-blue-100 bg-blue-50/70 px-6 py-5 dark:border-blue-900/40 dark:bg-blue-900/10">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Live market news</span>
              </div>
              <div className="flex items-end justify-between gap-3">
              <div>
                <SectionLabel>Top stories</SectionLabel>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A quick market-news strip so the stocks hub feels live before users pick a ticker.
                </p>
              </div>
            </div>
            </div>
            <div className="px-6 py-5">
            {topNewsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, index) => <SkeletonLine key={index} cls="h-40 w-full" />)}
              </div>
            ) : topNews.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {topNews.slice(0, 4).map((item, index) => (
                  <a
                    key={`${item.link}-${index}`}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-slate-50 transition hover:-translate-y-0.5 hover:border-secondary hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                  >
                    {item.thumbnail ? (
                      <div className="aspect-[16/9] overflow-hidden border-b border-gray-200 bg-slate-200 dark:border-gray-700 dark:bg-slate-800">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">{item.publisher}</p>
                        <span className="shrink-0 text-xs text-gray-400">{item.providerPublishTime ? formatNewsDate(item.providerPublishTime) : ""}</span>
                      </div>
                      <p className="mt-3 line-clamp-4 text-base font-bold leading-7 text-primary dark:text-accent">{item.title}</p>
                      <p className="mt-3 text-xs font-semibold text-secondary">Open story →</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                Top stories are temporarily unavailable. Market movers above are still live.
              </div>
            )}
            </div>
          </div>

          {/* Watchlist */}
          {watchlist.length > 0 && (
            <div className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">Your watchlist</p>
                <button onClick={() => setWatchlist([])} className="text-xs text-gray-400 transition hover:text-red-500">
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchlist.map((item) => (
                  <div key={item.t} className="flex items-center gap-2 rounded-xl border border-yellow-300 bg-white pl-3 pr-2 py-1.5 dark:border-yellow-700 dark:bg-gray-800">
                    <button onClick={() => navigate(`/stocks/${item.t}`)} className="text-sm font-bold text-primary hover:underline dark:text-yellow-300">
                      {item.t}
                    </button>
                    <span className="hidden text-xs text-gray-500 sm:inline dark:text-gray-400">{item.n}</span>
                    <button onClick={() => toggleWatch(item.t)} aria-label={`Remove ${item.t}`} className="text-xs text-gray-400 transition hover:text-red-400">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <SectionLabel>Featured collections</SectionLabel>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {[
                  {
                    title: "Canadian bank stocks",
                    desc: "Track the Big Five and close peers from one collection page.",
                    href: "/stocks/tsx-bank-stocks",
                  },
                  {
                    title: "Canadian ETFs",
                    desc: "Browse all-in-one ETFs, TSX favourites, and broad-market funds.",
                    href: "/stocks/canadian-etfs",
                  },
                  {
                    title: "Dividend ETFs",
                    desc: "Explore income ETFs and covered-call ideas with deeper ticker pages.",
                    href: "/stocks/dividend-etfs",
                  },
                  {
                    title: "Covered-call ETFs",
                    desc: "Focus on income-oriented yield-maximizer and covered-call ETF ideas.",
                    href: "/stocks/covered-call-etfs",
                  },
                  {
                    title: "Canadian dividend stocks",
                    desc: "Browse established TSX dividend names across banks, telecom, and pipelines.",
                    href: "/stocks/canadian-dividend-stocks",
                  },
                  {
                    title: "Commodities",
                    desc: "Track gold, silver, WTI oil, Brent, natural gas, and copper from one market-watch section.",
                    href: "/stocks/GC=F",
                  },
                  {
                    title: "Currency charts",
                    desc: "Open USD/CAD, EUR/USD, GBP/USD, and other major FX pairs quickly.",
                    href: "/stocks/CAD=X",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigate(item.href)}
                    className="rounded-2xl border border-gray-200 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-secondary hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Collection</p>
                    <p className="mt-3 text-xl font-bold text-primary dark:text-accent">{item.title}</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <SectionLabel>Compare popular pairs</SectionLabel>
              <div className="space-y-3">
                {COMPARISON_PRESETS.slice(0, 4).map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(`/stocks/compare/${makeComparisonSlug(item.left, item.right)}`)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-left transition hover:border-secondary hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div>
                      <p className="font-semibold text-primary dark:text-accent">{item.label}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.blurb}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Open</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Interactive chart", desc: "Daily to multi-year history with adjustable intervals" },
              { title: "Technical analysis",desc: "Quick buy, sell, and neutral signals across timeframes" },
              { title: "Company profile",   desc: "Business overview, sector, and key fundamentals" },
              { title: "Latest news",       desc: "Symbol-specific headlines sourced in real time" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <p className="font-bold text-primary dark:text-accent">{f.title}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mb-10 space-y-8">
            <CuratedTickerSection
              title="Canadian stocks"
              subtitle="TSX blue chips and high-interest names"
              items={POPULAR_STOCKS_CA.slice(0, 10)}
              onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
              viewAllHref="/stocks/tsx-bank-stocks"
              viewAllLabel="View TSX bank stocks"
            />
            <CuratedTickerSection
              title="Canadian ETFs"
              subtitle="One-ticket ETFs, broad-market funds, and dividend ideas"
              items={POPULAR_ETFS_CA.slice(0, 10)}
              onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
              viewAllHref="/stocks/canadian-etfs"
              viewAllLabel="View Canadian ETFs"
            />
            <CuratedTickerSection
              title="US leaders"
              subtitle="Popular large-cap stocks and broad-market ETF shortcuts"
              items={[...POPULAR_STOCKS_US.slice(0, 5), ...POPULAR_ETFS_US.slice(0, 3)]}
              onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
              viewAllHref="/stocks/compare/xeqt-vs-veqt"
              viewAllLabel="Open compare pages"
            />
            <CuratedTickerSection
              title="Commodities"
              subtitle="Gold, silver, oil, natural gas, and copper inside the same research flow"
              items={POPULAR_COMMODITIES}
              onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
              viewAllHref="/stocks/GC=F"
              viewAllLabel="Open gold chart"
            />
            <CuratedTickerSection
              title="Currency charts"
              subtitle="Follow USD/CAD plus major FX pairs without leaving the same page pattern"
              items={POPULAR_FOREX}
              onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
              viewAllHref="/stocks/CAD=X"
              viewAllLabel="Open USD/CAD"
            />
            <CuratedTickerSection
              title="Crypto"
              subtitle="Major crypto assets tracked inside the same research flow"
              items={POPULAR_CRYPTO}
              onSelect={(symbol) => navigate(`/stocks/${symbol}`)}
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-primary dark:text-accent">Use a calculator alongside the chart</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Move from market research into planning tools and Canada-specific guides.
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { title: "Dividend calculator",   desc: "Model income and DRIP for dividend stocks and ETFs.",   href: "/tools/dividend-calculator" },
                { title: "Compound interest",      desc: "Project long-term ETF growth with monthly contributions.", href: "/tools/compound-interest-calculator" },
                { title: "Best ETFs for TFSA",     desc: "Compare XEQT, VEQT, XGRO, VFV and other popular options.", href: "/blog/best-etfs-for-tfsa-canada-2026" },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.href)}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-secondary hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <p className="font-semibold text-primary dark:text-accent">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {false && (
            <>

          {/* Canadian stocks */}
          <div className="mb-8">
            <SectionLabel>Popular Canadian stocks — TSX</SectionLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {POPULAR_STOCKS_CA.map((item) => (
                <SymbolChip key={item.t} item={item} onClick={() => navigate(`/stocks/${item.t}`)} />
              ))}
            </div>
          </div>

          {/* Canadian ETFs */}
          <div className="mb-8">
            <SectionLabel>Popular Canadian ETFs — TSX</SectionLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {POPULAR_ETFS_CA.map((item) => (
                <SymbolChip key={item.t} item={item} onClick={() => navigate(`/stocks/${item.t}`)} />
              ))}
            </div>
          </div>

          {/* US stocks */}
          <div className="mb-8">
            <SectionLabel>Popular US stocks</SectionLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {POPULAR_STOCKS_US.map((item) => (
                <SymbolChip key={item.t} item={item} onClick={() => navigate(`/stocks/${item.t}`)} />
              ))}
            </div>
          </div>

          {/* US ETFs */}
          <div className="mb-8">
            <SectionLabel>Popular US ETFs</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {POPULAR_ETFS_US.map((item) => (
                <SymbolChip key={item.t} item={item} onClick={() => navigate(`/stocks/${item.t}`)} />
              ))}
            </div>
          </div>

          {/* Crypto */}
          <div className="mb-10">
            <SectionLabel>Popular crypto</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CRYPTO.map((item) => (
                <SymbolChip key={item.t} item={item} onClick={() => navigate(`/stocks/${item.t}`)} />
              ))}
            </div>
          </div>

          {/* Feature cards */}
          <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Interactive chart", desc: "Daily to multi-year history with adjustable intervals" },
              { title: "Technical analysis",desc: "Quick buy, sell, and neutral signals across timeframes" },
              { title: "Company profile",   desc: "Business overview, sector, and key fundamentals" },
              { title: "Latest news",       desc: "Symbol-specific headlines sourced in real time" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <p className="font-bold text-primary dark:text-accent">{f.title}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Related tools */}
          <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 dark:border-gray-700 dark:bg-gray-900">
            <p className="mb-4 text-sm font-bold text-primary dark:text-accent">
              Use a calculator alongside the chart
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { title: "Dividend calculator",   desc: "Model income and DRIP for dividend stocks and ETFs.",   href: "/tools/dividend-calculator" },
                { title: "Compound interest",      desc: "Project long-term ETF growth with monthly contributions.", href: "/tools/compound-interest-calculator" },
                { title: "Best ETFs for TFSA",     desc: "Compare XEQT, VEQT, XGRO, VFV and other popular options.", href: "/blog/best-etfs-for-tfsa-canada-2026" },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.href)}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-secondary hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <p className="font-semibold text-primary dark:text-accent">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <SectionLabel>Collections and comparisons</SectionLabel>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Canadian bank stocks",
                  desc: "Track the Big Five banks and open deeper ticker pages from one list.",
                  href: "/stocks/canadian-bank-stocks",
                },
                {
                  title: "Canadian ETFs",
                  desc: "Browse all-in-one ETFs, S&P 500 funds, and broad-market TSX favourites.",
                  href: "/stocks/canadian-etfs",
                },
                {
                  title: "Dividend ETFs",
                  desc: "See dividend and covered-call ETF ideas in one dedicated collection.",
                  href: "/stocks/dividend-etfs",
                },
                {
                  title: "Compare symbols",
                  desc: "Open side-by-side pages like XEQT vs VEQT or RY vs TD.",
                  href: "/stocks/compare",
                },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.href)}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-secondary hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <p className="font-semibold text-primary dark:text-accent">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
            </>
          )}
        </div>
      )}

      {/* ── Ticker view ───────────────────────────────────────────────────── */}
      {currentTicker && (
        <div className="mx-auto max-w-5xl px-4 py-6">

          {/* Header row */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold text-primary dark:text-white">
              {tickerMeta.displayName}
              {currentTicker !== tickerMeta.displayName && (
                <span className="ml-2 text-2xl font-normal text-gray-500 dark:text-gray-400">({currentTicker})</span>
              )}
            </h2>
            <button
              onClick={() => toggleWatch(currentTicker, currentTicker)}
              aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                isWatched
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-slate-100 text-slate-600 hover:bg-yellow-100 hover:text-yellow-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {isWatched ? "★ Saved" : "☆ Watchlist"}
            </button>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {assetLabel === "ETF" ? `ETF · ${tickerMeta.exchangeLabel}`
                : assetLabel === "fund" ? `Fund · ${tickerMeta.exchangeLabel}`
                : assetLabel === "crypto" ? "Crypto"
                : assetLabel === "commodity" ? "Commodity"
                : assetLabel === "forex" ? "FX"
                : tickerMeta.exchangeLabel}
            </span>
          </div>

          <p className="mb-6 max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300">
            {tickerMeta.description}
          </p>

          <div className="mb-6 flex flex-wrap gap-3">
            {[
              { id: "overview", label: "Overview" },
              ...(dividendSectionVisible ? [{ id: "dividends", label: "Dividends" }] : []),
              { id: "metrics", label: "Metrics" },
              { id: "news", label: "News" },
              { id: "profile", label: "Profile" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "dividends") {
                    navigate(`/stocks/${currentTicker}/dividend`);
                    return;
                  }
                  if (isDividendView) {
                    navigate(`/stocks/${currentTicker}`);
                    return;
                  }
                  scrollToSection(tab.id);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  (tab.id === "dividends" && isDividendView)
                    ? "border-secondary bg-blue-50 text-primary dark:border-blue-400 dark:bg-gray-700 dark:text-white"
                    : "border-gray-200 bg-white text-slate-600 hover:border-secondary hover:bg-blue-50 hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
            {comparePreset && (
              <button
                onClick={() => navigate(`/stocks/compare/${makeComparisonSlug(comparePreset.left, comparePreset.right)}`)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Compare {comparePreset.left.replace(".TO", "")} vs {comparePreset.right.replace(".TO", "")}
              </button>
            )}
          </div>

          {isDividendView ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <SectionLabel>Dividend information</SectionLabel>
                    <h3 className="text-2xl font-bold text-primary dark:text-accent">{currentTicker} dividend information</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300">
                      Review dividend yield, annual payout, ex-dividend timing, payout frequency, and recent dividend history for {tickerMeta.displayName}.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/tools/dividend-calculator")}
                    className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Open dividend calculator
                  </button>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                  {(dividendLoading ? [...Array(6)] : latestDividendCards).map((card, index) => (
                    <div key={card?.label || index} className="rounded-xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                      {dividendLoading ? (
                        <>
                          <SkeletonLine cls="h-3 w-24" />
                          <SkeletonLine cls="mt-3 h-6 w-20" />
                        </>
                      ) : (
                        <>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{card.label}</p>
                          <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{card.value}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div id="dividends" className="scroll-mt-28 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-1 pt-4">
                  <div>
                    <h3 className="font-bold text-primary dark:text-accent">Dividend history</h3>
                    <p className="text-xs text-gray-400">Recent payouts sorted from newest to oldest</p>
                  </div>
                  <button
                    onClick={() => navigate(`/stocks/${currentTicker}`)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-secondary hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300"
                  >
                    Back to overview
                  </button>
                </div>

                <div className="px-4 pb-5 pt-3">
                  {dividendLoading ? (
                    <div className="space-y-3">
                      {[...Array(10)].map((_, index) => <SkeletonLine key={index} cls="h-10 w-full" />)}
                    </div>
                  ) : dividendHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-gray-900">
                          <tr>
                            {["Ex-dividend date", "Cash amount"].map((header) => (
                              <th key={header} className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {dividendHistory.map((row) => (
                            <tr key={`${row.exDate}-${row.cashAmount}`} className="bg-white dark:bg-gray-800">
                              <td className="px-4 py-3 font-medium text-primary dark:text-accent">{row.exDate}</td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{row.cashAmount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                      No dividend history is available for this symbol right now. Try another stock or ETF, or go back to the main overview.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Dividend calculator",
                    body: "Model DRIP, yield-on-cost, and long-term income using this symbol as a starting point.",
                    href: "/tools/dividend-calculator",
                  },
                  {
                    title: isFundLike ? "Weekly dividend ETFs" : "Dividend investing platforms",
                    body: isFundLike
                      ? "Compare covered-call and payout-heavy ETFs before relying on headline yield alone."
                      : "Compare platforms before you buy a dividend stock or ETF.",
                    href: isFundLike ? "/blog/weekly-dividend-etfs" : "/blog/best-dividend-investing-platforms-canada",
                  },
                  {
                    title: relatedComparisons[0]?.label || "Compare alternatives",
                    body: "Open a side-by-side comparison to see whether another income option fits better.",
                    href: relatedComparisons[0]
                      ? `/stocks/compare/${makeComparisonSlug(relatedComparisons[0].left, relatedComparisons[0].right)}`
                      : "/stocks/dividend-etfs",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigate(item.href)}
                    className="rounded-2xl border border-gray-100 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <p className="text-lg font-bold text-primary dark:text-accent">{item.title}</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.body}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
          <>
          <div className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
            <div className="space-y-6">
              <div id="overview" className="scroll-mt-28 rounded-2xl border border-gray-100 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                        {assetLabel === "ETF" ? "ETF snapshot" : assetLabel === "crypto" ? "Crypto snapshot" : assetLabel === "commodity" ? "Commodity snapshot" : assetLabel === "forex" ? "Currency pair snapshot" : "Stock snapshot"}
                      </p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                        {tickerMeta.exchangeLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-end gap-4">
                      <div>
                        <p className="text-4xl font-bold text-primary dark:text-white">
                          {stockData ? formatStatValue(stockData.price, stockData.currency, isForex) : "Loading..."}
                        </p>
                        <div className={`mt-2 flex items-center gap-2 text-sm font-semibold ${quoteDirectionClass}`}>
                          <span>{stockData ? `${Number(stockData.change || 0) >= 0 ? "+" : ""}${Number(stockData.change || 0).toFixed(2)}` : "—"}</span>
                          <span>{stockData ? `${Number(stockData.changePct || 0) >= 0 ? "+" : ""}${Number(stockData.changePct || 0).toFixed(2)}%` : ""}</span>
                        </div>
                      </div>
                      <div className="grid flex-1 gap-3 sm:grid-cols-3">
                        {quickStats.slice(0, 3).map((item) => (
                          <div key={item.label} className="rounded-xl border border-gray-100 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{item.label}</p>
                            <p className="mt-1 text-sm font-bold text-primary dark:text-accent">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {tickerMeta.description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-3 text-sm font-bold text-primary dark:text-accent">Key stats</p>
                    <div className="space-y-2">
                      {quickStats.slice(3, 8).map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3 border-b border-gray-200/70 py-2 text-sm last:border-0 dark:border-gray-700/70">
                          <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                          <span className="text-right font-semibold text-primary dark:text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-900">
                <div className="px-4 pb-1 pt-4">
                  <h3 className="font-bold text-primary dark:text-accent">Price chart</h3>
                  <p className="text-xs text-gray-400">Interactive — click to adjust interval or timeframe</p>
                </div>
                <TVWidget
                  id={`chart-${tvSymbol}`}
                  height={isMobileView ? 420 : 620}
                  scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
                  configFn={(dark) => ({
                    autosize: false, width: "100%", height: isMobileView ? 420 : 620, symbol: tvSymbol,
                    interval: "D", timezone: "America/Toronto", theme: dark ? "dark" : "light",
                    style: "1", locale: "en", save_image: true, support_host: "https://www.tradingview.com",
                  })}
                />
              </div>
            </div>

            <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
                <div className="px-4 pb-1 pt-4">
                  <h3 className="font-bold text-primary dark:text-accent">Quote table</h3>
                  <p className="text-xs text-gray-400">Quick values users expect above the fold</p>
                </div>
                <div className="px-4 pb-5 pt-3">
                  <div className="space-y-2">
                    {[...quickStats, ...valuationStats].map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3 border-b border-gray-200/70 py-2 text-sm last:border-0 dark:border-gray-700/70">
                        <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                        <span className="text-right font-semibold text-primary dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
                <div className="px-4 pb-1 pt-4">
                  <h3 className="font-bold text-primary dark:text-accent">Quick links</h3>
                  <p className="text-xs text-gray-400">Comparison pages and nearby alternatives</p>
                </div>
                <div className="space-y-3 px-4 pb-5 pt-3">
                  {(relatedComparisons.length > 0 ? relatedComparisons : COMPARISON_PRESETS.slice(0, 2)).map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => navigate(`/stocks/compare/${makeComparisonSlug(preset.left, preset.right)}`)}
                      className="w-full rounded-xl border border-gray-200 bg-slate-50 p-3 text-left transition hover:border-secondary hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                      <p className="font-semibold text-primary dark:text-accent">{preset.label}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{preset.blurb}</p>
                    </button>
                  ))}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {alternativeSymbols.slice(0, 4).map((item) => (
                      <SymbolChip key={item.t} item={item} onClick={() => navigate(`/stocks/${item.t}`)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AdSlot slot="1901528811" format="auto" />

          {/* Technical + Profile */}
          <div id="profile" className="scroll-mt-28 mb-6 grid gap-6 md:grid-cols-2">
            {isMobileView ? (
              <>
                <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
                  <div className="px-4 pb-1 pt-4">
                    <h3 className="font-bold text-primary dark:text-accent">Mobile summary</h3>
                    <p className="text-xs text-gray-400">Lighter view for phones so the page loads reliably</p>
                  </div>
                  <div className="space-y-3 px-4 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                      {tickerMeta.description}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        Open the chart above for the full price view and timeframe controls.
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        News and quote data stay below, but extra desktop widgets are trimmed on phones for stability.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
                  <div className="px-4 pb-1 pt-4">
                    <h3 className="font-bold text-primary dark:text-accent">Quick stats</h3>
                    <p className="text-xs text-gray-400">Key figures without the extra widget load</p>
                  </div>
                  <div className="grid gap-3 px-4 pb-5 pt-3 sm:grid-cols-2">
                    {[...quickStats.slice(0, 6), ...valuationStats.slice(0, 2)].map((item) => (
                      <div key={item.label} className="rounded-xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{item.label}</p>
                        <p className="mt-1 text-sm font-bold text-primary dark:text-accent">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
                  <div className="px-4 pb-1 pt-4">
                    <h3 className="font-bold text-primary dark:text-accent">Technical analysis</h3>
                    <p className="text-xs text-gray-400">Buy, sell, and neutral signal summary</p>
                  </div>
                  <TVWidget
                    id={`tech-${tvSymbol}`}
                    height={425}
                    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
                    configFn={(dark) => ({
                      interval: "1D", width: "100%", isTransparent: false, height: 425,
                      symbol: tvSymbol, showIntervalTabs: true, locale: "en", colorTheme: dark ? "dark" : "light",
                    })}
                  />
                </div>

                <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
                  <div className="px-4 pb-1 pt-4">
                    <h3 className="font-bold text-primary dark:text-accent">
                      {isCrypto ? "Crypto profile" : isFundLike ? "Fund profile" : isCommodity ? "Commodity profile" : isForex ? "Currency pair profile" : "Company profile"}
                    </h3>
                  </div>
                  {isMacroAsset ? (
                    <div className="space-y-4 px-4 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                        <p className="font-semibold text-primary dark:text-accent">
                          {isCommodity ? "What to watch" : "Why this pair matters"}
                        </p>
                        <p className="mt-2 leading-7">{tickerMeta.description}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {[
                          isCommodity
                            ? "Commodity prices react to supply shocks, inventory moves, inflation expectations, and global growth data."
                            : "Currency pairs move with central-bank decisions, inflation trends, rate expectations, and risk sentiment.",
                          isCommodity
                            ? "Use the chart and news together to separate one-day volatility from broader trend changes."
                            : "Use the chart and news together to see whether a move is policy-driven, risk-driven, or commodity-linked.",
                        ].map((point) => (
                          <div key={point} className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <TVWidget
                      id={`profile-${tvSymbol}`}
                      height={425}
                      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js"
                      configFn={(dark) => ({ width: "100%", height: 425, symbol: tvSymbol, colorTheme: dark ? "dark" : "light", isTransparent: false, locale: "en" })}
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* AI summary */}
          {(aiLoading || aiSummary) && (
            <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-gray-600 dark:from-gray-800 dark:to-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-bold text-primary dark:text-white">AI summary</h3>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">Experimental</span>
              </div>
              {aiLoading ? (
                <div className="space-y-2">
                  <SkeletonLine cls="h-4 w-full" /><SkeletonLine cls="h-4 w-11/12" /><SkeletonLine cls="h-4 w-4/5" />
                </div>
              ) : (
                <p className="leading-relaxed text-gray-700 dark:text-gray-200">{aiSummary}</p>
              )}
              <p className="mt-4 text-xs text-gray-400">For informational purposes only. Not financial advice.</p>
            </div>
          )}

          {/* Key metrics */}
          {stockData && (
            <div id="metrics" className="scroll-mt-28 mb-6 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <div className="px-4 pb-1 pt-4">
                <h3 className="font-bold text-primary dark:text-accent">{isFundLike ? "Fund snapshot" : "Key metrics"}</h3>
                <p className="text-xs text-gray-400">{isFundLike ? "Live quote data" : "Price, valuation, and trading metrics"}</p>
              </div>
              <div className="grid gap-3 px-4 pb-5 pt-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Price",        value: stockData.price ? `${stockData.price} ${stockData.currency || ""}`.trim() : "N/A" },
                  { label: "Change",       value: stockData.changePct !== undefined && stockData.changePct !== null ? `${Number(stockData.changePct).toFixed(2)}%` : "N/A" },
                  { label: "Day range",    value: stockData.dayLow && stockData.dayHigh ? `${stockData.dayLow} – ${stockData.dayHigh}` : "N/A" },
                  { label: "52-week",      value: stockData.weekLow52 && stockData.weekHigh52 ? `${stockData.weekLow52} – ${stockData.weekHigh52}` : "N/A" },
                  { label: "Volume",       value: stockData.volume || "N/A" },
                  { label: "Avg volume",   value: stockData.avgVolume || "N/A" },
                  { label: "Market cap",   value: stockData.marketCap || "N/A" },
                  { label: "Div. yield",   value: stockData.dividendYield || "N/A" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
                    <p className="mt-2 text-lg font-bold text-primary dark:text-accent">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dividendSectionVisible && (
            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <SectionLabel>Dividend section</SectionLabel>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    A faster income-focused read for dividend stocks and ETFs.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Dividend yield</p>
                    <p className="mt-2 text-2xl font-bold text-primary dark:text-accent">{dividendLabel}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Profile</p>
                    <p className="mt-2 text-base font-bold text-primary dark:text-accent">{dividendProfileLabel}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Best next step</p>
                    <p className="mt-2 text-sm font-semibold text-primary dark:text-accent">
                      {isFundLike ? "Compare this ETF with other income funds." : "Model cash flow before relying on yield alone."}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      title: "Dividend calculator",
                      desc: "Model income and DRIP scenarios using this symbol as a starting point.",
                      href: "/tools/dividend-calculator",
                    },
                    {
                      title: isFundLike ? "Weekly dividend ETFs" : "Dividend investing platforms",
                      desc: isFundLike
                        ? "See how covered-call and high-yield ETFs differ before chasing payout size."
                        : "Review platform choices if this stock is part of a dividend-income plan.",
                      href: isFundLike ? "/blog/weekly-dividend-etfs" : "/blog/best-dividend-investing-platforms-canada",
                    },
                    {
                      title: relatedComparisons[0]?.label || "Compare alternatives",
                      desc: "Open a side-by-side page to see whether another income option fits better.",
                      href: relatedComparisons[0]
                        ? `/stocks/compare/${makeComparisonSlug(relatedComparisons[0].left, relatedComparisons[0].right)}`
                        : "/stocks/dividend-etfs",
                    },
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => navigate(item.href)}
                      className="rounded-xl border border-gray-200 bg-slate-50 p-4 text-left transition hover:border-secondary hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                      <p className="font-semibold text-primary dark:text-accent">{item.title}</p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Financials or fund notice */}
          {showTradingViewFinancials ? (
            <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <div className="px-4 pb-1 pt-4">
                <h3 className="font-bold text-primary dark:text-accent">Financials</h3>
                <p className="text-xs text-gray-400">Income statement, balance sheet, and cash flow</p>
              </div>
              <TVWidget
                id={`fin-${tvSymbol}`}
                height={450}
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-financials.js"
                configFn={(dark) => ({
                  symbol: tvSymbol, colorTheme: dark ? "dark" : "light", isTransparent: false,
                  largeChartUrl: "", displayMode: "regular", width: "100%", height: 450, locale: "en",
                })}
              />
            </div>
          ) : !isCrypto ? (
            <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <div className="px-4 pb-1 pt-4">
                <h3 className="font-bold text-primary dark:text-accent">{isMacroAsset ? "Market details" : "Fund details"}</h3>
                <p className="text-xs text-gray-400">
                  {isMacroAsset ? "Financial statements are not applicable for commodity and currency charts" : "ETF and fund financial statements are not available in this view"}
                </p>
              </div>
              <div className="px-4 pb-5 pt-3">
                <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  {isMacroAsset
                    ? "Commodity and FX charts do not have company-style financial statements. Use the chart, technical panel, key metrics, and latest headlines above to research this market."
                    : "Traditional income statements are generally not applicable for ETFs and covered-call products. Use the chart, profile, key metrics, and news sections above to research this symbol."}
                </div>
              </div>
            </div>
          ) : null}

          {/* News */}
          <div id="news" className="scroll-mt-28 mb-6 overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
            <div className="px-4 pb-1 pt-4">
              <h3 className="font-bold text-primary dark:text-accent">Latest news</h3>
              <p className="text-xs text-gray-400">Recent headlines for {currentTicker}</p>
            </div>
            <div className="px-4 pb-5 pt-3">
              {newsLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <SkeletonLine key={i} cls="h-5 w-full" />)}
                </div>
              ) : newsItems.length > 0 ? (
                <div className="grid gap-3">
                  {newsItems.map((item, index) => {
                    const href = item.link || item.url || "#";
                    const publisher = item.publisher || item.source || "Finance news";
                    return (
                      <a
                        key={`${href}-${index}`}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="grid gap-4 rounded-xl border border-gray-100 bg-slate-50 p-4 transition hover:border-secondary hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 md:grid-cols-[140px_minmax(0,1fr)]"
                      >
                        {item.thumbnail ? (
                          <div className="overflow-hidden rounded-xl border border-gray-200 bg-slate-200 dark:border-gray-700 dark:bg-slate-800">
                            <img
                              src={item.thumbnail}
                              alt={item.title || publisher}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="hidden rounded-xl border border-dashed border-gray-200 bg-white md:block dark:border-gray-700 dark:bg-gray-800" />
                        )}
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                            <span>{publisher}</span>
                            {item.providerPublishTime && <span className="normal-case tracking-normal text-gray-500 dark:text-gray-400">{formatNewsDate(item.providerPublishTime)}</span>}
                          </div>
                          <p className="mt-2 text-lg font-semibold leading-7 text-primary dark:text-accent">{item.title || "Read the latest story"}</p>
                          <p className="mt-3 text-sm font-semibold text-secondary">Open story →</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  {isFundLike ? (
                    <div>
                      <p className="mb-4">No recent fund-specific headlines available right now. These resources may help instead:</p>
                      <div className="grid gap-3 md:grid-cols-3">
                        {FUND_FALLBACK_RESOURCES.map((res) => (
                          <button key={res.title} onClick={() => navigate(res.href)}
                            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-secondary hover:shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm font-semibold text-primary dark:text-accent">{res.title}</p>
                            <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">{res.body}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : "No recent headlines available for this symbol. Try another ticker or check back later."}
                </div>
              )}
            </div>
          </div>

          <AdSlot slot="3078879111" format="auto" />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: "Best ETFs for TFSA",    body: "Compare XEQT, VEQT, XGRO, VFV, and dividend-focused options for registered accounts.", href: "/blog/best-etfs-for-tfsa-canada-2026" },
              comparePreset
                ? { title: `Compare ${comparePreset.left.replace(".TO", "")} vs ${comparePreset.right.replace(".TO", "")}`, body: "Open the side-by-side comparison page to check price, range, and volume quickly.", href: `/stocks/compare/${makeComparisonSlug(comparePreset.left, comparePreset.right)}` }
                : { title: "Dividend calculator", body: "Model income and DRIP scenarios for dividend stocks and high-yield ETFs.", href: "/tools/dividend-calculator" },
              { title: "Beginner investing guide", body: "See where a stock or ETF fits inside a TFSA, RRSP, or a long-term plan.",           href: "/blog/how-to-invest-in-canada-beginners-2026" },
            ].map((item) => (
              <button key={item.title} onClick={() => navigate(item.href)}
                className="rounded-2xl border border-gray-100 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-secondary hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                <p className="text-lg font-bold text-primary dark:text-accent">{item.title}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.body}</p>
              </button>
            ))}
          </div>
          </>
          )}
        </div>
      )}
    </div>
  );
}

function formatNewsDate(unixSeconds) {
  try {
    return new Date(unixSeconds * 1000).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CuratedTickerSection({ title, subtitle, items, onSelect, viewAllHref, viewAllLabel }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionLabel>{title}</SectionLabel>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        {viewAllHref && (
          <button
            onClick={() => navigate(viewAllHref)}
            className="rounded-full border border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-secondary hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300"
          >
            {viewAllLabel || "View all"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <SymbolChip key={item.t} item={item} onClick={() => onSelect(item.t)} />
        ))}
      </div>
    </div>
  );
}

function RateCardSection({ title, subtitle, items, loading, onSelect }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4">
        <SectionLabel>{title}</SectionLabel>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {[...Array(5)].map((_, index) => (
            <SkeletonLine key={index} cls="h-20 w-full" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {items.slice(0, 5).map((item) => {
            const isPositive = Number(item.changePct || 0) >= 0;
            return (
              <button
                key={item.symbol}
                onClick={() => onSelect(item.symbol)}
                className="rounded-2xl border border-gray-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-secondary hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{item.market}</p>
                    <p className="mt-1 text-lg font-bold text-primary dark:text-accent">{item.name}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary dark:text-white">
                      {formatRateValue(item.price, item.market, item.currency)}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                      {isPositive ? "+" : ""}{Number(item.changePct || 0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          Live rates are temporarily unavailable. Try again in a moment.
        </div>
      )}
    </div>
  );
}

function formatRateValue(value, market, currency) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "N/A";
  const digits = market === "FX" ? 4 : numeric < 100 ? 2 : 2;
  const formatted = numeric.toLocaleString("en-CA", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  return currency && market !== "FX" ? `${formatted} ${currency}` : formatted;
}

function formatStatValue(value, currency, isForex = false) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "N/A";

  const digits = isForex ? 4 : numeric >= 1000 ? 0 : 2;
  const formatted = numeric.toLocaleString("en-CA", {
    minimumFractionDigits: isForex ? 4 : 0,
    maximumFractionDigits: digits,
  });

  return currency && !isForex ? `${formatted} ${currency}` : formatted;
}

function MoversPanel({ title, items, loading, emptyLabel, tone, onSelect, showVolume = false }) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-red-600"
        : "text-slate-600 dark:text-slate-300";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-lg font-bold text-primary dark:text-accent">{title}</p>
        <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${toneClass}`}>Live snapshot</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => <SkeletonLine key={index} cls="h-10 w-full" />)}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.symbol}
              onClick={() => onSelect(item.symbol)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-slate-50 px-4 py-3 text-left transition hover:border-secondary hover:bg-white dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary dark:text-white">{item.symbol.replace(".TO", "").replace("-USD", "")}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                    {item.market}
                  </span>
                </div>
                <div className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{item.name}</div>
              </div>
              <div className="ml-3 text-right">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatMoverPrice(item.price)}</div>
                <div className={`text-xs font-semibold ${showVolume ? "text-slate-500 dark:text-slate-400" : toneClass}`}>
                  {showVolume ? formatVolume(item.volume) : formatChangePct(item.changePct)}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

function formatMoverPrice(value) {
  if (value === undefined || value === null) return "N/A";
  return Number(value).toLocaleString("en-CA", { maximumFractionDigits: 2 });
}

function formatChangePct(value) {
  const num = Number(value || 0);
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
}

function formatVolume(value) {
  const num = Number(value || 0);
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B vol`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M vol`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K vol`;
  return `${num} vol`;
}
