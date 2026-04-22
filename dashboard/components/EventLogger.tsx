'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Check } from 'lucide-react'
import { BRIEFING_EVENT_TYPES, EVENT_LABELS } from '@/lib/types'
import type { EventType, Owner } from '@/lib/types'

export default function EventLogger({
  filePath,
  defaultBy = 'JL',
  compact = false,
  eventTypes = BRIEFING_EVENT_TYPES,
}: {
  filePath?: string
  defaultBy?: Owner
  compact?: boolean
  eventTypes?: EventType[]
}) {
  const router = useRouter()
  const [type, setType] = useState<EventType>(eventTypes[0])
  const [note, setNote] = useState('')
  const [by, setBy] = useState<Owner>(defaultBy)
  const [justSaved, setJustSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!filePath) return null

  const save = () => {
    if (isPending) return
    startTransition(async () => {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'append-event',
          filePath,
          event: { type, by, note: note || undefined },
          resetContact: true,
        }),
      })
      if (res.ok) {
        setNote('')
        setJustSaved(true)
        setTimeout(() => setJustSaved(false), 1600)
        router.refresh()
      }
    })
  }

  return (
    <div className={`evlog ${compact ? 'compact' : ''}`}>
      <div className="evlog-row">
        <div className="evlog-select">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
            aria-label="Event type"
          >
            {eventTypes.map((t) => (
              <option key={t} value={t}>{EVENT_LABELS[t]}</option>
            ))}
          </select>
          <ChevronDown size={12} strokeWidth={1.8} />
        </div>
        <div className="evlog-by">
          <button
            type="button"
            className={`evlog-by-btn ${by === 'JL' ? 'active' : ''}`}
            onClick={() => setBy('JL')}
          >JL</button>
          <button
            type="button"
            className={`evlog-by-btn ${by === 'JM' ? 'active' : ''}`}
            onClick={() => setBy('JM')}
          >JM</button>
        </div>
      </div>
      {!compact && (
        <input
          className="evlog-note"
          placeholder="Optional note (e.g. what was sent, what they said)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      )}
      <button
        type="button"
        className={`btn btn-sm evlog-save ${justSaved ? 'saved' : ''}`}
        onClick={save}
        disabled={isPending}
      >
        {justSaved ? (
          <><Check size={12} strokeWidth={2} /> Logged</>
        ) : isPending ? 'Saving…' : 'Log event'}
      </button>
    </div>
  )
}
