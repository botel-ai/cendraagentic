// Cendra screens: Autopilot, Playbook, Property Brain, Learning, Audit, Mobile
const { Pill, AutonomyPill, ReasonPill, Seal, Btn, ActionBar, DecisionCard, WhyDrawer, PageHeader, QuietState } = window.CendraAtoms;
const D2 = window.CENDRA_DATA;
const DP = window.CENDRA_DATA2;

// ───────────────────────────────────────────────────────────────────
// AUTOPILOT / Trust Meter — autonomy ladder (orchestra)
// ───────────────────────────────────────────────────────────────────
function AutopilotScreen({ tweaks }) {
  const ladderVariant = tweaks?.autonomyLadder || "orchestra";
  const [changeReq, setChangeReq] = useState(null);

  // Aggregate stats from groups
  const allWfs = DP.workflow_groups.flatMap(g => g.workflows);
  const stats = {
    total: allWfs.length,
    autopilot: allWfs.filter(w => w.state === "autopilot").length,
    semi:      allWfs.filter(w => w.state === "semi").length,
    approval:  allWfs.filter(w => w.state === "approval").length,
    observe:   allWfs.filter(w => w.state === "observe").length,
    never:     allWfs.filter(w => w.state === "never").length,
    ready:     allWfs.filter(w => w.ready).length,
  };

  return (
    <div className="stage">
      <PageHeader
        eyebrow="AUTOPILOT · WORKFLOW TRUST CENTER"
        title="What you let Cendra handle."
        lead={<>Each workflow has its own trust level. Cendra promotes itself slowly, demotes itself instantly. <b style={{color:'var(--ink)'}}>There is no global AI on/off.</b></>}
        right={
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <Btn kind="ghost" size="sm">Pause all</Btn>
            <Btn>+ New workflow</Btn>
          </div>
        }
      />

      {/* Stats strip */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap: 0,
        border:'1px solid var(--hair)', background:'var(--card)', borderRadius:6,
        marginBottom: 22,
      }}>
        {[
          { label: "Autopilot",  v: stats.autopilot, c: 'var(--ok)' },
          { label: "Semi-auto",  v: stats.semi,      c: 'var(--info)' },
          { label: "Approval",   v: stats.approval,  c: 'var(--warn)' },
          { label: "Observe",    v: stats.observe,   c: 'var(--muted)' },
          { label: "Never auto", v: stats.never,     c: 'var(--risk)' },
          { label: "Ready to promote", v: stats.ready, c: 'var(--ok)' },
        ].map((s, i) => (
          <div key={i} style={{padding:'14px 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--hair-soft)'}}>
            <div className="mono dim" style={{fontSize:9.5, letterSpacing:'.16em', textTransform:'uppercase'}}>{s.label}</div>
            <div style={{fontFamily:'var(--mono)', fontSize:22, fontWeight:500, color: s.c, lineHeight:1.1, marginTop:4}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Workflow groups */}
      {DP.workflow_groups.map(group => (
        <WorkflowGroup key={group.id} group={group} onPromote={(wf) => setChangeReq({ wf, group })} />
      ))}

      {changeReq && <ChangeRequestDrawer wf={changeReq.wf} group={changeReq.group} onClose={() => setChangeReq(null)} />}
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

// Change request drawer (promote / demote)
function ChangeRequestDrawer({ wf, group, onClose }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position:'fixed', top:0, right:0, bottom:0, width:'min(560px, 92vw)',
        background:'var(--card)', borderLeft:'1px solid var(--hair)',
        boxShadow:'var(--shadow-raised)', overflowY:'auto', padding: 32,
      }}>
        <button onClick={onClose} className="mono dim" style={{all:'unset',cursor:'pointer',fontSize:11,marginBottom:18,display:'block'}}>← Close</button>
        <div className="eyebrow mb-2">CHANGE REQUEST · {group.name.toUpperCase()}</div>
        <h2 style={{fontFamily:'var(--serif)', fontSize: 28, fontWeight: 400, letterSpacing:'-.005em', margin:'4px 0 18px', lineHeight: 1.15}}>
          Promote <span style={{fontStyle:'italic'}}>{wf.name}</span> to autopilot?
        </h2>

        <div className="dcard" style={{padding:'14px 18px', marginBottom:14}}>
          <div className="eyebrow mb-2">WHAT WILL CHANGE</div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <AutonomyPill state={wf.state} /> <span className="mono" style={{fontSize:11, color:'var(--muted)'}}>→</span> <AutonomyPill state="autopilot" />
          </div>
          <div className="dim mt-2" style={{fontSize:13}}>{wf.default}. Hold window: 0 min. No human review unless an incident triggers demotion.</div>
        </div>

        <div className="dcard" style={{padding:'14px 18px', marginBottom:14}}>
          <div className="eyebrow mb-2">SCOPE</div>
          <div style={{fontSize:13.5}}>Affected: <b>{wf.scope === "portfolio" ? `${DP.portfolio.properties_count} properties` : wf.scope === "owner" ? `One owner group` : "Single property"}</b></div>
        </div>

        <div className="dcard" style={{padding:'14px 18px', marginBottom:14}}>
          <div className="eyebrow mb-2">SIMULATIONS</div>
          <div className="col gap-2" style={{fontSize:13}}>
            <div>{wf.samples} historical cases replayed · <span style={{color:'var(--ok)'}}>0 mismatch</span></div>
            <div>30-day live shadow run · <span style={{color:'var(--ok)'}}>0 incidents</span></div>
            <div>Override rate stable at {wf.override}</div>
          </div>
        </div>

        <div className="dcard" style={{padding:'14px 18px', marginBottom:14}}>
          <div className="eyebrow mb-2">REMAINING RISK</div>
          <p className="dim" style={{margin:0, fontSize:13, fontStyle:'italic'}}>
            {wf.why}
          </p>
        </div>

        <div className="dcard" style={{padding:'14px 18px', marginBottom:24}}>
          <div className="eyebrow mb-2">ROLLBACK</div>
          <div style={{fontSize:13}}>If incident rate exceeds 0.5% in 7 days, Cendra auto-demotes back to <b>{wf.state === 'semi' ? 'semi-auto' : wf.state}</b>. You'll be notified.</div>
        </div>

        <div style={{display:'flex',gap:10}}>
          <Btn kind="primary" onClick={() => { alert('Promotion scheduled for tonight 02:00.'); onClose(); }}>Schedule promotion</Btn>
          <Btn>Publish now</Btn>
          <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        </div>
        <div className="mono dim mt-4" style={{fontSize:10.5, lineHeight:1.7}}>
          Cendra will write a DecisionCase entry. You can roll back any time from Audit.
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
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Early check-in handling");
  const [intent, setIntent] = useState("When a guest asks to check in earlier than 15:00, never promise a time before cleaning is confirmed. Send a holding reply, ping the cleaner, and follow up when we have a sharper ETA.");

  return (
    <div className="stage" style={{maxWidth: 1100}}>
      <PageHeader
        eyebrow="PLAYBOOK · BUILDER"
        title="Teach Cendra in plain English."
        lead="Describe how you handle a situation. Cendra structures it, simulates it on past cases, and only publishes after you approve."
      />

      <div style={{display:'grid', gridTemplateColumns: '230px 1fr', gap: 32}}>
        <div className="col gap-1">
          {["Describe", "Structure", "Scope", "Simulate", "Publish"].map((s, i) => (
            <button key={s} onClick={() => setStep(i)} style={{
              all:'unset', cursor:'pointer',
              display:'flex', alignItems:'center', gap:10,
              padding:'10px 12px', borderRadius: 4,
              background: i === step ? 'var(--ink)' : 'transparent',
              color: i === step ? 'var(--paper)' : 'var(--ink-mid)',
              fontSize: 13.5,
            }}>
              <span className="mono" style={{fontSize:10, opacity: .7}}>{String(i+1).padStart(2,'0')}</span>
              {s}
            </button>
          ))}
          <hr className="hairline mt-4 mb-4" />
          <div className="eyebrow mb-2">SCOPE</div>
          <Pill>Owner · Karaköy LLC</Pill>
        </div>

        <div>
          {step === 0 && (
            <div>
              <div className="eyebrow mb-2">PLAYBOOK NAME</div>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  fontFamily:'var(--serif)', fontSize:30, fontWeight:400,
                  border:0, outline:0, background:'transparent',
                  width:'100%', borderBottom: '1px solid var(--hair)',
                  padding:'4px 0 8px',
                }}
              />
              <div className="eyebrow mt-6 mb-2">DESCRIBE THE SITUATION</div>
              <textarea
                value={intent}
                onChange={e => setIntent(e.target.value)}
                style={{
                  width:'100%', minHeight: 180,
                  border:'1px solid var(--hair)', borderRadius:6,
                  padding:'14px 16px', fontFamily:'var(--serif)', fontSize:16,
                  lineHeight: 1.55, resize:'vertical',
                  background:'var(--card)',
                }}
              />
              <div className="mt-4" style={{display:'flex',gap:8}}>
                <Btn kind="primary" onClick={() => setStep(1)}>Structure with Cendra →</Btn>
                <Btn kind="ghost">Upload SOP doc</Btn>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="eyebrow mb-2">CENDRA'S STRUCTURED PLAYBOOK</div>
              <div className="dcard" style={{padding:'18px 22px'}}>
                <RuleRow label="TRIGGER" value="Guest message contains early-check-in intent (parsed)" />
                <RuleRow label="CHECKS" value="cleaning_status · same_day_turnover · property_rules · last_3_decisions" />
                <RuleRow label="ALLOWED" value="Send holding reply · Ping cleaner · Promise check-in time IF cleaning_status = 'confirmed' AND ETA < requested_time" />
                <RuleRow label="APPROVAL" value="If proposed_time differs from standard 15:00 by &gt; 1h" />
                <RuleRow label="NEVER" value="Promise an early check-in time when cleaning is unconfirmed" tone="risk" />
                <RuleRow label="HOLD" value="0 minutes (operates as approval-required)" />
              </div>
              <div className="mt-4" style={{display:'flex',gap:8}}>
                <Btn onClick={() => setStep(0)}>← Back</Btn>
                <Btn kind="primary" onClick={() => setStep(2)}>Set scope →</Btn>
                <Btn kind="ghost">Edit structure</Btn>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="eyebrow mb-2">WHERE SHOULD THIS APPLY?</div>
              <div className="col gap-2">
                {[
                  { label: "Just this property", desc: "Karaköy · Apartment 12" },
                  { label: "All properties under owner", desc: "Karaköy LLC · 6 properties", active: true },
                  { label: "All properties under this brand", desc: "Cendra Hospitality · 47 properties" },
                  { label: "This guest only", desc: "Lukas Berger" },
                ].map((s, i) => (
                  <label key={i} style={{
                    display:'block', cursor:'pointer',
                    border: '1px solid var(--hair)',
                    background: s.active ? 'var(--paper-2)' : 'var(--card)',
                    borderColor: s.active ? 'var(--ink)' : 'var(--hair)',
                    borderRadius: 6, padding: '14px 18px',
                  }}>
                    <input type="radio" name="scope" defaultChecked={s.active} style={{marginRight:10}} />
                    <b>{s.label}</b>
                    <div className="dim" style={{marginLeft:24, fontSize:12.5}}>{s.desc}</div>
                  </label>
                ))}
              </div>
              <div className="mt-4" style={{display:'flex',gap:8}}>
                <Btn onClick={() => setStep(1)}>← Back</Btn>
                <Btn kind="primary" onClick={() => setStep(3)}>Simulate on history →</Btn>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="eyebrow mb-2">SIMULATION · LAST 30 DAYS · 11 CASES</div>
              <div className="dcard" style={{padding:'18px 22px'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:24}}>
                  <SimStat label="Would route to approval" value="11" />
                  <SimStat label="Would change outcome" value="3" tone="warn" />
                  <SimStat label="Would have prevented incident" value="1" tone="ok" />
                  <SimStat label="Failed simulations" value="0" tone="ok" />
                </div>
              </div>
              <div className="mt-4 dcard" style={{padding:'18px 22px'}}>
                <div className="eyebrow mb-3">EXAMPLE CASE · 11d AGO · BKG-44012</div>
                <p style={{margin:0, fontFamily:'var(--serif)', fontSize:15, lineHeight:1.5, fontStyle:'italic'}}>
                  Guest asked to check in at 13:30. Cendra (old behavior) promised 13:00. Cleaning slipped to 14:15. Resulted in mild complaint.
                </p>
                <div className="mono dim mt-3" style={{fontSize:11.5}}>
                  WITH NEW PLAYBOOK → Cendra would have routed this to approval. You would have seen the cleaning ETA mismatch and held the line at 15:00.
                </div>
              </div>
              <div className="mt-4" style={{display:'flex',gap:8}}>
                <Btn onClick={() => setStep(2)}>← Back</Btn>
                <Btn kind="primary" onClick={() => setStep(4)}>Review &amp; publish →</Btn>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="eyebrow mb-2">READY TO PUBLISH</div>
              <div className="dcard" style={{padding:'22px 26px'}}>
                <h2 className="h2">{name}</h2>
                <p className="lead">Cendra will start using this playbook on the next matching guest message.</p>
                <hr className="hairline mt-4 mb-4" />
                <div className="col gap-2 mono" style={{fontSize:11.5, color:'var(--ink-mid)'}}>
                  <div>SCOPE · Karaköy LLC · 6 properties</div>
                  <div>MODE · Approval required</div>
                  <div>SIMULATION · 11/11 passed · 1 incident prevented</div>
                  <div>HARD RULE · Never promise early check-in unless cleaning is confirmed</div>
                </div>
                <div className="actionbar" style={{marginTop:18, marginLeft:-26, marginRight:-26, marginBottom:-22}}>
                  <Btn kind="primary">Publish playbook</Btn>
                  <Btn>Save as draft</Btn>
                  <span className="grow" />
                  <Btn kind="ghost" size="sm">Schedule review in 30d</Btn>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
  const tone = f.state === "missing" ? "info" : f.state === "conflict" ? "warn" : "info";
  const isMissing = f.state === "missing";
  const [answered, setAnswered] = useState(false);

  return (
    <div className="dcard" style={{padding:'18px 22px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start', marginBottom: 8}}>
        <div>
          <div className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em', marginBottom:4}}>
            {f.scope.toUpperCase()} · {f.fact.toUpperCase()}
          </div>
          <h3 style={{fontFamily:'var(--serif)', fontSize:22, lineHeight:1.2, fontWeight:400, margin:0, letterSpacing:'-.005em'}}>
            {isMissing ? `Does ${f.scope} have ${f.fact.toLowerCase()}?` :
             f.state === "conflict" ? `Conflict: ${f.fact} on ${f.scope}` :
             `${f.fact} hasn't been verified recently`}
          </h3>
          <p className="dim" style={{margin: '6px 0 0', fontSize:13}}>{f.hint}</p>
        </div>
        <Pill tone={f.state === "conflict" ? "warn" : f.state === "stale" ? "info" : "info"}>{f.state}</Pill>
      </div>

      {answered ? (
        <div className="dcard mt-3" style={{padding:'10px 14px', background:'var(--ok-soft)', borderColor:'color-mix(in oklab, var(--ok), white 70%)'}}>
          <div className="mono" style={{fontSize:10.5, color:'var(--ok)', letterSpacing:'.16em'}}>SAVED · SOURCE = PM CONFIRMED</div>
          <div style={{fontSize:13, marginTop:3}}>Cendra will use this for all future guests.</div>
        </div>
      ) : isMissing ? (
        <div style={{display:'flex',gap:8, marginTop:12, flexWrap:'wrap'}}>
          <Btn kind="primary" size="sm" onClick={() => setAnswered(true)}>Yes, available</Btn>
          <Btn size="sm" onClick={() => setAnswered(true)}>No, not available</Btn>
          <Btn size="sm">Conditional…</Btn>
          <span className="grow" />
          <Btn kind="ghost" size="sm">Internal only</Btn>
          <Btn kind="ghost" size="sm">Ask owner</Btn>
        </div>
      ) : (
        <div style={{marginTop:12}}>
          <div className="dcard" style={{padding:'10px 14px', background:'var(--paper)'}}>
            <div className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em'}}>CURRENT VALUE</div>
            <div style={{fontSize:13.5, marginTop:3}}>{f.value}</div>
          </div>
          <div style={{display:'flex',gap:8, marginTop:10}}>
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
  return (
    <div className="dcard" style={{padding: 0, opacity: decided ? 0.55 : 1, transition: 'opacity .3s'}}>
      <div style={{padding:'20px 24px', display:'grid', gridTemplateColumns:'1fr 280px', gap: 32}}>
        <div>
          <div className="mono dim" style={{fontSize:10.5, letterSpacing:'.16em', marginBottom:6}}>
            CENDRA NOTICED · {l.examples} EXAMPLES · CONFIDENCE {Math.round(l.confidence*100)}%
          </div>
          <h3 style={{fontFamily:'var(--serif)', fontSize:24, lineHeight:1.18, fontWeight:400, letterSpacing:'-.005em', margin:'0 0 8px'}}>
            {l.title}
          </h3>
          <p style={{margin:'0 0 14px', color:'var(--ink-mid)', fontSize:13.5, lineHeight:1.55}}>
            {l.observed}
          </p>

          <div className="dcard" style={{padding:'10px 14px', background:'var(--paper)'}}>
            <div className="mono dim" style={{fontSize:10, letterSpacing:'.18em', marginBottom: 4}}>PROPOSED RULE</div>
            <div style={{fontSize:13, lineHeight:1.5}}>{l.proposed}</div>
          </div>

          <div className="mono dim mt-3" style={{fontSize:11}}>
            SIMULATION · {l.simulation.passed} passed · {l.simulation.failed} failed · {l.simulation.would_change}
          </div>

          {l.id === "l1" && window.CendraVision && (
            <div style={{marginTop: 16}}>
              <window.CendraVision.TeachScope />
            </div>
          )}
        </div>

        <div className="col gap-2">
          <Pill tone={l.risk === "low" ? "ok" : l.risk === "medium" ? "warn" : "risk"}>Risk · {l.risk}</Pill>
          <Pill tone="info">{l.examples} examples</Pill>
          <Pill>{l.overrides} overrides · {l.incidents} incidents</Pill>
        </div>
      </div>

      {decided ? (
        <div className="actionbar" style={{justifyContent:'center'}}>
          <span className="mono" style={{fontSize:11, letterSpacing:'.16em', color: decided === 'approve' ? 'var(--ok)' : 'var(--muted)'}}>
            {decided === 'approve' ? '✓ ADDED · CENDRA WILL USE THIS ON NEXT MATCH' : '✕ REJECTED · CENDRA WILL NOT SUGGEST AGAIN'}
          </span>
        </div>
      ) : (
        <div className="actionbar">
          <Btn kind="primary" onClick={() => setDecided('approve')}>Approve as rule</Btn>
          <Btn>Edit scope</Btn>
          <Btn kind="ghost" onClick={() => setDecided('reject')}>Not now</Btn>
          <span className="grow" />
          <Btn kind="ghost" size="sm">Mark never auto</Btn>
          <Btn kind="ghost" size="sm">Run more simulations</Btn>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// AUDIT TRAIL
// ───────────────────────────────────────────────────────────────────
function AuditScreen() {
  return (
    <div className="stage">
      <PageHeader
        eyebrow="TRUST · AUDIT TRAIL"
        title="Every decision. Immutable."
        lead="Filter by actor, workflow, incident, or reversibility. Export for compliance. Roll back any reversible action."
        right={
          <div style={{display:'flex',gap:8}}>
            <Btn size="sm">Filter</Btn>
            <Btn size="sm">Export · CSV</Btn>
          </div>
        }
      />

      <div className="dcard" style={{padding:0}}>
        <table className="table">
          <thead><tr>
            <th style={{width:170}}>When</th>
            <th style={{width:140}}>Actor</th>
            <th>Action</th>
            <th>Target</th>
            <th style={{width:170}}>Source</th>
            <th style={{width:90}}>Reversible</th>
            <th style={{width:90}}></th>
          </tr></thead>
          <tbody>
            {D2.audit.map(a => (
              <tr key={a.id}>
                <td className="mono" style={{fontSize:11}}>{a.time}</td>
                <td>
                  <div style={{fontWeight: a.actor === 'Cendra' ? 400 : 500, fontStyle: a.actor === 'Cendra' ? 'italic' : 'normal', fontFamily: a.actor === 'Cendra' ? 'var(--serif)' : 'var(--sans)', fontSize: a.actor === 'Cendra' ? 16 : 13.5}}>
                    {a.actor}
                  </div>
                </td>
                <td>
                  {a.action}
                  {a.incident && <Pill tone="risk" style={{marginLeft:8}}>incident</Pill>}
                </td>
                <td className="dim" style={{fontSize:12.5}}>{a.target}</td>
                <td className="mono dim" style={{fontSize:11}}>{a.source}</td>
                <td>
                  <span className="mono dim" style={{fontSize:11}}>{a.reversible}</span>
                </td>
                <td><Btn size="sm" kind="ghost">Open →</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6" style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 16}}>
        <StatCard label="Decisions · 30d" value="2,418" sub="0.4% override rate" />
        <StatCard label="Incidents · 30d" value="0" sub="Last incident: 23d ago" tone="ok" />
        <StatCard label="Rollbacks · 30d" value="3" sub="All within 5 minutes" tone="warn" />
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
// MOBILE — Approval-first
// ───────────────────────────────────────────────────────────────────
function MobileScreen({ onOpen }) {
  const [view, setView] = useState("push");
  const v2 = window.CENDRA_DATA.mobile_v2;
  const q = v2.quick_card;

  return (
    <div className="mobile-stage">
      <div className="mobile-tabbar">
        {[
          ["push", "Push"],
          ["today", "Today"],
          ["approval", "Approval"],
          ["evidence", "Evidence"],
          ["takeover", "Takeover"],
          ["paused", "Paused"],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} className={CendraAtoms.cls("mtab", view === k && "is-on")}>{l}</button>
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
            <button className="link-btn back-link" onClick={() => setView("today")}>← Today</button>
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
      </div>
    </div>
  );
}

window.CendraScreens2 = {
  AutopilotScreen, PlaybookScreen, PropertyBrainScreen, LearningScreen, AuditScreen, MobileScreen,
};
