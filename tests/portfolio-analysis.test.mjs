import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_PORTFOLIO, analyzePortfolio, parsePortfolioCsv, validatePortfolioHoldings} from '../src/lib/portfolioAnalysis.mjs';
test('Demo portfolio reports real mathematical allocations from explicitly illustrative data', () => {
  const p = analyzePortfolio(DEMO_PORTFOLIO);
  assert.equal(p.errors.length, 0);
  assert.equal(p.count, 5);
  assert.equal(p.account.reduce((sum,v)=>sum+v.value,0),p.totalValueCad);
  assert.equal(p.currency.reduce((sum,v)=>sum+v.value,0),p.totalValueCad);
  assert.ok(p.top5Pct <= 100.00001);
  assert.ok(p.flaggedUsInTfsa.some(h=>h.ticker==='AAPL'));
});
test('CSV imports quoted values, quotes and CRLF, requires confirmation by caller', () => {
  const csv='ticker,shares,price,currency,cadPerUnit,account,sector,region,assetType,annualDistributionPerShare,costBasisCad,specifiedForeignProperty\r\n"AAPL",2,200,USD,1.4,TFSA,"Information Technology","United States",Stock,1.2,560,no\r\n';
  const p=parsePortfolioCsv(csv);
  assert.equal(p.length,1);
  assert.equal(p[0].account,"TFSA");
  assert.equal(analyzePortfolio(p).totalValueCad,560);
  assert.throws(()=>parsePortfolioCsv('ticker,shares\nAAPL,2'),/Missing required/);
  assert.throws(()=>parsePortfolioCsv('ticker,shares,price,currency,cadPerUnit,account\n"AAPL,2,200,USD,1,TFSA'),/Unclosed/);
});
test('Rejects missing FX rate, negative units and invalid sector', () => {
 const bad={ticker:'ABC',shares:1,price:15,currency:'USD',cadPerUnit:'',account:'TFSA',sector:'Unknown / diversified',region:'Unknown / mixed',assetType:'Stock'};
 assert.ok(validatePortfolioHoldings([bad]).errors.length);
 assert.ok(validatePortfolioHoldings([{...bad,cadPerUnit:1.4,shares:-1}]).errors.length);
 assert.ok(validatePortfolioHoldings([{...bad,cadPerUnit:1.4,sector:'invented'}]).errors.length);
});
test('Taxable specified foreign property uses cost basis, not market value; unknown costs disclosed', () => {
 const h={ticker:'US',shares:10,price:20000,currency:'USD',cadPerUnit:1.3,account:'Taxable',sector:'Financials',region:'United States',assetType:'Stock',costBasisCad:90000,specifiedForeignProperty:true};
 const p=analyzePortfolio([h]);assert.equal(p.foreignTaxableKnownCost,90000);
 assert.equal(p.foreignCostIncomplete,false);
 assert.equal(analyzePortfolio([{...h,costBasisCad:''}]).foreignCostIncomplete,true);
});
