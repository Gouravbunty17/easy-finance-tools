import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
test("WebSite schema does not advertise unsupported nonfunctional search route",()=>{
  const html=fs.readFileSync(new URL("../index.html", import.meta.url),"utf8");
  assert.match(html,/"@type": "WebSite"/);
  assert.doesNotMatch(html,/"@type": "SearchAction"/);
  const fragments=[...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)<\/script>/g)];
  assert.ok(fragments.length >= 3);
  fragments.forEach(([,json])=>assert.doesNotThrow(()=>JSON.parse(json)));
});
