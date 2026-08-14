# EU AI Act issue-spotting review — remote exam proctoring with engagement detection

**Review scope:** The supplied written user journey for a remote-exam proctoring app used by a university in Munich: app installation, continuous webcam recording and facial analysis during exams, vendor brochure claims about detecting "stress, confusion and distraction levels" and producing an "integrity confidence score," threshold-based flagging, staff review, and misconduct interviews. Contract signed 2025; current model version deployed by the vendor in September 2026. No code, screenshots, configuration, deployed system, or actual disclosure wording was supplied.

**Evidence level:** `Supplied statement` (the described journey) and `Documented design` (vendor brochure marketing claims, treated as claims to test, not established facts). No `Source code`, `Tested behaviour`, `Deployed behaviour`, or directly observed `User-visible behaviour` was available.

**Legal currency:** Live legal-source verification was unavailable. This review uses the pinned source register dated 2 August 2026 and does not claim to state current law.

**Known limits:** I could not verify the amended operative text of the Act live against EUR-Lex, so any provision changed by Regulation (EU) 2026/1744 may differ from what is described here. I was not given the app's stated intended purpose, the exact student-facing notice wording, the data flow, whether the "states" are inferred from biometric data within the meaning of the Act, whether any medical or safety purpose is claimed, or the precise placing-on-the-market date of the deployed model version. This is issue-spotting, not a legal opinion or a compliance verdict.

---

### EUAI-001 — Inferring emotional states of students in a university exam may engage the Article 5 prohibited-practice rules

1. **Review surface:** Journey stages 2–3 — continuous facial analysis during the exam; vendor brochure states the system detects "stress, confusion and distraction levels" from facial expression and gaze.
2. **Observed evidence:** The brochure claims the system infers affective/attention states ("stress, confusion and distraction") of individual students from their faces during university exams. Whether this is technically "inference of emotions from biometric data" is a vendor marketing claim, not confirmed behaviour.
3. **Possible AI Act trigger:** Article 5 restriction on using AI systems to infer emotions of natural persons in the area of education institutions, read with the Article 3 definitions of "emotion recognition system" and "biometric data," and the exception for medical or safety purposes.
4. **Role and conditions:** The vendor is likely the provider; the university is likely the deployer — both are addressed by Article 5, which restricts placing on the market, putting into service, and use. Material conditions to confirm: that the system infers "emotions" within the Act's meaning (stress and confusion read as emotions; "distraction/attention" may be argued to be an intention or state rather than an emotion and needs testing); that a university exam is an "education institution" context; that inference is from biometric data; and that no medical or safety-reason exception applies (none is evident here).
5. **Official source level and exact link:** Law — [Article 5 and Article 3, Regulation (EU) 2024/1689 (CELEX 32024R1689)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), as amended by [Regulation (EU) 2026/1744 (CELEX 32026R1744)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744). The exact amended wording could not be verified live.
6. **Applicable date:** The original prohibited-practice framework began to apply on 2 February 2025, subject to the text as amended by Regulation (EU) 2026/1744; certain newly added prohibited-practice provisions apply from 2 December 2026. Which date governs this specific practice must be confirmed against the amended article. The deployed model version (September 2026) post-dates both 2 February 2025 and 2 August 2026.
7. **Status:** possibly relevant
8. **Missing facts:** The system's documented intended purpose; whether it infers "emotions" from "biometric data" as the Act defines those terms; whether any medical or safety purpose is claimed; the exact amended Article 5 text and its application date; the placing-on-the-market date of the deployed version.
9. **Next action:** Obtain the vendor's technical documentation and stated intended purpose, and the exact current Article 5 wording from EUR-Lex, so a lawyer can test whether this practice falls inside or outside the education restriction and its exceptions.
10. **Human decision required:** A qualified legal reviewer must decide whether Article 5 applies to this deployment and what the university and vendor must do; this cannot be decided by the agent and is not decided here.

---

### EUAI-002 — Students are not told that emotional and attention states are inferred (Article 50(3) deployer information duty)

1. **Review surface:** Journey stage 5 — "Students are told recording occurs, but not that emotional or attention states are inferred," read with stages 2–3.
2. **Observed evidence:** The supplied journey states affirmatively that the emotional/attention inference is not disclosed to students, while webcam recording itself is disclosed.
3. **Possible AI Act trigger:** Article 50(3) — where an emotion recognition system is used, the deployer must inform the natural persons exposed to it of the operation of the system, subject to the stated law-enforcement exception.
4. **Role and conditions:** The university is the likely deployer carrying this duty. Conditions to confirm: that the system is an "emotion recognition system" within Article 3 (see EUAI-001); that students are "exposed" persons (they are, on the evidence); and that the law-enforcement exception does not apply (no evidence it does). This is a human-facing information duty, separate from any content-marking duty and separate from the Article 5 question in EUAI-001.
5. **Official source level and exact link:** Law — [Article 50(3), Regulation (EU) 2024/1689 (CELEX 32024R1689)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), read with [Regulation (EU) 2026/1744 (CELEX 32026R1744)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744). Official guidance — [Commission guidelines on transparency obligations](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems) explains the Commission's implementation view but does not create the duty.
6. **Applicable date:** Article 50 applies from 2 August 2026. The current model version was deployed in September 2026, after that date, so no pre-market provider transition is evident for the deployer information duty. Presentation must also meet the Article 50(5) qualities (clear, distinguishable, given no later than first exposure, and accessible).
7. **Status:** likely relevant
8. **Missing facts:** Confirmation that the system meets the Article 3 "emotion recognition system" definition; the full wording and timing of the student-facing notice; whether any exception is claimed.
9. **Next action:** Retrieve the exact student notice text and the point in the flow where it appears, and confirm from vendor documentation whether the system is an emotion recognition system, so the disclosure can be assessed against Article 50(3) and 50(5).
10. **Human decision required:** A responsible person at the university must decide whether and how to inform exposed students of the system's operation; the agent does not make that decision.

