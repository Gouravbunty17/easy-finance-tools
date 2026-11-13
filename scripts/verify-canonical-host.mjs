import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

export const CANONICAL_HOST = "https://easyfinancetools.com";
export const REDIRECT_HOST = "www.easyfinancetools.com";

export function verifyRedirectConfig(config) {
  const rules = config.redirects || [];
  const find = source => rules.find(rule =>
    rule.source === source &&
    rule.permanent === true &&
    rule.has?.some(condition => condition.type === "host" && condition.value === REDIRECT_HOST)
  );
  const root = find("/");
  const rest = find("/(.*)");
  assert.ok(root && rest,"Missing permanent www→apex redirects for root and nested paths");
  assert.equal(root.destination,CANONICAL_HOST+"/");
  assert.equal(rest.destination,CANONICAL_HOST+"/$1");
  const ordered = rules.indexOf(rest);
  assert.ok(ordered >= 0 && rules.indexOf(root) < ordered,"Root host rule must precede path host rule");
  return true;
}

export async function verifyLiveRedirects(fetcher = fetch) {
  const paths=["/","/tools/mortgage-calculator","/tools/fhsa-calculator"];
  for(const pathname of paths) {
    const source = "https://"+REDIRECT_HOST+pathname;
    const expected = CANONICAL_HOST+pathname;
    const response=await fetcher(source,{
      method:"GET",redirect:"manual",
      signal:AbortSignal.timeout(12000),
      headers:{"User-Agent":"EasyFinanceTools-Canonical-Check/1.0"},
    });
    assert.ok([301,308].includes(response.status),source+" should issue a permanent redirect but returned "+response.status);
    const destination=new URL(response.headers.get("location"),source).href;
    assert.equal(destination,expected,"Incorrect www→apex destination for "+pathname);
    console.log("PASS permanent redirect "+source+" -> "+destination+" ("+response.status+")");
    if(pathname==="/tools/mortgage-calculator" || pathname==="/tools/fhsa-calculator") {
      const page=await fetcher(expected,{redirect:"follow",signal:AbortSignal.timeout(12000)});
      assert.equal(page.status,200,"Canonical page not served at "+expected);
      const html=await page.text();
      assert.ok(html.includes('rel="canonical"') && html.includes(expected),"Canonical tag must match final destination: "+expected);
      console.log("PASS canonical 200 and meta tag "+expected);
    }
  }
}
if(process.argv[1] && process.argv[1].endsWith("/verify-canonical-host.mjs")) {
  try {
    verifyRedirectConfig(JSON.parse(readFileSync(new URL("../vercel.json",import.meta.url),"utf8")));
    await verifyLiveRedirects();
  } catch(error) {
    console.error("CANONICAL VERIFICATION FAILED:",error.message);
    process.exitCode=1;
  }
}
