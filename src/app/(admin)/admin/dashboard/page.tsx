import { CaretRight, Plus, Envelope, GearSix, Eye, EnvelopeOpen, Image as ImageIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { AdminStatCard } from '@/components/admin/admin-stat-card'
import { AdminCard } from '@/components/admin/admin-card'
import { AdminBadge } from '@/components/admin/admin-badge'
import { getRecentContacts, getUnreadContactCount } from '@/lib/services/contacts.service'
import { getAllPortfolios } from '@/lib/services/portfolio.service'
import { getAnalyticsOverview } from '@/lib/services/events.service'

export default async function DashboardPage() {
  // Fetch real data in parallel
  const [recentContactsResult, unreadCountResult, portfoliosResult, analyticsResult] = await Promise.all([
    getRecentContacts(5),
    getUnreadContactCount(),
    getAllPortfolios({ isPublished: true }),
    getAnalyticsOverview(),
  ])

  const recentContacts = recentContactsResult.data ?? []
  const unreadCount = unreadCountResult.data ?? 0
  const publishedCount = portfoliosResult.count ?? 0
  const analytics = analyticsResult.data

  // Calculate total portfolio views
  const totalViews = analytics?.portfolioViews ?? 0
  const totalPageViews = analytics?.pageViews ?? 0

  // Generate initials from name
  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Format relative time
  function timeAgo(dateStr: string) {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      
      {/* Welcome Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(200,169,126,0.6)]" />
          <span className="text-xs font-bold tracking-[0.3em] text-gold-light/40 uppercase">System Active</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#C8A97E] via-[#F4D03F] to-[#C8A97E]">Tife.</span>
        </h1>
        <p className="text-text-secondary text-base font-light">The terminal is ready. Here&apos;s your portfolio overview.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard
          title="Terminal Views"
          value={totalPageViews.toLocaleString()}
          subtitle="All time traffic"
          icon={Eye}
        />
        <AdminStatCard
          title="New Inquiries"
          value={unreadCount}
          subtitle="Awaiting response"
          icon={EnvelopeOpen}
        />
        <AdminStatCard
          title="Active Projects"
          value={publishedCount}
          subtitle="Live on site"
          icon={ImageIcon}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/portfolio"
          className="relative flex items-center gap-4 rounded-3xl bg-white/[0.03] p-5 border border-white/[0.08] hover:border-gold/30 hover:bg-white/[0.05] transition-all group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
          <div className="relative z-10 h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 shadow-[0_0_15px_rgba(200,169,126,0.1)]">
            <Plus weight="bold" className="h-6 w-6 text-gold" />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide group-hover:text-gold transition-colors">Add Project</span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">New Gallery</span>
          </div>
        </Link>
        <Link
          href="/admin/messages"
          className="relative flex items-center gap-4 rounded-3xl bg-white/[0.03] p-5 border border-white/[0.08] hover:border-gold/30 hover:bg-white/[0.05] transition-all group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
          <div className="relative z-10 h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 shadow-[0_0_15px_rgba(200,169,126,0.1)]">
            <Envelope weight="bold" className="h-6 w-6 text-gold" />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide group-hover:text-gold transition-colors">View Messages</span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{unreadCount} UNREAD</span>
          </div>
        </Link>
        <Link
          href="/admin/settings"
          className="relative flex items-center gap-4 rounded-3xl bg-white/[0.03] p-5 border border-white/[0.08] hover:border-gold/30 hover:bg-white/[0.05] transition-all group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
          <div className="relative z-10 h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 shadow-[0_0_15px_rgba(200,169,126,0.1)]">
            <GearSix weight="bold" className="h-6 w-6 text-gold" />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide group-hover:text-gold transition-colors">Site Settings</span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Core Config</span>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Recent Inquiries</h2>
          <Link href="/admin/messages" className="text-xs text-gold-light hover:text-gold transition-colors">
            View all →
          </Link>
        </div>
        
        <AdminCard padding="sm">
          {recentContacts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-text-muted">No inquiries yet. They&apos;ll appear here when visitors submit the contact form.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  href="/admin/messages"
                  className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-2xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary shrink-0">
                      <span className="text-xs font-medium">{getInitials(contact.name)}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white group-hover:text-gold transition-colors truncate">
                          {contact.name}
                        </span>
                        <AdminBadge variant="status" status={contact.status}>
                          {contact.status}
                        </AdminBadge>
                      </div>
                      <span className="text-xs text-text-muted truncate">
                        {contact.service_name
                          ? `Inquired about ${contact.service_name}`
                          : 'General inquiry'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-text-muted hidden md:block">{timeAgo(contact.created_at)}</span>
                    <CaretRight weight="light" className="h-4 w-4 text-text-secondary group-hover:text-gold transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

    </div>
  )
}
