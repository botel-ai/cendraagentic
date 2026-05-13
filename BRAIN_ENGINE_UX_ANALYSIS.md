# Brain Engine → Cendra UX Analysis

**Source repo:** `https://book-ly@dev.azure.com/book-ly/bookly/_git/brainengine` (branch `dev`, commit `3697e5a`)
**Date:** 2026-05-14
**Author:** principal product engineer / agentic UX architect (this conversation)

---

## 0. Method

I cloned `dev` (200 commits deep) and inspected (1) recent merge PRs with their bodies, (2) module `__init__.py` files which contain authoritative architectural prose, (3) `CLAUDE.md` for runtime context, (4) `agent.py` + `orchestrator/decision.py` + `cards/` + `autonomy/` + `approval/` + `blockers/` + `memory/` + `streaming/event_types.py` + `narrative/` + `planner/` + `preferences/` + `escalation/` + `evaluation/`.

The commit bodies are the most valuable artifact — they read like architecture notes. Sprint 6 "FL-XX" series and the "Moats M1–M24" series describe the system's product-relevant capabilities better than any docs/ folder.

This analysis is **product-mind**, not engineering-mind. I do not propose endpoint contracts, sprint tickets, or implementation order.

---

## 1. What Brain Engine actually is (in plain product language)

Brain Engine is **not** an AI inbox or a chatbot. It is a cognitive runtime that:

1. **Observes** every operational signal across reservations, conversations, vendors, owner inputs, PMS events.
2. **Classifies** each event against a 469-scenario **Foundation Layer** catalog (the 9-stage hospitality scenario taxonomy — Pre-booking → Internal/Vendor).
3. **Walks a 6-tier priority chain** to pick a single Decision per turn (manual → blocker → safety → learned → preference → ask).
4. **Records** every decision as a `DecisionCase` with full evidence + Art.12 audit record.
5. **Learns** repeated PM behaviour as `PatternRule`s — only within scopes the Foundation says are safe to learn.
6. **Routes memory** writes across Working/Episodic/Semantic/Procedural/KG tiers, foundation-driven.
7. **Promotes/demotes autonomy** per workflow per property using a 3-state engine (Observe → Semi → Autopilot) with metrics-driven `PromotionGate`, `CalendarAutonomyGate`, and 5-tier signed certificates.
8. **Detects drift** nightly when PM overrides cluster around a foundation scenario → emits `FoundationUpdateCandidate`.
9. **Streams everything** to the UI over AG-UI SSE — including reasoning steps, memory retrievals, guardrail checks, sentiment updates, cognitive-mode switches (System-1/System-2).

Operational seam that ties this together: `DecisionPipelineAdapter` (M19) runs the gate chain — ComplianceMonitor → AbstentionGate → RiskGate → CertificateVerifier — and emits an Art.12 record only on PROCEED. This is the formal "Cendra checked, Cendra allowed" certificate.

---

## 2. The §10 Priority Chain (the single most important UX concept)

```
priority chain (highest beats lowest):

1. MANUAL       — explicit immutable PM/owner rule
2. BLOCKER      — live operational blocker (cleaning unconfirmed, payment unresolved, integration degraded)
3. SAFETY       — deterministic safety rule (never auto charge, never auto release access code, never auto refund)
4. LEARNED      — high-confidence PatternRule mined from PM history (gated by FL-05)
5. PREFERENCE   — owner preference learned from approval decisions
6. ASK          — low-confidence → clarifying question
```

Execution modes: `auto · ask · approval · block`.

Decision actions: `ask · approve · deny · charge · quote · block · escalate · dispatch · fetch_live_data`.

**Why this matters for UX:** every "Why did Cendra do this?" question maps to one of these six tiers. The Decision Card's WHY drawer should structurally walk these six tiers in order, showing which one fired. Today our UI uses a free-form reasoning list — it should use the priority chain as the spine of the explanation.

Source: `brain_engine/orchestrator/decision.py`, `brain_engine/orchestrator/priority_chain.py`.

---

## 3. Foundation Layer (FL-01..FL-16) — the soul of the product

The Foundation Layer is what makes Cendra hospitality-native instead of a generic LLM agent.

| FL slug | What it does | Where it surfaces in UI |
|---|---|---|
| **FL-01** | 469-scenario catalog with 14 structured fields each (Trigger, Signals, Risk, AI Default, Required Data Checks, Should Auto-Reply, Should Escalate, Should Learn Pattern, Memory Type, …) — the sectoral knowledge | Property Brain "Scenario coverage" card. Today: shown as a generic progress bar; should expose stage-by-stage |
| **FL-03** | `foundation_scenario_id` bridge on every DecisionCase + PatternRule — every action knows which scenario it's solving | WHY drawer caption: "This is scenario S3-024 · Same-night booking from zero-review guest". Today: not exposed at all. |
| **FL-04** | Memory-tier routing — 13 memory-type slugs → Episodic/Semantic/KG fan-out (foundation, not LLM, decides) | Invisible to user — but the *consequences* show up: "Cendra will remember this for future guests" vs "for this stay only" |
| **FL-05** | Safety gating — `Should AI Auto-Reply: No` forces draft/escalate; `Should AI Learn Pattern: No` blocks PatternMiner | "Pinned to Never Auto · safety scenario" badge. Today: shown as `autonomy: "never"` but not tied to scenario id |
| **FL-06** | §5 signal-weight ontology in confidence — each scenario has weighted signal categories that compose confidence | Confidence chip on Decision Card should be backed by signal breakdown. Today: shown as a flat 0.91 |
| **FL-07** | Source reliability hierarchy + workflow freeze threshold — `Owner > PM > Cleaner > Listing > Guest claim`; when contradictions accumulate, workflow freezes | Conflict resolver source ordering. "Workflow frozen because…" status on Autopilot row |
| **FL-12** | `PatternOrigin` trail + `/rules/{id}/origin` — every rule shows which DecisionCases birthed it | "Cendra learned this from 4 of your edits in the last 14d" with links to those cases |
| **FL-13** | Foundation update feedback loop + drift detector — nightly, when PM overrides cluster against a scenario, emit `FoundationUpdateCandidate` with severity | Daily Brain Report / Learning Suggestions: "I notice you handle X differently than the default. Update your foundation?" |
| **FL-14** | Customer-facing foundation tier — PM rules land in their own foundation layer on top of the 469 baseline | Property Brain shows "Standard scenarios (469) + Your additions (N)" |
| **FL-15** | Iterative clarifying questions during rule discovery — Cendra asks PM about Required Data Checks they haven't specified | "Cendra needs to ask 3 things before publishing this rule" — embedded in the playbook builder |
| **FL-16** | Foundation Analysis Orchestrator — pipeline contract | Invisible — but ensures every decision routes through the foundation lens |

