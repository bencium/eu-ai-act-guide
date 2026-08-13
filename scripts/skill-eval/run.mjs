import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const skillDir = path.join(root, "eu-ai-act-reviewer");
const scenarioDir = path.join(here, "scenarios");
const resultsDir = path.join(here, "results");

const skillFiles = [
  "SKILL.md",
  "references/official-sources.md",
  "references/review-rules.md",
  "references/output-contract.md",
  "references/article-50-content-labelling.md",
  "references/coverage-dates-and-penalties.md",
];

const only = process.argv.slice(2);

const skillText = (await Promise.all(
  skillFiles.map(async (file) =>
    `=== ${file} ===\n\n${await readFile(path.join(skillDir, file), "utf8")}`)
)).join("\n\n");

const constraints = `=== Operating constraints for this run ===

- You are running without internet access. Skip the live official-source
  check, rely on the pinned source register in references/official-sources.md,
  and reflect this fallback in the Legal currency field exactly as the skill
  requires.
- This is a single-turn run: do not ask clarifying questions. Where a
  blocking fact is missing, record it under Missing facts and use the
  narrowest supported status.
- Produce the full review report now, following
  references/output-contract.md exactly. Output only the report itself,
  with no preamble or commentary before or after it.`;

await mkdir(resultsDir, { recursive: true });
let scenarios = (await readdir(scenarioDir)).filter((f) => f.endsWith(".md")).sort();
if (only.length) scenarios = scenarios.filter((f) => only.some((o) => f.includes(o)));

for (const file of scenarios) {
  const scenario = (await readFile(path.join(scenarioDir, file), "utf8"))
    .replace(/^---\n[\s\S]*?\n---\n/, "");
  const prompt = [
    "You are acting as the eu-ai-act-reviewer skill. The complete skill instructions and reference files follow.",
    skillText,
    constraints,
    `=== Evidence supplied for review: user journey ===\n${scenario}`,
  ].join("\n\n");

  process.stdout.write(`Running ${file} ... `);
  const started = Date.now();
  // COST: ~6 LLM calls per round via the local claude CLI subscription
  let stdout = "";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      stdout = execFileSync("claude", ["-p", "--output-format", "text"], {
        input: prompt,
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
        timeout: 10 * 60 * 1000,
      });
      if (stdout.includes("API Error: Connection closed")) throw new Error("connection dropped");
      break;
    } catch (error) {
      if (attempt === 2) throw error;
      process.stdout.write("retrying ... ");
    }
  }
  await writeFile(path.join(resultsDir, file), stdout);
  console.log(`done in ${Math.round((Date.now() - started) / 1000)}s (${stdout.length} chars)`);
}

console.log(`\nTranscripts written to ${resultsDir}`);
