import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {LOCALE_PAIRS,getLanguageAlternates,getLanguageSwitchPath,isFrenchRoute} from "../src/config/localizedRoutes.mjs";
const source=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("only existing translated routes have reciprocal hreflang and exact language switches",()=>{
 assert.equal(LOCALE_PAIRS.length,3);
 for(const [en,fr] of LOCALE_PAIRS){
  assert.deepEqual(getLanguageAlternates(en),getLanguageAlternates(fr));
  assert.equal(getLanguageSwitchPath(en),fr);
  assert.equal(getLanguageSwitchPath(fr),en);
  assert.equal(getLanguageAlternates(en).length,2);
 }
 assert.deepEqual(getLanguageAlternates("/tools/rrsp-calculator"),[]);
 assert.equal(getLanguageSwitchPath("/tools/rrsp-calculator"),"/fr");
 assert.equal(isFrenchRoute("/fr/outils"),true);
 assert.equal(isFrenchRoute("/tools"),false);
});
test("French routes are included in React routing and prerender route inventory",()=>{
 const app=source("src/App.jsx");
 const routes=source("scripts/site-routes.mjs");
 for(const p of ["/fr","/fr/outils","/fr/outils/calculateur-hypothecaire"]){
  assert.ok(app.includes("['"+p+"',"));
  assert.ok(routes.includes('route: "'+p+'"'));
 }
 const seo=source("src/components/SEO.jsx");
 assert.match(seo,/document\.documentElement\.lang = french \? "fr-CA" : "en-CA"/);
 assert.match(seo,/getLanguageAlternates\(normalizedPath\)/);
 assert.match(seo,/og:locale/);
});
test("French mortgage tool reuses Canadian payment mathematics and warns about limitations",()=>{
 const page=source("src/pages/fr/FrenchMortgageCalculator.jsx");
 for(const fn of ["getMortgagePayment","getMortgageStressTestRate","getCmhcPremium","getMortgageMinimumDownPayment"]) assert.ok(page.includes(fn));
 assert.match(page,/id="fr-home-price"/);
 assert.match(page,/id="fr-mortgage-results"/);
 assert.match(page,/role="alert"/);
 assert.match(page,/Québec/);
});
test("Partial rollout identifies English-only tools explicitly rather than pretending all tools are translated",()=>{
 assert.match(source("src/pages/fr/FrenchHome.jsx"),/anglais/);
 assert.match(source("src/pages/fr/FrenchTools.jsx"),/anglais/);
 assert.match(source("src/components/Header.jsx"),/getLanguageSwitchPath/);
 assert.match(source("src/components/Footer.jsx"),/isFrenchRoute/);
});