**The foundation is the product's moat.** The UI must make PMs feel "Cendra speaks hospitality" — not "Cendra is a smart LLM I configure."

---

## 4. Capabilities not yet expressed in our current UI

| Brain Engine capability | Source | Currently in UI? | What's missing |
|---|---|---|---|
| **TrustMeter band + CriteriaProgress** (`autonomy/trust_meter.py`) | `TrustMeterService` projects autonomy state into a UI band with explicit per-criterion progress toward the next state | No | Autopilot screen should show a Trust Meter band per workflow with "needs 12 more low-risk reversible cases to reach Autopilot" copy |
| **CalendarAutonomyGate** (`autonomy/calendar_gate.py`) | Re-validates earned engine state against current calendar reality for calendar-dependent workflows (orphan-night, early/late checkout) | No | "Cendra would auto-promise early check-in here, but calendar shows same-day turnover → demoted to Approval for tonight" |
| **CognitiveModeChanged event** (`streaming/event_types.py`) | System-1 fast vs System-2 slow dual-process toggle | No | Subtle indicator: "Cendra is thinking carefully about this" when System-2 engages on risky decisions |
| **SurpriseDetector** (Titans) | Memory module that prioritizes unusual events | No | "Cendra flagged this as unusual" badge on guest journey when surprise score is high — distinct from generic alerts |
| **AbstentionGate (M1)** | Bi-temporal Wilson + Conformal Abstention — the "I don't know" gate | No | "Cendra abstained because confidence is below threshold for this scenario" — different copy from "approval required" |
| **EscalationTier 5-state** (`escalation/__init__.py`) | 5 canonical tiers with target role + response window + fallback tier | Partial | Today/Work cards should show explicit escalation tier chip: "PM Tier 2 · 15 min window · falls back to On-call" |
| **GoldenCasesRunner** (`evaluation/golden_cases_runner.py`) | Nightly quality review against curated golden cases | No | Daily Brain Report should include "Cendra passed 47 of 50 golden cases overnight · 3 regressions reviewed" |
| **NarrativeService** (`narrative/`) | Property-timeline narration — text/voice renderers, unified sources, ownership-aware | No | Stay Detail and Property Brain should be a rendered *narrative* in Cendra's voice, not a table view |
| **PlannerStyleId** (`planner/styles.py`) | 6 situational styles (Moat #11) — tone/style library | No | Owner profile / property posture: "Cendra uses the *Boutique* style on Cihangir House" |
| **OwnerPolicy DSL (M2)** + **Z3 SMT verifier (M22)** | Formal owner-rule language with theorem-prover verification of consistency | No | Rule creation: "Cendra verified your new rule against the 7 existing owner rules — no contradictions" |
| **EpistemicBelief / bi-temporal provenance (M7)** | Observation/belief schema with valid-time + transaction-time | No | Property Brain fact provenance should show "true since 2026-03-12, last verified 2026-05-09" |
| **CrossChannelGuestIdentity (M8)** | Same guest across Airbnb + Booking + SMS + WhatsApp | Partial (cross-channel chip exists on threads) | Guest profile should show unified identity card: "This guest reached you on 3 channels for the same stay" |
| **PreferenceLearner** (`preferences/`) | Learns owner rules from approval decisions via follow-up questions | No | After every approval: "Cendra wants to ask 2 follow-up questions to make this an automatic rule next time" |
| **Reflexion Critic + Friction tracker** (cognition_loops) | Cendra self-critiques and tracks friction with PM | No | Daily Brain Report: "Where Cendra slowed you down today — drafts you edited heavily, approvals you escalated" |
| **AGUIEmitter events** (REASONING_START/STEP/END, MEMORY_RETRIEVED, RAG_HIT, GUARDRAIL_CHECK) | Realtime cognitive trace | No | "Show Cendra's thinking" expandable section in Decision Card — optional, but builds trust |
| **WorkflowKind taxonomy** + canonical resolver | Brain has a *canonical* workflow taxonomy mapping events to workflow kinds | Partial | Autopilot rows should be authoritative workflow names, not our hand-written 7 |

---

## 5. Deliverable 1 — Brain Engine Product Capability Map

| Capability | What it really means for PM | User-facing concept | UI surface | Hide from user | UX risk if shown wrong |
|---|---|---|---|---|---|
| `DecisionCase` (orchestrator + cards) | "Cendra recorded why every decision was made — replayable" | **Decision** + **Audit Event** | Stay Detail timeline, Brain → Trust → Audit, Decision Card's WHY drawer | Raw `decision_id`, gate trace internals | "AI black box" — must always feel traceable |
| §10 Priority Chain | "Cendra walked the rules from top to bottom and the first one that matched won" | The skeleton of WHY | WHY drawer in every Decision Card | Tier internals, resolver source | Saying "AI invented this" |
| `PatternRule` + PatternOrigin (FL-12) | "Cendra noticed how you handle this and proposes a rule — here are the 4 cases that taught it" | **Learning Suggestion** / **Playbook Candidate** | Brain → Learning, Decision Card "Cendra learned from your edits" hint | Rule mining internals, vector ops | PM feels AI is inventing global rules |
| Approval Gateway + ConfidenceTier | "Cendra knows this needs human permission — and at what confidence band" | **Decision Needed** | Work queue, Stay Detail action panel, mobile push | Confidence Tier names verbatim; PM sees "Needs approval because…", not "Tier: MEDIUM" | PM feels AI is blocked randomly |
| `Blocker` + BlockerEngine | "Cendra paused because a precondition isn't met" | **Task / Dependency** ("Automation paused because…") | Stay Detail, Autopilot row state | Raw `BlockerType` enum values | "AI is broken" perception |
| `AutonomyEngine` + TrustMeter (autonomy/) | "Cendra has earned the right to handle X workflow on autopilot — or it hasn't" | **Autopilot State** + **Trust Meter** | Brain → Autopilot, Stay Detail posture card | KPI definitions, signed cert HMACs | "AI does whatever it wants" |
| `CalendarAutonomyGate` | "Cendra would auto-handle this, but the calendar made it risky tonight" | **Operational Dependency** on a Decision Card | Inline on Decision Card; also visible on Stay Detail | Gate internals | "Why is Cendra suddenly asking me?" without context |
| Foundation Catalog (FL-01..16) | "Cendra is hospitality-trained — here are the 469 situations it knows, and how many you've covered" | **Scenario Coverage** | Property Brain detail | Scenario IDs in PM-facing copy (only show in WHY drawer) | Feels like generic LLM if hidden completely |
| FL-13 Foundation Drift | "Cendra noticed you handle X differently than the standard — propose update?" | **Learning Suggestion** with foundation badge | Daily Brain Report, Brain → Learning | Severity thresholds, drift math | PM feels AI is criticizing them |
| FL-05 Safety Gating | "These scenarios are pinned to human only, no matter how often you do them" | **Pinned to Never Auto** badge | Decision Card, Autopilot row | Foundation safety rule internals | Feels arbitrary if not explained as "safety" |
| FL-07 Source Reliability + Workflow Freeze | "Cendra paused this workflow because too many contradictions accumulated" | **Risk Detected** ("workflow frozen") | Autopilot row, Daily Brain Report | Threshold math | Looks like a bug |
| Memory tiers (Working/Episodic/Semantic/Procedural/KG) | "Cendra remembers different kinds of things differently — facts forever, events for the stay, procedures as learned habits" | **Property Fact** (Semantic), **Stay Activity** (Episodic), **Playbook** (Procedural), **Knowledge Gap** (KG) | Property Brain, Stay Detail timeline, Brain → Playbooks | Tier names, decay curves, vector params | Feels like a CRM if collapsed flat |
| SurpriseDetector (Titans) | "Cendra flagged this as unusual" | **Risk Detected** with subtle "unusual" tag | Today, Work, Stay Detail | Surprise score math | Cried wolf — must be sparing |
| AbstentionGate (M1) | "Cendra abstained — confidence below threshold for this scenario" | Distinct **Decision Needed** sub-type: "Cendra is unsure" | Decision Card, Work queue | Wilson interval / conformal score | PM feels AI gave up |
| `MissingInfoDetected` event | "Cendra hit a gap — guest asked something it doesn't know about your property" | **Knowledge Gap** card | Property Brain attention queue, Today | Vector search miss internals | "AI doesn't know my property" feels bad if framed wrong |
| ContradictionDetector | "Two sources of truth disagree — please resolve" | Conflict card on Property Brain | Property Brain attention | Internal contradiction matching | Feels nitpicky if minor |
| Approval Gateway WhatsApp/Telegram routing | "Cendra can send the approval ask to the owner on WhatsApp" | **Approval Needed → Send to owner** action | Approval flow, owner profile | Routing internals | Owner missing approvals if invisible |
| `EscalationDispatcher` (5 tiers) | "Cendra knows who to wake up at 03:00 for what" | **Escalation Tier** chip on critical cards | Today, Work, Stay Detail | Internal target_role enum | Feels chaotic if not explicit |
| `GoldenCasesRunner` (evaluation/) | "Cendra ran a quality review overnight" | **Quality Review** item in Daily Brain Report | Brain → Trust, Daily Brain Report | Test runner internals | Feels like dev tooling if shown raw |
| `NarrativeService` (narrative/) | "Cendra tells you the property's story" | Stay Detail + Property Brain narration | Both surfaces | Rendering pipeline | Bland tables — currently this is the gap |
| AG-UI SSE events (REASONING_*, MEMORY_RETRIEVED, RAG_HIT) | "You can see what Cendra is doing right now if you want" | Optional reasoning trail | Decision Card expandable, ASK CENDRA answered panel | Event names, raw payloads | Too much detail = looks like dev console |
| PlannerStyleId (Moat #11) | "Cendra speaks in a tone that matches the property/owner" | **Style** chip on property posture | Property Brain, owner profile | Style spec internals | Owner thinks Cendra sounds wrong on their property |
| OwnerPolicy DSL + Z3 verifier (M2, M22) | "Cendra checked your new rule against existing rules and verified no contradictions" | Verification badge on new rule | Brain → Playbooks (rule creation), Trust | DSL syntax, SMT solver output | "AI just creates rules" — must show verification |
| EpistemicBelief / bi-temporal (M7) | "Cendra knows when a fact became true and when it last confirmed it" | Fact freshness + provenance | Property Brain fact row | Bi-temporal semantics | Stale facts trust-broken |
| CrossChannelGuestIdentity (M8) | "Same guest, three channels — Cendra merged the thread" | **Cross-channel** chip on messages, unified guest card | Stay Detail conversations, guest profile | Identity graph internals | Mistaken merges if shown raw |
| PreferenceLearner (preferences/) | "Cendra asks 2 follow-ups after every approval to learn your preference" | **Approve + Teach Cendra** flow | After every approval | Learner internals | Feels like an interrogation if frequent — must be optional |
| Reflexion Critic + Friction tracker | "Where Cendra slowed you down today" | **Where I friction'd you** card in Daily Brain Report | Daily Brain Report | Critic prompts | Self-critical to a fault — keep tight |
| Continuous compliance monitor (M10) + EU stack (M5) | "Cendra is compliant with EU AI Act art.12/50" | Trust posture badge | Trust Center | Regulation names verbatim (PM doesn't care) | Compliance theatre vs trust |

---

## 6. Deliverable 2 — Current UX Fit Assessment

Scoring: 1 = barely starts; 3 = correct direction but underexpressed; 5 = matches the engine's intent.

| UX area | Fit | What works | What's missing | Recommended change |
|---|---|---|---|---|
| **Today (Morning Brief)** | 4 | One-hero priority + collapsed digests + sticky CendraBar matches the "exception-first" intent; serif briefing reads like an agent | Six card types not yet canonical; no "Cendra handled" digest visible; no Daily Brain Report ingress | Add **Cendra-handled-overnight** row + first-class **Daily Brain Report** card; route hero into the 6 canonical types |
| **Guests (Stays)** | 3 | Journey-stage grouping is right; per-guest briefing is hospitality-native | "Stay Health" is implicit (status chip), not a first-class object; no operational dependencies surfaced | Rename Guests → **Stays**; promote a single **Stay Health** badge (Healthy / Needs attention / At risk / Critical / Closed); surface open Promises + Dependencies inline |
| **Guest Journey detail** | 4 | Three-tab Conversations panel + briefing + cards is excellent; provenance via channel chips is on-brand | No **Promise** object; no **Operational Dependency** card type; AI reasoning trail not exposed | Add Promise + Dependency cards alongside Decision/Risk/Opportunity; collapsible "Cendra reasoning" optional trail |
| **Work queue (Guests page)** | 3 | We don't have a dedicated Work screen — Guests doubles as it | Six canonical card types missing as a *taxonomy*; no aggregated cross-stay view | Spin out a real **Work** route. Six card types as filters: Decision Needed · Risk Detected · Promise Open · Task/Dependency · Opportunity · Learning |
| **Properties (list)** | 4 | Top blocker hero + portfolio intelligence strip + import knowledge is on the right path | Scenario coverage shown only at portfolio level not at per-property granularity in the list | Surface per-property scenario coverage % in the property row |
| **Property detail** | 4 | Per-property scenario coverage + sources + editable facts + conflict resolver matches FL-01/12/13 intent | No bi-temporal fact provenance (M7); no "Cendra cannot answer this automatically" flag; no style chip; no calendar gate visualization | Add freshness pair (since/last-verified), per-fact "answerable automatically?" lock, owner style chip |
| **Approval flow** | 3 | Hero card + collapsible evidence is in the right spirit | Doesn't expose the gate chain; no WhatsApp/Telegram routing; no Calendar Gate; no Abstention copy variant | Show priority chain spine in WHY; add "Send to owner via WhatsApp" action; "Cendra is unsure" abstention sub-type |
| **Autopilot** | 3 | Hero promote card + flat table is good progression UI | No TrustMeter band per workflow; no CriteriaProgress; no CalendarAutonomyGate visualization; no "frozen" state | Replace flat table with workflow rows that each show TrustMeter band + CriteriaProgress + Calendar-gate caveat |
| **Brain (consolidated)** | 2 | Currently spread across Playbooks/Autopilot/Learning/Insights/Trust | They should live under a single "Brain" entry with sub-sections; right now nav is too wide | Collapse 5 nav items into **Brain** with 5 sub-tabs |
| **Learning** | 2 | Confidence-as-hero stat works; collapse simulation works | Doesn't connect to FoundationDrift candidates; no scope picker (this stay / this guest / this property / owner / portfolio); no "Teach Cendra after approval" surface | Add drift-driven suggestions; add scope picker; surface in approval flow |
| **Trust** | 3 | 6→3 tab grouping is good (Safety/Data/Audit) | No Golden Cases / Quality Review surface; no SMT verification proof on rules; no compliance posture detail | Add Quality Review tab section; show "verified consistent" on each owner rule |
| **Audit trail** | 3 | Filter pills + single-line + click-expand + provenance dots is right | Doesn't expose §10 priority chain on hover/expand; can't filter by foundation scenario | Add tier breakdown on row expand; foundation-scenario filter |
| **Approval (mobile)** | 4 | 6 tabs → 2 + preview cycle is right pattern | Doesn't show escalation tier or "owner WhatsApp" route | Add EscalationTier chip + "approve and route" affordance |
| **ASK CENDRA (global)** | 4 | Conversation-first + generative cards + persistence across nav is right | Uses static demo; doesn't yet wire to Brain's REASONING_START/STEP/END events for live trace | Wire to AG-UI SSE; show subtle "Cendra is thinking" with optional reasoning trail |
| **Search (global Cmd-K)** | 5 | Universal search across guests / properties / rules / etc. with grouped results — strong | Could surface scenario coverage for any matched property | Minor: scenario coverage chip in property results |

**Overall posture:** the prototype already feels *like* an Agent OS, not an inbox — this is the right macro direction. Where it falls short is in **representing the engine's identity**: priority chain, foundation scenarios, autonomy progression, gate chain, escalation tiers, golden cases, narrative voice, and dependency/promise objects.

---

## 7. Deliverable 3 — Recommended UX Revision Plan

### Immediate prototype revisions (this week)

1. **Reshape navigation to the canonical 5: Today · Stays · Work · Properties · Brain.**
   Move Playbooks / Autopilot / Learning / Insights / Trust under Brain as tabs. Rename Guests → Stays. Add a dedicated Work route fed by the six canonical card types.

2. **Promote the six card types to a real taxonomy.**
   Today renders mixed cards; refactor to:
   - `<DecisionCard>` (Decision Needed)
   - `<RiskCard>` (Risk Detected)
   - `<PromiseCard>` (Promise Open) — NEW
   - `<DependencyCard>` (Task / Dependency) — NEW (extracted from current VendorDispatchCard + PolicyHoldCard)
   - `<OpportunityCard>` (Opportunity)
   - `<LearningCard>` (Learning / Improvement)

3. **Introduce Stay Health as a first-class object.**
   `Healthy · Needs attention · At risk · Critical · Closed` — single chip per Stay derived from open decisions/risks/promises/dependencies. Drive sort order and group headers from this.

4. **Decision Card WHY drawer reorganised around the §10 priority chain.**
   Six labelled tiers; the firing tier highlighted; remaining tiers shown as "checked, did not fire". This replaces the free-form reasoning list and is the single biggest trust-builder available.

5. **Surface "Cendra is unsure" (Abstention) as a distinct sub-type.**
   Different copy and styling from "Approval required". Color: muted ink, not warn. Copy: "Confidence below threshold — I'd rather you decide."

6. **Property Brain: bi-temporal fact provenance + automatable lock.**
   Each fact: `true since X · last verified Y` pair. Plus a small lock icon when the fact is FL-05-pinned (cannot be auto-answered without human).

7. **Autopilot rows → TrustMeter bands with CriteriaProgress.**
   Each row: band visual + "needs N more low-risk reversible cases · 0 incidents in 30d to reach Autopilot". CalendarAutonomyGate caveat shown inline when relevant.

### MVP UX refinements (next iteration)

8. **Daily Brain Report screen.**
   Nightly digest combining: GoldenCases pass/fail, FoundationDrift candidates, FrictionTracker findings, Quality Review, Opportunity scan, Workflow promotion candidates. Should feel like Cendra's morning newspaper to the PM, not a dashboard.

9. **PreferenceLearner inline flow after every approval.**
   "Approve + 2 follow-up questions" optional. Captures Owner preferences without a separate route.

10. **PlannerStyle chip on property posture.**
    Owner sets a style (`Boutique · Standard · Direct · Warm · Tight · Formal`); shown on property + applied to drafts.

11. **Narrative-rendered Property Brain.**
    Replace the static `prep` table with a narrated paragraph: "Cendra knows this property runs hot in August (AC complaints peak 14:00–16:00) and the cleaner Marta is fastest before 11:00. Same-day turnovers cluster Fri/Sat." Below: the editable facts table. Narrative on top, structure below.

12. **Cross-channel guest identity card.**
    On Stay Detail: "This guest reached you on 3 channels for this stay" with channel chips. Unifies the Conversations tabs into one mental model.

### Later product maturity

13. **Quality Review (GoldenCases) public surface in Trust.**
    Show PM how many of the 50 golden cases Cendra passes for their portfolio nightly. Regression count graph.

14. **Rule verification badge** (M2 + M22 owner-policy DSL + Z3 SMT).
    On every owner rule: "Verified consistent · no contradictions with 7 other rules".

15. **Escalation chain explicit (M3 5-tier ladder).**
    On Trust → Safety: visualise the 5-tier escalation chain per workflow with target role + response window.

16. **Subtle reasoning trail behind every Cendra answer.**
    Expandable "show Cendra's thinking" in the ASK CENDRA panel — wires AG-UI REASONING events. Calm, monospace, ignorable.

---

## 8. Deliverable 4 — Screen-by-Screen UX Guidance

### A. Today / Mission Control
**First 5-second impression:** "Maya, this is what happened overnight, this is the one thing that needs you, here is everything Cendra handled."

Aggregate the six card types under one hero priority. Add:
- Top: time + system status (matches today)
- Big serif: greeting + "X things need you. The first is..."
- HERO PRIORITY (Fitts-friendly CTA)
- "More to know" — collapsed digests, one per card type
- **NEW** Cendra-handled-overnight digest (X drafts auto-sent · Y vendors pinged · Z facts confirmed)
- **NEW** Daily Brain Report ingress card (collapsed by default with the 3 most actionable items)
- BEHIND THE SCENES micro stat row (already there)
- ASK CENDRA bar (already there)

**Avoid:** showing internal classifiers, scenario IDs, raw confidence scores, gate names, model identifiers.

### B. Stays
**The list:** sort by Stay Health (`Critical → At risk → Needs attention → Healthy → Closed`).
Each row: avatar + guest name + property + stay stage (Pre-arrival / Check-in today / In-stay / Check-out today) + Stay Health chip + one-sentence Cendra take + open card-type pills (e.g. "1 Decision · 2 Dependencies · 1 Promise").

**Stay Health derivation rule:**
- Critical = any active safety blocker, leak, lockout, review-threat sentiment
- At risk = SLA breach OR sentiment shift OR active vendor delay OR unresolved promise within 24h
- Needs attention = open Decision Needed OR Knowledge Gap critical to this stay
- Healthy = none of the above, ≥ 1 successful auto interaction in last 12h
- Closed = post-departure with no open case

**Detail page:** narrative briefing → cards (Decision/Risk/Promise/Dependency/Opportunity) → Conversations (multi-channel) → static facts rail. Already largely matches our prototype.

### C. Work queue (NEW dedicated route)
Flat list, six tabs at top: All · Decisions · Risks · Promises · Dependencies · Opportunities · Learning.
Default sort: SLA + risk + reversibility (reusing the priority chain's mental model: safety > breach > approval > revenue > info > learning).

Each row links into the Stay/Property/Decision where it lives. Click → Decision Card or detail.

Why a Work route in addition to Today: Today is exception-first ("what needs me now"). Work is **comprehensive backlog** ("everything outstanding"). Today should never get long; Work is allowed to.

### D. Stay Detail
Already strong. Add:
- **Stay Health hero strip** with derivation explained inline ("At risk because…")
- **Promise list** sub-section before action cards: every guest-facing commitment with owner / due / status / verification
- **Dependency list** alongside Promises: prerequisites not yet met (cleaning unconfirmed, payment pending, …)
- Decision Card upgrade per below
- Narrative voice on the Cendra briefing (already there) preserved

### E. Decision Card (the most important component)
Five slots already established in `brain_engine/cards/models.py`:

1. **Situation** — italic-serif quote of the trigger ("Lukas asked at 07:42…")
2. **Recommendation** — bold sans imperative ("Send safe holding reply · ping cleaner")
3. **Why** — structured as the §10 priority chain (highlight the firing tier)
4. **Evidence** — kind-tagged rows (rule · fact · prior case · guest memory · OTA policy · photo) with provenance (`source: kara12_owner_handbook.pdf · p.4`)
5. **Mode · Risk · Reversibility** — ExecutionMode (auto/ask/approval/block) + Risk (low/medium/high/critical) + Reversibility (green/amber/red) chips

Plus:
- **Primary action** Fitts-friendly black button (matches the engine's `DecisionAction` literal: ask/approve/deny/charge/quote/block/escalate/dispatch/fetch_live_data)
- **Secondary action** ghost button (e.g., "Use safer alternative")
- **WHY drawer** (expandable) — shows the priority chain tier-by-tier with which fired and which didn't, foundation scenario ID, Art.12 record ref

**Confidence:** show a single chip only when ≥ 0.85 ("high confidence"); show "Cendra is unsure" sub-type when < threshold (AbstentionGate). Never show a raw decimal.

### F. Approval Needed
Distinguish three confidence tiers from `approval/confidence_router.py` in UI tone, not number:

- **HIGH confidence approval** = "Cendra would do this — please confirm". Primary CTA is _Approve & send_. Editing is secondary.
- **MEDIUM** = "Cendra prepared this — review and decide". Edit and Reject equally prominent.
- **LOW** = "Cendra needs you to take over". Primary becomes _Take over_; suggested draft secondary.

Always offer:
- Approve + Teach Cendra (drives PreferenceLearner)
- Approve as rule (drives FL-14 customer foundation)
- Edit
- Reject
- Ask for safer alternative
- Take over
- Escalate to next tier (visible target role from EscalationDispatcher)
- Send approval to owner via WhatsApp/Telegram (from `approval/gateway.py`)

For high-risk irreversible actions (`reversibility: red`, action: `charge` or `refund`): typed-confirmation gate (already in our prototype — keep).

### G. Property Brain (inside Properties detail)
Already in good shape. Upgrades:
- **Bi-temporal provenance** per fact (true since · last verified)
- **Lock icon** on FL-05-pinned facts ("Cendra cannot answer this automatically — even when verified")
- **Style chip** at top: "Cendra speaks here in *Boutique* style — set by owner"
- **Scenario coverage** stays as-is + drill-in to a specific stage
- **Narrative paragraph** on top of the table (TextRenderer from `narrative/`)
- **Knowledge gap cards** with the *guest question that triggered them* visible inline

### H. Brain (consolidated tab)
Five sub-tabs:
1. **Playbooks** (library) — workflows Cendra runs, each with autonomy state
2. **Autopilot** (workflow trust) — per-workflow trust meter + promotion gate
3. **Learning** — pattern suggestions + foundation drift + preference candidates
4. **Trust** — hard rules + permissions + data sources + golden cases + audit
5. **Insights** — Ask Cendra explorer + Daily Brain Report + trends

This keeps the breadth of capabilities but collapses to one nav slot.

### I. Autopilot
Per-workflow rows, each showing:
- Workflow name + kind (from `WorkflowKind` taxonomy)
- Current state pill (Observe / Approval / Semi / Autopilot / Never)
- **TrustMeter band** with `CriteriaProgress` — "12 more low-risk reversible cases · 0 incidents needed for next state"
- Calendar-gate caveat when relevant ("Calendar-dependent · safety check before each auto-run")
- Override rate · incidents · last incident
- [Promote] / [Demote] / [Pin to Never Auto] actions

When a workflow is **frozen** (FL-07 workflow_freeze): explicit "frozen because 3 contradictions in 7d" copy + how to unfreeze.

### J. Learning Center
Three categories, each as collapsible:

1. **Pattern suggestions** (from PatternMiner with PatternOrigin links) — "Cendra noticed how you handle X based on 4 cases"
2. **Foundation drift** (FL-13) — "You're handling scenario S3-024 differently than the default · update foundation?"
3. **Preference candidates** (PreferenceLearner) — "After 3 approvals, here's an owner preference I'd like to confirm"

Each card:
- Big confidence % stat (already in our prototype)
- One-line title (serif)
- Observed snippet
- Proposed rule
- **Scope picker**: This stay · This guest · This property · Owner-wide · Portfolio (matches RuleScope enum)
- Simulation result line
- [Approve as rule] / [Edit scope] / [Not now] / [Never auto-suggest this again]

### K. Trust
Three sub-tabs (already established):
1. **Safety** — hard rules + permissions + escalation chain visualisation
2. **Data** — integration health + PII handling + source reliability map (FL-07)
3. **Audit** — link out to full audit screen

Add:
- **Quality Review** band on top — "Cendra passed 47 of 50 golden cases overnight · 3 regressions reviewed" (from `evaluation/golden_cases_runner.py`)
- **Verification badges** on owner rules ("Verified consistent · no contradictions with 7 other rules" from M22)

### L. Daily Brain Report (NEW screen, or top-of-Insights section)
Sections, in this order:
1. **Cendra-handled-overnight** — silent successes (auto Wi-Fi answers, vendor pings, draft replies awaiting approval)
2. **Knowledge gaps detected** — new gaps + recurring
3. **Foundation drift candidates** (FL-13) — your-style-vs-default
4. **Quality review** (GoldenCases) — pass rate + regressions
5. **Friction findings** — where Cendra slowed you down (heavy edits, escalations)
6. **Revenue opportunities** scanned overnight
7. **Property health findings** (recurring complaints, contradictions, vendor delays)
8. **Workflow promotion candidates** — eligible for autonomy promotion
9. **Sentiment risks** — guests trending negative

Daily Brain Report is the one screen that should feel **most agentic** — like Cendra wrote PM a memo while they slept.

---

## 9. Deliverable 5 — Component-Level Guidance

| Component | Brain Engine model | Behaviour |
|---|---|---|
| **WorkItemCard** | Wrapped DecisionCase / Blocker / Promise / Opportunity / LearningSuggestion / KnowledgeGap | One canonical card type for the Work queue; thin (single-line + expand) |
| **StayHealthBadge** | Derived from open DecisionCases + Blockers + Promises + sentiment | Solid pill, single canonical color per state, hover → derivation explanation |
| **DecisionCard** | `cards.models.DecisionCard` (5 slots) | Five-slot composition · primary CTA from `DecisionAction` literal · WHY drawer maps to §10 priority chain |
| **WhyDrawer** | §10 priority chain + DecisionCase row | Tiered explanation; each of 6 tiers shown with state (fired · checked-no-match · skipped) |
| **EvidencePack** | `EvidenceKind` + provenance | Kind-tagged rows, source link, freshness pair (true since / last verified), confidence band per row |
| **ApprovalPanel** | ApprovalGateway + ConfidenceRouter + EvidencePack | Three tonal variants for HIGH/MEDIUM/LOW confidence; 8 actions including "Send to owner via WhatsApp"; typed-confirm gate for red-reversibility |
| **PromiseCard** | Brain ought to expose a Promise object — currently inferable from DecisionCase action="quote"/"dispatch" | Title (the promise sentence) · owner · due · status · verification · escalation chip |
| **DependencyCard** | Blocker engine output | Title · blocked workflow · severity · expected resolution · who owns the unblock · alt path |
| **OpportunityCard** | Proactive scenarios (orphan-night, pet upsell, etc.) | Title · est revenue · accept rate · guest fit reason · [Send] / [Skip] / [Adapt] |
| **LearningSuggestionCard** | PatternRule + PatternOrigin OR FoundationUpdateCandidate OR PreferenceCandidate | Big confidence % · observed text · proposed rule · scope picker · simulation · [Approve as rule] / [Edit scope] / [Not now] / [Never] |
| **PropertyFactCard** | Bi-temporal observation/belief (M7) | Fact · value · source · `true since` · `last verified` · state pill · automatable-lock icon · edit |
| **KnowledgeGapCard** | MissingInfoDetected event | Fact label · guest question that triggered it · ask count (30d) · [Confirm in 1 tap] / [Internal only] / [Ask owner] |
| **AutopilotWorkflowRow** | `WorkflowAutonomy` + `TrustMeterService` + `CalendarAutonomyGate` | Workflow · current state · TrustMeter band · CriteriaProgress (textual: "12 more low-risk reversible cases needed") · last incident · calendar-gate caveat |
| **AuditTimeline** | DecisionCases stream | Single-line rows · reversibility dot on left edge · click to expand priority chain + Art.12 record · filterable by foundation scenario |
| **DailyBrainReportCard** | Combined output of nightly cycle (8 steps + step 9 foundation drift) | Section header · 3 most actionable items · expand for full list · drill in to Brain → Learning or → Trust |
| **ASK CENDRA bar + answered panel** | AG-UI SSE REASONING + TEXT_MESSAGE + tool_call events | Subtle "Cendra is thinking" indicator from REASONING_START · serif briefing from TEXT_MESSAGE_CONTENT · generative cards from tool_call events · follow-up chips reuse previous query context |

---

## 10. Deliverable 6 — Claude Design Revision Prompt

> **Task:** Revise the Cendra Agent OS prototype to better express Brain Engine's actual capabilities and feel like a Stay Operating System rather than an AI inbox.
>
> **Constraints:**
> - Keep the current Airbnb-inspired palette, Fraunces display serif, Geist sans body, global Cendra bar and global Search.
> - Do not add tabs or routes beyond the five canonical: Today · Stays · Work · Properties · Brain.
> - Every signal must collapse into exactly one of six card types: Decision Needed · Risk Detected · Promise Open · Task / Dependency · Opportunity · Learning / Improvement.
> - Translate every Brain Engine capability into operational language. Never expose: classifier names, memory tier internals, vector ops, confidence decimals, gate names, foundation scenario IDs in PM-facing copy (only in WHY drawer), or LLM identifiers.
>
> **Required changes:**
>
> 1. **Navigation:** Rename Guests → Stays. Add a dedicated Work route. Collapse Playbooks / Autopilot / Learning / Insights / Trust under a single Brain entry with five tabs.
>
> 2. **Six card types:** Refactor mixed-content cards into six explicit components — `DecisionCard`, `RiskCard`, `PromiseCard`, `DependencyCard`, `OpportunityCard`, `LearningCard`. Each follows the established 5-slot pattern (Situation · Recommendation · Why · Evidence · Mode/Risk/Reversibility) with appropriate variants.
>
> 3. **Stay Health:** Promote to a first-class single chip per Stay (`Healthy · Needs attention · At risk · Critical · Closed`). Drive list sort + group order. Hover → derivation tooltip.
>
> 4. **WHY drawer = §10 priority chain:** Reorganise every Decision Card's WHY drawer into a six-tier vertical (Manual → Blocker → Safety → Learned → Preference → Ask). Highlight the firing tier; show the others as checked-and-skipped.
>
> 5. **AbstentionGate as a distinct sub-type:** "Cendra is unsure" copy variant of Decision Needed — different from "Approval required". Muted ink, not warn. Different primary CTA: "I'll decide".
>
> 6. **Autopilot:** Replace the flat table with workflow rows that each render a Trust Meter band with explicit CriteriaProgress ("12 more low-risk reversible cases · 0 incidents in 30d to reach Autopilot"). Add CalendarAutonomyGate caveats inline. Add explicit "Frozen because…" state.
>
> 7. **Property Brain:** Add bi-temporal provenance per fact ("true since · last verified"). Add a lock icon on FL-05-pinned facts ("Cendra cannot auto-answer this — pinned to human"). Add an owner Style chip ("Cendra speaks here in Boutique style"). Replace the current top-of-page stat band with a Cendra-narrated paragraph followed by the editable table.
>
> 8. **Learning Center:** Three categories — Pattern suggestions (with PatternOrigin links — "Cendra learned this from 4 of your edits"), Foundation drift candidates (FL-13 — "Your style differs from the default · update foundation?"), Preference candidates (PreferenceLearner — surfaces after approvals). Each with a scope picker (Stay / Guest / Property / Owner / Portfolio).
>
> 9. **Trust:** Add Quality Review band on top of the Safety tab ("Cendra passed 47 of 50 golden cases overnight"). Add verification badge on owner rules ("Verified consistent · no contradictions with 7 other rules"). Add the 5-tier Escalation chain visualisation.
>
> 10. **Daily Brain Report:** New screen (or top-of-Insights section). Sections in order: Cendra-handled-overnight · Knowledge gaps detected · Foundation drift candidates · Quality review · Friction findings · Revenue opportunities · Property health findings · Workflow promotion candidates · Sentiment risks. The single most agentic-feeling screen.
>
> 11. **Approval flow:** Three tonal variants for HIGH / MEDIUM / LOW confidence (no decimals shown). Add 8th action: "Send to owner via WhatsApp". Add Calendar-gate inline caveat when applicable. Typed-confirm gate stays for red-reversibility actions.
>
> 12. **Decision Card primary CTA copy:** Match the 9 DecisionAction literals — `ask · approve · deny · charge · quote · block · escalate · dispatch · fetch_live_data` — but translate each to operational language ("Send draft" not "approve", "Hold thread" not "block", "Wake the on-call" not "escalate").
>
> 13. **Optional reasoning trail:** In the ASK CENDRA answered panel and on Decision Cards, add an expandable "Show Cendra's thinking" section that, in production, will render the live AG-UI REASONING_START/STEP/END + MEMORY_RETRIEVED + RAG_HIT + GUARDRAIL_CHECK events. In prototype: render mocked equivalents that read like reasoning, not raw event dumps.
>
> 14. **Cross-channel guest identity:** On Stay Detail header, show the unified channel chip strip ("This guest reached you on Airbnb + WhatsApp + Instagram for this stay"). The Conversations panel already does this — surface it one level up.
>
> **Tone for all PM-facing copy:**
> - "Cendra checked…"
> - "Cendra recommends…"
> - "Needs approval because…"
> - "Waiting on cleaner/vendor/owner/guest…"
> - "Promise due in 12h…"
> - "Automation paused because cleaning is unconfirmed."
> - "Safe to automate · 412 cases · 0 incidents in 90d."
> - "Pinned to Never Auto · safety scenario."
> - "Cendra learned this from your edits in the last 14d."
> - "Cendra is unsure — I'd rather you decide."
>
> Never use: "AI", "ML", "LLM", "vector", "embedding", "tier", "classifier", "model", "GPT", "confidence: 0.86" (use confidence bands instead). Cendra is a colleague who happens to be software, not "the AI".

---

## 11. UX overreach risk register

| Current UX expression | Risk | Safer expression |
|---|---|---|
| Generic 0.86 confidence chip | Implies more precision than the engine guarantees | Bands: "High confidence · 412 cases · 0 incidents" / "Cendra is unsure" |
| "Approve & send" black CTA on all draft replies | At low confidence this can feel like rubber-stamping | Tonal variant: dim CTA + "Cendra is unsure — take over" for LOW tier |
| "Cendra detected the leak" auto-card | Vision/audio extraction is real but error-prone | "Cendra thinks this is a leak — based on 3 photos · confirm?" |
| "Auto-resolved" without provenance | Shadow actions undermine trust | Always show the auto-action target + revert affordance for 60s |
| Single global confidence number on opportunities | Implies portfolio-level certainty | "Likely accept · based on 41% of similar guests" |
| Conflict resolver auto-tasks "Update Airbnb listing" | Brain engine can prepare, not push the edit | "Cendra drafted the listing correction — review and publish" |
| Searching shows knowledge_facts with raw scope | Internal scope strings leak | Map every scope string to a PM phrase |
| "Cendra learned this from your edits" without citations | If we can't link the 4 cases, trust breaks | Always link to PatternOrigin DecisionCases or don't claim learning |

---

## 12. Final posture

The prototype is **on the right macro track** — exception-first, conversation-first, Fraunces voice, generative cards, progressive disclosure, six-card mental model.

It is **under-expressing** four parts of the engine:
1. The §10 priority chain (the WHY drawer should be structured by it).
2. Stay Health as a first-class object.
3. TrustMeter / CriteriaProgress on Autopilot.
4. Daily Brain Report / Friction tracker / Golden Cases — the proactive surface where the engine's nightly intelligence should land.

It is at **mild risk of overreach** on three:
1. Decimal confidence values shown directly.
2. "Auto-applied" without revert affordances.
3. Cross-channel merges shown as fait accompli without the merge evidence.

Closing these gaps converts the prototype from "well-designed AI app" to "a hospitality operating system PMs trust with their portfolio."
