import React from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";

export default function PrivacyNote({
  title = "Privacy-first calculator use",
  body = "Calculator inputs are processed in your browser for the current session. They are not used to create an account, build a marketing profile, or power a forced signup flow.",
  compact = false,
  className = "",
}) {
  return (
    <aside className={`rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm leading-7 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-100 ${className}`}>
      <div className="flex gap-3">
        <LockClosedIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
        <div>
          <p className="font-bold text-primary dark:text-accent">{title}</p>
          {!compact ? <p className="mt-1">{body}</p> : null}
        </div>
      </div>
    </aside>
  );
}
