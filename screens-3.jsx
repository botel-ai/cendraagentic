// Cendra Agent OS — new screens v2:
// Properties (portfolio + detail), Playbook Library, Insights, Trust, Integrations, Team, Onboarding
const { Pill, AutonomyPill, ReasonPill, Seal, Btn, ActionBar, DecisionCard, PageHeader, QuietState, cls } = window.CendraAtoms;
const { ChannelChip } = window.CendraVision;
const { StatusPill, StateBadge, SLATimer, PortfolioFilterBar, IntegrationHealthCard, HardRuleCard,
        KnowledgeGapCard, PropertyFactRow, TeamAssignmentCard, LiveActivityMilestone,
        SignalStrip, SectionHead, WorkflowTrustRow } = window.CendraAtoms2;
const D2 = window.CENDRA_DATA;
const D3 = window.CENDRA_DATA2;

// ───────────────────────────────────────────────────────────────────
// PROPERTIES — portfolio overview
// ───────────────────────────────────────────────────────────────────
function PropertiesScreen({ onOpen }) {
  const props = D3.properties_brain;
  const [filter, setFilter] = useState("attention");

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
            <button onClick={() => onOpen('property_detail', topBlocker.id)} style={{
              all:'unset', cursor:'pointer',
              background:'var(--ink)', color:'#ffffff',
              padding:'12px 22px', borderRadius: 10,
              fontSize: 14.5, fontWeight: 600,
              display:'inline-flex', alignItems:'center', gap: 8,
            }}>
              Open property brain
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
          <button key={p.id} onClick={() => onOpen('property_detail', p.id)} style={{
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
    </div>
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
function PropertyDetailScreen({ onOpen }) {
  const p = D3.property_detail;
  const [rulesOpen, setRulesOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  return (
    <div className="stage" style={{maxWidth: 1020, paddingTop: 56, paddingBottom: 120}}>
      <button onClick={() => onOpen('properties')} className="mono" style={{
        all:'unset', cursor:'pointer', fontSize: 11, letterSpacing:'.14em',
        color:'var(--muted)', marginBottom: 24, display:'inline-block',
      }}>← ALL PROPERTIES</button>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 24, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>PROPERTY · {p.region.toUpperCase()} · {p.group.toUpperCase()}</span>
        <span style={{flex:1}} />
        <span>{p.owner.toUpperCase()} · {p.primary_contact.toUpperCase()}</span>
      </div>

      {/* HERO — property identity */}
      <div style={{marginBottom: 32}}>
        <h1 className="serif-display" style={{
          fontSize: 46, lineHeight: 1.05, margin: 0, color:'var(--ink)',
        }}>
          {p.name}
        </h1>
        <p style={{
          fontSize: 15.5, lineHeight: 1.55, margin: '14px 0 0',
          color:'var(--ink-mid)', maxWidth: 720,
        }}>
          {p.access} · Wi-Fi <b style={{color:'var(--ink)'}}>{p.wifi.split(' / ')[0]}</b> · {p.floor}
        </p>
      </div>

      {/* MICRO STAT BAND */}
      <div style={{
        display:'flex', gap: 36, flexWrap:'wrap',
        paddingBottom: 24, marginBottom: 24, borderBottom:'1px solid var(--hair-soft)',
      }}>
        <MicroStatBlock2 value={p.facts_summary.verified} label="verified facts" />
        <MicroStatBlock2 value={p.facts_summary.missing} label="missing" tone={p.facts_summary.missing > 0 ? "warn" : "ok"} />
        <MicroStatBlock2 value={p.facts_summary.conflicts} label="conflicts" tone={p.facts_summary.conflicts > 0 ? "warn" : "ok"} />
        <MicroStatBlock2 value={p.facts_summary.internal} label="internal-only" />
        <span style={{flex:1}} />
        <MicroStatBlock2 value="all OK" label="integrations" tone="ok" />
      </div>

      {/* RISKS BAND — Von Restorff: only flagged when present */}
      {p.risks.length > 0 && (
        <div style={{
          display:'flex', gap: 14, padding:'14px 18px',
          background:'#ffffff', border:'1px solid var(--hair)', borderLeft:'4px solid var(--warn)',
          borderRadius: 10, marginBottom: 32, fontSize: 13,
        }}>
          <span className="mono" style={{fontSize: 10, letterSpacing:'.18em', color:'var(--warn)', fontWeight: 600, whiteSpace:'nowrap', paddingTop: 2}}>RISKS</span>
          <span style={{color:'var(--ink)'}}>{p.risks.join(' · ')}</span>
        </div>
      )}

      {/* FACTS — always open, narrative anchor */}
      <div style={{marginBottom: 32}}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing:'.14em', color:'var(--ink)',
          fontWeight: 600, textTransform:'uppercase', marginBottom: 6,
        }}>What Cendra knows · {p.facts_summary.verified} facts</div>
        <div style={{fontSize: 13, color:'var(--muted)', marginBottom: 16}}>Grouped by visibility. Click to drill in.</div>
        <div style={{display:'grid', gap: 28}}>
          {p.fact_groups.map((g, gi) => (
            <div key={gi}>
              <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 10, fontWeight: 500}}>{g.label}</div>
              <div className="dcard" style={{padding: 0, overflow: 'hidden'}}>
                {g.facts.map((f, i) => <PropertyFactRow key={i} f={f} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OWNER RULES — collapsible */}
      <CollapsibleStep
        eyebrow="OWNER RULES · 3"
        sub="Property-specific rules Cendra honors before any decision."
        open={rulesOpen}
        onToggle={() => setRulesOpen(o => !o)}
      >
        <div className="dcard" style={{padding:'18px 22px', marginTop: 14}}>
          <div style={{display:'grid', gap: 0}}>
            {[
              { text: "Never offer late checkout if same-day turnover", source: "OWNER · 32d" },
              { text: "Hot water heater: flush every 30 days", source: "CLEANER · 8d" },
              { text: "Quiet hours: 23:00 → 08:00 (building rule)", source: "BUILDING · 60d" },
            ].map((r, i, arr) => (
              <div key={i} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center', gap: 14,
                padding:'12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--hair-soft)' : 'none',
              }}>
                <span style={{fontSize: 13.5, color:'var(--ink)'}}>{r.text}</span>
                <span className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.06em', whiteSpace:'nowrap'}}>{r.source}</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleStep>

      {/* DECISION HISTORY — collapsible */}
      <CollapsibleStep
        eyebrow="DECISION HISTORY · LAST 9 DAYS"
        sub="Every decision Cendra made on this property."
        open={historyOpen}
        onToggle={() => setHistoryOpen(o => !o)}
      >
        <div className="dcard" style={{padding:'14px 18px', marginTop: 14}}>
          <LiveActivityMilestone label="Cendra answered Wi-Fi for Lukas Berger" tone="ok" time="11 min ago" mono="autopilot" />
          <LiveActivityMilestone label="Cendra paused early-check-in promise · cleaning unconfirmed" tone="warn" time="14 min ago" mono="approval" />
          <LiveActivityMilestone label="Marta C. confirmed cleaning ETA 14:30" tone="info" time="22 min ago" mono="cleaner" />
          <LiveActivityMilestone label="Cendra flagged bedroom config conflict (cleaner photo vs listing)" tone="warn" time="2d ago" mono="conflict" />
          <LiveActivityMilestone label="Owner rule applied · no early check-in promise" tone="ok" time="9d ago" mono="rule" />
        </div>
      </CollapsibleStep>

      {/* GUEST MEMORY — collapsible */}
      <CollapsibleStep
        eyebrow="GUEST MEMORY · 3 RECENT"
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
  const [q, setQ] = useState(I.answer_demo.question);
  const [answered, setAnswered] = useState(true);

  return (
    <div className="stage" style={{maxWidth: 1020, paddingTop: 56, paddingBottom: 120}}>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 24, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>INSIGHTS · ASK CENDRA</span>
        <span style={{flex:1}} />
        <span>NATURAL LANGUAGE · EVIDENCE-BACKED</span>
      </div>

      <div style={{marginBottom: 36}}>
        <h1 className="serif-display" style={{fontSize: 46, lineHeight: 1.05, margin: 0, color:'var(--ink)'}}>
          Ask anything about your portfolio.
        </h1>
        <p style={{fontSize: 16.5, lineHeight: 1.55, margin:'18px 0 0', color:'var(--ink-mid)', maxWidth: 720}}>
          Cendra answers in plain English with evidence and suggested next steps. Click an evidence row to drill into the underlying decisions.
        </p>
      </div>

      {/* Ask Cendra — composer + suggested */}
      <div style={{
        background: '#ffffff', border: '1px solid var(--hair)', borderRadius: 14,
        padding: '4px 4px 18px', marginBottom: 32,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        <div style={{display:'flex', gap: 12, alignItems:'center', padding:'14px 18px'}}>
          <span className="mono" style={{fontSize: 10, letterSpacing:'.18em', color:'var(--muted)', fontWeight: 500}}>ASK</span>
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setAnswered(false); }}
            onKeyDown={e => { if (e.key === 'Enter') setAnswered(true); }}
            placeholder="e.g. Why did automation drop this week?"
            style={{
              flex: 1, border: 0, outline: 0, background:'transparent',
              fontFamily:'var(--serif)', fontSize: 20, lineHeight: 1.3,
              color:'var(--ink)',
              fontVariationSettings: '"opsz" 48, "SOFT" 30',
            }}
          />
          <button onClick={() => setAnswered(true)} style={{
            all:'unset', cursor:'pointer',
            background:'var(--ink)', color:'#ffffff',
            padding:'10px 18px', borderRadius: 10,
            fontSize: 13.5, fontWeight: 600,
            display:'inline-flex', alignItems:'center', gap: 6,
          }}>
            Ask Cendra
            <span style={{fontFamily:'var(--mono)', fontSize:12, opacity:.8}}>↵</span>
          </button>
        </div>

        <div style={{padding:'4px 18px 0', display:'flex', gap: 6, flexWrap:'wrap', alignItems:'center'}}>
          <span className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', fontWeight: 500, marginRight: 6}}>SUGGESTED</span>
          {I.suggested.map(s => (
            <button key={s} onClick={() => { setQ(s); setAnswered(true); }} style={{
              all:'unset', cursor:'pointer',
              padding:'5px 12px', borderRadius: 999,
              border:'1px solid var(--hair)',
              background:'#ffffff', color:'var(--ink-mid)',
              fontSize: 11.5, fontWeight: 500,
            }}>{s}</button>
          ))}
        </div>
      </div>

      {answered && q === I.answer_demo.question && (
        <section style={{marginBottom: 48}}>
          <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 10, fontWeight: 500}}>
            CENDRA'S ANSWER · 0.94 CONFIDENCE
          </div>
          <div className="dcard" style={{padding: '26px 30px'}}>
            <h2 className="serif-display" style={{fontSize: 28, lineHeight: 1.22, fontWeight: 400, margin:'0 0 14px', color:'var(--ink)'}}>
              {I.answer_demo.headline}
            </h2>
            <p style={{margin:'0 0 22px', fontSize: 15, lineHeight: 1.6, color:'var(--ink-mid)', maxWidth: 720}}>
              {I.answer_demo.detail}
            </p>

            {/* Single-line evidence rows */}
            <div style={{display:'grid', gap: 1, background:'var(--hair)', border:'1px solid var(--hair)', borderRadius: 10, overflow:'hidden'}}>
              {I.answer_demo.evidence.map((e, i) => (
                <div key={i} style={{
                  display:'grid', gridTemplateColumns:'160px 1fr 110px',
                  gap: 14, padding:'12px 18px', alignItems:'center',
                  background:'#ffffff', fontSize: 13,
                }}>
                  <span className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', fontWeight: 500}}>{e.kind}</span>
                  <span style={{color:'var(--ink)'}}>{e.value}</span>
                  <span className="mono" style={{fontSize: 11, color:'var(--muted)', letterSpacing:'.04em', textAlign:'right'}}>{e.delta || ''}</span>
                </div>
              ))}
            </div>

            <div style={{display:'flex', gap: 10, marginTop: 22, flexWrap:'wrap', alignItems:'center'}}>
              {I.answer_demo.next.map((n, i) => (
                <Btn key={i} size="sm" kind={i === 0 ? "primary" : "default"}>{n}</Btn>
              ))}
              <span style={{flex:1}} />
              <Btn size="sm" kind="ghost" onClick={() => onOpen('audit')}>Open underlying decisions →</Btn>
            </div>
          </div>
        </section>
      )}

      {/* Trends */}
      <SectionHead eyebrow="PORTFOLIO TRENDS · 7D" title="What's moving." sub="Six headline metrics. Click to drill in." />
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

  // Three semantic groups — Hick's Law: 6 tabs → 3
  const tabs = [
    { id: "safety", label: "Safety",     count: D3.hard_rules.length + D3.team.length },
    { id: "data",   label: "Data",       count: D3.integrations.length + 4 },
    { id: "audit",  label: "Audit",      count: D2.audit.length },
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

      {/* SAFETY — Hard rules + Permissions stacked */}
      {tab === "safety" && (
        <div style={{display:'grid', gap: 48}}>
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

      {/* AUDIT — link to audit trail + incident review */}
      {tab === "audit" && (
        <div style={{display:'grid', gap: 32}}>
          <div style={{
            background:'#ffffff', border:'1px solid var(--hair)', borderRadius: 16,
            padding:'28px 32px', boxShadow:'0 4px 24px rgba(0,0,0,0.04)',
            position:'relative', overflow:'hidden',
          }}>
            <div style={{position:'absolute', top:0, left:0, width:4, height:'100%', background:'var(--ok)'}} />
            <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 12}}>
              <span className="mono" style={{fontSize: 10, letterSpacing: '.18em', color: 'var(--ok)', fontWeight: 600}}>NO INCIDENTS · 30D</span>
              <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
              <span className="mono" style={{fontSize:10, letterSpacing:'.12em', color:'var(--muted)'}}>LAST · 23D AGO · LATE CHECKOUT TIMING · RESOLVED</span>
            </div>
            <h2 className="serif-display" style={{fontSize: 28, lineHeight: 1.15, margin: 0, color:'var(--ink)', marginBottom: 12}}>
              No incidents in 30 days.
            </h2>
            <p style={{margin: 0, fontSize: 14, lineHeight: 1.6, color:'var(--ink-mid)', maxWidth: 680}}>
              An incident is any decision flagged by Golden Cases overnight, any rolled-back action, or any guest-reported issue tied to Cendra.
            </p>
            <div style={{display:'flex', gap: 12, marginTop: 20}}>
              <button onClick={() => onOpen('audit')} style={{
                all:'unset', cursor:'pointer',
                background:'var(--ink)', color:'#ffffff',
                padding:'12px 22px', borderRadius: 10,
                fontSize: 14.5, fontWeight: 600,
                display:'inline-flex', alignItems:'center', gap: 8,
              }}>
                Open audit trail
                <span style={{fontFamily:'var(--mono)', fontSize:13, opacity:.8}}>↵</span>
              </button>
              <Btn kind="ghost">Read last post-mortem →</Btn>
            </div>
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
// INTEGRATIONS — standalone deep page
// ───────────────────────────────────────────────────────────────────
function IntegrationsScreen({ onOpen }) {
  const groups = useMemo(() => {
    const g = {};
    D3.integrations.forEach(i => { (g[i.category] = g[i.category] || []).push(i); });
    return g;
  }, []);

  const connected = D3.integrations.filter(i => i.status === 'connected');
  const degraded = D3.integrations.filter(i => i.status === 'degraded');
  const broken = D3.integrations.filter(i => i.status === 'broken');
  const open = D3.integrations.filter(i => i.open_incident);
  const affectedProps = degraded.reduce((s, i) => s + i.affects_props, 0);
  const allHealthy = degraded.length === 0 && broken.length === 0;

  return (
    <div className="stage" style={{maxWidth: 1080, paddingTop: 56, paddingBottom: 120}}>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 28, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>TRUST · INTEGRATION HEALTH</span>
        <span style={{flex:1}} />
        <span style={{display:'inline-flex', alignItems:'center', gap:6, color: allHealthy ? 'var(--ok)' : 'var(--warn)'}}>
          <span style={{width:6, height:6, borderRadius:'50%', background: allHealthy ? 'var(--ok)' : 'var(--warn)'}} />
          {allHealthy ? 'ALL HEALTHY' : `${degraded.length} DEGRADED`}
        </span>
      </div>

      {/* HERO — Cendra speaks on data sources */}
      <div style={{marginBottom: 48}}>
        <h1 className="serif-display" style={{
          fontSize: 46, lineHeight: 1.05, margin: 0, color: 'var(--ink)',
        }}>
          {allHealthy
            ? <>Every source is live.</>
            : <>{degraded.length} source{degraded.length > 1 ? 's' : ''} need{degraded.length === 1 ? 's' : ''} attention.</>
          }
        </h1>
        <p style={{
          fontSize: 16.5, lineHeight: 1.55, margin: '18px 0 0',
          color: 'var(--ink-mid)', maxWidth: 720, fontFamily: 'var(--sans)',
        }}>
          {allHealthy
            ? <>{D3.integrations.length} connections across PMS, channels, ops, payments. Cendra is reading clean data everywhere.</>
            : <><b style={{color:'var(--ink)'}}>{open[0]?.name || degraded[0].name}</b> degraded — {affectedProps} properties affected, workflows auto-demoted. Cendra falls back, then tells you what stopped.</>
          }
        </p>
      </div>

      {/* OPEN INCIDENT HERO CARD — only when an incident is open */}
      {open.length > 0 && (
        <div style={{
          background: '#ffffff', border: '1px solid var(--hair)', borderRadius: 16,
          padding: '28px 32px', marginBottom: 48,
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{position:'absolute', top:0, left:0, width:4, height:'100%', background:'var(--rausch)'}} />
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 14}}>
            <span className="mono" style={{fontSize: 10, letterSpacing: '.18em', color: 'var(--rausch)', fontWeight: 600}}>OPEN INCIDENT</span>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
            <span className="mono" style={{fontSize:10, letterSpacing:'.12em', color:'var(--muted)'}}>{open[0].category.toUpperCase()} · LAST SYNC {open[0].last_sync.toUpperCase()}</span>
            <span style={{flex:1}} />
            <Pill tone="warn">{open[0].status}</Pill>
          </div>
          <h2 className="serif-display" style={{fontSize: 30, lineHeight: 1.12, margin: 0, color:'var(--ink)', marginBottom: 14}}>
            {open[0].name}
          </h2>
          <p style={{margin: 0, fontSize: 14.5, lineHeight: 1.55, color:'var(--ink-mid)', maxWidth: 720, marginBottom: 18}}>
            {open[0].fallback}
          </p>
          <div style={{display:'flex', gap: 28, flexWrap:'wrap', marginBottom: 20}}>
            <MicroStatBlock2 value={open[0].affects_props} label="properties affected" tone="warn" />
            <MicroStatBlock2 value={open[0].affects_workflows.length === 1 && open[0].affects_workflows[0] === 'all' ? 'All' : open[0].affects_workflows.length} label="workflows demoted" tone="warn" />
          </div>
          <div style={{display:'flex', alignItems:'center', gap: 14, flexWrap:'wrap'}}>
            <button style={{
              all:'unset', cursor:'pointer',
              background:'var(--ink)', color:'#ffffff',
              padding:'12px 22px', borderRadius: 10,
              fontSize: 14.5, fontWeight: 600,
              display:'inline-flex', alignItems:'center', gap: 8,
            }}>
              Reconnect now
              <span style={{fontFamily:'var(--mono)', fontSize:13, opacity:.8}}>↵</span>
            </button>
            <Btn kind="ghost">Pause affected workflows</Btn>
            <Btn kind="ghost">View affected guests →</Btn>
          </div>
        </div>
      )}

      {/* MICRO STAT BAND */}
      <div style={{
        display:'flex', gap: 36, flexWrap:'wrap',
        paddingBottom: 24, marginBottom: 24, borderBottom:'1px solid var(--hair-soft)',
      }}>
        <MicroStatBlock2 value={connected.length} label="connected" tone="ok" />
        <MicroStatBlock2 value={degraded.length} label="degraded" tone={degraded.length > 0 ? "warn" : "ok"} />
        <MicroStatBlock2 value={broken.length} label="broken" tone={broken.length > 0 ? "risk" : "ok"} />
        <MicroStatBlock2 value={affectedProps} label="properties affected" tone={affectedProps > 0 ? "warn" : "ok"} />
        <span style={{flex:1}} />
        <MicroStatBlock2 value="live" label="last full sync" tone="ok" />
      </div>

      {/* GROUPED INTEGRATION CARDS */}
      {Object.entries(groups).map(([cat, items]) => (
        <section key={cat} style={{marginBottom: 36}}>
          <div className="mono" style={{
            fontSize: 11, letterSpacing:'.14em', color:'var(--ink)',
            fontWeight: 600, textTransform:'uppercase', marginBottom: 12,
          }}>{cat} · {items.length}</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap: 14}}>
            {items.map(i => <IntegrationHealthCard key={i.id} i={i} onOpen={onOpen} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

window.CendraScreens3 = {
  PropertiesScreen, PropertyDetailScreen,
  PlaybookLibraryScreen,
  InsightsScreen,
  TrustScreen, IntegrationsScreen,
};
