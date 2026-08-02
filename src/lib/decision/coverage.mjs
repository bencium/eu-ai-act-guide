import { DATES, OFFICIAL } from "./sources.mjs";
import {
  assertCautiousResult,
  DISCLAIMER,
  recordAnswers,
  resultDate,
  uniqueCitations,
} from "./shared.mjs";

const EU_CONNECTIONS = [
  "provider_places_in_eu",
  "deployer_in_eu",
  "output_used_in_eu",
  "imports_or_distributes_in_eu",
  "regulated_product_in_eu",
  "people_in_eu_affected",
  "none_found",
  "unsure",
];

const ROLES = [
  "provider",
  "professional_deployer",
  "importer",
  "distributor",
  "product_manufacturer",
  "public_authority",
  "affected_person",
  "personal_user",
  "unsure",
];

const USES = [
  "content_generation",
  "chatbot_or_agent",
  "biometric_or_emotion",
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
  "ordinary_internal_assistance",
  "unsure",
];

const CONTEXTS = [
  "professional_or_economic",
  "personal_non_professional",
  "pre_market_research_testing",
  "sole_purpose_scientific_research",
  "military_defence_national_security",
  "free_open_source_release",
  "unsure",
];

const SIZES = [
  "personal",
  "micro",
  "small",
  "medium",
  "small_mid_cap",
  "large",
  "public_authority",
  "non_profit_or_other",
  "unsure",
];

export const COVERAGE_GRAPH = Object.freeze({
  id: "does-it-apply",
  start: "euConnection",
  nodes: [
    node("euConnection", EU_CONNECTIONS, "role"),
    node("role", ROLES, "intendedUse"),
    node("intendedUse", USES, "context"),
    node("context", CONTEXTS, "industry"),
    node("industry", ["sector_specific", "other", "not_applicable", "unsure"], "organisationSize"),
    node("organisationSize", SIZES, "timing"),
    node("timing", ["before_2026_08_02", "on_or_after_2026_08_02", "not_on_market", "unsure"], "additional"),
    node("additional", ["specific_fact_yes", "specific_fact_no", "not_needed", "unsure"], "result:unclear"),
  ],
  resultIds: [
    "result:likely_in_scope",
    "result:possible_exemption",
    "result:no_trigger_found",
    "result:unclear",
  ],
});

function node(id, optionIds, next) {
  return { id, options: optionIds.map((optionId) => ({ id: optionId, next })) };
}

const HIGH_RISK_USE = new Set([
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
]);

const ARTICLE_50_USE = new Set(["content_generation", "chatbot_or_agent", "biometric_or_emotion"]);
const SME_SIZES = new Set(["micro", "small", "medium"]);

/** @param {import('./types').CoverageInput} input */
export function evaluateCoverage(input, asOfDate = "2026-08-02") {
  requireCoverageInput(input);

  const sectorHighRiskUse = HIGH_RISK_USE.has(input.intendedUse);
  const confirmedSectorHighRisk = sectorHighRiskUse && input.industry === "sector_specific";
  const uncertainSectorHighRisk = sectorHighRiskUse && input.industry === "unsure";
  const highRiskSignal = Boolean(
    input.additional?.annexIProduct || input.additional?.annexIIIUse || confirmedSectorHighRisk,
  );
  const transparencySignal = Boolean(input.additional?.article50Concern || ARTICLE_50_USE.has(input.intendedUse));
  const prohibitedSignal = Boolean(input.additional?.article5Concern);
  const facts = classifyCoverage(input, {
    highRiskSignal,
    uncertainSectorHighRisk,
    transparencySignal,
    prohibitedSignal,
  });
  const provision = input.additional?.identifiedProvision ?? deriveProvision({
    highRiskSignal,
    transparencySignal,
    prohibitedSignal,
  });
  const citations = coverageCitations(input, {
    highRiskSignal,
    uncertainSectorHighRisk,
    transparencySignal,
    prohibitedSignal,
  });

  const result = {
    status: facts.status,
    statusText: statusText(facts.status),
    answers: coverageAnswers(input),
    known: facts.known,
    unknown: facts.unknown,
    possibleRole: roleLabel(input.role),
    citations,
    dates: coverageDates(input, { highRiskSignal, transparencySignal, prohibitedSignal }, asOfDate),
    reasons: facts.reasons,
    penalty: getPenaltyContext(provision, input.organisationSize),
    nextAction: nextAction(facts.status, highRiskSignal || uncertainSectorHighRisk, transparencySignal),
    disclaimer: DISCLAIMER,
  };
  return assertCautiousResult(result);
}

