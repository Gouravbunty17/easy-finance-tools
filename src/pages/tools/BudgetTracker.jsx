import React, { useState } from 'react';

export default function BudgetTracker() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [remaining, setRemaining] = useState(null);

  const calculate = () => {
    const result = parseFloat(income) - parseFloat(expenses);
    setRemaining(result.toFixed(2));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Budget Tracker</h2>
      <input
        type="number"
        placeholder="Monthly Income"
        className="border p-2 w-full mb-2"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />
      <input
        type="number"
        placeholder="Monthly Expenses"
        className="border p-2 w-full mb-4"
        value={expenses}
        onChange={(e) => setExpenses(e.target.value)}
      />
      <button
        onClick={calculate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Calculate
      </button>
      {remaining !== null && (
        <p className="mt-4 text-lg">
          Remaining Budget: <strong>${remaining}</strong>
        </p>
      )}
    </div>
  );
}
