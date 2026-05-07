import React from "react";

export default function LastUpdated({ date = "April 2026", note = "Reviewed against current Canadian source material where applicable." }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
      <strong className="text-slate-900 dark:text-white">Last updated:</strong> {date}. {note}
    </div>
  );
}
