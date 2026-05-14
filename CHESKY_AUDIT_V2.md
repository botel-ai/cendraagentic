# Cendra Agent OS — Brutal Product Audit · V2 (post R1-R11)

**Date:** 2026-05-14
**Predecessor:** `CHESKY_AUDIT.md` (V1) — substantially closed across 11 releases
**Audit lens:** Same as V1. Fresh eyes on the post-R11 state.
**Status:** Reference document for the next iteration cycle.

---

## 1 · Executive UX audit

V1 found a product that was a "calm digest with agentic plumbing." Eleven releases later, the prototype has become **a calm operations cockpit with deep operational surfaces.** The framing problem is solved. The kernel is right. The cendra_take voice carries the product end-to-end. The §10 chain, prospective replay, kill switches, HMAC certs, stay narrative export, owners pulse, cleaning schedule, check-in window timeline, review window awareness, team capacity, calm state — together these compose something that **looks and feels like a Stay OS, not a dashboard.**

The new problem is a different one. As the product became real, three patterns emerged:

1. **Density accumulation.** Every release added a horizontal strip, a hero band, a pulse, a section. The Stays page above the fold is now four context strips deep before you reach a guest. Today is hero + 3 lanes + cluster strip + backlog band + ticker. Stay Detail has 7+ stacked sections. The "single decision focus" we shipped in R2 is now technically contradicted by the accumulating sections around it.

2. **Static "live" data.** The product calls itself live. The pulsing dots breathe. The ticker says "47s ago." But no timer ticks. No SLA decrements. No activity stream actually streams. For a continuous-present cockpit, the lack of data motion is the next credibility tax. R6 promised live; the prototype shows stills.

3. **Promised but undelivered command grammar.** The Steer Cendra bar advertises Pause / Override / Snooze / Hand off. Typing any of these routes to the same answer panel. The verbs are signage without infrastructure. A first-time PM who tries `Pause vendor dispatch on Bosphorus for 2 hours` gets an analyst answer, not a system action.

The next phase isn't more surfaces. It's **compression + liveness + delivered promises** on top of what's already shipped.

---

## 2 · Biggest product identity problems (new since V1)

**P1 · The "more is better" pattern is creeping in.**
Each release added a strip. Same-day turnover tape + check-in window timeline + review window strip are all on Stays. They cover overlapping operational moments (the next 4 hours). A PM scans, sees three banners, and has to decide which one is "today's most important." A control room shouldn't ask the PM to triage *between* its alerts. There should be one most-important strip per page, with the others subordinated. **Operational problem:** PM under stress doesn't know which strip to read first. **Trust problem:** if three strips compete, none is fully trusted. **UX principle:** Hick's Law at the *page* level, not just the nav level.

**P2 · Cendra's voice has spread too wide and too thin.**
In V1 the cendra_take serif was the soul of the product — used on Today hero and Stay Detail briefing. Now it appears in 7+ places: Today hero, Stay Detail briefing, Stay narrative, calm state, RightNow strip, Reversal notes, Owner pulse notes. Each new use is tasteful in isolation. Cumulatively, the voice begins to read **performative** rather than soulful. The audit principle wasn't "use Cendra's voice everywhere" — it was "use Cendra's voice at the *one moment* where Cendra is speaking to the PM." When everything is in Cendra's voice, nothing is.

**P3 · The product is "fully informed" but not "concentrated."**
A real cockpit puts ONE thing at the center and pushes everything else to the periphery. Today has a hero serif but then immediately fans out to 3 equal-weight lanes, then a 5-cluster strip, then a backlog band, then a ticker. There's no center of gravity below the hero. A PM looking for "what should I do FIRST" gets too many possible firsts.

**P4 · Static liveness undercuts the live frame.**
The product says "live" everywhere — `LIVE IN FLIGHT`, `RIGHT NOW`, `on watch · 31 active`, pulsing dots, "47s ago" timestamps. But nothing actually moves. SLA counts don't tick. The plumber's "26m" stays "26m." The activity ticker doesn't add new entries. The PM gradually realizes the live frame is theatrical, not factual. **This is the highest single trust risk in the current state.**

