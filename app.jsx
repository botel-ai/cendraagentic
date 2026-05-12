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
        padding: '14px 12px',
        background: 'var(--ink)',
        color: 'var(--paper)',
        borderRadius: 6,
        position: 'relative',
      }}>
        <div className="mono" style={{fontSize:9.5, opacity:.6, letterSpacing:'.18em', marginBottom:6}}>HEARTBEAT</div>
        <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:14, lineHeight:1.4}}>
          0 incidents in 30 days. 99.4% match rate.
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
