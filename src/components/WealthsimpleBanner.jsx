import React, { useEffect } from 'react';

const WealthsimpleWidget = () => {
  useEffect(() => {
    // Initialize or reinitialize Wealthsimple widget
    const initWealthsimple = () => {
      if (window.ws && typeof window.ws === 'function') {
        try {
          window.ws('destroy');
          window.ws('init', window.wealthsimpleRedesignSettings);
          gtag('event', 'wealthsimple_widget_loaded', {
            event_category: 'Engagement',
            event_label: 'Wealthsimple Widget'
          });
        } catch (e) {
          console.error('Wealthsimple error:', e);
        }
      } else {
        // Retry if not loaded yet
        setTimeout(initWealthsimple, 500);
      }
    };
    
    initWealthsimple();
    
    return () => {
      // Cleanup on unmount
      if (window.ws && typeof window.ws === 'function') {
        window.ws('destroy');
      }
    };
  }, []);

  return (
    <div className="wealthsimple-container my-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
        <p className="text-blue-700">
          <strong>Referral disclosure:</strong> This may be a referral link. We may earn a commission or bonus, but this does not affect our educational content. Verify Wealthsimple's current terms before opening an account. Referral code: <span className="font-mono bg-blue-100 px-2 py-1 rounded">R8F7ZW</span>
        </p>
      </div>
      
      <div id="wealthsimple-widget" className="min-h-[300px] flex items-center justify-center border rounded-lg bg-gray-50">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading Wealthsimple investment tools...</p>
          <p className="text-sm text-gray-400 mt-2">If this doesn't load, please refresh the page</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-3 text-center">
        Wealthsimple is a third-party platform. Sign-up may be required, fees may apply, and terms can change.
      </p>
    </div>
  );
};

export default WealthsimpleWidget;
