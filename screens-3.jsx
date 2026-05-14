// Cendra Agent OS — new screens v2:
// Properties (portfolio + detail), Playbook Library, Insights, Trust, Team, Onboarding
const { Pill, AutonomyPill, ReasonPill, Seal, Btn, ActionBar, DecisionCard, PageHeader, QuietState, cls } = window.CendraAtoms;
const { ChannelChip } = window.CendraVision;
const { StatusPill, StateBadge, SLATimer, PortfolioFilterBar, IntegrationHealthCard, HardRuleCard,
        KnowledgeGapCard, PropertyFactRow, TeamAssignmentCard, LiveActivityMilestone,
        SignalStrip, SectionHead, WorkflowTrustRow } = window.CendraAtoms2;
// AuditTrailPanel lives in screens-2; pulled in at runtime via window.CendraScreens2
const AuditTrailPanel = () => window.CendraScreens2.AuditTrailPanel
  ? React.createElement(window.CendraScreens2.AuditTrailPanel)
  : null;
const D2 = window.CENDRA_DATA;
const D3 = window.CENDRA_DATA2;

// ───────────────────────────────────────────────────────────────────
// PROPERTIES — portfolio overview
// ───────────────────────────────────────────────────────────────────
function PropertiesScreen({ onOpen }) {
  const props = D3.properties_brain;
  const [filter, setFilter] = useState("attention");
  const [importOpen, setImportOpen] = useState(false);

  // Derive issue count per property and the top blocker
  const enriched = props.map(p => ({
    ...p,
    issues: (p.missing || 0) + (p.conflicts || 0) + (p.blocked || 0) + (p.stale || 0),
  }));
  const topBlocker = [...enriched].sort((a, b) =>
    (b.blocked - a.blocked) ||
    (b.conflicts - a.conflicts) ||
    (b.missing - a.missing) ||
    (b.asks - a.asks)
  )[0];

  const filterDefs = [
    { id: "attention", label: "Needs action", test: p => p.issues > 0 || p.integrations !== 'all_ok', sort: (a,b) => b.issues - a.issues },
    { id: "asked",     label: "Most asked",   test: () => true, sort: (a,b) => b.asks - a.asks },
    { id: "stale",     label: "Stale facts",  test: p => p.stale > 0, sort: (a,b) => b.stale - a.stale },
    { id: "all",       label: "All",          test: () => true, sort: (a,b) => b.asks - a.asks },
  ];
  const def = filterDefs.find(f => f.id === filter);
  const shown = [...enriched].filter(def.test).sort(def.sort);

  // Totals for hero
  const totalGaps = enriched.reduce((s, p) => s + (p.missing || 0) + (p.conflicts || 0), 0);
  const totalStale = enriched.reduce((s, p) => s + (p.stale || 0), 0);
  const blockedCount = enriched.filter(p => p.blocked > 0).length;

  return (
    <div className="stage" style={{maxWidth: 1080, paddingTop: 56, paddingBottom: 120}}>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 28, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>PORTFOLIO BRAIN</span>
        <span style={{flex:1}} />
        <span>{props.length} UNITS · 5 OWNERS · 4 REGIONS</span>
        <button onClick={() => setImportOpen(true)} style={{
          all: 'unset', cursor: 'pointer',
          background: 'var(--ink)', color: '#ffffff',
          padding: '7px 14px', borderRadius: 8,
          fontSize: 12, fontWeight: 600, letterSpacing: 0,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          textTransform: 'none',
        }}>
          ↓ Import knowledge
        </button>
      </div>

      {/* HERO — narrative on what needs attention */}
      <div style={{marginBottom: 48}}>
        <h1 className="serif-display" style={{
          fontSize: 46, lineHeight: 1.05, margin: 0, color: 'var(--ink)',
        }}>
          {totalGaps > 0
            ? <>{totalGaps} knowledge gap{totalGaps > 1 ? 's' : ''} hold Cendra back.</>
            : <>Every property is fully briefed.</>
          }
        </h1>
        {topBlocker && topBlocker.issues > 0 && (
          <p style={{
            fontSize: 16.5, lineHeight: 1.55, margin: '18px 0 0',
            color: 'var(--ink-mid)', maxWidth: 720, fontFamily: 'var(--sans)',
          }}>
            <b style={{color:'var(--ink)'}}>{topBlocker.name}</b> is the top blocker — {topBlocker.missing > 0 && `${topBlocker.missing} missing fact${topBlocker.missing > 1 ? 's' : ''}`}
            {topBlocker.missing > 0 && (topBlocker.conflicts > 0 || topBlocker.blocked > 0) ? ', ' : ''}
            {topBlocker.conflicts > 0 && `${topBlocker.conflicts} conflict${topBlocker.conflicts > 1 ? 's' : ''}`}
            {topBlocker.conflicts > 0 && topBlocker.blocked > 0 ? ', ' : ''}
            {topBlocker.blocked > 0 && `${topBlocker.blocked} blocked by integration`}.
          </p>
        )}
      </div>

      {/* HERO BLOCKER CARD */}
      {topBlocker && topBlocker.issues > 0 && (
        <div style={{
          background: '#ffffff', border: '1px solid var(--hair)', borderRadius: 16,
          padding: '28px 32px', marginBottom: 48,
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{position:'absolute', top:0, left:0, width:4, height:'100%', background: topBlocker.risk === 'high' ? 'var(--rausch)' : 'var(--warn)'}} />
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 14}}>
            <span className="mono" style={{fontSize: 10, letterSpacing: '.18em', color: topBlocker.risk === 'high' ? 'var(--rausch)' : 'var(--warn)', fontWeight: 600}}>TOP BLOCKER</span>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
            <span className="mono" style={{fontSize:10, letterSpacing:'.12em', color:'var(--muted)'}}>
              {topBlocker.region.toUpperCase()} · {topBlocker.owner.toUpperCase()}
            </span>
            <span style={{flex:1}} />
            <Pill tone={topBlocker.risk === 'high' ? 'risk' : topBlocker.risk === 'medium' ? 'warn' : 'ok'}>{topBlocker.risk} risk</Pill>
          </div>
          <h2 className="serif-display" style={{fontSize: 30, lineHeight: 1.12, margin: 0, color:'var(--ink)', marginBottom: 14}}>
            {topBlocker.name}
          </h2>
          <div style={{display:'flex', gap: 28, flexWrap:'wrap', marginBottom: 18}}>
            <MicroBlockerStat value={topBlocker.asks} label="asks · 30d" />
            {topBlocker.missing > 0 && <MicroBlockerStat value={topBlocker.missing} label="missing" tone="warn" />}
            {topBlocker.conflicts > 0 && <MicroBlockerStat value={topBlocker.conflicts} label="conflicts" tone="warn" />}
            {topBlocker.blocked > 0 && <MicroBlockerStat value={topBlocker.blocked} label="blocked" tone="risk" />}
            {topBlocker.integrations !== 'all_ok' && <MicroBlockerStat value="!" label="integration" tone="risk" />}
          </div>
          <div style={{display:'flex', alignItems:'center', gap: 14, flexWrap:'wrap'}}>
            <button onClick={() => onOpen('properties',topBlocker.id)} style={{
              all:'unset', cursor:'pointer',
              background:'var(--ink)', color:'#ffffff',
              padding:'12px 22px', borderRadius: 10,
              fontSize: 14.5, fontWeight: 600,
              display:'inline-flex', alignItems:'center', gap: 8,
            }}>
              Open {topBlocker.name}
              <span style={{fontFamily:'var(--mono)', fontSize:13, opacity:.8}}>↵</span>
            </button>
            <Btn kind="ghost">Patch the gaps with Cendra →</Btn>
          </div>
        </div>
      )}

      {/* MICRO STAT BAND */}
      <div style={{
        display:'flex', gap: 36, flexWrap:'wrap',
        paddingBottom: 24, marginBottom: 24, borderBottom:'1px solid var(--hair-soft)',
      }}>
        <MicroStatBlock2 value={props.length} label="properties" />
        <MicroStatBlock2 value="1,284" label="verified facts" sub="+12 this week" />
        <MicroStatBlock2 value={totalGaps} label="knowledge gaps" tone={totalGaps > 0 ? "warn" : "ok"} />
        <MicroStatBlock2 value={blockedCount} label="automation blocked" tone={blockedCount > 0 ? "warn" : "ok"} />
        <MicroStatBlock2 value={totalStale} label="stale (>60d)" tone={totalStale > 0 ? "warn" : "ok"} />
      </div>

      {/* KNOWLEDGE SOURCES STRIP — portfolio sources Cendra has ingested */}
      <KnowledgeSourcesStrip
        sources={D3.knowledge_sources.portfolio}
        onAdd={() => setImportOpen(true)}
      />

      {/* SCENARIO COVERAGE + PLAYBOOK CANDIDATES — sectoral intelligence */}
      <PortfolioIntelligenceStrip
        coverage={D3.scenario_coverage}
        candidates={D3.playbook_candidates}
        onOpenPlaybook={() => onOpen('playbook_library')}
      />

      {/* FILTER PILLS */}
      <div style={{display:'flex', gap: 8, flexWrap:'wrap', marginBottom: 20}}>
        {filterDefs.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            all:'unset', cursor:'pointer',
            padding:'7px 14px', borderRadius: 999,
            border:'1px solid ' + (filter === f.id ? 'var(--ink)' : 'var(--hair)'),
            background: filter === f.id ? 'var(--ink)' : '#ffffff',
            color: filter === f.id ? '#ffffff' : 'var(--ink-mid)',
            fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--sans)',
          }}>
            {f.label}
            <span style={{marginLeft: 8, opacity: filter === f.id ? .7 : .5, fontFamily:'var(--mono)', fontSize: 11}}>
              {enriched.filter(f.test).length}
            </span>
          </button>
        ))}
      </div>

      {/* COMPACT PROPERTY ROWS — single-line scan */}
      <div className="dcard" style={{padding: 0, overflow: 'hidden'}}>
        <div style={{
          display:'grid', gridTemplateColumns: 'minmax(220px, 1.4fr) 160px 80px 100px 110px 90px',
          gap: 14, padding: '12px 22px', background:'var(--paper-2)',
          borderBottom:'1px solid var(--hair)',
          fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.12em', color:'var(--muted)', textTransform:'uppercase', fontWeight: 500,
        }}>
          <div>Property</div><div>Owner</div>
          <div style={{textAlign:'right'}}>Asks 30d</div>
          <div style={{textAlign:'right'}}>Issues</div>
          <div>Integrations</div>
          <div>Risk</div>
        </div>
        {shown.map((p, i) => (
          <button key={p.id} onClick={() => onOpen('properties',p.id)} style={{
            all:'unset', cursor:'pointer', display:'grid',
            gridTemplateColumns:'minmax(220px, 1.4fr) 160px 80px 100px 110px 90px',
            gap:14, padding:'14px 22px',
            borderBottom: i < shown.length - 1 ? '1px solid var(--hair-soft)' : 'none',
            alignItems:'center', width:'calc(100% - 44px)',
            background: '#ffffff',
          }}>
            <div>
              <div style={{fontSize:13.5, fontWeight:500, letterSpacing:'-.005em', color:'var(--ink)'}}>{p.name}</div>
              <div className="mono" style={{fontSize:10.5, marginTop:2, color:'var(--muted)', letterSpacing:'.04em'}}>{p.region} · last clean {p.last_clean}</div>
            </div>
            <div style={{fontSize: 12.5, color:'var(--ink-mid)'}}>{p.owner}</div>
            <div className="mono" style={{fontSize: 12, fontVariantNumeric:'tabular-nums', textAlign:'right', color: p.asks > 15 ? 'var(--warn)' : 'var(--ink)'}}>{p.asks}</div>
            <div style={{textAlign:'right'}}>
              {p.issues > 0 ? (
                <span className="mono" style={{fontSize: 12, color:'var(--warn)', fontVariantNumeric:'tabular-nums', fontWeight: 600}}>
                  {p.issues}
                </span>
              ) : (
                <span className="mono" style={{fontSize: 11, color:'var(--ok)'}}>✓</span>
              )}
            </div>
            <div>
              {p.integrations === 'all_ok'
                ? <span style={{fontSize:11.5, color:'var(--ok)', fontWeight: 500}}>● All OK</span>
                : <Pill tone="warn">Degraded</Pill>
              }
            </div>
            <div>
              <Pill tone={p.risk === 'high' ? 'risk' : p.risk === 'medium' ? 'warn' : 'ok'}>{p.risk}</Pill>
            </div>
          </button>
        ))}
      </div>

      {importOpen && <ImportModal scope="portfolio" onClose={() => setImportOpen(false)} />}
    </div>
  );
}

// Portfolio knowledge sources strip — horizontal carousel of latest imports
function KnowledgeSourcesStrip({ sources, onAdd }) {
  const top = (sources || []).slice(0, 3);
  return (
    <section style={{marginBottom: 28}}>
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 12, gap: 12, flexWrap: 'wrap'}}>
        <div>
          <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--ink)', fontWeight: 600, textTransform:'uppercase', marginBottom: 4}}>
            Knowledge sources · {sources?.length || 0}
          </div>
          <div style={{fontSize: 13, color:'var(--muted)'}}>
            Cendra has read these to build the portfolio brain. Drop anything else and it'll learn from it.
          </div>
        </div>
        <button onClick={onAdd} style={{
          all:'unset', cursor:'pointer',
          padding:'7px 14px', borderRadius: 999,
          border:'1px solid var(--ink)', background:'#ffffff',
          fontSize: 12.5, fontWeight: 500, color:'var(--ink)',
          fontFamily: 'var(--sans)',
        }}>+ Add source</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap: 10}}>
        {top.map(s => <KnowledgeSourceCard key={s.id} source={s} compact />)}
      </div>
    </section>
  );
}

