import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function HighYieldDividendETFsHurtWealthCanada() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("high-yield-dividend-etfs-hurt-wealth-canada")} />;
}
