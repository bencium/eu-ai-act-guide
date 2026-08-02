import assert from "node:assert/strict";
import test from "node:test";

import { evaluateCoverage, getPenaltyContext } from "../../src/lib/decision/coverage.mjs";
import { findProhibitedCertaintyTerms } from "../../src/lib/decision/shared.mjs";
import { coverageFixture } from "./fixtures.mjs";

test("a professional EU deployer reaches the scope signal when using a third-party system", () => {
  const result = evaluateCoverage(coverageFixture());
  assert.equal(result.status, "likely_in_scope");
  assert.equal(result.possibleRole, "Possible professional deployer");
  assert.ok(result.citations.some((citation) => citation.reference === "Article 2"));
});

test("a non-EU provider can reach scope when its output is used in the EU", () => {
  const result = evaluateCoverage(coverageFixture({
    euConnection: "output_used_in_eu",
    role: "provider",
  }));
  assert.equal(result.status, "likely_in_scope");
  assert.ok(result.answers.some((answer) =>
    answer.questionId === "euConnection" && answer.answerId === "output_used_in_eu"));
});

test("purely personal non-professional use follows the deployer exclusion", () => {
  const result = evaluateCoverage(coverageFixture({
    role: "personal_user",
    context: "personal_non_professional",
    organisationSize: "personal",
  }));
  assert.equal(result.status, "possible_exemption");
  assert.ok(result.unknown.some((fact) => fact.includes("professional")));
});

test("pre-market research never silently includes real-world testing", () => {
  const missingFact = evaluateCoverage(coverageFixture({ context: "pre_market_research_testing" }));
  assert.equal(missingFact.status, "unclear");
  assert.ok(missingFact.unknown.some((fact) => fact.includes("real-world")));

  const realWorld = evaluateCoverage(coverageFixture({
    context: "pre_market_research_testing",
    additional: { realWorldTesting: true },
  }));
  assert.equal(realWorld.status, "likely_in_scope");
});

test("free and open-source status does not remove Article 5, high-risk or Article 50 signals", () => {
  const article5 = evaluateCoverage(coverageFixture({
    context: "free_open_source_release",
    intendedUse: "ordinary_internal_assistance",
    additional: { article5Concern: true },
  }));
  const highRisk = evaluateCoverage(coverageFixture({
    context: "free_open_source_release",
    intendedUse: "employment",
    industry: "sector_specific",
  }));
  const article50 = evaluateCoverage(coverageFixture({
    context: "free_open_source_release",
    intendedUse: "content_generation",
  }));
  assert.deepEqual(
    [article5.status, highRisk.status, article50.status],
    ["likely_in_scope", "likely_in_scope", "likely_in_scope"],
  );
});

test("organisation size and industry alone never create an exception", () => {
  const micro = evaluateCoverage(coverageFixture({ organisationSize: "micro", industry: "healthcare" }));
  const large = evaluateCoverage(coverageFixture({ organisationSize: "large", industry: "healthcare" }));
  assert.equal(micro.status, "likely_in_scope");
  assert.equal(large.status, "likely_in_scope");
});

test("sector confirmation changes only the potential high-risk branch", () => {
  const confirmed = evaluateCoverage(coverageFixture({
    intendedUse: "employment",
    industry: "sector_specific",
  }));
  const differentSetting = evaluateCoverage(coverageFixture({
    intendedUse: "employment",
    industry: "other",
  }));
  const unsure = evaluateCoverage(coverageFixture({
    intendedUse: "employment",
    industry: "unsure",
  }));

  assert.deepEqual(
    [confirmed.status, differentSetting.status, unsure.status],
    ["likely_in_scope", "likely_in_scope", "likely_in_scope"],
    "industry must not decide overall EU coverage",
  );
  assert.ok(confirmed.dates.some((item) => item.date === "2027-12-02"));
  assert.equal(differentSetting.dates.some((item) => item.date === "2027-12-02"), false);
  assert.equal(unsure.dates.some((item) => item.date === "2027-12-02"), false);
  assert.ok(unsure.unknown.some((fact) => fact.includes("sector description")));
  assert.ok(confirmed.citations.some((citation) => citation.reference.includes("Annexes")));
  assert.equal(differentSetting.citations.some((citation) => citation.reference.includes("Annexes")), false);
});

