// Cendra Agent OS — vision-doc additions
const { Pill, AutonomyPill, Seal, Btn } = window.CendraAtoms;

// ─── Channel chip ──────────────────────────────────────────────
function ChannelChip({ channel, size = "sm" }) {
  const map = {
    "Airbnb":      { mark: "Ⓐ", tint: "#c4633a" },
    "Booking.com": { mark: "Ⓑ", tint: "#2e5a8a" },
    "Booking":     { mark: "Ⓑ", tint: "#2e5a8a" },
    "Expedia":     { mark: "Ⓔ", tint: "#7a4a8a" },
    "WhatsApp":    { mark: "Ⓦ", tint: "#1f8a5b" },
    "VRBO":        { mark: "Ⓥ", tint: "#3a6a8a" },
    "Direct":      { mark: "Ⓓ", tint: "#1f2a24" },
    "Multi":       { mark: "✛",  tint: "#7a7468" },
    "—":           { mark: "—",  tint: "#9a948c" },
  };
  const m = map[channel] || { mark: "·", tint: "#7a7468" };
  const px = size === "md" ? { font: 11.5, pad: "4px 8px" } : { font: 10.5, pad: "2px 7px" };
  return (
    <span className="mono" style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: px.pad, fontSize: px.font, letterSpacing: ".06em",
      border: "1px solid var(--hair)", borderRadius: 3,
      background: "var(--paper)", color: "var(--ink-mid)",
      whiteSpace: "nowrap",
    }}>
      <span aria-hidden style={{ color: m.tint, fontSize: px.font + 1 }}>{m.mark}</span>
      <span>{channel}</span>
    </span>
  );
}

// ─── Execution mode badge (5-state) ────────────────────────────
function ExecutionMode({ mode }) {
  const map = {
    blocked:   { tone: "risk", label: "Blocked",  hint: "Cannot run" },
    draft:     { tone: "info", label: "Draft",    hint: "Cendra writes, you send" },
    approval:  { tone: "warn", label: "Approval", hint: "You authorize" },
    semi:      { tone: "info", label: "Semi-auto", hint: "5-min cancel window" },
    autopilot: { tone: "ok",   label: "Autopilot", hint: "Cendra runs it" },
  };
  const m = map[mode] || map.approval;
  return (
    <span className="mono" data-tone={m.tone} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 10, letterSpacing: ".18em", padding: "3px 8px",
      border: "1px solid var(--hair)", borderRadius: 3,
      background: "var(--paper)",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: m.tone === "ok" ? "var(--ok)" : m.tone === "warn" ? "var(--warn)" : m.tone === "risk" ? "var(--risk)" : "var(--info)"
      }} />
      <b style={{color:'var(--ink)'}}>MODE · {m.label.toUpperCase()}</b>
      <span style={{opacity:.55}}>· {m.hint}</span>
    </span>
  );
}

