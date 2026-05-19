import React from "react";

export default function MobileCalculateBar({
  label = "Calculate / review results",
  targetId = "calculator-results",
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-700 dark:bg-slate-950/95 lg:hidden">
      <a
        href={`#${targetId}`}
        className="focus-ring flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-secondary"
      >
        {label}
      </a>
    </div>
  );
}
