# EU AI Act review — CV screening at a Dutch logistics company

## Review scope

- **What was reviewed:** the supplied six-step user journey describing a hiring manager using the "Smart Ranking" feature inside an applicant tracking system (ATS) to fill three warehouse-supervisor roles at a 900-employee logistics company in Rotterdam, Netherlands.
- **Evidence level:** `Supplied statement` — a written narrative of what the system and manager do. No source code, configuration, tests, deployed behaviour, screenshots, vendor documentation, or candidate-facing screens were provided, so nothing above a described-behaviour level could be verified.
- **Legal currency:** Live legal-source verification was unavailable. This review uses the pinned source register dated 2 August 2026 and does not claim to state current law. Because internet access was unavailable, I could not confirm whether a corrigendum or amendment published after that date changes any provision cited below.
- **Known limits:** This is issue-spotting, not a legal opinion or a compliance verdict. I did not confirm the vendor's role, the system's declared intended purpose, whether the tool meets the legal definition of an "AI system," the placement-on-market date, or any of the company's internal policies, training, or instructions for use. Nothing here classifies the system as high-risk or as anything else — that is a human legal decision.

---

## Findings

### EUAI-001 — Automated CV ranking may fall within the recruitment area the Act treats as high-risk

1. **Review surface:** Journey steps 2–4 (the feature reads each CV, scores candidates 0–100 against the job description, orders the list, and auto-flags two candidates "employment gap risk").
2. **Observed evidence:** The feature scores and ranks applicants and auto-flags candidates on a stated risk factor; the manager acts on that ordering and those flags. `Supplied statement`.
3. **Possible AI Act trigger:** Annex III, point 4 — systems intended to be used for recruitment or selection of natural persons, in particular to analyse and filter job applications and to evaluate candidates. This is one of the areas the Act lists as high-risk.
4. **Role and conditions:** The company appears to be the **deployer** (it uses the tool under its own authority in a professional recruitment activity). The US vendor appears to be the **provider** (inferred — not confirmed). For the trigger to apply, all of these must hold: the tool meets the Article 3(1) definition of an "AI system"; its intended purpose is recruitment/candidate evaluation; and the Article 6(3) "does not pose a significant risk" filter does not remove it — note that Article 6(3) keeps a system high-risk where it profiles natural persons, and scoring/ranking candidates is likely profiling. Each condition needs confirmation.
5. **Official source level and exact link:** Law — Annex III(4) and Article 6, [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), read with [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744).
6. **Applicable date:** If the system is classified as high-risk through Article 6(2)/Annex III, the relevant Chapter III obligations apply from **2 December 2027**, subject to the Article 111 transitional rules (placement date, significant changes). Confirm the placement/first-use facts before fixing the date.
7. **Status:** likely relevant.
8. **Missing facts:** whether the tool meets the Article 3(1) AI-system definition; the provider's declared intended purpose and any conformity documentation; whether the Article 6(3) filter is being claimed; the date the system was placed on the market or put into service.
9. **Next action:** obtain the vendor documentation (intended purpose, instructions for use, and any high-risk classification or declaration of conformity) and check the Article 3(1) definition against how the tool actually works.
10. **Human decision required:** a compliance/legal owner must decide whether this system is high-risk under Annex III and, if so, which deployer obligations attach. Not for the agent.

### EUAI-002 — Staff may lack the AI literacy the Act already requires (currently in force)

