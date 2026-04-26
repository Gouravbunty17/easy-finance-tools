import React from 'react';
import { useLocation } from 'react-router-dom';

export default function EzoicAd({
  placementId,
  wrapperClassName = '',
  label = 'Advertisement',
}) {
  const location = useLocation();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const ez = window.ezstandalone;
    if (!ez) return;

    if (typeof ez.showAds === 'function') {
      try {
        ez.showAds(placementId);
      } catch (error) {
        console.warn(`Ezoic placement ${placementId} failed to load.`, error);
      }
      return;
    }

    ez.cmd = Array.isArray(ez.cmd) ? ez.cmd : [];
    ez.cmd.push(() => {
      if (typeof window.ezstandalone?.showAds !== 'function') return;

      try {
        window.ezstandalone.showAds(placementId);
      } catch (error) {
        console.warn(`Ezoic placement ${placementId} failed to load from queue.`, error);
      }
    });
  }, [location.pathname, location.search, placementId]);

  return (
    <section
      className={wrapperClassName}
      data-ezoic-placement-id={placementId}
      aria-label={`Advertisement slot ${placementId}`}
    >
      {label ? (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
      ) : null}
      <div id={`ezoic-pub-ad-placeholder-${placementId}`}></div>
    </section>
  );
}
