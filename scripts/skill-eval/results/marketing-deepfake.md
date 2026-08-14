# EU AI Act review — synthetic brand ambassador video campaign

**Review scope:** The described five-step user journey for a Spanish cosmetics brand's AI-generated 30-second video ambassador, published on the brand's public Instagram, TikTok and YouTube channels and run as paid advertising across the EU. Review covers the content, its disclosure, the export/metadata step, and the internal approval step as described.

**Evidence level:** `Supplied statement` — a narrative scenario supplied by the user. No content file, rendered output, code, export, or platform behaviour was inspected. The video itself, the actual on-screen frames, the caption in situ, and the metadata were not observed. Higher evidence levels (`user-visible behaviour`, `tested behaviour`) are not available.

**Legal currency:** Live legal-source verification was unavailable. This review uses the pinned source register dated 2 August 2026 and does not claim to state current law. Source language of the pinned register: English. Relevant modifier applied: Regulation (EU) 2026/1744 (in force 27 July 2026). Note: a Spanish-language corrigendum to Regulation (EU) 2024/1689 dated 4 May 2026 exists; because this brand and agency are Spanish, any final legal reading should be done against the Spanish official text, which was not checked here.

**Known limits:** No question was asked (single-turn run). The following were not supplied and are recorded as missing facts below: the legal role of each actor (agency vs. brand vs. model provider), the model provider's identity and where its system was placed on the market, the placement/first-use date of the model, whether the depicted woman resembles a specific identifiable person, and the actual first-exposure appearance of any disclosure on each platform. The machine-readable mark's presence and survival were not tested. Whether the content is offered/used in the Union is treated as evidenced (paid advertising runs across the EU).

---

### EUAI-001 — AI-generated video ambassador may be a "deepfake" the professional deployer must disclose