**P5 · The Steer Cendra promise is partially false.**
Verb chips imply commands. Typing a command doesn't execute it. Right now this is a prototype-vs-production gap, but in the user's mental model, the chip set creates a contract the product doesn't honor. Even in prototype, the click should *show* what command execution would look like (a toast, an arming confirmation, a stay-level result) — not bounce to the analyst answer panel.

---

## 3 · Biggest UX strengths (post R1-R11)

The kernel from V1 + the R1-R11 additions together compose a set of world-class moves. These should be canonized.

**S1 · §10 Priority Chain WhyDrawer.** Still gold. Still the single most credibility-building artifact.

**S2 · Prospective replay inside CendraStatusPeek.** The trust killer move. PM can preview what Cendra would do over the next 4 hours and arm with one click. Beautiful — buried, but beautiful.

**S3 · Stay narrative export.** Cendra writes the stay's closing paragraph in serif voice, with KEY EVENTS + NEXT STEPS columns, edit-before-send. This is what "Stay OS" actually means.

**S4 · Owners pulse on Properties.** Five owner cards with response-time ↑ markers, sentiment trajectory, open approvals, one-line context. Owners stopped being labels.

**S5 · Cleaning schedule with gap-to-next overlay.** Each row makes the cleaner → property → next-guest dependency visible. The "1.0h gap" / "2.5h gap" / "1.5h gap" labels are operational gold for same-day turnovers.

**S6 · Check-in window timeline.** Horizontal time axis with depart/clean-in/clean-out/arrive/code glyphs. Risk notes per row when tight. A PM can pre-empt collisions instead of firefighting them.

**S7 · Calm state celebration.** "Everyone is where they should be." Soft gradient, breathing teal dot, four big-serif zero stats, italic body. The page actively breathes. This is the rarest emotional UX move in B2B software.

**S8 · 5-tier autonomy ladder with inline HMAC certs.** Observe / Suggest / Draft-hold-Nmin / Send-with-recall / Autopilot. Per-row cert pill (T2-T5 · expiry · ✓). Real operators will recognize the precision.

**S9 · Reversals last 7d on Trust → Audit.** Three honest post-mortems with what-Cendra-did, what-went-wrong, action-taken, learning-shipped. Trust grows from this exact move.

**S10 · Three time-tense lanes on Today.** Just-happened, Live-in-flight, Coming-up-next-4h. Continuous-present cockpit framing.

**S11 · Team workload + overload + reassignment suggestions.** Maya at 134%, Adèle at 26%, with concrete reassign suggestions. PM-management-of-PMs is real software.

**S12 · Stay journey breadcrumb on Stays cards inline.** Each card shows BOOKED › PRE-ARRIVAL › CHECK-IN › IN-STAY › CHECKOUT with the current stage bolded. Scannable.

---

## 4 · Biggest UX risks (new since V1)

**R1 · Strip-of-strips emergent pattern on Stays.**
Above the fold: hero + lead + same-day turnover tape + check-in window timeline. Below: review window strip + 4-need-you section + cards. Five sections of pre-context before the actual guest cards. A 200-property PM doesn't need this much warm-up. The hierarchy of "what matters most right now" is dispersed across strips with equal weight.

**R2 · Stay Detail has accumulated despite the "single decision" claim.**
Top nav band → Hold Steady banner (when armed) → Identity header → Right Now strip → Decision Ladder header → Hero binding card → Secondary cards toggle → Briefing → Stat band → Prior stays strip → Stay narrative card → Conversations panel → Right rail. That's ~12 vertical regions. The hero binding decision is on screen, but it's no longer dominant — it's one of 12.