function classifyCoverage(input, signals) {
  const known = [];
  const unknown = [];
  const reasons = [];

  if (input.euConnection === "unsure") unknown.push("Whether the use has a connection to the EU");
  else known.push(`EU connection answer: ${input.euConnection}`);
  if (input.role === "unsure") unknown.push("The organisation's legal role");
  else known.push(`Possible role selected: ${input.role}`);
  if (input.intendedUse === "unsure") unknown.push("The intended purpose of this AI use");
  else known.push(`Intended use selected: ${input.intendedUse}`);
  if (input.organisationSize === "unsure") unknown.push("Organisation-size category and linked-enterprise calculation");
  else known.push(`Organisation-size answer: ${input.organisationSize}`);
  if (input.timing === "unsure") unknown.push("When the system or model was placed on the market or put into service");
  else known.push(`Timing answer: ${input.timing}`);
  if (signals.uncertainSectorHighRisk) {
    unknown.push("Whether the selected sector description matches the real intended use");
  }

  if (input.euConnection === "none_found") {
    reasons.push("None of the listed EU connections was found in the supplied answers.");
    unknown.push("Whether an unlisted EU connection or later EU use exists");
    return { status: "no_trigger_found", known, unknown, reasons };
  }

  if ([input.euConnection, input.role, input.intendedUse, input.context].includes("unsure")) {
    reasons.push("A fact that can change territorial scope, role or an exception is unknown.");
    return { status: "unclear", known, unknown, reasons };
  }

  if (input.additional?.uncertainSpecificFact) {
    reasons.push("A branch-specific fact that may change the result was answered as unknown.");
    unknown.push("The additional fact requested for this use");
    return { status: "unclear", known, unknown, reasons };
  }

  if (input.context === "personal_non_professional" || input.role === "personal_user") {
    reasons.push("The Act excludes natural persons using AI in a purely personal, non-professional activity.");
    unknown.push("Whether any professional, economic or organisational activity is also involved");
    return { status: "possible_exemption", known, unknown, reasons };
  }

  if (input.context === "pre_market_research_testing") {
    if (input.additional?.realWorldTesting === undefined) {
      reasons.push("Pre-market research may be treated differently, but real-world testing needs a separate check.");
      unknown.push("Whether people or operations are exposed through real-world testing");
      return { status: "unclear", known, unknown, reasons };
    }
    if (!input.additional.realWorldTesting) {
      reasons.push("The supplied answers describe pre-market research or testing and say no real-world testing occurs.");
      return { status: "possible_exemption", known, unknown, reasons };
    }
    known.push("The activity includes real-world testing");
    reasons.push("A pre-market label does not remove rules that apply to real-world testing.");
  }

  if (input.context === "sole_purpose_scientific_research") {
    reasons.push("The supplied answers describe sole-purpose scientific research, which has a specific scope exclusion.");
    unknown.push("Whether the use also has a commercial, operational or real-world purpose");
    return { status: "possible_exemption", known, unknown, reasons };
  }

  if (input.context === "military_defence_national_security") {
    reasons.push("The supplied answers indicate a military, defence or national-security purpose, which requires checking the specific scope exclusion.");
    unknown.push("Whether the system also serves a civilian purpose covered by the Act");
    return { status: "possible_exemption", known, unknown, reasons };
  }

  if (input.context === "free_open_source_release") {
    if (signals.prohibitedSignal || signals.highRiskSignal || signals.transparencySignal) {
      reasons.push("A free and open-source release does not remove Article 5, high-risk or Article 50 triggers.");
    } else {
      reasons.push("A free and open-source release may qualify for a limited exception, subject to its licence, role and use.");
      unknown.push("Whether a later provider, deployer or downstream use introduces a covered trigger");
      return { status: "possible_exemption", known, unknown, reasons };
    }
  }

  reasons.push("The answers identify an EU connection and a professional operator or affected-person context.");
  if (signals.highRiskSignal) reasons.push("The intended use appears in an area that may require a high-risk assessment.");
  if (signals.uncertainSectorHighRisk) {
    reasons.push("The intended-use category may require a high-risk mapping, but the sector match remains unknown.");
  }
  if (signals.transparencySignal) reasons.push("The intended use may engage Article 50 transparency duties.");
  if (signals.prohibitedSignal) reasons.push("A possible Article 5 practice needs an immediate human review.");
  return { status: "likely_in_scope", known, unknown, reasons };
}

