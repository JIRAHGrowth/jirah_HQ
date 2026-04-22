// Right-side persistent briefing panel
function BriefingPanel({ briefing }) {
  return (
    <div>
      <div className="briefing-head">
        <span className="briefing-kicker">Today's Briefing</span>
      </div>
      <div className="briefing-date">{briefing.date}</div>
      <div className="briefing-meta">Partner sync · 8:30 AM PT · Prepared by Claude</div>

      <div className="briefing-section">
        <h5><Ic.AlertTriangle size={11}/> Overdue <span className="pill red">{briefing.overdue.length}</span></h5>
        {briefing.overdue.map(it => <BItem key={it.id} item={it}/>)}
      </div>

      <div className="briefing-section">
        <h5><Ic.Flame size={11}/> Sprint Risks <span className="pill amber">{briefing.sprint.length}</span></h5>
        {briefing.sprint.map(it => <BItem key={it.id} item={it}/>)}
      </div>

      <div className="briefing-section">
        <h5><Ic.TrendingUp size={11}/> Warm Prospects <span className="pill gold">{briefing.warm.length}</span></h5>
        {briefing.warm.map(it => <BItem key={it.id} item={it}/>)}
      </div>

      <div className="briefing-foot">
        Briefing regenerates at 6am daily from pipeline, engagements and inbox signal.
      </div>
    </div>
  );
}

function BItem({ item }) {
  return (
    <div className="bitem">
      <div className="bitem-top">
        <span className="bitem-name">{item.name}</span>
        <span className="bitem-when">{item.when}</span>
      </div>
      <div className="bitem-body">{item.body}</div>
      <button className="bitem-cta">{item.cta} <Ic.ArrowRight size={11}/></button>
    </div>
  );
}

Object.assign(window, { BriefingPanel, BItem });