// ─── 6-layer decision chain trace ──────────────────────────────
function LayerTrace({ verdict, compact = false }) {
  const layers = [
    { id: 1, label: "Hard rules",     hint: "Owner-set & safety" },
    { id: 2, label: "Active risks",   hint: "Blockers, holds" },
    { id: 3, label: "Safety checks",  hint: "Channel & policy" },
    { id: 4, label: "Learned cases",  hint: "From past decisions" },
    { id: 5, label: "Owner pref",     hint: "Property defaults" },
    { id: 6, label: "Ask",            hint: "If still unsure" },
  ];
  // verdict: integer 1..6 — first layer that decided; lower-numbered layers are "checked" but did not stop execution
  const stoppedAt = verdict || 4;
  return (
    <div style={{
      border: "1px solid var(--hair-soft)", borderRadius: 4,
      padding: compact ? "10px 12px" : "14px 16px",
      background: "color-mix(in oklab, var(--paper), white 35%)",
    }}>
      <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom:8}}>
        DECISION CHAIN · STOPPED AT LAYER {String(stoppedAt).padStart(2,'0')}
      </div>
      <div className="layer-trace-grid" style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6}}>
        {layers.map(L => {
          const passed = L.id < stoppedAt;
          const here = L.id === stoppedAt;
          const future = L.id > stoppedAt;
          return (
            <div key={L.id} style={{
              padding: '8px 6px', borderRadius:3,
              background: here ? 'var(--ink)' : passed ? 'var(--card)' : 'transparent',
              color: here ? 'var(--paper)' : future ? 'var(--muted)' : 'var(--ink)',
              border: here ? '1px solid var(--ink)' : '1px solid var(--hair-soft)',
              opacity: future ? .45 : 1,
              textAlign:'left',
            }}>
              <div className="mono" style={{fontSize:9.5, letterSpacing:'.14em', opacity:.7, marginBottom:3}}>
                {String(L.id).padStart(2,'0')}{passed && ' ✓'}{here && ' ●'}
              </div>
              <div style={{fontSize:11.5, fontWeight:500, lineHeight:1.2}}>{L.label}</div>
              {!compact && <div style={{fontSize:9.5, opacity:.6, marginTop:2, fontFamily:'var(--mono)', letterSpacing:'.04em'}}>{L.hint}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Teach Cendra scope picker ─────────────────────────────────
function TeachScope({ defaultScope = "property", onPick }) {
  const [pick, setPick] = React.useState(defaultScope);
  const scopes = [
    { id: "guest",     label: "This guest only",     count: "1 guest",        radius: "narrow" },
    { id: "property",  label: "Karaköy · Apt 12",   count: "12 stays / mo",  radius: "single" },
    { id: "owner",     label: "All Demir-owned units", count: "5 properties",radius: "owner" },
    { id: "portfolio", label: "Whole portfolio",     count: "47 properties",  radius: "wide" },
  ];
  return (
    <div style={{
      border: "1px solid var(--hair)", borderRadius: 6,
      padding: "16px 18px", background: "var(--card)",
    }}>
      <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.2em', marginBottom:10}}>
        TEACH CENDRA · SCOPE THIS LESSON
      </div>
      <div className="col gap-2">
        {scopes.map(s => (
          <button
            key={s.id}
            onClick={() => { setPick(s.id); onPick && onPick(s.id); }}
            style={{
              all:'unset', cursor:'pointer',
              display:'grid', gridTemplateColumns:'18px 1fr auto', gap:12,
              padding:'10px 12px', borderRadius:4,
              border: pick === s.id ? '1px solid var(--ink)' : '1px solid var(--hair-soft)',
              background: pick === s.id ? 'color-mix(in oklab, var(--paper), white 25%)' : 'transparent',
            }}
          >
            <span style={{
              width:14, height:14, borderRadius:'50%',
              border: pick === s.id ? '4px solid var(--ink)' : '1px solid var(--hair)',
              background: pick === s.id ? 'var(--paper)' : 'transparent',
              alignSelf:'center',
            }} />
            <div>
              <div style={{fontSize:13.5, color:'var(--ink)', fontWeight:500}}>{s.label}</div>
              <div className="mono dim" style={{fontSize:10.5, marginTop:1}}>{s.count} · scope: {s.radius}</div>
            </div>
            <span className="mono dim" style={{fontSize:10.5, alignSelf:'center'}}>{pick === s.id ? '↵ APPLY' : ''}</span>
          </button>
        ))}
      </div>
      <div className="mono dim" style={{fontSize:10.5, marginTop:12, lineHeight:1.5, paddingTop:12, borderTop:'1px solid var(--hair-soft)'}}>
        Cendra will simulate against the last 30 days at this scope before publishing. Nothing goes live without your final tap.
      </div>
    </div>
  );
}

// ─── Weekly Brain Report card ──────────────────────────────────
function BrainReport() {
  const stats = [
    { label: "Resolved without you", value: "1,318", delta: "+42% vs avg" },
    { label: "Brought to you",       value: "37",   delta: "11 approvals · 14 risks · 12 missing" },
    { label: "New rules learned",    value: "4",    delta: "3 published · 1 awaiting scope" },
    { label: "Workflows promoted",   value: "1",    delta: "Late checkout offer → Semi-auto" },
    { label: "Workflows demoted",    value: "0",    delta: "Steady. No incidents." },
    { label: "Golden Cases match",   value: "99.4%", delta: "1 hallucination flag · 0 incidents" },
  ];
  return (
    <section style={{marginTop: 36}}>
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 14}}>
        <div>
          <div className="eyebrow">WEEKLY BRAIN REPORT · WEEK 19</div>
          <h2 style={{fontFamily:'var(--serif)', fontSize:32, lineHeight:1.1, margin:'4px 0 0', fontWeight:400, letterSpacing:'-.01em'}}>
            <i>What Cendra learned, did, and second-guessed this week.</i>
          </h2>
        </div>
        <div style={{display:'flex', gap:8}}>
          <Btn size="sm" kind="ghost">Open last week</Btn>
          <Btn size="sm">Export PDF</Btn>
        </div>
      </div>

      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3, 1fr)',
        border:'1px solid var(--hair)', borderRadius:6, background:'var(--card)',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding:'18px 20px',
            borderRight: (i % 3 !== 2) ? '1px solid var(--hair-soft)' : 'none',
            borderBottom: (i < 3) ? '1px solid var(--hair-soft)' : 'none',
          }}>
            <div className="mono dim" style={{fontSize:10, letterSpacing:'.18em', marginBottom:8}}>{s.label.toUpperCase()}</div>
            <div style={{fontFamily:'var(--serif)', fontSize:36, lineHeight:1, color:'var(--ink)', letterSpacing:'-.015em'}}>{s.value}</div>
            <div className="mono dim" style={{fontSize:10.5, marginTop:8}}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 14,
        border:'1px solid var(--hair-soft)', borderRadius:4,
        padding:'14px 18px',
        display:'grid', gridTemplateColumns:'auto 1fr auto', gap:18, alignItems:'center',
        background:'color-mix(in oklab, var(--paper), white 35%)',
      }}>
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background:'var(--ink)', color:'var(--paper)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'var(--serif)', fontStyle:'italic', fontSize:18,
        }}>G</div>
        <div>
          <div style={{fontSize:13.5, color:'var(--ink)', lineHeight:1.45}}>
            <i style={{fontFamily:'var(--serif)'}}>Golden Cases</i> reviewed 1,318 of yesterday's decisions overnight. <b>1,310 matched your style.</b> 7 were neutral. 1 flagged: a refund-tone draft that veered too apologetic.
          </div>
          <div className="mono dim" style={{fontSize:10.5, marginTop:4}}>QC: cendra → second-pass-llm → outcome. 0 incidents in 30 days.</div>
        </div>
        <Btn size="sm" kind="ghost">Review flag →</Btn>
      </div>
    </section>
  );
}

window.CendraVision = { ChannelChip, ExecutionMode, LayerTrace, TeachScope, BrainReport };
