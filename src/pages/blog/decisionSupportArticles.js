import {
  dividendTaxOfficialSources,
  fhsaOfficialSources,
  mortgageOfficialSources,
  rrspOfficialSources,
  tfsaOfficialSources,
} from "../../config/officialSources";

const commonDisclaimer = "This guide is general education for Canadian readers. It is not financial, investment, tax, legal, mortgage, or accounting advice. Verify your own contribution room, tax situation, lender terms, and official source material before acting.";

export const decisionSupportArticles = {
  "why-prioritize-fhsa-before-tfsa-canada": {
    slug: "why-prioritize-fhsa-before-tfsa-canada",
    title: "Why Many Canadians Should Prioritize FHSA Before TFSA",
    seoTitle: "Why Prioritize FHSA Before TFSA in Canada?",
    metaDescription: "A practical Canadian framework for when FHSA can come before TFSA, including tax deductions, home timelines, eligibility traps, and verification steps.",
    canonical: "https://easyfinancetools.com/blog/why-prioritize-fhsa-before-tfsa-canada",
    category: "FHSA | TFSA",
    icon: "FHSA",
    gradient: "from-emerald-500 to-teal-700",
    displayDate: "Last updated May 9, 2026",
    lastUpdated: "May 9, 2026",
    datePublished: "2026-05-09",
    dateModified: "2026-05-09",
    readTime: "11 min read",
    decisionToolTopic: "fhsa",
    officialSources: [fhsaOfficialSources[0], fhsaOfficialSources[1], fhsaOfficialSources[2], tfsaOfficialSources[0]],
    shortAnswerHeadline: "When can FHSA come before TFSA?",
    shortAnswer: "FHSA can deserve the first dollar when you qualify, expect a first-home purchase within a realistic timeframe, have taxable income where the deduction matters, and can keep the money invested or saved at an appropriate risk level. TFSA still wins when flexibility, eligibility uncertainty, or non-home goals matter more.",
    keyPoints: [
      "FHSA room starts only after opening the first FHSA, so timing is part of the decision.",
      "The FHSA can combine an RRSP-like deduction with a TFSA-like qualifying withdrawal.",
      "The advantage shrinks if home-buying is unlikely, cash flow is tight, or eligibility is unclear.",
      "Your CRA records and issuer paperwork matter more than a generic account ranking.",
    ],
    intro: [
      "The usual beginner advice is to use a TFSA first because it is simple, flexible, and tax-free. That advice is often reasonable, but it can be incomplete for Canadians who may buy a first home. The FHSA changes the account-order conversation because it can provide a deduction on the way in and a tax-free qualifying withdrawal on the way out.",
      "That does not mean every eligible person should rush into an FHSA. The stronger way to think about it is account job first: emergency cash, first-home money, retirement money, and flexible investing do not all belong in the same container. This guide explains when FHSA priority is rational, when TFSA remains cleaner, and how to verify the decision before moving money.",
    ],
    sections: [
      {
        heading: "The core framework",
        paragraphs: [
          "The FHSA moves ahead of the TFSA when four conditions line up: you qualify as a first-time home buyer, the purchase is plausible, the deduction has value at your current tax rate, and the account can be used without forcing risky investing. If one of those breaks, the TFSA often becomes the cleaner default.",
          "This is why a 28-year-old renter in Ontario earning $78,000 and hoping to buy within four years may treat FHSA room as scarce. A 22-year-old with unstable housing plans and no emergency fund may be better served by TFSA flexibility, even if the FHSA headline tax treatment looks attractive.",
        ],
        table: {
          headers: ["Decision factor", "FHSA-first signal", "TFSA-first signal"],
          rows: [
            ["Home timeline", "Likely purchase within 1-5 years", "No clear plan to buy"],
            ["Tax rate", "Deduction meaningfully reduces tax", "Low income year or little tax payable"],
            ["Flexibility", "Money can stay for home goal", "Money may be needed for other goals"],
            ["Eligibility", "First-time buyer status is clear", "Past ownership or partner situation is unclear"],
          ],
        },
      },
      {
        heading: "Why timing matters more than people think",
        paragraphs: [
          "TFSA room generally accumulates automatically once you are eligible. FHSA participation room starts when the account is opened. That difference means waiting can have a cost if a first-home purchase is genuinely possible. Opening late can compress how much room you can use before buying.",
          "The opposite mistake is opening and funding an FHSA without a cash-flow plan. If you use all free cash for FHSA contributions while carrying expensive debt or no emergency buffer, the tax account is solving the wrong problem. A deduction is not a substitute for resilience.",
        ],
      },
      {
        heading: "Province and tax nuance",
        paragraphs: [
          "The deduction value depends on your marginal tax rate, which includes federal and provincial tax. The same contribution can feel different in Alberta, Ontario, Quebec, or Nova Scotia because the combined tax rate at your income level differs. That does not make the FHSA a provincial strategy, but province affects the refund math.",
          "A common middle-ground approach is to contribute enough to use room steadily without over-optimizing the refund. If your income is temporarily low, it may be reasonable to preserve flexibility and revisit the FHSA when the deduction is more valuable. If your income is rising, opening the account can still matter because room timing is separate from deduction value.",
        ],
      },
      {
        heading: "How to verify before acting",
        paragraphs: [
          "Start with the CRA FHSA eligibility and contribution pages, then confirm the issuer can handle the contribution or transfer properly. If you are moving money from an RRSP to an FHSA, use the proper transfer process and understand that the transfer still uses FHSA room.",
          "Before contributing, write down the purpose of the money, expected purchase date, backup plan if you do not buy, and whether you can leave the money alone. That small written check prevents the FHSA from becoming just another place to chase a tax refund.",
        ],
      },
    ],
    example: {
      title: "Example: Ontario renter earning $72,000",
      paragraphs: [
        "Nadia earns $72,000 in Ontario, has a separate emergency fund, and expects to buy a starter condo in three to four years. She qualifies as a first-time buyer and has no near-term need for the money outside housing. In this case, opening an FHSA and using a planned contribution can be more compelling than adding the same dollars to a TFSA.",
        "If Nadia were unsure about buying or had only one month of emergency cash, the answer changes. The TFSA may provide a better safety valve even though the FHSA has stronger tax mechanics for a qualifying home purchase.",
      ],
    },
    misunderstood: [
      { title: "The FHSA is not automatically better", body: "The FHSA is powerful only when the money is likely to be used within the qualifying home rules or transferred properly later." },
      { title: "Room timing is different from TFSA", body: "TFSA room does not require opening an account first. FHSA room does, so delaying can matter for real buyers." },
      { title: "The refund is not the whole benefit", body: "The deduction matters, but so do eligibility, purchase timing, investment risk, and backup plans." },
      { title: "RRSP transfers are not free extra room", body: "A transfer can be useful, but it still uses FHSA participation room and needs proper issuer handling." },
    ],
    notAFit: [
      "You are not confident you meet the first-time home buyer conditions.",
      "You may need the money for education, relocation, debt, or emergency cash instead of a home.",
      "Your income is temporarily low and the deduction value is modest.",
      "You plan to invest aggressively despite needing the down payment soon.",
    ],
    edgeCases: [
      { title: "Partner ownership facts", body: "A spouse or common-law partner's home ownership can affect the first-time buyer analysis. Check the official wording before opening." },
      { title: "Buying sooner than expected", body: "If the purchase is months away, investment risk and paperwork timing can matter more than squeezing out growth." },
      { title: "Changing provinces", body: "The deduction is federal/provincial through your tax return, so moving provinces can change the refund estimate." },
      { title: "Not buying later", body: "A direct RRSP/RRIF transfer may preserve tax deferral, but a regular withdrawal is generally taxable." },
    ],
    mistakes: [
      { title: "Funding FHSA before emergency cash", body: "A registered account cannot fix a brittle monthly budget." },
      { title: "Treating all home money as long-term investing money", body: "Short timelines usually call for lower volatility than retirement portfolios." },
      { title: "Ignoring issuer forms", body: "Qualifying withdrawals and transfers rely on correct process, not just intent." },
      { title: "Forgetting contribution records", body: "Keep statements and tax slips so you can reconcile room and deductions." },
    ],
    related: [
      { type: "Tool", label: "FHSA Calculator", href: "/tools/fhsa-calculator", body: "Estimate contribution room, tax savings, and down-payment growth." },
      { type: "Tool", label: "Account Decision Tool", href: "/tools/account-decision-tool", body: "Compare TFSA, RRSP, and FHSA priority." },
    ],
    pathway: {
      eyebrow: "First-home path",
      title: "A practical FHSA-first workflow",
      intro: "Use this order before moving money.",
      steps: [
        { title: "Check eligibility", body: "Read the CRA FHSA eligibility rules and confirm partner/home ownership facts.", href: "/blog/fhsa-rules-canada-2026" },
        { title: "Model the contribution", body: "Estimate room, deduction value, and purchase timeline.", href: "/tools/fhsa-calculator" },
        { title: "Compare account priority", body: "Run TFSA/RRSP/FHSA as a full decision, not a slogan.", href: "/tools/account-decision-tool" },
      ],
    },
    methodology: {
      summary: "This article uses CRA FHSA and TFSA rules plus practical account-priority logic for Canadian first-home planning.",
      assumptions: ["Reader is a Canadian resident considering first-home savings.", "Examples are simplified and do not model every tax credit or issuer rule.", "Account priority depends on eligibility, timeline, cash flow, and tax rate."],
      sources: [fhsaOfficialSources[0], fhsaOfficialSources[1], tfsaOfficialSources[0]],
      note: "Verify your own eligibility and room before opening or funding an FHSA.",
    },
    faqs: [
      { q: "Should FHSA always come before TFSA?", a: "No. FHSA can come first when first-home eligibility and timeline are clear. TFSA is often better when flexibility matters more." },
      { q: "Does opening an FHSA create room immediately?", a: "Opening the first FHSA starts participation room under the FHSA rules. Check CRA guidance for exact current-year treatment." },
      { q: "What if I never buy a home?", a: "A direct transfer to an RRSP or RRIF may be possible if rules are met; a regular withdrawal is generally taxable." },
      { q: "How do I verify my situation?", a: "Check CRA FHSA eligibility and contribution pages, your issuer's forms, and your own tax records." },
    ],
    disclaimer: commonDisclaimer,
  },

  "rrsp-mistake-middle-income-canadians": {
    slug: "rrsp-mistake-middle-income-canadians",
    title: "The RRSP Mistake Middle-Income Canadians Make",
    seoTitle: "RRSP Mistake Middle-Income Canadians Make",
    metaDescription: "A practical Canadian guide to the common RRSP mistake: chasing a refund without comparing TFSA flexibility, tax-rate gaps, benefits, and refund use.",
    canonical: "https://easyfinancetools.com/blog/rrsp-mistake-middle-income-canadians",
    category: "RRSP | Retirement",
    icon: "RRSP",
    gradient: "from-green-500 to-emerald-700",
    displayDate: "Last updated May 9, 2026",
    lastUpdated: "May 9, 2026",
    datePublished: "2026-05-09",
    dateModified: "2026-05-09",
    readTime: "10 min read",
    decisionToolTopic: "rrsp",
    officialSources: [rrspOfficialSources[0], rrspOfficialSources[1], rrspOfficialSources[2], tfsaOfficialSources[0]],
    shortAnswerHeadline: "What is the RRSP mistake?",
    shortAnswer: "The common mistake is treating the refund as proof the RRSP was the right account. The real test is whether your current tax rate is meaningfully higher than your future withdrawal tax rate, whether the refund is used productively, and whether TFSA flexibility would have been more valuable.",
    keyPoints: [
      "A refund is often a tax deferral, not free money.",
      "RRSP works best when current tax rate is higher than expected withdrawal tax rate.",
      "Middle-income Canadians can be in the grey zone where TFSA is often simpler.",
      "Spending the refund weakens the long-term RRSP advantage.",
    ],
    intro: [
      "RRSP advice often sounds simple: contribute, get a refund, invest for retirement. That can be excellent for some Canadians, but the shortcut hides the real question. An RRSP is not automatically better because the refund feels good in April.",
      "For middle-income Canadians, the mistake is usually not using an RRSP. It is using it without a tax-rate plan, then spending the refund or creating future taxable withdrawals that were not considered. This guide gives a more useful framework.",
    ],
    sections: [
      {
        heading: "Refund-first thinking is incomplete",
        paragraphs: [
          "An RRSP contribution reduces taxable income. That can create or increase a refund. But when money comes out later, RRSP or RRIF withdrawals are taxable. The long-term benefit depends on the difference between the tax rate avoided today and the tax rate paid later.",
          "If your current marginal rate is 30% and your future withdrawal rate is much lower, the RRSP can be strong. If both rates are similar, the TFSA may produce a similar after-tax result with more flexibility and less taxable-income interaction later.",
        ],
      },
      {
        heading: "Where middle-income Canadians get stuck",
        paragraphs: [
          "Middle-income workers often have enough income for the RRSP refund to feel meaningful but not always enough tax-rate gap for the RRSP to clearly beat TFSA. They may also have goals before retirement: emergency cash, home down payment, parental leave, career change, or debt repayment.",
          "The result is a grey zone. The RRSP can still be right, especially with employer matching or a rising income path, but it should not be automatic. The next dollar may belong in TFSA, FHSA, debt repayment, or RRSP depending on the specific constraint.",
        ],
        table: {
          headers: ["Situation", "RRSP gets stronger", "RRSP gets weaker"],
          rows: [
            ["Current tax rate", "High today, lower later", "Similar or higher later"],
            ["Refund use", "Reinvested or used to reduce debt", "Spent without a plan"],
            ["Flexibility", "Money truly for retirement", "May need access before retirement"],
            ["Benefits", "Deduction helps benefit calculations", "Future withdrawals may affect income-tested benefits"],
          ],
        },
      },
      {
        heading: "The refund should have a job",
        paragraphs: [
          "The strongest RRSP plans usually assign the refund before it arrives. It might go to TFSA, emergency cash, debt, or another RRSP contribution. If the refund is spent as a bonus, the RRSP is still not necessarily wrong, but one of its biggest advantages has been diluted.",
          "This is behavioural, not just mathematical. A plan that works only if you reinvest the refund is fragile if you know you tend to spend windfalls. The better account is the one you can actually use well.",
        ],
      },
      {
        heading: "How to verify before contributing",
        paragraphs: [
          "Check your CRA Notice of Assessment for deduction room, then run a simple comparison: RRSP contribution with refund reinvested, RRSP contribution with refund spent, and TFSA contribution of the same out-of-pocket cost. Also think about future taxable income from pensions, CPP/OAS, rental income, or part-time work.",
          "If the decision is large, if benefits are involved, or if you are close to retirement, consider getting qualified tax advice. The RRSP is a retirement tool, but it is also a tax-timing tool.",
        ],
      },
    ],
    example: {
      title: "Example: $65,000 income in Ontario",
      paragraphs: [
        "A middle-income Ontario worker contributes $5,000 to an RRSP. The refund estimate may look attractive, but the better question is what happens next. If the refund is invested or used to reduce high-interest debt, the contribution has a clear second benefit. If the refund disappears into ordinary spending, the long-term advantage may shrink.",
        "If the same person expects a pension and similar taxable income in retirement, TFSA may deserve more attention. If they expect lower retirement income or have employer RRSP matching, RRSP becomes stronger.",
      ],
    },
    misunderstood: [
      { title: "A refund is not a bonus", body: "It is usually tax deferred from today to a future withdrawal year." },
      { title: "RRSP room is not a target", body: "Having room does not mean filling it is the best next move." },
      { title: "TFSA is not only for short-term savings", body: "TFSA can be a strong long-term retirement account because withdrawals are not taxable." },
      { title: "Employer match changes the math", body: "Free matching contributions can make RRSP participation attractive even when the standalone tax comparison is mixed." },
    ],
    notAFit: [
      "You have high-interest debt and no emergency buffer.",
      "Your future taxable retirement income may be similar to current income.",
      "You need flexible access before retirement.",
      "You are contributing mainly because the refund feels good, with no plan for it.",
    ],
    edgeCases: [
      { title: "Income-tested benefits", body: "RRSP deductions may help some benefit calculations today, while withdrawals can affect income-tested benefits later." },
      { title: "Pension adjustment", body: "Workplace pension participation can reduce new RRSP room. Check CRA records before contributing." },
      { title: "Spousal RRSP", body: "A spousal RRSP can help some couples, but attribution and withdrawal timing rules matter." },
      { title: "Retiring early", body: "Lower-income gap years before CPP/OAS can make planned RRSP withdrawals more attractive." },
    ],
    mistakes: [
      { title: "Spending the refund", body: "This weakens the compounding argument for the RRSP." },
      { title: "Ignoring TFSA comparison", body: "TFSA can be stronger when tax rates are similar or flexibility matters." },
      { title: "Overcontributing", body: "Room estimates should be checked against CRA records." },
      { title: "Forgetting future withdrawals", body: "RRSP withdrawals are taxable income and need retirement planning." },
    ],
    related: [
      { type: "Tool", label: "RRSP Calculator", href: "/tools/rrsp-calculator", body: "Estimate refund value and after-tax retirement tradeoffs." },
      { type: "Guide", label: "TFSA vs RRSP", href: "/blog/tfsa-vs-rrsp-canada-2026", body: "Compare account priority with Canadian examples." },
    ],
    methodology: {
      summary: "This guide frames RRSP decisions around tax-rate arbitrage, refund behaviour, and account flexibility.",
      assumptions: ["Reader has Canadian earned income and RRSP room.", "Examples are directional and not tax filing calculations.", "Future tax rates are uncertain."],
      sources: [rrspOfficialSources[0], rrspOfficialSources[2], tfsaOfficialSources[0]],
      note: "Use your CRA Notice of Assessment for actual deduction room.",
    },
    faqs: [
      { q: "Is RRSP bad for middle-income Canadians?", a: "No. It can be useful, but it should be compared with TFSA, FHSA, debt, and refund behaviour." },
      { q: "Should I reinvest my RRSP refund?", a: "Often yes, if your goal is long-term wealth. Spending the refund can reduce the RRSP's advantage." },
      { q: "How do I check my RRSP room?", a: "Use your CRA Notice of Assessment or CRA My Account." },
      { q: "When does RRSP beat TFSA?", a: "Usually when your current marginal tax rate is meaningfully higher than your expected withdrawal tax rate." },
    ],
    disclaimer: commonDisclaimer,
  },

  "tfsa-withdrawals-contribution-room-canada": {
    slug: "tfsa-withdrawals-contribution-room-canada",
    title: "How TFSA Withdrawals Really Affect Contribution Room",
    seoTitle: "How TFSA Withdrawals Affect Room in Canada",
    metaDescription: "Understand how TFSA withdrawals affect contribution room in Canada, including same-year recontribution traps, CRA timing, transfers, and examples.",
    canonical: "https://easyfinancetools.com/blog/tfsa-withdrawals-contribution-room-canada",
    category: "TFSA",
    icon: "TFSA",
    gradient: "from-blue-500 to-indigo-700",
    displayDate: "Last updated May 9, 2026",
    lastUpdated: "May 9, 2026",
    datePublished: "2026-05-09",
    dateModified: "2026-05-09",
    readTime: "10 min read",
    decisionToolTopic: "tfsa",
    officialSources: [tfsaOfficialSources[0], tfsaOfficialSources[1], tfsaOfficialSources[2]],
    shortAnswerHeadline: "When do TFSA withdrawals come back as room?",
    shortAnswer: "Most TFSA withdrawals are added back to contribution room on January 1 of the following calendar year, not immediately. Same-year recontributions can create excess TFSA contributions if you do not already have unused room.",
    keyPoints: [
      "A withdrawal does not usually create same-day or same-year room.",
      "Recontributing too soon can create a 1% per-month excess-contribution tax.",
      "Direct transfers between TFSA issuers are different from withdrawing and recontributing.",
      "CRA My Account can lag behind recent bank or brokerage transactions.",
    ],
    intro: [
      "TFSA withdrawal rules sound simple until real life gets involved. You sell an investment, pull cash out, then want to put it back a few weeks later. The dangerous assumption is that the withdrawal instantly recreates room. It usually does not.",
      "This is one of the most expensive beginner TFSA mistakes because it feels logical. If you had room before, withdrew money, and still have the account, why would putting it back be a problem? The answer is calendar-year timing. This guide explains the practical rule, the edge cases, and how to verify your own room before moving cash.",
    ],
    sections: [
      {
        heading: "The practical withdrawal rule",
        paragraphs: [
          "When you withdraw from a TFSA, the amount is generally added back to your contribution room at the beginning of the next calendar year. If you withdraw $8,000 in June 2026, that withdrawal usually increases room on January 1, 2027. It does not automatically let you put $8,000 back in July 2026.",
          "The exception is not really an exception: if you already had unused contribution room before the withdrawal, you may be able to contribute using that existing room. The withdrawal itself is not what created the same-year space.",
        ],
      },
      {
        heading: "Same-year recontribution trap",
        paragraphs: [
          "The trap usually happens when someone treats a TFSA like a chequing account. They withdraw for a car repair, bonus timing, a home deposit, or a temporary transfer, then replace the money later in the same year. If they had no room left before the withdrawal, the replacement can become an excess contribution.",
          "The consequence can be a tax of 1% per month on the highest excess amount for each month it remains. That is why a small timing error can become a real cost if it is ignored.",
        ],
        table: {
          headers: ["Action", "What many assume", "What to check"],
          rows: [
            ["Withdraw $5,000 in May", "I can put $5,000 back now", "Room usually returns next January"],
            ["Transfer TFSA to another broker", "I should withdraw then deposit", "Use a direct transfer process instead"],
            ["CRA room shows an old number", "The number is always current", "CRA records may lag recent transactions"],
            ["Investment grows inside TFSA", "Growth creates extra room", "Growth is tax-free but not new contribution room"],
          ],
        },
      },
      {
        heading: "Transfers are not the same as withdrawals",
        paragraphs: [
          "A direct transfer from one TFSA issuer to another can move assets without being treated like a withdrawal and new contribution, if handled properly by the institutions. This is very different from selling, withdrawing to your bank account, and then depositing at a new brokerage.",
          "If your goal is changing providers, do not improvise. Ask the receiving institution for the TFSA transfer process, understand transfer fees, and keep records. A clumsy transfer can turn into a room problem.",
        ],
      },
      {
        heading: "How to verify your room",
        paragraphs: [
          "Use CRA My Account as an official record, but remember it may not include very recent contributions or withdrawals. Cross-check it against your own brokerage and bank records for the current year. If you made recent deposits, do not assume CRA has already reflected them.",
          "Before a large contribution, write down your January 1 room, contributions already made this year, withdrawals this year, and whether any withdrawal room is waiting for next January. This simple reconciliation is often more useful than trying to remember transactions from statements later.",
        ],
      },
    ],
    example: {
      title: "Example: withdrawal in July, replacement in September",
      paragraphs: [
        "Liam has $0 of unused TFSA room at the start of 2026 and withdraws $6,000 in July. In September, he deposits $6,000 back into the TFSA. Because he did not have unused room before the withdrawal, the September deposit can be an excess contribution. The withdrawn $6,000 would generally restore room on January 1, 2027.",
        "If Liam had $10,000 of unused room before the withdrawal, the September deposit may be fine because he had existing room. The important distinction is whether room existed before the replacement deposit.",
      ],
    },
    misunderstood: [
      { title: "Withdrawals do not instantly reset room", body: "The room is generally restored next calendar year." },
      { title: "CRA records can lag", body: "Recent transactions may not be reflected in CRA My Account immediately." },
      { title: "Growth is not contribution room", body: "A TFSA can grow tax-free, but growth does not create extra room." },
      { title: "Direct transfers need proper handling", body: "Changing institutions should usually use the TFSA transfer process, not a manual withdraw-and-deposit shortcut." },
    ],
    notAFit: [
      "You need exact room for a large contribution and have not reconciled current-year transactions.",
      "You recently moved accounts and are unsure whether it was a direct transfer.",
      "You actively trade or run business-like activity in the TFSA and need tax advice.",
      "You are relying only on a broker dashboard instead of CRA records plus your own transaction history.",
    ],
    edgeCases: [
      { title: "Non-resident contributions", body: "TFSA contribution rules can be different for non-residents. Confirm residency treatment before contributing." },
      { title: "Multiple TFSA accounts", body: "Room is shared across all TFSAs. A contribution to one institution affects total room." },
      { title: "Death, successor holder, or beneficiary rules", body: "Estate-related TFSA treatment can be more complex than a normal withdrawal." },
      { title: "Overcontribution cleanup", body: "Withdrawing the excess may stop future monthly tax, but filing and reporting may still be required." },
    ],
    mistakes: [
      { title: "Replacing withdrawals too soon", body: "Wait until next January unless you already have unused room." },
      { title: "Counting room twice", body: "Do not count both current unused room and next-year restored room as available today." },
      { title: "Ignoring small deposits", body: "Automatic contributions across multiple accounts can quietly use room." },
      { title: "Forgetting account transfers", body: "A proper transfer is not the same as a withdrawal and contribution." },
    ],
    related: [
      { type: "Tool", label: "TFSA Calculator", href: "/tools/tfsa-calculator", body: "Estimate room and contribution pacing." },
      { type: "Guide", label: "TFSA Contribution Room Canada", href: "/blog/tfsa-contribution-room-canada-2026", body: "Review annual limits, withdrawals, and common mistakes." },
    ],
    methodology: {
      summary: "This guide focuses on CRA TFSA withdrawal and contribution-room timing rules.",
      assumptions: ["Reader is a Canadian TFSA holder.", "Examples use normal contribution and withdrawal situations.", "CRA records and issuer records should be reconciled for exact room."],
      sources: [tfsaOfficialSources[0], tfsaOfficialSources[1], tfsaOfficialSources[2]],
      note: "Use CRA My Account and your own transaction history before making a large contribution.",
    },
    faqs: [
      { q: "Can I put TFSA money back in the same year?", a: "Only if you already have enough unused room. The withdrawal itself usually restores room next January." },
      { q: "Does a TFSA transfer count as a withdrawal?", a: "A proper direct transfer between issuers is different from withdrawing and recontributing. Use the institution transfer process." },
      { q: "Why does CRA show a different room number?", a: "CRA room can lag recent transactions, so reconcile it with current-year account records." },
      { q: "What happens if I overcontribute?", a: "Excess TFSA amounts can be subject to tax. Check CRA rules and correct the issue promptly." },
    ],
    disclaimer: commonDisclaimer,
  },

  "high-yield-dividend-etfs-hurt-wealth-canada": {
    slug: "high-yield-dividend-etfs-hurt-wealth-canada",
    title: "When High-Yield Dividend ETFs Can Hurt Long-Term Wealth",
    seoTitle: "When High-Yield Dividend ETFs Can Hurt Wealth",
    metaDescription: "A Canadian investor guide to high-yield dividend ETF risks, including covered calls, yield traps, taxes, DRIP behaviour, and account fit.",
    canonical: "https://easyfinancetools.com/blog/high-yield-dividend-etfs-hurt-wealth-canada",
    category: "Dividends | Investing",
    icon: "ETF",
    gradient: "from-yellow-500 to-amber-700",
    displayDate: "Last updated May 9, 2026",
    lastUpdated: "May 9, 2026",
    datePublished: "2026-05-09",
    dateModified: "2026-05-09",
    readTime: "11 min read",
    decisionToolTopic: "dividends",
    officialSources: dividendTaxOfficialSources,
    shortAnswerHeadline: "Can high yield be harmful?",
    shortAnswer: "Yes. A high distribution yield can come from concentration, covered-call option premiums, return of capital, declining prices, or sector risk. The danger is choosing the largest payout without checking total return, sustainability, tax treatment, and whether the ETF fits the account's purpose.",
    keyPoints: [
      "Yield is not the same as return.",
      "Covered-call ETFs can trade upside for income.",
      "Taxable accounts need distribution tax treatment and ACB tracking.",
      "A lower-yield diversified ETF can produce better long-term wealth in some scenarios.",
    ],
    intro: [
      "Dividend income feels concrete. A monthly distribution can seem more real than a market price that moves every day. That is why high-yield dividend ETFs attract Canadian investors who want income from a TFSA, RRSP, or taxable account.",
      "The problem is that high yield can hide tradeoffs. Sometimes the ETF is simply income-focused. Other times the payout is partly compensation for risk, limited upside, sector concentration, or a price decline. This guide explains when high-yield dividend ETFs can hurt long-term wealth and how to evaluate them more carefully.",
    ],
    sections: [
      {
        heading: "Yield is not total return",
        paragraphs: [
          "An ETF yielding 8% is not automatically better than one yielding 3%. Total return includes distributions plus price change. If a high-yield ETF pays large distributions while the unit price trends down, the investor may feel paid but still fall behind.",
          "This matters for TFSA investors because contribution room is valuable. Using scarce TFSA room for an asset with weak total return can be costly even if the income is tax-free.",
        ],
      },
      {
        heading: "Covered-call income has a tradeoff",
        paragraphs: [
          "Some high-yield ETFs use covered-call strategies. They can generate option premium income, but the tradeoff is that part of the upside may be capped or sold away. In sideways markets that can feel attractive. In strong markets it can lag a plain equity ETF.",
          "That does not make covered-call ETFs bad. It makes them specific. They may fit an income mandate better than an accumulation mandate. The mistake is using them as a default growth engine without understanding the upside tradeoff.",
        ],
        table: {
          headers: ["Investor goal", "High-yield ETF concern", "What to compare"],
          rows: [
            ["Long-term accumulation", "Lower total return possible", "Broad-market ETF total return"],
            ["Monthly income", "Distribution may fluctuate", "Cash-flow need and capital preservation"],
            ["Taxable account", "Distribution tax treatment", "Eligible dividends, capital gains, ROC, ACB"],
            ["TFSA income", "Uses scarce room", "Growth ETF or balanced ETF alternative"],
          ],
        },
      },
      {
        heading: "Tax treatment can change the result",
        paragraphs: [
          "Canadian dividends, foreign dividends, capital gains, interest, and return of capital are not taxed the same way in a taxable account. Some ETF distributions require adjusted cost base tracking. If the ETF produces return of capital, the cash flow may look like income while changing tax records.",
          "Inside a TFSA or RRSP, current tax reporting may be simpler, but account fit still matters. An RRSP can have different foreign withholding-tax considerations than a TFSA depending on holdings and structure. For Canadian dividend ETFs, the bigger question is usually whether the strategy fits the account's job.",
        ],
      },
      {
        heading: "How to verify before buying",
        paragraphs: [
          "Read the ETF facts, holdings, MER, distribution history, strategy description, and tax-character information. Compare one-, three-, and five-year total return with a relevant plain-vanilla ETF, not only with other high-yield products.",
          "If the ETF uses covered calls, understand what index or holdings it writes calls on and how much of the portfolio is overwritten. If the ETF is sector-heavy, ask whether the payout is compensation for concentration risk.",
        ],
      },
    ],
    example: {
      title: "Example: $100,000 income target portfolio",
      paragraphs: [
        "A retiree wants $500 per month from a $100,000 TFSA. A 6% distribution yield appears to meet the target. But if the ETF's price declines 3% per year while distributions are paid, the investor's capital may erode. A lower-yield balanced approach may require selling units occasionally but could preserve wealth better.",
        "For an accumulator in their 30s, chasing yield can be even more expensive because every dollar paid out and not reinvested reduces compounding. The correct comparison is after-fee, after-tax, total-return fit for the account purpose.",
      ],
    },
    misunderstood: [
      { title: "Income is not automatically safer", body: "A high payout can still come with capital loss, volatility, or concentration." },
      { title: "Monthly payments are not guaranteed", body: "ETF distributions can change." },
      { title: "Covered calls are not free yield", body: "Premium income can come with reduced upside." },
      { title: "ROC is not simple income", body: "Return of capital can affect adjusted cost base in taxable accounts." },
    ],
    notAFit: [
      "You need long-term growth more than current income.",
      "You do not understand the ETF's distribution sources.",
      "The ETF is concentrated in a sector you would not otherwise overweight.",
      "You are buying only because the yield number is higher than alternatives.",
    ],
    edgeCases: [
      { title: "Taxable-account ACB tracking", body: "Return of capital and reinvested distributions can make bookkeeping more complex." },
      { title: "Foreign holdings", body: "Withholding-tax treatment can differ by account and fund structure." },
      { title: "Retirement withdrawals", body: "Income ETFs can fit decumulation, but sequence risk and inflation still matter." },
      { title: "DRIP behaviour", body: "Automatically reinvesting high distributions can hide whether the strategy is actually outperforming." },
    ],
    mistakes: [
      { title: "Ranking ETFs by yield alone", body: "Yield is only one input." },
      { title: "Ignoring fees", body: "Higher MERs can drag long-term returns." },
      { title: "Confusing payout stability with capital safety", body: "The unit price can still fall." },
      { title: "Skipping tax-character review", body: "Distribution type matters outside registered accounts." },
    ],
    related: [
      { type: "Tool", label: "Dividend Calculator", href: "/tools/dividend-calculator", body: "Compare yield targets and capital required." },
      { type: "Guide", label: "Dividend Reinvestment Plans", href: "/blog/dividend-reinvestment-plans-canada", body: "Understand DRIPs, taxes, and compounding tradeoffs." },
    ],
    methodology: {
      summary: "This guide evaluates high-yield ETF decisions through total return, tax treatment, strategy risk, and account fit.",
      assumptions: ["Reader is a Canadian ETF investor.", "Examples are illustrative and do not recommend securities.", "Tax treatment depends on account type and distribution character."],
      sources: dividendTaxOfficialSources,
      note: "Read ETF documents and tax slips before relying on distribution yield.",
    },
    faqs: [
      { q: "Is a high dividend yield bad?", a: "Not automatically. It becomes risky when yield is used as the only decision factor." },
      { q: "Are covered-call ETFs good for TFSA?", a: "They can fit an income goal, but may be weaker for long-term growth because upside can be capped." },
      { q: "What should I compare besides yield?", a: "Compare total return, MER, holdings, strategy, distribution history, tax character, and account fit." },
      { q: "Can distributions change?", a: "Yes. ETF distributions are not guaranteed and can change with markets, holdings, and fund policy." },
    ],
    disclaimer: commonDisclaimer,
  },

  "mortgage-prepayments-vs-investing-canada": {
    slug: "mortgage-prepayments-vs-investing-canada",
    title: "Mortgage Prepayments vs Investing in Canada",
    seoTitle: "Mortgage Prepayments vs Investing Canada",
    metaDescription: "A practical Canadian framework for comparing mortgage prepayments with investing, including rates, taxes, risk, liquidity, and behavioural tradeoffs.",
    canonical: "https://easyfinancetools.com/blog/mortgage-prepayments-vs-investing-canada",
    category: "Mortgage | Investing",
    icon: "Home",
    gradient: "from-rose-500 to-red-700",
    displayDate: "Last updated May 9, 2026",
    lastUpdated: "May 9, 2026",
    datePublished: "2026-05-09",
    dateModified: "2026-05-09",
    readTime: "12 min read",
    decisionToolTopic: "mortgage",
    officialSources: [mortgageOfficialSources[0], mortgageOfficialSources[2], mortgageOfficialSources[3]],
    shortAnswerHeadline: "Should you prepay the mortgage or invest?",
    shortAnswer: "Mortgage prepayments offer a risk-free return equal to the after-tax mortgage interest avoided, while investing offers uncertain expected return and better liquidity. The right choice depends on mortgage rate, tax shelter room, risk tolerance, renewal risk, cash buffer, and whether the household actually invests the difference.",
    keyPoints: [
      "Prepaying is a guaranteed interest-saving decision, not a market-return decision.",
      "Investing can win mathematically but only with risk, discipline, and suitable account room.",
      "High mortgage rates and tight cash flow make prepayments more attractive.",
      "Liquidity matters because mortgage principal is hard to access without borrowing again.",
    ],
    intro: [
      "The mortgage prepayment versus investing debate is often framed as a spreadsheet contest. If expected investment return is higher than the mortgage rate, invest. If not, prepay. That is a useful starting point, but it misses taxes, liquidity, renewal risk, and behaviour.",
      "For Canadian households, the best answer is usually not all-or-nothing. A person with a 5.5% mortgage, no emergency fund, and uncertain job income has a different decision than someone with a 2.2% fixed mortgage, maxed emergency savings, and unused TFSA room. This guide gives a practical framework.",
    ],
    sections: [
      {
        heading: "The clean comparison",
        paragraphs: [
          "A mortgage prepayment avoids future interest. If your mortgage rate is 5%, an extra principal payment is similar to earning a guaranteed 5% before considering mortgage terms and penalties. That is attractive because there is no market volatility.",
          "Investing has an expected return, not a guaranteed return. A diversified portfolio may outperform over long periods, but it can underperform over the years when you need the money or renew the mortgage. That uncertainty is the price of potential upside.",
        ],
      },
      {
        heading: "Tax shelters change the math",
        paragraphs: [
          "If you have TFSA or FHSA room, investment gains may be sheltered from tax if the account is used properly. That makes investing more competitive than the same portfolio in a taxable account. RRSP can also help, but the deduction and future withdrawal tax must be considered.",
          "In a taxable account, investment return needs to be adjusted for tax. Interest, dividends, capital gains, and foreign income are not taxed the same way. Mortgage interest on a principal residence is generally not deductible for most homeowners, so the mortgage prepayment comparison can be cleaner than taxable investing.",
        ],
        table: {
          headers: ["Factor", "Prepayment favours", "Investing favours"],
          rows: [
            ["Mortgage rate", "Higher rate or renewal risk", "Low locked-in rate"],
            ["Account room", "Registered accounts full", "TFSA/FHSA room available"],
            ["Risk tolerance", "Low tolerance for volatility", "Can hold through downturns"],
            ["Liquidity", "Enough cash buffer already", "Need accessible capital"],
          ],
        },
      },
      {
        heading: "Behaviour can dominate the spreadsheet",
        paragraphs: [
          "Investing only beats prepayment if the money is actually invested and left alone. If the alternative to prepaying is spending the cash, the mortgage prepayment can be the better wealth-building mechanism because it converts surplus cash into reduced debt.",
          "The reverse is also true. If prepaying leaves the household cash-poor, the lower debt balance may not feel helpful during a job loss or major repair. A paid-down mortgage is valuable, but liquidity has its own value.",
        ],
      },
      {
        heading: "How to verify your own situation",
        paragraphs: [
          "Check your mortgage prepayment privileges, penalties, current rate, renewal date, and amortization. Then compare against realistic investment returns, account room, taxes, and volatility. Do not use an optimistic market return to justify a decision that would make you anxious during a downturn.",
          "A useful compromise is a split rule: prepay enough to reduce renewal risk while investing a smaller automatic amount in a suitable registered account. The right split depends on cash flow, time horizon, and risk capacity.",
        ],
      },
    ],
    example: {
      title: "Example: $500 per month surplus",
      paragraphs: [
        "A household has a 5.25% mortgage renewing in two years and $500 per month of surplus cash. Putting the full amount on the mortgage produces guaranteed interest savings and lowers renewal balance. Investing the full amount may outperform over 15 years, but the result is uncertain and could be lower at renewal.",
        "A split approach might send $300 to prepayments and $200 to TFSA investing. That is not mathematically perfect, but it can reduce debt while keeping the household engaged with long-term investing.",
      ],
    },
    misunderstood: [
      { title: "Mortgage prepayment is a return", body: "The return is interest avoided, which is relatively certain if no penalties apply." },
      { title: "Expected return is not guaranteed", body: "Investment returns can be negative over short and medium periods." },
      { title: "Liquidity matters", body: "Money in home equity may require borrowing or selling to access." },
      { title: "The best answer can be split", body: "Many households benefit from both debt reduction and investing." },
    ],
    notAFit: [
      "You have high-interest consumer debt that should likely be handled first.",
      "You lack an emergency fund and prepayment would leave you cash-poor.",
      "Your mortgage has penalties or restrictions you have not checked.",
      "You would invest in a portfolio that does not match your timeline or risk tolerance.",
    ],
    edgeCases: [
      { title: "Variable-rate mortgage", body: "Payment and interest-cost risk can change faster than expected." },
      { title: "Rental or Smith Manoeuvre situations", body: "Interest deductibility can become complex and should be reviewed professionally." },
      { title: "FHSA home timeline", body: "First-time buyers may need to compare down-payment saving, not mortgage prepayment." },
      { title: "Renewal in a higher-rate market", body: "Reducing balance before renewal can lower payment pressure." },
    ],
    mistakes: [
      { title: "Using a rosy return assumption", body: "Compare against conservative ranges, not only long-run averages." },
      { title: "Ignoring prepayment limits", body: "Lenders can limit lump sums or charge penalties." },
      { title: "Prepaying before emergency cash", body: "Liquidity problems can force expensive borrowing later." },
      { title: "Treating principal residence debt like all debt", body: "Mortgage debt is usually cheaper than credit-card debt, but still creates renewal risk." },
    ],
    related: [
      { type: "Tool", label: "Mortgage Calculator", href: "/tools/mortgage-calculator", body: "Estimate payment, interest, and prepayment impact." },
      { type: "Tool", label: "Compound Interest Calculator", href: "/tools/compound-interest-calculator", body: "Compare a realistic investing path." },
    ],
    methodology: {
      summary: "This guide compares mortgage prepayments with investing using interest avoided, tax shelter room, liquidity, and risk capacity.",
      assumptions: ["Principal-residence mortgage context unless stated otherwise.", "Investment returns are uncertain.", "Mortgage terms and penalties vary by lender."],
      sources: [mortgageOfficialSources[0], mortgageOfficialSources[2], mortgageOfficialSources[3]],
      note: "Check your own lender terms before making prepayments.",
    },
    faqs: [
      { q: "Is mortgage prepayment risk-free?", a: "The interest saving is relatively certain if there are no penalties, but liquidity and opportunity cost still matter." },
      { q: "What return should I compare against?", a: "Use a realistic after-tax expected return for the account and portfolio, not a best-case market return." },
      { q: "Should I invest if my mortgage rate is low?", a: "Possibly, especially with registered account room and long timelines, but risk tolerance and renewal date matter." },
      { q: "Can I do both?", a: "Yes. A split plan can reduce debt while maintaining long-term investing." },
    ],
    disclaimer: commonDisclaimer,
  },
};

export function getDecisionSupportArticle(slug) {
  return decisionSupportArticles[slug];
}
