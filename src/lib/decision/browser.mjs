import { COVERAGE_GRAPH, evaluateCoverage } from "./coverage.mjs";
import { EVERYDAY_GRAPH, evaluateEveryday } from "./everyday.mjs";
import { LABELLING_GRAPH, evaluateLabelling } from "./labelling.mjs";
import { OFFICIAL } from "./sources.mjs";

function question(toolId, node, showWhen) {
  return Object.freeze({
    id: node.id,
    questionKey: `tools.${toolId}.questions.${node.id}`,
    ...(showWhen ? { showWhen } : {}),
    options: Object.freeze(node.options.map((option) => Object.freeze({
      id: option.id,
      labelKey: `tools.${toolId}.options.${node.id}.${option.id}`,
      nextId: option.next,
    }))),
  });
}

const coverageIndustryUses = [
  "employment",
  "education",
  "essential_services",
  "credit",
  "life_or_health_insurance",
  "public_services",
  "law_enforcement",
  "migration",
  "justice",
  "democratic_processes",
  "critical_infrastructure",
  "regulated_product_safety",
];

const everydayNodes = EVERYDAY_GRAPH.nodes.map((node) => question("what-it-means", node));

const coverageNodes = COVERAGE_GRAPH.nodes.map((node) => question("does-it-apply", node, {
  industry: condition("intendedUse", coverageIndustryUses),
  additional: {
    any: [
      condition("context", ["pre_market_research_testing"]),
      condition("intendedUse", ["biometric_or_emotion"]),
    ],
  },
}[node.id]));

const media = ["text", "image", "audio", "video", "mixed"];
const deepfakeMedia = ["image", "audio", "video", "mixed"];
const materialChange = ["generated", "substantially_manipulated"];
const labellingVisibility = {
  change: condition("contentType", media),
  realisticOrPlausible: { all: [
    condition("role", ["professional_deployer"]),
    condition("contentType", deepfakeMedia),
    condition("change", materialChange),
  ] },
  publicInterest: { all: [
    condition("role", ["professional_deployer"]),
    condition("contentType", ["text"]),
    condition("change", materialChange),
  ] },
  editorialControl: { all: [
    condition("role", ["professional_deployer"]),
    condition("contentType", ["text"]),
    condition("change", materialChange),
    condition("publicInterest", ["true"]),
  ] },
  editorialResponsibilityAccepted: condition("editorialControl", ["substantive_final"]),
  interactionObviouslyAI: { all: [
    condition("role", ["provider"]),
    condition("contentType", ["chatbot_agent"]),
  ] },
  setting: condition("contentType", ["emotion_recognition", "biometric_categorisation"]),
  systemPlacedBefore2026August2: { all: [
    condition("role", ["provider"]),
    condition("contentType", media),
    condition("change", materialChange),
  ] },
  disclosureAtFirstExposure: {
    any: [
      { all: [condition("role", ["provider"]), condition("contentType", ["chatbot_agent"]), condition("interactionObviouslyAI", ["false"])] },
      { all: [condition("role", ["professional_deployer"]), condition("contentType", deepfakeMedia), condition("change", materialChange), condition("realisticOrPlausible", ["true"])] },
      { all: [condition("role", ["professional_deployer"]), condition("contentType", ["text"]), condition("change", materialChange), condition("publicInterest", ["true"])] },
      { all: [condition("role", ["professional_deployer"]), condition("contentType", ["emotion_recognition", "biometric_categorisation"])] },
    ],
  },
};

const labellingNodes = LABELLING_GRAPH.nodes.map((node) => question(
  "label-content",
  node,
  labellingVisibility[node.id],
));

function condition(questionId, answerIds) {
  return Object.freeze({ questionId, answerIds: Object.freeze(answerIds) });
}

export const QUESTION_CATALOG = Object.freeze({
  "what-it-means": Object.freeze(everydayNodes),
  "does-it-apply": Object.freeze(coverageNodes),
  "label-content": Object.freeze(labellingNodes),
});

