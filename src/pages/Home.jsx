import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiCpu, FiEdit } from 'react-icons/fi';
import WealthsimpleWidget from '../components/WealthsimpleWidget';

const FeatureCard = ({ icon, title, description, link }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
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
      {/* Hero Section */}
      <section className="bg-neutral-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4">
            Smart Financial Tools for a Brighter Future
          </h1>
          <p className="text-lg md:text-xl text-neutral-dark max-w-3xl mx-auto mb-8">
            Take control of your finances with our suite of free, easy-to-use calculators and tools.
          </p>
          <NavLink
            to="/tools"
            className="bg-secondary text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-primary transition-transform duration-300 inline-block transform hover:scale-105"
          >
            Explore Our Tools
          </NavLink>
        </div>

        {/* AdSense Banner Below Hero */}
        <div className="text-center my-8">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-4262496331692202"
            data-ad-slot="3333333333"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }} />
        </div>
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
    </div>
  );
};

export default Home;
