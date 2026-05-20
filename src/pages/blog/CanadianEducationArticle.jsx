import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";
import TLDRBox from "../../components/TLDRBox";
import ArticleSchema from "../../components/ArticleSchema";
import FAQSchema from "../../components/FAQSchema";
import MethodologyPanel from "../../components/MethodologyPanel";
import OfficialSourceNote from "../../components/OfficialSourceNote";
import SourceList from "../../components/SourceList";
import EnhancedAuthorBox from "../../components/EnhancedAuthorBox";
import EditorialReviewNote from "../../components/EditorialReviewNote";
import ContinueLearning from "../../components/ContinueLearning";
import SuggestCorrectionCTA from "../../components/SuggestCorrectionCTA";
import WasThisHelpful from "../../components/WasThisHelpful";
import UpdatedForRulesBadge from "../../components/UpdatedForRulesBadge";
import RelatedDecisionTools from "../../components/RelatedDecisionTools";
import RelatedContent from "../../components/RelatedContent";
import ContributorReviewBox from "../../components/ContributorReviewBox";
import SourceVerificationBlock from "../../components/SourceVerificationBlock";
import {
  dividendTaxOfficialSources,
  fhsaOfficialSources,
  mortgageOfficialSources,
  retirementOfficialSources,
  rrspOfficialSources,
  taxOfficialSources,
  tfsaOfficialSources,
} from "../../config/officialSources";
import { getAbsoluteArticleImage, getArticleMedia } from "./articleMedia";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderParagraphs(paragraphs = []) {
  return paragraphs.map((paragraph, index) => (
    <p key={`${String(paragraph).slice(0, 24)}-${index}`}>{paragraph}</p>
  ));
}

function getArticleOfficialSources(article) {
  if (article.officialSources?.length) return article.officialSources;

  const text = `${article.slug} ${article.category} ${article.title}`.toLowerCase();

  if (text.includes("tfsa") && text.includes("rrsp")) return [tfsaOfficialSources[0], rrspOfficialSources[0], fhsaOfficialSources[0]];
  if (text.includes("fhsa")) return fhsaOfficialSources;
  if (text.includes("tfsa")) return tfsaOfficialSources;
  if (text.includes("rrsp")) return rrspOfficialSources;
  if (text.includes("mortgage") || text.includes("home buyer") || text.includes("down payment")) return mortgageOfficialSources;
  if (text.includes("cpp") || text.includes("oas") || text.includes("retirement")) return retirementOfficialSources;
  if (text.includes("tax bracket") || text.includes("canada child benefit")) return taxOfficialSources;
  if (text.includes("dividend") || text.includes("drip") || text.includes("covered call")) return dividendTaxOfficialSources;

  return [];
}

function getDecisionToolTopic(article) {
  const text = `${article.slug} ${article.category} ${article.title}`.toLowerCase();
  if (text.includes("mortgage") || text.includes("home")) return "mortgage";
  if (text.includes("dividend") || text.includes("yield")) return "dividends";
  if (text.includes("fhsa")) return "fhsa";
  if (text.includes("rrsp")) return "rrsp";
  return "tfsa";
}

