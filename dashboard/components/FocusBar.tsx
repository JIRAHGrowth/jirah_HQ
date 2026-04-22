'use client'

import { AlertTriangle, ClipboardList, Flame, FileText } from 'lucide-react'

interface FocusCounts {
  overdue: number
  auditPending: number
  engRisk: number
  engRiskName: string
}

export default function FocusBar({
  counts,
  onJump,
}: {
  counts: FocusCounts
  onJump: (key: string) => void
}) {
  const chips: Array<{
    key: string
    label: string
    val: number | null
    alert?: boolean
    icon: React.ReactNode
    tab: string | null
    hint: string
  }> = [
    {
      key: 'overdue',
      label: 'Overdue Follow-ups',
      val: counts.overdue,
      alert: true,
      icon: <AlertTriangle size={14} strokeWidth={1.5} />,
      tab: 'pipeline',
      hint: counts.overdue > 0 ? `${counts.overdue} need action` : 'All clear',
    },
    {
      key: 'audit',
      label: 'Audit Apps Pending',
      val: counts.auditPending,
      icon: <ClipboardList size={14} strokeWidth={1.5} />,
      tab: 'audit',
      hint: 'Awaiting triage',
    },
    {
      key: 'risk',
      label: 'Engagements at Risk',
      val: counts.engRisk,
      alert: true,
      icon: <Flame size={14} strokeWidth={1.5} />,
      tab: 'engagements',
      hint: counts.engRiskName || 'All on track',
    },
    {
      key: 'content',
      label: 'Content This Week',
      val: null,
      icon: <FileText size={14} strokeWidth={1.5} />,
      tab: null,
      hint: 'Thought-piece draft',
    },
  ]

  return (
    <div className="focus-bar">
      {chips.map((c) => (
        <button
          key={c.key}
          className={`focus-chip ${c.alert ? 'alert' : ''}`}
          onClick={() => c.tab && onJump(c.tab)}
          type="button"
        >
          <div>
            <span className="focus-label">{c.label}</span>
            {c.val !== null ? (
              <div className="focus-num">{c.val}</div>
            ) : (
              <div className="focus-num muted">Not started</div>
            )}
            <div className="focus-hint">{c.hint}</div>
          </div>
          <span className="focus-icon">{c.icon}</span>
        </button>
      ))}
    </div>
  )
}
