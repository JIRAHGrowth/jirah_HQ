'use client'

import { useState } from 'react'
import { Plus, ExternalLink } from 'lucide-react'
import type { AuditApp, Engagement, PipelineItem } from '@/lib/types'
import MarkdownLite from '../../MarkdownLite'
import AppendCommsModal from '../../AppendCommsModal'

type Item = PipelineItem | AuditApp | Engagement

export default function CommsLogSection({
  item,
  commsLog,
}: {
  item: Item
  commsLog?: { filePath: string; content: string } | null
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const defaultBy = 'owner' in item ? item.owner : 'JL'

  const openInExplorer = async () => {
    if (!commsLog?.filePath) return
    await fetch('/api/open-file', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: commsLog.filePath }),
    })
  }

  return (
    <div>
      <div className="section-head-row">
        <h2 className="section-title">Communications log</h2>
        <div className="row">
          {commsLog?.filePath && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={openInExplorer}>
              <ExternalLink size={12} strokeWidth={1.5} /> Open file
            </button>
          )}
          <button type="button" className="btn btn-gold" disabled={!item.filePath} onClick={() => setModalOpen(true)}>
            <Plus size={14} strokeWidth={1.5} /> Log entry
          </button>
        </div>
      </div>

      {!commsLog && (
        <p className="muted" style={{ fontSize: 13 }}>
          No comms log file yet. Adding an entry creates <code className="inline-code">02 - Comms Log.md</code> in the client folder.
        </p>
      )}

      {commsLog && (
        <div className="md-frame">
          <MarkdownLite source={commsLog.content} />
        </div>
      )}

      {item.filePath && (
        <AppendCommsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          commsLogPath={commsLog?.filePath}
          filePath={item.filePath}
          defaultBy={defaultBy}
        />
      )}
    </div>
  )
}
