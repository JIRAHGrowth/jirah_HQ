// Audit Applications table
function AuditView({ data, onOpen }) {
  const [sortKey, setSortKey] = React.useState('icp');
  const [sortDir, setSortDir] = React.useState('desc');
  const [filter, setFilter] = React.useState('all');

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir(k === 'icp' ? 'desc' : 'desc'); }
  };

  const filtered = data.filter(a => filter === 'all' ? true : a.status === filter);
  const sorted = [...filtered].sort((a, b) => {
    let av, bv;
    if (sortKey === 'icp') { av = a.icp; bv = b.icp; }
    else if (sortKey === 'submitted') { av = a.submitted; bv = b.submitted; }
    else { av = a[sortKey]; bv = b[sortKey]; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const icpCls = (n) => n < 40 ? 'red' : n <= 70 ? 'amber' : 'green';

  const counts = {
    all: data.length,
    pending: data.filter(a => a.status === 'pending').length,
    shortlist: data.filter(a => a.status === 'shortlist').length,
    accepted: data.filter(a => a.status === 'accepted').length,
    declined: data.filter(a => a.status === 'declined').length,
  };

  const caret = (k) => sortKey === k ? (sortDir === 'asc' ? '▲' : '▼') : '↕';

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Audit Applications</h1>
          <div className="view-sub">Owner-run B2B services · $6M–$20M · ICP-scored on submission</div>
        </div>
        <div className="view-actions">
          <button className="btn btn-ghost"><Ic.FileText size={13}/> Export CSV</button>
          <button className="btn btn-primary">Open triage queue <Ic.ArrowRight size={13}/></button>
        </div>
      </div>

      <div className="filters">
        {[
          ['all','All'], ['pending','Pending'], ['shortlist','Shortlisted'], ['accepted','Accepted'], ['declined','Declined'],
        ].map(([k, l]) => (
          <button key={k} className={`filter-chip ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>
            {l} <span style={{opacity: 0.6, marginLeft: 4}}>{counts[k]}</span>
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="audit">
          <thead>
            <tr>
              <th>Applicant</th>
              <th className={`sortable ${sortKey === 'submitted' ? 'active-sort' : ''}`} onClick={() => toggleSort('submitted')}>Submitted <span className="sort-caret">{caret('submitted')}</span></th>
              <th className={`sortable ${sortKey === 'icp' ? 'active-sort' : ''}`} onClick={() => toggleSort('icp')} style={{minWidth: 180}}>ICP Score <span className="sort-caret">{caret('icp')}</span></th>
              <th>Status</th>
              <th style={{width: 100}}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(a => (
              <tr key={a.id} onClick={() => onOpen(a)} style={{cursor: 'pointer'}}>
                <td>
                  <div className="cell-name">{a.applicant}</div>
                  <div className="cell-company">{a.company}</div>
                </td>
                <td className="cell-date">{formatDate(a.submitted)}</td>
                <td>
                  <div className="icp">
                    <span className={`icp-val ${icpCls(a.icp)}`}>{a.icp}</span>
                    <div className="icp-bar"><div className={`icp-fill ${icpCls(a.icp)}`} style={{width: a.icp + '%'}}/></div>
                  </div>
                </td>
                <td><AuditBadge status={a.status}/></td>
                <td><button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); onOpen(a); }}>Triage <Ic.ChevronRight size={12}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditDrawer({ item, onClose }) {
  if (!item) return null;
  const icpCls = item.icp < 40 ? 'red' : item.icp <= 70 ? 'amber' : 'green';
  return (
    <React.Fragment>
      <DrawerHead
        kicker="Audit · Application"
        title={item.applicant}
        onClose={onClose}
        right={<div style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 10}}>
          <AuditBadge status={item.status}/>
          <span className="tag">Submitted {formatDate(item.submitted)}</span>
        </div>}
      />
      <div className="drawer-body">
        <div className="drawer-section">
          <h4>ICP fit</h4>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{fontFamily: 'var(--serif)', fontSize: 44, lineHeight: 1, color: icpCls === 'red' ? 'var(--red-ink)' : icpCls === 'amber' ? 'var(--amber-ink)' : 'var(--green-ink)'}}>{item.icp}</div>
            <div style={{flex: 1}}>
              <div className="icp-bar" style={{height: 8}}><div className={`icp-fill ${icpCls}`} style={{width: item.icp + '%'}}/></div>
              <div style={{marginTop: 6, fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase'}}>
                {icpCls === 'red' ? 'Below threshold' : icpCls === 'amber' ? 'Borderline fit' : 'Strong fit'}
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-section">
          <h4>Applicant</h4>
          <KV k="Contact" v={item.contact}/>
          <KV k="Role" v={item.role}/>
          <KV k="Company" v={item.company}/>
          <KV k="Revenue" v={item.revenue}/>
          <KV k="Headcount" v={item.staff + ' staff'}/>
        </div>

        <div className="drawer-section">
          <h4>Why they applied</h4>
          <div style={{fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6}}>{item.why}</div>
        </div>
      </div>
      <div className="drawer-foot">
        <button className="btn">Decline</button>
        <button className="btn">Shortlist</button>
        <button className="btn btn-gold">Accept to discovery <Ic.ArrowRight size={13}/></button>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { AuditView, AuditDrawer });
