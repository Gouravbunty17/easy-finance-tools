export const FINANCIAL_YEAR = 2026;
export const CONTENT_LAST_REVIEWED = 'April 22, 2026';
export const DATA_SNAPSHOT_LABEL = 'Illustrative planning snapshot for April 2026';

export const REGISTERED_ACCOUNT_LIMITS = {
  fhsaAnnualLimit: 8000,
  fhsaLifetimeLimit: 40000,
  fhsaMaxCarryforward: 8000,
  tfsaAnnualLimit: 7000,
  rrspMaxContribution2026: 33810,
};

export const DEFAULT_ASSUMPTIONS = {
  fhsa: {
    income: 85000,
    province: 'ON',
    contributedToDate: 8000,
    availableRoomNow: 8000,
    currentBalance: 8300,
    annualContribution: 8000,
    expectedReturn: 5.5,
    yearsToPurchase: 5,
    birthYear: 1995,
  },
  etfIncome: {
    selectedEtfId: 'vdy',
    investmentAmount: 25000,
    customYield: 4.5,
    customDividendGrowth: 3.0,
    customPriceGrowth: 4.0,
    years: 15,
    additionalMonthly: 250,
    dripEnabled: true,
    useTfsa: true,
    marginalTaxRate: 30,
  },
  tfsa: {
    birthYear: 1992,
    residencyYear: 2010,
    province: 'ON',
    taxableIncome: 85000,
    currentBalance: 25000,
    lifetimeContributions: 40000,
    restoredWithdrawals: 5000,
    annualContribution: 7000,
    expectedReturn: 6.0,
    years: 15,
  },
  rrsp: {
    province: 'ON',
    taxableIncome: 95000,
    availableRoomNow: 17000,
    annualContribution: 12000,
    currentBalance: 35000,
    expectedReturn: 6.5,
    yearsToRetirement: 25,
    retirementIncome: 45000,
    spouseIncome: 35000,
    useSpousalComparison: true,
    reinvestRefund: true,
  },
  mortgage: {
    homePrice: 650000,
    downPayment: 130000,
    rate: 5.1,
    amortization: 25,
    frequency: 'monthly',
    province: 'ON',
    extraMonthlyPayment: 0,
  },
  mortgageAffordability: {
    householdIncome: 145000,
    downPayment: 120000,
    monthlyDebtPayments: 600,
    interestRate: 4.89,
    amortization: 25,
    province: 'ON',
    propertyTaxMonthly: 450,
    heatingMonthly: 150,
    condoFeesMonthly: 0,
  },
  rentVsBuy: {
    homePrice: 650000,
    downPayment: 130000,
    mortgageRate: 5.1,
    amortization: 25,
    monthlyRent: 2500,
    rentIncrease: 3,
    homeAppreciation: 4,
    investReturn: 6.5,
    propertyTax: 5000,
    maintenance: 300,
    condoFees: 0,
    province: 'ON',
    years: 10,
    sellingCostRate: 4.5,
  },
  gic: {
    principal: 10000,
    rate: 3.75,
    term: 2,
    frequency: 2,
    accountType: 'tfsa',
    marginalTaxRate: 30,
    inflationRate: 2.2,
  },
};

export const CANADIAN_PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
];

export const TFSA_ANNUAL_LIMITS = {
  2009: 5000,
  2010: 5000,
  2011: 5000,
  2012: 5000,
  2013: 5500,
  2014: 5500,
  2015: 10000,
  2016: 5500,
  2017: 5500,
  2018: 5500,
  2019: 6000,
  2020: 6000,
  2021: 6000,
  2022: 6000,
  2023: 6500,
  2024: 7000,
  2025: 7000,
  2026: 7000,
};

export const RRSP_RULES = {
  annualEarnedIncomeRate: 0.18,
  maxContribution2026: 33810,
  deductionDeadlineLabel: 'March 2, 2026',
};

