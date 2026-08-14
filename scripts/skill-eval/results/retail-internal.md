**Review scope:** The supplied written user journey for an internal spreadsheet-formula helper used by the 40-person stock-planning team at a furniture retailer in Aarhus, Denmark. Reviewed: the six-step journey from opening the tool to receiving an AI-generated formula suggestion, including the in-tool banner text. No code, screenshots, configuration, deployment records, or the hosted model vendor's terms were supplied.

**Evidence level:** `Supplied statement` — a narrative description of what the tool does. No documented design artifacts, source code, tested behaviour, deployed behaviour, or user-visible behaviour was provided or observed.

**Legal currency:** Live legal-source verification was unavailable. This review uses the pinned source register dated 2 August 2026 and does not claim to state current law. Findings are read against Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744; no live check of newer modifiers was possible.

**Known limits:** The organisation's legal role was not stated; the intended purpose was inferred only from the description; the date the tool was put into service is unknown; no output was inspected for any machine-readable mark; the hosted model vendor and its own transparency measures are unknown; whether staff AI-literacy measures exist was not supplied. This is issue-spotting only, not a compliance conclusion.

---

### EUAI-001 — Telling the user they are dealing with an AI

1. **Review surface:** Journey steps 2 and 6 — the analyst types a formula and receives a corrected formula plus explanation; a banner reads "AI-generated suggestion — verify before use."
2. **Observed evidence:** The tool sends typed text to a hosted large language model and returns a generated suggestion. A persistent banner in the tool identifies the suggestion as AI-generated. The description does not confirm when the banner first appears relative to the first interaction, or how it renders.
3. **Possible AI Act trigger:** Article 50(1) — a system intended to interact directly with a natural person must be designed so the person is informed they are interacting with AI, unless that is obvious in the circumstances to a reasonably well-informed, observant, and circumspect person.
4. **Role and conditions:** Provider duty. Conditions: the system is intended to interact directly with a person (the analyst types input and receives output — plausibly direct); the information must reach the person no later than the first interaction; the "obvious in context" carve-out may already be satisfied by a tool explicitly framed as an AI suggestion helper. The organisation's role as provider is not confirmed (see EUAI-003).
5. **Official source level and exact link:** Law — [Article 50(1), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), as amended by [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744). Official guidance — [Commission guidelines on transparency obligations](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems).
6. **Applicable date:** 2 August 2026 (in application as of this review). No separate transition affects Article 50(1).
7. **Status:** possibly relevant
8. **Missing facts:** Whether the banner is present at or before the first interaction on every entry path; whether the analyst could reach a suggestion without seeing it (e.g. via a shared or embedded view); confirmation of the organisation's provider role.
9. **Next action:** Capture a screen recording of a first-time use, including any shared-link or embedded state, to confirm the disclosure survives first exposure; record the result as user-visible evidence.
10. **Human decision required:** A responsible person must decide whether the existing banner is treated as satisfying Article 50(1) or whether the interaction is considered "obvious" and no design change is pursued.

---

### EUAI-002 — Machine-readable marking of the AI-generated formula text

1. **Review surface:** Journey step 2 — the tool "shows a corrected formula with a short explanation," i.e. generated text output. Step 6 — the banner.
2. **Observed evidence:** The output is synthetic text produced by a hosted large language model. The only marking described is a human-facing banner. No evidence was supplied that the exported or copied output carries any machine-readable mark identifying it as artificially generated.
3. **Possible AI Act trigger:** Article 50(2) — providers of AI systems generating synthetic text (among other modalities) must ensure outputs are marked in a machine-readable format and detectable as artificially generated or manipulated, subject to technical feasibility and stated exceptions. This is distinct from, and not satisfied by, the human-facing banner.
4. **Role and conditions:** Provider duty. Conditions: (a) the organisation (or the model vendor) is a provider of a system that generates synthetic text; (b) no exception applies — the relevant exceptions include a system performing an assistive function for standard editing, or one that does not substantially alter the deployer's input data or its meaning. A formula-correction tool may plausibly fall within the assistive/standard-editing or non-substantial-alteration exceptions, but this is genuinely uncertain and must be tested against the actual behaviour. Provider identity is split: the retailer's IT team may be a provider of the composed tool, while the hosted model vendor is a separate provider (see the signpost below).
5. **Official source level and exact link:** Law — [Article 50(2), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), as amended by [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744). Official guidance — [Article 50 questions and answers](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act).
6. **Applicable date:** 2 August 2026. If the system was placed on the market or put into service before 2 August 2026, amended Article 111(4) allows until 2 December 2026 to comply with Article 50(2). The put-into-service date is unknown, so the applicable deadline cannot be fixed.
7. **Status:** possibly relevant
8. **Missing facts:** Whether the assistive/standard-editing or non-substantial-alteration exception applies to formula correction; whether the copied output already carries any machine-readable mark; whether the hosted model vendor already applies Article 50(2) marking upstream; the date the tool was put into service; confirmation of who holds the provider role.
9. **Next action:** Inspect a copied output and the API response for any embedded machine-readable marker, and check the hosted model vendor's documentation for whether it marks synthetic text at source; record what is actually present in the exported output.
10. **Human decision required:** A responsible person must decide whether formula correction falls within an Article 50(2) exception, and if not, whether marking is performed by the retailer, relied upon from the model vendor, or is technically infeasible.