1. **Review surface:** Journey steps 4 and 6 (manager rejects two flagged candidates without opening their CVs; vendor documentation was never reviewed by HR).
2. **Observed evidence:** The manager acts on automated flags without reading the underlying CVs, and no one reviewed the vendor's documentation. `Supplied statement`.
3. **Possible AI Act trigger:** Article 4 — providers and deployers must take measures to ensure a sufficient level of AI literacy among staff who operate and use AI systems on their behalf.
4. **Role and conditions:** Company = deployer. The duty applies to staff using the system on the deployer's behalf; "sufficient" is judged against the context and the people affected. The evidence points toward an absence of measures, but adequacy is contextual and unverified.
5. **Official source level and exact link:** Law — Article 4, [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** **2 February 2025** — this provision already applies, subject to the amended text under Regulation (EU) 2026/1744.
7. **Status:** possibly relevant.
8. **Missing facts:** whether any training, usage guidance, or instructions exist for HR/hiring staff; the staff's actual competence with the tool; any internal AI-use policy.
9. **Next action:** gather evidence of AI-literacy measures for the hiring team (training records, written guidance, onboarding on the tool's limits).
10. **Human decision required:** management must decide whether current AI-literacy measures are sufficient for staff using this tool.

### EUAI-003 — Human oversight of the ranking may be nominal (deployer duties)

1. **Review surface:** Journey steps 3, 4, and 6 (manager reviews only the top 15 of 212; the rest are collapsed under "lower match"; two flagged candidates are rejected unread; no documented process for a human to re-check the ranking).
2. **Observed evidence:** The interface hides most applicants below a score threshold; rejections occur without opening the CVs; there is no documented human re-check. `Supplied statement`.
3. **Possible AI Act trigger:** Article 26 — deployer obligations for high-risk AI, including using the system in line with the instructions for use, assigning human oversight to competent people with the authority and support to exercise it, and monitoring operation. This depends on the classification in EUAI-001.
4. **Role and conditions:** Company = deployer. The duty applies only if the system is high-risk (see EUAI-001) and depends on the provider's instructions for use existing; oversight must be genuine rather than a rubber stamp. Contingent.
5. **Official source level and exact link:** Law — Article 26, [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** Contingent on high-risk classification; for Annex III systems the relevant Chapter III obligations apply from **2 December 2027**, subject to Article 111 facts.
7. **Status:** possibly relevant (contingent on the EUAI-001 trigger).
8. **Missing facts:** the high-risk status; whether instructions for use exist and what oversight they require; who holds oversight authority; whether the manager can and does meaningfully override the ranking.
9. **Next action:** once classification is confirmed, obtain the instructions for use and assess whether the actual oversight arrangement matches them.
10. **Human decision required:** the compliance owner must decide how human oversight should be designed and evidenced if the system is high-risk.

### EUAI-004 — Rejected candidates are not told a decision involved automated processing

1. **Review surface:** Journey step 5 (rejected applicants receive a templated email that does not mention any automated scoring).
2. **Observed evidence:** The rejection email omits any reference to the automated scoring or ranking that shaped the outcome. `Supplied statement`.
3. **Possible AI Act trigger:** Article 86 — a person affected by a decision taken on the basis of output from a high-risk AI system (listed in Annex III) that produces legal or similarly significant effects has the right to a clear and meaningful explanation of the AI system's role in the decision, on request. Contingent on high-risk classification.
4. **Role and conditions:** Company = deployer. The duty depends on the system being high-risk (Annex III), the decision being "based on" the AI output, the effect being legal or similarly significant (a recruitment rejection may qualify — fact-specific), and the affected person requesting an explanation.
5. **Official source level and exact link:** Law — Article 86, [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** Contingent; tied to the high-risk application timeline and Article 111 transitional rules. Confirm before fixing the date.
7. **Status:** possibly relevant.
8. **Missing facts:** the high-risk status; whether the rejection is genuinely "based on" the AI output; whether any candidate has requested an explanation; whether a response process exists.
9. **Next action:** after confirming classification, design a process to provide the Article 86 explanation to affected candidates on request.
10. **Human decision required:** legal must decide the explanation/disclosure approach for rejected candidates.

### EUAI-005 — Article 50 transparency duties

1. **Review surface:** The whole journey, tested against Article 50.
2. **Observed evidence:** Candidates do not interact directly with the Smart Ranking feature; the professional user is the hiring manager. No generated or manipulated text, image, audio, or video is described; no emotion-recognition or biometric-categorisation output is described. `Supplied statement`.
3. **Possible AI Act trigger:** Article 50(1)–(4) transparency/marking/disclosure duties.
4. **Role and conditions:** None of the Article 50 conditions (direct interaction with a person; synthetic content generation; emotion/biometric categorisation; deepfake or public-interest text) are evidenced here.
5. **Official source level and exact link:** Law — Article 50, [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** Article 50 applies from **2 August 2026** (where triggered).
7. **Status:** no trigger found in the supplied evidence.
8. **Missing facts:** whether the tool produces any candidate-facing generated content or any interactive candidate touchpoint not shown in this journey.
9. **Next action:** if any candidate-facing chatbot, generated messaging, or content-generation feature exists elsewhere in the product, review it separately against Article 50.
10. **Human decision required:** none at this stage, beyond confirming no candidate-facing AI interaction was omitted from the evidence.

---

## Closing section

### Human decisions now required

1. Whether the Smart Ranking feature is a high-risk AI system under Annex III(4), and which deployer obligations follow (from EUAI-001, EUAI-003, EUAI-004).
2. Whether the company's current AI-literacy measures for hiring staff are sufficient under Article 4 (EUAI-002).
3. How human oversight of the ranking should be designed and evidenced if the system is high-risk (EUAI-003).
4. What explanation/disclosure the company will give rejected candidates (EUAI-004).

### Evidence still needed

- The vendor documentation: declared intended purpose, instructions for use, and any high-risk classification or declaration of conformity.
- The date the system was placed on the market or put into service, plus any significant modifications (drives every date above).
- Any existing AI-literacy training, internal AI-use policy, and the documented (or absent) human re-check process.
- Confirmation that the tool meets the Article 3(1) definition of an "AI system."

### Separate legal signposts (named, not assessed here)

- Separate review may be needed under **EU data-protection law** — automated individual decision-making and profiling (GDPR Article 22) and transparency to data subjects (GDPR Articles 13–15); this regime was not assessed here.
- Separate review may be needed under **EU and Dutch employment and non-discrimination law** — for example, the fairness of an automated "employment gap risk" flag; not assessed here.

### Limitations

This is educational issue-spotting under the EU AI Act only. It is not legal advice, not a compliance verdict, and not proof that any duty does or does not apply. No system here is declared compliant, non-compliant, high-risk, prohibited, safe, or approved. Because live source verification was unavailable, no statement above can be relied on as current law without a fresh check against Regulation (EU) 2024/1689 and Regulation (EU) 2026/1744 on the official EU sources.
