# EU AI Act review — instant loan decision (Irish consumer lender)

*Read-only issue-spotting review, delivered as text. No files were changed, no code run, no external search performed. This is not legal advice and not a compliance verdict.*

## Review header

- **Review scope:** The supplied six-step user journey for an instant €4,000 personal-loan decision in an Irish consumer lender's mobile app (application → open-banking consent → in-house ML creditworthiness scoring → instant approve/decline or human queue → reapply-after-90-days with no explanation). No source code, screenshots, configuration, tests, or deployed system were supplied.
- **Evidence level:** The strongest evidence available is a `Supplied statement` — a written description of the journey. There is no `Source code`, `Tested behaviour`, `Deployed behaviour`, or `User-visible behaviour` to inspect. Nothing here is promoted above what the description proves.
- **Legal currency:** Live legal-source verification was unavailable. This review uses the pinned source register dated 2 August 2026 and does not claim to state current law. Note in particular that Regulation (EU) 2026/1744 materially amended the high-risk provisions, definitions, and transitional rules of the base Act; its current wording could not be verified offline, so every high-risk-dependent point below is provisional and needs a live check before anyone relies on it.
- **Known limits:** No documented intended purpose, no placement-on-market/put-into-service record beyond "March 2027," no actual app screens or wording, no detail on what "device metadata" contains, no confirmation of the lender's legal role(s), and no access to the current consolidated text.

---

## Findings

### EUAI-001 — Automated creditworthiness scoring of an individual

1. **Review surface:** Journey step 3 (in-house ML model scores creditworthiness from transaction history, declared income, and device metadata; put into service March 2027) and step 4 (score drives instant approve / instant decline / human queue).
2. **Observed evidence:** A machine-learning model produces a creditworthiness score for an individual loan applicant in Dublin, and that score automatically approves, declines, or routes the application.
3. **Possible AI Act trigger:** Evaluating the creditworthiness of a natural person, or establishing a credit score, is listed in Annex III (point 5(b)) as a use that can classify an AI system as high-risk — with an exception for systems used to detect financial fraud. If that classification is engaged, the Chapter III high-risk duties (risk management, data governance, human oversight, transparency, record-keeping, registration) would come into play. Whether the system is high-risk is a legal decision for a responsible person, not a conclusion of this review.
4. **Role and conditions:** The lender appears to be both **provider** (built the model in-house) and **deployer** (runs it on its own customers); each role carries different duties and the roles must be confirmed. Material conditions: the documented intended purpose is genuinely creditworthiness/credit scoring; the financial-fraud-detection exception does not apply; no Article 6 filtering removes the classification; and there is an EU nexus (Dublin — present).
5. **Official source level and exact link:** Law — Regulation (EU) 2024/1689, Annex III(5)(b) read with Article 6 — [EUR-Lex, CELEX 32024R1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689). Also Law — the amending Regulation (EU) 2026/1744 — [CELEX 32026R1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744), whose current effect on the high-risk provisions could not be verified offline.
6. **Applicable date:** On the pinned register, Chapter III Sections 1–3 (except Article 6(5)) apply to Annex III-classified systems from **2 December 2027**. The model was put into service in **March 2027**, before that date, so the Article 111 transitional rules for systems already in service must be checked. Date-sensitive and dependent on the exact placement/first-use facts.
7. **Status:** possibly relevant.
8. **Missing facts:** the written intended-purpose/design documentation; whether the fraud-detection exception is claimed; the exact put-into-service record and any substantial modification after March 2027; the lender's legal role(s); whether any Article 6 filtering applies; the current amended Annex III / Article 6 / Article 111 text under 2026/1744.
9. **Next action:** obtain the model's intended-purpose documentation and the placement/first-use record, then commission a human legal classification review against the current consolidated Annex III and Articles 6 and 111.
10. **Human decision required:** a responsible legal owner must decide whether this system is high-risk under Annex III and which Article 111 transition applies.

### EUAI-002 — Declined applicants get no explanation and no human-review route

1. **Review surface:** Journey step 4 (instant decline: "We can't offer you a loan at this time") and step 6 (no explanation of the decision, no route to request human review, reapply after 90 days).
2. **Observed evidence:** An applicant scored below the decline threshold is refused automatically with a generic message; the supplied journey shows no explanation and no route to request a human review.
3. **Possible AI Act trigger:** If the system is classified high-risk (see EUAI-001), the Act's provisions on an affected person's right to an explanation of individual decision-making and on human oversight of high-risk systems may apply. Both depend entirely on the unresolved high-risk classification.
4. **Role and conditions:** Deployer (and provider) duties. Conditions: the system is high-risk; the decision has legal or similarly significant effects on the person; and, for the explanation duty, the affected person requests it. All unconfirmed.
5. **Official source level and exact link:** Law — Regulation (EU) 2024/1689, provisions on explanation of individual decision-making and on human oversight for high-risk AI — [CELEX 32024R1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689). Exact article numbers and current wording could not be verified offline and were amended by [CELEX 32026R1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744).
6. **Applicable date:** Contingent on high-risk classification; the same 2 December 2027 pathway and Article 111 transitional questions as EUAI-001.
7. **Status:** insufficient evidence (blocked by the unresolved high-risk classification in EUAI-001).
8. **Missing facts:** the classification outcome; the exact current articles governing explanation and human oversight; whether any explanation or appeal exists outside the app that the journey did not capture.
9. **Next action:** after the classification decision in EUAI-001, verify the current explanation and human-oversight articles against the consolidated text and map the decline flow against them.
10. **Human decision required:** a legal owner must decide whether an explanation and a human-review route are legally required here and how to provide them. (A solely automated refusal with significant effect also raises data-protection questions — see signposts.)

