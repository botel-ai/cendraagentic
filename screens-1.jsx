// Cendra screens: Today, Work, Work Detail, Approval
const { Pill, AutonomyPill, ReasonPill, Seal, Btn, ActionBar, DecisionCard, WhyDrawer, EvidenceBeam, PageHeader, QuietState, confidenceBand, confidencePhrase } = window.CendraAtoms;
const { StayHealthBadge, deriveStayHealth, deriveStayHealthSignals } = window.CendraAtoms2;
const D = window.CENDRA_DATA;
const DP = window.CENDRA_DATA2;

// ───────────────────────────────────────────────────────────────────
// TODAY · Morning Brief — Cendra speaks, you direct
// One hero priority, deferred queue, compressed system row.
// Hick's Law + Cognitive Load + Von Restorff applied throughout.
// ───────────────────────────────────────────────────────────────────
function TodayScreen({ onOpen, tweaks }) {
  const now = new Date();
  const hr = now.getHours();
  const greeting = hr < 5 ? "Late again" : hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString([], {weekday:'long', day:'numeric', month:'long'}).toUpperCase();

  const s = DP.signals;
  const pulse = DP.today_pulse;
  const clusters = DP.clusters;
  const stream = DP.activity_stream;
  const hero = DP.today_sections.needs_decision[0];

  // Audit §11: when the operation reaches a calm state, the page should
  // actively breathe instead of just being empty. Preview toggle for demo.
  const [calmPreview, setCalmPreview] = useState(false);
  const isCalm = calmPreview || s.needs_you === 0;

  const openItem = (route, arg) => {
    if (!route) return;
    if (route.includes(":")) { const [n,a] = route.split(":"); onOpen(n, a); } else onOpen(route, arg);
  };

  // Cendra's voice — adapts to the operation's tense
  const overnightLine = isCalm
    ? <>The portfolio is steady. Cendra handled <b style={{color:'var(--ink)'}}>{s.actions_total.toLocaleString()}</b> things since you last checked — zero incidents, nothing waiting on you. The next four hours are scheduled and unremarkable.</>
    : <>Cendra handled <b style={{color:'var(--ink)'}}>{s.actions_total.toLocaleString()}</b> things overnight. <b style={{color:'var(--ink)'}}>{s.needs_you}</b> want your judgment, <b style={{color:'var(--ink)'}}>{DP.today_sections.risk_sla.length}</b> are at risk, <b style={{color:'var(--ink)'}}>{DP.today_sections.revenue.length}</b> are revenue. Start with the {hero ? hero.title.split('·')[0].trim().toLowerCase() : 'leak'} — {hero?.sub?.toLowerCase()}.</>;

  return (
    <div className="stage" style={{maxWidth: 1100, paddingTop: 56, paddingBottom: 120}}>

      {/* DATE / TIME — quiet anchor */}
      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 24, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>{dateStr}</span>
        <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
        <span>{now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} · LOCAL</span>
        <span style={{flex: 1}} />
        <button onClick={() => setCalmPreview(c => !c)} style={{
          all:'unset', cursor:'pointer',
          fontFamily:'var(--mono)', fontSize: 9.5, letterSpacing:'.12em',
          color: isCalm ? 'var(--ok)' : 'var(--muted-2)', fontWeight: 600, textTransform:'uppercase',
          padding:'3px 8px', borderRadius: 4,
          border:'1px solid ' + (isCalm ? 'rgba(0,138,5,.30)' : 'var(--hair)'),
        }}>{calmPreview ? '◐ Calm preview · on' : '○ Preview calm hour'}</button>
      </div>

      {/* HERO — Cendra speaks (continuous-present voice; quieter in calm state) */}
      <div style={{marginBottom: 40}}>
        <h1 className="serif-display" style={{
          fontSize: 52, lineHeight: 1.04, margin: 0,
          color: 'var(--ink)',
        }}>
          {greeting}, <span style={{fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1', fontStyle:'normal'}}>Maya</span>.
        </h1>
        <p className="serif-display" style={{
          fontSize: 22, lineHeight: 1.4, margin: '16px 0 0',
          color: 'var(--ink-mid)', maxWidth: 820, fontWeight: 400,
          fontVariationSettings: '"opsz" 72, "SOFT" 50, "WONK" 0',
        }}>
          {overnightLine}
        </p>
      </div>

      {/* CALM CELEBRATION — when calm state, render a breathing band instead of lanes */}
      {isCalm ? (
        <CalmCelebrationBand onPreviewOff={() => setCalmPreview(false)} />
      ) : (
        <>
          {/* THREE TIME-TENSE LANES — Mission Control core */}
          <TimeTenseLanes pulse={pulse} onItem={openItem} hero={hero} />

          {/* REGION CLUSTER STRIP — portfolio at-glance */}
          <RegionClusterStrip clusters={clusters} onOpen={onOpen} />
        </>
      )}

      {/* OPEN FULL BACKLOG link — Today doesn't carry digests anymore */}
      <div style={{
        marginTop: 32, paddingTop: 20,
        borderTop: '1px solid var(--hair-soft)',
        display:'flex', alignItems:'center', gap: 18,
      }}>
        <span className="mono" style={{fontSize: 10.5, letterSpacing:'.16em', color:'var(--muted)', textTransform:'uppercase', fontWeight: 500}}>
          The full backlog
        </span>
        <button onClick={() => onOpen('work_queue')} style={{
          all:'unset', cursor:'pointer',
          fontFamily:'var(--mono)', fontSize: 11, letterSpacing:'.10em',
          color:'var(--ink)', fontWeight: 600, textTransform:'uppercase',
          padding:'6px 12px', borderRadius: 6,
          border:'1px solid var(--hair)',
        }}>{DP.today_sections.needs_decision.length + DP.today_sections.risk_sla.length} decisions & risks →</button>
        <button onClick={() => onOpen('brain', 'report')} style={{
          all:'unset', cursor:'pointer',
          fontFamily:'var(--mono)', fontSize: 11, letterSpacing:'.10em',
          color:'var(--ink-mid)', fontWeight: 500, textTransform:'uppercase',
        }}>What Cendra did overnight →</button>
        <span style={{flex: 1}} />
        <span className="mono" style={{fontSize: 10, color:'var(--muted-2)', letterSpacing:'.06em'}}>
          {s.actions_total.toLocaleString()} actions · {D.digest.drafts_sent} drafts · {D.digest.vendors_dispatched} vendors dispatched · last 12h
        </span>
      </div>

      {/* LIVE ACTIVITY TICKER — pulse at the bottom */}
      <ActivityTicker stream={stream} />
    </div>
  );
}

// HERO priority card — single big Fitts-friendly action
// CalmCelebrationBand — when the portfolio is steady, the page breathes.
// Audit §11: "Today's 'no incidents' line is buried; in a calm hour the page
// should feel actively quiet, not empty."
function CalmCelebrationBand({ onPreviewOff }) {
  return (
    <div style={{
      marginBottom: 32,
      padding:'48px 56px',
      borderRadius: 18,
      background:'linear-gradient(180deg, #FAFAF7 0%, #F4F6F2 100%)',
      border:'1px solid #E6EBE3',
      position:'relative',
      overflow:'hidden',
    }}>
      {/* Soft breathing dot */}
      <div style={{
        position:'absolute', top: 24, right: 24,
        display:'inline-flex', alignItems:'center', gap: 8,
      }}>
        <span style={{
          width: 10, height: 10, borderRadius:999, background:'#00A699',
          animation:'calmBreathe 5s ease-in-out infinite',
        }} />
        <style>{`@keyframes calmBreathe { 0%, 100% { opacity: .5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }`}</style>
        <span className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'#00867E', fontWeight: 600, textTransform:'uppercase'}}>
          Cendra has the watch
        </span>
      </div>

      <div style={{maxWidth: 720}}>
        <h2 className="serif-display" style={{
          fontSize: 36, lineHeight: 1.12, margin: 0, color:'var(--ink)',
          letterSpacing:'-.018em',
          fontVariationSettings: '"opsz" 96, "SOFT" 80, "WONK" 0',
        }}>
          Everyone is where they should be.
        </h2>
        <p style={{
          margin: '14px 0 0', fontSize: 16, lineHeight: 1.55,
          color:'var(--ink-mid)', fontFamily:'var(--serif)',
          fontVariationSettings: '"opsz" 32, "SOFT" 30, "WONK" 0',
          fontStyle:'italic',
        }}>
          Cleaners finished. Vendors confirmed. Guests are responsive. Cendra is monitoring 31 active conversations and will page you if anything wobbles. Take a real break.
        </p>
        <div style={{display:'flex', gap: 24, marginTop: 28, flexWrap:'wrap'}}>
          <CalmStat label="incidents · 30d" value="0" />
          <CalmStat label="promises at risk" value="0" />
          <CalmStat label="approvals waiting" value="0" />
          <CalmStat label="vendors overdue" value="0" />
        </div>
        {onPreviewOff && (
          <button onClick={onPreviewOff} style={{
            all:'unset', cursor:'pointer',
            marginTop: 24,
            fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.12em',
            color:'var(--muted)', fontWeight: 600, textTransform:'uppercase',
            padding:'5px 10px', borderRadius: 6,
            border:'1px solid var(--hair)',
            background:'#ffffff',
          }}>
            ← Return to active view
          </button>
        )}
      </div>
    </div>
  );
}

function CalmStat({ label, value }) {
  return (
    <div>
      <div style={{
        fontFamily:'var(--serif)', fontSize: 32, fontWeight: 400,
        color:'#00867E', letterSpacing:'-.015em', lineHeight: 1,
      }}>{value}</div>
      <div className="mono" style={{
        fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted)',
        textTransform:'uppercase', marginTop: 6, fontWeight: 500,
      }}>{label}</div>
    </div>
  );
}

