import React from "react";
import { CheckCircleIcon, LockClosedIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

const defaultItems = [
  { label: "Canadian-focused", icon: MapPinIcon },
  { label: "No login required", icon: CheckCircleIcon },
  { label: "Calculator inputs not stored", icon: LockClosedIcon },
  { label: "Updated for 2026", icon: ClockIcon },
];

export default function TrustStrip({ items = defaultItems, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 ${className}`}>
      <ul className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon || CheckCircleIcon;
          return (
            <li key={item.label} className="flex items-center gap-2 rounded-xl px-3 py-2">
              <Icon className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