export const GIC_COMPOUNDING_OPTIONS = [
  { label: 'Annually', value: 1 },
  { label: 'Semi-Annually', value: 2 },
  { label: 'Quarterly', value: 4 },
  { label: 'Monthly', value: 12 },
];

export const GIC_SAMPLE_PRODUCTS = [
  { id: 'eq-1yr', label: 'EQ 1-year', issuer: 'EQ Bank', rate: 3.75, term: 1, frequency: 2, notes: 'Short-term parking for a near-term goal.' },
  { id: 'oaken-2yr', label: 'Oaken 2-year', issuer: 'Oaken Financial', rate: 4.1, term: 2, frequency: 2, notes: 'Useful when you want more yield without a very long lock-up.' },
  { id: 'steinbach-3yr', label: 'Steinbach 3-year', issuer: 'Steinbach Credit Union', rate: 4.25, term: 3, frequency: 2, notes: 'Example of a longer term that can reward patience.' },
  { id: 'big-bank-1yr', label: 'Big bank 1-year', issuer: 'Illustrative major bank', rate: 2.5, term: 1, frequency: 2, notes: 'Helpful reminder that convenience and rate are often a tradeoff.' },
];

export const HOUSING_PROVINCE_DETAILS = {
  AB: { label: 'Alberta' },
  BC: { label: 'British Columbia' },
  MB: { label: 'Manitoba' },
  NB: { label: 'New Brunswick' },
  NL: { label: 'Newfoundland and Labrador' },
  NS: { label: 'Nova Scotia' },
  NT: { label: 'Northwest Territories' },
  NU: { label: 'Nunavut' },
  ON: { label: 'Ontario' },
  PE: { label: 'Prince Edward Island' },
  QC: { label: 'Quebec' },
  SK: { label: 'Saskatchewan' },
  YT: { label: 'Yukon' },
};

export const MORTGAGE_INSURANCE_PREMIUMS = [
  { maxLoanToValue: 0.8, rate: 0 },
  { maxLoanToValue: 0.85, rate: 0.028 },
  { maxLoanToValue: 0.9, rate: 0.031 },
  { maxLoanToValue: 0.95, rate: 0.04 },
];

export const MORTGAGE_RULES = {
  minimumQualifyingRate: 5.25,
  stressBuffer: 2,
  defaultLegalAndTitleCost: 2500,
  defaultInspectionCost: 600,
  defaultSellingCostRate: 0.045,
  insuredAmortizationDefault: 25,
  uninsuredAmortizationDefault: 30,
};

export const RRIF_MINIMUM_RATES = {
  71: 5.28,
  72: 5.4,
  73: 5.53,
  74: 5.67,
  75: 5.82,
  76: 5.98,
  77: 6.17,
  78: 6.36,
  79: 6.58,
  80: 6.82,
  81: 7.08,
  82: 7.38,
  83: 7.71,
  84: 8.08,
  85: 8.51,
  86: 8.99,
  87: 9.55,
  88: 10.21,
  89: 10.99,
  90: 11.92,
  91: 13.06,
  92: 14.49,
  93: 16.34,
  94: 18.79,
  95: 20,
};

