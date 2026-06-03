import { getAnalyticsOverview, getEvents, getAnalyticsTrends } from '@/lib/services/events.service'
import { getAllPortfolios } from '@/lib/services/portfolio.service'
import { AnalyticsLive } from '@/components/admin/analytics-live'

export default async function AnalyticsPage() {
  const [overviewResult, eventsResult, portfoliosResult, trendsResult] = await Promise.all([
    getAnalyticsOverview(),
    getEvents(undefined, 500),
    getAllPortfolios(undefined, { page: 1, limit: 50, sortBy: 'view_count', sortOrder: 'desc' }),
    getAnalyticsTrends(),
  ])

  const overview = overviewResult.data
  const events = eventsResult.data ?? []
  const portfolios = (portfoliosResult.data ?? []).slice(0, 10)
  const trends = trendsResult.data ?? null

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
    <AnalyticsLive
      initialStats={overview}
      initialTrends={trends}
      dailyData={dailyData}
      portfolioChartData={portfolioChartData}
      breakdownData={breakdownData}
    />
  )
}
