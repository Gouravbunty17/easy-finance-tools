import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const src = path => readFileSync(new URL("../" + path, import.meta.url),"utf8");
test("Mortgage and FHSA pages preserve calculations and add one-time anonymous interaction milestones",()=>{
  const mortgage=src("src/pages/tools/MortgageCalculator.jsx");
  const fhsa=src("src/pages/tools/FHSACalculator.jsx");
  assert.match(mortgage,/useCalculatorEngagement\('mortgage_calculator'/);
  assert.match(fhsa,/useCalculatorEngagement\('fhsa_calculator'/);
  assert.match(mortgage,/getMortgagePayment\(/);
  assert.match(fhsa,/calculateFhsaScenario\(/);
  assert.match(fhsa,/id="fhsa-quick-results"/);
  assert.ok(fhsa.indexOf('label="Planned annual contribution"')<fhsa.indexOf('label="Annual income"'));
});
test("The analytics hook emits category-only milestones, never income, balances or mortgage inputs",()=>{
  const hook=src("src/hooks/useCalculatorEngagement.js");
  assert.match(hook,/trackToolStart\(toolName, \{ entry_point:/);
  assert.match(hook,/trackToolCalculate\(toolName, \{ action:/);
  assert.doesNotMatch(hook,/trackTool(Start|Calculate)\([^;]*inputValues/);
  assert.doesNotMatch(hook,/localStorage|fetch\(|sendBeacon|console\./);
  assert.match(src("src/lib/analyticsSafety.mjs"),/ALLOWED_FIELDS/);
});
test("FHSA comparison and guide preserve unique canonical routes and direct calculator entry",()=>{
  const guide=src("src/pages/blog/fhsa-calculator-canada-2026.jsx");
  const comparison=src("src/pages/blog/tfsa-vs-rrsp-vs-fhsa-canada.jsx");
  const template=src("src/pages/blog/CanadianEducationArticle.jsx");
  assert.match(guide,/canonical="https:\/\/easyfinancetools.com\/blog\/fhsa-calculator-canada-2026"/);
  assert.match(guide,/ctaLabel="fhsa_guide_primary_calculator"/);
  assert.match(comparison,/heading: "FHSA versus RRSP for a down payment"/);
  assert.match(comparison,/quickTools:/);
  assert.match(template,/article\.quickTools\?\.length/);
});
