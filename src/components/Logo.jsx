import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { icon: 40, textMain: 20, textSub: 10 },
    md: { icon: 40, textMain: 20, textSub: 10 },
    lg: { icon: 52, textMain: 26, textSub: 11 },
  };
  const s = sizes[size];

  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="EasyFinanceTools Home">
      <svg width={s.icon} height={s.icon} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="22" fill="#003366" />
        <rect x="10" y="7" width="24" height="30" rx="3" fill="white" opacity="0.95" />
        <rect x="12.5" y="9.5" width="19" height="8" rx="1.5" fill="#003366" />
        <text x="22" y="16.5" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="7" fill="#FFD700">
          $0.00
        </text>
        <rect x="12.5" y="20" width="5" height="4" rx="1" fill="#FFD700" />
        <rect x="19.5" y="20" width="5" height="4" rx="1" fill="#FFD700" />
        <rect x="26.5" y="20" width="5" height="4" rx="1" fill="#FFD700" />
        <rect x="12.5" y="25.5" width="5" height="3.5" rx="1" fill="#cce0ff" />
        <rect x="19.5" y="25.5" width="5" height="3.5" rx="1" fill="#cce0ff" />
        <rect x="26.5" y="25.5" width="5" height="3.5" rx="1" fill="#cce0ff" />
        <rect x="12.5" y="30.5" width="5" height="3.5" rx="1" fill="#cce0ff" />
        <rect x="19.5" y="30.5" width="5" height="3.5" rx="1" fill="#cce0ff" />
        <rect x="26.5" y="30.5" width="5" height="3.5" rx="1" fill="#FFD700" />
      </svg>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-0.5">
          <span style={{ fontSize: s.textMain }} className="font-extrabold tracking-tight text-primary dark:text-white">
            Easy
          </span>
          <span style={{ fontSize: s.textMain }} className="font-extrabold tracking-tight text-[#004d73] dark:text-accent">
            Finance
          </span>
          <span style={{ fontSize: s.textMain }} className="font-extrabold tracking-tight text-primary dark:text-white">
            Tools
          </span>
        </div>
        <span style={{ fontSize: s.textSub }} className="mt-0.5 font-medium uppercase tracking-[0.22em] text-gray-700 dark:text-gray-300">
          Free Canadian Calculators
        </span>
      </div>
    </Link>
  );
}
