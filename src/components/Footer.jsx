import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-3 text-accent">EasyFinanceTools</h3>
            <p className="text-blue-200 text-sm">
              Free, private financial calculators for Canadians. No sign-up required.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Tools</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><Link to="/tools/tfsa-calculator" className="hover:text-white">TFSA Calculator</Link></li>
              <li><Link to="/tools/rrsp-calculator" className="hover:text-white">RRSP Calculator</Link></li>
              <li><Link to="/tools/dividend-calculator" className="hover:text-white">Dividend Calculator</Link></li>
              <li><Link to="/tools/budget-tracker" className="hover:text-white">Budget Tracker</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-blue-800 bg-white/5 p-4 text-sm text-blue-100">
          <p className="font-semibold text-white">Methodology and disclosure</p>
          <p className="mt-2">
            Tool outputs are educational estimates based on current assumptions, published limits, and visible methodology on each calculator page. We do not store calculator inputs in our database. Some pages may contain ads or referral links, and any partner relationship should be disclosed on-page before a recommendation appears.
          </p>
        </div>

        <div className="border-t border-blue-800 pt-6 text-center text-blue-300 text-sm">
          <p>&copy; {new Date().getFullYear()} EasyFinanceTools. All rights reserved. Not financial advice.</p>
          <p className="mt-1">Built in Canada for Canadian savers, investors, and households.</p>
        </div>
      </div>
    </footer>
  );
}
