import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import Logo from './Logo';
import AdSlot from './AdSlot';

const navLinks = [
  { name: 'Tools', path: '/tools' },
  { name: 'Stocks', path: '/stocks' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <>
      {/* Top AdSense Banner */}
      <div className="w-full bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-800 text-center min-h-[60px] flex items-center justify-center">
        <AdSlot slot="1234567890" format="horizontal" />
      </div>

      <header className="bg-white dark:bg-gray-950 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Logo size="sm" />

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <NavLink key={link.name} to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors ${
                      isActive ? 'text-secondary' : 'text-gray-600 dark:text-gray-300 hover:text-secondary'
                    }`
                  }>
                  {link.name}
                </NavLink>
              ))}
              <NavLink to="/contact"
                className="text-sm bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary transition font-semibold">
                Contact
              </NavLink>
              <button
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-xs"
                title="Quick search (Ctrl+K)"
              >
                <FiSearch size={13} />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden lg:inline bg-white dark:bg-gray-700 px-1 rounded text-[10px]">⌘K</kbd>
              </button>
              <button onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>
            </nav>

            {/* Mobile buttons */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 text-gray-600 dark:text-white">
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <button onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isOpen}
                className="p-2 text-gray-600 dark:text-white">
                {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-950 border-t dark:border-gray-800 px-4 py-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map(link => (
                <NavLink key={link.name} to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `py-2 px-3 rounded-lg text-sm font-semibold ${
                      isActive ? 'bg-blue-50 text-secondary' : 'text-gray-600 dark:text-gray-300'
                    }`
                  }>
                  {link.name}
                </NavLink>
              ))}
              <NavLink to="/contact" onClick={() => setIsOpen(false)}
                className="py-2 px-3 bg-secondary text-white rounded-lg text-sm font-semibold text-center">
                Contact
              </NavLink>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
