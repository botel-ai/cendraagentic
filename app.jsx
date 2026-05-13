// Cendra Agent OS — App shell, router, and tweaks
const { TodayScreen, WorkScreen, WorkDetailScreen, ApprovalScreen } = window.CendraScreens1;
const { AutopilotScreen, PlaybookScreen, PropertyBrainScreen, LearningScreen, AuditScreen, MobileScreen } = window.CendraScreens2;
const { PropertiesScreen, PropertyDetailScreen, PlaybookLibraryScreen, InsightsScreen, TrustScreen, IntegrationsScreen } = window.CendraScreens3;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "todayHero": "spine",
  "decisionCard": "telegram",
  "autonomyLadder": "orchestra",
  "whyDrawerVariant": "beams",
  "quietState": "calm",
  "denseMode": false
}/*EDITMODE-END*/;

function App() {
  const [route, setRoute] = useState({ name: "today", arg: null });
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [palette, setPalette] = useState(false);

  // Hash-based shallow routing for shareable links
  useEffect(() => {
    const onHash = () => {
      const h = location.hash.slice(1) || "today";
      const [name, arg] = h.split(":");
      setRoute({ name, arg });
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goto = (name, arg) => {
    location.hash = arg ? `${name}:${arg}` : name;
  };

  // Cmd-K palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPalette(p => !p);
      }
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <CommandBar onPalette={() => setPalette(true)} />
      <div className="main">
        <Nav route={route} goto={goto} />
        <div className="route" key={route.name + (route.arg || "")}>
          <Routes route={route} goto={goto} tweaks={tweaks} />
        </div>
      </div>
      <CendraBar route={route} goto={goto} />
      {palette && <CommandPalette onClose={() => setPalette(false)} goto={goto} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Today / Command Center">
          <TweakRadio
            label="Hero composition"
            value={tweaks.todayHero}
            options={[
              { label: "Day Spine", value: "spine" },
              { label: "Stack", value: "stack" },
              { label: "Ledger", value: "ledger" },
            ]}
            onChange={(v) => setTweak("todayHero", v)}
          />
        </TweakSection>

        <TweakSection label="Decision Card">
          <TweakRadio
            label="Layout"
            value={tweaks.decisionCard}
            options={[
              { label: "Telegram", value: "telegram" },
              { label: "Stamp", value: "stamp" },
            ]}
            onChange={(v) => setTweak("decisionCard", v)}
          />
        </TweakSection>

        <TweakSection label="Autopilot">
          <TweakSelect
            label="Ladder visualization"
            value={tweaks.autonomyLadder}
            options={[
              { label: "Orchestra (horizontal track)", value: "orchestra" },
              { label: "Vertical ladder", value: "ladder" },
              { label: "Table", value: "table" },
            ]}
            onChange={(v) => setTweak("autonomyLadder", v)}
          />
        </TweakSection>

        <TweakSection label="Navigate">
          <TweakButton label="Today" onClick={() => goto("today")} />
          <TweakButton label="Guests · journey" onClick={() => goto("work")} secondary />
          <TweakButton label="Guest journey · Lukas" onClick={() => goto("work_detail", "ji_lukas")} secondary />
          <TweakButton label="Guest journey · Selin (vendor)" onClick={() => goto("work_detail", "jh_selin")} secondary />
          <TweakButton label="Guest journey · Rafael (review risk)" onClick={() => goto("work_detail", "jh_rafael")} secondary />
          <TweakButton label="Guest journey · Thomas (refund)" onClick={() => goto("work_detail", "jo_thomas")} secondary />
          <TweakButton label="Guest journey · Nora (fact)" onClick={() => goto("work_detail", "ji_nora")} secondary />
          <TweakButton label="Approval · damage claim" onClick={() => goto("approval")} secondary />
          <TweakButton label="Autopilot" onClick={() => goto("autopilot")} secondary />
          <TweakButton label="Playbook builder" onClick={() => goto("playbook")} secondary />
          <TweakButton label="Properties · portfolio" onClick={() => goto("properties")} secondary />
          <TweakButton label="Property detail · Karaköy 12" onClick={() => goto("property_detail", "p_kara12")} secondary />
          <TweakButton label="Property Brain · gaps" onClick={() => goto("property_brain")} secondary />
          <TweakButton label="Playbook library" onClick={() => goto("playbook_library")} secondary />
          <TweakButton label="Insights · Ask Cendra" onClick={() => goto("insights")} secondary />
          <TweakButton label="Trust Center" onClick={() => goto("trust")} secondary />
          <TweakButton label="Integrations health" onClick={() => goto("integrations")} secondary />
          <TweakButton label="Learning" onClick={() => goto("learning")} secondary />
          <TweakButton label="Audit trail" onClick={() => goto("audit")} secondary />
          <TweakButton label="Mobile · approval-first" onClick={() => goto("mobile")} secondary />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// CENDRA BAR — global ask composer + answered panel
// Always sticky at bottom across every page. On submit, slides up a
// panel with Cendra's serif answer + an inline InsightCard +
// follow-up chips. Static demo answer for prototype.
// ───────────────────────────────────────────────────────────────────
function CendraBar({ route, goto }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  // Hotkey · "/" focuses (when not in another input)
  useEffect(() => {
    const onKey = (e) => {
      const inField = document.activeElement && ["INPUT","TEXTAREA"].includes(document.activeElement.tagName);
      if (e.key === "Escape") {
        setSubmitted(null);
        inputRef.current?.blur();
      }
      if (e.key === "/" && !inField) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = (q) => {
    const v = (q ?? text).trim();
    if (!v) return;
    setSubmitted(v);
    setText("");
    inputRef.current?.blur();
  };

  // Rotating placeholder
  const placeholders = useMemo(() => [
    "Ask Cendra anything — \"why is automation down this week?\"",
    "\"Which property had the most refund asks last month?\"",
    "\"Draft a polite hold message for tonight's late arrivals.\"",
    "\"What did Cendra do overnight while I was sleeping?\"",
  ], []);
  const [phIdx, setPhIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhIdx(i => (i + 1) % placeholders.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 240,           // nav width 220 + gap
      right: 24,
      zIndex: 30,
      pointerEvents: 'none',
    }}>
      {submitted && (
        <CendraAnswerPanel
          question={submitted}
          onClose={() => setSubmitted(null)}
          onFollowUp={(q) => submit(q)}
          onOpen={goto}
        />
      )}

      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          pointerEvents: 'auto',
          display: 'flex', alignItems: 'center', gap: 12,
          border: '1px solid ' + (focused ? 'var(--ink)' : 'var(--hair)'),
          background: '#ffffff',
          borderRadius: 14, padding: '12px 18px',
          boxShadow: focused
            ? '0 12px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.04)'
            : '0 8px 24px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03)',
          transition: 'border-color .12s, box-shadow .15s',
          cursor: 'text',
        }}
      >
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em',
          color: 'var(--muted)', whiteSpace: 'nowrap', fontWeight: 500,
        }}>▸ ASK CENDRA</span>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholders[phIdx]}
          style={{
            flex: 1, border: 0, outline: 0, background: 'transparent',
            fontSize: 14.5, fontFamily: 'var(--sans)', color: 'var(--ink)',
            minWidth: 0,
          }}
        />
        <button title="Voice mode" style={{
          all: 'unset', cursor: 'pointer',
          width: 28, height: 28, borderRadius: '50%',
          border: '1.5px solid var(--ink)',
          display: 'grid', placeItems: 'center',
        }}>
          <span style={{width:6, height:6, borderRadius:'50%', background:'var(--ink)'}} />
        </button>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, padding:'2px 7px',
          border: '1px solid var(--hair)', borderBottomWidth: 2,
          borderRadius: 4, background:'#ffffff', color:'var(--ink-mid)',
        }}>{text.trim() ? '↵' : '/'}</span>
      </div>
    </div>
  );
}

