import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_CLUSTERS = [
  {
    title: 'TFSA',
    body: 'Room, withdrawals, account priority, and ETF fit.',
    links: [
      ['TFSA hub', '/topics/tfsa'],
      ['TFSA calculator', '/tools/tfsa-calculator'],
      ['TFSA contribution room', '/blog/tfsa-contribution-room-canada-2026'],
      ['TFSA investing mistakes', '/blog/tfsa-investing-mistakes-canada'],
    ],
  },
  {
    title: 'RRSP',
    body: 'Deduction value, refund use, retirement tax tradeoffs, and RRIF context.',
    links: [
      ['RRSP hub', '/topics/rrsp'],
      ['RRSP calculator', '/tools/rrsp-calculator'],
      ['RRSP deadline guide', '/blog/rrsp-deadline-canada-2026'],
      ['TFSA vs RRSP', '/blog/tfsa-vs-rrsp-canada-2026'],
    ],
  },
  {
    title: 'FHSA',
    body: 'Eligibility, room timing, tax savings, and first-home withdrawal rules.',
    links: [
      ['FHSA hub', '/topics/fhsa'],
      ['FHSA calculator', '/tools/fhsa-calculator'],
      ['FHSA rules', '/blog/fhsa-rules-canada-2026'],
      ['FHSA vs RRSP', '/blog/fhsa-vs-rrsp-down-payment-canada-2026'],
    ],
  },
  {
    title: 'Dividend investing',
    body: 'Income targets, ETF yield, DRIP, covered calls, and account fit.',
    links: [
      ['Dividend hub', '/topics/dividends'],
      ['Dividend calculator', '/tools/dividend-calculator'],
      ['$500/month guide', '/blog/500-month-dividend-canada'],
      ['Dividend ETFs', '/blog/best-canadian-dividend-etfs-2026'],
    ],
  },
  {
    title: 'Home buying',
    body: 'Mortgage payments, affordability, down-payment planning, and payoff tradeoffs.',
    links: [
      ['Mortgage hub', '/topics/mortgages'],
      ['Mortgage calculator', '/tools/mortgage-calculator'],
      ['Affordability calculator', '/tools/mortgage-affordability-calculator'],
      ['Pay off mortgage faster', '/blog/pay-off-mortgage-faster-canada'],
    ],
  },
  {
    title: 'Beginner investing',
    body: 'Account order, ETFs, emergency fund, and practical first steps.',
    links: [
      ['Retirement hub', '/topics/retirement'],
      ['Start investing guide', '/blog/how-to-start-investing-canada-2026'],
      ['Choose ETFs', '/blog/how-to-choose-etfs-canada'],
      ['Emergency fund', '/blog/emergency-fund-canada'],
    ],
  },
];

export default function TopicClusterMap({ clusters = DEFAULT_CLUSTERS, title = 'Explore the main Canadian finance paths' }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Topic map</p>
      <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clusters.map((cluster) => (
          <div key={cluster.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="text-xl font-bold text-primary dark:text-accent">{cluster.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{cluster.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cluster.links.map(([label, href]) => (
                <Link key={href} to={href} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:text-secondary dark:bg-gray-800 dark:text-slate-100">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
