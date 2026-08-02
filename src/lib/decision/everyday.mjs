import { DATES, OFFICIAL } from "./sources.mjs";
import {
  assertCautiousResult,
  DISCLAIMER,
  recordAnswers,
  resultDate,
  uniqueCitations,
} from "./shared.mjs";

const SETTINGS = [
  "work_or_recruitment",
  "education_or_training",
  "health_insurance_credit_services",
  "government_justice_policing_migration",
  "online_content_chatbot_agent",
  "biometric_emotion",
  "ordinary_consumer_or_workplace",
];

export const EVERYDAY_GRAPH = Object.freeze({
  id: "what-it-means",
  start: "setting",
  nodes: [
    {
      id: "setting",
      options: SETTINGS.map((id) => ({ id, next: "perceivedEffect" })),
    },
    {
      id: "perceivedEffect",
      options: [
        "recommendation_or_ranking",
        "important_decision",
        "monitoring_or_profiling",
        "ai_interaction_or_content",
        "identity_biometric_or_emotion",
      ].map((id) => ({ id, next: "decisionImpact" })).concat([
        { id: "other_or_unsure", next: "humanHelpRoute" },
      ]),
    },
    {
      id: "decisionImpact",
      options: [
        "access_price_or_eligibility",
        "work_or_education_outcome",
        "official_or_legal_outcome",
        "information_or_disclosure_only",
        "no_significant_effect_known",
        "unsure",
      ].map((id) => ({ id, next: "humanHelpRoute" })),
    },
    {
      id: "humanHelpRoute",
      options: ["available", "unavailable", "not_requested", "unsure"]
        .map((id) => ({ id, next: "result:unclear" })),
    },
  ],
  resultIds: ["result:unclear"],
});

const GUIDANCE = Object.freeze({
  work_or_recruitment: {
    why: "AI used to recruit, select, allocate work, monitor or evaluate workers may affect access to employment and working conditions.",
    ask: [
      "Ask whether AI was used in the decision and which organisation is responsible for it.",
      "Ask how a person can review, explain or challenge an AI-supported decision.",
      "Ask the employer or recruiter what human oversight is available.",
    ],
    routes: ["The employer, recruiter, worker representative or relevant national authority may be an appropriate first contact."],
    citations: [OFFICIAL.highRisk, OFFICIAL.deployers, OFFICIAL.explanation],
    dateKind: "annexIII",
  },
  education_or_training: {
    why: "AI used for admission, access, assessment, learning outcomes or monitoring may affect education opportunities.",
    ask: [
      "Ask the school, university or training provider whether AI influenced the decision.",
      "Ask for a human contact who can explain or review the outcome.",
      "Ask what information and challenge route are available to the learner or family.",
    ],
    routes: ["The education provider, its complaints route or the relevant national authority may be an appropriate contact."],
    citations: [OFFICIAL.highRisk, OFFICIAL.deployers, OFFICIAL.explanation],
    dateKind: "annexIII",
  },
  health_insurance_credit_services: {
    why: "AI used in essential services, credit, life or health insurance may affect access, price or an important individual decision.",
    ask: [
      "Ask which organisation made the decision and whether AI had a significant role.",
      "Ask for an understandable explanation and a human route to question the outcome.",
      "Ask which sector regulator or complaints body covers the service.",
    ],
    routes: ["The service provider, sector complaints body and relevant national authority may each have a role."],
    citations: [OFFICIAL.highRisk, OFFICIAL.explanation],
    dateKind: "annexIII",
  },
  government_justice_policing_migration: {
    why: "AI in public services, law enforcement, migration, borders or justice may affect rights, access to services or official decisions.",
    ask: [
      "Ask which public body is responsible and whether AI influenced the decision.",
      "Ask for the human review, explanation and challenge route available in this specific process.",
      "Ask for the competent national authority when the responsible body cannot answer.",
    ],
    routes: ["The responsible public body, an ombudsman, a court or the relevant national authority may be relevant, depending on the decision."],
    citations: [OFFICIAL.highRisk, OFFICIAL.explanation],
    dateKind: "annexIII",
  },
  online_content_chatbot_agent: {
    why: "People may need to be told when they are interacting with AI or when certain public content was generated or manipulated.",
    ask: [
      "Ask whether you are interacting with a person or an AI system.",
      "Ask who operates the service and how to reach a human contact.",
      "For realistic synthetic media or public-interest text, ask how AI involvement is disclosed.",
    ],
    routes: ["The provider, professional publisher, platform or relevant national authority may be an appropriate contact."],
    citations: [OFFICIAL.transparency, OFFICIAL.guidelines],
    dateKind: "article50",
  },
  biometric_emotion: {
    why: "Biometric categorisation, identification and emotion inference can engage transparency, high-risk or prohibited-practice rules depending on the purpose and setting.",
    ask: [
      "Ask what biometric or emotion system is used, for which purpose and by which organisation.",
      "Ask whether people were informed before exposure and what human review exists.",
      "In work or education, ask for an immediate check of the Article 5 restrictions on emotion inference.",
    ],
    routes: ["The organisation using the system, a data-protection authority or the relevant AI market-surveillance authority may be relevant."],
    citations: [OFFICIAL.prohibited, OFFICIAL.application, OFFICIAL.highRisk, OFFICIAL.transparency],
    dateKind: "mixed",
  },
  ordinary_consumer_or_workplace: {
    why: "An ordinary AI-assisted activity may still involve transparency, workplace or sector rules, but the short setting answer does not identify a specific legal trigger.",
    ask: [
      "Ask who provides and who operates the AI system.",
      "Ask what the AI does, who is affected and whether a person makes the final decision.",
      "Ask for a human contact when an outcome affects you.",
    ],
    routes: ["The organisation responsible for the AI use is the first place to request the missing facts."],
    citations: [OFFICIAL.scope, OFFICIAL.roles],
    dateKind: "depends",
  },
});

