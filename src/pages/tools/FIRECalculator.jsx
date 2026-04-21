import React, { useState, useMemo } from "react";
import SEO from "../../components/SEO";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, ArcElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const fmt = n => '$' + Math.round(n).toLocaleString();
const fmtK = n => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;

function SliderInput({ label, value, min, max, step = 1, onChange, format, note }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-bold text-secondary">{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(step < 1 ? parseFloat(e.target.value) : Number(e.target.value))}
        className="w-full accent-secondary" />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{format ? format(min) : min}</span>
        {note && <span className="text-center text-gray-500 italic">{note}</span>}
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

const FIRE_TYPES = [
  { id: 'lean', label: 'Lean FIRE', desc: 'Frugal lifestyle, minimal spending', multiplier: 0.75 },
  { id: 'regular', label: 'FIRE', desc: 'Comfortable lifestyle', multiplier: 1.0 },
  { id: 'fat', label: 'Fat FIRE', desc: 'Luxurious lifestyle, higher spending', multiplier: 1.5 },
  { id: 'barista', label: 'Barista FIRE', desc: 'Semi-retire with part-time income', multiplier: 1.0 },
];

export default function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [targetRetireAge, setTargetRetireAge] = useState(50);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [annualIncome, setAnnualIncome] = useState(80000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [returnRate, setReturnRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [cppMonthly, setCppMonthly] = useState(800);
  const [oasMonthly, setOasMonthly] = useState(762);
  const [partTimeIncome, setPartTimeIncome] = useState(0);
  const [fireType, setFireType] = useState('regular');
  const [showNominal, setShowNominal] = useState(false);

  const calc = useMemo(() => {
    const selectedType = FIRE_TYPES.find(t => t.id === fireType);
    const adjustedExpenses = annualExpenses * selectedType.multiplier;

    // CPP/OAS kick in at 65
    const annualCPP = cppMonthly * 12;
    const annualOAS = oasMonthly * 12;
    const annualPartTime = partTimeIncome * 12;

    // Real return (inflation-adjusted)
    const realReturn = (1 + returnRate / 100) / (1 + inflationRate / 100) - 1;

    // FIRE number: annual expenses / withdrawal rate
    const fireNumber = adjustedExpenses / (withdrawalRate / 100);

    // Accumulation phase: grow savings until retirement age
    const yearsToRetire = targetRetireAge - currentAge;
    let portfolio = currentSavings;
    const annualSavings = annualIncome - annualExpenses; // what they save now
    const accumulationData = [{ age: currentAge, value: portfolio, year: 0 }];

    for (let yr = 1; yr <= yearsToRetire; yr++) {
      portfolio = portfolio * (1 + realReturn) + annualSavings;
      accumulationData.push({ age: currentAge + yr, value: Math.round(portfolio), year: yr });
    }

    const portfolioAtRetirement = portfolio;
    const achievesFIRE = portfolioAtRetirement >= fireNumber;

    // If not enough, find when they actually hit FIRE number
    let fireAge = null;
    let p2 = currentSavings;
    for (let yr = 1; yr <= 50; yr++) {
      p2 = p2 * (1 + realReturn) + annualSavings;
      if (p2 >= fireNumber && fireAge === null) {
        fireAge = currentAge + yr;
      }
    }

    // Drawdown phase from retirement to age 95
    const retirementExpenses = adjustedExpenses;
    const drawdownData = [];
    let drawPortfolio = portfolioAtRetirement;
    let ranOut = false;
    let ranOutAge = null;

    for (let yr = 0; yr <= (95 - targetRetireAge); yr++) {
      const age = targetRetireAge + yr;
      const cpp = age >= 65 ? annualCPP : 0;
      const oas = age >= 65 ? annualOAS : 0;
      const pt = fireType === 'barista' && age < 65 ? annualPartTime : 0;
      const netWithdrawal = Math.max(0, retirementExpenses - cpp - oas - pt);

      drawPortfolio = drawPortfolio * (1 + realReturn) - netWithdrawal;
      if (drawPortfolio <= 0 && !ranOut) {
        ranOut = true;
        ranOutAge = age;
        drawPortfolio = 0;
      }
      drawdownData.push({ age, value: Math.round(drawPortfolio), year: yr });
    }

    // Savings rate
    const savingsRate = annualIncome > 0 ? ((annualIncome - annualExpenses) / annualIncome) * 100 : 0;

    // How many years to FIRE shortfall/surplus
    const surplus = portfolioAtRetirement - fireNumber;
    const surplusPct = fireNumber > 0 ? (surplus / fireNumber) * 100 : 0;

    // Monthly passive income at retirement (withdrawal + cpp + oas if 65)
    const monthlyWithdrawal = (portfolioAtRetirement * withdrawalRate / 100) / 12;
    const monthlyGovBenefits = targetRetireAge >= 65 ? (cppMonthly + oasMonthly) : 0;
    const totalMonthlyIncome = monthlyWithdrawal + monthlyGovBenefits + (fireType === 'barista' ? partTimeIncome : 0);

    return {
      fireNumber,
      portfolioAtRetirement,
      achievesFIRE,
      fireAge,
      yearsToRetire,
      accumulationData,
      drawdownData,
      savingsRate,
      surplus,
      surplusPct,
      ranOut,
      ranOutAge,
      monthlyWithdrawal,
      monthlyGovBenefits,
      totalMonthlyIncome,
      adjustedExpenses,
      annualSavings,
      realReturn: (realReturn * 100).toFixed(2),
    };
  }, [currentAge, targetRetireAge, currentSavings, annualIncome, annualExpenses, returnRate, inflationRate, withdrawalRate, cppMonthly, oasMonthly, partTimeIncome, fireType]);

  const allChartData = [...calc.accumulationData, ...calc.drawdownData.slice(1)];
  const fireNumberLine = allChartData.map(() => calc.fireNumber);

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="FIRE Calculator Canada 2026 — Financial Independence Retire Early"
        description="Calculate your FIRE number and retirement date with this free Canadian FIRE calculator. Includes CPP, OAS, inflation adjustment, and Lean/Fat/Barista FIRE scenarios."
        canonical="https://easyfinancetools.com/tools/fire-calculator"
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          🔥 FIRE Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find your <strong>Financial Independence, Retire Early</strong> number, target date, and drawdown safety — with Canadian CPP and OAS factored in.
        </p>
      </div>

      {/* FIRE Type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {FIRE_TYPES.map(type => (
          <button key={type.id} onClick={() => setFireType(type.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              fireType === type.id
                ? 'border-secondary bg-secondary/10 dark:bg-secondary/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}>
            <p className="font-bold text-sm">{type.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{type.desc}</p>
            {type.multiplier !== 1.0 && (
              <p className="text-xs font-semibold text-secondary mt-1">
                {type.multiplier > 1 ? `${type.multiplier}× expenses` : `${type.multiplier}× expenses`}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Hero FIRE number */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`rounded-xl p-6 text-center border-2 ${
          calc.achievesFIRE
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
        }`}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Your FIRE Number</p>
          <p className="text-3xl font-black text-primary dark:text-accent">{fmtK(calc.fireNumber)}</p>
          <p className="text-xs text-gray-500 mt-1">{withdrawalRate}% SWR × {fmt(calc.adjustedExpenses)}/yr</p>
        </div>

        <div className={`rounded-xl p-6 text-center border-2 ${
          calc.achievesFIRE
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
        }`}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Portfolio at Retirement</p>
          <p className="text-3xl font-black text-primary dark:text-accent">{fmtK(calc.portfolioAtRetirement)}</p>
          <p className={`text-xs mt-1 font-semibold ${calc.achievesFIRE ? 'text-green-600' : 'text-orange-500'}`}>
            {calc.achievesFIRE ? `✅ ${calc.surplusPct.toFixed(0)}% above FIRE` : `⚠️ ${Math.abs(calc.surplusPct).toFixed(0)}% below target`}
          </p>
        </div>

        <div className={`rounded-xl p-6 text-center border-2 ${
          !calc.ranOut
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
            : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
        }`}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Portfolio Lasts Until</p>
          <p className="text-3xl font-black text-primary dark:text-accent">{calc.ranOut ? `Age ${calc.ranOutAge}` : 'Age 95+'}</p>
          <p className={`text-xs mt-1 font-semibold ${!calc.ranOut ? 'text-green-600' : 'text-red-500'}`}>
            {!calc.ranOut ? '✅ Money outlasts you' : '⚠️ Shortfall detected'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Inputs */}
        <div className="space-y-5 bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Your Numbers</h2>

          <SliderInput label="Current Age" value={currentAge} min={18} max={60} onChange={setCurrentAge} format={v => `${v} yrs`} />
          <SliderInput label="Target Retirement Age" value={targetRetireAge} min={currentAge + 1} max={70} onChange={setTargetRetireAge} format={v => `${v} yrs`} />
          <SliderInput label="Current Savings / Investments" value={currentSavings} min={0} max={2000000} step={5000} onChange={setCurrentSavings} format={fmtK} />
          <SliderInput label="Annual Income (after tax)" value={annualIncome} min={30000} max={300000} step={5000} onChange={setAnnualIncome} format={n => `$${(n/1000).toFixed(0)}k`} />
          <SliderInput label="Annual Expenses" value={annualExpenses} min={20000} max={200000} step={2000} onChange={setAnnualExpenses} format={n => `$${(n/1000).toFixed(0)}k`} />
          <SliderInput label="Expected Return (nominal)" value={returnRate} min={1} max={12} step={0.5} onChange={setReturnRate} format={v => `${v}%`} />
          <SliderInput label="Inflation Rate" value={inflationRate} min={1} max={6} step={0.5} onChange={setInflationRate} format={v => `${v}%`} />
          <SliderInput label="Safe Withdrawal Rate (SWR)" value={withdrawalRate} min={2} max={6} step={0.25} onChange={setWithdrawalRate} format={v => `${v}%`} note="4% = classic rule" />

          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Canadian Gov't Benefits (at 65)</h3>
            <div className="space-y-4">
              <SliderInput label="CPP Monthly (est.)" value={cppMonthly} min={0} max={1433} step={50} onChange={setCppMonthly} format={v => `$${v}/mo`} />
              <SliderInput label="OAS Monthly (est.)" value={oasMonthly} min={0} max={900} step={25} onChange={setOasMonthly} format={v => `$${v}/mo`} />
            </div>
          </div>

          {fireType === 'barista' && (
            <div className="border-t dark:border-gray-700 pt-4">
              <SliderInput label="Part-Time Monthly Income" value={partTimeIncome} min={0} max={5000} step={100} onChange={setPartTimeIncome} format={v => `$${v}/mo`} />
            </div>
          )}
        </div>

        {/* Right: key stats */}
        <div className="space-y-4">
          {/* Savings rate */}
          <div className={`rounded-xl p-5 border-2 ${
            calc.savingsRate >= 50 ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' :
            calc.savingsRate >= 30 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' :
            'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
          }`}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Savings Rate</p>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-black text-primary dark:text-accent">{calc.savingsRate.toFixed(1)}%</p>
              <div className="text-sm text-gray-500 pb-1">
                {calc.savingsRate >= 50 ? '🔥 FIRE-ready pace!' : calc.savingsRate >= 30 ? '✅ Great progress' : '⚠️ Increase savings'}
              </div>
            </div>
            <div className="mt-2 h-3 bg-white/50 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${Math.min(calc.savingsRate, 100)}%` }} />
            </div>
          </div>

          {/* Savings rate vs years to FIRE */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-sm mb-3 text-gray-700 dark:text-gray-300">Savings Rate → Years to FIRE</h3>
            <div className="space-y-1.5">
              {[[10,43],[20,37],[30,28],[40,22],[50,17],[60,12.5],[70,8.5],[80,5.5]].map(([sr, yrs]) => (
                <div key={sr} className="flex items-center gap-2">
                  <span className="text-xs w-8 text-gray-500">{sr}%</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-secondary" style={{ width: `${(sr / 80) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-12 text-right">{yrs} yrs</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Based on 7% return, 4% SWR (Mr. Money Mustache table)</p>
          </div>

          {/* Monthly income at retirement */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-sm mb-3 text-gray-700 dark:text-gray-300">Monthly Income at Retirement</h3>
            <div className="space-y-2">
              {[
                { label: 'Portfolio withdrawal', value: calc.monthlyWithdrawal, color: 'bg-blue-500' },
                { label: 'CPP + OAS (from 65)', value: calc.monthlyGovBenefits, color: 'bg-green-500' },
                ...(fireType === 'barista' ? [{ label: 'Part-time income', value: partTimeIncome, color: 'bg-yellow-500' }] : []),
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                  </div>
                  <span className="font-bold">{fmt(item.value)}/mo</span>
                </div>
              ))}
              <div className="border-t dark:border-gray-700 pt-2 flex justify-between">
                <span className="font-bold">Total Monthly</span>
                <span className="text-lg font-black text-green-600 dark:text-green-400">{fmt(calc.totalMonthlyIncome)}/mo</span>
              </div>
            </div>
          </div>

          {/* Real return note */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm">
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">📐 Calculation details</p>
            <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <li>Real return (inflation-adj.): <strong>{calc.realReturn}%</strong></li>
              <li>Annual savings: <strong>{fmt(calc.annualSavings)}</strong></li>
              <li>Years to accumulate: <strong>{calc.yearsToRetire} yrs</strong></li>
              {!calc.achievesFIRE && calc.fireAge && (
                <li className="text-orange-600 dark:text-orange-400 font-semibold">
                  FIRE achievable at age {calc.fireAge} — retire {calc.fireAge - currentAge} years later, or save more
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Portfolio chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="text-lg font-bold mb-4">Portfolio Value: Accumulation → Drawdown</h2>
        <Line
          data={{
            labels: allChartData.map(d => `Age ${d.age}`),
            datasets: [
              {
                label: 'Portfolio',
                data: allChartData.map(d => d.value),
                fill: true,
                backgroundColor: 'rgba(0,168,232,0.1)',
                borderColor: '#00A8E8',
                tension: 0.3,
                pointRadius: 0,
              },
              {
                label: 'FIRE Number',
                data: fireNumberLine,
                borderColor: '#ef4444',
                borderDash: [6, 4],
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: $${Math.round(ctx.raw).toLocaleString()}` } }
            },
            scales: {
              y: {
                ticks: { callback: v => fmtK(v) },
                min: 0,
              },
              x: {
                ticks: { maxTicksLimit: 15 }
              }
            }
          }}
        />
        <p className="text-xs text-gray-400 mt-2">Red dashed line = your FIRE number. Chart shows real (inflation-adjusted) values.</p>
      </div>

      {/* FIRE Scenarios comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="text-lg font-bold mb-4">⚡ FIRE Scenarios at Your Savings Rate</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="text-left py-2 pr-4 font-semibold">Scenario</th>
                <th className="text-right py-2 pr-4 font-semibold">Annual Expenses</th>
                <th className="text-right py-2 pr-4 font-semibold">FIRE Number</th>
                <th className="text-right py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {FIRE_TYPES.map(type => {
                const exp = annualExpenses * type.multiplier;
                const fn = exp / (withdrawalRate / 100);
                const achieved = calc.portfolioAtRetirement >= fn;
                return (
                  <tr key={type.id} className={`border-b dark:border-gray-700 ${type.id === fireType ? 'bg-secondary/5 dark:bg-secondary/10' : ''}`}>
                    <td className="py-3 pr-4">
                      <span className="font-bold">{type.label}</span>
                      {type.id === fireType && <span className="ml-2 text-xs bg-secondary text-white rounded px-1.5 py-0.5">selected</span>}
                      <p className="text-xs text-gray-400">{type.desc}</p>
                    </td>
                    <td className="py-3 pr-4 text-right">{fmt(exp)}/yr</td>
                    <td className="py-3 pr-4 text-right font-bold">{fmtK(fn)}</td>
                    <td className="py-3 text-right">
                      <span className={`font-semibold text-xs ${achieved ? 'text-green-600 dark:text-green-400' : 'text-orange-500'}`}>
                        {achieved ? '✅ Achieved' : `⚠️ Need ${fmtK(fn - calc.portfolioAtRetirement)} more`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Frequently Asked Questions</h2>
        {[
          {
            q: "What is FIRE and is it realistic in Canada?",
            a: "FIRE (Financial Independence, Retire Early) is a movement focused on aggressively saving and investing 40–70% of income to retire decades earlier than the traditional age 65. It's absolutely achievable in Canada — many Canadians have done it. The keys are: high savings rate, low-cost index investing (XEQT, VEQT), maxing TFSA and RRSP, and keeping expenses controlled. Canada's CPP and OAS also help reduce how much you need to self-fund in later years."
          },
          {
            q: "What is the 4% safe withdrawal rate?",
            a: "The 4% rule (from the Trinity Study) states that you can withdraw 4% of your portfolio in Year 1, then adjust for inflation each year, and your portfolio has historically lasted 30+ years. For Canadian early retirees with 40–50 year retirements, many use a more conservative 3–3.5% SWR. The rule assumes a 50/50 to 60/40 stock/bond portfolio."
          },
          {
            q: "How does CPP and OAS affect my FIRE plan?",
            a: "CPP and OAS act as guaranteed 'pension income' starting at 65 (or earlier/later if you choose). For early retirees, they kick in partway through retirement, significantly reducing how much your portfolio needs to fund. This calculator accounts for both — once you hit 65 in the drawdown phase, CPP+OAS income offsets withdrawals, greatly extending your portfolio's life."
          },
          {
            q: "Should I use TFSA or RRSP for FIRE savings?",
            a: "TFSA first if your current income is modest (under $60K) — withdrawals are tax-free and won't affect OAS/GIS eligibility. RRSP is better if you're in a high tax bracket now and expect lower income in retirement (since you defer taxes to a lower bracket). For FIRE, many Canadians use both: RRSP during high-earning years, then convert to RRIF and draw down in early retirement before CPP/OAS kick in, smoothing income across years."
          },
          {
            q: "What's the difference between Lean, Regular, Fat, and Barista FIRE?",
            a: "Lean FIRE: retire on minimal expenses (under $40K/yr), often involves geographic arbitrage or very frugal living. Regular FIRE: comfortable middle-class lifestyle. Fat FIRE: luxury lifestyle with $100K+ annual spending. Barista FIRE: semi-retire — leave the high-stress career but work part-time (e.g., coffee shop, freelance) for health benefits and some income, reducing the portfolio size needed."
          },
        ].map((item, i) => (
          <details key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden group">
            <summary className="p-4 cursor-pointer font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-accent list-none flex justify-between items-center">
              {item.q}
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}


