import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ToolsPage from './pages/ToolsPage';
import CalculatorsPage from './pages/CalculatorsPage';
import Blog from './pages/Blog';
import WeeklyDividendETFs from "./pages/blog/weekly-dividend-etfs";
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop'; // ✅ NEW Shop import
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Tools
import DividendCalculator from './pages/tools/DividendCalculator';
import BudgetTracker from './pages/tools/BudgetTracker';
import InvestmentTracker from './pages/tools/InvestmentTracker';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutralDark dark:bg-black dark:text-white">
      <Header />
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/blog" element={<Blog />} />
	  <Route path="/blog/weekly-dividend-etfs" element={<WeeklyDividendETFs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} /> {/* ✅ NEW Route */}
          <Route path="/tools/dividend-calculator" element={<DividendCalculator />} />
          <Route path="/tools/budget-tracker" element={<BudgetTracker />} />
          <Route path="/tools/investment-tracker" element={<InvestmentTracker />} />
	  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
	         </Routes>
      </main>
      <Footer />
    </div>
  );
}