**R3 · Live data is theatre.**
The pulsing dot on "on watch · 31 active" never changes. The activity ticker shows "47s ago / 2m ago / 4m ago" frozen. The 26m SLA on Selin's case stays 26m. For a cockpit, this is the credibility killer. The first PM to leave the page open for 10 minutes will lose trust in the timeline framing.

**R4 · Verb chips on Steer Cendra promise execution that doesn't happen.**
Clicking "Pause" inserts "Pause Cendra on " in the input. Typing the full command + Enter routes to the analyst answer panel. The promised command grammar isn't wired. A real interaction would show a confirmation toast: "Cendra is pausing vendor dispatch on Bosphorus for 2 hours → confirm." Right now it's a UI signal of capability without the capability.

**R5 · Discovery problem for the best features.**
- Prospective replay: behind a top-right indicator label that says "on watch · 31 active." A first-time PM never clicks this.
- Hold Steady H key: no visible affordance. Pure keyboard secret.
- Property Brain as_of slider: only on Property Detail, no portfolio-wide rewind.
- Stay narrative export: only renders for two demo guests; no surface promotes its existence.
- HMAC cert details: requires click on the inline pill.

The best trust artifacts in the product are buried behind discovery debt.

**R6 · 9-section Daily Brain Report flattens routine vs notable.**
Bootstrap online, Golden Cases 98.4%, Memory consolidated 58 episodes, Risk gate refused 4 — these get the same visual weight as Foundation Drift "1 suggestion for your review" and AB Experiments "1 verdict in." The PM has to scroll all 9 sections to find what's actually for them today. A "Today's headline / Routine sections" split would solve this.

**R7 · No financial dimension on any operational surface.**
Hospitality PMs don't just operate — they track revenue. Today doesn't say "revenue captured today: €4,210 · forecast €5,300 · variance −20%." Stays don't show stay value. Properties don't show ADR. Owners don't show monthly revenue per owner. This is a massive blind spot for a hospitality OS.

**R8 · No channel-axis view.**
Channel managers spend hours triaging by Booking vs Airbnb vs Direct vs Expedia. Channel exists as chips on guest cards. There's no surface that says "Airbnb today: 14 active conversations · 2 review windows · 1 cancellation policy violation." Channel-axis is missing entirely.

**R9 · Mobile is still a hole.**
V1 said: "re-add mobile as a real product surface." The mobile route was deleted in cleanup; no mobile concept exists. PMs check phones at night, after dinner, during transit. The on-call concept hasn't been built.

---

## 5 · Most important redesign priorities (ranked, V2)

| # | Priority | Why |
|---|---|---|
| 1 | **Live tick / decrement on at-least-one timer.** SLA timers, plumber ETA, recall window, prospective replay window. Even one moving number breaks the static-theatre frame and lifts trust across the entire app. | Highest single trust unlock available; small implementation. |
| 2 | **Wire one verb chip end-to-end.** "Snooze this 30m" or "Pause vendor dispatch on Bosphorus" should produce a real arming UI, even if the back-end is fake. Verb chips that don't deliver are worse than no verb chips. | Closes the Steer Cendra promise gap. |
| 3 | **Compress Stays' pre-context strips.** Either fold same-day turnover + check-in window + review window into one consolidated "next-4h-operational-state" strip, or move two of them to a secondary tab on Stays. | Solves density accumulation, restores Stay-as-noun primacy. |
| 4 | **Daily Brain Report tapered hierarchy.** Headline section (the one that needs PM action) full-width; routine sections one-line collapsed. | Solves R6; PM can scan the report in 5 seconds. |
| 5 | **Financial dimension on Today + Stays.** A small "revenue captured · variance · forecast" line on Today. Per-stay value chip on Stay Detail. | R7 blind spot. |
| 6 | **Promote prospective replay out of the status indicator.** A first-class Today widget: "Cendra's plan for the next 4 hours · ready to step away." | Discovery debt on the best feature. |
| 7 | **Channel-axis view.** Either a new sub-route or a filter on Work. "Airbnb today / Booking today / Direct today" with per-channel state. | R8 blind spot. |
| 8 | **Mobile concept rebuilt.** On-call surface — one-tap approval, swipe-to-confirm overnight permissions, push for critical-only. | V1 deferral still open. |
| 9 | **Keyboard shortcut overlay.** A `?` overlay listing J/K/H/Enter/Cmd-K so the keyboard model is discoverable. | R5 discovery debt. |
| 10 | **One-line "What changed since you last logged in."** Top of Today, before lanes. "Since you logged out at 03:42 — 4 vendor confirms, 2 promises closed, 1 risk escalated to your queue." | Continuous-present cockpit needs continuity across sessions. |

