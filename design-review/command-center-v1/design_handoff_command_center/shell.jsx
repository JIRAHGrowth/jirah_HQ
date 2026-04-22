// Focus bar, Tabs, Drawer
const { useState: useStateFB, useEffect: useEffectFB } = React;

function FocusBar({ onJump }) {
  const chips = [
    { key: 'overdue', label: 'Overdue Follow-ups', val: 3, alert: true, icon: <Ic.AlertTriangle size={14}/>, tab: 'briefing', hint: '2 since Monday' },
    { key: 'audit', label: 'Audit Apps Pending', val: 5, icon: <Ic.ClipboardList size={14}/>, tab: 'audit', hint: 'Awaiting triage' },
    { key: 'risk', label: 'Engagements at Risk', val: 1, alert: true, icon: <Ic.Flame size={14}/>, tab: 'engagements', hint: 'Cascade Physio' },
    { key: 'content', label: 'Content This Week', val: null, icon: <Ic.FileText size={14}/>, tab: null, hint: 'Thought-piece draft' },
  ];
  return (
    <div className="focus-bar">
      {chips.map(c => (
        <button key={c.key} className={`focus-chip ${c.alert ? 'alert' : ''}`} onClick={() => c.tab && onJump(c.tab)}>
          <div>
            <span className="focus-label">{c.label}</span>
            {c.val !== null
              ? <div className="focus-num">{c.val}</div>
              : <div className="focus-num muted">Not started</div>
            }
            <div className="focus-hint">{c.hint}</div>
          </div>
          <span className="focus-icon">{c.icon}</span>
        </button>
      ))}
    </div>
  );
}

function Tabs({ value, onChange, items }) {
  return (
    <div className="tabs" role="tablist">
      {items.map(it => (
        <button
          key={it.key}
          className="tab"
          role="tab"
          aria-selected={value === it.key}
          onClick={() => onChange(it.key)}
        >
          {it.label}
          {typeof it.count === 'number' && <span className="tab-count">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}

function Drawer({ open, onClose, children }) {
  useEffectFB(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <React.Fragment>
      <div className="drawer-backdrop" onClick={onClose}/>
      <aside className="drawer" role="dialog" aria-modal="true">
        {children}
      </aside>
    </React.Fragment>
  );
}

function DrawerHead({ kicker, title, onClose, right }) {
  return (
    <div className="drawer-head">
      <div style={{flex: 1, minWidth: 0}}>
        <div className="drawer-kicker">{kicker}</div>
        <h2 className="drawer-title">{title}</h2>
        {right}
      </div>
      <button className="drawer-close" onClick={onClose} aria-label="Close"><Ic.X size={18}/></button>
    </div>
  );
}

function KV({ k, v }) { return <div className="kv-row"><div className="k">{k}</div><div className="v">{v}</div></div>; }

Object.assign(window, { FocusBar, Tabs, Drawer, DrawerHead, KV });
