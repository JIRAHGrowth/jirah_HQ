import { Calendar } from 'lucide-react'

export default function BrandBar({ date }: { date: string }) {
  return (
    <div className="brand-bar">
      <div className="brand">
        <div className="brand-mark">J</div>
        <div>
          <div className="brand-name">JIRAH Growth Partners</div>
          <div className="brand-sub">Command Center</div>
        </div>
      </div>
      <div className="brand-right">
        <div className="date-pill">
          <Calendar size={14} strokeWidth={1.5} />
          <span>{formatBrandDate(date)}</span>
        </div>
        <div className="sep" />
        <span>Jason · Joshua</span>
        <div className="row" style={{ gap: 6 }}>
          <span className="avatar jl">JL</span>
          <span className="avatar jm">JM</span>
        </div>
      </div>
    </div>
  )
}

function formatBrandDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}
