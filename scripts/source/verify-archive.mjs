import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const registerPath = path.join(root, "sources", "source-register.json");
const publicRegisterPath = path.join(root, "public", "source-register.json");
const rootXmlPath = path.join(root, "cellar_dc8116a1-3fe6-11ef-865a-01aa75ed71a1.xml");
const expectedRootXml = {
  bytes: 1_446_323,
  sha256: "0b5463b04dbf9f4cbb487e5e6ab74a7d1aa352da85e880775c7fdee4a4974a79"
};
const requiredSourceIds = [
  "base-act",
  "amendment-2026-1744",
  "corrigendum-2025-10-09",
  "corrigendum-2025-12-19",
  "corrigendum-2026-03-27",
  "corrigendum-2026-05-04",
  "final-guidelines-article-50",
  "voluntary-code-article-50",
  "optional-icons"
];
const allowedHosts = new Set([
  "data.europa.eu",
  "digital-strategy.ec.europa.eu",
  "ec.europa.eu",
  "eur-lex.europa.eu",
  "publications.europa.eu"
]);

const registerRaw = await readFile(registerPath);
const publicRaw = await readFile(publicRegisterPath);
if (!registerRaw.equals(publicRaw)) throw new Error("Public source register differs from the canonical register");
const register = JSON.parse(registerRaw);

const sourceIds = register.sources.map((source) => source.id).sort();
for (const id of requiredSourceIds) {
  if (!sourceIds.includes(id)) throw new Error(`Required official source is missing: ${id}`);
}
if (new Set(sourceIds).size !== sourceIds.length) throw new Error("Source register contains a duplicate source id");
if (register.official_language_expressions.length !== 24) throw new Error("Source register must contain 24 official-language expressions");

for (const source of register.sources) {
  for (const field of ["id", "category", "source_authority", "url", "dates", "relationship_to_base_act", "affected_languages", "legal_references", "last_verified_at_utc"]) {
    if (!(field in source)) throw new Error(`${source.id}: required register field is missing: ${field}`);
  }
  validateOfficialUrl(source.url, source.id);
  for (const url of collectUrls(source)) validateOfficialUrl(url, source.id);
}

const rootXml = await readFile(rootXmlPath);
verifyBytesAndHash(rootXml, expectedRootXml, "Pre-existing CELLAR XML");

for (const artifact of register.archive_artifacts) {
  for (const field of ["id", "official_url", "retrieved_at_utc", "local_path", "bytes", "sha256"]) {
    if (!artifact[field]) throw new Error(`${artifact.id || "archive artifact"}: required provenance field is missing: ${field}`);
  }
  const artifactPath = path.resolve(root, artifact.local_path);
  if (!artifactPath.startsWith(`${root}${path.sep}`)) throw new Error(`${artifact.id}: archive path escapes the repository`);
  const fileStat = await stat(artifactPath);
  if (!fileStat.isFile()) throw new Error(`${artifact.id}: archive path is not a regular file`);
  const data = await readFile(artifactPath);
  verifyBytesAndHash(data, artifact, artifact.id);
  if (artifact.official_url) validateOfficialUrl(artifact.official_url, artifact.id);

  if (artifact.verification.format === "pdf" && !data.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
    throw new Error(`${artifact.id}: missing PDF signature`);
  }
  if (artifact.verification.format === "xhtml") {
    const html = data.toString("utf8");
    const actual = {
      recitals: uniqueMatches(html, /id=["']rct_(\d+)["']/g),
      articles: uniqueMatches(html, /id=["']art_(\d+)["']/g),
      annexes: uniqueMatches(html, /id=["']anx_([IVX]+)["']/g)
    };
    for (const [name, expected] of Object.entries(artifact.verification.expected_structure)) {
      if (actual[name] !== expected) throw new Error(`${artifact.id}: expected ${expected} ${name}, found ${actual[name]}`);
    }
  }
  if (artifact.verification.format === "cellar-notice-xml") {
    if (!data.equals(rootXml)) throw new Error("Archived CELLAR metadata differs from the pre-existing root XML");
    const xml = data.toString("utf8");
    if (uniqueMatches(xml, /id=["'](?:rct|art|anx)_/g) !== 0) {
      throw new Error("CELLAR metadata must not be described as the legal body");
    }
  }
}

console.log(`Verified ${register.archive_artifacts.length} archived artifacts and ${register.sources.length} registered official sources.`);

function verifyBytesAndHash(data, expected, label) {
  if (data.length !== expected.bytes) throw new Error(`${label}: expected ${expected.bytes} bytes, found ${data.length}`);
  const actualHash = createHash("sha256").update(data).digest("hex");
  if (actualHash !== expected.sha256) throw new Error(`${label}: SHA-256 differs`);
}

function uniqueMatches(value, expression) {
  return new Set([...value.matchAll(expression)].map((match) => match[1] ?? match[0])).size;
}

function validateOfficialUrl(value, label) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || !allowedHosts.has(url.hostname)) {
    throw new Error(`${label}: URL is not an allowlisted official HTTPS source: ${value}`);
  }
}

function collectUrls(value, urls = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectUrls(item, urls);
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if ((key === "url" || key.endsWith("_url")) && typeof item === "string") urls.push(item);
      else collectUrls(item, urls);
    }
  }
  return urls;
}
