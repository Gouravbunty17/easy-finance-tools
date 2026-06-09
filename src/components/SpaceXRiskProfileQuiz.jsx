import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const QUESTIONS = [
  {
    id: "purpose",
    step: "Step 1: The Tradeoff",
    question: "What is the purpose of this investment?",
    why: "A speculative IPO stock should have a clear job in the portfolio before money is committed.",
    options: [
      { value: "retirement", label: "Long-term retirement growth", score: 1 },
      { value: "shortProfit", label: "Short-term profit", score: -2 },
      { value: "playMoney", label: "Speculative play money", score: 1 },
      { value: "unknown", label: "I don't know yet", score: -1 },
    ],
  },
  {
    id: "timeline",
    step: "Step 1: The Tradeoff",
    question: "When do you need this money?",
    why: "Money needed soon usually should not depend on a volatile IPO price.",
    options: [
      { value: "under1", label: "Less than 1 year", score: -3, majorFlag: true },
      { value: "oneToThree", label: "1-3 years", score: -2 },
      { value: "threeToFive", label: "3-5 years", score: 1 },
      { value: "fivePlus", label: "5+ years", score: 2 },
    ],
  },
  {
    id: "account",
    step: "Step 1: The Tradeoff",
    question: "Which account would you use?",
    why: "TFSA, RRSP, and non-registered accounts have different tax, room, and flexibility tradeoffs.",
    options: [
      { value: "tfsa", label: "TFSA", score: 1 },
      { value: "rrsp", label: "RRSP", score: 1 },
      { value: "taxable", label: "Non-registered", score: 1 },
      { value: "notSure", label: "I'm not sure", score: -1 },
    ],
  },
  {
    id: "diversified",
    step: "Step 1: The Tradeoff",
    question: "Do you already have a basic diversified portfolio?",
    why: "A single IPO stock is usually riskier when it is the whole plan instead of a small satellite position.",
    options: [
      { value: "yes", label: "Yes", score: 2 },
      { value: "somewhat", label: "Somewhat", score: 1 },
      { value: "no", label: "No", score: -2 },
      { value: "onlySpacex", label: "I only want SpaceX", score: -3, majorFlag: true },
    ],
  },
  {
    id: "fx",
    step: "Step 2: The Math",
    question: "Do you understand CAD-to-USD conversion fees?",
    why: "A U.S.-listed stock trades in USD, so FX fees and currency movement can change your real Canadian-dollar return.",
    options: [
      { value: "yes", label: "Yes", score: 2 },
      { value: "somewhat", label: "Somewhat", score: 1 },
      { value: "no", label: "No", score: -2 },
    ],
  },
  {
    id: "positionSize",
    step: "Step 2: The Math",
    question: "How much of your total portfolio would SpaceX represent?",
    why: "Position size controls how much one company can help or hurt the portfolio.",
    options: [
      { value: "under2", label: "Less than 2%", score: 2 },
      { value: "twoToFive", label: "2-5%", score: 2 },
      { value: "fiveToTen", label: "5-10%", score: 0 },
      { value: "over10", label: "More than 10%", score: -3, majorFlag: true },
    ],
  },
  {
    id: "orderType",
    step: "Step 2: The Math",
    question: "What order type would you use?",
    why: "IPO-day prices can move quickly. Order type affects the price you may actually pay.",
    options: [
      { value: "limit", label: "Limit order", score: 2 },
      { value: "market", label: "Market order", score: -3, majorFlag: true },
      { value: "unknown", label: "I don't know", score: -2 },
    ],
  },
  {
    id: "dropResponse",
    step: "Step 2: The Math",
    question: "If SpaceX drops 30% after you buy, what would you do?",
    why: "A plan for volatility matters more than confidence during a calm market.",
    options: [
      { value: "hold", label: "Hold because I planned for volatility", score: 2 },
      { value: "review", label: "Buy more only after reviewing the business", score: 1 },
      { value: "panicSell", label: "Panic sell", score: -3, majorFlag: true },
      { value: "unknown", label: "I don't know", score: -2 },
    ],
  },
];

const NEXT_PATHS = {
  notReady: [
    { label: "Read the Beginner Investing Guide", href: "/blog/how-to-start-investing-canada-2026" },
    { label: "Learn how ETFs work", href: "/blog/how-to-choose-etfs-canada" },
    { label: "Compare TFSA vs RRSP", href: "/blog/tfsa-vs-rrsp-canada-2026" },
    { label: "Use the Compound Interest Calculator", href: "/tools/compound-interest-calculator" },
  ],
  beginner: [
    { label: "Compare TFSA vs RRSP", href: "/blog/tfsa-vs-rrsp-canada-2026" },
    { label: "Review CAD/USD conversion costs", href: "/tools/cad-usd-converter" },
    { label: "Compare Canadian broker considerations", href: "/blog/how-to-buy-spacex-ipo-stock-in-canada" },
    { label: "Use the TFSA Calculator", href: "/tools/tfsa-calculator" },
  ],
  speculative: [
    { label: "Compare Canadian brokers and FX fees", href: "/blog/how-to-buy-spacex-ipo-stock-in-canada" },
    { label: "Keep position size controlled", href: "/tools/compound-interest-calculator" },
    { label: "Review IPO risks before buying", href: "/blog/how-to-start-investing-canada-2026" },
    { label: "Compare RRSP impact", href: "/tools/rrsp-calculator" },
  ],
};

