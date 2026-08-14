I'll produce the review now. This is a read-only analysis deliverable — the evidence is fully contained in the prompt (a described user journey), so there's no codebase to explore and no files to edit. Per the run constraints (single-turn, no internet, "produce the full review report now"), I'm following the skill's output contract directly rather than the code-planning workflow.

---

# EU AI Act review — symptom chatbot, private clinic group (Lyon)

## Report header

- **Review scope:** The described patient user journey for a website symptom chatbot at a private clinic group in Lyon, France — from the auto-opening chat window through symptom entry, the specialist recommendation, appointment offer, the "chest pain" keyword branch, and the marketing page wording. Six-step supplied narrative only.
- **Evidence level:** `Supplied statement` (what the user says happens), with parts reading as `documented design`. No source code, tests, deployed system, or live user-visible behaviour was provided or observed. Nothing was independently confirmed.
- **Legal currency:** Live legal-source verification was unavailable. This review uses the pinned source register dated 2 August 2026 and does not claim to state current law. Sources cited are Regulation (EU) 2024/1689 as affected by Regulation (EU) 2026/1744; the pinned register lists a Hungarian-language corrigendum among others, but this review reasons from the English text and the French-language version was not checked.
- **Known limits:** No information on the legal role split between the clinic and the third-party model host; no intended-purpose statement; no placement-on-market or put-into-service date; no view of the actual chat UI, its wording at first interaction, any AI disclosure that may appear elsewhere, exported/logged output, or machine-readable marking; no accessibility information. High-risk classification and non-AI-Act regimes were not assessed.

---

## Findings

### EUAI-001 — Patient is not told the chat is automated at the point of interaction

