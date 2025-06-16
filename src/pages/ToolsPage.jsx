import React from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const ToolCard = ({ title, description, link }) => (
  <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow hover:shadow-lg transition-all">
    <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
    <p className="text-neutral-dark dark:text-neutral-300 mb-4">{description}</p>
    <Link to={link} className="text-secondary font-semibold hover:underline">
      Try Tool
    </Link>
  </div>
);

const ToolsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Explore Our Free Finance Tools</h1>
      <p className="text-lg text-neutral-dark dark:text-neutral-300 mb-12 text-center">
        Use these tools to manage your budget, track your investments, and grow your money smarter.
      </p>

      {/* Grid of Tools */}
      <div className="grid md:grid-cols-3 gap-8">
        <ToolCard
          title="Dividend Calculator"
          description="Estimate your dividend income and reinvestment growth over time."
          link="/tools/dividend-calculator"
        />
        <ToolCard
          title="Budget Tracker"
          description="Organize your monthly expenses and stay within your budget with ease."
          link="/tools/budget-tracker"
        />
        <ToolCard
          title="Investment Tracker"
          description="Track portfolio performance and monitor growth and dividends."
          link="/tools/investment-tracker"
        />
      </div>

      {/* AdSense Unit Below Tool Grid */}
      <div className="w-full my-12 text-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client="ca-pub-4262496331692202"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>
          {(adsbygoogle = window.adsbygoogle || []).push({})}
        </script>
      </div>
    </div>
  );
};

export default ToolsPage;