1. **Review surface:** Journey steps 1–3 — the generated 30-second photorealistic video of a non-existent woman recommending face cream, published on public social channels with no statement in caption or video that the footage is AI-generated.
2. **Observed evidence:** A text-to-video model generated a photorealistic person who "does not exist but looks like a real influencer filmed in a bathroom." Neither the caption nor the video states the person or footage is AI-generated (supplied statement).
3. **Possible AI Act trigger:** Article 50(4) deployer duty to disclose that image/audio/video content constituting a deepfake has been artificially generated or manipulated, read with the Article 3(60) definition (content that (a) resembles existing or plausible persons/objects/events and (b) would falsely appear authentic or truthful).
4. **Role and conditions:** The disclosing actor is the **professional deployer** — here the agency and/or brand publishing the ad; the exact role split is uncertain. Conditions with evidence: video modality; AI-generated; resembles a plausible (photorealistic) person; presented as if genuine footage. Advertising is a professional, non-personal activity, so the Article 2(10) personal-use exclusion does not apply. The Article 50(4) treatment for evidently artistic/satirical/fictional work does not plainly fit a straight product endorsement, but that is a fact for human judgement.
5. **Official source level and exact link:** Law — [Article 50(4) and Article 3(60), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), as amended by [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744).
6. **Applicable date:** Article 50 applies from **2 August 2026**; the review date is 13 August 2026, so the provision is in application. The deployer disclosure duty is not subject to the pre-2 August 2026 placement transition (that transition affects the provider's Article 50(2) marking).
7. **Status:** `likely relevant`
8. **Missing facts:** Confirmed legal role of agency vs. brand as deployer; whether the depicted woman resembles an *identifiable existing* influencer (affects deepfake analysis and separate likeness/data-protection regimes); whether the brand intends any artistic/creative framing.
9. **Next action:** Gather the final published assets on each platform and confirm, in writing, which entity is the deployer that controls publication; hold this against the Article 3(60) two-part test.
10. **Human decision required:** A responsible person (legal/compliance for the brand and agency) must decide whether the content is a deepfake under Article 3(60) and who bears the deployer disclosure duty.

---

### EUAI-002 — A buried "#digitalcreation" hashtag may not meet the presentation requirements for disclosure

1. **Review surface:** Journey step 3 — the only disclosure is a small "#digitalcreation" hashtag appearing 14th of 17 hashtags in the caption; the video contains no disclosure.
2. **Observed evidence:** No disclosure in the video itself; a single hashtag positioned 14th of 17 in the caption (supplied statement). On short-video platforms the video frequently plays before, or without, the caption being read.
3. **Possible AI Act trigger:** Article 50(5) — information required under Article 50(1)–(4) must be clear and distinguishable, provided no later than the first interaction or exposure, and meet applicable accessibility requirements. This finding depends on EUAI-001's Article 50(4) duty being engaged.
4. **Role and conditions:** Same professional deployer as EUAI-001. Condition to test: whether a low-ranked hashtag, not present in the video frame, is "clear and distinguishable" and reaches the viewer "no later than first exposure." The Act does not mandate a specific sentence, icon, or placement; the question is whether this implementation meets the qualities in context.
5. **Official source level and exact link:** Law — [Article 50(5), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689). Official guidance — [Commission guidelines on transparency obligations under Article 50](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems) (explains the Commission's implementation view; not binding).
6. **Applicable date:** From **2 August 2026** (tied to whichever Article 50(1)–(4) duty applies).
7. **Status:** `possibly relevant` (conditional on EUAI-001; the disclosure-adequacy judgement turns on how first exposure actually looks on each platform).
8. **Missing facts:** The actual first-exposure rendering on Instagram, TikTok and YouTube (video-first autoplay, caption truncation, sound-off states); accessibility of any disclosure; whether a disclosure survives when the video is shared, embedded, or re-posted without the caption.
9. **Next action:** Capture the real first-exposure state on each platform (including autoplay, caption-collapsed, and shared/embedded views) and compare against the "clear, distinguishable, at first exposure" test — as an evidence step, not a copy rewrite.
10. **Human decision required:** The brand/agency must decide whether their disclosure method satisfies Article 50(5) or needs a different implementation; any wording change is their decision, not the reviewer's.

---

### EUAI-003 — Provider's machine-readable marking (Article 50(2)) is unverified and does not substitute for the human-facing disclosure

1. **Review surface:** Journey step 4 — the file was exported through the model provider's API, which the provider *says* embeds invisible provenance metadata; nobody at the agency verified this survives Instagram's re-encoding.
2. **Observed evidence:** A provider claim of embedded invisible provenance metadata; no verification that the mark is present in the exported file or survives platform re-encoding (supplied statement).
3. **Possible AI Act trigger:** Article 50(2) — the **provider** of the generative AI system must ensure outputs are marked in a machine-readable format and detectable as artificially generated or manipulated, subject to technical feasibility and the stated exceptions (standard-editing assist; no substantial alteration; law-enforcement authorisation). This is separate from, and does not satisfy, the Article 50(4) human-facing disclosure in EUAI-001/002.
4. **Role and conditions:** The duty-holder is the **model provider**, a different actor from the agency/brand and largely outside the supplied evidence. Conditions to test: whether the provider placed the system on the EU market; whether the mark is actually present and detectable in the real export. A configuration flag or provider statement is not proof of a mark in the output.
5. **Official source level and exact link:** Law — [Article 50(2), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), as amended by [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744). Voluntary code (implementation aid only) — [Code of Practice on marking and labelling AI-generated content](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content).
6. **Applicable date:** Article 50 applies from **2 August 2026**. If the provider placed this system on the market **before 2 August 2026**, amended Article 111(4) gives until **2 December 2026** to comply with Article 50(2). The placement date is unknown, so which date governs cannot be fixed here.
7. **Status:** `insufficient evidence` — the provider's role, EU-market placement, and the actual presence/survival of the mark are all unconfirmed, and the provider is largely outside the supplied material.
8. **Missing facts:** Provider identity and whether its system is placed on the EU market; the model's placement date (governs the 2 December 2026 transition); a technical test confirming the mark exists in the export and after platform re-encoding.
9. **Next action:** Run a technical detection test on the actual exported file and on the platform-published version to see whether any machine-readable mark is present and survives re-encoding; record the result as evidence separate from the human disclosure.
10. **Human decision required:** The brand/agency must decide whether to rely on a provider marking claim and must not treat invisible metadata as meeting their own Article 50(4)/50(5) human-facing duty; whether to seek written assurance from the provider is their call.

---

### EUAI-004 — Direct human-AI interaction disclosure (Article 50(1))

1. **Review surface:** The whole journey — a pre-rendered video advertisement, not an interactive system.
2. **Observed evidence:** The output is a fixed 30-second video; no evidence of a system interacting directly and responsively with a natural person (supplied statement).
3. **Possible AI Act trigger:** Article 50(1) provider duty for systems intended to interact directly with natural persons.
4. **Role and conditions:** Would require an interactive AI surface; a broadcast video ad does not, on the evidence, meet the "interact directly" condition.
5. **Official source level and exact link:** Law — [Article 50(1), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** From **2 August 2026** if it applied.
7. **Status:** `no trigger found in the supplied evidence`
8. **Missing facts:** None identified from this review, unless the campaign later routes viewers into an interactive AI feature (e.g. an AI chat or try-on), which was not described.
9. **Next action:** If the campaign links to any interactive AI experience, review that surface separately.
10. **Human decision required:** None arising here unless an interactive feature is added.

---

### EUAI-005 — Emotion recognition / biometric categorisation disclosure (Article 50(3))

1. **Review surface:** The whole journey.
2. **Observed evidence:** No evidence that any system performs emotion recognition or biometric categorisation on people exposed to the content (supplied statement).
3. **Possible AI Act trigger:** Article 50(3) deployer duty to inform people exposed to an emotion-recognition or biometric-categorisation system.
4. **Role and conditions:** Requires such a system to be in use; none is described.
5. **Official source level and exact link:** Law — [Article 50(3), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** From **2 August 2026** if it applied.
7. **Status:** `no trigger found in the supplied evidence`
8. **Missing facts:** Whether any ad-targeting or audience-analysis tool in the campaign uses biometric categorisation or emotion recognition — not described.
9. **Next action:** If audience-measurement or targeting tools process biometric or emotion data, review those separately.
10. **Human decision required:** None arising here unless such a system is in use.

---

## Closing section

**1. Human decisions now required**
- Decide whether the video is a deepfake under Article 3(60) and which entity (agency or brand) holds the Article 50(4) deployer disclosure duty. *(EUAI-001)*
- Decide whether the current disclosure method (a low-ranked caption hashtag, nothing in-video) meets Article 50(5)'s "clear, distinguishable, at first exposure" qualities, or needs a different implementation. *(EUAI-002)*
- Decide whether to rely on the provider's marking claim, and confirm the brand/agency does not treat invisible metadata as satisfying its own human-facing disclosure. *(EUAI-003)*

**2. Evidence still needed** (shortest list that would change findings)
- Confirmed deployer role (agency vs. brand) and the model provider's identity and EU-market placement date.
- The actual first-exposure appearance of any disclosure on each platform, including autoplay/sound-off, caption-collapsed, and shared/embedded states.
- A technical test of whether a machine-readable mark exists in the export and survives platform re-encoding.
- Whether the depicted woman resembles a specific, identifiable real person.

**3. Separate legal signposts** (named, not assessed here)
- Separate review may be needed under EU consumer-protection and unfair/misleading commercial-practices law and national advertising rules (undisclosed synthetic endorsement of a product).
- Separate review may be needed under EU data-protection law and national personality/likeness/image rights if the depicted person resembles an identifiable individual.
- Separate review may be needed under platform/online-content rules on advertising and synthetic-media disclosure.
These regimes were not assessed.

**4. Limitations**
This is educational EU AI Act issue-spotting based solely on a supplied narrative, not legal advice and not proof of compliance or non-compliance. No system was declared compliant, non-compliant, prohibited, high-risk, safe, or approved; no score or fine was calculated. Legal-source verification was unavailable, so no statement here is warranted as current law, and the Spanish official text (relevant to a Spanish brand) was not checked.