---

## 6 · Most important operational UX gaps (V2)

- **No revenue / financial signal anywhere.** P&L view, daily revenue, modification value, refund-cost impact, cancellation-revenue-lost, upsell capture YTD — none of these surface. A PM's job is partly financial.
- **No channel-axis view.** Per-channel state and queue.
- **No "across regions" comparative view.** Beyoğlu vs Bosphorus rolling 7d. Owners want regional comparisons.
- **No tax/regulatory window awareness.** City tax declarations, lodging compliance reminders.
- **No "Cendra learning" surface for the PM.** Learning suggestions is one tab; "Cendra noticed these patterns this week" is a different surface that doesn't exist.
- **No multi-stay context-injection.** PM can't type "Cendra, by the way, Galata 3's AC was replaced last week — factor that in" inline.
- **No "Cendra is unsure" portfolio-level alert.** Abstention is a card type; portfolio-level abstention ("Cendra is holding 4 decisions awaiting your input across 3 stays") is missing.
- **No proactive cancellation/modification reporting.** Channel cancellations are a major operational event. Where do they land? Not on Today.

---

## 7 · Most important trust gaps (V2)

- **The advertised live frame is static.** Highest single trust gap. Cure: one moving number.
- **Verb chips imply commands that don't execute.** Cure: wire one chip end-to-end.
- **Reversals shows 3 entries; never more, never an updating count.** A "Reversals last 30d: 11" rolling badge on Trust → Audit would feel honest. 0 reversals over a long period might look suspicious.
- **No "Cendra was uncertain — here's where I deferred to you today."** The abstention card type exists; the portfolio rollup doesn't.
- **No data freshness indicators consistently.** Some sections say "Today 06:14"; most don't. PM doesn't know how stale anything is.
- **HMAC cert popover is great but is a click-through. Inline "T5 · 7D · ✓" is good but might benefit from a freshness indicator (signed 2h ago).**
- **No way to see Cendra's "memory snapshot" of you as PM.** What has Cendra learned about Maya specifically? She'd want to know.

---

## 8 · Most important hospitality realism gaps (V2)

- **No financial dimension** (repeated — most critical).
- **No channel-specific surfaces** (repeated).
- **No cancellation/modification flow.** Real PMs handle 5-15 of these a day.
- **No "guest about to cancel" early warning.** Booking pull-back, low message engagement, sentiment cooling — early warning would be valuable.
- **No "owner reporting cadence" surface.** Weekly owner reports, monthly statements, quarterly check-ins. Owners pulse is a static snapshot; no calendar of owner touch-points.
- **No tax/regulatory window awareness.**
- **No physical-property timing.** Building maintenance windows, trash pickup, smart-lock battery dies. Physical realities that govern guest experience.
- **No multi-property check-in coordination.** When 3 guests arrive at 14:30 across 3 properties, where's the coordinated view?
- **No "guest in transit" status.** Real-time: "Lukas's flight landed, Uber requested, ETA 47 min." Cendra would know.

---

## 9 · Most important scalability problems (V2)

