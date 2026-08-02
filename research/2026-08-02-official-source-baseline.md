# Official EU AI Act source baseline — 2 August 2026

This note records what was accepted into the source archive and what remains unavailable. The canonical machine-readable record is [`sources/source-register.json`](../sources/source-register.json); the website copy must remain byte-for-byte identical at [`public/source-register.json`](../public/source-register.json).

## Accepted local archive

All retrievals below completed on 2 August 2026. The PDF and XHTML were accepted only after checking the official URL, file type, byte count, SHA-256 digest, and the legal-body anchors in the XHTML.

| Artifact | Official source | Retrieval UTC | Bytes | SHA-256 | Verification |
|---|---|---:|---:|---|---|
| Authentic English Official Journal PDF | <https://data.europa.eu/eli/reg/2024/1689/oj/eng/pdf> | 2026-08-02T17:45:43Z | 2,583,319 | `bba630444b3278e881066774002a1d7824308934f49ccfa203e65be43692f55e` | PDF 1.7 signature; 144-page file reported by the local file inspector |
| Official English XHTML legal body | <https://data.europa.eu/eli/reg/2024/1689/oj/eng/html> | 2026-08-02T17:45:43Z | 1,264,549 | `cbb19c4e24ae666ba2dcf34b28191e3f5f56e21c2dc511ca1e3b442c1d2a0912` | 180 unique recital anchors, 113 unique article anchors and 13 unique annex anchors |
| Archived copy of the pre-existing CELLAR branch notice | `https://publications.europa.eu/resource/cellar/dc8116a1-3fe6-11ef-865a-01aa75ed71a1?language=eng` | Original retrieval time unavailable; copied at 2026-08-02T17:45:43Z and re-downloaded at 2026-08-02T19:20:52Z | 1,446,323 | `0b5463b04dbf9f4cbb487e5e6ab74a7d1aa352da85e880775c7fdee4a4974a79` | Well-formed CELLAR branch metadata; the fresh official download was byte-for-byte equal to the untouched root file |

The official HTML endpoint describes its response as XHTML and includes an XML declaration and XHTML namespace. The delivered markup is not strict XML-well-formed, so acceptance uses the official document anchors rather than pretending that an XML parser accepts it.

The existing root file `cellar_dc8116a1-3fe6-11ef-865a-01aa75ed71a1.xml` was not modified. Its SHA-256 before and after this work is `0b5463b04dbf9f4cbb487e5e6ab74a7d1aa352da85e880775c7fdee4a4974a79`.

## Binding corrections and amendment

The CELLAR notice identifies four language-specific corrigenda. They are separate binding source records; a correction in one language must not silently change every language.

| Stable source ID | Official record | CELEX / OJ | Affected language versions |
|---|---|---|---|
| `corrigendum-2025-10-09` | <https://data.europa.eu/eli/reg/2024/1689/corrigendum/2025-10-09/oj> | `32024R1689R(01)` / `L_202590802` | ES, DE, FR, GA, LT, HU, SK, SL, SV |
| `corrigendum-2025-12-19` | <https://data.europa.eu/eli/reg/2024/1689/corrigendum/2025-12-19/oj> | `32024R1689R(02)` / `L_202591038` | NL, SL |
| `corrigendum-2026-03-27` | <https://data.europa.eu/eli/reg/2024/1689/corrigendum/2026-03-27/oj> | `32024R1689R(03)` / `L_202690258` | CS |
| `corrigendum-2026-05-04` | <https://data.europa.eu/eli/reg/2024/1689/corrigendum/2026-05-04/oj> | `32024R1689R(04)` / `L_202690343` | ES, NL |

The current binding amendment is [`amendment-2026-1744`](https://data.europa.eu/eli/reg/2026/1744/oj), Regulation (EU) 2026/1744. It was published on 24 July 2026 and entered into force on 27 July 2026. The date changes needed by the guide are stored as structured data in the register, including 2 December 2026, 2 December 2027 and 2 August 2028. The original 2024 act and the 2026 amendment remain separate sources so that the guide never presents a home-made consolidation as official law.

## Final Article 50 material

The register distinguishes each source by legal weight:

- [`final-guidelines-article-50`](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems) is European Commission guidance, published 20 July 2026 and updated 31 July 2026. It is official guidance, not the binding Regulation.
- [`voluntary-code-article-50`](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content) is the final voluntary Code of Practice. The Article 50 duties remain legal obligations even when an operator does not sign the code.
- [`optional-icons`](https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content) is the Commission's optional icon set. The official page says the icons are free to use without attribution, but their use alone does not establish compliance or signal that a non-signatory has joined the code.

## Monitoring and unavailable material

The weekly workflow queries only the HTTPS hosts hard-allowlisted in the two source scripts. It checks the archived English PDF, the English legal body and its 180/113/13 structure, the current EUR-Lex work record, all four corrigenda, Regulation 2026/1744, and the three final Article 50 pages. A changed or unavailable source fails the workflow and leaves a report for a human. It never edits the register, translations, website copy, skill instructions or legal explanations.

Two provenance limitations remain explicit:

1. The exact transport URL and original retrieval time of the pre-existing root CELLAR XML are unavailable. Its CELLAR identifier, byte size, digest and byte-equal archived copy are recorded instead.
2. No official consolidated text incorporating Regulation 2026/1744 was available in the checked EUR-Lex record at this baseline. The project must continue to cite the original act and amendment separately until the Publications Office supplies an official consolidation, and any future consolidated text must still be labelled as non-binding if EUR-Lex gives it that status.
