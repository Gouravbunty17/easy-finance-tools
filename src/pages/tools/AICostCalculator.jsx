import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  CpuChipIcon,
  LinkIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";
import ToolPageSchema from "../../components/ToolPageSchema";
import FAQSchema from "../../components/FAQSchema";
import ToolByline from "../../components/ToolByline";
import EducationalDisclaimer from "../../components/EducationalDisclaimer";
import OfficialSourceNote from "../../components/OfficialSourceNote";
import ContributorReviewBox from "../../components/ContributorReviewBox";
import SourceVerificationBlock from "../../components/SourceVerificationBlock";
import CalculatorResultGuidance from "../../components/CalculatorResultGuidance";
import RelatedContent from "../../components/RelatedContent";
import MethodologyPanel from "../../components/MethodologyPanel";

const WORD_TO_TOKEN_RATIO = 1.33;

const PRICING_DATA = {
  lastChecked: "May 31, 2026",
  models: [
    { id: "gpt-4o-mini", label: "OpenAI GPT-4o mini", input: 0.15, output: 0.6 },
    { id: "gpt-4o", label: "OpenAI GPT-4o", input: 5, output: 15 },
    { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", input: 1, output: 5 },
    { id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5", input: 3, output: 15 },
    { id: "gemini-flash-lite", label: "Gemini 2.5 Flash-Lite", input: 0.1, output: 0.4 },
    { id: "grok-fast", label: "xAI Grok fast", input: 0.2, output: 0.5 },
    { id: "custom", label: "Custom model pricing", input: 1, output: 3 },
  ],
  sources: [
    { label: "OpenAI API pricing", href: "https://openai.com/api/pricing/" },
    { label: "Anthropic pricing", href: "https://www.anthropic.com/pricing" },
    { label: "Google Gemini pricing", href: "https://ai.google.dev/gemini-api/docs/pricing" },
    { label: "xAI API pricing", href: "https://docs.x.ai/docs/models" },
  ],
};

const LAST_UPDATED = PRICING_DATA.lastChecked;
const MODEL_PRESETS = PRICING_DATA.models;
const SOURCE_LINKS = PRICING_DATA.sources;

const DEFAULT_FORM = {
  modelId: "gpt-4o-mini",
  currency: "CAD",
  cadRate: 1.37,
  trafficMode: "users",
  monthlyUsers: 1000,
  requestsPerUserPerDay: 2,
  monthlyRequests: 60000,
  unitMode: "tokens",
  inputTokens: 900,
  outputTokens: 450,
  inputWords: 675,
  outputWords: 340,
  inputPricePerMillion: 0.15,
  outputPricePerMillion: 0.6,
  cacheSavingsPercent: 0,
  agentLoopMultiplier: 1,
  retrievedDocs: 0,
  tokensPerRetrievedDoc: 350,
  imageCallsPerMonth: 0,
  imageCostPerThousand: 0,
  hostingCost: 25,
  storageCost: 10,
  databaseCost: 20,
  monitoringCost: 10,
  otherCost: 0,
  subscriptionPrice: 19,
  paidConversionPercent: 5,
  supportCostPerPaidUser: 2,
  paymentFeePercent: 2.9,
  paymentFixedFee: 0.3,
};

const FAQS = [
  {
    q: "Does this calculator show exact AI API billing?",
    a: "No. It is an educational estimate based on provider token pricing, request volume, and your assumptions. Actual billing can change with model pricing, caching, tool calls, retries, images, currency conversion, and provider-specific billing rules.",
  },
  {
    q: "Why does the calculator include an agent loop multiplier?",
    a: "Agent-style workflows can make several model calls for one user request. The multiplier helps estimate that hidden usage instead of treating every workflow as a single prompt and response.",
  },
  {
    q: "Why is CAD planning included?",
    a: "Many AI providers publish prices in USD. Canadian businesses often need to think about USD → CAD conversion, GST/HST, accounting treatment, and margin in Canadian dollars.",
  },
  {
    q: "Are my calculator inputs stored?",
    a: "No. The calculator runs in your browser. Sharing a URL only encodes the estimate assumptions in the link you choose to copy.",
  },
];

const decisionSteps = [
  {
    title: "The Tradeoff",
    body: "Cheaper models may protect margin, while stronger models may reduce support time or improve quality. The question is not only price - it is whether the workflow still works at scale.",
  },
  {
    title: "The Math",
    body: "Estimate requests, input tokens, output tokens, retrieved-document tokens, agent loops, image calls, and non-AI operating costs before pricing a product.",
  },
  {
    title: "The Context",
    body: "Canadian planning usually means USD pricing, CAD revenue, FX movement, GST/HST, bookkeeping treatment, and provider pricing that can change without much warning.",
  },
  {
    title: "The Next Path",
    body: "Compare models, stress-test pricing tiers, add usage limits, and verify provider dashboards before treating the result as a production budget.",
  },
];

function toNumber(value, fallback = 0) {
  if (value === "" || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((toNumber(value) + Number.EPSILON) * factor) / factor;
}

function formatCurrency(value, currency = "CAD", maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(toNumber(value));
}

function calculateCoreCosts(form, override = {}) {
  const merged = { ...form, ...override };
  const cadRate = Math.max(toNumber(merged.cadRate, 1), 0.01);
  const currencyMultiplier = merged.currency === "CAD" ? cadRate : 1;
  const baseMonthlyRequests =
    merged.trafficMode === "users"
      ? toNumber(merged.monthlyUsers) * toNumber(merged.requestsPerUserPerDay) * 30
      : toNumber(merged.monthlyRequests);
  const inputUnit =
    merged.unitMode === "words"
      ? toNumber(merged.inputWords) * WORD_TO_TOKEN_RATIO
      : toNumber(merged.inputTokens);
  const outputUnit =
    merged.unitMode === "words"
      ? toNumber(merged.outputWords) * WORD_TO_TOKEN_RATIO
      : toNumber(merged.outputTokens);
  const ragTokens = toNumber(merged.retrievedDocs) * toNumber(merged.tokensPerRetrievedDoc);
  const effectiveInputTokens = Math.max(inputUnit + ragTokens, 0);
  const effectiveOutputTokens = Math.max(outputUnit, 0);
  const agentLoopMultiplier = Math.max(toNumber(merged.agentLoopMultiplier, 1), 0.1);
  const monthlyRequests = Math.max(baseMonthlyRequests * agentLoopMultiplier, 0);
  const cacheMultiplier = 1 - Math.min(Math.max(toNumber(merged.cacheSavingsPercent), 0), 95) / 100;
  const inputCostUsd =
    (monthlyRequests * effectiveInputTokens * toNumber(merged.inputPricePerMillion) * cacheMultiplier) /
    1000000;
  const outputCostUsd =
    (monthlyRequests * effectiveOutputTokens * toNumber(merged.outputPricePerMillion)) / 1000000;
  const visionCostUsd =
    (toNumber(merged.imageCallsPerMonth) * toNumber(merged.imageCostPerThousand)) / 1000;
  const aiCostUsd = inputCostUsd + outputCostUsd + visionCostUsd;
  const infrastructureUsd =
    toNumber(merged.hostingCost) +
    toNumber(merged.storageCost) +
    toNumber(merged.databaseCost) +
    toNumber(merged.monitoringCost) +
    toNumber(merged.otherCost);
  const paidUsers = toNumber(merged.monthlyUsers) * (toNumber(merged.paidConversionPercent) / 100);
  const revenueUsd = paidUsers * toNumber(merged.subscriptionPrice);
  const paymentFeesUsd =
    revenueUsd * (toNumber(merged.paymentFeePercent) / 100) + paidUsers * toNumber(merged.paymentFixedFee);
  const supportCostUsd = paidUsers * toNumber(merged.supportCostPerPaidUser);
  const totalCostUsd = aiCostUsd + infrastructureUsd + paymentFeesUsd + supportCostUsd;
  const profitUsd = revenueUsd - totalCostUsd;
  const breakEvenPriceUsd = paidUsers > 0 ? totalCostUsd / paidUsers : 0;

  return {
    baseMonthlyRequests,
    monthlyRequests,
    inputUnit,
    outputUnit,
    ragTokens,
    effectiveInputTokens,
    effectiveOutputTokens,
    agentLoopMultiplier,
    inputCostUsd,
    outputCostUsd,
    visionCost: visionCostUsd * currencyMultiplier,
    visionCostUsd,
    aiCostUsd,
    infrastructureUsd,
    paymentFeesUsd,
    supportCostUsd,
    paidUsers,
    revenueUsd,
    totalCostUsd,
    profitUsd,
    breakEvenPriceUsd,
    aiCost: aiCostUsd * currencyMultiplier,
    totalCost: totalCostUsd * currencyMultiplier,
    revenue: revenueUsd * currencyMultiplier,
    profit: profitUsd * currencyMultiplier,
    breakEvenPrice: breakEvenPriceUsd * currencyMultiplier,
  };
}

function serializeForm(form) {
  const params = new URLSearchParams();
  Object.entries(form).forEach(([key, value]) => {
    if (value !== DEFAULT_FORM[key]) params.set(key, String(value));
  });
  return params.toString();
}

function parseSharedForm(hash) {
  const raw = hash.replace(/^#estimate=?/, "");
  if (!raw) return null;
  const params = new URLSearchParams(raw);
  const next = { ...DEFAULT_FORM };
  Object.keys(DEFAULT_FORM).forEach((key) => {
    if (params.has(key)) next[key] = params.get(key);
  });
  return next;
}

function getDecisionTone(results) {
  if (results.profit < 0) {
    return {
      label: "Margin pressure",
      body: "Your assumptions currently point to negative margin. Before launch, compare a cheaper model, tighter usage limits, a higher price, or fewer agent/tool loops.",
      tone: "amber",
    };
  }
  if (results.aiCost > results.revenue * 0.25 && results.revenue > 0) {
    return {
      label: "AI cost is meaningful",
      body: "AI usage is a noticeable part of revenue in this estimate. Watch token growth, retrieval size, and repeated agent calls as customer usage increases.",
      tone: "blue",
    };
  }
  return {
    label: "Planning estimate",
    body: "The model appears workable under these assumptions, but provider prices, FX rates, retries, and customer behavior can move the answer quickly.",
    tone: "green",
  };
}

function Field({ label, helper, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-primary dark:text-accent">{label}</span>
      {helper ? <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{helper}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function NumberInput({ value, onChange, min = "0", step = "any", suffix }) {
  return (
    <div className="relative">
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm outline-none transition focus:border-secondary dark:border-slate-700 dark:bg-slate-950 dark:text-accent"
      />
      {suffix ? (
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="focus-ring min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm outline-none transition focus:border-secondary dark:border-slate-700 dark:bg-slate-950 dark:text-accent"
    >
      {children}
    </select>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="grid gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-950 sm:grid-cols-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`focus-ring rounded-xl px-4 py-3 text-sm font-bold transition ${
            value === option.value
              ? "bg-primary text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950"
              : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ResultCard({ title, value, body, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-emerald-50 p-3 text-secondary dark:bg-emerald-950/30 dark:text-emerald-300">
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{title}</p>
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-primary dark:text-accent">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
    </div>
  );
}

function BarRow({ label, value, max, currency }) {
  const width = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-primary dark:text-accent">{label}</span>
        <span className="text-slate-600 dark:text-slate-300">{formatCurrency(value, currency)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-secondary" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function DecisionFrameworkBlock() {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {decisionSteps.map((step, index) => (
        <div key={step.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-sm font-black text-white dark:bg-emerald-500 dark:text-slate-950">
            {index + 1}
          </span>
          <h2 className="mt-4 text-lg font-bold text-primary dark:text-accent">{step.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.body}</p>
        </div>
      ))}
    </section>
  );
}

export default function AICostCalculator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const parsed = parseSharedForm(window.location.hash);
    if (parsed) setForm(parsed);
  }, []);

  const selectedPreset = MODEL_PRESETS.find((model) => model.id === form.modelId) || MODEL_PRESETS[0];

  const updateField = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "modelId") {
        const preset = MODEL_PRESETS.find((model) => model.id === value);
        if (preset && preset.id !== "custom") {
          next.inputPricePerMillion = preset.input;
          next.outputPricePerMillion = preset.output;
        }
      }
      return next;
    });
  };

  const results = useMemo(() => calculateCoreCosts(form), [form]);
  const currency = form.currency;
  const decisionTone = getDecisionTone(results);
  const maxBreakdown = Math.max(results.aiCost, results.infrastructureUsd * (currency === "CAD" ? toNumber(form.cadRate, 1) : 1), results.paymentFeesUsd * (currency === "CAD" ? toNumber(form.cadRate, 1) : 1), results.supportCostUsd * (currency === "CAD" ? toNumber(form.cadRate, 1) : 1), 1);

  const comparisonRows = MODEL_PRESETS.filter((model) => model.id !== "custom").map((model) => {
    const modelResult = calculateCoreCosts(form, {
      inputPricePerMillion: model.input,
      outputPricePerMillion: model.output,
    });
    return {
      ...model,
      aiCost: modelResult.aiCost,
      totalCost: modelResult.totalCost,
      profit: modelResult.profit,
      breakEvenPrice: modelResult.breakEvenPrice,
    };
  });

  const tiers = [0.5, 1, 2, 5].map((multiplier) => {
    const tierResult = calculateCoreCosts(form, {
      monthlyUsers: toNumber(form.monthlyUsers) * multiplier,
      monthlyRequests: toNumber(form.monthlyRequests) * multiplier,
    });
    return { multiplier, ...tierResult };
  });

  const copyText = async (kind) => {
    const summary = [
      "AI cost planning estimate",
      `Model: ${selectedPreset.label}`,
      `Estimated monthly AI cost: ${formatCurrency(results.aiCost, currency)}`,
      `Estimated total monthly cost: ${formatCurrency(results.totalCost, currency)}`,
      `Estimated break-even price: ${formatCurrency(results.breakEvenPrice, currency, 2)} per paid user`,
      `Monthly model calls after loop multiplier: ${Math.round(results.monthlyRequests).toLocaleString("en-CA")}`,
      "Verify provider pricing, usage dashboards, FX, GST/HST, and accounting treatment before production budgeting.",
    ].join("\n");

    const value =
      kind === "url"
        ? `${window.location.origin}${window.location.pathname}#estimate=${serializeForm(form)}`
        : summary;
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const exportCsv = () => {
    const rows = [
      ["Metric", "Value"],
      ["Model", selectedPreset.label],
      ["Currency", currency],
      ["Base monthly requests", Math.round(results.baseMonthlyRequests)],
      ["Agent loop multiplier", results.agentLoopMultiplier],
      ["Monthly model calls", Math.round(results.monthlyRequests)],
      ["Input tokens per call", Math.round(results.effectiveInputTokens)],
      ["Output tokens per call", Math.round(results.effectiveOutputTokens)],
      ["Retrieved document tokens per call", Math.round(results.ragTokens)],
      ["Monthly AI cost", round(results.aiCost, 2)],
      ["Vision/image add-on cost", round(results.visionCost, 2)],
      ["Total monthly cost", round(results.totalCost, 2)],
      ["Estimated revenue", round(results.revenue, 2)],
      ["Estimated profit", round(results.profit, 2)],
      ["Break-even price per paid user", round(results.breakEvenPrice, 2)],
      ["Pricing data last updated", LAST_UPDATED],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-cost-estimate.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => setForm(DEFAULT_FORM);

  return (
    <>
      <SEO
        title="AI Cost Calculator for Canadian Business Planning | Easy Finance Tools"
        description="Estimate AI API, token, agent-loop, RAG, image, and SaaS operating costs in CAD or USD before pricing an AI product or workflow."
        canonical="/tools/ai-cost-calculator"
      />
      <ToolPageSchema
        name="AI Cost Calculator"
        description="Estimate AI API and operating costs using token pricing, agent loops, RAG, image usage, and Canadian business planning caveats."
        canonical="/tools/ai-cost-calculator"
        category="BusinessApplication"
      />
      <FAQSchema faqs={FAQS} />

      <main className="bg-white text-slate-900 dark:bg-gray-950 dark:text-slate-100">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary dark:bg-emerald-950/30 dark:text-emerald-300">
                AI budget decision support
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-primary dark:text-accent sm:text-5xl">
                AI Cost Calculator for Canadian Business Planning
              </h1>
              <ToolByline updated={LAST_UPDATED} reviewed="Pricing-source links and calculator assumptions checked" className="mt-4" />
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Estimate whether an AI workflow can support your pricing, margin, and usage limits before you ship it. This tool focuses on decisions: model cost, token growth, agent loops, retrieval, image usage, and Canadian dollar planning.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["No login required", "Inputs stay in browser", "CAD/USD planning"].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-accent">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Decision snapshot</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{decisionTone.label}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{decisionTone.body}</p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-white p-4 dark:bg-gray-800">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Monthly model calls</p>
                  <p className="mt-1 text-2xl font-black text-primary dark:text-accent">{Math.round(results.monthlyRequests).toLocaleString("en-CA")}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 dark:bg-gray-800">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Break-even price</p>
                  <p className="mt-1 text-2xl font-black text-primary dark:text-accent">
                    {formatCurrency(results.breakEvenPrice, currency, 2)}
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400"> / paid user</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <OfficialSourceNote
            title="Pricing source check"
            body={`Provider AI prices can change quickly. Pricing data last checked: ${LAST_UPDATED}. Verify source links before production budgeting.`}
            sources={SOURCE_LINKS}
          />
          <EducationalDisclaimer />
          <DecisionFrameworkBlock />

          <section className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <form className="min-w-0 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800" onSubmit={(event) => event.preventDefault()}>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Inputs</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Build the estimate</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Keep the first pass simple, then expand agent, retrieval, and operating-cost assumptions if the number matters.
                </p>
              </div>

              <Field label="Model pricing preset" helper="Choose a provider preset or enter custom prices per 1M tokens.">
                <Select value={form.modelId} onChange={(value) => updateField("modelId", value)}>
                  {MODEL_PRESETS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Currency">
                  <Segmented
                    value={form.currency}
                    onChange={(value) => updateField("currency", value)}
                    options={[
                      { value: "CAD", label: "CAD" },
                      { value: "USD", label: "USD" },
                    ]}
                  />
                </Field>
                <Field label="USD → CAD rate" helper="Planning assumption only.">
                  <NumberInput value={form.cadRate} onChange={(value) => updateField("cadRate", value)} suffix="CAD" />
                </Field>
              </div>

              <Field label="Traffic estimate mode">
                <Segmented
                  value={form.trafficMode}
                  onChange={(value) => updateField("trafficMode", value)}
                  options={[
                    { value: "users", label: "Users" },
                    { value: "requests", label: "Requests" },
                  ]}
                />
              </Field>

              {form.trafficMode === "users" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Monthly active users">
                    <NumberInput value={form.monthlyUsers} onChange={(value) => updateField("monthlyUsers", value)} />
                  </Field>
                  <Field label="AI requests per user per day">
                    <NumberInput value={form.requestsPerUserPerDay} onChange={(value) => updateField("requestsPerUserPerDay", value)} />
                  </Field>
                </div>
              ) : (
                <Field label="Monthly AI requests">
                  <NumberInput value={form.monthlyRequests} onChange={(value) => updateField("monthlyRequests", value)} />
                </Field>
              )}

              <Field label="Estimate by">
                <Segmented
                  value={form.unitMode}
                  onChange={(value) => updateField("unitMode", value)}
                  options={[
                    { value: "tokens", label: "Tokens" },
                    { value: "words", label: "Words" },
                  ]}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={form.unitMode === "tokens" ? "Input tokens per request" : "Input words per request"}>
                  <NumberInput
                    value={form.unitMode === "tokens" ? form.inputTokens : form.inputWords}
                    onChange={(value) => updateField(form.unitMode === "tokens" ? "inputTokens" : "inputWords", value)}
                  />
                </Field>
                <Field label={form.unitMode === "tokens" ? "Output tokens per request" : "Output words per request"}>
                  <NumberInput
                    value={form.unitMode === "tokens" ? form.outputTokens : form.outputWords}
                    onChange={(value) => updateField(form.unitMode === "tokens" ? "outputTokens" : "outputWords", value)}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Input price per 1M tokens" helper="USD provider pricing.">
                  <NumberInput value={form.inputPricePerMillion} onChange={(value) => updateField("inputPricePerMillion", value)} prefix="$" />
                </Field>
                <Field label="Output price per 1M tokens" helper="USD provider pricing.">
                  <NumberInput value={form.outputPricePerMillion} onChange={(value) => updateField("outputPricePerMillion", value)} />
                </Field>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-bold text-primary dark:text-accent">Advanced cost controls</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Agent loop multiplier" helper="1 user action can trigger several model calls.">
                    <NumberInput value={form.agentLoopMultiplier} onChange={(value) => updateField("agentLoopMultiplier", value)} />
                  </Field>
                  <Field label="Cache savings" helper="Percentage reduction on input token cost.">
                    <NumberInput value={form.cacheSavingsPercent} onChange={(value) => updateField("cacheSavingsPercent", value)} suffix="%" />
                  </Field>
                  <Field label="Retrieved documents per request">
                    <NumberInput value={form.retrievedDocs} onChange={(value) => updateField("retrievedDocs", value)} />
                  </Field>
                  <Field label="Tokens per retrieved document">
                    <NumberInput value={form.tokensPerRetrievedDoc} onChange={(value) => updateField("tokensPerRetrievedDoc", value)} />
                  </Field>
                  <Field label="Image or vision calls per month">
                    <NumberInput value={form.imageCallsPerMonth} onChange={(value) => updateField("imageCallsPerMonth", value)} />
                  </Field>
                  <Field label="Image cost per 1,000 calls" helper="USD planning assumption.">
                    <NumberInput value={form.imageCostPerThousand} onChange={(value) => updateField("imageCostPerThousand", value)} />
                  </Field>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-bold text-primary dark:text-accent">Business assumptions</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ["hostingCost", "Hosting"],
                    ["storageCost", "Storage"],
                    ["databaseCost", "Database"],
                    ["monitoringCost", "Monitoring"],
                    ["otherCost", "Other monthly costs"],
                    ["subscriptionPrice", "Subscription price"],
                    ["paidConversionPercent", "Paid conversion"],
                    ["supportCostPerPaidUser", "Support cost per paid user"],
                    ["paymentFeePercent", "Payment fee"],
                    ["paymentFixedFee", "Fixed fee per payment"],
                  ].map(([key, label]) => (
                    <Field key={key} label={label}>
                      <NumberInput
                        value={form[key]}
                        onChange={(value) => updateField(key, value)}
                        suffix={key.toLowerCase().includes("percent") ? "%" : undefined}
                      />
                    </Field>
                  ))}
                </div>
              </div>
            </form>

            <div className="min-w-0 space-y-6">
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <ResultCard
                  icon={CpuChipIcon}
                  title="Monthly AI cost"
                  value={formatCurrency(results.aiCost, currency)}
                  body="Model, token, RAG, agent-loop, cache, and image/vision usage."
                />
                <ResultCard
                  icon={ChartBarIcon}
                  title="Total monthly cost"
                  value={formatCurrency(results.totalCost, currency)}
                  body="AI cost plus hosting, database, support, payment fees, and other operating costs."
                />
                <ResultCard
                  icon={ShieldCheckIcon}
                  title="Estimated profit"
                  value={formatCurrency(results.profit, currency)}
                  body="Revenue minus modeled costs. Negative profit means the assumptions need review."
                />
                <ResultCard
                  icon={ArrowPathIcon}
                  title="Break-even price"
                  value={formatCurrency(results.breakEvenPrice, currency, 2)}
                  body="Approximate monthly price needed per paid user before profit."
                />
              </div>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Cost breakdown</p>
                    <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Where the estimate comes from</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => copyText("summary")} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:text-accent">
                      <ClipboardDocumentIcon className="h-4 w-4" />
                      {copied === "summary" ? "Copied" : "Copy summary"}
                    </button>
                    <button type="button" onClick={() => copyText("url")} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:text-accent">
                      <LinkIcon className="h-4 w-4" />
                      {copied === "url" ? "Copied" : "Share URL"}
                    </button>
                    <button type="button" onClick={exportCsv} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:text-accent">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      CSV
                    </button>
                    <button type="button" onClick={resetForm} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary dark:bg-emerald-500 dark:text-slate-950">
                      Reset
                    </button>
                  </div>
                </div>
                <div className="mt-6 space-y-5">
                  <BarRow label="AI API usage" value={results.aiCost} max={maxBreakdown} currency={currency} />
                  <BarRow label="Infrastructure" value={results.infrastructureUsd * (currency === "CAD" ? toNumber(form.cadRate, 1) : 1)} max={maxBreakdown} currency={currency} />
                  <BarRow label="Payment fees" value={results.paymentFeesUsd * (currency === "CAD" ? toNumber(form.cadRate, 1) : 1)} max={maxBreakdown} currency={currency} />
                  <BarRow label="Support cost" value={results.supportCostUsd * (currency === "CAD" ? toNumber(form.cadRate, 1) : 1)} max={maxBreakdown} currency={currency} />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Model comparison</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Compare provider pricing assumptions</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-[760px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">Model</th>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">AI cost</th>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">Total cost</th>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">Profit</th>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">Break-even</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                          <td className="px-3 py-4 font-semibold text-primary dark:text-accent">{row.label}</td>
                          <td className="px-3 py-4">{formatCurrency(row.aiCost, currency)}</td>
                          <td className="px-3 py-4">{formatCurrency(row.totalCost, currency)}</td>
                          <td className={`px-3 py-4 font-semibold ${row.profit < 0 ? "text-amber-700 dark:text-amber-300" : "text-secondary dark:text-emerald-300"}`}>{formatCurrency(row.profit, currency)}</td>
                          <td className="px-3 py-4">{formatCurrency(row.breakEvenPrice, currency, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">Scale stress test</p>
                <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What changes as usage grows?</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-[680px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">Usage level</th>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">Model calls</th>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">AI cost</th>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">Total cost</th>
                        <th className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tiers.map((tier) => (
                        <tr key={tier.multiplier} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                          <td className="px-3 py-4 font-semibold text-primary dark:text-accent">{tier.multiplier}× usage</td>
                          <td className="px-3 py-4">{Math.round(tier.monthlyRequests).toLocaleString("en-CA")}</td>
                          <td className="px-3 py-4">{formatCurrency(tier.aiCost, currency)}</td>
                          <td className="px-3 py-4">{formatCurrency(tier.totalCost, currency)}</td>
                          <td className={`px-3 py-4 font-semibold ${tier.profit < 0 ? "text-amber-700 dark:text-amber-300" : "text-secondary dark:text-emerald-300"}`}>{formatCurrency(tier.profit, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </section>

          <CalculatorResultGuidance
            className="mt-10"
            whatThisResultMeans="This estimate helps you decide whether the AI workflow, model choice, usage limits, and subscription price appear financially workable before launch."
            assumptions={[
              "Provider prices are entered in USD per 1 million tokens.",
              "Agent loop multiplier estimates extra model calls triggered by one user action.",
              "RAG tokens are treated as extra input tokens for each model call.",
              "Revenue and support assumptions are planning inputs, not accounting records.",
            ]}
            canadianTaxCaveat="Canadian businesses should separately review GST/HST, income tax treatment, FX gains or losses, and bookkeeping with a qualified professional."
            source={SOURCE_LINKS[0]}
            sources={SOURCE_LINKS.slice(1)}
            relatedCalculator={{ href: "/tools/cad-usd-converter", label: "the CAD/USD converter" }}
            nextStepLinks={[
              { href: "/blog/how-to-start-investing-canada-2026", label: "Review beginner-friendly planning assumptions" },
              { href: "/tools/compound-interest-calculator", label: "Compare cost savings or reinvestment over time" },
              { href: "/methodology", label: "Read how Easy Finance Tools builds calculators" },
            ]}
          />

          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">
              Estimate limits
            </p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">
              What could break this estimate?
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "One input can change everything",
                  body: "If your estimate depends heavily on one variable — such as monthly requests, average tokens per response, agent loop multiplier, or expected efficiency gain — small changes can materially change the result. Stress-test the estimate before using it for budgeting.",
                },
                {
                  title: "Not a vendor recommendation",
                  body: "This calculator is for educational estimation only. It does not recommend OpenAI, Anthropic, Google, xAI, or any other AI provider. Model comparisons are shown to help users understand tradeoffs, not to promote a specific platform.",
                },
                {
                  title: "Verify official pricing before committing",
                  body: "AI subscription tiers, API token costs, rate limits, caching discounts, and usage policies can change. Always verify the latest pricing and terms directly with the official provider before making financial commitments.",
                },
                {
                  title: "Educational planning tool only",
                  body: "This calculator is not professional business, financial, accounting, legal, or technical advice. The assumptions are simplified for planning and should be reviewed by a qualified professional before you act.",
                },
                {
                  title: "Direct API cost is not the full cost",
                  body: "The estimate focuses on direct usage costs. It may not include implementation time, employee training, prompt engineering, monitoring, data privacy compliance, security review, human-in-the-loop oversight, downtime risk, or support costs.",
                },
                {
                  title: "Your inputs stay private",
                  body: "EasyFinanceTools does not store your calculator inputs in a database. Calculations run client-side in your current session.",
                },
              ].map((warning) => (
                <div
                  key={warning.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60"
                >
                  <h3 className="text-base font-bold text-primary dark:text-accent">{warning.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{warning.body}</p>
                </div>
              ))}
            </div>
          </section>

          <RelatedContent
            className="mt-10"
            title="Next planning steps"
            intro="Use these when the AI estimate changes pricing, savings, or business planning decisions."
            items={[
              {
                type: "Calculator",
                title: "CAD/USD Converter",
                href: "/tools/cad-usd-converter",
                body: "Translate USD-denominated provider costs into a Canadian planning number.",
              },
              {
                type: "Calculator",
                title: "Compound Interest Calculator",
                href: "/tools/compound-interest-calculator",
                body: "Compare how recurring software cost savings could compound if reinvested.",
              },
              {
                type: "Trust",
                title: "Methodology",
                href: "/methodology",
                body: "See how calculators are built, caveated, and checked against source material.",
              },
            ]}
          />

          <SourceVerificationBlock
            className="mt-10"
            lastUpdated={LAST_UPDATED}
            verifiedFor="2026"
            sources={SOURCE_LINKS}
            checked={[
              "Provider pricing source links",
              "Token, RAG, agent-loop, image, and operating-cost formulas",
              "USD → CAD planning caveats and privacy messaging",
            ]}
            limitations={[
              "Provider pricing and model names can change quickly.",
              "This tool does not estimate every provider-specific billing feature, retry pattern, cache rule, or tax/accounting treatment.",
              "Production teams should verify live usage dashboards and invoices before making pricing decisions.",
            ]}
          />

          <ContributorReviewBox className="mt-10" />

          <MethodologyPanel
            title="How this AI cost calculator works"
            updated={LAST_UPDATED}
            summary="The calculator estimates AI cost from request volume, token volume, provider prices, agent loops, retrieved context, image calls, and business operating costs. It then compares the estimate with revenue assumptions to highlight margin and break-even pressure."
            assumptions={[
              "Input and output model prices are entered in USD per 1 million tokens.",
              "Words are converted to tokens using a simple 1.33 token-per-word planning ratio.",
              "Agent loops multiply the number of model calls, not the number of users.",
              "Canadian-dollar results use the FX rate entered by the user.",
            ]}
            sources={SOURCE_LINKS}
            note="Educational planning estimate only. Verify official provider pricing, invoices, GST/HST, FX, and accounting treatment before making production or pricing decisions."
          />

          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">FAQ</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">AI cost calculator questions</h2>
            <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-700">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="cursor-pointer text-base font-bold text-primary marker:text-secondary dark:text-accent">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-10 rounded-3xl bg-primary p-6 text-white dark:bg-emerald-500 dark:text-slate-950">
            <h2 className="text-2xl font-black">Use the estimate to make a decision, not just admire the number.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 opacity-90">
              If the margin is tight, the next move is usually model comparison, usage limits, caching, product pricing, or workflow simplification. The right question is: what has to be true for this AI feature to remain affordable?
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/tools" className="focus-ring rounded-full bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-emerald-50 dark:text-slate-950">
                Browse all tools
              </Link>
              <Link to="/contact" className="focus-ring rounded-full border border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 dark:border-slate-950/30 dark:text-slate-950 dark:hover:bg-slate-950/10">
                Report a pricing update
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
