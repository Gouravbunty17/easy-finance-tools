import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { trackPageView } from './lib/analytics';

// Eagerly loaded - always needed on first paint.
import Home from './pages/Home';

const CommandPalette = lazy(() => import('./components/CommandPalette'));

// Lazy-loaded route chunks - only downloaded when visited.
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Methodology = lazy(() => import('./pages/Methodology'));
const EditorialStandards = lazy(() => import('./pages/EditorialStandards'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));

const DividendCalculator = lazy(() => import('./pages/tools/DividendCalculator'));
const TFSACalculator = lazy(() => import('./pages/tools/TFSACalculator'));
const RRSPCalculator = lazy(() => import('./pages/tools/RRSPCalculator'));
const BudgetTracker = lazy(() => import('./pages/tools/BudgetTracker'));
const InvestmentTracker = lazy(() => import('./pages/tools/InvestmentTracker'));
const FHSACalculator = lazy(() => import('./pages/tools/FHSACalculator'));
const MortgageCalculator = lazy(() => import('./pages/tools/MortgageCalculator'));
const RentVsBuyCalculator = lazy(() => import('./pages/tools/RentVsBuyCalculator'));
const CapitalGainsTaxCalculator = lazy(() => import('./pages/tools/CapitalGainsTaxCalculator'));
const CPPOASEstimator = lazy(() => import('./pages/tools/CPPOASEstimator'));
const IncomeTaxCalculator = lazy(() => import('./pages/tools/IncomeTaxCalculator'));
const FIRECalculator = lazy(() => import('./pages/tools/FIRECalculator'));
const CompoundInterestCalculator = lazy(() => import('./pages/tools/CompoundInterestCalculator'));
const TipCalculator = lazy(() => import('./pages/tools/TipCalculator'));
const GstHstCalculator = lazy(() => import('./pages/tools/GstHstCalculator'));
const SalaryToHourlyCalculator = lazy(() => import('./pages/tools/SalaryToHourlyCalculator'));
const CadUsdConverter = lazy(() => import('./pages/tools/CadUsdConverter'));
const InflationCalculator = lazy(() => import('./pages/tools/InflationCalculator'));
const MortgageAffordabilityCalculator = lazy(() => import('./pages/tools/MortgageAffordabilityCalculator'));

const GICCalculator = lazy(() => import('./pages/tools/GICCalculator'));
const DebtPayoffCalculator = lazy(() => import('./pages/tools/DebtPayoffCalculator'));
const SavingsGoalCalculator = lazy(() => import('./pages/tools/SavingsGoalCalculator'));
const NetPayCalculator = lazy(() => import('./pages/tools/NetPayCalculator'));

const WeeklyDividendETFs = lazy(() => import('./pages/blog/weekly-dividend-etfs'));
const FiveHundredMonthDividendCanada = lazy(() => import('./pages/blog/500-month-dividend-canada'));
const FHSACalculatorCanada2026 = lazy(() => import('./pages/blog/fhsa-calculator-canada-2026'));
const FHSAvsRRSPDownPaymentCanada2026 = lazy(() => import('./pages/blog/fhsa-vs-rrsp-down-payment-canada-2026'));
const TFSAvsRRSPCanada2026 = lazy(() => import('./pages/blog/tfsa-vs-rrsp-canada-2026'));
const HowToStartInvestingCanada2026 = lazy(() => import('./pages/blog/how-to-start-investing-canada-2026'));
const HowToInvestBeginners = lazy(() => import('./pages/blog/how-to-invest-in-canada-beginners-2026'));
const BestHISACanada2026 = lazy(() => import('./pages/blog/best-hisa-canada-2026'));
const EmergencyFundCanada = lazy(() => import('./pages/blog/emergency-fund-canada'));
const PayOffMortgageFaster = lazy(() => import('./pages/blog/pay-off-mortgage-faster-canada'));
const CanadaChildBenefit2026 = lazy(() => import('./pages/blog/canada-child-benefit-2026'));
const TFSAvsRRSP = lazy(() => import('./pages/blog/tfsa-vs-rrsp-2026'));
const HowMuchTFSARoom = lazy(() => import('./pages/blog/how-much-tfsa-room-2026'));
const BestETFsForTFSA = lazy(() => import('./pages/blog/best-etfs-for-tfsa-canada-2026'));
const HowToUseFHSA = lazy(() => import('./pages/blog/how-to-use-fhsa-canada'));
const CPPPaymentDates2026 = lazy(() => import('./pages/blog/cpp-payment-dates-2026'));
const OASPaymentDates2026 = lazy(() => import('./pages/blog/oas-payment-dates-2026'));
const CanadianTaxBrackets2026 = lazy(() => import('./pages/blog/canadian-tax-brackets-2026'));
const RRSPDeadline2026 = lazy(() => import('./pages/blog/rrsp-deadline-2026'));
const BestGICRatesCanada2026 = lazy(() => import('./pages/blog/best-gic-rates-canada-2026'));
const WealthsimpleVsQuestradeCanada = lazy(() => import('./pages/blog/wealthsimple-vs-questrade-canada'));
const BestTFSABrokersCanada = lazy(() => import('./pages/blog/best-tfsa-brokers-canada'));
const BestRRSPAccountsCanada = lazy(() => import('./pages/blog/best-rrsp-accounts-canada'));
const BestInvestingAppsCanada = lazy(() => import('./pages/blog/best-investing-apps-canada'));
const BestDividendInvestingPlatformsCanada = lazy(() => import('./pages/blog/best-dividend-investing-platforms-canada'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading page" />
    </div>
  );
}

