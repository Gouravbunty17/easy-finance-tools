import test from "node:test";
import assert from "node:assert/strict";
import {generateSitemapXml} from "../scripts/generate-sitemap.mjs";
test("Sitemap lists canonical indexable URLs without fake deployment dates",()=>{
  const xml=generateSitemapXml([{route:"/"},{route:"/tools/tfsa-calculator"},{route:"/tools/tfsa-calculator"}],"https://easyfinancetools.com");
  assert.equal((xml.match(/<url>/g)||[]).length,2);
  assert.match(xml,/<loc>https:\/\/easyfinancetools\.com\/tools\/tfsa-calculator<\/loc>/);
  assert.doesNotMatch(xml,/<lastmod>|<priority>|<changefreq>/);
  assert.throws(()=>generateSitemapXml([{route:"/../../admin"}]),/Invalid/);
});
