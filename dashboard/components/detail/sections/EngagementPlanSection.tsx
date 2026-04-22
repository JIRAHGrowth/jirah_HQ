'use client'

import { ExternalLink, FileText } from 'lucide-react'
import MarkdownLite from '../../MarkdownLite'

export default function EngagementPlanSection({
  engagementPlan,
}: {
  engagementPlan?: { filePath: string; content: string } | null
}) {
  const openInExplorer = async () => {
    if (!engagementPlan?.filePath) return
    await fetch('/api/open-file', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: engagementPlan.filePath }),
    })
  }

  return (
    <div>
      <div className="section-head-row">
        <h2 className="section-title">Engagement plan</h2>
        {engagementPlan?.filePath && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={openInExplorer}>
            <ExternalLink size={12} strokeWidth={1.5} /> Edit in VSCode
          </button>
        )}
      </div>

      {!engagementPlan ? (
        <div className="empty-state">
          <FileText size={28} strokeWidth={1.25} className="empty-icon" />
          <div className="empty-title">No engagement plan yet</div>
          <p className="empty-body">
            The engagement plan lives at <code className="inline-code">01 - Engagement Plan.md</code> in the client folder
            — usually created at kickoff (Step 3). It codifies scope, timeline, and out-of-scope items.
          </p>
        </div>
      ) : (
        <div className="md-frame">
          <MarkdownLite source={engagementPlan.content} />
        </div>
      )}
    </div>
  )
}