// Portfolio intelligence strip — scenario coverage + playbook candidates
function PortfolioIntelligenceStrip({ coverage, candidates, onOpenPlaybook }) {
  const pct = Math.round((coverage.portfolio_covered / coverage.portfolio_total) * 100);
  return (
    <section style={{marginBottom: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
      {/* Scenario coverage card */}
      <div style={{
        background: '#ffffff', border: '1px solid var(--hair)', borderRadius: 14,
        padding: '18px 22px',
      }}>
        <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 6, fontWeight: 500}}>
          Scenario coverage
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4}}>
          <span style={{fontFamily:'var(--sans)', fontSize: 28, fontWeight: 500, letterSpacing:'-.018em', color:'var(--ink)', fontVariantNumeric:'tabular-nums'}}>
            {coverage.portfolio_covered}<span style={{fontSize: 16, color:'var(--muted)'}}> / {coverage.portfolio_total}</span>
          </span>
          <span className="mono" style={{fontSize: 11, color: pct >= 50 ? 'var(--ok)' : 'var(--warn)', fontWeight: 600}}>
            {pct}%
          </span>
        </div>
        <div style={{fontSize: 12.5, color:'var(--muted)', marginBottom: 14}}>
          Hospitality scenarios Cendra can confidently handle for your portfolio.
        </div>
        <div style={{display: 'flex', gap: 6, height: 8, background: 'var(--hair-soft)', borderRadius: 4, overflow: 'hidden', marginBottom: 12}}>
          {coverage.stages.map(s => (
            <div key={s.id} title={`${s.label}: ${s.covered}/${s.total}`} style={{
              flex: s.total,
              background: s.covered / s.total >= 0.6 ? 'var(--ok)' : s.covered / s.total >= 0.3 ? 'var(--warn)' : 'var(--hair)',
            }} />
          ))}
        </div>
        <div className="mono" style={{fontSize: 9.5, letterSpacing:'.10em', color:'var(--muted)', textTransform:'uppercase', display:'flex', gap: 4, flexWrap:'wrap'}}>
          {coverage.stages.map(s => (
            <span key={s.id} style={{flex: s.total, minWidth: 0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
              {s.label.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Playbook candidates card */}
      <div style={{
        background: '#ffffff', border: '1px solid var(--hair)', borderRadius: 14,
        padding: '18px 22px',
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6}}>
          <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', fontWeight: 500}}>
            Playbook candidates · {candidates.length}
          </div>
          <button onClick={onOpenPlaybook} style={{
            all:'unset', cursor:'pointer',
            fontSize: 11, color:'var(--ink)', fontFamily:'var(--mono)', letterSpacing:'.06em', fontWeight: 500,
          }}>review all →</button>
        </div>
        <div style={{fontSize: 12.5, color:'var(--muted)', marginBottom: 14}}>
          Proactive playbooks Cendra detected from your operational patterns.
        </div>
        <div style={{display:'grid', gap: 8}}>
          {candidates.slice(0, 3).map(c => (
            <div key={c.id} style={{
              display:'grid', gridTemplateColumns:'1fr auto', gap: 12, alignItems:'center',
              padding:'10px 12px', borderRadius: 8,
              background: 'var(--paper-2)',
            }}>
              <div style={{minWidth: 0}}>
                <div style={{fontSize: 13, color:'var(--ink)', fontWeight: 500, marginBottom: 2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                  {c.name}
                </div>
                <div className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.04em'}}>
                  {c.detected_from} · {c.est_revenue_per_property_30d}
                </div>
              </div>
              <span className="mono" style={{fontSize: 10.5, color: c.confidence >= 0.8 ? 'var(--ok)' : 'var(--warn)', fontWeight: 600}}>
                {Math.round(c.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stat blocks for Properties hero / band
function MicroBlockerStat({ value, label, tone }) {
  const color = tone === 'warn' ? 'var(--warn)' : tone === 'risk' ? 'var(--rausch)' : 'var(--ink)';
  return (
    <div>
      <div style={{fontFamily:'var(--sans)', fontSize: 22, fontWeight: 500, color, lineHeight: 1.1, letterSpacing:'-.015em', fontVariantNumeric:'tabular-nums'}}>{value}</div>
      <div className="mono" style={{fontSize: 10, letterSpacing:'.12em', color:'var(--muted)', textTransform:'uppercase', marginTop: 4, fontWeight: 500}}>{label}</div>
    </div>
  );
}
function MicroStatBlock2({ value, label, sub, tone }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'risk' ? 'var(--risk)' : 'var(--ink)';
  return (
    <div>
      <div style={{fontFamily:'var(--sans)', fontSize: 22, fontWeight: 500, color, lineHeight: 1.1, letterSpacing:'-.015em', fontVariantNumeric:'tabular-nums'}}>{value}</div>
      <div className="mono" style={{fontSize: 10, letterSpacing:'.12em', color:'var(--muted)', textTransform:'uppercase', marginTop: 4, fontWeight: 500}}>{label}</div>
      {sub && <div className="mono" style={{fontSize: 10, color:'var(--muted-2)', marginTop: 2}}>{sub}</div>}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// PROPERTY DETAIL
// ───────────────────────────────────────────────────────────────────
// Parse a fact's last_verified / fresh into approximate "days ago" for as_of comparison.
// Supports: "12d ago", "live", "just now", "Today …", "60d", "Jul 2024", "Refurb · Oct 2024".
function factVerifiedDaysAgo(fact) {
  const f = fact.last_verified || fact.fresh || '';
  if (typeof f !== 'string') return 0;
  if (/^(live|just now|today)/i.test(f)) return 0;
  const d = f.match(/(\d+)d/i);
  if (d) return parseInt(d[1], 10);
  // Month name = at least 30 days
  if (/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(f)) {
    const yMatch = f.match(/20\d{2}/);
    if (yMatch) {
      const year = parseInt(yMatch[0], 10);
      const now = new Date();
      const monthIdx = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
        .findIndex(m => new RegExp(m, 'i').test(f));
      const d2 = new Date(year, Math.max(0, monthIdx), 15);
      return Math.max(0, Math.round((now - d2) / 86400000));
    }
    return 60; // unknown year → assume ~60d
  }
  return 0;
}

const AS_OF_PRESETS = [
  { id: 'now',     label: 'Now',           daysBack: 0 },
  { id: '7d',      label: '7 days ago',    daysBack: 7 },
  { id: '30d',     label: '30 days ago',   daysBack: 30 },
  { id: '90d',     label: '90 days ago',   daysBack: 90 },
  { id: '180d',    label: '6 months ago',  daysBack: 180 },
  { id: '365d',    label: '1 year ago',    daysBack: 365 },
];

function PropertyDetailScreen({ onOpen, arg, focus }) {
  // Resolve property from the single property_details map.
  // synthProperty falls back to portfolio-summary data when the rich record is missing.
  const targetId = arg || "p_kara12";
  const richMap = D3.property_details || {};
  const summary = (D3.properties_brain || []).find(x => x.id === targetId) || (D3.properties_brain || [])[0];
  const richRecord = richMap[targetId] || null;
  const synthTemplate = richMap.p_kara12; // canonical shape donor for synth fallback
  const p = richRecord || synthProperty(summary, synthTemplate);

  // Knowledge sources for THIS property
  const propSources = (D3.knowledge_sources?.by_property?.[targetId]) || [];
  const propCoverage = D3.scenario_coverage?.by_property?.[targetId];

  const [importOpen, setImportOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(true);
  // Audit §7 #4 — Property Brain as_of bi-temporal slider.
  // `?as_of=…` is supported by PmFactStore.list_facts; the UI is the slider.
  const [asOfPreset, setAsOfPreset] = useState('now');
  const asOfDays = AS_OF_PRESETS.find(p => p.id === asOfPreset)?.daysBack || 0;
  const isAsOfPast = asOfDays > 0;

  // Hold facts in local state so edits persist within the session
  const [factGroups, setFactGroups] = useState(p.fact_groups);

  // Conflict resolver state
  const [resolving, setResolving] = useState(null); // { groupIdx, factIdx, fact }
  const openResolver = (groupIdx, factIdx, fact) => setResolving({ groupIdx, factIdx, fact });
  const [rules, setRules] = useState(p.rules || [
    { id: "r1", text: "Never offer late checkout if same-day turnover", source: "OWNER · 32d" },
    { id: "r2", text: "Hot water heater: flush every 30 days",          source: "CLEANER · 8d" },
    { id: "r3", text: "Quiet hours: 23:00 → 08:00 (building rule)",     source: "BUILDING · 60d" },
  ]);
  const [rulesOpen, setRulesOpen]   = useState(true);
  const [integOpen, setIntegOpen]   = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [guestsOpen, setGuestsOpen]   = useState(false);
  const [postureOpen, setPostureOpen] = useState(false);

  // Roll-up attention items (missing / conflict / stale) for THIS property
  const attention = factGroups.flatMap(g => g.facts.filter(f => ["missing","conflict","stale"].includes(f.state)).map(f => ({...f, _group: g.label})));

  const verifiedCount = factGroups.flatMap(g => g.facts).filter(f => f.state === "verified").length;
  const missingCount  = factGroups.flatMap(g => g.facts).filter(f => f.state === "missing").length;
  const conflictCount = factGroups.flatMap(g => g.facts).filter(f => f.state === "conflict").length;
  const staleCount    = factGroups.flatMap(g => g.facts).filter(f => f.state === "stale").length;

  const updateFact = (groupIdx, factIdx, patch) => {
    setFactGroups(gs => gs.map((g, gi) => gi !== groupIdx ? g : {
      ...g,
      facts: g.facts.map((f, fi) => fi !== factIdx ? f : { ...f, ...patch }),
    }));
  };
  const addFact = (groupIdx, newFact) => {
    setFactGroups(gs => gs.map((g, gi) => gi !== groupIdx ? g : {
      ...g,
      facts: [...g.facts, { ...newFact, state: newFact.value && newFact.value !== "—" ? "verified" : "missing" }],
    }));
  };

  return (
    <div className="stage" style={{maxWidth: 1020, paddingTop: 56, paddingBottom: 120}}>
      <button onClick={() => onOpen('properties')} className="mono" style={{
        all:'unset', cursor:'pointer', fontSize: 11, letterSpacing:'.14em',
        color:'var(--muted)', marginBottom: 24, display:'inline-block',
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
        ← ALL PROPERTIES
      </button>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 24, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>PROPERTY · {(p.region || '').toUpperCase()} · {(p.group || '').toUpperCase()}</span>
        <span style={{flex:1}} />
        <span>{p.owner.toUpperCase()}{p.primary_contact ? ` · ${p.primary_contact.toUpperCase()}` : ''}</span>
      </div>

      {/* HERO */}
      <div style={{marginBottom: 32}}>
        <h1 className="serif-display" style={{fontSize: 46, lineHeight: 1.05, margin: 0, color:'var(--ink)', letterSpacing:'-.02em'}}>
          {p.name}
        </h1>
        <p style={{fontSize: 15.5, lineHeight: 1.55, margin:'14px 0 0', color:'var(--ink-mid)', maxWidth: 720}}>
          {p.access || '—'}
          {p.wifi && <> · Wi-Fi <b style={{color:'var(--ink)'}}>{p.wifi.split(' / ')[0]}</b></>}
          {p.floor && <> · {p.floor}</>}
        </p>
      </div>

      {/* AS_OF SLIDER — bi-temporal time travel. View what Cendra knew on a past date. */}
      <div style={{
        display:'flex', gap: 14, alignItems:'center',
        padding: '10px 14px', marginBottom: 16,
        background: isAsOfPast ? 'rgba(255,180,0,.08)' : 'var(--paper-2)',
        border: '1px solid ' + (isAsOfPast ? 'rgba(255,180,0,.30)' : 'var(--hair-soft)'),
        borderRadius: 10,
      }}>
        <span className="mono" style={{
          fontSize: 10, letterSpacing:'.16em',
          color: isAsOfPast ? '#B45309' : 'var(--muted)',
          fontWeight: 600, textTransform:'uppercase',
        }}>
          {isAsOfPast ? 'Time travel · viewing past' : 'As of'}
        </span>
        <div style={{display:'flex', gap: 4, flexWrap:'wrap'}}>
          {AS_OF_PRESETS.map(opt => (
            <button key={opt.id} onClick={() => setAsOfPreset(opt.id)} style={{
              all:'unset', cursor:'pointer',
              padding:'4px 10px', borderRadius: 999,
              border:'1px solid ' + (asOfPreset === opt.id ? 'var(--ink)' : 'var(--hair)'),
              background: asOfPreset === opt.id ? 'var(--ink)' : '#ffffff',
              color: asOfPreset === opt.id ? '#ffffff' : 'var(--ink-mid)',
              fontSize: 11, fontWeight: 500, fontFamily: 'var(--sans)',
            }}>
              {opt.label}
            </button>
          ))}
        </div>
        <span style={{flex: 1}} />
        {isAsOfPast && (() => {
          const allFacts = factGroups.flatMap(g => g.facts);
          const notYetKnown = allFacts.filter(f => factVerifiedDaysAgo(f) < asOfDays && f.state !== 'missing').length;
          return (
            <span className="mono" style={{fontSize: 10.5, color:'#B45309', letterSpacing:'.06em'}}>
              {notYetKnown} fact{notYetKnown !== 1 ? 's' : ''} not yet known
            </span>
          );
        })()}
      </div>

      {/* MICRO STAT BAND */}
      <div style={{
        display:'flex', gap: 36, flexWrap:'wrap',
        paddingBottom: 24, marginBottom: 24, borderBottom:'1px solid var(--hair-soft)',
      }}>
        <MicroStatBlock2 value={verifiedCount} label="verified facts" />
        <MicroStatBlock2 value={missingCount} label="missing" tone={missingCount > 0 ? "warn" : "ok"} />
        <MicroStatBlock2 value={conflictCount} label="conflicts" tone={conflictCount > 0 ? "warn" : "ok"} />
        <MicroStatBlock2 value={staleCount} label="stale" tone={staleCount > 0 ? "warn" : "ok"} />
        <span style={{flex:1}} />
        <MicroStatBlock2 value={summary?.integrations === "all_ok" ? "all OK" : (summary?.integrations || "—")} label="integrations" tone={summary?.integrations === "all_ok" ? "ok" : "warn"} />
      </div>

      {/* ATTENTION HERO — only when something needs work (Von Restorff) */}
      {attention.length > 0 && (
        <div style={{
          background:'#ffffff', border:'1px solid var(--hair)', borderRadius: 16,
          padding:'24px 28px', marginBottom: 32,
          boxShadow:'0 4px 24px rgba(0,0,0,0.04)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{position:'absolute', top:0, left:0, width: 4, height:'100%', background:'var(--warn)'}} />
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 12}}>
            <span className="mono" style={{fontSize: 10, letterSpacing:'.18em', color:'var(--warn)', fontWeight: 600}}>NEEDS YOUR INPUT</span>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
            <span className="mono" style={{fontSize:10, letterSpacing:'.12em', color:'var(--muted)'}}>{attention.length} FACT{attention.length === 1 ? '' : 'S'} HOLDING CENDRA BACK</span>
          </div>
          <h2 className="serif-display" style={{fontSize: 24, lineHeight: 1.2, margin: 0, color:'var(--ink)', marginBottom: 14}}>
            Cendra is waiting on you for {attention.length === 1 ? "one fact" : `${attention.length} facts`}.
          </h2>
          <div style={{display:'grid', gap: 8}}>
            {attention.map((f, i) => {
              // Find the indices so we can patch the right fact
              let gi = -1, fi = -1;
              factGroups.forEach((g, _gi) => g.facts.forEach((ff, _fi) => { if (ff === f || (ff.fact === f.fact && ff.value === f.value && ff.state === f.state)) { gi = _gi; fi = _fi; } }));
              return (
                <div key={i} style={{
                  display:'grid', gridTemplateColumns:'140px 1fr auto', gap: 14, alignItems:'center',
                  padding:'10px 14px', borderRadius: 8,
                  background: 'var(--paper-2)', border:'1px solid var(--hair)',
                }}>
                  <span className="mono" style={{fontSize: 10, letterSpacing:'.14em', color: f.state === "conflict" ? 'var(--warn)' : f.state === "stale" ? 'var(--info)' : 'var(--muted)', fontWeight: 600, textTransform:'uppercase'}}>
                    {f.state} · {f.fact}
                  </span>
                  <span style={{fontSize: 13, color:'var(--ink-mid)'}}>
                    {f.state === "missing" ? "No value yet" : f.value}
                    {f.state === "conflict" && <> · source mismatch</>}
                  </span>
                  <Btn size="sm" onClick={() => {
                    if (f.state === "conflict" && f.conflict_sources) {
                      openResolver(gi, fi, f);
                    } else if (f.state === "missing") {
                      // For missing facts, scroll to the row and let inline edit handle it
                      openResolver(gi, fi, f);
                    } else if (f.state === "stale") {
                      // Quick confirm — just refresh the source date
                      if (gi >= 0 && fi >= 0) updateFact(gi, fi, { fresh: "just now", state: "verified", source: "Confirmed by you" });
                    }
                  }}>
                    {f.state === "missing" ? "Add value" : f.state === "stale" ? "Confirm" : "Resolve"} →
                  </Btn>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RISKS — small flagged callout */}
      {p.risks && p.risks.length > 0 && (
        <div style={{
          display:'flex', gap: 14, padding:'14px 18px',
          background:'#ffffff', border:'1px solid var(--hair)', borderLeft:'4px solid var(--warn)',
          borderRadius: 10, marginBottom: 32, fontSize: 13,
        }}>
          <span className="mono" style={{fontSize: 10, letterSpacing:'.18em', color:'var(--warn)', fontWeight: 600, whiteSpace:'nowrap', paddingTop: 2}}>RISKS</span>
          <span style={{color:'var(--ink)'}}>{p.risks.join(' · ')}</span>
        </div>
      )}

      {/* FACTS — always open, inline-editable */}
      <div style={{marginBottom: 32}}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing:'.14em', color:'var(--ink)',
          fontWeight: 600, textTransform:'uppercase', marginBottom: 6,
        }}>What Cendra knows · {verifiedCount} verified</div>
        <div style={{fontSize: 13, color:'var(--muted)', marginBottom: 16}}>
          Click any row to edit. Cendra learns from your changes and applies them on the next matching guest.
        </div>
        <div style={{display:'grid', gap: 28}}>
          {factGroups.map((g, gi) => (
            <div key={gi}>
              <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 10, fontWeight: 500}}>
                {g.label} · {g.facts.length}
              </div>
              <div className="dcard" style={{padding: 0, overflow:'hidden'}}>
                {g.facts.map((f, fi) => (
                  <EditableFactRow
                    key={fi}
                    fact={f}
                    onUpdate={patch => updateFact(gi, fi, patch)}
                    onResolve={() => openResolver(gi, fi, f)}
                    isLast={fi === g.facts.length - 1}
                    asOfDays={asOfDays}
                  />
                ))}
                <AddFactRow onAdd={fact => addFact(gi, fact)} groupHint={g.label} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCENARIO COVERAGE — what hospitality situations Cendra can handle here */}
      {propCoverage && (
        <div style={{
          background: '#ffffff', border: '1px solid var(--hair)', borderRadius: 14,
          padding: '20px 24px', marginBottom: 24,
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14, marginBottom: 14, flexWrap: 'wrap'}}>
            <div>
              <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--ink)', textTransform:'uppercase', fontWeight: 600, marginBottom: 4}}>
                Scenario coverage · core + your additions
              </div>
              <div style={{fontSize: 13, color:'var(--muted)'}}>
                Cendra knows how to handle <b style={{color:'var(--ink)'}}>{propCoverage.core_covered ?? propCoverage.covered} of {D3.scenario_coverage.portfolio_core_total}</b> core scenarios
                {(propCoverage.additions_total ?? 0) > 0 && (
                  <> · plus <b style={{color:'var(--ink)'}}>{propCoverage.additions_covered ?? 0} of {propCoverage.additions_total}</b> additions you've added</>
                )}
                .
                {propCoverage.top_gaps && propCoverage.top_gaps.length > 0 && <> Import more knowledge to close the gaps below.</>}
              </div>
            </div>
            <button onClick={() => setImportOpen(true)} style={{
              all: 'unset', cursor: 'pointer',
              padding: '7px 14px', borderRadius: 999,
              border: '1px solid var(--ink)', background: '#ffffff',
              fontSize: 12.5, fontWeight: 500, color: 'var(--ink)',
            }}>+ Add source</button>
          </div>

          {/* Core vs additions split — two-tier visualization (FL-14) */}
          <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14}}>
            <div style={{
              padding: '12px 14px', borderRadius: 8,
              background: 'var(--paper-2)', border: '1px solid var(--hair-soft)',
            }}>
              <div className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted)', marginBottom: 6, textTransform:'uppercase'}}>
                Core catalog
              </div>
              <div style={{display:'flex', alignItems:'baseline', gap: 8}}>
                <span style={{fontFamily:'var(--serif)', fontSize: 24, fontWeight: 500, color:'var(--ink)', letterSpacing:'-.01em'}}>
                  {propCoverage.core_covered ?? propCoverage.covered}
                </span>
                <span className="mono" style={{fontSize: 11, color:'var(--muted)', letterSpacing:'.06em'}}>of {D3.scenario_coverage.portfolio_core_total}</span>
              </div>
              <div className="mono" style={{fontSize: 9.5, color:'var(--muted-2)', letterSpacing:'.10em', marginTop: 4, textTransform:'uppercase'}}>
                Industry standard hospitality scenarios
              </div>
            </div>
            <div style={{
              padding: '12px 14px', borderRadius: 8,
              background: 'rgba(255,180,0,.06)', border: '1px solid rgba(255,180,0,.30)',
            }}>
              <div className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'#B45309', marginBottom: 6, textTransform:'uppercase'}}>
                Your additions
              </div>
              <div style={{display:'flex', alignItems:'baseline', gap: 8}}>
                <span style={{fontFamily:'var(--serif)', fontSize: 24, fontWeight: 500, color:'#B45309', letterSpacing:'-.01em'}}>
                  {propCoverage.additions_covered ?? 0}
                </span>
                <span className="mono" style={{fontSize: 11, color:'var(--muted)', letterSpacing:'.06em'}}>of {propCoverage.additions_total ?? 0}</span>
              </div>
              <div className="mono" style={{fontSize: 9.5, color:'var(--muted-2)', letterSpacing:'.10em', marginTop: 4, textTransform:'uppercase'}}>
                Owner / building / portfolio-specific
              </div>
            </div>
          </div>
          {propCoverage.top_gaps && propCoverage.top_gaps.length > 0 && (
            <div style={{marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--hair-soft)'}}>
              <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 10, fontWeight: 500}}>
                Top gaps · scenarios Cendra is unsure about
              </div>
              <div style={{display: 'grid', gap: 8}}>
                {propCoverage.top_gaps.map(g => (
                  <div key={g.id} style={{
                    display:'grid', gridTemplateColumns:'140px 1fr auto', gap: 14, alignItems:'center',
                    padding:'10px 14px', borderRadius: 8,
                    background: 'var(--paper-2)',
                  }}>
                    <span className="mono" style={{fontSize: 10, letterSpacing:'.10em', color:'var(--warn)', fontWeight: 600, textTransform:'uppercase'}}>
                      {g.stage}
                    </span>
                    <div>
                      <div style={{fontSize: 13, color:'var(--ink)', fontWeight: 500, marginBottom: 2}}>{g.scenario}</div>
                      <div className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.04em'}}>{g.why}</div>
                    </div>
                    <Btn size="sm" kind="ghost">Resolve →</Btn>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* KNOWLEDGE SOURCES — files PMs fed Cendra to learn this property */}
      <CollapsibleStep
        eyebrow={`Knowledge sources · ${propSources.length}`}
        sub="Everything Cendra read to build this brain. Click a source to see what came out."
        open={sourcesOpen}
        onToggle={() => setSourcesOpen(o => !o)}
      >
        <div style={{marginTop: 14, display: 'grid', gap: 10}}>
          {propSources.map(s => <KnowledgeSourceCard key={s.id} source={s} />)}
          <button onClick={() => setImportOpen(true)} style={{
            all: 'unset', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 20px', borderRadius: 12,
            border: '1px dashed var(--hair)', background: 'transparent',
            fontSize: 13, color: 'var(--muted)', fontWeight: 500,
            transition: 'border-color .12s, color .12s, background .12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.background = 'var(--paper-2)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hair)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}>
            ↓ Drop a file or click to add knowledge for {p.name}
          </button>
        </div>
      </CollapsibleStep>

      {/* OWNER & PROPERTY RULES — collapsible, editable */}
      <CollapsibleStep
        eyebrow={`Active rules · ${rules.length}`}
        sub="Property-specific rules Cendra honors before any decision."
        open={rulesOpen}
        onToggle={() => setRulesOpen(o => !o)}
      >
        <div className="dcard" style={{padding:'8px 0', marginTop: 14}}>
          {rules.map((r, i) => (
            <EditableRuleRow
              key={r.id}
              rule={r}
              onUpdate={patch => setRules(rs => rs.map(x => x.id === r.id ? { ...x, ...patch } : x))}
              onDelete={() => setRules(rs => rs.filter(x => x.id !== r.id))}
              isLast={i === rules.length - 1}
            />
          ))}
          <AddRuleRow onAdd={text => setRules(rs => [...rs, { id: "r_" + Date.now(), text, source: "YOU · just now" }])} />
        </div>
      </CollapsibleStep>

      {/* INTEGRATIONS for this property */}
      <CollapsibleStep
        eyebrow="Integrations · live"
        sub="Data sources feeding this property. Degrade triggers workflow demotion."
        open={integOpen}
        onToggle={() => setIntegOpen(o => !o)}
      >
        <div className="dcard" style={{padding: 0, marginTop: 14, overflow:'hidden'}}>
          {(p.integrations
            ? [
                { name: "PMS · " + (p.integrations.pms || '—'), status: "ok" },
                ...((p.integrations.channels || []).map(c => ({ name: "Channel · " + c, status: "ok" }))),
                { name: "Smart-lock · " + (p.integrations.lock || '—'), status: "ok" },
                { name: "Cleaning · " + (p.integrations.clean || '—'), status: "ok" },
              ]
            : []
          ).map((src, i, arr) => (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'12px 1fr 90px 90px', gap: 14, alignItems:'center',
              padding:'14px 22px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--hair-soft)' : 'none',
              background:'#ffffff',
            }}>
              <span style={{width: 8, height: 8, borderRadius:'50%', background: src.status === "ok" ? 'var(--ok)' : 'var(--warn)'}} />
              <span style={{fontSize: 13.5, color:'var(--ink)'}}>{src.name}</span>
              <span className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase'}}>
                {src.status === "ok" ? "Connected" : "Degraded"}
              </span>
              <Btn size="sm" kind="ghost">Edit</Btn>
            </div>
          ))}
        </div>
      </CollapsibleStep>

      {/* DECISION HISTORY */}
      <CollapsibleStep
        eyebrow="Decision history · last 9 days"
        sub="Every decision Cendra made on this property."
        open={historyOpen}
        onToggle={() => setHistoryOpen(o => !o)}
      >
        <div className="dcard" style={{padding:'14px 22px', marginTop: 14}}>
          <LiveActivityMilestone label="Cendra answered Wi-Fi for Lukas Berger" tone="ok" time="11 min ago" mono="autopilot" />
          <LiveActivityMilestone label="Cendra paused early-check-in promise · cleaning unconfirmed" tone="warn" time="14 min ago" mono="approval" />
          <LiveActivityMilestone label="Marta C. confirmed cleaning ETA 14:30" tone="info" time="22 min ago" mono="cleaner" />
          <LiveActivityMilestone label="Cendra flagged bedroom config conflict (cleaner photo vs listing)" tone="warn" time="2d ago" mono="conflict" />
          <LiveActivityMilestone label="Owner rule applied · no early check-in promise" tone="ok" time="9d ago" mono="rule" />
        </div>
      </CollapsibleStep>

      {/* GUEST MEMORY */}
      <CollapsibleStep
        eyebrow="Guest memory · 3 recent"
        sub="Sentiment, recurring issues, prior stays."
        open={guestsOpen}
        onToggle={() => setGuestsOpen(o => !o)}
      >
        <div className="dcard" style={{padding:'18px 22px', marginTop: 14}}>
          <p style={{fontSize: 14, color:'var(--ink-mid)', margin: 0, lineHeight: 1.55}}>
            3 guests in the last 30 days. Sentiment trending positive. No repeat issues. Average stay rating: <b style={{color:'var(--ink)'}}>4.7</b>.
          </p>
        </div>
      </CollapsibleStep>

      {/* CENDRA POSTURE */}
      <CollapsibleStep
        eyebrow="Cendra's posture · what Cendra is allowed to do here"
        sub="Per-property autonomy overrides on top of portfolio defaults."
        open={postureOpen}
        onToggle={() => setPostureOpen(o => !o)}
      >
        <div className="dcard" style={{padding:'14px 22px', marginTop: 14}}>
          <div style={{display:'grid', gap: 0}}>
            {[
              { workflow: "Wi-Fi & access info",      mode: "autopilot", note: "Verified, low-risk" },
              { workflow: "Check-in instructions",    mode: "autopilot", note: "Smart-lock rotation OK" },
              { workflow: "Early check-in",           mode: "approval",  note: "Same-day turnover risk · always asks you" },
              { workflow: "Late checkout offer",      mode: "approval",  note: "Owner rule: never if same-day turnover" },
              { workflow: "Charge guest / refund",    mode: "never",     note: "Hard rule · portfolio-wide" },
              { workflow: "Vendor dispatch · ≤€150",  mode: "semi",      note: "Cap matches property auto-spend" },
            ].map((row, i, arr) => (
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'1.6fr 110px 1fr 80px', gap: 14, alignItems:'center',
                padding:'12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--hair-soft)' : 'none',
              }}>
                <span style={{fontSize: 13.5, color:'var(--ink)'}}>{row.workflow}</span>
                <AutonomyPill state={row.mode} />
                <span style={{fontSize: 12.5, color:'var(--muted)'}}>{row.note}</span>
                <Btn size="sm" kind="ghost">Edit</Btn>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleStep>

      {importOpen && <ImportModal scope="property" propertyName={p.name} onClose={() => setImportOpen(false)} />}

      {resolving && resolving.fact.state === "conflict" && resolving.fact.conflict_sources && (
        <ResolveConflictModal
          fact={resolving.fact}
          propertyName={p.name}
          onClose={() => setResolving(null)}
          onResolve={(newValue, opts) => {
            if (opts?.needsReview) {
              // Flagged for review — no value change, stays in attention
              return;
            }
            const cs = opts?.chosenSource;
            updateFact(resolving.groupIdx, resolving.factIdx, {
              value: newValue,
              state: "verified",
              source: cs?.label || "Resolved by you",
              source_file: cs?.source_file || "PM override",
              fresh: "just now",
            });
            if (opts?.autoTask && opts?.losingSource) {
              alert(`Task created: ${opts.losingSource.fix_if_loses}`);
            }
          }}
        />
      )}

      {resolving && resolving.fact.state === "missing" && (
        <ResolveMissingModal
          fact={resolving.fact}
          propertyName={p.name}
          onClose={() => setResolving(null)}
          onResolve={(value) => {
            updateFact(resolving.groupIdx, resolving.factIdx, {
              value,
              state: "verified",
              source: "You · just now",
              source_file: "PM input",
              fresh: "just now",
            });
          }}
        />
      )}
    </div>
  );
}

// Lightweight resolver for "missing" state — single input, no comparison
function ResolveMissingModal({ fact, propertyName, onClose, onResolve }) {
  const [value, setValue] = useState("");
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.40)",
      display: "grid", placeItems: "center", padding: 32,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "min(560px, 100%)", background: "#ffffff",
        borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "20px 28px", borderBottom: "1px solid var(--hair-soft)",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: ".18em", color: "var(--muted)",
            display: "flex", gap: 12, alignItems: "center", flex: 1,
          }}>
            <span>ADD MISSING FACT</span>
            <span style={{width: 3, height: 3, borderRadius: "50%", background: "var(--muted-2)"}} />
            <span>{(propertyName || "PROPERTY").toUpperCase()}</span>
          </div>
          <button onClick={onClose} style={{
            all: "unset", cursor: "pointer", width: 28, height: 28, borderRadius: "50%",
            display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 16,
          }}>×</button>
        </div>
        <div style={{padding: "24px 28px"}}>
          <h2 className="serif-display" style={{
            fontSize: 24, lineHeight: 1.25, margin: 0, color: "var(--ink)",
            marginBottom: 14, fontVariationSettings: '"opsz" 48, "SOFT" 30',
          }}>What's the {fact.fact.toLowerCase()} here?</h2>
          <input
            autoFocus
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && value.trim()) { onResolve(value.trim()); onClose(); } }}
            placeholder={`Enter the ${fact.fact.toLowerCase()}…`}
            style={{
              width: "100%", padding: "12px 16px",
              border: "1px solid var(--ink)", borderRadius: 10,
              fontSize: 15, fontFamily: "var(--sans)", color: "var(--ink)",
              outline: 0, boxSizing: "border-box",
            }}
          />
          <div className="mono" style={{fontSize: 10, color: "var(--muted)", letterSpacing: ".10em", marginTop: 10, textTransform: "uppercase"}}>
            Cendra will start using this on the next matching guest. Provenance: YOU · just now.
          </div>
        </div>
        <div style={{
          padding: "16px 28px", borderTop: "1px solid var(--hair-soft)",
          display: "flex", alignItems: "center", gap: 10, background: "var(--paper)",
        }}>
          <span style={{flex: 1}} />
          <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
          <button
            onClick={() => { if (value.trim()) { onResolve(value.trim()); onClose(); } }}
            disabled={!value.trim()}
            style={{
              all: "unset",
              cursor: value.trim() ? "pointer" : "not-allowed",
              background: value.trim() ? "var(--ink)" : "var(--hair)",
              color: value.trim() ? "#ffffff" : "var(--muted)",
              padding: "10px 20px", borderRadius: 10,
              fontSize: 13.5, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
            Save fact
            <span style={{fontFamily: "var(--mono)", fontSize: 12, opacity: .8}}>↵</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Synthesize a minimum property record for properties without rich data
function synthProperty(summary, richBase) {
  if (!summary) return richBase;
  return {
    id: summary.id,
    name: summary.name,
    owner: summary.owner,
    region: summary.region,
    group: "Standard short-stay",
    floor: "—",
    access: "—",
    wifi: "—",
    primary_contact: "—",
    integrations: { pms: "Hostaway · OK", channels: ["Airbnb · OK"], lock: "—", clean: "Properly · OK" },
    facts_summary: {
      verified: summary.asks > 0 ? 12 : 6,
      missing: summary.missing || 0,
      conflicts: summary.conflicts || 0,
      stale: summary.stale || 0,
      internal: 4,
    },
    risks: [],
    fact_groups: [
      {
        label: "Guest-facing facts",
        facts: [
          { fact: "Wi-Fi",       value: summary.name + "-guest / **********", source: "Smart-lock auto", fresh: "live", visible: "guest", state: "verified" },
          { fact: "Quiet hours", value: "23:00 → 08:00", source: "Building rule", fresh: "60d", visible: "guest", state: "verified" },
          { fact: "Pets",        value: "Not allowed", source: "Owner rule", fresh: "120d", visible: "guest", state: "verified" },
          ...(summary.missing > 0 ? [{ fact: "Parking", value: "—", source: "—", fresh: "—", visible: "—", state: "missing" }] : []),
        ],
      },
      {
        label: "Internal notes",
        facts: [
          { fact: "Owner preference", value: "Quiet building, no parties", source: "Owner rule", fresh: "90d", visible: "internal", state: "verified" },
        ],
      },
    ],
  };
}

// Editable fact row — view mode + inline edit mode
function EditableFactRow({ fact, onUpdate, onResolve, isLast, asOfDays }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(fact.value);
  const [hover, setHover] = useState(false);
  // Bi-temporal: if asOfDays > 0 and fact was verified more recently than that, dim it.
  const notYetKnown = asOfDays > 0 && factVerifiedDaysAgo(fact) < asOfDays && fact.state !== 'missing';
  const stateMap = {
    verified: { tone: "ok",   label: "Verified" },
    missing:  { tone: "info", label: "Missing"  },
    conflict: { tone: "warn", label: "Conflict" },
    stale:    { tone: "info", label: "Stale"    },
  };
  const sm = stateMap[fact.state] || stateMap.verified;
  const isMissing = fact.state === "missing";

  if (editing) {
    return (
      <div style={{
        display:'grid', gridTemplateColumns:'170px 1fr auto', gap: 14, padding:'14px 22px',
        borderBottom: isLast ? 'none' : '1px solid var(--hair-soft)',
        background:'var(--paper-2)', alignItems:'flex-start',
      }}>
        <div style={{fontSize: 13, fontWeight: 500, paddingTop: 8}}>{fact.fact}</div>
        <div>
          <input
            autoFocus
            value={value === "—" ? "" : value}
            onChange={e => setValue(e.target.value)}
            placeholder={isMissing ? `Add ${fact.fact.toLowerCase()}...` : "Update value"}
            style={{
              width:'100%', padding:'8px 12px',
              border:'1px solid var(--ink)', borderRadius: 6,
              background:'#ffffff', fontSize: 13.5, fontFamily:'var(--sans)',
              color:'var(--ink)', outline: 0,
            }}
          />
          <div className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.10em', marginTop: 6, textTransform:'uppercase'}}>
            Will become: VERIFIED · YOU · just now
          </div>
        </div>
        <div style={{display:'flex', gap: 6, paddingTop: 4}}>
          <button onClick={() => { onUpdate({ value: value || "—", state: value ? "verified" : "missing", source: "You · just now", fresh: "live" }); setEditing(false); }} style={{
            all:'unset', cursor:'pointer',
            background:'var(--ink)', color:'#ffffff',
            padding:'7px 14px', borderRadius: 7,
            fontSize: 12.5, fontWeight: 600,
          }}>Save</button>
          <Btn size="sm" kind="ghost" onClick={() => { setEditing(false); setValue(fact.value); }}>Cancel</Btn>
        </div>
      </div>
    );
  }

  const pinned = !!fact.pinned;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:'grid', gridTemplateColumns:'170px 1fr 160px 90px auto', gap: 14, alignItems:'center',
        padding:'12px 22px',
        borderBottom: isLast ? 'none' : '1px solid var(--hair-soft)',
        background: hover ? 'var(--paper-2)' : '#ffffff',
        transition: 'background .1s',
        opacity: notYetKnown ? 0.32 : 1,
        filter: notYetKnown ? 'grayscale(.5)' : 'none',
      }}>
      <div style={{display:'flex', alignItems:'center', gap: 6, fontSize: 13, fontWeight: 500, color:'var(--ink)'}}>
        {pinned && (
          <span title="Pinned · automatable" style={{
            display:'inline-flex', width: 16, height: 16, borderRadius: 3,
            background: 'rgba(0,166,153,.10)', color: '#00867E',
            alignItems:'center', justifyContent:'center',
            fontSize: 10, fontWeight: 700, lineHeight: 1, flexShrink: 0,
          }}>⚿</span>
        )}
        <span>{fact.fact}</span>
      </div>
      <div style={{minWidth: 0}}>
        <div style={{fontSize: 13, color: isMissing ? 'var(--muted)' : 'var(--ink-mid)', fontStyle: isMissing ? 'italic' : 'normal', lineHeight: 1.45}}>
          {fact.value}
        </div>
        {fact.source_file && fact.source_file !== '—' && (
          <div className="mono" style={{
            fontSize: 10, color:'var(--muted)', letterSpacing:'.04em', marginTop: 4,
            display:'inline-flex', alignItems:'center', gap: 4,
          }}>
            <span style={{fontSize: 9, opacity:.6}}>↪</span>
            <span style={{textDecoration:'underline', textUnderlineOffset: 2}}>{fact.source_file}</span>
          </div>
        )}
      </div>
      <div className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.04em', lineHeight: 1.4}}>
        <div>{fact.source}</div>
        {fact.true_since || fact.last_verified ? (
          <>
            {fact.true_since && (
              <div style={{opacity:.85}}>
                <span style={{opacity:.55}}>TRUE SINCE</span> {fact.true_since}
              </div>
            )}
            {fact.last_verified && (
              <div style={{opacity:.85}}>
                <span style={{opacity:.55}}>VERIFIED</span> {fact.last_verified}
              </div>
            )}
          </>
        ) : (
          <div style={{opacity:.6}}>{fact.fresh}</div>
        )}
      </div>
      <div style={{display:'flex', alignItems:'center', gap: 4, flexWrap:'wrap'}}>
        <Pill tone={sm.tone}>{sm.label}</Pill>
      </div>
      <button onClick={() => {
        if (pinned) return; // locked
        const isConflict = fact.state === "conflict";
        if (isConflict && onResolve) onResolve();
        else if (isMissing && onResolve) onResolve();
        else setEditing(true);
      }} disabled={pinned} style={{
        all:'unset', cursor: pinned ? 'default' : 'pointer',
        padding:'5px 11px', borderRadius: 7,
        fontSize: 12, fontWeight: 500,
        color: pinned ? 'var(--muted-2)' : fact.state === "conflict" ? 'var(--warn)' : (hover ? 'var(--ink)' : 'var(--muted)'),
        border:'1px solid ' + (pinned ? 'transparent' : fact.state === "conflict" ? 'var(--warn)' : (hover ? 'var(--hair)' : 'transparent')),
        background: fact.state === "conflict" && !pinned ? 'var(--warn-soft)' : (hover && !pinned ? '#ffffff' : 'transparent'),
        opacity: pinned ? 1 : fact.state === "conflict" ? 1 : (hover ? 1 : .6),
        fontWeight: fact.state === "conflict" ? 600 : 500,
        fontFamily: pinned ? 'var(--mono)' : 'inherit',
        letterSpacing: pinned ? '.08em' : 0,
        fontSize: pinned ? 10 : 12,
        textTransform: pinned ? 'uppercase' : 'none',
      }}>{pinned ? "Locked" : fact.state === "conflict" ? "Resolve →" : isMissing ? "Add value" : "Edit"}</button>
    </div>
  );
}

// "Add fact" row — at end of each fact group
function AddFactRow({ onAdd, groupHint }) {
  const [open, setOpen] = useState(false);
  const [fact, setFact] = useState("");
  const [value, setValue] = useState("");

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        all:'unset', cursor:'pointer',
        display:'block', width:'100%',
        padding:'10px 22px', textAlign:'left',
        fontSize: 12.5, color:'var(--muted)',
        background:'transparent',
        borderTop:'1px dashed var(--hair-soft)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper-2)'; e.currentTarget.style.color = 'var(--ink-mid)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; }}>
        + Add fact to <span style={{fontFamily:'var(--mono)', fontSize: 10.5, letterSpacing:'.10em', textTransform:'uppercase'}}>{groupHint}</span>
      </button>
    );
  }
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'170px 1fr auto', gap: 14, padding:'14px 22px',
      borderTop:'1px dashed var(--hair)', background:'var(--paper-2)',
    }}>
      <input
        autoFocus value={fact} onChange={e => setFact(e.target.value)}
        placeholder="Fact name"
        style={{padding:'8px 12px', border:'1px solid var(--hair)', borderRadius: 6, background:'#ffffff', fontSize: 13, outline: 0}}
      />
      <input
        value={value} onChange={e => setValue(e.target.value)}
        placeholder="Value"
        style={{padding:'8px 12px', border:'1px solid var(--hair)', borderRadius: 6, background:'#ffffff', fontSize: 13, outline: 0}}
      />
      <div style={{display:'flex', gap: 6}}>
        <button onClick={() => { if (fact) { onAdd({ fact, value: value || "—", source: "You · just now", fresh: "live", visible: "internal" }); setFact(""); setValue(""); setOpen(false); } }} style={{
          all:'unset', cursor:'pointer',
          background:'var(--ink)', color:'#ffffff',
          padding:'7px 14px', borderRadius: 7,
          fontSize: 12.5, fontWeight: 600,
        }}>Add</button>
        <Btn size="sm" kind="ghost" onClick={() => { setOpen(false); setFact(""); setValue(""); }}>Cancel</Btn>
      </div>
    </div>
  );
}

// Editable rule row + add-rule row
function EditableRuleRow({ rule, onUpdate, onDelete, isLast }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(rule.text);
  const [hover, setHover] = useState(false);

  if (editing) {
    return (
      <div style={{
        display:'grid', gridTemplateColumns:'1fr auto', gap: 14, padding:'14px 22px',
        borderBottom: isLast ? 'none' : '1px solid var(--hair-soft)',
        background:'var(--paper-2)',
      }}>
        <textarea
          autoFocus value={text} onChange={e => setText(e.target.value)}
          rows={2}
          style={{
            width:'100%', padding:'10px 14px',
            border:'1px solid var(--ink)', borderRadius: 6,
            background:'#ffffff', fontSize: 13.5, fontFamily:'var(--sans)',
            color:'var(--ink)', outline: 0, resize:'vertical',
          }}
        />
        <div style={{display:'flex', gap: 6}}>
          <button onClick={() => { onUpdate({ text, source: "YOU · just now" }); setEditing(false); }} style={{
            all:'unset', cursor:'pointer',
            background:'var(--ink)', color:'#ffffff',
            padding:'7px 14px', borderRadius: 7,
            fontSize: 12.5, fontWeight: 600,
          }}>Save</button>
          <Btn size="sm" kind="ghost" onClick={() => { setEditing(false); setText(rule.text); }}>Cancel</Btn>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:'grid', gridTemplateColumns:'1fr auto auto', gap: 14, alignItems:'center',
        padding:'12px 22px',
        borderBottom: isLast ? 'none' : '1px solid var(--hair-soft)',
        background: hover ? 'var(--paper-2)' : '#ffffff',
      }}>
      <span style={{fontSize: 13.5, color:'var(--ink)', lineHeight: 1.5}}>{rule.text}</span>
      <span className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.06em', whiteSpace:'nowrap'}}>{rule.source}</span>
      <div style={{display:'flex', gap: 4, opacity: hover ? 1 : 0, transition:'opacity .12s'}}>
        <Btn size="sm" kind="ghost" onClick={() => setEditing(true)}>Edit</Btn>
        <Btn size="sm" kind="ghost" onClick={onDelete}>Remove</Btn>
      </div>
    </div>
  );
}

function AddRuleRow({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        all:'unset', cursor:'pointer',
        display:'block', width:'100%',
        padding:'10px 22px', textAlign:'left',
        fontSize: 12.5, color:'var(--muted)',
        borderTop:'1px dashed var(--hair-soft)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper-2)'; e.currentTarget.style.color = 'var(--ink-mid)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; }}>
        + Add rule (Cendra will simulate before publishing)
      </button>
    );
  }
  return (
    <div style={{padding:'14px 22px', borderTop:'1px dashed var(--hair)', background:'var(--paper-2)', display:'flex', gap: 10, alignItems:'flex-start'}}>
      <input
        autoFocus value={text} onChange={e => setText(e.target.value)}
        placeholder='e.g. "Never accept bookings under 2 nights"'
        style={{flex:1, padding:'10px 14px', border:'1px solid var(--hair)', borderRadius: 6, background:'#ffffff', fontSize: 13.5, outline: 0}}
      />
      <button onClick={() => { if (text.trim()) { onAdd(text.trim()); setText(""); setOpen(false); } }} style={{
        all:'unset', cursor:'pointer',
        background:'var(--ink)', color:'#ffffff',
        padding:'9px 16px', borderRadius: 7,
        fontSize: 12.5, fontWeight: 600,
      }}>Add rule</button>
      <Btn size="sm" kind="ghost" onClick={() => { setOpen(false); setText(""); }}>Cancel</Btn>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// PLAYBOOK LIBRARY (the builder is in screens-2.jsx)
// ───────────────────────────────────────────────────────────────────
function PlaybookLibraryScreen({ onOpen }) {
  const [filter, setFilter] = useState("all");
  const cats = D3.playbook_categories;
  const allPbs = cats.flatMap(c => c.playbooks);
  const needsReviewCount = allPbs.filter(p => p.state === "needs_review").length;

  const filterDefs = [
    { id: "all",          label: "All",          test: () => true },
    { id: "live",         label: "Live",         test: p => p.state === "live" },
    { id: "needs_review", label: "Needs review", test: p => p.state === "needs_review" },
    { id: "draft",        label: "Drafts",       test: p => p.state === "draft" },
    { id: "staging",      label: "Staging",      test: p => p.state === "staging" },
  ];
  const def = filterDefs.find(f => f.id === filter);

  return (
    <div className="stage" style={{maxWidth: 1080, paddingTop: 56, paddingBottom: 120}}>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 24, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>PLAYBOOKS · LIBRARY</span>
        <span style={{flex:1}} />
        <span>{allPbs.length} PLAYBOOKS · {cats.length} CATEGORIES</span>
      </div>

      <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 32, gap: 18, flexWrap:'wrap'}}>
        <div>
          <h1 className="serif-display" style={{fontSize: 46, lineHeight: 1.05, margin: 0, color:'var(--ink)'}}>
            {needsReviewCount > 0
              ? <>{needsReviewCount} playbook{needsReviewCount > 1 ? 's' : ''} need{needsReviewCount === 1 ? 's' : ''} your eyes.</>
              : <>Every playbook is healthy.</>
            }
          </h1>
          <p style={{fontSize: 16, lineHeight: 1.55, margin:'14px 0 0', color:'var(--ink-mid)', maxWidth: 700}}>
            Each playbook has its own autonomy, scope, simulation coverage, and history. Nothing goes live without a passing simulation.
          </p>
        </div>
        <button onClick={() => onOpen('playbook')} style={{
          all:'unset', cursor:'pointer',
          background:'var(--ink)', color:'#ffffff',
          padding:'12px 22px', borderRadius: 10,
          fontSize: 14, fontWeight: 600,
          display:'inline-flex', alignItems:'center', gap: 8,
        }}>+ New playbook</button>
      </div>

      <div style={{display:'flex', gap: 8, flexWrap:'wrap', marginBottom: 28}}>
        {filterDefs.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            all:'unset', cursor:'pointer',
            padding:'7px 14px', borderRadius: 999,
            border:'1px solid ' + (filter === f.id ? 'var(--ink)' : 'var(--hair)'),
            background: filter === f.id ? 'var(--ink)' : '#ffffff',
            color: filter === f.id ? '#ffffff' : 'var(--ink-mid)',
            fontSize: 12.5, fontWeight: 500, fontFamily:'var(--sans)',
            display:'inline-flex', alignItems:'center', gap: 6,
          }}>
            {f.label}
            <span style={{marginLeft: 4, opacity: filter === f.id ? .7 : .5, fontFamily:'var(--mono)', fontSize: 11}}>
              {allPbs.filter(f.test).length}
            </span>
            {f.id === "needs_review" && needsReviewCount > 0 && filter !== f.id && (
              <span style={{width:6, height:6, borderRadius:'50%', background:'var(--rausch)', marginLeft: 4}} />
            )}
          </button>
        ))}
      </div>

      <div style={{display:'grid', gap: 32}}>
        {cats.map(cat => {
          const pbs = cat.playbooks.filter(def.test);
          if (pbs.length === 0) return null;
          return (
            <section key={cat.id}>
              <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 10, fontWeight: 500}}>
                {cat.name} · {pbs.length}
              </div>
              <div className="dcard" style={{padding: 0, overflow:'hidden'}}>
                {pbs.map((pb, i) => (
                  <button key={pb.id} onClick={() => onOpen('playbook')} style={{
                    all:'unset', cursor:'pointer', display:'grid',
                    gridTemplateColumns:'1.6fr 110px 110px 140px 80px',
                    gap:14, padding:'14px 22px', alignItems:'center',
                    borderBottom: i < pbs.length - 1 ? '1px solid var(--hair-soft)' : 'none',
                    width:'calc(100% - 44px)', background:'#ffffff',
                  }}>
                    <div style={{display:'flex', alignItems:'center', gap: 10}}>
                      {pb.state === "needs_review" && (
                        <span style={{width:6, height:6, borderRadius:'50%', background:'var(--rausch)'}} />
                      )}
                      <div>
                        <div style={{fontSize: 13.5, fontWeight: 500, color:'var(--ink)'}}>{pb.name}</div>
                        <div className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.04em', marginTop: 2}}>{pb.scope}</div>
                      </div>
                    </div>
                    <StatusPill status={pb.state} />
                    <AutonomyPill state={pb.autonomy === 'draft' ? 'observe' : pb.autonomy} />
                    <span className="mono" style={{
                      fontSize: 11, letterSpacing:'.04em',
                      color: pb.coverage.includes('pass') ? 'var(--ok)' : 'var(--muted)',
                    }}>{pb.coverage}</span>
                    <span className="mono" style={{fontSize: 10.5, color:'var(--ink-mid)', letterSpacing:'.04em', textAlign:'right'}}>
                      OPEN →
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// INSIGHTS — Ask Cendra explorer
// ───────────────────────────────────────────────────────────────────
function InsightsScreen({ onOpen }) {
  const I = D3.insights;

  return (
    <div className="stage" style={{maxWidth: 1020, paddingTop: 56, paddingBottom: 120}}>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 24, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>INSIGHTS · PORTFOLIO HEALTH</span>
        <span style={{flex:1}} />
        <span>EVIDENCE-BACKED · ASK CENDRA ANYTHING BELOW</span>
      </div>

      <div style={{marginBottom: 36}}>
        <h1 className="serif-display" style={{fontSize: 46, lineHeight: 1.05, margin: 0, color:'var(--ink)'}}>
          What's moving across your portfolio.
        </h1>
        <p style={{fontSize: 16.5, lineHeight: 1.55, margin:'18px 0 0', color:'var(--ink-mid)', maxWidth: 720}}>
          Trends, bottlenecks, and revenue opportunities Cendra spotted in the last 7 days. For a specific question, use the Ask Cendra bar at the bottom.
        </p>
      </div>

      {/* Trends */}
      <SectionHead eyebrow="PORTFOLIO TRENDS · 7D" title="Headline metrics." sub="Click any metric to drill in." />
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:0, border:'1px solid var(--hair)', borderRadius:4, marginBottom:36, background:'var(--card)'}}>
        {I.trends.map((t, i) => (
          <div key={i} style={{
            padding:'18px 22px',
            borderRight: (i+1) % 3 !== 0 ? '1px solid var(--hair-soft)' : 'none',
            borderBottom: i < 3 ? '1px solid var(--hair-soft)' : 'none',
          }}>
            <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom:8}}>{t.label.toUpperCase()}</div>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
              <div style={{fontFamily:'var(--serif)', fontSize:36, fontWeight:400, lineHeight:1, letterSpacing:'-.01em'}}>{t.value}</div>
              <span className="mono" style={{fontSize:11.5, color: t.tone === 'ok' ? 'var(--ok)' : t.tone === 'warn' ? 'var(--warn)' : 'var(--ink)'}}>{t.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottlenecks + Opportunities side by side */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:24}}>
        <section>
          <SectionHead eyebrow="BOTTLENECKS" title="Where Cendra waits on you." count={I.bottlenecks.length} />
          <div className="dcard" style={{padding:0}}>
            {I.bottlenecks.map((b, i) => (
              <div key={i} style={{padding:'14px 18px', borderBottom: i < I.bottlenecks.length-1 ? '1px solid var(--hair-soft)' : 'none'}}>
                <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom:4}}>{b.kind.toUpperCase()}</div>
                <div style={{fontSize:13.5, lineHeight:1.4}}>{b.text}</div>
                <div className="mono dim" style={{fontSize:10.5, marginTop:6}}>impact · {b.est_loss}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHead eyebrow="REVENUE OPPORTUNITIES" title="What Cendra spotted." count={I.opportunities.length} />
          <div className="dcard" style={{padding:0}}>
            {I.opportunities.map((o, i) => (
              <div key={i} style={{padding:'14px 18px', borderBottom: i < I.opportunities.length-1 ? '1px solid var(--hair-soft)' : 'none', display:'flex', justifyContent:'space-between', gap:12, alignItems:'flex-start'}}>
                <div style={{minWidth:0}}>
                  <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom:4}}>{o.kind.toUpperCase()}</div>
                  <div style={{fontSize:13.5, lineHeight:1.4}}>{o.text}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'var(--serif)', fontSize:22, lineHeight:1, fontWeight:400, color:'var(--ok)'}}>+€{o.est_eur}</div>
                  <Btn size="sm" kind="ghost" style={{marginTop:6}}>Send</Btn>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// TRUST CENTER
// ───────────────────────────────────────────────────────────────────
function TrustScreen({ onOpen }) {
  const [tab, setTab] = useState("safety");

  // Trust Center tabs — 5 surfaces
  const tabs = [
    { id: "safety",     label: "Safety",     count: D3.hard_rules.length + D3.team.length },
    { id: "team",       label: "Team",       count: (D3.team_stats || []).length },
    { id: "compliance", label: "Compliance", count: 4 },
    { id: "data",       label: "Data",       count: D3.integrations.length + 4 },
    { id: "audit",      label: "Audit",      count: D2.audit.length },
  ];

  return (
    <div className="stage" style={{maxWidth: 1080, paddingTop: 56, paddingBottom: 120}}>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 28, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>TRUST CENTER · SAFETY SURFACE</span>
        <span style={{flex:1}} />
        <span style={{display:'inline-flex', alignItems:'center', gap:6, color:'var(--ok)'}}>
          <span style={{width:6, height:6, borderRadius:'50%', background:'var(--ok)'}} />
          0 INCIDENTS · 30D
        </span>
      </div>

      {/* HERO — Cendra speaks on safety posture */}
      <div style={{marginBottom: 48}}>
        <h1 className="serif-display" style={{
          fontSize: 46, lineHeight: 1.05, margin: 0, color: 'var(--ink)',
        }}>
          Trust is what Cendra refuses to do.
        </h1>
        <p style={{
          fontSize: 16.5, lineHeight: 1.55, margin: '18px 0 0',
          color: 'var(--ink-mid)', maxWidth: 720, fontFamily: 'var(--sans)',
        }}>
          <b style={{color:'var(--ink)'}}>{D3.hard_rules.length} hard rules</b> active across the portfolio. <b style={{color:'var(--ink)'}}>0 incidents</b> in the last 30 days. <b style={{color:'var(--ink)'}}>99.4% match rate</b>. Every decision is recorded in an immutable audit trail.
        </p>
      </div>

      {/* MICRO STAT BAND */}
      <div style={{
        display:'flex', gap: 36, flexWrap:'wrap',
        paddingBottom: 24, marginBottom: 24, borderBottom:'1px solid var(--hair-soft)',
      }}>
        <MicroStatBlock2 value={D3.hard_rules.length} label="hard rules · active" />
        <MicroStatBlock2 value="11" label="triggered · 7d" />
        <MicroStatBlock2 value="0" label="bypassed" tone="ok" />
        <MicroStatBlock2 value="100%" label="coverage" sub="all sims passing" tone="ok" />
        <MicroStatBlock2 value={D2.audit.length} label="audit entries · 7d" />
        <span style={{flex:1}} />
        <Btn kind="ghost" size="sm">Export audit · CSV</Btn>
      </div>

      {/* THREE TABS */}
      <div style={{display:'flex', gap: 8, flexWrap:'wrap', marginBottom: 28}}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            all:'unset', cursor:'pointer',
            padding:'7px 14px', borderRadius: 999,
            border:'1px solid ' + (tab === t.id ? 'var(--ink)' : 'var(--hair)'),
            background: tab === t.id ? 'var(--ink)' : '#ffffff',
            color: tab === t.id ? '#ffffff' : 'var(--ink-mid)',
            fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--sans)',
          }}>
            {t.label}
            <span style={{marginLeft: 8, opacity: tab === t.id ? .7 : .5, fontFamily:'var(--mono)', fontSize: 11}}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* SAFETY — Hard rules + NEVER_AUTO_LEARN floor + Permissions stacked */}
      {tab === "safety" && (
        <div style={{display:'grid', gap: 48}}>
          {/* NEVER_AUTO floor — structural guarantee, not configurable */}
          <div style={{
            padding:'20px 24px', borderRadius: 14,
            background: 'rgba(255,56,92,.04)',
            border:'1px solid rgba(255,56,92,.20)',
          }}>
            <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 12}}>
              <span style={{
                width: 30, height: 30, borderRadius: 7,
                background:'#FF385C', color:'#ffffff',
                display:'grid', placeItems:'center',
                fontFamily:'var(--mono)', fontWeight: 800, fontSize: 16,
              }}>∅</span>
              <div>
                <div className="mono" style={{fontSize: 10, letterSpacing:'.16em', color:'#FF385C', fontWeight: 700, textTransform:'uppercase'}}>
                  Never-auto floor · structural · not configurable
                </div>
                <div style={{fontFamily:'var(--serif)', fontSize: 18, lineHeight: 1.3, marginTop: 4, color:'var(--ink)'}}>
                  17 scenarios + 4 categories Cendra is never allowed to automate.
                </div>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12}}>
              <div style={{padding:'10px 12px', borderRadius: 8, background:'#ffffff', border:'1px solid var(--hair-soft)'}}>
                <div className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', fontWeight: 600, marginBottom: 4}}>
                  Never-auto categories · 4
                </div>
                <div style={{fontSize: 12.5, color:'var(--ink)', lineHeight: 1.55}}>
                  Damage claims · Refunds &gt; €100 to natural persons · Booking cancellations · Permanent guest bans.
                </div>
              </div>
              <div style={{padding:'10px 12px', borderRadius: 8, background:'#ffffff', border:'1px solid var(--hair-soft)'}}>
                <div className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', fontWeight: 600, marginBottom: 4}}>
                  Never-auto-learn scenarios · 17
                </div>
                <div style={{fontSize: 12.5, color:'var(--ink-mid)', lineHeight: 1.55}}>
                  Sensitive scenarios are pinned and cannot be auto-promoted by pattern mining — including legal disputes, owner-rule overrides, ID/passport handling, dispute escalations.
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel2 eyebrow={`${D3.hard_rules.length} hard rules · never auto`} sub="Cendra will not act on these without you, ever." />
            <div className="dcard" style={{padding: 0, overflow: 'hidden', marginTop: 14}}>
              {D3.hard_rules.map(r => <HardRuleCard key={r.id} r={r} />)}
            </div>
            <div style={{display:'flex', gap:8, marginTop:14, justifyContent:'flex-end'}}>
              <Btn kind="ghost" size="sm">Import rule set</Btn>
              <Btn size="sm">+ Add hard rule</Btn>
            </div>
          </div>

          <div>
            <SectionLabel2 eyebrow={`${D3.team.length} team members · roles & shifts`} sub="Approval routing follows scope and on-shift status." />
            <div style={{marginTop: 14}}>
              <TeamRolesView />
            </div>
          </div>
        </div>
      )}

      {/* DATA — Integrations health + PII */}
      {tab === "data" && (
        <div style={{display:'grid', gap: 48}}>
          <div>
            <SectionLabel2 eyebrow={`${D3.integrations.length} data sources · live`} sub="If a source degrades, Cendra demotes the workflows that depend on it." />
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 14}}>
              {D3.integrations.map(i => <IntegrationHealthCard key={i.id} i={i} />)}
            </div>
          </div>

          <div>
            <SectionLabel2 eyebrow="PII & sensitive data · protected" sub="What Cendra is never allowed to see, log, or send." />
            <div className="dcard" style={{padding:'18px 22px', marginTop: 14}}>
              <div className="col gap-3">
                <PIIRow label="Guest phone numbers" mode="Masked in transcripts · plain in PMS only" />
                <PIIRow label="Card on file"        mode="Tokenized · never logged · charges via Stripe only" />
                <PIIRow label="Access codes"        mode="Released only after 12:00 on check-in day · never in audit" />
                <PIIRow label="ID documents"        mode="Stored in PMS · never sent to channel inbox" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEAM — per-PM aggregates via manager_id. Audit §7 #11. */}
      {tab === "team" && (
        <div style={{display:'grid', gap: 18}}>
          <SectionLabel2 eyebrow={`${(D3.team_stats || []).length} active managers · today`} sub="Per-PM decision aggregates from manager_id on every DecisionCase." />
          <div className="dcard" style={{padding: 0, overflow: 'hidden'}}>
            <div style={{
              display:'grid', gridTemplateColumns: 'minmax(220px, 1.6fr) 90px 110px 110px 110px 130px 90px',
              gap: 14, padding: '12px 22px', background:'var(--paper-2)',
              borderBottom:'1px solid var(--hair)',
              fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.12em',
              color:'var(--muted)', textTransform:'uppercase', fontWeight: 500,
            }}>
              <div>Manager</div>
              <div style={{textAlign:'right'}}>Decisions</div>
              <div style={{textAlign:'right'}}>Approvals</div>
              <div style={{textAlign:'right'}}>Overrides</div>
              <div style={{textAlign:'right'}}>Match rate</div>
              <div style={{textAlign:'right'}}>Avg response</div>
              <div style={{textAlign:'right'}}>Last</div>
            </div>
            {(D3.team_stats || []).map((m, i, arr) => {
              const matchTone = m.match_rate >= 0.95 ? 'var(--ok)' : m.match_rate >= 0.9 ? 'var(--ink)' : 'var(--warn)';
              const overrideTone = m.overrides_today === 0 ? 'var(--ok)' : m.overrides_today > 2 ? 'var(--warn)' : 'var(--ink)';
              return (
                <div key={m.manager_id} style={{
                  display:'grid', gridTemplateColumns: 'minmax(220px, 1.6fr) 90px 110px 110px 110px 130px 90px',
                  gap: 14, padding:'14px 22px', alignItems:'center',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--hair-soft)' : 'none',
                  background:'#ffffff',
                }}>
                  {/* Manager */}
                  <div style={{display:'flex', alignItems:'center', gap: 12, minWidth: 0}}>
                    <div style={{
                      width: 32, height: 32, borderRadius:'50%',
                      background:'var(--ink)', color:'#ffffff',
                      display:'grid', placeItems:'center',
                      fontFamily:'var(--serif)', fontStyle:'italic', fontSize: 14, flexShrink: 0,
                    }}>{m.avatar}</div>
                    <div style={{minWidth: 0}}>
                      <div style={{fontSize: 13.5, fontWeight: 500, color:'var(--ink)'}}>{m.name}</div>
                      <div className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.04em', marginTop: 2, textTransform:'uppercase'}}>
                        {m.role} · streak {m.streak_days}d · top: {m.best_workflow}
                      </div>
                    </div>
                  </div>
                  <div className="mono" style={{fontSize: 14, textAlign:'right', color:'var(--ink)', fontVariantNumeric:'tabular-nums', fontWeight: 600}}>{m.decisions_today}</div>
                  <div className="mono" style={{fontSize: 13, textAlign:'right', color:'var(--ink-mid)', fontVariantNumeric:'tabular-nums'}}>{m.approvals_today}</div>
                  <div className="mono" style={{fontSize: 13, textAlign:'right', color: overrideTone, fontVariantNumeric:'tabular-nums', fontWeight: m.overrides_today > 0 ? 600 : 400}}>{m.overrides_today}</div>
                  <div className="mono" style={{fontSize: 13, textAlign:'right', color: matchTone, fontVariantNumeric:'tabular-nums', fontWeight: 600}}>{(m.match_rate * 100).toFixed(0)}%</div>
                  <div className="mono" style={{fontSize: 12, textAlign:'right', color:'var(--ink-mid)', fontVariantNumeric:'tabular-nums'}}>{m.avg_response_min.toFixed(1)}m</div>
                  <div className="mono" style={{fontSize: 11, textAlign:'right', color:'var(--muted)'}}>
                    {m.last_decision_min < 60 ? `${m.last_decision_min}m` : `${(m.last_decision_min/60).toFixed(1)}h`}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex', gap: 8, justifyContent:'flex-end'}}>
            <Btn size="sm" kind="ghost">Export team stats · CSV</Btn>
            <Btn size="sm" kind="ghost">View on-shift roster →</Btn>
          </div>
        </div>
      )}

      {/* COMPLIANCE — EU regulation pack (Audit §3.11 + §8.1 #4) */}
      {tab === "compliance" && (
        <div style={{display:'grid', gap: 18}}>
          <SectionLabel2 eyebrow="EU compliance · 4 pieces · all live" sub="Cendra ships the full EU pack: AI Act Art.12 (audit), Art.50 (disclosure), GDPR Art.22 (review), DSA Reg 2024/1028 (per-unit registration)." />
          <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 16}}>
            <ComplianceCard
              eyebrow="AI ACT · ART.12"
              title="Tamper-evident audit log"
              status="LIVE"
              statusTone="ok"
              detail="Every decision pinned with a BLAKE2B-256 hash of the prior entry. Chain verified in real time."
              metrics={[
                { label: "Entries · 30d", value: "12,847" },
                { label: "Last verified", value: "2m ago" },
                { label: "Broken links", value: "0", tone: "ok" },
              ]}
              cta="Verify chain →"
            />
            <ComplianceCard
              eyebrow="AI ACT · ART.50"
              title="5-locale disclosure"
              status="LIVE"
              statusTone="ok"
              detail="When Cendra writes to a guest, the disclosure 'Replied with help from Cendra' is auto-prepended in EN · DE · FR · ES · IT."
              metrics={[
                { label: "Locales", value: "5/5" },
                { label: "Outbound", value: "2,418" },
                { label: "Skipped", value: "0", tone: "ok" },
              ]}
              cta="See disclosure copy →"
            />
            <ComplianceCard
              eyebrow="GDPR · ART.22"
              title="Automated-decision review"
              status="ACTIVE"
              statusTone="warn"
              detail="When a decision over €100 about a natural person would otherwise auto-execute, Cendra holds for PM sign-off."
              metrics={[
                { label: "Held · 30d", value: "11" },
                { label: "BLOCK", value: "0", tone: "ok" },
                { label: "NEEDS_REVIEW", value: "1 open", tone: "warn" },
              ]}
              cta="Open held decisions →"
            />
            <ComplianceCard
              eyebrow="DSA · REG 2024/1028"
              title="Per-unit registration"
              status="LIVE"
              statusTone="ok"
              detail="Every active unit carries a registration_id per Reg (EU) 2024/1028. Monthly export bundle is shipped automatically."
              metrics={[
                { label: "Registered units", value: "47/47", tone: "ok" },
                { label: "Last export", value: "5d ago" },
                { label: "Missing IDs", value: "0", tone: "ok" },
              ]}
              cta="Download bundle →"
            />
          </div>
          <div style={{
            padding:'14px 18px', borderRadius: 12,
            background:'rgba(255,56,92,.04)', border:'1px solid rgba(255,56,92,.20)',
          }}>
            <div className="mono" style={{fontSize: 10, letterSpacing:'.16em', color:'#FF385C', fontWeight: 700, textTransform:'uppercase', marginBottom: 6}}>
              Never-AI denylist · 4 categories
            </div>
            <div style={{fontSize: 13, color:'var(--ink)', lineHeight: 1.5}}>
              Cendra is structurally barred from making decisions in: <b>damage claims · refunds &gt; €100 to natural persons · booking cancellations · permanent guest bans</b>. These categories never reach autopilot regardless of trust score.
            </div>
          </div>
        </div>
      )}

      {/* AUDIT — link to audit trail + incident review */}
      {tab === "audit" && (
        <div>
          <SectionLabel2
            eyebrow={`Every decision · ${D2.audit.length} entries · last 7 days`}
            sub="Filter by actor, incident, or reversibility. Roll back any reversible action. Replay against today's rules to see if Cendra would still decide the same way."
          />
          <div style={{marginTop: 16}}>
            <AuditTrailPanel />
          </div>
        </div>
      )}
    </div>
  );
}

// Inline section label for Trust groups
function SectionLabel2({ eyebrow, sub }) {
  return (
    <div>
      <div className="mono" style={{
        fontSize: 11, letterSpacing:'.14em', color:'var(--ink)',
        fontWeight: 600, textTransform:'uppercase', marginBottom: 4,
      }}>{eyebrow}</div>
      {sub && <div style={{fontSize: 13, color:'var(--muted)'}}>{sub}</div>}
    </div>
  );
}

function ComplianceCard({ eyebrow, title, status, statusTone, detail, metrics, cta }) {
  const toneColor = statusTone === 'ok' ? 'var(--ok)' : statusTone === 'warn' ? 'var(--warn)' : statusTone === 'risk' ? 'var(--risk)' : 'var(--ink)';
  return (
    <div style={{
      background: '#ffffff', border: '1px solid var(--hair)', borderRadius: 14,
      padding:'18px 20px',
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8}}>
        <span className="mono" style={{fontSize: 9.5, letterSpacing:'.16em', color:'var(--ink)', fontWeight: 700, textTransform:'uppercase'}}>
          {eyebrow}
        </span>
        <span style={{flex: 1}} />
        <span style={{
          fontFamily:'var(--mono)', fontSize: 9.5, letterSpacing:'.14em',
          color: toneColor, fontWeight: 700, textTransform:'uppercase',
          padding:'2px 8px', borderRadius: 4,
          background: statusTone === 'ok' ? 'rgba(0,166,153,.10)' : statusTone === 'warn' ? 'rgba(255,180,0,.10)' : 'rgba(255,56,92,.10)',
          border: '1px solid ' + (statusTone === 'ok' ? 'rgba(0,166,153,.30)' : statusTone === 'warn' ? 'rgba(255,180,0,.30)' : 'rgba(255,56,92,.30)'),
        }}>● {status}</span>
      </div>
      <div style={{fontFamily:'var(--serif)', fontSize: 18, lineHeight: 1.25, color:'var(--ink)', marginBottom: 8, letterSpacing:'-.005em'}}>
        {title}
      </div>
      <p style={{margin: 0, fontSize: 12.5, color:'var(--ink-mid)', lineHeight: 1.55}}>
        {detail}
      </p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 0, marginTop: 14, paddingTop: 12, borderTop:'1px solid var(--hair-soft)'}}>
        {metrics.map((m, i) => {
          const c = m.tone === 'ok' ? 'var(--ok)' : m.tone === 'warn' ? 'var(--warn)' : 'var(--ink)';
          return (
            <div key={i} style={{paddingRight: i < metrics.length - 1 ? 10 : 0, borderRight: i < metrics.length - 1 ? '1px solid var(--hair-soft)' : 'none', paddingLeft: i > 0 ? 10 : 0}}>
              <div className="mono" style={{fontSize: 9, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', fontWeight: 500}}>{m.label}</div>
              <div className="mono" style={{fontSize: 14, fontWeight: 600, color: c, marginTop: 2, fontVariantNumeric:'tabular-nums'}}>{m.value}</div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop: 12}}>
        <button style={{
          all:'unset', cursor:'pointer',
          fontFamily:'var(--mono)', fontSize: 10.5, letterSpacing:'.10em',
          color:'var(--ink)', fontWeight: 600, textTransform:'uppercase',
        }}>{cta}</button>
      </div>
    </div>
  );
}

function PIIRow({ label, mode }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'200px 1fr 100px', gap:14, padding:'12px 0', borderBottom:'1px dashed var(--hair-soft)', alignItems:'center'}}>
      <div style={{fontSize:13, fontWeight:500}}>{label}</div>
      <div className="dim" style={{fontSize:12.5}}>{mode}</div>
      <Pill tone="ok">Protected</Pill>
    </div>
  );
}

