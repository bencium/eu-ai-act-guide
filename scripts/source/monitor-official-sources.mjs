import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const allowedHosts = new Set([
  "data.europa.eu",
  "digital-strategy.ec.europa.eu",
  "ec.europa.eu",
  "eur-lex.europa.eu"
]);
const maximumBytes = 16 * 1024 * 1024;
const userAgent = "bencium-eu-ai-act-source-monitor/1.0 (+https://bencium.io)";
const args = parseArgs(process.argv.slice(2));
const registerPath = path.resolve(args.register ?? path.join(root, "sources", "source-register.json"));
const register = JSON.parse(await readFile(registerPath, "utf8"));

const checks = register.sources.flatMap((source) => {
  if (!source.monitor) return [];
  const monitors = Array.isArray(source.monitor) ? source.monitor : [source.monitor];
  return monitors.map((monitor) => ({ source, monitor }));
});
const results = [];
for (const { source, monitor } of checks) results.push(await checkSource(source, monitor));

const report = {
  checked_at_utc: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  policy: "human_review_required_no_automatic_legal_updates",
  results
};
if (args.report) {
  const reportPath = path.resolve(args.report);
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

process.stdout.write(markdownSummary(report));
process.exitCode = results.some((result) => result.status !== "ok") ? 1 : 0;

async function checkSource(source, monitor) {
  const url = monitor.url ?? source.url;
  const result = { id: source.id, check_id: monitor.id ?? "default", url, status: "ok", problems: [] };
  try {
    const response = await fetchAllowlisted(url);
    const contentType = response.headers.get("content-type") ?? "";
    const data = response.data;
    Object.assign(result, {
      final_url: response.url,
      bytes: data.length,
      content_type: contentType,
      sha256: sha256(data),
      etag: response.headers.get("etag"),
      last_modified: response.headers.get("last-modified")
    });

    if (monitor.expected_content_type && !contentType.toLowerCase().startsWith(monitor.expected_content_type.toLowerCase())) {
      result.problems.push(`content type changed: expected ${monitor.expected_content_type}, got ${contentType || "<none>"}`);
    }
    const decoded = data.toString("utf8");
    for (const marker of monitor.required_markers ?? []) {
      if (!decoded.includes(marker)) result.problems.push(`required marker missing: ${JSON.stringify(marker)}`);
    }
    if (monitor.expected_structure) {
      result.structure = {
        recitals: uniqueMatches(decoded, /id=["']rct_(\d+)["']/g),
        articles: uniqueMatches(decoded, /id=["']art_(\d+)["']/g),
        annexes: uniqueMatches(decoded, /id=["']anx_([IVX]+)["']/g)
      };
      for (const [key, expected] of Object.entries(monitor.expected_structure)) {
        if (result.structure[key] !== expected) result.problems.push(`${key} changed: expected ${expected}, got ${result.structure[key]}`);
      }
    }
    if (monitor.mode === "exact_sha256") {
      if (result.sha256 !== monitor.expected_sha256) result.problems.push(`content changed: expected SHA-256 ${monitor.expected_sha256}, got ${result.sha256}`);
    } else if (monitor.mode === "semantic_html_sha256") {
      result.semantic_html_sha256 = semanticHtmlSha256(decoded);
      if (result.semantic_html_sha256 !== monitor.expected_semantic_sha256) {
        result.problems.push(`visible page text changed: expected semantic SHA-256 ${monitor.expected_semantic_sha256}, got ${result.semantic_html_sha256}`);
      }
    } else if (monitor.mode !== "markers_only") {
      result.problems.push(`unsupported monitor mode: ${JSON.stringify(monitor.mode)}`);
    }
  } catch (error) {
    result.problems.push(error instanceof Error ? error.message : String(error));
  }
  if (result.problems.length) result.status = "needs_human_review";
  return result;
}

async function fetchAllowlisted(startUrl) {
  let current = validateUrl(startUrl);
  for (let redirect = 0; redirect <= 5; redirect += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
      headers: { "user-agent": userAgent, "accept-encoding": "identity" }
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`redirect ${response.status} has no location`);
      current = validateUrl(new URL(location, current).href);
      continue;
    }
    if (!response.ok) throw new Error(`official source returned HTTP ${response.status}`);
    const declared = Number(response.headers.get("content-length") ?? 0);
    if (declared > maximumBytes) throw new Error(`response exceeds ${maximumBytes} byte safety limit`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("official source returned no body");
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximumBytes) {
        await reader.cancel();
        throw new Error(`response exceeds ${maximumBytes} byte safety limit`);
      }
      chunks.push(Buffer.from(value));
    }
    return { data: Buffer.concat(chunks), headers: response.headers, url: current };
  }
  throw new Error("official source exceeded five allowlisted redirects");
}

function semanticHtmlSha256(html) {
  const visible = html
    .replace(/<(script|style|noscript|svg|template)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("en");
  const tokens = visible.match(/[\p{L}\p{N}_]+|[^\p{L}\p{N}\s_]/gu)?.sort() ?? [];
  return sha256(Buffer.from(tokens.join("\n")));
}

function validateUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || !allowedHosts.has(url.hostname)) {
    throw new Error(`URL is not allowlisted: ${value}`);
  }
  return url.href;
}

function uniqueMatches(value, expression) {
  return new Set([...value.matchAll(expression)].map((match) => match[1])).size;
}

function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

function markdownSummary(report) {
  const lines = [
    "# Official EU source monitor",
    "",
    `Checked at: ${report.checked_at_utc}`,
    "",
    "This check never changes legal explanations or the source register.",
    "Any drift requires a human review and a separate reviewed change.",
    ""
  ];
  for (const result of report.results) {
    lines.push(`- ${result.status === "ok" ? "OK" : "REVIEW"}: \`${result.id}/${result.check_id}\``);
    for (const problem of result.problems) lines.push(`  - ${problem}`);
  }
  return `${lines.join("\n")}\n`;
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const key = values[index];
    if (key === "--report" || key === "--register") parsed[key.slice(2)] = values[++index];
    else throw new Error(`Unknown argument: ${key}`);
  }
  return parsed;
}
