import { getAnalyticsOverview, getEvents } from '@/lib/services/events.service'
import { getAllPortfolios } from '@/lib/services/portfolio.service'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { AnalyticsCharts } from '@/components/admin/analytics-charts'
import { Eye, CursorClick, EnvelopeOpen, ChartBar } from '@phosphor-icons/react/dist/ssr'

export default async function AnalyticsPage() {
  const [overviewResult, eventsResult, portfoliosResult] = await Promise.all([
    getAnalyticsOverview(),
    getEvents(undefined, 500),
    getAllPortfolios(undefined, { page: 1, limit: 50, sortBy: 'view_count', sortOrder: 'desc' }),
  ])

  const overview = overviewResult.data
  const events = eventsResult.data ?? []
  const portfolios = (portfoliosResult.data ?? []).slice(0, 10)

  // Build daily event counts for the chart (last 90 days)
  const now = new Date()
  const dailyData: { date: string; views: number; clicks: number; contacts: number }[] = []

  for (let i = 89; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayEvents = events.filter((e) => e.created_at.startsWith(dateStr))
    dailyData.push({
      date: dateStr,
      views: dayEvents.filter((e) => e.event_type === 'page_view' || e.event_type === 'portfolio_view').length,
      clicks: dayEvents.filter((e) => e.event_type === 'service_click' || e.event_type === 'cta_click').length,
      contacts: dayEvents.filter((e) => e.event_type === 'contact_submit').length,
    })
  }

  // Portfolio view data for bar chart
  const portfolioChartData = portfolios.map((p) => ({
    name: p.title.length > 20 ? p.title.slice(0, 20) + '...' : p.title,
    views: p.view_count,
  }))

  // Event type breakdown for pie
  const breakdownData = [
    { name: 'Page Views', value: overview?.pageViews ?? 0, color: '#C8A97E' },
    { name: 'Portfolio Views', value: overview?.portfolioViews ?? 0, color: '#60A5FA' },
    { name: 'Service Clicks', value: overview?.serviceClicks ?? 0, color: '#A78BFA' },
    { name: 'Contact Submissions', value: overview?.contactSubmissions ?? 0, color: '#34D399' },
    { name: 'CTA Clicks', value: overview?.ctaClicks ?? 0, color: '#F472B6' },
  ].filter((d) => d.value > 0)

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight">Analytics</h1>
        <p className="text-text-secondary text-sm">Track how your portfolio is performing.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Events"
          value={(overview?.totalEvents ?? 0).toLocaleString()}
          icon={ChartBar}
        />
        <AdminStatCard
          title="Page Views"
          value={(overview?.pageViews ?? 0).toLocaleString()}
          icon={Eye}
        />
        <AdminStatCard
          title="Service Clicks"
          value={(overview?.serviceClicks ?? 0).toLocaleString()}
          icon={CursorClick}
        />
        <AdminStatCard
          title="Submissions"
          value={(overview?.contactSubmissions ?? 0).toLocaleString()}
          icon={EnvelopeOpen}
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