test("not-sure answers produce uncertainty instead of a guessed result", () => {
  const result = evaluateCoverage(coverageFixture({ role: "unsure" }));
  assert.equal(result.status, "unclear");
  assert.ok(result.unknown.includes("The organisation's legal role"));
});

test("an absent listed EU connection gives only the cautious no-trigger status", () => {
  const result = evaluateCoverage(coverageFixture({ euConnection: "none_found" }));
  assert.equal(result.status, "no_trigger_found");
  assert.ok(result.unknown.some((fact) => fact.includes("unlisted EU connection")));
});

test("SMEs receive the lower Article 99 amount-or-percentage rule", () => {
  for (const size of ["micro", "small", "medium"]) {
    assert.equal(getPenaltyContext("article_5", size).calculationRule, "lower_of");
    assert.equal(getPenaltyContext("operator_duties", size).calculationRule, "lower_of");
    assert.equal(getPenaltyContext("authority_information", size).calculationRule, "lower_of");
  }
});

test("small mid-caps receive only the Article 99 treatment added for paragraphs 4 and 5", () => {
  assert.equal(getPenaltyContext("article_5", "small_mid_cap").calculationRule, "higher_of");
  assert.equal(getPenaltyContext("operator_duties", "small_mid_cap").calculationRule, "lower_of");
  assert.equal(getPenaltyContext("authority_information", "small_mid_cap").calculationRule, "lower_of");
});

test("Article 99 statutory ceilings stay distinct", () => {
  assert.deepEqual(
    [getPenaltyContext("article_5", "large").fixedAmountEur, getPenaltyContext("article_5", "large").turnoverPercent],
    [35_000_000, 7],
  );
  assert.deepEqual(
    [getPenaltyContext("operator_duties", "large").fixedAmountEur, getPenaltyContext("operator_duties", "large").turnoverPercent],
    [15_000_000, 3],
  );
  assert.deepEqual(
    [getPenaltyContext("authority_information", "large").fixedAmountEur, getPenaltyContext("authority_information", "large").turnoverPercent],
    [7_500_000, 1],
  );
});

test("public-authority penalties use a national-rule warning", () => {
  const penalty = getPenaltyContext("operator_duties", "public_authority");
  assert.equal(penalty.regime, "member_state_rules");
  assert.equal(penalty.calculationRule, "national_rule");
  assert.equal(penalty.fixedAmountEur, undefined);
});

test("general-purpose model penalties stay in the separate Article 101 regime", () => {
  const penalty = getPenaltyContext("gpai", "large");
  assert.equal(penalty.regime, "article_101");
  assert.ok(penalty.citations.some((citation) => citation.reference === "Article 101"));
});

test("future high-risk dates are not presented as already applying", () => {
  const result = evaluateCoverage(coverageFixture({
    intendedUse: "employment",
    industry: "sector_specific",
  }), "2026-08-02");
  const annexDate = result.dates.find((item) => item.date === "2027-12-02");
  assert.equal(annexDate?.state, "future");
});

test("a possible high-risk use does not receive a fine band before a provision is identified", () => {
  const result = evaluateCoverage(coverageFixture({
    intendedUse: "employment",
    industry: "sector_specific",
  }));
  assert.equal(result.penalty.provisionBand, "other");
  assert.equal(result.penalty.calculationRule, "not_calculated");
});

test("provider marking transition is limited to relevant existing generative systems", () => {
  const result = evaluateCoverage(coverageFixture({
    role: "provider",
    intendedUse: "content_generation",
    timing: "before_2026_08_02",
  }), "2026-08-02");
  assert.equal(result.dates[0].date, "2026-12-02");
  assert.equal(result.dates[0].state, "transition");
});

test("coverage results contain no prohibited certainty wording", () => {
  const samples = [
    evaluateCoverage(coverageFixture()),
    evaluateCoverage(coverageFixture({ euConnection: "none_found" })),
    evaluateCoverage(coverageFixture({ role: "unsure" })),
    evaluateCoverage(coverageFixture({ context: "personal_non_professional" })),
  ];
  for (const result of samples) assert.deepEqual(findProhibitedCertaintyTerms(result), []);
});
