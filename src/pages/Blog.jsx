import React from 'react';
import AdBlock from '../components/AdBlock';

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-primary mb-6">Finance Blog</h1>

      {/* Top Banner Ad */}
      <div className="mb-8 text-center">
        <AdBlock slot="3333333333" />
      </div>

      {/* Blog posts list (placeholder) */}
      <div className="space-y-8">
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
