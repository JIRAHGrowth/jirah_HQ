'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Check, AlertCircle, Clock, Plus, LayoutList, Columns, Table as TableIcon } from 'lucide-react'
import type {
  TaskWithContext,
  Addable,
  TaskPriority,
  TaskStatus,
  Owner,
} from '@/lib/types'
import { Avatar, formatDate, ownerName } from '../Primitives'
import AddTaskModal from '../AddTaskModal'

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

const STATUS_LABEL: Record<TaskStatus, string> = {
  'open': 'To Do',
  'in-progress': 'In Progress',
  'blocked': 'Blocked',
  'done': 'Done',
  'archived': 'Archived',
}

const BOARD_COLUMNS: TaskStatus[] = ['open', 'in-progress', 'blocked', 'done']

type Mode = 'my-week' | 'board' | 'all'

function daysFromToday(iso: string): number {
  if (!iso) return 999
  const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00')
  const d = new Date(iso + 'T00:00:00')
  return Math.round((d.getTime() - today.getTime()) / 86400000)
}

function bucket(iso: string, status: string): 'overdue' | 'today' | 'week' | 'later' | 'done' {
  if (status === 'done' || status === 'archived') return 'done'
  const diff = daysFromToday(iso)
  if (diff < 0) return 'overdue'
  if (diff === 0) return 'today'
  if (diff <= 7) return 'week'
  return 'later'
}

export default function TaskManagerView({
  tasks,
  addables,
}: {
  tasks: TaskWithContext[]
  addables: Addable[]
}) {
  const [mode, setMode] = useState<Mode>('my-week')
  const [modalOpen, setModalOpen] = useState(false)

  const active = tasks.filter((t) => t.status !== 'done' && t.status !== 'archived')
  const overdue = active.filter((t) => bucket(t.dueDate, t.status) === 'overdue').length

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Task Manager</h1>
          <div className="view-sub">
            {active.length} open · {overdue} overdue · across {new Set(tasks.map((t) => t.clientId)).size} clients
          </div>
        </div>
        <div className="view-actions">
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${mode === 'my-week' ? 'active' : ''}`}
              onClick={() => setMode('my-week')}
              title="Grouped by owner + time bucket"
            >
              <LayoutList size={13} strokeWidth={1.5} /> My Week
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'board' ? 'active' : ''}`}
              onClick={() => setMode('board')}
              title="Kanban by status"
            >
              <Columns size={13} strokeWidth={1.5} /> Board
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'all' ? 'active' : ''}`}
              onClick={() => setMode('all')}
              title="All tasks with filters"
            >
              <TableIcon size={13} strokeWidth={1.5} /> All
            </button>
          </div>
          <button className="btn btn-gold" type="button" onClick={() => setModalOpen(true)}>
            <Plus size={14} strokeWidth={1.5} /> Add task
          </button>
        </div>
      </div>

      {mode === 'my-week' && <MyWeekPane tasks={tasks} />}
      {mode === 'board' && <BoardPane tasks={tasks} />}
      {mode === 'all' && <AllPane tasks={tasks} />}

      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        addables={addables}
      />
    </div>
  )
}

/* ---------- My Week Pane ---------- */

function MyWeekPane({ tasks }: { tasks: TaskWithContext[] }) {
  const [ownerFilter, setOwnerFilter] = useState<'all' | Owner>('all')
  const [hideDone, setHideDone] = useState(true)

  const filtered = tasks.filter((t) => {
    if (ownerFilter !== 'all' && t.owner !== ownerFilter) return false
    if (t.status === 'archived') return false
    if (hideDone && t.status === 'done') return false
    return true
  })

  const jl = filtered.filter((t) => t.owner === 'JL')
  const jm = filtered.filter((t) => t.owner === 'JM')

  return (
    <div>
      <div className="filters">
        <button
          type="button"
          className={`filter-chip ${ownerFilter === 'all' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('all')}
        >Both</button>
        <button
          type="button"
          className={`filter-chip ${ownerFilter === 'JL' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('JL')}
        >Jason only</button>
        <button
          type="button"
          className={`filter-chip ${ownerFilter === 'JM' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('JM')}
        >Joshua only</button>
        <button
          type="button"
          className={`filter-chip ${!hideDone ? 'active' : ''}`}
          onClick={() => setHideDone(!hideDone)}
        >{hideDone ? 'Show done' : 'Hide done'}</button>
      </div>

      <div className="week-view">
        {(ownerFilter === 'all' || ownerFilter === 'JL') && jl.length > 0 && (
          <OwnerBlock owner="JL" tasks={jl} />
        )}
        {(ownerFilter === 'all' || ownerFilter === 'JM') && jm.length > 0 && (
          <OwnerBlock owner="JM" tasks={jm} />
        )}
        {filtered.length === 0 && (
          <p className="muted" style={{ fontSize: 13 }}>No tasks match the current filter.</p>
        )}
      </div>
    </div>
  )
}