export const TOOL_DEFINITIONS = Object.freeze({
  "what-it-means": definition("what-it-means", EVERYDAY_GRAPH.start, everydayNodes),
  "does-it-apply": definition("does-it-apply", COVERAGE_GRAPH.start, coverageNodes),
  "label-content": definition("label-content", LABELLING_GRAPH.start, labellingNodes),
});

function definition(id, startNodeId, nodes) {
  return Object.freeze({
    id,
    titleKey: `tools.${id}.title`,
    introKey: `tools.${id}.intro`,
    startNodeId,
    nodes: Object.freeze(nodes),
  });
}

export const SOURCE_CATALOG = Object.freeze(Object.fromEntries(
  Object.values(OFFICIAL).map((source) => [
    source.sourceId,
    Object.freeze({
      id: source.sourceId,
      authority: source.authority,
      reference: source.reference,
      url: source.url,
    }),
  ]),
));

/**
 * Return translation identifiers and legal-source identifiers only. The browser
 * layer never receives English legal explanations from the rule evaluators.
 */
export function evaluateTool(toolId, suppliedAnswers, asOfDate = "2026-08-02") {
  const answers = normaliseToolAnswers(toolId, suppliedAnswers ?? {});
  if (toolId === "what-it-means") {
    return normaliseEveryday(evaluateEveryday(answers, asOfDate), answers);
  }
  if (toolId === "does-it-apply") {
    return normaliseCoverage(evaluateCoverage(answers, asOfDate), answers);
  }
  if (toolId === "label-content") {
    return normaliseLabelling(evaluateLabelling(answers, asOfDate), answers);
  }
  throw new TypeError(`Unknown decision tool: ${toolId}`);
}

function normaliseEveryday(result, input) {
  return {
    ...common("what-it-means", result, {
      knownIds: result.answers.map((answer) => `known.${answer.questionId}.${answer.answerId}`),
      unknownIds: [
        "unknown.provider-and-deployer",
        "unknown.intended-purpose",
        ...(input.perceivedEffect === "other_or_unsure" ? ["unknown.effect"] : []),
        ...(!input.decisionImpact || input.decisionImpact === "unsure" ? ["unknown.significant-decision"] : []),
        ...(["not_requested", "unsure"].includes(input.humanHelpRoute) ? ["unknown.human-help-route"] : []),
        "unknown.other-laws",
      ],
      roleId: "role.affected_person",
      detailIds: [`tools.what-it-means.details.${input.setting}`],
      nextActionId: `tools.what-it-means.next.${input.setting}`,
    }),
    personAskListKey: `tools.what-it-means.asks.${input.setting}`,
    possibleRouteListKey: `tools.what-it-means.routes.${input.setting}`,
  };
}