/** @param {import('./types').EverydayInput} input */
export function evaluateEveryday(input, asOfDate = "2026-08-02") {
  const guidance = GUIDANCE[input?.setting];
  if (!guidance) throw new TypeError("A supported everyday setting is required");
  if (!input.perceivedEffect) throw new TypeError("A perceived-effect answer is required");
  if (!input.humanHelpRoute) throw new TypeError("A human-help-route answer is required");
  const needsImpact = input.perceivedEffect !== "other_or_unsure";
  if (needsImpact && !input.decisionImpact) throw new TypeError("A decision-impact answer is required on this path");

  const unknown = [
    "The provider and deployer",
    "The system's intended purpose and technical operation",
    "Which other EU, national or sector rules apply",
  ];
  if (input.perceivedEffect === "other_or_unsure") unknown.push("How the AI use affects the person");
  if (input.decisionImpact === "unsure" || !input.decisionImpact) {
    unknown.push("Whether the use makes or supports a legally significant decision");
  }
  if (input.humanHelpRoute === "unsure" || input.humanHelpRoute === "not_requested") {
    unknown.push("Whether a human contact or challenge route is available");
  }

  const result = {
    status: "unclear",
    statusText: "This use may matter; the short answer cannot decide whether the system is lawful",
    answers: recordAnswers(input, ["setting", "perceivedEffect", "decisionImpact", "humanHelpRoute"]),
    known: [
      `Setting selected: ${input.setting}`,
      `Perceived effect selected: ${input.perceivedEffect}`,
      ...(input.decisionImpact ? [`Decision impact selected: ${input.decisionImpact}`] : []),
      `Human-help route selected: ${input.humanHelpRoute}`,
    ],
    unknown,
    possibleRole: "Affected person or someone helping an affected person",
    citations: uniqueCitations([...guidance.citations, OFFICIAL.amendment]),
    dates: everydayDates(guidance.dateKind, asOfDate),
    whyItMayMatter: guidance.why,
    whatPersonCanAsk: guidance.ask,
    possibleRoutes: guidance.routes,
    nextAction: guidance.ask[0],
    disclaimer: DISCLAIMER,
  };
  return assertCautiousResult(result);
}

function everydayDates(kind, asOfDate) {
  if (kind === "article50") {
    return [resultDate(
      DATES.article50,
      compareDate(asOfDate, DATES.article50) < 0 ? "future" : "applies",
      "Article 50 transparency application date",
      [OFFICIAL.transparency],
    )];
  }
  if (kind === "annexIII") {
    return [resultDate(
      DATES.annexIII,
      compareDate(asOfDate, DATES.annexIII) < 0 ? "future" : "applies",
      "Relevant Annex III high-risk application date",
      [OFFICIAL.highRisk],
    )];
  }
  if (kind === "mixed") {
    return [
      resultDate(DATES.article5Existing, compareDate(asOfDate, DATES.article5Existing) < 0 ? "future" : "applies", "Application date for the original Article 5 prohibited practices", [OFFICIAL.prohibited, OFFICIAL.application]),
      resultDate(DATES.amendedArticle5, compareDate(asOfDate, DATES.amendedArticle5) < 0 ? "future" : "applies", "Application date for new amended Article 5 provisions", [OFFICIAL.prohibited]),
      resultDate(DATES.article50, compareDate(asOfDate, DATES.article50) < 0 ? "future" : "applies", "Article 50 transparency application date", [OFFICIAL.transparency]),
      resultDate(DATES.annexIII, compareDate(asOfDate, DATES.annexIII) < 0 ? "future" : "applies", "Relevant Annex III high-risk application date", [OFFICIAL.highRisk]),
    ];
  }
  return [resultDate(
    DATES.article50,
    "depends",
    "The applicable date depends on the provision identified after the missing facts are confirmed",
  )];
}

function compareDate(left, right) {
  return String(left).localeCompare(String(right), "en");
}
