import React from "react";
import { Link } from "react-router-dom";

const founderCopy = {
  label: "Founder review",
  title: "Written and maintained by Easy Finance Tools",
  body: "This page is written and maintained by Easy Finance Tools, checked against official Canadian sources where applicable, and not reviewed by a licensed financial advisor unless a reviewer is explicitly named.",
};

export default function ContributorReviewBox({
  type = "founder",
  name,
  credential,
  experienceYears,
  areaReviewed,
  dateReviewed,
  className = "",
}) {
  const hasProfessional = type === "professional" && name && credential;
  const hasInvestor = type === "investor" && name && experienceYears;
  const state = hasProfessional ? "professional" : hasInvestor ? "investor" : "founder";

  const content = {
    founder: founderCopy,
    investor: {
      label: "Contributor perspective",
      title: `Investor perspective by ${name}`,
      body: `${experienceYears}+ years of personal investing experience. This is an educational contributor perspective and does not replace professional financial, tax, legal, mortgage, or investment advice.`,
    },
    professional: {
      label: "Professional review",
      title: `Reviewed by ${name}, ${credential}`,
      body: `${areaReviewed ? `Area reviewed: ${areaReviewed}. ` : ""}${dateReviewed ? `Date reviewed: ${dateReviewed}. ` : ""}This reviewer information is shown only when manually provided and verified.`,
    },
  }[state];

  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gray-800 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-emerald-300">{content.label}</p>
      <h2 className="mt-2 text-2xl font-bold text-primary dark:text-accent">{content.title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{content.body}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        <Link to="/founder-transparency" className="text-primary underline-offset-2 hover:underline dark:text-emerald-300">
          Founder transparency
        </Link>
        <Link to="/editorial-standards" className="text-primary underline-offset-2 hover:underline dark:text-emerald-300">
          Editorial standards
        </Link>
        <Link to="/corrections" className="text-primary underline-offset-2 hover:underline dark:text-emerald-300">
          Report an issue
        </Link>
      </div>
    </section>
  );
}
