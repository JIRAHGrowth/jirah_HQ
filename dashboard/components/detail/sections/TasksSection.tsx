'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Addable, Engagement, PipelineItem, AuditApp } from '@/lib/types'
import TaskList from '../../TaskList'
import AddTaskModal from '../../AddTaskModal'

type Item = PipelineItem | AuditApp | Engagement

export default function TasksSection({
  item,
  addables,
  lockedClient,
}: {
  item: Item
  addables: Addable[]
  lockedClient: Addable
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const tasks = item.tasks || []
  const open = tasks.filter((t) => t.status !== 'done' && t.status !== 'archived').length
  const done = tasks.filter((t) => t.status === 'done').length

  return (
    <div>
      <div className="section-head-row">
        <h2 className="section-title">Tasks</h2>
        <div className="row">
          <span className="muted" style={{ fontSize: 12 }}>
            {open} open · {done} done
          </span>
          <button type="button" className="btn btn-gold" onClick={() => setModalOpen(true)}>
            <Plus size={14} strokeWidth={1.5} /> Add task
          </button>
        </div>
      </div>

      <div className="pane-section">
        <TaskList tasks={tasks} filePath={item.filePath} />
      </div>

      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        addables={addables}
        lockedClient={lockedClient}
      />
    </div>
  )
}
