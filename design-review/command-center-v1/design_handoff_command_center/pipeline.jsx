// Pipeline Kanban view
function PipelineView({ data, onOpen }) {
  const cols = [
    { key: 'cold',     label: 'Cold',           dotCls: 'dot-slate'  },
    { key: 'warm',     label: 'Warm',           dotCls: 'dot-amber'  },
    { key: 'booked',   label: 'Meeting Booked', dotCls: 'dot-blue'   },
    { key: 'proposal', label: 'Proposal Sent',  dotCls: 'dot-indigo' },
    { key: 'won',      label: 'Closed Won',     dotCls: 'dot-green'  },
    { key: 'lost',     label: 'Closed Lost',    dotCls: 'dot-gray'   },
  ];
  const byStage = cols.map(c => ({
    ...c,
    items: data.filter(d => d.stage === c.key),
  }));

  const totalValue = (items) => items.reduce((s, i) => s + (i.value || 0), 0);

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Pipeline</h1>
          <div className="view-sub">13 opportunities · <span style={{color: 'var(--ink)'}}>{fmtMoney(data.reduce((s,i)=>s+i.value,0))}</span> weighted across stages</div>
        </div>
        <div className="view-actions">
          <button className="btn btn-ghost"><Ic.Filter size={13}/> Filter</button>
          <button className="btn btn-primary"><Ic.Plus size={13}/> Add opportunity</button>
        </div>
      </div>

      <div className="kanban">
        {byStage.map(col => (
          <div className="column" key={col.key}>
            <div className="column-head">
              <div className={`column-title ${col.dotCls}`}><span className="dot"/>{col.label}</div>
              <div className="column-count">{col.items.length}</div>
            </div>
            <div className="column-sum">{col.items.length ? fmtMoney(totalValue(col.items)) + ' potential' : '—'}</div>
            {col.items.map(item => (
              <button className="kcard" key={item.id} onClick={() => onOpen(item)}>
                <div className="kcard-top">
                  <div className="kcard-name">{item.name}</div>
                  <Avatar owner={item.owner}/>
                </div>
                <div className="kcard-meta">
                  <span className="tag">{item.industry}</span>
                  <span className="tag geo"><Ic.MapPin size={10}/> {item.geo}</span>
                </div>
                <div className="kcard-foot">
                  <span><Ic.Clock size={11}/> <span style={{marginLeft: 4}}>Last contact {item.lastContactDays}d ago</span></span>
                  {item.nextAction !== '—'
                    ? <span className="next">Next · {formatDate(item.nextAction)}</span>
                    : <span className="kcard-value">{fmtMoney(item.value)}</span>
                  }
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineDrawer({ item, onClose }) {
  if (!item) return null;
  return (
    <React.Fragment>
      <DrawerHead
        kicker="Pipeline · Opportunity"
        title={item.name}
        onClose={onClose}
        right={<div style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 10}}>
          <StageBadge stage={item.stage}/>
          <span className="tag">{item.industry}</span>
          <span className="tag geo"><Ic.MapPin size={10}/> {item.geo}</span>
        </div>}
      />
      <div className="drawer-body">
        <div className="drawer-section">
          <h4>Overview</h4>
          <KV k="Owner" v={<span style={{display:'inline-flex',alignItems:'center',gap:8}}><Avatar owner={item.owner}/> {OwnerName(item.owner)}</span>}/>
          <KV k="Primary contact" v={item.contact}/>
          <KV k="Source" v={item.source}/>
          <KV k="Est. value" v={<span style={{fontFamily:'var(--serif)', fontSize:15}}>{fmtMoney(item.value)}</span>}/>
          <KV k="Last contact" v={`${item.lastContactDays} days ago`}/>
          <KV k="Next action" v={item.nextAction === '—' ? '—' : formatDate(item.nextAction)}/>
        </div>
        <div className="drawer-section">
          <h4>Working notes</h4>
          <div style={{fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6}}>{item.notes}</div>
        </div>
        <div className="drawer-section">
          <h4>Recent activity</h4>
          <div className="timeline">
            <div className="timeline-item">
              <div className="ti-date">{item.lastContactDays} days ago</div>
              <div className="ti-body">Email thread continued with {item.contact.split(',')[0]}.</div>
            </div>
            <div className="timeline-item">
              <div className="ti-date">3 weeks ago</div>
              <div className="ti-body">Initial discovery — source: {item.source}.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="drawer-foot">
        <button className="btn"><Ic.Mail size={13}/> Log email</button>
        <button className="btn"><Ic.Calendar size={13}/> Schedule follow-up</button>
        <button className="btn btn-gold">Move to next stage <Ic.ArrowRight size={13}/></button>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { PipelineView, PipelineDrawer });
