import test from 'node:test';
import assert from 'node:assert/strict';
import {getTaxYearReference, getRrspDollarLimit, estimateEiPremium} from '../src/lib/taxYearReference.mjs';
test('Verified 2026/2027 CRA registered plans and CPP earnings limits', () => {
  assert.equal(getRrspDollarLimit(2026), 33810); assert.equal(getRrspDollarLimit(2027), 35390);
  assert.equal(getTaxYearReference(2027).ympe, 76700); assert.equal(getTaxYearReference(2027).yampe, 87400);
  assert.equal(getTaxYearReference(2027).tfsaAnnualLimit, null);
  assert.equal(getTaxYearReference(2027).fullTaxModelAvailable, false);
});
test('ESDC 2027 EI rates and earnings maximum are applied', () => {
  assert.equal(estimateEiPremium(200000, 2027), 1161.12);
  assert.equal(estimateEiPremium(200000, 2027, true), 913.32);
  assert.equal(estimateEiPremium(200000, 2026), 1123.07);
  assert.throws(() => getTaxYearReference(2028), /Unsupported/);
});
