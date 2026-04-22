export const FINANCIAL_YEAR = 2026;
export const CONTENT_LAST_REVIEWED = 'April 22, 2026';
export const DATA_SNAPSHOT_LABEL = 'Illustrative planning snapshot for April 2026';

export const REGISTERED_ACCOUNT_LIMITS = {
  fhsaAnnualLimit: 8000,
  fhsaLifetimeLimit: 40000,
  fhsaMaxCarryforward: 8000,
  tfsaAnnualLimit: 7000,
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
