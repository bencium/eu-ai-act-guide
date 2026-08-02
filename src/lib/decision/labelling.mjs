import { DATES, OFFICIAL } from "./sources.mjs";
import {
  assertCautiousResult,
  DISCLAIMER,
  recordAnswers,
  resultDate,
  uniqueCitations,
} from "./shared.mjs";

const ROLES = ["provider", "professional_deployer", "personal_user", "unsure"];
const CONTENT_TYPES = [
  "text",
  "image",
  "audio",
  "video",
  "mixed",
  "chatbot_agent",
  "emotion_recognition",
  "biometric_categorisation",
];

export const LABELLING_GRAPH = Object.freeze({
  id: "label-content",
  start: "role",
  nodes: [
    node("role", ROLES, "contentType"),
    {
      id: "contentType",
      options: CONTENT_TYPES.map((id) => ({
        id,
        next: id === "chatbot_agent"
          ? "interactionObviouslyAI"
          : id === "emotion_recognition" || id === "biometric_categorisation"
            ? "setting"
            : "change",
      })),
    },
    {
      id: "change",
      options: [
        { id: "generated", next: "realisticOrPlausible" },
        { id: "substantially_manipulated", next: "realisticOrPlausible" },
        { id: "standard_editing", next: "result:unclear" },
        { id: "non_substantive", next: "result:unclear" },
        { id: "not_applicable", next: "result:unclear" },
      ],
    },
    node("realisticOrPlausible", ["true", "false", "not_applicable", "unsure"], "publicInterest"),
    node("publicInterest", ["true", "false", "not_applicable", "unsure"], "editorialControl"),
    {
      id: "editorialControl",
      options: [
        { id: "substantive_final", next: "editorialResponsibilityAccepted" },
        { id: "spelling_only", next: "disclosureAtFirstExposure" },
        { id: "none", next: "disclosureAtFirstExposure" },
        { id: "not_applicable", next: "disclosureAtFirstExposure" },
        { id: "unsure", next: "disclosureAtFirstExposure" },
      ],
    },
    node("editorialResponsibilityAccepted", ["true", "false", "not_applicable", "unsure"], "systemPlacedBefore2026August2"),
    node("interactionObviouslyAI", ["true", "false", "unsure"], "disclosureAtFirstExposure"),
    node("setting", ["work", "education", "other"], "disclosureAtFirstExposure"),
    node("systemPlacedBefore2026August2", ["true", "false", "unsure"], "disclosureAtFirstExposure"),
    node("disclosureAtFirstExposure", ["true", "false", "not_applicable", "unsure"], "result:unclear"),
  ],
  resultIds: ["result:required", "result:not_required_from_these_answers", "result:unclear"],
});

function node(id, optionIds, next) {
  return { id, options: optionIds.map((optionId) => ({ id: optionId, next })) };
}

const MEDIA = new Set(["text", "image", "audio", "video", "mixed"]);
const DEEPFAKE_MEDIA = new Set(["image", "audio", "video", "mixed"]);
const MATERIAL_CHANGE = new Set(["generated", "substantially_manipulated"]);

