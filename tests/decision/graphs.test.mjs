import assert from "node:assert/strict";
import test from "node:test";

import { COVERAGE_GRAPH } from "../../src/lib/decision/coverage.mjs";
import { EVERYDAY_GRAPH } from "../../src/lib/decision/everyday.mjs";
import { LABELLING_GRAPH } from "../../src/lib/decision/labelling.mjs";
import { validateDecisionGraph } from "../../src/lib/decision/validate-graph.mjs";

test("all three decision graphs have valid destinations and no loops", () => {
  assert.equal(validateDecisionGraph(EVERYDAY_GRAPH), true);
  assert.equal(validateDecisionGraph(COVERAGE_GRAPH), true);
  assert.equal(validateDecisionGraph(LABELLING_GRAPH), true);
});

test("graph validation rejects missing destinations", () => {
  assert.throws(
    () => validateDecisionGraph({
      id: "broken",
      start: "first",
      nodes: [{ id: "first", options: [{ id: "answer", next: "missing" }] }],
      resultIds: ["result:done"],
    }),
    /missing destination/,
  );
});

test("graph validation rejects loops", () => {
  assert.throws(
    () => validateDecisionGraph({
      id: "loop",
      start: "first",
      nodes: [{ id: "first", options: [{ id: "again", next: "first" }] }],
      resultIds: ["result:done"],
    }),
    /Loop detected/,
  );
});