function normaliseCoverage(result, input) {
  const knownIds = result.answers
    .filter((answer) => answer.answerId !== "unsure")
    .map((answer) => `known.${answer.questionId}.${answer.answerId}`);
  const unknownIds = [];
  for (const id of ["euConnection", "role", "intendedUse", "context", "organisationSize", "timing"]) {
    if (input[id] === "unsure") unknownIds.push(`unknown.coverage.${id}`);
  }
  if (input.context === "pre_market_research_testing" && input.additional?.realWorldTesting === undefined) {
    unknownIds.push("unknown.coverage.real-world-testing");
  }
  if (input.context === "personal_non_professional") {
    unknownIds.push("unknown.coverage.professional-activity");
  }
  if (coverageIndustryUses.includes(input.intendedUse) && input.industry === "unsure") {
    unknownIds.push("unknown.coverage.industry");
  }
  const detailIds = [
    `tools.does-it-apply.details.status.${result.status}`,
    `tools.does-it-apply.details.euConnection.${input.euConnection}`,
    `tools.does-it-apply.details.context.${input.context}`,
  ];
  if (result.citations.some((item) => item.sourceId === "reg-2024-1689-art-50")) {
    detailIds.push("tools.does-it-apply.details.article50-signal");
  }
  if (result.citations.some((item) => item.sourceId === "reg-2024-1689-art-6-annexes")) {
    detailIds.push("tools.does-it-apply.details.high-risk-check");
  }
  if (result.citations.some((item) => item.sourceId === "reg-2024-1689-art-5")) {
    detailIds.push("tools.does-it-apply.details.article5-check");
  }
  const commonResult = common("does-it-apply", result, {
    knownIds,
    unknownIds,
    roleId: `role.${input.role}`,
    detailIds,
    nextActionId: `tools.does-it-apply.next.${coverageNextId(result, input)}`,
  });
  return {
    ...commonResult,
    sourceIds: [...new Set([
      ...commonResult.sourceIds,
      ...result.penalty.citations.map((citation) => citation.sourceId),
    ])],
    penalty: {
      regimeId: `penalty.regime.${result.penalty.regime}`,
      bandId: `penalty.band.${result.penalty.provisionBand}`,
      calculationRuleId: `penalty.calculation.${result.penalty.calculationRule}`,
      fixedAmountEur: result.penalty.fixedAmountEur,
      turnoverPercent: result.penalty.turnoverPercent,
      sourceIds: result.penalty.citations.map((item) => item.sourceId),
      factorIds: result.penalty.factors.map((_, index) => `penalty.factor.${index + 1}`),
    },
  };
}

function normaliseLabelling(result, input) {
  const knownIds = result.answers
    .filter((answer) => answer.answerId !== "unsure")
    .map((answer) => `known.${answer.questionId}.${answer.answerId}`);
  const unknownIds = [];
  if (input.role === "unsure") unknownIds.push("unknown.labelling.role");
  if (
    input.role === "professional_deployer" &&
    ["image", "audio", "video", "mixed"].includes(input.contentType) &&
    ["generated", "substantially_manipulated"].includes(input.change) &&
    input.realisticOrPlausible === undefined
  ) unknownIds.push("unknown.labelling.realistic-or-plausible");
  if (
    input.role === "professional_deployer" && input.contentType === "text" &&
    ["generated", "substantially_manipulated"].includes(input.change) && input.publicInterest === undefined
  ) unknownIds.push("unknown.labelling.public-interest");
  if (input.editorialControl === "substantive_final" && input.editorialResponsibilityAccepted === undefined) {
    unknownIds.push("unknown.labelling.editorial-responsibility");
  }
  if (input.contentType === "chatbot_agent" && input.role === "provider" && input.interactionObviouslyAI === undefined) {
    unknownIds.push("unknown.labelling.obvious-interaction");
  }
  if (
    input.role === "provider" && media.includes(input.contentType) &&
    materialChange.includes(input.change) && input.systemPlacedBefore2026August2 === undefined
  ) {
    unknownIds.push("tools.label-content.questions.systemPlacedBefore2026August2");
  }
  const hasHumanFacingDuty = result.duties.some((duty) =>
    duty.channel === "before_or_at_interaction" || duty.channel === "visible_or_audible",
  );
  if (hasHumanFacingDuty && input.disclosureAtFirstExposure === undefined) {
    unknownIds.push("tools.label-content.questions.disclosureAtFirstExposure");
  }
  const dutyIds = result.duties.map((item) => `tools.label-content.duties.${item.kind}`);
  return {
    ...common("label-content", result, {
      knownIds,
      unknownIds,
      roleId: `role.${input.role}`,
      detailIds: dutyIds.length > 0
        ? dutyIds
        : [`tools.label-content.details.status.${result.status}`],
      nextActionId: `tools.label-content.next.${labellingNextId(result)}`,
    }),
    duties: result.duties.map((item) => ({
      id: item.kind,
      channelId: `label.channel.${item.channel}`,
      explanationKey: `tools.label-content.duties.${item.kind}`,
      exampleKey: item.exampleWording ? `tools.label-content.examples.${item.kind}` : undefined,
      sourceIds: item.citations.map((citation) => citation.sourceId),
    })),
    optionalIcon: {
      available: result.optionalIcon.available,
      replacesWords: false,
      provesCompliance: false,
      sourceId: OFFICIAL.icons.sourceId,
    },
  };
}

