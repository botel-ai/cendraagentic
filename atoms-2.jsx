// Cendra Agent OS — production atoms (v2)
// Higher-density, hospitality-native components.
const { Pill, AutonomyPill, ReasonPill, Seal, Btn, cls } = window.CendraAtoms;
const { ChannelChip, ExecutionMode } = window.CendraVision;

// ─── Status pill (PMS / channel / vendor states) ─────────────
function StatusPill({ status }) {
  const map = {
    connected:    { tone: "ok",   label: "Connected" },
    degraded:     { tone: "warn", label: "Degraded" },
    broken:       { tone: "risk", label: "Broken" },
    paused:       { tone: "info", label: "Paused" },
    unknown:      { tone: "info", label: "Unknown" },
    live:         { tone: "ok",   label: "Live" },
    draft:        { tone: "info", label: "Draft" },
    staging:      { tone: "warn", label: "Staging" },
    needs_review: { tone: "warn", label: "Needs review" },
  };
  const m = map[status] || { tone: "info", label: status };
  return <Pill tone={m.tone}>{m.label}</Pill>;
}

// ─── Operational state badge (waiting_user / vendor / cleaner / pms / etc) ─
function StateBadge({ state }) {
  const map = {
    waiting_user:    { tone: "warn", label: "Needs you" },
    waiting_guest:   { tone: "info", label: "Waiting · guest" },
    waiting_cleaner: { tone: "info", label: "Waiting · cleaner" },
    waiting_vendor:  { tone: "info", label: "Waiting · vendor" },
    waiting_pms:     { tone: "info", label: "Waiting · PMS" },
    blocked_policy:  { tone: "risk", label: "Blocked · policy" },
    running:         { tone: "ok",   label: "Running" },
  };
  const m = map[state] || { tone: "info", label: state };
  return <Pill tone={m.tone}>{m.label}</Pill>;
}

// ─── SLA timer ──────────────────────────────────────────────
function SLATimer({ minutes }) {
  // negative = overdue
  if (minutes == null) return <span className="mono dim" style={{fontSize:11}}>—</span>;
  const overdue = minutes < 0;
  const m = Math.abs(minutes);
  const text = m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;
  return (
    <span className="mono" style={{
      fontSize: 11,
      color: overdue ? 'var(--risk)' : minutes < 30 ? 'var(--warn)' : 'var(--ink-mid)',
      fontWeight: overdue ? 600 : 500,
      whiteSpace: 'nowrap',
    }}>
      {overdue ? '−' : ''}{text}{overdue ? ' over' : ' left'}
    </span>
  );
}

// ─── High-signal stat card (top of Today) ───────────────────
function SignalStat({ label, value, sub, tone, accent }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'risk' ? 'var(--risk)' : 'var(--ink)';
  return (
    <div style={{
      padding: '14px 16px',
      borderRight: '1px solid var(--hair-soft)',
      minWidth: 0,
      position: 'relative',
    }}>
      {accent && (
        <span style={{
          position:'absolute', top: 12, right: 12,
          width: 6, height: 6, borderRadius:'50%',
          background: color,
        }} />
      )}
      <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom:6, textTransform:'uppercase'}}>
        {label}
      </div>
      <div style={{
        fontFamily:'var(--sans)', fontSize:24, fontWeight:500,
        lineHeight:1, color,
        letterSpacing:'-.01em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {sub && <div className="mono dim" style={{fontSize:10.5, marginTop:6}}>{sub}</div>}
    </div>
  );
}

// ─── Portfolio filter bar ────────────────────────────────────
function PortfolioFilterBar({ value = {}, onChange }) {
  const D2 = window.CENDRA_DATA2;
  const filters = [
    { key: "scope",   label: "All properties",  options: ["All properties", ...D2.portfolio.regions.map(r => r.name)] },
    { key: "owner",   label: "Owner",           options: ["All owners",     ...D2.portfolio.owners.map(o => o.name)] },
    { key: "channel", label: "Channel",         options: ["All channels",   ...D2.portfolio.channels] },
    { key: "group",   label: "Group",           options: ["All groups",     ...D2.portfolio.groups.map(g => g.name)] },
    { key: "risk",    label: "Risk",            options: ["Any", "SLA risk", "High risk", "Never auto"] },
    { key: "wf",      label: "Workflow",        options: ["Any workflow", "Approvals", "Vendor", "Damage", "Refunds", "Upsells", "Missing info"] },
  ];
  return (
    <div style={{
      display:'flex', gap:6, flexWrap:'wrap',
      padding: '10px 14px',
      border:'1px solid var(--hair)',
      background: 'var(--card)',
      borderRadius: 4,
      alignItems:'center',
    }}>
      <span className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em', marginRight: 4}}>FILTER</span>
      {filters.map(f => (
        <select
          key={f.key}
          value={value[f.key] || f.options[0]}
          onChange={e => onChange && onChange(f.key, e.target.value)}
          style={{
            font: 'inherit',
            fontSize: 12,
            color: 'var(--ink)',
            border: '1px solid var(--hair)',
            background: 'var(--paper)',
            borderRadius: 3,
            padding: '4px 8px',
          }}
        >
          {f.options.map(o => <option key={o}>{o}</option>)}
        </select>
      ))}
      <span className="grow" style={{flex:1}} />
      <span className="mono dim" style={{fontSize:10.5}}>
        47 properties · 5 owners
      </span>
    </div>
  );
}

