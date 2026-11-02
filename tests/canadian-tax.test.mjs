import test from 'node:test';
import assert from 'node:assert/strict';
import { CAPITAL_GAINS_INCLUSION_RATE, estimateCapitalGainsTax } from '../src/lib/canadianTaxMath.mjs';
test('CRA 2026: all gains use the 50% inclusion rate, including those over $250k', () => {
  assert.equal(CAPITAL_GAINS_INCLUSION_RATE, 0.5);
  for (const gain of [1000, 250000, 250001, 450000, 1000000]) {
    const result = estimateCapitalGainsTax(gain, 0.3);
    assert.equal(result.taxableGain, Math.round(gain * 0.5));
    assert.equal(result.taxOwed, Math.round(gain * 0.5 * 0.3));
  }
});
test('Losses and invalid inputs do not generate capital-gains tax', () => {
  assert.equal(estimateCapitalGainsTax(-1000, 0.3).taxOwed, 0);
  assert.equal(estimateCapitalGainsTax(NaN, 0.3).taxableGain, 0);
  assert.equal(estimateCapitalGainsTax(1000, -0.5).taxOwed, 0);
});
