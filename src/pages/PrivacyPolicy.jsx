import React from "react";
export default function PrivacyPolicy() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-10">Last updated: March 2026</p>
      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <div><h2 className="text-xl font-bold text-primary dark:text-white mb-2">1. No Data Collection</h2><p>EasyFinanceTools does not collect, store, or share any personal financial information you enter into our calculators. All calculations run entirely in your browser.</p></div>
        <div><h2 className="text-xl font-bold text-primary dark:text-white mb-2">2. Cookies</h2><p>We use minimal cookies only for basic site functionality (dark mode preference) and Google Analytics to understand aggregate traffic. We do not use tracking cookies for advertising.</p></div>
        <div><h2 className="text-xl font-bold text-primary dark:text-white mb-2">3. Google AdSense</h2><p>We display ads through Google AdSense to support the free operation of this site. Google may use cookies to serve relevant ads. You can opt out at <a href="https://adssettings.google.com" className="text-secondary">adssettings.google.com</a>.</p></div>
        <div><h2 className="text-xl font-bold text-primary dark:text-white mb-2">4. Disclaimer</h2><p>The calculators on this site are for educational purposes only. They do not constitute financial advice. Always consult a qualified financial advisor before making investment decisions.</p></div>
        <div><h2 className="text-xl font-bold text-primary dark:text-white mb-2">5. Contact</h2><p>For privacy questions, please use our <a href="/contact" className="text-secondary">contact page</a>.</p></div>
      </div>
    </section>
  );
}
