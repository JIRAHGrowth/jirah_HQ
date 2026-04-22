'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Filter, Clock, MapPin } from 'lucide-react'
import type { PipelineItem, Stage } from '@/lib/types'
import { Avatar, fmtMoney, formatDate } from '../Primitives'

const STAGES: Array<{ key: Stage; label: string; dotCls: string }> = [
  { key: 'cold', label: 'Cold', dotCls: 'dot-slate' },
  { key: 'warm', label: 'Warm', dotCls: 'dot-amber' },
  { key: 'booked', label: 'Meeting Booked', dotCls: 'dot-blue' },
  { key: 'proposal', label: 'Proposal Sent', dotCls: 'dot-indigo' },
  { key: 'won', label: 'Closed Won', dotCls: 'dot-green' },
  { key: 'lost', label: 'Closed Lost', dotCls: 'dot-gray' },
]

const CONVERSION: Record<Stage, number> = {
  cold: 0.05,
  warm: 0.15,
  booked: 0.30,
  proposal: 0.55,
  won: 1.00,
  lost: 0.00,
}

export default function PipelineView({ pipeline }: { pipeline: PipelineItem[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dragging, setDragging] = useState<PipelineItem | null>(null)
  const [dropTarget, setDropTarget] = useState<Stage | null>(null)
  const [optimistic, setOptimistic] = useState<Record<string, Stage>>({})
  const justDraggedRef = useRef(false)

  const weighted = pipeline.reduce((sum, p) => {
    const stage = optimistic[p.id] || p.stage
    return sum + p.value * CONVERSION[stage]
  }, 0)

  const moveStage = (item: PipelineItem, toStage: Stage) => {
    if (item.stage === toStage || !item.filePath || isPending) return
    setOptimistic((m) => ({ ...m, [item.id]: toStage }))
    startTransition(async () => {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'patch-stage',
          filePath: item.filePath,
          toStage,
          by: item.owner,
        }),
      })
      if (!res.ok) {
        setOptimistic((m) => {
          const next = { ...m }
          delete next[item.id]
          return next
        })
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Pipeline</h1>
          <div className="view-sub">
            {pipeline.length} opportunities · ${(weighted / 1000).toFixed(0)}k weighted across stages · drag cards between columns to advance
          </div>
        </div>
        <div className="view-actions">
          <button className="btn" type="button">
            <Filter size={14} strokeWidth={1.5} /> Filter
          </button>
          <button className="btn btn-primary" type="button">
            <Plus size={14} strokeWidth={1.5} /> Add opportunity
          </button>
        </div>
      </div>

      <div className="kanban">
        {STAGES.map(({ key, label, dotCls }) => {
          const items = pipeline.filter((p) => (optimistic[p.id] || p.stage) === key)
          const totalValue = items.reduce((s, i) => s + i.value, 0)
          const isDropTarget = dropTarget === key && dragging && (optimistic[dragging.id] || dragging.stage) !== key
          return (
            <div
              key={key}
              className={`column ${isDropTarget ? 'drop-target' : ''}`}
              onDragOver={(e) => {
                if (!dragging) return
                e.preventDefault()
                setDropTarget(key)
              }}
              onDragLeave={(e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return
                if (dropTarget === key) setDropTarget(null)
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (dragging) moveStage(dragging, key)
                setDragging(null)
                setDropTarget(null)
              }}
            >
              <div className="column-head">
                <div className={`column-title ${dotCls}`}>
                  <span className="dot" />
                  {label}
                </div>
                <div className="column-count">{items.length}</div>
              </div>
              <div className="column-sum">
                ${(totalValue / 1000).toFixed(0)}k potential
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`kcard ${dragging?.id === item.id ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(e) => {
                    setDragging(item)
                    justDraggedRef.current = true
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                  onDragEnd={() => {
                    setDragging(null)
                    setDropTarget(null)
                    // Small delay so the click handler can see it was a drag
                    setTimeout(() => { justDraggedRef.current = false }, 50)
                  }}
                  onClick={() => {
                    if (justDraggedRef.current) return
                    router.push(`/detail/prospect/${item.id}`)
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="kcard-top">
                    <div className="kcard-name">{item.name}</div>
                    <Avatar owner={item.owner} />
                  </div>
                  <div className="kcard-meta">
                    <span className="tag">{item.industry}</span>
                    <span className="tag geo">
                      <MapPin size={10} strokeWidth={1.5} /> {item.geo}
                    </span>
                  </div>
                  <div className="kcard-foot">
                    <span className="row" style={{ gap: 4 }}>
                      <Clock size={12} strokeWidth={1.5} /> Last contact {item.lastContactDays}d ago
                    </span>
                    {item.nextAction && item.nextAction !== '—' ? (
                      <span className="next">Next · {formatDate(item.nextAction)}</span>
                    ) : (
                      <span className="kcard-value">{fmtMoney(item.value)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
