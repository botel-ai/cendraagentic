// Cendra Agent OS — App shell, router, and tweaks
const { TodayScreen, WorkScreen, WorkDetailScreen } = window.CendraScreens1;
const { AutopilotScreen, PlaybookScreen, PropertyBrainScreen, LearningScreen } = window.CendraScreens2;
const { PropertiesScreen, PropertyDetailScreen, PlaybookLibraryScreen, InsightsScreen, TrustScreen } = window.CendraScreens3;
const { Btn } = window.CendraAtoms;

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
          <TweakButton label="Autopilot" onClick={() => goto("autopilot")} secondary />
          <TweakButton label="Playbook builder" onClick={() => goto("playbook")} secondary />
          <TweakButton label="Properties · portfolio" onClick={() => goto("properties")} secondary />
          <TweakButton label="Property detail · Karaköy 12" onClick={() => goto("property_detail", "p_kara12")} secondary />
          <TweakButton label="Playbook library" onClick={() => goto("playbook_library")} secondary />
          <TweakButton label="Insights · portfolio health" onClick={() => goto("insights")} secondary />
          <TweakButton label="Trust Center" onClick={() => goto("trust")} secondary />
          <TweakButton label="Learning" onClick={() => goto("learning")} secondary />
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
    "Search guests, properties, rules, reservations…",
    "Lukas Berger",
    "Karaköy · Apt 12",
    "Never promise early check-in",
    "BKG-44291",
    "Late checkout playbook",
  ];
  useEffect(() => {
    const t = setInterval(() => setHint(h => (h + 1) % hints.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="cmdbar">
      <div className="brand">
        <img
          src="assets/cendra-logo.webp"
          alt="Cendra"
          style={{
            height: 26, width: 'auto', display: 'block',
            objectFit: 'contain',
          }}
        />
        <span className="tag">Agent OS</span>
      </div>
      <button onClick={onPalette} style={{
        all: 'unset', cursor: 'text',
        display: 'flex', alignItems: 'center', gap: 10,
        border: '1px solid var(--hair)', background: '#ffffff',
        borderRadius: 8, padding: '8px 12px',
        maxWidth: 720, width: '100%', justifySelf: 'center',
        transition: 'border-color .12s, box-shadow .12s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--stone)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hair)'; }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <span style={{
          flex: 1, color: 'var(--muted)', fontSize: 13.5,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          fontFamily: 'var(--sans)',
        }} key={hint}>
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
    { id: "today",      label: "Today",      count: 37 },
    { id: "work",       label: "Stays",      count: 10 },
    { id: "work_queue", label: "Work",       count: 14 },
    { id: "properties", label: "Properties", count: 47 },
    { id: "brain",      label: "Brain",      count: null },
  ];
  return (
    <nav className="nav">
      <div className="nav-section">OPERATIONS</div>
      {main.map(n => (
        <button
          key={n.id}
          className={"nav-item" + (
            route.name === n.id ||
            (n.id === "work" && route.name === "work_detail") ||
            (n.id === "properties" && route.name === "property_detail") ||
            (n.id === "brain" && ["playbook_library", "autopilot", "learning", "insights", "trust", "playbook"].includes(route.name))
              ? " active" : ""
          )}
          onClick={() => goto(n.id)}
        >
          <span>{n.label}</span>
          {n.count != null && <span className="count">{n.count}</span>}
        </button>
      ))}

      <div className="grow" style={{flex:1}} />
    </nav>
  );
}

function Routes({ route, goto, tweaks }) {
  const onOpen = (name, arg) => goto(name, arg);
  switch (route.name) {
    case "today":            return <TodayScreen onOpen={onOpen} tweaks={tweaks} />;
    case "work":             return <WorkScreen onOpen={onOpen} />;  /* Stays */
    case "work_queue":       return <WorkQueueScreen onOpen={onOpen} arg={route.arg} />;
    case "brain":            return <BrainShell onOpen={onOpen} tweaks={tweaks} arg={route.arg} />;
    case "work_detail":      return <WorkDetailScreen onOpen={onOpen} tweaks={tweaks} />;
    case "autopilot":        return <AutopilotScreen tweaks={tweaks} />;
    case "playbook":         return <PlaybookScreen />;
    case "playbook_library": return <PlaybookLibraryScreen onOpen={onOpen} />;
    case "properties":       return route.arg
                                ? <PropertyDetailScreen onOpen={onOpen} arg={route.arg} />
                                : <PropertiesScreen onOpen={onOpen} />;
    case "property_detail":  return <PropertyDetailScreen onOpen={onOpen} arg={route.arg} />;  /* legacy alias */
    case "insights":         return <InsightsScreen onOpen={onOpen} />;
    case "trust":            return <TrustScreen onOpen={onOpen} />;
    case "learning":         return <LearningScreen />;
    /* `#approval`, `#integrations`, `#audit`, `#mobile` removed — the content
       lives on Today / Trust → Data / Trust → Audit / etc. */
    case "approval":
    case "integrations":
    case "audit":
    case "mobile":           return <TrustScreen onOpen={onOpen} />;  /* redirect orphan deep-links */
    default:              return <TodayScreen onOpen={onOpen} tweaks={tweaks} />;
  }
}

// ───────────────────────────────────────────────────────────────────
// COMMAND PALETTE — universal search (Cmd-K)
// Searches across guests, properties, rules, reservations, audit,
// knowledge facts, playbooks, workflows, screens. Each result
// navigates to its native record. NOT for asking Cendra — that's
// the bottom CendraBar.
// ───────────────────────────────────────────────────────────────────
function CommandPalette({ onClose, goto }) {
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const DP = window.CENDRA_DATA2;
  const D  = window.CENDRA_DATA;

  // Build the searchable index — one entry per record
  const index = useMemo(() => buildSearchIndex(DP, D), []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) {
      // No query — show grouped "starter" set
      return [
        { type: "header", label: "Jump to" },
        ...index.filter(i => i.cat === "screen").slice(0, 6),
        { type: "header", label: "In-house guests" },
        ...index.filter(i => i.cat === "guest" && i.stage === "in_house").slice(0, 4),
        { type: "header", label: "Active rules" },
        ...index.filter(i => i.cat === "rule").slice(0, 3),
      ];
    }
    const matches = index
      .map(i => ({ ...i, score: scoreMatch(i, term) }))
      .filter(i => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    // Group by category
    const groups = {};
    matches.forEach(m => { (groups[m.cat] = groups[m.cat] || []).push(m); });
    const order = ["guest", "property", "reservation", "rule", "playbook", "workflow", "knowledge", "audit", "screen"];
    const out = [];
    order.forEach(c => {
      if (groups[c]) {
        out.push({ type: "header", label: CAT_LABELS[c] + " · " + groups[c].length });
        out.push(...groups[c]);
      }
    });
    return out;
  }, [q, index]);

  const flatResults = results.filter(r => r.type !== "header");

  // Keyboard nav
  useEffect(() => {
    setActiveIdx(0);
  }, [q]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx(i => Math.min(flatResults.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx(i => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = flatResults[activeIdx];
        if (r) { goto(r.route, r.arg); onClose(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flatResults, activeIdx, goto, onClose]);

  let runningIdx = -1;

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{zIndex: 50}}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'fixed',
        top: '12vh', left: '50%', transform: 'translateX(-50%)',
        width: 'min(680px, 94vw)',
        background: '#ffffff',
        border: '1px solid var(--hair)',
        borderRadius: 14,
        boxShadow: '0 24px 48px rgba(0,0,0,0.16), 0 8px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        {/* Input */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--hair-soft)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search guests, properties, rules, reservations, audit, knowledge…"
            style={{
              flex: 1, border: 0, outline: 0, background: 'transparent',
              fontSize: 15.5, fontFamily: 'var(--sans)', color: 'var(--ink)',
            }}
          />
          <span style={{
            fontFamily:'var(--mono)', fontSize: 10, padding:'2px 7px',
            border:'1px solid var(--hair)', borderBottomWidth: 2, borderRadius: 4,
            background:'#ffffff', color:'var(--ink-mid)',
          }}>esc</span>
        </div>

        {/* Results */}
        <div style={{maxHeight: 460, overflowY: 'auto', padding: '6px 0'}}>
          {results.length === 0 && (
            <div style={{padding: '28px 20px', textAlign: 'center'}}>
              <div className="mono" style={{fontSize: 11, letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 8}}>NO MATCHES</div>
              <div style={{fontSize: 13.5, color: 'var(--ink-mid)'}}>Try a different search term, or ask Cendra below.</div>
            </div>
          )}
          {results.map((r, i) => {
            if (r.type === "header") {
              return (
                <div key={"h" + i} style={{
                  padding: '14px 18px 6px',
                  fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.16em',
                  color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 500,
                }}>{r.label}</div>
              );
            }
            runningIdx += 1;
            const active = runningIdx === activeIdx;
            const myIdx = runningIdx;
            return (
              <button
                key={r.id || i}
                onMouseEnter={() => setActiveIdx(myIdx)}
                onClick={() => { goto(r.route, r.arg); onClose(); }}
                style={{
                  all: 'unset', cursor: 'pointer',
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr auto',
                  gap: 12, alignItems: 'center',
                  padding: '10px 18px', width: 'calc(100% - 36px)',
                  background: active ? 'var(--paper)' : 'transparent',
                }}>
                <ResultIcon cat={r.cat} />
                <div style={{minWidth: 0}}>
                  <div style={{fontSize: 13.5, color: 'var(--ink)', fontWeight: 500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{r.title}</div>
                  <div style={{fontSize: 12, color: 'var(--muted)', marginTop: 1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    <span className="mono" style={{fontSize: 9.5, letterSpacing:'.12em', textTransform:'uppercase', marginRight: 6, color: 'var(--muted-2)'}}>{CAT_LABELS[r.cat]}</span>
                    {r.sub}
                  </div>
                </div>
                {active && (
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 7px',
                    border: '1px solid var(--hair)', borderBottomWidth: 2, borderRadius: 4,
                    background: '#ffffff', color: 'var(--ink-mid)',
                  }}>↵</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 18px', borderTop: '1px solid var(--hair-soft)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--paper)',
        }}>
          <div className="mono" style={{fontSize: 10, letterSpacing: '.12em', color: 'var(--muted)', textTransform: 'uppercase'}}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, padding: '1px 5px',
              border: '1px solid var(--hair)', borderRadius: 3,
              background: '#ffffff', color: 'var(--ink-mid)', marginRight: 6,
            }}>↑↓</span>
            navigate
            <span style={{margin: '0 12px', color: 'var(--muted-2)'}}>·</span>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, padding: '1px 5px',
              border: '1px solid var(--hair)', borderRadius: 3,
              background: '#ffffff', color: 'var(--ink-mid)', marginRight: 6,
            }}>↵</span>
            open
          </div>
          <span style={{fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.10em', color: 'var(--muted)'}}>
            {flatResults.length} RESULT{flatResults.length === 1 ? '' : 'S'} · ASK CENDRA BELOW FOR ANSWERS
          </span>
        </div>
      </div>
    </div>
  );
}

const CAT_LABELS = {
  guest:       "Guest",
  property:    "Property",
  reservation: "Reservation",
  rule:        "Rule",
  playbook:    "Playbook",
  workflow:    "Workflow",
  knowledge:   "Knowledge",
  audit:       "Audit",
  screen:      "Screen",
};

function ResultIcon({ cat }) {
  const colors = {
    guest:       'var(--ink)',
    property:    '#5E6AD2',
    reservation: '#0A6CD6',
    rule:        '#B92929',
    playbook:    '#4A154B',
    workflow:    '#008A05',
    knowledge:   '#FC642D',
    audit:       'var(--muted)',
    screen:      'var(--ink-mid)',
  };
  const labels = {
    guest: 'G', property: 'P', reservation: 'R',
    rule: '◆', playbook: '¶', workflow: 'W',
    knowledge: 'K', audit: 'A', screen: '↳',
  };
  return (
    <span style={{
      width: 22, height: 22, borderRadius: 5,
      background: colors[cat] || 'var(--ink)',
      color: '#ffffff',
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
    }}>{labels[cat] || '·'}</span>
  );
}

// Build search index from data sources
function buildSearchIndex(DP, D) {
  const idx = [];

  // Screens / nav shortcuts
  [
    { id: "scr_today",     title: "Today",        sub: "Morning brief · what needs you",       route: "today" },
    { id: "scr_guests",    title: "Guests",       sub: "Live journey · in-house and arriving", route: "work" },
    { id: "scr_props",     title: "Properties",   sub: "Portfolio brain · 47 units",            route: "properties" },
    { id: "scr_playbooks", title: "Playbooks",    sub: "Library · 16 playbooks",                route: "playbook_library" },
    { id: "scr_autopilot", title: "Autopilot",    sub: "Workflow trust · promotion ladder",     route: "autopilot" },
    { id: "scr_learning",  title: "Learning",     sub: "Suggestions Cendra wants to learn",     route: "learning" },
    { id: "scr_insights",  title: "Insights",     sub: "Ask Cendra · portfolio analytics",      route: "insights" },
    { id: "scr_trust",     title: "Trust",        sub: "Safety surface · hard rules · audit",   route: "trust" },
    { id: "scr_audit",     title: "Audit trail",  sub: "Every decision · immutable · in Trust",   route: "trust" },
    { id: "scr_intg",      title: "Integrations", sub: "Health · PMS · channels · in Trust",      route: "trust" },
  ].forEach(s => idx.push({ ...s, cat: "screen" }));

  // Guests (active journey)
  const J = DP.guests_journey || {};
  [...(J.in_house || []), ...(J.checking_in_today || []), ...(J.checking_out_today || [])].forEach(g => {
    const stage = (J.in_house || []).includes(g) ? "in_house"
      : (J.checking_in_today || []).includes(g) ? "arriving"
      : "departing";
    idx.push({
      id: g.id, cat: "guest", stage,
      title: g.name,
      sub: `${g.property} · ${g.channel} · ${stage.replace("_", "-")} · ${g.status_reason}`,
      route: "work_detail", arg: g.id,
      keywords: [g.name, g.property, g.owner, g.channel, g.status_reason, g.language].join(" ").toLowerCase(),
    });
  });
  (J.arriving_week || []).forEach(u => {
    idx.push({
      id: u.id, cat: "guest", stage: "upcoming",
      title: u.name,
      sub: `${u.property} · ${u.channel} · arriving ${u.eta_day} ${u.eta_time} · ${u.nights}n`,
      route: "work",
      keywords: [u.name, u.property, u.channel, u.eta_day].join(" ").toLowerCase(),
    });
  });

  // Properties
  (DP.properties_brain || []).forEach(p => {
    idx.push({
      id: p.id, cat: "property",
      title: p.name,
      sub: `${p.owner} · ${p.region} · ${p.asks} asks · risk ${p.risk}`,
      route: "property_detail", arg: p.id,
      keywords: [p.name, p.owner, p.region].join(" ").toLowerCase(),
    });
  });

  // Reservations (deterministic ID per guest)
  const bkgMap = { ji_lukas: 44291, ji_nora: 44310, ji_hana: 44352, jh_selin: 44324, jh_rafael: 44267, jh_isabela: 44298, jh_marc: 44114, jh_yuki: 44388, jo_thomas: 44241 };
  [...(J.in_house || []), ...(J.checking_in_today || []), ...(J.checking_out_today || [])].forEach(g => {
    const bkg = bkgMap[g.id] || (44000 + Math.abs(hashStr(g.id)) % 999);
    idx.push({
      id: "res_" + g.id, cat: "reservation",
      title: `BKG-${bkg}`,
      sub: `${g.name} · ${g.property} · ${g.channel}`,
      route: "work_detail", arg: g.id,
      keywords: [g.name, g.property, "BKG", String(bkg)].join(" ").toLowerCase(),
    });
  });

  // Hard rules
  (DP.hard_rules || []).forEach(r => {
    idx.push({
      id: r.id, cat: "rule",
      title: r.text,
      sub: `${r.scope} · owner ${r.owner} · last triggered ${r.last_triggered}`,
      route: "trust",
      keywords: [r.text, r.scope, r.owner].join(" ").toLowerCase(),
    });
  });

  // Playbooks
  (DP.playbook_categories || []).forEach(cat => {
    (cat.playbooks || []).forEach(pb => {
      idx.push({
        id: pb.id, cat: "playbook",
        title: pb.name,
        sub: `${cat.name} · ${pb.scope} · ${pb.state}`,
        route: "playbook_library",
        keywords: [pb.name, cat.name, pb.scope].join(" ").toLowerCase(),
      });
    });
  });

  // Workflows
  (DP.workflow_groups || []).forEach(grp => {
    (grp.workflows || []).forEach(wf => {
      idx.push({
        id: wf.id, cat: "workflow",
        title: wf.name,
        sub: `${grp.name} · ${wf.state} · ${wf.samples} cases · ${wf.incidents} incidents`,
        route: "autopilot",
        keywords: [wf.name, grp.name, wf.state, wf.scope].join(" ").toLowerCase(),
      });
    });
  });

  // Knowledge facts → route into the property's detail page (merged from property_brain)
  const scopeToId = {
    "Karaköy · Apt 12": "p_kara12",
    "Karaköy · Apt 9":  "p_kara9",
    "Karaköy · Apt 4":  "p_kara4",
    "Bosphorus Loft":   "p_bos",
    "Studio Galata":    "p_studgal",
    "Cihangir House":   "p_cih",
    "Galata 3":         "p_gal3",
    "Beşiktaş 7":       "p_bes7",
  };
  ((D && D.property_facts) || []).forEach(f => {
    const propId = scopeToId[f.scope];
    idx.push({
      id: f.id, cat: "knowledge",
      title: `${f.scope} · ${f.fact}`,
      sub: `${f.value || '—'} · ${f.state} · ${f.hint}`,
      route: "properties", arg: propId,  // null arg if not mapped → opens list
      keywords: [f.scope, f.fact, f.value || '', f.state].join(" ").toLowerCase(),
    });
  });

  // Audit
  ((DP && DP.audit) || []).forEach(a => {
    idx.push({
      id: a.id, cat: "audit",
      title: a.action + " · " + a.target,
      sub: `${a.actor} · ${a.workflow} · ${a.time}`,
      route: "trust",
      keywords: [a.action, a.target, a.actor, a.workflow].join(" ").toLowerCase(),
    });
  });

  return idx;
}

// Score how well a search term matches an index entry
function scoreMatch(item, term) {
  if (!term) return 0;
  const title = (item.title || "").toLowerCase();
  const sub   = (item.sub   || "").toLowerCase();
  const kw    = (item.keywords || (title + " " + sub)).toLowerCase();

  // Word-start match on title is best
  if (title.startsWith(term)) return 100;
  // Word-start match anywhere in title
  if (title.match(new RegExp("\\b" + escRe(term)))) return 80;
  // Substring in title
  if (title.includes(term)) return 60;
  // Word-start in keywords/sub
  if (kw.match(new RegExp("\\b" + escRe(term)))) return 40;
  // Substring in keywords/sub
  if (kw.includes(term)) return 20;
  return 0;
}

function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return h; }

// ───────────────────────────────────────────────────────────────────
// BRAIN — consolidated shell. Five tabs collapse what used to be five
// separate top-level routes: Playbooks · Autopilot · Learning · Trust
// · Insights. Hash routing preserved for all legacy entries.
// ───────────────────────────────────────────────────────────────────
function BrainShell({ onOpen, tweaks, arg }) {
  const tab = arg || "report";
  const tabs = [
    { id: "report",    label: "Report"    },
    { id: "playbooks", label: "Playbooks" },
    { id: "autopilot", label: "Autopilot" },
    { id: "learning",  label: "Learning"  },
    { id: "trust",     label: "Trust"     },
    { id: "insights",  label: "Insights"  },
  ];

  return (
    <div className="stage" style={{paddingTop: 0, maxWidth: 'none'}}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 4,
        background: 'var(--paper)',
        borderBottom: '1px solid var(--hair-soft)',
        padding: '14px 32px 0',
      }}>
        <div className="mono" style={{
          fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
          marginBottom: 10,
        }}>BRAIN · WHAT CENDRA RUNS</div>
        <div style={{display:'flex', gap: 0, flexWrap:'wrap'}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => onOpen('brain', t.id)} style={{
              all:'unset', cursor:'pointer',
              padding:'10px 16px 14px',
              fontSize: 14, fontWeight: tab === t.id ? 600 : 500,
              color: tab === t.id ? 'var(--ink)' : 'var(--muted)',
              borderBottom: '2px solid ' + (tab === t.id ? 'var(--ink)' : 'transparent'),
              marginBottom: -1,
              transition: 'color .12s, border-color .12s',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {tab === "report"    && <DailyBrainReport onOpen={onOpen} />}
        {tab === "playbooks" && <PlaybookLibraryScreen onOpen={onOpen} />}
        {tab === "autopilot" && <AutopilotScreen tweaks={tweaks} />}
        {tab === "learning"  && <LearningScreen />}
        {tab === "trust"     && <TrustScreen onOpen={onOpen} />}
        {tab === "insights"  && <InsightsScreen onOpen={onOpen} />}
      </div>
    </div>
  );
}

// Daily Brain Report — sectioned by subsystem with verifiable event ids.
// Audit §7 #2: each section drills into the raw event log.
function DailyBrainReport({ onOpen }) {
  const DP = window.CENDRA_DATA2;
  const R = DP.daily_brain_report;
  const [openEvents, setOpenEvents] = useState(null);

  return (
    <div className="stage" style={{maxWidth: 1020, paddingTop: 56, paddingBottom: 120}}>
      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 24, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>DAILY BRAIN REPORT · {R.generated_at.toUpperCase()}</span>
        <span style={{flex:1}} />
        <span>{R.period.toUpperCase()}</span>
      </div>

      <div style={{marginBottom: 40}}>
        <h1 className="serif-display" style={{
          fontSize: 46, lineHeight: 1.05, margin: 0, color:'var(--ink)',
        }}>
          What Cendra did overnight.
        </h1>
        <p style={{
          fontSize: 16.5, lineHeight: 1.55, margin:'18px 0 0',
          color:'var(--ink-mid)', maxWidth: 720,
        }}>
          {R.summary}
        </p>
      </div>

      <div style={{display:'grid', gap: 1, background:'var(--hair)', border:'1px solid var(--hair)', borderRadius: 12, overflow:'hidden'}}>
        {R.sections.map(s => {
          const isOpen = openEvents === s.id;
          return (
            <div key={s.id} style={{background:'#ffffff'}}>
              <div style={{display:'grid', gridTemplateColumns:'180px 1fr 320px', gap: 18, padding:'20px 24px'}}>
                {/* LEFT — eyebrow + subsystem */}
                <div>
                  <div className="mono" style={{fontSize: 9.5, letterSpacing:'.16em', color:'var(--ink)', fontWeight: 700, textTransform:'uppercase', marginBottom: 6}}>
                    {s.eyebrow}
                  </div>
                  <div className="mono" style={{fontSize: 10, letterSpacing:'.06em', color:'var(--muted)', textTransform:'uppercase'}}>
                    {s.subsystem}
                  </div>
                </div>
                {/* MIDDLE — title + narrative */}
                <div style={{minWidth: 0}}>
                  <div style={{fontFamily:'var(--serif)', fontSize: 19, lineHeight: 1.32, color:'var(--ink)', marginBottom: 8, letterSpacing:'-.005em'}}>
                    {s.title}
                  </div>
                  <p style={{fontSize: 13.5, lineHeight: 1.55, color:'var(--ink-mid)', margin: 0}}>
                    {s.narrative}
                  </p>
                  <div style={{display:'flex', gap: 8, marginTop: 12, alignItems:'center', flexWrap:'wrap'}}>
                    <button onClick={() => setOpenEvents(o => o === s.id ? null : s.id)} style={{
                      all:'unset', cursor:'pointer',
                      fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.10em', textTransform:'uppercase',
                      color:'var(--ink-mid)', fontWeight: 600,
                      padding:'4px 10px', borderRadius: 6,
                      border:'1px solid var(--hair)',
                    }}>
                      {isOpen ? '↑ Hide events' : `↓ ${s.event_ids.length} event${s.event_ids.length > 1 ? 's' : ''}`}
                    </button>
                    {s.drill_to && (
                      <button onClick={() => onOpen(s.drill_to, s.drill_arg)} style={{
                        all:'unset', cursor:'pointer',
                        fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.10em', textTransform:'uppercase',
                        color:'var(--ink)', fontWeight: 600,
                        padding:'4px 10px', borderRadius: 6,
                      }}>
                        Drill in →
                      </button>
                    )}
                  </div>
                  {isOpen && (
                    <div style={{
                      marginTop: 12, padding:'10px 12px',
                      background: 'var(--paper-2)', borderRadius: 6,
                      border:'1px solid var(--hair-soft)',
                    }}>
                      <div className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted)', marginBottom: 6, textTransform:'uppercase'}}>
                        Verifiable event ids
                      </div>
                      {s.event_ids.map(eid => (
                        <div key={eid} className="mono" style={{fontSize: 11, color:'var(--ink-mid)', letterSpacing:'.02em', lineHeight: 1.7}}>
                          <span style={{color:'var(--muted-2)', marginRight: 6}}>↪</span>{eid}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* RIGHT — metrics */}
                <div style={{display:'flex', flexDirection:'column', gap: 6, alignItems:'flex-end'}}>
                  {s.metrics.map((m, i) => {
                    const tone = m.tone === 'ok' ? 'var(--ok)' : m.tone === 'warn' ? 'var(--warn)' : m.tone === 'risk' ? 'var(--risk)' : 'var(--ink)';
                    return (
                      <div key={i} style={{display:'flex', alignItems:'baseline', gap: 10}}>
                        <span className="mono" style={{fontSize: 10, letterSpacing:'.10em', color:'var(--muted)', textTransform:'uppercase'}}>{m.label}</span>
                        <span className="mono" style={{fontSize: 13, color: tone, fontWeight: 600, fontVariantNumeric:'tabular-nums', minWidth: 60, textAlign:'right'}}>{m.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// WORK QUEUE — aggregate of the six canonical card types across all
// stays. Different from Stays (which is property-of-guest centric).
// Work is comprehensive backlog; Today is exception-first.
// ───────────────────────────────────────────────────────────────────
function WorkQueueScreen({ onOpen, arg }) {
  // arg can pre-filter on a category, e.g. work_queue:decision
  const validFilters = ["all", "decision", "risk", "promise", "dependency", "opportunity", "learning"];
  const [filter, setFilter] = useState(validFilters.includes(arg) ? arg : "all");
  const DP = window.CENDRA_DATA2;

  // Synthesize the queue from existing data
  const items = useMemo(() => {
    const out = [];
    // Decisions: needs_decision + queued waiting_user from ops_queue
    (DP.today_sections?.needs_decision || []).forEach(it => out.push({
      id: "dec_" + it.id, type: "decision",
      title: it.title, sub: it.sub,
      meta: it.reason, action: it.action, waited: it.waited,
      property: it.property || it.owner, route: it.route,
    }));
    // Risks
    (DP.today_sections?.risk_sla || []).forEach(it => out.push({
      id: "risk_" + it.id, type: "risk",
      title: it.title, sub: it.sub,
      meta: it.reason, action: it.action,
      property: it.property, route: "work",
    }));
    // Opportunities
    (DP.today_sections?.revenue || []).forEach(it => out.push({
      id: "opp_" + it.id, type: "opportunity",
      title: it.title, sub: it.sub,
      meta: it.property, action: it.action,
      value: `+€${it.est_eur}`, route: "work",
    }));
    // Dependencies (from ops_queue waiting_vendor/waiting_cleaner)
    (DP.ops_queue || [])
      .filter(r => ["waiting_vendor", "waiting_cleaner", "waiting_pms"].includes(r.state))
      .forEach(r => out.push({
        id: "dep_" + r.id, type: "dependency",
        title: `${r.workflow} · waiting on ${r.state.replace("waiting_", "")}`,
        sub: `${r.guest !== "—" ? r.guest : "Multi-guest"} · ${r.next}`,
        meta: r.property, action: r.next,
        property: r.property, route: "work_detail",
      }));
    // Promises (derive from waiting_guest cases — "guest waiting on us")
    (DP.ops_queue || [])
      .filter(r => r.state === "waiting_guest" || r.state === "running")
      .forEach(r => out.push({
        id: "prom_" + r.id, type: "promise",
        title: `Promise · ${r.workflow}`,
        sub: `${r.guest} · ${r.next}`,
        meta: `Due · SLA ${r.sla_min}m`, action: r.next,
        property: r.property, route: "work_detail",
      }));
    // Learning candidates
    (window.CENDRA_DATA?.learnings || []).slice(0, 3).forEach(l => out.push({
      id: "learn_" + l.id, type: "learning",
      title: l.title,
      sub: l.observed,
      meta: `${l.examples} examples · ${Math.round(l.confidence * 100)}% confidence`,
      action: "Review", property: "—", route: "brain", arg: "learning",
    }));
    return out;
  }, []);

  const filterDefs = [
    { id: "all",          label: "All",          test: () => true },
    { id: "decision",     label: "Decision",     test: i => i.type === "decision" },
    { id: "risk",         label: "Risk",         test: i => i.type === "risk" },
    { id: "promise",      label: "Promise",      test: i => i.type === "promise" },
    { id: "dependency",   label: "Dependency",   test: i => i.type === "dependency" },
    { id: "opportunity",  label: "Opportunity",  test: i => i.type === "opportunity" },
    { id: "learning",     label: "Learning",     test: i => i.type === "learning" },
  ];
  const shown = items.filter(filterDefs.find(f => f.id === filter).test);

  const typeMeta = {
    decision:    { dot: 'var(--rausch)', label: 'DECISION'    },
    risk:        { dot: 'var(--risk)',   label: 'RISK'        },
    promise:     { dot: 'var(--info)',   label: 'PROMISE'     },
    dependency:  { dot: 'var(--warn)',   label: 'DEPENDENCY'  },
    opportunity: { dot: 'var(--ok)',     label: 'OPPORTUNITY' },
    learning:    { dot: 'var(--ink)',    label: 'LEARNING'    },
  };

  return (
    <div className="stage" style={{maxWidth: 1080, paddingTop: 56, paddingBottom: 120}}>
      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 28, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>WORK · COMPREHENSIVE BACKLOG</span>
        <span style={{flex:1}} />
        <span>{items.length} ITEMS · 6 TYPES</span>
      </div>

      <div style={{marginBottom: 40}}>
        <h1 className="serif-display" style={{fontSize: 46, lineHeight: 1.05, margin: 0, color:'var(--ink)'}}>
          Everything outstanding.
        </h1>
        <p style={{fontSize: 16.5, lineHeight: 1.55, margin:'18px 0 0', color:'var(--ink-mid)', maxWidth: 720}}>
          Today shows the exceptions that need you now. Work is the full picture — decisions, risks, promises, dependencies, opportunities, and learnings — across the whole portfolio.
        </p>
      </div>

      {/* Filter pills */}
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
              {items.filter(f.test).length}
            </span>
          </button>
        ))}
      </div>

      {/* Single-line rows */}
      <div className="dcard" style={{padding: 0, overflow: 'hidden'}}>
        {shown.map((it, i) => {
          const tm = typeMeta[it.type] || typeMeta.decision;
          return (
            <button key={it.id} onClick={() => onOpen(it.route || "work", it.arg)} style={{
              all:'unset', cursor:'pointer',
              display:'grid', gridTemplateColumns:'12px 100px 1fr 160px 110px',
              gap: 14, padding:'14px 22px', alignItems:'center',
              borderBottom: i < shown.length - 1 ? '1px solid var(--hair-soft)' : 'none',
              width:'calc(100% - 44px)', background:'#ffffff',
            }}>
              <span style={{width: 8, height: 8, borderRadius:'50%', background: tm.dot}} />
              <span className="mono" style={{fontSize: 10, letterSpacing:'.12em', color: 'var(--ink)', textTransform:'uppercase', fontWeight: 600}}>
                {tm.label}
              </span>
              <div style={{minWidth: 0}}>
                <div style={{fontSize: 13.5, fontWeight: 500, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{it.title}</div>
                <div style={{fontSize: 12.5, color:'var(--muted)', marginTop: 2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{it.sub}</div>
              </div>
              <span style={{fontSize: 12, color:'var(--ink-mid)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{it.property}</span>
              <span className="mono" style={{fontSize: 11, color:'var(--ink)', letterSpacing:'.04em', textAlign:'right'}}>{it.action} →</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