- **Stays renders linearly.** Still doesn't scale past 50 active stays. Need density mode (one-line per stay) or geographic grouping.
- **6 nav items are at Hick's upper bound.** Adding a 7th (Channel, Owners, Financial) would push it past. Need to consolidate.
- **Brain has 6 subtabs.** Trust has 5 subtabs. At Hick's upper bound. Adding more requires nesting.
- **Today's 3 time-tense lanes are great at 5 items each; at 30 each they would scroll. Need pagination or "show 5 more" pattern.**
- **Region clusters are 5 columns wide. At 12 regions they wrap clumsily.**
- **Promise tracker shows 6 items; at 60 it would scroll forever in the popover.**
- **No "PM filter" portfolio-wide.** A 5-PM team needs to filter by PM in audit/promises/decisions/work.
- **No "show only my stays" affordance for an individual PM.**

---

## 10 · Most important interaction improvements (V2)

| | Current | Better |
|---|---|---|
| SLA timer | Static "26m left" | Live decrementing once per second |
| Activity ticker | Static last-5 with frozen "47s ago" | Auto-prepending new lines every N seconds (simulated stream) |
| Verb chip click | Inserts template, routes to analyst answer | Inserts template AND on Enter, renders execution arming UI |
| Top-right "on watch · 31 active" | Click opens peek | Always show drafting/waiting/monitoring micro-counts inline so peek is reward, not discovery |
| Cendra status peek | Click to open | Hover preview, click to pin |
| Hold Steady H | Invisible | Floating chip on Stay Detail: "[H] Hold Steady on this stay" |
| Stay journey breadcrumb on cards | Static text | Click any stage → filter Stays to that stage |
| Approval primary action | Compress on click (added) | Add 250ms success animation: row turns teal briefly, "✓ Confirmed" toast slides up |
| Owner pulse card | Click does nothing | Click → owner detail (per-owner approvals + history + sentiment over time) |
| Vendor card click | Open thread → | Inline expand to thread, no full-page jump |
| Cleaning schedule status | Static badge | Live tick on IN PROGRESS / OVERDUE rows |

---

## 11 · Most important emotional UX improvements (V2)

- **One moving number.** Even a single decrementing timer somewhere on Today restores the live feel.
- **Acknowledgment on PM action.** Approve → row turns teal briefly + "✓ Confirmed. Cendra has armed the recall." Currently silent.
- **Stop using Cendra's voice in every section.** Reserve serif italic Cendra speech for Today's hero, Stay Detail briefing, Stay narrative, and Calm state. Demote the secondary "Cendra is X" callouts to system voice.
- **End-of-day farewell.** When PM closes the app or logs out, Cendra could write a one-liner: "All clean. Sleep well — I'll page you only if something breaks." Optional but emotional.
- **First-screen humanity.** Today opens with "Good afternoon, Maya." That's right. But it's the same greeting at 9am, 12pm, 3pm. A small time-of-day texture ("Mid-day check-in. The calm before the 3pm wave.") would differentiate.
- **Loading states still missing.** When Cendra is thinking, the 3-pulse loader fires in the Steer bar. But page navigation has no loader. A subtle progress bar at top would suffice.

---

## 12 · Most important AI explanation improvements (V2)

- **§10 chain everywhere, not just Approval cards.** Today's hero priority should expose §10 on demand. Every Decision Card should. Every Reversal should show the §10 walk that led to the wrong outcome.
- **Property Twin rollouts should also appear on Stay Detail's binding card.** Right now only on ApprovalGenerativeCard.
- **Show PatternOrigin on Learning suggestions.** "This was learned from 4 PM corrections in the last 14d — see those events."
- **Confidence formula on hover.** The 4-component breakdown (base rate / counterexamples / staleness / boosts) on hover over a confidence band.
- **"What Cendra considered and rejected."** When Cendra chooses tone A over tone B, surface that choice with reasoning.
- **A live "what Cendra is currently reasoning about" log.** Stay Detail's RightNow strip is a glimpse of this; a continuous stream version would be richer.

---

## 13 · Most important autonomy UX improvements (V2)

