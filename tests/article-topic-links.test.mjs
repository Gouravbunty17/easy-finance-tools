import test from 'node:test';
import assert from 'node:assert/strict';
import {articleTopicLink} from '../src/lib/articleTopicLink.mjs';
test('Article categories link to existing topic hubs',()=>{
  assert.equal(articleTopicLink('TFSA | Investing')?.href,'/topics/tfsa');
  assert.equal(articleTopicLink('FHSA | First Home')?.href,'/topics/fhsa');
  assert.equal(articleTopicLink('Mortgage | Housing')?.href,'/topics/mortgages');
  assert.equal(articleTopicLink('Dividend Investing')?.href,'/topics/dividends');
  assert.equal(articleTopicLink('CPP and OAS')?.href,'/topics/retirement');
  assert.equal(articleTopicLink('Tax | Income'),null);
});
