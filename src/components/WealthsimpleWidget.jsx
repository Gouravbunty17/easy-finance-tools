import React from 'react';

const WealthsimpleWidget = () => {
  return (
    <div className="my-8 p-4 bg-gray-50 rounded-lg border">
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-blue-700">
          Special Offer: Use code <strong className="font-mono bg-blue-100 px-2 py-1 rounded">R8F7ZW</strong> for bonus rewards
        </p>
      </div>
      <div id="wealthsimple-widget" className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Wealthsimple tools...</p>
        </div>
      </div>
    </div>
  );
};

export default WealthsimpleWidget;