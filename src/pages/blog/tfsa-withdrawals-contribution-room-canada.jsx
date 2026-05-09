import React from "react";
import CanadianEducationArticle from "./CanadianEducationArticle";
import { getDecisionSupportArticle } from "./decisionSupportArticles";

export default function TFSAWithdrawalsContributionRoomCanada() {
  return <CanadianEducationArticle article={getDecisionSupportArticle("tfsa-withdrawals-contribution-room-canada")} />;
}
