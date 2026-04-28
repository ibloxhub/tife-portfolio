'use client'

import { cn } from '@/lib/utils'
import { CaretUp, CaretDown, ArrowsDownUp } from '@phosphor-icons/react'
import { useState } from 'react'

// --- Column Definition ---
export interface TableColumn<T> {
  key: string
  header: string
  sortable?: boolean
  width?: string
  className?: string
  render: (item: T) => React.ReactNode
}

// --- Table Props ---
interface AdminTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  emptyMessage?: string
}

export function AdminTable<T>({ columns, data, keyExtractor, onRowClick, emptyMessage }: AdminTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="w-full rounded-[2.5rem] bg-white/[0.03] p-[1px] border border-white/[0.08] backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="w-full rounded-[calc(2.5rem-1px)] bg-black/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-white/5">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-6 py-4 text-left text-[10px] font-medium tracking-widest uppercase text-text-muted whitespace-nowrap',
                      col.sortable && 'cursor-pointer hover:text-text-secondary transition-colors select-none',
                      col.width,
                      col.className
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && (
                        <span className="text-text-muted">
                          {sortKey === col.key ? (
                            sortDir === 'asc' ? (
                              <CaretUp weight="fill" className="h-3 w-3" />
                            ) : (
                              <CaretDown weight="fill" className="h-3 w-3" />
                            )
                          ) : (
                            <ArrowsDownUp weight="light" className="h-3 w-3 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center text-sm text-text-muted">
                    {emptyMessage || 'No items found'}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      'border-b border-white/[0.03] last:border-b-0 transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-white/[0.02]'
                    )}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-6 py-4", col.className)}>
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
