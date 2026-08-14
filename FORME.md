# Release notes for me — eu-ai-act-reviewer v1.0.0 (14 Aug 2026)

1. GitHub release v1.0.0 is live at bencium/eu-ai-act-guide: tag pushed, the
   release workflow ran green, and all three assets (ZIP, checksum file, raw
   SKILL.md) are attached. The release ZIP's SHA-256 matches the website's
   published checksum exactly (13e7fb42…) — GitHub and aiact.bencium.io serve
   byte-identical artifacts.

2. The skill is in the marketplace: bencium/bencium-marketplace now has an
   eu-ai-act-reviewer plugin (v1.0.0, category "compliance"), registered in
   marketplace.json, with the skill files verified byte-identical to the
   released ZIP. Pushed to main — installable via the marketplace as soon as
   it refreshes. Unrelated uncommitted work in that repo (insurgent-campaign,
   tisza, etc.) was left untouched.

3. PR #3 on eu-ai-act-guide holds the eval harness, so the release gate is
   preserved for future versions — merge whenever convenient.

## Remember: the marketplace copy is a mirror

When the skill next changes (e.g., after a new corrigendum), the update flow:

1. Edit in eu-ai-act-guide
2. `npm run eval:skill`
3. Repackage (`npm run package:skill` + `npm run validate:skill`)
4. Tag the new version (update release-skill.yml's hardcoded tag first)
5. Re-copy into bencium-marketplace and bump BOTH version fields
   (plugin.json + marketplace.json)