function TeamRolesView() {
  return (
    <div className="dcard" style={{padding:0}}>
      <div style={{display:'grid', gridTemplateColumns:'1.2fr 1.2fr 1fr 110px 110px', gap:14, padding:'10px 18px', background:'var(--paper-2)', borderBottom:'1px solid var(--hair)', fontFamily:'var(--mono)', fontSize:9.5, letterSpacing:'.16em', color:'var(--muted)'}}>
        <div>USER</div><div>ROLE</div><div>SCOPE</div><div>ON SHIFT</div><div>PENDING</div>
      </div>
      {D3.team.map((u, i) => (
        <div key={u.id} style={{
          display:'grid', gridTemplateColumns:'1.2fr 1.2fr 1fr 110px 110px', gap:14, padding:'14px 18px',
          borderBottom: i < D3.team.length - 1 ? '1px solid var(--hair-soft)' : 'none', alignItems:'center',
        }}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <span style={{
              width:30, height:30, borderRadius:'50%',
              background:'var(--ink)', color:'var(--paper)',
              display:'grid', placeItems:'center',
              fontFamily:'var(--serif)', fontStyle:'italic', fontSize:14,
            }}>{u.avatar}</span>
            <span style={{fontSize:13.5, fontWeight:500}}>{u.name}</span>
          </div>
          <div style={{fontSize:13}}>{u.role}</div>
          <div className="mono dim" style={{fontSize:11}}>{u.scope}</div>
          <div>
            {u.on_shift ? <Pill tone="ok">On shift</Pill> : <Pill>Off</Pill>}
          </div>
          <div className="mono" style={{fontSize:12, fontVariantNumeric:'tabular-nums', color: u.approvals_pending > 0 ? 'var(--warn)' : 'var(--muted)'}}>
            {u.approvals_pending || '—'}
          </div>
        </div>
      ))}
    </div>
  );
}


