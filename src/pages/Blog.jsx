import React from 'react';
import { NavLink } from 'react-router-dom';
import WealthsimpleWidget from '../components/WealthsimpleWidget';
import AdBlock from '../components/AdBlock';

const blogs = [
  {
    title: "Beginner’s Guide to Canadian Taxes",
    date: "June 9, 2025",
    image: "/src/assets/canadian-tax-guide.png",
    summary: "Understand income tax, credits, and how to maximize your refund as a new Canadian.",
    link: "/blog/tax-guide"
  },
  {
    title: "Investing Basics for Canadians",
    date: "June 12, 2025",
    image: "/src/assets/investing-basics.png",
    summary: "Learn the simple steps to start investing in Canada using TFSAs, RRSPs, and ETFs.",
    link: "/blog/investing-basics"
  },
  {
    title: "Master Your Credit Score",
    date: "June 5, 2025",
    image: "/src/assets/credit-score-guide.png",
    summary: "Tips to build and maintain a strong credit score as a new immigrant or student.",
    link: "/blog/credit-score-guide"
  },
];

export default function Blog() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-primary mb-6">📚 Blog Articles</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((post, index) => (
          <NavLink to={post.link} key={index} className="block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden transition transform hover:-translate-y-1">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold text-primary">{post.title}</h2>
              <p className="text-xs text-neutral-500 mb-2">{post.date}</p>
              <p className="text-sm text-neutral-dark">{post.summary}</p>
            </div>
          </NavLink>
        ))}
      </div>

      {/* Wealthsimple Widget */}
      <div className="my-10">
        <WealthsimpleWidget fallbackLink="https://wealthsimple.com/invite/R8F7ZW" />
      </div>

      {/* AdSense Ad */}
      <div className="text-center mt-10">
        <AdBlock slot="3333333333" />
      </div>
    </div>
  );
}
