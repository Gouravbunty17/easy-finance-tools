import React from 'react';
import useAdSense from '../hooks/useAdSense';

const AdBanner = () => {
  useAdSense(); // use the safe hook

  return (
    <div className="my-6 text-center">
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4262496331692202"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
