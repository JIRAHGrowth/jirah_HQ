'use client'

import Link from 'next/link'
import { Clock, AlertTriangle, Target } from 'lucide-react'
import type { Engagement } from '@/lib/types'
import { Avatar } from '../Primitives'
import Stepper from '../Stepper'

export default function EngagementsView({ engagements }: { engagements: Engagement[] }) {
  const atRisk = engagements.filter((e) => e.warn).length

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Active Engagements</h1>
          <div className="view-sub">
            {engagements.length} live · {atRisk} at risk
          </div>
        </div>
      </div>
      <div className="engagements">
        {engagements.map((e) => (
          <Link
            key={e.id}
            href={`/detail/client/${e.id}`}
            className="ecard ecard-link"
          >
            <div className="ecard-head">
              <div>
                <div className="ecard-name">{e.name}</div>
                <div className="ecard-indust">
                  {e.industry} · {e.geo}
                </div>
              </div>
              <div className="row" style={{ gap: 4 }}>
                <Avatar owner={e.owner} />
                <Avatar owner={e.coOwner} />
              </div>
            </div>

            <Stepper current={e.currentStep} />

            <div className="ecard-milestone">
              <Target size={16} strokeWidth={1.5} className="mi" />
              <div>
                <div className="mt-lbl">Current milestone</div>
                <div className="mt-val">{e.milestone}</div>
                <div className="mt-due">{e.dueLabel}</div>
              </div>
            </div>

            <div className="ecard-foot">
              <span className={`lc ${e.warn ? 'warn' : ''}`}>
                {e.warn ? (
                  <AlertTriangle size={12} strokeWidth={1.5} />
                ) : (
                  <Clock size={12} strokeWidth={1.5} />
                )}
                {' '}Last contact {e.lastContactDays}d ago
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--muted)',
                }}
              >
                Step {e.currentStep + 1} / 6
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
