import React from 'react';
import AdBlock from '../components/AdBlock';
import taxGuideImage from '../assets/tax-guide.png'; // Make sure this file exists in /src/assets/

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-primary mb-6">Finance Blog</h1>

      {/* Top Banner Ad */}
      <div className="mb-8 text-center">
        <AdBlock slot="3333333333" />
      </div>

      {/* Blog posts */}
      <div className="space-y-8">

        {/* ✅ NEW ARTICLE */}
        <article className="bg-white shadow rounded p-6">
          <img
            src={taxGuideImage}
            alt="Canadian Tax Guide"
            className="rounded mb-4 w-full max-h-72 object-cover"
          />
          <h2 className="text-2xl font-bold mb-1">Beginner’s Guide to Canadian Taxes</h2>
          <p className="text-sm text-gray-500 mb-3">Posted on June 9, 2025</p>
          <p className="text-neutral-dark mb-4">
            Understand the basics of income tax, credits, and how to maximize your return. Learn how Canada's progressive tax brackets work, what counts as taxable income, and smart ways to increase your refund using RRSPs, deductions, and credits.
          </p>
          <ul className="list-disc pl-5 text-neutral-dark mb-4">
            <li>Federal tax brackets from 15% to 29%</li>
            <li>Top credits: GST, Canada Workers Benefit, Trillium</li>
            <li>Tax refund tips: RRSPs, donations, moving expenses</li>
            <li>Free tools: EasyFinance Tax Calculator, Wealthsimple Tax</li>
          </ul>
          <p className="text-neutral-dark">
            Filing on time and claiming everything you're entitled to can save you thousands. Read our full article and use our free tax calculator to optimize your 2025 return.
          </p>
        </article>

        {/* Existing Articles */}
        <article className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-bold mb-2">How to Start Budgeting in Canada</h2>
          <p className="text-neutral-dark">Learn the basics of creating a personal budget using free tools and smart tips...</p>
        </article>

        <article className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-bold mb-2">TFSA vs RRSP: What Should You Use?</h2>
          <p className="text-neutral-dark">Compare the advantages of using TFSA vs RRSP for long-term tax-free growth in Canada...</p>
        </article>
      </div>

      {/* Footer Ad */}
      <div className="mt-12 text-center">
        <AdBlock slot="4444444444" />
      </div>
    </div>
  );
};

export default Blog;
