import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localeDir = path.join(root, "src", "i18n", "locales");
const statePath = path.join(root, "src", "i18n", "translation-state.json");
const translatedCodes = [
  "bg", "es", "cs", "da", "de", "et", "el", "fr", "ga", "hr", "it", "lv",
  "lt", "hu", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "fi", "sv"
];

const english = await readFile(path.join(localeDir, "en.json"), "utf8");
const englishSourceSha256 = sha256(english);
const locales = {};

for (const code of translatedCodes) {
  const translated = await readFile(path.join(localeDir, `${code}.json`), "utf8");
  locales[code] = {
    englishSourceSha256,
    localeSha256: sha256(translated)
  };
}

const previousState = await readPreviousState();
if (previousState && previousState.englishSourceSha256 !== englishSourceSha256) {
  for (const code of translatedCodes) {
    if (previousState.locales?.[code]?.localeSha256 === locales[code].localeSha256) {
      throw new Error(`${code}: English changed but this locale file did not. Refresh every translation before stamping.`);
    }
  }
}

await writeFile(
  statePath,
  `${JSON.stringify({ version: 1, englishSourceSha256, locales }, null, 2)}\n`,
  "utf8"
);

console.log("Recorded the current English source and all 23 locale file hashes.");

async function readPreviousState() {
  try {
    return JSON.parse(await readFile(statePath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return undefined;
    throw error;
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}