function getResult(score, hasMajorFlag) {
  if (score <= 1 || hasMajorFlag) {
    return {
      key: "notReady",
      title: "Not Ready Yet",
      tone: "amber",
      message:
        "You are not ready to buy a high-volatility IPO stock yet. Your answers show too much concentration risk, short-term pressure, or lack of cost awareness. That does not mean you can never buy individual stocks. It means you should build the foundation first.",
    };
  }

  if (score >= 8) {
    return {
      key: "speculative",
      title: "Speculative Investor",
      tone: "emerald",
      message:
        "You appear better prepared to evaluate a speculative IPO stock. This does not mean SpaceX is a good buy. It only means your process is more disciplined: smaller position size, longer timeline, better order control, and better awareness of risk.",
    };
  }

  return {
    key: "beginner",
    title: "Cautious Beginner",
    tone: "blue",
    message:
      "You may be interested in SpaceX, but you should treat it as a small speculative position only. Learn the account rules, FX costs, and order types before placing a trade.",
  };
}

function getWarningBadges(answers) {
  const badges = [
    { title: "Valuation Risk", body: "A great company can still be a bad investment if the price is too high." },
    { title: "IPO Volatility", body: "First-day prices can move sharply." },
    { title: "No Dividend", body: "SpaceX is not an income stock." },
    { title: "Founder Control", body: "Public shareholders may have limited voting influence." },
  ];

  if (answers.fx === "somewhat" || answers.fx === "no") {
    badges.push({ title: "FX Cost", body: "CAD-to-USD conversion fees can reduce your real return." });
  }

  if (
    answers.positionSize === "fiveToTen" ||
    answers.positionSize === "over10" ||
    answers.diversified === "no" ||
    answers.diversified === "onlySpacex"
  ) {
    badges.push({ title: "Single-Stock Risk", body: "One company should not carry your whole portfolio." });
  }

  if (answers.orderType === "market" || answers.orderType === "unknown") {
    badges.push({ title: "Market Order Risk", body: "A market order on IPO day can fill at a much higher price than expected." });
  }

  if (answers.timeline === "under1" || answers.timeline === "oneToThree") {
    badges.push({ title: "Short Timeline Risk", body: "Money needed soon usually does not belong in a volatile IPO stock." });
  }

  return badges;
}

export default function SpaceXRiskProfileQuiz() {
  const [answers, setAnswers] = useState({});
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === QUESTIONS.length;

  const resultData = useMemo(() => {
    const score = QUESTIONS.reduce((total, question) => {
      const selected = question.options.find((option) => option.value === answers[question.id]);
      return total + (selected?.score || 0);
    }, 0);
    const hasMajorFlag = QUESTIONS.some((question) => {
      const selected = question.options.find((option) => option.value === answers[question.id]);
      return Boolean(selected?.majorFlag);
    });

    return {
      score,
      hasMajorFlag,
      result: isComplete ? getResult(score, hasMajorFlag) : null,
      badges: isComplete ? getWarningBadges(answers) : [],
    };
  }, [answers, isComplete]);

  const resultToneClass =
    resultData.result?.tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
      : resultData.result?.tone === "blue"
        ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
        : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20";

  function updateAnswer(questionId, value) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function resetQuiz() {
    setAnswers({});
  }

  return (
    <section className="not-prose my-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">
            Updated for 2026
          </p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">
            SpaceX IPO Risk Profile: Should You Even Consider Buying?
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            This client-side quiz helps Canadian investors check process readiness before considering a speculative IPO stock.
            It does not give a buy, sell, or hold recommendation.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-primary dark:border-slate-700 dark:text-accent">
          Question {Math.min(answeredCount + 1, QUESTIONS.length)} of {QUESTIONS.length}
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        {QUESTIONS.map((question, index) => (
          <fieldset key={question.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
            <legend className="text-base font-bold text-primary dark:text-accent">
              <span className="mr-2 text-xs font-bold uppercase tracking-[0.14em] text-secondary dark:text-emerald-300">
                {question.step}
              </span>
              <span className="block sm:inline">{index + 1}. {question.question}</span>
            </legend>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{question.why}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.value;
                const risky = option.score < 0;
                return (
                  <label
                    key={option.value}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      selected
                        ? "border-secondary bg-emerald-50 text-primary shadow-sm dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-accent"
                        : risky
                          ? "border-amber-200 bg-white text-slate-700 hover:border-amber-400 dark:border-amber-900/60 dark:bg-gray-800 dark:text-slate-200"
                          : "border-slate-200 bg-white text-slate-700 hover:border-secondary dark:border-slate-700 dark:bg-gray-800 dark:text-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={selected}
                      onChange={() => updateAnswer(question.id, option.value)}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={resetQuiz}
          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-primary transition hover:border-secondary dark:border-slate-700 dark:text-accent"
        >
          Reset quiz
        </button>
        {!isComplete ? (
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Answer all {QUESTIONS.length} questions to see your educational risk profile.
          </p>
        ) : null}
      </div>

      {isComplete && resultData.result ? (
        <div className={`mt-8 rounded-3xl border p-6 ${resultToneClass}`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                Educational result
              </p>
              <h3 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{resultData.result.title}</h3>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm dark:bg-slate-900 dark:text-accent">
              Score: {resultData.score}
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">{resultData.result.message}</p>

          <div className="mt-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-primary dark:text-accent">Risk badges</h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {resultData.badges.map((badge) => (
                <div key={badge.title} className="rounded-2xl border border-white/70 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="font-bold text-primary dark:text-accent">{badge.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{badge.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-primary dark:text-accent">Next Path</h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {NEXT_PATHS[resultData.result.key].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="rounded-2xl border border-white/70 bg-white p-4 text-sm font-bold text-primary shadow-sm transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 p-4 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
            <p>Your quiz answers are processed in your browser and are not stored in our database.</p>
            <p className="mt-2">This tool is for education only and does not provide personal financial, tax, legal, or investment advice.</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
