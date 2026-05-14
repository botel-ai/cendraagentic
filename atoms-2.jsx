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

// ─── Stay Health badge ─────────────────────────────────────
// Outcome signal — independent of action signal (StatusPill).
// "How is this stay going overall?" not "what does Cendra need from me?"
// Mirrors Brain Engine's risk rollup: healthy → critical with closed as terminal.
const STAY_HEALTH_MAP = {
  healthy:         { color: '#00A699', label: 'Healthy',         glyph: '◆' },
  needs_attention: { color: '#FFB400', label: 'Needs attention', glyph: '◆' },
  at_risk:         { color: '#FF8A00', label: 'At risk',         glyph: '◆' },
  critical:        { color: '#FF385C', label: 'Critical',        glyph: '◆' },
  closed:          { color: '#9CA3AF', label: 'Closed',          glyph: '○' },
};

function deriveStayHealth(g) {
  if (!g) return 'healthy';
  if (g.health) return g.health;
  // Stay over
  if (typeof g.nights_done === 'number' && typeof g.nights_total === 'number' && g.nights_done >= g.nights_total) return 'closed';
  // Hard negative sentiment overrides everything
  if (g.sentiment === 'hot' || g.sentiment === 'angry' || g.complaints || g.escalated) return 'critical';
  // Overdue SLA on a needs-you item = critical
  if (g.status === 'needs_you' && typeof g.sla_min === 'number' && g.sla_min < 0) return 'critical';
  // Tight SLA on a needs-you item = at risk
  if (g.status === 'needs_you' && typeof g.sla_min === 'number' && g.sla_min < 30) return 'at_risk';
  // Other needs-you items = needs attention
  if (g.status === 'needs_you') return 'needs_attention';
  // Waiting state with overdue dependency = at risk
  if (g.status === 'waiting' && typeof g.sla_min === 'number' && g.sla_min < 0) return 'at_risk';
  // Waiting otherwise = needs attention (something is pending)
  if (g.status === 'waiting') return 'needs_attention';
  return 'healthy';
}

// Surface the active signals that produced the current Stay Health.
// Audit §7 #5: derivation tooltip with sources.
function deriveStayHealthSignals(g) {
  const out = [];
  if (!g) return out;
  if (typeof g.nights_done === 'number' && typeof g.nights_total === 'number' && g.nights_done >= g.nights_total) {
    out.push({ kind: 'stage', label: 'Stay is over — checkout reached', weight: 'binding' });
    return out;
  }
  if (g.escalated)             out.push({ kind: 'escalation', label: 'Active escalation', weight: 'binding' });
  if (g.complaints)            out.push({ kind: 'complaint', label: 'Open complaint', weight: 'binding' });
  if (g.sentiment === 'hot' || g.sentiment === 'angry')
    out.push({ kind: 'sentiment', label: `Sentiment: ${g.sentiment}`, weight: 'binding' });
  if (g.status === 'needs_you' && typeof g.sla_min === 'number' && g.sla_min < 0)
    out.push({ kind: 'sla', label: `SLA breached · ${Math.abs(g.sla_min)}m overdue`, weight: 'binding' });
  else if (g.status === 'needs_you' && typeof g.sla_min === 'number' && g.sla_min < 30)
    out.push({ kind: 'sla', label: `SLA tight · ${g.sla_min}m left`, weight: 'major' });
  else if (typeof g.sla_min === 'number')
    out.push({ kind: 'sla', label: `SLA: ${g.sla_min < 0 ? Math.abs(g.sla_min) + 'm overdue' : g.sla_min + 'm left'}`, weight: g.sla_min < 0 ? 'major' : 'minor' });
  if (g.status === 'needs_you')  out.push({ kind: 'queue',     label: 'Needs your decision', weight: 'major' });
  else if (g.status === 'waiting') out.push({ kind: 'queue',   label: `Waiting · ${g.status_reason || 'dependency'}`, weight: 'minor' });
  if (g.sentiment && g.sentiment !== 'hot' && g.sentiment !== 'angry')
    out.push({ kind: 'sentiment', label: `Sentiment: ${g.sentiment}`, weight: 'minor' });
  if (g.confidence != null && g.confidence < 0.7)
    out.push({ kind: 'confidence', label: `Low confidence (${(g.confidence * 100).toFixed(0)}%)`, weight: 'minor' });
  if (out.length === 0) out.push({ kind: 'stage', label: 'Nothing pending · routine running', weight: 'binding' });
  return out;
}

