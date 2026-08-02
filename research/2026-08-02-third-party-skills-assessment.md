# Dated assessment of two third-party EU AI Act skills

Assessment date: **2 August 2026**

This note records what was present at two pinned commits. It is not a permanent judgement about either repository, and later revisions may fix the issues described here. Neither repository is a legal authority or a dependency of The EU AI Act Guide.

The project team inspected these repositories because they were named during product research. The final reviewer skill was independently authored. No code, wording, templates, legal tables, scoring model, installation command, or review workflow from either repository was intentionally copied or adapted.

## alirezarezvani/claude-skills

Snapshot: [`aa8d778811a557a2c28ccadda4cf3d0bd028a4cc`](https://github.com/alirezarezvani/claude-skills/commit/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc), committed on 17 July 2026. This predates the publication of [Regulation (EU) 2026/1744](https://data.europa.eu/eli/reg/2026/1744/oj) on 24 July 2026.

Useful qualities observed at that date include a clear attempt to cite articles, separate organisational roles, and warn that the skill is not a substitute for legal advice. The repository is released under the [MIT licence](https://github.com/alirezarezvani/claude-skills/blob/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc/LICENSE).

Reasons it was not used as a legal or implementation source:

- Its Article 50 reference says the transparency duties applied from 2 August 2025. The relevant page and table are visible in [`eu_ai_act_titles.md`](https://github.com/alirezarezvani/claude-skills/blob/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc/ra-qm-team/skills/eu-ai-act-specialist/references/eu_ai_act_titles.md#L88-L98). The current guide uses 2 August 2026 and the narrow amended transition for certain existing synthetic-content systems.
- Its obligation tracker assigns chatbot and deepfake duties to its 2025 phase; see [`ai_act_obligation_tracker.py`](https://github.com/alirezarezvani/claude-skills/blob/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc/ra-qm-team/skills/eu-ai-act-specialist/scripts/ai_act_obligation_tracker.py#L55-L101). That date mapping is stale after the 2026 amendment.
- Its deterministic classifier always returns a named risk tier and defaults to “minimal risk” with “no obligations under the Act” when its listed flags do not fire; see [`ai_system_risk_classifier.py`](https://github.com/alirezarezvani/claude-skills/blob/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc/ra-qm-team/skills/eu-ai-act-specialist/scripts/ai_system_risk_classifier.py#L160-L245). A short input cannot establish every relevant fact, so this project uses cautious issue-spotting statuses and an explicit unknown-evidence state.
- Its Codex installer deletes an existing skill folder before replacing it; see [`scripts/codex-install.sh`](https://github.com/alirezarezvani/claude-skills/blob/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc/scripts/codex-install.sh#L150-L165). Its troubleshooting instructions also include deleting the entire personal Claude skills directory; see [`INSTALLATION.md`](https://github.com/alirezarezvani/claude-skills/blob/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc/INSTALLATION.md#L612-L621). Those conventions create avoidable overwrite and data-loss risk, so this project supplies a plain ZIP and never overwrites an existing installation automatically.
- Its Codex material uses `.codex/skills`; the portable location used by this project is `.agents/skills`, based on the current Codex skill documentation checked for this release.

## borghei/Claude-Skills

Snapshot: [`da5a8626632f08c5513b0f73add1bf8075ef83bd`](https://github.com/borghei/Claude-Skills/commit/da5a8626632f08c5513b0f73add1bf8075ef83bd), committed on 21 July 2026. This also predates the publication of Regulation (EU) 2026/1744.

Useful qualities observed at that date include asking for missing purpose and role information, a broad compliance checklist, and article references. The repository's [licence](https://github.com/borghei/Claude-Skills/blob/da5a8626632f08c5513b0f73add1bf8075ef83bd/LICENSE) combines MIT terms with the Commons Clause and restricts selling software or services whose value substantially derives from it. That restriction independently supports the decision to copy nothing from the repository.

Reasons it was not used as a legal or implementation source:

- Its timeline describes 2 August 2026 as “full application,” puts all remaining high-risk duties on that date, and gives 2 August 2027 as the extended product date; see [`SKILL.md`](https://github.com/borghei/Claude-Skills/blob/da5a8626632f08c5513b0f73add1bf8075ef83bd/ra-qm-team/eu-ai-act-specialist/SKILL.md#L256-L264). Regulation (EU) 2026/1744 created later 2026, 2027, and 2028 application points that the guide must keep separate.
- Its classifier treats every generated image, video, or audio as a deepfake disclosure case and combines visible disclosure with machine-readable labelling in one result; see [`ai_risk_classifier.py`](https://github.com/borghei/Claude-Skills/blob/da5a8626632f08c5513b0f73add1bf8075ef83bd/ra-qm-team/eu-ai-act-specialist/scripts/ai_risk_classifier.py#L627-L639). Article 50 separates provider machine-readable marking from professional deployer disclosure, and the deepfake test depends on whether content falsely appears authentic.
- Its compliance checker converts checklist completion into a weighted percentage and labels a score of 90 or more “READY,” stating that the system meets compliance requirements; see [`ai_compliance_checker.py`](https://github.com/borghei/Claude-Skills/blob/da5a8626632f08c5513b0f73add1bf8075ef83bd/ra-qm-team/eu-ai-act-specialist/scripts/ai_compliance_checker.py#L884-L910). That can imply legal certainty that the supplied evidence cannot support.
- Its published Codex installation material uses `.codex/skills` and includes folder replacement operations; see [`scripts/codex-install.sh`](https://github.com/borghei/Claude-Skills/blob/da5a8626632f08c5513b0f73add1bf8075ef83bd/scripts/codex-install.sh#L143-L159). This project uses the current portable `.agents/skills` path and leaves replacement decisions to the user.

## Decision for this project

The two repositories were assessed only as dated third-party examples. The reviewer skill in this repository uses the official source register, exact evidence gaps, separate source-authority labels, cautious statuses, amended dates, and non-destructive manual installation. Any future assessment must return to the pinned files above or inspect a newly identified commit rather than treating this note as a claim about the repositories' current state.
