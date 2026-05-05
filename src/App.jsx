import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { trackPageView } from './lib/analytics';
import { lazyWithPreload } from './lib/lazyWithPreload';

// Eagerly loaded - always needed on first paint.
import Home from './pages/Home';

const CommandPalette = lazy(() => import('./components/CommandPalette'));

// Lazy-loaded route chunks - only downloaded when visited.
const ToolsPage = lazyWithPreload(() => import('./pages/ToolsPage'));
const Blog = lazyWithPreload(() => import('./pages/Blog'));
const About = lazyWithPreload(() => import('./pages/About'));
const Contact = lazyWithPreload(() => import('./pages/Contact'));
const Methodology = lazyWithPreload(() => import('./pages/Methodology'));
const EditorialStandards = lazyWithPreload(() => import('./pages/EditorialStandards'));
const PrivacyPolicy = lazyWithPreload(() => import('./pages/PrivacyPolicy'));
const Terms = lazyWithPreload(() => import('./pages/Terms'));
const AffiliateDisclosure = lazyWithPreload(() => import('./pages/AffiliateDisclosure'));

const DividendCalculator = lazyWithPreload(() => import('./pages/tools/DividendCalculator'));
const TFSACalculator = lazyWithPreload(() => import('./pages/tools/TFSACalculator'));
const RRSPCalculator = lazyWithPreload(() => import('./pages/tools/RRSPCalculator'));
const BudgetTracker = lazyWithPreload(() => import('./pages/tools/BudgetTracker'));
const InvestmentTracker = lazyWithPreload(() => import('./pages/tools/InvestmentTracker'));
const FHSACalculator = lazyWithPreload(() => import('./pages/tools/FHSACalculator'));
const MortgageCalculator = lazyWithPreload(() => import('./pages/tools/MortgageCalculator'));
const RentVsBuyCalculator = lazyWithPreload(() => import('./pages/tools/RentVsBuyCalculator'));
const CapitalGainsTaxCalculator = lazyWithPreload(() => import('./pages/tools/CapitalGainsTaxCalculator'));
const CPPOASEstimator = lazyWithPreload(() => import('./pages/tools/CPPOASEstimator'));
const IncomeTaxCalculator = lazyWithPreload(() => import('./pages/tools/IncomeTaxCalculator'));
const FIRECalculator = lazyWithPreload(() => import('./pages/tools/FIRECalculator'));
const CompoundInterestCalculator = lazyWithPreload(() => import('./pages/tools/CompoundInterestCalculator'));
const TipCalculator = lazyWithPreload(() => import('./pages/tools/TipCalculator'));
const GstHstCalculator = lazyWithPreload(() => import('./pages/tools/GstHstCalculator'));
const SalaryToHourlyCalculator = lazyWithPreload(() => import('./pages/tools/SalaryToHourlyCalculator'));
const CadUsdConverter = lazyWithPreload(() => import('./pages/tools/CadUsdConverter'));
const InflationCalculator = lazyWithPreload(() => import('./pages/tools/InflationCalculator'));
const MortgageAffordabilityCalculator = lazyWithPreload(() => import('./pages/tools/MortgageAffordabilityCalculator'));

const GICCalculator = lazyWithPreload(() => import('./pages/tools/GICCalculator'));
const DebtPayoffCalculator = lazyWithPreload(() => import('./pages/tools/DebtPayoffCalculator'));
const SavingsGoalCalculator = lazyWithPreload(() => import('./pages/tools/SavingsGoalCalculator'));
const NetPayCalculator = lazyWithPreload(() => import('./pages/tools/NetPayCalculator'));

