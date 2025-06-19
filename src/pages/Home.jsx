import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiCpu, FiEdit } from 'react-icons/fi';
import WealthsimpleWidget from '../components/WealthsimpleWidget';
import AdBlock from '../components/AdBlock';

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description, link }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
    <div className="text-secondary mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
    <p className="text-neutral-dark mb-4">{description}</p>
    <NavLink to={link} className="font-semibold text-secondary hover:text-primary flex items-center">
      Learn More <FiArrowRight className="ml-2" />
    </NavLink>
  </div>
);

const Home = () => {
  return (
    <div className="font-sans">
      {/* Animated Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-10"></div>
        <div className="container mx-auto px-4 py-32 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in">
            Smart Financial Tools for a Brighter Future
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 animate-fade-in delay-100">
            Take control of your finances with our suite of free, easy-to-use calculators and tools
          </p>
          <NavLink
            to="/tools"
            className="bg-white text-blue-600 text-lg font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 inline-block transform hover:scale-105 animate-bounce-slow"
          >
            Explore Our Tools
          </NavLink>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-600 to-transparent"></div>
      </section>

      {/* AdSense after hero */}
      <div className="text-center my-10">
        <AdBlock slot="1111111111" />
      </div>

      {/* Amazon Book Promo */}
      <section className="bg-yellow-50 p-6 rounded-md shadow-md text-center mt-10">
        <h2 className="text-2xl font-bold mb-2">📘 New: Budgeting Book on Amazon</h2>
        <p className="text-neutral-700 mb-4">
          Get your finances in shape with our beginner-friendly budgeting planner. Available now on Amazon!
        </p>
        <a
          href="https://a.co/d/61iS1lQ"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-600 text-white px-6 py-3 rounded hover:bg-yellow-500 transition"
        >
          Shop on Amazon
        </a>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Everything You Need, All in One Place</h2>
            <p className="text-neutral-dark mt-2">From complex calculations to simple budgeting, we've got you covered.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FiCpu size={40} />}
              title="Powerful Calculators"
              description="Mortgage, savings, loans, and more. Get precise answers to your financial questions in seconds."
              link="/calculators"
            />
            <FeatureCard
              icon={<FiBarChart2 size={40} />}
              title="Insightful Tools"
              description="Track your investments, create a budget that works, and visualize your financial growth."
              link="/tools"
            />
            <FeatureCard
              icon={<FiEdit size={40} />}
              title="Expert Blog"
              description="Read our articles on financial planning, investing tips, and economic trends to stay ahead."
              link="/blog"
            />
          </div>
        </div>
      </section>

      {/* Wealthsimple Referral Widget Section */}
      <section className="py-10 bg-blue-50 dark:bg-neutralDark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <WealthsimpleWidget />
        </div>
      </section>

      {/* AdSense Below Widget */}
      <div className="text-center mt-10">
        <AdBlock slot="2222222222" />
      </div>
    </div>
  );
};

export default Home;