// ANSWERED PANEL — slides up above the bar with serif answer + InsightCard
function CendraAnswerPanel({ question, onClose, onFollowUp, onOpen }) {
  return (
    <div style={{
      pointerEvents: 'auto',
      marginBottom: 14,
      background: '#ffffff',
      border: '1px solid var(--hair)',
      borderRadius: 16,
      boxShadow: '0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)',
      maxHeight: 'min(560px, calc(100vh - 200px))',
      overflowY: 'auto',
      animation: 'cendra-slide-up .2s ease-out',
    }}>
      {/* HEADER — user question + close */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '18px 24px 14px',
        borderBottom: '1px solid var(--hair-soft)',
      }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em',
          color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 500,
          paddingTop: 4, flexShrink: 0,
        }}>YOU ASKED</span>
        <div style={{flex: 1, minWidth: 0, fontSize: 15, color: 'var(--ink)', lineHeight: 1.45}}>
          "{question}"
        </div>
        <button onClick={onClose} style={{
          all: 'unset', cursor: 'pointer',
          width: 24, height: 24, borderRadius: '50%',
          display: 'grid', placeItems: 'center',
          color: 'var(--muted)',
          fontSize: 14, flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.color = 'var(--ink)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; }}
        >×</button>
      </div>

      {/* CENDRA'S ANSWER */}
      <div style={{padding: '22px 24px 8px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
          <span style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'var(--ink)', color: '#ffffff',
            display:'grid', placeItems:'center',
            fontFamily:'var(--mono)', fontSize: 11, fontWeight: 600,
          }}>C</span>
          <span style={{fontFamily:'var(--mono)', fontSize: 10.5, letterSpacing:'.14em', color:'var(--ink)', fontWeight: 600}}>CENDRA</span>
          <span style={{fontFamily:'var(--mono)', fontSize: 10, color:'var(--muted)'}}>·</span>
          <span style={{fontFamily:'var(--mono)', fontSize: 10, color:'var(--muted)', letterSpacing:'.12em'}}>BRIEFING · CONF 0.91</span>
        </div>

        <p className="serif-display" style={{
          fontSize: 22, lineHeight: 1.4, margin: 0, color:'var(--ink)',
          fontVariationSettings: '"opsz" 72, "SOFT" 50, "WONK" 0',
          maxWidth: 760,
        }}>
          Late checkout offers are accepting at <b>47%</b> this week — up 6 points from last. Across the portfolio there are <b>11 eligible departures</b> in the next 7 days where Cendra is ready to send the standard €25 offer.
        </p>
        <p style={{
          margin: '14px 0 0', fontSize: 14, lineHeight: 1.55,
          color: 'var(--ink-mid)', maxWidth: 760,
        }}>
          The strongest accept rate is on returning Karaköy guests (67%). Cihangir House underperforms on this offer (29% accept) — likely worth a separate strategy.
        </p>
      </div>

      {/* INLINE GENERATIVE COMPONENT — InsightCard */}
      <div style={{padding: '20px 24px'}}>
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--hair)',
          borderRadius: 12,
          padding: '20px 22px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}>
          <div style={{position:'absolute', top:0, left:0, width:4, height:'100%', background:'var(--ok)'}} />
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 14}}>
            <span style={{fontFamily:'var(--mono)', fontSize: 10, letterSpacing: '.18em', color: 'var(--ok)', fontWeight: 600}}>OPPORTUNITY</span>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
            <span style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.12em', color:'var(--muted)'}}>LATE CHECKOUT · NEXT 7 DAYS</span>
          </div>

          {/* Stats grid */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))', gap: 22, marginBottom: 18}}>
            <InsightStat value="11" label="eligible departures" />
            <InsightStat value="47%" label="accept rate · 7d" tone="ok" />
            <InsightStat value="+6pp" label="vs. last week" tone="ok" />
            <InsightStat value="€275" label="est. revenue" />
          </div>

          <div style={{display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap'}}>
            <button style={{
              all:'unset', cursor:'pointer',
              background:'var(--ink)', color:'#ffffff',
              padding:'10px 18px', borderRadius: 10,
              fontSize: 13.5, fontWeight: 600,
              display:'inline-flex', alignItems:'center', gap: 8,
            }}>
              Send batch offer · €275 est.
              <span style={{fontFamily:'var(--mono)', fontSize:12, opacity:.8}}>↵</span>
            </button>
            <button onClick={() => onOpen('work')} style={{
              all:'unset', cursor:'pointer',
              padding:'10px 16px', borderRadius: 10,
              fontSize: 13.5, fontWeight: 500, color:'var(--ink-mid)',
              border:'1px solid var(--hair)', background:'#ffffff',
            }}>
              View 11 eligible guests →
            </button>
            <span style={{flex:1}} />
            <span style={{fontFamily:'var(--mono)', fontSize: 10.5, color:'var(--muted)', letterSpacing:'.06em'}}>
              REVERSIBLE · SEMI-AUTO
            </span>
          </div>
        </div>
      </div>

      {/* FOLLOW-UP CHIPS */}
      <div style={{padding: '4px 24px 22px'}}>
        <div style={{fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 10, fontWeight: 500}}>ASK A FOLLOW-UP</div>
        <div style={{display:'flex', flexWrap:'wrap', gap: 8}}>
          {[
            "Why does Cihangir House underperform?",
            "Show me last week's late checkout drafts",
            "Increase the offer to €30 for one stay",
            "Which guests are most likely to accept?",
          ].map(q => (
            <button key={q} onClick={() => onFollowUp(q)} style={{
              all:'unset', cursor:'pointer',
              padding:'7px 14px', borderRadius: 999,
              border:'1px solid var(--hair)', background:'#ffffff',
              fontSize: 12.5, fontWeight: 500, color:'var(--ink-mid)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.color = 'var(--ink)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = 'var(--ink-mid)'; }}>
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightStat({ value, label, tone }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'risk' ? 'var(--risk)' : 'var(--ink)';
  return (
    <div>
      <div style={{
        fontFamily:'var(--sans)', fontSize: 24, fontWeight: 500,
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

function CommandBar({ onPalette }) {
  const [hint, setHint] = useState(0);
  const hints = [
    "Cendra, never promise early check-in unless cleaning is confirmed",
    "Show me last week's damage claims",
    "What's the late checkout offer accepting at right now?",
    "Pause autopilot for Cihangir House until Friday",
  ];
  useEffect(() => {
    const t = setInterval(() => setHint(h => (h + 1) % hints.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="cmdbar">
      <div className="brand">
        <span className="logo">Cendra<span className="dot" /></span>
        <span className="tag">Agent OS</span>
      </div>
      <button onClick={onPalette} style={{
        all:'unset', cursor:'text',
        display:'flex', alignItems:'center', gap:10,
        border:'1px solid var(--hair)', background:'var(--card)',
        borderRadius:4, padding:'7px 12px',
        maxWidth:720, width:'100%', justifySelf:'center',
      }}>
        <span className="prefix" style={{whiteSpace:'nowrap'}}>▸ Tell Cendra</span>
        <span style={{flex:1, color:'var(--muted)', fontSize:13.5, fontStyle:'italic', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} key={hint}>
          {hints[hint]}
        </span>
        <span className="kbd">⌘K</span>
      </button>
      <div className="cmd-right">
        <span className="heartbeat">on watch · 31 active</span>
        <div className="avatar">M</div>
      </div>
    </header>
  );
}

function Nav({ route, goto }) {
  const main = [
    { id: "today", label: "Today", count: 37 },
    { id: "work", label: "Guests", count: 10 },
    { id: "properties", label: "Properties", count: 47 },
    { id: "playbook_library", label: "Playbooks", count: 14 },
    { id: "autopilot", label: "Autopilot", count: 10 },
    { id: "learning", label: "Learning", count: 3 },
    { id: "insights", label: "Insights", count: null },
    { id: "trust", label: "Trust", count: null },
  ];
  const sub = [
    { id: "approval", label: "Approval flow" },
    { id: "integrations", label: "Integrations" },
    { id: "property_brain", label: "Property Brain" },
    { id: "audit", label: "Audit trail" },
    { id: "mobile", label: "Mobile · approval" },
  ];
  return (
    <nav className="nav">
      <div className="nav-section">OPERATIONS</div>
      {main.map(n => (
        <button
          key={n.id}
          className={"nav-item" + (route.name === n.id || (n.id === "work" && route.name === "work_detail") ? " active" : "")}
          onClick={() => goto(n.id)}
        >
          <span>{n.label}</span>
          {n.count != null && <span className="count">{n.count}</span>}
        </button>
      ))}
      <div className="nav-section">FLOWS</div>
      {sub.map(n => (
        <button
          key={n.id}
          className={"nav-item" + (route.name === n.id ? " active" : "")}
          onClick={() => goto(n.id)}
        >
          <span>{n.label}</span>
        </button>
      ))}

      <div className="grow" style={{flex:1}} />

      <div style={{
        marginTop: 24,
        padding: '14px 14px',
        background: 'var(--ink)',
        color: '#ffffff',
        borderRadius: 10,
        position: 'relative',
      }}>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 10,
          letterSpacing: '.16em', textTransform: 'uppercase',
          opacity: .5, fontWeight: 600, marginBottom: 8,
        }}>Heartbeat</div>
        <div style={{display:'flex', alignItems:'baseline', gap: 8, marginBottom: 4}}>
          <span style={{fontFamily:'var(--sans)', fontSize: 26, fontWeight: 500, letterSpacing:'-.015em', fontVariantNumeric:'tabular-nums'}}>0</span>
          <span style={{fontSize: 11, opacity: .6, letterSpacing:'.06em'}}>incidents · 30d</span>
        </div>
        <div style={{fontSize: 11.5, opacity: .75, letterSpacing:'-.005em'}}>
          99.4% match rate
        </div>
      </div>
    </nav>
  );
}

function Routes({ route, goto, tweaks }) {
  const onOpen = (name, arg) => goto(name, arg);
  switch (route.name) {
    case "today":            return <TodayScreen onOpen={onOpen} tweaks={tweaks} />;
    case "work":             return <WorkScreen onOpen={onOpen} />;
    case "work_detail":      return <WorkDetailScreen onOpen={onOpen} tweaks={tweaks} />;
    case "approval":         return <ApprovalScreen onOpen={onOpen} />;
    case "autopilot":        return <AutopilotScreen tweaks={tweaks} />;
    case "playbook":         return <PlaybookScreen />;
    case "playbook_library": return <PlaybookLibraryScreen onOpen={onOpen} />;
    case "properties":       return <PropertiesScreen onOpen={onOpen} />;
    case "property_detail":  return <PropertyDetailScreen onOpen={onOpen} />;
    case "property_brain":   return <PropertyBrainScreen />;
    case "insights":         return <InsightsScreen onOpen={onOpen} />;
    case "trust":            return <TrustScreen onOpen={onOpen} />;
    case "integrations":     return <IntegrationsScreen onOpen={onOpen} />;
    case "learning":         return <LearningScreen />;
    case "audit":            return <AuditScreen />;
    case "mobile":           return <MobileScreen onOpen={onOpen} />;
    default:              return <TodayScreen onOpen={onOpen} tweaks={tweaks} />;
  }
}

function CommandPalette({ onClose, goto }) {
  const [q, setQ] = useState("");
  const items = [
    { label: "Today", route: "today", hint: "Mission Control" },
    { label: "Open Lukas — early check-in", route: "work_detail", arg: "ex_01", hint: "Approval · low risk" },
    { label: "Open damage claim — Bosphorus Loft", route: "approval", hint: "NEVER AUTO · evidence ready" },
    { label: "Autopilot ladder", route: "autopilot", hint: "10 workflows" },
    { label: "Property Brain", route: "property_brain", hint: "3 attention items" },
    { label: "Build playbook", route: "playbook", hint: "Teach Cendra" },
    { label: "Learning suggestions", route: "learning", hint: "3 waiting" },
    { label: "Audit trail", route: "audit", hint: "All decisions, immutable" },
    { label: "Make rule: Never promise early check-in unless cleaning is confirmed", route: "playbook", hint: "From edit · 4 examples" },
    { label: "Pause workflow: Late checkout offer", route: "autopilot", hint: "Action" },
  ];
  const filtered = q ? items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())) : items;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'fixed',
        top: '14vh', left: '50%', transform: 'translateX(-50%)',
        width: 'min(640px, 92vw)',
        background: 'var(--card)',
        border: '1px solid var(--hair)',
        borderRadius: 8,
        boxShadow: 'var(--shadow-raised)',
      }}>
        <div style={{padding:'14px 18px', borderBottom:'1px solid var(--hair)', display:'flex', alignItems:'center', gap:10}}>
          <span className="prefix mono dim" style={{fontSize:11}}>▸ TELL CENDRA</span>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Ask, command, navigate…" style={{
            flex:1, border:0, outline:0, background:'transparent', fontSize:15,
          }} />
          <span className="kbd" style={{border:'1px solid var(--hair)', padding:'1px 6px', borderRadius:3, fontFamily:'var(--mono)', fontSize:10.5}}>esc</span>
        </div>
        <div style={{maxHeight: 420, overflowY:'auto'}}>
          {filtered.map((it, i) => (
            <button key={i} onClick={() => { goto(it.route, it.arg); onClose(); }} style={{
              all:'unset', cursor:'pointer',
              display:'grid', gridTemplateColumns:'1fr auto', gap:12,
              padding:'12px 18px', width:'calc(100% - 36px)',
              borderBottom: i < filtered.length-1 ? '1px solid var(--hair-soft)' : 'none',
            }}>
              <div>
                <div style={{fontSize:14, color:'var(--ink)'}}>{it.label}</div>
                <div className="mono dim" style={{fontSize:10.5, marginTop:2}}>{it.hint}</div>
              </div>
              <span className="mono dim" style={{fontSize:11, alignSelf:'center'}}>↵</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{padding:'18px', color:'var(--muted)', fontSize:13}}>No matches. Press <span className="kbd">↵</span> to ask Cendra anyway.</div>
          )}
        </div>
        <div style={{padding:'10px 18px', borderTop:'1px solid var(--hair-soft)', display:'flex', justifyContent:'space-between'}}>
          <span className="mono dim" style={{fontSize:10.5}}>PREVIEW-FIRST · IRREVERSIBLE ACTIONS NEVER RUN FROM HERE</span>
          <span className="mono dim" style={{fontSize:10.5}}>{filtered.length} matches</span>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
