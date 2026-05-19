import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function ShouldYouDripDividendsCanada() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("should-you-drip-dividends-canada")} />;
}
