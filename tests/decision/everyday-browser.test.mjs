import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  evaluateTool,
  QUESTION_CATALOG,
  SOURCE_CATALOG,
  TOOL_DEFINITIONS,
} from "../../src/lib/decision/browser.mjs";
import { evaluateEveryday } from "../../src/lib/decision/everyday.mjs";
import { evaluateLabelling } from "../../src/lib/decision/labelling.mjs";
import { coverageFixture, labelFixture } from "./fixtures.mjs";

test("the everyday guide stays educational and records the selected setting", () => {
  const result = evaluateEveryday({
    setting: "work_or_recruitment",
    perceivedEffect: "important_decision",
    decisionImpact: "work_or_education_outcome",
    humanHelpRoute: "unavailable",
  });
  assert.equal(result.status, "unclear");
  assert.deepEqual(result.answers, [
    { questionId: "setting", answerId: "work_or_recruitment" },
    { questionId: "perceivedEffect", answerId: "important_decision" },
    { questionId: "decisionImpact", answerId: "work_or_education_outcome" },
    { questionId: "humanHelpRoute", answerId: "unavailable" },
  ]);
  assert.ok(result.whatPersonCanAsk.length >= 3);
  assert.ok(result.citations.some((citation) => citation.reference.includes("Annexes")));
});

test("the everyday guide uses a three-question path when the perceived effect is unknown", () => {
  const result = evaluateTool("what-it-means", {
    setting: "ordinary_consumer_or_workplace",
    perceivedEffect: "other_or_unsure",
    humanHelpRoute: "not_requested",
  });
  assert.equal(result.status, "unclear");
  assert.equal(result.answerSummaryIds.length, 3);
  assert.ok(result.unknownIds.includes("unknown.effect"));
});

test("the browser result preserves every everyday question and possible contact route", async () => {
  const result = evaluateTool("what-it-means", {
    setting: "work_or_recruitment",
    perceivedEffect: "important_decision",
    decisionImpact: "work_or_education_outcome",
    humanHelpRoute: "unavailable",
  });
  const english = JSON.parse(await readFile(
    new URL("../../src/i18n/locales/en.json", import.meta.url),
    "utf8",
  ));
  const component = await readFile(
    new URL("../../src/components/DecisionTool.astro", import.meta.url),
    "utf8",
  );

  assert.equal(result.personAskListKey, "tools.what-it-means.asks.work_or_recruitment");
  assert.equal(result.possibleRouteListKey, "tools.what-it-means.routes.work_or_recruitment");
  assert.equal(english[result.personAskListKey].length, 3);
  assert.equal(english[result.possibleRouteListKey].length, 1);
  assert.match(component, /translatedList\(evaluated\.personAskListKey\)/);
  assert.match(component, /translatedList\(evaluated\.possibleRouteListKey\)/);
});

test("an unknown sector match stays visible without assigning an Annex date", () => {
  const result = evaluateTool("does-it-apply", coverageFixture({
    intendedUse: "employment",
    industry: "unsure",
  }));
  assert.equal(result.status, "likely_in_scope");
  assert.ok(result.unknownIds.includes("unknown.coverage.industry"));
  assert.equal(result.dates.some((item) => item.id === "date.annex-iii"), false);
});

test("browser tool definitions expose stable question and option translation keys", () => {
  assert.deepEqual(Object.keys(TOOL_DEFINITIONS).sort(), [
    "does-it-apply",
    "label-content",
    "what-it-means",
  ]);
  for (const [toolId, definition] of Object.entries(TOOL_DEFINITIONS)) {
    assert.equal(definition.id, toolId);
    assert.ok(definition.titleKey.startsWith("tools."));
    assert.ok(definition.nodes.length > 0);
    for (const node of definition.nodes) {
      assert.ok(node.questionKey.startsWith(`tools.${toolId}.questions.`));
      assert.ok(node.options.every((option) => option.labelKey.startsWith(`tools.${toolId}.options.`)));
      assert.ok(node.options.every((option) => typeof option.nextId === "string"));
    }
    assert.equal(QUESTION_CATALOG[toolId], definition.nodes);
  }
});

test("every browser option points to a known node or declared result and conditional nodes expose visibility", () => {
  for (const definition of Object.values(TOOL_DEFINITIONS)) {
    const nodeIds = new Set(definition.nodes.map((node) => node.id));
    for (const node of definition.nodes) {
      for (const option of node.options) {
        assert.ok(
          nodeIds.has(option.nextId) || option.nextId.startsWith("result:"),
          `${definition.id}.${node.id}.${option.id} points to ${option.nextId}`,
        );
      }
    }
  }
  assert.ok(TOOL_DEFINITIONS["does-it-apply"].nodes.find((node) => node.id === "industry").showWhen);
  assert.ok(TOOL_DEFINITIONS["does-it-apply"].nodes.find((node) => node.id === "additional").showWhen);
  assert.ok(TOOL_DEFINITIONS["label-content"].nodes.find((node) => node.id === "realisticOrPlausible").showWhen);
  assert.ok(TOOL_DEFINITIONS["label-content"].nodes.find((node) => node.id === "editorialControl").showWhen);
  assert.ok(TOOL_DEFINITIONS["label-content"].nodes.find((node) => node.id === "interactionObviouslyAI").showWhen);
});