export const FHSA_TAX_BRACKETS = {
  AB: [
    [0, 57375, 0.25],
    [57375, 114750, 0.305],
    [114750, 177922, 0.36],
    [177922, 253414, 0.44],
    [253414, Infinity, 0.48],
  ],
  BC: [
    [0, 45654, 0.2006],
    [45654, 91310, 0.287],
    [91310, 104835, 0.31],
    [104835, 127299, 0.387],
    [127299, 172602, 0.437],
    [172602, 240716, 0.462],
    [240716, Infinity, 0.535],
  ],
  MB: [
    [0, 36842, 0.258],
    [36842, 79625, 0.379],
    [79625, Infinity, 0.504],
  ],
  NB: [
    [0, 47715, 0.2716],
    [47715, 95431, 0.3752],
    [95431, 176756, 0.4684],
    [176756, Infinity, 0.533],
  ],
  NL: [
    [0, 43198, 0.237],
    [43198, 86395, 0.3395],
    [86395, 154244, 0.445],
    [154244, Infinity, 0.513],
  ],
  NS: [
    [0, 29590, 0.2379],
    [29590, 59180, 0.3717],
    [59180, 93000, 0.435],
    [93000, 150000, 0.5],
    [150000, Infinity, 0.54],
  ],
  NT: [
    [0, 50597, 0.209],
    [50597, 101198, 0.306],
    [101198, 164525, 0.39],
    [164525, Infinity, 0.47],
  ],
  NU: [
    [0, 53268, 0.19],
    [53268, 106537, 0.28],
    [106537, 173205, 0.35],
    [173205, Infinity, 0.45],
  ],
  ON: [
    [0, 51446, 0.2005],
    [51446, 102894, 0.2965],
    [102894, 150000, 0.3389],
    [150000, 220000, 0.4341],
    [220000, Infinity, 0.5353],
  ],
  PE: [
    [0, 32656, 0.248],
    [32656, 64313, 0.373],
    [64313, 105000, 0.42],
    [105000, Infinity, 0.4737],
  ],
  QC: [
    [0, 51780, 0.2753],
    [51780, 103545, 0.3712],
    [103545, 126000, 0.4571],
    [126000, Infinity, 0.5331],
  ],
  SK: [
    [0, 49720, 0.25],
    [49720, 142058, 0.33],
    [142058, Infinity, 0.47],
  ],
  YT: [
    [0, 55867, 0.214],
    [55867, 111733, 0.295],
    [111733, 154906, 0.369],
    [154906, 500000, 0.42],
    [500000, Infinity, 0.48],
  ],
};

export function getEstimatedMarginalTaxRate(province, income) {
  const brackets = FHSA_TAX_BRACKETS[province] || FHSA_TAX_BRACKETS.ON;
  const safeIncome = Number.isFinite(income) ? income : 0;

  for (const [low, high, rate] of brackets) {
    if (safeIncome >= low && safeIncome < high) {
      return rate;
    }
  }

  return 0.43;
}

export function getTfsaEligibleYear(birthYear, residencyYear) {
  return Math.max(2009, Number(birthYear || 0) + 18, Number(residencyYear || 0));
}

export function getTfsaAccruedRoom(eligibleYear, upToYear = FINANCIAL_YEAR) {
  let total = 0;

  for (let year = Number(eligibleYear || 0); year <= upToYear; year += 1) {
    total += TFSA_ANNUAL_LIMITS[year] || 0;
  }

  return total;
}

export function getRrspAnnualLimit(earnedIncome) {
  return Math.min(
    Number(earnedIncome || 0) * RRSP_RULES.annualEarnedIncomeRate,
    RRSP_RULES.maxContribution2026
  );
}

export function getCanadianMonthlyRate(annualRate) {
  return Math.pow(1 + Number(annualRate || 0) / 200, 1 / 6) - 1;
}

export function getMortgagePayment(principal, annualRate, months) {
  const safePrincipal = Number(principal || 0);
  const safeMonths = Math.max(1, Number(months || 1));
  const monthlyRate = getCanadianMonthlyRate(annualRate);

  if (monthlyRate === 0) {
    return safePrincipal / safeMonths;
  }

  return (
    (safePrincipal * monthlyRate * Math.pow(1 + monthlyRate, safeMonths)) /
    (Math.pow(1 + monthlyRate, safeMonths) - 1)
  );
}

export function getMortgagePrincipalFromPayment(payment, annualRate, months) {
  const safePayment = Number(payment || 0);
  const safeMonths = Math.max(1, Number(months || 1));
  const monthlyRate = getCanadianMonthlyRate(annualRate);

  if (monthlyRate === 0) {
    return safePayment * safeMonths;
  }

  return (
    safePayment * (Math.pow(1 + monthlyRate, safeMonths) - 1) /
    (monthlyRate * Math.pow(1 + monthlyRate, safeMonths))
  );
}

