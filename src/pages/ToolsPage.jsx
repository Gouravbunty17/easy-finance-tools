import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiDollarSign, FiClipboard, FiBarChart2 } from 'react-icons/fi';

const ToolCard = ({ icon, title, description, link }) => (
  <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
    <div className="text-primary text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
    <p className="text-neutral-dark dark:text-neutral-300 mb-4">{description}</p>
    <NavLink
      to={link}
      className="inline-block text-sm font-semibold text-secondary hover:text-primary transition"
    >
      Try Tool →
    </NavLink>
  </div>
);

const ToolsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-primary mb-10">Explore Our Financial Tools</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ToolCard
          icon={<FiDollarSign />}
          title="Dividend Calculator"
          description="Calculate your monthly, quarterly, and annual dividend income."
          link="/tools/dividend-calculator"
        />
        <ToolCard
          icon={<FiClipboard />}
          title="Budget Tracker"
          description="Track your income and expenses with our budgeting sheet."
          link="/tools/budget-tracker"
        />
        <ToolCard
          icon={<FiBarChart2 />}
          title="Investment Tracker"
          description="Monitor your holdings and see how your investments perform."
          link="/tools/investment-tracker"
        />
      </div>
    </div>
  );
};

export default ToolsPage;
