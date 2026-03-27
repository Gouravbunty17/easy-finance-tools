import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import useAdSense from "../../hooks/useAdSense";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function DividendCalculator() {
  const [investment, setInvestment] = useState(1000);
  const [shares, setShares] = useState(100);
  const [frequency, setFrequency] = useState("quarterly");
  const [drip, setDrip] = useState(true);
  const [dividends, setDividends] = useState(Array(12).fill(0.5));
  const [result, setResult] = useState(null);

  useAdSense();

  const calculate = () => {
    let totalDividends = 0;
    let currentShares = shares;
    let currentValue = investment;

    let yearlyBreakdown = [];

    dividends.forEach((dividendPerShare, idx) => {
      const payout = dividendPerShare * currentShares;
      totalDividends += payout;

      if (drip && dividendPerShare > 0) {
        const avgPricePerShare = currentValue / currentShares;
        const extraShares = payout / avgPricePerShare;
        currentShares += extraShares;
        currentValue += payout;
      }

      yearlyBreakdown.push({
        year: idx + 1,
        startShares: currentShares.toFixed(2),
        dividendReceived: payout.toFixed(2),
        endShares: currentShares.toFixed(2),
        endValue: (currentShares * (currentValue / shares)).toFixed(2),
      });
    });

    // Calculate average yield
    const avgDividendPerShare = dividends.reduce((sum, d) => sum + d, 0) / dividends.length;
    const monthlyYield = avgDividendPerShare / currentValue * shares * (12 / dividends.length) * 100;
    const annualYield = avgDividendPerShare / currentValue * shares * (12 / dividends.length) * 100;

    // Project future 10 years
    const futureProjections = [];
    let projectedShares = currentShares;
    let projectedValue = currentShares * (currentValue / shares);

    for (let i = 1; i <= 10; i++) {
      const futureDividend = avgDividendPerShare * projectedShares;
      if (drip) {
        const avgPrice = projectedValue / projectedShares;
        projectedShares += futureDividend / avgPrice;
        projectedValue += futureDividend;
      }
      futureProjections.push({
        year: i,
        projectedShares: projectedShares.toFixed(2),
        projectedValue: projectedValue.toFixed(2),
        projectedDividends: futureDividend.toFixed(2),
      });
    }

    setResult({
      totalDividends: totalDividends.toFixed(2),
      finalShares: currentShares.toFixed(2),
      finalValue: (currentShares * (currentValue / shares)).toFixed(2),
      monthlyYield: monthlyYield.toFixed(2),
      annualYield: annualYield.toFixed(2),
      yearlyBreakdown,
      futureProjections,
    });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary dark:text-accent mb-6">
        Dividend Calculator
      </h1>
      <div className="space-y-4">
        {/* Input fields */}
        <div>
          <label className="block mb-1">Initial Investment ($)</label>
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(parseFloat(e.target.value))}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Starting Shares</label>
          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(parseFloat(e.target.value))}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Dividend Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="weekly">Weekly (12 weeks)</option>
            <option value="monthly">Monthly (12 months)</option>
            <option value="quarterly">Quarterly (12 quarters)</option>
            <option value="yearly">Yearly (12 years)</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Your Last 12 Dividends ($/share)</label>
          <div className="grid grid-cols-2 gap-2">
            {dividends.map((d, idx) => (
              <input
                key={idx}
                type="number"
                value={d}
                onChange={(e) => {
                  const newDivs = [...dividends];
                  newDivs[idx] = parseFloat(e.target.value);
                  setDividends(newDivs);
                }}
                placeholder={`Payout ${idx + 1}`}
                className="p-2 border rounded"
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={drip}
            onChange={(e) => setDrip(e.target.checked)}
          />
          <label>Enable DRIP</label>
        </div>
        <button
          onClick={calculate}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
        >
          Calculate
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p>Total Dividends: ${result.totalDividends}</p>
          <p>Final Shares: {result.finalShares}</p>
          <p>Final Portfolio Value: ${result.finalValue}</p>
          <p>Average Monthly Yield: {result.monthlyYield}%</p>
          <p>Average Annual Yield: {result.annualYield}%</p>

          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full border border-gray-300 text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Year</th>
                  <th>Shares</th>
                  <th>Projected Dividends</th>
                  <th>Projected Portfolio Value</th>
                </tr>
              </thead>
              <tbody>
                {result.futureProjections.map((f) => (
                  <tr key={f.year} className="text-center">
                    <td>{f.year}</td>
                    <td>{f.projectedShares}</td>
                    <td>${f.projectedDividends}</td>
                    <td>${f.projectedValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="my-8">
            <Line
              data={{
                labels: result.futureProjections.map((f) => `Year ${f.year}`),
                datasets: [
                  {
                    label: "Portfolio Value",
                    data: result.futureProjections.map((f) => f.projectedValue),
                    fill: false,
                    borderColor: "#003366",
                  },
                  {
                    label: "Projected Dividends",
                    data: result.futureProjections.map((f) => f.projectedDividends),
                    fill: false,
                    borderColor: "#00A8E8",
                  },
                ],
              }}
            />
          </div>

          {/* Adsense block */}
          <div className="my-6">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-4262496331692202"
              data-ad-slot="9988776655"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>
        </div>
      )}
    </section>
  );
}
