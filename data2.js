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
  // Kill switches — scenario-class level. Distinct axis from autonomy progression.
  // Audit §7 #8. manager_kill_switch table.
  kill_switches: [
    {
      id: "ks_refunds",
      scenario_class: "All refund decisions",
      reasoning_class: "REFUND",
      armed: false,
      last_triggered: "23d ago · Bosphorus stock photo dispute",
      cool_down_min: 60,
      cool_down_remaining: 0,
      affects_workflows: 3,
      affects_properties: 47,
    },
    {
      id: "ks_early_ci",
      scenario_class: "Early check-in promises",
      reasoning_class: "ARRIVAL_TIMING",
      armed: true,
      last_triggered: "2h ago · cleaner sync degraded",
      cool_down_min: 180,
      cool_down_remaining: 64,
      affects_workflows: 2,
      affects_properties: 6,
    },
    {
      id: "ks_vendor_dispatch",
      scenario_class: "Vendor dispatch over €150",
      reasoning_class: "VENDOR_DISPATCH",
      armed: false,
      last_triggered: "—",
      cool_down_min: 30,
      cool_down_remaining: 0,
      affects_workflows: 4,
      affects_properties: 47,
    },
    {
      id: "ks_acl_release",
      scenario_class: "Access code release",
      reasoning_class: "ACCESS_CONTROL",
      armed: false,
      last_triggered: "—",
      cool_down_min: 120,
      cool_down_remaining: 0,
      affects_workflows: 1,
      affects_properties: 47,
    },
    {
      id: "ks_outbound",
      scenario_class: "All outbound messages",
      reasoning_class: "GLOBAL_OUTBOUND",
      armed: false,
      last_triggered: "—",
      cool_down_min: 5,
      cool_down_remaining: 0,
      affects_workflows: 23,
      affects_properties: 47,
      nuclear: true,
    },
  ],

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
        { id: "wf_vendor", name: "Vendor dispatch (≤€150)",      state: "approval", samples: 41,  override: "—",     incidents: 0, hold_min: 0,   scope: "property",  last: "—",                 default: "Approval",        ready: false, frozen: true, why: "Spend rules need explicit budget per property. You froze this workflow until budgets are ratified." },
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
        { fact: "Wi-Fi",            value: "KK12-Guest / sapphire-otter-9821", source: "Smart-lock auto", source_file: "PMS · Yale Connect", fresh: "12d", true_since: "Jan 2024", last_verified: "12d ago", pinned: true,  visible: "guest", state: "verified", used_in: ["wf_wifi"] },
        { fact: "Quiet hours",      value: "23:00 → 08:00",                    source: "Building rule",   source_file: "kara12_owner_handbook.pdf · p.4", fresh: "60d", true_since: "Building bylaw, 2018", last_verified: "60d ago", pinned: true, visible: "guest", state: "verified", used_in: ["wf_wifi","wf_check"] },
        { fact: "Pets",             value: "Not allowed",                      source: "Owner rule",      source_file: "kara12_owner_handbook.pdf · p.7", fresh: "120d",true_since: "Apr 2023", last_verified: "120d ago", pinned: true, visible: "guest", state: "verified", used_in: ["wf_wifi"] },
        { fact: "Bedroom",          value: "1 king + 1 sofa-bed",              source: "Cleaner photo · listing says 1 queen", source_file: "kara12_walkthrough.mp4 · 02:14 + Airbnb listing", fresh: "live", true_since: "Refurb · Oct 2024", last_verified: "32d ago (cleaner)", visible: "internal", state: "conflict", used_in: ["wf_wifi"],
          conflict_sources: [
            {
              id: "src_a",
              label: "Cleaner walkthrough · video",
              value: "1 king + 1 sofa-bed",
              source_file: "kara12_walkthrough.mp4 · 02:14",
              source_type: "video",
              captured: "32d ago",
              captured_by: "Marta C.",
              confidence: 0.92,
              evidence: "Visual count at 02:14 — primary bedroom and living room sofa-bed clearly visible.",
              fix_if_loses: "Re-inspect with cleaner on next turnover and confirm.",
              fix_if_wins:  "Update Airbnb listing description to match (Maya · OTA team).",
            },
            {
              id: "src_b",
              label: "Airbnb listing description",
              value: "1 queen",
              source_file: "kara12_listing_airbnb.html",
              source_type: "web",
              captured: "180d ago",
              captured_by: "auto-sync",
              confidence: 0.74,
              evidence: "Listing copy field 'bed configuration'. Last edited 6 months ago — predates the room refurb.",
              fix_if_loses: "Push corrective edit to the Airbnb listing copy.",
              fix_if_wins:  "Re-shoot walkthrough and reconcile cleaner's photo.",
            },
          ],
        },
      ]},
      { label: "Internal notes",    facts: [
        { fact: "Cleaner notes",    value: "Hot water heater needs flush every 30 days",       source: "Marta C.",   source_file: "kara12_cleaner_notes.mp3 · 00:42", fresh: "8d",  true_since: "Jul 2024", last_verified: "8d ago", visible: "internal", state: "verified", used_in: ["wf_maint"] },
        { fact: "Owner preference", value: "Never offer late checkout if same-day turnover",   source: "Owner rule", source_file: "kara12_owner_handbook.pdf · p.11", fresh: "32d", true_since: "Owner rule, Mar 2025", last_verified: "32d ago", pinned: true, visible: "internal", state: "verified", used_in: ["wf_late"] },
      ]},
      { label: "Missing",           facts: [
        { fact: "Heating type",     value: "—", source: "—", source_file: null, fresh: "—", visible: "—", state: "missing", used_in: [] },
      ]},
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // Rich detail records for every property in the portfolio
  // Keyed by property id. Each property gets its own facts, rules,
  // integrations, risks, and quirks so detail pages feel distinct.
  // ──────────────────────────────────────────────────────────────────
  property_details: {
    p_kara9: {
      id: "p_kara9", name: "Karaköy · Apartment 9",
      owner: "Karaköy LLC", primary_contact: "Mehmet Demir",
      region: "Beyoğlu", group: "Standard short-stay",
      floor: "3F", access: "Smart-lock · KK9-Yale-9512", wifi: "KK9-Guest / honey-fox-2244",
      integrations: { pms: "Hostaway · OK", channels: ["Airbnb · OK", "Booking · OK", "Expedia · OK"], lock: "Yale Connect · OK", clean: "Properly · OK" },
      facts_summary: { verified: 12, missing: 0, conflicts: 0, stale: 1, internal: 4 },
      risks: ["Lobby renovation ongoing · periodic noise 09:00–17:00 weekdays"],
      fact_groups: [
        { label: "Guest-facing facts", facts: [
          { fact: "Wi-Fi",        value: "KK9-Guest / honey-fox-2244",      source: "Smart-lock auto", source_file: "PMS · Yale Connect",                fresh: "8d",  visible: "guest", state: "verified" },
          { fact: "Quiet hours",  value: "23:00 → 08:00",                    source: "Building rule",   source_file: "kara_portfolio_handbook.pdf · p.4", fresh: "60d", visible: "guest", state: "verified" },
          { fact: "Pets",         value: "Allowed · €100 deposit",           source: "Owner rule",      source_file: "kara9_owner_addendum.pdf",          fresh: "45d", visible: "guest", state: "verified" },
          { fact: "Bedroom",      value: "1 queen + futon",                  source: "Cleaner verified",source_file: "kara9_walkthrough.mp4 · 01:08",     fresh: "22d", visible: "guest", state: "verified" },
          { fact: "Parking",      value: "Street parking · paid 08:00–18:00",source: "Owner input",     source_file: "kara_portfolio_handbook.pdf · p.9", fresh: "60d", visible: "guest", state: "verified" },
          { fact: "Smoking",      value: "Balcony only",                     source: "Owner rule",      source_file: "kara_portfolio_handbook.pdf · p.6", fresh: "60d", visible: "guest", state: "verified" },
        ]},
        { label: "Internal notes", facts: [
          { fact: "Hot water reset", value: "Boiler in kitchen utility · breaker B3", source: "Marta C.", source_file: "kara9_cleaner_notes.mp3 · 00:18", fresh: "12d", visible: "internal", state: "verified" },
          { fact: "Heating service", value: "Boiler annual inspection",       source: "Maintenance log", source_file: "boiler_log_2025.xlsx",            fresh: "180d", visible: "internal", state: "stale" },
        ]},
      ],
    },

    p_kara4: {
      id: "p_kara4", name: "Karaköy · Apartment 4",
      owner: "Karaköy LLC", primary_contact: "Mehmet Demir",
      region: "Beyoğlu", group: "Standard short-stay",
      floor: "Ground · garden access", access: "Smart-lock · KK4-Yale-9234", wifi: "KK4-Guest / ocean-mint-7763",
      integrations: { pms: "Hostaway · OK", channels: ["Airbnb · OK", "Booking · OK", "Direct · OK"], lock: "Yale Connect · OK", clean: "Properly · OK" },
      facts_summary: { verified: 14, missing: 0, conflicts: 0, stale: 0, internal: 5 },
      risks: [],
      fact_groups: [
        { label: "Guest-facing facts", facts: [
          { fact: "Wi-Fi",          value: "KK4-Guest / ocean-mint-7763",     source: "Smart-lock auto", source_file: "PMS · Yale Connect",                fresh: "11d", visible: "guest", state: "verified" },
          { fact: "Garden access",  value: "Private · side door key in box",   source: "Owner walkthrough", source_file: "kara4_owner_intro.pdf · p.3",     fresh: "120d", visible: "guest", state: "verified" },
          { fact: "Quiet hours",    value: "22:00 → 09:00 (garden quieter)",   source: "Building rule",   source_file: "kara_portfolio_handbook.pdf · p.4", fresh: "60d", visible: "guest", state: "verified" },
          { fact: "Pets",           value: "Allowed in garden, indoors yes",   source: "Owner rule",      source_file: "kara4_owner_addendum.pdf",          fresh: "90d", visible: "guest", state: "verified" },
          { fact: "Bedroom",        value: "1 king",                            source: "Cleaner verified",source_file: "kara4_walkthrough.mp4 · 00:54",     fresh: "30d", visible: "guest", state: "verified" },
        ]},
        { label: "Internal notes", facts: [
          { fact: "Returning guests", value: "Returning guests get free late checkout (up to 14:00)", source: "Owner preference", source_file: "kara_portfolio_handbook.pdf · p.13", fresh: "180d", visible: "internal", state: "verified" },
          { fact: "Garden maintenance", value: "Gardener weekly · Wednesday 09:00–11:00", source: "Owner schedule", source_file: "kara4_maintenance.eml", fresh: "30d", visible: "internal", state: "verified" },
        ]},
      ],
    },

    p_bos: {
      id: "p_bos", name: "Bosphorus Loft",
      owner: "Bosphorus Holdings", primary_contact: "Aylin Yıldız",
      region: "Beşiktaş", group: "Premium · serviced",
      floor: "Penthouse · 2 floors", access: "Smart-lock · BOS-Yale-5512 (intermittent)", wifi: "BosphorusLoft / starlight-9921",
      integrations: { pms: "Hostaway · OK", channels: ["Airbnb · OK", "Booking · OK", "Direct · OK"], lock: "Yale Connect · degraded", clean: "Properly · OK" },
      facts_summary: { verified: 18, missing: 1, conflicts: 1, stale: 2, internal: 6 },
      risks: ["Active leak under bathroom sink · plumber dispatched 08:01", "Smart-lock pairing failures · 3 in 30 days", "High-value loft · premium guest expectations"],
      fact_groups: [
        { label: "Guest-facing facts", facts: [
          { fact: "Wi-Fi",          value: "BosphorusLoft / starlight-9921",  source: "Smart-lock auto", source_file: "PMS · Yale Connect",            fresh: "14d", visible: "guest", state: "verified" },
          { fact: "Bedroom",        value: "2 bedrooms · 1 king + 1 queen",     source: "Cleaner verified",source_file: "bos_walkthrough.mp4 · 03:22",   fresh: "45d", visible: "guest", state: "verified" },
          { fact: "View",           value: "Bosphorus view from terrace + master", source: "Listing copy", source_file: "bos_listing_airbnb.html",       fresh: "180d", visible: "guest", state: "verified" },
          { fact: "Pets",           value: "Allowed · €200 deposit",            source: "Owner rule (Aylin Y.)", source_file: "bosphorus_owner_briefing.pdf · p.5", fresh: "45d", visible: "guest", state: "conflict",
            conflict_sources: [
              { id: "bos_a", label: "Owner rule",         value: "Allowed · €200 deposit", source_file: "bosphorus_owner_briefing.pdf · p.5", source_type: "pdf",  captured: "45d ago",  captured_by: "Aylin Y.", confidence: 0.94, evidence: "Owner explicitly added pet allowance with deposit during Q1 onboarding.",                fix_if_loses: "Reconcile with building management on bylaws.", fix_if_wins:  "Push corrective edit to building bylaws (Maya · ops)." },
              { id: "bos_b", label: "Building bylaws",     value: "No pets",                source_file: "besiktas_building_bylaws.pdf · §4",  source_type: "pdf",  captured: "120d ago", captured_by: "Building mgmt", confidence: 0.86, evidence: "Bylaws §4 prohibit pets in all units. Building admin signed by all owners.", fix_if_loses: "Update owner rule to align with bylaws.",                    fix_if_wins:  "Owner must negotiate exception with building." },
            ],
          },
          { fact: "Quiet hours",    value: "22:00 → 09:00",                     source: "Building rule",   source_file: "besiktas_building_bylaws.pdf · §6", fresh: "120d", visible: "guest", state: "verified" },
        ]},
        { label: "Internal notes", facts: [
          { fact: "Same-day turnover", value: "Avoid · 4h minimum gap required between guests", source: "Owner preference", source_file: "bosphorus_owner_briefing.pdf · p.8", fresh: "45d", visible: "internal", state: "verified" },
          { fact: "Plumber preferred",  value: "A. Sözen · +90 555 234 8821 · responsive same-day", source: "PM directory", source_file: "vendor_directory_2026.xlsx", fresh: "21d", visible: "internal", state: "verified" },
          { fact: "Cleaner contact",    value: "Marta C. · last verified contact info",            source: "PM directory", source_file: "vendor_directory_2026.xlsx", fresh: "90d", visible: "internal", state: "stale" },
        ]},
        { label: "Missing", facts: [
          { fact: "Pool heating schedule", value: "—", source: "—", source_file: null, fresh: "—", visible: "—", state: "missing" },
        ]},
      ],
    },

    p_studgal: {
      id: "p_studgal", name: "Studio Galata",
      owner: "Galata Estates", primary_contact: "Erkan Polat",
      region: "Beyoğlu", group: "Standard short-stay",
      floor: "2F", access: "Lockbox · SG-4421 (rotates monthly)", wifi: "StudioGalata / orange-river-3344",
      integrations: { pms: "Hostaway · OK", channels: ["Airbnb · OK", "Booking · OK"], lock: "Master lock · physical", clean: "Properly · OK" },
      facts_summary: { verified: 8, missing: 4, conflicts: 0, stale: 2, internal: 3 },
      risks: ["High guest question volume on parking (5 asks · 30d)", "Older listing copy · last updated 200d ago"],
      fact_groups: [
        { label: "Guest-facing facts", facts: [
          { fact: "Wi-Fi",          value: "StudioGalata / orange-river-3344", source: "Owner input",     source_file: "studio_galata_listing.html",   fresh: "200d", visible: "guest", state: "verified" },
          { fact: "Layout",         value: "Studio · sleeps 2 · sofa-bed",       source: "Listing copy",   source_file: "studio_galata_listing.html",   fresh: "200d", visible: "guest", state: "verified" },
          { fact: "Quiet hours",    value: "23:00 → 08:00",                     source: "Building rule",   source_file: "studio_galata_listing.html",   fresh: "200d", visible: "guest", state: "verified" },
          { fact: "Pets",           value: "Not allowed",                       source: "Owner rule",      source_file: "studio_galata_listing.html",   fresh: "200d", visible: "guest", state: "verified" },
        ]},
        { label: "Internal notes", facts: [
          { fact: "Lockbox rotation", value: "Code rotates first of every month",  source: "Owner SOP",       source_file: "galata_estates_lockbox_sop.pdf", fresh: "45d",  visible: "internal", state: "verified" },
          { fact: "Building gate",    value: "Main door auto-locks 22:00",         source: "Building rule",   source_file: "—",                              fresh: "180d", visible: "internal", state: "stale" },
        ]},
        { label: "Missing", facts: [
          { fact: "Parking",          value: "—", source: "Guest question · 5 asks in 30d", source_file: null, fresh: "—", visible: "—", state: "missing" },
          { fact: "Heating type",     value: "—", source: "—",                                source_file: null, fresh: "—", visible: "—", state: "missing" },
          { fact: "Air conditioning", value: "—", source: "Guest question · 2 asks in 30d", source_file: null, fresh: "—", visible: "—", state: "missing" },
          { fact: "Building name",    value: "—", source: "—",                                source_file: null, fresh: "—", visible: "—", state: "missing" },
        ]},
      ],
    },

    p_cih: {
      id: "p_cih", name: "Cihangir House",
      owner: "Cihangir Living", primary_contact: "Selin Çelik",
      region: "Beyoğlu", group: "Premium · serviced",
      floor: "3-story townhouse · 240m²", access: "Smart-lock · CH-Yale-7799", wifi: "CihangirHouse / moonlight-2233",
      integrations: { pms: "Hostaway · OK", channels: ["Airbnb · OK", "Booking · OK", "Expedia · OK"], lock: "Yale Connect · OK", clean: "Properly · OK" },
      facts_summary: { verified: 16, missing: 0, conflicts: 0, stale: 0, internal: 6 },
      risks: ["Building gate causes 9 first-night confusions in 30d", "Neighbor sensitivity to balcony noise after 22:00", "Currently under sentiment alert · Rafael S."],
      fact_groups: [
        { label: "Guest-facing facts", facts: [
          { fact: "Wi-Fi",          value: "CihangirHouse / moonlight-2233",   source: "Smart-lock auto", source_file: "PMS · Yale Connect",              fresh: "10d", visible: "guest", state: "verified" },
          { fact: "Layout",         value: "3 bed · 2 bath · terrace · 240m²",   source: "Listing copy",   source_file: "cihangir_house_listing.html",     fresh: "60d", visible: "guest", state: "verified" },
          { fact: "Max guests",     value: "6 (owner rule · enforced)",          source: "Owner rule",      source_file: "cihangir_house_briefing.pdf · p.2", fresh: "90d", visible: "guest", state: "verified" },
          { fact: "Building gate",  value: "Press buzzer 'CH' · gate beeps then push hard within 3s", source: "Owner SOP", source_file: "cihangir_gate_video.mp4 · 00:14", fresh: "30d", visible: "guest", state: "verified" },
          { fact: "Quiet hours",    value: "22:00 → 09:00 (neighbor sensitivity)", source: "Owner preference + neighbor complaints", source_file: "cihangir_neighbor_log.eml", fresh: "45d", visible: "guest", state: "verified" },
          { fact: "Pets",           value: "Not allowed · neighbor allergies",   source: "Owner rule",      source_file: "cihangir_house_briefing.pdf · p.5", fresh: "90d", visible: "guest", state: "verified" },
        ]},
        { label: "Internal notes", facts: [
          { fact: "Owner approval",   value: "Required for any compensation > €30 (sentiment-sensitive owner)", source: "Owner preference", source_file: "cihangir_house_briefing.pdf · p.7", fresh: "45d", visible: "internal", state: "verified" },
          { fact: "Late checkout",    value: "€25 · always offer if no same-day arrival",                        source: "Owner pricing",    source_file: "cihangir_house_briefing.pdf · p.9", fresh: "45d", visible: "internal", state: "verified" },
          { fact: "Neighbor contact", value: "Apt 2 — Mrs. Aydın · prefers email · noise sensitive",            source: "PM note",          source_file: "cihangir_neighbor_log.eml",         fresh: "45d", visible: "internal", state: "verified" },
        ]},
      ],
    },

    p_gal3: {
      id: "p_gal3", name: "Galata 3",
      owner: "Galata Estates", primary_contact: "Erkan Polat",
      region: "Beyoğlu", group: "Standard short-stay",
      floor: "1F", access: "Smart-lock · G3-Yale-8821", wifi: "Galata3-Guest / silver-cloud-6611",
      integrations: { pms: "Hostaway · OK", channels: ["Booking · OK", "Airbnb · OK"], lock: "Yale Connect · OK", clean: "Properly · OK" },
      facts_summary: { verified: 10, missing: 2, conflicts: 1, stale: 0, internal: 4 },
      risks: ["AC service history disputed", "Active refund request from Thomas Geier · €120"],
      fact_groups: [
        { label: "Guest-facing facts", facts: [
          { fact: "Wi-Fi",          value: "Galata3-Guest / silver-cloud-6611", source: "Smart-lock auto", source_file: "PMS · Yale Connect",              fresh: "11d", visible: "guest", state: "verified" },
          { fact: "Bedroom",        value: "1 queen + 1 sofa-bed",               source: "Cleaner verified",source_file: "galata3_walkthrough.mp4 · 01:22", fresh: "25d", visible: "guest", state: "verified" },
          { fact: "AC age",         value: "Installed 2022 (per owner)",          source: "Owner statement · maintenance log says 2018 unit serviced", source_file: "galata_estates_owner_brief.pdf + maintenance_log_2025.xlsx", fresh: "live", visible: "internal", state: "conflict",
            conflict_sources: [
              { id: "g3_a", label: "Owner statement",      value: "Installed 2022",                source_file: "galata_estates_owner_brief.pdf · p.4", source_type: "pdf", captured: "60d ago", captured_by: "Erkan P.", confidence: 0.78, evidence: "Owner mentioned 2022 installation date during Q1 review.",         fix_if_loses: "Owner needs to confirm installation paperwork.",       fix_if_wins:  "Update maintenance log to reflect actual install date." },
              { id: "g3_b", label: "Maintenance log",       value: "2018 unit · serviced 2024",     source_file: "maintenance_log_2025.xlsx · row 47",   source_type: "xlsx", captured: "30d ago", captured_by: "Tradify",   confidence: 0.89, evidence: "Service ticket #G3-2024-11 references serial number from 2018 unit.", fix_if_loses: "Re-verify serial number on next service.",              fix_if_wins:  "Owner statement is outdated · update brief." },
            ],
          },
          { fact: "Pets",           value: "Not allowed",                        source: "Owner rule",      source_file: "galata_estates_owner_brief.pdf · p.6", fresh: "60d", visible: "guest", state: "verified" },
          { fact: "Parking",        value: "Paid garage 80m away (€15/day)",      source: "Owner input",     source_file: "galata_estates_owner_brief.pdf · p.7", fresh: "60d", visible: "guest", state: "verified" },
        ]},
        { label: "Internal notes", facts: [
          { fact: "Refund policy",   value: "Refunds > €100 require photo evidence (owner rule)", source: "Owner rule", source_file: "galata_estates_owner_brief.pdf · p.10", fresh: "90d", visible: "internal", state: "verified" },
          { fact: "AC complaint history", value: "2 refunds granted on Airbnb (with photos) · this guest's 3rd ask", source: "Audit trail", source_file: "decision_cases · 180d", fresh: "live", visible: "internal", state: "verified" },
        ]},
        { label: "Missing", facts: [
          { fact: "Heating fuel type",  value: "—", source: "—", source_file: null, fresh: "—", visible: "—", state: "missing" },
          { fact: "Hot water capacity", value: "—", source: "Guest question · 1 ask",  source_file: null, fresh: "—", visible: "—", state: "missing" },
        ]},
      ],
    },

    p_bes7: {
      id: "p_bes7", name: "Beşiktaş 7",
      owner: "Independent · 6 owners", primary_contact: "—",
      region: "Beşiktaş", group: "Standard short-stay",
      floor: "5F · walk-up (no elevator)", access: "Lockbox · BES-9912", wifi: "Besiktas7 / coral-stone-4477",
      integrations: { pms: "Hostaway · OK", channels: ["Direct · OK", "Airbnb · OK"], lock: "Master lock · physical", clean: "Properly · OK" },
      facts_summary: { verified: 6, missing: 0, conflicts: 0, stale: 1, internal: 2 },
      risks: ["No elevator · 5-floor walk-up · mention in pre-arrival to avoid bad reviews"],
      fact_groups: [
        { label: "Guest-facing facts", facts: [
          { fact: "Wi-Fi",          value: "Besiktas7 / coral-stone-4477",     source: "Owner input",     source_file: "besiktas7_listing.html",        fresh: "30d", visible: "guest", state: "verified" },
          { fact: "Walk-up",        value: "5 floors · no elevator",            source: "Owner SOP",       source_file: "besiktas7_listing.html",        fresh: "30d", visible: "guest", state: "verified" },
          { fact: "Bedroom",        value: "1 double bed",                       source: "Listing copy",   source_file: "besiktas7_listing.html",        fresh: "30d", visible: "guest", state: "verified" },
          { fact: "Quiet hours",    value: "23:00 → 08:00",                     source: "Building rule",   source_file: "—",                             fresh: "—",   visible: "guest", state: "stale" },
          { fact: "Pets",           value: "Not allowed",                       source: "Owner rule",      source_file: "besiktas7_listing.html",        fresh: "30d", visible: "guest", state: "verified" },
        ]},
        { label: "Internal notes", facts: [
          { fact: "Walk-up disclosure", value: "Always confirm with guest at booking · prevents bad reviews", source: "PM SOP", source_file: "besiktas7_pm_notes.txt", fresh: "15d", visible: "internal", state: "verified" },
          { fact: "Owner contact",      value: "Multiple owners · use master pool · response time variable", source: "PM note", source_file: "—",                  fresh: "120d", visible: "internal", state: "verified" },
        ]},
      ],
    },
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

  // Per-PM decision aggregates threaded from manager_id on every DecisionCase.
  // Audit §7 #11.
  team_stats: [
    {
      manager_id: "u_maya",  name: "Maya Lindqvist",  avatar: "M", role: "Operations Lead",
      decisions_today: 47, approvals_today: 12, overrides_today: 3, match_rate: 0.89,
      avg_response_min: 4.2,
      worst_workflow: "Vendor dispatch",
      best_workflow: "Wi-Fi & access info",
      streak_days: 23,
      last_decision_min: 8,
    },
    {
      manager_id: "u_henrik", name: "Henrik Sørensen", avatar: "H", role: "Property Manager",
      decisions_today: 31, approvals_today: 8, overrides_today: 1, match_rate: 0.94,
      avg_response_min: 6.8,
      worst_workflow: "Refund request",
      best_workflow: "Parking & directions",
      streak_days: 11,
      last_decision_min: 22,
    },
    {
      manager_id: "u_yui",   name: "Yui Tanaka",       avatar: "Y", role: "Guest Support",
      decisions_today: 22, approvals_today: 14, overrides_today: 0, match_rate: 0.96,
      avg_response_min: 2.1,
      worst_workflow: "Cross-channel merge",
      best_workflow: "Check-in instructions",
      streak_days: 47,
      last_decision_min: 3,
    },
    {
      manager_id: "u_adele", name: "Adèle Roux",       avatar: "A", role: "Night Manager",
      decisions_today: 9, approvals_today: 6, overrides_today: 0, match_rate: 0.91,
      avg_response_min: 7.4,
      worst_workflow: "Maintenance triage",
      best_workflow: "Access code release",
      streak_days: 5,
      last_decision_min: 184,
    },
  ],

  // Insights — Ask Cendra explorer
  // Daily Brain Report — sectioned by subsystem (BootstrapEventBus,
  // GoldenCasesRunner, FoundationDrift, FrictionTracker, Compliance, Risk,
  // Memory consolidation, Pattern miner, A/B experiments).
  // Each section drills into the raw event log.
  daily_brain_report: {
    generated_at: "Today 06:14",
    period: "Last 24 hours · 06:14 yest → 06:14 today",
    summary: "Cendra ran 1,247 decisions, opened 23 promises, closed 41. One foundation suggestion needs your call; one A/B verdict is in.",
    sections: [
      {
        id: "bootstrap",
        subsystem: "BootstrapEventBus",
        eyebrow: "STARTUP",
        title: "All 47 modules online · 14.2s cold start",
        narrative: "Cognition loops, foundation catalog, decision pipeline gates, and approval gateway came up clean. Smart-engine subsystems remain wired-but-unconsumed.",
        metrics: [
          { label: "Modules", value: "47/47" },
          { label: "Cold start", value: "14.2s", tone: "ok" },
          { label: "Wired-but-unconsumed", value: "4", tone: "info" },
        ],
        event_ids: ["evt_boot_03b1", "evt_boot_03b2", "evt_boot_03b3"],
        drill_to: "audit",
      },
      {
        id: "golden_cases",
        subsystem: "GoldenCasesRunner",
        eyebrow: "REGRESSION GUARD",
        title: "486 of 494 canonical cases pass · 2 regressions",
        narrative: "Two scenarios regressed when the early-check-in rule narrowed — both on Karaköy Apt 9. Replay shows the new owner rule is binding, not a bug.",
        metrics: [
          { label: "Pass rate", value: "98.4%", tone: "ok" },
          { label: "New regressions", value: "2", tone: "warn" },
          { label: "Drift on baseline", value: "0%", tone: "ok" },
        ],
        event_ids: ["evt_golden_run_419"],
        drill_to: "audit",
      },
      {
        id: "foundation_drift",
        subsystem: "FoundationDrift (FL-13)",
        eyebrow: "SUGGESTED UPDATES",
        title: "1 foundation suggestion for your review",
        narrative: "Cendra noticed you handle late-checkout in Bosphorus Loft differently from the portfolio default 4 times in 30 days. Would you like to review the suggested foundation edit? Cendra never auto-writes; you decide.",
        metrics: [
          { label: "Suggestions open", value: "1", tone: "info" },
          { label: "Auto-writes", value: "0", tone: "ok" },
          { label: "Stale > 7d", value: "0", tone: "ok" },
        ],
        event_ids: ["evt_drift_204"],
        drill_to: "brain",
        drill_arg: "learning",
      },
      {
        id: "friction",
        subsystem: "FrictionTracker + ReflexionCritic",
        eyebrow: "WHERE I SLOWED YOU DOWN",
        title: "3 friction points · vendor-quote approval the worst",
        narrative: "PM Maya overrode the vendor-quote approval band 3 times yesterday — Cendra was too conservative. The reflexion critic suggested raising the auto-spend cap by €50 on Bosphorus Holdings. Available as a learning candidate.",
        metrics: [
          { label: "Friction points", value: "3", tone: "warn" },
          { label: "Worst feature", value: "vendor_quote_ceiling" },
          { label: "Suggested change", value: "+€50 cap", tone: "info" },
        ],
        event_ids: ["evt_friction_88"],
        drill_to: "brain",
        drill_arg: "learning",
      },
      {
        id: "compliance",
        subsystem: "ComplianceMonitor (M19)",
        eyebrow: "EU REGULATIONS",
        title: "100% checks pass · 0 BLOCKS, 1 NEEDS_REVIEW",
        narrative: "1,247 decisions ran the 5-check compliance pipeline. One refund decision needs your GDPR Art.22 sign-off because it involved a natural-person automated decision over €100. Cendra paused; you decide.",
        metrics: [
          { label: "PASS", value: "1,246", tone: "ok" },
          { label: "NEEDS_REVIEW", value: "1", tone: "warn" },
          { label: "BLOCK", value: "0", tone: "ok" },
        ],
        event_ids: ["evt_comp_review_18"],
        drill_to: "trust",
      },
      {
        id: "risk_gate",
        subsystem: "RiskGate (M9 · EV/CVaR)",
        eyebrow: "RISK REFUSALS",
        title: "4 actions refused on worst-case threshold",
        narrative: "Each refusal carried PROCEED / ABSTAIN / INSUFFICIENT_DATA verdict with rationale. The biggest refusal — €620 vendor counter-quote — would have averaged €350 in the worst 5% of outcomes.",
        metrics: [
          { label: "Refused", value: "4", tone: "info" },
          { label: "Top CVaR", value: "€350", tone: "info" },
          { label: "Reversed", value: "0", tone: "ok" },
        ],
        event_ids: ["evt_risk_330"],
        drill_to: "audit",
      },
      {
        id: "memory",
        subsystem: "EpisodicDedup + KG sync",
        eyebrow: "OVERNIGHT CONSOLIDATION",
        title: "58 duplicate episodes merged · 142 KG nodes touched",
        narrative: "Cendra cleaned up overlapping memories overnight. Reduction ratio 28% — within the advisory band. No KG nodes deleted; 3 new relationships inferred from yesterday's decisions.",
        metrics: [
          { label: "Episodes merged", value: "58", tone: "ok" },
          { label: "KG relationships", value: "+3", tone: "ok" },
          { label: "Half-life decay applied", value: "412 facts", tone: "info" },
        ],
        event_ids: ["evt_consolidate_77"],
        drill_to: "audit",
      },
      {
        id: "ab_experiments",
        subsystem: "ABExperimentRegistry",
        eyebrow: "VERDICTS",
        title: "1 verdict in · early-check-in tone (warmth vs precision)",
        narrative: "47/50 trials in arm A (warmth), 49/50 in arm B (precision). Arm A wins 0.04 NPS difference at 95% confidence. Rolling out warmth tone to early-check-in workflow.",
        metrics: [
          { label: "Verdicts", value: "1", tone: "ok" },
          { label: "Trials still running", value: "2", tone: "info" },
          { label: "Stopped early", value: "0", tone: "ok" },
        ],
        event_ids: ["evt_ab_verdict_4"],
        drill_to: "brain",
        drill_arg: "learning",
      },
      {
        id: "pattern_miner",
        subsystem: "GlobalPatternMiner",
        eyebrow: "LEARNED RULES",
        title: "0 new global patterns · 2 candidates below threshold",
        narrative: "Two candidate rules reached 2 of the 3-tenant minimum yesterday. They'll surface as global suggestions only when a 3rd tenant adopts the same handling — privacy guarantee.",
        metrics: [
          { label: "New globals", value: "0", tone: "ok" },
          { label: "Pending threshold", value: "2", tone: "info" },
          { label: "Per-property rules added", value: "3", tone: "ok" },
        ],
        event_ids: ["evt_miner_15"],
        drill_to: "brain",
        drill_arg: "learning",
      },
    ],
  },

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
  // KNOWLEDGE SOURCES — every file PMs feed Cendra. Cendra parses,
  // extracts facts/rules/scenarios/playbook candidates, then lands
  // them in the property brain with provenance back to the source.
  // ──────────────────────────────────────────────────────────────────
  knowledge_sources: {
    portfolio: [
      { id: "src_p1", filename: "portfolio_sop_v3.pdf",        type: "pdf",   size: "2.4 MB",  pages: 32, uploaded: "60d ago", by: "Maya L.",  scope: "all properties",     extracted: { facts: 14, rules: 6,  scenarios: 9, playbooks: 2 }, confidence: 0.91, status: "applied" },
      { id: "src_p2", filename: "vendor_directory_2026.xlsx",  type: "xlsx",  size: "84 KB",   rows: 47,  uploaded: "42d ago", by: "Maya L.",  scope: "all properties",     extracted: { facts: 0,  rules: 0,  scenarios: 0, playbooks: 0, vendors: 47 }, confidence: 0.98, status: "applied" },
      { id: "src_p3", filename: "emergency_procedures.docx",   type: "docx",  size: "412 KB",  pages: 8,  uploaded: "120d ago",by: "Maya L.",  scope: "all properties",     extracted: { facts: 4,  rules: 3,  scenarios: 12, playbooks: 1 }, confidence: 0.88, status: "applied" },
      { id: "src_p4", filename: "owner_contract_template.pdf", type: "pdf",   size: "186 KB",  pages: 6,  uploaded: "180d ago",by: "Maya L.",  scope: "all properties",     extracted: { facts: 0,  rules: 8,  scenarios: 0, playbooks: 0 }, confidence: 0.93, status: "applied" },
      { id: "src_p5", filename: "guest_complaints_2025.csv",   type: "csv",   size: "1.1 MB",  rows: 312, uploaded: "21d ago", by: "Henrik S.",scope: "all properties",     extracted: { facts: 0,  rules: 0,  scenarios: 18, playbooks: 5 }, confidence: 0.84, status: "applied" },
    ],
    by_property: {
      p_kara12: [
        { id: "src_k1", filename: "kara12_owner_handbook.pdf", type: "pdf",   size: "1.2 MB",  pages: 14, uploaded: "60d ago", by: "Maya L.",  extracted: { facts: 8, rules: 3, scenarios: 5 }, confidence: 0.92, status: "applied" },
        { id: "src_k2", filename: "kara12_walkthrough.mp4",     type: "video", size: "184 MB",  duration: "4:32", uploaded: "32d ago", by: "Marta C.", extracted: { facts: 5, photos: 2, scenarios: 2 }, confidence: 0.86, status: "applied" },
        { id: "src_k3", filename: "kara12_cleaner_notes.mp3",   type: "audio", size: "4.2 MB",  duration: "1:24", uploaded: "8d ago",  by: "Marta C.", extracted: { facts: 3, rules: 1 }, confidence: 0.81, status: "applied" },
        { id: "src_k4", filename: "kara12_kitchen.jpg",         type: "image", size: "2.4 MB",  uploaded: "90d ago", by: "Maya L.",   extracted: { amenities: 12, facts: 4 }, confidence: 0.88, status: "applied" },
        { id: "src_k5", filename: "kara12_listing_airbnb.html", type: "web",   size: "—",       uploaded: "180d ago",by: "auto-sync", extracted: { facts: 11, rules: 0, scenarios: 3 }, confidence: 0.95, status: "applied" },
      ],
      p_bos: [
        { id: "src_b1", filename: "bosphorus_owner_briefing.pdf", type: "pdf", size: "880 KB", pages: 9, uploaded: "45d ago", by: "Maya L.", extracted: { facts: 6, rules: 4, scenarios: 3 }, confidence: 0.89, status: "applied" },
        { id: "src_b2", filename: "bos_leak_history.eml",         type: "email", size: "32 KB", uploaded: "9d ago",  by: "Maya L.", extracted: { facts: 2, scenarios: 4 }, confidence: 0.78, status: "applied" },
      ],
      p_studgal: [
        { id: "src_s1", filename: "studio_galata_listing.html", type: "web", size: "—", uploaded: "200d ago", by: "auto-sync", extracted: { facts: 9, rules: 0, scenarios: 2 }, confidence: 0.94, status: "applied" },
      ],
    },
  },

  // SCENARIO COVERAGE — how many of the 469 hospitality scenarios
  // Cendra is confident handling for each property (extracted from
  // PM data + uploaded knowledge sources).
  scenario_coverage: {
    // FL-14 two-tier customer foundation. Core is the canonical default catalog.
    // Your additions are scenarios this customer added on top.
    portfolio_total: 469,             // legacy alias (= core total)
    portfolio_covered: 187,           // legacy alias (= core covered)
    portfolio_core_total: 469,
    portfolio_core_covered: 187,
    portfolio_addition_total: 23,
    portfolio_addition_covered: 17,
    stages: [
      { id: "s1", label: "Pre-booking",          total: 50, covered: 24, core_total: 50, core_covered: 24, addition_total: 2, addition_covered: 1  },
      { id: "s2", label: "Booking confirmation", total: 40, covered: 22, core_total: 40, core_covered: 22, addition_total: 1, addition_covered: 1  },
      { id: "s3", label: "Pre-arrival",          total: 61, covered: 38, core_total: 61, core_covered: 38, addition_total: 4, addition_covered: 4  },
      { id: "s4", label: "Check-in day",         total: 61, covered: 44, core_total: 61, core_covered: 44, addition_total: 3, addition_covered: 3  },
      { id: "s5", label: "During stay",          total: 84, covered: 32, core_total: 84, core_covered: 32, addition_total: 7, addition_covered: 5  },
      { id: "s6", label: "Upsell / Revenue",     total: 41, covered: 9,  core_total: 41, core_covered: 9,  addition_total: 4, addition_covered: 2  },
      { id: "s7", label: "Check-out",            total: 40, covered: 10, core_total: 40, core_covered: 10, addition_total: 1, addition_covered: 1  },
      { id: "s8", label: "Post-stay",            total: 40, covered: 6,  core_total: 40, core_covered: 6,  addition_total: 0, addition_covered: 0  },
      { id: "s9", label: "Internal / Vendor",    total: 52, covered: 2,  core_total: 52, core_covered: 2,  addition_total: 1, addition_covered: 0  },
    ],
    // Sample of your additions — scenarios this customer added beyond the canonical 469
    additions_catalog: [
      { id: "add_1", scenario: "Returning guest free late checkout up to 14:00", stage: "Check-out",       added_by: "Owner · Karaköy LLC", source: "kara_portfolio_handbook.pdf · p.13", covered: true,  scope: "owner" },
      { id: "add_2", scenario: "Bosphorus terrace use after 22:00 forbidden",    stage: "During stay",     added_by: "Building · Bosphorus", source: "bosphorus_owner_briefing.pdf · p.7",   covered: true,  scope: "property" },
      { id: "add_3", scenario: "Cihangir pet upsell standard",                   stage: "Pre-booking",     added_by: "Owner · Cihangir Living", source: "cihangir_house_pets.pdf",         covered: true,  scope: "owner" },
      { id: "add_4", scenario: "Pet deposit handling mid-stay",                  stage: "During stay",     added_by: "You · 2026-03-14",     source: "ad-hoc · approval",                   covered: false, scope: "portfolio" },
      { id: "add_5", scenario: "Recurring leak attribution rule",                stage: "During stay",     added_by: "You · 2026-04-02",     source: "ad-hoc · approval",                   covered: false, scope: "property" },
    ],
    by_property: {
      p_kara12: {
        covered: 75,
        core_covered: 71,
        additions_covered: 4,
        additions_total: 4,
        top_gaps: [
          { id: "g1", scenario: "Pet deposit dispute mid-stay",   stage: "During stay",  why: "No documented pet deposit policy" },
          { id: "g2", scenario: "Off-channel payment refusal",    stage: "Pre-booking",  why: "Cendra has no PM stance on file" },
          { id: "g3", scenario: "Late check-in after lockbox cutoff", stage: "Check-in day", why: "No lockbox cutoff rule defined" },
        ],
      },
      p_bos: {
        covered: 42,
        core_covered: 40,
        additions_covered: 2,
        additions_total: 3,
        top_gaps: [
          { id: "g1", scenario: "Recurring leak attribution dispute", stage: "During stay", why: "Source-of-truth gap" },
          { id: "g2", scenario: "Vendor delay → guest comp",          stage: "During stay", why: "No threshold defined" },
        ],
      },
    },
  },

  // PROACTIVE PLAYBOOK CANDIDATES — patterns Cendra detected from
  // PM data that look like worth automating as a playbook.
  playbook_candidates: [
    {
      id: "pc_orphan",
      name: "Orphan night stay extension offer",
      detected_from: "12 events · last 90 days",
      historic_accept_rate: "45%",
      est_revenue_per_property_30d: "€280",
      confidence: 0.86,
      stage: "Pre-arrival",
      sample_trigger: "Departure leaves a 1-night gap before next booking, no same-day arrival",
      properties_affected: 23,
    },
    {
      id: "pc_pet",
      name: "Pet-friendly upsell · case-by-case",
      detected_from: "7 PM approvals · 3 properties",
      historic_accept_rate: "67%",
      est_revenue_per_property_30d: "€120",
      confidence: 0.74,
      stage: "Pre-booking",
      sample_trigger: "Guest discloses pet at inquiry, property not flagged pet-friendly",
      properties_affected: 6,
    },
    {
      id: "pc_gate",
      name: "Building gate confusion preempt",
      detected_from: "9 first-night messages · 1 property",
      historic_accept_rate: "—",
      est_revenue_per_property_30d: "€0 · sentiment +14",
      confidence: 0.81,
      stage: "Pre-arrival",
      sample_trigger: "Cihangir House guests ask about gate operation in first 2 hours, 9× in 30 days",
      properties_affected: 1,
    },
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
          "What's the cleaning history at this unit?",
          "Why didn't Cendra promise noon?",
          "Draft a tighter reply",
          "Show all 3 prior trips",
        ],
        messages: [
          { id: "m1", channel: "airbnb", time: "07:41:55", from: "guest", body: "Hi! Could we check in at noon? Also what's the Wi-Fi password? Travelling with a 3-year-old and would love to settle in early." },
          { id: "e1", kind: "system", time: "07:41:58", body: "Detected two intents · early check-in + Wi-Fi" },
          { id: "e2", kind: "system", time: "07:42:01", body: "PMS · BKG-44291 · 2 guests · confirmed", source: "Hostaway" },
          { id: "e3", kind: "system", time: "07:42:02", body: "Cleaning schedule · same-day turnover · cleaner ETA 14:30", source: "Properly", tone: "warn" },
          { id: "e4", kind: "system", time: "07:42:02", body: "Owner rule applied · no early-checkin promise without cleaning confirmation" },
          { id: "m2", channel: "airbnb", time: "07:42:08", from: "cendra", autonomy: "auto", body: "Hi Lukas! The Wi-Fi password is in your booking confirmation under \"check-in instructions\" — KK12-Guest / sapphire-otter-9821. Looking into the noon arrival now and will come back to you shortly." },
          { id: "e5", kind: "system", time: "07:42:10", body: "Waiting on cleaner ETA · hold reply prepared, pending your approval", tone: "warn" },
          { id: "d1", channel: "airbnb", time: "07:42:14", from: "cendra", state: "draft", body: "Hi Lukas! For the noon arrival — I'm checking with our cleaning team right now; standard check-in is 15:00 and I'll know within the hour if we can offer something earlier. I'll come back with a confirmed time.", why: "Owner rule · cleaner ETA 14:30 · low SLA pressure", tone_options: ["Warmer", "Tighter", "More formal"] },
        ],
        vendors: [
          {
            id: "v_marta",
            name: "Marta C.", role: "Cleaner", channel: "slack",
            channel_label: "#ops-beyoglu",
            phone_available: true,
            messages: [
              { id: "vm1", channel: "slack", time: "07:42:09", from: "cendra", body: "Hey Marta — can you confirm a sharper ETA for Apt 12? Guest asked for 12:00." },
              { id: "vm2", channel: "slack", time: "08:14:22", from: "vendor", body: "Cleaning at 14:00 max. Looks tight, prev guest checked out late." },
              { id: "ve1", kind: "system", time: "08:14:30", body: "Updated reply draft · using 14:30 buffer" },
              { id: "vm3", channel: "slack", time: "08:16:11", from: "cendra", body: "Got it. I'll hold the guest at 15:00 for safety. If you finish by 13:30 I'll auto-promise that time. Sound good?" },
              { id: "vm4", channel: "slack", time: "08:17:02", from: "vendor", body: "👍 will ping when done" },
            ],
          },
        ],
        activity: [
          { time: "07:41:55", kind: "intake",   body: "Guest message received · Airbnb · BKG-44291" },
          { time: "07:41:58", kind: "ai",       body: "Two intents detected · early check-in + Wi-Fi" },
          { time: "07:42:01", kind: "check",    body: "PMS verified · 2 guests · confirmed" },
          { time: "07:42:02", kind: "check",    body: "Cleaning schedule pulled · same-day turnover" },
          { time: "07:42:02", kind: "rule",     body: "Owner rule applied · no early-checkin promise" },
          { time: "07:42:03", kind: "check",    body: "Wi-Fi fact verified · low risk · safe to send" },
          { time: "07:42:08", kind: "auto",     body: "Auto-sent · Wi-Fi credentials · Airbnb" },
          { time: "07:42:09", kind: "vendor",   body: "Pinged Marta C. · Slack #ops-beyoglu" },
          { time: "07:42:10", kind: "wait",     body: "Waiting on cleaner ETA · hold reply prepared" },
          { time: "07:42:14", kind: "pending",  body: "Drafted holding reply · awaiting your approval" },
          { time: "08:14:22", kind: "vendor",   body: "Marta confirmed cleaning at 14:00 max" },
          { time: "08:16:11", kind: "auto",     body: "Cendra acknowledged ETA · adjusting buffer" },
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
            type: "promise",
            channel: "WhatsApp",
            commitment: "I'll have the plumber out to you within the hour, and follow up the moment the leak's fixed.",
            promised_at: "08:02 today",
            due_at: "09:02 today",
            due_in_min: 26,
            context: "Cendra committed an ETA on guest's behalf. Plumber confirmed 11:20 — still on track unless quote stalls.",
            primary: "Send fulfillment update",
          },
          {
            type: "dependency",
            actor_type: "vendor",
            actor_name: "A. Sözen (Plumber)",
            title: "Waiting on plumber arrival + on-site quote",
            sla_min: 60,
            last_signal: "ETA 11:20 confirmed at 08:14 · no movement since.",
            blocking: "Approval can't release until quote firms; guest's fulfillment promise depends on this signal.",
          },
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
        messages: [
          { id: "m1", channel: "whatsapp", time: "08:00:42", from: "guest", body: "Merhaba, there's water on the bathroom floor and it looks like it's coming from under the sink. Quite a lot already. Sending photos." },
          { id: "m2", channel: "whatsapp", time: "08:01:11", from: "guest", body: "[photo · bathroom_floor_1.jpg]", kind: "media" },
          { id: "m3", channel: "whatsapp", time: "08:01:12", from: "guest", body: "[photo · under_sink.jpg]", kind: "media" },
          { id: "m4", channel: "whatsapp", time: "08:01:13", from: "guest", body: "[photo · puddle.jpg]", kind: "media" },
          { id: "e1", kind: "system", time: "08:01:14", body: "Leak detected · photos analyzed · maintenance triggered", tone: "warn" },
          { id: "e2", kind: "system", time: "08:01:30", body: "Auto-dispatched · Plumber A. Sözen · estimated arrival 11:20" },
          { id: "m5", channel: "whatsapp", time: "08:01:45", from: "cendra", autonomy: "auto", body: "Hi Selin, I can see the leak clearly in your photos — really sorry. I'm getting a plumber out to you now. Will confirm exact arrival time within the next 10 minutes. In the meantime, please put a towel or two down and avoid using that sink." },
          { id: "m6", channel: "whatsapp", time: "08:02:00", from: "guest", body: "Thank you. The bathroom is the only one in the apt though." },
          { id: "e3", kind: "system", time: "08:02:14", body: "Quote received from plumber · €180–€340 · exceeds property cap (€150)", tone: "warn" },
          { id: "e4", kind: "system", time: "08:02:18", body: "Owner notified · Bosphorus Holdings · acknowledged" },
          { id: "e5", kind: "system", time: "08:02:30", body: "Holding ceiling approval — needs PM", tone: "warn" },
          { id: "d1", channel: "whatsapp", time: "08:14:00", from: "cendra", state: "draft", body: "Hi Selin — plumber confirmed for 11:20, really sorry for the inconvenience. He'll knock first; please leave the bathroom door open if you can. I'll follow up once the fix is in.", why: "Guest concerned but not hostile · concise, no premature comp", tone_options: ["More apologetic", "Tighter", "Add comp gesture"] },
        ],
        vendors: [
          {
            id: "v_plumber",
            name: "A. Sözen", role: "Plumber", channel: "phone",
            channel_label: "+90 555 234 8821",
            phone_available: true,
            messages: [
              { id: "vm1", channel: "phone", time: "08:02:00", from: "cendra", kind: "voice", duration: "1m 24s", body: "Voice call dispatched · accepted · ETA 11:20 confirmed · scope: under-sink supply line + drain check" },
              { id: "vm2", channel: "sms", time: "08:08:33", from: "vendor", body: "Quote: parts €60–€140, labor €120–€200. Total range €180–€340. Will narrow on site after diagnostic." },
              { id: "ve1", kind: "system", time: "08:08:45", body: "Quote stored · awaiting PM ceiling approval (exceeds €150 cap)", tone: "warn" },
              { id: "vm3", channel: "sms", time: "08:11:02", from: "cendra", body: "Got it — sending PM approval request now. Will confirm ceiling before you start. Knock before entering, guest expecting you at 11:20." },
              { id: "vm4", channel: "sms", time: "08:11:20", from: "vendor", body: "Copy, will hold until I get the green light." },
            ],
          },
        ],
        activity: [
          { time: "08:00:42", kind: "intake",  body: "Guest message · WhatsApp · 3 photos attached" },
          { time: "08:01:14", kind: "ai",      body: "Image analysis · leak confirmed · severity medium" },
          { time: "08:01:30", kind: "vendor",  body: "Auto-dispatched · Plumber A. Sözen" },
          { time: "08:01:45", kind: "auto",    body: "Acknowledged guest with reassurance + interim instructions" },
          { time: "08:02:00", kind: "vendor",  body: "Voice call placed to plumber · 1m 24s · ETA 11:20" },
          { time: "08:02:14", kind: "rule",    body: "Quote €180–€340 exceeds property auto-cap €150", tone: "warn" },
          { time: "08:02:18", kind: "owner",   body: "Owner notified · Bosphorus Holdings acknowledged" },
          { time: "08:08:33", kind: "vendor",  body: "Plumber quote received · €180–€340" },
          { time: "08:11:02", kind: "auto",    body: "Cendra coordinating ceiling approval flow" },
          { time: "08:14:00", kind: "pending", body: "Drafted apology reply · awaiting your approval" },
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
            type: "abstention",
            abstention_type: "underspecified",
            question: "Should I bend the photo rule for this guest, or hold the line?",
            why_unsure: "Two signals contradict each other: owner rule says no refund > €100 without photos, but the guest pattern (2 prior refunds granted on Airbnb) suggests we trust him. Sentiment hostile + review threat raises the cost of holding firm.",
            what_would_unblock: [
              "A precedent from Galata Estates on whether goodwill bypasses the photo rule",
              "Maya's call on relationship vs policy in this kind of standoff",
              "A new fact: did the AC actually fail? Maintenance verifies on departure — we'd know by 13:00",
            ],
            options: ["I'll decide now", "Wait until 13:00 verify", "Tell Cendra how to handle review threats"],
          },
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
            type: "dependency",
            actor_type: "vendor",
            actor_name: "Galata Maintenance",
            title: "Verify AC condition on departure",
            sla_min: 290,
            last_signal: "Emailed 06:14 today · reply at 07:02 promised 13:00 findings.",
            blocking: "Decline-without-evidence stance hardens or softens depending on this verify — if AC truly faulty, owner rule arguably moot.",
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
        ],
        messages: [
          { id: "m1", channel: "booking", time: "Yesterday 18:14", from: "guest", body: "Die Klimaanlage funktioniert nicht richtig. We've been hot the whole stay. Looking for a partial refund." },
          { id: "e1", kind: "system", time: "Yesterday 18:14", body: "Refund request detected · €120 implied", tone: "warn" },
          { id: "e2", kind: "system", time: "Yesterday 18:15", body: "Galata Estates rule pack · refunds over €100 require photo evidence", tone: "warn" },
          { id: "e3", kind: "system", time: "Yesterday 18:16", body: "Prior refund history checked · 2 granted on Airbnb with photos, this is 3rd ask", tone: "warn" },
          { id: "m2", channel: "booking", time: "Yesterday 18:18", from: "cendra", autonomy: "auto", body: "Hi Thomas, I'm sorry the AC has been bothering you. To help me process this with the property owner, could you send me a quick photo or short video showing the issue? Once I have that I can move on the refund quickly." },
          { id: "m3", channel: "instagram", time: "Yesterday 21:02", from: "guest", body: "I sent a message on booking, also DMing you here since you didn't respond fast enough. Please refund €120.", kind: "cross_channel" },
          { id: "e4", kind: "system", time: "Yesterday 21:02", body: "Cross-channel match · same guest reached out on Instagram · merged thread", tone: "info" },
          { id: "m4", channel: "instagram", time: "Yesterday 21:05", from: "cendra", autonomy: "auto", body: "Hi Thomas — yes I'm here, replied on Booking already. Same answer: send a photo of the AC issue and I'll process the refund quickly. Otherwise we can do a €40 goodwill credit." },
          { id: "m5", channel: "booking", time: "Yesterday 22:14", from: "guest", body: "I'm not sending photos. This is ridiculous. Either refund or I leave a bad review." },
          { id: "e5", kind: "system", time: "Yesterday 22:14", body: "Review threat detected · sentiment shifted to hostile · outbound paused, escalation drafted", tone: "warn" },
          { id: "d1", channel: "booking", time: "Today 07:32", from: "cendra", state: "draft", body: "Hi Thomas — to process a refund of €120, the property owner asks us to see a photo of the AC issue. If you can send one before checkout, I can move quickly. Otherwise we can offer a €40 goodwill credit toward your next stay.", why: "Bridges owner rule with soft alternative · keeps relationship intact, doesn't escalate", tone_options: ["Warmer", "Firmer", "Drop the credit"] },
        ],
        vendors: [
          {
            id: "v_maintenance",
            name: "Galata Maintenance", role: "Building maintenance", channel: "email",
            channel_label: "ops@galataestates.com",
            phone_available: true,
            messages: [
              { id: "vm1", channel: "email", time: "Today 06:14", from: "cendra", body: "Subject: AC complaint — Galata 3 — pre-checkout check\n\nGuest reports AC issue, no photos provided. Refund requested. Can the team verify AC condition before next guest arrival? Last service log: 47 days ago." },
              { id: "vm2", channel: "email", time: "Today 07:02", from: "vendor", body: "Subject: Re: AC complaint\n\nWill verify on departure. Logs show last filter clean 14d ago, no outstanding work orders. Will report findings by 13:00." },
            ],
          },
        ],
        activity: [
          { time: "Yesterday 18:14", kind: "intake",  body: "Refund request received · Booking.com · €120" },
          { time: "Yesterday 18:15", kind: "rule",    body: "Owner rule · photos required for refunds > €100", tone: "warn" },
          { time: "Yesterday 18:16", kind: "ai",      body: "Pattern flag · 3rd refund ask this trip · 2 prior granted on Airbnb with photos" },
          { time: "Yesterday 18:18", kind: "auto",    body: "Auto-asked for photo evidence · Booking.com" },
          { time: "Yesterday 21:02", kind: "intake",  body: "Cross-channel · guest re-engaged via Instagram DM" },
          { time: "Yesterday 21:05", kind: "auto",    body: "Acknowledged on Instagram · pointed back to Booking thread" },
          { time: "Yesterday 22:14", kind: "ai",      body: "Sentiment shift detected · review threat · outbound paused", tone: "warn" },
          { time: "Yesterday 23:01", kind: "owner",   body: "Owner notified · Galata Estates acknowledged" },
          { time: "Today 06:14",     kind: "vendor",  body: "Emailed maintenance · AC condition verification requested" },
          { time: "Today 07:02",     kind: "vendor",  body: "Maintenance reply · will verify on departure, logs clean" },
          { time: "Today 07:32",     kind: "pending", body: "Drafted bridge reply · awaiting your decision" },
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
