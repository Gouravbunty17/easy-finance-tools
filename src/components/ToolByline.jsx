import React from "react";
import { Link } from "react-router-dom";

export default function ToolByline({ lastUpdated = "April 2026", reviewer = "Reviewed for accuracy" }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
      <span>
        By{" "}
        <Link to="/about" className="font-semibold text-primary hover:underline dark:text-accent">
          Gourav Kumar
        </Link>
      </span>
      <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
      <span>Last updated: {lastUpdated}</span>
      <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
      <Link to="/editorial-standards" className="hover:underline">{reviewer}</Link>
    </div>
  );
}
