import React from 'react';
import { Link } from 'react-router-dom';

const TOOL_GROUPS = {
  tfsa: [
    { label: 'TFSA calculator', href: '/tools/tfsa-calculator', body: 'Estimate room, growth, and over-contribution risk.' },
    { label: 'Account decision tool', href: '/tools/account-decision-tool', body: 'Compare TFSA, RRSP, and FHSA priority.' },
  ],
  rrsp: [
    { label: 'RRSP calculator', href: '/tools/rrsp-calculator', body: 'Estimate refund value and retirement tradeoffs.' },
    { label: 'Account decision tool', href: '/tools/account-decision-tool', body: 'Check whether TFSA, RRSP, or FHSA fits first.' },
  ],
  fhsa: [
    { label: 'FHSA calculator', href: '/tools/fhsa-calculator', body: 'Model tax savings and down-payment growth.' },
    { label: 'Mortgage affordability', href: '/tools/mortgage-affordability-calculator', body: 'Compare savings plan with a purchase budget.' },
  ],
  dividends: [
    { label: 'Dividend calculator', href: '/tools/dividend-calculator', body: 'Compare yield, capital required, and DRIP scenarios.' },
    { label: 'TFSA calculator', href: '/tools/tfsa-calculator', body: 'Check room before placing income assets in a TFSA.' },
  ],
  mortgage: [
    { label: 'Mortgage calculator', href: '/tools/mortgage-calculator', body: 'Estimate payments, interest, insurance, and stress-test context.' },
    { label: 'Mortgage affordability', href: '/tools/mortgage-affordability-calculator', body: 'Back into a safer purchase range from income and debt.' },
  ],
};

export default function RelatedDecisionTools({ topic = 'tfsa', title = 'Related decision tools', className = '' }) {
  const tools = TOOL_GROUPS[topic] || TOOL_GROUPS.tfsa;

  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Continue planning</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.href} to={tool.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="font-bold text-primary dark:text-accent">{tool.label}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{tool.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
