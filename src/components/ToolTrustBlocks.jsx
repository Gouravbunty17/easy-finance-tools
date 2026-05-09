import React from "react";

function TrustBlock({ eyebrow, title, children, tone = "slate", className = "" }) {
  const tones = {
    slate: "border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-800",
    blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20",
    amber: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20",
    emerald: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20",
  };

  return (
    <section className={`rounded-3xl border p-5 shadow-sm ${tones[tone] || tones.slate} ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-bold text-primary dark:text-accent">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  );
}

export function WhyThisToolExists({ children, title = "Why this tool exists", className = "" }) {
  return (
    <TrustBlock eyebrow="Decision support" title={title} tone="emerald" className={className}>
      {children}
    </TrustBlock>
  );
}

export function WhenThisToolIsWeakest({ children, title = "When this tool is weakest", className = "" }) {
  return (
    <TrustBlock eyebrow="Limitations" title={title} tone="amber" className={className}>
      {children}
    </TrustBlock>
  );
}

export function WhatCanBreakThisEstimate({ children, title = "What can break this estimate", className = "" }) {
  return (
    <TrustBlock eyebrow="Uncertainty check" title={title} tone="blue" className={className}>
      {children}
    </TrustBlock>
  );
}

export function StressTestYourInputs({ children, title = "Stress-test your inputs", className = "" }) {
  return (
    <TrustBlock eyebrow="Scenario discipline" title={title} tone="slate" className={className}>
      {children}
    </TrustBlock>
  );
}