---

### EUAI-003 — Which legal role the retailer holds

1. **Review surface:** Journey steps 1–5 — the IT team "built" an internal tool that calls a hosted large language model, offered only to internal staff behind single sign-on.
2. **Observed evidence:** The organisation developed and internally deployed a tool built on a third-party hosted model. It is used by employees professionally, on the company intranet. No statement of legal role was supplied.
3. **Possible AI Act trigger:** Article 3 role definitions — provider, deployer, or both. The role determines which Article 50 duties (if any) attach. Building and putting a system into service under one's own name can make an organisation a provider; using a system supplied by another can make it a deployer. The same organisation can hold more than one role.
4. **Role and conditions:** This is the foundational role question, not a substantive trigger. Conditions turn on whether the retailer "places on the market" or "puts into service" a distinct AI system (provider), and/or "uses" a system provided by another under its authority (deployer). Professional (employment) use means the Article 2(10) purely-personal exclusion does not apply.
5. **Official source level and exact link:** Law — [Article 3 and Article 2, Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), as amended by [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744).
6. **Applicable date:** Role definitions apply as part of the framework already in application; the specific duties they route to carry their own dates (see EUAI-001, EUAI-002, EUAI-004).
7. **Status:** insufficient evidence
8. **Missing facts:** Whether the tool is treated as a distinct AI system put into service under the retailer's name; the contractual and technical relationship with the hosted model vendor; whether any branding or substantial modification occurred.
9. **Next action:** Document how the tool was built and offered (own name, modification of the base model, service terms with the vendor) to fix the provider/deployer role before finalising any Article 50 mapping.
10. **Human decision required:** A responsible person must determine the organisation's role(s) under Article 3, as this governs every other transparency finding here.

---

### EUAI-004 — AI literacy of the staff using the tool

1. **Review surface:** Journey step 3 — the tool is used by the 40 employees of the planning team.
2. **Observed evidence:** Forty staff use an AI system as part of their professional duties. No information was supplied on training, guidance, or measures to ensure their understanding of the tool's operation and limitations. The banner asks users to "verify before use."
3. **Possible AI Act trigger:** Article 4 — providers and deployers must take measures to ensure a sufficient level of AI literacy among staff and others operating and using AI systems on their behalf, considering their knowledge, context, and the persons affected.
4. **Role and conditions:** Applies to both providers and deployers, so the unresolved role in EUAI-003 does not remove the obligation. Conditions: an AI system is used by staff on the operator's behalf — supported by the evidence. The measure required is proportionate to context.
5. **Official source level and exact link:** Law — [Article 4, Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), as amended by [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744).
6. **Applicable date:** 2 February 2025 (in application), subject to the amended text.
7. **Status:** likely relevant
8. **Missing facts:** Whether any AI-literacy measures (training, usage guidance, limitations briefing) exist for the planning team beyond the in-tool banner.
9. **Next action:** Gather any onboarding material, training records, or usage guidance provided to the 40 users, so the sufficiency of literacy measures can be assessed by a responsible person.
10. **Human decision required:** A responsible person must decide what AI-literacy measures are proportionate for this team and whether current measures meet Article 4.

---

### EUAI-005 — Emotion recognition and biometric categorisation

