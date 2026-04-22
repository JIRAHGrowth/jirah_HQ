import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type {
  DashboardData,
  PipelineItem,
  AuditApp,
  Engagement,
  Briefing,
  BriefingItem,
  Task,
  ClientEvent,
  TaskWithContext,
  Deliverable,
  LinkedArtifact,
} from './types'

export function resolveRoot(): { root: string } {
  const env = process.env.ONEDRIVE_ROOT
  if (!env || env.trim().length === 0) {
    throw new Error(
      'ONEDRIVE_ROOT is not set. Configure it in dashboard/.env.local (see dashboard/.env.local.example).',
    )
  }
  return { root: env.trim() }
}

function subPath(
  base: string,
  section: 'prospects' | 'audits' | 'active-clients',
): string {
  if (section === 'prospects') {
    return path.join(base, '02 - Sales & Pipeline', 'Prospects')
  }
  if (section === 'audits') {
    return path.join(base, '02 - Sales & Pipeline', 'Audit Applications')
  }
  return path.join(base, '01 - Clients', 'Active')
}

const PROFILE_FILENAMES = ['00 - Profile.md', '00-profile.md']

async function findProfile(dir: string): Promise<string | null> {
  for (const name of PROFILE_FILENAMES) {
    const candidate = path.join(dir, name)
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      // try next
    }
  }
  return null
}

async function listSubdirs(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
      .map((e) => path.join(dir, e.name))
  } catch {
    return []
  }
}

async function readFrontmatter<T = unknown>(
  filepath: string,
): Promise<{ data: T; content: string } | null> {
  try {
    const raw = await fs.readFile(filepath, 'utf-8')
    const parsed = matter(raw)
    return { data: parsed.data as T, content: parsed.content }
  } catch {
    return null
  }
}

/** YAML parses unquoted ISO dates as Date objects; coerce back to 'YYYY-MM-DD' strings. */
function toIsoString(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string') return v
  return ''
}

/** Normalize tasks from frontmatter: coerce Date fields and fill defaults. */
function normalizeTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return []
  const out: Task[] = []
  for (const t of raw) {
    if (!t || typeof t !== 'object') continue
    const o = t as Record<string, unknown>
    if (!o.id || !o.title) continue
    const task: Task = {
      id: String(o.id),
      title: String(o.title),
      owner: (o.owner === 'JL' || o.owner === 'JM' ? o.owner : 'JL') as Task['owner'],
      dueDate: toIsoString(o.dueDate),
      status: (['open', 'in-progress', 'blocked', 'done', 'archived'].includes(String(o.status))
        ? o.status
        : 'open') as Task['status'],
      priority: (['critical', 'high', 'medium', 'low'].includes(String(o.priority))
        ? o.priority
        : 'medium') as Task['priority'],
      difficulty: (['XS', 'S', 'M', 'L'].includes(String(o.difficulty))
        ? o.difficulty
        : 'S') as Task['difficulty'],
      tags: Array.isArray(o.tags) ? o.tags.map(String) : [],
      cadence: (['one-off', 'weekly', 'monthly', 'quarterly'].includes(String(o.cadence))
        ? o.cadence
        : 'one-off') as Task['cadence'],
      createdAt: toIsoString(o.createdAt) || new Date().toISOString().slice(0, 10),
      completedAt: o.completedAt ? toIsoString(o.completedAt) : null,
      linkedDeliverable: o.linkedDeliverable ? String(o.linkedDeliverable) : undefined,
      notes: o.notes ? String(o.notes) : undefined,
    }
    out.push(task)
  }
  return out
}

/** Normalize events from frontmatter: coerce Date fields and fill defaults. */
function normalizeEvents(raw: unknown): ClientEvent[] {
  if (!Array.isArray(raw)) return []
  const out: ClientEvent[] = []
  for (const e of raw) {
    if (!e || typeof e !== 'object') continue
    const o = e as Record<string, unknown>
    if (!o.id || !o.type) continue
    const evt: ClientEvent = {
      id: String(o.id),
      type: String(o.type) as ClientEvent['type'],
      date: toIsoString(o.date),
      by: (o.by === 'JL' || o.by === 'JM' ? o.by : 'JL') as ClientEvent['by'],
      note: o.note ? String(o.note) : undefined,
      relatedTaskId: o.relatedTaskId ? String(o.relatedTaskId) : null,
      fromStage: o.fromStage ? (String(o.fromStage) as ClientEvent['fromStage']) : undefined,
      toStage: o.toStage ? (String(o.toStage) as ClientEvent['toStage']) : undefined,
    }
    out.push(evt)
  }
  return out.sort((a, b) => b.date.localeCompare(a.date))
}