function deriveProvision(signals) {
  if (signals.prohibitedSignal) return "article_5";
  if (signals.transparencySignal) return "operator_duties";
  return "other";
}

function coverageCitations(input, signals) {
  const citations = [OFFICIAL.scope, OFFICIAL.roles];
  if (signals.prohibitedSignal) citations.push(OFFICIAL.prohibited, OFFICIAL.application);
  if (signals.highRiskSignal || signals.uncertainSectorHighRisk) {
    citations.push(OFFICIAL.highRisk, OFFICIAL.deployers);
  }
  if (signals.transparencySignal) citations.push(OFFICIAL.transparency, OFFICIAL.guidelines);
  if (input.context === "free_open_source_release") citations.push(OFFICIAL.scope);
  citations.push(OFFICIAL.amendment);
  return uniqueCitations(citations);
}

function coverageDates(input, signals, asOfDate) {
  const dates = [];
  if (signals.transparencySignal) {
    if (
      input.role === "provider" &&
      input.timing === "before_2026_08_02" &&
      input.intendedUse === "content_generation"
    ) {
      dates.push(resultDate(
        DATES.providerMarkingTransition,
        compareDate(asOfDate, DATES.providerMarkingTransition) < 0 ? "transition" : "applies",
        "Narrow transition date for Article 50(2) provider marking of relevant existing generative systems",
        [OFFICIAL.transparency],
      ));
    } else {
      dates.push(resultDate(
        DATES.article50,
        compareDate(asOfDate, DATES.article50) < 0 ? "future" : "applies",
        "Article 50 transparency application date",
        [OFFICIAL.transparency],
      ));
    }
  }
  if (signals.prohibitedSignal) {
    dates.push(resultDate(
      DATES.article5Existing,
      compareDate(asOfDate, DATES.article5Existing) < 0 ? "future" : "applies",
      "Application date for the original Article 5 prohibited practices",
      [OFFICIAL.prohibited, OFFICIAL.application],
    ));
    dates.push(resultDate(
      DATES.amendedArticle5,
      compareDate(asOfDate, DATES.amendedArticle5) < 0 ? "future" : "applies",
      "Application date for new Article 5 provisions introduced by Regulation (EU) 2026/1744",
      [OFFICIAL.prohibited],
    ));
  }
  if (signals.highRiskSignal) {
    const annexI = input.additional?.annexIProduct || input.intendedUse === "regulated_product_safety";
    const date = annexI ? DATES.annexI : DATES.annexIII;
    dates.push(resultDate(
      date,
      compareDate(asOfDate, date) < 0 ? "future" : "applies",
      annexI ? "Relevant Annex I product-related high-risk application date" : "Relevant Annex III high-risk application date",
      [OFFICIAL.highRisk],
    ));
  }
  if (dates.length === 0) {
    dates.push(resultDate(
      DATES.article50,
      compareDate(asOfDate, DATES.article50) < 0 ? "future" : "depends",
      "Date shown for orientation; the exact obligation depends on a provision-specific review",
    ));
  }
  return dates;
}

