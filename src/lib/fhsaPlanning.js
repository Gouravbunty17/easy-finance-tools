import {
  DEFAULT_ASSUMPTIONS,
  FINANCIAL_YEAR,
  REGISTERED_ACCOUNT_LIMITS,
  getEstimatedMarginalTaxRate,
} from '../config/financial';

export function formatFhsaCurrency(value, digits = 0) {
  return Number(value || 0).toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function buildFhsaInitialState(initialValues = {}) {
  return {
    birthYear: initialValues.birthYear ?? DEFAULT_ASSUMPTIONS.fhsa.birthYear,
    province: initialValues.province ?? DEFAULT_ASSUMPTIONS.fhsa.province,
    income: initialValues.income ?? DEFAULT_ASSUMPTIONS.fhsa.income,
    availableRoomNow: initialValues.availableRoomNow ?? DEFAULT_ASSUMPTIONS.fhsa.availableRoomNow,
    contributedToDate: initialValues.contributedToDate ?? DEFAULT_ASSUMPTIONS.fhsa.contributedToDate,
    currentBalance: initialValues.currentBalance ?? DEFAULT_ASSUMPTIONS.fhsa.currentBalance,
    annualContribution: initialValues.annualContribution ?? DEFAULT_ASSUMPTIONS.fhsa.annualContribution,
    expectedReturn: initialValues.expectedReturn ?? DEFAULT_ASSUMPTIONS.fhsa.expectedReturn,
    yearsToPurchase: initialValues.yearsToPurchase ?? DEFAULT_ASSUMPTIONS.fhsa.yearsToPurchase,
  };
}

export function calculateFhsaScenario(inputs) {
  const birthYear = Number(inputs.birthYear || 0);
  const province = inputs.province;
  const income = Number(inputs.income || 0);
  const availableRoomNow = Number(inputs.availableRoomNow || 0);
  const contributedToDate = Number(inputs.contributedToDate || 0);
  const currentBalance = Number(inputs.currentBalance || 0);
  const annualContribution = Math.max(0, Number(inputs.annualContribution || 0));
  const expectedReturn = Number(inputs.expectedReturn || 0);
  const yearsToPurchase = Math.max(1, Number(inputs.yearsToPurchase || 1));

  const age = FINANCIAL_YEAR - birthYear;
  const marginalRate = getEstimatedMarginalTaxRate(province, income);
  const lifetimeRemainingAtStart = Math.max(
    0,
    REGISTERED_ACCOUNT_LIMITS.fhsaLifetimeLimit - contributedToDate
  );
  const yearOneRoom = Math.max(
    0,
    Math.min(
      availableRoomNow,
      REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit + REGISTERED_ACCOUNT_LIMITS.fhsaMaxCarryforward,
      lifetimeRemainingAtStart
    )
  );
  const yearlyRate = expectedReturn / 100;

  let balance = Math.max(0, currentBalance);
  let totalFutureContributions = 0;
  let totalTaxSavings = 0;
  let carryforward = Math.max(0, yearOneRoom - Math.min(annualContribution, yearOneRoom));
  let lifetimeRemaining = lifetimeRemainingAtStart;

  const chartLabels = [];
  const chartValues = [];
  const yearlyBreakdown = [];

  for (let year = 1; year <= yearsToPurchase; year += 1) {
    const roomThisYear = year === 1
      ? yearOneRoom
      : Math.min(
          REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit + Math.min(carryforward, REGISTERED_ACCOUNT_LIMITS.fhsaMaxCarryforward),
          lifetimeRemaining
        );

    const contributionUsed = Math.min(annualContribution, roomThisYear, lifetimeRemaining);
    const contributionPerMonth = contributionUsed / 12;

    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + yearlyRate / 12) + contributionPerMonth;
    }

    totalFutureContributions += contributionUsed;
    totalTaxSavings += contributionUsed * marginalRate;
    lifetimeRemaining = Math.max(0, lifetimeRemaining - contributionUsed);
    carryforward = Math.min(REGISTERED_ACCOUNT_LIMITS.fhsaMaxCarryforward, Math.max(0, roomThisYear - contributionUsed));

    yearlyBreakdown.push({
      year,
      roomThisYear,
      contributionUsed,
      carryforwardNextYear: carryforward,
      balance,
      lifetimeRemaining,
    });
    chartLabels.push(`Year ${year}`);
    chartValues.push(Math.round(balance));
  }

  const contributionUsedYearOne = yearlyBreakdown[0]?.contributionUsed || 0;
  const projectedGrowth = Math.max(0, balance - currentBalance - totalFutureContributions);
  const effectiveContributionCost = totalFutureContributions - totalTaxSavings;
  const annualLimitUsage = contributionUsedYearOne / REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit;
  const roomUsage = contributionUsedYearOne / Math.max(yearOneRoom, 1);

  let interpretation = 'The FHSA looks directionally useful, but compare it against TFSA and RRSP options before acting.';
  if (age < 18 || age > 71) {
    interpretation = 'This scenario may fall outside the usual FHSA age rules, so confirm eligibility before relying on the tax savings or down-payment plan.';
  } else if (yearOneRoom === 0) {
    interpretation = 'This plan is room-constrained right now. Confirm your FHSA room with CRA before making the next contribution decision.';
  } else if (marginalRate >= 0.3 && yearsToPurchase <= 7) {
    interpretation = 'This is the classic strong FHSA setup: the deduction is meaningful today and the home-purchase window is still close enough for the tax-free withdrawal to matter.';
  } else if (yearsToPurchase >= 10) {
    interpretation = 'The FHSA can still help, but a long timeline increases the importance of comparing it against TFSA flexibility and your broader investing plan.';
  } else if (annualLimitUsage < 0.5) {
    interpretation = 'Your planned yearly contribution is modest relative to the annual limit. The account still helps, but the tax deduction may grow only gradually unless contributions increase.';
  }

  return {
    age,
    marginalRate,
    contributionUsedYearOne,
    annualLimitUsage,
    roomUsage,
    yearOneRoom,
    projectedBalance: Math.round(balance),
    projectedGrowth: Math.round(projectedGrowth),
    totalFutureContributions: Math.round(totalFutureContributions),
    totalTaxSavings: Math.round(totalTaxSavings),
    effectiveContributionCost: Math.round(effectiveContributionCost),
    lifetimeRemainingAtStart: Math.round(lifetimeRemainingAtStart),
    lifetimeRemainingAtEnd: Math.round(lifetimeRemaining),
    monthlyEquivalent: Math.round(annualContribution / 12),
    interpretation,
    chartLabels,
    chartValues,
    yearlyBreakdown,
    likelyAgeEligible: age >= 18 && age <= 71,
  };
}

export function getFhsaIncomeExample(province, income, contribution = REGISTERED_ACCOUNT_LIMITS.fhsaAnnualLimit) {
  const marginalRate = getEstimatedMarginalTaxRate(province, Number(income || 0));
  return {
    income,
    marginalRate,
    contribution,
    estimatedTaxSavings: Math.round(contribution * marginalRate),
  };
}
