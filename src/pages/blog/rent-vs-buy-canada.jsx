import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function RentVsBuyCanada() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("rent-vs-buy-canada")} />;
}
