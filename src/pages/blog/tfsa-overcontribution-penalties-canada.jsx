import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";

const article = {
  slug: "tfsa-overcontribution-penalties-canada",
  title: "TFSA Overcontribution Penalties Explained",
  seoTitle: "TFSA Overcontribution Penalty Canada | 1% Monthly Tax Explained",
  metaDescription: "Learn how TFSA overcontributions happen, how the 1% monthly tax can apply, and what to check before making another TFSA deposit.",
  canonical: "https://easyfinancetools.com/blog/tfsa-overcontribution-penalties-canada",
  category: "TFSA | Penalties",
  icon: "TFSA",
  gradient: "from-amber-500 to-orange-700",
  displayDate: "Last updated May 20, 2026",
  lastUpdated: "May 20, 2026",
  datePublished: "2026-05-20",
  dateModified: "2026-05-20",
  readTime: "8 min read",
  shortAnswerHeadline: "What is the TFSA overcontribution penalty?",
  shortAnswer: "CRA can assess a 1% monthly tax on excess TFSA amounts while the excess remains. The most common mistakes are same-year recontributions, stale CRA room numbers, multiple TFSA accounts, and using lifetime room that does not match residency history.",
  keyPoints: [
    "The penalty is commonly 1% per month on excess TFSA amounts.",
    "Same-year recontributions are a frequent cause.",
    "CRA My Account can lag current-year transactions.",
    "Fixing an excess quickly usually matters more than waiting for the next annual update.",
  ],
  intro: [
    "TFSA overcontributions are usually not caused by people trying to break rules. They often happen because TFSA room is flexible but not real-time: withdrawals return later, institutions report later, and multiple accounts share one combined limit.",
    "This guide explains how excess TFSA amounts happen, why the 1% monthly tax matters, and how to build a safer contribution workflow before depositing new money.",
  ],
  sections: [
    {
      heading: "How TFSA overcontributions happen",
      paragraphs: [
        "A TFSA overcontribution happens when total contributions exceed available contribution room. The room calculation includes annual limits, unused carryforward, restored prior-year withdrawals, and contributions made across every TFSA account.",
        "The mistake is often timing. If you withdraw from a TFSA and replace the money in the same calendar year without available room, the recontribution can become excess even though the money previously came from the TFSA.",
      ],
    },
    {
      heading: "The 1% monthly tax",
      paragraphs: [
        "CRA guidance commonly describes the excess TFSA tax as 1% per month on the highest excess amount in that month. The penalty can continue while the excess remains. A small excess fixed quickly is very different from a large excess left in place for months.",
        "This page is not a penalty calculator or tax-dispute guide. If you receive a CRA notice or believe an excess exists, use CRA guidance and consider qualified tax help for the correction process.",
      ],
    },
    {
      heading: "Mistake 1: recontributing too soon",
      paragraphs: [
        "The easiest way to create an excess is to withdraw money and put it back before the room is restored. Withdrawals generally return as contribution room on January 1 of the following year, not immediately.",
        "If you withdraw $10,000 in July 2026, the clean recontribution date is generally January 1, 2027 or later, unless you already had enough unused room before recontributing.",
      ],
    },
    {
      heading: "Mistake 2: relying on stale CRA room",
      paragraphs: [
        "CRA My Account is useful, but it may not include every recent transaction. During the year, your bank or broker may know about a contribution before CRA does. This can make the online number look safer than it really is.",
        "Before a large contribution, reconcile CRA room with your own records and financial institution statements. This is especially important after transfers, withdrawals, or automatic deposits.",
      ],
    },
    {
      heading: "Mistake 3: ignoring residency years",
      paragraphs: [
        "A lifetime TFSA room table assumes eligibility for each year. New residents to Canada may not have room for years before becoming resident, even if they were older than 18. This can make generic room estimates too high.",
        "If you moved to Canada after 2009, use your Canadian residency start year in any calculator and verify eligibility before contributing.",
      ],
    },
    {
      heading: "A safer contribution workflow",
      paragraphs: [
        "Use a simple process before making a real deposit: check CRA My Account, list every TFSA contribution this year, list prior-year withdrawals that should have restored room, check current-year withdrawals separately, and confirm all institutions are included.",
        "If the estimate is close to zero or your records conflict, pause before contributing. The value of squeezing in one extra deposit is usually not worth the stress of an avoidable excess contribution.",
      ],
    },
  ],
  example: {
    title: "Example: small unused room, large same-year withdrawal",
    paragraphs: [
      "Jon has $800 of unused TFSA room. He withdraws $6,000 in February 2026 and puts $6,000 back in May 2026. Unless another source of room exists, only $800 was available for the May deposit. The rest could be excess until corrected.",
      "If Jon had waited until January 2027, the February 2026 withdrawal would generally have been added back as new room.",
    ],
  },
  mistakes: [
    { title: "Treating a withdrawal like instant new room", body: "Withdrawals usually restore room next January, not immediately." },
    { title: "Counting each TFSA separately", body: "All TFSAs share one personal room limit." },
    { title: "Forgetting automatic contributions", body: "Small recurring deposits can still create an excess if room is nearly used up." },
    { title: "Using the wrong eligibility start year", body: "New residents should not assume full lifetime TFSA room." },
  ],
  notAFit: [
    "You need to challenge a CRA assessment or request relief.",
    "You have complex non-resident, prohibited-investment, or business-trading issues.",
    "You need legal or tax representation.",
  ],
  edgeCases: [
    { title: "Direct transfers", body: "A direct transfer is different from withdrawing and recontributing manually." },
    { title: "Multiple brokers", body: "CRA may receive reports from different institutions at different times." },
    { title: "Current-year withdrawals", body: "Track them, but do not usually treat them as available room until next January." },
  ],
  related: [
    { type: "Calculator", label: "TFSA contribution room calculator", href: "/blog/tfsa-contribution-room-calculator", body: "Estimate room and possible excess before depositing." },
    { type: "Guide", label: "TFSA withdrawal rules", href: "/blog/tfsa-withdrawal-rules-canada-2026", body: "Understand the timing rule behind many excess contributions." },
    { type: "Tool", label: "TFSA calculator", href: "/tools/tfsa-calculator", body: "Model room and tax-free growth." },
    { type: "Tool", label: "Account Decision Tool", href: "/tools/account-decision-tool", body: "Compare whether the TFSA should receive the next dollar." },
  ],
  pathway: {
    eyebrow: "What to do next",
    title: "If an excess may exist",
    intro: "Use this sequence before adding more money.",
    steps: [
      { title: "Stop new contributions", body: "Avoid increasing the possible excess while you reconcile records.", href: "/blog/tfsa-contribution-room-calculator" },
      { title: "Check withdrawal timing", body: "Confirm whether the room is actually restored this year or next year.", href: "/blog/tfsa-withdrawal-rules-canada-2026" },
      { title: "Review CRA guidance", body: "Use official source material before deciding how to correct the excess.", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/tax-payable-tfsa.html" },
    ],
  },
  methodology: {
    summary: "This guide explains overcontribution risk using CRA TFSA excess amount guidance and simplified planning examples.",
    assumptions: ["Examples use ordinary TFSA contribution-room timing.", "Penalty discussion is educational and not a substitute for CRA guidance or tax advice."],
    sources: [{ label: "CRA: Tax payable on TFSAs", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/tax-payable-tfsa.html" }],
    note: "Educational only. CRA handling can depend on exact dates, amounts, and facts.",
  },
  disclaimer: "This guide is educational and is not tax, investment, legal, or financial advice.",
  faqs: [
    { q: "What is the TFSA overcontribution penalty?", a: "CRA can assess a 1% monthly tax on excess TFSA amounts while the excess remains." },
    { q: "Can CRA waive a TFSA penalty?", a: "CRA has relief processes in some circumstances, but this depends on facts and should be reviewed with official CRA guidance." },
    { q: "How do I avoid TFSA overcontributions?", a: "Track all TFSA deposits, withdrawals, transfers, current-year activity, and eligibility years before contributing." },
  ],
};

export default function TFSAOvercontributionPenaltiesCanada() {
  return <CanadianEducationArticle article={article} />;
}
