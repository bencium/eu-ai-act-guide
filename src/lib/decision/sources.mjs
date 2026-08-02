export const OFFICIAL = Object.freeze({
  scope: citation("reg-2024-1689-art-2", "Article 2", "art_2"),
  roles: citation("reg-2024-1689-art-3", "Article 3", "art_3"),
  prohibited: citation("reg-2024-1689-art-5", "Article 5", "art_5"),
  highRisk: citation("reg-2024-1689-art-6-annexes", "Article 6 and Annexes I and III", "art_6"),
  deployers: citation("reg-2024-1689-art-26", "Article 26", "art_26"),
  transparency: citation("reg-2024-1689-art-50", "Article 50(1)–(6)", "art_50"),
  directInteraction: citation("reg-2024-1689-art-50-1", "Article 50(1)", "art_50"),
  providerMarking: citation("reg-2024-1689-art-50-2", "Article 50(2)", "art_50"),
  emotionBiometricNotice: citation("reg-2024-1689-art-50-3", "Article 50(3)", "art_50"),
  deepfakeDisclosure: citation("reg-2024-1689-art-50-4-deepfake", "Article 50(4), first subparagraph", "art_50"),
  publicInterestText: citation("reg-2024-1689-art-50-4-text", "Article 50(4), second subparagraph", "art_50"),
  disclosurePresentation: citation("reg-2024-1689-art-50-5", "Article 50(5)", "art_50"),
  explanation: citation("reg-2024-1689-art-86", "Article 86", "art_86"),
  penalties: citation("reg-2024-1689-art-99", "Article 99(3)–(7)", "art_99"),
  gpaiPenalties: citation("reg-2024-1689-art-101", "Article 101", "art_101"),
  application: citation("reg-2024-1689-art-113", "Article 113", "art_113"),
  amendment: Object.freeze({
    sourceId: "reg-2026-1744",
    authority: "law",
    reference: "Regulation (EU) 2026/1744",
    url: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng",
  }),
  guidelines: Object.freeze({
    sourceId: "commission-article-50-guidelines",
    authority: "official_guidance",
    reference: "Article 50 Guidelines",
    url: "https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems",
  }),
  voluntaryCode: Object.freeze({
    sourceId: "commission-ai-content-code",
    authority: "voluntary_code",
    reference: "Voluntary Code of Practice for AI-generated content",
    url: "https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content",
  }),
  icons: Object.freeze({
    sourceId: "commission-eu-content-icons",
    authority: "official_guidance",
    reference: "Optional EU icons for labelling AI-generated content",
    url: "https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content",
  }),
});

function citation(sourceId, reference, fragment) {
  return Object.freeze({
    sourceId,
    authority: "law",
    reference,
    url: `https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng#${fragment}`,
  });
}

export const DATES = Object.freeze({
  article5Existing: "2025-02-02",
  article50: "2026-08-02",
  amendedArticle5: "2026-12-02",
  providerMarkingTransition: "2026-12-02",
  annexIII: "2027-12-02",
  annexI: "2028-08-02",
});
