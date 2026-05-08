import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";

export default function LegacyRedirect({ to }) {
  useEffect(() => {
    if (window.__EFT_PRERENDERING__) return;
    window.location.replace(to);
  }, [to]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <SEO
        title="Page Moved | Easy Finance Tools"
        description="This Easy Finance Tools page has moved to its current canonical URL."
        canonical={`https://easyfinancetools.com${to}`}
        robots="noindex,follow"
      />
      <h1 className="text-4xl font-bold text-primary dark:text-accent">Page moved</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        This old URL now points to the current Easy Finance Tools page.
      </p>
      <Link to={to} className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-secondary">
        Go to the current page
      </Link>
    </main>
  );
}
