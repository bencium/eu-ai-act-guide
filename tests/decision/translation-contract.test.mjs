import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  evaluateTool,
  SOURCE_CATALOG,
  TOOL_DEFINITIONS,
} from "../../src/lib/decision/browser.mjs";
import { coverageFixture } from "./fixtures.mjs";

const english = JSON.parse(await readFile(
  new URL("../../src/i18n/locales/en.json", import.meta.url),
  "utf8",
));

test("every question and result identifier resolves to authored English", () => {
  const required = new Set();
  for (const definition of Object.values(TOOL_DEFINITIONS)) {
    required.add(definition.titleKey);
    required.add(definition.introKey);
    for (const node of definition.nodes) {
      required.add(node.questionKey);
      for (const option of node.options) required.add(option.labelKey);
    }
  }

  const results = decisionResults();
  for (const result of results) collectResultKeys(result, required);

  const missing = [...required].filter((key) => typeof english[key] !== "string").sort();
  assert.deepEqual(missing, [], `Missing dynamic decision translations: ${missing.join(", ")}`);
});

function decisionResults() {
  const results = [];
  const capture = (tool, input) => results.push(evaluateTool(tool, input));

  const settings = optionIds("what-it-means", "setting");
  for (const setting of settings) capture("what-it-means", {
    setting,
    perceivedEffect: "important_decision",
    decisionImpact: "work_or_education_outcome",
    humanHelpRoute: "available",
  });
  capture("what-it-means", {
    setting: "ordinary_consumer_or_workplace",
    perceivedEffect: "other_or_unsure",
    humanHelpRoute: "not_requested",
  });

  const coverageBase = coverageFixture();
  for (const euConnection of optionIds("does-it-apply", "euConnection")) {
    capture("does-it-apply", { ...coverageBase, euConnection });
  }
  for (const role of optionIds("does-it-apply", "role")) {
    capture("does-it-apply", { ...coverageBase, role });
  }
  for (const intendedUse of optionIds("does-it-apply", "intendedUse")) {
    capture("does-it-apply", { ...coverageBase, intendedUse });
  }
  for (const context of optionIds("does-it-apply", "context")) {
    const additional = context === "pre_market_research_testing" ? "specific_fact_no" : undefined;
    capture("does-it-apply", { ...coverageBase, context, ...(additional ? { additional } : {}) });
  }
  for (const organisationSize of optionIds("does-it-apply", "organisationSize")) {
    capture("does-it-apply", { ...coverageBase, organisationSize });
  }
  for (const timing of optionIds("does-it-apply", "timing")) {
    capture("does-it-apply", { ...coverageBase, timing });
  }
  for (const additional of ["specific_fact_yes", "specific_fact_no", "unsure"]) {
    capture("does-it-apply", {
      ...coverageBase,
      intendedUse: "biometric_or_emotion",
      additional,
    });
    capture("does-it-apply", {
      ...coverageBase,
      context: "pre_market_research_testing",
      additional,
    });
  }
  for (const identifiedProvision of ["article_5", "authority_information", "gpai"]) {
    capture("does-it-apply", {
      ...coverageBase,
      additional: { identifiedProvision },
    });
  }

  const label = (overrides) => capture("label-content", {
    role: "professional_deployer",
    contentType: "video",
    change: "generated",
    realisticOrPlausible: "true",
    disclosureAtFirstExposure: "true",
    ...overrides,
  });
  label({ role: "personal_user" });
  label({ role: "unsure" });
  for (const systemPlacedBefore2026August2 of ["true", "false", "unsure"]) {
    label({ role: "provider", systemPlacedBefore2026August2 });
  }
  label({ role: "provider", change: "standard_editing" });
  for (const interactionObviouslyAI of ["true", "false", "unsure"]) {
    label({
      role: "provider",
      contentType: "chatbot_agent",
      change: undefined,
      realisticOrPlausible: undefined,
      interactionObviouslyAI,
    });
  }
  for (const realisticOrPlausible of ["true", "false", "unsure"]) {
    label({ realisticOrPlausible });
  }
  label({ contentType: "text", realisticOrPlausible: undefined, publicInterest: "false" });
  label({ contentType: "text", realisticOrPlausible: undefined, publicInterest: "unsure" });
  for (const editorialControl of ["spelling_only", "none", "not_applicable", "unsure"]) {
    label({
      contentType: "text",
      realisticOrPlausible: undefined,
      publicInterest: "true",
      editorialControl,
    });
  }
  for (const editorialResponsibilityAccepted of ["true", "false", "unsure"]) {
    label({
      contentType: "text",
      realisticOrPlausible: undefined,
      publicInterest: "true",
      editorialControl: "substantive_final",
      editorialResponsibilityAccepted,
    });
  }
  for (const setting of ["work", "education", "other"]) {
    label({ contentType: "emotion_recognition", change: undefined, realisticOrPlausible: undefined, setting });
  }
  label({ contentType: "biometric_categorisation", change: undefined, realisticOrPlausible: undefined, setting: "other" });
  label({ disclosureAtFirstExposure: "unsure" });

  return results;
}

function collectResultKeys(result, required) {
  required.add(result.statusKey);
  required.add(result.roleId);
  required.add(result.nextActionId);
  required.add(result.disclaimerId);
  for (const key of [...result.unknownIds, ...result.detailIds]) required.add(key);
  for (const date of result.dates) required.add(date.id).add(date.stateKey);
  for (const sourceId of result.sourceIds) {
    const source = SOURCE_CATALOG[sourceId];
    assert.ok(source, `Unknown source identifier: ${sourceId}`);
    required.add(`authority.${source.authority}`);
  }
  if (result.penalty) {
    required.add(result.penalty.regimeId);
    required.add(result.penalty.bandId);
    required.add(result.penalty.calculationRuleId);
    for (const key of result.penalty.factorIds) required.add(key);
  }
  for (const duty of result.duties ?? []) {
    required.add(duty.channelId);
    required.add(duty.explanationKey);
    if (duty.exampleKey) required.add(duty.exampleKey);
  }
}

function optionIds(toolId, nodeId) {
  return TOOL_DEFINITIONS[toolId].nodes
    .find((node) => node.id === nodeId)
    .options.map((option) => option.id);
}