test("source catalogue preserves exact article references and official URLs", () => {
  const source = SOURCE_CATALOG["reg-2024-1689-art-50"];
  assert.equal(source.authority, "law");
  assert.equal(source.reference, "Article 50(1)–(6)");
  assert.match(source.url, /^https:\/\/eur-lex\.europa\.eu\//);
});

test("browser evaluation returns translation identifiers rather than English explanations", () => {
  const result = evaluateTool("does-it-apply", coverageFixture({
    intendedUse: "content_generation",
  }));
  assert.equal(result.toolId, "does-it-apply");
  assert.equal(result.statusKey, "tools.does-it-apply.status.likely_in_scope");
  assert.ok(result.answerSummaryIds.some((answer) => answer.questionId === "intendedUse"));
  assert.ok(result.knownIds.every((id) => id.startsWith("known.")));
  assert.ok(result.unknownIds.every((id) => id.startsWith("unknown.")));
  assert.ok(result.detailIds.every((id) => id.startsWith("tools.")));
  assert.ok(result.nextActionId.startsWith("tools."));
  assert.equal(result.disclaimerId, "disclaimer.short");
  assert.ok(result.sourceIds.includes("reg-2024-1689-art-50"));
});

test("browser labelling output keeps technical and visible duties separate", () => {
  const provider = evaluateTool("label-content", labelFixture({ role: "provider", contentType: "video" }));
  const publisher = evaluateTool("label-content", labelFixture({ role: "professional_deployer", contentType: "video" }));
  assert.deepEqual(provider.duties.map((duty) => duty.id), ["machine_readable_marking"]);
  assert.deepEqual(publisher.duties.map((duty) => duty.id), ["visible_or_audible_deepfake_disclosure"]);
});

test("provider machine marking does not ask for a human-facing first-exposure notice", () => {
  const disclosureNode = TOOL_DEFINITIONS["label-content"].nodes.find(
    (node) => node.id === "disclosureAtFirstExposure",
  );
  const rules = disclosureNode.showWhen.any;
  assert.equal(rules.some((rule) => rule.all?.some(
    (condition) => condition.questionId === "contentType" && condition.answerIds.includes("video"),
  ) && rule.all?.some(
    (condition) => condition.questionId === "role" && condition.answerIds.includes("provider"),
  )), false);

  const result = evaluateLabelling({
    role: "provider",
    contentType: "video",
    change: "generated",
    systemPlacedBefore2026August2: false,
  });
  assert.equal(result.status, "required");
  assert.equal(result.unknown.some((fact) => fact.includes("first exposure")), false);
});

test("browser option ids are converted to booleans before legal evaluation", () => {
  const fantastical = evaluateTool("label-content", {
    role: "professional_deployer",
    contentType: "image",
    change: "generated",
    realisticOrPlausible: "false",
    disclosureAtFirstExposure: "not_applicable",
  });
  assert.equal(fantastical.status, "not_required_from_these_answers");

  const realWorldTesting = evaluateTool("does-it-apply", {
    ...coverageFixture({ context: "pre_market_research_testing" }),
    additional: "specific_fact_yes",
  });
  assert.equal(realWorldTesting.status, "likely_in_scope");
});

test("browser public-interest false is not treated as true", () => {
  const result = evaluateTool("label-content", {
    role: "professional_deployer",
    contentType: "text",
    change: "generated",
    publicInterest: "false",
  });
  assert.equal(result.status, "not_required_from_these_answers");
  assert.equal(result.duties.length, 0);
});

test("a reported missing notice stays a known fact, while an unsure notice stays unknown", () => {
  const absent = evaluateTool("label-content", {
    role: "professional_deployer",
    contentType: "video",
    change: "generated",
    realisticOrPlausible: "true",
    disclosureAtFirstExposure: "not_applicable",
  });
  assert.equal(absent.status, "required");
  assert.equal(absent.unknownIds.includes("tools.label-content.questions.disclosureAtFirstExposure"), false);

  const unsure = evaluateTool("label-content", {
    role: "professional_deployer",
    contentType: "video",
    change: "generated",
    realisticOrPlausible: "true",
    disclosureAtFirstExposure: "unsure",
  });
  assert.equal(unsure.status, "required");
  assert.ok(unsure.unknownIds.includes("tools.label-content.questions.disclosureAtFirstExposure"));
});

test("an unknown provider transition date is shown as missing evidence", () => {
  const result = evaluateTool("label-content", {
    role: "provider",
    contentType: "video",
    change: "generated",
    systemPlacedBefore2026August2: "unsure",
  });
  assert.equal(result.status, "unclear");
  assert.ok(result.unknownIds.includes("tools.label-content.questions.systemPlacedBefore2026August2"));
});

test("unknown final editorial review stays uncertain", () => {
  const result = evaluateTool("label-content", {
    role: "professional_deployer",
    contentType: "text",
    change: "generated",
    publicInterest: "true",
    editorialControl: "unsure",
  });
  assert.equal(result.status, "unclear");
});

test("browser coverage output exposes the maximum-ceiling values and calculation key", () => {
  const result = evaluateTool("does-it-apply", coverageFixture({
    organisationSize: "small",
    intendedUse: "content_generation",
  }));
  assert.equal(result.penalty.fixedAmountEur, 15_000_000);
  assert.equal(result.penalty.turnoverPercent, 3);
  assert.equal(result.penalty.calculationRuleId, "penalty.calculation.lower_of");
  assert.ok(result.sourceIds.includes("reg-2024-1689-art-99"));
  assert.ok(result.sourceIds.includes("reg-2026-1744"));
});
