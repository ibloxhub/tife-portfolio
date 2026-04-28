'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { AdminCard } from '@/components/admin/admin-card'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { ChartBar } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AnalyticsChartsProps {
  dailyData: { date: string; views: number; clicks: number; contacts: number }[]
  portfolioChartData: { name: string; views: number }[]
  breakdownData: { name: string; value: number; color: string }[]
}

type DateRange = '7d' | '30d' | '90d' | 'custom'

export function AnalyticsCharts({ dailyData, portfolioChartData, breakdownData }: AnalyticsChartsProps) {
  const [range, setRange] = useState<DateRange>('30d')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  // Slice daily data based on range
  let filteredDaily = dailyData
  if (range === '7d') {
    filteredDaily = dailyData.slice(-7)
  } else if (range === '30d') {
    filteredDaily = dailyData.slice(-30)
  } else if (range === 'custom' && customStart && customEnd) {
    filteredDaily = dailyData.filter((d) => d.date >= customStart && d.date <= customEnd)
  }

  const hasData = dailyData.some((d) => d.views > 0 || d.clicks > 0 || d.contacts > 0)

  // Custom tooltip
  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-xl bg-charcoal p-3 ring-1 ring-white/10 shadow-xl text-xs">
        <p className="text-text-muted mb-1.5">{new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-text-secondary capitalize">{p.dataKey}:</span>
            <span className="text-white font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (!hasData && portfolioChartData.every((p) => p.views === 0)) {
    return (
      <AdminEmptyState
        icon={ChartBar}
        title="No analytics data yet"
        description="Events will appear here as visitors interact with your website."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Date Range Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 p-0.5">
          {(['7d', '30d', '90d', 'custom'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'h-9 px-3 rounded-lg text-xs font-medium transition-colors',
                range === r ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'
              )}
            >
              {r === 'custom' ? 'Custom' : `Last ${r.replace('d', ' Days')}`}
            </button>
          ))}
        </div>

        {/* Custom Date Picker */}
        {range === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold [color-scheme:dark]"
            />
            <span className="text-text-muted text-xs">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold [color-scheme:dark]"
            />
          </div>
        )}
      </div>

      {/* Area Chart — Events Over Time */}
      <AdminCard>
        <h3 className="text-sm font-medium text-white mb-6">Traffic Over Time</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredDaily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8A97E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C8A97E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#A78BFA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#555' }}
                tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                interval={Math.max(Math.floor(filteredDaily.length / 6), 1)}
                axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#555' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="views" stroke="#C8A97E" fill="url(#colorViews)" strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" stroke="#A78BFA" fill="url(#colorClicks)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="text-[11px] text-text-muted">Views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            <span className="text-[11px] text-text-muted">Clicks</span>
          </div>
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart — Top Projects */}
        {portfolioChartData.length > 0 && (
          <AdminCard>
            <h3 className="text-sm font-medium text-white mb-6">Top Projects by Views</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portfolioChartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#888' }}
                    width={120}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="views" fill="#C8A97E" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AdminCard>
        )}

        {/* Pie Chart — Event Breakdown */}
        {breakdownData.length > 0 && (
          <AdminCard>
            <h3 className="text-sm font-medium text-white mb-6">Events Breakdown</h3>
            <div className="h-[260px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A0A0A',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {breakdownData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[11px] text-text-muted">{entry.name}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        )}
      </div>
    </div>
  )
}