export function getPenaltyContext(provision, organisationSize) {
  const factors = [
    "nature, gravity and duration",
    "damage and people affected",
    "organisation size and annual turnover",
    "cooperation and corrective action",
    "intent or negligence",
  ];

  if (organisationSize === "public_authority") {
    return {
      regime: "member_state_rules",
      provisionBand: provision,
      calculationRule: "national_rule",
      label: "Public-authority monetary penalties depend on the rules adopted by the relevant Member State.",
      factors,
      citations: [OFFICIAL.penalties, OFFICIAL.amendment],
    };
  }

  if (provision === "gpai") {
    return {
      regime: "article_101",
      provisionBand: "gpai",
      calculationRule: "separate_article_101",
      label: "General-purpose AI model providers have a separate Article 101 penalty regime; this short checker does not calculate it.",
      factors,
      citations: [OFFICIAL.gpaiPenalties, OFFICIAL.amendment],
    };
  }

  const bands = {
    article_5: [35_000_000, 7],
    operator_duties: [15_000_000, 3],
    authority_information: [7_500_000, 1],
  };
  const band = bands[provision];
  if (!band) {
    return {
      regime: "other",
      provisionBand: "other",
      calculationRule: "not_calculated",
      label: "No Article 99 ceiling band was assigned from these answers. Member State measures or another regime may still require review.",
      factors,
      citations: [OFFICIAL.penalties, OFFICIAL.amendment],
    };
  }

  const isSme = SME_SIZES.has(organisationSize);
  const midCapGetsLowerRule = organisationSize === "small_mid_cap" &&
    (provision === "operator_duties" || provision === "authority_information");
  const calculationRule = isSme || midCapGetsLowerRule ? "lower_of" : "higher_of";
  const [fixedAmountEur, turnoverPercent] = band;
  return {
    regime: "article_99",
    provisionBand: provision,
    fixedAmountEur,
    turnoverPercent,
    calculationRule,
    label: `Maximum statutory ceiling: EUR ${fixedAmountEur.toLocaleString("en-US")} or ${turnoverPercent}% of worldwide annual turnover, using the legally applicable ${calculationRule === "lower_of" ? "lower" : "higher"} calculation. This is not a predicted fine.`,
    factors,
    citations: [OFFICIAL.penalties, OFFICIAL.amendment],
  };
}

function coverageAnswers(input) {
  const answers = recordAnswers(input, [
    "euConnection",
    "role",
    "intendedUse",
    "context",
    "industry",
    "organisationSize",
    "timing",
  ]);
  for (const [key, value] of Object.entries(input.additional ?? {})) {
    if (value !== undefined) answers.push({ questionId: `additional.${key}`, answerId: String(value) });
  }
  return answers;
}

function statusText(status) {
  return {
    likely_in_scope: "Likely in scope from these answers",
    possible_exemption: "A possible exception needs checking",
    no_trigger_found: "No coverage trigger was found from these answers",
    unclear: "More information is needed",
  }[status];
}

function roleLabel(role) {
  return {
    provider: "Possible provider",
    professional_deployer: "Possible professional deployer",
    importer: "Possible importer",
    distributor: "Possible distributor",
    product_manufacturer: "Possible product manufacturer",
    public_authority: "Possible public-authority deployer or provider",
    affected_person: "Affected person; the responsible organisation's role remains to be identified",
    personal_user: "Possible purely personal user",
    unsure: "Role is unclear",
  }[role];
}

function nextAction(status, highRiskSignal, transparencySignal) {
  if (status === "no_trigger_found") {
    return "Record the EU-connection facts and check again if the provider, deployer, output location or affected people change.";
  }
  if (status === "possible_exemption") {
    return "Confirm every condition of the possible exception against Article 2 and document any professional, civilian or real-world use.";
  }
  if (status === "unclear") {
    return "Identify the missing role, EU connection, intended purpose or testing fact before making a launch decision.";
  }
  if (highRiskSignal) {
    return "Map the exact intended purpose to Article 6 and Annex I or III, then identify the responsible provider and deployer.";
  }
  if (transparencySignal) {
    return "Run the Article 50 content-labelling check and record who provides, publishes or operates the system.";
  }
  return "Confirm the organisation's legal role and review the exact operator duties linked to this use.";
}

function requireCoverageInput(input) {
  for (const key of ["euConnection", "role", "intendedUse", "context", "organisationSize", "timing"]) {
    if (!input?.[key]) throw new TypeError(`Missing coverage answer: ${key}`);
  }
}

function compareDate(left, right) {
  return String(left).localeCompare(String(right), "en");
}
