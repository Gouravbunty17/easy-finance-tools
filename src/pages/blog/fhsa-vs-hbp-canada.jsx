import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { fhsaOfficialSources, rrspOfficialSources } from "../../config/officialSources";
import { REGISTERED_ACCOUNT_LIMITS, RRSP_RULES } from "../../config/financial";

const hbpSources = [
  ...fhsaOfficialSources,
  rrspOfficialSources[0],
  {
    label: "CRA: Home Buyers' Plan",
    body: "Official HBP eligibility, withdrawal, and repayment guidance.",
    href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html",
  },
  {
    label: "CRA: Repay your Home Buyers' Plan withdrawal",
    body: "Official repayment-period and annual repayment guidance for HBP participants.",
    href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan/repay-your-home-buyers-plan.html",
  },
];

function cad(value) {
  return Number(value).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
}

const article = {
  slug: "fhsa-vs-hbp-canada",
  title: "FHSA vs Home Buyers' Plan: Which Should Canadians Use First?",
  seoTitle: "FHSA vs HBP Canada: Which First-Home Account Should Come First?",
  metaDescription:
    "Compare FHSA vs RRSP Home Buyers' Plan in Canada, including deductions, tax-free withdrawals, repayment rules, timelines, and when using both may make sense.",
  canonical: "https://easyfinancetools.com/blog/fhsa-vs-hbp-canada",
  category: "FHSA",
  icon: "FHSA",
  gradient: "from-emerald-500 to-teal-700",
  displayDate: "Last updated July 5, 2026",
  lastUpdated: "July 5, 2026",
  datePublished: "2026-07-05",
  dateModified: "2026-07-05",
  readTime: "11 min read",
  decisionToolTopic: "fhsa",
  officialSources: hbpSources,
  shortAnswerHeadline: "FHSA usually deserves the first look, but HBP can still help",
  shortAnswer:
    `For eligible first-time home buyers, the FHSA is often cleaner because contributions may be deductible and qualifying withdrawals can be tax-free without a repayment schedule. The HBP can still help when RRSP money already exists, but withdrawals of up to ${cad(RRSP_RULES.homeBuyersPlanWithdrawalLimit)} generally create repayment obligations.`,
  keyPoints: [
    `FHSA has an annual limit of ${cad(REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit)} and a lifetime limit of ${cad(REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit)} under current rules.`,
    `The HBP can allow up to ${cad(RRSP_RULES.homeBuyersPlanWithdrawalLimit)} from an RRSP for a qualifying home purchase, subject to CRA rules.`,
    "FHSA qualifying withdrawals generally do not need to be repaid; HBP withdrawals usually do.",
    "Using both can make sense, but only if the purchase timeline, cash flow, and repayment plan are realistic.",
  ],
  intro: [
    "Canadians saving for a first home now have two major registered-account paths: the First Home Savings Account and the RRSP Home Buyers' Plan. Both can be useful. They are not the same tool.",
    "This guide separates the tradeoff, calculation, context, and action steps. It does not replace CRA rules or professional tax advice. It helps you decide what to compare before using FHSA room, RRSP assets, or both for a down payment.",
  ],
  sections: [
    {
      heading: "The tradeoff: clean first-home withdrawal vs borrowing from RRSP",
      paragraphs: [
        "The FHSA is built specifically for first-home savings. Contributions may reduce taxable income, and qualifying withdrawals can come out tax-free for a qualifying home purchase. There is no normal FHSA repayment schedule after a qualifying withdrawal.",
        "The HBP works differently. It lets you access RRSP money for a qualifying home purchase, but the RRSP is still a retirement account. HBP withdrawals generally need to be repaid over time or the missed repayment can become taxable income.",
        "That makes the FHSA cleaner for new first-home savings. The HBP can still be valuable if you already have RRSP assets or want to layer more down-payment money on top of the FHSA.",
      ],
      table: {
        headers: ["Feature", "FHSA", "RRSP Home Buyers' Plan"],
        rows: [
          ["Main purpose", "First-home savings", "Temporary RRSP access for home purchase"],
          ["Contribution deduction", "Generally yes", "RRSP contribution may be deductible"],
          ["Qualifying withdrawal", "Generally tax-free", "Generally not taxed if HBP rules are met"],
          ["Repayment", "No normal repayment schedule", `${RRSP_RULES.homeBuyersPlanRepaymentYears}-year repayment path generally applies`],
          ["Current limit reference", `${cad(REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit)} lifetime FHSA limit`, `${cad(RRSP_RULES.homeBuyersPlanWithdrawalLimit)} HBP withdrawal ceiling`],
        ],
      },
    },
    {
      heading: "The calculation: compare after-tax cash and future obligations",
      paragraphs: [
        "A simple comparison should include contribution deduction value, available account room, existing RRSP balance, expected purchase date, investment risk, and the HBP repayment schedule. The best-looking down payment can become weaker if it creates repayment pressure after closing.",
        "For example, a buyer with no RRSP balance and clear FHSA eligibility usually starts with FHSA room. A buyer with substantial RRSP savings may compare using FHSA room first, then adding HBP only if the repayment obligation fits the post-purchase budget.",
        "The calculation is not only the down-payment amount. Home ownership brings closing costs, moving costs, repairs, insurance, furniture, and emergency cash. Do not empty every account if that leaves the new household fragile.",
      ],
    },
    {
      heading: "The context: using both can be powerful and risky",
      paragraphs: [
        "Using both FHSA and HBP can increase the down-payment pool. It can also increase complexity. You may be managing FHSA eligibility, qualifying withdrawal paperwork, RRSP withdrawal paperwork, and future HBP repayments while also dealing with mortgage approval and closing costs.",
        "This is why the FHSA-first idea should not become FHSA-only thinking. If you already built RRSP assets, the HBP may still have a role. If you have no emergency fund or the home budget is already stretched, using every available registered-account dollar may create too little margin.",
      ],
      bullets: [
        "FHSA tends to be cleaner for new contributions aimed at a first home.",
        "HBP tends to be more relevant when RRSP assets already exist.",
        "HBP repayments need to be included in the household cash-flow plan.",
        "Short timelines usually call for lower-volatility holdings, regardless of account type.",
      ],
    },
    {
      heading: "The action: a practical order before buying",
      paragraphs: [
        "Start by confirming eligibility for both FHSA and HBP. Then estimate how much FHSA room can realistically be used before purchase. Next, check whether any RRSP withdrawal through HBP fits the future repayment schedule.",
        "Finally, connect the account decision to mortgage affordability. A bigger down payment helps, but a stretched mortgage, weak emergency fund, or exhausted cash reserve can still make the plan brittle.",
      ],
      bullets: [
        "Confirm first-time home buyer status under CRA rules.",
        "Use the FHSA calculator to estimate room and tax savings.",
        "Check HBP withdrawal and repayment requirements before touching RRSP funds.",
        "Use the mortgage affordability calculator before committing every available dollar.",
      ],
    },
  ],
  example: {
    title: "Example: buyer with FHSA room and existing RRSP money",
    paragraphs: [
      "A buyer has $16,000 of usable FHSA room this year and $45,000 already in an RRSP. If the purchase is likely within two years, the FHSA contribution may be the first planning step because it is designed for the home goal.",
      "The RRSP HBP can still be considered, but the buyer should model the repayment schedule after closing. A larger down payment is helpful only if the post-purchase cash flow can survive repairs, rate changes, and normal living costs.",
    ],
  },
  misunderstood: [
    { title: "HBP is not free money", body: "It is generally your RRSP money used under a special rule, with repayment obligations." },
    { title: "FHSA is not automatic", body: "Eligibility, participation room, and qualifying withdrawal rules still need to be verified." },
    { title: "Using both is not always better", body: "More down-payment cash can come with more paperwork and less future liquidity." },
    { title: "Account choice does not fix affordability", body: "Mortgage qualification and household resilience still matter." },
  ],
  notAFit: [
    "You are unsure whether you qualify as a first-time home buyer.",
    "Your home purchase timeline is unclear and flexibility matters more.",
    "HBP repayments would strain your future budget.",
    "You would empty emergency savings to maximize registered-account use.",
  ],
  edgeCases: [
    { title: "Partner ownership facts", body: "Spouse or common-law partner ownership history can affect first-time buyer analysis." },
    { title: "Buying sooner than expected", body: "The paperwork and investment risk may matter more than extra growth." },
    { title: "No purchase later", body: "FHSA and RRSP paths differ if the home purchase never happens." },
    { title: "Changing rules", body: "FHSA and HBP limits can change. Verify current CRA guidance before acting." },
  ],
  mistakes: [
    { title: "Ignoring repayment", body: "HBP repayments should be part of the affordability plan." },
    { title: "Chasing the largest down payment", body: "Cash reserves after closing are also part of home affordability." },
    { title: "Using volatile assets too close to purchase", body: "A short down-payment timeline may not fit equity risk." },
    { title: "Skipping CRA verification", body: "Eligibility and withdrawal forms matter." },
  ],
  related: [
    { type: "Tool", label: "FHSA Calculator", href: "/tools/fhsa-calculator", body: "Estimate room, tax savings, and projected first-home balance." },
    { type: "Tool", label: "Mortgage affordability calculator", href: "/tools/mortgage-affordability-calculator", body: "Check whether the planned home still fits after down-payment decisions." },
    { type: "Guide", label: "FHSA vs RRSP for a down payment", href: "/blog/fhsa-vs-rrsp-down-payment-canada-2026", body: "Read the broader account comparison before using RRSP money." },
    { type: "Guide", label: "FHSA rules Canada 2026", href: "/blog/fhsa-rules-canada-2026", body: "Verify eligibility, room, transfers, and withdrawals." },
  ],
  pathway: {
    eyebrow: "First-home decision path",
    title: "Before choosing FHSA, HBP, or both",
    intro: "Use this sequence before moving registered-account money.",
    steps: [
      { title: "Verify rules", body: "Confirm FHSA and HBP eligibility with CRA guidance.", href: "/blog/fhsa-rules-canada-2026" },
      { title: "Model FHSA first", body: "Estimate tax savings and room before adding RRSP complexity.", href: "/tools/fhsa-calculator" },
      { title: "Check affordability", body: "Compare the down payment with post-close cash flow.", href: "/tools/mortgage-affordability-calculator" },
    ],
  },
  methodology: {
    summary:
      "This article compares FHSA and HBP using official CRA account rules, current EasyFinanceTools registered-account constants, and household cash-flow decision framing.",
    assumptions: [
      "The reader is considering a qualifying first-home purchase in Canada.",
      "Examples are simplified and do not replace CRA forms, issuer guidance, lender underwriting, or tax advice.",
      "Current account limits should be refreshed against CRA before publishing future updates.",
    ],
    sources: hbpSources,
    note: "Verify FHSA and HBP limits, eligibility, withdrawal forms, and repayment rules before acting.",
  },
  faqs: [
    { q: "Is FHSA better than HBP?", a: "Often for new first-home savings, because qualifying FHSA withdrawals generally do not require repayment. HBP can still help when RRSP assets already exist." },
    { q: "Can I use FHSA and HBP together?", a: "Often yes if you meet the rules for both, but paperwork, eligibility, and HBP repayments need to be planned." },
    { q: "How much can I withdraw through HBP?", a: `Current EasyFinanceTools assumptions use ${cad(RRSP_RULES.homeBuyersPlanWithdrawalLimit)}. Always verify the current CRA limit before planning around it.` },
    { q: "Does this replace mortgage advice?", a: "No. It is educational account planning, not mortgage, tax, legal, or investment advice." },
  ],
  disclaimer:
    "This article is for educational planning only and is not financial, tax, legal, mortgage, accounting, or investment advice.",
};

export default function FHSAvsHBPCanada() {
  return <CanadianEducationArticle article={article} />;
}
