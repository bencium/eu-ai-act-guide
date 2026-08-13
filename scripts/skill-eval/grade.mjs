import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const scenarioDir = path.join(here, "scenarios");
const resultsDir = path.join(here, "results");

const allowedStatuses = [
  "likely relevant",
  "possibly relevant",
  "insufficient evidence",
  "no trigger found in the supplied evidence",
];
const allowedSourceLevels = ["law", "official guidance", "voluntary code"];
const findingFields = [
  "review surface",
  "observed evidence",
  "possible ai act trigger",
  "role and conditions",
  "official source level",
  "applicable date",
  "status",
  "missing facts",
  "next action",
  "human decision",
];
const headerFields = ["review scope", "evidence level", "legal currency", "known limits"];
const closingChecks = [
  ["human decisions", /human decisions/i],
  ["evidence still needed", /evidence still needed/i],
  ["legal signposts", /signpost/i],
  ["limitations statement", /(not legal advice|educational)/i],
];
// Only assertive verdicts are banned; disclaimers like "I have not
// classified the system as compliant or non-compliant" are contract-required.
const bannedPatterns = [
  ["compliance verdict", /\b(is|are|was|were|deemed|considered|found to be)\s+(fully\s+)?(non-)?compliant\b/i],
  ["compliance score", /compliance score of/i],
  ["traffic-light grade", /traffic[- ]light grade/i],
  ["pass/fail grade", /\b(passes|fails|passed|failed) the (review|assessment|check)\b/i],
];

const files = (await readdir(resultsDir)).filter((f) => f.endsWith(".md")).sort();
if (!files.length) {
  console.error("No transcripts in results/. Run node scripts/skill-eval/run.mjs first.");
  process.exit(1);
}

let anyHardFail = false;

for (const file of files) {
  const text = await readFile(path.join(resultsDir, file), "utf8");
  const lower = text.toLowerCase();
  const problems = [];
  const notes = [];

  for (const field of headerFields) {
    if (!lower.includes(field)) problems.push(`header field missing: "${field}"`);
  }

  const findingIds = [...new Set(text.match(/EUAI-\d{3}/g) ?? [])];

  if (findingIds.length) {
    for (const field of findingFields) {
      const count = lower.split(field).length - 1;
      if (count < findingIds.length) {
        problems.push(`field "${field}" appears ${count}x for ${findingIds.length} finding(s)`);
      }
    }
  }

  const statusLines = [...text.matchAll(/^.*\bstatus\b[^:\n]*:\s*(.+)$/gim)]
    .map((m) => m[1].replaceAll("*", "").replaceAll("`", "").trim().toLowerCase())
    .filter((s) => s.length > 0 && !s.startsWith("|"));
  const statusValues = statusLines.filter((s) =>
    allowedStatuses.some((a) => s.startsWith(a)) || s.length < 80);
  for (const status of statusValues) {
    if (!allowedStatuses.some((allowed) => status.startsWith(allowed))) {
      problems.push(`status outside closed vocabulary: "${status}"`);
    }
  }
  if (findingIds.length && statusValues.length === 0) {
    problems.push("no parsable Status lines found");
  }

  const sourceLevelLines = [...text.matchAll(/official source level[^:\n]*:\s*(.+)$/gim)]
    .map((m) => m[1].replaceAll("*", "").trim().toLowerCase());
  for (const line of sourceLevelLines) {
    if (!allowedSourceLevels.some((allowed) => line.includes(allowed))) {
      problems.push(`source level not Law/Official guidance/Voluntary code: "${line.slice(0, 60)}"`);
    }
  }

  for (const [label, pattern] of bannedPatterns) {
    if (pattern.test(text)) problems.push(`banned wording: ${label}`);
  }

  for (const [label, pattern] of closingChecks) {
    if (!pattern.test(text)) problems.push(`closing section missing: ${label}`);
  }

  if (!findingIds.length && !lower.includes("no trigger found in the supplied evidence")) {
    problems.push("zero findings but no per-trigger 'no trigger found' statement");
  }

  const scenarioRaw = await readFile(path.join(scenarioDir, file), "utf8").catch(() => "");
  const expected = scenarioRaw.match(/^expected:\s*(.+)$/m)?.[1]?.trim();
  if (expected && !lower.includes(expected.toLowerCase())) {
    notes.push(`expected status "${expected}" not present (soft check)`);
  }
  if (file === "retail-internal.md") {
    const positive = statusValues.filter((s) => s.startsWith("likely relevant")).length;
    if (positive > 0) notes.push(`negative control has ${positive} "likely relevant" finding(s)`);
  }

  if (problems.length) anyHardFail = true;
  const verdict = problems.length ? "FAIL" : "PASS";
  console.log(`\n${verdict}  ${file}  (${findingIds.length} finding(s): ${findingIds.join(", ") || "none"})`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  for (const n of notes) console.log(`  ~ ${n}`);
}

console.log(anyHardFail ? "\nResult: HARD CHECKS FAILED" : "\nResult: all hard checks passed");
process.exit(anyHardFail ? 1 : 0);
