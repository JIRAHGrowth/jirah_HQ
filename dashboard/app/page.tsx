import { getAllData, getAllTasks } from '@/lib/onedrive'
import CommandCenter from '@/components/CommandCenter'
import type { Addable } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [data, tasks] = await Promise.all([getAllData(), getAllTasks()])

  const addables: Addable[] = [
    ...data.pipeline.map((p) => ({ id: p.id, name: p.name, kind: 'prospect' as const, filePath: p.filePath || '' })),
    ...data.audits.map((a) => ({ id: a.id, name: a.applicant, kind: 'audit' as const, filePath: a.filePath || '' })),
    ...data.engagements.map((e) => ({ id: e.id, name: e.name, kind: 'engagement' as const, filePath: e.filePath || '' })),
  ].filter((a) => a.filePath)

  return <CommandCenter data={data} tasks={tasks} addables={addables} />
}
