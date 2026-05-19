import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function MortgageAffordabilityRealityCheckCanada() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("mortgage-affordability-reality-check-canada")} />;
}