function common(toolId, result, translated) {
  return Object.freeze({
    toolId,
    status: result.status,
    statusKey: `tools.${toolId}.status.${result.status}`,
    answerSummaryIds: result.answers.map((answer) => ({
      questionId: answer.questionId,
      answerId: answer.answerId,
    })),
    knownIds: translated.knownIds,
    unknownIds: translated.unknownIds,
    roleId: translated.roleId,
    sourceIds: [...new Set(result.citations.map((citation) => citation.sourceId))],
    dates: result.dates.map((item) => ({
      id: dateId(item),
      date: item.date,
      state: item.state,
      stateKey: `date.state.${item.state}`,
      sourceIds: item.citations.map((citation) => citation.sourceId),
    })),
    detailIds: translated.detailIds,
    nextActionId: translated.nextActionId,
    disclaimerId: "disclaimer.short",
  });
}

function dateId(item) {
  if (item.date === "2025-02-02") return "date.article-5-existing";
  if (item.date === "2026-12-02" && item.label.includes("provider")) return "date.provider-marking-transition";
  if (item.date === "2026-12-02") return "date.amended-article-5";
  if (item.date === "2027-12-02") return "date.annex-iii";
  if (item.date === "2028-08-02") return "date.annex-i";
  return "date.article-50";
}

function coverageNextId(result, input) {
  if (result.status !== "likely_in_scope") return result.status;
  if (result.citations.some((item) => item.sourceId === "reg-2024-1689-art-6-annexes")) return "map-high-risk-use";
  if (result.citations.some((item) => item.sourceId === "reg-2024-1689-art-50")) return "run-article-50-check";
  return input.role === "affected_person" ? "identify-responsible-operator" : "confirm-operator-duties";
}

function labellingNextId(result) {
  if (result.status === "unclear") return "confirm-missing-facts";
  if (result.status === "not_required_from_these_answers") return "check-other-rules";
  if (result.duties.some((item) => item.kind === "prohibited_use_check")) return "pause-for-article-5-review";
  return "implement-listed-duties";
}

function expandDottedAnswers(input) {
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    if (!key.includes(".")) {
      output[key] = coerceAnswer(key, value);
      continue;
    }
    const [parent, child] = key.split(".", 2);
    output[parent] ??= {};
    output[parent][child] = coerceAnswer(child, value);
  }
  return output;
}

function normaliseToolAnswers(toolId, input) {
  const output = expandDottedAnswers(input);
  if (toolId !== "does-it-apply" || typeof output.additional !== "string") return output;

  const choice = output.additional;
  const yes = choice === "specific_fact_yes";
  const no = choice === "specific_fact_no";
  if (choice === "unsure") {
    output.additional = { uncertainSpecificFact: true };
  } else if (output.context === "pre_market_research_testing" && (yes || no)) {
    output.additional = { realWorldTesting: yes };
  } else if (output.intendedUse === "biometric_or_emotion" && (yes || no)) {
    output.additional = { article5Concern: yes };
  } else {
    output.additional = {};
  }
  return output;
}

const BOOLEAN_ANSWER_IDS = new Set([
  "realisticOrPlausible",
  "publicInterest",
  "editorialResponsibilityAccepted",
  "disclosureAtFirstExposure",
  "interactionObviouslyAI",
  "systemPlacedBefore2026August2",
  "realWorldTesting",
  "article5Concern",
  "article50Concern",
  "annexIProduct",
  "annexIIIUse",
]);

function coerceAnswer(questionId, value) {
  if (!BOOLEAN_ANSWER_IDS.has(questionId)) return value;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  if (questionId === "disclosureAtFirstExposure" && value === "not_applicable") return false;
  if (value === "unsure" || value === "not_applicable") return undefined;
  return value;
}
