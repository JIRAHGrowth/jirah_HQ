'use client'

import { useState, useTransition, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { X, Search } from 'lucide-react'
import type {
  Addable,
  Owner,
  TaskCadence,
  TaskDifficulty,
  TaskPriority,
} from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
  addables: Addable[]
  /** Optional preselected client — hides the picker. */
  lockedClient?: Addable
  /** Seed default values — e.g. dueDate for "Schedule follow-up" flow. */
  defaults?: Partial<{
    owner: Owner
    title: string
    dueDate: string
    priority: TaskPriority
    tags: string[]
    cadence: TaskCadence
    difficulty: TaskDifficulty
  }>
}

export default function AddTaskModal({ open, onClose, addables, lockedClient, defaults }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [client, setClient] = useState<Addable | null>(lockedClient || null)
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState(defaults?.title || '')
  const [owner, setOwner] = useState<Owner>(defaults?.owner || 'JL')
  const [dueDate, setDueDate] = useState(defaults?.dueDate || todayIso())
  const [priority, setPriority] = useState<TaskPriority>(defaults?.priority || 'medium')
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(defaults?.difficulty || 'S')
  const [cadence, setCadence] = useState<TaskCadence>(defaults?.cadence || 'one-off')
  const [tagsInput, setTagsInput] = useState((defaults?.tags || []).join(', '))
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 30)
    } else {
      setQuery('')
      setError(null)
      if (!lockedClient) setClient(null)
    }
  }, [open, lockedClient])

  useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [open, onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return addables.slice(0, 8)
    return addables
      .filter((a) => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
      .slice(0, 8)
  }, [addables, query])

  if (!open) return null

  const submit = () => {
    setError(null)
    if (!client) return setError('Pick a client first.')
    if (!title.trim()) return setError('Title required.')
    if (!dueDate) return setError('Due date required.')
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    startTransition(async () => {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'add-task',
          filePath: client.filePath,
          task: { title: title.trim(), owner, dueDate, priority, difficulty, cadence, tags, status: 'open', notes: notes.trim() || undefined },
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to add task.')
        return
      }
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Add task</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="modal-body">
          {!lockedClient && (
            <div className="modal-field">
              <label>Client</label>
              {client ? (
                <div className="modal-client-pill">
                  <span>{client.name}</span>
                  <span className="muted" style={{ fontSize: 11, marginLeft: 6 }}>· {client.kind}</span>
                  <button type="button" onClick={() => setClient(null)} className="modal-client-clear">
                    <X size={12} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <div className="modal-search">
                  <Search size={12} strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Search prospects, audits, active clients…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              )}
              {!client && filtered.length > 0 && (
                <div className="modal-suggestions">
                  {filtered.map((a) => (
                    <button
                      type="button"
                      key={`${a.kind}-${a.id}`}
                      className="modal-suggestion"
                      onClick={() => { setClient(a); setQuery('') }}
                    >
                      <span>{a.name}</span>
                      <span className="muted" style={{ fontSize: 10.5 }}>{a.kind}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="modal-field">
            <label>Task title</label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to happen?"
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Owner</label>
              <div className="evlog-by">
                <button
                  type="button"
                  className={`evlog-by-btn ${owner === 'JL' ? 'active' : ''}`}
                  onClick={() => setOwner('JL')}
                >JL</button>
                <button
                  type="button"
                  className={`evlog-by-btn ${owner === 'JM' ? 'active' : ''}`}
                  onClick={() => setOwner('JM')}
                >JM</button>
              </div>
            </div>
            <div className="modal-field">
              <label>Due date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="modal-field">
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
              </select>
            </div>
            <div className="modal-field">
              <label>Cadence</label>
              <select value={cadence} onChange={(e) => setCadence(e.target.value as TaskCadence)}>
                <option value="one-off">One-off</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>

          <div className="modal-field">
            <label>Tags <span className="muted" style={{ fontWeight: 400 }}>(comma-separated)</span></label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="outreach, follow-up, sprint"
            />
          </div>

          <div className="modal-field">
            <label>Notes <span className="muted" style={{ fontWeight: 400 }}>(optional)</span></label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Extra context if needed"
            />
          </div>

          {error && <div className="modal-error">{error}</div>}
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button type="button" className="btn btn-gold" onClick={submit} disabled={isPending}>
            {isPending ? 'Adding…' : 'Add task'}
          </button>
        </div>
      </div>
    </div>
  )
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}