function normalizeDeliverables(raw: unknown): Deliverable[] {
  if (!Array.isArray(raw)) return []
  const out: Deliverable[] = []
  for (const d of raw) {
    if (!d || typeof d !== 'object') continue
    const o = d as Record<string, unknown>
    if (!o.id || !o.title) continue
    const deliverable: Deliverable = {
      id: String(o.id),
      title: String(o.title),
      status: (['drafted', 'in-progress', 'in-review', 'signed-off', 'shipped', 'blocked'].includes(String(o.status))
        ? o.status
        : 'drafted') as Deliverable['status'],
      dueDate: toIsoString(o.dueDate),
      owner: (o.owner === 'JL' || o.owner === 'JM' ? o.owner : 'JL') as Deliverable['owner'],
      linkedFile: o.linkedFile ? String(o.linkedFile) : undefined,
      sourceCommitment: o.sourceCommitment ? String(o.sourceCommitment) : undefined,
      tags: Array.isArray(o.tags) ? o.tags.map(String) : [],
      createdAt: toIsoString(o.createdAt) || new Date().toISOString().slice(0, 10),
      shippedAt: o.shippedAt ? toIsoString(o.shippedAt) : null,
      notes: o.notes ? String(o.notes) : undefined,
    }
    out.push(deliverable)
  }
  return out
}

function normalizeArtifacts(raw: unknown): LinkedArtifact[] {
  if (!Array.isArray(raw)) return []
  const out: LinkedArtifact[] = []
  for (const a of raw) {
    if (!a || typeof a !== 'object') continue
    const o = a as Record<string, unknown>
    if (!o.filePath) continue
    out.push({
      id: String(o.id || `art-${out.length + 1}`),
      skill: o.skill ? String(o.skill) : undefined,
      ranOn: o.ranOn ? toIsoString(o.ranOn) : undefined,
      filePath: String(o.filePath),
      notes: o.notes ? String(o.notes) : undefined,
    })
  }
  return out.sort((a, b) => (b.ranOn || '').localeCompare(a.ranOn || ''))
}

async function collectProfiles(dir: string): Promise<string[]> {
  const subdirs = await listSubdirs(dir)
  const profiles = await Promise.all(subdirs.map((d) => findProfile(d)))
  return profiles.filter((p): p is string => p !== null)
}

