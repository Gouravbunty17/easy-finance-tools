import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { verifyRedirectConfig,verifyLiveRedirects,CANONICAL_HOST } from "../scripts/verify-canonical-host.mjs";
const config=JSON.parse(readFileSync(new URL("../vercel.json",import.meta.url),"utf8"));
test("Permanent host redirects cover www homepage and nested calculator URLs",()=>{
  assert.equal(verifyRedirectConfig(config),true);
});
test("Live host redirect validator rejects non-permanent redirects", async()=>{
  await assert.rejects(verifyLiveRedirects(async()=>({status:200,headers:{get:()=>null}})),/permanent redirect/);
});
test("Live host redirect validator detects canonical destination mismatches",async()=>{
  await assert.rejects(verifyLiveRedirects(async()=>({status:308,headers:{get:()=>"https://www.easyfinancetools.com/"}})),/Incorrect www/);
});
