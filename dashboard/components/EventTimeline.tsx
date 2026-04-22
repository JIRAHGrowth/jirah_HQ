'use client'

import type { ClientEvent } from '@/lib/types'
import { EVENT_LABELS } from '@/lib/types'
import { formatDate } from './Primitives'

export default function EventTimeline({ events }: { events: ClientEvent[] }) {
  if (!events || events.length === 0) {
    return <p className="muted" style={{ fontSize: 12.5 }}>No events recorded yet.</p>
  }
  return (
    <div className="timeline">
      {events.map((e) => (
        <div key={e.id} className="timeline-item">
          <div className="ti-date">
            {formatDate(e.date)} · {EVENT_LABELS[e.type] || e.type}
          </div>
          <div className="ti-body">
            {e.note || describeEvent(e)}
            <span className="muted" style={{ marginLeft: 6, fontSize: 11 }}>· {e.by}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function describeEvent(e: ClientEvent): string {
  if (e.type === 'stage-changed' && e.fromStage && e.toStage) {
    return `${e.fromStage} → ${e.toStage}`
  }
  return EVENT_LABELS[e.type] || e.type
}