const WeeklyDividendETFs = lazyWithPreload(() => import('./pages/blog/weekly-dividend-etfs'));
const FiveHundredMonthDividendCanada = lazyWithPreload(() => import('./pages/blog/500-month-dividend-canada'));
const FHSACalculatorCanada2026 = lazyWithPreload(() => import('./pages/blog/fhsa-calculator-canada-2026'));
const FHSAvsRRSPDownPaymentCanada2026 = lazyWithPreload(() => import('./pages/blog/fhsa-vs-rrsp-down-payment-canada-2026'));
const TFSAvsRRSPCanada2026 = lazyWithPreload(() => import('./pages/blog/tfsa-vs-rrsp-canada-2026'));
const HowToStartInvestingCanada2026 = lazyWithPreload(() => import('./pages/blog/how-to-start-investing-canada-2026'));
const HowToInvestBeginners = lazyWithPreload(() => import('./pages/blog/how-to-invest-in-canada-beginners-2026'));
const BestHISACanada2026 = lazyWithPreload(() => import('./pages/blog/best-hisa-canada-2026'));
const EmergencyFundCanada = lazyWithPreload(() => import('./pages/blog/emergency-fund-canada'));
const PayOffMortgageFaster = lazyWithPreload(() => import('./pages/blog/pay-off-mortgage-faster-canada'));
const CanadaChildBenefit2026 = lazyWithPreload(() => import('./pages/blog/canada-child-benefit-2026'));
const TFSAvsRRSP = lazyWithPreload(() => import('./pages/blog/tfsa-vs-rrsp-2026'));
const HowMuchTFSARoom = lazyWithPreload(() => import('./pages/blog/how-much-tfsa-room-2026'));
const BestETFsForTFSA = lazyWithPreload(() => import('./pages/blog/best-etfs-for-tfsa-canada-2026'));
const HowToUseFHSA = lazyWithPreload(() => import('./pages/blog/how-to-use-fhsa-canada'));
const CPPPaymentDates2026 = lazyWithPreload(() => import('./pages/blog/cpp-payment-dates-2026'));
const OASPaymentDates2026 = lazyWithPreload(() => import('./pages/blog/oas-payment-dates-2026'));
const CanadianTaxBrackets2026 = lazyWithPreload(() => import('./pages/blog/canadian-tax-brackets-2026'));
const RRSPDeadline2026 = lazyWithPreload(() => import('./pages/blog/rrsp-deadline-2026'));
const BestGICRatesCanada2026 = lazyWithPreload(() => import('./pages/blog/best-gic-rates-canada-2026'));
const WealthsimpleVsQuestradeCanada = lazyWithPreload(() => import('./pages/blog/wealthsimple-vs-questrade-canada'));
const BestTFSABrokersCanada = lazyWithPreload(() => import('./pages/blog/best-tfsa-brokers-canada'));
const BestRRSPAccountsCanada = lazyWithPreload(() => import('./pages/blog/best-rrsp-accounts-canada'));
const BestInvestingAppsCanada = lazyWithPreload(() => import('./pages/blog/best-investing-apps-canada'));
const BestDividendInvestingPlatformsCanada = lazyWithPreload(() => import('./pages/blog/best-dividend-investing-platforms-canada'));
const TFSAContributionRoomCanada2026 = lazyWithPreload(() => import('./pages/blog/tfsa-contribution-room-canada-2026'));
const RRSPDeadlineCanada2026 = lazyWithPreload(() => import('./pages/blog/rrsp-deadline-canada-2026'));
const FHSARulesCanada2026 = lazyWithPreload(() => import('./pages/blog/fhsa-rules-canada-2026'));
const TFSAvsRRSPvsFHSACanada = lazyWithPreload(() => import('./pages/blog/tfsa-vs-rrsp-vs-fhsa-canada'));
const BestCanadianDividendETFs2026 = lazyWithPreload(() => import('./pages/blog/best-canadian-dividend-etfs-2026'));
const DividendReinvestmentPlansCanada = lazyWithPreload(() => import('./pages/blog/dividend-reinvestment-plans-canada'));

