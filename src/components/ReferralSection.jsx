import React, { useState } from "react";
import { trackReferralAction } from "../lib/analytics";

const REFERRAL_CODE = "R8F7ZW";
const REFERRAL_URL = `https://wealthsimple.com/invite/${REFERRAL_CODE}`;

export default function ReferralSection({
  placement = "referral_section",
  disclosure = "This may be a referral link. We may earn a commission or bonus, but this does not affect our educational content.",
  badge = "Referral disclosure",
  title = "Wealthsimple referral link",
  highlight = "referral",
  description = "Only consider a platform after comparing fees, account features, risks, and your own needs. The referral code is optional.",
  details = "Provider terms, promotions, eligibility, and fees can change. Verify details with Wealthsimple before opening an account.",
  fitHeading = "Why this may fit",
  fitPoints = [],
  buttonLabel = "View Wealthsimple terms",
}) {
  const [copied, setCopied] = useState(false);
  const safeDisclosure =
    "This may be a referral link. We may earn a commission or bonus, but this does not affect our educational content.";
  const safeTitle = /bonus|\$25|free|sign up|open a/i.test(title)
    ? "Wealthsimple referral link"
    : title;
  const safeHighlight = safeTitle.includes(highlight) ? highlight : "referral";
  const safeButtonLabel = /sign up|claim|open/i.test(buttonLabel)
    ? "View provider terms"
    : buttonLabel;
  const safeDetails = /bonus usually|use the bonus|signup|sign up/i.test(details)
    ? "Provider terms, promotions, eligibility, and fees can change. Verify details with Wealthsimple before opening or funding an account."
    : details;

  const copyCode = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      trackReferralAction("copy", {
        offer_name: "wealthsimple",
        placement,
        cta_label: "copy_referral_code",
      });
    });
  };

  return (
    <section className="my-10">
      <p className="mb-3 text-center text-xs text-gray-500">
        {safeDisclosure}
      </p>

      <div className="rounded-2xl border border-[#007f79]/35 bg-gradient-to-br from-[#007f79]/10 to-[#003366]/10 p-6 dark:border-[#007f79]/25 dark:from-[#007f79]/5 dark:to-[#003366]/5">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black shadow-md">
            <span className="text-lg font-black tracking-tight text-white">WS</span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#007f79]/10 px-3 py-1 text-xs font-bold text-[#006b66]">
              {badge}
            </div>
            <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
              {safeTitle.includes(safeHighlight) ? (
                <>
                  {safeTitle.split(safeHighlight)[0]}
                  <span className="text-[#006b66] dark:text-[#4fd1c5]">{safeHighlight}</span>
                  {safeTitle.split(safeHighlight)[1]}
                </>
              ) : (
                safeTitle
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
            {fitPoints.length > 0 && (
              <div className="mt-3 rounded-xl bg-white/70 p-3 dark:bg-slate-900/40">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{fitHeading}</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {fitPoints.map((point) => (
                    <li key={point}>- {point}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-1.5 text-xs text-gray-500">{safeDetails}</p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg border-2 border-[#007f79]/40 bg-white px-4 py-2 dark:bg-gray-800">
                <span className="mb-0.5 block text-xs leading-none text-gray-500">Referral code</span>
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
                  placement,
                  cta_label: "sign_up_and_claim_bonus",
                  destination: REFERRAL_URL,
                });
              }}
            >
              {safeButtonLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