function OwnerBlock({ owner, tasks }: { owner: Owner; tasks: TaskWithContext[] }) {
  const groups: Record<string, TaskWithContext[]> = {
    overdue: [],
    today: [],
    week: [],
    later: [],
    done: [],
  }
  tasks.forEach((t) => groups[bucket(t.dueDate, t.status)].push(t))
  const groupOrder: Array<{ key: keyof typeof groups; label: string }> = [
    { key: 'overdue', label: 'Overdue' },
    { key: 'today', label: 'Due today' },
    { key: 'week', label: 'This week' },
    { key: 'later', label: 'Later' },
    { key: 'done', label: 'Done' },
  ]
  const active = tasks.filter((t) => t.status !== 'done' && t.status !== 'archived').length

  return (
    <div className="week-owner-block">
      <h3>
        <Avatar owner={owner} size="lg" />
        {ownerName(owner)}
      </h3>
      <div className="week-sub">{active} open task{active === 1 ? '' : 's'}</div>
      {groupOrder.map(({ key, label }) => {
        const items = groups[key]
        if (items.length === 0) return null
        return (
          <div key={key} className="week-group">
            <div className="week-group-label">
              {label}
              <span className="count">{items.length}</span>
            </div>
            {items
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .map((t) => (
                <WeekTaskRow key={`${t.clientId}-${t.id}`} task={t} />
              ))}
          </div>
        )
      })}
    </div>
  )
}

