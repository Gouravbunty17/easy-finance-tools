// Canada 2026 CPP and OAS rate card, Oct-Dec 2026:
// https://www.canada.ca/en/employment-social-development/programs/pensions/pension/statistics/2026-quarterly-october-december.html
// 2026 OAS recovery threshold: https://www.canada.ca/en/services/benefits/publicpensions/old-age-security/recovery-tax.html
export const MAX_CPP_65 = 1507.65;
export const YMPE_2026 = 74600;
export const YAMPE_2026 = 85000;
export const OAS_MONTHLY_65 = 762.5;
export const OAS_CLAWBACK_MIN = 95323;
const round2 = n => Math.round(n * 100) / 100;
export function estimateCPP(yearsContributed, avgIncome, startAge) {
  // Rough proxy only; actual CPP depends on lifetime earnings and enhancement.
  // Official maximum already includes CPP enhancements; do not double-count CPP2.
  const yearsShare = Math.min(1, Math.max(0, yearsContributed) / 39);
  const incomeShare = Math.min(1, Math.max(0, avgIncome) / YMPE_2026);
  const totalAt65 = Math.round(MAX_CPP_65 * yearsShare * incomeShare);
  const months = (startAge - 65) * 12;
  const factor = months < 0 ? 1 + months * 0.006 : 1 + months * 0.007;
  return { baseCPP: totalAt65, cpp2: 0, totalAt65, adjusted: Math.max(0, Math.round(totalAt65 * factor)) };
}
export function estimateOAS(yearsInCanada, startAge) {
  // Assumes resident in Canada; eligibility rules differ if living abroad.
  const years = Math.max(0, yearsInCanada);
  const share = years < 10 ? 0 : Math.min(1, years / 40);
  const baseOAS = round2(OAS_MONTHLY_65 * share);
  const months = Math.max(0, Math.min(60, (startAge - 65) * 12));
  return { baseOAS, adjusted: round2(baseOAS * (1 + months * 0.006)) };
}
export function oasClawback(netWorldIncome, oasMonthly) {
  const annualOAS = Math.max(0, oasMonthly) * 12;
  const recovery = Math.min(annualOAS, Math.max(0, netWorldIncome - OAS_CLAWBACK_MIN) * 0.15);
  return { clawback: round2(recovery / 12), netOAS: round2((annualOAS - recovery) / 12) };
}
