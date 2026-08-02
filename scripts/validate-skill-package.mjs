import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import release from "../src/data/skill-release.json" with { type: "json" };
import sourceRegister from "../sources/source-register.json" with { type: "json" };
import { readZipEntries } from "./lib/zip.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const downloads = path.join(root, "public", "downloads");
const archivePath = path.join(downloads, release.archiveFile);
const archive = await readFile(archivePath);
const sha256 = createHash("sha256").update(archive).digest("hex");

if (sha256 !== release.sha256) throw new Error("Skill archive hash differs from release metadata");
if (archive.length !== release.archiveBytes) throw new Error("Skill archive size differs from release metadata");

const checksum = await readFile(path.join(downloads, release.checksumFile), "utf8");
if (checksum !== `${sha256}  ${release.archiveFile}\n`) throw new Error("Published checksum file does not match archive");

const sourceSkill = await readFile(path.join(root, "eu-ai-act-reviewer", "SKILL.md"));
const officialSources = await readFile(
  path.join(root, "eu-ai-act-reviewer", "references", "official-sources.md"),
  "utf8"
);
const rawSkill = await readFile(path.join(downloads, release.rawFile));
if (!sourceSkill.equals(rawSkill)) throw new Error("Raw SKILL.md download differs from the packaged source");

for (const source of sourceRegister.sources) {
  if (!officialSources.includes(source.url)) {
    throw new Error(`Reviewer skill is missing registered official source: ${source.id}`);
  }
}

const expected = [
  "eu-ai-act-reviewer/",
  "eu-ai-act-reviewer/LICENSE",
  "eu-ai-act-reviewer/SKILL.md",
  "eu-ai-act-reviewer/references/",
  "eu-ai-act-reviewer/references/article-50-content-labelling.md",
  "eu-ai-act-reviewer/references/coverage-dates-and-penalties.md",
  "eu-ai-act-reviewer/references/official-sources.md",
  "eu-ai-act-reviewer/references/output-contract.md",
  "eu-ai-act-reviewer/references/review-rules.md"
].sort();

const entries = readZipEntries(archive);
const names = entries.map((entry) => entry.name).sort();
if (JSON.stringify(names) !== JSON.stringify(expected)) {
  throw new Error(`Unexpected skill ZIP inventory: ${names.join(", ")}`);
}
if (entries.some((entry) => (entry.externalAttributes >>> 16 & 0o170000) === 0o120000)) {
  throw new Error("Skill ZIP contains a symbolic link");
}
for (const entry of entries) {
  const mode = entry.externalAttributes >>> 16 & 0o777;
  const expectedMode = entry.name.endsWith("/") ? 0o755 : 0o644;
  if (mode !== expectedMode) throw new Error(`${entry.name}: unsafe or unusable ZIP permissions`);
}

const sourceStat = await lstat(path.join(root, "eu-ai-act-reviewer"));
if (sourceStat.isSymbolicLink()) throw new Error("Skill source folder cannot be a symbolic link");

console.log(`Skill package verified: ${entries.length} entries, ${archive.length} bytes, SHA-256 ${sha256}`);
