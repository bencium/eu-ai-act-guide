import assert from "node:assert/strict";
import test from "node:test";

import { evaluateLabelling } from "../../src/lib/decision/labelling.mjs";
import { labelFixture } from "./fixtures.mjs";

test("a clearly fantastical personal image does not create a professional deployer visible duty", () => {
  const result = evaluateLabelling(labelFixture({
    role: "personal_user",
    realisticOrPlausible: false,
  }));
  assert.equal(result.status, "not_required_from_these_answers");
  assert.equal(result.duties.length, 0);
});

test("a realistic synthetic chief-executive announcement reaches the deepfake branch", () => {
  const result = evaluateLabelling(labelFixture());
  assert.equal(result.status, "required");
  assert.ok(result.duties.some((duty) => duty.kind === "visible_or_audible_deepfake_disclosure"));
});

test("public-interest text with spelling-only review does not reach the editorial exception", () => {
  const result = evaluateLabelling(labelFixture({
    contentType: "text",
    publicInterest: true,
    editorialControl: "spelling_only",
    editorialResponsibilityAccepted: true,
  }));
  assert.equal(result.status, "required");
  assert.ok(result.duties.some((duty) => duty.kind === "public_interest_text_disclosure"));
});

test("public-interest text with substantive final review and a responsible publisher reaches the exception", () => {
  const result = evaluateLabelling(labelFixture({
    contentType: "text",
    publicInterest: true,
    editorialControl: "substantive_final",
    editorialResponsibilityAccepted: true,
  }));
  assert.equal(result.status, "not_required_from_these_answers");
  assert.equal(result.duties.length, 0);
});

test("standard non-substantive editing follows the provider-marking exception", () => {
  for (const change of ["standard_editing", "non_substantive"]) {
    const result = evaluateLabelling(labelFixture({ role: "provider", change }));
    assert.equal(result.status, "not_required_from_these_answers");
    assert.equal(result.duties.length, 0);
  }
});

test("provider machine marking never substitutes for publisher visible disclosure", () => {
  const provider = evaluateLabelling(labelFixture({ role: "provider", contentType: "video" }));
  const publisher = evaluateLabelling(labelFixture({ role: "professional_deployer", contentType: "video" }));
  assert.deepEqual(provider.duties.map((duty) => duty.kind), ["machine_readable_marking"]);
  assert.deepEqual(publisher.duties.map((duty) => duty.kind), ["visible_or_audible_deepfake_disclosure"]);
});

test("a chatbot notice is required unless the AI interaction is genuinely obvious", () => {
  const notice = evaluateLabelling(labelFixture({
    role: "provider",
    contentType: "chatbot_agent",
    change: "not_applicable",
    interactionObviouslyAI: false,
  }));
  const obvious = evaluateLabelling(labelFixture({
    role: "provider",
    contentType: "chatbot_agent",
    change: "not_applicable",
    interactionObviouslyAI: true,
  }));
  assert.equal(notice.status, "required");
  assert.ok(notice.duties.some((duty) => duty.kind === "direct_interaction_notice"));
  assert.equal(obvious.status, "not_required_from_these_answers");
});

test("an unknown chatbot obviousness fact produces uncertainty", () => {
  const result = evaluateLabelling(labelFixture({
    role: "provider",
    contentType: "chatbot_agent",
    change: "not_applicable",
    interactionObviouslyAI: undefined,
  }));
  assert.equal(result.status, "unclear");
});

test("emotion recognition at work produces a notice and a prohibited-use check", () => {
  const result = evaluateLabelling(labelFixture({
    contentType: "emotion_recognition",
    change: "not_applicable",
    setting: "work",
  }));
  assert.equal(result.status, "required");
  assert.ok(result.duties.some((duty) => duty.kind === "emotion_or_biometric_notice"));
  assert.ok(result.duties.some((duty) => duty.kind === "prohibited_use_check"));
  assert.ok(result.dates.some((date) => date.date === "2025-02-02" && date.state === "applies"));
  assert.ok(result.nextAction.includes("Pause"));
});

test("optional icons never replace words or prove the legal minimum was met", () => {
  const result = evaluateLabelling(labelFixture());
  assert.equal(result.optionalIcon.available, true);
  assert.equal(result.optionalIcon.replacesWords, false);
  assert.equal(result.optionalIcon.provesCompliance, false);
});

test("a professional but clearly fantastical image does not receive a blanket visible-label result", () => {
  const result = evaluateLabelling(labelFixture({ realisticOrPlausible: false }));
  assert.equal(result.status, "not_required_from_these_answers");
});

test("a missing deepfake realism fact produces uncertainty", () => {
  const result = evaluateLabelling(labelFixture({ realisticOrPlausible: undefined }));
  assert.equal(result.status, "unclear");
  assert.ok(result.unknown.some((fact) => fact.includes("plausible")));
});

test("an existing provider system receives only the narrow marking transition", () => {
  const result = evaluateLabelling(labelFixture({
    role: "provider",
    contentType: "image",
    systemPlacedBefore2026August2: true,
  }), "2026-08-02");
  assert.equal(result.dates[0].date, "2026-12-02");
  assert.equal(result.dates[0].state, "transition");
});
