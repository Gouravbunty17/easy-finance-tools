import React from 'react';

export default function UpdatedForRulesBadge({ label = 'Updated for 2026 Canadian rules', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 ${className}`}>
      {label}
    </span>
  );
}