const ROUTE_PRELOADERS = new Map([
  ['/tools', ToolsPage],
  ['/blog', Blog],
  ['/about', About],
  ['/contact', Contact],
  ['/methodology', Methodology],
  ['/editorial-standards', EditorialStandards],
  ['/privacy-policy', PrivacyPolicy],
  ['/terms', Terms],
  ['/affiliate-disclosure', AffiliateDisclosure],
  ['/tools/dividend-calculator', DividendCalculator],
  ['/tools/tfsa-calculator', TFSACalculator],
  ['/tools/rrsp-calculator', RRSPCalculator],
  ['/tools/budget-tracker', BudgetTracker],
  ['/tools/investment-tracker', InvestmentTracker],
  ['/tools/fhsa-calculator', FHSACalculator],
  ['/tools/mortgage-calculator', MortgageCalculator],
  ['/tools/rent-vs-buy', RentVsBuyCalculator],
  ['/tools/capital-gains-tax', CapitalGainsTaxCalculator],
  ['/tools/cpp-oas-estimator', CPPOASEstimator],
  ['/tools/income-tax-calculator', IncomeTaxCalculator],
  ['/tools/fire-calculator', FIRECalculator],
  ['/tools/compound-interest-calculator', CompoundInterestCalculator],
  ['/tools/tip-calculator', TipCalculator],
  ['/tools/gst-hst-calculator', GstHstCalculator],
  ['/tools/salary-to-hourly-calculator', SalaryToHourlyCalculator],
  ['/tools/cad-usd-converter', CadUsdConverter],
  ['/tools/inflation-calculator', InflationCalculator],
  ['/tools/mortgage-affordability-calculator', MortgageAffordabilityCalculator],
  ['/tools/gic-calculator', GICCalculator],
  ['/tools/debt-payoff', DebtPayoffCalculator],
  ['/tools/savings-goal', SavingsGoalCalculator],
  ['/tools/net-pay-calculator', NetPayCalculator],
  ['/blog/weekly-dividend-etfs', WeeklyDividendETFs],
  ['/blog/500-month-dividend-canada', FiveHundredMonthDividendCanada],
  ['/blog/fhsa-calculator-canada-2026', FHSACalculatorCanada2026],
  ['/blog/fhsa-vs-rrsp-down-payment-canada-2026', FHSAvsRRSPDownPaymentCanada2026],
  ['/blog/tfsa-vs-rrsp-canada-2026', TFSAvsRRSPCanada2026],
  ['/blog/how-to-start-investing-canada-2026', HowToStartInvestingCanada2026],
  ['/blog/how-to-invest-in-canada-beginners-2026', HowToInvestBeginners],
  ['/blog/best-hisa-canada-2026', BestHISACanada2026],
  ['/blog/emergency-fund-canada', EmergencyFundCanada],
  ['/blog/pay-off-mortgage-faster-canada', PayOffMortgageFaster],
  ['/blog/canada-child-benefit-2026', CanadaChildBenefit2026],
  ['/blog/tfsa-vs-rrsp-2026', TFSAvsRRSP],
  ['/blog/how-much-tfsa-room-2026', HowMuchTFSARoom],
  ['/blog/best-etfs-for-tfsa-canada-2026', BestETFsForTFSA],
  ['/blog/how-to-use-fhsa-canada', HowToUseFHSA],
  ['/blog/cpp-payment-dates-2026', CPPPaymentDates2026],
  ['/blog/oas-payment-dates-2026', OASPaymentDates2026],
  ['/blog/canadian-tax-brackets-2026', CanadianTaxBrackets2026],
  ['/blog/rrsp-deadline-2026', RRSPDeadline2026],
  ['/blog/best-gic-rates-canada-2026', BestGICRatesCanada2026],
  ['/blog/wealthsimple-vs-questrade-canada', WealthsimpleVsQuestradeCanada],
  ['/blog/best-tfsa-brokers-canada', BestTFSABrokersCanada],
  ['/blog/best-rrsp-accounts-canada', BestRRSPAccountsCanada],
  ['/blog/best-investing-apps-canada', BestInvestingAppsCanada],
  ['/blog/best-dividend-investing-platforms-canada', BestDividendInvestingPlatformsCanada],
  ['/blog/tfsa-contribution-room-canada-2026', TFSAContributionRoomCanada2026],
  ['/blog/rrsp-deadline-canada-2026', RRSPDeadlineCanada2026],
  ['/blog/fhsa-rules-canada-2026', FHSARulesCanada2026],
  ['/blog/tfsa-vs-rrsp-vs-fhsa-canada', TFSAvsRRSPvsFHSACanada],
  ['/blog/best-canadian-dividend-etfs-2026', BestCanadianDividendETFs2026],
  ['/blog/dividend-reinvestment-plans-canada', DividendReinvestmentPlansCanada],
]);

export function preloadRouteForPathname(pathname) {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const routeComponent = ROUTE_PRELOADERS.get(normalizedPath);

  return routeComponent?.preload?.() ?? Promise.resolve();
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
      {isCommandPaletteOpen ? (
        <Suspense fallback={null}>
          <CommandPalette
            open={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
          />
        </Suspense>
      ) : null}
      <Header onOpenSearch={() => setIsCommandPaletteOpen(true)} />
      <div className="flex-grow">
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
            <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
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
            <Route path="/blog/tfsa-contribution-room-canada-2026" element={<TFSAContributionRoomCanada2026 />} />
            <Route path="/blog/rrsp-deadline-canada-2026" element={<RRSPDeadlineCanada2026 />} />
            <Route path="/blog/fhsa-rules-canada-2026" element={<FHSARulesCanada2026 />} />
            <Route path="/blog/tfsa-vs-rrsp-vs-fhsa-canada" element={<TFSAvsRRSPvsFHSACanada />} />
            <Route path="/blog/best-canadian-dividend-etfs-2026" element={<BestCanadianDividendETFs2026 />} />
            <Route path="/blog/dividend-reinvestment-plans-canada" element={<DividendReinvestmentPlansCanada />} />
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
      </div>
      <Footer />
    </div>
  );
}
