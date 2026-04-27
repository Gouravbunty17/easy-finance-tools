import { chromium } from 'playwright';

const url = 'https://easyfinancetools.com/blog/tfsa-vs-rrsp-canada-2026?ez_js_debugger=1';
const ezoicHosts = ['ezojs.com', 'ezoic', 'ezoicanalytics.com', 'gatekeeperconsent.com'];

const requests = [];
const consoleMessages = [];

const launchOptions = { headless: true };
const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const edgePath64 = 'C:/Program Files/Microsoft/Edge/Application/msedge.exe';
if (await import('node:fs/promises').then(fs => fs.access(edgePath).then(() => true).catch(() => false))) {
  launchOptions.channel = 'msedge';
} else if (await import('node:fs/promises').then(fs => fs.access(edgePath64).then(() => true).catch(() => false))) {
  launchOptions.channel = 'msedge';
}

const browser = await chromium.launch(launchOptions);
const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });

page.on('request', (req) => {
  if (ezoicHosts.some((host) => req.url().includes(host))) {
    requests.push({ method: req.method(), url: req.url() });
  }
});

page.on('console', (msg) => {
  consoleMessages.push({ type: msg.type(), text: msg.text() });
});

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(12000);

const result = await page.evaluate(() => {
  const bodyText = document.body.innerText || '';
  const placeholders = Array.from(document.querySelectorAll('[id^="ezoic-pub-ad-placeholder-"]')).map((el) => el.id);
  const debuggerText = [
    'Script In Page',
    'Defined Placeholders',
    'Unused Placeholders',
    'API Methods Called',
    'Ad Request',
    'Consent'
  ].filter((text) => bodyText.includes(text));

  return {
    title: document.title,
    hasEzStandalone: typeof window.ezstandalone !== 'undefined',
    hasShowAds: typeof window.ezstandalone?.showAds === 'function',
    placeholderCount: placeholders.length,
    placeholders,
    debuggerSignals: debuggerText,
    bodySample: bodyText.slice(0, 2000),
  };
});

console.log(JSON.stringify({ result, requests, consoleMessages }, null, 2));
await page.screenshot({ path: 'C:/Users/15879/Downloads/easy-finance-tools-v2/ezoic-debugger-check.png', fullPage: true });
await browser.close();
