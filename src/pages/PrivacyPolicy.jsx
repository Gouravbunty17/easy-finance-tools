import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const COOKIES = [
  ["_ga", "Google Analytics", "Distinguishes unique users", "2 years"],
  ["_ga_3KQXRRRQFK", "Google Analytics", "Session state for this site", "2 years"],
  ["_gid", "Google Analytics", "Distinguishes users within a 24-hour window", "24 hours"],
  ["theme", "EasyFinanceTools (local storage)", "Remembers dark / light mode preference", "Until cleared"],
];

export default function PrivacyPolicy() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <SEO
        title="Privacy Policy"
        description="How EasyFinanceTools handles data, cookies, advertising disclosures, and the rights available to you under PIPEDA, Quebec's Law 25, the GDPR, and the CCPA."
        canonical="https://easyfinancetools.com/privacy-policy"
      />
      <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-10">Last updated: April 28, 2026</p>

      <div className="prose dark:prose-invert max-w-none">
        <p>
          This Privacy Policy explains how EasyFinanceTools ("we", "our", or "the Site") collects, uses, and protects information when you use easyfinancetools.com. It is written to meet the requirements of Canada's <strong>Personal Information Protection and Electronic Documents Act (PIPEDA)</strong>, Quebec's <strong>Law 25</strong>, the European Union and United Kingdom's <strong>General Data Protection Regulation (GDPR)</strong>, and California's <strong>Consumer Privacy Act (CCPA/CPRA)</strong>, to the extent any of those laws apply to your visit.
        </p>
        <p>
          <strong>The short version:</strong> numbers you type into a calculator never leave your browser. We do not have user accounts, we do not sell data, and the only routine data collected is standard web analytics and server logs needed to run and improve the Site.
        </p>

        <h2>1. Who we are and how to contact us</h2>
        <p>
          EasyFinanceTools is an independent Canadian website operated and edited by <strong>Gourav Kumar</strong> from <strong>Brampton, Ontario, Canada</strong>. Ontario law and Canadian federal privacy law are the primary frameworks that apply to the Site. Read more on the <Link to="/about" className="text-secondary">About page</Link>.
        </p>
        <p>
          For privacy questions, data-access requests, corrections, or deletion requests, use our <Link to="/contact" className="text-secondary">Contact page</Link> and include "Privacy Request" in the subject line. We aim to respond within 30 days, as required by PIPEDA.
        </p>

        <h2>2. What data we collect</h2>
        <h3>2.1 Data we do NOT collect</h3>
        <p>
          Any values you type into a calculator, including income, balances, contribution amounts, ages, dates, home prices, RRSP room, or TFSA room, <strong>stay in your browser</strong>. All calculator math runs client-side in JavaScript. Nothing you enter is transmitted to our servers or to any third party, and nothing is logged. You can verify this by opening your browser's developer tools and watching the Network tab while using any tool on the site.
        </p>
        <p>
          We do not ask for or collect your name, email address, phone number, home address, Social Insurance Number, bank account numbers, or any tax-filing identifier. The Site has no user accounts, no login, and no sign-up flow. The only time you supply personal information is if you voluntarily send a message through the <Link to="/contact" className="text-secondary">Contact page</Link>, in which case your name, email, and message are delivered to us for the sole purpose of replying.
        </p>

        <h3>2.2 Data collected automatically</h3>
        <ul>
          <li>
            <strong>Google Analytics 4</strong> (property <code>G-3KQXRRRQFK</code>) collects anonymized page URLs viewed, referring URL, session duration, approximate city-level geolocation derived from IP, device type, browser, operating system, and language. IP addresses are truncated by Google before storage. IP anonymization is enabled by default in GA4.
          </li>
          <li>
            <strong>Vercel</strong>, our hosting and edge-CDN provider, logs the request IP address, URL, timestamp, and user-agent string for every page load. These logs are retained for approximately 30 days and are used for security, abuse detection, and debugging.
          </li>
        </ul>

        <h3>2.3 The Bank of Canada Valet API</h3>
        <p>
          Some calculators fetch live foreign-exchange rates and inflation data from the <a href="https://www.bankofcanada.ca/valet/docs" className="text-secondary" target="_blank" rel="noreferrer">Bank of Canada Valet API</a>. This is an <strong>outbound-only</strong> request: we ask the Bank of Canada for public rate data, and <strong>no information about you is sent</strong>. The Valet API does not use cookies and is not an advertising or analytics provider.
        </p>

        <h2>3. Why we collect it (legal basis)</h2>
        <p>
          Under PIPEDA, we rely on <strong>legitimate interest / implied consent</strong> to collect the minimum technical data needed to operate the Site, detect abuse, and understand aggregate usage so we can improve calculators. No personal financial information is processed, so the threshold for consent is low.
        </p>
        <p>
          Under GDPR, where it applies to visitors from the EU or UK, we rely on <strong>legitimate interest</strong> for server logs and basic analytics. If we introduce non-essential advertising, marketing, or consent-management cookies in the future, we will request consent where required by law before those technologies run.
        </p>
        <p>
          Using a calculator does not require any account, login, or personal information. You can close the tab at any time and no record of your inputs remains on our systems because none was ever transmitted.
        </p>

        <h2>4. Third-party services we use</h2>
        <p>The Site relies on the following providers:</p>
        <ul>
          <li>
            <strong>Google Analytics 4 (Google LLC)</strong> - anonymous usage analytics. See <a href="https://policies.google.com/privacy" className="text-secondary" target="_blank" rel="noreferrer">policies.google.com/privacy</a>. Data may be transferred to the United States.
          </li>
          <li>
            <strong>Vercel Inc.</strong> - hosting, edge CDN, and serverless functions, including the Contact form backend. Privacy policy: <a href="https://vercel.com/legal/privacy-policy" className="text-secondary" target="_blank" rel="noreferrer">vercel.com/legal/privacy-policy</a>. Data may be transferred to the United States.
          </li>
          <li>
            <strong>Bank of Canada</strong> - public Valet API for FX and inflation rates. Outbound data only; nothing about you is sent.
          </li>
        </ul>

        <div className="not-prose my-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          <p className="font-semibold text-primary dark:text-accent">Advertising status</p>
          <p className="mt-2">
            The Site does not currently run third-party display advertising scripts. If advertising is added later, this policy will be updated before those scripts are enabled.
          </p>
        </div>

        <p>
          We do not sell, rent, or trade your information. We do not share it with any third party for any purpose beyond operating the Site.
        </p>

        <h2>5. Your rights</h2>
        <h3>5.1 Under PIPEDA (Canada)</h3>
        <p>
          You have the right to access the personal information a business holds about you, to request correction of inaccurate information, to withdraw consent for its use going forward, and to complain to the <a href="https://www.priv.gc.ca" className="text-secondary" target="_blank" rel="noreferrer">Office of the Privacy Commissioner of Canada</a>.
        </p>

        <h3>5.2 Under Quebec's Law 25</h3>
        <p>
          Quebec residents have additional rights to data portability, to refuse automated decision-making, and to complain to the <a href="https://www.cai.gouv.qc.ca/" className="text-secondary" target="_blank" rel="noreferrer">Commission d'acces a l'information du Quebec</a>. Since the Site has no user accounts and performs no profiling, most of these rights are satisfied by the fact that we do not hold personal information about you to begin with.
        </p>

        <h3>5.3 Under GDPR (EU / UK)</h3>
        <p>
          You have the right to access, rectification, erasure ("right to be forgotten"), restriction of processing, data portability, objection to processing, and to lodge a complaint with a national data protection authority.
        </p>

        <h3>5.4 Under CCPA / CPRA (California)</h3>
        <p>
          California residents have the right to know what personal information is collected, the right to request deletion, the right to correction, and the right to opt out of the sale or sharing of personal information. <strong>We do not sell personal information</strong>, and we do not share it for cross-context behavioural advertising outside of the third parties disclosed above. There is no separate "Do Not Sell" link because there is no sale to opt out of.
        </p>

        <h3>5.5 How to exercise these rights</h3>
        <p>
          For data collected directly by this Site, contact us through the <Link to="/contact" className="text-secondary">Contact page</Link>. For data held by Google, use <a href="https://myaccount.google.com/data-and-privacy" className="text-secondary" target="_blank" rel="noreferrer">myaccount.google.com/data-and-privacy</a>. For data held by Vercel, use the process in their privacy policy.
        </p>

        <h2>6. Data retention</h2>
        <ul>
          <li><strong>Google Analytics:</strong> 14 months, the default GA4 retention window. After that, aggregated reports remain available but individual event data is deleted.</li>
          <li><strong>Vercel server logs:</strong> approximately 30 days.</li>
          <li><strong>Contact-form submissions:</strong> kept only as long as needed to reply, typically no more than 12 months.</li>
          <li><strong>No user-account database:</strong> the Site does not maintain its own user database because there are no accounts.</li>
        </ul>

        <h2>7. Cookie policy</h2>
        <p>The Site may use or receive the following cookies and local-storage keys. Essential cookies are kept to a minimum, and most in-browser state such as theme preference or calculator inputs is stored in <code>localStorage</code> and never transmitted.</p>

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
          You can block or delete cookies through your browser settings - see guides for <a href="https://support.google.com/chrome/answer/95647" className="text-secondary" target="_blank" rel="noreferrer">Chrome</a>, <a href="https://support.mozilla.org/en-US/kb/block-websites-storing-cookies-site-data" className="text-secondary" target="_blank" rel="noreferrer">Firefox</a>, <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-secondary" target="_blank" rel="noreferrer">Safari</a>, and <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-secondary" target="_blank" rel="noreferrer">Edge</a>. You can opt out of Google Analytics tracking with the <a href="https://tools.google.com/dlpage/gaoptout" className="text-secondary" target="_blank" rel="noreferrer">Google Analytics Opt-out Browser Add-on</a>.
        </p>

        <h2>8. International data transfers</h2>
        <p>
          Because Google and Vercel operate globally, information collected through the Site may be transferred to, stored in, or processed in the United States and other countries outside Canada or the European Economic Area. Those providers rely on standard contractual clauses and other legally recognized transfer mechanisms where required.
        </p>

        <h2>9. Children's privacy</h2>
        <p>
          The Site is not directed to children under the age of 13, or under 16 in jurisdictions where GDPR raises the digital-consent threshold, and we do not knowingly collect information from children. If you believe a child has provided information through the Site, contact us and we will take reasonable steps to remove it.
        </p>

        <h2>10. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time as the Site evolves or as applicable laws change. The "Last updated" date at the top of this page will reflect the most recent revision. Material changes, for example the addition of a new advertising provider or a change in advertising-consent setup, will be highlighted on the home page for at least 30 days.
        </p>

        <h2>11. Contact for privacy requests</h2>
        <p>
          Privacy questions, access requests, correction requests, and deletion requests should be sent through our <Link to="/contact" className="text-secondary">Contact page</Link> with "Privacy Request" in the subject. We respond within 30 days as required by PIPEDA.
        </p>
        <p>
          If you are not satisfied with our response, you may escalate to the <a href="https://www.priv.gc.ca" className="text-secondary" target="_blank" rel="noreferrer">Office of the Privacy Commissioner of Canada</a>, to the <a href="https://www.cai.gouv.qc.ca/" className="text-secondary" target="_blank" rel="noreferrer">Commission d'acces a l'information du Quebec</a> for Quebec residents, or to your national GDPR supervisory authority for EU or UK residents.
        </p>

        <h2>12. Disclaimer</h2>
        <p>
          The calculators on this site are for educational purposes only and do not constitute financial, tax, or legal advice. Always consult a qualified professional before making a significant financial decision.
        </p>
      </div>
    </section>
  );
}
