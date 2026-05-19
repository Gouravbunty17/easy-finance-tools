import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import DecisionFramework from "../components/DecisionFramework";
import EducationalDisclaimer from "../components/EducationalDisclaimer";
import SourceNote from "../components/SourceNote";
import PrivacyNote from "../components/PrivacyNote";
import { tfsaOfficialSources, rrspOfficialSources, fhsaOfficialSources, mortgageOfficialSources } from "../config/officialSources";

const founderName = "Gourav Kumar";
const founderLocation = "Greater Toronto Area (GTA), Canada";
const linkedInUrl = "";

const processSteps = [
  {
    title: "Start with the decision",
    body: "A page should clarify the user question first: contribution room, account priority, mortgage affordability, dividend sustainability, tax estimate, or retirement planning.",
  },
  {
    title: "Check the Canadian rule",
    body: "Where a result depends on published rules, the page should point to official Canadian sources such as CRA, Bank of Canada, CMHC, FCAC, or Government of Canada guidance.",
  },
  {
    title: "Show assumptions and weak points",
    body: "Calculators should explain which assumptions drive the result and where the output can become misleading.",
  },
  {
    title: "Invite corrections",
    body: "Readers can challenge stale numbers, broken links, unclear wording, or calculation issues through the contact and corrections process.",
  },
];

const limitations = [
  "EasyFinanceTools is founder-operated and is not a bank, brokerage, tax firm, accounting firm, or financial planning practice.",
  `${founderName} is not presented as a licensed financial advisor, CFP, CFA, CPA, mortgage broker, tax preparer, or lawyer.`,
  "Calculator outputs are educational estimates, not financial plans, tax filings, lender approvals, or investment recommendations.",
  "Rules, limits, tax brackets, benefit amounts, mortgage assumptions, and source pages can change after publication.",
];

const updateChecks = [
  "CRA registered-account limits and contribution-room guidance",
  "Federal and provincial tax assumptions used by calculators",
  "Bank of Canada rate, inflation, or exchange-rate references",
  "CMHC, FCAC, or lender-rule references for mortgage and housing tools",
  "Internal links, canonical URLs, sitemap coverage, and noindex rules for weak pages",
];

