import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ size = "md" }) {
  const large = size === "lg";
  return (
    <Link to="/" className="group inline-flex shrink-0 items-center gap-2.5" aria-label="Easy Finance Tools home">
      <svg aria-hidden="true" focusable="false" width={large ? 52 : 42} height={large ? 52 : 42} viewBox="0 0 48 48" fill="none">
        <rect x="1" y="1" width="46" height="46" rx="13" fill="#0B2447"/>
        <rect x="1.5" y="1.5" width="45" height="45" rx="12.5" stroke="white" strokeOpacity=".2"/>
        <path d="M11 32.5H37" stroke="#6486A6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12.5 27.5L20 21.5L25.5 25L36 13.5" stroke="#52D4BA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M29 13.5H36V20.5" stroke="#E7AB57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 31V35M22 29V35M30 25V35" stroke="#E7AB57" strokeOpacity=".9" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={`${large ? "text-[23px]" : "text-[18px] sm:text-[19px]"} whitespace-nowrap font-extrabold tracking-[-0.065em] text-primary dark:text-white`}>
          Easy<span className="text-secondary dark:text-[#6BE3CA]">Finance</span>Tools
        </span>
        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[.17em] text-slate-500 dark:text-slate-400">
          CANADIAN FINANCIAL TOOLS
        </span>
      </span>
    </Link>
  );
}
