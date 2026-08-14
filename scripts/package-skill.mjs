import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildStoredZip } from "./lib/zip.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillName = "eu-ai-act-reviewer";
const version = "1.0.1";
const skillDir = path.join(root, skillName);
const downloadsDir = path.join(root, "public", "downloads");
const archiveFile = `${skillName}-skill-v${version}.zip`;
const rawFile = `${skillName}-SKILL-v${version}.md`;
const checksumFile = `${skillName}-skill-v${version}.sha256`;
const exactRelativeFiles = [
  "LICENSE",
  "SKILL.md",
  "references/article-50-content-labelling.md",
  "references/coverage-dates-and-penalties.md",
  "references/official-sources.md",
  "references/output-contract.md",
  "references/review-rules.md"
];

await assertExactSkillInventory();
await mkdir(downloadsDir, { recursive: true });

const zipEntries = [
  { name: `${skillName}/`, directory: true },
  { name: `${skillName}/references/`, directory: true }
];
for (const relative of exactRelativeFiles) {
  zipEntries.push({
    name: `${skillName}/${relative}`,
    data: await readFile(path.join(skillDir, relative))
  });
}

const archive = buildStoredZip(zipEntries);
const sha256 = createHash("sha256").update(archive).digest("hex");
await writeFile(path.join(downloadsDir, archiveFile), archive);
await writeFile(path.join(downloadsDir, rawFile), await readFile(path.join(skillDir, "SKILL.md")));
await writeFile(path.join(downloadsDir, checksumFile), `${sha256}  ${archiveFile}\n`, "utf8");
await writeFile(
  path.join(root, "src", "data", "skill-release.json"),
  `${JSON.stringify({
    version,
    releaseDate: "2026-08-14",
    archiveFile,
    rawFile,
    checksumFile,
    archiveBytes: archive.length,
    sha256
  }, null, 2)}\n`,
  "utf8"
);

console.log(`Packaged ${archiveFile}: ${archive.length} bytes, SHA-256 ${sha256}`);

async function assertExactSkillInventory() {
  const found = [];
  await walk(skillDir, "", found);
  const expected = [...exactRelativeFiles].sort();
  if (JSON.stringify(found.sort()) !== JSON.stringify(expected)) {
    throw new Error(`Unexpected skill inventory. Expected ${expected.join(", ")}; found ${found.join(", ")}`);
  }
}

async function walk(directory, relative, found) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryRelative = path.posix.join(relative, entry.name);
    const absolute = path.join(directory, entry.name);
    const stat = await lstat(absolute);
    if (stat.isSymbolicLink()) throw new Error(`Skill package cannot contain a symbolic link: ${entryRelative}`);
    if (entry.isDirectory()) await walk(absolute, entryRelative, found);
    else if (entry.isFile()) found.push(entryRelative);
    else throw new Error(`Unsupported skill entry: ${entryRelative}`);
  }
}
