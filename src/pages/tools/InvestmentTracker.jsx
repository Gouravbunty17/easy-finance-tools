import React, { useState } from 'react';

export default function InvestmentTracker() {
  const [invested, setInvested] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [gain, setGain] = useState(null);

  const calculate = () => {
    const result = parseFloat(currentValue) - parseFloat(invested);
    setGain(result.toFixed(2));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Investment Tracker</h2>
      <input
        type="number"
        placeholder="Amount Invested"
        className="border p-2 w-full mb-2"
        value={invested}
        onChange={(e) => setInvested(e.target.value)}
      />
      <input
        type="number"
        placeholder="Current Value"
        className="border p-2 w-full mb-4"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
      />
      <button
        onClick={calculate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Calculate Gain/Loss
      </button>
      {gain !== null && (
        <p className="mt-4 text-lg">
          Total Gain/Loss: <strong>${gain}</strong>
        </p>
      )}
    </div>
  );
}
