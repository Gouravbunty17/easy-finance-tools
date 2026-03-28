import React, { useState } from 'react';

const REFERRAL_CODE = "R8F7ZW";
const REFERRAL_URL = `https://wealthsimple.com/invite/${REFERRAL_CODE}`;

export default function ReferralSection() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'referral_copy', {
          event_category: 'Referral',
          event_label: 'Wealthsimple Code Copied',
        });
      }
    });
  };

  return (
    <section className="my-10">
      {/* Affiliate disclosure */}
      <p className="text-xs text-gray-400 text-center mb-3">
        ⓘ Affiliate disclosure: We may earn a referral bonus if you sign up using our code. This never affects our recommendations.
      </p>

      <div className="bg-gradient-to-br from-[#00b2a9]/10 to-[#003366]/10 dark:from-[#00b2a9]/5 dark:to-[#003366]/5 border border-[#00b2a9]/30 dark:border-[#00b2a9]/20 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Logo / brand mark */}
          <div className="shrink-0 w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-white font-black text-lg tracking-tight">WS</span>
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-[#00b2a9]/10 text-[#00b2a9] text-xs font-bold px-3 py-1 rounded-full mb-2">
              🎁 Limited Offer
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
              Get <span className="text-[#00b2a9]">$25 free</span> with Wealthsimple 🇨🇦
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign up for Canada's #1 investing app and deposit just <strong>$100</strong> to claim your <strong className="text-[#00b2a9]">$25 cash bonus</strong>. Use our referral code at signup.
            </p>
            <p className="text-xs text-gray-400 mt-1.5">✅ No fee to open &nbsp;·&nbsp; ✅ Takes 5 minutes &nbsp;·&nbsp; ✅ Bonus paid within days</p>
          </div>

          {/* Code + CTA */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-white dark:bg-gray-800 border-2 border-[#00b2a9]/40 rounded-lg px-4 py-2">
                <span className="text-xs text-gray-400 block leading-none mb-0.5">Referral code</span>
                <span className="font-mono font-bold text-lg text-gray-900 dark:text-white tracking-widest">{REFERRAL_CODE}</span>
              </div>
              <button
                onClick={copyCode}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Copy referral code"
              >
                {copied ? '✅' : '📋'}
              </button>
            </div>
            <a
              href={REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full text-center bg-black text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition"
              onClick={() => {
                if (typeof window.gtag === 'function') {
                  window.gtag('event', 'referral_click', {
                    event_category: 'Referral',
                    event_label: 'Wealthsimple Sign Up Click',
                  });
                }
              }}
            >
              Sign Up & Claim Bonus →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
