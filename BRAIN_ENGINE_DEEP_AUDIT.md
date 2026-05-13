# Brain Engine — Deep Audit (additive to BRAIN_ENGINE_UX_ANALYSIS.md)

**Source repo:** `https://book-ly@dev.azure.com/book-ly/bookly/_git/brainengine` (branch `dev`, tip `3697e5a`)
**Date:** 2026-05-14
**Method:** read every commit body on `dev` (804 commits, 22,778 lines of `git log %h %ad %s + %b`), every subpackage `__init__.py` (~90 of them) plus all key entry-point files; cross-checked `tests/`, `infra/postgres-init/`, `deploy/*.yaml`, `patents/`, `internet-drafts/`.

This document is **additive only**. It deliberately does not restate anything already in `BRAIN_ENGINE_UX_ANALYSIS.md` (priority chain, FL-01…FL-16, TrustMeter, AbstentionGate basics, DecisionCase, the obvious six-card taxonomy, etc.). It catalogues what that pass missed or under-described.

## Table of contents

1. Commit Archeology — all 804 commits grouped by theme (50+ themes), with citation hashes.
2. Subsystem Catalog — every `brain_engine/*` subpackage with maturity + UX implication.
3. Capability Map ADDITIONS — capabilities not surfaced in the first pass.
4. Mental Model Anchors I missed.
5. Feature-flag inventory — every `BRAIN_*` env var, ordered by importance.
6. Engine surfaces relevant to UI that I missed (≥10).
7. UX implications digest — top 15 changes ranked impact-to-effort.
8. Contradictions / risks / TBDs.

---

## 1. Commit Archeology

This section walks every theme that appears in the 804-commit `dev` history. For each theme I cite the canonical hash and 1-line summary; multi-hash themes pin the entry, middle, and exit commits.

### 1.1 Sprint 6 W1-W10 Foundation Layer wiring (Sprint 6 = the May 13 sprint that consumed the FL-01..FL-16 contracts shipped in Sprint 1-5)

The first pass mentioned Sprint 6 in general. The actual sequence is more granular than that — ten labelled steps, each one a separate PR, each one wiring exactly one FL contract into exactly one consumer:

