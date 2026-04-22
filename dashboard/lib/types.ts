export type Stage = 'cold' | 'warm' | 'booked' | 'proposal' | 'won' | 'lost'
export type Owner = 'JL' | 'JM'
export type AuditStatus = 'pending' | 'shortlist' | 'accepted' | 'declined'
export type Step = 0 | 1 | 2 | 3 | 4 | 5

export type TaskStatus = 'open' | 'in-progress' | 'blocked' | 'done' | 'archived'
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'
export type TaskDifficulty = 'XS' | 'S' | 'M' | 'L'
export type TaskCadence = 'one-off' | 'weekly' | 'monthly' | 'quarterly'

export interface Task {
  id: string
  title: string
  owner: Owner
  dueDate: string
  status: TaskStatus
  priority: TaskPriority
  difficulty: TaskDifficulty
  tags: string[]
  cadence: TaskCadence
  createdAt: string
  completedAt?: string | null
  linkedDeliverable?: string
  notes?: string
}

export type EventType =
  | 'outreach-sent'
  | 'outreach-reply-received'
  | 'discovery-call-booked'
  | 'discovery-call-held'
  | 'discussion-doc-sent'
  | 'discussion-doc-signed'
  | 'kickoff-held'
  | 'sprint-day-held'
  | 'proposal-sent'
  | 'proposal-accepted'
  | 'proposal-declined'
  | 'meeting-booked'
  | 'meeting-held'
  | 'email-sent'
  | 'email-received'
  | 'deliverable-shipped'
  | 'retainer-started'
  | 'monthly-checkin-held'
  | 'case-study-published'
  | 'testimonial-received'
  | 'referral-received'
  | 'stage-changed'
  | 'task-completed'
  | 'manual-note'

export interface ClientEvent {
  id: string
  type: EventType
  date: string
  by: Owner
  note?: string
  relatedTaskId?: string | null
  fromStage?: Stage
  toStage?: Stage
}

export const EVENT_LABELS: Record<EventType, string> = {
  'outreach-sent': 'Outreach email sent',
  'outreach-reply-received': 'Outreach reply received',
  'discovery-call-booked': 'Discovery call booked',
  'discovery-call-held': 'Discovery call held',
  'discussion-doc-sent': 'Discussion Document sent',
  'discussion-doc-signed': 'Discussion Document signed',
  'kickoff-held': 'Kickoff held',
  'sprint-day-held': 'Sprint day held',
  'proposal-sent': 'Proposal sent',
  'proposal-accepted': 'Proposal accepted',
  'proposal-declined': 'Proposal declined',
  'meeting-booked': 'Meeting booked',
  'meeting-held': 'Meeting held',
  'email-sent': 'Email sent',
  'email-received': 'Email received',
  'deliverable-shipped': 'Deliverable shipped',
  'retainer-started': 'Retainer started',
  'monthly-checkin-held': 'Monthly check-in held',
  'case-study-published': 'Case study published',
  'testimonial-received': 'Testimonial received',
  'referral-received': 'Referral received',
  'stage-changed': 'Stage changed',
  'task-completed': 'Task completed',
  'manual-note': 'Manual note',
}

/** Event types that are sensible to log from the daily briefing dropdown. */
export const BRIEFING_EVENT_TYPES: EventType[] = [
  'outreach-sent',
  'outreach-reply-received',
  'discovery-call-booked',
  'discovery-call-held',
  'discussion-doc-sent',
  'proposal-sent',
  'proposal-accepted',
  'meeting-booked',
  'meeting-held',
  'email-sent',
  'email-received',
  'manual-note',
]

export interface PipelineItem {
  id: string
  name: string
  stage: Stage
  industry: string
  geo: string
  owner: Owner
  lastContactDays: number
  nextAction: string
  value: number
  contact: string
  source: string
  notes: string
  tasks?: Task[]
  events?: ClientEvent[]
  deliverables?: Deliverable[]
  artifacts?: LinkedArtifact[]
  /** Absolute path to the source .md file — used for writebacks. */
  filePath?: string
}

export interface AuditApp {
  id: string
  applicant: string
  contact: string
  role: string
  company: string
  submitted: string
  icp: number
  status: AuditStatus
  revenue: string
  staff: number
  why: string
  tasks?: Task[]
  events?: ClientEvent[]
  deliverables?: Deliverable[]
  artifacts?: LinkedArtifact[]
  filePath?: string
}

export interface EngagementTimelineItem {
  date: string
  body: string
}

export interface Engagement {
  id: string
  name: string
  industry: string
  geo: string
  owner: Owner
  coOwner: Owner
  currentStep: Step
  milestone: string
  dueLabel: string
  lastContactDays: number
  warn?: boolean
  contract: string
  sponsor: string
  timeline: EngagementTimelineItem[]
  tasks?: Task[]
  events?: ClientEvent[]
  deliverables?: Deliverable[]
  artifacts?: LinkedArtifact[]
  filePath?: string
}

export interface BriefingItem {
  id: string
  name: string
  when: string
  body: string
  cta: string
}

export interface Briefing {
  date: string
  overdue: BriefingItem[]
  sprint: BriefingItem[]
  warm: BriefingItem[]
}

export interface DashboardData {
  pipeline: PipelineItem[]
  audits: AuditApp[]
  engagements: Engagement[]
  briefing: Briefing
}

/** Task enriched with the client it belongs to — for cross-client This Week view. */
export interface TaskWithContext extends Task {
  clientId: string
  clientName: string
  clientKind: 'prospect' | 'audit' | 'engagement'
  clientFilePath: string
}

/** Lightweight record used by the Add Task client picker — one entry per prospect/audit/client. */
export interface Addable {
  id: string
  name: string
  kind: 'prospect' | 'audit' | 'engagement'
  filePath: string
}

export type DeliverableStatus =
  | 'drafted'
  | 'in-progress'
  | 'in-review'
  | 'signed-off'
  | 'shipped'
  | 'blocked'

export interface Deliverable {
  id: string
  title: string
  status: DeliverableStatus
  dueDate: string
  owner: Owner
  linkedFile?: string
  sourceCommitment?: string
  tags: string[]
  createdAt: string
  shippedAt?: string | null
  notes?: string
}

export interface LinkedArtifact {
  id: string
  skill?: string
  ranOn?: string
  filePath: string
  notes?: string
}
