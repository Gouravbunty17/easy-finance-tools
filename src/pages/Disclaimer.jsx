import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import PageDisclaimer from "../components/PageDisclaimer";

export default function Disclaimer() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Financial Disclaimer"
        description="Read the Easy Finance Tools educational disclaimer covering calculator estimates, financial content, investing risk, tax, mortgage, and legal limits."
        canonical="https://easyfinancetools.com/disclaimer"
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Educational boundaries
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">Financial Disclaimer</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-100">
            Easy Finance Tools helps Canadians estimate and compare scenarios, but it does not provide personalized professional advice.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <PageDisclaimer />

        <div className="prose prose-lg prose-neutral mt-10 max-w-none dark:prose-invert">
          <h2>Calculator estimates</h2>
          <p>
            Calculator results depend on the numbers you enter, simplified assumptions, rounding, and the current rules built into the page. Your actual tax result, mortgage approval, investment outcome, account room, or benefit amount may differ.
          </p>

          <h2>Financial, tax, legal, and mortgage advice</h2>
          <p>
            Nothing on this site creates an advisor-client, tax preparer-client, broker-client, legal, fiduciary, or professional relationship. Before acting on a material decision, verify your numbers with official sources such as CRA, Government of Canada, Bank of Canada, FCAC, CMHC, your lender, your financial institution, or a qualified professional.
          </p>

          <h2>Investing risk</h2>
          <p>
            Investing involves risk. ETF yields, dividend histories, interest rates, market returns, examples, and projections are not guarantees. A higher projected return or income estimate usually comes with uncertainty that a calculator cannot fully model.
          </p>

          <h2>Affiliate and advertising disclosure</h2>
          <p>
            Some pages may include referral or affiliate links. We may earn a commission or bonus if you use those links, but that does not change the educational content, formulas, or stated limitations. Read the{" "}
            <Link to="/affiliate-disclosure" className="text-primary underline dark:text-secondary">
              affiliate disclosure
            </Link>{" "}
            for more detail.
          </p>

          <h2>Corrections</h2>
          <p>
            If you find an outdated limit, broken source link, or calculation issue, contact us so it can be reviewed. Our source and correction process is explained in the{" "}
            <Link to="/editorial-standards" className="text-primary underline dark:text-secondary">
              editorial standards
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
