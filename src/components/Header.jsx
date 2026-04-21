import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const navLinks = [
  { name: "Tools", path: "/tools" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
];

function IconBase({ children, size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

function SearchIcon({ size }) {
  return (
    <IconBase size={size}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </IconBase>
  );
}

function MoonIcon({ size }) {
  return (
    <IconBase size={size}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </IconBase>
  );
}

function SunIcon({ size }) {
  return (
    <IconBase size={size}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" x2="12" y1="1" y2="3" />
      <line x1="12" x2="12" y1="21" y2="23" />
      <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
      <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
      <line x1="1" x2="3" y1="12" y2="12" />
      <line x1="21" x2="23" y1="12" y2="12" />
      <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
      <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
    </IconBase>
  );
}

function MenuIcon({ size }) {
  return (
    <IconBase size={size}>
      <line x1="3" x2="21" y1="12" y2="12" />
      <line x1="3" x2="21" y1="6" y2="6" />
      <line x1="3" x2="21" y1="18" y2="18" />
    </IconBase>
  );
}

function CloseIcon({ size }) {
  return (
    <IconBase size={size}>
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </IconBase>
  );
}

export default function Header({ onOpenSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem("theme") === "dark");
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;

    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark, themeReady]);

  const openSearch = () => {
    onOpenSearch?.();
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
                      isActive ? "text-primary dark:text-accent" : "text-gray-600 hover:text-secondary dark:text-gray-300"
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
                <SearchIcon size={13} />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden rounded bg-white px-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200 lg:inline">Ctrl+K</kbd>
              </button>

              <NavLink to="/contact" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a4c89]">
                Contact
              </NavLink>

              <button
                onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="focus-ring rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
              </button>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={openSearch}
                aria-label="Open search"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              >
                <SearchIcon size={18} />
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              >
                {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              >
                {isOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
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
                      isActive ? "bg-blue-50 text-primary dark:bg-slate-800 dark:text-accent" : "text-gray-600 dark:text-gray-300"
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
              <NavLink to="/contact" onClick={() => setIsOpen(false)} className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white">
                Contact
              </NavLink>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
