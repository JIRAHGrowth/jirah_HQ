'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Calendar, Mail, FolderOpen, Clock } from 'lucide-react'
import type { Addable, Owner } from '@/lib/types'
import type { DetailBundle } from '@/lib/detail'
import { Avatar, StageBadge, ownerName } from '../Primitives'
import Stepper from '../Stepper'
import AddTaskModal from '../AddTaskModal'
import OverviewSection from './sections/OverviewSection'
import TasksSection from './sections/TasksSection'
import DeliverablesSection from './sections/DeliverablesSection'
import EventsSection from './sections/EventsSection'
import ContactsSection from './sections/ContactsSection'
import FilesSection from './sections/FilesSection'
import CommsLogSection from './sections/CommsLogSection'
import EngagementPlanSection from './sections/EngagementPlanSection'
import ArtifactsSection from './sections/ArtifactsSection'

type SectionKey =
  | 'overview'
  | 'tasks'
  | 'deliverables'
  | 'events'
  | 'contacts'
  | 'comms'
  | 'files'
  | 'plan'
  | 'artifacts'

const SECTIONS: Array<{ key: SectionKey; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'deliverables', label: 'Deliverables' },
  { key: 'events', label: 'Events' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'comms', label: 'Comms log' },
  { key: 'files', label: 'Files' },
  { key: 'plan', label: 'Engagement plan' },
  { key: 'artifacts', label: 'Artifacts' },
]

type TaskModalState = 'closed' | 'add' | 'follow-up'