### EUAI-003 — No disclosure that an AI system is assessing the applicant

1. **Review surface:** Journey step 2 ("Analysing your finances…") and step 3 (background ML scoring).
2. **Observed evidence:** While the model scores the applicant, the app shows "Analysing your finances…"; the supplied journey contains no statement that an AI system is assessing the application.
3. **Possible AI Act trigger:** Article 50(1) requires a provider to design a system that is *intended to interact directly with natural persons* so that people are informed they are interacting with an AI system, unless that is obvious in the context. Whether a background scoring model that only shows status messages "interacts directly" with the person is genuinely uncertain and must be tested against the actual first interaction — this is not a deepfake or synthetic-content point.
4. **Role and conditions:** Provider duty (the lender built the system). Conditions: the system is "intended to interact directly with natural persons," and the AI involvement is not already obvious to a reasonably well-informed, observant, and circumspect person in the circumstances. A purely background credit model may fall outside Article 50(1); the evidence does not settle it.
5. **Official source level and exact link:** Law — Regulation (EU) 2024/1689, Article 50(1) — [CELEX 32024R1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689). Official guidance — [Commission guidelines on transparency obligations](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems) (explains the Commission's view; does not replace the Article).
6. **Applicable date:** Article 50 applies from **2 August 2026** on the pinned register. If triggered, the duty is in application as of this review date (13 August 2026), subject to the offline-currency caveat.
7. **Status:** possibly relevant.
8. **Missing facts:** the exact first-interaction screens and wording; whether the app states anywhere that an AI/automated system assesses the applicant; whether "interacts directly" is met by a background model.
9. **Next action:** capture the actual onboarding and decision screens and assess them against Article 50(1)'s "interacts directly" and "obvious in context" tests.
10. **Human decision required:** a legal owner must decide whether Article 50(1) applies to a background scoring model and, if so, how to disclose.

### EUAI-004 — No synthetic-content, deepfake, or emotion/biometric trigger observed

1. **Review surface:** The whole supplied journey (steps 1–6).
2. **Observed evidence:** The system scores supplied data and renders status and decision text. Nothing in the evidence shows generation or manipulation of synthetic image, audio, video, or public-interest text, or emotion recognition / biometric categorisation. "Device metadata" is described as a scoring input, not, on its face, biometric processing.
3. **Possible AI Act trigger:** Article 50(2) machine-readable marking of synthetic output; Article 50(3) emotion recognition / biometric categorisation disclosure; Article 50(4) deepfake or public-interest-text disclosure.
4. **Role and conditions:** Not engaged on the current evidence — no generative or biometric behaviour is shown.
5. **Official source level and exact link:** Law — Regulation (EU) 2024/1689, Article 50(2)–(4) — [CELEX 32024R1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689).
6. **Applicable date:** Article 50 applies from 2 August 2026 (pinned register).
7. **Status:** no trigger found in the supplied evidence.
8. **Missing facts:** whether "device metadata" includes any biometric processing; whether any generated content exists elsewhere in the product.
9. **Next action:** confirm the exact contents of "device metadata" to rule out biometric categorisation.
10. **Human decision required:** none beyond confirming the device-metadata contents.

---

## Closing section

**1. Human decisions now required (deduplicated):**
- Decide whether the creditworthiness model is high-risk under Annex III(5)(b), and which Article 111 transition applies given the March 2027 in-service date (EUAI-001).
- Decide, if it is high-risk, whether an explanation of the decision and a human-review route are legally required and how to provide them (EUAI-002).
- Decide whether Article 50(1) applies to the background scoring model and how to disclose AI involvement if so (EUAI-003).

**2. Evidence still needed (shortest list that would change findings):**
- The model's documented intended purpose and any fraud-detection exception claim.
- The exact placement-on-market / put-into-service record and any substantial modification after March 2027.
- The actual app onboarding and decision screens and their wording.
- The exact contents of "device metadata."
- The current consolidated text of the high-risk provisions, Article 50, and Article 111 as amended by Regulation (EU) 2026/1744.

**3. Separate legal signposts (named, not assessed here):**
- Data-protection law — an instant, solely automated loan refusal with significant effect on the person, and the processing of 12 months of open-banking transaction data, raise EU GDPR questions (including automated-decision-making and lawful-basis issues). Not assessed.
- EU and Irish consumer-credit and creditworthiness-assessment law. Not assessed.
- National implementing and supervisory measures. Not assessed.

**4. Limitations:** This is educational issue-spotting on the EU AI Act only. It is not legal advice, not a risk classification, and not proof of compliance or non-compliance. It was produced offline against a source register pinned to 2 August 2026 and does not state current law; the high-risk points in particular must be re-checked against the live consolidated text before anyone relies on them.
