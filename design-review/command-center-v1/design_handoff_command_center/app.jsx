// Root app
function App() {
  const data = window.JIRAH_DATA;
  const [tab, setTab] = React.useState(() => localStorage.getItem('jirah_tab') || 'pipeline');
  const [drawer, setDrawer] = React.useState(null); // {kind, item}

  React.useEffect(() => { localStorage.setItem('jirah_tab', tab); }, [tab]);

  const openPipeline = (item) => setDrawer({ kind: 'pipeline', item });
  const openAudit = (item) => setDrawer({ kind: 'audit', item });
  const openEngagement = (item) => setDrawer({ kind: 'engagement', item });
  const closeDrawer = () => setDrawer(null);

  const jump = (t) => { if (t === 'briefing') return; setTab(t); };

  const tabItems = [
    { key: 'pipeline',    label: 'Pipeline',           count: data.pipeline.length },
    { key: 'audit',       label: 'Audit Applications', count: data.audits.length },
    { key: 'engagements', label: 'Active Engagements', count: data.engagements.length },
  ];

  const now = new Date('2026-04-18T09:12:00');
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="app" data-screen-label="01 Command Center">
      <header className="app-header">
        <div className="brand-bar">
          <div className="brand">
            <span className="brand-mark">J</span>
            <div>
              <div className="brand-name">JIRAH Growth Partners</div>
              <div className="brand-sub">Command Center</div>
            </div>
          </div>
          <div className="brand-right">
            <div className="date-pill"><Ic.Calendar size={12}/> {dateStr}</div>
            <div className="sep"/>
            <span>Jason <span style={{color:'var(--muted)'}}>·</span> Joshua</span>
            <Avatar owner="JL"/>
            <Avatar owner="JM"/>
          </div>
        </div>
        <FocusBar onJump={jump}/>
        <Tabs value={tab} onChange={setTab} items={tabItems}/>
      </header>

      <main className="app-main">
        {tab === 'pipeline'    && <PipelineView data={data.pipeline} onOpen={openPipeline}/>}
        {tab === 'audit'       && <AuditView data={data.audits} onOpen={openAudit}/>}
        {tab === 'engagements' && <EngagementsView data={data.engagements} onOpen={openEngagement}/>}
      </main>

      <aside className="app-briefing">
        <BriefingPanel briefing={data.briefing}/>
      </aside>

      <Drawer open={!!drawer} onClose={closeDrawer}>
        {drawer?.kind === 'pipeline'   && <PipelineDrawer   item={drawer.item} onClose={closeDrawer}/>}
        {drawer?.kind === 'audit'      && <AuditDrawer      item={drawer.item} onClose={closeDrawer}/>}
        {drawer?.kind === 'engagement' && <EngagementDrawer item={drawer.item} onClose={closeDrawer}/>}
      </Drawer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
