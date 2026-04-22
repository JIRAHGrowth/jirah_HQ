'use client'

interface TabItem {
  key: string
  label: string
  count?: number
}

export default function Tabs({
  value,
  onChange,
  items,
}: {
  value: string
  onChange: (k: string) => void
  items: TabItem[]
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((it) => (
        <button
          key={it.key}
          className="tab"
          role="tab"
          aria-selected={value === it.key}
          onClick={() => onChange(it.key)}
          type="button"
        >
          {it.label}
          {typeof it.count === 'number' && (
            <span className="tab-count">{it.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
