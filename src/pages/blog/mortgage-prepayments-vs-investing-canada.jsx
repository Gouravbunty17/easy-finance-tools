import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function MortgagePrepaymentsVsInvestingCanada() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("mortgage-prepayments-vs-investing-canada")} />;
}
