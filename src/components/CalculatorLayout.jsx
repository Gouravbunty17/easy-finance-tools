import React from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";
import ToolPageSchema from "./ToolPageSchema";
import ToolByline from "./ToolByline";
import PrivacyNote from "./PrivacyNote";
import SourceNote from "./SourceNote";
import CalculatorResultGuidance from "./CalculatorResultGuidance";
import RelatedContent from "./RelatedContent";
import MobileCalculateBar from "./MobileCalculateBar";
import CalculatorDecisionCheck from "./CalculatorDecisionCheck";

export function fmtCAD(value, options = {}) {
  return Number(value || 0).toLocaleString("en-CA", {
    style: "currency", currency: "CAD",
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
  });
}
export function fmtNum(value, options = {}) {
  return Number(value || 0).toLocaleString("en-CA", {
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
  });
}

export function ResultCard({ label, value, hint, tone = "default" }) {
  const toneClasses = {
    default: "bg-white text-primary dark:bg-[#152A42] dark:text-white",
    primary: "bg-[#0B2447] text-white dark:bg-[#123A5A]",
    success: "bg-[#E8F7F2] text-[#0B655A] dark:bg-emerald-950/40 dark:text-emerald-200",
    warning: "bg-[#FFF4E5] text-[#87561A] dark:bg-amber-950/40 dark:text-amber-200",
  };
  const dimClasses = {
    default: "text-slate-500 dark:text-slate-400",
    primary: "text-white/75",
    success: "text-[#287C70] dark:text-emerald-200",
    warning: "text-[#936123] dark:text-amber-200",
  };
  return <div className={`rounded-[20px] border border-slate-200/80 p-5 shadow-[0_8px_25px_rgba(11,36,71,.06)] dark:border-slate-700 ${toneClasses[tone] || toneClasses.default}`}>
    <p className={`text-xs font-bold uppercase tracking-[.12em] ${dimClasses[tone] || dimClasses.default}`}>{label}</p>
    <p className="eft-metric mt-3 break-words text-3xl font-extrabold sm:text-[34px]">{value}</p>
    {hint ? <p className={`mt-2 text-sm leading-6 ${dimClasses[tone] || dimClasses.default}`}>{hint}</p> : null}
  </div>;
}

export default function CalculatorLayout({ title, description, canonical, badge, children, results, relatedTools = [], footerNote }) {
  return <section className="eft-workspace pb-28 pt-8 lg:pb-16 lg:pt-12">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SEO title={title} description={description} canonical={canonical} />
      {canonical && title ? <ToolPageSchema name={title} description={description} canonical={canonical} category="FinanceApplication"/> : null}
      <div className="mb-8 max-w-4xl">
        <Link to="/tools" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-secondary hover:underline">← All calculators</Link>
        {badge ? <span className="eft-eyebrow mt-4 block">{badge}</span> : null}
        <h1 className="eft-display mt-3 text-4xl text-primary dark:text-white sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">{description}</p>
        <div className="mt-4"><ToolByline /></div>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,.92fr)] xl:gap-8">
        <div className="space-y-6">
          <div className="eft-surface p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-700">
              <div>
                <span className="eft-eyebrow">YOUR SCENARIO</span>
                <h2 className="mt-1 text-lg font-extrabold text-primary dark:text-white">Adjust the assumptions</h2>
              </div>
              <span className="rounded-full bg-[#E6F6F2] px-3 py-1.5 text-xs font-bold text-[#0B6C60] dark:bg-[#244B45] dark:text-[#B0F4E5]">CAD</span>
            </div>
            {children}
          </div>
          <CalculatorDecisionCheck />
        </div>
        <aside id="calculator-results" className="scroll-mt-24 space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="Calculator results">
          <div className="eft-surface overflow-hidden p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-700">
              <div><span className="eft-eyebrow">ESTIMATED RESULTS</span><h2 className="mt-1 text-lg font-extrabold text-primary dark:text-white">Your numbers at a glance</h2></div>
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E5F5F1] text-[#137B70]">↗</span>
            </div>
            {results}
            <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">Planning estimate only. Confirm assumptions and official Canadian rules before taking action.</p>
          </div>
          <CalculatorResultGuidance
            assumptions={[
              "The output uses the numbers currently entered on this page.",
              "Rates, limits, and tax treatment are simplified for planning.",
              "Results should be checked against current Canadian rules before acting.",
            ]}
            caveats={[
              "This is an educational estimate, not personalized financial, tax, legal, or investment advice.",
              "Provincial rules, eligibility, fees, and timing can change the result.",
            ]}
            nextLinks={relatedTools.slice(0,2).map(tool=>({label:tool.title,href:tool.href}))}
          />
        </aside>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <PrivacyNote compact/>
        <SourceNote title="Educational estimate" body="Verify important tax, account, rate or program rules against official Canadian sources."/>
      </div>
      {relatedTools.length > 0 && <RelatedContent className="mt-10" title="Next financial decisions" intro="Compare related Canadian rules and planning scenarios without losing context." items={relatedTools.map(tool=>({type:tool.href.startsWith("/tools/")?"Calculator":"Guide",title:tool.title,href:tool.href,body:tool.body}))} trackingContext="calculator_related_content" />}
      {footerNote && <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{footerNote}</p>}
      <MobileCalculateBar/>
    </div>
  </section>;
}