// ───────────────────────────────────────────────────────────────────
// KNOWLEDGE INGESTION — drop zone, source cards, extraction preview
// PM feeds Cendra any kind of file (PDF, image, audio, video, email,
// CSV, web URL). Cendra parses → extracts facts/rules/scenarios/
// playbook candidates → PM reviews & accepts → lands in property brain
// with provenance. unstructured.io-style format coverage.
// ───────────────────────────────────────────────────────────────────

const SOURCE_TYPES = {
  pdf:   { color: "#B92929", label: "PDF",   icon: "PDF" },
  docx:  { color: "#0A6CD6", label: "DOCX",  icon: "DOC" },
  xlsx:  { color: "#008A05", label: "XLSX",  icon: "XLS" },
  csv:   { color: "#008A05", label: "CSV",   icon: "CSV" },
  pptx:  { color: "#FC642D", label: "PPTX",  icon: "PPT" },
  image: { color: "#5E6AD2", label: "IMAGE", icon: "IMG" },
  audio: { color: "#FF385C", label: "AUDIO", icon: "♪♪" },
  video: { color: "#4A154B", label: "VIDEO", icon: "▶" },
  email: { color: "#5E6AD2", label: "EMAIL", icon: "@" },
  web:   { color: "var(--ink-mid)", label: "WEB", icon: "↗" },
  json:  { color: "var(--muted)", label: "JSON", icon: "{}" },
  txt:   { color: "var(--muted)", label: "TXT",  icon: "TXT" },
};

