// Cendra Agent OS — portfolio-scale data: properties, owners, integrations,
// team, hard rules, insights, workflow groups, playbook library.

window.CENDRA_DATA2 = {

  // High-signal top strip (Today)
  signals: {
    actions_total: 1318,
    actions_delta: "+42% vs avg week",
    needs_you: 37,
    approvals: 11,
    risks: 14,
    missing_facts: 12,
    revenue_eur: 420,
    incidents: 0,
    promotions_ready: 1,
  },

  // Portfolio filter context — owners, regions, channels, groups
  portfolio: {
    properties_count: 47,
    owners: [
      { id: "own_kara", name: "Karaköy LLC", units: 6, primary: "Mehmet Demir" },
      { id: "own_bos",  name: "Bosphorus Holdings", units: 14, primary: "Aylin Yıldız" },
      { id: "own_cih",  name: "Cihangir Living",    units: 9,  primary: "Selin Çelik" },
      { id: "own_gal",  name: "Galata Estates",     units: 12, primary: "Erkan Polat" },
      { id: "own_ind",  name: "Independent owners (6)", units: 6,  primary: "—" },
    ],
    regions: [
      { id: "reg_eu", name: "Beyoğlu / Karaköy", units: 23 },
      { id: "reg_bs", name: "Beşiktaş",          units: 11 },
      { id: "reg_kd", name: "Kadıköy",           units: 9  },
      { id: "reg_oth",name: "Other",             units: 4  },
    ],
    channels: ["Airbnb", "Booking.com", "Expedia", "VRBO", "Direct", "WhatsApp"],
    groups: [
      { id: "grp_lux", name: "Premium · serviced", units: 8 },
      { id: "grp_std", name: "Standard short-stay", units: 31 },
      { id: "grp_long", name: "Long-stay (28d+)", units: 8 },
    ],
  },

  // Five Today sections (exception-first, hospitality-native)
  today_sections: {
    needs_decision: [
      { id: "n1", title: "Damage claim · €640 · Bosphorus Loft",   sub: "Booking.com window closes in 38h", risk: "high",   reversibility: "red",   autonomy: "never",    reason: "Charge ≥ €500 · Never auto", action: "Open evidence pack", waited: "2h 14m", owner: "Bosphorus Holdings", route: "approval" },
      { id: "n2", title: "Vendor quote · €340 plumber · Bosphorus Loft", sub: "Exceeds €150 auto-spend cap",      risk: "medium", reversibility: "amber", autonomy: "approval", reason: "Spend > property cap",       action: "Approve ceiling or hold",  waited: "34 min",   owner: "Bosphorus Holdings", route: "work_detail:ex_05" },
      { id: "n3", title: "Refund request · €120 · Galata 3",      sub: "Guest claims AC fault, no photos",        risk: "medium", reversibility: "amber", autonomy: "approval", reason: "Refund > €50",              action: "Ask for evidence first",   waited: "47 min",   owner: "Galata Estates",     route: "work" },
      { id: "n4", title: "Early check-in · Karaköy Apt 12",       sub: "Cleaning ETA 14:30, owner rule blocks promise", risk: "low", reversibility: "green", autonomy: "approval", reason: "Owner rule",                 action: "Approve safe holding reply", waited: "12 min", owner: "Karaköy LLC",         route: "work_detail:ex_01" },
    ],
    risk_sla: [
      { id: "r1", title: "Guest waiting 2h 14m · damage claim",     sub: "First-response SLA breached at 90 min",   risk: "high",  reversibility: "red", reason: "SLA breach", action: "Take over",        property: "Bosphorus Loft" },
      { id: "r2", title: "Cleaning sync failed · 6 properties",     sub: "Hostaway → cleaning system, 14m ago",     risk: "medium", reversibility: "amber", reason: "Integration degraded · auto-demote", action: "Open integration",  property: "—" },
      { id: "r3", title: "Negative review risk · Cihangir House",   sub: "Guest sentiment turned at 06:38",         risk: "medium", reversibility: "amber", reason: "Sentiment shift", action: "Review thread",      property: "Cihangir House" },
    ],
    revenue: [
      { id: "v1", title: "Late checkout · 3 eligible departures", sub: "€25 offer · 41% historic accept", est_eur: 75,  action: "Approve as batch", property: "Multi · Cihangir + 2" },
      { id: "v2", title: "Stay extension · BKG-44388",            sub: "1 night, no same-day arrival",     est_eur: 145, action: "Send semi-auto offer", property: "Studio Galata" },
      { id: "v3", title: "Airport transfer upsell · 4 arrivals",  sub: "€30 fixed · partner ready",        est_eur: 200, action: "Schedule sends",       property: "Multi" },
    ],
    missing_knowledge: [
      { id: "k1", scope: "Studio Galata",   fact: "Parking",         asks: 5, action: "Confirm in 1 tap" },
      { id: "k2", scope: "Karaköy · Apt 12", fact: "Bedroom config (conflict)", asks: 0, action: "Reconcile listing vs cleaner photo" },
      { id: "k3", scope: "Galata 3",        fact: "Heating type",    asks: 3, action: "Ask owner" },
      { id: "k4", scope: "Bosphorus Loft",  fact: "Quiet hours after 22:00 from neighbor",   asks: 2, action: "Verify with owner" },
    ],
    done_digest: {
      conversations: 1318,
      drafts: 412,
      info_replies: 287,
      vendor_pings: 18,
      facts_confirmed: 12,
      upsells: 7,
      incidents: 0,
    },
  },

  // Operations queue rows — production-grade row schema
  // state: waiting_user | waiting_guest | waiting_cleaner | waiting_vendor | waiting_pms | blocked_policy | running
  ops_queue: [
    { id: "q1",  guest: "Aiyana Cole",     property: "Bosphorus Loft",     channel: "Booking.com", workflow: "Damage claim",        state: "waiting_user",   sla_min: -94, risk: "high",   reversibility: "red",   autonomy: "never",    next: "Open evidence pack",    owner: "Bosphorus Holdings", team: "Maya" },
    { id: "q2",  guest: "Selin Demir",     property: "Bosphorus Loft",     channel: "WhatsApp",    workflow: "Vendor dispatch",     state: "waiting_vendor", sla_min: 26,  risk: "medium", reversibility: "amber", autonomy: "approval", next: "Approve €340 quote",    owner: "Bosphorus Holdings", team: "Maya" },
    { id: "q3",  guest: "Lukas Berger",    property: "Karaköy · Apt 12",   channel: "Airbnb",      workflow: "Early check-in",      state: "waiting_user",   sla_min: 48,  risk: "low",    reversibility: "green", autonomy: "approval", next: "Approve safe reply",    owner: "Karaköy LLC",       team: "Henrik" },
    { id: "q4",  guest: "Nora Reinhardt",  property: "Studio Galata",      channel: "Airbnb",      workflow: "Missing fact",        state: "waiting_user",   sla_min: 39,  risk: "low",    reversibility: "green", autonomy: "approval", next: "Confirm parking fact",   owner: "Galata Estates",     team: "—" },
    { id: "q5",  guest: "—",               property: "Cihangir House +2",  channel: "Multi",       workflow: "Late checkout offer", state: "running",        sla_min: 240, risk: "low",    reversibility: "green", autonomy: "semi",     next: "Approve batch",          owner: "Cihangir Living",     team: "Henrik" },
    { id: "q6",  guest: "Thomas Geier",    property: "Galata 3",           channel: "Booking.com", workflow: "Refund request",      state: "waiting_guest",  sla_min: 67,  risk: "medium", reversibility: "amber", autonomy: "approval", next: "Awaiting AC photos",     owner: "Galata Estates",     team: "Maya" },
    { id: "q7",  guest: "Hana Park",       property: "Beşiktaş 7",         channel: "Direct",      workflow: "Access code",         state: "blocked_policy", sla_min: 180, risk: "low",    reversibility: "green", autonomy: "approval", next: "Hold until T-2h",        owner: "Independent",         team: "—" },
    { id: "q8",  guest: "Rafael Souza",    property: "Cihangir House",     channel: "Airbnb",      workflow: "Negative sentiment",  state: "waiting_user",   sla_min: 12,  risk: "medium", reversibility: "amber", autonomy: "approval", next: "Review thread",          owner: "Cihangir Living",     team: "Maya" },
    { id: "q9",  guest: "Isabela Vidal",   property: "Karaköy · Apt 9",    channel: "Expedia",     workflow: "Maintenance",         state: "waiting_cleaner",sla_min: 15,  risk: "low",    reversibility: "green", autonomy: "semi",     next: "ETA from Marta",         owner: "Karaköy LLC",       team: "Henrik" },
    { id: "q10", guest: "—",               property: "All units",          channel: "—",           workflow: "Cleaning sync",       state: "blocked_policy", sla_min: -14, risk: "medium", reversibility: "amber", autonomy: "approval", next: "Reconnect Hostaway",    owner: "—",                  team: "Ops" },
  ],

  // Workflow groups — Autopilot v2
  workflow_groups: [
    {
      id: "g_info", name: "Guest info",
      sub: "Reversible, low-risk replies. Cendra is allowed to talk.",
      workflows: [
        { id: "wf_wifi",   name: "Wi-Fi & access info",          state: "autopilot", samples: 412, override: "0.0%", incidents: 0,  hold_min: 0,   scope: "portfolio", last: "Promoted 18d ago", default: "Send + remember", ready: false, why: "412 cases, 0 overrides, 0 incidents in 90 days." },
        { id: "wf_park",   name: "Parking & directions",         state: "autopilot", samples: 246, override: "0.4%", incidents: 0,  hold_min: 0,   scope: "portfolio", last: "Promoted 32d ago", default: "Send fact",        ready: false, why: "Stable. Listings sync in nightly." },
        { id: "wf_check",  name: "Check-in instructions",        state: "autopilot", samples: 318, override: "0.6%", incidents: 0,  hold_min: 0,   scope: "portfolio", last: "Promoted 14d ago", default: "Send T-12h",      ready: false, why: "Rotates per smart-lock window." },
        { id: "wf_recs",   name: "Local recommendations",        state: "semi",     samples: 77,  override: "2.6%", incidents: 0,  hold_min: 3,   scope: "portfolio", last: "—",                default: "Draft & send",      ready: false, why: "Need 30 more samples for autopilot." },
      ],
    },
    {
      id: "g_stay", name: "Stay operations",
      sub: "Real-world side-effects. Cendra coordinates, you approve when timing slips.",
      workflows: [
        { id: "wf_early",  name: "Early check-in",                state: "approval", samples: 54,  override: "12.0%", incidents: 1, hold_min: 0,   scope: "owner",     last: "11d ago · cleaner slip", default: "Holding reply", ready: false, why: "Variance with cleaning timing. Recommend keep approval." },
        { id: "wf_late",   name: "Late checkout offer",           state: "semi",     samples: 96,  override: "0.0%",  incidents: 0, hold_min: 5,   scope: "portfolio", last: "Demoted 23d ago",   default: "Offer €25",      ready: true,  why: "Promotion ready: 96 cases, 0 overrides, 0 incidents in 30d." },
        { id: "wf_clean",  name: "Housekeeping coordination",     state: "semi",     samples: 184, override: "1.6%",  incidents: 0, hold_min: 5,   scope: "portfolio", last: "—",                 default: "Ping cleaner",   ready: false, why: "Held in semi until cleaning sync stabilises." },
        { id: "wf_maint",  name: "Maintenance triage",            state: "semi",     samples: 64,  override: "3.1%",  incidents: 1, hold_min: 5,   scope: "portfolio", last: "Demoted 4d ago",    default: "Photo → vendor", ready: false, why: "1 misclassified leak. Hold semi for 7 more days." },
        { id: "wf_vendor", name: "Vendor dispatch (≤€150)",      state: "approval", samples: 41,  override: "—",     incidents: 0, hold_min: 0,   scope: "property",  last: "—",                 default: "Approval",        ready: false, why: "Spend rules need explicit budget per property." },
      ],
    },
    {
      id: "g_rev", name: "Revenue",
      sub: "Cendra spots opportunities. You set the ceiling.",
      workflows: [
        { id: "wf_late_up",name: "Late checkout upsell",          state: "semi",     samples: 143, override: "0.0%", incidents: 0, hold_min: 5,   scope: "portfolio", last: "—", default: "Offer €25", ready: true, why: "Same family as late checkout offer. Stable." },
        { id: "wf_extend", name: "Stay extension",                state: "semi",     samples: 76,  override: "1.3%", incidents: 0, hold_min: 5,   scope: "portfolio", last: "—", default: "Match nightly", ready: false, why: "Held until pricing rule for high season is set." },
        { id: "wf_transfer",name: "Airport transfer",             state: "approval", samples: 38,  override: "—",    incidents: 0, hold_min: 0,   scope: "portfolio", last: "—", default: "Quote partner", ready: false, why: "New partner. Approval until 100 cases clean." },
        { id: "wf_exp",    name: "Experiences (food, tour)",      state: "observe",  samples: 12,  override: "—",    incidents: 0, hold_min: 0,   scope: "portfolio", last: "—", default: "Observe only",  ready: false, why: "Catalogue still being curated." },
      ],
    },
    {
      id: "g_risk", name: "Risk · Never auto",
      sub: "These workflows will never run without you. Cendra prepares evidence and waits.",
      workflows: [
        { id: "wf_dmg",    name: "Damage claim",        state: "never", samples: 0, override: "—", incidents: 0, hold_min: 0, scope: "portfolio", last: "—", default: "Evidence pack", ready: false, why: "Pinned by Maya · always human." },
        { id: "wf_refund", name: "Refunds & compensation", state: "never", samples: 0, override: "—", incidents: 0, hold_min: 0, scope: "portfolio", last: "—", default: "Evidence + draft", ready: false, why: "Pinned · always human." },
        { id: "wf_charge", name: "Charge guest",        state: "never", samples: 0, override: "—", incidents: 0, hold_min: 0, scope: "portfolio", last: "—", default: "Approval", ready: false, why: "Pinned · always human." },
        { id: "wf_cancel", name: "Cancellation exception", state: "never", samples: 0, override: "—", incidents: 0, hold_min: 0, scope: "portfolio", last: "—", default: "Approval", ready: false, why: "Pinned · always human." },
        { id: "wf_access", name: "Access code release",  state: "approval", samples: 0, override: "—", incidents: 0, hold_min: 0, scope: "portfolio", last: "—", default: "Hold until T-2h", ready: false, why: "Conditional blocker: never before T-minus-2h on check-in day." },
        { id: "wf_legal",  name: "Legal / safety incident", state: "never", samples: 0, override: "—", incidents: 0, hold_min: 0, scope: "portfolio", last: "—", default: "Escalate", ready: false, why: "Pinned · always human." },
        { id: "wf_negotiate",name:"Price negotiation",   state: "never", samples: 0, override: "—", incidents: 0, hold_min: 0, scope: "portfolio", last: "—", default: "Approval", ready: false, why: "Pinned · always human." },
      ],
    },
    {
      id: "g_owner", name: "Owner & reporting",
      sub: "Internal-only. No guest impact.",
      workflows: [
        { id: "wf_owner_up",  name: "Owner update on incidents",    state: "autopilot", samples: 96,  override: "0.0%", incidents: 0, hold_min: 0, scope: "portfolio", last: "Promoted 60d ago", default: "Send digest", ready: false, why: "Internal-only. Stable." },
        { id: "wf_owner_wk",  name: "Weekly owner report",          state: "semi",     samples: 24,   override: "—",    incidents: 0, hold_min: 30,scope: "portfolio", last: "—", default: "Send Friday 17:00", ready: true, why: "Promotion ready." },
        { id: "wf_owner_app", name: "Owner approval requests",      state: "approval", samples: 18,   override: "—",    incidents: 0, hold_min: 0, scope: "portfolio", last: "—", default: "Wait for owner", ready: false, why: "Owner-side action. Cannot auto." },
      ],
    },
  ],

  // Playbook library
  playbook_categories: [
    {
      id: "cat_ci", name: "Check-in & access",
      playbooks: [
        { id: "pb_early",   name: "Early check-in handling",         state: "live",      autonomy: "approval", scope: "Karaköy LLC · 6 props", coverage: "12/12 sims pass", changed: "Maya · 2d ago", incident: "—", examples: 11 },
        { id: "pb_access",  name: "Access code release window",      state: "live",      autonomy: "approval", scope: "Portfolio · 47 props",  coverage: "—",            changed: "Maya · 14d ago", incident: "—", examples: 0 },
        { id: "pb_lock",    name: "Smart lock failure fallback",     state: "needs_review",autonomy: "approval", scope: "Portfolio · 47 props",  coverage: "8/9 sims pass", changed: "Henrik · 6d ago", incident: "1 · 32d ago", examples: 4 },
      ],
    },
    {
      id: "cat_clean", name: "Housekeeping & maintenance",
      playbooks: [
        { id: "pb_late",    name: "Late checkout offer",             state: "live",     autonomy: "semi",     scope: "Portfolio · 47 props",  coverage: "21/21 pass", changed: "Auto · 3d ago",   incident: "—", examples: 96 },
        { id: "pb_leak",    name: "Leak & water damage triage",      state: "live",     autonomy: "semi",     scope: "Portfolio · 47 props",  coverage: "3/3 pass",   changed: "Maya · 10d ago",  incident: "1 · 60d ago", examples: 3 },
        { id: "pb_clean",   name: "Same-day turnover risk",          state: "draft",    autonomy: "approval", scope: "Karaköy LLC",          coverage: "in progress", changed: "Maya · just now", incident: "—", examples: 0 },
      ],
    },
    {
      id: "cat_money", name: "Money & damage",
      playbooks: [
        { id: "pb_dmg",     name: "Damage claim evidence pack",      state: "live",     autonomy: "never",    scope: "Portfolio · 47 props",  coverage: "—",          changed: "Maya · 90d ago",   incident: "—", examples: 6 },
        { id: "pb_refund",  name: "Refund < €50 fast path",         state: "live",     autonomy: "approval", scope: "Portfolio · 47 props",  coverage: "30/30 pass", changed: "Maya · 21d ago",  incident: "—", examples: 18 },
        { id: "pb_refund2", name: "Refund €50–€200",                 state: "staging",  autonomy: "approval", scope: "Portfolio · 47 props",  coverage: "27/30 pass", changed: "Maya · 4d ago",   incident: "—", examples: 0 },
      ],
    },
    {
      id: "cat_rev", name: "Revenue & upsells",
      playbooks: [
        { id: "pb_extend",  name: "Stay extension offer",            state: "live",     autonomy: "semi",     scope: "Portfolio · 47 props",  coverage: "12/12 pass", changed: "Auto · 7d ago",  incident: "—", examples: 76 },
        { id: "pb_air",     name: "Airport transfer offer",          state: "live",     autonomy: "approval", scope: "Portfolio · 47 props",  coverage: "—",          changed: "Maya · 30d ago", incident: "—", examples: 38 },
        { id: "pb_review",  name: "Review recovery (post-stay)",     state: "draft",    autonomy: "draft",    scope: "Cihangir Living",       coverage: "in progress", changed: "Maya · just now", incident: "—", examples: 0 },
      ],
    },
    {
      id: "cat_owner", name: "Owner & reporting",
      playbooks: [
        { id: "pb_inc",     name: "Owner incident notification",     state: "live",     autonomy: "autopilot", scope: "Portfolio · 47 props", coverage: "—",         changed: "Auto · 60d ago",  incident: "—", examples: 96 },
        { id: "pb_wk",      name: "Weekly owner report",             state: "live",     autonomy: "semi",      scope: "Portfolio · 47 props", coverage: "—",         changed: "Maya · 90d ago",  incident: "—", examples: 24 },
      ],
    },
    {
      id: "cat_safe", name: "Emergency & safety",
      playbooks: [
        { id: "pb_safety",  name: "Safety incident escalation",      state: "live",     autonomy: "never",    scope: "Portfolio · 47 props", coverage: "—",          changed: "Maya · 120d ago", incident: "—", examples: 0 },
        { id: "pb_legal",   name: "Legal threat language",           state: "live",     autonomy: "never",    scope: "Portfolio · 47 props", coverage: "—",          changed: "Maya · 90d ago",  incident: "—", examples: 1 },
      ],
    },
  ],

  // Properties (portfolio brain)
  properties_brain: [
    { id: "p_kara12",  name: "Karaköy · Apt 12",   owner: "Karaköy LLC",         region: "Beyoğlu", units: 1, asks: 14, missing: 1, conflicts: 1, stale: 0, blocked: 0, integrations: "all_ok",   risk: "low",    last_clean: "Yest. 11:14" },
    { id: "p_kara9",   name: "Karaköy · Apt 9",    owner: "Karaköy LLC",         region: "Beyoğlu", units: 1, asks: 6,  missing: 0, conflicts: 0, stale: 1, blocked: 0, integrations: "all_ok",   risk: "low",    last_clean: "Today 09:42" },
    { id: "p_bos",     name: "Bosphorus Loft",     owner: "Bosphorus Holdings",  region: "Beşiktaş",units: 1, asks: 22, missing: 1, conflicts: 0, stale: 0, blocked: 1, integrations: "degraded", risk: "high",   last_clean: "Yest. 14:00" },
    { id: "p_studgal", name: "Studio Galata",      owner: "Galata Estates",      region: "Beyoğlu", units: 1, asks: 18, missing: 4, conflicts: 0, stale: 2, blocked: 1, integrations: "all_ok",   risk: "medium", last_clean: "Today 08:10" },
    { id: "p_cih",     name: "Cihangir House",     owner: "Cihangir Living",     region: "Beyoğlu", units: 1, asks: 11, missing: 0, conflicts: 0, stale: 0, blocked: 0, integrations: "all_ok",   risk: "medium", last_clean: "Today 07:55" },
    { id: "p_gal3",    name: "Galata 3",           owner: "Galata Estates",      region: "Beyoğlu", units: 1, asks: 8,  missing: 2, conflicts: 0, stale: 0, blocked: 0, integrations: "all_ok",   risk: "medium", last_clean: "Yest. 15:30" },
    { id: "p_bes7",    name: "Beşiktaş 7",         owner: "Independent",         region: "Beşiktaş",units: 1, asks: 4,  missing: 0, conflicts: 0, stale: 1, blocked: 0, integrations: "all_ok",   risk: "low",    last_clean: "2d ago" },
    { id: "p_kara4",   name: "Karaköy · Apt 4",    owner: "Karaköy LLC",         region: "Beyoğlu", units: 1, asks: 3,  missing: 0, conflicts: 0, stale: 0, blocked: 0, integrations: "all_ok",   risk: "low",    last_clean: "Today 10:00" },
  ],

  // Property detail (Karaköy Apt 12 — drilldown)
  property_detail: {
    id: "p_kara12",
    name: "Karaköy · Apartment 12",
    owner: "Karaköy LLC", primary_contact: "Mehmet Demir",
    region: "Beyoğlu", group: "Standard short-stay",
    floor: "4F", access: "Smart-lock · KK12-Yale-9821", wifi: "KK12-Guest / sapphire-otter-9821",
    integrations: { pms: "Hostaway · OK", channels: ["Airbnb · OK", "Booking · OK"], lock: "Yale Connect · OK", clean: "Properly · OK" },
    facts_summary: { verified: 24, missing: 1, conflicts: 1, stale: 0, internal: 7 },
    risks: ["Same-day turnovers cluster Fri/Sat", "Smart-lock pairing failed once · 60d ago"],
    fact_groups: [
      { label: "Guest-facing facts", facts: [
        { fact: "Wi-Fi",            value: "KK12-Guest / sapphire-otter-9821", source: "Smart-lock auto", fresh: "12d", visible: "guest", state: "verified", used_in: ["wf_wifi"] },
        { fact: "Quiet hours",      value: "23:00 → 08:00",                    source: "Building rule",   fresh: "60d", visible: "guest", state: "verified", used_in: ["wf_wifi","wf_check"] },
        { fact: "Pets",             value: "Not allowed",                      source: "Owner rule",      fresh: "120d",visible: "guest", state: "verified", used_in: ["wf_wifi"] },
        { fact: "Bedroom",          value: "1 king + 1 sofa-bed",              source: "Cleaner photo · listing says 1 queen", fresh: "live", visible: "internal", state: "conflict", used_in: ["wf_wifi"] },
      ]},
      { label: "Internal notes",    facts: [
        { fact: "Cleaner notes",    value: "Hot water heater needs flush every 30 days",       source: "Marta C.",   fresh: "8d",  visible: "internal", state: "verified", used_in: ["wf_maint"] },
        { fact: "Owner preference", value: "Never offer late checkout if same-day turnover",   source: "Owner rule", fresh: "32d", visible: "internal", state: "verified", used_in: ["wf_late"] },
      ]},
      { label: "Missing",           facts: [
        { fact: "Heating type",     value: "—", source: "—", fresh: "—", visible: "—", state: "missing", used_in: [] },
      ]},
    ],
  },

  // Integrations health
  integrations: [
    { id: "int_pms",     name: "Hostaway PMS",         category: "PMS",     status: "connected", last_sync: "2 min ago",  affects_props: 47, affects_workflows: ["wf_check","wf_clean","wf_wifi","all"], fallback: "—",                       open_incident: false },
    { id: "int_airbnb",  name: "Airbnb",               category: "Channel", status: "connected", last_sync: "1 min ago",  affects_props: 47, affects_workflows: ["wf_wifi","wf_check","wf_late_up"],     fallback: "—",                       open_incident: false },
    { id: "int_book",    name: "Booking.com",          category: "Channel", status: "connected", last_sync: "3 min ago",  affects_props: 47, affects_workflows: ["wf_wifi","wf_check","wf_late_up"],     fallback: "—",                       open_incident: false },
    { id: "int_exp",     name: "Expedia",              category: "Channel", status: "connected", last_sync: "5 min ago",  affects_props: 26, affects_workflows: ["wf_wifi","wf_check"],                  fallback: "—",                       open_incident: false },
    { id: "int_clean",   name: "Properly cleaning",    category: "Ops",     status: "degraded",  last_sync: "14 min ago", affects_props: 6,  affects_workflows: ["wf_clean","wf_early"],                fallback: "Auto-demoted early check-in to approval-required for 6 properties.", open_incident: true },
    { id: "int_lock",    name: "Yale Connect locks",   category: "Ops",     status: "connected", last_sync: "30 sec ago", affects_props: 41, affects_workflows: ["wf_access","wf_check"],                fallback: "—",                       open_incident: false },
    { id: "int_wa",      name: "WhatsApp Business",    category: "Channel", status: "connected", last_sync: "10 sec ago", affects_props: 47, affects_workflows: ["wf_wifi","wf_recs"],                  fallback: "—",                       open_incident: false },
    { id: "int_pay",     name: "Stripe payments",      category: "Money",   status: "connected", last_sync: "live",       affects_props: 47, affects_workflows: ["wf_charge","wf_refund"],               fallback: "—",                       open_incident: false },
    { id: "int_email",   name: "Email (Postmark)",     category: "Channel", status: "connected", last_sync: "live",       affects_props: 47, affects_workflows: ["wf_owner_wk","wf_owner_up"],          fallback: "—",                       open_incident: false },
    { id: "int_vendor",  name: "Vendor dispatch (Tradify)", category: "Ops", status: "connected", last_sync: "8 min ago", affects_props: 47, affects_workflows: ["wf_vendor","wf_maint"],                fallback: "—",                       open_incident: false },
    { id: "int_cal",     name: "Calendar sync",        category: "PMS",     status: "connected", last_sync: "live",       affects_props: 47, affects_workflows: ["all"],                                fallback: "—",                       open_incident: false },
  ],

  // Hard rules
  hard_rules: [
    { id: "hr1", text: "Never send access code before check-in day 12:00.",                  scope: "Portfolio",   owner: "Maya",  created: "120d ago", last_triggered: "Yest. 23:01", workflows: ["wf_access"], coverage: "100% sims pass" },
    { id: "hr2", text: "Never charge guest without finance approval.",                       scope: "Portfolio",   owner: "Maya",  created: "180d ago", last_triggered: "—",          workflows: ["wf_charge"], coverage: "—" },
    { id: "hr3", text: "Never offer refund above €50 without owner approval.",               scope: "Portfolio",   owner: "Owner",created: "180d ago", last_triggered: "4d ago",     workflows: ["wf_refund"], coverage: "30/30 pass" },
    { id: "hr4", text: "Never ask OTA guest to pay outside platform.",                       scope: "Portfolio",   owner: "Maya",  created: "180d ago", last_triggered: "11d ago",    workflows: ["all"],       coverage: "—" },
    { id: "hr5", text: "Never promise early check-in unless cleaning is confirmed.",         scope: "Karaköy LLC", owner: "Owner",created: "60d ago",  last_triggered: "12 min ago", workflows: ["wf_early"], coverage: "12/12 pass" },
    { id: "hr6", text: "Never auto-respond to legal threats — escalate immediately.",        scope: "Portfolio",   owner: "Maya",  created: "180d ago", last_triggered: "—",          workflows: ["wf_legal"], coverage: "—" },
    { id: "hr7", text: "Never charge a card on file beyond authorized booking total.",       scope: "Portfolio",   owner: "Finance",created: "180d ago",last_triggered: "—",          workflows: ["wf_charge"], coverage: "—" },
  ],

  // Team
  team: [
    { id: "u_maya",   name: "Maya Lindqvist",  role: "Operations Lead",  avatar: "M", scope: "Portfolio", on_shift: true,  approvals_pending: 4 },
    { id: "u_henrik", name: "Henrik Sørensen", role: "Property Manager", avatar: "H", scope: "Beyoğlu",  on_shift: true,  approvals_pending: 1 },
    { id: "u_yui",    name: "Yui Tanaka",      role: "Guest Support",    avatar: "Y", scope: "Portfolio", on_shift: true,  approvals_pending: 0 },
    { id: "u_adele",  name: "Adèle Roux",      role: "Night Manager",    avatar: "A", scope: "Portfolio", on_shift: false, approvals_pending: 0 },
    { id: "u_finance",name: "Erkan Polat",     role: "Finance",          avatar: "E", scope: "Portfolio", on_shift: true,  approvals_pending: 1 },
    { id: "u_marta",  name: "Marta Costa",     role: "Cleaner",          avatar: "Mc",scope: "Beyoğlu",  on_shift: true,  approvals_pending: 0 },
  ],

  // Insights — Ask Cendra explorer
  insights: {
    suggested: [
      "Why did automation drop this week?",
      "Which properties create the most check-in issues?",
      "Where are we missing revenue?",
      "Which vendor causes repeated follow-ups?",
      "Which owners have the most approval delays?",
      "What knowledge gaps cost us the most replies?",
    ],
    answer_demo: {
      question: "Why did automation drop this week?",
      headline: "Cleaning sync degraded for 6 Beyoğlu properties on Tue afternoon.",
      detail: "Cendra auto-demoted early check-in and housekeeping coordination from semi-auto to approval-required for those 6 properties. Approvals jumped from 31 to 64. Volume returns to baseline once Properly reconnects.",
      evidence: [
        { kind: "Automation rate", value: "94.2% → 88.1%", delta: "−6.1pp" },
        { kind: "Affected properties", value: "6 of 47" },
        { kind: "Affected workflows", value: "Early check-in, Housekeeping" },
        { kind: "Root cause", value: "Properly cleaning sync degraded · open since 14:02 Tue" },
      ],
      next: ["Open Properly integration", "Pause early check-in promotions until reconnect", "Notify affected owners"],
    },
    trends: [
      { label: "Automation rate · 7d",     value: "88.1%", delta: "−6.1pp", tone: "warn" },
      { label: "Override rate · 7d",       value: "1.2%",  delta: "+0.4pp", tone: "warn" },
      { label: "Avg first-response · 7d",  value: "47s",   delta: "−9s",    tone: "ok" },
      { label: "Review risk flags · 7d",   value: "3",     delta: "+2",     tone: "warn" },
      { label: "Revenue captured · 7d",    value: "€2,340",delta: "+18%",   tone: "ok" },
      { label: "Knowledge confirmed · 7d", value: "47 facts",delta: "+12",  tone: "ok" },
    ],
    bottlenecks: [
      { kind: "Knowledge gap",    text: "Studio Galata · parking asked 5× in 30d. Cendra waiting on you.", est_loss: "€60 in revenue questions" },
      { kind: "Vendor",           text: "Plumber A. Sözen averages 2.3 follow-ups per dispatch.",          est_loss: "Time only" },
      { kind: "Owner approval",   text: "Bosphorus Holdings averages 4h 12m response time on approvals.",  est_loss: "1 missed claim window in 60d" },
      { kind: "Integration",      text: "Properly cleaning has degraded twice in 30d (this is one of them).", est_loss: "Auto-demotions" },
    ],
    opportunities: [
      { kind: "Late checkout",   text: "11 eligible departures next 7 days · €25 offer · 41% accept.", est_eur: 113 },
      { kind: "Stay extension",  text: "4 likely extensions detected for Cihangir + Karaköy.",          est_eur: 480 },
      { kind: "Airport transfer",text: "12 arrivals next 7 days · partner ready · €30 fixed.",          est_eur: 144 },
      { kind: "Orphan night",    text: "2 orphan nights detected for Galata 3 · auto-discount eligible.", est_eur: 180 },
    ],
  },

  // Onboarding state (real PMs setting up)
  onboarding: {
    progress: 6, total: 10,
    steps: [
      { id: 1,  label: "Connect PMS",                done: true,  detail: "Hostaway · 47 properties imported" },
      { id: 2,  label: "Connect channels",           done: true,  detail: "Airbnb, Booking, Expedia, WhatsApp" },
      { id: 3,  label: "Import properties & listings",done: true, detail: "47 of 47 mapped" },
      { id: 4,  label: "Import SOPs",                done: true,  detail: "12 docs · 9 playbooks structured" },
      { id: 5,  label: "Review Property Brain gaps", done: true,  detail: "12 gaps remain · review when ready" },
      { id: 6,  label: "Set hard never-auto rules",  done: true,  detail: "7 rules pinned" },
      { id: 7,  label: "Choose playbook templates",  done: false, detail: "3 of 14 selected" },
      { id: 8,  label: "Start Observe mode",         done: false, detail: "—" },
      { id: 9,  label: "Review first 50 decisions",  done: false, detail: "Cendra will queue them" },
      { id: 10, label: "Promote low-risk workflows", done: false, detail: "Recommendation: Wi-Fi, parking, info replies" },
    ],
    ready: ["Wi-Fi & parking answers · Cendra is ready to answer."],
    blocked: ["Early check-in blocked until cleaning integration is connected."],
    pinned: ["Refunds pinned to never-auto", "Damage claims pinned to never-auto"],
    facts_pending: 12,
  },

  // Failure / state messages
  failures: [
    { kind: "PMS sync failed",        what_happened: "Hostaway returned 502 at 09:14:02.",  did: "Cendra paused write actions, kept read-only.", action: "Retry now or wait — Cendra retries every 60s.", consequence: "Affected workflows pause until reconnect." },
    { kind: "OTA policy conflict",    what_happened: "Airbnb policy blocked promised early check-in window.", did: "Cendra rolled back the promise and sent a corrective draft.", action: "Approve corrective message.", consequence: "If unanswered, guest sees standard check-in time." },
    { kind: "No vendor available",    what_happened: "All 3 plumbers declined within 8 minutes.", did: "Cendra escalated to backup list and notified you.", action: "Approve backup vendor or call directly.", consequence: "If unanswered, leak persists." },
    { kind: "Guest threatens review", what_happened: "Sentiment turned at 06:38, lexical match: 'bad review'.", did: "Cendra paused outbound, drafted apology, escalated.", action: "Take over thread.", consequence: "Cendra will not message until you intervene." },
    { kind: "Autopilot demoted",      what_happened: "Late checkout offer hit 1 incident threshold.", did: "Auto-demoted to semi-auto · 5-min hold.", action: "Review demotion or accept.", consequence: "Revenue automation slows by ~12%." },
  ],

  // ──────────────────────────────────────────────────────────────────
  // Guest journey — the operational "who is in my home now / arriving"
  // Past stays excluded by design. Open post-stay cases live in Today.
  // ──────────────────────────────────────────────────────────────────
  guests_journey: {
    checking_in_today: [
      {
        id: "ji_lukas",
        name: "Lukas Berger", initial: "L", language: "EN", trips: 3, sentiment: "soft-positive",
        property: "Karaköy · Apt 12", owner: "Karaköy LLC", channel: "Airbnb",
        nights_total: 4, eta_label: "Today · noon (asked)", checkin_official: "15:00", checkout_at: "Fri 11:00",
        status: "needs_you", status_reason: "Approve safe early-checkin reply", sla_min: 48,
        confidence: 0.86, last_contact: "07:42 · 33m ago",
        cendra_take: "Lukas asked at 07:42 to check in at noon and for the Wi-Fi. Same-day turnover — cleaner ETA 14:30. Owner rule blocks an early-checkin promise until cleaning confirms. Wi-Fi was auto-answered. The remaining holding reply is drafted, reversible, and waiting on you.",
        prep: [
          { label: "Cleaning", value: "ETA 14:30 — same-day turnover", tone: "warn" },
          { label: "Smart-lock", value: "Code rotated 09:00 · ready", tone: "ok" },
          { label: "Wi-Fi sent", value: "Auto · 07:42:08", tone: "ok" },
          { label: "ID verified", value: "Yes", tone: "ok" },
        ],
        cards: [
          {
            type: "draft_reply",
            channel: "Airbnb",
            preview: "Hi Lukas! The Wi-Fi password is in your booking confirmation under \"check-in instructions\". For noon — I'm checking with our cleaning team right now; standard check-in is 15:00 and I'll know within the hour if we can offer something earlier. I'll come back with a confirmed time.",
            tone_chips: ["Warmer", "Tighter", "More formal"],
            why: "Owner rule · cleaner ETA 14:30 · 3 prior trips · low SLA pressure.",
            primary: "Approve & send",
          },
          {
            type: "vendor_dispatch",
            vendor: "Marta C. · cleaner",
            via: "Slack #ops-beyoglu",
            status: "Pinged 07:42 · awaiting sharper ETA",
            note: "If Marta confirms before 13:00, Cendra auto-promises that time.",
          },
        ],
        follow_ups: [
          "Show the full guest thread",
          "What's the cleaning history at this unit?",
          "Why didn't Cendra promise noon?",
          "Draft a tighter reply",
          "Show all 3 prior trips",
        ],
      },
      {
        id: "ji_nora",
        name: "Nora Reinhardt", initial: "N", language: "DE", trips: 0, sentiment: "neutral · first stay",
        property: "Studio Galata", owner: "Galata Estates", channel: "Airbnb",
        nights_total: 3, eta_label: "Today · 16:00", checkin_official: "15:00", checkout_at: "Wed 11:00",
        status: "needs_you", status_reason: "Confirm parking fact",
        sla_min: 39, confidence: 0.42, last_contact: "08:15 · 21m ago",
        cendra_take: "Nora asked twice about parking on Sun and Mon. Studio Galata has no parking fact in the brain — I've held the answer and sent a placeholder. One tap from you and I'll remember it for everyone.",
        prep: [
          { label: "Cleaning", value: "Cleared 08:10 · ready", tone: "ok" },
          { label: "Access code", value: "Sends T-2h auto", tone: "ok" },
          { label: "ID verified", value: "Pending", tone: "warn" },
          { label: "Parking fact", value: "Missing — asked 5×", tone: "warn" },
        ],
        cards: [
          {
            type: "fact_suggestion",
            scope: "Studio Galata",
            fact: "Parking",
            asks: 5,
            options: ["Yes · paid garage 100m away", "Yes · free street parking", "No · public transit only"],
            why: "Asked 5× in 30 days. Cendra will remember and answer the next guest automatically.",
          },
        ],
        follow_ups: [
          "Show the original parking questions",
          "What other facts is this property missing?",
          "Draft a check-in note with directions",
          "Show booking details",
        ],
      },
      {
        id: "ji_hana",
        name: "Hana Park", initial: "H", language: "EN", trips: 1, sentiment: "neutral",
        property: "Beşiktaş 7", owner: "Independent", channel: "Direct",
        nights_total: 2, eta_label: "Today · 18:30", checkin_official: "15:00", checkout_at: "Tue 11:00",
        status: "waiting", status_reason: "Access code holds until T-2h",
        sla_min: 180, confidence: 0.94, last_contact: "Yesterday 17:40",
        cendra_take: "Hana asked for the access code early. Hard rule: never release before T-minus-2h. I sent a polite hold note. The code will release automatically at 16:30 unless you change it.",
        prep: [
          { label: "Cleaning", value: "Done 2d ago — verify today", tone: "warn" },
          { label: "Access code", value: "Releases auto at 16:30", tone: "ok" },
          { label: "Smart-lock", value: "Paired", tone: "ok" },
          { label: "Wi-Fi sent", value: "Auto · yesterday", tone: "ok" },
        ],
        cards: [
          {
            type: "policy_hold",
            rule: "Never send access code before check-in day 12:00 / T-2h whichever later.",
            releases_at: "Today 16:30",
            override_options: ["Release now (override rule)", "Confirm hold", "Edit hold message"],
            why: "Portfolio-wide hard rule · last triggered yesterday 23:01.",
          },
        ],
        follow_ups: [
          "Show the hold message I sent",
          "Why is the access code held?",
          "Override and release the code now",
          "When did the cleaner last verify this unit?",
        ],
      },
    ],

    in_house: [
      {
        id: "jh_selin",
        name: "Selin Demir", initial: "S", language: "TR", trips: 2, sentiment: "concerned",
        property: "Bosphorus Loft", owner: "Bosphorus Holdings", channel: "WhatsApp",
        nights_done: 2, nights_total: 3, checkout_at: "Wed 11:00",
        status: "needs_you", status_reason: "Approve €340 plumber quote",
        sla_min: 26, confidence: 0.74, last_contact: "08:02 · 34m ago",
        cendra_take: "Selin reported a bathroom leak this morning. Photos received, leak confirmed, plumber dispatched — ETA 11:20. Quote €180–€340. The ceiling exceeds the property's €150 auto-spend cap, so I'm holding before work starts.",
        prep: [
          { label: "Issue", value: "Bathroom leak · confirmed", tone: "warn" },
          { label: "Vendor", value: "Plumber A. Sözen · ETA 11:20", tone: "ok" },
          { label: "Photos", value: "3 received 08:01", tone: "ok" },
          { label: "Owner notified", value: "Yes · acknowledged", tone: "ok" },
        ],
        cards: [
          {
            type: "approval",
            title: "Approve plumber ceiling · €340",
            value: "€340 ceiling",
            range: "€180–€340 quoted",
            why: "Exceeds Bosphorus Loft auto-spend cap of €150. Cap is per-property, owner-set.",
            options: ["Approve €340", "Approve €180 only", "Counter-quote", "Hold for second quote"],
            risk: "medium", reversibility: "amber",
          },
          {
            type: "draft_reply",
            channel: "WhatsApp",
            preview: "Hi Selin — plumber confirmed for 11:20, sorry for the inconvenience. He'll knock first; please leave the bathroom door open if you can. I'll follow up once the fix is in.",
            tone_chips: ["More apologetic", "Tighter", "Add comp gesture"],
            why: "Guest is concerned but not hostile. Concise, no commitment on comp yet.",
            primary: "Approve & send",
          },
        ],
        follow_ups: [
          "Show the leak photos",
          "What's the plumber's history with this property?",
          "Draft a goodwill comp message",
          "Why is the cap €150 on this unit?",
        ],
      },
      {
        id: "jh_rafael",
        name: "Rafael Souza", initial: "R", language: "EN", trips: 0, sentiment: "negative · review risk",
        property: "Cihangir House", owner: "Cihangir Living", channel: "Airbnb",
        nights_done: 3, nights_total: 4, checkout_at: "Thu 11:00",
        status: "needs_you", status_reason: "Sentiment turned · review risk",
        sla_min: 12, confidence: 0.61, last_contact: "06:38 · 2h 9m ago",
        cendra_take: "Rafael's tone shifted at 06:38 — lexical match on \"disappointed\" and \"review\". I paused outbound, drafted a neutral apology, and held it for you. This thread is one of the few where I'll wait quietly instead of replying.",
        prep: [
          { label: "Sentiment", value: "Turned 06:38", tone: "warn" },
          { label: "Outbound", value: "Paused by Cendra", tone: "warn" },
          { label: "Stay", value: "Night 3/4 · checkout Thu", tone: "ok" },
          { label: "Prior reviews", value: "First trip · no history", tone: "ok" },
        ],
        cards: [
          {
            type: "draft_reply",
            channel: "Airbnb",
            preview: "Hi Rafael — I'm really sorry your stay has been less than what you expected. Can I call you in the next 30 minutes so I can hear the full picture and fix what's still fixable?",
            tone_chips: ["Less apologetic", "Add comp offer", "Offer call window"],
            why: "Hostile open could trigger negative review. Neutral, opens a call channel, no premature compensation.",
            primary: "Approve & send",
            secondary: "Take over thread",
          },
        ],
        follow_ups: [
          "Show the messages that triggered the alert",
          "What complaints exist on this property?",
          "Pause Cendra for this guest entirely",
          "Draft a comp offer at €50",
        ],
      },
      {
        id: "jh_isabela",
        name: "Isabela Vidal", initial: "I", language: "PT", trips: 1, sentiment: "neutral",
        property: "Karaköy · Apt 9", owner: "Karaköy LLC", channel: "Expedia",
        nights_done: 1, nights_total: 2, checkout_at: "Tue 11:00",
        status: "waiting", status_reason: "Cleaner ETA on maintenance",
        sla_min: 15, confidence: 0.91, last_contact: "07:55 · 19m ago",
        cendra_take: "Isabela mentioned a slow drain in passing — not urgent. I asked Marta for a window today between cleanings. Holding the loop until Marta confirms.",
        prep: [
          { label: "Issue", value: "Slow drain · low urgency", tone: "ok" },
          { label: "Vendor", value: "Marta C. · ETA pending", tone: "warn" },
          { label: "Outbound", value: "Holding ack sent", tone: "ok" },
          { label: "Stay", value: "Night 1/2", tone: "ok" },
        ],
        cards: [
          {
            type: "vendor_dispatch",
            vendor: "Marta C. · cleaner",
            via: "Slack #ops-beyoglu",
            status: "Pinged 08:00 · awaiting window",
            note: "Cendra will auto-confirm a maintenance window once Marta replies.",
          },
        ],
        follow_ups: [
          "Show the drain message",
          "When was this unit last maintained?",
          "Offer Isabela a late checkout",
        ],
      },
      {
        id: "jh_marc",
        name: "Marc Becker", initial: "M", language: "DE", trips: 5, sentiment: "warm · returning",
        property: "Karaköy · Apt 4", owner: "Karaköy LLC", channel: "Direct",
        nights_done: 4, nights_total: 5, checkout_at: "Tue 11:00",
        status: "all_good", status_reason: "Quiet · no contact 2 days",
        sla_min: null, confidence: 0.97, last_contact: "Yesterday · 14:20",
        cendra_take: "Marc is on his 5th stay, no messages in 2 days. I sent a routine quiet-hours reminder yesterday. Late checkout offer is a likely fit for his pattern — historic accept on his profile is 67%.",
        prep: [
          { label: "Sentiment", value: "Warm · 5 prior trips", tone: "ok" },
          { label: "Outbound", value: "Auto reminders only", tone: "ok" },
          { label: "Stay", value: "Night 4/5", tone: "ok" },
          { label: "Upsell fit", value: "Late checkout · 67% accept", tone: "ok" },
        ],
        cards: [
          {
            type: "upsell",
            offer: "Late checkout · €25",
            audience: "Marc Becker",
            est_value: "€25",
            historic: "67% accept on returning Karaköy guests",
            options: ["Offer at €25", "Offer at €30", "Skip — let him ask"],
            why: "Quiet, returning, profile match. Tomorrow's arrival doesn't conflict (cleaning sync OK).",
          },
        ],
        follow_ups: [
          "Show Marc's prior 5 stays",
          "What did he tip last time?",
          "Send a thank-you message tomorrow",
        ],
      },
      {
        id: "jh_yuki",
        name: "Yuki Ito", initial: "Y", language: "JP", trips: 0, sentiment: "neutral · first long stay",
        property: "Cihangir House", owner: "Cihangir Living", channel: "Booking.com",
        nights_done: 1, nights_total: 28, checkout_at: "Jun 7 · 11:00",
        status: "all_good", status_reason: "Long-stay routine",
        sla_min: null, confidence: 0.95, last_contact: "07:30 · 44m ago",
        cendra_take: "Yuki just settled in — first long stay (28 nights). Asked about a co-working cafe nearby, I sent two options. Long-stay onboarding playbook is running: trash schedule, laundry options, and the mid-stay clean offer all queued.",
        prep: [
          { label: "Stay", value: "Night 1/28 · long stay", tone: "ok" },
          { label: "Onboarding", value: "Playbook running auto", tone: "ok" },
          { label: "Mid-stay clean", value: "Scheduled day 14", tone: "ok" },
          { label: "Outbound", value: "2 messages auto", tone: "ok" },
        ],
        cards: [],
        follow_ups: [
          "Show the long-stay playbook running",
          "What's on day 14 for her?",
          "Draft a culture tip in Japanese",
        ],
      },
    ],

    checking_out_today: [
      {
        id: "jo_thomas",
        name: "Thomas Geier", initial: "T", language: "DE", trips: 2, sentiment: "tense · refund ask",
        property: "Galata 3", owner: "Galata Estates", channel: "Booking.com",
        nights_done: 3, nights_total: 3, checkout_at: "Today 11:00",
        status: "waiting", status_reason: "Awaiting AC photos from guest",
        sla_min: 67, confidence: 0.58, last_contact: "Yesterday 22:14",
        cendra_take: "Thomas asked for a €120 refund citing the AC. Galata Estates rule requires photos for refunds over €100. I asked twice — no photos yet. He's checking out today. Cendra will not refund without evidence, and I'd rather you decide whether to soften the ask.",
        prep: [
          { label: "Refund ask", value: "€120 · AC complaint", tone: "warn" },
          { label: "Evidence", value: "Photos requested 2× · none", tone: "warn" },
          { label: "Checkout", value: "Today 11:00", tone: "ok" },
          { label: "Owner rule", value: "Photos required > €100", tone: "warn" },
        ],
        cards: [
          {
            type: "approval",
            title: "Decline refund without evidence?",
            value: "Hold or partial",
            range: "€0 / €40 goodwill / €120 full",
            why: "Owner rule requires photos. Past 2 refund asks on this guest were granted on Airbnb (with photos). This is his 3rd ask — pattern flag.",
            options: ["Hold for photos", "Offer €40 goodwill", "Decline politely", "Escalate to Maya"],
            risk: "medium", reversibility: "amber",
          },
          {
            type: "draft_reply",
            channel: "Booking.com",
            preview: "Hi Thomas — to process a refund of €120, the property owner asks us to see a photo of the AC issue. If you can send one before checkout, I can move quickly. Otherwise we can offer a €40 goodwill credit toward your next stay.",
            tone_chips: ["Warmer", "Firmer", "Drop the credit"],
            why: "Bridges owner rule with a soft alternative. Keeps relationship intact.",
            primary: "Approve & send",
          },
        ],
        follow_ups: [
          "Show his prior refund history",
          "What did Galata's rule pack say verbatim?",
          "Show the AC service history at this unit",
          "Show the original messages",
        ],
      },
    ],

    arriving_week: [
      { id: "wk_1", name: "Élise Moreau",    property: "Cihangir House", channel: "Airbnb",      eta_day: "Tomorrow", eta_time: "15:00", nights: 2, prep_state: "all_set",  flag: null },
      { id: "wk_2", name: "Devansh Kapoor",  property: "Karaköy · Apt 12", channel: "Booking.com", eta_day: "Wed",     eta_time: "20:30", nights: 5, prep_state: "all_set",  flag: null },
      { id: "wk_3", name: "Sofia Vargas",    property: "Studio Galata",   channel: "Direct",     eta_day: "Wed",     eta_time: "16:00", nights: 4, prep_state: "needs_id", flag: "ID verification pending" },
      { id: "wk_4", name: "Tomás Almeida",   property: "Beşiktaş 7",      channel: "Expedia",    eta_day: "Thu",     eta_time: "14:00", nights: 3, prep_state: "all_set",  flag: null },
      { id: "wk_5", name: "Aiko Tanaka",     property: "Karaköy · Apt 9", channel: "Airbnb",     eta_day: "Fri",     eta_time: "18:00", nights: 7, prep_state: "all_set",  flag: null },
      { id: "wk_6", name: "Mohammed Al-Rashid", property: "Bosphorus Loft", channel: "Booking.com", eta_day: "Sat",   eta_time: "12:00", nights: 4, prep_state: "all_set",  flag: null },
    ],

    arriving_later_count: 14,
  },
};
