import { useEffect, useRef } from "react";
import { trackToolStart, trackToolCalculate } from "../lib/analytics";

/**
 * Track the first actual scenario edit, not the default output on page load.
 * The fingerprint is compared only in memory; neither input values nor the
 * fingerprint are included in the event or sent to analytics.
 */
export default function useCalculatorEngagement(toolName, inputValues) {
  const previous = useRef(null);
  const recorded = useRef(false);
  const fingerprint = JSON.stringify(inputValues);
  useEffect(() => {
    if (previous.current === null) {
      previous.current = fingerprint;
      return;
    }
    if (previous.current === fingerprint) return;
    previous.current = fingerprint;
    if (recorded.current) return;
    recorded.current = true;
    trackToolStart(toolName, { entry_point: "scenario_edit" });
    trackToolCalculate(toolName, { action: "first_recalculation" });
  }, [fingerprint, toolName]);
}