// ─── TimeTenseLanes — three lanes of continuous-present operations ─
// Just happened (last 4h Cendra closures) · Live in flight (right now) · Coming up (next 4h)
function TimeTenseLanes({ pulse, onItem, hero }) {
  const stateMeta = {
    en_route:      { color: '#FFB400', label: 'EN ROUTE'    },
    drafting:      { color: '#5E6AD2', label: 'DRAFTING'    },
    monitoring:    { color: '#FF385C', label: 'MONITORING'  },
    in_progress:   { color: '#0891B2', label: 'IN PROGRESS' },
    waiting_you:   { color: '#FF385C', label: 'NEEDS YOU'   },
    waiting_t2h:   { color: '#9CA3AF', label: 'T-2H HOLD'   },
  };
  const lanes = [
    { id: "past",    label: "Just happened",    sub: "Last 4h · Cendra closed",            items: pulse.just_happened,    tense: "past"  },
    { id: "live",    label: "Live in flight",   sub: "Right now",                          items: pulse.live_in_flight,   tense: "now"   },
    { id: "future",  label: "Coming up next 4h",sub: "Arrivals · cleaners · windows",      items: pulse.coming_up_4h,     tense: "future"},
  ];

  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 1.4fr 1fr', gap: 1,
      background:'var(--hair)', border:'1px solid var(--hair)', borderRadius: 14,
      overflow:'hidden', marginBottom: 32,
    }}>
      {lanes.map(lane => (
        <div key={lane.id} style={{background: lane.tense === 'now' ? 'var(--paper-2)' : '#ffffff'}}>
          <div style={{
            padding:'14px 18px 10px',
            borderBottom:'1px solid var(--hair-soft)',
          }}>
            <div className="mono" style={{
              fontSize: 9.5, letterSpacing:'.18em',
              color: lane.tense === 'now' ? 'var(--ink)' : 'var(--muted)',
              fontWeight: 700, textTransform:'uppercase',
            }}>{lane.label}</div>
            <div className="mono" style={{
              fontSize: 9.5, letterSpacing:'.08em',
              color:'var(--muted-2)', textTransform:'uppercase', marginTop: 3,
            }}>{lane.sub}</div>
          </div>
          <div style={{padding:'4px 0'}}>
            {lane.items.slice(0, 5).map(it => {
              if (lane.tense === "past") {
                const tone = it.tone === 'ok' ? 'var(--ok)' : it.tone === 'warn' ? 'var(--warn)' : it.tone === 'risk' ? 'var(--risk)' : 'var(--info)';
                return (
                  <div key={it.id} style={{padding:'9px 18px', borderBottom:'1px solid var(--hair-soft)'}}>
                    <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 2}}>
                      <span style={{width: 5, height: 5, borderRadius: 999, background: tone}} />
                      <span className="mono" style={{fontSize: 9.5, letterSpacing:'.10em', color:'var(--muted)'}}>
                        {it.time_ago.toUpperCase()} · {it.verb.toUpperCase()}
                      </span>
                    </div>
                    <div style={{fontSize: 12.5, color:'var(--ink)', lineHeight: 1.4}}>{it.target}</div>
                    <div style={{fontSize: 11, color:'var(--muted)', marginTop: 2}}>{it.detail}</div>
                  </div>
                );
              }
              if (lane.tense === "now") {
                const m = stateMeta[it.state] || { color: 'var(--ink)', label: it.state.toUpperCase() };
                const isHero = hero && it.stay_id && hero.id && hero.title.toLowerCase().includes((it.target || '').toLowerCase().split(' ')[0]);
                return (
                  <button key={it.id} onClick={() => onItem(it.stay_id ? 'work_detail' : 'work', it.stay_id)} style={{
                    all:'unset', cursor:'pointer', display:'block',
                    padding:'10px 18px', width:'calc(100% - 36px)',
                    borderBottom:'1px solid var(--hair-soft)',
                    background: isHero ? 'rgba(255,56,92,.06)' : 'transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = isHero ? 'rgba(255,56,92,.06)' : 'transparent'}>
                    <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 3}}>
                      <span className="mono" style={{
                        fontSize: 9.5, letterSpacing:'.10em', color: m.color, fontWeight: 700,
                        padding:'1px 6px', borderRadius: 3,
                        background: `${m.color}14`,
                      }}>{m.label}</span>
                      <span style={{fontSize: 12.5, color:'var(--ink)', fontWeight: 500}}>{it.actor}</span>
                      <span style={{flex: 1}} />
                      <span className="mono" style={{fontSize: 10, color:'var(--muted)'}}>{it.target}</span>
                    </div>
                    <div style={{fontSize: 11.5, color:'var(--ink-mid)', lineHeight: 1.4}}>{it.detail}</div>
                  </button>
                );
              }
              // future
              return (
                <div key={it.id} style={{padding:'9px 18px', borderBottom:'1px solid var(--hair-soft)'}}>
                  <div className="mono" style={{fontSize: 9.5, letterSpacing:'.10em', color:'var(--muted)', marginBottom: 2}}>
                    {it.time.toUpperCase()}
                  </div>
                  <div style={{fontSize: 12.5, color:'var(--ink)', lineHeight: 1.4}}>{it.actor}</div>
                  <div style={{fontSize: 11, color:'var(--muted)', marginTop: 2}}>{it.target} · {it.detail}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── RegionClusterStrip — geographic at-glance ─
function RegionClusterStrip({ clusters, onOpen }) {
  return (
    <div style={{marginBottom: 32}}>
      <div className="mono" style={{
        fontSize: 10.5, letterSpacing:'.18em', color:'var(--muted)',
        marginBottom: 12, fontWeight: 500,
      }}>BY REGION · {clusters.length} CLUSTERS</div>
      <div style={{display:'grid', gridTemplateColumns: `repeat(${clusters.length}, 1fr)`, gap: 10}}>
        {clusters.map(c => {
          const hot = c.at_risk > 0;
          const needs = c.needs_you > 0;
          const accent = hot ? 'var(--risk)' : needs ? 'var(--warn)' : c.live > 0 ? 'var(--info)' : 'var(--ok)';
          return (
            <button key={c.id} onClick={() => onOpen('properties')} style={{
              all:'unset', cursor:'pointer',
              padding:'12px 14px', borderRadius: 10,
              background:'#ffffff', border:'1px solid var(--hair)',
              borderLeft: `3px solid ${accent}`,
              transition: 'background .1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-2)'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
              <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap: 6, marginBottom: 4}}>
                <span style={{fontSize: 13, fontWeight: 600, color:'var(--ink)'}}>{c.label}</span>
                <span className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.06em'}}>{c.properties}p</span>
              </div>
              <div style={{display:'flex', gap: 6, marginBottom: 4, fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.04em'}}>
                <span style={{color: c.live > 0 ? 'var(--ink)' : 'var(--muted-2)'}}>{c.live} live</span>
                {c.needs_you > 0 && <span style={{color:'var(--warn)'}}>· {c.needs_you} need you</span>}
                {c.at_risk > 0 && <span style={{color:'var(--risk)'}}>· {c.at_risk} at risk</span>}
              </div>
              <div style={{fontSize: 11, color:'var(--muted)', lineHeight: 1.45}}>{c.note}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── ActivityTicker — pulse strip at the bottom of Today ─
function ActivityTicker({ stream }) {
  const verbColor = {
    drafting:    '#5E6AD2',
    'message in':'#5E6AD2',
    confirmed:   '#00A699',
    'auto-sent': '#00A699',
    approved:    '#00A699',
  };
  return (
    <div style={{
      marginTop: 24, paddingTop: 18,
      borderTop:'1px solid var(--hair-soft)',
    }}>
      <div className="mono" style={{
        fontSize: 9.5, letterSpacing:'.18em', color:'var(--muted)',
        marginBottom: 12, fontWeight: 500, display:'flex', alignItems:'center', gap: 10,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius:999, background:'var(--ok)',
          animation: 'tickerPulse 2s ease-in-out infinite',
        }} />
        LIVE · WHAT CENDRA IS HANDLING
      </div>
      <style>{`@keyframes tickerPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      <div style={{display:'grid', gap: 6}}>
        {stream.slice(0, 5).map((e, i) => {
          const c = verbColor[e.verb] || 'var(--ink-mid)';
          return (
            <div key={e.id} style={{
              display:'grid', gridTemplateColumns: '64px 100px 90px 1fr 70px',
              gap: 14, alignItems:'baseline',
              padding:'4px 0',
              opacity: 1 - (i * 0.08),
            }}>
              <span className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.04em'}}>{e.time}</span>
              <span style={{fontSize: 12, color:'var(--ink-mid)'}}>{e.actor}</span>
              <span className="mono" style={{fontSize: 10.5, color: c, letterSpacing:'.04em', fontWeight: 600, textTransform: 'uppercase'}}>{e.verb}</span>
              <span style={{fontSize: 12, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{e.target}</span>
              <span className="mono" style={{fontSize: 9.5, color:'var(--muted-2)', letterSpacing:'.10em', textAlign:'right', textTransform:'uppercase'}}>{e.channel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeroPriorityCard({ hero, onOpen }) {
  const isHigh = hero.risk === "high";
  const accentColor = isHigh ? 'var(--rausch)' : 'var(--ink)';
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--hair)',
      borderRadius: 16,
      padding: '32px 36px 28px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top-left accent bar */}
      <div style={{
        position:'absolute', top:0, left:0, width: 4, height: '100%',
        background: accentColor,
      }} />

      <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 18}}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.18em',
          color: accentColor, fontWeight: 600,
        }}>FIRST PRIORITY</span>
        <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
        <span className="mono" style={{fontSize:10, letterSpacing:'.12em', color:'var(--muted)'}}>
          WAITED {hero.waited} · {hero.reason.toUpperCase()}
        </span>
        <span style={{flex:1}} />
        <Pill tone={isHigh ? 'risk' : 'warn'}>{hero.autonomy === "never" ? "Never auto" : "Approval"}</Pill>
      </div>

      <h2 className="serif-display" style={{
        fontSize: 36, lineHeight: 1.1, margin: 0, color: 'var(--ink)',
        maxWidth: 760, marginBottom: 14,
      }}>
        {hero.title}
      </h2>
      <p style={{
        margin: 0, fontSize: 15, lineHeight: 1.55,
        color: 'var(--ink-mid)', maxWidth: 720,
      }}>{hero.sub}</p>

      <div style={{display:'flex', alignItems:'center', gap: 14, marginTop: 28, flexWrap:'wrap'}}>
        <button onClick={onOpen} style={{
          all: 'unset', cursor: 'pointer',
          background: 'var(--ink)', color: '#ffffff',
          padding: '14px 24px', borderRadius: 10,
          fontSize: 15, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          letterSpacing: '-.005em',
          transition: 'background .12s, transform .06s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#000000'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
        onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}
        onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {hero.action}
          <span style={{fontFamily:'var(--mono)', fontSize:13, opacity:.8}}>↵</span>
        </button>
        <Btn kind="ghost">Why this first?</Btn>
        <span style={{flex:1}} />
        <span className="mono" style={{fontSize:10.5, color:'var(--muted)', letterSpacing:'.06em'}}>
          {hero.owner}
        </span>
      </div>
    </div>
  );
}

// DIGEST row — collapsed by default, click to expand
function DigestRow({ label, hint, count, tone, expanded, onToggle, children, seeAllRoute, seeAllArg, seeAllCount, onOpen }) {
  const dotColor = tone === 'risk' ? 'var(--risk)' : tone === 'warn' ? 'var(--warn)' : tone === 'ok' ? 'var(--ok)' : 'var(--ink)';
  return (
    <div style={{background:'#ffffff'}}>
      <button onClick={onToggle} style={{
        all:'unset', cursor:'pointer', display:'grid',
        gridTemplateColumns: '12px 1fr auto auto', gap: 14,
        alignItems:'center', padding:'18px 24px', width:'calc(100% - 48px)',
        transition: 'background .1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
      onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
        <span style={{width:8, height:8, borderRadius:'50%', background: dotColor}} />
        <div style={{minWidth:0}}>
          <div style={{fontSize: 15, fontWeight: 500, color:'var(--ink)', marginBottom: 2}}>{label}</div>
          <div style={{fontSize: 13, color:'var(--muted)'}}>{hint}</div>
        </div>
        <span className="mono" style={{fontSize:11, color:'var(--muted)', letterSpacing:'.08em'}}>
          {expanded ? 'COLLAPSE' : 'PEEK'}
        </span>
        <span style={{
          fontFamily:'var(--mono)', fontSize: 14, color: 'var(--ink-mid)',
          transform: expanded ? 'rotate(90deg)' : 'rotate(0)',
          transition: 'transform .15s',
        }}>›</span>
      </button>
      {expanded && (
        <div style={{borderTop:'1px solid var(--hair-soft)', background:'var(--paper)'}}>
          {children}
          {seeAllRoute && seeAllCount > 0 && onOpen && (
            <button onClick={(e) => { e.stopPropagation(); onOpen(seeAllRoute, seeAllArg); }} style={{
              all:'unset', cursor:'pointer', display:'flex',
              alignItems:'center', justifyContent:'center', gap: 8,
              padding:'14px 24px', width:'calc(100% - 48px)',
              fontFamily:'var(--mono)', fontSize: 11, letterSpacing:'.08em',
              color:'var(--ink)', fontWeight: 600,
              borderTop:'1px solid var(--hair-soft)',
            }}>
              See all {seeAllCount} in Work →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DigestItem({ title, sub, reason, action, value, onClick }) {
  return (
    <button onClick={onClick} style={{
      all:'unset', cursor:'pointer', display:'grid',
      gridTemplateColumns: '1fr 200px auto', gap: 18,
      alignItems:'center', padding:'14px 24px 14px 46px', width:'calc(100% - 70px)',
      borderBottom: '1px solid var(--hair-soft)',
      transition: 'background .1s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#ffffff'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div>
        <div style={{fontSize: 13.5, fontWeight: 500, color:'var(--ink)', marginBottom: 2}}>{title}</div>
        <div style={{fontSize: 12.5, color:'var(--muted)', lineHeight: 1.4}}>{sub}</div>
      </div>
      <div className="mono" style={{fontSize:11, color:'var(--muted)', letterSpacing:'.06em'}}>{reason}</div>
      <div style={{display:'flex', alignItems:'center', gap: 12}}>
        {value && <span className="mono" style={{fontSize:13, color:'var(--ok)', fontWeight:600}}>{value}</span>}
        <span className="mono" style={{fontSize:11, color:'var(--ink)', letterSpacing:'.04em'}}>{action} →</span>
      </div>
    </button>
  );
}

function MicroStat(props) {
  return <window.CendraAtoms2.Stat {...props} />;
}

// Today v2 atoms — signal strip, portfolio filter, sections, rows
function TodaySignalStrip({ signals, onOpen }) {
  const cells = [
    { label: "Cendra handled",     value: signals.actions_total.toLocaleString(), foot: signals.actions_delta, tone: "ink" },
    { label: "Need you",           value: signals.needs_you, foot: `${signals.approvals} approvals`, tone: "ink", route: "work" },
    { label: "At risk",            value: signals.risks,     foot: "SLA / sentiment",        tone: "warn" },
    { label: "Missing facts",      value: signals.missing_facts, foot: "blocking automation", tone: "warn", route: "properties" },
    { label: "Revenue opp.",       value: `€${signals.revenue_eur}`, foot: "this week",       tone: "ok" },
    { label: "Incidents",          value: signals.incidents, foot: "0 in 30d",                tone: "ok" },
    { label: "Ready to promote",   value: signals.promotions_ready, foot: "Late checkout",   tone: "ink", route: "autopilot" },
  ];
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:`repeat(${cells.length}, 1fr)`,
      gap: 0,
      border:'1px solid var(--hair)',
      background:'var(--card)',
      borderRadius: 6,
      marginBottom: 18,
    }}>
      {cells.map((c, i) => {
        const valueColor = c.tone === 'warn' ? 'var(--warn)' : c.tone === 'ok' ? 'var(--ok)' : 'var(--ink)';
        return (
          <button key={i} onClick={() => c.route && onOpen(c.route)} style={{
            all:'unset', cursor: c.route ? 'pointer' : 'default',
            padding: '14px 16px',
            borderLeft: i === 0 ? 'none' : '1px solid var(--hair-soft)',
            display:'flex', flexDirection:'column', gap:4,
          }}>
            <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.16em', textTransform:'uppercase'}}>{c.label}</div>
            <div style={{fontFamily:'var(--mono)', fontSize: 22, fontWeight: 500, color: valueColor, lineHeight: 1.1}}>{c.value}</div>
            <div className="mono dim" style={{fontSize:10.5}}>{c.foot}</div>
          </button>
        );
      })}
    </div>
  );
}

function PortfolioFilterBar({ filter, onChange }) {
  const chips = [
    { id: "all", label: "All properties", count: DP.portfolio.properties_count },
    { id: "owner", label: "By owner", count: DP.portfolio.owners.length },
    { id: "region", label: "By region", count: DP.portfolio.regions.length },
    { id: "channel", label: "By channel", count: DP.portfolio.channels.length },
    { id: "group", label: "Property group", count: DP.portfolio.groups.length },
    { id: "sla", label: "SLA risk", count: 14 },
    { id: "wf", label: "Workflow", count: 21 },
  ];
  return (
    <div style={{
      display:'flex', gap:6, flexWrap:'wrap', marginBottom: 26,
      paddingBottom: 14, borderBottom:'1px solid var(--hair-soft)',
    }}>
      <span className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em', alignSelf:'center', marginRight: 8}}>SCOPE ·</span>
      {chips.map(c => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={CendraAtoms.cls("btn", "btn-sm", filter === c.id && "btn-primary")}
        >
          {c.label} <span className="mono" style={{opacity:.55, marginLeft:4, fontSize:10.5}}>{c.count}</span>
        </button>
      ))}
    </div>
  );
}

function TodaySection({ title, eyebrow, accent, children }) {
  const accentColor = accent === 'risk' ? 'var(--risk)' : accent === 'warn' ? 'var(--warn)' : accent === 'ok' ? 'var(--ok)' : 'var(--ink)';
  return (
    <section style={{marginBottom: 32}}>
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 12, gap: 14}}>
        <div style={{display:'flex', alignItems:'baseline', gap: 12}}>
          <span style={{width:6, height:6, borderRadius:'50%', background: accentColor, transform:'translateY(-2px)'}} />
          <h2 style={{fontFamily:'var(--serif)', fontSize: 24, fontWeight: 400, letterSpacing:'-.005em', margin: 0, lineHeight: 1.15}}>{title}</h2>
        </div>
        <span className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em'}}>{eyebrow}</span>
      </div>
      <div className="dcard" style={{padding: 0}}>{children}</div>
    </section>
  );
}

function TodayRow({ children, onClick, lastChild, columns }) {
  return (
    <button
      onClick={onClick}
      style={{
        all:'unset', cursor:'pointer', display:'grid',
        gridTemplateColumns: columns,
        alignItems:'center', gap:14,
        padding:'14px 18px', width:'calc(100% - 36px)',
        borderBottom: lastChild ? 'none' : '1px solid var(--hair-soft)',
      }}
    >{children}</button>
  );
}

function NeedsDecisionRow({ item, onOpen }) {
  const isLast = item === DP.today_sections.needs_decision[DP.today_sections.needs_decision.length-1];
  const open = () => {
    const r = item.route || "work";
    if (r.includes(":")) { const [n,a] = r.split(":"); onOpen(n,a); } else onOpen(r);
  };
  return (
    <TodayRow onClick={open} lastChild={isLast} columns="80px 1fr 200px 130px 110px 90px">
      <div className="mono dim" style={{fontSize:11}}>{item.waited}</div>
      <div>
        <div style={{fontSize:14, fontWeight:500, marginBottom:3}}>{item.title}</div>
        <div className="dim" style={{fontSize:12.5, lineHeight:1.4}}>{item.sub}</div>
      </div>
      <div className="mono dim" style={{fontSize:11, lineHeight:1.4}}>{item.reason}</div>
      <AutonomyPill state={item.autonomy} />
      
      <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--ink)', textAlign:'right'}}>{item.action} →</span>
    </TodayRow>
  );
}

function RiskRow({ item, onOpen }) {
  const isLast = item === DP.today_sections.risk_sla[DP.today_sections.risk_sla.length-1];
  return (
    <TodayRow onClick={() => onOpen("work")} lastChild={isLast} columns="1fr 220px 110px 110px">
      <div>
        <div style={{fontSize:14, fontWeight:500, marginBottom:3}}>{item.title}</div>
        <div className="dim" style={{fontSize:12.5}}>{item.sub}</div>
      </div>
      <div className="mono dim" style={{fontSize:11}}>{item.reason}</div>
      <Pill tone={item.risk === "high" ? "risk" : "warn"}>{item.risk?.toUpperCase()}</Pill>
      <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--ink)', textAlign:'right'}}>{item.action} →</span>
    </TodayRow>
  );
}

function RevenueRow({ item, onOpen }) {
  const isLast = item === DP.today_sections.revenue[DP.today_sections.revenue.length-1];
  return (
    <TodayRow onClick={() => onOpen("work")} lastChild={isLast} columns="1fr 200px 100px 130px">
      <div>
        <div style={{fontSize:14, fontWeight:500, marginBottom:3}}>{item.title}</div>
        <div className="dim" style={{fontSize:12.5}}>{item.sub}</div>
      </div>
      <div className="mono dim" style={{fontSize:11}}>{item.property}</div>
      <div className="mono" style={{fontSize:13, color:'var(--ok)'}}>+€{item.est_eur}</div>
      <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--ink)', textAlign:'right'}}>{item.action} →</span>
    </TodayRow>
  );
}

function MissingRow({ item, onOpen }) {
  const isLast = item === DP.today_sections.missing_knowledge[DP.today_sections.missing_knowledge.length-1];
  return (
    <TodayRow onClick={() => onOpen("properties")} lastChild={isLast} columns="180px 1fr 100px 130px">
      <div className="mono" style={{fontSize:12, color:'var(--ink)'}}>{item.scope}</div>
      <div style={{fontSize:14}}>{item.fact}</div>
      <div className="mono dim" style={{fontSize:11}}>{item.asks ? `${item.asks} asks` : "conflict"}</div>
      <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--ink)', textAlign:'right'}}>{item.action} →</span>
    </TodayRow>
  );
}

// Day Spine — the bold/novel hero composition
function DaySpine({ onOpen, tweaks }) {
  const exc = D.exceptions;
  return (
    <section>
      <div className="eyebrow mb-2" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span>NEEDS YOU · {D.exceptions.length} ITEMS · ORDERED BY URGENCY</span>
        <span className="mono">{new Date().toISOString().slice(0,10)}</span>
      </div>

      <div className="day-spine" style={{
        display:'grid',
        gridTemplateColumns:'1fr 84px 1fr',
        gap: 0,
        position:'relative',
        background: 'var(--card)',
        border: '1px solid var(--hair)',
        borderRadius: 6,
      }}>
        {/* Spine center column */}
        <div className="spine-center spine-divider" style={{
          gridColumn: 2,
          gridRow: '1 / -1',
          background: 'var(--paper)',
          borderLeft: '1px solid var(--hair)',
          borderRight: '1px solid var(--hair)',
          position: 'relative',
        }}>
          <div style={{
            position:'absolute', left:'50%', top: 0, bottom: 0,
            width: 1, background: 'var(--hair)',
          }} />
        </div>

        {/* Header row */}
        <div className="spine-head-left" style={{padding:'12px 18px', borderBottom:'1px solid var(--hair)', display:'flex',justifyContent:'space-between'}}>
          <span className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em'}}>NEEDS YOU</span>
          <span className="mono dim" style={{fontSize:10.5}}>{exc.length}</span>
        </div>
        <div className="spine-head-center" style={{borderBottom:'1px solid var(--hair)', textAlign:'center', padding:'12px 0'}}>
          <span className="mono dim" style={{fontSize:9.5, letterSpacing:'.2em'}}>SPINE</span>
        </div>
        <div className="spine-head-right" style={{padding:'12px 18px', borderBottom:'1px solid var(--hair)', textAlign:'right'}}>
          <span className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em'}}>HANDLED BY CENDRA</span>
        </div>

        {/* Spine items */}
        {exc.map((e, i) => (
          <SpineRow key={e.id} exc={e} idx={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

function SpineRow({ exc, idx, onOpen }) {
  const handledOnRight = D.done[idx % D.done.length];
  const tone = exc.tone || "info";
  return (
    <>
      {/* LEFT: exception card */}
      <div className="spine-row spine-left" style={{padding:'18px 20px', borderBottom: idx === D.exceptions.length-1 ? 'none' : '1px solid var(--hair-soft)'}}>
        <button
          onClick={() => onOpen('work_detail', exc.id)}
          style={{all:'unset', display:'block', cursor:'pointer', width:'100%'}}
        >
          <div style={{display:'flex', gap:8, marginBottom:8, flexWrap:'wrap', alignItems:'center'}}>
            <ReasonPill kind={exc.kind} />
            <Pill tone={tone === "risk" ? "risk" : "info"}><span className="mono" style={{fontSize:10.5}}>{exc.waiting} waiting</span></Pill>
            <window.CendraVision.ChannelChip channel={exc.channel} />
          </div>
          <h3 style={{fontFamily:'var(--serif)', fontSize: 22, lineHeight:1.18, fontWeight:400, margin:'4px 0 6px', letterSpacing:'-.005em'}}>
            {exc.title}
          </h3>
          <p className="dim" style={{margin:'0 0 8px', fontSize:13, lineHeight:1.5}}>{exc.summary}</p>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 10}}>
            <div className="mono dim" style={{fontSize:10.5}}>
              {exc.guest !== "—" ? exc.guest : "—"} · {exc.property} · {exc.channel}
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              
              <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--ink)'}}>OPEN →</span>
            </div>
          </div>
        </button>
      </div>

      {/* CENTER: spine marker */}
      <div className="spine-center" style={{
        position:'relative',
        display:'flex', alignItems:'center', justifyContent:'center',
        borderBottom: idx === D.exceptions.length-1 ? 'none' : '1px solid var(--hair-soft)',
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: exc.tone === 'risk' ? 'var(--risk)' : exc.tone === 'warn' ? 'var(--warn)' : exc.tone === 'ok' ? 'var(--ok)' : 'var(--info)',
          border: '3px solid var(--paper)',
          boxShadow: '0 0 0 1px var(--hair)',
          zIndex: 2,
          position:'relative',
        }} />
      </div>

      {/* RIGHT: handled by cendra (small/quiet) */}
      <div className="spine-right" style={{padding:'18px 20px', borderBottom: idx === D.exceptions.length-1 ? 'none' : '1px solid var(--hair-soft)', textAlign:'right'}}>
        <div className="mono dim" style={{fontSize:10.5, letterSpacing:'.04em', marginBottom: 6}}>{handledOnRight.time} · {handledOnRight.workflow}</div>
        <div style={{fontSize:13, color:'var(--ink-mid)', lineHeight:1.45, marginBottom: 4}}>{handledOnRight.title}</div>
        <div className="mono dim" style={{fontSize:10.5}}>{handledOnRight.who}</div>
        <div style={{display:'inline-flex',marginTop:8}}>
          <AutonomyPill state={handledOnRight.autonomy} />
        </div>
      </div>
    </>
  );
}

// Variant: stack (more conventional inbox-card list)
function ExceptionStack({ onOpen }) {
  return (
    <div className="col gap-3">
      {D.exceptions.map(e => (
        <button key={e.id} onClick={() => onOpen('work_detail', e.id)} className="dcard" style={{all:'unset', cursor:'pointer', display:'block'}}>
          <div className="dcard-head">
            <div className="dcard-from">FROM CENDRA · {e.waiting} WAITING</div>
            <div style={{display:'flex',gap:6}}>
              <ReasonPill kind={e.kind} />
            </div>
          </div>
          <div className="dcard-body">
            <h3 className="dcard-title">{e.title}</h3>
            <p style={{margin:0, color:'var(--ink-mid)'}}>{e.summary}</p>
          </div>
          <div className="dcard-foot">
            <div className="dcard-trust">{e.property} · {e.channel}</div>
            
          </div>
        </button>
      ))}
    </div>
  );
}

// Variant: ledger (tabular, ops-heavy)
function LedgerView({ onOpen }) {
  return (
    <div className="dcard" style={{padding:0}}>
      <table className="table">
        <thead>
          <tr>
            <th style={{width:90}}>Waited</th>
            <th>Subject</th>
            <th style={{width:160}}>Property</th>
            <th style={{width:160}}>Reason</th>
            <th style={{width:120}}>Risk</th>
            <th style={{width:100}}></th>
          </tr>
        </thead>
        <tbody>
          {D.exceptions.map(e => (
            <tr key={e.id} onClick={() => onOpen('work_detail', e.id)} style={{cursor:'pointer'}}>
              <td className="mono dim">{e.waiting}</td>
              <td>
                <div style={{fontWeight:500}}>{e.title}</div>
                <div className="dim" style={{fontSize:12}}>{e.guest !== "—" ? e.guest : ""} · {e.channel}</div>
              </td>
              <td className="mono dim">{e.property}</td>
              <td><ReasonPill kind={e.kind} /></td>
              <td><Pill tone={e.tone}>{e.risk?.toUpperCase()}</Pill></td>
              <td><Btn size="sm">Open →</Btn></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// GUESTS — journey-centric view (replaces the old work queue)
// Past stays are excluded by design. This is who's in your home + who's arriving.
// ───────────────────────────────────────────────────────────────────
function WorkScreen({ onOpen }) {
  const J = DP.guests_journey;

  // Flatten all active guests, partition by status
  const allActive = [...J.checking_in_today, ...J.in_house, ...J.checking_out_today];
  const needsYou = allActive.filter(g => g.status === "needs_you");
  const waiting = allActive.filter(g => g.status === "waiting");
  const allGood = allActive.filter(g => g.status === "all_good");

  // The narrative — who's first on Maya's plate
  const firstPriority = needsYou[0] || waiting[0];
  const stageOf = (g) => J.checking_in_today.includes(g) ? "checking in today"
    : J.checking_out_today.includes(g) ? "checking out today"
    : "in-stay";

  return (
    <div className="stage" style={{maxWidth: 980, paddingTop: 56, paddingBottom: 120}}>

      {/* QUIET HEADER */}
      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 28, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>GUESTS · LIVE JOURNEY</span>
        <span style={{flex:1}} />
        <span>{J.in_house.length} STAYING · {J.checking_in_today.length} ARRIVING · {J.checking_out_today.length} DEPARTING</span>
      </div>

      {/* HERO BRIEFING — Cendra speaks (Fraunces display) */}
      <div style={{marginBottom: 56}}>
        <h1 className="serif-display" style={{
          fontSize: 48, lineHeight: 1.05, margin: 0, color: 'var(--ink)',
        }}>
          {allActive.length === 0
            ? <>No stays in flight today.</>
            : <>Your guests, by journey stage.</>
          }
        </h1>
        <p style={{
          fontSize: 16, lineHeight: 1.55, margin: '18px 0 0',
          color: 'var(--ink-mid)', maxWidth: 760,
        }}>
          {needsYou.length > 0
            ? <><b style={{color:'var(--ink)'}}>{needsYou.length} need{needsYou.length === 1 ? 's' : ''} you</b> · {waiting.length} waiting on dependencies · {allGood.length} routine. Today's queue is at the top.</>
            : <>{allActive.length} active · everything routine.</>
          }
        </p>
      </div>

      {/* SAME-DAY TURNOVER TAPE — operational adrenaline up front */}
      <SameDayTurnoverTape turnovers={DP.same_day_turnovers || []} onOpen={onOpen} />

      {/* CHECK-IN WINDOW TIMELINE — next 4h cleaner/guest overlay */}
      <CheckinWindowTimeline data={DP.checkin_windows} />

      {/* REVIEW WINDOW STRIP — stays approaching review-write window */}
      <ReviewWindowStrip windows={DP.review_windows || []} onOpen={onOpen} />

      {/* NEEDS YOU — always open, full cards */}
      {needsYou.length > 0 && (
        <section style={{marginBottom: 56}}>
          <SectionLabel eyebrow={`${needsYou.length} need you`} sub="Cendra is holding. You decide." tone="rausch" />
          <div style={{display:'grid', gap: 12}}>
            {needsYou.map(g => <GuestJourneyCard key={g.id} g={g} onOpen={onOpen} variant={stageOf(g) === "in-stay" ? "stay" : stageOf(g) === "checking in today" ? "arrival" : "departure"} />)}
          </div>
        </section>
      )}

      {/* WAITING — collapsed by default */}
      {waiting.length > 0 && (
        <CollapsibleGroup
          eyebrow={`${waiting.length} waiting`}
          sub="Vendor, guest, or policy. Cendra will resume when ready."
          tone="info"
        >
          <div style={{display:'grid', gap: 12, marginTop: 16}}>
            {waiting.map(g => <GuestJourneyCard key={g.id} g={g} onOpen={onOpen} variant={stageOf(g) === "in-stay" ? "stay" : stageOf(g) === "checking in today" ? "arrival" : "departure"} />)}
          </div>
        </CollapsibleGroup>
      )}

      {/* ALL GOOD — quietest, collapsed */}
      {allGood.length > 0 && (
        <CollapsibleGroup
          eyebrow={`${allGood.length} quiet stays`}
          sub="No contact needed. Routine running."
          tone="ok"
        >
          <div style={{display:'grid', gap: 12, marginTop: 16}}>
            {allGood.map(g => <GuestJourneyCard key={g.id} g={g} onOpen={onOpen} variant="stay" />)}
          </div>
        </CollapsibleGroup>
      )}

      {/* ARRIVING — peek of 3, expand for more */}
      <UpcomingPeek upcoming={J.arriving_week} laterCount={J.arriving_later_count} />
    </div>
  );
}

// Single-section header — eyebrow + accent dot
function SectionLabel({ eyebrow, sub, tone }) {
  const color = tone === 'rausch' ? 'var(--rausch)' : tone === 'risk' ? 'var(--risk)' : tone === 'warn' ? 'var(--warn)' : tone === 'ok' ? 'var(--ok)' : tone === 'info' ? 'var(--info)' : 'var(--ink)';
  return (
    <div style={{display:'flex', alignItems:'baseline', gap: 12, marginBottom: 18}}>
      <span style={{width: 8, height: 8, borderRadius:'50%', background: color, transform:'translateY(-1px)'}} />
      <span className="mono" style={{fontSize: 11, letterSpacing:'.14em', color: 'var(--ink)', fontWeight: 600, textTransform:'uppercase'}}>
        {eyebrow}
      </span>
      {sub && <span style={{fontSize: 13, color:'var(--muted)'}}>· {sub}</span>}
    </div>
  );
}

// Collapsible group — Hick's Law: hide what's not active
function CollapsibleGroup({ eyebrow, sub, tone, children }) {
  const [open, setOpen] = useState(false);
  const color = tone === 'rausch' ? 'var(--rausch)' : tone === 'risk' ? 'var(--risk)' : tone === 'warn' ? 'var(--warn)' : tone === 'ok' ? 'var(--ok)' : tone === 'info' ? 'var(--info)' : 'var(--ink)';
  return (
    <section style={{marginBottom: open ? 56 : 24}}>
      <button onClick={() => setOpen(o => !o)} style={{
        all:'unset', cursor:'pointer', display:'flex',
        alignItems:'center', gap: 12, width: '100%',
        padding: '14px 0', borderTop: '1px solid var(--hair-soft)',
        transition: 'opacity .12s',
      }}>
        <span style={{width: 8, height: 8, borderRadius:'50%', background: color}} />
        <span className="mono" style={{fontSize: 11, letterSpacing:'.14em', color: 'var(--ink)', fontWeight: 600, textTransform:'uppercase'}}>
          {eyebrow}
        </span>
        <span style={{fontSize: 13, color:'var(--muted)'}}>· {sub}</span>
        <span style={{flex:1}} />
        <span className="mono" style={{fontSize: 10.5, letterSpacing:'.08em', color:'var(--muted)'}}>
          {open ? 'COLLAPSE' : 'PEEK'}
        </span>
        <span style={{
          fontFamily:'var(--mono)', fontSize: 16, color:'var(--ink-mid)', width: 14,
          transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .15s',
        }}>›</span>
      </button>
      {open && children}
    </section>
  );
}

// Arriving peek — first 3 + see-all expand + later count
function UpcomingPeek({ upcoming, laterCount }) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? upcoming : upcoming.slice(0, 3);
  return (
    <section style={{marginTop: 64, paddingTop: 28, borderTop: '1px solid var(--hair-soft)'}}>
      <SectionLabel eyebrow={`${upcoming.length} arriving this week`} sub="Cendra is preparing. Flagged only if something blocks." tone="ink" />
      <div style={{display:'grid', gap: 1, background:'var(--hair)', border:'1px solid var(--hair)', borderRadius: 12, overflow:'hidden'}}>
        {shown.map(u => (
          <div key={u.id} style={{
            display:'grid', gridTemplateColumns: '90px 1fr 200px 90px 140px',
            gap: 16, alignItems:'center', padding:'14px 20px',
            background: '#ffffff',
          }}>
            <div>
              <div style={{fontFamily:'var(--serif)', fontSize: 15, color:'var(--ink)', fontVariationSettings:'"opsz" 48, "SOFT" 30'}}>{u.eta_day}</div>
              <div className="mono" style={{fontSize:10.5, color:'var(--muted)', letterSpacing:'.06em'}}>{u.eta_time}</div>
            </div>
            <div style={{fontSize:14, color:'var(--ink)', fontWeight: 500}}>{u.name}</div>
            <div>
              <div style={{fontSize:12.5, color:'var(--ink-mid)'}}>{u.property}</div>
              <div className="mono" style={{fontSize:10.5, color:'var(--muted)', letterSpacing:'.06em'}}>{u.channel}</div>
            </div>
            <div className="mono" style={{fontSize:12, color:'var(--muted)', letterSpacing:'.04em'}}>{u.nights}n</div>
            <div>
              {u.prep_state === "all_set" ? (
                <span style={{fontSize:11.5, color:'var(--ok)', fontWeight: 500}}>● All set</span>
              ) : (
                <Pill tone="warn">{u.flag || u.prep_state}</Pill>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 14}}>
        {upcoming.length > 3 && (
          <button onClick={() => setShowAll(s => !s)} style={{
            all:'unset', cursor:'pointer',
            fontFamily:'var(--mono)', fontSize: 11, letterSpacing:'.08em',
            color:'var(--ink)', textTransform:'uppercase', fontWeight: 600,
          }}>
            {showAll ? '↑ Show first 3' : `↓ See all ${upcoming.length}`}
          </button>
        )}
        <span style={{flex:1}} />
        <span className="mono" style={{fontSize: 10.5, color:'var(--muted-2)', letterSpacing:'.06em'}}>
          + {laterCount} BEYOND THIS WEEK
        </span>
      </div>
    </section>
  );
}

// Status chip — single canonical signal per guest
function GuestStatusChip({ status, reason, slaMin, hidePill }) {
  // When StayHealthBadge is already present (size=lg context), `hidePill` lets
  // us suppress the redundant Needs-you pill and just show context + SLA chip.
  // Avoids competing red signals at the top of the Stay Detail header.
  const map = {
    needs_you: { tone: "warn", label: "Needs you" },
    waiting:   { tone: "info", label: "Waiting" },
    all_good:  { tone: "ok",   label: "All good" },
  };
  const m = map[status] || map.all_good;
  return (
    <div style={{display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap'}}>
      {!hidePill && <Pill tone={m.tone}>{m.label}</Pill>}
      {reason && <span style={{fontSize: 13, color:'var(--ink-mid)'}}>{reason}</span>}
      {slaMin != null && slaMin >= 0 && slaMin < 60 && (
        <span style={{
          fontFamily:'var(--mono)', fontSize: 10.5, color:'var(--warn)',
          padding:'3px 8px', borderRadius: 4,
          background:'var(--warn-soft)', letterSpacing:'.04em',
        }}>{slaMin}M SLA</span>
      )}
      {slaMin != null && slaMin < 0 && (
        <span style={{
          fontFamily:'var(--mono)', fontSize: 10.5, color:'#ffffff',
          padding:'3px 8px', borderRadius: 4,
          background:'var(--risk)', letterSpacing:'.04em',
        }}>+{Math.abs(slaMin)}M BREACHED</span>
      )}
    </div>
  );
}

// Stay progress — slim horizontal bar with night X / Y
function StayProgress({ done, total, checkout }) {
  if (!total) return null;
  const pct = Math.max(0, Math.min(100, (done / total) * 100));
  return (
    <div style={{minWidth: 180}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4}}>
        <span className="mono dim" style={{fontSize:10}}>NIGHT {done}/{total}</span>
        <span className="mono dim" style={{fontSize:10}}>CO · {checkout}</span>
      </div>
      <div style={{height: 3, background:'var(--hair-soft)', borderRadius: 2, overflow:'hidden'}}>
        <div style={{width: `${pct}%`, height:'100%', background:'var(--ink)'}} />
      </div>
    </div>
  );
}

// Individual guest card — Cendra's micro-take + status + stay
// JourneyBreadcrumbInline — compact horizontal stage breadcrumb for Stays cards
function JourneyBreadcrumbInline({ variant }) {
  const activeIdx = variant === 'arrival' ? 2 : variant === 'stay' ? 3 : variant === 'departure' ? 4 : 3;
  const stages = ['Booked', 'Pre-arrival', 'Check-in', 'In-stay', 'Checkout'];
  return (
    <div style={{display:'flex', alignItems:'center', gap: 3, flexWrap:'wrap'}}>
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <span style={{
            fontFamily:'var(--mono)', fontSize: 9.5, letterSpacing:'.06em',
            fontWeight: i === activeIdx ? 700 : 400,
            color: i === activeIdx ? 'var(--ink)' : i < activeIdx ? 'var(--ink-mid)' : 'var(--muted-2)',
            textTransform:'uppercase',
          }}>{s}</span>
          {i < stages.length - 1 && (
            <span style={{fontSize: 8, color: i < activeIdx ? 'var(--ink-mid)' : 'var(--muted-2)'}}>›</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function GuestJourneyCard({ g, onOpen, variant }) {
  const accent = g.status === "needs_you" ? 'var(--warn)' : g.status === "waiting" ? 'var(--info)' : 'var(--ok)';
  const health = deriveStayHealth(g);
  return (
    <button
      onClick={() => onOpen('work_detail', g.id)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: '40px 1fr 220px',
        gap: 16,
        padding: '16px 20px 16px 18px',
        background: 'var(--card)',
        border: '1px solid var(--hair)',
        borderLeft: `3px solid ${accent}`,
        borderRadius: 4,
        transition: 'background .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--card-raised)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius:'50%',
        background: 'var(--ink)', color: 'var(--paper)',
        display:'grid', placeItems:'center',
        fontFamily:'var(--serif)', fontStyle:'italic', fontSize: 16,
        marginTop: 2,
      }}>{g.initial}</div>

      {/* Identity + Cendra take */}
      <div style={{minWidth: 0}}>
        <div style={{display:'flex', alignItems:'baseline', gap:8, marginBottom:4, flexWrap:'wrap'}}>
          <div style={{fontFamily:'var(--serif)', fontSize:18, lineHeight:1.2, letterSpacing:'-.005em'}}>
            {g.name}
          </div>
          <StayHealthBadge health={health} signals={deriveStayHealthSignals(g)} />
          <span className="mono dim" style={{fontSize:10}}>{g.language}</span>
          {g.trips > 0 && <span className="mono dim" style={{fontSize:10}}>· {g.trips} prior</span>}
          <span className="mono dim" style={{fontSize:10}}>· {g.sentiment}</span>
        </div>
        <div style={{marginBottom: 6}}>
          <JourneyBreadcrumbInline variant={variant} />
        </div>
        <div className="mono dim" style={{fontSize:10.5, letterSpacing:'.05em', marginBottom:8}}>
          {g.property} · {g.owner} · {g.channel}
          {variant === "arrival" && g.eta_label && <> · ETA {g.eta_label}</>}
        </div>
        <div className="dim" style={{fontSize:13, lineHeight:1.5, fontStyle:'italic', fontFamily:'var(--serif)', maxWidth:680, marginBottom: 10, color:'var(--ink-mid)'}}>
          "{g.cendra_take.length > 180 ? g.cendra_take.slice(0, 180).trim() + '…' : g.cendra_take}"
        </div>
        <GuestStatusChip status={g.status} reason={g.status_reason} slaMin={g.sla_min} />
      </div>

      {/* Stay progress or arrival ETA */}
      <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'space-between', gap: 8}}>
        {variant === "stay" || variant === "departure" ? (
          <StayProgress done={g.nights_done} total={g.nights_total} checkout={g.checkout_at} />
        ) : (
          <div style={{textAlign:'right'}}>
            <div className="mono dim" style={{fontSize:10}}>ARRIVES</div>
            <div style={{fontFamily:'var(--serif)', fontSize:16, marginTop:2}}>{g.eta_label}</div>
            <div className="mono dim" style={{fontSize:10, marginTop:4}}>OFFICIAL · {g.checkin_official}</div>
          </div>
        )}
        <span className="mono dim" style={{fontSize:10.5, alignSelf:'flex-end'}}>Open journey →</span>
      </div>
    </button>
  );
}

// ───────────────────────────────────────────────────────────────────
// GUEST JOURNEY — conversational briefing per guest
// Brain-first: Cendra speaks, generative components inline, you direct.
// ───────────────────────────────────────────────────────────────────
function WorkDetailScreen({ onOpen, tweaks }) {
  const J = DP.guests_journey;

  // Flat sweep list: in_house first (most live), then arriving today, then departing today.
  const sweep = useMemo(
    () => [...J.in_house, ...J.checking_in_today, ...J.checking_out_today],
    []
  );

  // Resolve current guest from hash arg. Accept legacy "ex_01" → ji_lukas.
  const argFromHash = (location.hash.split(":")[1] || "").trim();
  const legacyMap = { ex_01: "ji_lukas", ex_03: "ji_nora", ex_05: "jh_selin" };
  const wantId = legacyMap[argFromHash] || argFromHash || sweep[0]?.id;
  const initialIdx = Math.max(0, sweep.findIndex(g => g.id === wantId));

  const [idx, setIdx] = useState(initialIdx);
  const [panelOpen, setPanelOpen] = useState(true);
  const [composer, setComposer] = useState("");
  const composerRef = useRef(null);

  const g = sweep[idx] || sweep[0];
  // Hold-Steady on this stay — H key pauses Cendra's autonomy on this stay until released
  const [holdSteady, setHoldSteady] = useState(false);
  if (!g) return null;

  // Keyboard sweep · J/K · H = hold steady
  useEffect(() => {
    const onKey = (e) => {
      const inField = document.activeElement && ["INPUT","TEXTAREA"].includes(document.activeElement.tagName);
      if (inField) return;
      if (e.key === "j" || e.key === "J" || e.key === "ArrowDown") {
        e.preventDefault();
        setIdx(i => Math.min(sweep.length - 1, i + 1));
      } else if (e.key === "k" || e.key === "K" || e.key === "ArrowUp") {
        e.preventDefault();
        setIdx(i => Math.max(0, i - 1));
      } else if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setHoldSteady(h => !h);
      } else if (e.key === "/") {
        e.preventDefault();
        composerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sweep.length]);

  const stageLabel = J.in_house.includes(g) ? "IN-STAY"
    : J.checking_in_today.includes(g) ? "CHECKING IN TODAY"
    : J.checking_out_today.includes(g) ? "CHECKING OUT TODAY"
    : "GUEST";

  const inStay = g.nights_done != null && g.nights_total != null && g.nights_total > 0;

  return (
    <div className="stage" style={{maxWidth: 1100, paddingTop: 40, paddingBottom: 140}}>

      {/* QUIET HEADER — left: back + position, right: conf + facts toggle */}
      {/* Top nav band — compressed: back / stage·position / right side facts toggle */}
      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 28, display: 'flex', gap: 16, alignItems: 'center',
      }}>
        <button onClick={() => onOpen('work')} style={{
          all: 'unset', cursor: 'pointer', letterSpacing: '.14em',
          color: 'var(--muted)',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
          ← ALL GUESTS
        </button>
        <span style={{color: 'var(--ink-mid)'}}>{stageLabel}</span>
        <span style={{color:'var(--ink)'}}>{idx + 1}/{sweep.length}</span>
        <span style={{flex: 1}} />
        <button onClick={() => setPanelOpen(p => !p)} style={{
          all:'unset', cursor:'pointer',
          padding: '4px 10px', borderRadius: 999,
          border: '1px solid var(--hair)', background:'#ffffff',
          fontSize: 10.5, color: 'var(--ink-mid)', letterSpacing:'.08em',
          fontWeight: 500,
        }}>
          {panelOpen ? 'HIDE FACTS' : 'SHOW FACTS'}
        </button>
      </div>

      {/* HOLD STEADY banner — H key pauses Cendra's autonomy on this stay */}
      {holdSteady && (
        <div style={{
          display:'flex', alignItems:'center', gap: 10,
          padding:'10px 16px', marginBottom: 18,
          background: 'rgba(255,56,92,.08)',
          border: '1px solid rgba(255,56,92,.30)',
          borderRadius: 10,
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 5,
            background:'#FF385C', color:'#ffffff',
            display:'grid', placeItems:'center',
            fontFamily:'var(--mono)', fontWeight: 800, fontSize: 13,
          }}>H</span>
          <span style={{fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.16em', color:'#B00037', fontWeight: 700, textTransform:'uppercase'}}>
            Hold steady · armed
          </span>
          <span style={{fontSize: 13, color:'var(--ink)'}}>
            Cendra is paused on this stay. Drafts will queue; nothing auto-sends.
          </span>
          <span style={{flex: 1}} />
          <button onClick={() => setHoldSteady(false)} style={{
            all:'unset', cursor:'pointer',
            padding:'5px 12px', borderRadius: 6,
            background:'var(--ok)', color:'#ffffff',
            fontFamily:'var(--mono)', fontSize: 10.5, letterSpacing:'.10em',
            fontWeight: 700, textTransform:'uppercase',
          }}>Resume</button>
        </div>
      )}

      <div style={{
        display:'grid',
        gridTemplateColumns: panelOpen ? 'minmax(0, 1fr) 280px' : '1fr',
        gap: 40,
        alignItems:'start',
      }}>
        {/* MAIN COLUMN */}
        <div style={{minWidth: 0}}>
          <GuestJourneyHeader g={g} />

          {/* RIGHT NOW strip — what Cendra is currently doing on this stay */}
          <CendraNowStrip g={g} />

          {/* HERO BINDING DECISION — promoted to top of cards (full bleed) */}
          {g.cards.length > 0 && (() => {
            const bindingIdx = g.cards.findIndex(c => c.type === 'abstention' || c.type === 'approval' || c.type === 'policy_hold');
            const heroIdx = bindingIdx === -1 ? 0 : bindingIdx;
            const hero = g.cards[heroIdx];
            const rest = g.cards.filter((_, i) => i !== heroIdx);
            return (
              <div style={{marginTop: 24}}>
                <DecisionLadderHeader total={g.cards.length} current={1} hero />
                <GenerativeCard card={hero} guest={g} />
                {rest.length > 0 && <StayLaddergroup rest={rest} guest={g} startIdx={2} total={g.cards.length} />}
              </div>
            );
          })()}

          {/* PRIOR STAYS — Cendra remembers; surface it */}
          {g.trips > 0 && <PriorStaysStrip g={g} />}

          {/* STAY NARRATIVE — Cendra writes the closing summary */}
          {DP.stay_narratives && DP.stay_narratives[g.id] && <StayNarrativeCard narrative={DP.stay_narratives[g.id]} guest={g} />}

          {/* CENDRA BRIEFING — demoted: smaller, after the binding decision */}
          <div style={{marginTop: 36, paddingTop: 28, borderTop:'1px solid var(--hair-soft)'}}>
            <CendraBriefing g={g} compact />
          </div>

          {/* MICRO STAT BAND — stay/arrival progress (demoted below briefing) */}
          <div style={{
            display:'flex', gap: 32, flexWrap:'wrap',
            paddingTop: 20, paddingBottom: 4, marginTop: 18,
          }}>
            {inStay ? (
              <>
                <GuestStat value={`${g.nights_done}/${g.nights_total}`} label="nights" />
                <GuestStat value={g.checkout_at} label="checkout" />
              </>
            ) : g.eta_label ? (
              <>
                <GuestStat value={g.eta_label.replace(/^Today · /, '')} label="arrives" />
                <GuestStat value={g.checkin_official || '15:00'} label="official ci" />
              </>
            ) : null}
            <GuestStat value={g.trips} label="prior trips" />
            <GuestStat value={g.language} label="language" />
            <span style={{flex:1}} />
            <GuestStat value={g.sla_min != null && g.sla_min < 0 ? `+${Math.abs(g.sla_min)}m` : g.sla_min != null ? `${g.sla_min}m` : '—'} label="sla" tone={g.sla_min != null && g.sla_min < 0 ? 'risk' : g.sla_min != null && g.sla_min < 60 ? 'warn' : null} />
          </div>

          {/* Old generative cards block removed — laddered above */}
          {false && g.cards.length > 0 && (
            <div style={{display:'grid', gap: 14, marginTop: 32}}>
              {g.cards.map((c, i) => <GenerativeCard key={i} card={c} guest={g} />)}
            </div>
          )}

          {/* CONVERSATIONS — raw multi-channel threads */}
          <ConversationsPanel guest={g} />

          {/* FOLLOW-UP CHIPS */}
          {g.follow_ups && g.follow_ups.length > 0 && (
            <div style={{marginTop: 40, paddingTop: 24, borderTop:'1px solid var(--hair-soft)'}}>
              <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 14, fontWeight: 500}}>
                Ask follow-up
              </div>
              <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
                {g.follow_ups.slice(0, 5).map((q, i) => (
                  <button key={i} onClick={() => {
                    // Submit to the global CendraBar — find its input and trigger
                    const bar = Array.from(document.querySelectorAll('div')).find(d => d.style && d.style.position === 'fixed' && d.style.bottom === '20px' && d.style.zIndex === '30');
                    const input = bar?.querySelector('input');
                    if (input) {
                      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                      setter.call(input, q);
                      input.dispatchEvent(new Event('input', { bubbles: true }));
                      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                    }
                  }} style={{
                    all:'unset', cursor:'pointer',
                    padding:'7px 14px', borderRadius: 999,
                    border:'1px solid var(--hair)', background:'#ffffff',
                    fontSize: 12.5, color:'var(--ink-mid)',
                    fontFamily:'var(--sans)', fontWeight: 500,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.color = 'var(--ink)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = 'var(--ink-mid)'; }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — slim static facts panel */}
        {panelOpen && <StaticFactsPanel g={g} stageLabel={stageLabel} />}
      </div>
    </div>
  );
}

// Stat block reused by Guest Journey micro band
function GuestStat({ value, label, tone }) {
  const color = tone === 'risk' ? 'var(--rausch)' : tone === 'warn' ? 'var(--warn)' : tone === 'ok' ? 'var(--ok)' : 'var(--ink)';
  return (
    <div>
      <div style={{
        fontFamily:'var(--sans)', fontSize: 22, fontWeight: 500,
        color, lineHeight: 1.1, letterSpacing:'-.018em',
        fontVariantNumeric:'tabular-nums',
      }}>{value}</div>
      <div style={{
        fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.12em',
        color:'var(--muted)', textTransform:'uppercase', marginTop: 4, fontWeight: 500,
      }}>{label}</div>
    </div>
  );
}

// Guest journey — hero zone: avatar + Fraunces name + sentiment + status chip
function GuestJourneyHeader({ g }) {
  const firstName = g.name.split(' ')[0];
  const rest = g.name.split(' ').slice(1).join(' ');
  return (
    <div style={{display:'flex', alignItems:'center', gap: 22, marginBottom: 8}}>
      <div style={{
        width: 64, height: 64, borderRadius:'50%',
        background: 'var(--ink)', color: '#ffffff',
        display:'grid', placeItems:'center',
        fontFamily:'var(--sans)', fontWeight: 600, fontSize: 24,
        flexShrink: 0, letterSpacing: 0,
      }}>{g.initial}</div>
      <div style={{minWidth: 0, flex:1}}>
        <div className="mono" style={{fontSize: 10.5, letterSpacing:'.18em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 8, fontWeight: 500}}>
          {g.property} · {g.owner} · {g.channel}
        </div>
        <h1 className="serif-display" style={{
          fontSize: 52, lineHeight: 1.04, margin: 0, color:'var(--ink)',
          letterSpacing: '-.022em',
        }}>
          <span style={{fontVariationSettings:'"opsz" 144, "SOFT" 70, "WONK" 1'}}>{firstName}</span>
          {rest ? <> {rest}</> : null}
        </h1>
        <div style={{fontSize: 14, color: 'var(--muted)', marginTop: 10, fontStyle: 'italic', fontFamily: 'var(--serif)'}}>
          {g.sentiment}
        </div>
        <div style={{display:'flex', alignItems:'center', gap: 10, marginTop: 14, flexWrap:'wrap'}}>
          <StayHealthBadge health={deriveStayHealth(g)} size="lg" signals={deriveStayHealthSignals(g)} />
          <GuestStatusChip status={g.status} reason={g.status_reason} slaMin={g.sla_min} hidePill />
        </div>
      </div>
    </div>
  );
}

// RecallWindowActions — the trust unlock for autopilot.
// When PM approves, the card flips to a 60-second "recall window" with a
// progress bar and a Pull back button. After 60s, locked in.
function RecallWindowActions({ card, oneOff, onWhy }) {
  const [phase, setPhase] = useState("pending");  // pending | sent | locked | recalled
  const [remaining, setRemaining] = useState(60);

  useEffect(() => {
    if (phase !== "sent") return;
    if (remaining <= 0) { setPhase("locked"); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, remaining]);

  if (phase === "pending") {
    return (
      <div style={{display:'flex', gap: 8, marginTop: 14, flexWrap:'wrap', alignItems:'center'}}>
        {card.options.map((o, i) => (
          <Btn key={o} kind={i === 0 ? 'primary' : 'default'} size="sm" onClick={i === 0 ? () => { setPhase("sent"); setRemaining(60); } : undefined}>{o}</Btn>
        ))}
        <span style={{flex: 1}} />
        <button onClick={onWhy} style={{
          all:'unset', cursor:'pointer',
          fontFamily:'var(--mono)', fontSize: 10.5, letterSpacing:'.12em',
          color:'var(--ink-mid)', textTransform:'uppercase', fontWeight: 600,
          padding: '6px 10px', borderRadius: 6,
          border:'1px solid var(--hair)',
        }}>
          Why · §10 chain →
        </button>
      </div>
    );
  }

  if (phase === "sent") {
    const pct = (60 - remaining) / 60 * 100;
    return (
      <div style={{
        marginTop: 14, padding:'12px 14px', borderRadius: 10,
        background:'rgba(0,166,153,.06)', border:'1px solid rgba(0,166,153,.30)',
      }}>
        <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8}}>
          <span className="mono" style={{fontSize: 9.5, letterSpacing:'.16em', color:'#00867E', fontWeight: 700, textTransform:'uppercase'}}>
            ✓ Sent · recall window
          </span>
          <span style={{fontSize: 12.5, color:'var(--ink)'}}>
            {card.options[0]} · {oneOff && <em>tagged as one-off · won't be learned</em>}
          </span>
          <span style={{flex: 1}} />
          <span className="mono" style={{fontSize: 12.5, color:'#00867E', fontVariantNumeric:'tabular-nums', fontWeight: 600}}>
            {remaining}s
          </span>
          <button onClick={() => setPhase("recalled")} style={{
            all:'unset', cursor:'pointer',
            padding:'5px 12px', borderRadius: 6,
            background:'#ffffff', border:'1px solid #FF385C',
            color:'#FF385C', fontSize: 11.5, fontWeight: 700,
            fontFamily:'var(--mono)', letterSpacing:'.08em', textTransform:'uppercase',
          }}>
            ⤺ Pull back
          </button>
        </div>
        <div style={{height: 3, borderRadius: 2, background:'rgba(0,166,153,.15)', overflow:'hidden'}}>
          <div style={{
            height: '100%', width: `${100 - pct}%`,
            background:'var(--ok)', transition: 'width 1s linear',
          }} />
        </div>
      </div>
    );
  }

  if (phase === "recalled") {
    return (
      <div style={{
        marginTop: 14, padding:'10px 14px', borderRadius: 10,
        background:'rgba(255,56,92,.06)', border:'1px solid rgba(255,56,92,.30)',
        display:'flex', alignItems:'center', gap: 10,
      }}>
        <span className="mono" style={{fontSize: 9.5, letterSpacing:'.16em', color:'#FF385C', fontWeight: 700, textTransform:'uppercase'}}>
          ⤺ Pulled back
        </span>
        <span style={{fontSize: 12.5, color:'var(--ink-mid)'}}>
          Nothing went out. The decision is reopened.
        </span>
        <span style={{flex: 1}} />
        <button onClick={() => setPhase("pending")} style={{
          all:'unset', cursor:'pointer',
          padding:'4px 10px', borderRadius: 6,
          fontSize: 11, fontWeight: 500,
          color:'var(--ink-mid)', border:'1px solid var(--hair)',
        }}>Reopen</button>
      </div>
    );
  }

  // locked
  return (
    <div style={{
      marginTop: 14, padding:'10px 14px', borderRadius: 10,
      background:'var(--paper-2)', border:'1px solid var(--hair-soft)',
      display:'flex', alignItems:'center', gap: 10,
    }}>
      <span className="mono" style={{fontSize: 9.5, letterSpacing:'.16em', color:'var(--ok)', fontWeight: 700, textTransform:'uppercase'}}>
        ✓ Confirmed
      </span>
      <span style={{fontSize: 12.5, color:'var(--ink-mid)'}}>
        Recall window closed. Logged to the audit trail.
      </span>
    </div>
  );
}

// ReviewWindowStrip — stays approaching their channel review window.
// Audit §8: surface the "likely 3★ unless we close out warmly" pre-emptively.
function ReviewWindowStrip({ windows, onOpen }) {
  if (!windows.length) return null;
  const atRisk = windows.filter(w => w.tone === 'risk' || w.tone === 'warn');
  return (
    <div style={{marginBottom: 32}}>
      <div className="mono" style={{
        fontSize: 10.5, letterSpacing:'.18em', color:'var(--muted)',
        marginBottom: 12, fontWeight: 500, display:'flex', alignItems:'center', gap: 10,
      }}>
        <span>REVIEW WINDOWS · NEXT 7 DAYS</span>
        {atRisk.length > 0 && (
          <span className="mono" style={{fontSize: 9.5, letterSpacing:'.12em', color:'var(--warn)', fontWeight: 700}}>
            · {atRisk.length} AT RISK
          </span>
        )}
        <span style={{flex: 1}} />
        <span className="mono" style={{fontSize: 9.5, color:'var(--muted-2)', letterSpacing:'.06em'}}>
          Close out warmly before the channel asks
        </span>
      </div>
      <div style={{display:'grid', gap: 10}}>
        {windows.map(w => {
          const c = w.tone === 'risk' ? 'var(--risk)' : w.tone === 'warn' ? 'var(--warn)' : 'var(--ok)';
          const driftLabel = w.drift > 0 ? `+${w.drift.toFixed(1)}` : w.drift.toFixed(1);
          return (
            <button key={w.id} onClick={() => onOpen('work_detail', w.stay_id)} style={{
              all:'unset', cursor:'pointer', display:'block',
              padding:'14px 18px', borderRadius: 10,
              background:'#ffffff', border:'1px solid var(--hair)',
              borderLeft: `3px solid ${c}`,
              width:'calc(100% - 38px)',
              transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-2)'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
              <div style={{display:'grid', gridTemplateColumns: '180px 1fr 180px 100px', gap: 16, alignItems:'center'}}>
                <div>
                  <div style={{fontSize: 13.5, color:'var(--ink)', fontWeight: 600}}>{w.guest}</div>
                  <div className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.04em', marginTop: 3}}>
                    {w.property.toUpperCase()} · {w.channel.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div style={{display:'flex', alignItems:'baseline', gap: 8, marginBottom: 4}}>
                    <span className="mono" style={{fontSize: 10, color: c, letterSpacing:'.10em', textTransform:'uppercase', fontWeight: 700}}>
                      {w.window_label}
                    </span>
                    <span style={{fontSize: 11.5, color:'var(--ink-mid)'}}>
                      sentiment {w.sentiment_trajectory}
                    </span>
                  </div>
                  {w.lift_actions.length > 0 ? (
                    <div style={{fontSize: 12, color:'var(--ink-mid)', lineHeight: 1.45}}>
                      <span className="mono" style={{fontSize: 9.5, letterSpacing:'.12em', color:'var(--muted)', textTransform:'uppercase', marginRight: 6}}>Lift</span>
                      {w.lift_actions[0]}
                      {w.lift_actions.length > 1 && <span style={{color:'var(--muted-2)'}}> · +{w.lift_actions.length - 1} more</span>}
                    </div>
                  ) : (
                    <div className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase'}}>
                      No close-out needed · sentiment stable
                    </div>
                  )}
                </div>
                <div>
                  <div className="mono" style={{fontSize: 9, letterSpacing:'.12em', color:'var(--muted)', textTransform:'uppercase'}}>Likely review</div>
                  <div style={{display:'flex', alignItems:'baseline', gap: 6, marginTop: 2}}>
                    <span style={{fontFamily:'var(--serif)', fontSize: 22, color: c, fontWeight: 500, lineHeight: 1, letterSpacing:'-.01em'}}>
                      {w.likely_score.toFixed(1)}
                    </span>
                    <span className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.04em'}}>/ 5</span>
                    <span className="mono" style={{fontSize: 10, color: w.drift < 0 ? 'var(--warn)' : w.drift > 0 ? 'var(--ok)' : 'var(--muted)', marginLeft: 4}}>
                      {driftLabel}
                    </span>
                  </div>
                  <div className="mono" style={{fontSize: 9.5, color:'var(--muted-2)', letterSpacing:'.06em', marginTop: 2}}>
                    vs typical {w.typical_score.toFixed(1)}
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <span className="mono" style={{fontSize: 10, letterSpacing:'.10em', color:'var(--ink-mid)', textTransform:'uppercase'}}>
                    Open stay →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// CheckinWindowTimeline — next 4h with cleaner ETA + guest ETA overlay.
// Audit §8: PMs live by check-in windows. Visualize collisions pre-emptively.
function CheckinWindowTimeline({ data }) {
  if (!data) return null;
  const { now_min, window_start_min, window_end_min, properties } = data;
  const total = window_end_min - window_start_min;
  const pct = (t) => `${((t - window_start_min) / total) * 100}%`;

  const eventMeta = {
    depart:    { color: '#9CA3AF', glyph: '↗', label: 'Depart'   },
    clean_in:  { color: '#5E6AD2', glyph: '◆', label: 'Clean·in' },
    clean_out: { color: '#5E6AD2', glyph: '◇', label: 'Clean·out'},
    arrive:    { color: '#00A699', glyph: '★', label: 'Arrive'   },
    code:      { color: '#0891B2', glyph: '⚿', label: 'Code'     },
  };

  // Time labels every 60min
  const hourMarks = [];
  for (let t = window_start_min; t <= window_end_min; t += 60) {
    const hr = 14 + Math.floor(t / 60); // anchor "now" near 14:00
    const min = t % 60;
    hourMarks.push({ t, label: `${hr.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}` });
  }

  const highRisk = properties.filter(p => p.risk === 'high').length;

  return (
    <div style={{marginBottom: 32}}>
      <div className="mono" style={{
        fontSize: 10.5, letterSpacing:'.18em', color:'var(--muted)',
        marginBottom: 12, fontWeight: 500, display:'flex', alignItems:'center', gap: 10,
      }}>
        <span>CHECK-IN WINDOW · NEXT 4 HOURS</span>
        {highRisk > 0 && (
          <span className="mono" style={{fontSize: 9.5, letterSpacing:'.12em', color:'var(--risk)', fontWeight: 700}}>
            · {highRisk} TIGHT
          </span>
        )}
        <span style={{flex: 1}} />
        <span className="mono" style={{fontSize: 9.5, color:'var(--muted-2)', letterSpacing:'.06em'}}>
          ↗ depart · ◆ clean·in · ◇ clean·out · ★ arrive · ⚿ code
        </span>
      </div>

      <div style={{
        background:'#ffffff', border:'1px solid var(--hair)', borderRadius: 12,
        padding:'14px 18px',
      }}>
        {/* Time axis */}
        <div style={{position:'relative', height: 20, marginBottom: 6, marginLeft: 140}}>
          {hourMarks.map(m => (
            <span key={m.t} className="mono" style={{
              position:'absolute', left: pct(m.t), top: 0,
              fontSize: 9.5, color:'var(--muted)', letterSpacing:'.04em',
              transform: 'translateX(-50%)',
            }}>{m.label}</span>
          ))}
        </div>

        {/* Per-property rows */}
        {properties.map((p, idx) => {
          const risk = p.risk === 'high' ? 'var(--risk)' : p.risk === 'moderate' ? 'var(--warn)' : 'var(--ok)';
          return (
            <div key={p.id} style={{
              display:'grid', gridTemplateColumns: '140px 1fr',
              gap: 8, alignItems:'center',
              padding:'10px 0',
              borderTop: idx === 0 ? 'none' : '1px solid var(--hair-soft)',
            }}>
              <div>
                <div style={{fontSize: 12.5, color:'var(--ink)', fontWeight: 600, lineHeight: 1.3}}>{p.property}</div>
                <div className="mono" style={{fontSize: 9.5, color:'var(--muted)', letterSpacing:'.04em', marginTop: 2}}>{p.guest}</div>
              </div>
              <div style={{position:'relative', height: 32}}>
                {/* Track */}
                <div style={{position:'absolute', left: 0, right: 0, top: '50%', height: 2, background:'var(--hair-soft)', borderRadius: 999, transform:'translateY(-50%)'}} />
                {/* Hour gridlines */}
                {hourMarks.map(m => (
                  <div key={m.t} style={{position:'absolute', left: pct(m.t), top: 6, bottom: 6, width: 1, background:'var(--hair-soft)'}} />
                ))}
                {/* Now indicator */}
                <div style={{position:'absolute', left: pct(now_min), top: 0, bottom: 0, width: 2, background:'#FF385C', zIndex: 2}} />
                <div style={{position:'absolute', left: pct(now_min), top: -6, transform:'translateX(-50%)'}}>
                  <span className="mono" style={{fontSize: 7.5, color:'#FF385C', fontWeight: 700, letterSpacing:'.10em'}}>NOW</span>
                </div>
                {/* Events */}
                {p.events.map(e => {
                  const m = eventMeta[e.kind] || eventMeta.arrive;
                  return (
                    <div key={e.id} style={{
                      position:'absolute', left: pct(e.t), top: '50%',
                      transform:'translate(-50%, -50%)',
                      display:'flex', flexDirection:'column', alignItems:'center', gap: 1,
                      zIndex: 3,
                    }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: 999,
                        background: m.color, color:'#ffffff',
                        display:'grid', placeItems:'center',
                        fontFamily:'var(--mono)', fontSize: 11, fontWeight: 700,
                        border:'2px solid #ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,.18)',
                      }} title={`${m.label} · ${e.label}`}>{m.glyph}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Notes row — only show for tight risks */}
        {properties.some(p => p.risk === 'high' || p.risk === 'moderate') && (
          <div style={{marginTop: 10, paddingTop: 10, borderTop:'1px solid var(--hair-soft)', display:'grid', gap: 6}}>
            {properties.filter(p => p.risk === 'high' || p.risk === 'moderate').map(p => {
              const c = p.risk === 'high' ? 'var(--risk)' : 'var(--warn)';
              return (
                <div key={p.id} style={{display:'flex', alignItems:'center', gap: 8, fontSize: 11.5}}>
                  <span style={{width: 5, height: 5, borderRadius: 999, background: c}} />
                  <span className="mono" style={{fontSize: 9.5, letterSpacing:'.10em', color: c, fontWeight: 700, textTransform:'uppercase'}}>{p.property}</span>
                  <span style={{color:'var(--ink-mid)'}}>{p.note}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// SameDayTurnoverTape — operational adrenaline of short-stay ops up front.
// Shows the day's turnovers with cleaner ETA + next-guest ETA overlay so PMs
// can see at-glance which ones are tight.
function SameDayTurnoverTape({ turnovers, onOpen }) {
  if (!turnovers.length) return null;
  const high = turnovers.filter(t => t.risk === 'high').length;
  const trim = turnovers.filter(t => t.risk === 'moderate').length;
  return (
    <div style={{
      marginBottom: 28, padding:'12px 16px',
      background: high > 0 ? 'rgba(255,56,92,.04)' : 'rgba(255,180,0,.04)',
      border:'1px solid ' + (high > 0 ? 'rgba(255,56,92,.24)' : 'rgba(255,180,0,.24)'),
      borderRadius: 12,
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8}}>
        <span style={{
          width: 24, height: 24, borderRadius: 5,
          background: high > 0 ? '#FF385C' : '#FFB400', color:'#ffffff',
          display:'grid', placeItems:'center',
          fontFamily:'var(--mono)', fontSize: 13, fontWeight: 800,
        }}>↹</span>
        <span className="mono" style={{fontSize: 10.5, letterSpacing:'.16em', color: high > 0 ? '#B00037' : '#B45309', fontWeight: 700, textTransform:'uppercase'}}>
          Same-day turnovers · {turnovers.length}
        </span>
        {high > 0 && (
          <span className="mono" style={{
            fontSize: 9.5, letterSpacing:'.12em', color:'#B00037', fontWeight: 700, textTransform:'uppercase',
            padding:'2px 7px', borderRadius: 3,
            background:'rgba(255,56,92,.10)', border:'1px solid rgba(255,56,92,.30)',
          }}>{high} tight</span>
        )}
        <span style={{fontSize: 13, color:'var(--ink)'}}>
          {high > 0 ? "Cleaner-to-guest windows that don't have buffer." : "All windows comfortable."}
        </span>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap: 8}}>
        {turnovers.map(t => {
          const c = t.risk === 'high' ? 'var(--risk)' : t.risk === 'moderate' ? 'var(--warn)' : 'var(--ok)';
          return (
            <div key={t.id} style={{
              padding:'8px 12px', borderRadius: 8,
              background:'#ffffff', border:`1px solid ${c}30`,
              borderLeft: `3px solid ${c}`,
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 4}}>
                <span style={{fontSize: 13, color:'var(--ink)', fontWeight: 600}}>{t.property}</span>
                <span className="mono" style={{fontSize: 10, color: c, letterSpacing:'.10em', textTransform:'uppercase', fontWeight: 700}}>
                  {t.risk}
                </span>
              </div>
              <div className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.04em', marginBottom: 3}}>
                {t.out_at} · CLEAN {t.clean_eta} · NEXT {t.next_eta}
              </div>
              <div style={{fontSize: 11.5, color:'var(--ink-mid)', lineHeight: 1.45}}>{t.note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// StayNarrativeCard — Cendra writes the closing one-paragraph summary
// when a stay reaches checkout. Send-to-guest / send-to-owner / archive.
// Audit §15: "When the stay closes, Cendra produces a one-paragraph summary."
function StayNarrativeCard({ narrative, guest }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(narrative.summary);
  const stageCopy = narrative.stage === 'checkout_today'
    ? 'Stay narrative · ready for checkout'
    : narrative.stage === 'post_stay'
    ? 'Stay narrative · post-stay'
    : 'Stay narrative · live draft';

  return (
    <div style={{marginTop: 28}}>
      <div className="mono" style={{
        fontSize: 9.5, letterSpacing:'.16em', color:'var(--ink)',
        fontWeight: 700, textTransform:'uppercase', marginBottom: 10,
        display:'flex', alignItems:'center', gap: 10,
      }}>
        {stageCopy}
        <span style={{fontFamily:'var(--mono)', fontSize: 9.5, color:'var(--muted)', fontWeight: 500}}>
          Cendra · {narrative.generated_at}
        </span>
        <span style={{flex: 1}} />
        <button onClick={() => setEditing(e => !e)} style={{
          all:'unset', cursor:'pointer',
          fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.10em',
          color:'var(--ink-mid)', fontWeight: 600, textTransform:'uppercase',
        }}>{editing ? '✓ Done' : 'Edit'}</button>
      </div>

      <div className="dcard-hero" style={{padding:'22px 26px'}}>
        {/* Serif paragraph — Cendra's voice */}
        {editing ? (
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{
              width: '100%', minHeight: 140, padding: 12,
              fontFamily:'var(--serif)', fontSize: 17, lineHeight: 1.55,
              color:'var(--ink)', border:'1px solid var(--hair)', borderRadius: 8,
              resize:'vertical', outline: 0,
              fontVariationSettings: '"opsz" 48, "SOFT" 30',
            }}
          />
        ) : (
          <p className="serif-display" style={{
            margin: 0, fontSize: 18, lineHeight: 1.55, color:'var(--ink)',
            letterSpacing:'-.004em',
            fontVariationSettings: '"opsz" 48, "SOFT" 30, "WONK" 0',
          }}>
            {body}
          </p>
        )}

        {/* Two-column: key events + next steps */}
        <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 22}}>
          <div>
            <div className="mono" style={{fontSize: 9.5, letterSpacing:'.16em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 8, fontWeight: 600}}>
              Key events
            </div>
            <ul style={{margin: 0, padding:'0 0 0 16px', fontSize: 12.5, lineHeight: 1.65, color:'var(--ink-mid)'}}>
              {narrative.key_events.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
          <div>
            <div className="mono" style={{fontSize: 9.5, letterSpacing:'.16em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 8, fontWeight: 600}}>
              Next steps · pending
            </div>
            <ul style={{margin: 0, padding:'0 0 0 16px', fontSize: 12.5, lineHeight: 1.65, color:'var(--ink)'}}>
              {narrative.next_steps.map((s, i) => <li key={i}><b>{s}</b></li>)}
            </ul>
          </div>
        </div>

        {/* Action row */}
        <div style={{display:'flex', gap: 8, marginTop: 22, paddingTop: 18, borderTop:'1px solid var(--hair-soft)', alignItems:'center', flexWrap:'wrap'}}>
          <Btn kind="primary" size="sm">Send to {guest.name.split(' ')[0]}</Btn>
          <Btn size="sm">Send to {guest.owner}</Btn>
          <Btn size="sm" kind="ghost">Archive as activity log</Btn>
          <span style={{flex: 1}} />
          <span className="mono" style={{fontSize: 9.5, color:'var(--muted-2)', letterSpacing:'.10em', textTransform:'uppercase'}}>
            Cendra-written · you can edit before sending
          </span>
        </div>
      </div>
    </div>
  );
}

// PriorStaysStrip — surface returning-guest history. Cendra knows; UI shows.
// Synthesises N prior stays from g.trips count for the prototype.
function PriorStaysStrip({ g }) {
  // For the prototype, synthesise prior stays based on g.trips count.
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const stays = useMemo(() => {
    const out = [];
    const baseMonth = 4; // May
    for (let i = 0; i < g.trips; i++) {
      const offset = (i + 1) * 5;
      const month = months[(baseMonth - offset + 36) % 12];
      const year = 2026 - Math.floor((offset - baseMonth) / 12 + 1);
      const nights = 2 + (i * 3) % 5;
      const sentiments = ['warm', 'neutral', 'soft-positive'];
      const sentiment = sentiments[i % sentiments.length];
      const tropes = [
        'asked for early check-in · approved',
        'wi-fi reset · resolved by Cendra',
        'late checkout requested · €25 accepted',
        'reported missing towel · cleaner same-day',
      ];
      out.push({
        id: 'past_' + i,
        when: `${month} ${year}`,
        nights,
        sentiment,
        trope: tropes[i % tropes.length],
      });
    }
    return out;
  }, [g.trips]);

  return (
    <div style={{marginTop: 28}}>
      <div className="mono" style={{
        fontSize: 9.5, letterSpacing:'.16em', color:'var(--ink)',
        fontWeight: 700, textTransform:'uppercase', marginBottom: 10,
        display:'flex', alignItems:'center', gap: 10,
      }}>
        Prior stays · {g.trips}
        <span style={{fontFamily:'var(--mono)', fontSize: 9.5, color:'var(--muted)', fontWeight: 500}}>
          Cendra carries this context forward.
        </span>
      </div>
      <div style={{
        display:'grid', gap: 1, background:'var(--hair)', border:'1px solid var(--hair)',
        borderRadius: 8, overflow:'hidden',
      }}>
        {stays.map(s => {
          const sTone = s.sentiment === 'warm' ? 'var(--ok)' : s.sentiment === 'soft-positive' ? 'var(--info)' : 'var(--ink-mid)';
          return (
            <div key={s.id} style={{
              display:'grid', gridTemplateColumns: '90px 70px 100px 1fr',
              gap: 14, padding:'10px 14px', alignItems:'center',
              background:'#ffffff',
            }}>
              <span className="mono" style={{fontSize: 11, color:'var(--muted)', letterSpacing:'.04em'}}>{s.when}</span>
              <span className="mono" style={{fontSize: 11, color:'var(--ink-mid)', letterSpacing:'.04em'}}>{s.nights}n</span>
              <span className="mono" style={{fontSize: 10, color: sTone, letterSpacing:'.06em', textTransform:'uppercase', fontWeight: 600}}>
                {s.sentiment}
              </span>
              <span style={{fontSize: 12.5, color:'var(--ink-mid)'}}>{s.trope}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// CendraNowStrip — right now strip for Stay Detail
// "Cendra is currently waiting on the plumber quote · last signal 14m ago"
function CendraNowStrip({ g }) {
  // Synthesise current activity from guest state
  const activity = (() => {
    if (g.status === 'needs_you' && (g.cards || []).some(c => c.type === 'abstention'))
      return { verb: 'holding', subject: 'for your judgment', detail: g.status_reason || 'awaiting your direction', tone: 'risk' };
    if (g.status === 'needs_you')
      return { verb: 'holding', subject: 'a draft for you',   detail: g.status_reason || 'awaiting your approval',   tone: 'warn' };
    if ((g.cards || []).some(c => c.type === 'dependency'))
      return { verb: 'waiting on', subject: 'a vendor reply', detail: 'last signal coming up',                       tone: 'info' };
    if ((g.cards || []).some(c => c.type === 'promise'))
      return { verb: 'fulfilling', subject: 'a promise',      detail: 'updating guest on progress',                  tone: 'info' };
    return { verb: 'monitoring', subject: 'this stay',        detail: 'no action needed',                            tone: 'ok' };
  })();

  const c = activity.tone === 'risk' ? 'var(--risk)' : activity.tone === 'warn' ? 'var(--warn)' : activity.tone === 'info' ? 'var(--info)' : 'var(--ok)';

  return (
    <div style={{
      display:'flex', alignItems:'center', gap: 10,
      marginTop: 18, marginBottom: 4,
      padding:'8px 14px', borderRadius: 8,
      background: `${c}10`,
      border: `1px solid ${c}30`,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: 999, background: c,
        animation:'nowPulse 1.8s ease-in-out infinite',
      }} />
      <style>{`@keyframes nowPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      <span className="mono" style={{fontSize: 10, letterSpacing:'.14em', color: c, textTransform:'uppercase', fontWeight: 700}}>
        Right now
      </span>
      <span style={{fontSize: 13, color:'var(--ink)'}}>
        Cendra is <b>{activity.verb}</b> {activity.subject} · {activity.detail}
      </span>
    </div>
  );
}

// DecisionLadderHeader — "1 of N · binding · unblocks the others"
function DecisionLadderHeader({ total, current, hero }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 10, marginTop: 18}}>
      <span className="mono" style={{
        fontSize: 9.5, letterSpacing:'.16em', color: hero ? 'var(--rausch)' : 'var(--muted)',
        fontWeight: 700, textTransform:'uppercase',
        padding:'3px 8px', borderRadius: 4,
        background: hero ? 'rgba(255,56,92,.08)' : 'var(--paper-2)',
        border: hero ? '1px solid rgba(255,56,92,.30)' : '1px solid var(--hair)',
      }}>
        {hero ? `Binding · ${current} of ${total}` : `${current} of ${total}`}
      </span>
      {hero && total > 1 && (
        <span className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.06em'}}>
          Unblocks the {total - 1} below
        </span>
      )}
    </div>
  );
}

// StayLaddergroup — secondary cards collapsed below the hero with a toggle
function StayLaddergroup({ rest, guest, startIdx, total }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{marginTop: 20}}>
      <button onClick={() => setOpen(o => !o)} style={{
        all:'unset', cursor:'pointer',
        display:'flex', alignItems:'center', gap: 10,
        padding:'10px 14px', borderRadius: 8,
        background:'var(--paper-2)', border:'1px solid var(--hair-soft)',
        width:'calc(100% - 30px)',
      }}>
        <span className="mono" style={{fontSize: 9.5, letterSpacing:'.16em', color:'var(--ink-mid)', fontWeight: 700, textTransform:'uppercase'}}>
          Next {rest.length} step{rest.length === 1 ? '' : 's'}
        </span>
        <span style={{fontSize: 12, color:'var(--muted)'}}>
          {rest.map(r => r.type).join(' · ')}
        </span>
        <span style={{flex: 1}} />
        <span className="mono" style={{fontSize: 10, color:'var(--ink-mid)', letterSpacing:'.10em'}}>
          {open ? '↑ Collapse' : '↓ Expand'}
        </span>
      </button>
      {open && (
        <div style={{display:'grid', gap: 14, marginTop: 14}}>
          {rest.map((c, i) => (
            <div key={i}>
              <DecisionLadderHeader total={total} current={startIdx + i} />
              <GenerativeCard card={c} guest={guest} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Cendra's serif briefing — Fraunces display, matches Morning Brief.
// `compact` mode used after the binding hero decision is already shown.
function CendraBriefing({ g, compact }) {
  return (
    <div>
      <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: compact ? 10 : 16}}>
        <span style={{
          width: compact ? 18 : 22, height: compact ? 18 : 22, borderRadius: 6,
          background: 'var(--ink)', color: '#ffffff',
          display:'grid', placeItems:'center',
          fontFamily:'var(--mono)', fontSize: compact ? 10 : 11, fontWeight: 600,
        }}>C</span>
        <span className="mono" style={{fontSize: 10.5, letterSpacing:'.14em', color:'var(--ink)', fontWeight: 600}}>CENDRA</span>
        <span style={{fontFamily:'var(--mono)', fontSize: 10, color:'var(--muted)'}}>·</span>
        <span style={{fontFamily:'var(--mono)', fontSize: 10, color:'var(--muted)', letterSpacing:'.12em'}}>{compact ? 'BACKGROUND' : 'BRIEFING'}</span>
        <span style={{fontFamily:'var(--mono)', fontSize: 10, color:'var(--muted)'}}>·</span>
        <span style={{fontFamily:'var(--mono)', fontSize: 10, color:'var(--muted)', letterSpacing:'.12em'}}>CONFIDENCE · {g.confidence != null ? confidenceBand(g.confidence).label.toUpperCase() : '—'}</span>
      </div>
      <p className="serif-display" style={{
        fontSize: compact ? 18 : 26, lineHeight: compact ? 1.5 : 1.36, margin: 0, color: compact ? 'var(--ink-mid)' : 'var(--ink)',
        letterSpacing:'-.008em', maxWidth: 780,
        fontVariationSettings: compact ? '"opsz" 48, "SOFT" 30, "WONK" 0' : '"opsz" 72, "SOFT" 50, "WONK" 0',
        fontStyle: compact ? 'italic' : 'normal',
      }}>
        {g.cendra_take}
      </p>
      {!compact && g.status === "needs_you" && (
        <div style={{fontSize: 14.5, color:'var(--muted)', marginTop: 14, fontFamily:'var(--serif)', fontStyle:'italic'}}>
          {confidencePhrase(g.confidence)}. That's why I'm bringing it to you.
        </div>
      )}
    </div>
  );
}

// Generative card — render type-specific inline component
function GenerativeCard({ card, guest }) {
  switch (card.type) {
    case "draft_reply":     return <DraftReplyCard card={card} guest={guest} />;
    case "approval":        return <ApprovalGenerativeCard card={card} guest={guest} />;
    case "vendor_dispatch": return <VendorDispatchCard card={card} />;
    case "fact_suggestion": return <FactSuggestionCard card={card} />;
    case "upsell":          return <UpsellCard card={card} />;
    case "policy_hold":     return <PolicyHoldCard card={card} />;
    case "promise":         return <PromiseCard card={card} guest={guest} />;
    case "dependency":      return <DependencyCard card={card} />;
    case "abstention":      return <AbstentionCard card={card} guest={guest} />;
    default:                return null;
  }
}

function DraftReplyCard({ card, guest }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(card.preview);
  return (
    <div className="dcard" style={{padding: '18px 20px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12, marginBottom: 10}}>
        <div className="mono dim" style={{fontSize:10, letterSpacing:'.16em'}}>
          DRAFT REPLY · {card.channel.toUpperCase()} · TO {guest.name.toUpperCase().split(' ')[0]}
        </div>
        <Btn size="sm" kind="ghost" onClick={() => setEditing(e => !e)}>{editing ? "Done editing" : "Edit"}</Btn>
      </div>
      {editing ? (
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          style={{
            width:'100%', minHeight: 110, padding: 14,
            fontFamily:'var(--serif)', fontStyle:'italic',
            fontSize: 16, lineHeight: 1.55,
            color:'var(--ink)', background:'var(--paper)',
            border:'1px solid var(--hair)', borderRadius: 4,
            resize:'vertical',
          }}
        />
      ) : (
        <p style={{
          fontFamily:'var(--serif)', fontStyle:'italic',
          fontSize: 16, lineHeight: 1.55, margin: 0,
          color: 'var(--ink)', maxWidth: 660,
        }}>
          "{body}"
        </p>
      )}
      <div className="mono dim" style={{fontSize:10.5, marginTop: 12, lineHeight:1.5}}>WHY · {card.why}</div>
      {card.tone_chips && (
        <div style={{display:'flex', gap:6, marginTop: 10, flexWrap:'wrap'}}>
          {card.tone_chips.map(t => (
            <button key={t} style={{
              all:'unset', cursor:'pointer',
              padding:'4px 10px', fontSize: 11,
              border:'1px solid var(--hair)', borderRadius: 999,
              fontFamily:'var(--mono)', color:'var(--ink-mid)',
              background:'var(--paper)',
            }}>{t}</button>
          ))}
        </div>
      )}
      <div style={{display:'flex', gap: 10, marginTop: 16, alignItems:'center'}}>
        <Btn kind="primary">{card.primary || "Approve & send"}</Btn>
        <Btn kind="ghost">Reject</Btn>
        {card.secondary && <Btn kind="ghost">{card.secondary}</Btn>}
        <span className="grow" style={{flex:1}} />
        <span className="mono dim" style={{fontSize:10}}>REVERSIBLE · GREEN</span>
      </div>
    </div>
  );
}

function ApprovalGenerativeCard({ card, guest }) {
  const toneMap = { high: 'risk', medium: 'warn', low: 'ok' };
  const [whyOpen, setWhyOpen] = useState(false);
  const [oneOff, setOneOff] = useState(false);
  const [rolloutOpen, setRolloutOpen] = useState(false);
  // Property Twin imagined rollouts (Audit §3.5 + §8.1 #1).
  // LinearWorldModel walks N steps; baseline analytical model — not neural.
  // Honest framing: "based on similar past patterns" not "simulation".
  const rollouts = card.rollouts || (
    card.options ? card.options.slice(0, 3).map((opt, i) => ({
      option: opt,
      headline: i === 0
        ? `Most likely path · ${card.range || 'this branch'}`
        : i === 1
        ? "Conservative alternative"
        : "Counter / negotiate path",
      outcomes_14d: i === 0
        ? ["Guest sentiment: neutral → positive", "1 follow-up promise likely (cleanup status)", "Cost: as-quoted · €0 hidden overruns in similar past"]
        : i === 1
        ? ["Guest sentiment: tense (review-threat risk)", "+2 follow-up cycles to negotiate scope", "Cost: ~30% lower · 1 partial-fix risk"]
        : ["Guest sentiment: neutral", "+1 follow-up to settle final price", "Cost: midpoint · 4 similar past cases averaged 92% acceptance"],
      based_on: i === 0
        ? "12 similar past cases at this property class"
        : i === 1
        ? "8 partial-decline cases · 90d"
        : "4 counter-quote cases · 90d",
    })) : []
  );
  const decisionForWhy = {
    title: card.title,
    evidence: card.evidence || [
      { kind: card.rule_kind || "rule",     label: card.rule_label || `Owner rule constrains this decision.`,                                         source: card.rule_source || "owner-policy", fresh: "permanent" },
      { kind: "case",                       label: card.case_label || `Recent cases on this guest/property informed the range.`,                       source: "decision-cases · 90d",            fresh: "30d" },
      { kind: "guest",                      label: card.guest_label || `${guest?.name?.split(' ')[0] || 'Guest'}: ${guest?.trips || 0} prior · ${guest?.sentiment || 'neutral'}.`, source: "guest-memory",                    fresh: "live" },
      { kind: "fact",                       label: card.fact_label || `Operational facts (vendor, timing) feed into the range bounds.`,               source: "ops-state",                       fresh: "live" },
    ],
    binding_tier: card.binding_tier,
    autonomy: card.autonomy || (guest?.confidence > 0.85 ? 'semi' : 'approval'),
    risk: card.risk,
    reversibility: card.reversibility,
  };
  return (
    <>
      <div className="dcard" style={{padding: '18px 20px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12, marginBottom: 6}}>
          <div className="mono dim" style={{fontSize:10, letterSpacing:'.16em'}}>APPROVAL · {card.value}</div>
          <div style={{display:'flex', gap: 6}}>
            <Pill tone={toneMap[card.risk] || 'warn'}>Risk · {card.risk}</Pill>
            <Pill tone={card.reversibility === 'red' ? 'risk' : card.reversibility === 'amber' ? 'warn' : 'ok'}>
              {card.reversibility === 'red' ? 'Final' : card.reversibility === 'amber' ? 'Recoverable' : 'Reversible'}
            </Pill>
          </div>
        </div>
        <h3 style={{fontFamily:'var(--serif)', fontSize: 22, lineHeight:1.25, margin:'8px 0 8px', fontWeight: 400, letterSpacing:'-.005em'}}>
          {card.title}
        </h3>
        <div className="mono dim" style={{fontSize:11, marginBottom: 4}}>RANGE · {card.range}</div>
        <div className="dim mt-2" style={{fontSize: 13.5, lineHeight: 1.5, maxWidth: 660}}>
          <span className="mono" style={{fontSize:10, letterSpacing:'.16em', color:'var(--ink)'}}>WHY · </span>{card.why}
        </div>
        {/* Property Twin rollouts — what if I approve / decline / counter? */}
        {rollouts.length > 0 && (
          <div style={{
            marginTop: 14, borderRadius: 8,
            border: '1px solid var(--hair)',
            background: '#ffffff',
            overflow:'hidden',
          }}>
            <button onClick={() => setRolloutOpen(o => !o)} style={{
              all:'unset', cursor:'pointer',
              display:'flex', alignItems:'center', gap: 10,
              padding:'10px 14px', width:'calc(100% - 28px)',
              borderBottom: rolloutOpen ? '1px solid var(--hair-soft)' : 'none',
            }}>
              <span style={{
                fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.16em',
                color:'var(--ink)', fontWeight: 700, textTransform:'uppercase',
              }}>
                ↓ What if?
              </span>
              <span className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.06em'}}>
                Property twin · {rollouts.length} rollout paths · based on similar past patterns
              </span>
              <span style={{flex: 1}} />
              <span style={{fontFamily:'var(--mono)', fontSize: 14, color:'var(--ink-mid)', transform: rolloutOpen ? 'rotate(90deg)' : 'none', transition:'transform .15s'}}>›</span>
            </button>
            {rolloutOpen && (
              <div style={{display:'grid', gridTemplateColumns:`repeat(${rollouts.length}, 1fr)`, gap: 1, background:'var(--hair-soft)'}}>
                {rollouts.map((r, i) => (
                  <div key={i} style={{padding:'14px 16px', background:'#ffffff'}}>
                    <div className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 6, fontWeight: 600}}>
                      Path {i + 1} · {r.option}
                    </div>
                    <div style={{fontFamily:'var(--serif)', fontSize: 14, lineHeight: 1.35, color:'var(--ink)', marginBottom: 10, letterSpacing:'-.005em'}}>
                      {r.headline}
                    </div>
                    <ul style={{margin: 0, padding:'0 0 0 16px', fontSize: 12, lineHeight: 1.55, color:'var(--ink-mid)'}}>
                      {r.outcomes_14d.map((o, j) => <li key={j} style={{marginBottom: 3}}>{o}</li>)}
                    </ul>
                    <div className="mono" style={{fontSize: 9.5, letterSpacing:'.10em', color:'var(--muted-2)', marginTop: 10, textTransform:'uppercase', borderTop:'1px solid var(--hair-soft)', paddingTop: 8}}>
                      Based on · {r.based_on}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* One-off exception checkbox — Audit §7 #7. Maps to causal_tag = one_off_exception. */}
        <label style={{
          display:'flex', alignItems:'flex-start', gap: 10,
          marginTop: 14, padding:'10px 12px',
          background:'var(--paper-2)', borderRadius: 6,
          border:'1px solid var(--hair-soft)',
          cursor:'pointer', maxWidth: 580,
        }}>
          <input
            type="checkbox"
            checked={oneOff}
            onChange={(e) => setOneOff(e.target.checked)}
            style={{marginTop: 2, accentColor: 'var(--ink)', cursor:'pointer'}}
          />
          <div style={{minWidth: 0}}>
            <div style={{fontSize: 12.5, color:'var(--ink)', fontWeight: 500, lineHeight: 1.45}}>
              Treat as one-off · don't learn from this decision
            </div>
            <div style={{fontSize: 11.5, color:'var(--muted)', lineHeight: 1.5, marginTop: 2}}>
              {oneOff
                ? 'Cendra will tag this case as one_off_exception. It will not contribute to pattern mining or rule promotion.'
                : 'Default: Cendra will include this decision in pattern mining unless you say otherwise.'}
            </div>
          </div>
        </label>

        <RecallWindowActions card={card} oneOff={oneOff} onWhy={() => setWhyOpen(true)} />
      </div>
      <WhyDrawer open={whyOpen} onClose={() => setWhyOpen(false)} decision={decisionForWhy} />
    </>
  );
}

function VendorDispatchCard({ card }) {
  return (
    <div className="dcard" style={{padding: '16px 20px', background:'var(--paper-2)'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 6}}>
        <div className="mono dim" style={{fontSize:10, letterSpacing:'.16em'}}>VENDOR · DISPATCHED</div>
        <Pill tone="info">Waiting</Pill>
      </div>
      <div style={{fontSize: 14, fontWeight: 500, marginBottom: 4}}>{card.vendor}</div>
      <div className="mono dim" style={{fontSize:11, marginBottom: 8}}>VIA · {card.via}</div>
      <div className="dim" style={{fontSize: 13, lineHeight: 1.45}}>{card.status}</div>
      {card.note && <div className="dim mt-2" style={{fontSize:12.5, fontStyle:'italic', maxWidth: 600}}>{card.note}</div>}
      <div style={{display:'flex', gap: 8, marginTop: 12}}>
        <Btn size="sm" kind="ghost">Ping again</Btn>
        <Btn size="sm" kind="ghost">Switch vendor</Btn>
      </div>
    </div>
  );
}

function FactSuggestionCard({ card }) {
  return (
    <div className="dcard" style={{padding: '18px 20px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10}}>
        <div className="mono dim" style={{fontSize:10, letterSpacing:'.16em'}}>
          KNOWLEDGE GAP · {card.scope.toUpperCase()} · {card.fact.toUpperCase()}
        </div>
        <Pill tone="info">{card.asks} asks · 30d</Pill>
      </div>
      <p style={{fontFamily:'var(--serif)', fontSize:18, lineHeight:1.35, margin:'6px 0 12px', maxWidth: 600}}>
        What's the truth about <b>{card.fact}</b> at {card.scope}?
      </p>
      <div className="mono dim" style={{fontSize:10.5, marginBottom: 10}}>WHY · {card.why}</div>
      <div style={{display:'grid', gap: 6}}>
        {card.options.map((o, i) => (
          <button key={o} style={{
            all:'unset', cursor:'pointer',
            padding:'10px 14px',
            border:'1px solid var(--hair)', borderRadius: 4,
            background:'var(--paper)',
            fontSize: 13.5, color:'var(--ink)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--card-raised)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--paper)'}>
            <span className="mono dim" style={{fontSize:10, marginRight: 10, letterSpacing:'.14em'}}>{String.fromCharCode(65 + i)}</span>
            {o}
          </button>
        ))}
        <button style={{
          all:'unset', cursor:'pointer',
          padding:'10px 14px',
          fontSize: 13.5, color:'var(--muted)', fontStyle:'italic',
          fontFamily:'var(--serif)',
        }}>
          ▸ enter custom answer…
        </button>
      </div>
    </div>
  );
}

function UpsellCard({ card }) {
  return (
    <div className="dcard" style={{padding: '18px 20px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6}}>
        <div className="mono dim" style={{fontSize:10, letterSpacing:'.16em'}}>REVENUE OPPORTUNITY · {card.est_value}</div>
        <Pill tone="ok">Likely fit</Pill>
      </div>
      <h3 style={{fontFamily:'var(--serif)', fontSize: 20, lineHeight:1.25, margin:'8px 0 6px', fontWeight: 400}}>
        {card.offer}
      </h3>
      <div className="dim" style={{fontSize: 12.5, marginBottom: 12}}>
        <span className="mono" style={{fontSize:10, letterSpacing:'.16em', color:'var(--ink)', marginRight:6}}>HISTORIC</span>
        {card.historic}
      </div>
      <div className="mono dim" style={{fontSize:10.5, marginBottom: 12}}>WHY · {card.why}</div>
      <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
        {card.options.map((o, i) => (
          <Btn key={o} size="sm" kind={i === 0 ? 'primary' : 'default'}>{o}</Btn>
        ))}
      </div>
    </div>
  );
}

function PolicyHoldCard({ card }) {
  return (
    <div className="dcard" style={{padding: 0, overflow:'hidden'}}>
      <div style={{display:'grid', gridTemplateColumns:'4px 1fr'}}>
        <div style={{background:'#b45309'}} />
        <div style={{padding: '18px 20px'}}>
          <div style={{display:'flex', alignItems:'center', gap:8, marginBottom: 10}}>
            <span style={{
              fontSize: 10, letterSpacing:'.14em', color:'#b45309',
              fontFamily: 'var(--mono)', fontWeight: 600, textTransform:'uppercase',
            }}>Hard rule · holding</span>
          </div>
          <p style={{fontFamily:'var(--serif)', fontSize: 18, lineHeight:1.4, margin:'0 0 12px', maxWidth: 600, color:'var(--ink)'}}>
            "{card.rule}"
          </p>
          <div style={{fontSize:12.5, color:'var(--ink-mid)', marginBottom: 10, lineHeight: 1.5}}>
            <span className="mono" style={{fontSize:10, letterSpacing:'.14em', color:'var(--ink)', marginRight: 6}}>WHY</span>
            {card.why}
          </div>
          <div className="mono" style={{fontSize: 11, color:'var(--ink)', marginBottom: 14}}>RELEASES · {card.releases_at}</div>
          <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
            {card.override_options.map((o, i) => (
              <Btn key={o} size="sm" kind={i === 0 ? 'danger' : 'default'}>{o}</Btn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Promise card — Cendra committed to a guest. The promise has a clock.
function PromiseCard({ card, guest }) {
  const breached = typeof card.due_in_min === 'number' && card.due_in_min < 0;
  const tight    = typeof card.due_in_min === 'number' && card.due_in_min >= 0 && card.due_in_min < 30;
  const tone     = breached ? '#FF385C' : tight ? '#FFB400' : '#5E6AD2';
  const timeText = card.due_in_min == null ? '—'
                 : breached ? `${Math.abs(card.due_in_min)}m past due`
                 : `${card.due_in_min}m left`;
  return (
    <div className="dcard" style={{padding: 0, overflow:'hidden'}}>
      <div style={{display:'grid', gridTemplateColumns:'4px 1fr'}}>
        <div style={{background: tone}} />
        <div style={{padding: '18px 20px'}}>
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 10}}>
            <span style={{
              fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.14em',
              color: tone, fontWeight: 600, textTransform:'uppercase',
            }}>
              Promise · to {(guest?.name || 'guest').split(' ')[0]}
            </span>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
            <span className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.10em'}}>
              {card.channel?.toUpperCase() || 'CHANNEL'}
            </span>
            <span style={{flex: 1}} />
            <span className="mono" style={{
              fontSize: 11, fontWeight: 600,
              color: tone, letterSpacing:'.04em',
            }}>{timeText}</span>
          </div>
          <p style={{fontFamily:'var(--serif)', fontSize: 18, lineHeight: 1.45, margin:'0 0 8px', maxWidth: 620, color:'var(--ink)'}}>
            "{card.commitment}"
          </p>
          {card.context && (
            <div style={{fontSize: 12.5, color:'var(--ink-mid)', marginBottom: 12, lineHeight: 1.5}}>
              <span className="mono" style={{fontSize:10, letterSpacing:'.14em', color:'var(--ink)', marginRight: 6}}>CONTEXT</span>
              {card.context}
            </div>
          )}
          <div className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.06em', marginBottom: 14, textTransform:'uppercase'}}>
            Promised {card.promised_at} · Due {card.due_at}
          </div>
          <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
            <Btn kind="primary" size="sm">{card.primary || 'Fulfill now →'}</Btn>
            <Btn kind="ghost" size="sm">Extend window</Btn>
            <Btn kind="ghost" size="sm">Renegotiate</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dependency card — Cendra is waiting on an internal actor. Trackable, nudge-able.
function DependencyCard({ card }) {
  const actorMap = {
    vendor:   { label: 'VENDOR',   color: '#7C3AED' },
    cleaner:  { label: 'CLEANER',  color: '#0891B2' },
    pms:      { label: 'PMS',      color: '#475569' },
    owner:    { label: 'OWNER',    color: '#B45309' },
    team:     { label: 'TEAM',     color: '#374151' },
  };
  const meta = actorMap[card.actor_type] || actorMap.team;
  const breached = typeof card.sla_min === 'number' && card.sla_min < 0;
  return (
    <div className="dcard" style={{padding: 0, overflow:'hidden'}}>
      <div style={{display:'grid', gridTemplateColumns:'4px 1fr'}}>
        <div style={{background: breached ? '#FF385C' : meta.color}} />
        <div style={{padding: '18px 20px'}}>
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 10}}>
            <span style={{
              fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.14em',
              color: meta.color, fontWeight: 600, textTransform:'uppercase',
            }}>
              Dependency · {meta.label} {card.actor_name ? `· ${card.actor_name}` : ''}
            </span>
            <span style={{flex: 1}} />
            {typeof card.sla_min === 'number' && (
              <span className="mono" style={{
                fontSize: 11, fontWeight: 600,
                color: breached ? '#FF385C' : 'var(--ink-mid)',
              }}>
                {breached ? `${Math.abs(card.sla_min)}m overdue` : `SLA ${card.sla_min}m`}
              </span>
            )}
          </div>
          <p style={{fontFamily:'var(--serif)', fontSize: 18, lineHeight: 1.4, margin:'0 0 8px', maxWidth: 620, color:'var(--ink)'}}>
            {card.title}
          </p>
          {card.last_signal && (
            <div style={{fontSize: 12.5, color:'var(--ink-mid)', marginBottom: 8, lineHeight: 1.5}}>
              <span className="mono" style={{fontSize:10, letterSpacing:'.14em', color:'var(--ink)', marginRight: 6}}>LAST SIGNAL</span>
              {card.last_signal}
            </div>
          )}
          {card.blocking && (
            <div style={{fontSize: 12.5, color:'var(--ink-mid)', marginBottom: 12, lineHeight: 1.5}}>
              <span className="mono" style={{fontSize:10, letterSpacing:'.14em', color:'var(--ink)', marginRight: 6}}>BLOCKING</span>
              {card.blocking}
            </div>
          )}
          <div style={{display:'flex', gap: 8, flexWrap:'wrap', marginTop: 12}}>
            <Btn kind="primary" size="sm">Nudge {meta.label.toLowerCase()}</Btn>
            <Btn kind="ghost" size="sm">Reassign</Btn>
            <Btn kind="ghost" size="sm">Open thread →</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// Abstention card — Cendra recognized it does not have enough to decide.
// Distinct from "Approval Required": there, Cendra has a proposed answer.
// Here, Cendra is signaling unsureness and asking for direction.
function AbstentionCard({ card, guest }) {
  return (
    <div className="dcard" style={{padding: 0, overflow:'hidden'}}>
      <div style={{display:'grid', gridTemplateColumns:'4px 1fr'}}>
        <div style={{background:'#6B7280'}} />
        <div style={{padding: '18px 20px'}}>
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 10}}>
            <span style={{
              fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.14em',
              color:'#6B7280', fontWeight: 600, textTransform:'uppercase',
            }}>
              Cendra is unsure
            </span>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
            <span className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.10em'}}>
              ABSTENTION · {(card.abstention_type || 'underspecified').toUpperCase()}
            </span>
          </div>
          <p style={{fontFamily:'var(--serif)', fontSize: 19, lineHeight: 1.4, margin:'0 0 12px', maxWidth: 620, color:'var(--ink)'}}>
            {card.question}
          </p>
          <div style={{fontSize: 13, color:'var(--ink-mid)', marginBottom: 14, lineHeight: 1.55}}>
            <span className="mono" style={{fontSize:10, letterSpacing:'.14em', color:'var(--ink)', marginRight: 6}}>WHY I'M HOLDING</span>
            {card.why_unsure}
          </div>
          {card.what_would_unblock && card.what_would_unblock.length > 0 && (
            <div style={{marginBottom: 14}}>
              <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--ink)', marginBottom: 6, textTransform:'uppercase'}}>
                What would unblock me
              </div>
              <ul style={{margin: 0, padding: '0 0 0 18px', fontSize: 13, lineHeight: 1.6, color:'var(--ink-mid)'}}>
                {card.what_would_unblock.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
          <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
            {(card.options || ['You decide', 'Snooze · ask later', 'Tell Cendra what to do']).map((o, i) => (
              <Btn key={o} kind={i === 0 ? 'primary' : 'default'} size="sm">{o}</Btn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Right rail — collapsible static facts (booking, property, journey timeline)
function StaticFactsPanel({ g, stageLabel }) {
  const inStay = g.nights_done != null && g.nights_total != null && g.nights_total > 0;

  // Journey collapsed to single-line breadcrumb. Active stage bolded.
  // Headline stage is conveyed by the breadcrumb + the title-bar's IN-STAY chip.
  const stages = ["Booked", "Pre-arrival", "Check-in", "In-stay", "Checkout"];
  const activeIdx = stageLabel === "CHECKING IN TODAY" ? 2
                  : stageLabel === "IN-STAY" ? 3
                  : stageLabel === "CHECKING OUT TODAY" ? 4
                  : 3;

  return (
    <aside style={{
      position:'sticky', top: 14,
      maxHeight: 'calc(100vh - 80px)', overflowY:'auto',
      paddingRight: 4,
    }}>
      {/* Journey breadcrumb — single line */}
      <div style={{
        marginBottom: 16, padding:'10px 12px',
        borderRadius: 8, background:'var(--paper-2)',
        border:'1px solid var(--hair-soft)',
      }}>
        <div className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 6, fontWeight: 500}}>
          Journey
        </div>
        <div style={{display:'flex', alignItems:'center', gap: 4, flexWrap:'wrap', lineHeight: 1.4}}>
          {stages.map((s, i) => (
            <React.Fragment key={s}>
              <span style={{
                fontSize: 11.5,
                fontWeight: i === activeIdx ? 700 : 400,
                color: i === activeIdx ? 'var(--ink)' : i < activeIdx ? 'var(--ink-mid)' : 'var(--muted-2)',
              }}>{s}</span>
              {i < stages.length - 1 && (
                <span style={{fontSize: 10, color: i < activeIdx ? 'var(--ink-mid)' : 'var(--muted-2)'}}>›</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Section title="BOOKING">
        <div className="kv">
          <span>Property</span><span>{g.property}</span>
          <span>Owner</span><span>{g.owner}</span>
          <span>Channel</span><span>{g.channel}</span>
          {inStay && <><span>Nights</span><span>{g.nights_done}/{g.nights_total}</span></>}
          {inStay && <><span>Checkout</span><span>{g.checkout_at}</span></>}
          {!inStay && g.eta_label && <><span>Arriving</span><span>{g.eta_label}</span></>}
          {g.checkin_official && <><span>Official CI</span><span>{g.checkin_official}</span></>}
        </div>
      </Section>

      {g.prep && g.prep.length > 0 && (
        <Section title="PREP · LIVE">
          <div style={{display:'grid', gap: 8}}>
            {g.prep.map((p, i) => (
              <div key={i} style={{display:'flex', justifyContent:'space-between', gap: 10, alignItems:'baseline'}}>
                <span className="mono dim" style={{fontSize:10, letterSpacing:'.12em'}}>{p.label.toUpperCase()}</span>
                <span style={{
                  fontSize: 11.5, textAlign:'right',
                  color: p.tone === 'warn' ? 'var(--warn)' : p.tone === 'risk' ? 'var(--risk)' : 'var(--ink)',
                }}>{p.value}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="GUEST">
        <div className="kv">
          <span>Language</span><span>{g.language}</span>
          <span>Trips</span><span>{g.trips} prior</span>
          <span>Sentiment</span><span>{g.sentiment}</span>
          <span>Last contact</span><span>{g.last_contact}</span>
        </div>
      </Section>
    </aside>
  );
}

function Section({ title, children }) {
  return (
    <div style={{marginBottom: 22}}>
      <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.18em', marginBottom: 8}}>{title}</div>
      {children}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// CONVERSATIONS PANEL — multi-channel raw threads for Guest Journey
// 3 tabs: Guest (default) · Vendors · Activity. Channel chips per
// message. Manual composer with channel + tone. Pending drafts
// shown inline as amber-marked bubbles with approve/edit/reject.
// ───────────────────────────────────────────────────────────────────
function ConversationsPanel({ guest }) {
  const [tab, setTab] = useState("guest");
  const tabs = [
    { id: "guest",   label: "Guest",    count: (guest.messages || []).filter(m => !m.kind || m.kind === "media" || m.kind === "cross_channel").length },
    { id: "vendors", label: "Vendors",  count: (guest.vendors || []).reduce((s, v) => s + (v.messages || []).filter(m => !m.kind || m.kind === "voice").length, 0) },
    { id: "activity",label: "Activity", count: (guest.activity || []).length },
  ];

  return (
    <section style={{
      marginTop: 40,
      background: '#ffffff',
      border: '1px solid var(--hair)',
      borderRadius: 14,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* Tab strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        padding: '14px 22px 0',
        borderBottom: '1px solid var(--hair-soft)',
      }}>
        <div className="mono" style={{
          fontSize: 10, letterSpacing: '.14em', color:'var(--muted)',
          textTransform: 'uppercase', fontWeight: 500, marginRight: 18,
          paddingBottom: 12,
        }}>
          Conversations
        </div>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            all:'unset', cursor:'pointer',
            padding:'8px 14px 12px',
            marginBottom: -1,
            borderBottom: '2px solid ' + (tab === t.id ? 'var(--ink)' : 'transparent'),
            fontSize: 13.5,
            fontWeight: tab === t.id ? 600 : 500,
            color: tab === t.id ? 'var(--ink)' : 'var(--muted)',
            display:'inline-flex', alignItems:'center', gap: 8,
            transition: 'color .12s, border-color .12s',
          }}>
            {t.label}
            <span style={{
              fontFamily:'var(--mono)', fontSize: 11,
              color: tab === t.id ? 'var(--ink)' : 'var(--muted-2)',
              opacity: tab === t.id ? .7 : 1,
            }}>{t.count}</span>
          </button>
        ))}
        <span style={{flex:1}} />
        <span className="mono" style={{
          fontSize: 9.5, letterSpacing: '.12em', color:'var(--muted-2)',
          textTransform:'uppercase', paddingBottom: 12,
        }}>
          {tab === "guest" && "Raw thread · multi-channel"}
          {tab === "vendors" && (guest.vendors?.length || 0) + " vendor" + ((guest.vendors?.length || 0) === 1 ? "" : "s")}
          {tab === "activity" && "System events · this guest"}
        </span>
      </div>

      {/* Tab content */}
      {tab === "guest" && <GuestThread guest={guest} />}
      {tab === "vendors" && <VendorsThread guest={guest} />}
      {tab === "activity" && <ActivityFeed guest={guest} />}
    </section>
  );
}

// Guest thread — bubbles + system events + draft + composer
function GuestThread({ guest }) {
  const msgs = guest.messages || [];
  if (msgs.length === 0) {
    return (
      <div style={{padding: '40px 22px', textAlign:'center'}}>
        <div className="mono" style={{fontSize:11, color:'var(--muted)', letterSpacing:'.12em'}}>NO MESSAGES YET</div>
      </div>
    );
  }
  // Default composer channel = last guest message channel
  const lastGuestMsg = [...msgs].reverse().find(m => m.from === "guest");
  const defaultChannel = lastGuestMsg?.channel || guest.channel?.toLowerCase() || "airbnb";

  return (
    <div>
      <div style={{padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 18}}>
        {msgs.map((m, i) => {
          if (m.kind === "system") return <SystemEventRow key={m.id || i} event={m} />;
          return <MessageBubble key={m.id || i} msg={m} guest={guest} />;
        })}
      </div>
      <ThreadComposer
        recipient={guest.name}
        defaultChannel={defaultChannel}
        showTone={true}
        availableChannels={["airbnb","booking","whatsapp","instagram","messenger","sms","email","direct"]}
      />
    </div>
  );
}

// Vendor thread — same pattern, multi-vendor switcher if needed
function VendorsThread({ guest }) {
  const vendors = guest.vendors || [];
  const [active, setActive] = useState(0);
  if (vendors.length === 0) {
    return (
      <div style={{padding: '40px 22px', textAlign:'center'}}>
        <div className="mono" style={{fontSize:11, color:'var(--muted)', letterSpacing:'.12em'}}>NO VENDOR INVOLVEMENT</div>
      </div>
    );
  }
  const v = vendors[active] || vendors[0];

  return (
    <div>
      {/* Multi-vendor sub-switcher */}
      {vendors.length > 1 && (
        <div style={{display:'flex', gap: 6, padding:'14px 22px 0', borderBottom:'1px solid var(--hair-soft)', flexWrap:'wrap'}}>
          {vendors.map((vd, i) => (
            <button key={vd.id} onClick={() => setActive(i)} style={{
              all:'unset', cursor:'pointer',
              padding:'5px 12px', borderRadius: 999,
              fontSize: 12, fontWeight: 500,
              border: '1px solid ' + (i === active ? 'var(--ink)' : 'var(--hair)'),
              background: i === active ? 'var(--ink)' : '#ffffff',
              color: i === active ? '#ffffff' : 'var(--ink-mid)',
              marginBottom: 12,
            }}>{vd.name} · <span style={{opacity:.6}}>{vd.role}</span></button>
          ))}
        </div>
      )}

      {/* Vendor header */}
      <div style={{
        display:'flex', alignItems:'center', gap: 12,
        padding: '18px 22px 8px', borderBottom: '1px solid var(--hair-soft)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius:'50%',
          background:'var(--paper-2)', border:'1px solid var(--hair)',
          display:'grid', placeItems:'center',
          fontFamily:'var(--sans)', fontSize: 13, fontWeight: 600, color:'var(--ink)',
        }}>{v.name.split(' ').map(s => s[0]).join('').slice(0, 2)}</div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 14, fontWeight: 600, color:'var(--ink)'}}>{v.name}</div>
          <div className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase'}}>
            {v.role} · {v.channel_label}
          </div>
        </div>
        {v.phone_available && (
          <Btn size="sm" kind="ghost">📞 Call {v.name.split(' ')[0]}</Btn>
        )}
      </div>

      <div style={{padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 18}}>
        {v.messages.map((m, i) => {
          if (m.kind === "system") return <SystemEventRow key={m.id || i} event={m} />;
          if (m.kind === "voice") return <VoiceCallRow key={m.id || i} call={m} />;
          return <MessageBubble key={m.id || i} msg={m} guest={{ name: v.name, initial: v.name.split(' ').map(s => s[0]).join('').slice(0,2) }} isVendor />;
        })}
      </div>

      <ThreadComposer
        recipient={v.name}
        defaultChannel={v.channel}
        showTone={false}
        availableChannels={[v.channel, "sms", "phone", "email"].filter((c, i, a) => a.indexOf(c) === i)}
      />
    </div>
  );
}

// Activity feed — chronological system events for this guest
function ActivityFeed({ guest }) {
  const events = guest.activity || [];
  if (events.length === 0) {
    return (
      <div style={{padding: '40px 22px', textAlign:'center'}}>
        <div className="mono" style={{fontSize:11, color:'var(--muted)', letterSpacing:'.12em'}}>NO ACTIVITY YET</div>
      </div>
    );
  }
  const kindMeta = {
    intake:    { dot: 'var(--info)', label: 'intake'    },
    reasoning: { dot: 'var(--ink)',  label: 'reasoning' },
    check:     { dot: 'var(--info)', label: 'check'     },
    rule:      { dot: 'var(--warn)', label: 'rule'      },
    auto:      { dot: 'var(--ok)',   label: 'auto'      },
    vendor:    { dot: '#4A154B',     label: 'vendor'    },
    owner:     { dot: 'var(--info)', label: 'owner'     },
    wait:      { dot: 'var(--muted)',label: 'wait'      },
    pending:   { dot: 'var(--warn)', label: 'pending'   },
  };

  return (
    <div style={{padding: '20px 22px'}}>
      <div style={{display:'grid', gap: 0}}>
        {events.map((e, i) => {
          const m = kindMeta[e.kind] || { dot: 'var(--muted)', label: e.kind };
          return (
            <div key={i} style={{
              display:'grid', gridTemplateColumns: '110px 14px 90px 1fr',
              gap: 14, alignItems:'baseline',
              padding:'10px 0', borderBottom: i < events.length - 1 ? '1px solid var(--hair-soft)' : 'none',
            }}>
              <span className="mono" style={{fontSize: 11, color:'var(--muted)', letterSpacing:'.04em'}}>
                {e.time}
              </span>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: m.dot,
                marginLeft: 3,
              }} />
              <span className="mono" style={{
                fontSize: 10, letterSpacing:'.14em', color: e.tone === 'warn' ? 'var(--warn)' : 'var(--ink-mid)',
                textTransform:'uppercase', fontWeight: 500,
              }}>{m.label}</span>
              <span style={{fontSize: 13.5, color:'var(--ink)', lineHeight: 1.5}}>{e.body}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Message bubble — left for guest, right for cendra/PM, special draft state
function MessageBubble({ msg, guest, isVendor }) {
  const ChannelChip = window.CendraAtoms2.MsgChannelChip;
  const isAgent = msg.from === "cendra" || msg.from === "pm" || msg.from === "you";
  const isDraft = msg.state === "draft";
  const isMedia = msg.kind === "media";
  const isCross = msg.kind === "cross_channel";
  const authorLabel = msg.from === "cendra" ? "Cendra" : msg.from === "pm" ? "You" : msg.from === "you" ? "You" : msg.from === "vendor" ? guest.name : guest.name;

  // System-style cross-channel marker shows on guest side but with a hint
  return (
    <div style={{
      display:'flex',
      flexDirection: isAgent ? 'row-reverse' : 'row',
      alignItems:'flex-end', gap: 10,
    }}>
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius:'50%',
        background: isAgent ? 'var(--ink)' : 'var(--paper-2)',
        color: isAgent ? '#ffffff' : 'var(--ink)',
        border: isAgent ? 'none' : '1px solid var(--hair)',
        display:'grid', placeItems:'center',
        fontFamily:'var(--mono)', fontSize: 11, fontWeight: 600,
        flexShrink: 0, letterSpacing: 0,
      }}>{isAgent ? 'C' : (guest.initial || guest.name?.[0] || '?')}</div>

      {/* Bubble + meta */}
      <div style={{maxWidth: 540, display: 'flex', flexDirection: 'column', alignItems: isAgent ? 'flex-end' : 'flex-start'}}>
        {/* Meta line: channel · time · author · auto/draft */}
        <div style={{
          display:'flex', alignItems:'center', gap: 8,
          padding: '0 4px', marginBottom: 4,
        }}>
          <ChannelChip channel={msg.channel} time={msg.time} />
          {msg.autonomy === "auto" && (
            <span style={{
              fontFamily:'var(--mono)', fontSize: 9, letterSpacing:'.14em',
              padding:'2px 7px', borderRadius: 3,
              background:'var(--ok-soft)', color:'var(--ok)', fontWeight: 600,
            }}>AUTO</span>
          )}
          {isDraft && (
            <span style={{
              fontFamily:'var(--mono)', fontSize: 9, letterSpacing:'.14em',
              padding:'2px 7px', borderRadius: 3,
              background:'var(--warn-soft)', color:'var(--warn)', fontWeight: 600,
            }}>DRAFT · PENDING</span>
          )}
          {isCross && (
            <span style={{
              fontFamily:'var(--mono)', fontSize: 9, letterSpacing:'.14em',
              padding:'2px 7px', borderRadius: 3,
              background:'var(--info-soft)', color:'var(--info)', fontWeight: 600,
            }}>CROSS-CHANNEL</span>
          )}
        </div>

        {/* Bubble */}
        {isMedia ? (
          <div style={{
            padding:'10px 14px',
            background: 'var(--paper-2)',
            border: '1px dashed var(--hair)',
            borderRadius: 12,
            fontFamily:'var(--mono)', fontSize: 11.5, color:'var(--muted)',
            letterSpacing:'.04em',
          }}>
            {msg.body}
          </div>
        ) : (
          <div style={{
            padding: '12px 16px',
            background: isDraft ? '#FFFBEA' : isAgent ? 'var(--ink)' : '#ffffff',
            color: isDraft ? 'var(--ink)' : isAgent ? '#ffffff' : 'var(--ink)',
            border: isDraft ? '1px dashed var(--warn)' : isAgent ? 'none' : '1px solid var(--hair)',
            borderRadius: 14,
            borderBottomRightRadius: isAgent && !isDraft ? 4 : 14,
            borderBottomLeftRadius: !isAgent ? 4 : 14,
            fontSize: 14.5, lineHeight: 1.5,
            maxWidth: 520,
            whiteSpace: 'pre-wrap',
          }}>
            {msg.body}
          </div>
        )}

        {/* Why + Draft action row (for drafts) */}
        {isDraft && (
          <>
            {msg.why && (
              <div className="mono" style={{
                fontSize: 10.5, color:'var(--muted)', letterSpacing:'.06em',
                padding: '6px 6px 0', maxWidth: 540, textAlign:'right',
              }}>WHY · {msg.why}</div>
            )}
            <div style={{display:'flex', gap: 6, marginTop: 10, alignItems:'center', flexWrap:'wrap', justifyContent:'flex-end'}}>
              {msg.tone_options?.map(t => (
                <button key={t} style={{
                  all:'unset', cursor:'pointer',
                  padding:'4px 10px', borderRadius: 999,
                  border:'1px solid var(--hair)', background:'#ffffff',
                  fontSize: 11, fontWeight: 500, color:'var(--ink-mid)',
                  fontFamily:'var(--mono)', letterSpacing:'.04em',
                }}>{t}</button>
              ))}
              <button style={{
                all:'unset', cursor:'pointer',
                background:'var(--ink)', color:'#ffffff',
                padding:'8px 16px', borderRadius: 8,
                fontSize: 13, fontWeight: 600,
                display:'inline-flex', alignItems:'center', gap: 6,
              }}>
                Approve & send
                <span style={{fontFamily:'var(--mono)', fontSize: 11, opacity:.8}}>↵</span>
              </button>
              <Btn size="sm">Edit</Btn>
              <Btn size="sm" kind="ghost">Reject</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// System event row — centered dotted line for Cendra reasoning / rule applications
function SystemEventRow({ event }) {
  const color = event.tone === 'warn' ? 'var(--warn)' : event.tone === 'info' ? 'var(--info)' : event.tone === 'ok' ? 'var(--ok)' : 'var(--muted)';
  return (
    <div style={{
      display:'flex', alignItems:'center', gap: 10,
      padding:'2px 0', justifyContent:'center',
    }}>
      <span style={{flex:1, height: 1, background:'var(--hair-soft)', maxWidth: 80}} />
      <span style={{
        fontFamily:'var(--mono)', fontSize: 10.5, letterSpacing:'.06em',
        color: color, fontStyle:'italic', textAlign:'center',
      }}>
        {event.body}
        {event.source && <span style={{color:'var(--muted-2)', fontStyle:'normal', marginLeft: 8, fontSize: 10}}>· {event.source}</span>}
        {event.time && <span style={{color:'var(--muted-2)', fontStyle:'normal', marginLeft: 8, fontSize: 10}}>· {event.time}</span>}
      </span>
      <span style={{flex:1, height: 1, background:'var(--hair-soft)', maxWidth: 80}} />
    </div>
  );
}

// Voice call row — special "voice note" style
function VoiceCallRow({ call }) {
  return (
    <div style={{
      display:'flex', flexDirection:'row-reverse', alignItems:'flex-end', gap: 10,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius:'50%',
        background:'var(--ink)', color:'#ffffff',
        display:'grid', placeItems:'center',
        fontFamily:'var(--mono)', fontSize: 11, fontWeight: 600,
      }}>C</div>
      <div style={{maxWidth: 540}}>
        <div style={{padding:'0 4px', marginBottom: 4}}>
          <span className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted)', fontWeight: 500}}>
            <span style={{display:'inline-block', width:6, height:6, borderRadius:'50%', background:'var(--rausch)', marginRight: 6}} />
            VOICE CALL · {call.time} · {call.duration}
          </span>
        </div>
        <div style={{
          padding:'14px 18px',
          background:'var(--paper-2)', border:'1px solid var(--hair)',
          borderRadius: 14, borderBottomRightRadius: 4,
          fontSize: 13.5, color:'var(--ink-mid)', maxWidth: 520, fontStyle:'italic',
          fontFamily:'var(--serif)', lineHeight: 1.5,
        }}>
          {call.body}
        </div>
        <div style={{padding:'4px 6px'}}>
          <button style={{
            all:'unset', cursor:'pointer', fontSize: 11,
            color:'var(--ink-mid)', fontFamily:'var(--mono)', letterSpacing:'.06em',
            textDecoration:'underline', textUnderlineOffset: 3,
          }}>play recording →</button>
        </div>
      </div>
    </div>
  );
}

// Thread composer — channel + tone + text + voice + slash escape
function ThreadComposer({ recipient, defaultChannel, showTone, availableChannels }) {
  const [text, setText] = useState("");
  const [channel, setChannel] = useState(defaultChannel);
  const [tone, setTone] = useState("neutral");
  const [expanded, setExpanded] = useState(false);
  const CHANNEL_META = window.CendraAtoms2.CHANNEL_META;
  const channelMeta = CHANNEL_META[channel] || CHANNEL_META.direct;

  const tones = ["neutral", "warmer", "tighter", "more formal"];

  return (
    <div style={{
      borderTop: '1px solid var(--hair-soft)',
      background: 'var(--paper)',
      padding: '14px 22px 18px',
    }}>
      <div className="mono" style={{
        fontSize: 10, letterSpacing:'.14em', color:'var(--muted)',
        textTransform:'uppercase', marginBottom: 10, fontWeight: 500,
      }}>
        Reply to <span style={{color:'var(--ink)'}}>{recipient}</span>
      </div>

      {/* Channel + tone selectors */}
      <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 10, flexWrap:'wrap'}}>
        <div style={{position:'relative'}}>
          <select
            value={channel}
            onChange={e => setChannel(e.target.value)}
            style={{
              fontFamily:'var(--sans)', fontSize: 12, fontWeight: 500,
              border:'1px solid var(--hair)', background:'#ffffff',
              borderRadius: 999, padding: '5px 24px 5px 12px',
              appearance: 'none', cursor:'pointer',
              color:'var(--ink)',
              backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--ink-mid) 50%), linear-gradient(135deg, var(--ink-mid) 50%, transparent 50%)',
              backgroundPosition: 'calc(100% - 12px) 11px, calc(100% - 7px) 11px',
              backgroundSize: '5px 5px',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {availableChannels.map(c => (
              <option key={c} value={c}>{(CHANNEL_META[c] || CHANNEL_META.direct).label}</option>
            ))}
          </select>
        </div>
        <span style={{
          width: 6, height: 6, borderRadius: 2, background: channelMeta.color,
        }} />
        {showTone && (
          <div style={{display:'flex', gap: 4}}>
            {tones.map(t => (
              <button key={t} onClick={() => setTone(t)} style={{
                all:'unset', cursor:'pointer',
                padding:'4px 10px', borderRadius: 999,
                fontSize: 11, fontWeight: 500,
                color: tone === t ? 'var(--ink)' : 'var(--muted)',
                fontFamily:'var(--mono)', letterSpacing:'.04em',
                textTransform:'uppercase',
                background: tone === t ? '#ffffff' : 'transparent',
                border: '1px solid ' + (tone === t ? 'var(--hair)' : 'transparent'),
              }}>{t}</button>
            ))}
          </div>
        )}
        <span style={{flex: 1}} />
        <button style={{
          all:'unset', cursor:'pointer',
          fontSize: 11, color:'var(--muted)',
          fontFamily:'var(--mono)', letterSpacing:'.06em',
        }}>
          🎙 voice
        </button>
        <span style={{color:'var(--muted-2)', fontSize: 11}}>·</span>
        <button style={{
          all:'unset', cursor:'pointer',
          fontSize: 11, color:'var(--muted)',
          fontFamily:'var(--mono)', letterSpacing:'.06em',
        }}>
          📎 attach
        </button>
      </div>

      {/* Text area */}
      <div style={{
        display:'flex', alignItems: expanded ? 'flex-end' : 'center', gap: 10,
        background:'#ffffff', border:'1px solid var(--hair)',
        borderRadius: 12, padding:'10px 14px',
      }}>
        {expanded ? (
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Type your reply to ${recipient.split(' ')[0]}…`}
            onBlur={() => { if (!text.trim()) setExpanded(false); }}
            autoFocus
            style={{
              flex:1, border:0, outline:0, background:'transparent',
              fontSize: 14, fontFamily:'var(--sans)', color:'var(--ink)',
              resize:'vertical', minHeight: 80,
            }}
          />
        ) : (
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder={`Type your reply to ${recipient.split(' ')[0]}…`}
            style={{
              flex:1, border:0, outline:0, background:'transparent',
              fontSize: 14, fontFamily:'var(--sans)', color:'var(--ink)',
            }}
          />
        )}
        <button style={{
          all:'unset', cursor: text.trim() ? 'pointer' : 'not-allowed',
          background: text.trim() ? 'var(--ink)' : 'var(--hair)',
          color: text.trim() ? '#ffffff' : 'var(--muted)',
          padding:'8px 16px', borderRadius: 8,
          fontSize: 13, fontWeight: 600, whiteSpace:'nowrap',
          display:'inline-flex', alignItems:'center', gap: 6,
        }}>
          Send to {recipient.split(' ')[0]}
          <span style={{fontFamily:'var(--mono)', fontSize: 11, opacity:.8}}>↵</span>
        </button>
      </div>

      <div className="mono" style={{
        fontSize: 9.5, letterSpacing:'.10em', color:'var(--muted-2)',
        marginTop: 8, textTransform:'uppercase',
      }}>
        Type <span style={{color:'var(--ink-mid)'}}>/draft</span> to ask Cendra · <span style={{color:'var(--ink-mid)'}}>/comp 30</span> for a comp offer · <span style={{color:'var(--ink-mid)'}}>/escalate</span> to hand off
      </div>
    </div>
  );
}

window.CendraScreens1 = { TodayScreen, WorkScreen, WorkDetailScreen };
