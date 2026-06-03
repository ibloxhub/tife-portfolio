'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * useRealtime — subscribes to INSERT/UPDATE/DELETE events on a Supabase table.
 * Calls `onUpdate` whenever any change occurs.
 * Automatically cleans up the subscription on unmount.
 */
export function useRealtime(table: string, onUpdate: () => void) {
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => { onUpdateRef.current() }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table])
}
