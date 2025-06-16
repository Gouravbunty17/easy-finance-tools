import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => (
  <>
    {/* AdSense footer banner */}
    <div className="w-full text-center mb-6">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4262496331692202"
        data-ad-slot="9876543210"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>
        {(adsbygoogle = window.adsbygoogle || []).push({})}
      </script>
    </div>

    <footer className="bg-primary text-white mt-10">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">EasyFinanceTools</h3>
            <p className="text-neutral-light text-sm">Your partner in financial clarity.</p>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <NavLink to="/about" className="hover:text-secondary transition-colors">About</NavLink>
            <NavLink to="/contact" className="hover:text-secondary transition-colors">Contact</NavLink>
            <NavLink to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</NavLink>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-6 pt-4 text-center text-sm text-neutral-light">
          &copy; {new Date().getFullYear()} EasyFinanceTools — All rights reserved.
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
