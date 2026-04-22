import fs from 'fs/promises'
import path from 'path'
import { getPipeline, getAudits, getEngagements } from './onedrive'
import type { PipelineItem, AuditApp, Engagement } from './types'

export type DetailKind = 'prospect' | 'audit' | 'client'

export interface Contact {
  name: string
  role?: string
  email?: string
  phone?: string
  primary?: boolean
  lastContactDate?: string
  notes?: string
}

export interface FolderNode {
  name: string
  path: string
  kind: 'dir' | 'file'
  size?: number
  modified?: string
  children?: FolderNode[]
}

export type DetailItem =
  | { kind: 'prospect'; item: PipelineItem }
  | { kind: 'audit'; item: AuditApp }
  | { kind: 'client'; item: Engagement }

export interface DetailBundle {
  detail: DetailItem
  contacts: Contact[]
  folderPath?: string
  folderTree?: FolderNode[]
  commsLog?: { filePath: string; content: string } | null
  engagementPlan?: { filePath: string; content: string } | null
}

export async function getDetail(kind: DetailKind, id: string): Promise<DetailBundle | null> {
  if (kind === 'prospect') {
    const pipeline = await getPipeline()
    const item = pipeline.find((p) => p.id === id)
    if (!item) return null
    return await buildBundle({ kind, item } as DetailItem)
  }
  if (kind === 'audit') {
    const audits = await getAudits()
    const item = audits.find((a) => a.id === id)
    if (!item) return null
    return await buildBundle({ kind, item } as DetailItem)
  }
  const engagements = await getEngagements()
  const item = engagements.find((e) => e.id === id)
  if (!item) return null
  return await buildBundle({ kind, item } as DetailItem)
}

async function buildBundle(detail: DetailItem): Promise<DetailBundle> {
  const item = detail.item
  const folderPath = item.filePath ? path.dirname(item.filePath) : undefined
  const [folderTree, commsLog, engagementPlan] = await Promise.all([
    folderPath ? walkFolder(folderPath, 2) : Promise.resolve(undefined),
    folderPath ? loadMarkdownByAnyName(folderPath, ['02 - Comms Log.md', '02-comms-log.md', 'comms-log.md']) : Promise.resolve(null),
    folderPath ? loadMarkdownByAnyName(folderPath, ['01 - Engagement Plan.md', '01-engagement-plan.md', 'engagement-plan.md']) : Promise.resolve(null),
  ])
  return {
    detail,
    contacts: buildContacts(detail.kind, item as unknown as Record<string, unknown>),
    folderPath,
    folderTree,
    commsLog,
    engagementPlan,
  }
}

async function loadMarkdownByAnyName(
  dir: string,
  candidates: string[],
): Promise<{ filePath: string; content: string } | null> {
  for (const name of candidates) {
    const p = path.join(dir, name)
    try {
      const raw = await fs.readFile(p, 'utf-8')
      return { filePath: p, content: raw }
    } catch {
      // next
    }
  }
  return null
}

/** Build contacts list: use `contacts: []` if present, else synthesize from legacy fields. */
function buildContacts(kind: DetailKind, item: Record<string, unknown>): Contact[] {
  const raw = item.contacts
  if (Array.isArray(raw) && raw.length > 0) {
    return raw
      .filter((c) => c && typeof c === 'object')
      .map((c) => {
        const o = c as Record<string, unknown>
        return {
          name: String(o.name || ''),
          role: o.role ? String(o.role) : undefined,
          email: o.email ? String(o.email) : undefined,
          phone: o.phone ? String(o.phone) : undefined,
          primary: !!o.primary,
          lastContactDate: o.lastContactDate ? toIsoString(o.lastContactDate) : undefined,
          notes: o.notes ? String(o.notes) : undefined,
        }
      })
      .filter((c) => c.name)
  }
  // Fallback synthesis
  if (kind === 'client') {
    const sponsor = item.sponsor as string | undefined
    if (sponsor) {
      const [name, ...roleParts] = sponsor.split(',').map((s) => s.trim())
      return [{ name, role: roleParts.join(', ') || 'Sponsor', primary: true }]
    }
  }
  if (kind === 'prospect') {
    const contact = item.contact as string | undefined
    if (contact) {
      const [name, ...roleParts] = contact.split(',').map((s) => s.trim())
      return [{ name, role: roleParts.join(', ') || undefined, primary: true }]
    }
  }
  if (kind === 'audit') {
    const contact = item.contact as string | undefined
    const role = item.role as string | undefined
    if (contact) {
      return [{ name: contact, role, primary: true }]
    }
  }
  return []
}

function toIsoString(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string') return v
  return ''
}

/** Walk a folder up to `depth` levels deep. Skip hidden files and `_`-prefixed entries. */
async function walkFolder(dir: string, depth: number): Promise<FolderNode[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const nodes = await Promise.all(
      entries
        .filter((e) => !e.name.startsWith('.') && !e.name.startsWith('~'))
        .map(async (e): Promise<FolderNode | null> => {
          const full = path.join(dir, e.name)
          try {
            const stat = await fs.stat(full)
            const node: FolderNode = {
              name: e.name,
              path: full,
              kind: e.isDirectory() ? 'dir' : 'file',
              size: e.isFile() ? stat.size : undefined,
              modified: stat.mtime.toISOString(),
            }
            if (e.isDirectory() && depth > 0) {
              node.children = await walkFolder(full, depth - 1)
            }
            return node
          } catch {
            return null
          }
        }),
    )
    return nodes
      .filter((n): n is FolderNode => n !== null)
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1
        return a.name.localeCompare(b.name)
      })
  } catch {
    return []
  }
}
