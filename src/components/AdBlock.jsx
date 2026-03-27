import React from 'react';
import useAdSense from '../hooks/useAdSense';

const AdBlock = ({ slot, format = 'auto', style = {} }) => {
  useAdSense(); // use the safe hook

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', textAlign: 'center', ...style }}
      data-ad-client="ca-pub-4262496331692202"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdBlock;
