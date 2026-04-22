'use client'

import { ExternalLink, Package } from 'lucide-react'
import type { AuditApp, Engagement, PipelineItem } from '@/lib/types'
import { formatDate } from '../../Primitives'

type Item = PipelineItem | AuditApp | Engagement

export default function ArtifactsSection({ item, folderPath }: { item: Item; folderPath?: string }) {
  const artifacts = item.artifacts || []

  const openArtifact = async (rel: string) => {
    if (!folderPath) return
    const sep = folderPath.includes('/') ? '/' : '\\'
    const path = `${folderPath}${folderPath.endsWith(sep) ? '' : sep}${rel}`
    await fetch('/api/open-file', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path }),
    })
  }

  return (
    <div>
      <h2 className="section-title">Linked artifacts</h2>

      <p className="muted" style={{ fontSize: 12.5, marginBottom: 18, maxWidth: 560 }}>
        Skill-run outputs for this record — Discussion Docs, Action Registers, Pilot Plans, etc. Populated when a
        <code className="inline-code">/jirah-*</code> skill runs. Manual entries also land here.
      </p>

      {artifacts.length === 0 ? (
        <div className="empty-state">
          <Package size={28} strokeWidth={1.25} className="empty-icon" />
          <div className="empty-title">No artifacts linked yet</div>
          <p className="empty-body">
            Artifacts are populated by skill runs. Add them manually in the record&apos;s frontmatter under <code className="inline-code">artifacts:</code>.
          </p>
        </div>
      ) : (
        <div className="artifacts-list">
          {artifacts.map((a) => (
            <div key={a.id} className="artifact-row">
              <div>
                <div className="artifact-head">
                  {a.skill && <span className="artifact-skill">{a.skill}</span>}
                  {a.ranOn && <span className="artifact-date">{formatDate(a.ranOn)}</span>}
                </div>
                <button
                  type="button"
                  className="artifact-path"
                  onClick={() => openArtifact(a.filePath)}
                  disabled={!folderPath}
                  title="Open in default app"
                >
                  <ExternalLink size={11} strokeWidth={1.5} /> {a.filePath}
                </button>
                {a.notes && <div className="artifact-notes">{a.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
