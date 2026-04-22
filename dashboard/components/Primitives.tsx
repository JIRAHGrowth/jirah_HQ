import type { Owner, Stage, AuditStatus } from '@/lib/types'

export function Avatar({ owner, size }: { owner: Owner; size?: 'lg' }) {
  const cls = `avatar ${owner.toLowerCase()}${size === 'lg' ? ' lg' : ''}`
  return (
    <span
      className={cls}
      title={owner === 'JL' ? 'Jason Lotoski' : 'Joshua Marshall'}
    >
      {owner}
    </span>
  )
}

const STAGE_LABEL: Record<Stage, string> = {
  cold: 'Cold',
  warm: 'Warm',
  booked: 'Meeting Booked',
  proposal: 'Proposal Sent',
  won: 'Closed Won',
  lost: 'Closed Lost',
}

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className={`badge ${stage}`}>
      <span className="bdot" />
      {STAGE_LABEL[stage]}
    </span>
  )
}

const AUDIT_LABEL: Record<AuditStatus, string> = {
  pending: 'Pending',
  shortlist: 'Shortlisted',
  accepted: 'Accepted',
  declined: 'Declined',
}

export function AuditBadge({ status }: { status: AuditStatus }) {
  return (
    <span className={`badge ${status}`}>
      <span className="bdot" />
      {AUDIT_LABEL[status]}
    </span>
  )
}

export function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="kv-row">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  )
}

export function ownerName(owner: Owner): string {
  return owner === 'JL' ? 'Jason Lotoski' : 'Joshua Marshall'
}

export function formatDate(iso: string): string {
  if (!iso || iso === '—') return '—'
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function fmtMoney(n: number): string {
  return '$' + (n / 1000).toFixed(0) + 'k'
}

export function icpTier(n: number): 'red' | 'amber' | 'green' {
  if (n < 40) return 'red'
  if (n <= 70) return 'amber'
  return 'green'
}
