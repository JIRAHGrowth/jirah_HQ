'use client'

import { useState } from 'react'
import { Folder, FolderOpen, FileText, ExternalLink } from 'lucide-react'
import type { FolderNode } from '@/lib/detail'

export default function FilesSection({
  folderTree,
  folderPath,
}: {
  folderTree?: FolderNode[]
  folderPath?: string
}) {
  return (
    <div>
      <div className="section-head-row">
        <h2 className="section-title">Files</h2>
        {folderPath && (
          <button
            type="button"
            className="btn"
            onClick={() => openInExplorer(folderPath)}
          >
            <ExternalLink size={13} strokeWidth={1.5} /> Open in Explorer
          </button>
        )}
      </div>

      {!folderPath && (
        <p className="muted" style={{ fontSize: 13 }}>
          No folder linked yet. A folder is created when an engagement begins (or in OneDrive mode for prospects/audits that have their own subfolder).
        </p>
      )}

      {folderPath && folderTree && folderTree.length === 0 && (
        <p className="muted" style={{ fontSize: 13 }}>
          Folder exists but is empty.
          <br />
          <code style={{ fontSize: 11, background: 'var(--navy-04)', padding: '2px 6px', borderRadius: 3 }}>{folderPath}</code>
        </p>
      )}

      {folderTree && folderTree.length > 0 && (
        <div className="file-tree">
          {folderTree.map((n) => <Node key={n.path} node={n} depth={0} />)}
        </div>
      )}
    </div>
  )
}

function Node({ node, depth }: { node: FolderNode; depth: number }) {
  const [open, setOpen] = useState(depth === 0)

  if (node.kind === 'dir') {
    return (
      <div className="ftree-node" style={{ paddingLeft: depth * 16 }}>
        <button
          type="button"
          className="ftree-row ftree-dir"
          onClick={() => setOpen(!open)}
        >
          {open ? <FolderOpen size={13} strokeWidth={1.5} /> : <Folder size={13} strokeWidth={1.5} />}
          <span className="ftree-name">{node.name}</span>
          {node.children && node.children.length > 0 && (
            <span className="ftree-count">{node.children.length}</span>
          )}
        </button>
        {open && node.children && node.children.length > 0 && (
          <div>
            {node.children.map((c) => <Node key={c.path} node={c} depth={depth + 1} />)}
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="ftree-node" style={{ paddingLeft: (depth * 16) + 18 }}>
      <button
        type="button"
        className="ftree-row ftree-file"
        onClick={() => openInExplorer(node.path)}
        title={`Open ${node.name}`}
      >
        <FileText size={12} strokeWidth={1.5} />
        <span className="ftree-name">{node.name}</span>
        {node.size !== undefined && <span className="ftree-size">{formatSize(node.size)}</span>}
      </button>
    </div>
  )
}

async function openInExplorer(path: string) {
  try {
    await fetch('/api/open-file', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path }),
    })
  } catch {
    // best-effort
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
