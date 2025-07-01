import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import useAdSense from '../hooks/useAdSense';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useAdSense(); // run safe adsense hook

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: 'Calculators', path: '/calculators' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header className="bg-white dark:bg-black shadow-md sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <NavLink to="/" className="text-2xl font-bold text-primary dark:text-accent">
                EasyFinanceTools
              </NavLink>
            </div>

            <nav className="hidden md:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-lg font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-secondary dark:text-accent'
                        : 'text-neutral-dark dark:text-white hover:text-secondary dark:hover:text-accent'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <NavLink
                to="/contact"
                className="bg-secondary dark:bg-accent text-white px-4 py-2 rounded-md hover:bg-primary dark:hover:bg-yellow-600 transition"
              >
                Contact Us
              </NavLink>
              <button
                onClick={() => setIsDark(!isDark)}
                className="ml-4 p-2 rounded-md bg-neutralLight dark:bg-neutralDark text-neutral-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {isDark ? <FiSun /> : <FiMoon />}
              </button>
            </nav>

            <div className="md:hidden flex items-center space-x-2">
              <button onClick={() => setIsDark(!isDark)} className="p-2 text-primary dark:text-white">
                {isDark ? <FiSun /> : <FiMoon />}
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="text-primary dark:text-white focus:outline-none">
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white dark:bg-black border-t dark:border-neutral-800 transition">
            <nav className="flex flex-col items-center space-y-4 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium ${
                      isActive ? 'text-secondary dark:text-accent' : 'text-neutral-dark dark:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <NavLink
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="bg-secondary dark:bg-accent text-white w-3/4 text-center px-4 py-2 rounded-md hover:bg-primary dark:hover:bg-yellow-600"
              >
                Contact Us
              </NavLink>
            </nav>
          </div>
        )}
      </header>

      {/* Google AdSense Banner Below Header */}
      <div className="w-full text-center py-2">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-4262496331692202"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </>
  );
};

export default Header;
