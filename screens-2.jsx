// Cendra screens: Autopilot, Playbook, Property Brain, Learning, Audit, Mobile
const { Pill, AutonomyPill, ReasonPill, Seal, Btn, ActionBar, DecisionCard, WhyDrawer, PageHeader, QuietState } = window.CendraAtoms;
const { TrustMeter: AutoTrustMeter, deriveTrust: autoDeriveTrust, deriveCriteria: autoDeriveCriteria } = window.CendraAtoms2;
const D2 = window.CENDRA_DATA;
const DP = window.CENDRA_DATA2;

// ───────────────────────────────────────────────────────────────────
// AUTOPILOT / Trust Meter — autonomy ladder (orchestra)
// ───────────────────────────────────────────────────────────────────
function AutopilotScreen({ tweaks }) {
  const [changeReq, setChangeReq] = useState(null);
  const [filter, setFilter] = useState("all");

  const allWfs = DP.workflow_groups.flatMap(g =>
    g.workflows.map(w => ({ ...w, groupId: g.id, groupName: g.name }))
  );

  const stats = {
    autopilot: allWfs.filter(w => w.state === "autopilot").length,
    semi:      allWfs.filter(w => w.state === "semi").length,
    approval:  allWfs.filter(w => w.state === "approval").length,
    observe:   allWfs.filter(w => w.state === "observe").length,
    never:     allWfs.filter(w => w.state === "never").length,
    ready:     allWfs.filter(w => w.ready).length,
  };
  const readyList = allWfs.filter(w => w.ready);
  const firstReady = readyList[0];

  // Filter pills — Hick's Law: small set, single-select
  const filterDefs = [
    { id: "all",      label: "All",         test: () => true },
    { id: "ready",    label: "Ready to promote", test: w => w.ready },
    { id: "live",     label: "Live",        test: w => w.state === "autopilot" || w.state === "semi" },
    { id: "approval", label: "Approval",    test: w => w.state === "approval" },
    { id: "never",    label: "Never auto",  test: w => w.state === "never" },
  ];
  const shown = allWfs.filter(filterDefs.find(f => f.id === filter).test);

  const stateMeta = {
    autopilot: { tone: "ok",   label: "Autopilot" },
    semi:      { tone: "info", label: "Semi-auto" },
    approval:  { tone: "warn", label: "Approval" },
    observe:   { tone: "info", label: "Observe" },
    never:     { tone: "risk", label: "Never auto" },
  };

  return (
    <div className="stage" style={{maxWidth: 1080, paddingTop: 56, paddingBottom: 120}}>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 28, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>AUTOPILOT · WORKFLOW TRUST</span>
        <span style={{flex:1}} />
        <span>{allWfs.length} WORKFLOWS · NO GLOBAL ON/OFF</span>
      </div>

      {/* HERO — Cendra speaks about promotion readiness */}
      <div style={{marginBottom: 48}}>
        <h1 className="serif-display" style={{
          fontSize: 46, lineHeight: 1.05, margin: 0, color: 'var(--ink)',
        }}>
          {stats.ready > 0
            ? <>{stats.ready} workflow{stats.ready > 1 ? 's' : ''} ready to level up.</>
            : <>Everything is at the right level.</>
          }
        </h1>
        {firstReady && (
          <p style={{
            fontSize: 16.5, lineHeight: 1.55, margin: '18px 0 0',
            color: 'var(--ink-mid)', maxWidth: 720, fontFamily: 'var(--sans)',
          }}>
            <b style={{color:'var(--ink)'}}>{firstReady.name}</b> — {firstReady.samples} cases, {firstReady.override} override, {firstReady.incidents} incidents in the last 30 days. {firstReady.why}
          </p>
        )}
      </div>

      {/* HERO PROMOTE CARD — Fitts-friendly primary action */}
      {firstReady && (
        <div style={{
          background: '#ffffff', border: '1px solid var(--hair)', borderRadius: 16,
          padding: '28px 32px', marginBottom: 56,
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{position:'absolute', top:0, left:0, width:4, height:'100%', background:'var(--ok)'}} />
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 16}}>
            <span className="mono" style={{fontSize: 10, letterSpacing: '.18em', color: 'var(--ok)', fontWeight: 600}}>READY TO PROMOTE</span>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
            <span className="mono" style={{fontSize:10, letterSpacing:'.12em', color:'var(--muted)'}}>{firstReady.groupName.toUpperCase()}</span>
            <span style={{flex:1}} />
            <Pill tone={stateMeta[firstReady.state].tone}>{stateMeta[firstReady.state].label}</Pill>
          </div>
          <h2 className="serif-display" style={{
            fontSize: 32, lineHeight: 1.12, margin: 0, color: 'var(--ink)', marginBottom: 12,
          }}>{firstReady.name}</h2>
          <p style={{margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-mid)', maxWidth: 720}}>
            {firstReady.why}
          </p>
          <div style={{display:'flex', alignItems:'center', gap: 14, marginTop: 24, flexWrap:'wrap'}}>
            <button onClick={() => setChangeReq({ wf: firstReady, group: { id: firstReady.groupId, name: firstReady.groupName } })} style={{
              all:'unset', cursor:'pointer',
              background: 'var(--ink)', color: '#ffffff',
              padding: '12px 22px', borderRadius: 10,
              fontSize: 14.5, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Promote to {firstReady.state === "approval" ? "semi-auto" : "autopilot"}
              <span style={{fontFamily:'var(--mono)', fontSize:13, opacity:.8}}>↵</span>
            </button>
            <Btn kind="ghost">Review {firstReady.samples} cases →</Btn>
            <span style={{flex:1}} />
            <span className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.06em'}}>
              {firstReady.scope.toUpperCase()} SCOPE
            </span>
          </div>
        </div>
      )}

      {/* STAT BAND — compressed, micro */}
      <div style={{
        display:'flex', gap: 36, flexWrap:'wrap',
        paddingBottom: 24, marginBottom: 24, borderBottom:'1px solid var(--hair-soft)',
      }}>
        <MicroStatBlock value={stats.autopilot} label="autopilot" tone="ok" />
        <MicroStatBlock value={stats.semi}      label="semi-auto" tone="info" />
        <MicroStatBlock value={stats.approval}  label="approval"  tone="warn" />
        <MicroStatBlock value={stats.observe}   label="observe" />
        <MicroStatBlock value={stats.never}     label="never auto" tone="risk" />
        <span style={{flex:1}} />
        <MicroStatBlock value={stats.ready}     label="ready" tone="ok" />
      </div>

      {/* FILTER PILLS — Hick's Law: 5 max */}
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
              {allWfs.filter(f.test).length}
            </span>
          </button>
        ))}
      </div>

      {/* FLAT WORKFLOW TABLE — single-line rows, single-glance scan */}
      <div className="dcard" style={{padding: 0, overflow: 'hidden'}}>
        <div style={{
          display:'grid', gridTemplateColumns: 'minmax(220px, 1.4fr) 200px 110px 80px 80px 110px',
          gap: 14, padding: '12px 22px', background:'var(--paper-2)',
          borderBottom:'1px solid var(--hair)',
          fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.12em', color:'var(--muted)', textTransform:'uppercase', fontWeight: 500,
        }}>
          <div>Workflow</div>
          <div>Trust</div>
          <div>State</div>
          <div style={{textAlign:'right'}}>Override</div>
          <div style={{textAlign:'right'}}>Incidents</div>
          <div></div>
        </div>
        {shown.map((w, i) => {
          const meta = stateMeta[w.state];
          const trust = autoDeriveTrust(w);
          const criteria = autoDeriveCriteria(w, trust);
          const frozen = !!w.frozen;
          return (
            <div key={w.id} style={{
              display:'grid', gridTemplateColumns: 'minmax(220px, 1.4fr) 200px 110px 80px 80px 110px',
              gap: 14, padding: '14px 22px', alignItems:'center',
              borderBottom: i < shown.length - 1 ? '1px solid var(--hair-soft)' : 'none',
              background: '#ffffff',
            }}>
              <div>
                <div style={{display:'flex', alignItems:'center', gap: 8}}>
                  <div style={{fontSize: 13.5, fontWeight: 500, color:'var(--ink)'}}>{w.name}</div>
                  {frozen && (
                    <span style={{
                      fontFamily:'var(--mono)', fontSize: 9, letterSpacing:'.12em',
                      color:'#6B7280', fontWeight: 700, textTransform:'uppercase',
                      padding:'1px 6px', borderRadius: 3,
                      background:'rgba(107,114,128,.10)', border:'1px solid rgba(107,114,128,.25)',
                    }}>FROZEN</span>
                  )}
                </div>
                <div className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.04em', marginTop: 2}}>{w.groupName} · {w.scope}</div>
                <div className="mono" style={{fontSize: 10.5, color:'var(--ink-mid)', letterSpacing:'.02em', marginTop: 4}}>{criteria}</div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap: 4}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <span className="mono dim" style={{fontSize: 9, letterSpacing:'.16em'}}>SCORE</span>
                  <span className="mono" style={{fontSize: 12, fontWeight: 600, fontVariantNumeric:'tabular-nums', color: frozen ? 'var(--muted)' : 'var(--ink)'}}>{Math.round(trust)}</span>
                </div>
                <AutoTrustMeter score={trust} frozen={frozen} state={w.state} />
              </div>
              <Pill tone={meta.tone}>{meta.label}</Pill>
              <div className="mono" style={{fontSize: 12, textAlign:'right', color: w.override === '0.0%' ? 'var(--ok)' : 'var(--ink-mid)', fontVariantNumeric:'tabular-nums'}}>{w.override}</div>
              <div className="mono" style={{fontSize: 12, textAlign:'right', color: w.incidents === 0 ? 'var(--ok)' : 'var(--warn)', fontVariantNumeric:'tabular-nums'}}>{w.incidents}</div>
              <div style={{textAlign:'right'}}>
                {frozen ? (
                  <Btn size="sm" kind="ghost">Unfreeze</Btn>
                ) : w.ready ? (
                  <Btn size="sm" kind="primary" onClick={() => setChangeReq({ wf: w, group: { id: w.groupId, name: w.groupName } })}>Promote →</Btn>
                ) : w.state === "never" ? (
                  <span className="mono" style={{fontSize: 10, color:'var(--muted-2)', letterSpacing:'.12em'}}>PINNED</span>
                ) : (
                  <Btn size="sm" kind="ghost">Manage</Btn>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {changeReq && <ChangeRequestDrawer wf={changeReq.wf} group={changeReq.group} onClose={() => setChangeReq(null)} />}
    </div>
  );
}

// MicroStatBlock — tiny inline stat for the band
function MicroStatBlock({ value, label, tone }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'risk' ? 'var(--risk)' : tone === 'info' ? 'var(--info)' : 'var(--ink)';
  return (
    <div>
      <div style={{fontFamily:'var(--sans)', fontSize: 22, fontWeight: 500, color, lineHeight: 1.1, letterSpacing:'-.015em', fontVariantNumeric:'tabular-nums'}}>{value}</div>
      <div className="mono" style={{fontSize: 10, letterSpacing:'.12em', color:'var(--muted)', textTransform:'uppercase', marginTop: 4, fontWeight: 500}}>{label}</div>
    </div>
  );
}

// Workflow group panel
function WorkflowGroup({ group, onPromote }) {
  const stages = ["observe", "approval", "semi", "autopilot", "never"];
  const stageColor = { observe: 'var(--muted)', approval: 'var(--warn)', semi: 'var(--info)', autopilot: 'var(--ok)', never: 'var(--risk)' };
  return (
    <section style={{marginBottom: 26}}>
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 10}}>
        <div>
          <h2 style={{fontFamily:'var(--serif)', fontSize: 22, fontWeight: 400, letterSpacing:'-.005em', margin:0, lineHeight: 1.2}}>{group.name}</h2>
          <div className="dim" style={{fontSize:13, fontStyle:'italic', marginTop:4}}>{group.sub}</div>
        </div>
        <span className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em'}}>{group.workflows.length} WORKFLOWS</span>
      </div>

      <div className="dcard" style={{padding:0, overflowX:'auto'}}>
        <table className="table" style={{minWidth: 1000}}>
          <thead>
            <tr>
              <th>Workflow</th>
              <th style={{width:120}}>State</th>
              <th style={{width:240}}>Track</th>
              <th style={{width:80}}>Cases</th>
              <th style={{width:80}}>Override</th>
              <th style={{width:75}}>Incidents</th>
              <th style={{width:90}}>Scope</th>
              <th style={{width:100}}></th>
            </tr>
          </thead>
          <tbody>
            {group.workflows.map(w => {
              const idx = stages.indexOf(w.state);
              return (
                <React.Fragment key={w.id}>
                  <tr>
                    <td>
                      <div style={{fontSize:13.5, fontWeight:500}}>{w.name}</div>
                      <div className="mono dim" style={{fontSize:10.5, marginTop:2}}>{w.last} · default: {w.default}</div>
                    </td>
                    <td><AutonomyPill state={w.state} /></td>
                    <td>
                      <div style={{position:'relative', height: 18, padding:'0 8px'}}>
                        <div style={{position:'absolute', left:8, right:8, top:'50%', height:1, background:'var(--hair)'}} />
                        {stages.map((s, si) => {
                          const isActive = s === w.state;
                          const isPassed = si < idx && w.state !== "never";
                          return (
                            <div key={s} style={{
                              position:'absolute', top:'50%', left: `calc(${(si/(stages.length-1))*100}% )`,
                              transform:'translate(-50%, -50%)',
                              width: isActive ? 12 : 7, height: isActive ? 12 : 7, borderRadius:'50%',
                              background: isActive ? stageColor[s] : isPassed ? 'var(--stone)' : 'var(--paper)',
                              border: !isActive ? `1px solid ${isPassed ? 'var(--stone)' : 'var(--hair)'}` : 'none',
                            }} />
                          );
                        })}
                      </div>
                    </td>
                    <td className="mono" style={{fontSize:11.5}}>{w.samples || '—'}</td>
                    <td className="mono" style={{fontSize:11.5, color: w.override !== '—' && parseFloat(w.override) > 5 ? 'var(--warn)' : 'var(--ink-mid)'}}>{w.override}</td>
                    <td className="mono" style={{fontSize:11.5, color: w.incidents > 0 ? 'var(--warn)' : 'var(--muted)'}}>{w.incidents}</td>
                    <td className="mono dim" style={{fontSize:10.5, textTransform:'uppercase', letterSpacing:'.06em'}}>{w.scope}</td>
                    <td>
                      {w.ready ? <Btn size="sm" kind="primary" onClick={() => onPromote(w)}>Promote →</Btn> :
                       w.state === 'never' ? <span className="mono dim" style={{fontSize:10}}>PINNED</span> :
                       <Btn size="sm" kind="ghost">Manage</Btn>}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={8} style={{padding:'2px 18px 12px', borderBottom:'1px solid var(--hair-soft)'}}>
                      <div className="dim" style={{fontSize:11.5, fontStyle:'italic', maxWidth:'80ch'}}>{w.why}</div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Change request drawer (promote / demote) — polished to match detail-page pattern
function ChangeRequestDrawer({ wf, group, onClose }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position:'fixed', top:0, right:0, bottom:0, width:'min(620px, 94vw)',
        background:'var(--paper)', borderLeft:'1px solid var(--hair)',
        boxShadow:'0 -8px 32px rgba(0,0,0,.12), -2px 0 8px rgba(0,0,0,.04)',
        overflowY:'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Sticky header */}
        <div style={{
          position:'sticky', top:0, background:'var(--paper)',
          padding:'24px 32px 16px', zIndex: 2,
          borderBottom: '1px solid var(--hair-soft)',
        }}>
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
            display:'flex', gap: 16, alignItems:'center', marginBottom: 4,
          }}>
            <button onClick={onClose} style={{
              all:'unset', cursor:'pointer', letterSpacing:'.14em', color:'var(--muted)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
              ← CLOSE
            </button>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
            <span>CHANGE REQUEST · {group.name.toUpperCase()}</span>
          </div>
        </div>

        <div style={{padding:'24px 32px 16px', flex: 1}}>
          {/* Hero */}
          <h2 className="serif-display" style={{
            fontSize: 34, lineHeight: 1.1, margin: '0 0 14px',
            color:'var(--ink)', letterSpacing:'-.018em',
          }}>
            Promote <span style={{fontVariationSettings:'"opsz" 144, "SOFT" 50, "WONK" 1'}}>{wf.name}</span> to autopilot?
          </h2>

          {/* What changes */}
          <div style={{
            background:'#ffffff', border:'1px solid var(--hair)', borderRadius: 12,
            padding:'18px 22px', marginBottom: 14,
            position:'relative', overflow:'hidden',
            boxShadow:'0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <div style={{position:'absolute', top:0, left:0, width:4, height:'100%', background:'var(--ok)'}} />
            <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--ok)', textTransform:'uppercase', marginBottom: 12, fontWeight: 600}}>
              State change
            </div>
            <div style={{display:'flex', alignItems:'center', gap: 14, marginBottom: 12}}>
              <Pill tone={wf.state === 'autopilot' ? 'ok' : wf.state === 'semi' ? 'info' : wf.state === 'approval' ? 'warn' : 'risk'}>
                {wf.state}
              </Pill>
              <span style={{fontFamily:'var(--mono)', fontSize: 13, color:'var(--muted)'}}>→</span>
              <Pill tone="ok">autopilot</Pill>
            </div>
            <p style={{margin: 0, fontSize: 13.5, color:'var(--ink-mid)', lineHeight: 1.55}}>
              {wf.default}. Hold window: 0 min. No human review unless an incident triggers demotion.
            </p>
          </div>

          {/* Micro stat band */}
          <div style={{
            display:'flex', gap: 28, flexWrap:'wrap',
            padding:'18px 0', marginBottom: 18,
            borderBottom:'1px solid var(--hair-soft)',
          }}>
            <MicroStatBlock value={wf.samples} label="historical cases" />
            <MicroStatBlock value={wf.override} label="override rate" tone="ok" />
            <MicroStatBlock value="0" label="incidents · 30d" tone="ok" />
            <MicroStatBlock value="0" label="mismatches" tone="ok" />
          </div>

          {/* Why & Risk */}
          <div style={{marginBottom: 18}}>
            <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 8, fontWeight: 500}}>
              Why this is ready
            </div>
            <p style={{margin: 0, fontFamily:'var(--serif)', fontSize: 15, lineHeight: 1.55, color:'var(--ink)', fontStyle:'italic'}}>
              "{wf.why}"
            </p>
          </div>

          {/* Scope */}
          <div style={{marginBottom: 18}}>
            <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 8, fontWeight: 500}}>
              Scope
            </div>
            <div style={{fontSize: 14, color:'var(--ink)'}}>
              <b>{wf.scope === "portfolio" ? `${DP.portfolio.properties_count} properties` : wf.scope === "owner" ? `One owner group` : "Single property"}</b> affected
            </div>
          </div>

          {/* Rollback */}
          <div style={{
            background:'var(--paper-2)', borderRadius: 10,
            padding:'14px 18px', marginBottom: 12,
          }}>
            <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 6, fontWeight: 500}}>
              Auto-rollback
            </div>
            <div style={{fontSize: 13, lineHeight: 1.55, color:'var(--ink-mid)'}}>
              If incident rate exceeds <b style={{color:'var(--ink)'}}>0.5%</b> in 7 days, Cendra auto-demotes back to {wf.state === 'semi' ? 'semi-auto' : wf.state}. You'll be notified.
            </div>
          </div>

          <div style={{fontFamily:'var(--mono)', fontSize: 10, letterSpacing:'.10em', color:'var(--muted-2)', lineHeight: 1.7, marginTop: 22}}>
            Cendra writes a DecisionCase entry. Roll back any time from Audit.
          </div>
        </div>

        {/* Sticky footer with Fitts-friendly primary */}
        <div style={{
          position:'sticky', bottom: 0, background:'var(--paper)',
          padding:'18px 32px', borderTop:'1px solid var(--hair-soft)',
          display:'flex', alignItems:'center', gap: 10,
        }}>
          <button onClick={() => { alert('Promotion scheduled for tonight 02:00.'); onClose(); }} style={{
            all:'unset', cursor:'pointer',
            background:'var(--ink)', color:'#ffffff',
            padding:'12px 22px', borderRadius: 10,
            fontSize: 14, fontWeight: 600,
            display:'inline-flex', alignItems:'center', gap: 8,
          }}>
            Schedule for tonight
            <span style={{fontFamily:'var(--mono)', fontSize:13, opacity:.8}}>↵</span>
          </button>
          <Btn>Publish now</Btn>
          <span style={{flex:1}} />
          <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

function AutonomyOrchestra() {
  const stages = ["observe", "approval", "semi", "autopilot", "never"];
  const stageLabels = { observe: "Observe", approval: "Approval", semi: "Semi-auto", autopilot: "Autopilot", never: "Never auto" };

  return (
    <section style={{
      background: 'var(--card)',
      border: '1px solid var(--hair)',
      borderRadius: 6,
      padding: '0 0 0 0',
      overflow: 'hidden',
    }}>
      {/* Stage header */}
      <div style={{
        display:'grid',
        gridTemplateColumns: '260px repeat(5, 1fr) 90px',
        borderBottom:'1px solid var(--hair)',
        background: 'var(--paper-2)',
      }}>
        <div className="mono dim" style={{padding:'12px 18px', fontSize:10.5, letterSpacing:'.16em'}}>WORKFLOW</div>
        {stages.map(s => (
          <div key={s} className="mono" style={{padding:'12px 8px', fontSize:10, letterSpacing:'.16em', textAlign:'center', color: s === 'autopilot' ? 'var(--ok)' : s === 'never' ? 'var(--risk)' : 'var(--muted)'}}>
            {stageLabels[s].toUpperCase()}
          </div>
        ))}
        <div></div>
      </div>

      {/* Workflows */}
      {D2.workflows.map((w, i) => {
        const stageIdx = stages.indexOf(w.state);
        return (
          <div key={w.id} style={{
            display:'grid',
            gridTemplateColumns: '260px repeat(5, 1fr) 90px',
            borderBottom: i < D2.workflows.length-1 ? '1px solid var(--hair-soft)' : 'none',
            alignItems:'center',
            position:'relative',
          }}>
            <div style={{padding:'14px 18px'}}>
              <div style={{fontWeight:500, fontSize:13.5, letterSpacing:'-.005em'}}>{w.name}</div>
              <div className="mono dim mt-1" style={{fontSize:10.5}}>
                {w.samples > 0 ? `${w.samples} cases` : 'pinned'}
                {w.success !== null && ` · ${Math.round(w.success * 100)}% match`}
                {w.last_incident && ` · last incident ${w.last_incident}`}
              </div>
            </div>

            {/* Track */}
            <div style={{gridColumn: '2 / 7', position:'relative', height: 56, padding:'0 28px'}}>
              <div style={{
                position:'absolute', left: 28, right: 28, top: '50%',
                height: 1, background: 'var(--hair)',
              }} />

              {/* stage dots */}
              {stages.map((s, si) => {
                const left = `calc(${(si / (stages.length-1)) * 100}% )`;
                const isActive = s === w.state;
                const isPassed = si < stageIdx;
                return (
                  <div key={s} style={{
                    position:'absolute', top:'50%', transform:'translate(-50%, -50%)',
                    left,
                  }}>
                    <div style={{
                      width: isActive ? 18 : 10,
                      height: isActive ? 18 : 10,
                      borderRadius: '50%',
                      background: isActive
                        ? (s === 'autopilot' ? 'var(--ok)' : s === 'never' ? 'var(--risk)' : s === 'approval' ? 'var(--warn)' : 'var(--ink)')
                        : isPassed ? 'var(--stone)' : 'transparent',
                      border: !isActive ? `1px solid ${isPassed ? 'var(--stone)' : 'var(--hair)'}` : 'none',
                      transition: 'all 0.2s',
                    }} />
                  </div>
                );
              })}

              {/* Promotion indicator */}
              {w.ready && stageIdx < 3 && (
                <div style={{
                  position:'absolute',
                  left: `calc(${(stageIdx / (stages.length-1)) * 100}% + 12px)`,
                  right: `calc(${((stages.length-1-stageIdx-1) / (stages.length-1)) * 100}% + 12px)`,
                  top: '50%', transform: 'translateY(-50%)',
                  height: 2, background: 'var(--ok)',
                  opacity: .35,
                }} />
              )}
            </div>

            <div style={{padding:'0 14px', textAlign:'right'}}>
              {w.ready && w.state !== 'autopilot' && w.state !== 'never' && (
                <Btn size="sm" kind="primary">Promote →</Btn>
              )}
              {!w.ready && w.state !== 'never' && (
                <Btn size="sm" kind="ghost">Manage</Btn>
              )}
              {w.state === 'never' && (
                <span className="mono dim" style={{fontSize:10}}>PINNED</span>
              )}
            </div>

            {/* Why row */}
            <div style={{gridColumn: '1 / -1', padding:'0 18px 14px 18px'}}>
              <div className="dim" style={{fontSize:11.5, fontStyle:'italic', maxWidth:'70ch'}}>
                {w.why}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function AutonomyTable() {
  return (
    <div className="dcard" style={{padding:0}}>
      <table className="table">
        <thead><tr>
          <th>Workflow</th><th>State</th><th>Samples</th><th>Match</th><th>Last incident</th><th>Hold</th><th></th>
        </tr></thead>
        <tbody>
          {D2.workflows.map(w => (
            <tr key={w.id}>
              <td>
                <div style={{fontWeight:500}}>{w.name}</div>
                <div className="dim" style={{fontSize:11.5}}>{w.why}</div>
              </td>
              <td><AutonomyPill state={w.state} /></td>
              <td className="mono">{w.samples || '—'}</td>
              <td className="mono">{w.success !== null ? `${Math.round(w.success*100)}%` : '—'}</td>
              <td className="mono dim">{w.last_incident || '—'}</td>
              <td className="mono">{w.hold_min ? `${w.hold_min} min` : '—'}</td>
              <td>{w.ready ? <Btn size="sm" kind="primary">Promote</Btn> : <Btn size="sm">Manage</Btn>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AutonomyVerticalLadder() {
  const stages = [
    { id: "autopilot", label: "Autopilot", desc: "Cendra acts without you", tone: "ok" },
    { id: "semi", label: "Semi-auto", desc: "Short hold; you can yank back", tone: "info" },
    { id: "approval", label: "Approval", desc: "You decide each time", tone: "warn" },
    { id: "observe", label: "Observe", desc: "Cendra watches, doesn't act", tone: "info" },
    { id: "never", label: "Never auto", desc: "Always human", tone: "risk" },
  ];
  return (
    <div className="col gap-4">
      {stages.map(s => {
        const items = D2.workflows.filter(w => w.state === s.id);
        return (
          <div key={s.id} className="dcard" style={{padding:'18px 22px'}}>
            <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between'}}>
              <div>
                <Pill tone={s.tone}>{s.label}</Pill>
                <span className="dim" style={{marginLeft:10, fontSize:13}}>{s.desc}</span>
              </div>
              <span className="mono dim" style={{fontSize:11}}>{items.length} workflow{items.length === 1 ? '' : 's'}</span>
            </div>
            {items.length > 0 && (
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
                {items.map(w => <Pill key={w.id}>{w.name}</Pill>)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// PLAYBOOK / SOP Builder
// ───────────────────────────────────────────────────────────────────
function PlaybookScreen() {
  const [name, setName] = useState("Early check-in handling");
  const [intent, setIntent] = useState("When a guest asks to check in earlier than 15:00, never promise a time before cleaning is confirmed. Send a holding reply, ping the cleaner, and follow up when we have a sharper ETA.");
  const [scope, setScope] = useState("owner");
  const [structureOpen, setStructureOpen] = useState(true);
  const [simOpen, setSimOpen] = useState(true);

  const scopes = [
    { id: "property", label: "Just this property", desc: "Karaköy · Apartment 12" },
    { id: "owner",    label: "All properties under owner", desc: "Karaköy LLC · 6 properties" },
    { id: "brand",    label: "All properties under this brand", desc: "Cendra Hospitality · 47 properties" },
    { id: "guest",    label: "This guest only", desc: "Lukas Berger" },
  ];

  return (
    <div className="stage" style={{maxWidth: 880, paddingTop: 56, paddingBottom: 160}}>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 28, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>PLAYBOOK · BUILDER</span>
        <span style={{flex:1}} />
        <span>TEACH CENDRA IN PLAIN ENGLISH</span>
      </div>

      {/* HERO — name input as the title itself */}
      <div style={{marginBottom: 14}}>
        <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 10, fontWeight: 500}}>PLAYBOOK NAME</div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="serif-display"
          style={{
            fontSize: 40, lineHeight: 1.1, fontWeight: 400, color: 'var(--ink)',
            border: 0, outline: 0, background:'transparent',
            width: '100%', padding: 0, letterSpacing: '-0.02em',
            fontFamily: 'var(--serif)',
            fontVariationSettings: '"opsz" 96, "SOFT" 30, "WONK" 0',
          }}
        />
      </div>

      {/* INTENT — situation in plain English */}
      <div style={{marginBottom: 40}}>
        <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 12, fontWeight: 500, marginTop: 32}}>SITUATION</div>
        <textarea
          value={intent}
          onChange={e => setIntent(e.target.value)}
          style={{
            width: '100%', minHeight: 140,
            border: '1px solid var(--hair)', borderRadius: 10,
            padding: '18px 20px',
            fontFamily: 'var(--serif)', fontSize: 18, lineHeight: 1.55,
            background: '#ffffff', color: 'var(--ink)', resize: 'vertical',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        />
        <div className="mono" style={{fontSize: 10.5, color: 'var(--muted-2)', letterSpacing:'.06em', marginTop: 8}}>
          ↓ CENDRA STRUCTURES THIS AUTOMATICALLY · SCROLL TO REVIEW
        </div>
      </div>

      {/* STRUCTURE — Cendra's interpretation, collapsible */}
      <CollapsibleStep
        eyebrow="STRUCTURED PLAYBOOK"
        sub="Cendra parsed your situation into rules. Review and edit if needed."
        open={structureOpen}
        onToggle={() => setStructureOpen(o => !o)}
      >
        <div className="dcard" style={{padding:'18px 22px', marginTop: 14}}>
          <RuleRow label="TRIGGER" value="Guest message contains early-check-in intent (parsed)" />
          <RuleRow label="CHECKS" value="cleaning_status · same_day_turnover · property_rules · last_3_decisions" />
          <RuleRow label="ALLOWED" value="Send holding reply · Ping cleaner · Promise check-in time IF cleaning_status = 'confirmed' AND ETA < requested_time" />
          <RuleRow label="APPROVAL" value="If proposed_time differs from standard 15:00 by &gt; 1h" />
          <RuleRow label="NEVER" value="Promise an early check-in time when cleaning is unconfirmed" tone="risk" />
          <RuleRow label="HOLD" value="0 minutes (operates as approval-required)" />
        </div>
      </CollapsibleStep>

      {/* SCOPE — where it applies */}
      <div style={{marginTop: 40}}>
        <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 4, fontWeight: 500}}>SCOPE</div>
        <div style={{fontSize: 13, color:'var(--muted)', marginBottom: 14}}>Where should this apply?</div>
        <div style={{display:'grid', gap: 8}}>
          {scopes.map(s => (
            <button key={s.id} onClick={() => setScope(s.id)} style={{
              all:'unset', cursor:'pointer',
              display:'grid', gridTemplateColumns:'24px 1fr', gap: 12, alignItems:'center',
              padding:'14px 18px', borderRadius: 10,
              background: scope === s.id ? '#ffffff' : 'transparent',
              border: '1px solid ' + (scope === s.id ? 'var(--ink)' : 'var(--hair)'),
              boxShadow: scope === s.id ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                border: '1.5px solid ' + (scope === s.id ? 'var(--ink)' : 'var(--hair)'),
                background: scope === s.id ? 'var(--ink)' : 'transparent',
                boxShadow: scope === s.id ? 'inset 0 0 0 3px white' : 'none',
              }} />
              <div>
                <div style={{fontSize: 14, fontWeight: 500, color:'var(--ink)'}}>{s.label}</div>
                <div style={{fontSize: 12.5, color:'var(--muted)', marginTop: 2}}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SIMULATION HERO — the moment of truth */}
      <CollapsibleStep
        eyebrow="SIMULATION · LAST 30 DAYS · 11 CASES"
        sub="Cendra replayed past guest messages with this playbook. Here's the diff."
        open={simOpen}
        onToggle={() => setSimOpen(o => !o)}
        marginTop={48}
      >
        <div style={{
          background:'#ffffff', border:'1px solid var(--hair)', borderRadius: 16,
          padding:'28px 32px', marginTop: 14,
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{position:'absolute', top:0, left:0, width:4, height:'100%', background:'var(--ok)'}} />
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap: 28, marginBottom: 24}}>
            <BigSimStat value="11" label="would route to approval" />
            <BigSimStat value="3" label="would change outcome" tone="warn" />
            <BigSimStat value="1" label="incident prevented" tone="ok" />
            <BigSimStat value="0" label="failed simulations" tone="ok" />
          </div>
          <div style={{borderTop:'1px solid var(--hair-soft)', paddingTop: 18}}>
            <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', marginBottom: 10}}>EXAMPLE · 11d AGO · BKG-44012</div>
            <p style={{
              margin: 0, fontFamily:'var(--serif)', fontSize: 17, lineHeight: 1.5,
              color: 'var(--ink)', fontStyle:'italic',
            }}>
              "Guest asked to check in at 13:30. Cendra (old behavior) promised 13:00. Cleaning slipped to 14:15. Resulted in mild complaint."
            </p>
            <div style={{
              marginTop: 14, padding:'12px 16px', borderRadius: 8,
              background:'var(--ok-soft)', border:'1px solid color-mix(in oklab, var(--ok), white 75%)',
              fontSize: 13, lineHeight: 1.5, color:'var(--ink)',
            }}>
              <span className="mono" style={{fontSize: 10, color:'var(--ok)', letterSpacing:'.14em', marginRight: 8, fontWeight: 600}}>WITH NEW PLAYBOOK</span>
              Cendra would have routed this to approval. You would have seen the cleaning ETA mismatch and held the line at 15:00.
            </div>
          </div>
        </div>
      </CollapsibleStep>

      {/* PUBLISH BAR — sticky bottom */}
      <div style={{
        position:'sticky', bottom: 100, marginTop: 72, zIndex: 5,
        background: 'linear-gradient(to bottom, transparent 0%, var(--paper) 40px)',
        paddingTop: 40, paddingBottom: 4,
      }}>
        <div style={{
          display:'flex', alignItems:'center', gap: 16,
          border: '1px solid var(--hair)', background:'#ffffff',
          borderRadius: 14, padding: '14px 20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{flex:1, minWidth: 0}}>
            <div style={{fontSize: 14, fontWeight: 600, color:'var(--ink)', marginBottom: 2}}>Ready to publish</div>
            <div className="mono" style={{fontSize: 10.5, color:'var(--muted)', letterSpacing:'.06em'}}>
              {scopes.find(s => s.id === scope).desc.toUpperCase()} · APPROVAL MODE · 11/11 SIMS PASSED
            </div>
          </div>
          <Btn kind="ghost" size="sm">Save as draft</Btn>
          <button style={{
            all:'unset', cursor:'pointer',
            background:'var(--ink)', color:'#ffffff',
            padding:'12px 22px', borderRadius: 10,
            fontSize: 14, fontWeight: 600,
            display:'inline-flex', alignItems:'center', gap: 8,
          }}>
            Publish playbook
            <span style={{fontFamily:'var(--mono)', fontSize:13, opacity:.8}}>↵</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CollapsibleStep({ eyebrow, sub, open, onToggle, children, marginTop }) {
  return (
    <div style={{marginTop: marginTop || 40}}>
      <button onClick={onToggle} style={{
        all:'unset', cursor:'pointer', display:'flex',
        alignItems:'flex-start', gap: 12, width: '100%',
      }}>
        <div style={{flex:1, minWidth:0, textAlign:'left'}}>
          <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 4, fontWeight: 500}}>{eyebrow}</div>
          {sub && <div style={{fontSize: 13, color:'var(--muted)'}}>{sub}</div>}
        </div>
        <span style={{
          fontFamily:'var(--mono)', fontSize: 16, color:'var(--ink-mid)',
          transform: open ? 'rotate(90deg)' : 'rotate(0)',
          transition: 'transform .15s',
        }}>›</span>
      </button>
      {open && children}
    </div>
  );
}

function BigSimStat({ value, label, tone }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'risk' ? 'var(--rausch)' : 'var(--ink)';
  return (
    <div>
      <div style={{fontFamily:'var(--sans)', fontSize: 36, fontWeight: 500, color, lineHeight: 1.05, letterSpacing:'-.02em', fontVariantNumeric:'tabular-nums'}}>{value}</div>
      <div className="mono" style={{fontSize: 10.5, letterSpacing:'.10em', color:'var(--muted)', textTransform:'uppercase', marginTop: 6, fontWeight: 500, lineHeight:1.3}}>{label}</div>
    </div>
  );
}

function RuleRow({ label, value, tone }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'110px 1fr', gap:18, padding:'10px 0', borderBottom:'1px dashed var(--hair-soft)'}}>
      <div className="mono" style={{fontSize:9.5, letterSpacing:'.18em', color: tone === 'risk' ? 'var(--risk)' : 'var(--muted)', paddingTop:3}}>{label}</div>
      <div style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}} dangerouslySetInnerHTML={{__html: value.replaceAll('&gt;', '&gt;')}} />
    </div>
  );
}

function SimStat({ label, value, tone }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'risk' ? 'var(--risk)' : 'var(--ink)';
  return (
    <div>
      <div style={{fontFamily:'var(--serif)', fontSize:36, lineHeight:1, color, fontWeight: 400}}>{value}</div>
      <div className="mono dim mt-1" style={{fontSize:10.5, letterSpacing:'.1em'}}>{label.toUpperCase()}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// PROPERTY BRAIN — Knowledge Gaps
// ───────────────────────────────────────────────────────────────────
function PropertyBrainScreen() {
  const [tab, setTab] = useState("attention");
  const groups = {
    attention: D2.property_facts.filter(f => f.state === "missing" || f.state === "conflict" || f.state === "stale"),
    verified: D2.property_facts.filter(f => f.state === "verified"),
  };
  const items = groups[tab];

  return (
    <div className="stage">
      <PageHeader
        eyebrow="PROPERTY BRAIN"
        title="What Cendra knows. What it doesn't."
        lead="Cendra never invents facts. When the brain is empty or conflicting, you'll see it here — and Cendra asks instead of guessing."
      />

      <div style={{display:'flex',gap:6,marginBottom:18}}>
        <button onClick={() => setTab("attention")} className={CendraAtoms.cls("btn","btn-sm", tab==="attention" && "btn-primary")}>
          Attention needed <span className="mono" style={{opacity:.6, marginLeft:4}}>{groups.attention.length}</span>
        </button>
        <button onClick={() => setTab("verified")} className={CendraAtoms.cls("btn","btn-sm", tab==="verified" && "btn-primary")}>
          Verified <span className="mono" style={{opacity:.6, marginLeft:4}}>{groups.verified.length}</span>
        </button>
      </div>

      {tab === "attention" && (
        <div className="col gap-3">
          {items.map(f => <FactCard key={f.id} f={f} />)}
        </div>
      )}

      {tab === "verified" && (
        <div className="dcard" style={{padding: 0}}>
          <table className="table">
            <thead><tr><th>Property</th><th>Fact</th><th>Value</th><th>Source freshness</th></tr></thead>
            <tbody>
              {items.map(f => (
                <tr key={f.id}>
                  <td className="mono" style={{fontSize:11.5}}>{f.scope}</td>
                  <td>{f.fact}</td>
                  <td style={{maxWidth:380}}>{f.value}</td>
                  <td className="mono dim">{f.hint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FactCard({ f }) {
  const isMissing = f.state === "missing";
  const [answered, setAnswered] = useState(false);
  const stateColor = f.state === "conflict" ? "warn" : f.state === "stale" ? "info" : "info";

  return (
    <div className="dcard" style={{padding:'18px 22px'}}>
      {/* Single-line header: scope · fact · state pill */}
      <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 10, flexWrap:'wrap'}}>
        <span className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--ink)', fontWeight: 600, textTransform:'uppercase'}}>
          {f.scope}
        </span>
        <span style={{width:3, height:3, borderRadius:'50%', background:'var(--muted-2)'}} />
        <span className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', fontWeight: 500}}>
          {f.fact}
        </span>
        <span style={{flex:1}} />
        <Pill tone={stateColor}>{f.state}</Pill>
      </div>

      <h3 className="serif-display" style={{fontSize: 20, lineHeight: 1.25, fontWeight: 400, margin: 0, letterSpacing:'-.005em', color:'var(--ink)'}}>
        {isMissing ? `Does ${f.scope} have ${f.fact.toLowerCase()}?` :
         f.state === "conflict" ? `Conflict: ${f.fact} on ${f.scope}` :
         `${f.fact} hasn't been verified recently`}
      </h3>
      <p style={{margin:'8px 0 0', fontSize: 13, color:'var(--muted)', lineHeight: 1.5}}>{f.hint}</p>

      {answered ? (
        <div style={{
          marginTop: 14, padding:'10px 14px', borderRadius: 8,
          background:'var(--ok-soft)', border:'1px solid color-mix(in oklab, var(--ok), white 75%)',
        }}>
          <div className="mono" style={{fontSize: 10, color:'var(--ok)', letterSpacing:'.14em', fontWeight: 600}}>SAVED · SOURCE = PM CONFIRMED</div>
          <div style={{fontSize: 13, marginTop: 4, color:'var(--ink)'}}>Cendra will use this for all future guests.</div>
        </div>
      ) : isMissing ? (
        <div style={{display:'flex', gap: 8, marginTop: 16, flexWrap:'wrap'}}>
          <Btn kind="primary" size="sm" onClick={() => setAnswered(true)}>Yes, available</Btn>
          <Btn size="sm" onClick={() => setAnswered(true)}>No, not available</Btn>
          <Btn size="sm">Conditional…</Btn>
          <span style={{flex:1}} />
          <Btn kind="ghost" size="sm">Internal only</Btn>
        </div>
      ) : (
        <div style={{marginTop: 14}}>
          <div style={{
            padding:'10px 14px', borderRadius: 8,
            background:'var(--paper-2)', border:'1px solid var(--hair)',
          }}>
            <div className="mono" style={{fontSize: 10, color:'var(--muted)', letterSpacing:'.14em', fontWeight: 500}}>CURRENT VALUE</div>
            <div style={{fontSize: 13.5, marginTop: 3, color:'var(--ink)'}}>{f.value}</div>
          </div>
          <div style={{display:'flex', gap: 8, marginTop: 12}}>
            <Btn size="sm" kind="primary" onClick={() => setAnswered(true)}>Confirm still correct</Btn>
            <Btn size="sm">Update value</Btn>
            <Btn size="sm" kind="ghost">View source</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// LEARNING CENTER
// ───────────────────────────────────────────────────────────────────
function LearningScreen() {
  return (
    <div className="stage">
      <PageHeader
        eyebrow="LEARNING · 3 SUGGESTIONS"
        title="Cendra would like to learn three things."
        lead="Each suggestion is drawn from your edits and approvals. Nothing becomes a rule until you decide."
      />

      <div className="col gap-4">
        {D2.learnings.map(l => <LearningCard key={l.id} l={l} />)}
      </div>

      <div className="mt-8">
        <QuietState
          title="Cendra learns slowly on purpose."
          body="High-value, low-risk patterns surface here first. Risky behaviours are pinned to Never Auto and never auto-promoted."
          mono="LAST WEEK · 7 LEARNED · 2 REJECTED · 0 ROLLBACKS"
        />
      </div>
    </div>
  );
}

function LearningCard({ l }) {
  const [decided, setDecided] = useState(null);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const confidence = Math.round(l.confidence * 100);
  const confColor = confidence >= 85 ? 'var(--ok)' : confidence >= 70 ? 'var(--warn)' : 'var(--muted)';

  return (
    <div className="dcard" style={{
      padding: '24px 28px', opacity: decided ? 0.55 : 1, transition: 'opacity .3s',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{position:'absolute', top:0, left:0, width:4, height:'100%', background: confColor}} />

      <div style={{display:'flex', alignItems:'flex-start', gap: 24, marginBottom: 18}}>
        <div style={{flexShrink: 0}}>
          <div style={{
            fontFamily:'var(--sans)', fontSize: 44, fontWeight: 500, color: confColor,
            lineHeight: 1, letterSpacing:'-.02em', fontVariantNumeric:'tabular-nums',
          }}>{confidence}<span style={{fontSize: 22, fontWeight: 400, opacity: .6}}>%</span></div>
          <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginTop: 4, fontWeight: 500}}>confidence</div>
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 6, fontWeight: 500}}>
            CENDRA NOTICED · {l.examples} EXAMPLES · {l.overrides} OVERRIDES · {l.incidents} INCIDENTS
          </div>
          <h3 className="serif-display" style={{
            fontSize: 24, lineHeight: 1.2, margin: 0, color:'var(--ink)',
          }}>{l.title}</h3>
        </div>
        <Pill tone={l.risk === "low" ? "ok" : l.risk === "medium" ? "warn" : "risk"}>Risk · {l.risk}</Pill>
      </div>

      <p style={{margin: 0, color:'var(--ink-mid)', fontSize: 14, lineHeight: 1.6, maxWidth: 720}}>
        {l.observed}
      </p>

      <div style={{
        marginTop: 18, padding:'14px 18px', borderRadius: 10,
        background:'var(--paper-2)', border:'1px solid var(--hair)',
      }}>
        <div className="mono" style={{fontSize: 10, letterSpacing:'.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom: 6, fontWeight: 500}}>PROPOSED RULE</div>
        <div style={{fontSize: 13.5, lineHeight: 1.5, color:'var(--ink)'}}>{l.proposed}</div>
      </div>

      <button onClick={() => setExamplesOpen(o => !o)} style={{
        all:'unset', cursor:'pointer',
        marginTop: 14, fontSize: 12, color:'var(--ink-mid)',
        display:'flex', alignItems:'center', gap: 8,
      }}>
        <span style={{
          fontFamily:'var(--mono)', fontSize: 14,
          transform: examplesOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .15s',
        }}>›</span>
        <span className="mono" style={{fontSize: 10.5, letterSpacing:'.08em', textTransform:'uppercase', fontWeight: 500}}>
          SIMULATION · {l.simulation.passed} passed · {l.simulation.failed} failed
        </span>
      </button>
      {examplesOpen && (
        <div style={{
          marginTop: 10, padding:'12px 16px',
          background:'var(--paper-2)', borderRadius: 8,
          fontSize: 12.5, color:'var(--ink-mid)', lineHeight: 1.55,
        }}>
          {l.simulation.would_change}
        </div>
      )}

      {decided ? (
        <div style={{marginTop: 20, paddingTop: 16, borderTop:'1px solid var(--hair-soft)'}}>
          <span className="mono" style={{fontSize: 11, letterSpacing:'.16em', color: decided === 'approve' ? 'var(--ok)' : 'var(--muted)', fontWeight: 600, textTransform:'uppercase'}}>
            {decided === 'approve' ? '✓ ADDED · CENDRA WILL USE THIS ON NEXT MATCH' : '✕ REJECTED · CENDRA WILL NOT SUGGEST AGAIN'}
          </span>
        </div>
      ) : (
        <div style={{display:'flex', gap: 10, marginTop: 22, alignItems:'center', flexWrap:'wrap'}}>
          <Btn kind="primary" onClick={() => setDecided('approve')}>Approve as rule</Btn>
          <Btn>Edit scope</Btn>
          <Btn kind="ghost" onClick={() => setDecided('reject')}>Not now</Btn>
          <span style={{flex:1}} />
          <Btn kind="ghost" size="sm">Mark never auto</Btn>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// AUDIT TRAIL
// ───────────────────────────────────────────────────────────────────
function AuditScreen() {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filterDefs = [
    { id: "all",       label: "All",        test: () => true },
    { id: "incidents", label: "Incidents",  test: a => a.incident },
    { id: "cendra",    label: "By Cendra",  test: a => a.actor === "Cendra" },
    { id: "people",    label: "By people",  test: a => a.actor !== "Cendra" },
    { id: "reversible",label: "Reversible", test: a => a.reversible === "green" || a.reversible === "amber" },
  ];
  const shown = D2.audit.filter(filterDefs.find(f => f.id === filter).test);

  const incidentCount = D2.audit.filter(a => a.incident).length;

  return (
    <div className="stage" style={{maxWidth: 1080, paddingTop: 56, paddingBottom: 120}}>

      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: '.18em', color: 'var(--muted)',
        marginBottom: 24, display:'flex', gap: 16, alignItems:'center',
      }}>
        <span>TRUST · AUDIT TRAIL · IMMUTABLE</span>
        <span style={{flex:1}} />
        <span style={{display:'inline-flex', alignItems:'center', gap:6, color: incidentCount > 0 ? 'var(--warn)' : 'var(--ok)'}}>
          <span style={{width:6, height:6, borderRadius:'50%', background: incidentCount > 0 ? 'var(--warn)' : 'var(--ok)'}} />
          {incidentCount} INCIDENT{incidentCount === 1 ? '' : 'S'} · 7D
        </span>
      </div>

      {/* HERO */}
      <div style={{marginBottom: 40}}>
        <h1 className="serif-display" style={{
          fontSize: 46, lineHeight: 1.05, margin: 0, color:'var(--ink)',
        }}>
          Every decision. Recorded.
        </h1>
        <p style={{
          fontSize: 16.5, lineHeight: 1.55, margin: '18px 0 0',
          color:'var(--ink-mid)', maxWidth: 720, fontFamily:'var(--sans)',
        }}>
          <b style={{color:'var(--ink)'}}>{D2.audit.length} entries</b> in the last 7 days. Filter by actor, incident, or reversibility. Roll back any reversible action.
        </p>
      </div>

      {/* MICRO STAT BAND */}
      <div style={{
        display:'flex', gap: 36, flexWrap:'wrap',
        paddingBottom: 24, marginBottom: 24, borderBottom:'1px solid var(--hair-soft)',
      }}>
        <MicroStatBlock value="2,418" label="decisions · 30d" />
        <MicroStatBlock value="0.4%" label="override rate" />
        <MicroStatBlock value="0" label="incidents · 30d" tone="ok" />
        <MicroStatBlock value="3" label="rollbacks · 30d" tone="warn" />
        <span style={{flex:1}} />
        <Btn kind="ghost" size="sm">Export · CSV</Btn>
      </div>

      {/* STICKY FILTER BAR */}
      <div style={{
        position:'sticky', top: 0, background:'var(--paper)', zIndex: 4,
        paddingTop: 8, paddingBottom: 16, marginBottom: 4,
      }}>
        <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
          {filterDefs.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              all:'unset', cursor:'pointer',
              padding:'7px 14px', borderRadius: 999,
              border:'1px solid ' + (filter === f.id ? 'var(--ink)' : 'var(--hair)'),
              background: filter === f.id ? 'var(--ink)' : '#ffffff',
              color: filter === f.id ? '#ffffff' : 'var(--ink-mid)',
              fontSize: 12.5, fontWeight: 500, fontFamily:'var(--sans)',
            }}>
              {f.label}
              <span style={{marginLeft: 8, opacity: filter === f.id ? .7 : .5, fontFamily:'var(--mono)', fontSize: 11}}>
                {D2.audit.filter(f.test).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SINGLE-LINE ROWS · click to expand */}
      <div className="dcard" style={{padding: 0, overflow: 'hidden'}}>
        {shown.map((a, i) => {
          const isExpanded = expandedId === a.id;
          const revColor = a.reversible === "green" ? 'var(--ok)' : a.reversible === "amber" ? 'var(--warn)' : a.reversible === "red" ? 'var(--rausch)' : 'var(--muted-2)';
          return (
            <div key={a.id} style={{
              borderBottom: i < shown.length - 1 ? '1px solid var(--hair-soft)' : 'none',
              background: isExpanded ? 'var(--paper)' : '#ffffff',
            }}>
              <button onClick={() => setExpandedId(isExpanded ? null : a.id)} style={{
                all:'unset', cursor:'pointer', display:'grid',
                gridTemplateColumns: '8px 150px 140px 1fr 90px 14px',
                gap: 14, padding:'14px 22px', alignItems:'center',
                width:'calc(100% - 44px)',
              }}>
                <span style={{width: 8, height: 8, borderRadius:'50%', background: revColor}} />
                <span className="mono" style={{fontSize: 11, color:'var(--muted)', letterSpacing:'.04em'}}>{a.time}</span>
                <span style={{
                  fontSize: 13, fontWeight: a.actor === 'Cendra' ? 500 : 500,
                  color: a.actor === 'Cendra' ? 'var(--info)' : 'var(--ink)',
                }}>{a.actor}</span>
                <div style={{display:'flex', alignItems:'center', gap: 10, minWidth: 0}}>
                  <span style={{fontSize: 13.5, color:'var(--ink)', whiteSpace:'nowrap'}}>{a.action}</span>
                  <span style={{fontSize: 13, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>· {a.target}</span>
                  {a.incident && <Pill tone="risk">incident</Pill>}
                </div>
                <span className="mono" style={{fontSize: 10, letterSpacing:'.12em', color:'var(--muted)', textTransform:'uppercase'}}>{a.reversible}</span>
                <span style={{
                  fontFamily:'var(--mono)', fontSize: 14, color:'var(--ink-mid)',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .15s',
                }}>›</span>
              </button>
              {isExpanded && (
                <div style={{padding:'0 22px 18px 56px'}}>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 24, fontSize: 12.5, color:'var(--ink-mid)'}}>
                    <div>
                      <div className="mono" style={{fontSize: 10, letterSpacing:'.12em', color:'var(--muted)', marginBottom: 4, fontWeight: 500}}>SOURCE</div>
                      <div className="mono" style={{fontSize: 11.5, color:'var(--ink)'}}>{a.source}</div>
                    </div>
                    <div>
                      <div className="mono" style={{fontSize: 10, letterSpacing:'.12em', color:'var(--muted)', marginBottom: 4, fontWeight: 500}}>WORKFLOW</div>
                      <div className="mono" style={{fontSize: 11.5, color:'var(--ink)'}}>{a.workflow}</div>
                    </div>
                  </div>
                  <div style={{display:'flex', gap: 8, marginTop: 14}}>
                    <Btn size="sm">Open full record</Btn>
                    {(a.reversible === "green" || a.reversible === "amber") && <Btn size="sm" kind="ghost">Roll back</Btn>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, tone }) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'risk' ? 'var(--risk)' : 'var(--ink)';
  return (
    <div className="dcard" style={{padding:'18px 22px'}}>
      <div className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em', marginBottom:8}}>{label.toUpperCase()}</div>
      <div style={{fontFamily:'var(--serif)', fontSize:44, lineHeight:1, color, fontWeight:400}}>{value}</div>
      <div className="dim mt-2" style={{fontSize:12}}>{sub}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// MOBILE — Approval-first, thumb-friendly
// 6 tabs → 2 (Approval / Activity). Flow states preserved as a
// "Preview state" cycle for the prototype demo.
// ───────────────────────────────────────────────────────────────────
function MobileScreen({ onOpen }) {
  const [view, setView] = useState("approval");
  const v2 = window.CENDRA_DATA.mobile_v2;
  const q = v2.quick_card;
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  // Two-tab toggle replaces 6 tabs
  const tabs = [
    { id: "approval", label: "Approval" },
    { id: "activity", label: "Activity" },
  ];

  // For prototype demo: cycle through flow states inside the phone
  const previewStates = [
    { id: "push", label: "Push" },
    { id: "approval", label: "Open" },
    { id: "evidence", label: "Evidence" },
    { id: "takeover", label: "Takeover" },
    { id: "paused", label: "Paused" },
  ];

  // Map: which view to render given selected tab + preview state
  const tab = view === "activity" ? "activity" : "approval";

  return (
    <div className="mobile-stage">
      <div className="mobile-tabbar" style={{display:'flex', gap: 8, justifyContent:'center', paddingBottom: 8}}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            all:'unset', cursor:'pointer',
            padding:'8px 18px', borderRadius: 999,
            border:'1px solid ' + (view === t.id || (tab === t.id && view !== "activity") ? 'var(--ink)' : 'var(--hair)'),
            background: (view === t.id || (tab === t.id && view !== "activity")) ? 'var(--ink)' : '#ffffff',
            color: (view === t.id || (tab === t.id && view !== "activity")) ? '#ffffff' : 'var(--ink-mid)',
            fontSize: 13, fontWeight: 500,
          }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{display:'flex', gap: 4, justifyContent:'center', flexWrap:'wrap', padding:'0 20px 14px', maxWidth: 460, margin:'0 auto'}}>
        <span className="mono" style={{fontSize: 9.5, letterSpacing:'.14em', color:'var(--muted-2)', alignSelf:'center', marginRight: 6}}>PREVIEW STATE ·</span>
        {previewStates.map(s => (
          <button key={s.id} onClick={() => setView(s.id)} style={{
            all:'unset', cursor:'pointer',
            padding:'3px 9px', fontSize: 10.5, fontFamily:'var(--mono)',
            color: view === s.id ? 'var(--ink)' : 'var(--muted)',
            borderBottom: '1px solid ' + (view === s.id ? 'var(--ink)' : 'transparent'),
            letterSpacing:'.04em',
          }}>{s.label}</button>
        ))}
      </div>

      <div className="phone">
        <div className="phone-status">
          <span className="mono" style={{fontSize:11}}>{v2.push.time}</span>
          <span className="mono" style={{fontSize:11, opacity:.55}}>·  ●●●  ·</span>
          <span className="mono" style={{fontSize:11}}>92%</span>
        </div>

        {view === "push" && (
          <div className="phone-body phone-locked">
            <div className="phone-time">06:14</div>
            <div className="phone-date">Friday · 9 May</div>
            <div className="push-card">
              <div className="row" style={{justifyContent:'space-between', alignItems:'baseline'}}>
                <span className="mono" style={{fontSize:10, letterSpacing:'.18em', color:'var(--ink)'}}>CENDRA</span>
                <span className="mono dim" style={{fontSize:10}}>now</span>
              </div>
              <div className="push-title">{v2.push.title}</div>
              <div className="push-body">{v2.push.body}</div>
              <div className="push-actions">
                <button className="push-act" onClick={() => setView("approval")}>Open</button>
                <button className="push-act dim">Snooze 15m</button>
              </div>
            </div>
            <div className="phone-hint">Cendra only pushes when something is final, risky, or breaching SLA.</div>
          </div>
        )}

        {view === "today" && (
          <div className="phone-body">
            <div className="row" style={{alignItems:'center',justifyContent:'space-between'}}>
              <div className="brand"><span className="logo" style={{fontSize:22}}>Cendra<span className="dot"/></span></div>
              <div className="heartbeat" style={{fontSize:10}}>on watch</div>
            </div>
            <div className="eyebrow mt-3">URGENT · 2 NEED YOU NOW</div>
            <h1 className="phone-h1">Two things want you.</h1>
            <p className="phone-lead">Cendra resolved 47 overnight. The rest is steady.</p>
            <div className="col gap-3 mt-4">
              <button className="phone-card" onClick={() => setView("approval")}>
                <div className="row gap-1" style={{flexWrap:'wrap', marginBottom:6}}>
                  <Pill tone="risk">Damage claim · €640</Pill>
                  <Pill>OTA window 38h</Pill>
                </div>
                <div className="phone-card-title">Aiyana C. · Bosphorus Loft</div>
                <div className="phone-card-sub">Cleaner photos show wall damage. Cendra prepared evidence and a neutral first message.</div>
                <div className="phone-card-foot"><span className="mono dim" style={{fontSize:10}}>BOOKING.COM · 2H 14M WAITING</span></div>
              </button>
              <button className="phone-card" onClick={() => setView("approval")}>
                <div className="row gap-1" style={{flexWrap:'wrap', marginBottom:6}}>
                  <Pill tone="warn">Vendor quote · €340</Pill>
                  <Pill>Plumber</Pill>
                </div>
                <div className="phone-card-title">Selin D. · Bosphorus Loft</div>
                <div className="phone-card-sub">Quote €340 exceeds €150 auto-spend cap. Cendra pre-approved scope, needs your ceiling.</div>
                <div className="phone-card-foot"><span className="mono dim" style={{fontSize:10}}>SLA · 26M LEFT</span></div>
              </button>
            </div>
            <div className="quiet-block mt-5">
              <div className="mono" style={{fontSize:10, opacity:.6, letterSpacing:'.18em', marginBottom:6}}>HEARTBEAT</div>
              <div style={{fontFamily:'var(--serif)', fontSize:18, fontStyle:'italic', lineHeight:1.3}}>
                0 incidents in 30 days. 99.4% match. On watch.
              </div>
            </div>
          </div>
        )}

        {view === "approval" && (
          <div className="phone-body">
            <button className="link-btn back-link" onClick={() => setView("today")}>← Today</button>
            <div className="eyebrow mt-2">APPROVAL · NEVER AUTO</div>
            <h1 className="phone-h1">{q.title}</h1>
            <div className="row gap-1 mt-2" style={{flexWrap:'wrap'}}>
              <AutonomyPill state="never" />
              <Pill tone="risk">Risk · {q.risk}</Pill>
              
            </div>
            <div className="phone-kv mt-4">
              <span>Property</span><span>{q.property}</span>
              <span>Channel</span><span>{q.channel}</span>
              <span>Reversibility</span><span style={{color:'var(--risk)'}}>Final once filed</span>
              <span>OTA window</span><span>{q.sla}</span>
            </div>
            <div className="phone-summary">{q.summary}</div>
            <div className="phone-cta-rec">
              <div className="mono" style={{fontSize:10, letterSpacing:'.18em', color:'var(--ink)', marginBottom:6}}>CENDRA RECOMMENDS</div>
              <div style={{fontSize:14, lineHeight:1.5}}>Send a neutral message first. File the claim only if guest goes silent. Keeps OTA window with 14h buffer.</div>
            </div>
            <div className="phone-actions">
              <Btn kind="primary" onClick={() => alert('Safer alternative sent')}>Use safer alternative</Btn>
              <button className="link-btn" onClick={() => setView("evidence")}>See full evidence pack →</button>
            </div>
            <div className="phone-secondary">
              <button className="link-btn">Edit message</button>
              <button className="link-btn" onClick={() => setView("takeover")}>Take over thread</button>
              <button className="link-btn risk-link">Authorize €640 claim</button>
            </div>
            <p className="phone-foot">If you do nothing, Cendra will hold and re-prompt at T−12h.</p>
          </div>
        )}

        {view === "evidence" && (
          <div className="phone-body">
            <button className="link-btn back-link" onClick={() => setView("approval")}>← Approval</button>
            <div className="eyebrow mt-2">EVIDENCE PACK · 5 ITEMS · ALL FRESH</div>
            <h1 className="phone-h1">Why this needs you.</h1>
            <div className="evidence-list">
              {D.approval.evidence.map((e, i) => (
                <div key={i} className="evidence-row">
                  <div className="mono" style={{fontSize:9, letterSpacing:'.18em', color:'var(--ink)'}}>{e.kind.toUpperCase()}</div>
                  <div style={{fontSize:13, lineHeight:1.4, marginTop:3}}>{e.label}</div>
                  <div className="mono dim" style={{fontSize:10, marginTop:3}}>{e.source} · {e.fresh}</div>
                </div>
              ))}
            </div>
            <Btn size="sm" kind="ghost" onClick={() => alert('Call Marta')}>Call cleaner · Marta C.</Btn>
          </div>
        )}

        {view === "takeover" && (
          <div className="phone-body">
            <button className="link-btn back-link" onClick={() => setView("approval")}>← Back</button>
            <div className="eyebrow mt-2">TAKE OVER THREAD</div>
            <h1 className="phone-h1">You drive from here.</h1>
            <p className="phone-lead">Cendra will stop drafting and pause autonomy on this conversation. The audit log notes the handoff.</p>
            <div className="phone-kv mt-4">
              <span>Cendra status</span><span>Paused on thread</span>
              <span>Drafts</span><span>Saved · not sent</span>
              <span>Other guests</span><span>Unaffected</span>
              <span>Resume</span><span>"Hand back to Cendra" anytime</span>
            </div>
            <div className="phone-actions">
              <Btn kind="primary">Take over now</Btn>
              <Btn>Call Aiyana directly</Btn>
              <Btn kind="ghost" onClick={() => setView("paused")}>Pause Cendra for this guest only</Btn>
            </div>
          </div>
        )}

        {view === "paused" && (
          <div className="phone-body">
            <button className="link-btn back-link" onClick={() => setView("approval")}>← Approval</button>
            <div className="paused-card">
              <div className="mono" style={{fontSize:10, letterSpacing:'.18em', color:'var(--ink)'}}>CENDRA PAUSED · APT12 · LUKAS B.</div>
              <h1 className="phone-h1" style={{marginTop:6}}>Cendra is quiet on this thread.</h1>
              <p className="phone-lead">It will not message Lukas, draft, or auto-act. The rest of your portfolio runs as usual.</p>
              <div className="phone-kv mt-4">
                <span>Paused</span><span>Just now</span>
                <span>Scope</span><span>This conversation only</span>
                <span>Audit</span><span>Logged · ax-pause-1183</span>
              </div>
              <div className="phone-actions">
                <Btn kind="primary">Hand back to Cendra</Btn>
                <Btn>Open thread</Btn>
              </div>
            </div>
          </div>
        )}

        {view === "activity" && (
          <div className="phone-body">
            <div className="eyebrow mt-1">RECENT · LAST 12H</div>
            <h1 className="phone-h1">What you did.</h1>
            <p className="phone-lead">Every decision on this phone, in order. Tap to revisit.</p>
            <div style={{display:'grid', gap: 10, marginTop: 18}}>
              {[
                { time: "06:14", actor: "You", action: "Approved", target: "Safer alternative · Aiyana C.", tone: "ok" },
                { time: "Yest. 21:02", actor: "You", action: "Published rule", target: "Never promise early check-in", tone: "ok" },
                { time: "Yest. 18:31", actor: "Cendra", action: "Auto-paused", target: "Late checkout offer · 24h", tone: "warn" },
                { time: "2d ago", actor: "You", action: "Took over", target: "Thread with Rafael S.", tone: "info" },
              ].map((a, i) => (
                <div key={i} style={{
                  padding:'14px 16px', borderRadius: 10,
                  background:'#ffffff', border:'1px solid var(--hair)',
                }}>
                  <div className="mono" style={{fontSize: 10, letterSpacing:'.12em', color:'var(--muted)', marginBottom: 6}}>
                    {a.time.toUpperCase()} · {a.actor.toUpperCase()}
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 4}}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: a.tone === 'ok' ? 'var(--ok)' : a.tone === 'warn' ? 'var(--warn)' : 'var(--info)',
                    }} />
                    <span style={{fontSize: 14, fontWeight: 500, color:'var(--ink)'}}>{a.action}</span>
                  </div>
                  <div style={{fontSize: 13, color:'var(--ink-mid)', lineHeight: 1.45, paddingLeft: 16}}>{a.target}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.CendraScreens2 = {
  AutopilotScreen, PlaybookScreen, PropertyBrainScreen, LearningScreen, AuditScreen, MobileScreen,
};
