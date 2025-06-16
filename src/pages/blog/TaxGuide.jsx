import React from 'react';
import taxImage from '../../assets/canadian-tax-guide.png';
import AdBlock from '../../components/AdBlock';

export default function CanadianTaxGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold text-primary mb-4">Beginner’s Guide to Canadian Taxes</h1>
      <p className="text-sm text-neutral-500 mb-6">Published: June 9, 2025</p>

      <img
        src={taxImage}
        alt="Beginner’s Guide to Canadian Taxes"
        className="w-full rounded-lg shadow mb-8"
      />

      <p className="mb-4">
        <strong>Why Taxes Matter More Than You Think:</strong> Taxes fund everything from healthcare to roads,
        but for you, they’re a powerful financial tool. Get them right, and you could save thousands annually.
        In Canada’s progressive tax system, how much you earn and where you live dramatically impact what you pay.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Part 1: How Canadian Taxes Work</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>15% on first $55,867</li>
        <li>20.5% on $55,868–$111,733</li>
        <li>26% on $111,734–$173,205</li>
        <li>29% above $173,205</li>
      </ul>
      <p className="mb-4">
        <strong>Taxable income</strong> is your total income minus deductions like RRSP contributions, home office
        expenses, and childcare costs.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Part 2: Tax Credits You Should Know</h2>
      <table className="table-auto w-full border mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Credit Type</th>
            <th className="border px-4 py-2">Example</th>
            <th className="border px-4 py-2">Max Benefit (2025)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Non-Refundable</td>
            <td className="border px-4 py-2">Basic Personal Amount</td>
            <td className="border px-4 py-2">$15,705</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Refundable</td>
            <td className="border px-4 py-2">Canada Workers Benefit</td>
            <td className="border px-4 py-2">Up to $1,518</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Part 3: Maximize Your Refund</h2>
      <ul className="list-disc ml-6 mb-6">
        <li>Contribute to your RRSP before March 1 to reduce your tax bill.</li>
        <li>Claim student loan interest, moving expenses, and childcare costs.</li>
        <li>Split pension income if you're over 65.</li>
        <li>Donate appreciated stocks to avoid capital gains and get credits.</li>
        <li>Use a TFSA to grow your savings tax-free.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Part 4: Filing Checklist</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>T4 (employment income)</li>
        <li>T5 (investment income)</li>
        <li>RRSP slips and credit receipts</li>
        <li>File before April 30 or June 15 (self-employed)</li>
      </ul>

      <p className="mt-6">
        👉 Try our <a href="/tools/tax" className="text-blue-600 hover:underline">free Canada Tax Calculator</a> to
        estimate your refund and optimize your return.
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-neutral-600 mt-8">
        “The hardest thing in the world to understand is the income tax.” — Albert Einstein
      </blockquote>

      <p className="text-sm text-gray-500 mt-6">
        Disclaimer: This article provides general guidance only. Consult a licensed professional for personalized tax
        advice.
      </p>

      <div className="mt-12">
        <AdBlock slot="7777777777" />
      </div>
    </div>
  );
}
