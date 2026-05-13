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

// --- Why drawer — polished to match detail-page pattern ---
// §10 Priority Chain — Brain Engine's authoritative decision resolution order.
// Cendra walks tier 1 → tier 6, stopping at the first that produces a binding answer.
// Tiers above the binding tier did not apply. Tiers below were not consulted.
const PRIORITY_CHAIN = [
  { id: "manual",     n: 1, label: "Manual override",   sub: "You explicitly said so",                kinds: ["manual"] },
  { id: "blocker",    n: 2, label: "Active blocker",    sub: "Safety stop — Cendra cannot proceed",  kinds: ["blocker"] },
  { id: "safety",     n: 3, label: "Safety rule",       sub: "Hard rules · compliance · policy",     kinds: ["rule","policy","safety"] },
  { id: "learned",    n: 4, label: "Learned behavior",  sub: "Cases · pattern · property history",   kinds: ["case","learned","pattern"] },
  { id: "preference", n: 5, label: "Owner preference",  sub: "Soft preference · guest signal · fact",kinds: ["preference","guest","fact","owner"] },
  { id: "ask",        n: 6, label: "Ask",               sub: "Cendra needs you to decide",            kinds: ["ask","question"] },
];

function tierForKind(kind) {
  const t = PRIORITY_CHAIN.find(t => t.kinds.includes(kind));
  return t ? t.id : "preference";
}

