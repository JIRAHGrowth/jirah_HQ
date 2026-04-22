import { ChevronRight } from 'lucide-react'
import type { Briefing, BriefingItem } from '@/lib/types'

export default function BriefingPanel({ briefing }: { briefing: Briefing }) {
  return (
    <div>
      <div className="briefing-head">
        <div>
          <div className="briefing-kicker">Today&apos;s Briefing</div>
          <div className="briefing-date">{formatBriefingDate(briefing.date)}</div>
          <div className="briefing-meta">
            Partner sync · 8:30 AM PT · Prepared by Claude
          </div>
        </div>
      </div>

      <BriefingSection title="Overdue" pillCls="red" items={briefing.overdue} />
      <BriefingSection title="Sprint Risks" pillCls="amber" items={briefing.sprint} />
      <BriefingSection title="Warm Prospects" pillCls="gold" items={briefing.warm} />

      <div className="briefing-foot">
        Briefing regenerates at 6am daily from pipeline, engagements and inbox signal.
      </div>
    </div>
  )
}

function BriefingSection({
  title,
  pillCls,
  items,
}: {
  title: string
  pillCls: string
  items: BriefingItem[]
}) {
  return (
    <div className="briefing-section">
      <h5>
        {title}
        <span className={`pill ${pillCls}`}>{items.length}</span>
      </h5>
      {items.length === 0 && (
        <div className="muted" style={{ fontSize: 12 }}>
          None today.
        </div>
      )}
      {items.map((it) => (
        <div key={it.id} className="bitem">
          <div className="bitem-top">
            <div className="bitem-name">{it.name}</div>
            <div className="bitem-when">{it.when}</div>
          </div>
          <div className="bitem-body">{it.body}</div>
          <a className="bitem-cta" href="#">
            {it.cta} <ChevronRight size={12} strokeWidth={1.5} />
          </a>
        </div>
      ))}
    </div>
  )
}

function formatBriefingDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}
