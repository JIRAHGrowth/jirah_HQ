import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import path from 'path'
import { resolveRoot } from '@/lib/onedrive'

/**
 * POST /api/open-file
 * body: { path: string }
 * Opens a file or folder in the OS default handler (Explorer on Windows).
 *
 * Only paths within the resolved data root may be opened — this blocks traversal
 * and limits blast radius to files the dashboard already has read access to.
 */
export async function POST(req: Request) {
  let body: { path?: string }
  try {
    body = (await req.json()) as { path?: string }
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const target = body.path
  if (!target) {
    return NextResponse.json({ error: 'missing path' }, { status: 400 })
  }

  const abs = path.resolve(target)
  const { root } = resolveRoot()
  const rootAbs = path.resolve(root)
  if (!abs.startsWith(rootAbs + path.sep) && abs !== rootAbs) {
    return NextResponse.json({ error: 'path outside data root' }, { status: 403 })
  }

  // Windows: `start "" "<path>"` opens the file/folder in its default handler.
  // The empty quoted string is the window title argument start expects when the path is quoted.
  const cmd = process.platform === 'win32'
    ? `start "" "${abs.replace(/"/g, '')}"`
    : process.platform === 'darwin'
      ? `open "${abs.replace(/"/g, '')}"`
      : `xdg-open "${abs.replace(/"/g, '')}"`

  return new Promise<NextResponse>((resolve) => {
    exec(cmd, { windowsHide: true }, (err) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }))
      } else {
        resolve(NextResponse.json({ ok: true }))
      }
    })
  })
}