1. **Review surface:** Journey step 2 — the chat window opens automatically with "Hi! Tell me what's bothering you and I'll help you pick the right specialist," with "no statement about whether the chat is automated"; and step 6 — the marketing page calls it "your AI health assistant" but "the chat window itself never mentions AI."
2. **Observed evidence:** The supplied narrative states the chat interface itself carries no indication that the patient is interacting with an automated system. An "AI" mention exists only on a separate marketing page, not in the chat at first interaction.
3. **Possible AI Act trigger:** Article 50(1) — duty to design and develop an AI system intended to interact directly with natural persons so that those persons are informed they are interacting with an AI system, unless this is obvious to a reasonably well-informed, observant and circumspect person in the circumstances and context of use.
4. **Role and conditions:** Article 50(1) is a **provider** duty. Who is the provider here is uncertain: the third-party model host placed the system on the market, while the clinic configured the prompts and puts it into service for its own purpose — the clinic could itself become a provider (for example under the Act's rules on substantial modification or placing under its own name). The trigger also requires that the AI nature is *not* obvious in context; a marketing-page label does not automatically make it obvious inside the chat, and clinic patients may include vulnerable users. The law-enforcement exception does not appear engaged.
5. **Official source level and exact link:** Law — [Article 50(1), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), read with [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744). Official guidance — [Commission guidelines on transparency obligations](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems).
6. **Applicable date:** Article 50 applies from **2 August 2026**. Today's date is after that, so the provision is in application; there is no separate transition delaying Article 50(1).
7. **Status:** possibly relevant
8. **Missing facts:** Which entity is the provider for this system; the exact wording and any icon/notice actually shown in the chat at first interaction; whether an AI indication appears anywhere in the chat flow itself; whether the clinic modified the system enough to take on provider duties; the audience and whether AI status is "obvious" in this specific context.
9. **Next action:** Capture the real first-interaction chat screen (screenshot plus exact text) and the contract/role documentation between the clinic and the model host, so the provider role and the "obvious in context" question can be tested against the actual interface.
10. **Human decision required:** A responsible person at the clinic (with legal input) must decide who holds the Article 50(1) provider role and whether the current interface informs patients that they are interacting with AI.

---

### EUAI-002 — The chatbot's generated text may need a machine-readable "artificial" mark

1. **Review surface:** Journey steps 3–4 — the bot produces conversational replies and the recommendation "Based on what you describe, I recommend booking dermatology rather than general practice," generated by "a large language model hosted by a third-party provider; the clinic configured the prompts."
2. **Observed evidence:** The system generates free-text output from a large language model. The narrative says nothing about whether that output carries any machine-readable marking identifying it as artificially generated.
3. **Possible AI Act trigger:** Article 50(2) — providers of AI systems generating synthetic audio, image, video or **text** must ensure outputs are marked in a machine-readable format and detectable as artificially generated or manipulated, subject to technical feasibility and the stated exceptions (standard-editing assistance; no substantial alteration of the deployer's input; or authorised criminal-law-enforcement use).
4. **Role and conditions:** Article 50(2) is a **provider** duty (same role uncertainty as EUAI-001). It requires that the output is "synthetic text" within scope and that none of the stated exceptions removes the duty. Whether short conversational assistant replies of this kind fall inside Article 50(2)'s marking duty is a definitional question the evidence cannot settle; it is distinct from the human-facing disclosure in EUAI-001. Evidence of a mark would have to appear in the actual exported/stored output and be detectable — a function name or UI label would not be enough.
5. **Official source level and exact link:** Law — [Article 50(2), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689). Official guidance — [Commission Article 50 questions and answers](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act). Voluntary code (implementation aid only) — [Code of Practice on marking and labelling AI-generated content](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content).
6. **Applicable date:** Article 50(2) applies from **2 August 2026**. If this system was placed on the market before 2 August 2026, amended Article 111(4) allows until **2 December 2026** to comply with Article 50(2) — the placement date must be confirmed before relying on that transition.
7. **Status:** possibly relevant
8. **Missing facts:** Whether the model output carries any machine-readable artificial-content mark in the stored/exported text; whether the third-party model provider already applies such marking upstream; whether any Article 50(2) exception applies; the exact date the system was placed on the market or put into service (to fix the applicable deadline).
9. **Next action:** Ask the model host whether its outputs are machine-readable-marked as AI-generated, and inspect an actual stored transcript to check for any such mark — testing the exported artefact, not the on-screen wording.
10. **Human decision required:** A responsible person (with legal input) must decide, with the model host, whether Article 50(2) marking applies to this conversational output and, if so, who implements it and by which date.

---

### EUAI-003 — Any required AI disclosure must be clear and present at first exposure, not only on a marketing page

1. **Review surface:** Journey step 6 contrasted with step 2 — the AI mention lives on the marketing page ("your AI health assistant"), while "the chat window itself never mentions AI."
2. **Observed evidence:** The only stated AI disclosure sits on a separate marketing page. The patient's first exposure to the chat (step 2) contains no such statement.
3. **Possible AI Act trigger:** Article 50(5) — information required under Article 50(1)–(4) must be provided in a clear and distinguishable manner, at the latest at the time of the first interaction or exposure, and must meet applicable accessibility requirements. A disclosure that a patient may never see before interacting may not meet the timing and clarity qualities.
4. **Role and conditions:** This qualifies *how* any Article 50 disclosure must be presented; it bites only if an underlying Article 50(1)–(4) duty applies (see EUAI-001, EUAI-002). The regulation does not prescribe a single sentence, icon, colour, or placement — the chosen implementation is judged in its real context. A marketing-page label reached by a different path does not, on its face, satisfy "at the latest at the time of the first interaction."
5. **Official source level and exact link:** Law — [Article 50(5), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689). Official optional tool — [EU icons for labelling AI-generated content](https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content) (optional; does not by itself prove compliance).
6. **Applicable date:** Applies from **2 August 2026**, together with whichever of Article 50(1)–(4) is engaged.
7. **Status:** possibly relevant
8. **Missing facts:** Whether any AI disclosure actually appears within the chat at or before first interaction; the accessibility properties of the chat (screen-reader text, contrast, etc.); whether patients routinely reach the chat without passing the marketing wording.
9. **Next action:** Map where, when, and how any AI notice appears from the patient's entry point onward (including via direct links and shared/booking URLs), and record whether it is present and accessible at first exposure.
10. **Human decision required:** A responsible person must decide whether any required AI disclosure is presented clearly, at first exposure, and accessibly within the chat itself.

---

### EUAI-004 — Emotion recognition / biometric categorisation duty (tested, not triggered on this evidence)

1. **Review surface:** Whole journey — symptom text entry (step 3) and the keyword-driven "chest pain" branch (step 5).
2. **Observed evidence:** The system processes typed symptom text and a clinic-maintained keyword list. No evidence of processing biometric data, or of inferring emotions or categorising people from biometric data.
3. **Possible AI Act trigger:** Article 50(3) — deployer duty to inform people exposed to an emotion-recognition or biometric-categorisation system of its operation.
4. **Role and conditions:** Would be a **deployer** (clinic) duty and requires an emotion-recognition or biometric-categorisation system as defined in the Act. No such processing is evidenced here.
5. **Official source level and exact link:** Law — [Article 50(3), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** Would apply from 2 August 2026 if engaged.
7. **Status:** no trigger found in the supplied evidence
8. **Missing facts:** Whether any component infers emotional state or categorises patients from biometric input (none indicated).
9. **Next action:** If future versions add emotion or biometric features, re-run this check against that design.
10. **Human decision required:** None arising from this evidence; revisit if biometric or emotion features are introduced.

---

### EUAI-005 — Deepfake and public-interest-text duties (tested, not triggered on this evidence)

1. **Review surface:** Journey steps 3–5 — individualised specialist recommendation and urgent-care routing delivered privately to one patient.
2. **Observed evidence:** The generated content is a one-to-one triage-style message to an individual patient. No image, audio, or video is generated; the text is not published to inform the public on a matter of public interest.
3. **Possible AI Act trigger:** Article 50(4) — deployer disclosure for deepfakes (image/audio/video resembling real or plausible subjects and falsely appearing authentic) and for AI-generated/manipulated text published to inform the public on a matter of public interest.
4. **Role and conditions:** Both limbs require conditions absent here: there is no image/audio/video content (deepfake limb, Article 3(60)), and the message is private individual advice rather than public-interest publication (text limb).
5. **Official source level and exact link:** Law — [Article 50(4) and Article 3(60), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** Would apply from 2 August 2026 if engaged.
7. **Status:** no trigger found in the supplied evidence
8. **Missing facts:** Whether the clinic ever publishes AI-generated text to the public, or generates images/audio/video (not indicated in this journey).
9. **Next action:** If AI-generated public communications or media are added, review them separately against Article 50(4).
10. **Human decision required:** None arising from this evidence.

---

## Closing section

### 1. Human decisions now required
- Decide **who holds the provider role** for this chatbot (third-party model host, the clinic, or both) — this determines who owes the Article 50(1) and 50(2) duties. *(EUAI-001, EUAI-002)*
- Decide whether patients are **informed within the chat itself** that they are interacting with AI, at first interaction and accessibly. *(EUAI-001, EUAI-003)*
- Decide, with the model host, whether **Article 50(2) machine-readable marking** applies to the generated output and who implements it, and confirm the **placement date** that fixes the 2 August 2026 vs 2 December 2026 deadline. *(EUAI-002)*

### 2. Evidence still needed (shortest list that would change findings)
- The actual first-interaction chat screen and exact wording (and any AI notice anywhere in the flow).
- The role/contract split between the clinic and the third-party model host.
- Whether stored/exported model output carries a machine-readable AI mark.
- The date the system was placed on the market / put into service.

### 3. Separate legal signposts (named, not assessed here)
- Whether this symptom-to-specialist triage tool falls under the AI Act's **high-risk classification** (Chapter III / Annex rules) or under EU **medical-device** law is a separate analysis with different application dates (high-risk Chapter III obligations phase in from 2 December 2027 / 2 August 2028); not assessed in this transparency-focused review.
- Processing of patient **health data** may engage EU data-protection law and French national rules; not assessed here.
- French **national health, consumer, and advertising** law (including the "AI health assistant" marketing claim) may be relevant; not assessed here.

### 4. Limitations
This is educational EU AI Act issue-spotting based only on a short supplied journey description, not legal advice and not proof of compliance. No system, code, or live behaviour was observed. Live legal-source verification was unavailable, so no statement here claims to be current law; findings should be confirmed against the official sources before any decision. Any penalty ceilings under Article 99 are statutory maximums only — none is asserted here — and actual enforcement depends on the applicable law, authority, organisation, and facts.
