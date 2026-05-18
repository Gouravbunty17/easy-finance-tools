import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function AffiliateDisclosureBox({
  title = "Affiliate disclosure",
  body = "Some pages may include referral links. A referral relationship should never change the calculator assumptions, educational examples, source references, or order of decision-making.",
  children,
  className = "",
}) {
  return (
    <aside className={`rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm leading-7 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100 ${className}`}>
      <div className="flex gap-3">
        <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
        <div>
          <p className="font-bold text-primary dark:text-accent">{title}</p>
          <p className="mt-1">{body}</p>
          {children ? <div className="mt-3">{children}</div> : null}
        </div>
      </div>
    </aside>
  );
}
