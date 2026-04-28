'use client'

import { List, Bell, Envelope } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  
  const pathSegments = pathname.split('/').filter(Boolean)
  const currentPage = pathSegments[pathSegments.length - 1]
  const pageTitle = currentPage ? currentPage.charAt(0).toUpperCase() + currentPage.slice(1) : 'Dashboard'

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch unread data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch unread count and last 5 unread messages
        const res = await fetch('/api/contact?status=new&limit=5', { cache: 'no-store' })
        const json = await res.json()
        if (json.success) {
          setUnreadCount(json.count ?? 0)
          setRecentMessages(json.data ?? [])
        }
      } catch {
        // Silently fail
      }
    }
    fetchData()
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-white/5 bg-[#050505]/40 px-4 backdrop-blur-2xl md:px-8">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          onClick={onMenuClick}
        >
          <List className="h-5 w-5" />
        </button>
        <div className="h-4 w-px bg-white/10 md:hidden" />
        
        <div className="flex flex-col">
          <h1 className="text-xs font-bold text-white tracking-[0.2em] uppercase">{pageTitle}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-1 w-1 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(200,169,126,0.6)]" />
            <span className="text-[10px] font-bold text-gold-light/40 uppercase tracking-[0.2em]">Live Session</span>
          </div>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-4 relative" ref={popoverRef}>
        <button 
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className={cn(
            "relative h-8 w-8 rounded-full flex items-center justify-center transition-colors",
            isPopoverOpen ? "bg-white/10 text-white" : "text-text-secondary hover:text-white hover:bg-white/5"
          )}
        >
          <Bell weight={unreadCount > 0 ? 'fill' : 'light'} className={cn("h-5 w-5", unreadCount > 0 && "text-gold")} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(200,169,126,0.8)]" />
          )}
        </button>

        {/* Notifications Popover */}
        {isPopoverOpen && (
          <div className="absolute top-full right-0 mt-4 w-80 rounded-[2rem] bg-[#050505]/80 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.03]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Terminal Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-gold/10 text-gold-light px-2.5 py-1 rounded-full border border-gold/20">
                  {unreadCount} NEW
                </span>
              )}
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {recentMessages.length > 0 ? (
                recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    href="/admin/messages"
                    onClick={() => setIsPopoverOpen(false)}
                    className="flex items-start gap-3 p-4 hover:bg-white/[0.02] border-b border-white/[0.03] transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                      <Envelope weight="light" className="h-4 w-4 text-gold-light" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-gold-light transition-colors">{msg.name}</p>
                      <p className="text-xs text-text-muted line-clamp-1">{msg.message}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-xs text-text-muted">No new notifications</p>
                </div>
              )}
            </div>

            <Link
              href="/admin/messages"
              onClick={() => setIsPopoverOpen(false)}
              className="block p-3 text-center text-[11px] font-medium text-gold hover:text-gold-light hover:bg-white/5 transition-all"
            >
              View All Messages
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
