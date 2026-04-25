import React, { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import ToolPageSchema from '../../components/ToolPageSchema';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, BarElement, LineElement,
  CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const fmt = (n) => '$' + Math.round(n).toLocaleString();

const CATEGORY_COLORS = [
  '#00A8E8','#22c55e','#f59e0b','#8b5cf6','#ef4444',
  '#14b8a6','#f97316','#ec4899','#64748b','#84cc16',
];

const DEFAULT_ASSETS = [
  { id: 1, name: 'Primary Residence', value: '', category: 'Real Estate' },
  { id: 2, name: 'TFSA', value: '', category: 'Registered Accounts' },
  { id: 3, name: 'RRSP', value: '', category: 'Registered Accounts' },
  { id: 4, name: 'FHSA', value: '', category: 'Registered Accounts' },
  { id: 5, name: 'Non-Registered Investments', value: '', category: 'Investments' },
  { id: 6, name: 'Savings Account (HISA)', value: '', category: 'Cash & Savings' },
  { id: 7, name: 'Emergency Fund', value: '', category: 'Cash & Savings' },
  { id: 8, name: 'Pension / DCPP', value: '', category: 'Registered Accounts' },
  { id: 9, name: 'Vehicle(s)', value: '', category: 'Personal Property' },
  { id: 10, name: 'Other Assets', value: '', category: 'Other' },
];

const DEFAULT_LIABILITIES = [
  { id: 1, name: 'Mortgage', value: '', category: 'Real Estate Debt' },
  { id: 2, name: 'Car Loan', value: '', category: 'Vehicle Debt' },
  { id: 3, name: 'Student Loan', value: '', category: 'Student Debt' },
  { id: 4, name: 'Credit Card Debt', value: '', category: 'Consumer Debt' },
  { id: 5, name: 'Line of Credit', value: '', category: 'Consumer Debt' },
  { id: 6, name: 'Other Debt', value: '', category: 'Other' },
];

const ASSET_CATEGORIES = ['Real Estate', 'Registered Accounts', 'Investments', 'Cash & Savings', 'Personal Property', 'Other'];
const LIABILITY_CATEGORIES = ['Real Estate Debt', 'Vehicle Debt', 'Student Debt', 'Consumer Debt', 'Other'];

let nextId = 20;

export default function InvestmentTracker() {
  const [assets, setAssets] = useState(DEFAULT_ASSETS);
  const [liabilities, setLiabilities] = useState(DEFAULT_LIABILITIES);
  const [activeTab, setActiveTab] = useState('overview');
  const [projectionYears, setProjectionYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [annualSavings, setAnnualSavings] = useState(12000);

  const updateAsset = (id, field, value) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };
  const updateLiability = (id, field, value) => {
    setLiabilities(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };
  const addAsset = () => {
    setAssets(prev => [...prev, { id: nextId++, name: 'New Asset', value: '', category: 'Other' }]);
  };
  const addLiability = () => {
    setLiabilities(prev => [...prev, { id: nextId++, name: 'New Debt', value: '', category: 'Other' }]);
  };
  const removeAsset = (id) => setAssets(prev => prev.filter(a => a.id !== id));
  const removeLiability = (id) => setLiabilities(prev => prev.filter(l => l.id !== id));

  const calc = useMemo(() => {
    const totalAssets = assets.reduce((sum, a) => sum + (parseFloat(a.value) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + (parseFloat(l.value) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

    // Assets by category
    const assetsByCategory = {};
    assets.forEach(a => {
      const v = parseFloat(a.value) || 0;
      if (v > 0) assetsByCategory[a.category] = (assetsByCategory[a.category] || 0) + v;
    });

    // Liabilities by category
    const liabByCategory = {};
    liabilities.forEach(l => {
      const v = parseFloat(l.value) || 0;
      if (v > 0) liabByCategory[l.category] = (liabByCategory[l.category] || 0) + v;
    });

    // Projection: net worth grows each year
    const projection = [];
    let nw = netWorth;
    for (let yr = 0; yr <= projectionYears; yr++) {
      projection.push({ year: yr, value: Math.round(nw) });
      nw = nw * (1 + annualReturn / 100) + annualSavings;
    }

    return { totalAssets, totalLiabilities, netWorth, debtRatio, assetsByCategory, liabByCategory, projection };
  }, [assets, liabilities, projectionYears, annualReturn, annualSavings]);

  const TABS = ['overview', 'assets', 'liabilities', 'projection'];

  const assetCatLabels = Object.keys(calc.assetsByCategory);
  const assetCatValues = Object.values(calc.assetsByCategory);

  const liabCatLabels = Object.keys(calc.liabByCategory);
  const liabCatValues = Object.values(calc.liabByCategory);

  const netWorthColor = calc.netWorth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <SEO
        title="Net Worth Calculator Canada 2026 — Asset & Debt Tracker"
        description="Free Canadian net worth calculator. Track TFSA, RRSP, FHSA, real estate, and debt with breakdowns and projection charts. No sign-up."
        canonical="https://easyfinancetools.com/tools/investment-tracker"
      />
      <ToolPageSchema
        name="Net Worth Calculator Canada 2026"
        description="Track Canadian assets and liabilities with breakdowns for TFSA, RRSP, real estate, and debt, plus a multi-year net worth projection."
        canonical="https://easyfinancetools.com/tools/investment-tracker"
        category="FinanceApplication"
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-accent mb-2">
          📊 Net Worth Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track every asset and liability to see your true net worth — and project where you'll be in {projectionYears} years.
        </p>
      </div>

      {/* Net worth hero */}
      <div className={`rounded-2xl p-8 mb-8 text-center ${calc.netWorth >= 0
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800'
        : 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800'
      }`}>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Your Net Worth</p>
        <p className={`text-5xl font-black mb-4 ${netWorthColor}`}>{fmt(calc.netWorth)}</p>
        <div className="flex justify-center gap-8 text-sm">
          <div>
            <p className="text-gray-500">Total Assets</p>
            <p className="text-xl font-bold text-green-600">{fmt(calc.totalAssets)}</p>
          </div>
          <div className="w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <p className="text-gray-500">Total Liabilities</p>
            <p className="text-xl font-bold text-red-500">{fmt(calc.totalLiabilities)}</p>
          </div>
          <div className="w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <p className="text-gray-500">Debt Ratio</p>
            <p className={`text-xl font-bold ${calc.debtRatio < 50 ? 'text-green-600' : 'text-orange-500'}`}>
              {calc.debtRatio.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            {tab === 'overview' ? '🏠 Overview' : tab === 'assets' ? '📈 Assets' : tab === 'liabilities' ? '📉 Liabilities' : '🔮 Projection'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assets donut */}
            {assetCatLabels.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold mb-4">Assets Breakdown</h2>
                <div className="h-56 flex items-center justify-center">
                  <Doughnut
                    data={{
                      labels: assetCatLabels,
                      datasets: [{
                        data: assetCatValues,
                        backgroundColor: CATEGORY_COLORS.slice(0, assetCatLabels.length),
                        borderWidth: 2,
                      }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <p className="text-gray-400 text-sm text-center">Enter asset values in the<br/>Assets tab to see breakdown</p>
              </div>
            )}

            {/* Liabilities donut */}
            {liabCatLabels.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold mb-4">Liabilities Breakdown</h2>
                <div className="h-56 flex items-center justify-center">
                  <Doughnut
                    data={{
                      labels: liabCatLabels,
                      datasets: [{
                        data: liabCatValues,
                        backgroundColor: ['#ef4444','#f97316','#f59e0b','#ec4899','#8b5cf6'],
                        borderWidth: 2,
                      }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <p className="text-gray-400 text-sm text-center">Enter liabilities in the<br/>Liabilities tab to see breakdown</p>
              </div>
            )}
          </div>

          {/* Assets vs Liabilities bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">Assets vs Liabilities by Category</h2>
            <Bar
              data={{
                labels: ['Assets', 'Liabilities', 'Net Worth'],
                datasets: [{
                  label: 'Value',
                  data: [calc.totalAssets, calc.totalLiabilities, Math.max(0, calc.netWorth)],
                  backgroundColor: ['#22c55e', '#ef4444', '#00A8E8'],
                  borderRadius: 8,
                }]
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } }
                }
              }}
            />
          </div>

          {/* Net worth benchmarks */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-3 text-blue-800 dark:text-blue-200">📊 Canadian Net Worth Benchmarks</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200 dark:border-blue-700">
                    <th className="text-left py-2 pr-4 text-blue-700 dark:text-blue-300">Age Group</th>
                    <th className="text-right py-2 pr-4 text-blue-700 dark:text-blue-300">Median Net Worth</th>
                    <th className="text-right py-2 text-blue-700 dark:text-blue-300">Top 25%</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  {[
                    ['Under 35', '$48,000', '$150,000'],
                    ['35–44', '$234,000', '$500,000'],
                    ['45–54', '$521,000', '$1,000,000'],
                    ['55–64', '$690,000', '$1,400,000'],
                    ['65+', '$830,000', '$1,600,000'],
                  ].map(([age, median, top]) => (
                    <tr key={age} className="border-b border-blue-100 dark:border-blue-800/50">
                      <td className="py-2 pr-4 font-medium">{age}</td>
                      <td className="py-2 pr-4 text-right">{median}</td>
                      <td className="py-2 text-right text-green-600 dark:text-green-400 font-semibold">{top}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">Source: Statistics Canada Survey of Financial Security</p>
          </div>
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold">Your Assets</h2>
              <span className="text-lg font-bold text-green-600">{fmt(calc.totalAssets)}</span>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {assets.map(asset => (
                <div key={asset.id} className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={asset.name}
                      onChange={e => updateAsset(asset.id, 'name', e.target.value)}
                      className="w-full font-semibold text-sm bg-transparent border-none outline-none text-gray-800 dark:text-gray-100"
                    />
                    <select
                      value={asset.category}
                      onChange={e => updateAsset(asset.id, 'category', e.target.value)}
                      className="text-xs text-gray-500 dark:text-gray-400 bg-transparent border-none outline-none mt-1">
                      {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input
                      type="number"
                      value={asset.value}
                      onChange={e => updateAsset(asset.id, 'value', e.target.value)}
                      placeholder="0"
                      className="pl-7 pr-3 py-2 w-36 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-right font-bold focus:border-secondary outline-none dark:bg-gray-700 text-sm"
                    />
                  </div>
                  <button onClick={() => removeAsset(asset.id)}
                    className="text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400 text-xl leading-none">×</button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t dark:border-gray-700">
              <button onClick={addAsset}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-secondary hover:text-secondary text-sm font-semibold transition-colors">
                + Add Asset
              </button>
            </div>
          </div>

          {assetCatLabels.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">Asset Allocation</h2>
              <div className="space-y-3">
                {assetCatLabels.map((cat, i) => {
                  const pct = calc.totalAssets > 0 ? (assetCatValues[i] / calc.totalAssets) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">{cat}</span>
                        <span className="text-gray-500">{fmt(assetCatValues[i])} ({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Liabilities Tab */}
      {activeTab === 'liabilities' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold">Your Liabilities</h2>
              <span className="text-lg font-bold text-red-500">{fmt(calc.totalLiabilities)}</span>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {liabilities.map(liab => (
                <div key={liab.id} className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={liab.name}
                      onChange={e => updateLiability(liab.id, 'name', e.target.value)}
                      className="w-full font-semibold text-sm bg-transparent border-none outline-none text-gray-800 dark:text-gray-100"
                    />
                    <select
                      value={liab.category}
                      onChange={e => updateLiability(liab.id, 'category', e.target.value)}
                      className="text-xs text-gray-500 dark:text-gray-400 bg-transparent border-none outline-none mt-1">
                      {LIABILITY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input
                      type="number"
                      value={liab.value}
                      onChange={e => updateLiability(liab.id, 'value', e.target.value)}
                      placeholder="0"
                      className="pl-7 pr-3 py-2 w-36 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-right font-bold focus:border-secondary outline-none dark:bg-gray-700 text-sm"
                    />
                  </div>
                  <button onClick={() => removeLiability(liab.id)}
                    className="text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400 text-xl leading-none">×</button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t dark:border-gray-700">
              <button onClick={addLiability}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-secondary hover:text-secondary text-sm font-semibold transition-colors">
                + Add Liability
              </button>
            </div>
          </div>

          {calc.totalLiabilities > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">Debt Breakdown</h2>
              <div className="space-y-3">
                {liabCatLabels.map((cat, i) => {
                  const pct = calc.totalLiabilities > 0 ? (liabCatValues[i] / calc.totalLiabilities) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">{cat}</span>
                        <span className="text-gray-500">{fmt(liabCatValues[i])} ({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: ['#ef4444','#f97316','#f59e0b','#ec4899','#8b5cf6'][i % 5] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Projection Tab */}
      {activeTab === 'projection' && (
        <div className="space-y-6">
          {/* Projection inputs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">Projection Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Annual Return: <span className="text-secondary">{annualReturn}%</span>
                </label>
                <input type="range" min={1} max={15} step={0.5} value={annualReturn}
                  onChange={e => setAnnualReturn(parseFloat(e.target.value))}
                  className="w-full accent-secondary" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1%</span><span>15%</span></div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Annual Savings Added: <span className="text-secondary">{fmt(annualSavings)}</span>
                </label>
                <input type="range" min={0} max={100000} step={1000} value={annualSavings}
                  onChange={e => setAnnualSavings(parseFloat(e.target.value))}
                  className="w-full accent-secondary" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$0</span><span>$100k</span></div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Time Horizon: <span className="text-secondary">{projectionYears} years</span>
                </label>
                <input type="range" min={5} max={40} step={1} value={projectionYears}
                  onChange={e => setProjectionYears(parseInt(e.target.value))}
                  className="w-full accent-secondary" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5 yr</span><span>40 yr</span></div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[5, 10, 20, projectionYears].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b).map(yr => {
              const entry = calc.projection[Math.min(yr, calc.projection.length - 1)];
              return (
                <div key={yr} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center shadow">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{yr === projectionYears && yr !== 5 && yr !== 10 && yr !== 20 ? `${yr} yrs (target)` : `${yr} years`}</p>
                  <p className="text-2xl font-black text-primary dark:text-accent">{entry ? fmt(entry.value) : '—'}</p>
                </div>
              );
            })}
          </div>

          {/* Projection chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">Net Worth Projection ({projectionYears} Years)</h2>
            <Line
              data={{
                labels: calc.projection.map(p => `Yr ${p.year}`),
                datasets: [{
                  label: 'Net Worth',
                  data: calc.projection.map(p => p.value),
                  fill: true,
                  backgroundColor: 'rgba(0,168,232,0.1)',
                  borderColor: '#00A8E8',
                  tension: 0.4,
                  pointRadius: calc.projection.length > 20 ? 0 : 3,
                }]
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` } }
                }
              }}
            />
          </div>

          {/* Year-by-year table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold">Year-by-Year Projection</h2>
            </div>
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold text-gray-600 dark:text-gray-300">Year</th>
                    <th className="text-right py-2 px-4 font-semibold text-gray-600 dark:text-gray-300">Net Worth</th>
                    <th className="text-right py-2 px-4 font-semibold text-gray-600 dark:text-gray-300">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {calc.projection.filter(p => p.year > 0).map(p => {
                    const prev = calc.projection[p.year - 1];
                    const growth = prev ? p.value - prev.value : 0;
                    return (
                      <tr key={p.year} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-2 px-4 font-medium">Year {p.year}</td>
                        <td className="py-2 px-4 text-right font-bold text-primary dark:text-accent">{fmt(p.value)}</td>
                        <td className="py-2 px-4 text-right text-green-600 dark:text-green-400">+{fmt(growth)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Frequently Asked Questions</h2>
        {[
          {
            q: "What is net worth and why does it matter?",
            a: "Net worth = total assets − total liabilities. It's the single most important number in personal finance — it tells you where you actually stand financially, not just how much you earn. Tracking it monthly/annually shows whether you're building wealth or falling behind."
          },
          {
            q: "What is a good net worth in Canada?",
            a: "According to Statistics Canada, the median net worth of Canadians under 35 is about $48,000, rising to $234,000 for 35–44 year olds and $690,000 for 55–64 year olds. These are medians — 50% of Canadians are above, 50% below. More important than the number is your personal trajectory — is it growing?"
          },
          {
            q: "Should I include my primary residence in net worth?",
            a: "Yes, but with context. Your home is an asset at its current market value, and your mortgage is a liability. The difference is your home equity. However, since you can't live in a liquid asset, many FIRE planners also calculate 'investable net worth' (excluding primary residence) to measure true financial independence progress."
          },
          {
            q: "What's the fastest way to grow net worth?",
            a: "Three levers: (1) Increase income, (2) Reduce expenses (especially debt interest), (3) Invest the difference in tax-advantaged accounts like TFSA and RRSP. Eliminating consumer debt (credit cards, car loans) often has the highest guaranteed 'return' since you're stopping 15–25% interest charges."
          },
          {
            q: "How is this different from a budget tracker?",
            a: "A budget tracker monitors monthly cash flow (income vs spending). A net worth calculator is a balance sheet snapshot — it measures total accumulated wealth across all accounts and debts. Both are complementary: budgeting improves cash flow, which then improves net worth over time."
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


