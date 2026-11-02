import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { SITEWIDE_FINANCIAL_DISCLAIMER } from "./PageDisclaimer";

const columns = [
  {title:"Explore tools",links:[["Income Tax","/tools/income-tax-calculator"],["TFSA Calculator","/tools/tfsa-calculator"],["RRSP Calculator","/tools/rrsp-calculator"],["Mortgage Calculator","/tools/mortgage-calculator"],["Portfolio Analyzer","/tools/portfolio-analyzer"],["All calculators","/tools"]]},
  {title:"Learn & verify",links:[["Canadian guides","/blog"],["Methodology","/methodology"],["Editorial standards","/editorial-standards"],["Founder transparency","/founder-transparency"],["Corrections","/corrections"]]},
  {title:"About & legal",links:[["About","/about"],["Contact","/contact"],["Privacy","/privacy"],["Terms","/terms"],["Affiliate disclosure","/affiliate-disclosure"],["Full disclaimer","/disclaimer"]]},
];
export default function Footer() {
  return <footer className="mt-auto bg-[#071A32] text-white" role="contentinfo">
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.25fr_2fr]">
        <div>
          <div className="inline-flex rounded-2xl bg-white px-4 py-3"><Logo size="md" /></div>
          <h2 className="mt-6 max-w-xs text-[27px] font-extrabold leading-tight tracking-tight">Financial clarity starts with a better question.</h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">Independent, source-linked Canadian calculators and decision guides. No login required. Educational only—not licensed financial advice.</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#28766F] bg-[#123D42] px-3 py-2 text-xs font-semibold text-[#9CF2DE]"><span className="h-2 w-2 rounded-full bg-[#65D6BC]" />Built for Canadians</span>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map(column=><nav key={column.title} aria-label={column.title}>
            <h3 className="text-xs font-extrabold uppercase tracking-[.15em] text-[#6DDFC8]">{column.title}</h3>
            <ul className="mt-5 space-y-3">{column.links.map(([name,to])=><li key={to}><Link to={to} className="text-sm text-slate-300 transition hover:text-white hover:underline hover:underline-offset-4">{name}</Link></li>)}</ul>
          </nav>)}
        </div>
      </div>
      <div className="mt-7 rounded-2xl border border-white/10 bg-white/[.04] p-5 text-xs leading-6 text-slate-300">
        <p className="mb-2 font-bold text-white">Important financial disclaimer</p>
        <p>{SITEWIDE_FINANCIAL_DISCLAIMER}</p>
        <p className="mt-2">The calculators use simplified assumptions and can be wrong for your circumstances. Verify tax, account, eligibility and lender rules with the relevant authority. Referral links, if present, are disclosed near the offer.</p>
      </div>
      <div className="mt-7 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:justify-between">
        <span>© 2026 EasyFinanceTools. All rights reserved.</span>
        <span>Independently developed in Canada · Privacy-conscious planning</span>
      </div>
    </div>
  </footer>;
}
