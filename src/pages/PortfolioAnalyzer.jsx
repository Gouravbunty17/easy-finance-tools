import React, { useMemo, useRef, useState } from "react";
import { trackEvent, trackToolStart } from "../lib/analytics";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import {
  PORTFOLIO_ACCOUNTS, PORTFOLIO_CURRENCIES, PORTFOLIO_REGIONS,
  PORTFOLIO_SECTORS, PORTFOLIO_ASSETS, PORTFOLIO_CSV_HEADERS,
  DEMO_PORTFOLIO, analyzePortfolio, parsePortfolioCsv, validatePortfolioHoldings
} from "../lib/portfolioAnalysis.mjs";

const cad = n => new Intl.NumberFormat("en-CA", { style:"currency", currency:"CAD", maximumFractionDigits:0 }).format(n);
const pct = n => Number(n).toFixed(1) + "%";
const inputClass = "mt-1 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white";
const blank = () => ({
  ticker:"", shares:"", price:"", currency:"CAD", cadPerUnit:"1",
  account:"TFSA", sector:"Unknown / diversified", region:"Unknown / mixed", assetType:"Stock",
  annualDistributionPerShare:"", costBasisCad:"", specifiedForeignProperty:false
});
function Allocation({ title, rows, total }) {
  return <section className="eft-surface p-5 sm:p-6">
    <h3 className="text-lg font-bold text-primary dark:text-accent">{title}</h3>
    <div className="mt-5 space-y-4">
      {rows.map(({label,value})=><div key={label}>
        <div className="flex justify-between gap-3 text-sm"><span className="text-slate-700 dark:text-slate-200">{label}</span><span className="font-semibold">{pct(value/total*100)} · {cad(value)}</span></div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div className="eft-allocation-fill h-full rounded-full" style={{width:pct(value/total*100)}} /></div>
      </div>)}
    </div>
  </section>;
}
function Stat({ label, value, detail, standout = false }) {
  return <div className={`eft-kpi-card ${standout ? "is-highlighted" : ""}`}>
    <p className={`text-xs font-bold uppercase tracking-[.11em] ${standout ? "text-[#A8EBD9]" : "text-slate-500 dark:text-slate-400"}`}>{label}</p>
    <p className={`eft-metric mt-3 break-words text-[24px] font-extrabold sm:text-[28px] ${standout ? "text-white" : "text-primary dark:text-white"}`}>{value}</p>
    {detail && <p className={`mt-2 text-xs leading-5 ${standout ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>{detail}</p>}
  </div>;
}
const allocationColors = ["#137B70", "#0B2447", "#E7AB57", "#53B8A7", "#7898B4", "#C98C49", "#6F728B", "#9ADCCE"];
function AccountDonut({ allocations, total }) {
  let progress = 0;
  const circumference = 2 * Math.PI * 43;
  const slices = allocations.map((item, i) => {
    const portion = total > 0 ? Math.min(1, item.value / total) : 0;
    const slice = { ...item, color: allocationColors[i % allocationColors.length], length: portion * circumference, start: progress * circumference };
    progress += portion;
    return slice;
  });
  return <section className="eft-surface grid items-center gap-7 p-5 sm:p-7 lg:grid-cols-[260px_1fr]" aria-label="Account allocation visualization">
    <div className="mx-auto w-full max-w-[245px]">
      <svg viewBox="0 0 120 120" role="img" aria-label="Account values represented as a proportion of total portfolio value" className="w-full">
        <circle cx="60" cy="60" r="43" fill="none" stroke="#E9EFF5" strokeWidth="16"/>
        {slices.map((slice,i)=><circle key={i} cx="60" cy="60" r="43" fill="none" stroke={slice.color} strokeWidth="16"
          strokeDasharray={`${slice.length} ${circumference - slice.length}`} strokeDashoffset={-slice.start}
          transform="rotate(-90 60 60)" />)}
        <text x="60" y="56" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">YOUR</text>
        <text x="60" y="68" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">ACCOUNTS</text>
      </svg>
    </div>
    <div>
      <span className="eft-eyebrow">ACCOUNT ALLOCATION</span>
      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-primary dark:text-white">See where your money sits</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Based entirely on the account labels and position values you entered. Does not indicate investment quality or account eligibility.</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {slices.map((slice,i)=><li key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-700">
          <span className="h-3 w-3 shrink-0 rounded-full" style={{backgroundColor:slice.color}}/>
          <div><span className="block text-xs font-semibold text-slate-500">{slice.label}</span><span className="block text-base font-extrabold text-primary dark:text-white">{pct(slice.value / total * 100)}</span></div>
        </li>)}
      </ul>
    </div>
  </section>;
}
function EditorField({ name, value, onChange, type="text", placeholder="", step }) {
  return <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">{name}
    <input className={inputClass} type={type} inputMode={type==="number"?"decimal":undefined} min={type==="number"?"0":undefined} step={step} placeholder={placeholder} value={value ?? ""} onChange={e=>onChange(e.target.value)} />
  </label>;
}
function EditorSelect({ name, value, choices, onChange }) {
  return <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">{name}
    <select className={inputClass} value={value} onChange={e=>onChange(e.target.value)}>{choices.map(x=><option key={x} value={x}>{x}</option>)}</select>
  </label>;
}
export default function PortfolioAnalyzer() {
  const [rows, setRows] = useState([blank()]);
  const [confirmed, setConfirmed] = useState(null);
  const [demo, setDemo] = useState(false);
  const [importError, setImportError] = useState("");
  const [showTemplate, setShowTemplate] = useState(false);
  const hasTrackedStart = useRef(false);
  const inputMethod = useRef("manual");
  const startOnce = (method) => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    trackToolStart("portfolio_analyzer", { entry_point: method });
  };
  const analysis = useMemo(()=>confirmed?analyzePortfolio(confirmed):null,[confirmed]);
  const currentValidation = useMemo(()=>validatePortfolioHoldings(rows),[rows]);
  const changeRow=(index,key,value)=>{
    startOnce("manual");
    setRows(old=>old.map((r,i)=>{
      if(i!==index)return r;
      // Never silently assume 1 USD = 1 CAD when a visitor changes currency.
      if(key==="currency")return {...r, currency:value, cadPerUnit:value==="CAD"?"1":""};
      return {...r,[key]:value};
    }));
    setConfirmed(null); setDemo(false);
  };
  const loadDemo=()=>{
    startOnce("demo");
    inputMethod.current = "demo";
    trackEvent("portfolio_report_view", { tool_name:"portfolio_analyzer", analysis_mode:"demo" });
    const copy=DEMO_PORTFOLIO.map(h=>({...h}));
    setRows(copy); setConfirmed(copy); setDemo(true); setImportError("");
  };
  async function importCsv(event) {
    const file=event.target.files?.[0];
    if(!file)return;
    startOnce("csv"); inputMethod.current = "csv";
    setConfirmed(null); setDemo(false); setImportError("");
    try{
      if(!file.name.toLowerCase().endsWith(".csv"))throw new Error("Only CSV files are supported. Screenshot extraction is not available yet.");
      if(file.size>1024*1024)throw new Error("CSV file must be smaller than 1 MB.");
      const parsed=parsePortfolioCsv(await file.text());
      const normalized=parsed.map(raw=>({
        ...blank(), ...raw,
        currency: String(raw.currency||"CAD").trim().toUpperCase(),
        account: String(raw.account||"TFSA").trim(),
        cadPerUnit: String(raw.cadPerUnit||"").trim(),
        specifiedForeignProperty: ["yes","true","1"].includes(String(raw.specifiedForeignProperty||"").trim().toLowerCase())
      }));
      const result=validatePortfolioHoldings(normalized);
      setRows(normalized);
      trackEvent("portfolio_import_result", { tool_name:"portfolio_analyzer", method:"csv", outcome: result.errors.length?"invalid":"success" });
      if(result.errors.length)setImportError("Review the highlighted import errors below. No analysis is performed until all fields are valid.");
    }catch(err){trackEvent("portfolio_import_result", { tool_name:"portfolio_analyzer", method:"csv", outcome:"invalid" });setImportError(err?.message||"The CSV could not be read.");}
    event.target.value="";
  }
  function confirmAnalysis() {
    const result=validatePortfolioHoldings(rows);
    if(!rows.length || result.errors.length){setConfirmed(null);setImportError(result.errors.join(" · ")||"Add at least one holding.");return;}
    startOnce(inputMethod.current);
    trackEvent("portfolio_report_view", { tool_name:"portfolio_analyzer", analysis_mode:inputMethod.current });
    setConfirmed(result.valid.map(h=>({...h})));
    setDemo(false);setImportError("");
  }
  const clear=()=>{setRows([blank()]);setConfirmed(null);setDemo(false);setImportError("");inputMethod.current="manual";};
  return <main className="eft-workspace pb-16">
    <SEO title="Canadian Portfolio Analyzer | Manual & CSV Portfolio Breakdown" description="Private Canadian portfolio breakdown by account, currency, geography, asset type, and user-entered dividend income. No sign-in required." canonical="https://easyfinancetools.com/tools/portfolio-analyzer" noindex />
    <section className="eft-hero px-4 pb-16 pt-14 text-white sm:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <span className="eft-hero-badge">PORTFOLIO ANALYZER · PUBLIC BETA</span>
          <h1 className="eft-display mt-6 max-w-3xl text-4xl text-white sm:text-[58px]">Your investments.<br/><span className="text-[#6DDFC8]">A clearer picture.</span></h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">See the account, currency, sector and position breakdown of your holdings. Your numbers stay in your browser.</p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold">
            {["Local CSV import", "No brokerage login", "No saved portfolios", "No investment score"].map(x=><span key={x} className="rounded-full border border-white/20 bg-white/[.06] px-3 py-2">{x}</span>)}
          </div>
          <a href="#portfolio-holdings" className="eft-brand-button mt-8 !bg-[#60DABF] !text-[#092941] hover:!bg-[#A0F0DF]">Start analysis <span aria-hidden="true">→</span></a>
        </div>
        <div className="eft-dashboard-frame p-5 text-[#0B2447] sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#137B70]">HOW IT WORKS</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Three steps. One useful report.</h2>
          <ol className="mt-5 space-y-3">
            {[["01", "Add holdings", "Enter positions or import a CSV locally."], ["02", "Check the details", "Review account, FX and price inputs."], ["03", "Explore your allocation", "See descriptive portfolio metrics without ratings."]].map(([num,title,detail])=>(
              <li key={num} className="flex items-center gap-3 rounded-xl border border-[#E0E9F0] bg-[#F8FAFC] p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E1F4EF] text-sm font-extrabold text-[#137B70]">{num}</span>
                <span><span className="block text-sm font-extrabold">{title}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{detail}</span></span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-5 text-slate-500">Educational analysis only. No personalized buy/sell recommendations.</p>
        </div>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-4 sm:px-6">

    <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100">
      <strong>Scope of this beta:</strong> Manual entries and CSV files are processed in your browser memory, not uploaded. Screenshot extraction, brokerage-specific CSV conversions, live quote lookups, ETF constituent overlap, and automated sector enrichment are not available. Your sector and geography selections describe your entries, not the ETF's underlying holdings. No analysis is retained when this page closes.
    </div>

    <section id="portfolio-holdings" aria-label="Portfolio input" className="eft-surface mt-8 scroll-mt-28 p-5 sm:p-7">
      <span className="eft-eyebrow">STEP 01 · INPUT</span><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-primary dark:text-white">Enter or import holdings</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">For accounts at Wealthsimple, Questrade, IBKR, RBC Direct, TD Direct, Scotia iTRADE, BMO InvestorLine, CIBC Investor's Edge, Disnat or other brokers: use manual entry or convert to the CSV template below. Native broker exports are not automatically supported.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={loadDemo} className="min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">Try Demo Portfolio</button>
        <label htmlFor="portfolio-csv" className="flex min-h-11 cursor-pointer items-center rounded-xl border-2 border-sky-600 px-5 py-3 text-sm font-bold text-primary dark:text-sky-300">Import CSV (on-device)
          <input id="portfolio-csv" aria-label="Import a portfolio CSV file" type="file" accept=".csv,text/csv" onChange={importCsv} className="sr-only" />
        </label>
        <button type="button" onClick={()=>{startOnce("manual");inputMethod.current="manual";setRows(old=>old.length>=200?old:[...old,blank()]);setConfirmed(null);setDemo(false);}} className="min-h-11 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold dark:border-slate-600">+ Add holding</button>
        <button type="button" onClick={clear} className="min-h-11 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold dark:border-slate-600">Clear</button>
      </div>
      <button type="button" onClick={()=>setShowTemplate(v=>!v)} aria-expanded={showTemplate} className="mt-4 text-sm font-semibold text-sky-700 underline dark:text-sky-300">{showTemplate?"Hide":"Show"} CSV column template</button>
      {showTemplate&&<div className="mt-3 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-900"><p>Required columns: ticker, shares, price, currency, cadPerUnit, account. Optional: sector, region, assetType, annualDistributionPerShare, costBasisCad, specifiedForeignProperty.</p><pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words">{PORTFOLIO_CSV_HEADERS.join(",") + "\nVFV,15,132,CAD,1,TFSA,Unknown / diversified,Unknown / mixed,ETF,1.12,1900,false"}</pre><p className="mt-2">All values in this sample are illustrative. For USD, enter the CAD value of 1 USD manually. Annual distribution is per share in the security's native currency.</p></div>}
      {importError&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200">{importError}</p>}
      {demo&&<p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-bold text-blue-900 dark:bg-blue-950/30 dark:text-blue-200">Demo data — not your portfolio. Prices, distributions and currency rates are fictitious.</p>}
      <p className="mt-4 text-sm text-slate-500">{rows.length} holding(s). Changes to an analyzed portfolio invalidate the prior report until you confirm again.</p>
    </section>

    <section className="mt-6" aria-label="Review holdings">
      <span className="eft-eyebrow">STEP 02 · REVIEW</span><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-primary dark:text-white">Review and confirm your holdings</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Every entry remains editable before analysis. Price and annual distribution values are not fetched. FX conversion is entered manually; no currency data is transmitted.</p>
      <div className="mt-5 grid gap-4">
        {rows.map((holding,index)=><article key={index} className="eft-surface p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-bold text-primary dark:text-accent">Holding {index+1}{holding.ticker?" · "+holding.ticker:""}</h3><button type="button" onClick={()=>{setRows(old=>old.filter((_,i)=>i!==index));setConfirmed(null);setDemo(false);}} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700 underline dark:text-red-300">Remove</button></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <EditorField name="Ticker or label" value={holding.ticker} onChange={v=>changeRow(index,"ticker",v)} placeholder="e.g. XEQT" />
            <EditorField name="Shares / units" value={holding.shares} onChange={v=>changeRow(index,"shares",v)} type="number" step="any" />
            <EditorField name="Price per unit" value={holding.price} onChange={v=>changeRow(index,"price",v)} type="number" step="any" />
            <EditorSelect name="Currency" value={holding.currency} choices={PORTFOLIO_CURRENCIES} onChange={v=>{changeRow(index,"currency",v);}} />
            {holding.currency==="USD"&&<EditorField name="CAD per 1 USD (enter FX)" value={holding.cadPerUnit} onChange={v=>changeRow(index,"cadPerUnit",v)} type="number" step="any" />}
            <EditorSelect name="Account type" value={holding.account} choices={PORTFOLIO_ACCOUNTS} onChange={v=>changeRow(index,"account",v)} />
            <EditorSelect name="Asset class" value={holding.assetType} choices={PORTFOLIO_ASSETS} onChange={v=>changeRow(index,"assetType",v)} />
            <EditorSelect name="Sector (user-reported)" value={holding.sector} choices={PORTFOLIO_SECTORS} onChange={v=>changeRow(index,"sector",v)} />
            <EditorSelect name="Region (user-reported)" value={holding.region} choices={PORTFOLIO_REGIONS} onChange={v=>changeRow(index,"region",v)} />
            <EditorField name="Annual distribution per unit (optional)" value={holding.annualDistributionPerShare} onChange={v=>changeRow(index,"annualDistributionPerShare",v)} type="number" step="any" />
            <EditorField name="Cost basis CAD (optional)" value={holding.costBasisCad} onChange={v=>changeRow(index,"costBasisCad",v)} type="number" step="any" />
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-700 sm:col-span-2">
              <input type="checkbox" checked={Boolean(holding.specifiedForeignProperty)} onChange={e=>changeRow(index,"specifiedForeignProperty",e.target.checked)} />
              Mark as specified foreign property (taxable account only; verify CRA definition)
            </label>
          </div>
        </article>)}
      </div>
      {currentValidation.errors.length>0&&<div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100"><p className="font-bold">Fields to review</p><ul className="mt-2 list-disc pl-5">{currentValidation.errors.slice(0,8).map((err,i)=><li key={i}>{err}</li>)}</ul></div>}
      <button type="button" onClick={confirmAnalysis} disabled={!rows.length||currentValidation.errors.length>0} className="eft-brand-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40">Confirm holdings and analyze</button>
    </section>

    {analysis?.errors?.length===0&&<section className="mt-12 space-y-6" aria-label="Portfolio analysis results" aria-live="polite">
      <div><span className="eft-eyebrow">STEP 03 · REPORT</span><h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Your analysis {demo?"(demo data)":""}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Values are in CAD and based solely on your edited inputs; no live market data or ETF holdings data is fetched.</p></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Estimated market value" value={cad(analysis.totalValueCad)} detail="Sum of units × prices × manual FX" standout />
        <Stat label="Positions" value={String(analysis.count)} detail="Each entered holding row" />
        <Stat label="Top five as % of value" value={pct(analysis.top5Pct)} detail="Purely descriptive, no rating" />
        <Stat label="Positions under 1%" value={String(analysis.tinyPositions)} detail="Of total market value" />
      </div>
      <AccountDonut allocations={analysis.account} total={analysis.totalValueCad} />
      <div className="grid gap-4 md:grid-cols-2"><Allocation title="Accounts" rows={analysis.account} total={analysis.totalValueCad}/><Allocation title="Currencies (quoted denomination)" rows={analysis.currency} total={analysis.totalValueCad}/><Allocation title="Asset classes (user-reported)" rows={analysis.assetType} total={analysis.totalValueCad}/><Allocation title="Geography (user-reported)" rows={analysis.region} total={analysis.totalValueCad}/><Allocation title="Sectors (user-reported)" rows={analysis.sector} total={analysis.totalValueCad}/></div>
      <section className="eft-surface p-5 sm:p-6">
        <h3 className="text-xl font-bold text-primary dark:text-accent">Position concentration</h3>
        <p className="mt-2 text-sm">Largest individual stock: {analysis.biggestSingleStock===null?"Not available (no stock positions)":pct(analysis.biggestSingleStock)}. This is a position percentage, not a rating.</p>
        <div className="mt-4 space-y-3">{analysis.top5.map((h,i)=><div key={i} className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm dark:border-slate-700"><span>{h.ticker} · {h.account}</span><strong>{cad(h.valueCad)} · {pct(h.valueCad/analysis.totalValueCad*100)}</strong></div>)}</div>
        {analysis.duplicateTickers.length>0&&<p className="mt-3 text-sm">Ticker appearing in multiple rows: {analysis.duplicateTickers.join(", ")}. These entries are not automatically combined.</p>}
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="eft-surface p-5 sm:p-6">
          <h3 className="text-lg font-bold text-primary dark:text-accent">Dividend and distribution inputs</h3>
          <p className="mt-3 text-2xl font-bold">{cad(analysis.annualIncomeCad)} / year</p>
          <p className="mt-2 text-sm">Coverage: {analysis.knownIncomePositions} of {analysis.count} holding(s) have annual distributions entered. {analysis.allIncomeEntered?"This is the total based on entered distributions.":"This is an incomplete subtotal, NOT a portfolio yield."}</p>
          <p className="mt-2 text-sm">Indicative income / portfolio value: {pct(analysis.annualIncomeCad/analysis.totalValueCad*100)} (entered annual amounts divided by current entered values; not a verified TTM yield). Distribution type and eligible-dividend tax status are not inferred.</p>
        </article>
        <article className="eft-surface p-5 sm:p-6">
          <h3 className="text-lg font-bold text-primary dark:text-accent">ETF issuer overlap</h3>
          <p className="mt-3 text-sm leading-6">Not calculated. Underlying constituent datasets from issuers are not connected in this beta; a ticker match or sector label is not evidence of actual ETF constituent overlap. No overlap percentage is invented.</p>
        </article>
      </section>
      <section className="eft-surface p-5 sm:p-6">
        <h3 className="text-lg font-bold text-primary dark:text-accent">Canadian account and tax context</h3>
        <div className="mt-4 space-y-4 text-sm leading-6">
          {analysis.flaggedUsInTfsa.length>0?<p><strong>U.S. dividend exposure in TFSA:</strong> {analysis.flaggedUsInTfsa.map(h=>h.ticker).join(", ")}. U.S.-source dividends in TFSAs may face U.S. withholding tax; exact treatment depends on the security and fund structure. No tax amount is calculated.</p>:<p>No TFSA U.S.-source dividend positions were identifiable from your entered region and distribution data. This does not rule out indirect exposure through ETFs.</p>}
          <p><strong>Foreign-property cost basis entered in taxable accounts:</strong> {cad(analysis.foreignTaxableKnownCost)} across {analysis.foreignTaxableCount} selected position(s). {analysis.foreignCostIncomplete?"Some marked foreign-property rows lack cost basis; the subtotal is incomplete. ":""}T1135 reporting generally depends on the cost amount of all specified foreign property exceeding CAD $100,000 at any time in the year, not market value or just this portfolio. {analysis.foreignTaxableKnownCost>100000?"Your marked holdings alone exceed the usual threshold; verify reporting rules with CRA.":"Other assets may change reporting obligations."}</p>
          <p><strong>Source limitations:</strong> Account labels do not determine tax compliance. ETF look-through, actual qualified dividend status, foreign property classification and withholding are not verified.</p>
        </div>
        <p className="mt-4 text-xs text-slate-500">Official references: <a className="underline" href="https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t1135.html" target="_blank" rel="noreferrer">CRA T1135</a> · <a className="underline" href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html" target="_blank" rel="noreferrer">CRA TFSA</a>.</p>
      </section>
      <section className="eft-surface p-5 text-sm">
        <h3 className="text-lg font-bold text-primary dark:text-accent">Further resources</h3>
        <p className="mt-2">Educational analysis only. No purchase recommendations or broker offers are included.</p>
        <div className="mt-3 flex flex-wrap gap-4">{[["TFSA calculator","/tools/tfsa-calculator"],["RRSP calculator","/tools/rrsp-calculator"],["Dividend calculator","/tools/dividend-calculator"],["Account decision tool","/tools/account-decision-tool"]].map(([label,to])=><Link key={to} to={to} className="font-semibold text-sky-700 underline dark:text-sky-300">{label}</Link>)}</div>
      </section>
    </section>}
    <p className="mt-8 text-xs leading-6 text-slate-500">Privacy: entries are processed locally in memory and are cleared on page close or reload. They are not uploaded by this feature, and it does not create a user account, saved portfolio or report database. General page-view analytics and web-host logs may still operate as described in our <Link className="underline" to="/privacy">privacy policy</Link>.</p>
    </div>
  </main>;
}
