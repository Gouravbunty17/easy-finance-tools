import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const COOKIES = [
  ["_ga", "Google Analytics", "Distinguishes unique users", "2 years"],
  ["_ga_3KQXRRRQFK", "Google Analytics", "Session state for this site", "2 years"],
  ["__gads", "Google AdSense", "Ad measurement and frequency capping", "13 months"],
  ["__gpi", "Google AdSense", "Personalized advertising identifier", "13 months"],
  ["IDE", "Google DoubleClick", "Ad conversion tracking", "13 months"],
  ["theme", "EasyFinanceTools (local storage)", "Remembers dark / light mode preference", "Until cleared"],
];

export default function PrivacyPolicy() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <SEO
        title="Privacy Policy"
        description="How EasyFinanceTools handles data, cookies, and third parties, and the rights available to you under PIPEDA and the GDPR."
        canonical="https://easyfinancetools.com/privacy-policy"
      />
      <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-10">Last updated: April 19, 2026</p>

      <div className="prose dark:prose-invert max-w-none">
        <p>
          This Privacy Policy explains how EasyFinanceTools ("we", "our", or "the Site") collects, uses, and protects information when you use easyfinancetools.com. We follow the requirements of Canada's <strong>Personal Information Protection and Electronic Documents Act (PIPEDA)</strong> and, where they apply to you, the European Union's <strong>General Data Protection Regulation (GDPR)</strong>.
        </p>
        <p>
          <strong>The short version:</strong> we do not collect, store, or transmit any of the values you type into our calculators. All calculator math runs entirely in your browser. We do collect limited analytics and advertising data through third-party providers (Google Analytics, Google AdSense, and our hosting provider Vercel). Details below.
        </p>

        <h2>1. Who we are</h2>
        <p>
          EasyFinanceTools is operated as an independent Canadian website and is edited by Gourav Kumar (see our <Link to="/about" className="text-secondary">About page</Link>). For privacy questions, data-access requests, or deletion requests, use our <Link to="/contact" className="text-secondary">Contact page</Link> and include "Privacy Request" in the subject line. We aim to respond within 30 days.
        </p>

        <h2>2. Information we do NOT collect</h2>
        <p>
          Any values you type into a calculator — income, balances, contribution amounts, ages, dates, home prices — <strong>stay in your browser</strong>. We do not transmit them to our servers or to any third party, and we do not log them. You can verify this by opening your browser's developer tools and watching the Network tab while you use any tool on the site.
        </p>
        <p>
          We do not ask for or collect your name, email address, phone number, home address, Social Insurance Number, bank account numbers, or any tax-filing identifier. The Site has no user accounts, no login, and no sign-up flow.
        </p>

        <h2>3. Information collected automatically by third parties</h2>
        <p>
          When you visit the Site, the following information is collected automatically by the third-party services we rely on:
        </p>
        <ul>
          <li>
            <strong>Google Analytics 4</strong> collects page URLs viewed, referring URL, session duration, approximate city-level geolocation (derived from IP), device type, browser, operating system, and language. IP addresses are anonymized by Google before storage.
          </li>
          <li>
            <strong>Google AdSense</strong> may read and write advertising cookies (<code>__gads</code>, <code>__gpi</code>, <code>IDE</code>) to measure ad performance and, where you have consented, serve personalized advertisements. Ads are selected based on page content, not on values you enter into calculators.
          </li>
          <li>
            <strong>Vercel</strong>, our hosting provider, logs the IP address and standard request metadata (URL, timestamp, user agent) for every page load. These logs are retained for approximately 30 days as part of normal server operations and abuse detection.
          </li>
        </ul>
        <p>
          No sensitive financial information, no account numbers, and no tax identifiers are ever sent to any server — ours or any third party's.
        </p>

        <h2>4. Cookies in use</h2>
        <p>The following cookies and local-storage keys may be stored on your device:</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Cookie / key</th>
                <th className="px-4 py-3 font-semibold">Provider</th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {COOKIES.map(([key, provider, purpose, duration]) => (
                <tr key={key} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-mono text-xs">{key}</td>
                  <td className="px-4 py-3">{provider}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{purpose}</td>
                  <td className="px-4 py-3">{duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          You can block or delete cookies through your browser settings. You can opt out of personalized Google advertising at <a href="https://adssettings.google.com" className="text-secondary" target="_blank" rel="noreferrer">adssettings.google.com</a>. You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-secondary" target="_blank" rel="noreferrer">Google Analytics Opt-out Browser Add-on</a>.
        </p>

        <h2>5. Third parties we share data with</h2>
        <p>We rely on the following third parties to operate the Site:</p>
        <ul>
          <li>
            <strong>Google LLC</strong> — Google Analytics and Google AdSense. Data is processed under Google's privacy policy at <a href="https://policies.google.com/privacy" className="text-secondary" target="_blank" rel="noreferrer">policies.google.com/privacy</a> and may be transferred to the United States.
          </li>
          <li>
            <strong>Vercel Inc.</strong> — hosting and content delivery. Privacy policy at <a href="https://vercel.com/legal/privacy-policy" className="text-secondary" target="_blank" rel="noreferrer">vercel.com/legal/privacy-policy</a>. Data may be transferred to the United States.
          </li>
        </ul>
        <p>
          We do not sell, rent, or trade any information collected through the Site. We do not share information with any third party for any purpose other than the operation of the Site itself.
        </p>

        <h2>6. Data retention</h2>
        <p>
          Google Analytics data is retained for 14 months, after which aggregated reports remain available but individual event data is deleted. Google AdSense cookies expire as shown in the cookie table above. Vercel server logs are retained for approximately 30 days. We do not maintain a separate user database of our own beyond what these third-party providers store.
        </p>

        <h2>7. Your rights</h2>
        <p>Depending on where you live, you have the following rights regarding your personal information:</p>
        <p>
          <strong>Under PIPEDA (Canada)</strong> you have the right to access the personal information a business holds about you, to request correction of inaccurate information, and to withdraw consent for its use. You may also complain to the <a href="https://www.priv.gc.ca" className="text-secondary" target="_blank" rel="noreferrer">Office of the Privacy Commissioner of Canada</a>.
        </p>
        <p>
          <strong>Under GDPR (European Union and United Kingdom)</strong> you additionally have the right to request deletion ("right to be forgotten"), to restrict or object to processing, to data portability, and to complain to a national data protection authority.
        </p>
        <p>
          To exercise any of these rights for data collected directly by this Site, contact us through the <Link to="/contact" className="text-secondary">Contact page</Link>. For data held by Google (Analytics and Ads), use Google's own tools at <a href="https://myaccount.google.com/data-and-privacy" className="text-secondary" target="_blank" rel="noreferrer">myaccount.google.com/data-and-privacy</a>. For data held by Vercel, use the process described in their privacy policy.
        </p>

        <h2>8. International data transfers</h2>
        <p>
          Because Google and Vercel operate globally, information collected through the Site may be transferred to, stored in, or processed in the United States and other countries outside Canada or the European Economic Area. Those providers rely on standard contractual clauses and other legally recognized transfer mechanisms.
        </p>

        <h2>9. Children's privacy</h2>
        <p>
          The Site is not directed to children under the age of 13, and we do not knowingly collect information from children. If you believe a child has provided information through the Site, contact us and we will take reasonable steps to remove it.
        </p>

        <h2>10. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page will reflect the most recent revision. Material changes will be highlighted on the home page for at least 30 days.
        </p>

        <h2>11. Contact</h2>
        <p>
          For any privacy question, data-access request, or deletion request, use our <Link to="/contact" className="text-secondary">Contact page</Link> and include "Privacy Request" in the subject. We respond within 30 days as required by PIPEDA.
        </p>

        <h2>12. Disclaimer</h2>
        <p>
          The calculators on this site are for educational purposes only and do not constitute financial, tax, or legal advice. Always consult a qualified professional before making a significant financial decision.
        </p>
      </div>
    </section>
  );
}
