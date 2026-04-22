'use client'

import type { DetailBundle } from '@/lib/detail'
import { KV, fmtMoney, formatDate, ownerName } from '../../Primitives'

export default function OverviewSection({ bundle }: { bundle: DetailBundle }) {
  const { detail } = bundle
  const item = detail.item

  return (
    <div>
      <h2 className="section-title">Overview</h2>

      <div className="pane-section">
        <h4>Summary</h4>

        {detail.kind === 'prospect' && 'stage' in item && (
          <>
            <KV k="Stage" v={item.stage} />
            <KV k="Industry" v={`${item.industry} · ${item.geo}`} />
            <KV k="Owner" v={ownerName(item.owner)} />
            <KV k="Contact" v={item.contact} />
            <KV k="Source" v={item.source} />
            <KV k="Est. value" v={fmtMoney(item.value)} />
            <KV k="Last contact" v={`${item.lastContactDays} days ago`} />
            <KV k="Next action" v={item.nextAction && item.nextAction !== '—' ? formatDate(item.nextAction) : '—'} />
          </>
        )}

        {detail.kind === 'audit' && 'applicant' in item && (
          <>
            <KV k="Applicant" v={item.applicant} />
            <KV k="Contact" v={`${item.contact}${item.role ? `, ${item.role}` : ''}`} />
            <KV k="Company" v={item.company} />
            <KV k="Submitted" v={formatDate(item.submitted)} />
            <KV k="Status" v={item.status} />
            <KV k="ICP" v={String(item.icp)} />
            <KV k="Revenue" v={item.revenue} />
            <KV k="Staff" v={String(item.staff)} />
            {item.why && (
              <div className="pane-block" style={{ marginTop: 14 }}>
                <div className="pane-label">Why they applied</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>{item.why}</p>
              </div>
            )}
          </>
        )}

        {detail.kind === 'client' && 'currentStep' in item && (
          <>
            <KV k="Sponsor" v={item.sponsor} />
            <KV k="Contract" v={item.contract} />
            <KV k="Industry" v={`${item.industry} · ${item.geo}`} />
            <KV k="Lead" v={ownerName(item.owner)} />
            <KV k="Partner" v={ownerName(item.coOwner)} />
            <KV k="Current step" v={`${item.milestone}`} />
            <KV k="Due" v={item.dueLabel} />
            <KV k="Last contact" v={`${item.lastContactDays} days ago`} />
          </>
        )}
      </div>

      {'notes' in item && typeof item.notes === 'string' && item.notes && (
        <div className="pane-section">
          <h4>Working notes</h4>
          <p style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
            {item.notes}
          </p>
        </div>
      )}

      <div className="pane-section">
        <h4>At a glance</h4>
        <div className="stats-grid">
          <Stat label="Open tasks" value={item.tasks?.filter((t) => t.status !== 'done' && t.status !== 'archived').length ?? 0} />
          <Stat label="Events logged" value={item.events?.length ?? 0} />
          <Stat label="Contacts" value={bundle.contacts.length} />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
