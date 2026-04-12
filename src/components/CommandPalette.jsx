import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const items = [
  { icon: "TF", title: "TFSA Calculator", category: "Savings", link: "/tools/tfsa-calculator" },
  { icon: "RR", title: "RRSP Calculator", category: "Savings", link: "/tools/rrsp-calculator" },
  { icon: "FH", title: "FHSA Calculator", category: "Savings", link: "/tools/fhsa-calculator" },
  { icon: "MT", title: "Mortgage Calculator", category: "Real Estate", link: "/tools/mortgage-calculator" },
  { icon: "RB", title: "Rent vs Buy Calculator", category: "Real Estate", link: "/tools/rent-vs-buy" },
  { icon: "CG", title: "Capital Gains Tax Calculator", category: "Tax", link: "/tools/capital-gains-tax" },
  { icon: "CP", title: "CPP & OAS Estimator", category: "Retirement", link: "/tools/cpp-oas-estimator" },
  { icon: "DV", title: "Dividend Calculator", category: "Investing", link: "/tools/dividend-calculator" },
  { icon: "BD", title: "Budget Tracker",     category: "Budget", link: "/tools/budget-tracker" },
  { icon: "TP", title: "Tip Calculator",     category: "Budget", link: "/tools/tip-calculator" },
  { icon: "GS", title: "GST/HST Calculator",           category: "Tax",       link: "/tools/gst-hst-calculator" },
  { icon: "SH", title: "Salary to Hourly Calculator", category: "Budget",    link: "/tools/salary-to-hourly-calculator" },
  { icon: "FX", title: "CAD/USD Converter",            category: "Investing", link: "/tools/cad-usd-converter" },
  { icon: "IN", title: "Inflation Calculator",          category: "Budget",    link: "/tools/inflation-calculator" },
  { icon: "ST", title: "Stocks", category: "Investing", link: "/stocks" },
  { icon: "BL", title: "Blog", category: "Pages", link: "/blog" },
  { icon: "AB", title: "About", category: "Pages", link: "/about" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = query
    ? items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()))
    : items;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const go = useCallback(
    (link) => {
      navigate(link);
      close();
    },
    [navigate, close]
  );

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  useEffect(() => {
    if (open) {
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((current) => Math.min(current + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((current) => Math.max(current - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      go(filtered[selected].link);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-24" onClick={close}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">Search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools and pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400 dark:text-white"
          />
          <kbd className="hidden rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400 dark:bg-gray-800 sm:block">Esc</kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <li className="py-8 text-center text-sm text-gray-400">No results</li>
          ) : (
            filtered.map((item, i) => (
              <li key={item.link}>
                <button
                  onClick={() => go(item.link)}
                  onMouseEnter={() => setSelected(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected ? "bg-primary/10 dark:bg-primary/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-secondary dark:bg-slate-800">
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{item.title}</span>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">{item.category}</span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="flex gap-4 border-t border-gray-100 px-4 py-2 text-xs text-gray-400 dark:border-gray-800">
          <span>
            <kbd className="rounded bg-gray-100 px-1 dark:bg-gray-800">Up/Down</kbd> navigate
          </span>
          <span>
            <kbd className="rounded bg-gray-100 px-1 dark:bg-gray-800">Enter</kbd> open
          </span>
          <span>
            <kbd className="rounded bg-gray-100 px-1 dark:bg-gray-800">Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
