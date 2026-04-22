// Active Engagements card grid + drawer
const ENGAGEMENT_STEPS = ['Discovery', 'Disc. Doc', 'Kickoff', 'Sprint', 'Report', 'KPIs'];

function Stepper({ current, compact }) {
  return (
    <div className="stepper">
      {ENGAGEMENT_STEPS.map((step, i) => {
        const cls = i < current ? 'done' : i === current ? 'current' : '';
        return (
          <div className={`step ${cls}`} key={i}>
            <div className="circle">{i < current ? <Ic.Check size={10}/> : null}</div>
            {!compact && <div className="lbl">{step}</div>}
          </div>
        );
      })}
    </div>
  );
}

function EngagementsView({ data, onOpen }) {
  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Active Engagements</h1>
          <div className="view-sub">3 active · one flagged at risk this week</div>
        </div>
        <div className="view-actions">
          <button className="btn btn-ghost"><Ic.Calendar size={13}/> Week view</button>
          <button className="btn btn-primary">Partner sync notes <Ic.ArrowRight size={13}/></button>
        </div>
      </div>

      <div className="engagements">
        {data.map(e => (
          <button key={e.id} className="ecard" onClick={() => onOpen(e)}>
            <div className="ecard-head">
              <div>
                <div className="ecard-name">{e.name}</div>
                <div className="ecard-indust">{e.industry} · {e.geo}</div>
              </div>
              <div style={{display:'flex', gap: 6}}>
                <Avatar owner={e.owner}/>
                <Avatar owner={e.coOwner}/>
              </div>
            </div>

            <Stepper current={e.currentStep}/>

            <div className="ecard-milestone">
              <div className="mi"><Ic.Target size={16}/></div>
              <div style={{flex: 1}}>
                <div className="mt-lbl">Current milestone</div>
                <div className="mt-val">{e.milestone}</div>
                <div className="mt-due">{e.dueLabel}</div>
              </div>
            </div>

            <div className="ecard-foot">
              <span className={`lc ${e.warn ? 'warn' : ''}`}>
                {e.warn ? <Ic.AlertTriangle size={12}/> : <Ic.Clock size={12}/>}
                Last contact {e.lastContactDays}d ago
              </span>
              <span style={{textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 10.5, color: 'var(--muted)'}}>
                Step {e.currentStep + 1} / 6
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function EngagementDrawer({ item, onClose }) {
  if (!item) return null;
  return (
    <React.Fragment>
      <DrawerHead
        kicker="Active · Engagement"
        title={item.name}
        onClose={onClose}
        right={<div style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 10}}>
          <span className="tag">{item.industry}</span>
          <span className="tag geo"><Ic.MapPin size={10}/> {item.geo}</span>
          {item.warn && <span className="badge warm"><span className="bdot"/>At risk</span>}
        </div>}
      />
      <div className="drawer-body">
        <div className="drawer-section">
          <h4>Progress</h4>
          <div style={{padding: '6px 0 10px'}}>
            <Stepper current={item.currentStep}/>
          </div>
          <div style={{fontSize: 12.5, color: 'var(--ink-soft)'}}>
            Currently: <strong style={{color: 'var(--ink)'}}>{ENGAGEMENT_STEPS[item.currentStep]}</strong> · {item.milestone} ({item.dueLabel})
          </div>
        </div>

        <div className="drawer-section">
          <h4>Engagement</h4>
          <KV k="Sponsor" v={item.sponsor}/>
          <KV k="Contract" v={item.contract}/>
          <KV k="Lead" v={<span style={{display:'inline-flex',alignItems:'center',gap:8}}><Avatar owner={item.owner}/> {OwnerName(item.owner)}</span>}/>
          <KV k="Partner" v={<span style={{display:'inline-flex',alignItems:'center',gap:8}}><Avatar owner={item.coOwner}/> {OwnerName(item.coOwner)}</span>}/>
          <KV k="Last contact" v={`${item.lastContactDays} days ago`}/>
        </div>

        <div className="drawer-section">
          <h4>Recent activity</h4>
          <div className="timeline">
            {item.timeline.map((t, i) => (
              <div className="timeline-item" key={i}>
                <div className="ti-date">{t.date}</div>
                <div className="ti-body">{t.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="drawer-foot">
        <button className="btn"><Ic.PenLine size={13}/> Log contact</button>
        <button className="btn"><Ic.Calendar size={13}/> Schedule sync</button>
        <button className="btn btn-gold">Advance to next step <Ic.ArrowRight size={13}/></button>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { EngagementsView, EngagementDrawer, ENGAGEMENT_STEPS, Stepper });
