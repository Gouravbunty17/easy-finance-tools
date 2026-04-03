import React, { useMemo, useState } from "react";
import SEO from "../../components/SEO";
import FAQ from "../../components/FAQ";
import MethodologyPanel from "../../components/MethodologyPanel";
import ToolPageSchema from "../../components/ToolPageSchema";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const FAQS = [
  { q: "What is a GIC?", a: "A guaranteed investment certificate is a deposit product that typically pays a fixed rate over a fixed term. Early redemption rules depend on the issuer and product." },
  { q: "Does compounding frequency matter?", a: "Yes. More frequent compounding can slightly increase maturity value when rates and term are otherwise the same." },
  { q: "Should I hold a GIC in a TFSA?", a: "Often yes if you want the interest sheltered from tax and you have room available. The best account choice depends on your broader savings plan." },
  { q: "Are these preset rates live offers?", a: "No. The preset buttons are examples for scenario planning. Always verify the current rate, term, and redemption rules with the issuing institution." },
];

const FREQUENCIES = [
  { label: "Annually", value: 1 },
  { label: "Semi-Annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
];

const PRESETS = [
  { label: "EQ Bank 1yr", rate: 3.75, term: 1 },
  { label: "Oaken 1yr", rate: 4.1, term: 1 },
  { label: "Steinbach 2yr", rate: 4.25, term: 2 },
  { label: "Big Bank 1yr", rate: 2.5, term: 1 },
];

function calcGIC(principal, rate, years, freq) {
  const r = rate / 100 / freq;
  const n = freq * years;
  return principal * Math.pow(1 + r, n);
}

export default function GICCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(3.75);
  const [term, setTerm] = useState(1);
  const [freq, setFreq] = useState(2);

  const maturity = calcGIC(principal, rate, term, freq);
  const interest = maturity - principal;
  const effectiveRate = (Math.pow(1 + rate / 100 / freq, freq) - 1) * 100;
  const fmt = (n) => n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

  const chartData = useMemo(() => {
    const points = term <= 5 ? term * 12 : term * 4;
    const step = term <= 5 ? 1 / 12 : 1 / 4;
    const labels = [];
    const values = [];
    for (let i = 0; i <= points; i++) {
      const t = i * step;
      labels.push(term <= 1 ? `Mo ${Math.round(t * 12)}` : term <= 5 ? `Yr ${t.toFixed(1)}` : `Yr ${Math.round(t)}`);
      values.push(Math.round(calcGIC(principal, rate, t, freq)));
    }
    return { labels, values };
  }, [principal, rate, term, freq]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <SEO
        title="GIC Calculator Canada 2026 - Compare Rates and Returns"
        description="Calculate how much your GIC could be worth at maturity and compare example rates and compounding assumptions."
        canonical="https://easyfinancetools.com/tools/gic-calculator"
      />
      <ToolPageSchema
        name="GIC Calculator Canada 2026"
        description="Canadian GIC calculator for estimating maturity value, interest earned, and effective rate under different terms and compounding assumptions."
        canonical="https://easyfinancetools.com/tools/gic-calculator"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-accent">GIC Calculator</h1>
        <p className="max-w-3xl text-gray-600 dark:text-gray-300">
          Estimate maturity value, interest earned, and effective rate for a Canadian GIC. Use the preset examples as a starting point, then adjust the numbers to match the product you are comparing.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Maturity value", value: fmt(maturity), sub: `${term} year${term !== 1 ? "s" : ""} at ${rate.toFixed(2)}%` },
          { label: "Interest earned", value: fmt(interest), sub: "before tax" },
          { label: "Effective annual rate", value: `${effectiveRate.toFixed(3)}%`, sub: "based on compounding frequency" },
        ].map((card) => (
          <div key={card.label} className="surface-card p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{card.label}</div>
            <div className="mt-2 text-3xl font-bold text-primary dark:text-accent">{card.value}</div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="surface-card p-5">
            <p className="mb-2 text-sm font-semibold text-gray-500">Example Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button key={preset.label} onClick={() => { setRate(preset.rate); setTerm(preset.term); }} className="rounded-full border border-primary px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
                  {preset.label} ({preset.rate}%)
                </button>
              ))}
            </div>
          </div>

          <div className="surface-card p-6 space-y-6">
            <div>
              <div className="mb-1 flex justify-between">
                <label className="text-sm font-semibold">Investment Amount</label>
                <span className="font-bold text-primary">{fmt(principal)}</span>
              </div>
              <input type="range" min={500} max={500000} step={500} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-blue-600" />
              <div className="mt-1 flex justify-between text-xs text-gray-400"><span>$500</span><span>$500K</span></div>
            </div>

            <div>
              <div className="mb-1 flex justify-between">
                <label className="text-sm font-semibold">Interest Rate</label>
                <span className="font-bold text-primary">{rate.toFixed(2)}%</span>
              </div>
              <input type="range" min={0.5} max={8} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-blue-600" />
              <div className="mt-1 flex justify-between text-xs text-gray-400"><span>0.5%</span><span>8%</span></div>
            </div>

            <div>
              <div className="mb-1 flex justify-between">
                <label className="text-sm font-semibold">Term</label>
                <span className="font-bold text-primary">{term} year{term !== 1 ? "s" : ""}</span>
              </div>
              <input type="range" min={1} max={10} step={1} value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full accent-blue-600" />
              <div className="mt-1 flex justify-between text-xs text-gray-400"><span>1 year</span><span>10 years</span></div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Compounding Frequency</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {FREQUENCIES.map((item) => (
                  <button key={item.value} onClick={() => setFreq(item.value)} className={`rounded-xl border-2 py-2 text-sm font-semibold transition ${freq === item.value ? "border-primary bg-primary text-white" : "border-gray-200 text-gray-600 hover:border-primary dark:border-gray-600 dark:text-gray-300"}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-soft p-5 text-sm text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-primary dark:text-accent">Why this matters</p>
            <p className="mt-2">A GIC can be useful for near-term goals, emergency reserves, or lower-risk savings. Comparing rate, term, compounding, and account type usually matters more than chasing one headline number alone.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-primary p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Projected Maturity Value</p>
            <p className="mt-2 text-5xl font-bold">{fmt(maturity)}</p>
            <p className="mt-2 text-sm text-blue-100">
              {fmt(principal)} grows into {fmt(maturity)} and earns {fmt(interest)} of interest over {term} year{term !== 1 ? "s" : ""}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[
              { label: "Interest earned", value: fmt(interest) },
              { label: "Return on investment", value: `${((interest / principal) * 100).toFixed(2)}%` },
              { label: "Compounding", value: FREQUENCIES.find((item) => item.value === freq)?.label || "Custom" },
            ].map((item) => (
              <div key={item.label} className="surface-card p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{item.label}</div>
                <div className="mt-2 text-2xl font-bold text-primary dark:text-accent">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="surface-card p-6">
            <h2 className="mb-4 text-lg font-bold text-primary dark:text-accent">GIC Growth Over Time</h2>
            <Line data={{ labels: chartData.labels, datasets: [{ label: "GIC Value", data: chartData.values, fill: true, backgroundColor: "rgba(0,168,232,0.1)", borderColor: "#00a8e8", tension: 0.4 }] }} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } } } }} />
          </div>

          <div className="surface-card p-5">
            <h2 className="mb-3 text-lg font-bold text-primary dark:text-accent">GIC Planning Notes</h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Use <strong>GIC laddering</strong> if you want regular maturities instead of locking all cash into one term.</li>
              <li>Holding a GIC inside a <strong>TFSA or RRSP</strong> can change the tax impact of interest income.</li>
              <li>Always confirm whether the product is <strong>redeemable or non-redeemable</strong> before locking funds.</li>
              <li>Compare <strong>effective rate</strong>, not just the headline nominal rate.</li>
            </ul>
          </div>
        </div>
      </div>

      <MethodologyPanel
        title="How this GIC calculator works"
        summary="This calculator uses compound-interest math based on the principal, quoted annual rate, term, and compounding frequency entered above."
        assumptions={[
          "The quoted annual rate is assumed to stay fixed for the full term.",
          "The calculator does not model taxes, early redemption penalties, or issuer-specific product terms.",
          "Preset rates are examples for planning, not live market quotes.",
        ]}
        sources={[
          { label: "Government of Canada: Deposit insurance basics", href: "https://www.canada.ca/en/financial-consumer-agency/services/banking/deposit-insurance.html" },
        ]}
        note="Educational estimate only. Confirm actual rates, insurance coverage, and redemption rules with the issuing institution."
      />

      <div className="mt-12">
        <FAQ items={FAQS} />
      </div>
    </section>
  );
}
