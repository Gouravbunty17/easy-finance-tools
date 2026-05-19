import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function PayDebtVsInvestCanada() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("pay-debt-vs-invest-canada")} />;
}