/** @param {import('./types').LabellingInput} input */
export function evaluateLabelling(input, asOfDate = "2026-08-02") {
  requireLabellingInput(input);
  const known = [
    `Role selected: ${input.role}`,
    `Content type selected: ${input.contentType}`,
    ...(input.change ? [`Change selected: ${input.change}`] : []),
  ];
  const unknown = [];
  const duties = [];
  let decisiveUnknown = false;

  if (input.role === "unsure") {
    unknown.push("Whether the visitor is the provider, a professional deployer or a purely personal user");
    decisiveUnknown = true;
  }

  if (input.role === "personal_user") {
    const result = baseResult(
      "not_required_from_these_answers",
      input,
      known,
      ["Whether a provider or professional publisher has a separate duty"],
      [],
      [],
      "Keep the activity purely personal and check again if the content is published for a professional, organisational or economic purpose.",
    );
    return assertCautiousResult(result);
  }

  if (input.role === "provider" && MEDIA.has(input.contentType)) {
    if (MATERIAL_CHANGE.has(input.change)) {
      duties.push(duty(
        "machine_readable_marking",
        "machine_readable",
        "The provider must apply an effective, interoperable, robust and reliable machine-readable marking to generated or substantially manipulated output.",
        [OFFICIAL.providerMarking, OFFICIAL.transparency, OFFICIAL.guidelines],
      ));
    } else {
      known.push("The answer describes only standard editing, a non-substantive change or no relevant content change");
    }
  }

  if (input.contentType === "chatbot_agent" && input.role === "provider") {
    if (input.interactionObviouslyAI === undefined) {
      unknown.push("Whether a reasonably informed, observant and circumspect person would find the AI interaction obvious");
      decisiveUnknown = true;
    } else if (!input.interactionObviouslyAI) {
      duties.push(duty(
        "direct_interaction_notice",
        "before_or_at_interaction",
        "The provider must design the system so the person is informed that they are interacting with AI.",
        [OFFICIAL.directInteraction, OFFICIAL.disclosurePresentation, OFFICIAL.transparency, OFFICIAL.guidelines],
        "You are interacting with an AI system.",
      ));
    } else {
      known.push("The AI interaction was answered as genuinely obvious to the person");
    }
  }

  if (
    input.role === "professional_deployer" &&
    DEEPFAKE_MEDIA.has(input.contentType) &&
    MATERIAL_CHANGE.has(input.change)
  ) {
    if (input.realisticOrPlausible === undefined) {
      unknown.push("Whether the content resembles a real or plausible person, object, place, entity or event and falsely appears authentic");
      decisiveUnknown = true;
    } else if (input.realisticOrPlausible) {
      duties.push(duty(
        "visible_or_audible_deepfake_disclosure",
        "visible_or_audible",
        "A professional deployer must disclose that this deepfake content was artificially generated or manipulated.",
        [OFFICIAL.deepfakeDisclosure, OFFICIAL.disclosurePresentation, OFFICIAL.transparency, OFFICIAL.guidelines],
        input.contentType === "audio"
          ? "This audio was artificially generated or manipulated."
          : "This content was artificially generated or manipulated.",
      ));
    } else {
      known.push("The content was answered as clearly not realistic or plausible, so the deepfake condition was not identified");
    }
  }

  if (
    input.role === "professional_deployer" &&
    input.contentType === "text" &&
    MATERIAL_CHANGE.has(input.change)
  ) {
    if (input.publicInterest === undefined) {
      unknown.push("Whether the text is published to inform the public about a matter of public interest");
      decisiveUnknown = true;
    } else if (input.publicInterest) {
      const substantive = input.editorialControl === "substantive_final";
      if (input.editorialControl === "unsure") {
        unknown.push("Whether the public-interest text received substantive final human review or editorial control");
        decisiveUnknown = true;
      } else if (substantive && input.editorialResponsibilityAccepted === undefined) {
        unknown.push("Whether a person or organisation accepts editorial responsibility for the published text");
        decisiveUnknown = true;
      } else if (!(substantive && input.editorialResponsibilityAccepted)) {
        duties.push(duty(
          "public_interest_text_disclosure",
          "visible_or_audible",
          "A professional deployer must disclose AI-generated or manipulated public-interest text unless the qualifying human review and editorial-responsibility conditions are both met.",
          [OFFICIAL.publicInterestText, OFFICIAL.disclosurePresentation, OFFICIAL.transparency, OFFICIAL.guidelines],
          "This text was generated or substantially edited using AI.",
        ));
      } else {
        known.push("Substantive final human review and accepted editorial responsibility were both confirmed");
      }
    } else {
      known.push("The text was answered as not intended to inform the public about a matter of public interest");
    }
  }

  if (
    input.role === "professional_deployer" &&
    (input.contentType === "emotion_recognition" || input.contentType === "biometric_categorisation")
  ) {
    duties.push(duty(
      "emotion_or_biometric_notice",
      "before_or_at_interaction",
      "A professional deployer must inform people exposed to an emotion-recognition or biometric-categorisation system.",
      [OFFICIAL.emotionBiometricNotice, OFFICIAL.disclosurePresentation, OFFICIAL.transparency, OFFICIAL.guidelines],
      `An AI ${input.contentType === "emotion_recognition" ? "emotion-recognition" : "biometric-categorisation"} system is being used.`,
    ));
  }

  if (
    input.role === "provider" &&
    MEDIA.has(input.contentType) &&
    MATERIAL_CHANGE.has(input.change) &&
    input.systemPlacedBefore2026August2 === undefined
  ) {
    unknown.push("Whether the generative system was placed on the market before 2 August 2026, which changes the provider-marking transition date");
    decisiveUnknown = true;
  }

  if (
    input.contentType === "emotion_recognition" &&
    (input.setting === "work" || input.setting === "education")
  ) {
    duties.push({
      ...duty(
        "prohibited_use_check",
        "separate_legal_check",
        "Emotion inference in work or education requires a separate Article 5 prohibited-practice check. A notice cannot make a prohibited use lawful.",
        [OFFICIAL.prohibited, OFFICIAL.application, OFFICIAL.amendment],
      ),
      required: true,
    });
  }

  const hasHumanFacingDuty = duties.some((item) =>
    item.channel === "before_or_at_interaction" || item.channel === "visible_or_audible",
  );
  if (hasHumanFacingDuty) {
    if (input.disclosureAtFirstExposure === false) {
      known.push("The required disclosure was answered as absent or later than first exposure");
    } else if (input.disclosureAtFirstExposure === undefined) {
      unknown.push("Whether the disclosure is clear, accessible and present no later than first exposure");
    } else {
      known.push("Disclosure at first exposure was confirmed");
    }
  }

  const labellingDuties = duties.filter((item) => item.channel !== "separate_legal_check");
  const status = decisiveUnknown
    ? "unclear"
    : labellingDuties.length > 0
      ? "required"
      : "not_required_from_these_answers";
  const citations = uniqueCitations(duties.flatMap((item) => item.citations));
  const dates = duties.length > 0 ? labellingDates(input, asOfDate) : [];
  const result = baseResult(
    status,
    input,
    known,
    unknown,
    duties,
    dates,
    labellingNextAction(status, duties),
    citations,
  );
  return assertCautiousResult(result);
}

