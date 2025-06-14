import React, { useState } from 'react';

export default function DividendCalculator() {
  const [amount, setAmount] = useState('');
  const [yieldPercent, setYieldPercent] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const income = (parseFloat(amount) * parseFloat(yieldPercent)) / 100;
    setResult(income.toFixed(2));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dividend Calculator</h2>
      <input
        type="number"
        placeholder="Investment Amount"
        className="border p-2 w-full mb-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Dividend Yield (%)"
        className="border p-2 w-full mb-4"
        value={yieldPercent}
        onChange={(e) => setYieldPercent(e.target.value)}
      />
      <button
        onClick={calculate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Calculate
      </button>
      {result && (
        <p className="mt-4 text-lg">
          Estimated Annual Dividend Income: <strong>${result}</strong>
        </p>
      )}
    </div>
  );
}
