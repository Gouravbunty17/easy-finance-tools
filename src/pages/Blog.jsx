import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const articles = [
  {
    title: 'Top 5 Tips to Start Budgeting Today',
    summary: 'Learn how to set up your first budget, track expenses, and avoid common mistakes.',
    date: 'June 2025',
    link: '/blog/start-budgeting-tips'
  },
  {
    title: 'How Dividend Investing Builds Wealth',
    summary: 'Discover the power of compounding dividends and how to choose the right stocks.',
    date: 'May 2025',
    link: '/blog/dividend-investing-guide'
  },
  {
    title: 'Beginner’s Guide to Canadian Taxes',
    summary: 'Understand the basics of income tax, credits, and how to maximize your return.',
    date: 'April 2025',
    link: '/blog/canadian-tax-guide'
  }
];

const Blog = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Financial Literacy Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <div key={index} className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <p className="text-sm text-neutral-500 mb-1">{article.date}</p>
            <h2 className="text-xl font-semibold text-primary mb-2">{article.title}</h2>
            <p className="text-neutral-dark dark:text-neutral-300 mb-4">{article.summary}</p>
            <NavLink
              to={article.link}
              className="inline-flex items-center font-medium text-secondary hover:text-primary"
            >
              Read More <FiArrowRight className="ml-2" />
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
