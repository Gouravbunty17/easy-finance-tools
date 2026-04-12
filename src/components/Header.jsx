import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiSun, FiMoon, FiSearch } from "react-icons/fi";
import Logo from "./Logo";

const navLinks = [
  { name: "Tools", path: "/tools" },
  { name: "Stocks", path: "/stocks" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Logo size="sm" />

            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors ${
                      isActive ? "text-secondary" : "text-gray-600 hover:text-secondary dark:text-gray-300"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <button
                onClick={openSearch}
                className="focus-ring flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                title="Quick search (Ctrl+K)"
              >
                <FiSearch size={13} />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden rounded bg-white px-1 text-[11px] text-gray-700 dark:bg-gray-700 dark:text-gray-200 lg:inline">Ctrl+K</kbd>
              </button>

              <NavLink to="/contact" className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary">
                Contact
              </NavLink>

              <button
                onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="focus-ring rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={openSearch}
                aria-label="Open search"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              >
                <FiSearch size={18} />
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              >
                {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="border-t bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold ${
                      isActive ? "bg-blue-50 text-secondary" : "text-gray-600 dark:text-gray-300"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  openSearch();
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                Search tools and guides
              </button>
              <NavLink to="/contact" onClick={() => setIsOpen(false)} className="rounded-lg bg-secondary px-3 py-2 text-center text-sm font-semibold text-white">
                Contact
              </NavLink>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
