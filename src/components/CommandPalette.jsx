import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const items = [
  { icon: "💰", title: "TFSA Calculator", category: "Savings", link: "/tools/tfsa-calculator" },
  { icon: "📈", title: "RRSP Calculator", category: "Savings", link: "/tools/rrsp-calculator" },
  { icon: "🏠", title: "FHSA Calculator", category: "Savings", link: "/tools/fhsa-calculator" },
  { icon: "🏡", title: "Mortgage Calculator", category: "Real Estate", link: "/tools/mortgage-calculator" },
  { icon: "⚖️", title: "Rent vs Buy Calculator", category: "Real Estate", link: "/tools/rent-vs-buy" },
  { icon: "📊", title: "Capital Gains Tax Calculator", category: "Tax", link: "/tools/capital-gains-tax" },
  { icon: "🇨🇦", title: "CPP & OAS Estimator", category: "Retirement", link: "/tools/cpp-oas-estimator" },
  { icon: "💵", title: "Dividend Calculator", category: "Investing", link: "/tools/dividend-calculator" },
  { icon: "📊", title: "Budget Tracker", category: "Budget", link: "/tools/budget-tracker" },
  { icon: "📉", title: "Stocks", category: "Investing", link: "/stocks" },
  { icon: "📝", title: "Blog", category: "Pages", link: "/blog" },
  { icon: "ℹ️", title: "About", category: "Pages", link: "/about" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = query
    ? items.filter(i =>
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.category.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const go = useCallback((link) => {
    navigate(link);
    close();
  }, [navigate, close]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
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
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      go(filtered[selected].link);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools and pages..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm"
          />
          <kbd className="hidden sm:block text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">Esc</kbd>
        </div>

        {/* Results */}
        <ul className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <li className="text-center text-gray-400 py-8 text-sm">No results</li>
          ) : (
            filtered.map((item, i) => (
              <li key={item.link}>
                <button
                  onClick={() => go(item.link)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected
                      ? "bg-primary/10 dark:bg-primary/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="text-xl w-7 text-center">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{item.title}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{item.category}</span>
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex gap-4 text-xs text-gray-400">
          <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 rounded">↵</kbd> open</span>
          <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
