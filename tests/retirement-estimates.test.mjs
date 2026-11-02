import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_CPP_65, YMPE_2026, YAMPE_2026, OAS_MONTHLY_65, OAS_CLAWBACK_MIN, estimateCPP, estimateOAS, oasClawback } from '../src/lib/retirementEstimates.mjs';
test('2026 Government of Canada CPP/OAS limits', () => {
  assert.equal(MAX_CPP_65, 1507.65); assert.equal(YMPE_2026, 74600);
  assert.equal(YAMPE_2026, 85000); assert.equal(OAS_MONTHLY_65, 762.5); assert.equal(OAS_CLAWBACK_MIN, 95323);
});
test('CPP rough estimate: no enhancement double-counting and age adjustments', () => {
  assert.equal(estimateCPP(39, 85000, 65).totalAt65, 1508);
  assert.equal(estimateCPP(0, 85000, 65).adjusted, 0);
  assert.equal(estimateCPP(39, 85000, 60).adjusted, Math.round(1508 * 0.64));
  assert.equal(estimateCPP(39, 85000, 70).adjusted, Math.round(1508 * 1.42));
});
test('OAS residency, deferral and full recovery', () => {
  assert.equal(estimateOAS(5, 65).adjusted, 0);
  assert.equal(estimateOAS(40, 65).adjusted, 762.5);
  assert.equal(estimateOAS(40, 70).adjusted, 1037);
  assert.equal(oasClawback(95323, 762.5).clawback, 0);
  assert.equal(oasClawback(107323, 762.5).clawback, 150);
  assert.equal(oasClawback(1000000, 762.5).netOAS, 0);
});
