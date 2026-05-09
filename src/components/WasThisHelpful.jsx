import React, { useEffect, useState } from 'react';

export default function WasThisHelpful({ id, className = '' }) {
  const storageKey = `eft-helpful-${id || 'page'}`;
  const [choice, setChoice] = useState('');

  useEffect(() => {
    try {
      setChoice(window.localStorage.getItem(storageKey) || '');
    } catch {
      setChoice('');
    }
  }, [storageKey]);

  function choose(value) {
    setChoice(value);
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // Local feedback is intentionally optional.
    }
  }

  return (
    <section className={`rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Reader feedback</p>
          <h2 className="mt-1 text-xl font-bold text-primary dark:text-accent">Was this useful?</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">This saves only in your browser for now; no account or tracking profile is created.</p>
        </div>
        <div className="flex gap-2">
          {['Yes', 'Not yet'].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => choose(label)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${choice === label ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-primary hover:border-secondary dark:border-slate-700 dark:bg-gray-800 dark:text-accent'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
