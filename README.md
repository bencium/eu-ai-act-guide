# The EU AI Act Guide

An independent educational guide for non-technical people at [aiact.bencium.io](https://aiact.bencium.io). It is not an official EU website and does not provide legal advice or legal clearance.

The main page contains three short tools and shows only the one a visitor chooses: what the EU AI Act may mean for a person, whether one professional AI use may be covered, and which Article 50 content-marking or disclosure duty may be relevant. It has no backend, accounts, forms, analytics, advertising, or runtime AI service.

## Run it locally

```text
nvm use
npm ci
npm run dev
```

The project uses one pinned dependency: Astro. `npm run build` validates the legal archive, all 24 language files, the downloadable reviewer skill, and every generated page before producing the static site in `dist/`.

## Change translated content

English is the authored source in `src/i18n/locales/en.json`. The other 23 files use the same keys, while every page and all decision logic are shared.

1. Edit the English value.
2. Refresh that key in all 23 translated locale files.
3. Run `npm run translations:stamp` only after those translations are refreshed.
4. Run `npm run build`.

The build stops if English changed without a translation refresh, if a locale is incomplete, or if protected legal numbers, dates, links, or placeholders changed.

## Official sources

The canonical source register is `sources/source-register.json`. The original English Official Journal PDF, structured XHTML, and official metadata XML are preserved under `sources/original/2024-1689/` with retrieval records, byte sizes, and SHA-256 checksums.

Automated monitoring reports an official-source change through a GitHub issue. It never rewrites legal explanations or publishes an update automatically.

## Reviewer skill

The portable `eu-ai-act-reviewer/` skill works in Codex and Claude Code. The site publishes a versioned ZIP, raw `SKILL.md`, and matching checksum. It reviews supplied evidence in read-only mode and flags possible EU AI Act provisions without issuing a legal or compliance verdict.

## Licences

Website code and the reviewer skill are MIT licensed. Original project explanations are CC BY 4.0. EU legal documents, metadata, guidance, and icons remain under their official reuse terms; see `CONTENT-LICENSE.md`.
