import test from "node:test";
import assert from "node:assert/strict";
import {safePagePath,safeDestination,sanitizeEventParams} from "../src/lib/analyticsSafety.mjs";
test("Analytics never emits URL queries or fragments",()=>{
  assert.equal(safePagePath("/tools/rrsp-calculator?income=85000#private"),"/tools/rrsp-calculator");
  assert.equal(safeDestination("/tools/tfsa-calculator?ssn=secret#details"),"/tools/tfsa-calculator");
  assert.equal(safeDestination("https://www.example.org/referral?account=secret#token"),"external:www.example.org");
});
test("Analytics discards numeric inputs, holdings, email and unapproved metadata",()=>{
  const x=sanitizeEventParams({
    action:"calculate",tool_name:"income_tax_calculator",income:85000,
    holdings:"sensitive",email:"me@example.org",destination:"/tools/tfsa-calculator?amount=99000",
    page_location:"https://easyfinancetools.com/?salary=1234",
    page_path:"/unknown?private=yes",enabled:true,
    flow_step:"view_report"
  });
  assert.deepEqual(x,{action:"calculate",tool_name:"income_tax_calculator",destination:"/tools/tfsa-calculator",enabled:true,flow_step:"view_report"});
  assert.deepEqual(sanitizeEventParams({cta_label:"somebody@example.org",method:"csv"}),{method:"csv"});
  assert.equal(safePagePath("/user/jane@example.org"),"/");
});
