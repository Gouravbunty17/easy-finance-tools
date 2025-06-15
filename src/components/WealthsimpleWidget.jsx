import React, { useEffect } from 'react';

const WealthsimpleWidget = () => {
  useEffect(() => {
    const initWealthsimple = () => {
      if (window.ws && typeof window.ws === 'function') {
        try {
          window.ws('destroy');
          window.ws('init', window.wealthsimpleRedesignSettings);
        } catch (e) {
          console.error('Wealthsimple error:', e);
        }
      } else {
        setTimeout(initWealthsimple, 500);
      }
    };

    initWealthsimple();

    return () => {
      if (window.ws && typeof window.ws === 'function') {
        window.ws('destroy');
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md text-blue-800">
        <p>
          💸 <strong>Special Offer:</strong> Use referral code{' '}
          <span className="font-mono bg-white px-2 py-1 rounded border border-blue-300">R8F7ZW</span> to get $25 when you sign up.
        </p>
      </div>

      <div
        id="wealthsimple-widget"
        className="min-h-[300px] border rounded-lg bg-white shadow-sm mt-6 flex items-center justify-center"
      >
        <div className="text-center text-gray-400">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full mx-auto mb-3" />
          <p>Loading Wealthsimple investment tools...</p>
        </div>
      </div>

      <p className="text-center text-sm mt-4 text-blue-600 underline">
        <a
          href="https://wealthsimple.com/invite/R8F7ZW"
          target="_blank"
          rel="noopener noreferrer"
        >
          Or click here to claim your $25 bonus →
        </a>
      </p>
    </div>
  );
};

export default WealthsimpleWidget;
