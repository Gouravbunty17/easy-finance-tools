// No network calls, telemetry of holdings, persistence or brokerage credentials.
// All calculations run in the visitor's browser; figures are based only on entered data.
export const PORTFOLIO_ACCOUNTS = ["TFSA", "RRSP", "FHSA", "RESP", "Taxable", "Cash", "Other"];
export const PORTFOLIO_CURRENCIES = ["CAD", "USD"];
export const PORTFOLIO_REGIONS = ["Canada", "United States", "International developed", "Emerging markets", "Unknown / mixed"];
export const PORTFOLIO_ASSETS = ["Stock", "ETF", "Bond", "Cash", "GIC", "Fund", "Other"];
export const PORTFOLIO_SECTORS = ["Communication Services", "Consumer Discretionary", "Consumer Staples", "Energy", "Financials", "Health Care", "Industrials", "Information Technology", "Materials", "Real Estate", "Utilities", "Unknown / diversified"];

export const PORTFOLIO_CSV_HEADERS = ["ticker", "shares", "price", "currency", "cadPerUnit", "account", "sector", "region", "assetType", "annualDistributionPerShare", "costBasisCad", "specifiedForeignProperty"];

export const DEMO_PORTFOLIO = [
  { ticker: "VFV", shares: 48, price: 132, currency: "CAD", cadPerUnit: 1, account: "TFSA", sector: "Unknown / diversified", region: "Unknown / mixed", assetType: "ETF", annualDistributionPerShare: 1.12, costBasisCad: 5600, specifiedForeignProperty: false },
  { ticker: "XEQT", shares: 70, price: 36, currency: "CAD", cadPerUnit: 1, account: "Taxable", sector: "Unknown / diversified", region: "Unknown / mixed", assetType: "ETF", annualDistributionPerShare: 0.65, costBasisCad: 2250, specifiedForeignProperty: false },
  { ticker: "AAPL", shares: 12, price: 240, currency: "USD", cadPerUnit: 1.35, account: "TFSA", sector: "Information Technology", region: "United States", assetType: "Stock", annualDistributionPerShare: 1.04, costBasisCad: 3100, specifiedForeignProperty: false },
  { ticker: "RY", shares: 22, price: 165, currency: "CAD", cadPerUnit: 1, account: "Taxable", sector: "Financials", region: "Canada", assetType: "Stock", annualDistributionPerShare: 5.88, costBasisCad: 3150, specifiedForeignProperty: false },
  { ticker: "CASH", shares: 1000, price: 1, currency: "CAD", cadPerUnit: 1, account: "Cash", sector: "Unknown / diversified", region: "Canada", assetType: "Cash", annualDistributionPerShare: 0, costBasisCad: 1000, specifiedForeignProperty: false }
];
// Demo prices, FX and distributions above are imaginary examples, not market quotes.

function validNumber(value, allowBlank = false) {
  if (allowBlank && (value === "" || value === null || value === undefined)) return null;
  const input = String(value ?? "").trim();
  if (!input || !Number.isFinite(Number(input))) return NaN;
  return Number(input);
}
function text(value) { return String(value ?? "").trim(); }
function finitePositive(value) { return Number.isFinite(value) && value > 0; }
function finiteNonnegative(value) { return Number.isFinite(value) && value >= 0; }

// Strict CSV reader supporting double-quoted commas and escaped quotes.
export function parsePortfolioCsv(csv) {
  if (typeof csv !== "string" || csv.length > 1024 * 1024) throw new Error("Use a CSV file smaller than 1 MB.");
  const rows = [];
  let row = [], field = "", quoted = false, afterQuote = false;
  const pushField = () => { row.push(field); field = ""; afterQuote = false; };
  const pushRow = () => { pushField(); if (row.some(cell => cell.trim())) rows.push(row); row = []; };
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (quoted) {
      if (c === '"' && csv[i+1] === '"') { field += '"'; i++; }
      else if (c === '"') { quoted = false; afterQuote = true; }
      else field += c;
    } else if (c === '"') {
      if (field || afterQuote) throw new Error("Malformed CSV quoting.");
      quoted = true;
    } else if (c === ",") pushField();
    else if (c === "\n" || c === "\r") { if (c === "\r" && csv[i+1] === "\n") i++; pushRow(); }
    else if (afterQuote && c !== " " && c !== "\t") throw new Error("Unexpected characters after CSV quote.");
    else if (!afterQuote) field += c;
  }
  if (quoted) throw new Error("Unclosed quoted field in CSV.");
  if (row.length || field || afterQuote) pushRow();
  if (rows.length < 2) throw new Error("CSV needs a header row and at least one holding.");
  const headings = rows[0].map(cell => cell.trim().replace(/^\uFEFF/, ""));
  for (const key of ["ticker", "shares", "price", "currency", "cadPerUnit", "account"]) {
    if (!headings.includes(key)) throw new Error("Missing required CSV column: " + key);
  }
  if (rows.length > 201) throw new Error("Maximum 200 holdings per import.");
  const parsed = rows.slice(1).map((values, i) => {
    if (values.length !== headings.length) throw new Error("CSV row " + (i+2) + " has the wrong number of columns.");
    return Object.fromEntries(headings.map((key, j) => [key, values[j]]));
  });
  return parsed;
}