export default function DetailShell({
  bundle,
  addables,
}: {
  bundle: DetailBundle
  addables: Addable[]
}) {
  const router = useRouter()
  const [section, setSection] = useState<SectionKey>('overview')
  const [taskModal, setTaskModal] = useState<TaskModalState>('closed')

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && taskModal === 'closed') {
        router.push('/')
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [router, taskModal])

  const { detail, folderPath } = bundle
  const item = detail.item
  const kindLabel = detail.kind === 'client' ? 'Active Engagement' : detail.kind === 'prospect' ? 'Pipeline' : 'Audit Application'
  const owner: Owner = 'owner' in item ? item.owner : 'JL'

  const itemName = 'name' in item ? item.name : (item as { applicant: string }).applicant
  const lockedClient: Addable = {
    id: item.id,
    name: itemName,
    kind: detail.kind === 'client' ? 'engagement' : detail.kind,
    filePath: item.filePath || '',
  }

  const openFolder = async () => {
    if (!folderPath) return
    await fetch('/api/open-file', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: folderPath }),
    })
  }

  const followUpDefaults = {
    title: `Follow up with ${itemName}`,
    owner,
    dueDate: addDays(7),
    tags: ['follow-up'],
  }

  const openTasks = item.tasks?.filter((t) => t.status !== 'done' && t.status !== 'archived').length ?? 0
  const activeDeliverables = item.deliverables?.filter((d) => d.status !== 'shipped').length ?? 0

  const countBadge = (key: SectionKey): number | null => {
    switch (key) {
      case 'tasks': return openTasks
      case 'deliverables': return activeDeliverables
      case 'events': return item.events?.length ?? 0
      case 'contacts': return bundle.contacts.length
      case 'artifacts': return item.artifacts?.length ?? 0
      default: return null
    }
  }

  return (
    <div className="detail-app">
      <div className="detail-topbar">
        <div className="detail-breadcrumb">
          <Link href="/" className="detail-back">
            <ArrowLeft size={14} strokeWidth={1.5} /> Dashboard
          </Link>
          <span className="muted">/</span>
          <Link
            href="/"
            className="muted detail-crumb"
            onClick={() => {
              if (typeof window !== 'undefined') {
                const tab = detail.kind === 'client' ? 'engagements' : detail.kind === 'prospect' ? 'pipeline' : 'audit'
                localStorage.setItem('jirah_tab', tab)
              }
            }}
          >
            {kindLabel}
          </Link>
          <span className="muted">/</span>
          <span className="detail-crumb-current">{itemName}</span>
        </div>
      </div>

      <div className="detail-hero">
        <div>
          <div className="detail-kicker">{kindLabel}</div>
          <h1 className="detail-title">{itemName}</h1>
          <div className="detail-hero-meta">
            {detail.kind === 'prospect' && <StageBadge stage={(item as { stage: 'cold' }).stage} />}
            {detail.kind === 'client' && 'owner' in item && (
              <>
                <Avatar owner={item.owner} />
                {'coOwner' in item && <Avatar owner={item.coOwner} />}
                <span className="muted" style={{ fontSize: 12.5 }}>
                  Lead {ownerName(item.owner)}
                </span>
              </>
            )}
            {detail.kind === 'prospect' && 'owner' in item && (
              <>
                <Avatar owner={item.owner} />
                <span className="muted" style={{ fontSize: 12.5 }}>{ownerName(item.owner)}</span>
              </>
            )}
            {'industry' in item && (
              <span className="muted" style={{ fontSize: 12.5 }}>
                · {(item as { industry: string }).industry}{'geo' in item ? ` · ${(item as { geo: string }).geo}` : ''}
              </span>
            )}
          </div>
          {detail.kind === 'client' && 'currentStep' in item && (
            <div style={{ marginTop: 16, maxWidth: 600 }}>
              <Stepper current={(item as { currentStep: 0 | 1 | 2 | 3 | 4 | 5 }).currentStep} />
            </div>
          )}
        </div>
        <div className="detail-actions">
          <button type="button" className="btn btn-gold" onClick={() => setTaskModal('add')}>
            <Plus size={14} strokeWidth={1.5} /> Add task
          </button>
          <button type="button" className="btn" onClick={() => setTaskModal('follow-up')}>
            <Clock size={14} strokeWidth={1.5} /> Schedule follow-up
          </button>
          {folderPath && (
            <button type="button" className="btn" onClick={openFolder}>
              <FolderOpen size={14} strokeWidth={1.5} /> Open folder
            </button>
          )}
          <button type="button" className="btn btn-ghost" disabled>
            <Mail size={14} strokeWidth={1.5} /> Draft email
            <span className="placeholder-pill">PLACEHOLDER</span>
          </button>
          <button type="button" className="btn btn-ghost" disabled>
            <Calendar size={14} strokeWidth={1.5} /> Schedule sync
            <span className="placeholder-pill">PLACEHOLDER</span>
          </button>
        </div>
      </div>

      <div className="detail-body">
        <aside className="detail-rail">
          {SECTIONS.map((s) => {
            const badge = countBadge(s.key)
            return (
              <button
                key={s.key}
                type="button"
                className={`rail-btn ${section === s.key ? 'active' : ''}`}
                onClick={() => setSection(s.key)}
              >
                {s.label}
                {badge !== null && badge > 0 && <span className="rail-count">{badge}</span>}
              </button>
            )
          })}
        </aside>

        <section className="detail-pane">
          {section === 'overview' && <OverviewSection bundle={bundle} />}
          {section === 'tasks' && <TasksSection item={item} addables={addables} lockedClient={lockedClient} />}
          {section === 'deliverables' && <DeliverablesSection item={item} folderPath={folderPath} />}
          {section === 'events' && <EventsSection item={item} />}
          {section === 'contacts' && <ContactsSection contacts={bundle.contacts} />}
          {section === 'comms' && <CommsLogSection item={item} commsLog={bundle.commsLog} />}
          {section === 'files' && <FilesSection folderTree={bundle.folderTree} folderPath={bundle.folderPath} />}
          {section === 'plan' && <EngagementPlanSection engagementPlan={bundle.engagementPlan} />}
          {section === 'artifacts' && <ArtifactsSection item={item} folderPath={folderPath} />}
        </section>
      </div>

      <AddTaskModal
        open={taskModal === 'add'}
        onClose={() => setTaskModal('closed')}
        addables={addables}
        lockedClient={lockedClient}
      />
      <AddTaskModal
        open={taskModal === 'follow-up'}
        onClose={() => setTaskModal('closed')}
        addables={addables}
        lockedClient={lockedClient}
        defaults={followUpDefaults}
      />
    </div>
  )
}

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
