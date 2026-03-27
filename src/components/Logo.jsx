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
      {/* Icon: Maple leaf + chart */}
      <svg width={s.icon} height={s.icon} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle */}
        <circle cx="22" cy="22" r="22" fill="#003366"/>
        {/* Maple leaf */}
        <path d="M22 6 L24 12 L30 10 L26 16 L33 18 L26 20 L28 30 L22 26 L16 30 L18 20 L11 18 L18 16 L14 10 L20 12 Z"
              fill="white" opacity="0.95"/>
        {/* Stem */}
        <rect x="20.5" y="29" width="3" height="6" rx="1.5" fill="white" opacity="0.95"/>
        {/* Dollar sign -->
        <text x="22" y="23" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="11" fill="#003366">$</text>
        {/* Chart trend line */}
        <polyline points="9,36 15,30 22,26 30,20" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"/>
        <circle cx="30" cy="20" r="2" fill="#FFD700"/>
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
