// Cendra Agent OS — mock data

window.CENDRA_DATA = {
  user: { name: "Maya Lindqvist", initial: "M", role: "Operations Lead" },
  property_count: 47,
  bookings_today: 31,

  // What Cendra resolved while you were away
  digest: {
    handled: 43,
    drafts_sent: 19,
    info_replies: 14,
    vendors_dispatched: 3,
    upsells_offered: 4,
    facts_confirmed: 3,
    incidents_zero: true,
  },

  // Today queue — exception-first
  exceptions: [
    {
      id: "ex_01",
      kind: "approval",
      tone: "warn",
      title: "Early check-in for Apartment 12 — cleaning not finished",
      guest: "Lukas Berger",
      property: "Karaköy · Apt 12",
      reservation: "BKG-44291",
      channel: "Airbnb",
      arrived: "07:42",
      waiting: "12 min",
      reason: "Approval required",
      summary: "Guest asked to check in at 12:00. Cleaner ETA is 14:30. Same-day turnover. Property rule: do not promise early check-in unless cleaning confirms.",
      preview_action: "Send safe holding reply, ping cleaner for sharper ETA.",
      risk: "low",
      reversibility: "green",
      autonomy: "approval",
    },
    {
      id: "ex_02",
      kind: "blocker",
      tone: "risk",
      title: "Damage claim — $640 on Bosphorus Loft",
      guest: "Aiyana Cole",
      property: "Bosphorus Loft",
      reservation: "BKG-44188",
      channel: "Booking.com",
      arrived: "06:10",
      waiting: "2h 14m",
      reason: "Never auto · evidence ready",
      summary: "Cleaner reported wall damage and broken lamp. Photos attached. Reservation closed yesterday. OTA window for claim closes in 38h.",
      preview_action: "Open evidence pack and decide. Cendra will not charge or refund without you.",
      risk: "high",
      reversibility: "red",
      autonomy: "never",
    },
    {
      id: "ex_03",
      kind: "missing_info",
      tone: "info",
      title: "Property fact missing — does Studio Galata have parking?",
      guest: "Nora Reinhardt",
      property: "Studio Galata",
      reservation: "BKG-44310",
      channel: "Airbnb",
      arrived: "08:15",
      waiting: "21 min",
      reason: "Missing info",
      summary: "Asked twice this month. Property Brain has no answer. Cendra sent a holding reply and is asking you instead of guessing.",
      preview_action: "Confirm in 1 tap — Cendra will remember for all guests.",
      risk: "low",
      reversibility: "green",
      autonomy: "approval",
    },
    {
      id: "ex_04",
      kind: "opportunity",
      tone: "ok",
      title: "Late checkout upsell — 3 eligible departures",
      guest: "—",
      property: "Cihangir House · 3 others",
      reservation: "—",
      channel: "Multi",
      arrived: "—",
      waiting: "—",
      reason: "Revenue opportunity",
      summary: "No same-day arrivals. Late checkout offer at €25 has 41% historical accept rate. Cendra prepared three drafts.",
      preview_action: "Approve as a batch or review one by one.",
      risk: "low",
      reversibility: "green",
      autonomy: "semi",
    },
    {
      id: "ex_05",
      kind: "blocker",
      tone: "warn",
      title: "Bathroom leak at Bosphorus Loft — vendor quote pending",
      guest: "Selin Demir",
      property: "Bosphorus Loft",
      reservation: "BKG-44324",
      channel: "WhatsApp",
      arrived: "08:02",
      waiting: "34 min",
      reason: "Awaiting vendor quote",
      summary: "Guest reported leak. Cendra requested photos (received), confirmed maintenance issue, dispatched plumber, ETA 11:20. Quote €180–€340 — exceeds property auto-spend cap of €150. Needs your approval before vendor proceeds.",
      preview_action: "Approve €340 ceiling, set spend cap exception, or hold for quote.",
      risk: "medium",
      reversibility: "amber",
      autonomy: "approval",
    },
  ],

  // Done by Cendra (collapsed digest)
  done: [
    { id: "d1", time: "07:58", who: "Marta C.", title: "Wi-Fi password sent", workflow: "info_reply", autonomy: "autopilot", reversibility: "green" },
    { id: "d2", time: "07:42", who: "Henrik S.", title: "Checkout reminder + late-checkout offer", workflow: "checkout_reminder", autonomy: "autopilot", reversibility: "green" },
    { id: "d3", time: "07:30", who: "Yui T.", title: "Restaurant recommendation drafted", workflow: "info_reply", autonomy: "autopilot", reversibility: "green" },
    { id: "d4", time: "07:14", who: "Cleaner — Apt 7", title: "Dispatch confirmed for 11:00", workflow: "vendor_dispatch", autonomy: "semi", reversibility: "amber" },
    { id: "d5", time: "06:52", who: "Adèle R.", title: "Quiet hours notice acknowledged", workflow: "policy_reminder", autonomy: "autopilot", reversibility: "green" },
    { id: "d6", time: "06:38", who: "Devansh K.", title: "Stay extension offer accepted", workflow: "extension_offer", autonomy: "approval", reversibility: "amber" },
  ],

  // Conversation timeline for Lukas (ex_01)
  conversation: {
    guest: { name: "Lukas Berger", language: "EN", trips: 3, vip: false },
    booking: { dates: "May 9 → May 12", guests: 2, channel: "Airbnb", value: "$612" },
    property: { name: "Karaköy · Apartment 12", floor: "4F", access: "smart-lock" },
    events: [
      { kind: "guest", time: "07:42", body: "Hi! Can we check in around noon? Also what is the Wi-Fi password?" },
      { kind: "agent_understood", time: "07:42:01", body: "Two requests detected: early check-in + Wi-Fi credentials." },
      { kind: "agent_check", time: "07:42:02", body: "Cross-checked PMS, cleaning schedule, owner rule, last 6 PM decisions on this property." },
      { kind: "agent_finding", time: "07:42:03", body: "Wi-Fi: low-risk, fact present, autopilot eligible.", tone: "ok" },
      { kind: "agent_finding", time: "07:42:03", body: "Early check-in: cleaner ETA 14:30, same-day turnover, owner rule says no promise before clean.", tone: "warn" },
      { kind: "agent_sent", time: "07:42:08", body: "Sent Wi-Fi credentials with one-line greeting (autopilot).", autonomy: "autopilot" },
      { kind: "agent_proposed", time: "07:42:10", body: "Prepared a safe holding reply for early check-in and a cleaner ping. Awaiting your approval.", autonomy: "approval" },
    ],
    proposed_reply: "Hi Lukas! The Wi-Fi password is in your booking confirmation under \"check-in instructions\". For the noon arrival — I'm checking with our cleaning team right now; standard check-in is 15:00 and I'll know within the hour if we can offer something earlier. I'll come back with a confirmed time.",
    proposed_action: {
      label: "Send + ping cleaner",
      detail: "Send guest reply on Airbnb. In parallel, send Marta a Slack message asking for a sharpened ETA. If cleaner confirms before 13:00, auto-promise check-in then; otherwise hold the line at 15:00.",
    },
    decision: {
      title: "Hold the early check-in offer until cleaning confirms",
      reasoning: [
        { body: "Property rule, owner-set: never promise early check-in without cleaning confirmation.", source: "rule:owner-2042" },
        { body: "Cleaner ETA is 14:30 — within historical buffer but not guaranteed.", source: "pms:cleaning-roster" },
        { body: "Past three early check-ins on this unit averaged 35 min slip; one resulted in negative review.", source: "decision-cases · 90d" },
        { body: "Lukas has 3 prior trips, soft-positive sentiment, no urgency cues in language.", source: "guest-memory" },
      ],
      autonomy: "approval",
      risk: "low",
      reversibility: "green",
      reversibility_note: "Reply is fully reversible. No charges, no commitments.",
    },
  },

  // Approval flow — damage claim
  approval: {
    title: "Open damage claim — Bosphorus Loft",
    impact: "Charge guest $640 via OTA resolution center. Notify Aiyana Cole.",
    counterfactual: "If you decline, Cendra files internal-only incident, sends neutral message asking guest to discuss damages.",
    risk: "high",
    reversibility: "red",
    autonomy: "never",
    evidence: [
      { kind: "photo", label: "3 cleaner photos · 06:08 today", source: "vendor:Marta C.", fresh: "fresh" },
      { kind: "fact", label: "Booking value $912 · paid in full", source: "pms:Hostaway", fresh: "live" },
      { kind: "fact", label: "Last cleaning verified clean at 11:14 yesterday", source: "vendor:Marta C.", fresh: "yesterday" },
      { kind: "rule", label: "Booking.com claim window closes in 38h", source: "channel-policy", fresh: "live" },
      { kind: "rule", label: "Damage claim is Never Auto on this account", source: "autonomy:owner-default", fresh: "permanent" },
    ],
    drafts: [
      { tone: "neutral", body: "Hi Aiyana, hope your trip went well. Our cleaning team flagged a few items in the apartment that need attention. Could we set up a short call to discuss?" },
      { tone: "firm", body: "Hi Aiyana, our cleaning team documented damage to the wall and a broken lamp after your stay. We've attached photos and would like to resolve this through the booking platform. Please respond within 24h." },
    ],
  },

  // Autopilot ladder
  workflows: [
    { id: "wf_wifi", name: "Wi-Fi & access info", state: "autopilot", samples: 412, success: 0.99, last_incident: null, hold_min: 0, ready: true, why: "412 cases, 0 overrides, 0 incidents in 90 days. Strong PM match." },
    { id: "wf_check", name: "Checkout reminders & quiet hours", state: "autopilot", samples: 318, success: 0.97, last_incident: null, hold_min: 0, ready: true, why: "Routine, reversible, low variance. Owner approved promotion." },
    { id: "wf_late", name: "Late checkout offer", state: "semi", samples: 96, success: 0.92, last_incident: "23d ago · price mismatch", hold_min: 5, ready: true, why: "Promotion ready: 96 cases, 1 override, 0 incidents in 30d." },
    { id: "wf_resto", name: "Restaurant & local recs", state: "semi", samples: 77, success: 0.95, last_incident: null, hold_min: 3, ready: false, why: "Need 30 more samples for autopilot. Waiting." },
    { id: "wf_check_in", name: "Early check-in", state: "approval", samples: 54, success: 0.88, last_incident: "11d ago · cleaner slip", hold_min: 0, ready: false, why: "Variance with cleaning timing. Recommend keep approval-required." },
    { id: "wf_vendor", name: "Vendor dispatch (low-risk)", state: "approval", samples: 41, success: 0.91, last_incident: null, hold_min: 0, ready: false, why: "Spend rules need explicit budget per property before promotion." },
    { id: "wf_refund", name: "Refunds & comps", state: "never", samples: 0, success: null, last_incident: null, hold_min: 0, ready: false, why: "Pinned by Maya · always human." },
    { id: "wf_charge", name: "Charge guest", state: "never", samples: 0, success: null, last_incident: null, hold_min: 0, ready: false, why: "Pinned by Maya · always human." },
    { id: "wf_damage", name: "Damage claim", state: "never", samples: 0, success: null, last_incident: null, hold_min: 0, ready: false, why: "Pinned by Maya · always human." },
    { id: "wf_access", name: "Access code release", state: "approval", samples: 0, success: null, last_incident: null, hold_min: 0, ready: false, why: "Conditional blocker: never before T-minus-2h on check-in day." },
  ],

  // Property Brain — facts & gaps
  property_facts: [
    { id: "f1", scope: "Studio Galata", fact: "Parking", value: "—", state: "missing", asks: 5, hint: "Asked 5 times in 30 days." },
    { id: "f2", scope: "Karaköy · Apt 12", fact: "Bedroom configuration", value: "1 king + 1 sofa-bed", state: "conflict", asks: 0, hint: "Listing says 1 queen. Cleaner photo shows king. Reconcile." },
    { id: "f3", scope: "Bosphorus Loft", fact: "Quiet hours", value: "23:00 → 08:00", state: "verified", asks: 0, hint: "PM confirmed · 18d ago" },
    { id: "f4", scope: "Cihangir House", fact: "Pet policy", value: "Dogs under 12kg, with deposit", state: "verified", asks: 0, hint: "PM confirmed · 4d ago" },
    { id: "f5", scope: "All properties", fact: "Smoking", value: "Not allowed indoors. Balcony OK except Studio Galata.", state: "verified", asks: 0, hint: "Owner-set rule · 2 months ago" },
    { id: "f6", scope: "Karaköy · Apt 12", fact: "Wi-Fi", value: "KK12-Guest / sapphire-otter-9821", state: "verified", asks: 0, hint: "Auto-rotated 12d ago" },
    { id: "f7", scope: "Studio Galata", fact: "Heating type", value: "—", state: "stale", asks: 1, hint: "Last verified 8 months ago. Source: listing copy." },
    { id: "f8", scope: "All properties", fact: "Quiet hours", value: "23:00 → 08:00", state: "verified", asks: 0, hint: "Building rule." },
  ],

  // Learning suggestions
  learnings: [
    {
      id: "l1",
      title: "When cleaning isn't confirmed, never promise an early check-in time.",
      observed: "You corrected 4 of Cendra's drafts in the last 14 days — each time tightening the early check-in language.",
      examples: 4, overrides: 0, incidents: 0, confidence: 0.92,
      proposed: "Hard rule, owner scope, trigger on early-check-in request when cleaning_status ∈ {scheduled, in-progress, unknown}. Mode: approval-required.",
      simulation: { passed: 12, failed: 0, would_change: "11 of last 30 early check-in messages would route to approval. None auto-promise." },
      risk: "low",
    },
    {
      id: "l2",
      title: "Offer late checkout at €25 instead of €30 on Cihangir House.",
      observed: "Cendra's €30 offer accepts at 22%. Your manual €25 offers accept at 47% (n=18).",
      examples: 18, overrides: 18, incidents: 0, confidence: 0.86,
      proposed: "Pricing rule, property scope. Default late-checkout offer = €25. Mode: autopilot.",
      simulation: { passed: 8, failed: 0, would_change: "Next 30 days projected: +€345 vs current default." },
      risk: "low",
    },
    {
      id: "l3",
      title: "When guest mentions 'leak' or 'flood', dispatch maintenance immediately and notify owner.",
      observed: "3 incidents in 60 days, all manually escalated by you with similar copy.",
      examples: 3, overrides: 0, incidents: 1, confidence: 0.71,
      proposed: "Workflow shortcut. Trigger on lexical match. Mode: semi-auto (5 min hold).",
      simulation: { passed: 3, failed: 0, would_change: "Avg time-to-vendor: 28m → 6m." },
      risk: "medium",
    },
  ],

  // Audit trail
  audit: [
    { id: "au1", time: "Today · 07:42:08", actor: "Cendra", action: "Auto-send", target: "Wi-Fi reply to Lukas Berger", workflow: "info_reply", source: "rule:property-fact", reversible: "green", incident: false },
    { id: "au2", time: "Today · 06:10:22", actor: "Cendra", action: "Stop & escalate", target: "Damage claim — Bosphorus Loft", workflow: "damage_claim", source: "autonomy:never_auto", reversible: "—", incident: false },
    { id: "au3", time: "Today · 06:38:14", actor: "Maya Lindqvist", action: "Approve (with edit)", target: "Stay extension offer to Devansh K.", workflow: "extension_offer", source: "approval-card #ax-9921", reversible: "amber", incident: false },
    { id: "au4", time: "Yest. · 23:14:00", actor: "Cendra", action: "Promote", target: "Wi-Fi & access info → Autopilot", workflow: "promotion_gate", source: "trust-meter", reversible: "—", incident: false },
    { id: "au5", time: "Yest. · 21:02:55", actor: "Maya Lindqvist", action: "Publish rule", target: "Never promise early check-in if cleaning unconfirmed", workflow: "rule_publish", source: "playbook:check-in", reversible: "green", incident: false },
    { id: "au6", time: "Yest. · 14:55:02", actor: "Cendra", action: "Vendor dispatch", target: "Plumber to Bosphorus Loft", workflow: "vendor_dispatch", source: "approval-card #ax-9899", reversible: "amber", incident: false },
    { id: "au7", time: "2d ago · 18:31:40", actor: "Cendra", action: "Pause workflow", target: "Late checkout offer paused for 24h", workflow: "self_demote", source: "incident:price_mismatch", reversible: "—", incident: true },
  ],

  // Activity heartbeat for command bar / today widgets
  activity_now: [
    "Watching 31 active conversations",
    "Cendra resolved 14 messages in the last hour",
    "1 vendor en route — Plumber, ETA 11:20",
    "0 incidents in last 30 days",
  ],

  // ──────────────────────────────────────────────────────────────────
  // V2 — Work Detail extras
  // ──────────────────────────────────────────────────────────────────
  conversation_v2: {
    sla: { breached: false, label: "First-response SLA", remaining_min: 48, total_min: 60 },
    history: [
      { kind: "prior", time: "23d ago", body: "Wi-Fi reset · resolved automatically." },
      { kind: "prior", time: "2 trips ago", body: "Late checkout offered, accepted (€25)." },
    ],
    events_v2: [
      { kind: "guest",            time: "07:41:55", body: "Hi! Could we check in at noon? Also what's the Wi-Fi password?" },
      { kind: "agent_understood", time: "07:41:58", body: "Two intents detected: early check-in (noon) and Wi-Fi.", autonomy: "observe" },
      { kind: "agent_check",      time: "07:41:59", body: "PMS · reservation confirmed · 2 guests · BKG-44291.", source: "Hostaway" },
      { kind: "agent_check",      time: "07:42:01", body: "Cleaning schedule · same-day turnover · cleaner ETA 14:30.", source: "Properly", tone: "warn" },
      { kind: "agent_check",      time: "07:42:02", body: "Owner rule applied · Karaköy LLC · no early-checkin promise.", source: "rule:hr5" },
      { kind: "agent_finding",    time: "07:42:03", body: "Wi-Fi fact verified · low risk · safe to send.", tone: "ok" },
      { kind: "agent_sent",       time: "07:42:08", body: "Sent Wi-Fi credentials with one-line greeting.", autonomy: "autopilot" },
      { kind: "agent_task",       time: "07:42:09", body: "Pinged Marta C. (cleaner) for sharper ETA.", source: "Slack #ops-beyoglu" },
      { kind: "agent_wait",       time: "07:42:10", body: "Waiting on cleaner ETA. Hold reply prepared." },
      { kind: "agent_proposed",   time: "07:42:14", body: "Drafted holding reply for early check-in. Awaiting your approval.", autonomy: "approval" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // V2 — Approval extras (consequence / cost / safer alternative)
  // ──────────────────────────────────────────────────────────────────
  approval_v2: {
    consequences: [
      { label: "Charge",           value: "€640",            tone: "risk" },
      { label: "Channel",          value: "Booking.com Resolution Center", tone: "neutral" },
      { label: "Guest impact",     value: "High · first contact about damage", tone: "warn" },
      { label: "OTA window",       value: "Closes in 38h",   tone: "warn" },
      { label: "Reversibility",    value: "Final once filed", tone: "risk" },
      { label: "Owner notified",   value: "Bosphorus Holdings", tone: "neutral" },
    ],
    safer_alternative: {
      title: "Safer alternative · Cendra suggests",
      body: "Send a neutral message asking Aiyana to discuss damages first. File the claim only if she does not respond within 24h. You keep the OTA window (still 14h of buffer).",
      action: "Use safer alternative",
    },
    decline_consequence: "Cendra will file an internal-only incident, attach the photos, and send a neutral message asking the guest to discuss damages. No charge will be made. The OTA claim window will tick down — Cendra will re-prompt at T−12h.",
    sla: { label: "OTA claim window", remaining_h: 38, total_h: 168 },
    approvers: [
      { role: "Operations Lead", name: "Maya Lindqvist", state: "current" },
      { role: "Owner",           name: "Bosphorus Holdings · Aylin Y.", state: "escalate" },
      { role: "Finance",         name: "Erkan Polat", state: "escalate" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // V2 — Mobile (urgent approval flow, multiple states)
  // ──────────────────────────────────────────────────────────────────
  mobile_v2: {
    push: {
      time: "06:14",
      title: "Cendra · Damage claim needs you",
      body: "Bosphorus Loft · €640 · OTA window 38h",
    },
    quick_card: {
      title: "Damage claim · €640",
      property: "Bosphorus Loft",
      channel: "Booking.com",
      risk: "high",
      reversibility: "red",
      autonomy: "never",
      sla: "OTA window 38h",
      summary: "Cleaner photos show wall damage and broken lamp. Cendra prepared evidence pack and a neutral first message.",
    },
  },
};