function WhyDrawer({ open, onClose, decision }) {
  if (!open) return null;
  const evidence = decision.evidence || [
    { kind: "rule", label: "Owner rule: never promise early check-in without cleaning confirmation", source: "rule:owner-2042", fresh: "permanent" },
    { kind: "fact", label: "Cleaner ETA 14:30 — same-day turnover from departure at 11:00", source: "pms:cleaning-roster", fresh: "live" },
    { kind: "case", label: "3 prior early check-ins on this unit averaged 35 min slip", source: "decision-cases · 90d", fresh: "30d" },
    { kind: "guest", label: "Guest: 3 prior trips, soft-positive sentiment, no urgency in language", source: "guest-memory", fresh: "live" },
    { kind: "policy", label: "Airbnb same-day messaging policy permits holding replies up to 1 hour", source: "channel-policy", fresh: "60d" },
  ];

  // Group evidence by tier
  const byTier = {};
  evidence.forEach(e => {
    const t = tierForKind(e.kind);
    (byTier[t] = byTier[t] || []).push(e);
  });

  // Binding tier — the highest-priority tier (lowest n) that has evidence.
  // Override with decision.binding_tier if explicitly set.
  const inferredBinding = PRIORITY_CHAIN.find(t => byTier[t.id]?.length);
  const bindingId = decision.binding_tier || inferredBinding?.id || "preference";
  const bindingIdx = PRIORITY_CHAIN.findIndex(t => t.id === bindingId);

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(640px, 94vw)',
        background: 'var(--paper)',
        borderLeft: '1px solid var(--hair)',
        boxShadow: '0 -8px 32px rgba(0,0,0,.12), -2px 0 8px rgba(0,0,0,.04)',
        overflowY: 'auto', zIndex: 40,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Quiet header */}
        <div style={{
          position: 'sticky', top: 0, background: 'var(--paper)',
          padding: '24px 32px 16px', zIndex: 2,
          borderBottom: '1px solid var(--hair-soft)',
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '.18em',
            color: 'var(--muted)', display: 'flex', gap: 16, alignItems: 'center',
          }}>
            <button onClick={onClose} style={{
              all: 'unset', cursor: 'pointer', letterSpacing: '.14em', color: 'var(--muted)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
              ← CLOSE
            </button>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
            <span>WHY · §10 PRIORITY CHAIN</span>
          </div>
        </div>

        <div style={{padding: '24px 32px', flex: 1}}>
          {/* Hero */}
          <h2 className="serif-display" style={{
            fontSize: 32, lineHeight: 1.1, margin: 0,
            color: 'var(--ink)', letterSpacing: '-.018em',
            marginBottom: 14,
          }}>
            {decision.title}
          </h2>
          <p style={{
            margin: 0, fontSize: 15, lineHeight: 1.55,
            color: 'var(--ink-mid)', maxWidth: 540,
            fontFamily: 'var(--sans)',
          }}>
            Cendra walks down six tiers in order. The first tier that applies is binding — everything below it is not consulted.
          </p>

          {/* §10 Priority chain — vertical with binding tier highlighted */}
          <div style={{marginTop: 28, position: 'relative'}}>
            <div style={{
              position: 'absolute', left: 18, top: 12, bottom: 12,
              width: 1, background: 'var(--hair)',
            }} />
            {PRIORITY_CHAIN.map((t, i) => {
              const items = byTier[t.id] || [];
              const isBinding = t.id === bindingId;
              const isAbove = i < bindingIdx;     // higher priority but didn't apply
              const isBelow = i > bindingIdx;     // lower priority, not consulted
              const dotBg = isBinding ? 'var(--rausch)' : isAbove ? 'var(--hair)' : 'var(--muted-2)';
              const dotInner = isBinding ? '#ffffff' : isAbove ? 'var(--muted-2)' : '#ffffff';
              const labelColor = isBinding ? 'var(--ink)' : isBelow ? 'var(--muted-2)' : 'var(--ink-mid)';
              const subColor = isBinding ? 'var(--ink-mid)' : 'var(--muted-2)';
              return (
                <div key={t.id} style={{
                  position: 'relative', paddingLeft: 50, paddingBottom: i < PRIORITY_CHAIN.length - 1 ? 18 : 0,
                  opacity: isBelow ? 0.55 : 1,
                }}>
                  {/* Tier number dot */}
                  <div style={{
                    position: 'absolute', left: 6, top: 0,
                    width: 26, height: 26, borderRadius: 999,
                    background: dotBg, color: dotInner,
                    display:'grid', placeItems:'center',
                    fontFamily:'var(--mono)', fontSize: 11, fontWeight: 700,
                    border: isBinding ? `2px solid var(--rausch)` : `1px solid var(--hair)`,
                    boxShadow: isBinding ? '0 0 0 4px rgba(255,56,92,.12)' : 'none',
                  }}>{t.n}</div>
                  {/* Tier header */}
                  <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: items.length ? 10 : 4, minHeight: 26}}>
                    <span style={{
                      fontFamily:'var(--sans)', fontSize: 13.5,
                      fontWeight: isBinding ? 600 : 500,
                      color: labelColor,
                    }}>
                      {t.label}
                    </span>
                    {isBinding && (
                      <span style={{
                        fontFamily:'var(--mono)', fontSize: 9.5, letterSpacing:'.12em',
                        color: 'var(--rausch)', fontWeight: 700,
                        padding:'2px 7px', borderRadius: 4,
                        background:'rgba(255,56,92,.08)',
                      }}>BINDING</span>
                    )}
                    {isAbove && (
                      <span style={{
                        fontFamily:'var(--mono)', fontSize: 9.5, letterSpacing:'.12em',
                        color: 'var(--muted-2)', textTransform:'uppercase',
                      }}>did not apply</span>
                    )}
                    {isBelow && (
                      <span style={{
                        fontFamily:'var(--mono)', fontSize: 9.5, letterSpacing:'.12em',
                        color: 'var(--muted-2)', textTransform:'uppercase',
                      }}>not consulted</span>
                    )}
                    <span style={{flex:1}} />
                    <span style={{fontFamily:'var(--mono)', fontSize: 10, color: subColor, letterSpacing:'.06em'}}>
                      {t.sub}
                    </span>
                  </div>
                  {/* Evidence beams for this tier (only if tier applied) */}
                  {items.length > 0 && !isBelow && (
                    <div style={{
                      background: '#ffffff', border: '1px solid var(--hair)', borderRadius: 8,
                      borderLeft: isBinding ? '3px solid var(--rausch)' : '1px solid var(--hair)',
                      overflow: 'hidden',
                    }}>
                      {items.map((e, j) => (
                        <div key={j} style={{
                          padding: '12px 14px',
                          borderBottom: j < items.length - 1 ? '1px solid var(--hair-soft)' : 'none',
                        }}>
                          <EvidenceBeam idx={null} {...e} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Trust footer micro band */}
          <div style={{
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid var(--hair-soft)',
            display: 'flex', gap: 28, flexWrap: 'wrap',
          }}>
            <TrustStat label="autonomy" value={decision.autonomy} />
            <TrustStat label="risk" value={decision.risk} tone={decision.risk === 'high' ? 'risk' : decision.risk === 'medium' ? 'warn' : 'ok'} />
            <TrustStat label="reversibility" value={decision.reversibility} tone={decision.reversibility === 'red' ? 'risk' : decision.reversibility === 'amber' ? 'warn' : 'ok'} />
            <TrustStat label="binding tier" value={PRIORITY_CHAIN[bindingIdx]?.label.toLowerCase() || '—'} tone={bindingId === 'blocker' ? 'risk' : bindingId === 'safety' ? 'warn' : 'ok'} />
            <TrustStat label="confidence" value="0.91" />
          </div>
        </div>

        {/* Sticky footer */}
        <div style={{
          position: 'sticky', bottom: 0, background: 'var(--paper)',
          padding: '18px 32px', borderTop: '1px solid var(--hair-soft)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Btn>Open audit trail →</Btn>
          <span style={{flex: 1}} />
          <button onClick={onClose} style={{
            all: 'unset', cursor: 'pointer',
            background: 'var(--ink)', color: '#ffffff',
            padding: '10px 18px', borderRadius: 8,
            fontSize: 13.5, fontWeight: 600,
          }}>Close</button>
        </div>
      </aside>
    </>
  );
}

function TrustStat({ label, value, tone }) {
  const color = tone === 'risk' ? 'var(--risk)' : tone === 'warn' ? 'var(--warn)' : tone === 'ok' ? 'var(--ok)' : 'var(--ink)';
  return (
    <div>
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600,
        color, letterSpacing: '-.005em',
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em',
        color: 'var(--muted)', textTransform: 'uppercase', marginTop: 4, fontWeight: 500,
      }}>{label}</div>
    </div>
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

// --- Page header pattern (Morning Brief–style: quiet eyebrow, Fraunces display) ---
function PageHeader({ eyebrow, title, lead, right }) {
  return (
    <header className="page-header" style={{
      display:'grid',
      gridTemplateColumns: right ? '1fr auto' : '1fr',
      alignItems:'end', gap: 32, marginBottom: 48, paddingTop: 16,
    }}>
      <div>
        <div className="mono" style={{
          fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
          textTransform: 'uppercase', marginBottom: 18, fontWeight: 500,
        }}>{eyebrow}</div>
        <h1 className="serif-display" style={{
          fontSize: 46, lineHeight: 1.05, margin: 0,
          color: 'var(--ink)', maxWidth: 820,
          fontVariationSettings: '"opsz" 96, "SOFT" 30, "WONK" 0',
        }}>{title}</h1>
        {lead && <p style={{
          maxWidth: 680, marginTop: 18, fontSize: 16, lineHeight: 1.55,
          color: 'var(--ink-mid)', fontFamily: 'var(--sans)', fontWeight: 400,
        }}>{lead}</p>}
      </div>
      {right && <div className="page-meta" style={{paddingTop: 8}}>{right}</div>}
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
  PRIORITY_CHAIN, tierForKind,
};
