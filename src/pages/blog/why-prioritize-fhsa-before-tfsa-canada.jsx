import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function WhyPrioritizeFHSABeforeTFSA() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("why-prioritize-fhsa-before-tfsa-canada")} />;
}
