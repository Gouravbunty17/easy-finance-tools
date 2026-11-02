import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const src = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
test("brand tokens and accessible reduced-motion baseline", () => {
 const css=src("src/index.css");
 assert.match(css,/--eft-navy: #0B2447/);
 assert.match(css,/--eft-teal: #137B70/);
 assert.match(css,/prefers-reduced-motion/);
});
test("key calculator routes and report remain discoverable and no formula implementations removed", () => {
 const home=src("src/pages/Home.jsx");
 for(const route of ["/tools/tfsa-calculator","/tools/rrsp-calculator","/tools/mortgage-calculator","/tools/portfolio-analyzer"]) assert.ok(home.includes(route));
 const portfolio=src("src/pages/PortfolioAnalyzer.jsx");
 for(const marker of ["parsePortfolioCsv","validatePortfolioHoldings","analyzePortfolio","AccountDonut","confirmAnalysis","noindex"])assert.ok(portfolio.includes(marker),marker);
});
test("Mobile menu preserves search, dark mode, open/close, and recognizable logo",()=>{
 const menu=src("src/components/Header.jsx");
 for(const marker of ["onOpenSearch","setDark","setOpen","aria-expanded","/tools"]) assert.ok(menu.includes(marker));
 assert.match(src("public/logo.svg"),/viewBox="0 0 512 512"/);
});
