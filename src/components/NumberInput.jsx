import React from "react";

export default function NumberInput({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
  placeholder,
  min,
  max,
  step = "any",
  error,
  inputMode = "decimal",
  className = "",
}) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
        {suffix ? <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">{suffix}</span> : null}
      </div>

      <div
        className={`focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 flex items-center rounded-2xl border bg-white px-4 py-3 dark:bg-slate-900 ${
          error
            ? "border-rose-300 dark:border-rose-700"
            : "border-slate-200 dark:border-slate-700"
        }`}
      >
        {prefix ? <span className="mr-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{prefix}</span> : null}
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="w-full border-0 bg-transparent p-0 text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />
        {suffix && !label ? <span className="ml-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{suffix}</span> : null}
      </div>

      {error ? (
        <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </label>
  );
}
