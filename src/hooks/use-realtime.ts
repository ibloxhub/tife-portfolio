'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * useRealtime — subscribes to INSERT/UPDATE/DELETE events on a Supabase table.
 * Calls `onUpdate` with the event payload whenever any change occurs.
 * Automatically cleans up the subscription on unmount.
 */
export function useRealtime(table: string, onUpdate: (payload: any) => void) {
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate
  const [status, setStatus] = useState<string>('INITIAL')

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          console.log(`[Realtime] Event received for ${table}:`, payload)
          onUpdateRef.current(payload)
        }
      )
      .subscribe((subStatus) => {
        console.log(`[Realtime] Subscription status for ${table}:`, subStatus)
        setStatus(subStatus)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table])

  return status
}
