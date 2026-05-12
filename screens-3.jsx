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
  const [tab, setTab] = useState("attention");
  const [filters, setFilters] = useState({});
  const props = D3.properties_brain;

  const tabs = [
    { id: "attention", label: "Most asked",      sort: (a,b) => b.asks - a.asks },
    { id: "missing",   label: "Missing facts",   sort: (a,b) => b.missing - a.missing },
    { id: "conflict",  label: "Conflicts",       sort: (a,b) => b.conflicts - a.conflicts },
    { id: "risk",      label: "High risk",       sort: (a,b) => ({high:3,medium:2,low:1}[b.risk]) - ({high:3,medium:2,low:1}[a.risk]) },
    { id: "blocked",   label: "Automation blocked", sort: (a,b) => b.blocked - a.blocked },
    { id: "stale",     label: "Stale facts",     sort: (a,b) => b.stale - a.stale },
    { id: "integ",     label: "Integration issues", sort: (a,b) => (b.integrations !== 'all_ok' ? 1 : 0) - (a.integrations !== 'all_ok' ? 1 : 0) },
  ];
  const sorted = [...props].sort(tabs.find(t => t.id === tab).sort);

  return (
    <div className="stage">
      <PageHeader
        eyebrow={`PROPERTIES · 47 UNITS · 5 OWNERS`}
        title="Portfolio brain."
        lead="Where Cendra is asked the most, where its knowledge is thin, where automation is stuck. Pick a property to drill in."
      />

      <PortfolioFilterBar value={filters} onChange={(k, v) => setFilters({...filters, [k]: v})} />

      <SignalStrip items={[
        { label: "Properties", value: "47", sub: "5 owners · 4 regions" },
        { label: "Verified facts", value: "1,284", sub: "+12 this week" },
        { label: "Knowledge gaps", value: "12", sub: "in 5 properties", tone: "warn" },
        { label: "Conflicts", value: "1", sub: "Karaköy Apt 12 bedroom", tone: "warn" },
        { label: "Automation blocked", value: "2", sub: "by integration", tone: "warn" },
        { label: "Stale (>60d)", value: "4", sub: "scheduled review" },
      ]} />

      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:18, marginBottom:14}}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cls("btn","btn-sm", tab===t.id && "btn-primary")}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="dcard" style={{padding:0, overflow:'hidden'}}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'minmax(180px, 1.4fr) 160px 70px 70px 70px 70px 130px 100px',
          gap:14, padding:'10px 18px',
          background:'var(--paper-2)', borderBottom:'1px solid var(--hair)',
          fontSize:9.5, fontFamily:'var(--mono)', letterSpacing:'.16em', color:'var(--muted)',
        }}>
          <div>PROPERTY</div><div>OWNER</div>
          <div style={{textAlign:'right'}}>ASKS 30D</div>
          <div style={{textAlign:'right'}}>MISSING</div>
          <div style={{textAlign:'right'}}>CONFLICT</div>
          <div style={{textAlign:'right'}}>STALE</div>
          <div>INTEGRATIONS</div>
          <div>RISK</div>
        </div>
        {sorted.map((p, i) => (
          <button key={p.id} onClick={() => onOpen('property_detail', p.id)} style={{
            all:'unset', cursor:'pointer',
            display:'grid',
            gridTemplateColumns:'minmax(180px, 1.4fr) 160px 70px 70px 70px 70px 130px 100px',
            gap:14, padding:'14px 18px',
            borderBottom: i < sorted.length-1 ? '1px solid var(--hair-soft)' : 'none',
            alignItems:'center', width:'100%', boxSizing:'border-box',
          }}>
            <div>
              <div style={{fontSize:13.5, fontWeight:500, letterSpacing:'-.005em'}}>{p.name}</div>
              <div className="mono dim" style={{fontSize:10.5, marginTop:2}}>{p.region} · last clean {p.last_clean}</div>
            </div>
            <div className="mono" style={{fontSize:11.5, color:'var(--ink-mid)'}}>{p.owner}</div>
            <div className="mono" style={{fontSize:12, fontVariantNumeric:'tabular-nums', textAlign:'right', color: p.asks > 15 ? 'var(--warn)' : 'var(--ink)'}}>{p.asks}</div>
            <div className="mono" style={{fontSize:12, fontVariantNumeric:'tabular-nums', textAlign:'right', color: p.missing > 0 ? 'var(--warn)' : 'var(--muted)'}}>{p.missing || '—'}</div>
            <div className="mono" style={{fontSize:12, fontVariantNumeric:'tabular-nums', textAlign:'right', color: p.conflicts > 0 ? 'var(--warn)' : 'var(--muted)'}}>{p.conflicts || '—'}</div>
            <div className="mono" style={{fontSize:12, fontVariantNumeric:'tabular-nums', textAlign:'right', color: p.stale > 0 ? 'var(--warn)' : 'var(--muted)'}}>{p.stale || '—'}</div>
            <div>
              {p.integrations === 'all_ok' ? <Pill tone="ok">All OK</Pill> : <Pill tone="warn">Degraded</Pill>}
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

// ───────────────────────────────────────────────────────────────────
// PROPERTY DETAIL
// ───────────────────────────────────────────────────────────────────
function PropertyDetailScreen({ onOpen }) {
  const p = D3.property_detail;
  const [tab, setTab] = useState("facts");

  return (
    <div className="stage">
      <button onClick={() => onOpen('properties')} className="mono dim" style={{all:'unset', cursor:'pointer', fontSize:11, marginBottom:18, display:'inline-block'}}>← All properties</button>

      <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:32, marginBottom:24}}>
        <div>
          <div className="eyebrow">PROPERTY · {p.region.toUpperCase()} · {p.group.toUpperCase()}</div>
          <h1 style={{fontFamily:'var(--serif)', fontSize:48, fontWeight:400, lineHeight:1.05, letterSpacing:'-.015em', margin:'8px 0 8px'}}>
            {p.name}
          </h1>
          <p className="lead" style={{margin:0}}>
            {p.owner} · {p.primary_contact} · {p.access} · Wi-Fi {p.wifi.split(' / ')[0]}
          </p>
        </div>
        <div className="dcard" style={{padding:'14px 16px'}}>
          <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom:8}}>BRAIN</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:12}}>
            <span className="dim">Verified facts</span><b style={{textAlign:'right', fontFamily:'var(--mono)'}}>{p.facts_summary.verified}</b>
            <span className="dim">Missing</span><b style={{textAlign:'right', fontFamily:'var(--mono)', color: p.facts_summary.missing > 0 ? 'var(--warn)' : 'inherit'}}>{p.facts_summary.missing}</b>
            <span className="dim">Conflicts</span><b style={{textAlign:'right', fontFamily:'var(--mono)', color: p.facts_summary.conflicts > 0 ? 'var(--warn)' : 'inherit'}}>{p.facts_summary.conflicts}</b>
            <span className="dim">Internal-only</span><b style={{textAlign:'right', fontFamily:'var(--mono)'}}>{p.facts_summary.internal}</b>
          </div>
        </div>
      </div>

      {/* Integration strip */}
      <div className="dcard" style={{padding:'12px 18px', marginBottom: 18}}>
        <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom:8}}>INTEGRATIONS · LIVE</div>
        <div style={{display:'flex', gap:14, flexWrap:'wrap', fontSize:12}}>
          <span><b>{p.integrations.pms}</b></span>
          <span className="dim">·</span>
          {p.integrations.channels.map((c,i) => <React.Fragment key={i}><span><b>{c}</b></span><span className="dim">·</span></React.Fragment>)}
          <span><b>{p.integrations.lock}</b></span>
          <span className="dim">·</span>
          <span><b>{p.integrations.clean}</b></span>
        </div>
      </div>

      {/* Risks band */}
      {p.risks.length > 0 && (
        <div style={{
          display:'flex', gap:12, padding:'12px 16px',
          background:'var(--warn-soft)', border:'1px solid color-mix(in oklab, var(--warn), white 75%)',
          borderRadius:4, marginBottom:24, fontSize:12.5,
        }}>
          <span className="mono" style={{fontSize:9.5, letterSpacing:'.18em', color:'var(--warn)', whiteSpace:'nowrap'}}>RISKS ·</span>
          <span>{p.risks.join(' · ')}</span>
        </div>
      )}

      <div style={{display:'flex', gap:6, marginBottom:14}}>
        {[
          { id:'facts', label:'Facts ('+p.facts_summary.verified+')' },
          { id:'rules', label:'Owner rules' },
          { id:'history', label:'Decision history' },
          { id:'guests', label:'Guest memory' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cls("btn","btn-sm", tab===t.id && "btn-primary")}>{t.label}</button>
        ))}
      </div>

      {tab === 'facts' && (
        <div className="col gap-6">
          {p.fact_groups.map((g, gi) => (
            <div key={gi}>
              <div className="eyebrow mb-2">{g.label.toUpperCase()}</div>
              <div className="dcard" style={{padding:0}}>
                <div style={{
                  display:'grid', gridTemplateColumns: '170px 1fr 140px 90px 100px',
                  gap:14, padding:'10px 18px', background:'var(--paper-2)', borderBottom:'1px solid var(--hair)',
                  fontFamily:'var(--mono)', fontSize:9.5, letterSpacing:'.16em', color:'var(--muted)',
                }}>
                  <div>FACT</div><div>VALUE</div><div>SOURCE · FRESH</div><div>STATE</div><div>VISIBILITY</div>
                </div>
                {g.facts.map((f, i) => <PropertyFactRow key={i} f={f} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'rules' && (
        <div className="dcard" style={{padding:'18px 22px'}}>
          <div className="col gap-3">
            <div style={{display:'flex',justifyContent:'space-between', padding:'10px 0', borderBottom:'1px dashed var(--hair-soft)'}}>
              <span style={{fontSize:13}}>Never offer late checkout if same-day turnover</span>
              <span className="mono dim" style={{fontSize:11}}>OWNER · 32d</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between', padding:'10px 0', borderBottom:'1px dashed var(--hair-soft)'}}>
              <span style={{fontSize:13}}>Hot water heater: flush every 30 days</span>
              <span className="mono dim" style={{fontSize:11}}>CLEANER · 8d</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between', padding:'10px 0'}}>
              <span style={{fontSize:13}}>Quiet hours: 23:00 → 08:00 (building rule)</span>
              <span className="mono dim" style={{fontSize:11}}>BUILDING · 60d</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="dcard" style={{padding:'14px 18px'}}>
          <LiveActivityMilestone label="Cendra answered Wi-Fi for Lukas Berger" tone="ok" time="11 min ago" mono="autopilot" />
          <LiveActivityMilestone label="Cendra paused early-check-in promise · cleaning unconfirmed" tone="warn" time="14 min ago" mono="approval" />
          <LiveActivityMilestone label="Marta C. confirmed cleaning ETA 14:30" tone="info" time="22 min ago" mono="cleaner" />
          <LiveActivityMilestone label="Cendra flagged bedroom config conflict (cleaner photo vs listing)" tone="warn" time="2d ago" mono="conflict" />
          <LiveActivityMilestone label="Owner rule applied · no early check-in promise" tone="ok" time="9d ago" mono="rule" />
        </div>
      )}

      {tab === 'guests' && (
        <div className="dcard" style={{padding:'18px 22px'}}>
          <p className="dim" style={{fontSize:13, margin:0}}>3 guests in last 30 days. Sentiment trending positive. No repeat issues.</p>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// PLAYBOOK LIBRARY (the builder is in screens-2.jsx)
// ───────────────────────────────────────────────────────────────────
function PlaybookLibraryScreen({ onOpen }) {
  const [filter, setFilter] = useState("all");
  const cats = D3.playbook_categories;

  return (
    <div className="stage">
      <PageHeader
        eyebrow="PLAYBOOKS · LIBRARY"
        title="Hospitality playbooks Cendra runs."
        lead="Each playbook has its own autonomy, scope, simulation coverage, and history. Edit, simulate, then publish. Nothing goes live without a passing simulation."
        right={<Btn kind="primary" onClick={() => onOpen('playbook')}>+ New playbook</Btn>}
      />

      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:18}}>
        {[
          { id: "all", label: "All" },
          { id: "live", label: "Live" },
          { id: "draft", label: "Drafts" },
          { id: "needs_review", label: "Needs review" },
          { id: "staging", label: "Staging" },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={cls("btn","btn-sm", filter===f.id && "btn-primary")}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="col gap-6">
        {cats.map(cat => {
          const pbs = filter === 'all' ? cat.playbooks : cat.playbooks.filter(pb => pb.state === filter);
          if (pbs.length === 0) return null;
          return (
            <section key={cat.id}>
              <div className="eyebrow mb-2">{cat.name.toUpperCase()} · {pbs.length}</div>
              <div className="dcard" style={{padding:0}}>
                {pbs.map((pb, i) => (
                  <button key={pb.id} onClick={() => onOpen('playbook')} style={{
                    all:'unset', cursor:'pointer',
                    display:'grid',
                    gridTemplateColumns:'1.4fr 130px 130px 1fr 130px 80px',
                    gap:14, padding:'14px 18px', alignItems:'center',
                    borderBottom: i < pbs.length-1 ? '1px solid var(--hair-soft)' : 'none',
                    width:'100%', boxSizing:'border-box',
                  }}>
                    <div>
                      <div style={{fontSize:13.5, fontWeight:500, letterSpacing:'-.005em'}}>{pb.name}</div>
                      <div className="mono dim" style={{fontSize:10.5, marginTop:2}}>{pb.scope}</div>
                    </div>
                    <StatusPill status={pb.state} />
                    <AutonomyPill state={pb.autonomy === 'draft' ? 'observe' : pb.autonomy} />
                    <div className="mono" style={{fontSize:11, color: pb.coverage.includes('pass') ? 'var(--ok)' : 'var(--ink-mid)'}}>
                      {pb.coverage}
                    </div>
                    <div className="mono dim" style={{fontSize:10.5}}>
                      {pb.changed}<br />{pb.examples} examples
                    </div>
                    <div style={{textAlign:'right'}}>
                      <span className="mono" style={{fontSize:11, color:'var(--ink)'}}>OPEN →</span>
                    </div>
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
    <div className="stage">
      <PageHeader
        eyebrow="INSIGHTS · ASK CENDRA"
        title="Ask anything about your portfolio."
        lead="Cendra answers in plain English with evidence and suggested next steps. Click an evidence row to drill into the underlying decisions."
      />

      {/* Ask Cendra */}
      <div className="dcard" style={{padding: 0, marginBottom: 28}}>
        <div style={{padding:'18px 22px', borderBottom:'1px solid var(--hair-soft)', display:'flex', gap:12, alignItems:'center'}}>
          <span className="mono dim" style={{fontSize:10, letterSpacing:'.18em'}}>ASK</span>
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setAnswered(false); }}
            onKeyDown={e => { if (e.key === 'Enter') setAnswered(true); }}
            placeholder="e.g. Why did automation drop this week?"
            style={{
              flex:1, border:0, outline:0, background:'transparent',
              fontFamily:'var(--serif)', fontSize:22, lineHeight:1.3,
              color:'var(--ink)',
            }}
          />
          <Btn kind="primary" onClick={() => setAnswered(true)}>Ask Cendra</Btn>
        </div>

        <div style={{padding:'12px 22px', display:'flex', gap:6, flexWrap:'wrap'}}>
          <span className="mono dim" style={{fontSize:10, letterSpacing:'.18em', alignSelf:'center'}}>SUGGESTED ·</span>
          {I.suggested.map(s => (
            <button key={s} onClick={() => { setQ(s); setAnswered(true); }} className="btn btn-sm" style={{fontSize:11.5}}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {answered && q === I.answer_demo.question && (
        <section style={{marginBottom: 36}}>
          <div className="eyebrow mb-2">CENDRA'S ANSWER · 0.94 CONFIDENCE</div>
          <div className="dcard" style={{padding:'24px 28px'}}>
            <h2 style={{fontFamily:'var(--serif)', fontSize:30, lineHeight:1.2, fontWeight:400, letterSpacing:'-.01em', margin:'0 0 12px'}}>
              {I.answer_demo.headline}
            </h2>
            <p className="lead" style={{margin:'0 0 18px'}}>{I.answer_demo.detail}</p>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, border:'1px solid var(--hair)', borderRadius:4, overflow:'hidden'}}>
              {I.answer_demo.evidence.map((e, i) => (
                <div key={i} style={{
                  padding:'12px 16px', borderRight: i % 2 === 0 ? '1px solid var(--hair-soft)' : 'none',
                  borderBottom: i < 2 ? '1px solid var(--hair-soft)' : 'none',
                  background: 'var(--paper)',
                }}>
                  <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.16em', marginBottom:4}}>{e.kind.toUpperCase()}</div>
                  <div style={{fontSize:14, fontWeight:500, letterSpacing:'-.005em'}}>{e.value}</div>
                  {e.delta && <div className="mono dim" style={{fontSize:11, marginTop:2}}>{e.delta}</div>}
                </div>
              ))}
            </div>

            <div style={{display:'flex', gap:8, marginTop: 18, flexWrap:'wrap'}}>
              {I.answer_demo.next.map((n, i) => (
                <Btn key={i} size="sm" kind={i === 0 ? "primary" : "default"}>{n}</Btn>
              ))}
              <span className="grow" style={{flex:1}} />
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
  const [tab, setTab] = useState("hard_rules");

  const tabs = [
    { id: "hard_rules",  label: "Hard rules",       count: D3.hard_rules.length },
    { id: "permissions", label: "Permissions & roles", count: D3.team.length },
    { id: "data",        label: "Data sources",     count: D3.integrations.length },
    { id: "incidents",   label: "Incident review",  count: 0 },
    { id: "audit",       label: "Audit trail",      count: D2.audit.length },
    { id: "pii",         label: "PII & sensitive",  count: 4 },
  ];

  return (
    <div className="stage">
      <PageHeader
        eyebrow="TRUST CENTER"
        title="The safety surface."
        lead={<>Hard rules, never-auto policies, permissions, integration health, incident review, and an immutable audit trail. <b style={{color:'var(--ink)'}}>Trust is earned by what Cendra refuses to do.</b></>}
        right={
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <span className="mono" style={{fontSize:10.5, letterSpacing:'.16em', color:'var(--ok)'}}>● 0 INCIDENTS · 30D</span>
            <Btn kind="ghost" size="sm">Export audit · CSV</Btn>
          </div>
        }
      />

      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:22}}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cls("btn","btn-sm", tab===t.id && "btn-primary")}>
            {t.label} <span className="mono" style={{opacity:.6, marginLeft:4}}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "hard_rules" && (
        <>
          <SignalStrip items={[
            { label: "Hard rules · active", value: D3.hard_rules.length.toString() },
            { label: "Triggered · 7d", value: "11" },
            { label: "Bypassed", value: "0", tone: "ok" },
            { label: "Coverage", value: "100%", sub: "all sims passing", tone: "ok" },
          ]} />
          <div style={{height:18}} />
          <div className="dcard" style={{padding:0, overflow:'hidden'}}>
            {D3.hard_rules.map(r => <HardRuleCard key={r.id} r={r} />)}
          </div>
          <div style={{display:'flex', gap:8, marginTop:14, justifyContent:'flex-end'}}>
            <Btn kind="ghost" size="sm">Import rule set</Btn>
            <Btn size="sm">+ Add hard rule</Btn>
          </div>
        </>
      )}

      {tab === "permissions" && <TeamRolesView />}

      {tab === "data" && (
        <>
          <SectionHead eyebrow="DATA SOURCES & FALLBACKS" title="Where Cendra reads from." sub="If a source degrades, Cendra automatically downgrades the workflows that depend on it." />
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
            {D3.integrations.map(i => <IntegrationHealthCard key={i.id} i={i} />)}
          </div>
        </>
      )}

      {tab === "incidents" && (
        <QuietState
          title="No incidents in 30 days."
          body="An incident is any decision flagged by Golden Cases overnight, any rolled-back action, or any guest-reported issue tied to Cendra. The last incident was 23 days ago — read the post-mortem here."
          mono="LAST INCIDENT · 23D AGO · LATE CHECKOUT TIMING · RESOLVED"
        />
      )}

      {tab === "audit" && (
        <div className="dim" style={{fontSize:13}}>
          Open the full <button onClick={() => onOpen('audit')} className="btn btn-sm" style={{display:'inline-flex'}}>Audit Trail →</button> for the immutable decision log.
        </div>
      )}

      {tab === "pii" && (
        <div className="dcard" style={{padding:'18px 22px'}}>
          <div className="col gap-3">
            <PIIRow label="Guest phone numbers" mode="Masked in transcripts · plain in PMS only" />
            <PIIRow label="Card on file"        mode="Tokenized · never logged · charges via Stripe only" />
            <PIIRow label="Access codes"        mode="Released only after 12:00 on check-in day · never in audit" />
            <PIIRow label="ID documents"        mode="Stored in PMS · never sent to channel inbox" />
          </div>
        </div>
      )}
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

  const degraded = D3.integrations.filter(i => i.status !== 'connected');
  const open = D3.integrations.filter(i => i.open_incident);

  return (
    <div className="stage">
      <PageHeader
        eyebrow="TRUST · INTEGRATION HEALTH"
        title="Where Cendra is reading from right now."
        lead={<>{D3.integrations.length} live connections across PMS, channels, ops, payments. When one degrades, Cendra <b style={{color:'var(--ink)'}}>automatically demotes the affected workflows</b> and tells you what fell back.</>}
      />

      {open.length > 0 && (
        <div style={{
          padding:'14px 18px', marginBottom: 22,
          background:'var(--warn-soft)', border:'1px solid color-mix(in oklab, var(--warn), white 70%)',
          borderRadius:4,
        }}>
          <div className="mono" style={{fontSize:9.5, letterSpacing:'.18em', color:'var(--warn)', marginBottom:6}}>OPEN INCIDENT</div>
          <div style={{fontSize:14, fontWeight:500, marginBottom:4}}>{open[0].name} · {open[0].status}</div>
          <div style={{fontSize:12.5, color:'var(--ink-mid)'}}>{open[0].fallback}</div>
          <div style={{display:'flex', gap:8, marginTop:10}}>
            <Btn size="sm" kind="primary">Reconnect now</Btn>
            <Btn size="sm">Pause affected workflows</Btn>
            <Btn size="sm" kind="ghost">View affected guests →</Btn>
          </div>
        </div>
      )}

      <SignalStrip items={[
        { label: "Connected", value: D3.integrations.filter(i=>i.status==='connected').length.toString(), tone:"ok" },
        { label: "Degraded", value: degraded.length.toString(), tone: degraded.length > 0 ? "warn" : "ok" },
        { label: "Broken", value: "0", tone:"ok" },
        { label: "Workflows demoted", value: degraded.length > 0 ? "2" : "0", tone: degraded.length > 0 ? "warn" : "ok" },
        { label: "Affected properties", value: degraded.reduce((s, i) => s + i.affects_props, 0).toString() },
        { label: "Last full sync", value: "live", tone: "ok" },
      ]} />

      <div style={{height:24}} />

      {Object.entries(groups).map(([cat, items]) => (
        <section key={cat} style={{marginBottom: 28}}>
          <SectionHead eyebrow={cat.toUpperCase()} title={cat + " connections"} count={items.length} />
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
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
