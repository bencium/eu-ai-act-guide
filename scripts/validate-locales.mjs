import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localeDir = path.join(root, "src", "i18n", "locales");
const translationStatePath = path.join(root, "src", "i18n", "translation-state.json");
const expectedCodes = [
  "bg", "es", "cs", "da", "de", "et", "el", "en", "fr", "ga", "hr", "it",
  "lv", "lt", "hu", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "fi", "sv"
];
const exactFooter = "Open sourced by bencium.io";
const sharedEnglishKeyAllowlist = new Set([
  "about.publisherLines",
  "common.footerCopy",
  "decision.progress",
  "languageName",
  "skill.hashLabel",
  "skill.version"
]);
const forbiddenEnglishResultWords = /\b(compliant|approved|safe|certified|minimal risk|no obligations)\b/i;
const protectedPatterns = [
  /\d+(?:[.,]\d+)?/g,
  /\{[a-zA-Z0-9_.-]+\}/g,
  /(?:\.?\.?\/|~\/|\$|\/)[.a-zA-Z0-9_~$/-]+(?:\.md|\/)?/g
];

const files = (await readdir(localeDir)).filter((file) => file.endsWith(".json")).sort();
const expectedFiles = expectedCodes.map((code) => `${code}.json`).sort();
assertEqual(files, expectedFiles, "Locale file inventory");

const locales = {};
const localeFiles = {};
for (const code of expectedCodes) {
  const raw = await readFile(path.join(localeDir, `${code}.json`), "utf8");
  localeFiles[code] = raw;
  locales[code] = JSON.parse(raw);
}

const translationState = JSON.parse(await readFile(translationStatePath, "utf8"));
const englishSourceSha256 = sha256(localeFiles.en);
if (translationState.englishSourceSha256 !== englishSourceSha256) {
  throw new Error("English wording changed. Refresh all 23 translations, then run npm run translations:stamp.");
}
for (const code of expectedCodes.filter((code) => code !== "en")) {
  const state = translationState.locales?.[code];
  if (state?.englishSourceSha256 !== englishSourceSha256) {
    throw new Error(`${code}: translation was not refreshed from the current English source`);
  }
  if (state?.localeSha256 !== sha256(localeFiles[code])) {
    throw new Error(`${code}: translation changed without refreshing the translation record`);
  }
}

const english = locales.en;
const englishKeys = Object.keys(english).sort();
for (const code of expectedCodes) {
  const locale = locales[code];
  assertEqual(Object.keys(locale).sort(), englishKeys, `${code}: key set`);
  if (locale["common.footerCopy"] !== exactFooter) {
    throw new Error(`${code}: footer copy must remain exactly “${exactFooter}”`);
  }

  let comparableStrings = 0;
  let translatedStrings = 0;
  for (const key of englishKeys) {
    const source = english[key];
    const translated = locale[key];
    if (typeof source !== typeof translated || Array.isArray(source) !== Array.isArray(translated)) {
      throw new Error(`${code}:${key}: value type differs from English`);
    }
    validateValue(code, key, source, translated);
    if (code !== "en") {
      for (const [sourceString, translatedString] of pairStrings(source, translated)) {
        if (shouldCompareForTranslation(key, sourceString)) {
          comparableStrings += 1;
          if (sourceString !== translatedString) translatedStrings += 1;
        }
      }
    }
  }

  if (code !== "en") {
    if (!locale["meta.translationWarning"] || !locale["common.translationWarning"]) {
      throw new Error(`${code}: unreviewed-translation warnings are required`);
    }
    if (translatedStrings !== comparableStrings) {
      throw new Error(`${code}: ${comparableStrings - translatedStrings} comparable user-facing value(s) still match English`);
    }
  }
}

for (const [key, value] of Object.entries(english)) {
  if (!key.startsWith("result.")) continue;
  for (const item of flattenStrings(value)) {
    if (forbiddenEnglishResultWords.test(item)) throw new Error(`en:${key}: prohibited certainty wording: ${item}`);
  }
}

console.log(`Locales verified: ${expectedCodes.length} files, ${englishKeys.length} keys each`);

function validateValue(code, key, source, translated) {
  const pairs = pairStrings(source, translated);
  if (Array.isArray(source) && source.length !== translated.length) {
    throw new Error(`${code}:${key}: list length differs from English`);
  }
  for (const [sourceString, translatedString, index] of pairs) {
    if (code === "en" && key === "meta.translationWarning" && translatedString === "") continue;
    if (typeof translatedString !== "string" || translatedString.trim() === "") {
      throw new Error(`${code}:${key}${index === undefined ? "" : `[${index}]`}: empty string`);
    }
    for (const pattern of protectedPatterns) {
      const sourceTokens = sourceString.match(pattern) ?? [];
      const translatedTokens = translatedString.match(pattern) ?? [];
      assertEqual(translatedTokens, sourceTokens, `${code}:${key}: protected legal token`);
    }
    if (/\bAnnex III\b/.test(sourceString) && !/\bIII\b/.test(translatedString)) {
      throw new Error(`${code}:${key}: Annex III identifier changed`);
    }
    if (/\bAnnex I(?!I)\b/.test(sourceString) && !/\bI\b/.test(translatedString)) {
      throw new Error(`${code}:${key}: Annex I identifier changed`);
    }
  }
}

function pairStrings(source, translated) {
  if (typeof source === "string") return [[source, translated, undefined]];
  if (Array.isArray(source)) return source.map((item, index) => [item, translated[index], index]);
  throw new Error("Locale values must be strings or string arrays");
}

function flattenStrings(value) {
  return typeof value === "string" ? [value] : value;
}

function shouldCompareForTranslation(key, value) {
  if (sharedEnglishKeyAllowlist.has(key)) return false;
  if (/^(?:Project|Personal|Invoke):/.test(value)) return false;
  if (/^[\d .·–—()/:%€$~a-zA-Z_-]+$/.test(value) && value.length < 22) return false;
  return true;
}

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} differs. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}