1. **Review surface:** Journey step 4 — the tool "processes only formula text and error messages typed by the analyst."
2. **Observed evidence:** No processing of biometric data, no inference of emotions, no categorisation of persons is described. Input is spreadsheet formula text.
3. **Possible AI Act trigger:** Article 50(3) — deployer duty to inform people exposed to emotion-recognition or biometric-categorisation systems.
4. **Role and conditions:** Would require an emotion-recognition or biometric-categorisation system operating on people. No such condition is present in the evidence.
5. **Official source level and exact link:** Law — [Article 50(3), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** 2 August 2026.
7. **Status:** no trigger found in the supplied evidence
8. **Missing facts:** None identified from this review, on the stated input scope.
9. **Next action:** If the input scope later expands to any personal or biometric data, re-run this check.
10. **Human decision required:** None at this time, unless the input scope changes.

---

### EUAI-006 — Deepfakes and public-interest text disclosure

1. **Review surface:** Journey steps 2 and 5 — output is a corrected formula and short explanation, copied manually by the analyst; nothing is published or written back automatically.
2. **Observed evidence:** The output is internal spreadsheet text used by one analyst. There is no image, audio, or video content, no depiction of persons or events, and no publication to inform the public.
3. **Possible AI Act trigger:** Article 50(4) — deployer disclosure for deepfakes (image, audio, video) and for text published to inform the public on a matter of public interest.
4. **Role and conditions:** Deepfake conditions (Article 3(60): resemblance to real/plausible subjects and false appearance of authenticity) are absent. Public-interest-text conditions (published to inform the public on a matter of public interest) are absent — the text is internal formula assistance.
5. **Official source level and exact link:** Law — [Article 50(4) and Article 3(60), Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** 2 August 2026.
7. **Status:** no trigger found in the supplied evidence
8. **Missing facts:** None identified from this review, on the stated internal, non-published use.
9. **Next action:** If any output is later published externally or repurposed into public-facing content, re-run this check.
10. **Human decision required:** None at this time, unless outputs become public-facing.

---

### EUAI-007 — Prohibited practices and high-risk classification

1. **Review surface:** Whole journey — an internal formula-correction aid for stock planning, with no automatic write-back and no access to customer, employee, or supplier records.
2. **Observed evidence:** The described purpose is assisting with spreadsheet formulas. The evidence shows no manipulation, social scoring, biometric use, or decision-making about individuals' rights, employment, credit, education, or essential services.
3. **Possible AI Act trigger:** Article 5 prohibited practices; Article 6 with Annexes I and III high-risk classification.
4. **Role and conditions:** A prohibited-practice or high-risk finding depends on intended purpose and the full statutory conditions, not on the sector. Nothing in the evidence engages an Annex III use case or an Article 5 practice. Intended purpose was inferred, not confirmed.
5. **Official source level and exact link:** Law — [Article 5 and Article 6 with Annexes I and III, Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), as amended by [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744).
6. **Applicable date:** Prohibited-practice provisions apply on staggered dates (from 2 February 2025, with certain added provisions from 2 December 2026); high-risk provisions apply on later dates (2 December 2027 and 2 August 2028) depending on the classification route. Not reached here, as no trigger is engaged.
7. **Status:** no trigger found in the supplied evidence
8. **Missing facts:** A formal statement of the tool's intended purpose, to confirm it is not used for any decision about people.
9. **Next action:** Record the documented intended purpose and confirm the tool is not repurposed for personnel, credit, or other Annex III decisions.
10. **Human decision required:** A responsible person should confirm the intended purpose is limited to formula assistance and will not drift into a regulated decision use.

---

## Closing section

**1. Human decisions now required**
- Determine the organisation's role(s) under Article 3 (provider, deployer, or both) — this governs the transparency findings. (EUAI-003)
- Decide whether the existing banner satisfies Article 50(1) or whether the interaction is treated as obvious. (EUAI-001)
- Decide whether formula correction falls within an Article 50(2) exception; if not, decide where machine-readable marking comes from and whether it is feasible. (EUAI-002)
- Decide what AI-literacy measures are proportionate for the 40 users and whether current measures meet Article 4. (EUAI-004)
- Confirm the documented intended purpose stays limited to formula assistance. (EUAI-007)

**2. Evidence still needed**
- The date the tool was put into service (fixes the Article 50(2) deadline: 2 August 2026 vs the 2 December 2026 transition).
- How the tool was built and offered, and the relationship with the hosted model vendor (fixes the role).
- Whether copied output carries any machine-readable mark, and whether the model vendor marks output upstream.
- Any staff AI-literacy or usage-guidance material.

**3. Separate legal signposts (named, not assessed here)**
- Sending typed formula text and error messages to a hosted third-party model may raise EU data-protection questions (Regulation (EU) 2016/679, GDPR) if any input ever contains personal data; not assessed here.
- The hosted large language model may itself be a general-purpose AI model with its own provider obligations, and the vendor is a separate provider; those obligations were not assessed here.
- Contractual, confidentiality, and IT-security terms with the model vendor may matter; not assessed here.

**4. Limitations**
This is educational EU AI Act issue-spotting based only on a supplied written journey, produced without live legal-source verification and using the pinned 2 August 2026 register. It is not legal advice, not a compliance verdict, and not proof that any duty is or is not met. No risk classification, compliance score, or enforcement prediction is made.