export function validatePortfolioHoldings(rows) {
  if (!Array.isArray(rows) || rows.length > 200) return { valid: [], errors: ["Maximum 200 holdings."] };
  const valid = [], errors = [];
  rows.forEach((raw, i) => {
    const row = raw ?? {};
    const ticker = text(row.ticker).toUpperCase();
    const shares = validNumber(row.shares);
    const price = validNumber(row.price);
    const currency = text(row.currency).toUpperCase();
    const cadPerUnit = currency === "CAD" ? 1 : validNumber(row.cadPerUnit);
    const annualDistribution = validNumber(row.annualDistributionPerShare, true);
    const costBasis = validNumber(row.costBasisCad, true);
    const account = text(row.account);
    const sector = text(row.sector) || "Unknown / diversified";
    const region = text(row.region) || "Unknown / mixed";
    const assetType = text(row.assetType) || "Other";
    const specifiedForeignProperty = row.specifiedForeignProperty === true || ["true","yes","1"].includes(text(row.specifiedForeignProperty).toLowerCase());
    const invalid = [];
    if (!/^[A-Z0-9.^/-]{1,20}$/.test(ticker)) invalid.push("ticker");
    if (!finitePositive(shares)) invalid.push("shares");
    if (!finiteNonnegative(price)) invalid.push("price");
    if (!PORTFOLIO_CURRENCIES.includes(currency)) invalid.push("currency");
    if (!finitePositive(cadPerUnit)) invalid.push("CAD per currency unit");
    if (!PORTFOLIO_ACCOUNTS.includes(account)) invalid.push("account");
    if (!PORTFOLIO_SECTORS.includes(sector)) invalid.push("sector");
    if (!PORTFOLIO_REGIONS.includes(region)) invalid.push("region");
    if (!PORTFOLIO_ASSETS.includes(assetType)) invalid.push("asset class");
    if (annualDistribution !== null && !finiteNonnegative(annualDistribution)) invalid.push("annual distribution per share");
    if (costBasis !== null && !finiteNonnegative(costBasis)) invalid.push("CAD cost basis");
    if (invalid.length) errors.push("Row " + (i+1) + " (" + (ticker || "untitled") + "): " + invalid.join(", "));
    else valid.push({ ticker, shares, price, currency, cadPerUnit, account, sector, region, assetType, annualDistributionPerShare: annualDistribution, costBasisCad: costBasis, specifiedForeignProperty });
  });
  return { valid, errors };
}

function group(rows, key) {
  const map = new Map();
  for (const h of rows) map.set(h[key], (map.get(h[key]) || 0) + h.valueCad);
  return [...map.entries()].map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value);
}
export function analyzePortfolio(rows) {
  const { valid, errors } = validatePortfolioHoldings(rows);
  if (errors.length || !valid.length) return { errors: errors.length?errors:["Enter at least one holding."] };
  const holdings = valid.map(h=>({
    ...h,
    valueCad: h.shares*h.price*h.cadPerUnit,
    annualIncomeCad: h.annualDistributionPerShare === null ? null : h.shares*h.annualDistributionPerShare*h.cadPerUnit
  }));
  const totalValueCad = holdings.reduce((n,h)=>n+h.valueCad,0);
  if (!(totalValueCad > 0)) return { errors: ["Total market value must be greater than zero."] };
  const top5 = [...holdings].sort((a,b)=>b.valueCad-a.valueCad).slice(0,5);
  const top5Pct = top5.reduce((n,h)=>n+h.valueCad,0) / totalValueCad * 100;
  const tinyPositions = holdings.filter(h => h.valueCad / totalValueCad < 0.01).length;
  const equities = holdings.filter(h=>h.assetType==="Stock");
  const biggestSingleStock = equities.length ? Math.max(...equities.map(h=>h.valueCad / totalValueCad * 100)) : null;
  const withIncome = holdings.filter(h=>h.annualIncomeCad !== null);
  const annualIncomeCad = withIncome.reduce((n,h)=>n+h.annualIncomeCad,0);
  const allIncomeEntered = withIncome.length === holdings.length;
  const foreignTaxable = holdings.filter(h => h.account === "Taxable" && h.specifiedForeignProperty);
  const foreignTaxableKnownCost = foreignTaxable.reduce((n,h)=>n+(h.costBasisCad || 0),0);
  const foreignCostIncomplete = foreignTaxable.some(h=>h.costBasisCad===null);
  const flaggedUsInTfsa = holdings.filter(h=>h.account==="TFSA" && h.region==="United States" && (h.annualDistributionPerShare || 0)>0);
  const duplicateTickers = [...new Set(holdings.map(h=>h.ticker).filter((t,i,a)=>a.indexOf(t)!==i))];
  return {
    errors: [], totalValueCad, count: holdings.length, top5, top5Pct, tinyPositions, biggestSingleStock,
    annualIncomeCad, allIncomeEntered, knownIncomePositions: withIncome.length,
    sector:group(holdings,"sector"), region:group(holdings,"region"), account:group(holdings,"account"),
    assetType:group(holdings,"assetType"), currency:group(holdings,"currency"),
    flaggedUsInTfsa, foreignTaxableKnownCost, foreignTaxableCount:foreignTaxable.length, foreignCostIncomplete,
    duplicateTickers, holdings
  };
}