function useSpaPageTracking() {
  const location = useLocation();
  const hasTrackedInitialPage = useRef(false);

  useEffect(() => {
    if (!hasTrackedInitialPage.current) {
      hasTrackedInitialPage.current = true;
      return;
    }

    trackPageView({
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}${location.hash}`,
    });
  }, [location.pathname, location.search, location.hash]);
}

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useSpaPageTracking();

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Suspense fallback={null}>
        {isCommandPaletteOpen ? (
          <CommandPalette
            open={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
          />
        ) : null}
      </Suspense>
      <Header onOpenSearch={() => setIsCommandPaletteOpen(true)} />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/editorial-standards" element={<EditorialStandards />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/tools/dividend-calculator" element={<DividendCalculator />} />
            <Route path="/tools/tfsa-calculator" element={<TFSACalculator />} />
            <Route path="/tools/rrsp-calculator" element={<RRSPCalculator />} />
            <Route path="/tools/budget-tracker" element={<BudgetTracker />} />
            <Route path="/tools/investment-tracker" element={<InvestmentTracker />} />
            <Route path="/tools/fhsa-calculator" element={<FHSACalculator />} />
            <Route path="/tools/mortgage-calculator" element={<MortgageCalculator />} />
            <Route path="/tools/rent-vs-buy" element={<RentVsBuyCalculator />} />
            <Route path="/tools/capital-gains-tax" element={<CapitalGainsTaxCalculator />} />
            <Route path="/tools/cpp-oas-estimator" element={<CPPOASEstimator />} />
            <Route path="/tools/income-tax-calculator" element={<IncomeTaxCalculator />} />
            <Route path="/tools/fire-calculator" element={<FIRECalculator />} />
            <Route path="/tools/compound-interest-calculator" element={<CompoundInterestCalculator />} />
            <Route path="/tools/tip-calculator" element={<TipCalculator />} />
            <Route path="/tools/gst-hst-calculator" element={<GstHstCalculator />} />
            <Route path="/tools/salary-to-hourly-calculator" element={<SalaryToHourlyCalculator />} />
            <Route path="/tools/cad-usd-converter" element={<CadUsdConverter />} />
            <Route path="/tools/inflation-calculator" element={<InflationCalculator />} />
            <Route path="/tools/mortgage-affordability-calculator" element={<MortgageAffordabilityCalculator />} />
            <Route path="/tools/gic-calculator" element={<GICCalculator />} />
            <Route path="/tools/debt-payoff" element={<DebtPayoffCalculator />} />
            <Route path="/tools/savings-goal" element={<SavingsGoalCalculator />} />
            <Route path="/tools/net-pay-calculator" element={<NetPayCalculator />} />
            <Route path="/blog/weekly-dividend-etfs" element={<WeeklyDividendETFs />} />
            <Route path="/blog/500-month-dividend-canada" element={<FiveHundredMonthDividendCanada />} />
            <Route path="/blog/fhsa-calculator-canada-2026" element={<FHSACalculatorCanada2026 />} />
            <Route path="/blog/fhsa-vs-rrsp-down-payment-canada-2026" element={<FHSAvsRRSPDownPaymentCanada2026 />} />
            <Route path="/blog/tfsa-vs-rrsp-canada-2026" element={<TFSAvsRRSPCanada2026 />} />
            <Route path="/blog/how-to-start-investing-canada-2026" element={<HowToStartInvestingCanada2026 />} />
            <Route path="/blog/tfsa-vs-rrsp-2026" element={<TFSAvsRRSP />} />
            <Route path="/blog/how-much-tfsa-room-2026" element={<HowMuchTFSARoom />} />
            <Route path="/blog/best-etfs-for-tfsa-canada-2026" element={<BestETFsForTFSA />} />
            <Route path="/blog/how-to-use-fhsa-canada" element={<HowToUseFHSA />} />
            <Route path="/blog/cpp-payment-dates-2026" element={<CPPPaymentDates2026 />} />
            <Route path="/blog/oas-payment-dates-2026" element={<OASPaymentDates2026 />} />
            <Route path="/blog/canadian-tax-brackets-2026" element={<CanadianTaxBrackets2026 />} />
            <Route path="/blog/rrsp-deadline-2026" element={<RRSPDeadline2026 />} />
            <Route path="/blog/best-gic-rates-canada-2026" element={<BestGICRatesCanada2026 />} />
            <Route path="/blog/wealthsimple-vs-questrade-canada" element={<WealthsimpleVsQuestradeCanada />} />
            <Route path="/blog/best-tfsa-brokers-canada" element={<BestTFSABrokersCanada />} />
            <Route path="/blog/best-rrsp-accounts-canada" element={<BestRRSPAccountsCanada />} />
            <Route path="/blog/best-investing-apps-canada" element={<BestInvestingAppsCanada />} />
            <Route path="/blog/best-dividend-investing-platforms-canada" element={<BestDividendInvestingPlatformsCanada />} />
            <Route path="/blog/how-to-invest-in-canada-beginners-2026" element={<HowToInvestBeginners />} />
            <Route path="/blog/best-hisa-canada-2026" element={<BestHISACanada2026 />} />
            <Route path="/blog/emergency-fund-canada" element={<EmergencyFundCanada />} />
            <Route path="/blog/pay-off-mortgage-faster-canada" element={<PayOffMortgageFaster />} />
            <Route path="/blog/canada-child-benefit-2026" element={<CanadaChildBenefit2026 />} />
            <Route
              path="*"
              element={
                <div className="mx-auto max-w-3xl px-4 py-24 text-center">
                  <h1 className="text-4xl font-bold text-primary dark:text-accent">Page not found</h1>
                  <p className="mt-4 text-slate-600 dark:text-slate-300">The page you're looking for doesn't exist.</p>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
