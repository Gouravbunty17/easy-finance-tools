import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="font-bold text-lg mb-2 text-primary dark:text-accent">EasyFinanceTools</h2>
          <p className="text-sm">
            Simplifying personal finance through free tools, resources, and education.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-primary dark:text-accent">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <NavLink to="/" className="hover:text-secondary transition-colors">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-secondary transition-colors">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/blog" className="hover:text-secondary transition-colors">
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink to="/privacy-policy" className="hover:text-secondary transition-colors">
                Privacy Policy
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-primary dark:text-accent">Contact</h3>
          <p className="text-sm mb-1">Email:</p>
          <a
            href="mailto:contact@easyfinancetools.com"
            className="text-primary underline text-sm hover:text-secondary"
          >
            contact@easyfinancetools.com
          </a>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} EasyFinanceTools. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