export function getCmhcPremiumRate(loanToValue) {
  const safeLtv = Number(loanToValue || 0);
  const match = MORTGAGE_INSURANCE_PREMIUMS.find((item) => safeLtv <= item.maxLoanToValue);
  return match ? match.rate : MORTGAGE_INSURANCE_PREMIUMS[MORTGAGE_INSURANCE_PREMIUMS.length - 1].rate;
}

export function getCmhcPremium(principal, homePrice) {
  const safePrincipal = Number(principal || 0);
  const safeHomePrice = Math.max(1, Number(homePrice || 0));
  const loanToValue = safePrincipal / safeHomePrice;
  return safePrincipal * getCmhcPremiumRate(loanToValue);
}

export function getMortgageStressTestRate(contractRate) {
  return Math.max(
    Number(contractRate || 0) + MORTGAGE_RULES.stressBuffer,
    MORTGAGE_RULES.minimumQualifyingRate
  );
}

export function getLandTransferTax(homePrice, province) {
  const price = Number(homePrice || 0);
  const code = province || 'ON';

  if (code === 'ON') {
    if (price <= 55000) return price * 0.005;
    if (price <= 250000) return 275 + (price - 55000) * 0.01;
    if (price <= 400000) return 2225 + (price - 250000) * 0.015;
    if (price <= 2000000) return 4475 + (price - 400000) * 0.02;
    return 36475 + (price - 2000000) * 0.025;
  }

  if (code === 'BC') {
    if (price <= 200000) return price * 0.01;
    if (price <= 2000000) return 2000 + (price - 200000) * 0.02;
    return 38000 + (price - 2000000) * 0.03;
  }

  if (code === 'QC') {
    if (price <= 52800) return price * 0.005;
    if (price <= 264000) return 264 + (price - 52800) * 0.01;
    return 2376 + (price - 264000) * 0.015;
  }

  const flatRate = {
    AB: 0,
    MB: 0.015,
    NB: 0.01,
    NL: 0,
    NS: 0.015,
    NT: 0,
    NU: 0,
    PE: 0.01,
    SK: 0,
    YT: 0,
  };

  return price * (flatRate[code] || 0);
}

export function getMortgageMinimumDownPayment(homePrice) {
  const price = Number(homePrice || 0);

  if (price <= 500000) {
    return price * 0.05;
  }

  if (price < 1500000) {
    return 25000 + (price - 500000) * 0.1;
  }

  return price * 0.2;
}

export function getPaymentFrequencyDetails(frequency, monthlyPayment) {
  const safeMonthlyPayment = Number(monthlyPayment || 0);

  if (frequency === 'biweekly') {
    return {
      label: 'Bi-weekly payment',
      scheduledPayment: safeMonthlyPayment * 12 / 26,
      annualExtraEquivalent: 0,
    };
  }

  if (frequency === 'accelerated') {
    return {
      label: 'Accelerated bi-weekly payment',
      scheduledPayment: safeMonthlyPayment / 2,
      annualExtraEquivalent: safeMonthlyPayment,
    };
  }

  if (frequency === 'weekly') {
    return {
      label: 'Weekly payment',
      scheduledPayment: safeMonthlyPayment * 12 / 52,
      annualExtraEquivalent: 0,
    };
  }

  return {
    label: 'Monthly payment',
    scheduledPayment: safeMonthlyPayment,
    annualExtraEquivalent: 0,
  };
}

export function getGicMaturityValue(principal, rate, years, frequency) {
  const safePrincipal = Number(principal || 0);
  const safeYears = Math.max(0, Number(years || 0));
  const safeFrequency = Math.max(1, Number(frequency || 1));
  const periodicRate = Number(rate || 0) / 100 / safeFrequency;
  const periods = safeFrequency * safeYears;
  return safePrincipal * Math.pow(1 + periodicRate, periods);
}

