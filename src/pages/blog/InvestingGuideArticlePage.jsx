import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { investingGuideArticles } from "./investingGuideArticles";

export default function InvestingGuideArticlePage({ slug }) {
  return <CanadianEducationArticle article={investingGuideArticles[slug]} />;
}
