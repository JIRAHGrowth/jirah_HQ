import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { resolveRoot } from '@/lib/onedrive'
import type {
  ClientEvent,
  Deliverable,
  DeliverableStatus,
  EventType,
  Stage,
  Task,
  TaskStatus,
} from '@/lib/types'

type PatchStageAction = {
  action: 'patch-stage'
  filePath: string
  toStage: Stage
  by?: 'JL' | 'JM'
  note?: string
}

type ToggleTaskAction = {
  action: 'toggle-task'
  filePath: string
  taskId: string
  nextStatus: TaskStatus
  by?: 'JL' | 'JM'
}

type AppendEventAction = {
  action: 'append-event'
  filePath: string
  event: {
    type: EventType
    date?: string
    by?: 'JL' | 'JM'
    note?: string
    relatedTaskId?: string
  }
  /** When true, also resets lastContactDays to 0. */
  resetContact?: boolean
}

type AddTaskAction = {
  action: 'add-task'
  filePath: string
  task: Omit<Task, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
}

type AddDeliverableAction = {
  action: 'add-deliverable'
  filePath: string
  deliverable: Omit<Deliverable, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
}

type UpdateDeliverableStatusAction = {
  action: 'update-deliverable-status'
  filePath: string
  deliverableId: string
  nextStatus: DeliverableStatus
  by?: 'JL' | 'JM'
}

type AppendCommsLogAction = {
  action: 'append-comms-log'
  /** Path to the Comms Log markdown file (in the client folder). */
  commsLogPath: string
  /** Original client .md path — used for the root-guard check. */
  filePath: string
  entry: {
    date?: string
    channel: string
    withWhom?: string
    note: string
    by?: 'JL' | 'JM'
  }
}

type Body =
  | PatchStageAction
  | ToggleTaskAction
  | AppendEventAction
  | AddTaskAction
  | AddDeliverableAction
  | UpdateDeliverableStatusAction
  | AppendCommsLogAction