- **W5** `48c8c99` — PatternOrigin wired into miner + extractor (FL-12 producer reaches PatternRule on every mining pass).
- **W6** `8cf3a6a` — §5 SignalWeights into PatternMiner ConfidenceContext (FL-06: PM approvals and PM edits now boost confidence; previously only counterexamples + staleness penalised it). Conservative initial subset — `PM_APPROVED` → `pm_approval_count`, `PM_MODIFIED` → `pm_repeated_edit_count`. The other five §5 signals (`pm_explicit_rule`, `guest_complaint`, `task_reopen`, `vendor_sla_breach`, `review_mention`) ship later when FL-16's orchestrator starts populating them upstream.
- **W7** `87a235b` — SourceReliability + workflow_freeze into ContradictionDetector (FL-07 demotes guest claims that contradict PMS structured fields; emits `workflow_freeze=True` when contradiction confidence < 0.60).
- **W8** `f51d511` — `detect_foundation_drift` into NightlyConsolidator step 9 (FL-13 backlog of foundation update candidates emitted on every nightly run).
- **W9** `395627f` — `rule_creation/workflow.py` finalisation → FL-14 customer foundation (every rule the PM finalises in the UI becomes a `FoundationCustomerScenario` for the orchestrator's matcher).
- **W10** `242c8b6` — FL-15 clarifying questions into discovery phase (LLM rule-creation now consults the foundation top-3 and asks PM about Required Data Checks they have not mentioned).
- **W4** `be1b9d2` — FL-05 learn gate into PatternMiner (`Should AI Learn Pattern: No` scenarios — gas smell, broken glass, medical, safety/security, CO alarm, post-stay injury — never form rules).
- **W2** `3697e5a` — MemoryFanOut consumes FL-04 routes (decides Episodic / Semantic / KG fan-out per scenario; 13 memory tier slugs map to canonical destinations).

UX implication: every Sprint 6 commit ends with a *flag default off* + *wiring helper* pattern. This means the foundation is wired but not yet on in production unless `BRAIN_FOUNDATION_LEARN_GATE_ENABLED` etc. are flipped. The UI must distinguish "engine has this wired but flag-gated" vs "engine actively uses this" — otherwise a panel showing "Cendra learned 4 patterns" can quietly stop being honest if the operator never flips the flag.

### 1.2 Sprint 1-5 Foundation Layer data layer (May 13 morning — what Sprint 6 then wired)

- **FL-01** `a8bf3fc` `b45be38` — 469-scenario catalog + 14-field schema parser + Postgres store (`foundation_scenarios_reactive`, migration 026). 473 scenarios parsed, 15 Critical, 6 safety-only. Pinned by `test_live_foundation_safety_six_scenarios_disable_learning`.
- **FL-03** `c31fa5c` — `foundation_scenario_id` TEXT bridge on `DecisionCase` + `PatternRule`. Singular dominant match; complementary to FL-12's plural origin trail. No FK constraint — slug churn surfaces softly via `foundation_catalog_store.get` returning `None`.
- **FL-04** `aabfdd2` — `MemoryTier` StrEnum with 13 slugs, `_route_to_memory` translation (replaced the FL-16 stub). Memory routing decision is foundation-driven, not LLM-decided.
- **FL-05** `8bde9de` — Safety gating. `_apply_guardrails` reads `should_auto_reply`; `_mine_if_learnable` reads `should_learn_pattern`. Safety beats learning when flags conflict — a scenario that allows learning but forbids auto-reply produces no rule.
- **FL-06** `5239199` — §5 signal-weight ontology. `SignalWeights` dataclass with verbatim §5 weights (PM explicit rule +0.30, repeated edit +0.15, approval +0.10, guest complaint +0.07, task reopen +0.10, vendor SLA breach +0.10, review mention +0.20, contradiction unresolved → cap @ 0.70). Live-doc test pins the values so MD drift surfaces immediately.
- **FL-07** `344741b` — Source reliability nine-tier ladder + 0.60 workflow_freeze threshold. The hierarchy: PM hard rule > Confirmed SOP > PMS structured field > smart-lock/payment/vendor event > OTA listing > recent PM message correction > guest claim > old free-text note > AI inference.
- **FL-12** `0170a00` `3a31bba` — `PatternOrigin` (foundation_scenario_ids, source_event_ids, contributing_signal_ids) + migration 028 + `GET /api/v1/patterns/rules/{rule_id}/origin` endpoint. Empty origin renders as `{}` so no backfill needed.
- **FL-13** `e54cfef` — Foundation update feedback loop + drift detector. **Hard rule preserved: foundation markdown is never auto-rewritten.** Candidates land in `foundation_update_candidates` (migration 029) for human review. Severity ladder: 3 → LOW, 5+ → MEDIUM, 10+ → HIGH.
- **FL-14** `8330491` — Customer-facing foundation tier. Two-tier model — core (469 curated) + customer (PM-authored, `customer_id`-scoped, never leaks across customers). Migration 030. Conservative defaults — `risk_level=Medium`, `should_learn_pattern=No`.
- **FL-15** `c028e47` — Iterative clarifying questions. Tokenises PM text; treats a Required Data Check as covered when ≥50% of its meaningful tokens already appear. Defaults: top-3 scenarios × 5 questions per scenario.
- **FL-16** `48c1caf` `566cf0d` — `FoundationAnalysisOrchestrator` pipeline contract (classify → match → guardrail → mine → route → log_origin). Single async entry point. Never raises — every failure logs WARNING + falls back to well-formed empty result.

UX implication: the Foundation Layer is a **two-layer model** the first pass did not name — the **core 469** scenarios (hidden, internal) and the **customer additions** (visible to that PM only). Property Brain coverage should show both layers, not collapse them; a PM who adds 3 customer rules should see "469 + 3 your additions" not "472."

### 1.3 Moats M1-M25 patent stack

Beyond the patent claims summarised in the first pass, here is the full sequence with hashes:

- **M1** Bi-temporal Wilson + Conformal Abstention — `7ecae0e` (initial), `1f6b3f6` (split-conformal calibrator M24), `03ad1e2` (MAPIE-backed audit variant), `6797ac5` (Sprint 1 bi-temporal soft-invalidate for PatternRule).
- **M2** Owner-policy DSL — `3a56206` (parser + compiler), `97f324f` (Z3 SMT verifier M22), `e318ca7` (M2 numeric range constraints — `min_nights >= 31`, `nightly_rate >= 230`, `max_guests <= 4`).
- **M3** Five-tier autonomy ladder + HMAC certs — `f441191`. Tiers OBSERVER (1) < APPROVER (2) < CONSULTANT (3) < COLLABORATOR (4) < OPERATOR (5). HMAC-SHA256 binding, default 1h TTL.
- **M4** GR00T P1 Kinematic Planner — `16a602c`. Six base styles: cooperative, defensive, compliance_strict, vip_white_glove, budget_no_compromise, aggressive_revenue. `3d33974` adds six situational styles: SEASONAL_HIGH, SEASONAL_LOW, POST_INCIDENT_RECOVERY, REGULATORY_AUDIT_WINDOW, FAMILY_FRIENDLY_STRICT, PET_FRIENDLY. Total: 12 styles. Stake: NVIDIA GR00T two-layer architecture transferred from physical robotics to cognitive autonomy.
- **M5** EU compliance stack — `eeedc15`. Four pieces: `never_ai_denylist.py` (SCREEN_BY_PROTECTED_CLASS, GDPR_ART22_AUTONOMOUS_DENY, LEGAL_RESPONSE_NO_HUMAN, MEDICAL_ADVICE), `art12_decision.py` (chained BLAKE2B-256 digests, deterministic JSON), `art50_disclosure.py` (5 locales en/es/de/fr/pt with fallback to en), `reg_2024_1028.py` (per-unit registration_id + monthly export bundle with BLAKE2B signature).
- **M6** Multi-stakeholder Pareto/Nash-bargaining — `677cc2c`. Five stakeholder roles (guest/owner/cleaner/neighbor/regulator). Three bargaining solutions (Nash/egalitarian/utilitarian). Hard-veto → Pareto frontier → bargaining-solution argmax pipeline.
- **M7** Observation/belief schema + Wilson-bounded promotion — `4e08cfe`. Cryptographic BLAKE2B-256 provenance hash per observation. Promotion rule: sample_size ≥ 30 AND wilson_lb ≥ 0.60. Refusal raises `PromotionRefusal` carrying full diagnostic.
- **M8** Cross-channel guest identity graph (GDPR-safe) — `c50fd86`. HMAC-SHA256 hashes of normalised email/phone (32-byte minimum key). Eight channels — Airbnb, Booking, Vrbo, direct, WhatsApp, SMS, email, phone. Union-find merge logic with audit trail; key rotation forces re-build. `e318ca7` adds probabilistic behavioural-feature merge (Jaccard ≥0.6, min 3 features).
- **M9** EV / worst-case CVaR risk estimator — `1802800`. Rockafellar–Uryasev exact tail-mean. Defaults: α=0.05 (worst 5%), cvar_threshold=100.0, min_samples=32. Returns `RiskGateDecision` with verdict (PROCEED/ABSTAIN/INSUFFICIENT_DATA).
- **M10** Continuous compliance monitor — `92bc9dc`. ComplianceCheck Protocol + 5 built-in checks: registration_id_required (Reg 2024/1028), hitl_required_for_high_risk (Art. 14), gdpr_art22_consent, jurisdiction_min_nights (BCN 31, AMS 30, AMS centre 15, NYC 30, Lisbon 30), never_ai_action (wraps M5 denylist).
- **M11** Planner style library expansion — `1a6dba1`. (Documented in M4 above.)
- **M12** HTN + LATS + R-WoM hybrid skeleton — `9860857`. Each Operator carries a `PreferredSolver` tag (LLM / Utility / SMT / Deterministic / HITL — GR00T P2).
- **M13** Property Twin Brain — `88b15c2`. TwinState (occupancy_30d, adr, review_score, maintenance_debt, latent), TwinAction, TwinObservation, RolloutTrace. `bcc20de` adds LinearWorldModel as M17 — 5 default action effects (price_change ±1.0 ADR/-0.0008 occ elasticity; maintenance_dispatch -1.0 maint_debt; noise_warning +0.01 review; block_date -1/30 occ; escalate +0.5 maint_debt) + default drift (occ_baseline=0.7, adr_baseline=180, maint_growth=0.1).
- **M14** ACE + sleep + Memory-R1 interaction protocol — `8733bae`. Three replay-loop primitives: Online ACE (Generator → Reflector → Curator), per-step Memory-R1 RL policy, nightly sleep-time consolidation. Conflict resolution rules: agreement → run; Memory-R1 NOOP veto; ACE not applied → NOOP; ADD vs DELETE → defer; RETRIEVE/SUMMARIZE always run; else run Memory-R1 op. Patent claim is on the *protocol*, not each loop.
- **M15** LATS MCTS expansion — `a915181`. UCB1 selection over alternative HTN methods. Random rollout + reward back-propagation. Argmax-average extraction of best plan.
- **M16** R-WoM retrieval-scoring (bag-of-name) — `5d4ba1a`. PlanRecord, PlanCorpus, RetrievalValueEstimator, cosine similarity over Counter-bagged operator names.
- **M17** LinearWorldModel (M13 partial close, documented above).
- **M18** MultinomialLogitPolicy + SGD trainer — `f02500c`. Trainable Memory-R1 policy. Reward-weighted cross-entropy gradient: `w[k][f] += lr · reward · features[f] · (1{k=chosen} − probs[k])`.
- **M19** Decision Pipeline Adapter — `3fdb007`. **The operational seam.** Runs ComplianceMonitor (M10) → CertificateVerifier (M3) → AbstentionGate (M1) → RiskGate (M9) → Compliance NEEDS_REVIEW → emit Art.12 audit record (M5). PROCEED *must* carry an audit_record; non-PROCEED *must not* (validated in `__post_init__`).
- **M20** GRPO trainer — `321cb23`. Group Relative Policy Optimization. `bias[k] += lr · A_k`, `w[k][f] += lr · features[f] · A_k` where `A_k = r_k − mean(r_k)`. Mathematically equivalent to REINFORCE-with-mean-baseline.
- **M21** Embedding R-WoM — `7344be1`. fastembed-backed (BAAI/bge-small-en-v1.5, 384-dim). `e318ca7` adds ANN-backed version with sklearn NearestNeighbors index (cosine, O(log n)).
- **M22** Z3 SMT verifier — `97f324f`. Lazy z3 import. Each negative path runs an actual `z3.Solver().check()` so rationale embeds the SMT witness ("z3.check=unsat") — regulator can replay the check.
- **M23** Bayesian A/B promotion gate — `ba24f40`. Beta(1+s, 1+t-s) posterior per arm. P(challenger > champion) ≥ 0.95 default threshold. Pure-Python (random.betavariate from stdlib, no scipy).
- **M24** Split-conformal calibrator — `6befa5f`. Proper Vovk-Gammerman-Shafer rank correction: `ceil((n+1)(1-α))/n`. Strengthens M1 from "heuristic conformal threshold" to "proper split-conformal coverage gate."
- **M25** Reflexion Critic + Friction tracker — `12c14e3`. `friction = exp(-α * |EMA-| * log1p(count))`. Critique-absorption converts verbal critic output (CritiqueReport.avoidance_hints) into synthetic negative rewards. The patent-defensible bridge between verbal Reflexion output and operational reward shaping. Smoke proof: P(ADD | x=1.0) collapses 16.7% → 0.029 over 2 iterations × 16 contexts.

### 1.4 Sandbox v2 — pre-foundation onboarding UX (PRs ~150-180)

The first pass mentioned sandbox briefly. The actual surface is significant:

- **MISSING_INFO_DETECTED + LEARNING_DECISION events** — `947b512` `807ff23` — Two new AG-UI SSE event types added specifically for sandbox v2 PM Chat. `MISSING_INFO_DETECTED` carries `{question, missing_information, source_field}`. `LEARNING_DECISION` carries `{surprise_score, should_memorize, memory_strength, fact_type, decision}`. Defined in `brain_engine/streaming/event_types.py:78-79`; emit helpers in `brain_engine/streaming/emit_helpers.py:81-138`.
- **PM Chat → regenerate flow** — `275ee80` — `state.pm_input = {question, answer}` branches out of the normal pipeline into `regenerate_response` + persists to `PmFactStore`. Wires the "PM types correction → next guest message uses it" loop.
- **Brain-flag dedup** — `f87b25c` — 1h, 4096-entry in-memory ledger keyed by `(conversation_id, gap_fingerprint)`. Pre-gate `response_has_deferral()` is a fast TR/EN/RU phrase check that short-circuits the extractor LLM call entirely when AI gave a definitive answer.
- **Postman onboarding collection** — `7927eef` `59955c7` — 17 requests across 7 folders (Health, Async, Audit Log, Sync, Batch + bootstrap audit + verify cases + verify rules + property profile). Each request's Tests script asserts the wire contract.
- **Live property cleanup script** — `2c99e52` `aad9b88` — `scripts/cleanup_property_data.py` walks 13 Postgres tables per property + a Pattern Rule scope_id filter. Dry-run default; idempotent; per-table errors logged but never abort. Live evidence on 323133: 9,728 rows cleaned across 6 tables.
- **Reservation prefetch** — `cf7eef9` — GraphQL fetcher for `reservation.data.createdAt` so historical replay gets correct `lead_time_hours` instead of zero. 30-min cache TTL.
- **Decision_at backfill** — `16b41e6` `3f4c0f6` — Sprint 8/8 ext scripts that retroactively populate `stage` + `hours_before_checkin` + `lead_time_hours` on historical DecisionCases (because Sprint 2-3 expanded the synthesiser feature surface but only for cases ingested *after* deploy).

### 1.5 Smart Engine wiring sprint (May 7)

A dedicated push to activate 1000+ LOC of previously-dead code:

- `7c874d7` recency_decay for Mem0 retrieval (exp(-ln(2) * age_days / halflife_days); default halflife 30 days).
- `3aebe6f` Mem0ExtractorService + FactStore wired into `create_full_system` (848 LOC dead → live).
- `1bd74e3` `075d88c` `6cd15f3` — TaskLifecycleManager (state machine: PENDING → WAITING → MONITOR → DONE → ESCALATED) + CheckinGuideGenerator + ReportStore wired into FullSystem (3 × ~3 tests, each: 0 behaviour change but slot is exposed).
- `c8332a9` `58a1c09` — SOPParser + LLMRouter provider_tier table wired.
- `4f8c226` VoiceMessageProcessor wired to app.state (inbound WhatsApp / Telegram audio from cleaners + vendors).
- `cab8466` ContradictionDetector into nightly fact storage gate (378 LOC dead → live; gates between Mem0 fact extraction and FactStore persistence).
- `8e0cc6a` EpisodicDedupConsolidator into nightly step 1 (291 LOC dead → live; cosine-based deterministic greedy clustering; ~30-50% reduction expected).
- `fa7ac1b` DeterministicKGSync into nightly step 4 — **the production cost saver**. Replaces gpt-4o-mini-driven entity extraction with pure-Python mapping from structured DecisionCase rows into the temporal knowledge graph. Cost-shape removal that motivated the 2026-04-29 Graphiti removal but lingered in `MemoryConsolidator.consolidate(force=True)` until this commit.
- `4162e26` LLMJudge into nightly step 8 (1,925 LOC of `evaluation/*` activated).
- `68967d9` VersionedProceduralMemory + 4 Protocol defaults (InMemorySkillStore, BrainZFSSnapshotStore, InMemoryEvolutionTracker, InMemorySuccessSignalSource) — closes advisory §7.2 snapshot-before-evolve + auto-rollback end-to-end.

UX implication: when the operator reads "Cendra performed 12 actions last night," the underlying truth is "these specific subsystems engaged" — each with its own kill-switch. The Daily Brain Report should be sectionable by subsystem so a PM can suppress one without losing the rest.

### 1.6 Intelligent Classifier Phase 1-5 (multilingual replacement of ~640-line keyword tables)

Five-PR migration finished `90f6b44` (Phase 5):

- **Phase 1** `bae0f58` — Language detector (lingua, 12 default languages) + ScenarioMatcher (fastembed `paraphrase-multilingual-MiniLM-L12-v2`, 96 languages OOTB). Memory footprint ~750 KB for 500 × 384 float32 vectors.
- **Phase 2** `5ee5ea0` — IntelligentClassifier composes Layers 1+2+3 (language → top-K candidates → LLM final pick over narrowed K=15). Audit-replayable.
- **Phase 3** `3271e83` — Drop hardcoded multilingual entries from `classifier.py` (TR/RU/ES/DE/SK/NL/DA all removed) + foundation_registry parses the 469 scenarios.
- **Phase 4** `40a10e9` — Strip every keyword table from `classifier.py`, wire LiteLLM client. File: 1381 → 928 lines (-33%).
- **Phase 5** `90f6b44` — Wire IntelligentClassifier into BusinessFlagClassifier production path. Strictly additive — only fills `decision_type_hint` when blank; never overwrites an LLM hint the upstream call already committed to.

UX implication: the engine reasons about scenarios as **embeddings over the foundation's 469 trigger texts**, not keywords. PM sees "Cendra recognised this as scenario S3-024 · 0.87 similarity," not "matched keyword 'wifi'." Property Brain "Scenario coverage" should phrase coverage in terms the engine actually computes.

### 1.7 Bootstrap audit log + unbounded ingestion + async (Mümin PR A/B/C — May 12)

- **PR A** `7188031` — `BootstrapEventBus` Protocol + Redis Streams + summary hash, 24h TTL. 11 `EventKind` types + 16 `SkipReason` types. Per-decision emits in every pipeline step.
- **PR B** `3cad49f` — `_MAX_DAYS` 730 → 3650 (10y), new `_MAX_LIMIT_PER_PROPERTY=100_000`. New `LOADER_TRUNCATED` event when cap hit.
- **PR C** `e32edba` — Async single-property route. `POST /onboarding/bootstrap/property/{id}/async` returns 202 + job_id.
- **PR D** `099aa29` — Redis-backed cross-replica job registry (`BootstrapJobStore`). Fixes the multi-pod 404 where job created on pod A returned 404 from pod B.
- **PR E** `fc29afe` — Bootstrap fans out to 3 memory tiers (Episodic + Semantic + KG). Closes the "885 ingested conversations were invisible to `/memory/timeline`" gap.
- **PR F** `9a19274` — Shared `MemoryFanOut` across every write path: bootstrap, live conversation extraction, V1 onboarding, regenerate, ops decision logger. Carries `source` tag so operators can filter ("bootstrap" / "live" / "regenerate" / "onboarding_v1").

UX implication: the Daily Brain Report has a structured event surface to draw on. Every "Cendra did X" line in the report can be backed by an event id, which is critical for trust.

### 1.8 Episode diagnosis + DENY routing (the Mümin "0 rules" saga)

A sequence of root-cause fixes for "/patterns/extract returns rules but /patterns/rules is empty":

- `011c70e` (#4 root cause) — `CaseOutcome.from_decision_type` classmethod. Live conversations were stored with empty CaseOutcome → resolution_type=None → `has_outcome=False` → extractor silently skipped every live case. Six PM-deliberate actions (APPROVE/CHARGE/OFFER/RELEASE/DENY/BLOCK) collapse to PM_APPROVED + approved=True. DENY collapses to PM_APPROVED intentionally so the case enters the *positive* pool — N consistent refusals form a DENY rule.
- `efdc128` — Historical DENY/BLOCK fix (same root cause, but on the bootstrap path).
- `44fef89` — Two structural bugs Mümin surfaced on 214216 / 56556018: (1) `ArchivedConversation.first_pm_response` returned booking-confirmation email (always earliest non-guest, even when sent before guest's question) → classifier saw welcome text → fell back to INFORM; (2) `hours_before_checkin` dated from extraction wall-clock instead of message time → 1012 hours for a 6-day-lead reservation. Fix: require `sent_at >= first_guest_message.sent_at`; CaseBuilder accepts `decision_at: datetime | None`.
- `e760c43` — Granular skip reasons for empty-thread bucket. Three operationally distinct realities behind one catch-all `empty_thread`: `no_guest_message` (PM-only thread — booking confirmation), `no_pm_response_after_guest` (guest spoke but PM never replied — real unanswered thread, belongs on sandbox), `empty_thread` (the only remaining mystery).

UX implication: Stay timeline should distinguish "auto-skipped, no signal here" from "Cendra didn't find an answer this time" — different copy, different urgency.

### 1.9 Bi-temporal soft-invalidate for PatternRule (Graphiti port — Sprint 1, May 5)

- `6797ac5` — Adapts Zep / Graphiti's bi-temporal model to PatternRule, **zero new LLM calls**. The expensive part of Graphiti (LLM-driven entity / triplet / dedup extraction) is skipped entirely; only the deterministic final step that closes superseded rules is kept. Two new columns on `pattern_rules`: `invalid_at` (T-scale — when the world made the rule wrong) and `deactivated_at` (T'-scale — when Brain Engine learned). They diverge whenever evidence arrives late.
- `5b95106` — Sprint 1.6/1.7/1.8 follow-ups: extract endpoint contradiction resolution; conversation router point-in-time `as_of` parameter; Prometheus counter `brain_pattern_rules_invalidated_total{scenario,scope}`.

UX implication: This is the engine's way of letting historical reservations match the rule that was active *at their reservation date*, not the rule active now. The Audit Trail and Replay surface should expose this: "If you replayed this guest's stay against the May 1 rule set, the decision would have been X." Critically valuable for trust ("Cendra was right at the time").

### 1.10 Past-conversation viewer (May 4 — sandbox v2 backend)

- `b5adc03` — Three read-only admin endpoints over `DecisionCaseStore`:
  - `GET /api/admin/past-conversations` — newest-first list filtered by property_id / owner_id.
  - `GET /api/admin/past-conversations/{reservation_id}/analysis` — bundles cases for one reservation, enriched with `RefusalSignal` (Stage 8.2 multilingual refusal extractor) + stage/scenario/decision-type histograms.
  - `GET /api/admin/past-conversations/{reservation_id}/by-stage` — cases bucketed into the nine BookingStage values for the operator UI timeline.

### 1.11 Refusal Extractor (multilingual guardrail-shape detector)

- `5b5f4b7` — Stage 8.1 time-relative features (hours_before_checkin, hours_before_checkout, is_within_24h_window, is_within_4h_window).
- `593fedd` — Stage 8.2 Multilingual refusal extractor (TR/EN/RU/ES). Five RefusalType values: `requires_document`, `requires_payment`, `requires_approval`, `hard_block`, `generic_refusal`. PM message "Pasaport bilgilerinizi göndermeden kapı kodu paylaşamam" → RefusalSignal(type=REQUIRES_DOCUMENT, language=TR, conditional_clause="Pasaport bilgilerinizi").
- `bb74382` — Refusal reason in DEFER/DENY rule rationale. Each rule's `rationale` field embeds dominant refusal type as "most often because…" clause + first conditional clause as concrete example in quotes.
- `b77ec74` — Phase 3 TR/RU/ES positive-phrasing patterns for app-driven KYC flows. The Mümin door-code passport gate end-to-end fix.
- `0c4dae0` — Multilingual decision-type keywords + LLM-rescue guard. Mümin #4 #1 — 5 sets gained TR + RU + ES + DE + SK entries (DENY 7 → 41, APPROVE 6 → 30, OFFER 5 → 22, QUOTE 6 → 23, ASK 5 → 22). LLM hint pathway tightened to INFORM-only rescue.

UX implication: the Decision Card "Why" drawer can show *why* the PM historically deferred — `requires_document` reads as "Cendra deferred 4 times because the PM was waiting for a passport." This is far more useful than "support=4 confidence=0.85."

### 1.12 Memory wiring rollout sequence (Tasks 0-8, May 7)

Documented in `docs/CLAUDE_CODE_WIRING_FIX_PLAN.md` (no longer tracked in repo but visible in commit history):

- `8daab5c` Task 0 — wiring audit baseline.
- `966f4f3` Task 1 — declare `memory_facts` + `conversation_summary` on PipelineState. Closes "every guest context window had a guaranteed-empty [ESTABLISHED FACTS] block."
- `af65748` Task 2 — inject `memory_system` into ConversationService.
- `c3ae643` Task 3 — alias `app.state.memory_system` to existing initialised memory under `BRAIN_MEMORY_INJECT_ENABLED`.
- `6900e20` Task 4 — `_load_memory_context` pipeline stage. Top-N=20 bi-encoder, top-K=8 final. Multi-tenancy guard via `_build_memory_filter` (customer_id + property_id).
- `2456e88` Task 5 — wire hybrid retrieval into SemanticMemory.search (Sprint C BM25 sparse).
- `9ee3610` polish — drop noqa BLE001 in favour of descriptive `# fail open` comments.
- `e43e200` `39cd74f` Task 7 — memory status endpoint + live CLI monitor (deferred, then restored via PR 169 / 192).
- `a528b80` Task 8 — E2E smoke for memory wiring chain. Eight integration tests pin four contracts (fact reaches assembled context; multi-tenancy filter forwards to MemorySystem.semantic.search; pre-Task-3 path stays empty; AssembledContext shape).

Then the rollout deploys:

- `dce537f` Step 1 — `BRAIN_MEMORY_INJECT_ENABLED=1` (alias on, no read I/O yet).
- `dc1e3b2` Step 2 — `BRAIN_MEMORY_RETRIEVAL_ENABLED=1` (read path lights up; +~50ms p95 expected).
- (`BRAIN_KG_DETERMINISTIC_SYNC_ENABLED` pending for nightly only).

UX implication: the engine has a structured, observable wiring readiness signal per feature. Trust Center could expose: "Memory injection: ✓ wired ✓ enabled. KG sync: ✓ wired ✗ disabled."

### 1.13 Cleanup-and-deduplication patterns (May 5-8)

- `6797ac5` — Bi-temporal soft-invalidate (no row deletion; audit trail intact).
- `3b8304d` — Sprint 4 DecisionCase soft-archive (forgetting curve). 90-day retention. The "not referenced by any active rule" filter ensures a case still feeding a rule is never archived even when older.
- `4733bdc` `2c99e52` — Cross-DB subsumption sweep deactivates stale narrower siblings. After per-batch `_merge_subsumed_rules` runs, walks the active set for each touched `(scope, scope_id, scenario)` bucket and deactivates rules covered by a broader sibling.
- `0ae469b` — Numeric domain bounds in extractor (Mümin #5b "ugly threshold"). Module-level `_NUMERIC_DOMAIN_BOUNDS` registry rejects values outside per-feature ranges. Catches the 6-supporting-case defer-rule at -4197.65 (~6 months into stay).

### 1.14 Observability & monitoring stack (M1-M8 — May 3)

- `531d0e2` Phase M1 — `docker-compose.observability.yml` (prom/prometheus, grafana, langfuse + postgres). Separate from main dev stack.
- `aaeb589` Phase M2 — `LangfuseTracer` + `LangfuseSpan` + `BaseChatModel.invoke` wrapper. Best-effort; instrumentation never breaks LLM call.
- `243dc28` Phase M3 — 10 new Prometheus series: `brain_llm_errors_total{provider, model}`, `brain_memory_retrieval_{hits, misses}_total{tier}`, `brain_patterns_cases_ingested_total{scenario, source}`, `brain_patterns_rules_emitted_total{scenario, kind}`, `brain_patterns_synthesis_{attempts, rejects}_total{scenario}`, `brain_refusal_signals_total{language, type}`, `brain_orchestrator_tier_hits_total{tier}`, `brain_orchestrator_decision_modes_total{mode}`.
- `9e91493` Phase M4 — Four Grafana dashboards: LLM, Memory, Patterns, Orchestrator §10. The Orchestrator §10 dashboard panels: priority-chain tier hits/minute; decision modes/minute (auto/ask/approval/block); auto-resolution share; tier hit distribution piechart.
- `1e6be66` Phase M5 — AKS k8s manifests.
- `78eab0b` Phase M6 — Live mumi-feedback smoke wiring. `LogDecisionRequest` extended with resolution_type / successful / approved / revenue_impact so cases participate in mining via real outcomes.
- `91d7e45` `df160f3` Phase M7/M8 — Datasource UID fix, langfuse auto-init, langfuse SDK pin >=2.0,<3.0.
- `63a3df6` — Wire litellm → Langfuse callback at startup. Conversation pipeline's 8+ litellm.acompletion call-sites were sending LLM round-trips without any tracing.

UX implication: Brain → Trust → Quality Review should pull these metrics — actual production numbers, not synthetic estimates.

### 1.15 Behavior Trees (reactive complement to deliberative HTN)

- `c6e4d78` — `py_trees`-backed Behavior Tree composition layer. **Complementary, not replacement, to HTN+LATS.** The patent value is on the leaves (which wrap M1-M25) not the BT primitives. Sequence / Selector / Parallel composites + Condition / Action leaves with try/except → FAILURE+rationale. Bounded tick loop, deterministic audit-log reset, typed TreeRunResult.

### 1.16 Property Profile harvester + PM Fact store + temporal as_of (April 27-May 3)

- `2077951` — `PmFactStore` + migration 013. `_store_knowledge_update` was a stub. Closes "wifi şifresini girdim, AI öğrenmedi" loop end-to-end.
- `852016a` `ed48868` — PG-backed `PropertyProfileStore` so harvested PropertyProfile survives pod restarts. Migration 012.
- `02e638d` — AG-UI accepts `property_channel_id` from state alongside `property_id`.
- `482b023` — `list_facts` orders newest-first (PG `ORDER BY created_at DESC` + InMemory `reverse=True`). PM corrections supersede stale facts at the top of the prompt.
- `f87b25c` — Brain-flag dedup, 1h ledger (`MISSING_INFO_DETECTED` not re-emitted for same gap fingerprint).
- `ff94515` — Temporal navigation for `PmFactStore.list_facts(as_of=...)`. `GET /api/v1/properties/{id}/memory?as_of=2026-04-28T23:59:59Z` returns facts whose `created_at <= as_of`, newest-first within that horizon.

UX implication: Property Brain bi-temporal slider is real. "What did Cendra know on April 28?" is a tractable query because the wire shape is `as_of` + `created_at <= as_of` over the PG store.

### 1.17 Live data plane: Botel REST → onboarding-api GraphQL switch (April 28)

- `500723d` — Drop Botel `/api/Reservation/Get` (401 on every guest turn → fabricated dates). Replace read path with onboarding-api GraphQL via `GraphqlPmsFetcher`. Conversation pipeline never reaches PMS REST on the hot path; it reaches the unified GraphQL layer that mirrors PMS state to ES.
- `20f79b5` — `RATE_PLANS_WITH_CALENDAR_QUERY` for availability grounding. Per-night `price=<value> <currency>` in [CALENDAR AVAILABILITY] STRICT block.
- `551b250` — Rip `CendraAdapter` out of conversation tools — replaced with pure projection over `runtime.state["availability_calendar"]` (every night must be `status=available, units>0`). Tools never reach back out.

### 1.18 Graphiti removal (April 29)

- `4c6e12d` Phase 1 — Hard-disable adapter, drop `graphiti-core[falkordb]` from requirements.txt. Each `add_episode` was fanning out into 5-10 chat/embedding/summary calls, with upstream retry loop multiplying by 3× on transient failures.
- `974bb2d` Phase 2 — Physical removal of `graphiti_adapter.py`, `cascade_consumer.py`, `falkordb.yaml`, and every call site that mirrored writes into the graph. `/memory/timeline`, `/memory/{property}/audit-sample` now PG-only via PmFactStore tier-2 fallback.

UX implication: Property Brain timeline + audit sample are PG-backed, not graph-backed, since April 29. The capability is leaner and more reliable than the first pass implied.

### 1.19 Mumi feedback close-out (May 3)

- `8b238de` 5-phase rollout summary commit.
- `2c971c1` Phase 1 — Condition synthesizer (greedy decision-tree splitter, 641 LOC). Numeric `gte/lte` at 5 quantiles + categorical `eq` for every distinct target value. DEFAULT_MIN_PURITY=0.8, DEFAULT_MIN_SUPPORT_AFTER=2, DEFAULT_MAX_CONDITIONS=2.
- `8eb1f4a` Phase 2 — Coffee-capsule canonical-label table (`_AMENITY_LABEL_BY_KEYWORD`). Phase 1 follow-up: `_FIELD_ALIASES` cleared because runtime feature dict merges `ctx.pms_snapshot` top-level keys verbatim, not via BookingFeatures.
- `b77ec74` Phase 3 — ID-verification refusal gates (TR/RU/ES positive-phrasing for app-driven KYC).
- `c85ce70` Phase 4 — DEFER decision + EARLY_INQUIRY_IGNORED scenario. ≥96h before check-in → upgrade scenario from EARLY_CHECKIN to EARLY_INQUIRY_IGNORED.
- `ff94515` Phase 5 — Temporal navigation (above).

### 1.20 Azure-only collapse (April 29)

- `7792540` — Rip public OpenAI fallback paths. `litellm.model_alias_map` redirects bare OpenAI model names to Azure deployments at startup. Every dual-path call-site collapses onto the single Azure surface. 20+ call sites bypass `LLMRouter` and go straight to litellm — alias map covers all of them.

UX implication: regulatory and cost story is cleaner — "Cendra runs on Azure OpenAI" is a true statement, not a half-truth. Trust Center / data residency claims can lean on this.

### 1.21 Sprint H per-scenario feature whitelist (May 6)

- `f68fbd1` — `BRAIN_SCENARIO_FEATURES_ENABLED` flag + `SCENARIO_FEATURES` dict. Initially only ACCESS_CODE_RELEASE listed; others fall back to global defaults. `35e5342` extends with LATE_CHECKOUT and EARLY_CHECKIN sharing the same `_TIMING_OCCUPANCY_WHITELIST`.
- `7b1e5a4` `f552741` — Sprint H extractor parity + `/patterns/scenarios` endpoint + offset/total pagination. Mümin round-3 #2 + #3 closed.
- `6797ac5` — Sprint I foundation analyser scaffolding (`scenario_foundation` table, `FoundationAnalyzer`, `BRAIN_FOUNDATION_ANALYZER_ENABLED`). Per-property feature importance learned from DecisionCase history. Will eventually replace the hand-curated `scenario_features` whitelist.

### 1.22 Causal navigation subsystem (Gap #3, April 21)

- `0515078` — `/api/memory/property/{id}/causal` + CSV export + `/causal/walk` (chains-only for an anchor event) + `with_causal=true` parameter on `/api/memory/property/{id}/timeline` (attaches serialised causal_graph to narrative.meta).

### 1.23 Cards / Context tags / Action kinds (V2 UI vocabulary)

- `0b82ebd` (PR 19-33 batch) — `DecisionCard` 5-slot, 16 ContextTag + 16 CardActionKind vocabularies. CardActionKind enum: `SEND_MESSAGE, REQUEST_DOCUMENT, CONFIRM_BOOKING, CANCEL_BOOKING, HOLD_FOR_REVIEW, BLOCK_DATE, APPLY_DISCOUNT, COUNTER_OFFER, CHARGE_FEE, ISSUE_REFUND, DISPATCH_VENDOR, RELEASE_CODE, ESCALATE, HANDOFF_TO_TEAMMATE, MARK_RESOLVED, LOG_DECISION`. ReversibilityTier default per kind: SEND_MESSAGE → GREEN, CHARGE_FEE / ISSUE_REFUND / RELEASE_CODE / CONFIRM_BOOKING / CANCEL_BOOKING → RED, most others → AMBER.

UX implication: First pass mentioned 9 DecisionAction literals from the orchestrator (`ask/approve/deny/charge/quote/block/escalate/dispatch/fetch_live_data`). These are different from CardActionKind (16). One is the **orchestrator's verdict** (what to do); the other is the **UI's prepared action** (what to render). A card carries one of each.

### 1.24 Past chapters that the first pass touched lightly

- `c1c4152` Confidence formula §10 + multi-case-per-thread classify_all (one message can fan out to 3 sibling DecisionCases — coffee + extra towels + access code).
- `fb9a4c1` P1-P5 coverage closure — DecisionType MODIFY_BOOKING/REFUND/CLAIM + 91-hook registry + 46 operational policies (botel guardrails) + 173 canonical Key Data fields with 1-5 importance score + ValidationContext with 6 new _check_no_* methods + per-scenario outcome labeller (4 explicit ali.md §8 rules) + per-scenario FeatureBuilder branches (3 ali.md §6 rules including guest_count_mismatch's computed_extra_guest_fee).
- `c8a5d04` Multilingual scenario classifier — direct keyword bypass when `_ACCESS_CODE_KEYWORDS`/`_EARLY_KEYWORDS`/`_LATE_KEYWORDS` match (TR / RU / DE / DA / NL variants harvested from property 323133 archive).
- `f87b25c` Brain-flag dedup with TTL ledger.

### 1.25 R-series refactor (April 25-26)

R1-R18 lifespan extractions — moving inline construction out of `api_server/server.py` (which was 4806+ lines) into per-domain bootstrap modules under `api_server/bootstrap/`. R10 (unified_data), R11 (narrative), R12 (evidence), R13 (autonomy), R14 (interview), R15 (voice), R16 (collab), R17 (background reasoning), R18 (V1 onboarding). Pure SRP — zero behaviour change. End state: 18 named bootstrap modules + a 4640-line server.py that just calls `wire_X(application)` for each domain.

UX implication: every router and module the UI talks to is now individually testable + replaceable. Architecturally clean, and means feature flips per domain are atomic.

### 1.26 IETF Internet-Draft + USPTO patents

- `a014427` — IETF Owner-Policy DSL Internet-Draft v0.1 (533 lines, RFC 5234 ABNF, BCP-14 keywords throughout). Strategic value: open-standard positioning eliminates "vendor lock-in" red flag; published I-D forecloses §102/§103 attacks; defensive prior art dated 2026-05-11.
- `6be564f` — 8 patent candidates, USPTO-style independent + method + CRM + dependent claims.

### 1.27 Smoke harness "every layer green"

- `c7f40c7` — `MemorySmokeRunner` with 13 stages: graphql_fetch, episode_split, case_extraction, episodic_mirror, case_store, pattern_mine, rule_store, blacklist_guard, router_probe, episodic_recall, case_recall, rule_recall, priority_chain. Coherence stages prove read-after-write across episodic memory + case store + rule store.
- `e43e200` — `/api/admin/memory/status` + live CLI monitor (`tools/memory_monitor.py`).
- `0d0b211` — `tools/brain_engine_showcase.py` — operator-facing live proof tool that walks the dev cluster + prints colour-coded readout of every layer.

### 1.28 Continuous testing constraints (April 30)

- `e62b714` — Drop pytest+coverage step entirely. Hours-long hangs caused this. Compileall stays as the only safety net.
- `b3c6f9e` — Restore pytest with hard time-box: `pytest-timeout>=2.3.0`, `--timeout=120 --timeout-method=thread`, `--maxfail=3 -x`, `--cov-fail-under=60` (was 75 — temporarily lowered).

### 1.29 Property-test framework (April 29)

`25e875a` + `42a79ee` — Phase 6 + 7 Hypothesis property tests + pytest-benchmark scaffolds. 22 + 18 property tests across counterfactual, emotion, audit pack, traffic splitter, global patterns, dedup, replay, versioned procedural, booking cost, jailbreak classifier, prompt injection, redactor. Benchmark budgets: counterfactual < 100us, emotion lexicon < 2ms, AuditPackBuilder.append × 50 + verify < 15ms, DeterministicTrafficSplitter.assign < 50us, GlobalPatternMiner.mine over 20 obs < 1ms.

### 1.30 Advisory phase 1-5 (April 29) — production hardening

- `85ca9bf` Phase 1 (foundations) — pyproject.toml coverage gates, prom metrics, HMI hierarchical index, retention policies, audit log (chained-blake2b), prompt-injection detector, rate limiter, ProviderTier (Azure-only).
- `234685e` Phase 2 — GDPR + secrets + versioning + chaos. Consent store, DSR coordinator with 5 request types (ACCESS, ERASURE, RECTIFICATION, PORTABILITY, RESTRICTION), HKDF-blake2b key derivation + AES-GCM encryptor, KeyVaultSecretProvider, JailbreakClassifier (DAN, dev-mode, grandma-exploit), VersionedProceduralMemory (snapshot + auto-rollback), chaos harness.
- `cdb2ab9` Phase 3 — dedup + cost + replay (above).
- `2c38f5c` Phase 4 — global patterns (cross-property miner; ≥3 properties + ≥0.6 dominance) + A/B framework (DeterministicTrafficSplitter via blake2b, two-proportion z-test, ExperimentRegistry).
- `79ab9c2` Phase 5 — counterfactual (CausalLink intervention forward through priority-sorted rules, DEFAULT_MAX_HOPS=16) + emotion (EN/RU/TR lexicon, 5 tones NEUTRAL/POSITIVE/CONCERNED/FRUSTRATED/EMPATHETIC) + audit pack (tamper-evident, BLAKE2B canonical-json chain hash).

---

## 2. Subsystem Catalog

| Subsystem | Maturity | What it does (product language) | Feature flag | UX implication |
|---|---|---|---|---|
| **abstention** | production-wired (M1, M19 chain) | "Cendra is unsure → I'd rather you decide" | none (gate always on for runtime invocations) | Distinct sub-type of Decision Needed; never expose the math |
| **actions** | wired | Three-tier reversibility envelope around every side-effect with Undo within window | none | Undo button + countdown timer on Decision Card; "Cendra reverted this for you" toast on auto-revert |
| **analysis** | wired (FL-16) | Single entry point for foundation pipeline (classify → match → guardrail → mine → route → log_origin) | none (orchestrator always invoked) | Backbone for "scenario S3-024" caption — the orchestrator picks the dominant FoundationScenario every time |
| **analytics** | skeleton | Sentiment + escalation + accuracy aggregation (planned) | none | TBD in UI |
| **api** | wired | FastAPI routers for Cendra adapter | none | Internal — endpoint contract |
| **approval** | production | Three-tier confidence routing (HIGH/MEDIUM/LOW); WhatsApp / Telegram routing to owner | none | The hero capability for the Approval flow |
| **autonomy** | production | OBSERVE/SEMI_AUTO/AUTOPILOT per workflow per property | none | Trust Meter band + CriteriaProgress + CalendarAutonomyGate caveat |
| **backends** | wired | Composite/filesystem/state backends | none | Internal |
| **behavior_trees** | wired (May 11) | Reactive complement to HTN+LATS for short-lived guard chains | none | Invisible to PM — but used inside "Why this safer alternative" reasoning |
| **blockers** | production | Active operational preconditions ("cleaning unconfirmed", "payment pending") | `BLOCKER_STORE_BACKEND=postgres` | "Automation paused because…" copy + DependencyCard |
| **calendar** (sub-module under autonomy) | wired | Re-validates earned engine state against current calendar reality | none | "Cendra would auto-handle this, but calendar tightness made it risky" |
| **cards** | production | Five-slot DecisionCard + 16 CardActionKind + 16 ContextTag + per-kind ReversibilityTier | none | The canonical UI element |
| **causal** | wired | Counterfactual reasoner over CausalLink rules + temporal/resolution/shared-entity inference rules + CSV export + walk endpoint | none | "If you blocked this, here's what likely changes" — Stay Detail what-if drawer |
| **certificates** | production (M3) | Five-tier HMAC-signed autonomy certificate + runtime verifier; per-action ceiling | `BRAIN_AUTONOMY_CERT_KEY` required | Visible internally; UX surface is the autonomy tier chip on action cards |
| **channels** | wired (Pregel infra) | Pregel BSP channel primitives (LastValue, Topic, BinaryOperatorAggregate, EphemeralValue) | none | Internal |
| **checkpointer** | wired | Postgres+memory checkpointer for graphs | none | Internal |
| **cognition_loops** | production (M14, M18, M20, M25) | ACE + sleep + Memory-R1 protocol + GRPO trainer + Reflexion Critic + Friction tracker | none | The Daily Brain Report's "where I friction'd you today" + Approval flow's "Cendra learns from your decisions" |
| **compliance** | production (M5, M10) | EU compliance — Art.12 chained audit + Art.50 disclosure (5 locales) + Reg 2024/1028 + never-AI denylist + 5 continuous checks (registration_id, HITL, GDPR Art.22, jurisdiction min_nights, never_ai) | none | Trust Center compliance posture |
| **context** | wired | BrainZFS-backed context management + offloader + summarizer + token counter | none | Internal; supports the lower-latency conversation pipeline |
| **continual_learning** | wired | Skill evolution / grading / consolidation (NO training/fine-tuning) | various nightly flags | Daily Brain Report sections |
| **conversation** | production | Live guest-message orchestration | many flags | The runtime path |
| **conversation_tools** | wired | Tool implementations (availability_checker, reservation_info_retriever, alternative_property_finder) | none | Internal |
| **cost** | wired | Per-booking cost prediction (LinearCostModel with pinned coefficients, MODEL_VERSION embedded) | none | Could surface as "this booking's compute cost is $0.04 — within the SLO" |
| **customer** | wired | Multi-tenant settings service | none | Internal |
| **debug** | wired | InMemoryReplayEngine + ReplayBreakpoint (PRE_INTENT/POST_MEMORY/PRE_LLM/POST_LLM/PRE_RESPONSE) + StateModifier | none | Trust → Audit replay surface |
| **decision_pipeline** | production (M19) | The pre-tool-call gate adapter — ComplianceMonitor → CertificateVerifier → AbstentionGate → RiskGate → emit Art.12 | none | Each gate's verdict could surface on the WHY drawer |
| **durability** | wired | PipelineCheckpointer + RetryPolicy + CircuitBreaker (LLM/QDRANT/REDIS) + InterruptResume + DurablePipeline + ParallelStep + TaskQueue + WorkerPool | none | "Cendra paused this because Qdrant is down" → trust-preserving outage copy |
| **epistemic** | production (M7) | Observation vs Belief with BLAKE2B-256 provenance + Wilson-bounded promotion | none | "Cendra observed this on 2026-04-12; promoted to belief on 2026-04-20" on Property Facts |
| **escalation** | production | Five-tier 24/7 escalation policy + dispatcher walking fallback chain via TeamRoster | none | EscalationTier chip + responder chip on critical cards |
| **evaluation** | production (PR 179) | Criteria + trajectory + LLM judge + GoldenCasesRunner nightly | `BRAIN_GOLDEN_CASES_ENABLED` | Daily Brain Report Quality Review section |
| **evidence** | wired (GAP L) | EvidenceBundle composed from 4 adapters (Rule / Case / Prompt / Blocker) | none | The Decision Card "Evidence" slot's data source |
| **execution** | wired | ExecutionEngine + AgentAction/AgentFinish + Runtime + RetryPolicy + CachePolicy + StepCollector | none | Internal runtime |
| **experiments** | wired (PR 174) | Durable A/B framework — `ab_experiments` + `ab_outcomes` (migration 020) + admin router (3 endpoints) + DeterministicTrafficSplitter via blake2b + two-proportion z-test | none | "Cendra is testing tone A vs tone B on owner Cihangir House" — not yet exposed |
| **fallback** | wired | ConfigValidator + GapResolver + FallbackChain (cleaner busy → 2nd → 3rd → manager → owner) | none | "Cendra escalated this because all 3 cleaners declined" |
| **flows** | wired | End-to-end Pregel orchestrators: BookingLifecycle, DamageClaimFlow, IncidentResolutionFlow, LateCheckoutFlow, MaintenanceFlow, PhotoInspectionFlow, CleanerCoordinationFlow (legacy) | none | Workflow kinds for Autopilot rows |
| **gestures** | wired (GAP K) | MemoryPrompts + PatternGestures composer | none | The "Cendra used this fact" hover on guest messages |
| **graph** | wired | LangGraph-style StateGraph + add_messages + MessagesState | none | Internal |
| **guardrails** | wired | NLI checker + neuro-symbolic cascade + format check + hallucination check + regenerator | none | Decision Card "Cendra's draft was rewritten because…" indicator |
| **guest_intelligence** | wired | LoyaltyScorer + GuestProfileBuilder + BenefitRecommender + RiskFlagSystem (5 levels) | none | Guest profile loyalty / risk chips |
| **htn** | production (M12, M15, M16, M21) | HTN + LATS + R-WoM hybrid planner; 5 PreferredSolver tags (LLM/Utility/SMT/Deterministic/HITL) | none | Could expose "Cendra's plan" as 3 steps on Decision Card |
| **identity** | production (M8) | Cross-channel guest identity graph; HMAC-bound; behavioural-feature Jaccard merge | none | Cross-channel guest identity chip |
| **integrations** | wired | Botel PMS (now read-mostly), unified_data GraphQL, ElevenLabs, Telegram, vision/photo_comparator, Nuki smart lock | none | The "channel chips" on threads |
| **intent_controller** | wired | LLM-based intent classifier + 14 Intent values | none | Hidden from UI; drives routing |
| **interrupts** | wired | interrupt() primitive + Command + InterruptConfig + InterruptManager | none | Human-in-the-loop for tools that need explicit confirmation |
| **interview** | production | PM Q&A engine with 9-stage BookingStage catalog + voice transcription (Whisper) | `INTERVIEW_STORE_BACKEND=postgres` | The onboarding "Cendra asked you 8 questions today" surface |
| **mcp_client** | wired | MCP server consumption | none | Internal |
| **memory** | production | 7-tier cognitive memory (Working / Episodic / Semantic / Procedural / KG / SurpriseDetector / Metacognition + CognitiveController) | many flags | Property Brain timeline; rest internal |
| **messages** | wired | Message ops (filter, merge_runs, trim, RemoveMessage) | none | Internal |
| **middleware** | wired | Middleware stack for pipeline (LoggingMiddleware etc.) | none | Internal |
| **models** | production | LLM provider abstraction — Azure OpenAI only (public OpenAI removed) | various AZURE_* | "Azure-hosted, EU residency" trust note |
| **narrative** | production (Gap #2) | Property-timeline narration with TextRenderer + VoiceRenderer (ElevenLabs) + LLMNarrativeRenderer + UnifiedReservationsTimelineSource + DecisionCaseTimelineSource + GuestHistoryTimelineSource + CustomerMemoryTimelineSource + PropertyOwnershipResolver | none | The voice-of-Cendra on Property Brain and Stay Detail |
| **negotiation** | wired (Gap #4) | Bounded multi-round negotiations with cleaners + vendors; channel-agnostic | none | Vendor Dispatch and Cleaner Coordination cards |
| **notifications** | wired | 24/7 channel dispatcher (push/SMS/phone/digest) routed by NotificationUrgency | none | "Cendra woke the on-call at 03:00 — they responded in 4 min" |
| **observability** | production (M1-M8) | Langfuse + Prometheus + Grafana — 10 metric series + 4 dashboards + AKS manifests | optional langfuse env | Trust → Quality Review band |
| **onboarding** | production | Bootstrap pipeline + episode builder + historical case extractor + 23 events + Redis Streams audit log | many flags | Onboarding screen "Cendra is reading 885 conversations now…" |
| **ops** | wired | Operations message generation, parsing, classification | none | "Cendra dispatched the locksmith" — invisible mechanics |
| **orchestrator** | production | §10 priority chain + ExecutionOrchestrator + 6 TierResolvers + AGUIAdapter + ActionExecutor + EventRouter + MainAgent + ResponseRouter + BookingOrchestrator | none | The runtime spine |
| **owner_policy** | production (M2, M22) | Typed DSL (Lark grammar) + compiler + Z3 SMT verifier; 6 statement kinds + numeric ranges | none | "Cendra verified your rule against 7 others — no contradictions" |
| **owner_profile** | wired | OwnerFlexibilityProfile baseline (max_guests, hard_min_stay_floor, pets_allowed, …) + bi-temporal version field | `OWNER_PROFILE_STORE_BACKEND=postgres` | Owner posture card + "preference" tier in WHY drawer |
| **patterns** | production | The PatternRule + DecisionCase universe — store, miner, extractor, validator, synthesizer, refusal extractor, classifier, foundation catalog/store/update/customer, ml_synthesizer, language_detector, scenario_matcher, intelligent_classifier, ops_decision_logger, case_archiver, foundation_analyzer, etc. | many flags | The learning surface |
| **planner** | production (M4, M11) | GR00T P1 kinematic planner with 12 styles + StyleSelector + apply_style + StyleAppliedCard | none | "Cendra speaks in Boutique style on Cihangir House" |
| **planning** | wired | Lower-level planning helpers (sibling to planner; underutilised) | none | TBD |
| **preferences** | production | PreferenceLearner + PolicyEnforcer + RuleScope (5 scopes: stay/guest/property/owner/portfolio) | none | "Cendra wants to ask 2 follow-up questions after this approval" |
| **pregel** | wired (infra) | Bulk Synchronous Parallel execution engine | none | Internal |
| **profiles** | production | PropertyProfile + PropertyProfileHarvester + PG store; static_payload (41 fields: has_wifi, has_parking, pets_allowed, check_in_time, amenities, descriptions, etc.) | `PROPERTY_PROFILE_STORE_BACKEND=postgres` | Property Brain "what Brain knows" surface |
| **prompt_assembler** | wired | LLM prompt builder from templates and context | none | Internal |
| **property_twin** | production (M13, M17) | TwinState (occupancy_30d, adr, review_score, maintenance_debt, latent) + LinearWorldModel + RolloutTrace | none | Could expose "what-if rollouts" on Property Brain |
| **rag** | wired | DocumentLoader (text/JSON/Markdown) + TextSplitter (recursive / token) + Retriever (Simple / Ensemble) | none | "Cendra retrieved this from your handbook.pdf p.4" |
| **reasoning** | production | Cognitive depth routing + BusinessFlagClassifier + LLMRouter + ProviderTier (Azure-only) + StakeholderModel | `BRAIN_LLM_HINTS_ENABLED` | "Cendra used System-2 thinking on this risky decision" |
| **retention** | production | RetainBlacklist + Redactor (FULL/PARTIAL/HASH) + 7 default patterns (cards, IBANs, phones, emails, TR national ID, generic secrets) | none | Trust Center "PII handled" badge |
| **risk** | production (M9) | EV/CVaR risk gate; α=0.05 default tail; Rockafellar-Uryasev formulation | none | Risk chip on Decision Card |
| **rule_creation** | production | Multi-agent workflow for PM rule building; consumes FL-15 clarifying questions; finalized rules feed FL-14 customer foundation | none | "Cendra is helping you build a rule — 3 questions before publish" |
| **rules** | wired (skeleton) | Lower-level rule helpers; mostly absorbed into patterns/ | none | Internal |
| **sandbox** | production | Unanswered-thread store + example-reply generators (Template + LLM) + readiness service + review_heuristics + harvester wiring | many flags | Onboarding sandbox v2 |
| **scheduler** | wired | NightlyScheduler + Ticker + FollowUpStore + CompositeNightlyRunner (fans one nightly tick out to N runners with isolated failures) | none | "Cendra ran the nightly review at 03:00; here's what changed" |
| **security** | production | Rate limiter (per-tenant token bucket; separate buckets for dangerous actions) + PromptInjectionDetector + JailbreakClassifier (DAN/dev-mode/grandma-exploit) + TenantIsolationValidator + SecretProvider | various | Trust Center safety posture |
| **skills** | wired | SKILL.md-based skill loader + registry + injector + creator + ProceduralMemory integration | none | "Cendra's playbooks" view |
| **smart_engine** | wired | ScoringEngine + CleaningCascade (4-level) + VendorPreCheck + CityKnowledgeGraph + APMOrchestrator + TaskLifecycleManager + CheckinGuideGenerator + ReportStore + VoiceMessageProcessor | various | The autonomous-PM scaffolding |
| **stakeholders** | wired (M6) | Multi-stakeholder Pareto/Nash solver — 5 roles + 3 bargaining solutions | none | Could expose "Cendra balanced guest + owner + cleaner interests" |
| **state_manager** | wired | SlotManager + StateMachine + DedupChecker | none | Internal |
| **staticity** | wired | 4-tier classifier — STATIC_SAFE / STATIC_VERIFY_PERIODICALLY / DYNAMIC_FETCH_LIVE / SECRET_DYNAMIC_FETCH_ONLY; promotion threshold after N changes | none | "Cendra cannot answer this automatically — door codes always fetch live" |
| **store** | wired | Cross-thread persistent key-value | none | Internal |
| **streaming** | production | AG-UI SSE emitter + 36+ event types (incl. MISSING_INFO_DETECTED + LEARNING_DECISION) + state broadcaster + emit_helpers (intent_classified, memory_retrieved, rag_hit, guardrail_check, cognitive_mode_changed, missing_info_detected, learning_decision) | none | The cognitive-trace surface |
| **structured_output** | wired | JSON/List/Pydantic output parsers + OutputRetryParser | none | Internal |
| **subagents** | wired | SubAgentRegistry + Runner + task_tool + BrainZFS clone per subagent | none | Could expose "Cendra delegated to refund-specialist subagent" |
| **supply_tracking** | wired | SupplyTracker + ExpenseRecord + RestockAlert | none | "Cleaner used $4 of supplies — auto-recorded" |
| **team** | wired | TeamRoster + DutyShift + Mention + Handoff + per-property coverage queries | none | Team mentions tab + duty-aware routing |
| **tools** | wired | @tool decorator + registry | none | Internal |
| **upsell** | wired (skeleton) | Feasibility evaluation for revenue opportunities | none | OpportunityCard data source |
| **whatsapp** | wired | WhatsApp channel — booking assistant + property search + alternative-property finder | none | The WhatsApp owner-approval routing channel |
| **zfs** | wired | BrainZFS — ZFS-inspired virtual filesystem (COW, snapshots, clones, dedup, compression) for AI context management | none | "Cendra can roll back to a checkpoint" — invisible but enabling for Replay |

---

## 3. Capability Map ADDITIONS (capabilities not surfaced in the first pass)

### 3.1 Replay engine with breakpoints (debug/replay_engine.py — advisory §10.1)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `ConversationReplayEngine` with 5 breakpoints (`PRE_INTENT`, `POST_MEMORY`, `PRE_LLM`, `POST_LLM`, `PRE_RESPONSE`) + `StateModifier` callback + `ReplayResult` carrying `diff` | "Replay this guest message through Cendra's brain with the rule set that was active on April 28" | Audit trail → Replay button; Decision Card "Replay this decision against today's rules" | If shown raw, looks like dev tooling. Show as plain-language "what would Cendra do today?" |

Cited: `cdb2ab9` (Phase 3 — replay_engine.py shipped) + `debug/__init__.py`.

### 3.2 Audit Pack (tamper-evident chained audit log — evidence/audit_pack.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `AuditPackBuilder` + `AuditEntry` rows pinning prior entry's BLAKE2B-256 hash; `AuditPack.verify()` walks the chain | "Every Cendra decision is in a tamper-evident chain — show me proof" | Trust → Audit "verify chain integrity" badge ("chain verified · last entry 2 minutes ago") | None — strictly visible-on-demand |

Cited: `79ab9c2`.

### 3.3 Global pattern miner (cross-property aggregation — patterns/global_patterns.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `GlobalPatternMiner.mine(observations)` — emits `GlobalPattern` only when ≥3 properties agree on the dominant action *and* dominance share ≥0.6 *and* `tenants_count` ≥3 (no single multi-property tenant can fake universal consensus) | "Most properties handle this scenario the same way — would you like to adopt the standard?" | Brain → Learning → Foundation Update Suggestions (badge: "industry default") | Tenant boundary violation — must show "across 23 customers" so PM trusts the privacy boundary |

Cited: `2c38f5c`.

### 3.4 Counterfactual reasoner (causal/counterfactual.py — advisory §12)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| Forward-simulates an intervention through a priority-sorted set of `CausalLink` rules; max 16 hops; deterministic, no LLM | "If you cancel this booking, here's what likely changes" | Decision Card "What if I deny this?" panel | If shown as confident prediction, can be wrong; copy "based on similar past cases" |

Cited: `79ab9c2`.

### 3.5 Property Twin imagined rollouts (property_twin/)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `PropertyTwin.rollout(state, actions)` walks `LinearWorldModel` for N steps; produces `RolloutTrace` (states + actions); deterministic | "Cendra simulated 14 days of this pricing strategy" | Property Brain → Strategy tab → "Simulated outcomes" preview | Twin is linear, not neural; PM may overweight predictions |

Cited: `88b15c2` `bcc20de`.

### 3.6 Reflexion Critic + Friction tracker (cognition_loops/critic.py + friction.py — Moat 25)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `ReflexionCritic` produces `CritiqueReport` (dissatisfaction in [0,1], worst-correlated features, per-MemoryOpKind avoidance hints). `FrictionTracker` keyed by `(state_key, op_kind)` with EMA reward + count. `friction(...)` returns multiplier in [0, 1]. Critique-absorption converts verbal output into synthetic negative rewards. | "Cendra ran a self-review last night — here's where it friction'd you today and what it will try differently" | Daily Brain Report → "Where I slowed you down today" section | Self-critical to a fault — must be tight + actionable; not a confessional |

Cited: `12c14e3`.

### 3.7 Versioned procedural memory (memory/versioned_procedural.py — advisory §7.2)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| Snapshot-before-evolve + auto-rollback sweep. Each skill carries `EvolutionRecord` + `RollbackOutcome`. `SuccessSignalSource` Protocol; `SkillSnapshotStore` Protocol; `EvolutionTracker` Protocol. | "Cendra learned a new variation of this playbook — if the success rate drops below 60% over 2 weeks it will roll back" | Brain → Playbooks → each playbook shows "active version + 2 in evaluation" | Auto-rollback can confuse PM — show explicit "rolled back because…" log |

Cited: `234685e` (Phase 2 advisory) + `68967d9` (defaults wired).

### 3.8 Owner-policy DSL with Z3 SMT verifier (owner_policy/ — Moats 2 + 22)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| 6-statement Lark grammar: `style = COOPERATIVE; jurisdiction = "BCN"; forbid: charge_fee, issue_refund; min_nights >= 31; nightly_rate >= 230;`. Compiler emits `PlannerStyleSpec`; `Z3OwnerPolicyVerifier.verify()` runs actual `z3.Solver().check()` on every negative path. SMT witness ("z3.check=unsat") embedded in rationale. | "Cendra verified your new rule against the 7 existing owner rules — no contradictions" | Rule creation → "Verified consistent" badge; Trust → Owner Rules → "Z3 proof" link | If shown as "AI verified", PM doesn't trust; show as "mathematically verified — no contradiction possible" |

Cited: `3a56206` `97f324f` `e318ca7`.

### 3.9 Stakeholder Pareto-bargaining (stakeholders/ — Moat 6)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| 5 stakeholder roles (guest/owner/cleaner/neighbor/regulator). Hard-veto filter → Pareto frontier → bargaining solution (Nash/egalitarian/utilitarian) → `NegotiationOutcome`. | "Cendra picked this option because it works for guest + owner + cleaner simultaneously" | Decision Card → "Stakeholder balance" inline mini-chart (3-4 colored dots showing who benefits) | Could feel preachy; show only when the decision genuinely required balancing |

Cited: `677cc2c`.

### 3.10 EV/CVaR risk gate (risk/ — Moat 9)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| Each candidate action carries an `OutcomeSample` distribution (loss + weight). `compute_risk` returns `RiskEstimate(ev, cvar_α, var_α, sample_size)`. `RiskGate.evaluate` refuses when `cvar > threshold`. | "Worst-case loss on this refund is $350 (5% tail) — within your policy" | Decision Card → Mode/Risk/Reversibility row → CVaR cell ("worst-case $350") | Must use plain English ("worst 5% outcomes average $350"), never the formula |

Cited: `1802800`.

### 3.11 Compliance monitor (compliance/ — Moat 10)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| 5 built-in checks. `ComplianceContext` carries `is_natural_person_decision` + `has_human_consent` flags. Verdict: PASS / NEEDS_REVIEW / BLOCKED. BLOCK > REVIEW > PASS aggregation. | "Cendra checked this against EU regulations — needs your sign-off" | Decision Card → orange "Needs your sign-off (GDPR Art.22)" inline badge | Per-jurisdiction: BCN 31 nights, AMS 30, AMS centre 15, NYC 30, Lisbon 30 |

Cited: `92bc9dc`.

### 3.12 Behavior Trees (reactive layer — behavior_trees/)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `py_trees`-backed Sequence/Selector/Parallel composites + Condition/Action leaves. Bounded tick loop. `TreeRunner` with audit-log per tick. | "Cendra ran a 4-step check before sending this draft: M1 abstention OK → M2 owner-policy OK → M3 cert OK → M9 risk OK" | Decision Card → "How Cendra checked" subtle 4-step ladder (collapsed by default) | Visualising the BT could feel like dev tooling; show only on expand |

Cited: `c6e4d78`.

### 3.13 Identity graph (Moat 8)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| HMAC-SHA256 hashes of normalised email/phone (32-byte min key). 8 channels. Union-find merge. Behavioural-feature Jaccard merge (≥0.6, min 3 features). Key rotation forces re-build. | "Same guest, three channels — Cendra merged them" | Stay Detail header → Cross-channel chip strip with merge confidence + merge_evidence_kind | Wrong merges erode trust; show source of merge ("merged because same phone hash + 4 shared behavioural features") |

Cited: `c50fd86` + `e318ca7`.

### 3.14 Hierarchical Memory Index (memory/hierarchical_index.py — advisory §7.1)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| Pure planner over intent × cognitive level → tier set. Force-full bypass for cascade-router compatibility. Property tests pin monotonicity, force-full dominance, purity. | "Cendra consulted 3 memory tiers for this decision: working + episodic + procedural" | Decision Card → expandable "memory consulted" trail (4 tiers max, never all 7) | Showing too many tiers feels artificial; cap at 4 visible |

Cited: `85ca9bf`.

### 3.15 Promise object (implicit)

Not in code as a first-class type, but inferable from `DecisionCase.action.action_type IN ("quote", "dispatch")` + `outcome.resolved` pending. The product should promote it; it's already implied by the data model.

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `Promise` (implicit) — derived from DecisionCase action="quote"/"dispatch" + verification | "Cendra committed to early check-in for guest Anna — due in 12h" | PromiseCard | Without verification field, "promised" becomes vague |

### 3.16 Approval gateway WhatsApp/Telegram routing (approval/gateway.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| 437-line `ApprovalGateway`. Confidence-tier router → notification dispatcher (WhatsApp / Telegram / push / digest). Owner profile registry. | "Send this approval to owner via WhatsApp" | Approval flow → 8th action button "Send to owner via WhatsApp" + delivery confirmation | Owner may miss notifications; show delivery state |

Cited: `brain_engine/approval/gateway.py` (437 LOC, the largest non-pattern file in the runtime).

### 3.17 5-state task lifecycle (smart_engine/task_lifecycle.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `TaskLifecycleManager` — state machine PENDING → WAITING → MONITOR → DONE → ESCALATED. Stateless, no I/O at construction. | "Cendra has 4 tasks in flight: 1 waiting on cleaner, 2 monitoring, 1 escalated" | Today header status row → 4 small chips with counts | Without per-task drill-down, becomes ambient noise |

Cited: `1bd74e3`.

### 3.18 Check-in Guide Generator (smart_engine/checkin_guide.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `CheckinGuideGenerator(memory)` — renders multilingual check-in guides (PropertyAccess credentials + booking metadata + guest preferences from memory) for WhatsApp delivery. Matches manual "after passports verified, I send the guide" workflow. | "Cendra prepared a check-in guide in 5 languages — review and send" | Stay Detail → Pre-arrival panel → "Send guide" action | Must respect FL-05 — passport must be verified before code goes in guide |

Cited: `075d88c`.

### 3.19 Voice processor (smart_engine/voice_message_processor.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| Azure Whisper inbound transcription. Cleaners and vendors sending WhatsApp / Telegram audio. Separate from InterviewEngine answer-voice flow. | "Cleaner sent a voice message — Cendra transcribed it: 'I'll be 30 minutes late'" | Inbound message → small "transcribed by Cendra" footnote | Transcription errors must be flagged; show original audio link |

Cited: `4f8c226`.

### 3.20 Vendor pre-check (smart_engine/vendor_precheck.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| Proactive equipment / supplies checking before check-in. Part of APMOrchestrator. | "Cendra checked the property's coffee machine isn't broken — last incident 47 days ago" | Stay Detail pre-arrival prep card → "✓ Coffee machine OK ✓ Wi-Fi OK ✓ Towels stocked" | Without inspection history, can feel made up; ground each in a date/source |

Cited: `smart_engine/__init__.py`.

### 3.21 Knowledge graph deterministic sync (memory/kg_deterministic_sync.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| Pure-Python mapping from DecisionCase rows into the temporal knowledge graph: Property + Guest + Booking KnowledgeNode + 3 relationships (`involved_in_case`, `booked_for`, `stayed_at`). Confidence fixed at 1.0. Source tag `deterministic_case_sync`. | "Cendra knows this guest from 3 prior stays — same Booking.com Plus tier" | Stay Detail → guest profile → "3 prior stays · last 2026-02-14" with link to KG view | Don't expose KG raw; expose only the facts the KG enables |

Cited: `fa7ac1b`.

### 3.22 Episodic dedup consolidator (memory/episodic_dedup.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| Deterministic greedy centroid clustering with cosine similarity. EmbeddingProvider Protocol. `DedupReport` with `reduction_ratio` (advisory §7.3 expects 30-50%). | "Cendra consolidated 200 episodes into 142 unique conversations overnight" | Daily Brain Report → "Cendra cleaned up: 58 duplicate episodes merged" | Show what was merged on demand; PM may want to inspect |

Cited: `cdb2ab9`.

### 3.23 Recency decay (memory/recency_decay.py)

| What | Operational | UI surface | Risk |
|---|---|---|---|
| `apply_recency_decay(facts, halflife_days=30, now=None)` — `confidence *= exp(-ln(2) * age_days / halflife_days)`. A 60-day-old preference drops to ~25%. Fact's `extracted_at` must parse; missing timestamp skips multiplier (never fabricates). | "Cendra weighted recent preferences more than old ones" | Invisible directly; surfaces as "Cendra is more uncertain about this old fact" | If shown raw, looks arbitrary; tie to "based on conversation 87 days ago" |

Cited: `7c874d7`.

### 3.24 Differential confidence formula (patterns/confidence.py)

`compute_confidence(success_count, total_matching_cases, ConfidenceContext)`:

```
confidence = (
    success / total
    - counterexample_penalty
    - staleness_penalty
    - low_support_penalty
    - conflict_penalty
) * hidden_variable_penalty
```

Plus §5 signal additive boosts (PM_APPROVED +0.10, PM_MODIFIED +0.15, etc.). Plus `contradiction_unresolved` cap at 0.70.

UX implication: Never expose decimals. The Decision Card chip should read "high confidence" with a hover tooltip explaining the components: "Strong base rate · ↑boosted by 6 PM approvals · ↓penalised by 2 counterexamples · capped at 0.70 due to unresolved contradiction." That tooltip is doable today from the wire object.

Cited: `c1c4152` `5239199`.

### 3.25 Stage-aware features (patterns/feature_builder.py + Sprint 8 `_compute_time_to_checkin`)

Five additional features beyond the base BookingFeatures:
- `hours_before_checkin` (signed; negative = post-checkin)
- `hours_before_checkout` (signed)
- `is_within_24h_window` / `is_within_4h_window`
- `reservation_status`

Stage classifier `classify_stage_by_window()` short-circuits to:
- ≤4h before check-in OR first 4h after → CHECKIN
- ≤24h before check-in (but >4h) → PRE_ARRIVAL
- last 4h of stay → CHECKOUT
- inside [check-in, check-out] → IN_STAY
- elsewhere → PRE_BOOKING / POST_CHECKOUT

UX implication: First pass mentioned 9-stage BookingStage but didn't note the 4h/24h windows. The Stay Detail "stage" chip should advance automatically through these windows — and a Decision Card can read "Cendra is in CHECKIN mode (3h before arrival)" with full context.

Cited: `5b5f4b7` `adfd495`.

---

## 4. Mental Model Anchors I missed

### 4.1 "Foundation-driven, not LLM-driven, routing"

Memory routing is decided by the FL-04 foundation labels, not by an LLM call. The label says "Property knowledge + Reservation context memory" → fan-out to SEMANTIC + EPISODIC, deterministically. Same for FL-05 safety, FL-06 confidence, FL-07 source reliability. The Foundation is **the source of truth** for many decisions the user might assume the LLM is making.

UX implication: When PM thinks "AI decided this", the right framing is often "the hospitality foundation prescribed this; Cendra applied it." The Property Brain WHY drawer should make this distinction visible.

### 4.2 "Pure compute + I/O-free + best-effort writes" architectural philosophy

A pattern that appears in every PR body: the engine prefers pure helpers (no I/O at construction), tries to do best-effort writes that swallow per-tier failures, and exposes Protocols rather than concrete classes. The architectural payoff: any pod outage degrades gracefully. The UX payoff: "Cendra paused this because we cannot reach the calendar — your other workflows continue normally" is a true and easy copy.

### 4.3 "Two-axis bi-temporal" — invalid_at vs deactivated_at

The Sprint-1 Graphiti port adds two columns to PatternRule. They diverge whenever evidence arrives late (out-of-order ingestion, historical re-bootstrap):
- `invalid_at` (T-scale) — when the world made the rule wrong
- `deactivated_at` (T'-scale) — when Brain Engine learned about it

UX implication: Audit Trail can show "this rule was wrong starting March 12 but Brain Engine didn't learn until April 28" — a deeply trust-building piece of honesty.

### 4.4 "Five PreferredSolvers" — LLM / Utility / SMT / Deterministic / HITL

Every HTN Operator carries a `PreferredSolver` tag. This is the **GR00T P2 decoupled WBC seam** — the engine knows whether each step in a plan needs LLM reasoning, a utility function call, an SMT solve, a deterministic table lookup, or a human-in-the-loop step. The runtime middleware routes per-operator. This is invisible today but is the right anchor for a future "Cendra's plan breakdown" UI.

Cited: `9860857` (M12) `htn/__init__.py`.

### 4.5 "Bi-temporal observation/belief"

The Moat 7 epistemic schema isn't just a pair of tables — it's a **multi-tier discipline**: every memory tier (Working / Episodic / Semantic / Procedural / KG) carries observations as immutable + beliefs as mutable. The Wilson-bounded `BeliefPromotionGate` is the only path from one to the other.

UX implication: Property Brain facts can show two badges: "observed 3 times since 2026-03-12" vs "Cendra believes this since 2026-04-20 (promoted from observations)." The discipline is real; the UI should expose it on demand.

### 4.6 "Dual-process System-1 / System-2" (cognitive_controller + COGNITIVE_MODE_CHANGED event)

The memory README's cognitive controller is a Kahneman-style dual-process router. System-1 fast (heuristics + memory hits) vs System-2 slow (LLM deliberation). `COGNITIVE_MODE_CHANGED` event is wired in `streaming/event_types.py`. The mode switches per-decision based on risk + ambiguity.

UX implication: Subtle "Cendra is thinking carefully" indicator on Decision Card when System-2 engages. The first pass mentioned this but didn't ground it in the event.

### 4.7 "Pull-mode KPI roll-up via MetricsCollector"

`InteractionSource` Protocol + `MetricsCollector.collect_window(...)` returns `WindowAggregate` + 8 CEO V2 KPIs. The autonomy engine pulls these on demand instead of pushing on every interaction. UX implication: KPI tiles can refresh on user gesture without writing to every consumer.

Cited: `autonomy/__init__.py`.

### 4.8 "Bootstrap audit log as first-class observability surface"

`BootstrapEventBus` Protocol + RedisBootstrapEventBus emit per-decision events. 11 EventKind values + 16 SkipReason values. The audit log is queryable via `GET /jobs/{id}/log` (paginated) + `/stream` (SSE tail) + `/summary`.

UX implication: Onboarding screen is not a progress bar — it's a structured event stream. "Cendra read 885 conversations · skipped 147 (PM-only thread) · extracted 542 cases · mined 18 rules."

### 4.9 "Workflow Kind taxonomy" (autonomy/workflow_kinds.py)

`WorkflowKind` StrEnum + `default_workflow_for_event(event_type)` + `WorkflowResolver` Protocol. Canonical taxonomy maps engine events to canonical workflows. The Autopilot UI should source its rows from this taxonomy, not the seven hand-written workflow names in the prototype.

Cited: `autonomy/__init__.py` re-exports `DEFAULT_WORKFLOW_RESOLVER`, `WorkflowKind`, `WorkflowResolver`, `default_workflow_for_event`.

### 4.10 "Never-AI floor" (compliance/never_ai_denylist.py)

Four immutable categories that no owner-policy DSL override can bypass:
- `SCREEN_BY_PROTECTED_CLASS` (civil-rights floor)
- `GDPR_ART22_AUTONOMOUS_DENY` (CJEU SCHUFA Dec 2023)
- `LEGAL_RESPONSE_NO_HUMAN`
- `MEDICAL_ADVICE`

Plus the structural NEVER_AUTO_LEARN list (cancellation_request, damage_report, … 17 do-not-learn scenarios).

UX implication: Brain → Trust → Safety should show "These 4 categories are structurally never automated — no policy can override." A clear floor builds trust faster than a slider.

### 4.11 "Refusal taxonomy" (RefusalType: 5 values)

`requires_document`, `requires_payment`, `requires_approval`, `hard_block`, `generic_refusal` — extracted per-message in 4 languages (TR/EN/RU/ES). This is the engine's structured understanding of *why* a PM deferred. Each refusal type maps to a human-readable rationale on rules:
- `requires_document` → "PM was waiting for a guest document (ID / passport / KYC)"
- `requires_payment` → "PM was waiting for the guest payment to clear"
- `requires_approval` → "PM was waiting for owner / manager approval"
- `hard_block` → "the action is blocked by an explicit property policy"
- `generic_refusal` → "the PM expressed a general refusal"

UX implication: Learning Suggestions can be filtered by refusal type — "Cendra noticed you defer for document verification on 4 properties." That's actionable. Generic "we defer" is not.

Cited: `bb74382` `593fedd`.

### 4.12 "Audit-replayable IntelligentClassification"

Every classification carries the full pipeline trace — language detection, top-K candidates (with similarity scores), LLM response. The audit log can replay *why* a scenario was chosen.

UX implication: Audit Trail row expand can show "Cendra classified this as S3-024 because (1) language = TR (confidence 0.94), (2) top similarity matches were S3-024 (0.87), S3-019 (0.81), S3-022 (0.79), (3) LLM picked S3-024 (confidence 0.92)." That is a transparency tool, used sparingly.

### 4.13 "Pattern hook registry" — 91 xlsx hook→Data rows

`brain_engine/patterns/hook_registry.py` binds 91 `Hook` rows from the AIpatterns xlsx to existing Scenarios + BookingStage envelopes. Drift guard fires when xlsx row count drifts from `EXPECTED_HOOK_COUNT`.

UX implication: Property Brain → Coverage can show "Cendra knows 91 hooks across 469 scenarios" — a higher-resolution coverage view than the 469 alone.

### 4.14 "Data fields registry" — 173 canonical fields × 5 importance levels

`brain_engine/patterns/data_fields_registry.py` — 173 Key Data fields with `category`, `aliases`, `pms_source` hints, and 1-5 importance score. `fields_by_importance(4)` returns 133 critical fields.

UX implication: Property Brain knowledge inventory is grouped by importance — "Cendra needs these 133 critical fields filled to operate at AUTOPILOT." Visual hierarchy maps to engine semantics, not arbitrary UI groupings.

### 4.15 "Causal-tag axis on every DecisionCase"

Three values: `policy_setting`, `one_off_exception`, `unclear`. PatternMiner filters `one_off_exception` by default. PatternValidator rejects rules whose case-set lacks a `policy_setting` majority. Closes the "rescue-discount-becomes-a-rule" failure mode.

UX implication: When approving an action, the PM should be able to mark it as `one_off_exception` so it doesn't pollute future learning. This is a one-checkbox additive change to the approval flow with huge implications for trust.

Cited: `f3595da` `0b82ebd`.

### 4.16 "Manager dim" — manager_id on every DecisionCase

`manager_id` is threaded through DecisionCase, OpsDecisionLogger, CleanerCoordinationFlow, IncidentResolutionFlow, VendorDispatcher, Negotiator. `UNKNOWN_MANAGER_ID` constant is used when context absent, with a structured warning so the gap is visible.

UX implication: Per-PM dashboards work. "PM Maya: 47 decisions today; 91% auto-resolved." This is a load-bearing dimension that the first pass didn't surface.

Cited: `a83cbb6`.

### 4.17 "Kill switch axis" orthogonal to autonomy state

`manager_kill_switch` table — PM-wide vetoes on catastrophic scenario classes (§2.3 wrong-guest release, deposit over-charge). Re-arm carries a cool-down clock that refuses early attempts with `KillSwitchRearmRefused`.

UX implication: Trust → Safety should expose a "kill switch" view that's orthogonal to per-workflow autonomy — "I've paused all CHARGE_FEE actions across my portfolio because something went wrong." Big red button with cool-down semantics.

Cited: `004c42b`.

### 4.18 "Pattern class taxonomy" — 5 classes

`PatternClass` enum (AIpatterns.pdf §4):
- `LEARNED_BEHAVIORAL` (default)
- `DETERMINISTIC_RULE`
- `LIVE_BLOCKER`
- `MANUAL_OVERRIDE`
- `STATISTICAL_HEURISTIC` (capped at ASK — shapes confidence, never runs autonomously)

UX implication: Rule cards can be colored / iconed by class. STATISTICAL_HEURISTIC cards look distinctly "this informs but doesn't auto-decide." Aligns with the engine's structural separation.

Cited: `ae75fa0`.

### 4.19 "Reversal source taxonomy"

`ReversalSource` enum (Stripe / Airbnb / Vrbo / Booking.com / PM manual / guest request / source_unknown) + reversal `ResolutionType` values (CHARGEBACK, OTA_DISPUTE_UPHELD, GUEST_REFUND_REQUEST_UPHELD, PM_CLAWBACK).

UX implication: "Cendra's decision was reversed 3× this month — 2 chargebacks, 1 OTA dispute." Actionable for the PM; precise for the audit log.

Cited: `89d27f9`.

---

## 5. Feature-flag inventory

Ordered by importance to UX. Default state and what it gates.

| Flag | Default | Gates | UX consequence if flipped |
|---|---|---|---|
| `BRAIN_MEMORY_INJECT_ENABLED` | dev: ON | Whether `app.state.memory_system` is aliased to the live memory | None directly — preparation flag |
| `BRAIN_MEMORY_RETRIEVAL_ENABLED` | dev: ON | Whether `_load_memory_context` actually queries SemanticMemory | Off → guest context window has empty `[ESTABLISHED FACTS]` block |
| `BRAIN_RERANKER_ENABLED` | OFF | Cross-encoder rerank (BAAI/bge-reranker-v2-m3, ~568 MB RAM) on bi-encoder top-K | On = +p95 latency, better recall on long-tail; PM sees more precise memory citations |
| `BRAIN_HYBRID_RETRIEVAL_ENABLED` | OFF (do not flip until Qdrant sparse-vector migration ships) | RRF fusion of dense + BM25 sparse vectors | On = significantly better multilingual + jargon recall |
| `BRAIN_GOLDEN_CASES_ENABLED` | OFF | Nightly LLM-as-judge over recent DecisionCases | On = Daily Brain Report Quality Review numbers are real |
| `BRAIN_FOUNDATION_LEARN_GATE_ENABLED` | OFF | PatternMiner filters out `Should AI Learn Pattern: No` foundation scenarios (6 safety + 11 do-not-learn) | On = "Cendra learns gas-smell responses" cannot happen by accident |
| `BRAIN_KG_DETERMINISTIC_SYNC_ENABLED` | ON | Pure-Python KG sync per DecisionCase (Property + Guest + Booking nodes + 3 relationships) | On = no LLM tokens spent on nightly entity extraction |
| `BRAIN_KG_LLM_EXTRACTION_ENABLED` | OFF | Legacy LLM-driven entity extraction in nightly step 4 | On = additional LLM cost; opt back in only for free-text guest preferences that need NLP |
| `BRAIN_CONTRADICTION_CHECK_ENABLED` | OFF | Contradiction-detection gate between Mem0 extraction and FactStore persistence | On = "Cendra flagged a contradiction between two sources" cards appear |
| `BRAIN_EPISODIC_DEDUP_ENABLED` | OFF | Nightly episodic dedup (advisory §7.3 30-50% reduction) | On = Daily Brain Report includes "X duplicates merged" |
| `BRAIN_SCENARIO_FEATURES_ENABLED` | dev: ON | Per-scenario feature whitelist in synthesizer (drops `currency`, `total_price`, `source` etc. from access_code_release rules) | Off → rules over-fit on noise features |
| `BRAIN_ML_SYNTHESIZER_ENABLED` | OFF | sklearn DecisionTreeClassifier supplements Wilson synthesizer for non-linear PM behaviour | On = lifts ceiling on rules; non-linear "denies discount > €200 unless repeat guest + lead > 72h" becomes mineable |
| `BRAIN_ML_SYNTHESIZER_MAX_DEPTH` | 3 | DecisionTree depth cap | Affects rule complexity |
| `BRAIN_SYNTH_IN_OPERATOR_ENABLED` | OFF | `in` operator candidates in synthesizer (mine subsets like "source IN (booking.com, airbnb)") | On = richer categorical conditions |
| `BRAIN_FOUNDATION_ANALYZER_ENABLED` | OFF | Per-property feature importance store learned from history (replaces hand-curated whitelist) | On = "Cendra knows which features matter for your specific properties" |
| `BRAIN_FOUNDATION_REFRESH_DAYS` | 14 | How often the analyzer re-runs | Tunes adaptation rate |
| `BRAIN_VOICE_PROCESSOR_ENABLED` | OFF | Inbound voice (cleaner/vendor WhatsApp/Telegram audio) transcription | On = "Cleaner sent a voice message — Cendra transcribed it" appears |
| `BRAIN_MEM0_EXTRACTOR_ENABLED` | OFF | Mem0 fact extraction service in nightly step 1 | On = nightly batch fact extraction live |
| `BRAIN_LLM_HINTS_ENABLED` | ON | BusinessFlagClassifier `decision_type_hint` / `scenario_hint` are honored by classifier | Off → keyword-only path (kept for emergency rollback) |
| `BRAIN_LEAD_TIME_FETCH_ENABLED` | OFF | GraphQL prefetch of `reservation.data.createdAt` for live cases | On = `lead_time_hours` is populated on every new case |
| `BRAIN_CASE_ARCHIVER_ENABLED` | OFF | DecisionCase soft-archive in nightly cycle | On = cases older than 90d archived (unless still feeding active rule) |
| `BRAIN_CASE_ARCHIVER_RETENTION_DAYS` | 90 | Retention window | Tunes audit retention |
| `BRAIN_CASE_ARCHIVER_BATCH_LIMIT` | 1000 | Per-pass cap | Bounds DB load |
| `BRAIN_RERANKER_MODEL` | BAAI/bge-reranker-v2-m3 | Which cross-encoder is loaded | Affects RAM + accuracy |
| `BRAIN_EMBEDDING_MODEL` | all-MiniLM-L6-v2 | Embedding model | Sprint A target: mxbai-embed-large-v1 (1024-dim) — needs Qdrant collection migration first |
| `BRAIN_EMBEDDING_DIM` | 384 | Embedding dim | Must match Qdrant collection |
| `BRAIN_BM25_MODEL` | Qdrant/bm25 default | Sparse encoder model | Affects sparse recall |
| `BRAIN_AUTONOMY_CERT_KEY` | (required) | HMAC signing key for M3 autonomy certificates | Missing → certificate-gated tools 503 |
| `BRAIN_MASTER_KEY` | (required for encrypted payloads) | base64 master for HKDF-blake2b | Missing → encryption not available |

Stores backend flags (additional axis, not BRAIN_ namespace but functionally equivalent):

| Flag | Default | Effect |
|---|---|---|
| `BLOCKER_STORE_BACKEND` | postgres | InMemory or Postgres for Blockers |
| `INTERVIEW_STORE_BACKEND` | memory | Same for Interview answers |
| `AUTONOMY_STORE_BACKEND` | postgres (prod) | Same for Autonomy state |
| `CARD_STORE_BACKEND` | postgres | Same for Decision Cards |
| `PROPERTY_PROFILE_STORE_BACKEND` | postgres | Same for harvested property knowledge |
| `PM_FACT_STORE_BACKEND` | postgres (dev) | Same for PM-confirmed facts |
| `ONBOARDING_ARCHIVE_SOURCE` | graphql | PMS (legacy Botel) / GraphQL (current) / Composite |
| `DECISION_CASE_STORE_BACKEND` | postgres | Same for DecisionCases |
| `EXPERIMENT_STORE_BACKEND` | postgres | Same for A/B experiments |

UX implication: Operator (Trust Center admin?) view should expose flag state — "these capabilities are wired and ON for your portfolio." Default-off flags have a meaningful product story; PM may legitimately want to opt in.

---

## 6. Engine surfaces relevant to UI that I missed

### 6.1 `GET /api/v1/patterns/rules/{rule_id}/origin`

Returns `RuleOriginResponse` with the full `PatternOrigin` trail. Each `foundation_scenario_id` is enriched with title + stage + risk level when the FL-01 `FoundationCatalogStore` is wired. Falls back to slug-only when absent.

UX: Click any rule → "Cendra learned this from cases C1, C4, C8, C12 — all matched to scenario S3-024 'Same-night booking from zero-review guest'."

Cited: `0170a00`.

### 6.2 `GET /api/v1/patterns/scenarios?scope_id=...`

Lists scenarios that have at least one active rule in a scope, with `rule_count` and freshest `last_seen_at` anchor per scenario. Default scope `PROPERTY`.

UX: Property Brain "Cendra has learned X rules across Y scenarios on this property."

Cited: `f552741`.

### 6.3 `POST /api/v1/patterns/cases` / `GET /patterns/rules` with `offset` + `total` + `has_more`

Both endpoints accept `offset` (default 0) alongside `limit`. `total` reports the *unfiltered* count of matching items rather than the size of the returned page. `has_more` flags whether more rows remain.

UX: Real pagination for the Learning surface, not just "load more."

Cited: `f552741`.

### 6.4 `GET /api/admin/past-conversations/{reservation_id}/analysis` + `/by-stage`

Returns cases tied to one reservation enriched with `RefusalSignal` (multilingual refusal extractor) + stage/scenario/decision-type histograms. The `/by-stage` variant buckets into the nine BookingStage values.

UX: Stay Detail timeline → "what Cendra knows about this guest's conversations across the 9 booking stages."

Cited: `b5adc03`.

### 6.5 `POST /api/v1/onboarding/bootstrap/property/{id}/async` + `/fast/async` + `/jobs/{id}/stream`

Returns 202 + job_id immediately; the `/stream` SSE endpoint emits live events as the pipeline processes (11 EventKind types: JOB_STARTED, PROPERTY_STARTED, CONVERSATION_LOADED, CONVERSATION_SKIPPED, CASE_EXTRACTED, RULE_EMITTED, RULE_BLOCKED, PROFILE_BUILT, LOADER_TRUNCATED, JOB_FINISHED, JOB_FAILED).

UX: Onboarding screen is a live event feed, not a progress bar. PM sees "Reading conversations 142 / 885 · skipped 23 (PM-only thread) · extracted 8 cases · mined 2 rules so far."

Cited: `7188031` `e32edba` `099aa29`.

### 6.6 `GET /api/v1/properties/{property_id}/memory?as_of=...`

Bi-temporal slider on the property knowledge endpoint. Invalid timestamp → HTTP 400 (deterministic by design, not silent degrade).

UX: Property Brain → date picker → "On April 28, Cendra knew Wi-Fi password = `123!123`. Today knows `RestoLuks2024`." Critical for trust + replay.

Cited: `ff94515`.

### 6.7 `MISSING_INFO_DETECTED` + `LEARNING_DECISION` AG-UI events

Two SSE event types added specifically for sandbox v2 PM Chat. Payloads documented in `streaming/emit_helpers.py`:
- `MISSING_INFO_DETECTED` → `{question, missing_information, source_field}`
- `LEARNING_DECISION` → `{surprise_score, should_memorize, memory_strength, fact_type, decision}`

UX: Sandbox / live chat "Cendra needs to ask 1 thing about this stay" + "Cendra thinks this is unusual enough to remember" toasts.

Cited: `947b512`.

### 6.8 `GET /api/admin/memory/status` + `/recent/{property_id}`

Per-tier readiness + counts. `pattern_rules` block has `by_mode/by_scope` breakdown. Recent endpoint returns episodes + DecisionCases for one property with min/max bounds 1..200 (out-of-range → 422).

UX: Trust → Memory Status — first-class admin/diagnostic surface.

Cited: `08e332c` `e43e200`.

### 6.9 `POST /api/admin/memory/smoke/{property_id}?days=&limit=`

Full 13-stage round-trip on real data: graphql_fetch → episode_split → case_extraction → episodic_mirror → case_store → pattern_mine → rule_store → blacklist_guard → router_probe → episodic_recall → case_recall → rule_recall → priority_chain.

UX: PM-facing "run a self-test" button on Property → "Cendra checked itself against your data — all 13 layers green" + audit report.

Cited: `c7f40c7`.

### 6.10 `POST /api/v1/properties/{property_id}/sandbox/preview-reply`

Accepts hypothetical guest_message + stay window + message_sent_at. Predicts BookingStage via `classify_stage_by_window`, asks ExampleReplyGenerator for a candidate, runs RefusalExtractor → returns reply + `guardrail_summary`.

UX: Sandbox "test how Cendra would reply if a guest asked X at Y time" — fully self-service.

Cited: `adfd495`.

### 6.11 `GET /api/admin/experiments/{id}/verdict` (PR 174)

Returns `ExperimentVerdict` (winner + lift + significance) over Bayesian A/B + frequentist z-test. Durable in `ab_experiments` + `ab_outcomes` (migration 020) so verdict survives pod rollover.

UX: Brain → Experiments tab. "Tone A vs Tone B on Cihangir House" with verdict, lift, sample size, time-to-significance estimate.

Cited: `de9834b`.

### 6.12 `/metrics` Prometheus endpoint with 10+ business-level series

`brain_orchestrator_tier_hits_total{tier}` — actual production data showing how often each §10 tier fires.

UX: Trust → "Cendra's decision-making mix in the last 7 days: 67% LEARNED tier, 18% PREFERENCE, 8% BLOCKER, 5% SAFETY, 2% MANUAL, 0% ASK" — direct product line for trust.

Cited: `243dc28`.

### 6.13 `GET /api/admin/past-conversations`

Newest-first list filtered by property_id / owner_id with optional limit (1..200). Read-only, tolerates missing dependencies.

UX: "Cendra's past decisions on this property" surface — distinct from live conversations.

Cited: `b5adc03`.

### 6.14 `_compute_time_to_checkin` exposes signed hours_before_checkin / hours_before_checkout

Negative values valid (case logged after check-in). Sprint 3b ConditionSynthesizer allowlist gains the keys.

UX: Stay Detail timeline can show "X hours before checkin" with negative values for in-stay or post-checkout decisions.

Cited: `63a4dee`.

### 6.15 `EventSequencer.consume_pending` / Event recorder API

Cross-source event ordering for the temporal KG and the causal navigator.

UX: Stay Detail master event stream that respects causal order, not just timestamp order. "Cendra noticed: noise complaint → cleaner dispatched → guest apology."

Cited: `memory/event_recorder.py` + `memory/event_sequencer.py`.

### 6.16 Implicit: per-card "explain" hook returns 7-tier evidence breakdown

`EvidenceQuery → EvidenceService → EvidenceBundle` composes 4 adapter outputs: `RulePick`, `CasePick`, `PromptPick`, `BlockerPick`. Each with `EvidenceWeight`.

UX: Decision Card → "Show the evidence ranking" → 4-source ranked list with weight. Already in code; needs UI surface.

Cited: `evidence/__init__.py`.

### 6.17 Pre-tool-call gate audit trace

`DecisionPipelineAdapter` returns `PipelineDecision` with `GateOutcome` row per gate visited. Audit log can render: "Compliance: PASS (no regulation triggered) · Certificate: PASS (within tier ceiling) · Abstention: PROCEED (Wilson 0.91 + singleton) · Risk: PROCEED (CVaR $34 < $100 threshold) · Art.12 record emitted."

UX: A more honest, machine-verifiable "Why" drawer than the priority-chain alone.

Cited: `3fdb007`.

### 6.18 Workflow Kind taxonomy + DEFAULT_WORKFLOW_RESOLVER

`WorkflowKind` StrEnum and `default_workflow_for_event(event_type) → WorkflowKind`. Canonical autopilot row names sourced from here, not freeform strings.

UX: Autopilot rows are not 7 hand-written workflow names — they're whatever `WorkflowKind` exposes. The first pass got this partially right but didn't pin it to the resolver.

Cited: `autonomy/workflow_kinds.py`.

### 6.19 Calendar Gate verdicts: ALLOW / DOWNGRADE / BLOCK

`CalendarAutonomyGate.evaluate` returns `CalendarGateDecision(verdict, rationale)`. ALLOW = calendar supports engine state. DOWNGRADE = act one rung lower (AUTOPILOT → SEMI_AUTO → OBSERVE). BLOCK = calendar conflicts; defer to PM.

UX: Decision Card → "Cendra would auto-handle this, but tonight's calendar is tight — asking you instead."

Cited: `autonomy/calendar_gate.py`.

### 6.20 Five canonical EscalationTier values + Policy lookup helpers

`EscalationTier` enum: 5 canonical values from the V2 wireframe. `EscalationLevel(target_role, response_window, fallback_tier)`. `EscalationDecision(starting_tier, resolved_tier, responders, fallback_chain, response_window_minutes, escalated)`.

UX: Critical card → chip showing "Tier 2 · 15 min · falls back to On-call" with the responder chain visible.

Cited: `escalation/__init__.py` + `dispatcher.py`.

---

## 7. UX implications digest — top 15 changes ranked impact-to-effort

| # | Change | Impact | Effort | Why this rank |
|---|---|---|---|---|
| 1 | WHY drawer = §10 priority chain visualisation | very high | medium | Already in `BRAIN_ENGINE_UX_ANALYSIS.md`; restated for completeness. Six-tier vertical with firing tier highlighted is the single biggest trust-builder available. |
| 2 | Daily Brain Report = sectioned by subsystem with verifiable event ids | very high | medium | The Daily Brain Report's authority comes from being grounded in real subsystem events (BootstrapEventBus, GoldenCasesRunner, FoundationDrift, FrictionTracker). Each section drills into the raw event log. |
| 3 | Onboarding screen as live event stream | high | low | Three endpoints already exist (`/jobs/{id}`, `/log`, `/stream`). Onboarding is currently the most opaque first impression; the event stream is structured, real, and dramatic. |
| 4 | Property Brain "as_of" bi-temporal slider | high | low | `?as_of=...` is already supported by `PmFactStore.list_facts` and `GET /api/v1/properties/{id}/memory`. One date picker + one query param. |
| 5 | Stay Health derivation tooltip with sources | high | low | Hover surface; data is already there (active DecisionCases + Blockers + Promises + sentiment). |
| 6 | TrustMeter band + CriteriaProgress on Autopilot rows | high | medium | First pass covered this; restated because the engine's `TrustMeterService.compute_band(workflow_autonomy, metrics, kind)` returns the exact shape. |
| 7 | One-checkbox "this was a one-off exception" on approval | high | low | `causal_tag = one_off_exception` is already on every DecisionCase. UI just needs the checkbox. Prevents rescue-discounts becoming durable rules. |
| 8 | "Kill switch" big-red-button axis | high | medium | `manager_kill_switch` table exists. Per scenario-class with cool-down semantics. Distinct from autonomy progression. |
| 9 | Refusal-type filter on Learning Suggestions | medium-high | low | RefusalType is on every rule's rationale. Filter pills "show me where I defer for documents" reveal patterns that flat lists hide. |
| 10 | Stay Detail master event stream (causal-ordered) | medium-high | medium | `EventSequencer` + `CausalGraphBuilder` already exist. Render as a vertical timeline with `→` arrows for causal links. |
| 11 | Per-PM dashboard via manager_id | medium-high | low | `manager_id` is threaded through every DecisionCase. "PM Maya 47 decisions today" is a one-aggregation query. |
| 12 | Scenario coverage broken into "core + your additions" | medium | low | FL-14 customer foundation is wired. Show "469 standard + N your additions" instead of a single number. |
| 13 | Replay button on every Audit Trail row | medium | medium | `InMemoryReplayEngine` is wired with 5 breakpoints. PM-facing copy "Cendra against today's rules" instead of dev terminology. |
| 14 | "Cendra's plan" 3-step ladder on Decision Cards | medium | high | HTN plan exposed as 3 grounded operators with their PreferredSolver tags. Visualises invisible deliberation. |
| 15 | A/B verdict surface on Brain → Insights | medium | medium | `ab_experiments` table + verdict endpoint exist. "Cendra is testing tone A vs tone B" with sample size + significance. |

---

## 8. Contradictions / risks / TBDs

### 8.1 Where the engine is MORE mature than the first pass acknowledges

1. **Property Twin** (M13/M17). The first pass mentioned the twin in passing as a future capability; in fact LinearWorldModel is wired with 5 default action effects + baseline drift parameters. Imagined rollouts are computable today (M13 v0.1 ships data model + Protocol + IdentityWorldModel baseline; M17 ships LinearWorldModel). v1.0 RSSM is the only deferred piece.

2. **Owner-policy DSL with Z3 SMT verifier** (M2/M22). The first pass acknowledged the DSL but framed it as part of M22 future work. In fact the full pipeline (Lark grammar → AST → compiler → DSL→PlannerStyleSpec → Z3 SMT verifier with numeric constraints) is shipped and tested. `e318ca7` even adds numeric range constraints (`min_nights >= 31`, `nightly_rate >= 230`, `max_guests <= 4`). Z3 actually runs `Solver().check()` on every negative path; the rationale embeds the SMT witness for regulator replay.

3. **GRPO trainer + Memory-R1 policy** (M14/M18/M20). Full GRPO is in code (`bias[k] += lr · A_k`, `w[k][f] += lr · features[f] · A_k`). MultinomialLogitPolicy is trainable today via SGDTrainer. Smoke proof: P(ADD|severity=1) → 99.75% over 100 epochs. The honest scope note is that GRPO needs an external rollout pipeline integration for "real-env" rewards — the trainer + policy + advantage estimator are runtime-complete.

4. **EU compliance stack** (Moat 5). The first pass mentioned Art.12 + 50; in fact all four pieces are shipped: never_ai_denylist (4 categories), Art12 chained BLAKE2B digests with deterministic JSON, Art50 5-locale disclosure, Reg 2024/1028 per-unit registration_id + monthly export bundle.

5. **Multilingual classification** is no longer keyword-based at all. The IntelligentClassifier Phase 4 stripped every `_KEYWORDS` constant; the chain now goes through lingua + fastembed + LLM final pick over narrowed K=15.

6. **Bi-temporal lifecycle** is on every PatternRule with proper `invalid_at` (T-scale) and `deactivated_at` (T'-scale) divergence. Historical reservations match against rules as-of their reservation date — `PatternRuleRouter.match(..., as_of=ts)` works today.

7. **5-tier autonomy certificates** (Moat 3) are HMAC-SHA256 signed + scope-validated + policy-ceiling-checked + expiry-checked on every side-effecting tool-call. Not paper certification; cryptographic.

8. **Continuous compliance monitor** (Moat 10) has 5 built-in checks running on every PROCEED. Jurisdiction min_nights is per-city (BCN 31, AMS centre 15, etc.).

9. **Risk gate** (Moat 9) — per-action EV/CVaR with Rockafellar-Uryasev exact tail-mean. Default α=0.05 + threshold $100. Refuses with PROCEED/ABSTAIN/INSUFFICIENT_DATA verdict carrying rationale.

### 8.2 Where the engine is LESS mature than the UI might imply

1. **DreamerV3 RSSM** is **not** in code. The twin's WorldModel Protocol exists; only the linear analytical baseline is shipped. Don't market "Cendra simulates a 14-day future with a neural world model" — show plain "based on similar past 14-day patterns."

2. **Anthropic Auto Dream** for M14 is **not** integrated (no public API). The cognition_loops nightly consolidation runs the protocol but the Anthropic-side dream is a stub.

3. **Real-env GRPO RewardSimulator** for M20 is **not** wired. `LookupRewardSimulator` (replay-style) is the v0.1 path. Until production rollouts feed actual reward signals, the GRPO trainer is supervised-equivalent.

4. **Foundation drift → MD auto-rewrite** is **explicitly disallowed**. FL-13 emits `FoundationUpdateCandidate` rows for human review only. The UI must never say "Cendra updated the foundation" — only "Cendra suggested an update; you can review and edit the markdown."

5. **A-MEM / Zettelkasten linked memory** is in `memory/__init__.py` aspirational prose but not concretely wired. Don't promise per-fact backlinks today.

6. **CrossEncoderReranker** is opt-in behind `BRAIN_RERANKER_ENABLED`. Default off because of the 568 MB model. PM might see different memory citations after a flag flip — disclose changes when this lands.

7. **Stakeholder Pareto-bargaining** (Moat 6) — the engine ships the solver but it is not yet plumbed into the conversation pipeline. The "Cendra balanced stakeholders" copy is honest only when the engine actually consulted the solver.

8. **Behavior Trees** are in code (`py_trees`-backed) but the leaf-set covering M1-M25 is patent-defensible-but-not-yet-composed-end-to-end. Visualising BT execution is feasible for the demo property; not portfolio-wide.

9. **CalendarAutonomyGate** is wired but emits `DOWNGRADE` and `BLOCK` based on `CalendarEvaluator` feasibility. The gate's `_TIGHT_BUFFER_HOURS=6.0` and `_HIGH_SELLABILITY=0.7` are deliberately conservative defaults — PM may legitimately tune these. UI should expose them at the per-workflow level.

10. **Cleaner / vendor negotiation** (`brain_engine.negotiation`) has been ported into a `CleanerCoordinationFlow` (legacy) and is being rebuilt. The Negotiator + NegotiationSession exist but multi-round bargain conversations are best-effort, not bulletproof.

11. **PreferenceLearner follow-up questions** (preferences/learner.py) has hardcoded QUESTION_TEMPLATES per action type (`late_checkout`, `call_cleaner`, etc.) — limited inventory. The "Cendra asks 2 follow-up questions" UI must gracefully fall back when the action type has no template.

12. **Sandbox v2 PM Chat** (the regenerate flow) — only one regen happens per PM input. Multi-turn back-and-forth ("ask me 3 questions" sandboxing) is not in the pipeline.

13. **Smart Engine subsystems** (TaskLifecycleManager, CheckinGuideGenerator, ReportStore, VoiceMessageProcessor) — all wired but additive — *nothing reads them yet*. The UI must distinguish wired-but-unconsumed vs wired-and-active.

14. **Probabilistic identity merge** is opt-in via behavioural features (Jaccard ≥0.6, min 3 features). When a guest's identity is merged, the Confidence is Wilson LB on shared-feature count. Surface this in the cross-channel chip; don't show as fait accompli.

### 8.3 Outright contradictions / known-stale assumptions to scrub from the UI

1. **"AI" / "ML" / "model" labels** — banned in the engine's own copy. The product voice is "Cendra"; the engine calls itself the engine. UI must align.

2. **"Confidence 0.86"** — never shown. The engine's `compute_confidence` returns 4-decimal precision but `BRAIN_ENGINE_UX_ANALYSIS.md` is right that decimals must be bands.

3. **"Cendra learned this rule"** without PatternOrigin link — strictly false today. Every rule has an `origin` field with `foundation_scenario_ids`, `source_event_ids`, `contributing_signal_ids`. If you can't link, you can't claim learning.

4. **"Cendra always handles X autonomously"** — never. The structural NEVER_AUTO_LEARN floor (17 scenarios) + the 4 never-AI categories + per-tier hard rules mean *no decision is unconditionally automated*. The Trust → Safety surface must communicate this floor.

5. **"Cendra auto-updated your knowledge"** — strictly disallowed. PM-confirmed knowledge is PM-typed, never engine-rewritten. Foundation drift is a *suggestion*, not a write.

6. **"Same guest across channels"** — when the merge is probabilistic, must show "merged with confidence 0.81 because of: 4 shared behavioural features." When deterministic (email_hash or phone_hash), can be plain.

7. **"Cendra ran A/B"** — only when an actual `Experiment` exists with `min_trials_per_arm` reached. Verdict must say "based on 47 / 50 trials in arm A vs 49 / 50 in arm B."

8. **"Cendra dispatched the locksmith"** — only when the vendor channel acknowledged. Use NegotiationSession state machine; never claim acceptance before confirmed.

9. **"Cendra found a bug in your foundation"** (when surfaced via FL-13 drift) — must read "Cendra noticed you handle scenario S3-024 differently than the default — would you like to review?" NEVER "your foundation is wrong."

10. **"Cendra learned across all your properties"** — only when GlobalPatternMiner produced a `GlobalPattern` from ≥3 tenants. Otherwise the rule is per-property or per-customer; show scope explicitly.

11. **"Trust Meter 87%"** — the engine doesn't compute a single trust score. TrustMeterBand is per-workflow per-property with explicit CriteriaProgress. Portfolio-wide "trust" is a derived aggregate, not a primitive.

12. **"Cendra is in System-2 mode"** — only honest when `COGNITIVE_MODE_CHANGED` event fired with from=system1 to=system2 for this decision. Don't surface this on every decision.

13. **"Cendra read your handbook.pdf p.4"** — only when a `rag_hit` event was emitted with a verified source URL/page. Don't fabricate citations.

14. **"Cendra dispatched 4 vendors"** — verify with `OpsDecisionLogger.log_vendor_dispatch` records; don't infer from message texts.

15. **"Voice memo by Cendra"** — only when `LLMNarrativeRenderer` + `VoiceRenderer` (ElevenLabs) both succeeded. Show "voice generation paused, here's the text version" when ElevenLabs is unavailable, not a silent fallback.

---

## Appendix A: Key file paths (citation reference)

- §10 priority chain: `brain_engine/orchestrator/decision.py:101-117` (PriorityTier Literal + PRIORITY_TIERS); `brain_engine/orchestrator/priority_chain.py` (ExecutionOrchestrator walking the chain).
- Decision actions: `brain_engine/orchestrator/decision.py:117-150` (9 DecisionAction literals).
- Card action kinds: `brain_engine/cards/action_kinds.py:45-66` (16 CardActionKind values).
- Foundation orchestrator: `brain_engine/analysis/orchestrator.py` (the FL-16 entry point).
- Foundation catalog: `brain_engine/patterns/foundation_catalog_store.py` (FL-01 store); `brain_engine/patterns/foundation_registry.py` (parser); `brain_engine/patterns/foundation_update.py` (FL-13 drift); `brain_engine/patterns/foundation_customer_catalog.py` (FL-14 two-tier).
- TrustMeter: `brain_engine/autonomy/trust_meter.py` (TrustMeterService, TrustMeterBand, CriteriaProgress, Condition).
- Calendar gate: `brain_engine/autonomy/calendar_gate.py`.
- Decision pipeline gates: `brain_engine/decision_pipeline/adapter.py` (M19 — the gate-chain orchestrator).
- Approval gateway: `brain_engine/approval/gateway.py` (437 LOC — confidence routing + WhatsApp/Telegram).
- Escalation: `brain_engine/escalation/dispatcher.py` (EscalationDecision + dispatcher).
- Blockers: `brain_engine/blockers/engine.py` (435 LOC).
- Patents implementation map: `patents/IMPLEMENTATION_MAP.md` (one row per claim limitation).
- IETF I-D: `internet-drafts/draft-cendra-owner-policy-dsl-00.txt` (533 lines, RFC 5234 ABNF).
- Streaming events: `brain_engine/streaming/event_types.py` (36+ EventType values incl. MISSING_INFO_DETECTED, LEARNING_DECISION, COGNITIVE_MODE_CHANGED, REASONING_*, MEMORY_RETRIEVED, RAG_HIT, GUARDRAIL_CHECK).
- Emit helpers: `brain_engine/streaming/emit_helpers.py` (intent_classified, memory_retrieved, rag_hit, guardrail_check, cognitive_mode_changed, missing_info_detected, learning_decision).
- Conversation pipeline: `brain_engine/conversation/service.py` (~2700 LOC).
- Migrations: `infra/postgres-init/` (000-030 — 30 numbered SQL migrations).

## Appendix B: Useful raw counts

- Total commits on dev: **804**.
- Subpackages in `brain_engine/` with `__init__.py`: **90**.
- AG-UI event types in `streaming/event_types.py`: **36+** (lifecycle, text, tool, state, flow, slot, step, reasoning, sentiment, call, sandbox-v2, messages/meta).
- BRAIN_* env flags in production code (canonicalised): **30+** (see §5).
- Migrations under `infra/postgres-init/`: **23** (000-030 with gaps).
- Patents (USPTO-style drafts): **8** (1 system + 1 method + 1 CRM + 1-3 dependent claims each).
- Internet drafts: **1** (Owner-Policy DSL v0.1).
- Tests directories: **15** (ab_promotion, abstention, behavior_trees, certificates, cognition_loops, compliance, decision_pipeline, epistemic, htn, identity, integration, owner_policy, planner, property_twin, risk, scripts, seeder, stakeholders).
- AKS manifests: `deploy/{brain-engine-dev,brain-engine-prod,memory-smoke-job,postgres-cluster,postgres-migrations,qdrant}.yaml` + `kubernetes/observability/`.

## Appendix C: Themes consciously not-in-first-pass that this pass adds

1. PreferredSolver routing (5 solver classes — LLM/Utility/SMT/Deterministic/HITL).
2. Causal-tag axis (policy_setting vs one_off_exception).
3. manager_id dimension throughout.
4. kill_switch axis orthogonal to autonomy state.
5. Reversal source taxonomy + chargeback ingestion.
6. Pattern class taxonomy (5 classes — LEARNED_BEHAVIORAL / DETERMINISTIC_RULE / LIVE_BLOCKER / MANUAL_OVERRIDE / STATISTICAL_HEURISTIC).
7. Refusal taxonomy (5 RefusalType values multi-language).
8. Foundation customer tier (two-layer model).
9. Bi-temporal as_of for PmFactStore.
10. Behavior Trees as reactive layer complement.
11. ANN-backed embedding R-WoM (sklearn NearestNeighbors).
12. MAPIE-backed split-conformal calibrator (audit-grade variant).
13. Bayesian A/B promotion gate (Beta-Bernoulli Monte-Carlo).
14. Onboarding bootstrap audit log (11 EventKind, 16 SkipReason, Redis Streams 24h TTL).
15. Cross-replica BootstrapJobStore (Redis-backed multi-pod fix).
16. PG-backed PropertyProfileStore + PmFactStore + InterviewAnswerStore + AutonomyStore + CardStore + BlockerStore + ExperimentStore + DecisionCaseStore + PatternRuleStore (every store has a PG variant + InMemory + Protocol).
17. M19 DecisionPipelineAdapter — the operational seam composing 5 patent gates.
18. M22 Z3 verifier with SMT witness embedding.
19. M23 Bayesian promotion gate.
20. M24 split-conformal calibrator (proper Vovk-Gammerman-Shafer correction).
21. M25 Memory-Augmented Reflexion with friction multiplier kernel `exp(-α·|EMA⁻|·log1p(n))`.

---

## Appendix D: Older themes I now want on record (April 5 - April 22)

These are themes the first pass touched lightly or not at all that come up in the older third of the commit history:

### D.1 Phase 1 production hardening — Tool routing, evaluation adapters, memory extraction (April 14, `cbab2f7`)

The "Phase 1" sprint introduced what is now load-bearing:

- **Dynamic Tool Selection & Rationale**. Negative guidance ("when NOT to use") on all 9 conversation tool descriptions to cut false tool calls by 20-30%. Rationale requirement in system prompt — agent must state reasoning before each tool call.
- **Intent-to-tool domain mapping** (`brain_engine/intent_controller/domain_map.py`) — 3 tool groups (booking / guest / property) mapped to all 11 Intent categories. `get_tools_for_intent()` helper.
- **DeepEval adapters** — G-Eval criteria, Faithfulness (answer grounding), Hallucination detection (against facts), AnswerRelevancy. All implement Evaluator Protocol; lazy-import deepeval.
- **RAGAS adapters** — Faithfulness, ContextPrecision, ContextRecall. async via `asyncio.to_thread`.
- **Mem0 ExtractorService** — `ExtractedFact` (fact_id, content, fact_type, entity_id, confidence, source, extracted_at, keywords) + `MemoryUpdateResult`.

UX implication: The Decision Card "Evidence" slot can show "Cendra retrieved 2 facts from your knowledge base · 1 was rejected by the hallucination check." Multiple evaluators run on every response.

### D.2 b819e6f bundle (April 14) — major capability bundle pre-Sprint-1

In one commit:

- Intent-based tool filtering in ConversationService (9 → 3-4 tools per request).
- Three-tier guardrail pipeline with early exit (<10ms / 20-100ms / 500ms+).
- Three-section memory context layout (facts-first primacy bias).
- Confidence-based approval routing (HIGH auto / MEDIUM evidence / LOW escalate).
- Circuit breaker for LLM / Redis / Qdrant (CLOSED → OPEN → HALF_OPEN).
- `FactStore` with Qdrant-backed dedup (similarity > 0.92).
- NightlyConsolidator Mem0 extraction.
- Contradiction detection on fact write (vector search + LLM compare + temporal precedence).
- Composite rule engine with numeric conditions and behavioral branches.

The three-tier guardrail pipeline is critical — most products' guardrails are one tier (block or allow). Brain Engine is three tiers with early exit, so the typical PASS hits the cheap tier-1 in under 10ms.

### D.3 DecisionCase learning engine (April 14, `18fcc95`)

The April 14 "Cendra DecisionCase specification" commit is the foundational architecture commit. 4,818 lines across 11 files. Sets up:

- **DecisionCase** + **PatternRule** + 9 BookingStage + 21 Scenario types + DecisionType + ExecutionMode + RiskLevel + PatternScope.
- **CaseOutcome** with positive/negative signal detection.
- **BookingFeatures** (20 deterministic fields) + FeatureBuilder.
- **CaseBuilder** joins message + PMS + calendar + ops into DecisionCase with entity extraction (amounts, guest counts, dates, percentages) via regex.
- **DecisionCaseStore + PatternRuleStore Protocols** (DIP) with InMemory + Postgres.
- **PatternExtractor**.
- **PatternValidator** with 6 safety checks — min support, counterexample ratio, one-off exception detection, NEVER_AUTO_LEARN blacklist (legal, tax, security, evictions), staleness, empty conditions.
- **BlockerEngine** with 11 BlockerType values + 2 BlockerSeverity (soft/hard) + auto_detect_blockers.
- **CalendarEvaluator** — gap analysis + orphan night detection (≤2 nights) + sellability scoring + min-stay feasibility + early/late checkin/out feasibility (same-day turnover buffer check) + orphan night revenue valuation.
- **StaticityClassifier** with 4 StaticityLevel values + 36-field default table + auto-promotion on change frequency.

The first pass mentioned several of these — the 18fcc95 commit is the moment they all land together, and they all share one consistent data shape.

### D.4 BookingOrchestrator + ResponseRouter (April 7, `7db5661`)

Autonomous booking workflow — one POST to `/booking/new` triggers:
1. Contacts all registered cleaners via Telegram.
2. Waits 3 min for responses, parses Turkish keywords.
3. If multiple available → asks PMS (Can) to select via Telegram.
4. Retries PMS up to 3 times (2 min each).
5. Dispatches selected cleaner with access codes.
6. Waits for photos + `/done`.
7. Detects issues (broken TV, water leak) → contacts vendor.
8. Notifies PMS on completion.

UX implication: The runtime is fully built for autonomous multi-party coordination. The UX should expose the *state of any orchestrated workflow* — "Cendra is on step 3 of 8 for booking #4517."

### D.5 BotelLLM full parity port (April 8, `cbd0b81`)

192/192 BotelLLM items verified — 100% feature parity. The conversation pipeline gained:
- 8-stage pipeline (preprocess → classify → guardrails → prompt → agent → validate → postprocess → assemble).
- 9 ReAct conversation tools (RAG, availability, upsell, emergency, location, reservation, alternative, complaint, thanks).
- 6 OPS endpoints (generate-message, parse-reply, classify-issue, verify-message, parse-pm-instruction, pm-agent).
- 16 tone templates (default, friendly, formal, professional, natural + 11 property-specific).
- 18 BusinessFlags with LLM + keyword fallback (multi-language).
- 7-agent agentic rule creation (6-phase workflow).
- WhatsApp Channel Service (booking without property context).
- Custom Tone Generator (LLM-based from free text).
- RAG Indexer (conversation indexing + answer generation).
- Permission matrix + booking status prompt configurations.

This is the moment BotelLLM was absorbed; subsequent commits reference "BotelLLM-port" features that are now Brain Engine.

### D.6 Phase 1-3 Continual Learning (April 12, `df79781`)

- **Phase 1 Graphiti + FalkorDB** (later removed April 29). 26 tests covering adapter lifecycle, search, ingestion, error paths.
- **Phase 2 PM Correction Hook**. `KnowledgeSyncService` extracts correction facts from PM overrides + stores via Graphiti with confidence=0.95 + source=PM_Correction.
- **Phase 3 MIRA Auto-Approver**. Pure rule-based evaluator with `evaluate()`, `process_candidates()`, `preview_stats()`, `parse_red_flags()`. Step 6 of nightly_consolidator. 20 tests.

The MIRA path is still alive but doesn't surface in the first pass. It's a rule-based "should this AI suggestion be auto-approved?" classifier that gates between blocked flags and PM correction overrides.

### D.7 Botel PMS to FalkorDB migration (April 14, `251de57`)

Complete ETL pipeline migrating existing Cendra/Botel data into FalkorDB KG via Graphiti. Three sources: property info (`/api/Property/Get`, confidence=1.0 authoritative), Knowledge Base (`/api/KnowledgeBase/GetAll`, confidence=0.95), past conversations (`/api/Message/GetDetail`, confidence 0.5-0.9 via LLM extraction with structured JSON output). Architecture: `BotelDataFetcher` (async HTTP) + `ConversationFactExtractor` (LLM-based) + `GraphitiLoader` + `BotelToFalkorDBMigrator` orchestrator.

UX implication: This ETL is now retired (April 29 Graphiti removal). The data is in the PG decision_cases store, not the graph. UI should never imply graph-backed reasoning since the April 29 cutover.

### D.8 OpsDecisionLogger (April 19, `7d1b835`)

Closes the ops-autonomy learning loop. Four ops scenarios — `CLEANER_DISPATCH`, `VENDOR_DISPATCH`, `VENDOR_NEGOTIATION`, `QUALITY_ACCEPTANCE` — all under `BookingStage.OPS` with ops_snapshot keys so the extractor can learn ops-specific patterns. `OpsDecisionLogger.log_cleaner_dispatch / log_vendor_dispatch / log_vendor_negotiation / log_quality_acceptance` — each builds a DecisionCase with the right scenario + decision type + outcome.

UX implication: ops decisions are *first-class learnable patterns*. Cendra learns "this PM prefers vendor A over vendor B for plumbing on Cihangir House." Surface this in the Vendor Dispatch card.

### D.9 Negotiation orchestrator (April 19, `80f0c85`)

Channel-agnostic Negotiator orchestrator. Bounded multi-round negotiation loop. `NegotiationDecision` StrEnum: ACCEPT / COUNTER / REJECT. Deterministic decision rules: accept when both price and time pass, counter while rounds remain, reject once exhausted. Empty `target_time` disables time check; `None max_price` disables price check; unpriced counters fail when budget is set. Distinct reason codes for transport failures: `opening_send_failed`, `receive_failed`, `counter_send_failed`. Per-round logging through OpsDecisionLogger; COUNTER rounds are intentionally not logged (non-terminal — would pollute the learning signal).

UX implication: The runtime is truly conversational with cleaners + vendors. The Vendor Dispatch card should show a multi-round dialogue, not a one-shot send.

### D.10 Calendar prefetch + reservation context (April 28, `20f79b5` + `3c33a08`)

- `RATE_PLANS_WITH_CALENDAR_QUERY` for availability grounding. Per-night `price=<value> <currency>` in [CALENDAR AVAILABILITY] STRICT block in the system prompt.
- `ReservationContext` carries grounded reservation snapshot directly. Sandbox UI ships `reservation_context` (check_in/check_out/guest counts/channel/current_time) on every turn so PM Chat panel data and AI ground truth stay in sync.
- Strict anti-fabrication rules: AI must quote dates verbatim; defer when a field is missing instead of inventing dates.

### D.11 PM Correction loop closure

The cumulative impact across `2077951` (PmFactStore persistence) + `02e638d` (AG-UI persist from regenerate) + `f87b25c` (brain-flag dedup) + `482b023` (newest-first ordering) — closes the "wifi şifresini girdim, AI öğrenmedi" loop end-to-end. PM types correction in PM Chat → AG-UI handler routes to `regenerate_response` (which now calls `regenerate_with_knowledge`) → `_store_knowledge_update` persists to `PmFactStore` → next guest message reads PmFacts and gets the answer. The dedup ledger prevents re-flagging the same gap within 1h.

### D.12 Cendra UUID → propertyChannelId resolver (April 27)

A short-lived solution (`6280910` to `1a5292a`) where brain-engine resolved Cendra UUIDs to short channel ids on every request — then reverted because the UI does the mapping more efficiently with its existing authenticated session. Lesson: The PM-facing `property_id` carried in state is the *short* `propertyChannelId` (e.g. "323133"), not the Cendra UUID.

### D.13 Customer hierarchy memory (April 15, `1667688`)

`CustomerMemory` — Customer → Workspaces → Properties → Events hierarchy. Redis-backed sorted sets per customer + per property. Permanent stats preserved through TTL cleanup. 90-day default event retention. Key methods: `get_or_create_customer`, `register_workspace`, `register_property`, `record_event`, `recall_events`, `recall_recent`, `compute_stats`, `cleanup_old_events`, `build_customer_context`.

UX implication: The "Cendra knows your portfolio history" surface has a concrete data shape. "Customer: Tri-State Travels | Workspaces: 1 | Properties: 14 | PM preferences: friendly tone, allows pets with fee" is a real, queryable string.

### D.14 Property Auth0 M2M token + KB fallback (April 15)

Production data access switched from static user JWT to Auth0 Client Credentials (M2M). PMS direct property search as RAG fallback with keyword matching when both Azure Search and Qdrant unavailable. PMS Knowledge Base API (Cendra AI) fallback.

### D.15 Phase 6-7 property tests + benchmarks (April 29-30)

22 + 18 Hypothesis property tests across counterfactual, emotion, audit pack, traffic splitter, global patterns, dedup, replay, versioned procedural, booking cost, jailbreak classifier, prompt injection, redactor. Plus 5 + 6 pytest-benchmark scaffolds. Benchmark budgets:

- counterfactual 4-link chain < 100us
- emotion lexicon scan over ~1 KiB EN < 2ms
- AuditPackBuilder.append x50 + verify < 15ms
- DeterministicTrafficSplitter.assign < 50us
- GlobalPatternMiner.mine over 20 observations < 1ms
- prompt-injection classify, jailbreak classify, redact 5 spans, booking cost predict, 30-episode dedup, 8x record + replay

UX implication: There are real performance budgets per layer. Trust Center could expose "Cendra's hot path: p95 < 100ms for the classifier; < 500ms for the orchestrator" — a quantitative trust signal.

### D.16 Telegram orchestrator + workflows (April 6-7)

Chat-based vendor/cleaner workflows already exist with full Telegram integration:
- POST `/api/v1/cleaner/respond` (cleaner accepts/declines)
- POST `/api/v1/pms/select-cleaner` (PMS picks cleaner)
- POST `/api/v1/cleaner/report` (photos + damage report)
- POST `/api/v1/vendor/respond` (vendor accepts repair)
- GET `/api/v1/workflow/status/{id}` (full workflow state)

UX implication: PM has multi-party autonomous workflow infrastructure today. The UI should surface "active workflows" beyond conversations — these are running multi-step orchestrations.

### D.17 Phase 2 Owner Profile + §10 priority chain (April 23-25)

The §10 priority chain commits (the foundation of the first pass) shipped in this window. `c98022f` to `f3595da` (mid-April 22-23 CEN-XX tickets) introduced the OwnerFlexibilityProfile + PriorityComposer + §10 stages. Critical detail not in first pass: the `priority_composer_migration.md` doc maps each stage to a specific source — the priority chain is a hand-mapped data structure, not a heuristic.

### D.18 Reversal events ingest endpoint (April 22, `71032c3`)

POST `/api/v1/patterns/reversal-events` accepts Stripe chargebacks (Bookly.Pms) + OTA dispute / PM clawback events (BotelIntegration). Idempotent on `(source, source_event_id)`. Linkage: `ops_snapshot.reversed_case_id`. Only accepts 4 reversal `ResolutionType` values; rejects AUTO_RESOLVED / PM_APPROVED with 422.

UX implication: Trust → Quality Review can show "Cendra's decision was reversed 3× this month — 2 chargebacks, 1 OTA dispute, 0 PM clawbacks." This is real reverse-channel telemetry.

### D.19 Manager dimension + kill switch (April 22, `004c42b`, `a83cbb6`)

`manager_id` threaded through every DecisionCase. `manager_kill_switch` table — PM-wide vetoes on catastrophic scenario classes. `KillSwitchRearmRefused` exception with cool-down clock.

UX implication: Each PM has their own kill-switch override (orthogonal to autonomy state). The UI must distinguish per-workflow autonomy from manager-wide veto.

### D.20 Bootstrap audit log (May 12 PR A/B/C/D, already in §1.7 but worth emphasising)

The audit log is structurally richer than the first pass implied: 11 `EventKind` values + 16 `SkipReason` values + per-decision-point emit hooks (`_bootstrap_property`, `_process_one_conversation`, `_mine_and_store`, `_extract_per_scenario_and_store`, `_harvest_profile`).

UX implication: Daily Brain Report could include "Last night Cendra emitted 12,847 audit events from your portfolio (4,212 cases extracted, 1,328 skipped — top reason: PM-only thread)." Truly observable.

---

## Appendix E: Cards / Context tags / Action kinds — full vocabulary

The first pass mentioned 9 DecisionAction literals from orchestrator + glanced at CardActionKind. Full vocabulary:

### CardActionKind (16 values + per-kind ReversibilityTier)

From `brain_engine/cards/action_kinds.py:45-66`:

| CardActionKind | Group | ReversibilityTier | UI copy |
|---|---|---|---|
| SEND_MESSAGE | Communication | GREEN | Send draft |
| REQUEST_DOCUMENT | Communication | GREEN | Ask for document |
| CONFIRM_BOOKING | Booking lifecycle | RED | Confirm booking |
| CANCEL_BOOKING | Booking lifecycle | RED | Cancel booking |
| HOLD_FOR_REVIEW | Booking lifecycle | AMBER | Hold for review |
| BLOCK_DATE | Booking lifecycle | AMBER | Block date |
| APPLY_DISCOUNT | Pricing / negotiation | AMBER | Apply discount |
| COUNTER_OFFER | Pricing / negotiation | AMBER | Counter offer |
| CHARGE_FEE | Financial | RED | Charge fee |
| ISSUE_REFUND | Financial | RED | Issue refund |
| DISPATCH_VENDOR | Operations | AMBER | Dispatch vendor |
| RELEASE_CODE | Operations | RED | Release code |
| ESCALATE | Coordination | AMBER | Escalate |
| HANDOFF_TO_TEAMMATE | Coordination | AMBER | Handoff |
| MARK_RESOLVED | Bookkeeping | GREEN | Mark resolved |
| LOG_DECISION | Bookkeeping | GREEN | Log decision |

Each kind has `ACTION_KIND_DESCRIPTIONS[kind]` text in plain English describing what it does (`brain_engine/cards/action_kinds.py:70-170`).

### ContextTag (16 values, from `brain_engine/cards/context_tags.py:136`)

The complete ContextTag vocabulary mirrors the wireframe situational labels. First pass didn't list these.

### DecisionAction (9 values from orchestrator)

These are the *orchestrator's verdict*, distinct from CardActionKind:
- `ask` — clarifying question
- `approve` — proceed with the prepared action
- `deny` — refuse the request
- `charge` — initiate fee charge
- `quote` — provide a price quote
- `block` — pause / hold pending preconditions
- `escalate` — route to escalation chain
- `dispatch` — kick off operational workflow
- `fetch_live_data` — need live PMS / calendar read before deciding

UX rule: a Decision Card combines (1) orchestrator's DecisionAction + (2) UI's prepared CardActionKind. The two don't 1-to-1 map — `approve` could become CONFIRM_BOOKING (booking flow) or APPLY_DISCOUNT (pricing flow) or any of 16.

---

## Appendix F: SSE event types — complete inventory

From `brain_engine/streaming/event_types.py`. Total 36+ event types organized into 9 groups:

### Agent Run Lifecycle
- RUN_STARTED, RUN_FINISHED, RUN_ERROR

### Text Message Streaming
- TEXT_MESSAGE_START, TEXT_MESSAGE_CONTENT, TEXT_MESSAGE_END

### Tool / Action Execution
- TOOL_CALL_START, TOOL_CALL_ARGS, TOOL_CALL_END

### State Management
- STATE_SNAPSHOT, STATE_DELTA, STATE_UPDATED

### Flow / State Machine
- FLOW_STARTED, FLOW_STATE_CHANGED, FLOW_COMPLETED, FLOW_ERROR

### Slot Filling
- SLOT_FILLED, SLOT_REQUESTED, SLOT_CLEARED

### Step / Progress
- STEP_STARTED, STEP_COMPLETED

### AI Reasoning (the cognitive trace surface)
- REASONING_START, REASONING_STEP, REASONING_END
- ACTION_STARTED, ACTION_COMPLETED
- INTENT_CLASSIFIED
- MEMORY_RETRIEVED
- RAG_HIT
- GUARDRAIL_CHECK
- COGNITIVE_MODE_CHANGED

### Sentiment / Guest Analysis
- SENTIMENT_UPDATE, GUEST_STATUS_UPDATE

### Call Events (voice)
- CALL_STARTED, CALL_ENDED, CALL_TRANSCRIPT_UPDATE

### Sandbox v2 Learning Pipeline
- MISSING_INFO_DETECTED — `{question, missing_information, source_field}`
- LEARNING_DECISION — `{surprise_score, should_memorize, memory_strength, fact_type, decision}`

### Messages / Meta
- RAW_MESSAGE, CUSTOM

UX implication: The "show Cendra's thinking" expandable trail on Decision Card and ASK CENDRA panel can render REASONING_START → REASONING_STEP* → REASONING_END as a numbered step list, with MEMORY_RETRIEVED + RAG_HIT + GUARDRAIL_CHECK + COGNITIVE_MODE_CHANGED interspersed. Already wired in `streaming/emit_helpers.py:31-138`.

---

## Appendix G: Bootstrap modules — what lifespan owns

From `api_server/bootstrap/` (R1-R18 SRP refactor):

| Bootstrap module | Wires | Sync/async | Domain |
|---|---|---|---|
| autonomy.py | AutonomyEngine + TrustMeterService + PgAutonomyStore | async | V2 Autonomy + Trust Meter |
| collab.py | CardStore + MentionStore + HandoffStore + configure_card_deps + configure_team_deps | async | V2 collaboration |
| decision_case.py | DecisionCaseStore + dual-write wiring | async | Pattern learning |
| elevenlabs.py | ElevenLabsClient | sync | Voice |
| evidence.py | EvidenceService + PromptAggregator + 4 evidence adapters | async | Decision evidence |
| experiments.py | ExperimentStore + ExperimentRegistry + warm_from_store | async | A/B testing |
| interview.py | InterviewAnswerStore + InterviewEngine | async | PM interview |
| memory.py | MemorySystem (7-tier) | async | Cognitive memory |
| narrative.py | NarrativeService + 3 timeline sources + voice + LLM renderer | sync | Property timeline |
| negotiation.py | NegotiationSessionManager + VendorChannelRegistry | sync | Vendor dialogue |
| onboarding.py | Archive loader + OnboardingService + ProfileHarvester | sync | V1 onboarding bootstrap |
| ops_logger.py | OpsDecisionLogger | sync | Ops decision audit |
| pattern_rule.py | PatternRuleStore + PatternRuleRouter | async | Pattern learning |
| reasoning.py | CausalNavigationService + NightlyScheduler | sync | Background reasoning |
| telegram_bot.py | TelegramBot + handlers | sync | Telegram integration |
| unified_data.py | UnifiedDataGraphQLClient + workspace identifiers | sync | Live data plane |
| voice.py | VoiceTranscriber + SandboxReadinessService + configure_interview_deps + configure_profile_deps | sync | Voice transcription + sandbox |

Each bootstrap module returns a tuple of (instance, close_fn?) so lifespan can await closes on shutdown. Module globals (`_X`) remain the source of truth for downstream readers; `application.state.X` is set additively for future DI migration.

UX implication: When a feature is "down", the engine knows *which bootstrap module* is unreachable. Trust Center status page could read: "Autonomy: ✓ Wired ✓ Healthy / Narrative: ✓ Wired ✗ ElevenLabs unreachable / Voice: ✗ Not wired (no OPENAI_API_KEY)." Honest, per-domain.

---

## Appendix H: AKS Postgres migrations 000-030

From `infra/postgres-init/`:

| File | What |
|---|---|
| 000_extensions.sql | pgvector, pg_trgm, uuid-ossp |
| 001_init.sql | decision_cases, pattern_rules, zfs_blocks, zfs_pointers, zfs_snapshots, guest_memories, interactions |
| 002_blockers.sql | blockers + partial indexes (active=NULL filtered) |
| 003_workflow_autonomy.sql | per-(property, workflow) autonomy state |
| 004_interview_answers.sql | PM Q&A answers |
| 005_decision_cards.sql | V2 decision card store |
| 010_event_sequencer.sql | cross-source event ordering |
| 011_unanswered_threads.sql | sandbox v2 |
| 012_property_profiles.sql | property profile cache |
| 013_property_pm_facts.sql | PM-typed knowledge |
| 014_owner_flexibility_profiles.sql | OwnerFlexibilityProfile + bi-temporal version |
| 015_orchestrator_verdict.sql | priority composer outcome log |
| 020_ab_experiments.sql | A/B framework |
| 021_pattern_rule_bitemporal.sql | invalid_at + deactivated_at on PatternRule |
| 022_decision_case_archived.sql | soft archive |
| 024_scenario_foundation.sql | per-property feature importance |
| 025_evaluation_results.sql | GoldenCases per-run + per-case verdicts |
| 026_foundation_scenarios_reactive.sql | FL-01 catalog |
| 027_foundation_scenario_id.sql | FL-03 bridge |
| 028_pattern_origin.sql | FL-12 origin JSONB + GIN partial indexes |
| 029_foundation_update_candidates.sql | FL-13 drift backlog |
| 030_foundation_scenarios_customer.sql | FL-14 customer tier |

UX implication: A 22-table data model is the truth backing every visible card. Trust → Data → Schema view could expose "Cendra stores 22 tables for your portfolio" with row counts.

---

## Appendix I: Engine surfaces relevant to UI — additional ones

A few more that didn't make Section 6 of the original audit because I learned about them only in the older commit chunks:

### I.1 `/api/admin/memory/timeline?with_causal=true`

Attaches a serialised causal_graph to `narrative.meta`. Fail-open on any build error — timeline still returns. From `0515078`.

### I.2 `/api/memory/property/{id}/causal?format=csv`

Two-section CSV (events, blank line, edges) discriminated by `row_type` column. Analytics tools ingest one stream.

### I.3 `/api/memory/property/{id}/causal/walk?event_id=X`

Returns chains-only for an anchor event. Companion to full graph endpoint — keeps UI follow-up calls small.

### I.4 `/api/v1/processes`

Active processes — booking, ops events, guest messages (emergencies, complaints, maintenance) create trackable active processes. From `4ba7c29`.

### I.5 `/api/v1/cleaner/respond` + `/api/v1/pms/select-cleaner` + `/api/v1/cleaner/report` + `/api/v1/vendor/respond` + `/api/v1/workflow/status/{id}`

Multi-party workflow endpoints — full cleaner dispatch + photos + damage report + vendor coordination from April 6-7.

### I.6 `/api/v1/booking/new`

Triggers full autonomous workflow with `BookingOrchestrator` — Telegram contact, response parsing (Turkish keywords), PMS selection, dispatch, photo wait, damage detection.

### I.7 `/api/v1/upsell/evaluate`

Evaluates 4 Cendra upsell types (Early Check-in, Late Check-out, Gap Night, Late Check-in) with per-hour pricing + alternative time slots. Per-property pricing overrides via `property_config` dict.

### I.8 `/api/v1/analytics/sentiment` + `/escalations` + `/accuracy`

3 dashboard metrics:
- weighted sentiment (positive=8.0, neutral=5.0, negative=2.5) → 5 labels
- escalation breakdown across 21 Scenario→category mappings
- per-property AI acceptance rate

### I.9 `/api/v1/rules/create-from-nl`

PM describes rule in plain text → LLM (GPT-4o, json_object mode) parses into structured CompositeRule with condition + true/false behaviors. Returns rule for PM review before activation — never auto-activates.

### I.10 `/api/v1/regenerate-pm-knowledge` + AG-UI `state.pm_input` branch

Two entry points for PM Chat correction:
- REST endpoint for standalone use.
- AG-UI `state.pm_input = {question, answer}` branch on POST `/` (sandbox v2).

Both persist to `PmFactStore` and regenerate the guest reply.

---

## Appendix J: Final scoreboard — "what the engine actually does today"

Brain Engine on `dev` HEAD (2026-05-14, commit `3697e5a`):

| Subsystem class | Capability count | Production-ready | Wired but flag-gated | Skeleton-only |
|---|---|---|---|---|
| Memory tiers | 7 (Working/Episodic/Semantic/Procedural/KG/Surprise/Metacognition) | 7 | 0 | 0 |
| Memory advanced | 5 (Mem0/FactStore/ContradictionDetector/EpisodicDedup/DeterministicKGSync) | 1 (KG sync default ON) | 4 | 0 |
| Foundation Layer (FL-01..FL-16) | 16 | 16 (data layer) | 6 (W2/W4/W7 wirings) | 0 |
| Moats (M1..M25) | 25 | 25 (all in code) | 0 | 3 deferred (DreamerV3 / Anthropic Auto Dream / real-env GRPO) |
| Sandbox v2 | (MISSING_INFO_DETECTED + LEARNING_DECISION + regenerate branch + dedup ledger) | 4 | 0 | 0 |
| Card kinds | 16 CardActionKind + 16 ContextTag | 32 | 0 | 0 |
| Orchestrator DecisionActions | 9 | 9 | 0 | 0 |
| Priority Chain tiers | 6 | 6 | 0 | 0 |
| Blocker types | 11 | 11 | 0 | 0 |
| Booking stages | 9 | 9 | 0 | 0 |
| Scenarios | 469 (core) + N customer | 469 | 0 | 0 |
| BookingFeatures | 20 + 5 temporal | 25 | 0 | 0 |
| Compliance checks | 5 (registration_id, HITL, GDPR Art.22, jurisdiction min_nights, never_ai) | 5 | 0 | 0 |
| Never-AI categories | 4 (SCREEN_BY_PROTECTED_CLASS, GDPR_ART22_AUTONOMOUS_DENY, LEGAL_RESPONSE_NO_HUMAN, MEDICAL_ADVICE) + 17 NEVER_AUTO_LEARN | 21 | 0 | 0 |
| Escalation tiers | 5 | 5 | 0 | 0 |
| Pattern classes | 5 (LEARNED_BEHAVIORAL / DETERMINISTIC_RULE / LIVE_BLOCKER / MANUAL_OVERRIDE / STATISTICAL_HEURISTIC) | 5 | 0 | 0 |
| Refusal types | 5 | 5 | 0 | 0 |
| Reversal sources | 7 | 7 | 0 | 0 |
| Resolution types | 12+ (incl. 4 reversal types) | 12+ | 0 | 0 |
| Decision types | 14 (incl. MODIFY_BOOKING, REFUND, CLAIM, DEFER) | 14 | 0 | 0 |
| Causal tags | 3 (policy_setting, one_off_exception, unclear) | 3 | 0 | 0 |
| Identity channels | 8 | 8 | 0 | 0 |
| Match evidence kinds | 4 (email_hash, phone_hash, passport_hash, behavioural) | 4 | 0 | 0 |
| Planner styles | 12 (6 base + 6 situational) | 12 | 0 | 0 |
| PreferredSolvers | 5 (LLM / Utility / SMT / Deterministic / HITL) | 5 | 0 | 0 |
| AutonomyTiers (certs) | 5 (OBSERVER / APPROVER / CONSULTANT / COLLABORATOR / OPERATOR) | 5 | 0 | 0 |
| AutonomyStates (engine) | 3 (OBSERVE / SEMI_AUTO / AUTOPILOT) | 3 | 0 | 0 |
| AG-UI SSE event types | 36+ | 36+ | 0 | 0 |
| Bootstrap event kinds | 11 | 11 | 0 | 0 |
| Skip reasons | 16 | 16 | 0 | 0 |
| Workflow kinds | (resolved from WorkflowKind StrEnum) | TBD count | 0 | 0 |
| Locale-aware refusal extractor | 4 languages (TR/EN/RU/ES) | 4 | 0 | 0 |
| Decision pipeline gates | 5 (Compliance / Cert / Abstention / Risk / Compliance NEEDS_REVIEW → Art.12 audit) | 5 | 0 | 0 |
| Postgres migrations | 22 (000-030 with gaps) | 22 | 0 | 0 |
| Bootstrap modules (R1-R18) | 18 | 18 | 0 | 0 |
| Patents | 8 (USPTO + IETF I-D) | 8 drafts | 0 | 0 |

That's a wide, deep capability surface. The UI's job is not to expose all of this — it's to translate it into 4-5 mental models the PM can hold in their head while trusting the rest.

End of audit.

