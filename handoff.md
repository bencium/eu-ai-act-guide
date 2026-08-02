# EU AI Act Guide handoff

Last updated: 2 August 2026

## Start here

The guide is built and currently available at:

- Live domain: <https://aiact.bencium.io/en/>
- Temporary Vercel address: <https://eu-ai-act-guide.vercel.app/en/>
- Public repository: <https://github.com/bencium/eu-ai-act-guide>
- Draft pull request: <https://github.com/bencium/eu-ai-act-guide/pull/1>
- Reviewer skill page: <https://aiact.bencium.io/en/skill/>

Important: the live Vercel build came from `agent/initial-release`, but pull request #1 is still a draft and has not been merged. The `main` branch currently contains only the initial empty commit. Review and merge the pull request before treating the repository's `main` branch as the released source.

## What was built

The EU AI Act Guide is a static, independent educational website for non-technical people. It uses a restrained off-white, charcoal and blue design with short wording, generous spacing and no lime, gradients, animations or sales language.

The localized home page contains three choices. Only the selected guide opens, on the same page:

1. What does the EU AI Act mean for me?
2. Does the EU AI Act cover this AI use, and when could enforcement apply?
3. How should I label this AI content?

Sources, the reviewer skill, Terms, Privacy and Cookies, Disclaimer, About and open-source information remain separate pages so the main experience stays simple.

Every page prominently states that this is an independent educational demo, not an official EU website and not legal advice. The exact footer copy `Open sourced by bencium.io` is preserved.

## Languages and future wording changes

The site uses one shared layout and 24 keyed language files. It does not maintain 24 copied page templates.

- English is the authored source in `src/i18n/locales/en.json`.
- The other 23 official EU languages use matching files in `src/i18n/locales/`.
- Every locale currently has the same 497 keys.
- All non-English pages identify themselves as unreviewed AI-generated demo translations and link to the official legal text in that language.
- `scripts/validate-locales.mjs` stops the build if English changes without refreshing all 23 translations.
- `src/i18n/translation-state.json` records the exact English and translated-file hashes.
- Run `npm run translations:stamp` only after every translated file has genuinely been refreshed. The script rejects unchanged locale files when English has changed.

This means a future English edit cannot quietly leave stale translated pages online. Translation is still a content task: the project checks that every language was refreshed, but it does not call a translation service automatically.

## Legal decision paths

The legal logic is language-neutral and lives in `src/lib/decision/`. Translations change only the displayed wording, not the branch a visitor reaches.

The tools deliberately avoid saying that a visitor is compliant, approved, certified or safe from penalties. Results separate:

- what the visitor answered;
- what is known and still unknown;
- the possible legal role;
- the relevant article, paragraph or annex;
- the official source and application date;
- a practical next action;
- the educational disclaimer.

The coverage guide treats industry and organization size as context, never as a general exemption. Penalty amounts are described only as maximum statutory ceilings. Public-authority and general-purpose-model penalties remain separate where the short guide cannot calculate a single answer.

The Article 50 guide keeps these duties separate:

- provider machine-readable marking;
- professional publisher or deployer visible or audible disclosure;
- chatbot and AI-agent notices;
- emotion-recognition and biometric-categorization notices;
- deepfake disclosure;
- public-interest text and the substantive editorial-review exception.

A label is never presented as making a prohibited use lawful. Optional EU icons never replace words or prove compliance.

## Official source archive

The project preserves:

- the authentic English Official Journal PDF;
- the official English XHTML body;
- the official metadata XML;
- a dated source register covering the base Regulation, identified corrigenda, the 2026 amendment and Commission guidance.

The accepted XHTML contains 180 recitals, 113 articles and 13 annexes.

The original local metadata XML remains unchanged:

```text
File: cellar_dc8116a1-3fe6-11ef-865a-01aa75ed71a1.xml
Bytes: 1,446,323
SHA-256: 0b5463b04dbf9f4cbb487e5e6ab74a7d1aa352da85e880775c7fdee4a4974a79
```

It is labelled as official metadata XML because it contains no article, recital or annex text. The main source register is `sources/source-register.json`, and `public/source-register.json` is the published copy used by the website and downloadable skill.

A weekly GitHub Actions workflow checks allowlisted official sources. It can create or update one issue when something changes, but it never rewrites legal explanations or republishes them automatically.

## Reviewer skill

The portable skill is in `eu-ai-act-reviewer/`:

```text
eu-ai-act-reviewer/
├── SKILL.md
├── LICENSE
└── references/
    ├── official-sources.md
    ├── review-rules.md
    ├── article-50-content-labelling.md
    ├── coverage-dates-and-penalties.md
    └── output-contract.md
```

It reviews user journeys, public content and codebases in read-only mode. It flags potentially relevant EU AI Act provisions, missing evidence, application dates and human decisions without issuing a formal legal classification or compliance verdict.

The same package was successfully invoked in Codex and Claude Code. It did not edit the reviewed files or create a report file.

Downloads:

- ZIP: <https://aiact.bencium.io/downloads/eu-ai-act-reviewer-skill-v1.0.0.zip>
- Raw `SKILL.md`: <https://aiact.bencium.io/downloads/eu-ai-act-reviewer-SKILL-v1.0.0.md>
- Checksum file: <https://aiact.bencium.io/downloads/eu-ai-act-reviewer-skill-v1.0.0.sha256>

