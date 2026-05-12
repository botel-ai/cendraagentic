// Atoms shared across screens
const { useState, useEffect, useRef, useMemo } = React;

const cls = (...xs) => xs.filter(Boolean).join(' ');

// --- Pills ---
function Pill({ tone, dot = true, children, ...rest }) {
  return (
    <span className="pill" data-tone={tone} {...rest}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

function AutonomyPill({ state }) {
  const map = {
    observe:  { tone: "info", label: "Observe" },
    approval: { tone: "warn", label: "Approval required" },
    semi:     { tone: "info", label: "Semi-auto" },
    autopilot:{ tone: "ok",   label: "Autopilot" },
    never:    { tone: "risk", label: "Never auto" },
  };
  const m = map[state] || map.observe;
  return <Pill tone={m.tone}>{m.label}</Pill>;
}

function ReasonPill({ kind }) {
  const map = {
    approval: { tone: "warn", label: "Approval required" },
    blocker:  { tone: "risk", label: "Blocked · evidence ready" },
    missing_info: { tone: "info", label: "Missing info" },
    opportunity:  { tone: "ok",   label: "Revenue opportunity" },
    low_conf: { tone: "info", label: "Low confidence" },
    learning: { tone: "info", label: "Learning suggestion" },
  };
  const m = map[kind] || { tone: "info", label: kind };
  return <Pill tone={m.tone}>{m.label}</Pill>;
}

// Reversibility seal — round stamp marker
function Seal({ tone = "ok" }) {
  const map = {
    green: { tone: "ok",   word: "Reversible", sub: "Green" },
    amber: { tone: "warn", word: "Recoverable", sub: "Amber" },
    red:   { tone: "risk", word: "Final",      sub: "Red" },
    ok: { tone: "ok", word: "Reversible", sub: "Green" },
    warn: { tone: "warn", word: "Recoverable", sub: "Amber" },
    risk: { tone: "risk", word: "Final", sub: "Red" },
  };
  const m = map[tone] || map.ok;
  return (
    <div className="seal" data-tone={m.tone} title={m.word}>
      <div>
        {m.sub}
        <small>{m.word}</small>
      </div>
    </div>
  );
}

// --- Buttons ---
function Btn({ kind = "default", size, children, ...rest }) {
  const klass = cls(
    "btn",
    kind === "primary" && "btn-primary",
    kind === "ghost" && "btn-ghost",
    kind === "danger" && "btn-danger",
    size === "sm" && "btn-sm",
  );
  return <button className={klass} {...rest}>{children}</button>;
}

// --- Action bar (Approve, Edit, Reject, Takeover, Pause, Hand back) ---
function ActionBar({ primary = "Approve", primaryKind = "primary", onPrimary, onEdit, onReject, onTakeover, onPause, onHandback, dangerous = false }) {
  return (
    <div className="actionbar">
      <Btn kind={primaryKind} onClick={onPrimary}>
        <span style={{fontFamily:'var(--mono)',fontSize:10,opacity:.7,letterSpacing:'.12em'}}>↵</span>
        {primary}
      </Btn>
      <Btn onClick={onEdit}>Edit</Btn>
      <Btn kind="ghost" onClick={onReject}>Reject</Btn>
      <span className="spacer" />
      <Btn kind="ghost" size="sm" onClick={onTakeover}>Take over</Btn>
      <Btn kind="ghost" size="sm" onClick={onPause}>Pause</Btn>
      <Btn kind="ghost" size="sm" onClick={onHandback}>Hand back</Btn>
    </div>
  );
}

// --- Decision Card (telegram form) ---
function DecisionCard({ decision, variant = "telegram", compact = false, onWhy, onApprove, onEdit, onReject }) {
  const tone = decision.reversibility || decision.tone || "green";
  const sealTone = tone === "green" ? "ok" : tone === "amber" ? "warn" : "risk";

  if (variant === "stamp") {
    return (
      <div className="dcard" style={{padding:'18px 20px', display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'start'}}>
        <div>
          <div className="dcard-from">FROM CENDRA · <b>{new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</b> · OPS DECISION</div>
          <h3 className="dcard-title" style={{marginTop:8}}>{decision.title}</h3>
          <ol className="dcard-reasoning" style={{marginTop:10}}>
            {decision.reasoning.map((r, i) => (
              <li key={i}><span><b>{r.body}</b> <span className="mono dim" style={{marginLeft:6}}>{r.source}</span></span></li>
            ))}
          </ol>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
            <AutonomyPill state={decision.autonomy} />
            <Pill tone={decision.risk === "high" ? "risk" : decision.risk === "medium" ? "warn" : "ok"}>Risk · {decision.risk}</Pill>
          </div>
        </div>
        
      </div>
    );
  }

  // telegram default — v2: explicit slots (Situation / Recommendation / Why / Evidence / Mode · Risk · Reversibility / Actions)
  const execMode = decision.autonomy === "never" ? "blocked"
                 : decision.autonomy === "autopilot" ? "autopilot"
                 : decision.autonomy === "semi" ? "semi"
                 : decision.autonomy === "approval" ? "approval" : "draft";
  const evidenceKinds = (decision.evidence || []).map(e => e.kind).filter(Boolean);
  const situation = decision.situation || decision.title?.replace(/^Cendra (recommends|will|holds|proposes)[: ]?/i, '') || decision.title;
  const recommendation = decision.recommendation || decision.title;

  return (
    <div className="dcard">
      <div className="dcard-head">
        <div className="dcard-from">FROM <b>CENDRA</b> · OPS AUTOPILOT · {decision.timestamp || "just now"}</div>
        <AutonomyPill state={decision.autonomy} />
      </div>
      <div className="dcard-body">
        {/* SITUATION */}
        {decision.situation && (
          <>
            <div className="eyebrow" style={{marginBottom:6}}>SITUATION</div>
            <p className="dim" style={{margin:'0 0 14px', fontSize:13.5, lineHeight:1.5, fontFamily:'var(--serif)', fontStyle:'italic'}}>
              {decision.situation}
            </p>
          </>
        )}

        {/* RECOMMENDATION */}
        <div className="eyebrow" style={{marginBottom:6}}>RECOMMENDATION</div>
        <h3 className="dcard-title">{recommendation}</h3>

        {window.CendraVision && (
          <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'10px 0 6px'}}>
            <window.CendraVision.ExecutionMode mode={execMode} />
            <Pill tone={decision.risk === "high" ? "risk" : decision.risk === "medium" ? "warn" : "ok"}>Risk · {decision.risk || "low"}</Pill>
            <Pill tone={tone === "green" ? "ok" : tone === "amber" ? "warn" : "risk"}>
              {tone === "green" ? "Reversible" : tone === "amber" ? "Recoverable" : "Final"}
            </Pill>
          </div>
        )}

        {!compact && window.CendraVision && (
          <div style={{margin:'14px 0 12px'}}>
            <window.CendraVision.LayerTrace verdict={decision.layer_verdict || 4} compact />
          </div>
        )}

        {/* WHY */}
        <div className="eyebrow" style={{marginBottom:6, marginTop:6}}>WHY</div>
        <ol className="dcard-reasoning">
          {decision.reasoning.slice(0, compact ? 2 : 4).map((r, i) => (
            <li key={i}>
              <span>
                <b>{r.body}</b>
                <span className="mono dim" style={{marginLeft:8}}>{r.source}</span>
              </span>
            </li>
          ))}
        </ol>

        {/* EVIDENCE */}
        {evidenceKinds.length > 0 && !compact && (
          <>
            <div className="eyebrow" style={{marginBottom:6, marginTop:14}}>EVIDENCE</div>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {[...new Set(evidenceKinds)].map((k, i) => (
                <span key={i} className="mono" style={{
                  fontSize:10, letterSpacing:'.12em', textTransform:'uppercase',
                  padding:'3px 8px', borderRadius: 3,
                  background:'var(--paper-2)', border:'1px solid var(--hair)',
                  color:'var(--ink-mid)',
                }}>{k}</span>
              ))}
            </div>
          </>
        )}

        {decision.action && !compact && (
          <div className="dcard-action mt-2">
            <div className="label">Prepared action</div>
            <div className="body">{decision.action}</div>
          </div>
        )}
      </div>
      <div className="dcard-foot">
        <div className="dcard-trust">
          <span>{decision.reversibility_note || (decision.reversibility === "green" ? "FULLY REVERSIBLE" : decision.reversibility === "amber" ? "RECOVERABLE" : "FINAL ACTION")}</span>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {onWhy && <Btn kind="ghost" size="sm" onClick={onWhy}>Why →</Btn>}
          
        </div>
      </div>
    </div>
  );
}

// --- Why drawer ---
function WhyDrawer({ open, onClose, decision }) {
  if (!open) return null;
  const evidence = decision.evidence || [
    { kind: "rule", label: "Owner rule: never promise early check-in without cleaning confirmation", source: "rule:owner-2042", fresh: "permanent" },
    { kind: "fact", label: "Cleaner ETA 14:30 — same-day turnover from departure at 11:00", source: "pms:cleaning-roster", fresh: "live" },
    { kind: "case", label: "3 prior early check-ins on this unit averaged 35 min slip", source: "decision-cases · 90d", fresh: "30d" },
    { kind: "guest", label: "Guest: 3 prior trips, soft-positive sentiment, no urgency in language", source: "guest-memory", fresh: "live" },
    { kind: "policy", label: "Airbnb same-day messaging policy permits holding replies up to 1 hour", source: "channel-policy", fresh: "60d" },
  ];

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer">
        <div style={{padding:'20px 24px', borderBottom:'1px solid var(--hair)'}}>
          <div className="eyebrow">Why this decision</div>
          <h2 className="h2 mt-2">{decision.title}</h2>
          <p className="lead">Cendra walked through hard rules, active risks, safety checks, learned behaviors and owner preferences — in that order.</p>
        </div>

        <div style={{padding:'20px 24px'}}>
          <div className="eyebrow mb-3">Beams of evidence</div>
          <div className="col gap-3">
            {evidence.map((e, i) => (
              <EvidenceBeam key={i} idx={i+1} {...e} />
            ))}
          </div>
        </div>

        <div style={{padding:'20px 24px', borderTop:'1px solid var(--hair-soft)'}}>
          <div className="eyebrow mb-2">Trust footer</div>
          <div className="col gap-2 mono dim" style={{fontSize:11.5}}>
            <div>autonomy = <b style={{color:'var(--ink)'}}>{decision.autonomy}</b></div>
            <div>risk = <b style={{color:'var(--ink)'}}>{decision.risk}</b></div>
            <div>reversibility = <b style={{color:'var(--ink)'}}>{decision.reversibility}</b></div>
            <div>blocker_check = <b style={{color:'var(--ink)'}}>passed</b></div>
            <div>confidence = <b style={{color:'var(--ink)'}}>0.91</b> · <i>shown for transparency only</i></div>
          </div>
        </div>

        <div style={{padding:'18px 24px', borderTop:'1px solid var(--hair-soft)', display:'flex',gap:8}}>
          <Btn kind="ghost" size="sm">Open audit trail →</Btn>
          <span className="grow" />
          <Btn size="sm" onClick={onClose}>Close</Btn>
        </div>
      </aside>
    </>
  );
}

