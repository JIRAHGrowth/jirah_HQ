'use client'

import type { Engagement, PipelineItem, AuditApp } from '@/lib/types'
import EventTimeline from '../../EventTimeline'
import EventLogger from '../../EventLogger'

type Item = PipelineItem | AuditApp | Engagement

export default function EventsSection({ item }: { item: Item }) {
  const events = item.events || []
  const defaultBy = 'owner' in item ? item.owner : 'JL'

  return (
    <div>
      <h2 className="section-title">Events</h2>

      <div className="pane-section">
        <h4>Log a new event</h4>
        <EventLogger filePath={item.filePath} defaultBy={defaultBy} />
      </div>

      <div className="pane-section">
        <h4>History ({events.length})</h4>
        <EventTimeline events={events} />
      </div>
    </div>
  )
}
