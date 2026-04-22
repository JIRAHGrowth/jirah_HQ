'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, AlertCircle, Clock } from 'lucide-react'
import type { Task, TaskPriority } from '@/lib/types'
import { Avatar, formatDate } from './Primitives'

const PRIORITY_CLASS: Record<TaskPriority, string> = {
  critical: 'task-pri-critical',
  high: 'task-pri-high',
  medium: 'task-pri-medium',
  low: 'task-pri-low',
}

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export default function TaskList({
  tasks,
  filePath,
}: {
  tasks: Task[]
  filePath?: string
}) {
  if (!tasks || tasks.length === 0) {
    return <p className="muted" style={{ fontSize: 12.5 }}>No tasks yet.</p>
  }
  const sorted = [...tasks].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'done' ? 1 : -1
    return a.dueDate.localeCompare(b.dueDate)
  })

  return (
    <ul className="task-list">
      {sorted.map((t) => (
        <TaskRow key={t.id} task={t} filePath={filePath} />
      ))}
    </ul>
  )
}

function TaskRow({ task, filePath }: { task: Task; filePath?: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useState(task.status)
  const isDone = optimisticStatus === 'done'

  const toggle = () => {
    if (!filePath || isPending) return
    const next = isDone ? 'open' : 'done'
    setOptimisticStatus(next)
    startTransition(async () => {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-task',
          filePath,
          taskId: task.id,
          nextStatus: next,
        }),
      })
      if (!res.ok) {
        setOptimisticStatus(task.status)
      } else {
        router.refresh()
      }
    })
  }

  const overdue =
    !isDone &&
    task.dueDate &&
    new Date(task.dueDate + 'T00:00:00') < new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00')

  return (
    <li className={`task-row ${isDone ? 'done' : ''} ${isPending ? 'pending' : ''}`}>
      <button
        type="button"
        className={`task-check ${isDone ? 'checked' : ''}`}
        onClick={toggle}
        aria-label={isDone ? 'Mark task open' : 'Mark task done'}
        disabled={!filePath}
      >
        {isDone && <Check size={12} strokeWidth={2.5} />}
      </button>
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className={`task-pri ${PRIORITY_CLASS[task.priority]}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>
          {task.cadence !== 'one-off' && (
            <span className="task-tag">{task.cadence}</span>
          )}
          <span className="task-tag">{task.difficulty}</span>
          {task.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="task-tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="task-side">
        <Avatar owner={task.owner} />
        <div className={`task-due ${overdue ? 'overdue' : ''}`}>
          {overdue ? <AlertCircle size={11} strokeWidth={1.8} /> : <Clock size={11} strokeWidth={1.8} />}
          {task.dueDate ? formatDate(task.dueDate) : '—'}
        </div>
      </div>
    </li>
  )
}
