import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function AffiliateDisclosure() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <SEO
        title="Affiliate Disclosure | EasyFinanceTools"
        description="Read how EasyFinanceTools handles referral links, affiliate relationships, editorial independence, and financial-tool recommendations."
        canonical="https://easyfinancetools.com/affiliate-disclosure"
      />

      <h1 className="text-4xl font-bold text-primary dark:text-accent">Affiliate Disclosure</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Last updated: April 28, 2026</p>

      <div className="prose prose-lg prose-neutral mt-10 max-w-none dark:prose-invert">
        <p>
          EasyFinanceTools is an independent Canadian finance education website. Some pages may include referral links,
          promo-code boxes, or sponsored-style links to financial platforms. If you click one of those links or use a
          referral code, we may earn compensation at no extra cost to you.
        </p>

        <h2>How affiliate relationships affect content</h2>
        <p>
          Affiliate relationships do not decide which calculators we build, how calculator math works, or whether a
          guide explains risks and tradeoffs. A product can be mentioned because it is relevant to a Canadian money
          decision, because readers commonly compare it, or because it fits the specific page context.
        </p>

        <h2>What we disclose on-page</h2>
        <p>
          When a page includes a referral callout, we aim to place a short disclosure near that callout. That disclosure
          should explain that compensation may be earned and that the relationship does not change the educational
          explanation, examples, or methodology on the page.
        </p>

        <h2>What you should verify before acting</h2>
        <p>
          Financial platforms can change fees, account features, promotions, eligibility rules, and terms. Always check
          the provider's current documents before opening an account, transferring money, buying an ETF, or making a tax
          decision. The calculators and articles on this site are educational tools, not personalized financial advice.
        </p>

        <h2>Editorial standards</h2>
        <p>
          Our editorial approach is explained in the{" "}
          <Link to="/editorial-standards" className="text-primary underline dark:text-secondary">
            Editorial Standards
          </Link>{" "}
          page. Calculator assumptions and update practices are explained in the{" "}
          <Link to="/methodology" className="text-primary underline dark:text-secondary">
            Methodology
          </Link>{" "}
          page.
        </p>

        <h2>Questions</h2>
        <p>
          If you see a page where a referral relationship is unclear, contact us through the{" "}
          <Link to="/contact" className="text-primary underline dark:text-secondary">
            Contact
          </Link>{" "}
          page so we can review it.
        </p>
      </div>
    </main>
  );
}