function EvidenceBeam({ idx, kind, label, source, fresh }) {
  const kindLabel = { rule: "RULE", fact: "FACT", case: "PRIOR CASE", guest: "GUEST MEMORY", policy: "OTA POLICY", photo: "PHOTO" }[kind] || kind?.toUpperCase();
  return (
    <div style={{display:'grid', gridTemplateColumns:'24px 1fr', gap:12, alignItems:'start'}}>
      <div className="mono dim" style={{fontSize:10, paddingTop:3, letterSpacing:'.1em'}}>{String(idx).padStart(2,'0')}</div>
      <div>
        <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:4}}>
          <span className="mono" style={{fontSize:9.5, color:'var(--ink)', letterSpacing:'.18em'}}>{kindLabel}</span>
          <span className="mono dim" style={{fontSize:9.5}}>·</span>
          <span className="mono dim" style={{fontSize:9.5}}>{fresh}</span>
        </div>
        <div style={{fontSize:13.5, color:'var(--ink)', lineHeight:1.45}}>{label}</div>
        <div className="mono dim mt-1" style={{fontSize:10.5}}>{source}</div>
      </div>
    </div>
  );
}

// --- Page header pattern ---
function PageHeader({ eyebrow, title, lead, right }) {
  return (
    <header className="page-header" style={{display:'grid', gridTemplateColumns: right ? '1fr auto' : '1fr', alignItems:'end', gap: 24, marginBottom: 28}}>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="h1">{title}</h1>
        {lead && <p className="lead" style={{maxWidth: 640, marginTop: 6}}>{lead}</p>}
      </div>
      {right && <div className="page-meta">{right}</div>}
    </header>
  );
}

// --- Empty / quiet state primitive ---
function QuietState({ kind = "default", title, body, mono }) {
  return (
    <div style={{
      border: '1px dashed var(--hair)',
      borderRadius: 6,
      padding: '32px 28px',
      background: 'color-mix(in oklab, var(--paper), white 30%)',
      textAlign: 'left'
    }}>
      <div className="eyebrow mb-2">Cendra has the watch</div>
      <h3 style={{fontFamily:'var(--serif)', fontSize:24, lineHeight:1.15, margin:'0 0 8px', fontWeight: 400}}>{title}</h3>
      {body && <p className="dim" style={{maxWidth:520, margin:0}}>{body}</p>}
      {mono && <div className="mono dim mt-3" style={{fontSize:11}}>{mono}</div>}
    </div>
  );
}

window.CendraAtoms = {
  cls, Pill, AutonomyPill, ReasonPill, Seal, Btn, ActionBar,
  DecisionCard, WhyDrawer, EvidenceBeam, PageHeader, QuietState,
};