---

### EUAI-003 — Automated flagging that routes students to misconduct interviews may engage the high-risk education provisions

1. **Review surface:** Journey stage 4 — scores below a threshold flag the recording for staff review, and flagged students are invited to a misconduct interview.
2. **Observed evidence:** An AI-derived "integrity confidence score" drives a threshold flag that determines which students are subjected to a misconduct process. There is a human staff-review step before the interview invitation.
3. **Possible AI Act trigger:** The Annex III high-risk category covering AI systems used in education and vocational training, including monitoring and detecting prohibited behaviour during tests, with the corresponding provider and deployer obligations in Chapter III. This is named as a possible trigger for human review only; no classification is made here.
4. **Role and conditions:** The vendor is the likely provider and the university the likely deployer, each with distinct Chapter III duties if the system is high-risk. Material conditions to confirm: the system's intended purpose; whether it falls within the Annex III education wording; and whether any Article 6 filter applies. The presence of staff review does not by itself remove a classification.
5. **Official source level and exact link:** Law — [Annex III, Article 6 and Chapter III, Regulation (EU) 2024/1689 (CELEX 32024R1689)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689), as amended by [Regulation (EU) 2026/1744 (CELEX 32026R1744)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744). Exact amended text and the Annex III scope could not be verified live.
6. **Applicable date:** For systems classified through Article 6(2) and Annex III, the relevant Chapter III sections apply from 2 December 2027 (subject to the transition rules in Article 111 for systems and models already on the market). The exact date depends on classification facts and placement dates not supplied.
7. **Status:** insufficient evidence
8. **Missing facts:** The documented intended purpose; whether the system meets the Annex III education wording and the Article 6 conditions; the placing-on-the-market and first-use dates; the Article 111 transition facts for the deployed version.
9. **Next action:** Collect the vendor's intended-purpose statement, classification analysis, and placement dates, and read the current Annex III and Article 6 text, so a lawyer can determine whether high-risk provisions are engaged and from what date.
10. **Human decision required:** A qualified legal reviewer must decide whether this system is high-risk under Annex III and what obligations follow; this is not determined here.

---

### EUAI-004 — Provider content-transparency duties (Article 50(1) and 50(2)) tested and not triggered on this evidence

1. **Review surface:** The system as described across stages 2–4 — it records and analyses video and outputs a score; it does not present itself as a conversational agent and does not generate synthetic audio, image, video, or text for people.
2. **Observed evidence:** The supplied journey shows an analysis-and-scoring system, not a system that interacts with students as an apparent human interlocutor and not one that produces synthetic media output.
3. **Possible AI Act trigger:** Article 50(1) direct-interaction disclosure and Article 50(2) machine-readable marking of synthetic output.
4. **Role and conditions:** These are provider duties. Article 50(1) requires an AI system intended to interact directly with natural persons; Article 50(2) requires generation of synthetic audio, image, video, or text. Neither condition is shown by the evidence.
5. **Official source level and exact link:** Law — [Article 50(1) and 50(2), Regulation (EU) 2024/1689 (CELEX 32024R1689)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** Article 50 applies from 2 August 2026.
7. **Status:** no trigger found in the supplied evidence
8. **Missing facts:** Whether any part of the app presents a conversational or human-seeming interface, or generates any synthetic content, that was not described in the supplied journey.
9. **Next action:** If the app includes a chatbot, voice agent, or any generated media, supply that surface for a separate Article 50(1)/50(2) check.
10. **Human decision required:** None arising from this finding unless additional generating or interacting surfaces exist.

---

## Closing section

**1. Human decisions now required**
- Whether Article 5's education-context emotion-inference restriction applies to this deployment, and what the vendor and university must do (EUAI-001).
- Whether and how the university must inform exposed students of the system's operation under Article 50(3)/50(5) (EUAI-002).
- Whether the system is high-risk under Annex III and what provider and deployer obligations and dates follow (EUAI-003).

**2. Evidence still needed**
- The vendor's documented intended purpose and technical documentation, including whether "states" are inferred from biometric data as defined in Article 3.
- The exact student-facing notice wording and where it appears in the flow.
- The placing-on-the-market and first-use dates of the deployed model version, and the Article 111 transition facts.
- The current amended text of Articles 3, 5, 6, 50, 99, 111, 113 and Annex III from EUR-Lex (live verification was unavailable for this review).

**3. Separate legal signposts (named, not assessed)**
- Continuous webcam recording and inference of affective/biometric states raises EU data-protection and possible special-category-data questions; separate review may be needed under the GDPR. Not assessed here.
- Student rights, examination fairness, and misconduct-process safeguards may engage national education and administrative law, and possible non-discrimination and accessibility law. Not assessed here.

**4. Limitations**
This is educational EU AI Act issue-spotting based on a written description and vendor marketing claims, using a pinned source register that could not be verified against live official sources. It is not legal advice, not a risk classification, and not proof of compliance or non-compliance. No statutory penalty ceilings are cited because no underlying duty has been confirmed; any such figures would be maximum statutory ceilings only, with actual enforcement depending on the applicable law, authority, organisation, and facts.