/** Block path traversal — only files under the resolved data root may be written. */
function assertInsideRoot(filePath: string) {
  const { root } = resolveRoot()
  const abs = path.resolve(filePath)
  const rootAbs = path.resolve(root)
  if (!abs.startsWith(rootAbs + path.sep) && abs !== rootAbs) {
    throw new Error(`filePath outside data root: ${abs}`)
  }
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function nextId(prefix: string, existing: { id: string }[]): string {
  const nums = existing
    .map((x) => x.id)
    .map((id) => {
      const m = id.match(/-(\d+)$/)
      return m ? parseInt(m[1], 10) : 0
    })
  const max = nums.length > 0 ? Math.max(...nums) : 0
  return `${prefix}${String(max + 1).padStart(3, '0')}`
}

async function readAndParse(filePath: string) {
  const raw = await fs.readFile(filePath, 'utf-8')
  const parsed = matter(raw)
  const data = parsed.data as Record<string, unknown>
  const content = parsed.content
  return { data, content }
}

async function writeBack(
  filePath: string,
  data: Record<string, unknown>,
  content: string,
) {
  const serialized = matter.stringify(content, data, { lineWidth: -1 } as never)
  await fs.writeFile(filePath, serialized, 'utf-8')
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  if (!body || !('action' in body) || !body.filePath) {
    return NextResponse.json({ error: 'missing action or filePath' }, { status: 400 })
  }

  try {
    assertInsideRoot(body.filePath)
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 403 },
    )
  }

  try {
    const { data, content } = await readAndParse(body.filePath)
    const events = Array.isArray(data.events) ? (data.events as ClientEvent[]) : []
    const tasks = Array.isArray(data.tasks) ? (data.tasks as Task[]) : []

    if (body.action === 'patch-stage') {
      const fromStage = data.stage as Stage | undefined
      data.stage = body.toStage
      const evt: ClientEvent = {
        id: nextId(inferEventPrefix(data), events),
        type: 'stage-changed',
        date: todayIso(),
        by: body.by || 'JL',
        note: body.note,
        fromStage,
        toStage: body.toStage,
      }
      data.events = [evt, ...events]
      data.lastContactDays = 0
      await writeBack(body.filePath, data, content)
      return NextResponse.json({ ok: true, event: evt })
    }

    if (body.action === 'toggle-task') {
      const idx = tasks.findIndex((t) => t.id === body.taskId)
      if (idx === -1) {
        return NextResponse.json({ error: 'task not found' }, { status: 404 })
      }
      const task = { ...tasks[idx] }
      task.status = body.nextStatus
      task.completedAt = body.nextStatus === 'done' ? todayIso() : null
      const nextTasks = [...tasks]
      nextTasks[idx] = task
      data.tasks = nextTasks

      if (body.nextStatus === 'done') {
        const evt: ClientEvent = {
          id: nextId(inferEventPrefix(data), events),
          type: 'task-completed',
          date: todayIso(),
          by: body.by || task.owner,
          note: task.title,
          relatedTaskId: task.id,
        }
        data.events = [evt, ...events]
      }
      await writeBack(body.filePath, data, content)
      return NextResponse.json({ ok: true, task })
    }

    if (body.action === 'append-event') {
      const evt: ClientEvent = {
        id: nextId(inferEventPrefix(data), events),
        type: body.event.type,
        date: body.event.date || todayIso(),
        by: body.event.by || 'JL',
        note: body.event.note,
        relatedTaskId: body.event.relatedTaskId || null,
      }
      data.events = [evt, ...events]
      if (body.resetContact !== false) {
        data.lastContactDays = 0
      }
      await writeBack(body.filePath, data, content)
      return NextResponse.json({ ok: true, event: evt })
    }

    if (body.action === 'add-deliverable') {
      const deliverables = Array.isArray(data.deliverables) ? (data.deliverables as Deliverable[]) : []
      const newDeliverable: Deliverable = {
        id: body.deliverable.id || nextId(inferDeliverablePrefix(data), deliverables),
        title: body.deliverable.title,
        status: body.deliverable.status || 'drafted',
        dueDate: body.deliverable.dueDate,
        owner: body.deliverable.owner,
        linkedFile: body.deliverable.linkedFile,
        sourceCommitment: body.deliverable.sourceCommitment,
        tags: body.deliverable.tags || [],
        createdAt: body.deliverable.createdAt || todayIso(),
        shippedAt: null,
        notes: body.deliverable.notes,
      }
      data.deliverables = [...deliverables, newDeliverable]
      await writeBack(body.filePath, data, content)
      return NextResponse.json({ ok: true, deliverable: newDeliverable })
    }

    if (body.action === 'update-deliverable-status') {
      const deliverables = Array.isArray(data.deliverables) ? (data.deliverables as Deliverable[]) : []
      const idx = deliverables.findIndex((d) => d.id === body.deliverableId)
      if (idx === -1) {
        return NextResponse.json({ error: 'deliverable not found' }, { status: 404 })
      }
      const deliverable = { ...deliverables[idx] }
      deliverable.status = body.nextStatus
      if (body.nextStatus === 'shipped' && !deliverable.shippedAt) {
        deliverable.shippedAt = todayIso()
      }
      if (body.nextStatus !== 'shipped') {
        deliverable.shippedAt = null
      }
      const nextDeliverables = [...deliverables]
      nextDeliverables[idx] = deliverable
      data.deliverables = nextDeliverables

      if (body.nextStatus === 'shipped') {
        const events = Array.isArray(data.events) ? (data.events as ClientEvent[]) : []
        const evt: ClientEvent = {
          id: nextId(inferEventPrefix(data), events),
          type: 'deliverable-shipped',
          date: todayIso(),
          by: body.by || deliverable.owner,
          note: deliverable.title,
        }
        data.events = [evt, ...events]
      }
      await writeBack(body.filePath, data, content)
      return NextResponse.json({ ok: true, deliverable })
    }

    if (body.action === 'add-task') {
      const newTask: Task = {
        id: body.task.id || nextId(inferTaskPrefix(data), tasks),
        title: body.task.title,
        owner: body.task.owner,
        dueDate: body.task.dueDate,
        status: body.task.status || 'open',
        priority: body.task.priority || 'medium',
        difficulty: body.task.difficulty || 'S',
        tags: body.task.tags || [],
        cadence: body.task.cadence || 'one-off',
        createdAt: body.task.createdAt || todayIso(),
        completedAt: null,
        linkedDeliverable: body.task.linkedDeliverable,
        notes: body.task.notes,
      }
      data.tasks = [...tasks, newTask]
      await writeBack(body.filePath, data, content)
      return NextResponse.json({ ok: true, task: newTask })
    }

    if (body.action === 'append-comms-log') {
      try {
        assertInsideRoot(body.commsLogPath)
      } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 403 })
      }
      const date = body.entry.date || todayIso()
      const by = body.entry.by || 'JL'
      const withPart = body.entry.withWhom ? ` with ${body.entry.withWhom}` : ''
      const line = `- **${date}** · ${body.entry.channel}${withPart} · _${by}_ — ${body.entry.note}`

      let existing = ''
      try {
        existing = await fs.readFile(body.commsLogPath, 'utf-8')
      } catch {
        existing = `# Communications Log\n\n## Log\n`
      }

      // Ensure a "## Log" heading exists; append the line beneath it.
      let next: string
      if (/^##\s+Log\s*$/m.test(existing)) {
        next = existing.replace(/(^##\s+Log\s*\n)/m, `$1${line}\n`)
      } else {
        const sep = existing.endsWith('\n') ? '' : '\n'
        next = `${existing}${sep}\n## Log\n${line}\n`
      }
      await fs.writeFile(body.commsLogPath, next, 'utf-8')

      // Also log an event on the main record if the main filePath exists.
      try {
        const { data: mainData, content: mainContent } = await readAndParse(body.filePath)
        const events = Array.isArray(mainData.events) ? (mainData.events as ClientEvent[]) : []
        const channelMap: Record<string, EventType> = {
          email: 'email-sent',
          meeting: 'meeting-held',
          call: 'meeting-held',
          text: 'manual-note',
          other: 'manual-note',
        }
        const evtType: EventType = channelMap[body.entry.channel.toLowerCase()] || 'manual-note'
        const evt: ClientEvent = {
          id: nextId(inferEventPrefix(mainData), events),
          type: evtType,
          date,
          by,
          note: `${body.entry.channel}${withPart}: ${body.entry.note}`,
        }
        mainData.events = [evt, ...events]
        mainData.lastContactDays = 0
        await writeBack(body.filePath, mainData, mainContent)
      } catch {
        // best-effort — comms log still got the entry
      }

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'unknown action' }, { status: 400 })
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || 'write failed' },
      { status: 500 },
    )
  }
}

/** Pick a stable event-id prefix from the record's id (e.g. "gen-" → "gen-e"). */
function inferEventPrefix(data: Record<string, unknown>): string {
  const id = typeof data.id === 'string' ? data.id : 'x'
  const short = id.split('-')[0].slice(0, 8) || 'x'
  return `${short}-e`
}

function inferTaskPrefix(data: Record<string, unknown>): string {
  const id = typeof data.id === 'string' ? data.id : 'x'
  const short = id.split('-')[0].slice(0, 8) || 'x'
  return `${short}-t`
}

function inferDeliverablePrefix(data: Record<string, unknown>): string {
  const id = typeof data.id === 'string' ? data.id : 'x'
  const short = id.split('-')[0].slice(0, 8) || 'x'
  return `${short}-d`
}
