'use client'

import { useEffect, useState } from 'react'
import type { DashboardData, TaskWithContext, Addable } from '@/lib/types'
import BrandBar from './BrandBar'
import FocusBar from './FocusBar'
import Tabs from './Tabs'
import PipelineView from './views/PipelineView'
import AuditView from './views/AuditView'
import EngagementsView from './views/EngagementsView'
import TaskManagerView from './views/TaskManagerView'
import BriefingPanel from './BriefingPanel'

type Tab = 'tasks' | 'pipeline' | 'audit' | 'engagements'

export default function CommandCenter({
  data,
  tasks,
  addables,
}: {
  data: DashboardData
  tasks: TaskWithContext[]
  addables: Addable[]
}) {
  const [tab, setTab] = useState<Tab>('tasks')

  useEffect(() => {
    const saved = localStorage.getItem('jirah_tab') as Tab | null
    if (saved === 'tasks' || saved === 'pipeline' || saved === 'audit' || saved === 'engagements') {
      setTab(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('jirah_tab', tab)
  }, [tab])

  const handleJump = (target: string) => {
    if (target === 'audit' || target === 'engagements' || target === 'pipeline' || target === 'tasks') {
      setTab(target as Tab)
    }
  }

  const openTasks = tasks.filter((t) => t.status !== 'done' && t.status !== 'archived').length

  const tabItems = [
    { key: 'tasks', label: 'Task Manager', count: openTasks },
    { key: 'pipeline', label: 'Pipeline', count: data.pipeline.length },
    { key: 'audit', label: 'Audit Applications', count: data.audits.length },
    { key: 'engagements', label: 'Active Engagements', count: data.engagements.length },
  ]

  const counts = {
    overdue: data.pipeline.filter((p) => p.lastContactDays > 7 && p.stage !== 'won' && p.stage !== 'lost').length,
    auditPending: data.audits.filter((a) => a.status === 'pending').length,
    engRisk: data.engagements.filter((e) => e.warn === true).length,
    engRiskName: data.engagements.find((e) => e.warn)?.name || '',
  }

  return (
    <div className="app">
      <div className="app-header">
        <BrandBar date={data.briefing.date} />
        <FocusBar counts={counts} onJump={handleJump} />
        <Tabs value={tab} onChange={(k) => setTab(k as Tab)} items={tabItems} />
      </div>
      <main className="app-main">
        {tab === 'tasks' && <TaskManagerView tasks={tasks} addables={addables} />}
        {tab === 'pipeline' && <PipelineView pipeline={data.pipeline} />}
        {tab === 'audit' && <AuditView audits={data.audits} />}
        {tab === 'engagements' && <EngagementsView engagements={data.engagements} />}
      </main>
      <aside className="app-briefing">
        <BriefingPanel briefing={data.briefing} />
      </aside>
    </div>
  )
}
