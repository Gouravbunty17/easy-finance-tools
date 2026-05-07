import React from "react";
import { Link } from "react-router-dom";

export const SITEWIDE_FINANCIAL_DISCLAIMER =
  "Easy Finance Tools provides educational calculators and general information only. Results are estimates and are not financial, investment, tax, legal, or mortgage advice. Always verify details with official sources or a qualified professional.";

export default function PageDisclaimer({ compact = false, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100 ${className}`}
      aria-label="Financial disclaimer"
    >
      <p className="font-bold text-amber-950 dark:text-amber-100">Educational information only</p>
      <p className="mt-1">{SITEWIDE_FINANCIAL_DISCLAIMER}</p>
      {!compact ? (
        <p className="mt-2">
          See the{" "}
          <Link to="/disclaimer" className="font-semibold underline underline-offset-2">
            full disclaimer
          </Link>{" "}
          and{" "}
          <Link to="/methodology" className="font-semibold underline underline-offset-2">
            methodology
          </Link>{" "}
          before relying on a result for a material decision.
        </p>
      ) : null}
    </section>
  );
}
