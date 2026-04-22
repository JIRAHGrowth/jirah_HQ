import { Check } from 'lucide-react'

const STEPS = ['Discovery', 'Disc. Doc', 'Kickoff', 'Sprint', 'Report', 'KPIs']

export default function Stepper({ current }: { current: number }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => {
        const cls = i < current ? 'done' : i === current ? 'current' : ''
        return (
          <div key={label} className={`step ${cls}`}>
            <div className="circle">
              {i < current ? (
                <Check size={10} strokeWidth={2.5} />
              ) : (
                i + 1
              )}
            </div>
            <div className="lbl">{label}</div>
          </div>
        )
      })}
    </div>
  )
}