const SIGNAL_KIND_META = {
  stage:       { color: '#374151', label: 'STAGE'       },
  sla:         { color: '#FF385C', label: 'SLA'         },
  queue:       { color: '#FFB400', label: 'QUEUE'       },
  sentiment:   { color: '#7C3AED', label: 'SENTIMENT'   },
  complaint:   { color: '#FF385C', label: 'COMPLAINT'   },
  escalation:  { color: '#FF385C', label: 'ESCALATION'  },
  confidence:  { color: '#475569', label: 'CONFIDENCE'  },
};

function StayHealthBadge({ health, size, signals }) {
  const m = STAY_HEALTH_MAP[health] || STAY_HEALTH_MAP.healthy;
  const [showTip, setShowTip] = useState(false);
  const hasTip = Array.isArray(signals) && signals.length > 0;

  const inner = (() => {
    if (size === 'lg') {
      return (
        <div style={{
          display:'inline-flex', alignItems:'center', gap: 8,
          padding:'6px 12px',
          background: `${m.color}14`,
          border: `1px solid ${m.color}40`,
          borderRadius: 999,
          fontFamily:'var(--mono)', fontSize: 11.5, letterSpacing:'.08em',
          color: m.color, fontWeight: 600, textTransform:'uppercase',
          cursor: hasTip ? 'help' : 'default',
        }}>
          <span style={{fontSize: 12, lineHeight: 1}}>{m.glyph}</span>
          <span>{m.label}</span>
          {hasTip && <span style={{fontSize: 10, opacity: .55, marginLeft: 2}}>ⓘ</span>}
        </div>
      );
    }
    if (size === 'inline') {
      return (
        <span style={{
          display:'inline-flex', alignItems:'center', gap: 4,
          fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.06em',
          color: m.color, fontWeight: 600, textTransform:'uppercase',
          cursor: hasTip ? 'help' : 'default',
        }}>
          <span style={{fontSize: 10, lineHeight: 1}}>{m.glyph}</span>
          <span>{m.label}</span>
        </span>
      );
    }
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', gap: 5,
        padding:'2px 7px',
        background: `${m.color}10`,
        borderRadius: 4,
        fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.06em',
        color: m.color, fontWeight: 600, textTransform:'uppercase',
        cursor: hasTip ? 'help' : 'default',
      }}>
        <span style={{fontSize: 9, lineHeight: 1}}>{m.glyph}</span>
        <span>{m.label}</span>
      </span>
    );
  })();

  if (!hasTip) return inner;

  return (
    <span
      style={{position:'relative', display:'inline-block'}}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onClick={(e) => { e.stopPropagation(); setShowTip(v => !v); }}
    >
      {inner}
      {showTip && (
        <div style={{
          position:'absolute', top: 'calc(100% + 6px)', left: 0,
          minWidth: 280, maxWidth: 360,
          background:'#ffffff',
          border:'1px solid var(--hair)', borderRadius: 10,
          boxShadow:'0 8px 28px rgba(0,0,0,.10), 0 1px 3px rgba(0,0,0,.06)',
          padding:'12px 14px', zIndex: 30,
          color:'var(--ink)', cursor:'default',
        }}
        onClick={(e) => e.stopPropagation()}>
          <div className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted)', marginBottom: 8, textTransform:'uppercase', fontWeight: 600}}>
            Why this state · {signals.length} signal{signals.length > 1 ? 's' : ''}
          </div>
          <div style={{display:'grid', gap: 8}}>
            {signals.map((sig, i) => {
              const km = SIGNAL_KIND_META[sig.kind] || SIGNAL_KIND_META.stage;
              const weightBg = sig.weight === 'binding' ? '#FF385C'
                            : sig.weight === 'major'   ? '#FFB400'
                            : '#9CA3AF';
              return (
                <div key={i} style={{display:'grid', gridTemplateColumns:'10px 84px 1fr', gap: 8, alignItems:'baseline'}}>
                  <span style={{width: 6, height: 6, borderRadius: 999, background: weightBg, marginTop: 5}} />
                  <span className="mono" style={{fontSize: 9, letterSpacing:'.12em', color: km.color, fontWeight: 700}}>{km.label}</span>
                  <span style={{fontSize: 12, color:'var(--ink-mid)', lineHeight: 1.4}}>{sig.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mono" style={{fontSize: 9.5, letterSpacing:'.10em', color:'var(--muted-2)', marginTop: 10, textTransform:'uppercase', borderTop:'1px solid var(--hair-soft)', paddingTop: 8}}>
            <span style={{color:'#FF385C'}}>●</span> binding · <span style={{color:'#FFB400'}}>●</span> major · <span style={{color:'#9CA3AF'}}>●</span> minor
          </div>
        </div>
      )}
    </span>
  );
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

// ─── Stat — canonical micro stat block ──────────────────────
// Replaces MicroStat / MicroStatBlock / MicroStatBlock2 with one impl.
// `tone` ∈ ok | warn | risk | info | default. `accent` accepted as a
// legacy alias for `tone`. `sub` is optional second line below the label.
function Stat({ value, label, sub, tone, accent }) {
  const t = tone || accent;
  const color = t === 'ok'   ? 'var(--ok)'
              : t === 'warn' ? 'var(--warn)'
              : t === 'risk' ? 'var(--risk)'
              : t === 'info' ? 'var(--info)'
              : 'var(--ink)';
  return (
    <div>
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 22, fontWeight: 500,
        color, lineHeight: 1.1, letterSpacing: '-.015em',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      <div className="mono" style={{
        fontSize: 10, letterSpacing: '.12em', color: 'var(--muted)',
        textTransform: 'uppercase', marginTop: 4, fontWeight: 500,
      }}>{label}</div>
      {sub && <div className="mono" style={{fontSize: 10, color: 'var(--muted-2)', marginTop: 2}}>{sub}</div>}
    </div>
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
// Derive a 0-100 trust score from samples/override/incidents.
// Brain Engine's TrustMeterService combines volume, override rate, and incidents.
function deriveTrust(wf) {
  if (typeof wf.trust === 'number') return Math.max(0, Math.min(100, wf.trust));
  const overrideRate = parseFloat(String(wf.override || '0').replace('%','')) || 0;
  const incidents    = wf.incidents || 0;
  const samples      = wf.samples || 0;
  const sampleScore     = Math.min(55, samples / 5);
  const overridePenalty = overrideRate * 4;
  const incidentPenalty = incidents * 18;
  return Math.max(0, Math.min(100, sampleScore + 45 - overridePenalty - incidentPenalty));
}

function deriveCriteria(wf, trust) {
  if (wf.criteria) return wf.criteria;
  const s = wf.samples || 0;
  const inc = wf.incidents || 0;
  const need = wf.state === 'semi' ? 100 : 50;
  if (wf.state === 'autopilot') return `${s} cases · stable · 0 incidents 90d`;
  if (wf.frozen) return `Frozen at ${Math.round(trust)} · operator hold`;
  if (wf.ready) return `${s}/${need} cases · pattern stable · ready to promote`;
  if (inc > 0) return `${s} cases · ${inc} incident${inc > 1 ? 's' : ''} · holding`;
  const more = Math.max(0, need - s);
  if (more > 0) return `${s}/${need} cases · ${more} more for next tier`;
  return `${s} cases · observing`;
}

function TrustMeter({ score, frozen, state }) {
  const pct = Math.max(0, Math.min(100, score));
  // Threshold bands (Brain Engine's tier promotion thresholds, illustrative)
  const bands = [
    { start: 0,   end: 25,  color: '#FECACA' },  // red
    { start: 25,  end: 50,  color: '#FED7AA' },  // orange
    { start: 50,  end: 75,  color: '#FEF3C7' },  // amber
    { start: 75,  end: 100, color: '#BBF7D0' },  // green
  ];
  // marker color reflects which band the score lands in
  const markerColor = frozen ? '#6B7280'
                    : pct >= 75 ? '#00A699'
                    : pct >= 50 ? '#FFB400'
                    : pct >= 25 ? '#FF8A00'
                    : '#FF385C';
  return (
    <div style={{position:'relative', width: '100%', height: 6, borderRadius: 999, background:'var(--hair-soft)', overflow:'visible'}}>
      {/* bands */}
      <div style={{
        position:'absolute', inset: 0, borderRadius: 999, overflow:'hidden',
        display:'flex',
      }}>
        {bands.map((b, i) => (
          <div key={i} style={{
            flex: b.end - b.start,
            background: b.color,
            opacity: frozen ? 0.35 : 0.75,
          }} />
        ))}
      </div>
      {/* threshold ticks */}
      {[25, 50, 75].map(t => (
        <div key={t} style={{
          position:'absolute', left: `${t}%`, top: -2, width: 1, height: 10,
          background: 'rgba(0,0,0,.20)', transform:'translateX(-.5px)',
        }} />
      ))}
      {/* marker */}
      <div style={{
        position:'absolute',
        left: `${pct}%`,
        top: '50%',
        width: 14, height: 14,
        marginLeft: -7, marginTop: -7,
        borderRadius: 999,
        background: markerColor,
        border: `2px solid ${frozen ? '#6B7280' : '#ffffff'}`,
        boxShadow: '0 1px 3px rgba(0,0,0,.18)',
        zIndex: 2,
      }} />
    </div>
  );
}

function WorkflowTrustRow({ wf, expanded, onToggle, onPromote }) {
  const isNever  = wf.state === 'never';
  const frozen   = !!wf.frozen;
  const trust    = deriveTrust(wf);
  const criteria = deriveCriteria(wf, trust);
  return (
    <div style={{
      borderBottom: '1px solid var(--hair-soft)',
      background: expanded ? 'color-mix(in oklab, var(--paper), white 35%)' : 'transparent',
    }}>
      <div style={{
        display:'grid',
        gridTemplateColumns: 'minmax(260px, 1.4fr) 200px 110px 90px 90px 130px',
        gap: 14,
        padding: '14px 18px',
        alignItems: 'center',
        cursor: 'pointer',
      }} onClick={onToggle}>
        <div style={{minWidth: 0}}>
          <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 4}}>
            <div style={{fontSize:13.5, fontWeight:500, letterSpacing:'-.005em'}}>{wf.name}</div>
            {frozen && (
              <span style={{
                fontFamily:'var(--mono)', fontSize: 9, letterSpacing:'.12em',
                color:'#6B7280', fontWeight: 700, textTransform:'uppercase',
                padding:'1px 6px', borderRadius: 3,
                background:'rgba(107,114,128,.10)', border:'1px solid rgba(107,114,128,.25)',
              }}>FROZEN</span>
            )}
          </div>
          <div className="mono dim" style={{fontSize:10.5, marginBottom: 4}}>scope · {wf.scope} · {wf.default}</div>
          <div className="mono" style={{fontSize: 10.5, color:'var(--ink-mid)', letterSpacing:'.02em'}}>
            {criteria}
          </div>
        </div>
        {/* Trust meter column */}
        <div style={{display:'flex', flexDirection:'column', gap: 4}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <span className="mono dim" style={{fontSize: 9, letterSpacing:'.16em'}}>TRUST</span>
            <span className="mono" style={{fontSize: 12, fontWeight: 600, fontVariantNumeric:'tabular-nums', color: frozen ? 'var(--muted)' : 'var(--ink)'}}>{Math.round(trust)}</span>
          </div>
          <TrustMeter score={trust} frozen={frozen} state={wf.state} />
        </div>
        <AutonomyPill state={wf.state} />
        <span className="mono" style={{fontSize:11.5, color: wf.override === '0.0%' ? 'var(--ok)' : wf.override === '—' ? 'var(--muted)' : 'var(--ink)'}}>{wf.override}</span>
        <span className="mono" style={{fontSize:11.5, color: wf.incidents === 0 ? 'var(--ok)' : 'var(--warn)'}}>{wf.incidents}</span>
        <div style={{textAlign:'right'}}>
          {frozen ? (
            <Btn size="sm" kind="ghost" onClick={(e) => e.stopPropagation()}>Unfreeze</Btn>
          ) : wf.ready && !isNever ? (
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
            {!isNever && !frozen && <Btn size="sm" kind="ghost">Freeze</Btn>}
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
  const [witnessOpen, setWitnessOpen] = useState(false);
  // Z3 SMT verifier proves owner-policy DSL rules consistent with the
  // active rule set. Witness embeds in the rationale. Audit §3.8 + §8.1 #2.
  const z3 = r.z3 || {
    verified: true,
    last_check: "Today 03:14",
    against: 6,
    witness: `(set-option :produce-models true)\n(declare-fun stay_nights () Int)\n(assert (>= stay_nights 31))\n(assert (not (= stay_nights 14)))\n(check-sat)\n; result: unsat — no contradiction with policy ${r.id || 'this rule'}`,
  };
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 200px',
      gap:18, padding:'16px 20px',
      borderBottom:'1px solid var(--hair-soft)',
      alignItems:'flex-start',
    }}>
      <div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap'}}>
          <span className="mono" style={{fontSize:9.5, letterSpacing:'.18em', color:'var(--risk)'}}>HARD RULE · NEVER AUTO</span>
          <Pill tone="risk">{r.scope}</Pill>
          {z3.verified && (
            <button onClick={() => setWitnessOpen(o => !o)} style={{
              all:'unset', cursor:'pointer',
              padding:'2px 7px', borderRadius: 4,
              background:'rgba(0,166,153,.10)', border:'1px solid rgba(0,166,153,.30)',
              fontFamily:'var(--mono)', fontSize: 9.5, letterSpacing:'.10em',
              color:'#00867E', fontWeight: 700, textTransform:'uppercase',
              display:'inline-flex', alignItems:'center', gap: 4,
            }} title="Mathematically verified — Z3 SMT solver">
              ✓ Z3 verified
              <span style={{fontSize: 8, opacity: .65}}>{witnessOpen ? '▲' : '▼'}</span>
            </button>
          )}
        </div>
        <div style={{fontFamily:'var(--serif)', fontSize:18, lineHeight:1.3, fontWeight:400, color:'var(--ink)', letterSpacing:'-.005em'}}>
          {r.text}
        </div>
        <div className="mono dim" style={{fontSize:10.5, marginTop:8, lineHeight:1.7}}>
          OWNER · {r.owner}  ·  CREATED · {r.created}  ·  LAST TRIGGERED · {r.last_triggered}<br />
          AFFECTS · {r.workflows.join(', ')}  ·  COVERAGE · {r.coverage}
        </div>
        {witnessOpen && (
          <div style={{
            marginTop: 12, padding:'12px 14px', borderRadius: 8,
            background:'var(--paper-2)', border:'1px solid var(--hair-soft)',
          }}>
            <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 6}}>
              <span className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'#00867E', fontWeight: 700, textTransform:'uppercase'}}>
                Z3 SMT witness · UNSAT
              </span>
              <span className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.04em'}}>
                checked {z3.last_check} · against {z3.against} other rules · 0 contradictions
              </span>
            </div>
            <pre style={{
              margin: 0, padding:'10px 12px', borderRadius: 6,
              background:'#0F172A', color:'#E2E8F0',
              fontFamily:'var(--mono)', fontSize: 11, lineHeight: 1.5,
              overflowX: 'auto', whiteSpace: 'pre',
            }}>{z3.witness}</pre>
            <div className="mono" style={{fontSize: 10, color:'var(--muted-2)', letterSpacing:'.06em', marginTop: 8}}>
              Replayable witness · embed in regulator-facing audit pack
            </div>
          </div>
        )}
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

// ─── Channel chip — color-coded per channel ─────────────────
const CHANNEL_META = {
  airbnb:    { label: "Airbnb",    color: "#FF385C", short: "AIRBNB"    },
  booking:   { label: "Booking",   color: "#003580", short: "BOOKING"   },
  expedia:   { label: "Expedia",   color: "#FDB827", short: "EXPEDIA"   },
  vrbo:      { label: "VRBO",      color: "#3D67B1", short: "VRBO"      },
  direct:    { label: "Direct",    color: "#222222", short: "DIRECT"    },
  whatsapp:  { label: "WhatsApp",  color: "#25D366", short: "WHATSAPP"  },
  instagram: { label: "Instagram", color: "#E1306C", short: "INSTAGRAM" },
  messenger: { label: "Messenger", color: "#0084FF", short: "MESSENGER" },
  sms:       { label: "SMS",       color: "#717171", short: "SMS"       },
  phone:     { label: "Phone",     color: "#B92929", short: "PHONE"     },
  voice:     { label: "Voice",     color: "#B92929", short: "VOICE"     },
  email:     { label: "Email",     color: "#5E6AD2", short: "EMAIL"     },
  slack:     { label: "Slack",     color: "#4A154B", short: "SLACK"     },
  system:    { label: "System",    color: "#717171", short: "SYSTEM"    },
};

function MsgChannelChip({ channel, sub, time }) {
  const m = CHANNEL_META[channel] || CHANNEL_META.direct;
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap: 6,
      fontFamily:'var(--mono)', fontSize: 9.5, letterSpacing:'.14em',
      color:'var(--muted)', textTransform:'uppercase', fontWeight: 500,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 2, background: m.color,
      }} />
      <span style={{color:'var(--ink)', fontWeight: 600}}>{m.short}</span>
      {time && <><span style={{color:'var(--muted-2)'}}>·</span><span>{time}</span></>}
      {sub && <><span style={{color:'var(--muted-2)'}}>·</span><span>{sub}</span></>}
    </div>
  );
}

window.CendraAtoms2 = {
  Stat, StatusPill, StateBadge, SLATimer, SignalStat, PortfolioFilterBar,
  WorkflowTrustRow, TrustMeter, deriveTrust, deriveCriteria,
  IntegrationHealthCard, HardRuleCard, KnowledgeGapCard,
  PropertyFactRow, TeamAssignmentCard, LiveActivityMilestone, SignalStrip,
  WhyLevels, SectionHead,
  StayHealthBadge, deriveStayHealth, deriveStayHealthSignals, STAY_HEALTH_MAP,
  MsgChannelChip, CHANNEL_META,
};
