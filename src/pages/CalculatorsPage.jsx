import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPercent, FiCreditCard, FiTrendingUp } from 'react-icons/fi';

const CalculatorCard = ({ icon, title, description, link }) => (
  <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
    <div className="text-primary text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
    <p className="text-neutral-dark dark:text-neutral-300 mb-4">{description}</p>
    <NavLink
      to={link}
      className="inline-block text-sm font-semibold text-secondary hover:text-primary transition"
    >
      Try Calculator →
    </NavLink>
  </div>
);

const CalculatorsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-primary mb-10">Explore Our Calculators</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <CalculatorCard
          icon={<FiHome />}
          title="Mortgage Calculator"
          description="Estimate your monthly mortgage payments easily."
          link="/calculators/mortgage"
        />
        <CalculatorCard
          icon={<FiPercent />}
          title="Savings Calculator"
          description="Calculate how much you can save with regular deposits."
          link="/calculators/savings"
        />
        <CalculatorCard
          icon={<FiCreditCard />}
          title="Loan Calculator"
          description="Figure out your monthly payments and total interest."
          link="/calculators/loan"
        />
        <CalculatorCard
          icon={<FiTrendingUp />}
          title="Compound Interest Calculator"
          description="See how your investments grow with compound interest."
          link="/calculators/compound-interest"
        />
        <CalculatorCard
          icon={<FiCreditCard />}
          title="Canada Tax Calculator"
          description="Estimate your paycheck after taxes in each province."
          link="/calculators/canada-tax"
        />
      </div>
    </div>
  );
};

export default CalculatorsPage;