export async function getPipeline(): Promise<PipelineItem[]> {
  const { root } = resolveRoot()
  const dir = subPath(root, 'prospects')
  const files = await collectProfiles(dir)
  const items = await Promise.all(
    files.map(async (f) => {
      const parsed = await readFrontmatter<Partial<PipelineItem> & { tasks?: unknown; events?: unknown }>(f)
      if (!parsed || !parsed.data?.id || !parsed.data?.name) return null
      const nextActionRaw = parsed.data.nextAction as unknown
      const nextAction =
        nextActionRaw instanceof Date
          ? toIsoString(nextActionRaw)
          : typeof nextActionRaw === 'string'
            ? nextActionRaw
            : '—'
      return {
        ...parsed.data,
        nextAction,
        notes: parsed.content.trim().replace(/^#\s+.+\n+/, ''),
        tasks: normalizeTasks(parsed.data.tasks),
        events: normalizeEvents(parsed.data.events),
        deliverables: normalizeDeliverables(parsed.data.deliverables),
        artifacts: normalizeArtifacts(parsed.data.artifacts),
        filePath: f,
      } as PipelineItem
    }),
  )
  return items
    .filter((i): i is PipelineItem => i !== null)
    .sort((a, b) => a.id.localeCompare(b.id))
}

export async function getAudits(): Promise<AuditApp[]> {
  const { root } = resolveRoot()
  const dir = subPath(root, 'audits')
  const files = await collectProfiles(dir)
  const items = await Promise.all(
    files.map(async (f) => {
      const parsed = await readFrontmatter<Partial<AuditApp> & { tasks?: unknown; events?: unknown }>(f)
      if (!parsed || !parsed.data?.id || !parsed.data?.applicant) return null
      const whyMatch = parsed.content.match(
        /##\s*Why they applied\s+([\s\S]+?)(?=\n##\s|\n*$)/,
      )
      return {
        ...parsed.data,
        submitted: toIsoString(parsed.data.submitted),
        why: whyMatch ? whyMatch[1].trim() : '',
        tasks: normalizeTasks(parsed.data.tasks),
        events: normalizeEvents(parsed.data.events),
        deliverables: normalizeDeliverables(parsed.data.deliverables),
        artifacts: normalizeArtifacts(parsed.data.artifacts),
        filePath: f,
      } as AuditApp
    }),
  )
  return items
    .filter((i): i is AuditApp => i !== null)
    .sort((a, b) => b.submitted.localeCompare(a.submitted))
}

export async function getEngagements(): Promise<Engagement[]> {
  const { root } = resolveRoot()
  const dir = subPath(root, 'active-clients')
  const subdirs = await listSubdirs(dir)
  const items = await Promise.all(
    subdirs.map(async (d) => {
      const profilePath = await findProfile(d)
      if (!profilePath) return null
      const parsed = await readFrontmatter<Partial<Engagement> & { tasks?: unknown; events?: unknown }>(profilePath)
      if (!parsed || !parsed.data?.id || !parsed.data?.name) return null
      return {
        ...parsed.data,
        timeline: parseTimeline(parsed.content),
        tasks: normalizeTasks(parsed.data.tasks),
        events: normalizeEvents(parsed.data.events),
        deliverables: normalizeDeliverables(parsed.data.deliverables),
        artifacts: normalizeArtifacts(parsed.data.artifacts),
        filePath: profilePath,
      } as Engagement
    }),
  )
  return items
    .filter((i): i is Engagement => i !== null)
    .sort((a, b) => a.id.localeCompare(b.id))
}

function parseTimeline(content: string): { date: string; body: string }[] {
  const section = content.match(
    /##\s*Timeline\s+([\s\S]+?)(?=\n##\s|\n*$)/,
  )
  if (!section) return []
  const lines = section[1]
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-'))
  return lines
    .map((l) => {
      const m = l.match(/^-\s+\*\*(.+?)\*\*\s*[—-]\s*(.+)$/)
      if (m) return { date: m[1].trim(), body: m[2].trim() }
      return { date: '', body: l.replace(/^-\s*/, '').trim() }
    })
    .filter((i) => i.body)
}

export async function getBriefing(date?: string): Promise<Briefing> {
  const d = date || new Date().toISOString().slice(0, 10)
  const workspace = path.join(process.cwd(), '..')
  const parsed = await readFrontmatter<{ date?: string }>(
    path.join(workspace, 'briefings', `${d}.md`),
  )
  if (parsed) return parseBriefing(parsed.data, parsed.content, d)
  return { date: d, overdue: [], sprint: [], warm: [] }
}

function parseBriefing(
  data: { date?: string },
  content: string,
  fallbackDate: string,
): Briefing {
  const date =
    typeof data.date === 'string'
      ? data.date
      : (data.date as unknown as Date)?.toISOString?.().slice(0, 10) ||
        fallbackDate
  return {
    date,
    overdue: extractBriefingSection(content, 'Overdue'),
    sprint: extractBriefingSection(content, 'Sprint Risks'),
    warm: extractBriefingSection(content, 'Warm Prospects'),
  }
}

function extractBriefingSection(content: string, name: string): BriefingItem[] {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const rx = new RegExp(
    `##\\s+${escaped}\\s*\\(\\d+\\)\\s+([\\s\\S]+?)(?=^##\\s|^---|$)`,
    'm',
  )
  const section = content.match(rx)
  if (!section) return []
  const body = section[1]
  const items: BriefingItem[] = []
  const itemRx = /###\s+([^\n]+)\n([\s\S]+?)(?=\n###\s|\n*$)/g
  let m: RegExpExecArray | null
  while ((m = itemRx.exec(body)) !== null) {
    const heading = m[1].trim()
    const itemBody = m[2]
    const whenMatch = itemBody.match(/\*\*When:\*\*\s*([^\n]+)/)
    const contextMatch = itemBody.match(/\*\*Context:\*\*\s*([^\n]+)/)
    const ctaLabel =
      itemBody.includes('Drafted reply') || itemBody.includes('Drafted follow-up')
        ? 'Open drafted reply'
        : itemBody.includes('Action:')
          ? 'Review action'
          : 'Open note'
    items.push({
      id: heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: heading,
      when: whenMatch ? whenMatch[1].trim() : '',
      body: contextMatch ? contextMatch[1].trim() : itemBody.split('\n')[1]?.trim() || '',
      cta: ctaLabel,
    })
  }
  return items
}

export async function getAllData(): Promise<DashboardData> {
  const [pipeline, audits, engagements, briefing] = await Promise.all([
    getPipeline(),
    getAudits(),
    getEngagements(),
    getBriefing(),
  ])
  return { pipeline, audits, engagements, briefing }
}

/** Cross-client task aggregation for the "This Week" view. */
export async function getAllTasks(): Promise<TaskWithContext[]> {
  const [pipeline, audits, engagements] = await Promise.all([
    getPipeline(),
    getAudits(),
    getEngagements(),
  ])
  const out: TaskWithContext[] = []
  for (const p of pipeline) {
    for (const t of p.tasks || []) {
      out.push({ ...t, clientId: p.id, clientName: p.name, clientKind: 'prospect', clientFilePath: p.filePath || '' })
    }
  }
  for (const a of audits) {
    for (const t of a.tasks || []) {
      out.push({ ...t, clientId: a.id, clientName: a.applicant, clientKind: 'audit', clientFilePath: a.filePath || '' })
    }
  }
  for (const e of engagements) {
    for (const t of e.tasks || []) {
      out.push({ ...t, clientId: e.id, clientName: e.name, clientKind: 'engagement', clientFilePath: e.filePath || '' })
    }
  }
  return out
}
