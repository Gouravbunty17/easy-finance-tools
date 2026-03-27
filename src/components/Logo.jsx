import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { icon: 32, textMain: 16, textSub: 7 },
    md: { icon: 40, textMain: 20, textSub: 8 },
    lg: { icon: 52, textMain: 26, textSub: 10 },
  };
  const s = sizes[size];

  return (
    <Link to="/" className="flex items-center gap-2 group" aria-label="EasyFinanceTools Home">
      {/* Icon: Calculator */}
      <svg width={s.icon} height={s.icon} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle */}
        <circle cx="22" cy="22" r="22" fill="#003366"/>
        {/* Calculator body */}
        <rect x="10" y="7" width="24" height="30" rx="3" fill="white" opacity="0.95"/>
        {/* Screen */}
        <rect x="12.5" y="9.5" width="19" height="8" rx="1.5" fill="#003366"/>
        {/* Dollar on screen */}
        <text x="22" y="16.5" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="7" fill="#FFD700">$0.00</text>
        {/* Button rows — row 1 (gold: C, %) */}
        <rect x="12.5" y="20" width="5" height="4" rx="1" fill="#FFD700"/>
        <rect x="19.5" y="20" width="5" height="4" rx="1" fill="#FFD700"/>
        <rect x="26.5" y="20" width="5" height="4" rx="1" fill="#FFD700"/>
        {/* Button rows — row 2 (white) */}
        <rect x="12.5" y="25.5" width="5" height="3.5" rx="1" fill="#cce0ff"/>
        <rect x="19.5" y="25.5" width="5" height="3.5" rx="1" fill="#cce0ff"/>
        <rect x="26.5" y="25.5" width="5" height="3.5" rx="1" fill="#cce0ff"/>
        {/* Button rows — row 3 (white) */}
        <rect x="12.5" y="30.5" width="5" height="3.5" rx="1" fill="#cce0ff"/>
        <rect x="19.5" y="30.5" width="5" height="3.5" rx="1" fill="#cce0ff"/>
        {/* Wide equals button (gold) */}
        <rect x="26.5" y="30.5" width="5" height="3.5" rx="1" fill="#FFD700"/>
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-0">
          <span style={{fontSize: s.textMain}} className="font-extrabold text-primary dark:text-white tracking-tight">Easy</span>
          <span style={{fontSize: s.textMain}} className="font-extrabold text-secondary tracking-tight">Finance</span>
          <span style={{fontSize: s.textMain}} className="font-extrabold text-primary dark:text-white tracking-tight">Tools</span>
        </div>
        <span style={{fontSize: s.textSub}} className="text-gray-400 font-medium tracking-widest uppercase mt-0.5">
          🇨🇦 Free Canadian Calculators
        </span>
      </div>
    </Link>
  );
}