function baseResult(status, input, known, unknown, duties, dates, nextAction, citations = []) {
  return {
    status,
    statusText: {
      required: "An Article 50 marking, disclosure or interaction notice is required from these answers",
      not_required_from_these_answers: "No visible Article 50 label was identified from these answers",
      unclear: "More information is needed to identify an Article 50 duty",
    }[status],
    answers: labellingAnswers(input),
    known,
    unknown,
    possibleRole: {
      provider: "Possible provider",
      professional_deployer: "Possible professional deployer or publisher",
      personal_user: "Possible purely personal user",
      unsure: "Role is unclear",
    }[input.role],
    citations,
    dates,
    duties,
    optionalIcon: {
      available: duties.some((item) => item.channel === "visible_or_audible"),
      replacesWords: false,
      provesCompliance: false,
      url: OFFICIAL.icons.url,
    },
    nextAction,
    disclaimer: DISCLAIMER,
  };
}

function duty(kind, channel, explanation, citations, exampleWording) {
  return {
    kind,
    channel,
    required: true,
    explanation,
    ...(exampleWording ? { exampleWording } : {}),
    citations,
  };
}

function labellingDates(input, asOfDate) {
  const dates = [];
  if (
    input.role === "provider" &&
    input.systemPlacedBefore2026August2 &&
    MEDIA.has(input.contentType) &&
    MATERIAL_CHANGE.has(input.change)
  ) {
    dates.push(resultDate(
      DATES.providerMarkingTransition,
      compareDate(asOfDate, DATES.providerMarkingTransition) < 0 ? "transition" : "applies",
      "Narrow transition date for provider machine-readable marking of relevant existing generative systems",
      [OFFICIAL.providerMarking, OFFICIAL.transparency],
    ));
  } else {
    dates.push(resultDate(
      DATES.article50,
      compareDate(asOfDate, DATES.article50) < 0 ? "future" : "applies",
      "Article 50 transparency application date",
      [OFFICIAL.transparency],
    ));
  }
  if (
    input.contentType === "emotion_recognition" &&
    (input.setting === "work" || input.setting === "education")
  ) {
    dates.unshift(resultDate(
      DATES.article5Existing,
      compareDate(asOfDate, DATES.article5Existing) < 0 ? "future" : "applies",
      "Application date for the original Article 5 prohibited practices",
      [OFFICIAL.prohibited, OFFICIAL.application],
    ));
  }
  return dates;
}

function labellingAnswers(input) {
  return recordAnswers(input, [
    "role",
    "contentType",
    "change",
    "realisticOrPlausible",
    "publicInterest",
    "editorialControl",
    "editorialResponsibilityAccepted",
    "disclosureAtFirstExposure",
    "interactionObviouslyAI",
    "setting",
    "systemPlacedBefore2026August2",
  ]);
}

function labellingNextAction(status, duties) {
  if (status === "unclear") {
    return "Confirm the missing role, realism, public-interest or editorial-responsibility fact before publishing or exposing people to the system.";
  }
  if (status === "not_required_from_these_answers") {
    return "Record the supplied facts and separately check platform rules, consumer law, copyright, privacy and applicable national law.";
  }
  if (duties.some((item) => item.kind === "prohibited_use_check")) {
    return "Pause the use and obtain a human Article 5 review; prepare the Article 50 notice only if the underlying use can proceed.";
  }
  return "Implement each listed duty in its stated channel and verify that people receive any visible, audible or interaction notice no later than first exposure.";
}

function requireLabellingInput(input) {
  for (const key of ["role", "contentType"]) {
    if (!input?.[key]) throw new TypeError(`Missing labelling answer: ${key}`);
  }
  if (MEDIA.has(input.contentType) && !input.change) {
    throw new TypeError("Missing labelling answer: change");
  }
}

function compareDate(left, right) {
  return String(left).localeCompare(String(right), "en");
}
