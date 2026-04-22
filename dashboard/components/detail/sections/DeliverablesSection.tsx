'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, AlertCircle, Clock, ExternalLink } from 'lucide-react'
import type { Deliverable, DeliverableStatus, AuditApp, Engagement, PipelineItem } from '@/lib/types'
import { Avatar, formatDate } from '../../Primitives'
import AddDeliverableModal from '../../AddDeliverableModal'

type Item = PipelineItem | AuditApp | Engagement

const STATUSES: Array<{ key: DeliverableStatus; label: string }> = [
  { key: 'drafted', label: 'Drafted' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'in-review', label: 'In review' },
  { key: 'signed-off', label: 'Signed off' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'blocked', label: 'Blocked' },
]

const STATUS_CLASS: Record<DeliverableStatus, string> = {
  'drafted': 'dstat-drafted',
  'in-progress': 'dstat-in-progress',
  'in-review': 'dstat-in-review',
  'signed-off': 'dstat-signed-off',
  'shipped': 'dstat-shipped',
  'blocked': 'dstat-blocked',
}

const STATUS_LABEL: Record<DeliverableStatus, string> = {
  'drafted': 'Drafted',
  'in-progress': 'In progress',
  'in-review': 'In review',
  'signed-off': 'Signed off',
  'shipped': 'Shipped',
  'blocked': 'Blocked',
}

export default function DeliverablesSection({ item, folderPath }: { item: Item; folderPath?: string }) {
  const [modalOpen, setModalOpen] = useState(false)
  const deliverables = item.deliverables || []
  const active = deliverables.filter((d) => d.status !== 'shipped').length
  const shipped = deliverables.filter((d) => d.status === 'shipped').length
  const defaultOwner = 'owner' in item ? item.owner : 'JL'

  const sorted = [...deliverables].sort((a, b) => {
    const aShipped = a.status === 'shipped' ? 1 : 0
    const bShipped = b.status === 'shipped' ? 1 : 0
    if (aShipped !== bShipped) return aShipped - bShipped
    return a.dueDate.localeCompare(b.dueDate)
  })

  return (
    <div>
      <div className="section-head-row">
        <h2 className="section-title">Deliverables</h2>
        <div className="row">
          <span className="muted" style={{ fontSize: 12 }}>
            {active} active · {shipped} shipped
          </span>
          <button type="button" className="btn btn-gold" disabled={!item.filePath} onClick={() => setModalOpen(true)}>
            <Plus size={14} strokeWidth={1.5} /> Add deliverable
          </button>
        </div>
      </div>

      <p className="muted" style={{ fontSize: 12.5, marginBottom: 18, maxWidth: 560 }}>
        Deliverables are the <strong>promises</strong> from the Discussion Doc / Scope of Work — what we committed to ship.
        Tasks are the <em>work underneath</em>. Every deliverable should trace back to a source commitment.
      </p>

      {sorted.length === 0 ? (
        <p className="muted" style={{ fontSize: 13 }}>No deliverables yet. Add one when the Discussion Document is signed.</p>
      ) : (
        <div className="deliverables-list">
          {sorted.map((d) => (
            <DeliverableRow key={d.id} deliverable={d} filePath={item.filePath} folderPath={folderPath} />
          ))}
        </div>
      )}

      {item.filePath && (
        <AddDeliverableModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          filePath={item.filePath}
          defaultOwner={defaultOwner}
        />
      )}
    </div>
  )
}

function DeliverableRow({ deliverable, filePath, folderPath }: { deliverable: Deliverable; filePath?: string; folderPath?: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useState(deliverable.status)
  const status = optimisticStatus

  const overdue = status !== 'shipped' && deliverable.dueDate &&
    new Date(deliverable.dueDate + 'T00:00:00') < new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00')

  const changeStatus = (next: DeliverableStatus) => {
    if (!filePath || isPending || next === status) return
    setOptimisticStatus(next)
    startTransition(async () => {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'update-deliverable-status',
          filePath,
          deliverableId: deliverable.id,
          nextStatus: next,
        }),
      })
      if (!res.ok) setOptimisticStatus(deliverable.status)
      else router.refresh()
    })
  }

  const openLinkedFile = async () => {
    if (!deliverable.linkedFile || !folderPath) return
    const path = `${folderPath}${folderPath.endsWith('/') || folderPath.endsWith('\\') ? '' : '\\'}${deliverable.linkedFile}`
    await fetch('/api/open-file', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path }),
    })
  }

  return (
    <div className={`deliverable-row ${status === 'shipped' ? 'shipped' : ''}`}>
      <div className="deliverable-main">
        <div className="deliverable-title">{deliverable.title}</div>
        {deliverable.sourceCommitment && (
          <div className="deliverable-source">From: {deliverable.sourceCommitment}</div>
        )}
        <div className="deliverable-meta">
          <select
            className={`deliverable-status ${STATUS_CLASS[status]}`}
            value={status}
            onChange={(e) => changeStatus(e.target.value as DeliverableStatus)}
            disabled={!filePath || isPending}
          >
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          {deliverable.tags.slice(0, 3).map((t) => <span key={t} className="task-tag">{t}</span>)}
          {deliverable.linkedFile && folderPath && (
            <button type="button" className="deliverable-link" onClick={openLinkedFile}>
              <ExternalLink size={11} strokeWidth={1.5} /> {deliverable.linkedFile.split(/[\\/]/).pop()}
            </button>
          )}
        </div>
        {deliverable.notes && <div className="deliverable-notes">{deliverable.notes}</div>}
      </div>
      <div className="deliverable-side">
        <Avatar owner={deliverable.owner} />
        <div className={`task-due ${overdue ? 'overdue' : ''}`}>
          {overdue ? <AlertCircle size={11} strokeWidth={1.8} /> : <Clock size={11} strokeWidth={1.8} />}
          <span>{formatDate(deliverable.dueDate)}</span>
        </div>
        {deliverable.shippedAt && (
          <div className="muted" style={{ fontSize: 10.5 }}>Shipped {formatDate(deliverable.shippedAt)}</div>
        )}
      </div>
    </div>
  )
}

export { STATUS_LABEL as DELIVERABLE_STATUS_LABEL }