export const DIVIDEND_ETF_DATA = [
  {
    id: 'xei',
    ticker: 'XEI',
    name: 'iShares Core S&P/TSX High Dividend Index ETF',
    focus: 'Canadian dividend core',
    yield: 4.8,
    mer: 0.22,
    dividendGrowth: 3.5,
    priceGrowth: 4.5,
    frequency: 'Monthly',
    notes: 'Broad Canadian dividend exposure with heavy weight in financials, energy, and utilities.',
    tfsaFit: 'Useful when the TFSA job is income and you can accept Canadian sector concentration.',
    riskFlag: 'Sector concentration can be high even when the yield looks stable.',
  },
  {
    id: 'vdy',
    ticker: 'VDY',
    name: 'Vanguard FTSE Canadian High Dividend Yield Index ETF',
    focus: 'Canadian dividend core',
    yield: 4.3,
    mer: 0.22,
    dividendGrowth: 4.0,
    priceGrowth: 5.0,
    frequency: 'Monthly',
    notes: 'Popular income ETF built around large Canadian dividend payers.',
    tfsaFit: 'A common TFSA income option if the account is not being used purely for growth.',
    riskFlag: 'Banks and pipelines can dominate the portfolio during some periods.',
  },
  {
    id: 'zdv',
    ticker: 'ZDV',
    name: 'BMO Canadian Dividend ETF',
    focus: 'Canadian dividend core',
    yield: 4.6,
    mer: 0.39,
    dividendGrowth: 3.5,
    priceGrowth: 4.5,
    frequency: 'Monthly',
    notes: 'Dividend-focused Canadian equity ETF with a straightforward income profile.',
    tfsaFit: 'Reasonable for investors who want monthly cash flow inside a TFSA.',
    riskFlag: 'Higher fee than plain-market ETFs, with similar sector concentration issues.',
  },
  {
    id: 'cdz',
    ticker: 'CDZ',
    name: 'iShares S&P/TSX Canadian Dividend Aristocrats Index ETF',
    focus: 'Dividend growth tilt',
    yield: 3.9,
    mer: 0.66,
    dividendGrowth: 4.5,
    priceGrowth: 5.0,
    frequency: 'Monthly',
    notes: 'Targets companies with a dividend-growth history rather than only the highest yield.',
    tfsaFit: 'Often fits investors who want dividend exposure without leaning fully into the highest-yield names.',
    riskFlag: 'The dividend-growth angle can still lag a plain broad-market ETF over long stretches.',
  },
  {
    id: 'hdiv',
    ticker: 'HDIV',
    name: 'Hamilton Enhanced Multi-Sector Covered Call ETF',
    focus: 'Higher-yield covered call income',
    yield: 9.0,
    mer: 0.65,
    dividendGrowth: 1.0,
    priceGrowth: 2.0,
    frequency: 'Monthly',
    notes: 'Illustrative higher-yield option that trades some upside for cash flow through covered calls.',
    tfsaFit: 'Only a fit when the account goal is cash flow and you understand the total-return tradeoff.',
    riskFlag: 'High yield does not mean higher long-term return; covered-call structure can cap upside.',
  },
  {
    id: 'custom',
    ticker: 'Custom',
    name: 'Custom yield assumption',
    focus: 'Scenario builder',
    yield: 4.5,
    mer: 0,
    dividendGrowth: 3.0,
    priceGrowth: 4.0,
    frequency: 'Custom',
    notes: 'Use this row when you want to test your own yield or dividend-growth assumption.',
    tfsaFit: 'Useful for planning against a custom ETF shortlist or a provider-specific idea.',
    riskFlag: 'Your output is only as realistic as the assumptions you enter.',
  },
];

export const DIVIDEND_INCOME_GOALS = [100, 500, 1000];

export function getDividendEtfById(id) {
  return DIVIDEND_ETF_DATA.find((item) => item.id === id) || DIVIDEND_ETF_DATA[0];
}