- **Wire one recall window to be actually live.** Tick from 60 → 59 → 58. Currently it does tick but the demo flow shows the magic.
- **Per-property autonomy override.** Wf_late on autopilot portfolio-wide; PM wants Suggest on Bosphorus only. No affordance.
- **"Warming up" badge on newly-promoted workflows.** Currently absent.
- **Kill switch affected stays.** When a switch is armed, show which stays were affected in the last 60 minutes — count + drill-down.
- **Cendra's autonomy stance per-stay.** A small chip on Stay Detail: "Cendra is at SEMI on this stay (1 step below portfolio default)." Tells the PM where the boundary is.
- **"What can Cendra act on without my approval right now?"** A first-class peek. Currently distributed across kill switches + autonomy ladder + never-auto floor — hard to assemble in your head.

---

## 14 · Most important "Mission Control" improvements (V2)

1. **Live timers.** The single highest-leverage change.
2. **"What changed since you last logged in."** A one-line delta band above the hero on Today.
3. **Compress competing strips on Stays.** Fold the 4-hour ops state into one strip.
4. **Promote prospective replay** to a Today-level affordance.
5. **End-of-shift posture.** "Going off shift? Here's what Cendra is allowed to do until 07:00. Tighter mode? Looser mode?"
6. **A second-axis "what should I do FIRST" view.** Today picks one priority. PMs sometimes have parallel hero-class items. A "two-on-deck" pattern.

---

## 15 · Most important "Stay OS" improvements (V2)

- **Stay timeline horizontal.** The journey breadcrumb is in place; a full horizontal timeline of major events per stay (booked → pre-arrival messages → check-in → in-stay events → checkout → review) is still missing.
- **Cross-stay context card.** PriorStaysStrip exists but it shows synthesized prior visits. A real cross-stay card would also surface "Returning · prefers warmth tone · last tipped €30 · noise-sensitive."
- **"Open promises on this stay."** PromiseCard exists on Stay Detail; a roll-up "3 promises live on this stay · 1 nearing breach" header would help.
- **Stay-axis filter exists on audit; should also be available on Promises / Decisions / Learning surfaces.**
- **Stay value visible.** Stay-level revenue, channel commission, owner take.
- **Stay narrative on every stay, not two demo guests.**

---

## 16 · Most important mobile improvements (V2)

Mobile is still the biggest hole. A 200-property PM is rarely at their desk. Required:

- **On-call screen.** When a critical-only escalation fires, the PM sees one stay, one decision, one big approve/decline.
- **Voice memo input.** "Tell Selin I'll cover the deductible — draft it for me." Cendra drafts; PM approves with one tap.
- **Allow-overnight wizard.** "Cendra, you can handle these classes overnight: Wi-Fi, parking, late checkout (≤€25), early check-in (with cleaner-confirmed). Page me for everything else."
- **Cross-channel guest threads in a stack.** Swipeable.
- **Offline tolerance.** Approvals queue, sync when back online.
- **Pager-like push.** Critical only.

---

## 17 · Pixel-level design observations (V2)

- **Mono label saturation.** Every strip has a mono-tracked eyebrow, mono caption, mono inline labels. Pull mono back to two tiers: section header + tabular numbers. Everywhere else use the sans system.
- **Letter-spacing inconsistency.** `.04em / .06em / .08em / .10em / .12em / .14em / .16em / .18em` are all in use. Pick 3: `.08em` (default uppercase), `.14em` (section eyebrow), `.18em` (top-level brand label).
- **Card border-left accent widths**: 3px / 4px / 5px across surfaces. Standardize.
- **Risk color palette muddiness.** Amber appears in 5 shades across cards/badges/pills. Reduce to 2 amber tones.
- **The 22px Stat tile font** vs the 24-36px serif heros vs the 46-52px display heros create three distinct hierarchy tiers. Add the 18px subtitle tier explicitly.
- **Padding system.** Cards use 14/16/18/20/22/24/28/32px padding. Pick 3 token values and stick.