// ─── Workflow trust row (Autopilot v2) ──────────────────────
function WorkflowTrustRow({ wf, expanded, onToggle, onPromote }) {
  const isNever = wf.state === 'never';
  return (
    <div style={{
      borderBottom: '1px solid var(--hair-soft)',
      background: expanded ? 'color-mix(in oklab, var(--paper), white 35%)' : 'transparent',
    }}>
      <div style={{
        display:'grid',
        gridTemplateColumns: 'minmax(220px, 1.2fr) 130px 90px 90px 90px 110px 130px',
        gap: 14,
        padding: '12px 18px',
        alignItems: 'center',
        cursor: 'pointer',
      }} onClick={onToggle}>
        <div>
          <div style={{fontSize:13.5, fontWeight:500, letterSpacing:'-.005em'}}>{wf.name}</div>
          <div className="mono dim" style={{fontSize:10.5, marginTop:2}}>scope · {wf.scope} · {wf.default}</div>
        </div>
        <AutonomyPill state={wf.state} />
        <span className="mono" style={{fontSize:11.5, fontVariantNumeric:'tabular-nums'}}>{wf.samples || '—'}</span>
        <span className="mono" style={{fontSize:11.5, color: wf.override === '0.0%' ? 'var(--ok)' : wf.override === '—' ? 'var(--muted)' : 'var(--ink)'}}>{wf.override}</span>
        <span className="mono" style={{fontSize:11.5, color: wf.incidents === 0 ? 'var(--ok)' : 'var(--warn)'}}>{wf.incidents}</span>
        <span className="mono dim" style={{fontSize:10.5}}>{wf.last}</span>
        <div style={{textAlign:'right'}}>
          {wf.ready && !isNever ? (
            <Btn size="sm" kind="primary" onClick={(e) => { e.stopPropagation(); onPromote && onPromote(wf); }}>Promote →</Btn>
          ) : isNever ? (
            <span className="mono dim" style={{fontSize:10}}>PINNED</span>
          ) : (
            <Btn size="sm" kind="ghost">Manage</Btn>
          )}
        </div>
      </div>
      {expanded && (
        <div style={{padding:'0 18px 14px 18px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
          <div>
            <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom:4}}>WHY</div>
            <div className="dim" style={{fontSize:12.5, fontStyle:'italic'}}>{wf.why}</div>
          </div>
          <div style={{display:'flex', gap:8, justifyContent:'flex-end', alignItems:'flex-end'}}>
            <Btn size="sm" kind="ghost">Hold window</Btn>
            <Btn size="sm" kind="ghost">View cases →</Btn>
            {!isNever && <Btn size="sm" kind="ghost">Demote</Btn>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Integration health card ────────────────────────────────
function IntegrationHealthCard({ i, onOpen }) {
  const tone = i.status === 'connected' ? 'ok' : i.status === 'degraded' ? 'warn' : 'risk';
  return (
    <div className="dcard" style={{padding:'16px 18px'}}>
      <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12}}>
        <div style={{minWidth:0}}>
          <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.16em', marginBottom:4}}>
            {i.category.toUpperCase()}
          </div>
          <div style={{fontSize:14, fontWeight:500, letterSpacing:'-.005em'}}>{i.name}</div>
          <div className="mono dim mt-1" style={{fontSize:10.5}}>last sync · {i.last_sync}</div>
        </div>
        <StatusPill status={i.status} />
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12, fontSize:11.5}}>
        <div>
          <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.16em'}}>PROPERTIES</div>
          <div style={{fontSize:13, color:'var(--ink)', marginTop:2}}>{i.affects_props}</div>
        </div>
        <div>
          <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.16em'}}>WORKFLOWS</div>
          <div style={{fontSize:13, color:'var(--ink)', marginTop:2}}>{i.affects_workflows.length === 1 && i.affects_workflows[0] === 'all' ? 'All' : `${i.affects_workflows.length} affected`}</div>
        </div>
      </div>

      {i.fallback !== '—' && (
        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          background: 'var(--warn-soft)',
          border: '1px solid color-mix(in oklab, var(--warn), white 75%)',
          borderRadius: 4,
        }}>
          <div className="mono" style={{fontSize:9.5, letterSpacing:'.18em', color:'var(--warn)', marginBottom:4}}>CENDRA FALLBACK</div>
          <div style={{fontSize:12, lineHeight:1.5, color:'var(--ink)'}}>{i.fallback}</div>
        </div>
      )}

      <div style={{display:'flex', gap:6, marginTop:12, alignItems:'center'}}>
        <Btn size="sm">Reconnect</Btn>
        <Btn size="sm" kind="ghost">Pause workflows</Btn>
        <span className="grow" />
        {i.open_incident && <Pill tone="risk">incident open</Pill>}
      </div>
    </div>
  );
}