export default function FounderTransparency() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Founder Transparency",
    url: "https://easyfinancetools.com/founder-transparency",
    description: "Founder accountability and transparency page for EasyFinanceTools.",
    mainEntity: {
      "@type": "Person",
      name: founderName,
      jobTitle: "Founder and editor of EasyFinanceTools",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Brampton",
        addressRegion: "Ontario",
        addressCountry: "CA",
      },
      ...(linkedInUrl ? { sameAs: [linkedInUrl] } : {}),
    },
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <SEO
        title="Founder Transparency | EasyFinanceTools"
        description="Who built EasyFinanceTools, why it exists, how calculators are researched, and how Canadian finance content is reviewed, corrected, and limited."
        canonical="https://easyfinancetools.com/founder-transparency"
        schema={schema}
      />

      <section className="border-b bg-gradient-to-br from-primary via-[#0a4c89] to-secondary px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Founder transparency
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Who built EasyFinanceTools, and how the work is handled
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
            EasyFinanceTools is a founder-operated Canadian financial education and calculator site. This page explains who is accountable for it, why it exists, how it is maintained, and where its limits are.
          </p>
          <p className="mt-4 text-sm font-semibold text-blue-100">Last reviewed: May 19, 2026</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Accountability</p>
            <h2 className="mt-2 text-3xl font-bold text-primary dark:text-accent">Built and maintained by {founderName}</h2>
            <div className="mt-5 space-y-4 leading-8 text-slate-600 dark:text-slate-300">
              <p>
                My name is {founderName}. I am a programmer based in the {founderLocation}, with a strong interest in investing and financial education.
              </p>
              <p>
                After moving to Canada in 2022, I found it difficult to understand many Canadian financial systems and account options like TFSA, RRSP, FHSA, investing, mortgages, and taxes. Much of the information online felt either overly technical or too focused on selling products instead of helping people make practical financial decisions.
              </p>
              <p>
                I started EasyFinanceTools.com to create a simpler and more transparent educational platform where Canadians, especially beginners and newcomers, can better understand financial decisions through calculators, guides, and decision-support tools.
              </p>
              <p>
                As a programmer, I wanted the platform to be privacy-conscious, straightforward, and source-linked wherever possible, using official Canadian sources and clearly explained tradeoffs instead of aggressive financial marketing.
              </p>
              <p>
                I am not a licensed financial advisor, accountant, or tax professional. The purpose of this platform is educational: to organize researched Canadian financial information, explain tradeoffs clearly, and help people make more informed decisions before speaking with professionals or making important financial choices.
              </p>
              {linkedInUrl ? (
                <p>
                  You can also review the founder's public profile on{" "}
                  <a href={linkedInUrl} target="_blank" rel="noreferrer" className="font-semibold text-primary underline dark:text-secondary">
                    LinkedIn
                  </a>.
                </p>
              ) : (
                <p>
                  A verified public LinkedIn URL is not currently configured on the site. Rather than linking to an unverified profile, this page points to the public methodology, editorial standards, corrections, and contact process. A real LinkedIn link can be added when it is ready to publish.
                </p>
              )}
            </div>
          </section>

          <DecisionFramework
            eyebrow="Decision-support philosophy"
            title="The tradeoff, the rule, the warning, and the next path"
            intro="The site is designed to make Canadian financial decisions easier to inspect. A good calculator should not just output a number; it should show why the number can change."
          />

          <section className="grid gap-4 md:grid-cols-2">
            {processSteps.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
                <h2 className="text-xl font-bold text-primary dark:text-accent">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Research process</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">How calculators and guides are researched</h2>
            <div className="mt-5 space-y-4 leading-8 text-slate-600 dark:text-slate-300">
              <p>
                Calculator work starts with the practical Canadian question, then maps the relevant formula, user inputs, assumptions, and official sources. For registered accounts, that usually means CRA contribution and withdrawal rules. For housing, it may involve CMHC, FCAC, or lender-rule context. For rates, inflation, and currency, Bank of Canada sources are preferred where relevant.
              </p>
              <p>
                Pages are checked for obvious formula errors, mobile readability, dark-mode readability, source visibility, one clear H1, and whether the result explanation matches the calculation. The goal is not to sound institutional. The goal is to be honest about the method, the limitations, and the next step.
              </p>
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <PrivacyNote
              title="Privacy philosophy"
              body="Most calculator inputs are processed in the browser for the current session. The site is designed so users can test scenarios without creating an account or handing over personal financial documents."
            />
            <SourceNote
              title="Source-linked calculations"
              body="Core Canadian rule pages link to official or primary references where possible. Source links are visible near methodology or trust sections instead of being buried only in a footer."
              sources={[tfsaOfficialSources[0], rrspOfficialSources[0], fhsaOfficialSources[0], mortgageOfficialSources[0]]}
            />
          </div>

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/20 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Limits</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What EasyFinanceTools does not claim</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-amber-950 dark:text-amber-100">
              {limitations.map((item) => (
                <li key={item} className="rounded-2xl border border-amber-200 bg-white/80 p-4 dark:border-amber-900/60 dark:bg-slate-900/70">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Update process</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What gets checked when rules change</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              The highest-risk pages are reviewed first when Canadian rules or assumptions change. Routine formatting edits should not be treated as a full financial review.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {updateChecks.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <EducationalDisclaimer />
        </div>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-primary dark:text-accent">Transparency links</h2>
            <div className="mt-4 grid gap-3">
              {[
                { label: "About EasyFinanceTools", href: "/about" },
                { label: "Methodology and sources", href: "/methodology" },
                { label: "Editorial standards", href: "/editorial-standards" },
                { label: "Corrections and updates", href: "/corrections" },
                { label: "Contact", href: "/contact" },
                { label: "Full disclaimer", href: "/disclaimer" },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-primary dark:text-accent">Correction policy</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              If a source, formula, or explanation is wrong, the correction should be reviewed and logged when it materially changes user interpretation.
            </p>
            <Link to="/corrections" className="mt-4 inline-flex text-sm font-semibold text-primary underline dark:text-secondary">
              Review corrections policy
            </Link>
          </section>
        </aside>
      </section>
    </main>
  );
}
