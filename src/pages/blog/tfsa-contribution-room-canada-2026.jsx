import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";

const article = {
  slug: "tfsa-contribution-room-canada-2026",
  title: "TFSA Contribution Room Canada 2026: Limit, Rules & Common Mistakes",
  seoTitle: "TFSA Contribution Room Canada 2026 | Limit, Rules & Mistakes",
  metaDescription: "Learn how TFSA contribution room works in Canada for 2026, including the $7,000 limit, withdrawals, CRA room updates, examples, and common mistakes.",
  canonical: "https://easyfinancetools.com/blog/tfsa-contribution-room-canada-2026",
  category: "TFSA | Canada",
  icon: "TFSA",
  gradient: "from-blue-500 to-indigo-700",
  displayDate: "Last updated April 29, 2026",
  lastUpdated: "April 29, 2026",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  readTime: "9 min read",
  shortAnswerHeadline: "How much TFSA room do Canadians get in 2026?",
  shortAnswer: "The TFSA annual dollar limit for 2026 is $7,000. Your actual available room can be higher or lower because unused room carries forward, prior-year withdrawals are added back on January 1 of the following year, and current-year contributions reduce room immediately.",
  keyPoints: [
    "The 2026 TFSA dollar limit is $7,000.",
    "Cumulative room can reach $109,000 if you were eligible every year from 2009 through 2026 and never contributed.",
    "Withdrawals do not create new room until January 1 of the next year.",
    "CRA My Account may not reflect current-year TFSA transactions during the year.",
  ],
  intro: [
    "TFSA contribution room sounds simple until real life gets involved: multiple accounts, withdrawals, old contributions, late issuer reporting, and a CRA number that may not match your own spreadsheet during the year. The Tax-Free Savings Account is flexible, but the room calculation still needs care.",
    "This guide explains the 2026 TFSA limit, how room is calculated, why withdrawals are easy to misunderstand, and how to avoid the common over-contribution mistakes that trip up Canadian savers and investors. It is educational, not personalized tax advice.",
  ],
  sections: [
    {
      heading: "The 2026 TFSA limit and cumulative room",
      paragraphs: [
        "The annual TFSA dollar limit for 2026 is $7,000. That amount is added to eligible Canadians' contribution room on January 1, 2026. If you were at least 18, resident in Canada, and eligible every year since the TFSA began in 2009, the cumulative limit through 2026 is $109,000 before considering your own contributions and withdrawals.",
        "Cumulative room is not the same as available room. Available room is personal. Someone who contributed the maximum every year may only have the new $7,000 room for 2026, while someone who never contributed may have much more. Someone who withdrew in 2025 may also regain that withdrawal amount in 2026.",
      ],
      table: {
        headers: ["Year range", "Annual limit", "Planning note"],
        rows: [
          ["2009 to 2012", "$5,000 per year", "Early TFSA room for eligible adults"],
          ["2013 to 2014", "$5,500 per year", "Higher indexed room"],
          ["2015", "$10,000", "One-time larger annual limit"],
          ["2016 to 2018", "$5,500 per year", "Room continued to carry forward"],
          ["2019 to 2022", "$6,000 per year", "Common room band for many investors"],
          ["2023", "$6,500", "Higher annual room"],
          ["2024 to 2026", "$7,000 per year", "Current annual limit level"],
        ],
      },
    },
    {
      heading: "How TFSA contribution room is calculated",
      paragraphs: [
        "A practical formula is: current-year dollar limit, plus unused room from prior years, plus withdrawals made in the previous year, minus contributions already made this year. Qualifying direct transfers between TFSAs do not create new room, but ordinary withdrawals and recontributions can create problems if timing is misunderstood.",
        "The key detail is timing. A TFSA contribution reduces available room immediately. A TFSA withdrawal is added back only on January 1 of the following calendar year. If you withdraw $5,000 in June 2026 and recontribute it in July 2026 without enough unused room, that recontribution can be an excess contribution.",
      ],
      bullets: [
        "Track every TFSA contribution by date, account, and amount.",
        "Track every withdrawal separately because it returns as room next year, not right away.",
        "Use your own records during the year instead of relying only on CRA My Account.",
        "Treat multiple TFSAs as one combined room limit, not separate limits per account.",
      ],
    },
    {
      heading: "Why CRA My Account can be behind",
      paragraphs: [
        "CRA My Account is useful, but it is not a real-time TFSA ledger. Financial institutions generally report prior-year TFSA transactions after year-end, and CRA updates the online information in the spring. That means the number shown in January can miss contributions or withdrawals made in the previous year if issuer reporting has not yet been processed.",
        "This is why the safest workflow is to reconcile your own records with financial institution statements. If you have multiple brokers or banks, combine all TFSA activity before contributing. A TFSA at one bank and a TFSA at another broker still share the same personal contribution room.",
      ],
    },
    {
      heading: "Withdrawals and recontributions",
      paragraphs: [
        "TFSA withdrawals are flexible because qualified withdrawals are generally tax-free and the withdrawn amount can be added back as new room. The catch is that the room is restored in the next calendar year. This makes December and January behavior especially important.",
        "If you withdraw $8,000 in December 2026, that amount can be added back on January 1, 2027. If you withdraw $8,000 in February 2026, the room still does not come back until January 1, 2027. The month of the withdrawal does not change the restoration date; only the calendar year matters.",
      ],
    },
    {
      heading: "When the TFSA should be used carefully",
      paragraphs: [
        "A TFSA can hold savings, GICs, ETFs, stocks, and other qualified investments, but the best use depends on the job of the money. Emergency savings may belong in a TFSA savings account if you have lots of room and value tax-free interest. Long-term investing may fit better with broad ETFs if the goal is tax-free growth over many years.",
        "The TFSA should be used carefully for speculative positions. If an investment falls sharply inside a TFSA, you do not receive contribution room back for the loss. The room is tied to contributions and withdrawals, not investment performance.",
      ],
    },
  ],
  example: {
    title: "Example: calculating room after a withdrawal",
    paragraphs: [
      "Assume Priya had $6,000 of unused TFSA room at the end of 2025. She withdrew $4,000 from her TFSA in October 2025 and the 2026 annual limit is $7,000. On January 1, 2026, her starting available room would be $6,000 + $4,000 + $7,000 = $17,000, before any 2026 contributions.",
      "If Priya contributes $5,000 in February 2026, her remaining 2026 room falls to $12,000 immediately. If she later withdraws another $3,000 in July 2026, that $3,000 does not increase 2026 room. It is added back on January 1, 2027.",
    ],
  },
  mistakes: [
    { title: "Recontributing too soon", body: "Withdrawing and putting the same money back in the same calendar year can create an excess contribution if you do not already have unused room." },
    { title: "Trusting a stale CRA number", body: "CRA My Account may not include current-year transactions or all prior-year issuer reports until the spring update is complete." },
    { title: "Ignoring multiple accounts", body: "TFSA room applies across all your TFSAs combined. Opening a second TFSA does not create a second limit." },
    { title: "Forgetting investment losses", body: "Losses inside a TFSA do not restore contribution room. Room comes back through withdrawals, not through poor performance." },
  ],
  related: [
    { type: "Tool", label: "TFSA calculator", href: "/tools/tfsa-calculator", body: "Estimate contribution room, tax-free growth, and future TFSA value." },
    { type: "Guide", label: "TFSA vs RRSP guide", href: "/blog/tfsa-vs-rrsp-canada-2026", body: "Compare whether your next dollar belongs in a TFSA or RRSP first." },
    { type: "Guide", label: "Best TFSA ETFs", href: "/blog/best-etfs-for-tfsa-canada-2026", body: "Review common ETF categories once the TFSA is the right account." },
    { type: "Tool", label: "Compound interest calculator", href: "/tools/compound-interest-calculator", body: "Model long-term growth assumptions before investing TFSA money." },
    { type: "Guide", label: "How to start investing in Canada", href: "/blog/how-to-start-investing-canada-2026", body: "Use this if you still need the beginner account and ETF workflow." },
  ],
  methodology: {
    summary: "This article explains TFSA room using CRA contribution-room mechanics and EasyFinanceTools planning examples. It avoids personalized recommendations and focuses on room tracking, timing, and common mistakes.",
    assumptions: [
      "The 2026 TFSA annual dollar limit is $7,000.",
      "Cumulative room of $109,000 assumes eligibility from 2009 through 2026 and no prior contributions.",
      "Examples are simplified and do not include every possible transfer, non-resident, or prohibited-investment issue.",
    ],
    sources: [
      { label: "CRA: Calculate your TFSA contribution room", href: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributing/calculate-room.html" },
      { label: "EasyFinanceTools methodology", href: "https://easyfinancetools.com/methodology" },
    ],
    note: "Educational estimate only. Confirm your own available room using your TFSA records, financial institution statements, and CRA information before contributing.",
  },
  disclaimer: "This article is educational only and is not tax, legal, investment, or financial advice. TFSA rules can depend on residency, transfers, account type, and your exact transaction history. Verify your own room before contributing.",
  faqs: [
    { q: "What is the TFSA limit for 2026?", a: "The 2026 TFSA annual dollar limit is $7,000. Your available room may be higher or lower depending on unused room, prior withdrawals, and current-year contributions." },
    { q: "How much cumulative TFSA room is available by 2026?", a: "The cumulative limit can be $109,000 if you were eligible every year from 2009 through 2026 and never contributed. Your personal number depends on eligibility, contributions, and withdrawals." },
    { q: "When do TFSA withdrawals come back as room?", a: "Withdrawals generally come back as new contribution room on January 1 of the following calendar year, not immediately after the withdrawal." },
    { q: "Can I rely on CRA My Account for TFSA room?", a: "Use CRA My Account as a reference, but also use your own records because CRA information may not reflect current-year transactions during the year." },
    { q: "What happens if I over-contribute to a TFSA?", a: "Excess TFSA contributions can be subject to tax. If you think you over-contributed, review CRA guidance and correct the excess promptly." },
  ],
};

export default function TFSAContributionRoomCanada2026() {
  return <CanadianEducationArticle article={article} />;
}
