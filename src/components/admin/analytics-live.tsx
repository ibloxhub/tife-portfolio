'use client'

import { Eye, CursorClick, EnvelopeOpen, ChartBar, ArrowUp, ArrowDown, Minus } from '@phosphor-icons/react'
import { AnalyticsCharts } from '@/components/admin/analytics-charts'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { useAnalyticsRealtime } from '@/hooks/use-analytics-realtime'
import { cn } from '@/lib/utils'

interface AnalyticsTrend {
  today: number
  yesterday: number
  trendPercent: number
}

interface AnalyticsLiveProps {
  initialStats: {
    totalEvents: number
    pageViews: number
    portfolioViews: number
    serviceClicks: number
    contactSubmissions: number
    ctaClicks: number
  } | null
  initialTrends: {
    pageViews: AnalyticsTrend
    portfolioViews: AnalyticsTrend
    serviceClicks: AnalyticsTrend
    contactSubmissions: AnalyticsTrend
    totalEvents: AnalyticsTrend
  } | null
  dailyData: { date: string; views: number; clicks: number; contacts: number }[]
  portfolioChartData: { name: string; views: number }[]
  breakdownData: { name: string; value: number; color: string }[]
}

// ── Connection Status Badge ────────────────────────────────────────────────────
function ConnectionBadge({ status }: { status: 'live' | 'polling' | 'disconnected' }) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all duration-500',
      status === 'live'
        ? 'bg-green-500/10 border-green-500/20 text-green-400'
        : status === 'polling'
        ? 'bg-white/5 border-white/10 text-white/40'
        : 'bg-red-500/10 border-red-500/20 text-red-400'
    )}>
      {/* Status dot */}
      <span className="relative flex h-2 w-2">
        {status === 'live' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        )}
        <span className={cn(
          'relative inline-flex rounded-full h-2 w-2',
          status === 'live' ? 'bg-green-400'
          : status === 'polling' ? 'bg-white/30'
          : 'bg-red-400'
        )} />
      </span>
      {status === 'live' ? 'Live' : status === 'polling' ? 'Polling (10s)' : 'Disconnected'}
    </div>
  )
}

// ── Trend badge helper ────────────────────────────────────────────────────────
function buildTrend(trendData: AnalyticsTrend | undefined) {
  if (!trendData) return undefined
  const { trendPercent } = trendData
  const direction = trendPercent > 0 ? 'up' : trendPercent < 0 ? 'down' : 'neutral'
  const prefix = trendPercent > 0 ? '+' : ''
  return {
    value: `${prefix}${trendPercent}% vs yesterday`,
    direction,
  } as { value: string; direction: 'up' | 'down' | 'neutral' }
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AnalyticsLive({
  initialStats,
  initialTrends,
  dailyData,
  portfolioChartData,
  breakdownData,
}: AnalyticsLiveProps) {
  const { stats, trends, connectionStatus } = useAnalyticsRealtime({
    initialStats,
    initialTrends,
  })

  const s = stats ?? initialStats
  const t = trends ?? initialTrends

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight">Analytics</h1>
          <p className="text-text-secondary text-sm">Track how your portfolio is performing.</p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionBadge status={connectionStatus} />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Events"
          value={(s?.totalEvents ?? 0).toLocaleString()}
          icon={ChartBar}
          trend={buildTrend(t?.totalEvents)}
        />
        <AdminStatCard
          title="Page Views"
          value={(s?.pageViews ?? 0).toLocaleString()}
          icon={Eye}
          trend={buildTrend(t?.pageViews)}
        />
        <AdminStatCard
          title="Service Clicks"
          value={(s?.serviceClicks ?? 0).toLocaleString()}
          icon={CursorClick}
          trend={buildTrend(t?.serviceClicks)}
        />
        <AdminStatCard
          title="Submissions"
          value={(s?.contactSubmissions ?? 0).toLocaleString()}
          icon={EnvelopeOpen}
          trend={buildTrend(t?.contactSubmissions)}
        />
      </div>

      {/* Charts */}
      <AnalyticsCharts
        dailyData={dailyData}
        portfolioChartData={portfolioChartData}
        breakdownData={breakdownData}
      />
    </div>
  )
}
