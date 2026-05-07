import React, { useEffect } from "react";

const WealthsimpleWidget = () => {
  useEffect(() => {
    const initWealthsimple = () => {
      if (window.ws && typeof window.ws === "function") {
        try {
          window.ws("destroy");
          window.ws("init", window.wealthsimpleRedesignSettings);
        } catch (e) {
          console.error("Wealthsimple error:", e);
        }
      } else {
        setTimeout(initWealthsimple, 500);
      }
    };

    initWealthsimple();

    return () => {
      if (window.ws && typeof window.ws === "function") {
        window.ws("destroy");
      }
    };
  }, []);

  return (
    <div className="mx-auto my-12 max-w-4xl px-4">
      <div className="rounded-md border-l-4 border-blue-500 bg-blue-50 p-4 text-blue-800">
        <p>
          <strong>Referral disclosure:</strong> This may be a referral link. We may earn a commission or bonus, but this does not affect our educational content. Verify Wealthsimple's current terms before opening an account. Referral code{" "}
          <span className="rounded border border-blue-300 bg-white px-2 py-1 font-mono">R8F7ZW</span>.
        </p>
      </div>

      <div
        id="wealthsimple-widget"
        className="mt-6 flex min-h-[300px] items-center justify-center rounded-lg border bg-white shadow-sm"
      >
        <div className="text-center text-gray-400">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
          <p>Loading Wealthsimple investment tools...</p>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-blue-600 underline">
        <a
          href="https://wealthsimple.com/invite/R8F7ZW"
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          View Wealthsimple terms
        </a>
      </p>
    </div>
  );
};

export default WealthsimpleWidget;
