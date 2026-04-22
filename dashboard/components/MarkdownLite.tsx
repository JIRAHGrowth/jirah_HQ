'use client'

import React from 'react'

/**
 * Minimal markdown renderer — headings, bold, italic, inline code, links,
 * bullet and numbered lists, blockquotes, horizontal rule, paragraphs.
 * Trusted input (read from local disk). Enough for Jirah's flat markdown docs.
 */
export default function MarkdownLite({ source }: { source: string }) {
  const blocks = splitBlocks(source)
  return <div className="md">{blocks.map((b, i) => <Block key={i} block={b} />)}</div>
}

type Block =
  | { kind: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'numbers'; items: string[] }
  | { kind: 'blockquote'; text: string }
  | { kind: 'hr' }
  | { kind: 'code'; text: string }
  | { kind: 'para'; text: string }

function splitBlocks(source: string): Block[] {
  const lines = source.split('\n')
  const out: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (/^```/.test(line)) {
      const code: string[] = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i])
        i++
      }
      i++ // skip closing fence
      out.push({ kind: 'code', text: code.join('\n') })
      continue
    }

    if (/^\s*$/.test(line)) { i++; continue }
    if (/^---+\s*$/.test(line)) { out.push({ kind: 'hr' }); i++; continue }

    const h = line.match(/^(#{1,4})\s+(.+)$/)
    if (h) {
      out.push({ kind: 'heading', level: h[1].length as 1 | 2 | 3 | 4, text: h[2].trim() })
      i++
      continue
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      out.push({ kind: 'bullets', items })
      continue
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''))
        i++
      }
      out.push({ kind: 'numbers', items })
      continue
    }

    if (/^\s*>/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      out.push({ kind: 'blockquote', text: buf.join(' ') })
      continue
    }

    // paragraph — gather consecutive non-blank, non-structural lines
    const para: string[] = [line]
    i++
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^#{1,4}\s/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*>/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i]) &&
      !/^```/.test(lines[i])
    ) {
      para.push(lines[i])
      i++
    }
    out.push({ kind: 'para', text: para.join(' ') })
  }

  return out
}

function Block({ block }: { block: Block }) {
  if (block.kind === 'heading') {
    if (block.level === 1) return <h3 className="md-h1">{inline(block.text)}</h3>
    if (block.level === 2) return <h4 className="md-h2">{inline(block.text)}</h4>
    if (block.level === 3) return <h5 className="md-h3">{inline(block.text)}</h5>
    return <h6 className="md-h4">{inline(block.text)}</h6>
  }
  if (block.kind === 'bullets') {
    return <ul className="md-ul">{block.items.map((t, i) => <li key={i}>{inline(t)}</li>)}</ul>
  }
  if (block.kind === 'numbers') {
    return <ol className="md-ol">{block.items.map((t, i) => <li key={i}>{inline(t)}</li>)}</ol>
  }
  if (block.kind === 'blockquote') {
    return <blockquote className="md-quote">{inline(block.text)}</blockquote>
  }
  if (block.kind === 'hr') {
    return <hr className="md-hr" />
  }
  if (block.kind === 'code') {
    return <pre className="md-code"><code>{block.text}</code></pre>
  }
  return <p className="md-p">{inline(block.text)}</p>
}

/** Minimal inline parser — bold, italic, code, links. */
function inline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const rx = /\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = rx.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index))
    if (m[1]) parts.push(<strong key={m.index}>{m[1]}</strong>)
    else if (m[2]) parts.push(<em key={m.index}>{m[2]}</em>)
    else if (m[3]) parts.push(<em key={m.index}>{m[3]}</em>)
    else if (m[4]) parts.push(<code key={m.index} className="md-inline-code">{m[4]}</code>)
    else if (m[5] && m[6]) parts.push(<a key={m.index} href={m[6]} target="_blank" rel="noreferrer">{m[5]}</a>)
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}
