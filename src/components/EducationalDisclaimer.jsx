import React from 'react';

export default function EducationalDisclaimer({ className = '', compact = false }) {
  return (
    <section
      className={`rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950 shadow-sm dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100 ${className}`}
      aria-label="Important educational disclaimer"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-base font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
          !
        </div>
        <div>
          <p className="font-bold text-amber-950 dark:text-amber-100">
            Important: educational information only
          </p>
          <p className="mt-1">
            EasyFinanceTools provides calculators, examples, and articles for general education only. Nothing on this site is personal financial, investment, tax, legal, mortgage, or accounting advice.
          </p>
          {!compact ? (
            <p className="mt-2">
              Results are estimates based on the inputs and assumptions shown. Investment returns, dividends, interest rates, tax rules, contribution room, and government benefit amounts can change. Always verify numbers with official sources such as CRA, your financial institution, or a qualified professional before making decisions.
            </p>
          ) : null}
          <p className="mt-2 font-semibold">
            Investing involves risk. Past performance, advertised yields, and calculator examples do not guarantee future results.
          </p>
        </div>
      </div>
    </section>
  );
}