const SUPPORTED_FORMATS = [
  { group: "Documents", items: "PDF · DOCX · PPTX · XLSX · TXT · MD · HTML · EPUB" },
  { group: "Images",    items: "PNG · JPG · WEBP · HEIC · TIFF — OCR + vision" },
  { group: "Audio",     items: "MP3 · WAV · M4A · OGG — transcription" },
  { group: "Video",     items: "MP4 · MOV · WEBM — frames + transcript" },
  { group: "Email",     items: "EML · MSG — threaded conversation memory" },
  { group: "Structured",items: "CSV · JSON · XML — bulk imports" },
  { group: "Web",       items: "URL paste — listings, owner microsites" },
];

function SourceTypeBadge({ type, size = "md" }) {
  const m = SOURCE_TYPES[type] || SOURCE_TYPES.txt;
  const sz = size === "sm" ? 22 : 32;
  return (
    <span style={{
      width: sz, height: sz, borderRadius: 6,
      background: m.color, color: "#ffffff",
      display: "grid", placeItems: "center",
      fontFamily: "var(--mono)", fontSize: size === "sm" ? 9 : 10,
      fontWeight: 700, letterSpacing: 0,
      flexShrink: 0,
    }}>{m.icon}</span>
  );
}

function KnowledgeSourceCard({ source, compact, onOpen }) {
  const e = source.extracted || {};
  const extractedParts = [];
  if (e.facts)     extractedParts.push(`${e.facts} fact${e.facts === 1 ? "" : "s"}`);
  if (e.rules)     extractedParts.push(`${e.rules} rule${e.rules === 1 ? "" : "s"}`);
  if (e.scenarios) extractedParts.push(`${e.scenarios} scenario${e.scenarios === 1 ? "" : "s"}`);
  if (e.playbooks) extractedParts.push(`${e.playbooks} playbook${e.playbooks === 1 ? "" : "s"}`);
  if (e.amenities) extractedParts.push(`${e.amenities} amenit${e.amenities === 1 ? "y" : "ies"}`);
  if (e.photos)    extractedParts.push(`${e.photos} photo${e.photos === 1 ? "" : "s"}`);
  if (e.vendors)   extractedParts.push(`${e.vendors} vendor${e.vendors === 1 ? "" : "s"}`);

  return (
    <button onClick={onOpen} style={{
      all: "unset", cursor: "pointer", display: "grid",
      gridTemplateColumns: compact ? "32px 1fr auto" : "44px 1fr auto",
      gap: 14, alignItems: "center",
      padding: compact ? "12px 16px" : "16px 20px",
      background: "#ffffff", border: "1px solid var(--hair)", borderRadius: 12,
      transition: "border-color .12s, box-shadow .12s",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--hair)"; e.currentTarget.style.boxShadow = "none"; }}>
      <SourceTypeBadge type={source.type} size={compact ? "sm" : "md"} />
      <div style={{minWidth: 0}}>
        <div style={{
          fontSize: compact ? 13 : 14, fontWeight: 500, color: "var(--ink)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{source.filename}</div>
        <div className="mono" style={{
          fontSize: 10.5, color: "var(--muted)", letterSpacing: ".04em", marginTop: 3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {source.pages ? `${source.pages}p · ` : ""}
          {source.duration ? `${source.duration} · ` : ""}
          {source.size ? `${source.size} · ` : ""}
          {source.uploaded} · {source.by}
        </div>
        {!compact && extractedParts.length > 0 && (
          <div style={{fontSize: 12, color: "var(--ink-mid)", marginTop: 6}}>
            <span className="mono" style={{fontSize: 9.5, letterSpacing: ".14em", color: "var(--ok)", marginRight: 8, fontWeight: 600}}>EXTRACTED</span>
            {extractedParts.join(" · ")}
          </div>
        )}
      </div>
      <span className="mono" style={{fontSize: 10.5, color: "var(--muted)", letterSpacing: ".06em", fontWeight: 500}}>
        OPEN →
      </span>
    </button>
  );
}

// IMPORT MODAL — drop zone + supported formats + analysis flow + preview
function ImportModal({ scope, propertyName, onClose, onImported }) {
  const [stage, setStage] = useState("dropzone"); // dropzone → parsing → extracting → matching → review
  const [filename, setFilename] = useState("");
  const [filetype, setFiletype] = useState("pdf");
  const [accepted, setAccepted] = useState({});

  // Simulated extraction result (the "magic moment" payload)
  const extraction = useMemo(() => ({
    facts: [
      { id: "ef1", label: "Quiet hours · 23:00 → 08:00", confidence: 0.94, page: "page 4", group: "Guest-facing" },
      { id: "ef2", label: "Pet policy · Not allowed (deposit option €150)", confidence: 0.91, page: "page 7", group: "Guest-facing" },
      { id: "ef3", label: "Smoking · Balcony only", confidence: 0.97, page: "page 7", group: "Guest-facing" },
      { id: "ef4", label: "Trash pickup · Tuesday & Friday 06:00", confidence: 0.89, page: "page 12", group: "Guest-facing" },
      { id: "ef5", label: "Hot water reset · Breaker panel · left side", confidence: 0.83, page: "page 18", group: "Internal" },
      { id: "ef6", label: "Building gate code · rotates monthly", confidence: 0.78, page: "page 5", group: "Internal" },
    ],
    rules: [
      { id: "er1", label: "Never offer late checkout if same-day turnover", confidence: 0.96, page: "page 11" },
      { id: "er2", label: "Pet deposit €150 required at check-in if applicable", confidence: 0.88, page: "page 8" },
      { id: "er3", label: "Emergency contact within 15 min for safety issues", confidence: 0.93, page: "page 22" },
    ],
    scenarios: [
      { id: "es1", label: "Same-night booking after 22:00 from zero-review guest", stage: "Pre-booking", confidence: 0.81 },
      { id: "es2", label: "Pet deposit dispute mid-stay", stage: "During stay", confidence: 0.74 },
      { id: "es3", label: "Late check-in after lockbox cutoff", stage: "Check-in", confidence: 0.86 },
      { id: "es4", label: "Trash schedule confusion", stage: "During stay", confidence: 0.79 },
      { id: "es5", label: "Building gate failure", stage: "Check-in", confidence: 0.71 },
    ],
    playbooks: [
      { id: "ep1", label: "Pre-arrival trash schedule reminder", est_value: "Sentiment +6 · 0% guest message volume on trash", confidence: 0.83 },
      { id: "ep2", label: "Pet deposit collection flow", est_value: "€120 · per pet stay · 7 detected eligible bookings", confidence: 0.76 },
    ],
  }), []);

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f) startAnalysis(f.name, getTypeFromExt(f.name));
  };
  const handleSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) startAnalysis(f.name, getTypeFromExt(f.name));
  };
  const handleUseDemo = () => startAnalysis("kara12_owner_handbook.pdf", "pdf");

  const startAnalysis = (name, type) => {
    setFilename(name);
    setFiletype(type);
    setStage("parsing");
    setTimeout(() => setStage("extracting"), 900);
    setTimeout(() => setStage("matching"), 1900);
    setTimeout(() => setStage("review"), 2900);
  };

  const totalItems = extraction.facts.length + extraction.rules.length + extraction.scenarios.length + extraction.playbooks.length;
  const acceptedCount = Object.values(accepted).filter(Boolean).length;
  const highConfidenceCount = [
    ...extraction.facts, ...extraction.rules, ...extraction.scenarios, ...extraction.playbooks
  ].filter(i => i.confidence >= 0.85).length;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.40)",
      display: "grid", placeItems: "center",
      padding: 32,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "min(880px, 100%)", maxHeight: "calc(100vh - 64px)",
        background: "var(--paper)", borderRadius: 16,
        boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 28px", borderBottom: "1px solid var(--hair-soft)",
          display: "flex", alignItems: "center", gap: 16, background: "#ffffff",
        }}>
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: ".18em", color: "var(--muted)",
            display: "flex", gap: 12, alignItems: "center", flex: 1,
          }}>
            <span>IMPORT KNOWLEDGE</span>
            <span style={{width: 3, height: 3, borderRadius: "50%", background: "var(--muted-2)"}} />
            <span>{scope === "portfolio" ? "PORTFOLIO-WIDE" : (propertyName || "PROPERTY").toUpperCase()}</span>
          </div>
          <button onClick={onClose} style={{
            all: "unset", cursor: "pointer",
            width: 28, height: 28, borderRadius: "50%",
            display: "grid", placeItems: "center",
            color: "var(--muted)", fontSize: 16,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--paper)"; e.currentTarget.style.color = "var(--ink)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}>×</button>
        </div>

        {/* Body */}
        <div style={{flex: 1, overflowY: "auto", padding: "24px 28px"}}>

          {/* Stage 1 — drop zone + format catalog */}
          {stage === "dropzone" && (
            <>
              <h2 className="serif-display" style={{
                fontSize: 30, lineHeight: 1.12, margin: "0 0 12px", color: "var(--ink)",
                letterSpacing: "-.018em",
              }}>
                Drop a file. Cendra will read it.
              </h2>
              <p style={{margin: "0 0 24px", fontSize: 14.5, color: "var(--ink-mid)", lineHeight: 1.55, maxWidth: 640}}>
                Photos, voice notes, owner contracts, SOPs, vendor lists, listing pages, emails — anything you have. Cendra parses it, extracts facts and rules, matches against the {window.CENDRA_DATA2.scenario_coverage.portfolio_total} hospitality scenario catalog, and only writes to the property brain after you approve.
              </p>

              {/* Drop zone */}
              <label
                htmlFor="import-file"
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.background = "#ffffff"; }}
                onDragLeave={e => { e.currentTarget.style.borderColor = "var(--hair)"; e.currentTarget.style.background = "var(--paper-2)"; }}
                onDrop={handleDrop}
                style={{
                  display: "block", padding: "40px 28px",
                  border: "2px dashed var(--hair)", borderRadius: 14,
                  background: "var(--paper-2)", textAlign: "center",
                  cursor: "pointer", transition: "border-color .15s, background .15s",
                  marginBottom: 18,
                }}
              >
                <div style={{fontSize: 36, lineHeight: 1, marginBottom: 14}}>↓</div>
                <div style={{fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 4}}>
                  Drag files here or click to select
                </div>
                <div style={{fontSize: 13, color: "var(--muted)"}}>
                  Up to 200 MB per file · multiple files OK
                </div>
                <input id="import-file" type="file" onChange={handleSelect} style={{display: "none"}} />
              </label>

              <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 24}}>
                <button onClick={handleUseDemo} style={{
                  all: "unset", cursor: "pointer",
                  fontSize: 12.5, color: "var(--ink-mid)", fontWeight: 500,
                  padding: "6px 12px", borderRadius: 8,
                  background: "#ffffff", border: "1px solid var(--hair)",
                }}>
                  📄 Try with demo: kara12_owner_handbook.pdf
                </button>
                <span style={{flex: 1}} />
                <button style={{
                  all: "unset", cursor: "pointer",
                  fontSize: 12.5, color: "var(--ink-mid)", fontWeight: 500,
                }}>🔗 Paste URL instead</button>
              </div>

              {/* Supported formats */}
              <div className="mono" style={{
                fontSize: 10, letterSpacing: ".14em", color: "var(--muted)",
                textTransform: "uppercase", marginBottom: 12, fontWeight: 500,
              }}>What Cendra accepts</div>
              <div style={{display: "grid", gap: 8}}>
                {SUPPORTED_FORMATS.map(f => (
                  <div key={f.group} style={{
                    display: "grid", gridTemplateColumns: "110px 1fr",
                    gap: 14, padding: "8px 12px", borderRadius: 8,
                    background: "#ffffff", border: "1px solid var(--hair)",
                    fontSize: 12.5,
                  }}>
                    <span className="mono" style={{fontSize: 10.5, color: "var(--ink)", letterSpacing: ".06em", fontWeight: 600}}>{f.group}</span>
                    <span style={{color: "var(--muted)"}}>{f.items}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Stage 2 / 3 / 4 — agentic processing */}
          {(stage === "parsing" || stage === "extracting" || stage === "matching") && (
            <div style={{padding: "32px 0"}}>
              <div style={{display: "flex", alignItems: "center", gap: 14, marginBottom: 24}}>
                <SourceTypeBadge type={filetype} />
                <div>
                  <div style={{fontSize: 15, fontWeight: 600, color: "var(--ink)"}}>{filename}</div>
                  <div className="mono" style={{fontSize: 10.5, color: "var(--muted)", letterSpacing: ".04em", marginTop: 3}}>
                    {filetype.toUpperCase()} · ANALYZING
                  </div>
                </div>
              </div>

              <h2 className="serif-display" style={{
                fontSize: 28, lineHeight: 1.18, margin: "0 0 24px", color: "var(--ink)",
                fontVariationSettings: '"opsz" 72, "SOFT" 50',
              }}>
                {stage === "parsing"    && "Reading the document…"}
                {stage === "extracting" && "Pulling out facts, rules, and scenarios…"}
                {stage === "matching"   && "Matching against the hospitality knowledge base…"}
              </h2>

              <ProgressSteps active={stage} />
            </div>
          )}

          {/* Stage 5 — review extraction */}
          {stage === "review" && (
            <>
              <div style={{display: "flex", alignItems: "center", gap: 14, marginBottom: 22}}>
                <SourceTypeBadge type={filetype} />
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 15, fontWeight: 600, color: "var(--ink)"}}>{filename}</div>
                  <div className="mono" style={{fontSize: 10.5, color: "var(--muted)", letterSpacing: ".04em", marginTop: 3}}>
                    {filetype.toUpperCase()} · READY
                  </div>
                </div>
                <span className="mono" style={{
                  fontSize: 10, letterSpacing: ".14em", color: "var(--ok)",
                  padding: "4px 10px", borderRadius: 5, background: "var(--ok-soft)",
                  fontWeight: 600, textTransform: "uppercase",
                }}>EXTRACTION COMPLETE</span>
              </div>

              <h2 className="serif-display" style={{
                fontSize: 26, lineHeight: 1.22, margin: "0 0 6px", color: "var(--ink)",
              }}>
                Cendra found <b>{totalItems} items</b>. <span style={{color: "var(--muted)"}}>{highConfidenceCount} are high confidence.</span>
              </h2>
              <p style={{margin: "0 0 22px", fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.5, maxWidth: 660}}>
                Review each one. Anything you accept lands in the property brain with a link back to <span className="mono" style={{fontSize: 11.5}}>{filename}</span>.
              </p>

              {/* Quick action band */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 16px", marginBottom: 22,
                background: "#ffffff", border: "1px solid var(--hair)", borderRadius: 10,
              }}>
                <button onClick={() => {
                  const next = {};
                  [...extraction.facts, ...extraction.rules, ...extraction.scenarios, ...extraction.playbooks].forEach(i => {
                    if (i.confidence >= 0.85) next[i.id] = true;
                  });
                  setAccepted(next);
                }} style={{
                  all: "unset", cursor: "pointer",
                  background: "var(--ink)", color: "#ffffff",
                  padding: "8px 16px", borderRadius: 8,
                  fontSize: 13, fontWeight: 600,
                }}>Accept all {highConfidenceCount} high-confidence</button>
                <Btn size="sm" kind="ghost" onClick={() => setAccepted({})}>Reset</Btn>
                <span style={{flex: 1}} />
                <span className="mono" style={{fontSize: 11, color: "var(--muted)", letterSpacing: ".06em"}}>
                  {acceptedCount} / {totalItems} ACCEPTED
                </span>
              </div>

              {/* Extraction groups */}
              <ExtractionGroup
                label="Facts"
                items={extraction.facts}
                accepted={accepted}
                onToggle={(id) => setAccepted(a => ({...a, [id]: !a[id]}))}
                renderMeta={(f) => `${f.group} · ${f.page}`}
              />
              <ExtractionGroup
                label="Rule candidates"
                items={extraction.rules}
                accepted={accepted}
                onToggle={(id) => setAccepted(a => ({...a, [id]: !a[id]}))}
                renderMeta={(r) => `Will simulate on past cases · ${r.page}`}
              />
              <ExtractionGroup
                label="Scenario coverage"
                items={extraction.scenarios}
                accepted={accepted}
                onToggle={(id) => setAccepted(a => ({...a, [id]: !a[id]}))}
                renderMeta={(s) => `Stage · ${s.stage}`}
              />
              <ExtractionGroup
                label="Playbook candidates"
                items={extraction.playbooks}
                accepted={accepted}
                onToggle={(id) => setAccepted(a => ({...a, [id]: !a[id]}))}
                renderMeta={(p) => p.est_value}
              />
            </>
          )}
        </div>

        {/* Footer */}
        {stage === "review" && (
          <div style={{
            padding: "16px 28px", borderTop: "1px solid var(--hair-soft)",
            display: "flex", alignItems: "center", gap: 12,
            background: "#ffffff",
          }}>
            <span className="mono" style={{fontSize: 10.5, letterSpacing: ".10em", color: "var(--muted)"}}>
              Cendra will write to the property brain with provenance back to <span style={{color: "var(--ink)"}}>{filename}</span>
            </span>
            <span style={{flex: 1}} />
            <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
            <button onClick={() => { onImported && onImported(filename, acceptedCount); onClose(); }} style={{
              all: "unset", cursor: acceptedCount > 0 ? "pointer" : "not-allowed",
              background: acceptedCount > 0 ? "var(--ink)" : "var(--hair)",
              color: acceptedCount > 0 ? "#ffffff" : "var(--muted)",
              padding: "10px 20px", borderRadius: 10,
              fontSize: 13.5, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Apply {acceptedCount} items
              <span style={{fontFamily: "var(--mono)", fontSize: 12, opacity: .8}}>↵</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressSteps({ active }) {
  const steps = [
    { id: "parsing",    label: "Parsing document"   },
    { id: "extracting", label: "Extracting entities" },
    { id: "matching",   label: "Matching scenario catalog (469)" },
    { id: "review",     label: "Ready for review"   },
  ];
  const idx = steps.findIndex(s => s.id === active);
  return (
    <div style={{display: "grid", gap: 10, maxWidth: 480}}>
      {steps.map((s, i) => {
        const done = i < idx;
        const current = i === idx;
        return (
          <div key={s.id} style={{display: "flex", alignItems: "center", gap: 12}}>
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              border: "1.5px solid " + (done ? "var(--ok)" : current ? "var(--ink)" : "var(--hair)"),
              background: done ? "var(--ok)" : "transparent",
              display: "grid", placeItems: "center",
              color: "#ffffff", fontSize: 10, fontWeight: 700,
              animation: current ? "cendra-pulse 1.4s ease-in-out infinite" : "none",
            }}>{done ? "✓" : ""}</span>
            <span style={{
              fontSize: 13.5,
              color: done ? "var(--ink-mid)" : current ? "var(--ink)" : "var(--muted)",
              fontWeight: current ? 600 : 400,
            }}>{s.label}</span>
            {current && (
              <span className="mono" style={{fontSize: 10, color: "var(--muted)", letterSpacing: ".10em"}}>RUNNING…</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExtractionGroup({ label, items, accepted, onToggle, renderMeta }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{marginBottom: 24}}>
      <div className="mono" style={{
        fontSize: 10, letterSpacing: ".14em", color: "var(--muted)",
        textTransform: "uppercase", marginBottom: 10, fontWeight: 500,
      }}>{label} · {items.length}</div>
      <div style={{display: "grid", gap: 1, background: "var(--hair)", border: "1px solid var(--hair)", borderRadius: 10, overflow: "hidden"}}>
        {items.map(item => {
          const isAccepted = accepted[item.id];
          const confColor = item.confidence >= 0.85 ? "var(--ok)" : item.confidence >= 0.70 ? "var(--warn)" : "var(--muted)";
          return (
            <div key={item.id} style={{
              display: "grid", gridTemplateColumns: "24px 1fr 60px auto",
              gap: 14, padding: "12px 16px", alignItems: "center",
              background: isAccepted ? "var(--ok-soft)" : "#ffffff",
              transition: "background .12s",
            }}>
              <button onClick={() => onToggle(item.id)} style={{
                all: "unset", cursor: "pointer",
                width: 18, height: 18, borderRadius: 5,
                border: "1.5px solid " + (isAccepted ? "var(--ok)" : "var(--hair)"),
                background: isAccepted ? "var(--ok)" : "#ffffff",
                display: "grid", placeItems: "center",
                color: "#ffffff", fontSize: 11, fontWeight: 700,
              }}>{isAccepted ? "✓" : ""}</button>
              <div>
                <div style={{fontSize: 13.5, color: "var(--ink)", lineHeight: 1.45}}>{item.label}</div>
                <div className="mono" style={{fontSize: 10.5, color: "var(--muted)", letterSpacing: ".04em", marginTop: 3}}>
                  {renderMeta && renderMeta(item)}
                </div>
              </div>
              <span className="mono" style={{
                fontSize: 11, color: confColor, fontWeight: 600,
                letterSpacing: ".04em", textAlign: "right",
              }}>{Math.round(item.confidence * 100)}%</span>
              <Btn size="sm" kind="ghost">Edit</Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getTypeFromExt(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["pdf"].includes(ext)) return "pdf";
  if (["docx", "doc"].includes(ext)) return "docx";
  if (["xlsx", "xls"].includes(ext)) return "xlsx";
  if (["pptx", "ppt"].includes(ext)) return "pptx";
  if (["csv"].includes(ext)) return "csv";
  if (["png", "jpg", "jpeg", "webp", "heic", "tiff"].includes(ext)) return "image";
  if (["mp3", "wav", "m4a", "ogg"].includes(ext)) return "audio";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["eml", "msg"].includes(ext)) return "email";
  if (["html", "htm"].includes(ext)) return "web";
  if (["json", "xml"].includes(ext)) return "json";
  return "txt";
}

// ───────────────────────────────────────────────────────────────────
// RESOLVE CONFLICT MODAL — evidence-first conflict resolution
// Two (or more) sources disagree on the value of a fact. Cendra
// surfaces both side-by-side with confidence + freshness, PM picks
// the winner (or enters a new value), and Cendra offers to auto-task
// the losing source for update (e.g. push corrective edit to Airbnb
// listing). Reusable for any fact with conflict_sources.
// ───────────────────────────────────────────────────────────────────
function ResolveConflictModal({ fact, propertyName, onClose, onResolve }) {
  const sources = fact.conflict_sources || [];
  const [pick, setPick] = useState(sources[0]?.id || null);
  const [customValue, setCustomValue] = useState("");
  const [mode, setMode] = useState("source"); // "source" | "custom" | "review"
  const [autoTask, setAutoTask] = useState(true);

  const chosenSource = sources.find(s => s.id === pick);
  const losingSource = sources.find(s => s.id !== pick);

  const handleResolve = () => {
    let newValue, newSource;
    if (mode === "source" && chosenSource) {
      newValue = chosenSource.value;
      newSource = chosenSource;
    } else if (mode === "custom") {
      newValue = customValue.trim();
      newSource = { label: "PM override · just now", confidence: 1.0 };
    } else {
      // review — flag for further investigation
      onResolve && onResolve(null, { needsReview: true });
      onClose();
      return;
    }
    onResolve && onResolve(newValue, { chosenSource: newSource, autoTask, losingSource });
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.40)",
      display: "grid", placeItems: "center",
      padding: 32,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "min(900px, 100%)", maxHeight: "calc(100vh - 64px)",
        background: "var(--paper)", borderRadius: 16,
        boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 28px", borderBottom: "1px solid var(--hair-soft)",
          display: "flex", alignItems: "center", gap: 16, background: "#ffffff",
        }}>
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: ".18em", color: "var(--muted)",
            display: "flex", gap: 12, alignItems: "center", flex: 1,
          }}>
            <span>RESOLVE CONFLICT</span>
            <span style={{width: 3, height: 3, borderRadius: "50%", background: "var(--muted-2)"}} />
            <span>{(propertyName || "PROPERTY").toUpperCase()}</span>
            <span style={{width: 3, height: 3, borderRadius: "50%", background: "var(--muted-2)"}} />
            <span style={{color: "var(--warn)"}}>{fact.fact.toUpperCase()}</span>
          </div>
          <button onClick={onClose} style={{
            all: "unset", cursor: "pointer",
            width: 28, height: 28, borderRadius: "50%",
            display: "grid", placeItems: "center",
            color: "var(--muted)", fontSize: 16,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--paper)"; e.currentTarget.style.color = "var(--ink)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}>×</button>
        </div>

        <div style={{flex: 1, overflowY: "auto", padding: "24px 28px"}}>

          {/* Cendra speaks */}
          <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 14}}>
            <span style={{
              width: 22, height: 22, borderRadius: 6,
              background: "var(--ink)", color: "#ffffff",
              display: "grid", placeItems: "center",
              fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
            }}>C</span>
            <span className="mono" style={{fontSize: 10.5, letterSpacing: ".14em", color: "var(--ink)", fontWeight: 600}}>CENDRA</span>
            <span className="mono" style={{fontSize: 10, color: "var(--muted)"}}>·</span>
            <span className="mono" style={{fontSize: 10, color: "var(--muted)", letterSpacing: ".12em"}}>CONFLICT DETECTED · BEST SOURCE · {window.CendraAtoms.confidenceBand(Math.max(...sources.map(s => s.confidence))).label.toUpperCase()}</span>
          </div>

          <h2 className="serif-display" style={{
            fontSize: 26, lineHeight: 1.25, margin: 0, color: "var(--ink)",
            letterSpacing: "-.008em", marginBottom: 12, maxWidth: 720,
            fontVariationSettings: '"opsz" 72, "SOFT" 50',
          }}>
            {sources.length === 2 ? "Two sources" : `${sources.length} sources`} disagree on <b>{fact.fact.toLowerCase()}</b>. Until you resolve this, I won't promise a value to guests.
          </h2>
          <p style={{margin: 0, fontSize: 14, color: "var(--ink-mid)", lineHeight: 1.55, maxWidth: 720}}>
            Pick the winning source — I'll write the value to the property brain and offer to update the losing source. Or override with a new value.
          </p>

          {/* Source comparison */}
          <div style={{
            display: "grid", gridTemplateColumns: `repeat(${sources.length}, 1fr)`,
            gap: 14, marginTop: 24, marginBottom: 20,
          }}>
            {sources.map(s => {
              const selected = mode === "source" && pick === s.id;
              return (
                <button key={s.id} onClick={() => { setPick(s.id); setMode("source"); }} style={{
                  all: "unset", cursor: "pointer",
                  padding: "20px 22px", borderRadius: 14,
                  background: selected ? "#ffffff" : "#ffffff",
                  border: "1px solid " + (selected ? "var(--ink)" : "var(--hair)"),
                  boxShadow: selected ? "0 0 0 2px var(--ink), 0 8px 24px rgba(0,0,0,0.08)" : "0 1px 2px rgba(0,0,0,0.03)",
                  transition: "box-shadow .12s, border-color .12s",
                  position: "relative", display: "block",
                }}>
                  {/* Radio mark */}
                  <span style={{
                    position: "absolute", top: 18, right: 18,
                    width: 18, height: 18, borderRadius: "50%",
                    border: "1.5px solid " + (selected ? "var(--ink)" : "var(--hair)"),
                    background: selected ? "var(--ink)" : "#ffffff",
                    display: "grid", placeItems: "center",
                  }}>
                    {selected && <span style={{width: 7, height: 7, borderRadius: "50%", background: "#ffffff"}} />}
                  </span>

                  <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 12}}>
                    <SourceTypeBadge type={s.source_type} size="sm" />
                    <div className="mono" style={{fontSize: 10, letterSpacing: ".12em", color: "var(--muted)", textTransform: "uppercase", fontWeight: 500}}>
                      {s.label}
                    </div>
                  </div>

                  <div className="serif-display" style={{
                    fontSize: 22, lineHeight: 1.2, color: "var(--ink)",
                    letterSpacing: "-.005em", marginBottom: 14,
                    fontVariationSettings: '"opsz" 48, "SOFT" 30',
                  }}>"{s.value}"</div>

                  <p style={{margin: 0, fontSize: 13, color: "var(--ink-mid)", lineHeight: 1.5}}>{s.evidence}</p>

                  <div className="mono" style={{fontSize: 10, letterSpacing: ".08em", color: "var(--muted)", marginTop: 14, lineHeight: 1.7, textTransform: "uppercase"}}>
                    {s.source_file}<br />
                    {s.captured} · {s.captured_by} · conf {Math.round(s.confidence * 100)}%
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom override */}
          <button onClick={() => setMode("custom")} style={{
            all: "unset", cursor: "pointer", display: "block", width: "calc(100% - 36px)",
            padding: "14px 18px", borderRadius: 12,
            border: "1px " + (mode === "custom" ? "solid var(--ink)" : "dashed var(--hair)"),
            background: mode === "custom" ? "#ffffff" : "transparent",
            boxShadow: mode === "custom" ? "0 0 0 2px var(--ink)" : "none",
            marginBottom: 12,
            transition: "all .12s",
          }}>
            <div style={{display: "flex", alignItems: "center", gap: 12}}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: "1.5px solid " + (mode === "custom" ? "var(--ink)" : "var(--hair)"),
                background: mode === "custom" ? "var(--ink)" : "#ffffff",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                {mode === "custom" && <span style={{width: 7, height: 7, borderRadius: "50%", background: "#ffffff"}} />}
              </span>
              <span style={{fontSize: 13.5, fontWeight: 500, color: "var(--ink)"}}>Neither — enter a different value</span>
            </div>
            {mode === "custom" && (
              <input
                autoFocus
                value={customValue}
                onChange={e => setCustomValue(e.target.value)}
                onClick={e => e.stopPropagation()}
                placeholder={`What's the actual ${fact.fact.toLowerCase()}?`}
                style={{
                  width: "100%", padding: "10px 14px", marginTop: 12,
                  border: "1px solid var(--hair)", borderRadius: 8,
                  background: "#ffffff", fontSize: 14, fontFamily: "var(--sans)",
                  color: "var(--ink)", outline: 0, boxSizing: "border-box",
                }}
              />
            )}
          </button>

          {/* Investigate */}
          <button onClick={() => setMode("review")} style={{
            all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
            width: "calc(100% - 36px)",
            padding: "14px 18px", borderRadius: 12,
            border: "1px " + (mode === "review" ? "solid var(--warn)" : "dashed var(--hair)"),
            background: mode === "review" ? "var(--warn-soft)" : "transparent",
            transition: "all .12s",
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              border: "1.5px solid " + (mode === "review" ? "var(--warn)" : "var(--hair)"),
              background: mode === "review" ? "var(--warn)" : "#ffffff",
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              {mode === "review" && <span style={{width: 7, height: 7, borderRadius: "50%", background: "#ffffff"}} />}
            </span>
            <span style={{fontSize: 13.5, fontWeight: 500, color: "var(--ink)"}}>I need to investigate first — keep flagged</span>
            <span style={{flex: 1}} />
            <span className="mono" style={{fontSize: 10, color: "var(--muted)", letterSpacing: ".08em"}}>STAYS IN ATTENTION QUEUE</span>
          </button>

          {/* Auto-task hint (when a source is chosen and another loses) */}
          {mode === "source" && losingSource && (
            <div style={{
              marginTop: 22, padding: "16px 20px", borderRadius: 12,
              background: "#ffffff", border: "1px solid var(--hair)",
              borderLeft: "4px solid var(--info)",
            }}>
              <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 8}}>
                <input
                  type="checkbox"
                  checked={autoTask}
                  onChange={e => setAutoTask(e.target.checked)}
                  style={{margin: 0, width: 16, height: 16, accentColor: "var(--ink)"}}
                />
                <span className="mono" style={{fontSize: 10, letterSpacing: ".14em", color: "var(--info)", textTransform: "uppercase", fontWeight: 600}}>
                  AUTO-TASK · UPDATE LOSING SOURCE
                </span>
              </div>
              <div style={{fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5}}>
                {losingSource.fix_if_loses}
              </div>
              <div className="mono" style={{fontSize: 10.5, letterSpacing: ".04em", color: "var(--muted)", marginTop: 6}}>
                TARGET · {losingSource.source_file}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 28px", borderTop: "1px solid var(--hair-soft)",
          display: "flex", alignItems: "center", gap: 12, background: "#ffffff",
        }}>
          <span className="mono" style={{fontSize: 10.5, letterSpacing: ".06em", color: "var(--muted)"}}>
            {mode === "source" && chosenSource && <>State: <span style={{color: "var(--ink)"}}>conflict → verified</span> · provenance: <span style={{color: "var(--ink)"}}>{chosenSource.source_file}</span></>}
            {mode === "custom" && customValue.trim() && <>State: <span style={{color: "var(--ink)"}}>conflict → verified</span> · provenance: <span style={{color: "var(--ink)"}}>YOU · just now</span></>}
            {mode === "review" && <>Will stay flagged in the attention queue.</>}
          </span>
          <span style={{flex: 1}} />
          <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
          <button
            onClick={handleResolve}
            disabled={mode === "custom" && !customValue.trim()}
            style={{
              all: "unset",
              cursor: (mode === "custom" && !customValue.trim()) ? "not-allowed" : "pointer",
              background: (mode === "custom" && !customValue.trim()) ? "var(--hair)" : "var(--ink)",
              color: (mode === "custom" && !customValue.trim()) ? "var(--muted)" : "#ffffff",
              padding: "10px 20px", borderRadius: 10,
              fontSize: 13.5, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
            {mode === "review" ? "Flag for review" : "Resolve & apply"}
            <span style={{fontFamily: "var(--mono)", fontSize: 12, opacity: .8}}>↵</span>
          </button>
        </div>
      </div>
    </div>
  );
}

window.CendraScreens3 = {
  PropertiesScreen, PropertyDetailScreen,
  PlaybookLibraryScreen,
  InsightsScreen,
  TrustScreen,
};