function getBalancedRelatedContent(article) {
  const related = article.related || [];
  const calculator = related.find((item) => item.href?.startsWith("/tools/"));
  const guides = related.filter((item) => item.href?.startsWith("/blog/") || item.href?.startsWith("/topics/"));
  const fallbackCalculator = {
    type: "Calculator",
    label: "Account Decision Tool",
    href: "/tools/account-decision-tool",
    body: "Compare TFSA, RRSP, and FHSA priority before turning the guide into an account decision.",
  };
  const fallbackGuides = [
    {
      type: "Guide",
      label: "TFSA vs RRSP vs FHSA",
      href: "/blog/tfsa-vs-rrsp-vs-fhsa-canada",
      body: "Use a broader Canadian account-priority framework.",
    },
    {
      type: "Guide",
      label: "Beginner investing in Canada",
      href: "/blog/how-to-start-investing-canada-2026",
      body: "Review account order, emergency cash, fees, and simple portfolio choices.",
    },
  ];

  return [calculator || fallbackCalculator, ...guides, ...fallbackGuides]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.href === item.href) === index)
    .slice(0, 3)
    .map((item) => ({
      type: item.href.startsWith("/tools/") ? "Calculator" : "Guide",
      title: item.label || item.title,
      href: item.href,
      body: item.body,
      ctaLabel: `${article.slug}_${item.label || item.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    }));
}

export default function CanadianEducationArticle({ article }) {
  const tocItems = article.sections.map((section) => ({ id: slugify(section.heading), label: section.heading }));
  const imageUrl = article.imageUrl || getAbsoluteArticleImage(article.slug);
  const imageAlt = article.imageAlt || getArticleMedia(article.slug).alt;
  const officialSources = getArticleOfficialSources(article);

  return (
    <div>
      <SEO
        title={article.seoTitle}
        description={article.metaDescription}
        canonical={article.canonical}
        image={imageUrl}
        imageAlt={imageAlt}
      />
      <ArticleSchema
        headline={article.title}
        description={article.metaDescription}
        url={article.canonical}
        datePublished={article.datePublished}
        dateModified={article.dateModified}
        imageUrl={imageUrl}
      />
      <FAQSchema faqs={article.faqs} />

      <BlogHero
        icon={article.icon}
        category={article.category}
        title={article.title}
        date={article.displayDate}
        readTime={article.readTime}
        gradient={article.gradient}
        reviewer={article.reviewer || "Reviewed against current Canadian source material"}
        slug={article.slug}
      />

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-5">
          <UpdatedForRulesBadge />
        </div>
        <TLDRBox headline={article.shortAnswerHeadline} answer={article.shortAnswer} points={article.keyPoints} />

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">How to use this guide</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Read for the decision, then verify the rule</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "What changes the answer?",
                body: "Look for the income, timeline, account-room, province, tax, or risk assumption that would make the conclusion weaker.",
              },
              {
                title: "What source applies?",
                body: "Use the official links below for rules, limits, tax treatment, benefit dates, or mortgage guidance before acting.",
              },
              {
                title: "What is not covered?",
                body: "Personal tax history, contribution-room records, employer plans, debt terms, and household constraints may change the practical decision.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <OfficialSourceNote
          title="Source check before you act"
          body="This guide is educational. Use the official references below to verify account rules, tax treatment, benefit rules, or mortgage guidance before making a personal decision."
          sources={officialSources}
        />
        <ContributorReviewBox className="mb-8" />
        <SourceVerificationBlock
          className="mb-8"
          lastUpdated={article.lastUpdated || article.displayDate || "May 20, 2026"}
          sources={officialSources}
          checked={["Primary source links where applicable", "Educational disclaimer and decision caveats", "Related calculator and guide links", "No professional review claim unless explicitly provided"]}
          limitations={["This guide cannot see personal account room, tax filing history, employment benefits, debts, or household constraints.", "Official rules and eligibility should be verified before acting."]}
        />

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Table of contents</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {tocItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-primary transition hover:text-secondary dark:bg-slate-900 dark:text-accent">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <article className="prose prose-lg max-w-none prose-neutral dark:prose-invert">
          {renderParagraphs(article.intro)}

          {article.sections.map((section) => (
            <section key={section.heading} id={slugify(section.heading)} className="scroll-mt-24">
              <h2>{section.heading}</h2>
              {renderParagraphs(section.paragraphs)}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              ) : null}
              {section.table ? (
                <div className="not-prose my-6 overflow-x-auto">
                  <table className="w-full min-w-[680px] overflow-hidden rounded-xl border border-slate-200 text-sm dark:border-slate-700">
                    <thead className="bg-slate-100 text-left dark:bg-slate-800">
                      <tr>
                        {section.table.headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {section.table.rows.map((row) => (
                        <tr key={row.join("-")} className="bg-white dark:bg-gray-900">
                          {row.map((cell, index) => <td key={`${cell}-${index}`} className="px-4 py-3">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ))}
        </article>

        {article.misunderstood?.length ? (
          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What people misunderstand</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">What actually matters for Canadians</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {article.misunderstood.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                  <h3 className="font-bold text-primary dark:text-accent">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {article.notAFit?.length ? (
          <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Before you decide</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">When this strategy may not fit</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-amber-900 dark:text-amber-100">
              {article.notAFit.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 font-bold">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {article.edgeCases?.length ? (
          <section className="mt-10 rounded-3xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900/60 dark:bg-indigo-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Common edge cases</p>
            <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Where the simple answer can be wrong</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {article.edgeCases.map((item) => (
                <div key={item.title} className="rounded-2xl border border-indigo-200 bg-white p-5 dark:border-indigo-900/60 dark:bg-slate-900">
                  <h3 className="font-bold text-primary dark:text-accent">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10 rounded-3xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Example scenario</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{article.example.title}</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
            {renderParagraphs(article.example.paragraphs)}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Common mistakes</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Mistakes to avoid</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {article.mistakes.map((mistake) => (
              <div key={mistake.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="font-bold text-primary dark:text-accent">{mistake.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{mistake.body}</p>
              </div>
            ))}
          </div>
        </section>

        <RelatedContent
          className="mt-10"
          title="Use these next"
          intro="Each guide points to one practical calculator and two related guides so the next step stays educational instead of promotional."
          items={getBalancedRelatedContent(article)}
          trackingContext={`${article.slug}_related_content`}
        />

        <MethodologyPanel
          title="How this article was prepared"
          summary={article.methodology.summary}
          updated={article.lastUpdated}
          assumptions={article.methodology.assumptions}
          sources={article.methodology.sources}
          note={article.methodology.note}
        />

        <SourceList
          title="Official Canadian sources to verify"
          intro="These primary references help readers verify the Canadian rules, limits, and tax treatment discussed in this guide."
          sources={officialSources}
        />

        <div className="mt-10">
          <RelatedDecisionTools topic={article.decisionToolTopic || getDecisionToolTopic(article)} />
        </div>

        <div className="mt-10">
          <EditorialReviewNote updated={article.lastUpdated} />
        </div>

        <div className="mt-10">
          <EnhancedAuthorBox lastUpdated={article.lastUpdated} focus={article.category} />
        </div>

        {article.pathway ? (
          <div className="mt-10">
            <ContinueLearning
              eyebrow={article.pathway.eyebrow}
              title={article.pathway.title}
              intro={article.pathway.intro}
              steps={article.pathway.steps}
            />
          </div>
        ) : null}

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Educational disclaimer</p>
          <p className="mt-3 text-sm leading-7 text-amber-800 dark:text-amber-200">{article.disclaimer}</p>
        </section>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <SuggestCorrectionCTA context={article.title} />
          <WasThisHelpful id={article.slug} />
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Frequently asked questions</h2>
          <div className="mt-5 space-y-4">
            {article.faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="text-lg font-bold text-primary dark:text-accent">{faq.q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <Link to="/blog" className="mt-10 inline-block font-semibold text-primary hover:underline dark:text-accent">
          Back to Blog
        </Link>
      </section>
    </div>
  );
}
