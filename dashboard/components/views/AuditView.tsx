'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { AuditApp, AuditStatus } from '@/lib/types'
import { AuditBadge, formatDate, icpTier } from '../Primitives'

type Filter = 'all' | AuditStatus
type SortKey = 'submitted' | 'icp'
type SortDir = 'asc' | 'desc'

export default function AuditView({ audits }: { audits: AuditApp[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('submitted')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered = audits.filter((a) => filter === 'all' || a.status === filter)
  const sorted = [...filtered].sort((x, y) => {
    const a = sortKey === 'icp' ? x.icp : x.submitted
    const b = sortKey === 'icp' ? y.icp : y.submitted
    if (a === b) return 0
    const cmp = a > b ? 1 : -1
    return sortDir === 'asc' ? cmp : -cmp
  })

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(k)
      setSortDir('desc')
    }
  }

  const pending = audits.filter((a) => a.status === 'pending').length

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Audit Applications</h1>
          <div className="view-sub">
            {audits.length} applications · {pending} awaiting triage
          </div>
        </div>
        <div className="view-actions">
          <button className="btn btn-ghost" type="button">Export CSV</button>
          <button className="btn btn-primary" type="button">Open triage queue</button>
        </div>
      </div>

      <div className="filters">
        {(['all', 'pending', 'shortlist', 'accepted', 'declined'] as const).map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            type="button"
          >
            {f === 'all'
              ? 'All'
              : f === 'shortlist'
                ? 'Shortlisted'
                : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="audit">
          <thead>
            <tr>
              <th>Applicant</th>
              <th
                className={`sortable ${sortKey === 'submitted' ? 'active-sort' : ''}`}
                onClick={() => toggleSort('submitted')}
              >
                Submitted{' '}
                <span className="sort-caret">
                  {sortKey === 'submitted' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                </span>
              </th>
              <th
                className={`sortable ${sortKey === 'icp' ? 'active-sort' : ''}`}
                onClick={() => toggleSort('icp')}
              >
                ICP Score{' '}
                <span className="sort-caret">
                  {sortKey === 'icp' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                </span>
              </th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((a) => (
              <tr
                key={a.id}
                onClick={() => router.push(`/detail/audit/${a.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div className="cell-name">{a.applicant}</div>
                  <div className="cell-company">{a.company}</div>
                </td>
                <td className="cell-date">{formatDate(a.submitted)}</td>
                <td>
                  <div className="icp">
                    <div className="icp-bar">
                      <div
                        className={`icp-fill ${icpTier(a.icp)}`}
                        style={{ width: `${a.icp}%` }}
                      />
                    </div>
                    <div className={`icp-val ${icpTier(a.icp)}`}>{a.icp}</div>
                  </div>
                </td>
                <td>
                  <AuditBadge status={a.status} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link
                    className="btn btn-sm"
                    href={`/detail/audit/${a.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Triage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