function WeekTaskRow({ task }: { task: TaskWithContext }) {
  const { isDone, isPending, toggle } = useTaskToggle(task)
  const overdue = !isDone && task.dueDate && bucket(task.dueDate, task.status) === 'overdue'

  return (
    <div className={`week-task-row ${isDone ? 'done' : ''}`}>
      <button
        type="button"
        className={`task-check ${isDone ? 'checked' : ''}`}
        onClick={toggle}
        disabled={!task.clientFilePath || isPending}
        aria-label={isDone ? 'Mark task open' : 'Mark task done'}
      >
        {isDone && <Check size={12} strokeWidth={2.5} />}
      </button>
      <div>
        <div className="week-task-client">{task.clientName}</div>
        <div className="task-title" style={{ marginTop: 2 }}>{task.title}</div>
        <div className="task-meta">
          <span className={`task-pri ${PRIORITY_CLASS[task.priority]}`}>{PRIORITY_LABEL[task.priority]}</span>
          {task.status === 'in-progress' && <span className="task-tag status-ip">In Progress</span>}
          {task.status === 'blocked' && <span className="task-tag status-bl">Blocked</span>}
          {task.cadence !== 'one-off' && <span className="task-tag">{task.cadence}</span>}
          <span className="task-tag">{task.difficulty}</span>
          {task.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="task-tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className={`task-due ${overdue ? 'overdue' : ''}`} style={{ alignSelf: 'center' }}>
        {overdue ? <AlertCircle size={12} strokeWidth={1.8} /> : <Clock size={12} strokeWidth={1.8} />}
        {task.dueDate ? formatDate(task.dueDate) : '—'}
      </div>
      <Avatar owner={task.owner} />
    </div>
  )
}

/* ---------- Board Pane ---------- */

function BoardPane({ tasks }: { tasks: TaskWithContext[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dragging, setDragging] = useState<TaskWithContext | null>(null)
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null)
  const [optimistic, setOptimistic] = useState<Record<string, TaskStatus>>({})
  const [ownerFilter, setOwnerFilter] = useState<'all' | Owner>('all')

  const filtered = tasks.filter((t) => {
    if (t.status === 'archived') return false
    if (ownerFilter !== 'all' && t.owner !== ownerFilter) return false
    return true
  })

  const moveStatus = (task: TaskWithContext, toStatus: TaskStatus) => {
    const currentStatus = optimistic[`${task.clientId}-${task.id}`] || task.status
    if (currentStatus === toStatus || !task.clientFilePath || isPending) return
    setOptimistic((m) => ({ ...m, [`${task.clientId}-${task.id}`]: toStatus }))
    startTransition(async () => {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-task',
          filePath: task.clientFilePath,
          taskId: task.id,
          nextStatus: toStatus,
        }),
      })
      if (!res.ok) {
        setOptimistic((m) => {
          const next = { ...m }
          delete next[`${task.clientId}-${task.id}`]
          return next
        })
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div>
      <div className="filters">
        <button
          type="button"
          className={`filter-chip ${ownerFilter === 'all' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('all')}
        >Both</button>
        <button
          type="button"
          className={`filter-chip ${ownerFilter === 'JL' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('JL')}
        >Jason only</button>
        <button
          type="button"
          className={`filter-chip ${ownerFilter === 'JM' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('JM')}
        >Joshua only</button>
      </div>

      <div className="board">
        {BOARD_COLUMNS.map((status) => {
          const items = filtered.filter((t) => (optimistic[`${t.clientId}-${t.id}`] || t.status) === status)
          const isDropTarget = dropTarget === status && dragging
          return (
            <div
              key={status}
              className={`board-col ${isDropTarget ? 'drop-target' : ''}`}
              onDragOver={(e) => {
                if (!dragging) return
                e.preventDefault()
                setDropTarget(status)
              }}
              onDragLeave={(e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return
                if (dropTarget === status) setDropTarget(null)
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (dragging) moveStatus(dragging, status)
                setDragging(null)
                setDropTarget(null)
              }}
            >
              <div className="board-col-head">
                <div className={`column-title board-status-${status}`}>
                  <span className="dot" />
                  {STATUS_LABEL[status]}
                </div>
                <div className="column-count">{items.length}</div>
              </div>
              {items.map((t) => (
                <BoardCard
                  key={`${t.clientId}-${t.id}`}
                  task={t}
                  isDragging={dragging?.id === t.id && dragging.clientId === t.clientId}
                  onDragStart={() => setDragging(t)}
                  onDragEnd={() => { setDragging(null); setDropTarget(null) }}
                />
              ))}
              {items.length === 0 && (
                <div className="board-empty">—</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BoardCard({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  task: TaskWithContext
  isDragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
}) {
  const overdue = task.status !== 'done' && bucket(task.dueDate, task.status) === 'overdue'
  return (
    <div
      className={`board-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart()
      }}
      onDragEnd={onDragEnd}
    >
      <div className="board-card-client">{task.clientName}</div>
      <div className="board-card-title">{task.title}</div>
      <div className="board-card-meta">
        <span className={`task-pri ${PRIORITY_CLASS[task.priority]}`}>{PRIORITY_LABEL[task.priority]}</span>
        <span className="task-tag">{task.difficulty}</span>
        {task.cadence !== 'one-off' && <span className="task-tag">{task.cadence}</span>}
      </div>
      <div className="board-card-foot">
        <Avatar owner={task.owner} />
        <span className={`task-due ${overdue ? 'overdue' : ''}`}>
          {overdue ? <AlertCircle size={11} strokeWidth={1.8} /> : <Clock size={11} strokeWidth={1.8} />}
          {task.dueDate ? formatDate(task.dueDate) : '—'}
        </span>
      </div>
    </div>
  )
}

/* ---------- All Pane ---------- */

