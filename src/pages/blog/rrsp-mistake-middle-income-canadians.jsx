import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function RRSPMistakeMiddleIncomeCanadians() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("rrsp-mistake-middle-income-canadians")} />;
}
