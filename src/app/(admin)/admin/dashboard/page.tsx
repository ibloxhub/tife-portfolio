import { ArrowUpRight, CaretRight } from '@phosphor-icons/react/dist/ssr'

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
          <span className="text-xs font-medium tracking-widest text-gold-light uppercase">System Online</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight">Welcome back, Tife.</h1>
        <p className="text-text-secondary text-sm">Here's what's happening with your portfolio today.</p>
      </div>

      {/* Quick Stats Grid (Placeholder for Phase 7) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Stat Card 1 */}
        <div className="rounded-[1.5rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-sm">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-surface p-6 flex flex-col gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-xs font-medium tracking-widest uppercase">Total Views</span>
              <ArrowUpRight weight="light" className="h-4 w-4 text-green-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-medium text-white">12,450</span>
              <span className="text-sm text-green-400 mb-1">+14%</span>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="rounded-[1.5rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-sm">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-surface p-6 flex flex-col gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-xs font-medium tracking-widest uppercase">New Inquiries</span>
              <div className="h-4 w-4 rounded-full bg-gold/20 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-gold" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-medium text-white">3</span>
              <span className="text-sm text-text-muted mb-1">Unread</span>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="rounded-[1.5rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-sm">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-surface p-6 flex flex-col gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-xs font-medium tracking-widest uppercase">Active Projects</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-medium text-white">8</span>
              <span className="text-sm text-text-muted mb-1">Published</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-lg font-medium text-white">Recent Activity</h2>
        
        <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-sm">
          <div className="rounded-[calc(2rem-0.375rem)] bg-surface p-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            
            {/* Activity Item 1 */}
            <div className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-2xl transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary">
                  <span className="text-xs font-medium">JD</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white group-hover:text-gold transition-colors">John Doe</span>
                  <span className="text-xs text-text-muted">Inquired about Wedding Cinematography</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted hidden md:block">2 hours ago</span>
                <CaretRight weight="light" className="h-4 w-4 text-text-secondary group-hover:text-gold transition-colors" />
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-2xl transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary">
                  <span className="text-xs font-medium">SA</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white group-hover:text-gold transition-colors">Sarah Allen</span>
                  <span className="text-xs text-text-muted">Inquired about Editorial Photography</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted hidden md:block">5 hours ago</span>
                <CaretRight weight="light" className="h-4 w-4 text-text-secondary group-hover:text-gold transition-colors" />
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
