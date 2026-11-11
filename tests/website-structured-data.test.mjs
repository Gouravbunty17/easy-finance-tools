import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
test("WebSite schema does not advertise unsupported nonfunctional search route",()=>{
  const html=fs.readFileSync(new URL("../index.html", import.meta.url),"utf8");
  assert.match(html,/"@type": "WebSite"/);
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
  const ogTitle=html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  const twitterTitle=html.match(/<meta name="twitter:title" content="([^"]+)"/)?.[1];
  assert.equal(title,ogTitle);
  assert.equal(title,twitterTitle);
  assert.doesNotMatch(html,/"@type": "SearchAction"/);
  // A single English-language site must not claim the homepage is the alternate of every calculator page.
  assert.doesNotMatch(html,/hreflang=/);
  const fragments=[...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)<\/script>/g)];
  assert.ok(fragments.length >= 3);
  fragments.forEach(([,json])=>assert.doesNotThrow(()=>JSON.parse(json)));
});
