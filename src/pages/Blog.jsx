import React from 'react';
import { Link } from 'react-router-dom';
import blogThumb from '../assets/canadian-tax-guide.png';
import AdBlock from '../components/AdBlock';

const Blog = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-primary mb-4">📚 Blog & Financial Guides</h1>
      <p className="text-neutral-dark mb-6">
        Learn how to take control of your money with our easy-to-follow guides, investment tips, and tax strategies.
      </p>

      {/* Blog Article Preview */}
      <article className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <img src={blogThumb} alt="Tax guide blog" className="w-full h-64 object-cover" />
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-primary mb-2">Beginner’s Guide to Canadian Taxes</h2>
          <p className="text-sm text-gray-500 mb-2">📅 Posted on June 9, 2025</p>
          <p className="text-neutral-dark mb-4">
            Understand the basics of income tax, credits, and how to maximize your return as a new immigrant or first-time tax filer.
          </p>
          <Link
            to="/blog/tax-guide"
            className="inline-block text-secondary hover:text-primary font-semibold transition"
          >
            Read Full Article →
          </Link>
        </div>
      </article>

      {/* Ad Below First Article */}
      <div className="text-center my-10">
        <AdBlock slot="3333333333" />
      </div>

      {/* More posts can go here */}
      <p className="text-center text-gray-500 text-sm mt-6">More guides coming soon...</p>
    </div>
  );
};

export default Blog;
