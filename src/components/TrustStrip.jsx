import React from "react";

function IconBase({ children, className = "", ...props }) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

function CheckCircleIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3 4.7-5.2" />
    </IconBase>
  );
}

function LockClosedIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v2" />
    </IconBase>
  );
}

function MapPinIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-4.9 7-11a7 7 0 1 0-14 0c0 6.1 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

function ClockIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

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
