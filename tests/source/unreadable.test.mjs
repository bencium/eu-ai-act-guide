import assert from "node:assert/strict";
import test from "node:test";
import { describeUnreadable } from "../../scripts/source/unreadable.mjs";

const response = (headers = {}, status = 200) => ({
  status,
  headers: { get: (name) => headers[name.toLowerCase()] ?? null }
});

test("an empty body is unreadable, not an unchanged source", () => {
  assert.equal(describeUnreadable(response(), Buffer.from("")), "empty response body");
});

test("an AWS WAF challenge is reported as a challenge", () => {
  const result = describeUnreadable(
    response({ "x-amzn-waf-action": "challenge" }),
    Buffer.from("<html>checking your browser</html>")
  );
  assert.match(result, /bot challenge/);
});

test("HTTP 202 without completed content is unreadable", () => {
  assert.match(describeUnreadable(response({}, 202), Buffer.from("pending")), /HTTP 202/);
});

test("a challenge page body is detected by its wording", () => {
  const result = describeUnreadable(response(), Buffer.from("<html><body>Just a moment...</body></html>"));
  assert.match(result, /challenge or block page/);
});

test("real legal content reads as available", () => {
  const body = Buffer.from("<html><body>REGULATION (EU) 2024/1689 of the European Parliament</body></html>");
  assert.equal(describeUnreadable(response(), body), null);
});

test("a genuinely changed page is not misreported as unreadable", () => {
  const body = Buffer.from("<html><body>Updated guidance text published 2026</body></html>");
  assert.equal(describeUnreadable(response(), body), null);
});