// ─── Hard rule card ─────────────────────────────────────────
function HardRuleCard({ r }) {
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 200px',
      gap:18, padding:'16px 20px',
      borderBottom:'1px solid var(--hair-soft)',
      alignItems:'flex-start',
    }}>
      <div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
          <span className="mono" style={{fontSize:9.5, letterSpacing:'.18em', color:'var(--risk)'}}>HARD RULE · NEVER AUTO</span>
          <Pill tone="risk">{r.scope}</Pill>
        </div>
        <div style={{fontFamily:'var(--serif)', fontSize:18, lineHeight:1.3, fontWeight:400, color:'var(--ink)', letterSpacing:'-.005em'}}>
          {r.text}
        </div>
        <div className="mono dim" style={{fontSize:10.5, marginTop:8, lineHeight:1.7}}>
          OWNER · {r.owner}  ·  CREATED · {r.created}  ·  LAST TRIGGERED · {r.last_triggered}<br />
          AFFECTS · {r.workflows.join(', ')}  ·  COVERAGE · {r.coverage}
        </div>
      </div>
      <div style={{display:'flex', gap:6, justifyContent:'flex-end', flexWrap:'wrap'}}>
        <Btn size="sm" kind="ghost">Edit</Btn>
        <Btn size="sm" kind="ghost">Disable</Btn>
        <Btn size="sm" kind="ghost">Audit</Btn>
      </div>
    </div>
  );
}

// ─── Knowledge gap card (compact) ───────────────────────────
function KnowledgeGapCard({ gap, onResolve }) {
  return (
    <div className="dcard" style={{padding:'14px 18px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12}}>
        <div style={{minWidth:0}}>
          <div className="mono dim" style={{fontSize:10, letterSpacing:'.16em', marginBottom:4}}>
            {gap.scope.toUpperCase()} · {gap.fact.toUpperCase()}
          </div>
          <div style={{fontSize:14, lineHeight:1.4}}>
            Guests asked <b>{gap.asks}×</b> in 30 days. Cendra does not know the answer.
          </div>
        </div>
        <Pill tone="info">{gap.asks} asks</Pill>
      </div>
      <div style={{display:'flex', gap:6, marginTop:12, flexWrap:'wrap'}}>
        <Btn size="sm" kind="primary" onClick={onResolve}>Confirm in 1 tap</Btn>
        <Btn size="sm">Internal only</Btn>
        <Btn size="sm" kind="ghost">Ask owner</Btn>
        <span className="grow" />
        <Btn size="sm" kind="ghost">Never answer auto</Btn>
      </div>
    </div>
  );
}

// ─── Property fact row (Property Brain detail) ──────────────
function PropertyFactRow({ f }) {
  const stateMap = {
    verified: { tone: "ok",   label: "Verified" },
    missing:  { tone: "info", label: "Missing" },
    conflict: { tone: "warn", label: "Conflict" },
    stale:    { tone: "info", label: "Stale" },
  };
  const s = stateMap[f.state] || stateMap.verified;
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns: '170px 1fr 140px 90px 100px',
      gap: 14, padding:'12px 18px',
      borderBottom:'1px solid var(--hair-soft)',
      alignItems:'center',
    }}>
      <div style={{fontSize:13, fontWeight:500}}>{f.fact}</div>
      <div style={{fontSize:13, color:'var(--ink-mid)', lineHeight:1.4}}>{f.value}</div>
      <div className="mono dim" style={{fontSize:10.5, lineHeight:1.4}}>
        {f.source}<br /><span style={{opacity:.6}}>{f.fresh}</span>
      </div>
      <Pill tone={s.tone}>{s.label}</Pill>
      <div className="mono dim" style={{fontSize:10}}>
        {f.visible === 'guest' ? 'GUEST OK' : f.visible === 'internal' ? 'INTERNAL' : '—'}
      </div>
    </div>
  );
}

