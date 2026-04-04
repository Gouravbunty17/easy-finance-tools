import React, { useState } from "react";
import { trackReferralAction } from "../lib/analytics";

const REFERRAL_CODE = "R8F7ZW";
const REFERRAL_URL = `https://wealthsimple.com/invite/${REFERRAL_CODE}`;

export default function ReferralSection() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      trackReferralAction("copy", {
        offer_name: "wealthsimple",
        placement: "referral_section",
        cta_label: "copy_referral_code",
      });
    });
  };

  return (
    <section className="my-10">
      <p className="mb-3 text-center text-xs text-gray-400">
        Affiliate disclosure: We may earn a referral bonus if you sign up using this code. This does not change how we explain or rank tools.
      </p>

      <div className="rounded-2xl border border-[#00b2a9]/30 bg-gradient-to-br from-[#00b2a9]/10 to-[#003366]/10 p-6 dark:border-[#00b2a9]/20 dark:from-[#00b2a9]/5 dark:to-[#003366]/5">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black shadow-md">
            <span className="text-lg font-black tracking-tight text-white">WS</span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#00b2a9]/10 px-3 py-1 text-xs font-bold text-[#00b2a9]">
              Limited Offer
            </div>
            <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
              Get <span className="text-[#00b2a9]">$25 free</span> with Wealthsimple
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign up and deposit just <strong>$100</strong> to claim a <strong className="text-[#00b2a9]">$25 cash bonus</strong>. Use the referral code below at signup.
            </p>
            <p className="mt-1.5 text-xs text-gray-400">No fee to open | Takes about 5 minutes | Bonus usually arrives within days</p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg border-2 border-[#00b2a9]/40 bg-white px-4 py-2 dark:bg-gray-800">
                <span className="mb-0.5 block text-xs leading-none text-gray-400">Referral code</span>
                <span className="font-mono text-lg font-bold tracking-widest text-gray-900 dark:text-white">{REFERRAL_CODE}</span>
              </div>
              <button
                onClick={copyCode}
                aria-label={copied ? "Referral code copied" : "Copy referral code"}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                  copied ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <a
              href={REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full rounded-xl bg-black px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-gray-800"
              onClick={() => {
                trackReferralAction("click", {
                  offer_name: "wealthsimple",
                  placement: "referral_section",
                  cta_label: "sign_up_and_claim_bonus",
                  destination: REFERRAL_URL,
                });
              }}
            >
              Sign Up and Claim Bonus
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
