import React, { useState } from 'react';

const ReferralSection = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "R8F7ZW";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
      .then(() => {
        setCopied(true);
        // Track copy event
        gtag('event', 'referral_copy', {
          event_category: 'Referral',
          event_label: 'Copied Wealthsimple Referral Code'
        });
        // Reset after 3 seconds
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => console.error('Copy failed:', err));
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 my-8 border border-blue-100">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-3">
          Get Started with Wealthsimple
        </h2>
        <p className="text-gray-700 mb-4">
          Sign up using our referral code to get a bonus
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <div className="bg-white py-3 px-6 rounded-lg shadow-sm border border-blue-200">
            <span className="text-gray-600 mr-2">Your referral code:</span>
            <strong className="text-xl font-mono text-blue-600">{referralCode}</strong>
          </div>
          
          <button
            onClick={copyToClipboard}
            className={`py-3 px-6 rounded-lg font-medium transition-all ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
        
        <p className="text-sm text-gray-500">
          Use this code when signing up at Wealthsimple to receive your special bonus
        </p>
      </div>
    </section>
  );
};

export default ReferralSection;