import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import MethodologyPanel from '../../components/MethodologyPanel';
import ToolPageSchema from '../../components/ToolPageSchema';
import ToolByline from '../../components/ToolByline';
import ActionableNextSteps from '../../components/ActionableNextSteps';
import EducationalDisclaimer from '../../components/EducationalDisclaimer';
import ReferenceSection from '../../components/ReferenceSection';
import {
  CONTENT_LAST_REVIEWED,
  DEFAULT_ASSUMPTIONS,
  HOUSING_PROVINCE_DETAILS,
  MORTGAGE_RULES,
  getCanadianMonthlyRate,
  getCmhcPremium,
  getLandTransferTax,
  getMortgagePayment,
} from '../../config/financial';

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const RENT_VS_BUY_FAQS = [
  {
    q: 'Does buying always win over a long enough timeline?',
    a: 'Not automatically. Buying often benefits from leverage and home appreciation, but higher carrying costs, selling costs, and weaker appreciation can keep renting competitive for longer than people expect.',
  },
  {
    q: 'Why might renting look better even when the mortgage payment seems manageable?',
    a: 'Because ownership includes more than the mortgage payment. Property tax, maintenance, condo fees, insurance, and selling costs can change the comparison materially.',
  },
  {
    q: 'Should I assume the renter invests the difference?',
    a: 'If you want a fair rent-vs-buy comparison, yes. Renting looks artificially weak if the renter does not invest the down payment and any monthly savings created by not owning.',
  },
  {
    q: 'Does this tool include the principal residence exemption?',
    a: 'The comparison treats home equity as tax-free sale proceeds after estimated selling costs. It does not model detailed tax treatment beyond that simplified assumption.',
  },
  {
    q: 'What is the most important input on this page?',
    a: 'Usually the timeline. Rent-versus-buy answers can look very different at three years, seven years, and ten-plus years even when the monthly numbers do not change much.',
  },
];

