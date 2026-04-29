import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import BlogHero from "../../components/BlogHero";
import TLDRBox from "../../components/TLDRBox";
import ArticleSchema from "../../components/ArticleSchema";
import FAQSchema from "../../components/FAQSchema";
import MethodologyPanel from "../../components/MethodologyPanel";
import TrackedLink from "../../components/TrackedLink";

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

export default function CanadianEducationArticle({ article }) {
  const tocItems = article.sections.map((section) => ({ id: slugify(section.heading), label: section.heading }));

  return (
    <div>
      <SEO title={article.seoTitle} description={article.metaDescription} canonical={article.canonical} />
      <ArticleSchema
        headline={article.title}
        description={article.metaDescription}
        url={article.canonical}
        datePublished={article.datePublished}
        dateModified={article.dateModified}
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
      />

      <section className="mx-auto max-w-4xl px-4 py-12">
        <TLDRBox headline={article.shortAnswerHeadline} answer={article.shortAnswer} points={article.keyPoints} />

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

        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Related tools and guides</p>
          <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">Use these next</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {article.related.map((item) => (
              <TrackedLink
                key={item.href}
                to={item.href}
                articleSlug={article.slug}
                ctaLabel={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-sm transition hover:border-secondary hover:shadow-md dark:border-slate-700 dark:bg-gray-900"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">{item.type}</span>
                <h3 className="mt-2 text-lg font-bold text-primary dark:text-accent">{item.label}</h3>
                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
              </TrackedLink>
            ))}
          </div>
        </section>

        <MethodologyPanel
          title="How this article was prepared"
          summary={article.methodology.summary}
          updated={article.lastUpdated}
          assumptions={article.methodology.assumptions}
          sources={article.methodology.sources}
          note={article.methodology.note}
        />

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Educational disclaimer</p>
          <p className="mt-3 text-sm leading-7 text-amber-800 dark:text-amber-200">{article.disclaimer}</p>
        </section>

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
