'use client'

import { useRouter } from 'next/navigation'
import { useRealtime } from '@/hooks/use-realtime'

interface RealtimeRefresherProps {
  table: string
}

/**
 * A client-side component that listens to real-time changes on a database table
 * and triggers router.refresh() to fetch fresh Server Component data.
 */
export function RealtimeRefresher({ table }: RealtimeRefresherProps) {
  const router = useRouter()
  useRealtime(table, () => {
    router.refresh()
  })
  return null
}
