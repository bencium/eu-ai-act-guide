import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const localeDir = path.join(root, "src", "i18n", "locales");
const languages = [
  "bg", "es", "cs", "da", "de", "et", "el", "en", "fr", "ga", "hr", "it",
  "lv", "lt", "hu", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "fi", "sv"
];
const slugs = [
  "", "what-it-means", "does-it-apply", "label-content", "sources", "skill",
  "about", "terms", "privacy-cookies", "disclaimer", "open-source"
];

const locales = {};
for (const language of languages) {
  locales[language] = JSON.parse(await readFile(path.join(localeDir, `${language}.json`), "utf8"));
}

for (const language of languages) {
  for (const slug of slugs) {
    const htmlPath = path.join(dist, language, slug, "index.html");
    const html = await readFile(htmlPath, "utf8");
    const route = `/${language}/${slug ? `${slug}/` : ""}`;
    requireIncludes(html, `<html lang="${language}">`, route);
    requireIncludes(html, `href="https://aiact.bencium.io${route}"`, `${route}: canonical`);
    requireIncludes(html, locales[language]["common.independent"], `${route}: independent statement`);
    requireIncludes(html, locales[language]["common.notOfficial"], `${route}: unofficial statement`);
    requireIncludes(html, locales[language]["common.notLegalAdvice"], `${route}: disclaimer statement`);
    requireIncludes(html, "Open sourced by bencium.io", `${route}: exact footer copy`);
    requireIncludes(html, `href="/${language}/disclaimer/"`, `${route}: disclaimer access`);
    requireIncludes(html, `href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj/`, `${route}: official text link`);

    for (const alternate of languages) {
      requireIncludes(html, `hreflang="${alternate}"`, `${route}: hreflang ${alternate}`);
    }
    requireIncludes(html, `hreflang="x-default"`, `${route}: x-default hreflang`);

    if (language !== "en") {
      requireIncludes(html, locales[language]["common.translationWarning"], `${route}: page translation warning`);
      const description = metaContent(html, "description");
      requireIncludes(description, locales[language]["meta.translationWarning"], `${route}: meta translation warning`);
    }

    assertNoForbiddenAssetsOrCollection(html, route);
  }

  const homeHtml = await readFile(path.join(dist, language, "index.html"), "utf8");
  for (const toolId of ["what-it-means", "does-it-apply", "label-content"]) {
    requireIncludes(homeHtml, `data-tool-choice="${toolId}"`, `/${language}/: single-page choice ${toolId}`);
    requireIncludes(homeHtml, `data-tool-panel="${toolId}"`, `/${language}/: single-page panel ${toolId}`);
  }
}

const rootHtml = await readFile(path.join(dist, "index.html"), "utf8");
requireIncludes(rootHtml, 'content="noindex,follow"', "/: noindex,follow");
requireIncludes(rootHtml, "navigator.languages", "/: local browser-language check");
if (/geolocation|geoip|ipapi/i.test(rootHtml)) throw new Error("Root redirect must not use geolocation");

for (const required of [
  "eu-ai-act-reviewer-skill-v1.0.0.zip",
  "eu-ai-act-reviewer-skill-v1.0.0.sha256",
  "eu-ai-act-reviewer-SKILL-v1.0.0.md",
  "source-register.json"
]) {
  const publishedPath = required === "source-register.json"
    ? path.join(dist, required)
    : path.join(dist, "downloads", required);
  await stat(publishedPath);
}

const skillHtml = await readFile(path.join(dist, "en", "skill", "index.html"), "utf8");
for (const required of [
  "/downloads/eu-ai-act-reviewer-skill-v1.0.0.zip",
  "/downloads/eu-ai-act-reviewer-skill-v1.0.0.sha256",
  "/downloads/eu-ai-act-reviewer-SKILL-v1.0.0.md"
]) requireIncludes(skillHtml, required, "/en/skill/: published download");

const visualFiles = [
  path.join(dist, "favicon.svg"),
  path.join(dist, "images", "bencium-horizontal.svg"),
  ...(await readdir(path.join(dist, "_astro")))
    .filter((file) => file.endsWith(".css"))
    .map((file) => path.join(dist, "_astro", file))
];
for (const file of visualFiles) {
  const value = await readFile(file, "utf8");
  if (/bdff1b|\blime\b|linear-?gradient|radial-?gradient/i.test(value)) {
    throw new Error(`${path.relative(dist, file)}: lime or gradient styling returned`);
  }
}

console.log(`Generated site verified: ${languages.length * slugs.length + 1} HTML pages`);

function assertNoForbiddenAssetsOrCollection(html, route) {
  const forbidden = [
    /<form\b/i,
    /localStorage\s*\./i,
    /googletagmanager|google-analytics|plausible\.io|segment\.com|hotjar|clarity\.ms/i,
    /vercel-insights|speed-insights|analytics\.vercel/i,
    /<script[^>]+src=["']https?:/i,
    /<link[^>]+href=["']https?:[^"']+\.(?:woff2?|ttf|css)/i,
    /<img[^>]+src=["']https?:/i,
    /(?:fetch|XMLHttpRequest|sendBeacon)\s*\(/i
  ];
  for (const pattern of forbidden) {
    if (pattern.test(html)) throw new Error(`${route}: forbidden external asset, form, storage or collection pattern ${pattern}`);
  }
  const storageWrites = [...html.matchAll(/sessionStorage\.setItem\((?:&quot;|["'])([^"'&]+)(?:&quot;|["'])/g)]
    .map((match) => match[1]);
  const allowed = new Set(["eu-ai-act-language", "eu-ai-act-no-cookie-dismissed"]);
  if (storageWrites.some((key) => !allowed.has(key))) throw new Error(`${route}: unapproved session-storage key`);
}

function metaContent(html, name) {
  const tag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((candidate) => new RegExp(`\\bname=(["'])${name}\\1`, "i").test(candidate));
  if (!tag) throw new Error(`Missing ${name} meta tag`);

  const content = tag.match(/\bcontent=(["'])([\s\S]*?)\1/i);
  if (!content) throw new Error(`Missing content on ${name} meta tag`);
  return content[2];
}

function requireIncludes(text, expected, label) {
  const normalizedText = decodeHtmlEntities(text);
  const normalizedExpected = decodeHtmlEntities(expected);
  if (!normalizedText.includes(normalizedExpected)) {
    throw new Error(`${label}: missing ${JSON.stringify(expected)}`);
  }
}

function decodeHtmlEntities(value) {
  return value
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}
