// A response we cannot read is a monitoring gap, never evidence about the law.
// Official portals sit behind bot challenges that answer with a successful
// status and an empty or placeholder body; comparing that against a pinned
// hash reports every source as "changed" and hides real drift.

const challengeMarkers = [
  "captcha",
  "are you a robot",
  "enable javascript to continue",
  "request unsuccessful",
  "access denied",
  "just a moment"
];

export function describeUnreadable(response, data) {
  if (data.length === 0) return "empty response body";
  const wafAction = response.headers.get("x-amzn-waf-action");
  if (wafAction) return `bot challenge (x-amzn-waf-action: ${wafAction})`;
  if (response.status === 202) return "HTTP 202 with no completed content";
  const head = data.toString("utf8", 0, Math.min(data.length, 4096)).toLowerCase();
  for (const marker of challengeMarkers) {
    if (head.includes(marker)) return `challenge or block page (matched ${JSON.stringify(marker)})`;
  }
  return null;
}
