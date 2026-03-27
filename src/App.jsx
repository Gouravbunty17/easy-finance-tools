import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolsPage from './pages/ToolsPage';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DividendCalculator from './pages/tools/DividendCalculator';
import TFSACalculator from './pages/tools/TFSACalculator';
import RRSPCalculator from './pages/tools/RRSPCalculator';
import BudgetTracker from './pages/tools/BudgetTracker';
import InvestmentTracker from './pages/tools/InvestmentTracker';
import FHSACalculator from './pages/tools/FHSACalculator';
import MortgageCalculator from './pages/tools/MortgageCalculator';
import RentVsBuyCalculator from './pages/tools/RentVsBuyCalculator';
import StockPage from './pages/stocks/StockPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/tools/dividend-calculator" element={<DividendCalculator />} />
          <Route path="/tools/tfsa-calculator" element={<TFSACalculator />} />
          <Route path="/tools/rrsp-calculator" element={<RRSPCalculator />} />
          <Route path="/tools/budget-tracker" element={<BudgetTracker />} />
          <Route path="/tools/investment-tracker" element={<InvestmentTracker />} />
          <Route path="/tools/fhsa-calculator" element={<FHSACalculator />} />
          <Route path="/tools/mortgage-calculator" element={<MortgageCalculator />} />
          <Route path="/tools/rent-vs-buy" element={<RentVsBuyCalculator />} />
          <Route path="/stocks" element={<StockPage />} />
          <Route path="/stocks/:ticker" element={<StockPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
