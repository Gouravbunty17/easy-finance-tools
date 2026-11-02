// CRA: one-half capital-gains inclusion rate. March 2025: proposed increase cancelled.
// https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/sole-proprietorships-partnerships/report-business-income-expenses/claiming-capital-cost-allowance/personal-use-property.html
export const CAPITAL_GAINS_INCLUSION_RATE = 0.5;
export function estimateCapitalGainsTax(gain, marginalRate) {
  const safeGain = Number.isFinite(gain) ? Math.max(0, gain) : 0;
  const rate = Number.isFinite(marginalRate) ? Math.min(1, Math.max(0, marginalRate)) : 0;
  const taxableAmount = safeGain * CAPITAL_GAINS_INCLUSION_RATE;
  return { taxableGain: Math.round(taxableAmount), taxOwed: Math.round(taxableAmount * rate), inclusionRate: CAPITAL_GAINS_INCLUSION_RATE };
}
