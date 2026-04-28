'use client'

import { 
  House, 
  Image as ImageIcon, 
  Briefcase, 
  ChartBar, 
  Envelope, 
  Gear,
  SignOut,
  X
} from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logout } from '@/app/(auth)/admin/login/actions'
import { cn } from '@/lib/utils'

const navItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: House },
  { title: 'Portfolio', url: '/admin/portfolio', icon: ImageIcon },
  { title: 'Services', url: '/admin/services', icon: Briefcase },
  { title: 'Analytics', url: '/admin/analytics', icon: ChartBar },
  { title: 'Messages', url: '/admin/messages', icon: Envelope, hasBadge: true },
  { title: 'Settings', url: '/admin/settings', icon: Gear },
]

export function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState<number | null>(null)

  // Fetch unread count on mount and when pathname changes (after marking as read)
  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch('/api/contact?status=new&limit=0', { cache: 'no-store' })
        const json = await res.json()
        if (json.success && typeof json.count === 'number') {
          setUnreadCount(json.count)
        }
      } catch {
        // Silently fail — badge is non-critical
      }
    }
    fetchUnread()
  }, [pathname])

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-[70] w-64 transform flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-2xl transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_rgba(200,169,126,0.6)]" />
          <span className="text-xs font-bold tracking-[0.2em] text-gold-light uppercase">Terminal</span>
        </div>
        <button 
          className="md:hidden text-text-secondary hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-8 flex flex-col gap-2 px-3">
        <span className="text-white/30 text-[9px] font-bold tracking-[0.3em] uppercase mb-3 px-4">Core Systems</span>
        
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.url)
          const badgeValue = item.hasBadge ? unreadCount : null
          return (
            <Link 
              key={item.title}
              href={item.url}
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center justify-between h-11 rounded-xl px-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isActive 
                  ? 'bg-white/5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                  : 'text-text-secondary hover:bg-white/[0.03] hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon 
                  weight={isActive ? 'fill' : 'light'} 
                  className={cn(
                    "h-5 w-5 transition-colors duration-500",
                    isActive ? "text-gold" : "group-hover:text-gold/70"
                  )} 
                />
                <span className={cn(
                  "font-medium text-sm transition-all duration-500",
                  isActive ? "tracking-wide" : ""
                )}>{item.title}</span>
              </div>
              {badgeValue !== null && badgeValue > 0 && (
                <span className="bg-gold/10 text-gold-light rounded-full text-[10px] px-2 py-0.5 border border-gold/20 font-bold">
                  {badgeValue}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="p-4 mt-auto">
        <div className="rounded-[1.5rem] bg-white/[0.03] p-1 border border-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between rounded-[calc(1.5rem-0.25rem)] bg-black/40 p-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold to-gold-light/50 flex items-center justify-center border border-white/10 shadow-[0_0_10px_rgba(200,169,126,0.3)]">
                <span className="text-[10px] font-bold text-black uppercase">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white tracking-tight">Tife.</span>
                <span className="text-[9px] font-bold text-gold-light/50 uppercase tracking-widest">Admin</span>
              </div>
            </div>
            
            <form action={logout}>
              <button 
                type="submit"
                className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                title="Log out"
              >
                <SignOut weight="light" className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  )
}
