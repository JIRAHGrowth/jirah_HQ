'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import type { Owner } from '@/lib/types'

const CHANNELS = ['Email', 'Meeting', 'Call', 'Text', 'Other']

export default function AppendCommsModal({
  open,
  onClose,
  commsLogPath,
  filePath,
  defaultBy,
}: {
  open: boolean
  onClose: () => void
  commsLogPath?: string
  filePath: string
  defaultBy?: Owner
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [channel, setChannel] = useState('Email')
  const [withWhom, setWithWhom] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [by, setBy] = useState<Owner>(defaultBy || 'JL')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setNote(''); setWithWhom(''); setError(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null

  const effectivePath = commsLogPath || guessCommsLogPath(filePath)
  if (!effectivePath) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-head">
            <h3>Log comms</h3>
            <button type="button" className="modal-close" onClick={onClose}><X size={16} strokeWidth={1.5} /></button>
          </div>
          <div className="modal-body">
            <p className="muted" style={{ fontSize: 13 }}>Can&apos;t determine where to write the comms log — this record has no folder path.</p>
          </div>
        </div>
      </div>
    )
  }

  const submit = () => {
    setError(null)
    if (!note.trim()) return setError('Note required.')
    startTransition(async () => {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'append-comms-log',
          commsLogPath: effectivePath,
          filePath,
          entry: { date, channel, withWhom: withWhom.trim() || undefined, note: note.trim(), by },
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to log entry.')
        return
      }
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Log comms</h3>
          <button type="button" className="modal-close" onClick={onClose}><X size={16} strokeWidth={1.5} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-row">
            <div className="modal-field">
              <label>Channel</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="modal-field">
              <label>By</label>
              <div className="evlog-by">
                <button type="button" className={`evlog-by-btn ${by === 'JL' ? 'active' : ''}`} onClick={() => setBy('JL')}>JL</button>
                <button type="button" className={`evlog-by-btn ${by === 'JM' ? 'active' : ''}`} onClick={() => setBy('JM')}>JM</button>
              </div>
            </div>
          </div>
          <div className="modal-field">
            <label>With whom <span className="muted" style={{ fontWeight: 400 }}>(optional)</span></label>
            <input type="text" value={withWhom} onChange={(e) => setWithWhom(e.target.value)} placeholder="Trent, Derek, etc." />
          </div>
          <div className="modal-field">
            <label>Note</label>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="What was discussed / sent / committed?" />
          </div>
          {error && <div className="modal-error">{error}</div>}
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isPending}>Cancel</button>
          <button type="button" className="btn btn-gold" onClick={submit} disabled={isPending}>
            {isPending ? 'Logging…' : 'Log entry'}
          </button>
        </div>
      </div>
    </div>
  )
}

/** When the comms log file doesn't exist yet, guess its path: same dir as the main profile file. */
function guessCommsLogPath(filePath: string): string | null {
  if (!filePath) return null
  // Windows-safe dirname
  const sep = filePath.includes('/') ? '/' : '\\'
  const parts = filePath.split(sep)
  parts.pop()
  const dir = parts.join(sep)
  return `${dir}${sep}02 - Comms Log.md`
}
