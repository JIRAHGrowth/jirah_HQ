import { notFound } from 'next/navigation'
import { getDetail, type DetailKind } from '@/lib/detail'
import { getAllData } from '@/lib/onedrive'
import type { Addable } from '@/lib/types'
import DetailShell from '@/components/detail/DetailShell'

export const dynamic = 'force-dynamic'

const VALID_KINDS: DetailKind[] = ['prospect', 'audit', 'client']

export default async function DetailPage({
  params,
}: {
  params: Promise<{ kind: string; id: string }>
}) {
  const { kind, id } = await params
  if (!VALID_KINDS.includes(kind as DetailKind)) notFound()

  const [bundle, data] = await Promise.all([
    getDetail(kind as DetailKind, id),
    getAllData(),
  ])
  if (!bundle) notFound()

  const addables: Addable[] = [
    ...data.pipeline.map((p) => ({ id: p.id, name: p.name, kind: 'prospect' as const, filePath: p.filePath || '' })),
    ...data.audits.map((a) => ({ id: a.id, name: a.applicant, kind: 'audit' as const, filePath: a.filePath || '' })),
    ...data.engagements.map((e) => ({ id: e.id, name: e.name, kind: 'engagement' as const, filePath: e.filePath || '' })),
  ].filter((a) => a.filePath)

  return <DetailShell bundle={bundle} addables={addables} />
}
