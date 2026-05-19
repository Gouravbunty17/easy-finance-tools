import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function WhenRRSPMakesSenseCanada() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("when-rrsp-makes-sense-canada")} />;
}
