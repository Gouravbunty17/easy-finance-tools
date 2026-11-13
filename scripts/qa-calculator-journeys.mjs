import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import puppeteer from "puppeteer-core";

const DIST = path.resolve(process.cwd(), "dist");
const HOST = "127.0.0.1", PORT = 4189;
const BASE = "http://" + HOST + ":" + PORT;
const OUT = path.resolve(process.cwd(), "reports/browser-qa");
const TYPES = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".png":"image/png",".svg":"image/svg+xml",".webp":"image/webp",".woff2":"font/woff2"};
const CASES = [
  {slug:"tfsa",path:"/tools/tfsa-calculator",input:"#tfsa-planned-annual-contribution",value:"1500",result:"#tfsa-quick-results",advanced:"More tax-context options",advancedField:"#tfsa-province"},
  {slug:"rrsp",path:"/tools/rrsp-calculator",input:"#rrsp-planned-annual-contribution",value:"1500",result:"#rrsp-quick-results",advanced:"Retirement projections",advancedField:"#rrsp-current-rrsp-balance"},
  {slug:"mortgage",path:"/tools/mortgage-calculator",input:"#mortgage-home-price",value:"450000",result:"#mortgage-quick-results",advanced:"More payment options",advancedField:"#mortgage-payment-frequency"},
  {slug:"income-tax",path:"/tools/income-tax-calculator",input:'input[type="number"]',value:"112000",result:"#income-tax-quick-results"}
];
async function sendFile(req,res) {
  try {
    const url = new URL(req.url || "/", BASE);
    const requested = decodeURIComponent(url.pathname);
    const absolute = path.resolve(DIST, "." + requested);
    if (!absolute.startsWith(DIST + path.sep) && absolute !== DIST) {res.writeHead(403);res.end();return;}
    let file = absolute;
    try {if ((await fs.stat(file)).isDirectory()) file=path.join(file,"index.html");}
    catch {file=path.join(DIST,"index.html");}
    const body=await fs.readFile(file);
    res.writeHead(200,{"content-type":TYPES[path.extname(file)]||"application/octet-stream"});
    res.end(body);
  } catch(err) {res.writeHead(500);res.end(err.message);}
}
function chromePath(){
  for(const candidate of [process.env.CHROME_PATH,"/usr/bin/google-chrome","/usr/bin/chromium","/usr/bin/chromium-browser"].filter(Boolean)){
    if(fsSync.existsSync(candidate))return candidate;
  }
  throw new Error("Chrome not found; supply CHROME_PATH.");
}
async function fill(page,selector,value){
  await page.click(selector,{clickCount:3});
  await page.keyboard.press("Backspace");
  const state=await page.evaluate(sel=>({
    url:location.pathname,exists:Boolean(document.querySelector(sel)),
    focused:document.activeElement?.id||document.activeElement?.tagName||"none",
    root:document.querySelector("#root")?.textContent?.slice(0,180)||"",
  }),selector);
  if(!state.exists)throw new Error("Input disappeared after clearing: "+selector+"; "+JSON.stringify(state));
  await page.keyboard.type(value,{delay:15});
  await page.$eval(selector,el=>el.blur());
}
async function visit(browser,scenario,device){
  const page=await browser.newPage();
  const issues=[];
  page.on("pageerror",error=>issues.push(error.message));
  try {
    const mobile=device==="mobile";
    await page.setViewport({width:mobile?390:1280,height:mobile?844:850,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
    await page.setRequestInterception(true);
    page.on("request",req=>{
      if(req.url().startsWith(BASE) || req.url().startsWith("data:") || req.url().startsWith("blob:"))req.continue();
      else req.abort();
    });
    await page.evaluateOnNewDocument(()=>{window.__EFT_PRERENDERING__=true;localStorage.setItem("theme","light");});
    await page.goto(BASE+scenario.path,{waitUntil:"domcontentloaded",timeout:30000});
    await page.waitForSelector(scenario.result,{timeout:30000});
    await page.waitForSelector(scenario.input,{timeout:15000});
    await new Promise(resolve=>setTimeout(resolve,500));
    const before=await page.$eval(scenario.result,el=>el.textContent);
    const metrics=await page.evaluate((input,result)=>{
      const a=document.querySelector(input)?.getBoundingClientRect();
      const b=document.querySelector(result)?.getBoundingClientRect();
      return {inputTop:a?.top,resultLeft:b?.left,inputLeft:a?.left,overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth)};
    },scenario.input,scenario.result);
    await page.screenshot({path:path.join(OUT,scenario.slug+"-"+device+"-initial.png"),captureBeyondViewport:false});
    if(metrics.overflow>8)throw new Error("Horizontal overflow: "+metrics.overflow+"px");
    if(mobile && metrics.inputTop>1100)throw new Error("First input buried below mobile viewport: "+metrics.inputTop+"px");
    if(!mobile && metrics.resultLeft <= metrics.inputLeft)throw new Error("Desktop result panel should be to the right of input panel");
    if(scenario.advanced){
      const summary=await page.$$("summary");
      let selected=null;
      for(const element of summary){
        const txt=await page.evaluate(el=>el.textContent,element);
        if(txt.includes(scenario.advanced)){selected=element;break;}
      }
      if(!selected)throw new Error("Advanced options missing");
      await selected.click();
      const visible=await page.$eval(scenario.advancedField,el=>el.getBoundingClientRect().height>0);
      if(!visible)throw new Error("Advanced option did not open");
    }
    try {await fill(page,scenario.input,scenario.value);}
    catch(err){throw new Error(err.message+"; uncaught errors: "+issues.join(" | "));}
    await page.waitForFunction((selector,prev)=>{
      const el=document.querySelector(selector);return Boolean(el&&el.textContent!==prev);
    },{timeout:10000},scenario.result,before);
    await page.screenshot({path:path.join(OUT,scenario.slug+"-"+device+".png"),captureBeyondViewport:false});
    if(issues.length)throw new Error("Uncaught browser errors: "+issues.slice(0,3).join("; "));
    console.log("PASS "+scenario.slug+" "+device+": editable input, live results, advanced options, no horizontal overflow");
  } finally {await page.close();}
}
async function main(){
  await fs.mkdir(OUT,{recursive:true});
  const server=createServer(sendFile);
  await new Promise((resolve,reject)=>{server.once("error",reject);server.listen(PORT,HOST,resolve);});
  let browser;
  try {
    browser=await puppeteer.launch({executablePath:chromePath(),args:["--no-sandbox","--disable-setuid-sandbox"],headless:true});
    for(const scenario of CASES){
      await visit(browser,scenario,"mobile");
      await visit(browser,scenario,"desktop");
    }
    console.log("PASS: eight browser checks; screenshots saved for CI artifact.");
  } finally {
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(err=>{console.error(err);process.exitCode=1;});