---

## 18 · Typography & spacing observations (V2)

- **Serif Fraunces is gorgeous.** Use it more sparingly. Reserved for: Cendra's voice (hero serif), Stay narrative, Section heros. Currently it leaks into card titles and inline labels.
- **"opsz" / "SOFT" / "WONK" variation settings appear ~15 times** in mixed configurations. A small set of named display tokens (`display-1`, `display-2`, `headline`, `prose`) would tighten coherence.
- **Hero copy is long-paragraph.** Today's "Cendra handled 1,318 things… 37 want your judgment, 3 at risk, 3 revenue. Start with the damage claim…" is information-dense but reads as one breath. Breaking into two beats — *"The portfolio is moving." / "Start with the damage claim — €640, decision in 38h."* — would scan better.
- **Section padding rhythm.** 56px on Today, 32-40px on Stays, 56px on Brain. Pick one (40 or 48).
- **Body copy line-length.** Several copy blocks are 720px wide. Reading at that width tires PMs. 640-680px is better for sustained reading.

---

## 19 · Interaction timing & animation observations (V2)

- **Live data motion is missing.** The most important single addition would be **one moving number per page**.
- **Drawer slide-in works.** Approve button compress works (R5).
- **Modal pop-in works.**
- **J/K stay-nav whoosh works** (R11).
- **Region cluster cards hover-darken — but no other affordances feel "alive" on hover.** Vendor cards, owner cards, etc. could.
- **Activity ticker fade-in works.** But it doesn't actually receive new entries. Mock the stream: every 30s, prepend a synthetic event.
- **Calm-state breathing dot is perfect.** Could appear in 2-3 more places (top-right Cendra status indicator already has this; maybe on Hold Steady banner too).
- **Approve → "✓ Confirmed" toast missing.** Approval just transitions to the recall window — but no celebratory acknowledgment.

---

## 20 · Information density observations (V2)

- **Today is sparse above the hero, dense below.** The 3 lanes start ~400px down. By the time the PM scrolls to clusters + backlog band + ticker, the page is 1800px tall.
- **Stays is the densest screen.** Hero + lead + same-day turnover + check-in timeline + (review windows comes next) + 4-need-you section + 4-6 guest cards + waiting + all-good + upcoming. Pull at least one of the strips out.
- **Stay Detail's right rail is OK density but the main column has 12 vertical regions.** Hero binding card should be ~50% of above-the-fold; currently it's ~30%.
- **Properties has 5-6 sections before the property list.** Hero + portfolio stats + owners pulse + knowledge sources + scenario coverage + filter pills. Owners pulse is great but it competes with knowledge sources for the "what matters here" slot.
- **Brain → Report is uniform-section.** 4 of 9 sections are "all clean / 0 issues" — they should be one-line collapsed.

---

## 21 · Final verdict

**This is now a Hospitality Stay Operating System.** The R1-R11 work flipped the verdict. The product reads as a cockpit, not a digest. The PM is positioned as co-pilot, not reviewer. The cendra_take voice carries. The §10 chain, prospective replay, owners pulse, cleaning schedule, calm state, 5-tier autonomy, reversals — all present, all credible.

**But three new identity risks have emerged from the additions:**

1. **Static "live" framing.** The cockpit looks live but doesn't move. This is the single biggest credibility risk in the current state.
2. **Strip-of-strips density.** Every release added a horizontal banner. Pages now stack 4-7 pre-context sections before reaching the operational content. The "single decision focus" claim is contradicted by accumulating sections around the single decision.
3. **Steer Cendra command grammar is signage without infrastructure.** Verb chips imply executions that don't happen.

**Where it currently lives:** at the threshold of a true Stay OS. The framing is right. The depth is real. The voice carries. The next phase isn't more surfaces — it's **compression, liveness, and delivering on promises already made.**

**Distance to "true Stay OS, live and trusted":**

Three changes carry 70% of the remaining value:

1. **One moving number per page.** Tick a timer. Tick a countdown. Update the activity ticker every 30s. Decrement an SLA. The instant data moves, the live frame becomes real.
2. **Wire one verb chip end-to-end.** Snooze on Stay Detail flips the stay's autonomy down by one tier for a chosen window, with confirmation UI. Pause on Vendors arms a temporary kill switch with cool-down. The command grammar starts paying back.
3. **Compress competing strips on Stays.** Three top-strips → one consolidated "next-4h operational state" strip.

After those three, the audit moves into Phase II priorities: **financial dimension**, **channel-axis view**, **mobile rebuild**, **end-of-shift posture**, **what-changed-since-last-login delta band**, and **prospective replay promoted out of the indicator**.

**The simplest test for the next iteration:**
Ask a real PM to leave the page open for 10 minutes during a busy moment. If at minute 10 the page looks different than it did at minute 0 — different counts, different rows, a new ticker entry, an SLA visibly closer to zero — they will trust this product permanently. If the page is identical at minute 10, the live frame collapses and the PM downgrades the product to "pretty dashboard" in their head.

**Liveness is the next move. Everything else flows from it.**

---

## Appendix · Quick deltas from V1 → V2

What V1 said was wrong and is now fixed (R1-R11 closed):

- Today as digest → three time-tense lanes ✓
- "37 things" counter framing → cendra_take serif voice ✓ (partial — see P3)
- Ask Cendra Q&A box → Steer Cendra command bar with verb chips ✓ (partial — see R4)
- Stay Detail Hick's law violation → single binding decision + ladder ✓
- No live activity stream → activity ticker ✓ (visual only — see R3)
- Property Brain bi-temporal → as_of slider ✓
- No reversals surface → Reversals last 7d on Trust ✓
- No prospective replay → in CendraStatusPeek ✓ (discovery problem — see R5)
- No cleaner sync surface → Cleaning schedule on Vendors ✓
- No owner pulse → OwnersPulseStrip ✓
- No team capacity → TeamWorkloadPanel ✓
- No check-in window awareness → CheckinWindowTimeline ✓
- No same-day turnover urgency → SameDayTurnoverTape ✓
- No review window awareness → ReviewWindowStrip ✓
- No quiet-state celebration → CalmCelebrationBand ✓
- 3-tier autonomy too coarse → 5-tier ladder ✓
- No stay narrative export → StayNarrativeCard ✓
- No noise complaint card type → NoiseComplaintCard ✓
- HMAC cert popover buried → inline T2-T5 chip on autopilot rows ✓
- No stay-axis filter on audit → BY STAY filter row ✓
- Stay journey rail too long → breadcrumb on cards ✓
- No vendor first-class → Vendors top-level slice ✓
- Confidence decimals → bands ✓

What V1 said was wrong and is **still** not closed (kept on the backlog):

- **No financial dimension.**
- **No channel-axis view.**
- **No mobile.**
- **Live timers don't tick.**
- **Verb chips don't execute commands.**
- **No on-call surface.**
- **No SLA budget concept at portfolio level.**
- **No cross-region comparative view.**

What V2 newly surfaces (the next backlog):

- Static liveness undercuts the live frame
- Strip-of-strips density on Stays
- Stay Detail accumulation (12 vertical regions)
- 9-section Brain Report flattens routine vs notable
- Verb chips advertise without executing
- Discovery debt on prospective replay + Hold Steady + as_of slider + cert details + stay narrative
- Cendra's voice used too widely
- Mono label saturation
- No financial dimension
- No channel-axis view
- No "what changed since you last logged in" delta
- No PM-axis filter
- No data-freshness indicators consistently
- No keyboard cheat-sheet overlay
- No multi-stay context-injection inline
- No end-of-shift posture surface

**Bottom line:** V1 was about *framing*. V2 is about *finishing the framing's promises*. The kernel is locked. The next loop is compression and liveness and delivered promises, not new surfaces.
