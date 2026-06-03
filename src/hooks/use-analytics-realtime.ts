'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type ConnectionStatus = 'live' | 'polling' | 'disconnected'

interface AnalyticsStats {
  totalEvents: number
  pageViews: number
  portfolioViews: number
  serviceClicks: number
  contactSubmissions: number
  ctaClicks: number
}

interface TrendData {
  today: number
  yesterday: number
  trendPercent: number
}

interface AnalyticsTrends {
  pageViews: TrendData
  portfolioViews: TrendData
  serviceClicks: TrendData
  contactSubmissions: TrendData
  totalEvents: TrendData
}

interface UseAnalyticsRealtimeOptions {
  initialStats: AnalyticsStats | null
  initialTrends: AnalyticsTrends | null
  refreshIntervalMs?: number
}

/**
 * Subscribes to live analytics via Supabase Realtime.
 * Falls back to polling every `refreshIntervalMs` (default 10s) if Realtime drops.
 */
export function useAnalyticsRealtime({
  initialStats,
  initialTrends,
  refreshIntervalMs = 10_000,
}: UseAnalyticsRealtimeOptions) {
  const [stats, setStats] = useState<AnalyticsStats | null>(initialStats)
  const [trends, setTrends] = useState<AnalyticsTrends | null>(initialTrends)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('polling')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const realtimeConnected = useRef(false)

  // ── Fetch fresh data from the API ──────────────────────────────────────────
  const refresh = useCallback(async () => {
    try {
      const [statsRes, trendsRes] = await Promise.all([
        fetch('/api/analytics/overview', { cache: 'no-store' }),
        fetch('/api/analytics/trends', { cache: 'no-store' }),
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
      if (trendsRes.ok) {
        const data = await trendsRes.json()
        setTrends(data)
      }
    } catch {
      // Silently fail — stale data shown
    }
  }, [])

  // ── Start polling fallback ─────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(refresh, refreshIntervalMs)
  }, [refresh, refreshIntervalMs])

  // ── Realtime subscription ──────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('analytics:events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        () => { refresh() }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          realtimeConnected.current = true
          setConnectionStatus('live')
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          realtimeConnected.current = false
          setConnectionStatus('polling')
        }
      })

    // Always start 10s polling as a safety net regardless of realtime status
    startPolling()

    return () => {
      supabase.removeChannel(channel)
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [refresh, startPolling])

  return { stats, trends, connectionStatus }
}