// ─── Team assignment card (mini) ────────────────────────────
function TeamAssignmentCard({ users, label }) {
  return (
    <div>
      <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom:6}}>{label}</div>
      <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
        {users.map(u => (
          <div key={u.id} title={`${u.name} · ${u.role}`} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'4px 8px 4px 4px',
            border:'1px solid var(--hair)',
            background: u.on_shift ? 'var(--card)' : 'var(--paper)',
            opacity: u.on_shift ? 1 : 0.55,
            borderRadius: 999,
            fontSize: 11.5,
          }}>
            <span style={{
              width: 18, height: 18, borderRadius:'50%',
              background:'var(--ink)', color:'var(--paper)',
              display:'grid', placeItems:'center',
              fontFamily:'var(--serif)', fontStyle:'italic', fontSize:10.5,
            }}>{u.avatar}</span>
            <span>{u.name.split(' ')[0]}</span>
            <span className="mono dim" style={{fontSize:9.5}}>· {u.role.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Live activity milestone ────────────────────────────────
function LiveActivityMilestone({ kind, label, time, tone, mono }) {
  const dot = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'risk' ? 'var(--risk)' : 'var(--info)';
  return (
    <div style={{display:'grid', gridTemplateColumns:'12px 1fr auto', gap:10, alignItems:'center', padding:'6px 0'}}>
      <span style={{
        width: 8, height: 8, borderRadius:'50%', background: dot,
        boxShadow: `0 0 0 3px var(--paper-2)`,
      }} />
      <div style={{fontSize:12.5, color:'var(--ink-mid)'}}>{label}</div>
      <div className="mono dim" style={{fontSize:10.5}}>{time}{mono ? ' · ' + mono : ''}</div>
    </div>
  );
}

// ─── Stat strip (signals) ───────────────────────────────────
function SignalStrip({ items }) {
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
      border:'1px solid var(--hair)',
      borderRadius: 4,
      background: 'var(--card)',
      overflow:'hidden',
    }}>
      {items.map((s, i) => (
        <div key={i} style={{
          padding:'14px 16px',
          borderRight: i < items.length - 1 ? '1px solid var(--hair-soft)' : 'none',
          minWidth: 0,
        }}>
          <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.16em', marginBottom:6, textTransform:'uppercase'}}>
            {s.label}
          </div>
          <div style={{
            fontFamily:'var(--sans)', fontSize:22, fontWeight:500,
            lineHeight:1, color: s.tone === 'ok' ? 'var(--ok)' : s.tone === 'warn' ? 'var(--warn)' : s.tone === 'risk' ? 'var(--risk)' : 'var(--ink)',
            letterSpacing:'-.01em', fontVariantNumeric:'tabular-nums',
          }}>{s.value}</div>
          {s.sub && <div className="mono dim" style={{fontSize:10.5, marginTop:5}}>{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Why-drawer level switch (5 levels of disclosure) ───────
function WhyLevels({ level, onChange }) {
  const lv = [
    { id: 1, label: "Plain" },
    { id: 2, label: "Evidence" },
    { id: 3, label: "Decision path" },
    { id: 4, label: "Audit" },
    { id: 5, label: "Trace" },
  ];
  return (
    <div style={{display:'flex', gap:0, border:'1px solid var(--hair)', borderRadius:4, background:'var(--paper)', overflow:'hidden'}}>
      {lv.map(l => (
        <button key={l.id} onClick={() => onChange(l.id)} style={{
          all:'unset', cursor:'pointer',
          padding:'6px 10px', fontSize:11,
          background: level === l.id ? 'var(--ink)' : 'transparent',
          color: level === l.id ? 'var(--paper)' : 'var(--ink-mid)',
          fontFamily: 'var(--mono)', letterSpacing:'.04em',
          borderRight: '1px solid var(--hair-soft)',
        }}>
          {String(l.id).padStart(2,'0')} {l.label}
        </button>
      ))}
    </div>
  );
}

// ─── Today section header (compact) ─────────────────────────
function SectionHead({ eyebrow, title, sub, count, action }) {
  return (
    <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:10, gap:12}}>
      <div>
        <div className="mono dim" style={{fontSize:10, letterSpacing:'.18em', marginBottom:4}}>
          {eyebrow}{count != null ? ` · ${count}` : ''}
        </div>
        <h2 style={{fontFamily:'var(--sans)', fontSize:18, fontWeight:600, lineHeight:1.2, margin:0, letterSpacing:'-.01em'}}>
          {title}
        </h2>
        {sub && <div className="dim" style={{fontSize:12.5, marginTop:3}}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

window.CendraAtoms2 = {
  StatusPill, StateBadge, SLATimer, SignalStat, PortfolioFilterBar,
  WorkflowTrustRow, IntegrationHealthCard, HardRuleCard, KnowledgeGapCard,
  PropertyFactRow, TeamAssignmentCard, LiveActivityMilestone, SignalStrip,
  WhyLevels, SectionHead,
};
