// Published 2026/2027 CRA and ESDC reference figures; reviewed 2026-11-03.
// Full 2027 tax brackets and 2027 TFSA limit are NOT verified: do not substitute 2026 rates as 2027.
export const TAX_YEAR_REFERENCE = Object.freeze({
  2026: Object.freeze({ year: 2026, rrspDollarLimit: 33810, tfsaAnnualLimit: 7000, ympe: 74600, yampe: 85000, eiInsurableMax: 68900, eiRate: 0.0163, eiQuebecRate: 0.013, fullTaxModelAvailable: true }),
  2027: Object.freeze({ year: 2027, rrspDollarLimit: 35390, tfsaAnnualLimit: null, ympe: 76700, yampe: 87400, eiInsurableMax: 70800, eiRate: 0.0164, eiQuebecRate: 0.0129, fullTaxModelAvailable: false }),
});
export function getTaxYearReference(year) {
  if (!Object.hasOwn(TAX_YEAR_REFERENCE, year)) throw new Error('Unsupported tax year');
  return TAX_YEAR_REFERENCE[year];
}
export function getRrspDollarLimit(year) { return getTaxYearReference(year).rrspDollarLimit; }
export function estimateEiPremium(earnings, year, isQuebec = false) {
  const rules = getTaxYearReference(year);
  return Math.round(Math.min(Math.max(0, earnings), rules.eiInsurableMax) * (isQuebec ? rules.eiQuebecRate : rules.eiRate) * 100) / 100;
}
