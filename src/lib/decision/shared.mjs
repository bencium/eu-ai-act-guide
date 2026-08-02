import { OFFICIAL } from "./sources.mjs";

export const DISCLAIMER =
  "This educational result uses only the selected answers. It is not legal advice or legal clearance. Other EU, national and sector rules may apply. Courts and competent authorities give authoritative interpretations.";

export const PROHIBITED_CERTAINTY_TERMS = Object.freeze([
  "compliant",
  "approved",
  "safe",
  "certified",
  "minimal risk",
  "no obligations",
]);

export function recordAnswers(input, orderedQuestionIds) {
  return orderedQuestionIds
    .filter((questionId) => input[questionId] !== undefined)
    .map((questionId) => ({
      questionId,
      answerId: String(input[questionId]),
    }));
}

export function findProhibitedCertaintyTerms(value) {
  const text = JSON.stringify(value).toLocaleLowerCase("en");
  return PROHIBITED_CERTAINTY_TERMS.filter((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(text);
  });
}

export function assertCautiousResult(result) {
  const found = findProhibitedCertaintyTerms(result);
  if (found.length > 0) {
    throw new Error(`Result contains prohibited certainty wording: ${found.join(", ")}`);
  }
  return result;
}

export function resultDate(date, state, label, extraCitations = []) {
  return {
    date,
    state,
    label,
    citations: [OFFICIAL.application, OFFICIAL.amendment, ...extraCitations],
  };
}

export function uniqueCitations(citations) {
  const seen = new Set();
  return citations.filter((citation) => {
    const key = `${citation.sourceId}:${citation.reference}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