function formatCurrency(value, digits = 0) {
  return Number(value || 0).toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatPercent(value, digits = 1) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

function MetricCard({ label, value, hint, tone = 'default' }) {
  const tones = {
    default: 'bg-white text-primary dark:bg-gray-800 dark:text-accent',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    primary: 'bg-gradient-to-br from-primary to-secondary text-white',
  };

  return (
    <div className={`rounded-2xl border border-slate-200 p-5 dark:border-slate-700 ${tones[tone] || tones.default}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-2 text-sm opacity-80">{hint}</p> : null}
    </div>
  );
}

function InputField({ label, value, onChange, step, min, suffix, helpText }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          className="focus-ring w-full rounded-xl border-2 border-slate-200 px-4 py-3 pr-14 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        {suffix ? <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 dark:text-slate-400">{suffix}</span> : null}
      </div>
      {helpText ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helpText}</p> : null}
    </div>
  );
}

function SelectField({ label, value, onChange, options, helpText }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="focus-ring w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {helpText ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helpText}</p> : null}
    </div>
  );
}

export default function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.homePrice);
  const [downPayment, setDownPayment] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.downPayment);
  const [mortgageRate, setMortgageRate] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.mortgageRate);
  const [amortization, setAmortization] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.amortization);
  const [monthlyRent, setMonthlyRent] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.monthlyRent);
  const [rentIncrease, setRentIncrease] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.rentIncrease);
  const [homeAppreciation, setHomeAppreciation] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.homeAppreciation);
  const [investReturn, setInvestReturn] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.investReturn);
  const [propertyTax, setPropertyTax] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.propertyTax);
  const [maintenance, setMaintenance] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.maintenance);
  const [condoFees, setCondoFees] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.condoFees);
  const [province, setProvince] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.province);
  const [years, setYears] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.years);
  const [sellingCostRate, setSellingCostRate] = useState(DEFAULT_ASSUMPTIONS.rentVsBuy.sellingCostRate);

  const result = useMemo(() => {
    const safeHomePrice = Math.max(0, Number(homePrice || 0));
    const safeDownPayment = Math.max(0, Number(downPayment || 0));
    const safeMortgageRate = Math.max(0, Number(mortgageRate || 0));
    const safeAmortization = Math.max(5, Number(amortization || 25));
    const safeMonthlyRent = Math.max(0, Number(monthlyRent || 0));
    const safeRentIncrease = Math.max(0, Number(rentIncrease || 0));
    const safeHomeAppreciation = Math.max(-10, Number(homeAppreciation || 0));
    const safeInvestReturn = Math.max(-10, Number(investReturn || 0));
    const safePropertyTax = Math.max(0, Number(propertyTax || 0));
    const safeMaintenance = Math.max(0, Number(maintenance || 0));
    const safeCondoFees = Math.max(0, Number(condoFees || 0));
    const safeYears = Math.max(1, Number(years || 1));
    const safeSellingCostRate = Math.max(0, Number(sellingCostRate || 0));

    const basePrincipal = Math.max(0, safeHomePrice - safeDownPayment);
    const cmhcPremium = safeDownPayment / Math.max(safeHomePrice, 1) < 0.2 && safeHomePrice < 1500000
      ? getCmhcPremium(basePrincipal, safeHomePrice || 1)
      : 0;
    const mortgagePrincipal = basePrincipal + cmhcPremium;
    const mortgagePayment = getMortgagePayment(mortgagePrincipal, safeMortgageRate, safeAmortization * 12);
    const monthlyRate = getCanadianMonthlyRate(safeMortgageRate);
    const landTransferTax = getLandTransferTax(safeHomePrice, province);
    const buyingClosingCosts = landTransferTax + MORTGAGE_RULES.defaultLegalAndTitleCost + MORTGAGE_RULES.defaultInspectionCost;
    const upfrontOwnerCash = safeDownPayment + buyingClosingCosts;

    let mortgageBalance = mortgagePrincipal;
    let homeValue = safeHomePrice;
    let rentLevel = safeMonthlyRent;
    let renterPortfolio = upfrontOwnerCash;
    let cumulativeOwnerCosts = upfrontOwnerCash;
    let cumulativeRentCosts = 0;
    let breakEvenYear = null;

    const labels = [];
    const ownerNetWorthLine = [];
    const renterNetWorthLine = [];
    const ownerCostLine = [];
    const renterCostLine = [];

    for (let year = 1; year <= safeYears; year += 1) {
      for (let month = 1; month <= 12; month += 1) {
        const interest = mortgageBalance * monthlyRate;
        const principalPaid = Math.min(mortgagePayment - interest, mortgageBalance);
        mortgageBalance = Math.max(0, mortgageBalance - principalPaid);

        const ownerMonthlyCost = mortgagePayment + safePropertyTax / 12 + safeMaintenance + safeCondoFees;
        const currentRent = rentLevel;

        cumulativeOwnerCosts += ownerMonthlyCost;
        cumulativeRentCosts += currentRent;

        if (ownerMonthlyCost > currentRent) {
          renterPortfolio += ownerMonthlyCost - currentRent;
        }

        renterPortfolio *= 1 + safeInvestReturn / 100 / 12;
        rentLevel *= 1 + safeRentIncrease / 100 / 12;
      }

      homeValue *= 1 + safeHomeAppreciation / 100;
      const netSaleValue = homeValue * (1 - safeSellingCostRate / 100) - mortgageBalance;
      const ownerNetWorth = Math.max(0, netSaleValue);

      labels.push(`Year ${year}`);
      ownerNetWorthLine.push(Math.round(ownerNetWorth));
      renterNetWorthLine.push(Math.round(renterPortfolio));
      ownerCostLine.push(Math.round(cumulativeOwnerCosts));
      renterCostLine.push(Math.round(cumulativeRentCosts));

      if (!breakEvenYear && ownerNetWorth >= renterPortfolio) {
        breakEvenYear = year;
      }
    }

    const finalOwnerNetWorth = ownerNetWorthLine[ownerNetWorthLine.length - 1] || 0;
    const finalRenterPortfolio = renterNetWorthLine[renterNetWorthLine.length - 1] || 0;
    const buyingWins = finalOwnerNetWorth >= finalRenterPortfolio;

    let interpretation = 'The right answer here depends heavily on timeline. A short ownership window can make buying look worse even when the long-term story feels attractive.';
    if (buyingWins && breakEvenYear && breakEvenYear <= safeYears / 2) {
      interpretation = 'Buying becomes competitive relatively early in this scenario. That usually means the combination of appreciation, amortization, and rent inflation is strong enough to justify the ownership friction.';
    } else if (!buyingWins) {
      interpretation = 'Renting still looks stronger in this setup. That usually happens when ownership costs are heavy relative to rent, or the timeline is not long enough for equity growth to overcome friction costs.';
    } else if (safeYears <= 5) {
      interpretation = 'The result is positive for buying, but the short timeline still deserves caution because selling costs and moving risk can wipe out a thin edge quickly.';
    }

    return {
      mortgagePayment,
      cmhcPremium,
      landTransferTax,
      buyingClosingCosts,
      ownerNetWorthLine,
      renterNetWorthLine,
      ownerCostLine,
      renterCostLine,
      labels,
      finalOwnerNetWorth,
      finalRenterPortfolio,
      buyingWins,
      breakEvenYear,
      interpretation,
      totalOwnerCost: ownerCostLine[ownerCostLine.length - 1] || cumulativeOwnerCosts,
      totalRentCost: renterCostLine[renterCostLine.length - 1] || cumulativeRentCosts,
      yearlyOwnerCarry: mortgagePayment * 12 + safePropertyTax + safeMaintenance * 12 + safeCondoFees * 12,
    };
  }, [amortization, condoFees, downPayment, homeAppreciation, homePrice, investReturn, maintenance, monthlyRent, mortgageRate, propertyTax, province, rentIncrease, sellingCostRate, years]);

  const chartData = {
    labels: result.labels,
    datasets: [
      {
        label: 'Owner net worth after selling costs',
        data: result.ownerNetWorthLine,
        borderColor: '#00557a',
        backgroundColor: 'rgba(0, 85, 122, 0.12)',
        fill: false,
        tension: 0.3,
        pointRadius: 2,
      },
      {
        label: 'Renter investment portfolio',
        data: result.renterNetWorthLine,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.08)',
        fill: false,
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO
        title="Rent vs Buy Decision Tool Canada 2026"
        description="Compare renting and buying in Canada using mortgage costs, home appreciation, rent inflation, and invested savings assumptions for 2026 planning."
        canonical="https://easyfinancetools.com/tools/rent-vs-buy"
      />
      <ToolPageSchema
        name="Rent vs Buy Decision Tool Canada 2026"
        description="Canadian rent-versus-buy planning tool for ownership costs, renter investing assumptions, and timeline-based net-worth comparisons."
        canonical="https://easyfinancetools.com/tools/rent-vs-buy"
        category="FinanceApplication"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,420px)]">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-slate-800">
            Housing decision workflow
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-accent md:text-5xl">Rent vs buy planner for Canadian housing choices</h1>
          <ToolByline lastUpdated={CONTENT_LAST_REVIEWED} reviewer="Reviewed for housing-assumption clarity" />
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            This page compares the ownership path against a renter who invests the upfront cash and any monthly savings, so the answer is about tradeoffs and timing rather than ideology.
          </p>

          <div className="mt-6">
            <EducationalDisclaimer />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label={result.buyingWins ? 'Buying edge' : 'Renting edge'}
              value={formatCurrency(Math.abs(result.finalOwnerNetWorth - result.finalRenterPortfolio))}
              hint={result.buyingWins ? 'Owner net worth is higher at the end of the timeline.' : 'Renter portfolio is higher at the end of the timeline.'}
              tone="primary"
            />
            <MetricCard label="Owner net worth" value={formatCurrency(result.finalOwnerNetWorth)} hint="After estimated selling costs and remaining mortgage." />
            <MetricCard label="Renter portfolio" value={formatCurrency(result.finalRenterPortfolio)} hint="Assumes upfront cash and monthly savings are invested." tone="success" />
            <MetricCard label="Break-even year" value={result.breakEvenYear ? `Year ${result.breakEvenYear}` : 'None'} hint="If none appears, renting stays ahead across the comparison window." tone="warning" />
          </div>

          <div className="surface-card mt-8 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary dark:text-accent">Net-worth comparison over time</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  The timeline is usually the deciding variable. Short windows are much harder on buying because the friction costs arrive immediately.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Owner carry cost: {formatCurrency(result.yearlyOwnerCarry)} per year
              </div>
            </div>
            <div className="mt-6">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(Number(ctx.raw))}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: { callback: (value) => formatCurrency(Number(value)) },
                    },
                  },
                }}
                height={320}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">Plain-English interpretation</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{result.interpretation}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">Upfront ownership friction</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Buying starts with {formatCurrency(Number(downPayment || 0) + result.buyingClosingCosts)} of upfront cash when down payment and closing costs are combined.
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-primary dark:text-accent">Renting assumption check</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Renting only looks fair here because the model assumes the renter keeps the down payment invested and adds monthly savings when ownership costs are higher than rent.
              </p>
            </div>
          </div>

          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">2026 rent-vs-buy checklist</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use the comparison to test your timeline, not your identity</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                'Run the comparison at your actual expected holding period instead of defaulting to a long timeline that flatters buying.',
                'Check whether the owner path still works if repairs, condo fees, or rate renewal turn out worse than expected.',
                'Do not let the mortgage payment be the only owner cost in the model; taxes, maintenance, and selling costs matter.',
                'If renting wins clearly, that does not mean homeownership is bad. It usually means the current price, timeline, or cash-position combination is not compelling yet.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">How this tool works</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                It models a buyer building equity through mortgage paydown and appreciation, then compares that with a renter who keeps the down payment and monthly savings invested.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">When it is most useful</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Use it when the mortgage is technically possible but you still are not sure whether ownership is the strongest financial move for your actual holding period.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-accent">Common mistakes</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                The biggest mistakes are ignoring selling costs, pretending the renter will not invest the cash difference, and using a timeline that does not match how long you actually expect to stay.
              </p>
            </div>
          </section>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-primary dark:text-accent">Scenario inputs</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Treat the home inputs and the renter-investing assumptions as equally important. If one side is unrealistically generous, the whole comparison gets distorted.
          </p>

          <div className="mt-6 space-y-5">
            <InputField label="Home price" value={homePrice} onChange={(event) => setHomePrice(event.target.value)} step="1000" min="0" suffix="CAD" />
            <InputField label="Down payment" value={downPayment} onChange={(event) => setDownPayment(event.target.value)} step="1000" min="0" suffix="CAD" />
            <InputField label="Mortgage rate" value={mortgageRate} onChange={(event) => setMortgageRate(event.target.value)} step="0.05" min="0" suffix="%" />
            <SelectField label="Amortization" value={amortization} onChange={(event) => setAmortization(Number(event.target.value))} options={[10, 15, 20, 25, 30].map((item) => ({ value: item, label: `${item} years` }))} />
            <InputField label="Monthly rent" value={monthlyRent} onChange={(event) => setMonthlyRent(event.target.value)} step="25" min="0" suffix="CAD" />
            <InputField label="Annual rent increase" value={rentIncrease} onChange={(event) => setRentIncrease(event.target.value)} step="0.5" min="0" suffix="%" />
            <InputField label="Annual home appreciation" value={homeAppreciation} onChange={(event) => setHomeAppreciation(event.target.value)} step="0.5" suffix="%" />
            <InputField label="Investment return on renter portfolio" value={investReturn} onChange={(event) => setInvestReturn(event.target.value)} step="0.5" suffix="%" />
            <InputField label="Annual property tax" value={propertyTax} onChange={(event) => setPropertyTax(event.target.value)} step="100" min="0" suffix="CAD" />
            <InputField label="Monthly maintenance" value={maintenance} onChange={(event) => setMaintenance(event.target.value)} step="25" min="0" suffix="CAD" />
            <InputField label="Monthly condo fees" value={condoFees} onChange={(event) => setCondoFees(event.target.value)} step="25" min="0" suffix="CAD" />
            <SelectField label="Province" value={province} onChange={(event) => setProvince(event.target.value)} options={Object.entries(HOUSING_PROVINCE_DETAILS).map(([value, item]) => ({ value, label: item.label }))} />
            <InputField label="Years to compare" value={years} onChange={(event) => setYears(event.target.value)} step="1" min="1" suffix="yrs" />
            <InputField label="Selling-cost estimate" value={sellingCostRate} onChange={(event) => setSellingCostRate(event.target.value)} step="0.5" min="0" suffix="%" helpText="Used to estimate realtor and sale friction when the owner exits at the end of the timeline." />
          </div>
        </aside>
      </div>

      <MethodologyPanel
        title="How this rent-vs-buy planner works"
        updated={CONTENT_LAST_REVIEWED}
        summary="The comparison models ownership through mortgage amortization, appreciation, ongoing carrying costs, and selling costs, then compares it against a renter who keeps the upfront cash and any monthly savings invested."
        assumptions={[
          'Mortgage math uses Canadian-style semi-annual compounding converted into an effective monthly rate.',
          'Ownership costs include property tax, maintenance, condo fees, mortgage insurance when applicable, and estimated selling costs at the end of the comparison period.',
          'The renter is assumed to invest the upfront ownership cash and any monthly savings created when renting costs less than owning.',
          'If owning costs less than renting in a given month, the model does not force the renter to withdraw from the portfolio; this keeps the comparison simple and conservative for renters.',
        ]}
        sources={[
          { label: 'FCAC: Buying a home', href: 'https://www.canada.ca/en/financial-consumer-agency/services/mortgages/buying-home.html' },
          { label: 'CMHC home-buying resources', href: 'https://www.cmhc-schl.gc.ca/' },
        ]}
        note="Educational planning estimate only. Your actual outcome depends on maintenance, mobility, sale timing, and the investing behavior you follow in real life."
      />

      <ReferenceSection
        title="Source and reference shell"
        intro="Before using this result for a major decision or publishing related content, verify the assumptions that move the answer the most."
        references={[
          {
            label: 'Listing-specific carrying costs',
            body: 'Property tax, condo fees, utilities, and expected repairs can materially change the owner side of the result.',
          },
          {
            label: 'Real sale friction',
            body: 'Selling costs vary by market and sales approach. Do not assume the exit cost is trivial if the ownership timeline is short.',
          },
          {
            label: 'Renter investing discipline',
            body: 'The renter side only stays fair if the cash difference actually gets invested rather than absorbed into lifestyle creep.',
          },
          {
            label: 'Mortgage and closing-cost sources',
            body: 'Use the mortgage payment and affordability pages to pressure-test the owner side of this decision before acting.',
          },
        ]}
      />

      <ActionableNextSteps
        toolName="rent_vs_buy_decision_tool"
        title="Use the result to narrow the real choice"
        intro="The next step depends on whether the winner is being decided by the mortgage, the timeline, or the savings plan behind the purchase."
        meaning={result.interpretation}
        steps={[
          'If buying only wins late in the timeline, be honest about whether you are likely to stay that long.',
          'If renting wins, route the next step into FHSA, TFSA, or GIC planning instead of rushing the purchase.',
          'If buying wins clearly, double-check affordability and the actual mortgage payment before treating the scenario as settled.',
        ]}
        actions={[
          {
            href: '/tools/mortgage-affordability-calculator',
            title: 'Check the approval range',
            body: 'Make sure the ownership path is not only attractive on paper but also supports a realistic lender-qualification result.',
            ctaLabel: 'mortgage_affordability_followup',
          },
          {
            href: '/tools/mortgage-calculator',
            title: 'Pressure-test the owner payment',
            body: 'Run the mortgage itself with the purchase assumptions used here so renewal risk and closing costs are visible.',
            ctaLabel: 'mortgage_payment_followup',
          },
          {
            href: '/tools/fhsa-calculator',
            title: 'Strengthen the down-payment strategy',
            body: 'If renting still wins, the smartest next move may be improving the home fund rather than forcing the purchase.',
            ctaLabel: 'fhsa_followup',
          },
        ]}
      />

      <FAQ items={RENT_VS_BUY_FAQS} />
    </main>
  );
}