function AllPane({ tasks }: { tasks: TaskWithContext[] }) {
  const [ownerFilter, setOwnerFilter] = useState<'all' | Owner>('all')
  const [statusFilter, setStatusFilter] = useState<'active' | 'all' | TaskStatus>('active')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks.filter((t) => {
      if (statusFilter === 'active') {
        if (t.status === 'done' || t.status === 'archived') return false
      } else if (statusFilter !== 'all') {
        if (t.status !== statusFilter) return false
      }
      if (ownerFilter !== 'all' && t.owner !== ownerFilter) return false
      if (q && !t.title.toLowerCase().includes(q) && !t.clientName.toLowerCase().includes(q)) return false
      return true
    }).sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1
      if (b.status === 'done' && a.status !== 'done') return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
  }, [tasks, ownerFilter, statusFilter, search])

  return (
    <div>
      <div className="filters">
        <input
          type="search"
          placeholder="Search tasks or clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="all-search"
        />
        <button
          type="button"
          className={`filter-chip ${ownerFilter === 'all' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('all')}
        >Both</button>
        <button
          type="button"
          className={`filter-chip ${ownerFilter === 'JL' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('JL')}
        >JL</button>
        <button
          type="button"
          className={`filter-chip ${ownerFilter === 'JM' ? 'active' : ''}`}
          onClick={() => setOwnerFilter('JM')}
        >JM</button>
        <span className="sep" />
        <button
          type="button"
          className={`filter-chip ${statusFilter === 'active' ? 'active' : ''}`}
          onClick={() => setStatusFilter('active')}
        >Active</button>
        <button
          type="button"
          className={`filter-chip ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >All</button>
        <button
          type="button"
          className={`filter-chip ${statusFilter === 'done' ? 'active' : ''}`}
          onClick={() => setStatusFilter('done')}
        >Done</button>
        <button
          type="button"
          className={`filter-chip ${statusFilter === 'blocked' ? 'active' : ''}`}
          onClick={() => setStatusFilter('blocked')}
        >Blocked</button>
      </div>

      <table className="all-table">
        <thead>
          <tr>
            <th></th>
            <th>Client</th>
            <th>Task</th>
            <th>Owner</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => <AllRow key={`${t.clientId}-${t.id}`} task={t} />)}
          {filtered.length === 0 && (
            <tr><td colSpan={7} className="muted" style={{ textAlign: 'center', padding: 20 }}>No tasks match.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function AllRow({ task }: { task: TaskWithContext }) {
  const { isDone, isPending, toggle } = useTaskToggle(task)
  const overdue = !isDone && task.dueDate && bucket(task.dueDate, task.status) === 'overdue'
  return (
    <tr className={`${isDone ? 'done' : ''}`}>
      <td>
        <button
          type="button"
          className={`task-check ${isDone ? 'checked' : ''}`}
          onClick={toggle}
          disabled={!task.clientFilePath || isPending}
          aria-label={isDone ? 'Mark task open' : 'Mark task done'}
        >
          {isDone && <Check size={12} strokeWidth={2.5} />}
        </button>
      </td>
      <td className="muted" style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{task.clientName}</td>
      <td>{task.title}</td>
      <td><Avatar owner={task.owner} /></td>
      <td><span className={`task-pri ${PRIORITY_CLASS[task.priority]}`}>{PRIORITY_LABEL[task.priority]}</span></td>
      <td><span className={`task-tag status-${task.status}`}>{STATUS_LABEL[task.status]}</span></td>
      <td className={overdue ? 'task-due overdue' : 'task-due'}>
        {task.dueDate ? formatDate(task.dueDate) : '—'}
      </td>
    </tr>
  )
}

/* ---------- Shared task-toggle hook ---------- */

function useTaskToggle(task: TaskWithContext) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useState<TaskStatus>(task.status)
  const isDone = optimisticStatus === 'done'

  const toggle = () => {
    if (!task.clientFilePath || isPending) return
    const next: TaskStatus = isDone ? 'open' : 'done'
    setOptimisticStatus(next)
    startTransition(async () => {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-task',
          filePath: task.clientFilePath,
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

  return { isDone, isPending, toggle }
}