Verified ZIP details:

```text
Version: 1.0.0
Bytes: 36,383
SHA-256: 13e7fb42697e166fc408853803ca264da8717eafd8cca7c6f57149a176969c5e
```

The matching GitHub `v1.0.0` tag and release have not been created because the review pull request is not merged yet.

## Privacy and security boundaries

There is no backend, account, form, free-text field, analytics product or runtime AI service.

Questionnaire answers stay only in the current page's JavaScript memory and disappear on reload or when the tab closes. This is intentional because visitors do not submit names or confidential details and the guide should not create a stored legal-assessment record.

Only these session preferences are stored:

- selected language;
- whether the no-cookie notice was dismissed.

The no-cookie notice explains that the guide uses no analytics or non-essential cookies. Vercel and Cloudflare may still process IP addresses and basic request information to deliver and protect the site; the Privacy and Cookies page explains this boundary.

Verified deployment controls:

- Vercel Web Analytics is disabled.
- No Speed Insights collection script is installed.
- No external Vercel drains are configured.
- Observability Plus is not enabled.
- Generated pages contain no third-party analytics scripts, remote fonts, forms, uploaded-content handling or unapproved browser storage.
- Security headers include a restrictive content policy, clickjacking protection, referrer controls and disabled camera, microphone, location, payment and USB permissions.

The main trust boundaries are official external legal sources, unreviewed translations, Vercel and Cloudflare delivery infrastructure, and private material inspected locally by the reviewer skill.

## Cookie notice and legal pages

The informational no-cookie notice is not a consent form. It accurately states that there are no analytics or non-essential cookies and that session preferences disappear when the session ends.

Project-specific pages exist for:

- Terms and Conditions;
- Privacy and Cookies;
- Educational Disclaimer;
- About and independence;
- Open source, licences and attribution.

The legal pages identify Bencium Limited and explain the educational purpose, reliance limits, external links, open-source licensing, all-age access and governing-law boundary.

## Third-party skill assessment

`research/2026-08-02-third-party-skills-assessment.md` records the dated assessment of:

- `alirezarezvani/claude-skills` at commit `aa8d778`;
- `borghei/Claude-Skills` at commit `da5a862`.

The project is independently authored. No wording, code, templates or workflow material was copied from either repository. The note explains the dated legal, classification, installation and licensing concerns with direct supporting file links.

## Verification completed

The following checks passed locally and in GitHub Actions:

- 265 static HTML pages built successfully.
- All 24 locale files passed structural and protected-legal-token checks.
- All 51 legal decision-path tests passed.
- The source archive validated four archived artifacts and nine registered official sources.
- The XHTML structure matched 180 recitals, 113 articles and 13 annexes.
- The skill ZIP contained only the expected real files and no symbolic links.
- The downloaded ZIP matched the published checksum.
- `npm audit --audit-level=high` reported no known vulnerabilities.
- GitHub pull-request check `verify` passed.
- English, German and Irish layouts and translation warnings were inspected.
- The three-guide main-page interaction, focus movement and no-cookie notice were tested.
- `https://aiact.bencium.io/en/` returned HTTP 200 through Cloudflare and Vercel on 2 August 2026.

Useful commands:

```bash
npm ci
npm test
npm run build
npm run validate:locales
npm run validate:sources
npm run validate:skill
npm audit --audit-level=high
```

To rebuild the downloadable skill after changing its files:

```bash
npm run package:skill
npm run validate:skill
```

## Repository and deployment state

GitHub owner: `bencium`

```text
Repository: bencium/eu-ai-act-guide
Branch: agent/initial-release
Review commit: c6748c9 Build the EU AI Act Guide
Base commit: 0aa304f Initialize repository
Pull request: #1, open and draft
Pull-request check: verify passed
```

Use the GitHub account `bencium` for this repository. Do not change a shared terminal's GitHub identity if another project is using it; use a command-only `bencium` credential instead.

Vercel:

```text
Team: bencium2 / Bencium Team
Project: eu-ai-act-guide
Configured production branch: main
Current live deployment: dpl_E83RPm3vFRJFKYwxKzGoAsvFHkmL
Explicit preview deployment: dpl_LF7wLaCWV6cyrZemREXTXTrGQXNp
Preview URL: https://eu-ai-act-guide-huau2hvkz-bencium2.vercel.app
```

The explicit preview address may require a Vercel sign-in. The custom domain and temporary public Vercel address are publicly reachable.

## Remaining work

1. Review the live wording, legal boundaries and design alongside draft pull request #1.
2. If approved, mark the pull request ready and merge it into `main`.
3. Confirm that Vercel automatically creates a passing production deployment from the merged `main` commit. Do not treat the earlier manual branch deployment as proof of this automatic path.
4. Re-check `https://aiact.bencium.io/en/`, several translated pages, security headers and all three tools after the `main` deployment.
5. Create tag `v1.0.0` from the merged release commit and publish the matching GitHub release. Confirm its ZIP, raw `SKILL.md` and checksum match the website files.
6. Confirm that GitHub Actions is allowed to create or update the single legal-source-change issue.
7. Keep the unreviewed-translation and educational warnings visible until qualified legal and native-language reviewers approve replacement wording.

## Human decision required

The immediate decision is whether draft pull request #1 is approved or needs changes. Do not create the `v1.0.0` release from the current unmerged branch.
