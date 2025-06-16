import React, { useEffect } from 'react';

const AdBlock = ({ slot, format = 'auto', style = {} }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

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
