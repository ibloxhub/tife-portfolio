'use client'

import { useState, useEffect, useRef } from 'react'
import { useRealtime } from './use-realtime'

export function useRealtimeData<T extends { id: string }>(
  table: string,
  apiUrl: string,
  initialData: T[],
  options?: {
    onInsert?: (newItem: T) => void
    onUpdate?: (updatedItem: T) => void
    onDelete?: (deletedId: string) => void
  }
) {
  const [data, setData] = useState<T[]>(initialData)
  const optionsRef = useRef(options)
  optionsRef.current = options

  // Sync with initialData changes from Server Component
  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const refetch = async () => {
    try {
      const res = await fetch(apiUrl)
      if (res.ok) {
        const result = await res.json()
        if (result.success && Array.isArray(result.data)) {
          setData(result.data)
        }
      }
    } catch (err) {
      console.error(`[RealtimeData] Refetch failed for ${table}:`, err)
    }
  }

  // Subscribe to real-time events
  useRealtime(table, (payload) => {
    const { eventType, new: newRow, old: oldRow } = payload
    console.log(`[RealtimeData] Event '${eventType}' received for ${table}`)

    if (eventType === 'INSERT') {
      if (optionsRef.current?.onInsert) {
        optionsRef.current.onInsert(newRow as T)
      } else {
        refetch()
      }
    } else if (eventType === 'UPDATE') {
      if (optionsRef.current?.onUpdate) {
        optionsRef.current.onUpdate(newRow as T)
      } else {
        refetch()
      }
    } else if (eventType === 'DELETE') {
      const id = oldRow?.id || oldRow?.row_id || oldRow?.entity_id
      if (optionsRef.current?.onDelete && id) {
        optionsRef.current.onDelete(id)
      } else {
        refetch()
      }
    }
  })

  // Fallback polling every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`[RealtimeData] Polling fallback triggered for ${table}`)
      refetch()
    }, 8000)

    return () => clearInterval(interval)
  }, [apiUrl, table])

  return [data, setData] as const
}
