'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import type { DeliverableStatus, Owner } from '@/lib/types'

export default function AddDeliverableModal({
  open,
  onClose,
  filePath,
  defaultOwner,
}: {
  open: boolean
  onClose: () => void
  filePath: string
  defaultOwner?: Owner
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<DeliverableStatus>('drafted')
  const [owner, setOwner] = useState<Owner>(defaultOwner || 'JL')
  const [dueDate, setDueDate] = useState(addDays(14))
  const [linkedFile, setLinkedFile] = useState('')
  const [sourceCommitment, setSourceCommitment] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 30)
    } else {
      setTitle(''); setLinkedFile(''); setSourceCommitment(''); setTagsInput(''); setNotes('')
      setStatus('drafted'); setError(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null

  const submit = () => {
    setError(null)
    if (!title.trim()) return setError('Title required.')
    if (!dueDate) return setError('Due date required.')
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    startTransition(async () => {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'add-deliverable',
          filePath,
          deliverable: {
            title: title.trim(),
            status,
            owner,
            dueDate,
            linkedFile: linkedFile.trim() || undefined,
            sourceCommitment: sourceCommitment.trim() || undefined,
            tags,
            notes: notes.trim() || undefined,
          },
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to add deliverable.')
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
          <h3>Add deliverable</h3>
          <button type="button" className="modal-close" onClick={onClose}><X size={16} strokeWidth={1.5} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <label>Title</label>
            <input ref={titleRef} type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Alberta Expansion KPI dashboard" />
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Owner</label>
              <div className="evlog-by">
                <button type="button" className={`evlog-by-btn ${owner === 'JL' ? 'active' : ''}`} onClick={() => setOwner('JL')}>JL</button>
                <button type="button" className={`evlog-by-btn ${owner === 'JM' ? 'active' : ''}`} onClick={() => setOwner('JM')}>JM</button>
              </div>
            </div>
            <div className="modal-field">
              <label>Due date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="modal-field">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as DeliverableStatus)}>
                <option value="drafted">Drafted</option>
                <option value="in-progress">In progress</option>
                <option value="in-review">In review</option>
                <option value="signed-off">Signed off</option>
                <option value="shipped">Shipped</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
          <div className="modal-field">
            <label>Source commitment <span className="muted" style={{ fontWeight: 400 }}>(where was this promised?)</span></label>
            <input type="text" value={sourceCommitment} onChange={(e) => setSourceCommitment(e.target.value)}
              placeholder="e.g. Discussion Document V2 §3" />
          </div>
          <div className="modal-field">
            <label>Linked file <span className="muted" style={{ fontWeight: 400 }}>(relative path inside client folder)</span></label>
            <input type="text" value={linkedFile} onChange={(e) => setLinkedFile(e.target.value)}
              placeholder="e.g. 08 - Monthly Retainer/kpi-dashboard.md" />
          </div>
          <div className="modal-field">
            <label>Tags <span className="muted" style={{ fontWeight: 400 }}>(comma-separated)</span></label>
            <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="retainer, kpi" />
          </div>
          <div className="modal-field">
            <label>Notes <span className="muted" style={{ fontWeight: 400 }}>(optional)</span></label>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error && <div className="modal-error">{error}</div>}
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isPending}>Cancel</button>
          <button type="button" className="btn btn-gold" onClick={submit} disabled={isPending}>
            {isPending ? 'Adding…' : 'Add deliverable'}
          </button>
        </div>
      </div>
    </div>
  )
}

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
